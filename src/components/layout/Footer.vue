<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const navigation = {
  main: [
    { name: t('footer.navigation.about'), href: '#about' },
    { name: t('footer.navigation.issues'), href: 'https://github.com/teakowa/overwatch-workshop-img2hex/issues' },
  ],
}
</script>

<template>
  <footer class="bg-white">
    <div class="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 py-6 sm:py-8 lg:px-8 lg:py-12">
      <nav
        class="flex flex-col sm:flex-row justify-center sm:space-x-12 space-y-4 sm:space-y-0"
        aria-label="Footer"
      >
        <div
          v-for="item in navigation.main"
          :key="item.name"
          class="text-center sm:text-left"
        >
          <a
            :href="item.href"
            class="text-sm leading-6 text-gray-600 hover:text-gray-900"
            >{{ item.name }}</a
          >
        </div>
      </nav>
      <p class="mt-8 sm:mt-10 text-center text-xs leading-5 text-gray-500 space-y-2 sm:space-y-0">
        <span class="block sm:inline">{{ t('footer.copyright.prefix') }}</span>
        <span class="block sm:inline">&copy; {{ new Date().getFullYear() }} {{ t('header.title') }}. </span>
        <span class="block sm:inline">{{ t('footer.copyright.madeBy') }}</span>
        <a
          href="https://github.com/teakowa"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-900"
        >Teakowa</a>
      </p>
    </div>
  </footer>
</template> 