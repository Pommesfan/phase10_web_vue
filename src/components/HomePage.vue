<template>
  <body>
  <div id="phase10navbar">
    <nav id="phase10navbar" class="navbar navbar-expand-lg navbar-light bg-light">
      <NavBar></NavBar>
    </nav>
  </div>
  <h1>Phase 10</h1>
  <p class = "jumbo"> Phase10 ist ein Kartenspiel, bei dem man 10 verschiedene Kombinationen von Karten(Phasen) erfüllen muss.</p>
  <br>
  <div class="nameInput">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-10">
          <picture>
            <source media="(min-width:400px)" src=Phase10Logo>
            <img class="picture" src="@/assets/Phase10-Logo.png" alt="" style="width: auto;">
          </picture>
        </div>
        @* </div>*@
      <div id=namePanel class="col-lg-2">
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

  </body>
</template>

<script>
import router from "@/router";
import NavBar from "@/components/NavBar";
export default {
  name: "HomePage",
  components: {NavBar},
  props: {
    msg: String
  },
  mounted() {
    function submit_player_names() {
      let names = []
      for(let i = 1; i <= 4; i++) {
        let name = document.getElementById("p" + i).value
        if(name.length != 0) {
          names.push(name)
        }
      }
      sessionStorage.setItem("number_of_players", names.length)
      sessionStorage.setItem("thisPlayer", names[0])
      if(names.length < 2) {
        alert("Mindestens zwei Spieler eingeben")
      } else {
        post_data('/set_players', { "length":names.length, "names": names})
      }
    }

    function submit_admission() {
      sessionStorage.setItem("thisPlayer", document.getElementById("admission_name").value)
      update()
    }

    function update() {
      router.push({path : "/game"})
    }

    document.getElementById("submit_player_names").onclick = submit_player_names
    document.getElementById("submit_admission").onclick = submit_admission

    function post_data(route, json) {
      fetch("http://localhost:9000" + route, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8080',
        },
        body: JSON.stringify(json)
      }).then(response => response.json().then(data => update(data)))
    }
  }
}
</script>

<style scoped>
  #namePanel {
    align-self: flex-end;
  }
</style>