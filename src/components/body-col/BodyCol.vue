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
      <router-link
        :to="`/transactions/${asset.name}`"
      >
        Transactions
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePercentProfit } from '@/hook/usePercentProfit';

export default {
  name: 'BodyCol',
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const profit_loss_percent = computed(() => usePercentProfit(
      props.asset.holdTokens, props.asset.avg, props.asset.profit,
    ));

    const goToTransactions = () => {
      router.push(`/transactions/${props.asset.name}`);
    };

    return {
      profit_loss_percent,
      goToTransactions,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
