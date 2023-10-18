<template>
  <body>
  <div class="text">
    <h1>Hilfe zu Phase 10</h1>
    <div class="look">
      <h2>Was sehe ich:</h2>
      <p>
        Oben werden die abgelegten Karten (die Phasen) der Spieler angezeigt
        <br> Als nächstes wird der aktuelle Spieler, also der Spieler, der gerade am Zug ist, angezeigt.
        <br> Dann kommen die Karten, die man ziehen könnte. Entweder die neue Karte oder die offenliegende Karte vom Spieler davor.
        <br> Zum Schluss kommen noch die Karten vom aktuellen Spieler.
      </p>
    </div>
    <div class="buttons">
      <h2>Wofür sind die Buttons:</h2>
      <ul>
        <li>Radiobutton: Damit kann ausgewählt werden, welche Karte abgelegt/weggeschmissen werden soll.</li>
        <li>Checkbox: Hier werden diejenigen Karten ausgewählt, die man als Phase ablegen will.
          Jede Karte hat so viele Checkboxen wie Gruppierungen. Z.B. Drilling und Viererfolge sind zwei Gruppierungen.
          Für den Drilling müssen die abzulegenden Karten mit den ersten Checkboxen und für die Viererfolge
          mit den zweiten Checkboxen ausgewählt werden.</li>
      </ul>
    </div>
    <div class="game">
      <h2>Wie kann ich jetzt spielen:</h2>
      <p>
        Man wählt die Karte mittels Radiobutton aus, die ausgetauscht werden soll, dann drückt man entweder den "Neue Karte" oder "Offenliegende Karte" Button.
        Fortsetzung folgt ...
      </p>
    </div>
  </div>
  <div>
    <button id="back_from_help" type="submit" class="btn btn-primary">Zurück</button>
  </div>
  </body>
</template>

<script>
import {back_to_home_or_game} from "@/mixins/utils";

export default {
  name: "HelpPage",
  mounted() {
    document.getElementById("back_from_help").onclick = back_to_home_or_game
  }
}
</script>

<style scoped>
  body{
    background-image: -moz-linear-gradient(to right,#1f40e5, #c71717, #1f40e5);
  }

  h1{
    border: 2mm ridge #c71717;
    background: #1f40e5;
    color: floralwhite;
  }

  .text{
    text-align: center;
    color: floralwhite;
  }

  .look{
    border: 1mm dashed #1f40e5;
    border-radius: 10mm;
  }

  .buttons{
    border: 1mm dashed #c71717;
    border-radius: 10mm;
    margin-top: 5mm;
  }

  .game{
    border: 1mm dashed #1f40e5;
    border-radius: 10mm;
    margin-top: 5mm;
  }

  a{
    text-align: left;
    color: antiquewhite;
    display: inline-block;
    margin-top: 5mm;
  }
</style>