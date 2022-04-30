<template>
  <div class="table-tr transactions-template">
    <div class="table-td asset-name-td">
      <div class="table-tr__type">
        Buy
      </div>
      <div class="table-tr__date">
        {{ date }}
      </div>
    </div>
    <div class="table-td">
      ${{ historyList.price }}
    </div>
    <div class="table-td">
      <p class="table-td__operation-price">
        +${{ operationPrice }}
      </p>
      <p class="table-td__amount increase">
        +{{ historyList.amount }} {{ historyList.symbol?.toUpperCase() }}
      </p>
    </div>
    <div class="table-td">
      <div class="table-td__inner">
        <svg viewBox="0 0 32 32">
          <icon-pencil />
        </svg>
        <svg viewBox="0 0 24 24">
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
  setup(props) {
    const operationPrice = computed(() => (
      props.historyList.amount * props.historyList.price).toFixed(2));

    const date = new Date(props.historyList.timestamp).toLocaleString();

    return {
      operationPrice,
      date,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
