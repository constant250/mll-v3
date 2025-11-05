<template>
  <div class="service-card">
    <div class="service-card-background">
      <NuxtImg :src="image" alt="" class="service-bg-image" />
    </div>
    <div class="service-card-content">
      <div class="service-text-group">
        <h3 class="service-title">{{ title }}</h3>
        <p class="service-description">{{ description }}</p>
      </div>
      <a href="#contact" class="service-cta">{{ cta }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  image: string
  cta: string
}

// @ts-ignore - Nuxt auto-imports
defineProps<Props>()
</script>

