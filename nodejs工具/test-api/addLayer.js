const fs = require('fs')

fs.readdir('./components', 'utf8', (err, data) => {
  data.forEach(async (file, index) => {
    fs.readFile(`./components/${file}`, 'utf8', (err, fileData) => {
      fileData = fileData.replace(/layer: 2,/g, '')
      // index == 0 && console.log(data.match(/path: '(.*)',/g));
      const writeData = `${fileData}`
      fs.writeFile(`./layer/${file}`, writeData, (err) => {
        console.log(err);
      })
    })
  })
})