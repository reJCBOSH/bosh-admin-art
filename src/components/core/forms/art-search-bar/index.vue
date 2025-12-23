<template>
  <section class="art-search-bar art-card-xs" :class="{ 'is-expanded': isExpanded }">
    <ElForm
      ref="formRef"
      :model="modelValue"
      :label-position="labelPosition"
      :label-width="labelWidth"
      v-bind="{ ...$attrs }"
    >
      <ElRow :gutter="gutter">
        <template v-for="(item, index) in visibleItems" :key="index">
          <ElCol
            :xs="getColSpan(item.span, 'xs')"
            :sm="getColSpan(item.span, 'sm')"
            :md="getColSpan(item.span, 'md')"
            :lg="getColSpan(item.span, 'lg')"
            :xl="getColSpan(item.span, 'xl')"
          >
            <ElFormItem :label="item.label" :prop="item.prop">
              <!-- 插槽优先 -->
              <!-- 使用动态插槽名，优先使用item.slot，否则使用item.prop -->
              <slot :name="item.slot || item.prop" :model="modelValue">
                <!-- 默认内容：当插槽没有内容时，渲染动态组件 -->
                <component
                  :is="getComponent(item)"
                  v-model="modelValue[item.prop]"
                  v-bind="getFieldAttrs(item)"
                />
              </slot>
            </ElFormItem>
          </ElCol>
        </template>
        <ElCol :xs="24" :sm="24" :md="span" :lg="span" :xl="span" class="action-column">
          <div class="action-buttons-wrapper" :style="actionButtonsStyle">
            <div class="form-buttons">
              <ElButton
                v-if="showReset"
                :icon="RefreshRight"
                class="reset-button"
                @click="handleReset"
                v-ripple
              >
                {{ t('table.searchBar.reset') }}
              </ElButton>
              <ElButton
                v-if="showSearch"
                type="primary"
                class="search-button"
                :icon="Search"
                @click="handleSearch"
                v-ripple
                :disabled="disabledSearch"
                :loading="loading"
              >
                {{ t('table.searchBar.search') }}
              </ElButton>
            </div>
            <div v-if="shouldShowExpandToggle" class="filter-toggle" @click="toggleExpand">
              <span>{{ expandToggleText }}</span>
              <div class="icon-wrapper">
                <ElIcon>
                  <ArrowUpBold v-if="isExpanded" />
                  <ArrowDownBold v-else />
                </ElIcon>
              </div>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import type { Component } from 'vue'
  import {
    ElCascader,
    ElCheckbox,
    ElCheckboxGroup,
    ElDatePicker,
    ElInput,
    ElInputNumber,
    ElInputTag,
    ElRadioGroup,
    ElRate,
    ElSelect,
    ElSlider,
    ElSwitch,
    ElTimePicker,
    ElTimeSelect,
    ElTreeSelect,
    type FormInstance
  } from 'element-plus'
  import { calculateResponsiveSpan, type ResponsiveBreakpoint } from '@/utils/form/responsive'
  import { ArrowUpBold, ArrowDownBold, RefreshRight, Search } from '@element-plus/icons-vue'

  defineOptions({ name: 'ArtSearchBar' })

  const componentMap = {
    input: ElInput, // 输入框
    inputTag: ElInputTag, // 标签输入框
    number: ElInputNumber, // 数字输入框
    select: ElSelect, // 选择器
    switch: ElSwitch, // 开关
    checkbox: ElCheckbox, // 复选框
    checkboxgroup: ElCheckboxGroup, // 复选框组
    radiogroup: ElRadioGroup, // 单选框组
    date: ElDatePicker, // 日期选择器
    daterange: ElDatePicker, // 日期范围选择器
    datetime: ElDatePicker, // 日期时间选择器
    datetimerange: ElDatePicker, // 日期时间范围选择器
    rate: ElRate, // 评分
    slider: ElSlider, // 滑块
    cascader: ElCascader, // 级联选择器
    timepicker: ElTimePicker, // 时间选择器
    timeselect: ElTimeSelect, // 时间选择
    treeselect: ElTreeSelect // 树选择器
  }

  // 表单项配置
  export interface SearchFormItem {
    /** 表单项的唯一标识 */
    prop: string
    /** 表单项的标签文本或自定义渲染函数 */
    label: string | (() => VNode) | Component
    /** 表单项标签的宽度，会覆盖 Form 的 labelWidth */
    labelWidth?: string | number
    /** 表单项类型，支持预定义的组件类型 */
    type?: keyof typeof componentMap | string
    /** 自定义渲染函数或组件，用于渲染自定义组件（优先级高于 type） */
    render?: (() => VNode) | Component
    /** 是否隐藏该表单项 */
    hidden?: boolean
    /** 表单项占据的列宽，基于24格栅格系统 */
    span?: number
    /** 选项数据，用于 select、checkbox-group、radio-group 等 */
    options?: Record<string, any>
    /** 传递给表单项组件的属性 */
    fieldProps?: Record<string, any>
    /** 表单项的插槽配置 */
    slots?: Record<string, (() => any) | undefined>
    /** 表单项的占位符文本 */
    placeholder?: string
    /** 更多属性配置请参考 ElementPlus 官方文档 */
  }

  // 表单配置
  interface SearchBarProps {
    /** 表单数据 */
    items: SearchFormItem[]
    /** 每列的宽度（基于 24 格布局） */
    span?: number
    /** 表单控件间隙 */
    gutter?: number
    /** 展开/收起 */
    isExpand?: boolean
    /** 默认是否展开（仅在 showExpand 为 true 且 isExpand 为 false 时生效） */
    defaultExpanded?: boolean
    /** 表单域标签的位置 */
    labelPosition?: 'left' | 'right' | 'top'
    /** 文字宽度 */
    labelWidth?: string | number
    /** 是否需要展示，收起 */
    showExpand?: boolean
    /** 按钮靠左对齐限制（表单项小于等于该值时） */
    buttonLeftLimit?: number
    /** 按钮加载中 */
    loading?: boolean
    /** 是否显示重置按钮 */
    showReset?: boolean
    /** 是否显示搜索按钮 */
    showSearch?: boolean
    /** 是否禁用搜索按钮 */
    disabledSearch?: boolean
    /** 是否在搜索前清理空值参数 */
    cleanParams?: boolean
  }

  const props = withDefaults(defineProps<SearchBarProps>(), {
    items: () => [],
    span: 6,
    gutter: 12,
    isExpand: false,
    labelPosition: 'right',
    labelWidth: '70px',
    showExpand: true,
    defaultExpanded: false,
    buttonLeftLimit: 2,
    showReset: true,
    showSearch: true,
    disabledSearch: false,
    cleanParams: true
  })

  const { width } = useWindowSize()
  const { t } = useI18n()
  const isMobile = computed(() => width.value < 500)

  const modelValue = defineModel<Record<string, any>>({ default: {} })
  const formInstance = useTemplateRef<FormInstance>('formRef')

  /**
   * 获取列宽 span 值
   * 根据屏幕尺寸智能降级，避免小屏幕上表单项被压缩过小
   */
  const getColSpan = (itemSpan: number | undefined, breakpoint: ResponsiveBreakpoint): number => {
    return calculateResponsiveSpan(itemSpan, props.span, breakpoint)
  }
  // 组件类型映射
  const getComponent = (item: SearchFormItem) => {
    // 优先使用 render 函数或组件渲染自定义组件
    if (item.render) {
      return item.render
    }
    // 使用 type 获取预定义组件
    const { type } = item
    return componentMap[type as keyof typeof componentMap] || componentMap['input']
  }

  /**
   * 是否展开状态
   */
  const isExpanded = ref(props.defaultExpanded)

  /**
   * 可见的表单项
   */
  const visibleItems = computed(() => {
    const filteredItems = props.items.filter((item) => !item.hidden)
    const shouldShowLess = !props.isExpand && !isExpanded.value
    if (shouldShowLess) {
      const maxItemsPerRow = Math.floor(24 / props.span) - 1
      return filteredItems.slice(0, maxItemsPerRow)
    }
    return filteredItems
  })

  /**
   * 处理表单项配置，设置默认值
   */
  const getFieldAttrs = (item: SearchFormItem) => {
    let attrs: Record<string, any> = {}
    // 深拷贝避免修改原始对象
    const processedItem = { ...item }

    // 初始化 fieldProps 如果不存在
    if (processedItem.fieldProps) {
      attrs = { ...processedItem.fieldProps }
    }

    // 处理 clearable 属性默认值
    if (attrs.clearable === undefined) {
      attrs.clearable = true
    }

    // 处理 placeholder 属性默认值
    if (!attrs.placeholder) {
      if (processedItem.placeholder) {
        attrs.placeholder = processedItem.placeholder
      } else {
        if (typeof processedItem.label === 'string') {
          // 判断是否为选择类型组件
          const isSelectType = [
            'select',
            'checkboxgroup',
            'radiogroup',
            'cascader',
            'treeselect'
          ].includes(processedItem.type as string)

          // 根据组件类型设置不同的默认 placeholder
          const placeholderText = isSelectType
            ? `${t('table.searchBar.searchSelectPlaceholder')}${processedItem.label}`
            : `${t('table.searchBar.searchInputPlaceholder')}${processedItem.label}`

          attrs.placeholder = placeholderText
        }
      }
    }

    if (processedItem.options) {
      attrs.options = processedItem.options
    }

    return attrs
  }

  /**
   * 是否应该显示展开/收起按钮
   */
  const shouldShowExpandToggle = computed(() => {
    const filteredItems = props.items.filter((item) => !item.hidden)
    return (
      !props.isExpand && props.showExpand && filteredItems.length > Math.floor(24 / props.span) - 1
    )
  })

  /**
   * 展开/收起按钮文本
   */
  const expandToggleText = computed(() => {
    return isExpanded.value ? t('table.searchBar.collapse') : t('table.searchBar.expand')
  })

  /**
   * 操作按钮样式
   */
  const actionButtonsStyle = computed(() => ({
    'justify-content': isMobile.value
      ? 'flex-end'
      : props.items.filter((item) => !item.hidden).length <= props.buttonLeftLimit
        ? 'flex-start'
        : 'flex-end'
  }))

  /**
   * 切换展开/收起状态
   */
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
  }

  /**
   * 清理搜索参数，移除空字符串、null 和 undefined 字段
   */
  const cleanSearchParams = (params: Record<string, any>) => {
    const cleaned = { ...params }
    Object.keys(cleaned).forEach((key) => {
      const value = cleaned[key]
      if (value === '' || value === null || value === undefined) {
        delete cleaned[key]
      }
    })
    return cleaned
  }

  // 定义事件
  const emit = defineEmits(['reset', 'search'])

  const handleReset = () => {
    // 重置表单字段（UI 层）
    formInstance.value?.resetFields()

    // 清空所有表单项值（包含隐藏项）
    Object.assign(
      modelValue.value,
      Object.fromEntries(props.items.map(({ prop }) => [prop, undefined]))
    )

    emit('reset')
  }

  const handleSearch = () => {
    // 根据 cleanParams 属性决定是否清理参数
    if (props.cleanParams) {
      const cleanedParams = cleanSearchParams(modelValue.value)
      // 直接更新 modelValue
      Object.keys(modelValue.value).forEach((key) => {
        if (!(key in cleanedParams)) {
          delete modelValue.value[key]
        }
      })

      Object.assign(modelValue.value, cleanedParams)
    }

    emit('search')
  }
</script>

<style lang="scss" scoped>
  .art-search-bar {
    padding: 15px 20px 0;

    .action-column {
      flex: 1;
      max-width: 100%;

      .action-buttons-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 12px;
      }

      .form-buttons {
        display: flex;
      }

      .filter-toggle {
        display: flex;
        align-items: center;
        margin-left: 10px;
        line-height: 32px;
        color: var(--theme-color);
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: var(--el-color-primary-light-3);
        }

        span {
          font-size: 14px;
          user-select: none;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          margin-left: 4px;
          font-size: 14px;
          transition: transform 0.2s ease;
        }
      }
    }
  }

  // 响应式优化
  @media (width <= 768px) {
    .art-search-bar {
      padding: 16px 16px 0;

      .action-column {
        .action-buttons-wrapper {
          flex-direction: column;
          gap: 8px;
          align-items: stretch;

          .form-buttons {
            justify-content: center;
          }

          .filter-toggle {
            justify-content: center;
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
