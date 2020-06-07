import colors from 'vuetify/lib/util/colors'
require('dotenv').config()

export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'CrowdScript',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A Transcripting web app for podcasts' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#1abc9c',
    height: '5px',
    continuous: true
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/main.css'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.API_URL
  },

  // proxy: {
  //   '/api/': process.env.NODE_ENV === 'production' ? 'https://crowdscript-api.now.sh' : 'https://crowdscript-api.rex986.now.sh'
  // },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: colors.teal.lighten2,
          secondary: '#b0bec5',
          accent: colors.teal.accent1,
          error: colors.red.lighten1
        }
      }
    }
  }
}
