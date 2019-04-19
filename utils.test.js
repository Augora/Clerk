const { areTypesTheSame, areApiResultsTheSame } = require("./utils");

it("Should return true", () => {
  const currType = {
    lel: "string"
  };
  const oldType = {
    lel: "string"
  };
  expect(areTypesTheSame(currType, oldType)).toBe(true);
});

it("Should return false", () => {
  const currType = {
    lel: "string"
  };
  const oldType = {
    lel: "number"
  };
  expect(areTypesTheSame(currType, oldType)).toBe(false);
});

it("Should return true, complex types", () => {
  const currType = {
    xd: "number",
    lel: {
      something: "string",
      else: "number",
      lel: "boolean"
    }
  };
  const oldType = {
    xd: "number",
    lel: {
      something: "string",
      else: "number",
      lel: "boolean"
    }
  };
  expect(areTypesTheSame(currType, oldType)).toBe(true);
});

it("Should return false, undefined param", () => {
  const currType = {
    lel: {
      something: "string",
      else: "number",
      lel: "boolean"
    }
  };
  const oldType = undefined;
  expect(areTypesTheSame(currType, oldType)).toBe(false);
});

it("Should return false, complex types", () => {
  const currType = {
    lel: {
      something: "string",
      else: "number",
      lel: "boolean"
    }
  };
  const oldType = {
    lel: {
      something: "string",
      else: "number",
      lel: "string"
    }
  };
  expect(areTypesTheSame(currType, oldType)).toBe(false);
});

it("Should return false, complex types, missing attribute", () => {
  const currType = {
    lel: {
      something: "string",
      else: "number",
      lel: "boolean"
    }
  };
  const oldType = {
    lel: {
      something: "string",
      else: "number"
    }
  };
  expect(areTypesTheSame(currType, oldType)).toBe(false);
});

it("Should return false, complex types, missing attribute reversed", () => {
  const currType = {
    xd: "number",
    lel: {
      something: "string",
      else: "number"
    }
  };
  const oldType = {
    lel: {
      something: "string",
      else: "number",
      lel: "boolean"
    }
  };
  expect(areTypesTheSame(currType, oldType)).toBe(false);
});

it("[areApiResultsTheSame] Should return true, simple structure", () => {
  const currType = [
    {
      name: "A",
      endpoints: []
    },
    {
      name: "B",
      endpoints: []
    }
  ];
  const oldType = [
    {
      name: "A",
      endpoints: []
    },
    {
      name: "B",
      endpoints: []
    }
  ];
  expect(areApiResultsTheSame(currType, oldType)).toBe(true);
});

it("[areApiResultsTheSame] Should return true, simple structure reversed", () => {
  const currType = [
    {
      name: "A",
      endpoints: [
        {
          title: "lel/10",
          typedData: {
            a: "boolean"
          }
        },
        {
          title: "mdr/13",
          typedData: {
            a: "boolean"
          }
        }
      ]
    },
    {
      name: "B",
      endpoints: [
        {
          title: "lel/10",
          typedData: {
            a: "boolean"
          }
        },
        {
          title: "mdr/13",
          typedData: {
            a: "boolean",
            b: "string",
            c: "number"
          }
        }
      ]
    }
  ];
  const oldType = [
    {
      name: "B",
      endpoints: [
        {
          title: "lel/10",
          typedData: {
            a: "boolean"
          }
        },
        {
          title: "mdr/13",
          typedData: {
            a: "boolean",
            b: "string",
            c: "number"
          }
        }
      ]
    },
    {
      name: "A",
      endpoints: [
        {
          title: "lel/10",
          typedData: {
            a: "boolean"
          }
        },
        {
          title: "mdr/13",
          typedData: {
            a: "boolean"
          }
        }
      ]
    }
  ];
  expect(areApiResultsTheSame(currType, oldType)).toBe(true);
});

it("[areApiResultsTheSame] Should return false, simple structure", () => {
  const currType = [
    {
      name: "A",
      endpoints: []
    },
    {
      name: "B",
      endpoints: []
    }
  ];
  const oldType = [
    {
      name: "A",
      endpoints: []
    },
    {
      name: "C",
      endpoints: []
    }
  ];
  expect(areApiResultsTheSame(currType, oldType)).toBe(false);
});
