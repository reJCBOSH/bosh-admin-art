<script setup lang="ts">
  defineOptions({ name: 'RoleSearch' })

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
    { label: '角色名称', prop: 'roleName' },
    { label: '角色编码', prop: 'roleCode' },
    {
      label: '状态',
      prop: 'status',
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
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
