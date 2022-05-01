var BidID = "";
var ButtonType = '';
jQuery(document).ready(function () {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    
    BidID = getUrlVarsURL(decryptedstring)["BidID"]
    
    FetchVendors(BidID);
	Fillhelp(getUrlVars()["App"]);
});

$('#txtRemarks,#txtbidspecification,#txtRemarksAward,#txtRemarksApp').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
function FetchVendors(BidID) {
	
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/fetchVendor/?BidID=" + BidID +"&VendorType=YES",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
			
            jQuery("#ddlVendors,#ddlVendorsAdmin,#drpVendors").empty();
            jQuery("#ddlVendors,#ddlVendorsAdmin").append(jQuery("<option ></option>").val("").html("Select"));
            jQuery("#drpVendors").append(jQuery("<option ></option>").val("").html("Only for auto PO confirmation"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlVendors,#ddlVendorsAdmin,#drpVendors").append(jQuery("<option ></option>").val(data[i].vendorID).html(data[i].vendorName));
            }
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

var rowitems = 0
function addmorevendorRemarks() {
    var str = '';

    var form1 = $('#formAwardedsubmit')
    $('#drpVendors').rules('add', {
        required: true,
    });
    $('#txtRemarksAward').rules('add', {
        required: true,
    });
    if (form1.valid() == true) {

        $('#divtableaward').show()
        rowitems = rowitems + 1;
        if (!jQuery("#tblremarksvendorsawared thead").length) {
            jQuery('#tblremarksvendorsawared').append("<thead><tr><th class='bold'>Vendor</th><th class='bold'>Remarks</th><th></th></tr></thead>");
            str = '<tr id=tr' + rowitems + '><td id=vid' + rowitems + ' class=hide>' + $("#drpVendors").val() + '</td><td style="width:20%!important">' + jQuery("#drpVendors option:selected").text() + '</td>';
        }
        else {
            str = '<tr id=tr' + rowitems + '><td id=vid' + rowitems + ' class=hide>' + $("#drpVendors").val() + '</td><td style="width:20%!important">' + jQuery("#drpVendors option:selected").text() + '</td>';
        }
        str += '<td style="width:60%!important">' + jQuery("#txtRemarksAward").val() + '</td><td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteitem(tr' + rowitems + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblremarksvendorsawared').append(str);

        var arr = $("#tblremarksvendorsawared tr");

        $.each(arr, function (i, item) {
            var currIndex = $("#tblremarksvendorsawared tr").eq(i);
            var matchText = currIndex.find("td:eq(0)").text();

            $(this).nextAll().each(function (i, inItem) {
                if (matchText == $(this).find("td:eq(0)").text()) {
                    $(this).remove();
                    $('#diverrordiv2').show()
                    $('#errordiv2').text('Supplier is already selected')
                    $('#diverrordiv2').fadeOut(5000)
                }

            });
        });
        jQuery("#drpVendors").val('')
        jQuery('#txtRemarksAward').val('')


    }
    else {

        form1.validate()
        return false;
    }
}
function deleteitem(rowid) {

    rowitems = rowitems - 1;
    $('#' + rowid.id).remove();

    if ($('#tblremarksvendorsawared tr').length == 1) {
        $('#divtableaward').hide()
    }
    else {
        $('#divtableaward').show()
    }
}
var FormValidation = function () {
    var validateModication = function () {
        var form1 = $('#formModify');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);

        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                txtPerSqFtRate: {
                    required: true,
                    number: true,
                    minlength: 1,
                    maxlength: 10
                },
                txtManPowerCost: {
                    required: true,
                    number: true,
                    minlength: 1,
                    maxlength: 10
                },
                txtInfrastructureCost: {
                    required: true,
                    number: true,
                    minlength: 1,
                    maxlength: 10
                },
                txtUtilitiesCost: {
                    required: true,
                    number: true,
                    minlength: 1,
                    maxlength: 10
                },
                txtFixedManagementFee: {
                    required: true,
                    number: true,
                    minlength: 1,
                    maxlength: 10
                }
            },
            messages: {
                txtPerSqFtRate: {
                    required: "Please enter Per Square Feet Rent"
                },
                txtManPowerCost: {
                    required: "Please enter Man Power Cost"
                },
                txtInfrastructureCost: {
                    required: "Please enter Infrastructure Cost"
                },
                txtUtilitiesCost: {
                    required: "Please enter Utilities Cost"
                },
                txtFixedManagementFee: {
                    required: "Please enter Fixed Management Fee"
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
                InsertBidModificationProductServices();
                //App.scrollTo(error1, -100);
            }
        });
    }
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
                        cancelBtnclick();
                    } else {
                        ApprovalAdmin();
                    } 
                }
                else {
                    
                        ForwardBid(BidID, BidTypeID, BidForID)
                  
                }
                //App.scrollTo(error1, -100)
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
                },
                drpVendors: {
                    required: false
                }
            },
            messages: {
                txtRemarksAward: {
                    required: "Please enter your comment"
                },
                drpVendors: {
                    required: "Please enter your Vendor"
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();
                error1.show();
                $('#diverrordiv2').hide();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.Input-group,.xyz').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.Input-group,.xyz').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                    .closest('.Input-group,.xyz').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
				
                  // AwardBid(BidID)                 
               
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
            validateModication();
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

jQuery("#btnSubmitApp").click(function () {
    ButtonType = ''
});

jQuery("#btnSubmitAdmin").click(function () {
    ButtonType = ''
});

jQuery("#btnCancelbidAward").click(function () {
    ButtonType = 'Cancel'
    $('#modalcancelremarks').modal('show');
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