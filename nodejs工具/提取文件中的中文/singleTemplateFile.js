// 处理template中的中文

const fs = require('fs');

function modifyTemplateFile(filePath, fileName) {
  const chineseArr = new Map()
  const leftPanel = fs.readFileSync(filePath)
  const leftPanalStr = leftPanel.toString();
  
  // 获取template中的内容
  const templateReg = /<template>([\s\S]*)<\/template>/;
  const templateStr = leftPanalStr.replace(templateReg, t$1 => {
    // 提取template标签元素中的带有引号的中文
    const templateChineseReg = /[a-z-]+?=('|")([\u4e00-\u9fa5]+?(.*?))('|")/g;
    const chineseCharacters = t$1.replace(templateChineseReg, $1 => {
      // 获取引号中的中文
      const chineseReg = /(?<=('|"))([\u4e00-\u9fa5]+?(.*?))(?=('|"))/g;
      const chineseStr = $1.match(chineseReg);
      const label = $1.split('=')[0];
      chineseArr.set(`${chineseStr}`, `'${chineseStr}': '${chineseStr}'`)
      $1 = `:${label}="t('${fileName}.${chineseStr}')"`
      return $1;
    });

    // 提取template中的<></>标签内的中文---不带引号
    const tagReg = /(?<=(>[\s]*?))[\u4e00-\u9fa5]+?(.*?)(?=([\s]*?(<|{)))/g;
    const tagCharacters = chineseCharacters.replace(tagReg, $1 => {
      chineseArr.set(`${$1}`, `'${$1}': '${$1}'`)
      $1 = `{{ t('${fileName}.${$1}') }}`
      return $1;
    })

    // 提取template中的<></>标签内的中文---带引号
    const tagQuoReg = /('|")([\u4e00-\u9fa5]+?)('|")/g;
    const resultVue = tagCharacters.replace(tagQuoReg, $1 => {
      const reg = /(?<=('|"))([\u4e00-\u9fa5]+?)(?=('|"))/g;
      const value = $1.match(reg);
      chineseArr.set(`${value}`, `'${value}': '${value}'`)
      $1 = `t('${fileName}.${value}')`
      return $1;
    })
    return resultVue
  });

  // 获取script中的内容
  const scriptReg = /(?<=(<script lang="ts">))([\s\S]*)(?=(<\/script>))/;
  const scriptStr = templateStr.replace(scriptReg, s$1 => {
    // 提取引号内的中文---带引号
    const tagQuoReg = /('|")([\u4e00-\u9fa5]+?(.*?))('|")/g;
    const resultVue = s$1.replace(tagQuoReg, $1 => {
      // 提取引号内的中文---不带引号
      const reg = /(?<=('|"))([\u4e00-\u9fa5]+?(.*?))(?=('|"))/g;
      const value = $1.match(reg);
      chineseArr.set(`${value}`, `'${value}': '${value}'`)
      // 添加翻译('t(fileName.value)')
      $1 = `t('${fileName}.${value}')`
      return $1;
    })

    // 添加import { useI18n } from 'vue-i18n'
    s$1 = `\r\nimport { useI18n } from 'vue-i18n'${resultVue}`
    return s$1
  });

  // 获取script中的'setup(){'后面的内容----添加const { t } = useI18n()
  const scriptI18nReg = /(?<=(setup\([\s\S]*\) {))([\s\S]*)/;
  const scriptI18nStr = scriptStr.replace(scriptI18nReg, i$1 => {
    // 添加const { t } = useI18n()
    i$1 = `\r\nconst { t } = useI18n()${i$1}`
    return i$1
  });


  // // 获取script中setup()中最后一个'return {'后面的内容----添加t,
  // const scriptReturnReg = /(?<=(return([\s]*?){))([\s\S]*?)/g;
  // const scriptReturnStr = i$1.replace(scriptReturnReg, r$1 => {
  //   // 提取引号内的中文---带引号
  //   r$1 = `\r\nt,\r\n${r$1}`
  //   return r$1
  // });

  return {vue: scriptI18nStr, chineseDir: [...chineseArr.values()]}
}

module.exports = modifyTemplateFile;