<!-- 更多按钮项 -->
<template>
  <div><!-- 这是一个虚拟组件，不渲染实际内容 --></div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtButtonMoreItem' })

  export interface ButtonMoreItem {
    /** 按钮标识，可用于点击事件 */
    value: string | number
    /** 按钮文本 */
    label: string
    /** 是否禁用 */
    disabled?: boolean
    /** 权限标识 */
    auth?: string
    /** 图标组件 */
    icon?: string
    /** 文本颜色 */
    color?: string
    /** 图标颜色（优先级高于 color） */
    iconColor?: string
    /** 点击事件处理函数 */
    onClick?: (event: MouseEvent) => void
  }

  type Props = ButtonMoreItem

  withDefaults(defineProps<Props>(), {
    disabled: false
  })

  // 定义 emits 用于支持点击事件
  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
  }>()

  // 当组件被点击时触发事件
  const handleClick = (event: MouseEvent) => {
    emit('click', event)
  }

  // 将 handleClick 方法暴露给父组件
  defineExpose({
    handleClick
  })
</script>
