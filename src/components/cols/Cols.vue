<template>
  <div
    class="assets-section"
    :class="className"
  >
    <div class="assets-section__wrapper">
      <div class="assets-title">
        Your Assets
      </div>
      <div
        class="table-assets"
      >
        <div class="table-assets-head">
          <div
            v-for="(colName,index) in assetCols"
            :key="index"
            class="table-assets-head-col"
          >
            {{ colName }}
          </div>
        </div>
        <div class="table-assets-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    className: {
      type: String,
      default: null,
    },
    assetCols: {
      type: Array,
      default: null,
    },
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
