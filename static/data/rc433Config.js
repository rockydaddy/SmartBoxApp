var basisUrl = "http://192.168.0.6:3000/api/v1/switch/";

//var systemDef = [
//    {"systemCode": 10101, "unitCodes": [{"unitCode": 1, "status": "off"}, {"unitCode": 2, "status": "off"}, {"unitCode": 3, "status": "off"}, {"unitCode": 4, "status": "off"}]}
//    ,
//    {"systemCode": 10102, "unitCodes": [{"unitCode": 1, "status": "off"}, {"unitCode": 2, "status": "off"}, {"unitCode": 3, "status": "off"}, {"unitCode": 4, "status": "off"}]}
//    ];
var systemDef = [{
        "systemCode": 10101, 
        "name":"Wohnzimmer",
        "unitCodes": [{
                "unitCode": 1.1, 
                "name":"Licht Front"
            },{
                "unitCode": 1.2, 
                "name":"Licht Rück"
            },{
                "unitCode": 1.3, 
                "name":"Licht Vitrine"
            },{
                "unitCode": 1.4, 
                "name":"Stern"
            }]
        },{
        "systemCode": 10102,
        "name": "Schlafzimmer",
        "unitCodes": [{
                "unitCode": 2.1, 
                "name":"Weihnachtsbaum"
            },{
                "unitCode": 2.2, 
                "name":"Kleine Sterne"
            },{
                "unitCode": 2.3, 
                "name":"Konrad Kirche"
            },{
                "unitCode": 2.4, 
                "name":"<leer>"
            }]
        }
    ];




