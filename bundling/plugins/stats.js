var path = require('path')
var fs = require('fs')

var statsPath = path.resolve('build', 'stats.json')

var inMemoryStats = {}
module.exports = {
  load: function (memoryOnly) {
    if (memoryOnly) {
      return inMemoryStats
    }
    return JSON.parse(fs.readFileSync(statsPath))
  },
  save: function (statsData, memoryOnly) {
    var data = statsData.toJson({
      modules: false,
    })
    if (!memoryOnly) {
      fs.writeFileSync(statsPath, JSON.stringify(data))
    }
    inMemoryStats = statsData.toJson(data)
  },
}
