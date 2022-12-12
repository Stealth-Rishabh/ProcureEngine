


//Save Purchase Group Code
$(document).ready(function () {
    //FROM HTML
    Pageloaded()
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    App.init();
    fetchMenuItemsFromSession(19, 55);
    setCommonData();
    //***********
    BindPurchaseOrg();
    bindPurchaseGroupData();
});
function onGroupSaveClick() {
    var str = $('#txtPurchaseGroup').val();
    if (/^[a-zA-Z0-9- ]*$/.test(str) == false) {
        $("#errormsg").text("Special characters not allowed.");
        $("#errordiv1").show();
        $("#errordiv1").fadeOut(5000)

        return false;
    }
    if (ValidatePurchaseGroup()) {
        return false;
    }
    SavePurchaseGroup();
}
$(document).on('keyup', '.form-control', function () {
    if ($.trim($('.form-control').val()).length) {
        $(this).css("border-color", "");
    }
});
function fnclearcss(aid) {

    $('#' + aid.id).css("border-color", "");
}
$(document).on('onchange', '.form-control', function () {
    if ($.trim($('.form-control').val()).length) {

    }
});
function ValidatePurchaseGroup() {
    var groupName = false;

    var OrgID = false;
    if ($("#txtPurchaseGroup").val() == "") {
        $("#txtPurchaseGroup").css("border-color", "red");
        groupName = true;
    }
    else {
        $("#txtPurchaseGroup").css("border-color", "");
        groupName = false;
    }
    if ($("#ddlPurchaseOrg option:selected").val() == 0) {
        $("#ddlPurchaseOrg").css("border-color", "red");

        OrgID = true;
    }
    else {
        $("#ddlPurchaseOrg").css("border-color", "");

        OrgID = false;
    }
    if (groupName || OrgID)
        return true;
    else
        return false;

}

function BindPurchaseOrg() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer) + "&IsActive=0";
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#ddlPurchaseOrg").html('');
        $('#ddlPurchaseOrg').append('<option value="0">Please Select..</option>');
        if (res.result.length > 0) {



            $.each(res.result, function (key, value) {
                $('#ddlPurchaseOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');


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
        $("#tblPurchaseGroupMaster").empty();

        if (res.result.length > 0) {
            $('#searchmaster').show();
            $('#tblPurchaseGroupMaster').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Org.</th><th>Group</th><th>Status</th></tr></thead>');

            $.each(res.result, function (key, value) {

                if (value.active == true)
                    Status = "<span>Active</span>";
                else
                    Status = "<span>In-Active</span>";

                $('#tblPurchaseGroupMaster').append('<tr id="rowid_' + value.idx + '"><td>' + ++key + '</td><td><button class="btn  btn-xs btn-success" href="javascript:;" onClick="onGroupEdit(\'rowid_' + value.idx + '\',' + value.active + ',' + value.orgID + ')"><i class="fa fa-pencil"></i></button></td><td>' + value.orgName + '</td><td>' + value.groupName + '</td><td>' + Status + '</td></tr>')
            });
        }
        else {
            $("#tblPurchaseGroupMaster").empty();
            $('#searchmaster').hide();
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
    var idx = $("#hdnPurchaseGroupId").val();
    var GroupName = $("#txtPurchaseGroup").val();
    var orgId = $("#ddlPurchaseOrg option:selected").val();
    var status = $("#chkIsActive").is(":checked");


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
        if (res == '1') {
            $('.alert-success').show();
            $('#success').text('Data Saved Successfull...');
            $('.alert-success').fadeOut(7000);
        }
        else if (res == '-1') {
            $('#error').html("Data already exists..");
            $('.alert-danger').show();
            $('.alert-danger').fadeOut(5000);
        }
        setTimeout(function () {
            bindPurchaseGroupData();
            ClearControl();
        }, 100)
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
    $("#txtPurchaseGroup").val('');
    $("#ddlPurchaseOrg").val(0);
    $('input:checkbox[name=chkIsActive]').attr('checked', true);
    $('#chkIsActive').parents('span').addClass('checked');
    $("#hdnPurchaseGroupId").val('0')
    $("#submitbtnmaster").text("Save");
}

function onGroupEdit(rowid, checked, orgid) {
    var rowID = $('#' + rowid);
    if (checked == true) {

        $('input:checkbox[name=chkIsActive]').attr('checked', true);
        $('#chkIsActive').parents('span').addClass('checked');

    }
    else {

        $('input:checkbox[name=chkIsActive]').attr('checked', false);
        $('#chkIsActive').parents('span').removeClass('checked');

    }
    var idxParam = rowid.replace('rowid_', '');
    $("#txtPurchaseGroup").val(rowID.find('td:eq(3)').text());
    $("#hdnPurchaseGroupId").val(idxParam);
    $("#ddlPurchaseOrg").val(orgid);



    $("#submitbtnmaster").text("Modify");


};

$("#search").keyup(function () {
    var SearchTerm = $('#search').val();
    SearchInGridview("tblPurchaseGroupMaster", SearchTerm);

});

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
        $('.alert-danger').show();
        $('#error').text('Special characters not allowed.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
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

    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer) + "&IsActive=2";
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#tblmodelPurchaseOrg").empty();

        if (res.result.length > 0) {
            $('#searchPop-up').show();
            $('#tblmodelPurchaseOrg').append('<thead><tr><th style="width:10%!important">Sr#</th><th style="width:10%!important">Actions</th><th>Purchase Org.</th><th>Status</th></tr></thead>');

            $.each(res.result, function (key, value) {
                console.log(value);
                if (value.isActive == true)
                    Status = "<span>Active</span>";
                else
                    Status = "<span>In-Active</span>";

                $('#tblmodelPurchaseOrg').append('<tr id="rowid_' + value.purchaseOrgID + '"><td>' + ++key + '</td><td><button class="btn  btn-xs btn-success" href="javascript:;"  onClick="onEditClick(\'rowid_' + value.purchaseOrgID + '\',' + value.isActive + ')"><i class="fa fa-pencil"></i></button></td><td>' + value.purchaseOrgName + '</td><td>' + Status + '</td></tr>')
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
        $("#errordiv1").fadeOut(5000)
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

