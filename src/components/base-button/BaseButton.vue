<template>
  <button
    class="button"
  >
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
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
