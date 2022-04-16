<template>
  <div
    class="main-layout"
    :class="{hid: statusModal}"
  >
    <!--      <Header/>-->
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>

import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'MainLayout',
  setup() {
    const store = useStore();
    const statusModal = computed(
      () => Object.values(store.state.modal.modals).some((item) => item === true),
    );

    return {
      statusModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
