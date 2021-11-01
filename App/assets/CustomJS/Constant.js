//Purchase ORG.
function BindPurchaseOrg(ddlPurchaseorg) {


    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#" + ddlPurchaseorg).html('');
        $("#" + ddlPurchaseorg).append('<option value="0">Please Select..</option>');
        if (res.result.length > 0) {
            $.each(res.result, function (key, value) {
                if (value.isActive == true) {
                    $("#" + ddlPurchaseorg).append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');
                }

            });
        }

    });
    GetNFAPARAM.error(function (error) {
        console.log(error);

    });


};

//Purchase Group
function bindPurchaseGroupDDL(ddlPurchaseGroup) {

    var url = "NFA/GetPurchaseGroup?CustomerId=" + parseInt(CurrentCustomer);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#" + ddlPurchaseGroup).html('');
        $("#" + ddlPurchaseGroup).append('<option value="0">Please select...</option>');
        if (res.result.length > 0) {



            $.each(res.result, function (key, value) {
                if (value.active == true) {
                    $("#" + ddlPurchaseGroup).append('<option value=' + value.idx + '>' + value.groupName + '</option>')
                }
            });
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
    });

};

function bindPurchaseGroupDDL(ddlPurchaseGroup, orgID) {
    debugger;
    var url = "NFA/GetPurchaseGroupByID?CustomerId=" + parseInt(CurrentCustomer) + "&OrgId=" + parseInt(orgID);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#" + ddlPurchaseGroup).html('');
        $("#" + ddlPurchaseGroup).append('<option value="0">Please select...</option>');
        if (res.result.length > 0) {



            $.each(res.result, function (key, value) {

                $("#" + ddlPurchaseGroup).append('<option value=' + value.idx + '>' + value.groupName + '</option>')

            });
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
    });

};