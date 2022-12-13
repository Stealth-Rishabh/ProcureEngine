var APIPath = sessionStorage.getItem("APIPath");
var error = $('.alert-danger');
var success = $('.alert-success');
var form = $('#submit_form');
//FROM HTML
jQuery(document).ready(function () {
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


    Metronic.init();
    Layout.init();
    FormWizard.init();
    ComponentsPickers.init();
    setCommonData();

    fetchMenuItemsFromSession(19, 38);

    fetchRoleMaster();
    fetchAllRoleMaster();
    fetchRegisterUser();
});
//
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

                    txtcustomername: {
                        required: true
                    },

                    txtAddress1: {
                        required: true
                    },
                    from: {
                        required: true

                    },
                    to: {
                        required: true

                    },

                    txtnobids: {
                        required: true,
                        number: true
                    },

                    dropcurrency: {
                        required: true
                    },

                    file1: {
                        required: false
                    },

                    //Second Tab
                    txtadminfirstname: {
                        required: true,
                        maxlength: 200
                    },
                    txtUserEmailID: {
                        required: true,
                        //Email:true,
                        maxlength: 100
                    },
                    txtmobileNo: {
                        maxlength: 10,
                        number: true
                    },

                },

                messages: {
                },

                errorPlacement: function (error, element) {
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

                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {

                        label.closest('.inputgroup').removeClass('has-error').addClass('has-success');
                        label.remove();

                    } else {

                        label

                            .addClass('valid') // mark the current input as valid and display OK icon

                            .closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group

                    }


                },
                submitHandler: function (form) {

                    // success.show();

                    error.hide();

                }



            });
            var displayConfirm = function () {

                $('#tab4 .form-control-static', form).each(function () {

                    var input = $('[name="' + $(this).attr("data-display") + '"]', form);

                    if (input.is(":radio")) {

                        input = $('[name="' + $(this).attr("data-display") + '"]:checked', form);

                    }

                    if (input.is(":text") || input.is("textarea")) {

                        $(this).html(input.val());

                    } else if (input.is("select")) {

                        $(this).html(input.find('option:selected').text());

                    } else if (input.is(":radio") && input.is(":checked")) {

                        $(this).html(input.attr("data-title"));

                    } else if ($(this).attr("data-display") == 'payment') {

                        var payment = [];

                        $('[name="payment[]"]:checked').each(function () {

                            payment.push($(this).attr('data-title'));

                        });

                        $(this).html(payment.join("<br>"));

                    }

                });

            }

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

                    displayConfirm();

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

                    success.hide();

                    error.hide();

                    if (index == 1) {
                        if (form.valid() == false) {

                            form.validate();
                            return false;

                        }
                        else {
                            // ins_updCustomer();

                        }

                    }
                    else if (index == 2) {
                        if (form.valid() == false) {

                            form.validate();
                            return false;

                        }
                       

                    }
                    handleTitle(tab, navigation, index);

                },

                onPrevious: function (tab, navigation, index) {

                    success.hide();

                    error.hide();

                    handleTitle(tab, navigation, index);

                },

                onTabShow: function (tab, navigation, index) {

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

                fnMapMenus()

                //}

            }).hide();



            //unblock code

        }

    };

}();
function InsUpdRoleMaster() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
     if (jQuery("#txtRoleName").val()=="") {
        error.show();
        $('#spandanger').html('Please Enter Role Name...');
        Metronic.scrollTo(error, -200);
        error.fadeOut(3000);
    }
    else {
         var status = "";
         if (jQuery("#checkboxcustomeractive").is(':checked')) {
             Cusstatus = "Y";
         }
         else {
             Cusstatus = "N";
         }
         var data = {
             'RoleID': parseInt($('#hdnRoleID').val()),
             'RoleName': $('#txtRoleName').val(),
             'CustomerID': parseInt(sessionStorage.getItem("CustomerID")),
             'IsActive': Cusstatus
         }
       //  alert(JSON.stringify(data))
         jQuery.ajax({
             url: APIPath + "RoleMenus/insupdRole/",
             beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
             type: "POST",
             data: JSON.stringify(data),
             contentType: "application/json; charset=utf-8",
             success: function (data) {
                 if (data == '1') {
                     $('#spansuccess1').html("Data Saved Successfull...");
                     success.show();
                     success.fadeOut(5000);
                     Metronic.scrollTo(success, -200);

                 }
                 else if (data == '-1') {
                     $('#spandanger').html("Data already exists..");
                     error.show();
                     error.fadeOut(5000);
                     Metronic.scrollTo(success, -200);

                 }
                
                 setTimeout(function () {
                     fetchRoleMaster();
                     fetchAllRoleMaster();
                 }, 800)
                 jQuery.unblockUI();
             },
             error: function (xhr, status, error) {

                 var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                 if (xhr.status == 401) {
                     error401Messagebox(err.Message);
                 }
                 else {
                     fnErrorMessageText('spandanger', 'form-wizard');
                 }
                 jQuery.unblockUI();
                 return false;
             }
            
         });
         resetForm();
    }
}
function resetForm() {
    $('#add_or').text('Add')
    $('#hdnRoleID').val('0')
    $('#txtRoleName').val('')
    jQuery('input:checkbox[name=checkboxcustomeractive]').attr('checked', true);

    jQuery('#checkboxcustomeractive').parents('div').removeClass('bootstrap-switch-off');
    jQuery('#checkboxcustomeractive').parents('div').addClass('bootstrap-switch-on');
}
function fetchRoleMaster() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "RoleMenus/fetchRoleMaster/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&RoleID=-1&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlrole,#ddlrole1").empty();
            jQuery("#ddlrole,#ddlrole1").append(jQuery("<option ></option>").val("0").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlrole,#ddlrole1").append(jQuery("<option ></option>").val(data[i].roleID).html(data[i].roleName));
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form-wizard');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
function fetchAllRoleMaster() {
  
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "RoleMenus/fetchRoleMaster/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&RoleID=-1&excludeStatus=T",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
          
            if (data.length > 0) {
              
                $('#wrap_scroller').removeClass('display-none')
                jQuery("#tblRoleMaster").empty();
                jQuery("#tblRoleMaster").append('<thead><tr><th>Role</th><th>IsActive</th><th>Action</th></tr></thead>');
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isActive.trim() == "Y") {
                        var status = "Yes";
                    }
                    else {
                        var status = "No";
                    }
                   
                    jQuery("#tblRoleMaster").append('<tr><td>' + data[i].roleName + '</td><td>' + status + '</td><td><button class="btn btn-primary btn-xs" id=btn' + i + ' onclick="fnUpdateType(\'' + data[i].roleID + '\',\'' + data[i].roleName + '\',\'' + data[i].isActive + '\')"><i class="fa fa-pencil"></i></button></td></tr>');
                    if (data[i].canBeDeleted == "N") {
                        $('#btn' + i).attr("disabled", "disabled")
                    }
                    else {
                        $('#btn' + i).removeAttr("disabled", "disabled")
                    }
                }
            }
            else {
                $('#wrap_scroller').addClass('display-none')
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form-wizard');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
function fnUpdateType(RoleID, RoleName, isactive) {
    $('#add_or').text('Modify')
    $('#hdnRoleID').val(RoleID)
    $('#txtRoleName').val(RoleName)
    if (isactive == "Y") {
        jQuery('input:checkbox[name=checkboxcustomeractive]').attr('checked', true);

        jQuery('#checkboxcustomeractive').parents('div').removeClass('bootstrap-switch-off');
        jQuery('#checkboxcustomeractive').parents('div').addClass('bootstrap-switch-on');
    }
    else {
        jQuery('input:checkbox[name=checkboxcustomeractive]').attr('checked', false);

        jQuery('#checkboxcustomeractive').parents('div').removeClass('bootstrap-switch-on');
        jQuery('#checkboxcustomeractive').parents('div').addClass('bootstrap-switch-off');
    }
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
       // url: APIPath + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            
            if (data.length > 0) {
                sessionStorage.setItem('hdnAllUsers', JSON.stringify(data))
            }
            else {
                error.show();
                $('#spandanger').html('No Users Found...');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form-wizard');
            }
            jQuery.unblockUI();
            return false;
        }
    })
}
jQuery("#txtusername").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllUsers');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.userName] = username;
            usernames.push(username.userName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].userID != '0') {

            sessionStorage.setItem('hdnUserID', map[item].userID);
            
        }
        else {
            gritternotification('Please select correct User !!!');

        }
        return item;
    }

});
jQuery("#txtusername").keyup(function () {
    sessionStorage.setItem('hdnUserID', '0');
   
});
function fnmapuserRole() {
    if (sessionStorage.getItem('hdnUserID') == "0" || jQuery("#txtusername").val() == "") {
        error.show();
        $('#spandanger').html('Please Enter User Properly...');
        Metronic.scrollTo(error, -200);
        error.fadeOut(3000);
    }
    else if (jQuery("#ddlrole").val() == "0") {
        error.show();
        $('#spandanger').html('Please Select Role...');
        Metronic.scrollTo(error, -200);
        error.fadeOut(3000);
    }
    else {
        var Data = {
            "RoleID": jQuery("#ddlrole").val(),
            "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
            "UserID": parseInt(sessionStorage.getItem("hdnUserID"))
         };
        // alert(JSON.stringify(Data));
        jQuery.ajax({
            url: APIPath + "RoleMenus/MapUserwithRole/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data == '1') {
                    success.show();
                    $('#spansuccess1').html('User Mapped Successfully...');
                    Metronic.scrollTo(success, -200);
                    success.fadeOut(3000);
                    resettab2();
                }
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', 'form-wizard');
                }
                jQuery.unblockUI();
                return false;
            }
        })

    }
}
function resettab2() {
    jQuery("#ddlrole").val('0')
    sessionStorage.setItem("hdnUserID", "0")
    jQuery("#txtusername").val('')
}
function fnfetchMenuswithRole() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = APIPath + "RoleMenus/fetchALLMenus/?ActiveYNFlag=N&For=ComAdmin&RoleID=" + jQuery("#ddlrole1").val() + "&CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&MenuType=0";
 
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

            sessionStorage.setItem('AllMenus', JSON.stringify(data));
            setTimeout(function () {
                paintmenus();
            }, 1000);
            setTimeout(function () {
                fnalreadyMappedMenus();
            }, 3000);

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form-wizard');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
function paintmenus() {
  
    var data = sessionStorage.getItem('AllMenus');
    var data1 = sessionStorage.getItem('AllMenus');
    $('#div_menus').empty();
    var i = 0;
    for (var y = 0; y < jQuery.parseJSON(data).length; y++) {
        if (jQuery.parseJSON(data)[y].parentMenuID == '0') {

            $('#div_menus').append("<ul  id=ULmain" + y + ">");
            jQuery('#ULmain' + y).addClass('jstree-container-ul jstree-no-dots jstree-children jstree-wholerow-ul');
            $('#ULmain' + y).append('<li role=treeitem  id=j1_' + y + '><div role="presentation" unselectable=on id=div' + y + ' ></div ><i role="presentation" id=icon' + y + ' onclick="CollapseLi(this,j1_' + y + ')"></i>');
            jQuery('#j1_' + y).addClass('jstree-node  jstree-open');
            jQuery('#div' + y).addClass('jstree-wholerow');
            jQuery('#icon' + y).addClass('jstree-icon jstree-ocl');
            $('#j1_' + y).append('<a style="text-decoration:none" class=jstree-anchor href="javascript:;"><input id=chkAll' + y + ' onclick="CheckAll(this,div' + y + ')" value=' + jQuery.parseJSON(data)[y].menuID + '  type=checkbox  name=chkAll  />&nbsp;&nbsp;' + jQuery.parseJSON(data)[y].menuName + '</input></a>');
            $('#j1_' + y).append("<ul role=group class='jstree-children' id=childUL" + y + ">");
            for (var x = 0; x < jQuery.parseJSON(data1).length; x++) {
                i = i + jQuery.parseJSON(data)[y].parentMenuID;
                if (jQuery.parseJSON(data)[y].menuID == jQuery.parseJSON(data1)[x].parentMenuID) {

                    $('#childUL' + y).append("<li role='treeitem' id=j1_" + (y + x + i) + " class='jstree-node jstree-leaf'><div class='jstree-wholerow'></div><i class='jstree-icon jstree-ocl'></i>");
                    $('#j1_' + (y + x + i)).append("<a style='text-decoration:none' class='jstree-anchor' href='javascript:;'><input id=checkbox" + x + " name=checkbox" + x + "  type='checkbox' value=" + jQuery.parseJSON(data1)[x].menuID + " />&nbsp;&nbsp;" + jQuery.parseJSON(data1)[x].menuName + "</a></li>");

                }


            }
        }

    }

}
function fnalreadyMappedMenus() {
   
    var url = APIPath + "RoleMenus/fetchMenuCodeRoles/?UserID=" + 0 + "&CustomerID=" + sessionStorage.getItem("CustomerID") + "&RoleID=" + jQuery("#ddlrole1").val();

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",

        success: function (data) {
            
            if (data.length > 0) {
                var chkId = '';
                var chk = '';

                $('#div_menus input[type=checkbox]').each(function () {
                    $('#' + this.id).prop("checked", false);
                    chk += $(this).val() + ",";
                    chkId += (this.id) + ",";
                });
                chk = chk.slice(0, -1);
                chkId = chkId.slice(0, -1);

                var temp = new Array();
                var temp1 = new Array();
                temp = chk.split(",");
                temp1 = chkId.split(",");

                for (var i = 0; i < temp.length; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if (temp[i] == data[j].menuID) {
                            $('#' + temp1[i]).prop("checked", true);

                        }

                    }

                }
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form-wizard');
            }
            jQuery.unblockUI();
            return false;
        }

    });
    jQuery.unblockUI();
}


function CheckAll(qw, divid) {

    var checkedValue = "";
    var tab = qw.id; // table with id tbl1

    var len = tab.length;

    for (var i = 0; i < len; i++) {
        if ($('#' + qw.id).is(':checked')) {

            $('#' + qw.id).closest('ul').find(':checkbox').prop('checked', true);
            $('#' + divid.id).addClass('jstree-wholerow-clicked');
            
        }
        else {

            $('#' + qw.id).closest('ul').find(':checkbox').prop('checked', false);
            $('#' + divid.id).removeClass('jstree-wholerow-clicked');
        }


    }
}

function CollapseLi(iconid, wq) {

    $('#' + wq.id).toggleClass("jstree-node  jstree-open jstree-last").toggleClass("jstree-node  jstree-closed jstree-last");

}
function uncheck() {

    var tab = document.getElementById("div_menus"); // table with id tbl1
    var elems = tab.getElementsByTagName("input");
    var len = elems.length;
    for (var i = 0; i < len; i++) {
        if (elems[i].type == "checkbox") {
            elems[i].checked = false;

        }
    }


}
function fnMapMenus() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    MenuList = '';

    $('#div_menus input[type=checkbox]:checked').each(function () {
        MenuList += $(this).val() + ",";
    });
    MenuList = MenuList.slice(0, -1);

    var Data = {
        "MenuList": MenuList,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "UserID": 0,
        "RoleID": parseInt(jQuery("#ddlrole1").val())
        
    };
    console.log(JSON.stringify(Data))
    jQuery.ajax({
        url: APIPath + "RoleMenus/MapMenusRole/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data == '1') {
                bootbox.alert("Menu mapped Successfully with Roles.", function () {
                   
                    window.location = "RegisterRoleMenuUser.html";
                    return false;
                });
            }

            else {
                jQuery("#diverror").text("Error");
                error.show();
                error.fadeOut(5000)
            }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form-wizard');
            }
            jQuery.unblockUI();
            return false;
        }
        
    });
    
}