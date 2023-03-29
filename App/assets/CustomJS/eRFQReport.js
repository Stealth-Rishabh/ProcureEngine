jQuery(document).ready(function () {

    Pageloaded()
   
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl')//"login.html";
    }
    else {
        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    param = getUrlVars()["param"]
    decryptedstring = fndecrypt(param)
    var _RFQid = getUrlVarsURL(decryptedstring)["RFQID"];
    var _VendorId = getUrlVarsURL(decryptedstring)["VendorId"];
    var _RFQVersionId = getUrlVarsURL(decryptedstring)["RFQVersionId"];
    var _rfqVersionText = getUrlVarsURL(decryptedstring)["RFQVersionTxt"];

    if (_RFQid == null) {
        sessionStorage.setItem('hddnRFQID', 0)
        sessionStorage.setItem('hddnVendorId', 0)
        sessionStorage.setItem('RFQVersionId', 0)
        $("#spnFinalStatus").hide();
    }
    else {

        sessionStorage.setItem('hddnRFQID', _RFQid)
        sessionStorage.setItem('hddnVendorId', _VendorId)
        sessionStorage.setItem('RFQVersionId', _RFQVersionId)
        fetchReguestforQuotationDetails();

        GetQuestions();
        $("#spnFinalStatus").show().html("Version : " + _rfqVersionText.replace('%20', ' '));
    }

    setCommonData();
    fetchMenuItemsFromSession(0, 0);
});

var _discountValue = 0;

jQuery('#btnpush').click(function (e) {
    jQuery('#approverList > option:selected').appendTo('#mapedapprover');
});
jQuery('#btnpull').click(function (e) {
    jQuery('#mapedapprover > option:selected').appendTo('#mapedapprover');
});

$("#btnprint").click(function (e) {
    $('#div4').addClass('hide');
    $('#tbldetails').removeClass('hide');
    setTimeout(function () {
        window.print(); $('#div4').removeClass('hide');
        $('#tbldetails').addClass('hide');
    }, 800)

})
$("#btnExport").click(function (e) {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;

    //Export To Excel
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById('table_wrapper');
    var table_html = table_div.outerHTML.replace(/ /g, '%20');

    var a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = 'RFQDetails -' + postfix + '.xls';

    a.click();



});
var max = getUrlVarsURL(decryptedstring)["max"];
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));
}
var isboq = 'N';
function fetchReguestforQuotationDetails() {
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            $('#tbldetailsExcel > tbody').empty();
            if (RFQData[0].general[0].rfqBidType == 'Closed') {

                sessionStorage.setItem('ShowPrice', RFQData[0].general[0].openQuotes)
                if (RFQData[0].approvers[0].approverType == 'T') {
                    sessionStorage.setItem('ShowPrice', 'N')
                }
            }
            else {
                sessionStorage.setItem('ShowPrice', RFQData[0].general[0].showQuotedPrice)

            }


            jQuery('#RFQSubject').html(RFQData[0].general[0].rfqSubject)
            jQuery('#lbl_ConfiguredBy').html("RFQ Configured By: " + RFQData[0].general[0].rfqConfigureByName)

            $('#Currency').html(RFQData[0].general[0].currencyNm)
            jQuery('#RFQDescription').html(RFQData[0].general[0].rfqDescription)

            jQuery('#RFQDeadline').html(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate) + ' / ' + fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
            jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate)
            $('#TermCondition').html(RFQData[0].general[0].rfqTermandCondition)

            $('#tbldetails').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td id=tdVendorname></td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + fnConverToLocalTime(RFQData[0].general[0].rfqEndDate) + "</td></tr>")
            $('#tbldetailsExcel > tbody').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td id=tdVendorname>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + fnConverToLocalTime(RFQData[0].general[0].rfqEndDate) + "</td><td></td></tr>")

            jQuery('#refno').html(RFQData[0].general[0].rfqReference)
            if (RFQData[0].general[0].boqReq == true) {
                isboq = "Y";

            }
            else {
                isboq = "N";

            }
            RFQFetchQuotedPriceReport()

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
var verArray = [];
function RFQFetchQuotedPriceReport() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorattach = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchQuotedPriceReport/?VendorID=" + sessionStorage.getItem('hddnVendorId') + "&RFQId=" + sessionStorage.getItem('hddnRFQID') + "&RFQVersionId=" + sessionStorage.getItem('RFQVersionId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var totalamountsum = 0.0;
            var withoutGSTValue = 0.0;

            if (data[0].quotesDetails.length > 0) {
                var description = ""; var comments = "";
                jQuery("#tblServicesProduct").empty();
                jQuery("#tblServicesProductforexcel").empty();
                $('#divdomestic').show();
                $('#btnExport').show();

                $('#RFQVendorname').html(data[0].quotesDetails[0].vendorName);
                $('#tdVendorname').html(data[0].quotesDetails[0].vendorName);
                if (data[0].quotesDetails[0].vendorRemarks != '') {
                    $('#tblvendorremarks').removeClass('hide')
                    $('#vRemarks').text(data[0].quotesDetails[0].vendorRemarks.replace(/<br>/g, '\n'))
                }
                else {
                    $('#tblvendorremarks').addClass('hide')
                }

                if (isboq == "N") {
                    for (var i = 0; i < data[0].quotesDetails.length; i++) {

                        var taxHRTextinc = stringDivider("Unit Price (Without GST)", 18, "<br/>\n");
                        var taxHRTextEx = stringDivider("Unit Price (With GST)", 18, "<br/>\n");
                        var HRUnitRate = stringDivider("Amount (Inc. Taxes)", 18, "<br/>\n");

                        var totalamount = 0.0;
                        var bsicpercentageofGST = 0.0;
                        var _basicPrice = data[0].quotesDetails[i].rfqVendorPricewithoutGST;
                        comments = '';
                        //if (data[i].RFQBoq == 'Y ') { 
                        if (data[0].quotesDetails[i].rfqDescription != "") {
                            description = stringDivider(data[0].quotesDetails[i].rfqDescription, 45, "<br/>\n");
                        }
                        if (i == 0) {
                            jQuery('#tblServicesProduct').append('<thead><tr style="background: grey; color:light black;"><th style="width:40%!important;">Short Name</th><th>Quantity</th><th>UOM</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th><th>' + HRUnitRate + '</th><th>Description</th><th>Comments</th></tr></thead>');
                            jQuery('#tblServicesProductforexcel').append('<thead><tr style="background: grey; color:light black;"><th style="width:40%!important;">Short Name</th><th>Quantity</th><th>UOM</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th><th>' + HRUnitRate + '</th><th>Description</th><th>Comments</th></tr></thead>');
                        }
                        if (data[0].quotesDetails[i].rfqtcid == 0) {
                            if (data[0].quotesDetails[i].vendorItemRemarks != "") {
                                comments = stringDivider(data[0].quotesDetails[i].vendorItemRemarks, 45, "<br/>\n");
                            }
                            if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                                totalamount = data[0].quotesDetails[i].rfqVendorPricewithTax * data[0].quotesDetails[i].quantity;
                                if (_basicPrice > 0) {
                                    jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;"><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithoutGST).round(2)) + '</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithTax).round(2)) + '</b></td><td class=text-right><b>' + thousands_separators(totalamount.round(2)) + '</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithoutGST).round(2)) + '</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithTax).round(2)) + '</b></td><td class=text-right><b>' + thousands_separators(totalamount.round(2)) + '</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                }
                                else {
                                    jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;"><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                }
                                totalamountsum = totalamountsum + totalamount;
                                withoutGSTValue = data[0].quotesDetails[i].rfqVendorPricewithoutGST
                            }
                            else {
                                if (_basicPrice > 0) {

                                    jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;"><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                }
                                else {
                                    jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;"><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                }

                            }
                        }

                        for (var j = 0; j < data[0].quotesDetails.length; j++) {
                            if (data[0].quotesDetails[i].rfqDescription != "") {
                                description = stringDivider(data[0].quotesDetails[j].rfqDescription, 45, "<br/>\n");  // for word wrap
                            }

                            if (j == 0) {
                                if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                                    if (_basicPrice > 0) {
                                        jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>' + thousands_separators((data[0].quotesDetails[i].unitRate).round(2)) + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                        jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>' + thousands_separators((data[0].quotesDetails[i].unitRate).round(2)) + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                    }
                                    else {
                                        jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Not Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                        jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Not Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                    }
                                }
                                else {
                                    if (_basicPrice > 0) {
                                        jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                        jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                    }
                                    else {
                                        jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Not Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                        jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Not Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                    }
                                }
                            }

                            if (data[0].quotesDetails[j].rfqtcid != 0 && data[0].quotesDetails[i].rfqParameterId == data[0].quotesDetails[j].rfqParameterId) {
                                if (data[0].quotesDetails[j].termName == "GST") {
                                    bsicpercentageofGST = withoutGSTValue * (data[0].quotesDetails[j].termRate / 100)
                                }
                                else {
                                    if (data[0].quotesDetails[j].termName != "Discount") {
                                        bsicpercentageofGST = (data[0].quotesDetails[i].unitRate - _discountValue) * (data[0].quotesDetails[j].termRate / 100)
                                    }
                                    else {
                                        bsicpercentageofGST = data[0].quotesDetails[i].unitRate * (data[0].quotesDetails[j].termRate / 100);
                                        _discountValue = bsicpercentageofGST;
                                    }
                                }
                                if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                                    if (_basicPrice > 0) {
                                        jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + (data[0].quotesDetails[j].termRate) + '%</td><td class=text-right>' + thousands_separators(bsicpercentageofGST.round(2)) + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                        jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + data[0].quotesDetails[j].termRate + '%</td><td class=text-right>' + thousands_separators(bsicpercentageofGST.round(2)) + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                    }
                                    else {
                                        jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>Not Quoted</td><td class=text-right>Not Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                        jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>Not Quoted</td><td class=text-right>Not Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                    }
                                }
                                else {
                                    if (_basicPrice > 0) {
                                        jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>Quoted</td><td class=text-right>Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                        jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>Quoted</td><td class=text-right>Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                    }
                                    else {
                                        jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>Not Quoted</td><td class=text-right>Not Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                        jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>Not Quoted</td><td class=text-right>Not Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                    }
                                }
                            }
                        }
                    }
                    jQuery('#tblServicesProduct').append('<thead><tr style="background: #ccc; color:grey;white-space:nowrap!important;"><td colspan=4></td><td class=text-right><b>Total</b></td><td class=text-right><b>' + thousands_separators(totalamountsum.round(2)) + '</b></td><td>&nbsp;</td><td>&nbsp;</td></tr></thead>');
                    jQuery('#tblServicesProductforexcel').append('<thead><tr><td colspan=4></td><td class=text-right><b>Total</b></td><td class=text-right><b>' + thousands_separators(totalamountsum.round(2)) + '</b></td><td>&nbsp;</td><td>&nbsp;</td></tr></thead>');

                }
                else {
                    RFQFetchQuotedPriceReportBoq();
                }
            }

            else {
                jQuery('#tblServicesProduct').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblServicesProductforexcel').append('<tr><td>No Record Found</td></tr>');
            }


            if (data[0].commercialTerms.length > 0) {
                jQuery("#tblcommercialtermsprev").empty();
                jQuery("#tblcommercialterms").empty();

                jQuery("#tblcommercialterms").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:30%'>Other Commercial Terms</th><th style='width:30%'>Our Requirement</th><th>Your Offer</th></tr></thead>");
                jQuery("#tblcommercialtermsprev").append("<thead><tr><th style='width:30%'>Other Commercial Terms</th><th style='width:30%'>Our Requirement</th><th>Your Offer</th></tr></thead>");
                for (var i = 0; i < data[0].commercialTerms.length; i++) {
                    jQuery('<tr id=trid' + i + '><td>' + data[0].commercialTerms[i].termName + '</td><td>' + data[0].commercialTerms[i].requirement + '</td><td>' + data[0].commercialTerms[i].remarks + '</td></tr>').appendTo("#tblcommercialterms");
                    jQuery('<tr id=trid' + i + '><td>' + data[0].commercialTerms[i].termName + '</td><td>' + data[0].commercialTerms[i].requirement + '</td><td>' + data[0].commercialTerms[i].remarks + '</td></tr>').appendTo("#tblcommercialtermsprev");
                }
            }
            else {

                jQuery('#tblcommercialterms').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblcommercialtermsprev').append('<tr><td>No Record Found</td></tr>');
            }
            if (data[0].questions.length > 0) {
                jQuery("#tblquestions").empty();
                jQuery("#tblquestionsprev").empty();

                jQuery('#tblquestions').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Questions</th><th class='bold' style='width:30%!important'>Our Requirement</th><th style='width:40%!important'>Answer</th></tr></thead>");
                jQuery('#tblquestionsprev').append("<thead><tr><th class='bold' style='width:30%!important'>Questions</th><th class='bold' style='width:30%!important'>Our Requirement</th><th style='width:40%!important'>Answer</th></tr></thead>");
                for (var i = 0; i < data[0].questions.length; i++) {
                    var attachQA = data[0].questions[i].attachementQA;
                    //jQuery('<tr id=trid' + i + '><td style="width:30%">' + data[0].questions[i].question + '</td><td>' + data[0].questions[i].requirement + '</td><td>' + data[0].questions[i].answer + '</td></tr>').appendTo("#tblquestions");
                    jQuery('<tr id=trid' + i + '><td style="width:30%">' + data[0].questions[i].question + '</td><td>' + data[0].questions[i].requirement + '</td><td>' + data[0].questions[i].answer + '<br>  <a id=eRFQVFilesques' + i + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[0].questions[i].vendorID + ')>' + attachQA + '</a></td></tr>').appendTo("#tblquestions");
                    //strQ += '<td >' + data[0].questions[s].answer + '<br>  <a id=eRFQVFilesques' + s + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[0].questions[s].vendorID + ')>' + attachQA + '</a> </td>';
                    jQuery('<tr id=trid' + i + '><td style="width:20%">' + data[0].questions[i].question + '</td><td>' + data[0].questions[i].requirement + '</td><td>' + data[0].questions[i].answer + '</td></tr>').appendTo("#tblquestionsprev");
                }
            }
            else {

                jQuery('#tblquestions').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblquestionsprev').append('<tr><td>No Record Found</td></tr>');
            }
            var version = 0;
            if (data[0].attachments.length > 0) {
                jQuery("#tblAttachments").empty();
                jQuery("#tblAttachmentsprev").empty();

                jQuery('#tblAttachments').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Description</th><th class='bold'>Attachment</th></tr></thead>");
                jQuery('#tblAttachmentsprev').append("<thead><tr><th class='bold' style='width:30%!important'>Description</th><th class='bold'>Attachment</th></tr></thead>");
                for (var i = 0; i < data[0].attachments.length; i++) {

                    if (sessionStorage.getItem('RFQVersionId') == 99) {
                        version = max;
                    }
                    else {
                        version = sessionStorage.getItem('RFQVersionId');
                    }
                    if (data[0].attachments[i].rfqVersionId != null || data[0].attachments[i].rfqVersionId != '' || data[0].attachments[i].rfqVersionId != 'undefined') {
                        version = data[0].attachments[i].rfqVersionId

                    }
                    verArray[i] = version;
                    jQuery('<tr id=trid' + i + '><td>' + data[0].attachments[i].attachmentDescription + '</td><td><a id=attchvendor' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFileVendor(this)" href="javascript:;" >' + data[0].attachments[i].attachment + '</a></td></tr>').appendTo("#tblAttachments");
                    //jQuery('<tr id=trid' + i + '><td>' + data[0].attachments[i].attachmentDescription + '</td><td><a id=attchvendor' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFileVendor(this)" href="javascript:;" >' + data[0].attachments[i].attachment + '</a></td><tdstyle="display: none;">' + data[0].attachments[i].rfqVersionId + '</td></tr>').appendTo("#tblAttachments");
                    jQuery('<tr id=trid' + i + '><td>' + data[0].attachments[i].attachmentDescription + '</td><td>' + data[0].attachments[i].attachment + '</td></tr>').appendTo("#tblAttachmentsprev");
                }
            }
            else {

                jQuery('#tblAttachments').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblAttachmentsprev').append('<tr><td>No Record Found</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
function fncollapse(id) {
    $('#' + id.id).toggleClass("glyphicon-plus glyphicon-minus")
}
function RFQFetchQuotedPriceReportBoq() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorattach = '';

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchQuotedPriceReport/?VendorID=" + sessionStorage.getItem('hddnVendorId') + "&RFQId=" + sessionStorage.getItem('hddnRFQID') + "&RFQVersionId=" + sessionStorage.getItem('RFQVersionId'),
        // url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchRFQParameter_Boq/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + sessionStorage.getItem('RFQVersionId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        async: false,
        cache: false,
        dataType: "json",
        success: function (data) {
            var sheetcount = 0; counter = 0;
            var totalamountsum = 0.0;
            var withoutGSTValue = 0.0, itemcount = 0;;
            if (data[0].quotesDetails.length > 0) {
                var description = ""; var comments = "";
                jQuery("#tblServicesProduct").empty();
                jQuery("#tblServicesProductforexcel").empty();
                $('#divdomestic').show();
                $('#btnExport').show();

                $('#RFQVendorname').html(data[0].quotesDetails[0].vendorName);
                $('#tdVendorname').html(data[0].quotesDetails[0].vendorName);
                if (data[0].quotesDetails[0].vendorRemarks != '') {
                    $('#tblvendorremarks').removeClass('hide')
                    $('#vRemarks').text(data[0].quotesDetails[0].vendorRemarks.replace(/<br>/g, '\n'))
                }
                else {
                    $('#tblvendorremarks').addClass('hide')
                }


                var taxHRTextinc = stringDivider("Unit Price (Without GST)", 18, "<br/>\n");
                var taxHRTextEx = stringDivider("Unit Price (With GST)", 18, "<br/>\n");
                var HRUnitRate = stringDivider("Amount (Inc. Taxes)", 18, "<br/>\n");

                var totalamount = 0.0;
                var bsicpercentageofGST = 0.0;

                comments = '';
                var srno, sheet, parentid, pid;
                for (var r = 0; r < data[0].boqSummary.length; r++) {
                    itemcount = itemcount + data[0].boqSummary[r].itemCount;
                }

                jQuery('#tblServicesProduct').append('<thead><tr style="background: grey; color:light black;"><th style="width:5%!important;"></th><th style="width:40%!important;">Short Name</th><th>UOM</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th><th>Description</th><th>Comments</th></tr></thead>');
                jQuery('#tblServicesProductforexcel').append('<thead><tr style="background: grey; color:light black;"><th style="width:5%!important;"></th><th style="width:40%!important;">Short Name</th><th>UOM</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th><th>Description</th><th>Comments</th></tr></thead>');
                for (var r = 0; r < data[0].boqSummary.length; r++) {
                    for (var i = 0; i < data[0].quotesDetails.length; i++) {
                        if (data[0].boqSummary[r].boqsheetName == data[0].quotesDetails[i].boqsheetName) {

                            if (data[0].quotesDetails[i].srno == 1 && data[0].quotesDetails[i].rfqParameterParentID == "0" && data[0].quotesDetails[i].rfqtcid == "0") {
                                pid = data[0].quotesDetails[i].rfqParameterId;
                                sheet = data[0].quotesDetails[i].boqsheetName;
                                srno = data[0].quotesDetails[i].srno;
                                parentid = data[0].quotesDetails[i].rfqParameterParentID;

                                var _basicPrice = data[0].quotesDetails[i].rfqVendorPricewithoutGST;
                                if (data[0].quotesDetails[i].rfqDescription != "") {
                                    description = stringDivider(data[0].quotesDetails[i].rfqDescription, 45, "<br/>\n");
                                }

                                if (data[0].quotesDetails[i].vendorItemRemarks != "") {
                                    comments = stringDivider(data[0].quotesDetails[i].vendorItemRemarks, 45, "<br/>\n");
                                }
                                if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                                    totalamount = data[0].quotesDetails[i].rfqVendorPricewithTax * data[0].quotesDetails[i].quantity;
                                    if (_basicPrice > 0) {
                                        jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr name=' + sheet.split(' ').join('_') + ' style="background: #ccc; color:grey;"><td data-toggle=collapse data-target=#demoP' + i + data[0].quotesDetails[i].srno + ' class=accordion-toggle style="width:5%!important;"><button type=button class="btn btn-default btn-xs" onclick="fncollapse(MainItemP' + i + ')"><span class="glyphicon glyphicon-plus" id=MainItemP' + i + ' ></span></button></td><td class="hide rPID" id=rPIDP' + sheet + srno + '>' + pid + '</td><td id=shortSP' + pid + ' style="width:40%!important;"><b>' + data[0].quotesDetails[i].boqsheetName + '&nbsp(TC Given Below)</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithoutGST) + '</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithTax) + '</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                        jQuery('#tblServicesProductforexcel').append('<thead id=headidE' + i + '><tr name=' + sheet.split(' ').join('_') + '><td style="width:5%!important;" data-toggle=collapse data-target=#demoPE' + i + data[0].quotesDetails[i].srno + ' class=accordion-toggle style="width:5%!important;"><button type=button class="btn btn-default btn-xs" onclick="fncollapse(MainItemPE' + i + ')"><span class="glyphicon glyphicon-plus" id=MainItemPE' + i + ' ></span></button></td><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithoutGST) + '</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithTax) + '</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    }
                                    else {
                                        jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr name=' + sheet.split(' ').join('_') + ' style="background: #ccc; color:grey;"><td data-toggle=collapse data-target=#demoP' + i + data[0].quotesDetails[i].srno + ' class=accordion-toggle style="width:5%!important;"><button type=button class="btn btn-default btn-xs" onclick="fncollapse(MainItemP' + i + ')"><span class="glyphicon glyphicon-plus" id=MainItemP' + i + ' ></span></button></td><td class="hide rPID" id=rPIDP' + sheet + srno + '>' + pid + '</td><td style="width:40%!important;" id=shortSP' + pid + '><b>' + data[0].quotesDetails[i].boqsheetName + '&nbsp(TC Given Below)</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                        jQuery('#tblServicesProductforexcel').append('<thead id=headidE' + i + '><tr name=' + sheet.split(' ').join('_') + '><td style="width:5%!important;" data-toggle=collapse data-target=#demoPE' + i + data[0].quotesDetails[i].srno + ' class=accordion-toggle style="width:5%!important;"><button type=button class="btn btn-default btn-xs" onclick="fncollapse(MainItemPE' + i + ')"><span class="glyphicon glyphicon-plus" id=MainItemPE' + i + ' ></span></button></td><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    }
                                    totalamountsum = totalamountsum + totalamount;
                                    withoutGSTValue = data[0].quotesDetails[i].rfqVendorPricewithoutGST
                                }
                                else {
                                    if (_basicPrice > 0) {

                                        jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;" name=' + sheet.split(' ').join('_') + '><td data-toggle=collapse data-target=#demoP' + i + data[0].quotesDetails[i].srno + ' class=accordion-toggle style="width:5%!important;"><button type=button class="btn btn-default btn-xs" onclick="fncollapse(MainItemP' + i + ')"><span class="glyphicon glyphicon-plus" id=MainItemP' + i + ' ></span></button></td><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].boqsheetName + '&nbsp(TC Given Below)</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                        jQuery('#tblServicesProductforexcel').append('<thead id=headidE' + i + '><tr name=' + sheet.split(' ').join('_') + '><td style="width:5%!important;" data-toggle=collapse data-target=#demoPE' + i + data[0].quotesDetails[i].srno + ' class=accordion-toggle style="width:5%!important;"><button type=button class="btn btn-default btn-xs" onclick="fncollapse(MainItemPE' + i + ')"><span class="glyphicon glyphicon-plus" id=MainItemPE' + i + ' ></span></button></td><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    }
                                    else {
                                        jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;" name=' + sheet.split(' ').join('_') + '><td data-toggle=collapse data-target=#demoP' + i + data[0].quotesDetails[i].srno + ' class=accordion-toggle style="width:5%!important;"><button type=button class="btn btn-default btn-xs" onclick="fncollapse(MainItemP' + i + ')"><span class="glyphicon glyphicon-plus" id=MainItemP' + i + ' ></span></button></td><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].boqsheetName + '&nbsp(TC Given Below)</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                        jQuery('#tblServicesProductforexcel').append('<thead id=headidE' + i + ' ><tr name=' + sheet.split(' ').join('_') + '><td style="width:5%!important;" data-toggle=collapse data-target=#demoPE' + i + data[0].quotesDetails[i].srno + ' class=accordion-toggle style="width:5%!important;"><button type=button class="btn btn-default btn-xs" onclick="fncollapse(MainItemPE' + i + ')"><span class="glyphicon glyphicon-plus" id=MainItemPE' + i + ' ></span></button></td><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Not Quoted</b></td><td class=text-right><b>Not Quoted</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    }

                                }

                                for (var j = 0; j < data[0].quotesDetails.length; j++) {
                                    if (j == 0) {
                                        if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                                            if (_basicPrice > 0) {
                                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>Basic Price</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>' + (data[0].quotesDetails[i].unitRate) + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>Basic Price</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>' + (data[0].quotesDetails[i].unitRate) + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                            }
                                            else {
                                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>Basic Price</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Not Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>Basic Price</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Not Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                            }
                                        }
                                        else {
                                            if (_basicPrice > 0) {
                                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>Basic Price</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>Basic Price</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                            }
                                            else {
                                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>Basic Price</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Not Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>Basic Price</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Not Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                            }
                                        }
                                    }

                                    if (data[0].quotesDetails[j].rfqtcid != 0 && data[0].quotesDetails[i].rfqParameterId == data[0].quotesDetails[j].rfqParameterId) {
                                        if (data[0].quotesDetails[j].termName == "GST") {
                                            bsicpercentageofGST = withoutGSTValue * (data[0].quotesDetails[j].termRate / 100)
                                        }
                                        else {
                                            if (data[0].quotesDetails[j].termName != "Discount") {
                                                bsicpercentageofGST = (data[0].quotesDetails[i].unitRate - _discountValue) * (data[0].quotesDetails[j].termRate / 100)
                                            }
                                            else {
                                                bsicpercentageofGST = data[0].quotesDetails[i].unitRate * (data[0].quotesDetails[j].termRate / 100);
                                                _discountValue = bsicpercentageofGST;
                                            }
                                        }
                                        if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                                            if (_basicPrice > 0) {
                                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>' + data[0].quotesDetails[j].termName + '</td><td>' + '' + '</td><td  class=text-right>' + (data[0].quotesDetails[j].termRate) + '%</td><td class=text-right>' + bsicpercentageofGST.round(3) + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>' + data[0].quotesDetails[j].termName + '</td><td>' + '' + '</td><td  class=text-right>' + data[0].quotesDetails[j].termRate + '%</td><td class=text-right>' + bsicpercentageofGST.round(3) + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                            }
                                            else {
                                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>' + data[0].quotesDetails[j].termName + '</td><td>' + '' + '</td><td  class=text-right>Not Quoted</td><td class=text-right>Not Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>' + data[0].quotesDetails[j].termName + '</td><td>' + '' + '</td><td  class=text-right>Not Quoted</td><td class=text-right>Not Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                            }
                                        }
                                        else {
                                            if (_basicPrice > 0) {
                                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>' + data[0].quotesDetails[j].termName + '</td><td>' + '' + '</td><td  class=text-right>Quoted</td><td class=text-right>Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>' + data[0].quotesDetails[j].termName + '</td><td>' + '' + '</td><td  class=text-right>Quoted</td><td class=text-right>Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                            }
                                            else {
                                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>' + data[0].quotesDetails[j].termName + '</td><td>' + '' + '</td><td  class=text-right>Not Quoted</td><td class=text-right>Not Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td></td><td>' + data[0].quotesDetails[j].termName + '</td><td>' + '' + '</td><td  class=text-right>Not Quoted</td><td class=text-right>Not Quoted</td><td>' + '' + '</td><td>' + '' + '</td></tr>');
                                            }
                                        }
                                    }

                                }

                                sheetcount = sheetcount + data[0].boqSummary[r].itemCount;
                                for (var j = counter; j < data[0].quotesDetails.length; j++) {
                                    counter = data[0].boqSummary[r].itemCount - 1;

                                    if (data[0].quotesDetails[i].uom == "" && data[0].quotesDetails[i].boqsheetName == data[0].quotesDetails[j].boqsheetName && data[0].quotesDetails[j].rfqParameterParentID == "0" && data[0].quotesDetails[j].rfqtcid == "0") {//&& data[0].quotesDetails[i].quantity == 0

                                        $("#headidE" + i).append("<tr><td colspan=20 class=hiddenRow><div class='accordian-body collapse' id='demoPE" + i + srno + "' style='padding-left:105px!important'></div></tr>");
                                        $("#headid" + i).append("<tr><td colspan=20 class=hiddenRow><div class='accordian-body collapse' id='demoP" + i + srno + "' style='padding-left:105px!important'></div></tr>");

                                        pid = data[0].quotesDetails[j].rfqParameterId;
                                        sheet = data[0].quotesDetails[j].boqsheetName;
                                        srno = data[0].quotesDetails[j].srno;
                                        parentid = data[0].quotesDetails[j].rfqParameterParentID;

                                        $("#demoPE" + i + data[0].quotesDetails[i].srno).append("<table id=TblMHPE" + srno + sheet.split(' ').join('_') + " class='table table-condensed table table-striped table-bordered table-hover' cellpadding=0 cellspacing=0></table>");
                                        $("#demoP" + i + data[0].quotesDetails[i].srno).append("<table id=TblMHP" + srno + sheet.split(' ').join('_') + " class='table table-condensed table table-striped table-bordered table-hover' cellpadding=0 cellspacing=0></table>");

                                        $('#TblMHPE' + srno + sheet.split(' ').join('_')).append("<tbody><tr name=" + sheet.split(' ').join('_') + "><td style='width:10%!important' data-toggle=collapse class='accordion-toggle' data-target='#demo1E" + j + srno + "' ><button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem1E" + srno + j + ")'><span class='glyphicon glyphicon-plus' id='mainItem1E" + srno + j + "'></span></button>&nbsp; " + srno + "</td><td id=shortE" + pid + " style='width:42%!important'>" + data[0].quotesDetails[j].rfqShortName + "</td><td><label class=" + sheet.split(' ').join('_') + " name=" + parentid + " id=lblPTot" + pid + "><b>" + thousands_separators(data[0].quotesDetails[j].itemPrice) + "</b></label></td><td class='hide rPID' id=rPIDE" + srno + ">" + pid + "</td></tr></tbody>");
                                        $('#TblMHP' + srno + sheet.split(' ').join('_')).append("<tbody><tr name=" + sheet.split(' ').join('_') + "><td style='width:10%!important' data-toggle=collapse class='accordion-toggle' data-target='#demo1P" + j + srno + "' ><button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem1P" + srno + j + ")'><span class='glyphicon glyphicon-plus' id='mainItem1P" + srno + j + "'></span></button>&nbsp; " + srno + "</td><td id=shortP" + pid + " style='width:42%!important'>" + data[0].quotesDetails[j].rfqShortName + "</td><td><label class=" + sheet.split(' ').join('_') + " name=" + parentid + " id=lblPTotP" + pid + "><b>" + thousands_separators(data[0].quotesDetails[j].itemPrice) + "</b></label></td><td class='hide rPID' id=rPIDP" + srno + ">" + pid + "</td></tr></tbody>");


                                        for (var k = j; k < data[0].quotesDetails.length; k++) {
                                            if (data[0].quotesDetails[k].rfqtcid == "0" && data[0].quotesDetails[j].rfqParameterParentID == "0" && data[0].quotesDetails[k].rfqParameterParentID == "0" && data[0].quotesDetails[i].uom == "" && data[0].quotesDetails[k].boqsheetName == data[0].quotesDetails[j].boqsheetName) {//&& data[0].quotesDetails[i].quantity == 0

                                                $('#TblMHP' + srno + sheet.split(' ').join('_')).append("<tr><td colspan=19 class=hiddenRow><div class='accordian-body collapse' id='demo1P" + j + srno + "' style='padding-left:50px!important'><table id='TblMHP" + srno + k + "' class='table table-condensed table table-striped table-bordered table-hover' cellpadding=0 cellspacing=0></tr>");
                                                $('#TblMHP' + srno + k).append("<thead><tr><th style='width:5%!important'>Srno</th><th style='width:20%!important'>Item Name</th><th style='width:5%!important'>Quantity</th><th style='width:10%!important'>UOM</th><th style='width:20%!important'>Price</th><th style='width:20%!important'>Comments</th></tr></thead>")

                                                $('#TblMHPE' + srno + sheet.split(' ').join('_')).append("<tr><td colspan=19 class=hiddenRow><div class='accordian-body collapse' id='demo1PE" + j + srno + "' style='padding-left:50px!important'><table id='TblMHPE" + srno + k + "' class='table table-condensed table table-striped table-bordered table-hover' cellpadding=0 cellspacing=0></tr>");
                                                $('#TblMHPE' + srno + k).append("<thead><tr><th style='width:5%!important'>Srno</th><th style='width:20%!important'>Item Name</th><th style='width:5%!important'>Quantity</th><th style='width:10%!important'>UOM</th><th style='width:20%!important'>Price</th><th style='width:20%!important'>Comments</th></tr></thead>")

                                                for (var l = k; l < data[0].quotesDetails.length; l++) {
                                                    if (data[0].quotesDetails[l].rfqtcid == "0" && data[0].quotesDetails[l].rfqParameterParentID == "0" && data[0].quotesDetails[l].uom == "" && data[0].quotesDetails[k].rfqParameterId == data[0].quotesDetails[l].rfqParameterParentID && data[0].quotesDetails[l].boqsheetName == data[0].quotesDetails[k].boqsheetName) {//&& data[0].quotesDetails[l].quantity == 0


                                                        $('#TblMHP' + srno + k).append("<tr name=" + data[0].quotesDetails[l].boqsheetName.split(' ').join('_') + "><td data-toggle='collapse' class='accordion-toggle'  data-target='#demo12P" + l + "' style='width:5%!important' ><button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem12P" + l + ")' ><span class='glyphicon glyphicon-plus' id='mainItem12P" + l + "'></span></button>&nbsp;" + data[0].quotesDetails[l].srno + "</td><td class='hide rPID' id=rPIDP" + data[0].quotesDetails[l].srno + ">" + data[0].quotesDetails[l].rfqParameterId + "</td><td id=shortP" + data[0].quotesDetails[l].rfqParameterId + " style='width:42%!important'>" + data[0].quotesDetails[l].rfqShortName + "</td><td><b><label  name=" + data[0].quotesDetails[l].rfqParameterParentID + "  id=lblPTotP" + data[0].quotesDetails[l].rfqParameterId + ">" + thousands_separators(data[0].quotesDetails[l].itemPrice) + "</label><b></td></tr>");
                                                        $('#TblMHP' + srno + k).append("<tr><td colspan=20 class=hiddenRow><div class='accordian-body collapse' id='demo12P" + l + "' style='padding-left:54px!important'></div></tr>");
                                                        $("#demo12P" + l).append("<table id=TblMH1P" + l + " class='table table-condensed table table-striped table-bordered table-hover' cellpadding=0 cellspacing=0></table>");
                                                        $('#TblMH1P' + l).append("<thead><tr><th style='width:5%!important'>SrNo</th><th style='width:20%!important'>Item Name</th><th style='width:5%!important'>Quantity</th><th style='width:10%!important'>UOM</th><th style='width:20%!important'>Price</th><th style='width:20%!important'>Comments</th></tr></thead>")

                                                        $('#TblMHPE' + srno + k).append("<tr name=" + data[0].quotesDetails[l].boqsheetName.split(' ').join('_') + "><td data-toggle='collapse' class='accordion-toggle'  data-target='#demo12PE" + l + "' style='width:5%!important' ><button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem12PE" + l + ")' ><span class='glyphicon glyphicon-plus' id='mainItem12PE" + l + "'></span></button>&nbsp;" + data[0].quotesDetails[l].srno + "</td><td class='hide rPID' id=rPIDPE" + data[0].quotesDetails[l].srno + ">" + data[0].quotesDetails[l].rfqParameterId + "</td><td id=shortPE" + data[0].quotesDetails[l].rfqParameterId + " style='width:42%!important'>" + data[0].quotesDetails[l].rfqShortName + "</td><td><b><label  name=" + data[0].quotesDetails[l].rfqParameterParentID + "  id=lblPTotPE" + data[0].quotesDetails[l].rfqParameterId + ">" + thousands_separators(data[0].quotesDetails[l].itemPrice) + "</label><b></td></tr>");
                                                        $('#TblMHPE' + srno + k).append("<tr><td colspan=20 class=hiddenRow><div class='accordian-body collapse' id='demo12PE" + l + "' style='padding-left:54px!important'></div></tr>");
                                                        $("#demo12PE" + l).append("<table id=TblMH1PE" + l + " class='table table-condensed table table-striped table-bordered table-hover' cellpadding=0 cellspacing=0></table>");
                                                        $('#TblMH1PE' + l).append("<thead><tr><th style='width:5%!important'>SrNo</th><th style='width:20%!important'>Item Name</th><th style='width:5%!important'>Quantity</th><th style='width:10%!important'>UOM</th><th style='width:20%!important'>Price</th><th style='width:20%!important'>Comments</th></tr></thead>")

                                                        pid = data[0].quotesDetails[l].rfqParameterId;
                                                        sheet = data[0].quotesDetails[l].boqsheetName;
                                                        srno = data[0].quotesDetails[l].srno;
                                                        parentid = data[0].quotesDetails[l].rfqParameterParentID

                                                        for (var m = l; m < data[0].quotesDetails.length; m++) {
                                                            if (data[0].quotesDetails[j].rfqtcid == "0" && data[0].quotesDetails[m].uom == "" && data[0].quotesDetails[l].rfqParameterId == data[0].quotesDetails[m].rfqParameterParentID && data[0].quotesDetails[l].boqsheetName == data[0].quotesDetails[m].boqsheetName) { //&& data[0].quotesDetails[m].quantity == 0
                                                                $('#TblMHPE' + l).append("<tr name=" + sheet.split(' ').join('_') + "><td data-toggle='collapse' class='accordion-toggle'  data-target='#demo123E" + m + "' style='width:5%!important' > <button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem12E" + l + ")' ><span class='glyphicon glyphicon-plus' id='mainItem12E" + l + "'></span></button>&nbsp;" + srno + "</td><td class='rPID hide' id=rPIDE" + srno + ">" + pid + "</td><td id=shortE" + data[0].quotesDetails[l].rfqParameterId + " style='width:42%!important'>" + data[0].quotesDetails[l].rfqShortName + "</td><td colspan=17><label class=thousandseparated  name=" + data[0].quotesDetails[l].rfqParameterParentID + "  id=lblPTot" + data[0].quotesDetails[l].rfqParameterId + "><b>" + thousands_separators(data[0].quotesDetails[l].itemPrice) + "</b></label></td></tr>");
                                                                $('#TblMHP' + l).append("<tr name=" + sheet.split(' ').join('_') + "><td data-toggle='collapse' class='accordion-toggle'  data-target='#demo123P" + m + "' style='width:5%!important' > <button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem12P" + l + ")' ><span class='glyphicon glyphicon-plus' id='mainItem12P" + l + "'></span></button>&nbsp;" + srno + "</td><td class='rPID hide' id=rPIDP" + srno + ">" + pid + "</td><td id=shortP" + data[0].quotesDetails[l].rfqParameterId + " style='width:42%!important'>" + data[0].quotesDetails[l].rfqShortName + "</td><td colspan=17><label class=thousandseparated  name=" + data[0].quotesDetails[l].rfqParameterParentID + "  id=lblPTotP" + data[0].quotesDetails[l].rfqParameterId + "><b>" + thousands_separators(data[0].quotesDetails[l].itemPrice) + "</b></label></td></tr>");
                                                            }
                                                            else if (data[0].quotesDetails[l].rfqParameterId == data[0].quotesDetails[m].rfqParameterParentID) {
                                                                $('#TblMH1PE' + l).append('<tr name=' + sheet.split(' ').join('_') + '><td class="hide rPID" id=rPIDP' + data[0].quotesDetails[m].srno + '>' + data[0].quotesDetails[m].rfqParameterId + '</td><td>' + data[0].quotesDetails[m].srno + '</td><td id=shortP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].rfqShortName + '</td><td id=quanP' + data[0].quotesDetails[m].rfqParameterId + '>' + thousands_separators(data[0].quotesDetails[m].quantity) + '</td><td id=uomP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].uom + '</td><td class="form-control thousandseparated text-right">' + thousands_separators(data[0].quotesDetails[m].itemPrice) + '</td><td id=commP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].vendorItemRemarks + '</td></tr>');
                                                                $('#TblMH1P' + l).append('<tr name=' + sheet.split(' ').join('_') + '><td class="hide rPID" id=rPIDP' + data[0].quotesDetails[m].srno + '>' + data[0].quotesDetails[m].rfqParameterId + '</td><td>' + data[0].quotesDetails[m].srno + '</td><td id=shortP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].rfqShortName + '</td><td id=quanP' + data[0].quotesDetails[m].rfqParameterId + '>' + thousands_separators(data[0].quotesDetails[m].quantity) + '</td><td id=uomP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].uom + '</td><td class="form-control thousandseparated text-right">' + thousands_separators(data[0].quotesDetails[m].itemPrice) + '</td><td id=commP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].vendorItemRemarks + '</td></tr>');
                                                            }
                                                        }
                                                    }
                                                    else if (data[0].quotesDetails[k].rfqParameterId == data[0].quotesDetails[l].rfqParameterParentID && data[0].quotesDetails[l].uom != "" && data[0].quotesDetails[l].rfqtcid == "0") {//&& data[0].quotesDetails[l].quantity != 0
                                                        pid = data[0].quotesDetails[l].rfqParameterId;
                                                        sheet = data[0].quotesDetails[l].boqsheetName;
                                                        srno = data[0].quotesDetails[l].srno;
                                                        parentid = data[0].quotesDetails[l].rfqParameterParentID

                                                        $('#TblMHP' + data[0].quotesDetails[j].srno + k).append('<tr name=' + sheet.split(' ').join('_') + '><td class="hide rPID" id=rPIDP' + srno + '>' + pid + '</td><td>' + srno + '</td><td id=shortP' + pid + '>' + data[0].quotesDetails[l].rfqShortName + '</td><td id=quanP' + pid + '>' + thousands_separators(data[0].quotesDetails[l].quantity) + '</td><td id=uomP' + pid + '>' + data[0].quotesDetails[l].uom + '</td><td class="text-right" >' + thousands_separators(data[0].quotesDetails[l].itemPrice) + '</td><td id=commP' + pid + ' >' + data[0].quotesDetails[l].vendorItemRemarks + '</td></tr>');
                                                        $('#TblMHPE' + data[0].quotesDetails[j].srno + k).append('<tr name=' + sheet.split(' ').join('_') + '><td class="hide rPID" id=rPIDPE' + srno + '>' + pid + '</td><td>' + srno + '</td><td id=shortPE' + pid + '>' + data[0].quotesDetails[l].rfqShortName + '</td><td id=quanPE' + pid + '>' + thousands_separators(data[0].quotesDetails[l].quantity) + '</td><td id=uomPE' + pid + '>' + data[0].quotesDetails[l].uom + '</td><td class="text-right" >' + thousands_separators(data[0].quotesDetails[l].itemPrice) + '</td><td id=commPE' + pid + ' >' + data[0].quotesDetails[l].vendorItemRemarks + '</td></tr>');
                                                    }
                                                    else if (data[0].quotesDetails[k].rfqParameterId == data[0].quotesDetails[l].rfqParameterParentID && data[0].quotesDetails[l].rfqParameterParentID != 0 && data[0].quotesDetails[l].rfqtcid == "0") {
                                                        pid = data[0].quotesDetails[l].rfqParameterId;
                                                        sheet = data[0].quotesDetails[l].boqsheetName;
                                                        srno = data[0].quotesDetails[l].srno;
                                                        parentid = data[0].quotesDetails[l].rfqParameterParentID


                                                        $('#TblMHP' + data[0].quotesDetails[j].srno + k).append("<tr name=" + sheet.split(' ').join('_') + "><td data-toggle='collapse' class='accordion-toggle'  data-target='#demo12P" + l + data[0].quotesDetails[j].srno + "' style='width:5%!important' ><button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem122P" + l + ")' ><span class='glyphicon glyphicon-plus' id='mainItem122P" + l + "'></span></button>&nbsp;" + srno + "</td><td class='hide rPID' id=rPIDP" + srno + ">" + pid + "</td><td colspan='3' id=shortP" + pid + ">" + data[0].quotesDetails[l].rfqShortName + "</td><td colspan=7><b><label class=thousandseparated name=" + data[0].quotesDetails[l].rfqParameterParentID + "  id=lblPTotP" + data[0].quotesDetails[l].rfqParameterId + "><b>" + thousands_separators(data[0].quotesDetails[l].itemPrice) + "</b></label></td></tr>");
                                                        $('#TblMHP' + data[0].quotesDetails[j].srno + k).append("<tr><td colspan=20 class=hiddenRow><div class='accordian-body collapse' id='demo12P" + l + data[0].quotesDetails[j].srno + "' style='padding-left:80px!important'></div></tr>");

                                                        $('#TblMHPE' + data[0].quotesDetails[j].srno + k).append("<tr name=" + sheet.split(' ').join('_') + "><td data-toggle='collapse' class='accordion-toggle'  data-target='#demo12PE" + l + data[0].quotesDetails[j].srno + "' style='width:5%!important' ><button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem122PE" + l + ")' ><span class='glyphicon glyphicon-plus' id='mainItem122PE" + l + "'></span></button>&nbsp;" + srno + "</td><td class='hide rPID' id=rPIDPE" + srno + ">" + pid + "</td><td colspan='3' id=shortPE" + pid + ">" + data[0].quotesDetails[l].rfqShortName + "</td><td colspan=7><b><label class=thousandseparated name=" + data[0].quotesDetails[l].rfqParameterParentID + "  id=lblPTotPE" + data[0].quotesDetails[l].rfqParameterId + "><b>" + thousands_separators(data[0].quotesDetails[l].itemPrice) + "</b></label></td></tr>");
                                                        $('#TblMHPE' + data[0].quotesDetails[j].srno + k).append("<tr><td colspan=20 class=hiddenRow><div class='accordian-body collapse' id='demo12PE" + l + data[0].quotesDetails[j].srno + "' style='padding-left:80px!important'></div></tr>");

                                                        $("#demo12P" + l + data[0].quotesDetails[j].srno).append("<table id=TblMH1P" + l + data[0].quotesDetails[j].srno + " class='table table-condensed table table-striped table-bordered table-hover' cellpadding=0 cellspacing=0></table>");
                                                        $('#TblMH1P' + l + data[0].quotesDetails[j].srno).append("<thead><tr><th style='width:5%!important'>SrNo</th><th style='width:15%!important'>Item Name</th><th style='width:5%!important'>Quantity</th><th style='width:10%!important'>UOM</th><th style='width:20%!important'>Price</th><th style='width:20%!important'>Comments</th></tr></thead>")


                                                        $("#demo12PE" + l + data[0].quotesDetails[j].srno).append("<table id=TblMH1PE" + l + data[0].quotesDetails[j].srno + " class='table table-condensed table table-striped table-bordered table-hover' cellpadding=0 cellspacing=0></table>");
                                                        $('#TblMH1PE' + l + data[0].quotesDetails[j].srno).append("<thead><tr><th style='width:5%!important'>SrNo</th><th style='width:15%!important'>Item Name</th><th style='width:5%!important'>Quantity</th><th style='width:10%!important'>UOM</th><th style='width:20%!important'>Price</th><th style='width:20%!important'>Comments</th></tr></thead>")
                                                        for (var m = l; m < data[0].quotesDetails.length; m++) {

                                                            if (data[0].quotesDetails[m].rfqtcid == "0" && data[0].quotesDetails[m].quantity == 0 && data[0].quotesDetails[l].rfqParameterId == data[0].quotesDetails[m].rfqParameterParentID && data[0].quotesDetails[l].boqsheetName == data[0].quotesDetails[m].boqsheetName) { //&& data[0].quotesDetails[m].quantity == ""
                                                                $('#TblMHPE' + l).append("<tr name=" + sheet.split(' ').join('_') + "><td data-toggle='collapse' class='accordion-toggle'  data-target='#demo123P" + m + "' style='width:5%!important' > <button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem122PE" + l + ")' ><span class='glyphicon glyphicon-plus' id='mainItem122PE" + l + "'></span></button>&nbsp" + srno + "</td><td class='hide rPID' id=rPIDP" + srno + ">" + pid + "</td><td colspan='3' id=shortP" + pid + ">" + data[0].quotesDetails[l].rfqShortName + "</td><td colspan=17><label class=thousandseparated name=" + parentid + " id=lblPTotP" + pid + "><b>" + thousands_separators(data[0].quotesDetails[l].itemPrice) + "</b></label></td></tr>");
                                                                $('#TblMHP' + l).append("<tr name=" + sheet.split(' ').join('_') + "><td data-toggle='collapse' class='accordion-toggle'  data-target='#demo123P" + m + "' style='width:5%!important' > <button type='button' class='btn btn-default btn-xs' onclick='fncollapse(mainItem122P" + l + ")' ><span class='glyphicon glyphicon-plus' id='mainItem122P" + l + "'></span></button>&nbsp" + srno + "</td><td class='hide rPID' id=rPIDP" + srno + ">" + pid + "</td><td colspan='3' id=shortP" + pid + ">" + data[0].quotesDetails[l].rfqShortName + "</td><td colspan=17><label class=thousandseparated name=" + parentid + " id=lblPTotP" + pid + "><b>" + thousands_separators(data[0].quotesDetails[l].itemPrice) + "</b></label></td></tr>");
                                                            }
                                                            else if (data[0].quotesDetails[l].rfqParameterId == data[0].quotesDetails[m].rfqParameterParentID) {
                                                                $('#TblMH1PE' + l + data[0].quotesDetails[j].srno).append('<tr name=' + data[0].quotesDetails[m].boqsheetName.split(' ').join('_') + '><td class="hide rPID" id=rPIDE' + data[0].quotesDetails[m].srno + '>' + data[0].quotesDetails[m].rfqParameterId + '</td><td>' + data[0].quotesDetails[m].srno + '</td><td id=shortPE' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].rfqShortName + '</td><td id=quanPE' + data[0].quotesDetails[m].rfqParameterId + '>' + thousands_separators(data[0].quotesDetails[m].quantity) + '</td><td id=uomPE' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].uom + '</td><td class="text-right"  >' + thousands_separators(data[0].quotesDetails[m].itemPrice) + '</td><td id=commPE' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].vendorItemRemarks + '</td></tr>');
                                                                $('#TblMH1P' + l + data[0].quotesDetails[j].srno).append('<tr name=' + data[0].quotesDetails[m].boqsheetName.split(' ').join('_') + '><td class="hide rPID" id=rPID' + data[0].quotesDetails[m].srno + '>' + data[0].quotesDetails[m].rfqParameterId + '</td><td>' + data[0].quotesDetails[m].srno + '</td><td id=shortP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].rfqShortName + '</td><td id=quanP' + data[0].quotesDetails[m].rfqParameterId + '>' + thousands_separators(data[0].quotesDetails[m].quantity) + '</td><td id=uomP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].uom + '</td><td class="text-right"  >' + thousands_separators(data[0].quotesDetails[m].itemPrice) + '</td><td id=commP' + data[0].quotesDetails[m].rfqParameterId + '>' + data[0].quotesDetails[m].vendorItemRemarks + '</td></tr>');
                                                            }
                                                        }
                                                    }

                                                }

                                            }
                                        }
                                    }

                                }

                            }
                        }
                    }

                }
            }
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;
        }
    });

}
function DownloadFileVendor(aID, versionId) {

    var arrelement = aID.id.replace('attchvendor', '')
    arrelement = parseInt(arrelement);
    if (sessionStorage.getItem('RFQVersionId') == 99) {
        version = max;
    }
    else {
        version = sessionStorage.getItem('RFQVersionId');
    }
    //version = verArray.at(arrelement);
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + sessionStorage.getItem('hddnVendorId') + '/' + version);
}
function GetQuestions() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('hddnVendorId') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('hddnVendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            jQuery("#tblRFQtechqueryPrev").empty();
            jQuery("#tblRFQtechquery").empty();

            if (data.length > 0) {

                $('#h3techquery').removeClass('hide')
                $('#tblRFQtechquery').removeClass('hide')
                jQuery('#tblRFQtechqueryPrev').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:40%!important'>Questions</th><th style='width:40%!important'>Answer</th><th style='width:10%!important'>Created By</th><th style='width:10%!important'>Attachment</th></tr></thead>");
                jQuery('#tblRFQtechquery').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:40%!important'>Questions</th><th style='width:40%!important'>Answer</th><th style='width:10%!important'>Created By</th><th style='width:20%!important'>Attachment</th></tr></thead>");

                for (var i = 0; i < data.length; i++) {

                    str = '<tr id=trquesid' + (i + 1) + '><td class=hide id=ques' + i + '>' + data[i].id + '</td><td>' + data[i].question + '</td>';
                    str += '<td>' + data[i].answer + ' </td>';
                    str += '<td>' + data[i].createdBy + ' </td>';
                    str += "<td></td>";
                    jQuery('#tblRFQtechqueryPrev').append(str);
                    jQuery('#tblRFQtechquery').append(str);

                }
            }
            else {

                $('#h3techquery').addClass('hide')
                $('#tblRFQtechquery').addClass('hide')
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;

        }
    })
}
function stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
        var p = width
        //for (; p > 0 && str[p] != ' '; p--) {
        //}
        if (p > 0) {
            var left = str.substring(0, p);
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}

var tableToExcel = (function () {

    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name, filename) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        document.getElementById("dlink").href = uri + base64(format(template, ctx));
        document.getElementById("dlink").download = filename;
        document.getElementById("dlink").click();
    }
})()

setTimeout(function () { sessionStorage.removeItem('selectedboqtxtboxid') }, 5000);
