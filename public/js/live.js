rivets.binders.src = function(el, value) {
    el.src = value || '';
};

rivets.formatters.eq = function(value, arg) {
    return (value === arg);
};

rivets.formatters.notEq = function(value, arg) {
    return (value !== arg);
};

rivets.formatters.gt = function(value, arg) {
    return (value > arg);
};

rivets.formatters.lt = function(value, arg) {
    return (value < arg);
};

rivets.formatters.prepend = function(value, arg) {
    return (arg + value);
};

rivets.formatters.append = function(value, arg) {
    return (value + arg);
};

rivets.formatters.maps = function(value) {
    if(maps[value] === undefined) {
        return maps['default'];
    } else {
        return maps[value];
    }
};

var maps = {
    "ar_baggage": "/img/maps/ar_baggage.png",
    "cs_assault": "/img/maps/cs_assault.png",
    "cs_italy": "/img/maps/cs_italy.png",
    "cs_militia": "/img/maps/cs_militia.png",
    "cs_office": "/img/maps/cs_office.png",
    "cs_safehouse": "/img/maps/cs_safehouse.png",
    "de_aztec": "/img/maps/de_aztec.png",
    "de_cache": "/img/maps/de_cache.png",
    "de_cobblestone": "/img/maps/de_cobblestone.png",
    "de_dust": "/img/maps/de_dust.png",
    "de_dust2": "/img/maps/de_dust2.png",
    "de_inferno": "/img/maps/de_inferno.png",
    "de_lake": "/img/maps/de_lake.png",
    "de_mirage": "/img/maps/de_mirage.png",
    "de_nuke": "/img/maps/de_nuke.png",
    "de_overpass": "/img/maps/de_overpass.png",
    "de_train": "/img/maps/de_train.png",
    "de_vertigo": "/img/maps/de_vertigo.png",
    "default": "/img/maps/default.png"
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


var mainData = {main: {}};
rivets.bind($('#live'), mainData);

var source = new EventSource('/api/v1/live/76561198192124290');

source.addEventListener('liveUpdate', function(e) {
    var data = JSON.parse(e.data.replace('\\\n', '\n'));
    mainData.main = data;
    mainData.items = {};
    if(mainData.main.player.weapons.weapon_0.paintkit !== 'default') {
        mainData.items.weapon_0 = items[mainData.main.player.weapons.weapon_0.name + '_' + mainData.main.player.weapons.weapon_0.paintkit];
    } else {
        mainData.items.weapon_0 = items[mainData.main.player.weapons.weapon_0.name];
    }
    if(mainData.main.player.weapons.weapon_1.paintkit !== 'default') {
        mainData.items.weapon_1 = items[mainData.main.player.weapons.weapon_1.name + '_' + mainData.main.player.weapons.weapon_1.paintkit];
    } else {
        mainData.items.weapon_1 = items[mainData.main.player.weapons.weapon_1.name];
    }
    if(mainData.main.player.weapons.weapon_2.paintkit !== 'default') {
        mainData.items.weapon_2 = items[mainData.main.player.weapons.weapon_2.name + '_' + mainData.main.player.weapons.weapon_2.paintkit];
    } else {
        mainData.items.weapon_2 = items[mainData.main.player.weapons.weapon_2.name];
    }
}, false);
