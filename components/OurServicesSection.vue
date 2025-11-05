<template>
  <section id="services" class="services-section">
    <h2 class="section-title">Our Services</h2>
    <div class="services-grid">
      <ServiceCard
        title="Family Law"
        description="From parenting plans to property settlements, we handle sensitive family matters with empathy and skill."
        image="/images/S-1.jpg"
        cta="Discuss your matter →"
      />
      <ServiceCard
        title="Commercial Law"
        description="Supporting small businesses with contracts, disputes, leases, and structuring."
        image="/images/S-2.jpg"
        cta="Get guidance →"
      />
      <ServiceCard
        title="Immigration"
        description="Migration support for individuals, families, and businesses – we simplify the visa process."
        image="/images/S-3.jpg"
        cta="Talk to an attorney →"
      />
      <ServiceCard
        title="Wills & Estate"
        description="Protecting your future through smart estate planning and probate assistance."
        image="/images/S-4.jpg"
        cta="Plan your future →"
      />
    </div>
  </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
  .services-grid {
    padding: 0 3rem;
  }
</style>

