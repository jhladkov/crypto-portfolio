<template>
  <div class="table-tr">
    <div class="table-td asset-name-td">
      Buy
    </div>
    <div class="table-td">
      ${{ historyList.price }}
    </div>
    <div class="table-td">
      <p class="table-td__operation-price">
        +${{ operationPrice }}
      </p>
      <p class="table-td__amount increase">
        +{{ historyList.amount }} {{ historyList.symbol }}
      </p>
    </div>
    <div class="table-td">
      actions
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'TransactionsCol',
  props: {
    historyList: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const operationPrice = computed(() => (
      props.historyList.amount * props.historyList.price).toFixed(2));

    return {
      operationPrice,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
