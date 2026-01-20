<script setup lang="ts">
  import { cloneDeep } from '@pureadmin/utils'

  defineOptions({ name: 'ApiDialog' })

  const props = defineProps({
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'add' },
    info: { type: Object, default: () => {} },
    groupOptions: { type: Array, default: () => [] }
  })

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'cancel'): void
    (e: 'submit', form: any, data: any): void
  }>()
  const dialogVisible = computed({
    get() {
      return props.visible
    },
    set(val) {
      emit('update:visible', val)
    }
  })
  const dialogType = computed(() => props.type)

  const formRef = ref()
  const formData = ref({})
  const getFormItems = () => {
    return [
      { label: '名称', prop: 'apiName', fieldProps: { maxlength: 128 } },
      {
        label: '分组',
        prop: 'apiGroup',
        type: 'select',
        options: props.groupOptions,
        fieldProps: {
          filterable: true,
          allowCreate: true
        }
      },
      {
        label: '方法',
        prop: 'apiMethod',
        type: 'select',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' }
        ]
      },
      { label: '路径', prop: 'apiPath', fieldProps: { maxlength: 128 } },
      {
        label: '描述',
        prop: 'apiDesc',
        fieldProps: {
          type: 'textarea',
          autosize: { minRows: 2 },
          maxlength: 200,
          showWordLimit: true
        }
      },
      {
        label: '是否必选',
        prop: 'isRequired',
        type: 'switch',
        fieldProps: {
          inlinePrompt: true,
          activeText: '是',
          inactiveText: '否',
          activeValue: 1,
          inactiveValue: 0
        }
      }
    ]
  }

  const rules = {
    apiName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    apiGroup: [{ required: true, message: '请输入分组', trigger: 'blur' }],
    apiMethod: [{ required: true, message: '请选择方法', trigger: 'blur' }],
    apiPath: [{ required: true, message: '请输入路径', trigger: 'blur' }]
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.type === 'add') {
          formData.value = {}
        } else {
          formData.value = cloneDeep(props.info)
        }
      } else {
        formData.value = {}
      }
    },
    { immediate: true }
  )
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="(dialogType === 'add' ? '新增' : '修改') + 'Api'"
    width="800"
    align-center
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :draggable="true"
    @close="emit('cancel')"
  >
    <ArtForm
      ref="formRef"
      v-model="formData"
      :items="getFormItems()"
      :rules="rules"
      :show-reset="false"
      :show-submit="false"
    />
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="emit('cancel')">取消</ElButton>
        <ElButton type="primary" @click="emit('submit', formRef, formData)">确定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>
