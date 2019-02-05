<template>
  <div id="app">
    <Build v-bind:faces="faces"/>
  </div>
</template>

<script>
import Build from './components/Build.vue';

export default {
  name: 'app',
  components: {
    Build
  },
  data() {
    return {
      faces: ['goetz', 'hughes', 'ingalls', 'king', 'lygo', 'sinclair']
    };
  }
};
</script>

<style lang="scss">
#app {
  height: 100%;
  @include flexDisplay();
}
</style>
