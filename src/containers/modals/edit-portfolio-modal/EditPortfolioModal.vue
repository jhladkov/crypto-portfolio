<template>
  <div class="modal__inner edit-portfolio-modal">
    <div class="modal__title">
      Edit portfolio
    </div>
    <div class="modal__content content">
      <div class="content__title">
        Portfolio name
      </div>
      <base-input
        v-model="portfolioName"
        v-focus
        :value="portfolioName"
        type="text"
        maxlength="32"
        class="shadow"
        placeholder="Enter your portfolio name..."
      />
      <div class="content__checker">
        {{ portfolioName.length }}/32 characters
      </div>
      <base-button
        value="Edit portfolio"
        class-name="modal__add"
        @click="changeName"
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
  name: 'EditPortfolioModal',
  components: {
    BaseButton,
    BaseInput,
  },
  props: {
    id: Number,
  },
  setup(props) {
    const store = useStore();
    const currentPortfolioName = () => {
      const portfolio = store.state.portfolio.portfolios.find(
        (item) => +item.id === +props.id,
      );
      return portfolio?.name || '';
    };
    const portfolioName = ref(currentPortfolioName());

    const changeName = async () => {
      await store.dispatch('portfolio/changePortfolioName', {
        newName: portfolioName.value || currentPortfolioName.value,
        portfolioId: props.id,
      });
      store.commit('portfolio/setLoading', { value: true, loadingName: 'portfolioPanelLoading' });
      store.commit('modal/closeModal', 'EditPortfolioModal');
      await store.dispatch('portfolio/findPortfolio');
      store.commit('portfolio/setLoading', { value: false, loadingName: 'portfolioPanelLoading' });
    };

    return {
      portfolioName,
      currentPortfolioName,
      changeName,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
