rivets.binders.src = function(el, value) {
    el.src = value;
};

rivets.formatters.eq = function(value, arg) {
    return (value === arg);
};

rivets.formatters.gt = function(value, arg) {
    return (value > arg);
};

rivets.formatters.lt = function(value, arg) {
    return (value < arg);
};

var items = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': '/items_game_cdn.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

window.tries = 0;
var mainData = {main: {}};
rivets.bind($('#live'), mainData);
(function poll(qXHR, textStatus) {
    if (textStatus === undefined || textStatus === 'success') {
        var url = window.location.href + '/json';
        $.ajax({
            url: url, success: function (data) {
                window.tries = 0;
                mainData.main = JSON.parse(JSON.stringify(data));
                mainData.items = {};
                if(mainData.main.player.weapons.weapon_0.paintkit !== '') {
                    mainData.items.weapon_0 = items[mainData.main.player.weapons.weapon_0.name + '_' + mainData.main.player.weapons.weapon_0.paintkit];
                } else {
                    mainData.items.weapon_0 = items[mainData.main.player.weapons.weapon_0.name];
                }
                if(mainData.main.player.weapons.weapon_1.paintkit !== '') {
                    mainData.items.weapon_1 = items[mainData.main.player.weapons.weapon_1.name + '_' + mainData.main.player.weapons.weapon_1.paintkit];
                } else {
                    mainData.items.weapon_1 = items[mainData.main.player.weapons.weapon_1.name];
                }
                if(mainData.main.player.weapons.weapon_2.paintkit !== '') {
                    mainData.items.weapon_2 = items[mainData.main.player.weapons.weapon_2.name + '_' + mainData.main.player.weapons.weapon_2.paintkit];
                } else {
                    mainData.items.weapon_2 = items[mainData.main.player.weapons.weapon_2.name];
                }
            }, dataType: "json", complete: poll, timeout: 30000
        });
    } else {
        window.tries = window.tries + 1;
        setTimeout(poll, 1000 * window.tries);
    }

})();
