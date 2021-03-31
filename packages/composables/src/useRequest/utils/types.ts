import { Ref } from 'vue';

export type UnRef<T> = T extends Ref<infer V> ? V : T;

export type UnWrapRefObject<T> = {
  [P in keyof T]: UnRef<T[P]>;
};
