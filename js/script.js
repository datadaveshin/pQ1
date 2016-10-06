"use strict";

// $(document).ready(function() {
//     $('select').material_select();
// });


/**
TODO Fix the input for Selectors, need station abbreviations
TODO Inject Selectors into sections with different ID's
1) Use SED/AWK to set up the input
2) Use jQuery and $$each go load
*/

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

// Setup Selectors
genSelector("Departure")
genSelector("Arrival")
// function genSelector(selectorName) {
//     let body = $('body')
//     let selectorDiv = $('<div>')
//     let selectorHeading = $('<h2>')
//     var selectorSelect = $('<select>')
//     let selectorDefaultOption = $('<option>')
//
//     // Set attributes, names, values
//     $(selectorDiv).attr("id", selectorName + "selector")
//     $(selectorDiv).attr("id", selectorName + "selector")
//     $(selectorDiv).addClass("container")
//     $(selectorSelect).attr("name", selectorName)
//     $(selectorSelect).attr("id", selectorName)
//     $(selectorSelect).addClass("browser-default")
//     $(selectorDefaultOption).val("default")
//     $(selectorDefaultOption).text("Choose Train")
//
//     // Build Dom
//     $(body).append(selectorDiv)
//     $(selectorDiv).append(selectorHeading)
//     $(selectorDiv).append(selectorSelect)
//     $(selectorSelect).append(selectorDefaultOption)
//     // $(selectorSelect).material_select()
//     console.log("body", body)
//     console.log("$(body)", $(body))
//
//     $$each(stationObjArray, function(statObj) {
//         let selectorOption = $('<option>')
//         $(selectorOption).val(statObj.abbrev)
//         $(selectorOption).text(statObj.fullname)
//         $(selectorSelect).append(selectorOption)
//         // $('select').material_select();
//     })
//     console.log("selectorSelect: ", selectorSelect)
//     // $('select').material_select(); // Needed to show selectors using materialize
// }

function genSelector(selectorName) {
    let body = $('body')
    let selectorDiv = $('<div>')
    let selectorHeading = $('<h2>')
    var selectorSelect = $('<select>')
    let selectorDefaultOption = $('<option>')

    // Set attributes, names, values
    $(selectorDiv).attr("id", selectorName + "selector")
    $(selectorDiv).attr("id", selectorName + "selector")
    $(selectorDiv).addClass("container")
    $(selectorSelect).attr("name", selectorName)
    $(selectorSelect).attr("id", selectorName)
    $(selectorSelect).addClass("browser-default")
    $(selectorDefaultOption).val("default")
    $(selectorDefaultOption).text("Choose Train")

    // Build Dom
    $(body).append(selectorDiv)
    $(selectorDiv).append(selectorHeading)
    $(selectorDiv).append(selectorSelect)
    $(selectorSelect).append(selectorDefaultOption)
    // $(selectorSelect).material_select()
    console.log("body", body)
    console.log("$(body)", $(body))

    $$each(stationObjArray, function(statObj) {
        let selectorOption = $('<option>')
        $(selectorOption).val(statObj.abbrev)
        $(selectorOption).text(statObj.fullname)
        $(selectorSelect).append(selectorOption)
        // $('select').material_select();
    })
    console.log("selectorSelect: ", selectorSelect)
    // $('select').material_select(); // Needed to show selectors using materialize
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
            // sendRequest('mont');
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
        // let result = $("#result")
        // $(result).text(data)
        $( "div" ).remove( "#Departureselector" );
        // $("#Departureselector").remove()

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
            var div2 = $('<div id="results" class="container">')
            var h3dest = $('<h3>')
            var h4mins = $('<h4>')
            console.log("$(h4mins)", $(h4mins))
            $(h3dest).text(dest + " train leaves in")
            $(h4mins).text(mins + " minutes")
            $(body2).append(div2)
            $(div2).append(h3dest)
            $(div2).append(h4mins)
        })
    }
})();

// Copyright David Shin 2016
// All Rights Reserved
