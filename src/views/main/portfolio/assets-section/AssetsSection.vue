<template>
  <section class="assets-section">
    <div class="assets-title">
      Your Assets
    </div>
    <div class="table-assets">
      <div class="table-assets-head">
        <div class="table-assets-head-col">
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
          v-for="(item, index) in test"
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
  setup() {
    const test = [
      {
        name: 'Solana',
        shortName: 'SOL',
        price: '130.34',
        holdTokens: '8.75',
        change: '12',
        hold: '1034',
        avg: '90',
        profit: '200',
        src: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
      },
      {
        name: 'Genopets',
        shortName: 'GENE',
        price: '130.34',
        holdTokens: '8.75',
        change: '12',
        hold: '1034',
        avg: '90',
        profit: '200',
        src: 'https://s2.coinmarketcap.com/static/img/coins/64x64/13632.png',
      },
      {
        name: 'Ethereum',
        shortName: 'ETH',
        price: '130.34',
        holdTokens: '8.75',
        change: '12',
        hold: '1034',
        avg: '90',
        profit: '200',
        src: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
      },
      {
        name: 'Impossible Finance Launchpad',
        shortName: 'IDIA',
        price: '130.34',
        holdTokens: '8.75',
        change: '12',
        hold: '1034',
        avg: '90',
        profit: '200',
        src: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10933.png',
      },
    ];
    return {
      test,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
