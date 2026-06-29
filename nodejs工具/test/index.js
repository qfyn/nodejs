const fs = require('fs');
const otherRouteZh = require('./routeZh.js');
const otherRouteEn = require('./routeEn.js');
const operationEn = require('./operationEn.js');
const operationZh = require('./operationZh.js');


const routeZh = {}
const routeEn = {}
for (const key in otherRouteZh) {
  const element = otherRouteZh[key];
  if(!operationZh[element]) {
    operationZh[element] = element
  }
  if(!operationEn[element]) {
    operationEn[element] = otherRouteEn[key]
  }
}

fs.writeFileSync('./operationZh.js', `const a = ${JSON.stringify(operationZh, null, 2)}\nmodule.exports = a`)
fs.writeFileSync('./operationEn.js', `const a = ${JSON.stringify(operationEn, null, 2)}\nmodule.exports = a`)
