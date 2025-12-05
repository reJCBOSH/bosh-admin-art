<script setup lang="ts">
  import { cloneDeep } from '@pureadmin/utils'

  defineOptions({ name: 'DeptDialog' })

  const props = defineProps({
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'add' },
    info: { type: Object, default: () => {} },
    deptOptions: { type: Array, default: () => [] }
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
      {
        label: '上级部门',
        prop: 'parentId',
        span: 24
      },
      { label: '部门名称', prop: 'deptName' },
      {
        label: '部门编码',
        prop: 'deptCode',
        tooltip: '部门编码唯一',
        props: {
          disabled: props.type === 'edit'
        }
      },
      {
        label: '部门状态',
        prop: 'status',
        type: 'select',
        options: [
          { label: '启用', value: 1 },
          { label: '停用', value: 0 }
        ]
      },
      {
        label: '显示顺序',
        prop: 'displayOrder',
        type: 'number',
        props: { min: 0, max: 9999, precision: 0, style: { width: '100%' } }
      },
      {
        label: '备注',
        prop: 'remark',
        type: 'input',
        span: 24,
        props: { type: 'textarea', rows: 2, maxlength: 200, showWordLimit: true }
      }
    ]
  }

  const rules = {
    deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
    deptCode: [{ required: true, message: '请输入部门编码', trigger: 'blur' }]
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.type === 'add') {
          formData.value = { status: 0, displayOrder: 99 }
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
    :title="dialogType === 'add' ? '新增部门' : '修改部门'"
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
    >
      <template #parentId>
        <ElCascader
          v-model="formData.parentId"
          :options="props.deptOptions"
          :props="{ value: 'id', label: 'deptName', emitPath: false, checkStrictly: true }"
          :disabled="dialogType === 'edit'"
          style="width: 100%"
          placeholder="请选择上级部门"
        >
          <template #default="{ node, data }">
            <span>{{ data.deptName }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </ElCascader>
      </template>
    </ArtForm>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="emit('cancel')">取消</ElButton>
        <ElButton type="primary" @click="emit('submit', formRef, formData)">确定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>
