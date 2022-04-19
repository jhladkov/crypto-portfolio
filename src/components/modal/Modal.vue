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
    modalType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const closeModal = () => {
      store.commit('modal/closeModal', props.modalType);
    };

    return {
      closeModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
