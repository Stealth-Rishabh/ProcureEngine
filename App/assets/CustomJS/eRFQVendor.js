jQuery(document).ready(function () {
    $('[data-toggle="popover"]').popover({})
    Pageloaded()
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if (sessionStorage.getItem("UserType") == "P" || sessionStorage.getItem("UserType") == "V") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);

    var _RFQid = getUrlVarsURL(decryptedstring)["RFQID"];
    if (_RFQid == null)
        sessionStorage.setItem('hddnRFQID', 0)
    else {
        sessionStorage.setItem("EventId", _RFQid);
        sessionStorage.setItem("EventType", 'eRFQv');
        
        var version = 0;

        if (sessionStorage.getItem('RFQVersionId') > 0) {
            version = parseInt(sessionStorage.getItem('RFQVersionId'))// - 1;

        }
        sessionStorage.setItem('hddnRFQID', _RFQid)
        fetchReguestforQuotationDetails();
        fetchAttachments();


        if (sessionStorage.getItem("ISFromSurrogateRFQ") == "Y") {
            $('#LiISsurrogate').removeClass('hide')
            $('#LIVendor').addClass('hide')

        }
        else {
            $('#LiISsurrogate').addClass('hide')
            $('#LIVendor').removeClass('hide')
        }
    }
    Metronic.init();
    Layout.init();
    formValidation();
    FormWizard.init();
    //ComponentsPickers.init();
    setCommonData();
    
    //for file upload
   
    /*document.getElementById('browseBtnExcelParameterB').addEventListener('click', function () {
        document.getElementById('file-excelparameterB').click();
    });
    */
    $('#browseBtnExcelParameterB').click(function() {
     $('#file-excelparameterB').val('');
    $('#file-excelparameterB').click();
    });

   
    $('#UploadBoqExcelbtn').hide();

});


$('#file-excelparameterB').change(handleFileparameterBoq);
var error = $('.alert-danger');
var success = $('.alert-success');
var form = $('#submit_form');
inputmask();
function inputmask() {
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
        'removeMaskOnSubmit': true,
        // autoUnmask: true

    });
}

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

var isTaxCorrected = 'Y';
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
            if (isboq == "N") {
                RFQinsertItemsTC('Y');
            }
            else {
                RFQinsertItemsTCBoq('Y');
            }


        }
    });
    //Form Validation for Cancel Reason
    var form1 = $('#frmRemarksRegret');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);
    var isSaveButtonClicked = "Y";


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
                    //$('#form_wizard_1').find('.button-cal').hide();
                     if (isboq == "Y") {
                         $('#downBOQ').hide();
                         $('#UploadBoqExcelbtn').hide();
                     }
                    

                } else {
                    $('#form_wizard_1').find('.button-previous').show();
                    //$('#form_wizard_1').find('.button-cal').show();
                    
                     if (isboq == "Y") {
                           $('#downBOQ').show();
                           $('#UploadBoqExcelbtn').show();
                     }
                  

                }

                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                    //$('#form_wizard_1').find('.button-cal').hide();
                    
                      if (isboq == "Y") {
                           $('#downBOQ').hide();
                           $('#UploadBoqExcelbtn').hide();
                      }
                   
                }
                else {
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
                        $("#LIVendor").find("a").attr("onclick", "warnforsubmit()");
                        // $('#form_wizard_1').find('.button-cal').show();
                         if (isboq == "Y") {
                        $('#downBOQ').show();
                        $('#UploadBoqExcelbtn').show();
                         }
                    }
                    else if (index == 2) {

                        var flag = "T";
                        isSaveButtonClicked = "Y";
                        // isTaxCorrected = "Y";
                        var rowCount = jQuery('#tblRFQLevelTCForQuot >tbody>tr').length;

                        var count = 1;

                        for (i = 0; i < rowCount; i++) {
                            if ($("#commremarks" + i).val().trim() == "" || $("#commremarks" + i).val() == "0") {
                                $('#commremarks' + i).removeClass('has-success')
                                $('#commremarks' + i).css("border", "1px solid red")
                                flag = "F";
                                //$('#form_wizard_1').bootstrapWizard('previous');
                                $('.alert-danger').show();
                                $('#spandanger').html('Please fill RFQ Commercial Terms.');
                                Metronic.scrollTo($(".alert-danger"), -200);
                                $('.alert-danger').fadeOut(7000);
                                count = count + 1;
                            }

                        }
                        if (flag == "F") {
                            return false;
                        }

                        if (flag == "T" && isboq == "N") {
                            saveQuotation();
                            fetchRFQResponse('Attachment', sessionStorage.getItem('RFQVersionId'));
                        }
                        else if (flag == "T" && isboq == "Y") {

                            /*
                            $("#tblServicesProductboq").find('tr').each(function (i) {
                                
                                var this_row = $(this);
                                if (this_row.attr("name") != undefined) {
                                    rPID = $.trim(this_row.find('.rPID').text());
                                    var Parentid = $.trim($('#parentID' + rPID).text())
                                    if (Parentid == "0" && ($('#mkswithgstBoq' + rPID).text() == "" || $('#mkswithgstBoq' + rPID).text() == "0") && ($('#mkswithoutgstBoq' + rPID).text() != "0" && $('#mkswithoutgstBoq' + rPID).text() != "")) {
                                        isTaxCorrected = "N";
                                        $('#taxrecalculate').modal('show');
                                        return false;

                                    }
                                }
                            })
                            */
                         
                            if (isTaxCorrected != "N") {
                                saveQuotationBoq();
                                fetchRFQResponse('Attachment', sessionStorage.getItem('RFQVersionId'));
                                isTaxCorrected == "N"
                            }
                            else {
                                $('#taxrecalculate').modal('show');
                                return false;
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
                     
                    if (index == 0) {
                        $("#LIVendor").find("a").attr("onclick", "fnRedirectToHome()")
                    }
                    else if (index == 1) {
                        isTaxCorrected == "N"
                    }
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
            //$('#form_wizard_1').find('.button-cal').hide();
             if (isboq == "Y") {
                 $('#downBOQ').hide();
                 
             }
           
            $('#form_wizard_1 .button-submit').click(function () {
                var flagQ = "T";
                var rowCountQ = jQuery('#tblquestions >tbody>tr').length;

            
                for (i = 0; i < rowCountQ; i++) {
                    if ($("#answers" + i).val() == "") {
                        $('#answers' + i).removeClass('has-success')
                        $('#answers' + i).css("border", "1px solid red")
                        flagQ = "F";
                        $('.alert-danger').show();
                        $('#spandanger').html('Please fill RFQ Answer.');
                        Metronic.scrollTo($(".alert-danger"), -200);
                        $('.alert-danger').fadeOut(7000);

                    }

                }
                if (flagQ == "F") {
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
                        $('#BidPreviewDiv').show();
                        $('#form_wizard_1').hide();
                        return true;
                    }
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
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data, status, jqXHR) {
            
             let data=Data.rData
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
/*$(document).on("input", ".numericthree", function () {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});*/


function fetchRFQLevelTC(ver) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQfetchTCQuotation/?RFQId=" + sessionStorage.getItem("hddnRFQID") + "&ParameterID=" + 0 + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {

            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblRFQLevelTCForQuot").empty();
            jQuery("#tbltermsconditionprev").empty();
            $('#scrolr').show();
            if (data.length > 0) {

                jQuery("#tblRFQLevelTCForQuot").append("<thead><tr style='background: gray; color: #FFF;'><th>Other Commercial Terms</th><th>Our Requirement</th><th>Your Offer</th></tr></thead>");
                jQuery("#tbltermsconditionprev").append("<thead><tr style='background: gray; color: #FFF;'><th>Other Commercial Terms</th><th>Our Requirement</th><th>Your Offer</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {

                    jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].tcid + '</td><td class=hidden >' + data[i].rfqid + '</td><td class=hide>' + data[i].conditionType + '</td><td style="width:20%">' + data[i].tcName + '</td><td>' + data[i].requirement + '</td><td><textarea name=comm rows=2 class="form-control" maxlength=1000  autocomplete=off id=commremarks' + i + ' >' + data[i].rfqRemark + '</textarea></td><td class=hide>' + data[i].otherTermsCondition + '</td></tr>').appendTo("#tblRFQLevelTCForQuot");
                    jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].tcid + '</td><td class=hidden >' + data[i].rfqid + '</td><td class=hide>' + data[i].conditionType + '</td><td style="width:20%">' + data[i].tcName + '</td><td>' + data[i].requirement + '</td><td><label class="control-label" >' + data[i].rfqRemark + '</label></td><td class=hide>' + data[i].otherTermsCondition + '</td></tr>').appendTo("#tbltermsconditionprev");

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
        var num = 0;
        var maxinum = -1;
        $("#tblAttachmentsresponse >tbody>tr").each(function () {
            var this_row = $(this);
            num = (this_row.closest('tr').attr('id')).substring(10, (this_row.closest('tr').attr('id')).length)
            if (parseInt(num) > parseInt(maxinum)) {
                maxinum = num;
            }
        });
        rowAttach = parseInt(maxinum) + 1;
        $('#headerresposeatt').removeClass('hide')
        $('#dicresponseatt').removeClass('hide')
        if (!jQuery("#tblAttachmentsPrev thead").length) {
            jQuery('#tblAttachmentsPrev').append("<thead><tr><th class='bold'>Attachment Description</th><th class='bold'>Attachment</th></tr></thead>");
            var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        }
        else {
            var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        }
        strprev += '<td class=style="width:47%!important"><a style="pointer:cursur;text-decoration:none;" id=eRFQVFilesPrev' + rowAttach + ' href="javascript:;" onclick="DownloadFileVendor(this,-1)" >' + attchname + '</a></td>';
        jQuery('#tblAttachmentsPrev').append(strprev);


        var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        str += '<td class=hide>' + attchname + '</td>'
        str += '<td class=style="width:47%!important"><a style="pointer:cursur;text-decoration:none;"  id=eRFQVFilesPrev' + rowAttach + ' href="javascript:;" onclick="DownloadFileVendor(this,-1)" >' + attchname + '</a></td>';
        str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger" id=Removebtnattach' + rowAttach + ' onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + attchname + '\',\'VAttachment\',0)" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblAttachmentsresponse').append(str);
        fnUploadFilesonAzure('fileToUpload1', attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + sessionStorage.getItem('RFQVersionId'));

        //** function to insert record in DB after file upload on Blob
        //fnsaveAttachmentsquestions();

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

var PreviousVersion = 0;
function fetchRFQResponse(Flag, version) {

    var strprev = "";
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
                        str += "<td class='hide' id=quesid" + i + ">" + data[i].questionID + "</td>";
                        str += '<td style="width:10%!important"><span style="width:300px!important" class="btn blue"><input type="file" id=fileToUploadques' + i + ' name=fileToUploadques' + i + ' onchange="checkfilesize(this);" /></span><br>  <a id=eRFQVFilesques' + i + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick=DownloadFileVendor(this,' + data[i].version + ')>' + attachQA + '</a> </td>';
                        strprev += '<td style="width:10%!important"><a id=fileDownAtt' + i + ' style="pointer:cursur;text-decoration:none;" href=javascript:; onclick=DownloadFileVendor(this,' + data[i].version + ')>' + attachQA + '</a></td>';//' + data[i].answer + '
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
                    PreviousVersion = data[0].version;
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
                        strprev += '<td class=style="width:47%!important"><a id=eRFQVFilesPrev' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFileVendor(this,' + data[i].version + ')" >' + data[i].attachment + '</a></td>';
                        jQuery('#tblAttachmentsPrev').append(strprev);

                        var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + data[i].attachmentdescription + '</td>';
                        str += '<td class=style="width:47%!important"><a id=eRFQVFilesPrev' + rowAttach + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick="DownloadFileVendor(this,' + data[i].version + ')">' + data[i].attachment + '</a></td>';
                        str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger" id=Removebtnattach' + i + '  onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + data[i].attachment + '\',\'VAttachment\',\'' + data[i].id + '\')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
                        jQuery('#tblAttachmentsresponse').append(str);


                    }
                    PreviousVersion = data[0].version;
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
    validateSubmit = false;
    var attchquery = '';
    var quesquery = '';
    var i = 1;
    //var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');



    if (validateSubmit) {

        $("#tblAttachmentsresponse> tbody > tr").each(function (index) {

            var this_row = $(this);
            attchquery = attchquery + $.trim(this_row.find('td:eq(0)').text()) + '~' + $.trim(this_row.find('td:eq(1)').text()) + '#';
            i++;
        });

        var attchname = '';
        $("#tblquestions> tbody > tr").each(function (index) {

            attchname = ''
            if ($('#fileToUploadques' + index).val() != null && $('#fileToUploadques' + index).val() != '' && $('#fileToUploadques' + index).val() != 'undefined') {
                attchname = jQuery('#fileToUploadques' + index).val().substring(jQuery('#fileToUploadques' + index).val().lastIndexOf('\\') + 1)
                attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
                fnUploadFilesonAzure('fileToUploadques' + index, attchname, 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + sessionStorage.getItem('RFQVersionId'));
            }
            else {
                if ($('#eRFQVFilesques' + index).text() != '' && $('#eRFQVFilesques' + index).text() != null && $('#eRFQVFilesques' + index).text() != 'undefined') {
                    attchname = $('#eRFQVFilesques' + index).text();
                }
            }
            quesquery = quesquery + $.trim($('#quesid' + index).text()) + '~' + $.trim($('#answers' + index).val()) + '~' + attchname + '#';


        });
        var data = {
            "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
            "AttachString": attchquery,
            "QuesString": quesquery,
            "VendorID": parseInt(sessionStorage.getItem('VendorId')),
            "Version": parseInt(sessionStorage.getItem('RFQVersionId'))
        }


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

    validateSubmit = false;
    //var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');


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

var isboq = "N";
function fetchReguestforQuotationDetails() {
    
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced1 = '';
   
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data) {
            
             let RFQData=Data.rData
            if (RFQData[0].general.length) {
                sessionStorage.setItem('CustomerID', RFQData[0].general[0].customerID)
                let _cleanStringSub = StringDecodingMechanism(RFQData[0].general[0].rfqSubject);
                let _cleanStringDesc = StringDecodingMechanism(RFQData[0].general[0].rfqDescription);
                sessionStorage.setItem('hddnRFQID', RFQData[0].general[0].rfqId)
                jQuery('#RFQSubject').text(_cleanStringSub)
                sessionStorage.setItem('hdnRFQBidType', RFQData[0].general[0].rfqBidType)
                _RFQBidType = RFQData[0].general[0].rfqBidType

                jQuery('#RFQDescription').html(_cleanStringDesc)
                jQuery('#RFQID').html(RFQData[0].general[0].rfqId)
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

                //var StartDT = new Date(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate).replace('-', ''));
                Dateandtimevalidate(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate), 'startdt');


                /*if (currentdate < StartDT) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#regretrfq').hide();
                    $('#lblRFQMessage').show();
                }
                else {
                    $('#regretrfq').show();
                    $('#form_wizard_1').find('.button-next').show();
                    $('#lblRFQMessage').hide();
                }*/
            }
            if (RFQData[0].vendors.length) {
                for (var i = 0; i < RFQData[0].vendors.length; i++) {
                    if (RFQData[0].vendors[i].vendorId == sessionStorage.getItem("VendorId")) {

                        // fetchRFQParameterlastquotesonload(RFQData[0].vendors[i].version)
                        // fetchRFQResponseTocheckVersion('Question', RFQData[0].vendors[i].version);
                        //fetchRFQResponseTocheckVersion('Attachment', RFQData[0].vendors[i].version);

                        if (RFQData[0].general[0].boqReq == true) {
                            fetchRFIParameteronloadBoq(RFQData[0].vendors[i].version);
                            isboq = "Y";
                        }
                        else {
                            fetchRFIParameteronload(RFQData[0].vendors[i].version);
                            isboq = "N";
                        }
                        fetchRFQResponse('Question', RFQData[0].vendors[i].version);
                        fetchRFQResponse('Attachment', RFQData[0].vendors[i].version)
                        sessionStorage.setItem('RFQVersionId', RFQData[0].vendors[i].version)
                    }
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
    jQuery.unblockUI();
}

function Dateandtimevalidate(StartDT, tocheckdt) {

    var StartDT = StartDT.replace('-', '');
    var utc = sessionStorage.getItem('utcoffset');
    if (sessionStorage.getItem('utcoffset') == null || sessionStorage.getItem('utcoffset') == undefined) {
        utc = getTimezoneOffset();
    }
    let StTime =
        new Date(StartDT.toLocaleString("en", {
            timeZone: sessionStorage.getItem('preferredtimezone')
        }));

    ST = new String(StTime);
    ST = ST.substring(0, ST.indexOf("GMT"));
    ST = ST + 'GMT' + utc

    var Tab1Data = {
        "BidDate": ST
    }
    //console.log(JSON.stringify(Tab1Data))

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        async: false,
        crossDomain: true,
        data: JSON.stringify(Tab1Data),
        dataType: "json",
        success: function (data) {

            if (tocheckdt == "startdt") {
                if (data == "1") {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#regretrfq').hide();
                    $('#lblRFQMessage').show();
                }
                else {
                    $('#regretrfq').show();
                    $('#form_wizard_1').find('.button-next').show();
                    $('#lblRFQMessage').hide();

                    return false;
                }
            }
            else if (tocheckdt == "enddate") {
                if (data == 1) {
                    validateSubmit = true;
                }
                else {
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

            }
        },
        error: function () {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                bootbox.alert("you have some error.Please try agian.");
            }
            jQuery.unblockUI();
            return false;

        }

    });

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
                    $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
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
    var _cleanString = StringEncodingMechanism($('#txtRemarks').val());


    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    $('#SaveExsist').attr("disabled", "disabled");
    var RegretData = {
        "RFQId": parseInt(sessionStorage.getItem('hddnRFQID')),
        "VendorID": parseInt(sessionStorage.getItem('VendorId')),
        "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
        //"Remarks": $('#txtRemarks').val(),
        "Remarks": _cleanString,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
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
function fetchRFIParameteronload(ver) {

    jQuery("#divBoq").hide();
    jQuery("#divNonboq").show();
    jQuery("#tblRFQPrevBoq").hide();

    fetchRFQLevelTC(ver);
    _RFQBidType = sessionStorage.getItem('hdnRFQBidType');
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchRFQParameter/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblRFQPrev").empty();
            $('#wrap_scrollerPrev').show();

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
                $('#lblvendorremark').text(data[0].vendorRemarks);
                for (var i = 0; i < data.length; i++) {

                    description = stringDivider(data[i].rfqDescription, 40, "<br/>\n");
                    var detailsdesc = (data[i].rfqDescription).replace(/(\r\n|\n|\r)/gm, "");
                    detailsdesc = detailsdesc.replace(/'/g, '');
                    var RFQRemark = (data[i].rfqRemark).replace(/(\r\n|\n|\r)/gm, "");
                    RFQRemark = RFQRemark.replace(/'/g, '');


                    totalammwithoutGST = totalammwithoutGST + (data[i].rfqPriceWithoutGST * data[i].rfQuantity);
                    totalammwithGST = totalammwithGST + (data[i].rfqVendorPricewithTax * data[i].rfQuantity);

                    if (data[i].rfqVendorPricewithTax > 0 && data[i].rfqVendorPrice > 0) {
                        if (_RFQBidType == 'Open') {

                            // jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td class="hovertextLeft" data-hover="Click here for Detailed Description/Remarks"><a style="text-decoration:none!important" href="#responsiveDescModal"  data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button" class="btn btn-primary" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Enter Price</button></td><td><label id="mkswithoutgst' + i + '" >' + thousands_separators(data[i].rfqPriceWithoutGST) + '</label></td><td class="text-right"><label id="mkswithgst' + i + '">' + thousands_separators(data[i].rfqVendorPricewithTax) + '</label></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td><textarea name=vendoritemrem rows=2 class="form-control" maxlength=100  autocomplete=off id=vendoritemrem' + i + ' value=' + data[i].vendorITemRemarks + ' >' + data[i].vendorItemRemarks + '</textarea></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td class="hovertextLeft" data-hover="Click on Line Item to view the detailed description/Remarks"><a style="text-decoration:none!important" href="#responsiveDescModal"  data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators((data[i].rfQuantity).round(2)) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button" class="btn btn-primary" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Enter Price</button></td><td><label id="mkswithoutgst' + i + '" data-toggle="modal" href="#responsive" onClick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">' + thousands_separators((data[i].rfqPriceWithoutGST).round(2)) + '</label></td><td class="text-right"><label id="mkswithgst' + i + '" data-toggle="modal" href="#responsive" onClick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '</label></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td>' + data[i].rfqDelivery + '</td><td><textarea name=vendoritemrem rows=2 class="form-control" maxlength=100  autocomplete=off id=vendoritemrem' + i + ' value=' + data[i].vendorITemRemarks + ' >' + data[i].vendorItemRemarks + '</textarea></td></tr>').appendTo("#tblServicesProduct");


                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators((data[i].rfQuantity).round(2)) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class="fit hide">' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].vendorItemRemarks + '</td></tr>').appendTo("#tblRFQPrev");
                        }
                        else {
                            //jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td data-toggle="popover" data-content="Click here for detailed description" data-trigger="hover"><a  href="#responsiveDescModal"  data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button" class="btn default btn-xs green-haze-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Input Price</button></td><td><input type="text" readonly="true" id="mkswithoutgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqPriceWithoutGST) + '"  autocomplete=off onkeyup=thousands_separators_input(this)/></td><td><input type="text" readonly="true" id="mkswithgst' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].rfqVendorPricewithTax) + '"  autocomplete=off onkeyup=thousands_separators_input(this)/></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(3)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(3)) + '</td><td>' + data[i].rfqDelivery + '</td><td><textarea name=vendoritemrem rows=2 class="form-control" maxlength=100  autocomplete=off id=vendoritemrem' + i + ' onkeypress="return isNumber(event)" value=' + data[i].vendorITemRemarks + ' >' + data[i].vendorItemRemarks + '</textarea></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td class="hovertextLeft" data-hover="Click on Line Item to view the detailed description/Remarks" ><a style="text-decoration:none!important" href="#responsiveDescModal"  data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators((data[i].rfQuantity).round(2)) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button" class="btn btn-primary" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Enter Price</button></td><td class="text-right"><label   id="mkswithoutgst' + i + '" data-toggle="modal" href="#responsive" onClick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">' + thousands_separators((data[i].rfqPriceWithoutGST).round(2)) + '</label></td><td class="text-right"><label  id="mkswithgst' + i + '" data-toggle="modal" href="#responsive" onClick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '</label></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td>' + data[i].rfqDelivery + '</td><td><input type ="text" name=vendoritemrem class="form-control" maxlength=10  autocomplete=off id=vendoritemrem' + i + ' onkeypress="return isNumberKey(event)" value=' + data[i].vendorItemRemarks + '></input></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class="fit hide">' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].vendorItemRemarks + '</td></tr>').appendTo("#tblRFQPrev");

                        }

                    }
                    else {
                        if (_RFQBidType == 'Open') {
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td class="hovertextLeft" data-hover="Click on Line Item to view the detailed description/Remarks" ><a style="text-decoration:none!important" href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators((data[i].rfQuantity).round(2)) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button"  class="btn btn-primary" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Enter Price</button></td><td class="text-right"><label  id="mkswithoutgst' + i + '" data-toggle="modal" href="#responsive" onClick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">' + thousands_separators((data[i].rfqPriceWithoutGST).round(2)) + '</label></td><td class="text-right"><label id="mkswithgst' + i + '" data-toggle="modal" href="#responsive" onClick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '</label></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td>' + data[i].rfqDelivery + '</td><td><textarea name=comm rows=2 class="form-control" maxlength=100  autocomplete=off id=vendoritemrem' + i + ' value=' + data[i].vendorItemRemarks + '  >' + data[i].vendorItemRemarks + '</textarea></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators((data[i].rfQuantity).round(2)) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class="fit hide">' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].vendorItemRemarks + '</td></tr>').appendTo("#tblRFQPrev");
                        }
                        else {
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td class="hovertextLeft" data-hover="Click on Line Item to view the detailed description/Remarks" ><a style="text-decoration:none!important" href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators((data[i].rfQuantity).round(2)) + '</td><td class="fit hide">' + data[i].tat + '</td><td class=fit>' + $('#txtcurrency').val() + '</td><td class="hide">' + data[i].rfqDelivery + '</td><td><button type="button"  class="btn btn-danger" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">Enter Price</button></td><td class="text-right"><label id="mkswithoutgst' + i + '" data-toggle="modal" href="#responsive" onClick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">' + thousands_separators((data[i].rfqPriceWithoutGST).round(2)) + '</label></td><td class="text-right"><label id="mkswithgst' + i + '" data-toggle="modal" href="#responsive" onClick="mapQuestion(\'' + data[i].rfqParameterId + '\',\'mkswithoutgst' + i + '\',\'' + data[i].rfQuantity + '\',\'' + ver + '\',\'mkswithgst' + i + '\',\'' + data[i].rfqVendorPrice + '\')">' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '</label></td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="hidden">' + data[i].rfqVendorPrice + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td>' + data[i].rfqDelivery + '</td><td><input type = "text" name=comm rows=2 class="form-control" maxlength=10  autocomplete=off id=vendoritemrem' + i + ' onkeypress="return isNumberKey(event)" value=' + data[i].vendorItemRemarks + '  >' + data[i].vendorItemRemarks + '</input></td></tr>').appendTo("#tblServicesProduct");
                            jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\',\'' + RFQRemark + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators((data[i].rfQuantity).round(2)) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class="fit hide">' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].vendorItemRemarks + '</td></tr>').appendTo("#tblRFQPrev");

                        }

                    }


                    $('#vendoritemrem' + i).maxlength({
                        limitReachedClass: "label label-danger",
                        alwaysShow: true
                    });
                    $('#vendoritemrem' + i).val(data[i].vendorItemRemarks)
                }
                jQuery('<tr><td colspan=7><b>Total</b></td><td class="text-right">' + thousands_separators(totalammwithoutGST.round(2)) + '</td><td class="text-right">' + thousands_separators(totalammwithGST.round(2)) + '</td><td>&nbsp;</td></tr>').appendTo("#tblServicesProduct");
                jQuery('<tr><td colspan=5><b>Total</b></td><td class="text-right">' + thousands_separators(totalammwithoutGST.round(2)) + '</td><td class="text-right">' + thousands_separators(totalammwithGST.round(2)) + '</td><td>&nbsp;</td></tr>').appendTo("#tblRFQPrev");

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
function fncollapse(id) {

    $('#' + id.id).toggleClass("glyphicon-plus glyphicon-minus")
}
function fetchRFIParameteronloadBoq(ver) {

    fetchRFQLevelTC(ver);
    jQuery("#divBoq").show();
    jQuery("#divNonboq").hide();
    jQuery("#tblServicesProductboq").empty();
    jQuery("#tblRFQPrevBoq").empty();
    jQuery("#tblRFQPrevBoq").show();
    $('#wrap_scrollerPrev').show();
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchRFQParameter_Boq/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        async: false,
        cache: false,
        dataType: "json",
        success: function (data) {
                
                 var srno, sheet, parentid;

            var sheetcount = 0; counter = 0;
            if (data[0].parameters.length > 0) {
                jQuery("#tblServicesProductboq").append('<thead><tr style="background: gray; color: #FFF;"><th style="width:14%!important"></th><th style="width:13%!important">SrNo</th><th style="width:25%!important">Item/Service</th><th style="width:5%!important">Currency</th><th style="width:13%!important">Tax</th><th style="width:5%!important">Landed Unit Price <br>(Without GST)</th><th style="width:5%!important">Landed Unit Price <br>(With GST)</th><th style="width:5%!important">Amount <br>(Without GST)</th><th style="width:5%!important">Amount <br>(With GST)</th><th style="width:25%!important">Delivery Location</th></tr></thead><tbody>');

                jQuery("#tblRFQPrevBoq").append('<thead><tr style="background: gray; color: #FFF;"><th style="width:14%!important"></th><th style="width:13%!important">SrNo</th><th style="width:25%!important">Item/Service</th><th style="width:5%!important">Currency</th><th style="width:13%!important">Tax</th><th style="width:5%!important">Landed Unit Price <br>(Without GST)</th><th style="width:5%!important">Landed Unit Price <br>(With GST)</th><th style="width:5%!important">Amount <br>(Without GST)</th><th style="width:5%!important">Amount <br>(With GST)</th><th style="width:25%!important">Delivery Location</th></tr></thead><tbody class="maintableboq">');


                for (var i = 0; i < data[0].parameters.length; i++) {
                    
                    pid = data[0].parameters[i].rfqParameterId;
                    parentid = data[0].parameters[i].rfqParameterParentID;
                    srno = data[0].parameters[i].srno;
                    
                     sheet = data[0].parameters[i].boqsheetName;
                     if (data[0].parameters[i].rfqParameterParentID > 0) {
                         
                            $('#btn' + data[0].parameters[i].rfqParameterParentID).attr('data-target', '#itemDiv' + data[0].parameters[i].rfqParameterParentID);
                            //for preview
                            $('#btnp' + data[0].parameters[i].rfqParameterParentID).attr('data-target', '#itemDivp' + data[0].parameters[i].rfqParameterParentID);



                            if ($("#itemTbl" + data[0].parameters[i].rfqParameterParentID).find('#itemDiv' + data[0].parameters[i].rfqParameterParentID).length <= 0) {
                                $("#itemTbl" + data[0].parameters[i].rfqParameterParentID).append("<tr><td colspan=10 class=hiddenRow style='border:none !important'><div class='accordian-body collapse' id='itemDiv" + data[0].parameters[i].rfqParameterParentID + "' ></div></tr>");
                            }
                            //for preview
                            if ($("#itemTblp" + data[0].parameters[i].rfqParameterParentID).find('#itemDivp' + data[0].parameters[i].rfqParameterParentID).length <= 0) {
                                $("#itemTblp" + data[0].parameters[i].rfqParameterParentID).append("<tr><td colspan=10 class=hiddenRow style='border:none !important'><div class='accordian-body collapse' id='itemDivp" + data[0].parameters[i].rfqParameterParentID + "' ></div></tr>");
                            }
                            if (data[0].parameters[i].rfqUomId != '') {

                                if ($("#itemDiv" + data[0].parameters[i].rfqParameterParentID).find('#th' + data[0].parameters[i].rfqParameterParentID).length <= 0) {
                                    $('#itemDiv' + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].parameters[i].rfqParameterParentID + " class='table table-bordered table-condensed  BoqTable'  style='margin-bottom:0px !important;' cellpadding=0 cellspacing=0><thead id=th" + data[0].parameters[i].rfqParameterParentID + "><tr style='background: #eee;color: #000;'><th style='width:10%!important'></th><th  style='width:10%!important' class=text-left>SrNo</th><th style='width:30%!important'>Item Name</th><th style='width:10%!important'>UOM</th><th style='width:10%!important'>Quantity</th><th style='width:30%!important'> Price</th></tr></thead></table>")

                                }

                                $("#itemDiv" + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].parameters[i].rfqParameterId + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");
                                $('#itemTbl' + data[0].parameters[i].rfqParameterId).append("<tbody class='maintableboq'><tr name='" + sheet + "'><td class='hide rParentID'>" + data[0].parameters[i].rfqParameterParentID + "</td><td class='hide rPID'>" + data[0].parameters[i].rfqParameterId + "</td><td style='width:10%!important'></td><td  style='width:10%!important' class='text-right'>" + srno + " </td><td style='width:30%!important' id=short" + data[0].parameters[i].rfqParameterId + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:10%!important'>" + data[0].parameters[i].rfqUomId + "</td><td style='width:10%!important' id='quantxtP" + data[0].parameters[i].rfqParameterId + "'>" + data[0].parameters[i].rfQuantity + "</td><td style='width:10%!important'><input  type=text value='" + data[0].parameters[i].itemPrice + "' class='form-control thousandseparated text-right' name='" + data[0].parameters[i].rfqParameterParentID + "'     id='txtP" + data[0].parameters[i].rfqParameterId + "' onkeyup='calPrice(this," + data[0].parameters[i].rfqParameterParentID + ")' /></td><td style='width:20%!important'><textarea rows=1   class='form-control maxlength'  maxlength=100  autocomplete='off' id=comm" + data[0].parameters[i].rfqParameterId + " name=comm" + data[0].parameters[i].rfqParameterId + " value=" + data[0].parameters[i].vendorItemRemarks + " >" + data[0].parameters[i].vendorItemRemarks + "</textarea></td></tr></tbody>")
                            }
                            else {
                                $("#itemDiv" + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].parameters[i].rfqParameterId + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");
                                    
                                $('#itemTbl' + data[0].parameters[i].rfqParameterId).append("<tbody class='maintableboq'><tr name='" + sheet + "'><td class='hide rParentID'>" + data[0].parameters[i].rfqParameterParentID + "</td><td class='hide rPID'>" + data[0].parameters[i].rfqParameterId + "</td><td style='width:10%!important' class=border-none><button style='background-color:white !important;margin-left:12%;'  type='button'  data-toggle=collapse   id='btn" + data[0].parameters[i].rfqParameterId + "'  class='btn iconbtn accordion-toggle' onclick='fncollapse(mainItem" + i + ")'><i class='glyphicon glyphicon-plus' id='mainItem" + i + "'></i></button></td><td  style='width:10%!important' class='text-right'>" + srno + " </td><td style='width:60%!important' id=short" + data[0].parameters[i].rfqParameterId + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:20%!important'><input style='border:none !important'  type=text name=" + data[0].parameters[i].rfqParameterParentID + "  id='lblPTot" + data[0].parameters[i].rfqParameterId + "' value=" + thousands_separators((data[0].parameters[i].rfqPriceWithoutGST  || 0).round(2)) + " onkeyup='calPrice(this," + data[0].parameters[i].rfqParameterParentID + ")' disabled></td></tr></tbody>")
                            }
                            //for preview
                            if (data[0].parameters[i].rfqUomId != '') {

                                if ($("#itemDivp" + data[0].parameters[i].rfqParameterParentID).find('#th' + data[0].parameters[i].rfqParameterParentID).length <= 0) {
                                    $('#itemDivp' + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTblp" + data[0].parameters[i].rfqParameterParentID + " class='table table-bordered table-condensed  BoqTable'  style='margin-bottom:0px !important;' cellpadding=0 cellspacing=0><thead id=thp" + data[0].parameters[i].rfqParameterParentID + "><tr style='background: #eee;color: #000;'><th style='width:10%!important'></th><th  style='width:10%!important' class=text-left>SrNo</th><th style='width:30%!important'>Item Name</th><th style='width:10%!important'>UOM</th><th style='width:10%!important'>Quantity</th><th style='width:30%!important'> Price</th></tr></thead></table>")

                                }

                                $("#itemDivp" + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTblp" + data[0].parameters[i].rfqParameterId + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");
                                $('#itemTblp' + data[0].parameters[i].rfqParameterId).append("<tbody class='maintableboq'><tr name='" + sheet + "'><td class='hide rPID'>" + data[0].parameters[i].rfqParameterId + "</td><td style='width:10%!important'></td><td  style='width:10%!important' class='text-right'>" + srno + " </td><td style='width:30%!important' id=shortp" + data[0].parameters[i].rfqParameterId + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:10%!important'>" + data[0].parameters[i].rfqUomId + "</td><td style='width:10%!important' id='quantxtPp" + data[0].parameters[i].rfqParameterId + "'>" + data[0].parameters[i].rfQuantity + "</td><td style='width:10%!important'><input style='border:none !important'  type=text value='" + data[0].parameters[i].itemPrice + "'  name='" + data[0].parameters[i].rfqParameterParentID + "'     id='txtPp" + data[0].parameters[i].rfqParameterId + "'  disabled/></td><td style='width:20%!important'><textarea style='border:none !important' disabled rows=1     autocomplete='off' id=commp" + data[0].parameters[i].rfqParameterId + " name=commp" + data[0].parameters[i].rfqParameterId + " value=" + data[0].parameters[i].vendorItemRemarks + " >" + data[0].parameters[i].vendorItemRemarks + "</textarea></td></tr></tbody>")
                            }
                            else {
                                $("#itemDivp" + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTblp" + data[0].parameters[i].rfqParameterId + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");

                                $('#itemTblp' + data[0].parameters[i].rfqParameterId).append("<tbody class='maintableboqp'><tr name='" + sheet + "'><td class='hide rPID'>" + data[0].parameters[i].rfqParameterId + "</td><td style='width:10%!important' class=border-none><button style='background-color:white !important;margin-left:12%;'  type='button'  data-toggle=collapse   id='btnp" + data[0].parameters[i].rfqParameterId + "'  class='btn iconbtn accordion-toggle' onclick='fncollapse(mainItemp" + i + ")'><i class='glyphicon glyphicon-plus' id='mainItemp" + i + "'></i></button></td><td  style='width:10%!important' class='text-right'>" + srno + " </td><td style='width:60%!important' id=shortp" + data[0].parameters[i].rfqParameterId + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:20%!important'><input style='border:none !important'  type=text name=" + data[0].parameters[i].rfqParameterParentID + "  id='lblPTotp" + data[0].parameters[i].rfqParameterId + "' value=" + thousands_separators((data[0].parameters[i].itemPrice || 0).round(2)) + " onkeyup='calPrice(this," + data[0].parameters[i].rfqParameterParentID + ")' disabled></td></tr></tbody>")
                            }
                           
                        }
                       else {
                         
                        sheetcount++
                        
                        sheet = data[0].parameters[i].boqsheetName;
                        $("#tblServicesProductboq").append("<tr><td colspan=10 class='hiddenRow' style='border:none !important'><div  id='itemDiv" + sheetcount + "'></div></tr>");
                        
                        //for preview
                         $("#tblRFQPrevBoq").append("<tr><td colspan=10 class='hiddenRow' style='border:none !important'><div  id='itemDivp" + sheetcount + "'></div></tr>");
                        
              
                        $("#itemDiv" + sheetcount).append("<table id=itemTbl" + pid + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");
                        
                        $('#itemTbl' + pid).append("<tbody ><tr class='maintablesheet' name='" + sheet + "'><td class='hide rParentID'>" + 0 + "</td><td class='hide rPID'>" + pid + "</td><td style='width:10%!important' class=border-none><button style='background-color:white !important; margin-left:5%' type='button'  data-toggle=collapse   id='btn" + pid + "'  class='btn iconbtn accordion-toggle' onclick='fncollapse(mainItem" + i + ")'><i class='glyphicon glyphicon-plus' id='mainItem" + i + "'></i></button></td><td  style='width:10%!important' class='text-right'>" + sheetcount + " </td><td style='width:20%!important' id=short" + pid + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:5%!important'>" + $('#txtcurrency').val() + "</td><td style='width:10%!important'><button type='button' class='btn btn-primary btn-xs' data-toggle='modal' href='#responsive' onClick='mapQuestionBoq(\"" + pid + "\",\"mkswithoutgstBoq" + pid + "\",\"" + data[0].parameters[i].rfQuantity + "\",\"" + sheet.split(" ").join("_") + "\",\"" + ver + "\",\"mkswithgstBoq" + pid + "\",\"" + data[0].parameters[i].rfqVendorPrice + "\")'>Enter Tax</button></td><td style='width:10%!important'><label  class='text-right' id='mkswithoutgstBoq" + pid + "' data-toggle='modal' href='#responsive' onclick='mapQuestionBoq(\"" + pid + "\",\"mkswithoutgstBoq" + pid + "\",\"" + data[0].parameters[i].rfQuantity + "\",\"" + sheet.split(" ").join("_") + "\",\"" + ver + "\",\"mkswithgstBoq" + pid + "\",\"" + data[0].parameters[i].rfqVendorPrice + "\")'>" + thousands_separators((data[0].parameters[i].rfqPriceWithoutGST).round(2)) + "</label></td><td style='width:10%!important'><label class='text-right' id='mkswithgstBoq" + pid + "' data-toggle='modal' href='#responsive' onclick='mapQuestionBoq(\"" + pid + "\",\"mkswithoutgstBoq" + pid + "\",\"" + data[0].parameters[i].rfQuantity + "\",\"" + sheet.split(" ").join("_") + "\",\"" + ver + "\",\"mkswithgstBoq" + pid + "\",\"" + data[0].parameters[i].rfqVendorPrice + "\")'>" + thousands_separators((data[0].parameters[i].rfqVendorPricewithTax).round(2)) + "</label></td><td style='width:9%!important' class='text-right' id=ammwithoutGST" + pid + ">" + thousands_separators((data[0].parameters[i].rfqPriceWithoutGST * 1).round(2)) + "</td><td style='width:6%!important' class='text-right' id=ammGST" + sheetcount + ">" + thousands_separators((data[0].parameters[i].rfqVendorPricewithTax * 1).round(2)) + "</td><td style='width:25% !important' class='text-right' id=delivery" + sheetcount + ">" + data[0].parameters[i].rfqDelivery+ "</td></tr></tbody>");
 
                       
                        
                       //for preview
                        $("#itemDivp" + sheetcount).append("<table id=itemTblp" + pid + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");
                        $('#itemTblp' + pid).append("<tbody ><tr class='maintablesheet' name='" + sheet + "'><td class='hide rPID'>" + pid + "</td><td style='width:9%!important' class=border-none><button style='background-color:white !important; margin-left:5%' type='button'  data-toggle=collapse   id='btnp" + pid + "'  class='btn iconbtn accordion-toggle' onclick='fncollapse(mainItemp" + i + ")'><i class='glyphicon glyphicon-plus' id='mainItemp" + i + "'></i></button></td><td  style='width:10%!important' class='text-right'>" + sheetcount + " </td><td style='width:18%!important' id=shortp" + pid + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:7%!important'>" + $('#txtcurrency').val() + "</td><td style='width:9%!important'></td><td style='width:11%!important'><label  class='text-right' id='mkswithoutgstBoqp" + pid + "' >" + thousands_separators((data[0].parameters[i].rfqPriceWithoutGST).round(2)) + "</label></td><td style='width:10%!important'><label class='text-right' id='mkswithgstBoq" + pid + "' data-toggle='modal' href='#responsive' onclick='mapQuestionBoq(\"" + pid + "\",\"mkswithoutgstBoq" + pid + "\",\"" + data[0].parameters[i].rfQuantity + "\",\"" + sheet.split(" ").join("_") + "\",\"" + ver + "\",\"mkswithgstBoq" + pid + "\",\"" + data[0].parameters[i].rfqVendorPrice + "\")'>" + thousands_separators((data[0].parameters[i].rfqVendorPricewithTax).round(2)) + "</label></td><td style='width:9%!important' class='text-right' id=ammwithoutGSTp" + pid + ">" + thousands_separators((data[0].parameters[i].rfqPriceWithoutGST * 1).round(2)) + "</td><td style='width:6%!important' class='text-right' id=ammGSTp" + sheetcount + ">" + thousands_separators((data[0].parameters[i].rfqVendorPricewithTax * 1).round(2)) + "</td><td style='width:25%!important' class='text-right' id=deliveryp" + sheetcount + ">" + data[0].parameters[i].rfqDelivery+ "</td></tr></tbody>");
                        
                       
                        
                        parentid = data[0].parameters[i].rfqParameterId;

                    }
                    
                    
                }

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

function calPrice(ID, parentid) {
    localecommaseperator(ID)
    var tot = 0.0, roottotal = 0.0;
    var txtboxidval = 0;
    var quan = 0;
    var TD_SheetName = "";
    var basicprice = 0.0;

    $('#tblServicesProductboq tr >td').find('input').each(function () {
      
        if ($(this).attr("name") == parentid) {
      
            txtboxidval = removeThousandSeperator($('#' + ($(this).attr('id'))).val());
           
             if ($('#quan' + ($(this).attr('id'))).text()!=""){
                 quan = parseFloat(removeThousandSeperator($('#quan' + ($(this).attr('id'))).text()));
                  tot = tot + (txtboxidval == "" ? 0 : parseFloat(txtboxidval * quan));
            }
            else{
                 quan=1
                 tot = tot + (txtboxidval == "" ? 0 : parseFloat(txtboxidval * quan));
            
            }
           
           

        }
 
    });
   
    $('#lblPTot' + parentid).val(thousands_separators((tot).round(2))).trigger("keyup");
    
   
    
    
    
 
    txtboxidval = 0;
   

    $('#mkswithoutgstBoq' + parentid).text(thousands_separators((tot).round(2)))
    $('#mkswithgstBoq' + parentid).text('')
    $('#ammGST' + parentid).text('')
    $('#ammwithoutGST' + parentid).text(thousands_separators((tot).round(2)))

    $('#mkswithoutgstBoq' + parentid).text(thousands_separators((tot).round(2)))
    $('#mkswithgstBoq' + parentid).text('')
    $('#ammGST' + parentid).text('')
    $('#ammwithoutGST' + parentid).text(thousands_separators((tot).round(2)))
    isTaxCorrected = "N";
    
}


function mapQuestionBoq(RFQParameterId, mskwithoutgst, quantity, sheet, version, withgst, basicpriceDB) {
    
    
    isSaveButtonClicked = "N";
    var basicprice = 0.0;
   
    txtboxidval = 0;
    $('#tblServicesProductboq tr>td').find('input').each(function () {
        
         if ($(this).attr("name") == RFQParameterId && sheet == $(this).closest('tr').attr("name").split(" ").join("_")) {
            
            txtboxidval = removeThousandSeperator($('#' + ($(this).attr('id'))).val());
            
             if ($('#quan' + ($(this).attr('id'))).text()!=""){
                quan = parseFloat(removeThousandSeperator($('#quan' + ($(this).attr('id'))).text()));
                basicprice = basicprice + (txtboxidval == "" ? 0 : parseFloat(txtboxidval * quan));
            }
            else{
                 quan=1
                 basicprice = basicprice + (txtboxidval == "" ? 0 : parseFloat(txtboxidval * quan));
            }
        }
    });
    $('#txtbasicPrice').attr('disabled', 'disabled');
    $('#txtbasicPrice').val(basicprice);
    //$("#hddnBoqParamQuantity").val(quantity);
    $('#texttblidwithGST').val(withgst);
    $('#texttblidwithoutGST').val(mskwithoutgst);
    $('#txtRFQParameterId').val(RFQParameterId);
    $('#txtRFQSheet').val(sheet.split('_').join(' '));
    
    saveQuotationBoq(sheet, RFQParameterId);
    fncheckItemWiseTC(version, RFQParameterId);
}

function saveQuotationBoq(sheet, RFQParameterId) {
    validateSubmit = false;
    var PriceDetails = [];
    var commercialterms = [];
    var attchquery = '';
    var rPID = "";

    isTaxCorrected = "Y";

    _RFQBidType = sessionStorage.getItem('hdnRFQBidType');
    var vendorRemarks = "";

    //var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');


    if (validateSubmit) {

        $("#tblServicesProductboq").find('tr').each(function (i) {
            var this_row = $(this);
           
            //if ((sheet!="" && this_row.attr("name")== sheet) || sheet=='')   
            //{
            if (this_row.attr("name") != undefined) {  //sheet == this_row.attr("name") && 
                rPID = $.trim(this_row.find('.rPID').text());
                 rParentID = $.trim(this_row.find('.rParentID').text());
                if (_RFQBidType == 'Open') {
                    // vendorRemarks = $.trim(this_row.find('textarea').val()).replace(/'/g, "''")
                    vendorRemarks = $.trim($('#comm' + rPID).val()).replace(/'/g, "''");
                }

                var _cleanString = ($.trim($('#short' + rPID).text().replace(/'/g, "''")));

                var RFQQuantity = 0;
                var ItemPrice = 0; var withoutgstboq = 0; withgstboq = 0; rfqvendorprice = 0;
                if ($('#quantxtP' + rPID).text() != "" && $('#quantxtP' + rPID).text() != undefined && $('#quantxtP' + rPID).text() != null) {
                    RFQQuantity = parseFloat(removeThousandSeperator($.trim($('#quantxtP' + rPID).text())));
                }

                if ($('#txtP' + rPID).val() != "" && $('#txtP' + rPID).val() != undefined && $('#txtP' + rPID).val() != null) {
                    ItemPrice = parseFloat(removeThousandSeperator($.trim($('#txtP' + rPID).val())));
                    withoutgstboq = parseFloat(removeThousandSeperator($.trim($('#txtP' + rPID).val())));
                }
                else if ($('#lblPTot' + rPID).val() != "" && $('#lblPTot' + rPID).val() != undefined && $('#lblPTot' + rPID).val() != null) {
                    ItemPrice = parseFloat(removeThousandSeperator($.trim($('#lblPTot' + rPID).val())));
                    withoutgstboq=parseFloat(removeThousandSeperator($.trim($('#lblPTot' + rPID).val())));
                }
                if ($('#mkswithoutgstBoq' + rPID).text() != "" && $('#mkswithoutgstBoq' + rPID).text() != undefined && $('#mkswithoutgstBoq' + rPID).text() != null) {
                   
                    withoutgstboq = parseFloat(removeThousandSeperator($.trim($('#mkswithoutgstBoq' + rPID).text())));
                }
                
                if ($('#mkswithgstBoq' + rPID).text() != "" && $('#mkswithgstBoq' + rPID).text() != undefined && $('#mkswithgstBoq' + rPID).text() != null) {
                    withgstboq = parseFloat(removeThousandSeperator($.trim($('#mkswithgstBoq' + rPID).text())));
                }
                if ($('#vendorprice' + rPID).text() != "" && $('#vendorprice' + rPID).text() != undefined && $('#vendorprice' + rPID).text() != null) {
                    rfqvendorprice = parseFloat(removeThousandSeperator($.trim($('#vendorprice' + rPID).text())));
                }
                
                var quotes = {
                    "VendorID": parseInt(sessionStorage.getItem('VendorId')),
                    "RFQParameterId": parseInt(rPID),
                    "RFQId": parseInt($.trim(sessionStorage.getItem('hddnRFQID'))),
                    "RFQShortName": _cleanString,
                    "RFQUomId": $.trim($('#uom' + rPID).text()),
                    "RFQuantity": RFQQuantity == null ? 0 : RFQQuantity,
                    "RFQDelivery": $.trim($('#delivery' + rPID).text()),
                    "RFQVendorPricewithTax": withgstboq,
                    "RFQPriceWithoutGST": withoutgstboq,
                    "RFQVendorPrice": rfqvendorprice,
                    "RFQTCID": 0,
                    "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
                    "FinalStatus": 'N',
                    "VendorItemRemarks": vendorRemarks,
                    "ItemPrice": ItemPrice == null ? 0 : ItemPrice,
                    "RFQParameterParentID":  parseInt(rParentID),
                    "BoqSheetName": this_row.attr("name").split('_').join(' ')
                };
                PriceDetails.push(quotes)
            }
        ///}

        });
       
        $("#tblRFQLevelTCForQuot > tbody > tr").each(function () {
            var this_row = $(this);
            var _otherTC = $.trim(this_row.find('td:eq(6)').html());
            if (_otherTC == null || _otherTC == '' || _otherTC == 'undefined') {
                _otherTC = 0;
            }
            else {
                _otherTC = parseInt(_otherTC);
            }

            var _cleanString = StringEncodingMechanism($.trim(this_row.find('td:eq(5)').find('textarea').val()));

            var comm = {
                "VendorID": parseInt(sessionStorage.getItem('VendorId')),
                "RFQTCID": parseInt($.trim(this_row.find('td:eq(0)').html())),
                "RFQID": parseInt($.trim(this_row.find('td:eq(1)').html())),
                //"Remarks": $.trim(this_row.find('td:eq(5)').find('textarea').val()),//.replace(/'/g, "''"),
                "Remarks": _cleanString,
                "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
                "FinalStatus": 'N',
                "OtherTermCondition": _otherTC//($.trim(this_row.find('td:eq(6)').html()))
            };
            commercialterms.push(comm)
        });
        $("#tblAttachmentsresponse> tbody > tr").each(function (index) {
            var this_row = $(this);
            attchquery = attchquery + $.trim(this_row.find('td:eq(0)').text()) + '~' + $.trim(this_row.find('td:eq(1)').text()) + '#';

        });

        var _cleanString2 = StringEncodingMechanism($('#txtvendorremarks').val());
        if (isTaxCorrected == "Y") {
            var Tab2data = {
                "PriceDetails": PriceDetails,
                "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
                "VendorId": parseInt(sessionStorage.getItem('VendorId')),
                "RFQVersionId": parseInt(sessionStorage.getItem('RFQVersionId')),
                "CommercialTerms": commercialterms,
                //"VendorRemarks": $('#txtvendorremarks').val(),
                "VendorRemarks": _cleanString2,
                "PreviousVersion": PreviousVersion,
                "AttachString": attchquery

            };

            console.log(JSON.stringify(Tab2data))
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

                    //setTimeout(function () {
                    if (parseInt(data) != 0) {
                        fetchRFIParameteronloadBoq(sessionStorage.getItem('RFQVersionId'));
                    }
                    return true;
                    //}, 500);

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
}

function fnReplicateToAllItemsBoq() {
    validateSubmit = false;
    PricewithoutGST = 0;
    Price = 0;
    basicprice = 0;
    // var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');


    if (validateSubmit) {
        $('#loader-msg').html('Processing. Please Wait...!');
        $('.progress-form').show();

        RFQinsertItemsTCBoq('N');
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
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRFQVendor/eRFQQuotedTCPriceSave_Boq/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {
                $('#responsive').modal('hide');
                fetchRFIParameteronloadBoq(sessionStorage.getItem('RFQVersionId'));
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
        $('.progress-form').hide()
    }
}
function fngetcalcUnitwithTerms(BoqPID, data) {
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');

    basicprice = 0.0;
    Price = 0.0;
    PricewithoutGST = 0.0;
    PriceGSTOnly = 0.0;
    basicprice = 0.0;
    PricewithoutGSTDiscount = 0.0;

    basicprice = removeThousandSeperator($('#txtbasicPrice').val());



    if (data.length > 0) {
        jQuery.each(data, function (key, value) {

            if ($.trim(value.tcName).toLowerCase() != "gst" && $.trim(value.tcName).toLowerCase() != "discount") {
                PricewithoutGST = PricewithoutGST + (parseFloat(removeThousandSeperator($('#mkswithtax1' + key).val())) / 100);
            }
            if ($.trim(value.tcName).toLowerCase() == "gst") {

                PriceGSTOnly = (parseFloat(removeThousandSeperator($('#mkswithtax1' + key).val())) / 100);
            }
            if ($.trim(value.tcName).toLowerCase() == "discount") {
                PricewithoutGSTDiscount = PricewithoutGSTDiscount + (parseFloat(removeThousandSeperator($('#mkswithtax1' + key).val())) / 100);
            }
        });

        PricewithoutGST = ((removeThousandSeperator(basicprice) * (PricewithoutGST + 1))) * (1 - PricewithoutGSTDiscount);
        Price = (removeThousandSeperator(PricewithoutGST) * (PriceGSTOnly + 1));


        $("#mkswithoutgstBoq" + BoqPID).text(thousands_separators(PricewithoutGST.round(2)));
        $("#mkswithgstBoq" + BoqPID).text(thousands_separators(Price.round(2)));

        $('#taxrecalculate').modal('hide');
        jQuery.unblockUI();
    }


}
function RFQinsertItemsTCBoq(issubmitbuttonclick) {
    
    //CHECK HERE 
    validateSubmit = false;
    Price = 0.0;
    PricewithoutGST = 0.0;
    PriceGSTOnly = 0.0;
    basicprice = 0.0;
    PricewithoutGSTDiscount = 0.0;
    basicprice = removeThousandSeperator($('#txtbasicPrice').val());

    // var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');
    if ($('.numeric').val() == '') {
        $('.numeric').val('0')
    }

    if (validateSubmit) {

        $('#loader-msg').html('Processing. Please Wait...!');
        $('.progress-form').show();
        PriceDetails = [];
        //alert(jQuery('#tblRFQParameterComponet  tr').length)
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
                //var vendorRemarks = "";
                //if (_RFQBidType == 'Open') {
                //    vendorRemarks = StringEncodingMechanism($.trim(this_row.find('td:eq(17)').find('textarea').val()))//.replace(/'/g, "''")
                //}
                //else {
                //    vendorRemarks = StringEncodingMechanism($.trim(this_row.find('td:eq(17) input[type="text"]').val()))

                //}
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
                    "VendorItemRemarks": "", //vendorRemarks,
                    "ItemPrice": 0,
                    "BoqSheetName": $('#txtRFQSheet').val()

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

            // console.log(JSON.stringify(Tab2data))
            jQuery.ajax({

                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "eRFQVendor/eRFQQuotedTCPriceSave_Boq/",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                crossDomain: true,
                async: false,
                data: JSON.stringify(Tab2data),
                dataType: "json",
                success: function (data) {


                    $("#" + $('#texttblidwithGST').val()).val(Price);
                    $("#" + $('#texttblidwithoutGST').val()).val(PricewithoutGST);
                    fetchRFIParameteronloadBoq(sessionStorage.getItem('RFQVersionId'));
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

function fnRecalculatePrices() {
     
     $('#btnsubmit').attr("disabled","disabled")
     $('#taxrecalculate').modal('hide');
     jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
     Metronic.scrollTo($('.page-title'));
    
    
    
    
     var rPID
    
   setTimeout(function() {
       
        $(".maintablesheet").each(function (i) {
        
       
        var this_row = $(this);
       

            rPID = $.trim(this_row.find('.rPID').text());
             console.log(rPID)
            $('#txtbasicPrice').val(parseInt(removeThousandSeperator($('#mkswithoutgstBoq'+ rPID).text())))
            isSaveButtonClicked = "N";
            
            saveQuotationBoq(this_row.attr("name"), rPID);
            
            fetchRFQParameterComponent(sessionStorage.getItem('RFQVersionId'), rPID)
            $('#btnsubmit').removeAttr("disabled")
            jQuery.unblockUI()

          })
         }, 300); 
 
   
   
}



   
    





function fetchRFQParameterComponent(version, BoqPID) {


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQfetchTCQuotation/?RFQId=" + sessionStorage.getItem("hddnRFQID") + "&ParameterID=" + BoqPID + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + version,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
             
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblRFQParameterComponet").empty();
            $('#scrolr').show();

            if (data.length > 0) {

                jQuery("#tblRFQParameterComponet").append("<thead><tr style='background: gray; color: #FFF;'><th>Commercial Terms</th><th>Applicable Rate %age</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {
                    jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].rfqParameterId + '</td><td class=hidden >' + data[i].rfqid + '</td><td class=hidden >' + data[i].tcid + '</td><td>' + data[i].tcName + '</td><td><input type="text"   id="mkswithtax1' + i + '" class="form-control text-right numeric" value="' + thousands_separators((data[i].rfqVendorPricewithTax).round(2)) + '"  autocomplete=off   onkeyup="this.value=minmax(this.value, 0, 90)" /></td></tr>').appendTo("#tblRFQParameterComponet");

                }
                fngetcalcUnitwithTerms(BoqPID, data);

            }
            else {
                jQuery("#tblRFQParameterComponet").append('<tr><td>No Information is there..</td></tr>');
                $('.alert-danger').show();
                $('#spandanger').html('Terms & Condition Information is not there..');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                jQuery.unblockUI();
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

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function showDetailedDescription(descText, RFQRemark) {
    $("#paraItemDescription").html(descText);
    $('#pararfqremark').html(RFQRemark);
}

setTimeout(function () { sessionStorage.removeItem('selectedboqtxtboxid') }, 5000);
sessionStorage.removeItem('selectedboqtxtboxidTax');

function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));
}
function DownloadFileVendor(aID, version) {

    if (version == "-1") {
        version = sessionStorage.getItem('RFQVersionId')
    }
    else {
        version = version;
    }
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + version);
}

function mapQuestion(RFQParameterId, mskwithoutgst, quantity, version, withgst, basicprice) {

   
    $('#txtbasicPrice').val((basicprice))
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
    $('#txtbasicPrice').removeAttr('disabled')
})
var Price = 0;
var PricewithoutGST = 0;
var basicprice = 0; var PricewithoutGSTDiscount = 0;
var validateSubmit = true;

function RFQinsertItemsTC(issubmitbuttonclick) {
    
    //CHECK HERE 
    validateSubmit = false;
    Price = 0.0;
    PricewithoutGST = 0.0;
    PriceGSTOnly = 0.0;
    basicprice = 0.0;
    PricewithoutGSTDiscount = 0.0;


    basicprice = removeThousandSeperator($('#txtbasicPrice').val());
    // var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');

    //abheedev production issue 09/12/2022

    if ($('#mkswithtax10').val() == '') {
        $('#mkswithtax10').val('0')

    }
    if ($('#mkswithtax11').val() == '') {
        $('#mkswithtax11').val('0')

    }
    if ($('#mkswithtax12').val() == '') {
        $('#mkswithtax12').val('0')

    }
    if ($('#mkswithtax13').val() == '') {
        $('#mkswithtax13').val('0')

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
                    vendorRemarks = StringEncodingMechanism($.trim(this_row.find('td:eq(17)').find('textarea').val()))//.replace(/'/g, "''")
                }
                else {
                    vendorRemarks = StringEncodingMechanism($.trim(this_row.find('td:eq(17) input[type="text"]').val()))

                }
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

                    //discuss with Sidharth sir
                    //(async () => {
                    //    await fetchRFIParameteronload(sessionStorage.getItem('RFQVersionId'))
                    //})();

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
    validateSubmit = false;
    var PriceDetails = [];
    var commercialterms = [];
    var attchquery = '';
    _RFQBidType = sessionStorage.getItem('hdnRFQBidType');
    var vendorRemarks = "";

    //var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');


    if (validateSubmit) {
        $("#tblServicesProduct > tbody > tr").not(':last').each(function () {
            var this_row = $(this);
            if (_RFQBidType == 'Open') {
                vendorRemarks = $.trim(this_row.find('td:eq(17)').find('textarea').val()).replace(/'/g, "''")
            }
            else {
                vendorRemarks = $.trim(this_row.find('td:eq(17) input[type="text"]').val())

            }

            var _cleanString = StringEncodingMechanism($.trim(this_row.find('td:eq(2)').text().replace(/'/g, "''")));
            var quotes = {
                "VendorID": parseInt(sessionStorage.getItem('VendorId')),
                "RFQParameterId": parseInt($.trim(this_row.find('td:eq(0)').html())),
                "RFQId": parseInt($.trim(this_row.find('td:eq(1)').html())),
                //"RFQShortName": $.trim(this_row.find('td:eq(2)').text().replace(/'/g, "''")),
                "RFQShortName": _cleanString,
                "RFQUomId": removeThousandSeperator($.trim(this_row.find('td:eq(3)').html())),
                "RFQuantity": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(4)').html()))),
                "RFQDelivery": $.trim(this_row.find('td:eq(7)').html()),
                "RFQVendorPricewithTax": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(10) label').text()))),
                "RFQPriceWithoutGST": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(9) label').text()))),
                "RFQVendorPrice": parseFloat($.trim(this_row.find('td:eq(13)').html())),
                "RFQTCID": 0,
                "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
                "FinalStatus": 'N',
                "VendorItemRemarks": vendorRemarks

            };

            PriceDetails.push(quotes)
        });

        $("#tblRFQLevelTCForQuot > tbody > tr").each(function () {
            var this_row = $(this);
            var _otherTC = $.trim(this_row.find('td:eq(6)').html());
            if (_otherTC == null || _otherTC == '' || _otherTC == 'undefined') {
                _otherTC = 0;
            }
            else {
                _otherTC = parseInt(_otherTC);
            }

            var _cleanString = StringEncodingMechanism($.trim(this_row.find('td:eq(5)').find('textarea').val()));

            var comm = {
                "VendorID": parseInt(sessionStorage.getItem('VendorId')),
                "RFQTCID": parseInt($.trim(this_row.find('td:eq(0)').html())),
                "RFQID": parseInt($.trim(this_row.find('td:eq(1)').html())),
                //"Remarks": $.trim(this_row.find('td:eq(5)').find('textarea').val()),//.replace(/'/g, "''"),
                "Remarks": _cleanString,
                "Version": parseInt(sessionStorage.getItem('RFQVersionId')),
                "FinalStatus": 'N',
                "OtherTermCondition": _otherTC//($.trim(this_row.find('td:eq(6)').html()))
            };
            commercialterms.push(comm)
        });
        $("#tblAttachmentsresponse> tbody > tr").each(function (index) {
            var this_row = $(this);
            attchquery = attchquery + $.trim(this_row.find('td:eq(0)').text()) + '~' + $.trim(this_row.find('td:eq(1)').text()) + '#';

        });

        var _cleanString2 = StringEncodingMechanism($('#txtvendorremarks').val());
        var Tab2data = {
            "PriceDetails": PriceDetails,
            "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
            "VendorId": parseInt(sessionStorage.getItem('VendorId')),
            "RFQVersionId": parseInt(sessionStorage.getItem('RFQVersionId')),
            "CommercialTerms": commercialterms,
            //"VendorRemarks": $('#txtvendorremarks').val(),
            "VendorRemarks": _cleanString2,
            "PreviousVersion": PreviousVersion,
            "AttachString": attchquery
        };
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
                    $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                    if (isboq == "N") {
                        fnReplicateToAllItems()
                    }
                    else {
                        fnReplicateToAllItemsBoq()
                    }
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
    validateSubmit = false;
    PricewithoutGST = 0;
    Price = 0;
    basicprice = 0;
    // var EndDT = new Date($('#lblrfqenddate').text().replace('-', ''));
    Dateandtimevalidate($('#lblrfqenddate').text(), 'enddate');


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
        window.location = "VendorHome.html";
    }
}


function warnforsubmit() {

    bootbox.dialog({
        title: "Confirm",
        message: "Your prices are not yet submitted to the client. Do you still want go back to homepage?",
        buttons: {
            cancel: {
                label: "Cancel",
                className: "btn-danger",
                callback: function () {

                }
            },
            ok: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    fnRedirectToHome()
                }
            }
        }
    });
}
function downloadBOQ() {

     $("#downBOQ").attr("disabled","disabled");
     $(".loaderC").removeClass("hide");
    setTimeout(function () {
          fetch(sessionStorage.getItem("APIPath") + "eRFQVendor/RFQBoqdownload/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=0")
        .then(resp => resp.blob())
        .then(blob => {
            
           
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'Grid.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            $(".loaderC").addClass("hide");
            bootbox.alert("File downloaded Successfully.", function () {
                 $("#downBOQ").removeAttr("disabled");
                 return true;
            });

        })
        .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setTimeout(function () {
                    $(".loaderC").addClass("hide");
                }, 500);
            });
  
        
    },500)
  
}

let uploadfilename = "" ;

function UploadBOQ() {
    
    
    $('#btnsYesB').attr('disabled','disabled');
    $('#modalLoaderparameterBoq').show();
    var formData = new FormData();
    formData.append('file', $('#file-excelparameterB')[0].files[0]);
    formData.append('foldername', "eRFQ/" + sessionStorage.getItem('hddnRFQID') + "/BOQ/Vendor/"+sessionStorage.getItem('VendorId'));
    formData.append('RFQId', sessionStorage.getItem('hddnRFQID'));
    formData.append('VendorId', sessionStorage.getItem('VendorId'));
    formData.append('RFQVersionId', sessionStorage.getItem('RFQVersionId'));
    
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/BOQBulkPriceUpdate/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (data) {
            
            if (data.status == "S") {
                $('#modalLoaderparameterBoq').hide();
                $('#UploadBoqExcel').modal('hide');
               fetchRFIParameteronloadBoq(sessionStorage.getItem('RFQVersionId'))
            }
            else {
                $('#modalLoaderparameterBoq').hide();
                $('#UploadBoqExcel').modal('hide');
                $(".alert-danger").show();
                $(".alert-danger").find("span").html('').html(data.error);
                $(".alert-danger").fadeOut(4000);

                jQuery.unblockUI();
            }
            $('#btnsYesB').removeAttr('disabled');
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
            $('#btnsYesB').removeAttr('disabled');
            return false;
            
        }
    });
}

//forupload
function handleFileparameterBoq(e) {
  
    //Get the files from Upload control
    var files = e.target.files;
    var i, f;
    sheetcount = 0;
    sCounter = 1;
    st = true;
    ErrorMszDuplicate = '';
    $("#success-excelparameterB").hide();
    $("#error-excelparameterB").hide();
    $("#temptableForExcelDataparameter").empty();
    if(files.length>0){
    $('#modalLoaderparameterBoq').show();
    }
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
             
                var sheet1 = y;//workbook.SheetNames[y];
             
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y], {
                header: 0,
                defval: ""
              });
                //console.log(roa)
                //var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1]);
                if (sheet1 == "Summary") {
                    sheetcount = roa.length;
                }
                if (sheet1 != "Summary" && sheet1 != "Instructions") {
                    // console.log(sheet1)
                    
                    if (roa.length > 0) {
                        result = roa;
                        //console.log(st)
                        if (st == true) {
                            
                            printDataparameterBoq(result, sheet1)
                            sCounter = sCounter + 1;
                        }
                        else {
                           
                           $('#modalLoaderparameterBoq').hide();
                            return false;
                        }
                    }
                }
            });
            
          
            //Get the first column first cell value
            //printDataparameterBoq(result)
        };
        reader.readAsArrayBuffer(f);
    }
      $('#modalLoaderparameterBoq').hide();
}
var numberOnly = /^\d+(?:\.\d{1,3})?$/;
var srnoonly = /^\d+/;
function printDataparameterBoq(result, sheet) {
    

    if(result[0].RFQId != sessionStorage.getItem("hddnRFQID")) {
        
        $("#errspan-excelparameterB").html('');
        $("#error-excelparameterB").show();
        $("#errspan-excelparameterB").html('RFQ file can be uploaded for same RFQ only ');
        $("#file-excelparameterB").val('');
        return false;
        
    }
    
    var loopcount = result.length; //getting the data length for loop.
    if (loopcount > 0) {

        for (var i = 0; i < loopcount; i++) {
            
            
            if ($.trim(result[i].RFQParameterId) == '' && $.trim(result[i].RFQParameterId) == undefined) {
                $("#error-excelparameterB").show();
                $("#errspan-excelparameterB").html('RFQ parameter id cannot be empty. Please fill and upload the file again.');
                $("#file-excelparameterB").val('');
                st = false;
                return false;

            }
        
           else if (!$.trim(result[i].Srno).match(srnoonly) && $.trim(result[i].Srno) != "" && $.trim(result[i].Srno) != undefined) {
                $("#error-excelparameterB").show();
                $("#errspan-excelparameterB").html('Srno should be in numbers of <b>' + sheet + '</b> of line no ' + (i + 2) + '. Please fill and upload the file again.');
                $("#file-excelparameterB").val('');
                st = false;
                return false;
            }
            
            else if ($.trim(result[i].RFQItemCode).length > 50) {
                $("#error-excelparameterB").show();
                $("#errspan-excelparameterB").html('Item Code length should be 50 characters of <b>' + sheet + '</b> of line no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameterB").val('');
                st = false;
                return false;
            }
            
            
           


            else if ($.trim(result[i].VendorItemRemarks) != '' && $.trim(result[i].VendorItemRemarks).length > 200) {
                $("#error-excelparameterB").show();
                $("#errspan-excelparameterB").html('Remarks length should be 200 characters of <b>' + sheet + '</b> of line no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameterB").val('');
                st = false;
                return false;
            }
           
            else if (!$.trim(result[i].RFQuantity).match(numberOnly) && RFQuantity != 0) {
                
                $("#error-excelparameterB").show();
                $("#errspan-excelparameterB").html('Quantity should be in numbers or upto 3 decimal places of <b>' + sheet + '</b> of line no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameterB").val('');
                st = false;
                return false;
            }
             else if (!$.trim(result[i].ItemPrice).match(numberOnly) && result[i].ItemPrice != 0) {
                
                $("#error-excelparameterB").show();
                $("#errspan-excelparameterB").html('Quantity should be in numbers or upto 3 decimal places of <b>' + sheet + '</b> of line no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameterB").val('');
                st = false;
                return false;
            }
            
            
           
           
        
                  
      
        
    }
    }
        var excelCorrectB = 'Y'//'N';
        var ErrorUOMMsz = '';
        var ErrorUOMMszRight = '';
        Rowcount = 0;
        
        if (excelCorrectB == "Y" && sCounter == sheetcount) {
            $("#error-excelparameterB").hide();
            $("#success-excelparameterB").show();
            $('#btnsforYesNoboq').show()
            $("#succspan-excelparameterB").html('<p>Excel file is found ok.Do you want to upload ?\n This will clean your existing Data.</p>\n <p style="color:red"><b>Special characters like -\',\", #,&,~  shall be removed from the text during upload. Please check your text accordingly.</b></p>');
            //$("#file-excelparameterB").val('');
            excelCorrectB = '';
            if (st == 'false') {
                $("#error-excelparameterB").show();
                $("#errspan-excelparameterB").html(ErrorMszDuplicate)
            }

        }

       else {
           $("#error-excelparameterB").show();
           $("#errspan-excelparameterB").html('No Items Found in Excel');
        }
                
                

      
}

function fnNoExcelUploadB() {
    $("#temptableForExcelDataparameter").empty();
    $('#modalLoaderparameterBoq').addClass('display-none');
    $("#instructionsDivParameterBoq").hide();
    $("#instructionSpanParameterBoq").hide();
    $("#error-excelparameterB").hide();
    $("#success-excelparameterB").hide();
    $('#btnsforYesNoB').show()
    $("#file-excelparameterB").val('');
    $('#UploadBoqExcel').modal('hide');
}


    $("#UploadBoqExcel").on("hidden.bs.modal", function () {
    jQuery("#success-excelparameterB").hide();
    jQuery("#modalLoaderparameterBoq").hide();
    
  

});


