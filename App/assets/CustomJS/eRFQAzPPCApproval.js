if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)

    var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
    var AppType = getUrlVarsURL(decryptedstring)["AppType"];
    var AppStatus = getUrlVarsURL(decryptedstring)["AppStatus"];
    var FwdTo = getUrlVarsURL(decryptedstring)["FwdTo"];


    if (AppType == "P" && AppStatus != 'Reverted' && AppStatus != 'Award') {
        $('#btn_fillPPCForm').hide();
        $('#btn_mapaaprover').hide();
        //$('#btn_mapFCaaprover').hide();
        $('#divRemarksAppComm').show();
        $('#divRemarksForward').hide();
        $('#divRemarksAwarded').hide();
    }
    else if (AppType == "P" && AppStatus == 'Reverted') {
        $('#btn_fillPPCForm').hide();
        $('#btn_mapaaprover').hide();
        //$('#btn_mapFCaaprover').hide();
        $('#divRemarksAppComm').hide();
        $('#divRemarksForward').show();
        $('#divRemarksAwarded').hide();

    }
    else if (AppType == "C" && AppStatus == 'Approved') {
        $('#btn_fillPPCForm').hide();
        $('#btn_mapaaprover').hide();
        //$('#btn_mapFCaaprover').hide();
        $('#divRemarksAppComm').hide();
        $('#divRemarksForward').show();
        $('#divRemarksAwarded').hide();
    }
    else if (AppStatus == "Award" && FwdTo == 'Admin') {
        $('#btn_fillPPCForm').hide();
        $('#btn_mapaaprover').hide();
        // $('#btn_mapFCaaprover').hide();
        $('#divRemarksAppComm').hide();
        $('#divRemarksForward').hide();
        $('#divRemarksAwarded').show();
    }
    else if (AppType == "F" && AppStatus == 'Reverted') {
        fetchRegisterUser();
        $('#btn_fillPPCForm').show();
        $('#btn_mapaaprover').show();
        // $('#btn_mapFCaaprover').hide();
        $('#divRemarksAppComm').hide();
        $('#divRemarksForward').hide();
        $('#divRemarksAwarded').hide();

    }
    else if (AppType == "F" && FwdTo == 'FC') {

        $('#btn_fillPPCForm').hide();
        $('#divRemarksAppComm').show();
        //$('#btn_mapFCaaprover').hide();
        $('#btn_mapaaprover').hide();
        $('#divRemarksAwarded').hide();
    }
    else {
        fetchRegisterUser();
        $('#btn_fillPPCForm').show();
        // $('#btn_mapFCaaprover').show();
        $('#btn_mapaaprover').show();
        $('#divRemarksAppComm').hide();
        $('#divRemarksAwarded').hide();

    }

    if (sessionStorage.getItem('IsObserver') == "Y") {
        $('#btn_fillPPCForm').hide();
        $('#btn_mapaaprover').hide();
        $('#divRemarksAppComm').hide();
        $('#divRemarksForward').hide();
    }

    $('#hdnRfqID').val(RFQID);

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    setTimeout(function () {
        fetchReguestforQuotationDetails()
        FetchRFQVersion();
        fetchrfqcomprative();
        fetchAzPPcFormDetails();
        fetchApproverRemarks();
        fetchAttachments();
    }, 400)


}

function getSummary(vendorid, version) {

    var encrypdata = fnencrypt("RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + vendorid + "&max=" + version + "&RFQVersionId=99&RFQVersionTxt=Final%20Version");
    window.open("eRFQReport.html?param=" + encrypdata, "_blank")
}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val());
}

var Vendor;
function fetchrfqcomprative() {

    var reInvited = '';
    var dtfrom = '';
    var dtto = '';
    sessionStorage.setItem("RFQVersionId", "99")
    //jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });


    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + RFQID + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=99",
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


            if (data[0].vendorNames.length > 0) {
                Vendor = data[0].vendorNames;
                $('#displayTable').show();

                $('#displayComparativetabs').show();
                //For Printing Header
                strHead = "<tr  style='background: #f5f5f5; color:light black;'><th class='hide'>&nbsp;</th><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th>"
                strHeadExcel = "<tr><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th>"

                strHeadQ = "<tr  style='background:#f5f5f5; color:light black;'><th>Question</th><th>Our Requirement</th>"
                strHeadExcelQ = "<tr><th colspan=4>Question</th><th>Our Requirement</th>"
                jQuery("#drpVendors").empty();
                jQuery("#drpVendors").append(jQuery("<option ></option>").val("").html("Only for auto PO confirmation"));
                for (var i = 0; i < data[0].vendorNames.length; i++) {

                    if (data[0].vendorNames[i].seqNo != 0) {

                        strHead += "<th colspan='4' style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + data[0].vendorNames[i].rfqVersionId + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vendorName; +"</a></th>";
                        strHeadExcel += "<th colspan='4'>" + data[0].vendorNames[i].vendorName; +"</th>";

                        strHeadQ += "<th style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[i].vendorID + "'\,\'" + data[0].vendorNames[i].rfqVersionId + "'\) href='javascript:;' style='color:#2474f6; text-decoration:underline;'>" + data[0].vendorNames[i].vName; +"</a></th>";
                        strHeadExcelQ += "<th>" + data[0].vendorNames[i].VName; +"</th>";
                        jQuery("#drpVendors").append(jQuery("<option ></option>").val(data[0].vendorNames[i].vendorID).html(data[0].vendorNames[i].vName));

                    }
                    else {
                        strHead += "<th colspan='4' style='text-align:center;'>" + data[0].vendorNames[i].vendorName; +"</th>";
                        strHeadExcel += "<th colspan='4'>" + data[0].vendorNames[i].vendorName; +"</th>";

                        strHeadQ += "<th style='text-align:center;'>" + data[0].vendorNames[i].vName; +"</th>";
                        strHeadExcelQ += "<th>" + data[0].vendorNames[i].vName; +"</th>";

                    }
                }
                strHead += "<th>Lowest Quote</th><th colspan='5' style='text-align:center;'>Last PO Details</th><th>Delivery Location</th>";
                strHeadExcel += "<th>Lowest Quote</th><th colspan='5'>Last PO Details</th><th>Delivery Location</th>";

                strHead += "</tr>"
                strHeadExcel += "</tr>"

                strHeadQ += "</tr>"
                strHeadExcelQ += "</tr>"

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                strHeadExcel += "<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";

                var taxHRTextinc = stringDivider("Landed Unit Price (With GST)", 18, "<br/>\n");
                var initialtaxHRTextEx = stringDivider("Initial Landed Unit Price (Without GST) - R0", 18, "<br/>\n");
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
                        strExcel += "<tr><td>" + (i + 1) + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td>" + data[0].quotesDetails[i].quantity + "</td><td>" + data[0].quotesDetails[i].uom + "</td>";

                        for (var j = 0; j < data[0].quotesDetails.length; j++) {

                            if ((data[0].quotesDetails[i].rfqParameterId) == (data[0].quotesDetails[j].rfqParameterId)) {// true that means reflect on next vendor
                                x = x + 1;

                                if (data[0].quotesDetails[j].vendorID == data[0].vendorNames[x].vendorID) {
                                    strExcel += "<td>" + data[0].quotesDetails[j].initialQuotewithoutGST + "</td>";
                                    str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators(data[0].quotesDetails[j].initialQuotewithoutGST) + "</td>";
                                    if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithGST + "</td><td>" + data[0].quotesDetails[j].unitRate + "</td>";
                                        str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithGST + "</td><td>" + data[0].quotesDetails[j].unitRate + "</td>";
                                        str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>" + data[0].quotesDetails[j].rfqVendorPricewithoutGST + "</td><td>" + data[0].quotesDetails[j].rfqVendorPricewithGST + "</td><td>" + data[0].quotesDetails[j].unitRate + "</td>";
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
                        str += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].pono + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poUnitRate) + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        strExcel += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].pono + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + (data[0].quotesDetails[i].poUnitRate) + "</td><td>" + (data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        str += "</tr>"
                        strExcel += "</tr>"

                        jQuery('#tblRFQComprativetest').append(str);

                    }

                }

                str += "<tr><td colspan=5 style='text-align:center;'><b>Total</b></td>";
                strExcel += "<tr><td colspan=5><b>Total</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqno != 0) {

                        RFQFetchTotalPriceForReport(data[0].vendorNames[k].vendorID, k)
                        str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                        strExcel += "<td id=totBoxinitialwithoutgstExcel" + data[0].vendorNames[k].vendorID + " class=text-right><td id=totBoxwithoutgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxwithgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxTaxExcel" + data[0].vendorNames[k].vendorID + "></td>";
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }

                }
                str += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";
                strExcel += "<td>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";



                ////For Loading Factor
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
                str += "<td colspan=7>&nbsp;</td></tr>";
                strExcel += "<td colspan=7>&nbsp;</td></tr>";

                //For L1 Package
                str += "<tr><td colspan=5 style='text-align:center;'><b>L1 Package</b></td>";
                strExcel += "<tr><td colspan=5 ><b>L1 Package</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        RFQFetchL1Package(data[0].vendorNames[k].vendorID, k)
                        str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                        strExcel += "<td>&nbsp;</td><td id=withoutGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=withGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totL1RankExcel" + data[0].vendorNames[k].vendorID + "></td>";
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }

                }
                str += "<td colspan=7>&nbsp;</td></tr>";
                strExcel += "<td colspan=7>&nbsp;</td></tr>";

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

                        if (data[0].vendorNames[k].seqno != '0') {

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

                //// ***************** End  Commercial Row



                //For Vendor Comments

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

                //For Qusetion table
                // ***************** Start  Answer Question Row
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
                    t = 0;
                    for (var k = 1; k <= data[0].vendorNames.length; k++) {

                        t = k;

                    }
                    strQ += "<td colspan=" + (t + 2) + ">No Questions Mapped</td>";
                    strQ += "</tr>";

                }
                // ***************** END  Answer Question Row
                // ***************** Start  Define Technical  Approver Row**********************
                strQ += " <tr><td><b>Technical Approval Required</b></td>";

                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {
                    t = k;

                }
                if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "afterrfq") {
                    strQ += "<td>After All RFQ Responses</td>"
                    strQ += '<td colspan=' + (t + 2) + '><a href="javascript:;" class="btn btn-xs yellow" id=btn_techmapaaprover onclick="fnForwardforAllvendorTechnical()"> Technical Approval</a></td>';

                }
                else if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "rfq") {
                    strQ += "<td colspan=" + (t + 2) + ">With individual RFQ Response</td>"
                }
                else {
                    strQ += "<td colspan=" + (t + 2) + ">Not Required</td>"
                }

                strQ += "</tr>";
                //// ***************** END  Define Technical  Row **********************
                //// ***************** Start  Technical Approver Row**********************

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

    // jQuery.unblockUI();

}
function RFQFetchTotalPriceForReport(VendorID, Counter) {


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchTotalPriceForReport/?RFQID=" + RFQID + "&VendorId=" + VendorID + "&RFQVersionId=99&BidID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $("#totBoxinitialwithoutgst" + VendorID).html(thousands_separators(data[0].initialTotalPriceExTax));
            $("#totBoxinitialwithoutgstExcel" + VendorID).html(thousands_separators(data[0].initialTotalPriceExTax));
            $("#totBoxwithoutgst" + VendorID).html(thousands_separators(data[0].totalPriceExTax));
            $("#totBoxwithgst" + VendorID).html(thousands_separators(data[0].totalPriceIncTax) + " &nbsp;<a class='lambdafactor' style='cursor:pointer' onclick=editwithgstlambdafactor(" + data[0].totalPriceIncTax + "," + Counter + "," + VendorID + ")><i class='fa fa-pencil'></i></a>");
            $("#totBoxTax" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
            $("#totBoxwithoutgstExcel" + VendorID).html(data[0].totalPriceExTax);
            $("#totBoxwithgstExcel" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
            $("#totBoxTaxExcel" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
            $(".lambdafactor").addClass('hide');

        }, error: function (xhr, status, error) {

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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            return false;
            jQuery.unblockUI();
        }
    });
}
var max = 0;
function FetchRFQVersion() {
    max = 0;
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQVersions/?RFQID=" + RFQID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $("#ddlrfqVersion").empty();
            if (data.length > 0) {
                max = data[0].rfqVersionId;

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
            return false;
            jQuery.unblockUI();
        }

    });

}

function fetchAttachments() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
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
                    str += '<td class=style="width:50%!important"><a id=eRFqTerm' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFile(this)" href="javascript:;" >' + data[0].attachments[i].rfqAttachment + '</a></td>';
                    jQuery('#tblAttachments').append(str);

                }
            }
            else {
                jQuery('#tblAttachments').append("<tr><td>No Attachments</td></tr>");


            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            return false;
            jQuery.unblockUI();
        }

    })
}
function fetchReguestforQuotationDetails() {
    var attachment = '';
    var termattach = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {
            var replaced1 = '';
            $('#tbldetailsExcel > tbody').empty();

            if (RFQData.length > 0) {

                jQuery('#RFQSubject').html(RFQData[0].general[0].rfqSubject)
                jQuery('#RFQDescription').html(RFQData[0].general[0].rfqDescription)
                $('#Currency').html(RFQData[0].general[0].currencyNm)
                jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate);
                jQuery('#refno').html(RFQData[0].general[0].rfqReference)

                jQuery('#RFQStartDate').html(RFQData[0].general[0].rfqStartDate)
                jQuery('#RFQDeadline').html(RFQData[0].general[0].rfqEndDate)
                jQuery('#lblrfqconfigby').html(RFQData[0].general[0].rfqConfigureByName)


                if (RFQData[0].general[0].rfqTermandCondition != '') {
                    replaced1 = RFQData[0].general[0].rfqTermandCondition.replace(/\s/g, "%20")
                }

                $('#TermCondition').html(RFQData[0].general[0].rfqTermandCondition)

                $('#tbldetails').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + RFQData[0].general[0].rfqEndDate + "</td></tr>")
                $('#tbldetailsExcel > tbody').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + RFQData[0].general[0].rfqEndDate + "</td></tr>")

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
            return false;
            jQuery.unblockUI();
        }

    });

}
function fnfillPPCForm() {
    var encrypdata = fnencrypt("RFQID=" + RFQID)
    var url = 'AzurePPCForm.html?param=' + encrypdata;

    window.open(url, '_blank');
}

function fetchAzPPcFormDetails() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=" + $("#hdnRfqID").val() + "&BidID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data[0].azureDetails.length > 0) {
                $('#tblvendors > tbody').empty();
                $('#tblvendors > thead').empty();
                $('#tabApp').removeClass('hide')
                $('#tabApp').addClass('active')
                $('#LiViewPPCApproval').addClass('active')
                $('#LiViewPPCApproval').removeClass('hide')
                $('#tab_0').addClass('hide')

                jQuery('#lblintroduction').html(data[0].azureDetails[0].introduction)
                jQuery('#lblcostbenfit').html(data[0].azureDetails[0].costBenefitAnalysis)
                jQuery('#lblrepeatorder').html(data[0].azureDetails[0].recomRepeatOrder == 'Y' ? 'Yes' : 'No')
                jQuery('#lblbudgetavail').html(data[0].azureDetails[0].budgetavailabilty);
                jQuery('#lblpartyordergiven').html(data[0].azureDetails[0].workordergiven);
                jQuery('#lblawardL1').html(data[0].azureDetails[0].awardcontractthanL1);
                jQuery('#lbllessthan3quotes').html(data[0].azureDetails[0].lessthan3Quotes);
                jQuery('#lblcompletionsechdule').html(data[0].azureDetails[0].completionsechdule);
                jQuery('#lblrationalspliting').html(data[0].azureDetails[0].splitingorder01Vendor);
                jQuery('#lblgeneralremarks').html(data[0].azureDetails[0].generalRemarks);
                jQuery('#lblenquirynotsent').html(data[0].azureDetails[0].enquirynotsentvendors);
                jQuery('#lblissuingrfqtovendor').html(data[0].azureDetails[0].issuingRFQtoVendor);

                jQuery('#lblenquiryissuedon').html(data[0].azureDetails[0].enquiryIssuedOn);
                jQuery('#lblenquiryissuedthrough').html(data[0].azureDetails[0].enquiryIssuedthrogh);
                jQuery('#lbllowestpriceoffer').html(data[0].azureDetails[0].recomOrderLowPriceOffer == 'Y' ? 'Yes' : 'No');
                jQuery('#lblsupportedenclosure').html(data[0].azureDetails[0].recomSuppEnclosure);
                jQuery('#lblfinalprice').html(data[0].azureDetails[0].recomCompFinalPrice);
                jQuery('#lblquotationparties').html(data[0].azureDetails[0].recomQuotationofParties);
                jQuery('#lblorderrecomparty').html(data[0].azureDetails[0].workOrderRecomParty);
                jQuery('#lblpurchaseorder').html(data[0].azureDetails[0].purchaseOrder);
                jQuery('#lblinternalcost').html(data[0].azureDetails[0].internalCostestimate);
                jQuery('#lblterms').html(data[0].azureDetails[0].terms);
                jQuery('#lblscopeofwork').html(data[0].azureDetails[0].scopeofwork);
                jQuery('#lbldeliverables').html(data[0].azureDetails[0].deliverables);
                jQuery('#lblapymentterms').html(data[0].azureDetails[0].paymentterms);
                jQuery('#lbltaxesduties').html(data[0].azureDetails[0].applicableTaxduty);
                jQuery('#lblLD').html(data[0].azureDetails[0].whetherLDApplicable);
                jQuery('#lblCPBG').html(data[0].azureDetails[0].whetherCPBGApplicable);
                jQuery('#lblPRDetails').html(data[0].azureDetails[0].pRDetails);
                var validatescm = "Yes";
                var TPI = "Yes"
                if (data[0].biddingVendor.length > 0) {
                    $('#tblvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th style='width:20%!important;'>TPI</th></tr></thead>");
                    for (i = 0; i < data[0].biddingVendor.length; i++) {
                        if (data[0].biddingVendor[i].quotedValidatedSCM == "Y") {
                            validatescm = "Yes";
                        }
                        else if (data[0].biddingVendor[i].quotedValidatedSCM == "N") {
                            validatescm = "No";
                        }
                        else {
                            validatescm = "NA";
                        }
                        if (data[0].biddingVendor[i].tpi == "Y") {
                            TPI = "Yes";
                        }
                        else if (data[0].biddingVendor[i].tpi == "N") {
                            TPI = "No";
                        }
                        else {
                            TPI = "NA";
                        }
                        $('#tblvendors').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + ">" + (data[0].biddingVendor[i].quotationReceived == 'Y' ? 'Yes' : 'No') + "</td><td id=TDTechAccep" + i + ">" + (data[0].biddingVendor[i].texhnicallyAcceptable == 'Y' ? 'Yes' : 'No') + "</td><td id=TDpolexp" + i + ">" + (data[0].biddingVendor[i].politicallyExposed == 'Y' ? 'Yes' : 'No') + "</td><td id=TDvalidatescm" + i + ">" + validatescm + "</td><td id=TPI" + i + ">" + TPI + "</td></tr>")
                    }
                    $('#tblvendors').append("</tbody>");
                }
                var attach = "";
                jQuery("#tblAttachments").empty();

                if (data[0].attachments.length > 0) {
                    $('#tblPPCAttachments').removeClass('hide')
                    jQuery('#tblPPCAttachments').append("<thead><tr><th class='bold'>Attachment</th></tr></thead>");
                    for (i = 0; i < data[0].attachments.length; i++) {
                        attach = data[0].attachments[i].attachment.replace(/\s/g, "%20");
                        var str = '<tr><td><a id=eRFqTerm' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFilePPC(this)" href="javascript:;" >' + data[0].attachments[i].attachment + "</a></td>";
                        jQuery('#tblPPCAttachments').append(str);
                    }
                }
            }
            else {
                $('#tab_0').removeClass('hide')
                $('#tabApp').addClass('hide')
                $('#tabApp').removeClass('active')
                $('#LiViewPPCApproval').removeClass('active')
                $('#LiViewPPCApproval').addClass('hide')
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


    })
}
function DownloadFilePPC(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val() + '/PPC');
}
function fnRemoveClassTab0() {
    $('#tab_0').removeClass('hide')
}
var allUsers
function fetchRegisterUser() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                allUsers = data;
            }
            else {
                allUsers = '';
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
jQuery("#txtApprover").keyup(function () {
    $('#hdnApproverID').val('0')

});
jQuery("#txtApprover").typeahead({
    source: function (query, process) {
        var data = allUsers;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.userName] = username;
            usernames.push(username.userName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].userID != "0") {
            sessionStorage.setItem('hdnApproverid', map[item].userID);
            $('#hdnApproverID').val(map[item].userID)
            $('#hdnAppEmailIDID').val(map[item].emailID)
            var firstTestrole = map[item].roleName.split(' ').shift()
            if (firstTestrole.toLowerCase() == "finance") {
                $('#drp_isAppObs').attr('disabled', 'disabled');
                $('#hdnApproverType').val('F')
                $('#optFC').show();
                $('#drp_isAppObs').val('F')
            }
            else {
                $('#drp_isAppObs').removeAttr('disabled');
                $('#hdnApproverType').val('P')
                $('#optFC').hide();
                $('#drp_isAppObs').val('A');
            }

        }
        else {
            gritternotification('Please select Approver  properly!!!');
        }

        return item;
    }

});


//var formFCApprover = $('#frmMapFCApprover');
var formApprover = $('#frmMapApprover');
var formAward = $('#formAwardedsubmit')
var errorawd = $('.alert-danger', formAward);
var successawd = $('.alert-success', formAward);
function formvalidate() {
    // Map Approver Validation
    formApprover.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {

        },
        invalidHandler: function (event, validator) {
        },

        highlight: function (element) {
            $(element).closest('.col-md-6').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.col-md-6').removeClass('has-error');

        },
        errorPlacement: function (error, element) {

        },
        success: function (label) {
        },
        submitHandler: function (form) {
            MapApprover();
        }

    });
    //formFCApprover.validate({

    //    doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
    //    errorElement: 'span', //default input error message container
    //    errorClass: 'help-block help-block-error', // default input error message class
    //    focusInvalid: false, // do not focus the last invalid input
    //    rules: {

    //    },
    //    invalidHandler: function (event, validator) {
    //    },

    //    highlight: function (element) {
    //        $(element).closest('.col-md-6').addClass('has-error');

    //    },
    //    unhighlight: function (element) {
    //        $(element).closest('.col-md-6').removeClass('has-error');

    //    },
    //    errorPlacement: function (error, element) {

    //    },
    //    success: function (label) {
    //    },
    //    submitHandler: function (form) {
    //        MapFCApprover();
    //    }

    //});
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

        invalidHandler: function (event, validator) { //display error alert on form submit              
            successawd.hide();
            errorawd.show();
            $('#diverrordiv2').hide();

        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.Input-group,.xyz').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.Input-group,.xyz').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label
                .closest('.Input-group,.xyz').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {

            //AwardCommeRFQ();

        }
    });
}
var rowApp = 0;
function addApprovers() {
    var status = "true"; var Apptype = ''; var FCStatus = "true"
    $("#tblapprovers tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(0)').html()) == $('#hdnApproverID').val()) {
            status = "false"
        }
        if ($.trim(this_row.find('td:eq(6)').html()) == $('#hdnApproverType').val() && $('#hdnApproverType').val() == 'F') {
            FCStatus = "false"
        }
    });
    if ($('#hdnApproverID').val() == "0" || jQuery("#txtApprover").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Select Approver Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApprover").val('')
        jQuery("#hdnApproverID").val('0')
        $('#hdnApproverType').val('0')
        $('#drp_isAppObs').removeAttr('disabled');
        $('#drp_isAppObs').val('A');
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('Approver is already mapped for this RFQ.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApprover").val('')
        jQuery("#hdnApproverID").val('0')
        $('#drp_isAppObs').removeAttr('disabled');
        $('#drp_isAppObs').val('A');
        $('#hdnApproverType').val('0')
        return false;
    }
    else if (FCStatus == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('FC Approver is already mapped for this RFQ.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApprover").val('')
        jQuery("#hdnApproverID").val('0')
        $('#drp_isAppObs').removeAttr('disabled');
        $('#drp_isAppObs').val('A');
        $('#hdnApproverType').val('0')
        return false;
    }
    else {
        rowApp = rowApp + 1;
        if ($('#drp_isAppObs').val() == "F" && $('#hdnApproverType').val() == "F") {
            Apptype = 'Finance Controller Approver';
            $('#drp_isAppObs').val('A')
        }
        else if ($('#drp_isAppObs').val() == "A" && $('#hdnApproverType').val() != "F") {
            Apptype = 'Approver';
        }
        else {
            Apptype = 'Observer';
        }

        if (!jQuery("#tblapprovers thead").length) {
            jQuery("#tblapprovers").append("<thead><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:30%!important'>Role</th></thead>");
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td class=hide>' + $('#hdnApproverID').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApprover").val() + '</td><td>' + $('#hdnAppEmailIDID').val() + '</td><td>' + Apptype + '</td><td class=hide>' + $('#drp_isAppObs').val() + '</td><td class=hide>' + $('#hdnApproverType').val() + '</td></tr>');
        }
        else {
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td class=hide>' + $('#hdnApproverID').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApprover").val() + '</td><td>' + $('#hdnAppEmailIDID').val() + '</td><td>' + Apptype + '</td><td class=hide>' + $('#drp_isAppObs').val() + '</td><td class=hide>' + $('#hdnApproverType').val() + '</td></tr>');
        }

        if (jQuery('#tblapprovers tr').length == 1) {
            jQuery('#btnPPCSubmit').attr("disabled", "disabled");
        }
        else {
            jQuery('#btnPPCSubmit').removeAttr("disabled");
        }
        jQuery("#txtApprover").val('')
        jQuery("#drp_isAppObs").val('A')
        jQuery("#hdnApproverID").val('0')
        $('#hdnApproverType').val('0')
        $('#drp_isAppObs').removeAttr('disabled');
    }
}
function deleteApprow(approwid) {
    rowApp = rowApp - 1;
    $('#' + approwid.id).remove()

    if (jQuery('#tblapprovers tr').length == 1) {
        jQuery('#btnPPCSubmit').attr("disabled", "disabled");
    }
    else {
        jQuery('#btnPPCSubmit').removeAttr("disabled");
    }
}
function MapApprover() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvers = '';
    var FCCheck = 'N';
    var PPCCheck = 'N';
    var rowCount = jQuery('#tblapprovers tr').length;
    if (rowCount > 1) {
        $("#tblapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim(this_row.find('td:eq(5)').html()) + '~' + $.trim(this_row.find('td:eq(6)').html()) + '#';
            if ($.trim(this_row.find('td:eq(6)').html()) == "F") {
                FCCheck = "Y";
            }
            if ($.trim(this_row.find('td:eq(6)').html()) == "P") {
                PPCCheck = "Y";
            }
        })
    }
    if (FCCheck == "N") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Select atleast one Finance Controller Approver for RFQ Approval');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        approvers = '';
        jQuery.unblockUI();
        return false;
    }
    else if (PPCCheck == "N") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Select atleast one PPC Approver for RFQ Approval');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        approvers = '';
        jQuery.unblockUI();
        return false;
    }
    else {
        var Approvers = {
            "ApproverType": "P",
            "RFQID": parseInt($('#hdnRfqID').val()),
            "CreatedBy": sessionStorage.getItem('UserID'),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "Type": "SendActivityCommToFC",
            "IsApproverObserver": $('#drp_isAppObs').val(),
            "PPCApprovers": approvers
        }

        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "Azure/ins_PPCApproval",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Approvers),
            dataType: "json",
            success: function (data) {

                $('#msgSuccessApp').show();
                $('#msgSuccessApp').html('Activity Forward to FC Approvers successfully!');
                Metronic.scrollTo($('#msgSuccessApp'), -200);
                $('#msgSuccessApp').fadeOut(7000);
                bootbox.dialog({
                    message: "Activity Forward to FC Approvers successfully!",
                    buttons: {
                        confirm: {
                            label: "Yes",
                            className: "btn-success",
                            callback: function () {
                                window.location = "index.html";

                            }
                        }

                    }
                });
                return false;

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
}

function fnOpenPopupApprovers() {
    fnGetApprovers();
}

$("#MapppcApprover").on("hidden.bs.modal", function () {
    jQuery("#txtApprover").val('')
    $('#hdnApproverID').val('0')
    $('#hdnApproverType').val('0')
    $('#hdnAppEmailIDID').val('0')
});
function fnGetApprovers() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var str = "";

            jQuery("#tblapprovers").empty();
            if (data[0].approvers.length > 0) {
                for (var i = 0; i < data[0].approvers.length; i++) {

                    if (data[0].approvers[i].approverType == "P" || data[0].approvers[i].approverType == "F") {
                        rowApp = rowApp + 1;
                        if (rowApp == 1) {
                            jQuery('#tblapprovers').append("<thead><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Role</th></thead><tbody>");
                        }
                        str = "<tr id=trAppid" + rowApp + "><td class=hide>" + data[0].approvers[i].userID + "</td>";
                        str += '<td><button type="button" class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                        str += "<td>" + data[0].approvers[i].userName + "</td>";
                        str += "<td>" + data[0].approvers[i].emailID + "</td>";
                        if (data[0].approvers[i].showQuotedPrice == "A" && data[0].approvers[i].approverType == "F") {
                            str += "<td>Finance Controller Approver</td>";
                        }
                        else if (data[0].approvers[i].showQuotedPrice == "A" && data[0].approvers[i].approverType != "F") {
                            str += "<td>Approver</td>";
                        }
                        else {
                            str += "<td>Observer</td>";
                        }
                        str += "<td class=hide>" + data[0].approvers[i].showQuotedPrice + "</td><td class=hide>" + data[0].approvers[i].approverType + "</td></tr>";
                        jQuery('#tblapprovers').append(str);
                    }

                }
                jQuery('#tblapprovers').append("</tbody>")

                if (jQuery('#tblapprovers tr').length <= 1) {
                    jQuery('#btnPPCSubmit').attr("disabled", "disabled");
                }
                else {
                    jQuery('#btnPPCSubmit').removeAttr("disabled");
                }
            }
            else {

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
            return false;

        }

    })
}



function fetchApproverRemarks() {
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/FetchApproverRemarks/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + $('#hdnRfqID').val() + "&ApprovalType=" + AppType,
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
                $('#tblremarksforward').append('<tr><th> Action</th><th>For</th><th class=hide>Action Type</th><th>Remarks</th><th>Date</th></tr>')
                $('#tblremarksapprover').append('<tr><th>Action</th><th>For</th><th class=hide>Action Type</th><th>Remarks</th><th>Date</th></tr>')
                $('#tblremarksawared').append('<tr><th>Action</th><th>For</th><th class=hide>Action Type</th><th>Remarks</th><th>Date</th></tr>')
                $('#tblapprovalprocess').append('<tr><th>Action</th><th>For</th><th class=hide>Action Type</th><th>Remarks</th><th>Date</th></tr>')
                if (AppStatus == 'Reverted') {
                    jQuery("#lblrevertedComment").text(data[0].remarks);
                    jQuery("#RevertComment").show();
                    $('#frmdivremarksforward').removeClass('col-md-12');
                    $('#frmdivremarksforward').addClass('col-md-6');
                    $('#frmdivforward').show();
                    for (var i = 0; i < data.length; i++) {
                        $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].forwardedTo + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + data[i].remarks + '</td><td>' + data[i].receiptDt + '</td></tr>')

                    }
                }
                $('#frmdivremarksapprover').removeClass('col-md-12');
                $('#frmdivremarksapprover').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {

                    $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].forwardedTo + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + data[i].remarks + '</td><td>' + data[i].receiptDt + '</td></tr>')

                }
                $('#frmdivapprove').show()
                $('#frmdivremarksawarded').removeClass('col-md-12');
                $('#frmdivremarksawarded').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {
                    $('#tblremarksawared').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].forwardedTo + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + data[i].remarks + '</td><td>' + data[i].receiptDt + '</td></tr>')

                }
                $('#frmdivawarded').show()
                jQuery("#lblLastcomments,#LblLastcomments,#lbllastcommentSeaAward").text(data[0].remarks);
            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
            jQuery.unblockUI();
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

    })
}
var error2 = $('.alert-danger', formC);
var success2 = $('.alert-success', formC);
var errorFWD = $('.alert-danger', formFWD);
var successFWD = $('.alert-success', formFWD);
var formC = $('#frmsubmitappComm');
var formFWD = $('#formsubmitadmin');
function validateAppsubmitData() {

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

        invalidHandler: function (event, validator) { //display error alert on form submit              
            success2.hide();
            error2.show();
            // App.scrollTo(error1, -300);
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.Input-group').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.Input-group').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label
                .closest('.Input-group').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {

            ApprovalCommercialApp();

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

        invalidHandler: function (event, validator) { //display error alert on form submit              
            successFWD.hide();
            errorFWD.show();
            // App.scrollTo(error1, -300);
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.Input-group').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.Input-group').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label
                .closest('.Input-group').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {

            fnFWDeRFQ();

        }
    });
}
function fnFWDeRFQ() {
    var Approvers = {
        "ApproverType": "P",
        "FromUserId": sessionStorage.getItem('UserID'),
        "Remarks": $('#txtbidspecification').val(),
        "RFQID": parseInt(RFQID),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActionType": "Forward",
        "Action": 'Forward',
        "AwardQuery": ''
    }
    // alert(JSON.stringify(Approvers))
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQPPCApprove",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {
            // if (data.length > 0) {
            bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });


            //  }
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
function ApprovalCommercialApp() {

    var approvalbyapp = {
        "ApproverType": AppType,
        "FromUserId": sessionStorage.getItem('UserID'),
        "Remarks": $('#txtRemarksAppC').val(),
        "RFQID": parseInt(RFQID),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActionType": "Approver",
        "Action": $('#ddlActionType').val(),
        "AwardQuery": ''
    };


    console.log(JSON.stringify(approvalbyapp))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQPPCApprove",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(approvalbyapp),
        crossDomain: true,
        dataType: "json",
        success: function () {
            bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });

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

///---*** aawrd RFQ

var rowitems = 0
function addmorevendorRemarks() {
    var str = '';


    $('#drpVendors').rules('add', {
        required: true,
    });
    $('#txtRemarksAward').rules('add', {
        required: true,
    });
    if (formAward.valid() == true) {

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

        formAward.validate()
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
            formAward.validate()
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
    if (formAward.valid() == true) {
        if ($('#txtRemarksAward').val() != '' && $('#drpVendors').val() != '') {
            $('#diverrordiv2').show()
            $('#errordiv2').text('Your data is not inserted. Please do press "+" button after enter Remarks.')
            $('#diverrordiv2').fadeOut(5000)
            jQuery.unblockUI();

        }
        else {
            var approvalbyapp = {
                "ApproverType": "P",
                "FromUserId": sessionStorage.getItem('UserID'),
                "Remarks": $('#txtRemarksAppC').val(),
                "RFQID": parseInt(RFQID),
                "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
                "ActionType": "Approver",
                "Action": $('#ddlActionType').val(),
                "AwardQuery": ''
            };
            var approvalbyapp = {
                "ApproverType": "P",
                "FromUserId": sessionStorage.getItem('UserID'),
                "Remarks": $('#txtRemarksAward').val(),
                "RFQID": parseInt(RFQID),
                "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
                "ActionType": "Award",
                "Action": "Awarded",
                "AwardQuery": vendors
            };


            jQuery.ajax({
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQPPCApprove",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                type: "POST",
                cache: false,
                data: JSON.stringify(approvalbyapp),
                crossDomain: true,
                dataType: "json",
                success: function () {
                    bootbox.alert("Transaction Successful..", function () {
                        window.location = "index.html";
                        return false;
                    });

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
        formAward.validate()
        jQuery.unblockUI();
        return false;
    }
}

//***** Commenteed Code
//var allFCUsers
//function fetchRegisterFCUser() {
//    jQuery.ajax({
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=00",
//        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
//        cache: false,
//        crossDomain: true,
//        dataType: "json",
//        success: function (data) {

//            if (data.length > 0) {
//                allFCUsers = data;
//            }
//            else {
//                allFCUsers = '';
//            }

//        },
//        error: function (xhr, status, error) {

//            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
//            if (xhr.status == 401) {
//                error401Messagebox(err.Message);
//            }
//            else {
//                fnErrorMessageText('error', '');
//            }
//            jQuery.unblockUI();
//            return false;

//        }


//    });

//}

//jQuery("#txtApproverFC").keyup(function () {
//    $('#hdnApproverFCID').val('0')

//});

//jQuery("#txtApproverFC").typeahead({
//    source: function (query, process) {
//        var data = allFCUsers;
//        usernames = [];
//        map = {};
//        var username = "";
//        jQuery.each(data, function (i, username) {
//            map[username.userName] = username;
//            usernames.push(username.userName);
//        });

//        process(usernames);

//    },
//    minLength: 2,
//    updater: function (item) {
//        if (map[item].userID != "0") {
//            sessionStorage.setItem('hdnApproverFCID', map[item].userID);
//            $('#hdnApproverFCID').val(map[item].userID)
//            $('#hdnAppFCEmailIDID').val(map[item].emailID)

//        }
//        else {
//            gritternotification('Please select Finance Controller properly!!!');
//        }

//        return item;
//    }

//});


//var rowFCApp = 0;
//function addApproversFC() {
//    var status = "true"; var Apptype = ''
//    $("#tblapproversFC tr:gt(0)").each(function () {
//        var this_row = $(this);
//        if ($.trim(this_row.find('td:eq(0)').html()) == $('#hdnApproverFCID').val()) {
//            status = "false"
//        }
//    });
//    if ($('#hdnApproverFCID').val() == "0" || jQuery("#txtApproverFC").val() == "") {
//        $('.alert-danger').show();
//        $('#spandangerFC').html('Please Select Approver Properly');
//        Metronic.scrollTo($(".alert-danger"), -200);
//        $('.alert-danger').fadeOut(7000);
//        jQuery("#txtApproverFC").val('')
//        jQuery("#hdnApproverFCID").val('0')
//        return false;
//    }
//    else if (status == "false") {
//        $('.alert-danger').show();
//        $('#spandangerFC').html('FC Approver is already mapped for this RFQ.');
//        Metronic.scrollTo($(".alert-danger"), -200);
//        $('.alert-danger').fadeOut(7000);
//        jQuery("#txtApproverFC").val('')
//        jQuery("#hdnApproverFCID").val('0')
//        return false;
//    }
//    else {
//        rowFCApp = rowFCApp + 1;

//        if (!jQuery("#tblapproversFC thead").length) {
//            jQuery("#tblapproversFC").append("<thead><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th></thead>");
//            jQuery("#tblapproversFC").append('<tr id=trFCAppid' + rowFCApp + '><td class=hide>' + $('#hdnApproverFCID').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteAppFCrow(trFCAppid' + rowFCApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApproverFC").val() + '</td><td>' + $('#hdnAppFCEmailIDID').val() + '</td></tr>');
//        }
//        else {
//            jQuery("#tblapproversFC").append('<tr id=trFCAppid' + rowFCApp + '><td class=hide>' + $('#hdnApproverFCID').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteAppFCrow(trFCAppid' + rowFCApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApproverFC").val() + '</td><td>' + $('#hdnAppFCEmailIDID').val() + '</td></tr>');
//        }

//        if (jQuery('#tblapproversFC tr').length == 1) {
//            jQuery('#btnFCSubmit').attr("disabled", "disabled");
//        }
//        else {
//            jQuery('#btnFCSubmit').removeAttr("disabled");
//        }
//        jQuery("#txtApproverFC").val('')
//        jQuery("#hdnApproverFCID").val('0')

//    }
//}
//function deleteAppFCrow(approwid) {
//    rowFCApp = rowFCApp - 1;
//    $('#' + approwid.id).remove()

//    if (jQuery('#tblapproversFC tr').length == 1) {
//        jQuery('#btnFCSubmit').attr("disabled", "disabled");
//    }
//    else {
//        jQuery('#btnFCSubmit').removeAttr("disabled");
//    }
//}
//function MapFCApprover() {
//    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
//    var approvers = '';
//    var rowCount = jQuery('#tblapproversFC tr').length;
//    if (rowCount > 1) {
//        $("#tblapproversFC tr:gt(0)").each(function () {
//            var this_row = $(this);
//            approvers = approvers + $.trim(this_row.find('td:eq(0)').html()) + '#';
//        })
//    }
//    var Approvers = {
//        "ApproverType": "F",
//        "RFQID": parseInt($('#hdnRfqID').val()),
//        "CreatedBy": sessionStorage.getItem('UserID'),
//        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
//        "Type": "SendActivityCommToFC",
//        "IsApproverObserver": '',
//        "PPCApprovers": approvers
//    }
//    //alert(JSON.stringify(Approvers))
//    jQuery.ajax({
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        url: sessionStorage.getItem("APIPath") + "Azure/ins_PPCApproval",
//        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
//        crossDomain: true,
//        async: false,
//        data: JSON.stringify(Approvers),
//        dataType: "json",
//        success: function (data) {

//            $('#msgSuccessApp').show();
//            $('#msgSuccessApp').html('Activity Forward to Finance Controller Approver successfully!');
//            Metronic.scrollTo($('#msgSuccessApp'), -200);
//            $('#msgSuccessApp').fadeOut(7000);
//            bootbox.dialog({
//                message: "Activity Forward to Finance Controller Approver successfully!",
//                buttons: {
//                    confirm: {
//                        label: "Yes",
//                        className: "btn-success",
//                        callback: function () {
//                            window.location = "index.html";

//                        }
//                    }

//                }
//            });
//            return false;

//        },
//        error: function (xhr, status, error) {

//            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
//            if (xhr.status == 401) {
//                error401Messagebox(err.Message);
//            }
//            else {
//                fnErrorMessageText('spandangerFC', '');
//            }
//            jQuery.unblockUI();
//            return false;

//        }


//    });
//}

//function fnOpenPopupFCApprovers() {
//    fnGetFCApprovers();
//}

//$("#MapFCApprover").on("hidden.bs.modal", function () {
//    jQuery("#txtApproverFC").val('')
//    $('#hdnApproverFCID').val('0')

//});
//function fnGetFCApprovers() {
//    jQuery.ajax({
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
//        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
//        cache: false,
//        crossDomain: true,
//        dataType: "json",
//        success: function (data) {
//            var str = "";

//            jQuery("#tblapproversFC").empty();
//            if (data[0].approvers.length > 0) {
//                for (var i = 0; i < data[0].approvers.length; i++) {

//                    if (data[0].approvers[i].approverType == "F") {
//                        rowFCApp = rowFCApp + 1;
//                        if (rowFCApp == 1) {
//                            jQuery('#tblapproversFC').append("<thead><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th></thead><tbody>");
//                        }
//                        str = "<tr id=trFCAppid" + rowFCApp + "><td class=hide>" + data[0].approvers[i].userID + "</td>";
//                        str += '<td><button type="button" class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteAppFCrow(trFCAppid' + rowFCApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
//                        str += "<td>" + data[0].approvers[i].userName + "</td>";
//                        str += "<td>" + data[0].approvers[i].emailID + "</td></tr>";

//                        jQuery('#tblapproversFC').append(str);
//                    }

//                }
//                jQuery('#tblapproversFC').append("</tbody>")

//                if (jQuery('#tblapproversFC tr').length <= 1) {
//                    jQuery('#btnFCSubmit').attr("disabled", "disabled");
//                }
//                else {
//                    jQuery('#btnFCSubmit').removeAttr("disabled");
//                }
//            }
//            else {

//            }

//        },
//        error: function (xhr, status, error) {

//            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
//            if (xhr.status == 401) {
//                error401Messagebox(err.Message);
//            }
//            else {
//                fnErrorMessageText('error', '');
//            }
//            jQuery.unblockUI();
//            return false;

//        }

//    })
//}