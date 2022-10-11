
var WBSeq = 0;
var NBSeq = 0;
var OBSeq = 0;
var ApproverType = '';
var nfaApproverIDX = 0;
var error = $('.alert-danger');
var success = $('.alert-success');

var form = $('#submit_form');
var FlagForCheckShowPrice = "N";
var objData = {};

var ApproverSeqData = [];
var Approvermasterdata = [];
var allUsers = [];
var nfaEditedID = 0;
var isHide = 'hide';
var isEditAllowed = '';
var verifyApproverMatrix = '';

var MoveSeqData = '<a style="cursor:pointer" class="up"><i class="fa fa-arrow-up" aria-hidden="true"></i></a><a style="cursor:pointer" class="down"><i class="fa fa-arrow-down" aria-hidden="true"></i></a>';

$(document).ready(function () {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    bindApproverMaster();
    BindPurchaseOrg();
    bindConditionDDL();
    fetchRegisterUser();
    jQuery.unblockUI();
    //  BindApprovers();
});

function FetchCurrency(CurrencyID) {

    jQuery.ajax({

        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchCurrency/?CurrencyID=" + CurrencyID + "&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#dropCurrency").empty();
            jQuery("#dropCurrency").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#dropCurrency").append(jQuery("<option></option>").val(data[i].currencyId).html(data[i].currencyNm));

            }
            $("#dropCurrency").val(parseInt(DefaultCurrency));

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
// Move up down logic
$("#tblWBApproverSeq").on("click", ".up,.down", function () {

    var row = $(this).parents("tr:first");
    if ($(this).is('.up')) {
        row.insertBefore(row.prev());

    }
    else {
        row.insertAfter(row.next());
    }
    var rowCount = $('#tblWBApproverSeq >tbody>tr').length;
    var i = 1;
    if (rowCount >= 1 && ApproverType == 'S') {
        $("#tblWBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
});
$("#tblOBApproverSeq").on("click", ".up,.down", function () {

    var row = $(this).parents("tr:first");
    if ($(this).is('.up')) {
        row.insertBefore(row.prev());

    }
    else {
        row.insertAfter(row.next());
    }
    var rowCount = $('#tblOBApproverSeq tr').length;
    var i = 1;
    if (rowCount > 1 && ApproverType == 'S') {
        $("#tblOBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
});
$("#tblNBApproverSeq").on("click", ".up,.down", function () {

    var row = $(this).parents("tr:first");
    if ($(this).is('.up')) {
        row.insertBefore(row.prev());

    }
    else {
        row.insertAfter(row.next());
    }
    var rowCount = $('#tblNBApproverSeq tr').length;
    var i = 1;
    if (rowCount > 1 && ApproverType == 'S') {
        $("#tblNBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
});
//end
function fncheckapprovers() {
    $('#chkWBCopy').prop('checked', false);
    $('#chkWBCopy').closest('span').removeClass('checked');
    $('#chkOBCopy').closest('span').removeClass('checked');
    $('#chkOBCopy').prop('checked', false);

}
function bindApproverMaster() {

    var url = "NFA/FetchApproverMaster?CustomerId=" + parseInt(CurrentCustomer) + "&UserID=" + encodeURIComponent(UserID);

    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {

        if (res.result.length != null) {
            $('#tblAllmatrix').empty();
            if (res.result.length > 0) {
                Approvermasterdata = res.result;
                $('#tblAllmatrix').append("<thead><th></th><th>Purchase Org</th><th>Purchase Group</th><th>Amount From</th><th>Amount To</th><th>Approval type</th><th>Condition</th><th>Deviation %</th></thead>")
                for (var i = 0; i < res.result.length; i++) {
                    $('#tblAllmatrix').append('<tr><td><button class="btn btn-xs btn-success" href="javascript:;" onClick="GetApprovermasterbyId(' + res.result[i].idx + ')"><i class="fa fa-pencil"></i></button></td><td>' + res.result[i].orgName + '</td><td>' + res.result[i].groupName + '</td><td>' + thousands_separators(res.result[i].amountFrom) + '</td><td>' + thousands_separators(res.result[i].amountTo) + '</td><td>' + res.result[i].approvalType + '</td> <td>' + res.result[i].conditionName + '</td>  <td>' + res.result[i].deviation + '</td></tr>');
                }
            }
            else {
                $('#tblAllmatrix').append('<tr><td>No Matrix Found</td></tr>');
            }
        }
    });
    GetData.error(function (res) {

    });

};

function GetApprovermasterbyId(idx) {

    var url = "NFA/FetchApproverMasterById?CustomerId=" + parseInt(CurrentCustomer) + "&idx=" + parseInt(idx);

    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {
            nfaEditedID = idx;
            nfaApproverIDX = idx;
            if (res.result.length > 0) {

                $("#ddlApproveltype").val(res.result[0].approvalType);
                $("#txtAmountFrom").val((removeThousandSeperator(res.result[0].amountFrom)));
                $("#txtAmountTo").val((removeThousandSeperator(res.result[0].amountTo)));

                $("#txtdeviation").val(res.result[0].deviation);
                $("#ddlPurchaseOrg").val(res.result[0].orgID);
                setTimeout(function () {
                    bindPurchaseGroupDDL();
                    $("#ddlPurchasegroup").val(res.result[0].groupID);
                    $('#viewAllMatrix').modal('hide')
                }, 1000)

                $("#ddlCondition").val(res.result[0].conditionID);
                //sessionStorage.setItem('hdnPurchaseGroupID', res.result[0].groupID);
                //sessionStorage.setItem('hdnPurchaseORGID', res.result[0].orgID);
                //sessionStorage.setItem('hdnConditionID', res.result[0].conditionID);
                ApproverType = res.result[0].approvalType;
                var checked = res.result[0].isActive;

                //if (ApproverType == "S")
                //    MoveSeqData = '<a style="cursor:pointer" class="up"><i class="fa fa-arrow-up" aria-hidden="true"></i></a><a style="cursor:pointer" class="down"><i class="fa fa-arrow-down" aria-hidden="true"></i></a>';
                //else
                //    MoveSeqData = '';

                if (checked == true) {
                    $('input:checkbox[name=chkIsActive]').attr('checked', true);
                    $('#chkIsActive').parents('span').addClass('checked');
                }
                else {
                    $('input:checkbox[name=chkIsActive]').attr('checked', false);
                    $('#chkIsActive').parents('span').removeClass('checked');
                }
                $('#form_wizard_1').find('.button-previous').hide();
                if (tabno = 1) {
                    $('#form_wizard_1').bootstrapWizard('previous')
                    $('#form_wizard_1').bootstrapWizard('previous');
                }

            }
        }
    });
    GetData.error(function (res) {
        jQuery.unblockUI();
    });
}

jQuery("#txtDetails").keyup(function () {
    sessionStorage.setItem("hdnApprovermasterIDX", 0);

});
sessionStorage.setItem("hdnApprovermasterIDX", 0);
$("#txtDetails").typeahead({
    source: function (query, process) {
        var data = Approvermasterdata;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            // console.log(data);
            map[username.approverEdit] = username;

            usernames.push(username.approverEdit);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].idx != "0") {
            sessionStorage.setItem('hdnApprovermasterIDX', map[item].idx);
            nfaApproverIDX = map[item].idx;
            nfaEditedID = nfaApproverIDX;
            GetApprovermasterbyId(nfaApproverIDX);
        }
        else {
            gritternotification('Select Approval Matrix to edit!!!');
        }

        return item;
    }
})


//jQuery("#ddlCondition").keyup(function () {
//    sessionStorage.setItem('hdnConditionID', '0');

//});
//sessionStorage.setItem('hdnConditionID', 0);
//jQuery("#ddlCondition").typeahead({
//    source: function (query, process) {

//        var data = conditionData;
//        usernames = [];
//        map = {};
//        var username = "";
//        jQuery.each(data, function (i, username) {
//            console.log(data);
//            map[username.conditionName] = username;
//            usernames.push(username.conditionName);
//        });
//        process(usernames);
//    },

//    minLength: 2,
//    updater: function (item) {

//        if (map[item].conditionID != "0") {
//            sessionStorage.setItem('hdnConditionID', map[item].conditionID);
//        }
//        else {
//            gritternotification('Condition Not selected!!!');
//        }

//        return item;
//    }

//});

function CheckDuplicate() {

    //var p_orgId = sessionStorage.getItem('hdnPurchaseORGID');
    //var p_groupId = sessionStorage.getItem('hdnPurchaseGroupID');
    //var p_conditionId = sessionStorage.getItem('hdnConditionID');
    var amountFrom = $("#txtAmountFrom").val();
    var amountTo = $("#txtAmountTo").val();

    var Model = {

        orgID: parseInt($('#ddlPurchaseOrg option:selected').val()),
        cusID: parseInt(CurrentCustomer),
        groupID: parseInt($('#ddlPurchasegroup option:selected').val()),
        conditionID: parseInt($('#ddlCondition option:selected').val()),
        amountFrom: parseFloat(removeThousandSeperator(amountFrom)),
        amountTo: parseFloat(removeThousandSeperator(amountTo))

    };
    debugger;
    console.log(JSON.stringify(Model))
    var url = "NFA/VerifyExistingApprover";
    var VerifyApproverMatrix = callajaxReturnSuccess(url, "Post", JSON.stringify(Model));
    VerifyApproverMatrix.success(function (res) {

        if (res.status != "E") {

            verifyApproverMatrix = res.result;
        }
        else {
            alert("Error :" + res.error);
        }
    });
    VerifyApproverMatrix.error(function (xhr, status, error) {
        //  jQuery.unblockUI();
    })
}

//New Appprover Logic
//Purchase ORG.
function BindPurchaseOrg() {
    var url = "NFA/GetPurchaseOrgByUserid?CustomerId=" + parseInt(CurrentCustomer) + "&UserId=" + encodeURIComponent(UserID);

    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#ddlModelOrg,#ddlPurchaseOrg").empty();
        $('#ddlModelOrg').append('<option value="0">Select</option>');
        $('#ddlPurchaseOrg').append('<option value="0">Select</option>');
        if (res.result.length > 0) {
            //orgData = res.result;
            $.each(res.result, function (key, value) {
                $('#ddlModelOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');
                $('#ddlPurchaseOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');
            });
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);

    });

};

function bindPurchaseGroupDDL() {

    var url = "NFA/GetPurchaseGroupByUserID?CustomerId=" + parseInt(CurrentCustomer) + "&OrgId=" + $('#ddlPurchaseOrg option:selected').val() + "&UserID=" + encodeURIComponent(UserID);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});

    GetNFAPARAM.success(function (res) {
        $("#ddlPurchasegroup").empty();
        $('#ddlPurchasegroup').append('<option value="0">Select</option>');
        if (res.result.length > 0) {
            $.each(res.result, function (key, value) {
                $('#ddlPurchasegroup').append('<option value=' + value.idx + '>' + value.groupName + '</option>');
            });
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
    });

};

function bindConditionDDL() {

    var url = "NFA/fetchNFACondition?CustomerId=" + parseInt(CurrentCustomer) + "&IsActive=N";

    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {

        if (res.result != null) {
            $("#ddlCondition").empty();
            $("#ddlCondition").append(jQuery("<option></option>").val("0").html("Select"));
            if (res.result.length > 0) {
                //conditionData = res.result;

                for (var i = 0; i < res.result.length; i++) {
                    $("#ddlCondition").append(jQuery("<option></option>").val(res.result[i].conditionID).html(res.result[i].conditionName));
                }
            }
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
    });
};


//jQuery("#ddlPurchaseOrg").keyup(function () {
//    sessionStorage.setItem('hdnPurchaseORGID', '0');

//});
//sessionStorage.setItem('hdnPurchaseORGID', '0');
//jQuery("#ddlPurchaseOrg").typeahead({
//    source: function (query, process) {

//        var data = orgData;
//        usernames = [];
//        map = {};
//        var username = "";
//        jQuery.each(data, function (i, username) {
//            // console.log(data);
//            map[username.purchaseOrgName] = username;
//            usernames.push(username.purchaseOrgName);
//        });

//        process(usernames);

//    },
//    minLength: 2,
//    updater: function (item) {
//        if (map[item].purchaseOrgID != "0") {
//            sessionStorage.setItem('hdnPurchaseORGID', map[item].purchaseOrgID);
//            bindPurchaseGroupDDL(map[item].purchaseOrgID);
//        }
//        else {
//            gritternotification('Purchase Group not selected!!!');
//        }

//        return item;
//    }

//});
//jQuery("#ddlPurchasegroup").keyup(function () {
//    sessionStorage.setItem('hdnPurchaseGroupID', '0');

//});
//sessionStorage.setItem('hdnPurchaseGroupID', '0');
//jQuery("#ddlPurchasegroup").typeahead({
//    source: function (query, process) {
//        var data = Groupdata;
//        usernames = [];
//        map = {};
//        var username = "";
//        jQuery.each(data, function (i, username) {
//            // console.log(data);
//            map[username.groupName] = username;

//            usernames.push(username.groupName);
//        });

//        process(usernames);

//    },
//    minLength: 2,
//    updater: function (item) {
//        if (map[item].idx != "0") {


//            sessionStorage.setItem('hdnPurchaseGroupID', map[item].idx);

//        }
//        else {
//            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
//        }

//        return item;
//    }

//});

//Second tab controls
$("#txtApprover").on("keyup", function () {
    $("#txtApprover").css("border-color", "");
});
$("#txtWBSeq").on("keyup", function () {
    $("#txtWBSeq").css("border-color", "");
});
$("#txtOBApprover").on("keyup", function () {
    $("#txtOBApprover").css("border-color", "");
});
$("#txtOBSeq").on("keyup", function () {
    $("#txtOBSeq").css("border-color", "");
});
$("#txtNBApprover").on("keyup", function () {
    $("#txtNBApprover").css("border-color", "");
});
$("#txtNBSeq").on("keyup", function () {
    $("#txtNBSeq").css("border-color", "");
});


function SaveApproverMaster() {
    var p_approvaltype = $("#ddlApproveltype option:selected").val();
    var isActive = $("#chkIsActive").is(':checked');
    var amountFrom = $("#txtAmountFrom").val();
    var amountTo = $("#txtAmountTo").val();
    var p_idx = nfaApproverIDX;
    var deviation = 0

    if ($("#txtdeviation").val() != "" && $("#txtdeviation").val() != null && $("#txtdeviation").val() != undefined) {
        deviation = removeThousandSeperator($("#txtdeviation").val());
    }
    var Model = {
        idx: parseInt(p_idx),
        orgID: parseInt($("#ddlPurchaseOrg option:selected").val()),
        cusID: parseInt(CurrentCustomer),
        groupID: parseInt($("#ddlPurchasegroup option:selected").val()),
        conditionID: parseInt($("#ddlCondition option:selected").val()),
        IsActive: isActive,
        createdBy: UserID,
        updatedBy: UserID,
        approvalType: p_approvaltype,
        amountFrom: parseFloat(removeThousandSeperator(amountFrom)),
        amountTo: parseFloat(removeThousandSeperator(amountTo)),
        draft: true,
        deviation: parseFloat(deviation)
    };
    var url = "NFA/InsertUpdateApprovelMaster";
    // alert(JSON.stringify(Model))
    var SaveApproverMaster = callajaxReturnSuccess(url, "Post", JSON.stringify(Model));
    SaveApproverMaster.success(function (res) {
        // console.log(res);
        if (res.status != "E") {

            nfaApproverIDX = parseInt(res.result[0].idx);
            nfaEditedID = parseInt(res.result[0].idx);
            ApproverType = p_approvaltype;
            bindApproverMaster();
            if (ApproverType == "S") {
                $(".clsHide").hide();
                isHide = '';
                isEditAllowed = ' hide'
            }
            else {
                isHide = 'hide'
                isEditAllowed = ''
                $(".clsHide").show();
            }
        }
        else {
            alert("Error :" + res.error);
        }
    });
    SaveApproverMaster.error(function (xhr, status, error) {
        //  jQuery.unblockUI();
    })
};
function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);

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

//WB Approver Logic
sessionStorage.setItem('hdnWBApproverEmailid', '');
sessionStorage.setItem('hdnApproverid', 0);
jQuery("#txtApprover").keyup(function () {
    sessionStorage.setItem('hdnApproverid', '0');
    sessionStorage.setItem('hdnWBApproverEmailid', '');
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
function validateWBADD() {

    var idx = false;
    var Seq = false;

    if ($("#txtApprover").val() == "" || sessionStorage.getItem("hdnApproverid") == 0) {
        $("#txtApprover").css("border-color", "red");
        idx = true;
    }
    else {
        $("#txtApprover").css("border-color", "");
        idx = false;
    }
    //if ($("#ddlWBApprover option:selected").val() == 0 || $("#ddlWBApprover option:selected").val() == null) {
    //    $("#ddlWBApprover").css("border-color", "red");
    //    idx = true;
    //}
    //else {
    //    $("#ddlWBApprover").css("border-color", "");
    //    idx = false;
    //}
    if (ApproverType != "S") {
        if ($("#txtWBSeq").val() == "") {
            $("#txtWBSeq").css("border-color", "red");
            Seq = true;
        }
        else {
            $("#txtWBSeq").css("border-color", "");
            Seq = false;
        }
    }
    if (idx || Seq)
        return true;
    else return false;
}
function AddWBApprovers() {
    if (validateWBADD()) {
        return false;
    }

    if ($("#hdnWBSeqID").val() != -1) {
        var tableName = "tblWBApproverSeq";
        var index = $("#hdnWBSeqID").val();
        var newSeq = $("#txtWBSeq").val();
        UpdateSeq(tableName, index, newSeq == 0 ? 1 : newSeq);
    }
    else {
        var ApproverID = sessionStorage.getItem("hdnApproverid");
        var ApproverName = $("#txtApprover").val();
        var Seq = $("#txtWBSeq").val();

        var EmailID = sessionStorage.getItem("hdnWBApproverEmailid");

        if (ApproverType == "S") {

            if (WBSeq <= 0) {
                WBSeq = 1;
            }
            ++WBSeq;
        }
        else {
            WBSeq = parseInt(Seq == 0 ? 1 : Seq);
        }
        fnApproversQuery(EmailID, ApproverID, ApproverName, WBSeq)
    }


    sessionStorage.setItem('hdnWBApproverEmailid', '');
    sessionStorage.setItem('hdnApproverid', 0);
    $("#txtApprover").val('');
    $("#txtWBSeq").val('');
    $('#hdnWBSeqID').val(-1);
};
var rowAppWB = 0;
function fnApproversQuery(EmailID, UserID, UserName, rownum) {

    var status = true
    $("#tblWBApproverSeq tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(4)').html()) == sessionStorage.getItem('hdnApproverid')) {
            status = false

        }
    });

    if (UserID == "0" || jQuery("#txtApprover").val() == "") {
        $('#errordivSeq').show();
        $('#errorSeq').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);
        --WBSeq;
        return false;
    }
    else if (status == false) {
        $('#errordivSeq').show();
        $('#errorSeq').html('Approver is already mapped for this Reverse Auction.');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);
        --WBSeq;
        return false;
    }
    else {
        rowAppWB = rowAppWB + 1;
        var num = 0;
        var maxidnum = 0;
        $("#tblWBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);

            num = (this_row.closest('tr').attr('id')).substring(9)
            if (num > maxidnum) {
                maxidnum = num;
            }
        });

        rownum = parseInt(maxidnum) + 1;
        if (!jQuery("#tblWBApproverSeq thead").length) {
            jQuery("#tblWBApproverSeq").append("<thead><tr><th style='width:10%'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:10%!important'>Sequence</th><th class='" + isHide + "'></th></tr></thead>");
            jQuery("#tblWBApproverSeq").append('<tr id=trWBAppid' + rownum + '><td><a class="btn  btn-xs btn-danger" onclick="deleteApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a><a class="btn  btn-xs btn-primary edit ' + isEditAllowed + '"><i class="fa fa-pencil"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowAppWB + '</td><td class=hide>' + UserID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>');
        }
        else {
            jQuery("#tblWBApproverSeq").append('<tr id=trWBAppid' + rownum + '><td><a class="btn  btn-xs btn-danger" onclick="deleteApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a><a class="btn  btn-xs btn-primary edit ' + isEditAllowed + '"><i class="fa fa-pencil"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowAppWB + '</td><td class=hide>' + UserID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>');
        }
        var rowcount = jQuery('#tblWBApproverSeq >tbody>tr').length;
        if (rowcount >= 1) {
            $("#tblWBApproverSeq tr:gt(0)").each(function (index) {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(3)').html(index + 1));
            });

        }
    }
}
function deleteApprow(icount) {

    --WBSeq;
    rowAppWB = rowAppWB - 1;
    // $('#' + rowid.id).remove();
    $('#trWBAppid' + icount).remove();
    var rowCount = jQuery('#tblWBApproverSeq >tbody>tr').length;
    var i = 1;
    if (rowCount >= 1 && ApproverType == 'S') {
        $("#tblWBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
    //$('#chkWBCopy').prop('disabled', false);
    $('#chkWBCopy').prop('checked', false);
    $('#chkWBCopy').closest('span').removeClass('checked');

}
$("#tblWBApproverSeq").on("click", ".edit", function (e) {

    var row = $(this).closest('tr');
    $('#hdnWBSeqID').val($(row).index());
    var td = $(row).find("td");

    sessionStorage.setItem("hdnApproverid", parseInt($(td).eq(4).html()))
    $("#txtWBSeq").val(parseInt($(td).eq(3).html()));
    $("#txtApprover").val($(td).eq(1).html());
    // $('#chkWBCopy').prop('disabled', false);
    $('#chkWBCopy').prop('checked', false);
    $('#chkWBCopy').closest('span').removeClass('checked');
});

//Update User seq 
function UpdateSeq(tableName, index, NewSeq) {
    var id;
    id = NewSeq;
    $('#' + tableName + ' tbody tr').eq(index).find('td').eq(3).html(id);
};


//OB Approver Logic
jQuery("#txtOBApprover").keyup(function () {
    sessionStorage.setItem('hdnOBApproverEmail', '');
    sessionStorage.setItem('hdnOBApproverid', 0);
});
sessionStorage.setItem('hdnOBApproverEmail', '');
sessionStorage.setItem('hdnOBApproverid', 0);
jQuery("#txtOBApprover").typeahead({
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
            sessionStorage.setItem('hdnOBApproverid', map[item].userID);
            sessionStorage.setItem('hdnOBApproverEmail', map[item].emailID);
        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }

});
function validateOBADD() {
    var idx = false;
    var Seq = false;
    if ($("#txtOBApprover").val() == "" || sessionStorage.getItem("hdnOBApproverid") == 0) {
        $("#txtOBApprover").css("border-color", "red");
        idx = true;
    }
    else {
        $("#txtOBApprover").css("border-color", "");
        idx = false;
    }
    if (ApproverType != "S") {
        if ($("#txtOBSeq").val() == "") {
            $("#txtOBSeq").css("border-color", "red");
            Seq = true;
        }
        else {
            $("#txtOBSeq").css("border-color", "");
            Seq = false;
        }
    }
    if (idx || Seq)
        return true;
    else return false;
}
function AddOBApprovers() {
    if (validateOBADD()) {
        return false;
    }
    if ($("#hdnOBSeqID").val() != -1) {
        var tableName = "tblOBApproverSeq";
        var index = $("#hdnOBSeqID").val();
        var newSeq = $("#txtOBSeq").val();
        UpdateSeq(tableName, index, newSeq == 0 ? 1 : newSeq);
    } else {
        var ApproverID = sessionStorage.getItem("hdnOBApproverid");
        var ApproverName = $("#txtOBApprover").val();
        var Seq = $("#txtOBSeq").val();
        var v_idx = $("#hdnOBSeqID").val();
        var obEmail = sessionStorage.getItem('hdnOBApproverEmail');
        if (ApproverType == "S") {
            ++OBSeq;
        }
        else {
            OBSeq = parseInt(Seq == 0 ? 1 : Seq);
        }
        fnApproversOBQuery(obEmail, ApproverID, ApproverName, OBSeq);
    }


    //var ApproverID = $("#ddlOBApprover option:selected").val();
    //var ApproverName = $("#ddlOBApprover option:selected").text();

    sessionStorage.setItem('hdnOBApproverEmail', '');
    sessionStorage.setItem('hdnOBApproverid', 0);
    $("#txtOBApprover").val('');
    $("#txtOBSeq").val('');
    $("#hdnOBSeqID").val(-1);
};
var rowAppOB = 0;
function fnApproversOBQuery(EmailID, UserID, UserName, rownum) {

    var status = true
    $("#tblOBApproverSeq tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(4)').html()) == sessionStorage.getItem('hdnOBApproverid')) {
            status = false

        }
    });

    if (UserID == "0" || jQuery("#txtOBApprover").val() == "") {
        $('#errordivSeq').show();
        $('#errorSeq').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);
        --OBSeq;
        return false;
    }
    else if (status == false) {
        $('#errordivSeq').show();
        $('#errorSeq').html('Approver is already mapped for this Action.');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);
        --OBSeq;
        return false;
    }
    else {
        rowAppOB = rowAppOB + 1;
        var maxidnum = 0; var num = 0;
        $("#tblOBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);

            num = (this_row.closest('tr').attr('id')).substring(9)
            if (num > maxidnum) {
                maxidnum = num;
            }
        });

        rownum = parseInt(maxidnum) + 1;
        if (!jQuery("#tblOBApproverSeq thead").length) {
            jQuery("#tblOBApproverSeq").append("<thead><tr><th style='width:10%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th><th class='" + isHide + "'></th></tr></thead>");
            jQuery("#tblOBApproverSeq").append('<tr id=trOBAppid' + rownum + '><td><button class="btn  btn-xs btn-danger" onclick="deleteOBApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button><button class="btn  btn-xs btn-primary edit ' + isEditAllowed + '"  ><i class="fa fa-pencil"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowAppOB + '</td><td class=hide>' + UserID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>');
        }
        else {
            jQuery("#tblOBApproverSeq").append('<tr id=trOBAppid' + rownum + '><td><button class="btn  btn-xs btn-danger" onclick="deleteOBApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button><button class="btn  btn-xs btn-primary edit ' + isEditAllowed + '"  ><i class="fa fa-pencil"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowAppOB + '</td><td class=hide>' + UserID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>');
        }
        var rowcount = jQuery('#tblOBApproverSeq >tbody>tr').length;
        if (rowcount >= 1) {
            $("#tblOBApproverSeq tr:gt(0)").each(function (index) {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(3)').html(index + 1));
            });

        }
    }
}
function deleteOBApprow(IDCount) {

    --OBSeq;
    rowAppOB = rowAppOB - 1;
    //$('#' + rowid.id).remove();
    // $('#' + rowidPrev.id).remove();
    $('#trOBAppid' + IDCount).remove();
    var rowCount = jQuery('#tblOBApproverSeq >tbody>tr').length;
    var i = 1;
    if (rowCount >= 1 && ApproverType == 'S') {
        $("#tblOBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }

    // $('#chkWBCopy').prop('disabled', false);
    $('#chkWBCopy').prop('checked', false);
    $('#chkWBCopy').closest('span').removeClass('checked');

}
$("#tblOBApproverSeq").on("click", ".edit", function (e) {

    var row = $(this).closest('tr');
    $('#hdnOBSeqID').val($(row).index());
    var td = $(row).find("td");
    sessionStorage.setItem("hdnOBApproverid", parseInt($(td).eq(4).html()))
    $("#txtOBSeq").val(parseInt($(td).eq(3).html()));
    $("#txtOBApprover").val($(td).eq(1).html());
    //  $('#chkWBCopy').prop('disabled', false);
    $('#chkWBCopy').prop('checked', false);
    $('#chkWBCopy').closest('span').removeClass('checked');
});

//NB Approver Logic
sessionStorage.setItem('hdnNBApproverid', 0);
sessionStorage.setItem('hdnNBApproverEmail', '');
jQuery("#txtNBApprover").keyup(function () {
    sessionStorage.setItem('hdnNBApproverEmail', '');
    sessionStorage.setItem('hdnNBApproverid', 0);
});

jQuery("#txtNBApprover").typeahead({
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
            sessionStorage.setItem('hdnNBApproverid', map[item].userID);
            sessionStorage.setItem('hdnNBApproverEmail', map[item].emailID);
            // fnApproversQuery(map[item].emailID, map[item].userID, map[item].userName);

        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }

});
function validateNBADD() {
    var idx = false;
    var Seq = false;
    if ($("#txtNBApprover").val() == "" || sessionStorage.getItem("hdnNBApproverid") == 0) {
        $("#txtNBApprover").css("border-color", "red");
        idx = true;
    }
    else {
        $("#txtNBApprover").css("border-color", "");
        idx = false;
    }
    if (ApproverType != "S") {
        if ($("#txtNBSeq").val() == "") {
            $("#txtNBSeq").css("border-color", "red");
            Seq = true;
        }
        else {
            $("#txtNBSeq").css("border-color", "");
            Seq = false;
        }
    }
    if (idx || Seq)
        return true;
    else return false;
}
function AddNBApprovers() {
    if (validateNBADD()) {
        return false;
    } if ($("#hdnNBSeqID").val() != -1) {
        var tableName = "tblNBApproverSeq";
        var index = $("#hdnNBSeqID").val();
        var newSeq = $("#txtNBSeq").val();
        UpdateSeq(tableName, index, newSeq == 0 ? 1 : newSeq);
    } else {


        var ApproverID = sessionStorage.getItem("hdnNBApproverid");// $("#ddlNBApprover option:selected").val();
        var ApproverName = $("#txtNBApprover").val();// $("#ddlNBApprover option:selected").text();
        var Seq = $("#txtNBSeq").val();
        var v_idx = $("#hdnNBSeqID").val();
        var NBEmailID = sessionStorage.getItem('hdnNBApproverEmail');
        if (ApproverType == "S") {
            ++NBSeq;
        }
        else {
            NBSeq = parseInt(Seq == 0 ? 1 : Seq);
        }
        fnApproversNBQuery(NBEmailID, ApproverID, ApproverName, NBSeq);
    }
    sessionStorage.setItem('hdnNBApproverid', 0);
    sessionStorage.setItem('hdnNBApproverEmail', '');
    $("#txtNBApprover").val('');
    $("#txtNBSeq").val('');
    $("#hdnNBSeqID").val(-1);
};
var rowAppNB = 0;
function fnApproversNBQuery(EmailID, UserID, UserName, rownum) {
    var status = true
    $("#tblNBApproverSeq tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(4)').html()) == sessionStorage.getItem('hdnNBApproverid')) {
            status = false

        }
    });

    if (UserID == "0" || jQuery("#txtNBApprover").val() == "") {
        $('#errordivSeq').show();
        $('#errorSeq').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);
        --NBSeq;
        return false;
    }
    else if (status == false) {
        $('#errordivSeq').show();
        $('#errorSeq').html('Approver is already mapped for this Reverse Auction.');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);
        --NBSeq;
        return false;
    }
    else {
        rowAppNB = rowAppNB + 1;
        var maxidnum = 0; var num = 0;
        $("#tblNBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);

            num = (this_row.closest('tr').attr('id')).substring(9)
            if (num > maxidnum) {
                maxidnum = num;
            }
        });

        rownum = parseInt(maxidnum) + 1;
        if (!jQuery("#tblNBApproverSeq thead").length) {
            jQuery("#tblNBApproverSeq").append("<thead><tr><th style='width:10%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th><th class='" + isHide + "'></th></tr></thead>");
            jQuery("#tblNBApproverSeq").append('<tr id=trNBAppid' + rownum + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNBApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button><button class="btn  btn-xs btn-primary edit ' + isEditAllowed + '"  ><i class="fa fa-pencil"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowAppNB + '</td><td class=hide>' + UserID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>');
        }
        else {
            jQuery("#tblNBApproverSeq").append('<tr id=trNBAppid' + rownum + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNBApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button><button class="btn  btn-xs btn-primary edit ' + isEditAllowed + '"  ><i class="fa fa-pencil"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowAppNB + '</td><td class=hide>' + UserID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>');
        }
        var rowcount = jQuery('#tblNBApproverSeq >tbody>tr').length;
        if (rowcount >= 1) {
            $("#tblNBApproverSeq tr:gt(0)").each(function (index) {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(3)').html(index + 1));
            });

        }
    }
}
function deleteNBApprow(IDCount) {

    --NBSeq;
    rowAppNB = rowAppNB - 1;
    $('#trNBAppid' + IDCount).remove();
    //$('#' + rowid.id).remove();
    // $('#' + rowidPrev.id).remove();
    var rowCount = jQuery('#tblNBApproverSeq >tbody>tr').length;
    var i = 1;
    if (rowCount >= 1 && ApproverType == 'S') {
        $("#tblNBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
    $('#chkOBCopy').prop('checked', false);
    $('#chkOBCopy').closest('span').removeClass('checked');
}
$("#tblNBApproverSeq").on("click", ".edit", function (e) {

    var row = $(this).closest('tr');
    $('#hdnNBSeqID').val($(row).index());
    var td = $(row).find("td");

    sessionStorage.setItem("hdnNBApproverid", parseInt($(td).eq(4).html()))
    $("#txtNBSeq").val(parseInt($(td).eq(3).html()));
    $("#txtNBApprover").val($(td).eq(1).html());
    $('#chkOBCopy').prop('checked', false);
    $('#chkOBCopy').closest('span').removeClass('checked');
});

$('#chkWBCopy').click(function () {
    if ($(this).closest("span").attr('class') == 'checked') {
        $(this).closest("span").removeClass("checked")
        $('#chkWBCopy').prop('checked', false);
    }
    else {
        $(this).closest("span").addClass("checked")
        $('#chkWBCopy').prop('checked', true);
        //$('#chkWBCopy').prop('disabled', true);
        saveSameWB();
    }
    //if ($(this).is(":checked")) {
    //    saveSameWB();
    //}
});


function saveSameWB() {
    $("#tblOBApproverSeq").empty();
    var rowCount = $('#tblWBApproverSeq >tbody>tr').length;
    if (rowCount >= 1) {
        $("#tblOBApproverSeq").append("<thead><tr><th style='width:10%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th><th class='" + isHide + "'></th></tr></thead>");
        $("#tblWBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            // approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';
            var rowAppsq = (this_row.closest('tr').attr('id')).substring(9);
            var rowApp = parseInt($.trim(this_row.find('td:eq(3)').html()));
            var UserID = $.trim(this_row.find('td:eq(4)').html());
            var UserName = $.trim(this_row.find('td:eq(1)').html());
            var EmailID = $.trim(this_row.find('td:eq(2)').html());

            $("#tblOBApproverSeq").append('<tr id=trOBAppid' + rowAppsq + '><td><button class="btn  btn-xs btn-danger" onclick="deleteOBApprow(' + rowAppsq + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></button><button class="btn  btn-xs btn-primary edit' + isEditAllowed + '" ><i class="fa fa-pencil"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>');
            if (ApproverType == "S") {
                OBSeq = parseInt(rowApp);
            }
            // console.log(approvers);
        })
    }

}

$('#chkOBCopy').click(function () {
    if ($(this).closest("span").attr('class') == 'checked') {
        $(this).closest("span").removeClass("checked")
        $('#chkOBCopy').prop('checked', false);
    }
    else {
        $(this).closest("span").addClass("checked")
        $('#chkOBCopy').prop('checked', true);
        //$('#chkWBCopy').prop('disabled', true);
        copyObSame();
    }
    //if ($(this).is(":checked")) {
    //    saveSameWB();
    //}
});

//$('#chkOBCopy').change(function () {
//    if ($(this).is(":checked")) {
//        copyObSame();
//    }

//});

function copyObSame() {
    $("#tblNBApproverSeq").empty();
    var rowCount = $('#tblOBApproverSeq >tbody>tr').length;
    if (rowCount >= 1) {
        $("#tblNBApproverSeq").append("<thead><tr><th style='width:10%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th><th class='" + isHide + "'></th></tr></thead>");
        $("#tblOBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            // approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';
            var rowApp = parseInt($.trim(this_row.find('td:eq(3)').html()));
            var rowAppsq = (this_row.closest('tr').attr('id')).substring(9);
            var UserID = $.trim(this_row.find('td:eq(4)').html());
            var UserName = $.trim(this_row.find('td:eq(1)').html());
            var EmailID = $.trim(this_row.find('td:eq(2)').html());

            $("#tblNBApproverSeq").append('<tr id=trNBAppid' + rowAppsq + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNBApprow(' + rowAppsq + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></button><button class="btn  btn-xs btn-primary edit ' + isEditAllowed + '" ><i class="fa fa-pencil"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>');
            if (ApproverType == "S") {
                NBSeq = parseInt(rowApp);
            }

        })
    }
};

function CreateSeqData() {

    //WB Data
    ApproverSeqData = [];
    objData = {};
    var v_idx = 0;

    var rowCount = jQuery('#tblWBApproverSeq tr').length;

    if (rowCount > 1) {
        $("#tblWBApproverSeq tr:gt(0)").each(function () {
            var this_row = $(this);
            objData = {
                idx: parseInt(v_idx),
                nfaApproverID: parseInt(nfaApproverIDX),
                custId: parseInt(CurrentCustomer),
                userID: this_row.find('td:eq(4)').html(),
                Seq: parseInt(this_row.find('td:eq(3)').html()),
                budgetType: "WB"
            };
            ApproverSeqData.push(objData);

        });
    }

    //OB Data
    var OBv_idx = 0;

    var OBrowCount = jQuery('#tblOBApproverSeq tr').length;

    if (OBrowCount > 1) {
        $("#tblOBApproverSeq tr:gt(0)").each(function () {
            var this_Ob_row = $(this);
            objData = {
                idx: parseInt(OBv_idx),
                nfaApproverID: parseInt(nfaApproverIDX),
                custId: parseInt(CurrentCustomer),
                userID: this_Ob_row.find('td:eq(4)').html(),
                Seq: parseInt(this_Ob_row.find('td:eq(3)').html()),
                budgetType: "OB"
            };
            ApproverSeqData.push(objData);

        });
    }

    //NB Data

    var NBv_idx = 0;

    var NBrowCount = jQuery('#tblNBApproverSeq >tbody>tr').length;

    if (NBrowCount >= 1) {
        $("#tblNBApproverSeq tr:gt(0)").each(function () {
            var this_Nb_row = $(this);

            objData = {
                idx: parseInt(NBv_idx),
                nfaApproverID: parseInt(nfaApproverIDX),
                custId: parseInt(CurrentCustomer),
                userID: this_Nb_row.find('td:eq(4)').html(),
                Seq: parseInt(this_Nb_row.find('td:eq(3)').html()),
                budgetType: "NB"
            };

            ApproverSeqData.push(objData);

        });
    }
    SaveApproverSeqData(ApproverSeqData);


}

function SaveApproverSeqData(objSeqData) {

    var url = "NFA/InsertUpdateMultipleSeq?customerid=" + parseInt(CurrentCustomer) + "&nfaApproverid=" + nfaApproverIDX;

    //alert(JSON.stringify(objSeqData))
    var callAPI = callajaxReturnSuccess(url, "Post", JSON.stringify(objSeqData));
    callAPI.success(function (res) {
    });

    callAPI.error(function (error) {
        console.log(error);
    });

};

function BindApproverSeqpreview() {

    var url = "NFA/FetchApproverSeq";
    var model = {

        nfaApproverID: parseInt(nfaApproverIDX),
        custId: parseInt(CurrentCustomer),
        budgetType: ""

    };

    var SaveData = callajaxReturnSuccess(url, "Post", JSON.stringify(model));
    SaveData.success(function (res) {


        var Header = "<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>";
        var WBPreBody = "";
        var OBPreBody = "";
        var NBPreBody = "";
        $("#tblWBPreview").empty();
        $("#tblOBpreview").empty();
        $("#tblNBPreview").empty();
        if (res.result != null) {
            if (res.result.length > 0) {
                $("#tblWBPreview").append(Header);
                $("#tblOBpreview").append(Header);
                $("#tblNBPreview").append(Header);

                $.each(res.result, function (key, value) {
                    if (value.budgetType == "WB")
                        WBPreBody += '<tr><td>' + value.approverName + '</td><td>' + value.emailID + '</td><td>' + value.seq + '</td></tr>';
                    if (value.budgetType == "OB")
                        OBPreBody += '<tr><td>' + value.approverName + '</td><td>' + value.emailID + '</td><td>' + value.seq + '</td></tr>';
                    if (value.budgetType == "NB")
                        NBPreBody += '<tr><td>' + value.approverName + '</td><td>' + value.emailID + '</td><td>' + value.seq + '</td></tr>';
                });
                $("#tblWBPreview").append(WBPreBody);
                $("#tblOBpreview").append(OBPreBody);
                $("#tblNBPreview").append(NBPreBody);


            }

        }


    });
    SaveData.error(function (error) {

    })
}

function onPreviewClick() {
    CreateSeqData();
    BindPreviewDetails();
    BindApproverSeqpreview();


};

function BindPreviewDetails() {

    var org = $("#ddlPurchaseOrg").val();
    var group = $("#ddlPurchasegroup").val();
    var conditionName = $("#ddlCondition").val();
    var approvelType = $("#ddlApproveltype option:selected").text();
    var from = $("#txtAmountFrom").val();
    var to = $("#txtAmountTo").val();
    $("#lblPurchaseOrg").text($("#ddlPurchaseOrg option:selected").text());
    $("#lblPurchaseGroup").text($("#ddlPurchasegroup option:selected").text());
    if ($("#ddlCondition option:selected").text() == "Select") {
        var Con = "";
    }
    else {
        var Con = $("#ddlCondition option:selected").text();
    }
    $("#lblCondition").text(Con);
    $("#lblApproveltype").text(approvelType);
    $("#lbldeviation").text($("#txtdeviation").val());
    $("#lblAmountFrom").text(from);
    $("#lblAmountTo").text(to);

}
var tabno = 1;
jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    //"Value cannot be {0}"
    "This field is required."
);
var FormWizard = function () {

    return {

        init: function () {

            if (!jQuery().bootstrapWizard) {

                return;

            }

            function format(state) {

                if (!state.id) return state.text; // optgroup

                return "<img class='flag' src='assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;

            }

            form.validate({

                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

                errorElement: 'span', //default input error message container

                errorClass: 'help-block help-block-error', // default input error message class

                focusInvalid: false, // do not focus the last invalid input

                rules: {

                    ddlPurchaseOrg: {
                        required: true
                    },

                    ddlPurchasegroup: {
                        required: true
                    },
                    ddlApproveltype: {
                        required: true

                    },
                    txtdeviation: {
                        //required: true,
                        number: true
                    },
                    txtAmountFrom: {
                        required: true,
                        number: true,
                        minlength: 1,
                        maxlength: 18,//3
                        notEqualTo: 0
                    },
                    txtAmountTo: {
                        required: true,
                        number: true,
                        minlength: 1,
                        maxlength: 18,//3
                        notEqualTo: 0
                    }
                },

                messages: {

                    //'payment[]': {

                    //    required: "Please select at least one option",

                    //    minlength: jQuery.validator.format("Please select at least one option")

                    //},
                    //txtitembidduration: {
                    //    required: "Please Enter Bid Duration."
                    //}
                    ddlPurchaseOrg: {
                        required: "Please select purchase org."
                    },

                    ddlPurchasegroup: {
                        required: "Please select purchase group"
                    },
                    txtAmountFrom: {
                        required: "Please Enter Amount from."
                    },
                    txtAmountTo: {
                        required: "Please Enter Amount To."
                    }
                },

                errorPlacement: function (error, element) {

                    //if (element.attr("name") == "gender") {

                    //    error.insertAfter("#form_gender_error");

                    //} else if (element.attr("name") == "payment[]") {

                    //    error.insertAfter("#form_payment_error");

                    //} else {

                    //    error.insertAfter(element);

                    //}



                    //if ($("#txtbidDate").closest('.inputgroup').attr('class') == 'inputgroup has-error') {

                    //    $("#btncal").css("margin-top", "-22px");

                    //}

                },

                invalidHandler: function (event, validator) {
                    success.hide();
                    Metronic.scrollTo(error, -200);

                },

                highlight: function (element) {

                    $(element)
                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');
                    $(element)
                        .closest('.col-md-4').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-3').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element)
                        .closest('.inputgroup').removeClass('has-error');
                    $(element)
                        .closest('.col-md-4').removeClass('has-error');
                    $(element)
                        .closest('.col-md-3').removeClass('has-error');

                },

                success: function (label) {

                    //if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {

                    //    label

                    //        .closest('.inputgroup').removeClass('has-error').addClass('has-success');

                    //    label.remove();

                    //} else {

                    //    label

                    //        .addClass('valid') // mark the current input as valid and display OK icon

                    //        .closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group

                    //}

                    //if ($("#txtbidDate").closest('.inputgroup').attr('class') == 'inputgroup has-error') {

                    //    $("#btncal").css("margin-top", "-22px");

                    //}

                    //else {

                    //    $("#btncal").css("margin-top", "0px");

                    //}

                },
                submitHandler: function (form) {

                    error.hide();

                }
            });
            var handleTitle = function (tab, navigation, index) {

                var total = navigation.find('li').length;

                var current = index + 1;

                // set wizard title

                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);

                // set done steps

                jQuery('li', $('#form_wizard_1')).removeClass("done");

                var li_list = navigation.find('li');

                for (var i = 0; i < index; i++) {

                    jQuery(li_list[i]).addClass("done");

                }



                if (current == 1) {

                    $('#form_wizard_1').find('.button-previous').hide();

                } else {

                    $('#form_wizard_1').find('.button-previous').show();
                }



                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                } else {

                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();

                }

                Metronic.scrollTo($('.page-title'));

            }
            // default form wizard

            $('#form_wizard_1').bootstrapWizard({

                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index, clickedIndex) {

                    return false;

                },
                onNext: function (tab, navigation, index) {
                    tabno = index;
                    success.hide();
                    error.hide();

                    if (index == 1) {

                        if (form.valid() == false) {

                            form.validate();
                            $('.alert-danger').show();
                            $('#spandanger').html('Please check highlighted fileds');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

                        }
                        //if (validateApproverMaster()) {
                        //    $('.alert-danger').show();
                        //    $('#spandanger').html('Please check highlighted fileds');
                        //    Metronic.scrollTo($(".alert-danger"), -200);
                        //    $('.alert-danger').fadeOut(5000);
                        //    return false;
                        //}

                        CheckDuplicate();
                        if (verifyApproverMatrix == "1" && nfaEditedID == '0') {
                            $('.alert-danger').show();
                            $('#spandanger').html('Approver Matrix details already exist');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;
                        }
                        else {
                            SaveApproverMaster();
                        }

                        if (nfaEditedID != 0) {
                            BindApproverSeqOnEdit();
                        }

                        //   BindApprovers();
                        var PreviewHtml = "Preview <i class='fa fa-eye' aria-hidden='true'></i>";
                        $(".button-next").html(PreviewHtml);
                    }
                    else if (index == 2) {

                        if ($('#tblWBApproverSeq >tbody >tr').length == 0 && $('#tblOBApproverSeq >tbody >tr').length == 0 && $('#tblNBApproverSeq >tbody >tr').length == 0) {
                            // $('#errorSeq').html('Please Select Within Budgeted Approvers')
                            $('#errorSeq').html('Please Select atleast one Budgeted Approvers')
                            $('#errordivSeq').show();
                            Metronic.scrollTo($('errordivSeq'), -200);
                            $('#errordivSeq').fadeOut(5000);

                            return false;
                        }
                        //if ($('#tblOBApproverSeq >tbody >tr').length == 0) {
                        //    $('#errorSeq').html('Please Select Outside Budgeted Approvers')
                        //    $('#errordivSeq').show();
                        //    Metronic.scrollTo($('errordivSeq'), -200);
                        //    $('#errordivSeq').fadeOut(5000);

                        //    return false;


                        //}
                        //if ($('#tblNBApproverSeq >tbody >tr').length == 0) {
                        //    $('#errorSeq').html('Please Select Not Budgeted Approvers')
                        //    $('#errordivSeq').show();
                        //    Metronic.scrollTo($('errordivSeq'), -200);
                        //    $('#errordivSeq').fadeOut(5000);

                        //    return false;


                        //}
                        else {
                            onPreviewClick();
                        }

                    }
                    handleTitle(tab, navigation, index);

                },
                onPrevious: function (tab, navigation, index) {
                    tabno = index;
                    success.hide();

                    error.hide();

                    if (index == 0) {
                        var PreviewHtml = 'Save and Continue <i class="m-icon-swapright m-icon-white">';
                        $(".button-next").html(PreviewHtml);
                    }
                    handleTitle(tab, navigation, index);

                },
                onTabShow: function (tab, navigation, index) {
                    tabno = index;
                    var total = navigation.find('li').length;

                    var current = index + 1;

                    var $percent = (current / total) * 100;

                    $('#form_wizard_1').find('.progress-bar').css({

                        width: $percent + '%'

                    });

                }

            });

            $('#form_wizard_1').find('.button-previous').hide();

            $('#form_wizard_1 .button-submit').click(function () {

                CompleteProcess();

            }).hide();


        }

    };

}();

function BindApproverSeqOnEdit() {

    var url = "NFA/FetchApproverSeq";
    var model = {

        nfaApproverID: parseInt(nfaApproverIDX),
        custId: parseInt(CurrentCustomer),
        budgetType: ""

    };

    var SaveData = callajaxReturnSuccess(url, "Post", JSON.stringify(model));
    // alert(JSON.stringify(model))
    SaveData.success(function (res) {


        var Header = "<thead><tr><th style='width:10%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:10%!important'>Sequence</th><th style='width:5%!important' class='" + isHide + "'></th></tr></thead>";
        var WBBody = "";
        var OBBody = "";
        var NBBody = "";
        var rowApp = 0;
        $("#tblWBApproverSeq").empty();
        $("#tblOBApproverSeq").empty();
        $("#tblNBApproverSeq").empty();
        if (res.result != null) {
            if (res.result.length > 0) {
                $("#tblWBApproverSeq").append(Header);
                $("#tblOBApproverSeq").append(Header);
                $("#tblNBApproverSeq").append(Header);
                //var isSeq = '';
                //if (ApproverType == "S")
                //    isSeq = '<a style="cursor:pointer" class="up"><i class="fa fa-arrow-up" aria-hidden="true"></i></a><a style="cursor:pointer" class="down"><i class="fa fa-arrow-down" aria-hidden="true"></i></a>';
                $.each(res.result, function (key, value) {
                    rowApp = ++key;
                    if (value.budgetType == "WB")
                        WBBody += '<tr id=trWBAppid' + rowApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button><button class="btn  btn-xs btn-primary edit ' + isEditAllowed + '" ><i class="fa fa-pencil"></i></button></td><td>' + value.approverName + '</td><td>' + value.emailID + '</td><td>' + value.seq + '</td><td class=hide>' + value.userID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>';
                    if (value.budgetType == "OB")
                        OBBody += '<tr id=trOBAppid' + rowApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteOBApprow(' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button><button class="btn  btn-xs btn-primary edit ' + isEditAllowed + '"  ><i class="fa fa-pencil"></i></button></td><td>' + value.approverName + '</td><td>' + value.emailID + '</td><td>' + value.seq + '</td><td class=hide>' + value.userID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>';
                    if (value.budgetType == "NB")
                        NBBody += '<tr id=trNBAppid' + rowApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNBApprow(' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button><button class="btn  btn-xs btn-primary edit ' + isEditAllowed + '" ><i class="fa fa-pencil"></i></button></td><td>' + value.approverName + '</td><td>' + value.emailID + '</td><td>' + value.seq + '</td><td class=hide>' + value.userID + '</td><td class=' + isHide + '>' + MoveSeqData + '</td></tr>';

                });

                $("#tblWBApproverSeq").append(WBBody);
                $("#tblOBApproverSeq").append(OBBody);
                $("#tblNBApproverSeq").append(NBBody);
                /* if ($("#tblOBApproverSeq >tbody>tr").length > 0) {
                     $('#chkWBCopy').prop('checked', true);
                     $('#chkWBCopy').closest('span').addClass('checked');
                 }
                 else {
                     $('#chkWBCopy').prop('checked', false);
                     $('#chkWBCopy').closest('span').removeClass('checked');
                 }
                 if ($("#tblNBApproverSeq >tbody>tr").length > 0) {
                     $('#chkOBCopy').prop('checked', true);
                     $('#chkOBCopy').closest('span').addClass('checked');
                 }
                 else {
                     $('#chkOBCopy').prop('checked', false);
                     $('#chkOBCopy').closest('span').removeClass('checked');
                 }*/
            }

        }


    });
    SaveData.error(function (error) {

    })

}

// NFA Add purchase org master

//Add Purchase ORG From Model Popup Code
$("#addNewOrg").click(function () {
    BindData();
    $("#hdnmodelOrgID").val(0);
    $("#txtmodelPurchaseOrg").val('');
    $('input:checkbox[name=checkboxactive]').attr('checked', true);
    $('#checkboxactive').parents('span').addClass('checked');
});
$("#searchPop-up").keyup(function () {
    var SearchTerm = $('#searchPop-up').val();
    SearchInGridview("tblmodelPurchaseOrg", SearchTerm);

});
function onSave() {
    var str = $('#txtPurchaseOrg').val();
    if (/^[a-zA-Z0-9- ]*$/.test(str) == false) {
        alert('Special characters not allowed.');
        return false;
    }
    if (Validate()) {
        return false;
    }
    SaveUpdateData();
    //SaveUpdate();
};

function onClear() {
    $("#txtmodelPurchaseOrg").val('');
};
function BindData() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer) + "&IsActive=0";

    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#tblmodelPurchaseOrg").empty();

        if (res.result.length > 0) {
            $('#searchPop-up').show();
            $('#tblmodelPurchaseOrg').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Purchase Org.</th><th>Status</th></tr></thead>');

            $.each(res.result, function (key, value) {

                if (value.isActive == true)
                    Status = "<span>Active</span>";
                else
                    Status = "<span>In-Active</span>";

                $('#tblmodelPurchaseOrg').append('<tr id="rowid_' + value.purchaseOrgID + '"><td>' + ++key + '</td><td><a href="#" onClick="onEditClick(\'rowid_' + value.purchaseOrgID + '\',' + value.isActive + ')"><i class="fa fa-pencil"></i></a></td><td>' + value.purchaseOrgName + '</td><td>' + Status + '</td></tr>')
            });
        }
        else {
            $("#tblmodelPurchaseOrg").empty();
            $('#searchPop-up').hide();
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
        jQuery.unblockUI();
    });
    jQuery.unblockUI();

};
function Validate() {
    var nfaText = false;
    if ($("#txtmodelPurchaseOrg").val() == "") {
        $("#txtmodelPurchaseOrg").css("border-color", "red");
        $("#errormsg").text("Purchase Org is required");
        $("#errordiv1").show();
        nfaText = true;
    }
    else {
        $("#txtmodelPurchaseOrg").css("border-color", "");
        $("#errormsg").text("");
        $("#errordiv1").hide();
        nfaText = false;
    }
    if (nfaText)
        return true;
    else
        return false;
};

function onEditClick(idx, checked) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var rowID = $('#' + idx);
    if (checked == true) {

        $('input:checkbox[name=checkboxactive]').attr('checked', true);
        $('#checkboxactive').parents('span').addClass('checked');

    }
    else {

        $('input:checkbox[name=checkboxactive]').attr('checked', false);
        $('#checkboxactive').parents('span').removeClass('checked');

    }
    var idxParam = idx.replace('rowid_', '');
    $("#txtmodelPurchaseOrg").val(rowID.find('td:eq(2)').text());
    $("#hdnmodelOrgID").val(idxParam);



    $("#btn-org").text("Modify");
    jQuery.unblockUI();
};
function SaveUpdateData() {

    var url = "NFA/InsertUpdatePurchaseOrg";
    var idx = $("#hdnmodelOrgID").val();
    var Name = $("#txtmodelPurchaseOrg").val();
    var status = $("#checkboxactive").is(':checked')

    var obj = {
        PurchaseOrgID: parseInt(idx),
        CustomerID: parseInt(CurrentCustomer),
        PurchaseOrgName: Name,
        IsActive: status,
        CreatedBy: UserID,
        UpdatedBy: UserID
    };

    var SaveUpdateData = callajaxReturnSuccess(url, "Post", JSON.stringify(obj));
    SaveUpdateData.success(function (res) {
        if (res.status == "E") {
            alert(res.error);
        }
        else
            window.location.reload();

    });
    SaveUpdateData.error(function (xhr, status, error) {

        var err = eval("(" + xhr.responseText + ")");
        if (xhr.status === 400) {
            alert(JSON.stringify(err.errors));
        }
        if (xhr.status === 401) {
            error401Messagebox(err.Message);
        }

    });
};

//COmplete Process Function
function CompleteProcess() {

    //var url = "NFA/CompleteAprroverSeq";

    //var model = { cusID: parseInt(CurrentCustomer), idx: parseInt(nfaApproverIDX) }

    //var Save = callajaxReturnSuccess(url, "Post", JSON.stringify(model));
    //Save.success(function (res) {
    //    if (confirm('Do you want to continue ')) {
    //        window.location.reload();
    //    } else {
    //        window.location.href = "index.html";
    //    }

    //});
    //Save.error(function (error) {

    //});
    bootbox.dialog({
        message: "Do you want to continue?",
        // title: "Custom title",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    //window.location.reload();
                    bootbox.alert("NFA Approver Matrix Configured Successfully.", function () {
                        window.location.reload();
                        return false;
                    });
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {
                    window.location.href = "index.html";
                }
            }
        }
    });

}

//Add Purchase Group Data

$("#addNewGroup").click(function () {
    bindPurchaseGroupData();
    $("#hdnmodelGroupID").val(0);
    $("#txtModelPurchaseGroup").val('');
    $('input:checkbox[name=chkGroupActive]').attr('checked', true);
    $('#chkGroupActive').parents('span').addClass('checked');
});
function onGroupSaveClick() {
    var str = $('#txtModelPurchaseGroup').val();
    if (/^[a-zA-Z0-9- ]*$/.test(str) == false) {
        alert('Special characters not allowed.');
        return false;
    }
    if (ValidatePurchaseGroup()) {
        return false;
    }

    SavePurchaseGroup();

}
function ValidatePurchaseGroup() {
    var groupName = false;
    var OrgID = false;
    if ($("#txtModelPurchaseGroup").val() == "") {
        $("#txtModelPurchaseGroup").css("border-color", "red");

        groupName = true;
    }
    else {
        $("#txtModelPurchaseGroup").css("border-color", "");

        groupName = false;
    }
    if ($("#ddlModelOrg option:selected").val() == 0) {
        $("#ddlModelOrg").css("border-color", "red");

        OrgID = true;
    }
    else {
        $("#ddlModelOrg").css("border-color", "");

        OrgID = false;
    }
    if (groupName || OrgID)
        return true;
    else
        return false;

}
function BindModelPurchaseOrg() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer) + "&IsActive=0";
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#ddlModelOrg").html('');
        $('#ddlModelOrg').append('<option value="0">Please Select..</option>');
        if (res.result.length > 0) {



            $.each(res.result, function (key, value) {
                $('#ddlModelOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');


            });
        }

    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
        jQuery.unblockUI();
    });
    jQuery.unblockUI();

};
function bindPurchaseGroupData() {

    jQuery.blockUI({ message: LoadingMessage });
    var url = "NFA/GetPurchaseGroup?CustomerId=" + parseInt(CurrentCustomer);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#tblmodelPurchaseGroup").empty();

        if (res.result.length > 0) {
            $('#searchGroup').show();
            $('#tblmodelPurchaseGroup').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Group</th><th>Org.</th><th>Status</th></tr></thead>');

            $.each(res.result, function (key, value) {

                if (value.active == true)
                    Status = "<span>Active</span>";
                else
                    Status = "<span>In-Active</span>";

                $('#tblmodelPurchaseGroup').append('<tr id="rowid_' + value.idx + '"><td>' + ++key + '</td><td><a href="#" onClick="onGroupEdit(\'rowid_' + value.idx + '\',' + value.active + ',' + value.orgID + ')"><i class="fa fa-pencil"></i></a></td><td>' + value.groupName + '</td><td>' + value.orgName + '</td><td>' + Status + '</td></tr>')
            });
        }
        else {
            $("#tblmodelPurchaseGroup").empty();
            $('#searchGroup').hide();
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
        jQuery.unblockUI();
    });
    jQuery.unblockUI();
};
function SavePurchaseGroup() {
    jQuery.blockUI({ message: LoadingMessage });
    var url = "NFA/InsertUpdatePurchaseGroup";
    var idx = $("#hdnmodelGroupID").val();
    var GroupName = $("#txtModelPurchaseGroup").val();
    var orgId = $("#ddlModelOrg option:selected").val();
    var status = $("#chkGroupActive").is(":checked");


    var objData = {
        idx: parseInt(idx),
        orgID: parseInt(orgId),
        cusID: parseInt(CurrentCustomer),
        groupName: GroupName,
        active: status,
        CreatedBy: UserID,
        UpdatedBy: UserID
    };
    var url = "NFA/InsertUpdatePurchaseGroup";
    var SavePurchaseGroup = callajaxReturnSuccess(url, "Post", JSON.stringify(objData));
    SavePurchaseGroup.success(function (res) {
        if (res.status == "E") {
            alert(res.error);
        }
        else
            window.location.reload();
    });
    SavePurchaseGroup.error(function (xhr, status, error) {
        var err = eval("(" + xhr.responseText + ")");
        if (xhr.status === 400) {
            alert(JSON.stringify(err.errors));
        }
        if (xhr.status === 401) {
            error401Messagebox(err.Message);
        }
    });
    jQuery.unblockUI();
};
function ClearControl() {
    $("#txtModelPurchaseGroup").val('');
    $("#ddlModelOrg").val(0);
}
function onGroupEdit(rowid, checked, orgid) {
    var rowID = $('#' + rowid);
    if (checked == true) {

        $('input:checkbox[name=chkGroupActive]').attr('checked', true);
        $('#chkGroupActive').parents('span').addClass('checked');

    }
    else {

        $('input:checkbox[name=chkGroupActive]').attr('checked', false);
        $('#chkGroupActive').parents('span').removeClass('checked');

    }
    var idxParam = rowid.replace('rowid_', '');
    $("#txtModelPurchaseGroup").val(rowID.find('td:eq(2)').text());
    $("#hdnmodelGroupID").val(idxParam);
    $("#ddlModelOrg").val(orgid);



    $("#btn-group").text("Modify");


};


$("#searchPopGrp-up").keyup(function () {
    var SearchTerm = $('#searchPopGrp-up').val();
    SearchInGridview("tblmodelPurchaseGroup", SearchTerm);

});
jQuery("#txtSearchmatrix").keyup(function () {

    jQuery("#tblAllmatrix tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#txtSearchmatrix').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblAllmatrix tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tblAllmatrix tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});
//function validateApproverMaster() {
//    var v_org = false;
//    var v_group = false;
//    var v_approverType = false;
//    var amountfrom = false;
//    var amountto = false;
//    var amountCompare = false;
//    if (sessionStorage.getItem("hdnPurchaseORGID") == "0" || $("#ddlPurchaseOrg").val() == "") {
//        $("#ddlPurchaseOrg").css("border-color", "red");
//        v_org = true;
//    }
//    else {
//        $("#ddlPurchaseOrg").css("border-color", "");
//        v_org = false;
//    }
//    if (sessionStorage.getItem("hdnPurchaseORGID") == "0" || $("#ddlPurchasegroup").val() == "") {
//        $("#ddlPurchasegroup").css("border-color", "red");
//        v_group = true;
//    }
//    else {
//        $("#ddlPurchasegroup").css("border-color", "");
//        v_group = false;
//    }
//    if ($("#ddlApproveltype option:selected").val() == "") {
//        $("#ddlApproveltype").css("border-color", "red");
//        v_approverType = true;
//    }
//    else {
//        $("#ddlApproveltype").css("border-color", "");
//        v_approverType = false;
//    }
//    if (parseFloat(removeThousandSeperator($("#txtAmountFrom").val())) > parseFloat(removeThousandSeperator($("#txtAmountTo").val()))) {
//        $("#txtAmountFrom").css("border-color", "red");
//        $("#txtAmountTo").css("border-color", "red");
//        amountCompare = true;
//    }
//    else {
//        $("#txtAmountFrom").css("border-color", "");
//        $("#txtAmountTo").css("border-color", "");
//        amountCompare = false;
//    }

//    if (v_org || v_group || v_approverType || amountCompare)
//        return true;
//    else
//        return false;

//};