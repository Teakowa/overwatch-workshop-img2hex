<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { availableLocales } from '@/i18n'

const { locale } = useI18n()

const currentLocale = computed(() => availableLocales.find(l => l.code === locale.value))
const nextLocale = computed(() => availableLocales.find(l => l.code !== locale.value))

const toggleLanguage = () => {
  if (nextLocale.value) {
    locale.value = nextLocale.value.code
  }
}
</script>

<template>
  <button
    type="button"
    @click="toggleLanguage"
    class="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors duration-200"
  >
    <svg 
      class="h-5 w-5 text-gray-500"
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
      />
    </svg>
    <span>{{ currentLocale?.name }}</span>
    <svg
      class="h-5 w-5 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M8.537 14.813l-1.414-1.414L12.172 8.35l1.414 1.415-5.049 5.048z"
      />
      <path
        d="M13.586 14.813l-1.414-1.414 1.414-1.414 1.414 1.414-1.414 1.414z"
      />
    </svg>
    <span class="text-gray-400">{{ nextLocale?.name }}</span>
  </button>
</template> 