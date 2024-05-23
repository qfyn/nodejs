// 处理template中的中文

const fs = require('fs');

function modifyTemplateFile(filePath, fileName) {
  const chineseArr = new Map()
  const leftPanel = fs.readFileSync(filePath)
  const leftPanalStr = leftPanel.toString();
  
  // 提取带有引号的中文
  const templateChineseReg = /('|")([\u4e00-\u9fa5]+?(.*?))('|")/g;;
  const chineseCharacters = leftPanalStr.replace(templateChineseReg, $1 => {
    const chineseReg = /(?<=('|"))([\u4e00-\u9fa5]+?(.*?))(?=('|"))/g;
    const chineseStr = $1.match(chineseReg);
    chineseArr.set(`${chineseStr}`, `'${chineseStr}': '${chineseStr}'`)
    $1 = `t('${fileName}.${chineseStr}')`
    return $1;
  });
  const scriptStr = `import i18n from '@/lang/index'\nconst { t } = i18n.global\n` + chineseCharacters;

  return {vue: scriptStr, chineseDir: [...chineseArr.values()]}
}

module.exports = modifyTemplateFile;