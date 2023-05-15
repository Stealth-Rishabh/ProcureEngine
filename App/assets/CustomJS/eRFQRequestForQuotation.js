$("#cancelBidBtn").hide();
$("#spnParamAttach").hide();
var error = $('.alert-danger');

var success = $('.alert-success');

var form = $('#submit_form');
var Vehicleerror = $('#errordiv');
var Vehiclesuccess = $('#successdiv');
var Vehicleerror1 = $('#errordiv1');
var Vehiclesuccess1 = $('#successdiv1');

var totalFileSize = 0;
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
                    txtrfqDuration: {
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
                        maxlength: 3
                    },

                    file1: {
                        required: true
                    },




                    //Second Tab

                    txtbiddescriptionP: {
                        required: true

                    },
                    txtedelivery: {
                        required: true
                    },
                    txtUOM: {
                        required: true
                    },
                    txttargetprice: {
                        number: true
                    },
                    txtlastinvoiceprice: {
                        number: true
                    },
                    txtquantitiy: {
                        required: true
                    },
                    txtshortname: {
                        required: true,
                        maxlength: 200
                    },
                    txtItemRemarks: {
                        required: true,
                        maxlength: 200
                    },
                    txttat: {
                        number: true,
                        maxlength: 4
                    }

                },

                messages: {

                },

                errorPlacement: function (error, element) {

                    if (element.attr("name") == "gender") {

                        error.insertAfter("#form_gender_error");

                    } else if (element.attr("name") == "payment[]") {

                        error.insertAfter("#form_payment_error");

                    } else if (element.attr("name") == "txtrfqDuration") {
                        error.insertAfter("#daterr");
                    }
                    else {

                        error.insertAfter(element);

                    }


                },

                invalidHandler: function (event, validator) {

                },

                highlight: function (element) {

                    $(element)

                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');

                    $(element)

                        .closest('.col-md-4,.xyz').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element)

                        .closest('.inputgroup').removeClass('has-error');
                    $(element)

                        .closest('.col-md-4,.xyz').removeClass('has-error');

                },

                success: function (label) {

                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {

                        label

                            .closest('.inputgroup').removeClass('has-error').addClass('has-success');
                        label

                            .closest('.col-md-4,.xyz').removeClass('has-error').addClass('has-success');

                        label.remove();

                    } else {

                        label

                            .addClass('valid') // mark the current input as valid and display OK icon

                            .closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group
                        label.closest('.col-md-4,.xyz').removeClass('has-error').addClass('has-success'); // set success class to the control group

                    }

                    if ($("#txtbidDate").closest('.inputgroup').attr('class') == 'inputgroup has-error') {

                        $("#btncal").css("margin-top", "-22px");

                    }

                    else {

                        $("#btncal").css("margin-top", "0px");

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
                        if (form.valid() == false) {
                            return false;

                        } else {
                            InsUpdRFQDEtailTab1()
                            $('#currencyparam').val(jQuery('#dropCurrency option:selected').text());
                        }

                    } else if (index == 2) {
                        if ($('#tblServicesProduct >tbody >tr').length == 0) {
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Configure RFQ Parameters.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

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
                else if (BoqStatus == 'N') {
                    $('#form_wizard_1').bootstrapWizard('previous');

                    error.show();

                    $('#spandanger').html('Please Define Boq.')

                    error.fadeOut(3000)

                    return false;
                }

                else if (ValidateVendor() == 'false') {

                    return false;

                }

                else {
                    fetchPSBidDetailsForPreview()
                    $('#BidPreviewDiv').show();
                    $('#form_wizard_1').hide();

                    return true;

                }

            }).hide();



            //unblock code

        }

    };

}();


sessionStorage.setItem('hddnRFQID', 0)

function InsUpdRFQDEtailTab1() {
    var _cleanString = StringEncodingMechanism(jQuery("#txtrfqSubject").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtrfqdescription").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';
    var AttachementFileName = '';
    if ($('#attach-file').html() != '' && $('#file1').val() == '') {
        TermsConditionFileName = $.trim(jQuery('#attach-file').html());
    } else {
        TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
    }
    TermsConditionFileName = TermsConditionFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters

    var Tab1Data = {

        "RFQId": sessionStorage.getItem('hddnRFQID'),
        //"RFQSubject": jQuery("#txtrfqSubject").val(),
        "RFQSubject": _cleanString,
        "RFQDeadline": jQuery("#txtrfqDuration").val(),
        //"RFQDescription": jQuery("#txtrfqdescription").val(),
        "RFQDescription": _cleanString2,
        "RFQCurrencyId": jQuery("#dropCurrency").val(),
        "RFQConversionRate": jQuery("#txtConversionRate").val(),
        "RFQTermandCondition": TermsConditionFileName,
        "RFQAttachment": '',
        "UserId": sessionStorage.getItem('UserID'),
        "CustomerID": sessionStorage.getItem('CustomerID'),
        "RFQReference": $("#txtRFQReference").val()

    };
    jQuery.ajax({

        type: "POST",

        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/InsUpdRequestForQuotation",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,

        async: false,

        data: JSON.stringify(Tab1Data),

        dataType: "json",

        success: function (data) {
            sessionStorage.setItem('hddnRFQID', data[0].RFQId)
            fileUploader(sessionStorage.getItem('hddnRFQID'))
        }

    });
    jQuery.unblockUI();
}


function fileUploader(RFQID) {

    var fileTerms = $('#file1');
    //change pooja
    if ($('#file1').is('[disabled=disabled]')) {

        var fileDataTerms = $('#file2').prop("files")[0];

    }
    else {
        var fileDataTerms = fileTerms.prop("files")[0];
    }

    //change pooja

    var fileAnyOther = $('#file2');

    var fileDataAnyOther = fileAnyOther.prop("files")[0];



    var formData = new window.FormData();

    formData.append("fileTerms", fileDataTerms);
    formData.append("fileAnyOther", fileDataAnyOther);
    formData.append("AttachmentFor", 'RFQ');
    formData.append("BidID", RFQID);
    formData.append("VendorID", '');


    $.ajax({

        url: 'ConfigureFileAttachment.ashx',

        data: formData,

        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function (data) {

        },

        error: function () {

            //jQuery.unblockUI();

        }

    });

}

function fileUploaderTab2(RFQID) {

    var fileTerms = $('#file3');
    //change pooja


    var fileDataTerms = fileTerms.prop("files")[0];

    var formData = new window.FormData();

    formData.append("fileTerms", fileDataTerms);
    formData.append("fileAnyOther", '');
    formData.append("AttachmentFor", 'RFQ');
    formData.append("BidID", RFQID);
    formData.append("VendorID", '');


    $.ajax({

        url: 'ConfigureFileAttachment.ashx',

        data: formData,

        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function (data) {
            resetfun();
            jQuery.unblockUI();
        },

        error: function () {

            //jQuery.unblockUI();

        }

    });


}







$("#txtrfqDate").change(function () {

    if ($("#txtbidDate").val() == '') { }

    else {

        $("#txtbidDate").closest('.inputgroup').removeClass('has-error');

        $("#txtbidDate").closest('.inputgroup').find('span').hide();

        $("#txtbidDate").closest('.inputgroup').find('span.input-group-btn').show();

        $("#txtbidDate").closest('.inputgroup').find("#btncal").css("margin-top", "0px");

    }

});


sessionStorage.setItem('CurrentRFQParameterId', 0)


function InsUpdProductSevices() {
    var _cleanString3 = StringEncodingMechanism($('#txtshortname').val());
    var _cleanString4 = StringEncodingMechanism($('#txtItemRemarks').val());
    var _cleanString5 = StringEncodingMechanism($("#txtAttachmentDescription").val());

    if ($('#dropuom').val() == '') {
        $('.alert-danger').show();
        $('#spandanger').html('Please Select UOM Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }

    else {
        jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />Please Wait...</h5>' });
        if (form.valid() == true) {
            if ($("#file3").val() != '') {
                attachmentSize = $("#file3")[0].files[0].size;
            } else {
                attachmentSize = $("#validattachmentSize").val();
            }
            var status = "";
            if (jQuery("#checkmaskvendor").is(':checked')) {
                status = "Y";
            }
            else {
                status = "N";
            }

            if ($('#attach-file3').html != '' && jQuery('#file3').val() == '') {
                AttachementFileName = StringEncodingMechanism($.trim(jQuery('#attach-file3').html()));
            } else {
                AttachementFileName = StringEncodingMechanism(jQuery('#file3').val().substring(jQuery('#file3').val().lastIndexOf('\\') + 1));
            }
            AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters

            var Description = StringEncodingMechanism($('#txtbiddescriptionP').val().replace(/\n/g, '<br />').replace(/'/g, " "));
            var Remark = '';
            var data = {
                "RFQParameterId": sessionStorage.getItem('CurrentRFQParameterId'),
                "RFQId": sessionStorage.getItem('hddnRFQID'),
                //"RFQShortName": $('#txtshortname').val(),
                "RFQShortName": _cleanString3,
                "RFQTargetPrice": removeThousandSeperator($('#txttargetprice').val()),
                "RFQLastInvoicePrice": removeThousandSeperator($('#txtlastinvoiceprice').val()),
                "RFQuantity": removeThousandSeperator($('#txtquantitiy').val()),
                "RFQUomId": $('#dropuom').val(),
                //"RFQRemark": $('#txtItemRemarks').val(),
                "RFQRemark": _cleanString4,
                "RFQDescription": Description,
                "TAT": $("#txttat").val(),
                "AttachmentDescription": _cleanString5,
                //"AttachmentDescription": $("#txtAttachmentDescription").val(),
                "AttachmentFile": AttachementFileName,
                "AttachmentSize": attachmentSize,
                "RFQBoq": status,
                "RFQDelivery": $('#txtedelivery').val(),
                "BOQparentId": 0,
                "UserId": sessionStorage.getItem('UserID')


            }

            jQuery.ajax({
                url: sessionStorage.getItem("APIPath") + "RequestForQuotation/InsUpdRFQParameter",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                data: JSON.stringify(data),
                type: "POST",
                cache: false,
                crossDomain: true,
                processData: true,
                dataType: "json",
                contentType: "application/json",
                success: function (data) {

                    if (data[0].GetMsz == "1") {

                        fetchRFIParameteronload()
                        $('.alert-success').show();
                        $('#spansuccess1').html('RFQ Item Parameter saved successfully!');
                        Metronic.scrollTo($(".alert-success"), -200);
                        $('.alert-success').fadeOut(7000);
                        return false;

                    }
                    else if (data[0].GetMsz == '2') {

                        fetchRFIParameteronload()
                        $('.alert-success').show();
                        $('#spansuccess1').html('RFQ Item Parameter updated successfully!');
                        Metronic.scrollTo($(".alert-success"), -200);
                        $('.alert-success').fadeOut(7000);
                        return false;

                    }
                    else if (data[0].GetMsz == '3') {
                        $('.alert-danger').show();
                        $('#spandanger').html('RFQ Item Parameter with same name already exists.!');
                        Metronic.scrollTo($(".alert-danger"), -200);
                        $('.alert-danger').fadeOut(7000);
                        return false;
                    }


                }
            });
            fileUploaderTab2(sessionStorage.getItem("hddnRFQID"));



        }
        else {
            form.validate()
            jQuery.unblockUI();
            return false;
        }
    }
}



function editRow(RFQParameterId, rowid) {
    Metronic.scrollTo($("body"), 200);

    var Descriptiontxt = $("#" + rowid).find("td:eq(5)").text().replace(/<br>/g, '\n') //RFQDeccription.replace(/<br>/g, '\n')
    var RFQRemark = $("#" + rowid).find("td:eq(11)").text().replace(/<br>/g, '\n')

    sessionStorage.setItem('CurrentRFQParameterId', RFQParameterId)
    //$('#rowid').val(rowid.id)

    $('#txtshortname').val($("#" + rowid).find("td:eq(1)").text())

    $('#txttargetprice').val($("#" + rowid).find("td:eq(2)").text())

    $('#txtquantitiy').val($("#" + rowid).find("td:eq(3)").text())
    $('#txtlastinvoiceprice').val($("#" + rowid).find("td:eq(12)").text())

    $('#dropuom').val($("#" + rowid).find("td:eq(4)").text())
    $('#txtUOM').val($("#" + rowid).find("td:eq(4)").text())


    $('#txtItemRemarks').val(RFQRemark)

    $('#txtbiddescriptionP').val(Descriptiontxt)

    $('#txtedelivery').val($("#" + rowid).find("td:eq(6)").text())
    $("#attach-file3").attr("href", "PortalDocs/RFQ/" + sessionStorage.getItem("hddnRFQID") + "/" + $("#" + rowid).find("td:eq(7)").text()).html($("#" + rowid).find("td:eq(7)").text());
    $('#txtAttachmentDescription').val($("#" + rowid).find("td:eq(9)").text())
    $("#hddnattachmentSize").html($("#" + rowid).find("td:eq(10)").text().trim())
    $("#txttat").val($("#" + rowid).find("td:eq(8)").text())


    if ($("#" + rowid).find("td:eq(7)").text().trim() != '') {
        $("#attach-file3").show();
        $("#removeAttachmentTab2").show();

    } else {
        $("#attach-file3").hide();
        $("#removeAttachmentTab2").hide();
    }


    if ($("#" + rowid).find("td:eq(13)").text().trim() == 'N') {
        $("#checkmaskvendor").attr('checked', false);
        $("#checkmaskvendor").closest('span').removeClass('checked');
    } else {
        $("#checkmaskvendor").attr('checked', true);
        $("#checkmaskvendor").closest('span').addClass('checked');
    }

    $('#add_or').text('Modify');


}




function mapQuestion(RFQParameterId, RFQId) {

    $('#txtParentRFQParameterId').val(RFQParameterId);
    fetchRFIParameterComponent();

}

function fetchRFIParameterComponent() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFIParameterComponent/?RFQId=" + sessionStorage.getItem("hddnRFQID") + "&BOQparentId=" + $('#txtParentRFQParameterId').val() + "&VendorID=0" + "&RFQVersionId=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblRFQParameterComponet").empty();

            if (data.length > 0) {
                $('#scrolr').show();
                jQuery("#tblRFQParameterComponet").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>BOQ/BOM Name</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th class='hide'>Remark</th></tr></thead>");

                for (var i = 0; i < data.length; i++) {

                    jQuery('<tr id=trid' + i + '><td style="width:100px;"><button type=button class="btn /*btn-icon-only*/ btn-xs btn-success" onclick="edittableRow(\'' + data[i].RFQParameterId + '\',\'' + data[i].RFQShortName + '\',\'' + data[i].RFQTargetPrice + '\',\'' + data[i].RFQuantity + '\',\'' + data[i].RFQUomId + '\',\'' + data[i].RFQRemark + '\')" ><i class="fa fa-pencil" style="margin-top: 0px !important;"></i></button>&nbsp;<button type=button class="btn  /*btn-icon-only*/ btn-xs btn-danger" onclick="deletetablerow (\'' + data[i].RFQParameterId + '\',\'' + data[i].BOQparentId + '\')" ><i class="glyphicon glyphicon-remove-circle" style="margin-top: 0px !important;"></i></button></td><td>' + data[i].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td  class="hide">' + data[i].RFQRemark + '</td></tr>').appendTo("#tblRFQParameterComponet");

                }
                $('#modalLoader').addClass('display-none');
            }




        },
        error: function (result) {
            alert("error");

        }
    });
    jQuery.unblockUI();
}
function deletetablerow(RFQParameterId, BOQparentId) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    flag = "insert";
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/deleteRowRFQParameter/?RFQParameterId=" + RFQParameterId + "&BOQparentId=" + BOQparentId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            fetchRFIParameterComponent();
            fetchRFIParameteronload();
            Reset();
        },
        error: function (result) {
            alert("error");

        }
    });
    jQuery.unblockUI();
}
function edittableRow(RFQParameterId, RFQShortName, RFQTargetPrice, RFQuantity, RFQUomId, RFQRemark) {
    flag = 'Update';
    $('#txtChildRFQParameterId').val(RFQParameterId)
    $('#rowid').val(rowid.id)

    $('#txtmodelshortname').val(RFQShortName)

    $('#txtmodeltargetprice').val(RFQTargetPrice)

    $('#txtmodelquantity').val(RFQuantity)

    $('#ddlropuom').val(RFQUomId)
    $('#txtdrpUOM').val(RFQUomId)

    $('#txtmodelremark').val(RFQRemark)

    $('#btnsubmit').text('Modify');
}

function FormValidate() {

    $('#mapsections').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            txtmodelshortname: {
                required: true
            },

            txtmodelquantity: {
                required: true,
                number: true
            },
            txtdrpUOM: {
                required: true
            }, txtmodeltargetprice: {
                number: true
            }

        },
        messages: {


            txtmodelshortname: {
                required: "Short Name is required."
            },
            txtmodelquantity: {
                required: "Quantity is required."
            },
            txtdrpUOM: {
                required: "UOM is required."
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit   

        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.col-md-4').addClass('has-error'); // set error class to the control group
            $(element).closest('.col-md-10').addClass('has-error'); // set error class to the control group

        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element).closest('.col-md-4').removeClass('has-error'); // set error class to the control group
            $(element).closest('.col-md-10').removeClass('has-error');
        },

        success: function (label) {
            label.closest('.col-md-4').removeClass('has-error');
            label.closest('.col-md-10').removeClass('has-error');
            label.remove();
        },


        submitHandler: function (form) {
            if ($('#ddlropuom').val() == '') {
                $('#errormsg').text('Please select UOM properly!')
                $('#errordiv1').show();
                $('#errordiv1').fadeOut(3500);
            }
            else {
                insboqvalues();
            }

        }
    });


}

var flag = 'insert';

function insboqvalues() {
    var _cleanString6 = StringEncodingMechanism($('#txtmodelshortname').val());

    var ParameterID = 0;
    if ($('#txtChildRFQParameterId').val() != 0) {
        ParameterID = $('#txtChildRFQParameterId').val()
    } else {
        ParameterID = $('#txtParentRFQParameterId').val()
    }


    //jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    $('#loader-msg').html('Processing. Please Wait...!');
    $('.progress-form').show();
    var data = {
        "RFQParameterId": ParameterID,
        "RFQId": sessionStorage.getItem("hddnRFQID"),
        //"RFQShortName": $('#txtmodelshortname').val(),
        "RFQShortName": _cleanString6,
        "RFQTargetPrice": $('#txtmodeltargetprice').val(),
        "RFQuantity": $('#txtmodelquantity').val(),
        "RFQUomId": $('#ddlropuom').val(),
        "RFQRemark": '',
        "Flag": flag,
        "BOQparentId": ParameterID,
        "UserId": sessionStorage.getItem('UserID'),
        "SeqNo": 0


    }
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/InsUpdBOQParameter",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {

            if (data[0].GetMsz > 0) {

                fetchRFIParameterComponent();
                fetchRFIParameteronload();
                Reset();
            }
            else if (data[0].GetMsz == 0) {
                $('#errormsg').text('BOQ Parameter with same name already exists.!')
                $('#errordiv1').show();
                $('#errordiv1').fadeOut(3500);
                fetchRFIParameterComponent();
                fetchRFIParameteronload();
                Reset();
            }
        }
    });
    //jQuery.unblockUI();
    $('.progress-form').hide()

}
function Reset() {
    $('#txtmodelshortname').val('');
    $('#txtmodeltargetprice').val('');
    $('#txtmodelquantity').val('');
    $('#ddlropuom').val('');
    $('#txtdrpUOM').val('');
    $('#txtmodelremark').val('');
    $('#btnsubmit').text('Add');
    flag = 'insert';
    $('#txtChildRFQParameterId').val('0')
    $("#file-excel").val('');
    $("#temptableForExcelData").empty();
}
function deleterow(RFQParameterId, BOQparentId) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/deleteRowRFQParameter/?RFQParameterId=" + RFQParameterId + "&BOQparentId=" + BOQparentId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            fetchRFIParameteronload();

        },
        error: function (result) {
            alert("error");

        }
    });
}


function resetfun() {
    sessionStorage.setItem('CurrentRFQParameterId', 0)
    $('#add_or').text('Add');
    $('#txtshortname').val('');
    $('#txttargetprice').val('');
    $('#txtquantitiy').val('');
    $('#txtUOM').val('');
    $('#dropuom').val('');
    $('#txtItemRemarks').val('');
    $('#txtbiddescriptionP').val('');
    $('#txtedelivery').val('');
    $("#txttat").val('');
    $("#file3").val('');
    $("#txtAttachmentDescription").val('');
    $("#attach-file3").attr('href', '').html('');
    $("#removeAttachmentTab2").hide();
    jQuery('input:checkbox[name=checkmaskvendor]').attr('checked', false);

    jQuery('#checkmaskvendor').parents('span').removeClass('checked');

    $("#spnParamAttach").html('').hide();


}
var allUOM = '';
function FetchUOM(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + CustomerID, //FetchUOM
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#dropuom").empty();
            if (data.length > 0) {
                allUOM = data;
            }
            else {
                allUOM = '';
            }

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
            map[username.UOM] = username;
            usernames.push(username.UOM);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].UOM != "") {
            $('#dropuom').val(map[item].UOM)

        }
        else {
            gritternotification('Please select UOM  properly!!!');
        }

        return item;
    }

});

jQuery("#txtdrpUOM").keyup(function () {
    $('#ddlropuom').val('')

});
jQuery("#txtdrpUOM").typeahead({
    source: function (query, process) {
        var data = allUOM;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.UOM] = username;
            usernames.push(username.UOM);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].UOM != "") {
            $('#ddlropuom').val(map[item].UOM)

        }
        else {
            gritternotification('Please select UOM  properly!!!');
        }

        return item;
    }

});

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
        console.log($(this).text());
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

                jQuery("#dropCurrency").append(jQuery("<option></option>").val(data[i].CurrencyId).html(data[i].CurrencyNm));

            }

        }

    });

}

function RFQInviteVendorTab3() {
    var _cleanString7 = StringEncodingMechanism(jQuery('#txtrfqSubject').val());
    var _cleanString8 = StringEncodingMechanism(jQuery('#txtrfqdescription').val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorID = sessionStorage.getItem('UserID');
    var InsertQuery = '';

    $("#selectedvendorlistsPrev> tbody > tr").each(function (index) {


        InsertQuery = InsertQuery + " select " + sessionStorage.getItem("hddnRFQID") + "," + $.trim($(this).find('td:eq(0)').html()) + ",'" + $('#txtrfqSubject').val() + "',dbo.Decrypt('" + vendorID + "')," + $.trim($(this).find('td:eq(0)').html()) + ",'RFQVendor.html?RFQID=" + sessionStorage.getItem("hddnRFQID") + "','N',convert(DATETIME,'" + $("#txtrfqDuration").val() + "',103 )," + sessionStorage.getItem('CustomerID') + ",getdate() union all "; //(convert(nvarchar(11),b.RFQClosureDate,103 )


    });

    if (InsertQuery != '') {

        InsertQuery = "Insert into ActivityDetails(RFQId,VendorId,ActivityDescription,FromUserId,ToUserId,LinkURL,Status,RFQClosureDate,CustomerID,ReceiptDt)" + InsertQuery;
        InsertQuery = InsertQuery.substring(0, InsertQuery.length - 11);

    }
    else {
        InsertQuery = "Print 1";
    }

    var Tab3data = {
        "BidVendors": InsertQuery,
        "RFQId": sessionStorage.getItem("hddnRFQID"),
        "UserID": sessionStorage.getItem('UserID'),
        //"subject": jQuery('#txtrfqSubject').val(),
        "subject": _cleanString7,
        "Deadline": jQuery('#txtrfqDuration').val(),
        //"RFQDescription":jQuery('#txtrfqdescription').val()
        "RFQDescription": _cleanString8
    };
    //alert(JSON.stringify(Tab3data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RFQInviteVendors/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab3data),
        dataType: "json",
        success: function (data) {
            if (data[0].RFQId > 0) {
                jQuery.unblockUI();
                bootbox.alert("Request for Quotation Submitted Successfully.", function () {
                    sessionStorage.removeItem('CurrentBidID');
                    window.location = sessionStorage.getItem("HomePage")

                    return false;

                });
                return true;

            }
            else {
                jQuery.unblockUI();
                alert('error')
                return false;

            }
        }
    });
}


function FetchVender(ByBidTypeID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendor/?ByBidTypeID=" + ByBidTypeID + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
            if (data.length > 0) {
                $("#txtSearch").show();
            }
            jQuery("#tblvendorlist > tbody").empty();
            var vName = '';
            for (var i = 0; i < data.length; i++) {
                vName = data[i].VendorName;
                var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].VendorID + "'\)\"; id=\"chkvender" + i + "\" value=" + data[i].VendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].VendorName + " </td></tr>";

                jQuery('#tblvendorlist > tbody').append(str);

            }

        }

    });

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
            $('#chkvender' + vCount).prop("disabled", true);
            var vendorid = $('#chkvender' + vCount).val()
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

        var EvID = event.id;
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")
        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',' + EvID + ',SelecetedVendorPrev' + vendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
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

function ValidateVendor() {

    var status = "false";

    $("#tblvendorlist> tbody > tr").each(function (index) {

        if ($(this).find("span#spanchecked").attr('class') == 'checked') {

            status = "True";

        }
        else {
            status == "false";
        }

    });

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
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced1 = '';
    var replaced2 = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchReguestforQuotationDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            sessionStorage.setItem('hddnRFQID', RFQData[0].RFQId)
            jQuery('#txtrfqSubject').val(StringDecodingMechanism(RFQData[0].RFQSubject))
            setTimeout(function () { $('#dropCurrency').val(RFQData[0].RFQCurrencyId).attr("selected", "selected"); }, 1000)
            jQuery('#txtrfqdescription').val(StringDecodingMechanism(RFQData[0].RFQDescription))
            jQuery('#txtrfqDuration').val(RFQData[0].RFQDeadline)
            jQuery('#txtConversionRate').val(RFQData[0].RFQConversionRate);
            jQuery('#txtRFQReference').val(RFQData[0].RFQReference)
            $("#cancelBidBtn").show();
            if (RFQData[0].RFQTermandCondition != '') {
                $('#file1').attr('disabled', true);
                $('#closebtn').removeClass('display-none');
                replaced1 = RFQData[0].RFQTermandCondition.replace(/\s/g, "%20")
                if (RFQData[0].RFQAttachment != '') {
                    $('#file2').attr('disabled', true);
                    $('#closebtn2').removeClass('display-none');

                    replaced2 = RFQData[0].RFQAttachment.replace(/\s/g, "%20")
                }

            }
            jQuery('#attach-file').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + replaced1).html(RFQData[0].RFQTermandCondition)
            jQuery('#attach-file2').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + replaced2).html(RFQData[0].RFQAttachment)

            if (RFQData.length > 0) {
                for (var i = 0; i < RFQData.length; i++) {
                    jQuery('#mapedapprover').append(jQuery('<option selected></option>').val(RFQData[i].UserID).html(RFQData[i].UserName))
                }
            }


        }
    });
    jQuery.unblockUI();
}
var BoqStatus = '';
function fetchRFIParameteronload() {
    totalFileSize = 0;

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    BoqStatus = 'Y'
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQParameter/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=0" + "&RFQVersionId=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblRFQPrev").empty()
            $('#scrolr').show();

            if (data.length > 0) {
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th class='hide'>Attachment </th><th>TAT</th><th>Attachment Description</th><th>Remarks</th><th>Last Invoice Price</th><th></th></tr></thead>");
                jQuery('#tblRFQPrev').append('<thead><tr style="background: grey; color:light black;"><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th>TAT</th><th>Attachment Description</th><th>Remarks</th><th>Last Invoice Price</th></tr></thead>');
                var itemAttachment = '';
                for (var i = 0; i < data.length; i++) {
                    itemAttachment = data[i].AttachmentFile.replace(/ /g, "%20");

                    if (data[i].BOQparentId == 0) {

                        if (data[i].status == 'Yes') {
                            if (data[i].isBOQFilled == 'N') {

                                BoqStatus = 'N'
                                jQuery('<tr id=trid' + i + '><td style="width:100px;"><button type=button class="btn btn-xs btn-success" onclick="editRow(\'' + data[i].RFQParameterId + '\',\'trid' + i + '\')" ><i class="fa fa-pencil" style="margin-top: 0px !important;"></i></button>&nbsp<button type=button class="btn  btn-xs btn-danger" onclick="deleterow(\'' + data[i].RFQParameterId + '\',\'' + data[i].BOQparentId + '\')" ><i class="glyphicon glyphicon-remove-circle" style="margin-top: 0px !important;"></i></button></td><td>' + data[i].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td>' + data[i].RFQDescription + '</td><td>' + data[i].RFQDelivery + '</td><td class="hide">' + data[i].AttachmentFile + '</td><td class=text-right>' + data[i].TAT + '</td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + itemAttachment + ' target=_blank  >' + data[i].AttachmentDescription + '</a></td><td class="hide">' + data[i].AttachmentSize + '</td><td>' + data[i].RFQRemark + '</td><td class=text-right>' + data[i].RFQLastInvoicePrice + '</td><td class="hide">' + data[i].RFQBoq + '</td><td class="center-block"><button type="button" class="btn btn-xs red center-block" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].RFQParameterId + '\',\'' + sessionStorage.getItem("hddnRFQID") + '\')">BOQ/BOM </button></td></tr>').appendTo("#tblServicesProduct");


                            }
                            else {

                                jQuery('<tr id=trid' + i + '><td style="width:100px;"><button type=button class="btn btn-xs btn-success" onclick="editRow(\'' + data[i].RFQParameterId + '\',\'trid' + i + '\')" ><i class="fa fa-pencil" style="margin-top: 0px !important;"></i></button>&nbsp<button type=button class="btn  btn-xs btn-danger" onclick="deleterow(\'' + data[i].RFQParameterId + '\',\'' + data[i].BOQparentId + '\')" ><i class="glyphicon glyphicon-remove-circle" style="margin-top: 0px !important;"></i></button></td><td>' + data[i].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td>' + data[i].RFQDescription + '</td>><td>' + data[i].RFQDelivery + '</td><td class="hide">' + data[i].AttachmentFile + '</td><td class=text-right>' + data[i].TAT + '</td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + itemAttachment + ' target=_blank  >' + data[i].AttachmentDescription + '</a></td><td class="hide">' + data[i].AttachmentSize + '</td><td>' + data[i].RFQRemark + '</td><td class=text-right>' + thousands_separators(data[i].RFQLastInvoicePrice) + '</td><td class="hide">' + data[i].RFQBoq + '</td><td><button type="button" class="btn btn-xs green-haze" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].RFQParameterId + '\',\'' + sessionStorage.getItem("hddnRFQID") + '\')">BOQ/BOM  </button></td><td class="hide">' + data[i].RFQBoq + '</td></tr>').appendTo("#tblServicesProduct");



                            }


                        }

                        else {
                            jQuery('<tr id=trid' + i + '><td style="width:100px;"><button type=button class="btn btn-xs btn-success" onclick="editRow(\'' + data[i].RFQParameterId + '\',\'trid' + i + '\')" ><i class="fa fa-pencil" style="margin-top: 0px !important;"></i></button>&nbsp<button type=button class="btn  btn-xs btn-danger" onclick="deleterow(\'' + data[i].RFQParameterId + '\',\'' + data[i].BOQparentId + '\')" ><i class="glyphicon glyphicon-remove-circle" style="margin-top: 0px !important;"></i></button></td><td>' + data[i].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td>' + data[i].RFQDescription + '</td><td>' + data[i].RFQDelivery + '</td><td class="hide">' + data[i].AttachmentFile + '</td><td class=text-right>' + data[i].TAT + '</td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + itemAttachment + ' target=_blank >' + data[i].AttachmentDescription + '</a></td><td class="hide">' + data[i].AttachmentSize + '</td><td>' + data[i].RFQRemark + '</td><td class=text-right>' + thousands_separators(data[i].RFQLastInvoicePrice) + '</td><td class="hide">' + data[i].RFQBoq + '</td><td></td></tr>').appendTo("#tblServicesProduct");

                        }
                        totalFileSize += data[i].AttachmentSize;



                    }

                    $("#validattachmentSize").val(totalFileSize)

                    //for previe table
                    $('#wrap_scrollerPrev').show();

                    if ($.trim(data[i].RFQBoq) == 'Y') {

                        jQuery('#tblRFQPrev').append('<thead id=headid' + i + '><tr style="background: #f0f0f0; color: grey;"><th>' + data[i].RFQShortName + '&nbsp(BOQ Given Below)</th><th class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</th><th class=text-right>' + thousands_separators(data[i].RFQuantity) + '</th><th>' + data[i].RFQUomId + '</th><th>' + data[i].RFQDescription + '</th><th>' + data[i].RFQDelivery + '</th><th class="hide">' + data[i].AttachmentFile + '</th><th>' + data[i].TAT + '</th><th><a href=PortalDocs/RFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + itemAttachment + ' >' + data[i].AttachmentDescription + '</a></th><th class="hide">' + data[i].AttachmentSize + '</th><th>' + data[i].RFQRemark + '</th><th>' + thousands_separators(data[i].RFQLastInvoicePrice) + '</th></tr></thead>');
                        for (var j = 0; j < data.length; j++) {

                            if (data[i].RFQParameterId == data[j].BOQparentId && data[j].SeqNo != 0) {
                                jQuery("#tblRFQPrev > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[j].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[j].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[j].RFQuantity) + '</td><td>' + data[j].RFQUomId + '</td><td>' + data[j].RFQDescription + '</td><td>' + data[j].RFQDelivery + '</td><td class="hide">' + data[i].AttachmentFile + '</td><td>&nbsp;</td><td></td><td class="hide">' + data[i].AttachmentSize + '</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
                            }
                        }
                    }
                    else if ($.trim(data[i].RFQBoq) == 'N') {

                        for (var j = 0; j < data.length; j++) {

                            if (data[j].BOQparentId == 0 && data[j].RFQBoq == 'N ' && data[j].RFQParameterId == data[i].RFQParameterId) {

                                jQuery("#tblRFQPrev").append('<thead id=headid' + i + '><tr style="background: #f0f0f0; color: grey;" ><th>' + data[j].RFQShortName + '</th><th class=text-right>' + thousands_separators(data[j].RFQTargetPrice) + '</th><th class=text-right>' + thousands_separators(data[j].RFQuantity) + '</th><th>' + data[j].RFQUomId + '</th><th>' + data[j].RFQDescription + '</th><th>' + data[j].RFQDelivery + '</th><th class="hide">' + data[i].AttachmentFile + '</th><th>' + data[i].TAT + '</th><th><a href=PortalDocs/RFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + itemAttachment + ' >' + data[i].AttachmentDescription + '</a></th><th class="hide">' + data[i].AttachmentSize + '</th><th>' + data[i].RFQRemark + '</th><th class=text-right>' + data[i].RFQLastInvoicePrice + '</th></tr></thead>');

                            }
                        }
                    }
                }

            }

        },
        error: function (result) {
            alert("error");

        }
    });


    jQuery.unblockUI();

}



$('#responsive').on("hidden.bs.modal", function () {
    $('#txtmodelshortname').val('');
    $('#txtmodeltargetprice').val('');
    $('#txtmodelquantity').val('');
    $('#ddlropuom').val('');
    $('#txtdrpUOM').val('');
    $('#txtmodelremark').val('');
    $('#txtChildRFQParameterId').val('0');
    $('#txtParentRFQParameterId').val('0')
    $('#btnsubmit').text('Add');
    flag = 'insert';
    $("#error-excel").hide();
    $("#success-excel").hide();

    $("#file-excel").val('');
    $("#temptableForExcelData").empty();
    $("#instructionSpan").hide();
    $("#instructionsDiv").hide();
    $('#btnsyesnoBoqExcel').show()
    $('#modalLoader').addClass('display-none');
});

function btnNoUpload() {
    $("#instructionsDiv").hide();
    $("#instructionSpan").hide();
    $("#error-excel").hide();
    $("#success-excel").hide();
    $('#btnsyesnoBoqExcel').show()
    $("#file-excel").val('');
    $('#responsive').modal('hide');
    $('#modalLoader').addClass('display-none');
}
function ajaxFileDelete(closebtnid, fileid, filepath, deletionFor) {
    jQuery(document).ajaxStart(jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" /> Please Wait...</h5>' })).ajaxStop(jQuery.unblockUI);


    var formData = new window.FormData();
    formData.append("Path", filepath);

    $.ajax({

        url: 'ConfigureFileAttachment.ashx',

        data: formData,

        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function (data) {
            if (deletionFor == '2') {
                totalFileSize = (totalFileSize - $("#hddnattachmentSize").html());
                $("#validattachmentSize").val(totalFileSize)
                fileDeletefromdbForItem(closebtnid, fileid, filepath, deletionFor);
            } else {
                fileDeletefromdb(closebtnid, fileid, filepath, deletionFor);
            }


        },

        error: function () {

            bootbox.alert("Attachment error.");

        }

    });




    jQuery.unblockUI();

}

function fileDeletefromdb(closebtnid, fileid, filepath, deletionFor) {

    $('#' + closebtnid).remove();
    $('#' + filepath).html('')
    $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
    $('#' + fileid).attr('disabled', false);
    var BidData = {

        "BidId": deletionFor,
        "BidTypeID": 0,
        "UserId": sessionStorage.getItem('UserID'),
        "RFQRFIID": sessionStorage.getItem('hddnRFQID'),
        "RFIRFQType": 'RFQ'
    }

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FileDeletion/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function (data) {
            if (data[0].IsSuccess == '1') {
                $('#spansuccess1').html('File Deleted Successfully');
                success.show();
                Metronic.scrollTo(success, -200);
                success.fadeOut(5000);
            }
        }

    });
}

//File Dete for 2nd tab
function fileDeletefromdbForItem(closebtnid, fileid, filepath, deletionFor) {

    $('#' + closebtnid).hide();
    $('#' + filepath).html('')
    $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
    $('#' + fileid).attr('disabled', false);
    var BidData = {

        "BidId": deletionFor,
        "BidTypeID": 0,
        "UserId": sessionStorage.getItem('UserID'),
        "RFQRFIID": sessionStorage.getItem('hddnRFQID'),
        "RFIRFQType": 'RFQ',
        "RFQParameterID": sessionStorage.getItem('CurrentRFQParameterId')
    }

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FileDeletionRFQParameter/",
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function (data) {
            if (data[0].IsSuccess == '1') {
                $('#spansuccess1').html('File Deleted Successfully');
                $("#txtAttachmentDescription").val('');
                success.show();
                Metronic.scrollTo(success, -200);
                success.fadeOut(5000);
            }
        }

    });
}
$('#back_prev_btn').click(function () {
    $('#BidPreviewDiv').hide();
    $('#form_wizard_1').show();
});

function fetchPSBidDetailsForPreview() {
    var TermsConditionFileName = '';
    var AttachementFileName = '';

    jQuery('#lblRfqsubject').html($('#txtrfqSubject').val())
    jQuery('#lblrfqdeadline').html($('#txtrfqDuration').val())
    jQuery('#lblrfqdescription').html($('#txtrfqdescription').val())

    jQuery("#dropCurrencyPrev").html($('#dropCurrency option:selected').text())
    jQuery('#lblConversionRatePrev').html($('#txtConversionRate').val())
    jQuery("#txtRFQReferencePrev").html($('#txtRFQReference').val());


    if ($('#attach-file').html() != '' && ($('#file1').val() == '')) {
        $('#filepthtermsPrev').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + $('#attach-file').html().replace(/\s/g, "%20")).html($('#attach-file').html());

    } else {
        TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);

        $('#filepthtermsPrev').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + TermsConditionFileName.replace(/\s/g, "%20")).html(TermsConditionFileName);
    }


    if (($('#attach-file2').html() != '') && ($('#file2').val() == '')) {
        $('#filepthattachPrev').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + $('#attach-file2').html().replace(/\s/g, "%20")).html($('#attach-file2').html());
    } else {
        AttachementFileName = jQuery('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1);

        $('#filepthattachPrev').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + AttachementFileName.replace(/\s/g, "%20")).html(AttachementFileName);
    }


}

function fetchBidTypeMapping() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidTypeMapping/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlBidtype").empty();
            jQuery("#ddlBidtype").append(jQuery("<option ></option>").val("").html("Select Item/Services"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlBidtype").append(jQuery("<option ></option>").val(data[i].BidTypeID).html(data[i].BidTypeName));
            }
        }
    });
    jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("").html("Select"));
}
$("#ddlBidtype").on('change', function () {
    var bidType = $(this).val();
    FetchVender(bidType);
});


function handleFile(e) {
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
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                if (roa.length > 0) {
                    result = roa;
                }
            });
            //Get the first column first cell value
            //alert(JSON.stringify(result))
            printData(result)
        };
        reader.readAsArrayBuffer(f);
    }
}
function printData(result) {
    var loopcount = result.length; //getting the data length for loop.
    var i;
    var numberOnly = /^[0-9]+$/;
    $("#temptableForExcelData").empty();
    $("#temptableForExcelData").append("<tr><th>Short Name</th><th>Target</th><th>Quantity</th><th>UOM</th></tr>");
    // checking validation for each row
    var targetPrice = '';
    for (i = 0; i < loopcount; i++) {

        if ($.trim(result[i].ShortName) == '') {
            $("#error-excel").show();
            $("#errspan-excel").html('Short Name can not be blank. Please fill and upload the file again.');
            $("#file-excel").val('');
            return false;
        }
        else if ($.trim(result[i].Quantity) == '') {
            $("#error-excel").show();
            $("#errspan-excel").html('Quantity can not be blank. Please fill and upload the file again.');
            $("#file-excel").val('');
            return false;
        }
        else if (!result[i].Quantity.trim().match(numberOnly)) {

            $("#error-excel").show();
            $("#errspan-excel").html('Quantity should be in numbers only.');
            $("#file-excel").val('');
            return false;
        }
        else if ($.trim(result[i].UOM) == '') {
            $("#error-excel").show();
            $("#errspan-excel").html('UOM can not be blank. Please fill and upload the file again.');
            $("#file-excel").val('');
            return false;
        }
        else {
            if ($.trim(result[i].TargetPrice) == '') {
                targetPrice = 0;
            } else if (!result[i].TargetPrice.trim().match(numberOnly)) {

                $("#error-excel").show();
                $("#errspan-excel").html('Target Price should be in numbers only.');
                $("#file-excel").val('');
                return false;
            } else {
                targetPrice = $.trim(result[i].TargetPrice);
            }
            // if values are correct then creating a temp table
            $("<tr><td>" + result[i].ShortName + "</td><td>" + targetPrice + "</td><td>" + result[i].Quantity + "</td><td>" + result[i].UOM + "</td><td>" + (i + 1) + "</td></tr>").appendTo("#temptableForExcelData");

        }


    } // for loop ends
    var excelCorrect = 'N';
    var ErrorUOMMsz = '';
    var ErrorUOMMszRight = '';
    Rowcount = 0;


    $("#temptableForExcelData tr:gt(0)").each(function () {
        var this_row = $(this);
        excelCorrect = 'N';
        Rowcount = Rowcount + 1;
        for (var i = 0; i < allUOM.length; i++) {
            if ($.trim(this_row.find('td:eq(3)').html()).toLowerCase() == allUOM[i].UOM.trim().toLowerCase()) {//allUOM[i].UOMID
                excelCorrect = 'Y';
            }

        }
        var quorem = (allUOM.length / 2) + (allUOM.length % 2);
        if (excelCorrect == "N") {
            $("#error-excel").show();
            ErrorUOMMsz = 'UOM not filled properly at row no ' + Rowcount + '. Please choose UOM from given below: <br><ul class="col-md-2 text-left">';
            ErrorUOMMszRight = '<ul class="col-md-2 text-left">'
            for (var i = 0; i < parseInt(quorem); i++) {
                ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].UOM + '</li>';
                var z = (parseInt(quorem) + i);
                if (z <= allUOM.length - 1) {
                    ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].UOM + '</li>';
                }
            }
            ErrorUOMMsz = ErrorUOMMsz + '</ul>'
            ErrorUOMMszRight = ErrorUOMMszRight + '</ul><div class=clearfix></div><br/>and upload the file again.'


            $("#errspan-excel").html(ErrorUOMMsz + ErrorUOMMszRight);

            return false;
        }

    });


    if (excelCorrect == 'Y') {
        $('#btnsyesnoBoqExcel').show();
        $("#error-excel").hide();
        $("#success-excel").show();
        $("#succspan-excel").text('Excel file is found ok. Do you want to upload? \n This will clean your existing BOQ Data.')
        $("#file-excel").val('');
        excelCorrect = '';
    }
}


function InsupdRFQParameterfromExcel() {
    var _cleanString8 = StringEncodingMechanism($.trim(this_row.find('td:eq(0)').html()));

    $("#success-excel").hide();
    $("#error-excel").hide();
    $('#loader-msg').html('Processing. Please Wait...!');
    $('#modalLoader').removeClass('display-none');
    removeRFQParameterForExcel();
    var Seq = 0;
    var rcount = $("#temptableForExcelData tr").length;
    if (rcount > 0) {
        $("#temptableForExcelData tr:gt(0)").each(function () {
            Seq++;
            var this_row = $(this);

            var ParameterID = 0;
            if ($('#txtChildRFQParameterId').val() != 0) {
                ParameterID = $('#txtChildRFQParameterId').val()
            } else {
                ParameterID = $('#txtParentRFQParameterId').val()
            }


            //jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

            var data = {
                "RFQParameterId": ParameterID,
                "RFQId": sessionStorage.getItem("hddnRFQID"),
                //"RFQShortName": $.trim(this_row.find('td:eq(0)').html()),
                "RFQShortName": _cleanString8,
                "RFQTargetPrice": $.trim(this_row.find('td:eq(1)').html()),
                "RFQuantity": $.trim(this_row.find('td:eq(2)').html()),
                "RFQUomId": $.trim(this_row.find('td:eq(3)').html()),
                "RFQRemark": '',
                "Flag": 'insert',
                "BOQparentId": ParameterID,
                "UserId": sessionStorage.getItem('UserID'),
                "SeqNo": $.trim(this_row.find('td:eq(4)').html())

            }
            // alert(JSON.stringify(data))
            setTimeout(function () {
                jQuery.ajax({
                    url: sessionStorage.getItem("APIPath") + "RequestForQuotation/InsUpdBOQParameter",
                    beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                    data: JSON.stringify(data),
                    type: "POST",
                    cache: false,
                    crossDomain: true,
                    processData: true,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        //alert(data[0].GetMsz)
                        if (data[0].GetMsz > 0) {
                            $("#success-excel").show()
                            $('#btnsyesnoBoqExcel').hide()
                            $("#succspan-excel").html('Excel file uploaded sucessfully')
                            return true;
                        }

                    }
                });
            }, 500 * Seq)

        });
        setTimeout(function () {
            $('#modalLoader').addClass('display-none');

            fetchRFIParameteronload();
            fetchRFIParameterComponent();
        }, 500 * rcount)
    }
    else {
        $("#error-excel").show();
        $('#btnsyesnoBoqExcel').hide()
        $("#errspan-excel").html('No Items Found in Excel');
    }



    Reset();
}
$("#btninstructionexcelparameter").click(function () {
    var ErrorUOMMsz = '<ul class="col-md-3 text-left">';
    var ErrorUOMMszRight = '<ul class="col-md-3 text-left">'
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
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                if (roa.length > 0) {
                    result = roa;
                }
            });
            //Get the first column first cell value
            //alert(JSON.stringify(result))
            printDataparameter(result)
        };
        reader.readAsArrayBuffer(f);
    }
}
function printDataparameter(result) {
    var loopcount = result.length; //getting the data length for loop.

    var i;
    var numberOnly = /^[0-9]+$/;
    $("#temptableForExcelDataparameter").empty();
    $("#temptableForExcelDataparameter").append("<tr><th>ItemService</th><th>TargetPrice</th><th>Quantity</th><th>UOM</th><th>Description</th><th>TAT</th><th>DeliveryLocation</th><th>Remarks</th><th>LastInvoicePrice</th></tr>");
    // checking validat  alert(loopcount)
    var targetPrice = 0;
    var TAT = 0;
    var Lastinvoiceprice = 0
    for (i = 0; i < loopcount; i++) {
        if ($.trim(result[i].TAT) == '') {
            TAT = 0;
        }
        else {
            TAT = $.trim(result[i].TAT);
        }
        if ($.trim(result[i].LastInvoicePrice) == '') {
            Lastinvoiceprice = 0;
        }
        else {
            Lastinvoiceprice = $.trim(result[i].LastInvoicePrice);
        }
        if ($.trim(result[i].TargetPrice) == '') {
            targetPrice = 0;
        }
        else {
            targetPrice = $.trim(result[i].TargetPrice);
        }
        if ($.trim(result[i].ItemService) == '' && $.trim(result[i].ItemService) > 200) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Item/Service can not be blank or length should be 200 characters of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].Remarks) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Remarks can not be blank of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].Quantity) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Quantity can not be blank of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].Description) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Description can not be blank of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (!result[i].Quantity.trim().match(numberOnly)) {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Quantity should be in numbers only of item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].UOM) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('UOM can not be blank of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (TAT != '' && (!TAT.match(numberOnly) || TAT.length > 4)) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('TAT should be in numbers only and maximum 4 digits allowed of item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;

        }
        else if (Lastinvoiceprice != '' && (!Lastinvoiceprice.match(numberOnly))) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Last Invoice Price should be in numbers only of item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;

        }
        else if ($.trim(result[i].DeliveryLocation) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Delivery Location can not be blank of item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (targetPrice != '' && (!targetPrice.match(numberOnly))) {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Target Price should be in numbers only of item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;
        }

        else {


            $("<tr><td>" + result[i].ItemService + "</td><td>" + targetPrice + "</td><td>" + result[i].Quantity + "</td><td>" + result[i].UOM + "</td><td>" + result[i].Description + "</td><td>" + TAT + "</td><td>" + result[i].DeliveryLocation + "</td><td>" + result[i].Remarks + "</td><td>" + Lastinvoiceprice + "</td></tr>").appendTo("#temptableForExcelDataparameter");
        }




    } // for loop ends
    var excelCorrect = 'N';
    var ErrorUOMMsz = '';
    var ErrorUOMMszRight = '';
    Rowcount = 0;

    $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
        var this_row = $(this);
        excelCorrect = 'N';
        Rowcount = Rowcount + 1;
        for (var i = 0; i < allUOM.length; i++) {
            if ($.trim(this_row.find('td:eq(3)').html()).toLowerCase() == allUOM[i].UOM.toLowerCase()) {//allUOM[i].UOMID
                excelCorrect = 'Y';
            }

        }
        var quorem = (allUOM.length / 2) + (allUOM.length % 2);
        if (excelCorrect == "N") {
            $("#error-excelparameter").show();
            ErrorUOMMsz = 'UOM not filled properly at row no ' + Rowcount + '. Please choose UOM from given below: <br><ul class="col-md-2 text-left">';
            ErrorUOMMszRight = '<ul class="col-md-2 text-left">'
            for (var i = 0; i < parseInt(quorem); i++) {
                ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].UOM + '</li>';
                var z = (parseInt(quorem) + i);
                if (z <= allUOM.length - 1) {
                    ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].UOM + '</li>';
                }
            }
            ErrorUOMMsz = ErrorUOMMsz + '</ul>'
            ErrorUOMMszRight = ErrorUOMMszRight + '</ul><div class=clearfix></div><br/>and upload the file again.'

            // alert(ErrorUOMMsz + ErrorUOMMszRight)
            $("#errspan-excelparameter").html(ErrorUOMMsz + ErrorUOMMszRight);

            return false;
        }

    });

    if (excelCorrect == 'Y') {
        $("#error-excelparameter").hide();

        $("#success-excelparameter").show();
        $('#btnsforYesNo').show()
        $("#succspan-excelparameter").html('Excel file is found ok. Do you want to upload? \n This will clean your existing BOQ Data.')
        $("#file-excelparameter").val('');

        excelCorrect = '';
    }
}


function InsupdRFQParameterfromExcelparameter() {
    var _cleanString9 = StringEncodingMechanism($.trim(this_row.find('td:eq(0)').html()));
    var _cleanString10 = StringEncodingMechanism($.trim(this_row.find('td:eq(7)').html()));
    var _cleanString11 = StringEncodingMechanism($.trim(this_row.find('td:eq(4)').html()));

    $("#success-excelparameter").hide();
    $('#btnsforYesNo').show()
    $("#error-excelparameter").hide();
    $('#loader-msgparameter').html('Processing. Please Wait...!');
    $('#modalLoaderparameter').removeClass('display-none');
    removeRFQitemsForExcel(); // // remove all rfq existing parameter
    var rowCount = jQuery('#temptableForExcelDataparameter tr').length;
    var i = 0;
    if (rowCount > 0) {
        $("#temptableForExcelDataparameter tr:gt(0)").each(function () {

            var this_row = $(this);
            i = i + 1;

            var data = {
                "RFQParameterId": sessionStorage.getItem('CurrentRFQParameterId'),
                "RFQId": sessionStorage.getItem('hddnRFQID'),
                //"RFQShortName": $.trim(this_row.find('td:eq(0)').html()),
                "RFQShortName": _cleanString9,
                "RFQTargetPrice": $.trim(this_row.find('td:eq(1)').html()),
                "RFQLastInvoicePrice": $.trim(this_row.find('td:eq(8)').html()),
                "RFQuantity": $.trim(this_row.find('td:eq(2)').html()),
                "RFQUomId": $.trim(this_row.find('td:eq(3)').html()),
                //"RFQRemark": $.trim(this_row.find('td:eq(7)').html()),
                "RFQRemark": _cleanString10,
                //"RFQDescription": $.trim(this_row.find('td:eq(4)').html()),
                "RFQDescription": _cleanString11,
                "TAT": $.trim(this_row.find('td:eq(5)').html()),
                "AttachmentDescription": '',
                "AttachmentFile": '',
                "AttachmentSize": 0,
                "RFQBoq": 'N',
                "RFQDelivery": $.trim(this_row.find('td:eq(6)').html()),
                "BOQparentId": 0,
                "UserId": sessionStorage.getItem('UserID')


            }
            // alert(JSON.stringify(data))
            setTimeout(function () {

                jQuery.ajax({
                    url: sessionStorage.getItem("APIPath") + "RequestForQuotation/InsUpdRFQParameter",
                    beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                    data: JSON.stringify(data),
                    type: "POST",
                    cache: false,
                    crossDomain: true,
                    processData: true,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {

                        if (data[0].GetMsz == 1) {
                            $("#success-excelparameter").show()
                            $('#btnsforYesNo').hide()
                            $("#succspan-excelparameter").html('Excel file uploaded sucessfully')
                            return true;
                        }
                        else if (data[0].GetMsz == 3) {
                            $("#error-excelparameter").show();
                            $("#errspan-excelparameter").html('RFQ Item with same name already exists at row no ' + i + ' . Item will not insert.!')

                        }

                    },
                    error: function (result) {
                        $('#modalLoaderparameter').addClass('display-none');
                        $('#btnsforYesNo').hide()
                        $("#error-excelparameter").show();
                        $("#errspan-excelparameter").html('You have error. Please try again.');
                        return false;
                    }
                });

            }, 500 * i)


        });
        setTimeout(function () {

            fetchRFIParameterComponent();
            fetchRFIParameteronload();
            $('#RfqParameterexcel').modal('hide');

        }, 500 * rowCount)
    }

    else {
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html('No Items Found in Excel');
    }

}

function removeRFQitemsForExcel() {
    var data = {
        "RFQParameterId": sessionStorage.getItem('hddnRFQID'),
        "Flag": "RFQItems"

    }
    // alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RemoveRFQParameterForExcel",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            //alert(data[0].GetMsz)
            if (data[0].GetMsz > 0) {
                return true;
            }
            else if (data[0].GetMsz == 0) {
            }
        }
    });
}

function removeRFQParameterForExcel() {

    var data = {
        "RFQParameterId": $('#txtParentRFQParameterId').val(),
        "Flag": "BOQ"

    }
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RemoveRFQParameterForExcel",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            //alert(data[0].GetMsz)
            if (data[0].GetMsz > 0) {
                return true;
            }
            else if (data[0].GetMsz == 0) {
            }
        }
    });
}


$("#btninstructionexcel").click(function () {
    var ErrorUOMMsz = '<ul class="col-md-3 text-left">';
    var ErrorUOMMszRight = '<ul class="col-md-3 text-left">'
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


    $("#ULUOMBOQ_instructions").html(ErrorUOMMsz + ErrorUOMMszRight);
    $("#instructionsDiv").show();
    $("#instructionSpan").show();
});

function fetchVendorGroup(categoryFor, childId) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=" + categoryFor + "&MappedBy=" + sessionStorage.getItem('UserID') + "&ChildId=" + childId,
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
        error: function (result) {
            alert("error");
            jQuery.unblockUI();

        }
    });
}

jQuery("#txtVendorGroup").typeahead({
    source: function (query, process) {
        var data = vendorsForAutoComplete
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.CategoryName] = username;
            usernames.push(username.CategoryName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].CategoryID != "0") {
            getCategoryWiseVendors(map[item].CategoryID);
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

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorCategoryWise_PEV2/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&CategoryID=" + categoryID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#tblvendorlist > tbody").empty();
            var vName = '';
            for (var i = 0; i < data.length; i++) {
                vName = data[i].VendorName;
                var str = "<tr><td class='hide'>" + data[i].VendorID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].VendorID + "'\)\"; id=\"chkvender" + data[i].VendorID + "\" value=" + data[i].VendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].VendorName + " </td></tr>";

                jQuery('#tblvendorlist > tbody').append(str);

            }

            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {
                    console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()))
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")

                });
            }
        }

    });


}

function showFileName(fileid) {
    var filename = '';
    filename = $('#' + fileid.id)[0].files[0].name
    $("#spnParamAttach").html(filename).show();
}


