<template>
  <div class="row">
    <div class="col" v-for="(cardObj, idx_card) in cards" :key="idx_card">
      <CardComponent :key="cardObj" :card="cardObj" :id="'player_card_' + idx_card"></CardComponent>
      <br>
      <div v-for="(_, idx_checkbox) in checkboxes" :key="idx_checkbox">
        <br>
        <input type="checkbox" :key="idx_checkbox"
               v-bind:id="'player_card_checkbox_' + idx_checkbox + '_' + idx_card" class="form-check-input">
      </div>
      <input type="radio" v-if="showRadioButtons==true" v-bind:id="'player_card_radio_button_' + idx_card"
             name="playerCardToggleGroup" :value="idx_card" class="form-check-input">
    </div>
  </div>
</template>

<script>

import CardComponent from "@/components/OutputForms/CardComponent.vue";

export default {
  name: "PlayerCards",
  components: {CardComponent},
  props: ["cards", "checkboxes", "showRadioButtons"],
}

</script>

<style scoped>

</style>