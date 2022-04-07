<template>
  <div class="container">
    <price-section />
    <assets-section />
  </div>
</template>

<script>
import PriceSection from '@/views/main/portfolio/price-section/PriceSection.vue';
import AssetsSection from '@/views/main/portfolio/assets-section/AssetsSection.vue';

export default {
  name: 'Portfolio',
  components: { PriceSection, AssetsSection },
};
</script>
