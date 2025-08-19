import { modifier } from 'ember-modifier';
import { cell } from 'ember-resources';

import { createForm as upstreamCreateForm } from './form';

import type { SignalFactory } from './-utils';
import type { FieldElement, UserData } from './definitions';
import type { FieldAPI as UpstreamFieldAPI, FieldConfig, FieldValue } from './field';
import type { FormAPI as UpstreamFormAPI, FormConfig } from './form';
import type { AttrValue } from '@glint/template';
import type { FunctionBasedModifier } from 'ember-modifier';

export type {
  FieldNames,
  Issue,
  UserData,
  ValidatedHandler,
  ValidationMode,
  ValidationResult
} from './definitions';
export type { FieldConfig, FieldValidationHandler, FieldValue } from './field';
export type { FormConfig, FormValidateHandler, SubmitHandler } from './form';

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

export function createForm<DATA extends UserData = UserData>(
  config: FormConfig<DATA> = {}
): FormAPI<DATA> {
  const form = upstreamCreateForm({
    ...config,
    subtle: { signalFactory }
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
    const field = createField(fieldConfig) as unknown as FieldAPI<DATA, NAME, VALUE>;

    field.registerElement = modifier<RegisterFieldSignature>((element) => {
      field.subtle.registerElement(element);

      return () => {
        field.subtle.unregisterElement(element);
      };
    });

    return field;
  };

  return form;
}
