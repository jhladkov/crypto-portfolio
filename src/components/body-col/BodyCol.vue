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
      ${{ replaceData(asset.price) }}
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
        ${{ replaceData(asset.hold) }}
      </div>
      <div class="asset-hold-tokens">
        {{ replaceData(asset.holdTokens) }} {{ asset.shortName }}
      </div>
    </div>
    <div class="table-td">
      ${{ replaceData(asset.avg) }}
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
    <div class="table-td actions-wrapper">
      <div class="table-td__inner">
        <div
          class="table-td__add-tr"
          @click.stop="openModal(asset)"
        >
          <svg viewBox="3 0 17 24">
            <IconPlus />
          </svg>
        </div>
      </div>
      <div
        tabindex="-1"
        @blur="popupStatus = false"
      >
        <div
          class="table-td__actions"
          @click.stop="activePopup"
        >
          <svg viewBox="0 0 15 20">
            <IconDots />
          </svg>
        </div>
        <popup
          v-if="popupStatus"
          class="table-td__popup"
          :options="popupOptions"
          @action="handlePopup"
        />
      </div>
    </div>
  </div>
</template>

<script>
import IconArrowUp from '@/assets/icons/user-space/IconArrowUp.vue';
import { computed, ref } from 'vue';
import IconDots from '@/assets/icons/user-space/IconDots.vue';
import IconPlus from '@/assets/icons/user-space/IconPlus.vue';
import Popup from '@/components/popup/Popup.vue';

export default {
  name: 'BodyCol',
  components: {
    Popup,
    IconPlus,
    IconDots,
    IconArrowUp,
  },
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const popupOptions = [
      {
        value: 'Transactions', action: 'goToTransaction', viewBox: '0 0 32 32', path: 'M31.998 24h-24.006v4l-7.992-6 7.992-6v4h24.006zM0 12h23.998v4l8-6-8-6v4h-23.998z',
      },
      {
        value: 'Remove Asset', action: 'removeToken', viewBox: '0 0 24 24', path: 'M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1z',
      },
    ];
    const popupStatus = ref(false);

    const replaceData = computed(
      () => (value) => value?.toString()
        ?.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    );
    const handlePopup = (action) => {
      if (action === 'goToTransaction') {
        popupStatus.value = false;
        emit('goToTransactions', props.asset?.id);
      }
      if (action === 'removeToken') {
        popupStatus.value = false;
        emit('removeToken', props.asset.historyList[0].cryptocurrencyId);
      }
    };
    const activePopup = () => {
      popupStatus.value = !popupStatus.value;
    };
    const openModal = (token) => {
      emit('openModal', token);
    };

    return {
      replaceData,
      activePopup,
      popupStatus,
      openModal,
      popupOptions,
      handlePopup,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
