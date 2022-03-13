var BidTypeID = 0;
var BidForID = 0;
var Duration = '0.00';
var form1 = $('#FormparticipateAir');
var error1 = $('.alert-danger', form1);
var success1 = $('.alert-success', form1);
var _isBidStarted = true;
var display = "";
jQuery('#bid_EventID').html("Event ID : " + sessionStorage.getItem("BidID"));
$(document).on("keyup", "#tblParticipantsVender .form-control", function () {
    var txt = this.id
    $('#' + txt).next(':first').addClass('hide');

});

/////****** Chat Start*****************/////
var connection = new signalR.HubConnectionBuilder().withUrl(sessionStorage.getItem("APIPath") + "bid?bidid=" + sessionStorage.getItem('BidID') + "&userType=" + sessionStorage.getItem("UserType") + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID'))).build();

console.log("Not Started")
connection.start({ transport: ['webSockets', 'serverSentEvents', 'foreverFrame', 'longPolling'] }).then(function () {
    console.log("connection started")
}).catch(function (err) {
    console.log(err.toString())
});
connection.on("refreshColumnStatusFA", function (data) {
    if (data == "-1") {
        $('#spanamount' + $('#hdnselectedindex').val()).removeClass('hide')
        $('#spanamount' + $('#hdnselectedindex').val()).text('already Quoted by someone.');
        return false;
    }
    else {

        clearInterval(mytime)
        url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryPefa/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType")
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

                            jQuery('#lblTimeLeft').css('color', 'red');
                            jQuery('#lblTimeLeftTxt').removeClass('display-none');
                            jQuery('#lblTimeLeftTxt').html('<b>Bid Time Extended.</b>').css('color', 'red')
                        }
                        else {
                            jQuery('#lblTimeLeftTxt').addClass('display-none');
                            jQuery('#lblTimeLeft').css('color', '');
                        }
                        display = document.querySelector('#lblTimeLeft');
                        startTimer(data[i].timeLeft, display);


                        $("#iqquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
                        $("#lastQuote" + i).html(data[i].mqQuotedPrice == '0' ? '' : thousands_separators(data[i].mqQuotedPrice))
                        $("#lblstatus" + i).html(data[i].moQuotedPrice)
                        $("#H1Price" + i).html(thousands_separators(data[i].h1Price))
                        if (data[i].moQuotedPrice == 'H1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else {

                            jQuery('#lblstatus' + i).css('color', 'Red');

                        }
                        if (data[i].showHLPrice == "N") {
                            $("#H1Price" + i).html('Not Disclosed');
                        }

                    }

                }

            },
            error: function (xhr, status, error) {
                var err = xhr.responseText// eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('error', '');
                }
                jQuery.unblockUI();
            }
        });
    }
});
connection.on("refreshTimer", function () {

    url = sessionStorage.getItem("APIPath") + "VendorParticipation/FetchBidTimeLeft/?BidID=" + sessionStorage.getItem('BidID')
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
                jQuery("#lblbidduration").text(data[0].bidDuartion + ' mins');
                display = document.querySelector('#lblTimeLeft');
                startTimer(data[0].timeLeft, display);
            }

        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
        }
    });
})
connection.on("ReceiveMessage", function (objChatmsz) {

    let chat = JSON.parse(objChatmsz)

    //toastr.clear();
    $(".pulsate-regular").css('animation', 'pulse 2s infinite')
    //toastr.success('You have a new message.', 'New Message')
    calltoaster('You have a new message.', 'New Message', 'success');

    $("#hddnadminConnection").val(chat.fromconnectionID)
    // if (sessionStorage.getItem("UserID") != chat.fromID) {
    $("#chatList").append('<div class="post out">'
        + '<div class="message">'
        + '<span class="arrow"></span>'
        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + new Date().toLocaleTimeString() + '</span>' //timeNow()
        + '<span class="body" style="color: #c3c3c3;">' + chat.ChatMsg + '</span>'
        + '</div>'
        + '</div>');
    // }
    // $(".pulsate-regular").css('animation', 'none');
});

connection.on("ReceiveBroadcastMessage", function (objChatmsz) {

    let chat = JSON.parse(objChatmsz)
    //toastr.clear();

    $(".pulsate-regular").css('animation', 'pulse 2s infinite')
    //toastr.success('You have a new message.', 'New Message')
    calltoaster('You have a new message.', 'New Message', 'success');
    $("#hddnadminConnection").val(chat.fromconnectionID)
    // if (sessionStorage.getItem("UserID") == chat.fromID) {
    $("#chatList").append('<div class="post out">'
        + '<div class="message">'
        + '<span class="arrow"></span>'
        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + new Date().toLocaleTimeString() + '</span>'
        + '<span class="body" style="color: #c3c3c3;">' + chat.ChatMsg + '</span>'
        + '</div>'
        + '</div>');
    //  }
    //$(".pulsate-regular").css('animation', 'none');
});
function sendChatMsgs() {

    var data = {
        "ChatMsg": $("#txtChatMsg").val(),
        "fromID": sessionStorage.getItem("UserID"),
        "BidId": (sessionStorage.getItem("BidID") == '0' || sessionStorage.getItem("BidID") == null) ? parseInt(getUrlVarsURL(decryptedstring)["BidID"]) : parseInt(sessionStorage.getItem("BidID")),
        "msgType": 'S',
        "toID": (sessionStorage.getItem("UserType") == 'E') ? $("#hddnVendorId").val() : ''

    }
    $("#chatList").append('<div class="post in">'
        + '<div class="message">'
        + '<span class="arrow"></span>'
        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;"></span>'//time
        + '<span class="body" style="color: #c3c3c3;">' + $("#txtChatMsg").val() + '</span>'
        + '</div>'
        + '</div>');

    connection.invoke("SendMessage", JSON.stringify(data), $('#hddnadminConnection').val()).catch(function (err) {
        return console.error(err.toString());

    });
    $("#txtChatMsg").val('')
}

/////****** Chat END*****************/////
function handlevalidation() {

    form1.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtrentalquote: {
                required: true,
                number: true
            },
            txtmanpowerquote: {
                required: true,
                number: true
            },
            txtinfrastructurequote: {
                required: true,
                number: true
            },
            txtutilityquote: {
                required: true,
                number: true
            },
            txtfeequote: {
                required: true,
                number: true
            }
        },

        messages: {
            txtrentalquote: {
                required: "Please enter amount",
                number: "number only"
            },
            txtmanpowerquote: {
                required: "Please enter amount",
                number: "number only"
            },
            txtinfrastructurequote: {
                required: "Please enter amount",
                number: "number only"
            },
            txtutilityquote: {
                required: "Please enter amount",
                number: "number only"
            },
            txtfeequote: {
                required: "Please enter amount",
                number: "number only"
            }
        },

        invalidHandler: function (event, validator) { //display error alert on form submit   
            success1.hide();
            error1.show();


        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-body').addClass('has-error'); // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.form-body').removeClass('has-error'); // set error class to the control group
        },
        success: function (label) {
            label
                .closest('.form-body').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {

            InsUpdQuotewarehouse();
        }
    });
}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + sessionStorage.getItem('BidID'));
}
function fetchVendorDetails() {


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/FetchBidDetails/?BidID=" + sessionStorage.getItem("BidID") + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            if (data.length == 1) {
                $('#tblParticipantsVender').show();


                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblbidfor").text(data[0].bidFor);

                jQuery("#lnkTermsAttachment").html(data[0].termsConditions);
                if (data[0].attachment != "") {
                    jQuery("#lnkAnyOtherAttachment").text(data[0].attachment);
                }

                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');
                jQuery("#lblcurrency").text(data[0].currencyName);
                jQuery("#lblConvRate").text(data[0].conversionRate);

                _isBidStarted = true;
                $(".lbltimetextdutch").show();
                BidTypeID = data[0].bidTypeID;
                BidForID = data[0].bidForID;
                $('#lblTimeLeftBeforeBid').html('').hide('');
                display = document.querySelector('#lblTimeLeft');
                //debugger;
                if (BidForID == 81 || BidForID == 83) {
                    $(".lbltimetextdutch").hide();
                    fetchBidSummaryVendorScrap();
                    $("#captionAuctionType").html('').html('<i class="fa fa-reorder"></i> H1 indicates you have entered best buying price');

                    startTimer((parseInt(data[0].timeLeft)), display);
                }

                else {
                    $(".lbltimetextdutch").show();
                    $("#captionAuctionType").html('').html('<i class="fa fa-reorder"></i> Bid Items & Offered price');
                    fetchBidSummaryVendorScrapDutch();
                    startTimerDutch((parseInt(data[0].timeLeft)), display);
                } // For Dutch Type Auction

            }
            else if (data.length > 1 || data.length == 0) {
                _isBidStarted = false;
                $(".lbltimetextdutch").hide();
                $('#lblTimeLeftBeforeBid').html('Bid is not  started.').css('color', 'red');
                $('#tblParticipantsVender').hide();
                fetchBidHeaderDetails(sessionStorage.getItem("BidID"));
            }

            $(window).focusout();
            $(window).blur();
        },

        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();

        }
    });

}


var count;
function fetchBidSummaryVendorScrap() {
    count = 0;
    var url = '';
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryPefa/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType");

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            jQuery("#tblParticipantsVender").empty();
            if (_isBidStarted == false) {
                jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product</th><th>Quantity</th><th>UOM</th><th class='hide'>Bid Start Price (" + $('#lblcurrency').text() + ")</th></thead>");

                for (var i = 0; i < data.length; i++) {
                    _offeredPrice = (data[i].offeredPrice < 0) ? 'NA' : data[i].offeredPrice;
                    jQuery("#tblParticipantsVender").append("<tr><td>" + (i + 1) + "</td><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].minimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].increamentOn + "</td><td class=hide id=psid" + i + ">" + data[i].psis + "</td><td>" + data[i].shortName + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=psid" + i + " class='display-none'>" + data[i].psid + "</td><td id='offeredprice" + i + "'  class='hide'>" + data[i].remarks + "</td></tr>");
                }
                $(".lbltimetextdutch").hide();
            } else {
                if (data.length > 0) {

                    jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product</th><th>Quantity</th><th>UOM</th><th id='bidStartPrice'>Bid start price</th><th class=hide>Target Price</th><th>Minimum Increament</th><th>Last Quote</th><th>H1 Price</th><th> Status</th><th>Quote</th><th>Action</th></thead>");
                    for (var i = 0; i < data.length; i++) {

                        var IQuote = data[i].iqQuotedPrice == '0' ? '' : data[i].iqQuotedPrice;
                        var MqQuote = data[i].mqQuotedPrice == '0' ? '' : data[i].mqQuotedPrice;
                        var decreamentOn = data[i].increamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsVender").append("<tr><td>" + (i + 1) + "</td><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].minimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].increamentOn + "</td><td class=hide id=psid" + i + ">" + data[i].psid + "</td><td>" + data[i].shortName + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=tdBidStartPrice" + i + ">" + thousands_separators(data[i].ceilingPrice) + " " + jQuery("#lblcurrency").text() + "</td><td id=targetprice" + i + " class=hide>" + data[i].TargetPrice + " " + jQuery("#lblcurrency").text() + "</td><td>" + thousands_separators(data[i].minimumIncreament) + " " + decreamentOn + "</td><td id=lastQuote" + i + "></td><td id=H1Price" + i + ">" + thousands_separators(data[i].h1Price) + "</td><td><label class=control-label id=lblstatus" + i + ">" + data[i].moQuotedPrice + "</label></td><td> <input type=text class='form-control clsdisable' autocomplete=off  id=txtquote" + i + " name=txtquote" + i + " onkeyup='thousands_separators_input(this)' /> <span id=spanamount" + i + "   style=color:#a94442></span></td><td id=psid" + i + " class='display-none'>" + data[i].psid + "</td><td><button id=AllItembtn" + i + "  type='button' class='btn yellow col-lg-offset-5 clsdisable' onclick='InsUpdQuoteScrap(" + i + ")'>Submit</button></td></tr>");

                        $("#lastQuote" + i).html(data[i].mqQuotedPrice == '0' ? '' : thousands_separators(MqQuote))
                        // $("#initialquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(IQuote))

                        $('#spanamount' + i).addClass('hide spanclass');

                        if (data[i].moQuotedPrice == 'H1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else {

                            jQuery('#lblstatus' + i).css('color', 'Red');
                        }

                        if (data[i].showHLPrice == 'N') {
                            $("#H1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].showStartPrice == "N") {
                            $("#tdBidStartPrice" + i).html('Not Disclosed');
                        }

                        if (data[i].itemBlockedRemarks != '') {
                            // $('#txtquote' + i).val(data[i].itemBlockedRemarks)
                            $('#txtquote' + i).val("Restricted")
                            $('#txtquote' + i).attr('disabled', 'disabled')
                            $('#AllItembtn' + i).attr('disabled', 'disabled')
                        }
                        else {
                            $('#txtquote' + i).val('')
                            $('#AllItembtn' + i).removeAttr('disabled', 'disabled')
                        }
                        count = count + 1;
                    }

                } else {
                    jQuery("#tblParticipantsVender").append("<tr><td>Nothing Participation</td></tr>")
                }
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();

        }
    });
}
var mytime = 0;
var coutercall = 0;
function startTimer(duration, display) {
    clearInterval(mytime)
    var timer = 0, hours = 0, minutes = 0, seconds = 0;
    timer = duration;

    mytime = setInterval(function () {

        hours = parseInt(timer / 3600, 10)
        minutes = parseInt(timer / 60, 10) - (hours * 60)
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (hours > 0) {
            display.textContent = hours + ":" + minutes + ":" + seconds;
        }
        else {
            display.textContent = minutes + ":" + seconds;
        }
        if (timer <= 0) {
            $('.clsdisable').attr('disabled', 'disabled')
        }
        // if (timer == 300) {
        if (timer <= 300 && timer >= 240) {
            if (coutercall == 0) {
                calltoaster('Only 5 mins Left!!', 'info', 'info')
                coutercall = coutercall + 1;
            }
            //$('#pleft5mins').removeClass('hide')
        }
        else if (timer <= 240 || timer > 300) {
            //$('#pleft5mins').addClass('hide')
            toastr.clear();
            coutercall = 0;
        }

        if (--timer < -3) {
            timer = -3;
            if (timer == -3) {
                closeBidAir();
            }
        }

        $('#hdnval').val(timer)

    }, 1000);

}

function InsUpdQuoteScrap(rowID) {

    var vendorID = 0;
    var i = rowID;

    vendorID = sessionStorage.getItem('VendorId');
    var value = 0;
    var v = 0;
    var valuejap = 0;
    var vjap = 0;

    var Amount = $('#minimuminc' + i).text()

    if ($('#incon' + i).text() == "A") {
        if (jQuery("#lastQuote" + i).text() == '' || jQuery("#lastQuote" + i).text() == '0') {
            value = parseFloat(removeThousandSeperator($('#txtquote' + i).val()))
            valuejap = parseFloat(removeThousandSeperator($('#txtquote' + i).val()))
        }
        else {
            value = (parseFloat(removeThousandSeperator($('#txtquote' + i).val())) - parseFloat(removeThousandSeperator(jQuery("#lastQuote" + i).text()))).toFixed(2)
            //valuejap = parseFloat(removeThousandSeperator(jQuery("#H1Price" + i).text())) + parseFloat(removeThousandSeperator($('#txtquote' + i).val()))
            valuejap = (parseFloat(removeThousandSeperator(jQuery("#H1Price" + i).text())) + parseFloat((parseFloat(Amount)))).toFixed(2)
        }

    }
    else {
        if (jQuery("#lastQuote" + i).text() == '' || jQuery("#lastQuote" + i).text() == '0') {
            value = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + i).val())))).toFixed(2);
            v = parseFloat(removeThousandSeperator($('#txtquote' + i).val()))
            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + i).val())))).toFixed(2);
            vjap = parseFloat(removeThousandSeperator($('#txtquote' + i).val()))
        }
        else {
            value = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + i).text())))).toFixed(2);

            v = (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + i).text())) + parseFloat(value)).toFixed(2)
            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#H1Price" + i).text())))).toFixed(2);
            vjap = (parseFloat(removeThousandSeperator(jQuery("#H1Price" + i).text())) + parseFloat(removeThousandSeperator($('#txtquote' + i).val()))).toFixed(2);
        }

    }

    var valdiff = (parseFloat(removeThousandSeperator(jQuery("#txtquote" + i).val())) - parseFloat(removeThousandSeperator(jQuery("#H1Price" + i).text()))).toFixed(2)
    if ((removeThousandSeperator($('#txtquote' + i).val()) == 0) || (!/^[0-9]+(\.[0-9]{1,2})?$/.test(removeThousandSeperator($('#txtquote' + i).val())))) {
        $('#spanamount' + i).removeClass('hide')
        $('#spanamount' + i).text('Amount is required in number only')
        return false
    }

    else if (parseFloat(removeThousandSeperator($('#txtquote' + i).val())) < parseFloat(($('#ceilingprice' + i).text()))) {

        $('#spanamount' + i).removeClass('hide')
        $('#spanamount' + i).text('Amount should not be less than Bid start price')
        return false
    }
    else if (jQuery("#H1Price" + i).text() != "0" && BidForID == "83" && valdiff < parseFloat(Amount) && $('#incon' + i).text() == "A") {

        $('#spanamount' + i).removeClass('hide')
        $('#spanamount' + i).text('Maximum bid amount = Current H1 Price + Min. Inc. Value of ' + Amount + " " + $('#lblcurrency').text() + ".")
        return false
    }

    else if (parseFloat(value) < parseFloat(Amount) && $('#incon' + i).text() == "A" && value != 0 && BidForID == "81") {
        $('#spanamount' + i).removeClass('hide')
        $('#spanamount' + i).text('Amount should be more than minimum increment value ')
        return false
    }
    else if (parseFloat(valuejap) < parseFloat(Amount) && $('#incon' + i).text() == "A" && value != 0 && BidForID == "83" && jQuery("#lastQuote" + i).text() != "") {

        $('#spanamount' + i).removeClass('hide')
        $('#spanamount' + i).text('Amount should be more than minimum increment value ')
        return false
    }
    else if ((parseFloat(removeThousandSeperator(jQuery("#txtquote" + i).val())) < parseFloat(v)) && $('#incon' + i).text() == "P" && BidForID == "81") {
        $('#spanamount' + i).removeClass('hide')
        $('#spanamount' + i).text('Amount should be more than minimum increment value of ' + Amount + ' %')
        return false
    }
    else if (parseFloat(vjap) < parseFloat(v) && $('#incon' + i).text() == "P" && BidForID == "83") {
        $('#spanamount' + i).removeClass('hide')
        $('#spanamount' + i).text('Amount should be more than minimum increment value of ' + Amount + ' %')
        return false
    }
    else {

        var vendorID = 0;
        vendorID = sessionStorage.getItem('VendorId');

        // if ($('#hdnval').val() >= 60) {

        var QuoteProduct = {
            "VendorID": vendorID,
            "BidID": parseInt(sessionStorage.getItem("BidID")),
            "QuotedPrice": parseFloat(removeThousandSeperator($('#txtquote' + i).val())),
            "PSID": parseInt($('#psid' + i).html()),
            "EnteredBy": vendorID,
            "extendTime": parseInt($('#hdnval').val())

        }
        $('#hdnselectedindex').val(i);
        connection.invoke("RefreshBidParticipationFA", JSON.stringify(QuoteProduct), parseInt(sessionStorage.getItem("BidID"))).catch(function (err) {
            return console.error(err.toString());
        });
        $('#txtquote' + i).val('')
        //alert(JSON.stringify(QuoteProduct))
        //jQuery.ajax({
        //    url: sessionStorage.getItem("APIPath") + "VendorParticipation/ParticipationScrapSaleSingleItem/",
        //    beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        //    type: "POST",
        //    data: JSON.stringify(QuoteProduct),
        //    contentType: "application/json; charset=utf-8",
        //    success: function (data, status, jqXHR) {

        //        if (data == "1") {
        //            $('#txtquote' + i).val('')
        //            fetchVendorDetails();
        //        }
        //        else if (data == "-1") {
        //            $('#spanamount' + i).removeClass("hide");
        //            $('#spanamount' + i).text("Someone already quoted this price. Please Quote another price.")
        //        }

        //    },

        //    error: function (xhr, status, error) {

        //        var err = xhr.responseText// eval("(" + xhr.responseText + ")");
        //        if (xhr.status == 401) {
        //            error401Messagebox(err.Message);
        //        }
        //        else {
        //            fnErrorMessageText('error', '');
        //        }
        //        jQuery.unblockUI();

        //    }
        //});
        //}
        //else {

        //    var QuoteProduct = {
        //        "VendorID": vendorID,
        //        "BidID": parseInt(sessionStorage.getItem("BidID")),
        //        "QuotedPrice": parseFloat(removeThousandSeperator($('#txtquote' + i).val())),
        //        "PSID": parseInt($('#psid' + i).html()),
        //        "EnteredBy": vendorID

        //    }
        //    //alert(JSON.stringify(QuoteProduct))
        //    jQuery.ajax({
        //        url: sessionStorage.getItem("APIPath") + "VendorParticipation/ParticipationScrapSaleSingleItem/",
        //        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        //        type: "POST",
        //        data: JSON.stringify(QuoteProduct),
        //        contentType: "application/json; charset=utf-8",
        //        success: function (data, status, jqXHR) {

        //            if (data == "1") {
        //                var data = {
        //                    "BidID": sessionStorage.getItem("BidID")

        //                }

        //                jQuery.ajax({
        //                    url: sessionStorage.getItem("APIPath") + "VendorParticipation/ExtendDuration/",
        //                    beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        //                    type: "POST",
        //                    data: JSON.stringify(data),
        //                    contentType: "application/json; charset=utf-8",
        //                    success: function (data, status, jqXHR) {
        //                        $('#txtquote' + i).val('')
        //                        refreshColumnsStaus();

        //                        return true
        //                    },

        //                    error: function (xhr, status, error) {

        //                        var err = xhr.responseText//eval("(" + xhr.responseText + ")");
        //                        if (xhr.status === 401) {
        //                            error401Messagebox(err.Message);
        //                        }
        //                        jQuery.unblockUI();

        //                    }
        //                });
        //                fetchVendorDetails();

        //            }
        //            else if (data == "-1") {
        //                $('#spanamount' + i).removeClass("hide");
        //                $('#spanamount' + i).text("Someone already quoted this price. Please Quote another price.")
        //            }

        //        },
        //        error: function (xhr, status, error) {

        //            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
        //            if (xhr.status == 401) {
        //                error401Messagebox(err.Message);
        //            }
        //            else {
        //                fnErrorMessageText('error', '');
        //            }
        //            jQuery.unblockUI();


        //        }
        //    });

        //}


    }


}
function closeBidAir() {
    clearInterval(mytime)
    var data = {
        "BidId": sessionStorage.getItem("BidID")

    }
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/CloseBid/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        contentType: "application/json; charset=utf-8",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            bootbox.alert("Bid time has been over. Thanks for Participation.", function () {

                if (sessionStorage.getItem("ISFromSurrogate") == "Y") {
                    window.location = sessionStorage.getItem('HomePage');
                    sessionStorage.clear();
                }
                else {
                    window.location = 'VendorHome.html';
                }
                return false;
            });
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();


        }
    });
}

function fetchBidHeaderDetails(_bidId) {


    var url = '';
    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails_Vendor/?BidID=" + _bidId + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"))

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            //alert(JSON.stringify(data));
            if (data.length == 1) {
                $('#tblParticipantsVender').show();

                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblbidfor").text(data[0].bidFor);

                jQuery("#lnkTermsAttachment").html(data[0].termsConditions);

                if (data[0].attachment != "") {
                    jQuery("#lnkAnyOtherAttachment").html(data[0].attachment);
                }

                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');
                jQuery("#lblcurrency").text(data[0].currencyName);
                jQuery("#lblConvRate").text(data[0].conversionRate);
                jQuery("#lblstatus").text(data[0].conversionRate);
                jQuery("#lblConvRate").text(data[0].conversionRate);


                BidTypeID = data[0].bidTypeID;
                BidForID = data[0].bidForID;
                var display = document.querySelector('#lblTimeLeft');
                if (data[0].timeLeft < 0) {
                    closeBidAir();
                }
                else {
                    startTimerBeforeBidStart(data[0].timeLeft, display)
                }

                if (BidForID == 81 || BidForID == 83) {
                    fetchBidSummaryVendorScrap();
                    $(".lbltimetextdutch").hide();
                    $("#captionAuctionType").html('').html('<i class="fa fa-reorder"></i> H1 indicates you have entered best buying price');
                }  // for English/japanese Type auction
                else {
                    $(".lbltimetextdutch").show();
                    $("#captionAuctionType").html('').html('<i class="fa fa-reorder"></i> Bid Items & Offered price');
                    fetchBidSummaryVendorScrapDutch();
                } // For Dutch Type Auction

            }

        },

        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();


        }
    });
}

function startTimerBeforeBidStart(duration, display) {
    clearInterval(mytime)

    var timer = duration, hours, minutes, seconds;
    mytime = setInterval(function () {
        hours = parseInt(timer / 3600, 10)
        minutes = parseInt(timer / 60, 10) - (hours * 60)
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (hours > 0) {
            display.textContent = hours + ":" + minutes + ":" + seconds;
        }
        else {
            display.textContent = minutes + ":" + seconds;
        }

        duration--;
        startTimerBeforeBidStart(duration, display)
        if (--timer < 0) {

            fetchVendorDetails();
        }


    }, 1000);

}

//**** Dutch RA********//
//Dutch PArticipation function Starts here
function fetchBidSummaryVendorScrapDutch() {

    count = 0;
    var url = '';
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryPefaDutch/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType");
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            jQuery("#tblParticipantsVender").empty();
            if (data.length > 0) {

                var _offeredPrice;

                jQuery("#tblParticipantsVender >tbody").empty();
                if (_isBidStarted == false) {

                    jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th class=hide>Offered Unit Price (" + $('#lblcurrency').text() + ")</th></thead>");

                    for (var i = 0; i < data.length; i++) {
                        _offeredPrice = (data[i].offeredPrice < 0) ? 'NA' : data[i].offeredPrice;
                        jQuery("#tblParticipantsVender").append("<tr><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].minimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].increamentOn + "</td><td class=hide id=psid" + i + ">" + data[i].psid + "</td><td>" + data[i].shortName + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=psid" + i + " class='display-none'>" + data[i].psid + "</td><td id='offeredprice" + i + "' class=hide>" + thousands_separators(_offeredPrice) + "</td></tr>");
                    }
                    $(".lbltimetextdutch").hide()
                }
                else {

                    jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th id=THTarget>Target Price</th><th class=hide>Show L1 Price</th><th style='width:12%!important'>Offered Unit Price (" + $('#lblcurrency').text() + ")</th><th>Action</th></thead>");
                    for (var i = 0; i < data.length; i++) {
                        _offeredPrice = (data[i].offeredPrice < 0) ? 'NA' : thousands_separators(data[i].offeredPrice);


                        if (data[i].flag != 'Y') {
                            jQuery("#tblParticipantsVender").append("<tr><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].minimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].increamentOn + "</td><td class=hide id=psid" + i + ">" + data[i].psid + "</td><td>" + data[i].shortName + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=tdtarget" + i + ">" + thousands_separators(data[i].targetprice) + "</td><td id=L1Price" + i + " class=hide>" + thousands_separators(data[i].l1Price) + "</td><td id=psid" + i + " class='display-none'>" + data[i].psid + "</td><td id='offeredprice" + i + "' class='text-right bold  font-red' >" + (_offeredPrice) + "</td><td><button id='btnsubmit' type='button' class='btn yellow col-lg-offset-5 clsdisable' onclick='InsUpdQuoteScrapDutch(" + i + ")' onkeyup='thousands_separators_input(this)'>Accept </button></td></tr>");//thousands_separators

                            $('#spanamount' + i).addClass('hide spanclass');
                            if (data[i].maskVendor == "Y") {
                                $('#tdtarget' + i).addClass('hide')
                                $('#THTarget').addClass('hide')
                            }
                            else {
                                $('#tdtarget' + i).removeClass('hide')
                                $('#THTarget').removeClass('hide')
                            }
                            if (data[i].showHLPrice == "N") {
                                $("#L1Price" + i).html('Not Disclosed');
                            }

                            $('#txtquote' + i).val(thousands_separators(data[i].mqQuotedPrice));

                            if (data[i].moQuotedPrice == 'H1') {
                                jQuery('#lblstatus' + i).css('color', 'Blue');
                            }
                            else {

                                jQuery('#lblstatus' + i).css('color', 'Red');
                            }
                            //if (data[i].itemBlockedRemarks != '') {

                            //   // $('#txtquote' + i).val("Restricted")
                            //   // $('#txtquote' + i).attr('disabled', 'disabled')
                            //    $('#btnsubmit').attr('disabled', 'disabled')
                            //    $('#btnsubmit').text('Restricted')
                            //}
                            //else {
                            //    //$('#txtquote' + i).val('')
                            //    $('#btnsubmit').removeAttr('disabled', 'disabled')
                            //}
                            count = count + 1;
                        }
                    }
                }

            }
            else {

                closeBidAir();
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();

        }
    });

}

function fetchBidTime() {
    var display = document.querySelector('#lblTimeLeft');
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/FetchBidTimeLeft/?BidID=" + sessionStorage.getItem("BidID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            if (data.length > 0) {
                startTimerDutch((parseInt(data[0].timeLeft)), display);

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();

        }
    });
}
function startTimerDutch(duration, display) {
    clearInterval(mytime)
    var timer = duration;
    var hours, minutes, seconds;
    mytime = setInterval(function () {
        fetchBidTime()
        hours = parseInt(timer / 3600, 10)
        minutes = parseInt(timer / 60, 10) - (hours * 60)
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (hours > 0) {
            display.textContent = hours + ":" + minutes + ":" + seconds;
        }
        else {
            display.textContent = minutes + ":" + seconds;
        }


        if ((seconds.toString().substring(1, 2) == '0') || (seconds.toString().substring(1, 2) == '5')) {
            fetchBidSummaryVendorScrapDutch();
            fetchBidTime()
            if (sessionStorage.getItem("UserType") == 'E') {
                fetchUserChats($('#hddnVendorId').val(), 'S');
            } else {
                fetchUserChats(sessionStorage.getItem('UserID'), 'S');
            }
        }

        console.log(timer)

        if (--timer <= 0) {
            closeBidAir();
            return;
        }


    }, 1000);
}


function InsUpdQuoteScrapDutch(rowID) {

    var i = rowID;
    var vendorID = 0;
    var quotedprice = 0;
    if ($('#offeredprice' + i).html() != 0) {
        quotedprice = removeThousandSeperator($('#offeredprice' + i).html())
    }
    else {
        quotedprice = 0;
    }
    vendorID = sessionStorage.getItem('VendorId');

    var QuoteProduct = {
        "VendorID": vendorID,
        "BidID": parseInt(sessionStorage.getItem("BidID")),
        "QuotedPrice": parseFloat(quotedprice),
        "PSID": parseInt($('#psid' + i).html()),
        "EnteredBy": vendorID,
        "Flag": 'Y'

    }
    //alert(JSON.stringify(QuoteProduct))
    // console.log(JSON.stringify(QuoteProduct))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/ParticipationScrapSaleSingleItemDutch/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(QuoteProduct),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data == "1") {
                fetchVendorDetails();
            }
            else if (data == "-1") {
                $('#spanamount' + i).removeClass("hide");
                $('#spanamount' + i).text("Someone already accepted this price.")
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();


        }
    });


} // Dutch PArticipation function ends here




///_------- commented code
//function refreshColumnsStaus() {
//    var url = '';

//    if (BidForID == 81 || BidForID == 83) {
//        url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryPefa/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType");

//        jQuery.ajax({
//            type: "GET",
//            contentType: "application/json; charset=utf-8",
//            url: url,
//            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
//            cache: false,
//            crossDomain: true,
//            dataType: "json",
//            success: function (data, status, jqXHR) {

//                if (data.length > 0) {

//                    for (var i = 0; i < data.length; i++) {

//                        if (data[i].noOfExtension >= 1) {

//                            jQuery('#lblTimeLeft').css('color', 'red');
//                            jQuery('#lblTimeLeftTxt').removeClass('display-none');
//                            jQuery('#lblTimeLeftTxt').html('<b>Bid Time Extended.</b>').css('color', 'red')
//                        }
//                        else {
//                            jQuery('#lblTimeLeftTxt').addClass('display-none');
//                            jQuery('#lblTimeLeft').css('color', '');
//                        }
//                        display = document.querySelector('#lblTimeLeft');
//                        startTimer(data[i].timeLeft, display);


//                        $("#iqquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
//                        $("#lastQuote" + i).html(data[i].mqQuotedPrice == '0' ? '' : thousands_separators(data[i].mqQuotedPrice))
//                        $("#lblstatus" + i).html(data[i].moQuotedPrice)
//                        $("#H1Price" + i).html(thousands_separators(data[i].h1Price))
//                        if (data[i].moQuotedPrice == 'H1') {
//                            jQuery('#lblstatus' + i).css('color', 'Blue');
//                        }
//                        else {

//                            jQuery('#lblstatus' + i).css('color', 'Red');

//                        }
//                        if (data[i].showHLPrice == "N") {
//                            $("#H1Price" + i).html('Not Disclosed');
//                        }

//                    }

//                }


//            }, error: function (xhr, status, error) {

//                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
//                if (xhr.status == 401) {
//                    error401Messagebox(err.Message);
//                }
//                else {
//                    fnErrorMessageText('error', '');
//                }
//                jQuery.unblockUI();

//            }
//        });
//    }
//    else {
//        fetchBidSummaryVendorScrapDutch();

//    }

//}