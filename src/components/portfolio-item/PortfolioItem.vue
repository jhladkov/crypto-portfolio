<template>
  <div
    class="portfolio-panel__inner item"
    tabindex="-1"
    @blur="openPopup = false"
  >
    <div class="item__inner">
      <div
        class="item__img"
        :style="{ background: randomColor }"
      >
        <span>{{ name[0].toUpperCase() }}</span>
      </div>
      <div>
        <div class="item__title">
          {{ name }}
        </div>
        <div class="item__value">
          ≈${{ totalPrice }}
        </div>
      </div>
    </div>
    <div
      v-if="options"
      class="icon-dots"
      @click.stop="openPopup = !openPopup"
    >
      <svg
        viewBox="0 0 20 20"
      >
        <icon-dots />
      </svg>
    </div>
    <popup
      v-if="openPopup && options"
      class="item__popup"
      :options="options"
      @action="handlePopup"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Popup from '@/components/popup/Popup.vue';
import IconDots from '@/assets/icons/user-space/IconDots.vue';

export default {
  name: 'PortfolioItem',
  components: { IconDots, Popup },
  props: {
    name: String,
    price: {
      type: Number,
      default: 0,
    },
    popupOptions: {
      type: Array,
      default: [],
    },
    id: Number,
  },
  setup(props, { emit }) {
    const openPopup = ref(false);
    const options = computed(
      () => props.popupOptions.filter((item) => props.id !== +item.exceptions[0]),
    );
    const totalPrice = computed(
      () => props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    );

    const randomColor = computed(() => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    });

    const handlePopup = (action) => {
      openPopup.value = false;
      if (action === 'edit') {
        emit('edit', props.id);
      }
      if (action === 'removePortfolio') {
        emit('removePortfolio', props.id);
      }
    };

    return {
      handlePopup,
      totalPrice,
      randomColor,
      openPopup,
      options,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
