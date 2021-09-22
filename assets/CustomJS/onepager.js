var pathApi = window.location.href;
var pathApi2 = pathApi.substring(0, pathApi.lastIndexOf("/"));
//var pathApi2 = "http://www.agileapt.com/ProcurEngine/"

sessionStorage.setItem("allurlsec", pathApi2 + "/API/api/");

function goTo(DivID) {
//    var testDiv = document.getElementById("features");
//    //document.getElementById("demo").innerHTML = testDiv.offsetTop;
    //    setTimeout(function() { sessionStorage.setItem('offsetpos',testDiv.offsetTop) }, 1000);
   // if (DivID == 'clients') {
        $('html,body').animate({ scrollTop: $('#' + DivID).offset().top - 100 }, 'slow');
    //} else {
      //  $('body').animate({ scrollTop: $('#' + DivID).offset().top - 100 }, 'slow');
    //}
    
}

function fillCountryDropDown(dropdownID, countryid) {
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url:  sessionStorage.getItem("allurlsec") + "CustomerRegistration/Country/?CountryID=0",
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
                minlength: 9,
                maxlength: 13
            },
            signuptnc: {
                required: true
            }



        },

        messages: { // custom messages for radio buttons and checkboxes

            txtcompmobile: {
                required: "Please enter a valid number.",
                minlength:"Please enter a valid number.",
                maxlength:"Please enter a valid number."
            }
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
            minlength: 9,            
            maxlength: 13
        },

        txtremarks: {
            required: true,
            maxlength: 500
        }



    },

    messages: { // custom messages for radio buttons and checkboxes
    txtcompanymob: {
        required: "Please enter a valid number.",
        minlength: "Please enter a valid number.",
        maxlength: "Please enter a valid number."
    }

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

$('#subscribe-form').validate({
    errorElement: 'span', //default input error message container
    errorClass: 'help-block', // default input error message class
    focusInvalid: true, // do not focus the last invalid input

    rules: {
    txtsubscribeEmail: {
            required: true,
            email: true
            ,maxlength: 120
        }
    },

    messages: { // custom messages for radio buttons and checkboxes


},

invalidHandler: function(event, validator) { //display error alert on form submit   

},

highlight: function(element) { // hightlight error inputs
    $(element)
                .closest('.input-group').addClass('has-error'); // set error class to the control group
},

success: function(label) {
label.closest('.input-group').removeClass('has-error');
    label.remove();
},

errorPlacement: function(error, element) {

error.insertAfter($(".input-group"));
        },
   
submitHandler: function(form) {
SubscribeEmail();
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

function InsRequestDemo(){
	var tnc= '';
    if($('#requesttnc').is(':checked')){
        tnc= 'Y';
    }else{
        tnc= 'N';
    }
	
	var reqDemo={
	'UserName': $('#txtcontctprsnname').val(),
	'MobileNo': $('#txtcompanymob').val(),
	'UserEmail': $('#txtcompanyemail').val(),
	'CompanyName': $('#reqtxtcompanyname').val(),
	'Message': $('#txtremarks').val(),
    'Flag': 'R'
    }
    //alert(JSON.stringify(reqDemo))
    jQuery.ajax({
    url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/InsCustomerQueries",
        data: JSON.stringify(reqDemo),
        type: "POST",
        contentType: "application/json",
        success: function(data) {
        $("#request_demo").modal("hide")
        
        if (data[0].IsSuccess == '1') {

            bootbox.alert('Thanks for showing your interest in our product. One of our team member will contact you within 24 hours for assistance to schedule a demo date and time.')
            }
            else if (data[0].IsSuccess == '2') {

            bootbox.alert('Thanks for showing your interest in our product. One of our team member will contact you within 24 hours for assistance to schedule a demo date and time.')
            }
            else if (data[0].IsSuccess == '0') {

            bootbox.alert('Thanks for showing your interest in our product. One of our team member will contact you within 24 hours for assistance to schedule a demo date and time.')
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
	var tnc= '';
    if($('#regschtnc').is(':checked')){
        tnc= 'Y';
    }else{
        tnc= 'N';
    }
	
	var signUp={
	'CompanyName': $('#txtcompanyname').val(),
	'Address': $('#txtcompaddress').val(),
	'CountryID': $('#ddlcompcountry').val(),
	'StateID': $('#ddlcompstate').val(),
	'CityID': $('#ddlcompcity').val(),
	'UserName': $('#txtcompAdminName').val(),
	'MobileNo': $('#txtcompmobile').val(),
	'UserEmail': $('#txtcompAdminemail').val(),
	'Message': '',
	'Flag': 'S'
    }
    //alert(JSON.stringify(signUp))
    jQuery.ajax({
        url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/InsCustomerQueries",
        data: JSON.stringify(signUp),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
      
        if (data[0].IsSuccess == '1') {
            $('#sign_up_modal').modal("hide");
                bootbox.alert('We are glad, you started using our product. Someone from our technical team will call you to assist with implementation of this product and how to use this product.')
                
            }
            else if (data[0].IsSuccess == '2') {
            $('#sign_up_modal').modal("hide");
            bootbox.alert('We are glad, you started using our product. Someone from our technical team will call you to assist with implementation of this product and how to use this product.')        
            }
            else if (data[0].IsSuccess == '0') {
            $('#sign_up_modal').modal("hide");
            bootbox.alert('We are glad, you started using our product. Someone from our technical team will call you to assist with implementation of this product and how to use this product.')

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
    'UserName': $('#footrcontactname').val(),
    'UserEmail': $('#footrcontactemail').val(),
    'Message': $('#footrcontactmessge').val(),
    'Flag': 'C'
        
    }
    //alert(JSON.stringify(reqDemo))
    jQuery.ajax({
    url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/InsCustomerQueries",
        data: JSON.stringify(reqDemo),
        type: "POST",
        contentType: "application/json",
        success: function(data) {

        if (data[0].IsSuccess == '1') {
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


    function SubscribeEmail() {
        
        var reqDemo = {
            'UserName': '',
            'UserEmail': $('#txtsubscribeEmail').val(),
            'Message': '',
            'Flag': 'N'

        }
        //alert(JSON.stringify(reqDemo))
        jQuery.ajax({
            //url: sessionStorage.getItem('allurlsec') + "CustomerRegistration/InsCustomerQueries",
            data: JSON.stringify(reqDemo),
            type: "POST",
            contentType: "application/json",
            success: function(data) {

                if (data[0].IsSuccess == '1') {
                    bootbox.alert('Thanks for subscribing.')
                }

                else if (data[0].Issuccess == '0') {

                }
            }

        });

        $("#txtsubscribeEmail").val('');


    }



    var questionaire = [];

    questionaire[1] = "100% safe and secure, hosted on Azure";
    questionaire[2] = "Eliminate allegations & accusations of unfair practices ";
    questionaire[3] = "Cut down time and effort in negotiation as compare to tradtional process";
    questionaire[4] = "Makes your procurement process more transparent";
    questionaire[5] = "Easy to use, robust, simple and intuitive";
    questionaire[6] = "Device agnostic and responsive: Access it from anywhere, at any time and from any device";



    $("#btn-reasons").click(function(e) {
     var index = $('#custQuestions').data('id');
        
        if (index == 6)
            index = 0;
        
        $('#custQuestions').animate({
            opacity: 0.25
        }, 1000, function () {
        $(this).empty().html('<span class="h3">' + questionaire[index + 1] + '</span>').css("opacity", "1");
        });
//            $('#questionaire-show').empty().fadeIn().text();
        $('#custQuestions').data('id', index + 1)
      

    });
