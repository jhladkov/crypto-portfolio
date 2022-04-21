<template>
  <div class="modal__inner calendar">
    <div class="calendar__header">
      <div
        class="calendar__back"
        @click="goBack"
      />
      <div class="modal__title">
        Date & Time
      </div>
    </div>
    <div class="calendar__content">
      <v-date-picker
        v-model="calendarValue"
        :max-date="new Date()"
        trim-weeks
        class="calendar"
        mode="dateTime"
        locale="en"
        is-expanded
      />
    </div>
    <base-button
      value="Change Date & Time"
      class="modal__add"
      @click="changeTime"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '@/components/base-button/BaseButton.vue';

export default {
  name: 'CalendarModal',
  components: { BaseButton },
  setup() {
    const store = useStore();
    const calendarValue = ref(new Date());

    const goBack = () => {
      store.commit('modal/closeModal', 'CalendarModal');
      store.commit('modal/openModal', 'TransactionModal');
      store.commit('modal/setCurrentModal', 'TransactionModal');
    };
    const changeTime = () => {
      store.commit('modal/setTimestamp', calendarValue.value.getTime());
      goBack();
    };
    return {
      goBack,
      calendarValue,
      changeTime,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
