import { Ref, WatchSource } from 'vue';

export interface GlobalOptions {
  loadingDelay?: number;
  pollingInterval?: number;
  pollingWhenHidden?: boolean;
  pollingWhenOffline?: boolean;
  debounceInterval?: number;
  throttleInterval?: number;
  refreshOnWindowFocus?: boolean;
  refocusTimespan?: number;
  cacheTime?: number;
  // -1 means the cache is always valid
  staleTime?: number;
  manual?: boolean;
  // error retry
  errorRetryCount?: number;
  errorRetryInterval?: number;

  [key: string]: any;
}

const globalOptions: GlobalOptions = {};

export const setGlobalOptions = (options: GlobalOptions) => {
  Object.keys(options).forEach(key => {
    globalOptions[key] = options[key];
  });
};

export const getGlobalOptions = () => globalOptions;

export const clearGlobalOptions = () => {
  Object.keys(globalOptions).forEach(key => {
    delete globalOptions[key];
  });
};

export interface BaseOptions<R, P extends unknown[]> extends GlobalOptions {
  defaultParams?: P;
  ready?: Ref<boolean>;
  initialData?: R;
  refreshDeps?: WatchSource<any>[];
  cacheKey?: string;
  queryKey?: (...args: P) => string;
  onSuccess?: (data: R, params: P) => void;
  onError?: (error: Error, params: P) => void;
}
