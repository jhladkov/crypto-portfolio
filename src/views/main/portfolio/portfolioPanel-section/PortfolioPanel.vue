<template>
  <section class="portfolio-panel">
    <portfolio-item
      v-for="portfolio in portfolios"
      :key="portfolio.id"
      :name="portfolio.name"
      :price="portfolio.totalPrice"
    />
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

export default {
  name: 'PortfolioPanel',
  components: { CreatePortfolioModal, Modal, PortfolioItem },
  setup() {
    const store = useStore();
    const portfolios = computed(() => store.getters['portfolio/getAccountInfo'].portfolios);
    // const modalStatus = store.getters['modal/getModal']('CreatePortfolioModal');

    const currentModal = computed(() => store.getters['modal/getOpenedModal']);
    const openModal = () => {
      store.commit('modal/openModal', 'CreatePortfolioModal');
    };

    return {
      portfolios,
      currentModal,
      openModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
