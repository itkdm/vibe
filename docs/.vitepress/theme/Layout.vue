<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import HomeDemo from './components/HomeDemo.vue'
import HomeLower from './components/HomeLower.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <HomeDemo />
    </template>
    <template #home-hero-after>
      <HomeLower />
    </template>
  </Layout>
</template>
