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
      name: "Malefiz",
      short_name: "Malefiz",
      start_url: '.',
      display: 'standalone',
      theme_color: '#efa032'
    }
  }
})