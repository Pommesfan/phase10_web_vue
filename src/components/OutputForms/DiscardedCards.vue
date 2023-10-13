<template>
  <div v-for="(_, i) in cards.length" :key="i">
    {{get_player_name(i)}}
    <div class="row" v-if="cards[i] == None">
      <p>Keine Karten</p>
    </div>
    <div class="row" v-else>
      <div class="col" v-for="(_,j) in cards[i].length" :key="j">
        <input type="radio" v-if="showRadioButtons==true" v-bind:id="'injectTo_radiobutton_' + i + '_'+ j + '_FRONT'"
               name="discardedCardToggleGroup" :value="i + '_' + j + '_FRONT'" class="form-check-input">
        <canvas v-for="(_,k) in cards[i][j].length" :key="k" height="150" width="100"
                v-bind:id="'discarded_card_' + i + '_' + j + '_' + k"></canvas>
        <input type="radio" v-if="showRadioButtons==true" v-bind:id="'injectTo_radiobutton_' + i + '_'+ j + '_AFTER'"
               name="discardedCardToggleGroup" :value="i + '_' + j + '_AFTER'" class="form-check-input">
      </div>
    </div>
  </div>
</template>

<script>

import {drawCard, get_player_name} from "@/mixins/utils";

export default {
  name: "DiscardedCards",
  methods: {get_player_name},
  props: ["cards", "showRadioButtons"],
  mounted() {
    let cards = this.cards
    for(var i = 0; i < cards.length; i++) {
      if(cards[i] != null) {
        for(var j = 0; j < cards[i].length; j++) {
          for(var k = 0; k < cards[i][j].length; k++) {
            let card = cards[i][j][k]
            let cardview = document.getElementById("discarded_card_" + i + "_" + j + "_" + k)
            drawCard(card['value'], card['color'], cardview)
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>