<script setup lang="ts">
  defineOptions({ name: 'DeptSearch' })

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) }
  })

  const emit = defineEmits(['reset', 'search'])

  const searchBarRef = ref()
  const searchParams = computed(() => props.modelValue)
  const searchItems = [
    { label: '部门名称', prop: 'deptName' },
    { label: '部门编码', prop: 'deptCode' },
    {
      label: '部门状态',
      prop: 'status',
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 }
      ]
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
