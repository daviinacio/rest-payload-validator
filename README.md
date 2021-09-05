# Rest Payload Validator
[![npm](https://img.shields.io/npm/v/rest-payload-validator.svg)](https://www.npmjs.com/package/rest-payload-validator)

Easy and powerful payload validator for your nodejs projects.
This module works server-side and client-side

## Installation
Import this module on your project

*Using NPM*
```shell
npm install --save rest-payload-validator
```

*Using Yarn*
```shell
yarn add rest-payload-validator
```
## Usage
### Basic validator structure
```javascript
/* Build a new instance of validator */

// Using build
Validator.build({
  values: {},   // Input data
  rules: {},    // Rules to validate
  messages: {}  // Custom error messages
})

// Using builder
Validator.builder()
  .values({})   // Input data
  .rules({})    // Rules to validate
  .messages({}) // Custom error messages
.build()


/* Check validation result */

// Using boolean condition
if(validator_instance.alright()){
  // ...
}
else {
  console.log(validator_instance.errors)
}

// Using fallbacks
.alright((data) => {})
.failed((errors) => {})
```


### Example: Object validation
```javascript
Validator.build({
  values: {
    name: "abcd",
    age: 21,
    email: "example@example.com"
  },
  rules: {
    'name': "required|string",
    'age': "required|integer",
    'email': "required|email"
  },
  messages: {
    'name.string': "Custom message for 'name.string'",
    'name.required': "Custom message for 'name.required'",
    'age.string': "Custom message for 'age.string'",
    'age.required': "Custom message for 'age.required'",
    'email.string': "Custom message for 'email.string'",
    'email.required': "Custom message for 'email.required'",
    // or
    'name': {
      'string': "Custom message for 'name.string'",
      'required': "Custom message for 'name.required'",
    },
    'age': {
      'string': "Custom message for 'age.string'",
      'required': "Custom message for 'age.required'",
    },
    'email': {
      'string': "Custom message for 'email.string'",
      'required': "Custom message for 'email.required'",
    }
  }
})
.alright((data) => {
  // ...
})
.failed((errors) => {
  // ...
})
```

### Example: Objects into object
```javascript
Validator.build({
  values: {
    user: {
      address: {
        street: "abc",
        zip_code: 123
      }
    }
  },
  rules: {
    'user': {
      'address': {
        'street': "string",
        'zip_code': "integer"
      }
    }
  },
  messages: {
    'user': {
      'address': {
        'street.string': "Custom message for 'street.string'",
        'zip_code.integer': "Custom message for 'zip_code.integer'",
        // or
        'street': {
          'string': "Custom message for 'street.string'"
        },
        'zip_code': {
          'integer': "Custom message for 'zip_code.integer'"
        }
      }
    }
  }
})
.alright((data) => {
  // ...
})
.failed((errors) => {
  // ...
})
```

### Example: Lists, Collections and Entries

```javascript
/* Array of values (List)*/

Validator.build({
  values: {
    list: [
      1, 2, 3, 4
    ]
  },
  rules: {
    'list': ["integer"]
  },
  messages: {
    'list.array': "Custom message for 'list.array'",
    'list.*': {
      'integer': "Custom message for '{n}.integer'"
    },
    // or
    'list': {
      'array': "Custom message for 'list.array'",
      'integer': "Custom message for '{n}.integer'"
    }
  }
})
.alright((data) => {
  // ...
})
.failed((errors) => {
  // ...
})
```

```javascript
/* Array of objects (Collection) */

Validator.build({
  values: {
    collection: [
      {
        text: "123",
        number: 123
      },
      {
        text: "456",
        number: 456
      }
    ]
  },
  rules: {
    'collection': [{
      'text': "string|min:6|max:256",
      'number': "integer"
    }]
  },
  messages: {
    'collection.*': {
      'text.string': "Custom message for 'text.string'",
      'text.min': "Custom message for 'text.min'",
      'text.max': "Custom message for 'text.max'",
      'number.string': "Custom message for 'number.string'"
      // or
      'text': {
        'string': "Custom message for 'text.string'",
        'min': "Custom message for 'text.min'",
        'max': "Custom message for 'text.max'"
      },
      'number': {
        'string': "Custom message for 'number.string'"
      }
    }
  }
})
.alright((data) => {
  // ...
})
.failed((errors) => {
  // ...
})
```

```javascript
/* Array of Arrays (Entries) */

Validator.build({
  values: {
    entries: [
      [ 1, 2, 3, 4 ],
      [ 'a', 'b', 'c', 'd' ]
    ]
  },
  rules: {
    'entries': [
      ["integer"],
      ["string"]
    ]
  },
  messages: {
    'entries'{
      '0': {
        '*': {
          'integer': "Custom message"
        }
      },
      '1': {
        '*': {
          'string': "Custom message"
        }
      }
      // or
      '0.*': {
        'integer': "Custom message"
      },
      '1.*': {
        'string': "Custom message"
      }
    }
  }
})
.alright((data) => {
  // ...
})
.failed((errors) => {
  // ...
})
```

### Revalidate
```javascript
const values = {
  variable1: 1,
  variable2: 2
}

const validation = Validator.build({
  values,
  rules: {
    'variable1': "string",
    'variable2': "string"
  }
})

// First check without errors
if(validation.alright()){
  return;
}

// Change values
if('variable1.string' in validation.errors)
  values.variable1 = "text-value1"

if('variable2.string' in validation.errors)
  values.variable2 = "text-value2"

// Revalidate
if(validation.alright()){
  return;
}
```

## Messages
You can override the default error message using the a custom `field message`.

### Basic message
```javascript
{
  'field.rule1': "Custom message",
  'field.rule2': "Custom message"
}
```

### Grouped by field name
```javascript
{
  'field': {
    'rule1': "Custom message",
    'rule2': "Custom message"
  }
}
```

### Message for all items in an array
```javascript
/* List of values */

{
  'field': {
    '*': {
      'rule1': "Custom message",
      'rule2': "Custom message"
    }
  }
  // or
  'field.*'{
    'rule1': "Custom message",
    'rule2': "Custom message"
  }
}
```

```javascript
/* Collection of objects */

{
  'field': {
    '*': {
      'field1': {
        'rule1': "Custom message",
        'rule2': "Custom message"
      },
      'field2': {
        'rule1': "Custom message",
        'rule2': "Custom message"
      }
    }
  },
  // or
  'field.*': {
    'field1': {
      'rule1': "Custom message",
      'rule2': "Custom message"
    },
    'field2': {
      'rule1': "Custom message",
      'rule2': "Custom message"
    }
  }
}
```

```javascript
{
  'entries'{
    '*': {
      '*': {
        'integer': "Custom message"
      }
    },
  }
  // or
  'entries.*'{
    '*': {
      'integer': "Custom message"
    }
  }
}
```

### Message for some specific items in an array
```javascript
/* List of values */

{
  'field': {
    '0': {
      'rule1': "Custom message",
      'rule2': "Custom message"
    },
    '1': {
      'rule1': "Custom message",
      'rule2': "Custom message"
    }
  }
}
```

```javascript
/* Collection of objects */

{
  'field': {
    '0': {
      'field1': {
        'rule1': "Custom message",
        'rule2': "Custom message"
      },
      'field2': {
        'rule1': "Custom message",
        'rule2': "Custom message"
      }
    },
    '1': {
      'field1': {
        'rule1': "Custom message",
        'rule2': "Custom message"
      },
      'field2': {
        'rule1': "Custom message",
        'rule2': "Custom message"
      }
    }
  }
}
```

```javascript
/* Entries */
{
  'entries'{
    '0': {
      '*': {
        'integer': "Custom message"
      }
    },
    '1': {
      '*': {
        'string': "Custom message"
      }
    }
    // or
    '0.*': {
      'integer': "Custom message"
    },
    '1.*': {
      'string': "Custom message"
    }
  }
}
```

### Global messages
Global messages replace all messages in the same or lower scope. 
Local messages have higher priority.
```javascript
{
  'rule1': "Custom message"
  'rule2': "Custom message (will not appear)",

  'field': {
    'rule2': "Custom message (override the global)"
  }
}
```

## Default supported validations

Rule         |  Parameter  | Description
-------------|-------------|------------
**required** | N/A         | Check if the field is defined or is not a empty string.
**integer**  | N/A         | Check if the field is a valid **integer** value
**float**    | N/A         | Check if the field is a valid **float** value
**number**   | N/A         | Check if the field is a valid **number** value
**string**   | N/A         | Check if the field is a valid **string** value
**array**    | N/A         | Check if the field is an **array**. Defining rules as `'rule': []` validates as **array** by default.
**object**   | N/A         | Check if the field is an **object**. Defining rules as `'rule': {}` validates as **object** by default.
**email**    | N/A         | Check if the field is a valid **email** value
**min**      | **integer** | This validation have 2 modes. When in a **string** field, check if the length of the text is greater than *@param*. In a **numeric** field, check if the value is greater than *@param*.
**max**      | **integer** | This validation have 2 modes. When in a **string** field, check if the text length is less than *@param*. In a **numeric** field, check if the value is less than *@param*.

### Extra validations
Rule         |  Parameter  | Description
-------------|-------------|------------
**cpf**      | N/A         | Check if the field is a valid **cpf** (Brazilian Natural Persons Register) value. 

## Custom validation
You can implement your own validations. Validation passes when no error message is returned.

```javascript
/* Custom validation template */

Validator.custom('custom_rule', (key, value, param) => {
  if(/* condition */)
    return /* Error message */;
  /* Valid result */
})

Validator.build({
  values: {
    field: 123
  },
  rules: {
    'field': "custom_rule"
  }
})
```

## Maintainer
- [daviinacio](https://github.com/daviinacio) - **Davi Inácio** (author)
