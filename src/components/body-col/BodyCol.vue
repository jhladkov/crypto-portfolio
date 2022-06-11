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
        <div
          v-if="popupStatus"
          class="table-td__popup popup"
        >
          <div
            class="popup__option"
            @click.stop="goToTransactions"
          >
            <svg viewBox="0 0 32 32">
              <icon-transaction />
            </svg>
            Transactions
          </div>
          <div
            class="popup__option"
            @click.stop="removeToken"
          >
            <svg viewBox="0 0 24 24">
              <icon-trash />
            </svg>
            Remove Asset
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconArrowUp from '@/assets/icons/user-space/IconArrowUp.vue';
import { computed, ref } from 'vue';
import IconDots from '@/assets/icons/user-space/IconDots.vue';
import IconTransaction from '@/assets/icons/user-space/IconTransaction.vue';
import IconTrash from '@/assets/icons/user-space/IconTrash.vue';
import IconPlus from '@/assets/icons/user-space/IconPlus.vue';

export default {
  name: 'BodyCol',
  components: {
    IconPlus,
    IconTrash,
    IconTransaction,
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
    const popupStatus = ref(false);

    const replaceData = computed(
      () => (value) => value?.toString()
        ?.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    );
    const activePopup = () => {
      popupStatus.value = !popupStatus.value;
    };
    const openModal = (token) => {
      emit('openModal', token);
    };
    const goToTransactions = () => {
      popupStatus.value = false;
      emit('goToTransactions', props.asset?.id);
    };
    const removeToken = () => {
      popupStatus.value = false;
      emit('removeToken', props.asset.historyList[0].cryptocurrencyId);
    };

    return {
      replaceData,
      activePopup,
      popupStatus,
      goToTransactions,
      removeToken,
      openModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
