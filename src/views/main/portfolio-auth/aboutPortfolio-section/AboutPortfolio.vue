<template>
  <section class="about-portfolio">
    <div class="container">
      <div class="about-portfolio__wrapper">
        <div class="about-portfolio__inner">
          <div class="about-portfolio__pre-title">
            Auth Today
          </div>
          <h1 class="about-portfolio__title">
            Crypto Portfolio Tracker
          </h1>
          <p class="about-portfolio__info">
            Keep track of your profits, losses and portfolio valuation with our easy to use
            platform.
          </p>
          <base-button
            value="Create your Portfolio"
            class-name="about-portfolio__button"
            @click="googleAuth(handleResponse)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from '@/components/base-button/BaseButton.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { googleAuth } from '@/helpers/googleAuth';
import { onBeforeMount } from 'vue';

export default {
  name: 'AboutPortfolio',
  components: { BaseButton },
  setup() {
    const store = useStore();
    const router = useRouter();

    const handleResponse = async (res) => {
      const token = res.credential;
      localStorage.setItem('token', res.credential);
      await store.dispatch('portfolio/checkUser', token);

      router.push('/');
    };
    onBeforeMount(() => {
      if (localStorage.getItem('token')) {
        router.push('/');
      }
    });

    return {
      googleAuth,
      handleResponse,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
