const fs = require('fs')

const htmlArr = []
fs.readdir('../result/', (err, files) => {
  if (err) {
    console.log('err');
    return
  }
  files.forEach(file => {
    fs.readFile(`../result/${file}`, 'utf8', (err, data) => {
      if (err) {
        console.log('err');
        return
      }
      const newData = data.toString()
      htmlArr.push(newData)
    })
  })
})

setTimeout(() => {
  fs.writeFileSync('./docx/htmlArr.json', JSON.stringify(htmlArr))
  // console.log(htmlArr);
},2000)
