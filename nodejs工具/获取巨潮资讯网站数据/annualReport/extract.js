/**
 * 从文本中提取监事会会议参与人数信息（优化版）
 * @param {string} text - 包含监事会会议信息的文本
 * @returns {object|null} 包含应到人数和实到人数的对象，或 null 如果未匹配到
 */
function extractSupervisorMeetingInfo(text) {
    // 预处理文本：规范化处理
    // const processedText = preprocessText(text);
    // console.log(processedText)

    // 定义完整匹配模式（按优先级排序）
    const patterns = [
        // { 
        //     pattern: /七、董事会下设专门委员会在报告期内(?:[\s\S]*)?情况([\s\S]*?)八、监事会工作情况/,
        //     name: '七、董事会下设专门委员会在报告期内的情况 XXX  八、监事会工作情况',
        // },
        { 
            pattern: /在其他单位任职情况([\s\S]*)（三）报告期内变更的董事、监事及高级管理人员的姓名及变更原因 /,
            name: '七、董事会下设专门委员会在报告期内的情况 XXX  八、监事会工作情况',
        }
    ];
    // 尝试匹配每种模式
    for (let i = 0; i < patterns.length; i++) {
        const patternObj = patterns[i];
        const match = text.match(patternObj.pattern);
        
        if (match) {

          console.log(match[1]);
          const match1 = match[1].replace(/\s+/g, ' ')
        //   const match1 = match1.match(/刘姝威\s/g, ' ')
          console.log(match1);
          return {
              success: true,
              test: match[1]
          };
        }
    }
    
    // 如果没有匹配到，尝试更通用的模式（备用）
    return null
}

/**
 * 预处理文本，处理换行和特殊字符
 */
function preprocessText(text) {
    return text
        // 处理各种换行符
        // .replace(/\r\n|\r|\n/g, '')
        // 替换中文标点为英文逗号，方便统一匹配
        .replace(/[，,。；;、]/g, ',')
        // 合并多个空格为一个
        .replace(/\s+/g, '')
        // 去除首尾空格
        .trim();
}


// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractSupervisorMeetingInfo,
        preprocessText,
    };
}

/**
 * 使用示例
 */
function usageExample() {
    // 示例1：单个文本提取
    const text1 = "本次 应参会监事 5 名，实际 参会监事 5 名。";
    const result1 = extractSupervisorMeetingInfo(text1);
    console.log("示例1:", result1);
    
    // 示例2：处理换行文本
    const text2 = `本次监事会应出席
监事3人，实际出席会议人数为3人，`;
    const result2 = extractSupervisorMeetingInfo(text2);
    console.log("示例2 (换行文本):", result2);
    
}

// 运行示例
// usageExample();