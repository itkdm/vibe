<script setup lang="ts">
import { ref } from 'vue'

const selected = ref('圆角按钮')
const dropdownOpen = ref(false)
const drawerOpen = ref(false)
const options = ['圆角按钮', '胶囊按钮', '描边按钮']

function chooseOption(option: string) {
  selected.value = option
  dropdownOpen.value = false
}

function closeDemo() {
  dropdownOpen.value = false
  drawerOpen.value = false
}
</script>

<template>
  <section id="demo" class="demo-stage" aria-label="下拉框与抽屉交互演示" @keydown.esc.window="closeDemo">
    <div class="demo-stage__topline">
      <span class="demo-stage__live"><i /> LIVE DEMO</span>
      <span class="demo-stage__index">01 / 02</span>
    </div>

    <div class="demo-window">
      <div class="demo-window__bar">
        <div class="window-dots" aria-hidden="true"><i /><i /><i /></div>
        <span>界面工作台</span>
        <span class="demo-window__status">已预览</span>
      </div>

      <div class="demo-window__body">
        <aside class="demo-rail" aria-hidden="true">
          <span class="demo-rail__mark">v.</span>
          <i class="demo-rail__icon demo-rail__icon--active">▧</i>
          <i class="demo-rail__icon">◫</i>
          <i class="demo-rail__icon">⌘</i>
          <span class="demo-rail__line" />
          <i class="demo-rail__avatar">V</i>
        </aside>

        <div class="demo-canvas">
          <div class="demo-canvas__eyebrow">BUTTON / VARIANT</div>
          <div class="demo-canvas__title">选择一种样式</div>
          <p class="demo-canvas__copy">点开下拉菜单，看看同一个按钮如何切换外观。</p>

          <div class="demo-control">
            <button
              class="demo-select"
              type="button"
              aria-haspopup="listbox"
              :aria-expanded="dropdownOpen"
              @click="dropdownOpen = !dropdownOpen"
            >
              <span>{{ selected }}</span>
              <svg :class="{ 'is-open': dropdownOpen }" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
            </button>
            <div v-if="dropdownOpen" class="demo-options" role="listbox" aria-label="按钮样式">
              <button
                v-for="(option, index) in options"
                :key="option"
                type="button"
                role="option"
                :aria-selected="selected === option"
                class="demo-options__item"
                @click="chooseOption(option)"
              >
                <span class="demo-options__swatch" :class="`swatch-${index + 1}`" />
                {{ option }}
                <span v-if="selected === option" class="demo-options__check">✓</span>
              </button>
            </div>
          </div>

          <div class="demo-canvas__divider" />
          <div class="demo-canvas__bottom">
            <div class="demo-mini-note"><span>术语</span><b>Dropdown</b></div>
            <button class="demo-open-drawer" type="button" @click="drawerOpen = true">
              试试抽屉 <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <Transition name="drawer">
          <div v-if="drawerOpen" class="drawer-backdrop" @click.self="drawerOpen = false">
            <section class="demo-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
              <div class="demo-drawer__handle" />
              <button class="demo-drawer__close" type="button" aria-label="关闭抽屉" @click="drawerOpen = false">×</button>
              <span class="demo-drawer__eyebrow">DRAWER / RIGHT</span>
              <h2 id="drawer-title">侧边抽屉</h2>
              <p>从屏幕边缘滑出的面板。它保留当前页面上下文，适合展示补充信息或快捷操作。</p>
              <div class="demo-drawer__sample"><span>常用术语</span><strong>Drawer</strong><small>也常叫 Side panel</small></div>
              <button class="demo-drawer__done" type="button" @click="drawerOpen = false">明白了</button>
            </section>
          </div>
        </Transition>
      </div>
    </div>

    <div class="demo-stage__caption"><span>拖动与点击都可以试试</span><span>下拉框 · 侧边抽屉</span></div>
  </section>
</template>
