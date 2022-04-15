<template>
  <section class="section price-section">
    <div class="price-section__block block">
      <p class="prise-section__pre-title">
        Current Balance
      </p>
      <div class="block__inner">
        <h1 class="price-section__title">
          ${{ getTotalPrice }}
        </h1>
        <indicator
          :class-name="
            `price-section__profit ${getTotalProfitInPercents > 0 ? 'increase' : 'decrease'}`
          "
          :background="true"
          :value="getTotalProfitInPercents"
        />
      </div>

      <div class="price-section__inner info-block">
        <p
          class="info-block__value"
          :class="getTotalProfit > 0 ? 'increase' : 'decrease'"
        >
          + ${{ getTotalProfit }}
        </p>
        <div class="info-block__duration">
          24h
        </div>
      </div>
    </div>
    <div class="price-section__block">
      <base-button
        value="Add New"
        class-name="price-section__add-crypto"
        @click="openModal"
      />
    </div>
    <modal
      v-if="getModal"
      title="Add Transaction"
      type="type"
    >
      <TransactionModal />
    </modal>
  </section>
</template>

<script>
import Indicator from '@/components/indicator/Indicator.vue';
import BaseButton from '@/components/base-button/BaseButton.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import Modal from '@/components/modal/Modal.vue';
import TransactionModal from '@/containers/modals/transactions-modal/TransactionModal.vue';

export default {
  name: 'PriceSection',
  components: {
    TransactionModal,
    Modal,
    BaseButton,
    Indicator,
  },
  setup() {
    const store = useStore();
    const getTotalPrice = computed(() => +store.getters['portfolio/totalPrice'].split('').slice(1).join(''));
    const getTotalProfit = computed(() => +store.getters['portfolio/totalProfit'].split('').slice(1).join(''));
    const getTotalProfitInPercents = computed(() => store.getters['portfolio/totalProfitInPercents'].split('').slice(1).join(''));

    const getModal = computed(() => store.getters['portfolio/getModal']('Transaction'));

    const openModal = () => {
      store.commit('portfolio/openModal', 'Transaction');
    };

    return {
      getTotalPrice,
      getTotalProfitInPercents,
      getTotalProfit,
      getModal,
      openModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
