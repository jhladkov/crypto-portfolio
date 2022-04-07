<template>
  <section class="assets-section">
    <div class="assets-title">
      Your Assets
    </div>
    <div class="table-assets">
      <div class="table-assets-head">
        <div
          class="table-assets-head-col"
        >
          Name
        </div>
        <div class="table-assets-head-col">
          Price
        </div>
        <div class="table-assets-head-col">
          24H
        </div>
        <div class="table-assets-head-col">
          Holdings
        </div>
        <div class="table-assets-head-col">
          Avg. Buy Price
        </div>
        <div class="table-assets-head-col">
          Profit/Loss
        </div>
        <div class="table-assets-head-col">
          Actions
        </div>
      </div>
      <div class="table-assets-body">
        <body-col
          v-for="(item, index) in tokensData"
          :key="index"
          class="table-assets-body-col"
          :asset="item"
        />
      </div>
    </div>
  </section>
</template>

<script>
import BodyCol from '@/components/body-col/BodyCol.vue';

export default {
  name: 'AssetsSection',
  components: { BodyCol },
  data() {
    return {
      WBSKData: [],
      connection: null,
    };
  },
  computed: {
    tokensData() {
      const data = this.WBSKData[0]?.tokenList;
      return data?.map((item) => ({
        name: item?.name,
        shortName: item?.symbol,
        price: item?.currentPrice.toFixed(2),
        holdTokens: item?.amount.toFixed(2),
        change: item?.priceChangePercentage24h.toFixed(2),
        hold: item?.cryptoHoldings.toFixed(2),
        avg: item?.buyAvgPrice.toFixed(2),
        profit: ((item?.currentPrice * item?.amount)
          - (item?.buyAvgPrice * item?.amount)).toFixed(2),
        src: item.image,
      }));
    },
  },
  created() {
    const connection = new WebSocket('ws://localhost:5000');
    connection.onmessage = (event) => {
      this.WBSKData = JSON.parse(event.data);
    };

    connection.onopen = () => {
      // console.log('Successfully connected to the echo websocket server...');
      connection.send(JSON.stringify({ method: 'getPortfolio', id: 1 }));
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
