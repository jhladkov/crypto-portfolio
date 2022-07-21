<template>
  <section class="portfolio-panel">
    <div
      v-if="portfolios.length > 1"
      class="portfolio-panel__all all-info"
    >
      <portfolio-item
        name="All Portfolios"
        :price="totalPortfoliosPrice || 0"
      />
    </div>
    <div
      v-if="portfolios.length >= 1"
      class="portfolio-panel__line"
    />
    <div
      v-for="portfolio in portfolios"
      :key="portfolio.id"
      class="portfolio-panel__item"
      @click="changePortfolio(portfolio.id)"
    >
      <portfolio-item
        :name="portfolio.name"
        :price="portfolio.totalPrice"
      />
      <svg
        v-if="currentPortfolioId === portfolio.id"
        class="check-mark"
        viewBox="0 0 32 32"
      >
        <icon-check-mark />
      </svg>
    </div>

    <div
      class="portfolio-panel__create"
      @click="openModal"
    >
      Create portfolio
    </div>
    <modal
      v-if="currentModal"
      :type-modal="currentModal[0]"
    >
      <create-portfolio-modal v-if="currentModal[0] === 'CreatePortfolioModal'" />
    </modal>
  </section>
</template>

<script>
import PortfolioItem from '@/components/portfolio-item/PortfolioItem.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import Modal from '@/components/modal/Modal.vue';
import CreatePortfolioModal from '@/containers/modals/create-portfolio-modal/CreatePortfolioModal.vue';
import IconCheckMark from '@/assets/icons/user-space/IconCheckMark.vue';

export default {
  name: 'PortfolioPanel',
  components: {
    IconCheckMark, CreatePortfolioModal, Modal, PortfolioItem,
  },
  setup() {
    const store = useStore();
    const portfolios = computed(() => store.getters['portfolio/getAccountInfo']?.portfolios);
    const totalPortfoliosPrice = computed(() => store.getters['portfolio/getTotalPortfoliosPrice']);
    const currentPortfolioId = computed(
      () => store.state.portfolio.selectedPortfolio,
    );
    const currentModal = computed(() => store.getters['modal/getOpenedModal']);
    const openModal = () => {
      store.commit('modal/openModal', 'CreatePortfolioModal');
    };
    const changePortfolio = (id) => {
      if (id !== currentPortfolioId.value) {
        store.commit('portfolio/setSelectedPortfolio', id);
        store.dispatch('portfolio/getPortfolio');
        store.dispatch('portfolio/getCharts');
      }
    };

    return {
      portfolios,
      currentModal,
      totalPortfoliosPrice,
      currentPortfolioId,
      openModal,
      changePortfolio,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
