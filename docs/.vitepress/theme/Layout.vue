<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import HomeLower from './components/HomeLower.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-after>
      <HomeLower />
    </template>
  </Layout>
</template>
