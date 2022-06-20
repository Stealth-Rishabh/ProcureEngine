var BidTypeID = 0;
var BidForID = 0;
var Duration = '0.00';
var _isBidStarted = true;


var error1 = $('.alert-danger');
var success1 = $('.alert-success');
var displayForS = "";
var openlefttime = 0;
$(document).on("keyup", "#tblParticipantsService .form-control", function () {
    var txt = this.id

    $('#' + txt).next(':first').addClass('hide');
    $('.spanclass').addClass('hide')

});

function fetchBidSummaryVendorproduct() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = '';
    count = 0;
    openlefttime = 0;
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExport/?VendorID=" + sessionStorage.getItem("VendorId") + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType") + "&_isBidStarted=" + _isBidStarted + "";
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
                if (_isBidStarted == false) {

                    jQuery("#tblParticipantsServiceBeforeStartBid").empty()
                    jQuery("#tblParticipantsServiceBeforeStartBid").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/<br>Service</th><th>Quantity</th><th>UOM</th><th class=hide id='bidStartPrice'>Bid start price</th><th class=hide>Target Price</th><th class=hide>Minimum Decrement</th><th class=hide>Initial Quote</th><th class=hide>Last Quote</th><th class=hide> Status </th><th class=hide>Enter your Bid*</th><th class=hide>Action</th><th>Remarks</th></thead>");

                    for (var i = 0; i < data.length; i++) {
                        jQuery("#tblParticipantsServiceBeforeStartBid").append("<tr><td>" + (i + 1) + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td class=hide id=CP" + i + ">" + thousands_separators(data[i].ceilingPrice) + " " + jQuery("#lblcurrency").text() + "</td><td class=hide id=targetprice" + i + ">" + thousands_separators(data[i].targetPrice) + " " + jQuery("#lblcurrency").text() + "</td><td class=hide>" + data[i].minimumDecreament + " " + decreamentOn + "</td><td class=hide id=initialquote" + i + ">" + IQuote + "</td><td class=hide id=lastQuote" + i + ">" + LqQuote + "</td><td class=hide id=lblstatus" + i + ">" + data[i].loQuotedPrice + "</td><td class=hide > <input type=text class=form-control autocomplete=off  id=txtquote" + i + " name=txtquote" + i + " /> <span id=spanamount" + i + "   style=color:#a94442></span></td><td class=hide><button type='button' id=AllItembtn" + i + " class='btn btn-warning' onclick=InsUpdQuoteSeaExport(" + i + ")>Submit</button><br/><span id=spanmszA" + i + " style=color:#a94442></span></td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td>" + data[i].remarks + "</td><td class=hide id=groupno" + i + ">" + data[i].groupNo + "</td></tr>");
                    }
                }
                else {
                    jQuery("#tblParticipantsService").empty()
                    jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/<br>Service</th><th>Quantity</th><th>UOM</th><th id=bidStartPrice>Bid start price</th><th>Target Price</th><th>Minimum Decrement</th><th>Initial Quote</th><th>Last Quote</th><th>L1 Price</th><th> Status </th><th>Closing Time</th><th>Time Left</th><th>Enter_Quote*</th><th>Action</th></thead>");

                    for (var i = 0; i < data.length; i++) {

                        var IQuote = thousands_separators(data[i].iqQuotedPrice) == '0' ? '' : thousands_separators(data[i].iqQuotedPrice);
                        var LqQuote = thousands_separators(data[i].lqQuotedPrice) == '0' ? '' : thousands_separators(data[i].lqQuotedPrice);
                        var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        var L1Quote = data[i].l1Quote == '0' ? '' : thousands_separators(data[i].l1Quote)
                        jQuery("#tblParticipantsService").append("<tr class=text-center><td>" + (i + 1) + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td><span id=CP" + i + ">" + thousands_separators(data[i].ceilingPrice) + " " + jQuery("#lblcurrency").text() + "</span><span  id=ceilingpricenotdisclose" + i + ">Not Disclosed</span></td><td id=targetprice" + i + ">" + thousands_separators(data[i].targetPrice) + " " + jQuery("#lblcurrency").text() + "</td><td><span id=mindec" + i + ">" + thousands_separators(data[i].minimumDecreament) + "</span> " + decreamentOn + "</td><td id=initialquote" + i + "></td><td id=lastQuote" + i + "></td><td><span id=L1Price" + i + ">" + L1Quote + "</span><span id=L1Pricenotdisclosed" + i + " >Not Disclosed</span></td><td id=lblstatus" + i + ">" + data[i].loQuotedPrice + "</td><td id=itemleft" + i + "></td><td id=itemleftTime" + i + " class=bold></td><td> <input type=text class='form-control txtquote' autocomplete=off  id=txtquote" + i + " name=txtquote" + i + " onkeyup='thousands_separators_input(this)' /> <span id=spanamount" + i + "   style=color:#a94442></span></td><td><button type='button' id=itembtn" + i + " class='btn btn-warning clsdisable' onclick=fninsupdQuotesS(" + i + ")>Submit</button><br/><span class='help-block ' style=color:#a94442 id=spanclosedmsz" + i + ">Bid Item Closed.</span><br/><span id=spanmsz" + i + "   style=color:#a94442></span></td><td class=hide>" + data[i].maskVendor + "</td><td class=hide id=groupno" + i + ">" + data[i].groupNo + "</td></tr>");

                        if (data[i].itemStatus == "Close" || data[i].itemStatus == "Inactive" || data[i].itemStatus == "Pause") {
                            
                            jQuery("#txtquote" + i).attr("disabled", true)
                            jQuery("#itembtn" + i).attr("disabled", true)
                            jQuery("#spanclosedmsz" + i).removeClass("hide")
                            jQuery("#spanclosedmsz" + i).css("color", "")

                        }
                        else {
                            $("#itemleft" + i).html(data[i].itemTimeLeft)
                            jQuery("#txtquote" + i).attr("disabled", false)
                            jQuery("#itembtn" + i).attr("disabled", false)
                            jQuery("#spanclosedmsz" + i).addClass("hide")
                            displayForS = document.querySelector('#itemleftTime' + i);
                            startTimerForStaggerItem((parseInt(data[i].itemLeft)), displayForS);
                            openlefttime = data[i].itemLeft;
                        }

                        display = document.querySelector('#lblTimeLeft');
                        startTimer((parseInt(data[0].timeLeft)), display);


                        if (data[i].itemStatus.toLowerCase() == "pause" && openlefttime <= 0) {// && data[i].itemLeft<=0
                            closeBidforpause();
                        }
                        if (data[i].maskVendor == 'Y') {
                            $("#targetprice" + i).html('Not Disclosed')
                        }
                        if (data[i].maskL1Price == 'N') {
                            $("#L1Price" + i).css("display", "none");
                            $("#L1Pricenotdisclosed" + i).css("display", "block");
                        }
                        else {
                            $("#L1Price" + i).css("display", "block");
                            $("#L1Pricenotdisclosed" + i).css("display", "none");
                        }
                        if (data[i].showStartPrice == 'N') {
                           
                           // $("#ceilingprice" + i).css("display", "none");
                            $("#CP" + i).css("display", "none");
                            $("#ceilingpricenotdisclose" + i).css("display", "block");
                          
                        }
                        else {
                             //$("#ceilingprice" + i).css("display", "block");
                            $("#CP" + i).css("display", "block");
                            $("#ceilingpricenotdisclose" + i).css("display", "none");
                        }

                        $('#spanamount' + i).addClass('hide spanclass');
                        $('#spanmsz' + i).addClass('hide spanclass');
                        $('#spanclosedmsz' + i).addClass('hide spanclass');
                        $("#initialquote" + i).html(IQuote)
                        $("#lastQuote" + i).html(LqQuote)
                        if (data[i].loQuotedPrice == 'L1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else {
                            jQuery('#lblstatus' + i).css('color', 'Red');
                        }
                        if (data[i].itemBlockedRemarks != '') {
                            // $('#txtquote' + i).val(data[i].itemBlockedRemarks)
                            $('#txtquote' + i).val("Restricted")
                            $('#txtquote' + i).attr('disabled', 'disabled')
                            $('#itembtn' + i).attr('disabled', 'disabled')
                        }
                        else {
                            $('#txtquote' + i).val('')
                            //$('#itembtn' + i).removeAttr('disabled', 'disabled')
                        }
                        if (data[i].itemNoOfExtension > 0) {
                            jQuery('#itemleft' + i).css({
                                'color': 'Red',
                                'font-weight': '500'
                            });
                        }
                        if (data[i].itemNoOfExtension > 0) {
                            jQuery('#itemleftTime' + i).css({
                                'color': 'Red',
                                'font-weight': '500'
                            });
                        }
                        count = count + 1;

                    }


                }


            }
            else {
                jQuery("#tblParticipantsService").append("<tr><td>Nothing Participation</td></tr>")
            }
            $(window).focusout();
            $(window).blur()

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
    })
    jQuery.unblockUI();

}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + sessionStorage.getItem('BidID'));
}
function fetchVendorDetails() {

    var url = '';
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/FetchBidDetails/?BidID=" + sessionStorage.getItem("BidID") + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"));

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            if (data.length == 1 && data[0].status.toLowerCase() != 'pause') {

                $('#tblParticipantsService').show();
                jQuery("#tblParticipantsServiceBeforeStartBid").hide();
                tncAttachment = data[0].termsConditions.replace(/\s/g, "%20");
                anyotherAttachment = data[0].attachment.replace(/\s/g, "%20");
                $("#hdnAdvFactor").val(data[0].advFactor);
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                //jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbiddate").text(fnConverToLocalTime(data[0].bidDate));
                jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblbidfor").text('Price (' + data[0].bidFor + ')');

                jQuery('#bid_EventID').html("Event ID : " + sessionStorage.getItem("BidID"));

                jQuery("#lnkTermsAttachment").html(data[0].termsConditions);

                if (data[0].attachment != '') {
                    jQuery("#lnkAnyOtherAttachment").html(data[0].attachment);
                }

                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');
                jQuery("#lblcurrency").text(data[0].currencyName);
                jQuery("#lblConvRate").text(data[0].conversionRate);


                _isBidStarted = true;
                $('#lblTimeLeftBeforeBid').html('').hide('');
                BidTypeID = data[0].bidTypeID;
                BidForID = data[0].bidForID;

                fetchBidSummaryVendorproduct()

                $('#btnsubmit').show()

            }
            else if (data.length == 1 && data[0].status.toLowerCase() == 'pause') {

                $('#lblTimeLeftBeforeBid').html('<b>Bid is paused.</b>').css('color', 'red');
                jQuery("#tblParticipantsServiceBeforeStartBid").show();
                $('#btnsubmit').hide()
                fetchBidHeaderDetails(sessionStorage.getItem("BidID"))
                $('#tblParticipantsService').empty();
                $('#tblParticipantsService').hide();
            }
            else {//if (data.length == 0 || data.length > 1 ) {

                $('#lblTimeLeftBeforeBid').html('<b>Bid is not started.</b>').css('color', 'red');
                jQuery("#tblParticipantsServiceBeforeStartBid").show();
                _isBidStarted = false;
                $('#btnsubmit').hide()
                fetchBidHeaderDetails(sessionStorage.getItem("BidID"))
                $('#tblParticipantsService').empty();
                $('#tblParticipantsService').hide();

            }
            $(window).focusout();
            $(window).blur()

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

/////****** Chat Start*****************/////
var connection = new signalR.HubConnectionBuilder().withUrl(sessionStorage.getItem("APIPath") + "bid?bidid=" + sessionStorage.getItem('BidID') + "&userType=" + sessionStorage.getItem("UserType") + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID'))).withAutomaticReconnect().build();

console.log("Not Started")
connection.start({ transport: ['webSockets', 'serverSentEvents', 'foreverFrame', 'longPolling'] }).then(function () {
    console.log("connection started")
}).catch(function (err) {
    console.log(err.toString())
    bootbox.alert("You are not connected to the Bid.Please contact to administrator.")
});
connection.on("refreshBidStatusAfterPause", function (data) {
    fetchBidTime();
});
connection.on("refreshColumnStatus", function (data) {
    var JsonMsz = JSON.parse(data[0]);
    if (JSON.parse(JsonMsz[0]) == "-1" && JSON.parse(JsonMsz[1]) == sessionStorage.getItem('VendorId')) {
        $('#spanmsz' + $('#hdnselectedindex').val()).removeClass('hide')
        $('#spanmsz' + $('#hdnselectedindex').val()).text('already Quoted by someone.');

        return false;
    }
    else {

        clearInterval(mytime)
        clearInterval(mytimeforSatus)
        url = sessionStorage.getItem("APIPath") + "VendorParticipation/RefreshRAParticipation/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType") + "&SeID=" + JSON.parse(JsonMsz[2]);

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: url,
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data, status, jqXHR) {
                openlefttime = 0;
                if (data.length > 0) {
                    // for (var i = 0; i < data.length; i++) {
                    jQuery('#tblParticipantsService >tbody >tr').each(function (i) {

                        if (data[0].seid == $('#seid' + i).text()) {

                            if (data[0].noOfExtension >= 1) {
                                jQuery('#lblTimeLeft').css('color', 'red');
                                jQuery('#lblTimeLeftTxt').removeClass('display-none');
                                jQuery('#lblTimeLeftTxt').html('<b>Bid Time Extended.</b>').css('color', 'red')
                            }
                            else {
                                jQuery('#lblTimeLeftTxt').addClass('display-none');
                                jQuery('#lblTimeLeft').css('color', '');
                            }

                            if (data[0].itemStatus.toLowerCase() == "close" || data[0].itemStatus.toLowerCase() == "inactive" || data[0].itemStatus.toLowerCase() == "pause") {

                                $("#itemleft" + i).html('')
                                jQuery("#txtquote" + i).val('');
                                $("#itemleftTime" + i).html('')
                                jQuery("#txtquote" + i).attr("disabled", true)
                                jQuery("#itembtn" + i).attr("disabled", true)

                            }
                            else {
                                if (parseInt(data[0].itemLeft) <= 1) { //<=1
                                    jQuery("#itembtn" + i).attr("disabled", true)
                                }
                                else {
                                    jQuery("#itembtn" + i).attr("disabled", false)
                                }
                                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');

                                jQuery("#txtquote" + i).attr("disabled", false)


                                displayForS = document.querySelector('#itemleftTime' + i);
                                console.log(data[0].itemLeft)
                                startTimerForStaggerItem((parseInt(data[0].itemLeft)), displayForS);
                                openlefttime = data[0].itemLeft;

                            }
                            if (data[0].itemStatus.toLowerCase() == "pause" && openlefttime <= 0) {// && data[i].itemLeft<=0
                                closeBidforpause();
                            }
                            jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');

                            display = document.querySelector('#lblTimeLeft');
                            startTimer(data[0].timeLeft, display);

                            $("#initialquote" + i).html(data[0].initialQuotedPrice == '0' ? '' : thousands_separators(data[0].initialQuotedPrice))
                            $("#lastQuote" + i).html(data[0].lowestQuotedPrice == '0' ? '' : thousands_separators(data[0].lowestQuotedPrice))
                            $("#lblstatus" + i).html(data[0].vendorRank)
                            $("#L1Price" + i).html(thousands_separators(data[0].l1Quote))
                            if (data[0].maskL1Price == 'N') {
                                $("#L1Price" + i).html('Not Disclosed');
                            }
                            if (data[0].vendorRank == 'L1') {
                                jQuery('#lblstatus' + i).css('color', 'Blue');
                            }
                            else {
                                jQuery('#lblstatus' + i).css('color', 'Red');

                            }
                            if (data[0].itemNoOfExtension > 0) {
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
                        console.log(data[0].groupNo)
                        console.log($('#groupno' + i).text())
                        if (data[0].groupNo == $('#groupno' + i).text()) {
                            $("#itemleft" + i).html(data[0].itemTimeLeft)
                        }
                        else {
                            $("#itemleft" + i).html('')
                        }
                        $("#itemleftTime" + i).html('')
                    });
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


    // console.log(data.length)
    if (data.length > 0) {
        jQuery('#tblParticipantsService >tbody >tr').each(function (i) {
            var JsonMsz = JSON.parse(data[0]);
            if (JsonMsz.valType == "BAL") {
                var VRanlList = JSON.parse(data[1]);
                for (var j = 0; j < VRanlList.length; j++) {
                    if ($('#seid' + i).text() == VRanlList[j].SEID && sessionStorage.getItem("VendorId") == VRanlList[j].VendorID) {
                        //if (sessionStorage.getItem("VendorId") == VRanlList[j].VendorID) {
                        $('#lblstatus' + i).html(VRanlList[j].VendorRank)
                        if (VRanlList[j].VendorRank == 'L1') {
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
                if (JsonMsz.SeId == $('#seid' + i).text()) {
                    if (JsonMsz.valType == "BSPRA") {
                        $("#CP" + i).html(thousands_separators(JsonMsz.QueryString));
                        $("#ceilingprice" + i).html(thousands_separators(JsonMsz.QueryString));
                    }
                    if (JsonMsz.valType == "BMD") {
                        $("#minimumdec" + i).html(thousands_separators(JsonMsz.QueryString));
                        $("#mindec" + i).text(thousands_separators(JsonMsz.QueryString));
                    }
                    if (JsonMsz.valType == "RAL1") {
                        if (JsonMsz.QueryString == 'N') {
                            $("#L1Price" + i).css("display", "none");
                            $("#L1Pricenotdisclosed" + i).css("display", "block");
                        }
                        else {
                            $("#L1Price" + i).css("display", "block");
                            $("#L1Pricenotdisclosed" + i).css("display", "none");

                        }
                    }
                    if (JsonMsz.valType == "RAStartP") {
                        if (JsonMsz.QueryString == 'N') {
                            //$("#ceilingprice" + i).css("display", "none");
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
    //$(".pulsate-regular").css('animation', 'none');
});
connection.on("ReceiveBroadcastMessage", function (objChatmsz) {

    let chat = JSON.parse(objChatmsz)
    //toastr.clear();

    $(".pulsate-regular").css('animation', 'pulse 2s infinite')
    //toastr.success('You have a new message.', 'New Message')
    calltoaster('You have a new message.', 'New Message', 'success')
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
                    display = document.querySelector('#lblTimeLeft');
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

var count;
function fninsupdQuotesS(index) {

    var vendorID = '';
    var insertquery = '';
    var v = 0;
    var vjap = 0;
    var value = 0;
    var valuejap = 0;

    vendorID = sessionStorage.getItem('VendorId');

    var Amount = $('#minimumdec' + index).text()
    if ($('#decon' + index).text() == "A") {
        if (jQuery("#lastQuote" + index).text() == '') {
            value = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
            valuejap = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))

        }
        else {
            value = (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))).toFixed(2)
            //valuejap = (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))).toFixed(2)
            valuejap = (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator(Amount))).toFixed(2)
        }

    }
    else {
        if (jQuery("#lastQuote" + index).text() == '') {
            value = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + index).val())))).toFixed(2);
            v = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))

            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + index).val())))).toFixed(2);
            vjap = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
        }
        else {
            value = (parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())));
            v = parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()));

            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())))).toFixed(2);
            vjap = (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))).toFixed(2);
        }
    }

    var valdiff = parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text()) - removeThousandSeperator(jQuery("#txtquote" + index).val())).toFixed(2)
    if ((removeThousandSeperator($('#txtquote' + index).val()) == 0) || (!/^[0-9]+(\.[0-9]{1,2})?$/.test(removeThousandSeperator($('#txtquote' + index).val())))) {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Amount is required in number only')
        jQuery.unblockUI();
        return false
    }

    else if ((parseFloat(removeThousandSeperator($('#ceilingprice' + index).text())) < parseFloat(removeThousandSeperator($('#txtquote' + index).val()))) && $('#ceilingprice' + index).is(":visible")) {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Amount should be less than Bid start price')
        jQuery.unblockUI();
        return false
    }
    else if (jQuery("#L1Price" + index).text() != "" && jQuery("#L1Price" + index).text() != "0" && BidForID == "83" && valdiff < parseFloat(Amount) && $('#decon' + index).text() == "A") {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text() + ".")
        return false
    }
    else if (value < parseFloat(Amount) && $('#decon' + index).text() == "A" && value != 0 && BidForID == "81") {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + " " + $("#lblcurrency").text())
        jQuery.unblockUI();
        return false
    }
    else if (valuejap < parseFloat(Amount) && $.trim($('#decon' + index).text()) == "A" && value != 0 && $.trim(BidForID) == "83") {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + " " + $("#lblcurrency").text())
        jQuery.unblockUI();
        return false
    }
    else if (v < value && $('#decon' + index).text() == "P" && BidForID == "81") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + '%')
        jQuery.unblockUI();
        return false
    }
    else if (vjap < valuejap && $('#decon' + index).text() == "P" && BidForID == "83") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + '%')
        jQuery.unblockUI();
        return false
    }
    else {


        insertquery = $('#seid' + index).html() + '~' + removeThousandSeperator($('#txtquote' + index).val());

        var QuoteProduct = {
            "VendorID": vendorID,
            "BidID": parseInt(sessionStorage.getItem("BidID")),
            "insertQuery": insertquery,
            "EnteredBy": vendorID,
            "Quote": parseFloat(removeThousandSeperator($('#txtquote' + index).val())),
            "SEID": parseInt($('#seid' + index).html()),
            "AdvFactor": parseFloat($("#hdnAdvFactor").val()),
            "ForRFQ": "N",
            "extendTime": parseInt($('#hdnval').val()),
            "BidClosingType": "S"

        }
        //alert(JSON.stringify(QuoteProduct))
        $('#hdnselectedindex').val(index);
        connection.invoke("RefreshBidParticipation", JSON.stringify(QuoteProduct), parseInt(sessionStorage.getItem("BidID"))).catch(function (err) {
            return console.error(err.toString());
        });
        $('#txtquote' + index).val('');

    }
}


var mytime = 0;
var mytimeforSatus = 0;
var coutercall = 0;
function startTimer(duration, display) {
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


        // console.log(timer)
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
        if (timer <= 0) {
            $('.clsdisable').attr('disabled', 'disabled')

        }
        //setTimeout(function () {
        if (--timer < -3) {
            timer = -3;
            if (timer == -3) {
                closeBidAir();
            }
        }
        // }, 1000);

    }, 1000);


}
function startTimerForStaggerItem(duration, displayS) {
    clearInterval(mytimeforSatus)
    var timer = duration, hours, minutes, seconds;
    mytimeforSatus = setInterval(function () {
        hours = parseInt(timer / 3600, 10)
        minutes = parseInt(timer / 60, 10) - (hours * 60)
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (hours > 0) {
            displayS.textContent = hours + ":" + minutes + ":" + seconds;
        }
        else {
            displayS.textContent = minutes + ":" + seconds;
        }

        if (--timer <= 0) {//button disabled at 2 sec or <=0 if at 1 sec
            timer = 0;
            if (timer == 0) {
                $('.clsdisable').attr('disabled', 'disabled')
                fetchBidSummaryVendorproduct();

            }
        }
        $('#hdnval').val(timer)
    }, 1000);
}
function closeBidforpause() {
    clearInterval(mytimeforSatus)
    clearInterval(mytime)
    bootbox.alert("Bid has been paused. We shall intimate you fresh Start Date/Time separately", function () {

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
function closeBidAir() {
    clearInterval(mytimeforSatus)
    clearInterval(mytime)
    var data = {
        "BidId": sessionStorage.getItem("BidID")

    }
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/CloseBid/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
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

            var err = eval("(" + xhr.responseText + ")");
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


//** Before Bid start 
function fetchBidHeaderDetails(bidId) {

    var url = '';

    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails_Vendor/?BidID=" + bidId + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"))

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            console.log("dataa > ", data)

            if (data.length == 1) {
                $('#tblParticipantsService').show();
                tncAttachment = data[0].termsConditions.replace(/\s/g, "%20");
                anyotherAttachment = data[0].attachment.replace(/\s/g, "%20");
                $("#hdnAdvFactor").val(data[0].advFactor);
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                //jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbiddate").text(fnConverToLocalTime(data[0].bidDate));
                jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);

                jQuery("#lblbidfor").text('Price (' + data[0].bidFor + ')');

                jQuery("a#lnkTermsAttachment").text(data[0].termsConditions);
                jQuery("a#lnkAnyOtherAttachment").text(data[0].attachment);

                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');
                jQuery("#lblcurrency").text(data[0].currencyName);
                jQuery("#lblConvRate").text(data[0].conversionRate);

                if (data[0].status.toLowerCase() != 'pause') {
                    $('#divtimer').show();
                    if (data[0].timeLeft < 0) {
                        closeBidAir();
                    }
                    else {
                        var display = document.querySelector('#lblTimeLeft');
                        startTimerBeforeBidStart(data[0].timeLeft, display)
                        fetchBidSummaryVendorproduct();
                    }
                }
                else {

                    if (data[0].itemTimeLeft <= 0) {
                        _isBidStarted = false;
                        $('#divtimer').hide();
                        fetchBidSummaryVendorproduct()
                    }
                    else {
                        _isBidStarted = true;
                        fetchBidSummaryVendorproduct()
                    }

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
