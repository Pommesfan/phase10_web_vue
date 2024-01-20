<template>
  <div v-for="(_, i) in cards.length" :key="i" class="crow" id="discarded">
    <div class="row">
      <strong class="player_header">
        {{"Spieler: " + get_player_name(i) + "; Phase " + numberOfPhase[i] + ": " + phaseDescription[i] + "; Fehlerpunkte: " + errorPoints[i]}}
      </strong>
    </div>
    <div class="d-inline-block" v-if="cards[i] == None">
      <p>Keine Karten</p>
    </div>
    <div v-for="(_,j) in cards[i].length" :key="j" class="d-inline-block" v-else>
      <div class="col">
        <div class="space"></div>
        <input type="radio" v-if="showRadioButtons==true" v-bind:id="'injectTo_radiobutton_' + i + '_'+ j + '_1'"
               name="discardedCardToggleGroup" :value="i + '_' + j + '_1'" class="form-check-input">
        <CardComponent v-for="(card,k) in cards[i][j]" :key="k" :id="'discarded_card_' + i + '_' + j + '_' + k"
                       :card="card"></CardComponent>
        <input type="radio" v-if="showRadioButtons==true" v-bind:id="'injectTo_radiobutton_' + i + '_'+ j + '_2'"
               name="discardedCardToggleGroup" :value="i + '_' + j + '_2'" class="form-check-input">
        <div class="space"></div>
      </div>
    </div>
  </div>
</template>

<script>

import {get_player_name} from "@/mixins/utils";
import CardComponent from "@/components/OutputForms/CardComponent.vue";

export default {
  name: "DiscardedCards",
  components: {CardComponent},
  methods: {get_player_name},
  props: ["cards", "showRadioButtons", "phaseDescription", "numberOfPhase", "errorPoints"],
}
</script>

<style scoped>
  discarded {
    text-align: center;
    margin: auto;
  }
  .space {
    float: left;
    overflow: hidden;
    height: 1px;
    width: 15px;
  }
  .player_header {
    color: darkslateblue;
  }
</style>