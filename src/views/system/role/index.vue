<script setup lang="ts">
  import { ElSwitch } from 'element-plus'
  import { useRole } from './hooks'
  import RoleSearch from './modules/roleSearch.vue'
  import RoleDialog from './modules/roleDialog.vue'
  import RoleMenuDrawer from './modules/roleMenuDrawer.vue'

  import { Plus } from '@element-plus/icons-vue'
  import RoleDataDrawer from './modules/roleDataDrawer.vue'

  defineOptions({ name: 'RoleList' })

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
    dialogVisible,
    dialogType,
    dialogInfo,
    currentRow,
    roleMenuVisible,
    roleDataVisible,
    // 方法
    getDataList,
    handleReset,
    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    handleAdd,
    handleEdit,
    handleDel,
    handleSwitchStatus,
    handleSubmit,
    handleRoleMenu,
    handleRoleData
  } = useRole()

  onMounted(() => {
    getDataList()
  })
</script>

<template>
  <div class="role-page art-full-height">
    <!-- 搜索栏 -->
    <RoleSearch
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
        title="角色列表"
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
        <template #status="{ row }">
          <ElSwitch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            inline-prompt
            @change="() => handleSwitchStatus(row)"
          />
        </template>
        <template #operation="{ row }">
          <ArtButtonTable type="edit" @click="handleEdit(row)" />
          <ArtButtonTable type="delete" @click="handleDel(row)" />
          <ArtButtonMore>
            <ArtButtonMoreItem
              label="菜单权限"
              value="menuAuth"
              icon="ri:menu-line"
              @click="handleRoleMenu(row)"
            />
            <ArtButtonMoreItem
              label="数据权限"
              value="dataAuth"
              icon="ri:database-2-line"
              @click="handleRoleData(row)"
            />
          </ArtButtonMore>
        </template>
      </ArtTable>
    </ElCard>

    <RoleDialog
      :visible="dialogVisible"
      :type="dialogType"
      :info="dialogInfo"
      @cancel="dialogVisible = false"
      @submit="handleSubmit"
    />

    <RoleMenuDrawer
      :visible="roleMenuVisible"
      :row="currentRow"
      @close="roleMenuVisible = false"
      @ok="getDataList"
    />

    <RoleDataDrawer
      :visible="roleDataVisible"
      :row="currentRow"
      @close="roleDataVisible = false"
      @ok="getDataList"
    />
  </div>
</template>
