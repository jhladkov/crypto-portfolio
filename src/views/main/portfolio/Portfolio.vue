<template>
  <div>
    <h1>Portfolio {{ count }}</h1>
    <button @click="testHandler">
      test
    </button>
    <assets-section />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import AssetsSection from '@/views/main/portfolio/assets-section/AssetsSection.vue';

export default {
  name: 'Portfolio',
  components: { AssetsSection },
  setup() {
    const store = useStore();
    return {
      count: computed(() => store.getters['portfolio/getTest']),
      testHandler: () => store.commit('portfolio/update', 144354),
    };
  },
};
</script>
