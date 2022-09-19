<template>
  <section class="portfolio-panel">
    <div
      v-if="panelData?.length > 1"
      class="portfolio-panel__all all-info"
    >
      <div class="portfolio-panel__inner item">
        <div class="item__img">
          <svg viewBox="0 0 32 32">
            <icon-brief-case />
          </svg>
        </div>
        <div>
          <div class="item__title">
            All Portfolios
          </div>
          <div class="item__value">
            ≈${{ replaceData(totalPortfoliosPrice) || '111' }}
          </div>
        </div>
      </div>
      <div
        :class="[{rotateDown: hide, rotateUp: !hide},'all-info__display']"
        @click="showPortfolios"
      >
        <svg
          viewBox="0 0 24 24"
        >
          <icon-arrow-back />
        </svg>
      </div>
    </div>
    <div
      v-if="panelData?.length >= 1"
      class="portfolio-panel__line"
    />

    <div
      :class="[{hide, show: !hide},'portfolio-panel__content']"
    >
      <div
        v-for="portfolio in panelData"
        :key="portfolio.id"
        v-animation
        class="portfolio-panel__item"
        @click="changePortfolio(portfolio.id)"
      >
        <div class="portfolio-panel__wrapper">
          <portfolio-item
            :id="portfolio.id"
            :name="portfolio.name"
            :price="fixedData(portfolio)"
            :popup-options="popupOptions"
            :exception="panelData[0].id"
            @edit="editPortfolio"
            @removePortfolio="removePortfolio"
          />
          <svg
            v-if="currentPortfolioId === portfolio.id"
            class="check-mark"
            viewBox="0 0 32 32"
          >
            <icon-check-mark />
          </svg>
        </div>
      </div>
      <div
        v-if="loading"
        v-animation
        class="area__loader"
      >
        <base-loader />
      </div>
    </div>
    <div
      class="portfolio-panel__create"
      @click="openModal"
    >
      <svg viewBox="0 0 20 20">
        <icon-add />
      </svg>
      <p>Create portfolio</p>
    </div>
    <modal
      v-if="currentModal"
      :type-modal="currentModal[0]"
    >
      <create-portfolio-modal v-if="currentModal[0] === 'CreatePortfolioModal'" />
      <edit-portfolio-modal
        v-if="currentModal[0] === 'EditPortfolioModal'"
        :id="editModalId"
      />
    </modal>
  </section>
</template>

<script>
import PortfolioItem from '@/components/portfolio-item/PortfolioItem.vue';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import Modal from '@/components/modal/Modal.vue';
import CreatePortfolioModal from '@/containers/modals/create-portfolio-modal/CreatePortfolioModal.vue';
import IconCheckMark from '@/assets/icons/user-space/IconCheckMark.vue';
import IconAdd from '@/assets/icons/user-space/IconAdd.vue';
import IconBriefCase from '@/assets/icons/user-space/IconBriefCase.vue';
import IconArrowBack from '@/assets/icons/user-space/IconArrowBack.vue';
import EditPortfolioModal from '@/containers/modals/edit-portfolio-modal/EditPortfolioModal.vue';
import BaseLoader from '@/components/base-loader/BaseLoader.vue';

export default {
  name: 'PortfolioPanel',
  components: {
    BaseLoader,
    EditPortfolioModal,
    IconArrowBack,
    IconBriefCase,
    IconAdd,
    IconCheckMark,
    CreatePortfolioModal,
    Modal,
    PortfolioItem,
  },
  setup() {
    const store = useStore();
    const panelData = computed(() => store.state.portfolio?.portfolios);
    const popupOptions = [
      {
        value: 'Edit', action: 'edit', viewBox: '0 0 32 32', path: 'M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z',
      },
      {
        value: 'Remove', action: 'removePortfolio', viewBox: '0 0 24 24', path: 'M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1z',
      },
    ];
    const replaceData = computed(
      () => (value) => value?.toString()?.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    );
    const hide = ref(false);
    const editModalId = ref(0);
    const totalPortfoliosPrice = computed(() => +store.getters['portfolio/getTotalPortfoliosPrice'].toFixed(2));
    const fixedData = computed(() => (portfolio) => portfolio.totalPrice?.toFixed(2) || 0);
    const currentPortfolioId = computed(
      () => store.state.portfolio.selectedPortfolio,
    );
    const currentModal = computed(() => store.getters['modal/getOpenedModal']);
    const openModal = () => {
      store.commit('modal/openModal', 'CreatePortfolioModal');
    };
    const loading = computed(() => store.getters['portfolio/getLoadingState'].portfolioPanelLoading);
    const changePortfolio = async (id) => {
      if (id !== currentPortfolioId.value) {
        store.commit('portfolio/setLoading', { value: true, loadingName: 'chartLoading' });
        store.commit('portfolio/setLoading', { value: true, loadingName: 'assetSectionLoading' });
        store.commit('portfolio/setSelectedPortfolio', id);
        await store.dispatch('portfolio/disconnectFromWebSocket');
        await store.dispatch('portfolio/findPortfolio');
        store.commit('portfolio/setLoading', { value: false, loadingName: 'assetSectionLoading' });
        await store.dispatch('portfolio/getCharts');
        store.commit('portfolio/setLoading', { value: false, loadingName: 'chartLoading' });
        await store.dispatch('portfolio/connectToWebSocket');
      }
    };
    const showPortfolios = () => {
      hide.value = !hide.value;
    };
    const editPortfolio = (portfolioId) => { // id
      editModalId.value = portfolioId;
      store.commit('modal/openModal', 'EditPortfolioModal');
    };
    const removePortfolio = async (portfolioId) => { // id
      store.commit('portfolio/setLoading', { value: true, loadingName: 'portfolioPanelLoading' });
      await store.dispatch('portfolio/removePortfolio', portfolioId);
      await store.dispatch('portfolio/getPortfolios');
      await store.dispatch('portfolio/findPortfolio');
      store.commit('portfolio/setLoading', { value: false, loadingName: 'portfolioPanelLoading' });
      await store.dispatch('portfolio/getCharts');
    };
    return {
      currentModal,
      totalPortfoliosPrice,
      currentPortfolioId,
      replaceData,
      fixedData,
      hide,
      popupOptions,
      removePortfolio,
      editPortfolio,
      showPortfolios,
      openModal,
      editModalId,
      loading,
      panelData,
      changePortfolio,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
