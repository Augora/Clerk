const {
  areTypesTheSame,
  areApiResultsTheSame,
  isURL,
  camelize,
  clearValue,
  enhanceKey
} = require("./utils");

it("[isURL] should return true", () => {
  expect(isURL('lel.com')).toBe(true);
  expect(isURL('lel.com/a/b/c')).toBe(true);
  expect(isURL('http://lel.com')).toBe(true);
  expect(isURL('http://lel.com/a/b/C')).toBe(true);
  expect(isURL('https://lel.com')).toBe(true);
  expect(isURL('https://lel.com/a')).toBe(true);
  expect(isURL('https://lel.com/a/b/C')).toBe(true);
  expect(isURL('https://lel.com/a/b/C?lel=a')).toBe(true);
});

it("[isURL] should return false", () => {
  expect(isURL('lel@mdr.fr')).toBe(false);
  expect(isURL('abc')).toBe(false);
  expect(isURL('This is rocket league.')).toBe(false);
});

it("[camelize] should return camelized value", () => {
  expect(camelize('abc')).toBe('Abc');
  expect(camelize('kevbac')).toBe('Kevbac');
  expect(camelize('Kevbac')).toBe('Kevbac');
  expect(camelize('this is rocket league.')).toBe('This is rocket league.');
});

it("[clearValue] should return a cleared value", () => {
  expect(clearValue('abc')).toBe('abc');
  expect(clearValue('<p>abc')).toBe('abc');
  expect(clearValue('<p>abc</p>')).toBe('abc');
});

it("[enhanceKey] should return a human readable key", () => {
  expect(enhanceKey('this_is_rocket_league')).toBe('This is rocket league');
  expect(enhanceKey('nom_de_famille')).toBe('Nom de famille');
});

it("[areTypesTheSame] Should return true", () => {
  const currType = {
    lel: "string"
  };
  const oldType = {
    lel: "string"
  };
  expect(areTypesTheSame(currType, oldType)).toBe(true);
});

it("[areTypesTheSame] Should return false", () => {
  const currType = {
    lel: "string"
  };
  const oldType = {
    lel: "number"
  };
  expect(areTypesTheSame(currType, oldType)).toBe(false);
});

it("[areTypesTheSame] Should return true, complex types", () => {
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

it("[areTypesTheSame] Should return false, undefined param", () => {
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

it("[areTypesTheSame] Should return false, complex types", () => {
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

it("[areTypesTheSame] Should return false, complex types, missing attribute", () => {
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

it("[areTypesTheSame] Should return false, complex types, missing attribute reversed", () => {
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
