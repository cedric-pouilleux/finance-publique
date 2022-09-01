import { defineNuxtConfig } from 'nuxt'
import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
  css: [
    '@/assets/styles/reset.scss',
    '@/assets/styles/global.scss',
    '@/assets/styles/arimo.scss',
    '@/assets/styles/raleway.scss'
  ],
  experimental: {
    reactivityTransform: true,
    viteNode: false
  },
  modules: [
    '@nuxt-hero-icons/outline/nuxt',
    '@nuxt-hero-icons/solid/nuxt'
  ],
  // https://github.com/nuxt/framework/issues/6204#issuecomment-1201398080
  hooks: {
    'vite:extendConfig': function (config: any, { isServer }: any) {
      if (isServer) {
        // Workaround for netlify issue
        // https://github.com/nuxt/framework/issues/6204
        config.build.rollupOptions.output.inlineDynamicImports = true
      }
    }
  },
  vite: {
    plugins: [
      eslintPlugin()
    ]
  }
})
