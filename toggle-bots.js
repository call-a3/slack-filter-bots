var STATE = false;
var DOMAIN = 'null';
var CHANNEL = 'null';
var BUTTON = document.createElement('a');

var updateUI = (function(button) { // create updateUI function
    var gobbler = new MutationObserver(function(mutations) {
        mutations.forEach(function(record){
            Array.prototype.forEach.call(record.addedNodes, function(node) {
                if (typeof node.classList !== 'undefined' && node.classList.contains('bot_message')) {
                    node.style.display= 'none';
                }
            });
        });
    });
    var gobbleOptions = {
        childList: true
    };

    var msgContainer = document.querySelector('#msgs_div');

    var updateUI = function() {
        Array.prototype.forEach.call(document.querySelectorAll('div.bot_message'), function(msg) {
            msg.style.display= (STATE ? 'none' : null);
        });
        if (STATE) {
            button.setAttribute('active', '');
            gobbler.observe(msgContainer, gobbleOptions);
        } else {
            button.removeAttribute('active');
            gobbler.disconnect();
        }
    };
    return updateUI;
})(BUTTON);

(function() { // init globals
    var refresh = function() { // init globals
        var match = document.URL.match(/https:\/\/([^.]+)\.slack\.com\/messages\/([^/]+)\/.*/);
        if (match !== undefined && match !== null) {
            if (DOMAIN != match[1] || CHANNEL != match[2]) {
                DOMAIN = match[1];
                CHANNEL = match[2];
                chrome.storage.sync.get(CHANNEL+'@'+DOMAIN, function(set) {
                    STATE = set[CHANNEL+'@'+DOMAIN];
                    updateUI();
                });
            }
        }
    };
    window.setInterval(refresh, 100);
    refresh();
})();

(function(button) { // create DOM interface
    var icon = document.createElement('i');
    icon.classList.add('fa', 'fa-filter');

    button.id = 'channel_filter_bots';
    button.appendChild(icon);
    button.title = chrome.i18n.getMessage("toggle_button_label");

    button.addEventListener('click', function(e) {
        STATE = !STATE;
        var set = {};
        set[CHANNEL+'@'+DOMAIN] = STATE;
        chrome.storage.sync.set(set);
        updateUI();
    });

    var anchor = document.querySelector('#channel_members_toggle');

    var UpdateParent = function() { // Move the toggle when the user button moves
        if (anchor.parentNode !== button.parentNode) {
            anchor.parentNode.insertBefore(button, anchor);
        }
    };
    var UpdateHiddenState = function() { // Hide the toggle when the user button hides
        if (anchor.classList.contains('hidden')) {
            button.classList.add('hidden');
        } else {
            button.classList.remove('hidden');
        }
    };

    (new MutationObserver(UpdateParent)).observe(anchor.parentNode, {
        childList: true
    });
    (new MutationObserver(UpdateHiddenState)).observe(anchor, {
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: false
    });

    UpdateParent();
    UpdateHiddenState();
})(BUTTON);