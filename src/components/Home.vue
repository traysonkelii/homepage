<template>
  <div class="container">
    <div class="prof basic">
      <img src="../assets/me.png" alt="">
    </div>
    <div class="desc basic">
      <h1 class="title">
        <span class="typewrite" data-period="1000" data-type='[ "Hi, my name is Trayson.",
          "I am a Developer", "I love problem solving", "I enjoy design" ]'>
          <span class="wrap"></span>
        </span>
      </h1>
      <div class="panel">
        <h1>{{name}}</h1>
        <h2>{{title}}</h2>
        <p class="para">
          Aloha, my name is {{name}} and I am a Computer Science major at
          Brigham Young University. I will be graduating in {{grad}}. I am
          originally from Hawaii and I value problem solving and writing/maintaining
          clean code. Check out some of my experience below!
        </p>
      </div>
      <div class="me basic">
        <div id="linkedin">
          <h3>LinkedIn</h3>
          <img src="../assets/linkedin.png" alt="">
        </div>
        <div id="github">
          <h3>Github</h3>
          <img src="../assets/github.png" alt="">
        </div>
        <div id="resume">
          <h3>Resume</h3>
          <img src="../assets/resume1.png" alt="">
        </div>
      </div>
    </div>
    <div class="row1 basic">
      <div class="byu-pannel">
        <div class="byu-b"></div>
        <div class="byu-typer">
          <h1 class="title">
            <span class="typewrite" data-period="1000" data-type='[ "Brigham Young University"]'>
              <span class="wrap"></span>
            </span>
          </h1>
        </div>
        <div class="byu-year panel">
          <h2>August 2016 - April 2019</h2>
        </div>
        <div class="byu-title panel">
          <h2>Student Developer</h2>
        </div>
        <div class="byu-desc panel">
          <h3>
            During my education I've constantly looked for job opportunities
             relating to my major. While studying at Brigham Young University
             I have worked as a Computer Science Teachers Assistant,
             SharePoint Developer, Frontend Developer, Full-stack Developer,
             and Computer Vision Research Assistant.
          </h3>
        </div>
        <div class="byu-skill">
            <h3>Technologies used</h3>
            <div class="byu-skills">
              <img src="../assets/javascriptlogo.png" alt="">
              <img src="../assets/javalogo.png" alt="">
              <img src="../assets/laravel.png" alt="">
              <img src="../assets/html.png" alt="">
              <img src="../assets/Unity.png" alt="">
              <img src="../assets/css.png" alt="">
              <img src="../assets/sharepoint.png" alt="">
              <img src="../assets/php.png" alt="">
              <img src="../assets/sql.png" alt="">
              <img src="../assets/python.png" alt="">
            </div>
        </div>
      </div>
    </div>
    <div class="row2 basic">
      <div class="gm-pannel">
        <div class="gm-b"></div>
        <div class="gm-typer">
          <h1 class="title">
            <span class="typewrite" data-period="1000" data-type='[ "General Motors"]'>
              <span class="wrap"></span>
            </span>
          </h1>
        </div>
        <div class="gm-year panel">
          <h2>June 2019</h2>
        </div>
        <div class="gm-title panel">
          <h2>Software Engineer</h2>
        </div>
        <div class="gm-desc panel">
          <h3>
            After graduation I have been given the opportunity to work for
             General Motors. I will be part of the manufacturing team which will
             be based out of their Phoenix Arizona office. This job seems to be a perfect
             fit for my interests (Computer Vision and Machine Learning). I am very excited
             to begin my career at such an amazing company and look forward to the future.
          </h3>
        </div>
      </div>
    </div>
    <div class="row3 basic">
      <div class="byu-pannel">
        <div class="byu-b"></div>
        <div class="byu-typer">
          <h1 class="title">
            <span class="typewrite" data-period="1000" data-type='[ "Church of Jesus Christ of Latter Day Saints"]'>
              <span class="wrap"></span>
            </span>
          </h1>
        </div>
        <div class="byu-year panel">
          <h2>April 2018 - September 2018</h2>
        </div>
        <div class="byu-title panel">
          <h2>Backend Developer (Intern)</h2>
        </div>
        <div class="byu-desc panel">
          <h3>
            I had a four month internship with the Church of
            Jesus Christ of Latter Day Saints doing backend
            development on their church history page. We developed
            in an Agile team environment with user stories and itterations.
            I was primarily responsible for creating an API that would cleanse
            and serve the data necessary for frontend applications. I also
            constructed CLI tools and touched up some front end blemishes.
          </h3>
        </div>
        <div class="byu-skill">
            <h3>Technologies used</h3>
            <div class="byu-skills">
              <img src="../assets/node.png" alt="">
              <img src="../assets/markl.png" alt="">
              <img src="../assets/es6.png" alt="">
              <img src="../assets/xquery.png" alt="">
              <img src="../assets/css.png" alt="">
            </div>
        </div>
      </div>
    </div>
    <div class="row4 basic">
      <div class="byu-pannel">
        <div class="byu-b"></div>
        <div class="byu-typer">
          <h1 class="title">
            <span class="typewrite" data-period="1000" data-type='[ "IHS Markit"]'>
              <span class="wrap"></span>
            </span>
          </h1>
        </div>
        <div class="byu-year panel">
          <h2>April 2017 - September 2017</h2>
        </div>
        <div class="byu-title panel">
          <h2>Software Engineer (Intern)</h2>
        </div>
        <div class="byu-desc panel">
          <h3>
            During my sophmore year I interned with IHS Markit in
            Denver, Colorado. I was placed on the data-mining team
            Enerdeq where we developed in an Agile environment. I was
            primarily in charge of serving and displaying data to our
            clients via an in-house tool (created in Java). I also
            restructured the UI/UX of their map interface and updated
            their frontend from vanilla JS to angular4.
          </h3>
        </div>
        <div class="byu-skill">
            <h3>Technologies used</h3>
            <div class="byu-skills">
              <img src="../assets/javalogo.png" alt="">
              <img src="../assets/sql.png" alt="">
              <img src="../assets/html.png" alt="">
              <img src="../assets/angular.png" alt="">
              <img src="../assets/javascriptlogo.png" alt="">
            </div>
        </div>
      </div>
    </div>
    <div id="my-resume">
      <span id="my-x">X</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      name: `Trayson Keli'i`,
      grad: `April 2019`,
      title: `Software Developer`
    }
  }
}

/* eslint-disable no-new */
const TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate
  this.el = el
  this.loopNum = 0
  this.period = parseInt(period, 10) || 2000
  this.txt = ''
  this.tick()
  this.isDeleting = false
}

TxtType.prototype.tick = function () {
  let i = this.loopNum % this.toRotate.length
  let fullTxt = this.toRotate[i]

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1)
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1)
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>'

  let that = this
  let delta = 200 - Math.random() * 100

  if (this.isDeleting) { delta /= 2 }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period
    this.isDeleting = true
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false
    this.loopNum++
    delta = 500
  }

  setTimeout(function () {
    that.tick()
  }, delta)
}

window.onload = function () {
  const linkedin = document.getElementById('linkedin')
  const github = document.getElementById('github')
  const resume = document.getElementById('resume')
  const myResume = document.getElementById('my-resume')
  const myX = document.getElementById('my-x')

  linkedin.addEventListener('click', () => {
    window.open('https://www.linkedin.com/in/traysonkelii/')
  })

  github.addEventListener('click', () => {
    window.open('https://github.com/traysonkelii?tab=repositories')
  })

  resume.addEventListener('click', () => {
    myResume.setAttribute('style', 'display:block')
  })

  myX.addEventListener('click', () => {
    myResume.setAttribute('style', 'display:none')
  })

  const elements = document.getElementsByClassName('typewrite')
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[i].getAttribute('data-type')
    let period = elements[i].getAttribute('data-period')
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period)
    }
  }

  let css = document.createElement('style')
  css.type = 'text/css'
  css.innerHTML = '.typewrite > .wrap { border-right: 0.08em solid rgba(98,144,199, .9)}'
  document.body.appendChild(css)
}

</script>

<style scoped>
</style>
