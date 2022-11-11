var idx = 0;
var allUsers = [];
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
        $('#lblNFAID').html('NFA ID :' + idx)
        $('#lblnfa').html(idx)
        $('#divRemarksApp').hide();
    }

    if (idx != null) {

        GetOverviewmasterbyId(idx);
        BindSaveparams();
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
            $('#frmadminbutton').show()

        }
        else if (FwdTo == 'View') {
            jQuery("#frmdivremarksapprover").hide();
            jQuery("#divRemarksApp").hide();
            $('#frmadminbutton').hide()

        }
        else {
            jQuery("#divRemarksApp").show();
            jQuery("#frmdivremarksapprover").show();
            $('#frmadminbutton').hide()
        }


    }


});

function fetchRegisterUser() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(UserID) + "&Isactive=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        async: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {

                allUsers = data;

            }

        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
        }

    });

}
//abheedev bug 385
var nfaid = 0;
function GetOverviewmasterbyId(idx) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = "NFA/GetNFAOverViewsById?CustomerID=" + parseInt(CurrentCustomer) + "&idx=" + parseInt(idx);
    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {
            nfaid = res.result[0].nfaID
            if (res.result.length > 0) {
                if (res.result[0].nfaCategory == "1")
                    $(".clsHide").hide();
                else
                    $(".clsHide").show();

                if (res.result[0].eventID == 0) {
                    $(".clsHideEvent").hide();
                }
                else
                    $(".clsHideEvent").show();

                $("#lbltitle").text(res.result[0].nfaSubject);
                $("#lblDetailsdesc").html("<b>Descrition:</b>");
                $("#lblDetails").text(res.result[0].nfaDescription);
                $("#lblAmount").text(thousands_separators(res.result[0].nfaAmount))//+ " " + res.result[0].currencyNm);

                $("#lblbudgetamount").text(thousands_separators(res.result[0].nfaBudget))

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
                    $("#lblEventType").text("Outside NFA")
                    // $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + res.result[0].eventRefernce + "'\, \'" + res.result[0].bidForID + "'\,\'" + res.result[0].bidTypeID + "'\,\'0'\) href = 'javascript:;' >" + res.result[0].eventReftext + "</a>");
                }
                else {
                    $("#lblEventType").text("RFQ")
                    $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'0'\,\'0'\,\'0'\,\'" + res.result[0].eventRefernce + "'\) href = 'javascript:;' >" + res.result[0].eventReftext + "</a>");
                }

                if (res.result[0].remarks != '') {
                    $(".clsHide").show();
                }
                else {
                    $(".clsHide").hide();
                }
                $("#lblException").text(res.result[0].conditionName);
                //abheedev backlog 286
                $("#lblRemark").html(res.result[0].remarks);
                $("#NFa_ConfiguredBy").html("NFA Request Configured By :" + res.result[0].createdBy);

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
                for (var i = 0; i < data.length; i++) {

                    jQuery('#divappendstatusbar').append('<div class="col-md-2 mt-step-col first" id=divstatuscolor' + i + '><div class="mt-step-number bg-white" style="font-size:small;height:38px;width:39px;" id=divlevel' + i + '></div><div class="mt-step-title font-grey-cascade" id=divapprovername' + i + ' style="font-size:smaller"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divstatus' + i + '></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divPendingDate' + i + '></div></div></div></div>')
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
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var approvalbyapp = {
        "NFAID": parseInt(idx),
        "FromUserId": sessionStorage.getItem("UserID"),
        "ActivityDescription": jQuery("#lbltitle").text(),
        "Remarks": jQuery("#txtRemarksApp").val(),
        "Action": jQuery("#ddlActionType option:selected").val(),
        "ForwardedBy": "Approver",
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    };


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
    });
}
$("#editValuesModal").on("hidden.bs.modal", function () {
    $('#txtApprover').val('')
    $('#hdndelegateuserid').val('0')
    $('#txtdelegate').val()
});
function DelegateUser() {

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
            "Remarks": jQuery("#txtdelegate").val(),
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
                jQuery('#tblquestions').append("<thead><tr><th></th><th class='bold' style='width:40%!important'>Questions</th><th class='bold' style='width:40%!important'>Answer</th><th class='bold' style='width:10%!important'>Attachment</th><th class='bold' style='width:5%!important'>CreatedBy</th><th style='width:5%!important'></th></tr></thead>");
                for (var i = 0; i < data.length; i++) {
                    rowques = rowques + 1;
                    attach = '';
                    if (data[i].attachment != '') {
                        attach = '<a style="pointer: cursor; text-decoration:none; "  id=eRFQVQueryFiles' + i + ' href="javascript: ; " onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a>';
                    }

                    str = "<tr id=trquesid" + (i) + "><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + data[i].id + "'\) \"  id=chkvender" + data[i].id + "  value=" + (data[i].id) + " style=\"cursor:pointer\" name=\"chkvender\" disabled/></span></div></td><td class=hide id=quesid" + i + ">" + data[i].id + "</td><td id=ques" + i + ">" + data[i].question + "</td>";
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
                    if (data[i].status.toLowerCase() != "x") {
                        $('#chkvender' + data[i].id).removeAttr("disabled");
                    }
                    PendingOn = data[i].pendingOn;
                    sessionStorage.setItem('HeaderID', data[i].headerid)
                }

                GetQuestionsforCreator(PendingOn);

                if (PendingOn.toLowerCase() == "c") {
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
function GetQuestionsforCreator(pendingon) {

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
                jQuery('#tblqueryresponse').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Questions</th><th style='width:10%!important'>Created By</th><th style='width:50%!important'>Answer</th><th style='width:10%!important'>Attachment</th></tr></thead>");

                for (var i = 0; i < data.length; i++) {
                    attach = '';
                    if (data[i].attachment != '') {
                        attach = '<a style="pointer:cursor; text-decoration:none; "  id=eRFQVQueryFiles' + i + '  href="javascript:;" onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a>';
                    }

                    if (pendingon.toLowerCase() == "c" && data[0].nfaCreatorEncrypted == sessionStorage.getItem('UserID') && FwdTo == 'Admin') {
                        $('#btnsubmitquery').removeClass('hide')
                        str = '<tr id=trquesid' + i + '><td class=hide id=ques' + i + '>' + data[i].id + '</td><td>' + data[i].question + '</td><td>' + data[i].createdBy + '</td>';
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
                        str = '<tr id=trquesid' + (i + 1) + '><td class=hide id=ques' + i + '>' + data[i].id + '</td><td>' + data[i].question + '</td><td>' + data[i].createdBy + '</td>';
                        str += '<td>' + data[i].answer + '</td>';
                        str += '<td>' + attach + '</td>';
                        jQuery('#tblqueryresponse').append(str);
                    }

                }

            }
            else {

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
    fnDownloadAttachments($("#" + aID.id).html(), 'NFA/' + idx + '/NFAQuery');
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
    if ($.trim($('.form-control').val()).length) {
        $(this).addClass('has-success');
    }
});
function fnsubmitQueryByCreator() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var flag = "T";
    var rowCount = jQuery('#tblqueryresponse >tbody>tr').length;
    for (i = 0; i < rowCount; i++) {
        if ($("#answer" + i).val() == "" || $("#answer" + i).val() == "0") {
            $('#answer' + i).removeClass('has-success')
            $('#answer' + i).css("border", "1px solid red")
            flag = "F";

        }
        else {
            flag = "T"
        }

    }
    if (flag == "T") {
        var i = 0;
        var quesquery = "";
        var attchname = "";
        var ext = "";
        $("#tblqueryresponse> tbody > tr").each(function (index) {
            var this_row = $(this);
            attchname = ''; ext = '';
            attchname = jQuery('#fileToUpload' + i).val().substring(jQuery('#fileToUpload' + i).val().lastIndexOf('\\') + 1)
            ext = $('#fileToUpload' + i).val().substring($('#fileToUpload' + i).val().lastIndexOf('.') + 1);

            if (attchname != "" && attchname != null && attchname != undefined) {
                attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
                attchname = attchname.replace('.', '@')
                fnUploadFilesonAzure('fileToUpload' + i, $('#fileToUpload' + i).val(), 'NFA/' + idx + '/NFAQuery');
            }
            else {
                if ($('#eRFQVQueryFiles' + i).text() != '' && $('#eRFQVQueryFiles' + i).text() != null && $('#eRFQVQueryFiles' + i).text() != 'undefined') {
                    attchname = $('#eRFQVQueryFiles' + i).text()
                }
            }
            quesquery = quesquery + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim($('#answer' + i).val()) + '~' + attchname + '#';
            i++;
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
            jQuery('#tblquestions').append("<thead><tr><th class='bold' style='width:40%!important' colspan=5>Questions</th><th style='width:5%!important'></th></tr></thead>");
        }
        var str = '<tr id=trquesid' + rowques + '><td class=hide id=quesid' + rowques + '>0</td><td colspan=5 id=ques' + rowques + '>' + jQuery("#txtquestions").val() + '</td>';
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
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var quesquery = "";
    if ($("#tblquestions> tbody > tr").length > 0) {
        if ($('#txtquestions').val() == "") {
            $('#querycount' + $('#hdnvendorid').val()).text('Response Pending (' + $("#tblquestions> tbody > tr").length + ')')
            $("#tblquestions> tbody > tr").each(function (index) {
                var this_row = $(this);
                //quesquery = quesquery + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim(this_row.find('td:eq(1)').html())+ '#';
                //if ($.trim(this_row.find('td:eq(0)').html()) == "0") {
                index = (this_row.closest('tr').attr('id')).substring(8, (this_row.closest('tr').attr('id')).length)
                if ($.trim($('#quesid' + index).text()) == "0") {
                    quesquery = quesquery + $.trim($('#ques' + index).text()) + '#';//$.trim(this_row.find('td:eq(1)').html()) + '#';
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

            //console.log(JSON.stringify(data))
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
                            GetQuestionsforCreator(PendingOn)
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
    var checkedValue = '';
    $("#tblquestions> tbody > tr").each(function (index) {
        var this_row = $(this);
        if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            index = (this_row.closest('tr').attr('id')).substring(8, (this_row.closest('tr').attr('id')).length)
            checkedValue = checkedValue + $('#quesid' + index).text() + ',';
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
        console.log(JSON.stringify(data))
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
                    DisableActivityRecall();
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
function DisableActivityRecall() {
    var data = {
        "NFAID": parseInt(idx),
        "FromUserId": sessionStorage.getItem('UserID'),
        "Action": 'Recalled',
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActivityDescription": jQuery("#lbltitle").text(),
        "Remarks": jQuery("#txtRemarksrecall").val()
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

// abheedev backlog 471
$('#btnpdf').click(function () {


    var encrypdata = fnencrypt("nfaIdx=" + nfaid + "&FwdTo=View")
    window.open("viewNfaReport.html?param=" + encrypdata, "_blank")
})
