const templates = []

templates.push(['required', (value, key) => {
  if(typeof value === 'undefined')
    return `Field '${key}' is required`
}])

templates.push(['integer', (value, key) => {
  if(typeof value !== 'undefined' && !Number.isInteger(value))
    return `Field '${key}' is not a valid 'integer' value`
}])

templates.push(['float', (value, key) => {
  if(typeof value !== 'undefined' && typeof value !== 'number' || parseFloat(value) === NaN)
    return `Field '${key}' is not a valid 'float' value`
}])

templates.push(['number', (value, key) => {
  if(typeof value !== 'undefined' && typeof value !== 'number')
    return `Field '${key}' is not a valid 'number' value`
}])

templates.push(['string', (value, key) => {
  if(typeof value !== 'undefined' && typeof value !== 'string')
    return `Field '${key}' is not a valid 'string' value`
}])

templates.push(['boolean', (value, key) => {
  if(typeof value !== 'undefined' && typeof value !== 'boolean')
    return `Field '${key}' is not a valid 'boolean' value`
}])

templates.push(['array', (value, key) => {
  if(typeof value !== 'undefined' && !Array.isArray(value))
    return `Field '${key}' is not a valid 'array' value`
}])

templates.push(['min', (value, key, param) => {
  if(typeof value !== 'undefined' && typeof value === 'string' && value.length < param)
    return `The minimum length of '${key}' is '${param}' characters`
}])

templates.push(['max', (value, key, param) => {
  if(typeof value !== 'undefined' && typeof value === 'string' && value.length > param)
    return `The maximum length of '${key}' is '${param}' characters`
}])

templates.push(['major', (value, key, param) => {
  if(typeof value === 'number' && value < parseInt(param))
    return `Field '${key}' must be major then '${param}'`
}])

templates.push(['minor', (value, key, param) => {
  if(typeof value === 'number' && value > parseInt(param))
    return `Field '${key}' must be minor then '${param}'`
}])

templates.push(['email', (value, key) => {
  const email_regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
  if(typeof value !== 'undefined' && (typeof value !== 'string' || !email_regex.test(value)))
    return `Field '${key}' is not a valid 'email' value`
}])

// templates.push(['unique', (value, key, param) => {
//   if(typeof value !== 'undefined' && param in prisma){
//     if(prisma[param].count({ where: Object.fromEntries([[ key, value ]]) }) > 0)
//       return `The value of '${key}' must be unique on ${param} table`
//   }
//   else throw new Error(`Prisma does not contains '${param}' table`)
// }])

// templates.push(['validation', (value, key, param) => {
//   if(true)
//     return ``
// }])

export default templates