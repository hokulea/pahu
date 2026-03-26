import { type Locator, locators } from 'vitest/browser';

locators.extend({
  q(selector: string) {
    return selector;
  }
});

declare module 'vitest/browser' {
  interface LocatorSelectors {
    // if the custom method returns a string, it will be converted into a locator
    // if it returns anything else, then it will be returned as usual
    q(selector: string): Locator;
  }
}
