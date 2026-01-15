<!-- 用户管理页面 -->
<!-- art-full-height 自动计算出页面剩余高度 -->
<!-- art-table-card 一个符合系统样式的 class，同时自动撑满剩余高度 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<script setup lang="ts">
  import { useUser } from './hooks'
  import DeptTree from './modules/deptTree.vue'
  import UserDialog from './modules/userDialog.vue'
  import UserSearch from './modules/userSearch.vue'

  import { Plus } from '@element-plus/icons-vue'

  defineOptions({ name: 'UserList' })

  const {
    // 参数
    loading,
    showSearchBar,
    searchParams,
    tableRef,
    columns,
    columnChecks,
    dataList,
    pagination,
    roleOptions,
    deptOptions,
    treeData,
    treeLoading,
    dialogVisible,
    dialogType,
    dialogInfo,
    // 方法
    getDataList,
    getRoleOptions,
    getDeptOptions,
    onTreeSelect,
    handleReset,
    handleSearch,
    handleSizeChange,
    handleCurrentChange,
    handleAdd,
    handleEdit,
    handleDel,
    handleSetStatus,
    handleSubmit,
    handleResetPassword
  } = useUser()

  onMounted(() => {
    treeLoading.value = true
    getDataList()
    getRoleOptions()
    getDeptOptions()
  })
</script>

<template>
  <div class="user-page art-full-height">
    <div class="box-border flex gap-4 h-full max-md:block max-md:gap-0 max-md:h-auto">
      <div class="flex-shrink-0 w-58 h-full max-md:w-full max-md:h-auto max-md:mb-5">
        <DeptTree :tree-data="treeData" :tree-loading="treeLoading" @tree-select="onTreeSelect" />
      </div>
      <div class="flex flex-col flex-grow min-w-0">
        <!-- 搜索栏 -->
        <UserSearch
          v-show="showSearchBar"
          v-model="searchParams"
          :role-options="roleOptions"
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
            title="用户列表"
            :loading="loading"
            @refresh="getDataList"
          >
            <template #buttons>
              <ElButton type="primary" :icon="Plus" v-ripple @click="handleAdd">新增</ElButton>
            </template>
          </ArtTableHeader>

          <!-- 表格 -->
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
            <template #gender="{ row }">
              <ElTag v-if="row.gender === 1" color="#1D84FF">
                <span class="text-white">男</span>
              </ElTag>
              <ElTag v-else-if="row.gender === 2" color="#FF80C8">
                <span class="text-white">女</span>
              </ElTag>
              <ElTag v-else effect="dark" type="info">未知</ElTag>
            </template>
            <template #status="{ row }">
              <ElSwitch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                active-text="正常"
                inactive-text="冻结"
                inline-prompt
                @change="() => handleSetStatus(row)"
              />
            </template>
            <template #operation="{ row }">
              <ArtButtonTable type="edit" @click="handleEdit(row)" />
              <ArtButtonTable type="delete" @click="handleDel(row)" />
              <ArtButtonMore>
                <ArtButtonMoreItem
                  label="重置密码"
                  value="resetPassword"
                  icon="ep:lock"
                  @click="handleResetPassword(row)"
                />
              </ArtButtonMore>
            </template>
          </ArtTable>
        </ElCard>
      </div>
    </div>

    <UserDialog
      :visible="dialogVisible"
      :type="dialogType"
      :info="dialogInfo"
      :dept-options="deptOptions"
      :role-options="roleOptions"
      @cancel="dialogVisible = false"
      @submit="handleSubmit"
    />
  </div>
</template>
