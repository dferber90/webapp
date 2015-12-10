module.exports = function (plop) {
  plop.setGenerator('route', {
    description: 'Create a new route',
    prompts: [
      {
        type: 'input',
        name: 'fileName',
        message: 'Name of the route (filename)?',
        validate: function (value) {
          if ((/.+/).test(value)) { return true }
          return 'name is required'
        },
      },
      {
        type: 'input',
        name: 'path',
        message: 'Path of the route?',
        validate: function (value) {
          if ((/.+/).test(value)) { return true }
          return 'path is required'
        },
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'modules/routes/{{camelCase fileName}}.js',
        templateFile: 'scaffolding/route.js'
      }
    ]
  })
}
