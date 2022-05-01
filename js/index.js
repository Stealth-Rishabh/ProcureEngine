var Flag = 'S';
function annualSubscription(flag) {
  
    Flag = flag;
    if (flag.substr(0, 2).toLowerCase() == "cu") {
        $('#requestModalLabel').text("Contact Us")
    }
    else if (flag.substr(0, 2).toLowerCase() == "ft") {
        $('#requestModalLabel').text("Free Trial")
    }
    else {
        $('#requestModalLabel').text("Request for Demo")
    }
}

var countrySelect = $('[name="CountryID"]');
var countrySelectSupp = $('[name="CountrySuppID"]');
   // var stateSelect = $('[name="StateID"]');
   // var citySelect = $('[name="CityID"]');

    // var baseUri = 'https://www.procurengine.com/API/api/CustomerRegistration/';
   // var baseUri = 'https://pev3qaapi.azurewebsites.net/CustomerRegistration/';
    var baseUri = 'https://pev3proapi.azurewebsites.net/CustomerRegistration/';



    function getCountryData(cb, id) {
            var uri = baseUri + 'Country/?CountryID=' + id + '&_=' + Date.now();
    $.get(uri).then(cb);
        }

    

    function constructSelect(type, element, options) {
        element.html('');
    var optionElements = [
    $('<option value="">Choose ' + type + '</option>')
    ];

    for (var i = 0; i < options.length; i++) {
                var item = options[i];

    var el = $('<option></option>');
        el.val(item[type + 'ID']);
        el.text(item[type + 'Name']);
        
    optionElements.push(el);
            }
    element.append(optionElements);
    element.val('');
        }

getCountryData(function (res) {
    
     constructSelect('country', countrySelect, res);
    constructSelect('country', countrySelectSupp, res);
    }, 0);

function FormValidate() {
   
    $("#registerForm").validate({
       
        //doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        //errorElement: 'span', //default input error message container
        //errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            UserName: {
                required:true
            },
            designation:{
                    required: true
                },
            CompanyName: {
             required: true
            },
            UserEmail: {
                required: true,
                email: true
            },
            MobileNo: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 12
            },
            Message: {
                required: true
            },
            CountryID: {
                required: true
            },
            StateID: {
                required: true
            },
            CityID: {
                required: true
            },
            selectdate1: {
                required: true
            },
            selectdatetime1: {
                required: true
            }
        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            
            $('#successdiv').hide()
            $('#errordiv').show();
            $('#errormsg').text("Please fill all mandatory fields.");
            $('#errordiv').fadeOut(5000);
            $('#successdivSupp').hide()

        },
        //errorPlacement: function (error, element) {
        //    //error.addClass('help-block');
        //   // error.insertAfter(element);
           
        //},
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
           
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
           // $(element).closest('.form-group').removeClass('error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
           // error.insertAfter(element); // for other inputs, just perform default behavior
        },

        submitHandler: function (form) {
            $('#errordiv').hide();
            fnFormSubmit()
        }
    })
    $("#registerFormSupp").validate({

        focusInvalid: false,
        ignore: "",
        rules: {
            UserNameSupp: {
                required: true
            },
            designationSupp: {
                required: true
            },
            CompanyNameSupp: {
                required: true
            },
            UserEmailSupp: {
                required: true,
                email: true
            },
            MobileNoSupp: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 12
            },
            CountrySuppID: {
                required: true
            },
            MessageSupp: {
                required: true
            },
            StateID: {
                required: true
            },
            CityID: {
                required: true
            },
            selectdatespp1: {
                required: true
            },
            selectdatetimesupp1: {
                required: true
            },
            ddlsupport:{
                required: true
            }
        },
        errorElement: 'span',
        
        invalidHandler: function (event, validator) { //display error alert on form submit   

            $('#errordivSupp').show();
            $('#errormsgSupp').text("Please fill all mandatory fields.");
            $('#errordivSupp').fadeOut(5000);
            $('#successdivSupp').hide()
            //Metronic.scrollTo($(".alert-danger"), -200);
        },
        //errorPlacement: function (error, element) {
        //    //error.addClass('help-block');
        //   // error.insertAfter(element);

        //},
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');

        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
            // $(element).closest('.form-group').removeClass('error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            // error.insertAfter(element); // for other inputs, just perform default behavior
        },
        submitHandler: function (form) {
            $('#errordivSupp').hide();
            fnFormSubmitSupp()
        }
    })
}
$("#requestModal").on("hidden.bs.modal", function () {
    fnReset();
    $('.alert-success').hide();
    $('.alert-danger').hide();
    fnReset();
    $(".form-group").removeClass("has-error");
});
function fnFormSubmitSupp() {
    //jQuery.blockUI({ message: '<h5><img src="pro_img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("PageFrom").toLowerCase() == "contact-us") {
        Flag = $('#ddlsupport').val()
    }
        var payload = {
            CompanyName: $('#CompanyNameSupp').val(),
            Address: "",
            CountryID: $('#CountrySuppID').val(),
            StateID: "",
            CityID: "",
            UserName: $('#UserNameSupp').val(),
            MobileNo: $('#MobileNoSupp').val(),
            UserEmail: $('#UserEmailSupp').val(),
            Message: $('#briefRequirementSupp').val(),
            designation: $('#designationSupp').val(),
            Slot1: $('#selectdatespp1').val() + " " + $('#selectdatetimesupp1').val(),
            Slot2: $('#selectdatespp2').val() + " " + $('#selectdatetimesupp2').val(),
            Slot3: $('#selectdatespp3').val() + " " + $('#selectdatetimesupp3').val(),
            Flag: Flag,
            PageFrom: sessionStorage.getItem("PageFrom")
        };

       
        //alert(JSON.stringify(payload))
       // console.log(JSON.stringify(payload))
            $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: baseUri + 'InsCustomerQueries',
            data: JSON.stringify(payload),
            success: function (data) {
                $('#modalLoaderparameter').hide();
                $('.alert-success').show();
                $('#successdivSupp').html("Thank you so much for contacting us.We shall contact you according to preffered Time slot mentioned.");
                $('.alert-success').fadeOut(5000);
                $('#errordivSupp').hide();
                fnReset();
               // Metronic.scrollTo($(".alert-success"), -200);
              //  jQuery.unblockUI();
            }
        });
  }
function fnFormSubmit() {
    $('#modalLoaderparameter').show()
    
    var payload = {
        CompanyName: $('#CompanyName').val(),
        Address: "",
        CountryID: $('#CountryID').val(),
        StateID: "",
        CityID: "",
        UserName: $('#UserName').val(),
        MobileNo: $('#MobileNo').val(),
        UserEmail: $('#UserEmail').val(),
        Message: $('#briefRequirement').val(),
        designation: $('#designation').val(),
        Slot1: $('#selectdate1').val() + " " + $('#selectdatetime1').val(),
        Slot2: $('#selectdate2').val() + " " + $('#selectdatetime2').val(),
        Slot3: $('#selectdate3').val() + " " + $('#selectdatetime3').val(),
        Flag: Flag,
        PageFrom: sessionStorage.getItem("PageFrom")
    };


    // alert(JSON.stringify(payload))
    console.log(JSON.stringify(payload))
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: baseUri + 'InsCustomerQueries',
        data: JSON.stringify(payload),
        success: function (data) {
            $('#modalLoaderparameter').hide();
            $('.alert-success').show();
            $('#successdiv').html("Thank you so much for contacting us.We shall contact you according to preffered Time slot mentioned.");
            $('.alert-success').fadeOut(5000);
            $('#errordiv').hide();

            fnReset();
            setTimeout(function () {
                $("#requestModal").modal("hide");
            }, 5000)
        }
    });
}
function fnReset()
{
    $('#CompanyName').val('')
    $('#CountryID').val('')
    $('#StateID').val('')
    $('#CityID').val('')
    $('#UserName').val('')
    $('#MobileNo').val('')
    $('#designation').val('')
    $('#UserEmail').val('')
    $('#selectdate1').val('')
    $('#selectdatetime1').val('')
    $('#selectdate2').val('')
    $('#selectdatetime2').val('')
    $('#selectdate3').val('')
    $('#selectdatetime3').val('')
    $('#briefRequirement').val('')

    $('#CompanyNameSupp').val('')
    $('#CountrySuppID').val('')
    $('#StateID').val('')
    $('#CityID').val('')
    $('#UserNameSupp').val('')
    $('#MobileNoSupp').val('')
    $('#designationSupp').val('')
    $('#UserEmailSupp').val('')
    $('#selectdatespp1').val('')
    $('#selectdatetimesupp1').val('')
    $('#selectdatespp2').val('')
    $('#selectdatetimesupp2').val('')
    $('#selectdatespp3').val('')
    $('#selectdatetimesupp3').val('')
    $('#briefRequirementSupp').val('')
}

       