import { getCurrentInstance } from 'vue';

// expose public api
export function useExpose(apis: Record<string, unknown>) {
  const instance = getCurrentInstance();
  if (instance) {
    Object.assign(instance.proxy, apis);
  }
}
