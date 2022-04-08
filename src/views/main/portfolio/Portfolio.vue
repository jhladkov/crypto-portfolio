<template>
  <div class="container">
    <price-section />
    <chart />
    <assets-section />
  </div>
</template>

<script>
import PriceSection from '@/views/main/portfolio/price-section/PriceSection.vue';
import AssetsSection from '@/views/main/portfolio/assets-section/AssetsSection.vue';
import Chart from '@/views/main/portfolio/chart-section/Chart.vue';

export default {
  name: 'Portfolio',
  components: { Chart, PriceSection, AssetsSection },
};
</script>
