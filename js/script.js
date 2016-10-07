"use strict";
console.log('###$$$$$$@@@********  IN SCRIPT script.js *********@@@$$$$$$$###')

/**
Bart Station Abbreviations used by api
*/
var stationAbbrev = ["12th","16th","19th","24th","ashb","balb","bayf","cast","civc","cols","colm","conc","daly","dbrk","dubl","deln","plza","embr","frmt","ftvl","glen","hayw","lafy","lake","mcar","mlbr","mont","nbrk","ncon","oakl","orin","pitt","phil","powl","rich","rock","sbrn","sfia","sanl","shay","ssan","ucty","warm","wcrk","wdub","woak"]

/**
Bar Station Full Names used by api
*/
var stationFull = ["12th St. Oakland City Center","16th St. Mission (SF)","19th St. Oakland","24th St. Mission (SF)","Ashby (Berkeley)","Balboa Park (SF)","Bay Fair (San Leandro)","Castro Valley","Civic Center (SF)","Coliseum","Colma","Concord","Daly City","Downtown Berkeley","Dublin/Pleasanton","El Cerrito del Norte","El Cerrito Plaza","Embarcadero (SF)","Fremont","Fruitvale (Oakland)","Glen Park (SF)","Hayward","Lafayette","Lake M   erritt (Oakland)","MacArthur (Oaklanßd)","Millbrae","Montgomery St. (SF)","North Berkeley","North Concord/Martinez","Oakland Int'l Airport","Orinda","Pittsburg/Bay Point","Pleasant Hill","Powell St. (SF)","Richmond","Rockridge (Oakland)","San Bruno","San Francisco Int'l Airport","San Leandro","South Hayward","South San Francisco","Union City","Warm Springs/South Fremont","Walnut Creek","West Dublin","West Oakland"]

/**
Define a Station Class
*/
function Station(abbrev, fullname) {
    this.abbrev = abbrev || "";
    this.fullname = fullname || "";
}

/**
Array that contains a Station instance for each Bart Station
*/
var stationObjArray = [];
$$each(stationAbbrev, function(_dummy, idx) {
   let retArr = []
   let stationObj = new Station(stationAbbrev[idx], stationFull[idx])
   stationObjArray.push(stationObj)
})

console.log("stationObjArray:", stationObjArray)

// Setup Selectors
genSelector("Departure", "#point2")
genSelector("Arrival", "#point2")

/**
Generates and injects <select> tags to body
i: Name for the <select> `id` and `name` for reference
o: Selector attached to element with each station as option
TODO: inject these to a specific <div> in html
TODO: use array as parameter to generalize
*/
function genSelector(selectorName, attachmentPoint) {
    // let body = $('body')
    // let body = $('body')
    let point1 = $(attachmentPoint)
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
    // $(selectorSelect).addClass("browser-default")
    $(selectorDefaultOption).val("default")
    $(selectorDefaultOption).text("Choose Train")

    // Build Dom
    $(point1).append(selectorDiv)
    $(selectorDiv).append(selectorHeading)
    $(selectorDiv).append(selectorSelect)
    $(selectorSelect).append(selectorDefaultOption)

    $$each(stationObjArray, function(statObj) {
        let selectorOption = $('<option>')
        $(selectorOption).val(statObj.abbrev)
        $(selectorOption).text(statObj.fullname)
        $(selectorSelect).append(selectorOption)
    })
    console.log("selectorSelect: ", selectorSelect)
}

/**
Setup Buttons
*/
function addButton(aButtonID, buttonText, attachmentPoint) {
    let newButton = $('<button>')
    $(newButton).addClass("waves-effect btn col s6")
    $(newButton).attr("id", aButtonID)
    $(newButton).text(buttonText)

    console.log("MY NEW BUTTON", newButton);
    let sectionPart = $(attachmentPoint)
    $(sectionPart).append(newButton)
    console.log("sectionPart", sectionPart);
    console.log("$(sectionPart)", $(sectionPart));
}

addButton("button", "Real Time", "#point1");
addButton("button2", "Get Seat", "#point1");
// addButton("aButtonID", "buttonText", "attachmentPoint");

function test1() {
    console.log("\nFUNCITON TEST1 IS WORKING!!!!!!!!!!!!!!!!!\n")
}
test1();


/**
Application Loop
*/
(function() {
    console.log("\n##### ANONYMOUS LOOP FUNCTION WORKING!!!  #######\n")


    // console.log("$(departure):", $(departure))

    // Set up
    $('button').click(function() {
        let departure = $('#Departure');
        let arrival = $('#Arrival')
        let depVal = $(departure).val()
        let arrVal = $(arrival).val()
        console.log("Departure Val~~~~~~~~~~~~~~~~~>", depVal)
        console.log("Arrival Val~~~~~~~~~~~~~~~~~>", arrVal)

        if (depVal !== "default" && arrVal === "default") {
            sendDepRealReq(depVal);
        }
        else if (depVal !== "default" && arrVal !== "default") {
            console.log("both in the house");
        }
    })

    function sendDepRealReq(search) {
    // Request Departure Object for AJAX
        const getin = 'MW9S-E7SL-26DU-VV8V'
        let departureObj = {
            url: `http://api.bart.gov/api/etd.aspx?cmd=etd&orig=${search}&key=${getin}`,
            method: "GET",
            success: depRealSuccess
        };
        // Start the AJAX request
        $.ajax(departureObj);
    }

    function depRealSuccess(data) {
        console.log("data:", data)
        
        $( "div" ).remove( "#results" );

        var xmlDoc = xmlToJson(data)
        console.log("xmlDoc", xmlDoc)

        if (Array.isArray(xmlDoc.root.station.etd)) {
            $$each(xmlDoc.root.station.etd, function(departureObj) {
                var dest = departureObj.destination['#text']
                console.log("\n#### DESTINATION!!!!!!", dest, "\n")
                console.log("departureObj", departureObj)
                console.log(departureObj.destination['#text'])

                var est = departureObj.estimate;
                console.log("est:", est)
                if (Array.isArray(est)) {
                    var mins = departureObj.estimate[0].minutes['#text']
                    console.log(departureObj.estimate[0].minutes['#text'])
                    var routeColor = departureObj.estimate[0].color['#text']
                } else if (typeof est === 'object') {
                    console.log("typeof est:", est)
                    var mins = departureObj.estimate.minutes['#text']
                    console.log(departureObj.estimate.minutes['#text'])
                    var routeColor = departureObj.estimate.color['#text']
                }
                // var body2 = $('body')
                var point3 = $('#point3')
                var div2 = $('<div id="results" class="container">')
                var destinationResults = $('<h5>')
                var timeResults = $('<h6>')
                console.log("$(timeResults)", $(timeResults))
                $(destinationResults).text(dest + " Train")
                $(destinationResults).css("backgroundColor", routeColor)

                if (["RED", "GREEN", "BLUE"].indexOf(routeColor) !== -1) {
                    $(destinationResults).css("color", "white");
                }

                $(timeResults).text(mins + " minutes");
                $(point3).append(div2);
                $(div2).append(destinationResults);
                $(div2).append(timeResults);
            })
        }
    }
})();

// Copyright David Shin 2016
// All Rights Reserved
