var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)
var BIDID = getUrlVarsURL(decryptedstring)["BidID"];
//FROM HTML
jQuery(document).ready(function () {
    Pageloaded()

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
    multilingualLanguage();
    App.init();
    QuickSidebar.init();
    setCommonData();
    fetchBidHeaderDetails();

});
//
function fetchBidHeaderDetails() {

    var url = '';
    var _vendorID = parseInt(sessionStorage.getItem("VendorId"));
    var bidDetailsVendorObj = {
        "BidID": BIDID,
        "VendorID": _vendorID
    }

    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails_Vendor/?BidID=" + bidId + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"))
    //url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails_Vendor"
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        //data: JSON.stringify(bidDetailsVendorObj),
        dataType: "json",
        success: function (data, status, jqXHR) {

            if (data.length == 1) {
                sessionStorage.setItem('hdnbidtypeid', data[0].bidTypeID);
                $('#tblParticipantsService').show();
                $("#hdnAdvFactor").val(data[0].advFactor);
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(fnConverToLocalTime(data[0].bidDate));
                //jQuery("#lblbidtime").text(data[0].bidTime);
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
                    if (data[0].bidForID == 81 || data[0].bidForID == 83) {
                        fetchBidSummaryVendorproduct();
                    }
                    else {

                        fetchBidSummaryVendorSeaexportDutch();
                    }

                }
                else if (data[0].bidTypeID == 9) {
                    $('#tblParticipantsService').removeClass('hide');
                    $('#tblParticipantsVender').addClass('hide');
                    fetchBidSummaryVendorproductFF()
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
                    else {
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

    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType") + "&_isBidStarted=" + false + "";
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

                        var IQuote = data[i].iqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].iqQuotedPrice);
                        var LqQuote = data[i].lqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].lqQuotedPrice);
                        //var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsService").append("<tr><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].seid + ")' style='text-decoration:none;'>" + data[i].destinationPort + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=initialquote" + i + ">" + IQuote + "</td><td id=lastQuote" + i + ">" + LqQuote + "</td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td class=hide id=chkMaskL1Price" + i + ">" + data[i].maskL1Price + "</td></tr>");
                        if (data[i].maskL1Price == 'N') {
                            $("#L1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].showStartPrice == 'N') {
                            $("#ceilingprice" + i).html('Not Disclosed');
                        }

                    }

                }
                else {
                    jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>Initial Quote</th><th>Last Quote</th></thead>");

                    for (var i = 0; i < data.length; i++) {

                        var IQuote = data[i].iqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].iqQuotedPrice);
                        var LqQuote = data[i].lqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].lqQuotedPrice);
                        // var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsService").append("<tr class=text-center><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].seid + ")' style='text-decoration:none;'>" + data[i].destinationPort + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=initialquote" + i + ">" + IQuote + "</td><td id=lastQuote" + i + ">" + LqQuote + "</td><td class=hide>" + data[i].maskVendor + "</td></tr>");

                        if (data[i].maskL1Price == 'N') {
                            $("#L1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].showStartPrice == 'N') {
                            $("#ceilingprice" + i).html('Not Disclosed');
                        }
                        if (data[i].loQuotedPrice == 'L1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else {

                            jQuery('#lblstatus' + i).css('color', 'Red');
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
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    })
    jQuery.unblockUI();

}
function fetchBidSummaryVendorSeaexportDutch() {

    var url = '';
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExportDutch/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BidID + "&UserType=" + sessionStorage.getItem("UserType")

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
                jQuery("#tblParticipantsService").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th>Offered Unit Price (" + $('#lblcurrency').text() + ")</th></thead>");
                for (var i = 0; i < data.length; i++) {

                    if (data[i].loQuotedPrice == 'L1') {
                        _offeredPrice = thousands_separators(data[i].lqQuotedPrice);

                    }
                    else {
                        _offeredPrice = data[i].lqQuotedPrice;
                    }
                    jQuery("#tblParticipantsService").append("<tr><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id='offeredprice" + i + "'>" + _offeredPrice + "</td></tr>");
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
function fetchBidSummaryVendorproductFF() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = '';


    url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryFrench/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType");

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
                jQuery("#tblParticipantsService").append("<thead> <tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product</th><th>Total Quantity</th><th>UOM</th><th>Last Quote</th><th>Bidded Quantity*</th><th>Allocated Quantity</th></thead>");
                for (var i = 0; i < data.length; i++) {


                    var MqQuote = data[i].mqQuotedPrice == '0' ? '' : data[i].mqQuotedPrice;

                    $("#tblParticipantsService").append("<tr><td>" + (i + 1) + "</td><td class=hide id=FRID" + i + ">" + data[i].frid + "</td><td>" + data[i].shortName + "</td><td class='text-center'>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=lastQuote" + i + " class='text-center' ></td><td class='text-center' id=txtquantity" + i + " ></td><td  class='text-center bold' id=allocatedQuan" + i + " >" + thousands_separators(data[i].allocatedQuantity) + "</td></tr>");
                    jQuery('#allocatedQuan' + i).css('color', 'Red');
                    $("#lastQuote" + i).html(data[i].mqQuotedPrice == '0' ? '' : thousands_separators(MqQuote))

                    $('#txtquantity' + i).text(data[i].bidQuantity == '0' ? '' : thousands_separators(data[i].bidQuantity));
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

                        var IQuote = data[i].iqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].iqQuotedPrice);
                        var LqQuote = data[i].lqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].lqQuotedPrice);
                        //var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsService").append("<tr><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].seid + ")' style='text-decoration:none;'>" + data[i].destinationPort + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=initialquote" + i + ">" + IQuote + "</td><td id=lastQuote" + i + ">" + LqQuote + "</td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td class=hide id=chkMaskL1Price" + i + ">" + data[i].maskL1Price + "</td></tr>");


                        if (data[i].maskVendor == 'Y') {
                            $("#targetprice" + i).html('Not Disclosed');
                        }
                        if (data[i].maskL1Price == 'N') {
                            $("#L1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].showStartPrice == 'N') {
                            $("#ceilingprice" + i).html('Not Disclosed');
                        }

                    }

                }
                else {
                    jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>Initial Quote</th><th>Last Quote</th></thead>");

                    for (var i = 0; i < data.length; i++) {

                        var IQuote = data[i].iqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].iqQuotedPrice);
                        var LqQuote = data[i].lqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].lqQuotedPrice);
                        // var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsService").append("<tr class=text-center><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].seid + ")' style='text-decoration:none;'>" + data[i].destinationPort + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=initialquote" + i + ">" + IQuote + "</td><td id=lastQuote" + i + ">" + LqQuote + "</td><td class=hide>" + data[i].maskVendor + "</td></tr>");




                        if (data[i].maskL1Price == 'N') {
                            $("#L1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].showStartPrice == 'N') {
                            $("#ceilingprice" + i).html('Not Disclosed');
                        }

                        $('#spanamount' + i).addClass('hide spanclass');
                        $('#spanmsz' + i).addClass('hide spanclass');

                        if (data[i].loQuotedPrice == 'L1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else {

                            jQuery('#lblstatus' + i).css('color', 'Red');
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

                    //var IQuote = data[i].iqQuotedPrice == '0' ? '' : data[i].iqQuotedPrice;
                    var MqQuote = data[i].mqQuotedPrice == '0' ? 'Not Quoted' : thousands_separators(data[i].mqQuotedPrice);
                    //var decreamentOn = data[i].increamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                    jQuery("#tblParticipantsVender").append("<tr><td class=hide id=ceilingprice" + i + ">" + data[i].ceilingPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].minimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].increamentOn + "</td><td class=hide id=psid" + i + ">" + data[i].psid + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].psid + ")' style='text-decoration:none;'>" + data[i].shortName + "</a></td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=lastQuote" + i + ">" + MqQuote + "</td></tr>");



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
        //url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryTrendGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + sessionStorage.getItem('UserID') + "&chartFor=sample",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryTrendGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&chartFor=sample",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            $("#tblForTrendGraphs").empty();
            if (data) {
                $("#tblForTrendGraphs").append("<tr><th>Submission Time</th><th>Quoted Price</th><th>Vendor</th></tr>");
                for (var i = 0; i < data.length; i++) {
                    var _dtWithSec = fnConverToLocalTimeWithSeconds(data[i].submissionTime);
                    _dtWithSec = _dtWithSec.replace('-', '');
                    //_date = new Date(data[i].submissionTime);
                    _date = new Date(_dtWithSec);

                    if (data[i].vendorID == sessionStorage.getItem("VendorId")) {
                        //$("#tblForTrendGraphs").append("<tr><td>" + _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear() + " " + minutes_with_leading_zeros(new Date(data[i].submissionTime).getHours()) + ":" + minutes_with_leading_zeros(new Date(data[i].submissionTime).getMinutes()) + "</td><td>" + data[i].quotedPrice + "</td><td>" + data[i].vendorName + "</td></tr>");
                        $("#tblForTrendGraphs").append("<tr><td>" + _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear() + " " + minutes_with_leading_zeros(_date.getHours()) + ":" + minutes_with_leading_zeros(_date.getMinutes()) + "</td><td>" + data[i].quotedPrice + "</td><td>" + data[i].vendorName + "</td></tr>");
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
    var _bidId = getUrlVarsURL(decryptedstring)["BidID"]
    _bidTypeID = parseInt(_bidTypeID)
    _bidId = parseInt(_bidId)
    var graphDataReqObj = {
        "SeId": itemId,
        "BidId": _bidId,
        "BidTypeId": _bidTypeID,
        "UserVendorId": sessionStorage.getItem('VendorId')
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + sessionStorage.getItem('VendorId'),
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryGraph",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(graphDataReqObj),
        dataType: "json",
        success: function (data, status, jqXHR) {
            minprice = parseInt(data[0].minMaxprice[0].minPrice - 5);
            maxprice = parseInt(data[0].minMaxprice[0].maxPrice + 5);

            $('#lblbidstarttime').text(fnConverToLocalTime(data[0].bidStartEndTime[0].bidStartTime));
            $('#lblbidendtime').text(fnConverToLocalTime(data[0].bidStartEndTime[0].bidEndTime));


            if (data[0].submissionTime.length > 0) {

                for (var x = 0; x < data[0].submissionTime.length; x++) {
                    graphtime.push(fnConverToLocalTimeWithSeconds(data[0].submissionTime[x].subTime));
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
                            Quotes = Quotes + '["' + fnConverToLocalTimeWithSeconds(data[0].quotesDetails[j].subTime) + '",' + data[0].quotesDetails[j].quotedPrice + '],';

                            values = data[0].quotesDetails[j].quotedPrice;
                        }
                        else {

                            Quotes = Quotes + '["' + fnConverToLocalTimeWithSeconds(data[0].quotesDetails[j].subTime) + '",' + values + '],';
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


//abheedev
function multilingualLanguage() {

    var set_locale_to = function (locale) {
        if (locale) {
            $.i18n().locale = locale;
        }

        $('body').i18n();
    };
    jQuery(function () {
        $.i18n().load({
            'en': 'assets/plugins/jquery.i18n/language/en/translation.json', // Messages for english
            'fr': 'assets/plugins/jquery.i18n/language/fr/translation.json' // message for french
        }).done(function () {
            set_locale_to(url('?locale'));

            $(".navbar-language").find(`option[value=${$.i18n().locale}]`).attr("selected", "selected")

            //   <option data-locale="en" value="en">English</option>

            History.Adapter.bind(window, 'statechange', function () {
                set_locale_to(url('?locale'));

            });
            $('.navbar-language').change(function (e) {

                e.preventDefault();
                $.i18n().locale = $('option:selected', this).data("locale");


                History.pushState(null, null, "?locale=" + $.i18n().locale);



            });

            $('a').click(function (e) {

                if (this.href.indexOf('?') != -1) {
                    this.href = this.href;
                }
                else if (this.href.indexOf('#') != -1) {
                    e.preventDefault()
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }
                //else if (this.href.indexOf('javascript:') != -1) {

                //  this.href = this.href + "?locale=" + $.i18n().locale;
                //} 

                else {
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }
            });
        });
    });
}