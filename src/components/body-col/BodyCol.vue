<template>
  <div class="table-tr">
    <div class="table-td asset-name-td">
      <img
        class="asset-img"
        :src="asset.src"
        alt="asset-img"
      >
      <div class="asset-name">
        {{ asset.name }}
      </div>
      <div class="asset-short-name">
        {{ asset.shortName }}
      </div>
    </div>
    <div class="table-td">
      ${{ asset.price }}
    </div>
    <div
      class="table-td"
      :class="[asset.change > 0 ? 'increase' : 'decrease']"
    >
      <div class="table-td__inner">
        <svg
          class="table-td__icon"
          viewBox="0 0 16 28"
        >
          <icon-arrow-up />
        </svg>
        {{ replaceData(asset.change) }}%
      </div>
    </div>
    <div class="table-td asset-hold">
      <div class="asset-hold-usd">
        ${{ asset.hold }}
      </div>
      <div class="asset-hold-tokens">
        {{ asset.holdTokens }} {{ asset.shortName }}
      </div>
    </div>
    <div class="table-td">
      ${{ asset.avg }}
    </div>
    <div
      class="table-td"
    >
      <div class="table-td__profit">
        {{ asset.profit > 0 ? '+' : '-' }} ${{ replaceData(asset.profit) }}
      </div>
      <div
        class="table-td__percents"
        :class="[asset.profit_loss_percent > 0 ? 'increase' : 'decrease']"
      >
        <div class="table-td__inner">
          <svg
            class="table-td__icon"
            viewBox="0 0 16 28"
          >
            <icon-arrow-up />
          </svg>
          {{ replaceData(asset.profit_loss_percent) }}%
        </div>
      </div>
    </div>
    <div class="table-td">
      <div
        class="table-td__actions"
        @click.stop="activePopup"
      >
        <svg viewBox="0 0 15 20">
          <IconDots />
        </svg>
      </div>
      <div
        v-if="popupStatus"
        class="table-td__popup popup"
      >
        <div
          class="popup__option"
          @click.stop="goToTransactions"
        >
          Transactions
        </div>
        <div
          class="popup__option"
          @click.stop="removeToken"
        >
          Remove Asset
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconArrowUp from '@/assets/icons/user-space/IconArrowUp.vue';
import { computed, ref } from 'vue';
import IconDots from '@/assets/icons/user-space/IconDots.vue';

export default {
  name: 'BodyCol',
  components: { IconDots, IconArrowUp },
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const popupStatus = ref(false);

    const replaceData = computed(
      () => (value) => value.toString().replace('-', ''),
    );
    const handleClosePopup = () => {
      if (popupStatus.value) {
        popupStatus.value = false;
        document.removeEventListener('click', handleClosePopup);
      }
    };
    const activePopup = () => {
      document.addEventListener('click', handleClosePopup);
      popupStatus.value = !popupStatus.value;
    };
    const goToTransactions = () => {
      popupStatus.value = false;
      document.removeEventListener('click', handleClosePopup);
      emit('goToTransactions', props.asset?.name);
    };
    const removeToken = () => {
      popupStatus.value = false;
      document.removeEventListener('click', handleClosePopup);
      emit('removeToken', props.asset?.name);
    };

    return {
      replaceData,
      activePopup,
      popupStatus,
      goToTransactions,
      removeToken,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
