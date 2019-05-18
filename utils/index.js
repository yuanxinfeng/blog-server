module.exports = {
  isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]"
      ? true
      : false;
  },
  isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]"
      ? true
      : false;
  },
  isNumber(value) {
    return Object.prototype.toString.call(value) === "[object Number]"
      ? true
      : false;
  },
  isString(value) {
    return Object.prototype.toString.call(value) === "[object String]"
      ? true
      : false;
  }
}