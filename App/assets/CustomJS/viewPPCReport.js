var idx = 0;
var allUsers = [];
$(document).ready(function () {

    var path = window.location.pathname;
    page = path.split("/").pop();
    if (window.location.search) {
        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)
        idx = parseInt(getUrlVarsURL(decryptedstring)["nfaIdx"]);
        $('#lblNFAID').html('PPC ID :' + idx)
        $('#lblnfa').html(idx)
    }

    if (idx != null) {

        $('#divPPCDetails').show();
        Bindtab2DataforPreview();
        GetOverviewmasterbyId(idx);
        BindAttachmentsOfEdit();
        FetchRecomendedVendor();
        fetchApproverStatus();
        GetQuestions();
        getCurrenttime();

    }

});
function Bindtab2DataforPreview() {
    var x = isAuthenticated();
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=0&BidID=0&nfaID=" + idx,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data[0].azureDetails.length > 0) {
                $('#tblvendorsprev').empty();
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

                jQuery('#lblenquiryissuedon').html(fnConverToLocalTime(data[0].azureDetails[0].enquiryIssuedOn));
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
                 if (data[0].biddingVendor.length > 0) {

                    $('#tblvendorsprev').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th>TPI</th></tr></thead>");
                    for (i = 0; i < data[0].biddingVendor.length; i++) {
                       
                        if ((data[0].biddingVendor[i].quotationReceived).trim() == "Y") {
                                
                                QR = "Yes";
                            }
                             else if ((data[0].biddingVendor[i].quotationReceived).trim() == "NA") {
                                
                                QR = "NA";
                            }
                            else {
                                
                                QR = "No";
                            }
                            if ((data[0].biddingVendor[i].tpi).trim() == "Y") {
                               
                                TPI = "Yes";
                            }
                            else if ((data[0].biddingVendor[i].tpi).trim() == "NA") {
                               
                                TPI = "NA";
                            }

                            else {
                              
                                TPI = "No";
                            }
                            if ((data[0].biddingVendor[i].texhnicallyAcceptable).trim() == "Y") {
                               
                                TA = "Yes";
                            }
                            else if ((data[0].biddingVendor[i].texhnicallyAcceptable).trim() == "NA") {
                                
                                TA = "NA";
                                
                            }
                            else {
                               
                                TA = "No";
                            }
                            if ((data[0].biddingVendor[i].politicallyExposed).trim() == "Y") {
                                
                                PE="Yes";
                            }
                            else if ((data[0].biddingVendor[i].politicallyExposed).trim() == "NA") {
                              
                                PE="NA";
                                
                            }
                            else {
                               
                                PE="No";
                            }
                            if ((data[0].biddingVendor[i].quotedValidatedSCM).trim() == "Y") {
                                
                                validatescm = "Yes";
                            }
                            else if ((data[0].biddingVendor[i].quotedValidatedSCM).trim() == "NA") {
                               
                                validatescm = "NA";
                            }
                            else {
                               
                                validatescm = "No";
                            }
                        //**** Prev vendor Details Start
                        $('#tblvendorsprev').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + ">" + QR + "</td><td id=TDTechAccep" + i + ">" + TA + "</td><td id=TDpolexp" + i + ">" + PE + "</td><td id=TDvalidatescm" + i + ">" + validatescm + "</td><td id=TPI" + i + ">" + TPI + "</td></tr>")
                        //**** Prev vendor Details end

                    }
                }

            }
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


var nfaid
function GetOverviewmasterbyId(idx) {
    var x = isAuthenticated();
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = "NFA/GetNFAOverViewsById?CustomerID=" + parseInt(CurrentCustomer) + "&idx=" + parseInt(idx);
    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {

            nfaid = res.result[0].nfaID
            if (res.result.length > 0) {
                if (res.result[0].nfaCategory == "2") {
                    $(".clsHide").hide();
                }
                else {
                    $(".clsHide").show();
                }

            

                $("#lbltitle").text(res.result[0].nfaSubject);
                $("#lblDetailsdesc").html("<b>Descrition:</b>");
                $("#lblDetails").text(res.result[0].nfaDescription);
                $("#lblAmount").text(thousands_separators(res.result[0].nfaAmount))//+ " " + res.result[0].currencyNm);

                $("#lblbudgetamount").text(thousands_separators(res.result[0].nfaBudget))
                $('#logoimg').attr("src", res.result[0].logoImage);
                $("#lblCurrency,#lblCurrencybud").text(res.result[0].currencyNm);
                $("#lblCategory").text(res.result[0].categoryName);
               
                $("#lblProjectName").text(res.result[0].projectName);
                $("#lblbudget").text(res.result[0].budgetStatustext);

                $("#lblPurOrg").text(res.result[0].orgName);
                $("#lblGroup").text(res.result[0].groupName);

                if (res.result[0].eventtypeName == "RA") {
                    $("#lblEventType").text("Reverse Auction")
                    $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + res.result[0].eventRefernce + "'\,\'" + res.result[0].bidForID + "'\,\'" + res.result[0].bidTypeID + "'\,\'0'\) href = 'javascript:;' >" + res.result[0].eventReftext + "</a>");
                }
                else if (res.result[0].eventtypeName == "FA") {
                    $("#lblEventType").text("Forward Auction")
                    $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + res.result[0].eventRefernce + "'\, \'" + res.result[0].bidForID + "'\,\'" + res.result[0].bidTypeID + "'\,\'0'\) href = 'javascript:;' >" + res.result[0].eventReftext + "</a>");
                }
                else if (res.result[0].eventtypeName == "CA") {
                    $("#lblEventType").text("Coal Auction")
                    $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + res.result[0].eventRefernce + "'\, \'" + res.result[0].bidForID + "'\,\'" + res.result[0].bidTypeID + "'\,\'0'\) href = 'javascript:;' >" + res.result[0].eventReftext + "</a>");
                }
                else if (res.result[0].eventtypeName == "FF") {
                    $("#lblEventType").text("French Auction")
                    $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + res.result[0].eventRefernce + "'\, \'" + res.result[0].bidForID + "'\,\'" + res.result[0].bidTypeID + "'\,\'0'\) href = 'javascript:;' >" + res.result[0].eventReftext + "</a>");
                }
                else if (res.result[0].eventtypeName == "ON") {
                    $("#lblEventType").text("Outside PPC")
                    $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + res.result[0].eventRefernce + "'\, \'" + res.result[0].bidForID + "'\,\'" + res.result[0].bidTypeID + "'\,\'0'\) href = 'javascript:;' >" + "Not Applicable" + "</a>");
                }
                else {
                    $("#lblEventType").text("RFQ")
                    $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'0'\,\'0'\,\'0'\,\'" + res.result[0].eventRefernce + "'\) href = 'javascript:;' >" + res.result[0].eventReftext + "</a>");
                }

                if (res.result[0].remarks != '') {
                    $(".clsremark").show();
                }
                else {
                    $(".clsremark").hide();
                }
                //abheedev backlog 471
                if (res.result[0].conditionName == "") {
                    $("#lblException").text("No Exception");
                }
                else {
                    $("#lblException").text(res.result[0].conditionName);
                }
                //abheedev backlog 286
                $("#lblRemark").html(res.result[0].remarks);
                setTimeout(function () {
                    saveAspdf()
                }, 3000)
                $("#NFa_ConfiguredBy").html("NFA Request Configured By :" + res.result[0].createdBy);

            }
        }
    });

    GetData.error(function (res) {
        jQuery.unblockUI();
    });
};



function getSummary(bidid, bidforid, bidtypeid, RFQID) {

    if (RFQID == 0) {
        var encrypdata = fnencrypt("BidID=" + bidid + "&BidTypeID=" + bidtypeid + "&BidForID=" + bidforid)
        window.open("BidSummary.html?param=" + encrypdata, "_blank")
    }
    else {
        var encrypdata = fnencrypt("RFQID=" + RFQID + "&AppType=NFA&VID=NFA")
        window.open("eRFQApproverAnalysis.html?param=" + encrypdata, "_blank")

    }
}
function BindAttachmentsOfEdit() {
    var x = isAuthenticated();
    var url = "NFA/FetchNFaFiles?CustomerId=" + parseInt(CurrentCustomer) + "&NfaId=" + parseInt(idx);

    var GetFilesData = callajaxReturnSuccess(url, "Get", {})
    GetFilesData.success(function (res) {
        $('#tblAttachments').empty();
        if (res != null) {
            if (res.result.length > 0) {
                $('#divAttachments').removeClass('hide')
                $.each(res.result, function (key, value) {
                    rowAttach = ++key;

                    if (!jQuery("#tblAttachmentsPrev thead").length) {
                        jQuery('#tblAttachmentsPrev').append("<thead><tr><th class='bold'>Attachment Description</th><th class='bold'>Attachment</th></tr></thead>");
                        var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + value.nfaFileDescription + '</td>';
                    }
                    else {
                        var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + value.nfaFileDescription + '</td>';
                    }


                    strprev += '<td class=style="width:47%!important"><a id=aeRFQFilePrev' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + value.nfaFileName + '</a></td>';
                    $('#tblAttachmentsPrev').append(strprev);

                });
            }
            else {
                $('#divAttachments').addClass('hide')
            }
        }
    })

};

function DownloadFile(aID) {

    fnDownloadAttachments($("#" + aID.id).html(), 'NFAOverview/' + parseInt(idx));
}

function fetchApproverStatus() {
    var x = isAuthenticated();
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = sessionStorage.getItem("APIPath") + "NFA/GetNFAApproverStatus/?NFaIdx=" + idx

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function (data) {

            var status = '';
            var c = 0;
            var ApprovalType = ""
            if (data.length > 0) {
                $('#div_statusbar').removeClass('hide');
                jQuery('#divappendstatusbar').empty();
                var counterColor = 0;
                var prevseq = '1';
                //abheedev backlog 471
                for (var i = 0; i < data.length; i++) {

                    jQuery('#divappendstatusbar').append('<div class="col-md-2 mt-step-col first" id=divstatuscolor' + i + '><div class="mt-step-number bg-white" style="font-size:small;height:38px;width:39px; border-color: transparent !important;" id=divlevel' + i + '></div><div class="mt-step-title font-grey-cascade" id=divapprovername' + i + ' style="font-size:smaller"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divstatus' + i + '></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divPendingDate' + i + '></div></div></div></div>')
                    jQuery('#divlevel' + i).text(data[i].approverSeq);
                    jQuery('#divapprovername' + i).text(data[i].approverName);
                    jQuery('#divPendingDate' + i).text(fnConverToLocalTime(data[i].receiptDt));
                    ApprovalType = data[0].approvalType;
                    if (data[i].statusCode == 10) {

                        counterColor = counterColor + 1;
                        status = 'Pending'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');

                    }
                    if (data[i].statusCode == 20) {
                        counterColor = counterColor + 1;
                        status = 'Approved'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 0) {
                        counterColor = counterColor + 1;
                        status = 'Delegate'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 1) {
                        counterColor = counterColor + 1;
                        status = 'N/A'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).removeClass('error')
                        jQuery('#divstatuscolor' + i).addClass('font-yellow')
                        jQuery('#divstatuscolor' + i).addClass('last')
                        jQuery('#divstatus' + i).addClass('font-yellow')
                        jQuery('#divapprovername' + i).addClass('font-yellow')
                        jQuery('#divPendingDate' + i).text('');
                    }
                    if (data[i].statusCode == 30) {

                        counterColor = counterColor + 1;
                        status = 'Reject'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).removeClass('error')
                        jQuery('#divstatuscolor' + i).addClass('font-blue')
                        jQuery('#divstatuscolor' + i).addClass('last')
                        jQuery('#divstatus' + i).addClass('font-blue')
                    }
                    if (data[i].statusCode == 40) {

                        counterColor = counterColor + 1;
                        status = 'Feedback Sought'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 10) {
                        jQuery('#divstatuscolor' + i).addClass('error');
                    }
                    if (data[i].statusCode == 20 || data[i].statusCode == 40 || data[i].statusCode == 0) {
                        jQuery('#divstatuscolor' + i).addClass('done');
                    }

                }
            }
            else {
                $('#div_statusbar').addClass('hide');

            }
            jQuery.unblockUI();
        },

        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(response.status + ' ' + response.statusText);
            }
            return false;
            jQuery.unblockUI();
        }
    });
}


function FetchRecomendedVendor() {
    var x = isAuthenticated();
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "NFA/GETNFAActivity/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&NFaIdx=" + idx,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $('#tblNFaHistory').empty()
            if (data.length > 0) {
                $('#divforapprovalprocess').show()
                $('#tblNFaHistory').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                for (var i = 0; i < data.length; i++) {
                    $('#tblNFaHistory').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                }
            }
            else {
                $('#tblNFaHistory').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });

}
function GetQuestions() {
    var x = isAuthenticated();
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "NFA/GetNFAQuery/?NFAID=" + idx + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            jQuery("#tblquestions").empty();
            var attach = 'No Attachment';
            if (data.length > 0) {
                jQuery('#tblquestions').append("<thead><tr><th class='bold' style='width:40%!important'>Questions</th><th class='bold' style='width:40%!important'>Answer</th><th class='bold' style='width:10%!important'>Attachment</th><th class='bold' style='width:5%!important'>CreatedBy</th><th style='width:5%!important'></th></tr></thead>");
                for (var i = 0; i < data.length; i++) {

                    attach = '';
                    if (data[i].attachment != '') {
                        attach = '<a style="pointer: cursor; text-decoration:none; "  id=eRFQVQueryFiles' + i + ' href="javascript: ; " onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a>';
                    }

                    str = '<tr id=trquesid' + (i + 1) + '><td class=hide id=ques' + i + '>' + data[i].id + '</td><td>' + data[i].question + '</td>';
                    str += '<td id=answer' + i + '>' + data[i].answer + '</td>';
                    str += '<td>' + attach + '</td>';
                    str += '<td>' + data[i].createdBy + '</td></tr>';
                    jQuery('#tblquestions').append(str);

                }

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

$('#printed_by').html(sessionStorage.getItem('UserName'));
function getCurrenttime() {

    postfix = new Date()

    $('#printed_on').html(postfix);
}
function saveAspdf() {

    var pdf = new jsPDF('l', 'pt', 'a0');
    var options = {
        pagesplit: true
    };
    pdf.addHTML(document.body, options, function () {
        pdf.save('PPCReport.pdf');
        window.close();

    });


}
