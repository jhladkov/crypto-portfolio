<template>
  <section class="price-container">
    <div class="price-container__block block">
      <p class="price-container__pre-title">
        {{ preTitle }}
      </p>
      <div class="block__inner">
        <div
          v-if="showTokenInfo"
          class="price-container__token-img"
        >
          <img
            :src="data.src"
            alt="token-icon"
          >
        </div>
        <h1 class="price-container__title">
          {{ data.price }}
        </h1>
        <indicator
          :class-name="
            `price-section__profit ${data.totalProfit > 0 ? 'increase' : 'decrease'}`
          "
          :background="true"
          :value="data.change"
        />
      </div>

      <div
        v-if="!showTokenInfo"
        class="price-container__inner info-block"
      >
        <p
          class="info-block__value"
          :class="data.totalProfit > 0 ? 'increase' : 'decrease'"
        >
          + {{ data.totalProfit }}
        </p>
        <div class="info-block__duration">
          24h
        </div>
      </div>
    </div>
    <modal
      v-if="getModal"
      title="Add Transaction"
      type="type"
    >
      <TransactionModal />
    </modal>
    <div class="price-section__block">
      <base-button
        value="Add New"
        class-name="price-section__add-crypto"
        @click="openModal"
      />
    </div>
  </section>
</template>

<script>
import Indicator from '@/components/indicator/Indicator.vue';
import BaseButton from '@/components/base-button/BaseButton.vue';
import TransactionModal from '@/containers/modals/transactions-modal/TransactionModal.vue';
import Modal from '@/components/modal/Modal.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'PriceContainer',
  components: {
    BaseButton,
    Indicator,
    TransactionModal,
    Modal,
  },
  props: {
    preTitle: {
      type: String,
      default: 'Current Balance',
    },
    showTokenInfo: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const getModal = computed(() => store.getters['modal/getModal']('Transaction'));

    const openModal = () => {
      store.commit('modal/openModal', 'Transaction');
    };

    return {
      getModal,
      openModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
