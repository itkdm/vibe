<script setup lang="ts">
import UiExample from './UiExample.vue'
import ButtonPreview from './ButtonPreview.vue'
import { buttonExamples } from '../../button-examples'

const props = defineProps<{ group: keyof typeof buttonExamples }>()
</script>

<template>
  <div class="ui-example-grid button-gallery">
    <UiExample
      v-for="example in buttonExamples[props.group]"
      :key="example.variant"
      :name="example.name"
      :usage="example.usage"
      :prompt="example.prompt"
    >
      <template #preview>
        <ButtonPreview :variant="example.variant" />
      </template>
    </UiExample>
  </div>
</template>

<style scoped>
.button-gallery :deep(.ui-example__preview) {
  min-height: 132px;
  background:
    radial-gradient(ellipse at 50% 115%, rgb(37 86 220 / 8%), transparent 62%),
    var(--vp-c-bg-alt);
}

@media (max-width: 640px) {
  .button-gallery :deep(.ui-example__preview) { min-height: 120px; }
}
</style>
