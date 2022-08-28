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
    exception: Number,
    popupOptions: {
      type: Array,
      default: [],
    },
    id: Number,
  },
  setup(props, { emit }) {
    const openPopup = ref(false);
    const options = computed(
      () => (+props.id === +props.exception ? [{
        value: 'Edit', action: 'edit', viewBox: '0 0 32 32', path: 'M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z',
      }] : props.popupOptions),
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
