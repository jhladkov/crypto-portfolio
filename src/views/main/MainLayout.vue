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

import { onBeforeMount, onBeforeUnmount, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MainLayout',
  setup() {
    const store = useStore();
    const statusModal = computed(
      () => Object.values(store.state.modal.modals).some((item) => item === true),
    );

    onBeforeMount(async () => {
      await store.dispatch('portfolio/connectToWebSocket');
    });

    onBeforeUnmount(async () => {
      await store.dispatch('portfolio/disconnectFromWebSocket');
    });
    return {
      statusModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
