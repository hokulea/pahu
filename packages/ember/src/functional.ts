import { modifier } from 'ember-modifier';
import { cell } from 'ember-resources';

import { createForm as upstreamCreateForm } from '@hokulea/pahu';

import { localCopy } from './-local-copy';

import type { AttrValue } from '@glint/template';
import type {
  FieldAPI as UpstreamFieldAPI,
  FieldConfig,
  FieldElement,
  FieldNames,
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

interface InternalForm<DATA extends UserData = UserData> {
  getField(
    name: FieldNames<DATA> | (string & {})
  ):
    | FieldAPI<
        DATA,
        FieldNames<DATA> | (string & {}),
        keyof DATA & string extends keyof DATA ? DATA[keyof DATA & string] : unknown
      >
    | undefined;
}

export function createForm<DATA extends UserData = UserData>(
  config: FormConfig<DATA> = {}
): FormAPI<DATA> {
  const form = upstreamCreateForm({
    ...config,
    subtle: { makeSignal: signalFactory, makeLocalCopy: localCopy }
  }) as unknown as FormAPI<DATA>;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { createField } = form;

  form.registerElement = modifier<RegisterFormSignature>((element) => {
    form.subtle.registerElement(element);
  });

  form.createField = <
    NAME extends string,
    VALUE = NAME extends keyof DATA ? DATA[NAME] : AttrValue
  >(
    fieldConfig: FieldConfig<DATA, NAME, VALUE>
  ): FieldAPI<DATA, NAME, VALUE> => {
    const foundField = (form as unknown as InternalForm<DATA>).getField(fieldConfig.name);

    if (foundField) {
      return foundField as unknown as FieldAPI<DATA, NAME, VALUE>;
    }

    const field = createField(fieldConfig) as unknown as FieldAPI<DATA, NAME, VALUE>;

    // const
    const elements = new WeakSet<HTMLElement>();
    const ignoreRemoval = new WeakSet<HTMLElement>();

    field.registerElement = modifier<RegisterFieldSignature>((element) => {
      field.subtle.registerElement(element);

      if (elements.has(element)) {
        ignoreRemoval.add(element);
      } else {
        elements.add(element);
      }

      return () => {
        if (ignoreRemoval.has(element)) {
          ignoreRemoval.delete(element);
        } else {
          field.subtle.unregisterElement(element);
          elements.delete(element);
        }
      };
    });

    return field;
  };

  return form;
}
