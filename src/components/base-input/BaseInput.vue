<template>
  <input
    class="input"
    type="number"
  >
</template>

<script>
export default {
  setup(props, { emit }) {
    const changeValue = (event) => {
      emit('update:modelValue', event.target.value);
    };

    return {
      changeValue,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
