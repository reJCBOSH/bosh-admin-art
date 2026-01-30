<!-- 个人中心页面 -->
<template>
  <div class="w-full h-full p-0 bg-transparent border-none shadow-none">
    <div class="relative flex-b mt-2.5 max-md:block max-md:mt-1">
      <div class="w-112 mr-5 max-md:w-full max-md:mr-0">
        <div class="art-card-sm relative p-9 pb-6 overflow-hidden text-center">
          <img class="absolute top-0 left-0 w-full h-50 object-cover" src="@imgs/user/bg.webp" />
          <img
            class="relative z-10 w-20 h-20 mt-30 mx-auto object-cover border-2 border-white rounded-full"
            src="@imgs/user/avatar.webp"
          />
          <h2 class="mt-5 text-xl font-normal">{{ userInfo.userName }}</h2>
          <p class="mt-5 text-sm">专注于用户体验跟视觉设计</p>

          <div class="w-75 mx-auto mt-7.5 text-left">
            <div class="mt-2.5">
              <ArtSvgIcon icon="ri:mail-line" class="text-g-700" />
              <span class="ml-2 text-sm">jdkjjfnndf@mall.com</span>
            </div>
            <div class="mt-2.5">
              <ArtSvgIcon icon="ri:user-3-line" class="text-g-700" />
              <span class="ml-2 text-sm">交互专家</span>
            </div>
            <div class="mt-2.5">
              <ArtSvgIcon icon="ri:map-pin-line" class="text-g-700" />
              <span class="ml-2 text-sm">广东省深圳市</span>
            </div>
            <div class="mt-2.5">
              <ArtSvgIcon icon="ri:dribbble-fill" class="text-g-700" />
              <span class="ml-2 text-sm">字节跳动－某某平台部－UED</span>
            </div>
          </div>

          <div class="mt-10">
            <h3 class="text-sm font-medium">标签</h3>
            <div class="flex flex-wrap justify-center mt-3.5">
              <div
                v-for="item in lableList"
                :key="item"
                class="py-1 px-1.5 mr-2.5 mb-2.5 text-xs border border-g-300 rounded"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-hidden max-md:w-full max-md:mt-3.5">
        <div class="art-card-sm">
          <div class="text-lg font-normal border-b border-g-300 px-4 py-3">基本信息</div>

          <ElForm
            :model="form"
            class="box-border p-5 [&>.el-row_.el-form-item]:w-[calc(50%-10px)] [&>.el-row_.el-input]:w-full [&>.el-row_.el-select]:w-full"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <ElRow>
              <ElFormItem label="姓名" prop="realName">
                <ElInput v-model="form.realName" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="性别" prop="sex" class="ml-5">
                <ElSelect v-model="form.sex" placeholder="Select" :disabled="!isEdit">
                  <ElOption
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElRow>

            <ElRow>
              <ElFormItem label="昵称" prop="nikeName">
                <ElInput v-model="form.nikeName" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="邮箱" prop="email" class="ml-5">
                <ElInput v-model="form.email" :disabled="!isEdit" />
              </ElFormItem>
            </ElRow>

            <ElRow>
              <ElFormItem label="手机" prop="mobile">
                <ElInput v-model="form.mobile" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="地址" prop="address" class="ml-5">
                <ElInput v-model="form.address" :disabled="!isEdit" />
              </ElFormItem>
            </ElRow>

            <ElFormItem label="个人介绍" prop="des" class="h-32">
              <ElInput type="textarea" :rows="4" v-model="form.des" :disabled="!isEdit" />
            </ElFormItem>

            <div class="flex-c justify-end [&_.el-button]:!w-27.5">
              <ElButton type="primary" class="w-22.5" v-ripple @click="edit">
                {{ isEdit ? '保存' : '编辑' }}
              </ElButton>
            </div>
          </ElForm>
        </div>

        <div class="art-card-sm my-5">
          <div class="flex items-center justify-between px-4 py-3">
            <div class="text-lg font-normal">修改密码</div>
            <ElButton type="primary" class="w-22.5" v-ripple @click="showPwdEditDialog">
              修改
            </ElButton>
          </div>
        </div>

        <ElDialog v-model="editPwdVisible" title="修改密码" :width="600">
          <ElAlert
            title="密码格式：8-16位字母、数字、特殊字符!@#$%^&*?.的组合"
            type="warning"
            show-icon
            :closable="false"
          />
          <ElForm
            ref="pwdFormRef"
            :model="pwdForm"
            :rules="pwdFormRule"
            class="box-border p-3"
            label-width="auto"
          >
            <ElFormItem label="当前密码" prop="oldPassword">
              <ElInput
                v-model="pwdForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入当前密码"
              />
            </ElFormItem>
            <ElFormItem label="新密码" prop="newPassword">
              <ElInput
                v-model="pwdForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </ElFormItem>
            <ElFormItem label="确认新密码" prop="rePassword">
              <ElInput
                v-model="pwdForm.rePassword"
                type="password"
                show-password
                placeholder="请重复输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <template #footer>
            <ElButton v-ripple @click="editPwdVisible = false">取消</ElButton>
            <ElButton type="primary" v-ripple @click="handleEditPwd">保存</ElButton>
          </template>
        </ElDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { fetchEditSelfPassword } from '@/api/user'
  import { useUserStore } from '@/store/modules/user'
  import type { FormInstance, FormRules } from 'element-plus'

  defineOptions({ name: 'UserCenter' })

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo)

  const isEdit = ref(false)
  const date = ref('')
  const ruleFormRef = ref<FormInstance>()

  /**
   * 用户信息表单
   */
  const form = reactive({
    realName: 'John Snow',
    nikeName: '皮卡丘',
    email: '59301283@mall.com',
    mobile: '18888888888',
    address: '广东省深圳市宝安区西乡街道101栋201',
    sex: '2',
    des: 'Art Design Pro 是一款兼具设计美学与高效开发的后台系统.'
  })

  /**
   * 表单验证规则
   */
  const rules = reactive<FormRules>({
    realName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    nikeName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'blur' }]
  })

  /**
   * 性别选项
   */
  const options = [
    { value: '1', label: '男' },
    { value: '2', label: '女' }
  ]

  /**
   * 用户标签列表
   */
  const lableList: Array<string> = ['专注设计', '很有想法', '辣~', '大长腿', '川妹子', '海纳百川']

  onMounted(() => {
    getDate()
  })

  /**
   * 根据当前时间获取问候语
   */
  const getDate = () => {
    const h = new Date().getHours()

    if (h >= 6 && h < 9) date.value = '早上好'
    else if (h >= 9 && h < 11) date.value = '上午好'
    else if (h >= 11 && h < 13) date.value = '中午好'
    else if (h >= 13 && h < 18) date.value = '下午好'
    else if (h >= 18 && h < 24) date.value = '晚上好'
    else date.value = '很晚了，早点睡'
  }

  /**
   * 切换用户信息编辑状态
   */
  const edit = () => {
    isEdit.value = !isEdit.value
  }

  const pwdFormRef = ref()
  const REGEXP_PWD = /^(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*?.])[A-Za-z0-9!@#$%^&*?.]{8,16}$/
  const pwdFormRule = reactive<FormRules>({
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value === pwdForm.oldPassword) {
            return callback(new Error('新密码不能与旧密码一致'))
          }
          if (!REGEXP_PWD.test(value)) {
            return callback(new Error('密码格式不正确'))
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    rePassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value !== pwdForm.newPassword) {
            return callback(new Error('重复密码与新密码不一致'))
          }
          if (!REGEXP_PWD.test(value)) {
            return callback(new Error('密码格式不正确'))
          }
          callback()
        },
        trigger: 'blur'
      }
    ]
  })
  const editPwdVisible = ref(false)
  const editPwdLoading = ref(false)
  const pwdForm = reactive({
    oldPassword: '',
    newPassword: '',
    rePassword: ''
  })

  function showPwdEditDialog() {
    setTimeout(() => {
      pwdFormRef.value.resetFields()
    })
    editPwdLoading.value = false
    editPwdVisible.value = true
  }

  function handleEditPwd() {
    pwdFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        editPwdLoading.value = true
        fetchEditSelfPassword(pwdForm)
          .then(() => {
            ElMessage.success('修改密码成功')
            editPwdVisible.value = false
          })
          .finally(() => {
            editPwdLoading.value = false
          })
      } else {
        ElMessage.error('请填写正确的表单')
      }
    })
  }
</script>
