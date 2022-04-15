<template>
  <input
    class="input"
    :class="className"
    :type="type"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'number',
    },
    defaultValue: {
      type: [Number, String],
      default: null,
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
