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
  props: {
    typeModal: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore();

    const closeModal = () => {
      store.commit('modal/closeModal', props.typeModal);
      store.commit('transactions/setChosenTransaction', null);
    };

    return {
      closeModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
