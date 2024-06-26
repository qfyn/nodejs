var fs = require('fs');
var path = require('path');

//要遍历的文件夹所在的路径
var filePath = path.resolve('src/');

//调用文件遍历方法
fileDisplay(filePath);

const map = new Map()
let saveSysData = {}
const systemName = 'message'

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function(err, files) {
        if (err) {
            console.warn(err, "读取文件夹错误！")
        } else {
            //遍历读取到的文件列表
            for (let i = 0; i < files.length; i++) {

              const filename = files[i];
              // files.forEach((filename) => {
              // 获取当前文件的绝对路径
              const filedir = path.join(filePath, filename);

                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, function(eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile(); //是文件
                        var isDir = stats.isDirectory(); //是文件夹
                        if (isFile && filedir.split('.')[1] === 'vue') {
                            // 组成按钮名称的文件路径
                            let filePathCut = ''
                            // 截取文件路径
                            const regUrl = /H:\\test\\nodejs\\file\\src\\views\\(.*?).vue/g
                            let urlArr = ''
                            let newPath = ''
                            let newFileName = ''
                             filedir.replace(regUrl, (match, $1) => {
                              urlArr = $1.split('\\')
                            })
                            newFileName = urlArr[urlArr.length - 1]
                            newPath = urlArr.slice(0,urlArr.length - 1).join('\\')
                            if(urlArr[urlArr.length - 1] === 'index') {
                              urlArr = urlArr.slice(0,urlArr.length - 1)
                            }
                            const siteIndex = urlArr.findIndex(urlArriItem => urlArriItem === 'base-station')
                            if(siteIndex !== -1) urlArr[siteIndex] = 'site'
                            if(!urlArr.includes('components')) {
                            // 字段转为驼峰的写法
                            const regHump =/-(\w)/g;
                            filePathCut = urlArr.join('-').replace(regHump, ($match,re) => {
                              return re.toUpperCase();
                            });
              
                            fs.readFile(filedir, 'utf8', function(err,dataStr) {
                              const reg = /<el-button([\s\S]*?)>([\s\S]*?)<\/el-button>/g
                              // const buttonPro = `v-permit="$permitKeys.${filePathCut}.${str}"`
                              dataStr = dataStr.replace(reg,(pmatch, p$1, p$2) => {
                                  // 提取button的名字
                                  const regName = /\$t\('(.*?)\.(.*?)'\)/g
                                  let buttonPro = ''
                                  pmatch.replace(regName,(match, $1, $2) => {
                                    if($2 !== 'Query') {
                                      // 第一个字符小写
                                      const str = $2.replace($2[0],$2[0].toLowerCase())
                                      buttonPro = `v-permit="$permitKeys.${filePathCut}.${str}"`
                                    }
                                  })
                                  p$1 = p$1 + ' ' + buttonPro
                                  return  `<el-button ${p$1}>${p$2}<\/el-button>`
                              })
                              fs.rm('./dist/', {recursive : true},(error) => {
                                if(error) {
                                  console.log('delete error');
                                } else {
                                  fs.mkdir('H:\\test\\nodejs\\file\\dist\\'+ newPath, { recursive: true }, (err, data) => {
                                    if(err) {
                                      console.log('err');
                                    } else {
                                      fs.writeFile('H:\\test\\nodejs\\file\\dist\\'+ newPath + '\\' + newFileName + '.vue', dataStr, (error) => {
                                        if(error) {
                                          console.log('error');
                                        } else {
                                          console.log('success');
                                        }
                                      })
                                    }
                                  })
                                }
                              })
                              
                              
                            })
                          }
                            
                        }
                        if (isDir) {
                            fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            // });
            }
        }
    });

}

// 存储按钮对象
function saveMap(str, filePathCut) {
  const buttonName = systemName + '-' + filePathCut + '-' + str
  const result = {
    [filePathCut]: {
      [str]: buttonName
    }
  }
  if(!map.has(filePathCut)) {
    map.set(filePathCut, result)
  } else {
    map.get(filePathCut)[filePathCut][str] = buttonName
  }
}

// // 保存文件
// setTimeout(async() => {
//   const list = [...map.values()]
//   for (let i = 0; i < list.length; i++) {
//     const element = list[i];
//     if(JSON.stringify(element) !== '{}') 
//     saveSysData = { ...saveSysData, ...element }
//   }
//   fs.writeFile('./dist/list.js', `const ${systemName} = `+ JSON.stringify(saveSysData), (error) => {
//     if(error) {
//       console.log('error');
//     } else {
//       console.log('success');
//     }
//   })
// }, 2000);
