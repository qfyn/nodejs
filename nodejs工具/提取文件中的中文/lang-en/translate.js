const axios = require('axios')

function translate(queryField) {
  return new Promise((resolve, reject) => {
    const resultData = []
    axios({
      url: 'https://fanyi.baidu.com/ait/text/translate',
      method: 'post',
      responseType: 'stream',
      headers: {
        Accept: 'text/event-stream',
        'Content-Type': 'application/json',
        'Acs-Token':
          '1715169662465_1715210594451_jztxJnmNdFy6qvLT20tI7lMswUh0Bi7iDAwz6JAM2q/nqFuunuBFzzOMEo5kW6JcFPs14+9rbmVQedScWY1KjNUKzS1ICeJh6RGPscEq+GnFIh1xZBzCPp4v3pMjgtWwFwXRBQP+9Z0p/MTPdsXeCY3J/8/vtTBtHt7VRCYxnAEkoe6DSjZomf7xz+hFKRFAuG1mbKghS9P2hxI3q7tQkLdYhADMeDovp9FZCFbtmS7cA/hPa3erZZDdAzFtJL7bsbx1v2UUL1rJzFnlMboX7a1HEIFKPpGklbIvA/sEReyW4qpYWDzq3CkOXilR9mZbcDUBnTFmgZTOFX/ByKQxsbwvWl13SUc2UGO+E0V/6Vi6PqvjtWb9zANIh4Mds6n/eM3bcL716R6dKzGCBxumB92K7H9TKPoRzfXFEYxhtTl1ZfhdgrvF3kardZoPznqu',
        Cookie:
          'BIDUPSID=6C11DCFE20E3A720F3D054F7FFC23A33; PSTM=1559491371; BAIDUID_BFESS=718DD1CFAA8E050ED94D20B4EAED6FF0:FG=1; BAIDU_WISE_UID=wapp_1700275647506_245; ZFY=yQXl:AZGSpFKVm1WFWyoIXeBm6W7bMlStSQKQWDXZ9:B0:C; Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1700291294; BDUSS=JmMC03QXdUV1o3aVd5ZS1zVm9sZUJaN3Z6Q01MRGZBTFUtMU1UU3VJT0FJeDltSVFBQUFBJCQAAAAAAAAAAAEAAACkQkl9bHVja2RvZ7CyusMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICW92WAlvdldj; BDUSS_BFESS=JmMC03QXdUV1o3aVd5ZS1zVm9sZUJaN3Z6Q01MRGZBTFUtMU1UU3VJT0FJeDltSVFBQUFBJCQAAAAAAAAAAAEAAACkQkl9bHVja2RvZ7CyusMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICW92WAlvdldj; ab_sr=1.0.1_ZjhhMGI2Y2M4NjJjNmRjYjE4YmQ4YWY5ZTNlMTA4ZDRlN2YzYzIzNjljZmFjNzQ0MGQ5ZjlmN2FjMWYzOTMzMmE2ODdiNDljYzM5ZTQxOGNkODhmZTQxYTMxNGQ3NDYyODYzOGE0NDgzMGNmNWRhYmNjMzVjYjgwMDc0ZTA4YzUwZTBlN2E3NDg2YjIzYTRmMzA5ODYxODY2OTNlNTNmNA==; RT="z=1&dm=baidu.com&si=3ede3262-117e-4867-ba8e-eb990c786e75&ss=lvyf17tb&sl=2&tt=5no&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=jcm"',
      },
      data: {
        query: queryField,
        from: 'zh',
        to: 'en',
        reference: '',
        corpusIds: [],
        qcSettings: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        needPhonetic: false,
        domain: 'common',
        milliTimestamp: 1715210594495,
      },
    })
    .then((res) => {
      res.data.on('data', (chunk) => {
        resultData.push(chunk.toString())
        const data = chunk.toString()
        if (data.indexOf('"event":"TranslationSucceed"') !== -1) {
          const translateMsg = resultData[resultData.length - 2]
          const reg = /\[.*\]/g
          if(JSON.parse(translateMsg.match(reg))){
            const translateData = JSON.parse(translateMsg.match(reg)[0])
            let str = ''
            console.log(translateData);
            translateData.forEach(element => {
              str += element.dst
            });
            resolve(str)
          } else {
            resolve()
          }
        }
      })
    })
    .catch((err) => {
      console.log(err)
      resolve()
    })
  })
}

module.exports = translate

