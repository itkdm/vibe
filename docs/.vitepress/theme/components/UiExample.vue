<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  name: string
  usage: string
  prompt: string
}>()

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copyPrompt(prompt: string) {
  try {
    await navigator.clipboard.writeText(prompt)
    copied.value = true
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => { copied.value = false }, 1800)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <article class="ui-example">
    <div class="ui-example__preview" aria-label="组件效果预览">
      <slot name="preview">
        <p class="ui-example__empty">效果代码放在这里</p>
      </slot>
    </div>

    <div class="ui-example__details">
      <h3 class="ui-example__name">{{ name }}</h3>
      <p class="ui-example__usage">
        <span class="ui-example__label">使用场景</span>
        <span>{{ usage }}</span>
      </p>
    </div>

    <section class="ui-example__prompt" aria-label="中文提示词">
      <div class="ui-example__prompt-heading">
        <h4>中文提示词</h4>
        <button type="button" class="ui-example__copy" @click="copyPrompt(prompt)">
          {{ copied ? '已复制' : '复制提示词' }}
        </button>
      </div>
      <p class="ui-example__prompt-text">{{ prompt }}</p>
      <span class="ui-example__sr-only" aria-live="polite">{{ copied ? '提示词已复制到剪贴板' : '' }}</span>
    </section>
  </article>
</template>

<style scoped>
.ui-example {
  --ui-example-border: var(--vp-c-divider);
  --ui-example-muted: var(--vp-c-text-2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin: 0;
  border: 1px solid var(--ui-example-border);
  border-radius: 11px;
  background: var(--vp-c-bg);
  box-shadow: 0 8px 24px rgb(18 35 62 / 5%);
}

.ui-example__preview {
  display: grid;
  min-height: 150px;
  padding: 18px 14px;
  place-items: center;
  border-bottom: 1px solid var(--ui-example-border);
  background-color: var(--vp-c-bg-alt);
}

.ui-example__empty {
  margin: 0;
  color: var(--ui-example-muted);
  font-size: 14px;
}

.ui-example__details,
.ui-example__prompt {
  padding: 12px 14px;
}

.ui-example__details {
  display: grid;
  gap: 6px;
}

.ui-example__name {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
}

.ui-example__usage {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 8px;
  margin: 0;
  color: var(--ui-example-muted);
  font-size: 12px;
  line-height: 1.65;
}

.ui-example__label { color: var(--vp-c-text-3); }

.ui-example__prompt {
  border-top: 1px solid var(--ui-example-border);
}

.ui-example__prompt-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ui-example__prompt-heading h4 {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
}

.ui-example__copy {
  flex: none;
  border: 1px solid var(--ui-example-border);
  border-radius: 7px;
  padding: 5px 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: border-color .18s ease, color .18s ease, background-color .18s ease;
}

.ui-example__copy:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ui-example__copy:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.ui-example__prompt-text {
  margin: 9px 0 0;
  color: var(--vp-c-text-1);
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.ui-example__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@media (max-width: 640px) {
  .ui-example { border-radius: 10px; }
  .ui-example__preview { min-height: 136px; padding: 14px 10px; }
  .ui-example__details,
  .ui-example__prompt { padding: 12px; }
  .ui-example__usage { grid-template-columns: 68px minmax(0, 1fr); gap: 7px; }
}
</style>
