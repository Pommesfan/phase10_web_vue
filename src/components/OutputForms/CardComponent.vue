<template>
  <canvas height="150" width="100" v-bind:id="id"></canvas>
</template>

<script>
import {CARD_HIGHT, CARD_WIDTH} from "@/mixins/utils";

export default {
  name: "CardComponent",
  props: ["card", "id"],
  mounted() {
    if(this.card == null || this.id == null) {
      return;
    }
    let c = document.getElementById(this.id)
    if(c == null) {
      return
    }

    let color = this.card.color
    let number = this.card.value

    function getColor() {
      switch (color) {
        case 1:
          return "red"
        case 2:
          return "yellow"
        case 3:
          return "blue"
        case 4:
          return "green"
      }
    }
    if (typeof color == 'number') {
      color = getColor(color)
    }

    c.width = CARD_WIDTH
    c.height = CARD_HIGHT
    const ctx = c.getContext("2d");

    function wave(ax,ay,bx,by,cx,cy,dx,dy,w) {
      ctx.beginPath()
      ctx.moveTo(bx,by)
      ctx.bezierCurveTo(cx/3, by+w, cx/3*2, by, cx, cy-w)
      ctx.lineTo(dx, dy)
      ctx.lineTo(ax,ay)
      ctx.closePath()
      ctx.fill()
    }

    function cutEdge(ax, ay, bx, by, cx, cy) {
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.lineTo(cx, cy)
      ctx.arcTo(bx, by, ax, ay, CARD_WIDTH / 5)
      ctx.closePath()
      ctx.fill()
    }

    function shadowColor() {
      switch (color) {
        case "red": return "orangered"
        case "yellow": return "lemonchiffon"
        case "blue": return "deepskyblue"
        case "green": return "lawngreen"
      }
      return ""
    }

    function digitColor() {
      switch (color) {
        case "red": return "firebrick"
        case "yellow": return "gold"
        case "blue": return "darkblue"
        case "green": return "darkgreen"
      }
      return ""
    }

    ctx.fillStyle = "ivory"
    ctx.fillRect(0,0, CARD_WIDTH, CARD_HIGHT)
    ctx.fillStyle = color

    ctx.shadowColor = shadowColor();
    ctx.shadowBlur = CARD_WIDTH / 6.66;
    //upper wave
    wave(0,0,0,CARD_HIGHT / 5, CARD_WIDTH,CARD_HIGHT / 5, CARD_WIDTH, 0, CARD_WIDTH / 6.66)
    //bottom wave
    wave(0,CARD_HIGHT, 0,CARD_HIGHT / 5 * 4, CARD_WIDTH,CARD_HIGHT / 5 * 4, CARD_WIDTH, CARD_HIGHT, CARD_WIDTH / 6.66)
    ctx.shadowBlur = 0;

    ctx.fillStyle = digitColor()

    let font_size = CARD_WIDTH / 1.5625
    ctx.font = font_size + "px serif"
    let number_y = CARD_HIGHT / 2 + CARD_WIDTH / 4
    if(number < 10) {
      ctx.fillText(number.toString(), CARD_WIDTH / 3.125, number_y)
    } else {
      ctx.fillText(number.toString(), CARD_WIDTH / 10, number_y)
    }

    ctx.fillStyle = "white"
    cutEdge(0,CARD_WIDTH / 4, 0,0, CARD_WIDTH / 4,0)
    cutEdge(CARD_WIDTH,CARD_WIDTH / 4,CARD_WIDTH,0, CARD_WIDTH / 4 * 3, 0)
    cutEdge(0,CARD_HIGHT / 6 * 5,0,CARD_HIGHT,CARD_WIDTH / 4, CARD_HIGHT)
    cutEdge(CARD_WIDTH, CARD_HIGHT / 6 * 5, CARD_WIDTH, CARD_HIGHT, CARD_WIDTH / 4 * 3, CARD_HIGHT)
  }
}

</script>

<style scoped>

</style>