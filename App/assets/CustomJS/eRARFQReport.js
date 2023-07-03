jQuery(document).ready(function () {
    Pageloaded();
    setInterval(function () { Pageloaded() }, 7000);
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
    Metronic.init(); Layout.init(); setCommonData();

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
var param = getUrlVars()["param"];
var decryptedstring = fndecrypt(param);
var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
var BIdID = getUrlVarsURL(decryptedstring)["BidID"];

if (RFQID != undefined) {
    fetchReguestforQuotationDetails()
    fetchrfqcomprative();
    fetchAttachments();
}
var Vendor;
function fetchrfqcomprative() {


    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    // alert( sessionStorage.getItem("APIPath") + "eRFQReport/efetchRA_RFQComprativeDetails/?RFQID=" + RFQID + "&BidID=" + BIdID + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=99")

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRA_RFQComprativeDetails/?RFQID=" + RFQID + "&BidID=" + BIdID + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=99",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            var str = '';
            var strHead = '';
            var strHeadExcel = '';
            var strExcel = '';
            var totalWithouTax = 0;
            var totalWithTax = 0;
            var VendorID = 0;
            var totallowestValue = 0;
            var strQ = '';
            var strHeadQ = '';
            var strHeadExcelQ = '';
            var strExcelQ = '';
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


            sessionStorage.setItem('ShowPrice', '');


            if (data[0].vendorNames.length > 0) {
                Vendor = data[0].vendorNames;
                $('#displayTable').show();
                $('#btnExport').show()
                $('#displayComparativetabs').show();
                //For Printing Header
                strHead = "<tr  style='background: #f5f5f5; color:light black;'><th class='hide'>&nbsp;</th><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th>"
                strHeadExcel = "<tr><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th>"

                strHeadQ = "<tr  style='background:#f5f5f5; color:light black;'><th>Question</th><th>Our Requirement</th>"
                strHeadExcelQ = "<tr><th colspan=4>Question</th><th>Our Requirement</th>"
                for (var i = 0; i < data[0].vendorNames.length; i++) {
                    if (data[0].vendorNames[i].seqNo != '0') {
                        strHead += "<th colspan='4' style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + "99" + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vendorName + "</a></th>";
                        strHeadExcel += "<th colspan='4'>" + data[0].vendorNames[i].vendorName + "</th>";
                    }
                    else {
                        strHead += "<th colspan='4' style='text-align:center;'>" + data[0].vendorNames[i].vendorName + "</th>";
                        strHeadExcel += "<th colspan='4'>" + data[0].vendorNames[i].vendorName + "</th>";

                    }               
                    strHeadQ += "<th style='text-align:center;'>" + data[0].vendorNames[i].vName +"</th>";
                    strHeadExcelQ += "<th>" + data[0].vendorNames[i].vName +"</th>";


                }
                strHead += "<th>Line-wise Lowest Quote</th><th colspan='5' style='text-align:center;'>Last PO Details</th>";
                strHeadExcel += "<th>Line-wise Lowest Quote</th><th colspan='5'>Last PO Details</th>";

                strHead += "</tr>"
                strHeadExcel += "</tr>"

                strHeadQ += "</tr>"
                strHeadExcelQ += "</tr>"

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                strHeadExcel += "<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";



                var taxHRTextinc = stringDivider("Unit Price (Without GST)-After RA", 18, "<br/>\n");
                var taxHRTextEx = stringDivider("Unit Price (Without GST)", 18, "<br/>\n");
                var HRAmount = stringDivider("Amount (Exc. GST)", 8, "<br/>\n");
                var initialtaxHRTextEx = stringDivider("Unit Price - R0(Without GST)  ", 18, "<br/>\n");
                for (var j = 0; j < data[0].vendorNames.length; j++) {

                    strHead += "<th>" + initialtaxHRTextEx + "</th><th>" + taxHRTextEx + "</th><th>" + taxHRTextinc + "</th><th>" + HRAmount + "</th>";
                    strHeadExcel += "<th>Initial Landed Unit Price (Without GST) - R0</th><th>Landed Unit Price (Without GST) - After RA</th><th>Landed Unit Price (Without GST)</th><th>Amount (Inc. GST)</th>"

                }
                strHead += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th>";
                strHeadExcel += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th>";

                strHead += "</tr>";
                strHeadExcel += "</tr>";


                jQuery('#tblRFQComprative > thead').append(strHead);
                jQuery('#tblRFQComprativeForExcel > thead').append(strHeadExcel);

                jQuery('#tblRFQComprativeQ > thead').append(strHeadQ);
                jQuery('#tblRFQComprativeForExcelQ > thead').append(strHeadExcelQ);

                //For Printing Header Ends


                var x = 0;

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
                        let VendorAmountNoTax

                        str += "<tr><td class='hide'>" + data[0].quotesDetails[i].vendorID + "</td><td>" + (i + 1) + "</td><td class='hide'>" + data[0].quotesDetails[i].rfqParameterId + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].quantity) + "</td><td>" + data[0].quotesDetails[i].uom + "</td>";
                        strExcel += "<tr><td>" + (i + 1) + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td>" + data[0].quotesDetails[i].quantity + "</td><td>" + data[0].quotesDetails[i].uom + "</td>";

                        for (var j = 0; j < data[0].quotesDetails.length; j++) {
                            VendorAmountNoTax = data[0].quotesDetails[j].bidFinalPrice * data[0].quotesDetails[j].quantity
                            if ((data[0].quotesDetails[i].rfqParameterId) == (data[0].quotesDetails[j].rfqParameterId)) {// true that means reflect on next vendor
                                x = x + 1;

                                if (data[0].quotesDetails[j].vendorID == data[0].vendorNames[x].vendorID) {

                                    if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].initialQuotewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].bidFinalPrice + "</td><td>" + data[0].quotesDetails[j].withGSTBidValue + "</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators(data[0].quotesDetails[j].initialQuotewithoutGST) + "</td><td class='text-right' id=unitrate" + i + x + " >" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right' style='color: blue!important;' id=VendorPriceNoTax" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].bidFinalPrice) + "</td><td class='VendorAmountNoTax  text-right' id=VendorAmountNoTax" + i + x + ">" + thousands_separators(VendorAmountNoTax) + "</td>";// UnitRate

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].initialQuotewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].bidFinalPrice + "</td><td>" + data[0].quotesDetails[j].withGSTBidValue + "</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators(data[0].quotesDetails[j].initialQuotewithoutGST) + "</td><td class='text-right' id=unitrate" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right' id=VendorPriceNoTax" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].bidFinalPrice) + "</td><td class='VendorAmountNoTax  text-right' id=VendorAmountNoTax" + i + x + ">" + thousands_separators(VendorAmountNoTax) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].initialQuotewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].bidFinalPrice + "</td><td>" + data[0].quotesDetails[j].withGSTBidValue + "</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators(data[0].quotesDetails[j].initialQuotewithoutGST) + "</td><td class='text-right' id=unitrate" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'  style='color: red!important;' id=VendorPriceNoTax" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].bidFinalPrice) + "</td><td class='VendorAmountNoTax  text-right' id=VendorAmountNoTax" + i + x + " >" + thousands_separators(VendorAmountNoTax) + "</td>";

                                    }


                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].initialQuotewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].bidFinalPrice + "</td><td>" + data[0].quotesDetails[j].withGSTBidValue + "</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators(data[0].quotesDetails[j].initialQuotewithoutGST) + "</td><td class='text-right' id=unitrate" + i + x + " >" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right' style='color: blue!important;' id=VendorPriceNoTax" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].bidFinalPrice) + "</td><td class='VendorAmountNoTax  text-right' id=VendorAmountNoTax" + i + x + ">" + thousands_separators(VendorAmountNoTax) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].unitRate == -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST == -1) {
                                        str += "<td colspan=4  style='color: blue!important; text-align: center;' >Not Invited</td>";
                                        strExcel += "<td colspan=4 >Not Invited </td>";
                                    }
                                    else if (data[0].quotesDetails[j].unitRate == -2 && data[0].quotesDetails[j].rfqVendorPricewithoutGST == -2) {
                                        str += "<td colspan=4  style='color: red!important; text-align: center;' >Regretted</td>";
                                        strExcel += "<td colspan=4 >Regretted </td>";
                                    }
                                    else {

                                        str += "<td colspan=4  style='color: red!important; text-align: center;' >Not Quoted</td>";
                                        strExcel += "<td colspan=4 >Not Quoted </td>";

                                    }
                                }

                            }

                        }

                        totallowestValue = totallowestValue + (data[0].quotesDetails[i].quantity * data[0].quotesDetails[i].lowestPriceValue)

                        str += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poUnitRate) + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poValue) + "</td>";
                        strExcel += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + (data[0].quotesDetails[i].poUnitRate) + "</td><td>" + (data[0].quotesDetails[i].poValue) + "</td>";
                        str += "</tr>"
                        strExcel += "</tr>"

                        jQuery('#tblRFQComprativetest').append(str);

                    }

                }

                str += "<tr><td colspan=5 style='text-align:center;'><b>Total</b></td>";
                strExcel += "<tr><td colspan=5><b>Total</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        RFQFetchTotalPriceForReport(data[0].vendorNames[k].vendorID, k)
                        str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgstRA" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                        strExcel += "<td id=totBoxinitialwithoutgstExcel" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxwithoutgstRAExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxTaxExcel" + data[0].vendorNames[k].vendorID + "></td>";
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }

                }
                str += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=5>&nbsp;</td></tr>";
                strExcel += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=5>&nbsp;</td></tr>";



                //For Loading Factor
                str += "<tr><td colspan=3 style='text-align:center;'><b>Loading Factor</b></td><td colspan=2 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=3 ><b>Loading Factor</b></td><td colspan=2 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {



                            var p = thousands_separators(data[0].loadedFactor[k].loadedFactor + data[0].loadedFactor[k].sumwithGST);
                            if (p != 0) {
                                str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                                strExcel += "<td id=LFactorexcel" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td id=LoadingFexcel" + data[0].vendorNames[k].vendorID + ">" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                            else {

                                str += "<td colspan=4>&nbsp;</td>";
                                strExcel += "<td colspan=4>&nbsp;</td>";
                            }

                        }


                    }
                }
                str += "<td colspan=6>&nbsp;</td></tr>";
                strExcel += "<td colspan=6>&nbsp;</td></tr>";

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
                str += "<td colspan=6>&nbsp;</td></tr>";
                strExcel += "<td colspan=6>&nbsp;</td></tr>";

                //For Commercial Rank
                str += "<tr><td colspan=5 style='text-align:center;'><b>Commercial Rank (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=5 ><b>Commercial Rank (Without GST)</b></td>";
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].lStatus.length; k++) {

                        if (data[0].lStatus[k].vendorID == data[0].vendorNames[l].vendorID) {
                            if (data[0].lStatus[k].status != 'N/A') {
                                str += "<td colspan=4 style='text-align:center;color: blue!important;'>" + data[0].lStatus[l].status + "</td>";
                                strExcel += "<td colspan=4>" + data[0].lStatus[l].status + "</td>";
                            }
                            else {
                                str += "<td colspan=4 style='text-align:center;color: red!important;'>" + data[0].lStatus[k].status + "</td>";
                                strExcel += "<td colspan=4>" + data[0].lStatus[k].status + "</td>";
                            }

                        }

                    }
                }
                str += "<td colspan=6>&nbsp;</td></tr>";
                strExcel += "<td colspan=6>&nbsp;</td></tr>";

                // For L1 Package
                str += "<tr><td colspan=5 style='text-align:center;'><b>L1 Package</b></td>";
                strExcel += "<tr><td colspan=5 ><b>L1 Package</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        RFQFetchL1Package(data[0].vendorNames[k].vendorID, k)
                        str += "<td>&nbsp;</td><td id=withoutGSTNotL1RankRA" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withoutGSTL1RankRA" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                        strExcel += "<td>&nbsp;</td><td id=withoutGSTNotL1RankRAExcel" + data[0].vendorNames[k].vendorID + "></td><td id=withoutGSTL1RankRAExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totL1RankExcel" + data[0].vendorNames[k].vendorID + "></td>";
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }

                }
                str += "<td colspan=6>&nbsp;</td></tr>";
                strExcel += "<td colspan=6>&nbsp;</td></tr>";

                //For Blank Row
                str += "<tr>";
                strExcel += " <tr>";
                var t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {
                    t = k;
                }

                str += "<td colspan=" + (t + 10) + ">&nbsp;</td></tr>";
                strExcel += "<td colspan=" + (t + 10) + ">&nbsp;</td></tr>";

                //For Commercial Header Row
                // ***************** Start  Commercial Row
                if (data[0].commercialTerms.length > 0) {

                    str += "<tr style='background: #f5f5f5; color:light black;'>";
                    strExcel += " <tr>";
                    str += "<td><b>SrNo</b></td><td colspan=4><b>Other Commercial Terms</b></td>";
                    strExcel += "<td>SrNo</td><td colspan=4><b>Other Commercial Terms</b></td>";
                    for (var k = 0; k < data[0].vendorNames.length; k++) {

                        if (data[0].vendorNames[k].seqNo != '0') {

                            str += "<td colspan=4 style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[k].vendorID + "'\,\'" + "99" + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'><b>" + data[0].vendorNames[k].vName + "<b></a></td>";
                            strExcel += "<td colspan=4 ><b>" + data[0].vendorNames[k].vName; +"</b></td>";

                        }
                        else {
                            str += "<td colspan=4 style='text-align:center;'><b>" + data[0].vendorNames[k].vName; +"</b></td>";
                            strExcel += "<td colspan=4><b>" + data[0].vendorNames[k].vName; +"</b></td>";

                        }

                    }
                    str += "<td colspan=6><b>Our Requirement</b></td></tr>";
                    strExcel += "<td colspan=6><b>Our Requirement</b></td></tr>";

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
                            str += "<td colspan=6>" + data[0].commercialTerms[p].requirement + "</td>";
                            strExcel += "<td colspan=6>" + data[0].commercialTerms[p].requirement + "</td>";

                            str += " </tr>";
                            strExcel += " </tr>";
                            jQuery('#tblRFQComprativetest').append(str);
                        }
                    }
                }

                // ***************** End  Commercial Row



                // //For Vendor Comments

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
                str += "<td colspan=6>&nbsp;</td>";
                strExcel += "<td colspan=6>&nbsp;</td>";
                str += " </tr>";
                strExcel += " </tr>";

                // //For Qusetion table
                // // ***************** Start  Answer Question Row
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

                                            if (data[0].questions[s].answer != '' && data[0].questions[s].answer != 'Rejected') {
                                                strQ += "<td>" + data[0].questions[s].answer + "</td>";
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
                // // ***************** END  Answer Question Row
                // // ***************** Start  Define Technical  Approver Row**********************
                strQ += " <tr><td><b>Technical Approver Required</b></td>";

                if (data[0].vendorNames[0].isApproverRequired == "Y") {
                    strQ += "<td colspan=4><input style='width:16px!important;height:16px!important;' onclick='fncheckradiotext()' type='radio' name=AppRequired id=AppYes class='md-radio'  value='Y' checked disabled/> &nbsp;<span for=AppYes>Yes</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style='width:16px!important;height:16px!important;' type='radio' class='md-radio' name=AppRequired id=AppNo   onclick='fncheckradiotext()' disabled /> &nbsp;<span for=AppNo >No</span></td>"
                }
                else {
                    if ($("#ddlrfqVersion option:selected").val() == 99) {
                        strQ += "<td colspan=4><input style='width:16px!important;height:16px!important;' onclick='fncheckradiotext()' type='radio' name=AppRequired id=AppYes class='md-radio' value='Y' disabled/> &nbsp;<span for=AppYes >Yes</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style='width:16px!important;height:16px!important;' type='radio' class='md-radio' name=AppRequired id=AppNo checked  onclick='fncheckradiotext()'  value='N'   /> &nbsp;<span for=AppNo >No</span></td>"
                    }
                    else {
                        strQ += "<td colspan=4><input style='width:16px!important;height:16px!important;' onclick='fncheckradiotext()' type='radio' name=AppRequired id=AppYes class='md-radio' value='Y'/> &nbsp;<span for='AppYes' >Yes</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style='width:16px!important;height:16px!important;' type='radio' class='md-radio' name=AppRequired id='AppNo' checked  onclick='fncheckradiotext()'  value='N'   /> &nbsp;<span for=AppNo >No</span></td>"
                    }
                }
                //}
                strQ += "</tr>"
                // // ***************** END  Define Technical  Row **********************
                // // ***************** Start  Technical Approver Row**********************

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

                            strQ += "<tr><td>" + data[0].approverStatus[p].approverName + "</td><td>" + data[0].approverStatus[p].remarks + "</td>";
                            strExcelQ += "<tr><td>" + data[0].approverStatus[p].approverName + "</td><td>" + data[0].approverStatus[p].remarks + "</td>";

                            for (var s = 0; s < data[0].approverStatus.length; s++) {

                                if ((data[0].approverStatus[p].approverID) == (data[0].approverStatus[s].approverID)) {// true that means reflect on next vendor

                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].approverStatus[s].vendorID == data[0].vendorNames[q].vendorID) {

                                            if (data[0].approverStatus[s].status == 'Approved') {
                                                strQ += "<td style='color: green!important; text-align: center;'>" + data[0].approverStatus[s].status + "</td>";
                                                strExcelQ += "<td>" + data[0].approverStatus[s].status + "</td>";

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
                // ***************** END  Technical Approver Row

                //For Blank Row after question table 
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



                jQuery('#tblRFQComprative').append(str);
                jQuery("#tblRFQComprativeForExcel").append(strExcel);

                jQuery('#tblRFQComprativeQ').append(strQ);
                jQuery("#tblRFQComprativeForExcelQ").append(strExcelQ);


            }
            else {

                $('#displayTable').show();
                $('#displayComparativetabs').show();
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo('#tblRFQComprative');
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo("#tblRFQComprativeForExcel")

            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }

    });

    jQuery.unblockUI();

}


function RFQFetchTotalPriceForReport(VendorID, Counter) {

    //alert(sessionStorage.getItem("APIPath") + "RFI_RFQReport/RFQFetchTotalPriceForReport/?RFQID=" + RFQID + "&VendorId=" + VendorID + "&RFQVersionId=99&BidID=" + BIdID)
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchTotalPriceForReport/?RFQID=" + RFQID + "&VendorId=" + VendorID + "&RFQVersionId=99&BidID=" + BIdID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $("#totBoxwithoutgst" + VendorID).html(thousands_separators(data[0].totalPriceExTax));
            $("#totBoxwithoutgstRA" + VendorID).html(thousands_separators(data[0].totalPriceBidValue));//TotalPriceIncTax
            $("#totBoxTax" + VendorID).html(thousands_separators(data[0].totalPriceBidValue));//TotalPriceIncTax
            $("#totBoxwithoutgstExcel" + VendorID).html(thousands_separators(data[0].totalPriceExTax));
            $("#totBoxwithoutgstRAExcel" + VendorID).html(thousands_separators(data[0].totalPriceBidValue));//TotalPriceIncTax
            $("#totBoxTaxExcel" + VendorID).html(thousands_separators(data[0].totalPriceOfBidValuewithGST)); //TotalPriceIncTax
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
}
function RFQFetchL1Package(VendorID, Counter) {


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchL1Package/?RFQID=" + RFQID + "&VendorId=" + VendorID + "&RFQVersionId=99&BidID=" + BIdID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $("#withoutGSTNotL1RankRA" + VendorID).html(thousands_separators(data[0].totalNotL1RankWithoutGSTRA));
            $("#withoutGSTNotL1RankRAExcel" + VendorID).html(data[0].totalNotL1RankWithoutGSTRA);
            $("#withoutGSTL1RankRA" + VendorID).html(thousands_separators(data[0].totalL1RankWithoutGSTRA));
            $("#withoutGSTL1RankRAExcel" + VendorID).html(thousands_separators(data[0].totalL1RankWithoutGSTRA));

        }, error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
}


function fetchReguestforQuotationDetails() {
    var attachment = '';
    var termattach = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {
            var replaced1 = '';
            $('#tbldetailsExcel > tbody').empty();

            if (RFQData.length > 0) {
                let _cleanStringSub = StringDecodingMechanism(RFQData[0].general[0].rfqSubject);
                let _cleanStringDesc = StringDecodingMechanism(RFQData[0].general[0].rfqDescription);
                jQuery('#RFQSubject').text(_cleanStringSub)
                jQuery('#RFQDescription').html(_cleanStringDesc)
                $('#Currency').html(RFQData[0].general[0].currencyNm)
                jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate);
                jQuery('#refno').html(RFQData[0].general[0].rfqReference)

                jQuery('#RFQStartDate').html(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
                jQuery('#RFQDeadline').html(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
                jQuery('#lblrfqconfigby').html(RFQData[0].general[0].rfqConfigureByName)
                jQuery('#lblrfqconfigby').html(RFQData[0].general[0].rfqConfigureByName)
                jQuery('#lblRano').html(BIdID)
                jQuery('#lblRFQno').html(RFQID)

                if (RFQData[0].general[0].rfqTermandCondition != '') {
                    replaced1 = RFQData[0].general[0].rfqTermandCondition.replace(/\s/g, "%20")
                }

                $('#TermCondition').attr('href', 'PortalDocs/RFQ/' + $('#hdnRfqID').val() + '/' + replaced1.replace(/\s/g, "%20") + '').html(RFQData[0].general[0].rFQTermandCondition)

                $('#tbldetails').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + RFQData[0].general[0].rfqEndDate + "</td></tr>")
                $('#tbldetailsExcel > tbody').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + RFQData[0].general[0].rfqEndDate + "</td></tr>")

            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });

}
function fetchAttachments() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID,
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
                    str += '<td class=style="width:50%!important"><a style="pointer:cursur;text-decoration:none;" target=_blank href=PortalDocs/eRFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + data[0].attachments[i].rfqAttachment.replace(/\s/g, "%20") + '>' + data[0].attachments[i].rfqAttachment + '</a></td>';
                    jQuery('#tblAttachments').append(str);

                }
            }
            else {
                jQuery('#tblAttachments').append("<tr><td>No Attachments</td></tr>");

            }

        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
$('#btnPDF').click(function () {
    var encrypdata = fnencrypt("RFQID=" + RFQID + "&FromPage=RASumm&BidID=" + BIdID + "&Version=99")
    var url = "ViewReportRFQ.html?param=" + encrypdata;
    var win = window.open(url, "_blank");

    win.focus();

})

//sessionStorage.setItem("RFQVersionId", "0")
function getSummary(vendorid, version) {
    sessionStorage.setItem("RFQVersionId", version)
    var encrypdata = fnencrypt("RFQID=" + RFQID + "&VendorId=" + vendorid + "&max=" + version + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&RFQVersionTxt=Final Version" )
    window.open("eRFQReport.html?param=" + encrypdata, "_blank")
}
