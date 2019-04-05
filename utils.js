var _ = require("lodash");

function timeThisFunction(f) {
  return (...args) => {
    console.time(f.name);
    var result = f(...args);
    console.timeEnd(f.name);
    return result;
  };
}

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  if (_.isObject(objValue)) {
    return _.assignWith({}, objValue, srcValue, customizer);
  }
  return _.isUndefined(objValue) ||
    _.isNull(objValue) ||
    (_.isString(objValue) && _.isEmpty(objValue))
    ? srcValue
    : objValue;
}

function camelize(str) {
  return _.toUpper(str[0]) + str.substring(1);
}

function clearValue(value) {
  if (typeof value === "string") {
    return _.split(value, "<p>")
      .join("")
      .split("</p>")
      .join("");
  } else {
    return value;
  }
}

function enhanceKey(key) {
  var camelizedSplittedKey = _.split(key, "_").map((v, i) => {
    if (i === 0) {
      return camelize(v);
    } else {
      return v;
    }
  });
  return _.join(camelizedSplittedKey, " ");
}

function jsonToMarkdown(jsonData, indent = "") {
  return Object.keys(jsonData)
    .map(k => {
      if (jsonData[k] instanceof Array) {
        var empoweredData = jsonData[k].reduce((prev, curr) => {
          return _.assignWith({}, prev, curr, customizer);
        }, {});
        return `${indent}* ${enhanceKey(k)} (${
          jsonData[k].length
        } items)\n${jsonToMarkdown(empoweredData, `${indent}  `)}`;
      } else if (jsonData[k] instanceof Object) {
        return `${indent}* ${enhanceKey(k)}\n${jsonToMarkdown(
          jsonData[k],
          `${indent}  `
        )}`;
      } else {
        return `${indent}* ${enhanceKey(k)} (e.g. ${clearValue(
          jsonData[k]
        )})\n`;
      }
    })
    .join("");
}

function typeAnObject(object) {
  return Object
    .keys(object)
    .map(key => {
      if(object[key] instanceof Array) {
        var empoweredData = object[key].reduce((prev, curr) => {
          return _.assignWith({}, prev, curr);
        }, {});
        return {[key]: typeAnObject(empoweredData)};
      } else if(object[key] instanceof Object) {
        return {[key]: typeAnObject(object[key])};
      } else {
        return { [key]: typeof object[key] }
      }
    })
    .reduce((curr, next) => _.assign({}, curr, next), {});
}

module.exports = {
  jsonToMarkdown,
  typeAnObject
};
