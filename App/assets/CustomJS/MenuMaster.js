$(document).ready(function () {  
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
    

    fetchMenuItemsFromSession(45, 36);
    setCommonData();
    FormValidation()
    setTimeout(function () {
        fnfetchMenus()
    }, 500)

})
var form = $('#frm_submittion');
var error = $('#diverror');
var success = $('.alert-success', form);
var MenuID = 0;
var Ordering = '0';
var APIPath = sessionStorage.getItem("APIPath");

$("#txt_ordering").TouchSpin({
    initval: 0
});
function FormValidation() {
    jQuery.validator.addMethod(
        "notEqualTo",
        function (elementValue, element, param) {
            return elementValue != param;
        },
        //"Value cannot be {0}"
        "This field is required."
    );
    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false,
        rules: {
            txt_menuname: {
                required: true
            },
            ddl_menutype: {
                required: true,
               // notEqualTo: 0
            },
            txt_pagelink: {
                required: true
            },
            txt_ordering: {
                required: true,
                number: true,
                maxlength: 3
            }

        },

        invalidHandler: function (event, validator) { //display error alert on form submit   
            success.hide();
            // jQuery("#error").text("You have some form errors. Please check below.");
            error.show();
            error.fadeOut(5000);
            App.scrollTo(error, -200);

        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.xyz').addClass('has-error'); // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element).closest('.xyz').removeClass('has-error').addClass('has-success');

        },
        success: function (label) {
            label.closest('.xyz').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            error.insertAfter(element); // for other inputs, just perform default behavior
        },

        submitHandler: function (form) {

            insupdMenuMaster();
        }
    });
}
function insupdMenuMaster() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";
    if (jQuery("#chkactiveYN").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }
    var Data = {
        "MenuType": $("#ddl_menutype option:selected").val(),
        "MenuID":parseInt(MenuID),
        "MenuName": jQuery('#txt_menuname').val(),
        "PageLink": jQuery('#txt_pagelink').val(),
        "iconClass": jQuery('#txt_icon').val(),
        "ParentMenuID": jQuery('#ddl_parent').val(),
        "IsActive": status,
        "SrNo": Ordering
        
    };
   // alert(JSON.stringify(Data));
    console.log(JSON.stringify(Data))
    jQuery.ajax({
        url: APIPath + "RoleMenus/insUpdMenuMasters/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data == '1') {
                $('#div_succ').html("Data Saved Successfull...");
                success.show();
                success.fadeOut(5000);
                App.scrollTo(success, -200);

            }
            else if (data == '-1') {
                $('#div_succ').html("Data Updated Successfull...");
                success.show();
                success.fadeOut(5000);
                App.scrollTo(success, -200);

            }
            else {
                jQuery("#diverror").text("Data Already Exists...");
                error.show();
                error.fadeOut(5000)
            }
            setTimeout(function () {
                fnfetchMenus();
            }, 1500)
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spnerror', '');
            }
            jQuery.unblockUI();
            return false;
        }
        
    });
    resetForm();
}
function fnfetchMenus() {
    jQuery('#exp').removeClass('collapse');
    jQuery('#exp').addClass('expand');
    jQuery('#formexp').css('display', 'none');

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = APIPath + "RoleMenus/fetchALLMenus/?ActiveYNFlag=T&For=All&RoleID=0&CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&MenuType=0";

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
           
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblMenus").empty();
            if (data.length > 0) {
               
                jQuery("#tblMenus").append("<thead id='tblheader'><th>Parent Menu</th><th>Menu</th><th>Page Link</th><th>Order</th><th>Icon</th><th>Status</th><th>Menu Type</th><th>Edit</th></thead>");
                for (var i = 0; i < data.length; i++) {

                    if (data[i].parentMenuID == '0') {
                        jQuery('<tr><td id=parentmenu' + i + '>' + data[i].menuName + '</td><td>' + data[i].menuName + '</td><td> ' + data[i].pageLink + '</td><td> ' + data[i].srNo + '</td><td> ' + data[i].iconClass + '</td><td>' + data[i].isActive + '</td><td>' + data[i].menuType + '</td><td><button class="btn btn-primary btn-xs" onclick="fnUpdateType(\'' + data[i].menuID + '\',\'' + data[i].parentMenuID + '\',\'' + data[i].isActive + '\',\'' + data[i].menuName + '\',\'' + data[i].pageLink + '\',\'' + data[i].menuType + '\',\'' + data[i].iconClass + '\',\'' + data[i].srNo + '\')"><i class="fa fa-pencil"></i></button></td></tr>').appendTo("#tblMenus");

                        for (var j = 0; j < data.length; j++) {
                            if (data[i].menuID == data[j].parentMenuID) {
                                jQuery('<tr><td></td><td>' + data[j].menuName + '</td><td> ' + data[j].pageLink + '</td><td> ' + data[j].srNo + '</td><td> ' + data[j].iconClass + '</td><td>' + data[j].isActive + '</td><td>' + data[j].menuType + '</td><td><button class="btn btn-primary btn-xs" onclick="fnUpdateType(\'' + data[j].menuID + '\',\'' + data[j].parentMenuID + '\',\'' + data[j].isActive + '\',\'' + data[j].menuName + '\',\'' + data[j].pageLink + '\',\'' + data[j].menuType + '\',\'' + data[j].iconClass + '\',\'' + data[j].srNo + '\')"><i class="fa fa-pencil"></i></button></td></tr>').appendTo("#tblMenus");
                            }

                        }
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
                fnErrorMessageText('spnerror', '');
            }
            jQuery.unblockUI();
            return false;
        }
       
    });
}

function fnUpdateType(menuid, parentmenuid, status, menuname, link, menutype, icon, ordering) {
    $("#txt_ordering").val(ordering);
    $('#lblordering').removeClass('hide');
    $('#txtordering').removeClass('hide');
    App.scrollTo($('#txt_menuname'), -1000);
    jQuery('#exp').addClass('collapse');
    jQuery('#exp').removeClass('expand');
    jQuery('#formexp').css('display', 'block');
    MenuID = menuid;
    Ordering = ordering;
    jQuery('#ddl_menutype').val(menutype);
    fnfetchParentMenus();
    
    jQuery('#txt_menuname').val(menuname);
    jQuery('#txt_pagelink').val(link);
    
    jQuery('#txt_icon').val(icon);
    setTimeout(function () {
        jQuery('#ddl_parent').val(parentmenuid);
    },300)
   
    if (status == "Yes") {
        jQuery('input:checkbox[name=chkactiveYN]').prop('checked', true);
        jQuery('#chkactiveYN').parents('div').addClass('checked');
    }
    else {
        jQuery('input:checkbox[name=chkactiveYN]').prop('checked', false);
        jQuery('#chkactiveYN').parents('div').removeClass('checked');
    }
   
    if (link == "#") {
        jQuery('#txt_pagelink').attr('disabled', 'disabled');
        jQuery('input:checkbox[name=chkIsparent]').prop('checked', true);
        jQuery('#chkIsparent').parents('div').addClass('checked');
        $('#div_forIsParent').addClass('hide')
    }
    else {
        jQuery('#txt_pagelink').removeAttr('disabled', 'disabled');
        jQuery('input:checkbox[name=chkIsparent]').prop('checked', false);
        jQuery('#chkIsparent').parents('div').removeClass('checked');
        $('#div_forIsParent').removeClass('hide')
    }
}
function resetForm() {
    MenuID = 0;
    Ordering = '0';
   // $("#txt_ordering").val(1)
    jQuery('#txt_menuname').val('');
    jQuery('input:checkbox[name=chkactiveYN]').prop('checked', true);
    jQuery('#chkactiveYN').parents('div').addClass('checked');
    jQuery('input:checkbox[name=chkIsparent]').prop('checked', true);
    jQuery('#chkIsparent').parents('div').addClass('checked');
    jQuery('#ddl_menutype').val('');
    jQuery('#div_forIsParent').addClass('hide')
    jQuery('#txt_pagelink').val('');
    jQuery('#txt_icon').val('');
    jQuery('#ddl_parent').val('0');
    $('#lblordering').addClass('hide');
    $('#txtordering').addClass('hide');

}
function fnfetchParentMenus() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = APIPath + "RoleMenus/fetchALLMenus/?ActiveYNFlag=T&For=Parent&RoleID=0&CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&MenuType=" + jQuery("#ddl_menutype").val();

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
            jQuery("#ddl_parent").empty();
            jQuery("#ddl_parent").append(jQuery("<option value='0'>Select</option>"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddl_parent").append(jQuery("<option ></option>").val(data[i].menuID).html(data[i].menuName));
            }
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spnerror', '');
            }
            jQuery.unblockUI();
            return false;
        }
       
    });
}


$('#chkIsparent').on('ifChanged', function (e) {
 
   // $(this).trigger("onclick", e);
    if ($('#chkIsparent').is(':checked')) {
        jQuery('input:checkbox[name=chkIsparent]').prop('checked', true);
        jQuery('#chkIsparent').parents('div').addClass('checked');
        $('#div_forIsParent').addClass('hide')
        $('#ddl_parent').attr("required", "false")
        jQuery('#txt_pagelink').attr('disabled', 'disabled');
        jQuery('#txt_ordering').attr('disabled', 'disabled');
        jQuery('#txt_ordering').val('1')
        jQuery('#txt_pagelink').val('#')
        $('#ddl_parent').val('0');
        //$('#ddl_parent').text('Select');

    }
    else {
        jQuery('input:checkbox[name=chkIsparent]').prop('checked', false);
        jQuery('#chkIsparent').parents('div').removeClass('checked');
        $('#div_forIsParent').removeClass('hide')
        $('#ddl_parent').attr("required", "true")
        $('#ddl_parent').attr("notEqualTo", "0")
        jQuery('#txt_pagelink').removeAttr('disabled', 'disabled');
        jQuery('#txt_ordering').removeAttr('disabled', 'disabled');
        jQuery('#txt_pagelink').val('')
        jQuery('#txt_ordering').val('')
    }
});
jQuery("#txtseach").keyup(function () {
    jQuery("#tblMenus tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#txtseach').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblMenus tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tblMenus tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});
