<script setup lang="ts">
  import { cloneDeep } from '@pureadmin/utils'

  defineOptions({ name: 'UserDialog' })

  const props = defineProps({
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'add' },
    info: { type: Object, default: () => {} },
    deptOptions: { type: Array, default: () => [] },
    roleOptions: { type: Array, default: () => [] }
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
      { label: '用户名', prop: 'username', fieldProps: { disabled: props.type === 'edit' } },
      {
        label: '密码',
        prop: 'password',
        tooltip: '密码格式应为8-16位大写字母、小写字母、数字、特殊字符!@#$%^&*?.的组合',
        fieldProps: { type: 'password', showPassword: true },
        hidden: props.type === 'edit'
      },
      { label: '昵称', prop: 'nickname' },
      {
        label: '性别',
        prop: 'gender',
        type: 'select',
        options: [
          { label: '未知', value: 0 },
          { label: '男', value: 1 },
          { label: '女', value: 2 }
        ]
      },
      { label: '所属部门', prop: 'deptId' },
      {
        label: '角色',
        prop: 'roleId',
        type: 'select',
        options: props.roleOptions,
        fieldProps: { props: { label: 'roleName', value: 'id' } }
      },
      { label: '联系方式', prop: 'mobile' },
      {
        label: '状态',
        prop: 'status',
        type: 'switch',
        fieldProps: {
          inlinePrompt: true,
          activeValue: 1,
          inactiveValue: 0,
          activeText: '正常',
          inactiveText: '冻结'
        },
        hidden: props.type === 'edit'
      },
      { label: '备注', prop: 'remark', fieldProps: { type: 'textarea' } }
    ]
  }

  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        trigger: 'blur',
        pattern: /^.*(?=.{8,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?.]).*$/,
        message: '密码格式应为8-16位大写字母、小写字母、数字、特殊字符!@#$%^&*?.的组合'
      }
    ],
    nickname: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
    roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.type === 'add') {
          formData.value = { gender: 0, status: 1 }
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
    :title="(dialogType === 'add' ? '新增' : '修改') + '用户'"
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
    >
      <template #deptId>
        <ElCascader
          v-model="formData.deptId"
          :options="props.deptOptions"
          :props="{ value: 'id', label: 'deptName', emitPath: false, checkStrictly: true }"
          clearable
          style="width: 100%"
          placeholder="请选择所属部门"
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
