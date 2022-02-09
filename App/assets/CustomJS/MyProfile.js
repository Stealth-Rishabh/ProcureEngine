var APIPath = sessionStorage.getItem("APIPath");

function fetchCategorymaster1() {
    debugger;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&For=M&MappedBy=a&VendorID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(data);
            jQuery("#ddlTypeofProduct").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);

                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlTypeofProduct").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }
                //debugger;
                jQuery("#ddlTypeofProduct").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlTypeofProduct").append('<tr><td>No categories found..</td></tr>');
            }
            // jQuery.unblockUI();
        },

        error: function (xhr, status, error) {
            //console.log(url);
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


function fetchCountry() {
    //var stateid = jQuery('#ddlCountry').val();
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
            //alert(data);
            jQuery("#ddlCountry").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);

                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCountry").append("<option value=" + data[i].countryID + ">" + data[i].countryName + "</option>");
                }
                jQuery("#ddlCountry").val('111').trigger("change");
                //debugger;

                //if (countryid != '0') {
                //    //jQuery("#ddlCountry").val(countryid);
                //    jQuery("#ddlCountry").trigger("change");
                //}
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlCountry").append('<tr><td>No countries found..</td></tr>');
            }
            // jQuery.unblockUI();
        },
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

//var countryid = 0;
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
                // alert(data.length);
                jQuery("#ddlState").append("<option value=0>Select State</option>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlState").append("<option value=" + data[i].stateID + ">" + data[i].stateName + "</option>");
                }
                //debugger;
                jQuery("#ddlState").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlState").append('<tr><td>No state found..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {
            alert('hi')
            var err = xhr.responseText;
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
            //alert(data);
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
                alert("error");
            }
            return false;
            jQuery.unblockUI();
        }

    });
}


function fetchTDS() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchTDS",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(data);
            jQuery("#ddlTds").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);

                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlTds").append("<option value=" + data[i].tdsID + ">" + data[i].tds + "</option>");
                }
                //debugger;
                jQuery("#ddlTds").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlTds").append('<tr><td>No tds found..</td></tr>');
            }
            // jQuery.unblockUI();
        },
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

function fetchPaymentTerms() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchPaymentTerms?CustomerID=1",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(data);
            jQuery("#ddPayTerms").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);

                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddPayTerms").append("<option value=" + data[i].termID + ">" + data[i].paymentTerm + "</option>");
                }
                //debugger;
                jQuery("#ddPayTerms").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddPayTerms").append('<tr><td>No payment terms found..</td></tr>');
            }
            // jQuery.unblockUI();
        },
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

function fetchUserDetails() {
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                //console.log("data", data);
                let userdetails = data[0].jsondata;
                userdetails = JSON.parse(userdetails);
                //for (var i = 0; i < data.length; i++) {
                $('#username').html(userdetails[0].userName)
                $('#usermobileno').val(userdetails[0].mobileNo)
                $('#userEmailID').html(userdetails[0].emailID)
                $('#userRole').html(userdetails[0].roleName)
                $('#userdesignation').val(userdetails[0].designation)
                    
               // }

                
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
function fetchVendorDetails1() {
    debugger;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            
                //console.log('data1',data);
                let detail = data[0].jsondata;
                detail = JSON.parse(detail);
            //console.log("detail", detail);

                // for (var i = 0; i < data.length; i++) {
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
                //}


           
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
function fetchVendorDetails() {
    debugger;
    //alert(APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + sessionStorage.getItem('VendorId') + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"));
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + sessionStorage.getItem('VendorId') + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            //console.log("data", data);

            var vendordetails = JSON.parse(data[0].jsondata);

            
            sessionStorage.setItem('tmpVendorID', vendordetails[0].tmpVendorID);
            //console.log("vendordetails", vendordetails); 
            //console.log(vendordetails[0].ContactPerson);


            var msmecheck = vendordetails[0].MSMECheck;
            //console.log(msmecheck)
            if (msmecheck == 'Y') {
                $('.hideInput').removeClass('hide');
                $('#ddlMSME').val(vendordetails[0].MSMECheck)
                $('#ddlMSME,#ddlMSMEClass,#txtUdyam').attr("disabled", 'disabled');
                $('#ddlMSMEClass').val(vendordetails[0].MSMEType)
                $('#txtUdyam').val(vendordetails[0].MSMENo)
                
                
            } else {
                $('.hideInput').addClass('hide');
                $('#ddlMSME').val(0)
            }

            var nature = vendordetails[0].EstTypeID;
            //console.log("nature",nature);

            
           
            if (nature != "" && nature != undefined) {
                $('#ddlNatureEstaiblishment').attr("disabled", 'disabled');
                $('#ddlNatureEstaiblishment').val(nature);

            } else {
                
                $('#ddlNatureEstaiblishment').val(0);
                
            }

            var vendortype = vendordetails[0].VendorCatID;
            if (vendortype != "" && vendortype != undefined) {
                $('#ddlVendorType').val(vendortype);
                $('#ddlVendorType').attr("disabled", 'disabled');
            } else {
               
                $('#ddlVendorType').val(0);
            }

            var gstclass = vendordetails[0].GSTClass;
            if (gstclass != "" && gstclass != undefined ) {
                $('#ddlGSTclass').val(vendordetails[0].GSTClass);
                $('#ddlGSTclass').attr("disabled", 'disabled');
            } else {
               
                $('#ddlGSTclass').val(0);
            }

            var bank = vendordetails[0].BankName;
            if (bank != "" && bank != undefined) {
                $('#bankname').val(vendordetails[0].BankName);
                $('#bankname').attr("disabled", 'disabled');
            } else {

                $('#bankname').val(vendordetails[0].BankName);
            }

            var accountno = vendordetails[0].BankAccount;
            if (accountno != "" && accountno != undefined) {
                $('#bankaccount').val(vendordetails[0].BankAccount);
                $('#bankaccount').attr("disabled", 'disabled');
            } else {

                $('#bankaccount').val(vendordetails[0].GSTClass);
            }

            var ifsccode = vendordetails[0].IFSCCode;
            if (ifsccode != "" && ifsccode != undefined) {
                $('#ifsccode').val(vendordetails[0].IFSCCode);
                $('#ifsccode').attr("disabled", 'disabled');
            } else {

                $('#ifsccode').val(vendordetails[0].GSTClass);
            }

            var accountholder = vendordetails[0].AccountName;
            if (accountholder != "" && accountholder != undefined) {
                $('#accountholder').val(vendordetails[0].AccountName);
                $('#accountholder').attr("disabled", 'disabled');
            } else {

                $('#accountholder').val(vendordetails[0].GSTClass);
            }

            var tanno = vendordetails[0].TAN;
            if (tanno != "" && tanno != undefined) {
                $('#tan').val(vendordetails[0].TAN);
                $('#tan').attr("disabled", 'disabled');
            } else {

                $('#tan').val(vendordetails[0].TAN);
            }

            if (vendordetails[0].GSTFile != "" && vendordetails[0].GSTFile != null && vendordetails[0].GSTFile != undefined) {
                $('#gstattach').show();
                $('#filegst').attr("disabled", 'disabled');
                $('#gstattach').html(vendordetails[0].GSTFile);
            } else {
                $('#filegst').removeAttr("disabled");
                $('#gstattach').hide();
            }

            if (vendordetails[0].PANFile != "" && vendordetails[0].PANFile != null && vendordetails[0].PANFile != undefined) {
                $('#panattach').show();
                $('#filepan').attr("disabled", 'disabled');
                $('#panattach').html(vendordetails[0].PANFile);
            } else {
                $('#filepan').removeAttr("disabled");
                $('#panattach').hide();
            }

            if (vendordetails[0].MSMEFile != "" && vendordetails[0].MSMEFile != null && vendordetails[0].MSMEFile != undefined) {
                $('#msmeattach').show();
                $('#filemsme').attr("disabled", 'disabled');
                $('#msmeattach').html(vendordetails[0].MSMEFile);
            } else {
                $('#filemsme').removeAttr("disabled");
                $('#msmeattach').hide();
            }

            if (vendordetails[0].cancelledCheck != "" && vendordetails[0].cancelledCheck != null && vendordetails[0].cancelledCheck != undefined) {
                $('#checkattach').show();
                $('#filecheck').attr("disabled", 'disabled');
                $('#checkattach').html(vendordetails[0].cancelledCheck);
            } else {
                $('#filecheck').removeAttr("disabled");
                $('#checkattach').hide();
            }

           

            $('#personname').val(vendordetails[0].ContactPerson)   
            $('#personnamealt').val(vendordetails[0].ContactNameAlt) 
            $('#vendorname').html(vendordetails[0].VendorName)
            $('#vendormobileno').val(vendordetails[0].MobileNo)
            $('#vendorEmailID').html(vendordetails[0].EmailID)
            $('#vendorAltEmailID').val(vendordetails[0].AlternateEmailID)
            $('#vendoraltmobileno').val(vendordetails[0].Phone)
            $('#vendoraddress').val(vendordetails[0].Address1 + vendordetails[0].Address2 )
            $('#vendorCity').val(data[0].city)
            $('#vendorphone').val(data[0].phone)
            $('#vendorpanno').html(vendordetails[0].PANNo)
            $('#vendorservicetaxno').html(vendordetails[0].ServiceTaxNo)
            $('#vendoralternateemail').val(data[0].alternateEmailID)
            $('#pincode').val(vendordetails[0].pincode)            
            $('#product').val(vendordetails[0].product)  
            $('#ddlCountry').val(vendordetails[0].CountryID)  
            $('#ddlState').val(vendordetails[0].StateID)
            $('#ddlCity').val(vendordetails[0].CityID)
            $('#txtLastFiscal').val(vendordetails[0].PreviousTurnover)
            $('#txt2LastFiscal').val(vendordetails[0].SecondLastTurnover)
            $('#txtLastFiscalyear').val(vendordetails[0].PreviousTurnoverYear)
            $('#txt2LastFiscalyear').val(vendordetails[0].SecondLastTurnoverYear)

            CalContactDetailPercent();
            calCompanyDetailPercent();
            calAccountDetailPercent();
            calBusinessDetailPercent();
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

function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'VR/' + sessionStorage.getItem('tmpVendorID'));
}
var profileerror = $('#errordiv');
var profilesuccess = $('#successdiv');
profilesuccess.hide();
profileerror.hide();

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
    
}

//vendor profile.html vendor form
function formvalidatevendor1() {
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

//vendor myprofile_vendor.html form
function formvalidatevendor(){
    $('#frmprofilevendornew').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

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
            updateVendor();
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
        "ContactPerson":""
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
function updVnedorMobileNo(){
	
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
    debugger;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var msmetype = jQuery("#ddlMSMEClass option:selected").val().trim();
    var gstclass = jQuery("#ddlGSTclass option:selected").val().trim();    
    var paymentterm = parseInt(jQuery("#ddPayTerms option:selected").val().trim());
    var natureofest = jQuery("#ddlNatureEstaiblishment option:selected").text();
    var vendorcatname = jQuery("#ddlVendorType option:selected").text().trim();
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

    var gstfilename = jQuery('#filegst').val().substring(jQuery('#filegst').val().lastIndexOf('\\') + 1)
    gstfilename = gstfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

    var panfilename = jQuery('#filepan').val().substring(jQuery('#filepan').val().lastIndexOf('\\') + 1)
    panfilename = panfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

    var msmefilename = jQuery('#filemsme').val().substring(jQuery('#filemsme').val().lastIndexOf('\\') + 1)
    msmefilename = msmefilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

    var checkfilename = jQuery('#filecheck').val().substring(jQuery('#filecheck').val().lastIndexOf('\\') + 1)
    checkfilename = checkfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

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
            "stateName": jQuery("#ddlState option:selected").text().trim(),
            "cityID": parseInt(jQuery("#ddlCity").val()),
            "cityName": jQuery("#ddlCity option:selected").text().trim(),
            "pinCode": jQuery("#pincode").val().trim(),
            "vendorName": jQuery("#vendorname").text().trim(),
            "vendorAdd": jQuery("#vendoraddress").val().trim(),
            "tAN": jQuery("#tan").val().trim(),
            "tDSTypeId": tdstype,
            "tDSTypeName": tdsname,
            "gSTClass": gstclassvalue,
            "gSTNo": jQuery("#vendorservicetaxno").text().trim(),
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
            "currencyLast2FY": jQuery("#currency2LastFiscal option:selected").text().trim(),
            "currencyLastFY": jQuery("#currencyLastFiscal option:selected").text().trim(),         
            "contactName": jQuery("#personname").val().trim(),            
            "mobile": jQuery("#vendormobileno").val().trim(),
            "gSTFile": gstfilename,
            "pANFile": panfilename,
            "mSMEFile": msmefilename,
            "cancelledCheck": checkfilename,
           
        }
        debugger;
        //console.log(JSON.stringify(data))
        //alert(JSON.stringify(data));

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
    
                /*if (data == "1") {
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
                }*/
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

function fetchMsme() {
    var msmecheck = jQuery("#ddlMSME option:selected").val();
    if (msmecheck == 'Y') {
        $('.hideInput').removeClass('hide');
    } else {
        $('.hideInput').addClass('hide');
    }
}

var customersForAutoComplete;

function fetchCompanyVR() {
    debugger;
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchCompanyVR" ,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            
            customersForAutoComplete = JSON.parse(data[0].jsondata);
            //console.log(customersForAutoComplete);

            jQuery.unblockUI();
        },
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

jQuery("#txtVendorGroup").typeahead({
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
            jQuery("#tblvendorlist > tbody").empty();

            var str = "<tr><td class='hide'>" + map[item].customerid + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + map[item].customername + "'\,\'" + map[item].customerid + "'\)\"; id=\"chkvender" + map[item].customerid + "\" value=" + map[item].customerid + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + map[item].customername  + " </td></tr>";
            jQuery('#tblvendorlist > tbody').append(str);  

            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {
                    //console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()))
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")

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
    
    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        //alert('checkif');
        $(event).closest("span#spanchecked").removeClass("checked")

    }

    else {
        //alert('checkelse');
        vCount = vCount + 1;

        var EvID = event.id;
        var custids = [];
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked");
        var str = '<tr id=SelecetedVendor' + custID + '><td class=hide>' + custID + '</td><td>' + custName + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + custID + ',' + EvID + ',SelecetedVendorPrev' + custID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>'
        jQuery('#selectedvendorlists').append(str);

        if ($("#selectedvendorlists > tbody > tr").length > 0) {
            $("#selectedvendorlists> tbody > tr").each(function (index) {
                //console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()));
                custids.push($.trim($(this).find('td:eq(0)').html()));

            });

            var strr = custids.toString().replace(',', '#');
            //console.log(strr)
            $("#selectedcompanies").val(strr);
        }

        //console.log("custids", custids);
        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + custID + '><td class=hide>' + custID + '</td><td>' + custName + '</td></tr>')
        $('#divvendorlist').find('span#spandynamic').hide();

        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
       
    }
 
    if (vCount > 0) {
        //alert('count');
        jQuery('#selectedvendorlists').show()
        jQuery('#selectedvendorlistsPrev').show()
    }
    else {
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()
    }

}

function removevendor(trid, chkid, trprevid) {

    vCount = vCount - 1;

    $('#' + trid.id).remove()
    $('#' + trprevid.id).remove()
    $(chkid).closest("span#spanchecked").removeClass("checked")
    $(chkid).prop("disabled", false);
    if (vCount > 0) {
        jQuery('#selectedvendorlists').show()
        jQuery('#selectedvendorlistsPrev').show()
    }
    else {

        $('#chkAll').closest("span").removeClass("checked")
        $('#chkAll').prop("checked", false);
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()

    }
}

var vCount = 0;
$("#chkAll").click(function () {
    //alert('check');
    if ($("#chkAll").is(':checked') == true) {
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        jQuery('#selectedvendorlists> tbody').empty()
        jQuery('#selectedvendorlistsPrev> tbody').empty()
        vCount = 0;
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
            $('#chkvender' + vCount).prop("disabled", true);
            var vendorid = $('#chkvender' + vCount).val()
            //console.log("vendorid", vendorid);
            var v = vCount;
            vCount = vCount + 1;
            var vname = $.trim($(this).find('td:eq(2)').html())
            var cid = $.trim($(this).find('td:eq(0)').html())
            //console.log("vname", vname);
            //console.log("cid", cid);
            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorid + ',' + 'chkvender' + v + ',SelecetedVendorPrev' + vendorid + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td></tr>')

        });
    }
    else {
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").removeClass("checked");
            vCount = 0;
            $('input[name="chkvender"]').prop('disabled', false);
            jQuery('#selectedvendorlists> tbody').empty()
            jQuery('#selectedvendorlistsPrev> tbody').empty()
        });

    }
    if (vCount > 0) {
        jQuery('#selectedvendorlists').show()
        jQuery('#selectedvendorlistsPrev').show()
    }
    else {
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()
    }

});


//vendor myprofile_vendor.html form
function formSendCompanies() {
    $('#frmprofilevendornewcompany').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

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
    debugger;
    var customerids = $("#selectedcompanies").val();
    var datainfo = {
        "customersID": customerids,
        "VendorID": parseInt(sessionStorage.getItem('VendorId')),
        
    }
    alert(JSON.stringify(datainfo));
    //console.log(JSON.stringify(datainfo));
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "VendorRequest/VendorExtend",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(datainfo),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
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


/*jQuery("#txtSearch").keyup(function () {
    sessionStorage.setItem('hdnVendorID', '0');

});
sessionStorage.setItem('hdnVendorID', 0); 

jQuery("#txtSearch").typeahead({
    source: function (query, process) {
        var data = customersForAutoComplete;
        var vName = '';
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            vName = username.customerid + ' (' + username.customername + ')'
            map[vName] = username;
            usernames.push(vName);
        });
        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].customerid != "0") {

            sessionStorage.setItem('hdnVendorID', map[item].customerid);
            jQuery("#tblvendorlist > tbody").empty();


            vName = map[item].customername ;

            var str = "<tr><td class='hide'>" + map[item].customerid + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + map[item].customerid + "'\)\"; id=\"chkvender" + map[item].customerid + "\" value=" + map[item].customerid + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + vName + " </td></tr>";
            jQuery('#tblvendorlist > tbody').append(str);



            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {
                    console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()))
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")

                });
            }

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});*/
//var inputLenght = $('#collapse2 :input');
//console.log(inputLenght.length);

function CalContactDetailPercent() {
    debugger;
   
    var div = document.getElementById("tab1check");
    var inputs = div.getElementsByTagName('input');  
    
    var totalInputs = inputs.length;
    console.log("totalInputs", totalInputs);

    var inputsWithValue = 0;
   
    for (var i = 0; i < totalInputs; i++) {
        console.log("inputs[i].value", inputs[i].value);
        console.log("inputs[i].value", inputs[i].value !== '');

        if (inputs[i].value !== '' && inputs[i].value !== null && inputs[i].value !== undefined) {
            inputsWithValue = inputsWithValue + 1;
            console.log("inputs[i].value", inputs[i].value);

        }
           
    }
   
    // Calculate the percentage.
    var filledPercentage = (inputsWithValue / totalInputs) * 100;
    console.log("filledPercentage", filledPercentage)


}

function calCompanyDetailPercent() {
    var div = document.getElementById("collapse0");
    var selects = div.getElementsByTagName('select');
    var inputs = div.getElementsByTagName('input');
    var totalInputs = inputs.length;
    var totalSelect = selects.length;
    //alert(totalInputs);
    //alert(totalSelect);
    var totalCols = totalInputs + totalSelect;

    var inputsWithValuee = 0;
    for (var i = 0; i < totalInputs; i++)
        if (inputs[i].value !== '')
            inputsWithValuee += 1;

    var filledPercentagee = (inputsWithValuee / totalInputs) * 100;
    console.log("inputsWithValuee", inputsWithValuee);
    console.log("totalCols", totalCols);
    console.log("filledpercentagee", filledPercentagee);

}

function calAccountDetailPercent() {
    var tab3 = document.getElementById("collapse1");
    var selects = tab3.getElementsByTagName('select');

    var totalInputss = selects.length;

    var inputsWithValuee = 0;
    for (var i = 0; i < totalInputss; i++)
        if (selects[i].value !== '')
            inputsWithValuee += 1;

    var filledPercentagee = (inputsWithValuee / totalInputss) * 100;
    console.log("inputsWithValuee", inputsWithValuee);
    console.log("totalInputss", totalInputss);
    console.log("filledpercentagee", filledPercentagee);

}

function calBusinessDetailPercent() {
    var tab4 = document.getElementById("collapse3");
    var selects = tab4.getElementsByTagName('select');

    var totalInputss = selects.length;

    var inputsWithValuee = 0;
    for (var i = 0; i < totalInputss; i++)
        if (selects[i].value !== '')
            inputsWithValuee += 1;

    var filledPercentagee = (inputsWithValuee / totalInputss) * 100;
    console.log("inputsWithValuee", inputsWithValuee);
    console.log("totalInputss", totalInputss);
    console.log("filledpercentagee", filledPercentagee);

}




