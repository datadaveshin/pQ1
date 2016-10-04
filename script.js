"use strict";

/**
TODO Fix the input for Selectors, need station abbreviations
TODO Inject Selectors into sections with different ID's
1) Use SED/AWK to set up the input
2) Use jQuery and $$each go load
*/
// Setup Selectors

// The Loop
(function() {
    var departure = $('#departure');
    var arrival = $('#arrival')

    console.log("$(departure):", $(departure))

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
    }
})();

// Copyright David Shin 2016
// All Rights Reserved
