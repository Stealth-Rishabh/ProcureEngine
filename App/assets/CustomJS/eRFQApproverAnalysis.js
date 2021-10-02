
var ShowPrice = "Y";
if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
    var AppType = getUrlVarsURL(decryptedstring)["AppType"];
    var FwdTo = getUrlVarsURL(decryptedstring)["FwdTo"];
    var AppStatus = getUrlVarsURL(decryptedstring)["AppStatus"];
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
else {
    $('#divRemarksAppComm').hide()
    $('#divRemarksAppTech').show()
}
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
var Vendor;
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
                 $('#tblremarksforward').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                $('#tblremarksapprover').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                $('#tblremarksawared').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                $('#tblapprovalprocess').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                if (AppStatus == 'Reverted') {
                    jQuery("#lblrevertedComment").text(data[0].remarks);
                    jQuery("#RevertComment").show();
                    $('#frmdivremarksforward').removeClass('col-md-12');
                    $('#frmdivremarksforward').addClass('col-md-6');
                    $('#frmdivforward').show();
                    for (var i = 0; i < data.length; i++) {
                         $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')
                           
                    }
                }
                $('#frmdivremarksapprover').removeClass('col-md-12');
                $('#frmdivremarksapprover').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {

                    $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')
                   
                }
                $('#frmdivapprove').show()
                $('#frmdivremarksawarded').removeClass('col-md-12');
                $('#frmdivremarksawarded').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {
                   $('#tblremarksawared').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')
                        
                }
                $('#frmdivawarded').show()
                jQuery("#lblLastcomments,#LblLastcomments,#lbllastcommentSeaAward").text(data[0].remarks);
            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
        }
    })
}
function getSummary(vendorid, version) {
    var encrypdata = fnencrypt("RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + vendorid + "&max=" + version + "&RFQVersionId=99&RFQVersionTxt=Final%20Version")
    window.open("eRFQReport.html?param=" + encrypdata, "_blank")

}

function fetchrfqcomprative() {
   
   
        
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=99",
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
          
            if (AppType == "T" && FwdTo != 'Admin') {
                ShowPrice = data[0].showPrice[0].showQuotedPrice;
                sessionStorage.setItem('ShowPrice', ShowPrice);
            }


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
                jQuery("#drpVendors").append(jQuery("<option ></option>").val("").html("Select"));
                for (var i = 0; i < data[0].vendorNames.length; i++) {
                    
                    if (data[0].vendorNames[i].seqno != 0) {

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
                

                var taxHRTextinc = stringDivider("Landed Unit Price (With GST)", 18, "<br/>\n");
                var taxHRTextEx = stringDivider("Landed Unit Price (Without GST)", 18, "<br/>\n");
                var initialtaxHRTextEx = stringDivider("Initial Landed Unit Price (Without GST) - R0  ", 18, "<br/>\n");
                var HRAmount = stringDivider("Amount (Inc. GST)", 8, "<br/>\n");
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
                            
                            if ((data[0].quotesDetails[i].rfqParameterId) == (data[0].quotesDetails[j].rfqParameterId)) {// true that means reflect on next vendor
                                x = x + 1;
                              
                                if (data[0].quotesDetails[j].vendorID == data[0].vendorNames[x].vendorID) {

                                    
                                    if (ShowPrice == "N") {
                                        str += "<td>Quoted</td>";
                                    }
                                    else {
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators(data[0].quotesDetails[j].initialQuotewithoutGST) + "</td>";
                                    }
                                    if (ShowPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        str += "<td class='text-right'>Quoted</td><td class='text-right'>Quoted</td><td class='VendorPriceNoTax text-right'>Quoted</td><td class='VendorPriceWithTax  text-right' >Quoted</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        str += "<td class='text-right' id=unitrate" + i + x + " style='color: red!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        str += "<td class='text-right' id=unitrate" + i + x + " style='color: blue!important;'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithoutGST) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].quotesDetails[j].rfqVendorPricewithGST) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].quotesDetails[j].unitRate) + "</td>";

                                    }
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
                        totallowestValue = totallowestValue + (data[0].quotesDetails[i].quantity * data[0].quotesDetails[i].lowestPriceValue)
                        str += "<td class=text-right>" + thousands_separators(data[0].quotesDetails[i].lowestPriceValue) + "</td><td>" + data[0].quotesDetails[i].pono + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poUnitRate) + "</td><td class=text-right>" + thousands_separators(data[0].quotesDetails[i].poValue) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        str += "</tr>"
                        jQuery('#tblRFQComprativetest').append(str);

                    }

                }

                str += "<tr><td colspan=5 style='text-align:center;'><b>Total</b></td>";
               
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqno != 0) {
                        RFQFetchTotalPriceForReport(data[0].vendorNames[k].vendorID, k)
                        str += "<td id=totBoxinitialwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxTax" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                       
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        
                    }

                }
                str += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";
               

                //For Loading Factor
                str += "<tr><td colspan=3 style='text-align:center;'><b>Loading Factor</b></td><td colspan=2 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            var p = thousands_separators(data[0].loadedFactor[k].loadedFactor + data[0].loadedFactor[k].sumwithGST);
                            if (p != 0) {
                                str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                                
                            }
                            else {

                                str += "<td colspan=4>&nbsp;</td>";
                               
                            }

                        }
                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";
               //For Loading Factor reason Row
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
               

                //For Commercial Rank
                str += "<tr><td colspan=5 style='text-align:center;'><b>Commercial Rank (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].lStatus.length; k++) {

                        if (data[0].lStatus[k].vendorID == data[0].vendorNames[l].vendorID) {
                            if (data[0].lStatus[k].status != 'N/A') {
                                str += "<td colspan=4 style='text-align:center;color: blue!important;'>" + data[0].lStatus[l].status + "</td>";
                               
                            }
                            else {
                                str += "<td colspan=3 style='text-align:center;color: red!important;'>" + data[0].lStatus[k].status + "</td>";
                                
                            }

                        }

                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";
                
                //For L1 Package
                str += "<tr><td colspan=5 style='text-align:center;'><b>L1 Package</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqno != 0) {
                        RFQFetchL1Package(data[0].vendorNames[k].vendorID, k)
                        str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                        
                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";
                        
                    }

                }
                str += "<td colspan=7>&nbsp;</td></tr>";
                

                //For Blank Row
                str += "<tr>";
               
                var t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {
                    t = k;
                }

                str += "<td colspan=" + (t + 10) + ">&nbsp;</td></tr>";
                

                //For Commercial Header Row
                // ***************** Start  Commercial Row
                if (data[0].commercialTerms.length > 0) {

                    str += "<tr style='background: #f5f5f5; color:light black;'>";
                    
                    str += "<td><b>SrNo</b></td><td colspan=4><b>Other Commercial Terms</b></td>";
                   
                    for (var k = 0; k < data[0].vendorNames.length; k++) {

                        if (data[0].vendorNames[k].seqno != '0') {

                            str += "<td colspan=4 style='text-align:center;'><a onclick=getSummary(\'" + data[0].vendorNames[k].vendorID + "'\,\'" + data[0].vendorNames[k].rfqVersionId + "'\)  style='color:#2474f6; text-decoration:underline;'><b>" + data[0].vendorNames[k].vName + "<b></a></td>";
                           

                        }
                        else {
                            str += "<td colspan=4 style='text-align:center;'><b>" + data[0].vendorNames[k].vName; +"</b></td>";
                           

                        }

                    }
                    str += "<td colspan=7><b>Our Requirement</b></td></tr>";
                    

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
                          

                            for (var s = 0; s < data[0].commercialTerms.length; s++) {

                                if ((data[0].commercialTerms[p].rfqtcid) == (data[0].commercialTerms[s].rfqtcid)) {// true that means reflect on next vendor

                                    //  q = q + 1;
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

                // ***************** End  Commercial Row



                ////For Vendor Comments

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
                //// ***************** END  Answer Question Row
                // Technical Approver Row
                if (AppType != 'C') {
                    strQ += " <tr><td Colspan=2><b>Technical Approval</b></td>";
                    for (var k = 0; k < data[0].vendorNames.length; k++) {

                        strQ += "<td><input style='width:16px!important;height:16px!important;'  type='radio' name=AppRequired" + data[0].vendorNames[k].vendorID + " id=AppYes" + data[0].vendorNames[k].vendorID + " class='md-radio' value='Y'  checked/> &nbsp;<span for=AppYes" + data[0].vendorNames[k].vendorID + ">Yes</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style='width:16px!important;height:16px!important;' type='radio' class='md-radio' name=AppRequired" + data[0].vendorNames[k].vendorID + " id=AppNo" + data[0].vendorNames[k].vendorID + "    value='N'   /> &nbsp;<span for=AppNo" + data[0].vendorNames[k].vendorID + ">No</span></td>"

                    }
                    strQ += "</tr>"
                }
                //For Blank Row after question table 
                strQ += "<tr>";
               
                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {

                    t = k;

                }
                strQ += "<td colspan=" + (t + 2) + ">&nbsp;</td>";
               
                strQ += "</tr>";
               
                //// ***************** END  Define Technical  Row **********************
                //// ***************** Start  Technical Approver Row**********************

                // Technical Approver Status
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
                //  }
                //// ***************** END  Technical Approver Row

                //For Blank Row after question table 
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

function RFQFetchTotalPriceForReport(VendorID,Counter) {
   

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchTotalPriceForReport/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=99&BidID=0",// + sessionStorage.getItem("RFQVersionId"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(data) {
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

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
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

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
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
                    str += '<td class=style="width:50%!important"><a id=eRFQFile' + i +' style="pointer:cursur;text-decoration:none;" onclick="DownloadFile(this)"  href="javascript:;" >' + data[0].attachments[i].rfqAttachment + '</a></td>';
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
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
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

                $('#TermCondition').attr('href', 'PortalDocs/RFQ/' + $('#hdnRfqID').val() + '/' + replaced1.replace(/\s/g, "%20") + '').html(RFQData[0].general[0].rfqTermandCondition)

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

        invalidHandler: function (event, validator) { //display error alert on form submit              
            success1.hide();
            error1.show();
            
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

        invalidHandler: function (event, validator) { //display error alert on form submit              
            success2.hide();
            error2.show();
           
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
    formAward.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
           
            txtRemarksAward: {
                required: true,
            }
        },
        messages: {
           
            txtRemarksAward: {
                required: "Please enter your comment"
            }
        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
            successawd.hide();
            errorawd.show();
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

            AwardCommeRFQ();

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
        "Vendors": ''
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
            bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });
           
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
function AwardCommeRFQ() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendors = '';
    var a = $('#drpVendors').val();
    // alert(a)
    if (a != '' && a != null) {
        for (var i = 0; i < a.length; i++) {
            vendors += a[i] + ',';
        }
    }
    var approvalbyapp = {
        "ApproverType": "C",
        "FromUserId": sessionStorage.getItem('UserID'),
        "Remarks": $('#txtRemarksAward').val(),
        "RFQID": parseInt(RFQID),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActionType": "Award",
        "Action": "Awarded",
        "Vendors": vendors
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
            bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });

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
function fnFWDeRFQ()
{
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Approvers = {
        "ApproverType": "C",
        "FromUserId": sessionStorage.getItem('UserID'),
        "Remarks": $('#txtfwdToCommApproverrem').val(),
        "RFQID": parseInt($('#hdnRfqID').val()),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActionType": "Forward",
        "Action": 'Forward',
        "Vendors": ''
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
            //if (data.length > 0) {
                bootbox.alert("Transaction Successful..", function () {
                    window.location = "index.html";
                    return false;
                });
               
                
            //}
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
function ApprovalApp() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvalstatus = "";
    for (var i = 0; i < Vendor.length; i++) {
      
        if ($("#AppYes" + Vendor[i].vendorID).is(":checked")) {
            checkedval = $("#AppYes" + Vendor[i].vendorID).val()
        }
        else {
            checkedval = $("#AppNo" + Vendor[i].vendorID).val()
           
        }

        approvalstatus = approvalstatus + " Select " + RFQID + "," + Vendor[i].vendorID + ",PE.decrypt('" + sessionStorage.getItem("UserID") + "'),'" + checkedval + "' union all";
    }
    if (approvalstatus != '') {

        approvalstatus = "Insert into PE.eRFQVendorApprovalStatus(RFQID,VendorId,ApproverID,isApproved)" + approvalstatus;
        approvalstatus = approvalstatus.substring(0, approvalstatus.length - 10);

    }
    else {
        approvalstatus = "Print 1";
    }
  
    var approvalbyapp = {
        "RFQID": parseInt(RFQID),
        "FromUserId": sessionStorage.getItem("UserID"),
        "ActivityDescription": jQuery("#RFQSubject").text(),
        "Remarks": jQuery("#txtRemarksApp").val(),
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "ApprovalStatus": approvalstatus
       
    };
   // alert(JSON.stringify(approvalbyapp))
   // console.log(JSON.stringify(approvalbyapp))
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
          
            //if (parseInt(data) > 0) {
                bootbox.alert("Transaction Successful..", function () {
                    window.location = "index.html";
                    return false;
                });
            //}
           

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



