const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: "phase10_web_vue",
    themeColor: '#efa032',
    mobileWebAppCapable: 'yes',
    mobileWebAppCache:'yes',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppCache: 'yes',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: '/index.html',
      skipWaiting: true,
      clientsClaim: true
    },
    manifestOptions: {
      name: "phase10_web_vue",
      short_name: "phase10_web_vue",
      start_url: '.',
      display: 'standalone',
      theme_color: '#efa032'
    }
  }
})