<script setup lang="ts">
  defineOptions({ name: 'MenuSearch' })

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) }
  })

  const emit = defineEmits(['reset', 'search'])

  const searchBarRef = ref()
  const searchParams = computed(() => props.modelValue)
  const searchItems = [
    { label: '菜单名称', prop: 'title' },
    { label: '路由名称', prop: 'name' },
    { label: '路由地址', prop: 'path' }
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
