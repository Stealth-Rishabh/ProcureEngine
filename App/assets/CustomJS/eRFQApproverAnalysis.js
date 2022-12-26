jQuery(document).ready(function () {
   
    Pageloaded();
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        bootbox.alert("<br />Oops! Your session has been expired. Please re-login to continue.", function () {
            window.location = sessionStorage.getItem('MainUrl');
            return false;
        });
    }
    else {
        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    Metronic.init(); Layout.init(); ComponentsPickers.init(); setCommonData();
    validateAppsubmitData();
   

});
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
if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
    var AppType = getUrlVarsURL(decryptedstring)["AppType"];
    var FwdTo = getUrlVarsURL(decryptedstring)["FwdTo"];
    var AppStatus = getUrlVarsURL(decryptedstring)["AppStatus"];
    var VID = getUrlVarsURL(decryptedstring)["VID"];

    $('#hdnRfqID').val(RFQID);
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    setTimeout(function () {
        fetchReguestforQuotationDetails()
        FetchRFQVersion();
        fetchrfqcomprative();
        fetchApproverRemarks();
        fetchAttachments();
    }, 400);
}


if (AppType == "C" && AppStatus == 'Approved' && FwdTo == 'Approver') {
    $('#divRemarksAppComm').show()
    $('#divRemarksAppTech').hide()
    jQuery("#divRemarksAwarded").hide();
}
else if (AppType == "C" && FwdTo == 'Admin' && AppStatus != 'Reverted') {
    $('#divRemarksAppComm').hide()
    $('#divRemarksAppTech').hide()
    jQuery("#divRemarksAwarded").show();
}
else if (AppType == "C" && FwdTo == 'Admin' && AppStatus == 'Reverted') {
    $('#divRemarksAppComm').hide()
    $('#divRemarksAppTech').hide()
    jQuery("#divRemarksAwarded").hide();
    jQuery("#divRemarksForward").show();
}
else if (AppType == "NFA") {
    $('#divRemarksAppComm').hide()
    jQuery("#divRemarksAwarded").hide();
    $('#divRemarksAppTech').hide()
}
else {
    $('#divRemarksAppComm').hide()
    $('#divRemarksAppTech').show()
}

var Vendor;
function fetchApproverRemarks() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRFQApproval/FetchApproverRemarks/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + $('#hdnRfqID').val() + "&ApprovalType=" + AppType,
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/FetchApproverRemarks/?RFQID=" + $('#hdnRfqID').val() + "&ApprovalType=" + AppType,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $('#tblremarksforward').empty()
            $('#tblremarksapprover').empty()
            $('#tblremarksawared').empty()
            if (data.length > 0) {
                $('#tblremarksforward').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th>Date</th></tr>')
                $('#tblremarksapprover').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th>Date</th></tr>')
                $('#tblremarksawared').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th>Date</th></tr>')
                $('#tblapprovalprocess').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th>Date</th></tr>')
                if (AppStatus == 'Reverted') {
                    jQuery("#lblrevertedComment").text(data[0].remarks);
                    jQuery("#RevertComment").show();
                    $('#frmdivremarksforward').removeClass('col-md-12');
                    $('#frmdivremarksforward').addClass('col-md-6');
                    $('#frmdivforward').show();
                    for (var i = 0; i < data.length; i++) {
                        $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')

                    }
                }
                $('#frmdivremarksapprover').removeClass('col-md-12');
                $('#frmdivremarksapprover').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {

                    $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')

                }
                $('#frmdivapprove').show()
                $('#frmdivremarksawarded').removeClass('col-md-12');
                $('#frmdivremarksawarded').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {
                    $('#tblremarksawared').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')

                }
                $('#frmdivawarded').show()
                jQuery("#lblLastcomments,#LblLastcomments,#lbllastcommentSeaAward").text(data[0].remarks);
            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" +  + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }
    })
}
function getSummary(vendorid, version) {
    var encrypdata = fnencrypt("RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + vendorid + "&max=" + version + "&RFQVersionId=99&RFQVersionTxt=Final%20Version")
    window.open("eRFQReport.html?param=" + encrypdata, "_blank")

}

var ShowPrice = "Y";
var bidopeningdate = new Date();
var RFQBidType = '';
var RFQEndDate = new Date();
function fetchrfqcomprative() {
    var url = '';
    //ShowPrice = "N";
    //alert('1-'+ ShowPrice);
    if (VID != undefined && VID != '' && VID != null && VID.toLowerCase() != 'nfa') {
        //url = sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails_vendor/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=99&VendorID=" + VID
        url = sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails_vendor/?RFQID=" + $('#hdnRfqID').val() + "&RFQVersionId=99&VendorID=" + VID
    }
    else {
        //url = sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=99"
        url = sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&RFQVersionId=99"
    }

    jQuery.ajax({
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            var str = '';
            var strHead = '';


            var totalWithouTax = 0;
            var totalWithTax = 0;
            var VendorID = 0;
            var totallowestValue = 0;
            var strQ = '';
            var strHeadQ = '';

            var FlagForLowest = 'L'

            jQuery('#tblRFQComprative > thead').empty()
            jQuery("#tblRFQComprativeForExcel > thead").empty();
            jQuery('#tblRFQComprativetest > thead').empty()
            $('#tblRFQComprative > tbody').empty();
            $('#tblRFQComprativetest > tbody').empty();
            jQuery("#tblRFQComprativeForExcel > tbody").empty();

            jQuery('#tblRFQComprativeQ > thead').empty()
            jQuery("#tblRFQComprativeForExcelQ > thead").empty();
            jQuery('#tblRFQComprativetestQ > thead').empty()
            $('#tblRFQComprativeQ > tbody').empty();
            $('#tblRFQComprativetestQ > tbody').empty();
            jQuery("#tblRFQComprativeForExcelQ > tbody").empty();

            var _rfqBidType = sessionStorage.getItem("RFQBIDType");

            if (_rfqBidType != 'Closed') {
                if (AppType == "T" && FwdTo != 'Admin') {

                    ShowPrice = data[0].showPrice[0].showQuotedPrice;
                    if (ShowPrice != 'N') {
                        ShowPrice = 'Y';
                    }

                }


                //if (AppType == "C" && (new Date(bidopeningdate) <= new Date()) && AppType != "T") {
                if (AppType == "C" && AppType != "T") {
                    ShowPrice = 'Y';

                }
                //ShowPrice = 'Y';

            }
            else {
                if (bidopeningdate == null || bidopeningdate == '') {
                    ShowPrice = 'N';

                }
                else {
                    var newDt = fnConverToLocalTime(bidopeningdate);
                    bidopeningdate = new Date(newDt.replace('-', ''));
                    if (bidopeningdate < new Date()) {
                        ShowPrice = 'Y';


                    }
                    else {
                        ShowPrice = 'N';

                    }
                }
            }

            sessionStorage.setItem('ShowPrice', ShowPrice);
            if (data[0].vendorNames.length > 0) {
                Vendor = data[0].vendorNames;
                $('#displayTable').show();
                $('#btnExport').show()
                $('#btnPDF').show()
                $('#displayComparativetabs').show();
                //For Printing Header
                strHead = "<tr  style='background: #f5f5f5; color:light black;'><th class='hide'>&nbsp;</th><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th>"
                strHeadQ = "<tr  style='background:#f5f5f5; color:light black;'><th>Question</th><th>Our Requirement</th>"
                jQuery("#drpVendors").empty();
                jQuery("#drpVendors").append(jQuery("<option ></option>").val("").html("Only for auto PO confirmation"));
                for (var i = 0; i < data[0].vendorNames.length; i++) {


                    GetQuestions(data[0].vendorNames[i].vendorID)

                    if (data[0].vendorNames[i].seqNo != 0) {

                        strHead += "<th colspan='4' style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + data[0].vendorNames[i].rfqVersionId + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vendorName; +"</a></th>";
                        strHeadQ += "<th style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + data[0].vendorNames[i].rfqVersionId + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vName; +"</a></th>";
                        jQuery("#drpVendors").append(jQuery("<option ></option>").val(data[0].vendorNames[i].vendorID).html(data[0].vendorNames[i].vName));

                    }
                    else {
                        strHead += "<th colspan='4' style='text-align:center;'>" + data[0].vendorNames[i].vendorName; +"</th>";
                        strHeadQ += "<th style='text-align:center;'>" + data[0].vendorNames[i].vName; +"</th>";


                    }

                }
                strHead += "<th>Line-wise Lowest Quote</th><th colspan='5' style='text-align:center;'>Last PO Details</th><th>Delivery Location</th>";
                strHead += "</tr>"
                strHeadQ += "</tr>"

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";

                //abheedev bug 436 start
                var taxHRTextinc = stringDivider("Unit Price (With GST)", 18, "<br/>\n");
                var taxHRTextEx = stringDivider("Unit Price (Without GST)", 18, "<br/>\n");
                var initialtaxHRTextEx = stringDivider("Unit Price - R0 (Without GST)  ", 18, "<br/>\n");
                var HRAmount = stringDivider("Amount (Inc. GST)", 10, "<br/>\n");
                //abheedev bug 436 end
                for (var j = 0; j < data[0].vendorNames.length; j++) {

                    strHead += "<th>" + initialtaxHRTextEx + "</th><th>" + taxHRTextEx + "</th><th>" + taxHRTextinc + "</th><th>" + HRAmount + "</th>";


                }
                strHead += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th><th>&nbsp;</th>";
                strHead += "</tr>";
                jQuery('#tblRFQComprative > thead').append(strHead);
                jQuery('#tblRFQComprativeQ > thead').append(strHeadQ);


                //For Printing Header Ends


                var x = 0;
                var minprice = 0;
                var unitrate = 0;
                for (var i = 0; i < data[0].noofQuotes[0].noofRFQParameter; i++) {
                    unitrate = 0;

                    var flag = 'T';
                    $("#tblRFQComprativetest > tbody > tr").each(function (index) {
                        var this_row = $(this);

                        if ($.trim(this_row.find('td:eq(2)').html()) == data[0].quotesDetails[i].rfqParameterId) {
                            flag = 'F';

                        }

                    });
                    x = -1;
                    if (flag == 'T') {


                        str += "<tr><td class='hide'>" + data[0].quotesDetails[i].vendorID + "</td><td>" + (i + 1) + "</td><td class='hide'>" + data[0].quotesDetails[i].rfqParameterId + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].quantity) + "</td><td>" + data[0].quotesDetails[i].uom + "</td>";
                        for (var j = 0; j < data[0].quotesDetails.length; j++) {

                            if ((data[0].quotesDetails[i].rfqParameterId) == (data[0].quotesDetails[j].rfqParameterId)) {
                                x = x + 1;

                                if (data[0].quotesDetails[j].vendorID == data[0].vendorNames[x].vendorID) {


                                    if (ShowPrice == "N") {
                                        str += "<td>Quoted</td>";
                                    }
                                    else {
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators(data[0].quotesDetails[j].initialQuotewithoutGST) + "</td>";
                                    }
                                    if (ShowPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        str += "<td class='text-right'>Quoted</td><td class='VendorPriceNoTax text-right'>Quoted</td><td class='VendorPriceWithTax  text-right' >Quoted</td>";

                                    }
                                    //abheedev bug 436 start
                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";
                                        }
                                        else {
                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";
                                        }
                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";
                                        }
                                        else {
                                            str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";
                                        }
                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: red!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";
                                        }
                                        else {
                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: red!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";
                                        }
                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";
                                        }
                                        else {
                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";
                                        }
                                    }
                                    //abheedev bug 436 end
                                    else if (data[0].quotesDetails[j].unitRate == -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST == -1) {
                                        str += "<td colspan=3  style='color: blue!important; text-align: center;' >Not Invited</td>";

                                    }
                                    else if (data[0].quotesDetails[j].unitRate == -2 && data[0].quotesDetails[j].rfqVendorPricewithoutGST == -2) {
                                        str += "<td colspan=3  style='color: red!important; text-align: center;' >Regretted</td>";

                                    }
                                    else {

                                        str += "<td colspan=3  style='color: red!important; text-align: center;' >Not Quoted</td>";
                                    }
                                }
                            }

                        }
                        if (ShowPrice == 'Y') {
                            //abheedev bug 436 grill
                            totallowestValue = totallowestValue + (data[0].quotesDetails[i].quantity * data[0].quotesDetails[i].lowestPriceValue)
                            str += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poUnitRate) + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        }
                        else {
                            totallowestValue = 'Quoted'
                            str += "<td class=text-right>Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poUnitRate) + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        }
                        str += "</tr>"
                        jQuery('#tblRFQComprativetest').append(str);

                    }

                }

                str += "<tr><td colspan=5 style='text-align:center;'><b>Total</b></td>";

                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        if (ShowPrice == 'Y') {
                            RFQFetchTotalPriceForReport(data[0].vendorNames[k].vendorID, k)
                            str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                        }
                        else {
                            str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td>";
                        }

                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";

                    }

                }
                //abheedev bug 436 
                if (ShowPrice == 'Y') {
                    str += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";
                }
                //abheedev bug 436 end
                else {
                    str += "<td class=text-right>Quoted</td><td colspan=6>&nbsp;</td></tr>";
                }



                str += "<tr><td colspan=3 style='text-align:center;'><b>Loading Factor</b></td><td colspan=2 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>

                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            var p = thousands_separators(data[0].loadedFactor[k].loadedFactor + data[0].loadedFactor[k].sumwithGST);
                            if (p != 0) {
                                if (ShowPrice == 'Y') {
                                    str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                                }
                                else {
                                    str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">Quoted</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>Quoted</td><td>&nbsp;</td><td>&nbsp;</td>";
                                }

                            }
                            else {

                                str += "<td colspan=4>&nbsp;</td>";

                            }

                        }
                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";

                str += "<tr><td colspan=5 style='text-align:center;'><b>Loading Reason</b></td>";

                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            if (data[0].loadedFactor[k].loadingFactorReason != '') {
                                str += "<td style='text-align:left;' colspan=4 id=LoadingReason" + data[0].vendorNames[k].vendorID + ">" + data[0].loadedFactor[k].loadingFactorReason + "</td>";

                            }
                            else {

                                str += "<td colspan=4>&nbsp;</td>";

                            }

                        }


                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";



                str += "<tr><td colspan=5 style='text-align:center;'><b>Commercial Rank (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>

                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].lStatus.length; k++) {

                        if (data[0].lStatus[k].vendorID == data[0].vendorNames[l].vendorID) {
                            if (ShowPrice == "Y") {
                                if (data[0].lStatus[k].status != 'N/A') {
                                    str += "<td colspan=4 style='text-align:center;color: blue!important;'>" + data[0].lStatus[l].status + "</td>";

                                }
                                else {
                                    str += "<td colspan=4 style='text-align:center;color: red!important;'>" + data[0].lStatus[k].status + "</td>";

                                }
                            }
                            else {
                                str += "<td colspan=4 style='text-align:center;color: black!important;'>Quoted</td>";
                            }

                        }

                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";


                str += "<tr><td colspan=5 style='text-align:center;'><b>Package Value where supplier is L1</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>

                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        if (ShowPrice == 'Y') {
                            RFQFetchL1Package(data[0].vendorNames[k].vendorID, k)
                            str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                        }
                        else {

                            str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td>";
                        }

                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";

                    }

                }
                str += "<td colspan=7>&nbsp;</td></tr>";



                str += "<tr>";

                var t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {
                    t = k;
                }

                str += "<td colspan=" + (t + 10) + ">&nbsp;</td></tr>";



                if (data[0].commercialTerms.length > 0) {

                    str += "<tr style='background: #f5f5f5; color:light black;'>";

                    str += "<td><b>SrNo</b></td><td colspan=4><b>Other Commercial Terms</b></td>";

                    for (var k = 0; k < data[0].vendorNames.length; k++) {

                        if (data[0].vendorNames[k].seqNo != '0') {

                            str += "<td colspan=4 style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[k].vendorID + "'\,\'" + data[0].vendorNames[k].rfqVersionId + "'\)  style='color:#2474f6; text-decoration:underline;'><b>" + data[0].vendorNames[k].vName + "<b></a></td>";


                        }
                        else {
                            str += "<td colspan=4 style='text-align:center;'><b>" + data[0].vendorNames[k].vName; +"</b></td>";


                        }

                    }
                    str += "<td colspan=7><b>Our Requirement</b></td></tr>";


                    $('#tblRFQComprativetest > tbody').empty();


                    for (var p = 0; p < data[0].noOfTermsForRFQ[0].noOfTermsSelectedForRFQ; p++) {

                        var flag1 = 'T';
                        $("#tblRFQComprativetest > tbody > tr").each(function (index) {
                            var this_row = $(this);
                            if ($.trim(this_row.find('td:eq(0)').html()) == data[0].commercialTerms[p].termName) {
                                flag1 = 'F';
                            }

                        });


                        if (flag1 == 'T') {

                            str += "<tr><td>" + (p + 1) + "</td><td colspan=4>" + data[0].commercialTerms[p].termName + "</td>";


                            for (var s = 0; s < data[0].commercialTerms.length; s++) {

                                if ((data[0].commercialTerms[p].rfqtcid) == (data[0].commercialTerms[s].rfqtcid)) {


                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].commercialTerms[s].vendorID == data[0].vendorNames[q].vendorID) {

                                            if (data[0].commercialTerms[s].remarks != '' && data[0].commercialTerms[s].remarks != 'Rejected') {
                                                str += "<td colspan=4>" + data[0].commercialTerms[s].remarks + "</td>";


                                            }
                                            else if (data[0].commercialTerms[s].remarks == 'Rejected') {
                                                str += "<td colspan=4 style='color: red!important; text-align: center;'>Regretted</td>";


                                            }
                                            else {
                                                str += "<td colspan=4  style='color: red!important; text-align: center;' >Not Quoted</td>";

                                            }

                                        }

                                    }
                                }
                            }
                            str += "<td colspan=7>" + data[0].commercialTerms[p].requirement + "</td>";


                            str += " </tr>";

                            jQuery('#tblRFQComprativetest').append(str);
                        }
                    }
                }



                str += "<tr><td colspan=5><b>Vendor Remarks :</b></td>";

                for (var k = 0; k < data[0].vendorNames.length; k++) {

                    if (data[0].vendorNames[k].vendorRemarks != "") {
                        var VRemarks = stringDivider(data[0].vendorNames[k].vendorRemarks, 40, "<br/>\n");
                        str += "<td colspan='4' class='text-left' >" + VRemarks + "</td>";

                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";

                    }
                }
                str += "<td colspan=7>&nbsp;</td>";

                str += " </tr>";



                if (data[0].questions.length > 0) {

                    $('#tblRFQComprativetestQ > tbody').empty();
                    for (var p = 0; p < data[0].noOfQuestions[0].noOfQuestionsCount; p++) {

                        var flag2 = 'T';
                        $("#tblRFQComprativetestQ > tbody > tr").each(function (index) {
                            var this_row = $(this);
                            if ($.trim(this_row.find('td:eq(0)').html().toLowerCase()) == data[0].questions[p].question.toLowerCase()) {
                                flag2 = 'F';

                            }

                        });


                        if (flag2 == 'T') {

                            strQ += "<tr><td>" + data[0].questions[p].question + "</td><td>" + data[0].questions[p].requirement + "</td>";


                            for (var s = 0; s < data[0].questions.length; s++) {

                                if ((data[0].questions[p].questionID) == (data[0].questions[s].questionID)) {// true that means reflect on next vendor

                                    //  q = q + 1;
                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].questions[s].vendorID == data[0].vendorNames[q].vendorID) {

                                            if (data[0].questions[s].answer != '' && data[0].questions[s].answer != 'Rejected') {
                                                strQ += "<td>" + data[0].questions[s].answer + "</td>";


                                            }
                                            else if (data[0].questions[s].answer == 'Rejected') {
                                                strQ += "<td  style='color: red!important; text-align: center;'>Regretted</td>"


                                            }
                                            else {
                                                strQ += "<td  style='color: red!important; text-align: center;' >Not Quoted</td>";

                                            }

                                        }

                                    }
                                }
                            }


                            strQ += " </tr>";

                            jQuery('#tblRFQComprativetestQ').append(strQ);

                        }
                    }
                }
                else {
                    strQ += "<tr>";

                    t = 0;
                    for (var k = 1; k <= data[0].vendorNames.length; k++) {

                        t = k;

                    }
                    strQ += "<td colspan=" + (t + 2) + ">No Questions Mapped</td>";

                    strQ += "</tr>";

                }

                strQ += "<tr><td><b>Technical Approval</b></td>";
                if (AppType == 'T') {

                    if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "afterrfq") {
                        strQ += "<td>After All RFQ Responses</td>"
                    }
                    else if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "rfq") {
                        strQ += "<td>With Indivisual RFQ Response</td>"
                    }
                    else {
                        strQ += "<td>Not Required</td>"
                    }
                    for (var k = 0; k < data[0].vendorNames.length; k++) {

                        strQ += '<td style="text-align:center"><input style="width:16px!important;height:16px!important;"  type=checkbox name=AppRequired' + data[0].vendorNames[k].vendorID + ' id=AppYes' + data[0].vendorNames[k].vendorID + '  onclick="check(' + data[0].vendorNames[k].vendorID + ')" value="Y" /> &nbsp;<span style="margin-bottom:10px!important" for=AppYes' + data[0].vendorNames[k].vendorID + ' >Yes</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style="width:16px!important;height:16px!important;" type=checkbox class=md-radio name=AppRequired' + data[0].vendorNames[k].vendorID + ' id=AppNo' + data[0].vendorNames[k].vendorID + '  onclick="check(' + data[0].vendorNames[k].vendorID + ')" value="N"  /> &nbsp;<span for=AppNo' + data[0].vendorNames[k].vendorID + '>No</span></td>'

                    }
                    strQ += "</tr>"


                    strQ += "<tr><td colspan=2></td>";
                    for (var k = 0; k < data[0].vendorNames.length; k++) {
                        strQ += '<td style="text-align:center;"><a href="#RaiseQuery" class="btn btn-xs yellow" style="pointer:cursor;text-decoration:none;" id=btn_raisequery' + data[0].vendorNames[k].vendorID + '  onclick="fnRaiseQuery(' + data[0].vendorNames[k].vendorID + ')" data-toggle="modal" data-backdrop="static" data-keyboard="false">Query/Response</a>&nbsp; <span id=querycount' + data[0].vendorNames[k].vendorID + ' ></span></td>'
                    }
                    strQ += "</tr>";
                }
                else {

                    t = 0;
                    for (var k = 1; k <= data[0].vendorNames.length; k++) {
                        t = k;
                    }

                    if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "afterrfq") {
                        strQ += "<td colspan=" + (t) + ">After All RFQ Responses</td>"
                    }
                    else if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "rfq") {
                        strQ += "<td colspan=" + (t) + ">With Indivisual RFQ Response</td>"
                    }
                    else {
                        strQ += "<td colspan=" + (t) + ">Not Required</td>"
                    }
                    strQ += "</tr>"

                }


                strQ += "<tr>";
                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {
                    t = k;
                }
                strQ += "<td colspan=" + (t + 2) + ">&nbsp;</td>";

                strQ += "</tr>";

                if (data[0].approverStatus.length > 0) {
                    $('#tblRFQComprativetestQ > tbody').empty(); // clear again for comparision of Question
                    for (var p = 0; p < data[0].noOfTApprover[0].noOfTechnicalApprover; p++) {

                        var flag3 = 'T';
                        $("#tblRFQComprativetestQ > tbody > tr").each(function (index) {
                            var this_row = $(this);
                            if ($.trim(this_row.find('td:eq(0)').html().toLowerCase()) == data[0].approverStatus[p].approverName.toLowerCase()) {
                                flag3 = 'F';

                            }

                        });

                        if (flag3 == 'T') {

                            strQ += "<tr><td>" + data[0].approverStatus[p].approverName + "</td><td id=techremark" + p + ">" + ((data[0].approverStatus[p].remarks).replaceAll("&lt;", "<")).replaceAll("&gt;", ">") + "</td>";

                            for (var s = 0; s < data[0].approverStatus.length; s++) {

                                if ((data[0].approverStatus[p].approverID) == (data[0].approverStatus[s].approverID)) {// true that means reflect on next vendor

                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].approverStatus[s].vendorID == data[0].vendorNames[q].vendorID) {

                                            if (data[0].approverStatus[s].status == 'Approved') {
                                                strQ += "<td style='color: green!important; text-align: center;'>" + data[0].approverStatus[s].status + "</td>";

                                            }
                                            else if (data[0].approverStatus[s].status == 'Rejected') {
                                                strQ += "<td style='color: red!important; text-align: center;'>Not Approved</td>";

                                            }
                                            else if (data[0].approverStatus[s].status == 'Pending') {
                                                strQ += "<td style='color: blue!important; text-align: center;'>Pending</td>";


                                            }

                                        }
                                    }
                                }
                            }


                            strQ += " </tr>";

                            jQuery('#tblRFQComprativetestQ').append(strQ);

                        }

                    }

                }

                strQ += "<tr>";

                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {

                    t = k;

                }
                strQ += "<td colspan=" + (t + 2) + ">&nbsp;</td>";

                strQ += "</tr>";

                jQuery('#tblRFQComprative').append(str);
                jQuery('#tblRFQComprativeQ').append(strQ);

            }
            else {

                $('#displayTable').show();
                $('#displayComparativetabs').show();
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo('#tblRFQComprative');
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo("#tblRFQComprativeForExcel")

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;
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
    jQuery.unblockUI();

}
function check(vendorid) {

    $('[name=AppRequired' + vendorid + ']').on('change', function () {
        var $this = $(this);
        $this.siblings('[value=' + this.value + ']').prop('checked', true)
        $this.siblings('[value!=' + this.value + ']').prop('checked', false)
    });

}
function fnRaiseQuery(vendorid) {
    $('#hdnvendorid').val(vendorid)
    GetQuestions(vendorid);

}
var queslength = 0;
var PendingOn = 'A';
sessionStorage.setItem('HeaderID', 0)
function GetQuestions(vendorid) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + $('#hdnRfqID').val() + "&VendorID=" + vendorid + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + $('#hdnRfqID').val() + "&VendorID=" + vendorid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            jQuery("#tblquestions").empty();
            var attach = 'No Attachment';


            $('#querycount' + vendorid).text("Response Pending (" + data.length + ")")
            if (data.length > 0) {
                queslength = data.length;
                sessionStorage.setItem('HeaderID', data[0].headerid)
                $('#btnTechquery').attr('disabled', 'disabled')
                jQuery('#tblquestions').append("<thead><tr><th class='bold' style='width:40%!important'>Questions</th><th class='bold' style='width:40%!important'>Answer</th><th class='bold' style='width:10%!important'>Attachment</th><th class='bold' style='width:5%!important'>CreatedBy</th><th style='width:5%!important'></th></tr></thead>");
                for (var i = 0; i < data.length; i++) {
                    rowques = rowques + 1;
                    attach = '';
                    if (data[i].attachment != '') {
                        attach = '<a style="pointer: cursur; text-decoration:none; "  id=eRFQVQueryFiles' + i + ' href="javascript: ; " onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a>';
                    }

                    str = '<tr id=trquesid' + (i + 1) + '><td class=hide id=ques' + i + '>' + data[i].id + '</td><td>' + data[i].question + '</td>';
                    str += '<td id=answer' + i + '>' + data[i].answer + '</td>';
                    str += '<td>' + attach + '</td>';
                    str += '<td>' + data[i].createdBy + '</td>';
                    str += '<td><button type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deletequesrow(trquesid' + (i + 1) + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
                    jQuery('#tblquestions').append(str);

                    if ($('#answer' + i).text() != "" || data[0].pendingOn.toLowerCase() == "v") {
                        $('#Removebtn' + i).hide();
                        $('#btnTechquery').text("Additional Query")
                    }
                    else {
                        $('#Removebtn' + i).show();
                    }
                    PendingOn = data[i].pendingOn;
                    if (data[0].pendingOn.toLowerCase() != "v" && data[0].pendingOn.toLowerCase() != 'x') {
                        $('#btn_raisequery' + vendorid).text('Reponse Recieved')
                        $('#btn_raisequery' + vendorid).removeClass('yellow').addClass('green')
                        $('#querycount' + vendorid).hide();

                    }
                    if (data[0].pendingOn.toLowerCase() == "x") {
                        $('#btn_raisequery' + vendorid).text('Withdraw')
                        $('#btn_raisequery' + vendorid).removeClass('green').removeClass('yellow').addClass('red')
                        $('#querycount' + vendorid).hide();
                    }

                }
                if (PendingOn.toLowerCase() == "v") {
                    jQuery('#btnSubmitApp').attr("disabled", 'disabled');
                    $('#btnSubmitApp').removeClass('green').addClass('default')
                    $('#btnwithdraw').show()
                }
                else {
                    $('#btnwithdraw').hide()
                }
            }
            else {
                $('#btnwithdraw').hide()

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;
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
function DownloadFileVendor(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val() + '/' + $('#hdnvendorid').val() + '/TechQuery');
}
$("#RaiseQuery").on("hidden.bs.modal", function () {
    jQuery("#txtquestions").val('')
    $('#hdnvendorid').val('0')
    $('#tblquestions').empty();
    $('#btnTechquery').attr('disabled', 'disabled')
    queslength = 0;
    PendingOn = 'A'
});
var rowques = 0;
function addquestions() {
    if (jQuery("#txtquestions").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter Questions');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }

    else {
        rowques = rowques + 1;
        if (!jQuery("#tblquestions thead").length) {
            jQuery('#tblquestions').append("<thead><tr><th class='bold' style='width:40%!important' colspan=4>Questions</th><th style='width:5%!important'></th></tr></thead>");
        }
        var str = '<tr id=trquesid' + rowques + '><td class=hide>0</td><td colspan=4>' + jQuery("#txtquestions").val() + '</td>';
        str += '<td style="width:5%!important"><button type=button id=Removebtn' + rowques + ' class="btn btn-xs btn-danger"  onclick="deletequesrow(trquesid' + rowques + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblquestions').append(str);
        jQuery("#txtquestions").val('')

        if ((jQuery('#txtquestions> tbody > tr').length == 0 || queslength > 0) && PendingOn != 'A' && PendingOn != 'X') {
            $('#btnTechquery').attr('disabled', 'disabled')

        }
        else {
            $('#btnTechquery').removeAttr('disabled')

        }
    }
}
function deletequesrow(rowid) {
    rowques = rowques - 1;
    $('#' + rowid.id).remove();

    if (jQuery('#txtquestions> tbody > tr').length == 1 || queslength > 0) {
        $('#btnTechquery').attr('disabled', 'disabled')

    }
    else {

    }
}
function submitTechnicalQuery() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var quesquery = "";

    if ($("#tblquestions> tbody > tr").length > 0) {
        if ($('#txtquestions').val() == "") {
            $('#querycount' + $('#hdnvendorid').val()).text('Response Pending (' + $("#tblquestions> tbody > tr").length + ')')
            $("#tblquestions> tbody > tr").each(function (index) {
                var this_row = $(this);

                if ($.trim(this_row.find('td:eq(0)').html()) == "0") {
                    quesquery = quesquery + $.trim(this_row.find('td:eq(1)').html()) + '#';
                }

            });
            var data = {
                "RFQID": parseInt($('#hdnRfqID').val()),
                "QuesString": quesquery,
                "UserID": sessionStorage.getItem('UserID'),
                "VendorID": parseInt($('#hdnvendorid').val()),
                "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
                "Headerid": parseInt(sessionStorage.getItem('HeaderID')),
                "PendingOn": "V"
            }
            console.log(JSON.stringify(data))
            jQuery.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "eRFQApproval/eInsQueryTovendorApproversforAllTechnical",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                crossDomain: true,
                async: false,
                data: JSON.stringify(data),
                dataType: "json",
                success: function (data) {

                    bootbox.alert("Approval can now be enabled after vendor response or query withdrawal .").on("shown.bs.modal", function (e) {
                        //setTimeout(function () {
                        $('#btnTechquery').attr('disabled', 'disabled')
                        $('#btnSubmitApp').attr('disabled', 'disabled')
                        $('#btnSubmitApp').removeClass('green').addClass('default')
                        $('#btnwithdraw').show()
                        //$('#btnmsz').removeClass('hide')
                        $("#RaiseQuery").modal('hide');

                        jQuery.unblockUI();
                        return true;
                        //}, 1000);
                    });

                },
                error: function (xhr, status, error) {

                    var err = xhr.responseText;
                    if (xhr.status == 401) {
                        error401Messagebox(err.Message);
                    }
                    else {
                        fnErrorMessageText('spandanger', '');
                    }
                    jQuery.unblockUI();
                    return false;

                }

            });
        }
        else {
            $('.alert-danger').show();
            $('#spandanger').html('Your Query is not added. Please do press "+" button after add Query.');
            Metronic.scrollTo($(".alert-danger"), -200);
            $('.alert-danger').fadeOut(7000);
            jQuery.unblockUI();
            return false;
        }
    }
    else {
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter atleast one Query');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery.unblockUI();
        return false;
    }

}
function fnquerywithdaw() {
    bootbox.dialog({
        message: "Do you want to withdraw query from vendor, Click Yes for  Continue ",

        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    withdrawquery();
                }
            },
            cancel: {
                label: "No",
                className: "btn-warning",
                callback: function () {
                    return true;

                }
            }
        }
    });
}
function withdrawquery() {
    var data = {
        "RFQID": parseInt($('#hdnRfqID').val()),
        "QuesString": '',
        "UserID": sessionStorage.getItem('UserID'),
        "VendorID": parseInt($('#hdnvendorid').val()),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "Headerid": parseInt(sessionStorage.getItem('HeaderID')),
        "PendingOn": "X"
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/eInsQueryTovendorApproversforAllTechnical",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {

            bootbox.alert("Query withdraw from vendor successfully .", function () {
                setTimeout(function () {
                    $('#btnSubmitApp').removeAttr('disabled')
                    $('#btnSubmitApp').addClass('green').removeClass('default')

                    $("#RaiseQuery").modal('hide');

                    jQuery.unblockUI();
                }, 1000);
            });
            return;
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;

        }

    });


}
function RFQFetchTotalPriceForReport(VendorID, Counter) {


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchTotalPriceForReport/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=99&BidID=0",// + sessionStorage.getItem("RFQVersionId"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (ShowPrice == "Y") {
                $("#totBoxwithoutgst" + VendorID).html(thousands_separators(data[0].totalPriceExTax));
                $("#totBoxwithgst" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
                $("#totBoxTax" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
                $("#totBoxwithoutgstExcel" + VendorID).html(thousands_separators(data[0].totalPriceExTax));
                $("#totBoxwithgstExcel" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
                $("#totBoxTaxExcel" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
            }
            else {
                $("#totBoxwithoutgst" + VendorID).html("Quoted");
                $("#totBoxwithgst" + VendorID).html("Quoted");
                $("#totBoxTax" + VendorID).html("Quoted");
                $("#totBoxwithoutgstExcel" + VendorID).html("Quoted");
                $("#totBoxwithgstExcel" + VendorID).html("Quoted");
                $("#totBoxTaxExcel" + VendorID).html("Quoted");
            }
            if ($("#ddlrfqVersion option:selected").val() == 99) {
                $(".lambdafactor").addClass('hide');

            }
            else {
                $(".lambdafactor").removeClass('hide');

            }


        }, error: function (xhr, status, error) {

            var err = xhr.responseText;
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
function RFQFetchL1Package(VendorID, Counter) {


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchL1Package/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=99&BidID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $("#withoutGSTL1Rank" + VendorID).html(thousands_separators(data[0].totalL1RankWithoutGST));
            $("#withoutGSTL1RankExcel" + VendorID).html(data[0].totalL1RankWithoutGST);
            $("#withGSTL1Rank" + VendorID).html(thousands_separators(data[0].totalL1RankWithGST));
            $("#withGSTL1RankExcel" + VendorID).html(thousands_separators(data[0].totalL1RankWithGST));
            $("#totL1Rank" + VendorID).html(thousands_separators(data[0].totalL1RankWithGST));
            $("#totL1RankExcel" + VendorID).html(thousands_separators(data[0].totalL1RankWithGST));


        }, error: function (xhr, status, error) {

            var err = xhr.responseText;
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
var max = 0;
function FetchRFQVersion() {
    max = 0;
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQVersions/?RFQID=" + $('#hdnRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                max = data[0].rfqVersionId;
            }

        }, error: function (xhr, status, error) {

            var err = xhr.responseText;
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
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val());
}
function fetchAttachments() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            jQuery("#tblAttachments").empty();

            if (data[0].attachments.length > 0) {
                jQuery("#tblAttachments").append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")

                for (var i = 0; i < data[0].attachments.length; i++) {
                    var str = "<tr><td style='width:50%!important'>" + data[0].attachments[i].rfqAttachmentDescription + "</td>";
                    str += '<td class=style="width:50%!important"><a id=eRFQFile' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFile(this)"  href="javascript:;" >' + data[0].attachments[i].rfqAttachment + '</a></td>';
                    jQuery('#tblAttachments').append(str);

                }
            }
            else {
                jQuery('#tblAttachments').append("<tr><td>No Attachments</td></tr>");

            }
            jQuery.unblockUI();
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
            return false;

        }

    })
}

jQuery("#txtSearch").keyup(function () {
    _this = this;

    jQuery.each($("#tblRFQComprative tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});
function fetchReguestforQuotationDetails() {
    var attachment = '';
    var termattach = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {
            var replaced1 = '';
            $('#tbldetailsExcel > tbody').empty();
            if (RFQData.length > 0) {
                bidopeningdate = RFQData[0].general[0].bidopeningdate;
                sessionStorage.setItem("RFQBIDType", RFQData[0].general[0].rfqBidType)

                jQuery('#RFQSubject').html(RFQData[0].general[0].rfqSubject)
                jQuery('#RFQDescription').html(RFQData[0].general[0].rfqDescription)
                $('#Currency').html(RFQData[0].general[0].currencyNm)
                jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate);
                jQuery('#refno').html(RFQData[0].general[0].rfqReference)

                jQuery('#RFQStartDate').html(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
                jQuery('#RFQDeadline').html(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
                jQuery('#lblrfqconfigby').html(RFQData[0].general[0].rfqConfigureByName)


                if (RFQData[0].general[0].rfqTermandCondition != '') {
                    replaced1 = RFQData[0].general[0].rfqTermandCondition.replace(/\s/g, "%20")
                }

                $('#TermCondition').attr('href', 'PortalDocs/RFQ/' + $('#hdnRfqID').val() + '/' + replaced1.replace(/\s/g, "%20") + '').html(RFQData[0].general[0].rfqTermandCondition)

                $('#tbldetails').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + fnConverToLocalTime(RFQData[0].general[0].rfqEndDate) + "</td></tr>")
                $('#tbldetailsExcel > tbody').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + fnConverToLocalTime(RFQData[0].general[0].rfqEndDate) + "</td></tr>")

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
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

function validateAppsubmitData() {

    var form1 = $('#frmsubmitapp');
    var formC = $('#frmsubmitappComm');
    var formAward = $('#formAwardedsubmit');
    var formFWD = $('#formsubmitadmin');

    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);

    var error2 = $('.alert-danger', formC);
    var success2 = $('.alert-success', formC);
    var errorawd = $('.alert-danger', formAward);
    var successawd = $('.alert-success', formAward);
    var errorFWD = $('.alert-danger', formFWD);
    var successFWD = $('.alert-success', formFWD);
    form1.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {

            txtRemarksApp: {
                required: true,
            }
        },
        messages: {

            txtRemarksApp: {
                required: "Please enter your comment"
            }
        },

        invalidHandler: function (event, validator) {
            success1.hide();
            error1.show();

        },

        highlight: function (element) {
            $(element)
                .closest('.Input-group').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.Input-group').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.Input-group').removeClass('has-error');
        },

        submitHandler: function (form) {

            ApprovalApp();

        }
    });

    formC.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
            ddlActionType: {
                required: true,
            },

            txtRemarksAppC: {
                required: true,
            }
        },
        messages: {
            ddlActionType: {
                required: "Please select Action"
            },

            txtRemarksAppC: {
                required: "Please enter your comment"
            }
        },

        invalidHandler: function (event, validator) {
            success2.hide();
            error2.show();

        },

        highlight: function (element) {
            $(element)
                .closest('.Input-group').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.Input-group').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.Input-group').removeClass('has-error');
        },

        submitHandler: function (form) {

            ApprovalCommercialApp();

        }
    });
    formAward.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {

            txtRemarksAward: {
                required: true,
            },
            drpVendors: {
                required: false
            }
        },
        messages: {

            txtRemarksAward: {
                required: "Please enter your comment"
            },
            drpVendors: {
                required: "Please enter your Vendor"
            }
        },

        invalidHandler: function (event, validator) {
            successawd.hide();
            errorawd.show();
            $('#diverrordiv2').hide();

        },

        highlight: function (element) {
            $(element)
                .closest('.Input-group,.xyz').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.Input-group,.xyz').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.Input-group,.xyz').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {



        }
    });
    formFWD.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {

            txtbidspecification: {
                required: true,
            }
        },
        messages: {

            txtbidspecification: {
                required: "Please enter your comment"
            }
        },

        invalidHandler: function (event, validator) {
            successFWD.hide();
            errorFWD.show();

        },

        highlight: function (element) {
            $(element)
                .closest('.Input-group').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.Input-group').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.Input-group').removeClass('has-error');
        },

        submitHandler: function (form) {

            fnFWDeRFQ();

        }
    });
}
function ApprovalCommercialApp() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvalbyapp = {
        "ApproverType": "C",
        "FromUserId": sessionStorage.getItem('UserID'),
        "Remarks": $('#txtRemarksAppC').val(),
        "RFQID": parseInt(RFQID),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActionType": "Approver",
        "Action": $('#ddlActionType').val(),
        "Vendors": '',
        "AwardQuery": ''
    };


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQCommercialActivity",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(approvalbyapp),
        crossDomain: true,
        dataType: "json",
        success: function () {
            /* bootbox.alert("Transaction Successful..", function () {
                 return true;
                 window.location = "index.html";
                
             });*/
            bootbox.alert("Transaction Successful..").on("shown.bs.modal", setTimeout(function (e) {

                window.location = "index.html";
                return false;
            }, 2000)
            );
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
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
var rowitems = 0
function addmorevendorRemarks() {
    var str = '';

    var form1 = $('#formAwardedsubmit')
    $('#drpVendors').rules('add', {
        required: true,
    });
    $('#txtRemarksAward').rules('add', {
        required: true,
    });
    if (form1.valid() == true) {

        $('#divtableaward').show()
        rowitems = rowitems + 1;
        if (!jQuery("#tblremarksvendorsawared thead").length) {
            jQuery('#tblremarksvendorsawared').append("<thead><tr><th class='bold'>Vendor</th><th class='bold'>Remarks</th><th></th></tr></thead>");
            str = '<tr id=tr' + rowitems + '><td id=vid' + rowitems + ' class=hide>' + $("#drpVendors").val() + '</td><td style="width:20%!important">' + jQuery("#drpVendors option:selected").text() + '</td>';
        }
        else {
            str = '<tr id=tr' + rowitems + '><td id=vid' + rowitems + ' class=hide>' + $("#drpVendors").val() + '</td><td style="width:20%!important">' + jQuery("#drpVendors option:selected").text() + '</td>';
        }
        str += '<td style="width:60%!important">' + jQuery("#txtRemarksAward").val() + '</td><td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteitem(tr' + rowitems + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblremarksvendorsawared').append(str);

        var arr = $("#tblremarksvendorsawared tr");

        $.each(arr, function (i, item) {
            var currIndex = $("#tblremarksvendorsawared tr").eq(i);
            var matchText = currIndex.find("td:eq(0)").text();

            $(this).nextAll().each(function (i, inItem) {
                if (matchText == $(this).find("td:eq(0)").text()) {
                    $(this).remove();
                    $('#diverrordiv2').show()
                    $('#errordiv2').text('Supplier is already selected')
                    $('#diverrordiv2').fadeOut(5000)
                }

            });
        });
        jQuery("#drpVendors").val('')
        jQuery('#txtRemarksAward').val('')


    }
    else {

        form1.validate()
        return false;
    }
}
function deleteitem(rowid) {

    rowitems = rowitems - 1;
    $('#' + rowid.id).remove();

    if ($('#tblremarksvendorsawared tr').length == 1) {
        $('#divtableaward').hide()
    }
    else {
        $('#divtableaward').show()
    }
}
function AwardCommeRFQ() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendors = '';
    var rowCount = jQuery('#tblremarksvendorsawared tr').length;


    if (rowCount > 1) {
        $('#drpVendors').rules('add', {
            required: false,
        });
        $('#txtRemarksAward').rules('add', {
            required: false,
        });
    }
    else {
        if ($('#txtRemarksAward').val() == "" || $('#txtRemarksAward').val() == null) {
            $('#formAwardedsubmit').validate()
            $('#drpVendors').rules('add', {
                required: false,
            });
            $('#txtRemarksAward').rules('add', {
                required: true
            });
        }
    }
    if (rowCount > 1) {
        $("#tblremarksvendorsawared tr:gt(0)").each(function () {
            var this_row = $(this);
            vendors = vendors + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim(this_row.find('td:eq(2)').html()) + '#';

        })
    }
    if ($('#formAwardedsubmit').valid() == true) {
        if ($('#txtRemarksAward').val() != '' && $('#drpVendors').val() != '') {
            $('#diverrordiv2').show()
            $('#errordiv2').text('Your data is not inserted. Please do press "+" button after enter Remarks.')
            $('#diverrordiv2').fadeOut(5000)
            jQuery.unblockUI();

        }
        else {
            var approvalbyapp = {
                "ApproverType": "C",
                "FromUserId": sessionStorage.getItem('UserID'),
                "Remarks": $('#txtRemarksAward').val(),
                "RFQID": parseInt(RFQID),
                "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
                "ActionType": "Award",
                "Action": "Awarded",
                "Vendors": $('#drpVendors').val(),
                "AwardQuery": vendors
            };


            jQuery.ajax({
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQCommercialActivity",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                type: "POST",
                cache: false,
                data: JSON.stringify(approvalbyapp),
                crossDomain: true,
                dataType: "json",
                success: function () {
                    /* bootbox.alert("Transaction Successful..", function () {
                         window.location = "index.html";
                         return false;
                     });*/
                    bootbox.alert("Transaction Successful..").on("shown.bs.modal", setTimeout(function (e) {
                        window.location = "index.html";
                        return false;
                    }, 2000)
                    );

                },
                error: function (xhr, status, error) {

                    var err = xhr.responseText // eval("(" + xhr.responseText + ")");
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
    }
    else {
        $('#formAwardedsubmit').validate()
        jQuery.unblockUI();
        return false;
    }
}
function fnFWDeRFQ() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Approvers = {
        "ApproverType": "C",
        "FromUserId": sessionStorage.getItem('UserID'),
        "Remarks": $('#txtfwdToCommApproverrem').val(),
        "RFQID": parseInt($('#hdnRfqID').val()),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActionType": "Forward",
        "Action": 'Forward',
        "Vendors": '',
        "AwardQuery": ''
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQCommercialActivity",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {

          /*  bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });*/
            bootbox.alert("Transaction Successful..").on("shown.bs.modal", setTimeout(function (e) {

                window.location = "index.html";
                return false;
            }, 2000)
            );



        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
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
function ApprovalApp() {
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvalstatus = "";
    var chkstatus = 'T';
    for (var i = 0; i < Vendor.length; i++) {
        if (!$('input[name=AppRequired' + Vendor[i].vendorID + ']').is(':checked')) {
            chkstatus = 'F'
        }

    }
    var VID = 0;
    if (chkstatus == "T") {
        for (var i = 0; i < Vendor.length; i++) {
            if ($("#AppYes" + Vendor[i].vendorID).is(":checked")) {
                checkedval = $("#AppYes" + Vendor[i].vendorID).val()
            }
            else {
                checkedval = $("#AppNo" + Vendor[i].vendorID).val()

            }
            approvalstatus = approvalstatus + Vendor[i].vendorID + '~' + checkedval + '#';
            VID = Vendor[i].vendorID
        }


        var approvalbyapp = {
            "RFQID": parseInt(RFQID),
            "FromUserId": sessionStorage.getItem("UserID"),
            "ActivityDescription": jQuery("#RFQSubject").text(),
            "Remarks": jQuery("#txtRemarksApp").val(),
            "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
            "ApprovalStatus": approvalstatus,
            "VendorID": parseInt(VID)
           

        };
        
      //  console.log(JSON.stringify(approvalbyapp));
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQAction",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            cache: false,
            data: JSON.stringify(approvalbyapp),
            crossDomain: true,
            dataType: "json",
            success: function (data) {

                /* bootbox.alert("Transaction Successful..", function () {
                     window.location = "index.html";
                     return false;
                 });*/
                bootbox.alert("Transaction Successful..").on("shown.bs.modal", setTimeout(function (e) {
                    window.location = "index.html";
                    return false;
                }, 2000)
                );

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText
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
    else {

        $('.alert-danger').show();
        $('#error').text('Please Approve/Reject checkbox for all vendors.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery.unblockUI();

    }
}