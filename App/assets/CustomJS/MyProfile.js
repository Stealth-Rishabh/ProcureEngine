let isWhatsappOpted = sessionStorage.getItem('isWhatsappOpted') 
let mobileNo = sessionStorage.getItem('mobileNo');
//let mobileNo = "9821250345";
function onloadcalls() {
    Pageloaded();
    setInterval(function () { Pageloaded() }, 15000);
    App.init();
    setCommonData();
    numberonly();
    formvalidate();

    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {

        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
            $('#frmprofile').show()
            $('#frmprofilevendor').hide();
            fetchCountry()
            prefferedTimezone();
            fetchUserDetails();
            fetchMenuItemsFromSession(0, 0);
            $('#ddlCountryCd').select2();
            $('#bid').removeClass('page-sidebar-closed page-full-width');
        }
        else if (sessionStorage.getItem("UserType") == "V") {
            fetchMasters();
            prefferedTimezone();
            fetchMyProfileVendor();
            $('#ddlCountryCd').select2();
            $('#ddlCountryAltCd').select2();
            $('#ddlpreferredTime').select2();
        }
    }
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

}


var APIPath = sessionStorage.getItem("APIPath");
var cc = 0;
function fetchUserDetails() { 
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var userReqObj = {
        "UserID": sessionStorage.getItem('UserID'),
        "UserType": sessionStorage.getItem('UserType')
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(userReqObj),
        dataType: "json",
        success: function (data) {
          
            cc = 0;
            if (data.length > 0) {
                let userdetails = JSON.parse(data[0].jsondata);
                $('#username').html(userdetails[0].UserName)
                $('#ddlCountryCd').val(userdetails[0].DialingCodeMobile)
                $('#usermobileno').val(userdetails[0].MobileNo)
                $('#userEmailID').html(userdetails[0].EmailID)
                $('#userRole').html(userdetails[0].RoleName)
                $('#userdesignation').val(userdetails[0].Designation)
                //   $('#ddlpreferredTime').val(userdetails[0].preferredtimezone)
                setTimeout(function () {
                    //abheedev
                    $('#ddlpreferredTime').val(userdetails[0].preferredtimezone).trigger('change')
                }, 800)
                if (userdetails[0].DialingCodeMobile != "" && userdetails[0].DialingCodeMobile != undefined && userdetails[0].DialingCodeMobile != null) {
                  
                    setTimeout(function () {
                        $('#ddlCountryCd').val(userdetails[0].DialingCodeMobile).trigger('change')

                    }, 500)

                }
                let userOrg = JSON.parse(data[1].jsondata);
                if (userOrg != null) {
                    if (userOrg.length > 0) {
                        $('#userOrg').removeClass('hide')
                        $('#tblpurchaseOrg').empty();
                        $('#tblpurchaseOrg').append('<thead class=hide id=theadgroup><tr><th>Purchase org</th><th>Purchase Group</th><th class=hide></th></tr></thead>');
                        for (var i = 0; i < userOrg.length; i++) {
                            $('#tblpurchaseOrg').append('<tr id=TRgroup' + cc + '><td id=OrgId' + cc + ' class=hide >' + userOrg[i].PurchaseOrgID + '</td><td class=hide id=GrpId' + cc + '>' + userOrg[i].PurchaseGrpID + '</td><td>' + userOrg[i].PurchaseOrgName + '</td><td>' + userOrg[i].PurchaseGrpName + '</td><td class=hide><a class="btn  btn-xs btn-danger" onclick="deleterow(TRgroup' + cc + ',' + cc + ',' + userOrg[i].PurchaseGrpID + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                            cc = cc + 1;
                        }

                        if (jQuery('#tblpurchaseOrg tr').length > 0) {
                            $('#theadgroup').removeClass('hide');
                        }
                        else {
                            $('#theadgroup').addClass('hide');
                        }
                        
                    }
                    else {
                        $('#userOrg').addClass('hide')
                    }
                }
                else {
                    $('#userOrg').addClass('hide')
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
//vendor myprofile.html
function fetchVendorDetails() {

    //jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var userReqObj = {
        "UserID": sessionStorage.getItem('VendorId'),
        "UserType": sessionStorage.getItem('UserType')
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(userReqObj),
        dataType: "json",
        success: function (data) {
            let detail = JSON.parse(data[0].jsondata);

            $('#vendorname').html(detail[0].VendorName)
            $('#ddlCountryCd').val(detail[0].DialingCodeMobile)
            $('#vendormobileno').val(detail[0].MobileNo)
            $('#vendorEmailID').html(detail[0].EmailID)
            $('#vendoraddress').val(StringDecodingMechanism(detail[0].Address1))
            $('#vendorCity').val(StringDecodingMechanism(detail[0].CityName))
            $('#ddlCountryAltCd').val(detail[0].DialingCodePhone)
            $('#vendorphone').val(detail[0].Phone)
            $('#vendorpanno').html(detail[0].PANNo)
            $('#vendorservicetaxno').html(detail[0].ServiceTaxNo)
            $('#vendoralternateemail').val(detail[0].AlternateEmailID)
            $('#personname').val(detail[0].ContactPerson)

            setTimeout(function () {
                $('#ddlpreferredTime').val(userdetails[0].preferredtimezone)
            }, 800)
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
    
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var tzID = parseInt(sessionStorage.getItem("timezoneid"));
    var userReqObj = {
        "UserID": sessionStorage.getItem('VendorId'),
        "UserType": sessionStorage.getItem('UserType')
    }
    $("#ddlpreferredTime").val(tzID)
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + sessionStorage.getItem('VendorId') + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(userReqObj),
        dataType: "json",
        success: function (data) {

            var vendordetails = JSON.parse(data[0].jsondata);
            var vendorComps = JSON.parse(data[1].jsondata);
            var CompPer = JSON.parse(data[2].jsondata);

            var vendorCompstxt = ''
            for (var i = 0; i < vendorComps.length; i++) {
                vendorCompstxt = vendorCompstxt + vendorComps[i].customername + ' | ';

            }

            $('#vendorComp').val(vendorCompstxt.slice(0, -1));
            //code written for whatsapp notification
          
            if (isWhatsappOpted === 'Y' || isWhatsappOpted === 'N') {
               
                
                $('#uniform-whatsappAlert' + isWhatsappOpted).find('span').addClass('checked');

            }


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

            }
            else if (vendordetails[0].MSMECheck == '' || vendordetails[0].MSMECheck == null || vendordetails[0].MSMECheck == undefined) {
                $('.hideInput').addClass('hide');
                $('#ddlMSME').val(0);
            }
            else {
                $('.hideInput').addClass('hide');
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
            }
            else {
                $('#currencyLastFiscal').val('INR');
            }
            setTimeout(function () {
                if (vendordetails[0].PayTermID !== "" && vendordetails[0].PayTermID != null && vendordetails[0].PayTermID != undefined) {

                    $('#ddPayTerms').val(vendordetails[0].PayTermID).trigger('change');

                }
            }, 800)
            if (vendordetails[0].CountryID !== "" && vendordetails[0].CountryID != null && vendordetails[0].CountryID != undefined) {

                setTimeout(function () {

                    $('#ddlCountry').val(vendordetails[0].CountryID).trigger('change')
                }, 1500)
                setTimeout(function () {

                    $('#ddlState').val(vendordetails[0].StateID).trigger('change')
                }, 1500)
                setTimeout(function () {

                    $('#ddlCity').val(vendordetails[0].CityID).trigger('change')

                }, 1500)

            }
            if (vendordetails[0].DialingCodeMobile != "" && vendordetails[0].DialingCodeMobile != undefined && vendordetails[0].DialingCodeMobile != null) {
                setTimeout(function () {
                    $('#ddlCountryCd').val(vendordetails[0].DialingCodeMobile).trigger('change')

                }, 1500)

            }

            if (vendordetails[0].DialingCodePhone != "" && vendordetails[0].DialingCodePhone != undefined && vendordetails[0].DialingCodePhone != null) {

                setTimeout(function () {
                    $('#ddlCountryAltCd').val(vendordetails[0].DialingCodePhone).trigger('change')

                }, 1500)
            }
            if (sessionStorage.getItem("timezoneid") != "" && sessionStorage.getItem("timezoneid") != undefined && sessionStorage.getItem("timezoneid") != null) {

                setTimeout(function () {
                    $('#ddlpreferredTime').val(sessionStorage.getItem("timezoneid")).trigger('change')
                }, 900)
            }
            ///@abhhedev
            if (vendordetails[0].PreviousTurnover != "" && vendordetails[0].AccountName != undefined) {
                $('#txtLastFiscal').val(vendordetails[0].PreviousTurnover);
                $('#txtLastFiscal').attr("disabled", 'disabled');
            } else {

                $('#txtLastFiscal').val();
            }
            if (vendordetails[0].SecondLastTurnover != "" && vendordetails[0].SecondLastTurnover != undefined) {
                $('#txt2LastFiscal').val(vendordetails[0].SecondLastTurnover);
                $('#txt2LastFiscal').attr("disabled", 'disabled');
            } else {

                $('#txt2LastFiscal').val();
            }
            if (vendordetails[0].currencyLastFY != "" && vendordetails[0].currencyLastFY != undefined) {
                $('#currencyLastFiscalupdate').val(vendordetails[0].currencyLastFY);
                $('#currencyLastFiscalupdate').attr("disabled", 'disabled');
            } else {

                $('#currencyLastFiscalupdate').val();
            }
            if (vendordetails[0].currencyLast2FY != "" && vendordetails[0].currencyLast2FY != undefined) {
                $('#currency2LastFiscalupdate').val(vendordetails[0].currencyLast2FY);
                $('#currency2LastFiscalupdate').attr("disabled", 'disabled');
            } else {

                $('#currency2LastFiscalupdate').val();
            }
            if (vendordetails[0].PreviousTurnoverYear != "" && vendordetails[0].PreviousTurnoverYear != undefined) {
                $('#txtLastFiscalyear').val(vendordetails[0].PreviousTurnoverYear);
                $('#txtLastFiscalyear').attr("disabled", 'disabled');
            } else {

                $('#txtLastFiscalyear').val();
            }
            if (vendordetails[0].SecondLastTurnoverYear != "" && vendordetails[0].SecondLastTurnoverYear != undefined) {
                $('#txt2LastFiscalyear').val(vendordetails[0].currencyLastFY);
                $('#txt2LastFiscalyear').attr("disabled", 'disabled');
            } else {

                $('#txt2LastFiscalyear').val();
            }

            $('#personname').val(vendordetails[0].ContactPerson)
            $('#personnamealt').val(vendordetails[0].ContactNameAlt)
            $('#vendorname').html(vendordetails[0].VendorName)
            $('#ddlCountryCd').val(vendordetails[0].DialingCodeMobile)
            $('#vendormobileno').val(vendordetails[0].MobileNo)
            $('#vendorEmailID').html(vendordetails[0].EmailID)
            $('#vendorAltEmailID').val(vendordetails[0].AlternateEmailID)
            $('#ddlCountryAltCd').val(vendordetails[0].DialingCodePhone)
            $('#vendoraltmobileno').val(vendordetails[0].Phone)
            $('#vendoraddress').val(StringDecodingMechanism(vendordetails[0].Address1))
            $("#ddlpreferredTime").find(`option[value=${sessionStorage.getItem("timezoneid")}]`).attr("selected", "selected")
            $('#vendorphone').val(data[0].phone)
            $('#vendorpanno').html(vendordetails[0].PANNo)
            $('#vendorservicetaxno').html(vendordetails[0].ServiceTaxNo)
            $('#vendoralternateemail').val(data[0].alternateEmailID)

            $('#pincode').val(vendordetails[0].pincode)
            $('#product').val(vendordetails[0].product)
            $('#txtLastFiscal').val(vendordetails[0].PreviousTurnover)
            $('#txt2LastFiscal').val(vendordetails[0].SecondLastTurnover)
            if (vendordetails[0].PreviousTurnoverYear != "") {
                $('#txtLastFiscalyear').val(vendordetails[0].PreviousTurnoverYear)
            }
            else {
                $('#txtLastFiscalyear').val(getCurrentFinancialYear())

            }
            if (vendordetails[0].PreviousTurnoverYear != "") {
                $('#txt2LastFiscalyear').val(vendordetails[0].SecondLastTurnoverYear)
            }
            else {
                $('#txt2LastFiscalyear').val(getlastFinancialYear())
            }

            $('#progresstotal').css({
                width: CompPer[0].totalfilled + '%'
            });


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
            //   jQuery.unblockUI();
            return false;
        }
    });

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
jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    //"Value cannot be {0}"
    "This field is required."
);

function formvalidate() {

    $('#frmprofile').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            usermobileno: {
                required: true
            },
            ddlCountryCd: {
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
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
            personname: {
                required: true,
            },
            vendormobileno: {
                required: true
            },

            /* txtUdyam: {
                 required: true,
             },
             filemsme: {
                 required: true
             },
             ddlMSMEClass: {
                 required: true,
                 notEqualTo: 0
             }*/
        },
        messages: {
            ddlMSMEClass: {
                required: "MSME Class is required."
            },
            txtUdyam: {
                required: "Udyam No. is required."
            },
            filemsme: {
                required: "Udyam certificate is required."
            }
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
            label.closest('.form-group,.xyz').removeClass('has-error');
            //label.remove();
        },

        //errorPlacement: function (error, element) {
        //    profileerror.insertAfter(element.closest('.xyz'));
        //},

        submitHandler: function (form) {

            updateVendor();
        }
    });
}

//vendor profile.html vendor form

function updMobileNo() {

    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var _cleanString = StringEncodingMechanism($('#vendoraddress').val());
    var _cleanString1 = StringEncodingMechanism($('#vendorCity').val());
    var data = {
        "UserID": sessionStorage.getItem("UserID"),
        "UserType": sessionStorage.getItem('UserType'),
        "DialingCd": parseInt(jQuery("#ddlCountryCd option:selected").val()),
        "MobileNo": $('#usermobileno').val(),
        "Address1": _cleanString,
        "Address2": _cleanString1,
        "CompanyPhoneNo": $('#vendorphone').val(),
        "AlternateEmailID": '',
        "Designation": $('#userdesignation').val(),
        "ContactPerson": "",
        "PrefferedTZ": parseInt(jQuery("#ddlpreferredTime").val())
    }
    sessionStorage.setItem("timezoneid", parseInt(jQuery("#ddlpreferredTime option:selected").val()))
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

            var err = xhr.responseText;//eval("(" + + ")");
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

    var _cleanString5 = StringEncodingMechanism(jQuery("#vendorname").text().trim());
    var _cleanString6 = StringEncodingMechanism(jQuery("#vendoraddress").val().trim());
    var _cleanString7 = StringEncodingMechanism(jQuery("#bankname").val().trim());
    var _cleanString8 = StringEncodingMechanism(jQuery("#accountholder").val().trim());
    var _cleanString9 = StringEncodingMechanism(jQuery("#personname").val().trim());
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var msmetype = StringEncodingMechanism(jQuery("#ddlMSMEClass option:selected").val().trim());
    var gstclass = jQuery("#ddlGSTclass option:selected").val().trim();
    var paymentterm = parseInt(jQuery("#ddPayTerms option:selected").val().trim());
    var natureofest = jQuery("#ddlNatureEstaiblishment option:selected").text();
    var vendorcatname = jQuery("#ddlVendorType option:selected").text().trim();
    var statename = jQuery("#ddlState option:selected").text().trim();
    var cityname = jQuery("#ddlCity option:selected").text().trim();

    var dialingCd = jQuery("#ddlCountryCd option:selected").val().trim();
    var dialingCdAlt = jQuery("#ddlCountryAltCd option:selected").val().trim();
    var tdstype = 0;
    var tdsname = '';
    var paymenttermvalue = 0;

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

    if (paymentterm != 0) {
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
        //"vendorName": jQuery("#vendorname").text().trim(),
        "vendorName": _cleanString5,
        //"vendorAdd": jQuery("#vendoraddress").val().trim(),
        "vendorAdd": _cleanString6,
        "tAN": jQuery("#tan").val().trim(),
        "tDSTypeId": tdstype,
        "tDSTypeName": tdsname,
        "gSTClass": gstclassvalue,
        "payTermID": paymenttermvalue,
        "bankName": _cleanString7,
        "bankAccount": jQuery("#bankaccount").val().trim(),
        "iFSCCode": jQuery("#ifsccode").val().trim(),
        "accountName": _cleanString8,
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
        "contactName": _cleanString9,
        "mobile": jQuery("#vendormobileno").val().trim(),
        "gSTFile": gstfilename,
        "pANFile": panfilename,
        "mSMEFile": msmefilename,
        "cancelledCheck": checkfilename,
        "DialingCodeMobile": parseInt(dialingCd),
        "DialingCodePhone": parseInt(dialingCdAlt),
        "PrefferedTZ": parseInt(jQuery("#ddlpreferredTime option:selected").val())

    }

    sessionStorage.setItem("timezoneid", parseInt(jQuery("#ddlpreferredTime option:selected").val()))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorRequest/VendorProfileUpdate",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if ($('#filegst').val() != '') {
                fnUploadFilesonAzure('filegst', gstfilename, 'VR/' + sessionStorage.getItem('VendorId'));

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/' + sessionStorage.getItem('VendorId'));

            }

            if ($('#filemsme').val() != '') {
                fnUploadFilesonAzure('filemsme', msmefilename, 'VR/' + sessionStorage.getItem('VendorId'));

            }

            if ($('#filecheck').val() != '') {
                fnUploadFilesonAzure('filecheck', checkfilename, 'VR/' + sessionStorage.getItem('VendorId'));

            }

            profileerror.hide();
            jQuery("#success").text("Your data is updated successfully..");
            profilesuccess.show();
            profilesuccess.fadeOut(5000);
            App.scrollTo(profilesuccess, -200);
            setTimeout(function () {
                //fetchMyProfileVendor();
                location.reload();
            }, 5000)
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
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
        $('#frmprofilevendornew').validate();
        $('input[name="txtUdyam"]').rules('add', {
            required: true
        });
        $('input[name="filemsme"]').rules('add', {
            required: true
        });
        $('#ddlMSMEClass').rules('add', {
            required: true
        });


    } else {
        $('.hideInput').addClass('hide');
        $('input[name="filemsme"]').rules('remove');
        $('input[name="txtUdyam"]').rules('remove');
        $('input[name="ddlMSMEClass"]').rules('remove');
    }
}
$("#txtUdyam").keyup(function () {
    $("#txtUdyam").css("border-color", "");
});
$("#filemsme").keyup(function () {
    $("#filemsme").css("border-color", "");
});
var customersForAutoComplete = '';

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
            $("#txtCompanies").append("<option value=0>Select Companies</option>");
            if (data.length > 1) {
                customersForAutoComplete = JSON.parse(data[0].jsondata);
                $("#txtCompanies").empty()
                $("#txtCompanies").append("<option value=0>Select Companies</option>");
                if (customersForAutoComplete.length > 0) {

                    for (var i = 0; i < data.length; i++) {
                        $("#txtCompanies").append("<option value=" + customersForAutoComplete[i].customerid + ">" + customersForAutoComplete[i].customername + "</option>");
                    }
                }
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
function fnAddCustomers() {
    var cusid = $("#txtCompanies option:selected").val();
    var cusname = $("#txtCompanies option:selected").text();
    if (cusid != 0) {
        sessionStorage.setItem('hdnVendorID', $("#txtCompanies option:selected").val());
        var str = "<tr id=trcomp" + cusid + "><td class='hide'>" + cusid + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked" + cusid + "\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + cusname + "'\,\'" + cusid + "'\)\"; id=\"chkvender" + cusid + "\" value=" + cusid + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + cusname + " </td></tr>";
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
        $("#txtCompanies").val('0')
    }
}
$("#txtCompanies").keypress(function (e) {
    if (e.which == 13) {
        return false;

    }
})
//jQuery("#txtCompanies").typeahead({
//    source: function (query, process) {
//        var data = customersForAutoComplete
//        usernames = [];
//        map = {};
//        var username = "";
//        jQuery.each(data, function (i, username) {
//            map[username.customername] = username;
//            usernames.push(username.customername);
//        });

//        process(usernames);

//    },
//    minLength: 0,
//    updater: function (item) {
//        if (map[item].customerid != "0") {
//            sessionStorage.setItem('hdnVendorID', map[item].customerid);
//            var str = "<tr id=trcomp" + map[item].customerid + "><td class='hide'>" + map[item].customerid + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked" + map[item].customerid + "\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + map[item].customername + "'\,\'" + map[item].customerid + "'\)\"; id=\"chkvender" + map[item].customerid + "\" value=" + map[item].customerid + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + map[item].customername + " </td></tr>";
//            jQuery('#tblcompanieslist > tbody').append(str);
//            var arr = $("#tblcompanieslist tr");
//            $.each(arr, function (i, item) {
//                var currIndex = $("#tblcompanieslist tr").eq(i);
//                var matchText = currIndex.find("td:eq(0)").text().toLowerCase();

//                $(this).nextAll().each(function (i, inItem) {

//                    if (matchText === $(this).find("td:eq(0)").text().toLowerCase()) {
//                        $(this).remove();
//                    }

//                });

//            });
//            if ($("#selectedcompanieslists > tbody > tr").length > 0) {
//                $("#selectedcompanieslists> tbody > tr").each(function (index) {
//                    $("#spanchecked" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true)
//                    $("#spanchecked" + $.trim($(this).find('td:eq(0)').html())).addClass("checked")
//                });
//            }
//        }
//        else {

//            gritternotification('Please select Vendor  properly!!!');
//        }

//        return item;
//    }

//});

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
//function formSendCompanies() {
//    $('#frmprofilevendornewcompany').validate({
//        errorElement: 'span',
//        errorClass: 'help-block',
//        focusInvalid: false,

//        rules: {

//        },
//        messages: {

//        },
//        invalidHandler: function (event, validator) { //display error alert on form submit   
//            profilesuccess.hide();
//            jQuery("#error").text("You have some form errors. Please check below.");
//            profileerror.show();
//            profileerror.fadeOut(5000);
//            App.scrollTo(profileerror, -200);
//        },

//        highlight: function (element) { // hightlight error inputs
//            $(element)
//                .closest('.form-group').addClass('has-error'); // set error class to the control group
//        },
//        unhighlight: function (element) { // revert the change done by hightlight
//            $(element)
//                .closest('.form-group').removeClass('has-error'); // set error class to the control group
//        },

//        success: function (label) {
//            label.closest('.form-group').removeClass('has-error');
//            label.remove();
//        },

//        errorPlacement: function (error, element) {
//            profileerror.insertAfter(element.closest('.xyz'));
//        },

//        submitHandler: function (form) {
//            //profileerror.hide();            
//            sendToCompanies();
//        }
//    });

//}

function sendToCompanies() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    var custids = [];
    if ($("#selectedcompanieslists > tbody > tr").length > 0) {
        $("#selectedcompanieslists> tbody > tr").each(function (index) {
            custids.push($.trim($(this).find("td:eq(0)").text()));
        });
        var strr = custids.toString().replace(',', '#');
        $("#selectedcompanies").val(strr);
    }


    var datainfo = {
        "customersID": $("#selectedcompanies").val(),
        "tmpVendorID": parseInt(sessionStorage.getItem('VendorId')),

    }


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


function numberonly() {
    $(".numberonly").keyup(function () {
        $(".numberonly").val(this.value.match(/[0-9]*/));
    });

}
//translation code begin by abhee
function multilingualLanguage() {

    var set_locale_to = function (locale) {
        if (locale) {
            $.i18n().locale = locale;
        }
        $('body').i18n();
    };

    jQuery(function () {
        $.i18n().load({
            'en': 'jquery.i18n/language/en/translation.json', // Messages for english
            'fr': 'jquery.i18n/language/fr/translation.json' // message for french
        }).done(function () {
            set_locale_to(url('?locale'));


            $(".navbar-language").find(`option[value=${$.i18n().locale}]`).attr("selected", "selected")
            History.Adapter.bind(window, 'statechange', function () {
                set_locale_to(url('?locale'));

            });
            $('.navbar-language').change(function (e) {
                e.preventDefault();
                $.i18n().locale = $('option:selected', this).data("locale");
                History.pushState(null, null, "?locale=" + $.i18n().locale);

            });

            $('a').click(function (e) {

                if (this.href.indexOf('?') != -1) {
                    this.href = this.href;
                }
                else if (this.href.indexOf('#') != -1) {
                    e.preventDefault();
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }
                else {

                    this.href = this.href + "?locale=" + $.i18n().locale
                }
            });



        });
    });

}
//whatsapp notification changes

$('input[name="whatsappAlert"]').change(function () {
       
        if ($(this).val() == "Y") {
            $.ajax({
                url: sessionStorage.getItem("APIPath") + "User/UpdateWhatsApp/?IsWhatsappOpted=Y",
                type: "POST",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                data: [],
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    SendWhatsApp()
                    sessionStorage.setItem('isWhatsappOpted', 'Y');
                    isWhatsappOpted = sessionStorage.getItem('isWhatsappOpted');
                    console.log(isWhatsappOpted);
                },
                error: function (error) {
                    console.error("Error sending WhatsApp message:", error);
                }
            });
        }
        else {
            $.ajax({
                url: sessionStorage.getItem("APIPath") + "User/UpdateWhatsApp/?IsWhatsappOpted=N",
                type: "POST",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                data: [],
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    sessionStorage.setItem('isWhatsappOpted', 'N');
                    isWhatsappOpted = sessionStorage.getItem('isWhatsappOpted');
                    console.log(isWhatsappOpted);
                },
                error: function (error) {
                    console.error("Error sending WhatsApp message:", error);
                }
            });
        }
    });





function SendWhatsApp() {
   
    let data = {
        "tonumber": mobileNo,
        "template": "vendorwelcome"
    }
    $.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/SendWhatsApp",
        type: "POST",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
           
            bootbox.alert("You are successfully subscribed to Whatsapp", function () {
                return true;
            });
        },
        error: function (error) {
            console.error("Error sending WhatsApp message:", error);
        }
    });
}