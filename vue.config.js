// vue.config.js
const path = require('path')
const defaultSettings = require('./src/settings.js')

module.exports = {
    publicPath: './',
    lintOnSave: false,//是否在保存时检查
    devServer: {
        host: 'localhost',//本机ip
        port: 9528,//本项目使用的端口
        open: true,
        proxy: {
        '/dev-api': {  //代理别名
            target: 'http://8.138.108.210:8080/',   //代理目标值
            changeOrigin: true,
            secure: true,
              pathRewrite:{  //替换路径中的/api
              '^/dev-api':'/'
            }
        }
    },
    overlay: {
        warning: false,
        errors: true
    }
  },
  runtimeCompiler: true
}