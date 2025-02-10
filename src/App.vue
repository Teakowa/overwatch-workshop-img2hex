<script setup lang="ts">
import { Analytics } from "@vercel/analytics/vue"
import { SpeedInsights } from "@vercel/speed-insights/vue"
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <router-view />
        </div>
      </div>
    </main>

    <!-- 隐私声明区域 -->
    <div class="bg-gray-50 py-8 max-md:py-6">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center space-x-3 text-gray-600">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p class="text-sm">
            <span class="font-medium">{{ t('privacy.title') }}</span>
            {{ t('privacy.description') }}
          </p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
  <Analytics />
  <SpeedInsights />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
