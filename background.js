var console = chrome.extension.getBackgroundPage().console;

var CURRENT_DOMAIN = 'null';
var CURRENT_CHANNEL = 'null';
var BOT_MESSAGES_CACHE = {};

var NAVIGATION_EVENT_FILTER = {
  url: [{
    hostSuffix: '.slack.com'
  }, {
    pathPrefix: '/messages/'
  }]
};

var sendState = function sendState(fqcn, destination) {
  chrome.storage.sync.get(fqcn, function(set) {
    chrome.tabs.sendMessage(destination.tabId, {
      url: destination.url,
      bots_hidden: set[fqcn] !== undefined ? set[fqcn] : false,
      bot_messages: BOT_MESSAGES_CACHE[fqcn] || 0
    });
  });
}

var parseLocationFromURL = function parseLocationFromURL(url) {
  var match = url.match(/https:\/\/([^.]+)\.slack\.com\/messages\/([^/]+)\/.*/);
  if (match !== undefined && match !== null && match.length >= 3) {
    return {
      domain: match[1],
      channel: match[2]
    };
  } else {
    return undefined;
  }
};

var locationToFQCN = function locationToFQCN(location) {
  if (location !== undefined) {
    return location.channel + '@' + location.domain;
  } else {
    return location;
  }
};

var detectActiveChannel = function detectActiveChannel(details) {
  console.log('detectActiveChannel:\n\tdetails: %O', details);
  if (details !== undefined && details.url !== undefined && details.tabId !== undefined) {
    var location = parseLocationFromURL(details.url);
    var fqcn = locationToFQCN(location);

    sendState(fqcn, details);
  }
};

chrome.webNavigation.onHistoryStateUpdated.addListener(detectActiveChannel, NAVIGATION_EVENT_FILTER);
chrome.webNavigation.onCompleted.addListener(detectActiveChannel, NAVIGATION_EVENT_FILTER);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('onMessage:\n\trequest: %O\n\tsender: %O', request, sender);
  // only react to messages from own extension
  if (sender.id === chrome.runtime.id && sender.url !== undefined && sender.tab !== undefined && sender.tab.id !== undefined) {
    var location = parseLocationFromURL(sender.url);
    var fqcn = locationToFQCN(location);

    if (request.bots_hidden !== undefined) {
      var set = {};
      set[fqcn] = request.bots_hidden;
      chrome.storage.sync.set(set, function() {
        sendState(fqcn, {
          tabId: sender.tab.id,
          url: sender.url
        });
      });
    } else if (request.bot_messages !== undefined && BOT_MESSAGES_CACHE[fqcn] !== request.bot_messages) {
      BOT_MESSAGES_CACHE[fqcn] = request.bot_messages;
      sendState(fqcn, {
        tabId: sender.tab.id,
        url: sender.url
      });
    }
  }
});
