import { modifier } from 'ember-modifier';
import { cell } from 'ember-resources';

import { createForm as upstreamCreateForm } from '@hokulea/pahu';

import type { AttrValue } from '@glint/template';
import type {
  FieldAPI as UpstreamFieldAPI,
  FieldConfig,
  FieldElement,
  FieldValue,
  FormAPI as UpstreamFormAPI,
  FormConfig,
  SignalFactory,
  UserData
} from '@hokulea/pahu';
import type { FunctionBasedModifier } from 'ember-modifier';

export type {
  FieldConfig,
  FieldNames,
  FieldValidationHandler,
  FieldValue,
  FormConfig,
  FormValidationHandler,
  Issue,
  SubmitHandler,
  UserData,
  ValidatedHandler,
  ValidationMode,
  ValidationResult
} from '@hokulea/pahu';

interface RegisterFormSignature {
  Element: HTMLFormElement;
  Args: {
    Positional: [];
    Named: object;
  };
}

interface RegisterFieldSignature {
  Element: FieldElement;
  Args: {
    Positional: [];
    Named: object;
  };
}

export interface FieldAPI<DATA extends UserData, NAME extends string, VALUE>
  extends UpstreamFieldAPI<DATA, NAME, VALUE> {
  value: Exclude<FieldValue<DATA, NAME, VALUE>, 'unknown'>;
  registerElement: FunctionBasedModifier<RegisterFieldSignature>;
}

export interface FormAPI<DATA extends UserData = UserData> extends UpstreamFormAPI<DATA> {
  registerElement: FunctionBasedModifier<RegisterFormSignature>;

  createField<NAME extends string, VALUE = NAME extends keyof DATA ? DATA[NAME] : AttrValue>(
    config: FieldConfig<DATA, NAME, VALUE>
  ): FieldAPI<DATA, NAME, VALUE>;
}

const signalFactory: SignalFactory = <T>(t?: T) => {
  const reactive = cell(t);

  return {
    get(): T {
      return reactive.current;
    },

    set(val: T) {
      reactive.set(val);
    }
  };
};

const formsCache = new WeakMap();

export function createForm<DATA extends UserData = UserData>(
  config: FormConfig<DATA> = {}
): FormAPI<DATA> {
  let form = formsCache.get(config) as FormAPI<DATA> | undefined;

  if (form) {
    form.updateConfig(config);
  } else {
    form = upstreamCreateForm({
      ...config,
      subtle: { makeSignal: signalFactory }
    }) as unknown as FormAPI<DATA>;

    const fieldCache = new Map();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { createField } = form;

    form.registerElement = modifier<RegisterFormSignature>((element) => {
      form?.subtle.registerElement(element);
    });

    form.createField = <
      NAME extends string,
      VALUE = NAME extends keyof DATA ? DATA[NAME] : AttrValue
    >(
      fieldConfig: FieldConfig<DATA, NAME, VALUE>
    ): FieldAPI<DATA, NAME, VALUE> => {
      let field = fieldCache.get(fieldConfig.name) as FieldAPI<DATA, NAME, VALUE> | undefined;

      // this is the "inner function" of `createForm()`. When create form is
      // invalidated, so are all `createField` invocations. As such, the
      // `fieldConfig` (even value equal) is a new instance in memory and such
      // can't be used as key for a WeakMap.
      //
      // The idea is to cache by field name. Ideally the error when using a
      // field name twice from pahu core is thrown higher from here. Using the
      // field name as cache silences this error.
      //
      // However, ember is striking at you in a different way here. By reusing a
      // field twice, you read and write to the same tracked value twice and
      // that ember doesn't like, so you get the infamous "You attempted to
      // update 'value' on Meta, but it had already been used previously in the
      // same computation" error, hah!
      // Though this is only happening if you are setting a value, so it's not
      // reliable. Given that is an unwanted case anyway, it's ok to not have it
      // handled for now.

      if (field) {
        field.updateConfig(fieldConfig);
      } else {
        field = createField(fieldConfig) as unknown as FieldAPI<DATA, NAME, VALUE>;

        // const
        const elements = new WeakSet<HTMLElement>();
        const ignoreRemoval = new WeakSet<HTMLElement>();

        field.registerElement = modifier<RegisterFieldSignature>((element) => {
          field?.subtle.registerElement(element);

          if (elements.has(element)) {
            ignoreRemoval.add(element);
          } else {
            elements.add(element);
          }

          return () => {
            if (ignoreRemoval.has(element)) {
              ignoreRemoval.delete(element);
            } else {
              field?.subtle.unregisterElement(element);
              elements.delete(element);
            }
          };
        });

        fieldCache.set(fieldConfig.name, field);
      }

      return field;
    };

    formsCache.set(config, form);
  }

  return form;
}
