
function RegisterUser() {
   
    var status = "";
    if (jQuery('#chkIsActive').is(':checked') == true) {
        status = 'Y';
    }
    else {
        status = 'N';
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
        "Designation": jQuery('#txtdesignation').val()
    };
  //  alert(JSON.stringify(RegisterUser))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RegisterUser/RegisterUser/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(RegisterUser),
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {
           
        if (data == 'Y') {
                jQuery('#divalerterror').hide();
                App.scrollTo($('#divalertsucess'), -200);
                jQuery('#divalertsucess').slideDown(1000);
                fetchRegisterUser();
        }
        else if (data == 'N') {

                $('.alert-danger').show();
                $('#spanerror1').html('Server Error.');
                App.scrollTo($('.alert-danger'), -300)
                $('.alert-danger').fadeOut(5000);
        }
        else {
            jQuery('#divalertsucess').hide();
                $("#spanerror1").html('User already exists.!');
                App.scrollTo($('#divalerterror'), -200);
                jQuery('#divalerterror').slideDown(1000);
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                alert('error')
                jQuery("#error").text(xhr.d);
            }
            return false;
            jQuery.unblockUI();
        }
        
    });
    clearform();
}


function fetchRegisterUser() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            jQuery("#tblRegisterUsers > tbody").empty();
            if (data.length > 0) {
                jQuery.each(data, function (key, value) {
                   
                    var str = "<tr><td style=\"display:none;\">" + value.userID + "</td><td>" + value.userName + "</td><td>" + value.mobileNO + "</td><td>" + value.emailID + "</td><td>" + value.designation + "</td><td>" + value.roleName + "</td><td>" + value.isActive + "</td><td style=\"display:none;\">" + value.roleID + "</td>";
                    str += "<td style=\"text-align:right\">";
                    str += "<a href=\"#\"  onclick=\"EditUser(this)\" class=\"btn default btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a>&nbsp;&nbsp;";
                    str += "</td></tr>";
                    jQuery('#tblRegisterUsers > tbody').append(str);
                });
            }
            else {
                jQuery('#tblRegisterUsers > tbody').append("<tr><td colspan='8' style='text-align: center; color:red;'>No User found</td></tr>");
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            
            return false;
            jQuery.unblockUI();
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
    //fetchUserBidTypeMapping(UserID);
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
            }        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert("error");
            }
            return false;
            jQuery.unblockUI();
        }
    });
}

function clearform() {
    jQuery("#txtUsername").val('');
    jQuery("#txtemail").val('');
    jQuery("#txtmobilno").val('');
    jQuery("#txtuserrole").val('');
    jQuery('#hdnUserID').val('0');
    jQuery("#ddlroleMaster").val('');
    $('#txtdesignation').val('');
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
                  required:true
                }
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
                }
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
                    RegisterUser();
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
} ();

jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblRegisterUsers tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});

