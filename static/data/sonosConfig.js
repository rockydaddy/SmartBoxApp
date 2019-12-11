//Gloale Einstellungen
var appTitel = "Mini Controller";
var sonosZonen = ["Küche", "Wohnzimmer", "Bad", ""];
var basisUrl = "http://192.168.0.6:5005/";

//Resultierende
var zonenAPI = basisUrl + "zones";
var favoritenAPI = basisUrl + "favorites/detailed";

//Avatare
var avatars = {
    "titelAvatar": {
        "TV": "css/images/sonos/tv_avatar.png",
        "Vinyl": "css/images/sonos/vinyl_avatar.png",
        "Sonstiges": "css/images/sonos/sonstiges_avatar.png"
    },
    "favoritenAvatar": {
        "Vinyl": "css/images/sonos/vinyl_avatar.png",
        "Sonstiges": "css/images/sonos/sonstiges_avatar.png"
    }
};
var playStatusButton = { // CSS Selektor
    "stop": "stoppedTitleBtn",
    "play": "playingTitleBtn",
    "loading": "loadingTitleBtn"
};

//API Uris
var wechsleSender = function (raum, sender) {
    return encodeURI(basisUrl + raum + '/favorite/' + sender);
};
var startStop = function (raum) {
    return encodeURI(basisUrl + raum + '/playpause');
};
var setVolume = function (raum, level) {
    return encodeURI(basisUrl + raum + '/volume/' + level);
};