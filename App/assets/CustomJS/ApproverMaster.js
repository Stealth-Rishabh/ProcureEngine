var WBList = {};
var OBList = [];
var NBList = [];
var WbSR = 0;
var WBSeq = 0;
var NbSR = 0;
var NBSeq = 0;
var ObSR = 0;
var OBSeq = 0;
var ApproverType = '';
var nfaApproverIDX = 0;
$(document).ready(function () {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    bindApproverMaster();
    BindPurchaseOrg("ddlPurchaseOrg");
    
    bindPurchaseGroupDDL("ddlPurchasegroup",0);
    jQuery.unblockUI();
});

$("#ddlPurchaseOrg").on('change', function () {
    console.log(this.value)
    bindPurchaseGroupDDL("ddlPurchasegroup", this.value);
})
function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);
function bindApproverMaster() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = "NFA/FetchApproverMaster?CustomerId=" + parseInt(CurrentCustomer);

    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {
            $("#tblPurchaseORGMaster").empty();
            if (res.result.length > 0) {
                $('#searchmaster').show();
                $('#tblApprovermasters').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Group</th><th>Type</th><th>Status</th></tr></thead>');

                $.each(res.result, function (key, value) {

                    if (value.isActive == true)
                        Status = "<span>Active</span>";
                    else
                        Status = "<span>In-Active</span>";

                    var apprTypeCode = ''
                    if (value.approvalType == "Parallel")
                        apprTypeCode = "P";
                    if (value.approvalType == "Sequential")
                        apprTypeCode = "S";
                    if (value.approvalType == "Mixed")
                        apprTypeCode = "M";

                    $('#tblApprovermasters').append('<tr id="rowid_' + value.idx + '"><td>' + ++key + '</td><td><a href="#" onClick = "onDetailsEditClick(' + value.idx + "," + value.isActive + "," + value.orgID + "," + value.groupID + "," + value.amountFrom + "," + value.amountTo + "\,'" + apprTypeCode + '\')"><i class="fa fa-pencil"></i></a></td><td>' + value.groupName + '</td><td>' + value.approvalType + '</td><td>' + Status + '</td></tr>')
                });
            }
            else {
                $("#tblApprovermasters").empty();
                $('#searchmaster').hide();
            }
        }
    });
    GetData.error(function (res) {
        jQuery.unblockUI();
    });
    jQuery.unblockUI();
};
$("#search").keyup(function () {
    var SearchTerm = $('#search').val();
    SearchInGridview("tblApprovermasters", SearchTerm);

});

function onDetailsEditClick(idx,checked,orgid,groupid,amountFrom,amountTo,approval) {

    bindPurchaseGroupDDL("ddlPurchasegroup", orgid);
    /*onClick = "onDetailsEditClick(\'rowid_' + value.idx + '\',' + value.isActive + ')"*/
    $("#hdnNfaApproverID").val(idx);
    $("#ddlPurchaseOrg").val(orgid);
    $("#ddlPurchasegroup").val(groupid);
    $("#txtAmountFrom").val(amountFrom);
    $("#txtAmountTo").val(amountTo);
    $("#ddlApproveltype").val(approval);
    nfaApproverIDX = parseInt(idx);
    ApproverType = approval;
    if (checked == true) {

        $('input:checkbox[name=chkIsActive]').attr('checked', true);
        $('#chkIsActive').parents('span').addClass('checked');

    }
    else {

        $('input:checkbox[name=chkIsActive]').attr('checked', false);
        $('#chkIsActive').parents('span').removeClass('checked');

    }
}


function validateApproverMaster() {
    var v_org = false;
    var v_group = false;
    var v_approverType = false;
    var amountfrom = false;
    var amountto = false;
    var amountCompare = false;
    if ($("#ddlPurchaseOrg option:selected").val() == 0 || $("#ddlPurchaseOrg option:selected").val() == null) {
        $("#ddlPurchaseOrg").css("border-color", "red");
        v_org = true;
    }
    else {
        $("#ddlPurchaseOrg").css("border-color", "");
        v_org = false;
    }
    if ($("#ddlPurchasegroup option:selected").val() == 0 || $("#ddlPurchasegroup option:selected").val() == null) {
        $("#ddlPurchasegroup").css("border-color", "red");
        v_group = true;
    }
    else {
        $("#ddlPurchasegroup").css("border-color", "");
        v_group = false;
    }
    if ($("#ddlApproveltype option:selected").val() == "") {
        $("#ddlApproveltype").css("border-color", "red");
        v_approverType = true;
    }
    else {
        $("#ddlApproveltype").css("border-color", "");
        v_approverType = false;
    }
    if ($("#txtAmountFrom").val() == "") {
        $("#txtAmountFrom").css("border-color", "red");
        amountfrom = true;
    }
    else {
        $("#txtAmountFrom").css("border-color", "");
        amountfrom = false;
    }
    if ($("#txtAmountTo").val() == "") {
        $("#txtAmountTo").css("border-color", "red");
        amountto = true;
    }
    else {
        $("#txtAmountTo").css("border-color", "");
        amountto = false;
    }

    if (!amountfrom || !amountto) {
        if (parseFloat($("#txtAmountFrom").val()) > parseFloat($("#txtAmountTo").val())) {
            $("#txtAmountFrom").css("border-color", "red");
            $("#txtAmountTo").css("border-color", "red");
            amountCompare = true;
        }
        else {
            $("#txtAmountFrom").css("border-color", "");
            $("#txtAmountTo").css("border-color", "");
            amountCompare = false;
        }
    }

    if (v_org || v_group || v_approverType || amountfrom || amountto || amountCompare)
        return true;
    else
        return false;

};
function SaveApproverMaster() {
    var x = isAuthenticated();
    var p_orgId = $("#ddlPurchaseOrg option:selected").val();
    var p_groupId = $("#ddlPurchasegroup option:selected").val();
    var p_approvaltype = $("#ddlApproveltype option:selected").val();
    var isActive = $("#chkIsActive").is(':checked');
    var amountFrom = $("#txtAmountFrom").val();
    var amountTo = $("#txtAmountTo").val();
    var p_idx = $("#hdnNfaApproverID").val();
    var Model = {
        idx: parseInt(p_idx),
        orgID: parseInt(p_orgId),
        cusID: parseInt(CurrentCustomer),
        groupID: parseInt(p_groupId),
        status: isActive,
        createdBy: UserID,
        updatedBy: UserID,
        approvalType: p_approvaltype,
        amountFrom: parseFloat(amountFrom),
        amountTo: parseFloat(amountTo),
        dratf: true
    };
    var url = "NFA/InsertUpdateApprovelMaster";

    var SaveApproverMaster = callajaxReturnSuccess(url, "Post", JSON.stringify(Model));
    SaveApproverMaster.success(function (res) {
        console.log(res);
        if (res.status != "E") {
            $("#hdnNfaApproverID").val(res.result[0].idx);
            nfaApproverIDX = parseInt(res.result[0].idx);
            NextTab();
            ShowHideSeq(p_approvaltype);
        }
        else {
            alert("Error :" + res.error);
        }
    });
    SaveApproverMaster.error(function (xhr, status, error) {
        //  jQuery.unblockUI();
    })
};

function ShowHideSeq(aprType) {
    ApproverType = aprType;
    if (aprType == "S") {
        $(".clsHide").hide();

    }
    else {
        $(".clsHide").show();
    }
}

function onSubmitbtnmaster() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (validateApproverMaster()) {
        $("#errordiv").show();
        $("#error").text("* are mandatory fields");
        jQuery.unblockUI();
        return false;
    }
    $("#errordiv").hide();
    $("#error").text("");
    SaveApproverMaster();
    BindApprovers();
    jQuery.unblockUI();
};

function NextTab() {
    $("#tab_1_1_1").removeClass('active');
    $("#liApprover").removeClass('active');
    $("#liSeq").addClass('active');
    $("#liSeq").show();
    $("#tab_1_1_2").show();
    $("#tab_1_1_2").addClass('active');
}

function BindApprovers() {

    var url = "NFA/FetchApprovers?CustomerId=" + parseInt(CurrentCustomer);

    var GetRes = callajaxReturnSuccess(url, "Get", {});
    GetRes.success(function (res) {
        var ApproverDDL = '';
        ApproverDDL = "<option value='0'>Please select...</option>";
        console.log(res);
        $.each(res.result, function (key, value) {
            ApproverDDL += "<option value='" + value.userID + "'>" + value.userName + "</option>";
        });

        $("#ddlWBApprover").append(ApproverDDL);
        $("#ddlOBApprover").append(ApproverDDL);
        $("#ddlNBApprover").append(ApproverDDL);

    });

};

function validateWBADD() {
    var idx = false;
    var Seq = false;

    if ($("#ddlWBApprover option:selected").val() == 0 || $("#ddlWBApprover option:selected").val() == null) {
        $("#ddlWBApprover").css("border-color", "red");
        idx = true;
    }
    else {
        $("#ddlWBApprover").css("border-color", "");
        idx = false;
    }
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
function validateOBADD() {
    var idx = false;
    var Seq = false;

    if ($("#ddlOBApprover option:selected").val() == 0 || $("#ddlOBApprover option:selected").val() == null) {
        $("#ddlOBApprover").css("border-color", "red");
        idx = true;
    }
    else {
        $("#ddlOBApprover").css("border-color", "");
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
function validateNBADD() {
    var idx = false;
    var Seq = false;

    if ($("#ddlNBApprover option:selected").val() == 0 || $("#ddlNBApprover option:selected").val() == null) {
        $("#ddlNBApprover").css("border-color", "red");
        idx = true;
    }
    else {
        $("#ddlNBApprover").css("border-color", "");
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

function AddWBApprovers() {
    var x = isAuthenticated();
    if (validateWBADD()) {
        return false;
    }
    ++WbSR;
    var ApproverID = $("#ddlWBApprover option:selected").val();
    var ApproverName = $("#ddlWBApprover option:selected").text();
    var Seq = $("#txtWBSeq").val();
    var v_idx = $("#hdnWBSeqID").val();
    if (ApproverType == "S") {
        ++WBSeq;
    }
    else {
        WBSeq = parseInt(Seq);
    }
    var url = "NFA/InsertUpdateSeq";
    var model = {
        idx: parseInt(v_idx),
        nfaApproverID: parseInt(nfaApproverIDX),
        custId: parseInt(CurrentCustomer),
        userID: ApproverID,
        Seq: parseInt(WBSeq),
        budgetType:"WB"
    };
    
    var callAPI = callajaxReturnSuccess(url, "Post", JSON.stringify(model));
    callAPI.success(function (res) {
        console.log(res);
        $("#tblWbbody").append("<tr><td><span id='seq_" + res.result[0].idx + "' style='display:none;'></span><a onclick='UpdateWBApprovers(" + res.result[0].idx + ",'" + ApproverID + "')'><i class='fa fa-pencil'></i></a></td><td id='row_" + WbSR + "'><span id='Approver_" + res.result[0].idx + "' style='display:none;'></span>" + ApproverName + "</td><td>" + WBSeq + "</td></tr>");
    })
};
function AddOBApprovers() {
    var x = isAuthenticated();
    if (validateOBADD()) {
        return false;
    }
    ++ObSR;
    var ApproverID = $("#ddlOBApprover option:selected").val();
    var ApproverName = $("#ddlOBApprover option:selected").text();
    var Seq = $("#txtOBSeq").val();
    var v_idx = $("#hdnOBSeqID").val();
    if (ApproverType == "S") {
        ++OBSeq;
    }
    else {
        OBSeq = parseInt(Seq);
    }
    var url = "NFA/InsertUpdateSeq";
    var model = {
        idx: parseInt(v_idx),
        nfaApproverID: parseInt(nfaApproverIDX),
        custId: parseInt(CurrentCustomer),
        userID: ApproverID,
        Seq: parseInt(OBSeq),
        budgetType: "OB"
    };

    var callAPI = callajaxReturnSuccess(url, "Post", JSON.stringify(model));
    callAPI.success(function (res) {
        console.log(res);
        $("#tblObbody").append("<tr><td><span id='seq_" + res.result[0].idx + "' style='display:none;'></span><a onclick='UpdateWBApprovers(" + res.result[0].idx + ",'" + ApproverID + "')'><i class='fa fa-pencil'></i></a></td><td id='row_" + ObSR + "'><span id='Approver_" + res.result[0].idx + "' style='display:none;'></span>" + ApproverName + "</td><td>" + OBSeq + "</td></tr>");
    })
};
function AddNBApprovers() {
    var x = isAuthenticated();
    if (validateNBADD()) {
        return false;
    }
    ++NbSR;
    var ApproverID = $("#ddlNBApprover option:selected").val();
    var ApproverName = $("#ddlNBApprover option:selected").text();
    var Seq = $("#txtNBSeq").val();
    var v_idx = $("#hdnNBSeqID").val();
    if (ApproverType == "S") {
        ++NBSeq;
    }
    else {
        NBSeq = parseInt(Seq);
    }
    var url = "NFA/InsertUpdateSeq";
    var model = {
        idx: parseInt(v_idx),
        nfaApproverID: parseInt(nfaApproverIDX),
        custId: parseInt(CurrentCustomer),
        userID: ApproverID,
        Seq: parseInt(NBSeq),
        budgetType: "NB"
    };

    var callAPI = callajaxReturnSuccess(url, "Post", JSON.stringify(model));
    callAPI.success(function (res) {
        console.log(res);
        $("#tblNbbody").append("<tr><td><span id='seq_" + res.result[0].idx + "' style='display:none;'></span><a onclick='UpdateWBApprovers(" + res.result[0].idx + ",'" + ApproverID + "')'><i class='fa fa-pencil'></i></a></td><td id='row_" + NbSR + "'><span id='Approver_" + res.result[0].idx + "' style='display:none;'></span>" + ApproverName + "</td><td>" + NBSeq + "</td></tr>");
    })
};
function UpdateWBApprovers(idx, userID) {
    $("#ddlWBApprover").val(userID);
    $("#hdnWBSeqID").val(parseInt(idx));
}




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

    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#tblmodelPurchaseOrg").empty();

        if (res.result.length > 0) {
            $('#searchPop-up').show();
            $('#tblmodelPurchaseOrg').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Purchase Org.</th><th>Status</th></tr></thead>');

            $.each(res.result, function (key, value) {
                console.log(value);
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
    var x = isAuthenticated();
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
