import { fetchEditMenu, fetchGetMenuList, fetchAddMenu, fetchDelMenu } from '@/api/menu'
import { useTableColumns } from '@/hooks'
import { handleTree, cloneDeep, isAllEmpty } from '@pureadmin/utils'

export function useMenu() {
  const showSearchBar = ref(true)
  const searchParams = ref({})
  const tableRef = ref()
  const loading = ref(true)
  const expandAll = ref(false)
  const treeList = ref([])
  const dataList = ref([])
  const { columns, columnChecks } = useTableColumns(() => [
    { label: 'ID', prop: 'id', width: 80, fixed: 'left' },
    { label: '菜单名称', prop: 'title', useSlot: true },
    { label: '菜单类型', prop: 'menuType', width: 100, align: 'center', useSlot: true },
    { label: '路由名称', prop: 'name' },
    { label: '路由路径', prop: 'path' },
    { label: '组件路径', prop: 'component' },
    { label: '权限标识', prop: 'authMark' },
    { label: '显示顺序', prop: 'displayOrder', width: 100, align: 'center' },
    { label: '操作', prop: 'operation', width: 160, align: 'center', fixed: 'right', useSlot: true }
  ])
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const dialogInfo = ref({})

  function getDataList() {
    loading.value = true
    fetchGetMenuList({ pageNo: -1 }).then((res) => {
      let newData = res.list || []
      treeList.value = handleTree(cloneDeep(newData), 'id', 'parentId')
      if (!isAllEmpty(searchParams.value.title)) {
        newData = newData.filter((item) => item.title.includes(searchParams.value.title))
      }
      if (!isAllEmpty(searchParams.value.name)) {
        newData = newData.filter((item) => item.name.includes(searchParams.value.name))
      }
      if (!isAllEmpty(searchParams.value.path)) {
        newData = newData.filter((item) => item.path.includes(searchParams.value.path))
      }
      dataList.value = handleTree(newData, 'id', 'parentId')
      setTimeout(() => {
        loading.value = false
      }, 100)
    })
  }

  function formatMenuOptions(treeList) {
    if (!treeList || !treeList.length) return []
    const newTreeList = []
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].menuType === 0 ? false : true
      formatMenuOptions(treeList[i].children)
      newTreeList.push(treeList[i])
    }
    return newTreeList
  }

  const getMenuTypeTag = (row): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    if (row.menuType === 0) return 'primary'
    if (row.menuType === 1) return 'success'
    if (row.menuType === 2) return 'warning'
    if (row.menuType === 3) return 'danger'
    return 'info'
  }
  const getMenuTypeText = (row): string => {
    if (row.menuType === 0) return '菜单'
    if (row.menuType === 1) return 'iframe'
    if (row.menuType === 2) return '外链'
    if (row.menuType === 3) return '按钮'
    return '未知'
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

  function handleAddChild(row) {
    dialogInfo.value = {
      parentId: row.id
    }
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
      `确认<strong style="color: var(--art-danger)">删除</strong>菜单<strong style="color: var(--art-primary)">【${row.title}】</strong>吗?`,
      '系统提示',
      { type: 'error', dangerouslyUseHTMLString: true }
    ).then(() => {
      fetchDelMenu({ id: row.id }).then(() => {
        ElMessage.success('删除成功')
        getDataList()
      })
    })
  }

  function handleSubmit(formRef, formData) {
    formRef.validate((valid) => {
      if (valid) {
        const menuType = formData.menuType
        let data = {}
        if (dialogType.value === 'add') {
          if (menuType !== 3) {
            data = cloneDeep(formData)
            delete data.isIframe
            delete data.authMark
            if (menuType === 0) {
              delete data.link
            } else {
              delete data.path
              delete data.component
              if (menuType === 1) {
                data.isIframe = true
              } else {
                delete data.isHideTab
                delete data.keepAlive
                delete data.fixedTab
              }
            }
          } else {
            data.menuType = formData.menuType
            data.parentId = formData.parentId
            data.title = formData.title
            data.authMark = formData.authMark
            data.displayOrder = formData.displayOrder
          }
          fetchAddMenu(data).then(() => {
            ElMessage.success('新增成功')
            dialogVisible.value = false
            getDataList()
          })
        } else {
          fetchEditMenu(data).then(() => {
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
  }
}
