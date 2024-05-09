const fs = require('fs')
const speUrl = ['Create', 'Edit', 'Detail']
const whiteList = []
fs.readdir('./layerOrigin', 'utf8', (err, data) => {
  data.forEach(async item => {
    const fileData = require(`./layerOrigin/${item}`)
    console.log(fileData.name);
    fileData.children.forEach(child => {
      speUrl.forEach(url => {
        if (child.name.indexOf(url) !== -1) {
          whiteList.push(child.name)
        }
      })
    })
  })
  console.log(whiteList)
})