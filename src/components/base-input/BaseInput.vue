<template>
  <input
    class="input"
    :type="type"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'number',
    },
    placeholder: {
      type: String,
      default: null,
    },
  },
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
