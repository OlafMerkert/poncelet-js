// (c) Olaf Merkert 2015

// display messages of varying severity

function messageInfo(content) {
    addMessage(content, "info");
}

function messageWarning(content) {
    addMessage(content, "warning");
}

function messageError(content) {
    addMessage(content, "error");
}

function messageSuccess(content) {
    addMessage(content, "error");
}

function getMessageContainer() {
    return $("#message-container");
}

function clearMessages() {
    var $c = getMessageContainer();
    $c.children().hide(0);
    $c.empty();
}

var styleMap = {
    "default": ["user-help", "bg-primary"],
    "info":    ["user-help", "bg-info"],
    "success": ["user-help", "bg-success"],
    "warning": ["user-help", "bg-warning"],
    "error":   ["user-help", "bg-danger"]
}

function addMessage(content, style) {
    var $c = getMessageContainer();
    console.log("Message: " + content);
    var $m = $("<p>" + content + "</p>");
    var s = styleMap[style];
    if (s) {
        for (var i = 0; i < s.length; i++) {
            $m.addClass(s[i]);
        }
    }
    $m.hide(0);
    $c.append($m);
    $m.show("slow");
    // hide the messages after a timeout, or any button press
    window.setTimeout(function () {
        $("button").click(function () {
            $m.hide("slow");
        });
    }, 1000);
    window.setTimeout(function () {
        $m.hide("slow");
    }, 20000);
}
