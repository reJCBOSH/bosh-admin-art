<script setup lang="ts">
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'
  import { storeToRefs } from 'pinia'
  import { useSettingStore } from '@/store/modules/setting'

  defineOptions({ name: 'OperationRecordDrawer' })

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Object,
      default: () => ({})
    }
  })

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'close'): void
  }>()
  const drawerVisible = computed({
    get() {
      return props.visible
    },
    set(val) {
      emit('update:visible', val)
    }
  })

  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)
</script>

<template>
  <ElDrawer
    v-model="drawerVisible"
    title="操作日志详情"
    direction="btt"
    size="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="emit('close')"
  >
    <ElDescriptions border :column="4" :label-width="120">
      <ElDescriptionsItem label="用户名" :width="120">{{ modelValue.username }}</ElDescriptionsItem>
      <ElDescriptionsItem label="请求方法" :width="120">{{ modelValue.method }}</ElDescriptionsItem>
      <ElDescriptionsItem label="请求路径" :span="2">{{ modelValue.path }}</ElDescriptionsItem>
      <ElDescriptionsItem label="请求状态">{{ modelValue.status }}</ElDescriptionsItem>
      <ElDescriptionsItem label="请求延迟">{{ modelValue.latency + 'ms' }}</ElDescriptionsItem>
      <ElDescriptionsItem label="请求IP">{{ modelValue.requestIP }}</ElDescriptionsItem>
      <ElDescriptionsItem label="请求地点">{{ modelValue.requestRegion }}</ElDescriptionsItem>
      <ElDescriptionsItem label="操作系统">{{ modelValue.requestOS }}</ElDescriptionsItem>
      <ElDescriptionsItem label="浏览器">{{ modelValue.requestBrowser }}</ElDescriptionsItem>
      <ElDescriptionsItem label="User-Agent" :span="2">
        {{ modelValue.userAgent }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="请求时间">{{ modelValue.createdAt }}</ElDescriptionsItem>
    </ElDescriptions>
    <ElRow :gutter="16" class="mt-3">
      <ElCol :span="12">
        <ElTabs type="border-card" style="height: calc(80vh - 260px)">
          <ElTabPane label="请求头">
            <ElScrollbar max-height="calc(80vh - 320px)">
              <VueJsonPretty
                :data="JSON.parse(modelValue.requestHeader)"
                :theme="isDark ? 'dark' : 'light'"
              />
            </ElScrollbar>
          </ElTabPane>
          <ElTabPane label="请求体">
            <ElScrollbar max-height="calc(80vh - 320px)">
              <VueJsonPretty
                :data="JSON.parse(modelValue.requestBody)"
                :theme="isDark ? 'dark' : 'light'"
              />
            </ElScrollbar>
          </ElTabPane>
        </ElTabs>
      </ElCol>
      <ElCol :span="12">
        <ElTabs type="border-card" style="height: calc(80vh - 260px)">
          <ElTabPane label="响应头">
            <ElScrollbar max-height="calc(80vh - 320px)">
              <VueJsonPretty
                :data="JSON.parse(modelValue.responseHeader)"
                :theme="isDark ? 'dark' : 'light'"
              />
            </ElScrollbar>
          </ElTabPane>
          <ElTabPane label="响应体">
            <ElScrollbar max-height="calc(80vh - 320px)">
              <VueJsonPretty
                :data="JSON.parse(modelValue.responseBody)"
                :theme="isDark ? 'dark' : 'light'"
              />
            </ElScrollbar>
          </ElTabPane>
        </ElTabs>
      </ElCol>
    </ElRow>
  </ElDrawer>
</template>
