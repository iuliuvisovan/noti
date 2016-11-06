var socket = io();



$(document).ready(function () {
    socket.emit('check-in', $("#nToken").val());
    socket.on('noti', (noti) => manager.Notifications(JSON.parse(noti)));

    $(".notification-count").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
        $(this).removeClass("updated");
    });
});

var NotiManager = function () {
    var self = this;
    self.Notifications = ko.observableArray();
}

var manager = new NotiManager();
ko.applyBindings(manager);