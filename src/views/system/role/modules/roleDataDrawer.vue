<script setup lang="ts">
  import { cloneDeep, getKeyList, handleTree } from '@pureadmin/utils'
  import { fetchGetDeptList } from '@/api/dept'
  import { fetchGetRoleDeptIds, fetchSetRoleDataPerm } from '@/api/role'
  import { useRole } from '../hooks'

  defineOptions({
    name: 'RoleDataDrawer'
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

  const { dataAuthOptions } = useRole()
  const curRow = ref()
  const dataPerm = ref()
  const treeRef = ref()
  const treeHeight = ref(window.innerHeight - 168)
  const treeProps = {
    value: 'id',
    label: 'deptName',
    children: 'children'
  }
  const treeIds = ref([])
  const treeData = ref([])

  function handleRoleData() {
    let deptIds = []
    if (dataPerm.value === 5) {
      deptIds = treeRef.value.getCheckedKeys()
      if (deptIds.length === 0) {
        ElMessage.info('请选择部门权限')
        return
      }
    }
    fetchSetRoleDataPerm({
      roleId: curRow.value.id,
      dataPerm: dataPerm.value,
      deptIds
    }).then(() => {
      ElMessage.success(`设置${curRow.value.roleName}数据权限成功`)
      curRow.value = null
      emit('ok')
      emit('close')
    })
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (!curRow.value || (curRow.value && curRow.value.id !== props.row.id)) {
          curRow.value = cloneDeep(props.row)
          dataPerm.value = curRow.value.dataPerm === 0 ? undefined : curRow.value.dataPerm
          const { id } = curRow.value
          const res = Promise.all([fetchGetDeptList({ pageNo: -1 }), fetchGetRoleDeptIds({ id })])
          res.then(async ([deptData, roleDeptIds]) => {
            treeIds.value = getKeyList(deptData.list, 'id')
            treeData.value = handleTree(deptData.list, 'id', 'parentId')
            if (roleDeptIds.length > 0) {
              await nextTick(() => {
                treeRef.value.setCheckedKeys(roleDeptIds)
              })
            }
          })
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
        <div class="text-lg font-semibold">数据权限</div>
        <div class="flex-c gap-2 text-2xl">
          <div @click="emit('close')">
            <ArtSvgIcon icon="ri:close-line" />
          </div>
          <div @click="handleRoleData">
            <ArtSvgIcon icon="ri:check-line" />
          </div>
        </div>
      </div>
    </template>
    <ElDivider style="margin-top: 0" />
    <ElSelect v-model="dataPerm" placeholder="请选择数据权限">
      <ElOption
        v-for="(item, index) in dataAuthOptions"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></ElOption>
    </ElSelect>
    <ElTreeV2
      v-if="dataPerm === 5"
      ref="treeRef"
      show-checkbox
      :data="treeData"
      :props="treeProps"
      :height="treeHeight"
      :default-expanded-keys="treeIds"
      :check-strictly="true"
      class="mt-3"
    >
      <template #default="{ node }">
        <span>{{ node.label }}</span>
      </template>
    </ElTreeV2>
  </ElDrawer>
</template>
