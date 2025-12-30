<script setup lang="ts">
  defineOptions({ name: 'loginRecordSearch' })

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({})
    }
  })
  const emit = defineEmits(['reset', 'search'])

  const searchBarRef = ref()
  const searchParams = computed(() => props.modelValue)
  const searchItems = [
    { label: '用户名', prop: 'username' },
    {
      label: '登录状态',
      prop: 'status',
      type: 'select',
      options: [
        { label: '成功', value: 1 },
        { label: '失败', value: 0 }
      ]
    },
    {
      label: '登录时间',
      prop: 'loginTime',
      span: 12,
      type: 'date',
      fieldProps: {
        type: 'datetimerange',
        startPlaceholder: '请选择开始时间',
        endPlaceholder: '请选择结束时间'
      }
    }
  ]
</script>

<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="searchParams"
    :items="searchItems"
    @reset="emit('reset')"
    @search="emit('search')"
  />
</template>
