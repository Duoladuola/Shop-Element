module.exports = {
  configureWebpack : {
    resolve : {
      alias : {
        'common' : '@/common',
        'components' : '@/components',
        'assets' : '@/assets',
        'network' : '@/network',
        'views' : '@/views'
      }
    }
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      // 为生产环境修改配置...
      config.entry('app').clear().add('./src/main-prod.js')
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
      config.set('externals', {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'echarts': 'echarts',
        'nprogress': 'NProgress',
        'vue-quill-editor': 'VueQuillEditor '
      })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      // 为生产环境修改配置...
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}