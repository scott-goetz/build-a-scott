<template>
  <main role="main" id="build" class="page-wrapper">
    <div class="section-column">
      <FaceMachine v-bind:faces="faces" version="a"/>
    </div>
    <div class="section-column">
      <div class="content">
        <h1 class="headline">Build a Scott</h1>
        <h2 class="tagline">
          The perfect Scott,
          <span class="underline">every</span> time.
          <sup>&trade;</sup>
        </h2>
        <hr>
        <p>Does your Scott have the strong jaw of a Sinclair and the silver-foxiness of a King? Or maybe he's got the piercing eyes of an Ingalls, the Rasputin-esque beard of a Goetz, the broad shoulders of a Lygo, and the wise forehead of a Hughes? It’s up to you.</p>
        <p>Just swipe back and forth and make your own!</p>
        <a class="button margin-bottom icn icn-random" ng-click="randomize()">Randomize</a>
        <a
          class="button alt full icn icn-download"
          download="perfect-scott.png"
          v-on:click="downloadImage()"
        >I love him. I want to export him.</a>
        <a href="fonts/Scont.otf" class="button alt full icn icn-font">Download the Scott font</a>
      </div>
    </div>
  </main>
</template>

<script>
import FaceMachine from './FaceMachine/FaceMachine.vue';

export default {
  name: 'Build',
  props: {
    faces: Array
  },
  components: {
    FaceMachine
  },
  methods: {
    downloadImage() {
      console.info('DOWNLOAD IMAGE');
    }
  }
};
</script>

<style lang="scss">
#build {
}
</style>
