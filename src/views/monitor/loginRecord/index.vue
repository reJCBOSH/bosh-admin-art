<script setup lang="ts">
  import { useLoginRecord } from './hooks'
  import loginRecordSearch from './modules/loginRecordSearch.vue'

  import { Delete } from '@element-plus/icons-vue'

  defineOptions({ name: 'loginRecordList' })

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
    // 方法
    getDataList,
    handleReset,
    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    handleSelectionChange,
    handleDel,
    handleBatchDel
  } = useLoginRecord()

  onMounted(() => {
    getDataList()
  })
</script>

<template>
  <div class="loginRecord-page art-full-height">
    <!-- 搜索栏 -->
    <loginRecordSearch
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
        title="登录日志"
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
        <template #loginStatus="{ row }">
          <ElTag v-if="row.loginStatus === 1" type="success">成功</ElTag>
          <ElTag v-else type="danger">失败</ElTag>
        </template>
        <template #operation="{ row }">
          <ArtButtonTable type="delete" @click="handleDel(row)" />
        </template>
      </ArtTable>
    </ElCard>
  </div>
</template>
