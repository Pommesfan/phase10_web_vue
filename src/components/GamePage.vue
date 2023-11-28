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
                  <CardComponent :card="newCardObj" :id="'newCard'" :key="newCardObj"></CardComponent>
                </div>
                <div class="col-3">
                  Offenliegende Karte:<br>
                  <CardComponent :card="openCardObj" :id="'openCard'" :key="openCardObj"></CardComponent>
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
import {get_player_name, selectedPlayerCard, switchMode} from "@/mixins/utils"
import PlayerCards from "@/components/OutputForms/PlayerCards";
import DiscardedCards from "@/components/OutputForms/DiscardedCards.vue";
import router from "@/router";
import CardComponent from "@/components/OutputForms/CardComponent.vue";

export default {
  name: "GamePage",
  components: {CardComponent, DiscardedCards, PlayerCards, DiscardForm, InjectForm, SwitchCardForm, NavBar},
  data() {
    return {
      playerCards: [],
      checkboxesPlayerCards: 0,
      radioButtonsPlayerCards: false,
      cardGroupSize: 0,
      discardedCards: [],
      radioButtonsDiscardedCards: false,
      newCardObj: null,
      openCardObj:null
    }
  },
  mounted() {
    var newCard = null
    var openCard = null

    if(sessionStorage.getItem("thisPlayer") == null) {
      router.push({path : "/"})
    }

    const GamePageRef = this
    connectWebSocket(update)

    const inputFormSwitch = document.getElementById("inputFormSwitch")
    const inputFormDiscard = document.getElementById("inputFormDiscard")
    const inputFormInject = document.getElementById("inputFormInject")
    const new_open_div = document.getElementById("new_open_div")

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

    function turnEnded() {
      inputFormSwitch.hidden = true
      inputFormDiscard.hidden = true
      inputFormInject.hidden = true
      new_open_div.hidden = true
    }

    function playersTurn(data) {
      newCard = data['newCard']
      openCard = data['openCard']

      GamePageRef.newCardObj = newCard
      GamePageRef.openCardObj = openCard
      GamePageRef.radioButtonsPlayerCards = true

      inputFormSwitch.hidden = false
      inputFormDiscard.hidden = true
      inputFormInject.hidden = true
      new_open_div.hidden = false
    }

    function goToDiscard() {
      GamePageRef.playerCards[selectedPlayerCard] = switchMode == "new" ? newCard : openCard
      GamePageRef.radioButtonsPlayerCards = false
      inputFormSwitch.hidden = true
      inputFormDiscard.hidden = false
      new_open_div.hidden = true
    }

    function goToInject() {
      inputFormSwitch.hidden = true
      inputFormInject.hidden = false
      new_open_div.hidden = true
    }

    function newGame(data) {
      GamePageRef.playerCards = data['cardStash']
      GamePageRef.cardGroupSize = data['card_group_size']

      let msg = "Neues Spiel\nPhase " + data['numberOfPhase'] + ": " + data['phaseDescription'] + "\n\nSpieler:"
      let names = data['players']
      const len = data['numberOfPlayers']
      for(let i = 0; i < len; i++) {
        sessionStorage.setItem("player_" + i, names[i])
        msg += "\n" + names[i]
      }
      sessionStorage.setItem("number_of_players", len)

      alert(msg)
    }

    function gameEnded(data) {
      let msg = "Spieler " + data['winningPlayer'] + " hat gewonnen\n"

      const length = sessionStorage.getItem("number_of_players")
      const phases = data['phases']
      const errorPoints = data['errorPoints']

      for(let i = 0; i < length; i++) {
        const player = sessionStorage.getItem("player_" + i)
        msg += "\n" + player + ": Phase " + phases[i] + "; " + errorPoints[i] + " Fehlerpunkte"
      }

      alert(msg)
      sessionStorage.clear()
      router.push({path : "/"})
    }

    function update(data) {
      let event = data['event']
      if (event == "GoToDiscardEvent") {
        goToDiscard(data)
      } else if(event == "NewRoundEvent") {
        alert(new_round_message(data))
      } else if(event == "TurnEndedEvent") {
        turnEnded(data)
      } else if(event == "PlayersTurnEvent") {
        alert("Du bist dran!")
        playersTurn(data)
      } else if (event == "GoToInjectEvent") {
        goToInject(data)
      }  else if (event == "NewGameEvent") {
        newGame(data)
      } else if(event == "GameEndedEvent") {
        gameEnded(data)
      }
    }
  }
}

</script>

<style scoped>

</style>