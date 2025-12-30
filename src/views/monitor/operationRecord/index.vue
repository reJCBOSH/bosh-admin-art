<script setup lang="ts">
  import { useOperationRecord } from './hooks'
  import OperationRecordSearch from './modules/operationRecordSearch.vue'
  import OperationRecordDrawer from './modules/operationRecordDrawer.vue'

  import { Delete } from '@element-plus/icons-vue'

  defineOptions({ name: 'OperationRecordList' })

  const {
    // 参数
    showSearchBar,
    searchParams,
    tableRef,
    loading,
    dataList,
    columns,
    columnChecks,
    pagination,
    selectedRows,
    drawerVisible,
    drawerInfo,
    // 方法
    getDataList,
    handleReset,
    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    handleSelectionChange,
    handleView,
    handleDel,
    handleBatchDel
  } = useOperationRecord()

  onMounted(() => {
    getDataList()
  })
</script>

<template>
  <div class="operationRecord-page art-full-height">
    <!-- 搜索栏 -->
    <OperationRecordSearch
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
        title="操作日志"
        :loading="loading"
        @refresh="getDataList"
      >
        <template #buttons>
          <ElButton
            type="danger"
            :icon="Delete"
            v-ripple
            :disabled="selectedRows.length === 0"
            @click="handleBatchDel"
          >
            批量删除({{ selectedRows.length }})
          </ElButton>
        </template>
      </ArtTableHeader>
      <!-- 表格内容 -->
      <ArtTable
        ref="tableRef"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :data="dataList"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #operation="{ row }">
          <ArtButtonTable type="view" @click="handleView(row)" />
          <ArtButtonTable type="delete" @click="handleDel(row)" />
        </template>
      </ArtTable>
    </ElCard>

    <OperationRecordDrawer
      :visible="drawerVisible"
      :model-value="drawerInfo"
      @close="drawerVisible = false"
    />
  </div>
</template>
