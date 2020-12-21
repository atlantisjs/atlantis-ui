/**
 * KeyboardEvent.keyCode aliases
 */
export const keyCodes = Object.freeze({
  enter: 13,
  tab: 9,
  delete: 46,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  end: 35,
  home: 36,
  del: 46,
  backspace: 8,
  insert: 45,
  pageup: 33,
  pagedown: 34,
});

/**
 * 判断是否是韩文
 * @param text 文字参数
 */
export function isKorean(text: string): boolean {
  const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi;
  return reg.test(text);
}

/**
 * 判断参数是否是其中之一
 * @param value 被判断的参数
 * @param validList 被判断的数组
 */
export const oneOf = <T = unknown>(value: T, validList: T[]) => {
  return validList.some(item => item === value);
};
