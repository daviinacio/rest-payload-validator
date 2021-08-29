const utils = require("./utils.js")

const templates = []

templates.push(['required', (key, value) => {
  if(typeof value === 'undefined' || (typeof value === 'string' && value.length === 0))
    return `Field '${key}' is required`
}])

templates.push(['integer', (key, value) => {
  if(typeof value !== 'undefined' && !Number.isInteger(value))
    return `Field '${key}' is not a valid 'integer' value`
}])

templates.push(['float', (key, value) => {
  if(typeof value !== 'undefined' && (typeof value !== 'number' || parseFloat(value) === NaN))
    return `Field '${key}' is not a valid 'float' value`
}])

templates.push(['number', (key, value) => {
  if(typeof value !== 'undefined' && typeof value !== 'number')
    return `Field '${key}' is not a valid 'number' value`
}])

templates.push(['string', (key, value) => {
  if(typeof value !== 'undefined' && typeof value !== 'string')
    return `Field '${key}' is not a valid 'string' value`
}])

templates.push(['boolean', (key, value) => {
  if(typeof value !== 'undefined' && typeof value !== 'boolean')
    return `Field '${key}' is not a valid 'boolean' value`
}])

templates.push(['array', (key, value) => {
  if(typeof value !== 'undefined' && !Array.isArray(value))
    return `Field '${key}' is not a valid 'array' value`
}])

templates.push(['object', (key, value) => {
  if(typeof value !== 'undefined' && (typeof value !== 'object' || Array.isArray(value)))
    return `Field '${key}' is not a valid 'object' value`
}])

templates.push(['min', (key, value, param, rule, all_rules) => {
  if(typeof value !== 'undefined' && utils.isStringField(value, all_rules) >= 0 && value.length < param)
    return `The minimum length of '${key}' is '${param}' characters`
    else
  if(typeof value !== 'undefined' && utils.isNumericField(value, all_rules) && value < parseInt(param))
    return `Field '${key}' must be greater than or equal to '${param}'`
}])

templates.push(['max', (key, value, param, rule, all_rules) => {
  if(typeof value !== 'undefined' && utils.isStringField(value, all_rules) >= 0 && value.length > param)
    return `The maximum length of '${key}' is '${param}' characters`
  else
  if(typeof value !== 'undefined' && utils.isNumericField(value, all_rules) && value > parseInt(param))
    return `Field '${key}' must be less than or equal to '${param}'`
}])

templates.push(['email', (key, value) => {
  const email_regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
  if(typeof value !== 'undefined' && (typeof value !== 'string' || !email_regex.test(value)))
    return `Field '${key}' is not a valid 'email' value`
}])

// templates.push(['unique', (key, value, param) => {
//   if(typeof value !== 'undefined' && param in prisma){
//     if(prisma[param].count({ where: Object.fromEntries([[ key, value ]]) }) > 0)
//       return `The value of '${key}' must be unique on ${param} table`
//   }
//   else throw new Error(`Prisma does not contains '${param}' table`)
// }])

// templates.push(['validation', (key, value, param) => {
//   if(true)
//     return ``
// }])

module.exports = templates