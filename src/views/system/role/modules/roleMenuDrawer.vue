<script setup lang="ts">
  import { cloneDeep, getKeyList, handleTree } from '@pureadmin/utils'
  import { fetchGetRoleMenu, fetchGetRoleMenuIds, fetchSetRoleMenuAuth } from '@/api/role'

  defineOptions({
    name: 'RoleMenuDrawer'
  })

  const props = defineProps({
    visible: { type: Boolean, default: false },
    row: { type: Object, default: null }
  })

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'close'): void
    (e: 'ok'): void
  }>()
  const drawerVisible = computed({
    get() {
      return props.visible
    },
    set(val) {
      emit('update:visible', val)
    }
  })

  const curRow = ref()
  const treeRef = ref()
  const treeHeight = ref(window.innerHeight - 188)
  const treeProps = {
    value: 'id',
    label: 'title',
    children: 'children'
  }
  const treeIds = ref([])
  const treeData = ref([])
  const treeSearchValue = ref()
  const isLinkage = ref(false)
  const isExpandAll = ref(false)
  const isSelectAll = ref(false)

  function queryChange(query: string) {
    treeRef.value!.filter(query)
  }

  function expandAllChange(val: boolean) {
    if (val) {
      treeRef.value.setExpandedKeys(treeIds.value)
    } else {
      treeRef.value.setExpandedKeys([])
    }
  }

  function selectAllChange(val: boolean) {
    if (val) {
      treeRef.value.setCheckedKeys(treeIds.value)
    } else {
      treeRef.value.setCheckedKeys([])
    }
  }

  function linkageChange(val: boolean) {
    isLinkage.value = val
  }

  function filterMethod(query: string, node: any) {
    return node.title.includes(query)
  }

  function handleRoleMenu() {
    const menuIds = treeRef.value.getCheckedKeys()
    if (menuIds.length === 0) {
      ElMessage.info('请选择菜单权限')
      return
    }
    fetchSetRoleMenuAuth({
      roleId: curRow.value.id,
      menuIds
    }).then((data) => {
      ElMessage.success(`设置${curRow.value.roleName}菜单权限成功`)
      curRow.value = null
      isExpandAll.value = false
      isSelectAll.value = false
      isLinkage.value = false
      if (data) {
        location.reload()
      } else {
        emit('ok')
        emit('close')
      }
    })
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (!curRow.value || (curRow.value && curRow.value.id !== props.row.id)) {
          curRow.value = cloneDeep(props.row)
          treeSearchValue.value = undefined
          const { id } = curRow.value
          const res = Promise.all([fetchGetRoleMenu({ id }), fetchGetRoleMenuIds({ id })])
          res.then(async ([menu, menuIds]) => {
            treeIds.value = getKeyList(menu, 'id')
            treeData.value = handleTree(menu)
            await nextTick(() => {
              treeRef.value.setExpandedKeys(treeIds.value)
              treeRef.value.setCheckedKeys(menuIds)
            })
            isExpandAll.value = true
            isSelectAll.value = false
          })
        } else {
          if (isExpandAll.value) {
            nextTick(() => {
              treeRef.value.setExpandedKeys(treeIds.value)
            })
          }
          if (isSelectAll.value) {
            nextTick(() => {
              treeRef.value.setCheckedKeys(treeIds.value)
            })
          }
        }
      }
    },
    { immediate: true }
  )
</script>

<template>
  <ElDrawer
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
    :show-close="false"
    :width="500"
  >
    <template #header>
      <div class="flex-cb mb-0!">
        <div class="text-lg font-semibold">菜单权限</div>
        <div class="flex-c gap-2 text-2xl">
          <div @click="emit('close')">
            <ArtSvgIcon icon="ri:close-line" />
          </div>
          <div @click="handleRoleMenu">
            <ArtSvgIcon icon="ri:check-line" />
          </div>
        </div>
      </div>
    </template>
    <ElDivider style="margin-top: 0" />
    <ElInput
      v-model="treeSearchValue"
      placeholder="请输入菜单进行搜索"
      clearable
      @input="queryChange"
    />
    <div class="flex-c gap-4">
      <ElCheckbox v-model="isExpandAll" label="展开/折叠" @change="expandAllChange" />
      <ElCheckbox v-model="isSelectAll" label="全选/全不选" @change="selectAllChange" />
      <ElCheckbox v-model="isLinkage" label="父子联动" @change="linkageChange" />
    </div>
    <ElTreeV2
      ref="treeRef"
      show-checkbox
      :data="treeData"
      :props="treeProps"
      :height="treeHeight"
      :check-strictly="!isLinkage"
      :filter-method="filterMethod"
    >
      <template #default="{ node }">
        <span>{{ node.label }}</span>
      </template>
    </ElTreeV2>
  </ElDrawer>
</template>
