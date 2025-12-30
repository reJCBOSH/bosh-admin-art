<script setup lang="ts">
  defineOptions({ name: 'OperationRecordSearch' })

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
      label: '请求方式',
      prop: 'method',
      type: 'select',
      options: [
        { label: 'POST', value: 'POST' },
        { label: 'GET', value: 'GET' }
      ]
    },
    {
      label: '状态',
      prop: 'status',
      type: 'select',
      options: [{ label: '成功', value: 200 }]
    },
    { label: '请求IP', prop: 'requestIP' },
    {
      label: '请求时间',
      prop: 'requestTime',
      type: 'datetime',
      span: 12,
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
