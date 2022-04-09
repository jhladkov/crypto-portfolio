<template>
  <div class="table-tr">
    <div class="table-td asset-name-td">
      <img
        class="asset-img"
        :src="asset.src"
        alt="asset-img"
      >
      <div class="asset-name">
        {{ asset.name }}
      </div>
      <div class="asset-short-name">
        {{ asset.shortName }}
      </div>
    </div>
    <div class="table-td">
      ${{ asset.price }}
    </div>
    <div
      class="table-td"
      :class="[asset.change > 0 ? 'increase' : 'decrease']"
    >
      {{ asset.change }}%
    </div>
    <div class="table-td asset-hold">
      <div class="asset-hold-usd">
        ${{ asset.hold }}
      </div>
      <div class="asset-hold-tokens">
        {{ asset.holdTokens }} {{ asset.shortName }}
      </div>
    </div>
    <div class="table-td">
      ${{ asset.avg }}
    </div>
    <div
      class="table-td"
    >
      <div class="table-td__profit">
        + ${{ asset.profit }}
      </div>
      <div :class="[profit_loss_percent > 0 ? 'increase' : 'decrease']">
        {{ profit_loss_percent }}%
      </div>
    </div>
    <div class="table-td">
      Action
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'BodyCol',
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const profit_loss_percent = computed(() => {
      const initSpendMoney = +props.asset.holdTokens * +props.asset.avg;
      return ((props.asset.profit * 100) / initSpendMoney).toFixed(2);
    });

    // console.log(props.asset);
    return {
      profit_loss_percent,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
