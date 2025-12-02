<!-- 表格按钮 -->
<template>
  <ElTooltip :content="tooltipContent">
    <div
      :class="[
        'inline-flex items-center justify-center min-w-8 h-8 px-2.5 mr-2.5 text-sm c-p rounded-md',
        buttonClass
      ]"
      :style="{ backgroundColor: buttonBgColor, color: iconColor }"
      @click="handleClick"
    >
      <ArtSvgIcon :icon="iconContent" />
    </div>
  </ElTooltip>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtButtonTable' })

  interface Props {
    /** 按钮类型 */
    type?: 'add' | 'edit' | 'delete' | 'more' | 'view'
    /** 按钮图标 */
    icon?: string
    /** 按钮样式类 */
    iconClass?: string
    /** icon 颜色 */
    iconColor?: string
    /** 按钮背景色 */
    buttonBgColor?: string
    /** 文字提示 */
    tooltip?: string
  }

  const props = withDefaults(defineProps<Props>(), {})

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  // 默认按钮配置
  const defaultButtons = {
    add: { icon: 'ri:add-fill', class: 'bg-theme/12 text-theme', tooltip: '新增' },
    edit: { icon: 'ri:pencil-line', class: 'bg-secondary/12 text-secondary', tooltip: '修改' },
    delete: { icon: 'ri:delete-bin-5-line', class: 'bg-error/12 text-error', tooltip: '删除' },
    view: { icon: 'ri:eye-line', class: 'bg-info/12 text-info', tooltip: '查看' },
    more: { icon: 'ri:more-2-fill', class: '', tooltip: '更多' }
  } as const

  // 获取图标内容
  const iconContent = computed(() => {
    return props.icon || (props.type ? defaultButtons[props.type]?.icon : '') || ''
  })

  // 获取按钮样式类
  const buttonClass = computed(() => {
    return props.iconClass || (props.type ? defaultButtons[props.type]?.class : '') || ''
  })

  // 获取文字提示
  const tooltipContent = computed(() => {
    return props.tooltip || (props.type ? defaultButtons[props.type]?.tooltip : '') || ''
  })

  const handleClick = () => {
    emit('click')
  }
</script>
