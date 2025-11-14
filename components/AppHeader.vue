<template>
  <header 
    ref="elementRef"
    :class="['header', { 'scrolled': isScrolled }, 'animate-on-scroll', 'fade-in', { 'visible': isVisible }]"
  >
    <nav class="header-nav">
      <div class="header-logo">
        <a href="#top">
        <NuxtImg src="/images/MLL - LOGO - WEB.png" alt="MLL Melbourne Legal Lawyers" class="logo-img" />
        </a>
      </div>
      <button 
        :class="['hamburger-button', { 'is-open': isMenuOpen }]" 
        type="button" 
        :aria-expanded="isMenuOpen"
        aria-controls="primary-navigation"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      <div :class="['header-right', { 'is-open': isMenuOpen }]">
        <div id="primary-navigation" class="header-links">
          <a href="#about" :class="['nav-link', { active: activeSection === 'about' }]" @click="closeMenu">ABOUT US</a>
          <a href="#services" :class="['nav-link', { active: activeSection === 'services' }]" @click="closeMenu">OUR SERVICES</a>
          <a href="#client-promise" :class="['nav-link', { active: activeSection === 'client-promise' }]" @click="closeMenu">CLIENT PROMISE</a>
        </div>
        <a href="tel:+61312345678" class="call-button" @click="closeMenu">
          <span class="call-text">CALL US</span>
          <div class="call-icon-wrapper">
            <NuxtImg src="/images/CALL ICON.png" alt="Call" class="call-icon" />
          </div>
          <span class="call-number">+61 3 1234 5678</span>
        </a>
      </div>
    </nav>
  </header>
  <div 
    v-if="isMenuOpen"
    class="mobile-nav-backdrop"
    role="presentation"
    @click="closeMenu"
  />
</template>

<script setup lang="ts">
const { isVisible, elementRef } = useAnimateOnScroll()

// @ts-ignore - Nuxt auto-imports
const activeSection = ref('')
// @ts-ignore - Nuxt auto-imports
const isScrolled = ref(false)
// @ts-ignore - Nuxt auto-imports
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  if (!isMenuOpen.value) return
  isMenuOpen.value = false
}

// @ts-ignore - Nuxt auto-imports
onMounted(() => {
  // Header should animate immediately on load, not on scroll
  isVisible.value = true
  
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }

  const handleResize = () => {
    if (window.innerWidth > 1024 && isMenuOpen.value) {
      isMenuOpen.value = false
    }
  }
  
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  handleScroll() // Check initial state
  handleResize()
  
  // @ts-ignore - Nuxt auto-imports
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
  })
})
</script>

