
var error = $('.alert-danger');
var success = $('.alert-success');

var form = $('#submit_form');
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
var _RFQBidType = "";
var Vehicleerror1 = $('#errordiv1');
var Vehiclesuccess1 = $('#successdiv1');
$('.maxlength').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
jQuery.validator.addMethod("dollarsscents", function (value, element) {
    return this.optional(element) || /^\d{0,18}(\.\d{0,3})?$/i.test(removeThousandSeperator(value));
}, "You must include three decimal places");
function formValidation() {

    $('#mapPrices').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtbasicPrice: {
                required: true,
                dollarsscents: true
            }
        },
        messages: {
        },
        invalidHandler: function (event, validator) { //display error alert on form submit   

        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.col-md-6').addClass('has-error'); // set error class to the control group


        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element).closest('.col-md-6').removeClass('has-error'); // set error class to the control group

        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },

        success: function (label) {
            label.closest('.col-md-6').removeClass('has-error');
            label.remove();
        },
        submitHandler: function (form) {
            RFQinsertItemsTC('Y');
        }
    });
    //Form Validation for Cancel Reason
    var form1 = $('#frmRemarksRegret');
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
                required: "Please enter Regret Reason."
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
            fnConfirmRegretted();

        }
    });

}


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

                },

                messages: {

                },
                errorPlacement: function (error, element) {
                    if (element.attr("name") == "gender") {
                        error.insertAfter("#form_gender_error");

                    } else if (element.attr("name") == "payment[]") {
                        error.insertAfter("#form_payment_error");
                    } else if (element.attr("name") == "txtPODate") {
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
                        .closest('.col-md-4,.xyz').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {
                    $(element)
                        .closest('.inputgroup').removeClass('has-error');
                    $(element)
                        .closest('.col-md-4,.xyz').removeClass('has-error');

                },
                success: function (label) {
                    label.addClass('valid') // mark the current input as valid and display OK icon
                        .closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    label.closest('.col-md-4,.xyz').removeClass('has-error').addClass('has-success'); // set success class to the control group

                },

                submitHandler: function (form) {
                    // success.show();
                    error.hide();
                }
            });

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

                    if (index == 1) {

                    }
                    else if (index == 2) {

                        var flagQ = "T";
                        var rowCountQ = jQuery('#tblquestions tr').length;

                        var countQ = 1;
                        for (i = 0; i < rowCountQ - 1; i++) {
                            if ($("#answers" + i).val() == "") {
                                $('#answers' + i).removeClass('has-success')
                                $('#answers' + i).css("border", "1px solid red")
                                flagQ = "F";
                                // $('#form_wizard_1').bootstrapWizard('previous');
                                $('.alert-danger').show();
                                $('#spandanger').html('Please fill RFQ Answer.');
                                Metronic.scrollTo($(".alert-danger"), -200);
                                $('.alert-danger').fadeOut(7000);
                                countQ = countQ + 1;
                            }
                            else {
                                flagQ = "T"
                            }
                        }
                        if (flagQ == "F") {//&& rowCountQ == countQ
                            return false;
                        }
                        else if (jQuery('#fileToUpload1').val() != "") {
                            $('.alert-danger').show();
                            $('#spandanger').text('Your file is not attached. Please do press "+" button after uploading the file.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(7000);
                            return false;
                        }
                        else {
                            if (flagQ == "T") {
                                fnsaveAttachmentsquestions();

                            }
                        }

                    }
                    else if (index == 3) {

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
                var flag = "T";
                var rowCount = jQuery('#tblRFQLevelTCForQuot tr').length;

                var count = 1;
                for (i = 0; i < rowCount - 1; i++) {
                    if ($("#commremarks" + i).val() == "" || $("#commremarks" + i).val() == "0") {
                        $('#commremarks' + i).removeClass('has-success')
                        $('#commremarks' + i).css("border", "1px solid red")
                        flag = "F";
                        // $('#form_wizard_1').bootstrapWizard('previous');
                        $('.alert-danger').show();
                        $('#spandanger').html('Please fill RFQ Commercial Terms.');
                        Metronic.scrollTo($(".alert-danger"), -200);
                        $('.alert-danger').fadeOut(7000);
                        count = count + 1;
                    }
                    else {
                        flag = "T"
                    }
                }
                if (flag == "F") {
                    return false;
                }

                if (flag == "T") {
                    saveQuotation();
                    $('#BidPreviewDiv').show();
                    $('#form_wizard_1').hide();
                    return true;
                }

            }).hide();



            //unblock code
            jQuery.unblockUI();
        }

    };

}();


sessionStorage.setItem('CurrentrfiID', 0)
sessionStorage.setItem('CurrentRFQParameterId', 0)
$(document).on('keyup', '.form-control', function () {
    if ($.trim($('.form-control').val()).length) {
        $(this).addClass('has-success');
    }
});


function fncheckItemWiseTC(ver, BoqPID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchRFQParameterlastquotes/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver + "&RFQPID=" + BoqPID + "&Flag=ForTC",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                fetchRFQParameterComponent(ver, BoqPID);
            }
            else {
                fetchRFQParameterComponent(ver - 1, BoqPID);
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

function fetchAttachments() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            jQuery("#tblAttachments").empty();
            jQuery("#tblotherrfqattachmentprev").empty();
            if (data[0].attachments.length > 0) {
                jQuery("#tblAttachments").append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")
                jQuery("#tblotherrfqattachmentprev").append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")
                $('#div_attachments').removeClass('hide')
                $('#div_otherrfqattachprev').removeClass('hide')
                $('#headerotherrfqattach').removeClass('hide')
                $('#wrap_scrollerPrevAtt').show();

                for (var i = 0; i < data[0].attachments.length; i++) {
                    var str = "<tr><td style='width:50%!important'>" + data[0].attachments[i].rfqAttachmentDescription + "</td>";

                    str += '<td class=style="width:50%!important"><a id=eRFQFiles' + i + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;"  onclick="DownloadFile(this)"  >' + data[0].attachments[i].rfqAttachment + '</a></td>';
                    jQuery('#tblAttachments').append(str);
                    jQuery('#tblotherrfqattachmentprev').append(str);
                }
            }
            else {
                $('#div_attachments').addClass('hide')
                $('#div_otherrfqattachprev').addClass('hide')
                $('#headerotherrfqattach').addClass('hide')
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
$(document).on("input", ".numeric", function () {
    //this.value = this.value.replace(/\D/g, '');
    this.value = this.value.replace(/[^0-9\.]/g, '');
});
function fetchRFQParameterComponent(version, BoqPID) {


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQfetchTCQuotation/?RFQId=" + sessionStorage.getItem("hddnRFQID") + "&ParameterID=" + BoqPID + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + version,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblRFQParameterComponet").empty();
            $('#scrolr').show();

            if (data.length > 0) {

                jQuery("#tblRFQParameterComponet").append("<thead><tr style='background: gray; color: #FFF;'><th>Commercial Terms</th><th>Applicable Rate %age</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {


                    jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].rfqParameterId + '</td><td class=hidden >' + data[i].rfqid + '</td><td class=hidden >' + data[i].tcid + '</td><td>' + data[i].tcName + '</td><td><input type="text"  id="mkswithtax1' + i + '" class="form-control text-right numeric" value="' + thousands_separators(data[i].rfqVendorPricewithTax) + '"  autocomplete=off   onkeyup="this.value=minmax(this.value, 0, 90)" /></td></tr>').appendTo("#tblRFQParameterComponet");

                }
            }
            else {

                jQuery("#tblRFQParameterComponet").append('<tr><td>No Information is there..</td></tr>');
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

function fetchRFQLevelTC(ver) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQfetchTCQuotation/?RFQId=" + sessionStorage.getItem("hddnRFQID") + "&ParameterID=" + 0 + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblRFQLevelTCForQuot").empty();
            jQuery("#tbltermsconditionprev").empty();
            $('#scrolr').show();

            //alert(JSON.stringify(data))
            if (data.length > 0) {

                jQuery("#tblRFQLevelTCForQuot").append("<thead><tr style='background: gray; color: #FFF;'><th>Other Commercial Terms</th><th>Our Requirement</th><th>Your Offer</th></tr></thead>");
                jQuery("#tbltermsconditionprev").append("<thead><tr style='background: gray; color: #FFF;'><th>Other Commercial Terms</th><th>Our Requirement</th><th>Your Offer</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {

                    jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].tcid + '</td><td class=hidden >' + data[i].rfqid + '</td><td class=hide>' + data[i].conditionType + '</td><td style="width:20%">' + data[i].tcName + '</td><td>' + data[i].requirement + '</td><td><textarea name=comm rows=2 class="form-control" maxlength=1000  autocomplete=off id=commremarks' + i + ' >' + data[i].rfqRemark + '</textarea></td></tr>').appendTo("#tblRFQLevelTCForQuot");
                    jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].tcid + '</td><td class=hidden >' + data[i].rfqid + '</td><td class=hide>' + data[i].conditionType + '</td><td style="width:20%">' + data[i].tcName + '</td><td>' + data[i].requirement + '</td><td><label class="control-label" >' + data[i].rfqRemark + '</label></td></tr>').appendTo("#tbltermsconditionprev");

                    $('#commremarks' + i).maxlength({
                        limitReachedClass: "label label-danger",
                        alwaysShow: true
                    });
                }
            }
            else {

                jQuery("#tblRFQLevelTCForQuot").append('<thead><td>No Other Specified Commecial Terms..</td></thead>');
                jQuery("#tbltermsconditionprev").append('<thead><td>No Other Specified Commecial Terms..</td></thead>');
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
        $('#spandanger').text('Please Enter Attachment Description');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (jQuery('#fileToUpload1').val() == "") {
        $('.alert-danger').show();
        $('#spandanger').text('Please Attach File Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else {
        var attchname = jQuery('#fileToUpload1').val().substring(jQuery('#fileToUpload1').val().lastIndexOf('\\') + 1)
        attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
        rowAttach = rowAttach + 1;
        $('#headerresposeatt').removeClass('hide')
        $('#dicresponseatt').removeClass('hide')
        if (!jQuery("#tblAttachmentsPrev thead").length) {
            jQuery('#tblAttachmentsPrev').append("<thead><tr><th class='bold'>Attachment Description</th><th class='bold'>Attachment</th></tr></thead>");
            var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        }
        else {
            var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        }
        strprev += '<td class=style="width:47%!important"><a style="pointer:cursur;text-decoration:none;" id=eRFQVFilesPrev' + rowAttach + ' href="javascript:;" onclick="DownloadFileVendor(this)" >' + attchname + '</a></td>';
        jQuery('#tblAttachmentsPrev').append(strprev);


        var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        str += '<td class=hide>' + attchname + '</td>'
        str += '<td class=style="width:47%!important"><a style="pointer:cursur;text-decoration:none;"  id=eRFQVFiles' + rowAttach + ' href="javascript:;" onclick="DownloadFileVendor(this)" >' + attchname + '</a></td>';
        str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger" id=Removebtnattach' + rowAttach + ' onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + attchname + '\',\'VAttachment\',0)" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblAttachmentsresponse').append(str);
        fnUploadFilesonAzure('fileToUpload1', attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + sessionStorage.getItem('RFQVersionId'));

        //** function to insert record in DB after file upload on Blob
        fnsaveAttachmentsquestions();

        // var arr = $("#tblAttachmentsresponse tr");

        //$.each(arr, function (i, item) {
        //    var currIndex = $("#tblAttachmentsresponse tr").eq(i);
        //    var matchText = currIndex.find("td:eq(1)").text().toLowerCase();
        //    if (rowAttach == 1) {
        //        //** Upload Files on Azure PortalDocs folder first Time
        //        fnUploadFilesonAzure('fileToUpload1', attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId')+'/'+ sessionStorage.getItem('RFQVersionId'));
        //    }

        //    $(this).nextAll().each(function (i, inItem) {

        //        if (matchText === $(this).find("td:eq(1)").text().toLowerCase()) {
        //            $(this).remove();
        //        }
        //        if (matchText != $(this).find("td:eq(1)").text().toLowerCase()) {

        //            //** Upload Files on Azure PortalDocs folder
        //            fnUploadFilesonAzure('fileToUpload1', attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') +'/'+ sessionStorage.getItem('RFQVersionId'));

        //        }
        //    });
        //});
        jQuery("#AttachDescription1").val('')
        jQuery('#fileToUpload1').val('')



    }
}
function deleteattachrow(rowid, rowidPrev, filename, deletionfor, srno) {

    rowAttach = rowAttach - 1;
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();
    if (rowAttach == 0) {
        $('#headerresposeatt').addClass('hide')
        $('#dicresponseatt').addClass('hide')
    }
    //** delete Existing File (if any) on Azure/DB

    fnFileDeleteAzure(filename, 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + sessionStorage.getItem('RFQVersionId'), deletionfor, srno)

}
//** vendor response file deletion from DB
function fileDeletefromdb(srno, deletionFor) {

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
function fetchRFQResponseTocheckVersion(Flag, ver) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchVendorResponsechkversionAttachQues/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver + "&Flag=" + Flag,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            if (Flag == 'Question') {
                if (data.length > 0) {
                    fetchRFQResponse(Flag, ver)
                }
                else {
                    fetchRFQResponse(Flag, ver - 1)
                }
            }
            else {
                if (data.length > 0) {
                    fetchRFQResponse(Flag, ver)
                }
                else {
                    fetchRFQResponse(Flag, ver - 1)
                }
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
function fetchRFQResponse(Flag, version) {

    var strprev = "";
    // alert(sessionStorage.getItem("APIPath") + "eRFQVendor/efetchVendorResponse/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + sessionStorage.getItem('RFQVersionId') + "&Flag=" + Flag)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchVendorResponse/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + version + "&Flag=" + Flag,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            if (Flag == 'Question') {
                jQuery("#tblquestions").empty();
                jQuery("#tblQuestionsPrev").empty();

                if (data.length > 0) {
                    $('#headerspecificresponse').removeClass('hide')
                    $('#divspecificresponse').removeClass('hide')
                    jQuery('#tblquestions').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Questions</th><th class='bold' style='width:30%!important'>Our Requirement</th><th class='bold' style='width:10%!important'>Attachment</th><th style='width:30%!important'>Answer</th></tr></thead>");
                    jQuery('#tblQuestionsPrev').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Questions</th><th class='bold' style='width:30%!important'>Our Requirement</th><th class='bold' style='width:10%!important'>Attachment</th><th style='width:30%!important'>Answer</th></tr></thead>");

                    for (var i = 0; i < data.length; i++) {
                        var attachQA = data[i].attachementQA;
                        str = "<tr><td style='width:30%!important'>" + data[i].rfqQuestions + "</td>";
                        strprev = "<tr><td style='width:30%!important'>" + data[i].rfqQuestions + "</td>";
                        str += "<td style='width:30%!important'>" + data[i].rfqQuestionsRequirement + "</td>";
                        strprev += "<td style='width:30%!important'>" + data[i].rfqQuestionsRequirement + "</td>";
                        str += "<td class='hide'>" + data[i].questionID + "</td>";
                        str += '<td style="width:10%!important"><span style="width:300px!important" class="btn blue"><input type="file" id=fileToUploadques' + i + ' name=fileToUploadques' + i + ' onchange="checkfilesize(this);" /></span><br>  <a id=eRFQVFilesques' + i + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this)>' + attachQA + '</a> </td>';
                        strprev += '<td style="width:10%!important"><a id=fileDownAtt' + i + ' style="pointer:cursur;text-decoration:none;" href=javascript:; onclick=DownloadFileVendor(this)>' + attachQA + '</a></td>';//' + data[i].answer + '
                        str += '<td style="width:30%!important"><textarea type=text class="form-control" maxlength=500 autocomplete="off" id=answers' + i + ' value=' + data[i].answer + '>' + data[i].answer + '</textarea></td></tr>';
                        strprev += '<td style="width:30%!important"><label class="control-label" id=lblanswer' + i + '></label></td></tr>';//' + data[i].answer + '


                        jQuery('#tblquestions').append(str);
                        jQuery('#tblQuestionsPrev').append(strprev);
                        $('#lblanswer' + i).html($('#answers' + i).val())

                        $('#answers' + i).maxlength({
                            limitReachedClass: "label label-danger",
                            alwaysShow: true
                        });

                    }
                }
                else {
                    $('#headerspecificresponse').addClass('hide')
                    $('#divspecificresponse').addClass('hide')
                }
            }
            else {

                jQuery("#tblAttachmentsresponse").empty();
                jQuery("#tblAttachmentsPrev").empty();
                if (data.length > 0) {
                    $('#headerresposeatt').removeClass('hide')
                    $('#dicresponseatt').removeClass('hide')
                    jQuery('#tblAttachmentsresponse').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th><th></th></tr></thead>");
                    jQuery('#tblAttachmentsPrev').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>");

                    for (var i = 0; i < data.length; i++) {

                        rowAttach = rowAttach + 1;
                        attach = data[i].attachment.replace(/\s/g, "%20");
                        var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important" >' + data[i].attachmentdescription + '</td>';
                        strprev += '<td class=style="width:47%!important"><a id=eRFQVFilesPrev' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a></td>';
                        jQuery('#tblAttachmentsPrev').append(strprev);

                        var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + data[i].attachmentdescription + '</td>';
                        str += '<td class=style="width:47%!important"><a id=eRFQVFiles' + rowAttach + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick="DownloadFileVendor(this)">' + data[i].attachment + '</a></td>';
                        str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger" id=Removebtnattach' + i + '  onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + data[i].attachment + '\',\'VAttachment\',\'' + data[i].id + '\')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
                        jQuery('#tblAttachmentsresponse').append(str);

                        if (parseInt(sessionStorage.getItem('RFQVersionId')) > version) {
                            $('#Removebtnattach' + i).attr('disabled', 'disabled')
                        }
                        else {
                            $('#Removebtnattach' + i).removeAttr('disabled')
                        }


                    }
                }
                else {
                    $('#headerresposeatt').addClass('hide')
                    $('#dicresponseatt').addClass('hide')
                }

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
function fnsaveAttachmentsquestions() {
    var attchquery = '';
    var quesquery = '';
    var i = 1;
    var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    var CurDt = new Date();
    var validateSubmit = true;
    if (EndDT < CurDt) {
        validateSubmit = false;
        bootbox.alert("RFQ submission time has ended.", function () {

            if (sessionStorage.getItem("ISFromSurrogateRFQ") == "Y") {
                window.location = sessionStorage.getItem('HomePage');
                sessionStorage.clear();

            }
            else {
                window.location = 'VendorHome.html';
                jQuery.unblockUI();
            }
            return false;
        });

    }
    if (validateSubmit) {
        $("#tblAttachmentsresponse> tbody > tr").each(function (index) {

            var this_row = $(this);
            attchquery = attchquery + $.trim(this_row.find('td:eq(0)').text()) + '~' + $.trim($('#eRFQVFilesPrev' + i).text()) + '#';
            i++;
        });
        i = 0;
        var attchname = '';
        $("#tblquestions> tbody > tr").each(function (index) {
            var this_row = $(this);

            if ($('#fileToUploadques' + index).val() != null && $('#fileToUploadques' + index).val() != '') {
                attchname = jQuery('#fileToUploadques' + index).val().substring(jQuery('#fileToUploadques' + index).val().lastIndexOf('\\') + 1)
                fnUploadFilesonAzure('fileToUploadques' + index, attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + sessionStorage.getItem('RFQVersionId'));
            }
            if (attchname == null || attchname == '') {
                if (jQuery('#eRFQVFilesques' + index).val() != null || jQuery('#eRFQVFilesques' + index).val() != '') {
                    attchname = jQuery('#eRFQVFilesques' + index).val();

                }

            }
            quesquery = quesquery + $.trim(this_row.find('td:eq(2)').html()) + '~' + $.trim($('#answers' + i).val()) + '~' + attchname + '#';
            i++;
        });
        var data = {
            "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
            "AttachString": attchquery,
            "QuesString": quesquery,
            "VendorID": parseInt(sessionStorage.getItem('VendorId')),
            "Version": parseInt(sessionStorage.getItem('RFQVersionId'))
        }
        // console.log(JSON.stringify(data))
        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRFQVendor/inseRFQVendorQusetionAnswerAttachment",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {

                fetchRFQResponse('Question', sessionStorage.getItem('RFQVersionId'))
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

}

function fnSubmiteRFQSendmail(ismailsent) {
    var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    var CurDt = new Date();
    var validateSubmit = true;
    if (EndDT < CurDt) {
        validateSubmit = false;
        bootbox.alert("RFQ submission time has ended.", function () {

            if (sessionStorage.getItem("ISFromSurrogateRFQ") == "Y") {
                window.location = sessionStorage.getItem('HomePage');
                sessionStorage.clear();

            }
            else {
                window.location = 'VendorHome.html';
                jQuery.unblockUI();
            }
            return false;
        });

    }
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (validateSubmit) {
        var Tab2data = {
            "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
            "VendorID": parseInt(sessionStorage.getItem('VendorId')),
            "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
            "IsMailsent": ismailsent,
            "UserName": sessionStorage.getItem('UserName'),
            "UserEmail": sessionStorage.getItem('EmailID'),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
        }
        // console.log(JSON.stringify(Tab2data))
        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRFQVendor/eRFQRespnsesubmit/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {

                setTimeout(function () {
                    // if (data[0].RFQID > 0) {

                    fetchRFQResponse('Question', sessionStorage.getItem('RFQVersionId'))
                    if (ismailsent == "Y") {
                        jQuery.unblockUI();
                        bootbox.alert("RFQ response submitted and forwarded to company.", function () {

                            if (sessionStorage.getItem("ISFromSurrogateRFQ") == "Y") {
                                window.location = sessionStorage.getItem('HomePage');
                                sessionStorage.clear();

                            }
                            else {
                                window.location = 'VendorHome.html';
                                jQuery.unblockUI();
                            }
                            return false;
                        });
                        return true;
                    }

                    //}
                    //else {
                    //    return false;
                    //}

                }, 500)

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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

}

var currentdate = new Date();
function fetchReguestforQuotationDetails() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced1 = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            sessionStorage.setItem('hddnRFQID', RFQData[0].general[0].rfqId)
            jQuery('#RFQSubject').text(RFQData[0].general[0].rfqSubject)
            sessionStorage.setItem('hdnRFQBidType', RFQData[0].general[0].rfqBidType)
            _RFQBidType = RFQData[0].general[0].rfqBidType

            jQuery('#RFQDescription').html(RFQData[0].general[0].rfqDescription)
            $('#Currency').html(RFQData[0].general[0].currencyNm)
            $('#txtcurrency').val(RFQData[0].general[0].currencyNm)
            jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate);
            jQuery('#refno').html(RFQData[0].general[0].rfqReference);
            jQuery('#txtRFQReference').html(RFQData[0].general[0].rfqReference)
            // jQuery('#RFQStartDate').html(RFQData[0].general[0].rfqStartDate)
            // jQuery('#RFQEndDate').html(RFQData[0].general[0].rfqEndDate)

            jQuery('#RFQStartDate').html(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
            jQuery('#RFQEndDate').html(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
            // jQuery('#TermCondition').attr('href', 'PortalDocs/eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + replaced1).html(RFQData[0].general[0].rfqTermandCondition)
            //$('#filepthtermsPrev').attr('href', 'PortalDocs/eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + replaced1).html(RFQData[0].general[0].rfqTermandCondition);

            jQuery('#TermCondition').html(RFQData[0].general[0].rfqTermandCondition)
            $('#filepthtermsPrev').html(RFQData[0].general[0].rfqTermandCondition)
            //Preview Details


            jQuery('#lblRfqsubject').html(RFQData[0].general[0].rfqSubject)

            jQuery('#lblrfqstartdate').html(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
            jQuery('#lblrfqenddate').html(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
            jQuery('#lblrfqdescription').html(RFQData[0].general[0].rfqDescription)

            jQuery("#dropCurrencyPrev").html(RFQData[0].general[0].currencyNm)
            jQuery('#lblConversionRatePrev').html(RFQData[0].general[0].rfqConversionRate)

            jQuery("#txtRFQReferencePrev").html(RFQData[0].general[0].rfqReference);

            var StartDT = new Date(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate));
            if (currentdate < StartDT) {
                $('#form_wizard_1').find('.button-next').hide();
                $('#regretrfq').hide();
                $('#lblRFQMessage').show();
            }
            else {
                $('#regretrfq').show();
                $('#form_wizard_1').find('.button-next').show();
                $('#lblRFQMessage').hide();
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
jQuery("#regretrfq").click(function () {
    $('#modalRegretremarks').modal('show');

});


function fnConfirmRegretted() {
    bootbox.dialog({
        message: "Are you sure you want to Regret to Quote? ",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    fnRegreteRFQ()
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {

                }
            }
        }
    });

}
function fnRegreteRFQ() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    $('#SaveExsist').attr("disabled", "disabled");
    var RegretData = {
        "RFQId": parseInt(sessionStorage.getItem('hddnRFQID')),
        "VendorID": parseInt(sessionStorage.getItem('VendorId')),
        "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
        "Remarks": $('#txtRemarks').val(),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
    //  alert(JSON.stringify(RegretData))
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/eRFQRegretAfterReinvite",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(RegretData),
        dataType: "json",
        success: function (data) {
            jQuery.unblockUI();
            bootbox.alert("RFQ Regretted Successfully.", function () {

                if (sessionStorage.getItem("ISFromSurrogate") == "Y") {
                    window.location = sessionStorage.getItem('HomePage');
                    sessionStorage.clear();
                }
                else {
                    $('#SaveExsist').removeAttr("disabled");
                    window.location = 'VendorHome.html';
                }
                return false;
            });
            return true;

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

function fetchRFQParameterlastquotesonload(ver) {

    //alert(sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQParameter/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver+"&Flag=NOTBOQ" + "&BoqParentID="+0)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchRFQParameterlastquotes/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver + "&RFQPID=" + 0 + "&Flag=Item",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                fetchRFIParameteronload(ver);
            }
            else {
                fetchRFIParameteronload(ver - 1);
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

function fetchRFIParameteronload(ver) {
    fetchRFQLevelTC(ver);

    //alert(sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQParameter/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver)
    _RFQBidType = sessionStorage.getItem('hdnRFQBidType');
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchRFQParameter/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblRFQPrev").empty();

            $('#divdomestic').show();
            var description = "";
            var totalammwithoutGST = 0;
            var totalammwithGST = 0;

            if (data.length > 0) {
                   if (_RFQBidType == 'Open') {
                    jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Service</th><th>UOM</th><th>Qty</th><th class=hide>TAT</th><th>Currency</th><th class=hide>Delivery Location</th><th></th><th>Landed Unit Price<br/>(Without GST)</th><th>Landed Unit Price<br/>(With GST)</th><th class='hidden'>Description</th><th>Amount<br/>(Without GST)</th><th>Amount<br/>(With GST)</th><th>Delivery Location</th><th>Comments</th></tr></thead>");
                    jQuery("#tblRFQPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Service</th><th>UOM</th><th>Qty</th><th class=hide>TAT</th><th class=hide>Currency</th><th class=hide>Delivery Location</th><th>Landed Unit Price<br/>(Without GST)</th><th>Landed Unit Price<br/>(With GST)</th><th>Amount<br/>(Without GST)</th><th>Amount<br/>(With GST)</th><th class='hidden'>Description</th><th>Delivery Location</th><th>Comments</th></tr></thead>");
                }
                else {
                    jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Service</th><th>UOM</th><th>Qty</th><th class=hide>TAT</th><th>Currency</th><th class=hide>Delivery Location</th><th></th><th>Landed Unit Price<br/>(Without GST)</th><th>Landed Unit Price<br/>(With GST)</th><th class='hidden'>Description</th><th>Amount<br/>(Without GST)</th><th>Amount<br/>(With GST)</th><th>Delivery Location</th><th>HSN/SAC Number</th></tr></thead>");
                    jQuery("#tblRFQPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Service</th><th>UOM</th><th>Qty</th><th class=hide>TAT</th><th class=hide>Currency</th><th class=hide>Delivery Location</th><th>Landed Unit Price<br/>(Without GST)</th><th>Landed Unit Price<br/>(With GST)</th><th>Amount<br/>(Without GST)</th><th>Amount<br/>(With GST)</th><th class='hidden'>Description</th><th>Delivery Location</th><th>HSN/SAC Number</th></tr></thead>");

                }

                $('#txtvendorremarks').val(data[0].vendorRemarks);
                for (var i = 0; i < data.length; i++) {

                    description = stringDivider(data[i].rfqDescription, 40, "<br/>\n");
                    var detailsdesc = (data[i].rfqDescription).replace(/(\r\n|\n|\r)/gm, "");
                    detailsdesc = detailsdesc.replace(/'/g, '');
                    $('#wrap_scrollerPrev').show();

                    totalammwithoutGST = totalammwithoutGST + (data[i].rfqPriceWithoutGST * data[i].rfQuantity);
                    totalammwithGST = totalammwithGST + (data[i].rfqVendorPricewithTax * data[i].rfQuantity);

                    if (data[i].rfqVendorPricewithTax > 0 && data[i].rfqVendorPrice > 0) {
                        if (_RFQBidType == 'Open') {
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td data-toggle="popover" data-content="Click here for detailed description" data-trigger="hover"><a  href="#responsiveDescModal"  data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button" class="btn default btn-xs green-haze-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Input Price</button></td><td><input type="text" readonly="true" id="mkswithoutgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqPriceWithoutGST) + '"  autocomplete=off onkeyup=thousands_separators_input(this)/></td><td><input type="text" readonly="true" id="mkswithgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqVendorPricewithTax) + '"  autocomplete=off onkeyup=thousands_separators_input(this)/></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td><textarea name=vendoritemrem rows=2 class="form-control" maxlength=100  autocomplete=off id=vendoritemrem' + i + ' value=' + data[i].vendorITemRemarks + ' >' + data[i].vendorItemRemarks + '</textarea></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class="fit hide">' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators(data[i].rfqPriceWithoutGST) + '</td><td class="text-right">' + thousands_separators(data[i].rfqVendorPricewithTax) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].vendorItemRemarks + '</td></tr>').appendTo("#tblRFQPrev");
                        }
                        else {
                            //jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td data-toggle="popover" data-content="Click here for detailed description" data-trigger="hover"><a  href="#responsiveDescModal"  data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button" class="btn default btn-xs green-haze-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Input Price</button></td><td><input type="text" readonly="true" id="mkswithoutgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqPriceWithoutGST) + '"  autocomplete=off onkeyup=thousands_separators_input(this)/></td><td><input type="text" readonly="true" id="mkswithgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqVendorPricewithTax) + '"  autocomplete=off onkeyup=thousands_separators_input(this)/></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td><textarea name=vendoritemrem rows=2 class="form-control" maxlength=100  autocomplete=off id=vendoritemrem' + i + ' onkeypress="return isNumber(event)" value=' + data[i].vendorITemRemarks + ' >' + data[i].vendorItemRemarks + '</textarea></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td data-toggle="popover" data-content="Click here for detailed description" data-trigger="hover"><a  href="#responsiveDescModal"  data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button" class="btn default btn-xs green-haze-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Input Price</button></td><td><input type="text" readonly="true" id="mkswithoutgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqPriceWithoutGST) + '"  autocomplete=off onkeyup=thousands_separators_input(this)/></td><td><input type="text" readonly="true" id="mkswithgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqVendorPricewithTax) + '"  autocomplete=off onkeyup=thousands_separators_input(this)/></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td><input type ="text" name=vendoritemrem class="form-control" maxlength=10  autocomplete=off id=vendoritemrem' + i + ' onkeypress="return isNumberKey(event)" value=' + data[i].vendorITemRemarks + '></input></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class="fit hide">' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators(data[i].rfqPriceWithoutGST) + '</td><td class="text-right">' + thousands_separators(data[i].rfqVendorPricewithTax) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].vendorItemRemarks + '</td></tr>').appendTo("#tblRFQPrev");

                        }

                    }
                    else {
                        if (_RFQBidType == 'Open') {
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td data-toggle="popover" data-content="Click here for detailed description" data-trigger="hover"><a  href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button"  class="btn default btn-xs red-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Input Price</button></td><td><input type="text" readonly="true" id="mkswithoutgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqPriceWithoutGST) + '"  autocomplete=off /></td><td><input type="text" readonly="true" id="mkswithgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqVendorPricewithTax) + '"  autocomplete=off /></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td><textarea name=comm rows=2 class="form-control" maxlength=100  autocomplete=off id=vendoritemrem' + i + ' value=' + data[i].vendorItemRemarks + '  >' + data[i].vendorItemRemarks + '</textarea></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class="fit hide">' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators(data[i].rfqPriceWithoutGST) + '</td><td class="text-right">' + thousands_separators(data[i].rfqVendorPricewithTax) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].vendorItemRemarks + '</td></tr>').appendTo("#tblRFQPrev");
                        }
                        else {
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td data-toggle="popover" data-content="Click here for detailed description" data-trigger="hover"><a  href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button"  class="btn default btn-xs red-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Input Price</button></td><td><input type="text" readonly="true" id="mkswithoutgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqPriceWithoutGST) + '"  autocomplete=off /></td><td><input type="text" readonly="true" id="mkswithgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqVendorPricewithTax) + '"  autocomplete=off /></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td><input type = "text" name=comm rows=2 class="form-control" maxlength=10  autocomplete=off id=vendoritemrem' + i + ' onkeypress="return isNumberKey(event)" value=' + data[i].vendorItemRemarks + '  >' + data[i].vendorItemRemarks + '</input></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class="fit hide">' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators(data[i].rfqPriceWithoutGST) + '</td><td class="text-right">' + thousands_separators(data[i].rfqVendorPricewithTax) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].vendorItemRemarks + '</td></tr>').appendTo("#tblRFQPrev");

                        }

                    }
                    $('#vendoritemrem' + i).maxlength({
                        limitReachedClass: "label label-danger",
                        alwaysShow: true
                    });
                    $('#vendoritemrem' + i).val(data[i].vendorItemRemarks)
                }
                jQuery('<tr><td colspan=7><b>Total</b></td><td class="text-right">' + thousands_separators(totalammwithoutGST.round(3)) + '</td><td class="text-right">' + thousands_separators(totalammwithGST.round(3)) + '</td><td>&nbsp;</td></tr>').appendTo("#tblServicesProduct");
                jQuery('<tr><td colspan=5><b>Total</b></td><td class="text-right">' + thousands_separators(totalammwithoutGST.round(3)) + '</td><td class="text-right">' + thousands_separators(totalammwithGST.round(3)) + '</td><td>&nbsp;</td></tr>').appendTo("#tblRFQPrev");

            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function showDetailedDescription(descText) {
    //alert(descText)
    $("#paraItemDescription").html(descText);
}

setTimeout(function () { sessionStorage.removeItem('selectedboqtxtboxid') }, 5000);
sessionStorage.removeItem('selectedboqtxtboxidTax');

function DownloadFile(aID) {

    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));
}
function DownloadFileVendor(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + sessionStorage.getItem('RFQVersionId'));
}

function mapQuestion(RFQParameterId, mskwithoutgst, quantity, version, withgst, basicprice) {

    $('#txtbasicPrice').val(thousands_separators(basicprice))
    $("#hddnBoqParamQuantity").val(quantity);

    $('#texttblidwithGST').val(withgst);
    $('#texttblidwithoutGST').val(mskwithoutgst);
    $('#txtRFQParameterId').val(RFQParameterId);
    saveQuotation();
    fncheckItemWiseTC(version, RFQParameterId)

}
$('#responsive').on("hidden.bs.modal", function () {
    jQuery('input:checkbox[name=chkreplicateprice]').prop('checked', false);
    jQuery('#chkreplicateprice').parents('span').removeClass('checked');
    Price = 0;
    PricewithoutGST = 0;
    basicprice = 0;
    PricewithoutGSTDiscount = 0.0;
})
var Price = 0;
var PricewithoutGST = 0;
var basicprice = 0; var PricewithoutGSTDiscount = 0;

function RFQinsertItemsTC(issubmitbuttonclick) {
    //CHECK HERE 
    Price = 0.0;
    PricewithoutGST = 0.0;
    PriceGSTOnly = 0.0;
    basicprice = 0;
    PricewithoutGSTDiscount = 0.0;

    basicprice = removeThousandSeperator($('#txtbasicPrice').val());
    var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    var CurDt = new Date();
    var validateSubmit = true;
    if (EndDT < CurDt) {
        validateSubmit = false;
        bootbox.alert("RFQ submission time has ended.", function () {

            if (sessionStorage.getItem("ISFromSurrogateRFQ") == "Y") {
                window.location = sessionStorage.getItem('HomePage');
                sessionStorage.clear();

            }
            else {
                window.location = 'VendorHome.html';
                jQuery.unblockUI();
            }
            return false;
        });

    }
    if (validateSubmit) {
        $('#loader-msg').html('Processing. Please Wait...!');
        $('.progress-form').show();
        PriceDetails = [];
        if (jQuery('#tblRFQParameterComponet  tr').length > 0) {
            $("#tblRFQParameterComponet tr:gt(0)").each(function () {
                var this_row = $(this);
                if ($.trim(this_row.find('td:eq(3)').html()).toLowerCase() != "gst" && $.trim(this_row.find('td:eq(3)').html()).toLowerCase() != "discount") {

                    PricewithoutGST = PricewithoutGST + (parseFloat(removeThousandSeperator(this_row.find('td:eq(4) input[type="text"]').val())) / 100);
                }
                if ($.trim(this_row.find('td:eq(3)').html()).toLowerCase() == "gst") {

                    PriceGSTOnly = (parseFloat(removeThousandSeperator(this_row.find('td:eq(4) input[type="text"]').val())) / 100);
                }
                if ($.trim(this_row.find('td:eq(3)').html()).toLowerCase() == "discount") {


                    PricewithoutGSTDiscount = PricewithoutGSTDiscount + (parseFloat(removeThousandSeperator(this_row.find('td:eq(4) input[type="text"]').val())) / 100);
                }
                _RFQBidType = sessionStorage.getItem('hdnRFQBidType');
                var vendorRemarks = "";
                if (_RFQBidType == 'Open') {
                    vendorRemarks = $.trim(this_row.find('td:eq(17)').find('textarea').val()).replace(/'/g, "''")
                }
                else {
                    vendorRemarks = $.trim(this_row.find('td:eq(17) input[type="text"]').val())

                }
                // Price = Price + (parseFloat(removeThousandSeperator(this_row.find('td:eq(4) input[type="text"]').val())) / 100);
                var Pdetails = {
                    "VendorID": parseInt(sessionStorage.getItem('VendorId')),
                    "RFQParameterId": parseInt($.trim(this_row.find('td:eq(0)').html())),
                    "RFQId": parseInt($.trim(this_row.find('td:eq(1)').html())),
                    "RFQShortName": '',
                    "RFQUomId": '',
                    "RFQuantity": 0,
                    "RFQDelivery": '',
                    "RFQVendorPricewithTax": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(4) input[type="text"]').val()))),
                    "RFQPriceWithoutGST": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(4) input[type="text"]').val()))),
                    "RFQVendorPrice": 0,
                    "RFQTCID": parseInt($.trim(this_row.find('td:eq(2)').html())),
                    "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
                    "FinalStatus": 'N',
                    //"VendorItemRemarks": $.trim(this_row.find('td:eq(17)').find('textarea').val()).replace(/'/g, "''")
                    "VendorItemRemarks": vendorRemarks

                };
                PriceDetails.push(Pdetails)


            });

            //PricewithoutGST = (removeThousandSeperator(basicprice) * (PricewithoutGST + 1));
            PricewithoutGST = ((removeThousandSeperator(basicprice) * (PricewithoutGST + 1))) * (1 - PricewithoutGSTDiscount);
            Price = (removeThousandSeperator(PricewithoutGST) * (PriceGSTOnly + 1));


            var Tab2data = {
                "PriceDetails": PriceDetails,
                "RFQparameterID": parseInt($('#txtRFQParameterId').val()),
                "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
                "VendorId": parseInt(sessionStorage.getItem('VendorId')),
                "RFQVersionId": parseInt(sessionStorage.getItem('RFQVersionId')),
                "Price": parseFloat(Price),
                "PricewithoutGST": parseFloat(PricewithoutGST),
                "PriceBasic": parseFloat(basicprice)
            };
            //console.log(JSON.stringify(Tab2data))
            // alert(JSON.stringify(Tab2data))
            jQuery.ajax({

                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "eRFQVendor/eRFQQuotedTCPriceSave/",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                crossDomain: true,
                async: false,
                data: JSON.stringify(Tab2data),
                dataType: "json",
                success: function (data) {


                    $("#" + $('#texttblidwithGST').val()).val(Price);
                    $("#" + $('#texttblidwithoutGST').val()).val(PricewithoutGST);

                    fetchRFIParameteronload(sessionStorage.getItem('RFQVersionId'));
                    Price = 0;
                    if (issubmitbuttonclick == "Y") {
                        $('#responsive').modal('hide');
                    }


                },
                error: function (xhr, status, error) {

                    var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
        $('.progress-form').hide()
    }

}

function saveQuotation() {
    var PriceDetails = [];
    var commercialterms = [];
    _RFQBidType = sessionStorage.getItem('hdnRFQBidType');
    var vendorRemarks = "";

    var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    var CurDt = new Date();
    var validateSubmit = true;
    if (EndDT < CurDt) {
        validateSubmit = false;
        bootbox.alert("RFQ submission time has ended.", function () {

            if (sessionStorage.getItem("ISFromSurrogateRFQ") == "Y") {
                window.location = sessionStorage.getItem('HomePage');
                sessionStorage.clear();

            }
            else {
                window.location = 'VendorHome.html';
                jQuery.unblockUI();
            }
            return false;
        });

    }
    if (validateSubmit) {
        $("#tblServicesProduct > tbody > tr").not(':last').each(function () {
            var this_row = $(this);
            if (_RFQBidType == 'Open') {
                vendorRemarks = $.trim(this_row.find('td:eq(17)').find('textarea').val()).replace(/'/g, "''")
            }
            else {
                vendorRemarks = $.trim(this_row.find('td:eq(17) input[type="text"]').val())

            }
            var quotes = {
                "VendorID": parseInt(sessionStorage.getItem('VendorId')),
                "RFQParameterId": parseInt($.trim(this_row.find('td:eq(0)').html())),
                "RFQId": parseInt($.trim(this_row.find('td:eq(1)').html())),
                "RFQShortName": $.trim(this_row.find('td:eq(2)').text().replace(/'/g, "''")),
                "RFQUomId": removeThousandSeperator($.trim(this_row.find('td:eq(3)').html())),
                "RFQuantity": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(4)').html()))),
                "RFQDelivery": $.trim(this_row.find('td:eq(7)').html()),
                "RFQVendorPricewithTax": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(10) input[type="text"]').val()))),
                "RFQPriceWithoutGST": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(9) input[type="text"]').val()))),
                "RFQVendorPrice": parseFloat($.trim(this_row.find('td:eq(13)').html())),
                "RFQTCID": 0,
                "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
                "FinalStatus": 'N',
                //"VendorItemRemarks": $.trim(this_row.find('td:eq(17)').find('textarea').val()).replace(/'/g, "''")
                "VendorItemRemarks": vendorRemarks

            };

            PriceDetails.push(quotes)
        });

        $("#tblRFQLevelTCForQuot > tbody > tr").each(function () {
            var this_row = $(this);
            var comm = {
                "VendorID": parseInt(sessionStorage.getItem('VendorId')),
                "RFQTCID": parseInt($.trim(this_row.find('td:eq(0)').html())),
                "RFQID": parseInt($.trim(this_row.find('td:eq(1)').html())),
                "Remarks": $.trim(this_row.find('td:eq(5)').find('textarea').val()).replace(/'/g, "''"),
                "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
                "FinalStatus": 'N'
            };
            commercialterms.push(comm)
        });

        var Tab2data = {
            "PriceDetails": PriceDetails,
            "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
            "VendorId": parseInt(sessionStorage.getItem('VendorId')),
            "RFQVersionId": parseInt(sessionStorage.getItem('RFQVersionId')),
            "CommercialTerms": commercialterms,
            "VendorRemarks": $('#txtvendorremarks').val()
        };
        // console.log(JSON.stringify(Tab2data))
        //alert(JSON.stringify(Tab2data))
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRFQVendor/eRFQQuotedPriceSave/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {

                setTimeout(function () {
                    if (parseInt(data) != 0) {
                        fetchRFIParameteronload(sessionStorage.getItem('RFQVersionId'));
                    }
                    return true;
                }, 500)

                if (parseInt(data) == 0) {
                    bootbox.alert("Error connecting server. Please try later.");
                }
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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



}
jQuery('#chkreplicateprice').click(function () {
    if (jQuery('#chkreplicateprice').is(':checked') == true) {
        shwconfirmationtoreplicate();
    }
    else {

    }
});

function shwconfirmationtoreplicate() {
    bootbox.dialog({
        message: "Are you sure? This will also replace earlier filled rates,  if any ",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    fnReplicateToAllItems()
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {
                    jQuery('input:checkbox[name=chkreplicateprice]').prop('checked', false);
                    jQuery('#chkreplicateprice').parents('span').removeClass('checked');
                }
            }
        }
    });

}
function fnReplicateToAllItems() {
    PricewithoutGST = 0;
    Price = 0;
    basicprice = 0;
    var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    var CurDt = new Date();
    var validateSubmit = true;
    if (EndDT < CurDt) {
        validateSubmit = false;
        bootbox.alert("RFQ submission time has ended.", function () {

            if (sessionStorage.getItem("ISFromSurrogateRFQ") == "Y") {
                window.location = sessionStorage.getItem('HomePage');
                sessionStorage.clear();

            }
            else {
                window.location = 'VendorHome.html';
                jQuery.unblockUI();
            }
            return false;
        });

    }
    if (validateSubmit) {
        $('#loader-msg').html('Processing. Please Wait...!');
        $('.progress-form').show();

        RFQinsertItemsTC('N');
        PriceDetails = [];
        var Tab2data = {
            "PriceDetails": PriceDetails,
            "RFQparameterID": parseInt($('#txtRFQParameterId').val()),
            "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
            "VendorId": parseInt(sessionStorage.getItem('VendorId')),
            "RFQVersionId": parseInt(sessionStorage.getItem('RFQVersionId')),
            "Price": parseFloat(Price),
            "PricewithoutGST": parseFloat(PricewithoutGST),
            "PriceBasic": parseFloat(basicprice)
        };
        // console.log(JSON.stringify(Tab2data))
        //alert(JSON.stringify(Tab2data))
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRFQVendor/eRFQQuotedTCPriceSave/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {
                $('#responsive').modal('hide');
                fetchRFIParameteronload(sessionStorage.getItem('RFQVersionId'));


            },
            error: function (xhr, status, error) {

                var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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
        $('.progress-form').hide()
    }
}
$('#back_prev_btn').click(function () {
    $('#BidPreviewDiv').hide();
    $('#form_wizard_1').show();
});
function fnRedirectToHome() {
    if (sessionStorage.getItem("ISFromSurrogate") == "Y") {
        window.location = sessionStorage.getItem('HomePage');
        sessionStorage.clear();
    }
    else {
        window.location = "VendorHome.html"
    }
}
