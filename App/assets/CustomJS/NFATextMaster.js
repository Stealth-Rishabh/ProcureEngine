$(document).ready(function () {
    BindPurchaseOrg();
    BindData();
});
function BindPurchaseOrg() {


    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer) + "&IsActive=0";
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {

        $("#ddlPurchaseOrg").empty();
        $('#ddlPurchaseOrg').append('<option value="0">ALL</option>');
        if (res.result.length > 0) {
            $.each(res.result, function (key, value) {
                $('#ddlPurchaseOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');
            });
        }

    });
    GetNFAPARAM.error(function (error) {
        console.log(error);

    });


};
function onSave() {
    var str = $('#txtParamText').val();
    var pattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]*$/
    //@abheedev bug 385 start
    if (pattern.test(str) == false) 
    {
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
 //@abheedev bug368 end

function onClear() {
    $("#txtParamText").val('');
    $("#ddlPurchaseOrg").val('0');
    $('input:checkbox[name=chkIsActive]').attr('checked', true);
    $('#chkIsActive').parents('span').addClass('checked');

    $('input:checkbox[name=chkIsdefault]').attr('checked', true);
    $('#chkIsdefault').parents('span').addClass('checked');
};

$(document).on('keyup', '.form-control', function () {
    if ($.trim($('.form-control').val()).length) {
        $(this).css("border-color", "");
    }
});
$(document).on('change', '.form-control', function () {
    if ($.trim($('.form-control').val()).length) {
        $(this).css("border-color", "");
    }
});
function Validate() {
    var nfaText = false;

    
    if ($("#txtParamText").val() == "") {
        $("#txtParamText").css("border-color", "red");
        $("#error").text("Question is required");
        $("#errordiv").show();
        $('.alert-danger').fadeOut(5000);
        nfaText = true;
    }
    else {
        $("#txtParamText").css("border-color", "");
        $("#errordiv").hide();
        $("#error").text('');
        nfaText = false;
    }


    if (nfaText) {
        return true;
    }
    else {
        return false;
    }
};
function BindData() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var url = "NFA/GetNFAText?CustomerID=" + parseInt(CurrentCustomer) + "&Isactive=2";
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#tblFetchParamMaster").empty();

        if (res.result.length > 0) {
            $('#searchmaster').show();
            $('#tblFetchParamMaster').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Purchase Org</th><th>Question</th><th>Pre Populated</th><th>Status</th></tr></thead>');

            $.each(res.result, function (key, value) {
                if (value.isActive == true)
                    Status = "<span>Active</span>"; /*class='badge badge-pill badge-success'*/
                else
                    Status = "<span>In-Active</span>"; /*class='badge badge-pill badge-danger'*/

                if (value.flDefault == "Y")
                    isdefault = "<span>Yes</span>";
                else
                    isdefault = "<span>No</span>";
                
                if (value.purchaseOrgName == '')
                    porg = 'ALL';
                else
                    porg = value.purchaseOrgName;
                $('#tblFetchParamMaster').append('<tr id="rowid_' + value.nfaParamID + '"><td>' + ++key + '</td><td><button class="btn  btn-xs btn-success" href="javascript:;" onClick="onEditClick(\'rowid_' + value.nfaParamID + '\',\'' + value.isActive + '\',\'' + value.flDefault + '\',\'' + value.purchaseOrg + '\')"><i class="fa fa-pencil"></i></button></td><td>' + porg + '</td><td>' + value.nfaParamText + '</td><td>' + isdefault + '</td><td>' + Status + '</td></tr>')
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
function onEditClick(idx, checked, isdefault, Porgid) {


    var rowID = $('#' + idx);
    var idxParam = idx.replace('rowid_', '');
    $("#txtParamText").val(rowID.find('td:eq(3)').text());
    $("#ddlPurchaseOrg").val(Porgid);
    $("#hdnParamID").val(idxParam);
    if (checked == 'true') {

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
    if (isdefault == "Y") {

        $('input:checkbox[name=chkIsdefault]').attr('checked', true);
        $('#chkIsdefault').parents('span').addClass('checked');

    }
    else {

        $('input:checkbox[name=chkIsdefault]').attr('checked', false);
        $('#chkIsdefault').parents('span').removeClass('checked');

    }
    $("#submitbtnmaster").text("Modify");

};

function SaveUpdate() {
    debugger
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var isdefault = 'N'
    var url = "NFA/CreateUpdateNfaParam";
    var idx = $("#hdnParamID").val();
    var paramtext = $("#txtParamText").val();
    var status = $("#chkIsActive").is(':checked')
    if ($("#chkIsdefault").is(':checked')) {
        isdefault = 'Y'
    }

    var Data = {
        NfaParamID: parseInt(idx),
        CustomerID: parseInt(CurrentCustomer),
        PurchaseOrg: parseInt($("#ddlPurchaseOrg option:selected").val()),
        NfaParamText: paramtext,
        IsActive: status,
        flDefault: isdefault,
        createdUser: UserID,
        updatedUser: UserID
    };
   
    var SaveParam = callajaxReturnSuccess(url, "Post", JSON.stringify(Data));
    
    SaveParam.success(function (res) {
        
        if (res == '1') {
            $('.alert-success').show();
            $('#success').text('Qusetion saved Successfully.');
            $('.alert-success').fadeOut(7000);
            BindData();
            onClear();
        }
        else if (res == '-1') {
            $('#error').html("Data already exists..");
            $('.alert-danger').show();
            $('.alert-danger').fadeOut(5000);
        }

        jQuery.unblockUI();
    });
    SaveParam.error(function (xhr, status, error) {
        var err = eval("(" + xhr.responseText + ")");
        if (xhr.status === 400) {
            alert(JSON.stringify(err.errors));
        }
        if (xhr.status === 401) {
            error401Messagebox(err.Message);
        }
        jQuery.unblockUI();
    });
};

$("#search").keyup(function () {
    var SearchTerm = $('#search').val();
    SearchInGridview("tblFetchParamMaster", SearchTerm);
});
