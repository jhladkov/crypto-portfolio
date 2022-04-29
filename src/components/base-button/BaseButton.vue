<template>
  <button
    class="button"
  >
    <span><slot /></span>
    {{ value }}
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    value: {
      type: String,
      required: true,
    },
    className: {
      type: [String, Array, Object],
      default: null,
    },
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
