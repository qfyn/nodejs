const fs = require('fs-extra')
const path = require('path')

const updateList = ['zh-CN', 'en-US', 'es-ES']
const result = {}

function addI18n(data, lang) {
  for (const group in data) {
    for (const key in data[group]) {
      const tempKey = `${group}_${key}`
      const locale = data[group][key]
      if (result[tempKey]) {
        result[tempKey][lang] = locale
      } else {
        result[tempKey] = {
          group,
          key,
          [lang]: locale
        }
      }
    }
  }
}

function setup() {
  updateList.forEach(item => {
    const locale = fs.readJSONSync(path.join(__dirname, `src/update-files/${item}.json`))

    addI18n(locale, item)
  })

  const localeArr = Object.values(result)

  fs.writeJSON(path.join(__dirname, 'dist/language-files/update.json'), localeArr, { spaces: 2 })
}

setup()