<template>
  <div class="hello">
    <h1>About page</h1>
    <h3>Coming soon...</h3>
    <h4>Interests</h4>
    <ul>
      <li>My wife Sarah</li>
      <li>Surfing</li>
      <li>Snowboarding</li>
      <li>Anime</li>
      <li>Rugby</li>
      <li>Football</li>
      <li>Smash Bros</li>
      <li>My cats Bruce and Simon</li>
    </ul>

  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      msg: 'This is the about page'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2, h3, h4 {
  font-weight: normal;
  color:rgb(89,144,212);
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
  color:rgb(89,144,212);
}
a {
  color: #42b983;
}
p{
  color:rgb(89,144,212);
}
</style>
