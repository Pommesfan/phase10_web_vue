<template>
  <div class="row">
    <div class="col" v-for="(_, idx_card) in cards.length" :key="idx_card">
      <canvas height="150" width="100" v-bind:id="'player_card_' + idx_card"></canvas>
      <br>
      <input type="checkbox" v-for="(_, idx_checkbox) in checkboxes" :key="idx_checkbox" v-bind:id="'player_card_checkbox_' + idx_checkbox + '_' + idx_checkbox">
      <input type="radio" v-if="showRadioButtons==true" v-bind:id="'player_card_radio_button' + idx_card" name="playerCardToggleGroup">
    </div>
  </div>
</template>

<script>

import {drawCard} from "@/mixins/utils";
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: "PlayerCards",
  props: ["cards", "checkboxes", "showRadioButtons"],
  mounted() {
    for (var i = 0; i < this.cards.length; i++) {
      let cardview = document.getElementById("player_card_" + i)
      let card = this.cards[i]
      drawCard(card['value'], card['color'], cardview)
    }
  }
}

</script>

<style scoped>

</style>