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
                txtPanNo: {
                    required: true
                },
                txtTINNo: {
                    required: true
                },
                txtPhoneNo: {
                    required: true,
                    maxlength: 50

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
                    required: true
                },
                txtAlternateeMailID: {
                    required: true,
                    email: true
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

                RegisterParticipants();
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

                jQuery("#ULCustomers").empty();

                if (data.length > 0) {

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].CustomerID == "1") {
                            jQuery("#ULCustomers").append(jQuery("<option selected></option>").val(data[i].customerID).html(data[i].customerName));
                        }
                        else {
                            jQuery("#ULCustomers").append(jQuery("<option></option>").val(data[i].customerID).html(data[i].customerName));
                        }


                    }
                }
                else {

                }
                setTimeout(function () {
                    fetchMapCategory('M', 0);
                    fetchParticipantsVenderTable();

                }, 800);
            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
    jQuery.unblockUI();

}
var status = "";
function RegisterParticipants() {

    var _cleanString = StringEncodingMechanism(jQuery("#ParticipantName").val());
    var _cleanString1 = StringEncodingMechanism(jQuery("#txtAddress").val());
   
    
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
        jQuery.unblockUI();
        return false;
        setTimeout(function () {
            jQuery('#divalerterr').css('display', 'none');
        }, 5000);
    }
  /*  var RegisterParticipants = {
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
        "PanNo": jQuery("#txtPanNo").val(),
        "TinNo": jQuery("#txtTINNo").val(),
        "PhoneNo": jQuery("#txtPhoneNo").val(),
        "CompanyEmail": jQuery("#txtcompanyemail").val().trim().toLowerCase(),
        "IsActive": status,
        "UserID": sessionStorage.getItem('UserID'),
        "MobileNo": jQuery("#txtMobileNo").val(),
        "ActionType": $('#hdnFlagType').val(),
        "ContactPerson": $('#ContactName').val(),
        "AlternateEmailID": $('#txtAlternateeMailID').val(),
        "ProductCatID": InsertQuery

    };*/
    var RegisterParticipants = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ParticipantID": parseInt(jQuery("#hdnParticipantID").val()),
        //"ParticipantName": jQuery("#ParticipantName").val(),
        "ParticipantName": _cleanString,
        //"Address": jQuery("#txtAddress").val(),
        "Address": _cleanString1,
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


    sessionStorage.setItem("timezoneid", parseInt(jQuery("#ddlpreferredTime option:selected").val()))





   // alert(JSON.stringify(RegisterParticipants))
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RegParticpants_PEV2/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(RegisterParticipants),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            $("#hdnParticipantID").val(data.participantID)
            $("#hdnParticipantCode").val(data.vendorCode)

            if (data.isSuccess == '1') {
                jQuery('#divalertsucess').slideDown('show');
                App.scrollTo(jQuery('#divalertsucess'), -200);

            }
            else if (data.isSuccess == '2') {
                jQuery('#divalertsucess').slideDown('show');
                App.scrollTo(jQuery('#divalertsucess'), -200);

            }
            else {
                jQuery('#divalerterr').slideDown('show');
                App.scrollTo(jQuery('#divalerterr'), -200);
            }
            setTimeout(function () {
                jQuery('#divalertsucess').css('display', 'none');
                jQuery('#divalerterr').css('display', 'none');
            }, 5000);
            fetchParticipantsVenderTable();
            clearform();
            jQuery.unblockUI();
        },

        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
function fetchParticipantsVenderTable() {
    $('#divVendorForm').addClass('hide')
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/fetchParticipantsVender_PEV2/?CustomerID=" + jQuery("#ULCustomers").val() + "&CreatedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Venderdata) {
            jQuery("#tblParticipantsVender > tbody").empty();
            $('#lblTotallength').html("<b>Total Record : </b>" + Venderdata.length)
            if (Venderdata.length > 0) {
                jQuery.each(Venderdata, function (key, value) {
                    var str = "";
                    var addr1 = (value.address).replace(/\n/g, " ");
                    var addr2 = (value.cityName).replace(/\n/g, " ");
                    if (value.mapBtnRequired == 'N') {
                        str = "<tr><td style=\"text-align:center;width:10%!important;\">";

                       // str += "<a href=\"#\"   onclick =\"EditVendor(\'" + value.participantID + "'\,\'" + value.participantName + "'\,\'" + value.contactPerson + "'\,\'" + value.companyEmail + "'\,\'" + value.phoneNo + "'\,\'" + value.mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + value.tinNo + "'\,\'" + value.isActive + "'\,\'" + value.panNo + "'\,\'" + value.actionType + "'\,\'" + value.vendorCode + "'\,\'" + value.alternateEmailID + "'\,\'" + value.countryID + "'\,\'" + value.stateID + "'\,\'" + value.cityID + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a></td>";

                        str += "<a href=\"#\"   onclick =\"EditVendor(\'" + value.participantID + "'\,\'" + value.participantName + "'\,\'" + value.contactPerson + "'\,\'" + value.companyEmail + "'\,\'" + value.dialingCodePhone + "'\,\'" + value.phoneNo + "'\,\'" + value.dialingCode + "'\,\'" + value.mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + "'\,\'" + value.zipCode + "'\,\'" + value.tinNo + "'\,\'" + value.isActive + "'\,\'" + value.panNo + "'\,\'" + value.actionType + "'\,\'" + value.vendorCode + "'\,\'" + value.alternateEmailID + "'\,\'" + value.countryID + "'\,\'" + value.stateID + "'\,\'" + value.cityID + "'\)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a></td>";
                        str += "<td style=\"width:10%!important;\">" + value.createdByName + "</td>";
                        if (value.actionType == "EditVendor") {
                            str += "<td style=\"width:10%!important;\">No</td>";
                        }
                        else {
                            str += "<td style=\"width:10%!important;\">Yes</td>";
                        }

                    }

                    else if (value.mapBtnRequired == 'Y') {
                        str = "<tr><td style=\"text-align:right;width:10%!important;\">";
                        str += "<a href=\"javascript:;\"  onclick=\"MapCategory(this)\" class=\"btn btn-xs green\"><i class=\"fa fa-edit\"></i>Map</a><a href=\"#\" href=\"#\"  onclick=\"EditProduct(this)\" class=\"btn btn-xs purple\"><i class=\"fa fa-edit\"></i>Edit</a></td>";
                    }
                    str += "<td style=\"display:none;\">" + value.participantID + "</td><td style=\"width:10%!important;\">" + value.participantName + "</td><td style=\"width:10%!important;\">" + value.contactPerson + "</td><td style=\"width:10%!important;\">" + value.address + "</td><td style=\"width:5%!important;\">" + value.cityName + "</td><td style=\"width:10%!important;\">" + value.panNo + "</td><td style=\"width:10%!important;\">" + value.tinNo + "</td><td style=\"width:20%!important;\">" + value.mobileNo + "</td><td style=\"width:20%!important;\">" + value.phoneNo + "</td><td style=\"width:10%!important;\">" + value.companyEmail + "</td><td style=\"width:10%!important;\">" + value.alternateEmailID + "</td>";

                    str += "</td></tr>";
                    jQuery('#tblParticipantsVender > tbody').append(str);
                });
            }
            else {
                jQuery('#tblParticipantsVender > tbody').append("<tr><td colspan='12' style='text-align: center; color:red;'>No Participant found</td></tr>");
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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

function EditVendor(vendorid, vname, contactp, emailid, dialingcodephone, phone, dialingcode, mobile, addr1, addr2, zipcode, gst, isactive, pan, buttonname, vendorcode, alternateemailid, countryid, stateid, cityid) {
    
    $('#hdnFlagType').val(buttonname)
    jQuery("#hdnParticipantID").val(vendorid)
    $("#hdnParticipantCode").val(vendorcode)
    jQuery("#ParticipantName").val(vname)
    jQuery("#txtAddress").val(addr1)
    //jQuery("#txtCity").val(addr2)
    jQuery("#txtPanNo").val(pan)
    jQuery("#txtTINNo").val(gst)
    jQuery("#txtPhoneNo").val(phone)
    jQuery("#txtMobileNo").val(mobile)
    jQuery("#ContactName").val(contactp)
    jQuery("#txtcompanyemail").val(emailid)
    jQuery("#txtAlternateeMailID").val(alternateemailid)
    $("#ddlpreferredTime").find(`option[value=${sessionStorage.getItem("timezoneid")}]`).attr("selected", "selected")

    jQuery("#txtZipCd").val(zipcode)
    $('#ddlCountryCd').val(dialingcode).trigger('change')
    $('#ddlCountryCdPhone').val(dialingcodephone).trigger('change')

    if (isactive == "Y" || isactive.toLowerCase() == "yes") {
        status = 'Y';
    }
    else {
        status = 'N';
    }
    $('#ddlCountry').val(countryid).trigger('change')
    setTimeout(function () {
        $('#ddlState').val(stateid).trigger('change')
    }, 900)
    setTimeout(function () {

        $('#ddlCity').val(cityid).trigger('change')
    }, 1500)
    $('#divVendorForm').removeClass('hide')
    fetchMapCategory('Z', vendorid);

}

function fetchMapCategory(categoryFor, vendorId) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + jQuery("#ULCustomers").val() + "&For=" + categoryFor + "&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VendorID=" + vendorId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#tblCategoryMaster").empty();

            var count = 3;
            var str = '';

            if (data.length > 0) {

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

            var err = eval("(" + xhr.responseText + ")");
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
    // jQuery("#txtCity").val('');
    jQuery("#txtPanNo").val('');
    jQuery("#txtTINNo").val('');
    jQuery("#txtPhoneNo").val('');
    jQuery("#txtMobileNo").val('');
    jQuery("#ContactName").val('');
    jQuery("#txtcompanyemail").val('');
    jQuery('#hdnParticipantID').val('0');
    $("#ddlCountry").val('111');
    $("#ddlState").val('0');
    $("#ddlCity").val('0');
    // jQuery('#txtUI').val('');

    $('.childchkbox').each(function () {
        jQuery(this).closest('span#spancheckedvendorgroup').removeAttr('class');
    })
    status = "True"
    $('#ParticipantName').removeAttr('disabled')
    $('#txtAddress').removeAttr('disabled')
    $('#ContactName').removeAttr('disabled')
    $('#txtCity').removeAttr('disabled')
    $('#txtPanNo').removeAttr('disabled')
    $('#txtTINNo').removeAttr('disabled')
    $('#txtPhoneNo').removeAttr('disabled')
    $('#txtMobileNo').removeAttr('disabled')
    $('#txtcompanyemail').removeAttr('disabled')
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
jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblParticipantsVender tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});

function validateVendorGroup(ctrl, categoryId) {
    if (jQuery(ctrl).is(':checked') == true) {

        jQuery(ctrl).closest('div#uniform-chkbidTypes').find('span#spancheckedvendorgroup').attr('class', 'checked');

    } else {
        jQuery(ctrl).closest('div#uniform-chkbidTypes').find('span#spancheckedvendorgroup').attr('class', '');
    }
}
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
