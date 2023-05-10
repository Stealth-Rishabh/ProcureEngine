var idx = 0;
var fromUserID = 0; 
var allUsers = [];
var error = $('#errordiv');

$(document).ready(function () {

    var path = window.location.pathname;
    page = path.split("/").pop();
    if (window.location.search) {
        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)
        idx = parseInt(getUrlVarsURL(decryptedstring)["nfaIdx"]);
        IsApp = getUrlVarsURL(decryptedstring)["App"]
        FwdTo = getUrlVarsURL(decryptedstring)["FwdTo"]
        AppStatus = getUrlVarsURL(decryptedstring)["AppStatus"]
        $('#lblNFAID').html('ID :' + idx)
        $('#lblnfa').html(idx)
        $('#divRemarksApp').hide();
    }

    if (idx != null) {
        if (sessionStorage.getItem('CustomerID') == 32) {// || sessionStorage.getItem('CustomerID') == 29
            $('#divNFADetails').hide();
            $('#divPPCDetails').show();
            Bindtab2DataforPreview();
        }
        else {
            BindSaveparams();
            $('#divNFADetails').show();
            $('#divPPCDetails').hide();
        }
        GetOverviewmasterbyId(idx);
        BindAttachmentsOfEdit();
        fetchRegisterUser();
        FetchRecomendedVendor();
        fetchApproverStatus();
        GetQuestions();

        if (IsApp == 'N' && FwdTo != 'Admin') {
            jQuery("#divRemarksForward").show();

        }
        else if (IsApp == 'Y' && FwdTo == 'Admin') {
            jQuery("#frmdivremarksapprover").hide();
            jQuery("#divRemarksApp").show();
            $('#frmadminbutton').show();
            //$('#btnwithdraw').hide()

        }
        else if (FwdTo == 'View') {
            jQuery("#frmdivremarksapprover").hide();
            jQuery("#divRemarksApp").hide();
            $('#frmadminbutton').hide()
            $('#divreportPDFButton').show()

        }
        else {

            jQuery("#divRemarksApp").show();
            jQuery("#frmdivremarksapprover").show();
            $('#frmadminbutton').hide()
            //$('#btnwithdraw').show()
        }

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

                        if (data[0].biddingVendor[i].tpi == "Y") {
                            TPI = "Yes";
                        }
                        else if (data[0].biddingVendor[i].tpi == "NA") {
                            TPI = "NA";
                        }
                        else {
                            TPI = "No";
                        }
                        if (data[0].biddingVendor[i].quotedValidatedSCM == "Y") {
                            validatescm = "Yes";
                        }
                        else if (data[0].biddingVendor[i].quotedValidatedSCM == "NA") {
                            validatescm = "NA";
                        }
                        else {
                            validatescm = "No";
                        }

                        //**** Prev vendor Details Start
                        $('#tblvendorsprev').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + ">" + (data[0].biddingVendor[i].quotationReceived == 'Y' ? 'Yes' : 'No') + "</td><td id=TDTechAccep" + i + ">" + (data[0].biddingVendor[i].texhnicallyAcceptable == 'Y' ? 'Yes' : 'No') + "</td><td id=TDpolexp" + i + ">" + (data[0].biddingVendor[i].politicallyExposed == 'Y' ? 'Yes' : 'No') + "</td><td id=TDvalidatescm" + i + ">" + validatescm + "</td><td id=TPI" + i + ">" + TPI + "</td></tr>")
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
function fetchRegisterUser() {
    var x = isAuthenticated();
    var data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "Isactive": "N"
    }
    var url = sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser";
    jQuery.ajax({
        //type: "GET",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
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
    //allUsers = RegisterUser_fetchRegisterUser(data);

}
//abheedev bug 385
//abheedev backlog 471
var nfaid = 0;
function GetOverviewmasterbyId(idx) {
    var x = isAuthenticated();
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = "NFA/GetNFAOverViewsById?CustomerID=" + parseInt(CurrentCustomer) + "&idx=" + parseInt(idx);
    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {
            nfaid = res.result[0].nfaID
            if (res.result.length > 0) {

                if (sessionStorage.getItem('CustomerID') == 32 || sessionStorage.getItem('CustomerID') == 29) {
                    if (res.result[0].nfaCategory == "2") {
                        $(".clsHide").hide();
                    }
                    else {
                        $(".clsHide").show();
                    }

                }
                else {
                    if (res.result[0].nfaCategory == "1") {
                        $(".clsHide").hide();
                    }
                    else {
                        $(".clsHide").show();
                    }

                }

                $("#lblProjectName").text(res.result[0].projectName);
                //if (res.result[0].eventID == 0) {
                //    $(".clsHideEvent").hide();
                //}
                //else
                //    $(".clsHideEvent").show();

                $("#lbltitle").text(res.result[0].nfaSubject);
                $("#lblDetailsdesc").html("<b>Descrition:</b>");
                $("#lblDetails").text(res.result[0].nfaDescription);
                $("#lblAmount").text(thousands_separators(res.result[0].nfaAmount))//+ " " + res.result[0].currencyNm);

                $("#lblbudgetamount").text(thousands_separators(res.result[0].nfaBudget))

                $("#lblCurrency,#lblCurrencybud").text(res.result[0].currencyNm);
                $("#lblCategory").text(res.result[0].categoryName);

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
                    $("#lblEventType").text("Outside NFA")
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
                $("#NFa_ConfiguredBy").html("Configured By :" + res.result[0].createdBy);

            }
        }
    });

    GetData.error(function (res) {
        jQuery.unblockUI();
    });
};
//abheedev bug 385 end
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

function BindSaveparams() {
    var x = isAuthenticated();
    var url = "NFA/FetchSavedOverviewParam?customerid=" + parseInt(CurrentCustomer) + "&nfaidx=" + parseInt(idx) + "&For=NFApp";

    var ParamData = callajaxReturnSuccess(url, "Get", {})
    ParamData.success(function (res) {
        if (res != null) {
            $("#tblNFAOverviewParam").empty();
            if (res.result.length > 0) {
                $("#tblNFAOverviewParam").append("<thead><tr><th class='bold' style='width:50%!important'>Question</th><th class='bold' style='width:40%!important'>Response</th></tr></thead>");
                $.each(res.result, function (key, value) {
                    $("#tblNFAOverviewParam").append('<tr id=trNfaParam' + value.idx + '><td>' + value.paramtext + '</td><td>' + value.paramRemark + '</td><td class=hide>' + value.idx + '</td></tr>');

                });
            }
        }
        else {
            $("#tblNFAOverviewParam").hide();
        }
    })
}
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
            debugger
            var status = '';
            var c = 0;
            var ApprovalType = ""
            if (data.length > 0) {
                $('#div_statusbar').removeClass('hide');
                jQuery('#divappendstatusbar').empty();
                var counterColor = 0;
                var prevseq = '1';
                for (var i = 0; i < data.length; i++) {
                   /* if (data[i].statusCode == 0) {
                        jQuery('#divappendstatusbar').append(`<div class="col-md-2 mt-step-col first popApprove" id="divstatuscolor${i}"><div class="mt-step-number bg-white" style="font-size:small;height:38px;width:39px;" id="divlevel${i}"></div><div class="mt-step-title font-grey-cascade" id="divapprovername${i}" style="font-size:smaller"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id="divstatus${i}"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id="divPendingDate${i}"></div></div></div></div>`)
                    }
                    else if (data[i].statusCode == 20) {
                        jQuery('#divappendstatusbar').append(`<div class="col-md-2 mt-step-col first popApprove" id="divstatuscolor${i}"><div class="mt-step-number bg-white" style="font-size:small;height:38px;width:39px;" id="divlevel${i}"></div><div class="mt-step-title font-grey-cascade" id="divapprovername${i}" style="font-size:smaller"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id="divstatus${i}"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id="divPendingDate${i}"></div></div></div></div>`)
                    }
                    else {*/
                        jQuery('#divappendstatusbar').append(`<a href="javascript:;" data-toggle="modal" data-target="#appmodpop" onclick="popapprfunc('${data[i].approverName}','${data[i].approverID}')"><div class="col-md-2 mt-step-col first popApprove" id="divstatuscolor${i}"><div class="mt-step-number bg-white" style="font-size:small;height:38px;width:39px;" id="divlevel${i}"></div><div class="mt-step-title font-grey-cascade" id="divapprovername${i}" style="font-size:smaller"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id="divstatus${i}"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id="divPendingDate${i}"></div></div></div></div></a>`)

                    //}
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
                        jQuery('#divstatuscolor' + i).addClass('font-blue')
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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

sessionStorage.setItem('hdnApproverid', 0);
jQuery("#txtApprover").keyup(function () {
    sessionStorage.setItem('hdnApproverid', '0');

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
            $('#hdndelegateuserid').val(map[item].userID)
            // sessionStorage.setItem('hdndelegateuserid', map[item].userID);

        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }

});
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
            $('#tblremarksapprover').empty()
            $('#tblNFaHistory').empty()

            if (data.length > 0) {
                $('#divforapprovalprocess').show();
                $('#tblremarksapprover').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                $('#tblNFaHistory').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                if (AppStatus == 'Reverted') {
                    jQuery("#lblrevertedComment").text(data[0].remarks);
                    jQuery("#RevertComment").show();
                    $('#frmdivremarksforward').removeClass('col-md-12');
                    $('#frmdivremarksforward').addClass('col-md-6');
                    $('#frmdivforward').show();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].vendorName != "") {
                            $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                            $('#thforward').removeClass('hide')
                        }
                        else {
                            $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                            $('#thforward').addClass('hide')
                        }
                    }
                }
                else {
                    $('#frmadminbutton').removeClass('col-md-12');
                    $('#frmadminbutton').addClass('col-md-6');
                    $('#frmdivremarksapprover').removeClass('col-md-12');
                    $('#frmdivremarksapprover').addClass('col-md-6');
                    for (var i = 0; i < data.length; i++) {
                        $('#tblremarksapprover,#tblNFaHistory').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                    }
                    $('#frmdivapprove').show()
                }
            }
            else {
                $('#tblapprovalprocess,#tblNFaHistory').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
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
var form1 = $('#frmsubmitapp');
var error1 = $('.alert-danger', form1);
var success1 = $('.alert-success', form1);
var form2 = $('#delegateuser');
var error2 = $('.alert-danger', form2);
var success2 = $('.alert-success', form2);
var form3 = $('#formDelegate');
var error3 = $('.alert-danger', form3);
var success3 = $('.alert-success', form3);
var formrecall = $('#frmadminbuttonsrecall');
var errorrecall = $('.alert-danger', formrecall);
var successrecall = $('.alert-success', formrecall);
function validateAppsubmitData() {

    form1.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
            ddlActionType: {
                required: true,
            },
            ddlVendors: {
                required: true,
            },
            txtRemarksApp: {
                required: true,
            }
        },
        messages: {
            ddlActionType: {
                required: "Please select Action"
            },

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

    form2.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
            txtApprover: {
                required: true,
            },
            txtdelegate: {
                required: true,
            }
        },
        messages: {
            ddlActionType: {
                required: "Please select Action"
            },

            txtRemarksApp: {
                required: "Please enter your comment"
            }
        },

        invalidHandler: function (event, validator) {
            success2.hide();
            error2.show();

        },

        highlight: function (element) {
            $(element)
                .closest('.form-group').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.form-group').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.form-group').removeClass('has-error');
        },

        submitHandler: function (form) {
            DelegateUser();
        }
    });

    form3.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
            txtDeligateName: {
                required: true,
            },
            remarkAprv: {
                required: true,
            }
        },
        messages: {
            txtDeligateName: {
                required: "Please select delegate user"
            },

            remarkAprv: {
                required: "Please enter your remarks"
            }
        },

        invalidHandler: function (event, validator) {
            success3.hide();
            error3.show();

        },

        highlight: function (element) {
            $(element)
                .closest('.form-group').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.form-group').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.form-group').removeClass('has-error');
        },

        submitHandler: function (form) {
            PostNewApprover();
        }

    });

    formrecall.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
            txtRemarksrecall: {
                required: true,
            }

        },
        messages: {
            txtRemarksrecall: {
                required: "Please select Remarks"
            }


        },

        highlight: function (element) {
            $(element)
                .closest('.form-group').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element)
                .closest('.form-group').removeClass('has-error');
        },

        success: function (label) {
            label
                .closest('.form-group').removeClass('has-error');
        },

        submitHandler: function (form) {
            fnRecall();
        }
    });

}
function ApprovalApp() {
    var x = isAuthenticated();
    var _cleanString = StringEncodingMechanism(jQuery("#txtRemarksApp").val());
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var approvalbyapp = {
        "NFAID": parseInt(idx),
        "FromUserId": sessionStorage.getItem("UserID"),
        "ActivityDescription": jQuery("#lbltitle").text(),
        "Remarks": _cleanString,
        "Action": jQuery("#ddlActionType option:selected").val(),
        "ForwardedBy": "Approver",
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    };
    console.log(JSON.stringify(approvalbyapp))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "NFA/ApproveRejectNFA",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(approvalbyapp),
        crossDomain: true,
        dataType: "json",
        success: function () {
            bootbox.alert("Transaction Successful..").on("shown.bs.modal", setTimeout(function (e) {

                window.location = "index.html";
                return false;
            }, 2000)
            );

        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
$("#editValuesModal").on("hidden.bs.modal", function () {
    $('#txtApprover').val('')
    $('#hdndelegateuserid').val('0')
    $('#txtdelegate').val()
});
function DelegateUser() {
    var x = isAuthenticated();
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtdelegate").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#hdndelegateuserid').val() == 0 || $('#hdndelegateuserid').val() == null) {

        error2.show();
        $('#errormsg').html('Please Select Approver Properly!');
        error2.fadeOut(3000);
        App.scrollTo(error2, -200);
    }
    else {
        var approvalbyapp = {
            "NFAID": parseInt(idx),
            "FromUserId": sessionStorage.getItem("UserID"),
            "ActivityDescription": jQuery("#lbltitle").text(),
            "Remarks": _cleanString2,
            "Action": "Delegate",
            "DelgateTo": parseInt($('#hdndelegateuserid').val()),
            "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
        };



        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "NFA/NFADelegate",
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
                else {
                    fnErrorMessageText('spanerterr', '');
                }
                jQuery.unblockUI();
                return false;
            }
        })
    }
}
function Fnback() {
    window.location.href = "index.html";
}

$("#RaiseQuery").on("hidden.bs.modal", function () {
    jQuery("#txtquestions").val('')
    $('#hdnvendorid').val('0')
    $('#tblquestions').empty();
    $('#btnTechquery').attr('disabled', 'disabled')
    queslength = 0;
    PendingOn = 'C'
});
function fnRaisequery() {
    GetQuestions();
}
var queslength = 0;
var PendingOn = 'A';
sessionStorage.setItem('HeaderID', 0)
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
                queslength = data.length;
                $('#btnTechquery').attr('disabled', 'disabled')
                jQuery('#tblquestions').append("<thead><tr><th class='bold' style='width:40%!important'>Questions</th><th class='bold' style='width:40%!important'>Answer</th><th class='bold' style='width:10%!important'>Attachment</th><th class='bold' style='width:5%!important'>CreatedBy</th><th style='width:5%!important'></th></tr></thead>");
                for (var i = 0; i < data.length; i++) {
                    rowques = rowques + 1;
                    attach = '';
                    if (data[i].attachment != '') {
                        attach = '<a style="pointer: cursor; text-decoration:none; "  id=eRFQVQueryFiles' + i + ' href="javascript: ; " onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a>';
                    }

                    str = "<tr id=trquesid" + i + "><td class=hide id=quesid" + i + ">" + data[i].id + "</td><td id=ques" + i + ">" + data[i].question + "</td>";
                    str += '<td id=answer' + i + '>' + data[i].answer + '</td>';
                    str += '<td>' + attach + '</td>';
                    str += '<td>' + data[i].createdBy + '</td>';
                    str += '<td><button type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deletequesrow(trquesid' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td class=hide>' + data[i].status + '</td></tr>';
                    jQuery('#tblquestions').append(str);

                    if ($('#answer' + i).text() != "" || data[0].pendingOn.toLowerCase() == "c") {
                        $('#Removebtn' + i).hide();
                        $('#btnTechquery').text("Additional Query")

                    }
                    else {
                        $('#Removebtn' + i).show();
                    }

                    PendingOn = data[i].pendingOn;
                    sessionStorage.setItem('HeaderID', data[i].headerid)
                }

                GetQuestionsforCreator(PendingOn);

                if (PendingOn.toLowerCase() == "c") {
                    jQuery('#btnSubmitApp').attr("disabled", 'disabled');
                    $('#btnSubmitApp').removeClass('green').addClass('default')
                    //$('#btnwithdraw').show()
                }
                /*else {

                    $('#btnwithdraw').hide()
                }*/
            }
            /*else {
                $('#btnwithdraw').hide()
            }*/
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
function GetQuestionsforCreator(pendingon) {
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
            jQuery("#tblqueryresponse").empty();
            var attach = '';

            if (data.length > 0) {

                $('#divQuery').removeClass('hide')
                jQuery('#tblqueryresponse').append("<thead><tr  style='background: gray; color: #FFF;'><th></th><th class='bold' style='width:30%!important'>Questions</th><th style='width:10%!important'>Created By</th><th style='width:50%!important'>Answer</th><th style='width:10%!important'>Attachment</th></tr></thead>");


                for (var i = 0; i < data.length; i++) {
                    attach = '';
                    if (data[i].attachment != '') {
                        attach = '<a style="pointer:cursor; text-decoration:none;" id=eRFQVQueryFiles' + i + '  href="javascript:;" onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a>';
                    }

                    if (pendingon.toLowerCase() == "c" && data[0].nfaCreatorEncrypted == sessionStorage.getItem('UserID') && FwdTo == 'Admin') {
                        $('#btnsubmitquery').removeClass('hide')
                        $('#btnwithdraw').hide()
                        str = "<tr id=trresquesid" + i + "><td class=hide id=quesresid" + i + ">" + data[i].id + "</td><td colspan=2>" + data[i].question + "</td><td>" + data[i].createdBy + "</td>";
                        str += '<td><textarea onkeyup="replaceQuoutesFromString(this)" name=answer rows=2 class="form-control" maxlength=1000  autocomplete=off id=answer' + i + ' >' + data[i].answer + '</textarea></td>';
                        str += "<td><span style='width:200px!important' class='btn blue'><input type='file' id='fileToUpload" + i + "' name='fileToUpload" + i + "' onchange='checkfilesize(this);' /></span><br>" + attach + "</td>";
                        jQuery('#tblqueryresponse').append(str);

                        if (data[i].status.toLowerCase() == "x" || $('#answer' + i).val() != "") {

                            $('#answer' + i).prop("disabled", true);
                            $('#fileToUpload' + i).prop('disabled', 'disbaled');
                            $('#eRFQVQueryFiles' + i).addClass('disable-click');
                        }
                        else {
                            $('#answer' + i).prop("disabled", false);
                            $('#fileToUpload' + i).prop("disabled", false);
                            $('#eRFQVQueryFiles' + i).removeClass('disable-click');
                        }

                        $('#answer' + i).maxlength({
                            limitReachedClass: "label label-danger",
                            alwaysShow: true
                        });
                    }
                    else {
                        $('#btnsubmitquery').addClass('hide')
                        str = "<tr id=trresquesid" + i + "><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\Check(this,\'" + data[i].id + "'\) \"  id=chkvender" + data[i].id + "  value=" + (data[i].id) + " style=\"cursor:pointer\" name=\"chkvender\" disabled/></span></div></td><td class=hide id=quesresid" + i + ">" + data[i].id + "</td><td>" + data[i].question + "</td><td>" + data[i].createdBy + "</td>";
                        str += '<td>' + data[i].answer + '</td>';
                        str += '<td>' + attach + '</td>';
                        jQuery('#tblqueryresponse').append(str);
                        if (data[i].status.toLowerCase() != "x" && data[i].status.toLowerCase() != "a") {
                            $('#chkvender' + data[i].id).removeAttr("disabled");
                            $('.checker').show();
                            //$('#btnwithdraw').show()
                        }
                        else {
                            $('.checker').hide();
                            //$('#btnwithdraw').hide();
                        }


                    }
                    sessionStorage.setItem('HeaderID', data[i].headerid)

                }
                if (IsApp == 'Y' && FwdTo == 'Admin' && pendingon.toLowerCase() == "c") {
                    $('#btnwithdraw').hide()
                }
                else if (IsApp == 'Y' && FwdTo != 'Admin' && pendingon.toLowerCase() == "c") {
                    $('#btnwithdraw').show()
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
    fnDownloadAttachments($("#" + aID.id).html(), 'NFAOverview/' + idx + '/NFAQuery');
}
function Check(event, Bidid) {

    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")
    }

    else {
        var EvID = event.id;
        //$(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")

    }

}
$(document).on('keyup', '.form-control', function () {
    if ($.trim($(this).val()).length) {
        $(this).css("border-color", "");

    }
});
function fnsubmitQueryByCreator() {
    var x = isAuthenticated();
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var flag = "T";
    var rowCount = jQuery('#tblqueryresponse >tbody>tr').length;
    for (i = 0; i < rowCount; i++) {

        if ($.trim($("#answer" + i).val()).length < 1 || $("#answer" + i).val() == "0") {
            $('#answer' + i).removeClass('has-success')
            $('#answer' + i).css("border", "1px solid red")
            flag = "F";

        }
    }
    if (flag == "T") {

        var quesquery = "";
        var attchname = "";
        var ext = "";
        $("#tblqueryresponse> tbody > tr").each(function (index) {
            var this_row = $(this);
            i = index;
            attchname = ''; ext = '';

            // attchname = $('#fileToUpload' + i).val().substring($('#fileToUpload' + i).val().lastIndexOf('\\') + 1, $('#fileToUpload' + i).val().lastIndexOf('.'))
            attchname = jQuery('#fileToUpload' + i).val().substring(jQuery('#fileToUpload' + i).val().lastIndexOf('\\') + 1)
            ext = $('#fileToUpload' + i).val().substring($('#fileToUpload' + i).val().lastIndexOf('.') + 1);
            if (attchname != "" && attchname != null && attchname != undefined) {
                attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
                fnUploadFilesonAzure('fileToUpload' + i, attchname, 'NFAOverview/' + idx + '/NFAQuery');
            }
            else {
                if ($('#eRFQVQueryFiles' + i).text() != '' && $('#eRFQVQueryFiles' + i).text() != null && $('#eRFQVQueryFiles' + i).text() != 'undefined') {
                    attchname = $('#eRFQVQueryFiles' + i).text();
                }
            }


            quesquery = quesquery + $.trim($('#quesresid' + i).text()) + '~' + $.trim($('#answer' + i).val()) + '~' + attchname + '#';


        });
        var data = {
            "NFAID": parseInt(idx),
            "QuesString": quesquery,
            "UserID": sessionStorage.getItem('UserID'),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "Headerid": parseInt(sessionStorage.getItem('HeaderID')),
            "PendingOn": "A"
        }

        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "NFA/NFARaiseResponseQuery",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {
                bootbox.alert("Query's Response Submitted Successfully.", function () {
                    window.location = 'index.html';
                    jQuery.unblockUI();

                });

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandangerquery', '');
                }
                jQuery.unblockUI();
                return false;
            }

        });

    }
    else {
        $('.alert-danger').show();
        $('#msgErrorquery').text('Please fill Answer.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery.unblockUI();
    }
}
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
        //rowques = rowques + 1;
        var num = 0;
        var maxidnum = -1;
        $("#tblquestions tr:gt(0)").each(function () {
            var this_row = $(this);

            num = (this_row.closest('tr').attr('id')).substring(8, (this_row.closest('tr').attr('id')).length)
            if (parseInt(num) > parseInt(maxidnum)) {
                maxidnum = num;
            }
        });

        rowques = parseInt(maxidnum) + 1;
        if (!jQuery("#tblquestions thead").length) {
            jQuery('#tblquestions').append("<thead><tr><th class='bold' style='width:40%!important' colspan=4>Questions</th><th style='width:5%!important'></th></tr></thead>");
        }
        var str = '<tr id=trquesid' + rowques + '><td class=hide id=quesid' + rowques + '>0</td><td colspan=4 id=ques' + rowques + '>' + jQuery("#txtquestions").val() + '</td>';
        str += '<td style="width:5%!important"><button type=button id=Removebtn' + rowques + ' class="btn btn-xs btn-danger"  onclick="deletequesrow(trquesid' + rowques + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td class=hide>C</td></tr>';
        jQuery('#tblquestions').append(str);
        jQuery("#txtquestions").val('')

        if ((jQuery('#txtquestions> tbody> tr').length == 0 || queslength >= 0) && (PendingOn != 'A' && PendingOn != 'X')) {
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

    if ((jQuery('#txtquestions> tbody > tr').length == 1 || queslength >= 0)) {

        $('#btnTechquery').attr('disabled', 'disabled')
    }
    else {
        $('#btnTechquery').removeAttr('disabled')
    }
}
function submitQuery() {
    var x = isAuthenticated();
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    $('#btnTechquery').prop('disabled', true)
    var quesquery = "";
    if ($("#tblquestions> tbody > tr").length > 0) {
        if ($('#txtquestions').val() == "") {
            $('#querycount' + $('#hdnvendorid').val()).text('Response Pending (' + $("#tblquestions> tbody > tr").length + ')')
            $("#tblquestions> tbody > tr").each(function (index) {
                var this_row = $(this);
                index = (this_row.closest('tr').attr('id')).substring(8, (this_row.closest('tr').attr('id')).length)
                if ($.trim($('#quesid' + index).text()) == "0") {
                    quesquery = quesquery + $.trim($('#ques' + index).text()) + '#';
                }

            });
            var data = {
                "NFAID": parseInt(idx),
                "QuesString": quesquery,
                "UserID": sessionStorage.getItem('UserID'),
                "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
                "Headerid": parseInt(sessionStorage.getItem('HeaderID')),
                "PendingOn": "C"
            }

            jQuery.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "NFA/NFARaiseResponseQuery",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                crossDomain: true,
                async: false,
                data: JSON.stringify(data),
                dataType: "json",
                success: function (data) {

                    bootbox.alert("Approval can now be enabled after Approver response or query withdrawal .", function () {
                        setTimeout(function () {

                            $('#btnTechquery').attr('disabled', 'disabled')
                            $('#btnSubmitApp').attr('disabled', 'disabled')
                            $('#btnSubmitApp').removeClass('green').addClass('default')

                            $("#RaiseQuery").modal('hide');
                            GetQuestionsforCreator('C')
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
        message: "Do you want to withdraw query from Approver, Click Yes for  Continue ",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    $('.modal-footer .btn-success').prop('disabled', true);
                    withdrawquery();
                }
            },
            cancel: {
                label: "No",
                className: "btn-warning",
                callback: function () {
                    $('.modal-footer .btn-warning').prop('disabled', true);
                    return true;

                }
            }
        }
    });
}
function withdrawquery() {
    var x = isAuthenticated();
    var checkedValue = '';
    $("#tblqueryresponse> tbody > tr").each(function (index) {
        var this_row = $(this);
        if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            index = (this_row.closest('tr').attr('id')).substring(11, (this_row.closest('tr').attr('id')).length)
            checkedValue = checkedValue + $('#quesresid' + index).text() + ',';
        }
    });
    checkedValue = checkedValue.slice(0, -1)
    if (checkedValue == '') {
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter atleast one Query to withdraw');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery.unblockUI();
        return false;
    }
    else {
        var data = {
            "NFAID": parseInt(idx),
            "QuesString": checkedValue,
            "UserID": sessionStorage.getItem('UserID'),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "Headerid": parseInt(sessionStorage.getItem('HeaderID')),
            "PendingOn": "X"

        }
        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "NFA/NFARaiseResponseQuery",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {

                bootbox.alert("Query withdraw from Approver successfully .", function () {
                    setTimeout(function () {
                        $('#btnSubmitApp').removeAttr('disabled')
                        $('#btnSubmitApp').addClass('green').removeClass('default')
                        GetQuestions();
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


}
function fnRecall() {
    bootbox.dialog({
        message: "Do you want to Recall NFA, Click Yes for  Continue ",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    $('.modal-footer .btn-success').prop('disabled', true);
                    DisableActivityRecall();
                }
            },
            cancel: {
                label: "No",
                className: "btn-warning",
                callback: function () {
                    $('.modal-footer .btn-warning').prop('disabled', true);
                    return true;

                }
            }
        }
    });
}
function DisableActivityRecall() {
    var x = isAuthenticated();
    var _cleanString = StringEncodingMechanism(jQuery("#txtRemarksrecall").val());
    var data = {
        "NFAID": parseInt(idx),
        "FromUserId": sessionStorage.getItem('UserID'),
        "Action": 'Recalled',
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActivityDescription": jQuery("#lbltitle").text(),
        "Remarks": _cleanString
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "NFA/RecallNFA",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {

            bootbox.alert("NFA ReCalled successfully .", function () {
                window.location.href = "index.html";

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

function fnDownloadZip() {

    var prefix = 'NFAOverview/' + parseInt(getUrlVarsURL(decryptedstring)["nfaIdx"])
    fetch(sessionStorage.getItem("APIPath") + "BlobFiles/DownloadZip/?Prefix=" + prefix)
        .then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'DownloadNFA.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            fngeneratePDF()
            bootbox.alert("File downloaded Successfully.", function () {
                return true;
            });

        })
}


function fngeneratePDF() {
    var encrypdata = fnencrypt("nfaIdx=" + nfaid + "&FwdTo=View")
    if (sessionStorage.getItem('CustomerID') == 32 || sessionStorage.getItem('CustomerID') == 29) {
        window.open("viewPPCReport.html?param=" + encrypdata, "_blank")
    }
    else {
        window.open("viewNfaReport.html?param=" + encrypdata, "_blank")
    }

}
    

function popapprfunc(approverName, approverID) {
    console.log(allUsers)
    fromUserID = approverID; 
    jQuery("#fromApproveUser").empty();
    jQuery('#fromApproveUser').append('<tr><th>Delegate Approver</th></tr>')
    jQuery('#fromApproveUser').append('<tr><td>' + approverName + '</td></tr>')
    jQuery("#txtDeligateName").empty();
    jQuery("#txtDeligateName").append(jQuery("<option></option>").val("").html("Select Project"));
    if (allUsers.length > 0) {
        for (var i = 0; i < allUsers.length; i++) {
            jQuery("#txtDeligateName").append(jQuery("<option></option>").val(allUsers[i].userID).html(StringDecodingMechanism(allUsers[i].userName)));

        }
    }
 
}


function PostNewApprover() {
    jQuery('.btnhide').attr('disabled', 'disabled')
    var delegateTOID = $("#txtDeligateName").val();
    var data = {
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "NFAID": idx,
        "FromUserId": fromUserID,
        "Remarks": $("#remarkAprv").val(),
        "Action": 'Delegate',
        "DelgateTo": delegateTOID
    } 
    console.log(data);
    if (fromUserID == delegateTOID) {
        jQuery(".alert-danger").html("Can not delegate to the same approver...");
        console.log("Can not delegate to the same approver...")
        $('.btnhide').removeAttr("disabled");
        return false;
    } 
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "NFA/NFADelegate",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        }
    });

    jQuery.unblockUI();
}

