import { fetchDelDept, fetchGetDeptList, fetchAddDept, fetchEditDept } from '@/api/dept'
import { useTableColumns } from '@/hooks'
import { cloneDeep, handleTree, isAllEmpty } from '@pureadmin/utils'
import { ElMessageBox, ElMessage } from 'element-plus'

export function useDept() {
  const showSearchBar = ref(true)
  const searchParams = ref({})
  const tableRef = ref()
  const loading = ref(true)
  const expandAll = ref(false)
  const treeList = ref([])
  const dataList = ref([])
  const { columns, columnChecks } = useTableColumns(() => [
    { label: 'ID', prop: 'id', fixed: 'left' },
    { label: '部门名称', prop: 'deptName' },
    { label: '部门编码', prop: 'deptCode' },
    { label: '状态', prop: 'status', align: 'center', useSlot: true },
    { label: '显示顺序', prop: 'displayOrder', align: 'center' },
    { label: '更新时间', prop: 'updatedAt', width: 180 },
    { label: '操作', prop: 'operation', width: 120, align: 'center', fixed: 'right', useSlot: true }
  ])
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const dialogInfo = ref({})

  function getDataList() {
    loading.value = true
    fetchGetDeptList({ pageNo: -1 }).then((res) => {
      let newData = res.list || []
      treeList.value = handleTree(cloneDeep(newData), 'id', 'parentId')
      if (!isAllEmpty(searchParams.value.deptName)) {
        newData = newData.filter((item) => item.deptName.includes(searchParams.value.deptName))
      }
      if (!isAllEmpty(searchParams.value.deptCode)) {
        newData = newData.filter((item) => item.deptCode.includes(searchParams.value.deptCode))
      }
      if (!isAllEmpty(searchParams.value.status)) {
        newData = newData.filter((item) => item.status === searchParams.value.status)
      }
      dataList.value = handleTree(newData, 'id', 'parentId')
      setTimeout(() => {
        loading.value = false
      }, 100)
    })
  }

  function formatDeptOptions(treeList) {
    if (!treeList || !treeList.length) return
    const newTreeList = []
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false
      formatDeptOptions(treeList[i].children)
      newTreeList.push(treeList[i])
    }
    return newTreeList
  }

  function handleReset() {
    searchParams.value = {}
    getDataList()
  }

  function handleSearch() {
    getDataList()
  }

  function handleExpand() {
    expandAll.value = !expandAll.value
    nextTick(() => {
      if (tableRef.value?.elTableRef && dataList.value) {
        const processRows = (rows) => {
          rows.forEach((row) => {
            if (row.children?.length) {
              tableRef.value.elTableRef.toggleRowExpansion(row, expandAll.value)
              processRows(row.children)
            }
          })
        }
        processRows(dataList.value)
      }
    })
  }

  function handleAdd() {
    dialogInfo.value = {}
    dialogType.value = 'add'
    dialogVisible.value = true
  }

  function handleEdit(row) {
    dialogInfo.value = cloneDeep(row)
    dialogType.value = 'edit'
    dialogVisible.value = true
  }

  function handleDel(row) {
    ElMessageBox.confirm(
      `确认<strong style="color: var(--art-danger)">删除</strong>部门<strong style="color: var(--el-color-danger)">【${row.deptName}】</strong>吗?`,
      '系统提示',
      { type: 'error', dangerouslyUseHTMLString: true }
    ).then(() => {
      fetchDelDept({ id: row.id }).then(() => {
        ElMessage.success('删除成功')
        getDataList()
      })
    })
  }

  function handleSubmit(formRef, formData) {
    formRef.validate((valid) => {
      if (valid) {
        const data = cloneDeep(formData)
        if (dialogType.value === 'add') {
          fetchAddDept(data).then(() => {
            ElMessage.success('新增成功')
            dialogVisible.value = false
            getDataList()
          })
        } else {
          fetchEditDept(data).then(() => {
            ElMessage.success('修改成功')
            dialogVisible.value = false
            getDataList()
          })
        }
      } else {
        ElMessage.warning('请检查表单填写是否正确')
      }
    })
  }

  return {
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
    formatDeptOptions,
    handleReset,
    handleSearch,
    handleExpand,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleDel
  }
}
