<template>
  <div
    :class="[{background},className]"
    class="profit"
  >
    <p class="profit__value">
      {{ value }}%
    </p>
  </div>
</template>

<script>
export default {
  name: 'Indicator',
  props: {
    className: {
      type: String,
      default: null,
    },
    background: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '0',
    },
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
