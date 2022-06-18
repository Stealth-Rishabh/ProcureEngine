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
var connection = new signalR.HubConnectionBuilder().withUrl(sessionStorage.getItem("APIPath") + "bid?bidid=" + sessionStorage.getItem('BidID') + "&userType=" + sessionStorage.getItem("UserType") + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID'))).withAutomaticReconnect().build();

console.log("Not Started")
connection.start({ transport: ['webSockets', 'serverSentEvents', 'foreverFrame', 'longPolling'] }).then(function () {
    console.log("connection started")
}).catch(function (err) {
    console.log(err.toString())
    bootbox.alert("You are not connected to the Bid.Please contact to administrator.")
});
connection.on("refreshFAQuotes", function () {
    fetchBidSummaryVendorFrench();
});
connection.on("refreshColumnStatusFF", function (data) {
    // var JsonMsz = JSON.parse(data[0]);
    //if (JSON.parse(JsonMsz[0]) == "-1" && JSON.parse(JsonMsz[1]) == sessionStorage.getItem('VendorId')) {

    if (parseInt(data[0].timeLeft) > 0) {

        display = document.querySelector('#lblTimeLeft');
        startTimer(parseInt(data[0].timeLeft), display);

    }

    if (data[0].bidID == "-1" && data[0].vendorID == sessionStorage.getItem('VendorId')) {
        $('#spanamount' + $('#hdnselectedindex').val()).removeClass('hide')
        $('#spanamount' + $('#hdnselectedindex').val()).text('already Quoted by someone.');
        return false;
    }
    else {

        url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryFrench/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType")
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
                        //alert(data[i].noOfExtension)
                        if (data[i].noOfExtension >= 1) {

                            jQuery('#lblTimeLeft').css('color', 'red');
                            jQuery('#lblTimeLeftTxt').removeClass('display-none');
                            jQuery('#lblTimeLeftTxt').html('<b>Bid Time Extended.</b>').css('color', 'red')
                        }
                        else {
                            jQuery('#lblTimeLeftTxt').addClass('display-none');
                            jQuery('#lblTimeLeft').css('color', '');
                        }

                        $('#txtquantity' + i).val(data[i].bidQuantity == '0' ? '' : thousands_separators(data[i].bidQuantity));
                        $("#lastQuote" + i).html(data[i].mqQuotedPrice == '0' ? '' : thousands_separators(data[i].mqQuotedPrice))
                        $("#lblstatus" + i).html(data[i].itemRank)
                        $("#H1Price" + i).html(thousands_separators(data[i].h1Price))
                        $('#allocatedQuan' + i).html(thousands_separators(data[i].allocatedQuantity))
                        if (data[i].itemRank == 'H1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else {
                            jQuery('#lblstatus' + i).css('color', 'Red');
                        }
                        if (data[i].showHLPrice == 'N') {
                            $("#H1Price" + i).css("display", "none");
                            $("#H1Pricenotdisclosed" + i).css("display", "block");
                        }
                        else {
                            $("#H1Price" + i).css("display", "block");
                            $("#H1Pricenotdisclosed" + i).css("display", "none");
                        }
                        //if (data[i].showHLPrice == "N") {
                        //    $("#H1Price" + i).html('Not Disclosed');
                        //}

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
connection.on("refreshBidDetailsManage", function (data) {

    if (data.length > 0) {
        jQuery('#tblParticipantsVender >tbody >tr').each(function (i) {
            var JsonMsz = JSON.parse(data[0]);
            console.log(JSON.parse(data[0]))
            console.log(JSON.parse(data[1]))
            if (JsonMsz.valType == "BAL") {
                var VRanlList = JSON.parse(data[1]);

                for (var j = 0; j < VRanlList.length; j++) {
                    if ($('#FRID' + i).text() == VRanlList[j].SEID && sessionStorage.getItem("VendorId") == VRanlList[j].VendorID) {
                        //if (sessionStorage.getItem("VendorId") == VRanlList[j].VendorID) {
                        $('#lblstatus' + i).html(VRanlList[j].VendorRank)
                        if (VRanlList[j].VendorRank == 'H1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else {
                            jQuery('#lblstatus' + i).css('color', 'Red');
                        }
                        //}
                    }
                }
            }
            if (JsonMsz.valType == "BHV" || JsonMsz.valType == "BAT") {
                fetchBidHeaderDetails(sessionStorage.getItem("BidID"));
            }
            if (JsonMsz.valType != "BAL") {
                if (JsonMsz.SeId == $('#FRID' + i).text()) {
                    if (JsonMsz.valType == "BSPFF") {

                        $("#ceilingprice" + i).html(thousands_separators(JsonMsz.QueryString));
                        $("#CP" + i).html(thousands_separators(JsonMsz.QueryString));
                    }
                    if (JsonMsz.valType == "INCFR") {

                        $("#minimuminc" + i).html(thousands_separators(JsonMsz.QueryString));
                        $("#mininc" + i).text(thousands_separators(JsonMsz.QueryString));
                    }
                    if (JsonMsz.valType == "FFH1") {

                        if (JsonMsz.QueryString == 'N') {
                            $("#H1Price" + i).css("display", "none");
                            $("#H1Pricenotdisclosed" + i).css("display", "block");
                        }
                        else {
                            $("#H1Price" + i).css("display", "block");
                            $("#H1Pricenotdisclosed" + i).css("display", "none");
                        }
                    }
                    if (JsonMsz.valType == "FFStartP") {
                        if (JsonMsz.QueryString == 'N') {
                            // $("#ceilingprice" + i).css("display", "none");
                            $("#CP" + i).css("display", "none");
                            $("#ceilingpricenotdisclose" + i).css("display", "block");
                        }
                        else {
                            //$("#ceilingprice" + i).css("display", "block");
                            $("#CP" + i).css("display", "block");
                            $("#ceilingpricenotdisclose" + i).css("display", "none");
                        }
                    }
                    return false;
                }
            }

        });

    }

});
connection.on("refreshTimer", function () {
    fetchBidTime();
    //url = sessionStorage.getItem("APIPath") + "VendorParticipation/FetchBidTimeLeft/?BidID=" + sessionStorage.getItem('BidID')
    //jQuery.ajax({
    //    type: "GET",
    //    contentType: "application/json; charset=utf-8",
    //    url: url,
    //    beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
    //    cache: false,
    //    crossDomain: true,
    //    dataType: "json",
    //    success: function (data, status, jqXHR) {

    //        if (data.length > 0) {
    //            jQuery("#lblbidduration").text(data[0].bidDuartion + ' mins');
    //            display = document.querySelector('#lblTimeLeft');
    //            startTimer(data[0].timeLeft, display);
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
})
connection.on("refreshTimeronClients", function () {
    fetchBidTime();
});
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
                // jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblEventID").text(sessionStorage.getItem("BidID"));
                jQuery("#lblbidtime").text(data[0].bidDate + ' ' + data[0].bidTime);
                //jQuery("#lblbidtime").text(data[0].bidTime);
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

                BidTypeID = data[0].bidTypeID;
                BidForID = data[0].bidForID;
                $('#lblTimeLeftBeforeBid').html('').hide('');
                display = document.querySelector('#lblTimeLeft');

                fetchBidSummaryVendorFrench();
                $("#captionAuctionType").html('').html('<i class="fa fa-reorder"></i> H1 indicates you have entered best buying price');
                startTimer((parseInt(data[0].timeLeft)), display);
                $('#lblTimeLeftBeforeBid').hide()

            }
            else {//if (data.length > 1 || data.length == 0) {
                _isBidStarted = false;
                $('#lblTimeLeftBeforeBid').show()
                $('#lblTimeLeftBeforeBid').html('<b>Bid is not started.</b>').css('color', 'red');
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
function fetchBidSummaryVendorFrench() {
    count = 0;
    var url = '';
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryFrench/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType");

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
                    jQuery("#tblParticipantsVender").append("<tr><td>" + (i + 1) + "</td><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].minimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].increamentOn + "</td><td class=hide id=frid" + i + ">" + data[i].frid + "</td><td>" + data[i].shortName + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=psid" + i + " class='display-none'>" + data[i].psid + "</td><td id='offeredprice" + i + "'  class='hide'>" + data[i].remarks + "</td></tr>");
                }

            }
            else {
                if (data.length > 0) {

                    jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>S No</th><th class=hide>Item Code</th><th>Item/Product</th><th>Total Quantity</th><th>Min. Quantity</th><th>Max. Quantity</th><th>UOM</th><th id='bidStartPrice'>Bid start price</th><th class=hide>Target Price</th><th>Minimum Increment</th><th>Last Quote</th><th>H1 Price</th><th>Bidded Quantity*</th><th>Enter_Quote*</th><th>Action</th><th> Status</th><th>Allocated Quantity</th></thead>");
                    for (var i = 0; i < data.length; i++) {


                        var MqQuote = data[i].mqQuotedPrice == '0' ? '' : data[i].mqQuotedPrice;
                        var decreamentOn = data[i].increamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        $("#tblParticipantsVender").append("<tr><td>" + (i + 1) + "</td><td class=hide id=ceilingprice" + i + ">" + data[i].bidStartPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].minimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].increamentOn + "</td><td class=hide id=FRID" + i + ">" + data[i].frid + "</td><td class=hide>" + data[i].itemCode + "</td><td>" + data[i].shortName + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td class='text-right' id=minQ" + i + ">" + thousands_separators(data[i].minOfferedQuantity) + "</td><td class='text-right' id=maxQ" + i + ">" + thousands_separators(data[i].maxOfferedQuantity) + "</td><td>" + data[i].uom + "</td><td id=tdBidStartPrice" + i + "><span id=CP" + i + " class=ceilingprice" + i + " >" + thousands_separators(data[i].bidStartPrice) + " " + jQuery("#lblcurrency").text() + "</span><span  id=ceilingpricenotdisclose" + i + " class=ceilingpricenotdisclose" + i + ">Not Disclosed</span></td><td id=targetprice" + i + " class=hide>" + data[i].targetPrice + " " + jQuery("#lblcurrency").text() + "</td><td><span id=mininc" + i + ">" + thousands_separators(data[i].minimumIncreament) + "</span> " + decreamentOn + "</td><td id=lastQuote" + i + "></td><td><span id=H1Price" + i + " >" + thousands_separators(data[i].h1Price) + "</span><span id=H1Pricenotdisclosed" + i + " >Not Disclosed</span></td><td><input type=text class='form-control clsdisable' autocomplete=off  id=txtquantity" + i + " name=txtquantity" + i + " onfocusout='CheckBidQuantity(this," + i + ")' onkeyup='thousands_separators_input(this)'/> <span id=spanquan" + i + "   style=color:#a94442></span></td><td> <input type=text class='form-control clsdisable' autocomplete=off  id=txtquote" + i + " name=txtquote" + i + " onkeyup='thousands_separators_input(this)' /> <span id=spanamount" + i + "   style=color:#a94442></span></td><td><button id=AllItembtn" + i + "  type='button' class='btn yellow col-lg-offset-5 clsdisable' onclick='InsUpdQuoteFrench(" + i + ")'>Submit</button></td><td id=lblstatus" + i + " class='text-center'>" + data[i].itemRank + "</td><td  class='text-center bold' id=allocatedQuan" + i + " >" + thousands_separators(data[i].allocatedQuantity) + "</td></tr>");
                        jQuery('#allocatedQuan' + i).css('color', 'Red');
                        $("#lastQuote" + i).html(data[i].mqQuotedPrice == '0' ? '' : thousands_separators(MqQuote))
                        $('#spanamount' + i).addClass('hide spanclass');
                        $('#txtquantity' + i).val(data[i].bidQuantity == '0' ? '' : thousands_separators(data[i].bidQuantity));

                        if (data[i].itemRank == 'H1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else if (data[i].itemRank.toLowerCase() == 'not disclosed') {
                            jQuery('#lblstatus' + i).css('color', 'Black');
                        }
                        else {
                            jQuery('#lblstatus' + i).css('color', 'Red');
                        }

                        if (data[i].showHLPrice == 'N') {
                            $("#H1Price" + i).css("display", "none");
                            $("#H1Pricenotdisclosed" + i).css("display", "block");
                        }
                        else {
                            $("#H1Price" + i).css("display", "block");
                            $("#H1Pricenotdisclosed" + i).css("display", "none");
                        }

                        if (data[i].showStartPrice == "N") {
                            $("#CP" + i).css("display", "none");
                            $("#ceilingpricenotdisclose" + i).css("display", "block");
                            // $("#tdBidStartPrice" + i).html('Not Disclosed');
                        }
                        else {
                            $("#CP" + i).css("display", "block");
                            $("#ceilingpricenotdisclose" + i).css("display", "none");
                        }

                        if (data[i].itemBlockedRemarks != '') {
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
function CheckBidQuantity(id, counter) {
    var biddidval = $('#' + id.id).val();
    if (parseFloat(removeThousandSeperator(biddidval)) < parseFloat(removeThousandSeperator($('#minQ' + counter).text())) || parseFloat(removeThousandSeperator(biddidval)) > parseFloat(removeThousandSeperator($('#maxQ' + counter).text()))) {
        $('#spanquan' + counter).removeClass('hide')
        $('#spanquan' + counter).text('Quantity should between in Min. Quan (' + $('#minQ' + counter).text() + ') & Max. Quan (' + $('#maxQ' + counter).text() + ')');
        $('#' + id.id).val('')
    }
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
            //toastr.clear();
            $('.toast-info').hide();
            coutercall = 0;
        }
        //  console.log(timer)
        if (--timer < -3) {
            timer = -3;
            if (timer == -3) {
                closeBidAir();
            }
        }

        $('#hdnval').val(timer)

    }, 1000);

}

function InsUpdQuoteFrench(rowID) {

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
    if ((removeThousandSeperator($('#txtquantity' + i).val()) == 0) || (!/^[0-9]+(\.[0-9]{1,2})?$/.test(removeThousandSeperator($('#txtquote' + i).val())))) {
        $('#spanquan' + i).removeClass('hide')
        $('#spanquan' + i).text('Amount is required in number only')
        return false
    }
    else if ((removeThousandSeperator($('#txtquote' + i).val()) == 0) || (!/^[0-9]+(\.[0-9]{1,2})?$/.test(removeThousandSeperator($('#txtquote' + i).val())))) {
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
        var QuoteProduct = {
            "VendorID": vendorID,
            "BidID": parseInt(sessionStorage.getItem("BidID")),
            "QuotedPrice": parseFloat(removeThousandSeperator($('#txtquote' + i).val())),
            "BidQuantity": parseFloat(removeThousandSeperator($('#txtquantity' + i).val())),
            "FRID": parseInt($('#FRID' + i).html()),
            "extendTime": parseInt($('#hdnval').val())

        }
        //alert(JSON.stringify(QuoteProduct))
        $('#hdnselectedindex').val(i);
        connection.invoke("RefreshBidParticipationFF", JSON.stringify(QuoteProduct), parseInt(sessionStorage.getItem("BidID"))).catch(function (err) {
            return console.error(err.toString());
        });
        $('#txtquote' + i).val('')
        // $('#txtquantity' + i).val('')
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
            if (data == '1') {
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
            }
            else if (data == '-1') {
                //location.reload(true)
                fetchBidTime();
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
                // jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblEventID").text(_bidId);
                jQuery("#lblbidtime").text(data[0].bidDate + ' ' + data[0].bidTime);
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
                fetchBidSummaryVendorFrench();
                $("#captionAuctionType").html('').html('<i class="fa fa-reorder"></i> H1 indicates you have entered best buying price');

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
function fetchBidTime() {

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
                if (data[0].timeLeft <= 0) {
                    clearInterval(mytime);
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
                }
                else {
                    var display = document.querySelector('#lblTimeLeft');
                    startTimer((parseInt(data[0].timeLeft)), display);
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

