var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)
var BIDID = getUrlVarsURL(decryptedstring)["BidID"];

function fetchBidHeaderDetails() {
   
    var url = '';
    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails_Vendor/?BidID=" + BIDID + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"))
   
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
                sessionStorage.setItem('hdnbidtypeid', data[0].bidTypeID);
                
                $('#tblParticipantsService').show();
                $("#hdnAdvFactor").val(data[0].advFactor);
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblbidfor").text(data[0].bidFor);

                jQuery("a#lnkTermsAttachment").text(data[0].termsConditions);
                jQuery("a#lnkAnyOtherAttachment").text(data[0].attachment);
              
                jQuery("#lblbidduration").text(data[0].bidDuration);
                jQuery("#lblcurrency").text(data[0].currencyName);
                jQuery("#lblConvRate").text(data[0].conversionRate);
                jQuery("#lblstatus").text(data[0].conversionRate);
                jQuery("#lblConvRate").text(data[0].conversionRate);
                if (data[0].bidTypeID == 7) {
                    $('#tblParticipantsService').removeClass('hide');
                    $('#tblParticipantsVender').addClass('hide');
                    fetchBidSummaryVendorproduct()
                }
                else if (data[0].bidTypeID == 8) {
                    $('#tblParticipantsService').removeClass('hide');
                    $('#tblParticipantsVender').addClass('hide');
                    fetchBidSummaryVendorproductCoal()
                }
                else {
                    $('#tblParticipantsService').addClass('hide');
                    $('#tblParticipantsVender').removeClass('hide');
                    if (data[0].bidForID == 81 || data[0].bidForID == 83) {
                        fetchBidSummaryVendorScrap();
                    }
                    else{
                        fetchBidSummaryVendorScrapDutch();
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
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });

}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + BIDID);
}
function fetchBidSummaryVendorproduct() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = '';
    count = 0;
   
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType") + "&AthenticationToken=''&_isBidStarted="+false+"";
    
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
               
                    jQuery("#tblParticipantsService").empty()

                    sessionStorage.setItem('BidClosingType', data[0].bidClosingType)
                    if (data[0].bidClosingType == 'A') {

                        jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>Initial Quote</th><th>Last Quote</th></thead>");
                       
                        for (var i = 0; i < data.length; i++) {

                            var IQuote = data[i].iqQuotedPrice == '0' ? 'Not Quoted' : data[i].iqQuotedPrice;
                            var LqQuote = data[i].lqQuotedPrice == '0' ? 'Not Quoted' : data[i].lqQuotedPrice;
                            var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                            jQuery("#tblParticipantsService").append("<tr><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].seid + ")' style='text-decoration:none;'>" + data[i].destinationPort + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=initialquote" + i + ">" + thousands_separators(IQuote) + "</td><td id=lastQuote" + i + ">" + thousands_separators(LqQuote) + "</td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td class=hide id=chkMaskL1Price" + i + ">" + data[i].maskL1Price + "</td></tr>");

                            $('#spanamount' + i).addClass('hide spanclass');
                            $('#spanmszA' + i).addClass('hide spanclass');
                            $('#txtquote' + i).val(thousands_separators(data[i].lqQuotedPrice));

                            if (data[i].maskVendor == 'Y') {
                                $("#targetprice" + i).html('Not Disclosed');
                            }
                            if (data[i].maskL1Price == 'N') {
                                $("#L1Price" + i).html('Not Disclosed');
                            }
                            if (data[i].showStartPrice == 'N') {
                                $("#ceilingprice" + i).html('Not Disclosed');
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
                    else {
                        jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>Initial Quote</th><th>Last Quote</th></thead>");

                        for (var i = 0; i < data.length; i++) {

                            var IQuote = data[i].iqQuotedPrice == '0' ? 'Not Quoted' : data[i].iqQuotedPrice;
                            var LqQuote = data[i].lqQuotedPrice == '0' ? 'Not Quoted' : data[i].lqQuotedPrice;
                            var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                            jQuery("#tblParticipantsService").append("<tr class=text-center><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].seid + ")' style='text-decoration:none;'>" + data[i].destinationPort + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=initialquote" + i + ">" + thousands_separators(IQuote) + "</td><td id=lastQuote" + i + ">" + thousands_separators(LqQuote) + "</td><td class=hide>" + data[i].maskVendor + "</td></tr>");

                            if (data[i].itemStatus == "Close" || data[i].itemStatus == "Inactive") {
                                $("#itemleft" + i).html('')
                                jQuery("#txtquote" + i).attr("disabled", true)
                                jQuery("#itembtn" + i).attr("disabled", true)
                                jQuery("#spanclosedmsz" + i).removeClass("hide")
                                jQuery("#spanclosedmsz" + i).css("color", "")
                            }
                            else {
                                $("#itemleft" + i).html(data[i].ItemTimeLeft)
                                jQuery("#txtquote" + i).attr("disabled", false)
                                jQuery("#itembtn" + i).attr("disabled", false)
                                jQuery("#spanclosedmsz" + i).addClass("hide")

                            }

                            if (data[i].maskVendor == 'Y') {
                                $("#targetprice" + i).html('Not Disclosed')
                            }
                            if (data[i].maskL1Price == 'N') {
                                $("#L1Price" + i).html('Not Disclosed');
                            }
                            if (data[i].showStartPrice == 'N') {
                                $("#ceilingprice" + i).html('Not Disclosed');
                            }

                            $('#spanamount' + i).addClass('hide spanclass');
                            $('#spanmsz' + i).addClass('hide spanclass');
                            $('#spanclosedmsz' + i).addClass('hide spanclass');
                            $('#txtquote' + i).val(thousands_separators(data[i].lqQuotedPrice));

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
                            }

                            count = count + 1;

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
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    })
    jQuery.unblockUI();

}
function fetchBidSummaryVendorproductCoal() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = '';
    count = 0;

    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorCoalExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType") + "&AthenticationToken=''&_isBidStarted=" + false + "";

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

                jQuery("#tblParticipantsService").empty()

                sessionStorage.setItem('BidClosingType', data[0].bidClosingType)
                if (data[0].bidClosingType == 'A') {

                    jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>Initial Quote</th><th>Last Quote</th></thead>");

                    for (var i = 0; i < data.length; i++) {

                        var IQuote = data[i].iqQuotedPrice == '0' ? 'Not Quoted' : data[i].iqQuotedPrice;
                        var LqQuote = data[i].lqQuotedPrice == '0' ? 'Not Quoted' : data[i].lqQuotedPrice;
                        var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsService").append("<tr><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].seid + ")' style='text-decoration:none;'>" + data[i].destinationPort + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=initialquote" + i + ">" + thousands_separators(IQuote) + "</td><td id=lastQuote" + i + ">" + thousands_separators(LqQuote) + "</td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td class=hide id=chkMaskL1Price" + i + ">" + data[i].maskL1Price + "</td></tr>");

                        $('#spanamount' + i).addClass('hide spanclass');
                        $('#spanmszA' + i).addClass('hide spanclass');
                        $('#txtquote' + i).val(thousands_separators(data[i].lqQuotedPrice));

                        if (data[i].maskVendor == 'Y') {
                            $("#targetprice" + i).html('Not Disclosed');
                        }
                        if (data[i].maskL1Price == 'N') {
                            $("#L1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].showStartPrice == 'N') {
                            $("#ceilingprice" + i).html('Not Disclosed');
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
                else {
                    jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>Initial Quote</th><th>Last Quote</th></thead>");

                    for (var i = 0; i < data.length; i++) {

                        var IQuote = data[i].iqQuotedPrice == '0' ? 'Not Quoted' : data[i].iqQuotedPrice;
                        var LqQuote = data[i].lqQuotedPrice == '0' ? 'Not Quoted' : data[i].lqQuotedPrice;
                        var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsService").append("<tr class=text-center><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].seid + ")' style='text-decoration:none;'>" + data[i].destinationPort + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=initialquote" + i + ">" + thousands_separators(IQuote) + "</td><td id=lastQuote" + i + ">" + thousands_separators(LqQuote) + "</td><td class=hide>" + data[i].maskVendor + "</td></tr>");

                        if (data[i].itemStatus == "Close" || data[i].itemStatus == "Inactive") {
                            $("#itemleft" + i).html('')
                            jQuery("#txtquote" + i).attr("disabled", true)
                            jQuery("#itembtn" + i).attr("disabled", true)
                            jQuery("#spanclosedmsz" + i).removeClass("hide")
                            jQuery("#spanclosedmsz" + i).css("color", "")
                        }
                        else {
                            $("#itemleft" + i).html(data[i].ItemTimeLeft)
                            jQuery("#txtquote" + i).attr("disabled", false)
                            jQuery("#itembtn" + i).attr("disabled", false)
                            jQuery("#spanclosedmsz" + i).addClass("hide")

                        }

                        if (data[i].maskVendor == 'Y') {
                            $("#targetprice" + i).html('Not Disclosed')
                        }
                        if (data[i].maskL1Price == 'N') {
                            $("#L1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].showStartPrice == 'N') {
                            $("#ceilingprice" + i).html('Not Disclosed');
                        }

                        $('#spanamount' + i).addClass('hide spanclass');
                        $('#spanmsz' + i).addClass('hide spanclass');
                        $('#spanclosedmsz' + i).addClass('hide spanclass');
                        $('#txtquote' + i).val(thousands_separators(data[i].lqQuotedPrice));

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
                        }

                        count = count + 1;

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
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    })
    jQuery.unblockUI();

}
function fetchBidSummaryVendorScrap() {
    count = 0;
    var url = '';
    
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryPefa/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType") + "&AthenticationToken=''";
   
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

                    jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th>Last Quote</th></thead>");
                    for (var i = 0; i < data.length; i++) {

                        var IQuote = data[i].iqQuotedPrice == '0' ? '' : data[i].iqQuotedPrice;
                        var MqQuote = data[i].mqQuotedPrice == '0' ? 'Not Quoted' : data[i].mqQuotedPrice;
                        var decreamentOn = data[i].increamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsVender").append("<tr><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].minimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].increamentOn + "</td><td class=hide id=psid" + i + ">" + data[i].psid + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].psid + ")' style='text-decoration:none;'>" + data[i].shortName + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=lastQuote" + i + ">" + thousands_separators(MqQuote) + "</td></tr>");

                        $('#spanamount' + i).addClass('hide spanclass');
                        $('#txtquote' + i).val(thousands_separators(data[i].mqQuotedPrice));
                        
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
                        count = count + 1;
                    }
                    
                }
                else {
                    jQuery("#tblParticipantsVender").append("<tr><td>Nothing Participation</td></tr>")
                }
            
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}



function fetchBidSummaryVendorScrapDutch() {
    count = 0;
    var url = '';
    
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryPefaDutch/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType");
   // alert(url)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            //alert(JSON.stringify(data))
            jQuery("#tblParticipantsVender").empty();
            if (data.length > 0) {
                
                var _offeredPrice;
                jQuery("#tblParticipantsVender >tbody").empty();
                jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th>Accepted Unit Price (" + $('#lblcurrency').text() + ")</th></thead>");
                for (var i = 0; i < data.length; i++) {
                   
                    if (data[i].moQuotedPrice == "H1") {
                        
                        _offeredPrice = thousands_separators(data[i].mqQuotedPrice);
                    }
                    else {
                        _offeredPrice = data[i].moQuotedPrice;
                    }
                        
                       
                    jQuery("#tblParticipantsVender").append("<tr><td class=hide id=psid" + i + ">" + data[i].psid + "</td><td>" + data[i].shortName + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id='offeredprice" + i + "'>" + _offeredPrice + "</td></tr>");

                            count = count + 1;
                     
                    }
                }

            
            
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });

}
function fetchGraphData(itemId) {
    
    var _bidTypeID;
    
        _bidTypeID = sessionStorage.getItem('hdnbidtypeid');
    
    
    graphData = [];

    var _date;
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryTrendGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + sessionStorage.getItem('UserID') + "&chartFor=sample",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            
            $("#tblForTrendGraphs").empty();
            if (data) {
                $("#tblForTrendGraphs").append("<tr><th>Submission Time</th><th>Quoted Price</th><th>Vendor</th></tr>");
                for (var i = 0; i < data.length; i++) {
                    _date = new Date(data[i].submissionTime);

                    if (data[i].vendorID == sessionStorage.getItem("VendorId")) {
                        $("#tblForTrendGraphs").append("<tr><td>" + _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear() + " " + minutes_with_leading_zeros(new Date(data[i].submissionTime).getHours()) + ":" + minutes_with_leading_zeros(new Date(data[i].submissionTime).getMinutes()) + "</td><td>" + data[i].quotedPrice + "</td><td>" + data[i].vendorName + "</td></tr>");
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
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    }).done(function () {
        
        $("#graphModalLine").modal('show');
       
        linegraphsforItems(itemId)
    });
}
var Vendorseries = "";
var graphtime = [];
var dataQuotes = [];
var Seriesoption = [];
var FinalQuotes = [];
var Quotes = "";
var minprice;
var maxprice;
function linegraphsforItems(itemId) {

    var _bidTypeID;
    var _date;
    _bidTypeID = sessionStorage.getItem('hdnbidtypeid');
  
    
    graphtime = [];
    Vendorseries = "";
    dataQuotes = [];
    Seriesoption = [];
    FinalQuotes = [];
    var colorArray = ['#007ED2', '#f15c80', '#90ED7D', '#FF7F50', '#f15c80', '#FF5733', '#96FF33', '#33FFF0', '#F9FF33', '#581845', '#0B0C01', '#0C0109', '#DAF7A6', '#FFC300', '#08010C'];
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            minprice = parseInt(data[0].minMaxprice[0].minPrice - 5);
            maxprice = parseInt(data[0].minMaxprice[0].maxPrice + 5);

            $('#lblbidstarttime').text(data[0].bidStartEndTime[0].bidStartTime);
            $('#lblbidendtime').text(data[0].bidStartEndTime[0].bidEndTime);


            if (data[0].submissionTime.length > 0) {

                for (var x = 0; x < data[0].submissionTime.length; x++) {
                    graphtime.push(data[0].submissionTime[x].subTime);
                }

            }
            Vendorseries = "";
            var values = 0;
       
                if (data[0].vendorNames.length > 0) {


                    for (var i = 0; i < data[0].vendorNames.length; i++) {
                       
                        Quotes = "";
                        values = null;;
                       
                        for (var j = 0; j < data[0].quotesDetails.length; j++) {
                            if (data[0].vendorNames[i].vendorID == data[0].quotesDetails[j].vendorID) {
                                Quotes = Quotes + '["' + data[0].quotesDetails[j].subTime + '",' + data[0].quotesDetails[j].quotedPrice + '],';
                                
                                values = data[0].quotesDetails[j].quotedPrice;
                            }
                            else {
                               
                                Quotes = Quotes + '["' + data[0].quotesDetails[j].subTime + '",' + values + '],';
                            }
                        }

                       
                        Quotes = Quotes.slice(0, -1);
                       
                        Vendorseries = '{ "name" :"' + data[0].vendorNames[i].vendorName + '", "color": "' + colorArray[i] + '","data": [' + Quotes + ']}';
                      
                        Seriesoption.push(JSON.parse(Vendorseries));

                    }

                }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
     })

    setTimeout(function () {
        
        $('#linechart_material').highcharts({
            title: {
                text: '',
                style: {
                    
                    fontSize: '15px',
                    
                },
               
            },

            xAxis: {

                title: {
                    text: 'Time'
                },

                categories: graphtime//,'12:42','15:14','15:14','15:14','15:57']//graphtime

            },
            yAxis: {
                min: minprice,
                max: maxprice,
                title: {
                    text: 'Quoted Price'
                },
               
            },
            
            series: Seriesoption,
            
            credits: {
                enabled: false
            }

        });

    }, 1000)



}

