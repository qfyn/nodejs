const fs = require('fs')

fs.readdir('./components', 'utf8', (err, data) => {
  data.forEach((file, index) => {
    fs.readFile(`./components/${file}`, 'utf8', (err, data) => {
      data = data.replace(/component: Layout,/g, '')
      data = data + 'end'
      // console.log(data.match(/(?<=export default \[)([\s\S]*)(?=\]([\s\S]*)end)/g));
      const writeData = `module.exports = ${data.match(/(?<=export default \[)([\s\S]*)(?=\]([\s\S]*)end)/g)}`
      fs.writeFile(`./layerOrigin/${file}`, writeData, (err) => {
        console.log(err);
      })
    })
  })
})