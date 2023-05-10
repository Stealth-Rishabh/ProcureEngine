jQuery(document).ready(function () {
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
    fetchBidType();// for serach vendor
    FormValidatePR()
    numberonly()
    //abheedev 25/11/2022


});



function searchPIForm() {
    
    $("#submit_form_prmapping").removeClass('hide')
}
//adding pr details

function AddPRDetail() {
    if ($("#tblpinumber").text() == "") {
        $("#tblpinumber").text($("#txtpinumber").val());
    }   
 
    $("#PRMapTable").removeClass('hide')
    $("#PRMapTable").append('<tr><td></td><td>' + $("#txtrfqpr option:selected").text() + '</td><td>' + $("#txtprnumber option:selected").text() + '</td><td>' + $("#txtlineitem option:selected").text() + '</td><td>' + $("#txtmaterialcode option:selected").text() + '</td><td>' + $("#txtshortname option:selected").text() + '</td><td>' + $("#txtratenfa option:selected").text() + '</td><td>' + $("#txtquantity option:selected").text() + '</td><td>' + 'vendor a value' + '</td><td>' + 'vendor b value' + '</td></tr>');    
}

//form validation for PR Form
function FormValidatePR() {

    $('#submit_form_prmapping').validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {

            txtrfqpr: {
                required: true,
            },
            txtprnumber: {
                required: true,
            },
            txtlineitem: {
                required: true,
            },
            txtmaterialcode: {
                required: true,
            },
            txtshortname: {
                required: true,
            },
            txtratenfa: {
                required: true,
            },
            txtquantity: {
                required: true,
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


            AddPRDetail()
        }
    });
}