const fs = require('fs');
const route = require('./route');

fs.readdir('./components', 'utf8', (err, data) => {
  data.forEach((file, index) => {
    fs.readFile(`./components/${file}`, 'utf8', (err, data) => {
      data = data.replace(/component: Layout,/g, '')
      data = data.replace(/name: '(.*)?'/g, ($1, $2) => {
        $2 = $2.charAt(0).toUpperCase() + $2.slice(1)
        return `name: '${route[$2] || route['Omc' + $2] || route['OmcApplicationMonitor' + $2]}'`
      })
      data = data + 'end'
      // console.log(data.match(/(?<=export default \[)([\s\S]*)(?=\]([\s\S]*)end)/g));
      const writeData = `module.exports = ${data.match(/(?<=export default \[)([\s\S]*)(?=\]([\s\S]*)end)/g)}`
      fs.writeFile(`./dist/${file}`, writeData, (err) => {
        console.log(err);
      })
    })
  })
})