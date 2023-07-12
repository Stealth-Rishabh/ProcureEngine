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
        success: function (Data) {

            let RFQData = Data.rData



            $('#tbldetailsExcel > tbody').empty();




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

                        var taxHRTextinc = stringDivider("Unit Price (Without GST)", 35, "<br/>\n");
                        var taxHRTextEx = stringDivider("Unit Price (With GST)", 35, "<br/>\n");
                        var HRUnitRate = stringDivider("Amount (Inc. Taxes)", 35, "<br/>\n");

                        var totalamount = 0.0;
                        var bsicpercentageofGST = 0.0;
                        var _basicPrice = data[0].quotesDetails[i].rfqVendorPricewithoutGST;
                        comments = '';
                        //if (data[i].RFQBoq == 'Y ') { 
                        if (data[0].quotesDetails[i].rfqDescription != "") {
                            description = stringDivider(data[0].quotesDetails[i].rfqDescription, 45, "<br/>\n");
                        }
                        if (i == 0) {
                            jQuery('#tblServicesProduct').append('<thead><tr style="background: grey; color:light black;"><th style="width:40%!important;">Item Name</th><th>Quantity</th><th>UOM</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th><th>' + HRUnitRate + '</th><th>Description</th><th>Comments</th></tr></thead>');
                            jQuery('#tblServicesProductforexcel').append('<thead><tr style="background: grey; color:light black;"><th style="width:40%!important;">Short Name</th><th>Quantity</th><th>UOM</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th><th>' + HRUnitRate + '</th><th>Description</th><th>Comments</th></tr></thead>');
                        }
                        if (data[0].quotesDetails[i].rfqtcid == 0) {
                            if (data[0].quotesDetails[i].vendorItemRemarks != "") {
                                comments = stringDivider(data[0].quotesDetails[i].vendorItemRemarks, 45, "<br/>\n");
                            }
                            if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                                totalamount = data[0].quotesDetails[i].rfqVendorPricewithTax * data[0].quotesDetails[i].quantity;
                                if (_basicPrice > 0) {
                                    jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;"><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>' + _basicPrice + '</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithTax).round(2)) + '</b></td><td class=text-right><b>' + thousands_separators(totalamount.round(2)) + '</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
                                    jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>' + _basicPrice + '</b></td><td class=text-right><b>' + thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithTax).round(2)) + '</b></td><td class=text-right><b>' + thousands_separators(totalamount.round(2)) + '</b></td><td><b>' + description + '</b></td><td><b>' + comments + '</b></td></tr></thead>');
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
                    if (sessionStorage.getItem('RFQBIDType') == 'Open') {
                        jQuery('<tr id=trid' + i + '><td style="width:30%">' + data[0].questions[i].question + '</td><td>' + data[0].questions[i].requirement + '</td><td>' + data[0].questions[i].answer + '<br>  <a id=eRFQVFilesques' + i + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[0].questions[i].vendorID + ')>' + attachQA + '</a></td></tr>').appendTo("#tblquestions");

                    }
                    else {
                        if (sessionStorage.getItem('ShowPrice') == 'N') {

                            jQuery('<tr id=trid' + i + '><td style="width:30%">' + data[0].questions[i].question + '</td><td>' + data[0].questions[i].requirement + '</td><td>' + data[0].questions[i].answer + '<br>  <a id=eRFQVFilesques' + i + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[0].questions[i].vendorID + ')>' + "" + '</a></td></tr>').appendTo("#tblquestions");


                        }
                        else {
                            jQuery('<tr id=trid' + i + '><td style="width:30%">' + data[0].questions[i].question + '</td><td>' + data[0].questions[i].requirement + '</td><td>' + data[0].questions[i].answer + '<br>  <a id=eRFQVFilesques' + i + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[0].questions[i].vendorID + ')>' + attachQA + '</a></td></tr>').appendTo("#tblquestions");

                        }

                    }

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

                if (sessionStorage.getItem('RFQBIDType') == 'Open') {
                    jQuery('#tblAttachments').show();
                    jQuery('#tblAttachmentsprev').show();

                }
                else {
                    if (sessionStorage.getItem('ShowPrice') == 'N') {
                        jQuery('#tblAttachments').hide();
                        jQuery('#tblAttachmentsprev').hide();

                    }
                    else {
                        jQuery('#tblAttachments').show();
                        jQuery('#tblAttachmentsprev').show();
                    }

                }


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


                var taxHRTextinc = stringDivider("Unit Price (Without GST)", 35, "<br/>\n");
                var taxHRTextEx = stringDivider("Unit Price (With GST)", 35, "<br/>\n");
                var HRUnitRate = stringDivider("Amount (Inc. Taxes)", 35, "<br/>\n");

                var totalamount = 0.0;
                var bsicpercentageofGST = 0.0;
                var _basicPrice = "";
                var itemprice = "";
                comments = '';
                var srno, sheet, parentid, pid;


                jQuery('#tblServicesProduct').append('<thead><tr style="background: grey; color:light black;"><th style="width:10%!important;"></th><th style="width:10%!important">SrNo</th><th style="width:30%!important;">Item Name</th><th style="width:20%!important;">' + taxHRTextinc + '</th><th style="width:30%!important;">' + taxHRTextEx + '</th></tr></thead>');
                jQuery('#tblServicesProductforexcel').append('<thead><tr style="background: grey; color:light black;"><th style="width:5%!important;"></th><th style="width:4%!important">SrNo</th><th style="width:40%!important;">Item Name</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th></tr></thead>');
                for (var i = 0; i < data[0].quotesDetails.length; i++) {

                    if (data[0].quotesDetails[i].rfqtcid == "0") {

                        srno = data[0].quotesDetails[i].srno;

                        if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                            if (data[0].quotesDetails[i].rfqVendorPricewithTax <= 0) {
                                bsicpercentageofGST = thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithoutGST).round(2)) || "Not Quoted";
                            }
                            else {
                                bsicpercentageofGST = thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithTax).round(2)) || "Not Quoted";

                            }
                            _basicPrice = thousands_separators((data[0].quotesDetails[i].rfqVendorPricewithoutGST).round(2)) || "Not Quoted";
                            itemprice = thousands_separators((data[0].quotesDetails[i].itemPrice).round(2)) || "Not Quoted";
                            totalamount = data[0].quotesDetails[i].rfqVendorPricewithTax * data[0].quotesDetails[i].quantity || "Not Quoted";
                        }
                        else {
                            if (data[0].quotesDetails[i].rfqVendorPricewithTax <= 0) {
                                bsicpercentageofGST = (data[0].quotesDetails[i].rfqVendorPricewithoutGST) ? "Quoted" : "Not Quoted";
                            }
                            else {
                                bsicpercentageofGST = (data[0].quotesDetails[i].rfqVendorPricewithTax) ? "Quoted" : "Not Quoted";

                            }
                            _basicPrice = (data[0].quotesDetails[i].rfqVendorPricewithoutGST) ? "Quoted" : "Not Quoted";
                            itemprice = (data[0].quotesDetails[i].itemPrice) ? "Quoted" : "Not Quoted"

                        }

                        if (data[0].quotesDetails[i].vendorItemRemarks != "") {
                            comments = stringDivider(data[0].quotesDetails[i].vendorItemRemarks, 45, "<br/>\n");
                        }

                        if (data[0].quotesDetails[i].rfqParameterParentID > 0) {
                            $('#btn' + data[0].quotesDetails[i].rfqParameterParentID).attr('data-target', '#itemDiv' + data[0].quotesDetails[i].rfqParameterParentID);

                            if ($("#itemTbl" + data[0].quotesDetails[i].rfqParameterParentID).find('#itemDiv' + data[0].quotesDetails[i].rfqParameterParentID).length <= 0) {
                                $("#itemTbl" + data[0].quotesDetails[i].rfqParameterParentID).append("<tr><td colspan=10 class=hiddenRow style='border:none !important'><div class='accordian-body collapse' id='itemDiv" + data[0].quotesDetails[i].rfqParameterParentID + "' ></div></tr>");
                            }

                            if (data[0].quotesDetails[i].uom != '' && data[0].quotesDetails[i].rfqtcid <= 0) {
                                if ($("#itemDiv" + data[0].quotesDetails[i].rfqParameterParentID).find('#th' + data[0].quotesDetails[i].rfqParameterParentID).length <= 0) {
                                    $('#itemDiv' + data[0].quotesDetails[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].quotesDetails[i].rfqParameterParentID + " class='table table-bordered table-condensed  BoqTable'  style='margin-bottom:0px !important;' cellpadding=0 cellspacing=0><thead id=th" + data[0].quotesDetails[i].rfqParameterParentID + "><tr style='background: #eee;color: #000;'><th style='width:10%!important'></th><th  style='width:10%!important' class=text-left>S No</th><th style='width:30%!important'>Item Name</th><th style='width:20%!important'>Quantity</th><th style='width:10%!important'>UOM</th><th style='width:20%!important'>Price</th></tr></thead></table>")
                                }
                                $("#itemDiv" + data[0].quotesDetails[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].quotesDetails[i].rfqParameterId + " class='table table-bordered table-condensed  BoqTable' style='margin-bottom:0px !important;' cellpadding=0 cellspacing=0></table>");

                                $('#itemTbl' + data[0].quotesDetails[i].rfqParameterId).append("<tbody><tr><td style='width:10%!important'></td><td  style='width:10%!important' class='text-right'>" + srno + " </td><td style='width:30%!important'>" + data[0].quotesDetails[i].rfqShortName + "</td><td style='width:20%!important'>" + data[0].quotesDetails[i].quantity + "</td><td class=text-right style='width:10%!important'><b>" + data[0].quotesDetails[i].uom + "</b></td><td class=text-right style='width:20%!important'><b>" + itemprice + "</b></td></tr></tbody>")

                            }
                            else {
                                $("#itemDiv" + data[0].quotesDetails[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].quotesDetails[i].rfqParameterId + " class='table table-bordered table-condensed  BoqTable' style='margin-bottom:0px !important;' cellpadding=0 cellspacing=0></table>");

                                $('#itemTbl' + data[0].quotesDetails[i].rfqParameterId).append("<tbody><tr><td style='width:10%!important' class=border-none><button style='background-color:white !important;margin-left:12%;'  type='button'  data-toggle=collapse   id='btn" + data[0].quotesDetails[i].rfqParameterId + "'  class='btn iconbtn accordion-toggle' onclick='fncollapse(mainItem" + i + ")'><i class='glyphicon glyphicon-plus' id='mainItem" + i + "'></i></button></td><td  style='width:10%!important' class='text-right'>" + srno + " </td><td style='width:30%!important'>" + data[0].quotesDetails[i].rfqShortName + "</td><td style='width:50%!important'>" + itemprice + "</td></tr></tbody>")
                            }
                        }
                        else {

                            sheetcount++
                            sheet = data[0].quotesDetails[i].boqsheetName;
                            $("#tblServicesProduct").append("<tr><td colspan=10 class='hiddenRow' style='border:none !important'><div id='itemDiv" + sheetcount + "'></div></tr>");
                            $("#itemDiv" + sheetcount).append("<table id=itemTbl" + data[0].quotesDetails[i].rfqParameterId + " class='table table-bordered table-condensed  BoqTable' style='margin-bottom:0px !important;' cellpadding=0 cellspacing=0></table>");
                            $('#itemTbl' + data[0].quotesDetails[i].rfqParameterId).append("<tbody><tr><td style='width:10%!important' class=border-none><button style='background-color:white !important; margin-left:5%' type='button'  data-toggle=collapse   id='btn" + data[0].quotesDetails[i].rfqParameterId + "'  class='btn iconbtn accordion-toggle' onclick='fncollapse(mainItem" + i + ")'><i class='glyphicon glyphicon-plus' id='mainItem" + i + "'></i></button></td><td  style='width:10%!important' class='text-right'>" + sheetcount + " </td><td style='width:30%!important'>" + data[0].quotesDetails[i].rfqShortName + "</td><td style='width:20%!important'>" + _basicPrice + "</td> <td style='width:30%!important'>" + bsicpercentageofGST + "</td> </tr></tbody>")
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