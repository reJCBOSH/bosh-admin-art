<script setup lang="ts">
  import { debounce, formatBytes } from '@pureadmin/utils'
  import 'cropperjs'
  import {
    type CropperImage,
    type CropperHandle,
    type CropperCanvas,
    type CropperSelection
  } from 'cropperjs'

  interface Props {
    imageSrc?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    imageSrc: 'https://fengyuanchen.github.io/cropperjs/v2/picture.jpg'
  })

  defineOptions({
    name: 'ArtCropper'
  })

  const cropperCanvasRef = ref()
  const cropperImageRef = ref()
  const cropperSelectionRef = ref()
  const cropperedImg = ref()
  const cropperedInfo = ref()

  const debounceRealTimeCroppered = debounce(realTimeCroppered, 100)

  onMounted(() => {})

  onUnmounted(() => {})

  function handleReset() {
    const cropperImage = cropperImageRef.value as CropperImage
    cropperImage.$resetTransform()
    cropperImage.$center('contain')
    const cropperSelection = cropperSelectionRef.value as CropperSelection
    cropperSelection.$reset()
  }

  function handleShape(shape: string) {
    const cropperSelection = cropperSelectionRef.value as CropperSelection
    switch (shape) {
      case 'rect':
        cropperSelection.aspectRatio = 4 / 3
        break
      case 'square':
        cropperSelection.aspectRatio = 1
        break
      case 'circle':
        cropperSelection.$polygon()
        break
    }
    cropperSelection.initialCoverage = 0.5
  }

  function handleMove(direction: string) {
    const cropperImage = cropperImageRef.value as CropperImage
    let moveX = 0
    let moveY = 0
    switch (direction) {
      case 'up':
        moveY = -1
        break
      case 'down':
        moveY = 1
        break
      case 'left':
        moveX = -1
        break
      case 'right':
        moveX = 1
        break
    }
    cropperImage.$move(moveX, moveY)
  }

  function handleScale(scaleX: number, scaleY: number) {
    const cropperImage = cropperImageRef.value as CropperImage
    cropperImage.$scale(scaleX, scaleY)
  }

  function handleRotate(angle: string) {
    const cropperImage = cropperImageRef.value as CropperImage
    cropperImage.$rotate(angle)
  }

  function handleZoom(scale: number) {
    const cropperImage = cropperImageRef.value as CropperImage
    cropperImage.$zoom(scale)
  }

  function handleToggleAction(event: any) {
    const cropperHandle = event.target as CropperHandle
    cropperHandle.action = cropperHandle.action === 'move' ? 'select' : 'move'
  }

  function realTimeCroppered() {
    const cropperSelection = cropperSelectionRef.value as CropperSelection
    cropperSelection.$toCanvas().then((res) => {
      const canvas = res as HTMLCanvasElement
      // 添加try-catch处理tainted canvas错误
      try {
        canvas.toBlob((blob) => {
          if (!blob) return
          const fileReader = new FileReader()
          fileReader.onloadend = (e) => {
            if (!e.target?.result || !blob) return
            cropperedImg.value = e.target.result
            cropperedInfo.value = {
              size: blob.size,
              width: cropperSelection.width,
              height: cropperSelection.height
            }
          }
          fileReader.readAsDataURL(blob)
        })
      } catch (error) {
        console.error('Canvas tainted, unable to export image:', error)
        // 如果出现tainted错误，给出提示
        ElMessage.error('无法导出跨域图片，请使用同源图片或配置CORS')
      }
    })
  }
</script>

<template>
  <div class="art-card-sm flex items-center p-3 gap-2">
    <div class="art-card-sm p-2 grid grid-cols-2 gap-1">
      <ArtIconButton
        icon="ri:upload-2-line"
        v-tippy="{ content: '上传', placement: 'left-start' }"
      />
      <ArtIconButton
        icon="ri:download-2-line"
        v-tippy="{ content: '下载', placement: 'right-start' }"
      />
      <ArtIconButton
        icon="ri:refresh-line"
        v-tippy="{ content: '重置', placement: 'left-start' }"
        @click="handleReset"
      />
      <ArtIconButton
        icon="ri:rectangle-line"
        v-tippy="{ content: '矩形', placement: 'right-start' }"
        @click="handleShape('rect')"
      />
      <ArtIconButton
        icon="ri:square-line"
        v-tippy="{ content: '方形', placement: 'left-start' }"
        @click="handleShape('square')"
      />
      <ArtIconButton
        icon="ri:circle-line"
        v-tippy="{ content: '圆形', placement: 'right-start' }"
        @click="handleShape('circle')"
      />
      <ArtIconButton
        icon="ri:arrow-up-line"
        v-tippy="{ content: '上移', placement: 'left-start' }"
        @click="handleMove('up')"
      />
      <ArtIconButton
        icon="ri:arrow-down-line"
        v-tippy="{ content: '下移', placement: 'right-start' }"
        @click="handleMove('down')"
      />
      <ArtIconButton
        icon="ri:arrow-left-line"
        v-tippy="{ content: '左移', placement: 'left-start' }"
        @click="handleMove('left')"
      />
      <ArtIconButton
        icon="ri:arrow-right-line"
        v-tippy="{ content: '右移', placement: 'right-start' }"
        @click="handleMove('right')"
      />
      <ArtIconButton
        icon="ri:arrow-left-right-line"
        v-tippy="{ content: '水平翻转', placement: 'left-start' }"
        @click="handleScale(-1, 1)"
      />
      <ArtIconButton
        icon="ri:arrow-up-down-line"
        v-tippy="{ content: '垂直翻转', placement: 'right-start' }"
        @click="handleScale(1, -1)"
      />
      <ArtIconButton
        icon="ri:anticlockwise-2-line"
        v-tippy="{ content: '逆时针旋转', placement: 'left-start' }"
        @click="handleRotate('-45deg')"
      />
      <ArtIconButton
        icon="ri:clockwise-2-line"
        v-tippy="{ content: '顺时针旋转', placement: 'right-start' }"
        @click="handleRotate('45deg')"
      />
      <ArtIconButton
        icon="ri:zoom-in-line"
        v-tippy="{ content: '放大', placement: 'left-start' }"
        @click="handleZoom(0.1)"
      />
      <ArtIconButton
        icon="ri:zoom-out-line"
        v-tippy="{ content: '缩小', placement: 'right-start' }"
        @click="handleZoom(-0.1)"
      />
    </div>
    <div class="cropper-container">
      <cropper-canvas ref="cropperCanvasRef" background>
        <cropper-image
          ref="cropperImageRef"
          initial-center-size="contain"
          :src="props.imageSrc"
          alt="Picture"
          rotatable
          scalable
          skewable
          translatable
          crossorigin="anonymous"
          @transform="debounceRealTimeCroppered"
        ></cropper-image>
        <cropper-shade hidden></cropper-shade>
        <cropper-handle action="select" plain @dblclick="handleToggleAction"></cropper-handle>
        <cropper-selection
          ref="cropperSelectionRef"
          id="cropperSelection"
          initial-aspect-ratio="1.5"
          initial-coverage="0.5"
          movable
          resizable
          @change="debounceRealTimeCroppered"
        >
          <cropper-grid covered theme-color="var(--color-theme)"></cropper-grid>
          <cropper-crosshair centered theme-color="var(--color-theme)"></cropper-crosshair>
          <cropper-handle
            action="move"
            theme-color="rgba(255, 255, 255, 0.35)"
            @dblclick="handleToggleAction"
          ></cropper-handle>
          <cropper-handle action="n-resize" theme-color="var(--color-theme)"></cropper-handle>
          <cropper-handle action="e-resize" theme-color="var(--color-theme)"></cropper-handle>
          <cropper-handle action="s-resize" theme-color="var(--color-theme)"></cropper-handle>
          <cropper-handle action="w-resize" theme-color="var(--color-theme)"></cropper-handle>
          <cropper-handle action="ne-resize" theme-color="var(--color-theme)"></cropper-handle>
          <cropper-handle action="nw-resize" theme-color="var(--color-theme)"></cropper-handle>
          <cropper-handle action="se-resize" theme-color="var(--color-theme)"></cropper-handle>
          <cropper-handle action="sw-resize" theme-color="var(--color-theme)"></cropper-handle>
        </cropper-selection>
      </cropper-canvas>
    </div>
    <div
      class="art-card-sm h-[300px] flex-1 flex flex-col items-center justify-between text-center p-2"
    >
      <div class="art-card-sm">
        <ElImage
          style="width: 200px; height: 200px"
          v-if="cropperedImg"
          :src="cropperedImg"
          :preview-src-list="Array.of(cropperedImg)"
          fit="contain"
        />
      </div>
      <div v-if="cropperedInfo" class="mt-2 text-sm">
        <p>
          图像大小：{{ parseInt(cropperedInfo.width) }} × {{ parseInt(cropperedInfo.height) }}像素
        </p>
        <p>文件大小：{{ formatBytes(cropperedInfo.size) }}（{{ cropperedInfo.size }} 字节）</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .cropper-container {
    width: 400px;
    height: 300px;

    :deep(cropper-canvas) {
      height: 300px;
    }
  }
</style>
