<template>
  <header :class="['header', { 'scrolled': isScrolled }]">
    <nav class="header-nav">
      <div class="header-logo">
        <a href="#top">
        <NuxtImg src="/images/MLL - LOGO - WEB.png" alt="MLL Melbourne Legal Lawyers" class="logo-img" />
        </a>
      </div>
      <div class="header-right">
        <div class="header-links">
          <a href="#about" :class="['nav-link', { active: activeSection === 'about' }]">ABOUT US</a>
          <a href="#services" :class="['nav-link', { active: activeSection === 'services' }]">OUR SERVICES</a>
          <a href="#client-promise" :class="['nav-link', { active: activeSection === 'client-promise' }]">CLIENT PROMISE</a>
        </div>
        <a href="tel:+61312345678" class="call-button">
          <span class="call-text">CALL US</span>
          <div class="call-icon-wrapper">
            <NuxtImg src="/images/CALL ICON.png" alt="Call" class="call-icon" />
          </div>
          <span class="call-number">+61 3 1234 5678</span>
        </a>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// @ts-ignore - Nuxt auto-imports
const activeSection = ref('')
// @ts-ignore - Nuxt auto-imports
const isScrolled = ref(false)

// @ts-ignore - Nuxt auto-imports
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }
  
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial state
  
  // @ts-ignore - Nuxt auto-imports
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

