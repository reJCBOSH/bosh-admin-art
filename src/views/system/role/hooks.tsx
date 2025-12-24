import { useTableColumns } from '@/hooks/core/useTableColumns'
import { cloneDeep } from '@pureadmin/utils'
import {
  fetchGetRoleList,
  fetchAddRole,
  fetchEditRole,
  fetchDelRole,
  fetchSetStatus
} from '@/api/role'

export function useRole() {
  const showSearchBar = ref(true)
  const searchParams = ref({})
  const tableRef = ref()
  const loading = ref(true)
  const dataList = ref([])
  const { columns, columnChecks } = useTableColumns(() => [
    { label: 'ID', prop: 'id', width: 80, fixed: 'left' },
    { label: '角色名称', prop: 'roleName' },
    { label: '角色编码', prop: 'roleCode' },
    { label: '状态', prop: 'status', align: 'center', useSlot: true },
    { label: '备注', prop: 'remark', width: 180, showOverflowTooltip: true },
    { label: '更新时间', prop: 'updatedAt', width: 180 },
    { label: '操作', prop: 'operation', width: 160, align: 'center', fixed: 'right', useSlot: true }
  ])
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0
  })
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const dialogInfo = ref({})
  const currentRow = ref()
  const roleMenuVisible = ref(false)
  const roleDataVisible = ref(false)
  const dataAuthOptions = [
    { value: 1, label: '全部数据' },
    { value: 2, label: '本部门数据' },
    { value: 3, label: '本部门及以下数据' },
    { value: 4, label: '本人数据' },
    { value: 5, label: '自定义数据' }
  ]

  function getDataList() {
    loading.value = true
    const params = cloneDeep(searchParams.value)
    params.pageNo = pagination.value.current
    params.pageSize = pagination.value.size
    fetchGetRoleList(params).then((res) => {
      dataList.value = res.list || []
      pagination.value.total = res.total
      setTimeout(() => {
        loading.value = false
      }, 100)
    })
  }

  function handleReset() {
    searchParams.value = {}
    pagination.value.current = 1
    getDataList()
  }

  function handleSearch() {
    pagination.value.current = 1
    getDataList()
  }

  function handleCurrentChange(current: number) {
    pagination.value.current = current
    getDataList()
  }

  function handleSizeChange(size: number) {
    pagination.value.size = size
    getDataList()
  }

  function handleAdd() {
    dialogType.value = 'add'
    dialogInfo.value = {}
    dialogVisible.value = true
  }

  function handleEdit(row) {
    dialogType.value = 'edit'
    dialogInfo.value = cloneDeep(row)
    dialogVisible.value = true
  }

  function handleDel(row) {
    ElMessageBox.confirm(
      `确认<strong style="color: var(--art-danger)">删除</strong>角色<strong style="color: var(--art-primary)">【${row.roleName}】</strong>吗?`,
      '系统提示',
      { type: 'error', dangerouslyUseHTMLString: true }
    ).then(() => {
      fetchDelRole({ id: row.id }).then(() => {
        ElMessage.success('删除成功')
        getDataList()
      })
    })
  }

  function handleSwitchStatus(row) {
    if (row.id) {
      ElMessageBox.confirm(
        `确认<strong style="color: ${row.status === 1 ? 'var(--art-primary)' : 'var(--art-danger)'}">${row.status === 1 ? '启用' : '停用'}</strong>角色<strong style="color: var(--art-primary)">【${row.roleName}】</strong>吗?`,
        '系统提示',
        { type: 'error', dangerouslyUseHTMLString: true }
      )
        .then(() => {
          fetchSetStatus({ roleId: row.id, status: row.status })
            .then(() => {
              ElMessage.success('操作成功')
            })
            .catch(() => {
              row.status = row.status === 1 ? 0 : 1
            })
        })
        .catch(() => {
          row.status = row.status === 1 ? 0 : 1
        })
    }
  }

  function handleSubmit(formRef, formData) {
    formRef.validate((valid) => {
      if (valid) {
        const data = cloneDeep(formData)
        if (dialogType.value === 'add') {
          fetchAddRole(data).then(() => {
            ElMessage.success('新增成功')
            dialogVisible.value = false
            getDataList()
          })
        } else {
          fetchEditRole(data).then(() => {
            ElMessage.success('编辑成功')
            dialogVisible.value = false
            getDataList()
          })
        }
      } else {
        ElMessage.warning('请检查表单填写是否正确')
      }
    })
  }

  function handleRoleMenu(row) {
    currentRow.value = cloneDeep(row)
    roleMenuVisible.value = true
  }

  function handleRoleData(row) {
    currentRow.value = cloneDeep(row)
    roleDataVisible.value = true
  }

  return {
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
    dataAuthOptions,
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
  }
}
