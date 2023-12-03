<template>
  <label>Karte tauschen:</label><br>
  <input type="submit" id="btn_new_card" class="btn btn-success" value="Neue Karte">
  <input type="submit" id="btn_open_card" class="btn btn-success" value="Offenliegende Karte">
</template>

<script>
import {websocket} from "@/mixins/handleWebSocket";
import {NEW_CARD, OPEN_CARD, setSelectedPlayerCard, setSwitchMode} from "@/mixins/utils";
export default {
  name: "SwitchCardForm",
  mounted() {
    function switch_card(mode) {
      let qs = document.querySelector('input[name="playerCardToggleGroup"]:checked')
      if(qs == null)
        return
      let card_index = parseInt(qs.value)

      qs.checked = false
      setSelectedPlayerCard(card_index)
      setSwitchMode(mode)
      websocket.send(JSON.stringify({"cmd": "switch_cards", "mode": mode, "index": card_index}))
    }

    function new_card() {
      switch_card(NEW_CARD)
    }

    function open_card() {
      switch_card(OPEN_CARD)
    }

    document.getElementById("btn_new_card").onclick = new_card
    document.getElementById("btn_open_card").onclick = open_card
  }
}
</script>

<style scoped>

</style>