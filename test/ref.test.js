'use strict'

const test = require('tap').test
const build = require('..')

test('ref internal - properties', (t) => {
  t.plan(2)

  const schema = {
    title: 'object with $ref',
    definitions: {
      def: {
        type: 'object',
        properties: {
          str: {
            type: 'string'
          }
        }
      }
    },
    type: 'object',
    properties: {
      obj: {
        $ref: '#/definitions/def'
      }
    }
  }

  const object = {
    obj: {
      str: 'test'
    }
  }

  const stringify = build(schema)
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"obj":{"str":"test"}}')
})

test('ref internal - items', (t) => {
  t.plan(2)

  const schema = {
    title: 'array with $ref',
    definitions: {
      def: {
        type: 'object',
        properties: {
          str: {
            type: 'string'
          }
        }
      }
    },
    type: 'array',
    items: { $ref: '#/definitions/def' }
  }

  const array = [{
    str: 'test'
  }]

  const stringify = build(schema)
  const output = stringify(array)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '[{"str":"test"}]')
})

test('ref external - properties', (t) => {
  t.plan(2)

  const externalSchema = {
    first: require('./ref.json'),
    second: {
      definitions: {
        num: {
          type: 'object',
          properties: {
            int: {
              type: 'integer'
            }
          }
        }
      }
    },
    third: {
      type: 'string'
    }
  }

  const schema = {
    title: 'object with $ref',
    type: 'object',
    properties: {
      obj: {
        $ref: 'first#/definitions/def'
      },
      num: {
        $ref: 'second#/definitions/num'
      },
      strPlain: {
        $ref: 'third'
      },
      strHash: {
        $ref: 'third#'
      }
    }
  }

  const object = {
    obj: {
      str: 'test'
    },
    num: {
      int: 42
    },
    strPlain: 'test',
    strHash: 'test'
  }

  const stringify = build(schema, { schema: externalSchema })
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"obj":{"str":"test"},"num":{"int":42},"strPlain":"test","strHash":"test"}')
})

test('ref internal - patternProperties', (t) => {
  t.plan(2)

  const schema = {
    title: 'object with $ref',
    definitions: {
      def: {
        type: 'object',
        properties: {
          str: {
            type: 'string'
          }
        }
      }
    },
    type: 'object',
    properties: {},
    patternProperties: {
      obj: {
        $ref: '#/definitions/def'
      }
    }
  }

  const object = {
    obj: {
      str: 'test'
    }
  }

  const stringify = build(schema)
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"obj":{"str":"test"}}')
})

test('ref internal - additionalProperties', (t) => {
  t.plan(2)

  const schema = {
    title: 'object with $ref',
    definitions: {
      def: {
        type: 'object',
        properties: {
          str: {
            type: 'string'
          }
        }
      }
    },
    type: 'object',
    properties: {},
    additionalProperties: {
      $ref: '#/definitions/def'
    }
  }

  const object = {
    obj: {
      str: 'test'
    }
  }

  const stringify = build(schema)
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"obj":{"str":"test"}}')
})

test('ref internal - pattern-additional Properties', (t) => {
  t.plan(2)

  const schema = {
    title: 'object with $ref',
    definitions: {
      def: {
        type: 'object',
        properties: {
          str: {
            type: 'string'
          }
        }
      }
    },
    type: 'object',
    properties: {},
    patternProperties: {
      reg: {
        $ref: '#/definitions/def'
      }
    },
    additionalProperties: {
      $ref: '#/definitions/def'
    }
  }

  const object = {
    reg: {
      str: 'test'
    },
    obj: {
      str: 'test'
    }
  }

  const stringify = build(schema)
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"reg":{"str":"test"},"obj":{"str":"test"}}')
})

test('ref external - pattern-additional Properties', (t) => {
  t.plan(2)

  const externalSchema = {
    first: require('./ref.json'),
    second: {
      definitions: {
        num: {
          type: 'object',
          properties: {
            int: {
              type: 'integer'
            }
          }
        }
      }
    }
  }

  const schema = {
    title: 'object with $ref',
    type: 'object',
    properties: {},
    patternProperties: {
      reg: {
        $ref: 'first#/definitions/def'
      }
    },
    additionalProperties: {
      $ref: 'second#/definitions/num'
    }
  }

  const object = {
    reg: {
      str: 'test'
    },
    obj: {
      int: 42
    }
  }

  const stringify = build(schema, { schema: externalSchema })
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"reg":{"str":"test"},"obj":{"int":42}}')
})

test('ref internal - deepObject schema', (t) => {
  t.plan(2)

  const schema = {
    title: 'object with $ref',
    definitions: {
      def: {
        type: 'object',
        properties: {
          coming: {
            type: 'object',
            properties: {
              where: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    type: 'object',
    properties: {
      winter: {
        type: 'object',
        properties: {
          is: {
            $ref: '#/definitions/def'
          }
        }
      }
    }
  }

  const object = {
    winter: {
      is: {
        coming: {
          where: 'to town'
        }
      }
    }
  }

  const stringify = build(schema)
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"winter":{"is":{"coming":{"where":"to town"}}}}')
})

test('ref internal - plain name fragment', (t) => {
  t.plan(2)

  const schema = {
    title: 'object with $ref',
    definitions: {
      def: {
        $id: '#uri',
        type: 'object',
        properties: {
          str: {
            type: 'string'
          }
        },
        required: ['str']
      }
    },
    type: 'object',
    properties: {
      obj: {
        $ref: '#uri'
      }
    }
  }

  const object = {
    obj: {
      str: 'test'
    }
  }

  const stringify = build(schema)
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"obj":{"str":"test"}}')
})

test('ref external - plain name fragment', (t) => {
  t.plan(2)

  const externalSchema = {
    '#first-schema': {
      $id: '#first-schema',
      type: 'object',
      properties: {
        str: {
          type: 'string'
        }
      }
    },
    '#second-schema': {
      definitions: {
        second: {
          $id: '#second-schema',
          type: 'object',
          properties: {
            int: {
              type: 'integer'
            }
          }
        }
      }
    }
  }

  const schema = {
    title: 'object with $ref to external plain name fragment',
    type: 'object',
    properties: {
      first: {
        $ref: '#first-schema'
      },
      second: {
        $ref: '#second-schema'
      }
    }
  }

  const object = {
    first: {
      str: 'test'
    },
    second: {
      int: 42
    }
  }

  const stringify = build(schema, { schema: externalSchema })
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"first":{"str":"test"},"second":{"int":42}}')
})

test('ref internal - multiple $ref format', (t) => {
  t.plan(2)

  const schema = {
    type: 'object',
    definitions: {
      one: {
        type: 'string',
        definitions: {
          two: {
            $id: '#twos',
            type: 'string'
          }
        }
      }
    },
    properties: {
      zero: {
        $id: '#three',
        type: 'string'
      },
      a: { $ref: '#/definitions/one' },
      b: { $ref: '#three' },
      c: { $ref: '#/properties/zero' },
      d: { $ref: '#twos' },
      e: { $ref: '#/definitions/one/definitions/two' }
    }
  }

  const object = {
    zero: 'test',
    a: 'test',
    b: 'test',
    c: 'test',
    d: 'test',
    e: 'test'
  }

  const stringify = build(schema)
  const output = stringify(object)

  try {
    JSON.parse(output)
    t.pass()
  } catch (e) {
    t.fail()
  }

  t.equal(output, '{"zero":"test","a":"test","b":"test","c":"test","d":"test","e":"test"}')
})
