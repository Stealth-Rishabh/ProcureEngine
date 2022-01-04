var BidID = "";
var ButtonType = '';
jQuery(document).ready(function () {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    
    BidID = getUrlVarsURL(decryptedstring)["BidID"]
    $('#drpVendors').val('');
    $('#drpVendors').select2({
        placeholder: "Select vendors only if you want to send them auto PO confirmation.",
        allowClear: true
    });
    FetchVendors(BidID);
    Fillhelp(getUrlVarsURL(decryptedstring)["App"]);
});
$('#txtRemarks,#txtbidspecification,#txtRemarksAward,#txtRemarksApp').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
function FetchVendors(BidID) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/fetchVendor/?BidID=" + BidID + "&VendorType=YES",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
           
            jQuery("#ddlVendors,#ddlVendorsAdmin,#drpVendors").empty();
            jQuery("#ddlVendors,#ddlVendorsAdmin").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlVendors,#ddlVendorsAdmin,#drpVendors").append(jQuery("<option ></option>").val(data[i].vendorID).html(data[i].vendorName));
                //selectedValues.push(data[i].VendorID);
            }
            // $("#drpVendors").select2("val",selectedValues);
            FetchRecomendedVendor(BidID)
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

var FormValidation = function () {
  
    var validateformProductServices = function () {
        var form1 = $('#formsubmitadmin');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                ddlVendorsAdmin: {
                    required: true,
                },
                txtbidspecification: {
                    required: true,
                }
            },
            messages: {
                ddlVendorsAdmin: {
                    required: "Please select vendor"
                },
                txtbidspecification: {
                    required: "Please enter your comment"
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();
                error1.show();
                // App.scrollTo(error1, -300);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                        .closest('.Input-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                        .closest('.Input-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                        .closest('.Input-group').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
                if (AppStatus == 'Reverted') {
                    if (ButtonType == 'Cancel') {
                        $('#modalcancelremarks').modal('show');
                       // cancelBtnclick();
                    }
                    else {
                        ApprovalAdmin();
                    }
                }
                else {
                    ForwardBid(BidID, BidTypeID, BidForID)
                  
                }
              
            }
        });
    }
    var validateAppsubmitData = function () {
        var form1 = $('#frmsubmitapp');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                ddlActionType: {
                    required: true,
                },
                ddlVendors: {
                    required: true,
                },
                txtRemarksApp: {
                    required: true,
                }
            },
            messages: {
                ddlActionType: {
                    required: "Please select Action"
                },
                ddlVendors: {
                    required: "Please select vendor"
                },
                txtRemarksApp: {
                    required: "Please enter your comment"
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();
                error1.show();
                // App.scrollTo(error1, -300);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                        .closest('.Input-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                        .closest('.Input-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                        .closest('.Input-group').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
                
                ApprovalApp();
               
            }
        });
    }
    var validateformAwardedsubmit = function () {
        var form1 = $('#formAwardedsubmit');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                txtRemarksAward: {
                    required: true
                }
            },
            messages: {
                txtRemarksAward: {
                    required: "Please enter your comment"
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();
                error1.show();
                // App.scrollTo(error1, -300);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                        .closest('.Input-group').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                        .closest('.Input-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                        .closest('.Input-group').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
               
                AwardBid(BidID)
               
            }
        });
    }
    var validateformCancelBid = function () {
        var form1 = $('#frmRemarksCancel');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                txtRemarks: {
                    required: true,
                    maxlength: 2000
                }
            },
            messages: {
                txtRemarks: {
                    required: "Please enter Cancel Reason."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                // success1.hide();
                // error1.show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                        .closest('.col-md-10').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                        .closest('.col-md-10').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                        .closest('.col-md-10').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
                cancelBtnclick();

            }
        });
    }
    var validateformAddApprover = function () {
        var formApprover = $('#frmApprover');
        formApprover.validate({

            doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {

            },

            invalidHandler: function (event, validator) {
            },

            highlight: function (element) {
                $(element).closest('.col-md-7').addClass('has-error');

            },

            unhighlight: function (element) {
                $(element).closest('.col-md-7').removeClass('has-error');

            },
            errorPlacement: function (error, element) {

            },
            success: function (label) {
            },
            submitHandler: function (form) {
                
                if (sessionStorage.getItem('hdnBidApproverID') != "0" && jQuery("#txtApproverBid").val() != "") {
                 
                    $('.alert-danger').show();
                    $('#spandangerapp').html('Approver not selected. Please press + Button after selecting Approver');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                    return false;
                }
                else if ($('#tblBidapprovers >tbody >tr').length == 0) {
                    $('.alert-danger').show();
                    $('#spandangerapp').html('Please Map Approver.');
                    $('.alert-danger').fadeOut(5000);
                    return false;

                }
                else {
                    MapBidapprover();
                }

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
          
            validateformProductServices();
            validateAppsubmitData();
            validateformAwardedsubmit();
            validateformCancelBid();
            validateformAddApprover();
        }
    };
}();

jQuery("#btnCancelbidAdmin").click(function () {
    ButtonType = 'Cancel'
    $('#modalcancelremarks').modal('show');
  
});

jQuery("#btnCancelbidApp").click(function () {
    ButtonType = 'Cancel'
    $('#modalcancelremarks').modal('show');
   
});
jQuery("#btnCancelbidAward").click(function () {
    ButtonType = 'Cancel'
    $('#modalcancelremarks').modal('show');
  
});

jQuery("#btnSubmitApp").click(function () {
    ButtonType = ''
});

jQuery("#btnSubmitAdmin").click(function () {
    ButtonType = ''
});

jQuery("#btnSubmitAward").click(function () {
    ButtonType = ''
});

function Fillhelp(App1) {
    if (App1 == 'N') {
        $('#Approver').show();

    }
    else {
        $('#Awarded').show();
    }
}
