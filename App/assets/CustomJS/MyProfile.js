var APIPath = sessionStorage.getItem("APIPath");

jQuery(document).ready(function () {
    $(".thousand").inputmask({
        alias: "decimal",
        rightAlign: false,
        groupSeparator: ",",
        radixPoint: ".",
        autoGroup: true,
        integerDigits: 40,
        digitsOptional: true,
        allowPlus: false,
        allowMinus: false,
        'removeMaskOnSubmit': true

    });
});

function fetchCountry() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/Country/?CountryID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlCountry").empty();
            var vlal = new Array();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCountry").append("<option value=" + data[i].countryID + ">" + data[i].countryName + "</option>");
                }
                jQuery("#ddlCountry").val('111').trigger("change");

            }
            else {
                jQuery("#ddlCountry").append('<tr><td>No countries found..</td></tr>');
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


function fetchState() {

    var countryid = jQuery('#ddlCountry option:selected').val();

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/State/?CountryID=" + countryid + "&StateID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#ddlState").empty();
            var vlal = new Array();
            if (data.length > 0) {

                jQuery("#ddlState").append("<option value=0>Select State</option>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlState").append("<option value=" + data[i].stateID + ">" + data[i].stateName + "</option>");
                }

                jQuery("#ddlState").trigger("change");

            }
            else {
                jQuery("#ddlState").append('<tr><td>No state found..</td></tr>');
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

    var stateid = jQuery('#ddlState').val();

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/City/?StateID= " + stateid + "&CityID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#ddlCity").empty();
            var vlal = new Array();
            if (data.length > 0) {

                jQuery("#ddlCity").append("<option value=0>Select City</option>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCity").append("<option value=" + data[i].cityID + ">" + data[i].cityName + "</option>");
                }

                jQuery("#ddlCity").val('0').trigger("change");

            }
            else {
                jQuery("#ddlCity").append('<tr><td>No city found..</td></tr>');
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

function fetchPaymentTerms() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchPaymentTerms?CustomerID=1",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            $("#ddPayTerms").empty();
            if (data.length > 0) {

                $("#ddPayTerms").append("<option value=0>Select Payment Terms</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddPayTerms").append("<option value=" + data[i].termID + ">" + data[i].paymentTerm + "</option>");
                }

                $("#ddPayTerms").trigger("change");
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

function fetchUserDetails() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&UserType=" + sessionStorage.getItem('UserType'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {

                let userdetails = JSON.parse(data[0].jsondata);
                $('#username').html(userdetails[0].UserName)
                $('#usermobileno').val(userdetails[0].MobileNo)
                $('#userEmailID').html(userdetails[0].EmailID)
                $('#userRole').html(userdetails[0].RoleName)
                $('#userdesignation').val(userdetails[0].Designation)

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

//vendor myprofile.html
function fetchVendorDetails() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            let detail = JSON.parse(data[0].jsondata);

            $('#vendorname').html(detail[0].VendorName)
            $('#vendormobileno').val(detail[0].MobileNo)
            $('#vendorEmailID').html(detail[0].EmailID)
            $('#vendoraddress').val(detail[0].Address1 + detail[0].Address2)
            $('#vendorCity').val(detail[0].CityName)
            $('#vendorphone').val(detail[0].Phone)
            $('#vendorpanno').html(detail[0].PANNo)
            $('#vendorservicetaxno').html(detail[0].ServiceTaxNo)
            $('#vendoralternateemail').val(detail[0].AlternateEmailID)
            $('#personname').val(detail[0].ContactPerson)
            $('#Vendorcode').html("<b>" + detail[0].VendorCode + "</b>")

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

//vendor myprofile_vendor.html
function fetchMyProfileVendor() {
    //alert(APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + sessionStorage.getItem('VendorId') + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"))
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + sessionStorage.getItem('VendorId') + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var vendordetails = JSON.parse(data[0].jsondata);
            //console.log("vendordetails", vendordetails);
            //alert(vendordetails[0].VendorCode)
            if (vendordetails[0].tmpVendorID != '' && vendordetails[0].tmpVendorID != null && vendordetails[0].tmpVendorID != undefined) {
                sessionStorage.setItem('tmpVendorID', vendordetails[0].tmpVendorID);
            } else {
                sessionStorage.setItem('tmpVendorID', 0);
            }

            sessionStorage.setItem('vendorCode', vendordetails[0].VendorCode);

            if (vendordetails[0].MSMECheck == 'Y') {
                $('.hideInput').removeClass('hide');
                $('#ddlMSME').val(vendordetails[0].MSMECheck)
                $('#ddlMSME,#ddlMSMEClass,#txtUdyam').attr("disabled", 'disabled');
                $('#ddlMSMEClass').val(vendordetails[0].MSMEType)
                $('#txtUdyam').val(vendordetails[0].MSMENo)

            } else if (vendordetails[0].MSMECheck == '' || vendordetails[0].MSMECheck == null || vendordetails[0].MSMECheck == undefined) {
                $('.hideInput').addClass('hide');
                $('#ddlMSME').val(0);
            } else {
                $('.hideInput').addClass('hide');
                //$('#ddlMSME').attr("disabled", 'disabled');
                $('#ddlMSME').val(vendordetails[0].MSMECheck)
            }

            if (vendordetails[0].EstTypeID != "" && vendordetails[0].EstTypeID != undefined) {
                $('#ddlNatureEstaiblishment').attr("disabled", 'disabled');
                $('#ddlNatureEstaiblishment').val(vendordetails[0].EstTypeID);

            } else {
                $('#ddlNatureEstaiblishment').val(0);
            }

            if (vendordetails[0].VendorCatID != "" && vendordetails[0].VendorCatID != undefined) {
                $('#ddlVendorType').val(vendordetails[0].VendorCatID);
                $('#ddlVendorType').attr("disabled", 'disabled');
            } else {

                $('#ddlVendorType').val(0);
            }


            if (vendordetails[0].GSTClass != "" && vendordetails[0].GSTClass != undefined && vendordetails[0].GSTClass != 0) {
                $('#ddlGSTclass').val(vendordetails[0].GSTClass);
                $('#ddlGSTclass').attr("disabled", 'disabled');
            } else {

                $('#ddlGSTclass').val(0);
            }

            if (vendordetails[0].BankName != "" && vendordetails[0].BankName != undefined) {
                $('#bankname').val(vendordetails[0].BankName);
                $('#bankname').attr("disabled", 'disabled');
            } else {

                $('#bankname').val();
            }

            if (vendordetails[0].BankAccount != "" && vendordetails[0].BankAccount != undefined) {
                $('#bankaccount').val(vendordetails[0].BankAccount);
                $('#bankaccount').attr("disabled", 'disabled');
            } else {

                $('#bankaccount').val();
            }

            if (vendordetails[0].IFSCCode != "" && vendordetails[0].IFSCCode != undefined) {
                $('#ifsccode').val(vendordetails[0].IFSCCode);
                $('#ifsccode').attr("disabled", 'disabled');
            } else {

                $('#ifsccode').val();
            }

            if (vendordetails[0].AccountName != "" && vendordetails[0].AccountName != undefined) {
                $('#accountholder').val(vendordetails[0].AccountName);
                $('#accountholder').attr("disabled", 'disabled');
            } else {

                $('#accountholder').val();
            }

            if (vendordetails[0].TAN != "" && vendordetails[0].TAN != undefined) {
                $('#tan').val(vendordetails[0].TAN);
                $('#tan').attr("disabled", 'disabled');
            } else {

                $('#tan').val(vendordetails[0].TAN);
            }

            //alert(vendordetails[0].GSTFile);
            //alert($('#gstattach').html())
            //console.log($('#gstattach').html());
            if (vendordetails[0].GSTFile != "" && vendordetails[0].GSTFile != null && vendordetails[0].GSTFile != undefined) {
                $('#filegst').hide();
                $('#gstattach').show();
                $('#filegst').attr("disabled", 'disabled');                            
                $('#gstattach').html(vendordetails[0].GSTFile);
            } else {
                $('#filegst').show();
                $('#filegst').removeAttr("disabled");
                $('#gstattach').hide();
            }

            if (vendordetails[0].PANFile != "" && vendordetails[0].PANFile != null && vendordetails[0].PANFile != undefined) {
                $('#filepan').hide();
                $('#panattach').show();
                $('#filepan').attr("disabled", 'disabled');                
                $('#panattach').html(vendordetails[0].PANFile);
            } else {
                $('#filepan').show();
                $('#filepan').removeAttr("disabled");
                $('#panattach').hide();
            }

            if (vendordetails[0].MSMEFile != "" && vendordetails[0].MSMEFile != null && vendordetails[0].MSMEFile != undefined) {
                $('#filemsme').hide();
                $('#msmeattach').show();
                $('#filemsme').attr("disabled", 'disabled');
                $('#msmeattach').html(vendordetails[0].MSMEFile);               

            } else {
                $('#filemsme').show();
                $('#filemsme').removeAttr("disabled");
                $('#msmeattach').hide();
            }

            if (vendordetails[0].cancelledCheck != "" && vendordetails[0].cancelledCheck != null && vendordetails[0].cancelledCheck != undefined) {
                $('#filecheck').hide();
                $('#checkattach').show();
                $('#filecheck').attr("disabled", 'disabled');
                $('#checkattach').html(vendordetails[0].cancelledCheck);                
            } else {
                $('#filecheck').show();
                $('#filecheck').removeAttr("disabled");
                $('#checkattach').hide();
            }

            if (vendordetails[0].currencyLastFY !== "" && vendordetails[0].currencyLastFY != null && vendordetails[0].currencyLastFY != undefined) {
                $('#currencyLastFiscal').val(vendordetails[0].currencyLastFY);
            } else {
                $('#currencyLastFiscal').val('INR');
            }

            if (vendordetails[0].PayTermID !== "" && vendordetails[0].PayTermID != null && vendordetails[0].PayTermID != undefined) {

                $('#ddPayTerms').val(vendordetails[0].PayTermID).trigger('change');

            } else {
                $('#ddPayTerms').val(0).select2().trigger('change');

            }

            if (vendordetails[0].CountryID !== "" && vendordetails[0].CountryID != null && vendordetails[0].CountryID != undefined) {
                $('#ddlCountry').val(vendordetails[0].CountryID)
                setTimeout(function () {
                    $('#ddlState').val(vendordetails[0].StateID).trigger('change')
                }, 300)
                setTimeout(function () {
                    $('#ddlCity').val(vendordetails[0].CityID).trigger('change')
                    calCompanyDetailPercent();
                }, 1000)

            } else {               
                setTimeout(function () {                   
                    calCompanyDetailPercent();
                }, 1300)
            }

            $('#personname').val(vendordetails[0].ContactPerson)
            $('#personnamealt').val(vendordetails[0].ContactNameAlt)
            $('#vendorname').html(vendordetails[0].VendorName)
            $('#vendormobileno').val(vendordetails[0].MobileNo)
            $('#vendorEmailID').html(vendordetails[0].EmailID)
            $('#vendorAltEmailID').val(vendordetails[0].AlternateEmailID)
            $('#vendoraltmobileno').val(vendordetails[0].Phone)
            $('#vendoraddress').val(vendordetails[0].Address1 + vendordetails[0].Address2)
            $('#vendorCity').val(data[0].city)
            $('#vendorphone').val(data[0].phone)
            $('#vendorpanno').html(vendordetails[0].PANNo)
            $('#vendorservicetaxno').html(vendordetails[0].ServiceTaxNo)
            $('#vendoralternateemail').val(data[0].alternateEmailID)
            $('#pincode').val(vendordetails[0].pincode)
            $('#product').val(vendordetails[0].product)
            $('#txtLastFiscal').val(vendordetails[0].PreviousTurnover)
            $('#txt2LastFiscal').val(vendordetails[0].SecondLastTurnover)
            $('#txtLastFiscalyear').val(vendordetails[0].PreviousTurnoverYear)
            $('#txt2LastFiscalyear').val(vendordetails[0].SecondLastTurnoverYear)

            setTimeout(function () {
                CalContactDetailPercent();
                calAccountDetailPercent();
                calBusinessDetailPercent();
            }, 2000)
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" +  + ")");
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

function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'VR/' + sessionStorage.getItem('tmpVendorID'));
}
var profileerror = $('#errordiv');
var profilesuccess = $('#successdiv');
profilesuccess.hide();
profileerror.hide();

var companieserror = $('#companieserrordiv');
var companiessuccess = $('#companiessuccessdiv');
companieserror.hide();
companiessuccess.hide();

var formvendor = $('#frmprofilevendornew');
var successVendor = $('.alert-success', formvendor);
var errorVendor = $('.alert-danger', formvendor);
//vendor profile.html user form
function formvalidate() {
    $('#frmprofile').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            usermobileno: {
                required: true
            }

        },
        messages: {

            usermobileno: {
                required: "Mobile No is required."
            }
        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            profilesuccess.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
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
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            profileerror.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {

            updMobileNo();
        }
    });
    formvendor.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            personname: {
                required: true,
            },
            vendormobileno: {
                required: true,
            },

        },
        messages: {

        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            errorVendor.hide()
            successVendor.hide();
        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.xyz').addClass('has-error');
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element).closest('.xyz').removeClass('has-error');
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            profileerror.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
            updateVendor();
        }
    });
}

//vendor profile.html vendor form
function formvalidatevendor() {
    $('#frmprofilevendor').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            vendormobileno: {
                required: true
            },
            vendoraddress: {
                required: true
            },
            vendorphone: {
                required: true
            },
            vendorCity: {
                required: true
            },
            vendoralternateemail: {
                email: true
            },
            personname: {
                required: true
            }

        },
        messages: {

            vendormobileno: {
                required: "Mobile No is required."
            },
            vendoraddress: {
                required: "Address is required."
            },
            vendorphone: {
                required: "Company Phone No is required."
            },
            vendorCity: {
                required: "City is required."
            },
            vendoralternateemail: {
                required: "Alternate Email is required."
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            profilesuccess.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
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
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            profileerror.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
            //profileerror.hide();
            updVnedorMobileNo();
        }
    });

}

function updMobileNo() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    ID = sessionStorage.getItem("UserID");

    var data = {
        "UserID": ID,
        "UserType": sessionStorage.getItem('UserType'),
        "MobileNo": $('#usermobileno').val(),
        "Address1": $('#vendoraddress').val(),
        "Address2": $('#vendorCity').val(),
        "CompanyPhoneNo": $('#vendorphone').val(),
        "AlternateEmailID": '',
        "Designation": $('#userdesignation').val(),
        "ContactPerson": ""
    }
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ChangeForgotPassword/updateMobileNo",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data == "1") {
                profileerror.hide();
                jQuery("#success").text("Your data is updated successfully..");
                profilesuccess.show();
                profilesuccess.fadeOut(5000);
                fetchUserDetails();
                App.scrollTo(profilesuccess, -200);

            }
            else {
                jQuery("#error").html("Please try again with correct ..");
                profileerror.show();
                profileerror.fadeOut(5000);
                App.scrollTo(profileerror, -200);
                jQuery.unblockUI();
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
    })

}

function updVnedorMobileNo() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var data = {
        "UserID": sessionStorage.getItem("VendorId"),
        "UserType": sessionStorage.getItem('UserType'),
        "MobileNo": $('#vendormobileno').val(),
        "Address1": $('#vendoraddress').val(),
        "Address2": $('#vendorCity').val(),
        "CompanyPhoneNo": $('#vendorphone').val(),
        "AlternateEmailID": $('#vendoralternateemail').val(),
        "Designation": "",
        "ContactPerson": $('#personname').val()
    }

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ChangeForgotPassword/updateMobileNo",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data == "1") {
                profileerror.hide();
                jQuery("#success").text("Your data is updated successfully..");
                profilesuccess.show();
                profilesuccess.fadeOut(5000);
                fetchVendorDetails();
                App.scrollTo(profilesuccess, -200);

            }
            else {
                jQuery("#error").html("Please try again with correct ..");
                profileerror.show();
                profileerror.fadeOut(5000);
                App.scrollTo(profileerror, -200);
                jQuery.unblockUI();
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
    })
}

function updateVendor() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var msmetype = jQuery("#ddlMSMEClass option:selected").val().trim();
    var gstclass = jQuery("#ddlGSTclass option:selected").val().trim();
    var paymentterm = parseInt(jQuery("#ddPayTerms option:selected").val().trim());
    var natureofest = jQuery("#ddlNatureEstaiblishment option:selected").text();
    var vendorcatname = jQuery("#ddlVendorType option:selected").text().trim();
    var statename = jQuery("#ddlState option:selected").text().trim();
    var cityname = jQuery("#ddlCity option:selected").text().trim();
    var tdstype = 0;
    var tdsname = '';

    if (msmetype == 'Select') {
        var msmeselectvalue = "";
    } else {
        var msmeselectvalue = jQuery("#ddlMSMEClass option:selected").val().trim();
    }
    if (gstclass == 'Select') {
        var gstclassvalue = "";
    } else {
        var gstclassvalue = jQuery("#ddlGSTclass option:selected").val().trim();
    }

    if (statename == 'Select State') {
        var statenamevalue = "";
    } else {
        var statenamevalue = jQuery("#ddlState option:selected").text().trim();
    }

    if (cityname == 'Select City') {
        var citynamevalue = "";
    } else {
        var citynamevalue = jQuery("#ddlCity option:selected").text().trim();
    }

    if (paymentterm == 0) {
        var paymenttermvalue = 0;
    } else {
        var paymenttermvalue = parseInt(jQuery("#ddPayTerms").val());
    }

    if (natureofest == 'Select') {
        var natureofestvalue = "";
    } else {
        var natureofestvalue = jQuery("#ddlNatureEstaiblishment option:selected").text();
    }

    if (vendorcatname == 'Select') {
        var vendorcatnamevalue = "";
    } else {
        var vendorcatnamevalue = jQuery("#ddlVendorType option:selected").text().trim();
    }

    var gstfilename = '';
    var panfilename = '';
    var msmefilename = '';
    var checkfilename = '';

    
    if ($('#gstattach').html() !== '') {
        gstfilename = $('#gstattach').html();
        
    }
    else {
        gstfilename = jQuery('#filegst').val().substring(jQuery('#filegst').val().lastIndexOf('\\') + 1)
        gstfilename = gstfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }
    

    if ($('#panattach').html() !== '') {
        panfilename = $('#panattach').html();
    }
    else {
        panfilename = jQuery('#filepan').val().substring(jQuery('#filepan').val().lastIndexOf('\\') + 1)
        panfilename = panfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }
    if ($('#checkattach').html() !== '') {
        checkfilename = $('#checkattach').html();
    }
    else {
        checkfilename = jQuery('#filecheck').val().substring(jQuery('#filecheck').val().lastIndexOf('\\') + 1)
        checkfilename = checkfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }
    if ($('#msmeattach').html() !== '') {
        msmefilename = $('#msmeattach').html();
    } else {
        msmefilename = jQuery('#filemsme').val().substring(jQuery('#filemsme').val().lastIndexOf('\\') + 1)
        msmefilename = msmefilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }

    var data = {
        "ParticipantID": parseInt(sessionStorage.getItem('VendorId')),
        "tmpVendorID": parseInt(sessionStorage.getItem('tmpVendorID')),
        "customerID": parseInt(sessionStorage.getItem('CustomerID')),
        "estTypeID": parseInt(jQuery("#ddlNatureEstaiblishment").val()),
        "estName": natureofestvalue,
        "vendorCatID": parseInt(jQuery("#ddlVendorType").val()),
        "vendorCatName": vendorcatnamevalue,
        "product": jQuery("#product").val().trim(),
        "countryID": parseInt(jQuery("#ddlCountry").val()),
        "countryName": jQuery("#ddlCountry option:selected").text().trim(),
        "stateID": parseInt(jQuery("#ddlState").val()),
        "stateName": statenamevalue,
        "cityID": parseInt(jQuery("#ddlCity").val()),
        "cityName": citynamevalue,
        "pinCode": jQuery("#pincode").val().trim(),
        "vendorName": jQuery("#vendorname").text().trim(),
        "vendorAdd": jQuery("#vendoraddress").val().trim(),
        "tAN": jQuery("#tan").val().trim(),
        "tDSTypeId": tdstype,
        "tDSTypeName": tdsname,
        "gSTClass": gstclassvalue,
        "payTermID": paymenttermvalue,
        "bankName": jQuery("#bankname").val().trim(),
        "bankAccount": jQuery("#bankaccount").val().trim(),
        "iFSCCode": jQuery("#ifsccode").val().trim(),
        "accountName": jQuery("#accountholder").val().trim(),
        "mSMECheck": jQuery("#ddlMSME option:selected").val(),
        "mSMEType": msmeselectvalue,
        "mSMENo": jQuery("#txtUdyam").val().trim(),
        "previousTurnover": jQuery("#txtLastFiscal").val().trim(),
        "secondLastTurnover": jQuery("#txt2LastFiscal").val().trim(),
        "PreviousTurnoverYear": jQuery("#txtLastFiscalyear").val().trim(),
        "secondLastTurnoverYEar": jQuery("#txt2LastFiscalyear").val().trim(),
        "contactNameMD": jQuery("#personnamealt").val().trim(),
        "mobileMD": jQuery("#vendoraltmobileno").val().trim(),
        "AltEmailID": jQuery("#vendorAltEmailID").val().trim(),
        "currencyLast2FY": jQuery("#currency2LastFiscalupdate option:selected").text().trim(),
        "currencyLastFY": jQuery("#currencyLastFiscalupdate option:selected").text().trim(),
        "contactName": jQuery("#personname").val().trim(),
        "mobile": jQuery("#vendormobileno").val().trim(),
        "gSTFile": gstfilename,
        "pANFile": panfilename,
        "mSMEFile": msmefilename,
        "cancelledCheck": checkfilename,
    }
    //console.log(JSON.stringify(data));
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorRequest/VendorProfileUpdate",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if ($('#filegst').val() != '') {
                fnUploadFilesonAzure('filegst', gstfilename, 'VR/' + sessionStorage.getItem('tmpVendorID'));

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/' + sessionStorage.getItem('tmpVendorID'));

            }

            if ($('#filemsme').val() != '') {
                fnUploadFilesonAzure('filemsme', msmefilename, 'VR/' + sessionStorage.getItem('tmpVendorID'));

            }

            if ($('#filecheck').val() != '') {
                fnUploadFilesonAzure('filecheck', checkfilename, 'VR/' + sessionStorage.getItem('tmpVendorID'));

            }

            profileerror.hide();
            jQuery("#success").text("Your data is updated successfully..");
            profilesuccess.show();
            profilesuccess.fadeOut(10000);
            fetchMyProfileVendor();
            App.scrollTo(profilesuccess, -200);
            //location.reload();

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                //fnErrorMessageText('errormsg', '');
                jQuery("#error").html("Please try again with correct ..");
                profileerror.show();
                profileerror.fadeOut(5000);
                App.scrollTo(profileerror, -200);
                jQuery.unblockUI();
            }
            jQuery.unblockUI();
            return false;
        }
    })

}

function fetchMsme() {
    if (jQuery("#ddlMSME option:selected").val() == 'Y') {
        $('.hideInput').removeClass('hide');
    } else {
        $('.hideInput').addClass('hide');
    }
}

var customersForAutoComplete;

function fetchCompanyVR() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchCompanyVR/?vendorCode=" + sessionStorage.getItem('vendorCode'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            customersForAutoComplete = JSON.parse(data[0].jsondata);

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

jQuery("#txtCompanies").typeahead({
    source: function (query, process) {
        var data = customersForAutoComplete
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.customername] = username;
            usernames.push(username.customername);
        });

        process(usernames);

    },
    minLength: 0,
    updater: function (item) {
        if (map[item].customerid != "0") {
            sessionStorage.setItem('hdnVendorID', map[item].customerid);
            var str = "<tr id=trcomp" + map[item].customerid + "><td class='hide'>" + map[item].customerid + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked" + map[item].customerid + "\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + map[item].customername + "'\,\'" + map[item].customerid + "'\)\"; id=\"chkvender" + map[item].customerid + "\" value=" + map[item].customerid + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + map[item].customername + " </td></tr>";
            jQuery('#tblcompanieslist > tbody').append(str);
            var arr = $("#tblcompanieslist tr");
            $.each(arr, function (i, item) {
                var currIndex = $("#tblcompanieslist tr").eq(i);
                var matchText = currIndex.find("td:eq(0)").text().toLowerCase();

                $(this).nextAll().each(function (i, inItem) {

                    if (matchText === $(this).find("td:eq(0)").text().toLowerCase()) {
                        $(this).remove();
                    }

                });

            });
            if ($("#selectedcompanieslists > tbody > tr").length > 0) {
                $("#selectedcompanieslists> tbody > tr").each(function (index) {
                    $("#spanchecked" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true)
                    $("#spanchecked" + $.trim($(this).find('td:eq(0)').html())).addClass("checked")
                });
            }
        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});

function Check(event, custName, custID) {

    if ($("#spanchecked" + custID).attr('class') == 'checked') {
        $("#spanchecked" + custID).removeClass("checked")
    }

    else {
        vCount = vCount + 1;
        $("#spanchecked" + custID).addClass("checked");
        var str = '<tr id=SelecetedCust' + custID + '><td class=hide>' + custID + '</td><td>' + custName + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(' + custID + ',' + 'chkvender' + custID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>'
        jQuery('#selectedcompanieslists').append(str);
        $('#divcompanieslist').find('span#spandynamic').hide();
        $('table#tblcompanieslist').closest('.inputgroup').removeClass('has-error');

    }

    if (vCount > 0) {
        jQuery('#selectedcompanieslists').show()
    }
    else {
        jQuery('#selectedcompanieslists').hide()
    }

}

function removevendor(trid, chkid) {

    vCount = vCount - 1;
    $('#SelecetedCust' + trid).remove()
    $('#trcomp' + trid).remove()
    $('#spanchecked' + trid).removeClass("checked")
    $(chkid.id).prop("disabled", false);
    if (vCount > 0) {
        jQuery('#selectedcompanieslists').show()
    }
    else {
        $('#chkAll').closest("span").removeClass("checked")
        $('#chkAll').prop("checked", false);
        jQuery('#selectedcompanieslists').hide()

    }
}

var vCount = 0;
$("#chkAll").click(function () {
    if ($("#chkAll").is(':checked') == true) {
        $('#divcompanieslist').find('span#spandynamic').hide();
        $('table#tblcompanieslist').closest('.inputgroup').removeClass('has-error');
        jQuery('#selectedcompanieslists> tbody').empty()
        vCount = 0;
        $("#tblcompanieslist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
            $('#chkvender' + vCount).prop("disabled", true);
            var vendorid = $('#chkvender' + vCount).val()
            var v = vCount;
            vCount = vCount + 1;
            var vname = $.trim($(this).find('td:eq(2)').html())
            var cid = $.trim($(this).find('td:eq(0)').html())
            jQuery('#selectedcompanieslists').append('<tr id=SelecetedVendor' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorid + ',' + 'chkvender' + v + ',SelecetedVendorPrev' + vendorid + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')

        });
    }
    else {
        $("#tblcompanieslist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").removeClass("checked");
            vCount = 0;
            $('input[name="chkvender"]').prop('disabled', false);
            jQuery('#selectedvendorlists> tbody').empty()
            jQuery('#selectedvendorlistsPrev> tbody').empty()
        });

    }
    if (vCount > 0) {
        jQuery('#selectedvendorlists').show()

    }
    else {
        jQuery('#selectedvendorlists').hide()

    }

});

//vendor myprofile_vendor.html form to send request to companies
function formSendCompanies() {
    $('#frmprofilevendornewcompany').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,

        rules: {

        },
        messages: {

        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            profilesuccess.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
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
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            profileerror.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
            //profileerror.hide();            
            sendToCompanies();
        }
    });

}

function sendToCompanies() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    //debugger;
    var custids = [];
    if ($("#selectedcompanieslists > tbody > tr").length > 0) {
        $("#selectedcompanieslists> tbody > tr").each(function (index) {
            custids.push($.trim($(this).find("td:eq(0)").text()));
        });
        var strr = custids.toString().replace(',', '#');
        $("#selectedcompanies").val(strr);
    }

    var customerids = $("#selectedcompanies").val();
    var datainfo = {
        "customersID": customerids,
        "tmpVendorID": parseInt(sessionStorage.getItem('VendorId')),

    }
    //alert(JSON.stringify(datainfo));
    //console.log(JSON.stringify(datainfo));
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "VendorRequest/VendorExtend",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(datainfo),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            companieserror.hide();
            jQuery("#sendcompaniessuccess").text("Your data has been sent successfully..");
            companiessuccess.show();
            companiessuccess.fadeOut(5000);
            fetchMyProfileVendor();
            App.scrollTo(companiessuccess, -200);
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('companieserror', 'Please try again..');
                
            }
            jQuery.unblockUI();
            return false;
        }

    });

}

var totalTabs = document.getElementsByClassName("total-tab");
var totalTab = totalTabs.length * 100;

var contactpercent = 0;
var companypercent = 0;
var accountpercent = 0;
var businesspercent = 0;


function CalContactDetailPercent() {
    //alert("contact");
    var div = document.getElementById("tab1check");
    var inputs = div.getElementsByTagName('input');
    var totalInputs = inputs.length;

    var inputsWithValue = 0;
    for (var i = 0; i < totalInputs; i++) {
        if (inputs[i].value !== '' && inputs[i].value !== null && inputs[i].value !== undefined) {
            inputsWithValue = inputsWithValue + 1;
        }
    }

    var filledPercentage = (inputsWithValue / totalInputs) * 100;
    contactpercent = Math.round(filledPercentage);

    $('#totalcontactpercent').val(contactpercent);
    $("#contact_chart").attr('data-percent', contactpercent);
    $('#contactspan').text(contactpercent);

}

function calCompanyDetailPercent() {
    //alert("company");
    var div = document.getElementById("collapse0");
    var selects = div.getElementsByTagName('select');
    var inputs = div.querySelectorAll('input.form-control');
    //console.log("selects", selects);
    var totalInputs = inputs.length;
    var totalSelect = selects.length;
    var totalFields = totalInputs + totalSelect;

    var inputsWithValuee = 0;
    for (var i = 0; i < totalInputs; i++)
        if (inputs[i].value !== '' && inputs[i].value !== null && inputs[i].value !== undefined)
            inputsWithValuee += 1;

    var selectsWithValue = 0;
    for (var j = 0; j < totalSelect; j++) {
        if (selects[j].options.selectedIndex == 0 || selects[j].options.selectedIndex == -1) {
        } else {
            selectsWithValue += 1;
        }
    }

    var totalFilledValue = inputsWithValuee + selectsWithValue;
    var filledPercentage = (totalFilledValue / totalFields) * 100;
    companypercent = Math.round(filledPercentage);

    $('#totalcompanypercent').val(companypercent);
    $('#companyspan').text(companypercent);
    $("#company_chart").attr('data-percent', companypercent);
}

function calAccountDetailPercent() {

    var tab3 = document.getElementById("collapse1");
    var selects = tab3.getElementsByTagName('select');
    var inputs = tab3.querySelectorAll('input.form-control');
    var files = tab3.getElementsByClassName('uploadedfile');

    var totalInputs = inputs.length;
    var totalSelects = selects.length;
    var totalFields = totalInputs + totalSelects;

    var inputsWithValue = 0;
    for (var i = 0; i < totalInputs; i++)
        if (inputs[i].value !== '' && inputs[i].value !== null && inputs[i].value !== undefined)
            inputsWithValue += 1;

    var selectsWithValue = 0;
    for (var j = 0; j < totalSelects; j++) {
        if (selects[j].options.selectedIndex == 0 || selects[j].options.selectedIndex == -1) {
            filesWithValue = 0;
        } else {
            selectsWithValue += 1;
        }
    }

    var inputsWithValue = 0;
    for (var i = 0; i < totalInputs; i++)
        if (inputs[i].value !== '' && inputs[i].value !== null && inputs[i].value !== undefined)
            inputsWithValue += 1;

    var filesWithValuee = 0;
    for (var k = 0; k < files.length; k++) {


        if (files[k].textContent !== '' && files[k].textContent !== null && files[k].textContent !== undefined) {
            filesWithValuee += 1;
        } else {
            filesWithValuee = 0;

        }

    }

    var totalFilledValue = inputsWithValue + selectsWithValue + filesWithValuee;
    var filledPercentage = (totalFilledValue / totalFields) * 100;
    accountpercent = Math.round(filledPercentage);
    $('#totalaccountpercent').val(accountpercent);
    $('#accountspan').text(accountpercent);
    $("#account_chart").attr('data-percent', accountpercent);

}

function calBusinessDetailPercent() {
    if ($('#ddlMSME').val() == 'Y') {
        var tab4 = document.getElementById("collapse3");
        var selects = tab4.querySelectorAll('select.selects');
        var inputs = tab4.getElementsByTagName('input');
        var files = tab4.getElementsByClassName('uploadedfile');

        var totalSelect = selects.length;
        var totalInputs = inputs.length;

        var filesWithValuee = 0;
        for (var k = 0; k < files.length; k++) {
            if (files[k].textContent !== '' && files[k].textContent !== null && files[k].textContent !== undefined) {
                filesWithValuee += 1;
            } else {
                filesWithValuee = 0;
            }
        }

        var inputsWithValue = 0;
        for (var i = 0; i < totalInputs; i++)
            if (inputs[i].value !== '' && inputs[i].value !== null && inputs[i].value !== undefined)
                inputsWithValue += 1;

        var selectsWithValue = 0;
        for (var j = 0; j < totalSelect; j++)
            if (selects[j].options.selectedIndex == 0 || selects[j].options.selectedIndex == -1) {
                selectsWithValue = 0;
            } else {
                selectsWithValue += 1;
            }

        var totalFilledValue = inputsWithValue + selectsWithValue + filesWithValuee;
        var total = totalInputs + totalSelect;
        var filledPercentage = (totalFilledValue / total) * 100;
        businesspercent = Math.round(filledPercentage);
        var totalsum = Math.round(contactpercent + companypercent + accountpercent + businesspercent);
        var $totalpercent = Math.round((totalsum / totalTab) * 100);

        $('#progresstotal').css({
            width: $totalpercent + '%'
        });

        $('#totalbusinesspercent').val(businesspercent);
        $('#totaltabspercent').val($totalpercent);
        $('#businessspan').text(businesspercent);
        $("#business_chart").attr('data-percent', businesspercent);
        $("#totalpercent").text($totalpercent + '%');

        if ($totalpercent == 100) {
            $('.requestcompanydiv').removeClass('hide');
            fetchCompanyVR();
        }

        setTimeout(function () {
            $('.cs_chart').easyPieChart({
                size: 30,
                barColor: "#e25010",
                scaleLength: 0,
                lineWidth: 3,
                trackColor: "#ccc",
                lineCap: "circle",
                animate: 2000,
            });
        }, 1000);

    } else {
        var tab4 = document.getElementById("collapse3");
        var selects = tab4.querySelectorAll('select.selectno');
        var inputs = tab4.querySelectorAll('input.selectno');
        var totalSelect = selects.length;
        var totalInputs = inputs.length;

        var inputsWithValue = 0;
        for (var i = 0; i < totalInputs; i++)
            if (inputs[i].value !== '' && inputs[i].value !== null && inputs[i].value !== undefined)
                inputsWithValue += 1;

        var selectsWithValue = 0;
        for (var j = 0; j < totalSelect; j++)
            if (selects[j].options.selectedIndex == 0 || selects[j].options.selectedIndex == -1) {
                selectsWithValue = 0;
            } else {
                selectsWithValue += 1;
            }

        var totalFilledValue = inputsWithValue + selectsWithValue;
        var total = totalInputs + totalSelect;
        var filledPercentage = (totalFilledValue / total) * 100;
        businesspercent = Math.round(filledPercentage);
        var totalsum = contactpercent + companypercent + accountpercent + businesspercent;
        var $totalpercent = Math.round((totalsum / totalTab) * 100);

        $('#progresstotal').css({
            width: $totalpercent + '%'
        });
        $('#businessspan').text(businesspercent);
        $("#business_chart").attr('data-percent', businesspercent);
        $('#businessspan').text(businesspercent);
        $("#totalpercent").text($totalpercent + '%');
        if ($totalpercent == 100) {
            $('.requestcompanydiv').removeClass('hide');
            fetchCompanyVR();
        }
        setTimeout(function () {
            $('.cs_chart').easyPieChart({
                size: 30,
                barColor: "#e25010",
                scaleLength: 0,
                lineWidth: 3,
                trackColor: "#ccc",
                lineCap: "circle",
                animate: 2000,
            });
        }, 1000);

    }

}




