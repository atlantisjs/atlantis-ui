import { ComponentPublicInstance } from 'vue';

export type ElementType = Element | ComponentPublicInstance;

export function isComponentPublicInstance(
  target: ElementType
): target is ComponentPublicInstance {
  return !!(target as ComponentPublicInstance).$;
}
