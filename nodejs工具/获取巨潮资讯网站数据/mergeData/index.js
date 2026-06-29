// readExcel.js
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs').promises

/**
 * 读取Excel文件
 * @param {string} filePath Excel文件路径
 * @returns {Array} 数据数组
 */
async function readExcelFile(filePath) {
  try {
    // 1. 读取工作簿
    const workbook = XLSX.readFile(filePath);
    
    // 2. 获取所有工作表名称
    const sheetNames = workbook.SheetNames;
    console.log('工作表名称:', sheetNames);
    
    // 3. 读取工作表的数据
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      await fs.writeFile(`./json/${sheetName}.js`, `const a = ${JSON.stringify(rawData, null, 2)}\nmodule.exports = a`)
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      await fs.writeFile(`./json/${sheetName}.js`, `const a = ${JSON.stringify(jsonData, null, 2)}\nmodule.exports = a`)
    }

    
    // 4. 转换为JSON数据
    // 方法A: 转换为数组的数组
    // const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // console.log('原始数据:', rawData);
    
    // 方法B: 转换为对象数组（第一行作为键名）
    // const jsonData = XLSX.utils.sheet_to_json(worksheet);
    // console.log('JSON数据:', jsonData);
    
    // 方法C: 转换为CSV格式
    // const csvData = XLSX.utils.sheet_to_csv(worksheet);
    // console.log('CSV数据:', csvData);
    
    return {
      sheetNames,
      // rawData,
      // jsonData,
      // csvData,
      // worksheet
    };
    
  } catch (error) {
    console.error('读取Excel文件失败:', error.message);
    throw error;
  }
}

// 使用示例
const filePath = path.join(__dirname, './工作簿1.xlsx');
readExcelFile(filePath);

// 处理特定工作表
function readSpecificSheet(filePath, sheetName) {
  const workbook = XLSX.readFile(filePath);
  
  if (!workbook.SheetNames.includes(sheetName)) {
    throw new Error(`工作表 ${sheetName} 不存在`);
  }
  
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}