<template>
  <label>Karte tauschen:</label><br>
  <input type="submit" id="btn_new_card" class="btn btn-success" value="Neue Karte">
  <input type="submit" id="btn_open_card" class="btn btn-success" value="Offenliegende Karte">
</template>

<script>
import {websocket} from "@/mixins/handleWebSocket";

export default {
  name: "SwitchCardForm",
  mounted() {
    function switch_card(mode) {
      let card_index = parseInt(document.querySelector('input[name="card_index"]:checked').value)
      websocket.send(JSON.stringify({"cmd": "switch_cards", "mode": mode, "index": card_index}))
    }

    function new_card() {
      switch_card("new")
    }

    function open_card() {
      switch_card("open")
    }

    document.getElementById("btn_new_card").onclick = new_card
    document.getElementById("btn_open_card").onclick = open_card
  }
}
</script>

<style scoped>

</style>