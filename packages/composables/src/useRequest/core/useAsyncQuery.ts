import { Query, createQuery } from './createQuery';
import { BaseOptions } from '../options';

export function useAsyncQuery<R, P extends unknown[]>(
  query: Query<R, P>,
  options: BaseOptions<R, P>
) {
  return createQuery(query, options);
}
