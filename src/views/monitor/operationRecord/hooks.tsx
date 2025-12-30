import { useTableColumns } from '@/hooks/core/useTableColumns'
import { cloneDeep } from '@pureadmin/utils'
import {
  fetchGetOperationRecordList,
  fetchGetOperationRecordInfo,
  fetchDelOperationRecord,
  fetchBatchDelOperationRecord
} from '@/api/operationRecord'

export function useOperationRecord() {
  const showSearchBar = ref(true)
  const searchParams = ref({})
  const tableRef = ref()
  const loading = ref(true)
  const dataList = ref([])
  const { columns, columnChecks } = useTableColumns(() => [
    { type: 'selection', width: 50, fixed: 'left' },
    { label: 'ID', prop: 'id', width: 80, fixed: 'left' },
    { label: '用户名', prop: 'username', width: 120 },
    { label: '请求方式', prop: 'method', align: 'center' },
    { label: '请求路径', prop: 'path', minWidth: 150 },
    { label: '请求状态', prop: 'status', align: 'center' },
    {
      label: '请求耗时',
      prop: 'latency',
      align: 'center',
      formatter(row) {
        return row.latency + 'ms'
      }
    },
    { label: '请求IP', prop: 'requestIP', width: 150 },
    { label: '请求地点', prop: 'requestRegion' },
    { label: '操作系统', prop: 'requestOS', width: 120 },
    { label: '浏览器', prop: 'requestBrowser' },
    { label: '请求时间', prop: 'createdAt', width: 170 },
    { label: '操作', prop: 'operation', width: 120, align: 'center', fixed: 'right', useSlot: true }
  ])
  const pagination = ref({ current: 1, size: 10, total: 0 })
  const selectedRows = ref([])
  const drawerVisible = ref(false)
  const drawerInfo = ref()

  function getDataList() {
    loading.value = true
    const params = cloneDeep(searchParams.value)
    params.pageNo = pagination.value.current
    params.pageSize = pagination.value.size
    if (params.requestTime && params.requestTime.length === 2) {
      params.startTime = dayjs(params.requestTime[0]).format('YYYY-MM-DD HH:mm:ss')
      params.endTime = dayjs(params.requestTime[1]).format('YYYY-MM-DD HH:mm:ss')
      delete params.requestTime
    }
    fetchGetOperationRecordList(params).then((data) => {
      dataList.value = data.list || []
      pagination.value.total = data.total
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

  function handleSelectionChange(val) {
    selectedRows.value = val
  }

  function handleView(row) {
    fetchGetOperationRecordInfo({ id: row.id }).then((data) => {
      drawerInfo.value = data
      drawerVisible.value = true
    })
  }

  function handleDel(row) {
    ElMessageBox.confirm(`确认<strong style="color: var(--art-danger)">删除吗?`, '系统提示', {
      type: 'error',
      dangerouslyUseHTMLString: true
    }).then(() => {
      fetchDelOperationRecord({ id: row.id }).then(() => {
        ElMessage.success('删除成功')
        getDataList()
      })
    })
  }

  function handleBatchDel() {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请选择要删除的项')
      return
    }
    ElMessageBox.confirm(`确认批量删除吗?`, '系统提示', {
      type: 'error',
      dangerouslyUseHTMLString: true
    }).then(() => {
      fetchBatchDelOperationRecord({ ids: getKeyList(selectedRows, 'id') }).then(() => {
        selectedRows.value = []
        ElMessage.success('批量删除成功')
        getDataList()
      })
    })
  }

  return {
    // 参数
    loading,
    showSearchBar,
    searchParams,
    tableRef,
    columns,
    columnChecks,
    dataList,
    pagination,
    selectedRows,
    drawerVisible,
    drawerInfo,
    // 方法
    getDataList,
    handleReset,
    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    handleSelectionChange,
    handleView,
    handleDel,
    handleBatchDel
  }
}
