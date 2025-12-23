<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'

  defineOptions({ name: 'DeptTree' })

  interface Tree {
    id: number
    deptName: string
    highlight?: boolean
    children?: Tree[]
  }

  defineProps({
    treeLoading: Boolean,
    treeData: Array
  })

  const emit = defineEmits(['tree-select'])

  const treeRef = ref()
  const isExpand = ref(true)
  const searchValue = ref('')
  const highlightMap = ref({})
  const { proxy } = getCurrentInstance()
  const defaultProps = {
    children: 'children',
    label: 'deptName'
  }

  const filterNode = (value: string, data: Tree) => {
    if (!value) return true
    return data.deptName.includes(value)
  }

  function nodeClick(value) {
    const nodeId = value.$treeNodeId
    highlightMap.value[nodeId] = highlightMap.value[nodeId]?.highlight
      ? Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
          highlight: false
        })
      : Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
          highlight: true
        })
    Object.values(highlightMap.value).forEach((v: Tree) => {
      if (v.id !== nodeId) {
        v.highlight = false
      }
    })
    emit(
      'tree-select',
      highlightMap.value[nodeId]?.highlight
        ? Object.assign({ ...value, selected: true })
        : Object.assign({ ...value, selected: false })
    )
  }

  function toggleRowExpansionAll(status) {
    isExpand.value = status
    const nodes = (proxy.$refs['treeRef'] as any).store._getAllNodes()
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].expanded = status
    }
  }

  /** 重置部门树状态（选中状态、搜索框值、树初始化） */
  function onTreeReset() {
    highlightMap.value = {}
    searchValue.value = ''
    toggleRowExpansionAll(true)
    emit('tree-select', 0, false)
  }

  watch(searchValue, (val) => {
    treeRef.value!.filter(val)
  })

  defineExpose({ onTreeReset })
</script>

<template>
  <ElCard class="tree-card art-card-xs flex flex-col h-full mt-0" shadow="never">
    <template #header>
      <div class="flex gap-1">
        <ElInput v-model="searchValue" placeholder="请输入部门名称" clearable>
          <template #prefix>
            <ElIcon><Search /></ElIcon>
          </template>
        </ElInput>
        <ArtButtonMore>
          <ArtButtonMoreItem
            value="expand"
            :label="isExpand ? '折叠全部' : '展开全部'"
            :icon="isExpand ? 'ri:expand-right-line' : 'ri:corner-right-down-line'"
            @click="toggleRowExpansionAll(isExpand ? false : true)"
          />
          <ArtButtonMoreItem
            value="reset"
            label="重置状态"
            icon="ri:refresh-line"
            @click="onTreeReset"
          />
        </ArtButtonMore>
      </div>
    </template>
    <ElScrollbar>
      <ElTree
        ref="treeRef"
        class="mt-1"
        :data="treeData"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
      >
        <template #default="{ node, data }">
          <span
            :class="[
              'pl-1',
              'pr-1',
              'rounded',
              'flex',
              'items-center',
              'select-none',
              'hover:text-primary',
              searchValue.trim().length > 0 && node.label.includes(searchValue) && 'text-red-500',
              highlightMap[node.id]?.highlight ? 'dark:text-primary' : ''
            ]"
            :style="{
              color: highlightMap[node.id]?.highlight ? 'var(--el-color-primary)' : '',
              background: highlightMap[node.id]?.highlight
                ? 'var(--el-color-primary-light-7)'
                : 'transparent'
            }"
          >
            <ArtSvgIcon
              :icon="
                data.type === 1
                  ? 'ep:office-building'
                  : data.type === 2
                    ? 'ep:add-location'
                    : 'ep:place'
              "
            />
            {{ node.label }}
          </span>
        </template>
      </ElTree>
    </ElScrollbar>
  </ElCard>
</template>

<style scoped>
  .tree-card :deep(.el-card__header) {
    padding: 15px 10px;
  }

  .tree-card :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    padding: 10px 2px 10px 10px;
  }
</style>
