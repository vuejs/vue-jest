const cssExtract = require('extract-from-css')
module.exports = function (cssContent, config, attrs) {
    const cssNames = cssExtract.extractClasses(cssContent)
    const obj = {}
    for (let i = 0, l = cssNames.length; i < l; i++) {
        obj[cssNames[i]] = cssNames[i]
    }

    if (attrs.themed) {
        return {
            light: obj,
            dark: obj
        }
    }
    return obj;

}