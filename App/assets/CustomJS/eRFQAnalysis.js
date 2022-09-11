

//$(window).bind("scroll", function () {
//    var offset = $(this).scrollTop();
//    var tableOffset = $("#tblRFQComprative").offset().top;
//    var $header = $("#tblRFQComprative > thead").clone();
//    var $fixedHeader = $("#header-fixed").append($header);
//    if (offset >= tableOffset && $fixedHeader.is(":hidden")) {
//        $fixedHeader.show();
//    }
//    else if (offset < tableOffset) {
//        $fixedHeader.hide();

//    }
//});


if (window.location.search) {

    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);

    var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
    var Type = getUrlVarsURL(decryptedstring)["Type"];

    $('#hdnRfqID').val(RFQID);

    var sub = getUrlVarsURL(decryptedstring)["RFQSubject"].replace(/%20/g, ' ');
    if (Type != undefined && Type.toLowerCase() == "aw") {
        $('#btn_commercial').addClass('hide');
    }

    //jQuery("#txtrfirfqsubject").val(sub + ' - ' + RFQID)
    //alert(decodeURIComponent(sub) + ' - ' + RFQID)
    jQuery("#txtrfirfqsubject").val(sub + ' - ' + RFQID)
    fetchReguestforQuotationDetails()
    fetchRFQApproverStatus(RFQID);
    FetchRFQVersion();
    fetchApproverRemarks('C');
    fetchAttachments();
}
function FetchInvitedVendorsForeRFQ() {
    jQuery.ajax({
        //url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchInvitedVendors/?RFQID=" + RFQID + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + '&CustomerID=' + sessionStorage.getItem('CustomerID'),
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchInvitedVendors/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + '&CustomerID=' + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            if (data.length > 0) {
                $('#tblVendorSummary tbody').empty();
                $('#displayVendorTable').show();
                //jQuery('#lbl_configuredBy').html("RFQ Configured By: " + data[0].configuredByName);

                //$('#rq_subject').html('<b>' + data[0].rqSubject + '</b>');
                //$('#rq_deadline').html(fnConverToLocalTime(data[0].deadline))

                //  $('#rq_deadline').html(data[0].deadline);
                //$('#rq_description').html(data[0].rqDescription);
                //$("#deadlineModal").html(fnConverToLocalTime(data[0].deadline));

                for (var i = 0; i < data.length; i++) {

                    $('#tblVendorSummary').append(jQuery('<tr><td class="hide">' + data[i].vendorID + '</td><td>' + data[i].vendorName + ' ( ' + data[i].contactPerson + ' , ' + data[i].vendorEmail + ' , ' + data[i].phoneNo + ' )</td><td>' + data[i].rqStatus + '</td><td>' + fnConverToLocalTime(data[i].responseDate) + '</td><td class=hide>' + data[i].vendorEmail + '</td></tr>')); //<td>' + data[i].ResponseDate + ' - ' + data[i].ResponseTime + '</td>
                    if (data[i].rqStatus.toLowerCase() != 'close' && data[i].rqStatus.toLowerCase != 'regretted') {
                        $('#send_remainder').removeClass('hide')
                    }
                }
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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

sessionStorage.setItem("RFQVersionId", "0")
function getSummary(vendorid, version) {
    var encrypdata = fnencrypt("RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + vendorid + "&max=" + version + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&RFQVersionTxt=" + $("#ddlrfqVersion option:selected").text().replace(' ', '%20'))
    window.open("eRFQReport.html?param=" + encrypdata, "_blank")

}

var Vendor;
function fetchrfqcomprative() {

    sessionStorage.setItem("RFQVersionId", $("#ddlrfqVersion option:selected").val())
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=" + $('#ddlrfqVersion option:selected').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            var str = '';
            var strHead = '';
            var strHeadExcel = '';
            var strExcel = '';

            var totallowestValue = 0;
            var strQ = '';
            var strHeadQ = '';
            var strHeadExcelQ = '';
            var strExcelQ = '';
            var allvendorresponse = 'Y';
            var ShowPrice = 'N'
            var _CurrentDate = new Date();
            var _RFQOpenDate = new Date(bidopeningdate.replace('-', ''));
            debugger;
            if (_rfqBidType != 'Open') {
                if (bidopeningdate != null || bidopeningdate != '') {
                    if (_RFQOpenDate <= _CurrentDate) {
                        ShowPrice = 'Y';
                        $('#btnPDF').show()
                    }
                }
                else {
                    ShowPrice = 'N';
                    $('#btnPDF').hide()
                }
            }
            else {
                ShowPrice = 'Y';
                $('#btnPDF').show()

            }
            sessionStorage.setItem('ShowPrice', ShowPrice);
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
            if (data[0].vendorNames.length > 0) {
                Vendor = data[0].vendorNames;
                $('#displayTable').show();
                $('#btnExport').show()
                $("#btnDownloadFile").show()
                if ($('#hdnUserID').val() == sessionStorage.getItem('UserID')) {
                    $('#cancl_btn').show();
                    //$('#btnDownloadFile').show();

                }
                else {
                    $('#cancl_btn').hide();
                    //$('#btnDownloadFile').hide();
                }
                $('#displayComparativetabs').show();
                //For Printing Header
                strHead = "<tr  style='background: #f5f5f5; color:light black;'><th class='hide'>&nbsp;</th><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th>"
                strHeadExcel = "<tr><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th>"

                strHeadQ = "<tr  style='background:#f5f5f5; color:light black;'><th>Question</th><th>Our Requirement</th>"
                strHeadExcelQ = "<tr><th colspan=4>Question</th><th>Our Requirement</th>"

                for (var i = 0; i < data[0].vendorNames.length; i++) {

                    if (data[0].vendorNames[i].seqNo != 0) {

                        strHead += "<th colspan='4' style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + data[0].vendorNames[i].rfqVersionId + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vendorName; +"</a></th>";
                        strHeadExcel += "<th colspan='4'>" + data[0].vendorNames[i].vendorName; +"</th>";

                        strHeadQ += "<th style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + data[0].vendorNames[i].rfqVersionId + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vName; +"</a></th>";
                        strHeadExcelQ += "<th>" + data[0].vendorNames[i].vName; +"</th>";

                    }
                    else {
                        allvendorresponse = 'N';
                        strHead += "<th colspan='4' style='text-align:center;'>" + data[0].vendorNames[i].vendorName; +"</th>";
                        strHeadExcel += "<th colspan='4'>" + data[0].vendorNames[i].vendorName; +"</th>";

                        strHeadQ += "<th style='text-align:center;'>" + data[0].vendorNames[i].vName; +"</th>";
                        strHeadExcelQ += "<th>" + data[0].vendorNames[i].vName; +"</th>";

                    }
                }
                strHead += "<th>Line-wise Lowest Quote</th><th colspan='5' style='text-align:center;'>Last PO Details</th><th>Delivery Location</th>";
                strHeadExcel += "<th>Line-wise Lowest Quote</th><th colspan='5'>Last PO Details</th><th>Delivery Location</th>";

                strHead += "</tr>"
                strHeadExcel += "</tr>"

                strHeadQ += "</tr>"
                strHeadExcelQ += "</tr>"

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                strHeadExcel += "<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";

                for (var i = 0; i < data[0].vendorNames.length; i++) {

                    if (data[0].vendorNames[i].rfqStatus == 'C') {

                        strHead += "<th colspan='4' style='text-align:center;'>" + fnConverToLocalTime(data[0].vendorNames[i].responseSubmitDT) + "</th>";
                        strHeadExcel += "<th colspan='4'>" + fnConverToLocalTime(data[0].vendorNames[i].responseSubmitDT) + "</th>";

                    }
                    else if (data[0].vendorNames[i].rfqStatus == 'I') {

                        strHead += "<th colspan='4' style='text-align:center;'>Intent To Participate</th>";
                        strHeadExcel += "<th colspan='4'>Intent To Participate</th>";

                    }
                    else {
                        strHead += "<th colspan='4' style='text-align:center;'>Not Started</th>";
                        strHeadExcel += "<th colspan='4'>Not Started</th>";
                    }
                }
                strHead += "<th colspan=7>&nbsp;</th>";
                strHeadExcel += "<th colspan=7>&nbsp;</th>";

                strHead += "</tr>"
                strHeadExcel += "</tr>"

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                strHeadExcel += "<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";

                var taxHRTextinc = stringDivider("Landed Unit Price (With GST)", 18, "<br/>\n");
                var initialtaxHRTextEx = stringDivider("Initial Landed Unit Price (Without GST) - R0  ", 18, "<br/>\n");
                var taxHRTextEx = stringDivider("Landed Unit Price (Without GST)", 18, "<br/>\n");
                var HRAmount = stringDivider("Amount (Inc. GST)", 8, "<br/>\n");
                for (var j = 0; j < data[0].vendorNames.length; j++) {

                    strHead += "<th>" + initialtaxHRTextEx + "</th><th>" + taxHRTextEx + "</th><th>" + taxHRTextinc + "</th><th>" + HRAmount + "</th>";
                    strHeadExcel += "<th>Initial Landed Unit Price (Without GST) - R0</th><th>Landed Unit Price (Without GST)</th><th>Landed Unit Price (With GST)</th><th>Amount (Inc. GST)</th>"

                }
                strHead += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th><th>&nbsp;</th>";
                strHeadExcel += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th><th>&nbsp;</th>";

                strHead += "</tr>";
                strHeadExcel += "</tr>";

                jQuery('#tblRFQComprative > thead').append(strHead);
                jQuery('#tblRFQComprativeForExcel > thead').append(strHeadExcel);

                jQuery('#tblRFQComprativeQ > thead').append(strHeadQ);
                jQuery('#tblRFQComprativeForExcelQ > thead').append(strHeadExcelQ);

                //For Printing Header Ends


                var x = 0;

                for (var i = 0; i < data[0].noofQuotes[0].noofRFQParameter; i++) {


                    var flag = 'T';
                    $("#tblRFQComprativetest > tbody > tr").each(function (index) {
                        var this_row = $(this);

                        if ($.trim(this_row.find('td:eq(2)').html()) == data[0].quotesDetails[i].rfqParameterId) {
                            flag = 'F';

                        }

                    });
                    x = -1;
                    if (flag == 'T') {

                        minprice = 0;
                        str += "<tr><td class='hide'>" + data[0].quotesDetails[i].vendorID + "</td><td>" + (i + 1) + "</td><td class='hide'>" + data[0].quotesDetails[i].rfqParameterId + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].quantity) + "</td><td>" + data[0].quotesDetails[i].uom + "</td>";
                        strExcel += "<tr><td>" + (i + 1) + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td>" + data[0].quotesDetails[i].quantity + "</td><td>" + data[0].quotesDetails[i].uom + "</td>";

                        for (var j = 0; j < data[0].quotesDetails.length; j++) {

                            if ((data[0].quotesDetails[i].rfqParameterId) == (data[0].quotesDetails[j].rfqParameterId)) {// true that means reflect on next vendor
                                x = x + 1;

                                if (data[0].quotesDetails[j].vendorID == data[0].vendorNames[x].vendorID) {

                                    if (ShowPrice == "N" && data[0].quotesDetails[j].initialQuotewithoutGST != 0) {
                                        strExcel += "<td>Quoted</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>Quoted</td>";
                                    }
                                    else {
                                        strExcel += "<td>" + data[0].quotesDetails[j].initialQuotewithoutGST + "</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators(data[0].quotesDetails[j].initialQuotewithoutGST) + "</td>";
                                    }
                                    if (ShowPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>Quoted</td><td>Quoted</td><td>Quoted</td>";
                                        str += "<td class='text-right'>Quoted</td><td class='VendorPriceNoTax text-right'>Quoted</td><td class='VendorPriceWithTax  text-right' >Quoted</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithGST + "</td><td>" + data[0].quotesDetails[j].unitRate + "</td>";
                                        str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithGST + "</td><td>" + data[0].quotesDetails[j].unitRate + "</td>";
                                        str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].unitRate + "</td>";
                                        str += "<td class='text-right' id=unitrate" + i + x + " style='color: red!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }


                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithGST + "</td><td>" + data[0].quotesDetails[j].unitRate + "</td>";
                                        str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].unitRate == -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST == -1) {
                                        str += "<td colspan=3  style='color: blue!important; text-align: center;' >Not Invited</td>";
                                        strExcel += "<td colspan=3 >Not Invited </td>";
                                    }
                                    else if (data[0].quotesDetails[j].unitRate == -2 && data[0].quotesDetails[j].rfqVendorPricewithoutGST == -2) {
                                        str += "<td colspan=3  style='color: red!important; text-align: center;' >Regretted</td>";
                                        strExcel += "<td colspan=3 >Regretted </td>";
                                    }
                                    else {

                                        str += "<td colspan=3  style='color: red!important; text-align: center;' >Not Quoted</td>";
                                        strExcel += "<td colspan=3 >Not Quoted </td>";

                                    }



                                }



                            }

                        }
                        totallowestValue = totallowestValue + (data[0].quotesDetails[i].quantity * data[0].quotesDetails[i].lowestPriceValue)

                        if (ShowPrice == 'Y' || totallowestValue == 0) {

                            str += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poUnitRate) + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                            strExcel += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + (data[0].quotesDetails[i].poUnitRate) + "</td><td>" + (data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        }
                        else {
                            if (totallowestValue != 0) {
                                totallowestValue = "Quoted";
                                str += "<td class=text-right>Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poUnitRate) + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                                strExcel += "<td class=text-right>Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + (data[0].quotesDetails[i].poUnitRate) + "</td><td>" + (data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                            }
                        }
                        str += "</tr>"
                        strExcel += "</tr>"

                        jQuery('#tblRFQComprativetest').append(str);

                    }

                }

                str += "<tr><td colspan=5 style='text-align:center;'><b>Total</b></td>";
                strExcel += "<tr><td colspan=5><b>Total</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        if (ShowPrice == 'Y') {
                            RFQFetchTotalPriceForReport(data[0].vendorNames[k].vendorID, k)
                            str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                            strExcel += "<td id=totBoxinitialwithoutgstExcel" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxwithgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxTaxExcel" + data[0].vendorNames[k].vendorID + "></td>";
                        }
                        else {
                            str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td>";
                            strExcel += "<td id=totBoxinitialwithoutgstExcel" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxwithoutgstExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td><td id=totBoxwithgstExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td><td id=totBoxTaxExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td>";
                        }
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }

                }
                if (ShowPrice == "Y" || totallowestValue == 0) {
                    str += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";
                    strExcel += "<td>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";
                }
                else {
                    if (totallowestValue != 0) {
                        str += "<td class=text-right>Quoted</td><td colspan=6>&nbsp;</td></tr>";
                        strExcel += "<td>Quoted</td><td colspan=6>&nbsp;</td></tr>";
                    }
                }



                //For Loading Factor
                str += "<tr><td colspan=3 style='text-align:center;'><b>Loading Factor</b></td><td colspan=2 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=3 ><b>Loading Factor</b></td><td colspan=2 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            var p = thousands_separators(data[0].loadedFactor[k].loadedFactor + data[0].loadedFactor[k].sumwithGST);
                            if (p != 0) {
                                if (ShowPrice == 'Y') {
                                    str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                                    strExcel += "<td id=LFactorexcel" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td id=LoadingFexcel" + data[0].vendorNames[k].vendorID + ">" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                                }
                                else {
                                    str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>Quoted</td><td>&nbsp;</td><td>&nbsp;</td>";
                                    strExcel += "<td id=LFactorexcel" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td id=LoadingFexcel" + data[0].vendorNames[k].vendorID + ">Quoted</td><td>&nbsp;</td><td>&nbsp;</td>";
                                }
                            }
                            else {

                                str += "<td colspan=4>&nbsp;</td>";
                                strExcel += "<td colspan=4>&nbsp;</td>";
                            }

                        }


                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";
                strExcel += "<td colspan=7>&nbsp;</td></tr>";

                //For Loading Factor reason Row
                str += "<tr><td colspan=5 style='text-align:center;'><b>Loading Reason</b></td>";
                strExcel += "<tr><td colspan=5 ><b>Loading Reason</b></td>";
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            if (data[0].loadedFactor[k].loadingFactorReason != '') {
                                str += "<td style='text-align:left;' colspan=4 id=LoadingReason" + data[0].vendorNames[k].vendorID + ">" + data[0].loadedFactor[k].loadingFactorReason + "</td>";
                                strExcel += "<td colspan=4 id=LoadingReasonexcel" + data[0].vendorNames[k].vendorID + ">" + data[0].loadedFactor[k].loadingFactorReason + "</td>";
                            }
                            else {

                                str += "<td colspan=4>&nbsp;</td>";
                                strExcel += "<td colspan=4>&nbsp;</td>";
                            }

                        }


                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";
                strExcel += "<td colspan=7>&nbsp;</td></tr>";

                ////For Commercial Rank
                str += "<tr><td colspan=5 style='text-align:center;'><b>Commercial Rank (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=5 ><b>Commercial Rank (Without GST)</b></td>";
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].lStatus.length; k++) {

                        if (data[0].lStatus[k].vendorID == data[0].vendorNames[l].vendorID) {
                            if (ShowPrice == "Y") {
                                if (data[0].lStatus[k].status != 'N/A') {
                                    str += "<td colspan=4 style='text-align:center;color: blue!important;'>" + data[0].lStatus[l].status + "</td>";
                                    strExcel += "<td colspan=4>" + data[0].lStatus[l].status + "</td>";
                                }
                                else {
                                    str += "<td colspan=4 style='text-align:center;color: red!important;'>" + data[0].lStatus[k].status + "</td>";
                                    strExcel += "<td colspan=4>" + data[0].lStatus[k].status + "</td>";
                                }
                            }
                            else {
                                if (data[0].lStatus[k].status == 'N/A') {
                                    str += "<td colspan=4 style='text-align:center;color: red!important;'>" + data[0].lStatus[k].status + "</td>";
                                    strExcel += "<td colspan=4>" + data[0].lStatus[k].status + "</td>";
                                }
                                else {
                                    str += "<td colspan=4 style='text-align:center;color: black!important;'>Quoted</td>";
                                    strExcel += "<td colspan=4>Quoted</td>";

                                }
                            }

                        }

                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";
                strExcel += "<td colspan=7>&nbsp;</td></tr>";

                ////For L1 Package
                str += "<tr><td colspan=5 style='text-align:center;'><b>L1 Package</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=5 ><b>L1 Package</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        if (ShowPrice == 'Y') {
                            RFQFetchL1Package(data[0].vendorNames[k].vendorID, k)
                            str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                            strExcel += "<td>&nbsp;</td><td id=withoutGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=withGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totL1RankExcel" + data[0].vendorNames[k].vendorID + "></td>";
                        }
                        else {
                            str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td>";
                            strExcel += "<td>&nbsp;</td><td id=withoutGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=withGSTL1RankExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td><td id=totL1RankExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td>";
                        }
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }

                }
                str += "<td colspan=7>&nbsp;</td></tr>";
                strExcel += "<td colspan=7>&nbsp;</td></tr>";

                ////For Blank Row
                str += "<tr>";
                strExcel += " <tr>";
                var t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {
                    t = k;
                }

                str += "<td colspan=" + (t + 10) + ">&nbsp;</td></tr>";
                strExcel += "<td colspan=" + (t + 10) + ">&nbsp;</td></tr>";

                //////For Commercial Header Row
                ////// ***************** Start  Commercial Row
                if (data[0].commercialTerms.length > 0) {

                    str += "<tr style='background: #f5f5f5; color:light black;'>";
                    strExcel += " <tr>";
                    str += "<td><b>SrNo</b></td><td colspan=4><b>Other Commercial Terms</b></td>";
                    strExcel += "<td>SrNo</td><td colspan=4><b>Other Commercial Terms</b></td>";
                    for (var k = 0; k < data[0].vendorNames.length; k++) {

                        if (data[0].vendorNames[k].seqNo != '0') {

                            str += "<td colspan=4 style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[k].vendorID + "'\,\'" + data[0].vendorNames[k].rfqVersionId + "'\)  style='color:#2474f6; text-decoration:underline;'><b>" + data[0].vendorNames[k].vName + "<b></a></td>";
                            strExcel += "<td colspan=4 ><b>" + data[0].vendorNames[k].vName; +"</b></td>";

                        }
                        else {
                            str += "<td colspan=4 style='text-align:center;'><b>" + data[0].vendorNames[k].vName; +"</b></td>";
                            strExcel += "<td colspan=4><b>" + data[0].vendorNames[k].vName; +"</b></td>";

                        }

                    }
                    str += "<td colspan=7><b>Our Requirement</b></td></tr>";
                    strExcel += "<td colspan=7><b>Our Requirement</b></td></tr>";

                    $('#tblRFQComprativetest > tbody').empty(); // clear again for comparision of Commercial

                    //For  Commercial table 
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
                            strExcel += "<tr><td>" + (p + 1) + "</td><td colspan=4>" + data[0].commercialTerms[p].termName + "</td>";

                            for (var s = 0; s < data[0].commercialTerms.length; s++) {

                                if ((data[0].commercialTerms[p].rfqtcid) == (data[0].commercialTerms[s].rfqtcid)) {// true that means reflect on next vendor

                                    //  q = q + 1;
                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].commercialTerms[s].vendorID == data[0].vendorNames[q].vendorID) {

                                            if (data[0].commercialTerms[s].remarks != '' && data[0].commercialTerms[s].remarks != 'Rejected') {
                                                str += "<td colspan=4>" + data[0].commercialTerms[s].remarks + "</td>";
                                                strExcel += "<td colspan=4>" + data[0].commercialTerms[s].remarks + "</td>";

                                            }
                                            else if (data[0].commercialTerms[s].remarks == 'Rejected') {
                                                str += "<td colspan=4 style='color: red!important; text-align: center;'>Regretted</td>";
                                                strExcel += "<td colspan=4>Regretted</td>";

                                            }
                                            else {
                                                str += "<td colspan=4  style='color: red!important; text-align: center;' >Not Quoted</td>";
                                                strExcel += "<td colspan=4 >Not Quoted </td>";
                                            }

                                        }

                                    }
                                }
                            }
                            str += "<td colspan=7>" + data[0].commercialTerms[p].requirement + "</td>";
                            strExcel += "<td colspan=7>" + data[0].commercialTerms[p].requirement + "</td>";

                            str += " </tr>";
                            strExcel += " </tr>";
                            jQuery('#tblRFQComprativetest').append(str);
                        }
                    }
                }

                //////// ***************** End  Commercial Row



                //////For Vendor Comments

                str += "<tr><td colspan=5><b>Vendor Remarks :</b></td>";
                strExcel += "<tr><td colspan=5><b>Vendor Remarks :</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {

                    if (data[0].vendorNames[k].vendorRemarks != "") {
                        var VRemarks = stringDivider(data[0].vendorNames[k].vendorRemarks, 40, "<br/>\n");
                        str += "<td colspan='4' class='text-left' >" + VRemarks + "</td>";
                        strExcel += "<td colspan='4' >" + VRemarks + "</td>";
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }
                }
                str += "<td colspan=7>&nbsp;</td>";
                strExcel += "<td colspan=7>&nbsp;</td>";
                str += " </tr>";
                strExcel += " </tr>";

                ////////For Qusetion table
                //////// ***************** Start  Answer Question Row
                if (data[0].questions.length > 0) {

                    $('#tblRFQComprativetestQ > tbody').empty(); // clear again for comparision of Question
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
                            strExcelQ += "<tr><td colspan=4>" + data[0].questions[p].question + "</td><td>" + data[0].questions[p].requirement + "</td>";

                            for (var s = 0; s < data[0].questions.length; s++) {

                                if ((data[0].questions[p].questionID) == (data[0].questions[s].questionID)) {// true that means reflect on next vendor

                                    //  q = q + 1;
                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].questions[s].vendorID == data[0].vendorNames[q].vendorID) {
                                            var attachQA = data[0].questions[s].attachementQA;

                                            if (data[0].questions[s].answer != '' && data[0].questions[s].answer != 'Rejected') {
                                                //strQ += "<td>" + data[0].questions[s].answer + "</td>";
                                                strQ += '<td >' + data[0].questions[s].answer + '<br>  <a id=eRFQVFilesques' + s + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[0].questions[s].vendorID + ')>' + attachQA + '</a> </td>';
                                                strExcelQ += "<td>" + data[0].questions[s].answer + "</td>";

                                            }
                                            else if (data[0].questions[s].answer == 'Rejected') {
                                                strQ += "<td  style='color: red!important; text-align: center;'>Regretted</td>"
                                                strExcelQ += "<td>Regretted</td>";

                                            }
                                            else {
                                                strQ += "<td  style='color: red!important; text-align: center;' >Not Quoted</td>";
                                                strExcelQ += "<td >Not Quoted </td>";
                                            }

                                        }

                                    }
                                }
                            }


                            strQ += " </tr>";
                            strExcelQ += " </tr>";
                            jQuery('#tblRFQComprativetestQ').append(strQ);

                        }
                    }
                }
                else {
                    strQ += "<tr>";
                    strExcelQ += " <tr><td>&nbsp;</td>";
                    t = 0;
                    for (var k = 1; k <= data[0].vendorNames.length; k++) {

                        t = k;

                    }
                    strQ += "<td colspan=" + (t + 2) + ">No Questions Mapped</td>";
                    strExcelQ += "<td colspan=" + (t + 2) + ">No Questions Mapped</td>";
                    strQ += "</tr>";
                    strExcelQ += "</tr>";
                }
                ////////// ***************** END  Answer Question Row
                ////////// ***************** Start  Define Technical  Approver Row**********************
                strQ += " <tr><td><b>Technical Approval Required</b></td>";

                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {

                    t = k;

                }

                if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "afterrfq") {
                    strQ += "<td>After All RFQ Responses</td>"
                    strQ += '<td colspan=' + (t + 2) + '><a href="javascript:;" class="btn btn-xs yellow" id=btn_techmapaaprover onclick="fnForwardforAllvendorTechnical()"> Technical Approval</a></td>';

                    //if (allvendorresponse == 'Y') {
                    //    $('#btn_techmapaaprover').attr('disabled', 'disabled')
                    //}
                    //else {
                    //    $('#btn_techmapaaprover').removeAttr('disabled')
                    //}
                }
                else if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "rfq") {
                    strQ += "<td colspan=" + (t + 2) + ">With individual RFQ Response</td>"
                }
                else {
                    strQ += "<td colspan=" + (t + 2) + ">Not Required</td>"
                }

                strQ += "</tr>";

                ////////// ***************** END  Define Technical  Row **********************
                ////////// ***************** Start  Technical Approver Row**********************

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
                            strExcelQ += "<tr><td>" + data[0].approverStatus[p].approverName + "</td><td>" + ((data[0].approverStatus[p].remarks).replaceAll("&lt;", "<")).replaceAll("&gt;", ">") + "</td>";

                            for (var s = 0; s < data[0].approverStatus.length; s++) {

                                if ((data[0].approverStatus[p].approverID) == (data[0].approverStatus[s].approverID)) {// true that means reflect on next vendor

                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].approverStatus[s].vendorID == data[0].vendorNames[q].vendorID) {

                                            if (data[0].approverStatus[s].status == 'Approved') {
                                                strQ += "<td style='color: green!important; text-align: center;'>" + data[0].approverStatus[s].status + "</td>";
                                                strExcelQ += "<td>" + data[0].approverStatus[s].Status + "</td>";

                                            }
                                            else if (data[0].approverStatus[s].status == 'Rejected') {
                                                strQ += "<td style='color: red!important; text-align: center;'>Not Approved</td>";
                                                strExcelQ += "<td>Not Approved</td>";

                                            }
                                            else if (data[0].approverStatus[s].status == 'Pending') {
                                                strQ += "<td style='color: blue!important; text-align: center;'>Pending</td>";
                                                strExcelQ += "<td>Pending</td>";

                                            }

                                        }
                                    }
                                }
                            }


                            strQ += " </tr>";
                            strExcelQ += " </tr>";
                            jQuery('#tblRFQComprativetestQ').append(strQ);

                        }

                    }

                }
                //  }
                //////// ***************** END  Technical Approver Row

                ////      //For Blank Row after question table 
                strQ += "<tr>";
                strExcelQ += " <tr><td>&nbsp;</td>";
                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {

                    t = k;

                }
                strQ += "<td colspan=" + (t + 2) + ">&nbsp;</td>";
                strExcelQ += "<td colspan=" + (t + 2) + ">&nbsp;</td>";
                strQ += "</tr>";
                strExcelQ += "</tr>";

                //** Add row Reinvitation Remarks & status
                if ($("#ddlrfqVersion option:selected").val() != 0) {
                    str += "<tr id='reinvitationTRRem'><td colspan=5><b>Re-Invitation Remarks</b></td>";
                    strExcel += "<tr><td colspan=5><b>Re-Invitation Remarks</b></td>";
                    for (var k = 0; k < data[0].vendorNames.length; k++) {

                        if (data[0].vendorNames[k].reInvitedRemarks != "") {
                            var reinvitedRemarks = stringDivider(data[0].vendorNames[k].reInvitedRemarks, 40, "<br/>\n");
                            str += "<td colspan='4' class='text-center' >" + reinvitedRemarks + "</td>";
                            strExcel += "<td colspan='4' >" + reinvitedRemarks + "</td>";
                        }
                        else {
                            str += "<td colspan=4>&nbsp;</td>";
                            strExcel += "<td colspan=4>&nbsp;</td>";
                        }
                    }
                    str += "<td colspan='7'>&nbsp;</td>";
                    str += " </tr>";
                    strExcel += "<td colspan='7'>&nbsp;</td>";
                    strExcel += " </tr>";
                }


                if ($("#ddlrfqVersion option:selected").val() != 99) {
                    //For ReInvite Row
                    var maxValue = -1;
                    $("#ddlrfqVersion option").each(function () {
                        var thisVal = $(this).val();

                        if (maxValue < thisVal && thisVal != 99) {
                            maxValue = thisVal;
                        }

                        if ($("#ddlrfqVersion option:selected").val() == maxValue) {
                            reInvited = 'Y'
                        }
                    });
                    if (maxValue == $("#ddlrfqVersion option:selected").val()) {
                        $("#btn-reInvite").removeClass('hide')
                        str += "<tr id='reinvitationTR'><td colspan=5><b>Re-Invitation Row</b></td>";

                        for (var k = 0; k < data[0].vendorNames.length; k++) {

                            //if (maxValue == $("#ddlrfqVersion option:selected").val()) {
                            // $("#btn-reInvite").attr('disabled', false)
                            //$("#btn-reInvite").removeClass('hide')
                            str += "<td colspan='4' class='text-center'><label class='checkbox-inline'><input type='checkbox' class='chkReinvitation' style='position:relative;margin-right:5px;' value=" + data[0].vendorNames[k].vendorID + " />Re-Invite Vendor For Fresh Quote</label></td>"; //<a class='btn green'>Re-Invite Vendor</a>
                            //}
                            // else {

                            //$("#btn-reInvite").attr('disabled', true);
                            // $("#btn-reInvite").addClass('hide')

                            //str += "<td colspan=4>&nbsp;</td>";
                            //}


                        }
                        str += "<td colspan='7'>&nbsp;</td>";
                        str += " </tr>";
                    }
                    else {
                        $("#btn-reInvite").addClass('hide')
                    }
                }
                else {
                    $("#btn-reInvite").addClass('hide')
                }
                jQuery('#tblRFQComprative').append(str);
                jQuery("#tblRFQComprativeForExcel").append(strExcel);

                jQuery('#tblRFQComprativeQ').append(strQ);
                jQuery("#tblRFQComprativeForExcelQ").append(strExcelQ);


                if ($("#ddlrfqVersion option:selected").val() == 99) {
                    $("#btn_commercial").removeClass('hide');
                    $("#btn_techmapaaprover").addClass('hide');
                    $(".lambdafactor").addClass('hide');

                }
                else {
                    $("#btn_commercial").addClass('hide');
                    if ($("#ddlrfqVersion option:selected").val() == '0') {
                        $("#btn_techmapaaprover").show()
                    }
                    else {
                        $("#btn_techmapaaprover").hide()
                    }
                }

                //** check if RFQ is awarded then commercial button hidden
                if (Type != undefined && Type.toLowerCase() == "aw") {
                    $("#btn_commercial").addClass('hide');
                }


                //** check if commercial approval initiated
                if (data[0].commApprover[0].isFwdCommApp == "Y") {
                    $('#btn_commercial').attr('disabled', 'disabled')
                    $('#btn_commercial').text('Approval Pending')
                }
                else {
                    $('#btn_commercial').removeAttr('disabled')
                    $('#btn_commercial').text('Commercial Approval')
                }

                //** check if technical approval initiated
                if (data[0].techApprover[0].isFwdTechApp == "Y" && TechnicalApproval.toLowerCase() == "rfq") { //|| allvendorresponse=='N'
                    $('#btn_techmapaaprover').attr('disabled', 'disabled')
                    //if (data[0].techApprover[0].isFwdTechApp == "Y") {
                    $('#btn_techmapaaprover').text('Tech Approval Pending')
                    $('#btn_commercial').hide();
                    //}
                }
                else if (data[0].techApprover[0].isFwdTechApp == "C" && TechnicalApproval.toLowerCase() == "rfq") {
                    $('#btn_commercial').show();
                    $('#btn_techmapaaprover').attr('disabled', 'disabled')
                    $('#btn_techmapaaprover').text('Technical Approved')
                }
                else if (data[0].techApprover[0].isFwdTechApp == "N" && TechnicalApproval.toLowerCase() == "rfq") {
                    $('#btn_commercial').hide();
                    $('#btn_techmapaaprover').removeAttr('disabled')
                    $('#btn_techmapaaprover').text('Technical Approval')
                }
                else if (data[0].techApprover[0].isFwdTechApp == "Y" && TechnicalApproval.toLowerCase() != "rfq") { //|| allvendorresponse=='N'
                    $('#btn_techmapaaprover').attr('disabled', 'disabled')
                    $('#btn_techmapaaprover').text('Tech Approval Pending')
                    $('#btn_commercial').show();

                }
                else {
                    $('#btn_commercial').show();
                    $('#btn_techmapaaprover').removeAttr('disabled')
                    $('#btn_techmapaaprover').text('Technical Approval')
                }
                if (ShowPrice == "N") {
                    $('#btn_commercial').hide();
                }
                else {
                    $('#btn_commercial').show();
                }
            }
            else {

                $('#displayTable').show();
                $('#displayComparativetabs').show();
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo('#tblRFQComprative');
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo("#tblRFQComprativeForExcel")

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spnerror', '');
            }
            jQuery.unblockUI();
            return false;

        }

    });

    jQuery.unblockUI();

}


//function fncheckradiotext() {
//    var flagMapApprover = 'F';
//    $("input[type='radio']:checked").each(function () {
//        var idVal = $(this).attr("id");

//        if($("span[for='" + idVal + "']").text() == "Yes")
//        {
//            flagMapApprover = 'T';
//        }

//    });

//    if (flagMapApprover == "T") {
//        $('#btn_mapaaprover').removeAttr('disabled')
//    }
//    else {
//        $('#btn_mapaaprover').attr('disabled','disabled')
//    }
//}

var form = $('#RFIRFQREport');
var formApprover = $('#frmMapApprover');
var formCommApprover = $('#frmcommMapApprover');
function formvalidate() {

    form.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

        errorElement: 'span', //default input error message container

        errorClass: 'help-block help-block-error', // default input error message class

        focusInvalid: false, // do not focus the last invalid input

        rules: {

            txtrfirfqsubject: {
                required: true
            }

        },

        messages: {

        },



        invalidHandler: function (event, validator) {

        },

        highlight: function (element) {

            $(element).closest('.form-group').addClass('has-error');

        },

        unhighlight: function (element) {

            $(element).closest('.form-group').removeClass('has-error');

        },

        success: function (label) {


        },
        submitHandler: function (form) {

            if ($('#hdnRfiRfqID').val() == "0") {
                gritternotification('Please Select RFQ properly!!!')
            }
            else {

                fetchReguestforQuotationDetails();
                if (sessionStorage.getItem('CustomerID') == "32") {
                    fetchRFQPPCApproverStatus($('#hdnRfqID').val());
                }
                else {
                    fetchRFQApproverStatus($('#hdnRfqID').val());
                }
                fetchAttachments();
                fetchApproverRemarks('C');
                setTimeout(function () {
                    fetchrfqcomprative();
                    FetchInvitedVendorsForeRFQ();
                }, 400)

            }
        }

    });

    $("#frmReInvite").validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

        errorElement: 'span', //default input error message container

        errorClass: 'help-block help-block-error', // default input error message class

        focusInvalid: false, // do not focus the last invalid input

        rules: {

            txtextendDate: {
                required: true
            }

        },

        messages: {

        },



        invalidHandler: function (event, validator) {

        },

        highlight: function (element) {

            $(element).closest('.col-md-8').addClass('has-error');

        },

        unhighlight: function (element) {

            $(element).closest('.col-md-8').removeClass('has-error');

        },
        errorPlacement: function (error, element) {

            if (element.attr("name") == "txtextendDate") {

                error.insertAfter("#daterr");

            }
            else {

                error.insertAfter(element);
            }
        },
        success: function (label) {


        },
        submitHandler: function (form) {
            ReInviteVendorsForRFQ();
        }

    });

    // Forward to Commercial Approver Validation
    formCommApprover.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtfwdToCommApproverrem: {
                required: true
            }
        },

        messages: {

        },

        invalidHandler: function (event, validator) {
        },

        highlight: function (element) {
            $(element).closest('.col-md-9').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.col-md-9').removeClass('has-error');

        },
        errorPlacement: function (error, element) {

        },
        success: function (label) {
        },
        submitHandler: function (form) {
            fnSendActivityToCommercial();
        }

    });
    //Form Validation for Cancel Reason
    var form1 = $('#frmRemarksCancel');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);
    form1.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
            txtRemarks: {
                required: true,
                maxlength: 2000
            }
        },
        messages: {
            txtRemarks: {
                required: "Please enter Cancel Reason."
            }
        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
            // success1.hide();
            // error1.show();
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.col-md-10').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-md-10').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label
                .closest('.col-md-10').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {
            cancelBtnclick();

        }
    });
    //Form Validation for Cancel Reason
    var formaddcommapprover = $('#frmRFQApprover');
    var errorapp = $('.alert-danger', formaddcommapprover);
    var successapp = $('.alert-success', formaddcommapprover);
    formaddcommapprover.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {

        },
        messages: {

        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.col-md-10').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-md-10').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label
                .closest('.col-md-10').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {
            if (sessionStorage.getItem('hdnRFQApproverID') != "0" && jQuery("#txtApproverRFQ").val() != "") {

                $('.alert-danger').show();
                $('#spandangerapp').html('Approver not selected. Please press + Button after selecting Approver');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                return false;
            }
            else if ($('#tblRFQapprovers >tbody >tr').length == 0) {
                $('.alert-danger').show();
                $('#spandangerapp').html('Please Map Approver.');
                $('.alert-danger').fadeOut(5000);
                return false;

            }
            else {
                MapRFQapprover('Report');
            }


        }
    });
}
function DownloadFileVendor(aID, vId) {
    var version = 0;
    if (sessionStorage.getItem('RFQVersionId') == "99") {
        version = max;
    }
    else {
        version = sessionStorage.getItem('RFQVersionId');
    }
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val() + '/' + vId + '/' + version);
}

function fnSendActivityToCommercial() {
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
    console.log(JSON.stringify(Approvers))
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
            //if (data.length > 0) {

            //if (data == "1") {
            $('#msgSuccesscommApp').show();
            $('#msgSuccesscommApp').html('RFQ Sent to Commercial Approver successfully!');
            Metronic.scrollTo($('#msgSuccesscommApp'), -200);
            $('#msgSuccesscommApp').fadeOut(7000);
            $('#txtfwdToCommApproverrem').val('')
            $('#btn_commercial').attr('disabled', 'disabled')
            $("#btn_commercial").addClass('hide');
            jQuery.unblockUI();
            setTimeout(function () {
                $("#FwdCommercialApprover").modal('hide');
                fetchrfqcomprative();
                FetchInvitedVendorsForeRFQ();
            }, 1000)
            // }
            // }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spnerror', '');
            }
            jQuery.unblockUI();
            return false;

        }
    });
}
function CloseForwardpopup() {
    $('#FwdCommercialApprover').modal('hide')
}
//var rowApp = 0;
//function addApprovers() {
//    var status = "true"; var Apptype = ''
//    $("#tblapprovers tr:gt(0)").each(function () {
//        var this_row = $(this);
//        if ($.trim(this_row.find('td:eq(0)').html()) == $('#hdnApproverID').val()) {
//            status = "false"
//        }
//    });
//    if ($('#hdnApproverID').val() == "0" || jQuery("#txtApprover").val() == "") {
//        $('.alert-danger').show();
//        $('#spandanger').html('Please Select Approver Properly');
//        Metronic.scrollTo($(".alert-danger"), -200);
//        $('.alert-danger').fadeOut(7000);
//        jQuery("#txtApprover").val('')
//        jQuery("#hdnApproverID").val('0')
//        return false;
//    }
//    else if (status == "false") {
//        $('.alert-danger').show();
//        $('#spandanger').html('Technical Approver is already mapped for this RFQ.');
//        Metronic.scrollTo($(".alert-danger"), -200);
//        $('.alert-danger').fadeOut(7000);
//        jQuery("#txtApprover").val('')
//        jQuery("#hdnApproverID").val('0')
//        return false;
//    }
//    else {
//        rowApp = rowApp + 1;
//        if ($('#drp_ShowPrice').val() == "Y") {

//            Apptype = 'Yes';
//        }
//        else {
//            Apptype = 'No';
//        }

//        if (!jQuery("#tblapprovers thead").length) {
//            jQuery("#tblapprovers").append("<thead><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:30%!important'>Show Price</th><th class='bold' style='width:30%!important'>Sequence</th></thead>");
//            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td class=hide>' + $('#hdnApproverID').val() + '</td><td class=hide>' + $('#drp_ShowPrice').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApprover").val() + '</td><td>' + $('#hdnAppEmailIDID').val() + '</td><td class=hide>' + Apptype + '</td><td>' + $('#drp_ShowPrice').val() + '</td><td>' + rowApp + '</td></tr>');
//        }
//        else {
//            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td class=hide>' + $('#hdnApproverID').val() + '</td><td class=hide>' + $('#drp_ShowPrice').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApprover").val() + '</td><td>' + $('#hdnAppEmailIDID').val() + '</td><td class=hide>' + Apptype + '</td><td>' + $('#drp_ShowPrice').val() + '</td><td>' + rowApp + '</td></tr>');
//        }

//        if (jQuery('#tblapprovers tr').length == 1) {
//            jQuery('#btnTechSubmit').attr("disabled", "disabled");
//        }
//        else {
//            jQuery('#btnTechSubmit').removeAttr("disabled");
//        }
//        jQuery("#txtApprover").val('')
//        jQuery("#drp_ShowPrice").val('N')
//        jQuery("#hdnApproverID").val('0')

//    }
//}
//function deleteApprow(approwid) {
//    rowApp = rowApp - 1;
//    $('#' + approwid.id).remove()

//    if (jQuery('#tblapprovers tr').length == 1) {
//        jQuery('#btnTechSubmit').attr("disabled", "disabled");
//    }
//    else {
//        jQuery('#btnTechSubmit').removeAttr("disabled");
//    }
//}





//$("#MapTechnicalApprover").on("hidden.bs.modal", function () {
//    jQuery("#txtApprover").val('')
//    $('#hdnApproverID').val('0')
//    $('#hdnAppEmailIDID').val('')
//    $('#drp_ShowPrice').val('N')
//    $("#AppYes").attr('disabled', 'disabled')
//    $("#AppNo").attr('disabled', 'disabled')
//});

//function fnUpdateApproverFlag() {
//    var Querystring = '';
//    var checkedval = '';


//        if ($("#AppYes").is(":checked")) {
//            checkedval = $("#AppYes").val()

//        }
//        else {
//            checkedval = $("#AppNo").val()

//        }

//        Querystring = Querystring + "Update PE.eRFQVendorDetails set IsApproverRequired='" + checkedval + "' where  RFQID=" + $('#hdnRfqID').val() + ";";//VendorID=" + Vendor[i].VendorID + " and
//        var Attachments = {
//            "RFQId": parseInt($('#hdnRfqID').val()),
//            "QueryString": Querystring

//        }

//    jQuery.ajax({
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        url: sessionStorage.getItem("APIPath") + "eRFQReport/eUpdateApproverRequiredNot",
//        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
//        crossDomain: true,
//        async: false,
//        data: JSON.stringify(Attachments),
//        dataType: "json",
//        success: function (data) {
//            return true;

//        },
//        error: function (xhr, status, error) {

//            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
//            if (xhr.status == 401) {
//                error401Messagebox(err.Message);
//            }
//            else {
//                fnErrorMessageText('spnerror', '');
//            }
//            jQuery.unblockUI();
//            return false;

//        }
//        });
//}


