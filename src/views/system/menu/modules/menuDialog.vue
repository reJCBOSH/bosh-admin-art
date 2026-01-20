<script setup lang="ts">
  import { cloneDeep } from '@pureadmin/utils'
  import { useWindowSize } from '@vueuse/core'

  defineOptions({ name: 'MenuDialog' })

  const props = defineProps({
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'add' },
    info: { type: Object, default: () => {} },
    menuOptions: { type: Array, default: () => [] }
  })

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'cancel'): void
    (e: 'submit', form: any, data: any): void
  }>()
  const dialogVisible = computed({
    get() {
      return props.visible
    },
    set(val) {
      emit('update:visible', val)
    }
  })
  const dialogType = computed(() => props.type)
  const { width } = useWindowSize()
  const switchSpan = width.value < 640 ? 12 : 6

  const formRef = ref()
  const formData = ref({})
  const formItems = computed(() => {
    if (formData.value.menuType === 0) {
      return [
        { label: '菜单类型', prop: 'menuType', slot: 'menuType', span: 24 },
        { label: '上级菜单', prop: 'parentId', slot: 'parentId', span: 24 },
        { label: '菜单名称', prop: 'title' },
        { label: '路由名称', prop: 'name', tooltip: '必须保持唯一' },
        {
          label: '路由路径',
          prop: 'path',
          tooltip:
            '一级菜单：以 / 开头的绝对路径（如 /dashboard）\n二级及以下：相对路径（如 console、user）'
        },
        {
          label: '组件路径',
          prop: 'component',
          tooltip:
            '一级父级菜单：填写 /index/index\n具体页面：填写组件路径（如 /system/user）\n目录菜单：留空'
        },
        { label: '图标', prop: 'icon' },
        { label: '文本徽章', prop: 'showTextBadge' },
        {
          label: '激活路径',
          prop: 'activePath',
          tooltip:
            '用于详情页等隐藏菜单，指定高亮显示的父级菜单路径\n例如：用户详情页高亮显示"用户管理"菜单'
        },
        {
          label: '显示顺序',
          prop: 'displayOrder',
          type: 'number',
          fieldProps: { min: 0, max: 9999, precision: 0, style: { width: '100%' } }
        },
        { label: '页面缓存', prop: 'keepAlive', type: 'switch', span: switchSpan },
        { label: '隐藏菜单', prop: 'isHide', type: 'switch', span: switchSpan },
        { label: '显示徽章', prop: 'showBadge', type: 'switch', span: switchSpan },
        { label: '固定标签', prop: 'fixedTab', type: 'switch', span: switchSpan },
        { label: '标签隐藏', prop: 'isHideTab', type: 'switch', span: switchSpan }
      ]
    } else if (formData.value.menuType === 1) {
      return [
        { label: '菜单类型', prop: 'menuType', slot: 'menuType', span: 24 },
        { label: '上级菜单', prop: 'parentId', slot: 'parentId', span: 24 },
        { label: '菜单名称', prop: 'title' },
        { label: '路由名称', prop: 'name', tooltip: '必须保持唯一' },
        { label: '图标', prop: 'icon' },
        { label: '链接', prop: 'link' },
        { label: '文本徽章', prop: 'showTextBadge' },
        {
          label: '显示顺序',
          prop: 'displayOrder',
          type: 'number',
          fieldProps: { min: 0, max: 9999, precision: 0, style: { width: '100%' } }
        },
        { label: '页面缓存', prop: 'keepAlive', type: 'switch', span: switchSpan },
        { label: '隐藏菜单', prop: 'isHide', type: 'switch', span: switchSpan },
        { label: '显示徽章', prop: 'showBadge', type: 'switch', span: switchSpan },
        { label: '固定标签', prop: 'fixedTab', type: 'switch', span: switchSpan },
        { label: '标签隐藏', prop: 'isHideTab', type: 'switch', span: switchSpan }
      ]
    } else if (formData.value.menuType === 2) {
      return [
        { label: '菜单类型', prop: 'menuType', slot: 'menuType', span: 24 },
        { label: '上级菜单', prop: 'parentId', slot: 'parentId', span: 24 },
        { label: '菜单名称', prop: 'title' },
        { label: '路由名称', prop: 'name', tooltip: '必须保持唯一' },
        { label: '图标', prop: 'icon' },
        { label: '链接', prop: 'link' },
        { label: '文本徽章', prop: 'showTextBadge' },
        {
          label: '显示顺序',
          prop: 'displayOrder',
          type: 'number',
          fieldProps: { min: 0, max: 9999, precision: 0, style: { width: '100%' } }
        },
        { label: '隐藏菜单', prop: 'isHide', type: 'switch', span: switchSpan },
        { label: '显示徽章', prop: 'showBadge', type: 'switch', span: switchSpan }
      ]
    } else {
      return [
        { label: '菜单类型', prop: 'menuType', slot: 'menuType', span: 24 },
        { label: '上级菜单', prop: 'parentId', slot: 'parentId', span: 24 },
        { label: '菜单名称', prop: 'title' },
        { label: '权限标识', prop: 'authMark' },
        {
          label: '显示顺序',
          prop: 'displayOrder',
          type: 'number',
          fieldProps: { min: 0, max: 9999, precision: 0, style: { width: '100%' } }
        }
      ]
    }
  })

  const rules = {
    title: [{ required: true, message: '请输入菜单名称' }],
    name: [{ required: true, message: '请输入路由名称' }],
    path: [{ required: true, message: '请输入路由路径' }],
    authMark: [{ required: true, message: '请输入权限标识' }]
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        formData.value = cloneDeep(props.info)
        if (props.type === 'add') {
          formData.value.menuType = 0
          formData.value.displayOrder = 99
        }
      } else {
        setTimeout(() => {
          formData.value = {}
        }, 100)
      }
    },
    { immediate: true }
  )
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="(dialogType === 'add' ? '新增' : '修改') + '菜单'"
    width="800"
    align-center
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :draggable="true"
    @close="emit('cancel')"
  >
    <ArtForm
      ref="formRef"
      v-model="formData"
      :items="formItems"
      :rules="rules"
      label-width="100px"
      :show-reset="false"
      :show-submit="false"
    >
      <template #menuType>
        <ElRadioGroup v-model="formData.menuType" :disabled="dialogType === 'edit'">
          <ElRadioButton :value="0">菜单</ElRadioButton>
          <ElRadioButton :value="1">iframe</ElRadioButton>
          <ElRadioButton :value="2">外链</ElRadioButton>
          <ElRadioButton :value="3">按钮</ElRadioButton>
        </ElRadioGroup>
      </template>
      <template #parentId>
        <ElCascader
          v-model="formData.parentId"
          :options="props.menuOptions"
          :props="{ value: 'id', label: 'title', emitPath: false, checkStrictly: true }"
          clearable
          style="width: 100%"
          placeholder="请选择上级菜单"
        >
          <template #default="{ node, data }">
            <span>{{ data.title }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </ElCascader>
      </template>
    </ArtForm>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="emit('cancel')">取消</ElButton>
        <ElButton type="primary" @click="emit('submit', formRef, formData)">确定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>
