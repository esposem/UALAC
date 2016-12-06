//Camillo Malnati, Riccardo Gabriele

function setVoiceOverFocus(element) {
  var focusInterval = 10; // ms, time between function calls
  var focusTotalRepetitions = 10; // number of repetitions

  element.setAttribute('tabindex', '0');
  element.blur();

  var focusRepetitions = 0;
  var interval = window.setInterval(function() {
    element.focus();
    focusRepetitions++;
    if (focusRepetitions >= focusTotalRepetitions) {
      window.clearInterval(interval);
    }
  }, focusInterval);
}

var focused;
document.addEventListener("click", readThis)

function readThis(e)
{
  console.log(Polymer.dom(e));
  focused = e.target.id;
  console.log(e);
}
