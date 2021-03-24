/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  if (typeof arr === 'undefined') return [];
  if (arr.length === 0) return [];

  return arr.filter((item, index, array) => array.indexOf(item) === index);
}
