var idx = 0;
var allUsers = [];


function fetchRegisterUser() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(UserID),
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
function GetOverviewmasterbyId(idx) {
    debugger;
    var url = "NFA/GetNFAOverViewsById?CustomerID=" + parseInt(CurrentCustomer) + "&idx=" + parseInt(idx);
    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {

            if (res.result.length > 0) {
            
      
                console.log(res.result[0]);

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
                $("#lblDetails").text(res.result[0].nfaDescription);
                $("#lblAmount").text(res.result[0].nfaAmount);
                $("#lblCurrency").text(res.result[0].currencyNm);
                $("#lblCategory").text(res.result[0].categoryName);
                $("#lblProjectName").text(res.result[0].projectName);
                $("#lblbudget").text(res.result[0].budgetStatustext);
                $("#lblPurOrg").text(res.result[0].orgName);
                $("#lblGroup").text(res.result[0].groupName);
                $("#lblEventType").text(res.result[0].eventtypeName);
                $("#lblEventId").text(res.result[0].eventReftext);
                $("#lblRemark").text(res.result[0].remarks);
                $("#NFa_ConfiguredBy").html("NFA Request Configured By :"+res.result[0].createdBy);

            }
        }
    });
    GetData.error(function (res) {
        jQuery.unblockUI();
    });
};


function BindAttachmentsOfEdit() {
    var url = "NFA/FetchNFaFiles?CustomerId=" + parseInt(CurrentCustomer) + "&NfaId=" + parseInt(idx);

    var GetFilesData = callajaxReturnSuccess(url, "Get", {})
    GetFilesData.success(function (res) {
        $('#tblAttachments').empty();
        if (res != null) {
            if (res.result.length > 0) {

                $.each(res.result, function (key, value) {
                    rowAttach = ++key;
                    var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + value.nfaFileDescription + '</td>';
                    str += '<td class=hide>' + value.nfaFileName + '</td>'

                    str += '<td class=style="width:47%!important"><a id=aeRFQFile' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + value.nfaFileName + '</a></td>';

                    str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + value.nfaFileName + '\',aeRFQFile' + rowAttach + ',0)" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
                    $('#tblAttachments').append(str);


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
        }
    })

};

function BindSaveparams() {
    var url = "NFA/FetchSavedOverviewParam?customerid=" + parseInt(CurrentCustomer) + "&nfaidx=" + parseInt(idx);

    var ParamData = callajaxReturnSuccess(url, "Get", {})
    ParamData.success(function (res) {

        if (res != null) {
            $("#tblNFAOverviewParam").empty();
            if (res.result.length > 0) {
                $("#tblNFAOverviewParam").append("<thead><tr><th class='bold' style='width:50%!important'>Param text</th><th class='bold' style='width:40%!important'>Remark</th></tr></thead>");
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

    //jQuery.blockUI({ message: '<h5><img src="assets_1/layouts/layout/img/loading.gif" />  Please Wait...</h5>' });
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
           // sessionStorage.setItem("LastApproverStaffCode", data[data.length - 1].approverStaffCode)
            if (data.length > 0) {
                $('#div_statusbar').removeClass('hide');
                jQuery('#divappendstatusbar').empty();
                var counterColor = 0;
                for (var i = 0; i < data.length; i++) {

                    jQuery('#divappendstatusbar').append('<div class="col-md-2 mt-step-col first" id=divstatuscolor' + i + '><div class="mt-step-number bg-white" style="font-size:small;height:38px;width:39px;" id=divlevel' + i + '></div><div class="mt-step-title font-grey-cascade" id=divapprovername' + i + ' style="font-size:smaller"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divstatus' + i + '></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divPendingDate' + i + '></div></div></div></div>')
                    jQuery('#divlevel' + i).text(data[i].approverSeq);
                    jQuery('#divapprovername' + i).text(data[i].approverName);
                    jQuery('#divPendingDate' + i).text(data[i].receiptDt);

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
                    if (data[i].statusCode == 30) {

                        counterColor = counterColor + 1;
                        status = 'Reject'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
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
                    if (data[i].statusCode == 20 | data[i].statusCode == 30 || data[i].statusCode == 40) {
                        jQuery('#divstatuscolor' + i).addClass('done');
                    }

                    if (counterColor > 1) {
                        if (status == 'Pending') {
                            status = 'N/A'
                            jQuery('#divPendingDate' + i).addClass('hide')
                            c = c + 1;
                            jQuery('#divstatus' + i).text(status);
                            jQuery('#divstatuscolor' + i).removeClass('error')
                            jQuery('#divstatuscolor' + i).addClass('font-yellow')
                            jQuery('#divstatuscolor' + i).addClass('last')
                            jQuery('#divstatus' + i).addClass('font-yellow')
                            jQuery('#divapprovername' + i).addClass('font-yellow')

                        }
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
   // sessionStorage.setItem('hdnWBApproverEmailid', '');
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
            sessionStorage.setItem('hdnWBApproverEmailid', map[item].emailID);


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
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/FetchRecomendedVendor/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=" + bidid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $('#tblremarksapprover').empty()
            if (data.length > 0) {
                $('#divforapprovalprocess').show()
                $('#tblremarksapprover').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th class=hide id=thapprover>Recommended Vendor</th><th>Completion DT</th></tr>')
                if (AppStatus == 'Reverted') {
                    jQuery("#lblrevertedComment").text(data[0].remarks);
                    jQuery("#RevertComment").show();
                    $('#frmdivremarksforward').removeClass('col-md-12');
                    $('#frmdivremarksforward').addClass('col-md-6');
                    $('#frmdivforward').show();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].vendorName != "") {
                            $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + data[i].receiptDt + '</td></tr>')
                            $('#thforward').removeClass('hide')
                        }
                        else {
                            $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')
                            $('#thforward').addClass('hide')
                        }


                    }
                }
                $('#frmdivremarksapprover').removeClass('col-md-12');
                $('#frmdivremarksapprover').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {
                    
                    if (data[i].vendorName != "") {
                        $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + data[i].receiptDt + '</td></tr>')
                        $('#thapprover').removeClass('hide')
                    }
                    
                    else {
                        $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')
                        $('#thapprover').addClass('hide')
                    }
                }
                $('#frmdivapprove').show()
            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
            
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });

}
function ApprovalApp() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    var approvalbyapp = {
        "NFAID": parseInt(BidID),
        "FromUserId": sessionStorage.getItem("UserID"),
        "ActivityDescription": jQuery("#lblbidSubject").text(),
        "Remarks": jQuery("#txtRemarksApp").val(),
        "Action": jQuery("#ddlActionType option:selected").val(),
        "ForwardedBy": "Approver",
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    };

    //alert(JSON.stringify(approvalbyapp))
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