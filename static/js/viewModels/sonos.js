/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'text!../../data/config.json',  'ojs/ojarraydataprovider', 'ojs/ojknockout', 'jquery',
    'ojs/ojavatar', 'ojs/ojslider', 'ojs/ojdialog', 'ojs/ojlistview'],
        function (oj, ko, cfg) {

            function SonosViewModel() {
                var self = this;
                // Below are a set of the ViewModel methods invoked by the oj-module component.
                // Please reference the oj-module jsDoc for additional information.
//----------------- I N I T ----------------------------------------------------
// Statische Hilfsvariablen
                var playStatusButton = { // CSS Selektor
                                        "stop": "stoppedTitleBtn",
                                        "play": "playingTitleBtn",
                                        "loading": "loadingTitleBtn"
                                    };
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
//Lese Basiskonfiguration
                self.config = JSON.parse(cfg).sonos;//Auslesen aus config.json
                self.zonenDef = self.config.zonen; //Array für die Definition des CSS Selektors auf Basis des Zonennamens, statt Index des Zonenarrays (kann sich ändern)
                //Binding Objekte definieren
                self.sonosZonen = ko.observableArray().extend({deferred: true});
                self.sonosFavoriten = ko.observableArray().extend({deferred: true});
                self.apiResponse = ko.observable().extend({deferred: true});
                self.favoritenDP = ko.observable().extend({deferred: true});

//----------------- S o n o s   API C a l l s ----------------------------------
// Urls aus Basiskonfiguration zusammenstellen
                self.zonenAPI = self.config.host + "/zones";
                self.favoritenAPI = self.config.host + "/favorites/detailed";
                self.wechsleSender = function (raum, sender) {return encodeURI(self.config.host + '/' + raum + '/favorite/' + sender);};
                self.startStop = function (raum) {return encodeURI(self.config.host + '/' + raum + '/playpause');};
                self.setVolume = function (raum, level) {return encodeURI(self.config.host + '/' + raum + '/volume/' + level);};
// Allgemeine JQuery Function
                self.getJSONData = function (url, jsonData) {
//                    console.log(url);
                    $.getJSON(url).done(function (response) {
                        jsonData(response);
//                        console.log(response);
                    });
//                    console.log(jsonData());
                };

//Zonen Binding beim Laden der Seite
                self.getJSONData(self.zonenAPI, self.sonosZonen);// Hole Daten
//Favoriten Binding beim Laden der Seite
                self.getJSONData(self.favoritenAPI, self.sonosFavoriten);// Hole Daten
//Toggle PlayPause Action bei Click
                self.togglePlayPause = function (idx) {
                    // Start / Stop API Call
                    self.getJSONData(self.startStop(self.sonosZonen()[idx].coordinator.roomName()), self.apiResponse);
                    //play Status Icon auf "Loading", wenn neue Daten vorliegen erfolgt Update des Status Buttons durch Observable
                    self.sonosZonen()[idx].coordinator.state.playbackState(playStatusButton.loading);
                    //play Status Icon auf "Loading" solange auf neue Daten gewartet wird
                    setTimeout(function () {
                        self.getJSONData(self.zonenAPI, self.sonosZonen);
                    }, 4000);// Gib der Sonos etwas Zeit - 4sek ausprobiert, Starten einiger Radiosender dauert etwas länger)
                };
//Spiele Favorit
                self.playFavorite = function (idx, sender, dialogId) {
                    self.getJSONData(self.wechsleSender(self.sonosZonen()[idx].coordinator.roomName(), sender), self.apiResponse);

                    document.querySelector("#" + dialogId).close();
                    //play Status Icon auf "Loading" solange auf neue Daten gewartet wird
                    self.sonosZonen()[idx].coordinator.state.playbackState(playStatusButton.loading);
                    // aktuelle Zonen Daten holen
                    setTimeout(function () {
                        self.getJSONData(self.zonenAPI, self.sonosZonen);
                    }, 4000);//Warte 4 Sekunden, da einige Radiosender etwas länger brauchen

                };

//Setze Lautstärke wenn Observable in der UI geändert wird -> durch Slider
                self.volumeChange = function (idx) {
                    self.getJSONData(self.setVolume(self.sonosZonen()[idx].coordinator.roomName(), self.sonosZonen()[idx].coordinator.state.volume()), self.apiResponse);
                    // jetzt aktuelle Zonen Daten holen
//                    setTimeout(function(){
//                        self.getJSONData(self.zonenAPI, self.sonosZonen);
//                    },100); // nur kurz warten, bis Sonos reagiert hat
                };

// ---------------- H i l f s f u n k t i o n e n ------------------------------
//Favoriten Dialog Handler
                self.handleOpen = function (dialogId) {
                    self.favoritenDP(new oj.ArrayDataProvider(self.sonosFavoriten, {keyAttributes: 'title'}));
                    document.querySelector("#" + dialogId).open();
                };
                self.handleOKClose = function (dialogId) {
                    document.querySelector("#" + dialogId).close();
                };
//CSS Selektor für Zone
                self.getCSSSelector = function (zonename) {
                    var index = self.zonenDef.findIndex(function (item, i) {
                        return item.name === zonename;
                    });
                    return 'zone' + index;
                };
//Avatar Icon, wenn Zonen API nichts ordentliches liefert 
                self.titleAvatarIcon = function (curTrack) {
//                    var src = 'css/images/sonos/sonstiges_avatar.png';
//                    if (curTrack.title != undefined) {
                    switch (curTrack.absoluteAlbumArtUri) {
                        case undefined: //kein Senderlogo vorhanden - Ersatz durch eigenes Bild
                            if (curTrack.type.includes('line_in')) {//TV Signal
                                src = avatars.titelAvatar.TV;
                            } else if (curTrack.title.toLowerCase().includes('platten') ||
                                    curTrack.title.toLowerCase().includes('vinyl')) { //Plattenspieler
                                src = avatars.titelAvatar.Vinyl;
                            } else {
                                src = avatars.titelAvatar.Sonstiges; //sonstiges
                            }
                            break;
                        default: //Logo vorhanden, aber nicht klar, ob Objekt oder String
                            if (typeof (curTrack.absoluteAlbumArtUri) === 'string' || curTrack.absoluteAlbumArtUri instanceof String) {
                                src = curTrack.absoluteAlbumArtUri;
                            } else {
                                src = JSON.stringify(curTrack.absoluteAlbumArtUri);
                                src = src.split('":"').pop();
                                src = src.slice(0, -2);
                            }
                            if (!src.startsWith('http')) {//keine ordentliche URL, z.B. bei DLNA
                                src = avatars.titelAvatar.Sonstiges;
                            }
                    }
//                    }
//                    console.log(src);
                    return src;
                };
//favoriten Avatar Icon für Schallplatten bzw. sonstigesa
                self.favoriteAvatarIcon = function (curFav) {
//                    switch (curFav.albumArtUri()) {
                    switch (curFav.albumArtUri) {
                        case undefined:
//                            prüfe, ob Plattenspieler im Titel
//                            var title = curFav.title().toLowerCase();
                            var title = curFav.title.toLowerCase();
                            if (title.includes('platten') || title.includes('vinyl')) {
                                return avatars.favoritenAvatar.Vinyl; //plattenspieler
                            } else {
                                return avatars.titelAvatar.Sonstiges; //sonstiger favorit                                
                            }
                            break;
                        default:
//                            return curFav.albumArtUri();
                            return curFav.albumArtUri;
                    }};
//Korektur des Zonen Arrays mit Observable Elementen, wenn ZonenDaten geladen (jQuery Asynch)
                self.sonosZonen.subscribe(function () {
                    self.sonosZonen().forEach(function (item, index) {
                        self.sonosZonen()[index].coordinator.roomName = ko.observable(self.sonosZonen()[index].coordinator.roomName);
                        self.sonosZonen()[index].coordinator.state.volume = ko.observable(self.sonosZonen()[index].coordinator.state.volume);
//                        self.sonosZonen()[index].coordinator.state.currentTrack = ko.observable(self.sonosZonen()[index].coordinator.state.currentTrack);
                        self.sonosZonen()[index].coordinator.state.playbackState = ko.observable(self.sonosZonen()[index].coordinator.state.playbackState);
                        if (self.sonosZonen()[index].coordinator.state.playbackState().toLowerCase() === 'playing') {
                            self.sonosZonen()[index].coordinator.state.playbackState(playStatusButton.play);
                        } else {
                            self.sonosZonen()[index].coordinator.state.playbackState(playStatusButton.stop);
                        };
//                            console.log(self.sonosZonen()[index].coordinator.state.playbackState());
                    });
                });
////Korektur des Favoriten Arrays mit Observable Elementen, wenn Daten geladen (jQuery Asynch)
                self.sonosFavoriten.subscribe(function () {
                    self.sonosFavoriten().forEach(function (item, index) {
                        self.sonosFavoriten()[index].uri = ko.observable(self.sonosFavoriten()[index].uri);
                        self.sonosFavoriten()[index].title = ko.observable(self.sonosFavoriten()[index].title);
                        self.sonosFavoriten()[index].albumArtUri = ko.observable(self.sonosFavoriten()[index].albumArtUri);
                        self.sonosFavoriten()[index].metadata = ko.observable(self.sonosFavoriten()[index].metadata);
                    });
                });

                /**
                 * Optional ViewModel method invoked after the View is inserted into the
                 * document DOM.  The application can put logic that requires the DOM being
                 * attached here. 
                 * This method might be called multiple times - after the View is created 
                 * and inserted into the DOM and after the View is reconnected 
                 * after being disconnected.
                 */
                self.connected = function () {
                    // Implement if needed
                };

                /**
                 * Optional ViewModel method invoked after the View is disconnected from the DOM.
                 */
                self.disconnected = function () {
                    // Implement if needed
                };

                /**
                 * Optional ViewModel method invoked after transition to the new View is complete.
                 * That includes any possible animation between the old and the new View.
                 */
                self.transitionCompleted = function () {
                    // Implement if needed
                };
            }

            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constructed
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new SonosViewModel();
        }
);
