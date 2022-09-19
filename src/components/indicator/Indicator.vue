<template>
  <div
    class="profit"
  >
    <slot />
    <p class="profit__value">
      {{ value }}%
    </p>
  </div>
</template>

<script>
export default {
  name: 'Indicator',
  props: {
    background: {
      type: String,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
