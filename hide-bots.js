var ATTR_BOTS = 'data-bots';
var forEach = function(arr, fn) {
  Array.prototype.forEach.call(arr, fn);
}
var PREVIOUS_PAGE = undefined;
var HIDE = undefined;
var COUNTER = 0;

function applyToMessage(msg) {
  if (typeof msg.classList !== 'undefined' && msg.classList.contains('bot_message')) {
    COUNTER++;
    msg.style.display = HIDE ? 'none' : 'initial';
  }
};

var gobbler = new MutationObserver(function(mutations) {
  mutations.forEach(function(record) {
    forEach(record.addedNodes, applyToMessage);
  });
  chrome.runtime.sendMessage({
    bot_messages: COUNTER
  });
});
var gobbleOptions = {
  childList: true
};

var msgContainer = document.querySelector('#msgs_div');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('%c%s\n%c\tmessage: %O\n\tsender: %O', 'color:orange;font-weight:bold;', 'hide-bots.js', 'font-weight:normal;', request, sender);
  if (sender.id === chrome.runtime.id && request.url === document.location.origin + document.location.pathname && request.bots_hidden !== undefined) {
    if (PREVIOUS_PAGE !== undefined && PREVIOUS_PAGE !== request.url) {
      if (HIDE !== undefined && HIDE === true) {
        gobbler.disconnect();
      }
    }
    // only react to messages from own extension
    PREVIOUS_PAGE = request.url;
    HIDE = request.bots_hidden;
    COUNTER = 0;
    forEach(msgContainer.children, applyToMessage);
    if (HIDE === true) {
      gobbler.observe(msgContainer, gobbleOptions);
    } else if (HIDE === false) {
      gobbler.disconnect();
    }
    chrome.runtime.sendMessage({
      bot_messages: COUNTER
    });
  }
});
