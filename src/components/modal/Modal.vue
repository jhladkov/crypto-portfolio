<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal__title">
        {{ title }}
      </div>
      <slot />
    </div>
    <div
      class="background"
      @click="closeModal"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  props: {
    title: String,
  },
  setup() {
    const store = useStore();

    const closeModal = () => {
      store.commit('modal/closeModal', 'Transaction');
    };

    return {
      closeModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
