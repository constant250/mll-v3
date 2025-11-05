<template>
  <section class="hero-section">
    <div 
      ref="imageRef"
      :class="['hero-background', 'animate-on-scroll', 'fade-in', { 'visible': isImageVisible }]"
    >
      <NuxtImg src="/images/HEADER-IMAGE.jpg" alt="Professional lawyer" class="hero-image" />
    </div>
    <div 
      ref="elementRef"
      :class="['hero-content', 'animate-on-scroll', 'fade-in-up', { 'visible': isVisible }]"
    >
      <h1 class="hero-title">
        LEGAL SOLUTIONS THAT <br>PUT <span class="highlight">PEOPLE FIRST.</span>
      </h1>
      <a href="#contact" class="cta-button">BOOK A CONSULTATION TODAY!</a>
    </div>
  </section>
</template>

<script setup lang="ts">
const { isVisible, elementRef } = useAnimateOnScroll()
const { isVisible: isImageVisible, elementRef: imageRef } = useAnimateOnScroll()

// Hero section should animate immediately on page load
onMounted(() => {
  if (elementRef.value && imageRef.value) {
    // Use setTimeout to ensure smooth animation after render
    setTimeout(() => {
      isImageVisible.value = true
      isVisible.value = true
    }, 100)
  }
})
</script>

