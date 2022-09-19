<template>
  <div class="table-tr transactions-template">
    <div class="table-td asset-name-td">
      <div class="table-tr__type">
        {{ historyList?.type }}
      </div>
      <div class="table-tr__date">
        {{ date }}
      </div>
    </div>
    <div class="table-td">
      ${{ convertInCorrectData(historyList.price) }}
    </div>
    <div class="table-td">
      <p class="table-td__operation-price">
        {{ operationPrice > 0 ? '+': '-' }}${{ convertInCorrectData(operationPrice) }}
      </p>
      <p
        class="table-td__amount"
        :class="historyList?.amount > 0 ? 'increase' : 'decrease'"
      >
        {{ historyList?.amount > 0 ? '+': '-' }}
        {{ convertInCorrectData(historyList?.amount) }}
        {{ historyList?.symbol?.toUpperCase() }}
      </p>
    </div>
    <div class="table-td">
      <div class="table-td__inner">
        <svg
          viewBox="0 0 32 32"
          @click.stop="changeTransaction"
        >
          <icon-pencil />
        </svg>
        <svg
          viewBox="0 0 24 24"
          @click.stop="removeTransaction"
        >
          <icon-trash />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import IconPencil from '@/assets/icons/user-space/IconPencil.vue';
import IconTrash from '@/assets/icons/user-space/IconTrash.vue';

export default {
  name: 'TransactionsCol',
  components: { IconTrash, IconPencil },
  props: {
    historyList: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const operationPrice = computed(() => (
      props.historyList.amount * props.historyList.price).toFixed(2));
    const date = computed(() => new Date(props.historyList.timestamp).toLocaleString());

    const convertInCorrectData = computed(
      () => (value) => value.toString().replace('-', ''),
    );
    const changeTransaction = () => {
      const data = {
        price: props.historyList.price,
        timestamp: props.historyList.timestamp,
        id: props.historyList.id,
        amount: props.historyList.amount,
      };
      emit('changeTransaction', data);
    };
    const removeTransaction = () => {
      emit('removeTransaction', props.historyList.id, props.historyList.cryptocurrencyId);
    };

    return {
      operationPrice,
      date,
      changeTransaction,
      removeTransaction,
      convertInCorrectData,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
