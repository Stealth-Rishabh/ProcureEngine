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

    fetchMenuItemsFromSession(45, 37);
    FetchCurrency('0');
    fetchALLmenuitems();
    jQuery("#dropCountry").append(jQuery("<option ></option>").val("0").html("Select"));
    jQuery("#dropState").append(jQuery("<option ></option>").val("0").html("Select"));
    jQuery("#dropCity").append(jQuery("<option ></option>").val("0").html("Select"));
    fillCountryDropDown('dropCountry', 0);
    FetchAllCustomer();

});
function checkimageExtension(file) {
    var flag = true;
    var extension = file.substr((file.lastIndexOf('.') + 1));

    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        //case 'gif':


        case 'JPG':
        case 'JPEG':
        case 'PNG':
            // case 'GIF':

            flag = true;
            break;
        default:
            flag = false;
    }

    return flag;
}
function getNameFromPath(strFilepath) {
    // alert(strFilepath);
    var objRE = new RegExp(/([^\/\\]+)$/);
    var strName = objRE.exec(strFilepath);

    if (strName == null) {
        return null;
    }
    else {
        return strName[0];
    }

}
//*************
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
                    txturlextension: {
                        required: true,
                        maxlength: 30
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
                    txttermscondition: {
                        required: true
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

                    'payment[]': {

                        required: "Please select at least one option",

                        minlength: jQuery.validator.format("Please select at least one option")

                    },
                    txtitembidduration: {
                        required: "Please Enter Bid Duration."
                    }

                },

                errorPlacement: function (error, element) {

                    if (element.attr("name") == "gender") {

                        error.insertAfter("#form_gender_error");

                    } else if (element.attr("name") == "payment[]") {

                        error.insertAfter("#form_payment_error");

                    } else {

                        error.insertAfter(element);

                    }

                },

                invalidHandler: function (event, validator) {
                    success.hide();
                    Metronic.scrollTo(error, -200);

                },

                highlight: function (element) {

                    $(element)
                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');
                    $(element)
                        .closest('.col-md-4,.col-md-10').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-3,.col-md-10').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element)
                        .closest('.inputgroup').removeClass('has-error');
                    $(element)
                        .closest('.col-md-4,.col-md-10').removeClass('has-error');
                    $(element)
                        .closest('.col-md-3,.col-md-10').removeClass('has-error');

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
                    var ulrlength = countWords($('#txturlextension').val());
                    var format = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;


                    if (index == 1) {
                        if (form.valid() == false) {

                            form.validate();
                            return false;

                        }
                        else if (format.test($('#txturlextension').val())) {
                            $('#spandanger').html('URL Extension format not proper.')
                            $('.alert-danger').show();
                            Metronic.scrollTo($('.alert-danger'), -200);
                            $('.alert-danger').fadeOut(5000);

                            return false;
                        }
                        else if (ulrlength > 1) {
                            $('#spandanger').html('URL Extension should be only one word.')
                            $('.alert-danger').show();
                            Metronic.scrollTo($('.alert-danger'), -200);
                            $('.alert-danger').fadeOut(5000);

                            return false;
                        }
                        else {

                        }

                    }
                    else if (index == 2) {
                        if (form.valid() == false) {

                            form.validate();
                            return false;

                        }

                        else {
                            ins_updCustomer();


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


            }).hide();



            //unblock code

        }

    };

}();

function countWords(str) {
    return str.trim().split(/\s+/).length;
}


function fillCountryDropDown(dropdownID, countryid) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "CustomerRegistration/Country/?CountryID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function (data) {
            var appenddata;
            appenddata += "<option value=0>Select</option>";
            jQuery.each(data, function (key, value) {
                appenddata += "<option value = '" + value.countryID + "'>" + value.countryName + " </option>";

            });
            jQuery('#' + dropdownID).html(appenddata);
            if (countryid != '0') {
                jQuery('#' + dropdownID).val(countryid);
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
function fillStateDropDown(dropdownID, stateid) {

    var countryid = '0';
    if (dropdownID == "dropState") {
        if (jQuery('#dropCountry').val() != null) {
            countryid = jQuery('#dropCountry').val();
        }
    }

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "CustomerRegistration/State/?CountryID=" + countryid + "&StateID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function (data) {
            var appenddata;
            appenddata += "<option value='0'>Select</option>";

            jQuery.each(data, function (key, value) {
                appenddata += "<option value = '" + value.stateID + "'>" + value.stateName + " </option>";

            });
            jQuery('#' + dropdownID).html(appenddata);


            if (stateid != '0') {
                jQuery('#' + dropdownID).val(stateid);

            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
function fillCityDropDown(dropdownID, cityid) {
    var stateid = '0';
    var url = '';
    if (dropdownID == "dropCity") {

        if (jQuery('#dropState').val() != null) {
            stateid = jQuery('#dropState').val();
            url = (APIPath + "CustomerRegistration/City/?StateID= " + stateid + "&CityID=0");
        }

    }

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

            var appenddata;
            appenddata += "<option value='0'>Select</option>";
            jQuery.each(data, function (key, value) {
                appenddata += "<option value = '" + value.cityID + "'>" + value.cityName + " </option>";
            });
            jQuery('#' + dropdownID).html(appenddata);

            if (cityid != '0') {
                jQuery('#' + dropdownID).val(cityid);
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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

function FetchCurrency(CurrencyID) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchCurrency/?CurrencyID=" + CurrencyID + "&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
            jQuery("#dropcurrency").empty();
            jQuery("#dropcurrency").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#dropcurrency").append(jQuery("<option></option>").val(data[i].currencyId).html(data[i].currencyNm));

            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
function fetchALLmenuitems() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = APIPath + "RoleMenus/fetchALLMenus/?ActiveYNFlag=N&For=CustAdm&RoleID=0&CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&MenuType=0";

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

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
    jQuery.blockUI({ message: '<h5><img src="assets_1/layouts/layout/img/loading.gif" />  Please Wait...</h5>' });
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
                i = i + jQuery.parseJSON(data)[x].menuID;
                if (jQuery.parseJSON(data)[y].menuID == jQuery.parseJSON(data1)[x].parentMenuID) {

                    $('#childUL' + y).append("<li role='treeitem' id=j1_" + (y + x + i) + " class='jstree-node jstree-leaf'><div class='jstree-wholerow'></div><i class='jstree-icon jstree-ocl'></i>");
                    $('#j1_' + (y + x + i)).append("<a style='text-decoration:none' class='jstree-anchor' href='javascript:;'><input id=checkbox" + x + " name=checkbox" + x + "  type='checkbox' value=" + jQuery.parseJSON(data1)[x].menuID + " />&nbsp;&nbsp;" + jQuery.parseJSON(data1)[x].menuName + "</a></li>");

                }


            }
        }

    }

    jQuery.unblockUI();
}

sessionStorage.setItem("hdnCustomerID", 0)
sessionStorage.setItem("hdnAdminID", 0)
function ins_updCustomer() {

    var _cleanString = StringEncodingMechanism($('#txtcustomername').val());
    var _cleanString2 = StringEncodingMechanism($('#txtAddress1').val());
    var _cleanString3 = StringEncodingMechanism($('#txtadminfirstname').val());




    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var logo = '';
    var noofbids = ''; var state = 0; var city = 0; var pincode = 0;

    // Assuming the date string is in the format "MM/DD/YYYY" (e.g., "08/01/2023")
    var dateStringFrom = $("#from").val();
    var datePartsFrom = dateStringFrom.split(/[-T]/);
    var dtfrom = new Date(datePartsFrom[0], datePartsFrom[1] - 1, datePartsFrom[2]);

    var dateStringTo = $("#to").val();
    var datePartsTo = dateStringTo.split(/[-T]/);
    var dtto = new Date(datePartsTo[0], datePartsTo[1] - 1, datePartsTo[2]);

    if ($('#filepthterms').html() != '' && ($('#file1').val() == '')) {
        logo = jQuery('#filepthterms').html();
    } else {
        logo = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
    }

    var Cusstatus = "";
    if (jQuery("#checkboxcustomeractive").is(':checked')) {
        Cusstatus = "Y";
    }
    else {
        Cusstatus = "N";
    }
    if (jQuery("#chkboxadmin").is(':checked')) {
        adminstatus = "Y";
    }
    else {
        adminstatus = "N";
    }
    if ($('#chkIsunlimitedbids').is(':checked')) {
        noofbids = 0;
    }
    else {
        noofbids = $('#txtnobids').val();
    }
    if ($('#dropState').val() != "" && $('#dropState').val() != null) {
        state = $('#dropState').val()
    }
    if ($('#dropCity').val() != "" && $('#dropCity').val() != null) {
        city = $('#dropCity').val()
    }
    if ($('#pincode').val() != "" && $('#pincode').val() != null) {
        pincode = $('#pincode').val()
    }

    if (checkimageExtension(logo)) {
        var data = {
            //'CustomerName': $('#txtcustomername').val(),
            'CustomerName': _cleanString,
            //'CustomerAddress': $('#txtAddress1').val(),
            'CustomerAddress': _cleanString2,
            'CountryID': parseInt($('#dropCountry').val()),
            'StateID': parseInt(state),
            'CityID': parseInt(city),
            'PinCode': parseInt(pincode),
            'Website': $('#txtwebsite').val(),
            'PhoneNo': $('#phoneno').val(),
            //'AdminName': $('#txtadminfirstname').val(),
            'AdminName': _cleanString3,
            'AdminEmail': $('#txtUserEmailID').val(),
            'AdminMobile': $('#txtmobileNo').val(),
            'SubscriptionType': '',
            //'SubscriptionFrom': $('#from').val(),
            'SubscriptionFrom': dtfrom,
            //'SubscriptionTo': $('#to').val(),
            'SubscriptionTo': dtto,
            'CustomerID': parseInt(sessionStorage.getItem("hdnCustomerID")),
            'UserID': sessionStorage.getItem('UserID'),
            'AdminID': parseInt(sessionStorage.getItem("hdnAdminID")),
            'NoOfBid': parseInt(noofbids),
            "CustomerIsActive": Cusstatus,
            "AdminIsActive": adminstatus,
            "DefaultCurrency": parseInt($('#dropcurrency').val()),
            "LogoFileName": logo,
            "GeneralConditions": $('#txttermscondition').val(),
            "URLExtension": $('#txturlextension').val().trim()

        }
    }
    else {
        error.show();
        $('#spandanger').html('Please Select jpg/jpeg/png image...');
        Metronic.scrollTo(error, -200);
        error.fadeOut(3000);

        $('#file1').val('');
        jQuery.unblockUI();
        return false;

    }
    console.log(JSON.stringify(data))

    jQuery.ajax({
        url: APIPath + "CustomerRegistration/InsCustomerRegistration",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json",
        success: function (data) {

            if (data.isSuccess == '1') {
                sessionStorage.setItem("hdnCustomerID", data.customerID)
                sessionStorage.setItem("hdnAdminID", data.adminID)
                error.hide();
                success.hide();

                fileUploader($('#txturlextension').val())
                fnFetchMenusonRoleBased();
                return true;

            }
            else if (data.isSuccess == '2') {
                error.hide();
                success.hide();
                fnFetchMenusonRoleBased();
                return true;

            }
            else if (data.isSuccess == '-1') {

                success.hide();
                error.show();
                $('#spandanger').html("This Admin Email ID already exists..")
                Metronic.scrollTo(error, -200);
                error.fadeOut(9000);

                setTimeout(function () {
                    $('#form_wizard_1').bootstrapWizard('previous');
                }, 1000)

                return false;
            }

            else if (data.isSuccess == '0') {
                success.hide();
                error.show();
                error.fadeOut(7000);
                $('#spandanger').html("You have some error..")
                setTimeout(function () {
                    $('#form_wizard_1').bootstrapWizard('previous');
                }, 1000)
                return false;
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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

function resetregistrationForm() {
    sessionStorage.setItem("hdnCustomerID", "0")
    sessionStorage.setItem("hdnAdminID", "0")
    $('#btn_submit').html('Submit');

    $('#txttermscondition').val('');
    $('#dropcurrency').val('');
    $('#txtnobids').val('');
    $('#from').val('');
    $('#to').val('');
    $('#txtmobileNo').val('');
    $('#txtAddress1').val('');
    $('#txtUserEmailID').val('');
    $('#txtadminfirstname').val('');
    $('#txtwebsite').val('');
    $('#phoneno').val('');
    $('#divunlimitedbids').addClass('hide')
    jQuery('input:checkbox[name=chkIsunlimitedbids]').prop('checked', true);
    jQuery('#chkIsunlimitedbids').parents('div').addClass('checked');
    $('#pincode').val('');
    $('#txturlextension').val('');
    $('#dropCity').val('0');
    $('#dropState').val('0');
    $('#dropCountry').val('0');
    fillCountryDropDown('dropCountry', 0);
    $('#dropState').empty();
    $('#dropCity').empty();
    $('#dropState').append('<option value="">Select</option>');
    $('#dropCity').append('<option value="">Select</option>');

}
function FetchAllCustomer() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/FetchCustomerDetails/?CustomerID=0&IsActive=Y",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {

                sessionStorage.setItem('hdnAllCustomers', JSON.stringify(data))
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
    jQuery.unblockUI();

}
jQuery("#txtcustomername").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllCustomers');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.customerName] = username;
            usernames.push(username.customerName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].customerID != '0') {

            sessionStorage.setItem('hdnCustomerID', map[item].customerID);
            fetchCustomerDetails(map[item].customerID);
        }
        else {
            gritternotification('Please select correct Customer  for Editing Details!!!');

        }
        return item;
    }

});
jQuery("#txtcustomername").keyup(function () {
    sessionStorage.setItem('hdnCustomerID', '0');
    resetregistrationForm();
});
function fetchCustomerDetails(customerid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/FetchCustomerDetails/?CustomerID=" + customerid + "&IsActive=Y",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                sessionStorage.setItem("hdnCustomerID", data[0].customerID)
                sessionStorage.setItem("hdnAdminID", data[0].adminID)
                $('#txtcustomername').val(StringDecodingMechanism(data[0].customerName));
                $('#txttermscondition').val(data[0].generalConditions);
                $('#dropcurrency').val(data[0].defaultCurrency);
                $('#txtnobids').val(data[0].noOfBid);
                $('#from').val(data[0].subscriptionFrom);
                $('#to').val(data[0].subscriptionTo);
                $('#txtmobileNo').val(data[0].adminMobile);
                $('#txtAddress1').val(StringDecodingMechanism(data[0].customerAddress));
                $('#txtUserEmailID').val(data[0].adminEmail);
                $('#txtadminfirstname').val(StringDecodingMechanism(data[0].adminName));
                $('#txtwebsite').val(data[0].website);
                $('#txturlextension').val(data[0].urlExtension);
                $('#phoneno').val(data[0].phoneNo);

                $('#pincode').val(data[0].pinCode);

                $('#dropCountry').val(data[0].countryID);
                fillStateDropDown('dropState', '0')
                setTimeout(function () {

                    $('#dropState').val(data[0].stateID);
                    fillCityDropDown('dropCity', '0')
                }, 700)

                setTimeout(function () {
                    $('#dropCity').val(data[0].cityID);
                }, 1000)

                if (data[0].logoImageName != '') {
                    $('#file1').removeAttr('required')
                }
                $('#filepthterms').attr('href', data[0].logoImage).html(data[0].logoImageName);

                if (data[0].customerIsActive == "Y") {
                    jQuery('input:checkbox[name=checkboxcustomeractive]').attr('checked', true);

                    jQuery('#checkboxcustomeractive').parents('div').removeClass('bootstrap-switch-off');
                    jQuery('#checkboxcustomeractive').parents('div').addClass('bootstrap-switch-on');
                }
                else {
                    jQuery('input:checkbox[name=checkboxcustomeractive]').attr('checked', false);

                    jQuery('#checkboxcustomeractive').parents('div').removeClass('bootstrap-switch-on');
                    jQuery('#checkboxcustomeractive').parents('div').addClass('bootstrap-switch-off');
                }
                if (data[0].adminIsActive == "Y") {
                    jQuery('input:checkbox[name=chkboxadmin]').attr('checked', true);

                    jQuery('#chkboxadmin').parents('div').removeClass('bootstrap-switch-off');
                    jQuery('#chkboxadmin').parents('div').addClass('bootstrap-switch-on');
                }
                else {
                    jQuery('input:checkbox[name=chkboxadmin]').attr('checked', false);

                    jQuery('#chkboxadmin').parents('div').removeClass('bootstrap-switch-on');
                    jQuery('#chkboxadmin').parents('div').addClass('bootstrap-switch-off');
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
                fnErrorMessageText('spandanger', 'form-wizard');
            }
            jQuery.unblockUI();
            return false;
        }


    });


}
function fnFetchMenusonRoleBased() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var url = APIPath + "RoleMenus/fetchMenuCodeRoles/?UserID=" + sessionStorage.getItem("hdnAdminID") + "&CustomerID=" + sessionStorage.getItem("hdnCustomerID") + "&RoleID=0";
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

            var err = eval("(" + xhr.responseText + ")");
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
function fileUploader(CustomerName) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var fileTerms = $('#file1');
    var fileDataTerms = fileTerms.prop("files")[0];


    var formData = new window.FormData();

    formData.append("fileTerms", fileDataTerms);
    formData.append("AttachmentFor", "Customer");
    formData.append("CustomerName", CustomerName.trim());

    $.ajax({

        url: 'ConfigureFileAttachment.ashx',
        data: formData,
        processData: false,
        contentType: false,
        asyc: false,
        type: 'POST',
        success: function (data) {
            jQuery.unblockUI();
        },
        error: function () {

            bootbox.alert("Attachment error.");
            jQuery.unblockUI();
        }

    });

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
        "CustomerID": parseInt(sessionStorage.getItem("hdnCustomerID")),
        "UserID": parseInt(sessionStorage.getItem("hdnAdminID")),
        "RoleID": 0,
    };
    jQuery.ajax({
        url: APIPath + "RoleMenus/MapMenusRole/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data == '1') {
                bootbox.alert("Customer Regsitered Successfully.", function () {
                    sessionStorage.removeItem('hdnCustomerID');
                    sessionStorage.removeItem('hdnAdminID');
                    resetregistrationForm();
                    window.location = "RegisterCustomerRoleUser.html";
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

            var err = eval("(" + xhr.responseText + ")");
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