/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'text!../../data/config.json', 'ojs/ojknockout', 'jquery', 
    'ojs/ojaccordion', 'ojs/ojbutton', 'ojs/ojinputtext', 'ojs/ojlabel','ojs/ojlabelvalue'],
        function (oj, ko, jsonData) {
            function SetupViewModel() {
                var self = this;
                //Lese Basiskonfiguration und erstelle komplettes Databinding Objekt
                self.configDataBind = ko.observable({
                    "id": ko.observable(1),
                    "sonos": {
                        "id": ko.observable(1.1),
                        "label": ko.observable(JSON.parse(jsonData).sonos.label),
                        "host": ko.observable(JSON.parse(jsonData).sonos.host),
//                        "host": ko.observable('JSON.parse(jsonData).sonos.host'),
                        "zonen": ko.observableArray(JSON.parse(jsonData).sonos.zonen.map(function (obj) {
                            return {
                                id: ko.observable(obj.id),
                                name: ko.observable(obj.name)
                            };
                        }))
                    },
                    "rc433": {
                        "id": ko.observable(1.2),
                        "label": ko.observable(JSON.parse(jsonData).rc433.label),
                        "host": ko.observable(JSON.parse(jsonData).rc433.host),
                        "systems": ko.observableArray(JSON.parse(jsonData).rc433.systems.map(function (obj) {
                            return {
                                id: ko.observable(obj.id),
                                systemCode: ko.observable(obj.systemCode),
                                name: ko.observable(obj.name),
                                units: ko.observableArray(obj.units.map(function (obj2) {
                                    return {
                                        id: ko.observable(obj2.id),
                                        unitCode: ko.observable(obj2.unitCode),
                                        name: ko.observable(obj2.name)
                                    };
                                }))
                            };
                        })
                                )
                    }
                });
                
                self.sonosHost = self.configDataBind().sonos.host;
                
//                     Implement if needed
//                    console.log(self.configDataBind().rc433.systems());
            }

            return new SetupViewModel();
        }
);