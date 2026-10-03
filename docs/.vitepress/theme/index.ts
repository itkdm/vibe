import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import UiExample from './components/UiExample.vue'
import ButtonGallery from './components/ButtonGallery.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('UiExample', UiExample)
    app.component('ButtonGallery', ButtonGallery)
  }
} satisfies Theme
