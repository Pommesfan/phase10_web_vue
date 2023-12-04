<template>
  <div>
    <div id="phase10navbar">
      <nav id="phase10navbar" class="navbar navbar-expand-lg navbar-light bg-light">
        <NavBar></NavBar>
      </nav>
    </div>

    <div class="container-fluid">
          <div id="discardedCards" class="row">
            <DiscardedCards :key="discardedCards" :cards="discardedCards" :showRadioButtons="radioButtonsDiscardedCards"></DiscardedCards>
          </div>
          <div class="crow-100">
            <div>
              <p id="currentPlayerAndPhase"></p><br>
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
</template>

<script>
import NavBar from "@/components/NavBar";
import SwitchCardForm from "@/components/InputForms/SwitchCardForm";
import InjectForm from "@/components/InputForms/InjectForm";
import DiscardForm from "@/components/InputForms/DiscardForm";
import {connectWebSocket} from "@/mixins/handleWebSocket";
import {
  get_player_name, inverted_idx_list, map_cards, discardedCardIndices, selectedPlayerCard, setDiscardedCardIndices,
  switchMode, setSelectedPlayerCard, injectTo, setInjectTo, INJECT_AFTER, INJECT_TO_FRONT, sort_cards, str_thisPlayer,
  str_number_of_players, str_thisPlayerIdx, OPEN_CARD, NEW_CARD
} from "@/mixins/utils"
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
    if(sessionStorage.getItem(str_thisPlayer) == null) {
      router.push({path : "/"})
      return
    }

    const GamePageRef = this
    connectWebSocket(update)

    const inputFormSwitch = document.getElementById("inputFormSwitch")
    const inputFormDiscard = document.getElementById("inputFormDiscard")
    const inputFormInject = document.getElementById("inputFormInject")
    const new_open_div = document.getElementById("new_open_div")

    function load_discarded_cards() {
      //copy player cards as discarded
      let discarded_card_current_player = []
      for(let i = 0; i < discardedCardIndices.length; i++) {
        let indices = discardedCardIndices[i]
        let cardGroup = []
        for(let j = 0; j < indices.length; j++) {
          let idx = indices[j]
          cardGroup.push(GamePageRef.playerCards[idx])
        }
        discarded_card_current_player.push(sort_cards(cardGroup))
      }
      GamePageRef.discardedCards[sessionStorage.getItem(str_thisPlayerIdx)] = discarded_card_current_player

      //remove player cards
      let playerCardIndices = inverted_idx_list(10, discardedCardIndices.flat())
      GamePageRef.playerCards = map_cards(playerCardIndices, GamePageRef.playerCards)
      setDiscardedCardIndices([])
    }

    function load_injected_card() {
      let idx = injectTo.playerCard
      let card = GamePageRef.playerCards[idx]
      let stashTo = GamePageRef.discardedCards[injectTo.playerTo][injectTo.groupTo]
      let position_to = injectTo.positionTo
      if(position_to == INJECT_TO_FRONT) {
        stashTo.unshift(card)
      } else if(position_to == INJECT_AFTER) {
        stashTo.push(card)
      }
      setInjectTo(null)
      let inverted_idx = inverted_idx_list(GamePageRef.playerCards.length, [idx])
      GamePageRef.playerCards = map_cards(inverted_idx, GamePageRef.playerCards)
    }

    function load_new_open() {
      if(switchMode  == NEW_CARD) {
        GamePageRef.playerCards[selectedPlayerCard] = GamePageRef.newCardObj
      } else if (switchMode == OPEN_CARD) {
        GamePageRef.playerCards[selectedPlayerCard] = GamePageRef.openCardObj
      }
    }

    function turnEnded(data) {
      fullLoad(data)
      let success = data['success']
      if(success) {
        if (discardedCardIndices.length > 0) {
          load_discarded_cards()
        }
      } else {
        setInjectTo(null)
        alert("Ungültiger Spielzug")
      }
      GamePageRef.checkboxesPlayerCards = 0
      GamePageRef.radioButtonsDiscardedCards = false
      GamePageRef.radioButtonsPlayerCards = false

      inputFormSwitch.hidden = true
      inputFormDiscard.hidden = true
      inputFormInject.hidden = true
      new_open_div.hidden = true
    }

    function playersTurn(data) {
      fullLoad(data)
      GamePageRef.newCardObj = data['newCard']
      GamePageRef.openCardObj = data['openCard']
      GamePageRef.radioButtonsPlayerCards = true

      inputFormSwitch.hidden = false
      inputFormDiscard.hidden = true
      inputFormInject.hidden = true
      new_open_div.hidden = false
    }

    function goToDiscard(data) {
      fullLoad(data)
      GamePageRef.radioButtonsPlayerCards = false
      GamePageRef.checkboxesPlayerCards = GamePageRef.cardGroupSize
      load_new_open()
      inputFormSwitch.hidden = true
      inputFormDiscard.hidden = false
      new_open_div.hidden = true
    }

    function goToInject(data) {
      fullLoad(data)
      GamePageRef.radioButtonsDiscardedCards = true
      GamePageRef.radioButtonsPlayerCards = true

      if(selectedPlayerCard != null) {
        load_new_open()
        setSelectedPlayerCard(null)
      }

      if(injectTo != null) {
        load_injected_card()
      }

      inputFormSwitch.hidden = true
      inputFormInject.hidden = false
      new_open_div.hidden = true
    }

    function loadPlayers(data) {
      if(sessionStorage.getItem(str_number_of_players) != null)
        return
      let names = data['players']
      const numberOfPlayers = data['numberOfPlayers']
      const thisPlayer = sessionStorage.getItem(str_thisPlayer)
      for(let i = 0; i < numberOfPlayers; i++) {
        sessionStorage.setItem("player_" + i, names[i])
        if(names[i] == thisPlayer)
          sessionStorage.setItem(str_thisPlayerIdx, i)
      }
      sessionStorage.setItem(str_number_of_players, numberOfPlayers)
    }

    function newGameMessage(data) {
      let msg = "Neues Spiel\nPhase " + data['numberOfPhase'][0] + ": " + data['phaseDescription'][0] + "\n\nSpieler:"
      const numberOfPlayers = sessionStorage.getItem(str_number_of_players)
      for(let i = 0; i < numberOfPlayers; i++) {
        let name = get_player_name(i)
        msg += "\n" + name
      }
      alert(msg)
    }

    function newGame(data) {
      loadPlayers(data)
      setPhaseAndPlayers(data)
      GamePageRef.playerCards = data['cardStash']
      GamePageRef.cardGroupSize = data['card_group_size']
      newGameMessage(data)
    }

    function new_round(data) {
      setPhaseAndPlayers(data)
      const number_of_players= sessionStorage.getItem(str_number_of_players)
      GamePageRef.discardedCards = new Array(parseInt(number_of_players)).fill(null)
      GamePageRef.playerCards = data['cardStash']
      GamePageRef.cardGroupSize = data['card_group_size']

      let s = "Neue Runde:"
      const errorPoints = data['errorPoints']
      const number_of_phase = data['numberOfPhase']
      const phase_description = data['phaseDescription']
      for(let i = 0; i < number_of_players; i++) {
        s += ("\n" + get_player_name(i) + ": " + errorPoints[i] + " Fehlerpunkte; Phase: " + number_of_phase[i] + ": " + phase_description[i])
      }
      alert(s)
    }

    function gameEnded(data) {
      //Message
      let msg = "Spieler " + data['winningPlayer'] + " hat gewonnen\n"

      const length = sessionStorage.getItem(str_number_of_players)
      const phases = data['phases']
      const errorPoints = data['errorPoints']

      for(let i = 0; i < length; i++) {
        const player = get_player_name(i)
        msg += "\n" + player + ": Phase " + phases[i] + "; " + errorPoints[i] + " Fehlerpunkte"
      }

      alert(msg)
      sessionStorage.clear()
      router.push({path : "/"})
    }

    function playerHasDiscarded(data) {
      const playerTo = data['player']
      GamePageRef.discardedCards[playerTo] = data['cards']
    }

    function playerHasInjected(data) {
      let idxPlayerTo = data["playerTo"]
      let idxStashTo = data["stashTo"]
      let position = data["position"]
      let card = data["card"]

      let stashTo = GamePageRef.discardedCards[idxPlayerTo][idxStashTo]
      if (position == INJECT_TO_FRONT) {
        stashTo.unshift(card)
      } else if(position == INJECT_AFTER) {
        stashTo.push(card)
      }
    }

    function setPhaseAndPlayers(data) {
      let idx_player = parseInt(sessionStorage.getItem(str_thisPlayerIdx))
      let currentPlayer = sessionStorage.getItem(str_thisPlayer)
      let n = data['numberOfPhase'][idx_player]
      let description = data['phaseDescription'][idx_player]
      document.getElementById("currentPlayerAndPhase").innerHTML =
          "Aktueller Spieler: " + currentPlayer + "; Phase " + n + ": " + description
    }

    function fullLoad(data) {
      if(data['fullLoad']) {
        GamePageRef.playerCards = data['cardStash']
        GamePageRef.discardedCards = data['discardedStash']
        GamePageRef.cardGroupSize = data['card_group_size']
        loadPlayers(data)
        setPhaseAndPlayers(data)
      }
    }

    function update(data) {
      let event = data['event']
      if (event == "GoToDiscardEvent") {
        goToDiscard(data)
      } else if(event == "NewRoundEvent") {
        new_round(data)
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
      }  else if(event == "PlayerHasDiscarded") {
        playerHasDiscarded(data)
      } else if(event == "PlayerHasInjected") {
        playerHasInjected(data)
      }
    }
  }
}

</script>

<style scoped>

</style>