import { useTableColumns } from '@/hooks/core/useTableColumns'
import { cloneDeep, getKeyList } from '@pureadmin/utils'
import {
  fetchGetLoginRecordList,
  fetchDelLoginRecord,
  fetchBatchDelLoginRecord
} from '@/api/loginRecord'
import { dayjs } from 'element-plus'

export function useLoginRecord() {
  const showSearchBar = ref(true)
  const searchParams = ref({})
  const tableRef = ref()
  const loading = ref(true)
  const dataList = ref([])
  const { columns, columnChecks } = useTableColumns(() => [
    { type: 'selection', width: 50, fixed: 'left' },
    { label: 'ID', prop: 'id', width: 80, fixed: 'left' },
    { label: '用户名', prop: 'username' },
    { label: '登录IP', prop: 'loginIP' },
    { label: '登录地点', prop: 'loginRegion' },
    { label: '操作系统', prop: 'loginOS' },
    { label: '浏览器', prop: 'loginBrowser' },
    { label: '登录状态', prop: 'loginStatus', align: 'center', useSlot: true },
    { label: '登录时间', prop: 'loginTime', width: 170 },
    { label: '操作', prop: 'operation', width: 120, align: 'center', fixed: 'right', useSlot: true }
  ])
  const pagination = ref({ current: 1, size: 10, total: 0 })
  const selectedRows = ref([])

  function getDataList() {
    loading.value = true
    const params = cloneDeep(searchParams.value)
    params.pageNo = pagination.value.current
    params.pageSize = pagination.value.size
    if (params.loginTime && params.loginTime.length === 2) {
      params.startTime = dayjs(params.loginTime[0]).format('YYYY-MM-DD HH:mm:ss')
      params.endTime = dayjs(params.loginTime[1]).format('YYYY-MM-DD HH:mm:ss')
      delete params.loginTime
    }
    fetchGetLoginRecordList(params).then((data) => {
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

  function handleDel(row) {
    ElMessageBox.confirm(`确认<strong style="color: var(--art-danger)">删除吗?`, '系统提示', {
      type: 'error',
      dangerouslyUseHTMLString: true
    }).then(() => {
      fetchDelLoginRecord({ id: row.id }).then(() => {
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
      fetchBatchDelLoginRecord({ ids: getKeyList(selectedRows, 'id') }).then(() => {
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
    // 方法
    getDataList,
    handleReset,
    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    handleSelectionChange,
    handleDel,
    handleBatchDel
  }
}
