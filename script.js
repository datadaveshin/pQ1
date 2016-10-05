"use strict";

/**
TODO Fix the input for Selectors, need station abbreviations
TODO Inject Selectors into sections with different ID's
1) Use SED/AWK to set up the input
2) Use jQuery and $$each go load
*/

// Helper Functions
function $$each(collection, callback) {
    if (typeof collection === 'string') {
        collection = collection.split("")
        for (let i = 0; i < collection.length; i++) {
            callback(collection[i], i, collection.join(""), collection['0'], collection[collection.length-1], 0, collection.length - 1, collection.length);
        }
    }
    else if (Array.isArray(collection)) {
        for (let i = 0; i < collection.length; i++) {
            callback(collection[i], i, collection, collection['0'], collection[collection.length-1], 0, collection.length - 1, collection.length);
        }
    }
    else if (typeof collection === 'object') {
        for (let key in collection) {
            callback(collection[key], key, collection, collection[Object.keys(collection)[0]], collection[(Object.keys(collection)[Object.keys(collection).length - 1])], Object.keys(collection)[0], Object.keys(collection)[Object.keys(collection).length - 1], Object.keys(collection).length);
        }
    }
}

function xmlToJson(xml) {
    try {
        var obj = {};
        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);

                    obj[attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;

                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];

                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }

                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }

        // console.log(JSON.stringify(obj));
        return obj;
    } catch (e) {
        alert(e.message);
    }
}


// Stations
var stationAbbrev = ["12th","16th","19th","24th","ashb","balb","bayf","cast","civc","cols","colm","conc","daly","dbrk","dubl","deln","plza","embr","frmt","ftvl","glen","hayw","lafy","lake","mcar","mlbr","mont","nbrk","ncon","oakl","orin","pitt","phil","powl","rich","rock","sbrn","sfia","sanl","shay","ssan","ucty","warm","wcrk","wdub","woak"]

var stationFull = ["12th St. Oakland City Center","16th St. Mission (SF)","19th St. Oakland","24th St. Mission (SF)","Ashby (Berkeley)","Balboa Park (SF)","Bay Fair (San Leandro)","Castro Valley","Civic Center (SF)","Coliseum","Colma","Concord","Daly City","Downtown Berkeley","Dublin/Pleasanton","El Cerrito del Norte","El Cerrito Plaza","Embarcadero (SF)","Fremont","Fruitvale (Oakland)","Glen Park (SF)","Hayward","Lafayette","Lake Merritt (Oakland)","MacArthur (Oakland)","Millbrae","Montgomery St. (SF)","North Berkeley","North Concord/Martinez","Oakland Int'l Airport","Orinda","Pittsburg/Bay Point","Pleasant Hill","Powell St. (SF)","Richmond","Rockridge (Oakland)","San Bruno","San Francisco Int'l Airport","San Leandro","South Hayward","South San Francisco","Union City","Warm Springs/South Fremont","Walnut Creek","West Dublin","West Oakland"]

function Station(abbrev, fullname) {
    this.abbrev = abbrev || "";
    this.fullname = fullname || "";
}

var stationObjArray = []; $$each(stationAbbrev, function(_dummy, idx) {
   let retArr = []
   let stationObj = new Station(stationAbbrev[idx], stationFull[idx])
   stationObjArray.push(stationObj)
})

console.log("stationObjArray:", stationObjArray)

//stationAbbrev.forEach(function(item){console.log(item)})

// Setup Selectors


// $(element).attr("id","theid");
genSelector("Departure")
genSelector("Arrival")
function genSelector(selectorName) {
    let body = $('body')
    let selectorDiv = $('<div>')
    let selectorHeading = $('<h2>')
    var selectorSelect = $('<select>')
    let selectorDefaultOption = $('<option>')

    // Set attributes, names, values
    $(selectorDiv).attr("id", selectorName + "selector")
    $(selectorHeading).text(selectorName + " Station")
    $(selectorSelect).attr("name", selectorName)
    $(selectorSelect).attr("id", selectorName)
    $(selectorDefaultOption).val("default")
    $(selectorDefaultOption).text("Choose Train")

    // Build Dom
    $(body).append(selectorDiv)
    $(selectorDiv).append(selectorHeading)
    $(selectorDiv).append(selectorSelect)
    $(selectorSelect).append(selectorDefaultOption)
    console.log("body", body)
    console.log("$(body)", $(body))

    $$each(stationObjArray, function(statObj) {
        let selectorOption = $('<option>')
        $(selectorOption).val(statObj.abbrev)
        $(selectorOption).text(statObj.fullname)
        $(selectorSelect).append(selectorOption)
    })
    console.log("selectorSelect: ", selectorSelect)
}

// The Loop
(function() {
    var departure = $('#Departure');
    var arrival = $('#Arrival')

    console.log("$(departure):", $(departure))

    // Set up
    $('button').click(function() {
        if ($(departure).val() !== "") {
            let userInput = $(departure).val();
            sendRequest(userInput);
        }
    })

    function sendRequest(search) {
    // Request Departure Object for AJAX
        const getin = 'MW9S-E7SL-26DU-VV8V'
        let departureObj = {
            url: `http://api.bart.gov/api/etd.aspx?cmd=etd&orig=${search}&key=${getin}`,
            method: "GET",
            success: departureSuccess
        };
        // Start the AJAX request
        $.ajax(departureObj);
    }

    function departureSuccess(data) {
        console.log("data:", data)
        let result = $("#result")
        $(result).text(data)

        var parser = new DOMParser();
        var xmlDoc = xmlToJson(data)

        console.log("xmlDoc", xmlDoc)
        $$each(xmlDoc.root.station.etd, function(item) {
            console.log(item)

            console.log(item.destination['#text'])
            var dest = item.destination['#text']
            console.log("DEST!!!!!!", dest)

            var est = item.estimate;
            console.log("est:", est)
            if (Array.isArray(est)) {
                var mins = item.estimate[0].minutes['#text']
                console.log(item.estimate[0].minutes['#text'])
            } else if (typeof est === 'object') {
                console.log("typeof est:", est)
                var mins = item.estimate.minutes['#text']
                console.log(item.estimate.minutes['#text'])
            }
            var body2 = $('body')
            var h3dest = $('<h3>')
            var h3mins = $('<h3>')
            console.log("$(h3mins)", $(h3mins))
            $(h3dest).text(dest + " train leaves in")
            $(h3mins).text(mins + " minutes")
            $(body2).append(h3dest)
            $(body2).append(h3mins)
        })
    }
})();

// Copyright David Shin 2016
// All Rights Reserved
