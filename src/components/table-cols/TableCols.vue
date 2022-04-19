<template>
  <div
    class="table-cols"
  >
    <div class="table-cols__wrapper">
      <div
        class="table-cols__table"
      >
        <div class="table-cols__table-head">
          <div
            v-for="(colName,index) in assetCols"
            :key="index"
            class="table-cols__table-head-col"
          >
            {{ colName }}
          </div>
        </div>
        <div class="table-cols__table-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TableCols',
  props: {
    assetCols: {
      type: Array,
      default: null,
    },
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
