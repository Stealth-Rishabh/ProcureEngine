jQuery(document).ready(function () {
    jQuery("#btnsumbit").click(function () {

        dynamiccontrolvalidation();
    });
});

$('#txtUI,txtPanNo,#txtTINNo').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    //"Value cannot be {0}"
    "This field is required."
);
var _vendorId = "";
var FormValidation = function () {


    var ValidateParticipants = function () {
        var form1 = $('#entryForm');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);

        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                txtAddress: {
                    required: true
                },
                ParticipantName: {
                    required: true
                },
                ContactName: {
                    required: true
                },
                txtCity: {
                    required: true
                },
                txtZipCd: {
                    required: true
                },
                txtPanNo: {
                    required: true
                },
                txtTINNo: {
                    required: true
                },
                txtPhoneNo: {
                    required: true,
                    maxlength: 50,

                },
                txtMobileNo: {
                    required: true,
                    number: true,
                    maxlength: 50,
                },
                txtcompanyemail: {
                    required: true,
                    email: true
                },

                txteMailID: {
                    required: true,
                    email: true
                },
                txtAlternateeMailID: {
                    required: true,
                    email: true
                },
                ddlCountryCd: {
                    required: true,
                    notEqualTo: 0
                },
                ddlCountry: {
                    required: true,
                    notEqualTo: 0
                },
                ddlCountryCdPhone: {
                    required: true,
                    notEqualTo: 0
                },
                ddlState: {
                    required: true,
                    notEqualTo: 0
                },
                ddlCity: {
                    required: true,
                    notEqualTo: 0
                },
            },
            messages: {
                txtAddress: {
                    required: "Please enter company name"
                },
                ParticipantName: {
                    required: "Please enter the address"
                },
                txtCity: {
                    required: "Please enter city name"
                },

                txtPanNo: {
                    required: "Please enter pan no"
                },
                txtTINNo: {
                    required: "Please enter gst no"
                },
                txtPhoneNo: {
                    required: "Please enter phone no"
                },
                txtMobileNo: {
                    required: "Please enter mobile no"
                },
                txtcompanyemail: {
                    required: "Please enter company e-mail"
                },
                txtAlternateeMailID: {
                    required: "Please enter company e-mail"
                },
                ContactName: {
                    required: "Please enter contact person name"
                }

            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();

                App.scrollTo(error1, -300);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group

            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group


            },

            success: function (label) {
                label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group

            },

            submitHandler: function (form) {

                var flag = "T";


                if (validateVendorCategory() == 'false') {
                    jQuery('#spanerterr').text('Please select at least one Group')
                    jQuery('#divalerterr').slideDown('show');
                    App.scrollTo(jQuery('#divalerterr'), -200);
                    setTimeout(function () {

                        jQuery('#divalerterr').css('display', 'none');
                    }, 5000);
                }
                else {

                    if ($('#hdnFlagType').val() == "Extend") {
                        ExtendParticipants();
                    }
                    else {

                        RegisterParticipants();
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
            ValidateParticipants();
        }
    };

}();


function RegisterParticipants() {



    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";

    if (jQuery('#chkIsActiveparticipant').is(':checked') == true) {
        status = 'Y';
    }
    else {
        status = 'N';
    }
    var InsertQuery = '';
    $('.childchkbox').each(function () {
        if (this.checked) {
            InsertQuery = InsertQuery + $(this).val() + "#";
        }
    });

    if (InsertQuery == '') {

        $('#divalerterr').find('span').text('Please select atleast one group!');
        $('#divalerterr').slideDown('show');
        App.scrollTo(jQuery('#divalerterr'), -200);
        return false;
        setTimeout(function () {
            jQuery('#divalerterr').css('display', 'none');
        }, 5000);
    }
    var RegisterParticipants = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ParticipantID": parseInt(jQuery("#hdnParticipantID").val()),
        "ParticipantName": jQuery("#ParticipantName").val(),
        "Address": jQuery("#txtAddress").val(),
        "CountryID": parseInt(jQuery("#ddlCountry option:selected").val()),
        "CountryName": jQuery("#ddlCountry option:selected").text(),
        "StateID": parseInt(jQuery("#ddlState option:selected").val()),
        "StateName": jQuery("#ddlState option:selected").text(),
        "CityID": parseInt(jQuery("#ddlCity option:selected").val()),
        "CityName": jQuery("#ddlCity option:selected").text(),
        "ZipCode": jQuery("#txtZipCd").val(),
        "PanNo": jQuery("#txtPanNo").val(),
        "TinNo": jQuery("#txtTINNo").val(),
        "DialingCodePhone": parseInt(jQuery("#ddlCountryCdPhone option:selected").val()),
        "PhoneNo": jQuery("#txtPhoneNo").val(),
        "CompanyEmail": jQuery("#txtcompanyemail").val().trim().toLowerCase(),
        //New Check
        "PrefferedTZ": parseInt(jQuery("#ddlpreferredTime option:selected").val()),
        // "PrefferedTZ": parseInt(jQuery("#ddlpreferredTime").val().attr("selected", "selected")) ,
        "IsActive": status,
        "UserID": sessionStorage.getItem('UserID'),
        "DialingCode": parseInt(jQuery("#ddlCountryCd option:selected").val()),
        "MobileNo": jQuery("#txtMobileNo").val(),
        "ActionType": $('#hdnFlagType').val(),
        "ContactPerson": $('#ContactName').val(),
        "AlternateEmailID": $('#txtAlternateeMailID').val(),
        "ProductCatID": InsertQuery


    };

    //sessionStorage.setItem("timezoneid", parseInt(jQuery("#ddlpreferredTime option:selected").val()))
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RegParticpants_PEV2/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(RegisterParticipants),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {



            $("#hdnParticipantID").val(data.participantID)
            $("#hdnParticipantCode").val(data.vendorCode)


            if (data.isSuccess != '1' && data.isSuccess != '2') {
                fnshowexistedVendorForextend();
            }
            else {
                $('#divalertsucess').slideDown('show');
                App.scrollTo(jQuery('#divalertsucess'), -200);
                clearform();
            }
            setTimeout(function () {
                jQuery('#divalertsucess').css('display', 'none');
                jQuery('#divalerterr').css('display', 'none');
            }, 5000);
            fetchParticipantsVenderTable();
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', '');
            }
            jQuery.unblockUI();
            return false;
        }

    })

}
var dataforExistedEmailforExtend = "";
function fnshowexistedVendorForextend() {
    debugger
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/GetExsitedEmailIDVendor/?EmailID=" + jQuery("#txtcompanyemail").val().trim().toLowerCase() + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                if (data[0].encryptedVendorCreatedBy == sessionStorage.getItem('UserID')) {
                    $('#spanerterr').text("This email address is already registerd with another company.");
                    jQuery('#divalerterr').slideDown('show');
                    App.scrollTo(jQuery('#divalerterr'), -200);
                }
                else {
                    $('#divForexistVendor').modal('show')
                    $('#spnmsz').text("This email address is already registerd with following details.");
                    $('#tblforexistedVendor').empty();

                    if (data.length > 0) {
                        dataforExistedEmailforExtend = data;
                        $('#tblforexistedVendor').append("<thead><tr><th>VendorCode</th><th>Vendor</th><th>Contact Person</th><th>Mobile</th><th>EmailID</th><th class=hide></th></tr></thead><tbody>")
                        for (var i = 0; i < data.length; i++) {
                            addr1 = data[0].address1.replace(/\n/g, " ");
                            addr2 = data[0].address2.replace(/\n/g, " ");
                            //$('#tblforexistedVendor').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td class=hide><a href=\"#\"   onclick=\"ExtendVendor(\'" + data[i].vendorID + "'\,\'" + data[i].zipCode + "'\,\'" + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].phone + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs yellow \"><i class=\"fa fa-edit\"></i>Extend</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].phone + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");

                            $('#tblforexistedVendor').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td class=hide><a href=\"#\"   onclick=\"ExtendVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCodeMobile + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].prefferedTZ + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs yellow \"><i class=\"fa fa-edit\"></i>Extend</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCode + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");


                        }
                    }
                }
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', '');
            }
            jQuery.unblockUI();
            return false;
        }

    })

    setTimeout(function () {
        jQuery('#divalerterr').css('display', 'none');
    }, 5000);

}
var addr1 = "";
var addr2 = "";
function fnfetchDetailsforExtension() {
    var data = dataforExistedEmailforExtend;

    addr1 = data[0].address1.replace(/\n/g, " ");
    addr2 = data[0].address2.replace(/\n/g, " ");

    //  ExtendVendor(data[0].vendorID, data[0].zipCode, data[0].vendorName, data[0].contactPerson, data[0].emailID, data[0].phone, data[0].mobileNo, addr1, addr2, data[0].serviceTaxNo.toUpperCase(), data[0].isActive, data[0].panNo.toUpperCase(), data[0].buttonName, data[0].vendorCode, data[0].alternateEmailID, data[0].countryID, data[0].stateID, data[0].cityID)


    ExtendVendor(data[0].vendorID, data[0].vendorName, data[0].contactPerson, data[0].emailID, data[0].dialingCodePhone, data[0].phone, data[0].dialingCodeMobile, data[0].mobileNo, addr1, addr2, data[0].zipCode, data[0].serviceTaxNo.toUpperCase(), data[0].isActive, data[0].panNo.toUpperCase(), data[0].buttonName, data[0].vendorCode, data[0].alternateEmailID, data[0].countryID, data[0].stateID, data[0].prefferedTZ, data[0].cityID)
    $('#divForexistVendor').modal('hide')
}
function NotificationforExtendVendor() {
    bootbox.dialog({
        message: "Vendor is already Exists, Do you want to Extend for Your Company.",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    ExtendVendor('submit')
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {
                    return;
                }
            }
        }
    });

}

function validateDuplicateEmailId(elem) {
    if (elem.value == $("#txtcompanyemail").val()) {
        jQuery('#spanerterr').text('Comapny email id should be different from email id used in forward/reverse auction.')
        jQuery('#divalerterr').slideDown('show');
        App.scrollTo(jQuery('#divalerterr'), -200);
        elem.value = '';
        setTimeout(function () {

            jQuery('#divalerterr').css('display', 'none');
        }, 3000);
    }
}

function validateVendorGroup(ctrl, categoryId) {
    if (jQuery(ctrl).is(':checked') == true) {

        jQuery(ctrl).closest('div#uniform-chkbidTypes').find('span#spancheckedvendorgroup').attr('class', 'checked');

    } else {
        jQuery(ctrl).closest('div#uniform-chkbidTypes').find('span#spancheckedvendorgroup').attr('class', '');
    }
}

function fetchParticipantsVenderTable() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/fetchParticipantsVender_PEV2/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&CreatedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Venderdata) {


            jQuery("#tblParticipantsVender > tbody").empty();
            if (Venderdata.length > 0) {
                vendorsForAutoComplete = Venderdata;
                jQuery.each(Venderdata, function (key, value) {
                    var str = "";
                    var addr1 = (value.address).replace(/\n/g, " ");

                    var addr2 = (value.cityName).replace(/\n/g, " ");
                    if (value.mapBtnRequired == 'N') {
                        str = "<tr><td style=\"text-align:center;width:10%!important;\">";
                        if (sessionStorage.getItem('UserID') == value.createdBy) {

                            if (value.actionType == "EditVendor") {


                                str += "<a href=\"#\"   onclick =\"EditVendor(\'" + value.participantID + "'\,\'" + value.participantName + "'\,\'" + value.contactPerson + "'\,\'" + value.companyEmail + "'\,\'" + value.dialingCodePhone + "'\,\'" + value.phoneNo + "'\,\'" + value.dialingCode + "'\,\'" + value.mobileNo + "'\,\'" + encodeURIComponent(addr1) + "'\,\'" + encodeURIComponent(addr2) + "'\,\'" + value.zipCode + "'\,\'" + value.tinNo + "'\,\'" + value.isActive + "'\,\'" + value.panNo + "'\,\'" + value.actionType + "'\,\'" + value.vendorCode + "'\,\'" + value.alternateEmailID + "'\,\'" + value.countryID + "'\,\'" + value.stateID + "'\,\'" + value.prefferedTZ + "'\,\'" + value.cityID + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a></td>";
                                str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                                str += "<td style=\"width:10%!important;\">No</td>";

                            }
                            else {
                                str += "<a href=\"#\"   onclick =\"EditVendor(\'" + value.participantID + "'\,\'" + value.participantName + "'\,\'" + value.contactPerson + "'\,\'" + value.companyEmail + "'\,\'" + value.dialingCodePhone + "'\,\'" + value.phoneNo + "'\,\'" + value.dialingCode + "'\,\'" + value.mobileNo + "'\,\'" + encodeURIComponent(addr1) + "'\,\'" + encodeURIComponent(addr2) + "'\,\'" + value.zipCode + "'\,\'" + value.tinNo + "'\,\'" + value.isActive + "'\,\'" + value.panNo + "'\,\'" + value.actionType + "'\,\'" + value.vendorCode + "'\,\'" + value.alternateEmailID + "'\,\'" + value.countryID + "'\,\'" + value.stateID + "'\,\'" + value.prefferedTZ + "'\,\'" + value.cityID + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a></td>";
                                str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                                str += "<td style=\"width:10%!important;\">Yes</td>";

                            }
                        }
                        else {
                            if (value.actionType == "EditVendor") {
                                //str += "<a href=\"#\"   class=\"btn btn-xs grey\">Not Editable</a>&nbsp;&nbsp;";
                                // str += "<a href=\"#\"   onclick =\"EditVendor(\'" + value.participantID + "'\,\'" + value.zipCode + "'\,\'"  + value.participantName + "'\,\'" + value.contactPerson + "'\,\'" + value.companyEmail + "'\,\'" + value.phoneNo + "'\,\'" + value.mobileNo + "'\,\'" + encodeURIComponent(addr1) + "'\,\'" + encodeURIComponent(addr2) + "'\,\'" + value.tinNo + "'\,\'" + value.isActive + "'\,\'" + value.panNo + "'\,\'EditCustomerVendor'\,\'" + value.vendorCode + "'\,\'" + value.alternateEmailID + "'\,\'" + value.countryID + "'\,\'" + value.stateID + "'\,\'" + value.cityID + "'\,\'" + value.dialingCode + "'\,\'" + value.dialingCodePhone + "'\)\" class=\"btn btn-xs green\"><i class=\"fa fa-edit\"></i>Partial Edit</a></td>";
                                //abheedev
                                str += "<a href=\"#\"   onclick =\"EditVendor(\'" + value.participantID + "'\,\'" + value.participantName + "'\,\'" + value.contactPerson + "'\,\'" + value.companyEmail + "'\,\'" + value.dialingCodePhone + "'\,\'" + value.phoneNo + "'\,\'" + value.dialingCode + "'\,\'" + value.mobileNo + "'\,\'" + encodeURIComponent(addr1) + "'\,\'" + encodeURIComponent(addr2) + "'\,\'" + value.zipCode + "'\,\'" + value.tinNo + "'\,\'" + value.isActive + "'\,\'" + value.panNo + "'\,\'EditCustomerVendor'\,\'" + value.vendorCode + "'\,\'" + value.alternateEmailID + "'\,\'" + value.countryID + "'\,\'" + value.stateID + "'\,\'" + value.prefferedTZ + "'\,\'" + value.cityID + "'\)\" class=\"btn btn-xs green\"><i class=\"fa fa-edit\"></i>Partial Edit</a></td>";
                                //abheedev
                                str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                                str += "<td style=\"width:10%!important;\">No</td>";

                            }
                            else {
                                // str += "<a href=\"#\"   onclick =\"EditVendor(\'" + value.participantID + "'\,\'" + value.zipCode + "'\,\'" + value.participantName + "'\,\'" + value.contactPerson + "'\,\'" + value.companyEmail + "'\,\'" + value.phoneNo + "'\,\'" + value.mobileNo + "'\,\'" + encodeURIComponent(addr1) + "'\,\'" + encodeURIComponent(addr2) + "'\,\'" + value.tinNo + "'\,\'" + value.isActive + "'\,\'" + value.panNo + "'\,\'" + value.actionType + "'\,\'" + value.vendorCode + "'\,\'" + value.alternateEmailID + "'\,\'" + value.countryID + "'\,\'" + value.stateID + "'\,\'" + value.cityID + "'\,\'" + value.dialingCode + "'\,\'" + value.dialingCodePhone + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a></td>";
                                str += "<a href=\"#\"   onclick =\"EditVendor(\'" + value.participantID + "'\,\'" + value.participantName + "'\,\'" + value.contactPerson + "'\,\'" + value.companyEmail + "'\,\'" + value.dialingCodePhone + "'\,\'" + value.phoneNo + "'\,\'" + value.dialingCode + "'\,\'" + value.mobileNo + "'\,\'" + encodeURIComponent(addr1) + "'\,\'" + encodeURIComponent(addr2) + "'\,\'" + value.zipCode + "'\,\'" + value.tinNo + "'\,\'" + value.isActive + "'\,\'" + value.panNo + "'\,\'" + value.actionType + "'\,\'" + value.vendorCode + "'\,\'" + value.alternateEmailID + "'\,\'" + value.countryID + "'\,\'" + value.stateID + "'\,\'" + value.prefferedTZ + "'\,\'" + value.cityID + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a></td>";
                                str += "<td style=\"width:10%!important;\">External</td>";
                                str += "<td style=\"width:10%!important;\">Yes</td>";

                            }
                        }
                    }
                    else if (value.mapBtnRequired == 'Y') {
                        str = "<tr><td style=\"text-align:right;width:10%!important;\">";
                        str += "<a href=\"javascript:;\"  onclick=\"MapCategory(this)\" class=\"btn btn-xs green\"><i class=\"fa fa-edit\"></i>Map</a><a href=\"#\" href=\"#\"  onclick=\"EditProduct(this)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a></td>";
                    }
                    str += "<td style=\"display:none;\">" + value.participantID + "</td><td style=\"width:10%!important;color:darkblue!important;font:bold;cursor:pointer;\" class=bold onclick =\"fnViewDetails(\'0'\,\'" + value.participantID + "'\)\">" + value.participantName + "</td><td style=\"width:10%!important;\">" + value.contactPerson + "</td><td style=\"width:10%!important;\">" + value.address + "</td><td style=\"width:5%!important;\">" + value.cityName + "</td><td style=\"width:10%!important;\">" + value.panNo.toUpperCase() + "</td><td style=\"width:10%!important;\">" + value.tinNo.toUpperCase() + "</td><td style=\"width:20%!important;\">" + value.mobileNo + "</td><td style=\"width:20%!important;\">" + value.phoneNo + "</td><td style=\"width:10%!important;\">" + value.companyEmail + "</td><td style=\"width:10%!important;\">" + value.alternateEmailID + "</td>";
                    str += "<td style=\"width:5%!important;\">" + value.isActive + "</td>";
                    str += "</td></tr>";
                    jQuery('#tblParticipantsVender > tbody').append(str);
                });
            }
            else {
                jQuery('#tblParticipantsVender > tbody').append("<tr><td colspan='12' style='text-align: center; color:red;'>No Participant found</td></tr>");
            }
            fetchParticipantsparked();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
function fetchParticipantsparked() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/fetchParticipantsparkedVender_PEV2/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&CreatedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Venderdata) {

            jQuery("#tblParticipantsparked > tbody").empty();

            if (Venderdata.length > 0) {

                jQuery.each(Venderdata, function (key, value) {
                    var str = "";

                    // var addr2 = (value.cityName).replace(/\n/g, " ");
                    str = "<tr><td style=\"text-align:center;width:10%!important;\">";
                    str += "<a href=\"#\" target=_blank  onclick =\"fnApprove_reject(\'" + value.linkURL + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Action</a></td>";
                    str += "<td style=\"display:none;\">" + value.participantID + "</td><td class=bold style=\"width:10%!important;color:darkblue!important;cursor:pointer\" onclick =\"fnViewDetails(\'" + value.participantID + "'\,\'0'\)\" >" + value.participantName + "</td><td style=\"width:10%!important;\">" + value.contactPerson + "</td><td style=\"width:10%!important;\">" + value.address + "</td><td style=\"width:5%!important;\">" + value.cityName + "</td><td style=\"width:10%!important;\">" + value.panNo.toUpperCase() + "</td><td style=\"width:10%!important;\">" + value.tinNo.toUpperCase() + "</td><td style=\"width:20%!important;\">" + value.mobileNo + "</td><td style=\"width:20%!important;\">" + value.phoneNo + "</td><td style=\"width:10%!important;\">" + value.companyEmail + "</td><td style=\"width:10%!important;\">" + value.alternateEmailID + "</td>";
                    str += "</td></tr>";
                    jQuery('#tblParticipantsparked > tbody').append(str);
                });
            }
            else {
                jQuery('#tblParticipantsparked > tbody').append("<tr><td colspan='12' style='text-align: center; color:red;'>No Participant found</td></tr>");
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
function fnViewDetails(tmpvendorid, vendorid) {
    $('#viewalldetails').modal('show')
    sessionStorage.setItem('tmpVendorID', tmpvendorid)
    fetchVendorRegistrationDetails(tmpvendorid, vendorid);

}
function fetchVendorRegistrationDetails(tmpvendorid, vendorid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchVendorRequest?tmpVendorID=" + tmpvendorid + "&VendorID=" + vendorid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (json) {

            var companydetails = JSON.parse(json[0].jsondata);
            if (json.length > 1) {

                var categorydetails = JSON.parse(json[1].jsondata);
                //var categoryresult = categorydetails.map(function (val) {
                //    selectedValues.push(val.CategoryID);
                //});
                //$("#ddlTypeofProduct").select2().val(selectedValues).trigger("change");

            }
            _vendorId = companydetails[0].VendorID;
            sessionStorage.setItem('tmpVendorID', companydetails[0].tmpVendorID);
            if (companydetails[0].PM[0].paymentTerm != "" && companydetails[0].PM[0].paymentTerm != null && companydetails[0].PM[0].paymentTerm != undefined) {
                jQuery('#paymentterms').html(companydetails[0].PM[0].paymentTerm);
            }
            else {
                jQuery('#paymentterms').html();
            }

            if (companydetails[0].VendorCode != "" && companydetails[0].VendorCode != null && companydetails[0].VendorCode != undefined) {
                $('#hdnvendorCode').val(companydetails[0].VendorCode);
                $('#spnvendorcode').text(companydetails[0].VendorCode)
            } else {
                var vendorCode = '';
                $('#hdnvendorCode').val(vendorCode);
                $('#spnvendorcode').text('')
            }

            if (companydetails[0].GSTFile != "" && companydetails[0].GSTFile != null && companydetails[0].GSTFile != undefined) {
                $('#gstattach').show();
                $('#gstattach').html(companydetails[0].GSTFile);

            } else {

                $('#gstattach').hide();
            }

            if (companydetails[0].PANFile != "" && companydetails[0].PANFile != null && companydetails[0].PANFile != undefined) {
                $('#panattach').show();
                $('#panattach').html(companydetails[0].PANFile);

            } else {

                $('#panattach').hide();
            }

            if (companydetails[0].MSMEFile != "" && companydetails[0].MSMEFile != null && companydetails[0].MSMEFile != undefined) {
                $('#msmeattach').show();
                $('#msmeattach').html(companydetails[0].MSMEFile);

            } else {

                $('#msmeattach').hide();
            }

            if (companydetails[0].cancelledCheck != "" && companydetails[0].cancelledCheck != null && companydetails[0].cancelledCheck != undefined) {
                $('#checkattach').show();
                $('#checkattach').html(companydetails[0].cancelledCheck);

            } else {

                $('#checkattach').hide();
            }

            if (companydetails[0].MSMECheck == 'Y') {
                $('.hideInput').removeClass('hide');
            } else {
                $('.hideInput').addClass('hide');
            }

            if (companydetails[0].GSTClass == 0) {
                var gstclass = '';
            } else {
                var gstclass = companydetails[0].GSTClass;
            }

            if (companydetails[0].PreviousTurnover != "" && companydetails[0].PreviousTurnover != null && companydetails[0].PreviousTurnover != undefined) {
                jQuery('#lastFY').html(companydetails[0].currencyLastFY + ' ' + companydetails[0].PreviousTurnover);
            }
            else {
                jQuery('#lastFY').html();
            }

            if (companydetails[0].SecondLastTurnover != "" && companydetails[0].SecondLastTurnover != null && companydetails[0].SecondLastTurnover != undefined) {
                jQuery('#seclastFY').html(companydetails[0].currencyLast2FY + ' ' + companydetails[0].SecondLastTurnover);
            }
            else {
            }


            if (companydetails[0].pinCode != "" && companydetails[0].pinCode != null && companydetails[0].pinCode != undefined) {
                jQuery('#pincode').html(companydetails[0].pinCode);
            }
            else {
                jQuery('#pincode').html('');
            }


            jQuery('#gstvendorclass').html(gstclass);
            jQuery('#ddlTypeofproduct').html(categorydetails);
            jQuery('#gstno').html(companydetails[0].ServiceTaxNo);
            jQuery('#natureofest').html(companydetails[0].EstName);
            jQuery('#vendortype').html(companydetails[0].VendorCatName);
            jQuery('#product').html(companydetails[0].product);
            jQuery('#companyname').html(companydetails[0].VendorName);
            jQuery('#address').html(companydetails[0].Address1);
            jQuery('#country').html(companydetails[0].CountryName);
            jQuery('#state').html(companydetails[0].StateName);
            jQuery('#city').html(companydetails[0].CityName);
            //jQuery('#pincode').html(companydetails[0].pincode);
            jQuery('#panno').html(companydetails[0].PANNo);
            jQuery('#panfilename').html(companydetails[0].PANFile);
            jQuery('#TDStype').html(companydetails[0].TDSTypeName);
            jQuery('#tanno').html(companydetails[0].TAN);
            jQuery('#bankname').html(companydetails[0].BankName);
            jQuery('#bankaccountno').html(companydetails[0].BankAccount);
            jQuery('#ifsccode').html(companydetails[0].IFSCCode);
            jQuery('#accountholdername').html(companydetails[0].AccountName);
            jQuery('#primaryname').html(companydetails[0].ContactPerson);
            jQuery('#primarymobile').html(companydetails[0].MobileNo);
            jQuery('#primaryemail').html(companydetails[0].EmailID);
            jQuery('#altname').html(companydetails[0].ContactNameAlt);
            jQuery('#altmobile').html(companydetails[0].Phone);
            jQuery('#altemail').html(companydetails[0].AlternateEmailID);
            jQuery('#msme').html(companydetails[0].MSMECheck);
            jQuery('#msmeclass').html(companydetails[0].MSMEType);
            jQuery('#msmeno').html(companydetails[0].MSMENo);
            jQuery('#msmeattach').html(companydetails[0].MSMEFile);
            jQuery('#txtLastFiscalyear').html(companydetails[0].PreviousTurnoverYear);
            jQuery('#SecondLastTurnoverYear').html(companydetails[0].SecondLastTurnoverYear);
            jQuery.unblockUI();
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

}
function fnApprove_reject(linkurl) {
    window.open(linkurl);

}
$('#txtcompanyemail').on('keyup', function () {

    var newVal = $(this).val();
    $('#txtAlternateeMailID').val(newVal)

})

function EditProduct(ctrl) {
    clearform()
    jQuery("#ParticipantName").val(jQuery(ctrl).closest('tr').find("td").eq(3).html());
    jQuery("#ContactName").val(jQuery(ctrl).closest('tr').find("td").eq(4).html());
    jQuery("#ParticipantName").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#txtAddress").val(jQuery(ctrl).closest('tr').find("td").eq(5).text());
    jQuery("#txtAddress").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#txtCity").val(jQuery(ctrl).closest('tr').find("td").eq(6).html());
    jQuery("#txtCity").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#txtPanNo").val(jQuery(ctrl).closest('tr').find("td").eq(7).html());
    jQuery("#txtPanNo").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#txtTINNo").val(jQuery(ctrl).closest('tr').find("td").eq(8).html());
    jQuery("#txtTINNo").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#txtPhoneNo").val(jQuery(ctrl).closest('tr').find("td").eq(9).html());
    jQuery("#txtPhoneNo").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#txtcompanyemail").val(jQuery(ctrl).closest('tr').find("td").eq(10).html());
    jQuery("#txtcompanyemail").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#txtAlternateeMailID").val(jQuery(ctrl).closest('tr').find("td").eq(11).html());
    jQuery("#txtAlternateeMailID").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#ddlpreferredTime").val(jQuery(ctrl).closest('tr').find("td").eq(10).html());
    jQuery("#ddlpreferredTime").closest('.form-group').removeClass('has-error').find('span').hide()
    var VendorID = jQuery(ctrl).closest('tr').find("td").eq(2).html();
    $('#hdnParticipantID').val(VendorID);

    fetchMapCategory('Z', VendorID);


}
$('#chkalternatemail').on('click', function (e) {//ifChanged

    if ($('#chkalternatemail').is(':checked')) {

        $('#txtAlternateeMailID').val('')
        $('#txtAlternateeMailID').removeAttr('disabled');
    }
    else {
        $('#txtAlternateeMailID').val($('#txtcompanyemail').val())
        $('#txtAlternateeMailID').attr('disabled', 'disabled');
    }
})

var vendorsForAutoComplete;
function fetchMapCategory(categoryFor, vendorId) {


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=" + categoryFor + "&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VendorID=" + vendorId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#tblCategoryMaster").empty();

            var count = 3;
            var str = '';
            if (data.length > 0) {
                CategoryForAutoComplete = data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].checked == 'Y') {
                        str += '<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span class="checked"  id=\"spancheckedvendorgroup\"><input class=\"childchkbox\" type=\"checkbox\" style=\"cursor:pointer\"  onchange=\"validateVendorGroup(this, ' + data[i].categoryID + ')\" value=\'' + data[i].categoryID + '\' checked /></span></div></td><td>' + data[i].categoryName + '</td></tr>';
                    } else {
                        str += '<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spancheckedvendorgroup\"><input class=\"childchkbox\" type=\"checkbox\" style=\"cursor:pointer\"  onchange=\"validateVendorGroup(this,' + data[i].categoryID + ')\" value=\'' + data[i].categoryID + '\'  /></span></div></td><td>' + data[i].categoryName + '</td></tr>';
                    }
                }
                jQuery("#tblCategoryMaster").append(str);
            }
            else {
                jQuery("#tblCategoryMaster").append('<tr><td>No Information is there..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', '');
            }
            jQuery.unblockUI();
            return false;
        }

    });
}
var CategoryForAutoComplete;
sessionStorage.setItem('hdnCategoryGrpID', 0);
jQuery("#txtsearchcat").typeahead({
    source: function (query, process) {
        var data = CategoryForAutoComplete
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.categoryName] = username;
            usernames.push(username.categoryName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].categoryID != "0") {
            sessionStorage.setItem('hdnCategoryGrpID', map[item].categoryID);

        }
        else {
            gritternotification('Please select Group Category  properly!!!');
        }

        return item;
    }

});
sessionStorage.setItem('hdnVendorID', 0);

jQuery("#txtsearchvendor").typeahead({
    source: function (query, process) {
        var data = vendorsForAutoComplete
        var vname = '';
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            vname = username.participantName + ' (' + username.companyEmail + ')'
            map[vname] = username;
            usernames.push(vname);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].participantID != "0") {
            sessionStorage.setItem('hdnVendorID', map[item].participantID);

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});

$('#Advancesearch').on("hidden.bs.modal", function () {
    clearsearchmodal();
    $('#div_table').addClass('hide');
})
function clearsearchmodal() {
    sessionStorage.setItem('hdnCategoryGrpID', 0);
    sessionStorage.setItem('hdnVendorID', 0);
    jQuery("#txtsearchvendor").val('');
    jQuery("#txtsearchcat").val('');
}

jQuery("#txtSearchalldetails").keyup(function () {

    jQuery("#tbldetails tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#txtSearchalldetails').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tbldetails tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tbldetails tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});


$('div#divisactive').on('change', '.has-error', function () {
    if ($(this).find('input[type=text]').val() == '') {
        $(this).find('span').show();
        $(this).addClass('has-error');
    }
    else {
        $(this).find('span').hide();
        $(this).removeClass('has-error');
    }
});
function ValidateVendor() {
    var chkstatus = "false";
    var i = 0;
    $('div#divbidtypecontend').each(function (index) {

        if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            chkstatus = 'True';

        }

    });

    return chkstatus;

}

function validateVendorCategory() {
    var chkstatus = "false";
    var i = 0;


    $("#tblCategoryMaster> tbody > tr").each(function (index) {

        if ($(this).find("span#spancheckedvendorgroup").attr('class') == 'checked') {
            chkstatus = 'true';
        }

    });

    return chkstatus;

}

function dynamiccontrolvalidation() {
    var status = "True";

    return status;
}

jQuery("#txtSearch").keyup(function () {
    _this = this;

    jQuery.each($("#tblParticipantsVender tbody").find("tr"), function () {
        //console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});
jQuery("#txtSearchparked").keyup(function () {
    _this = this;

    jQuery.each($("#tblParticipantsparked tbody").find("tr"), function () {
        //console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});
//function MapVendorCategories() {

//    var InsertQuery = '';

//    $('.childchkbox').each(function() {
//        if (this.checked) {
//           // InsertQuery = InsertQuery + "select " + $(this).val() + "," + $("#hdnParticipantID").val() + "," + sessionStorage.getItem('CustomerID') + ",PE.Decrypt('" + UserID + "'),PE.FN_Now() union all ";
//            InsertQuery = InsertQuery + $(this).val() + "#";
//        }

//    });

//    if (InsertQuery == '') {

//        jQuery('#divalerterr').find('span').text('Please select atleast one group!');
//        jQuery('#divalerterr').slideDown('show');
//        App.scrollTo(jQuery('#divalerterr'), -200);
//        return false;
//        setTimeout(function() {
//            jQuery('#divalerterr').css('display', 'none');
//        }, 5000);
//    }


//    var MapParticipants = {
//        "CustomerID":parseInt(sessionStorage.getItem('CustomerID')),
//        "InsertQuery": InsertQuery,
//        "UserID": sessionStorage.getItem('UserID'),
//        "VendorID": parseInt($("#hdnParticipantID").val())

//    };
//    //console.log(JSON.stringify(MapParticipants))
//   // alert(JSON.stringify(MapParticipants))
//    jQuery.ajax({
//        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/MapParticpantsCategory/",
//        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
//        type: "POST",
//        data: JSON.stringify(MapParticipants),
//        contentType: "application/json; charset=utf-8",
//        success: function(data, status, jqXHR) {

//        //if (data == '1') {
//            jQuery('#divalertsucess').slideDown('show');
//            App.scrollTo(jQuery('#divalertsucess'), -200);
//            fetchParticipantsVenderTable();
//            clearform();
//        // }
//            //else {

//            //    jQuery('#divalerterr').slideDown('show');
//            //    App.scrollTo(jQuery('#divalerterr'), -200);
//            // }
//            setTimeout(function() {
//                jQuery('#divalertsucess').css('display', 'none');
//                jQuery('#divalerterr').css('display', 'none');

//            }, 5000);

//        },
//        error: function (xhr, status, error) {

//            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
//            if (xhr.status == 401) {
//                error401Messagebox(err.Message);
//            }
//            else {
//                fnErrorMessageText('spanerterr', '');
//            }
//            jQuery.unblockUI();
//            return false;
//        }

//    });
//}

jQuery("#txtSearchCategory").keyup(function () {

    jQuery("#tblCategoryMaster tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#txtSearchCategory').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblCategoryMaster tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tblCategoryMaster tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});

jQuery("#ParticipantName").typeahead({
    source: function (query, process) {
        var data = vendorsForAutoComplete
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.participantName] = username;
            usernames.push(username.participantName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].participantID != "0") {

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});

function validatePanNumber(pan) {
    clearform();
    fnfetchfoundVendors();

}
function fnfetchfoundVendors() {

    var UniqueId = "";
    if ($('#txtUI').val() == null || $('#txtUI').val() == undefined || $('#txtUI').val() == "") {
        //UINo = $('#txtUI').val()
        if ($('#ddlUI').val().toLowerCase() == "servicetaxno") {
            UniqueId = "GST No."
        }
        else {
            UniqueId = "PE Vendor Code"
        }
        jQuery('#spanerterr').text('Please Enter ' + UniqueId + ' then Proceed to Search.')
        jQuery('#divalerterr').slideDown('show');
        App.scrollTo(jQuery('#divalerterr'), -200);
        $('#ddlUI').addClass('has-error')
    }

    else {
        //alert(sessionStorage.getItem("APIPath") + "RegisterParticipants/GetVendors/?FieldName=" + $('#ddlUI').val() + "&FieldValue=" + $('#txtUI').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'))
        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "RegisterParticipants/GetVendors/?FieldName=" + $('#ddlUI').val() + "&FieldValue=" + $('#txtUI').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {


                if ($('#txtUI').val().length == "15" && $('#ddlUI').val().toLowerCase() == "servicetaxno") {

                    $('#divVendorForm').removeClass('hide')
                    $('#div_tableVendor').removeClass('hide');
                }

                else if ($('#txtUI').val().length == "11" && $('#ddlUI').val().toLowerCase() == "vendorcode" && $('#txtUI').val().substring(0, 2).toLowerCase() == "vd" && $('#txtUI').val() != "") {
                    $('#divVendorForm').removeClass('hide')
                    $('#div_tableVendor').removeClass('hide');
                }

                $('#tblVendorFoundDetails').empty();
                var addr1 = "";
                var addr2 = "";
                if (data.length > 0) {

                    $('#tblVendorFoundDetails').append("<thead><tr><th>VendorCode</th><th>Vendor</th><th>Contact Person</th><th>Mobile</th><th>EmailID</th><th></th></tr></thead><tbody>")
                    for (var i = 0; i < data.length; i++) {

                        addr1 = data[i].address1.replace(/\n/g, " ");
                        addr2 = data[i].address2.replace(/\n/g, " ");
                        // alert(data[i].buttonName)
                        if (data[i].buttonName == "Extend") {

                            // $('#tblVendorFoundDetails').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td><a href=\"#\"   onclick=\"ExtendVendor(\'" + data[i].vendorID + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].phone + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Extend</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].phone + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");

                            $('#tblVendorFoundDetails').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td><a href=\"#\"   onclick=\"ExtendVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCodeMobile + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].prefferedTZ + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Extend</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCode + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");

                        }
                        else {
                            if (data[i].buttonName.toLowerCase() == "editcustomervendor") {

                                //  $('#tblVendorFoundDetails').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td><a href=\"#\"   onclick=\"EditVendor(\'" + data[i].vendorID + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].phone + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID +"'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + + data[i].zipCode + "'\,\'" +data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].phone + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");
                                $('#tblVendorFoundDetails').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td><a href=\"#\"   onclick=\"EditVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCodeMobile + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].prefferedTZ + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a>&nbsp;<a href=\"#\"  onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCode + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");

                            }
                            else {

                                //$('#tblVendorFoundDetails').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td><a href=\"#\"   onclick=\"EditVendor(\'" + data[i].vendorID + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].phone + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].phone + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");
                                $('#tblVendorFoundDetails').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td><a href=\"#\"   onclick=\"EditVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCodeMobile + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].prefferedTZ + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a>&nbsp;<a href=\"#\"  onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCode + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");

                            }
                        }
                    }
                }
                else {

                    if ($('#ddlUI').val() == "PanNo") {
                        $('#txtPanNo').val($('#txtUI').val().toUpperCase())
                        $('#txtPanNo').attr('disabled', 'disabled')
                    }
                    else {
                        var pan = $('#txtUI').val().substr(2, 10); //11
                        $('#txtPanNo').val(pan.toUpperCase());
                        $('#txtTINNo').val($('#txtUI').val().toUpperCase())
                        $('#txtPanNo').attr('disabled', 'disabled')
                        $('#txtTINNo').attr('disabled', 'disabled')
                    }

                }
            },
            error: function (xhr, status, error) {
                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spanerterr', '');
                }
                jQuery.unblockUI();
                return false;
            }

        })


    }
    setTimeout(function () {
        jQuery('#divalerterr').css('display', 'none');
    }, 5000);
}
function AddVendor() {

    clearform();
    $('#divVendorForm').removeClass('hide')
    $('#ParticipantName').removeAttr('disabled')
    $('#ContactName').removeAttr('disabled')
    $('#txtAddress').removeAttr('disabled')
    // $('#txtCity').removeAttr('disabled')
    $('#txtPanNo').removeAttr('disabled')
    $('#txtTINNo').removeAttr('disabled')
    $('#ddlCountryCdPhone').removeAttr('disabled')
    $('#txtPhoneNo').removeAttr('disabled')
    $('#ddlCountryCd').removeAttr('disabled')
    $('#txtMobileNo').removeAttr('disabled')
    $('#txtcompanyemail').removeAttr('disabled')
    $('#chkalternatemail').removeAttr('disabled')
    $('#ddlCountry').removeAttr('disabled')
    $('#ddlState').removeAttr('disabled')
    $('#ddlCity').removeAttr('disabled')
    //$('#txtAlternateeMailID').removeAttr('disabled')
    jQuery("#ContactName").removeAttr('disabled')
    $('#lbl_panmsz').addClass('hide');
    $('#hdnParticipantID').val('0');

    if ($('#ddlUI').val() == "PanNo") {
        $('#txtPanNo').val($('#txtUI').val());
        $('#txtPanNo').attr('disabled', 'disabled');
    }
    else {
        var pan = $('#txtUI').val().substr(2, 10);//11
        $('#txtPanNo').val(pan);
        $('#txtTINNo').val($('#txtUI').val());
        $('#txtPanNo').attr('disabled', 'disabled');
        $('#txtTINNo').attr('disabled', 'disabled');
    }
}
$("#txtUI").keyup(function () {
    clearform();
});
function EditVendor(vendorid, vname, contactp, emailid, dialingcodephone, phone, dialingcode, mobile, addr1, addr2, zipcode, gst, isactive, pan, buttonname, vendorcode, alternateemailid, countryid, stateid, prefferredTZ, cityid) {


    $('#hdnFlagType').val(buttonname);
    jQuery("#hdnParticipantID").val(vendorid);
    $("#hdnParticipantCode").val(vendorcode);
    jQuery("#ParticipantName").val(vname);
    jQuery("#txtAddress").val(decodeURIComponent(addr1));
    // jQuery("#txtCity").val(decodeURIComponent(addr2));
    jQuery("#txtPanNo").val(pan);
    jQuery("#txtTINNo").val(gst);
    jQuery("#txtPhoneNo").val(phone);
    jQuery("#txtMobileNo").val(mobile);
    jQuery("#ContactName").val(contactp);
    jQuery("#txtcompanyemail").val(emailid);
    jQuery("#txtAlternateeMailID").val(alternateemailid);
    jQuery("#txtZipCd").val(zipcode)
    // $("#ddlCountryCd option:selected").val(countrycdid)
    //   $("#ddlCountryCdPhone option:selected").val(countrycdphoneid)
    //$("#ddlpreferredTime").find(prefferredTZ).attr("selected", "selected")
    $('#ddlpreferredTime').val(prefferredTZ).trigger('change')

    //@abheedev

    $('#ddlCountryCd').val(dialingcode).trigger('change')
    $('#ddlCountryCdPhone').val(dialingcodephone).trigger('change')



    if (isactive == "Y" || isactive.toLowerCase() == "yes") {
        jQuery('input:checkbox[name=chkIsActiveparticipant]').prop('checked', true);
        jQuery('#chkIsActiveparticipant').parents('div').addClass('checked');
    }
    else {
        jQuery('input:checkbox[name=chkIsActiveparticipant]').prop('checked', false);
        jQuery('#chkIsActiveparticipant').parents('div').removeClass('checked');
    }

    $('#ddlCountry').val(countryid).trigger('change')
    setTimeout(function () {
        $('#ddlState').val(stateid).trigger('change')
    }, 500)

    setTimeout(function () {

        $('#ddlCity').val(cityid).trigger('change')
    }, 1000)
    $('#divVendorForm').removeClass('hide');
    fetchMapCategory('Z', vendorid);

    if (buttonname == "EditCustomerVendor") {
        $('#ParticipantName').attr('disabled', 'disabled');
        $('#txtAddress').attr('disabled', 'disabled');
        $('#txtCity').attr('disabled', 'disabled');
        $('#txtZipCd').attr('disabled', 'disabled');
        $('#txtPanNo').attr('disabled', 'disabled');
        $('#txtTINNo').attr('disabled', 'disabled');
        $('#ddlCountryCdPhone').attr('disabled', 'disabled');
        $('#txtPhoneNo').attr('disabled', 'disabled');
        $('#ddlCountryCd').attr('disabled', 'disabled');
        $('#txtMobileNo').attr('disabled', 'disabled');
        $('#txtcompanyemail').attr('disabled', 'disabled');
        $('#chkalternatemail').attr('disabled', 'disabled');
        $('#txtAlternateeMailID').attr('disabled', 'disabled')
        $("#ContactName").attr('disabled', 'disabled');
        $("#ddlCountry").attr('disabled', 'disabled');
        $("#ddlState").attr('disabled', 'disabled');
        $("#ddlCity").attr('disabled', 'disabled');
        $("#ddlpreferredTime").attr('disabled', 'disabled');
        $("#chkIsActiveparticipant").attr('disabled', 'disabled');
        $('#lbl_panmsz').removeClass('hide');
    }
    else {

        $('#ParticipantName').removeAttr('disabled');
        $('#txtAddress').removeAttr('disabled');
        $('#txtCity').removeAttr('disabled');
        $('#txtZipCd').removeAttr('disabled');
        $('#txtPanNo').removeAttr('disabled');
        $('#txtTINNo').removeAttr('disabled');
        $('#ddlCountryCdPhone').removeAttr('disabled');
        $('#txtPhoneNo').removeAttr('disabled');
        $('#ddlCountryCd').removeAttr('disabled');
        $('#txtMobileNo').removeAttr('disabled');
        $('#txtcompanyemail').removeAttr('disabled');
        $('#chkalternatemail').removeAttr('disabled');
        $("#ddlCountry").removeAttr('disabled');
        $("#ddlState").removeAttr('disabled');
        $("#ddlCity").removeAttr('disabled');
        //$('#txtAlternateeMailID').removeAttr('disabled')
        jQuery("#ContactName").removeAttr('disabled');
        $('#lbl_panmsz').addClass('hide');
    }
}
function ExtendVendor(vendorid, vname, contactp, emailid, dialingcodephone, phone, dialingcode, mobile, addr1, addr2, zipcode, gst, isactive, pan, buttonname, vendorcode, alternateemailid, countryid, stateid, prefferredTZ, cityid) {

    $("#hdnParticipantID").val(vendorid);
    $("#hdnParticipantCode").val(vendorcode);
    $('#hdnFlagType').val(buttonname);
    $("#ParticipantName").val(vname);
    $("#txtAddress").val(addr1);
    // $("#txtCity").val(addr2);
    $("#txtZipCd").val(zipcode);
    $("#txtPanNo").val(pan);
    $("#txtTINNo").val(gst);
    $("#txtPhoneNo").val(phone);
    //$("#ddlCountryCd").val(dialingcode);
    $("#txtMobileNo").val(mobile);
    $("#ContactName").val(contactp);

    $('#ddlCountry').val(countryid).trigger('change')
    setTimeout(function () {
        $('#ddlState').val(stateid).trigger('change')
    }, 900)
    setTimeout(function () {
        $('#ddlCity').val(cityid).trigger('change')

    }, 1500)
    //$("#ddlpreferredTime").find(`option[value=${sessionStorage.getItem("timezoneid")}]`).attr("selected", "selected")
    //$("#ddlpreferredTime").find(prefferredTZ).attr("selected", "selected")
    $('#ddlpreferredTime').val(prefferredTZ).trigger('change')


    jQuery("#txtcompanyemail").val(emailid);
    jQuery("#txtAlternateeMailID").val(alternateemailid);
    //abheedev

    $('#ddlCountryCd').val(dialingcode).trigger('change')
    $('#ddlCountryCdPhone').val(dialingcodephone).trigger('change')





    $('#ParticipantName').attr('disabled', 'disabled');
    $('#txtAddress').attr('disabled', 'disabled');
    $('#txtCity').attr('disabled', 'disabled');
    $('#txtPanNo').attr('disabled', 'disabled');
    $('#txtTINNo').attr('disabled', 'disabled');
    $('#txtPhoneNo').attr('disabled', 'disabled');
    $('#txtMobileNo').attr('disabled', 'disabled');
    $('#txtcompanyemail').attr('disabled', 'disabled');
    $('#chkalternatemail').attr('disabled', 'disabled');
    $('#txtAlternateeMailID').attr('disabled', 'disabled')
    jQuery("#ContactName").attr('disabled', 'disabled');
    jQuery("#ddlCountry").attr('disabled', 'disabled');
    jQuery("#ddlState").attr('disabled', 'disabled');
    jQuery("#ddlCity").attr('disabled', 'disabled');
    //@abheedev
    $('#ddlCountryCd').attr('disabled', 'disabled')
    $('#ddlCountryCdPhone').attr('disabled', 'disabled')

    $('#divVendorForm').removeClass('hide');
    $('#lbl_panmsz').removeClass('hide');
    if (isactive == "Y") {
        $('input:checkbox[name=chkIsActiveparticipant]').prop('checked', true);
        $('#chkIsActiveparticipant').parents('div').addClass('checked');
    }
    else {
        $('input:checkbox[name=chkIsActiveparticipant]').prop('checked', false);
        $('#chkIsActiveparticipant').parents('div').removeClass('checked');
    }

}
function ExtendParticipants() {
    var InsertQuery = '';
    $('.childchkbox').each(function () {
        if (this.checked) {
            InsertQuery = InsertQuery + $(this).val() + "#";
        }
    });

    if (InsertQuery == '') {
        $('#divalerterr').find('span').text('Please select atleast one group!');
        $('#divalerterr').slideDown('show');
        App.scrollTo(jQuery('#divalerterr'), -200);
        return false;
        setTimeout(function () {
            jQuery('#divalerterr').css('display', 'none');
        }, 5000);
    }
    var RegisterParticipants = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "VendorCode": jQuery("#hdnParticipantCode").val(),
        "UserID": sessionStorage.getItem('UserID'),
        "ProductCatID": InsertQuery
    }
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RegisterParticipanttoCustomer_PEV2/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(RegisterParticipants),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            debugger
            if (data.isSuccess == '1') {
                $("#hdnParticipantID").val(data.participantID)
                $('#divalertsucess').slideDown('show');
                App.scrollTo(jQuery('#divalertsucess'), -200);
                clearform();
                // MapVendorCategories();
            }
            else {
                $('#spanerterr').text('Vendor is already exists for this customer.')
                $('#divalerterr').slideDown('show');
                App.scrollTo(jQuery('#divalerterr'), -200);
            }
            setTimeout(function () {
                $('#divalertsucess').css('display', 'none');
                $('#divalerterr').css('display', 'none');
            }, 5000);
            fnfetchfoundVendors();
            fetchParticipantsVenderTable();

        },

        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });


}

function clearform() {

    jQuery("#ParticipantName").val('');
    jQuery("#ContactName").val('');
    jQuery("#txtAddress").val('');
    jQuery("#txtCity").val('');
    jQuery("#txtZipCd").val('');
    jQuery("#txtPanNo").val('');
    jQuery("#txtTINNo").val('');
    jQuery("#txtPhoneNo").val('');
    jQuery("#txtMobileNo").val('');
    jQuery("#ContactName").val('');
    jQuery("#txtcompanyemail").val('');
    jQuery('#hdnParticipantID').val('0');
    $("#ddlCountry").val('111');
    $("#ddlCountryCd").val('0');
    $("#ddlCountryCdPhone").val('0');
    $("#ddlState").val('0');
    $("#ddlCity").val('0');


    $('.childchkbox').each(function () {
        jQuery(this).closest('span#spancheckedvendorgroup').removeAttr('class');
    })
    status = "True"
    $('#ParticipantName').removeAttr('disabled')
    $('#txtAddress').removeAttr('disabled')
    $('#ContactName').removeAttr('disabled')
    //$('#txtCity').removeAttr('disabled')
    $('#txtZipCd').removeAttr('disabled')
    $('#txtPanNo').removeAttr('disabled')
    $('#txtTINNo').removeAttr('disabled')
    $('#ddlCountryCdPhone').removeAttr('disabled')
    $('#txtPhoneNo').removeAttr('disabled')
    $('#ddlCountryCd').removeAttr('disabled')
    $('#txtMobileNo').removeAttr('disabled')
    $('#txtcompanyemail').removeAttr('disabled')
    $('#chkalternatemail').removeAttr('disabled')
    $('#ddlCountry').removeAttr('disabled')
    $('#ddlState').removeAttr('disabled')
    $('#ddlCity').removeAttr('disabled')
    jQuery("#hdnParticipantID").val(0)
    jQuery("#hdnParticipantCode").val(0)
    jQuery("#hdnFlagType").val(0)
    $('#divVendorForm').addClass('hide')
    $('#lbl_panmsz').addClass('hide')
    $('#div_tableVendor').addClass('hide');
}
function fnchangeplaceholder() {
    clearform();
    $('#txtUI').val('');
    $('#txtUI').attr("placeholder", $('#ddlUI  option:selected').text());
    if ($('#ddlUI  option:selected').val() == "PanNo") {
        $("#txtUI").attr('maxlength', '10');
        $("#txtUI").attr('minlength', '10');
    }
    else if ($('#ddlUI  option:selected').val() == "ServiceTaxNo") {
        $("#txtUI").attr('maxlength', '15');
        $("#txtUI").attr('minlength', '15');
    }
    else {
        $("#txtUI").attr('maxlength', '11');
        $("#txtUI").attr('minlength', '11');
    }

}
jQuery("#txtSVendor").keyup(function () {

    jQuery("#tblVendorFoundDetails tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#txtSVendor').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblVendorFoundDetails tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tblVendorFoundDetails tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});
function fetchCountry() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/Country/?CountryID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlCountry").empty();
            var vlal = new Array();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCountry").append("<option value=" + data[i].countryID + ">" + data[i].countryName + "</option>");
                    $("#ddlCountryCd").append("<option value=" + data[i].countryID + ">" + data[i].dialingCode + "</option>");
                    $("#ddlCountryCdPhone").append("<option value=" + data[i].countryID + ">" + data[i].dialingCode + "</option>");
                }

                $("#ddlCountry").val('111').trigger("change");

            }
            else {
                $("#ddlCountry").append('<tr><td>No countries found..</td></tr>');
            }
            // jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
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

            jQuery("#ddlpreferredTime").empty();
            jQuery("#ddlpreferredTime").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < lstTZ.length; i++) {

                jQuery("#ddlpreferredTime").append(jQuery("<option ></option>").val(lstTZ[i].id).html(lstTZ[i].timezonelong));
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

function fetchState() {
    var countryid = $('#ddlCountry option:selected').val();

    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/State/?CountryID=" + countryid + "&StateID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlState").empty();
            if (data.length > 0) {

                $("#ddlState").append("<option value=0>Select State</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddlState").append("<option value=" + data[i].stateID + ">" + data[i].stateName + "</option>");

                }
                $("#ddlState").trigger("change");
            }
            else {
                $("#ddlState").append('<tr><td>No state found..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
        }

    });
}

function fetchCity() {
    var stateid = $('#ddlState').val();
    if (stateid == null) {
        stateid = 0;
    }
    //alert(stateid)
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/City/?StateID= " + stateid + "&CityID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlCity").empty();
            if (data.length > 0) {
                $("#ddlCity").append("<option value=0>Select City</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCity").append("<option value=" + data[i].cityID + ">" + data[i].cityName + "</option>");
                }
                $("#ddlCity").val('0').trigger("change");
            }
            else {
                $("#ddlCity").append('<tr><td>No city found..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
        }

    });
}



function DownloadFile(aID) {

    fnDownloadAttachments($("#" + aID.id).html(), 'VR/' + _vendorId);
}