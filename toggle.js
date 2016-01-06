var BUTTON = document.createElement('a');
var LABEL = document.createElement('span');

var CHANNEL_HEADER_SELECTOR = '#active_channel_name';
var CHANNEL_HEADER_RIGHT_SPACING_TYPE = 'margin-right';
var CHANNEL_HEADER_RIGHT_SPACING_AMOUNT = '5rem';

var CLASS_BOTS_SHOWN = 'ts_icon_eye';
var CLASS_BOTS_HIDDEN = 'ts_icon_eye_closed';

(function(button) { // create DOM interface
  document.querySelector(CHANNEL_HEADER_SELECTOR).style[CHANNEL_HEADER_RIGHT_SPACING_TYPE] = CHANNEL_HEADER_RIGHT_SPACING_AMOUNT;
  var icon = document.createElement('ts-icon');
  icon.classList.add('channel_botfilter_toggle_icon');

  button.id = 'channel_botfilter_toggle';
  button.appendChild(icon);
  button.appendChild(LABEL);
  button.title = chrome.i18n.getMessage("toggle_button_label");

  button.addEventListener('click', function(e) {
    chrome.runtime.sendMessage({
      bots_hidden: !BUTTON.hasAttribute('active')
    });
  });

  var anchor = document.querySelector('#channel_members_toggle');

  var UpdateParent = function() { // Move the toggle when the user button moves
    if (anchor.parentNode !== button.parentNode) {
      anchor.parentNode.insertBefore(button, anchor);
    }
  };
  (new MutationObserver(UpdateParent)).observe(anchor.parentNode, {
    childList: true
  });
  UpdateParent();

  var UpdateHiddenState = function() { // Hide the toggle when the user button hides
    if (anchor.classList.contains('hidden')) {
      button.classList.add('hidden');
    } else {
      button.classList.remove('hidden');
    }
  };
  (new MutationObserver(UpdateHiddenState)).observe(anchor, {
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: false
  });
  UpdateHiddenState();

})(BUTTON);


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('%c%s\n%c\tmessage: %O\n\tsender: %O', 'color:green;font-weight:bold;', 'toggle.js', 'font-weight:normal;', request, sender);
  // only react to messages from own extension
  if (sender.id === chrome.runtime.id && request.url === document.location.origin + document.location.pathname) {
    if (request.bots_hidden !== undefined) {
      if (request.bots_hidden) {
        BUTTON.setAttribute('active', '');
        BUTTON.children[0].classList.remove(CLASS_BOTS_SHOWN);
        BUTTON.children[0].classList.add(CLASS_BOTS_HIDDEN);
      } else {
        BUTTON.removeAttribute('active');
        BUTTON.children[0].classList.remove(CLASS_BOTS_HIDDEN);
        BUTTON.children[0].classList.add(CLASS_BOTS_SHOWN);
      }
    }
    if (request.bot_messages !== undefined) {
      LABEL.innerText = '' + request.bot_messages;
    }
  }
});
