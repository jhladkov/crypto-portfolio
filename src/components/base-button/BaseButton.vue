<template>
  <button
    class="button"
    :class="className"
  >
    {{ value }}
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    className: {
      type: [String, Array],
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
