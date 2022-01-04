$(document).ready(function () {

    BindData();
});

function onSave() {
    var str = $('#txtParamText').val();
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
    SaveUpdate();
};

function onClear() {
    $("#txtParamText").val('');
};


function Validate() {
    var nfaText = false;
    if ($("#txtParamText").val() == "") {
        $("#txtParamText").css("border-color", "red");
        $("#error").text("Question is required");
        $("#errordiv").show();
        nfaText = true;
    }
    else {
        $("#txtParamText").css("border-color", "");
        $("#errordiv").hide();
        $("#error").text('');
        nfaText = false;
    }
    if (nfaText)
        return true;
    else
        return false;
};
function BindData() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var url = "NFA/GetNFAText?CustomerID=" + parseInt(CurrentCustomer);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#tblFetchParamMaster").empty();

        if (res.result.length > 0) {
            $('#searchmaster').show();
            $('#tblFetchParamMaster').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Question</th><th>Status</th></tr></thead>');
            
            $.each(res.result, function (key, value) {
                if (value.isActive == true)
                    Status = "<span>Active</span>"; /*class='badge badge-pill badge-success'*/
                else
                    Status = "<span>In-Active</span>"; /*class='badge badge-pill badge-danger'*/

                $('#tblFetchParamMaster').append('<tr id="rowid_' + value.nfaParamID + '"><td>' + ++key + '</td><td><button class="btn  btn-xs btn-success" href="javascript:;" onClick="onEditClick(\'rowid_' + value.nfaParamID + '\',' + value.isActive + ')"><i class="fa fa-pencil"></i></button></td><td>' + value.nfaParamText + '</td><td>' + Status + '</td></tr>')
            });
        }
        else {
            $("#tblFetchParamMaster").empty();
            $('#searchmaster').hide();
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
        jQuery.unblockUI();
    });
    jQuery.unblockUI();

};
function onEditClick(idx, checked) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var rowID = $('#' + idx);
    var idxParam = idx.replace('rowid_', '');
    $("#txtParamText").val(rowID.find('td:eq(2)').text());
    $("#hdnParamID").val(idxParam);
    if (checked == true) {

        $('input:checkbox[name=chkIsActive]').attr('checked', true);
        $('#chkIsActive').parents('span').addClass('checked');
        //$("#chkIsActive").attr('checked', true)

        //$("#chkIsActive").prop('checked', checked);
    }
    else {

        $('input:checkbox[name=chkIsActive]').attr('checked', false);
        $('#chkIsActive').parents('span').removeClass('checked');
        //$("#chkIsActive").attr('checked', false)

        //$("#chkIsActive").prop('checked', checked);
    }


    $("#submitbtnmaster").text("Modify");
    jQuery.unblockUI();
};

function SaveUpdate() {

    var url = "NFA/CreateUpdateNfaParam";
    var idx = $("#hdnParamID").val();
    var paramtext = $("#txtParamText").val();
    var status = $("#chkIsActive").is(':checked')
    var Data = {
        NfaParamID: parseInt(idx),
        CustomerID: parseInt(CurrentCustomer),
        NfaParamText: paramtext,
        IsActive: status,
        createdUser: UserID,
        updatedUser: UserID
    };

    var SaveParam = callajaxReturnSuccess(url, "Post", JSON.stringify(Data));
    SaveParam.success(function (res) {
        if (res.status == "E") {
            alert(res.error);
        }
        else
        window.location.reload();
    });
    SaveParam.error(function (xhr, status,error) {
        var err = eval("(" + xhr.responseText + ")");
        if (xhr.status === 400) {
            alert(JSON.stringify(err.errors));
        }
        if (xhr.status === 401) {
            error401Messagebox(err.Message);
        }
    });
};

$("#search").keyup(function () {
    var SearchTerm = $('#search').val();
    SearchInGridview("tblFetchParamMaster", SearchTerm);
});
