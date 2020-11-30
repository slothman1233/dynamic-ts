import { isPlain, each } from './obj';

/**
 * 合并对象
 * @param sources 需要合并的对象
 */
export function mergeOptions(...sources: any) {
  const result: any = {};

  sources.forEach((source: any) => {
    if (!source) {
      return;
    }

    each(source, (value: any, key: any) => {
      if (!isPlain(value)) {
        result[key] = value;
        return;
      }

      if (!isPlain(result[key])) {
        result[key] = {};
      }

      result[key] = mergeOptions(result[key], value);
    });
  });

  return result;
}


