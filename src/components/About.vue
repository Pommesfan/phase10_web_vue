<template>
  <body>
  <div class="text">
    <div class="intro">
      <h1>Phase 10</h1>
      Phase 10 ist ein Kartenspiel.
    </div>
    <div class="gameplay">
      <h2>Ablauf</h2>
      <p>
        Die Spieler müssen insgesamt 10 Phasen durchlaufen.
        In jeder Phase muss man bestimmte Kombinationen aus Karten ablegen.
        Jeder Spieler erhält 10 Karten, mit denen er versuchen muss seine Phase zu beenden.
        Der Spieler, der anfängt, zieht verdeckt eine Karte vom Stapel oder nimmt die oberste Karte des Ablagestapels.
        Wenn er nun die erforderte Phase hat, kann er sie ablegen. Am Ende eines Zuges legt man eine beliebige Karte auf den Ablagestapel.
        Jetzt ist der nächste Spieler am Zug.
      </p>
    </div>
    <div class="phase">
      <h2>Phasen:</h2>
      <ol type="1">
        <li>Zwei Drillinge</li>
        <li> Drilling & Viererfolge</li>
        <li>Vierling & Viererfolge</li>
        <li>Siebenerfolge</li>
        <li>Achterfolge</li>
        <li>Neunerfolge</li>
        <li>Zwei Vierlinge</li>
        <li>Sieben Karten einer Farbe</li>
        <li>Fünfling & Zwilling</li>
        <li>Fünfling & Drilling</li>
      </ol>
    </div>
    <div class="gameend">
      <h2>Ziel des Spiels</h2>
      <p>Der Spieler hat gewonnen der zuerst seine 10. Phase erfolgreich abgeschlossen hat. Beim zeitgleichen Abschluss
      der 10. Phase gilt, wer weniger Fehlerpunkte hat.</p>
    </div>
  </div>
  <div>
    <button id="back_from_about" type="submit" class="btn btn-primary">Zurück</button>
  </div>
  </body>
</template>

<script>
import {back_to_home_or_game} from "@/mixins/utils";

export default {
  name: "AboutPage",
  mounted() {
    document.getElementById("back_from_about").onclick = back_to_home_or_game
  }
}
</script>

<style scoped>
  body{
    background-image: -moz-linear-gradient(to right,#1f40e5, #c71717, #1f40e5);
    height: fit-content;
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

  .intro{
    margin-bottom: 20px;
  }

  .gameplay{
    border: 1mm dashed #1f40e5;
    border-radius: 10mm;
  }

  .phase{
    border: 1mm dashed #c71717;
    border-radius: 10mm;
    margin-top: 5mm;
  }

  .gameend{
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