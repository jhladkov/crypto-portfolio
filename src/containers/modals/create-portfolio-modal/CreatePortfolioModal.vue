<template>
  <div class="modal__inner create-modal">
    <div class="modal__title">
      Create portfolio
    </div>
    <div class="modal__content content">
      <div class="content__title">
        Portfolio name
      </div>
      <base-input
        v-model="portfolioName"
        v-focus
        type="text"
        maxlength="32"
        class="shadow"
        placeholder="Enter your portfolio name..."
      />
      <div class="content__checker">
        {{ portfolioName.length }}/32 characters
      </div>
      <base-button
        value="Create portfolio"
        class-name="modal__add"
        @click="createPortfolio"
      />
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/base-input/BaseInput.vue';
import { ref } from 'vue';
import BaseButton from '@/components/base-button/BaseButton.vue';
import { useStore } from 'vuex';

export default {
  name: 'CreatePortfolioModal',
  components: { BaseButton, BaseInput },
  setup() {
    const store = useStore();
    const portfolioName = ref('');

    const createPortfolio = () => {
      if (portfolioName.value.trim().length > 0) {
        store.dispatch('portfolio/createPortfolio', portfolioName.value);
        store.commit('modal/closeModal', 'CreatePortfolioModal');
      }
    };

    return {
      portfolioName,
      createPortfolio,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
