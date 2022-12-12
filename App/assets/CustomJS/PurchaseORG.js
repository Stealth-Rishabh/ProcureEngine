

$("#search").keyup(function () {
    var SearchTerm = $('#search').val();
    SearchInGridview("tblPurchaseORGMaster", SearchTerm);
    
});

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
    fetchMenuItemsFromSession(19, 54);
    setCommonData();
    //*******
    BindData();
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
    $("#txtPurchaseOrg").val('');
};


function Validate() {
    var nfaText = false;
    if ($("#txtPurchaseOrg").val() == "") {
        $("#txtPurchaseOrg").css("border-color", "red");
        $("#error").text("Purchase Org is required");
        $("#errordiv").show();
        nfaText = true;
    }
    else {
        $("#txtPurchaseOrg").css("border-color", "");
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

    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer)+"&IsActive=2";
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#tblPurchaseORGMaster").empty();

        if (res.result.length > 0) {
            $('#searchmaster').show();
            $('#tblPurchaseORGMaster').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Purchase Org.</th><th>Status</th></tr></thead>');

            $.each(res.result, function (key, value) {
                console.log(value);
                if (value.isActive == true)
                    Status = "<span>Active</span>"; 
                else
                    Status = "<span>In-Active</span>";

                $('#tblPurchaseORGMaster').append('<tr id="rowid_' + value.purchaseOrgID + '"><td>' + ++key + '</td><td><button class="btn  btn-xs btn-success" href="javascript:;" onClick="onEditClick(\'rowid_' + value.purchaseOrgID + '\',' + value.isActive + ')"><i class="fa fa-pencil"></i></button></td><td>' + value.purchaseOrgName + '</td><td>' + Status + '</td></tr>')
            });
        }
        else {
            $("#tblPurchaseORGMaster").empty();
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
    if (checked == true) {

        $('input:checkbox[name=chkIsActive]').attr('checked', true);
        $('#chkIsActive').parents('span').addClass('checked');

    }
    else {

        $('input:checkbox[name=chkIsActive]').attr('checked', false);
        $('#chkIsActive').parents('span').removeClass('checked');

    }
    var idxParam = idx.replace('rowid_', '');
    $("#txtPurchaseOrg").val(rowID.find('td:eq(2)').text());
    $("#hdnPurchaseOrgId").val(idxParam);
   


    $("#submitbtnmaster").text("Modify");
    jQuery.unblockUI();
};
function SaveUpdateData() {

    var url = "NFA/InsertUpdatePurchaseOrg";
    var idx = $("#hdnPurchaseOrgId").val();
    var Name = $("#txtPurchaseOrg").val();
    var status = $("#chkIsActive").is(':checked')
    
    var obj = {
        PurchaseOrgID: parseInt(idx),
        CustomerID: parseInt(CurrentCustomer),
        PurchaseOrgName: Name,
        IsActive: status,
        CreatedBy: UserID,
        UpdatedBy: UserID
    };
   // alert(JSON.stringify(obj))
    var SaveUpdateData = callajaxReturnSuccess(url, "Post", JSON.stringify(obj));
    SaveUpdateData.success(function (res) {
        
        
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
            BindData();
            clear();
        }, 100)
       

    });
    SaveUpdateData.error(function (xhr, status, error) {
        console.log(error);
        var err = eval("(" + xhr.responseText + ")");
        if (xhr.status === 400) {
            alert(JSON.stringify(err.errors));
        }
        if (xhr.status === 401) {
            error401Messagebox(err.Message);
        }
        
    });
}
function clear() {
    $('input:checkbox[name=chkIsActive]').attr('checked', true);
    $('#chkIsActive').parents('span').addClass('checked');
    $("#hdnPurchaseOrgId").val('0')
    $("#txtPurchaseOrg").val('')
    $("#submitbtnmaster").text("Save");
}