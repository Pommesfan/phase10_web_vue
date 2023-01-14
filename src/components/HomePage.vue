<template>
  <body>
  <div id="phase10navbar">
    <nav id="phase10navbar" class="navbar navbar-expand-lg navbar-light bg-light">
      <phase10nav selected="game"></phase10nav>
    </nav>
  </div>
  <h1>Phase 10</h1>
  <p class = "jumbo"> Phase10 ist ein Kartenspiel, bei dem man 10 verschiedene Kombinationen von Karten(Phasen) erfüllen muss.</p>
  <br>
  <div class="nameInput">
    <div class="container">
      <div class="row">
        <div class="col-lg-10">
          <picture>
            <source media="(min-width:400px)" src=Phase10Logo>
            <img class="picture" src="@/assets/Phase10-Logo.png" alt="" style="width: auto;">
          </picture>
        </div>
        @* </div>*@
      <div class="col-lg-2">
        <div class="name">
          <div class="player">
            <label for="p1">Player 1:</label>
            <br>
            <input type="text" id="p1" name="p1" value="">

          </div>
          <div class="p2">
            <label for="p2">Player 2:</label>
            <br>
            <input type="text" id="p2" name="p2" value="">

          </div>
          <div class="p3">
            <label for="p3">Player 3:</label>
            <br>
            <input type="text" id="p3" name="p3" value="">

          </div>
          <div class="p4">
            <label for="p4">Player 4:</label>
            <br>
            <input type="text" id="p4" name="p4" value="">
          </div>
          <button id="submit_player_names" type="submit" class="btn btn-primary">Starten</button>

          <div class="admission">
            <label for = "admission_name">Beitritt:</label>
            <br>
            <input type="text" id="admission_name" value="">
          </div>
          <button id="submit_admission" type="submit" class="btn btn-primary">Starten</button>
        </div>
      </div>
    </div>
  </div>
  <ul class="nav">
    <li class="nav-item">
      <router-link to="/help"> Hilfeseite </router-link>
    </li>
    <li class="nav-item">
      <router-link to="/about"> Über Phase </router-link>
    </li>
  </ul>

  </body>
</template>

<script>
export default {
  name: "HomePage",
  props: {
    msg: String
  }
}
</script>

<style scoped>

</style>