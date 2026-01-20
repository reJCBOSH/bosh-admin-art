<script setup lang="ts">
  defineOptions({ name: 'ApiSearch' })

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
    groupOptions: { type: Array, default: () => [] }
  })

  const emit = defineEmits(['reset', 'search'])
  const searchBarRef = ref()
  const searchParams = computed(() => props.modelValue)
  const searchItems = computed(() => [
    { label: '名称', name: 'apiName' },
    {
      label: '分组',
      name: 'apiGroup',
      type: 'select',
      options: props.groupOptions
    },
    {
      label: '方法',
      name: 'apiMethod',
      type: 'select',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' }
      ]
    },
    { label: '路径', name: 'apiPath' },
    {
      label: '是否必选',
      name: 'isRequired',
      type: 'select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
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
  />
</template>
