import { fetchGetRoleList } from '@/api/role'
import {
  fetchDelUser,
  fetchGetUserList,
  fetchSetStatus,
  fetchAddUser,
  fetchEditUser,
  fetchResetPassword
} from '@/api/user'
import { fetchGetDeptList } from '@/api/dept'
import { useTableColumns } from '@/hooks/core/useTableColumns'
import { cloneDeep, handleTree } from '@pureadmin/utils'

export function useUser() {
  const deptName = ref('')
  const showSearchBar = ref(true)
  const searchParams = ref({})
  const tableRef = ref()
  const loading = ref(true)
  const dataList = ref([])
  const { columns, columnChecks } = useTableColumns(() => [
    { label: 'ID', prop: 'id', width: 80, fixed: 'left' },
    { label: '用户名', prop: 'username' },
    { label: '昵称', prop: 'nickname' },
    { label: '性别', prop: 'gender', align: 'center', useSlot: true },
    { label: '所属部门', prop: 'deptName' },
    { label: '角色', prop: 'roleName' },
    { label: '手机号', prop: 'mobile' },
    { label: '状态', prop: 'status', align: 'center', useSlot: true },
    { label: '操作', prop: 'operation', width: 120, align: 'center', fixed: 'right', useSlot: true }
  ])
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0
  })
  const roleOptions = ref([])
  const deptOptions = ref([])
  const treeData = ref([])
  const treeLoading = ref(true)
  const dialogType = ref('add')
  const dialogInfo = ref({})
  const dialogVisible = ref(false)

  function getDataList() {
    loading.value = true
    const params = cloneDeep(searchParams.value)
    params.pageNo = pagination.value.current
    params.pageSize = pagination.value.size
    fetchGetUserList(params).then((res) => {
      dataList.value = res.list || []
      pagination.value.total = res.total
      setTimeout(() => {
        loading.value = false
      }, 100)
    })
  }

  function getRoleOptions() {
    fetchGetRoleList({ pageNo: -1 }).then((data) => {
      roleOptions.value = data.list || []
    })
  }

  function getDeptOptions() {
    fetchGetDeptList({ pageNo: -1 }).then((data) => {
      deptOptions.value = handleTree(data.list || [], 'id', 'parentId')
      treeData.value = handleTree(data.list || [], 'id', 'parentId')
      treeLoading.value = false
    })
  }

  function onTreeSelect({ id, selected }) {
    if (selected) {
      searchParams.value.deptId = id
    } else {
      delete searchParams.value.deptId
    }
    pagination.value.current = 1
    getDataList()
  }

  function handleReset() {
    if (searchParams.value.deptId) {
      searchParams.value = { deptId: searchParams.value.deptId }
    } else {
      searchParams.value = {}
    }
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
      `确认<strong style="color: var(--art-danger)">删除</strong>用户<strong style="color: var(--art-primary)">【${row.username}】</strong>吗?`,
      '系统提示',
      { type: 'error', dangerouslyUseHTMLString: true }
    ).then(() => {
      fetchDelUser({ id: row.id }).then(() => {
        ElMessage.success('删除成功')
        getDataList()
      })
    })
  }

  function handleSetStatus(row) {
    if (row.id) {
      ElMessageBox.confirm(
        `确认<strong style="color: ${row.status === 1 ? 'var(--art-primary)' : 'var(--art-danger)'}">${row.status === 1 ? '解冻' : '冻结'}</strong>用户<strong style="color: var(--art-primary)">【${row.roleName}】</strong>吗?`,
        '系统提示',
        { type: 'error', dangerouslyUseHTMLString: true }
      )
        .then(() => {
          fetchSetStatus({ id: row.id, status: row.status })
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
          fetchAddUser(data).then(() => {
            ElMessage.success('新增成功')
            dialogVisible.value = false
            getDataList()
          })
        } else {
          fetchEditUser(data).then(() => {
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

  function handleResetPassword(row) {
    ElMessageBox.confirm(
      `确认重置用户<strong style="color: var(--art-primary)">【${row.username}】</strong>的密码吗?`,
      '系统提示',
      { type: 'warning', dangerouslyUseHTMLString: true }
    ).then(() => {
      fetchResetPassword({ id: row.id }).then(() => {
        ElMessage.success('重置成功')
        getDataList()
      })
    })
  }

  return {
    deptName,
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
    dialogType,
    dialogInfo,
    dialogVisible,
    getDataList,
    getRoleOptions,
    getDeptOptions,
    onTreeSelect,
    handleReset,
    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    handleAdd,
    handleEdit,
    handleDel,
    handleSetStatus,
    handleSubmit,
    handleResetPassword
  }
}
