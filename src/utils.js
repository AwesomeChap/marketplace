export const deepClone = (item) => {
  let clone = [];
  Object.keys(item).forEach(key => clone[key] = item[key]);
  return clone;
}