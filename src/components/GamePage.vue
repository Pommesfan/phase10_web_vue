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
          <div class="col w-100">
            <div id="discardedCards">
            </div>
          </div>
          <div class="col">
            <div>
              Aktueller Spieler: <p id="currentPlayer"></p><br>
              <div class="row">
                <div class="col-3">
                  Neue Karte:<br>
                  <p id="newCard"></p><br>
                </div>
                <div class="col-3">
                  Offenliegende Karte:<br>
                  <p id="openCard"></p><br>
                </div>
              </div>
              Karten des Spielers:<br><br>
              <div id="playerCards">
              </div>
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
import {drawCard} from "@/mixins/utils"

export default {
  name: "GamePage",
  components: {DiscardForm, InjectForm, SwitchCardForm, NavBar},
  mounted() {
    connectWebSocket(update)

    function get_player_name(idx) {
      return sessionStorage.getItem("player_" + idx)
    }

    function show_player_cards(cards, show_checkboxes, show_radio_buttons, cardGroupSize) {
      let playerCardsDiv = document.getElementById("playerCards")
      playerCardsDiv.innerHTML = ""
      let rowDiv = document.createElement("div")
      rowDiv.setAttribute("class", "row")
      for (let i = 0; i < cards.length; i++) {
        let colDiv = document.createElement("div")
        colDiv.setAttribute("class", "col")
        colDiv.appendChild(drawCard(cards[i]['value'], cards[i]['color']))
        colDiv.appendChild(document.createElement("br"))
        if(show_radio_buttons) {
          colDiv.appendChild(radio_buttons_player_cards(i))
        }
        if(show_checkboxes) {
          checkboxes(i, cardGroupSize, colDiv)
        }
        rowDiv.appendChild(colDiv)
      }
      playerCardsDiv.appendChild(rowDiv)
    }

    function checkboxes(i, cardGroupSize, colDiv) {
      for (let j = 0; j < cardGroupSize; j++) {
        let checkbox = document.createElement("input")
        checkbox.setAttribute("class", "form-check-input")
        checkbox.type = "checkbox"
        checkbox.id = "inlineCheckbox" + j + "_" + i
        colDiv.appendChild(checkbox)
      }
    }

    function radio_buttons_player_cards(i) {
      let radioButton = document.createElement("input")
      radioButton.id = "selected_player_card_" + i
      radioButton.type="radio"
      radioButton.name="card_index"
      radioButton.value=i
      return radioButton
    }

    function radio_buttons_discarded_Cards(i,j,position) {
      let radioButton = document.createElement("input")
      radioButton.type = "radio"
      radioButton.name = "inject_to"
      radioButton.value = i + "_" + j + "_" + position
      return radioButton
    }

    function discarded_cards(cardStashes, show_radio_buttons) {
      let discardedCardsDiv = document.getElementById("discardedCards")
      discardedCardsDiv.innerHTML = ""
      for (let i = 0; i < cardStashes.length; i++) {
        let textView = document.createElement("p")
        textView.innerHTML = get_player_name(i)
        discardedCardsDiv.appendChild(textView)
        let cardGroups = cardStashes[i]
        if (cardGroups == null) {
          let textView2 = document.createElement("p")
          textView2.innerHTML = "Keine Karten"
          discardedCardsDiv.appendChild(textView2)
        } else {
          for(let j = 0; j < cardGroups.length; j++) {
            let cards = cardGroups[j]

            if(show_radio_buttons) {
              discardedCardsDiv.appendChild(radio_buttons_discarded_Cards(i,j,"AFTER"))
            }

            for (let c in cards) {
              let card = cards[c]
              let cardView = drawCard(card['value'], card['color'])
              discardedCardsDiv.appendChild(cardView)
            }

            if(show_radio_buttons) {
              discardedCardsDiv.appendChild(radio_buttons_discarded_Cards(i,j,"AFTER"))
            }
          }
        }
      }
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
      show_player_cards(data['cardStash'], false, true, data['card_group_size'])
      document.getElementById("inputFormSwitch").hidden = true
      document.getElementById("inputFormDiscard").hidden = true
      document.getElementById("inputFormInject").hidden = true
    }

    function playersTurn(data) {
      show_player_cards(data['cardStash'], false, true, data['card_group_size'])
      discarded_cards(data['discardedStash'], false)

      let newCard = data['newCard']
      let openCard = data['openCard']
      let newCardDiv = document.getElementById("newCard")
      let openCardDiv = document.getElementById("openCard")
      newCardDiv.innerHTML = ""
      openCardDiv.innerHTML = ""
      newCardDiv.appendChild(drawCard(newCard['value'], newCard['color']))
      openCardDiv.appendChild(drawCard(openCard['value'], openCard['color']))

      document.getElementById("currentPlayer").innerHTML = get_player_name(data['activePlayer'])
      document.getElementById("inputFormSwitch").hidden = false
      document.getElementById("inputFormDiscard").hidden = true
      document.getElementById("inputFormInject").hidden = true
    }

    function goToDiscard(data) {
      show_player_cards(data['cardStash'], true, false, data['card_group_size'])
      document.getElementById("inputFormSwitch").hidden = true
      document.getElementById("inputFormDiscard").hidden = false
    }

    function goToInject(data) {
      document.getElementById("inputFormSwitch").hidden = true
      document.getElementById("inputFormInject").hidden = false
      show_player_cards(data['cardStash'], false, true, 0)
      discarded_cards(data['discardedStash'], true)
    }

    function update(data) {
      let event = data['event']
      if(event == "sendPlayerNames") {
        let names = data['players']
        for(let i = 0; i < data['length']; i++) {
          sessionStorage.setItem("player_" + i, names[i])
        }
      }
      if (event == "GoToDiscardEvent") {
        goToDiscard(data)
      } else if(event == "NewRoundEvent") {
        turnEnded(data)
        alert(new_round_message(data))
      } else if(data['event'] == "TurnEndedEvent") {
        turnEnded(data)
      } else if(data['event'] == "PlayersTurnEvent") {
        alert("Du bist dran!")
        playersTurn(data)
      } else if (event == "GoToInjectEvent") {
        goToInject(data)
      } else if (event == "GameStartedEvent") {
        playersTurn(data)
        alert(new_round_message(data))
      }
    }
  }
}

</script>

<style scoped>

</style>