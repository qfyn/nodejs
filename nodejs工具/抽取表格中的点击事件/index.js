const fs = require('fs')


const root = 'F:/hi-fas/hifasGitLab/hi-fasV1.0.4/web/packages/'
const ignoreList = ['.git', 'node_modules', 'build', 'public', 'hi-fas-zlib', 'hi-fas-utils']
function getFile(url) {
  fs.readdir(url, 'utf8', (err, data) => {
    if (err) {
      console.error('readdir', err)
      return
    }

    for (let i = 0; i < data.length; i++) {
      const file = data[i];
      if(ignoreList.includes(file)) {
        continue
      }
      if(file.indexOf('.vue') > -1) {
        readFile(url + file, file)
      } else if(file.indexOf('.') === -1){
        getFile(url + file + '\\')
      }
    }
  })
}
getFile(root)

function readFile(url, file) {
  fs.readFile(url, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const regex = /(?<=(\<fas-table([\s\S]*)\>))[\s\S]*(?=(\<\/fas-table\>))/g
    const regexClick = /(@click)+?/g
    
    data.replace(regex, ($1) => {
      $1.replace(regexClick, ($2) => {
        console.log(url);
      })
    })
  })
}