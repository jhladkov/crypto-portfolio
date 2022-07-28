<template>
  <div
    class="popup"
  >
    <div
      v-for="option in options"
      :key="option.value"
      class="popup__option"
      @click.stop="actionPopup(option.action)"
    >
      <svg :viewBox="option.viewBox">
        <path :d="option.path" />
      </svg>
      {{ option.value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    options: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const actionPopup = (actionName) => {
      emit('action', actionName);
    };

    return {
      actionPopup,
    };
  },
};
</script>

<style scoped>

</style>
