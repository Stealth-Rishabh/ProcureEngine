let gstflag=true;
let isWhatsappOpted = sessionStorage.getItem('isWhatsappOpted')
let mobileNo = sessionStorage.getItem('mobileNo');

//let mobileNo = "9821250345";
function onloadcalls() {
    Pageloaded();
    setInterval(function () { Pageloaded() }, 15000);
    App.init();
    setCommonData();
    numberonly();
    //formvalidate();
    FormValidateContact();
    FormValidateCompany();
    validateUserPro()
    FormValidateBank();
    
    


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
            fetchCountry();
            
            prefferedTimezone();
            $('#ddlCountryCd').select2();
            $('#ddlCountryCdPhone').select2();
            $('#ddlpreferredTime').select2();
            $('#ddlcurrency').select2();
            $('#currencyFiscalupdate').select2();

            setTimeout(function () {

                fetchMyProfileVendor()
            }, 800)


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
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
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
            $('#ddlCountryCdPhone').val(detail[0].DialingCodePhone)
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
/*function fetchMyProfileVendor() {
   
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var tzID = parseInt(sessionStorage.getItem("timezoneid"));
    var userReqObj = {
        "UserID": sessionStorage.getItem('VendorId'),
        "UserType": sessionStorage.getItem('UserType')
    }
    $("#ddlpreferredTime").val(tzID)
    //dummy code for table
    let childdata = {
        "childId": 8989,
        "companyName":"ASPL PVT limited"
        }
    $('#tblCompaniesFoundDetails').empty();
    $('#tblCompaniesFoundDetails').append("<thead><tr><th class='hide'></th><th>Company Name</th><th>Address</th><th>Tax Identification Number</th><th></th></tr></thead><tbody>")
    $('#tblCompaniesFoundDetails').append("<tr><td class='hide'>" + childData.childId + "</td><td>" + childData.companyName + "</td><td>" + addrC + "</td><td>" + taxIdNo + "</td><td><a href=\"#\"   onclick=\"ExtendVendor(\'" + parentData.vendorID + "'\,\'" + childData[i].companyName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCodeMobile + "'\,\'" + parentData.mobileNo + "'\,\'" + childData[i].address + "'\,\'" + childData[i].zipCode + "'\,\'" + (childData[i].taxId || "").toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + childData[i].taxId2.toUpperCase() + "'\,\'" + parentData.action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].countryID || 111) + "'\,\'" + (childData[i].stateID || 3508) + "'\,\'" + parentData.preferredtimezone + "'\,\'" + (childData[i].cityID || 33110) + "'\,\'" + (childData[i].childId || "") + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Extend</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + parentData.vendorID + "'\,\'" + parentData.vendorName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCode + "'\,\'" + parentData.mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + childData[i].zipCode + "'\,\'" + childData[i].taxId.toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + childData[i].taxId2.toUpperCase() + "'\,\'" + childData[i].action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].countryID || "") + "'\,\'" + (childData[i].stateID || "") + "'\,\'" + (childData[i].cityID || "") + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");

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
*/
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

/*function formvalidate() {

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

            *//* txtUdyam: {
                 required: true,
             },
             filemsme: {
                 required: true
             },
             ddlMSMEClass: {
                 required: true,
                 notEqualTo: 0
             }*//*
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
}*/

//vendor profile.html vendor form

function updMobileNo() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    var _cleanString = StringEncodingMechanism($('#vendoraddress').val());
    var _cleanString1 = StringEncodingMechanism(($('#vendorCity').val()).replace(/[,|-]/g, " "));
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
    var dialingCdAlt = jQuery("#ddlCountryCdPhone option:selected").val().trim();
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
                fnUploadFilesonAzure('filegst', gstfilename, 'VR/' + $('#hdnChildID').val());

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/' + $('#hdnChildID').val());

            }

            if ($('#filemsme').val() != '') {
                fnUploadFilesonAzure('filemsme', msmefilename, 'VR/' + $('#hdnChildID').val());

            }

            if ($('#filecheck').val() != '') {
                fnUploadFilesonAzure('filecheck', checkfilename, 'VR/' + $('#hdnChildID').val());

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


    }
    else {
        $('.hideInput').addClass('hide');
        $('input[name="filemsme"]').rules('remove');
        $('input[name="txtUdyam"]').rules('remove');
        // $('input[name="ddlMSMEClass"]').rules('remove');
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

//fetch profile by email




//myprofile changes based on email
let VendorId = parseInt(sessionStorage.getItem('VendorId'));
let customerid = parseInt(sessionStorage.getItem('CustomerID'));
function fetchMyProfileVendor() {
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "RegisterParticipants/GetVendors/?FieldName=" + $('#ddlUI').val() + "&FieldValue=" + $('#txtUI').val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        url: sessionStorage.getItem("APIPath") + "VendorLCM/GetVendorById/?Id=" + VendorId + "&CustomerId=" + customerid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        async: false,
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
            $('.coun_stat_city_select').show()
            $('.coun_stat_city').hide();


            let parentData = data.vendorMasterToReturn;
            let childData = data.vendorChildrenToReturn;
            ParticipantID = parentData.vendorID;


            let isactiveUser = parentData.isActive;
           
           
             $("#personname").val(StringDecodingMechanism(parentData.contactPerson))
            $("#personnamealt").val(StringDecodingMechanism(parentData.contactNameAlt))

            $("#vendormobileno").val(parentData.mobileNo)
            $("#vendoraltmobileno").val(parentData.phone)
            $("#ddlCountryCd").val(parentData.dialingCodeMobile).trigger("change")
            $("#ddlCountryCdPhone").val(parentData.dialingCodePhone).trigger("change")
            $("#ddlpreferredTime").val(parentData.preferredtimezone).trigger("change")
            $("#vendorEmailID").val(parentData.emailID)
            if (parentData.alternateEmailID == "") {
                $("#vendorAltEmailID").val(parentData.emailID)
            }
            else {
                $("#vendorAltEmailID").val(parentData.alternateEmailID)
            }

            if (isWhatsappOpted === 'Y' || isWhatsappOpted === 'N') {


                $('#uniform-whatsappAlert' + isWhatsappOpted).find('span').addClass('checked');

            }


            $("#hdnParticipantID").val(parentData.vendorID)



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


                    $('#tblCompaniesFoundDetails').append("<tr><td class='hide'>" + childData[i].childId + "</td><td>" + childData[i].companyName + "</td><td>" + addrC + "</td><td>" + taxIdNo + "</td><td><a href=\"#\"   onclick=\"EditVendor(\'" + parentData.vendorID + "'\,\'" + childData[i].companyName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCodeMobile + "'\,\'" + parentData.mobileNo + "'\,\'" + encodeURIComponent(StringDecodingMechanism(childData[i].address)) + "'\,\'" + childData[i].zipCode + "'\,\'" + (childData[i].taxId || "").toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + childData[i].taxId2.toUpperCase() + "'\,\'" + parentData.action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].countryID ) + "'\,\'" + childData[i].stateID + "'\,\'" + parentData.preferredtimezone + "'\,\'" + childData[i].cityId + "'\,\'" + (childData[i].childId ) + "'\,\'" + (childData[i].supplierType || "0") + "'\,\'" + (childData[i].msmeCheck || "N") + "'\,\'" + (childData[i].msmeType || "0") + "'\,\'" + (childData[i].msme || "") + "'\,\'" + (childData[i].msmeFile || "") + "'\,\'" + (childData[i].taxIdFile || "") + "'\,\'" + (childData[i].taxId2File || "") + "'\,\'" + (childData[i].payTerm || "0") + "'\,\'" + (childData[i].bankName || "") + "'\,\'" + (childData[i].bankRoutingNumber || "") + "'\,\'" + (childData[i].bankAccountNumber || "") + "'\,\'" + (childData[i].cancelledCheckFile || "") + "'\,\'" + childData[i].taxIdType + "'\,\'" + childData[i].taxIdType2 + "'\,\'" + childData[i].city + "'\,\'" + childData[i].regionKey + "'\,\'" + childData[i].countryKey + "'\,\'" + childData[i].langu + "'\,\'" + childData[i].currency + "'\,\'" + childData[i].gstnStatus + "'\,\'" + childData[i].eInvoiceStatus + "'\,\'" + childData[i].taxpayerType   + "'\,\'" + childData[i].legalName + "'\)\" class=\"btn btn-xs yellow\"><i class=\"fa fa-edit\"></i>Edit</a>&nbsp;<a href=\"#\"   onclick=\"AddVendor(\'" + parentData.vendorID + "'\,\'" + parentData.vendorName + "'\,\'" + parentData.emailID + "'\,\'" + parentData.dialingCodePhone + "'\,\'" + parentData.phone + "'\,\'" + parentData.dialingCode + "'\,\'" + parentData.mobileNo + "'\,\'" + addr1 + "'\,\'" + addr2 + "'\,\'" + childData[i].zipCode + "'\,\'" + childData[i].taxId.toUpperCase() + "'\,\'" + (childData[i].isActive || "") + "'\,\'" + childData[i].taxId2.toUpperCase() + "'\,\'" + childData[i].action + "'\,\'" + parentData.vendorCode + "'\,\'" + parentData.alternateEmailID + "'\,\'" + (childData[i].countryID || "") + "'\,\'" + (childData[i].stateID || "") + "'\,\'" + (childData[i].cityID || "") + "'\)\" class=\"btn btn-xs green hide\"><i class=\"fa fa-plus\"></i>Add</a></td></tr>");
                    $('#btnAddAnother').removeClass('hide');

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


//edit vendor

function EditVendor(vendorid, vname, emailid, dialingcodephone, phone, dialingcode, mobile, addr, zipcode, gst, isactive, pan, buttonname, vendorcode, alternateemailid, countryid, stateid, prefferredTZ, cityid, childid, supplierType, msmeCheck, msmeType, msmeNo, msmeFile, taxIdFile, taxId2File, payTerm, bankName, bankRoutingNumber, bankAccountNumber, cancelledCheckFile, taxIdType, taxIdType2, city, regionKey, countryKey, Langu, currency,gstnstatus,einvoicestatus,taxpayertype,legalName) {
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
     
     setTimeout(function() {
         
           
    let customerid = parseInt(sessionStorage.getItem('CustomerID'));
    $("#filegst").hide()
    $("#filepan").hide()


    /* $('.coun_stat_city_select').hide()
     $('.coun_stat_city').show();*/
   
    if(taxIdType=="IN3") {
        gstflag=true;
    }
    else{
        gstflag=true;
        $('#txtTINType').removeAttr('disabled')
    }
    $('#childDetailsForm').removeClass('hide')
    $("#bankaccordion").show()
    $("#financeaccordion").show()
    /* $('#ddlCountrylabel').text(country)
     $('#ddlStatelabel').text(state)
     $('#ddlCitylabel').text(city)*/

    $('#hdnFlagType').val(buttonname);
    $('#hdnChildID').val(childid);

    jQuery("#hdnParticipantID").val(vendorid);
    $("#hdnParticipantCode").val(vendorcode);
    jQuery("#vendorname").val(legalName);
    jQuery("#TradeName").val(vname);
    jQuery("#vendoraddress").val(decodeURIComponent(addr));
    
    jQuery("#gstnStatus").val(gstnstatus);
    jQuery("#eInvoiceStatus").val(einvoicestatus);
    jQuery("#taxpayerType").val(taxpayertype);

    jQuery("#vendorpanno").val(pan);

    jQuery("#txtTINNo").val(gst);
    jQuery("#txtPhoneNo").val(phone);
    jQuery("#txtMobileNo").val(mobile);
    jQuery("#txtcompanyemail").val(emailid);
    jQuery("#txtAlternateeMailID").val(alternateemailid);
    jQuery("#pincode").val(zipcode)

     $('#ddlCountry').val(countryKey||"IN").trigger('change')


    //company specific
    
    jQuery("#ddlNatureEstaiblishment").val("Private Limited Company");
    $('#ddlVendorType').val(supplierType).trigger('change')
    $('#ddlMSME').val(msmeCheck).trigger('change')
    $('#ddlMSMEClass').val(msmeType).trigger('change')

    $('#txtUdyam').val(msmeNo)
    $('#msmeattach').html(msmeFile)
    $('#gstattach').html(taxIdFile)
    $('#panattach').html(taxId2File)

    //Bank specific
    $('#ddPayTerms').val("0").trigger('change')
    $('#ifsccode').val("")
    $('#bankname').val("")
    $('#bankaccount').val("")
    $('#accountholder').val("")
    $('#checkattach').html("")

    //finance specific




    $('#ddlCountry').attr('disabled', 'disabled');
    $('#vendorpanno').attr('disabled', 'disabled');
    
    $('#txtTINNo').removeAttr('disabled');
    

    $('#vendorname').attr('disabled', 'disabled');
    $('#ddlNatureEstaiblishment').attr('disabled', 'disabled');

    //hide tags
    $('#bankForm').hide();
    $('#financeform').hide();

    $('#ddlpreferredTime').val(prefferredTZ).trigger('change') //abheedev 28/11/2022 bug 530
    GetFinancialDetail(parseInt(childid))
    GetBankDetail(parseInt(childid), customerid, parseInt(vendorid))


   
    
     setTimeout(function () {
        
        $('#ddlState').val(regionKey).trigger('change')
    }, 2000)
    

    setTimeout(function () {

        $('#ddlCity').val(cityid).trigger('change')
    }, 2000)
   

    $('#ddllanguage').val(Langu).trigger('change')
    $('#ddlcurrency').val(currency).trigger('change')
    $('#txtTINType').val(taxIdType).trigger('change')
    $('#txtTINType2').val(taxIdType2).trigger('change')
    
    showGST()
    showPAN()
    
    $('#AddAssociate').addClass('hide');
    $('#buttoncompanyupdate').show();
    
    jQuery.unblockUI();
    
    
  }, 500); 
 
   
}





//update contact detail
function updateVendorContactDetails() {
    var encodevendorName = StringEncodingMechanism($('#personnamealt').val());
    var encodeContactPerson = StringEncodingMechanism($('#personname').val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    let data = {
        "VendorID": parseInt(sessionStorage.getItem('VendorId')),
        "EmailID": $('#vendorEmailID').val(),
        "AlternateEmailID": $('#vendorAltEmailID').val(),
        "ContactNameAlt": encodevendorName,
        "ContactPerson": encodeContactPerson,
        "MobileNo": $('#vendormobileno').val(),
        "Phone": $('#vendoraltmobileno').val(),
        "DialingCodeMobile": parseInt($('#ddlCountryCd').val()),
        "DialingCodePhone": parseInt($('#ddlCountryCdPhone').val()),
        "preferredtimezone": parseInt($('#ddlpreferredTime').val())
    }



    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: APIPath + "VendorLCM/UpdatePrimaryDetail",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {

            
            
            profileerror.hide();
            jQuery.unblockUI();
            jQuery("#success").text("Your Contact details updated successfully..");
            profilesuccess.show();
            profilesuccess.fadeOut(5000);
            App.scrollTo(profilesuccess, -200);
          //  setTimeout(function () { location.reload() }, 2000)
          setTimeout(function () { fetchMyProfileVendor() }, 2000)
           
        },
        error: function (xhr, status, error) {

           
            jQuery.unblockUI();
        }
    });
}


function UpdateCompanyDetail() {
  
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    
    
   

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
    if ($('#msmeattach').html() !== '') {
        msmefilename = $('#msmeattach').html();
    } else {
        msmefilename = jQuery('#filemsme').val().substring(jQuery('#filemsme').val().lastIndexOf('\\') + 1)
        msmefilename = msmefilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }
    if (jQuery("#txtTINType option:selected").val() == "IN3") {
        if(gstflag==false){
            jQuery("#errordiv").text("Please select valid GST to proceed");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
            jQuery.unblockUI();
            return false;  
        }
        if (gstfilename == "" || panfilename == "") {
            jQuery("#errordiv").text("please attach GST/PAN attach to proceed...");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
            jQuery.unblockUI();
            return false;
           
        }
    }
    else if (jQuery("#txtTINType option:selected").val() == "" && $("#ddlCountry option:selected").val()=='IN'){
        
       if ( panfilename == ""||jQuery("#vendorpanno").val()=="") {
            jQuery("#errordiv").text("please attach PAN details to proceed...");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
            jQuery.unblockUI();
            return false;
           
        }
        
        
        
    }

    let encodedvendoraddress=StringEncodingMechanism($('#vendoraddress').val());
    let cleanTradeName=StringEncodingMechanism(jQuery("#TradeName").val());
    
    let data = {
        "ChildId": parseInt($('#hdnChildID').val()),
        "Address":encodedvendoraddress ,
        "City": jQuery("#ddlCity option:selected").text(),
        "State": jQuery("#ddlState option:selected").data('statename'),
        "Country": jQuery("#ddlCountry option:selected").text(),
        "ZipCode": $('#pincode').val(),
        "TaxId": $('#txtTINNo').val(),
        "TaxIdType": jQuery("#txtTINType option:selected").val(),
        "TaxId2": $('#vendorpanno').val() || "",
        "TaxIdType2": jQuery("#txtTINType2 option:selected").val(),
        "MSME": jQuery("#txtUdyam").val(),
        "MSMEType": jQuery("#ddlMSMEClass option:selected").val(),
        "MSMECheck": jQuery("#ddlMSME option:selected").val(),
        "CompanyName": $('#vendorname').val(),
        "TaxIdFile": gstfilename,
        "TaxId2File": panfilename,
        "MSMEFile": msmefilename,
        "CityId": parseInt(jQuery("#ddlCity option:selected").val()),
        "StateId": parseInt(jQuery("#ddlState option:selected").data('stateid')),
        "CountryId": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
        "SupplierType": jQuery("#ddlVendorType option:selected").val(),
        "CountryKey": jQuery("#ddlCountry option:selected").val(),
        "RegionKey": jQuery("#ddlState option:selected").val(),
        "Langu": jQuery("#ddllanguage option:selected").val(),
        "Currency": jQuery("#ddlcurrency option:selected").val(),
        "TradeName":cleanTradeName,
        "GSTNStatus":$('#gstnStatus').val(),
        "EInvoiceStatus":$('#eInvoiceStatus').val(),
        "TaxpayerType":$('#taxpayerType').val(),
    }

   
   
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: APIPath + "VendorLCM/UpdateCompanyDetail/?Id=" + VendorId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
        
             if ($('#filegst').val() != '') {
                fnUploadFilesonAzure('filegst', gstfilename, 'VR/' + $('#hdnChildID').val());

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/' + $('#hdnChildID').val());

            }

            if ($('#filemsme').val() != '') {
                fnUploadFilesonAzure('filemsme', msmefilename, 'VR/' + $('#hdnChildID').val());

            }

           
            
            profileerror.hide();
            jQuery.unblockUI();
            jQuery("#success").text("Your Company specific details updated successfully..");
            profilesuccess.show();
            profilesuccess.fadeOut(5000);
            App.scrollTo(profilesuccess, -200);
            setTimeout(function () { fetchMyProfileVendor() }, 1500)
           
        },
        error: function (xhr, status, error) {
             
             var err = xhr.responseText
             jQuery("#error").text(err);
             profileerror.show();
             profileerror.fadeOut(5000);
             App.scrollTo(profileerror, -200);
      
            jQuery.unblockUI();
        }
    });
    
}




function UpdateBankDetail() {
   
    $('#buttonbankupdate').attr('disabled','disabled');
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
    let encodedbankname=StringEncodingMechanism(jQuery("#bankname").val());
   
   
    if (ActionType == "Add") {
        bankurl = APIPath + "VendorLCM/UpdateBankDetail/?ActionType=Add"
        data = {
            "ChildId": parseInt($('#hdnChildID').val()),
            "BankCountryKey": "IN",
            "BankRoutingNumber": jQuery("#ifsccode").val(),
            "BankAccountNumber": jQuery("#bankaccount").val(),
            "BankName": encodedbankname,
            "CancelledCheckFile": checkfilename,
            "Currency": jQuery("#ddlcurrency option:selected").val(),
           /* "PayTerm": jQuery("#ddPayTerms option:selected").val(),*/
            "AccounHolderName":jQuery("#accountholder").val()
        }
    }
    else {
        bankurl = APIPath + "VendorLCM/UpdateBankDetail/?ActionType=Update"
        data = {
            "BankingId": parseInt($('#hdnBankingId').val()),
            "ChildId": parseInt($('#hdnChildID').val()),
            "BankCountryKey": "IN",
            "BankRoutingNumber": jQuery("#ifsccode").val(),
            "BankAccountNumber":jQuery("#bankaccount").val(),
            "BankName": encodedbankname,
            "CancelledCheckFile": checkfilename,
            "Currency": jQuery("#ddlcurrency option:selected").val(),
            /*"PayTerm": jQuery("#ddPayTerms option:selected").val(),*/
            "AccounHolderName":jQuery("#accountholder").val()
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
          
             if ($('#filecheck').val() != '') {
                fnUploadFilesonAzure('filecheck', checkfilename, 'VR/' + $('#hdnChildID').val());
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
                GetBankDetail(parseInt($('#hdnChildID').val()), customerid, VendorId)
                }, 1500)
           

        },
        error: function (xhr, status, error) {
           
             $('#buttonbankupdate').removeAttr('disabled');
             var err = xhr.responseText
             jQuery("#error").text(err);
             profileerror.show();
             profileerror.fadeOut(5000);
             App.scrollTo(profileerror, -200);
      
            jQuery.unblockUI();
        }
    });
}


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
             
               
               let isBVerify=""
            $('#mapMN').val($('#vendormobileno').val())
            if (childData.length > 0) {
                $('#tblGetBankDetail').empty();


                $('#tblGetBankDetail').append("<thead><tr><th>Action</th><th>Bank Name</th><th>Account Number</th><th>IFSC Code</th></tr></thead><tbody>");
                for (var i = 0; i < childData.length; i++) {
                    isBVerify=childData[i].isVerified;
                    if(isBVerify=="Y"){
                         $('#tblGetBankDetail').append("<tr onclick=''><td><button type='button' class='btn btn-xs btn-primary' onclick=\"editBankDetail('" + childData[i].bankingId + "','" + childData[i].childId + "','" + childData[i].bankCountryKey + "','" + childData[i].bankRoutingNumber + "','" + childData[i].bankName + "','" + childData[i].cancelledCheckFile + "','" + childData[i].payTerm + "','" + childData[i].bankAccountNumber + "','" + childData[i].accounHolderName + "')\">Edit</button><button type='button' class='btn btn-xs yellow' onclick=\"GetCustomerForBankMapping(\'" + vendorid + "','" + childData[i].childId + "','" + childData[i].bankingId + "',\'" + childData[i].accounHolderName + "'\,\'" + childData[i].bankAccountNumber + "',\'" + childData[i].bankRoutingNumber + "',\'" + isBVerify + "')\">Map Customer</button></td><td class='hovertextLeft' data-hover='Click here to see associated customer with this bank account' onclick=\"viewbankcustomer(\'" + "accordion" + childData[i].bankingId + "'\)\">" + childData[i].bankName + "</td><td>" + childData[i].bankAccountNumber + "  <img src='assets/img/greenchecktick.svg' width='25px' height='25px' style='{margin-bottom:4px;}'/></td><td>" + childData[i].bankRoutingNumber + "</td></tr>");
                   
                    }
                    else{
                        $('#tblGetBankDetail').append("<tr onclick=''><td><button type='button' class='btn btn-xs btn-primary' onclick=\"editBankDetail('" + childData[i].bankingId + "','" + childData[i].childId + "','" + childData[i].bankCountryKey + "','" + childData[i].bankRoutingNumber + "','" + childData[i].bankName + "','" + childData[i].cancelledCheckFile + "','" + childData[i].payTerm + "','" + childData[i].bankAccountNumber + "','" + childData[i].accounHolderName + "')\">Edit</button><button type='button' class='btn btn-xs yellow' onclick=\"GetCustomerForBankMapping(\'" + vendorid + "','" + childData[i].childId + "','" + childData[i].bankingId + "',\'" + childData[i].accounHolderName + "'\,\'" + childData[i].bankAccountNumber + "',\'" + childData[i].bankRoutingNumber + "',\'" + isBVerify + "')\">Map Customer</button></td><td class='hovertextLeft' data-hover='Click here to see associated customer with this bank account' onclick=\"viewbankcustomer(\'" + "accordion" + childData[i].bankingId + "'\)\">" + childData[i].bankName + "</td><td>" + childData[i].bankAccountNumber + "</td><td>" + childData[i].bankRoutingNumber + "</td></tr>");
                   
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




function editBankDetail(bankingId, childId, bankCountryKey, bankRoutingNumber, bankName, cancelledCheckFile, payTerm, bankAccountNumber,accountholdername) {

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

function Addanotherfinance() {
     
    $('#turnoverfiscal').val('')
    $('#fromFiscalyear').val('')
    $('#toFiscalyear').val('')
    $('#filefinance').val('')
    
    $('#financeform').show();

}

function UpdateFinancialDetail() {


    let financialyearfrom = parseInt($('#fromFiscalyear').val())
    let financialyearto = parseInt($('#toFiscalyear').val())

    if (financialyearto - financialyearfrom < 0) {
        $("#errordivfinance").text("From financial year cannot be less than To financial year");
        $("#errordivfinance").show();
        $("#errordivfinance").fadeOut(5000);
        App.scrollTo($("#errordivfinance"), -200);
        return false;

    }
    else if (financialyearto - financialyearfrom !== 1) {
        $("#errordivfinance").text("Turnover for particular financial year can only be updated");
        $("#errordivfinance").show();
        $("#errordivfinance").fadeOut(5000);
        App.scrollTo($("#errordivfinance"), -200);
        return false;
    }
    
    if ($('#checkattach').html() !== '') {
        financefilename = $('#financeattach').html();
    }
    else {
        financefilename = jQuery('#filefinance').val().substring(jQuery('#filefinance').val().lastIndexOf('\\') + 1)
        financefilename = financefilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }
  
    let data = {
        "ChildId": parseInt($('#hdnChildID').val()),
        "FinancialYearFrom": $('#fromFiscalyear').val(),
        "FinancialYearTo": $('#toFiscalyear').val(),
        "Turnover": parseInt($('#turnoverfiscal').val()),
        "Currency": jQuery("#currencyFiscalupdate option:selected").val(),
        "AttachmentName":financefilename,
    }

    
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: APIPath + "VendorLCM/UpdateFinancialDetail/?Id=" + VendorId + "&ActionType=Add",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            
           
           
            if (data.isSuccess == "2") {
                $("#errordivfinance").text("Turnover for the said financial year already updated..");
                $("#errordivfinance").show();
                $("#errordivfinance").fadeOut(5000);
                App.scrollTo($("#errordivfinance"), -200);
                return false;
            }
            
             if ($('#filefinance').val() != '') {
               
                fnUploadFilesonAzure('filefinance', financefilename, 'VR/' + $('#hdnChildID').val());

            }


            $("#errordivfinance").hide();
            jQuery.unblockUI();
            $("#successdivfinance").text("Your Finance specific details added successfully..");
            $("#successdivfinance").show();
            $("#successdivfinance").fadeOut(5000);
            App.scrollTo($("#successdivfinance"), -200);
            setTimeout(function () { 
                
                $("#financeform").hide();
                GetFinancialDetail(parseInt($('#hdnChildID').val())) }, 1500)
           
        },
        error: function (xhr, status, error) {
             var err = xhr.responseText
             jQuery("#error").text(err);
             profileerror.show();
             profileerror.fadeOut(5000);
             App.scrollTo(profileerror, -200);
      
            jQuery.unblockUI();
        }
    });
}


function GetFinancialDetail(ChildId) {

   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/GetFinancialDetail/?Id=" + VendorId + "&ChildId=" + ChildId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (childData) {
           
            if (childData.length > 0) {
                $('#tblGetFinancialDetail').empty()
                $('#tblGetFinancialDetail').append("<thead><tr><th class='hide'></th><th>Turn Over</th><th>Financial Year</th><th>Attachment</th></tr></thead><tbody>")
                for (var i = 0; i < childData.length; i++) {
  
                    if(childData[i].attachmentName){
                        $('#tblGetFinancialDetail').append(`<tr><td class='hide'>${childData[i].financialDetailId}</td><td>${thousands_separators(childData[i].turnover)}  ${childData[i].currency}</td><td>${childData[i].financialYearFrom}  - ${childData[i].financialYearTo} </td><td><a href="javascript:;" onclick="DownloadFile(this)" id="financeattach${i}" class="txtleftnone">${(childData[i].attachmentName)}</a></td></tr>`)
 
                    }
                    else{
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



function Addanother() {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
     setTimeout(function () { 
    $("#bankaccordion").hide()
    $("#financeaccordion").hide()
    $('#hdnFlagType').val("Add");
    $("#childDetailsForm").removeClass('hide')
    $("#AddAssociate").removeClass('hide');
    $("#buttoncompanyupdate").hide()
    $("#buttonbankupdate").hide()
    $("#buttonfinancialupdate").hide()
    $("#tblGetBankDetail").hide()
    $("#tblGetFinancialDetail").hide()
    $("#btnAddBank").hide()
    $("#btnAddFinance").hide()
    $("#editgst").hide()
    $("#editpan").hide()
    $("#bankForm").show()
    $("#financeform").show()
    cleanAddChild()

    $("#txtTINNo").attr("onchange", ""); 
    jQuery.unblockUI()    
     }, 400)
   
}


function AddAssociateVendorDetail() {



     
     /*if (jQuery("#txtTINType option:selected").val() == "IN3"){
        ValidateGST($('#txtTINNo').val())  
     }*/
   
    let data='';
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
    if ($('#msmeattach').html() !== '') {
        msmefilename = $('#msmeattach').html();
    } else {
        msmefilename = jQuery('#filemsme').val().substring(jQuery('#filemsme').val().lastIndexOf('\\') + 1)
        msmefilename = msmefilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }
    if ($('#checkattach').html() !== '') {
        checkfilename = $('#checkattach').html();
    }
    else {
        checkfilename = jQuery('#filecheck').val().substring(jQuery('#filecheck').val().lastIndexOf('\\') + 1)
        checkfilename = checkfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    }
    
    if (jQuery("#txtTINType option:selected").val() == "IN3") {
        if(gstflag==false){
            jQuery("#errordiv").text("Please select valid GST to proceed");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
            jQuery.unblockUI();
            return false;  
        }
        if (gstfilename == "" || panfilename == "") {
            jQuery("#errordiv").text("please attach GST/PAN attach to proceed...");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
            jQuery.unblockUI();
            return false;
           
        }
    }
    else if (jQuery("#txtTINType option:selected").val() == "" && jQuery("#ddlCountry option:selected").val()=='IN'){
        
        if ( panfilename == ""||jQuery("#vendorpanno").val()=="") {
            jQuery("#errordiv").text("please attach PAN details to proceed...");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
            jQuery.unblockUI();
            return false;
           
        }
        
        
        
    }

  let encodedvendoraddress=StringEncodingMechanism($('#vendoraddress').val())
  let cleanTradeName=StringEncodingMechanism(jQuery("#TradeName").val());

  if(jQuery("#txtTINType option:selected").val()=="" && $("#ddlCountry option:selected").val()=='IN' ){
       data = {
        "Address": encodedvendoraddress,
        "City": $("#ddlCity option:selected").text().trim(),
        "State": jQuery("#ddlState option:selected").data('statename'),
        "Country": $("#ddlCountry option:selected").text().trim(),
        "ZipCode": $('#pincode').val(),
        "TaxId": "",
        "TaxIdType": "",
        "TaxId2": $('#vendorpanno').val() || "",
        "TaxIdType2": "",
        "MSME": jQuery("#txtUdyam").val(),
        "MSMEType": jQuery("#ddlMSMEClass option:selected").val().trim(),
        "MSMECheck": jQuery("#ddlMSME option:selected").val(),
        "CompanyName": $('#vendorname').val(),
        "TaxIdFile": "",
        "TaxId2File": panfilename,
        "MSMEFile": msmefilename,
        "SupplierType": jQuery("#ddlVendorType option:selected").val(),
        "CityId": parseInt(jQuery("#ddlCity option:selected").val()),
        "StateId": parseInt(jQuery("#ddlState option:selected").data('stateid')),
        "CountryId": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
        "SupplierType": jQuery("#ddlVendorType option:selected").val(),
        "CountryKey": jQuery("#ddlCountry option:selected").val(),
        "RegionKey": jQuery("#ddlState option:selected").val(),
        "Langu": jQuery("#ddllanguage option:selected").val(),
        "Currency": jQuery("#ddlcurrency option:selected").val(),
        "TradeName":cleanTradeName,
        "GSTNStatus":"",
        "EInvoiceStatus":"",
        "TaxpayerType":"",

    }
      
  }
   
  else if(jQuery("#txtTINType option:selected").val()=="IN3"){
     data = {
        "Address": encodedvendoraddress,
        "City": $("#ddlCity option:selected").text().trim(),
        "State": jQuery("#ddlState option:selected").data('statename'),
        "Country": $("#ddlCountry option:selected").text().trim(),
        "ZipCode": $('#pincode').val(),
        "TaxId": $('#txtTINNo').val(),
        "TaxIdType": jQuery("#txtTINType option:selected").val(),
        "TaxId2": $('#vendorpanno').val() || "",
        "TaxIdType2": jQuery("#txtTINType2 option:selected").val(),
        "MSME": jQuery("#txtUdyam").val(),
        "MSMEType": jQuery("#ddlMSMEClass option:selected").val().trim(),
        "MSMECheck": jQuery("#ddlMSME option:selected").val(),
        "CompanyName": $('#vendorname').val(),
        "TaxIdFile": gstfilename,
        "TaxId2File": panfilename,
        "MSMEFile": msmefilename,
        "SupplierType": jQuery("#ddlVendorType option:selected").val(),
        "CityId": parseInt(jQuery("#ddlCity option:selected").val()),
        "StateId": parseInt(jQuery("#ddlState option:selected").data('stateid')),
        "CountryId": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
        "SupplierType": jQuery("#ddlVendorType option:selected").val(),
        "CountryKey": jQuery("#ddlCountry option:selected").val(),
        "RegionKey": jQuery("#ddlState option:selected").val(),
        "Langu": jQuery("#ddllanguage option:selected").val(),
        "Currency": jQuery("#ddlcurrency option:selected").val(),
        "TradeName":cleanTradeName,
        "GSTNStatus":$('#gstnStatus').val(),
        "EInvoiceStatus":$('#eInvoiceStatus').val(),
        "TaxpayerType":$('#taxpayerType').val(),

    } 
  }
  else {
       data = {
        "Address": encodedvendoraddress,
        "City": $("#ddlCity option:selected").text().trim(),
        "State": jQuery("#ddlState option:selected").data('statename'),
        "Country": $("#ddlCountry option:selected").text().trim(),
        "ZipCode": $('#pincode').val(),
        "TaxId": "",
        "TaxIdType": "",
        "TaxId2": "",
        "TaxIdType2": "",
        "MSME": jQuery("#txtUdyam").val(),
        "MSMEType": jQuery("#ddlMSMEClass option:selected").val().trim(),
        "MSMECheck": jQuery("#ddlMSME option:selected").val(),
        "CompanyName": $('#vendorname').val(),
        "TaxIdFile": "",
        "TaxId2File": "",
        "MSMEFile": msmefilename,
        "SupplierType": jQuery("#ddlVendorType option:selected").val(),
        "CityId": parseInt(jQuery("#ddlCity option:selected").val()),
        "StateId": parseInt(jQuery("#ddlState option:selected").data('stateid')),
        "CountryId": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
        "SupplierType": jQuery("#ddlVendorType option:selected").val(),
        "CountryKey": jQuery("#ddlCountry option:selected").val(),
        "RegionKey": jQuery("#ddlState option:selected").val(),
        "Langu": jQuery("#ddllanguage option:selected").val(),
        "Currency": jQuery("#ddlcurrency option:selected").val(),
        "TradeName":cleanTradeName,
        "GSTNStatus":"",
        "EInvoiceStatus":"",
        "TaxpayerType":"",

    }
      
  }
    
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorLCM/AddAssociateVendorDetail/?Id=" + VendorId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           
              if ($('#filegst').val() != '') {
                fnUploadFilesonAzure('filegst', gstfilename, 'VR/' + data.returnId);

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/' +  data.returnId);

            }

            if ($('#filemsme').val() != '') {
                fnUploadFilesonAzure('filemsme', msmefilename, 'VR/' +  data.returnId);

            }
            profileerror.hide();
            jQuery.unblockUI();
            jQuery("#success").text("Your New Company is added successfully..");
            profilesuccess.show();
            profilesuccess.fadeOut(5000);
            App.scrollTo(profilesuccess, -200);
            setTimeout(function () { 
                $("#AddAssociate").hide()
                fetchMyProfileVendor() 
                
            }, 2000)

        },
        error: function (xhr, status, error) {
         
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                var err = xhr.responseText
                jQuery("#error").text(err);
                profileerror.show();
                profileerror.fadeOut(5000);
                App.scrollTo(profileerror, -200);
      
               }
            jQuery.unblockUI();
            return false;
        }

    })
}

function cleanAddChild() {

    $("#txtTINNo").val("")
    $("#vendorpanno").val("")
    $("#vendorname").val("")
    $("#ddlNatureEstaiblishment").val("")
    $("#vendoraddress").val("")
    $("#pincode").val("")
    $("#gstattach").html("")
    $("#panattach").html("")
    $("#msmeattach").html("")
    $("#checkattach").html("")
    $("#ddlCountry").val('IN').trigger('change');



    $("#ddlVendorType").val('0');
    $("#ddlMSME").val('0');
    $("#ddlMSMEClass").val('0');
    $("#ddPayTerms").val('0').trigger('change');
    $("#txtUdyam").val('');
    $("#ifsccode").val('');
    $("#bankname").val('');
    $("#bankaccount").val('');
    $("#accountholder").val('');
     $('#txtTINType').removeAttr('disabled');
    $('#txtTINNo').removeAttr('disabled');
    $("#ddlCountry").removeAttr('disabled');
   
    $('#txtTINType').val("").trigger('change')
    editGST()
    editPAN()
    
   
}



//to validate gst

function extractPan() {
    let data = $("#txtTINNo").val();
    $('#txtTINNo').removeClass("gstvalidicon")
    var reggst = /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/


    if (data.length === 15) {
        if (!reggst.test(data)) {
             gstflag=true;
            bootbox.alert('GST Number Format is not valid. please check it');
            return false;
        }

        ValidateGST(data)

    }
    else {
          gstflag=true;
        $("#vendorpanno").val("");

        //beforeTaxDisable()
    }

}


function ValidateGST(data) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    let GSTNo = data
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/ValidateGST/?GSTNo=" + GSTNo,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        contentType: "application/json; charset=utf-8",
        async:false,
        success: function (data, status, jqXHR) {
        
            if (data.status != 'E') {
                var data = jQuery.parseJSON(data);
                gstflag=true
                let panNumber = ""
                let legalName = data.legalNameOfBusiness
                let tradeName=data.tradeName
                let companytype = data.constitutionOfBusiness
                let tradeaddress=`${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.buildingName} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.buildingNumber} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.streetName} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.location} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.districtName} `
                let gststatus = data.gstnStatus
                let eInvoiceStatus=data.eInvoiceStatus
                let taxpayerType=data.taxpayerType
                let stateName=data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.stateName
                let pincode =data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.pincode
                  
               
                $('#txtTINNo').addClass("gstvalidicon")


                panNumber = data.gstIdentificationNumber.substring(2, 12);
                $("#vendorpanno").val(panNumber);
                $("#vendorpanno").attr("disabled", "disabled");
                //afterTaxEnable()
                $("#vendorname").val(legalName);
                $("#vendorname").attr("disabled", "disabled");
                $("#ddlNatureEstaiblishment").val(companytype);
                $("#ddlNatureEstaiblishment").attr("disabled", "disabled");
                $("#TradeName").val(tradeName);
                $("#vendoraddress").val(tradeaddress);
                
                $("#gstnStatus").val(gststatus);
                $("#eInvoiceStatus").val(eInvoiceStatus);
                $("#taxpayerType").val(taxpayerType);
                $("#pincode").val(pincode);
                
                
                alertforinfo('GST Number is validated successfully.')
                jQuery.unblockUI();
                 setTimeout(function () {
                    $('#txtTINNo').removeClass("gstvalidicon");
                }, 2000);
                jQuery("#ddlState").find(`option[data-statename='${stateName}']`).prop('selected', true).trigger('change');

                
               
            }
            else {
              
                alertforerror(`GST Number could not be validated`);
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

//edit options for files

function editCheck() {
    $("#checkattach").html("");
    $("#uploadcheck").hide();
    $("#filecheck").show();
}


function editFinance() {
    $("#financeattach").html("");
    $("#uploadfinance").hide();
    $("#filefinance").show();
}

function editGST() {
    $("#gstattach").html("");
    $("#uploadgst").hide();
    $("#filegst").show();
}


function showGST() {
    $("#uploadgst").show();
    $("#filegst").hide();
    $("#editgst").show()
    
}

function editPAN() {
    $("#panattach").html("");
    $("#uploadpan").hide();
    $("#filepan").show();
}

function showPAN() {
    $("#uploadpan").show();
    $("#filepan").hide();
    $("#editpan").show()
}


function viewbankcustomer(accordionname) {

    $('.' + accordionname).toggle();
}


function GetCustomerForBankMapping(vendid, ChildId, bankingId,accholder,accnum,accifsc,isVerify) {
   
    $('#hdnBankingId').val(bankingId)
    $('#hdnChildID').val(ChildId)

   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/GetCustomerForBankMapping/?Id=" + vendid + "&ChildId=" + ChildId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            
               
            
            jQuery(".verifygroup").hide();
            
            
            jQuery("#mapbankcustomer").empty();
            jQuery("#mapbankcustomer").append(jQuery("<option></option>").val(0).html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#mapbankcustomer").append(jQuery(`<option data-isverify='${data[i].showVerification}' data-verification='${isVerify}'></option>`).val(data[i].customerId).html(data[i].customerName));
            }
            $('#mapAH').html(accholder);
            $('#mapAN').html(accnum);
            $('#mapIC').html(accifsc);
            if(isVerify=='Y'){
                
                $('#btnVerifyBank').hide()
                $('#btnmaptoc').removeAttr('disabled')
                
            }
            else{
                $('#btnVerifyBank').show()
                $('#btnmaptoc').attr('disabled','disabled')
            }
            $('#bankcustomermap').show();

        },
        error: function (xhr, status, error) {

            var err = eval(`( ${xhr.responseText} )`);
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
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        "CustomerId": parseInt($('#mapbankcustomer').val()),
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
              
                jQuery("#successdiv1").show();
                jQuery("#successdiv1").text("Company is mapped successfully..");

                setTimeout(function () {
                    jQuery("#successdiv1").hide();
                    jQuery("#successdiv1").text("");
                    hideModal()
                }, 2000)
            }
            else {

                jQuery("#errordiv1").show();
                jQuery("#errordiv1").text(data.message);

                setTimeout(function () {

                    jQuery("#errordiv1").hide();
                    jQuery("#errordiv1").text("");

                }, 2000)
            }


        },
        error: function (xhr, status, error) {

            jQuery.unblockUI();
        }
    });
}


function hideModal() {

    $('.modal').hide();
}


//fetchcountrywise tax


$('#ddlCountry').on('change', function () {

    let CountryKey = $(this).val() || "IN";

    GetCountrySpecificMaster(CountryKey)



}
)


$('#ddlState').on('change', function () {

    let stateidentity = $('option:selected', this).data('stateid');
   
    fetchCity(parseInt(stateidentity));
});









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
var formvendorcontact = $('#submit_form_contact');
var formvendorcompany = $('#submit_form_company'); 
var formvendorbank = $('#submit_form_bank');

function FormValidateContact() {

    formvendorcontact.validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {

            personname: {
                required: true,
            },
            vendormobileno: {
                required: true,
                number:true
            },
            vendoraltmobileno: {
                number:true
            },
            vendorEmailID: {
                required: true,
                email: true
            },
            vendorAltEmailID: {
                email: true
            },
            ddlpreferredTime: {
                required: true
            },


        },
        messages: {

            personname: {
                required: "Please Enter Valid name",
            },
            vendormobileno: {
                required: "Please Enter Valid Mobile No"
            },
            vendorEmailID: {
                required: "Please Enter Valid Email Id"
            },
            ddlpreferredTime: {
                required: "Please Enter Valid Preffered time"
            }

        },
        invalidHandler: function (event, validator) {
            //errorVendor.show()
            // successVendor.hide();
            $('#successdiv').show()
            $('#successdiv').hide()
            $('#successdiv').html("")
            $('#error').text("Please Enter all required field to proceed");
            $('#errordiv').fadeOut(6000);
        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        success: function (label) {
        },
        submitHandler: function (form) {
    

            updateVendorContactDetails()
        }
    });
}


function FormValidateCompany() {

    formvendorcompany.validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {

            ddlCountry: {
                required: true,
            },
            vendorname: {
                required: true
            },
            vendoraddress: {
                required: true
            },
            pincode: {
                required: true
            },
            ddlState: {
                required: true
            }, 
            ddlCity: {
                required: true
            },
            ddllanguage: {
                required: true
            },
            ddlcurrency: {
                required: true
            },


        },
        messages: {

            ddlCountry: {
                required: "Please Enter Valid Country",
            },
            vendorname: {
                required: "Please Enter Valid vendor name"
            },
            vendoraddress: {
                required: "Please Enter Valid address"
            },
            pincode: {
                required: "Please Enter Valid pincode"
            },
            ddlState: {
                required: "Please Enter Valid State"
            },
            ddlCity: {
                required: "Please Enter Valid City"
            },
            ddllanguage: {
                required: "Please Enter Valid Language"
            },
            ddlcurrency: {
                required: "Please Enter Valid Currency"
            },

        },
        invalidHandler: function (event, validator) {
            //errorVendor.show()
            // successVendor.hide();
            $('#companiessuccessdiv').show()
            $('#companiessuccessdiv').hide()
            $('#companiessuccessdiv').html("")
            $('#sendcompanieserror').text("Please Enter all required field to proceed");
            $('#companieserrordiv').fadeOut(6000);
        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        success: function (label) {
        },
        submitHandler: function (form) {
            
        
            AddAssociateVendorDetail()
        }
    });
}



function FormValidateBank() {

    formvendorbank.validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {

            accountholder: {
                required: true,
            },
            ifsccode: {
                required: true,
            },
            bankname: {
                required: true,
            },
            bankaccount: {
                required: true,
                number:true
            }
        },
        messages: {

            accountholder: {
                required: "Please Enter Valid account holder",
            },
            ifsccode: {
                required: "Please Enter Valid IFSC code",
            },
            bankname: {
                required: "Please Enter Valid Bank name",
            },
            bankaccount: {
                required: "Please Enter Valid Bank account",
            }

        },
        invalidHandler: function (event, validator) {
            //errorVendor.show()
            // successVendor.hide();
            $('#successdivbank').show()
            $('#successdivbank').hide()
            $('#successdivbank').html("")
            $('#errorbank').text("Please Enter all required field to proceed");
            $('#errordivbank').fadeOut(6000);
        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        success: function (label) {
        },
        submitHandler: function (form) {
            

            UpdateBankDetail()
        }
    });
}

//unregistered vendor

$('#txtTINType').on('change', function () {
  
    let Taxtype = $(this).val() ;
    if(Taxtype==""&&  $("#ddlCountry option:selected").val()=='IN'){
       
        
        $(".nogsthide").hide();
        $(".newgsthide").hide();
        $(".nopanhide").show();
        $("#ParticipantName").removeAttr('disabled');
        $("#ddlNatureEstaiblishment").removeAttr('disabled');
       /* $("#txtTINNo").attr("onchange","");*/
        $("#btncalgst").attr("onClick", ``);
        $("#btncalgst").hide()
        $("#txtPanNo").removeAttr('disabled');
        $("#vendorpanno").removeAttr('disabled');
        $("#vendorname").removeAttr('disabled');
    }
    
    else if(Taxtype=="" && $("#ddlCountry option:selected").val()!='IN'){
       
        
         $(".nogsthide").hide();
        $(".nopanhide").hide();
        $(".newgsthide").hide();
        $("#ParticipantName").removeAttr('disabled');
        $("#ddlNatureEstaiblishment").removeAttr('disabled');
        /*$("#txtTINNo").attr("onchange","");*/
        $("#btncalgst").attr("onClick", ``);
        $("#btncalgst").hide()
        $("#txtPanNo").removeAttr('disabled');
        $("#vendorpanno").removeAttr('disabled');
        $("#vendorname").removeAttr('disabled');
    }
    
    
  
     else if(Taxtype=="IN3"){
         
         $(".nogsthide").show();
         $(".newgsthide").show();
         $(".nopanhide").show();
         $("#ParticipantName").attr("disabled", "disabled");
         $("#ddlNatureEstaiblishment").attr("disabled", "disabled");
        /*$("#txtTINNo").attr("onchange", "extractPan(this)");*/
        $("#btncalgst").attr("onClick", `extractPan()`);
        $("#btncalgst").show()
         $("#txtPanNo").attr("disabled", "disabled");
         $("#vendorpanno").attr("disabled", "disabled");
         $("#vendorname").attr("disabled", "disabled");
    }
    
    else{
         $(".nogsthide").show();
         $(".newgsthide").hide();
         $(".nopanhide").show();
        /* $("#txtTINNo").attr("onchange", "");*/
        $("#btncalgst").attr("onClick", ``);
        $("#btncalgst").hide()
         $("#ParticipantName").removeAttr("disabled");
         $("#txtPanNo").removeAttr("disabled");
        
        
    }

   


}
)

let vendorchildId='';
function DownloadFile(aID) {
   
    vendorchildId = $('#hdnChildID').val()
    fnDownloadAttachments($("#" + aID.id).html(), 'VR/' + vendorchildId);
}

function validateUserPro(){
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
    

    
    
}

//penny testing code
function IciciBankPennyDropVerify() {
  
   if($('#mapMN').val()==''){
               $('#btnmaptoc').attr('disabled','disabled');
                alertforerror("please fill valid mobile number to proceed")
                return false
   }
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    let data = {
        "BenifAccNo":$('#mapAN').html(),
        "BenifIFSC":$('#mapIC').html(),
        "Amount":"1.00",
        "AcountName":$('#mapAH').html(),
        "Mobile":$('#mapMN').val(),
        "ChildID":parseInt($('#hdnChildID').val())
    }
    
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
         
         if(data.status==0){
             alertforerror(data.error);
             jQuery.unblockUI();
             return false;
         }
          
           let ActCode= data.data.actCode
           if(data.isVeriFy==='Y'){
               
                $('#btnmaptoc').removeAttr('disabled');
                alertforinfo("Banking details verified successfully...");
                GetBankDetail(parseInt($('#hdnChildID').val()), customerid, VendorId)
               
           }
           else{
               
             if(ActCode=='0') {
                  $('#btnmaptoc').removeAttr('disabled');
                  alertforsucess("Banking details verified successfully...");
                  GetBankDetail(parseInt($('#hdnChildID').val()), customerid, VendorId)
             }
             else{
                  $('#btnmaptoc').attr('disabled','disabled');
               
                  alertforerror(`${data.data.response}. Please check details.`)
                
             }
               
               
               
           }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

          
           let err=xhr.responseText || `banking details cannot be verified. Please Check!`;
          
           alertforerror(err);
            jQuery.unblockUI();
        }
    });
}


//dropdown changes for verification
$('#mapbankcustomer').on('change', function () {
   
   let isVerify = $('option:selected', this).data('isverify');
   let verification=$('option:selected', this).data('verification');
   if(isVerify=='Y' ){
       if(verification=='Y'){
            $('#btnmaptoc').removeAttr('disabled');
            $('.verifygroup').show();
       }
           
       else{
            $('#btnmaptoc').attr('disabled','disabled');
            $('.verifygroup').show();
       }
      
   }
   else{
       $('#btnmaptoc').removeAttr('disabled');
       $('.verifygroup').hide();
   }

    
});
