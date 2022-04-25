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
      :disabled="!calendarValue"
      :class="[
        'modal__add',
        calendarValue ? null : 'disabled',
      ]"
      @click="changeTime"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import BaseButton from '@/components/base-button/BaseButton.vue';

export default {
  name: 'CalendarModal',
  components: { BaseButton },
  setup(props, { emit }) {
    const calendarValue = ref(new Date());

    const goBack = () => {
      emit('close');
    };
    const changeTime = () => {
      emit('setTimestamp', calendarValue.value.getTime());
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
