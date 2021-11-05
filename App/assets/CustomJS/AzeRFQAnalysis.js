

$(".thousandseparated").inputmask({
    alias: "decimal",
    rightAlign: false,
    groupSeparator: ",",
    radixPoint: ".",
    autoGroup: true,
    integerDigits: 40,
    digitsOptional: true,
    allowPlus: false,
    allowMinus: false,
    'removeMaskOnSubmit': true

});
$('#txtloadingfactorreason').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
    $('#hdnRfqID').val(RFQID);
    var sub = getUrlVarsURL(decryptedstring)["RFQSubject"].replace(/%20/g, ' ');
    jQuery("#txtrfirfqsubject").val(decodeURIComponent(sub) + ' - ' + RFQID)

    fetchReguestforQuotationDetails()
    FetchRFQVersion();
    fetchAttachments();
    fetchApproverRemarks();
    fetchAzPPcFormDetails();
}

function fnfillPPCForm() {
    var encrypdata = fnencrypt("RFQID=" + $('#hdnRfqID').val())
    var url = 'AzurePPCForm.html?param='+encrypdata;
    window.open(url, '_blank');
   
}
function fetchRFIRFQSubjectforReport(subjectFor) {

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/fetchRFQSubjectforReport/?SubjectFor=" + subjectFor + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            sessionStorage.setItem('hdnRfqSubject', JSON.stringify(data));
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
    });

}

jQuery("#txtrfirfqsubject").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnRfqSubject');
        Subject = [];
        map = {};
        var commonsubject = "";
        jQuery.each(jQuery.parseJSON(data), function (i, commonsubject) {
            map[commonsubject.rfqSubject] = commonsubject;
            Subject.push(commonsubject.rfqSubject);
        });

        process(Subject);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].rfqid != '0') {

            $('#hdnRfqID').val(map[item].rfqid);
            fetchReguestforQuotationDetails()
            FetchRFQVersion();
            fetchAttachments();
            fetchApproverRemarks();
            fetchAzPPcFormDetails();
        }

        return item;
    }

});

sessionStorage.setItem("RFQVersionId", "0")


function stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
        var p = width
        for (; p > 0 && str[p] != ' '; p--) {
        }
        if (p > 0) {
            var left = str.substring(0, p);
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}
function getSummary(vendorid,version) {
    var encrypdata = fnencrypt("RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + vendorid + "&max=" + version + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&RFQVersionTxt=" + $("#ddlrfqVersion option:selected").text().replace(' ', '%20'))
    window.open("eRFQReport.html?param=" + encrypdata, "_blank")

}
var Vendor;
function fetchrfqcomprative() {

   
    sessionStorage.setItem("RFQVersionId", $("#ddlrfqVersion option:selected").val())
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    

    //alert(sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&dateTo=" + dtto + "&dateFrom=" + dtfrom + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=" + $('#ddlrfqVersion option:selected').val())
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=" + $('#ddlrfqVersion option:selected').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            //   alert(data[0].VendorNames.length)
            var str = '';
            var strHead = '';
            var strHeadExcel = '';
            var strExcel = '';
            
            var totallowestValue = 0;
            var strQ = '';
            var strHeadQ = '';
            var strHeadExcelQ = '';
            var strExcelQ = '';
           
           

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

            // ShowPrice = data[0].ShowPrice[0].ShowQuotedPrice;
            sessionStorage.setItem('ShowPrice', '');


            if (data[0].vendorNames.length > 0) {
                Vendor = data[0].vendorNames;
                $('#displayTable').show();
                $('#btnExport').show()
                $('#btnPDF').show()
                if ($('#hdnUserID').val() == sessionStorage.getItem('UserID')) {
                    $('#cancl_btn').show();
                }
                else {
                    $('#cancl_btn').hide();
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
                minprice = 0;
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

                        str += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poUnitRate) + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        strExcel += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + (data[0].quotesDetails[i].poUnitRate) + "</td><td>" + (data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                       
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
                        str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                        strExcel += "<td id=totBoxinitialwithoutgstExcel" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxwithgstExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totBoxTaxExcel" + data[0].vendorNames[k].vendorID + "></td>";
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        strExcel += "<td colspan=4>&nbsp;</td>";
                    }

                }
                str += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";
                strExcel += "<td>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";



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
                str += "<tr><td colspan=5 style='text-align:center;'><b>L1 Package</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
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

                        if (data[0].vendorNames[k].seqNo != '0') {

                            str += "<td colspan=4 style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[k].vendorID + "'\,\'" + data[0].vendorNames[k].rfqVersionId + "'\)  style='color:#2474f6; text-decoration:underline;'><b>" + data[0].vendorNames[k].vName + "<b></a></td>";
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
                            str += "<td colspan=7>" + data[0].commercialTerms[p].requirement + "</td>";
                            strExcel += "<td colspan=7>" + data[0].commercialTerms[p].requirement + "</td>";

                            str += " </tr>";
                            strExcel += " </tr>";
                            jQuery('#tblRFQComprativetest').append(str);
                        }
                    }
                }

                // ***************** End  Commercial Row



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
                // ***************** END  Answer Question Row
                // ***************** Start  Define Technical  Approver Row**********************
                strQ += " <tr><td><b>Technical Approval Required</b></td>";
                //alert(data[0].VendorNames[0].IsApproverRequired)
                strQ += " <tr><td><b>Technical Approval Required</b></td>";

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
                
                strQ += "</tr>"
                // ***************** END  Define Technical  Row **********************
                // ***************** Start  Technical Approver Row**********************
               
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




                if ($("#ddlrfqVersion option:selected").val() != 99) {
                    //For ReInvite Row
                    str += "<tr id='reinvitationTR'><td colspan=5><b>Re-Invitation Row</b></td>";
                    var maxValue = -1;
                    for (var k = 0; k < data[0].vendorNames.length; k++) {
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
                          
                            $("#btn-reInvite").attr('disabled', false)
                            $("#btn-reInvite").removeClass('hide')
                            str += "<td colspan='4' class='text-center'><label class='checkbox-inline'><input type='checkbox' class='chkReinvitation' style='position:relative;margin-right:5px;' value=" + data[0].VendorNames[k].VendorID + " />Re-Invite Vendor For Fresh Quote</label></td>"; //<a class='btn green'>Re-Invite Vendor</a>


                        }
                        else {
                           
                            $("#btn-reInvite").attr('disabled', true);
                            $("#btn-reInvite").addClass('hide')
                            str += "<td colspan=4>&nbsp;</td>";
                        }


                    }
                    str += "<td colspan='5'>&nbsp;</td>";
                    str += " </tr>";
                }

                if ($("#ddlrfqVersion option:selected").val() == 99) {
                    
                    $("#btn-reInvite").attr('disabled', true);
                    $("#btn-reInvite").addClass('hide')
                    $("#btn_mapaaprover").addClass('hide');
                    $(".lambdafactor").addClass('hide');

                }
                else {
                  
                    $("#btn_mapaaprover").removeClass('hide');
                    if ($("#ddlrfqVersion option:selected").val() == '1') {
                        $("#btn_mapaaprover").removeClass('hide');
                    }
                    //$("#btn-reInvite").attr('disabled', false)
                    // $("#btn-reInvite").removeClass('hide')
                }


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
            // alert(data[0].Attachments.length)
            jQuery("#tblAttachments").empty();

            if (data[0].attachments.length > 0) {
                jQuery("#tblAttachments").append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")

                for (var i = 0; i < data[0].attachments.length; i++) {
                    var str = "<tr><td style='width:50%!important'>" + data[0].attachments[i].rfqAttachmentDescription + "</td>";
                    str += '<td class=style="width:50%!important"><a id=eRFqTerm' + i +' style="pointer:cursur;text-decoration:none;" onclick="DownloadFile(this)" href="javascript:;" >' + data[0].attachments[i].rfqAttachment + '</a></td>';
                    jQuery('#tblAttachments').append(str);

                }
            }
            else {
                jQuery('#tblAttachments').append("<tr><td>No Attachments</td></tr>");
                
            }

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
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val());
}

function fncheckradiotext() {
    var flagMapApprover = 'F';
    $("input[type='radio']:checked").each(function () {
        var idVal = $(this).attr("id");

        if ($("span[for='" + idVal + "']").text() == "Yes") {
            flagMapApprover = 'T';
        }
       
    });

    if (flagMapApprover == "T") {
        $('#btn_mapaaprover').removeAttr('disabled')
    }
    else {
        $('#btn_mapaaprover').attr('disabled', 'disabled')
    }
}

function RFQFetchTotalPriceForReport(VendorID, Counter) {
    

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchTotalPriceForReport/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&BidID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $("#totBoxwithoutgst" + VendorID).html(thousands_separators(data[0].totalPriceExTax) + " &nbsp;<a class='lambdafactor' style='cursor:pointer' onclick=editwithgstlambdafactor(" + data[0].totalPriceExTax + "," + Counter + "," + VendorID + ")><i class='fa fa-pencil'></i></a>");
            $("#totBoxwithoutgstExcel" + VendorID).html(data[0].totalPriceExTax);
            $("#totBoxwithgst" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
            $("#totBoxwithgstExcel" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
            $("#totBoxTax" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));


            $("#totBoxTaxExcel" + VendorID).html(thousands_separators(data[0].totalPriceIncTax));
            if ($("#ddlrfqVersion option:selected").val() == 99) {


                $(".lambdafactor").addClass('hide');

            }
            else {
                $(".lambdafactor").removeClass('hide');

            }


        }, error: function (xhr, status, error) {

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
    });
}
function RFQFetchL1Package(VendorID, Counter) {


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchL1Package/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&BidID=0",
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
    });
}
function editwithgstlambdafactor(pricewithgst, rowid, vendorid) {
   
    $("#editloadingfactor").modal('show');
    $("#hdngstprice").val(pricewithgst);
    $("#hdnvendorid").val(vendorid);
}
function updloadingfactor() {
    var Data = {
        "RFQID": parseInt($('#hdnRfqID').val()),
        "VersionID": parseInt(sessionStorage.getItem("RFQVersionId")),
        "VendorID": parseInt($("#hdnvendorid").val()),
        "LoadingFactor": removeThousandSeperator($("#txtloadingfactor").val()),
        "LoadingFactorReason": $("#txtloadingfactorreason").val()
    }
   //  alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQ_VendorLoadingFactor/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            //if (data[0].LoadingFactor > 0) {

            var price = parseFloat(data[0].loadingFactor + data[0].totalPriceIncTax)
            $('#LFactor' + $("#hdnvendorid").val()).html(thousands_separators(data[0].loadingFactor))
            $('#LoadingF' + $("#hdnvendorid").val()).html(thousands_separators(price))
            $('#LoadingReason' + $("#hdnvendorid").val()).html($("#txtloadingfactorreason").val())
            $('#LFactorexcel' + $("#hdnvendorid").val()).html(thousands_separators(data[0].loadingFactor))
            $('#LoadingFexcel' + $("#hdnvendorid").val()).html(thousands_separators(price))
            $('#LoadingReasonexcel' + $("#hdnvendorid").val()).html($("#txtloadingfactorreason").val())
            setTimeout(function () {
                $("#editloadingfactor").modal('hide');
                fetchrfqcomprative();
            }, 1000)
            // }
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
$("#editloadingfactor").on("hidden.bs.modal", function () {
    $("#txtloadingfactor").val('')
    $("#hdngstprice").val('');
    $("#hdnvendorid").val('');
    $("#txtloadingfactorreason").val('');
    $('#hdnAppEmailIDID').val('')
});
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
            $("#ddlrfqVersion").empty();
            if (data.length > 0) {
                $('#ddlrfqVersion').append('<option  value="99" >Final Version</option>');
              
                max = data[0].rfqVersionId;
                for (var i = 0; i <= data[0].rfqVersionId; i++) {
                     $('#ddlrfqVersion').append(jQuery('<option ></option>').val(i).html((i + 1) + " Quote"));

                }
            }

        }, error: function (xhr, status, error) {

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
    });

}

$("#ddlrfqVersion").change(function () {
    $("#displayTable").hide();
    $('#displayComparativetabs').hide();
    $("#btnExport").hide();
    $("#btnPDF").hide()
});
jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
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
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {
            var replaced1 = '';
            $('#tbldetailsExcel > tbody').empty();
            if (RFQData.length > 0) {
                jQuery('#RFQSubject').text(RFQData[0].general[0].rfqSubject)
                jQuery('#RFQDescription').html(RFQData[0].general[0].rfqDescription)
                $('#Currency').html(RFQData[0].general[0].currencyNm)
                jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate);
                jQuery('#refno').html(RFQData[0].general[0].rfqReference)

                jQuery('#RFQStartDate').html(RFQData[0].general[0].rfqStartDate)
                jQuery('#RFQDeadline').html(RFQData[0].general[0].rfqEndDate)
                jQuery('#lblrfqconfigby').html(RFQData[0].general[0].rfqConfigureByName)

                $('#hdnUserID').val(RFQData[0].general[0].userId)

                if (RFQData[0].general[0].rfqTermandCondition != '') {
                    replaced1 = RFQData[0].general[0].rfqTermandCondition.replace(/\s/g, "%20")
                }

                $('#TermCondition').html(RFQData[0].general[0].rfqTermandCondition)

                $('#tbldetails').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + RFQData[0].general[0].rfqEndDate + "</td></tr>")
                $('#tbldetailsExcel > tbody').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + RFQData[0].general[0].rfqEndDate + "</td></tr>")

            }
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
    });

}


var form = $('#RFIRFQREport');
var formApprover = $('#frmMapApprover');

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
                fetchrfqcomprative()
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
}
    
var allUsers
function fetchRegisterUser() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) ,
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

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }

    });

}
jQuery("#txtApprover").keyup(function () {
    $('#hdnApproverID').val('0')
    $('#hdnAppEmailIDID').val('')

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

        }
        else {
            gritternotification('Please select Approver  properly!!!');
        }

        return item;
    }

});
var rowApp = 0;
function addApprovers() {
    var status = "true"; var Apptype = ''
    $("#tblapprovers tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(0)').html()) == $('#hdnApproverID').val()) {
            status = "false"
        }
    });
    if ($('#hdnApproverID').val() == "0" || jQuery("#txtApprover").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Select Approver Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApprover").val('')
        jQuery("#hdnApproverID").val('0')
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('Technical Approver is already mapped for this RFQ.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApprover").val('')
        jQuery("#hdnApproverID").val('0')
        return false;
    }
    else {
        rowApp = rowApp + 1;
        if ($('#drp_ShowPrice').val() == "Y") {

            Apptype = 'Yes';
        }
        else {
            Apptype = 'No';
        }

        if (!jQuery("#tblapprovers thead").length) {
            jQuery("#tblapprovers").append("<thead><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:30%!important'>Show Price</th><th class='bold' style='width:30%!important'>Sequence</th></thead>");
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td class=hide>' + $('#hdnApproverID').val() + '</td><td class=hide>' + $('#drp_ShowPrice').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApprover").val() + '</td><td>' + $('#hdnAppEmailIDID').val() + '</td><td class=hide>' + Apptype + '</td><td>' + $('#drp_ShowPrice').val() + '</td><td>' + rowApp + '</td></tr>');
        }
        else {
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td class=hide>' + $('#hdnApproverID').val() + '</td><td class=hide>' + $('#drp_ShowPrice').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApprover").val() + '</td><td>' + $('#hdnAppEmailIDID').val() + '</td><td class=hide>' + Apptype + '</td><td>' + $('#drp_ShowPrice').val() + '</td><td>' + rowApp + '</td></tr>');
        }

        if (jQuery('#tblapprovers tr').length == 1) {
            jQuery('#btnTechSubmit').attr("disabled", "disabled");
        }
        else {
            jQuery('#btnTechSubmit').removeAttr("disabled");
        }
        jQuery("#txtApprover").val('')
        jQuery("#drp_ShowPrice").val('N')
        jQuery("#hdnApproverID").val('0')

    }
}
function deleteApprow(approwid) {
    rowApp = rowApp - 1;
    $('#' + approwid.id).remove()

    if (jQuery('#tblapprovers tr').length == 1) {
        jQuery('#btnTechSubmit').attr("disabled", "disabled");
    }
    else {
        jQuery('#btnTechSubmit').removeAttr("disabled");
    }
}
function MapApprover() {

    var approvers = '';
    var rowCount = jQuery('#tblapprovers tr').length;
    if (rowCount > 1) {
        $("#tblapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim(this_row.find('td:eq(7)').html()) + '~' + $.trim(this_row.find('td:eq(1)').html()) + '#';
        })
    }
    var Approvers = {
        "ApproverType": "T",
        "Approvers": approvers,
        "RFQID": parseInt($('#hdnRfqID').val()),
        "CreatedBy": sessionStorage.getItem('UserID'),
        "ShowQuotedPrice": $('#drp_ShowPrice').val(),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }


    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQTechInsApprover",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {
            jQuery('#btnTechSubmit').attr("disabled", "disabled");
            $('#msgSuccessApp').show();
            $('#msgSuccessApp').html('Approver mapped successfully!');
            Metronic.scrollTo($('#msgSuccessApp'), -200);
            $('#msgSuccessApp').fadeOut(7000);
            jQuery.unblockUI();
            setTimeout(function () {
                $("#MapTechnicalApprover").modal('hide');
                fetchrfqcomprative();
            }, 1000);
            return true;

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

    });

}
function fnUpdateApproverFlag() {
    var Querystring = '';
    var checkedval = '';
    
    if ($("#AppYes").is(":checked")) {
        checkedval = $("#AppYes").val()
       
    }
    else {
        checkedval = $("#AppNo").val()
        
    }

    Querystring = Querystring + "Update eRFQVendorDetails set IsApproverRequired='" + checkedval + "' where  RFQID=" + $('#hdnRfqID').val() + ";";//VendorID=" + Vendor[i].VendorID + " and
    var Attachments = {
        "RFQId": parseInt($('#hdnRfqID').val()),
        "QueryString": Querystring

    }
    // alert(JSON.stringify(Attachments))
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eUpdateApproverRequiredNot",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Attachments),
        dataType: "json",
        success: function (data) {
            return true;
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
    });
}

var str = '';
function checkForSelectedVendors() {

    //getting value for Checked Checheck boxes
    $(".chkReinvitation:checked").each(function (x, i) {
        str += $(this).val() + ',';

    });

    if (str == '') {
        $("#error").html("PLease select atleast one vendor");
        $(".alert-danger").show();
        Metronic.scrollTo($(".alert-danger"), -200);
        $(".alert-danger").fadeOut(7000);
        return false;

    }
    else {
        $("#modalreInviteDate").modal("show");
    }




}

function ReInviteVendorsForRFQ() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    str = str.substring(0, str.length - 1);
    $('#SaveExsist').attr('disabled', 'disabled')
    var data = {
        "RFQID": parseInt($("#hdnRfqID").val()),
        "VendorIDs": str,
        "ExtendedDate": $("#txtextendDate").val(),
        "RFQSubject": $("#RFQSubject").html(),
        "UserID": sessionStorage.getItem("UserID"),
        "ReInviteRemarks": $("#txtReInviteRemarks").val()

    }
    // alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQ_ReInviteVendor/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           // if (data == '1') {
                $("#modalreInviteDate").modal("hide");
                bootbox.alert("Re-Invitation For RFQ sent successfully", function () {
                    location.reload();
                    $('#SaveExsist').removeAttr('disabled')
                    jQuery.unblockUI();
                });
            //} else {
            //    alert("Some Error")
            //    $('#SaveExsist').removeAttr('disabled')
            //    jQuery.unblockUI();
            //}

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
                $('#SaveExsist').removeAttr('disabled')
                $("#modalreInviteDate").modal("hide");
            }
            
            jQuery.unblockUI();
            return false;
            
        }
        
    });


}

$('#btnPDF').click(function () {
    var encrypdata = fnencrypt("RFQID=" + $("#hdnRfqID").val() + "&FromPage=Analysis&BidID=" + 0 + "&Version=" + $('#ddlrfqVersion').val())
    var url = "ViewReportRFQ.html?param=" + encrypdata;
    var win = window.open(url, "_blank");
     win.focus();
   
})

function fetchAzPPcFormDetails() {
   // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=" + $("#hdnRfqID").val(),
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
                $('#btn_fillPPCForm').attr('disabled', 'disabled')

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
                jQuery('#lblissuingrfqtovendor').html(data[0].azureDetails[0].issuingRFQtoVendor);
                jQuery('#lblenquirynotsent').html(data[0].azureDetails[0].enquirynotsentvendors);

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
                jQuery('#lblPRDetails').html(data[0].azureDetails[0].prDetails);
                jQuery('#hdnPPCID').val(data[0].azureDetails[0].ppcid);
               
                //alert(data[0].BiddingVendor.length)
                if (data[0].biddingVendor.length > 0) {
                    $('#tblvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:30%!important;'>Quotation Received</th><th style='width:30%!important;'>Technically Acceptable</th></tr></thead><tbody>");
                    for (i = 0; i < data[0].biddingVendor.length; i++) {
                        $('#tblvendors').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + ">" + (data[0].biddingVendor[i].quotationReceived == 'Y' ? 'Yes' : 'No') + "</td><td id=TDTechAccep" + i + ">" + (data[0].biddingVendor[i].texhnicallyAcceptable == 'Y' ? 'Yes' : 'No') + "</td></tr>")
                       
                    }
                    $('#tblvendors').append("</tbody>");
                }
                var attach = "";
                jQuery("#tblPPCAttachments").empty();

                if (data[0].attachments.length > 0) {
                    $('#tblPPCAttachments').removeClass('hide')
                    jQuery('#tblPPCAttachments').append("<thead><tr><th class='bold'>Attachment</th></tr></thead>");
                    for (i = 0; i < data[0].attachments.length; i++) {
                       
                        var str = '<tr><td><a id=eRFqTerm' + i +' style="pointer:cursur;text-decoration:none;" onclick="DownloadFilePPC(this)" href="javascript:;">' + data[0].attachments[i].attachment + '</a></td>';
                        jQuery('#tblPPCAttachments').append(str);
                    }
                }
            }
            else {
                if ($("#ddlrfqVersion option:selected").val() != 99) {
                    $('#btn_fillPPCForm').attr('disabled', 'disabled')
                }
                else {
                    
                    $('#btn_fillPPCForm').removeAttr('disabled')
                }
              
                $('#tab_0').removeClass('hide')
                $('#tabApp').addClass('hide')
                $('#tabApp').removeClass('active')
                $('#LiViewPPCApproval').removeClass('active')
                $('#LiViewPPCApproval').addClass('hide')
            }
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
function DownloadFilePPC(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val()+'/PPC');
}
function fnRemoveClassTab0() {
    $('#tab_0').removeClass('hide')
}
function fetchApproverRemarks() {
   
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/FetchApproverRemarks/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + $('#hdnRfqID').val() + "&ApprovalType=P",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            
            $('#tblCommercialApproval').empty()
            $('#tblCommercialApprovalprev').empty()
            if (data.length > 0) {
                $('#tblCommercialApproval').removeClass('hide')
                $('#tblCommercialApprovalprev').removeClass('hide')
                $('#tblCommercialApproval').append('<tr><th>Action Taken By</th><th>Pending On</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                $('#tblCommercialApprovalprev').append('<tr><th>Action Taken By</th><th>Pending On</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                for (var i = 0; i < data.length; i++) {

                    $('#tblCommercialApproval').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].forwardedTo + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')
                    $('#tblCommercialApprovalprev').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].forwardedTo + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')

                }
            }
            else {
                $('#tblCommercialApproval').addClass('hide')
                $('#tblCommercialApprovalprev').addClass('hide')
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
                $('#tblapprovalprocessprev').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
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
jQuery("#cancl_btn").click(function () {
    $('#modalcancelremarks').modal('show');

});

function cancelBtnclick() {
    bootbox.dialog({
        message: "Are you sure want to cancel this bid?",
        // title: "Custom title",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {

                    bootbox.dialog({
                        message: "Do you want to send cancellation email to participants for this bid?",
                        // title: "Custom title",
                        buttons: {
                            confirm: {
                                label: "Yes",
                                className: "btn-success",
                                callback: function () {
                                    cancelRFQ('SendMail')
                                }
                            },
                            cancel: {
                                label: "No",
                                className: "btn-default",
                                callback: function () {
                                    cancelRFQ('NoMail')
                                }
                            }
                        }
                    });
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {

                }
            }
        }
    });

}
function cancelRFQ(mailparam) {
    var Cancelbid = {
        "BidID": parseInt($("#hdnRfqID").val()),
        "For": 'eRFQ',
        "Remarks": $('#txtRemarks').val(),
        "SendMail": mailparam,
        "UserID": sessionStorage.getItem('UserID')
    };
   // alert(JSON.stringify(Cancelbid))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/CancelBidDuringConfig",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(Cancelbid),
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data == '1') {
                bootbox.alert("RFQ Cancelled successfully.", function () {
                    window.location = "index.html";
                    return false;
                });
            }
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
        }
    });
}