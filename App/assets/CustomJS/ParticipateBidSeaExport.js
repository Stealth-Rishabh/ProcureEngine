jQuery(document).ready(function () {
    Pageloaded()
    $('ul#chatList').slimScroll({
        height: '250px'
    });
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        bootbox.alert("<br />Oops! Your session has been expired. Please re-login to continue.", function () {
            window.location = sessionStorage.getItem('MainUrl');
            return false;
        });
    }
    else {
        if (sessionStorage.getItem("UserType") == "V" || sessionStorage.getItem("UserType") == "P") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }

    Metronic.init();
    Layout.init();
    App.init();
    QuickSidebar.init();
    setCommonData();

    fetchVendorDetails();
    if (sessionStorage.getItem("ISFromSurrogate") == "Y") {
        $('#LiISsurrogate').removeClass('hide')
    }
    else {
        $('#LiISsurrogate').addClass('hide')
    }
    $(".pulsate-regular").css('animation', 'none');

    //$(window).unload(function () {
    //    alert("you are leaving from page");
    //});

});

var lockResolver;
if (navigator && navigator.locks && navigator.locks.request) {
    const promise = new Promise((res) => {
        lockResolver = res;
    });

    navigator.locks.request('Bidlock', { mode: "shared" }, () => {
        return promise;
    });
}
var url = '';


/////****** Chat Start*****************/////

var connection = new signalR.HubConnectionBuilder().withUrl(sessionStorage.getItem("APIPath") + "bid?bidid=" + sessionStorage.getItem('BidID') + "&userType=" + sessionStorage.getItem("UserType") + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID'))).withAutomaticReconnect().build();
console.log("Not Started")
connection.start({ transport: ['webSockets', 'serverSentEvents', 'foreverFrame', 'longPolling'] }).then(function () {
    console.log("connection started")
}).catch(function (err) {
    bootbox.alert("You are not connected to the Bid as Your Internet connection is unstable, please refresh the page!!", function () {
        return true;
    });
});

connection.onclose(error => {

    bootbox.alert("You are not connected to the Bid as Your Internet connection is unstable, please refresh the page!!", function () {
        return true;
    });
});

connection.onreconnecting(error => {
    bootbox.alert("Connection lost.. Reconnecting.", function () {
        return true;
    });

});
connection.on("disconnectSR", function (connectionId) {
    connection.stop();
    bootbox.alert("You are connect to bid with multiple devices...disconnecting.", function () {

        window.location = "VendorHome.html";
        return false;
    });

});


connection.on("refreshRAQuotes", function (data) {

    console.log(BidForID)
    if (BidForID == 81 || BidForID == 83) {
        fetchBidSummaryVendorproduct();
    }
    else {
        fetchBidSummaryVendorSeaExportDutch();
    }
});

connection.on("refreshColumnStatus", function (data) {

    var JsonMsz = JSON.parse(data[0]);
    if (JSON.parse(JsonMsz[0]) == "-1" && JSON.parse(JsonMsz[1]) == sessionStorage.getItem('VendorId')) {

        $('#spanmszA' + $('#hdnselectedindex').val()).removeClass('hide')
        $('#spanmszA' + $('#hdnselectedindex').val()).text('already Quoted by someone.');
        return false;

    }

    else {

        clearInterval(mytime)
        url = sessionStorage.getItem("APIPath") + "VendorParticipation/RefreshRAParticipation/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType") + "&SeID=" + JSON.parse(JsonMsz[2]);

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



                            jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');

                            display = document.querySelector('#lblTimeLeft');

                            startTimer(data[0].timeLeft, display);



                            $("#initialquote" + i).html(data[0].initialQuotedPrice == '0' ? '' : thousands_separators(data[0].initialQuotedPrice))

                            $("#iqquote" + i).html(data[0].initialQuotedPrice == '0' ? '' : thousands_separators(data[0].initialQuotedPrice))





                            $("#lastQuote" + i).html(data[0].lowestQuotedPrice == '0' ? '' : thousands_separators(data[0].lowestQuotedPrice))

                            $("#lblstatus" + i).html(data[0].vendorRank)

                            var L1Quote = data[0].l1Quote == '0' ? '' : thousands_separators(data[0].l1Quote)

                            $("#L1Price" + i).html(L1Quote)



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

                    });

                }



                //}



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
        jQuery('#tblParticipantsService >tbody >tr').each(function (i) {

            var JsonMsz = JSON.parse(data[0]);
            if (JsonMsz.valType == "BAL") {
                var VRanlList = JSON.parse(data[1]);
                for (var j = 0; j < VRanlList.length; j++) {
                    if ($('#seid' + i).text() == VRanlList[j].SEID && sessionStorage.getItem("VendorId") == VRanlList[j].VendorID) {
                        $('#lblstatus' + i).html(VRanlList[j].VendorRank)
                        if (VRanlList[j].VendorRank == 'L1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');

                        }
                        else {
                            jQuery('#lblstatus' + i).css('color', 'Red');
                        }
                    }

                }

            }

            if (JsonMsz.valType == "BHV" || JsonMsz.valType == "BAT") {

                fetchBidHeaderDetails(sessionStorage.getItem("BidID"));

            }

            if (JsonMsz.valType != "BAL") {

                if (JsonMsz.SeId == $('#seid' + i).text()) {

                    if (JsonMsz.valType == "BSPRA") {
                        $("#ceilingprice" + i).html(thousands_separators(JsonMsz.QueryString));
                        // $("#CP" + i).html(thousands_separators(JsonMsz.QueryString));

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

                            $("#ceilingprice" + i).css("display", "none");
                            //$("#CP" + i).css("display", "none");
                            $("#ceilingpricenotdisclose" + i).css("display", "block");

                        }
                        else {
                            $("#ceilingprice" + i).css("display", "block");
                            //$("#CP" + i).css("display", "block");
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

})
connection.on("refreshTimeronClients", function () {

    fetchBidTime();

});

connection.on("ReceiveMessage", function (objChatmsz) {

    let chat = JSON.parse(objChatmsz)
    // toastr.clear();

    $(".pulsate-regular").css('animation', 'pulse 2s infinite')

    //toastr.success('You have a new message.', 'New Message')

    calltoaster(encodeURIComponent(chat.ChatMsg), 'New Message', 'success');
    $("#hddnadminConnection").val(chat.fromconnectionID)

    // if (sessionStorage.getItem("UserID") != chat.fromID) {

    $("#chatList").append('<div class="post out">'

        + '<div class="message">'

        + '<span class="arrow"></span>'

        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'

        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + new Date().toLocaleTimeString()+ '</span>' //timeNow()

        + '<span class="body" style="color: #c3c3c3;">' + chat.ChatMsg + '</span>'

        + '</div>'

        + '</div>');

    // }

    //$(".pulsate-regular").css('animation', 'none');

});
connection.on("ReceiveBroadcastMessage", function (objChatmsz) {



    let chat = JSON.parse(objChatmsz)

    // toastr.clear();

    $(".pulsate-regular").css('animation', 'pulse 2s infinite')

    // toastr.success('You have a new message.', 'New Message')

    calltoaster(encodeURIComponent(chat.ChatMsg), 'New Message', 'success');
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

    var _cleanString = StringEncodingMechanism($("#txtChatMsg").val());

    var data = {

        "ChatMsg": _cleanString,

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





var BidTypeID = 0;

var BidForID = 0;

var Duration = '0.00';

var _isBidStarted = true;

var totalfrequency = 0;

sessionStorage.setItem('BidClosingType', '');



var error1 = $('.alert-danger');

var success1 = $('.alert-success');

var display = "";

var displayForS = "";



function fetchBidHeaderDetails(bidId) {

    var tncAttachment = '';

    var anyotherAttachment = '';

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

               

            if (data.length == 1) {
                 let _cleanStringSub = StringDecodingMechanism(data[0].bidSubject);
                let _cleanStringDet = StringDecodingMechanism(data[0].bidDetails);
                $('#tblParticipantsService').show();

                tncAttachment = data[0].termsConditions.replace(/\s/g, "%20");

                anyotherAttachment = data[0].attachment.replace(/\s/g, "%20");

                $("#hdnAdvFactor").val(data[0].advFactor);

                jQuery("label#lblitem1").text(data[0].bidFor);

                jQuery("#lblbidsubject").text(_cleanStringSub);

                jQuery("#lblbidDetails").text(_cleanStringDet);

                jQuery("#lblbiddate").text(fnConverToLocalTime(data[0].bidDate));
                if ($.trim(data[0].bidClosingType) == "A") {
                    jQuery("#lblbidclosingtype").text("All items in one go");
                }
                else {
                    jQuery("#lblbidclosingtype").text("Stagger at item level");
                }

                //jQuery("#lblbidtime").text(data[0].bidTime);

                jQuery("#lblbidtype").text(data[0].bidTypeName);



                jQuery("#lblbidfor").text('Price (' + data[0].bidFor + ')');



                jQuery("#lnkTermsAttachment").html(data[0].termsConditions);



                if (data[0].attachment != '') {

                    jQuery("#lnkAnyOtherAttachment").html(data[0].attachment);

                }

                else {

                    jQuery("#lnkAnyOtherAttachment").removeAttr('onclick');

                }



                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');

                jQuery("#lblcurrency").text(data[0].currencyName);

                jQuery("#lblConvRate").text(data[0].conversionRate);

                if (data[0].bidForID == 81 || data[0].bidForID == 83) {

                    display = document.querySelector('#lblTimeLeft');

                    $('#bidtimer').show()

                    $('#bidtimerdutch').hide()

                }

                else {

                    display = document.querySelector('#lblTimeLeftD');

                    $('#bidtimer').hide()

                    $('#bidtimerdutch').show()

                }

                if (data[0].timeLeft < 0) {

                    closeBidAir();

                }

                else {

                    startTimerBeforeBidStart(data[0].timeLeft, display)
                    fetchBidSummaryVendorproduct()


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

            return false;

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



            if (data.length == 1) {



                $('#tblParticipantsService').show();

                jQuery("#tblParticipantsServiceBeforeStartBid").hide();



                $("#hdnAdvFactor").val(data[0].advFactor);

                jQuery("label#lblitem1").text(data[0].bidFor);

                jQuery("#lblbidsubject").text(data[0].bidSubject);

                jQuery("#lblbidDetails").text(data[0].bidDetails);

                jQuery("#lblbiddate").text(fnConverToLocalTime(data[0].bidDate));

                //jQuery("#lblbidtime").text(data[0].bidTime);

                if ($.trim(data[0].bidClosingType) == "A") {
                    jQuery("#lblbidclosingtype").text("All items in one go");
                }
                else {
                    jQuery("#lblbidclosingtype").text("Stagger at item level");
                }

                jQuery("#lblbidtype").text(data[0].bidTypeName);

                jQuery("#lblbidfor").text('Price (' + data[0].bidFor + ')');



                jQuery('#bid_EventID').html("Event ID : " + sessionStorage.getItem("BidID"));



                jQuery("#lnkTermsAttachment").html(data[0].termsConditions);



                if (data[0].attachment != '') {

                    jQuery("#lnkAnyOtherAttachment").html(data[0].attachment);

                }

                else {

                    jQuery("#lnkAnyOtherAttachment").removeAttr('onclick');

                }

                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');

                jQuery("#lblcurrency").text(data[0].currencyName);



                _isBidStarted = true;

                $('#lblTimeLeftBeforeBid', '#blTimeLeftBeforeBidD').html('').hide('');



                BidTypeID = data[0].bidTypeID;

                BidForID = data[0].bidForID;



                if (BidForID == 81 || BidForID == 83) {

                    display = document.querySelector('#lblTimeLeft');
                    $('#bidtimer').show()
                    $("#bidtimerdutch").hide();
                    $(".lbltimetextdutch").hide();
                    fetchBidSummaryVendorproduct()
                    startTimer((parseInt(data[0].timeLeft)), display);

                    $('#lblTimeLeftBeforeBid').hide();

                }

                else {

                    $('#blTimeLeftBeforeBidD').hide();
                    display = document.querySelector('#lblTimeLeftD');
                    totalfrequency = parseInt(data[0].priceDecreamentFrequency * 60)
                    $('#bidtimer').hide()
                    $("#bidtimerdutch").show();
                    $(".lbltimetextdutch").show();
                    $("#captionAuctionType").html('').html('<i class="fa fa-reorder"></i> Bid Items & Offered price');
                    fetchBidSummaryVendorSeaExportDutch();
                    startTimerDutch((parseInt(data[0].timeLeft)), display);

                }



            }

            else {// if (data.length > 1 || data.length == 0) {

                $('#lblTimeLeftBeforeBid').show();
                $('#blTimeLeftBeforeBidD').show();
                $('#lblTimeLeftBeforeBid').html('<b>Bid is not started.</b>').css('color', 'red');
                $('#blTimeLeftBeforeBidD').html('<b>Bid is not started.</b>').css('color', 'red');
                $('#tblParticipantsService').hide();
                jQuery("#tblParticipantsServiceBeforeStartBid").show();

                _isBidStarted = false;

                // $('#btnsubmit').hide()

                fetchBidHeaderDetails(sessionStorage.getItem("BidID"))

            }
            $(window).focusout();
            $(window).blur()

        },

        error: function (xhr) {



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

function convertMintosec(value) {

    return Math.floor(value * 60)

}

var count;

var url = '';

function fetchBidSummaryVendorproduct() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    url = '';
    count = 0;
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

                if (_isBidStarted == false) {
                    jQuery("#tblParticipantsService").hide();
                    jQuery("#tblParticipantsServiceBeforeStartBid").show();
                    jQuery("#tblParticipantsServiceBeforeStartBid").empty()
                    jQuery("#tblParticipantsServiceBeforeStartBid").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th class=hide id='bidStartPrice'>Bid Unit price</th><th class=hide>Target Price</th><th class=hide>Minimum Decrement</th><th class=hide>Initial Quote</th><th class=hide>Last Quote</th><th class=hide> Status </th><th class=hide>Enter Unit Quote*</th><th class=hide>Action</th><th>Remarks</th></thead>");
                    for (var i = 0; i < data.length; i++) {

                        jQuery("#tblParticipantsServiceBeforeStartBid").append("<tr><td>" + (i + 1) + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td class=hide id=ceilingprice" + i + ">" + thousands_separators(data[i].ceilingPrice) + " " + jQuery("#lblcurrency").text() + "</td><td class=hide id=targetprice" + i + ">" + thousands_separators(data[i].targetPrice) + " " + jQuery("#lblcurrency").text() + "</td><td class=hide><span>" + data[i].minimumDecreament + " " + decreamentOn + "</td><td class=hide id=initialquote" + i + ">" + IQuote + "</td><td class=hide id=lastQuote" + i + ">" + LqQuote + "</td><td class=hide id=lblstatus" + i + ">" + data[i].loQuotedPrice + "</td><td class=hide > <input type=text class=form-control autocomplete=off  id=txtquote" + i + " name=txtquote" + i + " /> <span id=spanamount" + i + "   style=color:#a94442></span></td><td class=hide ><button type='button' id=AllItembtn" + i + " class='btn btn-warning' onclick=InsUpdQuoteSeaExport(" + i + ")>Submit</button><br/><span id=spanmszA" + i + " style=color:#a94442></span></td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td>" + data[i].remarks + "</td></tr>");

                    }

                }
                else {
                    jQuery("#tblParticipantsService").show()
                    jQuery("#tblParticipantsService").empty()
                    jQuery("#tblParticipantsServiceBeforeStartBid").hide()


                    sessionStorage.setItem('BidClosingType', data[0].bidClosingType)

                    if (data[0].bidClosingType == 'A') {
                        jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th id='bidStartPrice'>Bid Unit price</th><th>Target Price</th><th>Minimum Decrement</th><th>Initial Quote</th><th>Last Quote</th><th>L1 Quote</th><th> Status </th><th>Enter Unit Quote*</th><th>Action</th></thead>");
                        for (var i = 0; i < data.length; i++) {



                            var IQuote = data[i].iqQuotedPrice == '0' ? '' : data[i].iqQuotedPrice;
                            var LqQuote = data[i].lqQuotedPrice == '0' ? '' : data[i].lqQuotedPrice;

                            var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';

                            var L1Quote = data[i].l1Quote == '0' ? '' : thousands_separators(data[i].l1Quote)

                            jQuery("#tblParticipantsService").append("<tr><td>" + (i + 1) + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td><span id=ceilingprice" + i + " class=ceilingprice" + i + " >" + thousands_separators(data[i].ceilingPrice) + " " + jQuery("#lblcurrency").text() + "</span><span  id=ceilingpricenotdisclose" + i + " class=ceilingpricenotdisclose" + i + ">Not Disclosed</span></td><td id=targetprice" + i + ">" + thousands_separators(data[i].targetPrice) + " " + jQuery("#lblcurrency").text() + "</td><td><span id=mindec" + i + ">" + thousands_separators(data[i].minimumDecreament) + "</span> " + decreamentOn + "</td><td id=initialquote" + i + "></td><td id=lastQuote" + i + "></td><td><span id=L1Price" + i + " >" + L1Quote + "</span><span id=L1Pricenotdisclosed" + i + "  >Not Disclosed</span></td><td id=lblstatus" + i + ">" + data[i].loQuotedPrice + "</td><td> <input type=text class='form-control clsdisable' autocomplete=off  id=txtquote" + i + " name=txtquote" + i + " onkeyup='thousands_separators_input(this)' /> <span id=spanamount" + i + "   style=color:#a94442></span></td><td><button type='button' id=AllItembtn" + i + " class='btn btn-warning clsdisable' onclick=InsUpdQuoteSeaExport(" + i + ")>Submit</button><br/><span id=spanmszA" + i + " style=color:#a94442></span></td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td class=hide id=chkMaskL1Price" + i + ">" + data[i].maskL1Price + "</td></tr>");

                            $("#lastQuote" + i).html(data[i].lqQuotedPrice == '0' ? '' : thousands_separators(LqQuote))

                            $("#initialquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(IQuote))



                            $('#spanamount' + i).addClass('hide spanclass');

                            $('#spanmszA' + i).addClass('hide spanclass');

                            // $('#txtquote' + i).val(thousands_separators(data[i].LQQuotedPrice));



                            if (data[i].maskVendor == 'Y') {
                                $("#targetprice" + i).html('Not Disclosed');

                            }
                            if (data[i].maskL1Price == 'N') {
                                $("#L1Price" + i).css("display", "none");//.hide();
                                $("#L1Pricenotdisclosed" + i).css("display", "block");
                            }
                            else {
                                $("#L1Price" + i).css("display", "block");
                                $("#L1Pricenotdisclosed" + i).css("display", "none");

                            }

                            if (data[i].showStartPrice == 'N') {
                                $("#ceilingprice" + i).css("display", "none");
                                //$("#CP" + i).css("display", "none");
                                $("#ceilingpricenotdisclose" + i).css("display", "block");
                            }

                            else {
                                $("#ceilingprice" + i).css("display", "block");
                                //$("#CP" + i).css("display", "block");
                                $("#ceilingpricenotdisclose" + i).css("display", "none");

                            }

                            if (data[i].itemBlockedRemarks != '') {
                                // $('#txtquote' + i).val(data[i].itemBlockedRemarks)
                                $('#txtquote' + i).val("Restricted")
                                $('#txtquote' + i).attr('disabled', 'disabled')
                                $('#AllItembtn' + i).attr('disabled', 'disabled')

                            }
                            else {
                                $('#txtquote' + i).val('')
                                $('#txtquote' + i).removeAttr('disabled', 'disabled')
                                $('#AllItembtn' + i).removeAttr('disabled', 'disabled')

                            }
                            if (data[i].loQuotedPrice == 'L1') {

                                jQuery('#lblstatus' + i).css({
                                    'color': 'Blue',
                                    'vertical-align': 'top'
                                });

                            }

                            else {

                                jQuery('#lblstatus' + i).css({

                                    'color': 'Red',

                                    'vertical-align': 'top'

                                });

                            }



                            count = count + 1;



                        }



                    }



                }



            }

            else {

                jQuery("#tblParticipantsService").append("<tr><td>Nothing Participation</td></tr>")

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

        }

    })

    jQuery.unblockUI();



}
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

        if (jQuery("#lastQuote" + index).text() == '' || jQuery("#lastQuote" + index).text() == '0') {

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



        if (jQuery("#lastQuote" + index).text() == '' || jQuery("#lastQuote" + index).text() == '0') {

            value = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + index).val())))).toFixed(2);

            v = (parseFloat(removeThousandSeperator($('#txtquote' + index).val()))).toFixed(2)



            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + index).val())))).toFixed(2);

            vjap = parseFloat(removeThousandSeperator($('#txtquote' + index).val())).toFixed(2)

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

    else if ((parseFloat(removeThousandSeperator($('#ceilingprice' + index).text())) < parseFloat(removeThousandSeperator($('#txtquote' + index).val()))) && $('#ceilingprice' + index).is(":visible")) {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Amount should be less than Bid Unit price')

        return false

    }



    else if (jQuery("#L1Price" + index).text() != "" && jQuery("#L1Price" + index).text() != "0" && BidForID == "83" && valdiff < parseFloat(Amount) && $('#decon' + index).text() == "A") {

        console.log(jQuery("#L1Price" + index).text())

        console.log(valdiff)

        console.log(Amount)

        $('#spanamount' + index).removeClass('hide')

        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text() + ".")

        return false

    }

    else if (parseFloat(value) < parseFloat(Amount) && $('#decon' + index).text() == "A" && value != 0 && BidForID == "81") {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text())
        return false

    }

    else if (parseFloat(valuejap) < parseFloat(Amount) && $.trim($('#decon' + index).text() == "A") && value != 0 && $.trim(BidForID) == "83") {

        $('#spanamount' + index).removeClass('hide')

        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text() + ".")

        return false

    }

    else if (parseFloat(v) < parseFloat(value) && $('#decon' + index).text() == "P" && BidForID == "81") {



        $('#spanamount' + index).removeClass('hide')

        $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + '%')

        return false

    }

    else if (parseFloat(vjap) < parseFloat(valuejap) && $('#decon' + index).text() == "P" && BidForID == "83") {

        $('#spanamount' + index).removeClass('hide')

        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + '%')

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
            "BidClosingType": "A",
            "isPrePricing": "N"

        }

        $('#hdnselectedindex').val(index);

        console.log(QuoteProduct);

        connection.invoke("RefreshBidParticipation", JSON.stringify(QuoteProduct), parseInt(sessionStorage.getItem("BidID"))).catch(function (err) {

            return console.error(err.toString());

        });

        $('#txtquote' + index).val('')

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

        if (timer <= 300 && timer >= 240) {

            if (coutercall == 0) {

                calltoaster('Only 5 mins Left!!', 'info', 'info')
                coutercall = coutercall + 1;

            }
            //$('#pleft5mins').removeClass('hide')

        }
        else if (timer <= 240 || timer > 300) {
            // toastr.clear();
            $('.toast-info').hide();
            coutercall = 0;

        }

        if (timer <= 0) {
            $('.clsdisable').attr('disabled', 'disabled')
        }
        else if (timer > 0 && $('.clsdisable').is(':disabled') && $('.clsdisable').closest('input').val() !== "Restricted") {
            $('.clsdisable').removeAttr('disabled')
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
function closeBidAir() {

    clearInterval(mytime)

    var data = {

        "BidId": sessionStorage.getItem("BidID")

    }



    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "VendorParticipation/CloseBid/",

        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        type: "POST",

        data: JSON.stringify(data),

        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            console.log(data)
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



            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");

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

$(document).on("keyup", "#tblParticipantsService .form-control", function () {

    var txt = this.id



    $('#' + txt).next(':first').addClass('hide');

    $('.spanclass').addClass('hide')



});



//**** Dutch RA********//



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

            console.log("Time Left:" + data[0].timeLeft)
            if (data.length > 0) {

                if (BidForID == 81 || BidForID == 83) {
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

                else {

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

function fetchBidSummaryVendorSeaExportDutch() {

    url = ''

    //jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });



    count = 0;

    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExportDutch/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType")

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: url,

        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        cache: false,

        crossDomain: true,

        dataType: "json",

        success: function (data, status, jqXHR) {



            jQuery("#tblParticipantsService").empty();

            if (data.length > 0) {



                var _offeredPrice;

                jQuery("#tblParticipantsService >tbody").empty();

                if (_isBidStarted == false) {



                    jQuery("#tblParticipantsService").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th class=hide>Offered Unit Price (" + $('#lblcurrency').text() + ")</th></thead>");



                    for (var i = 0; i < data.length; i++) {

                        _offeredPrice = (data[i].offeredPrice < 0) ? 'NA' : thousands_separators(data[i].offeredPrice);

                        jQuery("#tblParticipantsService").append("<tr><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id='offeredprice" + i + "' class=hide>" + _offeredPrice + "</td></tr>");

                    }

                    $(".lbltimetextdutch").hide()

                }

                else {



                    jQuery("#tblParticipantsService").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th id=THTarget>Target Price</th><th class=hide>Show L1 Price</th><th style='width:20%!important'>Offered Unit Price (" + $('#lblcurrency').text() + ")</th><th>Action</th></thead>");

                    for (var i = 0; i < data.length; i++) {

                        _offeredPrice = (data[i].offeredPrice < 0) ? 'NA' : thousands_separators(data[i].offeredPrice);

                        if (data[i].isAcceptedPrice != 'Y') {

                            jQuery("#tblParticipantsService").append("<tr><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=tdtarget" + i + ">" + thousands_separators(data[i].targetPrice) + "</td><td id=L1Price" + i + " class=hide>" + thousands_separators(data[i].l1Quote) + "</td><td id='offeredprice" + i + "' class='text-right bold  font-red'>" + _offeredPrice + "</td><td><button id='btnsubmit' type='button' class='btn yellow col-lg-offset-5 clsdisable' onclick='InsUpdQuoteSeaDutch(" + i + ")' onkeyup='thousands_separators_input(this)'>Accept </button></td></tr>");



                            $('#spanamount' + i).addClass('hide spanclass');

                            if (data[i].maskVendor == "Y") {

                                $('#tdtarget' + i).addClass('hide')

                                $('#THTarget').addClass('hide')

                            }

                            else {

                                $('#tdtarget' + i).removeClass('hide')

                                $('#THTarget').removeClass('hide')

                            }

                            if (data[i].maskL1Price == "N") {

                                $("#L1Price" + i).html('Not Disclosed');

                            }



                            $('#txtquote' + i).val(thousands_separators(data[i].lqQuotedPrice));



                            if (data[i].loQuotedPrice == 'L1') {

                                jQuery('#lblstatus' + i).css('color', 'Blue');

                            }

                            else {



                                jQuery('#lblstatus' + i).css('color', 'Red');

                            }



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

function InsUpdQuoteSeaDutch(rowID) {



    var i = rowID;

    var vendorID = 0;

    var quotedprice = 0;

    if ($('#offeredprice' + i).html() != 0) {

        quotedprice = removeThousandSeperator($('#offeredprice' + i).html());

    }

    else {

        quotedprice = 0;

    }

    vendorID = sessionStorage.getItem('VendorId');



    var QuoteProduct = {

        "VendorID": vendorID,

        "BidID": parseInt(sessionStorage.getItem("BidID")),

        "QuotedPrice": parseFloat(quotedprice),

        "SEID": parseInt($('#seid' + i).html()),

        "EnteredBy": vendorID,

        "IsAcceptedPrice": 'Y'




    }

    // alert(JSON.stringify(QuoteProduct))

    // console.log(JSON.stringify(QuoteProduct))

    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "VendorParticipation/ParticipationSeaExportItemDutch/",

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
}

function startTimerDutch(duration, display) {

    clearInterval(mytime)

    var timer = duration;

    var Timer1 = duration;

    var hours, minutes, seconds;

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

        // console.log(Timer1-totalfrequency)

        if ((seconds.toString().substring(1, 2) == '0') || (seconds.toString().substring(1, 2) == '5')) {

            //if (timer == (Timer1 - totalfrequency)) {

            // Timer1 = timer;

            fetchBidSummaryVendorSeaExportDutch();

            //fetchBidTime()

        }



        //console.log(timer)

        if (--timer <= 0) {

            closeBidAir();
            return;

        }
    }, 1000);

}