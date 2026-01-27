<!-- 图标选择器 -->
<template>
  <ElInput v-model="inputValue" placeholder="请选择图标" disabled>
    <template #append>
      <ElPopover
        trigger="click"
        :width="370"
        :popper-options="{ placement: 'auto' }"
        @before-enter="onBeforeEnter"
        @after-leave="onAfterLeave"
      >
        <template #reference>
          <div class="w-8 cursor-pointer flex-cc">
            <ArtSvgIcon v-if="!icon" icon="ri:search-eye-line" class="w-4 h-4" />
            <ArtSvgIcon v-else :icon="inputValue" class="w-4 h-4" />
          </div>
        </template>

        <ElInput v-model="filterValue" placeholder="搜索图标" clearable />

        <ElTabs v-model="currentActiveType" @tab-click="handleClick">
          <ElTabPane v-for="item in tabList" :key="item.name" :label="item.label" :name="item.name">
            <ElScrollbar height="210px">
              <ul class="flex flex-wrap px-1">
                <li
                  v-for="(item, key) in pageList"
                  :key="key"
                  :title="item"
                  class="icon-item p-1 cursor-pointer flex-cc border border-[#e5e7eb]"
                  :style="iconItemStyle(item)"
                  @click="onChangeIcon(item)"
                >
                  <ArtSvgIcon :icon="currentActiveType + item" class="w-8 h-8" />
                </li>
              </ul>
              <ElEmpty
                v-show="pageList.length === 0"
                :description="`${filterValue} 图标不存在`"
                :image-size="60"
              />
            </ElScrollbar>
          </ElTabPane>
        </ElTabs>

        <div class="mt-2 flex items-center">
          <ElPagination
            class="m-auto"
            :current-page="currentPage"
            :page-size="pageSize"
            :pager-count="5"
            :total="totalPage"
            background
            layout="prev, pager, next"
            size="small"
            @current-change="onCurrentChange"
          />
        </div>
      </ElPopover>
    </template>
  </ElInput>
</template>

<script setup lang="ts">
  import riIcons from '@iconify-json/ri/icons.json'
  import epIcons from '@iconify-json/ep/icons.json'
  import { isAllEmpty } from '@pureadmin/utils'

  defineOptions({
    name: 'ArtIconSelector'
  })

  const inputValue = defineModel({ type: String })

  const iconList = ref(Object.keys(riIcons.icons))
  const icon = ref()
  const currentActiveType = ref('ri:')
  const currentPage = ref(1)
  const pageSize = ref(40)
  const totalPage = ref(0)

  const filterValue = ref('')
  const tabList = [
    { label: 'Remix Icon', name: 'ri:' },
    { label: 'Element Plus', name: 'ep:' }
  ]

  const pageList = computed(() =>
    iconList.value
      .filter((i) => i.includes(filterValue.value))
      .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
  )

  const iconItemStyle = computed(() => {
    return (item) => {
      if (inputValue.value === currentActiveType.value + item) {
        return {
          borderColor: 'var(--theme-color)',
          color: 'var(--theme-color)'
        }
      }
    }
  })

  function setVal() {
    currentActiveType.value = inputValue.value.substring(0, inputValue.value.indexOf(':') + 1)
    icon.value = inputValue.value.substring(inputValue.value.indexOf(':') + 1)
  }

  function onBeforeEnter() {
    if (isAllEmpty(icon.value)) return
    setVal()
    // 寻找当前图标在第几页
    const curIconIndex = iconList.value.findIndex((i) => i === icon.value)
    currentPage.value = Math.ceil((curIconIndex + 1) / pageSize.value)
  }

  function onAfterLeave() {
    filterValue.value = ''
  }

  function handleClick({ props }) {
    currentPage.value = 1
    currentActiveType.value = props.name
    if (props.name === 'ep:') {
      iconList.value = Object.keys(epIcons.icons)
    } else {
      iconList.value = Object.keys(riIcons.icons)
    }
  }

  function onChangeIcon(item) {
    icon.value = item
    inputValue.value = currentActiveType.value + item
  }

  function onCurrentChange(page) {
    currentPage.value = page
  }

  watch(
    () => pageList.value,
    () => (totalPage.value = iconList.value.filter((i) => i.includes(filterValue.value)).length),
    { immediate: true }
  )
  watch(
    () => inputValue.value,
    (val) => val && setVal(),
    { immediate: true }
  )
  watch(
    () => filterValue.value,
    () => (currentPage.value = 1)
  )
</script>

<style scoped lang="scss">
  :deep(.el-input-group__append) {
    padding: 0;
  }

  :deep(.el-tabs__header) {
    position: static;
    padding: 0 4px;
    margin-bottom: 8px;
    box-shadow: 0 2px 5px rgb(0 0 0 / 6%);
  }

  :deep(.el-tabs__item) {
    height: 30px;
    padding: 0 10px;
    font-size: 12px;
    font-weight: normal;
    line-height: 30px;
  }

  .icon-item {
    &:hover {
      color: var(--theme-color);
      border-color: var(--theme-color);
      transition: all 0.4s;
      transform: scaleX(1.05);
    }
  }
</style>
