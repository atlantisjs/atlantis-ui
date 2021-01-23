import { isNil } from '@/utils';
import { State } from './createQuery';
import { UnWrapRefObject } from '../utils/types';

type CacheKey = string | symbol;

export type CacheDataType<R, P extends unknown[]> = UnWrapRefObject<
  State<R, P>
>;

type CacheResultType<T> = {
  data: T;
  timer?: number;
  cacheTime: number;
};

const cache = new Map<CacheKey, CacheResultType<unknown>>();

export const getCache = <R, P extends unknown[]>(cacheKey: CacheKey) => {
  if (isNil(cacheKey)) return;

  const data = cache.get(cacheKey);

  if (!data) return;

  return {
    data: data.data as CacheDataType<R, P>,
    cacheTime: data.cacheTime,
  };
};

export const setCache = <R, P extends unknown[]>(
  cacheKey: CacheKey,
  data: CacheDataType<R, P>,
  cacheTime: number
) => {
  const oldCache = cache.get(cacheKey);

  if (oldCache?.timer) {
    clearTimeout(oldCache.timer);
  }

  const timer = setTimeout(() => cache.delete(cacheKey), cacheTime);

  cache.set(cacheKey, {
    data,
    timer,
    cacheTime: new Date().getTime(),
  });
};

export const clearCache = () => {
  // clear timer
  cache.forEach(i => clearTimeout(i.timer));
  cache.clear();
};
