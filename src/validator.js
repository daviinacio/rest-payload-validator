import templates from "./templates.js"

const rule_validators = Object.fromEntries(templates)

const build = ({ values, rules, messages }) => {
  const validation_results = {}

  function alright(event){
    Object.keys(rules).forEach(key => {
      if(typeof rules[key] === 'string'){
        const field_rules = rules[key].split('|')
  
        field_rules.forEach(rule_row => {
          const [rule, param] = rule_row.split(':')
          
          if(rule in rule_validators){
            const result = rule_validators[rule](values[key], key, param, rule)
      
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
      // Recursion for sub objects
      if(typeof rules[key] === 'object'){
        Validator.build({values: values[key] || {}, rules: rules[key] || {}, messages: messages[key] || {}})
        .alright(() =>{})
        .failed((errors) => {
          validation_results[`${key}`] = errors
        })
      }
    })

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
      if(typeof rules[error_key] === 'object')
        validation_errors[error_key] = validation_results[error_key]
      else
      if(error_key in messages)
        validation_errors[error_key.split('.')[0]] = messages[error_key]
      else
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