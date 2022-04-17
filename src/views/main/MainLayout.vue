<template>
  <div class="main-layout">
    <!--      <Header/>-->
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>

import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MainLayout',
  setup() {
    const store = useStore();

    onBeforeMount(async () => {
      await store.dispatch('portfolio/connectToWebSocket');
    });

    onBeforeUnmount(async () => {
      await store.dispatch('portfolio/disconnectFromWebSocket');
    });
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
