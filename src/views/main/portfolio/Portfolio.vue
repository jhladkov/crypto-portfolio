<template>
  <div>
    <h1>Portfolio {{ count }}</h1>
    <button @click="testHandler">
      test
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Portfolio',
  setup() {
    const store = useStore();
    return {
      count: computed(() => store.getters['portfolio/getTest']),
      testHandler: () => store.commit('portfolio/update', 144354),
    };
  },
};
</script>
