<script setup lang="ts">
  import { cloneDeep } from '@pureadmin/utils'

  defineOptions({ name: 'RoleDialog' })

  const props = defineProps({
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'add' },
    info: { type: Object, default: () => {} }
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
      { label: '角色名称', prop: 'roleName' },
      {
        label: '角色编码',
        prop: 'roleCode',
        tooltip: '只支持英文字母及数字, 且已字母开头',
        fieldProps: { disabled: props.type === 'edit' }
      },
      {
        label: '备注',
        prop: 'remark',
        fieldProps: {
          type: 'textarea',
          maxLength: 200,
          showWordLimit: true,
          autosize: { minRows: 2 }
        },
        span: 24
      }
    ]
  }

  const rules = {
    roleName: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    roleCode: [
      { required: true, message: '请输入角色编码', trigger: 'blur' },
      { pattern: /^[a-zA-Z][a-zA-Z0-9]*$/, message: '只支持英数字, 且已字母开头', trigger: 'blur' }
    ]
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
        setTimeout(() => {
          formData.value = {}
        }, 100)
      }
    },
    { immediate: true }
  )
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="(dialogType === 'add' ? '新增' : '修改') + '角色'"
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
      label-width="100px"
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
