import { tracked } from '@glimmer/tracking';

class Meta<Value> {
  prevRemote?: Value;
  // peek?: () => Value;
  @tracked value: Value | undefined;
}

function getOrCreateMeta<Value>(
  instance: WeakKey,
  metas: WeakMap<WeakKey, Meta<Value>>,
  initializer?: Value
) {
  let meta = metas.get(instance);

  if (meta === undefined) {
    meta = new Meta<Value>();
    metas.set(instance, meta);

    meta.value = initializer;
  }

  return meta;
}

export function localCopy<Value = unknown>(memoFn: () => Value) {
  const metas = new WeakMap<WeakKey, Meta<Value>>();

  return {
    get(this: WeakKey): Value {
      const meta = getOrCreateMeta<Value>(this, metas);
      const { prevRemote } = meta;

      const incomingValue = memoFn();

      if (prevRemote !== incomingValue) {
        // If the incoming value is not the same as the previous incoming value,
        // update the local value to match the new incoming value, and update
        // the previous incoming value.
        meta.prevRemote = incomingValue;
        meta.value = incomingValue;
      }

      return meta.value as Value;
    },

    set(this: WeakKey, value: Value) {
      if (!metas.has(this)) {
        const meta = getOrCreateMeta(this, metas);

        meta.prevRemote = memoFn();
        meta.value = value;

        return;
      }

      getOrCreateMeta(this, metas).value = value;
    }
  };
}
