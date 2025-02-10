<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'

const { t } = useI18n()

interface PixelData {
  hex: string
  x: number
  y: number
}

type OutputFormat = 'array' | 'hex' | 'full'

const imageFile: Ref<File | null> = ref(null)
const processedPixels: Ref<PixelData[]> = ref([])
const isProcessing = ref(false)
const previewUrl = ref('')
const selectedFormat = ref<OutputFormat>('array')
const formattedOutput = ref('')
const isCopied = ref(false)

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    imageFile.value = input.files[0]
    previewUrl.value = URL.createObjectURL(input.files[0])
    processImage()
  }
}

const processImage = async () => {
  if (!imageFile.value) return
  
  isProcessing.value = true
  try {
    const img = new Image()
    img.src = previewUrl.value
    
    await new Promise((resolve) => {
      img.onload = resolve
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法获取 canvas context')

    canvas.width = 64
    canvas.height = 64
    ctx.drawImage(img, 0, 0, 64, 64)

    const imageData = ctx.getImageData(0, 0, 64, 64)
    const pixels: PixelData[] = []

    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const i = (y * 64 + x) * 4
        const r = imageData.data[i]
        const g = imageData.data[i + 1]
        const b = imageData.data[i + 2]
        const a = imageData.data[i + 3]
        
        const hex = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`
        
        pixels.push({ hex, x, y })
      }
    }

    processedPixels.value = pixels
    formatOutput()
  } catch (error) {
    console.error('图片处理失败:', error)
  } finally {
    isProcessing.value = false
  }
}

const formatOutput = () => {
  if (!processedPixels.value.length) return

  switch (selectedFormat.value) {
    case 'array':
      formatAsArray()
      break
    case 'hex':
      formatAsHex()
      break
    case 'full':
      formatAsFull()
      break
  }
}

const formatAsArray = () => {
  const rows: string[] = []
  for (let y = 0; y < 64; y++) {
    const row = processedPixels.value
      .filter(p => p.y === y)
      .map(p => p.hex)
      .join('')
    rows.push(`\t\t\t自定义字符串("${row}")`)
  }
  formattedOutput.value = `规则("图像 储存数据")
{
\t事件
\t{
\t\t持续 - 全局;
\t}

\t动作
\t{
\t\t全局.raw = 数组(
${rows.join(',\n')}
\t\t);
\t}
}`
}

const formatAsHex = () => {
  const pixels = processedPixels.value.map(p => p.hex)
  const rows: string[] = []
  for (let i = 0; i < pixels.length; i += 64) {
    rows.push(pixels.slice(i, i + 64).join(''))
  }
  formattedOutput.value = rows.join('\n')
}

const formatAsFull = () => {
  const rows: string[] = []
  for (let y = 0; y < 64; y++) {
    const row = processedPixels.value
      .filter(p => p.y === y)
      .map(p => p.hex)
      .join('')
    rows.push(`\t\t\t自定义字符串("${row}")`)
  }
  formattedOutput.value = `设置
{
\t主程序
\t{
\t\t模式名称: "图片显示"
\t}
}

变量
{
\t全局:
\t\t0: GR_screen
\t\t1: GR_pos
\t\t2: GR_temp
\t\t3: raw
\t\t4: GR_idx1
\t\t5: GR_idx2
\t\t6: GR_row
\t\t7: GR_col
\t\t8: GR_invisiable
}

子程序
{
\t0: GR_generate
\t1: GR_load
}

规则("图像 储存数据")
{
\t事件
\t{
\t\t持续 - 全局;
\t}

\t动作
\t{
\t\t全局.raw = 数组(
${rows.join(',\n')}
\t\t);
\t}
}

规则("图像 加载数据")
{
\t事件
\t{
\t\t子程序;
\t\tGR_load;
\t}

\t动作
\t{
\t\t全局.GR_row = 0;
\t\t全局.GR_col = 0;
\t\t全局.GR_screen = 空数组;
\t\tFor 全局变量(GR_idx1, 0, 64, 1);
\t\t\t全局.GR_temp = 自定义字符串("");
\t\t\tFor 全局变量(GR_idx2, 0, 64, 1);
\t\t\t\tIf(全局.GR_col == 16);
\t\t\t\t\t全局.GR_col = 0;
\t\t\t\t\t全局.GR_row += 1;
\t\t\t\tEnd;
\t\t\t\t全局.GR_temp = 自定义字符串("{0}{1}fg{2}>█", 全局.GR_temp, 全局.A, 单次赋值(截取字符串(全局.raw[全局.GR_row], 8 * 全局.GR_col, 8)));
\t\t\t\t全局.GR_col += 1;
\t\t\tEnd;
\t\t\t等待(0.250, 无视条件);
\t\t\t全局.GR_screen[全局.GR_idx1] = 单次赋值(全局.GR_temp);
\t\tEnd;
\t}
}

规则("图像 创建")
{
\t事件
\t{
\t\t子程序;
\t\tGR_generate;
\t}

\t动作
\t{
\t\tFor 全局变量(GR_idx1, 0, 64, 1);
\t\t\t创建地图文本(本地玩家.V ? 本地玩家 : 空, 全局.GR_screen[全局.GR_idx1], 本地玩家 + 1414 * 面朝方向(本地玩家) - 13 * (单次赋值(全局.GR_idx1) - 32) * 归一化(矢量积(归一化(矢量积(面朝方向(本地玩家), 上)), 面朝方向(本地玩家))), 0.500, 不要截取, 可见和位置, 颜色(白色), 默认可见度);
\t\t\t等待(0.200, 无视条件);
\t\tEnd;
\t}
}

规则("初始化")
{
\t事件
\t{
\t\t持续 - 全局;
\t}

\t动作
\t{
\t\t等待(5, 无视条件);
\t\t调用子程序(GR_load);
\t\t调用子程序(GR_generate);
\t\t全局.GR_invisiable = 真;
\t}
}`
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedOutput.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制')
  }
}

const handleFormatChange = (event: Event) => {
  const select = event.target as HTMLSelectElement
  selectedFormat.value = select.value as OutputFormat
  formatOutput()
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- 标题区域 -->
    <div class="px-8 py-6 border-b border-gray-200 max-md:px-4 max-md:py-4">
      <h2 class="text-xl font-semibold text-gray-900 max-md:text-lg">{{ t('imageProcessor.title') }}</h2>
      <p class="mt-2 text-sm text-gray-600">
        {{ t('imageProcessor.description') }}
      </p>
    </div>

    <div class="p-8 space-y-8 max-md:p-4 max-md:space-y-6">
      <!-- 图片上传区域 -->
      <div class="w-full space-y-4">
        <label
          for="image-upload"
          class="relative block w-full h-64 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer max-md:h-48 max-md:p-6"
        >
          <svg
            class="mx-auto h-12 w-12 text-gray-400 max-md:h-10 max-md:w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div class="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
            <span class="font-semibold">{{ t('imageProcessor.upload.title') }}</span>
            <span class="pl-1">{{ t('imageProcessor.upload.description') }}</span>
          </div>
          <p class="text-xs leading-5 text-gray-600 mt-1">
            {{ t('imageProcessor.upload.supportedFormats') }}
          </p>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            class="sr-only"
            @change="handleFileSelect"
          />
        </label>
      </div>

      <!-- 预览和处理结果区域 -->
      <div class="grid grid-cols-3 gap-8 max-lg:grid-cols-1 max-lg:gap-6">
        <!-- 预览区域 -->
        <div v-if="previewUrl" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 max-md:text-base">{{ t('imageProcessor.preview.title') }}</h3>
          <div class="overflow-hidden rounded-lg bg-gray-50 p-6 max-md:p-4">
            <div class="relative w-full h-48">
              <img
                :src="previewUrl"
                alt="Preview"
                class="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div class="mt-4 text-center text-sm text-gray-500 max-md:text-xs max-md:mt-2">
              {{ t('imageProcessor.preview.pixelSize') }}
            </div>
          </div>
        </div>

        <!-- 输出选项和结果区域 -->
        <div v-if="processedPixels.length" class="col-span-2 space-y-6 max-md:space-y-4">
          <h3 class="text-lg font-medium text-gray-900 max-md:text-base">{{ t('imageProcessor.output.title') }}</h3>
          
          <!-- 格式选择 -->
          <div class="space-y-4">
            <select
              :value="selectedFormat"
              @change="handleFormatChange"
              class="block w-full rounded-md border-0 py-2.5 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm max-md:py-1.5"
            >
              <option value="array">{{ t('imageProcessor.output.formats.array') }}</option>
              <option value="full">{{ t('imageProcessor.output.formats.full') }}</option>
              <option value="hex">{{ t('imageProcessor.output.formats.hex') }}</option>
            </select>
          </div>

          <!-- 输出结果 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between max-md:flex-col max-md:items-stretch max-md:gap-4">
              <h4 class="text-lg font-medium text-gray-900 max-md:text-base">{{ t('imageProcessor.output.result') }}</h4>
              <button
                @click="copyToClipboard"
                class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 max-md:w-full max-md:py-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {{ t('imageProcessor.output.copyCode') }}
              </button>
            </div>
            <div class="relative">
              <pre class="block w-full overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm text-gray-100 max-h-[600px] max-md:p-4 max-md:text-xs max-md:max-h-[400px]"><code class="font-mono">{{ formattedOutput }}</code></pre>
              <div
                v-if="isCopied"
                class="absolute right-4 top-4 rounded bg-green-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm max-md:text-xs max-md:px-2 max-md:py-1"
              >
                {{ t('imageProcessor.output.copied') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载提示 -->
    <div
      v-if="isProcessing"
      class="border-t border-gray-200 bg-gray-50 px-8 py-4 max-md:px-4"
    >
      <p class="text-sm text-gray-600">{{ t('imageProcessor.output.processing') }}</p>
    </div>
  </div>
</template>

<style scoped>
.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}

.aspect-h-1 {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

pre {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

pre::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

pre::-webkit-scrollbar-track {
  background: transparent;
}

pre::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

pre::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  line-height: 1.5;
}
</style> 