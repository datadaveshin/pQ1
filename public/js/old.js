
    // function depRealSuccess(data) {
    //     console.log("data:", data)
    //
    //     $( "div" ).remove( "#results" );
    //
    //     var xmlDoc = xmlToJson(data)
    //     console.log("xmlDoc", xmlDoc)
    //
    //     let departureAllCarArr = [];
    //     let departureSingleCarArr = [];
    //
    //     if (Array.isArray(xmlDoc.root.station.etd)) {
    //         $$each(xmlDoc.root.station.etd, function(departureObj) {
    //             var dest = departureObj.destination['#text']
    //             console.log("\n#### DESTINATION!!!!!!", dest, "\n")
    //             console.log("departureObj", departureObj)
    //             console.log(departureObj.destination['#text'])
    //
    //             var est = departureObj.estimate;
    //             console.log("est:", est)
    //             if (Array.isArray(est)) {
    //                 var mins = departureObj.estimate[0].minutes['#text']
    //                 console.log(departureObj.estimate[0].minutes['#text'])
    //                 var routeColor = departureObj.estimate[0].color['#text']
    //             } else if (typeof est === 'object') {
    //                 console.log("typeof est:", est)
    //                 var mins = departureObj.estimate.minutes['#text']
    //                 console.log(departureObj.estimate.minutes['#text'])
    //                 var routeColor = departureObj.estimate.color['#text']
    //             }
    //             // var body2 = $('body')
    //             var point3 = $('#point3')
    //             var div2 = $('<div id="results" class="container">')
    //             var destinationResults = $('<h5>')
    //             var timeResults = $('<h6>')
    //             console.log("$(timeResults)", $(timeResults))
    //             $(destinationResults).text(dest + " Train")
    //             $(destinationResults).css("backgroundColor", routeColor)
    //
    //             if (["RED", "GREEN", "BLUE"].indexOf(routeColor) !== -1) {
    //                 $(destinationResults).css("color", "white");
    //             }
    //
    //             $(timeResults).text(mins + " minutes");
    //             $(point3).append(div2);
    //             $(div2).append(destinationResults);
    //             $(div2).append(timeResults);
    //         })
    //     }
    // }
