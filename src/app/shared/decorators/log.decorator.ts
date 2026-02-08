// src/app/shared/decorators/log.decorator.ts
export function Log(label?: string) {
  // decorator factory -> returns the actual method decorator
  return function (
    _target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    if (typeof original !== 'function') {
      return descriptor;
    }

    descriptor.value = function (...args: any[]) {
      const name = label ? `${String(propertyKey)} (${label})` : String(propertyKey);
      // lightweight logging (no external deps)
      // keep logs descriptive but not verbose in production — adjust as needed
      console.info(`[Log] ${name} called with:`, ...args);

      const result = original.apply(this, args);

      // If result is a Promise, optionally log when it resolves:
      if (result && typeof result.then === 'function') {
        result.then((res: any) => console.info(`[Log] ${name} resolved:`, res)).catch(() => {});
      } else {
        console.info(`[Log] ${name} returned:`, result);
      }

      return result;
    };

    return descriptor;
  };
}
