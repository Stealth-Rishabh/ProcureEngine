jQuery(document).ready(function () {

    var $table = $('#tblRFQComprative');
    $table.floatThead({
        position: 'fixed'
    });
    Pageloaded()
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

    fetchRFIRFQSubjectforReport('RFQ')
    formvalidate();
    ComponentsPickers.init();
    fetchMenuItemsFromSession(7, 44);
    fetchRegisterUser();

});

var _rfqBidType = sessionStorage.getItem("RFQBIDType");
var _openQuotes = sessionStorage.getItem("OpenQuotes");

if (window.location.search) {
    
    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);

    var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
    var Type = getUrlVarsURL(decryptedstring)["Type"];

    $('#hdnRfqID').val(RFQID);

    var sub = getUrlVarsURL(decryptedstring)["RFQSubject"].replace(/%20/g, ' ').replace(/%2F/g, '/');
    if (Type != undefined && Type.toLowerCase() == "aw") {
        $('#btn_commercial').addClass('hide');
    }
    
    jQuery("#txtrfirfqsubject").val(sub + ' - ' + RFQID)
    fetchReguestforQuotationDetails()
    fetchRFQApproverStatus(RFQID);
    FetchRFQVersion();
    fetchApproverRemarks('C');
    fetchAttachments();
}
function FetchInvitedVendorsForeRFQ() {

    var verId = parseInt($('#ddlrfqVersion').val());
    jQuery.ajax({
        //url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchInvitedVendors/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + '&CustomerID=' + sessionStorage.getItem('CustomerID'),
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchInvitedVendors/?RFQID=" + $('#hdnRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            if (data.length > 0) {
                $('#tblVendorSummary tbody').empty();
                $('#displayVendorTable').show();

                for (var i = 0; i < data.length; i++) {
                    var _displayDate = ''
                    if (data[i].rqStatus == 'In process' || data[i].rqStatus == 'Intent to participate') {
                        _displayDate = '..';
                    }
                    else {
                        _displayDate = fnConverToLocalTime(data[i].responseDate);
                    }

                    $('#tblVendorSummary').append(jQuery('<tr><td class="hide">' + data[i].vendorID + '</td><td>' + data[i].vendorName + ' ( ' + data[i].contactPerson + ' , ' + data[i].vendorEmail + ' , ' + data[i].phoneNo + ' )</td><td>' + data[i].rqStatus + '</td><td>' + _displayDate + '</td><td class=hide>' + data[i].vendorEmail + '</td></tr>')); //<td>' + data[i].ResponseDate + ' - ' + data[i].ResponseTime + '</td>
                    if (data[i].rqStatus.toLowerCase() != 'close' && data[i].rqStatus.toLowerCase != 'regretted') {
                        $('#send_remainder').removeClass('hide')
                    }
                }
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

sessionStorage.setItem("RFQVersionId", "0")
function getSummary(vendorid, version) {
    var encrypdata = fnencrypt("RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + vendorid + "&max=" + version + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&RFQVersionTxt=" + $("#ddlrfqVersion option:selected").text().replace(' ', '%20'))
    window.open("eRFQReport.html?param=" + encrypdata, "_blank")

}

var Vendor;
function fetchrfqcomprative() {
    if ($('#hdnRfqID').val() == "432") {
        $('#tblRFQComprativeBoq').show();
        $('#tblRFQComprative').hide();

    }
    else {
        $('#tblRFQComprativeBoq').hide();
        $('#tblRFQComprative').show();
    }
    sessionStorage.setItem("RFQVersionId", $("#ddlrfqVersion option:selected").val())
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        //url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=" + $('#ddlrfqVersion option:selected').val(),
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&RFQVersionId=" + $('#ddlrfqVersion option:selected').val(),
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
            if (_rfqBidType == 'Closed') {
                if (_openQuotes == 'Y') {
                    ShowPrice = 'Y';
                    $('#btnPDF').show()
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
                var _curentRFQStatus = sessionStorage.getItem('CurrentRFQStatus')
                if ($('#hdnUserID').val() == sessionStorage.getItem('UserID')) {
                    //$('#cancl_btn').show();
                    if (_curentRFQStatus.toLowerCase() != 'cancel') {
                        $('#cancl_btn').show();
                    }
                    else {
                        $('#cancl_btn').hide();
                    }

                }
                else {
                    $('#cancl_btn').hide();

                }
                $('#displayComparativetabs').show();
                strHead = "<tr  style='background: #f5f5f5; color:light black;'><th class='hide'>&nbsp;</th><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Item Description</th><th>Item Remark</th><th>Quantity</th><th>UOM</th><th>Target/Budget Price</th>"

                //abheedev bug 349 start
                strHeadExcel = "<tr><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>ItemDescription</th><th>Quantity</th><th>UOM</th><th>Target/Budget Price</th>"
                //abheedev bug 349 end
                //abheedev bug 349 part2  start
                strHeadQ = "<tr  style='background:#f5f5f5; color:light black;'><th>Question</th><th>Our Requirement</th>"
                strHeadExcelQ = "<tr><th colspan=4>Question</th><th colspan=3>Our Requirement</th>"
                //abheedev bug 349 part2  end
                for (var i = 0; i < data[0].vendorNames.length; i++) {

                    if (data[0].vendorNames[i].seqNo != 0) {
                        //abheedev bug 349 part2  start
                        strHead += "<th colspan='4' style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + data[0].vendorNames[i].rfqVersionId + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vendorName; +"</a></th>";
                        strHeadExcel += "<th colspan='4'>" + data[0].vendorNames[i].vendorName; +"</th>";

                        strHeadQ += "<th style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + data[0].vendorNames[i].rfqVersionId + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vName; +"</a></th>";
                        strHeadExcelQ += "<th colspan='4'>" + data[0].vendorNames[i].vName; +"</th>";

                    }
                    else {
                        allvendorresponse = 'N';
                        strHead += "<th colspan='4' style='text-align:center;'>" + data[0].vendorNames[i].vendorName; +"</th>";
                        strHeadExcel += "<th colspan='4'>" + data[0].vendorNames[i].vendorName; +"</th>";

                        strHeadQ += "<th   style='text-align:center;'>" + data[0].vendorNames[i].vName; +"</th>";
                        strHeadExcelQ += "<th  colspan='4'>" + data[0].vendorNames[i].vName; +"</th>";
                        //abheedev bug 349 part2  end
                    }
                }
                strHead += "<th>Line-wise Lowest Quote</th><th colspan='5' style='text-align:center;'>Last PO Details</th><th>Delivery Location</th>";
                strHeadExcel += "<th>Line-wise Lowest Quote</th><th colspan='5'>Last PO Details</th><th colspan=2>Delivery Location</th>";

                strHead += "</tr>"
                strHeadExcel += "</tr>"

                strHeadQ += "</tr>"
                strHeadExcelQ += "<td colspan='9'>&nbsp;</td></tr>"

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                //abheedev bug349 start
                strHeadExcel += "<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                //abheedev bug349 end

                for (var i = 0; i < data[0].vendorNames.length; i++) {

                    if (data[0].vendorNames[i].rfqStatus == 'C') {

                        strHead += "<th colspan='4' style='text-align:center;'>" + "Submission Time:" + fnConverToLocalTime(data[0].vendorNames[i].responseSubmitDT) + "</th>";
                        strHeadExcel += "<th colspan='4'>" + "Submission Time:" + fnConverToLocalTime(data[0].vendorNames[i].responseSubmitDT) + "</th>";

                    }
                    else if (data[0].vendorNames[i].rfqStatus == 'I') {

                        strHead += "<th colspan='4' style='text-align:center;'>Intent To Participate</th>";
                        strHeadExcel += "<th colspan='4'>Intent To Participate</th>";

                    }
                    else {
                        strHead += "<th colspan='4' style='text-align:center;'>Not Started</th>";
                        strHeadExcel += "<th colspan='5'>Not Started</th>";
                    }
                }
                strHead += "<th colspan=7>&nbsp;</th>";
                strHeadExcel += "<th colspan=7>&nbsp;</th>";

                strHead += "</tr>"
                strHeadExcel += "</tr>"

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                //abheedev bug349 start
                strHeadExcel += "<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                //abheedev bug349 end
              
                var taxHRTextinc = stringDivider("Unit Price (With GST)", 24, "\n");
                var initialtaxHRTextEx = stringDivider("Unit Price-R0(Without GST)",32,"\n");
                var taxHRTextEx = stringDivider(" Unit Price (Without GST)", 32, "\n");
                var HRAmount = stringDivider("Amount (Exc. GST)", 24, "<br/>\n");
                for (var j = 0; j < data[0].vendorNames.length; j++) {

                    strHead += "<th>" + initialtaxHRTextEx + "</th><th>" + taxHRTextEx + "</th><th>" + taxHRTextinc + "</th><th>" + HRAmount + "</th>";
                    strHeadExcel += "<th> Unit Price - R0(Without GST)</th><th>Unit Price (Without GST)</th><th>Unit Price (With GST)</th><th>Amount (Exc. GST)</th>"

                }
                strHead += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th><th>&nbsp;</th>";
                strHeadExcel += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th><th colspan=2>&nbsp;</th>";

                strHead += "</tr>";
                strHeadExcel += "</tr>";

                jQuery('#tblRFQComprative > thead').append(strHead);
                jQuery('#tblRFQComprativeForExcel > thead').append(strHeadExcel);

                jQuery('#tblRFQComprativeQ > thead').append(strHeadQ);
                jQuery('#tblRFQComprativeForExcelQ > thead').append(strHeadExcelQ);



                var x = 0;
                var _totalWithoutGst = 0;

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
                        str += "<tr><td class='hide'>" + data[0].quotesDetails[i].vendorID + "</td><td>" + (i + 1) + "</td><td class='hide'>" + data[0].quotesDetails[i].rfqParameterId + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td>" + StringDecodingMechanism(data[0].quotesDetails[i].itemDesc) + "</td><td>" + data[0].quotesDetails[i].remarks +  "</td><td class='text-right'>" + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + "</td><td>" + data[0].quotesDetails[i].uom + "</td><td class=text-right>" + data[0].quotesDetails[i].targetPrice + "</td>";//ADD CODE HERE
                        //abheedev bug349 start
                        strExcel += "<tr><td>" + (i + 1) + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td>" + StringDecodingMechanism(data[0].quotesDetails[i].itemDesc) + "</td><td>" + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + "</td><td>" + data[0].quotesDetails[i].uom + "</td><td>" + data[0].quotesDetails[i].targetPrice + "</td>";//ADD CODE HERE
                        //abheedev bug349 end


                        var _quantity = data[0].quotesDetails[i].quantity;
                        for (var j = 0; j < data[0].quotesDetails.length; j++) {



                            if ((data[0].quotesDetails[i].rfqParameterId) == (data[0].quotesDetails[j].rfqParameterId)) {// true that means reflect on next vendor
                                x = x + 1;

                                if (data[0].quotesDetails[j].vendorID == data[0].vendorNames[x].vendorID) {
                                    _totalWithoutGst = (data[0].quotesDetails[j].rfqVendorPricewithoutGST * _quantity).round(2);
                                    if (ShowPrice == "N" && data[0].quotesDetails[j].initialQuotewithoutGST != 0) {
                                        strExcel += "<td>Quoted</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>Quoted</td>";
                                    }
                                    else {
                                        strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].initialQuotewithoutGST).round(2)) + "</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators((data[0].quotesDetails[j].initialQuotewithoutGST).round(2)) + "</td>";
                                    }
                                    if (ShowPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>Quoted</td><td>Quoted</td><td>Quoted</td>";
                                        str += "<td class='text-right'>Quoted</td><td class='VendorPriceNoTax text-right'>Quoted</td><td class='VendorPriceWithTax  text-right' >Quoted</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators((_totalWithoutGst)) + "</td>";

                                        //abheedev backlog 335
                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {


                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";
                                        }
                                        else {

                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";


                                        }
                                        //abheedev backlog 335 end
                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                        //abheedev backlog 335 part 2
                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";
                                        }
                                        else {
                                            str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                        }
                                        //abheedev backlog 335 end part 2
                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                        //abheedev backlog 335
                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: red!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";
                                        }
                                        else {

                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: red!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";


                                        }
                                        //abheedev backlog 335 end



                                    }


                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";
                                        //abheedev backlog 333
                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {

                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";
                                        }
                                        else {

                                            str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";


                                        }
                                        //abheedev backlog 333
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
                        totallowestValue = (totallowestValue + (data[0].quotesDetails[i].quantity * data[0].quotesDetails[i].lowestPriceValue)).round(2)

                        if (ShowPrice == 'Y' || totallowestValue == 0) {

                            str += "<td class=text-right>" + thousands_separators((data[0].quotesDetails[i].lowestPriceValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                            strExcel += "<td >" + thousands_separators((data[0].quotesDetails[i].lowestPriceValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td colspan=2>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        }
                        else {
                            if (totallowestValue != 0) {
                                totallowestValue = "Quoted";
                                str += "<td class=text-right>Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                                strExcel += "<td >Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td colspan=2>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                            }
                        }
                        str += "</tr>"
                        strExcel += "</tr>"

                        jQuery('#tblRFQComprativetest').append(str);

                    }

                }
                // for calculating total target price
                let totaltargetprice = 0;
                let ttpArray = [];
                for (var t = 0; t < data[0].quotesDetails.length; t++) {
                    
                    let isPresent = ttpArray.includes(data[0].quotesDetails[t].rfqParameterId)
                    if (!isPresent) {
                        ttpArray.push(data[0].quotesDetails[t].rfqParameterId);
                        totaltargetprice = totaltargetprice + data[0].quotesDetails[t].targetPrice;
                    }
                    else {
                        break;
                    }
                }
                str += "<tr><td colspan=7 style='text-align:center;'><b>Total</b></td><td colspan=1 style='text-align:center;'><b>" + thousands_separators(totaltargetprice) + "</b></td>";
                strExcel += "<tr><td colspan=7><b>Total</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        if (ShowPrice == 'Y') {
                            RFQFetchTotalPriceForReport(data[0].vendorNames[k].vendorID, k)
                            str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                            strExcel += "<td id=totBoxinitialwithoutgstExcel" + data[0].vendorNames[k].vendorID + " ></td><td id=totBoxwithoutgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxwithgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxTaxExcel" + data[0].vendorNames[k].vendorID + "></td>";
                        }
                        else {
                            str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td>";
                            strExcel += "<td id=totBoxinitialwithoutgstExcel" + data[0].vendorNames[k].vendorID + " >Quoted</td><td id=totBoxwithoutgstExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td><td id=totBoxwithgstExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td><td id=totBoxTaxExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td>";
                        }
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }

                }
                if (ShowPrice == "Y" || totallowestValue == 0) {
                    str += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";
                    strExcel += "<td>" + thousands_separators(totallowestValue) + "</td><td colspan='7'>&nbsp;</td></tr>";
                }
                else {
                    if (totallowestValue != 0) {
                        str += "<td class=text-right>Quoted</td><td colspan=6>&nbsp;</td></tr>";
                        strExcel += "<td>Quoted</td><td colspan=7>&nbsp;</td></tr>";
                    }
                }




                str += "<tr><td colspan=4 style='text-align:center;'><b>Loading Factor</b></td><td colspan=4 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=3 ><b>Loading Factor</b></td><td colspan=4 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            var p = thousands_separators((data[0].loadedFactor[k].loadedFactor + data[0].loadedFactor[k].sumwithGST).round(2));
                            if (p != 0) {
                                if (ShowPrice == 'Y') {
                                    str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators((data[0].loadedFactor[k].loadedFactor).round(2)) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                                    strExcel += "<td id=LFactorexcel" + data[0].vendorNames[k].vendorID + ">" + thousands_separators((data[0].loadedFactor[k].loadedFactor).round(2)) + "</td><td id=LoadingFexcel" + data[0].vendorNames[k].vendorID + ">" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                                }
                                else {
                                    str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators((data[0].loadedFactor[k].loadedFactor).round(2)) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>Quoted</td><td>&nbsp;</td><td>&nbsp;</td>";
                                    strExcel += "<td id=LFactorexcel" + data[0].vendorNames[k].vendorID + ">" + thousands_separators((data[0].loadedFactor[k].loadedFactor).round(2)) + "</td><td id=LoadingFexcel" + data[0].vendorNames[k].vendorID + ">Quoted</td><td>&nbsp;</td><td>&nbsp;</td>";
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
                strExcel += "<td colspan=8>&nbsp;</td></tr>";


                str += "<tr><td colspan=8 style='text-align:center;'><b>Loading Reason</b></td>";
                strExcel += "<tr><td colspan=7 ><b>Loading Reason</b></td>";
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
                strExcel += "<td colspan=8>&nbsp;</td></tr>";


                str += "<tr><td colspan=8 style='text-align:center;'><b>Commercial Rank (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=7 ><b>Commercial Rank (Without GST)</b></td>";
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].lStatus.length; k++) {

                        if (data[0].lStatus[k].vendorID == data[0].vendorNames[l].vendorID) {
                            if (ShowPrice == "Y") {
                                if (data[0].lStatus[k].status != 'N/A') {
                                    str += "<td colspan=4 style='text-align:center;color: blue!important;'>" + data[0].lStatus[k].status + "</td>";
                                    strExcel += "<td colspan=4>" + data[0].lStatus[k].status + "</td>";
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
                strExcel += "<td colspan=8>&nbsp;</td></tr>";

                //abheedev bug 479
                str += "<tr><td colspan=8 style='text-align:center;'><b>Package Value where supplier is L1</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=7 ><b>Package Value where supplier is L1</b></td>";
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
                strExcel += "<td colspan=8>&nbsp;</td></tr>";


                str += "<tr>";
                strExcel += " <tr>";
                var t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {
                    t = k;
                }

                str += "<td colspan=" + (t + 12) + ">&nbsp;</td></tr>";
                strExcel += "<td colspan=" + (t + 3 + (6 * t)) + ">&nbsp;</td></tr>";


                if (data[0].commercialTerms.length > 0) {

                    str += "<tr style='background: #f5f5f5; color:light black;'>";
                    strExcel += " <tr>";
                    str += "<td><b>SrNo</b></td><td colspan=7><b>Other Commercial Terms</b></td>";
                    strExcel += "<td><b>SrNo</b></td><td colspan=6><b>Other Commercial Terms</b></td>";
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
                    strExcel += "<td colspan=9><b>Our Requirement</b></td></tr>";

                    $('#tblRFQComprativetest > tbody').empty(); // clear again for comparision of Commercial

                    for (var p = 0; p < data[0].noOfTermsForRFQ[0].noOfTermsSelectedForRFQ; p++) {

                        var flag1 = 'T';
                        $("#tblRFQComprativetest > tbody > tr").each(function (index) {
                            var this_row = $(this);
                            if ($.trim(this_row.find('td:eq(0)').html()) == data[0].commercialTerms[p].termName) {
                                flag1 = 'F';
                            }

                        });


                        if (flag1 == 'T') {

                            str += "<tr><td>" + (p + 1) + "</td><td colspan=7>" + data[0].commercialTerms[p].termName + "</td>";
                            strExcel += "<tr><td>" + (p + 1) + "</td><td colspan=6>" + data[0].commercialTerms[p].termName + "</td>";

                            for (var s = 0; s < data[0].commercialTerms.length; s++) {

                                if ((data[0].commercialTerms[p].rfqtcid) == (data[0].commercialTerms[s].rfqtcid)) {


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
                            strExcel += "<td colspan=9>" + data[0].commercialTerms[p].requirement + "</td>";

                            str += " </tr>";
                            strExcel += " </tr>";
                            jQuery('#tblRFQComprativetest').append(str);
                        }
                    }
                }



                str += "<tr><td colspan=8><b>Vendor Remarks :</b></td>";
                strExcel += "<tr><td colspan=7><b>Vendor Remarks :</b></td>";
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
                strExcel += "<td colspan=9>&nbsp;</td>";
                str += " </tr>";
                strExcel += " </tr>";


                //abheedev bug 410 start
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
                            //abheedev bug 349 part2  start
                            strExcelQ += "<tr><td colspan=4>" + data[0].questions[p].question + "</td><td colspan=3>" + data[0].questions[p].requirement + "</td>";
                            //abheedev bug 349 part2  end
                            for (var s = 0; s < data[0].questions.length; s++) {

                                if ((data[0].questions[p].questionID) == (data[0].questions[s].questionID)) {// true that means reflect on next vendor

                                    //abheedev bug 349 part2  start
                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].questions[s].vendorID == data[0].vendorNames[q].vendorID) {
                                            var attachQA = data[0].questions[s].attachementQA;

                                            if (data[0].questions[s].answer != '' && data[0].questions[s].answer != 'Rejected') {
                                                //strQ += "<td>" + data[0].questions[s].answer + "</td>";
                                                strQ += '<td >' + data[0].questions[s].answer + '<br>  <a id=eRFQVFilesques' + s + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[0].questions[s].vendorID + ')>' + attachQA + '</a> </td>';
                                                strExcelQ += "<td colspan=4>" + data[0].questions[s].answer + "</td>";

                                            }
                                            else if (data[0].questions[s].answer == 'Rejected') {
                                                strQ += "<td  style='color: red!important; text-align: center;'>Regretted</td>"
                                                strExcelQ += "<td colspan=4>Regretted</td>";

                                            }
                                            else {
                                                strQ += "<td  style='color: red!important; text-align: center;' >Not Quoted</td>";
                                                strExcelQ += "<td colspan=4>Not Quoted </td>";
                                            }
                                            //abheedev bug 349 part2  end is done
                                        }

                                    }
                                }
                            }
                            //abheedev bug 410 end

                            strQ += "<td colspan='3'>&nbsp;</td></tr>";
                            strExcelQ += "<td colspan='9'></tr>";
                            jQuery('#tblRFQComprativetestQ').append(strQ);

                        }
                    }
                }
                else {
                    strQ += "<tr>";
                    strExcelQ += " <tr><td colspan=" + 7 + ">&nbsp;</td>";
                    t = 0;
                    for (var k = 1; k <= data[0].vendorNames.length; k++) {

                        t = k;

                    }

                    //abheedev bug  472 479 
                    strQ += "<td colspan=" + 2 + ">&nbsp;</td><td colspan=" + (t + 2) + " style='text-align:center'>No Questions Mapped</td>";
                    strExcelQ += "<td colspan=" + ((4 * t)) + ">No Questions Mapped</td>";
                    strQ += "</tr>";
                    strExcelQ += "</tr>";
                    //abheedev bug 349 part2  start
                }

                strQ += " <tr><td><b>Technical Approval Required</b></td>";

                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {

                    t = k;

                }
            if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "afterrfq") {
                    strQ += "<td>After All RFQ Responses</td>"
                    //abheedev bug 349 part2  start
                    strQ += '<td colspan=' + (t + 4) + '><a href="javascript:;" class="btn btn-xs yellow" id=btn_techmapaaprover onclick="fnForwardforAllvendorTechnical()"> Technical Approval</a></td>';
                    //abheedev bug 349 part2  end


                }
                //abheedev bug 349 part2  start
                else if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "rfq") {
                    strQ += "<td colspan=" + (t + 4) + ">With individual RFQ Response</td>"
                }
                else {
                    strQ += "<td colspan=" + (t + 4) + ">Not Required</td>"
                }
                //abheedev bug 349 part2  end
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
                        //abheedev bug 472
                        if (flag3 == 'T') {


                            strQ += "<tr><td>" + data[0].approverStatus[p].approverName + "</td><td id=techremark" + p + ">" + ((data[0].approverStatus[p].remarks).replaceAll("&lt;", "<")).replaceAll("&gt;", ">") + "</td>";
                            strExcelQ += "<tr><td>" + data[0].approverStatus[p].approverName + "</td><td colspan='6'>" + ((data[0].approverStatus[p].remarks).replaceAll("&lt;", "<")).replaceAll("&gt;", ">") + "</td>";



                            for (var s = 0; s < data[0].approverStatus.length; s++) {


                                if ((data[0].approverStatus[p].approverID) == (data[0].approverStatus[s].approverID)) {// true that means reflect on next vendor

                                    for (var q = 0; q < data[0].vendorNames.length; q++) {



                                        if (data[0].approverStatus[s].vendorID == data[0].vendorNames[q].vendorID) {
                                            strQ += "<td>";

                                            if (data[0].approverStatus[s].status == 'Approved') {
                                                //   strQ += "<td style='color: green!important; text-align: center;'>" + data[0].approverStatus[s].status + "</td>" ;
                                                strQ += "<span style='color: green!important; text-align: center;'>" + data[0].approverStatus[s].status + "<span/>";


                                                strExcelQ += "<td colspan='4'>" + data[0].approverStatus[s].status + "</td>";//abheedev479

                                            }

                                            else if (data[0].approverStatus[s].status == 'Rejected') {
                                                strQ += "<span style='color: red!important; text-align: center;'>Not Approved</span>";


                                                strExcelQ += "<td colspan='4'>Not Approved</td>";

                                            }
                                            else if (data[0].approverStatus[s].status == 'Pending') {
                                                strQ += "<span style='color: blue!important; text-align: center;'>Pending</span>";
                                                strExcelQ += "<td colspan='4'>Pending</td>";
                                            }


                                            strQ += "</td>";


                                        }



                                    }

                                }

                            }


                            strQ += " </tr>";
                            strExcelQ += "<td colspan='6'>&nbsp;</td> </tr>";
                            jQuery('#tblRFQComprativetestQ').append(strQ);

                        }

                    }

                }


                strExcelQ += " <tr><td>&nbsp;</td>";
                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {

                    t = k;

                }
                //abheedev bug 349 part2  start
                strQ += "<td colspan=" + (t + 4) + ">&nbsp;</td>";
                strExcelQ += "<td colspan=" + (t + 4) + ">&nbsp;</td>";
                strQ += "</tr>";
                strExcelQ += "</tr>";
                //abheedev bug 349 part2  end

                if ($("#ddlrfqVersion option:selected").val() != 0) {
                    debugger
                    str += "<tr id='reinvitationTRRem'><td colspan=8><b>Re-Invitation Remarks</b></td>";
                    strExcel += "<tr><td colspan=7><b>Re-Invitation Remarks</b></td>";
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
                    strExcel += "<td colspan='9'>&nbsp;</td>";
                    strExcel += " </tr>";
                }


                if ($("#ddlrfqVersion option:selected").val() != 99) {

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
                        str += "<tr id='reinvitationTR'><td colspan=8><b>Re-Invitation Row</b></td>";

                        for (var k = 0; k < data[0].vendorNames.length; k++) {


                            str += "<td colspan='4' class='text-center'><label class='checkbox-inline'><input type='checkbox' class='chkReinvitation' style='position:relative;margin-right:5px;' value=" + data[0].vendorNames[k].vendorID + " />Re-Invite Vendor For Fresh Quote</label></td>"; //<a class='btn green'>Re-Invite Vendor</a>


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


                if (Type != undefined && Type.toLowerCase() == "aw") {
                    $("#btn_commercial").addClass('hide');
                }



                if (data[0].commApprover[0].isFwdCommApp == "Y") {
                    $('#btn_commercial').attr('disabled', 'disabled')
                    $('#btn_commercial').text('Approval Pending')
                }
                else {
                    $('#btn_commercial').removeAttr('disabled')
                    $('#btn_commercial').text('Commercial Approval')
                }


                if (data[0].techApprover[0].isFwdTechApp == "Y" && TechnicalApproval.toLowerCase() == "rfq") { //|| allvendorresponse=='N'
                    $('#btn_techmapaaprover').attr('disabled', 'disabled')
                    $('#btn_techmapaaprover').text('Tech Approval Pending')
                    $('#btn_commercial').hide();

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

            var err = xhr.responseText
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


var form = $('#RFIRFQREport');
var formApprover = $('#frmMapApprover');
var formCommApprover = $('#frmcommMapApprover');
function formvalidate() {

    form.validate({

        doNotHideMessage: true,

        errorElement: 'span',

        errorClass: 'help-block help-block-error',
        focusInvalid: false,
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
                    if (sessionStorage.getItem('RFQBidType') == 'Closed') {
                        FetchInvitedVendorsForeRFQ();
                    }
                }, 400)

            }
        }

    });

    $("#frmReInvite").validate({

        doNotHideMessage: true,

        errorElement: 'span',

        errorClass: 'help-block help-block-error',

        focusInvalid: false,

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
            Dateandtimevalidate();
            //ReInviteVendorsForRFQ();
        }

    });


    formCommApprover.validate({

        doNotHideMessage: true,
        errorElement: 'span',
        errorClass: 'help-block help-block-error',
        focusInvalid: false,
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

        invalidHandler: function (event, validator) {

        },

        highlight: function (element) {
            $(element)
                .closest('.col-md-10').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.col-md-10').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.col-md-10').removeClass('has-error');
        },

        submitHandler: function (form) {

            cancelBtnclick();

        }
    });

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

        invalidHandler: function (event, validator) {
        },

        highlight: function (element) {
            $(element)
                .closest('.col-md-10').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.col-md-10').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.col-md-10').removeClass('has-error');
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
                if (sessionStorage.getItem('RFQBidType') == 'Closed') {
                    FetchInvitedVendorsForeRFQ();
                }
            }, 1000)

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
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
