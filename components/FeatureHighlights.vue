<template>
  <section 
    ref="elementRef"
    :class="['feature-highlights', 'animate-stagger', { 'visible': isVisible }]"
  >
    <div class="feature-box">
      <NuxtImg src="/images/ICON-1.png" alt="Fast consultation" class="feature-icon" />
      <p>Fast legal consultation <br>and response times</p>
    </div>
    <div class="feature-box">
      <NuxtImg src="/images/ICON-2.png" alt="Australian compliance" class="feature-icon" />
      <p>Compliant with Australian legal requirements</p>
    </div>
    <div class="feature-box">
      <NuxtImg src="/images/ICON-3.png" alt="Experienced team" class="feature-icon" />
      <p>Experienced team dedicated to client success</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { isVisible, elementRef } = useAnimateOnScroll()
</script>

