const Autolinker = require('autolinker'),
  validator = require('validator')

import remarkable from 'remarkable'
import async from 'async'

import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const defaultConfig = {
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: true, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks
  linkify: true, // autoconvert URL-like texts to links
  linkTarget: '', // set target to open link in
  typographer: true, // Enable smartypants and other sweet transforms
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {}

    return ''; // use external default escaping
  }
}

const md = new remarkable('full', defaultConfig)

const utility = {
  formatDate(dateString) {
    if (!dateString)
      return ''
    const date = new Date(dateString)
    const diff = (Date.now() - date.getTime())
    const passedTime = Math.abs(diff)

    if (passedTime <= 1000 * 60 * 60 * 24) { // within 24h
      if (passedTime <= 1000 * 60 * 60) { // within 1 hour
        return (diff < 0 ? 'future ' : '') + Math.ceil(passedTime / (1000 * 60)) + 'm'
      } else {
        return (diff < 0 ? 'future ' : '') + Math.floor(passedTime / (1000 * 60 * 60)) + 'h'
      }
    } else {
      const monthNamesShort = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
      return (monthNamesShort[date.getMonth()]) + ' ' + (date.getDate()) + ' ' + date.getFullYear()
    }
  },

  convertMessage(text) {
    return Autolinker.link(text).replace(/\n/g, '<br>')
  },

  convertHTML(text, option = {}) {
    const _unescape = option.unescape || false,
      videoControls = option.videoControls || false
    text = text.replace(/<![-]*\[CDATA\[([\s\S]+?)\]\]>/g, function($0, $1) {
      return $1
    })
    if (_unescape) {
      text = validator.unescape(text)
    }

    if (videoControls) {
      let div = document.createElement('div')
      div.innerHTML = text
      let videoElements = div.getElementsByTagName('video')
      for (let i = 0; i < videoElements.length; i++) {
        videoElements[i].setAttribute('controls', true)
        videoElements[i].setAttribute('onloadstart', 'this.muted=false; this.volume=1.0')
      }
      text = div.innerHTML
    }
    return text
  },

  renderMarkdown(text, option = {}) {
    const _unescape = option.unescape || false,
      videoControls = option.videoControls || false

    text = text.replace(/<![-]*\[CDATA\[([\s\S]+?)\]\]>/g, function($0, $1) {
      return $1
    })
    if (_unescape) {
      text = validator.unescape(text)
    }
    let outputString = md.render(text)

    if (videoControls) {
      let div = document.createElement('div')
      div.innerHTML = outputString
      let videoElements = div.getElementsByTagName('video')
      for (let i = 0; i < videoElements.length; i++) {
        videoElements[i].setAttribute('controls', true)
        videoElements[i].setAttribute('onloadstart', 'this.muted=false; this.volume=1.0')
      }
      outputString = div.innerHTML
    }
    return outputString
  },

  getArticleSummary(htmlString, callback) {
    htmlString = htmlString.replace(/<![-]*\[CDATA\[([\s\S]+?)\]\]>/g, function($0, $1) {
      return $1
    })
    htmlString = validator.unescape(htmlString)

    let videoMatch = htmlString.match(/<video([\s\S]+?)<\/video>/g)
    let video = null
    if (videoMatch && videoMatch.length) {
      let videoDiv = document.createElement('div')
      videoDiv.innerHTML = videoMatch[0]
      video = videoDiv.children[0]
      video.setAttribute('controls', true)
      video.setAttribute('onloadstart', 'this.muted=false; this.volume=1.0')
    }


    let asyncFuncs = []
    let imageTest = /<img([\s\S]+?)src=['"]([\s\S]+?)['"]([\s\S]+?)>/g
    let image = null
    let match = null
    while (match = imageTest.exec(htmlString)) {
      let imageSrc = match[2]
      asyncFuncs.push(function(cb) {
        let tmpImage = new Image()
        tmpImage.src = imageSrc
        tmpImage.onload = function() {
          if (tmpImage.width >= 128) { // only use image of width >= 128px
            cb(true, tmpImage.src)
          } else {
            cb(null, null)
          }
        }
        tmpImage.onerror = function() {
          cb(null, null)
        }
      })
    }

    let text = htmlString.replace(/<[\s\S]+?>/g, '') // sanitize html string...
    if (text && text.length > 64) {
      text = (text.slice(0, 64) + '...').replace(/\n/g, ' ')
    }

    async.series(asyncFuncs, function(error, results=[]) {
      results = results.filter((r)=>r)
      callback({
        image: results[0],
        video: (video ? video.outerHTML : null),
        text: text
      })
    })
  },
}

export default utility