<script setup lang="ts">
  import { useMenu } from './hooks'
  import MenuSearch from './modules/menuSearch.vue'
  import MenuDialog from './modules/menuDialog.vue'

  import { Plus } from '@element-plus/icons-vue'

  defineOptions({ name: 'MenuList' })

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
    formatMenuOptions,
    getMenuTypeTag,
    getMenuTypeText,
    handleReset,
    handleSearch,
    handleExpand,
    handleAdd,
    handleAddChild,
    handleEdit,
    handleSubmit,
    handleDel
  } = useMenu()

  onMounted(() => {
    getDataList()
  })
</script>

<template>
  <div class="menu-page art-full-height">
    <!-- 搜索栏 -->
    <MenuSearch
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
        title="菜单列表"
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
        <template #title="{ row }">
          <div class="flex-c gap-1">
            <ArtSvgIcon :icon="row.icon" class="text-lg" />
            <span>{{ row.title }}</span>
          </div>
        </template>
        <template #menuType="{ row }">
          <ElTag :type="getMenuTypeTag(row)">{{ getMenuTypeText(row) }}</ElTag>
        </template>
        <template #operation="{ row }">
          <ArtButtonTable v-if="row.menuType === 0" type="add" @click="handleAddChild(row)" />
          <ArtButtonTable type="edit" @click="handleEdit(row)" />
          <ArtButtonTable type="delete" @click="handleDel(row)" />
        </template>
      </ArtTable>
    </ElCard>

    <MenuDialog
      :visible="dialogVisible"
      :type="dialogType"
      :info="dialogInfo"
      :menuOptions="formatMenuOptions(treeList)"
      @cancel="dialogVisible = false"
      @submit="handleSubmit"
    />
  </div>
</template>
