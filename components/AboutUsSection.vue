<template>
  <section id="about" class="about-section">
    <div 
      ref="elementRef"
      :class="['about-container', 'animate-on-scroll', 'fade-in-up', { 'visible': isVisible }]"
    >
      <div class="about-content">
        <NuxtImg src="/images/MLL - LOGO - WEB.png" alt="MLL Melbourne Legal Lawyers" class="about-logo" />
        <p class="about-text">
          <b>Melbourne Legal Lawyers</b> is a locally based law firm committed to supporting individuals, families, and businesses through every stage of life's legal journey. Our approach is client-first – combining legal precision with practical understanding.
        </p>
        <p class="about-text">
          We work closely with our clients to provide timely, clear, and cost-effective legal solutions.
        </p>
      </div>
      <div class="about-image">
        <NuxtImg src="/images/ABOUT-US-IMAGE.jpg" alt="Our team" class="team-image" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { isVisible, elementRef } = useAnimateOnScroll()
</script>

