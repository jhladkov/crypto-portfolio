<template>
  <div
    class="main-layout"
    :class="{hid: statusModal}"
  >
    <!--      <Header/>-->
    <header class="header">
      <div class="container">
        <div class="header__wrapper">
          <div class="header__logo">
            <img
              src="@/assets/images/logo.jpg"
              alt=""
            >
          </div>
          <div class="header__inner">
            <base-button
              value="Auth"
              class-name="header__button"
            />
          </div>
        </div>
      </div>
    </header>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>

import { onBeforeMount, onBeforeUnmount, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/base-button/BaseButton.vue';
import jwtDecode from 'jwt-decode';

export default {
  name: 'MainLayout',
  components: { BaseButton },
  setup() {
    const store = useStore();
    const router = useRouter();
    const statusModal = computed(
      () => Object.values(store.state.modal.modals).some((item) => item === true),
    );

    onBeforeMount(async () => {
      if (!localStorage.getItem('token')) {
        router.push({ name: 'PortfolioAuth' });
      } else {
        const decode = jwtDecode(localStorage.getItem('token'));
        await store.dispatch('portfolio/googleAuth', {
          name: decode.name,
          email: decode.email,
        });
        await store.dispatch('portfolio/connectToWebSocket');
      }
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
