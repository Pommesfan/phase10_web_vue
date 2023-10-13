<template>
  <div>
    <div id="phase10navbar">
      <nav id="phase10navbar" class="navbar navbar-expand-lg navbar-light bg-light">
        <NavBar></NavBar>
      </nav>
    </div>

    <div class="container-fluid">
      <div class="row">
        <form id="cardstash">
          <div id="discardedCards" class="row w-100">
            <DiscardedCards :key="discardedCards" :cards="discardedCards" :showRadioButtons="radioButtonsDiscardedCards"></DiscardedCards>
          </div>
          <div class="crow-100">
            <div>
              Aktueller Spieler: <p id="currentPlayer"></p><br>
              <div class="row" id="new_open_div" hidden>
                <div class="col-3">
                  Neue Karte:<br>
                  <canvas height="150" width="100" id='newCard'></canvas>
                </div>
                <div class="col-3">
                  Offenliegende Karte:<br>
                  <canvas height="150" width="100" id='openCard'></canvas>
                </div>
              </div>
              Karten des Spielers:<br><br>
              <PlayerCards :key="playerCards" :cards=playerCards :checkboxes=checkboxesPlayerCards :show-radio-buttons=radioButtonsPlayerCards></PlayerCards>
            </div>
          </div>
        </form>
      </div>
      <div class="row">
        <div class="col-xl-6">
          <div id="inputFormSwitch" hidden>
            <SwitchCardForm></SwitchCardForm>
          </div>
          <div id="inputFormDiscard" hidden>
            <DiscardForm></DiscardForm>
          </div>
          <div id="inputFormInject" hidden>
            <InjectForm></InjectForm>
          </div>
          <br>

          <!-- Button trigger modal -->
          <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#resetModal">
            Reset Game &#8634;
          </button>

          <!-- Modal -->
          <div class="modal fade" id="resetModal" tabindex="-1" role="dialog" aria-labelledby="resetModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document" >
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="resetModalLabel">Are you sure?</h5>
                </div>
                <div class="modal-body">
                  Do you really want to reset the game?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <form id="reset_form" action="/reset">
                    <input type="submit" class="btn btn-outline-warning" value="Reset">
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import SwitchCardForm from "@/components/InputForms/SwitchCardForm";
import InjectForm from "@/components/InputForms/InjectForm";
import DiscardForm from "@/components/InputForms/DiscardForm";
import {connectWebSocket} from "@/mixins/handleWebSocket";
import {drawCard, get_player_name} from "@/mixins/utils"
import PlayerCards from "@/components/OutputForms/PlayerCards";
import DiscardedCards from "@/components/OutputForms/DiscardedCards.vue";
import router from "@/router";

export default {
  name: "GamePage",
  components: {DiscardedCards, PlayerCards, DiscardForm, InjectForm, SwitchCardForm, NavBar},
  data() {
    return {
      playerCards: [],
      checkboxesPlayerCards: 0,
      radioButtonsPlayerCards: false,
      cardGroupSize: 0,
      discardedCards: [],
      radioButtonsDiscardedCards: false
    }
  },
  mounted() {
    if(sessionStorage.getItem("thisPlayer") == null) {
      router.push({path : "/"})
    }

    const GamePageRef = this
    connectWebSocket(update)

    function show_player_cards(cards, number_checkboxes, show_radio_buttons, cardGroupSize) {
      GamePageRef.playerCards = cards
      GamePageRef.checkboxesPlayerCards = number_checkboxes
      GamePageRef.radioButtonsPlayerCards = show_radio_buttons
      GamePageRef.cardGroupSize = cardGroupSize
    }

    function discarded_cards(cardStashes, show_radio_buttons) {
      GamePageRef.discardedCards = cardStashes
      GamePageRef.radioButtonsDiscardedCards = show_radio_buttons
    }

    function new_round_message(data) {
      let s = "Neue Runde:"
      const errorPoints = data['errorPoints']
      const number_of_phase = data['numberOfPhase']
      const phase_description = data['phaseDescription']
      for(let i = 0; i < sessionStorage.getItem("number_of_players"); i++) {
        s += ("\n" + get_player_name(i) + ": " + errorPoints[i] + " Fehlerpunkte; Phase: " + number_of_phase[i] + ": " + phase_description[i])
      }
      return s
    }

    function turnEnded(data) {
      show_player_cards(data['cardStash'], 0, false, data['card_group_size'])
      discarded_cards(data['discardedStash'], false)
      document.getElementById("inputFormSwitch").hidden = true
      document.getElementById("inputFormDiscard").hidden = true
      document.getElementById("inputFormInject").hidden = true
      document.getElementById("new_open_div").hidden = true
    }

    function playersTurn(data) {
      show_player_cards(data['cardStash'], 0, true, data['card_group_size'])
      discarded_cards(data['discardedStash'], false)

      let newCard = data['newCard']
      let openCard = data['openCard']
      let newCardCanvas = document.getElementById("newCard")
      let openCardCanvas = document.getElementById("openCard")

      drawCard(newCard.value, newCard.color, newCardCanvas)
      drawCard(openCard.value, openCard.color, openCardCanvas)

      document.getElementById("currentPlayer").innerHTML = get_player_name(data['activePlayer'])

      document.getElementById("inputFormSwitch").hidden = false
      document.getElementById("inputFormDiscard").hidden = true
      document.getElementById("inputFormInject").hidden = true
      document.getElementById("new_open_div").hidden = false
    }

    function goToDiscard(data) {
      show_player_cards(data['cardStash'], data['card_group_size'], false, data['card_group_size'])
      document.getElementById("inputFormSwitch").hidden = true
      document.getElementById("inputFormDiscard").hidden = false
      document.getElementById("new_open_div").hidden = true
    }

    function goToInject(data) {
      document.getElementById("inputFormSwitch").hidden = true
      document.getElementById("inputFormInject").hidden = false
      show_player_cards(data['cardStash'], 0, true, 0)
      discarded_cards(data['discardedStash'], true)
      document.getElementById("new_open_div").hidden = true
    }

    function newGame(data) {
      let msg = "Neues Spiel\nPhase " + data['numberOfPhase'] + ": " + data['phaseDescription'] + "\nSpieler:"

      let names = data['players']
      const len = data['numberOfPlayers']
      for(let i = 0; i < len; i++) {
        sessionStorage.setItem("player_" + i, names[i])
        msg += "\n" + names[i]
      }
      sessionStorage.setItem("number_of_players", len)

      alert(msg)
    }

    function update(data) {
      let event = data['event']
      if (event == "GoToDiscardEvent") {
        goToDiscard(data)
      } else if(event == "NewRoundEvent") {
        alert(new_round_message(data))
      } else if(data['event'] == "TurnEndedEvent") {
        turnEnded(data)
      } else if(data['event'] == "PlayersTurnEvent") {
        alert("Du bist dran!")
        playersTurn(data)
      } else if (event == "GoToInjectEvent") {
        goToInject(data)
      }  else if (event == "NewGameEvent") {
        newGame(data)
      }
    }
  }
}

</script>

<style scoped>

</style>