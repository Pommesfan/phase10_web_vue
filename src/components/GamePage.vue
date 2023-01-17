<template>
  <div>
    <div id="phase10navbar">
      <nav id="phase10navbar" class="navbar navbar-expand-lg navbar-light bg-light">
        <phase10nav selected="game"></phase10nav>
      </nav>
    </div>

    <div class="container">
      <div class="row">
        <form id="cardstash">
          <div class="col w-50">
            <div id="discardedCards">
            </div>
          </div>
          <div class="col w-50">
            <div>
              Aktueller Spieler: <p id="currentPlayer"></p><br>
              Neue Karte:<br>
              <p id="newCard"></p><br>
              Offenliegende Karte:<br>
              <p id="openCard"></p><br>
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
            <label>Karte tauschen:</label><br>
            <input type="submit" id="btn_new_card" class="btn btn-success" value="Neue Karte">
            <input type="submit" id="btn_open_card" class="btn btn-success" value="Offenliegende Karte">
          </div>
          <div id="inputFormDiscard" hidden>
            <button type="submit" id="submit_discard" formaction="/discard" class="btn btn-success">Ablegen</button>
            <button type="submit" id="no_discard" class="btn btn-secondary">Nicht ablegen</button>
          </div>
          <div id="inputFormInject" hidden>
            <label>Karte anlegen:</label><br>
            <input type="submit" id="btn_inject" class="btn btn-success" value="Anlegen">
            <input type="submit" id="btn_no_inject" class="btn btn-secondary" value="Nicht anlegen">
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
export default {
  name: "GamePage"
}
</script>

<style scoped>

</style>