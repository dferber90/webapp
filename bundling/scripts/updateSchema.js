const fs = require('fs')
const path = require('path')
const { graphql } = require('graphql')
const { introspectionQuery, printSchema } = require('graphql/utilities')
const schema = require('../../modules/graphql/schema.js')

const basePath = path.join(__dirname, '..', '..', 'build')

// ----------------------------------------------------------------------------
// Helpers
// copied from https://github.com/graphql/graphql-js/blob/2e29b7885976d83bc1a289fdcce9541e7048e6ac/src/utilities/schemaPrinter.js
// ----------------------------------------------------------------------------
function isIntrospectionType(typename) {
  return typename.indexOf('__') === 0
}

function isBuiltInScalar(typename) {
  return (
    typename === 'String' ||
    typename === 'Boolean' ||
    typename === 'Int' ||
    typename === 'Float' ||
    typename === 'ID'
  )
}

function isDefinedType(typename) {
  return !isIntrospectionType(typename) && !isBuiltInScalar(typename)
}


// ----------------------------------------------------------------------------
// Redux Mappings
// ----------------------------------------------------------------------------
const { reduxMappings } = schema
const typeMap = schema.getTypeMap()
const reduxMappingsMap = new Map(reduxMappings)
const mappedTypenames = Array.from(reduxMappingsMap.keys())

const userTypes = Object.keys(typeMap).filter(isDefinedType)
const userTypesWithoutMapping = userTypes.filter(typename => !mappedTypenames.includes(typename))
const extraneousMappings = mappedTypenames.filter(typename => !userTypes.includes(typename))

if (reduxMappingsMap.size !== reduxMappings.length) {
  console.error('updateSchema: duplicate entries in map')
  console.error('aborting')
  process.exit(1)
}

if (userTypesWithoutMapping.length > 0) {
  console.error('updateSchema: missing mapping for: \n- ' + userTypesWithoutMapping.join('\n- '))
  console.error('aborting')
  process.exit(1)
}

if (extraneousMappings.length > 0) {
  console.error('updateSchema: extraneous definitions: \n- ' + extraneousMappings.join('\n- '))
  console.error('aborting')
  process.exit(1)
}

const resolvedMappings = {}
reduxMappings.forEach(([primitiveName, reduxInfo]) => {
  resolvedMappings[primitiveName] = reduxInfo
})


// ----------------------------------------------------------------------------
// Save schema
// ----------------------------------------------------------------------------

// Save JSON of full schema introspection for Babel Relay Plugin to use
;(async () => {
  var result = await graphql(schema, introspectionQuery)
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    )
  } else {
    fs.writeFile(
      path.join(basePath, 'schema.json'),
      JSON.stringify(result, null, 2)
    )

    // Save user readable type system shorthand of schema
    fs.writeFile(
      path.join(basePath, 'schema.graphql'),
      printSchema(schema)
    )

    fs.writeFile(
      path.join(basePath, 'reduxMappings.json'),
      JSON.stringify(resolvedMappings, null, 2)
    )
  }
})()
