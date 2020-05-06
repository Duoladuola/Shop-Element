module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        common: '@/common',
        components: '@/components',
        assets: '@/assets',
        network: '@/network',
        views: '@/views'
      }
    }
  }
}
