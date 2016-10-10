"use strict";
/**
Needed by Materialize to implement <select> tags
*/
$(document).ready(function() {
    $('select').material_select();
});

console.log('###$$$$$$@@@********  IN SCRIPT script.js *********@@@$$$$$$$###')

/**
Initialize Departure arrays and variables
destArrBack0 is your station
destArrBack1 is one station back, etc.
*/
var depVal;
var arrVal;
var reqDirection;
var destArrBack0 = [];
var destArrBack1 = [];
var destArrBack2 = [];
var destArrBack3 = [];

/**
Initialize returnCondition
0 = no options
1 = realtime full list for the Departure station
2 = realtime filtered list for Departure station based on direction
3 = get seat filters for direct trip, reverse directions
*/
var returnCondition = 0;

/**
Bart Station Abbreviations used by api
*/
var stationAbbrev = ["12th","16th","19th","24th","ashb","balb","bayf","cast","civc","cols","colm","conc","daly","dbrk","dubl","deln","plza","embr","frmt","ftvl","glen","hayw","lafy","lake","mcar","mlbr","mont","nbrk","ncon","oakl","orin","pitt","phil","powl","rich","rock","sbrn","sfia","sanl","shay","ssan","ucty","warm","wcrk","wdub","woak"]

/**
Bar Station Full Names used by api
*/
var stationFull = ["12th St. Oakland City Center","16th St. Mission (SF)","19th St. Oakland","24th St. Mission (SF)","Ashby (Berkeley)","Balboa Park (SF)","Bay Fair (San Leandro)","Castro Valley","Civic Center (SF)","Coliseum","Colma","Concord","Daly City","Downtown Berkeley","Dublin/Pleasanton","El Cerrito del Norte","El Cerrito Plaza","Embarcadero (SF)","Fremont","Fruitvale (Oakland)","Glen Park (SF)","Hayward","Lafayette","Lake Merritt (Oakland)","MacArthur (Oakland)","Millbrae","Montgomery St. (SF)","North Berkeley","North Concord/Martinez","Oakland Int'l Airport","Orinda","Pittsburg/Bay Point","Pleasant Hill","Powell St. (SF)","Richmond","Rockridge (Oakland)","San Bruno","San Francisco Int'l Airport","San Leandro","South Hayward","South San Francisco","Union City","Warm Springs/South Fremont","Walnut Creek","West Dublin","West Oakland"]

// Define Routes
var route8 = ["MLBR", "SBRN", "SSAN", "COLM", "DALY", "BALB", "GLEN", "24TH", "16TH", "CIVC", "POWL", "MONT", "EMBR", "WOAK", "12TH", "19TH", "MCAR", "ASHB", "DBRK", "NBRK", "PLZA", "DELN", "RICH"]

route8 = route8.map(function(item) {return item.toLowerCase();});
console.log("route8", route8)

var route2 = ["MLBR", "SFIA", "SBRN", "SSAN", "COLM", "DALY", "BALB", "GLEN", "24TH", "16TH", "CIVC", "POWL", "MONT", "EMBR", "WOAK", "12TH", "19TH", "MCAR", "ROCK", "ORIN", "LAFY", "WCRK", "PHIL", "CONC", "NCON", "PITT"]

route2 = route2.map(function(item) {return item.toLowerCase();});
console.log("route2", route2)

// Make Clusters
var clusterRICH = ["ASHB", "DBRK", "NBRK", "PLZA", "DELN", "RICH"]

var clusterSFIA = ["MLBR", "SFIA", "SBRN", "SSAN", "COLM"]

var clusterSanFran = ["DALY", "BALB", "GLEN", "24TH", "16TH", "CIVC", "POWL", "MONT", "EMBR"]

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
    $(selectorDefaultOption).text(selectorName + " Station")

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
    $(newButton).addClass("waves-effect btn col s4")
    $(newButton).attr("id", aButtonID)
    $(newButton).text(buttonText)

    console.log("MY NEW BUTTON", newButton);
    let sectionPart = $(attachmentPoint)
    $(sectionPart).append(newButton)
    console.log("sectionPart", sectionPart);
    console.log("$(sectionPart)", $(sectionPart));
}

addButton("realTime", "All Trains", "#point1");
addButton("directTrains", "Direct", "#point1");
addButton("getSeat", "Get Seat", "#point1");
// addButton("aButtonID", "buttonText", "attachmentPoint");

function test1() {
    console.log("\nFUNCITON TEST1 IS WORKING!!!!!!!!!!!!!!!!!\n")
}
test1();

function checkDirection(here, there) {
    /* TODO use a full route array and check for here and there in it all of them, return a subArray, then do the calculation. For now, using route8 for a test*/
    let routeArr = route8 // THE TEST ARRAY TO BE REMOVED
    let hereIdx = routeArr.indexOf(here)
    let thereIdx = routeArr.indexOf(there)
    console.log("hereIdx", hereIdx, "thereIdx", thereIdx);
    if (thereIdx > hereIdx) {
        return "North"
    } else if (thereIdx < hereIdx) {
        return "South"
    } else if (thereIdx === hereIdx) {
        return "Same"
    }
}

/**
Application Loop
*/
(function() {
    console.log("\n\n\n##### ANONYMOUS LOOP FUNCTION WORKING!!!  #######\n")

    // console.log("$(departure):", $(departure))

    // Set up
    $('#realTime').click(function() {
        let departure = $('#Departure');
        let arrival = $('#Arrival')
        depVal = $(departure).val()
        arrVal = $(arrival).val()
        console.log("\n\n\n\nDeparture Val~~~~~~~~~~~~~~~~~>", depVal)
        console.log("Arrival Val~~~~~~~~~~~~~~~~~>", arrVal)
        if (depVal === "default" && arrVal === "default") {
            returnCondition = 1;
        }
        else if (depVal !== "default" && arrVal === "default") {
            returnCondition = 1;
            sendDepRealReq(depVal);
        }
        else if (depVal !== "default" && arrVal !== "default") {
            returnCondition = 1;
            reqDirection = checkDirection(depVal, arrVal) // Will return array later with all related lines to account for multiple trains
            console.log("both in the house - reqDirection is", reqDirection);
            sendDepRealReq(depVal);
        }

    });

    $('#directTrains').click(function() {
        let departure = $('#Departure');
        let arrival = $('#Arrival')
        depVal = $(departure).val()
        arrVal = $(arrival).val()
        console.log("\n\n\n\nDeparture Val~~~~~~~~~~~~~~~~~>", depVal)
        console.log("Arrival Val~~~~~~~~~~~~~~~~~>", arrVal)
        if (depVal === "default" && arrVal === "default") {
            returnCondition = 1;
        }
        else if (depVal !== "default" && arrVal === "default") {
            returnCondition = 1;
            // sendDepRealReq(depVal);
        }
        else if (depVal !== "default" && arrVal !== "default") {
            returnCondition = 2;
            reqDirection = checkDirection(depVal, arrVal) // Will return array later with all related lines to account for multiple trains
            console.log("both in the house - reqDirection is", reqDirection);
            sendDepRealReq(depVal);
        }

    });

    $('#getSeat').click(function() {
        let departure = $('#Departure');
        let arrival = $('#Arrival')
        depVal = $(departure).val()
        arrVal = $(arrival).val()
        console.log("\n\n\n\nDeparture Val~~~~~~~~~~~~~~~~~>", depVal)
        console.log("Arrival Val~~~~~~~~~~~~~~~~~>", arrVal)
        if (depVal === "default" && arrVal === "default") {
            returnCondition = 1;
        }
        else if (depVal !== "default" && arrVal === "default") {
            returnCondition = 1;
        }
        else if (depVal !== "default" && arrVal !== "default") {
            returnCondition = 3;
            reqDirection = checkDirection(depVal, arrVal) // Will return array later with all related lines to account for multiple trains
            console.log("both in the house - reqDirection is", reqDirection);
            sendDepRealReq(depVal);
        }
    });

    // console.log("$$ THE returnCondition $$", returnCondition);

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
    };

    function depRealSuccess(data) {
        console.log("data:", data)

        $( "div" ).remove( "#results" );

        var xmlDoc = xmlToJson(data)
        console.log("xmlDoc", xmlDoc)

        let departureObjArr = [];
        if (Array.isArray(xmlDoc.root.station.etd)) {
            $$each(xmlDoc.root.station.etd, function(departureObj) {
                departureObjArr.push(departureObj)
            });
        } else if (typeof xmlDoc.root.station.etd === 'object') {
            departureObjArr.push(xmlDoc.root.station.etd)
        }
        console.log("$$ THE returnCondition $$", returnCondition);

        console.log("OUR NEW departureObjArr", departureObjArr);



        /* PRINT RESULTS FOR RETURN CONDITION 1) */
        if (returnCondition === 1) {
            output1();
        }
        else if (returnCondition === 2) {
            output2();
        }
        else if (returnCondition === 3) {
            output3();
        }

        /*
        OUTPUT1 - shows all trains for departure stop
        */
        function output1() {
            $$each(departureObjArr, function(departureObj) {
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


        function output2() {
            departureObjArr = $$filter(departureObjArr, function(departureObj) {
                let depAbbr = departureObj.abbreviation
                console.log("Filter candidates", depAbbr['#text']);
                // Change PREDICATE to reflect all trains going to abbreviation
                if (reqDirection === "North") {
                    return depAbbr['#text'] === "RICH"
                } else if (clusterSanFran.indexOf(arrVal.toUpperCase()) !== -1) {
                    return (clusterSanFran.indexOf(depAbbr['#text']) !== -1 || clusterSFIA.indexOf(depAbbr['#text']) !== -1)
                } else if (clusterSFIA.indexOf(arrVal.toUpperCase()) !== -1) {
                    return (clusterSFIA.indexOf(depAbbr['#text']) !== -1)
                }
            })
            $$each(departureObjArr, function(departureObj) {
                var dest = departureObj.destination['#text']
                console.log("\n#### DESTINATION!!!!!!", dest, "\n")
                console.log("departureObj", departureObj)
                console.log(departureObj.destination['#text'])

                var est = departureObj.estimate;
                console.log("est:", est)
                if (Array.isArray(est)) {
                    $$each(est, function(anEst) {

                    // var mins = departureObj.estimate[0].minutes['#text']
                    // console.log(departureObj.estimate[0].minutes['#text'])
                    // var routeColor = departureObj.estimate[0].color['#text']
                    var mins = anEst.minutes['#text']
                    console.log(anEst.minutes['#text'])
                    var routeColor = anEst.color['#text']

                    //### Repeated code
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
                    //### Repeated code

                })


                } else if (typeof est === 'object') {
                    console.log("typeof est:", est)
                    var mins = departureObj.estimate.minutes['#text']
                    console.log(departureObj.estimate.minutes['#text'])
                    var routeColor = departureObj.estimate.color['#text']

                    //### Repeated code
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
                    //### Repeated code

                }

            });

        }

        function output3() {
            console.log("IN OUTPUT 3 BLOCK 1");
            var departureObjArr1 = $$filter(departureObjArr, function(departureObj) {
                let depAbbr = departureObj.abbreviation
                console.log("Filter candidates", depAbbr['#text']);
                // Change PREDICATE to reflect all trains going to abbreviation
                if (reqDirection === "North") {
                    return depAbbr['#text'] === "RICH"
                } else if (clusterSanFran.indexOf(arrVal.toUpperCase()) !== -1) {
                    return (clusterSanFran.indexOf(depAbbr['#text']) !== -1 || clusterSFIA.indexOf(depAbbr['#text']) !== -1)
                } else if (clusterSFIA.indexOf(arrVal.toUpperCase()) !== -1) {
                    return (clusterSFIA.indexOf(depAbbr['#text']) !== -1)
                }
            })
            $$each(departureObjArr1, function(departureObj) {
                var dest = departureObj.destination['#text']
                console.log("\n#### DESTINATION!!!!!!", dest, "\n")
                console.log("departureObj", departureObj)
                console.log(departureObj.destination['#text'])

                var est = departureObj.estimate;
                console.log("est:", est)
                if (Array.isArray(est) === false) {
                    est = [est];
                }
                // if (Array.isArray(est)) {
                // $$each(est, function(anEst) {

                    // var mins = departureObj.estimate[0].minutes['#text']
                    // console.log(departureObj.estimate[0].minutes['#text'])
                    // var routeColor = departureObj.estimate[0].color['#text']
                    var mins = est[0].minutes['#text']
                    console.log(est[0].minutes['#text'])
                    var routeColor = est[0].color['#text']

                    //### Repeated code
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
                    //### Repeated code

                // })

            })


            //########## Backwards block
            console.log("IN OUTPUT 3 BLOCK 2");
            var departureObjArr2 = $$filter(departureObjArr, function(departureObj) {
                let depAbbr = departureObj.abbreviation
                console.log("Filter candidates", depAbbr['#text']);
                // Change PREDICATE to reflect all trains going to abbreviation
                // if (reqDirection === "North") {
                //     return depAbbr['#text'] === "RICH"
                // } else

                var testCase = "DALY"

                if (clusterSanFran.indexOf(testCase) !== -1) {
                    return (clusterSanFran.indexOf(testCase) !== -1 || clusterSFIA.indexOf(testCase) !== -1)
                } else if (clusterSFIA.indexOf(testCase) !== -1) {
                    return (clusterSFIA.indexOf(testCase) !== -1)
                }
            })
            $$each(departureObjArr2, function(departureObj) {
                var dest = departureObj.destination['#text']
                console.log("\n#### DESTINATION!!!!!!", dest, "\n")
                console.log("departureObj", departureObj)
                console.log(departureObj.destination['#text'])

                var est = departureObj.estimate;
                console.log("est:", est)
                if (Array.isArray(est) === false) {
                    est = [est];
                }
                // if (Array.isArray(est)) {
                // $$each(est, function(anEst) {

                    // var mins = departureObj.estimate[0].minutes['#text']
                    // console.log(departureObj.estimate[0].minutes['#text'])
                    // var routeColor = departureObj.estimate[0].color['#text']
                    var mins = est[0].minutes['#text']
                    console.log(est[0].minutes['#text'])
                    var routeColor = est[0].color['#text']

                    //### Repeated code
                    var point3 = $('#point3')

                    var div2b = $('<div id="results" class="container">')
                    var destinationResults = $('<h5>')
                    var timeResults = $('<h6>')
                    console.log("$(timeResults)", $(timeResults))
                    $(destinationResults).text(dest + " Train")
                    $(destinationResults).css("backgroundColor", routeColor)

                    if (["RED", "GREEN", "BLUE"].indexOf(routeColor) !== -1) {
                        $(destinationResults).css("color", "white");
                    }

                    $(timeResults).text(mins + " minutes");
                    $(point3).append(div2b);
                    $(div2b).append(destinationResults);
                    $(div2b).append(timeResults);
                    //### Repeated code
                // })
            })
            // ########## Backwards block end
        }
    };
})();


// Copyright David Shin 2016
// All Rights Reserved
