import App from './App.vue'
import { createApp } from 'vue'
import { initStore } from './store'                 // Store
import { initRouter } from './router'               // Router
import language from './locales'                    // 国际化
import '@styles/core/tailwind.css'                  // tailwind
import '@styles/index.scss'                         // 样式
import '@utils/sys/console.ts'                      // 控制台输出内容
import '@utils/ui/iconify-loader'                   // 离线图标加载
import { setupGlobDirectives } from './directives'
import { setupErrorHandle } from './utils/sys/error-handle' 

document.addEventListener(
  'touchstart',
  function () {},
  { passive: false }
)

const app = createApp(App)
initStore(app)
initRouter(app)
setupGlobDirectives(app)
setupErrorHandle(app)

// 全局注册vue-tippy
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import VueTippy from 'vue-tippy'
app.use(VueTippy)

app.use(language)
app.mount('#app')