
var gstflag = true
var APIPath = sessionStorage.getItem("APIPath");

var pageNumber = 1;
var numberOfPages = 0;
var SearchText = '';
jQuery(document).ready(function () {
    //loadingEngine()
    //FROM HTML
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
    setCommonData();
    fetchMenuItemsFromSession(9, 10);
    FormValidation.init();

    /*fetchParticipantsVenderTable(0);*/

    SearchText = $('#txtSearch').val();
    fetchParticipantsVenderTable(1, SearchText);
    fetchMapCategory('M', 0);


    numberonly();
    fetchBidType();// for serach vendor
    clearform();
    fetchCountry();
    //abheedev 25/11/2022

    $('#txtsearchcat').select2({
        placeholder: 'Search Category',
    })

    $('#txtsearchvendor').select2({
        placeholder: 'Search Vendor',
    })

    $('#ddlCountry').select2({
        searchInputPlaceholder: "Search Country",
    })
    $('#ddlCountryCd').select2({
        searchInputPlaceholder: "Dialing Code",
        //allowClear: true
    });



    $('#ddlCountryCdPhone').select2({
        searchInputPlaceholder: "Dialing Code",
        // allowClear: true
    });



    $('#ddlState').select2({
        searchInputPlaceholder: "Search State",
        allowClear: true
    }).on('change', function () { $(this).valid(); });
    $('#ddlCity').select2({
        searchInputPlaceholder: "Search City",
        allowClear: true
    }).on('change', function () { $(this).valid(); });
    $('#ddlpreferredTime').select2().on('change', function () { $(this).valid(); });
    $('#ddlpreferredTimem').select2().on('change', function () { $(this).valid(); });

    //***********
    if (window.location.search) {

        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)
        vendoridparam = getUrlVarsURL(decryptedstring)["VendorId"];
        let tmpvendoridparam = parseInt(sessionStorage.getItem('CustomerID'))
        /* UpdateActivity(vendoridparam, tmpvendoridparam);*/
        fnViewDetails(tmpvendoridparam, vendoridparam)
    }


    jQuery("#btnsumbit").click(function () {

        dynamiccontrolvalidation();
    });


});
//FROM HTML

let isSapIntegrated = sessionStorage.getItem('IsSAPModule');

$("#btnExport").click(function (e) {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "-" + month + "-" + year + "/ " + hour + ":" + mins;

    tableToExcel('tblParticipantsExport', 'Participant Details', 'Participant Details - ' + postfix + '.xls');

});
//


$('#txtPanNo,#txtPhoneNo,#txtMobileNo').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

$('#txtTINNo').maxlength({

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
let ParticipantID = "";
let AssociatedVendorID = ""
var form1 = $('#entryForm');
var FormValidation = function () {
    var ValidateParticipants = function () {

        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        //abheedev 24 / 11 / 2022
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                ddlUI: {
                    required: true,
                },
                txtAddress: {
                    required: true
                },
                txtPhoneNo: {
                    required: true
                },
                ParticipantName: {
                    required: true
                },
                ContactName: {
                    required: true
                },
                txtPanNo: {
                    required: true
                },
                txtCity: {
                    required: true
                },
                txtZipCd: {
                    required: true,
                    number: true
                },
                txtUI: {
                    required: true,
                    email: true
                },
                txtPhoneNo: {
                    required: true,
                    number: true

                },
                txtMobileNo: {
                    required: true,
                    number: true

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

                    email: true
                },
                ddlCountryCd: {
                    required: true
                    //notEqualTo: 0
                },
                ddlCountry: {
                    required: true,
                    notEqualTo: 0
                },
                ddlCountryCdPhone: {
                    required: true
                    //notEqualTo: 0
                },
                ddlState: {
                    required: true,
                    notEqualTo: 0
                },
                ddlCity: {
                    required: true,
                    notEqualTo: 0
                },
                ddlpreferredTime: {
                    required: true,

                }
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
                txtPhoneNo: {
                    required: "Please enter phone no"
                },
                txtMobileNo: {
                    required: "Please enter mobile no"
                },
                txtcompanyemail: {
                    required: "Please enter company e-mail"
                },

                ContactName: {
                    required: "Please enter contact person name"
                },
                ddlpreferredTime: {
                    required: "Please select your preferred time zone"
                }

            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();

                App.scrollTo(error1, -300);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group,.reqcls').addClass('has-error'); // set error class to the control group

            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group,.reqcls').removeClass('has-error'); // set error class to the control group


            },

            success: function (label) {
                label
                    .closest('.form-group,.reqcls').removeClass('has-error'); // set success class to the control group

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


    if (jQuery("#txtTINType option:selected").val() == "IN3") {
        if (gstflag == false) {
            $('#divalerterr').find('span').text('Please select valid GST to proceed');
            $('#divalerterr').slideDown('show');
            App.scrollTo(jQuery('#divalerterr'), -200);
            return false;
            setTimeout(function () {
                jQuery('#divalerterr').css('display', 'none');
            }, 2000);
        }

        $('#txtTINNo').rules('add', {
            required: true
        });
        $('#txtPanNo').rules('add', {
            required: true
        });


    }

    else if (jQuery("#txtTINType option:selected").val() == "" && $("#ddlCountry option:selected").val() == 'IN') {

        $('#txtPanNo').rules('add', {
            required: true
        });


    }
    var RegisterParticipants = '';
    $("#btnvendreg").attr("disabled", "disabled")
    var _cleanString = StringEncodingMechanism(jQuery("#ParticipantName").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtAddress").val());
    let cleanTradeName = StringEncodingMechanism(jQuery("#TradeName").val());

    var encodedcontactperson = StringEncodingMechanism(jQuery("#ContactName").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";

    if (jQuery('#chkIsActiveparticipant').is(':checked') == true) {
        status = 'Y';
    }
    else {
        status = 'N';
    }

    var InsertQuery = '';
    var ProductCatId = [];
    $('.childchkbox').each(function () {
        if (this.checked) {
            InsertQuery = InsertQuery + $(this).val() + "#";
            var CategoryTypeId = {
                "CategoryID": parseInt($(this).val())
            }
            ProductCatId.push(CategoryTypeId);
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
   
    if (jQuery("#txtTINType option:selected").val() == "" && $("#ddlCountry option:selected").val() == 'IN') {
        RegisterParticipants = {
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "UserID": sessionStorage.getItem('UserID'),
            "CompanyEmail": jQuery("#txtcompanyemail").val().trim().toLowerCase(),
            "AlternateEmailID": $('#txtAlternateeMailID').val(),
            "ParticipantName": _cleanString,
            "ContactPerson": encodedcontactperson,
            "MobileNo": jQuery("#txtMobileNo").val(),
            "PhoneNo": jQuery("#txtPhoneNo").val(),
            "DialingCode": parseInt(jQuery("#ddlCountryCd option:selected").val()),
            "DialingCodePhone": parseInt(jQuery("#ddlCountryCdPhone option:selected").val()),
            "IsActive": status,
            "ActionType": $('#hdnFlagType').val(),
            "ParticipantID": parseInt(jQuery("#hdnParticipantID").val()),
            "ProductCatID": InsertQuery,
            "ProductCatIDList": ProductCatId,
            "AssociatedVendorID": parseInt($('#hdnChildID').val()),
            "Address": _cleanString2,
            "CityID": parseInt(jQuery("#ddlCity option:selected").val()),
            "CityName": jQuery("#ddlCity option:selected").text(),
            "StateID": parseInt(jQuery("#ddlState option:selected").data('stateid')), //parseInt(jQuery("#ddlState option:selected").val()),
            "StateName": jQuery("#ddlState option:selected").data('statename'),
            "CountryID": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
            "CountryName": jQuery("#ddlCountry option:selected").text(),
            "ZipCode": jQuery("#txtZipCd").val(),
            "TaxId": "",
            "TaxIdType": "",
            "TaxId2": jQuery("#txtPanNo").val(),
            "TaxIdType2": jQuery("#txtTINType2 option:selected").val(),
            "PrefferedTZ": parseInt(jQuery("#ddlpreferredTime option:selected").val()),
            "CountryKey": jQuery("#ddlCountry option:selected").val(),
            "RegionKey": jQuery("#ddlState option:selected").val(),
            "TradeName": cleanTradeName,
            "GSTNStatus": "",
            "EInvoiceStatus": "",
            "TaxpayerType": "",
        };

    }
    else if (jQuery("#txtTINType option:selected").val() == "IN3") {
        RegisterParticipants = {
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "UserID": sessionStorage.getItem('UserID'),
            "CompanyEmail": jQuery("#txtcompanyemail").val().trim().toLowerCase(),
            "AlternateEmailID": $('#txtAlternateeMailID').val(),
            "ParticipantName": _cleanString,
            "ContactPerson": encodedcontactperson,
            "MobileNo": jQuery("#txtMobileNo").val(),
            "PhoneNo": jQuery("#txtPhoneNo").val(),
            "DialingCode": parseInt(jQuery("#ddlCountryCd option:selected").val()),
            "DialingCodePhone": parseInt(jQuery("#ddlCountryCdPhone option:selected").val()),
            "IsActive": status,
            "ActionType": $('#hdnFlagType').val(),
            "ParticipantID": parseInt(jQuery("#hdnParticipantID").val()),
            "ProductCatID": InsertQuery,
            "ProductCatIDList": ProductCatId,
            "AssociatedVendorID": parseInt($('#hdnChildID').val()),
            "Address": _cleanString2,
            "CityID": parseInt(jQuery("#ddlCity option:selected").val()),
            "CityName": jQuery("#ddlCity option:selected").text(),
            "StateID": parseInt(jQuery("#ddlState option:selected").data('stateid')), //parseInt(jQuery("#ddlState option:selected").val()),
            "StateName": jQuery("#ddlState option:selected").data('statename'),
            "CountryID": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
            "CountryName": jQuery("#ddlCountry option:selected").text(),
            "ZipCode": jQuery("#txtZipCd").val(),
            "TaxId": jQuery("#txtTINNo").val(),
            "TaxIdType": jQuery("#txtTINType option:selected").val(),
            "TaxId2": jQuery("#txtPanNo").val(),
            "TaxIdType2": jQuery("#txtTINType2 option:selected").val(),
            "PrefferedTZ": parseInt(jQuery("#ddlpreferredTime option:selected").val()),
            "CountryKey": jQuery("#ddlCountry option:selected").val(),
            "RegionKey": jQuery("#ddlState option:selected").val(),
            "TradeName": cleanTradeName,
            "GSTNStatus": $('#gstnStatus').val(),
            "EInvoiceStatus": $('#eInvoiceStatus').val(),
            "TaxpayerType": $('#taxpayerType').val(),
        };

    }
    else {
        RegisterParticipants = {
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "UserID": sessionStorage.getItem('UserID'),
            "CompanyEmail": jQuery("#txtcompanyemail").val().trim().toLowerCase(),
            "AlternateEmailID": $('#txtAlternateeMailID').val(),
            "ParticipantName": _cleanString,
            "ContactPerson": encodedcontactperson,
            "MobileNo": jQuery("#txtMobileNo").val(),
            "PhoneNo": jQuery("#txtPhoneNo").val(),
            "DialingCode": parseInt(jQuery("#ddlCountryCd option:selected").val()),
            "DialingCodePhone": parseInt(jQuery("#ddlCountryCdPhone option:selected").val()),
            "IsActive": status,
            "ActionType": $('#hdnFlagType').val(),
            "ParticipantID": parseInt(jQuery("#hdnParticipantID").val()),
            "ProductCatID": InsertQuery,
            "ProductCatIDList": ProductCatId,
            "AssociatedVendorID": parseInt($('#hdnChildID').val()),
            "Address": _cleanString2,
            "CityID": parseInt(jQuery("#ddlCity option:selected").val()),
            "CityName": jQuery("#ddlCity option:selected").text(),
            "StateID": parseInt(jQuery("#ddlState option:selected").data('stateid')), //parseInt(jQuery("#ddlState option:selected").val()),
            "StateName": jQuery("#ddlState option:selected").data('statename'),
            "CountryID": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
            "CountryName": jQuery("#ddlCountry option:selected").text(),
            "ZipCode": jQuery("#txtZipCd").val(),
            "TaxId": "",
            "TaxIdType": "",
            "TaxId2": "",
            "TaxIdType2": jQuery("#txtTINType2 option:selected").val(),
            "PrefferedTZ": parseInt(jQuery("#ddlpreferredTime option:selected").val()),
            "CountryKey": jQuery("#ddlCountry option:selected").val(),
            "RegionKey": jQuery("#ddlState option:selected").val(),
            "TradeName": cleanTradeName,
            "GSTNStatus": "",
            "EInvoiceStatus": "",
            "TaxpayerType": "",
        };

    }

    jQuery.ajax({

        // url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RegParticpants_PEV2/",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/VendorRegistrationByUser/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        async: false,
        data: JSON.stringify(RegisterParticipants),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            gststatus = false
          
            $("#btnvendreg").attr("disabled", "disabled")
            $("#hdnParticipantID").val(data.participantID)
            $("#hdnParticipantCode").val(data.vendorCode)



            if (data.isSuccess != '1' && data.isSuccess != '2') {
                // fnshowexistedVendorForextend();
                $("#btnvendreg").removeAttr("disabled")
                bootbox.alert(data.message);
            }
            else {
                $('#divalertsucess').slideDown('show');
                App.scrollTo(jQuery('#divalertsucess'), -200);
                // $('#div_tableVendor').removeClass('hide');
                // clearform();
            }
            setTimeout(function () {
                jQuery('#divalertsucess').css('display', 'none');
                jQuery('#divalerterr').css('display', 'none');
            }, 5000);

            setTimeout(function () { fnfetchfoundVendors() }, 3000)
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {
             
            $("#btnvendreg").removeAttr("disabled")
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {


                $('#spanerterr').text(xhr.responseText);
                jQuery('#divalerterr').slideDown('show');
                App.scrollTo(jQuery('#divalerterr'), -200);
                $('.alert-danger').fadeOut(2000);
            }
            jQuery.unblockUI();
            return false;
        }

    })

}
var dataforExistedEmailforExtend = "";
function fnshowexistedVendorForextend() {

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

                            // $('#tblforexistedVendor').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].contactPerson + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td><td class=hide><a href=\"#\"   onclick=\"ExtendVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCodeMobile + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].prefferedTZ + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs yellow \"><i class=\"fa fa-edit\"></i>Extend</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + data[i].vendorID + "'\,\'" + data[i].vendorName + "'\,\'" + data[i].contactPerson + "'\,\'" + data[i].emailID + "'\,\'" + data[i].dialingCodePhone + "'\,\'" + data[i].phone + "'\,\'" + data[i].dialingCode + "'\,\'" + data[i].mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + data[i].zipCode + "'\,\'" + data[i].serviceTaxNo.toUpperCase() + "'\,\'" + data[i].isActive + "'\,\'" + data[i].panNo.toUpperCase() + "'\,\'" + data[i].buttonName + "'\,\'" + data[i].vendorCode + "'\,\'" + data[i].alternateEmailID + "'\,\'" + data[i].countryID + "'\,\'" + data[i].stateID + "'\,\'" + data[i].cityID + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");

                            $(`#tblforexistedVendor`).append(`<tr><td>${data[i].vendorCode}</td><td>${data[i].vendorName}</td><td>${data[i].contactPerson}</td><td>${data[i].mobileNo}</td><td>${data[i].emailID}</td><td class=hide><a href="#"  onclick="ExtendVendor('${data[i].vendorID}','${data[i].vendorName}','${data[i].contactPerson}','${data[i].emailID}','${data[i].dialingCodePhone}','${data[i].phone}','${data[i].dialingCodeMobile}','${data[i].mobileNo}','${addr1}','${addr2}','${data[i].zipCode}','${data[i].serviceTaxNo.toUpperCase()}','${data[i].isActive}','${data[i].panNo.toUpperCase()}','${data[i].buttonName}','${data[i].vendorCode}','${data[i].alternateEmailID}','${data[i].countryID}','${data[i].stateID}','${data[i].prefferedTZ}','${data[i].cityID}') class="btn btn-xs yellow"><i class="fa fa-edit"></i>Extend</a>&nbsp;<a href="#"   onclick=AddVendor('${data[i].vendorID}','${data[i].vendorName}','${data[i].contactPerson}','${data[i].emailID}','${data[i].dialingCodePhone}','${data[i].phone}','${data[i].dialingCode}','${data[i].mobileNo}','${addr1}','${addr2}','${data[i].zipCode}','${data[i].serviceTaxNo.toUpperCase()}','${data[i].isActive}',${data[i].panNo.toUpperCase()}','${data[i].buttonName}','${data[i].vendorCode}','${data[i].alternateEmailID}','${data[i].countryID}','${data[i].stateID}','${data[i].cityID}') class="btn btn-xs green hide"><i class="a fa-plus"></i>Add</a></td></tr>`);


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
                    $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
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
let VenderdataList = [];
function fetchParticipantsVenderTable(PageNo, searchText) {
    currentpage = PageNo;
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/fetchParticipantsVender_PEV2/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&CreatedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&PageNo=" + PageNo + "&SearchText=" + searchText,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Venderdata) {
            jQuery("#tblParticipantsVender > tbody").empty();
            if (Venderdata.length > 0) {
                vendorsForAutoComplete = Venderdata;
                jQuery("#txtsearchvendor").empty();
                jQuery("#txtsearchvendor").append(jQuery("<option></option>").val(0).html("All"));
                for (var i = 0; i < Venderdata.length; i++) {
                    jQuery("#txtsearchvendor").append(jQuery("<option></option>").val(Venderdata[i].participantID).html(Venderdata
                    [i].participantName));

                }
                /*Bijendra Singh 03-070-2023*/
                if(searchText==''){
                    VenderdataList = Venderdata;
                }
               
                var Size = 10;
                var total_records = Venderdata.length; //Venderdata[0].totalRecords;
                numberOfPages = 1;
                if (total_records > 0) {
                    numberOfPages = Math.ceil(total_records / Size);
                }
                PageNo = PageNo - 1;
                var Offset = 0;
                var Newsize = 0;

                if (PageNo == 0) {
                    Offset = PageNo;
                    Newsize = Size;
                }
                else {
                    Offset = (PageNo * Size) + 1;
                    Newsize = Size;
                }

                var LastRow = Offset + Newsize;


                let Venderdatalistfilter = Venderdata.filter(Venderdata => Venderdata.rownum >= Offset && Venderdata.rownum <= LastRow);


                jQuery.each(Venderdatalistfilter, function (key, value) {


                    console.log(1)
                    var str = "";
                    var addr1 = (value.address).replace(/\n/g, " ");

                    var addr2 = (value.cityName).replace(/\n/g, " ");
                    if (value.mapBtnRequired == 'N') {
                        str = "<tr><td style=\"text-align:center;width:10%!important;\">";
                        if (sessionStorage.getItem('UserID') == value.createdBy) {

                            if (value.actionType == "EditVendor") {


                                str += "<a href=\"#\"   onclick =\"editTableVendor(\'" + value.companyEmail + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a></td>";
                                str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                                str += "<td style=\"width:10%!important;\">No</td>";

                            }
                            else {
                                str += "<a href=\"#\"   onclick =\"editTableVendor(\'" + value.companyEmail + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a></td>";
                                str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                                str += "<td style=\"width:10%!important;\">Yes</td>";

                            }
                        }
                        else {
                            if (value.actionType == "EditVendor") {
                                //abheedev
                                str += "<a href=\"#\"   onclick =\"editTableVendor(\'" + value.companyEmail + "'\)\" class=\"btn btn-xs green\"><i class=\"fa fa-edit\"></i>Partial Edit</a></td>";
                                //abheedev
                                str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                                str += "<td style=\"width:10%!important;\">No</td>";

                            }
                            else {

                                str += "<a href=\"#\"   onclick =\"editTableVendor(\'" + value.companyEmail + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a></td>";
                                str += "<td style=\"width:10%!important;\">External</td>";
                                str += "<td style=\"width:10%!important;\">Yes</td>";

                            }
                        }
                    }
                    else if (value.mapBtnRequired == 'Y') {
                        str = "<tr><td style=\"text-align:right;width:10%!important;\">";
                        str += "<a href=\"javascript:;\"  onclick=\"MapCategory(this)\" class=\"btn btn-xs green\"><i class=\"fa fa-edit\"></i>Map</a><a href=\"#\" href=\"#\"  onclick=\"EditProduct(this)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a></td>";
                    }
                  
                    str += "<td style=\"display:none;\">" + value.participantID + "</td><td style=\"width:10%!important;color:darkblue!important;font:bold;cursor:pointer;\" class=bold onclick =\"fnViewDetails(\'0'\,\'" + value.participantID + "'\)\">" + value.participantName + "</td><td style=\"width:10%!important;\">" + value.legalName + "</td><td style=\"width:10%!important;\">" + value.contactPerson + "</td><td style=\"width:10%!important;\">" + value.vendorCode + "</td><td style=\"width:10%!important;\">" + StringDecodingMechanism(value.address) + "</td><td style=\"width:5%!important;\">" + value.cityName + "</td><td style=\"width:10%!important;\">" + value.panNo.toUpperCase() + "</td><td style=\"width:10%!important;\">" + value.tinNo.toUpperCase() + "</td><td style=\"width:20%!important;\">" + value.mobileNo + "</td><td style=\"width:20%!important;\">" + value.phoneNo + "</td><td style=\"width:10%!important;\">" + value.companyEmail + "</td><td style=\"width:10%!important;\">" + value.alternateEmailID + "</td>";
                    str += "<td style=\"width:5%!important;\">" + value.isActive + "</td>";
                    str += "</td></tr>";
                    jQuery('#tblParticipantsVender > tbody').append(str);
                });


                setupPagination();

            }
            else {
                jQuery('#tblParticipantsVender > tbody').append("<tr><td colspan='16' style='text-align: center; color:red;'>No Participant found</td></tr>");
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

/* by Bijendra Singh*/
function fetchParticipantsVenderTableFilter(PageNo, searchText) {
    //console.log("data", VenderdataList);
    console.log("PageNo", PageNo);
    currentpage = PageNo;
    jQuery("#tblParticipantsVender > tbody").empty();
    if (VenderdataList.length > 0) {
        var Size = 10;
        var total_records = VenderdataList.length //VenderdataList[0].totalRecords;
        numberOfPages = 1;
        if (total_records > 0) {
            numberOfPages = Math.ceil(total_records / Size);
        }

        var Offset = 0;
        var Newsize = 0;
        PageNo = PageNo - 1;
        if (PageNo == 0) {
            Offset = PageNo;
            Newsize = Size;
        }
        else {
            Offset = (PageNo * Size) + 1;
            Newsize = Size;
        }

        var LastRow = Offset + Newsize;


        let Venderdatalistfilter = VenderdataList; // VenderdataList.filter(Venderdata => (Venderdata.rownum >= Offset && Venderdata.rownum <= LastRow) || Venderdata.contains(searchText));
        if (searchText != "") {

  //          let element = { participantName: searchText }
//
//Venderdatalistfilter = VenderdataList.includes(searchText);
Venderdatalistfilter = VenderdataList.filter(Venderdata => (Venderdata.rownum >= Offset && Venderdata.rownum <= LastRow));
        }
        else {
            Venderdatalistfilter = VenderdataList.filter(Venderdata => (Venderdata.rownum >= Offset && Venderdata.rownum <= LastRow));
        }


        if (Venderdatalistfilter.length > 0) {
            jQuery.each(Venderdatalistfilter, function (key, value) {
                var str = "";
                var addr1 = (value.address).replace(/\n/g, " ");

                var addr2 = (value.cityName).replace(/\n/g, " ");
                if (value.mapBtnRequired == 'N') {
                    str = "<tr><td style=\"text-align:center;width:10%!important;\">";
                    if (sessionStorage.getItem('UserID') == value.createdBy) {

                        if (value.actionType == "EditVendor") {


                            str += "<a href=\"#\"   onclick =\"editTableVendor(\'" + value.companyEmail + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a></td>";
                            str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                            str += "<td style=\"width:10%!important;\">No</td>";

                        }
                        else {
                            str += "<a href=\"#\"   onclick =\"editTableVendor(\'" + value.companyEmail + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a></td>";
                            str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                            str += "<td style=\"width:10%!important;\">Yes</td>";

                        }
                    }
                    else {
                        if (value.actionType == "EditVendor") {
                            //abheedev
                            str += "<a href=\"#\"   onclick =\"editTableVendor(\'" + value.companyEmail + "'\)\" class=\"btn btn-xs green\"><i class=\"fa fa-edit\"></i>Partial Edit</a></td>";
                            //abheedev
                            str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                            str += "<td style=\"width:10%!important;\">No</td>";

                        }
                        else {

                            str += "<a href=\"#\"   onclick =\"editTableVendor(\'" + value.companyEmail + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a></td>";
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
        setupPagination(pageNumber);
    }
    else {
        jQuery('#tblParticipantsVender > tbody').append("<tr><td colspan='12' style='text-align: center; color:red;'>No Participant found</td></tr>");
    }
    //        fetchParticipantsparked();
    //}
    /*,
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
    }*/
    //});
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
let customerid = parseInt(sessionStorage.getItem('CustomerID'));
function fnViewDetails(tmpvendorid, vendorid) {

    $('#viewalldetails').modal('show');
    $('#childDetailsForm').addClass('hide')
    fetchVendorRegistrationDetails(customerid, parseInt(vendorid));
    fetchpayment()


}
/*function fetchVendorRegistrationDetails(tmpvendorid, vendorid) {
   
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

}*/
function fnApprove_reject(linkurl) {
    window.open(linkurl);

}
$('#txtcompanyemail').on('keyup', function () {

    var newVal = $(this).val();
    $('#txtAlternateeMailID').val(newVal)

})

function EditProduct(ctrl) {
    clearform()
    jQuery("#ParticipantName").val(StringDecodingMechanism(jQuery(ctrl).closest('tr').find("td").eq(3).html()));
    jQuery("#ContactName").val(StringDecodingMechanism(jQuery(ctrl).closest('tr').find("td").eq(4).html()));
    jQuery("#ParticipantName").closest('.form-group').removeClass('has-error')//.find('span').hide()
    jQuery("#txtAddress").val(StringDecodingMechanism(jQuery(ctrl).closest('tr').find("td").eq(5).text()));
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
function fetchMapCategory(categoryFor, childId) {


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=" + categoryFor + "&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&ChildId=" + childId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {


            jQuery("#tblCategoryMaster").empty();
            for (var i = 0; i < data.length; i++) {
                jQuery("#txtsearchcat").append(jQuery("<option></option>").val(data[i].categoryID).html(data[i].categoryName));

            }

            var count = 3;
            var str = '';
            if (data.length > 0) {
                CategoryForAutoComplete = data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].checked == 'Y') {
                        str += '<tbody><tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span class="checked"  id=\"spancheckedvendorgroup\"><input class=\"childchkbox\" type=\"checkbox\" style=\"cursor:pointer\"  onchange=\"validateVendorGroup(this, ' + data[i].categoryID + ')\" value=\'' + data[i].categoryID + '\' checked /></span></div></td><td>' + data[i].categoryName + '</td></tr></tbody>';
                    } else {
                        str += '<tbody><tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spancheckedvendorgroup\"><input class=\"childchkbox\" type=\"checkbox\" style=\"cursor:pointer\"  onchange=\"validateVendorGroup(this,' + data[i].categoryID + ')\" value=\'' + data[i].categoryID + '\'  /></span></div></td><td>' + data[i].categoryName + '</td></tr></tbody>';
                    }
                }
                jQuery("#tblCategoryMaster").append(str);
            }
            else {
                jQuery("#tblCategoryMaster").append('<tbody><tr><td>No Information is there..</td></tr></tbody>');
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


/*jQuery("#txtsearchcat").typeahead({
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

});*/



sessionStorage.setItem('hdnVendorID', 0);


/*
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

});*/

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

        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});
jQuery("#txtSearchparked").keyup(function () {
    _this = this;

    jQuery.each($("#tblParticipantsparked tbody").find("tr"), function () {

        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});

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
//abheedev bug 590
function validatePanNumber(pan) {

    clearform();

    $("#ddlpreferredTime").select2("val", "");
    $("#ddlState").select2("val", "0")
    $("#ddlCity").select2("val", "0")
    if (!validateEmail()) {
        jQuery('#spanerterr').text('Please Enter valid Email Id then Proceed to Search.')
        jQuery('#divalerterr').slideDown('show');
        App.scrollTo(jQuery('#divalerterr'), -200);
        $('#ddlUI').addClass('has-error')
        setTimeout(function () {
            $('#divalerterr').css('display', 'none');
        }, 1000);

        return
    }
    // fnValidateGST();
    fnfetchfoundVendors();

}




function fnfetchfoundVendors() {

    var UniqueId = "";
    if ($('#txtUI').val() == null || $('#txtUI').val() == undefined || $('#txtUI').val() == "") {
        if ($('#ddlUI').val() == "EmailID") {
            UniqueId = "Email Id"
            form1.validate({
                rules: {
                    txtUI: {
                        required: true,
                        email: true
                    }
                }
            })

        }

        jQuery('#spanerterr').text('Please Enter ' + UniqueId + ' then Proceed to Search.')
        jQuery('#divalerterr').slideDown('show');
        App.scrollTo(jQuery('#divalerterr'), -200);
        $('#ddlUI').addClass('has-error')
    }


    else {

        let customerid = parseInt(sessionStorage.getItem('CustomerID'));
        let emailid = $('#txtUI').val();

        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            //url: sessionStorage.getItem("APIPath") + "RegisterParticipants/GetVendors/?FieldName=" + $('#ddlUI').val() + "&FieldValue=" + $('#txtUI').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
            url: sessionStorage.getItem("APIPath") + "VendorLCM/GetVendorByEmail/?Email=" + emailid + "&CustomerId=" + customerid,
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
              
                if (!data.isVendorPresent) {
                    $("#hdnFlagType").val("New")
                    $('#divVendorForm').removeClass('hide')
                    $('#divVendorCompaniesForm').removeClass('hide')
                    $('#divVendorFormbtn').removeClass('hide')
                    $('#divVendorContactForm').removeClass('hide')
                    $('#txtcompanyemail').val($('#txtUI').val())
                    $('#txtAlternateeMailID').val($('#txtUI').val())
                    $('#txtcompanyemail').attr('disabled', 'disabled')
                    $("#ddlCountry").val('IN').trigger("change");
                    $("#showapproval").hide()
                    return true

                }
                let parentData = data.vendorMasterToReturn;
                let childData = data.vendorChildrenToReturn;
                ParticipantID = parentData.vendorID;
               
                let isactiveUser = parentData.isActive;
                $("#ContactName").val(StringDecodingMechanism(parentData.contactPerson))
                $("#ddlCountryCd").val(parentData.dialingCodeMobile).trigger("change")
                $("#txtMobileNo").val(parentData.mobileNo)
                $("#txtcompanyemail").val(parentData.emailID)
                if (parentData.alternateEmailID == "") {
                    $("#txtAlternateeMailID").val(parentData.emailID)
                }
                else {
                    $("#txtAlternateeMailID").val(parentData.alternateEmailID)
                }

                $("#ddlpreferredTime").val(parentData.preferredtimezone).trigger("change")

                if (isactiveUser == "Y") {
                    jQuery('input:checkbox[name=chkIsActiveparticipant]').attr('checked', 'checked');
                    jQuery('#chkIsActiveparticipant').parents('span').addClass('checked');
                }
                else {
                    jQuery('input:checkbox[name=chkIsActiveparticipant]').removeAttr('checked');
                    jQuery('#chkIsActiveparticipant').parents('span').removeClass('checked');
                }



                $("#hdnParticipantID").val(parentData.vendorID)
                $('#divVendorForm').removeClass('hide')
                $('#divVendorContactForm').removeClass('hide')
                $('#div_tableVendor').removeClass('hide');





                $('#tblVendorFoundDetails').empty();
                var addr1 = "";
                var addr2 = "";
                let taxIdNo = "";
                let addrC = "";
                if (childData.length > 0) {

                    $('#tblVendorFoundDetails').append("<thead><tr><th class='hide'></th><th>Company Name</th><th>Address</th><th>Tax Identification Number</th><th></th></tr></thead><tbody>")

                    for (var i = 0; i < childData.length; i++) {

                        //AssociatedVendorID = childData[i].childId;
                        addr1 = (childData[i].address1 || "").replace(/\n/g, " ");
                        addr2 = (childData[i].address2 || "").replace(/\n/g, " ");
                        taxIdNo = childData[i].taxId;
                        addrC = childData[i].address + " " + childData[i].city + " " + childData[i].state + " " + childData[i].country;







                        if (parentData.action == "Extend") {
                            disableParent()
                            $('#btnAddAnother').removeClass('hide');

                          


                            $(`#tblVendorFoundDetails`).append(`<tr><td class='hide'>${childData[i].childId}</td><td>${childData[i].companyName}</td><td>${addrC}</td><td>${taxIdNo}</td><td><a href="#"   onclick="ExtendVendor('${parentData.vendorID}','${childData[i].companyName}','${parentData.emailID}','${parentData.dialingCodePhone}','${parentData.phone}','${parentData.dialingCodeMobile}','${parentData.mobileNo}','${encodeURIComponent(StringDecodingMechanism(childData[i].address))}','${childData[i].zipCode}','${(childData[i].taxId || "").toUpperCase()}','${(childData[i].isActive || "")}','${childData[i].taxId2.toUpperCase()}','${parentData.action}','${parentData.vendorCode}','${parentData.alternateEmailID}','${(childData[i].countryID || 111)}','${(childData[i].stateID || 3508)}','${parentData.preferredtimezone}','${childData[i].cityId}','${(childData[i].childId || "")}','${childData[i].taxIdType}','${childData[i].taxIdType2}','${childData[i].city}','${childData[i].regionKey}','${childData[i].countryKey}','${childData[i].langu}','${childData[i].currency}','${childData[i].gstnStatus}','${childData[i].eInvoiceStatus}','${childData[i].taxpayerType}','${data.showApproval}','${childData[i].legalName}')" class="btn btn-xs yellow"><i class="fa fa-edit"></i>Extend</a>&nbsp;<a href="#"   onclick="AddVendor('${parentData.vendorID}','${parentData.vendorName}','${parentData.emailID}','${parentData.dialingCodePhone}','${parentData.phone}','${parentData.dialingCode} ','${parentData.mobileNo} ','${addr1}','${addr2}','${childData[i].zipCode}','${childData[i].taxId.toUpperCase()}','${(childData[i].isActive || "")}','${childData[i].taxId2.toUpperCase()}','${childData[i].action}','${parentData.vendorCode}','${parentData.alternateEmailID}','${(childData[i].countryID || "")} ','${(childData[i].stateID || "")}','${(childData[i].cityID || "")}')" class="btn btn-xs green hide"><i class="fa fa-plus"></i>Add</a></td></tr>`);



                        }
                        else {
                            if (parentData.action !== "Edit") {
                                disableParent();
                               

                                $('#tblVendorFoundDetails').append("<tr><td class='hide'>" + childData[i].childId + "</td><td>" + childData[i].companyName + "</td><td>" + addrC + "</td><td>" + taxIdNo + "</td><td><a href=\"#\"   onclick=\"EditVendor(\'" + parentData.vendorID + "'\,\'" + childData[i].companyName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCodeMobile + "'\,\'" + parentData.mobileNo + "'\,\'" + encodeURIComponent(StringDecodingMechanism(childData[i].address)) + "'\,\'" + childData[i].zipCode + "'\,\'" + (childData[i].taxId || "").toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + childData[i].taxId2.toUpperCase() + "'\,\'" + childData[i].action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].countryID || 111) + "'\,\'" + (childData[i].stateID || 3508) + "'\,\'" + parentData.preferredtimezone + "'\,\'" + (childData[i].cityId) + "'\,\'" + (childData[i].childId || "") + "'\,\'" + childData[i].taxIdType + "'\,\'" + childData[i].taxIdType2 + "'\,\'" + childData[i].city + "'\,\'" + childData[i].regionKey + "'\,\'" + childData[i].countryKey + "'\,\'" + childData[i].langu + "'\,\'" + childData[i].currency + "'\,\'" + childData[i].gstnStatus + "'\,\'" + childData[i].eInvoiceStatus + "'\,\'" + childData[i].taxpayerType + "'\,\'" + data.showApproval + "'\,\'" + childData[i].legalName + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Ext. Edit</a>&nbsp;<a href=\"#\"  onclick=\"AddVendor(\'" + parentData.vendorID + "'\,\'" + parentData.vendorName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCode + "'\,\'" + parentData.mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + childData[i].zipCode + "'\,\'" + childData[i].taxId.toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + childData[i].taxId2.toUpperCase() + "'\,\'" + childData[i].action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].countryID || "") + "'\,\'" + (childData[i].stateID || "") + "'\,\'" + (childData[i].cityID || "") + "'\,\'" + childData[i].taxIdType + "'\,\'" + childData[i].taxIdType2 + "'\,\'" + childData[i].city + "'\,\'" + childData[i].regionKey + "'\,\'" + childData[i].countryKey + "'\,\'" + childData[i].langu + "'\,\'" + childData[i].currency + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");



                            }
                            else {
                                enableParent();
                                
                                $('#tblVendorFoundDetails').append("<tr><td class='hide'>" + childData[i].childId + "</td><td>" + childData[i].companyName + "</td><td>" + addrC + "</td><td>" + taxIdNo + "</td><td><a href=\"#\"   onclick=\"EditVendor(\'" + parentData.vendorID + "'\,\'" + childData[i].companyName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCodeMobile + "'\,\'" + parentData.mobileNo + "'\,\'" + encodeURIComponent(StringDecodingMechanism(childData[i].address)) + "'\,\'" + childData[i].zipCode + "'\,\'" + (childData[i].taxId || "").toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + (childData[i].taxId2 || "").toUpperCase() + "'\,\'" + childData[i].action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].countryID || 111) + "'\,\'" + (childData[i].stateID || 3508) + "'\,\'" + parentData.preferredtimezone + "'\,\'" + (childData[i].cityId) + "'\,\'" + (childData[i].childId || "") + "'\,\'" + childData[i].taxIdType + "'\,\'" + childData[i].taxIdType2 + "'\,\'" + childData[i].city + "'\,\'" + childData[i].regionKey + "'\,\'" + childData[i].countryKey + "'\,\'" + childData[i].langu + "'\,\'" + childData[i].currency + "'\,\'" + childData[i].gstnStatus + "'\,\'" + childData[i].eInvoiceStatus + "'\,\'" + childData[i].taxpayerType + "'\,\'" + data.showApproval + "'\,\'" + childData[i].legalName + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a>&nbsp;<a href=\"#\"  onclick=\"AddVendor(\'" + parentData.vendorID + "'\,\'" + parentData.vendorName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCode + "'\,\'" + parentData.mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + childData[i].zipCode + "'\,\'" + childData[i].taxId.toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + (childData[i].taxId2 || "").toUpperCase() + "'\,\'" + childData[i].action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + childData[i].countryID + "'\,\'" + childData[i].stateID + "'\,\'" + childData[i].cityID + "'\,\'" + childData[i].taxIdType + "'\,\'" + childData[i].taxIdType2 + "'\,\'" + childData[i].city + "'\,\'" + childData[i].regionKey + "'\,\'" + childData[i].countryKey + "'\,\'" + childData[i].langu + "'\,\'" + childData[i].currency + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");


                            }
                            $('#btnAddAnother').removeClass('hide');
                        }
                    }

                }
                else {


                    $('#btnAddAnother').removeClass('hide');
                    if ($('#ddlUI').val() == "EmailID") {
                        $('#txtcompanyemail').val($('#txtUI').val())
                        $('#txtAlternateeMailID').val($('#txtUI').val())
                        $('#txtcompanyemail').attr('disabled', 'disabled')
                    }
                }
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {


                    $('#spanerterr').text(xhr.responseText);
                    jQuery('#divalerterr').slideDown('show');
                    App.scrollTo(jQuery('#divalerterr'), -200);
                    $('.alert-danger').fadeOut(2000);
                }
                jQuery.unblockUI();
                return false;
            }

        })


    }
    /* setTimeout(function () {
         jQuery('#divalerterr').css('display', 'none');
     }, 5000);*/
}

function AddVendor() {
    clearAddAnother();
    $("#showapproval").hide()
    $('#divVendorForm').removeClass('hide')
    $('#divVendorCompaniesForm').removeClass('hide')
    $('#divVendorFormbtn').removeClass('hide')
    $('#divVendorContactForm').removeClass('hide')
    $('#hdnFlagType').val("Add");
    $('#lbl_panmsz').addClass('hide');
    // $('#hdnParticipantID').val('0');

    if ($('#ddlUI').val() == "EmailID") {
        $('#txtcompanyemail').val($('#txtUI').val())
        $('#txtAlternateeMailID').val($('#txtUI').val())
        $('#txtcompanyemail').attr('disabled', 'disabled')
    }

    $('#txtAddress').removeAttr('disabled')
    $('#ddlState').removeAttr('disabled')
    $('#ddlCity').removeAttr('disabled')
    $('#txtZipCd').removeAttr('disabled')
    $('#ddlCountryCdPhone').removeAttr('disabled')
    $('#txtPhoneNo').removeAttr('disabled')



}
$("#txtUI").keyup(function () {
    clearformkeyup();
});
function EditVendor(vendorid, vname, emailid, dialingcodephone, phone, dialingcode, mobile, addr, zipcode, gst, isactive, pan, buttonname, vendorcode, alternateemailid, countryid, stateid, prefferredTZ, cityid, childid, taxIdType, taxIdType2, city, regionKey, countryKey, Langu, currency, gstnstatus, einvoicestatus, taxpayertype, showApproval, legalName) {


    $('#btnvendreg').removeAttr('disabled');
    $('#divVendorCompaniesForm').removeClass('hide')
    $('#divVendorFormbtn').removeClass('hide')
    $('#ddlCountry').val(countryKey).trigger('change')


    if (showApproval == "Y") {

        $("#showapproval").show()
        $("#Userapprovebtn").attr('onclick', `UpdateActivity('${vendorid}','${customerid}','${childid}','A')`)
        $("#Userrejectbtn").attr('onclick', `UpdateActivity('${vendorid}','${customerid}','${childid}','R')`)

    }
    else {
        $("#showapproval").hide()
    }

    if (taxIdType == 'IN3') {
        gstflag = true;
    }


    setTimeout(function () {

        $('#ddlState').val(regionKey).trigger('change')
    }, 500)


    setTimeout(function () {

        $('#ddlCity').val(cityid).trigger('change')

    }, 500)
    $('#hdnFlagType').val('Edit');
    $('#hdnChildID').val(childid);

    jQuery("#hdnParticipantID").val(vendorid);
    $("#hdnParticipantCode").val(vendorcode);
    jQuery("#ParticipantName").val(legalName);
    jQuery("#TradeName").val(vname);

    jQuery("#gstnStatus").val(gstnstatus);
    jQuery("#eInvoiceStatus").val(einvoicestatus);
    jQuery("#taxpayerType").val(taxpayertype);

    jQuery("#txtAddress").val(decodeURIComponent(addr));

    jQuery("#txtPanNo").val(pan);
    jQuery("#txtTINNo").val(gst);
    jQuery("#txtPhoneNo").val(phone);
    jQuery("#txtMobileNo").val(mobile);
    jQuery("#txtcompanyemail").val(emailid);
    jQuery("#txtAlternateeMailID").val(alternateemailid);
    jQuery("#txtZipCd").val(zipcode)

    /*$('#ddlpreferredTime').val(prefferredTZ).trigger('change') */

    //@abheedev

    $('#ddlCountryCd').val(dialingcode).trigger('change')
    $('#ddlCountryCdPhone').val(dialingcodephone).trigger('change')

    if (taxIdType == "") {
        $('#txtTINType').removeAttr('disabled');
    }
    else {
        $('#txtTINType').attr('disabled', 'disabled');
    }



    /*  if (isactive == "Y" || isactive.toLowerCase() == "yes") {
          jQuery('input:checkbox[name=chkIsActiveparticipant]').prop('checked', true);
          jQuery('#uniform-chkIsActiveparticipant').parents('div').addClass('checked');
      }
      else {
          jQuery('input:checkbox[name=chkIsActiveparticipant]').prop('checked', false);
          jQuery('#uniform-chkIsActiveparticipant').parents('div').removeClass('checked');
      }
  */
    $('#divVendorForm').removeClass('hide')
    $('#divVendorCompaniesForm').removeClass('hide')
    $('#divVendorFormbtn').removeClass('hide')
    $('#divVendorContactForm').removeClass('hide')
    fetchMapCategory('Z', childid);

    if (buttonname == "EditCustomerVendor") {
        $('#ParticipantName').attr('disabled', 'disabled');
        $('#txtAddress').attr('disabled', 'disabled');
        $('#txtCity').attr('disabled', 'disabled');
        $('#txtZipCd').attr('disabled', 'disabled');
        $('#txtPanNo').attr('disabled', 'disabled');
        $('#txtTINNo').attr('disabled', 'disabled');
        $('#ddlCountryCdPhone').attr('disabled', 'disabled');
        $('#txtPhoneNo').attr('disabled', 'disabled');
        /*$('#ddlCountryCd').attr('disabled', 'disabled');*/
        /*$('#txtMobileNo').attr('disabled', 'disabled');*/
        /*$('#txtcompanyemail').attr('disabled', 'disabled');*/
        $('#chkalternatemail').attr('disabled', 'disabled');
        /* $('#txtAlternateeMailID').attr('disabled', 'disabled')*/
        /*$("#ContactName").attr('disabled', 'disabled');*/
        $("#ddlCountry").attr('disabled', 'disabled');
        $("#ddlState").attr('disabled', 'disabled');
        $("#ddlCity").attr('disabled', 'disabled');
        /*$("#ddlpreferredTime").attr('disabled', 'disabled');*/
        $("#chkIsActiveparticipant").attr('disabled', 'disabled');
        $('#lbl_panmsz').removeClass('hide');
    }
    else {

        $('#ParticipantName').removeAttr('disabled');
        $('#TradeName').removeAttr('disabled');
        $('#txtAddress').removeAttr('disabled');
        $('#txtCity').removeAttr('disabled');
        $('#txtZipCd').removeAttr('disabled');
        $('#txtPanNo').removeAttr('disabled');
        $('#txtTINNo').removeAttr('disabled');
        $('#ddlCountryCdPhone').removeAttr('disabled');
        $('#txtPhoneNo').removeAttr('disabled');
        /* $('#ddlCountryCd').removeAttr('disabled');*/
        /*$('#txtMobileNo').removeAttr('disabled');*/
        /*$('#txtcompanyemail').removeAttr('disabled');*/
        $('#chkalternatemail').removeAttr('disabled');
        $("#ddlCountry").removeAttr('disabled');
        $("#ddlState").removeAttr('disabled');
        $("#ddlCity").removeAttr('disabled');
        //$('#txtAlternateeMailID').removeAttr('disabled')
        /*jQuery("#ContactName").removeAttr('disabled');*/
        $('#lbl_panmsz').addClass('hide');
    }
    $('#txtTINType').val(taxIdType).trigger('change')
}

function ExtendVendor(vendorid, vname, emailid, dialingcodephone, phone, dialingcode, mobile, addr, zipcode, gst, isactive, pan, buttonname, vendorcode, alternateemailid, countryid, stateid, prefferredTZ, cityid, childid, taxIdType, taxIdType2, city, regionKey, countryKey, Langu, currency, gstnstatus, einvoicestatus, taxpayertype, showApproval, legalName) {
    $('#btnvendreg').removeAttr('disabled');
    $('#ddlCountry').val(countryKey || "IN").trigger('change')
    $('#divVendorForm').removeClass('hide')
    $('#divVendorCompaniesForm').removeClass('hide')
    $('#divVendorFormbtn').removeClass('hide')
    $('#divVendorContactForm').removeClass('hide')
    $("#hdnParticipantID").val(vendorid);
    $("#hdnParticipantCode").val(vendorcode);
    $('#hdnFlagType').val('Edit');
    $('#hdnChildID').val(childid);
    $("#ParticipantName").val(legalName);
    $("#TradeName").val(vname);
    $("#txtAddress").val(decodeURIComponent(addr));
    $("#txtTINNo").val(gst);
    $("#txtPanNo").val(pan);

    $("#txtZipCd").val(zipcode);

    $("#txtPhoneNo").val(phone);

    $("#txtMobileNo").val(mobile);



    if (showApproval == "Y") {

        $("#showapproval").show()
        $("#Userapprovebtn").attr('onclick', `UpdateActivity('${vendorid}','${customerid}','${childid}','A')`)
        $("#Userrejectbtn").attr('onclick', `UpdateActivity('${vendorid}','${customerid}','${childid}','R')`)

    }
    else {
        $("#showapproval").hide()
    }

    if (taxIdType = 'IN3') {
        gstflag = true;
    }


    setTimeout(function () {

        $('#ddlState').val(regionKey).trigger('change')
    }, 500);

    setTimeout(function () {

        $('#ddlCity').val(cityid).trigger('change')

        $('#txtTINType').val(taxIdType).trigger('change')
        $('#txtTINType2').val(taxIdType2).trigger('change')
    }, 500);



    jQuery("#txtcompanyemail").val(emailid);
    jQuery("#txtAlternateeMailID").val(alternateemailid);
    //abheedev

    $('#ddlCountryCd').val(dialingcode)//.trigger('change')
    $('#ddlCountryCdPhone').val(dialingcodephone)//.trigger('change')
    $("#txtTINNo").val(gst);
    $("#txtPanNo").val(pan);

    jQuery("#gstnStatus").val(gstnstatus);
    jQuery("#eInvoiceStatus").val(einvoicestatus);
    jQuery("#taxpayerType").val(taxpayertype);







    setTimeout(function () {

        $('#ParticipantName').attr('disabled', 'disabled');
        $('#TradeName').attr('disabled', 'disabled');
        $('#txtAddress').attr('disabled', 'disabled');
        $('#txtCity').attr('disabled', 'disabled');
        $('#txtPanNo').attr('disabled', 'disabled');
        $('#txtTINNo').attr('disabled', 'disabled');
        $('#txtPhoneNo').attr('disabled', 'disabled');
        $('#txtTINType').attr('disabled', 'disabled');

        $('#txtTINType2').attr('disabled', 'disabled');
        /*$('#txtMobileNo').attr('disabled', 'disabled');*/
        /* $('#txtcompanyemail').attr('disabled', 'disabled');*/
        $('#chkalternatemail').attr('disabled', 'disabled');
        /* $('#txtAlternateeMailID').attr('disabled', 'disabled')*/
        /* jQuery("#ContactName").attr('disabled', 'disabled');*/
        jQuery("#ddlCountry").attr('disabled', 'disabled');
        jQuery("#ddlState").attr('disabled', 'disabled');
        jQuery("#ddlCity").attr('disabled', 'disabled');
        //@abheedev
        /* $('#ddlCountryCd').attr('disabled', 'disabled')*/
        $('#ddlCountryCdPhone').attr('disabled', 'disabled')

        fetchMapCategory('Z', childid);

        $('#lbl_panmsz').removeClass('hide');
    }, 500)

    /*if (isactive == "Y") {
        $('input:checkbox[name=chkIsActiveparticipant]').prop('checked', true);
        $('#chkIsActiveparticipant').parents('div').addClass('checked');
    }
    else {
        $('input:checkbox[name=chkIsActiveparticipant]').prop('checked', false);
        $('#chkIsActiveparticipant').parents('div').removeClass('checked');
    }*/

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
        "ProductCatID": InsertQuery,
        "ParticipantID": ParticipantID,
        "AssociatedVendorID": parseInt($('#hdnChildID').val()) || 0
    }
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RegisterParticipanttoCustomer_PEV2/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(RegisterParticipants),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data.isSuccess == '1') {
                $("#hdnParticipantID").val(data.participantID)
                $('#divalertsucess').slideDown('show');
                App.scrollTo(jQuery('#divalertsucess'), -200);
                clearform();

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
            fetchParticipantsVenderTable(0, SearchText);

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
//abheedev bug 590
function clearform() {

    jQuery("#ParticipantName").val('');
    jQuery("#ContactName").val('');
    jQuery("#txtAddress").val('');
    jQuery("#txtCity").val('');
    jQuery("#txtZipCd").val('');
    jQuery("#txtPanNo").val('');
    /*jQuery("#txtTINNo").val('');*/
    jQuery("#txtPhoneNo").val('');
    jQuery("#txtMobileNo").val('');
    jQuery("#txtcompanyemail").val('');
    jQuery("#txtAlternateeMailID").val('');
    jQuery('#hdnParticipantID').val('0');
    $("#ddlCountry").val('IN');

    $('.childchkbox').each(function () {
        jQuery(this).closest('span#spancheckedvendorgroup').removeAttr('class');
    })
    status = "True"
    $('#ParticipantName').removeAttr('disabled')
    $('#ContactName').removeAttr('disabled')
    $('#txtAddress').removeAttr('disabled')
    $('#ContactName').removeAttr('disabled')
    $('#txtCity').removeAttr('disabled')
    $('#txtZipCd').removeAttr('disabled')
    $('#txtPanNo').removeAttr('disabled')
    $('#txtTINNo').removeAttr('disabled')
    $('#ddlCountryCdPhone').removeAttr('disabled')
    $('#txtPhoneNo').removeAttr('disabled')
    $('#ddlCountryCd').removeAttr('disabled')
    $('#txtMobileNo').removeAttr('disabled')
    $('#ddlpreferredTime').removeAttr('disabled')
    $('#chkalternatemail').removeAttr('disabled')
    $('#ddlCountry').removeAttr('disabled')
    $('#ddlState').removeAttr('disabled')
    $('#ddlCity').removeAttr('disabled')
    jQuery("#hdnParticipantID").val(0)
    jQuery("#hdnParticipantCode").val(0)
    jQuery("#hdnFlagType").val(0)
    $('#divVendorForm').addClass('hide')
    $('#divVendorCompaniesForm').addClass('hide')
    $('#divVendorFormbtn').addClass('hide')
    $('#divVendorContactForm').addClass('hide')
    $('#lbl_panmsz').addClass('hide')
    $('#btnAddAnother').addClass('hide');
    //  $('#div_tableVendor').addClass('hide');

}
function clearAddAnother() {
    jQuery("#txtPanNo").val('');
    jQuery("#txtTINNo").val('');
    jQuery("#ParticipantName").val('');
    jQuery("#txtAddress").val('');
    $("#ddlCountry").val('IN');
    jQuery("#txtZipCd").val('');
    jQuery("#txtPhoneNo").val('');
    $('#txtTINType').removeAttr('disabled');
    jQuery("#TradeName").val('');

    $('.childchkbox').each(function () {
        jQuery(this).closest('span#spancheckedvendorgroup').removeAttr('class');
    })
}

function fnchangeplaceholder() {
    clearform();
    if ($('#ddlUI  option:selected').val() == "VendorCode") {
        $("#txtUI").attr('maxlength', '11');
        $("#txtUI").attr('minlength', '11');
    }
    else {
        $("#txtUI").removeAttr('maxlength');
        $("#txtUI").removeAttr('minlength');
    }
    /* $('#txtUI').val('');
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
     }*/

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
        dataType: "json",
        success: function (data) {

            $("#ddlCountry").empty();
            $("#ddlCountryCd").empty();
            $("#ddlCountryCdPhone").empty();
            var vlal = new Array();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCountry").append("<option value='" + data[i].countryKey + "' data-countryid='" + data[i].countryID + "'>" + data[i].countryName + "</option>");
                    $("#ddlCountryCd").append(jQuery("<option></option>").val(data[i].countryID).html(data[i].dialingCode));
                    $("#ddlCountryCdPhone").append("<option value=" + data[i].countryID + ">" + data[i].dialingCode + "</option>");
                }

                $("#ddlCountry").val('IN').trigger("change");

                $("#ddlCountryCd").val('111');
                $("#ddlCountryCdPhone").val('111');



            }
            else {
                $("#ddlCountry").append('<tr><td>No countries found..</td></tr>');
            }

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
            jQuery("#ddlpreferredTimem").empty();
            jQuery("#ddlpreferredTimem").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < lstTZ.length; i++) {

                jQuery("#ddlpreferredTimem").append(jQuery("<option ></option>").val(lstTZ[i].id).html(lstTZ[i].timezonelong));
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



function fetchCity(stateid) {

    if (stateid == null) {
        stateid = 0;
    }
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
                $("#ddlCity").append("<option value=0 data-cityName='" + "" + "'>Select City</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCity").append("<option value=" + data[i].cityID + " data-cityName='" + data[i].cityName + "'>" + data[i].cityName + "</option>");
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

    fnDownloadAttachments($("#" + aID.id).html(), 'VR/' + jQuery("#hdnChildID").val());
}





function extractPan() {
  
    let data = $("#txtTINNo").val();
    $('#txtTINNo').removeClass("gstvalidicon")
    var reggst = /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/


    if (data.length === 15) {
        if (!reggst.test(data)) {
            gstflag = true;
            bootbox.alert('GST Number Format is not valid. please check it');
            return false;

        }

        ValidateGST(data)

    }
    else {
        gstflag = true;
        $("#txtPanNo").val("");
        // $("#txtPanNo").removeAttr("disabled", "disabled");
        beforeTaxDisable()
    }

}


function ValidateGST(data) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    let GSTNo = data
  
    let url = sessionStorage.getItem("APIPath") + "BlobFiles/ValidateGST/?GSTNo=" + GSTNo;
    jQuery.ajax({
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            
            if (status != 'E') {
                if (data.status != 'E') {
                    var data = jQuery.parseJSON(data);
                    gstflag = true
                    let panNumber = ""
                    let legalName = data.legalNameOfBusiness
                    let tradeName = data.tradeName

                    let tradeaddress = `${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.buildingName} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.buildingNumber} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.streetName} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.location} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.districtName} `

                    let gststatus = data.gstnStatus
                    let eInvoiceStatus = data.eInvoiceStatus
                    let taxpayerType = data.taxpayerType
                    let stateName = data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.stateName
                    let pincode = data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.pincode

                    $('#txtTINNo').addClass("gstvalidicon")


                    panNumber = data.gstIdentificationNumber.substring(2, 12);
                    $("#txtPanNo").val(panNumber);
                    $("#txtPanNo").attr("disabled", "disabled");
                    afterTaxEnable()
                    $("#ParticipantName").val(legalName);
                    $("#ParticipantName").attr("disabled", "disabled");
                    $("#TradeName").val(tradeName);
                    $("#txtAddress").val(tradeaddress);

                    $("#gstnStatus").val(gststatus);
                    $("#eInvoiceStatus").val(eInvoiceStatus);
                    $("#taxpayerType").val(taxpayerType);
                    $("#txtZipCd").val(pincode);



                    alertforinfo('GST Number is validated successfully.')
                    jQuery.unblockUI();
                    
                    jQuery("#ddlState").find(`option[data-statename='${stateName}']`).prop('selected', true).trigger('change');

                    setTimeout(function () {

                        $('#txtTINNo').removeClass("gstvalidicon");
                    }, 2000);
                }
                else {

                    alertforerror('GST Number could not be validated')

                }
            }
            else {
                alertforerror('GST Number could not be validated')
                beforeTaxDisable()

            }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {
           
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {

                alertforerror(err)

            }
            jQuery.unblockUI();
            return false;
        }

    })
   
}

function beforeTaxDisable() {
    $('#ParticipantName').attr('disabled', 'disabled');
    /* $('#ContactName').attr('disabled', 'disabled');*/
    $('#txtAddress').attr('disabled', 'disabled');
    $('#txtPanNo').attr('disabled', 'disabled');
    $('#ddlState').attr('disabled', 'disabled');
    $('#ddlCity').attr('disabled', 'disabled');
    $('#txtZipCd').attr('disabled', 'disabled');
    /* $('#ddlCountryCd').attr('disabled', 'disabled');*/
    /* $('#txtMobileNo').attr('disabled', 'disabled');*/
    $('#ddlCountryCdPhone').attr('disabled', 'disabled');
    $('#txtPhoneNo').attr('disabled', 'disabled');
   /* $('#ddlpreferredTime').attr('disabled', 'disabled');*/
   /* $('#txtcompanyemail').attr('disabled', 'disabled')*/;
    $('#chkalternatemail').attr('disabled', 'disabled');
    $('#chkIsActiveparticipant').attr('disabled', 'disabled');

}

function afterTaxEnable() {
    // $('#ParticipantName').removeAttr('disabled');
    /*$('#ContactName').removeAttr('disabled');*/
    $('#txtAddress').removeAttr('disabled');
    $('#ddlState').removeAttr('disabled');
    $('#ddlCity').removeAttr('disabled');
    $('#txtZipCd').removeAttr('disabled');
    /* $('#ddlCountryCd').removeAttr('disabled');*/
    /* $('#txtMobileNo').removeAttr('disabled');*/
    $('#ddlCountryCdPhone').removeAttr('disabled');
    $('#txtPhoneNo').removeAttr('disabled');
    /*$('#ddlpreferredTime').removeAttr('disabled');*/
    /*$('#txtcompanyemail').removeAttr('disabled');*/
    $('#chkalternatemail').removeAttr('disabled');
    $('#chkIsActiveparticipant').removeAttr('disabled');

}


// validating email

function validateEmail() {

    email = $("#txtUI").val();
    // Define a regular expression pattern for valid email addresses
    var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Use the test() method of the pattern object to match the pattern to the email address
    if (pattern.test(email)) {
        return true
    }
    else {

        return false
    }
}

function clearformkeyup() {

    jQuery("#ParticipantName").val('');
    jQuery("#ContactName").val('');
    jQuery("#txtAddress").val('');
    jQuery("#txtCity").val('');
    jQuery("#txtZipCd").val('');
    jQuery("#txtPanNo").val('');
    jQuery("#TradeName").val('');
    /* jQuery("#txtTINNo").val('');*/
    jQuery("#txtPhoneNo").val('');
    jQuery("#txtMobileNo").val('');
    jQuery("#ContactName").val('');
    jQuery("#txtcompanyemail").val('');
    jQuery("#txtAlternateeMailID").val('');
    jQuery('#hdnParticipantID').val('0');
    $("#ddlCountry").val('111');

    $('.childchkbox').each(function () {
        jQuery(this).closest('span#spancheckedvendorgroup').removeAttr('class');
    })
    status = "True"
    $('#ParticipantName').removeAttr('disabled')
    $('#txtAddress').removeAttr('disabled')
    /* $('#ContactName').removeAttr('disabled')*/
    //$('#txtCity').removeAttr('disabled')
    $('#txtZipCd').removeAttr('disabled')
    $('#txtPanNo').removeAttr('disabled')
    $('#txtTINNo').removeAttr('disabled')
    $('#ddlCountryCdPhone').removeAttr('disabled')
    $('#txtPhoneNo').removeAttr('disabled')
    /* $('#ddlCountryCd').removeAttr('disabled')*/
    /*$('#txtMobileNo').removeAttr('disabled')*/
    /*$('#txtcompanyemail').removeAttr('disabled')*/
    $('#chkalternatemail').removeAttr('disabled')
    $('#ddlCountry').removeAttr('disabled')
    $('#ddlState').removeAttr('disabled')
    $('#ddlCity').removeAttr('disabled')
    jQuery("#hdnParticipantID").val(0)
    jQuery("#hdnParticipantCode").val(0)
    jQuery("#hdnFlagType").val(0)
    $('#divVendorForm').addClass('hide')
    $('#divVendorCompaniesForm').addClass('hide')
    $('#divVendorFormbtn').addClass('hide')
    $('#divVendorContactForm').addClass('hide')
    $('#lbl_panmsz').addClass('hide')
    $('#div_tableVendor').addClass('hide');
    $('#btnAddAnother').addClass('hide');
}

function routeToInviteVendor() {
    window.location.href = "InviteVendor.html";
}


function editTableVendor(vendoremail) {

    $('#txtUI').val(vendoremail)
    fnfetchfoundVendors()
}

function disableParent() {

    $("#ContactName").attr('disabled', 'disabled');
    $('#ddlCountryCd').attr('disabled', 'disabled')
    $('#txtMobileNo').attr('disabled', 'disabled')
    $('#txtcompanyemail').attr('disabled', 'disabled')
    $('#chkalternatemail').attr('disabled', 'disabled')
    $('#ddlpreferredTime').attr('disabled', 'disabled')
    $('#chkIsActiveparticipant').attr('disabled', 'disabled');
}

function enableParent() {

    $("#ContactName").removeAttr('disabled');
    $('#ddlCountryCd').removeAttr('disabled');
    $('#txtMobileNo').removeAttr('disabled');
    // $('#txtcompanyemail').removeAttr('disabled');
    $('#chkalternatemail').removeAttr('disabled');
    $('#ddlpreferredTime').removeAttr('disabled');
    $('#chkIsActiveparticipant').removeAttr('disabled');
}

//advance vendor search
function fetchAdvanceSearch() {

    let categoryresult = [];
    let selectedValue = $('#txtsearchvendor').val();
    if ($("#txtsearchcat").select2('data').length) {
        $.each($("#txtsearchcat").select2('data'), function (key, item) {

            var CategoryTypeId = {
                "CategoryID": parseInt(item.id)
            }


            categoryresult.push(CategoryTypeId);
            sessionStorage.setItem('hdnCategoryGrpID', JSON.stringify(categoryresult));
        });

    }
    if (selectedValue) {
        sessionStorage.setItem('hdnVendorID', selectedValue);
    }


    fnfetchCatVendors()
}


//fetchvendorsdetails

function fetchVendorRegistrationDetails(custid, vendId) {

    console.log(sessionStorage.getItem("APIPath") + "VendorLCM/GetVendorById/?Id=" + vendId + "&CustomerId=" + custid)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "RegisterParticipants/GetVendors/?FieldName=" + $('#ddlUI').val() + "&FieldValue=" + $('#txtUI').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        url: sessionStorage.getItem("APIPath") + "VendorLCM/GetVendorById/?Id=" + vendId + "&CustomerId=" + custid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            /* if (!data.isVendorPresent) {
                 $("#hdnFlagType").val("New")
                 $('#divVendorForm').removeClass('hide')
                 $('#divVendorCompaniesForm').removeClass('hide')
                 $('#divVendorFormbtn').removeClass('hide')
                 $('#divVendorContactForm').removeClass('hide')
                 $('#txtcompanyemail').val($('#txtUI').val())
                 $('#txtAlternateeMailID').val($('#txtUI').val())
                 $('#txtcompanyemail').attr('disabled', 'disabled')
                 return true

             }*/
            //
            let parentData = data.vendorMasterToReturn;
            let childData = data.vendorChildrenToReturn;
            ParticipantCode = parentData.vendorCode;
            Participantid = parentData.vendorID;
            $('#spnvendorcode').text(Participantid)
            let isactiveUser = parentData.isActive;
          
            $("#personname").text(StringDecodingMechanism(parentData.contactPerson))
            $("#personnamealt").text(StringDecodingMechanism(parentData.contactNameAlt))


            $("#hdnVendorCode").val(parentData.vendorCode) //hidden vendor code

            $("#vendormobileno").text(parentData.mobileNo)
            $("#vendoraltmobileno").text(parentData.phone)
            $("#ddlCountryCdm").text(parentData.mobilePrefix)
            $("#ddlCountryAltCd").text(parentData.phonePrefix)

            $("#showapprovalM").hide()

            $("#vendorEmailID").text(parentData.emailID)
            if (parentData.alternateEmailID == "") {
                $("#vendorAltEmailID").text(parentData.emailID)
            }
            else {
                $("#vendorAltEmailID").text(parentData.alternateEmailID)
            }

            $('#ddlpreferredTimem').val(parentData.preferredtimezone).trigger('change') //abheedev 28/11/2022 bug 530


            sapselection() //select2 for sap

            $('#tblCompaniesFoundDetails').empty();
            var addr1 = "";
            var addr2 = "";
            let taxIdNo = "";
            let addrC = "";
            if (childData.length > 0) {

                $('#tblCompaniesFoundDetails').append("<thead><tr><th class='hide'></th><th>Company Name</th><th>Address</th><th>Tax Identification Number</th><th></th></tr></thead><tbody>")

                for (var i = 0; i < childData.length; i++) {

                    //AssociatedVendorID = childData[i].childId;
                    addr1 = (childData[i].address1 || "").replace(/\n/g, " ");
                    addr2 = (childData[i].address2 || "").replace(/\n/g, " ");
                    taxIdNo = childData[i].taxId;
                    addrC = childData[i].address + " " + childData[i].city + " " + childData[i].state + " " + childData[i].country;
                   

                    $('#tblCompaniesFoundDetails').append("<tr><td class='hide'>" + childData[i].childId + "</td><td>" + childData[i].companyName + "</td><td>" + addrC + "</td><td>" + taxIdNo + "</td><td><a href=\"#\"   onclick=\"EditVendorModal(\'" + parentData.vendorID + "'\,\'" + childData[i].companyName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCodeMobile + "'\,\'" + parentData.mobileNo + "'\,\'" + childData[i].address + "'\,\'" + childData[i].zipCode + "'\,\'" + (childData[i].taxId || "").toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + childData[i].taxId2.toUpperCase() + "'\,\'" + parentData.action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].country || "") + "'\,\'" + (childData[i].state || "") + "'\,\'" + parentData.preferredtimezone + "'\,\'" + (childData[i].city || "") + "'\,\'" + (childData[i].childId || "") + "'\,\'" + (childData[i].supplierType || "0") + "'\,\'" + (childData[i].msmeCheck || "N") + "'\,\'" + (childData[i].msmeType || "0") + "'\,\'" + (childData[i].msme || "") + "'\,\'" + (childData[i].msmeFile || "") + "'\,\'" + (childData[i].taxIdFile || "") + "'\,\'" + (childData[i].taxId2File || "") + "'\,\'" + (childData[i].payTerm || "0") + "'\,\'" + (childData[i].bankName || "") + "'\,\'" + (childData[i].bankRoutingNumber || "") + "'\,\'" + (childData[i].bankAccountNumber || "") + "'\,\'" + (childData[i].cancelledCheckFile || "") + "'\,\'" + childData[i].taxIdType + "'\,\'" + childData[i].taxIdType2 + "'\,\'" + childData[i].regionKey + "'\,\'" + childData[i].countryKey + "'\,\'" + childData[i].langu + "'\,\'" + childData[i].currency + "'\,\'" + childData[i].gstnStatus + "'\,\'" + childData[i].eInvoiceStatus + "'\,\'" + childData[i].taxpayerType + "'\,\'" + data.showApproval + "'\,\'" + childData[i].legalName + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-expand\"></i>Expand</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + parentData.vendorID + "'\,\'" + parentData.vendorName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCode + "'\,\'" + parentData.mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + childData[i].zipCode + "'\,\'" + childData[i].taxId.toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + childData[i].taxId2.toUpperCase() + "'\,\'" + childData[i].action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].countryID || "") + "'\,\'" + (childData[i].stateID || "") + "'\,\'" + (childData[i].cityId || "") + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");
                    $('#btnAddAnother').removeClass('hide');


                }

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', 'network error');
            }
            jQuery.unblockUI();
            return false;
        }

    })



    setTimeout(function () {
        jQuery('#divalerterr').css('display', 'none');
    }, 5000);
}

function EditVendorModal(vendorid, vname, emailid, dialingcodephone, phone, dialingcode, mobile, addr, zipcode, gst, isactive, pan, buttonname, vendorcode, alternateemailid, country, state, prefferredTZ, city, childid, supplierType, msmeCheck, msmeType, msmeNo, msmeFile, taxIdFile, taxId2File, payTerm, bankName, bankRoutingNumber, bankAccountNumber, cancelledCheckFile, taxIdType, taxIdType2, regionKey, countryKey, Langu, currency, gstnstatus, einvoicestatus, taxpayertype, showApproval, legalName) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    setTimeout(function () {

        clearexternal()
        $('#childDetailsForm').removeClass('hide')
        $("#bankaccordion").show()
        $("#financeaccordion").show()
        $('#ddlCountrym').text(country)
        $('#ddlStatem').text(state)
        $('#ddlCitym').text(city)
        $('#txtTINTypemodal').text(taxIdType)
        $('#txtTINTypemodal2').text(taxIdType2)

        if (showApproval == "Y") {

            $("#showapprovalM").show()
            $("#UserapprovebtnM").attr('onclick', `UpdateActivity('${vendorid}','${customerid}','${childid}','A')`)
            $("#UserrejectbtnM").attr('onclick', `UpdateActivity('${vendorid}','${customerid}','${childid}','R')`)

        }
        else {
            $("#showapprovalM").hide()
        }


        $('#ddllanguagemodal').text(Langu)
        $('#ddlcurrencymodal').text(currency)


        $('#hdnCountryKey').val(countryKey)
        $('#hdnRegionKey').val(regionKey)

        $('#tradenamem').text(vname)
        $('#gstnstatusm').text(gstnstatus)
        $('#einvoicestatusm').text(einvoicestatus)
        $('#taxpayertypem').text(taxpayertype)




        jQuery("#vendorname").text(legalName);
        jQuery("#vendoraddress").text(addr);

        jQuery("#vendorpanno").text(pan);

        jQuery("#txtTINNom").text(gst);
        jQuery("#txtPhoneNo").text(phone);
        jQuery("#txtMobileNo").text(mobile);
        jQuery("#txtcompanyemail").text(emailid);
        jQuery("#txtAlternateeMailID").text(alternateemailid);
        jQuery("#pincode").text(zipcode)


        $('.radio').find('span').removeClass('checked');

        //@abheedev


        //company specific
        jQuery("#ddlNatureEstaiblishment").text("Private Limited Company");
        $('#ddlVendorType').val(supplierType).trigger('change')
        if (supplierType == "1") {
            $('#ddlVendorType').text("Supply Vendor")
        }
        else if (supplierType == "2") {
            $('#ddlVendorType').text("Service Vendor")
        }
        else if (supplierType == "3") {
            $('#ddlVendorType').text("Both")
        }
        else {
            $('#ddlVendorType').text("")
        }
        if (msmeCheck == "Y") {
            $('#ddlMSME').text("Yes")
        }
        else if (msmeCheck == "N") {
            $('#ddlMSME').text("No")
        }
        else {
            $('#ddlMSME').text("")
        }

        // $('#ddlMSMEClass').val(msmeType).trigger('change')
        // $('#txtUdyam').val(msmeNo)
        // $('#msmeattach').html(msmeFile)
        $('#gstattach').html(taxIdFile)
        $('#panattach').html(taxId2File)

        //Bank specific
        /* $('#ddPayTerms').val("0").trigger('change')
         $('#ifsccode').val("")
         $('#bankname').val("")
         $('#bankaccount').val("")
         $('#accountholder').val("")
         $('#checkattach').html("")*/

        //finance specific




        $('#txtTINNo').attr('disabled', 'disabled');
        $('#ddlCountry').attr('disabled', 'disabled');
        $('#vendorpanno').attr('disabled', 'disabled');

        $('#vendorname').attr('disabled', 'disabled');
        $('#ddlNatureEstaiblishment').attr('disabled', 'disabled');

        //hide tags
        $('#bankForm').hide();
        $('#financeform').hide();
        $("#txtTINNo").removeAttr("onchange");
        $("#hdnChildID").val(childid)
        $("#hdnVendorId").val(vendorid)


        GetFinancialDetail(parseInt(childid), parseInt(vendorid))
        GetBankDetail(parseInt(childid), customerid, parseInt(vendorid))

        GetCustomerSpecificMaster(customerid) //function defined in common.js
        GetCountrySpecificMaster(countryKey)  //function defined in common.js

        if (isSapIntegrated == 'Y') {
            jQuery("#sapuseraccordion").show()
            GetVendorExternalDetail(parseInt(vendorid), parseInt(childid), customerid)

        }
        else {
            jQuery("#sapuseraccordion").hide()
        }


        jQuery.unblockUI()


    }, 500)


}


/*function GetBankDetail(ChildId, customerid) {

   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/GetBankDetail/?ChildId=" + ChildId + "&CustomerId=" + customerid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (childData) {
    
            if (childData.length > 0) {
                $('#tblGetBankDetail').empty();
                $('#tblGetBankDetail').append("<thead><tr><th>Action</th><th>Bank Name</th><th>Account Number</th><th>IFSC Code</th></tr></thead><tbody>");
                for (var i = 0; i < childData.length; i++) {


                    $('#tblGetBankDetail').append("<tr><td><button type='button' class='btn btn-xs btn-primary' onclick=\" expandBankDetail(\'" + childData[i].bankingId + "'\,\'" + childData[i].childId + "'\,\'" + childData[i].bankCountryKey + "'\,\'" + childData[i].bankRoutingNumber + "'\,\'" + childData[i].bankName + "'\,\'" + childData[i].cancelledCheckFile + "'\,\'" + childData[i].payTerm + "'\,\'" + childData[i].bankAccountNumber + "'\,\'" + childData[i].bankCountryKey + "'\)\">Expand</button></td><td>" + childData[i].bankName + "</td><td>" + childData[i].bankAccountNumber + "</td><td>" + childData[i].bankRoutingNumber + "</td></tr>")


                }

                jQuery.unblockUI();

            }
            else {
                $('#tblGetBankDetail').empty();
            }

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
}*/



function GetBankDetail(ChildId, CustId, vendorid) {
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/GetBankDetail/?ChildId=" + ChildId + "&CustomerId=" + CustId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (childData) {
           

            let isBVerify = ""
            $('#mapMN').val($('#vendormobileno').val())
            if (childData.length > 0) {
                $('#tblGetBankDetail').empty();


                $('#tblGetBankDetail').append("<thead><tr><th>Action</th><th>Bank Name</th><th>Account Number</th><th>IFSC Code</th></tr></thead><tbody>");
                for (var i = 0; i < childData.length; i++) {
                    isBVerify = childData[i].isVerified;
                    
                    if (isBVerify == "Y") {
                         if (customerid == 37) {
                               $('#tblGetBankDetail').append("<tr onclick=''><td><button type='button' class='btn btn-xs btn-primary' onclick=\"editBankDetail('" + childData[i].bankingId + "','" + childData[i].childId + "','" + childData[i].bankCountryKey + "','" + childData[i].bankRoutingNumber + "','" + childData[i].bankName + "','" + childData[i].cancelledCheckFile + "','" + childData[i].payTerm + "','" + childData[i].bankAccountNumber + "','" + childData[i].accounHolderName + "')\">Edit</button></td><td  onclick=\"viewbankcustomer(\'" + "accordion" + childData[i].bankingId + "'\)\">" + childData[i].bankName + "</td><td>" + childData[i].bankAccountNumber + "  <img src='assets/img/greenchecktick.svg' width='25px' height='25px' style='{margin-bottom:4px;}'/></td><td>" + childData[i].bankRoutingNumber + "</td></tr>");

                         }
                         else{
                              $('#tblGetBankDetail').append("<tr onclick=''><td><button type='button' class='btn btn-xs btn-primary' onclick=\"editBankDetail('" + childData[i].bankingId + "','" + childData[i].childId + "','" + childData[i].bankCountryKey + "','" + childData[i].bankRoutingNumber + "','" + childData[i].bankName + "','" + childData[i].cancelledCheckFile + "','" + childData[i].payTerm + "','" + childData[i].bankAccountNumber + "','" + childData[i].accounHolderName + "')\">Edit</button></td><td  onclick=\"viewbankcustomer(\'" + "accordion" + childData[i].bankingId + "'\)\">" + childData[i].bankName + "</td><td>" + childData[i].bankAccountNumber + "</td><td>" + childData[i].bankRoutingNumber + "</td></tr>");
 
                         }
                      
                    }
                    else {
                        
                        if (customerid == 37) {
                           $('#tblGetBankDetail').append("<tr onclick=''><td><button type='button' class='btn btn-xs btn-primary' onclick=\"editBankDetail('" + childData[i].bankingId + "','" + childData[i].childId + "','" + childData[i].bankCountryKey + "','" + childData[i].bankRoutingNumber + "','" + childData[i].bankName + "','" + childData[i].cancelledCheckFile + "','" + childData[i].payTerm + "','" + childData[i].bankAccountNumber + "','" + childData[i].accounHolderName + "')\">Edit</button><button type='button' class='btn btn-xs btn-warning hovertextLeft '   data-hover='Click here to verify bank account' onclick=\"IciciBankPennyDropVerify('" + childData[i].childId + "','" + childData[i].bankRoutingNumber + "','" + childData[i].bankName + "','" + childData[i].bankAccountNumber + "','" + childData[i].accounHolderName + "')\">Verify</button></td><td  onclick=\"viewbankcustomer(\'" + "accordion" + childData[i].bankingId + "'\)\">" + childData[i].bankName + "</td><td>" + childData[i].bankAccountNumber + "</td><td>" + childData[i].bankRoutingNumber + "</td></tr>");
 
                        }
                        else{
                            $('#tblGetBankDetail').append("<tr onclick=''><td><button type='button' class='btn btn-xs btn-primary' onclick=\"editBankDetail('" + childData[i].bankingId + "','" + childData[i].childId + "','" + childData[i].bankCountryKey + "','" + childData[i].bankRoutingNumber + "','" + childData[i].bankName + "','" + childData[i].cancelledCheckFile + "','" + childData[i].payTerm + "','" + childData[i].bankAccountNumber + "','" + childData[i].accounHolderName + "')\">Edit</button></td><td  onclick=\"viewbankcustomer(\'" + "accordion" + childData[i].bankingId + "'\)\">" + childData[i].bankName + "</td><td>" + childData[i].bankAccountNumber + "</td><td>" + childData[i].bankRoutingNumber + "</td></tr>");

                        }
                        
                    }

                    if (childData[i].mappedCustomersList.length > 0) {

                        $('#tblGetBankDetail').append("<tr style='display:none' class='accordion" + childData[i].bankingId + "'><th colspan='5'>Customer list</th></tr>");

                    }
                    else {
                        $('#tblGetBankDetail').append("<tr style='display:none' class='accordion" + childData[i].bankingId + "'><th colspan='5'>No customer is associated with this bank account</th></tr>");

                    }
                    for (var j = 0; j < childData[i].mappedCustomersList.length; j++) {

                        $('#tblGetBankDetail').append("<tr style='display:none' class='accordion" + childData[i].bankingId + "'><td colspan='5'>" + childData[i].mappedCustomersList[j].customerName + "</td><td class='hide'>" + childData[i].mappedCustomersList[j].mappingId + "</td><td class='hide'>" + childData[i].mappedCustomersList[j].bankingId + "</td><td class='hide'>" + childData[i].mappedCustomersList[j].associateVendorId + "</td><td class='hide'>" + childData[i].mappedCustomersList[j].customerId + "</td></tr>")

                    }

                }

                jQuery.unblockUI();

            }
            else {
                $('#tblGetBankDetail').empty();
            }

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



function expandBankDetail(bankingId, childId, bankCountryKey, bankRoutingNumber, bankName, cancelledCheckFile, payTerm, bankAccountNumber, bankCountryKey) {

    $('#bankForm').show();

    jQuery("#ifsccode").text(bankRoutingNumber)
    jQuery("#bankaccount").text(bankAccountNumber)
    jQuery("#bankname").text(bankName)
    jQuery("#accountholder").text(jQuery("#vendorname").text())
    jQuery("#bankCountryKey").text(bankCountryKey)


    $('#checkattach').html(cancelledCheckFile);
}

function GetFinancialDetail(ChildId, VendId) {


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/GetFinancialDetail/?Id=" + VendId + "&ChildId=" + ChildId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (childData) {

            if (childData.length > 0) {
                $('#tblGetFinancialDetail').empty()
                $('#tblGetFinancialDetail').append("<thead><tr><th class='hide'></th><th>Turn Over</th><th>Financial Year</th><th>Attachment</th></tr></thead><tbody>")
                for (var i = 0; i < childData.length; i++) {



                    if (childData[i].attachmentName) {
                        $('#tblGetFinancialDetail').append(`<tr><td class='hide'>${childData[i].financialDetailId}</td><td>${thousands_separators(childData[i].turnover)}  ${childData[i].currency}</td><td>${childData[i].financialYearFrom}  - ${childData[i].financialYearTo} </td><td><a href="javascript:;" onclick="DownloadFile(this)" id="financeattach${i}" class="txtleftnone">${(childData[i].attachmentName)}</a></td></tr>`)

                    }
                    else {
                        $('#tblGetFinancialDetail').append(`<tr><td class='hide'>${childData[i].financialDetailId}</td><td>${thousands_separators(childData[i].turnover)}  ${childData[i].currency}</td><td>${childData[i].financialYearFrom}  - ${childData[i].financialYearTo} </td><td></td></tr>`)

                    }

                }

                jQuery.unblockUI();
            }
            else {
                $('#tblGetFinancialDetail').empty()
            }
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



function fetchpayment() {

    $("#ddPayTerms").select2({
        searchInputPlaceholder: "Search",
        allowClear: true
    });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchMasters?CustomerID=1",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {




            $("#ddPayTerms").empty();
            if (data.result.lstPaymentTerm.length > 0) {

                $("#ddPayTerms").append("<option value=0>Select Payment Terms</option>");
                for (var i = 0; i < data.result.lstPaymentTerm.length; i++) {
                    $("#ddPayTerms").append("<option value=" + data.result.lstPaymentTerm[i].termID + ">" + data.result.lstPaymentTerm[i].paymentTerm + "</option>");
                }
                $("#ddPayTerms").val('0').trigger("change");
            }
            else {
                $("#ddPayTerms").append('<tr><td>No payment terms found..</td></tr>');
            }



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




function GetVendorExternalDetail(vendId, ChildId, CustId) {
   

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/GetVendorExternalDetail/?Id=" + vendId + "&ChildId=" + ChildId + "&CustomerId=" + CustId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {


            if (!data) {
                jQuery("#hdnExternalActionTypeUser").val("Add");
                jQuery("#hdnExternalActionTypeFinancer").val("Add");
                $("#btnPostToExternalSource").hide();
                $("#sapwitholdingtaxaccordion").hide();
                $("#UpdateUserByDetail").removeAttr("disabled");

                return false

            }

           
            if (data.coCd !== 0 || data.vendorAccGrp !== "0") {
                jQuery("#hdnExternalActionTypeFinancer").val("Update");
                jQuery("#hdnExternalActionTypeUser").val("Update")
            }
            else {
                jQuery("#hdnExternalActionTypeFinancer").val("Add");
                jQuery("#hdnExternalActionTypeUser").val("Add");
            }


            if (data.coCd !== 0) {
                $("#sapwitholdingtaxaccordion").show();
            }
            else {
                $("#sapwitholdingtaxaccordion").hide();
            }

            if (data.partnerNumber == "") {
               $("#btnPostToExternalSource").hide();//$("#btnPostToExternalSource").show();
                
               
                $("#UpdateUserByDetail").removeAttr("disabled");
            }
            else {
                $("#btnPostToExternalSource").hide();
                $("#externalsourceid").text(data.partnerNumber);
                $("#UpdateUserByDetail").attr("disabled", "disabled");
            }





            $("#hdnSourceId").val(data.sourceId);
            $("#hdnGRBasedInvoiceLogic").val(data.grBasedInvoiceLogic);


            $('#CoCd').val(data.coCd).trigger('change')
            $('#PayTerm').val(data.payTerm).trigger('change')
            $('#WitholdingTaxType').val(data.witholdingTaxType).trigger('change')
            $('#VendorAccGrp').val(data.vendorAccGrp).trigger('change')
            $('#PORG').val(data.porg).trigger('change')
            $('#Incoterm').val(data.incoterm).trigger('change')
            $('#SchemaGrp').val(data.schemaGrp).trigger('change')

            $('#SubjectToTds').text(data.subjectToTds)
            $('#TypeOfRecepient').text(data.typeOfRecepient)
            $('#WitholdingTaxCode').text(data.witholdingTaxCode)

            $('#ReconAcc').val(data.reconAcc).trigger('change')

            $('#authGrp').val(data.authGroup).trigger('change')
            $('#gstVendClass').val(data.gstVendClass).trigger('change')





            // To check required value updated
            if (jQuery("#authGrp option:selected").val() == "" || jQuery("#WitholdingTaxType option:selected").val() == "0" || $("#CoCd option:selected").val() == "0" || $("#PayTerm option:selected").val() == "0" || $("#PORG option:selected").val() == "0") {
                $("#btnPostToExternalSource").hide();
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



$('#ddlCountry').on('change', function () {

    let CountryKey = $(this).val();

    GetCountrySpecificMaster(CountryKey)

}
)


$('#ddlState').on('change', function () {

    let stateidentity = $('option:selected', this).data('stateid') || 0;


    fetchCity(parseInt(stateidentity));
});


$('#WitholdingTaxType').on('change', function () {

    let subjecttotds = $('option:selected', this).data('subjecttotds');
    let typeofreceipt = $('option:selected', this).data('typeofreceipt');
    let witholdingtaxcode = $('option:selected', this).data('witholdingtaxcode');


    $('#SubjectToTds').text(subjecttotds);
    $('#TypeOfRecepient').text(typeofreceipt);
    $('#WitholdingTaxCode').text(witholdingtaxcode);



});



function UpdateExternalSourceUser() {
   
    if (jQuery("#WitholdingTaxType option:selected").val() == "0") {

        alertforerror('Please select a valid value of Witholding tax to proceed...')
        return false
    }

    if (jQuery("#authGrp option:selected").val() == "") {


        alertforerror('Please select a valid value of Authorization Group to proceed...')
        return false
    }

    if ($("#CoCd option:selected").val() == "0" || $("#PayTerm option:selected").val() == "0" || $("#PORG option:selected").val() == "0") {

        alertforerror('Please select valid value for all required Fields')
        return false
    }

    let externalactiontype = jQuery("#hdnExternalActionTypeUser").val();
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var sourcedata = {
        "VendorId": parseInt(jQuery("#spnvendorcode").text()),
        "ChildId": parseInt(jQuery("#hdnChildID").val()),
        "ExternalSourceId": jQuery("#externalsourceid").text() || "",
        "ExternalSource": "",
        "VendorAccGrp": jQuery("#VendorAccGrp option:selected").val(),
        "VendorSearchKey": $("#hdnVendorCode").val(),
        "CoCd": jQuery("#CoCd option:selected").val(),
        "ReconAcc": jQuery("#ReconAcc option:selected").val(),
        "PayTerm": jQuery("#PayTerm").val(),
        "CheckDoubleInvoice": 'X',
        "WitholdingTaxType": jQuery("#WitholdingTaxType option:selected").val(),
        "SubjectToTds": jQuery("#SubjectToTds").text() || "",
        "TypeOfRecepient": jQuery("#TypeOfRecepient").text() || "",
        "WitholdingTaxCode": jQuery("#WitholdingTaxCode").text() || "",
        "PORG": jQuery("#PORG option:selected").val(),
        "Currency": "INR",
        "Incoterm": jQuery("#Incoterm option:selected").val(),
        "IncotermDescription": jQuery("#Incoterm option:selected").data('incotermdesc'),
        "SchemaGrp": jQuery("#SchemaGrp option:selected").val(),
        "PartnerNumber": "",
        "PartnerFunction": "",
        "CustomerId": parseInt(sessionStorage.getItem('CustomerID')),
        "SourceId": parseInt($("#hdnSourceId").val()),
        "AuthGroup": jQuery("#authGrp option:selected").val(),
        "GstVendClass": jQuery("#gstVendClass option:selected").val()

    };


    jQuery.ajax({

        // url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RegParticpants_PEV2/",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/UpdateExternalSource/?ActionType=" + externalactiontype,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        async: false,
        data: JSON.stringify(sourcedata),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           
            $("#UpdateUserByDetail").attr("disabled", "disabled");
            jQuery.unblockUI();




            alertforinfo('Your Supplier detail is updated successfully...')

            setTimeout(function () {

                GetVendorExternalDetail(parseInt(jQuery("#spnvendorcode").text()), parseInt(jQuery("#hdnChildID").val()), parseInt(sessionStorage.getItem('CustomerID')))

            }, 2000);




        },
        error: function (xhr, status, error) {
          
            $("#UpdateUserByDetail").removeAttr("disabled");
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {

                alertforerror(err);
            }
            jQuery.unblockUI();
            return false;
        }

    })

}




function PostToExternalSource() {

    let vendId = parseInt(jQuery("#hdnVendorId").val())
    let CustId = parseInt(sessionStorage.getItem('CustomerID'))
    let ChildId = parseInt($("#hdnChildID").val())
    let sourceid = parseInt($("#hdnSourceId").val())



    if ($("#bankCountryKey").val() == "" || $("#ifsccode").val() == "" || $("#bankaccount").val() == "") {

        alertforerror(`Please click on edit button in Bank Details section for your preffered bank account...`)
        return false
    }

    if (jQuery("#authGrp option:selected").val() == "") {

        alertforerror('Please select a valid value of Authorization Group to proceed...')
        return false
    }


    if (jQuery("#WitholdingTaxType option:selected").val() == "0") {

        alertforerror('Please select a valid value of Witholding tax to proceed...')
        return false
    }

    if ($("#CoCd option:selected").val() == "0" || $("#PayTerm option:selected").val() == "0" || $("#PORG option:selected").val() == "0") {

        alertforerror('Please select valid value for all required Fields')
        return false
    }

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
    var sourcedata = {
        "PARTNER": "",
        "VGROUP": jQuery("#VendorAccGrp option:selected").val(),
        "VEN_CLASS": jQuery("#gstVendClass option:selected").val(),
        "KUNNR": "",
        "NAME1": jQuery("#vendorname").text(),
        "NAME2": "",
        "NAME3": "",
        "SORT1": $("#hdnVendorCode").val(),
        "STREET": jQuery("#vendoraddress").text(),
        "STREET1": "",
        "STREET2": "",
        "CPOSTCODE": $("#pincode").text(),
        "CITY1": $("#ddlCitym").text(),
        "COUNTRY": $("#hdnCountryKey").val(),
        "REGION": $("#hdnRegionKey").val(),
        "LANGU": "EN",
        "LOCATION": "",
        "TEL_NUM": jQuery("#vendoraltmobileno").text(),
        "TEL_EXN": "",
        "MOB_NUM": jQuery("#vendormobileno").text(),
        "FAX_NUM": "",
        "EMAIL": jQuery("#vendorEmailID").text(),
        "BVKID": "",
        "BANKS": 'IN',
        "BANKL": $("#ifsccode").val(),
        "BANKN": $("#bankaccount").val(),
        "BKONT": "",
        "BUKRS": jQuery("#CoCd option:selected").val(),
        "AKONT": jQuery("#ReconAcc option:selected").val(),
        "ZTERM": jQuery("#PayTerm").val(),
        "REPRF": 'X',
        "WITHT": jQuery("#WitholdingTaxType option:selected").val(),
        "WT_SUBJCT": jQuery("#SubjectToTds").text(),
        "QSREC": jQuery("#TypeOfRecepient").text(),
        "WT_WITHCD": jQuery("#WitholdingTaxCode").text(),
        "EKORG": jQuery("#PORG option:selected").val(),
        "WAERS": "INR",
        "INCO1": jQuery("#Incoterm option:selected").val(),
        "INCO2_L": jQuery("#Incoterm option:selected").data('incotermdesc'),
        "INCO3_L": "",
        "EKGRP": "",
        "KALSK": jQuery("#SchemaGrp option:selected").val(),
        "TAXNUM1": jQuery("#txtTINTypemodal").text(),
        "TAXTYP1": jQuery("#txtTINNom").text(),
        "J_1IPANNO": jQuery("#vendorpanno").text() || "",
        "PARVW": "",
        "LIFN2": "",
        "VEND_CLASS": "",
        "MINDK": "",
        "ISEC": "",
        "J_1ICSTNO": "",
        "MESSAGE": "",
        "AUGRP": jQuery("#authGrp option:selected").val(),
        "WEBRE": $("#hdnGRBasedInvoiceLogic").val()

    };



    jQuery.ajax({

        // url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RegParticpants_PEV2/",
        url: sessionStorage.getItem("APIPath") + "SAPintegration/PostToExternalSource/?Id=" + vendId + "&ChildId=" + ChildId + "&CustomerId=" + CustId + "&SourceId=" + sourceid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        async: false,
        data: JSON.stringify(sourcedata),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           
            jQuery.unblockUI();
            if (data.message) {
                alertforinfo(`Your data is posted successfully to SAP with following message : ${data.message}`)
            }
            else {
                alertforinfo(`Your data is posted successfully to SAP.`)
            }




            setTimeout(function () {

                GetVendorExternalDetail(parseInt(jQuery("#spnvendorcode").text()), parseInt(jQuery("#hdnChildID").val()), parseInt(sessionStorage.getItem('CustomerID')))

            }, 3000);



        },
        error: function (xhr, status, error) {
          
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {

                alertforerror(err)
            }
            jQuery.unblockUI();
            return false;
        }

    })

}


function clearexternal() {
    //taxdetails
    $("#CoCd").val('0').trigger('change');
    $("#PayTerm").val('0').trigger('change');
    $("#WitholdingTaxType").val('0').trigger('change');
    $("#ReconAcc").val('').trigger('change');
    $("#TypeOfRecepient").text('');
    $("#SubjectToTds").text('');
    $("#WitholdingTaxCode").text('');


    $("#externalsourceid").text('');
    $("#extchsourceid").text('');
    $("#VendorAccGrp").val('0').trigger('change');
    $("#Incoterm").val('CFR').trigger('change');
    $("#PORG").val('0').trigger('change');
    $("#SchemaGrp").val('0').trigger('change');

    $("#sapwitholdingtaxaccordion").hide();



}


function UpdateActivity(vendId, CustId, ChildId, Status) {
   
    upvendid = parseInt(vendId);
    upCustId = parseInt(CustId);
    upChildId = parseInt(ChildId);
    let data = {
        "Id": upvendid,
        "CustomerId": upCustId,
        "ChildId": upChildId,
        "Status": Status
    }
    jQuery.ajax({

        // url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RegParticpants_PEV2/",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/UpdateActivity",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
          
            if (Status == 'A') {
                alertforsucess(`Your Vendor is approved successfully`);
            }
            else {
                alertforsucess(`Your Vendor is rejected successfully`);
            }


        },
        error: function (xhr, status, error) {
          
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {

                alertforerror(xhr.responseText);
            }
            jQuery.unblockUI();
            return false;
        }

    })
}

//unregistered vendor

$('#txtTINType').on('change', function () {

    let Taxtype = $(this).val();
    if (Taxtype == "" && $("#ddlCountry option:selected").val() == 'IN') {
        $(".nogsthide").hide();
        $(".newgsthide").hide();
        $(".nopanhide").show();
        $("#ParticipantName").removeAttr('disabled');
        $("#btncalgst").attr("onClick", ``);
        $("#btncalgst").hide()
        $("#txtPanNo").attr("disabled", "disabled");
        $("#txtPanNo").removeAttr('disabled');
        afterTaxEnable()
        /* $("#ParticipantName").removeAttr('disabled');
         $("#ddlNatureEstaiblishment").removeAttr('disabled');
         $("#txtTINNo").attr("onchange","");
        
         $("#vendorpanno").removeAttr('disabled');
         $("#vendorname").removeAttr('disabled');*/
    }

    else if (Taxtype == "" && $("#ddlCountry option:selected").val() != 'IN') {
        $(".nogsthide").hide();
        $(".nopanhide").hide();
        $(".newgsthide").hide();
        $("#ParticipantName").removeAttr('disabled');
        /* $("#txtTINNo").attr("onchange", "");*/
        $("#btncalgst").attr("onClick", ``);
        $("#btncalgst").hide()
        $("#txtPanNo").removeAttr('disabled');
        afterTaxEnable()
        /* $("#ParticipantName").removeAttr('disabled');
         $("#ddlNatureEstaiblishment").removeAttr('disabled');
         $("#txtTINNo").attr("onchange","");
        
         $("#vendorpanno").removeAttr('disabled');
         $("#vendorname").removeAttr('disabled');*/
    }

    else if (Taxtype == "IN3") {

        $(".nogsthide").show();
        $(".newgsthide").show();
        $(".nopanhide").show();
        $("#ParticipantName").attr("disabled", "disabled");
        $("#txtPanNo").attr("disabled", "disabled");

        $("#btncalgst").attr("onClick", `extractPan()`);
        $("#btncalgst").show()
        $("#txtPanNo").attr("disabled", "disabled");
        afterTaxEnable()
        /*$("#ParticipantName").attr("disabled", "disabled");
        $("#ddlNatureEstaiblishment").attr("disabled", "disabled");
        
        $("#txtPanNo").attr("disabled", "disabled");
        $("#vendorpanno").attr("disabled", "disabled");
        $("#vendorname").attr("disabled", "disabled");*/
    }
    else {

        $(".nogsthide").show();
        $(".newgsthide").hide();
        $(".nopanhide").show();
        /*$("#txtTINNo").attr("onchange", "");*/
        $("#btncalgst").attr("onClick", ``);
        $("#btncalgst").hide()
        $("#ParticipantName").removeAttr("disabled");
        $("#txtPanNo").removeAttr("disabled");
        afterTaxEnable()
        /*$("#ParticipantName").attr("disabled", "disabled");
        $("#ddlNatureEstaiblishment").attr("disabled", "disabled");
        $("#txtTINNo").attr("onchange", "extractPan(this)");
        $("#txtPanNo").attr("disabled", "disabled");
        $("#vendorpanno").attr("disabled", "disabled");
        $("#vendorname").attr("disabled", "disabled");*/
    }




}
)

//mapping recon and schema
$('#VendorAccGrp').on('change', function () {
    let _VAGval = $(this).val();
    if (_VAGval == 'ZIMP') {

        $('#SchemaGrp').val('IM').trigger('change')
        $('#ReconAcc').val('13010001').trigger('change')

    }
    else {
        $('#SchemaGrp').val('DM').trigger('change')
        if (_VAGval == "ZDOM" || _VAGval == "ZPI") {
            $('#ReconAcc').val('13010000').trigger('change')
        }
        else if (_VAGval == "ZSER" || _VAGval == "ZFWA") {
            $('#ReconAcc').val('13010002').trigger('change')
        }
        else if (_VAGval == "ZINT") {
            $('#ReconAcc').val('13010004').trigger('change')
        }
        else if (_VAGval == "ZOTV") {
            $('#ReconAcc').val('13010005').trigger('change')
        }
        else if (_VAGval == "ZVBP") {
            $('#ReconAcc').val('13020001').trigger('change')
        }



    }

})

function sapselection() {
    $('#VendorAccGrp').select2()
    $('#Incoterm').select2()
    $('#Incoterm').select2()
    $('#CoCd').select2()
    $('#PayTerm').select2()
    $('#gstVendClass').select2()
    $('#PORG').select2()
    $('#SchemaGrp').select2()
    $('#ReconAcc').select2()
    $('#authGrp').select2()
    $('#gstVendClass').select2()
    $('#WitholdingTaxType').select2()
}


function editBankDetail(bankingId, childId, bankCountryKey, bankRoutingNumber, bankName, cancelledCheckFile, payTerm, bankAccountNumber, accountholdername) {
   
    $('#bankForm').show();
    $('#hdnBankingId').val(bankingId)
    $('#hdnChildID').val(childId)
    jQuery("#ifsccode").val(bankRoutingNumber)
    jQuery("#bankaccount").val(bankAccountNumber)
    jQuery("#bankname").val(StringDecodingMechanism(bankName))
    jQuery("#accountholder").val(accountholdername)

    jQuery("#ddPayTerms").val(payTerm).trigger('change')
    $('#hdnActionType').val("Update")

    $('#filecheck').hide()
    $('#checkattach').show()
    $('#checkattach').html(cancelledCheckFile);
}




function Addanotherbank() {
   
    $('#bankForm').show();
    jQuery("#ifsccode").val("")
    jQuery("#bankaccount").val("")
    jQuery("#bankname").val("")
    jQuery("#accountholder").val("")
    jQuery("#ddPayTerms").val("0").trigger('change')
    $('#hdnActionType').val("Add")
    $('#filecheck').val("");
}





function UpdateBankDetail() {
   
    $('#buttonbankupdate').attr('disabled', 'disabled');
    let ActionType = $('#hdnActionType').val()

    if ($('#checkattach').html() !== '') {
        checkfilename = $('#checkattach').html();
    }
    else {
        checkfilename = jQuery('#filecheck').val().substring(jQuery('#filecheck').val().lastIndexOf('\\') + 1)
        checkfilename = checkfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }

    if (checkfilename == "") {
        $('#buttonbankupdate').removeAttr('disabled');

        alertforerror('please attach valid Check file to proceed...')
        return false;
    }
    let data = "";
    let bankurl = ""
    let encodedbankname = StringEncodingMechanism(jQuery("#bankname").val());

    if (!jQuery("#ifsccode").val()) {

        alertforerror(`please enter a valid IFSC code`)
        return false
    }
    else if (!$("#bankaccount").val()) {
        alertforerror(`please enter a valid bank account number`)
        return false
    }
    else if (!encodedbankname) {
        alertforerror(`please enter a valid bank name`)
        return false
    }
    else if (!checkfilename) {
        alertforerror(`please upload valid file attachment`)
        return false
    }

   
    if (ActionType == "Add") {
        bankurl = APIPath + "VendorLCM/UpdateBankDetail/?ActionType=Add"
        data = {
            "ChildId": parseInt($('#hdnChildID').val()),
            "BankCountryKey": "IN",
            "BankRoutingNumber": jQuery("#ifsccode").val(),
            "BankAccountNumber": jQuery("#bankaccount").val(),
            "BankName": encodedbankname,
            "CancelledCheckFile": checkfilename,
            "Currency": $("#ddlcurrencymodal").text(),
            "AccounHolderName": jQuery("#accountholder").val()
        }
    }
    else {
        bankurl = APIPath + "VendorLCM/UpdateBankDetail/?ActionType=Update"
        data = {
            "BankingId": parseInt($('#hdnBankingId').val()),
            "ChildId": parseInt($('#hdnChildID').val()),
            "BankCountryKey": "IN",
            "BankRoutingNumber": jQuery("#ifsccode").val(),
            "BankAccountNumber": jQuery("#bankaccount").val(),
            "BankName": encodedbankname,
            "CancelledCheckFile": checkfilename,
            "Currency": $("#ddlcurrencymodal").text(),
            /*"PayTerm": jQuery("#ddPayTerms option:selected").val(),*/
            "AccounHolderName": jQuery("#accountholder").val()
        }

    }




    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: bankurl,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            $('#hdnBankingId').val(data.returnId)
           
            if ($('#filecheck').val() != '') {
                fnUploadFilesonAzure('filecheck', checkfilename, 'VR/' + $('#hdnChildID').val());
            }
            if (ActionType == "Add") {
                UpdateBankMapping()
            }
            jQuery("#errordivbank").hide();
            jQuery.unblockUI();
            jQuery("#successdivbank").text("Your Bank specific details added successfully..");
            jQuery("#successdivbank").show();
            jQuery("#successdivbank").fadeOut(5000);
            App.scrollTo(jQuery("#successdivbank"), -200);
            $('#buttonbankupdate').removeAttr('disabled');
            setTimeout(function () {
                $('#bankForm').hide();
                GetBankDetail(parseInt($('#hdnChildID').val()), customerid, parseInt($("#hdnVendorId").val()))
            }, 1500)


        },
        error: function (xhr, status, error) {
          
            $('#buttonbankupdate').removeAttr('disabled');
            var err = xhr.responseText
            alertforerror(err)

            jQuery.unblockUI();
        }
    });
}

function UpdateBankMapping() {
   
    if ($('#mapbankcustomer').val() === '0') {

        jQuery("#errordiv1").show();
        jQuery("#errordiv1").text("please select valid company to proceed further..");

        setTimeout(function () {

            jQuery("#errordiv1").hide();
            jQuery("#errordiv1").text("");


        }, 2000)
        return false;
    }

    let data = {
        "AssociatedVendorId": parseInt($('#hdnChildID').val()),
        "BankingId": parseInt($('#hdnBankingId').val()),
        "VendorId": parseInt($("#hdnVendorId").val()),
        "CustomerId": customerid,
    }


    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",

        url: APIPath + "VendorLCM/UpdateBankMapping",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
           
            if (data.isSuccess !== 0) {


                alertforinfo("Company is mapped successfully..")

            }
            else {

                alertforerror(data.message)

            }


        },
        error: function (xhr, status, error) {

            jQuery.unblockUI();
        }
    });
}

function editCheck() {
    $("#checkattach").html("");
    $("#uploadcheck").hide();
    $("#filecheck").show();
}



//penny testing code
function IciciBankPennyDropVerify(childId, bankRoutingNumber, bankName, bankAccountNumber, accounHolderName) {
   
    if ($('#vendoraltmobileno').text() == '') {
        $('#btnmaptoc').attr('disabled', 'disabled');
        alertforerror("please fill valid mobile number to proceed")

        return false
    }
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    let data = {
        "BenifAccNo": bankAccountNumber,
        "BenifIFSC": bankRoutingNumber,
        "Amount": "1.00",
        "AcountName": accounHolderName,
        "Mobile": $('#vendoraltmobileno').text(),
        "ChildID": parseInt(childId)
    }
    console.log(APIPath + "Bank/IciciBankPennyDropVerify")

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: APIPath + "Bank/IciciBankPennyDropVerify",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
           debugger
           if(data.status==0){
             alertforerror(data.error);
             jQuery.unblockUI();
             return false;
         }

            let ActCode = data.data.actCode
            if (data.isVeriFy === 'Y') {

                $('#btnmaptoc').removeAttr('disabled');
                alertforinfo("Banking details verified successfully...");
                GetBankDetail(parseInt($('#hdnChildID').val()), customerid, parseInt($("#hdnVendorId").val()))

            }
            else {

                if (ActCode == '0') {
                    $('#btnmaptoc').removeAttr('disabled');
                    alertforsucess("Banking details verified successfully...");
                    GetBankDetail(parseInt(childId), customerid, parseInt($("#hdnVendorId").val()))
                }
                else {
                    $('#btnmaptoc').attr('disabled', 'disabled');

                    alertforerror(`${data.data.response}`)

                }



            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {
           
            let err = xhr.responseText || `banking details cannot be verified. Please Check!`;
            alertforerror(err);
            jQuery.unblockUI();
        }
    });
}




//pagination

const prev = document.querySelector('.prev');
prev.addEventListener('click', (e) => {
    //  console.log(pageNumber);
    e.preventDefault();
    if (pageNumber > 1) {
        pageNumber--;

        $('#txtPageNumber').val(pageNumber);
        fetchParticipantsVenderTableFilter(pageNumber, SearchText);
    }
});

const next = document.querySelector(".next");
next.addEventListener("click", (e) => {
    e.preventDefault();
    console.log('next ', pageNumber);
    console.log('numberOfPages ', numberOfPages);

    if (pageNumber < numberOfPages) {
        pageNumber++;

        $('#txtPageNumber').val(pageNumber);
        fetchParticipantsVenderTableFilter(pageNumber, SearchText);
    }
});


function replaceQuoutesFromString_PEV2(ele) {


    var str = '';
    str = ele.value;

    //console.log(str);

    str = str.replace(/'/g, '');
    str = str.replace(/"/g, '');

    str = str.replace(/#/g, '');
    //str = str.replace(/&/g, '');


    str = str.replace(/~/g, '');
    str = str.replace(/`/g, '');
    str = str.replace(/</g, '');
    str = str.replace(/>/g, '');
    // str = str.replace(/_/g, '');
    str = str.replace(/^/g, '');
    SearchText = str;
    ele.value = str;

    if (str.length > 2) {
        console.log(str);
        fetchParticipantsVenderTable(1, str);
    }
    else {
        if (str == "") {
            fetchParticipantsVenderTableFilter(1, '');
        }
    }
    //return val;
}

function setupPagination(pageNumber) {
    const pagination = document.querySelector("#paginationid1");
    pagination.innerHTML = "";
    var pageno = 0;

    /*  var onelotsize = pageNumber+3;
      if (pageNumber > numberOfPages) {
          pageNumber = numberOfPages;
          onelotsize = numberOfPages;
      }*/
    console.log(pageNumber);

    for (let i = 1; i <= numberOfPages; i++) {
        // console.log(i);
        var listart = "<li class=page-item id=" + i + ">";
        var liend = "</li>";
        const li = document.createElement("li");
        li.id = 'l' + i;
        li.setAttribute("class", "page-link");
        const link = document.createElement("a");
        link.href = "#";
        link.setAttribute("class", "page-link");
        link.innerText = i;

        if (i === pageNumber) {
            link.classList.add("active");
        }

        link.addEventListener("click", (event) => {
            event.preventDefault();
            pageNumber = i;
            fetchParticipantsVenderTableFilter(pageNumber, SearchText);
            const currentActive = pagination.querySelector(".active");
            currentActive.classList.remove("active");
            link.classList.add("active");
        });
        li.appendChild(link);
        //        pagination.appendChild(li);
        pageno = i + 1;
    }


    /*  const li = document.createElement("li");
      li.id = 'l' + pageno;
      li.setAttribute("class", "page-link");
      const link = document.createElement("a");
      link.href = "javascript:void(0)";
      link.setAttribute("class", "page-link");
      link.innerText = ".....";
      link.addEventListener("click", (event) => {
          event.preventDefault();
          pageNumber = pageno;
          fetchParticipantsVenderTableFilter(pageNumber, SearchText);
          const currentActive = pagination.querySelector(".active");
          currentActive.classList.remove("active");
          link.classList.add("active");
      });*/

    // li.appendChild(link);
    // pagination.appendChild(li);

    //var pageDivData = '<li id="l' + numberOfPages +' class="page-link"><a href="javascript:void(0)" class="page-link">....</a></li>';
    //pageDivData += '<li id="l1' + numberOfPages + ' class="page-link"><a href="javascript:void(0)" class="page-link">(' + numberOfPages + ')</a></li>';
    //pagination.appendChild(pageDivData);
}

function gotopage_directly(ele) {
    pageNumber = ele.value;

    if (pageNumber > 0) {
        fetchParticipantsVenderTableFilter(pageNumber, SearchText);
    }

}
