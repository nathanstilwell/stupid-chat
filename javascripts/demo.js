/*jshint eqnull: true, browser: true */
/*global window: false, console: false*/

(function(global, document, $, SocketWrench, undefined){
  'use strict';

  var
    wrench,
    body,
    input,
    messages,
    randomColor;

// setup

  input = $('#input');
  messages = $('#messages');
  randomColor = '#'+Math.floor(Math.random()*12303291).toString(16);
  body = $('html, body');

// util functions

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  function scroll () {
    var h = messages.height();
    body.animate({scrollTop : h}, 'fast');
  }

  function newMessage (message, color) {
    return '<div class="message" style="color:' + color + '">' + message + '</div>';
  }

  function addMessage (message, c) {
    var color = (c) ? c : '#000';
    messages.append(newMessage(message, color));
  }

  function transmitMessage (message) {
    var msg = {
      type: 'chat',
      message: message,
      color: randomColor
    };
    wrench.send(msg);
  }

  function enterMessage () {
    var message = input.html();
    input.html('');
    transmitMessage(message);
  }

  wrench = new SocketWrench({
    url : 'wss://sheltered-headland-5539.herokuapp.com'
  });

  wrench.on('chat', function onMessage (msg) {
    addMessage(msg.message, msg.color);
    scroll();
  });



  input.one('focus', function removeDefault () {
    $(this).removeClass('default');
  });

  $(document).on('keydown', function onKeyup (e) {
    var code = e.originalEvent.keyCode;
    if (code === 13) {
      e.preventDefault();
      enterMessage(input, messages);
    }
    if (code === 27) {
      e.preventDefault();
      document.execCommand('undo');
      input.blur();
    }
  });

}(window, window.document, window.jQuery, window.SocketWrench));