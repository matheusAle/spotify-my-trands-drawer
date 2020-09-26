<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>

export default {
  created() {
    if (this.$store.state.isAuthorized) {
      this.$router.replace('/app')
    }
  }
}
</script>
<style lang="scss">
@import "reset-css/reset";
@import "@/vars";
@import "./assets/icons/css/fontello.css";
@import "@/responsive-mixin";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: $color-darker;
  height: 100vh;
  perspective: 210px;
  perspective-origin: 50% 50%;
  font-size: 13px;
  overflow: hidden;

  @include min-sm {
    font-size: 18px;
  }

  * {
    box-sizing: border-box !important;
  }
}
</style>
