var split = require("lodash/split");
var assignWith = require("lodash/assignWith");
var isArray = require("lodash/isArray");
var isObject = require("lodash/isObject");
var isNull = require("lodash/isNull");
var isString = require("lodash/isString");
var isEmpty = require("lodash/isEmpty");
var isUndefined = require("lodash/isUndefined");
var toUpper = require("lodash/toUpper");
var join = require("lodash/join");
var assign = require("lodash/assign");
var flatMap = require("lodash/flatMap");

function timeThisFunction(f) {
  return (...args) => {
    console.time(f.name);
    var result = f(...args);
    console.timeEnd(f.name);
    return result;
  };
}

function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

function customizer(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  if (isObject(objValue)) {
    return assignWith({}, objValue, srcValue, customizer);
  }
  return isUndefined(objValue) ||
    isNull(objValue) ||
    (isString(objValue) && isEmpty(objValue))
    ? srcValue
    : objValue;
}

function camelize(str) {
  return toUpper(str[0]) + str.substring(1);
}

function clearValue(value) {
  if (typeof value === "string") {
    return split(value, "<p>")
      .join("")
      .split("</p>")
      .join("");
  } else {
    return value;
  }
}

function enhanceKey(key) {
  var camelizedSplittedKey = split(key, "_").map((v, i) => {
    if (i === 0) {
      return camelize(v);
    } else {
      return v;
    }
  });
  return join(camelizedSplittedKey, " ");
}

function jsonToMarkdown(jsonData, indent = "") {
  return Object.keys(jsonData)
    .map(k => {
      if (jsonData[k] instanceof Array) {
        var empoweredData = jsonData[k].reduce((prev, curr) => {
          return assignWith({}, prev, curr, customizer);
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
        const clearedValue = clearValue(jsonData[k]);
        const markdownComplientValue = isURL(clearedValue)
          ? `<${clearedValue}>`
          : clearedValue;
        return `${indent}* ${enhanceKey(k)} (e.g. ${markdownComplientValue})\n`;
      }
    })
    .join("");
}

function typeAnObject(object) {
  return Object.keys(object)
    .map(key => {
      if (object[key] instanceof Array) {
        var empoweredData = object[key].reduce((prev, curr) => {
          return assignWith({}, prev, curr);
        }, {});
        return { [key]: typeAnObject(empoweredData) };
      } else if (object[key] instanceof Object) {
        return { [key]: typeAnObject(object[key]) };
      } else {
        return { [key]: typeof object[key] };
      }
    })
    .reduce((curr, next) => assign({}, curr, next), {});
}

function areTypesTheSame(currType, oldType) {
  if (isUndefined(currType) || isUndefined(oldType)) {
    return false;
  }

  const currKeys = Object.keys(currType);
  const oldKeys = Object.keys(oldType);

  const areSameSize = currKeys.length === oldKeys.length;
  const includeSameKeys = currKeys.reduce((prev, curr) => {
    return prev && oldKeys.includes(curr);
  }, areSameSize);
  const includeSameTypes = currKeys.reduce((prev, curr) => {
    if (currType[curr] instanceof Object) {
      return prev && areTypesTheSame(currType[curr], oldType[curr]);
    } else {
      return prev && currType[curr] === oldType[curr];
    }
  }, includeSameKeys);
  return areSameSize && includeSameKeys && includeSameTypes;
}

function areApiResultsTheSame(currAPIResult, oldAPIResult) {
  const areSameSize = currAPIResult.length === oldAPIResult.length;

  const currAPINames = currAPIResult.map(i => i.name);
  const oldAPINames = oldAPIResult.map(i => i.name);

  const includeSameNames = currAPINames.reduce((prev, curr) => {
    return prev && oldAPINames.includes(curr);
  }, areSameSize);

  const currEndpoints = flatMap(currAPIResult, i => i.endpoints);
  const oldEndpoints = flatMap(oldAPIResult, i => i.endpoints);

  return includeSameNames && areEndpointsTheSame(currEndpoints, oldEndpoints);
}

function areEndpointsTheSame(currEndpoints, oldEndpoints) {
  const areSameSize = currEndpoints.length === oldEndpoints.length;

  const currEndpointsTitles = currEndpoints.map(i => i.title);
  const oldEndpointsTitles = oldEndpoints.map(i => i.title);

  const includeSameTitles = currEndpointsTitles.reduce((prev, curr) => {
    return prev && oldEndpointsTitles.includes(curr);
  }, areSameSize);

  const currTypedData = currEndpoints.map(i => i.typedData);
  const oldTypedData = oldEndpoints.map(i => i.typedData);

  const includeSameTypedData = currTypedData.reduce((prev, curr) => {
    const foundAnItem =
      oldTypedData.find(e => areTypesTheSame(curr, e)) !== undefined;
    return prev && foundAnItem;
  }, includeSameTitles);

  return includeSameTypedData;
}

module.exports = {
  jsonToMarkdown,
  typeAnObject,
  areTypesTheSame,
  areApiResultsTheSame,
  isURL,
  customizer,
  camelize,
  clearValue,
  enhanceKey
};
