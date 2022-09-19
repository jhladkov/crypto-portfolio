<template>
  <div class="container">
    <base-loader v-if="state.loading" />
    <template v-else>
      <button
        class="go-back"
        @click="goHome"
      >
        <svg viewBox="0 0 24 24">
          <icon-arrow-back />
        </svg>
        Back
      </button>
      <price-container
        button-value="Add Transaction"
        :data="tokenData"
        :pre-title="preTitle"
        :show-token-info="true"
        modal-type="AddModal"
      />
      <detail-section :token-info="tokenInfo" />
      <table-cols
        :asset-cols="state.assetCols"
        class="transactions"
      >
        <div
          v-if="loading"
          v-animation
          class="area__loader"
        >
          <base-loader />
        </div>
        <div v-if="historyList">
          <transactions-col
            v-for="(list,index) in historyList"
            :key="index"
            :history-list="list"
            @removeTransaction="removeTransaction"
            @changeTransaction="changeTransaction"
          />
        </div>
      </table-cols>
      <modal
        v-if="currentModal"
        :type-modal="state.currentModal"
      >
        <add-modal v-if="state.currentModal === 'AddModal'" />
        <edit-modal v-if="state.currentModal === 'EditModal'" />
      </modal>
    </template>
  </div>
</template>

<script>
import PriceContainer from '@/containers/price-container/PriceContainer.vue';
import { useStore } from 'vuex';
import { computed, onBeforeMount, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailSection from '@/views/main/transactions/details-section/DetailsSection.vue';
import TransactionsCol from '@/components/transactions-col/TransactionsCol.vue';
import BaseLoader from '@/components/base-loader/BaseLoader.vue';
import TableCols from '@/components/table-cols/TableCols.vue';
import Modal from '@/components/modal/Modal.vue';
import AddModal from '@/containers/modals/add-modal/AddModal.vue';
import EditModal from '@/containers/modals/edit-modal/EditModal.vue';
import IconArrowBack from '@/assets/icons/user-space/IconArrowBack.vue';

export default {
  components: {
    IconArrowBack,
    EditModal,
    AddModal,
    Modal,
    TableCols,
    BaseLoader,
    TransactionsCol,
    DetailSection,
    PriceContainer,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      currentModal: store.getters['modal/getOpenedModal'],
      assetCols: ['Type', 'Price', 'Amount', 'Actions'],
      loading: false,
    });
    const tokenInfo = computed(() => store.getters['portfolio/getTokensList'].find((item) => item.id === route.params.token));
    const historyList = computed(() => tokenInfo.value?.historyList?.reverse());
    const tokenData = computed(() => ({
      src: tokenInfo.value?.src,
      price: tokenInfo.value?.hold,
      change: tokenInfo.value?.change,
    }));
    const preTitle = computed(() => (`${tokenInfo?.value?.name}(${tokenInfo?.value?.shortName}) Balance`));
    const loading = computed(() => store.getters['portfolio/getLoadingState'].transactionsLoading);

    // const getModal = computed(() => store.getters['modal/getModal']('AddModal'));
    const currentModal = computed(() => {
      if (store.getters['modal/getOpenedModal']) {
        state.currentModal = store.getters['modal/getOpenedModal'][0];
      }
      return store.getters['modal/getOpenedModal'];
    });

    const goHome = () => {
      router.push({ name: 'Portfolio' });
    };
    const changeTransaction = (payload) => {
      store.commit('modal/openModal', 'EditModal');
      store.commit('transactions/setChosenTransaction', payload);
    };
    const removeTransaction = async (id, cryptocurrencyId) => {
      store.commit('portfolio/setLoading', { value: true, loadingName: 'transactionsLoading' });
      if (id && cryptocurrencyId) {
        await store.dispatch('portfolio/removeTransaction', {
          id,
          cryptocurrencyId,
        });
      }
      if (historyList.value.length === 1) {
        await store.dispatch('portfolio/removeToken', cryptocurrencyId);
        router.push('/');
      }
      await store.dispatch('portfolio/findPortfolio');
      store.commit('portfolio/setLoading', { value: false, loadingName: 'transactionsLoading' });
      await store.dispatch('portfolio/getCharts');
    };

    onBeforeMount(async () => {
      state.loading = true;
      await store.dispatch('portfolio/findPortfolio');
      state.loading = false;
    });
    return {
      state,
      tokenInfo,
      tokenData,
      preTitle,
      historyList,
      goHome,
      loading,
      removeTransaction,
      changeTransaction,
      // getModal,
      currentModal,
    };
  },
};
</script>

<style scoped>
.transactions{
  position: relative;
}
</style>
