export default {
  header: {
    title: '守望先锋工坊图像工具',
    beta: '测试版',
    navigation: {
      imageTool: '图像工具',
      about: '关于',
    },
    github: '',
  },
  imageProcessor: {
    title: '图片转换',
    description: '将图片转换为 64x64 像素，并生成守望先锋工坊可用的颜色代码',
    upload: {
      title: '点击上传',
      description: '或拖拽图片到此处',
      supportedFormats: '支持所有常见图片格式',
    },
    preview: {
      title: '预览图片',
      pixelSize: '64x64 像素预览',
    },
    output: {
      title: '输出选项',
      formats: {
        array: '工坊数组格式',
        full: '完整规则格式',
        hex: 'HEX 代码格式',
      },
      result: '处理结果',
      copyCode: '复制代码',
      copied: '已复制！',
      processing: '正在处理图片...',
    },
  },
  about: {
    intro: {
      subtitle: '为守望先锋工坊转换图像',
      title: '简单、快速的图像处理工具',
      description: '专为守望先锋工坊设计的图像转换工具，让您能够在自定义游戏模式中添加视觉元素。',
    },
    features: [
      {
        name: '便捷的图像转换',
        description: '上传任意图片，自动转换为守望先锋工坊优化的 64x64 像素格式。',
      },
      {
        name: '多种输出格式',
        description: '支持生成多种格式的代码，包括工坊数组、完整规则和 HEX 代码格式。',
      },
      {
        name: '实时预览',
        description: '通过即时预览功能，查看图像在游戏中的效果。',
      },
    ],
    author: {
      role: '创作者 & 开发者',
    },
  },
  footer: {
    navigation: {
      about: '关于',
      issues: '问题反馈',
    },
    copyright: {
      prefix: 'Copyright',
      madeBy: 'Made with ❤️ by',
    },
  },
  privacy: {
    title: '隐私保护：',
    description: '所有图片处理均在本地完成，不会上传到任何服务器或第三方服务。'
  }
} 