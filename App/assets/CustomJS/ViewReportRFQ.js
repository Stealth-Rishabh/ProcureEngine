$('#printed_by').html(sessionStorage.getItem('UserName'));
function getCurrenttime() {
    postfix = new Date()

    $('#printed_on').html(postfix);
}

$(document).ready(function () {

    getCurrenttime();
    param = getUrlVars()["param"];
    decryptedstring = fndecrypt(param);
    RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
    var FromPage = getUrlVarsURL(decryptedstring)["FromPage"];
    var BidID = getUrlVarsURL(decryptedstring)["BidID"];
    var Version = getUrlVarsURL(decryptedstring)["Version"];
    $('#hdnRfqID').val(RFQID)
    $('#hdnversion').val(Version)
    fetchReguestforQuotationDetails(RFQID)
    if (FromPage == "RASumm") {
        fetchrfqcomprativeRA(RFQID, BidID)
    }
    else {
        if (isboq == "N") {
            fetchrfqcomprative(RFQID)
        }
        else {
            fetchrfqcomprativeBoq(RFQID);
        }

    }
    fetchAttachments();
    fetchApproverRemarks(RFQID);


});

var RFqsub = "";
var Bidno;
var ShowPrice = 'Y';
function fetchReguestforQuotationDetails(RFQID) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        async: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data) {
            let RFQData = Data.rData
            var replaced1 = '';
            $('#tbldetails > tbody').empty();
            if (RFQData.length > 0) {
                ShowPrice = RFQData[0].general[0].showQuotedPrice;
                RFqsub = RFQData[0].general[0].rfqSubject;
                $('#logo').attr("src", RFQData[0].general[0].logoImage);
                $('#spnconfiguredby').html(RFQData[0].general[0].rfqConfigureByName)

                if (RFQData[0].general[0].boqReq == true) {
                    isboq = "Y";

                }
                else {
                    isboq = "N";

                }

                jQuery('#tbldetails >tbody').append("<tr><td><b>RFQ Subject:</b> " + RFQData[0].general[0].rfqSubject + "</td><td><b>RFQ Description:</b> " + RFQData[0].general[0].rfqDescription + "</td></tr><tr><td><b>Event ID:</b> " + RFQID + "</td><td><b>RFQ Date:</b> " + fnConverToLocalTime(RFQData[0].general[0].rfqStartDate) + ' - ' + fnConverToLocalTime(RFQData[0].general[0].rfqEndDate) + "</td></tr><tr><td><b>Currency:</b> " + RFQData[0].general[0].currencyNm + "</td><td><b>Conversion Rate:</b> " + RFQData[0].general[0].rfqConversionRate + " </td></tr><tr><td><b>Ref No.:</b> " + RFQData[0].general[0].rfqReference + " </td></tr>")

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });

}
function fetchrfqcomprative(RFQID) {

    var reInvited = '';

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + RFQID + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=" + $('#hdnversion').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (Data, status, jqXHR) {
            let data = Data.rData
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
            $('#tblRFQComprative > tbody').empty();
            jQuery('#tblRFQComprativetest > thead').empty()
            $('#tblRFQComprativetest > tbody').empty();

            jQuery('#tblRFQComprativeQ > thead').empty()
            jQuery('#tblRFQComprativetestQ > thead').empty()
            $('#tblRFQComprativeQ > tbody').empty();
            $('#tblRFQComprativetestQ > tbody').empty();

            sessionStorage.setItem('ShowPrice', '');


            if (data[0].vendorNames.length > 0) {
                Vendor = data[0].vendorNames;

                //For Printing Header
                //@abheedev bug349 start
                strHead = "<tr  style='background: #f5f5f5; color:light black;'><th style='display: none;' >&nbsp;</th><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th><th>Target/Budget price</th>"
                //@abheedev bug349 end
                strHeadQ = "<tr  style='background:#f5f5f5; color:light black;'><th colspan='6'>Question</th>"

                for (var i = 0; i < data[0].vendorNames.length; i++) {
                    strHead += "<th colspan='4' style='text-align:center;'>" + data[0].vendorNames[i].vendorName; +"</th>";

                    strHeadQ += "<th colspan='5' style='text-align:center;'>" + data[0].vendorNames[i].vendorName; +"</th>";


                }
                strHead += "<th>Line-wise Lowest Quote</th><th colspan='5' style='text-align:center;'>Last PO Details</th><th>Delivery Location</th>";
                strHead += "</tr>"
                strHeadQ += "<th colspan='7'>Our Requirement</th>"
                strHeadQ += "</tr>"

                //@abheedev bug349 start 
                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                //@abheedev bug349 end

                // anupam sir desired changes 21/10/2022 start
                for (var i = 0; i < data[0].vendorNames.length; i++) {

                    if (data[0].vendorNames[i].rfqStatus == 'C') {

                        strHead += "<th colspan='4' style='text-align:center;'>" + "Submission Time:" + fnConverToLocalTime(data[0].vendorNames[i].responseSubmitDT) + "</th>";
                    }
                    else if (data[0].vendorNames[i].rfqStatus == 'I') {

                        strHead += "<th colspan='4' style='text-align:center;'>Not Started</th>";
                    }
                    else {
                        strHead += "<th colspan='4' style='text-align:center;'>Not Started</th>";

                    }
                }
                strHead += "<th colspan=7>&nbsp;</th>";
                strHead += "</tr>"


                //@abheedev bug349 start
                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                //@abheedev bug349 end
                var initialtaxHRTextEx = stringDivider("Unit Price - R0 (Without GST)", 18, "<br/>\n");
                var taxHRTextinc = stringDivider("Unit Price  (With GST)", 18, "<br/>\n");
                var taxHRTextEx = stringDivider("Unit Price (Without GST)", 18, "<br/>\n");
                var HRAmount = stringDivider("Amount (Inc. GST)", 10, "<br/>\n");
                for (var j = 0; j < data[0].vendorNames.length; j++) {
                    strHead += "<th>" + initialtaxHRTextEx + "</th><th>" + taxHRTextEx + "</th><th>" + taxHRTextinc + "</th><th>" + HRAmount + "</th>";
                }
                strHead += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th><th>&nbsp;</th>";
                strHead += "</tr>";

                jQuery('#tblRFQComprative > thead').append(strHead);
                jQuery('#tblRFQComprativeQ > thead').append(strHeadQ);


                //For Printing Header Ends
                // anupam sir desired changes 21/10/2022 end

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


                }
                let totaltargetprice = 0;
                let ttpArray = [];
                for (var t = 0; t < data[0].quotesDetails.length; t++) {

                    let isPresent = ttpArray.includes(data[0].quotesDetails[t].rfqParameterId)
                    if (!isPresent) {
                        ttpArray.push(data[0].quotesDetails[t].rfqParameterId);
                        totaltargetprice = totaltargetprice + (data[0].quotesDetails[t].targetPrice * data[0].quotesDetails[t].quantity);
                    }
                    else {
                        break;
                    }
                }
                //abheedev bug 349 part2 start
                str += "<tr><td colspan=5 style='text-align:center;'><b>Total</b></td><td colspan=1 style='text-align:center;'><b>" + thousands_separators(totaltargetprice) + "</b></td>";
                //abheedev bug 349 part2 end
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
                if (ShowPrice == "Y" || totallowestValue == 0) {
                    str += "<td class=text-right>" + thousands_separators(totallowestValue) + "</td><td colspan=6>&nbsp;</td></tr>";
                }
                else {
                    if (totallowestValue != 0) {
                        str += "<td class=text-right>Quoted</td><td colspan=6>&nbsp;</td></tr>";

                    }
                }




                ////For Loading Factor
                str += "<tr><td colspan=3 style='text-align:center;'><b>Loading Factor</b></td><td colspan=3 style='text-align:center;'><b>Loaded Price</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>

                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {
                            var p = thousands_separators(data[0].loadedFactor[k].loadedFactor + data[0].loadedFactor[k].sumwithGST);
                            if (p != 0) {
                                if (ShowPrice == 'Y') {
                                    str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators(data[0].loadedFactor[k].loadedFactor) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>" + p + "</td><td>&nbsp;</td><td>&nbsp;</td>";
                                }
                                else {
                                    str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators((data[0].loadedFactor[k].loadedFactor).round(2)) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>Quoted</td><td>&nbsp;</td><td>&nbsp;</td>";
                                }
                            }
                            else {

                                str += "<td colspan=4>&nbsp;</td>";

                            }

                        }


                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";


                ////For Loading Factor reason Row
                //abheedev bug 349 part2 start
                str += "<tr><td colspan=6 style='text-align:center;'><b>Loading Reason</b></td>";
                //abheedev bug 349 part2 start
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            if (data[0].loadedFactor[k].loadingFactorReason != '') {
                                str += "<td style='text-align:left;' colspan=3 id=LoadingReason" + data[0].vendorNames[k].vendorID + ">" + data[0].loadedFactor[k].loadingFactorReason + "</td>";

                            }
                            else {

                                str += "<td colspan=4>&nbsp;</td>";

                            }

                        }


                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";


                ////For Commercial Rank
                //abheedev bug 349 part2 start
                str += "<tr><td colspan=6 style='text-align:center;'><b>Commercial Rank</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                //abheedev bug 349 part2 start

                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].lStatus.length; k++) {

                        if (data[0].lStatus[k].vendorID == data[0].vendorNames[l].vendorID) {
                            if (data[0].lStatus[k].status != 'N/A') {
                                str += "<td colspan=4 style='text-align:center;color: blue!important;'>" + data[0].lStatus[l].status + "</td>";

                            }
                            else {
                                str += "<td colspan=4 style='text-align:center;color: red!important;'>" + data[0].lStatus[k].status + "</td>";

                            }

                        }

                    }
                }
                str += "<td colspan=7>&nbsp;</td></tr>";


                ////For Blank Row
                str += "<tr>";

                var t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {
                    t = k;
                }

                str += "<td colspan=" + (t + 10) + ">&nbsp;</td></tr>";


                //For Commercial Header Row
                // ***************** Start  Commercial Row
                if (data[0].commercialTerms.length > 0) {
                    //alert(data[0].CommercialTerms.length)
                    //abheedev bug 349 part 2
                    str += "<tr style='background: #f5f5f5; color:light black;'>";
                    str += "<td><b>SrNo</b></td><td colspan=5><b>Other Commercial Terms</b></td>";

                    for (var k = 0; k < data[0].vendorNames.length; k++) {
                        str += "<td colspan=4 style='text-align:center;'><b>" + data[0].vendorNames[k].vName; +"</b></td>";

                    }
                    //abheedev bug 349 part 2
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
                            //abheedevbug 349 part2 start
                            str += "<tr><td>" + (p + 1) + "</td><td colspan=5>" + data[0].commercialTerms[p].termName + "</td>";
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



                //For Vendor Comments
                //abheedev bug 349 part2 start
                str += "<tr><td colspan=6><b>Vendor Remarks :</b></td>";
                //abheedev bug 349 part2 end
                for (var k = 0; k < data[0].vendorNames.length; k++) {

                    if (data[0].vendorNames[k].vendorRemarks != "") {
                        var VRemarks = stringDivider(data[0].vendorNames[k].vendorRemarks, 40, "<br/>\n");
                        str += "<td colspan='4' class='text-left' >" + VRemarks + "</td>";

                    }
                    else {
                        str += "<td colspan='4'>&nbsp;</td>";

                    }
                }
                str += "<td colspan=7>&nbsp;</td>";
                str += " </tr>";

                //** Add row Reinvitation Remarks & status
                if ($("#ddlrfqVersion option:selected").val() != 0) {
                    //abheedev bug 349 part 2 start
                    str += "<tr id='reinvitationTRRem'><td colspan=6><b>Re-Invitation Remarks</b></td>";
                    //abheedev bug 349 part 2 end
                    for (var k = 0; k < data[0].vendorNames.length; k++) {

                        if (data[0].vendorNames[k].reInvitedRemarks != "") {
                            var reinvitedRemarks = stringDivider(data[0].vendorNames[k].reInvitedRemarks, 40, "<br/>\n");
                            str += "<td colspan='4' class='text-center'>" + reinvitedRemarks + "</td>";
                        }
                        else {
                            str += "<td colspan=4>&nbsp;</td>";
                        }
                    }
                    str += "<td colspan='7'>&nbsp;</td>";
                    str += " </tr>";

                }

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
                            //abheedev bug349 part2 start
                            strQ += "<tr><td colspan='5'>" + data[0].questions[p].question + "</td>";
                            //abheedev bug349 part2 end

                            for (var s = 0; s < data[0].questions.length; s++) {

                                if ((data[0].questions[p].questionID) == (data[0].questions[s].questionID)) {// true that means reflect on next vendor

                                    //  q = q + 1;
                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].questions[s].vendorID == data[0].vendorNames[q].vendorID) {

                                            if (data[0].questions[s].answer != '' && data[0].questions[s].answer != 'Rejected') {
                                                strQ += "<td colspan='5'>" + data[0].questions[s].answer + "</td>";


                                            }
                                            else if (data[0].questions[s].answer == 'Rejected') {
                                                strQ += "<td colspan='5' style='color: red!important; text-align: center;'>Regretted</td>"


                                            }
                                            else {
                                                strQ += "<td colspan='5'  style='color: red!important; text-align: center;' >Not Quoted</td>";

                                            }

                                        }

                                    }
                                }
                            }


                            strQ += " <td>" + data[0].questions[p].requirement + "</td></tr>";

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
                    //abheedev bug 472-479
                    strQ += "<td colspan=" + 2 + ">&nbsp;</td><td colspan=" + (t + (4 * t) + 6) + " style='text-align:center'>No Questions Mapped</td>";

                    strQ += "</tr>";

                }
                // ***************** END  Answer Question Row

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

                            strQ += "<tr><td colspan='6'>" + data[0].approverStatus[p].approverName + "</td>";
                            for (var s = 0; s < data[0].approverStatus.length; s++) {

                                if ((data[0].approverStatus[p].approverID) == (data[0].approverStatus[s].approverID)) {// true that means reflect on next vendor

                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].approverStatus[s].vendorID == data[0].vendorNames[q].vendorID) {

                                            if (data[0].approverStatus[s].status == 'Approved') {
                                                strQ += "<td colspan='5' style='color: green!important; text-align: center;'>" + data[0].approverStatus[s].status + "</td>";


                                            }
                                            else if (data[0].approverStatus[s].status == 'Rejected') {
                                                strQ += "<td colspan='5' style='color: red!important; text-align: center;'>Not Approved</td>";


                                            }
                                            else {
                                                strQ += "<td colspan='5' style='color: blue!important; text-align: center;'>Pending</td>";


                                            }

                                        }
                                    }
                                }
                            }


                            strQ += "<td  id=techremark" + p + ">" + ((data[0].approverStatus[p].remarks).replaceAll("&lt;", "<")).replaceAll("&gt;", ">") + "</td> </tr>";

                            jQuery('#tblRFQComprativetestQ').append(strQ);

                        }

                    }

                }
                //  }
                // // ***************** END  Technical Approver Row





                jQuery('#tblRFQComprative').append(str);
                jQuery('#tblRFQComprativeQ').append(strQ);


            }
            else {
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

    //jQuery.unblockUI();

}
function fetchrfqcomprativeRA(RFQID, BidID) {

    Bidno = BidID;

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRA_RFQComprativeDetails/?RFQID=" + RFQID + "&BidID=" + BidID + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=" + $('#hdnversion').val(),
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

            jQuery('#tblRFQComprativetest > thead').empty()
            $('#tblRFQComprative > tbody').empty();
            $('#tblRFQComprativetest > tbody').empty();


            jQuery('#tblRFQComprativeQ > thead').empty()
            jQuery('#tblRFQComprativetestQ > thead').empty()
            $('#tblRFQComprativeQ > tbody').empty();
            $('#tblRFQComprativetestQ > tbody').empty();



            sessionStorage.setItem('ShowPrice', '');


            if (data[0].vendorNames.length > 0) {
                Vendor = data[0].vendorNames;
                $('#displayTable').show();
                $('#btnExport').show()
                $('#displayComparativetabs').show();
                //For Printing Header
                //@abheedev bug349 start
                strHead = "<tr  style='background: #f5f5f5; color:light black;'><th class='hide'>&nbsp;</th><th>SrNo</th><th>ItemCode</th><th>Short Name</th><th>Quantity</th><th>UOM</th><th>Target/Budget Price</th>"
                strHeadQ = "<tr  style='background:#f5f5f5; color:light black;'><th colspan='6'>Question</th><th colspan='6'>Our Requirement</th>"
                //@abheedev bug349 end
                for (var i = 0; i < data[0].vendorNames.length; i++) {


                    strHead += "<th colspan='3' style='text-align:center;'>" + data[0].vendorNames[i].vendorName; +"</th>";
                    strHeadQ += "<th colspan='3' style='text-align:center;'>" + data[0].vendorNames[i].vName; +"</th>";

                }
                strHead += "<th>Line-wise Lowest Quote</th><th colspan='5' style='text-align:center;'>Last PO Details</th>";
                strHead += "</tr>"


                strHeadQ += "</tr>"
                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";




                var taxHRTextinc = stringDivider("Landed Unit Price (Without GST) - After RA", 18, "<br/>\n");
                var taxHRTextEx = stringDivider("Landed Unit Price (Without GST)", 18, "<br/>\n");
                var HRAmount = stringDivider("Amount (Inc. GST)", 8, "<br/>\n");
                for (var j = 0; j < data[0].vendorNames.length; j++) {

                    strHead += "<th>" + taxHRTextEx + "</th><th>" + taxHRTextinc + "</th><th>" + HRAmount + "</th>";


                }
                strHead += "<th>" + taxHRTextEx + "</th><th>Po No</th><th>PO Date</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Value</th>";
                strHead += "</tr>";

                jQuery('#tblRFQComprative > thead').append(strHead);
                jQuery('#tblRFQComprativeQ > thead').append(strHeadQ);


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

                        //@abheedev bug349 start
                        str += "<tr><td style='display:none'>" + data[0].quotesDetails[i].vendorID + "</td><td>" + (i + 1) + "</td><td style='display:none'>" + data[0].quotesDetails[i].rfqParameterId + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + "</td><td>" + data[0].quotesDetails[i].uom + "</td><td>" + data[0].quotesDetails[i].targetPrice + "</td>";
                        //@abheedev bug349 end 

                        for (var j = 0; j < data[0].quotesDetails.length; j++) {

                            if ((data[0].quotesDetails[i].rfqParameterId) == (data[0].quotesDetails[j].rfqParameterId)) {// true that means reflect on next vendor
                                x = x + 1;

                                if (data[0].quotesDetails[j].vendorID == data[0].vendorNames[x].vendorID) {

                                    if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {

                                        str += "<td class='text-right' id=unitrate" + i + x + " >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right' style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].bidFinalPrice).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators((data[0].quotesDetails[j].withGSTBidValue).round(2)) + "</td>";// UnitRate

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {

                                        str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].bidFinalPrice).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators((data[0].quotesDetails[j].withGSTBidValue).round(2)) + "</td>";

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {

                                        str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right'  style='color: red!important;'>" + thousands_separators((data[0].quotesDetails[j].bidFinalPrice).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators((data[0].quotesDetails[j].withGSTBidValue).round(2)) + "</td>";

                                    }


                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].unitRate != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {

                                        str += "<td class='text-right' id=unitrate" + i + x + " >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right' style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].bidFinalPrice).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators((data[0].quotesDetails[j].withGSTBidValue).round(2)) + "</td>";

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
                        str += "<td class=text-right>" + thousands_separators((data[0].quotesDetails[i].lowestPriceValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td>";

                        str += "</tr>"


                        jQuery('#tblRFQComprativetest').append(str);

                    }

                }
                //abheedev bug 349 part2 start
                str += "<tr><td colspan=6 style='text-align:center;'><b>Total</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                //abheedev bug 349 part2 end
                for (var k = 0; k < data[0].vendorNames.length; k++) {
                    if (data[0].vendorNames[k].seqNo != 0) {
                        RFQFetchTotalPriceForReport(data[0].vendorNames[k].vendorID, k)
                        str += "<td id=totBoxwithoutgst" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totBoxwithoutgstRA" + data[0].VendorNames[k].vendorID + " class=text-right></td><td id=totBoxTax" + data[0].VendorNames[k].vendorID + " class=text-right></td>";
                    }
                    else {
                        str += "<td colspan=3>&nbsp;</td>";

                    }

                }
                str += "<td class=text-right>" + thousands_separators((totallowestValue).round(2)) + "</td><td colspan=5>&nbsp;</td></tr>";


                //For Loading Factor
                str += "<tr><td colspan=3 style='text-align:center;'><b>Loading Factor</b></td><td colspan=3 style='text-align:center;'><b>Loaded Price</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>

                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            var p = thousands_separators((data[0].loadedFactor[k].loadedFactor + data[0].loadedFactor[k].sumwithGST).round(2));
                            if (p != 0) {
                                str += "<td style='text-align:right;' id=LFactor" + data[0].vendorNames[k].vendorID + ">" + thousands_separators((data[0].loadedFactor[k].loadedFactor).round(2)) + "</td><td  id=LoadingF" + data[0].vendorNames[k].vendorID + " style='text-align:right;'>" + p + "</td><td>&nbsp;</td>";

                            }
                            else {

                                str += "<td colspan=3>&nbsp;</td>";

                            }

                        }


                    }
                }
                str += "<td colspan=6>&nbsp;</td></tr>";


                //For Loading Factor reason Row
                //abheedev bug 349 part 2 start
                str += "<tr><td colspan=6 style='text-align:center;'><b>Loading Reason</b></td>";
                //abheedev bug 349 part 2 end
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].loadedFactor.length; k++) {
                        if (data[0].loadedFactor[k].vendorID == data[0].vendorNames[l].vendorID) {

                            if (data[0].loadedFactor[k].loadingFactorReason != '') {
                                str += "<td style='text-align:left;' colspan=3 id=LoadingReason" + data[0].vendorNames[k].vendorID + ">" + data[0].loadedFactor[k].loadingFactorReason + "</td>";

                            }
                            else {

                                str += "<td colspan=3>&nbsp;</td>";

                            }

                        }


                    }
                }
                str += "<td colspan=6>&nbsp;</td></tr>";


                //For Commercial Rank
                //abheedev bug 349 part 2 start
                str += "<tr><td colspan=6 style='text-align:center;'><b>Commercial Rank</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                //abheedev bug 349 part 2 end
                for (var l = 0; l < data[0].vendorNames.length; l++) {
                    for (var k = 0; k < data[0].lStatus.length; k++) {

                        if (data[0].lStatus[k].vendorID == data[0].vendorNames[l].vendorID) {
                            if (data[0].lStatus[k].status != 'N/A') {
                                str += "<td colspan=3 style='text-align:center;color: blue!important;'>" + data[0].lStatus[l].status + "</td>";

                            }
                            else {
                                str += "<td colspan=3 style='text-align:center;color: red!important;'>" + data[0].lStatus[k].status + "</td>";

                            }

                        }

                    }
                }
                str += "<td colspan=6>&nbsp;</td></tr>";


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

                        str += "<td colspan=4 style='text-align:center;'><b>" + data[0].vendorNames[k].vName; +"</b></td>";
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
                                                str += "<td colspan=3>" + data[0].commercialTerms[s].remarks + "</td>";


                                            }
                                            else if (data[0].commercialTerms[s].remarks == 'Rejected') {
                                                str += "<td colspan=3 style='color: red!important; text-align: center;'>Regretted</td>";


                                            }
                                            else {
                                                str += "<td colspan=3  style='color: red!important; text-align: center;' >Not Quoted</td>";

                                            }

                                        }

                                    }
                                }
                            }
                            str += "<td colspan=6>" + data[0].commercialTerms[p].requirement + "</td>";


                            str += " </tr>";

                            jQuery('#tblRFQComprativetest').append(str);
                        }
                    }
                }

                // ***************** End  Commercial Row



                //For Vendor Comments
                // str += "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                //abheedev bug 349 part 2 start
                str += "<tr><td colspan=6><b>Vendor Remarks :</b></td>";
                //abheedev bug 349 part 2 end
                for (var k = 0; k < data[0].vendorNames.length; k++) {

                    if (data[0].vendorNames[k].vendorRemarks != "") {
                        var VRemarks = stringDivider(data[0].vendorNames[k].vendorRemarks, 40, "<br/>\n");
                        str += "<td colspan='4' class='text-left' >" + VRemarks + "</td>";

                    }
                    else {
                        str += "<td colspan=4>&nbsp;</td>";

                    }
                }
                str += "<td colspan=6>&nbsp;</td>";

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
                // ***************** END  Answer Question Row
                // ***************** Start  Define Technical  Approver Row**********************
                strQ += " <tr><td><b>Technical Approver Required</b></td>";
                //for (var k = 0; k < data[0].VendorNames.length; k++) {

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
                // ***************** END  Technical Approver Row

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

    //jQuery.unblockUI();

}
function RFQFetchTotalPriceForReport(VendorID, Counter) {


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchTotalPriceForReport/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=" + $('#hdnversion').val() + "&BidID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $("#totBoxwithoutgst" + VendorID).html(thousands_separators((data[0].totalPriceExTax).round(2)));
            $("#totBoxwithgst" + VendorID).html(thousands_separators((data[0].totalPriceIncTax).round(2)) + " &nbsp;<a class='lambdafactor' style='cursor:pointer' onclick=editwithgstlambdafactor(" + data[0].totalPriceIncTax + "," + Counter + "," + VendorID + ")><i class='fa fa-pencil'></i></a>");
            $("#totBoxTax" + VendorID).html(thousands_separators((data[0].totalPriceIncTax).round(2)));
            $("#totBoxwithoutgstExcel" + VendorID).html(thousands_separators((data[0].totalPriceExTax).round(2)));
            $("#totBoxwithgstExcel" + VendorID).html(thousands_separators((data[0].totalPriceIncTax).round(2)));
            $("#totBoxTaxExcel" + VendorID).html(thousands_separators((data[0].totalPriceIncTax).round(2)));


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
function fetchAttachments() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        async: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data, status, jqXHR) {
            let data = Data.rData
            jQuery("#tblAttachments").empty();

            if (data[0].attachments.length > 0) {
                jQuery("#tblAttachments").append("<thead><tr style='background: #f5f5f5; color:light black;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")

                for (var i = 0; i < data[0].attachments.length; i++) {
                    var str = "<tr><td style='width:80%!important'>" + data[0].attachments[i].rfqAttachmentDescription + "</td>";
                    str += '<td class=style="width:20%!important"><a style="pointer:cursur;text-decoration:none;" target=_blank href=PortalDocs/eRFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + data[0].attachments[i].rfqAttachment.replace(/\s/g, "%20") + '>' + data[0].attachments[i].rfqAttachment + '</a></td>';
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

var FromPage = getUrlVarsURL(decryptedstring)["FromPage"];

function testPDF() {
    html2canvas(document.getElementById('divGenerateReport'), {
        onrendered: function (canvasObj) {
            var pdf = new jsPDF('P', 'pt', 'a4'),
                pdfConf = {
                    pagesplit: false,
                    backgroundColor: '#FFF'
                };
            document.body.appendChild(canvasObj); //appendChild is required for html to add page in pdf
            pdf.addHTML(canvasObj, 0, 0, pdfConf, function () {
                document.body.removeChild(canvasObj);
                //pdf.addPage();
                pdf.save('Test.pdf');
            });
        }
    });
}

function saveAspdf() {


    //var pdf = new jsPDF('l', 'mm', [300, 475]);
    // var pdf = new jsPDF('l', 'pt', 'a0');
    var pdf = new jsPDF('portrait', 'pt', 'a0', true);
    // pdf.rect(20, 20, pdf.internal.pageSize.width - 40, pdf.internal.pageSize.height - 40, 'S');
    pdf.setFontSize(10);// optional
    var options = {
        pagesplit: true
    };
    var encrypdata;
    // pdf.setLineWidth(2);
    // pdf.rect(10, 20, 150, 75);
    pdf.addHTML(document.body, options, function () {
        pdf.save('ComprativeAnalysis.pdf');
        window.close();

    });

}



function fetchApproverRemarks(RFQID) {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/FetchApproverRemarks/?RFQID=" + RFQID + "&ApprovalType=C",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        async: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $('#tblapprovalprocess').empty()

            if (data.length > 0) {
                $('#tblapprovalprocess').show();
                $('#tblapprovalprocess').append('<tr style="background: #44b6ae;"><th colspan="5" style="font-size: 19px; text-align: left;color: #FFF;">Approval Details</th></tr><tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')

                for (var i = 0; i < data.length; i++) {
                    $('#tblapprovalprocess').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                }


            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
                $('#tblapprovalprocess').hide();
                jQuery.unblockUI();
            }
            jQuery.unblockUI();
            setTimeout(function () {

                saveAspdf();
                //testPDF();


            }, 2000);

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

function fetchrfqcomprativeBoq(RFQID) {
    loadingEngine()
    $('#tblRFQComprativeBoq').show();
    $('#tblRFQComprative').hide();
    $('#btnPRMapping').hide() //to hide boq button

    sessionStorage.setItem("RFQVersionId", $("#ddlrfqVersion option:selected").val())
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        //url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + $('#hdnRfqID').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=" + $('#ddlrfqVersion option:selected').val(),
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQComprativeDetails/?RFQID=" + RFQID + "&RFQVersionId=" + $('#hdnversion').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (Data, status, jqXHR) {

            let data = Data.rData


            var str = '';
            var strHead = '';
            var strHeadExcel = '';
            var strExcel = '';
            let totaltargetprice = 0;
            var totallowestValue = 0;
            var strQ = '';
            var strHeadQ = '';
            var strHeadExcelQ = '';
            var strExcelQ = '';
            var allvendorresponse = 'Y';
            var ShowPrice = Data.showQuotedPrice.showQoutedPrice
            var _CurrentDate = new Date();
            $('#btnPDF').hide();

            /*if (_rfqBidType == 'Closed') {
                if (_openQuotes == 'Y') {
                    //ShowPrice = 'Y';
                    $('#btnPDF').hide()
                }
                else {
                    //ShowPrice = 'N';
                    $('#btnPDF').hide()
                }

            }
            else {
                //ShowPrice = 'Y';
                $('#btnPDF').hide()

            }
            */


            sessionStorage.setItem('ShowPrice', ShowPrice);
            jQuery('#tblRFQComprativeBoq > thead').empty()
            jQuery("#tblRFQComprativeForExcel > thead").empty();
            jQuery('#tblRFQComprativetest > thead').empty()
            $('#tblRFQComprativeBoq > tbody').empty();
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
                strHead = "<tr  style='background: #f5f5f5; color:light black;'><th class='hide'>&nbsp;</th><th>ItemCode</th><th>Short Name</th><th>Item Description</th><th>Item Remark</th><th>Quantity</th><th>UOM</th><th>Target/Budget Price</th>"
                strHeadExcel = "<tr><th>ItemCode</th><th>Short Name</th><th>ItemDescription</th><th>Quantity</th><th>UOM</th><th>Target/Budget Price</th>"

                strHeadQ = "<tr  style='background:#f5f5f5; color:light black;'><th>Question</th><th>Our Requirement</th>"
                strHeadExcelQ = "<tr><th colspan=4>Question</th><th colspan=2>Our Requirement</th>"

                for (var i = 0; i < data[0].vendorNames.length; i++) {

                    if (data[0].vendorNames[i].seqNo != 0) {

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

                    }
                }
                strHead += "<th>Line-wise Lowest Quote</th><th colspan='5' style='text-align:center;'>Last PO Details</th><th>Delivery Location</th>";
                strHeadExcel += "<th>Line-wise Lowest Quote</th><th colspan='5'>Last PO Details</th><th colspan=2>Delivery Location</th>";

                strHead += "</tr>"
                strHeadExcel += "</tr>"

                strHeadQ += "</tr>"
                strHeadExcelQ += "<td colspan='9'>&nbsp;</td></tr>"

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                strHeadExcel += "<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";


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

                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                strHeadExcel += "<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";


                var taxHRTextinc = stringDivider("Unit Price (With GST)", 24, "\n");
                var initialtaxHRTextEx = stringDivider("Unit Price-R0(Without GST)", 32, "\n");
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

                jQuery('#tblRFQComprativeBoq > thead').append(strHead);
                jQuery('#tblRFQComprativeForExcel > thead').append(strHeadExcel);

                jQuery('#tblRFQComprativeQ > thead').append(strHeadQ);
                jQuery('#tblRFQComprativeForExcelQ > thead').append(strHeadExcelQ);




                var x = 0;
                var _totalWithoutGst = 0;
                var sheetname;
                var sheetcount = 0;


                for (var i = 0; i < data[0].noofQuotes[0].noofRFQParameter; i++) {

                    var flag = 'T';
                    $("#tblRFQComprativetest > tbody > tr").each(function (index) {
                        var this_row = $(this);

                        if ($.trim(this_row.find('td:eq(2)').html()) == data[0].quotesDetails[i].rfqParameterId && data[0].quotesDetails[i].srno == "1") {
                            flag = 'F';

                        }

                    });
                    x = -1;
                    minprice = 0;

                    //abheedev boq


                    if (data[0].quotesDetails[i].quantity == 0) {
                        str += "<tr id=" + data[0].quotesDetails[i].boqsheetName + "><td class='hide'>" + data[0].quotesDetails[i].vendorID + "</td><td class='hide'>" + data[0].quotesDetails[i].rfqParameterId + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td></td><td>" + data[0].quotesDetails[i].remarks + "</td><td class='text-right tquant'>" + "" + "</td><td>" + data[0].quotesDetails[i].uom + "</td><td class=text-right>" + data[0].quotesDetails[i].targetPrice + "</td>";//ADD CODE HERE
                        strExcel += "<tr><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td> </td><td>" + "" + "</td><td>" + data[0].quotesDetails[i].uom + "</td><td>" + data[0].quotesDetails[i].targetPrice + "</td>";//ADD CODE HERE
                    }
                    else {
                        str += "<tr id=" + data[0].quotesDetails[i].boqsheetName + "><td class='hide'>" + data[0].quotesDetails[i].vendorID + "</td><td class='hide'>" + data[0].quotesDetails[i].rfqParameterId + "</td><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td></td><td>" + data[0].quotesDetails[i].remarks + "</td><td class='text-right tquant'>" + data[0].quotesDetails[i].quantity + "</td><td>" + data[0].quotesDetails[i].uom + "</td><td class=text-right>" + data[0].quotesDetails[i].targetPrice + "</td>";//ADD CODE HERE
                        strExcel += "<tr><td>" + data[0].quotesDetails[i].rfqItemCode + "</td><td>" + data[0].quotesDetails[i].rfqShortName + "</td><td> </td><td>" + thousands_separators((data[0].quotesDetails[i].quantity).round(2)) + "</td><td>" + data[0].quotesDetails[i].uom + "</td><td>" + data[0].quotesDetails[i].targetPrice + "</td>";//ADD CODE HERE

                    }


                    if (flag == 'T') {

                        for (var j = 0; j < data[0].quotesDetails.length; j++) {


                            if (((data[0].quotesDetails[i].rfqParameterId) == (data[0].quotesDetails[j].rfqParameterId))) {// true that means reflect on next vendor

                                x = x + 1;

                                if (data[0].quotesDetails[j].vendorID == data[0].vendorNames[x].vendorID) {


                                    if (data[0].quotesDetails[j].quantity) {
                                        _totalWithoutGst = (data[0].quotesDetails[j].rfqVendorPricewithoutGST * data[0].quotesDetails[j].quantity).round(2) //_quantity

                                    }
                                    else {
                                        _totalWithoutGst = (data[0].quotesDetails[j].rfqVendorPricewithoutGST * 1).round(2);
                                    }

                                    if (ShowPrice == "N" && data[0].quotesDetails[j].initialQuotewithoutGST != 0) {
                                        strExcel += "<td>Quoted</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>Quoted</td>";
                                    }
                                    else {
                                        strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].initialQuotewithoutGST).round(2)) + "</td>";
                                        str += "<td class='VInitialwithoutGST text-right'>" + thousands_separators((data[0].quotesDetails[j].initialQuotewithoutGST).round(2)) + "</td>";
                                    }
                                    if (ShowPrice == "N" && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {
                                        strExcel += "<td>Quoted</td><td>Quoted</td><td>Quoted</td>";
                                        str += "<td class='text-right'>Quoted</td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "' >Quoted</td><td class='VendorPriceWithTax  text-right' >Quoted</td>";

                                    }

                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {

                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td>";
                                        }

                                        else {
                                            str += "<td class='text-right' id=unitrate" + i + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td>";

                                        }
                                        if (data[0].quotesDetails[j].rfqVendorPricewithGST == 0) {

                                            str += "<td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators((_totalWithoutGst || 0).round(2)) + "</td>"
                                            strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((_totalWithoutGst)) + "</td>";

                                        }

                                        else {
                                            strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((_totalWithoutGst)) + "</td>";

                                            str += "<td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "' >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators((_totalWithoutGst).round(2)) + "</td>";

                                        }

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "N" && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {


                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            if (data[0].quotesDetails[j].rfqVendorPricewithGST == 0) {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }
                                            else {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";


                                                str += "<td class='text-right' id=unitrate" + j + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "' >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }
                                        }
                                        else {
                                            if (data[0].quotesDetails[j].rfqVendorPricewithGST == 0) {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }
                                            else {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + ">" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }

                                        }

                                    }
                                    else if (data[0].quotesDetails[j].lowestPrice == "N" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {


                                        if (data[0].quotesDetails[j].vendorItemRemarks != "") {
                                            if (data[0].quotesDetails[j].rfqVendorPricewithGST == 0) {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + " style='color: red!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }
                                            else {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + " style='color: red!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "' >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }
                                        }
                                        else {
                                            if (data[0].quotesDetails[j].rfqVendorPricewithGST == 0) {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + " style='color: red!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }
                                            else {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + " style='color: red!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }



                                        }

                                    }


                                    else if (data[0].quotesDetails[j].lowestPrice == "Y" && data[0].quotesDetails[j].highestPrice == "Y" && data[0].quotesDetails[j].rfqVendorPricewithoutGST != 0 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -1 && data[0].quotesDetails[j].rfqVendorPricewithoutGST != -2) {

                                        if (data[0].quotesDetails[i].vendorItemRemarks != "") {
                                            if (data[0].quotesDetails[j].rfqVendorPricewithGST == 0) {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + " style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }
                                            else {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + " style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "<span class='hovertext' data-hover='" + data[0].quotesDetails[j].vendorItemRemarks + "'><i class='fa fa-info-circle fa-fw' aria-hidden='true'>" + "</i></span></td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";


                                            }

                                        }
                                        else {
                                            if (data[0].quotesDetails[j].rfqVendorPricewithGST == 0) {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + " style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }
                                            else {
                                                strExcel += "<td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td>" + thousands_separators(_totalWithoutGst) + "</td>";

                                                str += "<td class='text-right' id=unitrate" + j + x + " style='color: blue!important;'>" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithoutGST).round(2)) + "</td><td class='VendorPriceNoTax text-right VendorPriceNoTax" + data[0].quotesDetails[j].vendorID + "'  >" + thousands_separators((data[0].quotesDetails[j].rfqVendorPricewithGST).round(2)) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(_totalWithoutGst) + "</td>";

                                            }

                                        }

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
                        //abheedev 24/04/2023


                        if (ShowPrice == 'Y') {
                            totallowestValue = (totallowestValue + (1 * data[0].quotesDetails[i].lowestPriceValue)).round(2)//data[0].quotesDetails[i].quantity
                            str += "<td class=text-right>" + thousands_separators((data[0].quotesDetails[i].lowestPriceValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                            strExcel += "<td >" + thousands_separators((data[0].quotesDetails[i].lowestPriceValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td colspan=2>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                        }
                        else {
                            if (data[0].quotesDetails[i].lowestPriceValue == 0) {

                                str += "<td class=text-right>Not Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                                strExcel += "<td >Not Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td colspan=2>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                            }
                            else {
                                totallowestValue = (totallowestValue + (1 * data[0].quotesDetails[i].lowestPriceValue)).round(2)
                                str += "<td class=text-right>Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td class=text-right>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td>" + data[0].quotesDetails[i].rfqDelivery + "</td>";
                                strExcel += "<td >Quoted</td><td>" + data[0].quotesDetails[i].poNo + "</td><td>" + data[0].quotesDetails[i].poDate + "</td><td>" + data[0].quotesDetails[i].poVendorName + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poUnitRate).round(2)) + "</td><td>" + thousands_separators((data[0].quotesDetails[i].poValue).round(2)) + "</td><td colspan=2>" + data[0].quotesDetails[i].rfqDelivery + "</td>";

                            }
                        }
                        str += "</tr>"
                        strExcel += "</tr>"

                        jQuery('#tblRFQComprativetest>tbody').append(str);

                    }
                    //}
                    // }

                }
                // for calculating total target price

                let totaltargetprice = 0;
                let ttpArray = [];
                for (var t = 0; t < data[0].quotesDetails.length; t++) {

                    let isPresent = ttpArray.includes(data[0].quotesDetails[t].rfqParameterId)
                    if (!isPresent) {
                        ttpArray.push(data[0].quotesDetails[t].rfqParameterId);
                        totaltargetprice = totaltargetprice + (data[0].quotesDetails[t].targetPrice * data[0].quotesDetails[t].quantity);
                    }
                    else {
                        break;
                    }
                }





                str += "<tr><td colspan=6 style='text-align:center;'><b>Total</b></td><td colspan=1 style='text-align:center;'><b>" + thousands_separators(totaltargetprice) + "</b></td>";
                strExcel += "<tr><td colspan=5><b>Total</b></td><td colspan=1 style='text-align:center;'><b>" + thousands_separators(totaltargetprice) + "</b></td>";
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
                    else {
                        str += "<td class=text-right>Not Quoted</td><td colspan=6>&nbsp;</td></tr>";
                        strExcel += "<td>Not Quoted</td><td colspan=7>&nbsp;</td></tr>";
                    }
                }




                str += "<tr><td colspan=4 style='text-align:center;'><b>Loading Factor</b></td><td colspan=3 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=3 ><b>Loading Factor</b></td><td colspan=3 style='text-align:center;'><b>Loaded Price (Without GST)</b></td>";

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


                str += "<tr><td colspan=7 style='text-align:center;'><b>Loading Reason</b></td>";
                strExcel += "<tr><td colspan=6 ><b>Loading Reason</b></td>";
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


                str += "<tr><td colspan=7 style='text-align:center;'><b>Commercial Rank (Without GST)</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=6 ><b>Commercial Rank (Without GST)</b></td>";
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


                str += "<tr><td colspan=7 style='text-align:center;'><b>Package Value where supplier is L1</b></td>";// <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                strExcel += "<tr><td colspan=6 ><b>Package Value where supplier is L1</b></td>";
                for (var k = 0; k < data[0].vendorNames.length; k++) {

                    if (data[0].vendorNames[k].seqNo != 0) {
                        if (ShowPrice == 'Y') {

                            RFQFetchL1Package(data[0].vendorNames[k].vendorID, k)
                            str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td>";
                            strExcel += "<td>&nbsp;</td><td id=withoutGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=withGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=totL1RankExcel" + data[0].vendorNames[k].vendorID + "></td>";
                        }
                        else {
                            //code here check here


                            str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Quoted</td>";
                            strExcel += "<td>&nbsp;</td><td id=withoutGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=withGSTL1RankExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td><td id=totL1RankExcel" + data[0].vendorNames[k].vendorID + ">Quoted</td>";




                        }
                    }
                    else {
                        // str += "<td colspan=4>&nbsp;</td>";
                        // strExcel += "<td colspan=4>&nbsp;</td>";
                        str += "<td>&nbsp;</td><td id=withoutGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right></td><td id=withGSTL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Not Quoted</td><td id=totL1Rank" + data[0].vendorNames[k].vendorID + " class=text-right>Not Quoted</td>";
                        strExcel += "<td>&nbsp;</td><td id=withoutGSTL1RankExcel" + data[0].vendorNames[k].vendorID + "></td><td id=withGSTL1RankExcel" + data[0].vendorNames[k].vendorID + ">Not Quoted</td><td id=totL1RankExcel" + data[0].vendorNames[k].vendorID + ">Not Quoted</td>";

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



                str += "<tr><td colspan=7><b>Vendor Remarks :</b></td>";
                strExcel += "<tr><td colspan=6><b>Vendor Remarks :</b></td>";
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
                            strExcelQ += "<tr><td colspan=4>" + data[0].questions[p].question + "</td><td colspan=2>" + data[0].questions[p].requirement + "</td>";

                            for (var s = 0; s < data[0].questions.length; s++) {

                                if ((data[0].questions[p].questionID) == (data[0].questions[s].questionID)) {// true that means reflect on next vendor


                                    for (var q = 0; q < data[0].vendorNames.length; q++) {
                                        if (data[0].questions[s].vendorID == data[0].vendorNames[q].vendorID) {
                                            var attachQA = data[0].questions[s].attachementQA;

                                            if (data[0].questions[s].answer != '' && data[0].questions[s].answer != 'Rejected') {
                                                //strQ += "<td>" + data[0].questions[s].answer + "</td>";
                                                if (ShowPrice == 'Y') {
                                                    strQ += '<td >' + data[0].questions[s].answer + '<br>  <a id=eRFQVFilesques' + s + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[0].questions[s].vendorID + ')>' + attachQA + '</a> </td>';

                                                }
                                                else {
                                                    strQ += '<td>' + data[0].questions[s].answer + '</td>';

                                                }

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

                                        }

                                    }
                                }
                            }

                            strQ += "<td colspan='3'>&nbsp;</td></tr>";
                            strExcelQ += "<td colspan='9'></tr>";
                            jQuery('#tblRFQComprativetestQ').append(strQ);

                        }
                    }
                }
                else {
                    strQ += "<tr>";
                    strExcelQ += " <tr><td colspan=" + 6 + ">&nbsp;</td>";
                    t = 0;
                    for (var k = 1; k <= data[0].vendorNames.length; k++) {

                        t = k;

                    }


                    strQ += "<td colspan=" + 2 + ">&nbsp;</td><td colspan=" + (t + 2) + " style='text-align:center'>No Questions Mapped</td>";
                    strExcelQ += "<td colspan=" + ((4 * t)) + ">No Questions Mapped</td>";
                    strQ += "</tr>";
                    strExcelQ += "</tr>";

                }

                strQ += " <tr><td><b>Technical Approval Required</b></td>";

                t = 0;
                for (var k = 1; k <= data[0].vendorNames.length; k++) {

                    t = k;

                }
                if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "afterrfq") {
                    strQ += "<td>After All RFQ Responses</td>"
                    strQ += '<td colspan=' + (t + 4) + '><a href="javascript:;" class="btn btn-xs yellow" id=btn_techmapaaprover onclick="fnForwardforAllvendorTechnical()"> Technical Approval</a></td>';



                }

                else if (data[0].vendorNames[0].technicalApproval.toLowerCase() == "rfq") {
                    strQ += "<td colspan=" + (t + 4) + ">With individual RFQ Response</td>"
                }
                else {
                    strQ += "<td colspan=" + (t + 4) + ">Not Required</td>"
                }

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
                            strExcelQ += "<tr><td>" + data[0].approverStatus[p].approverName + "</td><td colspan='5'>" + ((data[0].approverStatus[p].remarks).replaceAll("&lt;", "<")).replaceAll("&gt;", ">") + "</td>";



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

                strQ += "<td colspan=" + (t + 4) + ">&nbsp;</td>";
                strExcelQ += "<td colspan=" + (t + 4) + ">&nbsp;</td>";
                strQ += "</tr>";
                strExcelQ += "</tr>";


                if ($("#ddlrfqVersion option:selected").val() != 0) {
                    str += "<tr id='reinvitationTRRem'><td colspan=8><b>Re-Invitation Remarks</b></td>";
                    strExcel += "<tr><td colspan=6><b>Re-Invitation Remarks</b></td>";
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



                jQuery('#tblRFQComprativeBoq').append(str);


                jQuery('#tblRFQComprativeQ').append(strQ);




            }
            else {

                $('#displayTable').show();
                $('#displayComparativetabs').show();
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo('#tblRFQComprative');
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo("#tblRFQComprativeForExcel")

            }




            unloadingEngine()


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

