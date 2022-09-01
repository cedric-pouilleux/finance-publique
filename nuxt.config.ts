import { defineNuxtConfig } from 'nuxt'
import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
  css: [
    '@/assets/styles/reset.scss',
    '@/assets/styles/global.scss',
    '@/assets/styles/arimo.scss',
    '@/assets/styles/raleway.scss'
  ],
  buildModules: [
    '@nuxt-hero-icons/outline/nuxt',
    '@nuxt-hero-icons/solid/nuxt'
  ],
  vite: {
    plugins: [
      eslintPlugin()
    ]
  }
})
