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
    <div class="table-td">
      {{ asset.change }}
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
    <div class="table-td">
      + ${{ asset.profit }}
    </div>
    <div class="table-td">
      Action
    </div>
  </div>
</template>

<script>
export default {
  name: 'BodyCol',
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
