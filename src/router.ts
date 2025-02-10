import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import ImageProcessor from './components/ImageProcessor.vue'
import About from './components/About.vue'

interface MetaType {
  title: {
    'zh-CN': string
    'en': string
  }
  description: {
    'zh-CN': string
    'en': string
  }
}

declare module 'vue-router' {
  interface RouteMeta extends MetaType {}
}

const routes: (RouteRecordRaw & { meta: MetaType })[] = [
  {
    path: '/',
    component: ImageProcessor,
    meta: {
      title: {
        'zh-CN': '守望先锋工坊图片转换工具 | Overwatch Workshop Image Converter',
        'en': 'Overwatch Workshop Image Converter | Transform Images for Workshop'
      },
      description: {
        'zh-CN': '一个简单易用的守望先锋工坊图片转换工具，可以将图片转换为工坊数组格式或 HEX 代码格式，方便在游戏中使用。',
        'en': 'A simple and easy-to-use Overwatch Workshop image converter tool that converts images into Workshop array format or HEX code format for in-game use.'
      }
    }
  },
  {
    path: '/about',
    component: About,
    meta: {
      title: {
        'zh-CN': '关于 | 守望先锋工坊图片转换工具',
        'en': 'About | Overwatch Workshop Image Converter'
      },
      description: {
        'zh-CN': '了解守望先锋工坊图片转换工具的使用方法和技术细节。',
        'en': 'Learn about the usage and technical details of the Overwatch Workshop Image Converter tool.'
      }
    }
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 动态更新页面标题和描述
router.beforeEach((to, _from, next) => {
  const locale = localStorage.getItem('locale') || 'zh-CN'
  
  if (to.meta && 'title' in to.meta) {
    const meta = to.meta as MetaType
    document.title = meta.title[locale as keyof typeof meta.title]
  }
  
  // 更新中文描述
  const metaDescription = document.querySelector('meta[name="description"]:not([lang])')
  if (metaDescription && to.meta && 'description' in to.meta) {
    const meta = to.meta as MetaType
    metaDescription.setAttribute('content', meta.description['zh-CN'])
  }
  
  // 更新英文描述
  const metaDescriptionEn = document.querySelector('meta[name="description"][lang="en"]')
  if (metaDescriptionEn && to.meta && 'description' in to.meta) {
    const meta = to.meta as MetaType
    metaDescriptionEn.setAttribute('content', meta.description['en'])
  }
  
  // 更新 Open Graph 和 Twitter 描述
  const ogDescription = document.querySelector('meta[property="og:description"]')
  const twitterDescription = document.querySelector('meta[name="twitter:description"]')
  if (ogDescription && twitterDescription && to.meta && 'description' in to.meta) {
    const meta = to.meta as MetaType
    const bilingualDesc = `${meta.description['zh-CN']} | ${meta.description['en']}`
    ogDescription.setAttribute('content', bilingualDesc)
    twitterDescription.setAttribute('content', bilingualDesc)
  }
  
  next()
}) 