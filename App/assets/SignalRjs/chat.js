"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:51739/bid?bidid=" + sessionStorage.getItem('BidID')).build();

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

connection.on("refreshColumnStatus", function () {
    debugger;
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType") + "&_isBidStarted=" + _isBidStarted + "";
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
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
                    // $("#iqquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
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
        }
    });
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





