jQuery(document).ready(function () {
   
    var date = new Date();
    date.setDate(date.getDate() - 1);
    $('#txtPODate').datepicker({ startDate: "-1d" });

    Pageloaded()

    setInterval(function () { Pageloaded() }, 15000);
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
    Metronic.init();
    Layout.init();
    var _RFQid;
    if (window.location.search) {
        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)
        _RFQid = getUrlVarsURL(decryptedstring)["RFQID"];
    }

    if (_RFQid == null)
        sessionStorage.setItem('hddnRFQID', 0)
    else {
        sessionStorage.setItem('hddnRFQID', _RFQid)
        fnGetTermsCondition();
        fetchAttachments();
        fnGetApprovers();
        GetQuestions();
        fetchReguestforQuotationDetails();
        fetchRFIParameteronload();

    }
    FormWizard.init();
    ComponentsPickers.init();
    setCommonData();
    fnGetTermsCondition();
    fetchMenuItemsFromSession(1, 24);

    FetchCurrency('0');

    FetchUOM(sessionStorage.getItem("CustomerID"));

    fetchRegisterUser('1');
    fetchVendorGroup('M', 0);
    fetchParticipantsVender();// fetch all vendors for advance search

});

setTimeout(function () {
    $('#dropCurrency').val(sessionStorage.getItem("DefaultCurrency"))
    $('#txtConversionRate').val(1);
    fnfillInstructionExcel();
}, 2000);

document.getElementById('browseBtnExcelParameter').addEventListener('click', function () {
    document.getElementById('file-excelparameter').click();
});

$('#file-excelparameter').change(handleFileparameter);

$("#cancelBidBtn").hide();
$("#spnParamAttach").hide();
var error = $('.alert-danger');

var success = $('.alert-success');

var form = $('#submit_form');
var Vehicleerror = $('#errordiv');
var Vehiclesuccess = $('#successdiv');
var Vehicleerror1 = $('#errordiv1');
var Vehiclesuccess1 = $('#successdiv1');

var currentdate = new Date();
$(".thousandseparated").inputmask({
    alias: "decimal",
    rightAlign: false,
    groupSeparator: ",",
    radixPoint: ".",
    autoGroup: true,
    integerDigits: 40,
    digitsOptional: true,
    allowPlus: false,
    allowMinus: false,
    clearMaskOnLostFocus: true,
    supportsInputType: ["text", "tel", "password"],
    'removeMaskOnSubmit': false

});
$('#txtshortname,#txtItemCode,#txtbiddescriptionP,#txtItemRemarks,#txtConversionRate,#txtPono,#txtItemCode,#txttat,#txtrfqSubject,#txtrfqdescription,#txtRFQReference,#txtedelivery,#txtvendorname,#AttachDescription1,#txtquestions,#txtreq').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
var totalFileSize = 0;
jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    //"Value cannot be {0}"
    "This field is required."
);
jQuery.validator.addMethod("dollarsscents", function (value, element) {
    return this.optional(element) || /^\d{0,18}(\.\d{0,3})?$/i.test(removeThousandSeperator(value));
}, "You must include three decimal places");
var FormWizard = function () {

    return {

        init: function () {

            if (!jQuery().bootstrapWizard) {

                return;

            }

            function format(state) {

                if (!state.id) return state.text; // optgroup

                return "<img class='flag' src='assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;

            }


            form.validate({

                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

                errorElement: 'span', //default input error message container

                errorClass: 'help-block help-block-error', // default input error message class

                focusInvalid: false, // do not focus the last invalid input

                rules: {

                    //First Tab
                    txtrfqSubject: {
                        required: true
                    },
                    txtenddatettime: {
                        required: true

                    },
                    txtrfqdescription: {
                        required: true
                    },
                    dropCurrency: {
                        required: true
                    },
                    txtConversionRate: {
                        required: true,
                        number: true,
                        minlength: 1,
                        maxlength: 7//3
                    },

                    file1: {
                        required: true
                    },
                    drp_TechnicalApp: {
                        required: true
                    },

                    //Second Tab

                    txtbiddescriptionP: {
                        required: true

                    },
                    txtedelivery: {
                        required: true

                    },
                    //dropuom: {
                    //    required: true
                    //},
                    txtUOM: {
                        required: true
                    },
                    txttargetprice: {
                        number: true,
                        dollarsscents: true
                    },
                    //txtlastinvoiceprice: {
                    //    number: true
                    //},
                    txtquantitiy: {
                        required: true,
                        maxlength: 18,
                        notEqualTo: 0,
                        dollarsscents: true
                    },
                    txtshortname: {
                        required: true,
                        maxlength: 200
                    },
                    txtItemCode: {
                        // required: true,
                        maxlength: 50
                    },
                    
                    txtPono: {
                        maxlength: 20,
                        /* required: true*/
                    },
                    txtunitrate: {
                        // required: true,
                        number: true,
                        dollarsscents: true
                    },
                    txtvendorname: {
                        // required: true
                    },
                    txtPODate: {
                        // required: true
                    },
                    txtpovalue: {
                        // required: true,
                        number: true,
                        dollarsscents: true
                    },
                    //Third Tab
                    AttachDescription1: {
                        required: true
                    }

                },

                messages: {

                },

                errorPlacement: function (error, element) {
                    if (element.attr("name") == "txtPODate") {
                        error.insertAfter("#daterr");
                    }
                    else {

                        error.insertAfter(element);

                    }

                    if ($("#txtPODate").closest('.input-group').attr('class') == 'input-group has-error') {

                        $("#btncal").css("margin-top", "-22px");

                    }

                },

                invalidHandler: function (event, validator) {

                },

                highlight: function (element) {

                    $(element)

                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');

                    $(element)

                        .closest('.col-md-4,.xyz,.col-md-2').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element)

                        .closest('.inputgroup').removeClass('has-error');
                    $(element)

                        .closest('.col-md-4,.xyz').removeClass('has-error');

                },

                success: function (label) {

                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {
                        label.closest('.inputgroup').removeClass('has-error').addClass('has-success');
                        label.closest('.col-md-4,.xyz').removeClass('has-error').addClass('has-success');
                        label.remove();

                    }
                    else {
                        label.addClass('valid').closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group
                        label.closest('.col-md-4,.xyz').removeClass('has-error').addClass('has-success'); // set success class to the control group

                    }

                },

                submitHandler: function (form) {
                    // success.show();
                    error.hide();
                }
            });



            var displayConfirm = function () {
                $('#tab4 .form-control-static', form).each(function () {

                    var input = $('[name="' + $(this).attr("data-display") + '"]', form);

                    if (input.is(":radio")) {

                        input = $('[name="' + $(this).attr("data-display") + '"]:checked', form);

                    }

                    if (input.is(":text") || input.is("textarea")) {

                        $(this).html(input.val());

                    } else if (input.is("select")) {

                        $(this).html(input.find('option:selected').text());

                    } else if (input.is(":radio") && input.is(":checked")) {

                        $(this).html(input.attr("data-title"));

                    } else if ($(this).attr("data-display") == 'payment') {

                        var payment = [];

                        $('[name="payment[]"]:checked').each(function () {

                            payment.push($(this).attr('data-title'));

                        });

                        $(this).html(payment.join("<br>"));

                    }

                });

            }



            var handleTitle = function (tab, navigation, index) {

                var total = navigation.find('li').length;

                var current = index + 1;

                // set wizard title

                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);

                // set done steps

                jQuery('li', $('#form_wizard_1')).removeClass("done");

                var li_list = navigation.find('li');

                for (var i = 0; i < index; i++) {

                    jQuery(li_list[i]).addClass("done");

                }



                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();

                } else {
                    $('#form_wizard_1').find('.button-previous').show();

                }

                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();

                    displayConfirm();

                } else {

                    $('#form_wizard_1').find('.button-next').show();

                    $('#form_wizard_1').find('.button-submit').hide();

                }

                Metronic.scrollTo($('.page-title'));

            }



            // default form wizard

            $('#form_wizard_1').bootstrapWizard({

                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',

                onTabClick: function (tab, navigation, index, clickedIndex) {
                    return false;
                },

                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();
                    if (index == 1) {

                        var StartDT = new Date($('#txtstartdatettime').val().replace('-', ''));
                        var EndDT = new Date($('#txtenddatettime').val().replace('-', ''));
                        var CurDateonly = new Date(currentdate.toDateString())
                        var StartDTdateonly = new Date(StartDT.toDateString())
                        var BidOpenDate = new Date($('#txtbidopendatetime').val().replace('-', ''));
                        if (form.valid() == false) {
                            return false;

                        }
                        else if ($('#txtenddatettime').val() == '') {
                            $('.alert-danger').show();
                            $('#txtenddatettime').closest('.inputgroup').addClass('has-error');
                            $('#spandanger').html('Please Enter RFQ END Date');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(7000);
                            return false;

                        }
                        else if ($('#txtstartdatettime').val() != '' && StartDTdateonly < CurDateonly) {
                            $('.alert-danger').show();
                            $('#txtstartdatettime').closest('.inputgroup').addClass('has-error');
                            $('#spandanger').html('Start Date Time must greater than Current Date Time.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(7000);
                            $('#txtstartdatettime').val();
                            return false;
                        }
                        else if ($('#txtstartdatettime').val() != '' && EndDT < StartDT) {
                            $('.alert-danger').show();
                            $('#txtenddatettime').closest('.inputgroup').addClass('has-error');
                            $('#spandanger').html('End Date Time must greater than Start Date Time ');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(7000);
                            $('#txtenddatettime').val('')
                            return false;
                        }
                        else if (EndDT < currentdate) {
                            $('.alert-danger').show();
                            $('#txtenddatettime').closest('.inputgroup').addClass('has-error');
                            $('#spandanger').html('End Date Time must greater than Current Date Time.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(7000);
                            $('#txtenddatettime').val('')
                            return false;
                        }
                        else if ($('#tblapprovers >tbody >tr').length == 0) {
                            $('.alert-danger').show();
                            $('#spandanger').html('Please  Map Commercial Approver.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

                        }
                        /*else if (($('#tblapprovers >tbody >tr').length == 0 || $('#tblapproverstech >tbody >tr').length == 0) && ($('#drp_TechnicalApp').val().toLowerCase() == "rfq" || $('#drp_TechnicalApp').val().toLowerCase() == "afterrfq")) {
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Map Approver.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

                        }*/
                        //new 
                        else if ($('#txtbidopendatetime').val() != '' && BidOpenDate < EndDT) {
                            $('.alert-danger').show();
                            $('#txtbidopendatetime').closest('.inputgroup').addClass('has-error');
                            $('#spandanger').html('Bid Cannot be opened before Submission Date ');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(7000);
                            $('#txtbidopendatetime').val('')
                            return false;
                        }
                        else {
                            InsUpdRFQDEtailTab1()

                        }

                    } else if (index == 2) {
                        if ($('#tblServicesProduct >tbody >tr').length == 0) {
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Configure RFQ Parameters.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

                        }
                        else {
                            InsUpdRFQDEtailTab2()
                        }

                    }
                    else if (index == 3) {
                        if ($('#tblServicesProduct >tbody >tr').length == 0) {
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Configure RFQ Parameters.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

                        }
                        else if (jQuery('#fileToUpload1').val() != "") {
                            $('.alert-danger').show();
                            $('#spandanger').html('Your file is not attached. Please do press "+" button after uploading the file.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(7000);
                            return false;
                        }
                        else {
                            fnsavetermscondition('N');
                            fnsaveAttachmentsquestions();
                        }
                    }
                    handleTitle(tab, navigation, index);

                },

                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();
                    handleTitle(tab, navigation, index);

                },

                onTabShow: function (tab, navigation, index) {

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;

                    $('#form_wizard_1').find('.progress-bar').css({
                        width: $percent + '%'
                    });
                }

            });

            $('#form_wizard_1').find('.button-previous').hide();

            $('#form_wizard_1 .button-submit').click(function () {
                if ($('#tblServicesProduct > tbody >tr').length == 0) {
                    $('#form_wizard_1').bootstrapWizard('previous');
                    error.show();

                    $('#spandanger').html('Please Configure RFQ Parameters.')
                    error.fadeOut(3000)
                    return false;

                }
                else if (ValidateVendor() == 'false') {
                    return false;
                }
                else {
                    RFQInviteVendorTab3();
                    fetchPSBidDetailsForPreview()
                    return true;
                }

            }).hide();

            jQuery.unblockUI();
        }

    };

}();

var ItemDetails = [];
sessionStorage.setItem('hddnRFQID', 0)

function InsUpdRFQDEtailTab1() {

    var _cleanString = StringEncodingMechanism(jQuery("#txtrfqSubject").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtrfqdescription").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';

    if ($('#attach-file').html() != '' && $('#file1').val() == '') {
        TermsConditionFileName = $.trim(jQuery('#attach-file').html());
    } else {
        TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
    }
    TermsConditionFileName = TermsConditionFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters

    var approvers = [];
    var rowCount = jQuery('#tblapprovers >tbody >tr').length;
    if (rowCount >= 1) {
        jQuery('#tblapprovers >tbody >tr').each(function () {
            var this_row = $(this);

            var app = {
                "UserID": parseInt($.trim(this_row.find('td:eq(3)').html())),
                "ApproverType": 'C',
                "AdminSrNo": parseInt($.trim(this_row.find('td:eq(2)').html())),
                "ShowQuotedPrice": 'N'
            };
            approvers.push(app)
        })
    }
    var rowCounttech = jQuery('#tblapproverstech >tbody >tr').length;

    var showP = 'Y';
    if (rowCounttech >= 1) {
        $("#tblapproverstech >tbody >tr").each(function () {
            var this_row = $(this);
            showP = 'Y';

            if (!$("#chkshowp" + $.trim(this_row.find('td:eq(3)').html())).is(":checked")) {
                showP = 'N';
            }
            var app = {
                "UserID": parseInt($.trim(this_row.find('td:eq(3)').html())),
                "ApproverType": 'T',
                "AdminSrNo": parseInt($.trim(this_row.find('td:eq(2)').html())),
                "ShowQuotedPrice": showP
            };
            approvers.push(app)
        })
    }





    var StartDT = new Date();
    if ($('#txtstartdatettime').val() != null && $('#txtstartdatettime').val() != "") {
        StartDT = new Date($('#txtstartdatettime').val().replace('-', ''));
    }
    var BidOpenDate = null;
    if ($('#txtbidopendatetime').val() != null && $('#txtbidopendatetime').val() != "") {
        BidOpenDate = new Date($('#txtbidopendatetime').val().replace('-', ''));
    }


    var EndDT = new Date($('#txtenddatettime').val().replace('-', ''));
    var RFQBidType = "Closed";
    var TechnicalAppr = "Not Required";

    
    var Tab1Data = {

        "RFQId": parseInt(sessionStorage.getItem('hddnRFQID')),
        //"RFQSubject": jQuery("#txtrfqSubject").val(),
        "RFQSubject": _cleanString,
        // "RFQStartDate": dt,
        "RFQStartDate": StartDT, //jQuery("#txtstartdatettime").val() == '' ? 'x' : jQuery("#txtstartdatettime").val(),
        "RFQEndDate": EndDT,//jQuery("#txtenddatettime").val(),
        //"RFQDescription": jQuery("#txtrfqdescription").val(),
        "RFQDescription": _cleanString2,
        "RFQCurrencyId": parseInt(jQuery("#dropCurrency").val()),
        "RFQConversionRate": parseFloat(jQuery("#txtConversionRate").val()),
        "RFQTermandCondition": TermsConditionFileName,
        "UserId": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "RFQReference": $("#txtRFQReference").val(),
        "bidopeningdate": BidOpenDate,
        "RFQBidType": RFQBidType,
        "RFQApprovers": approvers,
        //"TechnicalApproval": $("#drp_TechnicalApp").val()
        "TechnicalApproval": TechnicalAppr

    };


    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eInsUpdRequestForQuotation",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab1Data),
        dataType: "json",
        success: function (data) {

            sessionStorage.setItem('hddnRFQID', parseInt(data))

            //** Upload Files on Azure PortalDocs folder
            if ($('#file1').val() != '') {
                fnUploadFilesonAzure('file1', TermsConditionFileName, 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }


    });
    jQuery.unblockUI();
}
function InsUpdRFQDEtailTab2() {
    var _cleanString9 = StringEncodingMechanism($.trim(this_row.find('td:eq(12)').html()));

    var tab2Items = '', ItemDetails = [];
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var rowCount = jQuery('#tblServicesProduct tr').length;
    if (rowCount > 1) {
        $("#tblServicesProduct tr:gt(0)").each(function () {

            targetPrice = 0, TAT = 0;
            unitrate = 0;
            povalue = 0, i = 1, tab2Data = '';
            var this_row = $(this);
            if ($.trim(this_row.find('td:eq(4)').html()) != '') {
                targetPrice = $.trim(this_row.find('td:eq(4)').html());
            }
            if ($.trim(this_row.find('td:eq(9)').html()) != '') {
                TAT = $.trim(this_row.find('td:eq(9)').html());
            }
            if ($.trim(this_row.find('td:eq(13)').html()) != '') {
                unitrate = removeThousandSeperator($.trim(this_row.find('td:eq(13)').html()));
            }
            if ($.trim(this_row.find('td:eq(15)').html()) != '') {
                povalue = removeThousandSeperator($.trim(this_row.find('td:eq(15)').html()));
            }

            var PODt = new Date($.trim(this_row.find('td:eq(14)').html()))
            PODt = PODt.toDateString();


            var remark = StringEncodingMechanism($.trim(this_row.find('td:eq(10)').html()).replace(/'/g, ""));
            var description = StringEncodingMechanism($.trim(this_row.find('td:eq(7)').html()).replace(/'/g, ""));

            var _cleanString3 = StringEncodingMechanism($.trim(this_row.find('td:eq(3)').html()));


            tab2Items = {
                "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
                "ItemCode": $.trim(this_row.find('td:eq(2)').html()),
                //"ShortName": $.trim(this_row.find('td:eq(3)').html()),
                "ShortName": _cleanString3,
                "Description": description,
                "Targetprice": parseFloat(removeThousandSeperator(targetPrice)),
                "Quantity": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(5)').html()))),
                "UOM": $.trim(this_row.find('td:eq(6)').html()),
                "DeliveryLocation": $.trim(this_row.find('td:eq(8)').html()),
                "TAT": parseInt(TAT),
                "Remarks": remark,
                "PoUnitRate": parseFloat(unitrate),
                "PoNo": $.trim(this_row.find('td:eq(11)').html()),
                //"PoVendorName": $.trim(this_row.find('td:eq(12)').html()),
                "PoVendorName": _cleanString9,
                "PoDate": $.trim(this_row.find('td:eq(14)').html()),
                "PoValue": parseFloat(removeThousandSeperator(povalue))
            }
            ItemDetails.push(tab2Items)
        })
    }
    var Tab2data = {
        "ProductDetails": ItemDetails,
        "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
        "UserID": sessionStorage.getItem('UserID')

    };


    console.log(JSON.stringify(Tab2data))

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRequestForQuotationTab2/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab2data),
        dataType: "json",
        success: function (data) {
            if (parseInt(data) > 0) {

                return true;
            }
            else {
                return false;

            }

        },

        error: function (xhr, status, error) {
            var err = xhr.responseText;// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();

            return false;
        }

    });

    jQuery.unblockUI();
}



function fnGetTermsCondition() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/efetchRFQTermsANDCondition/?ConditionType=" + $('#ddlConditiontype option:selected').val() + "&RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            jQuery("#tblTermsCondition").empty();
            jQuery("#tbltermsconditionprev").empty();
            if (data.length > 0) {
                $('#btnS').removeAttr('disabled')
                jQuery('#tbltermsconditionprev').append("<thead><tr><th class='bold hide'>Type</th><th class='bold'>Name</th><th>Level</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {

                    var str = "<tr id=tr" + i + "><td class=hide>" + data[i].id + "</td><td class=hide>" + data[i].level + "</td>";
                    str += "<td style='width:10%'><div class=\"checker\" id=\"uniform-chkbidTypesTerms\"><span  class='checked' id=\"spancheckedTerms" + data[i].id + "\" ><input type=\"checkbox\" Onclick=\"CheckTerms(this,\'" + data[i].id + "'\)\"; id=\"chkTerms" + data[i].id + "\" value=" + (data[i].id) + " style=\"cursor:pointer\" name=\"chkvenderTerms\" checked /></span></div></td>";
                    str += "<td>" + data[i].name + "</td>";


                    var strPrev = "<tr><td>" + data[i].name + "</td>";

                    str += "<td style='width:20%'><div class='md-radio-list'><label class='md-radio-inline'><input style='width:16px!important;height:16px!important;' type='radio' name=level" + i + " id=levelR" + i + " class='md-radio' disabled/></label> &nbsp;<span>RFQ</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><label class='md-radio-inline'><input style='width:16px!important;height:16px!important;' type='radio' class='md-radio' name=level" + i + " id=levelI" + i + " disabled/></label> &nbsp;<span>Item</span></div></td>"
                    str += "<td><input type='text' name=rem" + i + " id=rem" + i + " class='form-control' placeholder='Your requirement' maxlength=100 value='" + data[i].requirement + "' disabled  autocomplete='off'  onkeyup='replaceQuoutesFromString(this)' /></td></tr>"


                    if (data[i].isDefault == "N" || data[i].isDefault == "Y") {
                        jQuery('#tblTermsCondition').append(str);

                    }
                    $('#rem' + i).maxlength({
                        limitReachedClass: "label label-danger",
                        alwaysShow: true
                    });
                    if (data[i].level == "R") {
                        strPrev += "<td>RFQ</td></tr>";
                        $("#levelR" + i).attr("checked", "checked");
                        $("#levelI" + i).removeAttr("checked");
                        $("#rem" + i).removeAttr("disabled");
                    }
                    else {
                        strPrev += "<td>Item</td></tr>";
                        $("#levelR" + i).removeAttr("checked");
                        $("#levelI" + i).prop("checked", true);
                        $("#rem" + i).prop("disabled");
                    }

                    if (data[i].isChecked == "Y") {
                        $("#spancheckedTerms" + data[i].id).addClass("checked");
                        jQuery('#tbltermsconditionprev').append(strPrev);
                    }
                    else {
                        $("#spancheckedTerms" + data[i].id).removeClass("checked");
                    }
                    if (data[i].isDefault == "Y") {

                        $("#spancheckedTerms" + data[i].id).addClass("checked");
                        $("#chkTerms" + data[i].id).attr("disabled", "disabled");
                    }

                }
            }
            else {
                jQuery('#tblTermsCondition').append('<tr><td>No Terms & Condition</td></tr>')

                $('#btnS').attr('disabled', 'disabled')
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }


    })
}
function fnheckAllTerms() {

    if ($("#chkAllTerms").is(':checked') == true) {

        $('table#tblTermsCondition').closest('.inputgroup').removeClass('has-error');
        $("#spancheckedTermsall").addClass("checked");

        $("#tblTermsCondition> tbody > tr").each(function (index) {
            $(this).find("span#spancheckedTerms").addClass("checked");
            $('input[name="chkvenderTerms"]').prop('disabled', true);


        });
    }
    else {
        $("#spancheckedTermsall").removeClass("checked");
        $("#tblTermsCondition> tbody > tr").each(function (index) {
            $(this).find("span#spancheckedTerms").removeClass("checked");
            $('input[name="chkvenderTerms"]').prop('disabled', false);

        });

    }


}
function CheckTerms(event, ID) {

    if ($('#spancheckedTerms' + ID).attr('class') == 'checked') {
        $('#spancheckedTerms' + ID).removeClass("checked")
    }
    else {
        $('#spancheckedTerms' + ID).addClass("checked")

    }

}
function fnsavetermscondition(isbuttonclick) {
    var checkedValue = '2~I~#';
    var checkedOtherTerms = '';
    $("#tblTermsCondition> tbody > tr").each(function (index) {
        var this_row = $(this);
        if ($(this).find('span').attr('class') == 'checked') {
            if ($.trim(this_row.find('td:eq(0)').text()) != '2' && $.trim(this_row.find('td:eq(0)').text()) != '0') {
                checkedValue = checkedValue + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim(this_row.find('td:eq(1)').html()) + '~' + $.trim(this_row.find('td:eq(5) input[type="text"]').val()) + '#'
            }
            //if ($.trim(this_row.find('td:eq(0)').text()) == '0') {
            //    checkedOtherTerms = checkedOtherTerms + $.trim(this_row.find('td:eq(3) input[type="text"]').val()) + '~' + $.trim(this_row.find('td:eq(1)').html()) + '~' + $.trim(this_row.find('td:eq(5) input[type="text"]').val()) + '#'
            //}
            //checkedValue = checkedValue + "  select " + sessionStorage.getItem('hddnRFQID') + ",'" + jQuery("#ddlConditiontype").val() + "'," + $.trim(this_row.find('td:eq(0)').html()) + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "','" + $.trim(this_row.find('td:eq(5) input[type="text"]').val()) + "' union all ";
        }
    });
    if (checkedValue != '') {
        var Attachments = {
            "RFQId": parseInt(sessionStorage.getItem('hddnRFQID')),
            "QueryString": checkedValue,
            "ConditionType": jQuery("#ddlConditiontype").val(),
            "OtherTermsCondition": checkedOtherTerms
        }

        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eInsTermsCondition",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Attachments),
            dataType: "json",
            success: function (data) {


                fnGetTermsCondition();
                if (isbuttonclick == 'Y') {
                    $('.alert-success').show();
                    $('#spansuccess1').html('Terms & Condition saved successfully!');
                    Metronic.scrollTo($(".alert-success"), -200);
                    $('.alert-success').fadeOut(7000)
                }



            },
            error: function (xhr, status, error) {
                var err = xhr.responseText //eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', 'form_wizard_1');
                }
                jQuery.unblockUI();
                return false;

            }

        });
    }
    else {
        $('.alert-danger').show();
        $('#spandanger').html('Please Check Terms & Condition properly!');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000)
    }
}
function fnsaveAttachmentsquestions() {
    var attchquery = '';
    var quesquery = '';
    $("#tblAttachments> tbody > tr").each(function (index) {
        var this_row = $(this);
        attchquery = attchquery + $.trim(this_row.find('td:eq(1)').text()) + '~' + $.trim(this_row.find('td:eq(0)').text()) + '#';

    });
    $("#tblquestions> tbody > tr").each(function (index) {
        var this_row = $(this);
        quesquery = quesquery + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim(this_row.find('td:eq(1)').html()) + '#';

    });
    var data = {
        "RFQId": parseInt(sessionStorage.getItem('hddnRFQID')),
        "AttachString": attchquery,
        "QuesString": quesquery
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eInsQuestionsAttachments",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            fetchAttachments();
            GetQuestions();
            return;
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
var rowAttach = 0;

function addmoreattachments() {

    if (jQuery("#AttachDescription1").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter Attachment Description');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (jQuery('#fileToUpload1').val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Attach File Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else {
        var attchname = jQuery('#fileToUpload1').val().substring(jQuery('#fileToUpload1').val().lastIndexOf('\\') + 1)
        attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
        var num = 0;
        var maxinum = 0;
        $("#tblAttachments tr:gt(0)").each(function () {
            var this_row = $(this);

            num = (this_row.closest('tr').attr('id')).substring(10, (this_row.closest('tr').attr('id')).length)
            if (parseInt(num) > parseInt(maxinum)) {
                maxinum = num;
            }
        });

        rowAttach = parseInt(maxinum) + 1;
        if (!jQuery("#tblAttachmentsPrev thead").length) {
            jQuery('#tblAttachmentsPrev').append("<thead><tr><th class='bold'>Attachment Description</th><th class='bold'>Attachment</th></tr></thead>");
            var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        }
        else {
            var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        }


        strprev += '<td class=style="width:47%!important"><a id=aeRFQFilePrev' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + attchname + '</a></td>';
        jQuery('#tblAttachmentsPrev').append(strprev);


        var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        str += '<td class=hide>' + attchname + '</td>'

        str += '<td class=style="width:47%!important"><a id=aeRFQFile' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + attchname + '</a></td>';

        str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + attchname + '\',aeRFQFile' + rowAttach + ',0)" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblAttachments').append(str);
        fnUploadFilesonAzure('fileToUpload1', attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));

        //** function to insert record in DB after file upload on Blob
        fnsaveAttachmentsquestions();

        //var arr = $("#tblAttachments tr");

        //$.each(arr, function (i, item) {
        //    var currIndex = $("#tblAttachments tr").eq(i);
        //    var matchText = currIndex.find("td:eq(1)").text().toLowerCase();

        //    if (rowAttach == 1) {
        //        //** Upload Files on Azure PortalDocs folder first Time
        //        fnUploadFilesonAzure('fileToUpload1', attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));
        //     }

        //    $(this).nextAll().each(function (i, inItem) {
        //        if (matchText == $(this).find("td:eq(1)").text().toLowerCase()) {
        //            $(this).remove();
        //        }
        //        if (matchText != $(this).find("td:eq(1)").text().toLowerCase()) {
        //                //** Upload Files on Azure PortalDocs folder
        //             fnUploadFilesonAzure('fileToUpload1', attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));

        //        }


        //    });

        //});
        jQuery("#AttachDescription1").val('')
        jQuery('#fileToUpload1').val('')


    }
}
function deleteattachrow(rowid, rowidPrev, filename, aID, srno) {

    rowAttach = rowAttach - 1;
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();


    //** File delete from Blob or DB 
    ajaxFileDelete('', '', filename, 'eRFQAttachment', aID, srno)
}

function fetchAttachments() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            var attach = "";
            rowAttach = 0;
            jQuery("#tblAttachments").empty();
            jQuery("#tblAttachmentsPrev").empty();
            if (data[0].attachments.length > 0) {

                jQuery('#tblAttachmentsPrev').append("<thead><tr><th class='bold'>Attachment Description</th><th class='bold'>Attachment</th></tr></thead>");
                for (var i = 0; i < data[0].attachments.length; i++) {
                    rowAttach = rowAttach + 1;
                    attach = data[0].attachments[i].rfqAttachment.replace(/\s/g, "%20");
                    var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important" >' + data[0].attachments[i].rfqAttachmentDescription + '</td>';

                    strprev += '<td class=style="width:47%!important"><a id=aeRFQFilePrev' + rowAttach + '  style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + data[0].attachments[i].rfqAttachment + '</a></td>';
                    jQuery('#tblAttachmentsPrev').append(strprev);

                    var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + data[0].attachments[i].rfqAttachmentDescription + '</td>';
                    str += '<td class=style="width:47%!important"><a id=aeRFQFile' + rowAttach + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + data[0].attachments[i].rfqAttachment + '</a></td>';
                    str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"   onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + data[0].attachments[i].rfqAttachment + '\',aeRFQFile' + rowAttach + ',\'' + data[0].attachments[i].srNo + '\')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
                    jQuery('#tblAttachments').append(str);

                }
            }



        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" +  + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}

var rowques = 0;
function addquestions() {
    if (jQuery("#txtquestions").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter Questions');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (jQuery("#txtreq").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter Requirement');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else {
        var num = 0;
        var maxinum = 0;
        $("#tblquestions tr:gt(0)").each(function () {
            var this_row = $(this);

            num = (this_row.closest('tr').attr('id')).substring(8, (this_row.closest('tr').attr('id')).length)

            if (parseInt(num) > parseInt(maxinum)) {
                maxinum = num;
            }
        });

        rowques = parseInt(maxinum) + 1;
        if (!jQuery("#tblQuestionsPrev thead").length) {
            jQuery('#tblQuestionsPrev').append("<thead><tr><th class='bold' style='width:50%!important'>Questions</th><th class='bold' style='width:50%!important'>Requirement</th></tr></thead>");
        }
        var strprev = '<tr id=trquesidprev' + rowques + ' ><td>' + jQuery("#txtquestions").val() + '</td>';
        strprev += "<td>" + jQuery("#txtreq").val() + "</td></tr>"

        jQuery('#tblQuestionsPrev').append(strprev);

        if (!jQuery("#tblquestions thead").length) {
            jQuery('#tblquestions').append("<thead><tr><th class='bold' style='width:54.9%!important'>Questions</th><th class='bold' style='width:35%!important'>Requirement</th><th style='width:5%!important'></th></tr></thead>");
        }
        var str = '<tr id=trquesid' + rowques + ' ><td>' + jQuery("#txtquestions").val() + '</td>';
        str += "<td>" + jQuery("#txtreq").val() + "</td>"
        str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deletequesrow(trquesid' + rowques + ',trquesidprev' + rowques + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblquestions').append(str);
        jQuery("#txtquestions").val('')
        jQuery("#txtreq").val('')
    }
}
function deletequesrow(rowid, rowidPrev) {
    rowques = rowques - 1;
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();
}
function GetQuestions() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            jQuery("#tblquestions").empty();
            jQuery("#tblQuestionsPrev").empty();
            if (data[0].questions.length > 0) {
                jQuery('#tblquestions').append("<thead><tr><th class='bold' style='width:54.9%!important'>Questions</th><th class='bold' style='width:35%!important'>Requirement</th><th style='width:5%!important'></th></tr></thead>");
                jQuery('#tblQuestionsPrev').append("<thead><tr><th class='bold' style='width:50%!important'>Questions</th><th class='bold' style='width:50%!important'>Requirement</th></tr></thead>");
                for (var i = 0; i < data[0].questions.length; i++) {
                    str = '<tr id=trquesid' + (i + 1) + '><td>' + data[0].questions[i].rfqQuestions + '</td>';
                    str += "<td>" + data[0].questions[i].rfqQuestionsRequirement + "</td>";
                    str += '<td><button type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deletequesrow(trquesid' + (i + 1) + ',trquesidprev' + (i + 1) + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
                    jQuery('#tblquestions').append(str);

                    strp = '<tr id=trquesidprev' + (i + 1) + '><td>' + data[0].questions[i].rfqQuestions + '</td>';
                    strp += "<td>" + data[0].questions[i].rfqQuestionsRequirement + "</td></tr>";
                    jQuery('#tblQuestionsPrev').append(strp);


                }
            }
            else {
                jQuery('#tblQuestionsPrev').append("<tr><td>No Questions Mapped!!</td></tr>")
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }
    })
}

var allUsers
function fetchRegisterUser() {
    var data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "Isactive": "N"
    } 
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&Isactive=N",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                allUsers = data;
            }
            else {
                allUsers = '';
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
jQuery("#txtApprover").keyup(function () {
    sessionStorage.setItem('hdnApproverid', '0');

});
sessionStorage.setItem('hdnApproverid', 0);
jQuery("#txtApprover").typeahead({
    source: function (query, process) {
        var data = allUsers;
        usernames = [];
        map = {};
        var uname = "";
        jQuery.each(data, function (i, username) {
            // map[username.userName] = username;
            // usernames.push(username.userName);
            uname = username.userName + ' (' + username.emailID + ')'
            map[uname] = username;
            usernames.push(uname);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].userID != "0") {
            sessionStorage.setItem('hdnApproverid', map[item].userID);
            // fnApproversQuery(map[item].emailID, map[item].userID, map[item].userName);
        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver');
        }

        return item;
    }

});
function fnapptype() {
    jQuery("#txtApprover").val('')
    sessionStorage.setItem('hdnApproverid', '0');
}
function fnTocheckAproverMapp() {
    jQuery("#txtApprover").val('')
    sessionStorage.setItem('hdnApproverid', '0');
    if ($('#drp_TechnicalApp').val() == "RFQ" || $('#drp_TechnicalApp').val() == "AfterRFQ") {
        $('#ddlapprovertype').val('T');
        $('#ddlapprovertype').removeAttr('disabled');

    }
    else {
        $('#ddlapprovertype').val('C');
        $('#ddlapprovertype').attr('disabled', 'disabled');
        if (jQuery("#tblapproverstech thead").length) {
            bootbox.dialog({
                message: "By changing Technical Approval as Not Required,  Technical Approvers would be delete. Do you want to continue?",
                // title: "Custom title",
                buttons: {
                    confirm: {
                        label: "Yes",
                        className: "btn-success",
                        callback: function () {
                            $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                            deleteTechnicalApprovers();
                        }
                    },
                    cancel: {
                        label: "No",
                        className: "btn-warning",
                        callback: function () {
                            $('#drp_TechnicalApp').val('')
                            //$('#form_wizard_1').bootstrapWizard('previous');
                        }
                    }
                }
            });
        }
    }
}
function deleteTechnicalApprovers() {
    TechApp = 0;
    jQuery("#tblapproverstech").empty();
    jQuery("#tblapproversPrevtech").empty();
}

var commApp = 0;
var TechApp = 0;
var commAppsrno = 0;
var TechAppsrno = 0;
function fnApproversQuery() {
    var num = 0;
    var maxinum = 0;
    var status = "true";
    var UserID = sessionStorage.getItem('hdnApproverid');
    var UserName = jQuery("#txtApprover").val();
    if ($('#ddlapprovertype').val() == "C") {
        $("#tblapprovers tr:gt(0)").each(function () {
            var this_row = $(this);

            if ($.trim(this_row.find('td:eq(3)').html()) == sessionStorage.getItem('hdnApproverid')) {// && $('#ddlapprovertype').val() == $.trim(this_row.find('td:eq(7)').html())) {
                status = "false"
            }
        });
    }
    else {
        $("#tblapproverstech tr:gt(0)").each(function () {
            var this_row = $(this);

            if ($.trim(this_row.find('td:eq(3)').html()) == sessionStorage.getItem('hdnApproverid')) {
                status = "false"
            }
        });
    }

    if (UserID == "0" || jQuery("#txtApprover").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('Approver is already mapped for ' + $('#ddlapprovertype option:selected').text() + ' RFQ.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        $("#txtApprover").val('')
        return false;
    }
    else {

        if ($('#ddlapprovertype').val() == "C") {
            commApp = commApp + 1;
            commAppsrno = commAppsrno + 1;

            if (!jQuery("#tblapprovers thead").length) {
                jQuery("#tblapprovers").append("<thead><tr><th colspan=4  style='text-align:center;' class='bold'>Commercial Approver(s)</th></tr><tr><th style='width:5%!important'></th><th class='bold' style='width:60%!important'>Approver</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
                jQuery("#tblapprovers").append('<tr id=trAppid' + commApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + commApp + ',trAppidPrev' + commApp + ',\'C\')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + commAppsrno + '</td><td class=hide>' + UserID + '</td></tr>');
            }
            else {
                jQuery("#tblapprovers").append('<tr id=trAppid' + commApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + commApp + ',trAppidPrev' + commApp + ',\'C\')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + commAppsrno + '</td><td class=hide>' + UserID + '</td></tr>');
            }

            $('#wrap_scrollerPrevApp').show();

            if (!jQuery("#tblapproversPrev thead").length) {

                jQuery("#tblapproversPrev").append("<thead><tr><th colspan=2  style='text-align:center;' class='bold' >Commercial Approver(s)</th></tr><tr><th class='bold' style='width:60%!important'>Approver</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
                jQuery("#tblapproversPrev").append('<tr id=trAppidPrev' + commApp + '><td>' + UserName + '</td><td>' + commApp + '</td></tr>');
            }
            else {
                jQuery("#tblapproversPrev").append('<tr id=trAppidPrev' + commApp + '><td>' + UserName + '</td><td>' + commApp + '</td></tr>');
            }
        }
        else {
            TechApp = TechApp + 1;
            TechAppsrno = TechAppsrno + 1;
            jQuery("#tblapproverstech").removeClass('hide')
            jQuery("#tblapproversPrevtech").removeClass('hide')
            if (!jQuery("#tblapproverstech thead").length) {
                jQuery("#tblapproverstech").append("<thead><tr><th colspan=5  style='text-align:center;' class='bold' >Technical Approver(s)</th></tr><tr><th style='width:5%!important'></th><th class='bold' style='width:60%!important'>Approver</th><th class='bold' style='width:15%!important'>Sequence</th><th class='bold' style='width:5%!important'>Show Price</th></tr></thead>");
                jQuery("#tblapproverstech").append('<tr id=trAppidtech' + TechApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppidtech' + TechApp + ',trAppidPrevtech' + TechApp + ',\'T\')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + TechAppsrno + '</td><td class=hide>' + UserID + '</td><td><div class=\"checker\" id=\'uniform-chkbidTypestech\' ><span  id=\'spancheckedtech\' ><input type=\'checkbox\'   id=\'chkshowp' + UserID + '\'  style=\'cursor:pointer\' name=\'chkshowP\' onclick="Checktechapp(this,' + TechApp + ')" /></span></div></td></tr>'); /*class=checked*/
            }
            else {
                jQuery("#tblapproverstech").append('<tr id=trAppidtech' + TechApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppidtech' + TechApp + ',trAppidPrevtech' + TechApp + ',\'T\')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + TechAppsrno + '</td><td class=hide>' + UserID + '</td><td><div class=\"checker\" id=\'uniform-chkbidTypestech\' ><span  id=\'spancheckedtech\' ><input type=\'checkbox\'   id=\'chkshowp' + UserID + '\'  style=\'cursor:pointer\' name=\'chkshowP\' onclick="Checktechapp(this,' + TechApp + ')" /></span></div></td></tr>');
            }

            $('#wrap_scrollerPrevApptech').show();

            if (!jQuery("#tblapproversPrevtech thead").length) {

                jQuery("#tblapproversPrevtech").append("<thead><tr><th colspan=3  style='text-align:center;' class='bold' >Technical Approver(s)</th></tr><tr><th class='bold' style='width:60%!important'>Approver</th><th class='bold' style='width:15%!important'>Sequence</th><th class='bold'>Show Price</th></tr></thead>");
                jQuery("#tblapproversPrevtech").append('<tr id=trAppidPrevtech' + TechApp + '><td>' + UserName + '</td><td>' + TechAppsrno + '</td><td id=tdshowp' + TechApp + '></td></tr>');
            }
            else {
                jQuery("#tblapproversPrevtech").append('<tr id=trAppidPrevtech' + TechApp + '><td>' + UserName + '</td><td>' + TechAppsrno + '</td><td id=tdshowp' + TechApp + '></td></tr>');
            }
            $('#tdshowp' + TechApp).text('No');
        }
        jQuery("#txtApprover").val('');
        sessionStorage.setItem('hdnApproverid', '0')

    }
}
function deleteApprow(rowid, rowidPrev, apptype) {
    var i = 1;
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();

    if (apptype == "C") {
        //commApp = commApp - 1;
        commAppsrno = commAppsrno - 1;
        var rowCount = jQuery('#tblapprovers tr').length;
        if (rowCount > 1) {
            i = 0;
            $("#tblapprovers tr:gt(0)").each(function () {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(2)').html(i));
                i++;
            });
            i = 0;
            $("#tblapproversPrev tr:gt(0)").each(function () {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(1)').html(i));
                i++;
            });
        }
    }
    else {
        // TechApp = TechApp - 1;
        TechAppsrno = TechAppsrno - 1;
        var rowCount = jQuery('#tblapproverstech tr').length;
        if (rowCount > 1) {
            i = 0;
            $("#tblapproverstech tr:gt(0)").each(function () {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(2)').html(i));
                i++;
            });
            i = 0;
            $("#tblapproversPrevtech tr:gt(0)").each(function () {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(1)').html(i));
                i++;
            });
        }
    }

}
function fnGetApprovers() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var str = "";
            var strP = "";
            var strtech = "";
            var strPtech = "";

            commApp = 0; TechApp = 0;
            commAppsrno = 0; TechAppsrno = 0;
            jQuery("#tblapprovers").empty();
            jQuery("#tblapproversPrev").empty();
            if (data[0].approvers.length > 0) {

                if (sessionStorage.getItem('CustomerID') == 32) {
                    $('#Addbtn1').attr('disabled', 'disabled')
                }
                else {
                    $('#Addbtn1').removeAttr('disabled')
                }


                jQuery('#tblapprovers').append("<thead><tr><th colspan=4  style='text-align:center;' class='bold' >Commercial Approver(s)</th></tr><tr><th style='width:5%!important'></th><th class='bold' style='width:60%!important'>Approver</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
                jQuery('#tblapproversPrev').append("<thead><tr><th colspan=2 style='text-align:center;' class='bold' >Commercial Approver(s)</th></tr><tr><th class='bold' style='width:60%!important'>Approver</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");

                jQuery('#tblapproverstech').append("<thead><th colspan=5 style='text-align:center;' class='bold' >Technical Approver(s)</th><tr><th style='width:5%!important'></th><th class='bold' style='width:60%!important'>Approver</th><th class='bold' style='width:15%!important'>Sequence</th><th class='bold' style='width:5%!important'>Show Price</th></tr></thead>");
                jQuery('#tblapproversPrevtech').append("<thead><th colspan=3 style='text-align:center;' class='bold' >Technical Approver(s)</th><tr><th class='bold' style='width:60%!important'>Approver</th><th class='bold' style='width:15%!important'>Sequence</th><th class='bold' style='width:5%!important'>Show Price</th></tr></thead>");

                for (var i = 0; i < data[0].approvers.length; i++) {

                    if (data[0].approvers[i].approverType == "C") {

                        commApp = commApp + 1;
                        commAppsrno = commAppsrno + 1;
                        str = '<tr id=trAppid' + commApp + '><td><button type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(trAppid' + commApp + ',trAppidPrev' + commApp + ',\'C\')"><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                        str += "<td>" + data[0].approvers[i].userName + "</td>";
                        str += "<td>" + commAppsrno + "</td>";
                        str += "<td class=hide>" + data[0].approvers[i].userID + "</td></tr>";
                        jQuery('#tblapprovers').append(str);

                        $('#wrap_scrollerPrevApp').show();
                        strP = "<tr id=trAppidPrev" + commApp + "><td>" + data[0].approvers[i].userName + "</td>";
                        strP += "<td>" + commAppsrno + "</td></tr>";
                        jQuery('#tblapproversPrev').append(strP);
                    }
                    else {


                        TechApp = TechApp + 1;
                        TechAppsrno = TechAppsrno + 1;
                        strtech = '<tr id=trAppidtech' + TechApp + '><td><button type=button class="btn btn-xs btn-danger" id=Removebtntech' + i + ' onclick="deleteApprow(trAppidtech' + TechApp + ',trAppidPrevtech' + TechApp + ',\'T\')"><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                        strtech += "<td>" + data[0].approvers[i].userName + "</td>";
                        strtech += "<td>" + TechAppsrno + "</td>";
                        strtech += "<td class=hide>" + data[0].approvers[i].userID + "</td>";
                        //str += "<td>" + data[0].approvers[i].showQuotedPrice +"</td>";
                        strtech += '<td><div class=\"checker\" id=\'uniform-chkbidTypestech\' ><span id=\'spancheckedtech\' class=checked><input type=\'checkbox\'   id=\'chkshowp' + data[0].approvers[i].userID + '\'  style=\'cursor:pointer\' name=\'chkshowP\' onclick="Checktechapp(this, ' + TechApp + ')" /></span></div ></td></tr>';
                        jQuery('#tblapproverstech').append(strtech);

                        $('#wrap_scrollerPrevApptech').show();
                        strPtech = "<tr id=trAppidPrevtech" + TechApp + "><td>" + data[0].approvers[i].userName + "</td>";
                        strPtech += "<td>" + TechAppsrno + "</td>";
                        strPtech += "<td id=tdshowp" + TechApp + "></td></tr>";

                        jQuery('#tblapproversPrevtech').append(strPtech);

                        if (data[0].approvers[i].showQuotedPrice == "Y") {
                            $('#tdshowp' + TechApp).html('Yes')
                            $('#chkshowp' + data[0].approvers[i].userID).attr('checked', 'checked')
                            $('#chkshowp' + data[0].approvers[i].userID).closest("span#spancheckedtech").addClass("checked")
                        }
                        else {
                            $('#tdshowp' + TechApp).html('No')
                            $('#chkshowp' + data[0].approvers[i].userID).removeAttr('checked')
                            $('#chkshowp' + data[0].approvers[i].userID).closest("span#spancheckedtech").removeClass("checked")
                        }

                    }

                }
            }
            else {
                // jQuery('#tblapprovers').append("<tr><td colspan=4>Map Approvers</td></tr>")
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }
    })
}
function Checktechapp(event, rowid) {

    if ($(event).closest("span#spancheckedtech").attr('class') == 'checked') {
        $(event).closest("span#spancheckedtech").removeClass("checked")
        $(event).removeAttr('checked')
        $('#tdshowp' + rowid).html('No')
    }

    else {

        $(event).closest("span#spancheckedtech").addClass("checked")
        $(event).attr('checked', 'checked')
        $('#tdshowp' + rowid).html('Yes')
    }

}

function fetchRFIParameteronload() {


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblRFQPrev").empty()
            $('#scrolr').show();

            if (data[0].parameters.length > 0) {

                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:100px;'></th><th>Item Code</th><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th>TAT</th><th>Remarks</th><th>PO No.</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                jQuery('#tblRFQPrev').append('<thead><tr style="background: grey; color:light black;"><th>S No</th><th>Item Code</th><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th>TAT</th><th>Remarks</th><th>PO No.</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Date</th><th>PO Value</th></tr></thead>');

                for (var i = 0; i < data[0].parameters.length; i++) {
                    rowAppItems = rowAppItems + 1
                    rowAppItemsrno = rowAppItemsrno + 1;
                    jQuery('<tr id=trid' + i + '><td>' + (i + 1) + '</td><td><button type=button class="btn btn-xs btn-success" onclick="editRow(' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button type=button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridprev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td id=itemcode' + i + '>' + data[0].parameters[i].rfqItemCode + '</td><td id=sname' + i + '>' + data[0].parameters[i].rfqShortName + '</td><td class=text-right id=TP' + i + '>' + thousands_separators(data[0].parameters[i].rfqTargetPrice) + '</td><td class=text-right id=quan' + i + '>' + thousands_separators(data[0].parameters[i].rfQuantity) + '</td><td id=uom' + i + '>' + data[0].parameters[i].rfqUomId + '</td><td id=desc' + i + '>' + data[0].parameters[i].rfqDescription + '</td><td id=delivery' + i + '>' + data[0].parameters[i].rfqDelivery + '</td><td class=text-right id=tat' + i + '>' + data[0].parameters[i].tat + '</td><td id=remarks' + i + '>' + data[0].parameters[i].rfqRemark + '</td><td id=pono' + i + '>' + data[0].parameters[i].rfqPoNo + '</td><td id=povname' + i + '>' + data[0].parameters[i].rfqVendorName + '</td><td class=text-right id=unitrate' + i + '>' + thousands_separators(data[0].parameters[i].rfqUnitRate) + '</td><td id=podate' + i + '>' + data[0].parameters[i].rfqpoDate + '</td><td id=povalue' + i + ' class=text-right>' + thousands_separators(data[0].parameters[i].rfqpoValue) + '</td><td class=hide>' + data[0].parameters[i].rfqParameterId + '</td></tr>').appendTo("#tblServicesProduct");
                    jQuery('<tr id=tridprev' + i + '><td>' + (i + 1) + '</td><td id=itemcodeprev' + i + '>' + data[0].parameters[i].rfqItemCode + '</td><td id=snameprev' + i + '>' + data[0].parameters[i].rfqShortName + '</td><td class=text-right id=TPPrev' + i + '>' + thousands_separators(data[0].parameters[i].rfqTargetPrice) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators(data[0].parameters[i].rfQuantity) + '</td><td id=uomprev' + i + '>' + data[0].parameters[i].rfqUomId + '</td><td id=descprev' + i + '>' + data[0].parameters[i].rfqDescription + '</td><td id=deliveryprev' + i + '>' + data[0].parameters[i].rfqDelivery + '</td><td class=text-right id=tatprev' + i + '>' + data[0].parameters[i].tat + '</td><td id=remarksprev' + i + '>' + data[0].parameters[i].rfqRemark + '</td><td id=ponoprev' + i + '>' + data[0].parameters[i].rfqPoNo + '</td><td id=povnameprev' + i + '>' + data[0].parameters[i].rfqVendorName + '</td><td class=text-right id=unitrateprev' + i + '>' + thousands_separators(data[0].parameters[i].rfqUnitRate) + '</td><td id=podateprev' + i + '>' + data[0].parameters[i].rfqpoDate + '</td><td id=povalueprev' + i + ' class=text-right>' + thousands_separators(data[0].parameters[i].rfqpoValue) + '</td></tr>').appendTo("#tblRFQPrev");
                }

                //for previe table
                $('#wrap_scrollerPrev').show();
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });


    jQuery.unblockUI();

}
function InsUpdProductSevices() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />Please Wait...</h5>' });

    if (form.valid() == true) {
        var st = "true"

        var i = 0;

        if ($('#add_or').text() == "Modify") {
            st = "true";
            i = 1;
            $("#tblServicesProduct tr:gt(0)").each(function () {

                if ($.trim($('#sname' + i).html()) == $('#txtshortname').val() && $('#txtItemCode').val() != "" && ($.trim($('#itemcode' + i).html()) == $('#txtItemCode').val() && $.trim($('#TP' + i).html()) == $('#txttargetprice').val() && $.trim($('#quan' + i).html()) == $("#txtquantitiy").val() || $.trim($('#uom' + i).html()) == $("#dropuom").val() && $.trim($('#remarks' + i).html()) == $('#txtItemRemarks').val() && $.trim($('#desc' + i).html()) == $('#txtbiddescriptionP').val() && $.trim($('#delivery' + i).html()) == $('#txtedelivery').val() && $.trim($('#povalue').html()) == $('#txtpovalue').val() && $.trim($('#unitrate').html()) == $('#txtunitrate').val() && $.trim($('#pono' + i).html()) == $("#txtPono").val() && $.trim($('#povname' + i).html()) == $("#txtvendorname").val() && $.trim($('#podate' + i).html()) == $("#txtPODate").val() && $.trim($('#tat' + i).html()) == $("#txttat").val())) {
                    st = "false"
                }
                i++;
            });

            if ($('#dropuom').val() == '') {
                $('.alert-danger').show();
                $('#spandanger').html('Please Select UOM Properly');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                jQuery.unblockUI();
                return false;
            }
            else if (st == "false") {
                error.show();
                $('#spandanger').html('Data already exists...');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
            }

            else {
                //Set data on main Table after edit

                var Description = $('#txtbiddescriptionP').val().replace(/\n/g, '<br />').replace(/'/g, " ");
                var this_row = $('#rowid').val()
                $("#itemcode" + this_row).text($('#txtItemCode').val())
                $("#sname" + this_row).text($('#txtshortname').val())
                $("#desc" + this_row).text(Description)

                $("#TP" + this_row).text($('#txttargetprice').val())

                $("#quan" + this_row).text($('#txtquantitiy').val())
                $("#uom" + this_row).text($('#dropuom').val())
                $("#remarks" + this_row).text($('#txtItemRemarks').val())
                $("#tat" + this_row).text($('#txttat').val())
                $("#delivery" + this_row).text($('#txtedelivery').val())
                $("#pono" + this_row).text($("#txtPono").val())
                $("#povname" + this_row).text($('#txtvendorname').val())
                $("#unitrate" + this_row).text($('#txtunitrate').val())
                $("#podate" + this_row).text($('#txtPODate').val())
                $("#pono" + this_row).find("td:eq(18)").text($('#txtPono').val())
                $("#povalue" + this_row).text($('#txtpovalue').val())

                //Set data on Prev Table after edit
                $("#itemcodeprev" + this_row).text($('#txtItemCode').val())
                $("#snameprev" + this_row).text($('#txtshortname').val())
                $("#descprev" + this_row).text(Description)
                $("#TPPrev" + this_row).text($('#txttargetprice').val())
                $("#quanprev" + this_row).text($('#txtquantitiy').val())
                $("#uomprev" + this_row).text($('#dropuom').val())
                $("#remarksprev" + this_row).text($('#txtItemRemarks').val())
                $("#tatprev" + this_row).text($('#txttat').val())
                $("#deliveryprev" + this_row).text($('#txtedelivery').val())
                $("#ponoprev" + this_row).text($("#txtPono").val())
                $("#povnameprev" + this_row).text($('#txtvendorname').val())
                $("#unitrateprev" + this_row).text($('#txtunitrate').val())
                $("#podateprev" + this_row).text($('#txtPODate').val())
                $("#ponoprev" + this_row).find("td:eq(18)").text($('#txtPono').val())
                $("#povalueprev" + this_row).text($('#txtpovalue').val())
                resetfun()
            }
        }
        else {

            st = "true"; i = 0;
            if ($('#dropuom').val() == '') {
                $('.alert-danger').show();
                $('#spandanger').html('Please Select UOM Properly');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                jQuery.unblockUI();
                return false;
            }
            else if ($('#tblServicesProduct >tbody >tr').length == 0) {
                ParametersQuery()
            }
            else {
                $("#tblServicesProduct tr:gt(0)").each(function () {
                    var this_row = $(this);
                    if ($.trim($('#sname' + i).html()) == $('#txtshortname').val() && ($.trim($('#itemcode' + i).html()) == $('#txtItemCode').val() && $.trim($('#TP' + i).html()) == $('#txttargetprice').val() && $.trim($('#quan' + i).html()) == $("#txtquantitiy").val() || $.trim($('#uom' + i).html()) == $("#dropuom").val() && $.trim($('#remarks' + i).html()) == $('#txtItemRemarks').val() && $.trim($('#desc' + i).html()) == $('#txtbiddescriptionP').val() && $.trim($('#delivery' + i).html()) == $('#txtedelivery').val() && $.trim($('#povalue').html()) == $('#txtpovalue').val() && $.trim($('#unitrate').html()) == $('#txtunitrate').val() && $.trim($('#pono' + i).html()) == $("#txtPono").val() && $.trim($('#povname' + i).html()) == $("#txtvendorname").val() && $.trim($('#podate' + i).html()) == $("#txtPODate").val() && $.trim($('#tat' + i).html()) == $("#txttat").val())) {
                        st = "false"
                    }
                    i++;
                });


                if (st == "false") {
                    error.show();
                    $('#spandanger').html('Data already exists...');
                    Metronic.scrollTo(error, -200);
                    error.fadeOut(3000);
                }

                else {
                    ParametersQuery();
                }
            }
        }


        jQuery.unblockUI();

    }
    else {

        form.validate()
        jQuery.unblockUI();
        return false;
    }

}
var rowAppItems = 0, rowAppItemsrno = 0;

function ParametersQuery() {
    var i;
    var TP = 0;
    var Povalue = 0;
    var unitrate = 0;
    var quan = 0;
    i = rowAppItems;
    if ($("#txtunitrate").val() != null || $("#txtunitrate").val() != '') {
        //unitrate = thousands_separators(parseFloat(removeThousandSeperator($('#txtunitrate').val())).round(3));  
        unitrate = thousands_separators($('#txtunitrate').val());
    }
    if ($("#txttargetprice").val() != null || $("#txttargetprice").val() != '') {
        //TP = thousands_separators(parseFloat(removeThousandSeperator($('#txttargetprice').val())).round(3)); 
        TP = thousands_separators($('#txttargetprice').val());
    }
    if ($("#txtpovalue").val() != null || $("#txtpovalue").val() != '') {
        //Povalue = thousands_separators(parseFloat(removeThousandSeperator($('#txtpovalue').val())).round(3));
        Povalue = thousands_separators($('#txtpovalue').val())
    }
    //quan=thousands_separators(parseFloat(removeThousandSeperator($('#txtquantitiy').val())).round(3))
    quan = thousands_separators($('#txtquantitiy').val())

    if (!jQuery("#tblServicesProduct thead").length) {
        jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:100px;'></th><th>Item Code</th><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th>TAT</th><th>Remarks</th><th>PO No.</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Date</th><th>PO Value</th></tr></thead>");
        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><button type="button" class="btn btn-xs btn-success" onclick="editRow(' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridprev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td  style="width:20%!important;" id=itemcode' + i + '>' + $('#txtItemCode').val() + '</td><td id=sname' + i + '>' + $('#txtshortname').val() + '</td><td class=text-right id=TP' + i + '>' + thousands_separators(parseFloat(removeThousandSeperator(TP)).round(3)) + '</td><td class=text-right id=quan' + i + '>' + quan + '</td><td id=uom' + i + '>' + $("#dropuom").val() + '</td><td id=desc' + i + '>' + $('#txtbiddescriptionP').val() + '</td><td id=delivery' + i + '>' + $('#txtedelivery').val() + '</td><td class=text-right id=tat' + i + '>' + $('#txttat').val() + '</td><td id=remarks' + i + '>' + $("#txtItemRemarks").val() + '</td><td id=pono' + i + '>' + $("#txtPono").val() + '</td><td id=povname' + i + '>' + $("#txtvendorname").val() + '</td><td class=text-right id=unitrate' + i + '>' + unitrate + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + '>' + Povalue + '</td><td class=hide id=parameterid' + i + '>0</td></tr>');
    }
    else {
        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><button type="button" class="btn  btn-xs btn-success" onclick="editRow(' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridprev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:20%!important;" id=itemcode' + i + '>' + $('#txtItemCode').val() + '</td><td id=sname' + i + '>' + $('#txtshortname').val() + '</td><td class=text-right id=TP' + i + '>' + thousands_separators(parseFloat(removeThousandSeperator(TP)).round(3)) + '</td><td class=text-right id=quan' + i + '>' + quan + '</td><td id=uom' + i + '>' + $("#dropuom").val() + '</td><td id=desc' + i + '>' + $('#txtbiddescriptionP').val() + '</td><td id=delivery' + i + '>' + $('#txtedelivery').val() + '</td><td class=text-right id=tat' + i + '>' + $('#txttat').val() + '</td><td id=remarks' + i + '>' + $("#txtItemRemarks").val() + '</td><td id=pono' + i + '>' + $("#txtPono").val() + '</td><td id=povname' + i + '>' + $("#txtvendorname").val() + '</td><td class=text-right id=unitrate' + i + '>' + unitrate + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + '>' + Povalue + '</td><td class=hide id=parameterid' + i + '>0</td></tr>');
    }

    $('#scrolr').show();

    if (!jQuery("#tblRFQPrev thead").length) {

        jQuery("#tblRFQPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th>TAT</th><th>Remarks</th><th>PO No.</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Date</th><th>PO Value</th></tr></thead>");
        jQuery("#tblRFQPrev").append('<tr id=tridprev' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td  style="width:20%!important;" id=itemcodeprev' + i + '>' + $('#txtItemCode').val() + '</td><td id=snameprev' + i + '>' + $('#txtshortname').val() + '</td><td class=text-right id=TPPrev' + i + '>' + thousands_separators(parseFloat(removeThousandSeperator(TP)).round(3)) + '</td><td class=text-right id=quanprev' + i + '>' + quan + '</td><td id=uomprev' + i + '>' + $("#dropuom").val() + '</td><td id=descprev' + i + '>' + $('#txtbiddescriptionP').val() + '</td><td id=deliveryprev' + i + '>' + $('#txtedelivery').val() + '</td><td class=text-right id=tatprev' + i + '>' + $('#txttat').val() + '</td><td id=remarksprev' + i + '>' + $("#txtItemRemarks").val() + '</td><td id=ponoprev' + i + '>' + $("#txtPono").val() + '</td><td id=povnameprev' + i + '>' + $("#txtvendorname").val() + '</td><td class=text-right id=unitrateprev' + i + '>' + unitrate + '</td><td id=podateprev' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalueprev' + i + '>' + Povalue + '</td></tr>');

    }
    else {

        jQuery("#tblRFQPrev").append('<tr id=tridprev' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td  style="width:20%!important;" id=itemcodeprev' + i + '>' + $('#txtItemCode').val() + '</td><td id=snameprev' + i + '>' + $('#txtshortname').val() + '</td><td class=text-right id=TPPrev' + i + '>' + thousands_separators(parseFloat(removeThousandSeperator(TP)).round(3)) + '</td><td class=text-right id=quanprev' + i + '>' + quan + '</td><td id=uomprev' + i + '>' + $("#dropuom").val() + '</td><td id=descprev' + i + '>' + $('#txtbiddescriptionP').val() + '</td><td id=deliveryprev' + i + '>' + $('#txtedelivery').val() + '</td><td class=text-right id=tatprev' + i + '>' + $('#txttat').val() + '</td><td id=remarksprev' + i + '>' + $("#txtItemRemarks").val() + '</td><td id=ponoprev' + i + '>' + $("#txtPono").val() + '</td><td id=povnameprev' + i + '>' + $("#txtvendorname").val() + '</td><td class=text-right id=unitrateprev' + i + '>' + unitrate + '</td><td id=podateprev' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalueprev' + i + '>' + Povalue + '</td></tr>');
    }
    $('#wrap_scrollerPrev').show();
    rowAppItems = rowAppItems + 1
    rowAppItemsrno = rowAppItemsrno + 1;
    resetfun()

}

function editRow(icount) {

    Metronic.scrollTo($("body"), 200);
    $('#rowid').val(icount)
    var Descriptiontxt = StringDecodingMechanism($("#desc" + icount).html().replace(/<br>/g, '\n'))
    var RFQRemark = StringDecodingMechanism($("#remarks" + icount).html().replace(/<br>/g, '\n'))

    //sessionStorage.setItem('CurrentRFQParameterId', RFQParameterId)

    $('#txtshortname').val(StringDecodingMechanism($("#sname" + icount).text()))
    $('#txtItemCode').val($("#itemcode" + icount).text())
    $('#txttargetprice').val(thousands_Sep_Text(removeThousandSeperator($("#TP" + icount).text())))
    $('#txtquantitiy').val(thousands_Sep_Text(removeThousandSeperator($("#quan" + icount).text())))
    $('#txtUOM').val($("#uom" + icount).text())
    $('#dropuom').val($("#uom" + icount).text())
    $('#txtItemRemarks').val(RFQRemark)
    $('#txtbiddescriptionP').val(Descriptiontxt)
    $('#txtedelivery').val($("#delivery" + icount).text())
    $("#txttat").val($("#tat" + icount).text())
    $('#txtPono').val($("#pono" + icount).text())
    $('#txtunitrate').val(thousands_Sep_Text(removeThousandSeperator($("#unitrate" + icount).text())))
    $('#txtvendorname').val(StringDecodingMechanism($("#povname" + icount).text()))
    $('#txtPODate').val($("#podate" + icount).text())
    $('#txtpovalue').val(thousands_Sep_Text(removeThousandSeperator($("#povalue" + icount).text())))
    $('#add_or').text('Modify');

}
function deleterow(TrId, Trprevid) {
    //rowAppItems = rowAppItems - 1;
    rowAppItemsrno = rowAppItemsrno - 1;
    $('#' + TrId.id).remove();
    $('#' + Trprevid.id).remove();
    var rowCount = jQuery('#tblServicesProduct tr').length;
    var i = 1;
    if (rowCount > 1) {
        $("#tblServicesProduct tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(0)').html(i));
            i++;
        });
        i = 1;
        $("#tblRFQPrev tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(0)').html(i));
            i++;
        });
    }

}

function resetfun() {
    sessionStorage.setItem('CurrentRFQParameterId', 0)
    $('#add_or').text('Add');
    $('#txtshortname').val('');
    $('#txttargetprice').val('');
    $('#txtquantitiy').val('');
    $('#dropuom').val('');
    $('#txttat').val('');
    $('#txtUOM').val('');
    $('#txtItemRemarks').val('');
    $('#txtbiddescriptionP').val('');
    $('#txtedelivery').val('');
    $("#txtItemCode").val('');
    $("#txtPono").val('');
    $("#txtunitrate").val('');
    $("#txtvendorname").val('');
    $("#txtPODate").val('');
    $("#txtpovalue").val('');
    $('#rowid').val('')

}

var allUOM = '';
function FetchUOM(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + CustomerID,//  fetchUOM
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#txtUOM").empty();
            if (data.length > 0) {
                allUOM = data;
            }
            else {
                allUOM = '';
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText // eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
jQuery("#txtUOM").keyup(function () {
    $('#dropuom').val('')

});
jQuery("#txtUOM").typeahead({
    source: function (query, process) {
        var data = allUOM;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.uom] = username;
            usernames.push(username.uom);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].uom != "") {
            $('#dropuom').val(map[item].uom)
        }
        else {
            gritternotification('Please select UOM  properly!!!');
        }
        return item;
    }

});
function FetchUOMforpop(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/FetchUOM/?CustomerID=" + CustomerID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlropuom").empty();
            jQuery("#ddlropuom").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlropuom").append(jQuery("<option></option>").val(data[i].uom).html(data[i].uom));
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText // eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
function displayUOM() {
    if (jQuery('#dropuom').val() != '') {
        var uomcaption = '/ ' + jQuery('#dropuom').val()
        jQuery('#lblUOM').text(uomcaption)
    }
    else {
        jQuery('#lblUOM').text('')
    }

}



jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblvendorlist tbody").find("tr"), function () {

        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});

function FetchCurrency(CurrencyID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchCurrency/?CurrencyID=" + CurrencyID + "&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#dropCurrency").empty();

            jQuery("#dropCurrency").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#dropCurrency").append(jQuery("<option></option>").val(data[i].currencyId).html(data[i].currencyNm));

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
function RFQInviteVendorTab3() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var InsertQuery = '';

    $("#selectedvendorlistsPrev> tbody > tr").each(function (index) {
        if ($.trim($(this).find('td:eq(0)').html()) != 'undefined' && $.trim($(this).find('td:eq(0)').html()) != "" && $.trim($(this).find('td:eq(0)').html()) != null) {
            InsertQuery = InsertQuery + $.trim($(this).find('td:eq(0)').html()) + ','
        }
        else {
            $('.alert-danger').show();
            $('#spandanger').html('Some Error in Vendor Selection.Please Select again');
            Metronic.scrollTo($(".alert-danger"), -200);
            $("#tblvendorlist> tbody > tr").each(function (index) {
                $(this).find("span#spanchecked").removeClass("checked");
                $('input[name="chkvender"]').prop('disabled', false);
                jQuery('#selectedvendorlists> tbody').empty()
                jQuery('#selectedvendorlistsPrev> tbody').empty()
            });
            $('.alert-danger').fadeOut(10000)
            return false;
        }
    });

    var _cleanString4 = StringEncodingMechanism(jQuery('#txtrfqSubject').val());


    var Tab3data = {
        "BidVendors": InsertQuery,
        "RFQId": parseInt(sessionStorage.getItem("hddnRFQID")),
        "UserID": sessionStorage.getItem('UserID'),
        //"subject": jQuery('#txtrfqSubject').val(),
        "subject": _cleanString4,
        "Deadline": new Date($('#txtenddatettime').val().replace('-', '')), //jQuery('#txtenddatettime').val(),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))

    };

    // console.log(JSON.stringify(Tab3data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQInviteVendors/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab3data),
        dataType: "json",
        success: function (data) {

            $('#BidPreviewDiv').show();
            $('#form_wizard_1').hide();
            jQuery.unblockUI();
            return true;
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;

        }
    });
}
function fnsubmitRFQ() {
    var _cleanString5 = StringEncodingMechanism(jQuery('#txtrfqSubject').val());
    var _cleanString6 = StringEncodingMechanism(jQuery('#txtrfqdescription').val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("hddnRFQID") != '' && sessionStorage.getItem("hddnRFQID") != null) {
        var Tab3data = {

            "RFQId": parseInt(sessionStorage.getItem("hddnRFQID")),
            "UserID": sessionStorage.getItem('UserID'),
            //"subject": jQuery('#txtrfqSubject').val(),
            "subject": _cleanString5,
            "RFQEndDate": jQuery('#txtenddatettime').val(),
            //"RFQDescription": jQuery('#txtrfqdescription').val(),
            "RFQDescription": _cleanString6,
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
        };
        console.log(JSON.stringify(Tab3data))
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQSubmit/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab3data),
            dataType: "json",
            success: function (data) {
                jQuery.unblockUI();
                bootbox.alert("Request for Quotation Submitted Successfully.", function () {
                    sessionStorage.removeItem('CurrentBidID');
                    window.location = sessionStorage.getItem("HomePage")
                    return false;

                });

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText //eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', 'form_wizard_1');
                }
                jQuery.unblockUI();
                return false;

            }
        });
    }
    else {
        window.location = sessionStorage.getItem("HomePage");
    }
}

var vCount = 0;
$("#chkAll").click(function () {

    if ($("#chkAll").is(':checked') == true) {
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        jQuery('#selectedvendorlists> tbody').empty()
        jQuery('#selectedvendorlistsPrev> tbody').empty()
        vCount = 0;
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
            $('#chkvender' + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
            var vendorid = $('#chkvender' + $.trim($(this).find('td:eq(0)').html())).val()
            var v = vCount;
            vCount = vCount + 1;
            var vname = $.trim($(this).find('td:eq(2)').html())
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

function Check(event, vname, vendorID) {

    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")
    }

    else {

        vCount = vCount + 1;
        //var EvID = event.id;
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")
        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',SelecetedVendorPrev' + vendorID + ',' + vendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td></tr>')
        $('#divvendorlist').find('span#spandynamic').hide();

        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');

    }
    if (vCount > 0) {
        jQuery('#selectedvendorlists').show()
        jQuery('#selectedvendorlistsPrev').show()
    }
    else {
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()
    }

}

function removevendor(trid, trprevid, vid) {

    vCount = vCount - 1;
    $('#' + trid.id).remove()
    $('#' + trprevid.id).remove()

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
    if ($('#chkvender' + vid).length) {
        $('#chkvender' + vid).closest("span#spanchecked").removeClass("checked")
        $('#chkvender' + vid).prop("disabled", false);
    }

}

function ValidateVendor() {

    var status = "false";

    // $("#tblvendorlist> tbody > tr").each(function (index) {

    //    if ($(this).find("span#spanchecked").attr('class') == 'checked') {
    //             status = "True";
    //    }
    //    else {
    //        status == "false";
    //    }

    //});
    if ($("#selectedvendorlists> tbody > tr").length == 0) {
        status == "false";
    }
    else {
        status = "True";
    }

    if (status == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('Please select atleast one vendors');
        Metronic.scrollTo($('.alert-danger'), -200);
        $('.alert-danger').fadeOut(5000);
        $('table#tblvendorlist').closest('.inputgroup').addClass('has-error');

        status = "false";

    }

    return status;

}

function fetchReguestforQuotationDetails() {
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            sessionStorage.setItem('hddnRFQID', RFQData[0].general[0].rfqId)
            jQuery('#txtrfqSubject').val(RFQData[0].general[0].rfqSubject)
            setTimeout(function () { $('#dropCurrency').val(RFQData[0].general[0].rfqCurrencyId).attr("selected", "selected"); }, 1000)
            jQuery('#txtrfqdescription').val(RFQData[0].general[0].rfqDescription)

            jQuery('#txtConversionRate').val(RFQData[0].general[0].rfqConversionRate);
            jQuery('#drp_TechnicalApp').val(RFQData[0].general[0].technicalApproval);

            if (RFQData[0].general[0].technicalApproval == "RFQ" || RFQData[0].general[0].technicalApproval == "AfterRFQ") {
                $('#ddlapprovertype').val('T');
                $('#ddlapprovertype').removeAttr('disabled');
                jQuery("#tblapproverstech").removeClass('hide')
                jQuery("#tblapproversPrevtech").removeClass('hide')
            }
            else {
                $('#ddlapprovertype').val('C');
                $('#ddlapprovertype').attr('disabled');
                $('#tblapproverstech').addClass('hide')
                jQuery("#tblapproversPrevtech").addClass('hide')
            }
            jQuery('#txtRFQReference').val(RFQData[0].general[0].rfqReference)

            var dtst = (fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
            var dtend = (fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
            if (RFQData[0].general[0].bidopeningdate != null || RFQData[0].general[0].bidopeningdate != '') {
                var bidOpenDate = (fnConverToLocalTime(RFQData[0].general[0].bidopeningdate))
                jQuery('#txtbidopendatetime').val(bidOpenDate);
            }

            jQuery('#txtstartdatettime').val(dtst);
            jQuery('#txtenddatettime').val(dtend);
            $("#cancelBidBtn").show();

            if (RFQData[0].general[0].rfqTermandCondition != '') {
                $('#file1').attr('disabled', true);
                $('#closebtn').removeClass('display-none');
                $('#attach-file').html(RFQData[0].general[0].rfqTermandCondition);
            }

            //Vendor Details
            if (RFQData[0].vendors.length > 0) {

                for (var i = 0; i < RFQData[0].vendors.length; i++) {
                    vCount = vCount + 1;
                    jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + RFQData[0].vendors[i].vendorId + '><td class=hide>' + RFQData[0].vendors[i].vendorId + '</td><td>' + RFQData[0].vendors[i].vendorName + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + RFQData[0].vendors[i].vendorId + ',SelecetedVendorPrev' + RFQData[0].vendors[i].vendorId + ',' + RFQData[0].vendors[i].vendorId + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + RFQData[0].vendors[i].vendorId + '><td class=hide>' + RFQData[0].vendors[i].vendorId + '</td><td>' + RFQData[0].vendors[i].vendorName + '</td></tr>')

                }

                jQuery('#selectedvendorlists').show()
                jQuery('#selectedvendorlistsPrev').show()

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }
    });
    jQuery.unblockUI();
}
function DownloadFile(aID) {

    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));
}

//*** File delete from Blob or DB 
function ajaxFileDelete(closebtnid, fileid, filename, deletionFor, filepath, srno) {

    if (deletionFor == 'eRFQTerms') {
        filename = $('#' + filename).html()
    }
    else {
        filename = filename;
    }
    var data = {
        "filename": filename,
        "foldername": 'eRFQ/' + sessionStorage.getItem('hddnRFQID')
    }


    $.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/DeleteFiles/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (deletionFor == 'eRFQTerms') {
                fileDeletefromdb(closebtnid, fileid, filepath, deletionFor, srno);
                $('#' + filepath).html('')
                $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
                $('#' + fileid).attr('disabled', false);
            }
            else {
                if (srno != 0) {
                    fileDeletefromdb(closebtnid, fileid, filepath, deletionFor, srno);
                }
            }
            $('#spansuccess1').html('File Deleted Successfully');
            success.show();
            Metronic.scrollTo(success, -200);
            success.fadeOut(5000);

        },
        error: function () {
            $(".alert-danger").find("span").html('').html('Error in file deletion.')
            Metronic.scrollTo(error, -200);
            $(".alert-danger").show();
            $(".alert-danger").fadeOut(5000);
            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();

}

function fileDeletefromdb(closebtnid, fileid, filepath, deletionFor, srno) {
    if (srno == 0) {
        $('#' + closebtnid).remove();
        $('#' + filepath).html('')
        $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
        $('#' + fileid).attr('disabled', false);
    }

    var Attachments = {
        "SrNo": parseInt(srno),
        "DeletionFor": deletionFor,
        "RFQID": parseInt(sessionStorage.getItem('hddnRFQID'))
    }
    //alert(JSON.stringify(Attachments))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQAttachmentQuesremove",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Attachments),
        dataType: "json",
        success: function (data) {
            return;
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });
}


$('#back_prev_btn').click(function () {
    $('#BidPreviewDiv').hide();
    $('#form_wizard_1').show();
});

function fetchPSBidDetailsForPreview() {
    var TermsConditionFileName = '';

    jQuery('#lblRfqsubject').html($('#txtrfqSubject').val())

    jQuery('#lblrfqstartdate').html($('#txtstartdatettime').val())
    jQuery('#lblrfqenddate').html($('#txtenddatettime').val())
    jQuery('#lblrfqdescription').html($('#txtrfqdescription').val())

    jQuery("#dropCurrencyPrev").html($('#dropCurrency option:selected').text())
    jQuery('#lblConversionRatePrev').html($('#txtConversionRate').val())
    jQuery("#txtRFQReferencePrev").html($('#txtRFQReference').val());
    jQuery("#lbltechnicalApproval").html($('#drp_TechnicalApp option:selected').text());
    jQuery('#lblbidopendate').html($('#txtbidopendatetime').val())
    if ($('#attach-file').html() != '' && ($('#file1').val() == '')) {
        $('#filepthtermsPrev').html($('#attach-file').html())
    }
    else {
        TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
        $('#filepthtermsPrev').html(TermsConditionFileName)

    }
    jQuery.unblockUI();

}

$("#btninstructionexcelparameter").click(function () {
    var ErrorUOMMsz = '<ul class="col-md-5 text-left">';
    var ErrorUOMMszRight = '<ul class="col-md-5 text-left">'
    var quorem = (allUOM.length / 2) + (allUOM.length % 2);
    for (var i = 0; i < parseInt(quorem); i++) {
        ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].UOM + '</li>';
        var z = (parseInt(quorem) + i);
        if (z <= allUOM.length - 1) {
            ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].UOM + '</li>';
        }
    }
    ErrorUOMMsz = ErrorUOMMsz + '</ul>'
    ErrorUOMMszRight = ErrorUOMMszRight + '</ul>'


    $("#ULUOM_instructions").html(ErrorUOMMsz + ErrorUOMMszRight);
    if ($('#ddlbidclosetype').val() == "S") {
        $('#libidduraion').show()

    }
    $("#instructionsDivParameter").show();
    $("#instructionSpanParameter").show();
});
$('#RfqParameterexcel').on("hidden.bs.modal", function () {
    $("#instructionsDivParameter").hide();
    $("#instructionSpanParameter").hide();
    $("#error-excelparameter").hide();
    $("#success-excelparameter").hide();
    $('#btnsforYesNo').show()
    $("#file-excelparameter").val('');
    $('#modalLoaderparameter').addClass('display-none');
    $("#temptableForExcelDataparameter").empty();
})
function fnNoExcelUpload() {
    $("#temptableForExcelDataparameter").empty();
    $('#modalLoaderparameter').addClass('display-none');
    $("#instructionsDivParameter").hide();
    $("#instructionSpanParameter").hide();
    $("#error-excelparameter").hide();
    $("#success-excelparameter").hide();
    $('#btnsforYesNo').show()
    $("#file-excelparameter").val('');
    $('#RfqParameterexcel').modal('hide');
}

function handleFileparameter(e) {

    //Get the files from Upload control
    var files = e.target.files;
    var i, f;
    //Loop through files
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {
            var data = e.target.result;

            var result;
            var workbook = XLSX.read(data, { type: 'binary' });

            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function (y) { /* iterate through sheets */
                //Convert the cell value to Json
                var sheet1 = workbook.SheetNames[0];
                //var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1]);
                if (roa.length > 0) {
                    result = roa;
                }
            });
            //Get the first column first cell value

            printDataparameter(result)
        };
        reader.readAsArrayBuffer(f);
    }
}
function isValidDate(str) {
    var parts = str.split('/');
    if (parts.length < 3)
        return false;
    else {
        var day = parseInt(parts[0]);
        var month = parseInt(parts[1]);
        var year = parseInt(parts[2]);
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false;
        }
        if (day < 1 || year < 1)
            return false;
        if (month > 12 || month < 1)
            return false;
        if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day > 31)
            return false;
        if ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30)
            return false;
        if (month == 2) {
            if (((year % 4) == 0 && (year % 100) != 0) || ((year % 400) == 0 && (year % 100) == 0)) {
                if (day > 29)
                    return false;
            } else {
                if (day > 28)
                    return false;
            }
        }
        return true;
    }
}
var Rowcount = 0;
function printDataparameter(result) {

    var loopcount = result.length; //getting the data length for loop.
    var ErrorMszDuplicate = '';
    var i;
    // var numberOnly = /^[0-9]+$/;
    //var numberOnly = /^[0-9]\d*(\.\d+)?$/;
    // var numberOnly = /^[0-18]\d*(\.\d[0-3]+)?$/;
    var numberOnly = /^\d+(?:\.\d{1,3})?$/;

    $("#temptableForExcelDataparameter").empty();
    $("#temptableForExcelDataparameter").append("<tr><th>ItemService</th><th>ItemCode</th><th>TargetPrice</th><th>Quantity</th><th>UOM</th><th>Description</th><th>TAT</th><th>DeliveryLocation</th><th>Remarks</th><th>PoNo</th><th>VendorName</th><th>UnitRate</th><th>PoDate</th><th>PoValue</th></tr>");
    // checking validat  alert(loopcount)
    var targetPrice = 0;
    var TAT = 0;
    var unitrate = 0
    var povalue = 0;
    var pono = ''
    var podate = ''
    var povendorname = ''
    var itemcode = ''; var st = 'true'; var podatejv;
    for (i = 0; i < loopcount; i++) {
        itemcode = '', povendorname = '', podate = '', pono = '', povalue = 0, unitrate = 0, TAT = 0, targetPrice = 0; podatejv = '';
        if ($.trim(result[i].TAT) == '') {
            TAT = 0;
        }
        else {
            TAT = $.trim(result[i].TAT);
        }
        if ($.trim(result[i].UnitRate) == '') {
            unitrate = 0;
        }
        else {
            unitrate = $.trim(result[i].UnitRate);
        }
        if ($.trim(result[i].PoValue) == '') {
            povalue = 0;
        }
        else {
            povalue = $.trim(result[i].PoValue);
        }
        if ($.trim(result[i].TargetPrice) == '') {
            targetPrice = 0;
        }
        else {
            targetPrice = $.trim(result[i].TargetPrice);
        }
        if ($.trim(result[i].PoDate) != '') {
            podate = $.trim(result[i].PoDate);
            // podatejv = new Date(podate);
        }



        if ($.trim(result[i].PoNo) != '') {
            pono = $.trim(result[i].PoNo);
        }
        if ($.trim(result[i].PoVendorName) != '') {
            povendorname = $.trim(result[i].PoVendorName);

        }
        if ($.trim(result[i].ItemCode) != '') {
            itemcode = $.trim(result[i].ItemCode);

        }

        if ($.trim(result[i].ItemService) == '' || $.trim(result[i].ItemService).length > 200) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Item/Service can not be blank or length should be 200 characters of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].ItemCode).length > 50) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Item Code length should be 50 characters of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }

        else if ($.trim(result[i].Remarks) == '' || $.trim(result[i].Remarks).length > 200) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Remarks can not be blank of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].Quantity) == '' || $.trim(result[i].Quantity) == '0') {
            $("#error-excelparameter").show();

            $("#errspan-excelparameter").html('Quantity can not be blank of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].Description) == '' || $.trim(result[i].Description).length > 2000) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Description can not be blank or length should be 200 characters of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (!result[i].Quantity.trim().match(numberOnly)) {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Quantity should be in numbers or upto 3 decimal places of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].UOM) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('UOM can not be blank of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (TAT != '' && (!TAT.match() || TAT.length > 4)) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('TAT should be in numbers only and maximum 4 digits allowed of item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;

        }
        else if (!$.trim(result[i].UnitRate).match(numberOnly) && unitrate != 0) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Unit Rate should be in numbers or upto 3 decimal places only of item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;

        }
        else if (!$.trim(result[i].PoValue).match(numberOnly) && povalue != 0) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('PO Value should be in numbers or upto 3 decimal places only of item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;

        }
        else if (!moment(podate, 'MM/DD/YYYY', true).isValid() && podate != '') {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('PO Date is incorrect of item no ' + (i + 1) + '. Please set PODate in MM/DD/YYYY or MM-DD-YYYY.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].DeliveryLocation) == '' || $.trim(result[i].DeliveryLocation).length > 100) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Delivery Location can not be blank or length should be 100 characters of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (targetPrice != '' && (!targetPrice.match(numberOnly))) {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Target Price should be in numbers or upto 3 decimal places only of item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;
        }

        else {
            // if values are correct then creating a temp table

            $("<tr><td>" + replaceQuoutesFromStringFromExcel(result[i].ItemService) + "</td><td>" + replaceQuoutesFromStringFromExcel(itemcode) + "</td><td>" + targetPrice + "</td><td>" + result[i].Quantity + "</td><td>" + result[i].UOM + "</td><td>" + replaceQuoutesFromStringFromExcel(result[i].Description) + "</td><td>" + TAT + "</td><td>" + replaceQuoutesFromStringFromExcel(result[i].DeliveryLocation) + "</td><td>" + replaceQuoutesFromStringFromExcel(result[i].Remarks) + "</td><td>" + replaceQuoutesFromStringFromExcel(pono) + "</td><td>" + replaceQuoutesFromStringFromExcel(povendorname) + "</td><td>" + unitrate + "</td><td>" + podate + "</td><td>" + povalue + "</td></tr>").appendTo("#temptableForExcelDataparameter");

            var arr = $("#temptableForExcelDataparameter tr");

            $.each(arr, function (i, item) {
                var currIndex = $("#temptableForExcelDataparameter tr").eq(i);

                var matchText = currIndex.find("td:eq(0)").text().toLowerCase();
                $(this).nextAll().each(function (i, inItem) {

                    if (matchText === $(this).find("td:eq(0)").text().toLowerCase()) {
                        $(this).remove();
                        st = 'false'

                        ErrorMszDuplicate = ErrorMszDuplicate + ' RFQ Item with same name already exists at row no ' + (i + 1) + ' . Item will not insert.!<BR>'
                    }
                });
            });

        }

    } // for loop ends
    var excelCorrect = 'N';
    var ErrorUOMMsz = '';
    var ErrorUOMMszRight = '';
    Rowcount = 0;
    // check for UOM

    $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
        var this_row = $(this);
        excelCorrect = 'N';
        Rowcount = Rowcount + 1;

        for (var i = 0; i < allUOM.length; i++) {

            if ($.trim(this_row.find('td:eq(4)').html()).toLowerCase() == allUOM[i].uom.trim().toLowerCase()) {//allUOM[i].UOMID
                excelCorrect = 'Y';
            }

        }
        var quorem = (allUOM.length / 2) + (allUOM.length % 2);
        if (excelCorrect == "N") {
            $("#error-excelparameter").show();
            ErrorUOMMsz = 'UOM not filled properly at row no ' + Rowcount + '. Please choose UOM from given below: <br><ul class="col-md-3 text-left">';
            ErrorUOMMszRight = '<ul class="col-md-3 text-left">'
            for (var i = 0; i < parseInt(quorem); i++) {
                ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].uom + '</li>';
                var z = (parseInt(quorem) + i);
                if (z <= allUOM.length - 1) {
                    ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].uom + '</li>';
                }
            }
            ErrorUOMMsz = ErrorUOMMsz + '</ul>'
            ErrorUOMMszRight = ErrorUOMMszRight + '</ul><div class=clearfix></div><br/>and upload the file again.'
            $("#errspan-excelparameter").html(ErrorUOMMsz + ErrorUOMMszRight);

            return false;
        }

    });

    if (excelCorrect == "Y") {
        $("#error-excelparameter").hide();
        // $("#errspan-excelparameter").html('');
        $("#success-excelparameter").show();
        $('#btnsforYesNo').show()
        $("#succspan-excelparameter").html('Excel file is found ok.Do you want to upload ?\n This will clean your existing Data.');
        $("#file-excelparameter").val('');
        excelCorrect = '';
        if (st == 'false') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html(ErrorMszDuplicate)
        }

    }


}
function isDate(ExpiryDate) {
    var objDate,  // date object initialized from the ExpiryDate string 
        mSeconds, // ExpiryDate in milliseconds 
        day,      // day 
        month,    // month 
        year;     // year 
    // date length should be 10 characters (no more no less) 
    if (ExpiryDate.length !== 10) {
        return false;
    }
    // third and sixth character should be '/' 
    if (ExpiryDate.substring(2, 3) !== '/' || ExpiryDate.substring(5, 6) !== '/') {
        return false;
    }
    // extract month, day and year from the ExpiryDate (expected format is mm/dd/yyyy) 
    // subtraction will cast variables to integer implicitly (needed 
    // for !== comparing) 
    month = ExpiryDate.substring(0, 2) - 1; // because months in JS start from 0 
    day = ExpiryDate.substring(3, 5) - 0;
    year = ExpiryDate.substring(6, 10) - 0;
    // test year range 
    if (year < 1000 || year > 3000) {
        return false;
    }
    // convert ExpiryDate to milliseconds 
    mSeconds = (new Date(year, month, day)).getTime();
    // initialize Date() object from calculated milliseconds 
    objDate = new Date();
    objDate.setTime(mSeconds);
    // compare input date and parts from Date() object 
    // if difference exists then date isn't valid 
    if (objDate.getFullYear() !== year ||
        objDate.getMonth() !== month ||
        objDate.getDate() !== day) {
        return false;
    }
    // otherwise return true 
    return true;
}
function fnSeteRFQparameterTable() {
    var rowCount = jQuery('#temptableForExcelDataparameter tr').length;
    if (rowCount > 0) {
        $("#success-excelparameter").hide();
        $('#btnsforYesNo').show()
        $("#error-excelparameter").hide();
        $('#loader-msgparameter').html('Processing. Please Wait...!');
        $('#modalLoaderparameter').removeClass('display-none');
        jQuery("#tblServicesProduct").empty();
        jQuery("#tblRFQPrev").empty();
        var i;
        //i = rowAppItems;
        i = 0;
        rowAppItemsrno = 0;
        $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
            var this_row = $(this);

            if (!jQuery("#tblServicesProduct thead").length) {
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:100px;'></th><th>Item Code</th><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th>TAT</th><th>Remarks</th><th>PO No.</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><button type="button" class="btn btn-xs btn-success" onclick="editRow(' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridprev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td  style="width:20%!important;" id=itemcode' + i + '>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td id=sname' + i + '>' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td class=text-right id=TP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(2)').html())) + '</td><td class=text-right id=quan' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td id=uom' + i + '>' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td id=desc' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td id=delivery' + i + '>' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=tat' + i + '>' + $.trim(this_row.find('td:eq(6)').html()) + '</td><td id=remarks' + i + '>' + $.trim(this_row.find('td:eq(8)').html()) + '</td><td id=pono' + i + '>' + $.trim(this_row.find('td:eq(9)').html()) + '</td><td id=povname' + i + '>' + $.trim(this_row.find('td:eq(10)').html()) + '</td><td class=text-right id=unitrate' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(11)').html())) + '</td><td id=podate' + i + '>' + $.trim(this_row.find('td:eq(12)').html()) + '</td><td class=text-right id=povalue' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(13)').html())) + '</td><td class=hide id=parameterid' + i + '>0</td></tr>');
            }
            else {
                jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><button type="button" class="btn  btn-xs btn-success" onclick="editRow(' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridprev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:20%!important;" id=itemcode' + i + '>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td id=sname' + i + '>' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td class=text-right id=TP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(2)').html())) + '</td><td class=text-right id=quan' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td id=uom' + i + '>' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td id=desc' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td id=delivery' + i + '>' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=tat' + i + '>' + $.trim(this_row.find('td:eq(6)').html()) + '</td><td id=remarks' + i + '>' + $.trim(this_row.find('td:eq(8)').html()) + '</td><td id=pono' + i + '>' + $.trim(this_row.find('td:eq(9)').html()) + '</td><td id=povname' + i + '>' + $.trim(this_row.find('td:eq(10)').html()) + '</td><td class=text-right id=unitrate' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(11)').html())) + '</td><td id=podate' + i + '>' + $.trim(this_row.find('td:eq(12)').html()) + '</td><td class=text-right id=povalue' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(13)').html())) + '</td><td class=hide id=parameterid' + i + '>0</td></tr>');
            }

            $('#scrolr').show();

            if (!jQuery("#tblRFQPrev thead").length) {

                jQuery("#tblRFQPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th>TAT</th><th>Remarks</th><th>PO No.</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                jQuery("#tblRFQPrev").append('<tr id=tridprev' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td  style="width:20%!important;" id=itemcode' + i + '>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td id=snameprev' + i + '>' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td class=text-right id=TPPrev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(2)').html())) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td id=uomprev' + i + '>' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td id=descprev' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td id=deliveryprev' + i + '>' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=tatprev' + i + '>' + $.trim(this_row.find('td:eq(6)').html()) + '</td><td id=remarksprev' + i + '>' + $.trim(this_row.find('td:eq(8)').html()) + '</td><td id=ponoprev' + i + '>' + $.trim(this_row.find('td:eq(9)').html()) + '</td><td id=povnameprev' + i + '>' + $.trim(this_row.find('td:eq(10)').html()) + '</td><td class=text-right id=unitrateprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(11)').html())) + '</td><td id=podateprev' + i + '>' + $.trim(this_row.find('td:eq(12)').html()) + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(13)').html())) + '</td></tr>');

            }
            else {

                jQuery("#tblRFQPrev").append('<tr id=tridprev' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td  style="width:20%!important;" id=itemcode' + i + '>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td id=snameprev' + i + '>' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td class=text-right id=TPPrev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(2)').html())) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td id=uomprev' + i + '>' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td id=descprev' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td id=deliveryprev' + i + '>' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=tatprev' + i + '>' + $.trim(this_row.find('td:eq(6)').html()) + '</td><td id=remarksprev' + i + '>' + $.trim(this_row.find('td:eq(8)').html()) + '</td><td id=ponoprev' + i + '>' + $.trim(this_row.find('td:eq(9)').html()) + '</td><td id=povnameprev' + i + '>' + $.trim(this_row.find('td:eq(10)').html()) + '</td><td class=text-right id=unitrateprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(11)').html())) + '</td><td id=podateprev' + i + '>' + $.trim(this_row.find('td:eq(12)').html()) + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(13)').html())) + '</td></tr>');
            }
            $('#wrap_scrollerPrev').show();
            rowAppItems = rowAppItems + 1;
            rowAppItemsrno = rowAppItemsrno + 1;
            i = i + 1;
        })
        setTimeout(function () {
            $('#RfqParameterexcel').modal('hide');
            jQuery.unblockUI();
        }, 500 * rowCount)
    }
    else {
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html('No Items Found in Excel');
    }
}

$("#btninstructionexcel").click(function () {
    $("#instructionsDiv").show();
    $("#instructionSpan").show();
});

function fetchVendorGroup(categoryFor, vendorId) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=" + categoryFor + "&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VendorID=" + vendorId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                vendorsForAutoComplete = data;
            }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });
}
jQuery("#txtVendorGroup").keyup(function () {
    jQuery("#txtSearch").val('')
    jQuery("#tblvendorlist> tbody").empty();
    sessionStorage.setItem('hdnVendorID', '0');
});
jQuery("#txtVendorGroup").typeahead({
    source: function (query, process) {
        var data = vendorsForAutoComplete
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.categoryName] = username;
            usernames.push(username.categoryName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].categoryID != "0") {
            getCategoryWiseVendors(map[item].categoryID);
        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});

jQuery("#txtSearch").keyup(function () {
    jQuery("#txtVendorGroup").val('')
    jQuery("#tblvendorlist> tbody").empty();
    sessionStorage.setItem('hdnVendorID', '0');
});

sessionStorage.setItem('hdnVendorID', 0);
jQuery("#txtSearch").typeahead({
    source: function (query, process) {
        var data = allvendorsforautocomplete;
        var vName = '';
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            vName = username.participantName + ' (' + username.companyEmail + ')'
            map[vName] = username;
            usernames.push(vName);
        });
        process(usernames);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].participantID != "0") {

            //sessionStorage.setItem('hdnVendorID', map[item].participantID);
            vName = map[item].participantName + '(' + map[item].companyEmail + ')';

            jQuery('#tblvendorlist').append("<tr id=vList" + map[item].participantID + " ><td class='hide'>" + map[item].participantID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\" class=''><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + map[item].participantID + "'\)\"; id=\"chkvender" + map[item].participantID + "\" value=" + map[item].participantID + " style=\"cursor:pointer\" name=\"chkvender\" /></span></div></td><td> " + vName + " </td></tr>");

            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {
                    // console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()))

                    //** remove from main table if already selected in selected List
                    if (map[item].participantID == $(this).find("td:eq(0)").text()) {
                        $('#vList' + map[item].participantID).remove();

                    }
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
function getCategoryWiseVendors(categoryID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorCategoryWise/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&CategoryID=" + categoryID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#tblvendorlist > tbody").empty();
            var vName = '';
            for (var i = 0; i < data.length; i++) {
                vName = data[i].vendorName;
                var str = "<tr id=vList" + data[i].vendorID + "><td class='hide'>" + data[i].vendorID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].vendorID + "'\)\"; id=\"chkvender" + data[i].vendorID + "\" value=" + data[i].vendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].vendorName + " </td></tr>";
                jQuery('#tblvendorlist > tbody').append(str);

            }

            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {

                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")

                });
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });


}

function showFileName(fileid) {
    var filename = '';
    filename = $('#' + fileid.id)[0].files[0].name
    $("#spnParamAttach").html(filename).show();
}


$("#btndownloadTemplate").click(function (e) {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;

    tableToExcelMultipleWorkSheet(['tbleRFQdetails', 'tblUOM'], ['DataTemplate', 'Instructions'], 'eRFQXLTemplate -' + postfix + '.xls')
});
function fnfillInstructionExcel() {
    $('#tblUOM').empty()

    $('#tblUOM').append('<thead><tr><th   colspan=2  data-style="Header" colspan=2>Please enter UOM as given below:</th></tr></thead>')
    var quorem = (allUOM.length / 2) + (allUOM.length % 2);
    for (var i = 0; i < parseInt(quorem); i++) {
        $('#tblUOM').append('<tr id=TR' + i + '><td>' + allUOM[i].uom + '</td>');
        var z = (parseInt(quorem) + i);
        if (z <= allUOM.length - 1) {
            $('#TR' + i).append('<td>' + allUOM[z].uom + '</td></tr>')
        }
    }
    $('#tblUOM').append("<tr><td colspan=2>&nbsp;</td></tr><tr><td colspan=2>&nbsp;</td></tr>")
    $('#tblUOM').append('<tr><th data-style="Header"  colspan=2>Please ensure Target price and Quantity and TAT should be in numbers only.</th></tr>')
}

