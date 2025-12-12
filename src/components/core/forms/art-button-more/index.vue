<!-- 更多按钮 -->
<template>
  <ElTooltip content="更多" placement="top">
    <ElDropdown v-if="hasAnyAuthItem">
      <ArtIconButton icon="ri:more-2-fill" class="!size-8 bg-g-200 dark:bg-g-300/45 text-sm" />
      <template #dropdown>
        <ElDropdownMenu>
          <template v-for="item in mergedList" :key="item.value">
            <ElDropdownItem
              v-if="!item.auth || hasAuth(item.auth)"
              :disabled="item.disabled"
              @click="handleClick(item)"
            >
              <div class="flex-c gap-2" :style="{ color: item.color }">
                <ArtSvgIcon v-if="item.icon" :icon="item.icon" />
                <span>{{ item.label }}</span>
              </div>
            </ElDropdownItem>
          </template>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </ElTooltip>
</template>

<script setup lang="ts">
  import { useAuth } from '@/hooks/core/useAuth'
  import type { ButtonMoreItem } from './art-button-more-item.vue'

  defineOptions({ name: 'ArtButtonMore' })

  const { hasAuth } = useAuth()

  // 获取默认插槽中的子组件
  const slots = useSlots()

  interface Props {
    /** 下拉项列表 */
    list?: ButtonMoreItem[]
    /** 整体权限控制 */
    auth?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    list: () => []
  })

  // 合并通过 list 属性传递的项目和通过插槽传递的项目
  const mergedList = computed(() => {
    // 如果有通过插槽传递的 ArtButtonMoreItem 组件，则优先使用插槽中的配置
    const slotItems = slots.default?.() || []
    const itemsFromSlot: ButtonMoreItem[] = []

    const processSlotItems = (items: any[]) => {
      items.forEach((item) => {
        // 检查是否是 ArtButtonMoreItem 组件
        if (item.type?.name === 'ArtButtonMoreItem' && item.props) {
          const slotItem = {
            value: item.props.value,
            label: item.props.label,
            disabled: item.props.disabled || false,
            auth: item.props.auth,
            icon: item.props.icon,
            color: item.props.color,
            iconColor: item.props.iconColor
          }

          // 如果有 click 监听器，保存它以便后续调用
          if (item.props.onClick) {
            slotItem['onClick'] = item.props.onClick
          }

          itemsFromSlot.push(slotItem)
        }

        // 处理有 children 的情况
        if (item.children) {
          if (Array.isArray(item.children)) {
            processSlotItems(item.children)
          } else if (typeof item.children === 'object') {
            // 处理 Fragment 或者有多个 children 的情况
            Object.values(item.children).forEach((child: any) => {
              if (Array.isArray(child)) {
                processSlotItems(child)
              } else if (child && typeof child === 'object') {
                if (child.type?.name === 'ArtButtonMoreItem' && child.props) {
                  const slotItem = {
                    value: child.props.value,
                    label: child.props.label,
                    disabled: child.props.disabled || false,
                    auth: child.props.auth,
                    icon: child.props.icon,
                    color: child.props.color,
                    iconColor: child.props.iconColor
                  }

                  // 如果有 click 监听器，保存它以便后续调用
                  if (child.props.onClick) {
                    slotItem['onClick'] = child.props.onClick
                  }

                  itemsFromSlot.push(slotItem)
                }
              }
            })
          }
        }
      })
    }

    processSlotItems(slotItems)

    // 如果插槽中有项目，则返回插槽中的项目，否则返回通过 list 属性传递的项目
    return itemsFromSlot.length > 0 ? itemsFromSlot : props.list
  })

  // 检查是否有任何有权限的 item
  const hasAnyAuthItem = computed(() => {
    return mergedList.value.some((item) => !item.auth || hasAuth(item.auth))
  })

  const emit = defineEmits<{
    (e: 'click', item: ButtonMoreItem): void
  }>()

  const handleClick = (item: ButtonMoreItem) => {
    // 触发通过插槽传递的点击事件（如果存在）
    if (item.onClick && typeof item.onClick === 'function') {
      item.onClick(new MouseEvent('click'))
    }

    // 触发组件本身的 click 事件
    emit('click', item)
  }
</script>
