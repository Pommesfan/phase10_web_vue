<template>
  <label>Karte anlegen:</label><br>
  <input type="submit" id="btn_inject" class="btn btn-success" value="Anlegen">
  <input type="submit" id="btn_no_inject" class="btn btn-secondary" value="Nicht anlegen">
</template>

<script>
import {websocket} from "@/mixins/handleWebSocket";
import {setInjectTo, InjectCardData} from "@/mixins/utils";

export default {
  name: "InjectForm",
  mounted() {
    function inject() {
      let card_to_inject_qs = document.querySelector('input[name="playerCardToggleGroup"]:checked')
      let target_qs = document.querySelector('input[name=discardedCardToggleGroup]:checked')

      if(card_to_inject_qs == null || target_qs == null)
        return

      let card_to_inject = parseInt(card_to_inject_qs.value)
      let target = target_qs.value.split("_")
      let player_to = parseInt(target[0])
      let group_to = parseInt(target[1])
      let position_to = parseInt(target[2])

      card_to_inject_qs.checked = false
      target_qs.checked = false

      setInjectTo(new InjectCardData(card_to_inject, player_to, group_to, position_to))

      websocket.send(JSON.stringify({
        "cmd": "inject",
        "card_to_inject": card_to_inject,
        "player_to": player_to,
        "group_to": group_to,
        "position_to": position_to
      }))
    }

    function no_inject() {
      websocket.send(JSON.stringify({"cmd": "no_inject"}))
    }

    document.getElementById("btn_inject").onclick = inject
    document.getElementById("btn_no_inject").onclick = no_inject

  }
}
</script>

<style scoped>

</style>