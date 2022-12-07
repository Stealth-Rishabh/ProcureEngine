var allurlsec =  sessionStorage.setItem("allurlsec", "https://www.procurengine.org/API/api/");

function fillCountryDropDown(dropdownID, countryid) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/Country/?CountryID=0",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function(data) {

            var appenddata;
            appenddata += "<option  disabled selected style='display:none;'>Select Country</option>";
            jQuery.each(data, function(key, value) {
                appenddata += "<option value = '" + value.CountryID + "'>" + value.CountryName + " </option>";

            });
            jQuery('#' + dropdownID).html(appenddata);


            if (countryid != '0') {
                jQuery('#' + dropdownID).val(countryid);
            }

        },
        error: function ajaxError(response) {
            alert(response.status + ' ' + response.statusText);
        }


    });
}
function fillStateDropDown(dropdownID, stateid) {

    var countryid = '0';

    if (dropdownID == "ddlcompstate") {
        if (jQuery('#ddlcompcountry').val() != null) {

            countryid = jQuery('#ddlcompcountry').val();
        }
    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/State/?CountryID=" + countryid + "&StateID=0",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function(data) {

            var appenddata;
            appenddata += "<option  disabled selected style='display:none;'>State</option>";

            jQuery.each(data, function(key, value) {
                appenddata += "<option value = '" + value.StateID + "'>" + value.StateName + " </option>";

            });
            jQuery('#' + dropdownID).html(appenddata);


            if (stateid != '0') {
                jQuery('#' + dropdownID).val(stateid);

            }
        },
        error: function ajaxError(response) {
            alert(response.status + ' ' + response.statusText);
        }

    });
}
function fillCityDropDown(dropdownID, cityid) {
    var stateid = '0';
    var url = '';
    if (dropdownID == "ddlcompcity") {

        if (jQuery('#ddlcompstate').val() != null) {
            stateid = jQuery('#ddlcompstate').val();
            url = (sessionStorage.getItem('allurlsec') + "CustomerRegistration/City/?StateID= " + stateid + "&CityID=0");
        }

    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function(data) {

            var appenddata;
            appenddata += "<option  disabled selected style='display:none;'>City</option>";

            jQuery.each(data, function(key, value) {
                appenddata += "<option value = '" + value.CityID + "'>" + value.CityName + " </option>";
            });
            jQuery('#' + dropdownID).html(appenddata);

            if (cityid != '0') {

                jQuery('#' + dropdownID).val(cityid);
            }
        },
        error: function ajaxError(response) {
            alert(response.status + ' ' + response.statusText);
        }

    });
}



function handleformsValidation() {


    //SignUp Form Validation

    $('#signupcomp_frm').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: true, // do not focus the last invalid input

        rules: {

            txtcompanyname: {
                required: true,
                maxlength: 200
            },
            txtcompaddress: {
                required: true,
                maxlength: 500

            },
            ddlcompcountry: {
                required: true
            },
            ddlcompstate: {
                required: true
            },
            ddlcompcity: {
                required: true
            },
            txtcompAdminName: {
                required: true
            },
            txtcompAdminemail: {
                required: true,
                email: true,
                maxlength: 120

            },
            txtcompmobile: {
                required: true,

                maxlength: 10
            },
            signuptnc: {
                required: true
            }



        },

        messages: { // custom messages for radio buttons and checkboxes


    },

    invalidHandler: function(event, validator) { //display error alert on form submit   

    },

    highlight: function(element) { // hightlight error inputs
        $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
    },

    success: function(label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
    },

    errorPlacement: function(error, element) {
        if (element.attr("name") == "signuptnc") { // insert checkbox errors after the container     

            error.insertAfter($('#signup_tnc_error'));
        } else {
            error.insertAfter(element);
        }
    },
    submitHandler: function(form) {

    SignUpCustomer();
    }

});


//Request Form Validation

$('#request_demo_frm').validate({
    errorElement: 'span', //default input error message container
    errorClass: 'help-block', // default input error message class
    focusInvalid: true, // do not focus the last invalid input

    rules: {

        txtcontctprsnname: {
            required: true,
            maxlength: 200
        },

        reqtxtcompanyname: {
            required: true,
            maxlength: 200
        },
        txtcompanyemail: {
            required: true,
            email: true,
            maxlength: 120

        }, txtcompanymob: {
            required: true,
            maxlength: 10
        },

        txtremarks: {
            required: true,
            maxlength: 500
        },
        requesttnc: {
            required: true
        }



    },

    messages: { // custom messages for radio buttons and checkboxes


},

invalidHandler: function(event, validator) { //display error alert on form submit   

},

highlight: function(element) { // hightlight error inputs
    $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
},

success: function(label) {
    label.closest('.form-group').removeClass('has-error');
    label.remove();
},

errorPlacement: function(error, element) {
    if (element.attr("name") == "requesttnc") { // insert checkbox errors after the container

        error.insertAfter($('#requesttnc_error'));
    } else {
        error.insertAfter(element);
    }
},
submitHandler: function(form) {
    $('#progress_reqstform').show();
    InsRequestDemo();
}

});

//Footr Form

$('#footr_frm').validate({
    errorElement: 'span', //default input error message container
    errorClass: 'help-block', // default input error message class
    focusInvalid: true, // do not focus the last invalid input

    rules: {

        footrcontactname: {
            required: true,
            maxlength: 200
        },

        footrcontactemail: {
            required: true,
            email: true
        },
        footrcontactmessge: {
            required: true,

            maxlength: 500

        }



    },

    messages: { // custom messages for radio buttons and checkboxes


},

invalidHandler: function(event, validator) { //display error alert on form submit   

},

highlight: function(element) { // hightlight error inputs
    $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
},

success: function(label) {
    label.closest('.form-group').removeClass('has-error');
    label.remove();
},

errorPlacement: function(error, element) {
    if (element.attr("name") == "requesttnc") { // insert checkbox errors after the container

        error.insertAfter($('#requesttnc_error'));
    } else {
        error.insertAfter(element);
    }
},
submitHandler: function(form) {
    ContactUS();
}

});

        
}
	
$('#request_demo').on('hidden.bs.modal', function() {
    $('.form-group').removeClass('has-error');
    $('.help-block').remove();
    resetrequestForm();
});
	
$('#sign_up_modal').on('hidden.bs.modal', function() {
    $('.form-group').removeClass('has-error');
    $('.help-block').remove();
    //resetregistrationForm();
});

function InsRequestDemo() {
    var _cleanString = StringEncodingMechanism($('#txtcontctprsnname').val());
    var _cleanString2 = StringEncodingMechanism($('#reqtxtcompanyname').val());
    var _cleanString3 = StringEncodingMechanism($('#txtremarks').val());

	var tnc= '';
    if($('#requesttnc').is(':checked')){
        tnc= 'Y';
    }else{
        tnc= 'N';
    }
	
	var reqDemo={
        //'ContactPersonName': $('#txtcontctprsnname').val(),
        'ContactPersonName': _cleanString,
        'Mobileno': $('#txtcompanymob').val(),
        'Email': $('#txtcompanyemail').val(),
        //'CompanyName': $('#reqtxtcompanyname').val(),
        'CompanyName': _cleanString2,
        //'RFDRemarks': $('#txtremarks').val()
        'RFDRemarks': _cleanString3
        //,'IsTermsAccepted': tnc
    }
    //alert(JSON.stringify(reqDemo))
    jQuery.ajax({
        url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/InsRequestForDemo",
        data: JSON.stringify(reqDemo),
        type: "POST",
        contentType: "application/json",
        success: function(data) {

            if (data[0].Issuccess == 1) {
                $('#progress_reqstform').hide();
                // bootbox.alert('Transaction Successful.')
                $('.alert-success').find('span').html('Transaction Successful.')
                $('.alert-success').show();
                //Metronic.scroolTo($('.alert-success'), -200);
                $('.alert-success').fadeOut(5000);
            }
            else if (data[0].Issuccess == 2) {
                $('#progress_reqstform').hide();
              
                $('.alert-danger').find('span').html('User already registered. Please provide another email and mobile no.')
                $('.alert-danger').show();
                //Metronic.scroolTo($('.alert-success'), -200);
                $('.alert-danger').fadeOut(5000);
            }
            else if (data[0].Issuccess == 0) {
                $('#progress_reqstform').hide();
                // $('#regscherrordiv').show();
                // $('#regscherror').html('You have some form errors. Please check below.');
                // $('#regscherrordiv').fadeOut(7000)

            }
        }

    });
    
    resetrequestForm();

	
}

function resetrequestForm(){
	$('#txtcontctprsnname').val('');
	$('#txtcompanymob').val('');
    $('#txtcompanyemail').val('');
    $('#reqtxtcompanyname').val('');
    $('#txtremarks').val('');	
}

function SignUpCustomer() {

    var _cleanString4 = StringEncodingMechanism($('#txtcompanyname').val());
    var _cleanString5 = StringEncodingMechanism($('#txtcompaddress').val());
    var _cleanString6 = StringEncodingMechanism($('#txtcompAdminName').val());
	var tnc= '';
    if($('#regschtnc').is(':checked')){
        tnc= 'Y';
    }else{
        tnc= 'N';
    }
	
	var signUp={
	//'CustomerName': $('#txtcompanyname').val(),
        'CustomerName': _cleanString4,
    //'CustomerAddress': $('#txtcompaddress').val(),
        'CustomerAddress': _cleanString5,
	'CountryID': $('#ddlcompcountry').val(),
	'StateID': $('#ddlcompstate').val(),
	'CityID': $('#ddlcompcity').val(),
	//'ContactPersonName': $('#txtcompAdminName').val(),
        'ContactPersonName': _cleanString6,
	'PhoneNo': $('#txtcompmobile').val(),
	'CustomerEmail': $('#txtcompAdminemail').val()
    }
    //alert(JSON.stringify(signUp))
    jQuery.ajax({
    url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/SignUpCustomer",
        data: JSON.stringify(signUp),
        type: "POST",
        contentType: "application/json",
        success: function (data) {

        if (data[0].Issuccess == '1') {
                $('#progress_regform').hide();
                $('.alert-success').find('span').html('Transaction Successful.')
                $('.alert-success').show();
                //Metronic.scroolTo($('.alert-success'), -200);
                $('.alert-success').fadeOut(5000);
            }
            else if (data[0].Issuccess == '2') {
                $('#progress_regform').hide();
                $('.alert-danger').find('span').html('User already registered. Please provide another email and mobile no.')
                $('.alert-danger').show();
                //Metronic.scroolTo($('.alert-success'), -200);
                $('.alert-danger').fadeOut(5000);
            }
            else if (data[0].Issuccess == '0') {
                $('#progress_regform').hide();
                // $('#regscherrordiv').show();
                // $('#regscherror').html('You have some form errors. Please check below.');
                // $('#regscherrordiv').fadeOut(7000)

            }
        }
       
    });
    
    resetsignupForm();


	
}

function resetsignupForm(){
	 $('#txtcompanyname').val('')
	$('#txtcompaddress').val('')
	$('#ddlcompcountry').val('')
	 $('#ddlcompstate').val('')
	 $('#ddlcompcity').val('')
	 $('#txtcompAdminName').val('')
	 $('#txtcompAdminemail').val('')
	 $('#txtcompmobile').val('')

}

function ContactUS() {
 

    var reqDemo = {
        'Name': $('#footrcontactname').val(),
        'Email': $('#footrcontactemail').val(),
        'Message': $('#footrcontactmessge').val()
        
    }
    //alert(JSON.stringify(reqDemo))
    jQuery.ajax({
        url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/ContactUs",
        data: JSON.stringify(reqDemo),
        type: "POST",
        contentType: "application/json",
        success: function(data) {

            if (data[0].Issuccess == '1') {
               bootbox.alert('Message sent successfully. Someone from our team will contact you soon.')
            }

            else if (data[0].Issuccess == '0') {
               
            }
        }

    });

    resetfooterForm();


}

function resetfooterForm(){
        $('#footrcontactname').val('')
        $('#footrcontactemail').val('')
        $('#footrcontactmessge').val('')
}