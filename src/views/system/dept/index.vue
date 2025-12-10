<script setup lang="ts">
  import { useDept } from './hooks'
  import DeptSearch from './modules/deptSearch.vue'
  import DeptDialog from './modules/deptDialog.vue'

  import { Plus } from '@element-plus/icons-vue'

  defineOptions({ name: 'DeptList' })

  const {
    showSearchBar,
    searchParams,
    tableRef,
    loading,
    expandAll,
    columns,
    columnChecks,
    treeList,
    dataList,
    dialogVisible,
    dialogType,
    dialogInfo,
    getDataList,
    formatDeptOptions,
    handleReset,
    handleSearch,
    handleExpand,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleDel
  } = useDept()

  onMounted(() => {
    getDataList()
  })
</script>

<template>
  <div class="dept-page art-full-height">
    <!-- 搜索栏 -->
    <DeptSearch
      v-show="showSearchBar"
      v-model="searchParams"
      @reset="handleReset"
      @search="handleSearch"
    />

    <!-- 列表 -->
    <ElCard
      class="flex flex-col flex-1 art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <!-- 表格头部 -->
      <ArtTableHeader
        v-model:showSearchBar="showSearchBar"
        v-model:columns="columnChecks"
        title="部门列表"
        :loading="loading"
        @refresh="getDataList"
      >
        <template #buttons>
          <ElButton @click="handleExpand" v-ripple>
            <template #icon>
              <ArtSvgIcon
                icon="ri:expand-right-line"
                :style="{ transform: expandAll ? 'rotate(90deg)' : 'none' }"
              />
            </template>
            {{ expandAll ? '收起' : '展开' }}
          </ElButton>
          <ElButton type="primary" :icon="Plus" v-ripple @click="handleAdd">新增</ElButton>
        </template>
      </ArtTableHeader>

      <!-- 表格主体 -->
      <ArtTable ref="tableRef" rowKey="id" :loading="loading" :columns="columns" :data="dataList">
        <template #status="{ row }">
          <ElTag v-if="row.status === 1" type="success">启用</ElTag>
          <ElTag v-else type="danger">停用</ElTag>
        </template>
        <template #operation="{ row }">
          <ArtButtonTable type="edit" @click="handleEdit(row)" />
          <ArtButtonTable type="delete" @click="handleDel(row)" />
        </template>
      </ArtTable>
    </ElCard>

    <!-- 编辑弹窗 -->
    <DeptDialog
      v-model:visible="dialogVisible"
      :type="dialogType"
      :info="dialogInfo"
      :deptOptions="formatDeptOptions(treeList)"
      @cancel="dialogVisible = false"
      @submit="handleSubmit"
    />
  </div>
</template>
