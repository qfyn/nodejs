const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const tunnel = require('tunnel')

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: 'localhost',
    port: 10809,
  },
});

async function setup() {
  const source = fs.readJSONSync(path.join(__dirname, 'dist/language-files/update.json'))

  for(const item of source) {
    if(!item['en-US']) {
      const { text } = await cheerioPage({ source: item['zh-CN'], group: item.group, key: item.key })
      item['en-US'] = text
    }
    if(!item['es-ES']) {
      const { text } = await cheerioPage({ source: item['zh-CN'], to: 'es', group: item.group, key: item.key })
      item['es-ES'] = text
    }
  }

  fs.writeJSON(path.join(__dirname, 'dist/translate-files/update.json'), source, { spaces: 2 })

  update(source)
}

async function cheerioPage({ source, group, key, to = 'en', from = 'zh-CN' }) {
  return axios({
    url: `https://translate.google.com/m?sl=${from}&tl=${to}&q=${encodeURI(source)}`,
    method: 'get',
    httpsAgent: agent
  }).then(async res => {
    const html = res.data
    const $ = cheerio.load(html)

    let text = $('.result-container').text()
    text = text.replace(text[0], text[0].toLocaleUpperCase())
    console.log(group, key, to, source, text)

    return { group, key, to, text }
  }).catch(err => {
    console.error(err);
  })
}

function update(source) {
  const enLocale = {}
  const esLocale = {}
  source.forEach(item => {
    enLocale[item.group] = { ...enLocale[item.group], [item.key]: item['en-US'] }
    esLocale[item.group] = { ...esLocale[item.group], [item.key]: item['es-ES'] }
  })

  fs.writeJSON(path.join(__dirname, 'dist/translate-files/en-US-update.json'), enLocale, { spaces: 2 })
  fs.writeJSON(path.join(__dirname, 'dist/translate-files/es-ES-update.json'), esLocale, { spaces: 2 })
}

setup()