
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
    $('#txtLastFiscalyear').val(getCurrentFinancialYear())
    $('#txt2LastFiscalyear').val(getlastFinancialYear())

});


function getPan(pan) {
    var pan = $('#txtGst').val().substr(2, 10); //11
    if ($('#txtGst').val().length == 15) {
        $('#txtPan').val(pan.toUpperCase());
        $('#txtGst').val($('#txtGst').val().toUpperCase())
        $('#txtPan').attr('disabled', 'disabled')
        //$('#txtGst').attr('disabled', 'disabled')
    }
}
function SubmitVendorRegistration() {
    var _cleanString = StringEncodingMechanism($("#ddlCompanyName").val().trim());
    var _cleanString2 = StringEncodingMechanism($("#txtBank").val().trim());
    var _cleanString3 = StringEncodingMechanism($("#txtAccountHolder").val().trim());
    var _cleanString4 = StringEncodingMechanism($("#txtContName").val().trim());
    var _cleanString5 = StringEncodingMechanism($("#txtContName2").val().trim());

    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var selected = [];
    var selectedid = [];
    var selectedidss = '';
    var result = '';

    if ($("#ddlTypeofProduct").select2('data').length) {
        $.each($("#ddlTypeofProduct").select2('data'), function (key, item) {
            selectedid.push(item.id);
            selected.push(item.text);
            $("#ddlTypeofProduct").append($("#ddlTypeofProduct").text(item.id) + '#');
            result += selectedidss.concat(item.id, "#");

        });
        straddedproduct = result.slice('#', -1);

        var msmetype = $("#ddlMSMEClass").val().trim();
        var gstclass = $("#ddlGSTclass").val().trim();
        var tds = $("#ddlTds option:selected").val().trim();
        var paymentterm = $("#ddPayTerms").val().trim();
        if (msmetype == 'Select') {
            var msmeselectvalue = "";
        } else {
            var msmeselectvalue = $("#ddlMSMEClass").val().trim();
        }
        if (gstclass == '') {
            var gstclassvalue = "";
        } else {
            var gstclassvalue = $("#ddlGSTclass").val().trim();
        }
        if (tds == 0) {
            var tdsvalue = "";
        } else {
            var tdsvalue = $("#ddlTds option:selected").text().trim();
        }
        if (paymentterm == 0) {
            var paymenttermvalue = 0;
        } else {
            var paymenttermvalue = parseInt($("#ddPayTerms").val());
        }

        var gstfilename = $('#filegst').val().substring(jQuery('#filegst').val().lastIndexOf('\\') + 1)
        gstfilename = gstfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var panfilename = $('#filepan').val().substring(jQuery('#filepan').val().lastIndexOf('\\') + 1)
        panfilename = panfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var msmefilename = $('#filemsme').val().substring(jQuery('#filemsme').val().lastIndexOf('\\') + 1)
        msmefilename = msmefilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var checkfilename = $('#filecheck').val().substring(jQuery('#filecheck').val().lastIndexOf('\\') + 1)
        checkfilename = checkfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var VendorInfo = {

            "customerID": parseInt(sessionStorage.getItem('CustomerID')),
            "estTypeID": parseInt($("#ddlNatureEstaiblishment").val()),
            "estName": $("#ddlNatureEstaiblishment option:selected").text(),
            "vendorCatID": parseInt($("#ddlVendorType").val()),
            "vendorCatName": $("#ddlVendorType option:selected").text().trim(),
            "product": $("#txtProduct").val(),
            //"vendorName": $("#ddlCompanyName").val().trim(),
            "vendorName": _cleanString,
            "vendorAdd": $("#txtAdd1").val().trim(),
            "countryID": parseInt($("#ddlCountry").val()),
            "countryName": $("#ddlCountry option:selected").text().trim(),
            "stateID": parseInt($("#ddlState").val()),
            "stateName": $("#ddlState option:selected").text().trim(),
            "cityID": parseInt($("#ddlCity").val()),
            "cityName": $("#ddlCity option:selected").text().trim(),
            "pinCode": $("#txtPin").val().trim(),
            "pAN": $("#txtPan").val().trim(),
            "tAN": $("#txtTan").val().trim(),
            "tDSTypeId": parseInt($("#ddlTds option:selected").val().trim()),
            "tDSTypeName": tdsvalue,
            "gSTClass": gstclassvalue,
            "ServiceTaxNo": $("#txtGst").val().trim(),
            "payTermID": paymenttermvalue,
            //"bankName": $("#txtBank").val().trim(),
            "bankName": _cleanString2,
            "bankAccount": $("#txtAcNo").val().trim(),
            "iFSCCode": $("#txtIFSC").val().trim(),
            //"accountName": $("#txtAccountHolder").val().trim(),
            "accountName": _cleanString3,
            "mSMECheck": $("#ddlMSME option:selected").val(),
            "mSMEType": msmeselectvalue,
            "mSMENo": $("#txtUdyam").val().trim(),
            "previousTurnover": $("#txtLastFiscal").val().trim(),
            "secondLastTurnover": $("#txt2LastFiscal").val().trim(),
            "previousTurnoverYear": $("#txtLastFiscalyear").val().trim(),
            "secondLastTurnoverYear": $("#txt2LastFiscalyear").val().trim(),
            //"contactName": $("#txtContName").val().trim(),
            "contactName": _cleanString4,
            "contactEmailID": $("#txtEmail").val().trim(),
            "mobile": $("#txtMobile").val().trim(),
            //"contactNameMD": $("#txtContName2").val().trim(),
            "contactNameMD": _cleanString5,
            "mobileMD": $("#txtMobile2").val().trim(),
            "AltEmailID": $("#txtEmail2").val().trim(),
            "gSTFile": gstfilename,
            "pANFile": panfilename,
            "mSMEFile": msmefilename,
            "cancelledCheck": checkfilename,
            "productCat": straddedproduct,
            "currencyLastFY": $("#currencyLastFiscal option:selected").val(),
            "currencyLast2FY": $("#currency2LastFiscal option:selected").val(),
        }
    };

    console.log(JSON.stringify(VendorInfo));

    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "VendorRequest/VendorRequestSubmit",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(VendorInfo),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            //alert(data.length);
            $('#hdntmpvendorid').val(data);
            if ($('#filegst').val() != '') {

                fnUploadFilesonAzure('filegst', gstfilename, 'VR/Temp/' + data);

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/Temp/' + data);

            }

            if ($('#filemsme').val() != '') {
                fnUploadFilesonAzure('filemsme', msmefilename, 'VR/Temp/' + data);

            }

            if ($('#filecheck').val() != '') {
                fnUploadFilesonAzure('filecheck', checkfilename, 'VR/Temp/' + data);

            }

            $('#divsuccvendor').show();
            $('#spansuccessvendor').text("Vendor Request Submitted successfully");
            $('#spansuccessvendor').fadeOut(6000);
            setTimeout(function () {
                $("#registerParticipantModal").modal("hide");
                // fnFormClear(); //Create reset Function
                jQuery.unblockUI();
            }, 6000)


        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'tempVR/' + sessionStorage.getItem('tmpVendorID'));
}


jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    "This field is required."
);

var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;

jQuery.validator.addMethod("ValidPAN", function (value, element) {

    return (value.match(regex))

}, " Invalid PAN No.");

var regIFSC = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;

jQuery.validator.addMethod("ValidIFSC", function (value, element) {

    return (value.match(regIFSC))

}, " Invalid IFSC Code");

var formEmailvalidate = $('#frmEmailValidate');
var formvendor = $('#submit_form');
var successVendor = $('.alert-success', formvendor);
var errorVendor = $('.alert-danger', formvendor);
function FormValidate() {
    formvendor.validate({

        //doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        // errorElement: 'span', //default input error message container
        //  errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: false,
        rules: {

            ddlNatureEstaiblishment: {
                required: true,
                notEqualTo: 0

            },
            ddlVendorType: {
                required: true,
                notEqualTo: 0

            },
            ddlTypeofProduct: {
                required: true,

            },
            txtProduct: {
                required: true

            },
            ddlTitle: {
                required: true,
                notEqualTo: 0
            },
            ddlCompanyName: {
                required: true,
            },
            txtAdd1: {
                required: true,
            },
            ddlGSTclass: {
                required: true,
                notEqualTo: 0
            },
            /*ddlCountry: {
                required: true,
               notEqualTo: 0
            },*/
            ddlState: {
                required: true,
                notEqualTo: 0
            },
            ddlCity: {
                required: true,
                notEqualTo: 0
            },
            txtPin: {
                required: true,
            },

            tblAttachmentsElem: {
                required: true,
            },
            /*txtGst: {
                required: true,
                maxlength: 15,
            },
            txtPan: {
                required: true,
                ValidPAN: true
            },*/
            tblAttachmentsElem2: {
                required: true,
            },

            txtBank: {
                required: true,
            },
            txtAcNo: {
                required: true,
                number: true,
                maxlength: 15
            },
            txtIFSC: {
                required: true,
                ValidIFSC: true,
            },
            txtAccountHolder: {
                required: true,
            },
            txtContName: {
                required: true,
            },
            txtMobile: {
                required: true,
                number: true,
                maxlength: 10
            },
            txtMobile2: {

                number: true,
                maxlength: 15
            },
            txtEmail: {
                required: true,
                email: true
            },
            /* ddlMSME: {
                 required: true,
                 notEqualTo: 0
             },
             ddlMSMEClass: {
                 required: true,
                 notEqualTo: 0
             },
             txtUdyam: {
                 required: true,
             },
             filegst: {
                 required: true
             },*/
            filecheck: {
                required: true
            },
            /*  filepan: {
                  required: true
              }*/


        },

        invalidHandler: function (event, validator) {
            $('#diverrorvendor').show()
            $('#divsuccvendor').hide()
            $('#spanerrorvendor').text("Please fill all mandatory Details..");

            for (var i = 0; i < validator.errorList.length; i++) {
                $(validator.errorList[i].element).parents('.panel-collapse.collapse').collapse('show');
            }
            $('#diverrorvendor').fadeOut(6000);


        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        /*errorPlacement: function (error, element) {

        },*/
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            // error.insertAfter(element); // for other inputs, just perform default behavior
        },
        submitHandler: function (form) {

            SubmitVendorRegistration();
            //var id = document.activeElement.getAttribute('id');
            //if (id.trim() == "btnverifyemail") {
            //    validateEmail();
            //} else {
            //    SubmitVendorRegistration();
            //}
        }
    });
    formEmailvalidate.validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            txtemailverify: {
                required: true,
                email: true
            }

        },
        messages: {
            txtemailverify: {
                required: "Please Enter Valid EmailID"
            }

        },
        invalidHandler: function (event, validator) {
            //errorVendor.show()
            // successVendor.hide();
            $('#diverrorvendor').show()
            $('#divsuccvendor').hide()
            $('#spanerrorvendor').text("Please Enter Valid EmailID");
            $('#diverrorvendor').fadeOut(6000);
        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        errorPlacement: function (error, element) {

        },
        success: function (label) {
        },
        submitHandler: function (form) {

            validateEmail();
        }
    });
}

function validateEmail() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    $('#modalLoader').removeClass('display-none')
    var emailId = $("#txtemailverify").val().trim();

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/IsVendorExists?emailID=" + emailId,
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data == '0') {
                $('#txtEmail').attr('disabled', 'disabled');//#txtemailverify,#btnverifyemail
                $('#btnverifysubmit').removeClass('hide');
                $('#txtEmail,#txtEmail2').val(emailId);
                $('#collapse2').removeClass('collapse2').addClass('collapse in')
                $('#H4ContactDetails').removeClass('collapsed')

            }
            else {
                $('#diverrorvendor').show();
                $('#spanerrorvendor').html("EmailId is already registered&nbsp;&nbsp;<b><a style=text-decoration:none href='https://www.procurengine.com/vendor/'>Please Login here</a></b>");
                $('#txtemailverify,#txtEmail,#btnverifyemail').removeAttr('disabled');
            }
            $('#modalLoader').addClass('display-none');
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerrorvendor', '');
            }
            $('#modalLoader').addClass('display-none');
            $('#txtemailverify').val('')
            jQuery.unblockUI();
            return false;
        }
    });
}

$('#registerParticipantModal').on("hidden.bs.modal", function () {
    //fnFormClear();
    $('#txtemailverify,#btnverifyemail').removeAttr('disabled');
    $('#btnverifysubmit').addClass('hide');
    $('#txtemailverify').val('');
    $('#txtEmail,#txtEmail2').val('');
    $('#modalLoader').addClass('display-none');
    $('#collapse2').addClass('collapse2').removeClass('collapse in')
    $('#H4ContactDetails').removeClass('collapsed').addClass('collapsed')
    window.location = window.location.href.split('#')[0];
})
function fnClearformfields() {
    $('#diverrorvendor').fadeOut(7000);
    $("#txtContName").val('')
    $("#txtEmail").val('')
    $("#txtMobile").val('')
    $("#txtContName2").val('')
    $("#txtMobile2").val('')
    $("#txtEmail2").val('')
}

// make reset Function & call after Details submit ????
function fnFormClear() {

    $("#ddlNatureEstaiblishment").val('0')
    //$("#ddlNatureEstaiblishment option:selected").text('')
    $("#ddlVendorType").val('0')
    $("#txtProduct").val('')
    $("#ddlCompanyName").val('')
    $("#txtAdd1").val('')
    $("#ddlCountry").val('111').trigger("change");
    $("#ddlState").val(''),
        $("#ddlCity").val('')
    $("#txtPin").val('')
    $("#txtPan").val('')
    $("#txtTan").val('')
    $("#txtGst").val('')
    $("#txtBank").val('')
    $("#txtAcNo").val('')
    $("#txtIFSC").val('')
    $("#txtAccountHolder").val('')
    $("#ddlMSME option:selected").val('')
    $("#txtUdyam").val('')
    $("#txtLastFiscal").val('')
    $("#txt2LastFiscal").val('')
    // $("#txtLastFiscalyear").val('')
    // $("#txt2LastFiscalyear").val('')
    $("#txtContName").val('')
    $("#txtEmail").val('')
    $("#txtMobile").val('')
    $("#txtContName2").val('')
    $("#txtMobile2").val('')
    $("#txtEmail2").val('')
    $("#ddlMSMEClass").val('')
    $("#ddlGSTclass").val('')
    $("#ddlTds").val('')
    $("#ddPayTerms").val('')
    $('#filegst').val('')
    $('#filepan').val('')
    $('#filemsme').val('')
    $('#filecheck').val('')
    $("#currencyLastFiscal option:selected").val('')
    $("#currency2LastFiscal option:selected").val('')
    $('#diverrorvendor').fadeOut(7000);
}
function fnChangeGSTClass() {

    if ($('#ddlGSTclass').val().toLowerCase() == "registered") {
        $('#submit_form').validate();
        $('#gstfilespn').html('*');
        $('#GSTStartspn').html('*');
        $('#spnpanno').html('*');
        $('#spanpanfile').html('*');
        $('#txtGst').rules('add', {
            required: true,
            maxlength: 15
        });
        $('#filegst').rules('add', {
            required: true
        });
        $('#txtPan').rules('add', {
            required: true,
            ValidPAN: true
        });
        $('#filepan').rules('add', {
            required: true
        });
    }
    else {
        $('#gstfilespn').html('');
        $('#GSTStartspn').html('');
        $('#spnpanno').html('');
        $('#spanpanfile').html('');
        $('#txtGst').rules('remove');
        $('#filegst').rules('remove');
        $('#txtPan').rules('remove');
        $('#filepan').rules('remove');
    }
}
function fetchMsme() {

    $('#submit_form').validate();
    if (jQuery("#ddlMSME option:selected").val() == 'Y') {
        $('.hideInput').removeClass('hide');

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
        $('#ddlMSMEClass').rules('remove');
    }
}
