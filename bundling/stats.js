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
    if (!memoryOnly) {
      fs.writeFileSync(statsPath, JSON.stringify(statsData.toJson()))
    }
    inMemoryStats = statsData.toJson()
  },
}
