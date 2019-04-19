var fs = require("fs");
var axios = require("axios");
var _ = require("lodash");

var apiDescriptor = require("./config");
var previousResult = require("./finalResult.json");
var { jsonToMarkdown, typeAnObject, areApiResultsTheSame } = require("./utils");

let launchProcess = async () => {
  console.time("General Processing");
  const newApiDescriptor = await apiDescriptor.map(async api => {
    const newEndpoints = await api.endpoints.map(async endpoint => {
      console.log("Call:", endpoint.url);
      var processedResult = await axios
        .get(endpoint.url)
        .then(response => response.data)
        .then(data => ({
          // rawData: data,
          markdown: `## ${endpoint.title} (${endpoint.url})\n${jsonToMarkdown(
            data
          )}`,
          typedData: typeAnObject(data)
        }))
        .then(d => {
          console.log("Answer:", endpoint.url);
          return d;
        })
        .catch(function(error) {
          console.log("Error:", error);
        });
      return _.assign({}, endpoint, processedResult);
    });
    const finalEndpoints = await Promise.all(newEndpoints);
    return _.assign({}, api, {
      markdown: `# ${api.name}\n`,
      endpoints: finalEndpoints
    });
  });
  const finalResult = await Promise.all(newApiDescriptor);
  const previousResult = JSON.parse(
    fs.readFileSync("finalResult.json", "utf8")
  );
  if (!areApiResultsTheSame(previousResult, finalResult)) {
    const finalMarkdown = finalResult
      .map(fr => fr.markdown + fr.endpoints.map(e => e.markdown).join(""))
      .join("");
    fs.writeFileSync("finalResult.json", JSON.stringify(finalResult));
    fs.writeFileSync("README.md", finalMarkdown);
  }
  console.timeEnd("General Processing");
};

launchProcess().then(() => console.log("Done."));
