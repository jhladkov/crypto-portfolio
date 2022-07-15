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
import jwtDecode from 'jwt-decode';
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
    const userInfo = computed(() => store.getters['portfolio/getAccountInfo']);

    const handleResponse = async (res) => {
      const token = res.credential;
      const decodedToken = jwtDecode(token);
      localStorage.setItem('token', res.credential);
      const userInfo = {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
      };
      await store.dispatch('portfolio/googleAuth', userInfo);

      router.push('/');
    };
    const exitFromAccount = () => {
      store.commit('portfolio/setAccountInfo', undefined);
      localStorage.removeItem('token');
      router.push({ name: 'PortfolioAuth' });
    };

    onBeforeMount(async () => {
      if (!localStorage.getItem('token')) {
        router.push({ name: 'PortfolioAuth' });
      } else {
        const decode = jwtDecode(localStorage.getItem('token'));
        await store.dispatch('portfolio/googleAuth', {
          name: decode.name,
          email: decode.email,
          picture: decode.picture,
        });
        await store.dispatch('portfolio/connectToWebSocket');
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
