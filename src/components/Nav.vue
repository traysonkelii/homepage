<template>
  <div class="holder">
    <router-link to="/" class="main">Trayson Keli'i</router-link>
    <router-link to="/contact" class="section">Contact</router-link>
    <router-link to="/about" class="section">About</router-link>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  props: {
    name: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.holder{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.main{
  /* padding: 5px; */
  color: white;
  font-size: 2em;
  grid-column: 1/3;
  transition: .6s all;
  background-color: #1D3461;
  text-decoration: none;
}

.section{
  color:white;
  transition: .6s all;
  background-color: #6290C8;
  text-align: center;
  padding-top: 10px;
  text-decoration: none;
}

.section:hover, .main:hover{
  cursor: pointer;
  opacity: .8;
  transition: .6s all;
}

</style>
