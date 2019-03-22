var fs = require("fs");
var axios = require("axios");
var apiDescriptor = require('./config');

function camelize(str) {
  return str[0].toUpperCase() + str.substring(1);
}

function clearValue(value) {
  if (value) {
    value = value + "";
    return value.replace("<p>", "").replace("</p>", "");
  } else {
    return value;
  }
}

function enhanceKey(key) {
  var splittedKey = key.split("_");
  var camelizedSplittedKey = splittedKey.map((v, i) => {
    if (i === 0) {
      return camelize(v);
    } else {
      return v;
    }
  });
  return camelizedSplittedKey.join(" ");
}

function jsonToMarkdown(jsonData, indent = "") {
  var result = "";
  var keys = Object.keys(jsonData);
  keys.forEach(k => {
    if (jsonData[k] instanceof Array) {
      var empoweredData = jsonData[k].reduce((prev, curr, index) => {
        return Object.assign({}, prev, curr);
      }, {});
      result += `${indent}* ${enhanceKey(k)}\n`;
      result += jsonToMarkdown(empoweredData, `${indent}  `);
    } else if (jsonData[k] instanceof Object) {
      result += `${indent}* ${enhanceKey(k)}\n`;
      result += jsonToMarkdown(jsonData[k], `${indent}  `);
    } else {
      result += `${indent}* ${enhanceKey(k)} (e.g. ${clearValue(
        jsonData[k]
      )})\n`;
    }
  });
  return result;
}

// let finalResult = "";
// apiDescriptor.forEach(async api => {
//   var result = `# ${api.name}\n`;
//   const mappedResult = api.endpoints.forEach(async endpoint => {
//     var markdownResult = await axios
//       .get(endpoint.url)
//       .then(response => response.data)
//       .then(
//         data =>
//           `## ${endpoint.title} (${endpoint.url}) :\n${jsonToMarkdown(data)}`
//       )
//       .catch(function(error) {
//         console.log("error:", error);
//       });
//       console.log("markdownResult:", endpoint.title);
//     finalResult += markdownResult;
//   });
//   console.log("result:", result + mappedResult.join(""));
// });

let launchProcess = async () => {
  var result = "";
  for (let api of apiDescriptor) {
    result += `# ${api.name}\n`;
    for (let endpoint of api.endpoints) {
      var markdownResult = await axios
        .get(endpoint.url)
        .then(response => response.data)
        .then(data => {
          return `## ${endpoint.title} (${endpoint.url}) :\n${jsonToMarkdown(
            data
          )}`;
        })
        .catch(function(error) {
          console.log("error:", error);
        });
      result += markdownResult;
    }
  }
  console.log(result);
};

launchProcess();
