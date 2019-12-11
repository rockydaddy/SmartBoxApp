/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojcontext', 'jquery', '../../data/rc433Config', 'ojs/ojfilmstrip', 'ojs/ojpagingcontrol'],
        function (oj, ko, Context, $) {

            function IncidentsViewModel() {
                var self = this;
                // 
//---------- I N I T -----------------------------------------------------------

//                self.connected = function () {
//                    // Implement if needed
//                };
//
//                self.disconnected = function () {
//                    // Implement if needed
//                };
//
//                self.transitionCompleted = function () {
//                    // Implement if needed
//                };

                defaultButtonSelector = 'buttonDefault';
                onActiveButtonSelector = 'buttonOnActive';
                offActiveButtonSelector = 'buttonOffActive';

                self.buttonSelector = ko.observableArray();
                // schleife über alle Units
                self.buttonSelector.push({on: ko.observable(defaultButtonSelector), off: ko.observable(defaultButtonSelector)});
                self.buttonSelector.push({on: ko.observable(defaultButtonSelector), off: ko.observable(defaultButtonSelector)});
                self.buttonSelector.push({on: ko.observable(defaultButtonSelector), off: ko.observable(defaultButtonSelector)});
                self.buttonSelector.push({on: ko.observable(defaultButtonSelector), off: ko.observable(defaultButtonSelector)});

//----------------- L A D E  S Y S T E M D E F I N I T I O N E N ---------------
//                self.system = [
//                    {name: 'Fernbedienung 1'},
//                    {name: 'Fernbedienung 2'}
//                ];

                self.system = ko.observableArray(systemDef);
//                console.log(self.system());

//----------------- A K T I O N E N --------------------------------------------
                self.switchOn = function (systemidx, unitidx) {//idx entspricht Unit im System
                    self.buttonSelector()[unitidx].on(onActiveButtonSelector);

                    //Schaltung ausführen
//                    console.log('Schalte ' + self.system()[systemidx].name + '-' + self.system()[systemidx].unitCodes[unitidx].name + ' ein');


                    setTimeout(function () {
                        self.buttonSelector()[unitidx].on(defaultButtonSelector);
                    }, 500);
                };
                self.switchOff = function (systemidx, unitidx) {//idx entspricht Unit im System
                    self.buttonSelector()[unitidx].off(offActiveButtonSelector);

                    //Schaltung ausführen
//                    console.log('Schalte ' + self.system()[systemidx].name + '-' + self.system()[systemidx].unitCodes[unitidx].name + ' aus');

                    setTimeout(function () {
                        self.buttonSelector()[unitidx].off(defaultButtonSelector);
                    }, 500);
                };

                self.pagingModel = ko.observable(null);

                self.getItemInitialDisplay = function (index)
                {
                    return index < 1 ? '' : 'none';
                };

                self.transitionCompleted = function (info)
                {
                    var filmStrip = document.getElementById('filmStrip');
                    var busyContext = Context.getContext(filmStrip).getBusyContext();
                    busyContext.whenReady().then(function ()
                    {
                        // Set the Paging Control pagingModel
                        self.pagingModel(filmStrip.getPagingModel());
                    }.bind(self));
                }.bind(self);



            }

            return new IncidentsViewModel();
        }
);
