const path = require('path')
const fs = require('fs')

let number = 0
fs.readdir(path.resolve(__dirname, '../packages'), 'utf8', (err, floders) => {
  if (!err) {
    floders.forEach(async floder => {
      fs.readdir(path.resolve(__dirname, `../packages/${floder}/src/api`), 'utf8', (err, files) => {
        if (!err) {
          files.forEach(async file => {
            fs.readFile(path.resolve(__dirname, `../packages/${floder}/src/api/${file}`), 'utf8', (err, data) => {
              if (!err) {
                const reg = /export\s+function\s+\w+/g
                const matches = data.match(reg)
                const exportCount = matches ? matches.length : 0
                number += exportCount
              }
            })
          })
        }
      })
    })
  }
})

setTimeout(() => {
  console.log(number)
}, 10000)
