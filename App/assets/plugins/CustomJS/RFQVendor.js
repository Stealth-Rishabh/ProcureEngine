

var error = $('.alert-danger');

var success = $('.alert-success');

var form = $('#submit_form');
var Vehicleerror = $('#errordiv');
var Vehiclesuccess = $('#successdiv');
var Vehicleerror1 = $('#errordiv1');
var Vehiclesuccess1 = $('#successdiv1');
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
                    mapedapprover: {

                        required: true
                    },
                  
                 
                   

                    //Second Tab
                    txtRemark: {
                        required: true
                    },
                    txtbiddescriptionP: {
                        required: true
                       
                    },
                    txtedelivery: {
                        required: true
                    },
                    dropuom: {
                        required: true
                     },
                     txttargetprice: {
                         required: true
                     },
                     txtquantitiy: {
                         required: true
                     },
                     txtshortname: {
                         required: true
                     },

                     txtRemark1: {
                        required: true
                    }


                    //POPUP
                  


                },

                messages: {

                    'payment[]': {

                        required: "Please select at least one option",

                        minlength: jQuery.validator.format("Please select at least one option")

                    }

                },

                errorPlacement: function (error, element) {

                    if (element.attr("name") == "gender") {

                        error.insertAfter("#form_gender_error");

                    } else if (element.attr("name") == "payment[]") {

                        error.insertAfter("#form_payment_error");

                    } else {

                        error.insertAfter(element);

                    }



                    if ($("#txtrfqDate").closest('.inputgroup').attr('class') == 'inputgroup has-error') {

                        $("#btncal").css("margin-top", "-22px");

                    }

                },

                invalidHandler: function (event, validator) {

                    success.hide();

                    error.show();

                    Metronic.scrollTo(error, -200);
                    error.fadeOut(5000);

                },

                highlight: function (element) {

                    $(element)

                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');

                    $(element)

                         .closest('.col-md-4').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element)

                        .closest('.inputgroup').removeClass('has-error');
                    $(element)

                        .closest('.col-md-4').removeClass('has-error');

                },

                success: function (label) {

                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {

                        label

                            .closest('.inputgroup').removeClass('has-error').addClass('has-success');
                        label

                        .closest('.col-md-4').removeClass('has-error').addClass('has-success');

                        label.remove();

                    } else {

                        label

                            .addClass('valid') // mark the current input as valid and display OK icon

                        .closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group
                        label.closest('.col-md-4').removeClass('has-error').addClass('has-success'); // set success class to the control group

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
                      

                    }  if (index == 2) {
                        if ($('#tblServicesProduct >tbody >tr').length == 0) {

                            return false;

                        }
                        else {
                            
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
            
            $('#form_wizard_1 #savenexit').click(function () {

                RFQparameterinsert();
            });
            $('#form_wizard_1 .button-submit').click(function () {

                if ($('#tblServicesProduct >tbody >tr').length == 0) {



                    $('#form_wizard_1').bootstrapWizard('previous');

                    error.show();

                    $('#spandanger').html('please Configure Bid parameters..')

                    error.fadeOut(3000)

                    return false;

                }


            }).hide();



            //unblock code

        }

    };

}();


sessionStorage.setItem('CurrentrfiID', 0)
sessionStorage.setItem('CurrentRFQParameterId', 0)

function mapQuestion(RFQParameterId, RFQId, mskNo, mskNowithTax, quantity, version) {
    //alert(version)
    saveQuotationWithoutBoq('N');
    $("#hddnBoqParamQuantity").val(0);
    $("#hddnBoqParamQuantity").val(quantity);
    sessionStorage.setItem('selectedboqtxtboxid', mskNo)
    sessionStorage.setItem('selectedboqtxtboxidTax', mskNowithTax)
    $('#texttblid').val(mskNo);
    $('#texttblidTax').val(mskNowithTax);
    $('#txtRFQParameterId').val(RFQParameterId);
    $('#txtRFQId').val(RFQId);
    fncheckLastBoqQuotes(version, RFQParameterId)
   

}
function fncheckLastBoqQuotes(ver, BoqPID) {
    
    //alert(BoqPID)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQParameterlastquotes/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver + "&Flag=BOQ" + "&BoqParentID=" + BoqPID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                fetchRFIParameterComponent(ver, BoqPID);
            }
            else {
                fetchRFIParameterComponent(ver - 1, BoqPID);
            }


        },
        error: function (result) {
            alert("error");

        }
    });
}

function fetchRFIParameterComponent(version, BoqPID) {
    
    
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFIParameterComponent/?RFQId=" + sessionStorage.getItem("CurrentrfiID") + "&BOQparentId=" + BoqPID + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + version,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblRFQParameterComponet").empty();
            $('#scrolr').show();
           
            if (data.length > 0) {
                    jQuery("#tblRFQParameterComponet").append("<thead><tr style='background: gray; color: #FFF;'><th>Short Name</th><th>Quoted Price (Unit Rate - Ex. Taxes)</th><th>Quoted Price(Unit Rate - Incl.Taxes)</th><th>Quantity</th><th>UOM</th><th class=hidden>Remark</th></tr></thead>");
                    for (var i = 0; i < data.length; i++) {
                    jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td>' + data[i].RFQShortName + '</td><td><input type="text"  id="mks1' + i + '" class="form-control input-circle text-right" value="' + thousands_separators(data[i].RFQVendorPrice) + '"  autocomplete=off onkeyup=thousands_separators_input(this) /></td><td><input type="text"  id="mkswithtax1' + i + '" class="form-control input-circle text-right" value="' + thousands_separators(data[i].RFQVendorPricewithTax) + '"  autocomplete=off onkeyup=thousands_separators_input(this) /></td><td class=text-right>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td class=hidden>' + data[i].RFQRemark + '</td><td class=hidden>' + data[i].RFQDescription + '</td><td class=hidden >' + data[i].RFQBoq + '</td><td class=hidden>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class=hidden>' + data[i].status + '</td></tr>').appendTo("#tblRFQParameterComponet");
                }
            }
            else {
               
               jQuery("#tblRFQParameterComponet").append('<tr><td>No Information is there..</td></tr>');
            }
        },
        error: function (result) {
            alert("error");

        }
    });
}
function fetchReguestforQuotationDetails() {
    
    var attachment = '';
    var termattach  ='';
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQDetails/?VendorID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {
	            
	if(RFQData.length > 0){
	    attachment = RFQData[0].RFQAttachment.replace(/\s/g, "%20")
	    termattach = RFQData[0].RFQTermandCondition.replace(/\s/g, "%20")
		}else{
		attachment = attachment ;
		termattach =termattach ;
        }	
            sessionStorage.setItem('CurrentrfiID', RFQData[0].RFQId)
            jQuery('#RFQSubject').html(RFQData[0].RFQSubject)
            
            sessionStorage.setItem('hdnFromUserId', RFQData[0].RFQConfiguredBy)
            $('#Currency').html(RFQData[0].CurrencyNm)
            jQuery('#RFQDescription').html(RFQData[0].RFQDescription)
            jQuery('#RFQDeadline').html(RFQData[0].RFQDeadline)
            jQuery('#ConversionRate').html(RFQData[0].RFQConversionRate)
            $('#TermCondition').attr('href','PortalDocs/RFQ/'+ sessionStorage.getItem('hddnRFQID')+'/'+ termattach +'').html(RFQData[0].RFQTermandCondition)
            $('#Attachment').attr('href', 'PortalDocs/RFQ/'+ sessionStorage.getItem('hddnRFQID')+'/'+ attachment+'').html(RFQData[0].RFQAttachment)
            
           
                     
        }
    });

}


function fetchRFQParameterlastquotesonload(ver) {
    
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQParameterlastquotes/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver + "&Flag=NOTBOQ" + "&BoqParentID=" + 0,
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
        error: function (result) {
            alert("error");

        }
    });
}

function fetchRFIParameteronload(ver) {
    var attachment = '';
    var vendorAttachment = '';
    var replaced = '';
  
   
  
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQParameter/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblServicesProduct").empty();
            $('#divdomestic').show();
            var description = "";
            
            if (data.length > 0) {
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th>Short Name</th><th>Attachment</th><th>Quoted Price<br/>(Unit Rate-Ex.Taxes)</th><th>Quoted Price<br/>(Unit Rate-Incl.Taxes)</th><th>Qty</th><th>UOM</th><th>Response Attachment</th><th>TAT</th><th>Delivery Location</th><th class='hidden'>Status</th><th class='hidden'>Description</th></tr></thead>");
              
                $('#txtvendorremarks').val(data[0].VendorRemarks);

                for (var i = 0; i < data.length; i++) {
                     vendorAttachment = data[i].VendorAttachment.replace(/\s/g, "%20");
                    attachment = data[i].AttachmentFile.replace(/\s/g, "%20");
                    description = stringDivider(data[i].RFQDescription, 40, "<br/>\n");
                    var detailsdesc = (data[i].RFQDescription).replace(/(\r\n|\n|\r)/gm, "");
                    detailsdesc = detailsdesc.replace(/'/g, '');
                    if (data[i].BOQparentId == 0) {
                        if (data[i].status == 'Yes') {
                            if (data[i].RFQVendorPrice > 0) {
                                jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td><button type="button" class="btn default btn-xs green-haze-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].RFQParameterId + '\',\'' + sessionStorage.getItem("CurrentrfiID") + '\',\'mks' + i + '\',\'mkswithtax' + i + '\',\'' + data[i].RFQuantity + '\',\'' + ver + '\')">BOQ/BOM </button></td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].RFQShortName + '</a></td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '>' + data[i].AttachmentFile + '</a></td><td><input type="text" readonly="true" id="mks' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].RFQVendorPrice) + '"  autocomplete=off /></td><td><input type="text" readonly="true" id="mkswithtax' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].RFQVendorPricewithTax) + '"  autocomplete=off /></td><td>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td><span class="btn blue-madison fileinput-button"><input type="file" id=file' + i + ' class="fileUpload" name="response-file"/></span><a id=filepthattach' + i + ' href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + vendorAttachment + ' style="float:left;margin-top: 5px;">' + data[i].VendorAttachment + '</a><span class="display-none" style="float:left;margin-top:0px;cursor:pointer;margin-left: 3px;" id=rmoveAttachment' + i + ' onclick=ajaxFileDelete(\'rmoveAttachment' + i + '\',\'file' + i + '\',\'filepthattach' + i + '\',\'' + data[i].RFQParameterId + '\')><i class="fa fa-times-circle-o" id="i1"></i></span></td><td class=fit>' + data[i].TAT + '</td><td class=hidden >' + data[i].RFQBoq + '</td><td>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class="hidden">' + data[i].status + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].RFQRemark + '</td></tr>').appendTo("#tblServicesProduct");

                            }
                            else {

                                jQuery('<tr id=trid' + i + ' ><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td><button type="button"  class="btn default btn-xs red-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].RFQParameterId + '\',\'' + sessionStorage.getItem("CurrentrfiID") + '\',\'mks' + i + '\',\'mkswithtax' + i + '\',\'' + data[i].RFQuantity + '\',\'' + ver + '\')">BOQ/BOM</button></td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].RFQShortName + '</a></td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '>' + data[i].AttachmentFile + '</a></td><td><input type="text" readonly="true" id="mks' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].RFQVendorPrice) + '"  autocomplete=off /></td><td><input type="text" readonly="true" id="mkswithtax' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].RFQVendorPricewithTax) + '"  autocomplete=off /></td><td>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td><span class="btn blue-madison fileinput-button"><input type="file" id=file' + i + ' class="fileUpload" name="response-file"/></span><a id=filepthattach' + i + ' href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + vendorAttachment + ' style="float:left;margin-top: 5px;">' + data[i].VendorAttachment + '</a><span class="display-none" style="float:left;margin-top:0px;cursor:pointer;margin-left: 3px;" id=rmoveAttachment' + i + ' onclick=ajaxFileDelete(\'rmoveAttachment' + i + '\',\'file' + i + '\',\'filepthattach' + i + '\',\'' + data[i].RFQParameterId + '\')><i class="fa fa-times-circle-o" id="i1"></i></span></td><td class=fit>' + data[i].TAT + '</td><td class=hidden >' + data[i].RFQBoq + '</td><td>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class="hidden">' + data[i].status + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].RFQRemark + '</td></tr>').appendTo("#tblServicesProduct");

                            }
                            
                        }
                        else {
                            // For Non BOQ Items
                            jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td>&nbsp;</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].RFQShortName + '</a></td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '>' + data[i].AttachmentFile + '</a></td><td><input type="text"  id="mks' + i + '" class="form-control input-circle text-right" value="' + thousands_separators(data[i].RFQVendorPrice) + '"  autocomplete=off onkeyup=thousands_separators_input(this) /></td><td><input type="text" id="mkswihtax' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].RFQVendorPricewithTax) + '"  autocomplete=off onkeyup=thousands_separators_input(this) /></td><td>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td><span class="btn blue-madison fileinput-button"><input type="file" class="fileUpload" name="response-file" id=file' + i + ' /></span><a id=filepthattach' + i + ' href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + vendorAttachment + ' style="float:left;margin-top: 5px;">' + data[i].VendorAttachment + '</a><span class="display-none" style="float:left;margin-top:0px;cursor:pointer;margin-left: 3px;" id=rmoveAttachment' + i + ' onclick=ajaxFileDelete(\'rmoveAttachment' + i + '\',\'file' + i + '\',\'filepthattach' + i + '\',\'' + data[i].RFQParameterId + '\')><i class="fa fa-times-circle-o" id="i1"></i></span></td><td class=fit>' + data[i].TAT + '</td><td class=hidden >' + data[i].RFQBoq + '</td><td>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class="hidden">' + data[i].status + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].RFQRemark + '</td></tr>').appendTo("#tblServicesProduct");
                        }


                        //Display of close button for attachment Removal
                        if (data[i].VendorAttachment != '') {
                            $('#file' + i).attr('disabled', true);
                            $('#rmoveAttachment' + i).removeClass('display-none');
                        }
                    }
                    else {
                        jQuery('<tr id=trid' + i + '  class=hide ><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td>&nbsp;</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].RFQShortName + '</a></td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '>' + data[i].AttachmentFile + '</a></td><td><input type="text"  id="mks' + i + '" class="form-control input-circle text-right" value="' + thousands_separators(data[i].RFQVendorPrice) + '"  autocomplete=off onkeyup=thousands_separators_input(this) /></td><td><input type="text" id="mkswihtax' + i + '" class="form-control input-circle pricebox text-right" value="' + thousands_separators(data[i].RFQVendorPricewithTax) + '"  autocomplete=off onkeyup=thousands_separators_input(this) /></td><td>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td><span class="btn blue-madison fileinput-button"><input type="file" class="fileUpload" name="response-file" id=file' + i + ' /></span><a id=filepthattach' + i + ' href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + vendorAttachment + ' style="float:left;margin-top: 5px;">' + data[i].VendorAttachment + '</a><span class="display-none" style="float:left;margin-top:0px;cursor:pointer;margin-left: 3px;" id=rmoveAttachment' + i + ' onclick=ajaxFileDelete(\'rmoveAttachment' + i + '\',\'file' + i + '\',\'filepthattach' + i + '\',\'' + data[i].RFQParameterId + '\')><i class="fa fa-times-circle-o" id="i1"></i></span></td><td class=fit>' + data[i].TAT + '</td><td class=hidden >' + '' + '</td><td>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class="hidden">' + data[i].status + '</td><td class="hidden">' + '' + '</td><td class="hidden">' + '' + '</td></tr>').appendTo("#tblServicesProduct");
                    }

                }// End For loop
               
            }
            
            
        },
        error: function (result) {
            alert("error");

        }
    });
}

function showDetailedDescription(descText) {
    //alert(descText)
    $("#paraItemDescription").html(descText);
}


function stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
        var p = width
        for (; p > 0 && str[p] != ' '; p--) {
        }
        if (p > 0) {
            var left = str.substring(0, p);
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}

function RFQparameterinsert() {
    var _cleanString = StringEncodingMechanism($('#txtvendorremarks').val());
  
    var PriceDetails = '';
    var AttachementFileName = '';

    $("#tblServicesProduct > tbody > tr").each(function () {
       
        var this_row = $(this);
        if (this_row.find('td:eq(9) a').html() != '' && this_row.find('td:eq(9) input[type="file"]').val() == '') {
            AttachementFileName = jQuery.trim(this_row.find('td:eq(9) a').html());
        } else {
            AttachementFileName = this_row.find('td:eq(9) input[type="file"]').val().substring(this_row.find('td:eq(9) input[type="file"]').val().lastIndexOf('\\') + 1);
        }
        AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
        
       
        var description = $.trim((this_row.find('td:eq(16)').html()).replace(/'/g, " "));// Description is at no 16 col
        var rfqremark = $.trim((this_row.find('td:eq(17)').html()).replace(/'/g, " "));
           

          
            //Insert into RFQVendor                             (VendorID)                   ,          RFQParameterId,                       ,             RFQId                               ,       RFQShortName                               ,            RFQVendorPrice                                        ,                                         RFQVendorPricewithTax                                ,                                   RFQuantity                                ,                             RFQUomId                             , RFQRemark , RFQDescription                        ,             RFQBoq                               ,  RFQDelivery,BOQparentId,SeqNo,VendorAttachment
        PriceDetails = PriceDetails + " select " + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.find('td:eq(0)').html()) + "," + $.trim(this_row.find('td:eq(1)').html()) + " ,'" + $.trim(this_row.find('td:eq(3)').text()) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(5) input[type="text"]').val())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(6) input[type="text"]').val())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(7)').html())) + ",'" + $.trim(this_row.find('td:eq(8)').html()) + "','" + rfqremark + "','" + $.trim(description) + "','" + $.trim(this_row.find('td:eq(11)').html()) + "','" + $.trim(this_row.find('td:eq(12)').html()) + "'," + $.trim(this_row.find('td:eq(13)').html()) + "," + $.trim(this_row.find('td:eq(14)').html()) + ",'" + AttachementFileName + "'," + sessionStorage.getItem('RFQVersionId') + ",'R' union all ";
           
            fileUploader(sessionStorage.getItem('hddnRFQID'), sessionStorage.getItem('VendorId'),this_row.find('td:eq(9) input[type="file"]').attr('id'))
            
        });
    
        
    if (PriceDetails != '') {
        PriceDetails = 'Insert into RFQVendor (VendorID,RFQParameterId,RFQId,RFQShortName,RFQVendorPrice,RFQVendorPricewithTax,RFQuantity,RFQUomId,RFQRemark,RFQDescription,RFQBoq,RFQDelivery,BOQparentId,SeqNo,VendorAttachment,Version,FinalStatus) ' + PriceDetails
        PriceDetails = PriceDetails.substring(0, PriceDetails.length - 11);

            var Tab2data = {
                "PriceDetails": PriceDetails,
                "RFQID": sessionStorage.getItem('CurrentrfiID'),
                "VendorId": sessionStorage.getItem('VendorId'),
                "RFQVersionId": sessionStorage.getItem('RFQVersionId'),
                //"VendorRemarks": $('#txtvendorremarks').val()
                "VendorRemarks": _cleanString

            };
            //alert(JSON.stringify(Tab2data))
            jQuery.ajax({

                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RFQQuotedPriceinsert/",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                crossDomain: true,
                async: false,
                data: JSON.stringify(Tab2data),
                dataType: "json",
                success: function (data) {
               
                    if (data[0].RFQID > 0) {
                       
                        bootbox.alert("The information entered are saved and can be accessed later using same id and password.<br/> Please make sure to submit information before deadline.", function () {
                        window.location = sessionStorage.getItem('MainUrl');

                        return false;
                    });



                    }
                    else {
                        return false;

                    }

                }

            });


        }
        else {
            $('#spanerrordomestic').html('Please Fill Price For All RFQ Parameter.!')
            $('#divalerterrordomestic').show();
            $('#divalerterrordomestic').fadeOut(5000);
            return false
        }
}

function fileUploader(RFQID, VendorId, FileInputID) {

    var fileTerms = $('#'+FileInputID);
    
    if (fileTerms.val() != '') { 
    var fileDataTerms = fileTerms.prop("files")[0];


    var fileDataAnyOther = '';



    var formData = new window.FormData();

    formData.append("fileTerms", fileDataTerms);
    formData.append("fileAnyOther", fileDataAnyOther);
    formData.append("AttachmentFor", 'RFQ');
    formData.append("BidID", RFQID);
    formData.append("VendorID", VendorId);


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

           

        }

    });
}

}



function RFQparameterinsertforsubmit() {
    var _cleanString2 = StringEncodingMechanism($('#txtvendorremarks').val());
   
    var PriceDetails = '';
    var AttachementFileName = '';
  
    $("#tblServicesProduct > tbody > tr").each(function () {
        
        
        var this_row = $(this);
        if ((this_row.find('td:eq(9) a').html() != '') && (this_row.find('td:eq(9) input[type="file"]').val() == '')) {
            AttachementFileName = jQuery.trim(this_row.find('td:eq(9) a').html());
        } else {
            AttachementFileName = this_row.find('td:eq(9) input[type="file"]').val().substring(this_row.find('td:eq(9) input[type="file"]').val().lastIndexOf('\\') + 1);
        }
        AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
       
        var description = $.trim((this_row.find('td:eq(16)').html()).replace(/'/g, " "));// Description is at no 16 col
        description= description.replace(/'/g, "''");
        var rfqremark = $.trim((this_row.find('td:eq(17)').html()).replace(/'/g, "''"));
           
        PriceDetails = PriceDetails + " select " + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.find('td:eq(0)').html()) + "," + $.trim(this_row.find('td:eq(1)').html()) + " ,'" + $.trim(this_row.find('td:eq(3)').text().replace(/'/g, "''")) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(5) input[type="text"]').val())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(6) input[type="text"]').val())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(7)').html())) + ",'" + $.trim(this_row.find('td:eq(8)').html()) + "','" + rfqremark + "','" + description + "','" + $.trim(this_row.find('td:eq(11)').html()) + "','" + $.trim(this_row.find('td:eq(12)').html()) + "'," + $.trim(this_row.find('td:eq(13)').html()) + "," + $.trim(this_row.find('td:eq(14)').html()) + ",'" + AttachementFileName + "'," + sessionStorage.getItem('RFQVersionId') + ",'C' union all ";
       
        fileUploader(sessionStorage.getItem('hddnRFQID'), sessionStorage.getItem('VendorId'),this_row.find('td:eq(9) input[type="file"]').attr('id'))
        
    });


    if (PriceDetails != '') {
        PriceDetails = 'Insert into RFQVendor(VendorID,RFQParameterId,RFQId,RFQShortName,RFQVendorPrice,RFQVendorPricewithTax,RFQuantity,RFQUomId,RFQRemark,RFQDescription,RFQBoq,RFQDelivery,BOQparentId,SeqNo,VendorAttachment,Version,FinalStatus) ' + PriceDetails
        PriceDetails = PriceDetails.substring(0, PriceDetails.length - 11);

        var Tab2data = {
            "PriceDetails": PriceDetails,
            "RFQID": sessionStorage.getItem('CurrentrfiID'),
            "VendorId": sessionStorage.getItem('VendorId'),
            "FromUserId": sessionStorage.getItem('hdnFromUserId'),
            "UserName": sessionStorage.getItem('UserName'),
            "UserEmail": sessionStorage.getItem('EmailID'),
            "CustomerID": sessionStorage.getItem('CustomerID'),
            "RFQVersionId": sessionStorage.getItem('RFQVersionId'),
            //"VendorRemarks": $('#txtvendorremarks').val()
            "VendorRemarks": _cleanString2
        };
       // alert(JSON.stringify(Tab2data))
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RFQQuotedPriceinsertforsubmit/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {
               
                if (data[0].RFQID > 0) {
                    
                    bootbox.alert("RFQ response submitted and forwarded to company.", function () {
                       
                        window.location = 'VendorHome.html';

                        return false;
                    });
                    return true;
                }
                else {
                    return false;

                }

            }

        });
        
    }
    else {
        $('#spanerrordomestic').html('Please Fill Price For All RFQ Parameter.!')
        $('#divalerterrordomestic').show();
        $('#divalerterrordomestic').fadeOut(5000);
        return false
    }



}
var Price = 0;
var PriceTax = 0;
function RFQparametercomponetinsert() {
    var _cleanString3 = StringEncodingMechanism($('#txtvendorremarks').val());
   
    $('#loader-msg').html('Processing. Please Wait...!');
    $('.progress-form').show();
    PriceDetails = '';
  
    var rowCount = jQuery('#tblRFQParameterComponet  tr').length;
   
    if (rowCount > 1) {
        PriceDetails = PriceDetails + 'Insert into RFQVendor (VendorID,RFQParameterId,RFQId,RFQShortName,RFQVendorPrice,RFQVendorPricewithTax,RFQuantity,RFQUomId,RFQRemark,RFQDescription,RFQBoq,RFQDelivery,BOQparentId,SeqNo,Flag,Version) '
        $("#tblRFQParameterComponet tr:gt(0)").each(function () {
            var this_row = $(this);


            Price = Price + parseFloat(removeThousandSeperator(this_row.find('td:eq(3) input[type="text"]').val()) * removeThousandSeperator($.trim(this_row.find('td:eq(5)').html())));
            PriceTax = PriceTax + parseFloat(removeThousandSeperator(this_row.find('td:eq(4) input[type="text"]').val()) * removeThousandSeperator($.trim(this_row.find('td:eq(5)').html())));

            PriceDetails = PriceDetails + " select " + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.find('td:eq(0)').html()) + "," + $.trim(this_row.find('td:eq(1)').html()) + " ,'" + $.trim(this_row.find('td:eq(2)').html()) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(3) input[type="text"]').val())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(4) input[type="text"]').val())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(5)').html())) + ",'" + $.trim(this_row.find('td:eq(6)').html()) + "','" + $.trim(this_row.find('td:eq(7)').html()) + "','" + $.trim(this_row.find('td:eq(8)').html()) + "','" + $.trim(this_row.find('td:eq(9)').html()) + "','" + $.trim(this_row.find('td:eq(10)').html()) + "'," + $.trim(this_row.find('td:eq(11)').html()) + "," + $.trim(this_row.find('td:eq(12)').html()) + ",'Y'," + sessionStorage.getItem('RFQVersionId') + " union all ";


        });
        PriceDetails = PriceDetails.substring(0, PriceDetails.length - 11);


        
        var Tab2data = {
            "PriceDetail": PriceDetails,
            "RFQID": sessionStorage.getItem('CurrentrfiID'),
            "VendorId": sessionStorage.getItem('VendorId'),
            "BOQparentId": $('#txtRFQParameterId').val(),
            "Price": Price,
            "RFQVendorPricewithTax": PriceTax,
            "RFQVersionId": sessionStorage.getItem('RFQVersionId'),
            //"VendorRemarks": $('#txtvendorremarks').val()
            "VendorRemarks": _cleanString3

        };
        // alert(JSON.stringify(Tab2data))
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RFQQuotedComponentPriceinsert/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {

                if (data[0].RFQID > 0) {

                    $("#" + $('#texttblid').val()).val(Price);
                    $("#" + $('#texttblidTax').val()).val(PriceTax);

                    fetchRFIParameteronload(sessionStorage.getItem('RFQVersionId'));
                    Price = 0;
                    PriceTax = 0;
                    $('#responsive').modal('hide');


                }


            }

        });
    }
   
    $('.progress-form').hide()
}


setTimeout(function () {sessionStorage.removeItem('selectedboqtxtboxid') }, 5000);
sessionStorage.removeItem('selectedboqtxtboxidTax');
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function ajaxFileDelete(closebtnid, fileid, filepath, itemID) {
    jQuery(document).ajaxStart(jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" /> Please Wait...</h5>' })).ajaxStop(jQuery.unblockUI);
    var theLinkdiv = document.getElementById(filepath)
    var path = theLinkdiv.getAttribute("href").replace(/%20/g, " ");
    
    var formData = new window.FormData();
    formData.append("Path", path);
    
    $.ajax({

        url: 'ConfigureFileAttachment.ashx',

        data: formData,

        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function(data) {

        fileDeletefromdbForItem(closebtnid, fileid, filepath, itemID);
        
        },

        error: function() {

            bootbox.alert("Attachment error.");

        }

    });

    jQuery.unblockUI();

}


//File Delete Vendor Response 
function fileDeletefromdbForItem(closebtnid, fileid, filepath, itemID) {

    $('#' + closebtnid).remove();
    $('#' + filepath).html('')
    $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
    $('#' + fileid).attr('disabled', false);
    var BidData = {

        "BidId": 0,
        "BidTypeID": 0,
        "UserId": sessionStorage.getItem('VendorId'),
        "RFQRFIID": sessionStorage.getItem('hddnRFQID'),
        "RFIRFQType": 'vendorResponse',
        "RFQParameterID": itemID
    }

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FileDeletionRFQParameter/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function(data) {
            if (data[0].IsSuccess == '1') {
                $('#spansuccattachment').html('File Deleted Successfully');
                $("#divsuccattachment").show();
                Metronic.scrollTo(success, -200);
                $("#divsuccattachment").fadeOut(5000);
            }
        }

    });
}


function saveQuotationWithoutBoq(isButtonclick) {
    var _cleanString4 = StringEncodingMechanism($('#txtvendorremarks').val());
    //btnSave  Button ID
 
    var PriceDetails = '';
    var AttachementFileName = '';
   

    $("#tblServicesProduct > tbody > tr").each(function() {

        var this_row = $(this);
        if (this_row.find('td:eq(9) a').html() != '' && this_row.find('td:eq(9) input[type="file"]').val() == '')
        {
            AttachementFileName = jQuery.trim(this_row.find('td:eq(9) a').html());
        }
        else {
            AttachementFileName = this_row.find('td:eq(9) input[type="file"]').val().substring(this_row.find('td:eq(9) input[type="file"]').val().lastIndexOf('\\') + 1);
        }

        AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
       
       var description= $.trim((this_row.find('td:eq(16)').html()).replace(/\n|\r\n|\r/g, '<br/>'));// Description is at no 16 col
        description = description.replace(/'/g, "''");
        var rfqremark = $.trim((this_row.find('td:eq(17)').html()).replace(/'/g, "''"));
       
            //Insert into RFQVendor                             (VendorID)                   ,          RFQParameterId,                       ,             RFQId                               ,       RFQShortName                               ,            RFQVendorPrice                                        ,                                     RFQVendorPricewithTax                                ,               RFQuantity                                ,                                   RFQUomId                             ,      RFQRemark      ,            RFQDescription                        ,             RFQBoq                               ,  RFQDelivery,BOQparentId,SeqNo,VendorAttachment
        PriceDetails = PriceDetails + " select " + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.find('td:eq(0)').html()) + "," + $.trim(this_row.find('td:eq(1)').html()) + " ,'" + $.trim(this_row.find('td:eq(3)').text().replace(/'/g, "''")) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(5) input[type="text"]').val())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(6) input[type="text"]').val())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(7)').html())) + ",'" + $.trim(this_row.find('td:eq(8)').html()) + "','" + rfqremark + "','" + $.trim(description) + "','" + $.trim(this_row.find('td:eq(11)').html()) + "','" + $.trim(this_row.find('td:eq(12)').html()) + "'," + $.trim(this_row.find('td:eq(13)').html()) + "," + $.trim(this_row.find('td:eq(14)').html()) + ",'" + AttachementFileName + "'," + sessionStorage.getItem('RFQVersionId') + ",'N' union all ";
       
        fileUploader(sessionStorage.getItem('hddnRFQID'), sessionStorage.getItem('VendorId'), this_row.find('td:eq(9) input[type="file"]').attr('id'))

        });
       
   // alert(PriceDetails)
    if (PriceDetails != '') {
        PriceDetails = 'Insert into RFQVendor (VendorID,RFQParameterId,RFQId,RFQShortName,RFQVendorPrice,RFQVendorPricewithTax,RFQuantity,RFQUomId,RFQRemark,RFQDescription,RFQBoq,RFQDelivery,BOQparentId,SeqNo,VendorAttachment,Version,FinalStatus) ' + PriceDetails
        PriceDetails = PriceDetails.substring(0, PriceDetails.length - 11);
        console.log(PriceDetails)
        var Tab2data = {
            "PriceDetails": PriceDetails,
            "RFQID": sessionStorage.getItem('CurrentrfiID'),
            "VendorId": sessionStorage.getItem('VendorId'),
            "RFQVersionId": sessionStorage.getItem('RFQVersionId'),
            //"VendorRemarks": $('#txtvendorremarks').val()
            "VendorRemarks": _cleanString4


        };
       // alert(PriceDetails)
      
    // alert(JSON.stringify(Tab2data))
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RFQQuotedPriceSave/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {
               
                setTimeout(function () {
                    if (data[0].RFQID != 0) {
                        fetchRFIParameteronload(sessionStorage.getItem('RFQVersionId'));
                        if (isButtonclick == "Y") {
                            bootbox.alert("RFQ saved successfully.", function () {
                               
                                window.location = 'VendorHome.html';

                                return false;
                            });
                        }
                    }
                    return true;
                },500)
               
                if (data[0].RFQID == 0) {
                    bootbox.alert("Eror connecting server. Please try later.");
                }
              }
        });
    }
    else {
        $('#spanerrordomestic').html('Please Fill Price For All RFQ Parameter.!')
        $('#divalerterrordomestic').show();
        $('#divalerterrordomestic').fadeOut(5000);
        return false
    }    

}