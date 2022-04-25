<template>
  <div class="modal-wrapper">
    <div class="modal">
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
  name: 'Modal',
  setup() {
    const store = useStore();

    const closeModal = () => {
      store.commit('modal/closeModal', 'TransactionModal');
    };

    return {
      closeModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
