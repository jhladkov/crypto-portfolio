<template>
  <div class="container">
    <base-loader v-if="loading" />
    <template v-else>
      <portfolio-panel />
      <price-section />
      <div v-if="tokensData?.length">
        <chart />
        <assets-section
          :asset-col="assetCol"
          title="Your Assets"
        >
          <body-col
            v-for="(item, index) in tokensData"
            :key="index"
            class="table-assets-body-col"
            :asset="item"
          />
        </assets-section>
      </div>
      <div
        v-else-if="!tokensData.length"
        class="empty-block"
      >
        <div class="empty-block__title">
          This portfolio is empty
        </div>
        <div class="empty-block__subtitle">
          Add any coins to get started
        </div>
        <base-button
          value="Add New"
          class="price-section__add-crypto"
          @click="openModal"
        >
          <svg
            class="button__icon"
            viewBox="0 0 20 20"
          >
            <icon-add />
          </svg>
        </base-button>
      </div>
      <!--      <div-->
      <!--        v-else-if="loading"-->
      <!--        class="loader"-->
      <!--      >-->
      <!--        <base-loader />-->
      <!--      </div>-->
      <modal
        v-if="getModal"
        type-modal="TransactionModal"
      >
        <transaction-modal />
      </modal>
    </template>
  </div>
</template>

<script>
import PriceSection from '@/views/main/portfolio/price-section/PriceSection.vue';
import AssetsSection from '@/views/main/portfolio/assets-section/AssetsSection.vue';
import Chart from '@/views/main/portfolio/chart-section/Chart.vue';
import { useStore } from 'vuex';
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import BodyCol from '@/components/body-col/BodyCol.vue';
import Modal from '@/components/modal/Modal.vue';
import TransactionModal from '@/containers/modals/transaction-modal/TransactionModal.vue';
import PortfolioPanel from '@/views/main/portfolio/portfolioPanel-section/PortfolioPanel.vue';
import BaseButton from '@/components/base-button/BaseButton.vue';
import IconAdd from '@/assets/icons/user-space/IconAdd.vue';
import BaseLoader from '@/components/base-loader/BaseLoader.vue';

export default {
  name: 'Portfolio',
  components: {
    BaseLoader,
    IconAdd,
    BaseButton,
    PortfolioPanel,
    TransactionModal,
    BodyCol,
    Chart,
    PriceSection,
    AssetsSection,
    Modal,
  },
  setup() {
    const store = useStore();

    const assetCol = ref(['Name', 'Price', '24H', 'Holdings', 'Avg. Buy Price', 'Profit/Loss', 'Actions']);
    const value = ref('');
    const searchData = computed(() => store.getters['portfolio/searchData']);
    const tokensData = computed(() => store.getters['portfolio/getTokensList']);
    const getModal = computed(() => store.getters['modal/getModal']('TransactionModal'));
    const loading = computed(() => store.getters['portfolio/getLoadingState'].portfolioLoading);

    const openModal = () => {
      store.commit('modal/openModal', 'TransactionModal');
    };

    watch(value, async (newValue, oldValue) => {
      if (newValue === oldValue) return;
      const con = store.getters['portfolio/connection'];
      con.send(JSON.stringify({
        method: 'SearchToken',
        value: newValue,
      }));
    });

    onBeforeMount(async () => {
      if (!store.state.portfolio.connection) {
        store.dispatch('portfolio/connectToWebSocket');
      }
      if (!store.getters['portfolio/getTokensList'].length && localStorage.getItem('token')) {
        store.commit('portfolio/setLoading', {
          value: true,
          loadingName: 'assetSectionLoading',
        });
        store.commit('portfolio/setLoading', {
          value: true,
          loadingName: 'portfolioPanelLoading',
        });
        await store.dispatch('portfolio/findPortfolio');
        store.commit('portfolio/setLoading', {
          value: false,
          loadingName: 'portfolioLoading',
        });
        store.commit('portfolio/setLoading', {
          value: false,
          loadingName: 'assetSectionLoading',
        });
        store.commit('portfolio/setLoading', {
          value: false,
          loadingName: 'portfolioPanelLoading',
        });
      }
    });

    return {
      value,
      searchData,
      assetCol,
      tokensData,
      loading,
      getModal,
      openModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
