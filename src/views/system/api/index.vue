<script setup lang="ts">
  import { useApi } from './hooks'
  import ApiSearch from './modules/apiSearch.vue'
  import ApiDialog from './modules/apiDialog.vue'

  import { Plus } from '@element-plus/icons-vue'

  defineOptions({ name: 'ApiList' })

  const {
    showSearchBar,
    searchParams,
    tableRef,
    loading,
    dataList,
    columns,
    columnChecks,
    pagination,
    dialogType,
    dialogInfo,
    dialogVisible,
    groupOptions,
    getDataList,
    getApiGroupOptions,
    handleReset,
    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    handleAdd,
    handleEdit,
    handleDel,
    handleSubmit
  } = useApi()

  onMounted(() => {
    getDataList()
    getApiGroupOptions()
  })
</script>

<template>
  <div class="api-page art-full-height">
    <!-- 搜索栏 -->
    <ApiSearch
      v-show="showSearchBar"
      v-model="searchParams"
      :group-options="groupOptions"
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
        title="Api列表"
        :loading="loading"
        @refresh="getDataList"
      >
        <template #buttons>
          <ElButton type="primary" :icon="Plus" v-ripple @click="handleAdd">新增</ElButton>
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
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #apiMethod="{ row }">
          <ElTag v-if="row.apiMethod === 'GET'" type="success">GET</ElTag>
          <ElTag v-else-if="row.apiMethod === 'POST'" type="primary">POST</ElTag>
          <ElTag v-else-if="row.apiMethod === 'PUT'" type="warning">PUT</ElTag>
          <ElTag v-else-if="row.apiMethod === 'DELETE'" type="danger">DELETE</ElTag>
        </template>
        <template #isRequired="{ row }">
          <ElTag v-if="row.isRequired === 1" type="success">是</ElTag>
          <ElTag v-else type="info">否</ElTag>
        </template>
        <template #operation="{ row }">
          <ArtButtonTable type="edit" @click="handleEdit(row)" />
          <ArtButtonTable type="delete" @click="handleDel(row)" />
        </template>
      </ArtTable>
    </ElCard>

    <ApiDialog
      :visible="dialogVisible"
      :type="dialogType"
      :info="dialogInfo"
      :group-options="groupOptions"
      @cancel="dialogVisible = false"
      @submit="handleSubmit"
    />
  </div>
</template>
