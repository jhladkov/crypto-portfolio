<template>
  <div class="modal__inner">
    <div class="modal__title">
      Calendar
    </div>
    <div>
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
    <base-button value="Add date" />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '@/components/base-button/BaseButton.vue';

export default {
  name: 'CalendarModal',
  components: { BaseButton },
  setup() {
    const store = useStore();
    const calendarValue = ref(0);

    watch(calendarValue, (date) => {
      store.commit('modal/setTimestamp', date.getTime());
    });
    return {
      calendarValue,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
