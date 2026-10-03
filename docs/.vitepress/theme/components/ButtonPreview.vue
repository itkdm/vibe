<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{ variant: string }>()
const selected = ref(0)
const toggled = ref(false)
const dangerConfirm = ref(false)
const menuOpen = ref(false)
const rootElement = ref<HTMLElement>()
const copied = ref(false)
const loading = ref(false)
const filters = ref(new Set<number>())
let feedbackTimer: ReturnType<typeof setTimeout> | undefined
const hasPopover = ['group-split', 'fab-group', 'more-menu', 'more-combo', 'more-overflow'].includes(props.variant)

function startLoading() {
  if (loading.value) return
  loading.value = true
  feedbackTimer = setTimeout(() => { loading.value = false }, 1100)
}

function toggleFilter(index: number) {
  const next = new Set(filters.value)
  next.has(index) ? next.delete(index) : next.add(index)
  filters.value = next
}

async function copyValue() {
  try {
    await navigator.clipboard.writeText('https://vibe.itkdm.com/components/')
    copied.value = true
    if (feedbackTimer) clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => { copied.value = false }, 1400)
  } catch {
    copied.value = false
  }
}

function closePopoverOnOutside(event: PointerEvent) {
  if (event.target instanceof Node && !rootElement.value?.contains(event.target)) menuOpen.value = false
}

function movePopoverFocus(direction: number) {
  const items = rootElement.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
  if (!items?.length) return
  const currentIndex = Array.from(items).indexOf(document.activeElement as HTMLButtonElement)
  const nextIndex = currentIndex < 0 ? (direction > 0 ? 0 : items.length - 1) : (currentIndex + direction + items.length) % items.length
  items[nextIndex].focus()
}

onMounted(() => { if (hasPopover) document.addEventListener('pointerdown', closePopoverOnOutside) })
onUnmounted(() => {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  if (hasPopover) document.removeEventListener('pointerdown', closePopoverOnOutside)
})
</script>

<template>
  <div ref="rootElement" class="button-preview" :class="`is-${variant}`" @keydown.esc.prevent="menuOpen = false" @keydown.down="menuOpen && movePopoverFocus(1)" @keydown.up="menuOpen && movePopoverFocus(-1)">
    <template v-if="variant.startsWith('button-')">
      <button type="button" class="action-button" :class="variant" :disabled="variant === 'button-disabled' || (variant === 'button-loading' && loading)" @click="variant === 'button-loading' ? startLoading() : variant === 'button-danger' ? dangerConfirm = !dangerConfirm : undefined">
        <span v-if="variant === 'button-loading' && loading" class="spinner" aria-hidden="true" />
        <span v-else-if="variant === 'button-loading'" class="button-refresh" aria-hidden="true">↻</span>
        {{ variant === 'button-loading' && loading ? '处理中' : variant === 'button-danger' ? (dangerConfirm ? '确认删除？' : '删除') : variant === 'button-dashed' ? '＋ 添加' : variant === 'button-secondary' ? '取消' : variant === 'button-text' ? '了解更多' : variant === 'button-block' ? '继续' : '确定' }}
      </button>
    </template>

    <template v-else-if="variant.startsWith('icon-')">
      <button type="button" class="icon-button" :class="variant" :disabled="variant === 'icon-disabled'" :aria-label="variant === 'icon-toggle' ? (toggled ? '取消收藏' : '收藏') : variant === 'icon-secondary' ? '编辑' : variant === 'icon-ghost' ? '更多' : '添加'" :aria-pressed="variant === 'icon-toggle' ? toggled : undefined" @click="variant === 'icon-toggle' ? toggled = !toggled : undefined">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path v-if="variant === 'icon-primary' || variant === 'icon-circle' || variant === 'icon-disabled'" d="M12 5v14M5 12h14" />
          <path v-else-if="variant === 'icon-secondary'" d="m14.5 6.5 3 3M5 19l4-.8L18 9a2.1 2.1 0 0 0-3-3l-9 9L5 19Z" />
          <path v-else-if="variant === 'icon-ghost'" d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3" />
          <path v-else-if="variant === 'icon-square'" d="M5 5h14v14H5zM9 9h6v6H9z" />
          <path v-else d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.6Z" :fill="toggled ? 'currentColor' : 'none'" />
        </svg>
      </button>
    </template>

    <template v-else-if="variant === 'group-horizontal' || variant === 'group-vertical'">
      <div class="button-group" :class="variant" role="group" aria-label="按钮组">
        <button v-for="(label, index) in ['上一步', '下一步', '完成']" :key="label" type="button" :aria-pressed="selected === index" :class="{ selected: selected === index }" @click="selected = index">{{ label }}</button>
      </div>
    </template>
    <template v-else-if="variant === 'group-split'">
      <div class="split-control" :class="{ 'menu-open': menuOpen }">
        <button type="button" class="action-button button-primary" @click="menuOpen = false">保存</button>
        <button type="button" class="split-arrow" aria-label="更多保存选项" aria-haspopup="menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
          <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4" /></svg>
        </button>
        <div v-if="menuOpen" class="mini-menu" role="menu"><button type="button" role="menuitem" @click="menuOpen = false">另存为副本</button><button type="button" role="menuitem" @click="menuOpen = false">保存并关闭</button></div>
      </div>
    </template>

    <template v-else-if="variant.startsWith('segment-')">
      <div class="segment-control" :class="variant" role="group" aria-label="分段控制">
        <button v-for="(label, index) in ['列表', '网格', '紧凑']" :key="label" type="button" :disabled="variant === 'segment-disabled'" :aria-pressed="selected === index" :class="{ selected: selected === index }" @click="selected = index">
          <span v-if="variant.includes('icon')" aria-hidden="true">{{ ['▤', '▦', '☷'][index] }}</span>{{ variant.includes('icon-text') ? ` ${label}` : variant.includes('icon') ? '' : label }}
        </button>
      </div>
    </template>

    <template v-else-if="variant.startsWith('toggle-')">
      <button v-if="variant === 'toggle-text' || variant === 'toggle-icon' || variant === 'toggle-disabled'" type="button" class="toggle-control" :class="[variant, { active: toggled }]" :disabled="variant === 'toggle-disabled'" :aria-pressed="toggled" @click="toggled = !toggled"><span v-if="variant === 'toggle-icon'" aria-hidden="true">{{ toggled ? '♥' : '♡' }}</span>{{ variant === 'toggle-text' ? (toggled ? '已开启' : '提醒') : variant === 'toggle-disabled' ? '已关闭' : '' }}</button>
      <div v-else class="toggle-group" :class="variant" role="group" :aria-label="variant === 'toggle-single' ? '单选切换' : '多选切换'">
        <button v-for="(label, index) in ['日', '周', '月']" :key="label" type="button" :aria-pressed="variant === 'toggle-single' ? selected === index : filters.has(index)" :class="{ selected: variant === 'toggle-single' ? selected === index : filters.has(index) }" @click="variant === 'toggle-single' ? selected = index : toggleFilter(index)">{{ label }}</button>
      </div>
    </template>

    <template v-else-if="variant.startsWith('fab-')">
      <div class="fab-wrap">
        <div v-if="variant === 'fab-group' && menuOpen" class="fab-actions" role="menu"><button type="button" role="menuitem" title="新增文章" @click="menuOpen = false">文章</button><button type="button" role="menuitem" title="上传文件" @click="menuOpen = false">文件</button></div>
        <button type="button" class="fab" :class="variant" :aria-label="variant === 'fab-badge' ? '查看 3 条新消息' : variant === 'fab-tooltip' ? '发送反馈' : '新增内容'" :aria-haspopup="variant === 'fab-group' ? 'menu' : undefined" :aria-expanded="variant === 'fab-group' ? menuOpen : undefined" @click="variant === 'fab-group' ? menuOpen = !menuOpen : undefined"><span aria-hidden="true">{{ variant === 'fab-tooltip' ? '✳' : variant === 'fab-badge' ? '✉' : menuOpen ? '×' : '＋' }}</span><span v-if="variant === 'fab-extended'">新建</span><span v-if="variant === 'fab-badge'" class="fab-count">3</span></button>
      </div>
    </template>

    <template v-else-if="variant.startsWith('link-')">
      <a v-if="variant !== 'link-disabled'" href="#button-link-preview" class="link-control" :class="variant" @click.prevent>{{ variant === 'link-icon' ? '查看详情 ↗' : variant === 'link-danger' ? '删除项目' : '了解更多' }}</a>
      <span v-else class="link-control link-disabled" aria-disabled="true">暂不可用</span>
    </template>

    <template v-else-if="variant.startsWith('copy-')">
      <button type="button" class="copy-control" :class="[variant, { copied }]" :aria-label="variant === 'copy-icon' ? '复制' : undefined" :title="variant === 'copy-tooltip' ? (copied ? '已复制' : '复制') : undefined" @click="copyValue">
        <svg v-if="!copied && variant !== 'copy-success'" class="copy-glyph" aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
        <span v-else aria-hidden="true">✓</span>{{ variant === 'copy-text' || variant === 'copy-success' ? (copied || variant === 'copy-success' ? '已复制' : '复制') : '' }}
      </button>
    </template>

    <template v-else-if="variant.startsWith('top-')">
      <button type="button" class="top-button" :class="variant" aria-label="返回顶部"><span aria-hidden="true">↑</span></button>
    </template>

    <template v-else>
      <div class="more-control" :class="{ 'split-control': variant === 'more-combo', 'overflow-control': variant === 'more-overflow' }">
        <template v-if="variant === 'more-combo'"><button type="button" class="action-button button-primary">新建</button><button type="button" class="split-arrow" aria-label="其他新建方式" aria-haspopup="menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen"><svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4" /></svg></button></template>
        <button v-else-if="variant === 'more-overflow'" type="button" class="overflow-action">分享</button>
        <button v-if="variant !== 'more-combo'" type="button" class="more-trigger" :aria-label="variant === 'more-menu' ? '打开操作菜单' : '更多操作'" aria-haspopup="menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen"><svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><circle cx="4" cy="10" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="16" cy="10" r="1.7"/></svg></button>
        <div v-if="menuOpen" class="mini-menu" role="menu"><button type="button" role="menuitem" @click="menuOpen = false">复制链接</button><button type="button" role="menuitem" @click="menuOpen = false">移动</button><button type="button" role="menuitem" @click="menuOpen = false">删除</button></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.button-preview {
  --blue: var(--vp-c-brand-1);
  --blue-soft: var(--vp-c-brand-soft);
  --line: var(--vp-c-divider);
  --text: var(--vp-c-text-1);
  --muted: var(--vp-c-text-2);
  position: relative;
  display: flex;
  width: 100%;
  min-height: 94px;
  align-items: center;
  justify-content: center;
  color: var(--text);
  font-family: var(--vp-font-family-base);
}
button, a { font: inherit; }
button { cursor: pointer; }
button:focus-visible, a:focus-visible { outline: 3px solid color-mix(in srgb, var(--blue) 42%, transparent); outline-offset: 3px; }
button:disabled { cursor: not-allowed; }
.action-button, .icon-button, .copy-control, .toggle-control, .more-trigger, .split-arrow, .segment-control button, .toggle-group button, .button-group button {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 38px; border: 1px solid transparent; border-radius: 8px; padding: 0 14px; font-size: 13px; font-weight: 600; line-height: 1;
  transition: color .16s ease, background-color .16s ease, border-color .16s ease, transform .16s ease, box-shadow .16s ease;
}
.action-button:hover:not(:disabled), .icon-button:hover:not(:disabled), .fab:hover, .top-button:hover { transform: translateY(-1px); }
.button-primary { background: var(--blue); color: #fff; box-shadow: 0 3px 8px color-mix(in srgb, var(--blue) 20%, transparent); }
.button-primary:hover { filter: brightness(1.06); }
.button-secondary { border-color: var(--line); background: var(--vp-c-bg); color: var(--text); }
.button-secondary:hover { border-color: var(--blue); color: var(--blue); }
.button-dashed { border: 1px dashed color-mix(in srgb, var(--blue) 60%, var(--line)); background: transparent; color: var(--blue); }
.button-dashed:hover { background: var(--blue-soft); }
.button-text { padding-inline: 9px; background: transparent; color: var(--blue); }
.button-text:hover { background: var(--blue-soft); }
.button-ghost { border-color: color-mix(in srgb, var(--blue) 40%, var(--line)); background: transparent; color: var(--blue); }
.button-ghost:hover { background: var(--blue-soft); }
.button-danger { background: #d9363e; color: #fff; }
.button-danger:hover { background: #bd2630; }
.button-loading { min-width: 92px; background: var(--blue); color: #fff; }
.button-disabled { background: var(--blue); color: #fff; opacity: .42; }
.button-block { width: min(100%, 300px); background: var(--blue); color: #fff; }
.spinner { width: 14px; height: 14px; border: 2px solid rgb(255 255 255 / 40%); border-top-color: #fff; border-radius: 50%; animation: spin .65s linear infinite; }
.button-refresh { font-size: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

.icon-button { width: 42px; height: 42px; padding: 0; font-size: 19px; }
.icon-primary, .icon-circle { background: var(--blue); color: #fff; }
.icon-secondary, .icon-square { border-color: var(--line); background: var(--vp-c-bg); color: var(--text); }
.icon-secondary:hover, .icon-square:hover { border-color: var(--blue); color: var(--blue); }
.icon-ghost { background: transparent; color: var(--muted); }
.icon-ghost:hover { background: var(--blue-soft); color: var(--blue); }
.icon-circle { border-radius: 50%; }
.icon-square { border-radius: 10px; }
.icon-toggle[aria-pressed="true"] { color: #d99a0b; background: #fff4d5; }
.icon-toggle[aria-pressed="true"] svg { animation: icon-pop .22s ease-out; }
@keyframes icon-pop { 50% { transform: scale(1.2); } }
.icon-disabled { background: var(--vp-c-bg-soft); color: var(--muted); opacity: .46; }

.button-group { display: flex; }
.button-group button { border-color: var(--line); border-radius: 0; background: var(--vp-c-bg); color: var(--muted); }
.button-group button + button { margin-left: -1px; }
.button-group button:first-child { border-radius: 8px 0 0 8px; }
.button-group button:last-child { border-radius: 0 8px 8px 0; }
.button-group button.selected { position: relative; z-index: 1; border-color: var(--blue); background: var(--blue-soft); color: var(--blue); }
.group-vertical { flex-direction: column; }
.group-vertical button + button { margin-top: -1px; margin-left: 0; }
.group-vertical button:first-child { border-radius: 8px 8px 0 0; }
.group-vertical button:last-child { border-radius: 0 0 8px 8px; }

.split-control, .more-control { position: relative; display: inline-flex; }
.split-control { gap: 0; border-radius: 8px; box-shadow: 0 3px 8px color-mix(in srgb, var(--blue) 20%, transparent); }
.split-control .action-button { border-radius: 8px 0 0 8px; }
.split-control .action-button:hover { filter: none; transform: none; background: color-mix(in srgb, var(--blue) 92%, #000); }
.split-control .button-primary { box-shadow: none; }
.split-arrow, .more-trigger { border-color: var(--line); background: var(--vp-c-bg); color: var(--text); }
.split-arrow { width: 38px; min-width: 38px; padding: 0; border: 0; border-left: 1px solid rgb(255 255 255 / 34%); border-radius: 0 8px 8px 0; background: var(--blue); color: #fff; transition: background-color .16s ease; }
.split-arrow:hover { background: color-mix(in srgb, var(--blue) 92%, #000); }
.split-arrow:focus-visible { position: relative; z-index: 1; }
.mini-menu { position: absolute; z-index: 5; top: 0; left: calc(100% + 4px); display: grid; width: 138px; gap: 2px; padding: 4px; border: 1px solid var(--line); border-radius: 9px; background: var(--vp-c-bg); box-shadow: 0 8px 18px rgb(15 35 70 / 12%); animation: menu-in .14s ease-out both; }
.mini-menu button { border: 0; border-radius: 6px; padding: 5px 8px; background: transparent; color: var(--text); text-align: left; font-size: 11px; line-height: 1.3; }
.mini-menu button:hover { background: var(--blue-soft); color: var(--blue); }
@keyframes menu-in { from { opacity: 0; transform: translateX(4px); } to { opacity: 1; transform: translateX(0); } }

.segment-control, .toggle-group { display: inline-flex; align-items: center; gap: 3px; padding: 4px; border: 1px solid var(--line); border-radius: 10px; background: var(--vp-c-bg-soft); }
.segment-control button, .toggle-group button { min-height: 32px; border-radius: 7px; padding-inline: 12px; background: transparent; color: var(--muted); font-size: 12px; font-weight: 550; }
.segment-control button.selected, .toggle-group button.selected { background: var(--vp-c-bg); color: var(--blue); box-shadow: 0 1px 4px rgb(20 40 80 / 12%); }
.segment-control button { transition: color .2s ease, background-color .2s ease, box-shadow .2s ease; }
.segment-icon button { min-width: 40px; padding-inline: 8px; font-size: 17px; }
.segment-icon-text button { gap: 5px; padding-inline: 9px; }
.segment-block { display: flex; width: min(100%, 320px); }
.segment-block button { flex: 1; }
.segment-vertical { align-items: stretch; flex-direction: column; }
.segment-vertical button { justify-content: flex-start; }
.segment-rounded { border: 0; border-radius: 999px; background: transparent; }
.segment-rounded button { border-radius: 999px; }
.segment-disabled { opacity: .48; }
.segment-disabled button { cursor: not-allowed; }

.toggle-control { border-color: var(--line); background: var(--vp-c-bg); color: var(--muted); }
.toggle-control.active { border-color: var(--blue); background: var(--blue-soft); color: var(--blue); }
.toggle-icon { width: 44px; height: 40px; padding: 0; font-size: 20px; }
.toggle-single button.selected { background: var(--blue); color: #fff; }
.toggle-multiple button.selected { border-color: color-mix(in srgb, var(--blue) 30%, var(--line)); background: var(--blue-soft); color: var(--blue); }

.fab-wrap { position: relative; display: flex; min-width: 48px; min-height: 48px; align-items: center; justify-content: center; }
.fab { position: relative; display: inline-flex; width: 56px; min-width: 56px; height: 56px; box-sizing: border-box; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 50%; padding: 0; background: var(--blue); color: #fff; box-shadow: 0 5px 13px color-mix(in srgb, var(--blue) 28%, transparent); font-size: 22px; line-height: 1; transition: transform .16s ease, box-shadow .16s ease; }
.fab-extended { padding: 0 19px; font-size: 13px; font-weight: 650; }
.fab-tooltip::after { position: absolute; top: -31px; left: 50%; padding: 5px 8px; border-radius: 5px; background: #17243c; color: #fff; content: '发送反馈'; font-size: 11px; opacity: 0; transform: translate(-50%, 3px); transition: .16s; white-space: nowrap; pointer-events: none; }
.fab-tooltip:hover::after, .fab-tooltip:focus-visible::after { opacity: 1; transform: translate(-50%, 0); }
.fab-count { position: absolute; top: 14%; right: 14%; display: grid; width: 20px; height: 20px; box-sizing: border-box; padding: 0; place-items: center; transform: translate(50%, -50%); border: 2px solid var(--vp-c-bg); border-radius: 50%; background: #e34f58; color: white; font-size: 11px; font-weight: 700; line-height: 1; }
.fab-actions { position: absolute; z-index: 2; top: 50%; right: calc(100% + 8px); display: flex; gap: 6px; animation: fab-rise .18s ease-out both; }
.fab-actions button { border: 1px solid var(--line); border-radius: 999px; padding: 7px 11px; background: var(--vp-c-bg); color: var(--text); font-size: 11px; white-space: nowrap; box-shadow: 0 3px 9px rgb(20 40 80 / 9%); }
@keyframes fab-rise { from { opacity: 0; transform: translate(4px, -50%) scale(.96); } to { opacity: 1; transform: translate(0, -50%) scale(1); } }

.link-control { color: var(--blue); font-size: 15px; font-weight: 600; text-decoration: none; }
.link-basic:hover, .link-icon:hover { text-decoration: underline; text-underline-offset: 4px; }
.link-danger { color: #d9363e; }
.link-danger:hover { text-decoration: underline; text-underline-offset: 4px; }
.link-disabled { color: var(--muted); opacity: .48; }
.copy-control { min-width: 42px; min-height: 40px; border-color: var(--line); border-radius: 8px; background: var(--vp-c-bg); color: var(--muted); }
.copy-glyph { display: block; flex: none; }
.copy-control:hover { border-color: var(--blue); color: var(--blue); }
.copy-text { min-width: 84px; }
.copy-icon { padding: 0; }
.copy-success, .copy-control.copied { border-color: #9ed8b6; background: #effaf4; color: #16834d; }
.copy-control.copied { animation: copy-pop .2s ease-out; }
@keyframes copy-pop { 50% { transform: scale(1.06); } }

.top-button { display: grid; width: 46px; height: 46px; place-items: center; border: 1px solid var(--line); border-radius: 50%; background: var(--vp-c-bg); color: var(--blue); box-shadow: 0 3px 10px rgb(15 35 70 / 10%); font-size: 23px; transition: transform .16s ease, box-shadow .16s ease; }
.top-progress { border: 2px solid transparent; background: linear-gradient(var(--vp-c-bg), var(--vp-c-bg)) padding-box, conic-gradient(var(--blue) 68%, var(--line) 0) border-box; }
.more-trigger { width: 40px; min-width: 40px; min-height: 40px; padding: 0; }
.more-trigger svg { display: block; flex: none; }
.overflow-control { box-sizing: border-box; height: 40px; border: 1px solid var(--line); border-radius: 8px; background: var(--vp-c-bg); }
.overflow-action { height: 38px; min-height: 38px; box-sizing: border-box; border: 0; border-radius: 0; padding: 0 14px; background: transparent; color: var(--text); font-size: 13px; }
.overflow-action:hover { color: var(--blue); }
.overflow-control .more-trigger { height: 38px; min-height: 38px; border: 0; border-left: 1px solid var(--line); border-radius: 0; background: transparent; }
.overflow-control .more-trigger:hover { background: var(--vp-c-bg-soft); }

@media (max-width: 420px) {
  .button-group button { padding-inline: 10px; }
  .segment-control button, .toggle-group button { padding-inline: 9px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
</style>
