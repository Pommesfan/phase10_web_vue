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
        <CardComponent v-for="(card,k) in cards[i][j]" :key="k" :id="'discarded_card_' + i + '_' + j + '_' + k"
                :card="card"></CardComponent>
        <input type="radio" v-if="showRadioButtons==true" v-bind:id="'injectTo_radiobutton_' + i + '_'+ j + '_AFTER'"
               name="discardedCardToggleGroup" :value="i + '_' + j + '_AFTER'" class="form-check-input">
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
  props: ["cards", "showRadioButtons"],
}
</script>

<style scoped>

</style>