"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:51739/chat").build();

//Disable the send button until connection is established.
$('#SignalRid').text('Not Started');
connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});

connection.on("refreshColumnStatus", function (rdata) {
    debugger;
    $('#SignalRid').text('Success');
    alert(rdata);
    /*
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].noOfExtension >= 1) {
                jQuery('#lblTimeLeft', '#lblTimeLeftD').css('color', 'red');
                jQuery('#lblTimeLeftTxt', '#lblTimeLeftTxtD').removeClass('display-none');
                jQuery('#lblTimeLeftTxt', '#lblTimeLeftTxtD').html('<b>Bid Time Extended.</b>').css('color', 'red')
            }
            else {
                jQuery('#lblTimeLeftTxt', '#lblTimeLeftTxtD').addClass('display-none');
                jQuery('#lblTimeLeft', '#lblTimeLeftD').css('color', '');
            }
            jQuery("#lblbidduration").text(data[0].bidDuration);
            display = document.querySelector('#lblTimeLeft', '#lblTimeLeftD');
            startTimer(data[i].timeLeft, display);
            $("#initialquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
            $("#iqquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
            $("#lastQuote" + i).html(data[i].lqQuotedPrice == '0' ? '' : thousands_separators(data[i].lqQuotedPrice))
            $("#lblstatus" + i).html(data[i].loQuotedPrice)
            $("#L1Price" + i).html(thousands_separators(data[i].l1Quote))
            if (data[i].maskL1Price == 'N') {
                $("#L1Price" + i).html('Not Disclosed');
            }
            if (data[i].loQuotedPrice == 'L1') {
                jQuery('#lblstatus' + i).css('color', 'Blue');
            }
            else {
                jQuery('#lblstatus' + i).css('color', 'Red');
            }
            if (data[i].itemNoOfExtension > 0) {
                jQuery('#itemleft' + i).css({
                    'color': 'Red',
                    'font-weight': '500'
                });
                jQuery('#itemleftTime' + i).css({
                    'color': 'Red',
                    'font-weight': '500'
                });
            }
        }
    }
    */

});
connection.start().then(function () {
   
    $('#SignalRid').text('connection started');
   // document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});


function InsUpdQuoteSeaExport(index) {
    var vendorID = 0;
    vendorID = sessionStorage.getItem('VendorId');
    var insertquery = '';
    var value = 0;
    var valuejap = 0;
    var v = 0;
    var vjap = 0;
    var Amount = $('#minimumdec' + index).text()
    if ($('#decon' + index).text() == "A") {
        if (jQuery("#lastQuote" + index).text() == '' || jQuery("#lastQuote" + index).text() =='0') {
            value = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
            valuejap = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
           
        }
        else {
            value = (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))).toFixed(2)
            //valuejap = parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
            valuejap = (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator(Amount))).toFixed(2)
        }

    }
    else {
        if (jQuery("#lastQuote" + index).text() == '') {
            value = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + index).val())))).toFixed(2);
            v = (parseFloat(removeThousandSeperator($('#txtquote' + index).val()))).toFixed(2)
            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + index).val())))).toFixed(2);
            vjap = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
        }
        else {
            value = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())))).toFixed(2);
            v = (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))).toFixed(2);

            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())))).toFixed(2);
            vjap = (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))).toFixed(2);
        }
    }
    var valdiff = parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text()) - removeThousandSeperator(jQuery("#txtquote" + index).val())).toFixed(2)
    if ((removeThousandSeperator($('#txtquote' + index).val()) == 0) || (!/^[0-9]+(\.[0-9]{1,2})?$/.test(removeThousandSeperator($('#txtquote' + index).val())))) {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Amount is required in number only')
        return false
    }
    else if (parseFloat(removeThousandSeperator($('#ceilingprice' + index).text())) < parseFloat(removeThousandSeperator($('#txtquote' + index).val()))) {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Amount should be less than Bid start price')
        return false
    }
    else if (jQuery("#L1Price" + index).text() != "0" && BidForID == "83" && valdiff < parseFloat(Amount) && $('#decon' + index).text() == "A") {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text() + ".")
        return false
    }
    else if (value < parseFloat(Amount) && $('#decon' + index).text() == "A" && value != 0 && BidForID == "81") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text())
        return false
    }
    else if (valuejap < parseFloat(Amount) && $.trim($('#decon' + index).text() == "A") && value != 0 && $.trim(BidForID) == "83") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text() + ".")
        return false
    }
    else if (v < value && $('#decon' + index).text() == "P" && BidForID == "81") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + '%')
        return false
    }
    else if (vjap < valuejap && $('#decon' + index).text() == "P" && BidForID == "83") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + '%')
        return false
    }
    else {
       
        insertquery = $('#seid' + index).html() + '~' + removeThousandSeperator($('#txtquote' + index).val());
        if ($('#hdnval').val() >= 60) {
            var QuoteProduct = {
                "VendorID": vendorID,
                "BidID": parseInt(sessionStorage.getItem("BidID")),
                "insertQuery": insertquery,
                "EnteredBy": vendorID,
                "Quote": parseFloat(removeThousandSeperator($('#txtquote' + index).val())),
                "SEID": parseInt($('#seid' + index).html()),
                "AdvFactor": parseFloat($("#hdnAdvFactor").val()),
                "ForRFQ": "N"

            }
                 jQuery.ajax({
                     url: sessionStorage.getItem("APIPath") + "VendorParticipation/ParticipationSeaExport/",
                     beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                     type: "POST",
                     data: JSON.stringify(QuoteProduct),
                     contentType: "application/json; charset=utf-8",
                     success: function(data, status, jqXHR) {
                         connection.invoke("SubmitBidParticipation", QuoteProduct).catch(function (err) {
                             return console.error(err.toString());
                         });
                         return true;
                     },
                    
                 });
     
                
            }
        else {
                    var QuoteProduct = {
                        "VendorID": vendorID,
                        "BidID": parseInt(sessionStorage.getItem("BidID")),
                        "insertQuery": insertquery,
                        "EnteredBy": vendorID,
                        "Quote": parseFloat(removeThousandSeperator($('#txtquote' + index).val())),
                        "SEID": parseInt($("#seid" + index).html()),
                        "AdvFactor": parseFloat($("#hdnAdvFactor").val()),
                        "ForRFQ": "N"

                    }
           
            jQuery.ajax({
                        url: sessionStorage.getItem("APIPath") + "VendorParticipation/ParticipationSeaExport/",
                        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                        type: "POST",
                        data: JSON.stringify(QuoteProduct),
                        contentType: "application/json; charset=utf-8",
                        success: function (data, status, jqXHR) {
                            if (data == "-1") {
                                $('#spanmszA' + index).removeClass('hide')
                                $('#spanmszA' + index).text('already Quoted by someone.');
                            }
                            else {
                                jQuery("#txtquote" + index).val('');

                                extendbidA()
                            }
                            return true;

                        },
                        error: function (xhr) {

                            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                            if (xhr.status == 401) {
                                error401Messagebox(err.Message);
                            }
                            else {
                                fnErrorMessageText('error', '');
                            }
                            jQuery.unblockUI();
                            return false;
                        }
                    });
           

                }

    }
    }

