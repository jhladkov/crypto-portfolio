<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal__title">
        {{ title }}
      </div>
      <div class="modal__actions actions">
        <div
          v-for="(action,index) in actions"
          :key="index"
          class="actions__block block"
          :class="{'active': index === getActiveIndex}"
          @click="selectAction(index)"
        >
          <p class="block__value">
            {{ action }}
          </p>
        </div>
      </div>
      <div class="modal__inner">
        <slot />
      </div>
    </div>
    <div
      class="background"
      @click="closeModal"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive, computed } from 'vue';

export default {
  props: {
    title: String,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      actions: ['Buy', 'Sell'],
      activeIndex: 0,
      inputValue: '',
    });
    const getActiveIndex = computed(() => state.activeIndex || 0);

    const closeModal = () => {
      store.commit('portfolio/closeModal', 'Transaction');
    };

    const selectAction = (index) => {
      state.activeIndex = index;
    };

    return {
      ...state,
      closeModal,
      selectAction,
      getActiveIndex,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
