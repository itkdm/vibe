<template>
  <section class="home-lower">
    <div class="home-lower__intro">
      <h2>先看懂，再说清楚。</h2>
      <p>一个界面效果，配上它的专业名称、使用场景和能直接改写的提示词。</p>
    </div>

    <div class="home-lower__steps" aria-label="学习路径">
      <a class="path-card path-card--blue" href="/overview/#see">
        <span class="path-card__number">01</span>
        <span class="path-card__icon" aria-hidden="true">◉</span>
        <strong>先看效果</strong>
        <span>点击、展开、切换，亲手感受界面如何响应。</span>
        <i aria-hidden="true">↗</i>
      </a>
      <a class="path-card path-card--orange" href="/overview/#name">
        <span class="path-card__number">02</span>
        <span class="path-card__icon" aria-hidden="true">Aa</span>
        <strong>学会叫法</strong>
        <span>认识下拉框、抽屉、模态框等专业词汇。</span>
        <i aria-hidden="true">↗</i>
      </a>
      <a class="path-card path-card--lime" href="/overview/#prompt">
        <span class="path-card__number">03</span>
        <span class="path-card__icon" aria-hidden="true">⌘</span>
        <strong>说清需求</strong>
        <span>把效果、状态和细节写成可复制的提示词。</span>
        <i aria-hidden="true">↗</i>
      </a>
    </div>

    <div class="home-demo-intro">
      <h2>先动手试，再认识它。</h2>
      <p>试试下拉框和抽屉，看看界面状态如何变化，再到概览里学习这些交互的专业名称。</p>
    </div>
    <HomeDemo />

    <div class="home-lower__footnote">
      <span>从看得见的界面开始</span>
      <a href="/overview/">阅读网站概览 <b aria-hidden="true">→</b></a>
    </div>
  </section>
</template>

<script setup lang="ts">
import HomeDemo from './HomeDemo.vue'
</script>
