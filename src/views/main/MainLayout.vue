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
              v-if="!userInfo"
              value="Auth"
              class-name="header__button"
              @click="googleAuth(handleResponse)"
            />
            <div
              v-if="userInfo"
              class="header__user user"
            >
              <div class="user__img">
                <img
                  :src="userInfo.picture"
                  alt=""
                >
              </div>
              <div class="user__info info">
                <!--                <div class="info__name">-->
                <!--                  {{ userInfo.name }}-->
                <!--                </div>-->
                <base-button
                  value="Exit"
                  class-name="exit"
                  @click="exitFromAccount"
                />
              </div>
            </div>
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
import { googleAuth } from '@/helpers/googleAuth';

export default {
  name: 'MainLayout',
  components: { BaseButton },
  setup() {
    const store = useStore();
    const router = useRouter();
    const statusModal = computed(
      () => Object.values(store.state.modal.modals).some((item) => item === true),
    );
    const userInfo = computed(() => store.getters['auth/getAccountInfo']);

    const handleResponse = async (res) => {
      const token = res.credential;
      localStorage.setItem('token', res.credential);
      await store.dispatch('auth/checkUser', token);

      await router.push('/');
    };
    const exitFromAccount = async () => {
      store.commit('portfolio/resetPortfolioStore');
      store.commit('auth/resetAccountInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('selectedPortfolio');
      await router.push({ name: 'PortfolioAuth' });
    };

    onBeforeMount(async () => {
      if (!localStorage.getItem('token')) {
        router.push({ name: 'PortfolioAuth' });
      } else {
        await store.dispatch('auth/checkUser', localStorage.getItem('token'));
      }
    });

    onBeforeUnmount(async () => {
      await store.dispatch('portfolio/disconnectFromWebSocket');
    });
    return {
      statusModal,
      userInfo,
      exitFromAccount,
      googleAuth,
      handleResponse,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
