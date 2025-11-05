// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Nuxt App',
      meta: process.env?.APP_ENV && process.env?.APP_ENV === 'development' ? [
        { name: 'robots', content: 'noindex, nofollow' }
      ] : [],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
        },
        // { rel: 'stylesheet', href: 'https://use.typekit.net/cbl5lct.css' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ]
    },

  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: [
     '~/assets/css/bootstrap.scss',
    //'~/assets/css/main.css',
     '~/assets/css/global.scss',
    //'vue-slick-ts/dist/css/slick.css',
  ],

  devtools: { enabled: true },

  plugins: [
    { src: '~/plugins/bootstrap.js', mode: 'client' },
    { src: '~/plugins/vue-masonry-wall.js', mode: 'client' },
  ],
  site: {
    // url: process.env.WEBSITE_URL,
    title: 'Nuxt App'
  },


  // sitemap: {
  //   sources: ['/api/sitemap'],

  //   defaults: {
  //       changefreq: 'daily',
  //       priority: 1,
  //       lastmod: new Date()
  //   },

  //   exclude: [
  //   ]
  // },

  modules: [
    'nuxt-directus', //'@hypernym/nuxt-gsap',
    'vue3-carousel-nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    "@nuxt/image",
    'dayjs-nuxt',
    '@nuxtjs/sitemap',
    'nuxt-swiper',
    "nuxt-easy-lightbox",
    'nuxt-gtag'
  ],
  build: {
    transpile: ['pinia-plugin-persistedstate', '@vuepic/vue-datepicker'],
  },
  // gtag: {
  //   id: 'G-V4R8R1R7F0'
  // },
  postcss: {
    plugins: {

    },
  },

  runtimeConfig: {
    public: {
      WEBSITE_URL: process.env.WEBSITE_URL,
      FILE_URL: process.env.FILE_URL,
      CMS_URL: process.env.CMS_URL,
    },
    private: {
      FILE_URL: process.env.FILE_URL,
    }
  },
})
