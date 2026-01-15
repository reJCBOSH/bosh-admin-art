<!-- 登录页面 -->
<template>
  <div class="flex w-full h-screen">
    <LoginLeftView />

    <div class="relative flex-1">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">{{ $t('login.title') }}</h3>
          <p class="sub-title">{{ $t('login.subTitle') }}</p>
          <ElForm
            ref="formRef"
            class="mt-16"
            :model="formData"
            :rules="rules"
            :key="formKey"
            @keyup.enter="handleSubmit"
          >
            <ElFormItem prop="username">
              <ElInput
                v-model.trim="formData.username"
                clearable
                class="custom-height"
                :placeholder="$t('login.placeholder.username')"
              >
                <template #prefix>
                  <ArtSvgIcon icon="ri:user-3-fill" />
                </template>
              </ElInput>
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput
                v-model.trim="formData.password"
                class="custom-height mt-2"
                :placeholder="$t('login.placeholder.password')"
                type="password"
                autocomplete="off"
                show-password
              >
                <template #prefix>
                  <ArtSvgIcon icon="ri:lock-fill" />
                </template>
              </ElInput>
            </ElFormItem>

            <!-- 推拽验证 -->
            <div class="relative pb-5 mt-6">
              <div
                class="relative z-[2] overflow-hidden select-none rounded-lg border border-transparent tad-300"
                :class="{ '!border-[#FF4E4F]': !isPassing && isClickPass }"
              >
                <ArtDragVerify
                  ref="dragVerify"
                  v-model:value="isPassing"
                  :text="$t('login.sliderText')"
                  textColor="var(--art-gray-700)"
                  :successText="$t('login.sliderSuccessText')"
                  :progressBarBg="getCssVar('--el-color-primary')"
                  :background="isDark ? '#26272F' : '#F1F1F4'"
                  handlerBg="var(--default-box-color)"
                />
              </div>
              <p
                class="absolute top-0 z-[1] px-px mt-2 text-xs text-[#f56c6c] tad-300"
                :class="{ 'translate-y-10': !isPassing && isClickPass }"
              >
                {{ $t('login.placeholder.slider') }}
              </p>
            </div>

            <div class="flex-cb mt-2 text-sm">
              <ElCheckbox v-model="formData.rememberPassword">
                {{ $t('login.rememberPwd') }}
              </ElCheckbox>
            </div>

            <div style="margin-top: 30px">
              <ElButton
                class="w-full custom-height"
                type="primary"
                @click="handleSubmit"
                :loading="loading"
                auto-insert-space
                v-ripple
              >
                {{ $t('login.btnText') }}
              </ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useUserStore } from '@/store/modules/user'
  import { getCssVar } from '@/utils/ui'
  import { useI18n } from 'vue-i18n'
  import { HttpError } from '@/utils/http/error'
  import { fetchLogin } from '@/api/auth'
  import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
  import { useSettingStore } from '@/store/modules/setting'
  import { fetchPublicKeyGet } from '@/api/basic'
  import { JSEncrypt } from 'jsencrypt'

  defineOptions({ name: 'Login' })

  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)
  const { t, locale } = useI18n()
  const formKey = ref(0)

  // 监听语言切换，重置表单
  watch(locale, () => {
    formKey.value++
  })

  onMounted(() => {
    getPublicKey()
  })

  export interface Account {
    label: string
    userName: string
    password: string
    roles: string[]
  }

  const dragVerify = ref()

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()
  const isPassing = ref(false)
  const isClickPass = ref(false)
  const publicKey = ref('')

  const systemName = AppConfig.systemInfo.name
  const formRef = ref<FormInstance>()

  const formData = reactive({
    username: '',
    password: '',
    rememberPassword: true
  })

  const rules = computed<FormRules>(() => ({
    username: [{ required: true, message: t('login.placeholder.username'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.placeholder.password'), trigger: 'blur' }]
  }))

  const loading = ref(false)

  const getPublicKey = () => {
    fetchPublicKeyGet().then((res) => {
      publicKey.value = res
    })
  }

  // 登录
  const handleSubmit = async () => {
    formRef.value?.validate(async (valid) => {
      if (valid) {
        try {
          loading.value = true
          if (!publicKey.value) {
            await getPublicKey()
          }
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(publicKey.value)
          const { accessToken, refreshToken, expiresAt } = await fetchLogin({
            username: formData.username,
            password: encrypt.encrypt(formData.password)
          })
          if (!accessToken) {
            throw new Error('Login failed - no token received')
          }

          // 存储 token 和登录状态
          userStore.setToken(accessToken, refreshToken, expiresAt)
          userStore.setLoginStatus(true)

          // 登录成功处理
          showLoginSuccessNotice()

          // 获取 redirect 参数，如果存在则跳转到指定页面，否则跳转到首页
          const redirect = route.query.redirect as string
          router.push(redirect || '/')
        } catch (error) {
          // 处理 HttpError
          if (error instanceof HttpError) {
            // console.log(error.code)
          } else {
            // 处理非 HttpError
            // ElMessage.error('登录失败，请稍后重试')
            console.error('[Login] Unexpected error:', error)
          }
        } finally {
          loading.value = false
          resetDragVerify()
        }
      }
    })
  }

  // 重置拖拽验证
  const resetDragVerify = () => {
    dragVerify.value.reset()
  }

  // 登录成功提示
  const showLoginSuccessNotice = () => {
    setTimeout(() => {
      ElNotification({
        title: t('login.success.title'),
        type: 'success',
        duration: 2500,
        zIndex: 10000,
        message: `${t('login.success.message')}, ${systemName}!`
      })
    }, 1000)
  }
</script>

<style scoped>
  @import './style.css';
</style>

<style lang="scss" scoped>
  :deep(.el-select__wrapper) {
    height: 40px !important;
  }
</style>
