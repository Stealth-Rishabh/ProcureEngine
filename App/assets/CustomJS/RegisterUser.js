var selectedgroup = [];
var selectedgroupid = [];
var cc = 0;

function fnaddPurchaseOrg() {
    selectedgroup = [];
    selectedgroupid = [];


    if ($("#ddlPurchasegroup").select2('data').length) {
        $.each($("#ddlPurchasegroup").select2('data'), function (key, item) {
            selectedgroupid.push(item.id);
            selectedgroup.push(item.text);
        });
    }
    if ($('#tddlPurchaseOrg').val == "" || selectedgroupid.length == 0) {
        $('.alert-danger').show();
        $('#spanerror1').html('Please Map Purchase Org/Purchase Group.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(5000);
        return false;
    }
    else if (selectedgroupid.length > 0) {
        for (var i = 0; i < selectedgroupid.length; i++) {
            $('#tblpurchaseOrg').append('<tr id=TRgroup' + cc + '><td id=OrgId' + cc + ' class=hide >' + $('#ddlPurchaseOrg option:selected').val() + '</td><td class=hide id=GrpId' + cc + '>' + selectedgroupid[i] + '</td><td>' + $('#ddlPurchaseOrg option:selected').text() + '</td><td>' + selectedgroup[i] + '</td><td style="width:5%"><a class="btn  btn-xs btn-danger"  onclick="deleterow(TRgroup' + cc + ',' + cc + ',' + selectedgroupid[i] + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
            cc = cc + 1;
        }


        if (jQuery('#tblpurchaseOrg tr').length > 0) {
            $('#theadgroup').removeClass('hide');
        }
        else {
            $('#theadgroup').addClass('hide');
        }

    }
    $("#ddlPurchaseOrg").val('')
    $('#ddlPurchasegroup').val('').trigger('change');
    $('#ddlPurchasegroup').empty();
    $('#ddlPurchasegroup').select2({
        placeholder: "Select Purchase Group",
        allowClear: true
    });


}
function deleterow(trid, rowcount, gid) {

    $('#' + trid.id).remove()
    cc = cc - 1;
    
    if (jQuery('#tblpurchaseOrg tr').length == 1) {
        $('#theadgroup').addClass('hide');
    }
    else {
        $('#theadgroup').removeClass('hide');
    }

}
function bindPurchaseGroupDDL() {
    // alert(sessionStorage.getItem("APIPath") + "NFA/GetPurchaseGroupByUserID?CustomerId=" + sessionStorage.getItem("CustomerID") + "&OrgId=" + $('#ddlPurchaseOrg option:selected').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")))
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "NFA/GetPurchaseGroupByID?CustomerId=" + sessionStorage.getItem("CustomerID") + "&OrgId=" + $('#ddlPurchaseOrg option:selected').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $('#ddlPurchasegroup').empty();
            if (data.result.length > 0) {
                //$('#ddlPurchasegroup').append('<option value="">Select Purchase Group</option>');
                jQuery.each(data.result, function (key, value) {
                    $('#ddlPurchasegroup').append('<option value=' + value.idx + '>' + value.groupName + '</option>');
                });
                $("#ddlPurchasegroup").trigger("change");
            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
    setTimeout(function () {
        jQuery('#divalertsucess').css('display', 'none');
    }, 2000);
}


function BindPurchaseOrg() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "NFA/GetPurchaseOrg?CustomerId=" + sessionStorage.getItem("CustomerID") + "&IsActive=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $('#ddlPurchaseOrg').empty();
            if (data.result.length > 0) {
                $('#ddlPurchaseOrg').append('<option value="">Select</option>');
                jQuery.each(data.result, function (key, value) {
                    $('#ddlPurchaseOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');
                });
            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
    setTimeout(function () {
        jQuery('#divalertsucess').css('display', 'none');
    }, 2000);
}





function RegisterUser() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";
    if (jQuery('#chkIsActive').is(':checked') == true) {
        status = 'Y';
    }
    else {
        status = 'N';
    }

    var purOrg = [];
    var rowCount = jQuery('#tblpurchaseOrg >tbody >tr').length;
    if (rowCount >= 1) {
        jQuery('#tblpurchaseOrg >tbody >tr').each(function () {
            var this_row = $(this);


            var app = {
                "OrgId": parseInt($.trim(this_row.find('td:eq(0)').html())),
                "GrpId": parseInt($.trim(this_row.find('td:eq(1)').html()))

            };
            purOrg.push(app)
        })
    }


    var RegisterUser = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": parseInt(jQuery("#hdnUserID").val()),
        "UserName": jQuery("#txtUsername").val(),
        "MobileNO": jQuery("#txtmobilno").val(),
        "EmailID": jQuery("#txtemail").val(),
        "RoleID": parseInt(jQuery('#ddlroleMaster').val()),
        "IsActive": status,
        "CreatedBy": sessionStorage.getItem('UserID'),
        "Designation": jQuery('#txtdesignation').val(),
        "PrefferedTZ": parseInt(jQuery("#ddlpreferredTime").val()),
        "purOrg": purOrg
    };
    //alert(JSON.stringify(RegisterUser))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RegisterUser/RegisterUser/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(RegisterUser),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data.isSuccess == 'Y') {
                jQuery('#divalerterror').hide();
                App.scrollTo($('#divalertsucess'), -200);
                jQuery('#divalertsucess').slideDown(1000);
                fetchRegisterUser();
            }
            //    else if (data.isSuccess == 'N') {

            //        $('.alert-danger').show();
            //        $('#spanerror1').html('Server Error.');
            //        App.scrollTo($('.alert-danger'), -300)
            //        $('.alert-danger').fadeOut(5000);
            //}
            else {
                jQuery('#divalertsucess').hide();
                $("#spanerror1").html('User already exists.!');
                App.scrollTo($('#divalerterror'), -200);
                jQuery('#divalerterror').slideDown(1000);
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }

    });
    clearform();
}


function fetchRegisterUser() {
    var data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "Isactive": "N"
    } 
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
       // url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&Isactive=T",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            jQuery("#tblRegisterUsers > tbody").empty();
            if (data.length > 0) {
                jQuery.each(data, function (key, value) {

                    var str = "<tr><td style=\"display:none;\">" + value.userID + "</td><td>" + value.userName + "</td><td>" + value.mobileNO + "</td><td>" + value.emailID + "</td><td>" + value.designation + "</td><td>" + value.roleName + "</td><td>" + value.isActive + "</td><td style=\"display:none;\">" + value.roleID + "</td>";
                    str += "<td>" + value.localeName + "</td><td style=\"text-align:right\">";
                    str += "<a href=\"#\"  onclick=\"EditUser(this)\" class=\"btn default btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a>&nbsp;&nbsp;";
                    str += "</td><td style=\"display:none;\">" + value.prefferedTZ + "</td></tr>";
                    jQuery('#tblRegisterUsers > tbody').append(str);
                });
            }
            else {
                jQuery('#tblRegisterUsers > tbody').append("<tr><td colspan='8' style='text-align: center; color:red;'>No User found</td></tr>");
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }

    });
    setTimeout(function () {
        jQuery('#divalertsucess').css('display', 'none');
    }, 2000);
}

function EditUser(ctrl) {

    jQuery("#txtUsername").val(jQuery(ctrl).closest('tr').find("td").eq(1).html());
    jQuery("#txtUsername").closest('.form-group').removeClass('has-error').find('span').hide()
    jQuery("#txtmobilno").val(jQuery(ctrl).closest('tr').find("td").eq(2).html());
    jQuery("#txtmobilno").closest('.form-group').removeClass('has-error').find('span').hide()
    jQuery("#txtemail").val(jQuery(ctrl).closest('tr').find("td").eq(3).html());
    jQuery("#txtemail").closest('.form-group').removeClass('has-error').find('span').hide()
    jQuery("#txtdesignation").val(jQuery(ctrl).closest('tr').find("td").eq(4).html());
    jQuery("#txtdesignation").closest('.form-group').removeClass('has-error').find('span').hide()
    jQuery("#ddlroleMaster").val(jQuery(ctrl).closest('tr').find("td").eq(7).html());
    jQuery("#ddlroleMaster").closest('.form-group').removeClass('has-error').find('span').hide()
    jQuery("#ddlpreferredTime").val(jQuery(ctrl).closest('tr').find("td").eq(10).html());
    jQuery("#ddlpreferredTime").closest('.form-group').removeClass('has-error').find('span').hide()
    var isActivie = jQuery(ctrl).closest('tr').find("td").eq(6).html();
    jQuery("#chkIsActive").closest('.form-group').removeClass('has-error').find('span').show()

    if (isActivie == 'Yes') {

        jQuery('#chkIsActive').attr('checked', true);
        jQuery('#chkIsActive').closest('span').attr('class', 'checked');
    }
    else {

        jQuery('#chkIsActive').attr('checked', false);
        jQuery('#chkIsActive').closest('span').attr('class', '');
    }

    var UserID = jQuery(ctrl).closest('tr').find("td").eq(0).html();
    $('#hdnUserID').val(UserID);
    fetchUserDetails(UserID);




}


function fetchRoleMaster() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RoleMenus/fetchRoleMaster/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&RoleID=0&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlroleMaster").empty();
            jQuery("#ddlroleMaster").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlroleMaster").append(jQuery("<option ></option>").val(data[i].roleID).html(data[i].roleName));
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });



    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchTimezoneLst/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            let lstTZ = JSON.parse(data[0].jsondata);
            console.log(lstTZ);
            jQuery("#ddlpreferredTime").empty();
            jQuery("#ddlpreferredTime").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < lstTZ.length; i++) {

                jQuery("#ddlpreferredTime").append(jQuery("<option ></option>").val(lstTZ[i].id).html(lstTZ[i].localeName));
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}

function clearform() {
    jQuery("#txtUsername").val('');
    jQuery("#txtemail").val('');
    jQuery("#txtmobilno").val('');
    jQuery("#txtuserrole").val('');
    jQuery('#hdnUserID').val('0');
    jQuery('#ddlpreferredTime').val('');
    jQuery("#ddlroleMaster").val('');
    $('#txtdesignation').val('');
    $('#tblpurchaseOrg').empty();
    selectedgroup = [];
    selectedgroupid = [];
    cc = 0;

    $('#tblpurchaseOrg').append('<thead class=hide id=theadgroup><tr><th>Purchase org</th><th>Purchase Group</th><th></th></tr></thead>');
    jQuery('div#divrblist span').each(function () {
        $(this).attr('class', '');
    });

}



var FormValidation = function () {

    var ValidateUser = function () {
        var form1 = $('#entryForm');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);

        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                txtUsername: {
                    required: true
                },
                txtmobilno: {
                    required: true,
                    number: true,
                    minlength: 10,
                    maxlength: 10
                },
                txtemail: {
                    required: true,
                    email: true
                },
                ddlroleMaster:
                {
                    required: true
                },
                ddlpreferredTime:
                {
                    required: true
                },
                /*ddlPurchaseOrg:
                {
                    required: true
                },
                ddlPurchasegroup:
                {
                    required: true
                }*/
            },
            messages: {
                txtUsername: {
                    required: "Please enter user name"
                },
                txtmobilno: {
                    required: "Please enter mobile no"
                },
                txtemail: {
                    required: "Please enter email address"
                },
                ddlroleMaster:
                {
                    required: "Please select role"
                },
                ddlpreferredTime:
                {
                    required: "Please select Preffered Time Zone"
                },
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();
                $('.alert-danger').show();
                $('#spanerror1').html('You have some error please check below..');
                App.scrollTo($('.alert-danger'), -300);
                $('.alert-danger').fadeOut(5000);

            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.xyz').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.xyz').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                    .closest('.xyz').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {

                var status = 'True';
                if (status == 'True') {
                    if ($('#tblpurchaseOrg >tbody >tr').length == 0) {
                        $('.alert-danger').show();
                        $('#spanerror1').html('Please Map Purchase Org/Purchase Group.');
                        Metronic.scrollTo($(".alert-danger"), -200);
                        $('.alert-danger').fadeOut(5000);
                        return false;
                    }
                    else {
                        RegisterUser();
                    }

                }
                App.scrollTo(error1, -100);
            }
        });
    }
    var handleWysihtml5 = function () {
        if (!jQuery().wysihtml5) {
            return;
        }
        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5({
                "stylesheets": ["assets/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
            });
        }
    }
    return {
        init: function () {
            handleWysihtml5();
            ValidateUser();
        }
    };
}();

jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblRegisterUsers tbody").find("tr"), function () {

        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});

function fetchUserDetails(UserID) {
    //jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + UserID + "&UserType=R",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            cc = 0;
            if (data.length > 0) {

                let userdetails = JSON.parse(data[1].jsondata);
                console.log(userdetails);
                $('#tblpurchaseOrg').empty();
                if (userdetails.length > 0 && userdetails != null) {
                    $('#tblpurchaseOrg').append('<thead class=hide id=theadgroup><tr><th>Purchase org</th><th>Purchase Group</th><th></th></tr></thead>');
                    for (var i = 0; i < userdetails.length; i++) {
                        $('#tblpurchaseOrg').append('<tr id=TRgroup' + cc + '><td id=OrgId' + cc + ' class=hide >' + userdetails[i].PurchaseOrgID + '</td><td class=hide id=GrpId' + cc + '>' + userdetails[i].PurchaseGrpID + '</td><td>' + userdetails[i].PurchaseOrgName + '</td><td>' + userdetails[i].PurchaseGrpName + '</td><td style="width:5%"><a   class="btn  btn-xs btn-danger" onclick="deleterow(TRgroup' + cc + ',' + cc + ',' + userdetails[0].PurchaseGrpID + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                        cc = cc + 1;
                    }
                    if (jQuery('#tblpurchaseOrg tr').length > 0) {
                        $('#theadgroup').removeClass('hide');
                    }
                    else {
                        $('#theadgroup').addClass('hide');
                    }

                }
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });

}
