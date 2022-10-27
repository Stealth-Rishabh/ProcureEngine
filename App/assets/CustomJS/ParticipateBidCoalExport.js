var BidTypeID = 0;
var BidForID = 0;
var Duration = '0.00';
var _isBidStarted = true;
sessionStorage.setItem('BidClosingType', '');

var error1 = $('.alert-danger');
var success1 = $('.alert-success');
var displayForS = "";
/////****** Chat Start*****************/////

var clientIP = "";
var connection;
function getIP() {

    $.getJSON("https://api.ipify.org?format=json", function (data) {
        console.log(data)

        // Setting text of element P with id gfg
        clientIP = data.ip;
        console.log("Not Started")
        connection = new signalR.HubConnectionBuilder().withUrl(sessionStorage.getItem("APIPath") + "bid?bidid=" + sessionStorage.getItem('BidID') + "&userType=" + sessionStorage.getItem("UserType") + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&machineIP=" + clientIP).withAutomaticReconnect().build();
        connection.start({ transport: ['webSockets', 'serverSentEvents', 'foreverFrame', 'longPolling'] }).then(function () {
            console.log("connection started")
        }).catch(function (err) {
            bootbox.alert("You are not connected to the Bid as Your Internet connection is unstable, please refresh the page", function () {
                window.location = sessionStorage.getItem('MainUrl');
                return false;
            })

        });
        connection.onclose(error => {
            bootbox.alert("You are not connected to the Bid as Your Internet connection is unstable or due to multiple logins, please refresh the page!!", function () {
                // window.location = sessionStorage.getItem('MainUrl');
                window.location = "VendorHome.html";
                return false;
            });
        });

        connection.onreconnected(connectionId => {
            bootbox.alert("You are connect to bid with multiple devices...disconnecting.", function () {
                return false;
            });
        });

        connection.on("disconnectSR", function (connectionId) {
            bootbox.alert("You are connect to bid with multiple devices...disconnecting.", function () {
                connection.stop();
                window.location = sessionStorage.getItem('MainUrl');
                return false;
            });

        });
        connection.on("refreshBidDetailsManage", function (data) {
            if (data.length > 0) {

                var JsonMsz = JSON.parse(data[0]);
                if (JsonMsz.valType == "BHV" || JsonMsz.valType == "BAT") {
                    fetchBidHeaderDetails(sessionStorage.getItem("BidID"));
                }
                if (JsonMsz.valType != "BHV" && JsonMsz.valType != "BAT") {
                    fetchBidSummaryVendorproduct();
                }
            }

        });
        connection.on("refreshColumnStatusCoal", function (data) {

            var JsonMsz = JSON.parse(data[0]);
            if (JSON.parse(JsonMsz[0]) == "-1" && JSON.parse(JsonMsz[1]) == sessionStorage.getItem('VendorId')) {
                $('#spanmszA' + $('#hdnselectedindex').val()).removeClass('hide')
                $('#spanmszA' + $('#hdnselectedindex').val()).text('already Quoted by someone.');
                return false;
            }
            else {
                url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorCoalExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType") + "&_isBidStarted=" + _isBidStarted + "";

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

                                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');

                                display = document.querySelector('#lblTimeLeft');
                                startTimer(data[i].timeLeft, display);

                                $("#initialquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
                                $("#iqquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
                                $("#lastQuote" + i).html(data[i].lqQuotedPrice == '0' ? '' : thousands_separators(data[i].lqQuotedPrice))
                                $("#lblstatus" + i).html(data[i].loQuotedPrice)
                                $("#L1Price" + i).html(thousands_separators(data[i].l1Quote))

                                //if (data[i].offeredQuan != 0 && data[i].offeredQuan!= ''){
                                //   $("#delquan" + i).val((data[i].offeredQuan))
                                //}
                                //if (data[i].cess != 0 && data[i].cess != '') {
                                // $("#cess" + i).val((data[i].cess))
                                //}
                                // if (data[i].ncv != 0 && data[i].ncv != '') {
                                // $("#ncv" + i).val((data[i].ncv))
                                // }
                                if (data[i].maskL1Price == 'N') {
                                    $("#L1Price" + i).html('Not Disclosed');
                                }
                                if (data[i].loQuotedPrice == 'L1') {
                                    jQuery('#lblstatus' + i).css('color', 'Blue');
                                }
                                else {
                                    jQuery('#lblstatus' + i).css('color', 'Red');

                                }
                                if (data[i].itemBlockedRemarks != '') {
                                    $('#AllItembtn' + i).attr('disabled', 'disabled')
                                    $('#txtquote' + i).text("Restricted")
                                    $('#txtquote' + i).attr('disabled', 'disabled')
                                    $('#delquan' + i).attr('disabled', 'disabled')
                                    $('#cess' + i).attr('disabled', 'disabled')
                                    $('#ncv' + i).attr('disabled', 'disabled')
                                    $('#landedp' + i).attr('disabled', 'disabled')
                                }
                                else {
                                    $('#txtquote' + i).text("")
                                    $('#txtquote' + i).removeAttr('disabled', 'disabled')
                                    $('#delquan' + i).removeAttr('disabled', 'disabled')
                                    $('#cess' + i).removeAttr('disabled', 'disabled')
                                    $('#ncv' + i).removeAttr('disabled', 'disabled')
                                    $('#landedp' + i).removeAttr('disabled', 'disabled')
                                    $('#AllItembtn' + i).removeAttr('disabled', 'disabled')
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
        connection.on("refreshCAQuotes", function () {
            fetchBidSummaryVendorproduct();
        });
        connection.on("ReceiveMessage", function (objChatmsz) {

            let chat = JSON.parse(objChatmsz)

            //toastr.clear();
            $(".pulsate-regular").css('animation', 'pulse 2s infinite')
            calltoaster(encodeURIComponent(chat.ChatMsg), 'New Message', 'success');

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
            // toastr.clear();

            $(".pulsate-regular").css('animation', 'pulse 2s infinite')
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
                var dtst = (fnConverToLocalTime(data[0].bidDate));
                $('#tblParticipantsService').show();
                jQuery("#tblParticipantsServiceBeforeStartBid").hide();

                $("#hdnAdvFactor").val(data[0].advFactor);
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(dtst);

                //jQuery("#lblbidtime").text(data[0].bidTime);
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
                $('#lblTimeLeftBeforeBid').html('').hide('');
                BidTypeID = data[0].bidTypeID;
                BidForID = data[0].bidForID;

                fetchBidSummaryVendorproduct()

                display = document.querySelector('#lblTimeLeft');
                startTimer((parseInt(data[0].timeLeft)), display);

                $('#btnsubmit').show()

            }
            else if (data.length > 1 || data.length == 0) {

                $('#lblTimeLeftBeforeBid').html('Bid is not  started.').css('color', 'red');

                $('#tblParticipantsService').hide();
                jQuery("#tblParticipantsServiceBeforeStartBid").show();
                _isBidStarted = false;
                $('#btnsubmit').hide()
                fetchBidHeaderDetails(sessionStorage.getItem("BidID"))
            }

            $(window).focusout();
            $(window).blur();
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
var count;
function fetchBidSummaryVendorproduct() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = '';
    count = 0;

    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorCoalExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType") + "&_isBidStarted=" + _isBidStarted + "";
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
                    $('#tblParticipantsService').hide();
                    $('#tblParticipantsServiceBeforeStartBid').show();
                    jQuery("#tblParticipantsServiceBeforeStartBid").empty()
                    jQuery("#tblParticipantsServiceBeforeStartBid").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th class=hide id='bidStartPrice'>Bid start price</th><th class=hide>Target Price</th><th class=hide>Minimum Decrement</th><th class=hide>Initial Quote</th><th class=hide>Current Quote</th><th class=hide> Status </th><th class=hide>Enter your Bid*</th><th class=hide>Action</th><th>Remarks</th></thead>");

                    for (var i = 0; i < data.length; i++) {
                        jQuery("#tblParticipantsServiceBeforeStartBid").append("<tr><td>" + (i + 1) + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=coalid" + i + ">" + data[i].coalID + "</td><td class='hide'>" + data[i].uom + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td class=hide id=ceilingprice" + i + ">" + thousands_separators(data[i].ceilingPrice) + " " + jQuery("#lblcurrency").text() + "</td><td class=hide id=targetprice" + i + ">" + thousands_separators(data[i].targetPrice) + " " + jQuery("#lblcurrency").text() + "</td><td class=hide>" + data[i].minimumDecreament + " " + decreamentOn + "</td><td class=hide id=initialquote" + i + ">" + IQuote + "</td><td class=hide id=lastQuote" + i + ">" + LqQuote + "</td><td class=hide id=lblstatus" + i + ">" + data[i].loQuotedPrice + "</td><td class=hide > <label   id=txtquote" + i + " name=txtquote" + i + " /> </td><td class=hide ><button type='button' id=AllItembtn" + i + " class='btn btn-warning' onclick=InsUpdQuoteSeaExport(" + i + ")>Submit</button><br/><span id=spanmszA" + i + " style=color:#a94442></span><span id=spanamount" + i + "   style=color:#a94442; display:inline-block; width:150px></span></td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td>" + data[i].remarks + "</td></tr>");
                    }
                }
                else {
                    // jQuery("#tblParticipantsService").empty()
                    $('#tblParticipantsServiceBeforeStartBid').hide();
                    $('#tblParticipantsService').hide();
                    jQuery("#Coalitems").empty()
                    sessionStorage.setItem('BidClosingType', data[0].bidClosingType)
                    if (data[0].bidClosingType == 'A') {

                        for (var i = 0; i < data.length; i++) {

                            var IQuote = data[i].iqQuotedPrice == '0' ? '' : data[i].iqQuotedPrice;
                            var LqQuote = data[i].lqQuotedPrice == '0' ? '' : data[i].lqQuotedPrice;
                            var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';


                            jQuery("#Coalitems").append('<table class="table table-bordered" id=tblParticipantsService' + i + ' ></table><div id=collapse class="panel-collapse"><div class="panel-body" style="margin-top:-10px!important;" ><div class="col-md-12"><table class="table" id=itemquotes' + i + '></table></div>');
                            jQuery("#tblParticipantsService" + i).append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>GST %</th><th id='bidStartPrice'>Bid start price</th><th>Target Price</th><th>Minimum Decrement</th><th>Initial Quote</th><th>Current Quote</th><th>L1 Quote</th><th> Status </th></thead>");
                            jQuery("#tblParticipantsService" + i).append("<tr><td> " + (i + 1) + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=coalid" + i + ">" + data[i].coalID + "</td><td class='hide'>" + data[i].uom + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td>" + data[i].gst + "</td><td id=ceilingprice" + i + ">" + thousands_separators(data[i].ceilingPrice) + " </td><td id=targetprice" + i + ">" + thousands_separators(data[i].targetPrice) + "</td><td>" + thousands_separators(data[i].minimumDecreament) + " </td><td id=initialquote" + i + "></td><td id=lastQuote" + i + " class='bold' style='color:Blue;'></td><td  id=L1Price" + i + ">" + thousands_separators(data[i].l1Quote) + "</td><td id=lblstatus" + i + ">" + data[i].loQuotedPrice + "</td></td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td class=hide id=chkMaskL1Price" + i + ">" + data[i].maskL1Price + "</td></tr>");

                            $('#itemquotes' + i).append('<tr id=trquotes' + i + '><td><label class="control-label text-left" style="width:120px!important;">Offered Quantity</label></td><td> <input type="number" onkeyup="CheckQCondition(this,' + data[i].quantity + ',' + i + ')" class="form-control" id=delquan' + i + ' name=delquan' + i + ' placeholder="Offered Quantity" autocomplete="off" maxlength="8" value=' + data[i].offeredQuan + ' /><span id=spanmszQ' + i + ' style=color:#a94442></span></td>');
                            $('#trquotes' + i).append('<td><label class="control-label text-left">Cess</label></td><td> <input type="number" class="form-control threedecimal" onkeyup=onkeyCess(' + i + ') id=cess' + i + ' name=cess' + i + ' value=' + data[i].cess + ' placeholder="Cess per MT" autocomplete="off"  /><span id=spanmszC' + i + ' style=color:#a94442></span></td>');
                            $('#trquotes' + i).append('<td><label class="control-label">NCV</label></td><td> <input type="number" onkeyup="onkeyNCV(' + i + ')" class="form-control threedecimal" id=ncv' + i + ' name=ncv' + i + ' value=' + data[i].ncv + ' placeholder="NCV" autocomplete="off"  /><span id=spanmszN' + i + ' style=color:#a94442></span></td>');
                            $('#trquotes' + i).append('<td><label class="control-label text-left">Price</label></td><td> <input type="number"  onkeyup="calCostNCV(this,' + i + ')"  class="form-control threedecimal" id=landedp' + i + ' name=landedp' + i + ' placeholder="Landed Price Per MT" autocomplete="off" value=' + data[i].landedPrice + ' /><span id=spanmszL' + i + ' style=color:#a94442></span></td><td><label class="form-control number" id=txtquote' + i + ' name=txtquote' + i + ' placeholder="Cost/NCV" /><span id=spanamount' + i + '   style=color:#a94442></span></td>');
                            $('#trquotes' + i).append('<td><button type=button id=AllItembtn' + i + ' class="btn btn-warning clsdisable" onclick=InsUpdQuoteSeaExport(' + i + ')>Submit</button><br/><span id=spanmszA' + i + ' style=color:#a94442>Ok</span></td></tr>');

                            $("#lastQuote" + i).html(data[i].lqQuotedPrice == '0' ? '' : thousands_separators(data[i].lqQuotedPrice))
                            $("#initialquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))

                            $('#spanamount' + i).addClass('hide spanclass');
                            $('#spanmszA' + i).addClass('hide spanclass');


                            if (data[i].maskVendor == 'Y') {
                                $("#targetprice" + i).html('Not Disclosed');
                            }
                            if (data[i].maskL1Price == 'N') {
                                $("#L1Price" + i).html('Not Disclosed');
                            }
                            if (data[i].showStartPrice == 'N') {
                                $("#ceilingprice" + i).html('Not Disclosed');
                            }

                            if (data[i].itemBlockedRemarks != '') {
                                $('#AllItembtn' + i).attr('disabled', 'disabled')
                                $('#txtquote' + i).text("Restricted")
                                $('#txtquote' + i).attr('disabled', 'disabled')
                                $('#delquan' + i).attr('disabled', 'disabled')
                                $('#cess' + i).attr('disabled', 'disabled')
                                $('#ncv' + i).attr('disabled', 'disabled')
                                $('#landedp' + i).attr('disabled', 'disabled')
                            }
                            else {

                                $('#txtquote' + i).text("")
                                $('#txtquote' + i).removeAttr('disabled', 'disabled')
                                $('#delquan' + i).removeAttr('disabled', 'disabled')
                                $('#cess' + i).removeAttr('disabled', 'disabled')
                                $('#ncv' + i).removeAttr('disabled', 'disabled')
                                $('#landedp' + i).removeAttr('disabled', 'disabled')
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
function onkeyCess(index) {

    $('#spanamount' + index).addClass('hide')
    $('#txtquote' + index).html('');
    if ($('#cess' + index).val().indexOf(".") > -1 && ($('#cess' + index).val().split('.')[1].length > 2)) {
        $('#spanmszC' + index).text($('#cess' + index).val() + ' must three decimal places');
        $('#spanmszC' + index).removeClass('hide')
        $('#cess' + index).val('')

    }
    else {
        $('#spanmszC' + index).text('');
        $('#spanmszC' + index).addClass('hide')
    }
    if ($('#cess' + index).val() != '') {
        cess = $('#cess' + index).val();
    }

    if (parseFloat($('#landedp' + index).val()) > 0 && parseFloat($('#ncv' + index).val()) > 0) {
        var price = (parseFloat($('#landedp' + index).val()) + parseFloat(cess)) / parseFloat($('#ncv' + index).val());
        // $('#txtquote' + index).val(price.round(3));
        //  $('#txtquote' + index).innerHTML=(price.round(3));
        //   document.getElementById('txtquote'+ index).innerHTML=(price.round(3));
        $('#txtquote' + index).html(price.round(3));
    }
}
function onkeyNCV(index) {

    $('#spanamount' + index).addClass('hide')
    $('#txtquote' + index).html('');
    $('#spanmszN' + index).addClass('hide');
    $('#spanmszN' + index).text('')
    if ($('#ncv' + index).val().indexOf(".") > -1 && ($('#ncv' + index).val().split('.')[1].length > 2)) {
        $('#spanmszN' + index).text($('#ncv' + index).val() + ' must three decimal places');
        $('#spanmszN' + index).removeClass('hide')
        $('#ncv' + index).val('')
    }
    else {
        $('#spanmszN' + index).text('');
        $('#spanmszN' + index).addClass('hide')
    }
    if ($('#cess' + index).val() != '') {
        cess = $('#cess' + index).val();
    }
    if (parseFloat($('#landedp' + index).val()) > 0 && parseFloat($('#ncv' + index).val()) > 0) {
        var price = (parseFloat($('#landedp' + index).val()) + parseFloat(cess)) / parseFloat($('#ncv' + index).val());
        $('#txtquote' + index).html(price.round(3));
    }
}
var cess = 0;
var pricetextval = 0;
function calCostNCV(txtid, index) {

    cess = 0;
    pricetextval = 0;
    $('#spanmszL' + index).addClass('hide');
    $('#spanamount' + index).addClass('hide')
    $('#spanmszA' + index).addClass('hide')
    $('#spanmszL' + index).text('')
    if ($('#' + txtid.id).val().indexOf(".") > -1 && ($('#' + txtid.id).val().split('.')[1].length > 2)) {
        $('#spanmszL' + index).text($('#' + txtid.id).val() + ' must three decimal places');
        $('#spanmszL' + index).removeClass('hide')
        $('#ncv' + index).val('')
    }
    else {
        $('#spanmszL' + index).text('');
        $('#spanmszL' + index).addClass('hide')
    }
    if ($('#cess' + index).val() != '') {
        cess = $('#cess' + index).val();
        //$('#spanmszC' + index).removeClass('hide');
        // $('#spanmszC' + index).text('Please Enter Cess')
    }

    // if ($('#delquan' + index).val() == '') {
    //     cess = $('#delquan' + index).val();
    //     $('#spanmszQ' + index).removeClass('hide');
    //     $('#spanmszQ' + index).text('Please Enter Quantity')
    //  }

    if ($('#ncv' + index).val() == '') {
        $('#spanmszN' + index).removeClass('hide');
        $('#spanmszN' + index).text('Please Enter NCV')
        $('#' + txtid.id).val('')
    }
    else {
        if ($('#' + txtid.id).val() == '') {
            pricetextval = 0;
        }
        else {
            pricetextval = $('#' + txtid.id).val();
        }
        if (parseFloat($('#landedp' + index).val()) > 0 && parseFloat($('#ncv' + index).val()) > 0) {

            var price = (parseFloat(pricetextval) + parseFloat(cess)) / parseFloat($('#ncv' + index).val());
            //$('#txtquote' + index).val(price.round(3));
            //  $('#txtquote' + index).innerHTML=(price.round(3));
            $('#txtquote' + index).html(price.round(3));
        }
    }
}
function CheckQCondition(txtid, quantity, index) {

    if ($('#' + txtid.id).val() > quantity) {
        $('#spanmszQ' + index).removeClass('hide');
        $('#spanmszQ' + index).text('Offered Quantity ' + $('#' + txtid.id).val() + ' should be less then Quantity')
        $('#' + txtid.id).val('')
    }
    else {
        $('#spanmszQ' + index).addClass('hide');
        $('#spanmszQ' + index).text('')
    }
}


var mytime = 0;
var mytimeforSatus = 0;
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
        if (timer <= 0) {
            $('.clsdisable').attr('disabled', 'disabled')

        }
        else if (timer > 0 && $('.clsdisable').is(':disabled') && $('.number').closest('label').text() !== "Restricted") {
            $('.clsdisable').removeAttr('disabled')
        }
        if (timer == 300) {
            $('#pleft5mins').removeClass('hide')
        }
        else if (timer <= 240 || timer > 300) {
            $('#pleft5mins').addClass('hide')
        }
        // setTimeout(function () {
        if (--timer < -3) {
            timer = -3;
            if (timer == -3) {
                closeBidAir();
            }
        }
        // }, 1000);
        $('#hdnval').val(timer)

    }, 1000);

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

    if (($('#delquan' + index).val() == '') || (parseFloat($('#delquan' + index).val()) <= 0)) {
        $('#spanmszQ' + index).removeClass('hide')
        $('#spanmszQ' + index).text('Please Enter Quantity')
        return false
    }
    if (($('#ncv' + index).val() == '') || (parseFloat($('#ncv' + index).val()) <= 0)) {
        $('#spanmszN' + index).removeClass('hide');
        $('#spanmszN' + index).text('Please Enter NCV')
        return false
    }
    if (($('#landedp' + index).val() == '') || (parseFloat($('#landedp' + index).val()) <= 0)) {

        $('#spanmszL' + index).removeClass('hide');
        $('#spanmszL' + index).text('Please Enter Landed Price per MT')
        return false
    }


    if ($('#decon' + index).text() == "A") {
        if (jQuery("#lastQuote" + index).text() == '' || jQuery("#lastQuote" + index).text() == '0') {

            value = parseFloat($('#txtquote' + index).html());//parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
            valuejap = parseFloat($('#txtquote' + index).html());// parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
        }
        else {

            value = (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).html()))).toFixed(3)
            valuejap = (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).html()))).toFixed(3)
        }

    }
    else {
        if (jQuery("#lastQuote" + index).text() == '' || jQuery("#lastQuote" + index).text() == '0') {
            value = ((parseFloat(Amount) / 100) * (parseFloat(jQuery("#txtquote" + index).html()))).toFixed(3);
            v = parseFloat(removeThousandSeperator($('#txtquote' + index).html()))
            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(jQuery("#txtquote" + index).html()))).toFixed(3);
            vjap = parseFloat($('#txtquote' + index).html())
        }
        else {
            value = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())))).toFixed(3);
            v = (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).html()))).toFixed(3);

            valuejap = ((parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())))).toFixed(3);
            vjap = (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).html()))).toFixed(3);
        }
    }


    //if ((removeThousandSeperator($('#txtquote' + index).val()) == 0) || (!/^[0-9]+(\.[0-9]{1,3})?$/.test(removeThousandSeperator($('#txtquote' + index).val())))) {

    //    $('#spanamount' + index).removeClass('hide')
    //    $('#spanamount' + index).text('Amount is required in number only')
    //    return false
    //}

    if (parseFloat(removeThousandSeperator($('#ceilingprice' + index).text())) < parseFloat($('#txtquote' + index).html())) {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Amount should be less than Bid start price')
        return false
    }
    else if (parseFloat(value) <= parseFloat(Amount) && $('#decon' + index).text() == "A" && value != 0 && BidForID == "81") {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text())
        return false
    }
    else if (parseFloat(valuejap) < parseFloat(Amount) && $.trim($('#decon' + index).text() == "A") && value != 0 && $.trim(BidForID) == "83") {

        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text() + ".")
        return false
    }
    //else if (v < value && $('#decon' + index).text() == "P" && BidForID == "81") {
    //    $('#spanamount' + index).removeClass('hide')
    //    $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + '%')
    //    return false
    //}
    //else if (vjap < valuejap && $('#decon' + index).text() == "P" && BidForID == "83") {
    //    $('#spanamount' + index).removeClass('hide')
    //    $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + '%')
    //    return false
    //}
    else {
        cess = 0;
        if ($('#cess' + index).val() != "" && $('#cess' + index).val() != null) {
            cess = $('#cess' + index).val()
        }
        // if ($('#hdnval').val() >= 60) {
        var QuoteProduct = {
            "VendorID": vendorID,
            "BidID": parseInt(sessionStorage.getItem("BidID")),
            "EnteredBy": vendorID,
            "Quote": parseFloat($('#txtquote' + index).html()),
            "CoalID": parseInt($('#coalid' + index).html()),
            "OfferedQuan": parseFloat($("#delquan" + index).val()),
            "Cess": parseFloat(removeThousandSeperator(cess)),
            "NCV": parseFloat(removeThousandSeperator($('#ncv' + index).val())),
            "LandedPrice": parseFloat(removeThousandSeperator($('#landedp' + index).val())),
            "isPrepricing": 'Y',
            "extendTime": parseInt($('#hdnval').val())
        }
        //alert(JSON.stringify(QuoteProduct))
        // console.log(JSON.stringify(QuoteProduct))
        $('#hdnselectedindex').val(index);
        connection.invoke("RefreshBidParticipationCoal", JSON.stringify(QuoteProduct), parseInt(sessionStorage.getItem("BidID"))).catch(function (err) {
            return console.error(err.toString());
        });

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
            return false;
        }
    });
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
$(document).on("keyup", "#tblParticipantsService .form-control", function () {
    var txt = this.id
    $('#' + txt).next(':first').addClass('hide');
    $('.spanclass').addClass('hide')

});

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
                var dtst = (fnConverToLocalTime(data[0].bidDate));
                $('#tblParticipantsService').show();
                tncAttachment = data[0].termsConditions.replace(/\s/g, "%20");
                anyotherAttachment = data[0].attachment.replace(/\s/g, "%20");
                $("#hdnAdvFactor").val(data[0].advFactor);
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                //jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbiddate").text(dtst);
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

                var display = document.querySelector('#lblTimeLeft');
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
