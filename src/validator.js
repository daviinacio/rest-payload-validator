import templates from "./templates.js"
import utils from "./utils.js"

const rule_validators = Object.fromEntries(templates)

const build = ({ values = {}, rules = {}, messages = {} }) => {
  const validation_results = {}

  function alright(event){
    if(typeof rules === 'object' && !Array.isArray(rules)){
      Object.keys(rules).forEach(key => {
        if(typeof rules[key] === 'string'){
          const field_rules = rules[key].split('|')
    
          field_rules.forEach(rule_row => {
            const [rule, param] = rule_row.split(':')
            
            if(rule in rule_validators){
              const result = rule_validators[rule](values[key], key, param, rule, field_rules)
        
              if(result)
                validation_results[`${key}.${rule}`] = result
            }
            else {
              if(rule === '')
                throw new Error(`RestPayloadValidator: Syntax error '${rules[key]}' field: '${key}'`)
              else throw new Error(`RestPayloadValidator: Rule validator ${rule} not found`)
            }
          });
        }
        else
        if(Array.isArray(rules[key])){
          const validate_array = rule_validators.array(values[key], key)
          
          if(!validate_array){
            if(rules[key].length === 0) return;

            validation_results[key] = {}

            const global_messages = utils.getGlobalFields(messages)
            const all_messages = messages[`${key}.*`] || (messages[key] || {})['*'] || {}

            values[key].forEach((value, index) => {
              Validator.build({
                values: Object.fromEntries([[
                  index, value
                ]]),
                rules: Object.fromEntries([[
                  index, rules[key][0]
                ]]),

                messages: {
                  ...global_messages,
                  ...Object.fromEntries([[index, all_messages]]),
                  ...messages[key],
                }
              })
              .alright(() => {})
              .failed((errors) => {
                Object.keys(errors).forEach(error_key => {
                  validation_results[key][error_key]
                    = errors[error_key]
                })
              })
            })

            if(Object.keys(validation_results[key]).length === 0)
                delete validation_results[key]
          }
          else validation_results[`${key}.array`] = validate_array
        }
        else
        // Recursion for sub objects
        if(typeof rules[key] === 'object'){
          const validate_object = rule_validators.object(values[key], key)
          
          if(!validate_object){
            const global_messages = utils.getGlobalFields(messages)

            Validator.build({
              values: values[key],
              rules: rules[key],
              messages: {
                ...global_messages,
                ...messages[key]
              }
            })
            .alright(() =>{})
            .failed((errors) => {
              validation_results[`${key}`] = errors
            })
          }
          else validation_results[`${key}.object`] = validate_object
        }
      })
    }
    //
    // Single value validation
    // else
    // if(typeof rules === 'string' && rules in rule_validators){
    //   const field_rules = rules.split('|')
    
    //   field_rules.forEach(rule_row => {
    //     const [rule, param] = rule_row.split(':')
        
    //     if(rule in rule_validators){
    //       const result = rule_validators[rule](values, '', param, rule)
    
    //       if(result)
    //         validation_results[`self.${rule}`] = result
    //     }
    //     else {
    //       if(rule === '')
    //         throw new Error(`RestPayloadValidator: Syntax error '${rules[key]}' field: '${key}'`)
    //       else throw new Error(`RestPayloadValidator: Rule validator ${rule} not found`)
    //     }
    //   });
    // }

    const passed = Object.keys(validation_results).length === 0

    if(typeof event === 'function'){
      if(passed) event()
      return {
        failed
      }
    }
    else return passed
  }

  function failed(event){
    const failed = Object.keys(validation_results).length > 0
    if(typeof event === 'function' && failed)
      return event(errors())
  }

  function errors(){
    const validation_errors = {}

    Object.keys(validation_results).forEach(error_key => {
      // Object validation messages
      if(typeof rules[error_key] === 'object')
        validation_errors[error_key] = validation_results[error_key]
      else
      // '<key>.<rule>': <message>
      if(error_key in messages)
        validation_errors[error_key.split('.')[0]] = messages[error_key]
      else
      // '<key>': { '<rule>': <message> }
      if(error_key.split('.')[0] in messages && error_key.split('.')[1] in messages[error_key.split('.')[0]])
        validation_errors[error_key.split('.')[0]] = messages[error_key.split('.')[0]][error_key.split('.')[1]]
      else
      // '<global_rule>': <message>
      if(error_key.split('.')[1] in messages)
        validation_errors[error_key.split('.')[0]] = messages[error_key.split('.')[1]]
      else
        validation_errors[error_key] = validation_results[error_key]
    })

    return validation_errors
  }

  return {
    alright,

    get errors(){
      return errors()
    }
  }
}

const builder = () => {
  const params = {}

  function values(values){
    params.values = values
    return { rules, messages, build: handleBuild }
  }

  function rules(rules){
    params.rules = rules
    return { values, messages, build: handleBuild }
  }

  function messages(messages){
    params.messages = messages
    return { values, rules, build: handleBuild }
  }
  
  function handleBuild(){
    return build({
      values: params.values,
      rules: params.rules,
      messages: params.messages
    })
  }

  return { values, rules, messages }
}

const custom = (rule, validator) => {
  rule_validators[rule] = validator
}

const Validator = {
  build,
  builder,
  custom
}

export default Validator