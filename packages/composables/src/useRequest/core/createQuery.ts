import { Ref, ref, computed } from 'vue';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import { isNil, isFunction, isDocumentVisibility, isOnline } from 'packages/utils';
import { BaseOptions } from '../options';

type MutateFunction<R> = (data: R) => R;
export interface Mutate<R> {
  (data: R | MutateFunction<R>): void;
}

export type Query<R, P extends unknown[]> = (...args: P) => Promise<R>;

export interface State<R, P extends unknown[]> {
  loading: Ref<boolean>;
  data: Ref<R | undefined>;
  error: Ref<Error | undefined>;
  params: Ref<P>;
}

export interface QueryState<R, P extends unknown[]> extends State<R, P> {
  run: (...arg: P) => InnerRunReturn<R>;
  cancel: () => void;
  refresh: () => InnerRunReturn<R>;
  mutate: Mutate<R>;
}

// common run result | debounce and throttle result
export type InnerRunReturn<R> = Promise<R | null>;

export function createQuery<R, P extends unknown[]>(
  query: Query<R, P>,
  options: BaseOptions<R, P>,
  initialState?: Partial<State<R, P>>
): QueryState<R, P> {
  const {
    loadingDelay,
    initialData,
    formatResult,
    debounceInterval,
    throttleInterval,

    pollingInterval,
    pollingWhenHidden,
    pollingWhenOffline,

    errorRetryCount,
    errorRetryInterval,

    onSuccess,
    onError,
  } = options;

  const loading = ref(initialState?.loading ?? false);
  const data = ref(initialState?.data ?? initialData) as Ref<R>;
  const error = ref(initialState?.error);
  const params = ref(initialState?.params ?? []) as Ref<P>;

  const count = ref(0);
  const retriedCount = ref(0);
  const pollingTimer = ref();
  const retryTimer = ref();
  const delayLoadingTimer = ref();

  const clearAllTimer = () => {
    // clear pollingTimer
    if (pollingTimer.value) {
      pollingTimer.value();
    }

    // clear delayLoadingTimer
    if (delayLoadingTimer.value) {
      delayLoadingTimer.value();
    }

    // clear retryTimer
    if (retryTimer.value) {
      retryTimer.value();
    }
  };

  const resetRetriedCount = () => {
    retriedCount.value = 0;
  };

  const delayLoading = () => {
    let timerId: number;

    if (loadingDelay) {
      timerId = setTimeout(() => {
        loading.value = true;
      }, loadingDelay);
    }

    return () => {
      timerId && clearTimeout(timerId);
    };
  };

  const polling = (pollingFunc: () => void) => {
    // if errorRetry is enabled, then skip this method
    if (error.value && errorRetryCount !== 0) return;

    let timerId: number;
    if (!isNil(pollingInterval) && pollingInterval! >= 0) {
      if (
        (pollingWhenHidden || isDocumentVisibility()) &&
        (pollingWhenOffline || isOnline())
      ) {
        timerId = setTimeout(pollingFunc, pollingInterval);
      } else {
        // stop polling
        return;
      }
    }

    return () => {
      timerId && clearTimeout(timerId);
    };
  };

  const actualErrorRetryInterval = computed(() => {
    if (errorRetryInterval) return errorRetryInterval;

    const baseTime = 1000;
    const minCoefficient = 1;
    const maxCoefficient = 9;
    // When retrying for the first time, in order to avoid the coefficient being 0
    // so replace 0 with 2, the coefficient range will become 1 - 2
    const coefficient = Math.floor(
      Math.random() * 2 ** Math.min(retriedCount.value, maxCoefficient) +
        minCoefficient
    );

    return baseTime * coefficient;
  });

  const errorRetry = (retryFunc: () => void) => {
    let timerId: number;
    const isInfiniteRetry = errorRetryCount === -1;
    const hasRetryCount =
      errorRetryCount && retriedCount.value < errorRetryCount;

    // if errorRetryCount is -1, it will retry the request until it success
    if (error.value && (isInfiniteRetry || hasRetryCount)) {
      if (!isInfiniteRetry) retriedCount.value += 1;

      timerId = setTimeout(retryFunc, actualErrorRetryInterval.value);
    }

    return () => {
      timerId && clearTimeout(timerId);
    };
  };

  const _run = async (...args: P) => {
    params.value = args;
    loading.value = !loadingDelay;

    delayLoadingTimer.value = delayLoading();
    count.value += 1;
    const currentCount = count.value;

    try {
      const res = await query(...args);
      const formatedResult = formatResult ? formatResult(res) : res;

      if (currentCount === count.value) {
        data.value = formatedResult;

        onSuccess && onSuccess(formatedResult, params.value);

        resetRetriedCount();
        return formatedResult;
      }
    } catch (err) {
      if (currentCount === count.value) {
        data.value = undefined as any;
        error.value = err;

        onError && onError(err, params.value);
      }
    } finally {
      if (currentCount === count.value) {
        loading.value = false;

        // clear delayLoadingTimer
        delayLoadingTimer.value();
        // retry
        retryTimer.value = errorRetry(() => _run(...args));
        // run for polling
        pollingTimer.value = polling(() => _run(...args));
      }
    }

    return null;
  };

  const debouncedRun =
    !isNil(debounceInterval) && debounce(_run, debounceInterval);
  const throttledRun =
    !isNil(throttleInterval) && throttle(_run, throttleInterval);

  const run = async (...args: P) => {
    clearAllTimer();

    // initial auto run should not debounce
    if (debouncedRun) {
      debouncedRun(...args);
      return;
    }

    if (throttledRun) {
      throttledRun(...args);
      return;
    }
    resetRetriedCount();

    return _run(...args);
  };

  const cancel = () => {
    count.value += 1;
    loading.value = false;

    if (debouncedRun) {
      debouncedRun.cancel();
    }
    if (throttledRun) {
      throttledRun.cancel();
    }

    clearAllTimer();
  };

  const refresh = () => {
    return run(...params.value);
  };

  const mutate: Mutate<R> = x => {
    const mutateData = isFunction(x) ? x(data.value) : x;
    data.value = mutateData;
  };

  return {
    params,
    data,
    error,
    loading,
    run,
    cancel,
    refresh,
    mutate,
  };
}
