const getGlobalFields = (object) => {
  const result = Object.keys(object).filter(
    key => key.indexOf('.') === -1 && typeof object[key] === 'string'
  )

  return Object.fromEntries(result.map(key => ([
    key, object[key]
  ])))
}

const isStringField = (value, all_rules = []) => {
  return ['string'].some(t => all_rules.indexOf(t) >= 0) || typeof value === 'string'
}

const isNumericField = (value, all_rules = []) => {
  return ['integer', 'float', 'number'].some(t => all_rules.indexOf(t) >= 0) || typeof value === 'number'
}

module.exports = {
  getGlobalFields,
  isNumericField,
  isStringField
}