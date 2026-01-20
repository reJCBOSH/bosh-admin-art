import { useTableColumns } from '@/hooks/core/useTableColumns'
import { cloneDeep } from '@pureadmin/utils'
import {
  fetchGetApiList,
  fetchAddApi,
  fetchEditApi,
  fetchDelApi,
  fetchApiGroupsGet
} from '@/api/api'

export function useApi() {
  const showSearchBar = ref(true)
  const searchParams = ref({})
  const tableRef = ref()
  const loading = ref(true)
  const dataList = ref([])
  const { columns, columnChecks } = useTableColumns(() => [
    { label: 'ID', prop: 'id', width: 80, fixed: 'left' },
    { label: '接口名称', prop: 'apiName' },
    { label: '分组', prop: 'apiGroup' },
    { label: '方法', prop: 'apiMethod', useSlot: true },
    { label: '路径', prop: 'apiPath' },
    { label: '描述', prop: 'apiDesc', width: 200, showOverflow: true },
    { label: '是否必选', prop: 'isRequired', useSlot: true },
    { label: '更新时间', prop: 'updatedAt', width: 180 },
    { label: '操作', prop: 'operation', width: 120, align: 'center', fixed: 'right', useSlot: true }
  ])
  const pagination = ref({ current: 1, size: 10, total: 0 })
  const dialogType = ref('add')
  const dialogInfo = ref({})
  const dialogVisible = ref(false)
  const groupOptions = ref([])

  function getDataList() {
    loading.value = true
    const params = cloneDeep(searchParams.value)
    params.pageNo = pagination.value.current
    params.pageSize = pagination.value.size
    fetchGetApiList(params).then((data) => {
      dataList.value = data.list || []
      pagination.value.total = data.total
      setTimeout(() => {
        loading.value = false
      }, 100)
    })
  }

  function getApiGroupOptions() {
    fetchApiGroupsGet().then((data) => {
      groupOptions.value = data.map((item) => {
        return { label: item, value: item }
      })
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
      `确认<strong style="color: var(--art-danger)">删除</strong><strong style="color: var(--art-primary)">【${row.apiName}】</strong>吗?`,
      '系统提示',
      { type: 'error', dangerouslyUseHTMLString: true }
    ).then(() => {
      fetchDelApi({ id: row.id }).then(() => {
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
          fetchAddApi(data).then(() => {
            ElMessage.success('新增成功')
            dialogVisible.value = false
            getDataList()
          })
        } else {
          fetchEditApi(data).then(() => {
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

  return {
    loading,
    showSearchBar,
    searchParams,
    tableRef,
    columns,
    columnChecks,
    dataList,
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
  }
}
