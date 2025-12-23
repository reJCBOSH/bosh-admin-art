<script setup lang="ts">
  defineOptions({ name: 'UserSearch' })

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({})
    },
    roleOptions: {
      type: Array,
      default: () => []
    }
  })
  const emit = defineEmits(['update:modelValue', 'reset', 'search'])

  // 表单数据双向绑定
  const searchBarRef = ref()
  const searchParams = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })
  const searchItems = computed(() => [
    { label: '用户名', prop: 'username' },
    { label: '昵称', prop: 'nickname' },
    {
      label: '性别',
      prop: 'gender',
      type: 'select',
      options: [
        { label: '未知', value: 0 },
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ]
    },
    {
      label: '角色',
      prop: 'role',
      type: 'select',
      options: props.roleOptions,
      fieldProps: {
        props: {
          label: 'roleName',
          value: 'id'
        }
      }
    },
    {
      label: '状态',
      prop: 'status',
      type: 'select',
      options: [
        { label: '正常', value: 1 },
        { label: '禁用', value: 2 }
      ]
    }
  ])
</script>

<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="searchParams"
    :items="searchItems"
    @reset="emit('reset')"
    @search="emit('search')"
  >
  </ArtSearchBar>
</template>
