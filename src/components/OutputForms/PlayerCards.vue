<template>
  <div class="row">
    <li v-for="(item, idx) in cards.length" :key="idx">
      <div class="col">
        <canvas height="150" width="100" v-bind:id="'player_card_' + idx"></canvas>
        <br>
        <input type="checkbox">
      </div>
    </li>
  </div>
</template>

<script>

import {drawCard} from "@/mixins/utils";
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: "PlayerCards",
  props: ["cards"],
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