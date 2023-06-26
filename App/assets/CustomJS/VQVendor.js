var error = $('.alert-danger');
jQuery(document).ready(function () {
    Pageloaded()
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if ((sessionStorage.getItem("UserType") == "V") || (sessionStorage.getItem("UserType") == "P")) {
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

    $('#dropbidType').select2({
        placeholder: "Select Bid Type",
        allowClear: true
    });
    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);
    var _VQID = getUrlVarsURL(decryptedstring)["VQID"];

    if (_VQID == null) {
        sessionStorage.setItem('CurrentVQID', 0)

    }

    else {
        sessionStorage.setItem('CurrentVQID', _VQID)
        fetchRFIDetails();
        RFIFetchCompanyHeader('CompanyInfo')
        RFIFetchFinanceHeader();
        fetchQuestionsForVendors('CompanyInfo')
        fetchQuestionsForVendors('FinancialInfo');
        fetchQuestionsForVendors('CompanyCapabilities');
        fetchQuestionsForVendors('TechnicalInfo');

    }
    FormWizard.init();
    ComponentsPickers.init();
    setCommonData();

    Filltblfinancedetails();


    $("#ddlCategoryMultiple").select2();
});
jQuery('#btnpush').click(function (e) {
    jQuery('#approverList > option:selected').appendTo('#mapedapprover');
});
jQuery('#btnpull').click(function (e) {
    jQuery('#mapedapprover > option:selected').appendTo('#mapedapprover');
});

//get file path from client system
function getNameFromPath(strFilepath) {
    // alert(strFilepath);
    var objRE = new RegExp(/([^\/\\]+)$/);
    var strName = objRE.exec(strFilepath);

    if (strName == null) {
        return null;
    }
    else {
        return strName[0];
    }

}
var success = $('.alert-success');
var _noAttachment = false;
$(".preview_div").hide();
var form = $('#submit_form');
var FormWizard = function() {

    return {

        init: function() {

            if (!jQuery().bootstrapWizard) {

                return;

            }

            form.validate({

                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

                errorElement: 'span', //default input error message container

                errorClass: 'help-block help-block-error', // default input error message class

                focusInvalid: false, // do not focus the last invalid input

                rules: {

                    txtCompanyName: {
                        required: true
                    },
                    txtPhoneNo: {
                        required: true,
                        number: true
                    },
                    ddlTitle: {
                        required: true
                    },
                    txtContactName: {
                        required: function(element) {
                            if ($('#ddlTitle').val() != '') {
                                required: true;
                            } else {
                                required: false;
                            }
                        }
                    },

                    txtcontactNo: {
                        required: true,
                        number: true
                    },
                   
                    txtemailID: {
                        required: true,
                        email: true
                    },
                    txtofficeAddress: {
                        required: true
                    },
                    ddlOwnership: {
                        required: true
                    },
                    txtemployeeNum: {
                        required: true,
                        number: true
                    },
                    chkIsAccepted: {
                        required: false
                    },
                    //Validation For Third Tab
                    ddlPubliclisted: {
                        required: true
                    },
                    file2: {
                        required: function(element) {
                            if ($('#ddlPubliclisted').val() == 'Y') {
                                required: true;
                            } else {
                                required: true;
                            }
                        }
                    },
                    file1: {
                        required: function(element) {
                            if ($('#ddlPubliclisted').val() == 'Y') {
                                required: true;
                            } else {
                                required: true;
                            }
                        }
                    },
                    txtCity: {
                        required: true
                    },
                    txtPanNo: {
                        required: true
                    },
                    txtGstNo: {
                        required: true
                    },
                    
                },
                    messages: {

            },

            errorPlacement: function(error, element) {
                if (element.attr('type') == 'checkbox') {
                    error.insertAfter('#form_tnc_error');
                } else {
                    error.insertAfter(element);
                }


            },

            invalidHandler: function(event, validator) {
                success.hide();
                $('#spandanger').text('You have some error. Please check below!')
                error.show();
                Metronic.scrollTo(error, -200);
                error.fadeOut(5000);
            },

            highlight: function(element) { // hightlight error inputs
                $(element).closest('.col-md-5').addClass('has-error'); // set error class to the control group
                $(element).closest('.col-md-4').addClass('has-error'); // set error class to the control group
                $(element).closest('.col-md-1').addClass('has-error'); // set error class to the control group
                $(element).closest('.col-md-3').addClass('has-error'); // set error class to the control group
                $(element).closest('.col-md-9').addClass('has-error'); // set error class to the control group

            },
            unhighlight: function(element) { // revert the change done by hightlight
                $(element).closest('.col-md-5').removeClass('has-error'); // set error class to the control group
                $(element).closest('.col-md-4').removeClass('has-error'); // set error class to the control group
                $(element).closest('.col-md-1').removeClass('has-error'); // set error class to the control group
                $(element).closest('.col-md-3').removeClass('has-error'); // set error class to the control group
                $(element).closest('.col-md-9').removeClass('has-error'); // set error class to the control group

            },

            success: function(label) {
                label.closest('.col-md-5').removeClass('has-error');
                label.closest('.col-md-4').removeClass('has-error');
                label.closest('.col-md-1').removeClass('has-error');
                label.closest('.col-md-3').removeClass('has-error');
                label.closest('.col-md-9').removeClass('has-error');

                label.remove();
            },
            submitHandler: function(form) {
            }
        });





        var displayConfirm = function() {

            $('#tab4 .form-control-static', form).each(function() {

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

                    $('[name="payment[]"]:checked').each(function() {

                        payment.push($(this).attr('data-title'));

                    });

                    $(this).html(payment.join("<br>"));

                }

            });

        }



        var handleTitle = function(tab, navigation, index) {

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
                $('#form_wizard_1').find('.button-next').html('Next <i class="m-icon-swapright m-icon-white"></i>');
                $('#form_wizard_1').find('.button-submit').hide();


            } else {
                $('#form_wizard_1').find('.button-submit').show();
                $('#form_wizard_1').find('.button-next').html('Save and Continue <i class="m-icon-swapright m-icon-white"></i>')
                $('#form_wizard_1').find('.button-previous').show();

            }



            if (current >= total) {
                $('#form_wizard_1').find('.button-next').hide();
                //$('#form_wizard_1').find('.button-submit').html('Submit')
                $('#form_wizard_1').find('.button-submit').removeClass('red-pink')
                $('#form_wizard_1').find('.button-submit').addClass('green')
                $('#form_wizard_1').find('.button-submit').html('Preview')
                displayConfirm();

            } else {
                $('#form_wizard_1').find('.button-submit').html('Save And Exit')
                $('#form_wizard_1').find('.button-submit').addClass('red-pink')
                $('#form_wizard_1').find('.button-submit').removeClass('green')
                $('#form_wizard_1').find('.button-next').show();

            }

            Metronic.scrollTo($('.page-title'));

        }



        // default form wizard

        $('#form_wizard_1').bootstrapWizard({

            'nextSelector': '.button-next',

            'previousSelector': '.button-previous',


            onTabClick: function(tab, navigation, index, clickedIndex) {

                return false;

            },

            onNext: function(tab, navigation, index) {

                success.hide();

                error.hide();

                if (index == 1) {
                  
                        RFIFetchCompanyHeader('CompanyInfo')
                        fetchQuestionsForVendors('CompanyInfo')
                        fetchPreCompanydetails();
                    //}

                }
                if (index == 2) {
                    if (form.valid() == false) {
                        return false;
                    } else {
                        
                        InsUpdTab1Data('Next')
                        RFIFetchFinanceHeader();
                        fetchQuestionsForVendors('FinancialInfo');
                    }
                }
                if (index == 3) {
                    if (form.valid() == false) {
                        return false;
                    } else {
                        InsUpdTab2Data('Next')
                        fetchQuestionsForVendors('CompanyCapabilities')
                    }

                }
                if (index == 4) {
                    if (form.valid() == false) {
                        return false;
                    } else {
                        InsUpdTab3Data('Next')
                        fetchQuestionsForVendors('TechnicalInfo')
                    }

                }

                handleTitle(tab, navigation, index);

            },

            onPrevious: function(tab, navigation, index) {

                success.hide();

                error.hide();
               
                handleTitle(tab, navigation, index);
                

            },

            onTabShow: function(tab, navigation, index) {

                var total = navigation.find('li').length;

                var current = index + 1;

                var $percent = (current / total) * 100;

                $('#form_wizard_1').find('.progress-bar').css({

                    width: $percent + '%'

                });

            }

        });

        $('#form_wizard_1').find('.button-previous').hide();
        $('#form_wizard_1').find('.button-submit').hide();
        $('#form_wizard_1 .button-submit').click(function() {
            if ($('#tab2').hasClass('active')) {
                if (form.valid() == false) {
                    return false;
                } else {
                    InsUpdTab1Data('SaveExit')
                }
            } else if ($('#tab3').hasClass('active')) {
                if (form.valid() == false) {
                    return false;
                } else {
                    InsUpdTab2Data('SaveExit')
                }
            } else if ($('#tab4').hasClass('active')) {
                if (form.valid() == false) {
                    return false;
                } else {
                    InsUpdTab3Data('SaveExit')
                }
            } else if ($('#tab5').hasClass('active')) {
                if (form.valid() == false) {
                    return false;
                } else {                    
                    InsUpdTab4Data()
                }
            }
        });



    }

};

} ();




function fetchRFIDetails() {
    var attachment = '', _selectedCat = new Array(), _txtCategories=[];
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VQID=" + sessionStorage.getItem('CurrentVQID') ,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            
            attachment = BidData[0].vqMaster[0].vqAttachment.replace(/\s/g, "%20")
            jQuery('#tblServicesProduct').empty();
            jQuery('#tblTempVendorslist').empty();
           
            jQuery('#txtrfiSubject').val(BidData[0].vqMaster[0].vqSubject)
            jQuery('#txtrfideadline').val(BidData[0].vqMaster[0].vqDeadline)
            jQuery('#txtrfidescription').val(BidData[0].vqMaster[0].vqDescription)

          
            jQuery('#txtrfiSubjectPrev').html(BidData[0].vqMaster[0].vqSubject)
            jQuery('#txtrfideadlinePrev').html(BidData[0].vqMaster[0].vqDeadline)
            jQuery('#txtrfidescriptionPrev').html(BidData[0].vqMaster[0].vqDescription)
            
            if (BidData[0].vqAttachment.length > 0) {
                $("#tblAttachmentsElem").empty();
                $("#tblAttachmentsElemPrev").empty();
                for (var i = 0; i < BidData[0].vqAttachment.length; i++) {
                    replaced = BidData[0].vqAttachment[i].vqAttachment.replace(/\s/g, "%20")
                    $("#tblAttachmentsElem").append('<li style="padding-top: 8px;"><div class="inputgroup">' +
                        '<label class="control-label col-md-3">Attachment</label>' +
                        '<div class="col-md-4">' +
                        '<input type="text" class="form-control" placeholder="Attachment Description" tabindex="5" name="txtattachdescription" readonly autocomplete="off" value=' + BidData[0].vqAttachment[i].vqAttachmentDescription.replace(/\s/g, "&nbsp;") + ' />' +
                        '</div>' +
                        '<div class="col-md-3">' +
                        
                        '<span class="help-block"><a id=attach-file' + (i + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + BidData[0].vqAttachment[i].vqAttachment + '</a></span>' +
                        '</div><div class="clearfix"></div>' +
                        '</div></li>'
                        );

                    $("#tblAttachmentsElemPrev").append('<li><div class="col-md-8" style=padding-left:0px;>' +
                        '<p class="form-control-static">' + BidData[0].vqAttachment[i].vqAttachmentDescription.replace(/\s/g, "&nbsp;") + '</p>' +
                        '</div>' +
                        '<div class="col-md-4">' +
                        '<span class="help-block"><a id=attach-file' + (i + 1) + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)">' + BidData[0].vqAttachment[i].vqAttachment + '</a></span>' +
                        '</div><div class="clearfix"></div>' +
                        '</li>'
                        );
                }
            }
            else {
                $("#_noAttachment").show();
            }

            if (BidData[0].vqProductCat.length > 0) {
                for (var i = 0; i < BidData[0].vqProductCat.length; i++) {
                    jQuery("#ddlCategoryMultiple").append("<option value=" + BidData[0].vqProductCat[i].categoryID + ">" + BidData[0].vqProductCat[i].categoryName + "</option>");
                    _selectedCat.push(BidData[0].vqProductCat[i].categoryID);
                    _txtCategories += BidData[0].vqProductCat[i].categoryName + ', ';
                }
                _txtCategories = _txtCategories.substring(0, _txtCategories.length - 2);
                jQuery("#productCatPrevPrev").html(_txtCategories);

                setTimeout(function () {
                    $("#ddlCategoryMultiple").select2('val', _selectedCat);
                }, 1000);
            }
           
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });

}

function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'VQ/' + sessionStorage.getItem('CurrentVQID'));
}

function fetchQuestionsForVendors(QuestionFor) {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "VQMaster/VQFetchQuestionForVendors/?GetMsz=" + QuestionFor + "&Number=" + sessionStorage.getItem('CurrentVQID') + "&VendorID=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
            
            if (data.length > 0) {
                
                
                if (data[0].getMsz == 'CompanyInfo') {
                    var attach1 = '';
                    
                    var SubcategoryID = 0;
                    jQuery("#tblcompanyInfo").empty();
                    jQuery("#tblcompanyInfoPrev").empty();
                    
                for (var i = 0; i < data.length; i++) {
                    if (data[i].attachments != '') {
                        attach1 = data[i].attachments.replace(/\s/g, "%20")
                    } else {
                        attach1 = attach1;
                    }
                    if (SubcategoryID != data[i].questionSubCategoryID) {
                        $("#tblcompanyInfo").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].questionSubCategory + '</th></tr></thead>');
                        $("#tblcompanyInfoPrev").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].questionSubCategory + '</th></tr></thead>');
                        SubcategoryID = data[i].questionSubCategoryID;
                        for (var j = 0; j < data.length; j++) {
                            if (data[i].attachments != '') {
                                attach2 = data[j].attachments.replace(/\s/g, "%20")
                            } else {
                                attach2 = attach1;
                            }
                            
                            if (SubcategoryID == data[j].questionSubCategoryID) {
                                $("#tblcompanyInfo").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                                $("#tblcompanyInfoPrev").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                        if (data[j].mandatory == "Required") {                        
                            if (data[j].attachement == "Y") {
                                $("#tblcompanyInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" id=textaraID' + j + ' placeholder="Answer" name=textaraID' + j + ' rows="3" required></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control" id=fileToUpload' + j + '  name=fileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span> <br/><span class="help-block"><a id=spnCIAttach' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;">' + data[j].attachments + '</a></span></div></td></tr>');
                                $("#tblcompanyInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=textaraIDPrev' + j + ' name=textaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration:none !important;word-break:break-all;pointer:cursor" href="javascript:;" onclick="DownloadFilevendor(this)" >' + data[j].attachments + '</a></span></div></td></tr>');
                                if (data[j].attachments != '') {
                                    $("#fileToUpload" + j).attr('required', false);
                                } else if (data[j].attachments == '') {
                                    $("#fileToUpload" + j).attr('required', true);
                                }
                            } else {
                                jQuery("#tblcompanyInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" id=textaraID' + j + ' placeholder="Answer" name=textaraID' + j + ' rows="3" required></textarea></div></td></tr>');
                                jQuery("#tblcompanyInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=textaraIDPrev' + j + ' name=textaraIDPrev' + j + '></p></div></td></tr>');
                            }
                        
                        } else {
                       
                            if (data[j].attachement == "Y") {
                                jQuery("#tblcompanyInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" id=textaraID' + j + ' placeholder="Answer" name=textaraID' + j + ' rows="3"></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control " id=fileToUpload' + j + ' name=fileToUpload' + j + ' required="required" onchange="checkfilesize(this)/"></span><br/><span class="help-block"><a id=spnCIAttach' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;">' + data[j].attachments + '</a></span></div></td></tr>');
                                jQuery("#tblcompanyInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=textaraIDPrev' + j + ' name=textaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;word-break:break-all;pointer:cursor">' + data[j].attachments + '</a></span></div></td></tr>');
                                if (data[j].attachments != '') {
                                    $("#fileToUpload" + j).attr('required', false);
                                } else if (data[j].attachments == '') {
                                    $("#fileToUpload" + j).attr('required', true);
                                }
                            } else {
                                jQuery("#tblcompanyInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" id=textaraID' + j + ' placeholder="Answer" name=textaraID' + j + ' rows="3"></textarea></div></td></tr>');
                                jQuery("#tblcompanyInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=textaraIDPrev' + j + ' name=textaraIDPrev' + j + '></p></div></td></tr>');
                            }
                        }
                        }
                            $('#textaraID' + j).val(data[j].answers)
                            $('#textaraIDPrev' + j).html(data[j].answers)
                        }
                    
                    }
                    
                    }
                
                
            }
            if (data[0].getMsz == 'FinancialInfo') {
                var attach2 = '';
                var SubcategoryID = 0;
                jQuery("#tblfinanceInfo").empty();
                jQuery("#tblfinanceInfoPrev").empty();
                
                for (var i = 0; i < data.length; i++) {
                   
                    if (SubcategoryID != data[i].questionSubCategoryID) {

                        $("#tblfinanceInfo").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].questionSubCategory + '</th></tr></thead>');
                        $("#tblfinanceInfoPrev").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].questionSubCategory + '</th></tr></thead>');
                        SubcategoryID = data[i].questionSubCategoryID;
                        for (var j = 0; j < data.length; j++) {
                            if (data[i].attachments != '') {
                                attach2 = data[j].attachments.replace(/\s/g, "%20")
                            } else {
                                attach2 = attach1;
                            }
                            if (SubcategoryID == data[j].questionSubCategoryID) {
                                $("#tblfinanceInfo").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                                $("#tblfinanceInfoPrev").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                                
                                if (data[j].mandatory == "Y") {
                                    if (data[j].attachement == "Y") {
                                        jQuery("#tblfinanceInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=FtextaraID' + j + ' name=FtextaraID' + j + ' rows="3" required></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control" id=FfileToUpload' + j + ' name=FfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a id=spnFAttach'+j+' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tblfinanceInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=FtextaraIDPrev' + j + ' name=FtextaraIDPrev' + j + '></p></div><div class="col-md-3"></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#FfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#FfileToUpload" + j).attr('required', true);
                                        }
                                    } else {
                                        jQuery("#tblfinanceInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=FtextaraID' + j + ' name=FtextaraID' + j + ' rows="3" required></textarea></div></td></tr>');
                                        jQuery("#tblfinanceInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=FtextaraIDPrev' + j + ' name=FtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }

                                } else {
                                    if (data[j].attachement == "Y") {
                                        jQuery("#tblfinanceInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=FtextaraID' + j + ' rows="3" name=FtextaraID' + j + ' ></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control " id=FfileToUpload' + j + ' name=FfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a id=spnFAttach' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tblfinanceInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=FtextaraIDPrev' + j + ' name=FtextaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#FfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#FfileToUpload" + j).attr('required', true);
                                        }
                                    } else {
                                        jQuery("#tblfinanceInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=FtextaraID' + j + ' name=FtextaraID' + j + ' ></textarea></div></td></tr>');
                                        jQuery("#tblfinanceInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=FtextaraIDPrev' + j + ' name=FtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }
                                }

                                $('#FtextaraID' + j).val(data[j].answers)
                                $('#FtextaraIDPrev' + j).html(data[j].answers)
                            }
                        }
                    }
                }
               
            }

            if (data[0].getMsz == 'CompanyCapabilities') {
                var attach3 = '';
                var SubcategoryID = 0;
                jQuery("#tblcompCapableInfo").empty();
                jQuery("#tblcompCapableInfoPrev").empty();
                for (var i = 0; i < data.length; i++) {
                        
                    if (SubcategoryID != data[i].questionSubCategoryID) {
                        $("#tblcompCapableInfo").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].questionSubCategory + '</th></tr></thead>');
                        $("#tblcompCapableInfoPrev").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].questionSubCategory + '</th></tr></thead>');
                        SubcategoryID = data[i].questionSubCategoryID;
                        for (var j = 0; j < data.length; j++) {
                            if (data[i].attachments != '') {
                                attach3 = data[j].attachments.replace(/\s/g, "%20")
                            } else {
                                attach3 = attach1;
                            }
                            if (SubcategoryID == data[j].questionSubCategoryID) {
                                $("#tblcompCapableInfo").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                                $("#tblcompCapableInfoPrev").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');


                                if (data[i].mandatory == "Y") {
                                    if (data[i].attachement == "Y") {
                                        jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=CtextaraID' + j + ' name=CtextaraID' + j + ' required></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control" id=CfileToUpload' + j + ' name=CfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a id=spnCCAttach' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach3 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tblcompCapableInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=CtextaraIDPrev' + j + ' name=CtextaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#CfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#CfileToUpload" + j).attr('required', true);
                                        }
                                    } else {
                                        jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=CtextaraID' + j + ' name=CtextaraID' + j + ' required></textarea></div></td></tr>');
                                        jQuery("#tblcompCapableInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=CtextaraIDPrev' + j + ' name=CtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }

                                } else {
                                    if (data[i].attachement == "Y") {
                                        jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=CtextaraID' + j + ' name=CtextaraID' + j + ' rows="3"></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control " id=CfileToUpload' + j + ' name=CfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a id=spnCCAttach' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach3 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tblcompCapableInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=CtextaraIDPrev' + j + ' name=CtextaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#CfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#CfileToUpload" + j).attr('required', true);
                                        }
                                    } else {
                                        jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=CtextaraID' + j + ' name=CtextaraID' + j + ' rows="3"></textarea></div></td></tr>');
                                        jQuery("#tblcompCapableInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=CtextaraIDPrev' + j + ' name=CtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }
                                }
                                $('#CtextaraID' + j).val(data[j].answers)
                                $('#CtextaraIDPrev' + j).html(data[j].answers)
                            }
                        }
                    }
                }
            }


            if (data[0].getMsz == 'TechnicalInfo') {
                var attach4 = '';
                var SubcategoryID = 0;
                jQuery("#tbltechnicalInfo").empty();
                jQuery("#tbltechnicalInfoPrev").empty();
                
                for (var i = 0; i < data.length; i++) {
                    
                    if (SubcategoryID != data[i].questionSubCategoryID) {
                        $("#tbltechnicalInfo").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].questionSubCategory + '</th></tr></thead>');
                        $("#tbltechnicalInfoPrev").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].questionSubCategory + '</th></tr></thead>');
                        SubcategoryID = data[i].questionSubCategoryID;
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].attachments != '') {
                                attach4 = data[j].attachments.replace(/\s/g, "%20")
                            } else {
                                attach4 = attach1;
                            }
                            if (SubcategoryID == data[j].questionSubCategoryID) {
                                $("#tbltechnicalInfo").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                                $("#tbltechnicalInfoPrev").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                                if (data[j].Mandatory == "Y") {
                                    if (data[j].Attachement == "Y") {
                                        jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=TtextaraID' + j + ' name=TtextaraID' + j + ' required></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control" id=TfileToUpload' + j + ' name=TfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a id=spnTIAttach' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach4 + '" style="text-decoration: none !important;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tbltechnicalInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=TtextaraIDPrev' + j + ' name=TtextaraIDPrev' + j + '></p></div><div class="col-md-3"></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#TfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#TfileToUpload" + j).attr('required', true);
                                        }
                                    } else {
                                        jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=TtextaraID' + j + ' name=TtextaraID' + j + ' rows="3" required></textarea></div></td></tr>');
                                        jQuery("#tbltechnicalInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=TtextaraIDPrev' + j + ' name=TtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }

                                } else {
                                    if (data[j].attachement == "Y") {
                                        jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=TtextaraID' + j + ' name=TtextaraID' + j + ' rows="3"></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control " id=TfileToUpload' + j + ' name=fileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a id=spnTIAttach' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach4 + '" style="text-decoration: none !important;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tbltechnicalInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=TtextaraIDPrev' + j + ' name=TtextaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#TfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#TfileToUpload" + j).attr('required', true);
                                        }
                                    } else {
                                        jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=TtextaraID' + j + ' name=TtextaraID' + j + ' rows="3"></textarea></div></td></tr>');
                                        jQuery("#tbltechnicalInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=TtextaraIDPrev' + j + ' name=TtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }
                                }
                                $('#TtextaraID' + j).val(data[j].answers)
                                $('#TtextaraIDPrev' + j).html($('#TtextaraID' + j).val());
                            }
                        }
                    }
                    }
            }
        }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
}

function DownloadFilevendor(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'VQ/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId'));
}

function RFIFetchCompanyHeader(QuestionFor) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "VQMaster/VQFetchCompanyInfo_VR/?IsSuccess=" + QuestionFor + "&ID=" + sessionStorage.getItem('CurrentVQID') + "&VendorId=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
            
           
            if (data.length > 0) {
                //alert(data[0].CompanyPhone)
                            $('#txtCompanyName').val(data[0].companyName);
                            $('#txtPhoneNo').val(data[0].companyPhone);
                            $('#txtofficeAddress').val(data[0].officedAddress);
                            $('#txtfactoryAddress').val(data[0].factoryAdress);
                            $('#txtemailID').val(data[0].companyEmail);
                            $('#txtParentcompName').val(data[0].parentCompany);
                            $('#txtFaxNo').val(data[0].faxNumber);
                            $('#txtWebsite').val(data[0].companyWebsite);
                            $('#ddlOwnership').val(data[0].ownership);
                            $('#txtemployeeNum').val(data[0].employeeCount);
                            $('#txtbriefDesc').val(data[0].keyProjects);
                            $('#ddlTitle').val(data[0].title);
                            $('#txtContactName').val(data[0].keyPersonName);
                            $('#txtcontactNo').val(data[0].keyPersonNo);
                         
                            $('#txtCity').val(data[0].city);
                            $('#txtPanNo').val(data[0].panNo);
                            $('#txtGstNo').val(data[0].serviceTaxNo);
                           

                            $('#txtCompanyNamePrev').html(data[0].companyName);
                            $('#txtPhoneNoPrev').html(data[0].companyPhone);
                            $('#txtofficeAddressPrev').html(data[0].OfficedAddress);
                            $('#txtfactoryAddressPrev').html(data[0].factoryAdress);
                            $('#txtemailIDPrev').html(data[0].companyEmail);
                            $('#txtParentcompNamePrev').html(data[0].ParentCompany);
                            $('#txtFaxNoPrev').html(data[0].faxNumber);
                            $('#txtWebsitePrev').html(data[0].companyWebsite);
                            $('#ddlOwnershipPrev').html(data[0].ownership);
                            $('#txtemployeeNumPrev').html(data[0].employeeCount);
                            $('#txtbriefDescPrev').html(data[0].keyProjects);
                            $('#ddlTitlePrev').html(data[0].title);
                            $('#txtContactNamePrev').html(data[0].keyPersonName);
                            $('#txtcontactNoPrev').html(data[0].keyPersonNo);
                          
                            $('#txtCityPrev').html(data[0].city);
                            $('#txtPanNoPrev').html(data[0].panNo);
                            $('#txtGstNoPrev').html(data[0].serviceTaxNo);
                          
                  

            }
            
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();
}

function RFIFetchFinanceHeader() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/VQFetchFinanceInfo_VR/?RFIID=" + sessionStorage.getItem('CurrentVQID') + "&VendorId=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            // alert(JSON.stringify(data))

            if (data.length > 0) {

                $('#ddlPubliclisted').val(data[0].isPubliclyListed);
                if (data[0].isPubliclyListed == 'N') {
                    $('#ddlPubliclistedPrev').html('No');
                } else {
                    $('#ddlPubliclistedPrev').html('Yes');
                }
                
                
                $('#txtturnover1').val(thousands_separators(data[0].turnOverY1));
                    $('#txtturnover2').val(thousands_separators(data[0].turnOverY2));
                    $('#txtturnover3').val(thousands_separators(data[0].turnOverY3));
                    $('#txtturnover4').val(thousands_separators(data[0].turnOverY4));
                    $('#annualProfit1').val(thousands_separators(data[0].annualProfit1));
                    $('#annualProfit2').val(thousands_separators(data[0].annualProfit2));
                    $('#annualProfit3').val(thousands_separators(data[0].annualProfit3));
                    $('#annualProfit4').val(thousands_separators(data[0].annualProfit4));


                    $('#txtturnover1Prev').html(thousands_separators(data[0].turnOverY1));
                    $('#txtturnover2Prev').html(thousands_separators(data[0].turnOverY2));
                    $('#txtturnover3Prev').html(thousands_separators(data[0].turnOverY3));
                    $('#txtturnover4Prev').html(thousands_separators(data[0].turnOverY4));
                    $('#annualProfit1Prev').html(thousands_separators(data[0].annualProfit1));
                    $('#annualProfit2Prev').html(thousands_separators(data[0].annualProfit2));
                    $('#annualProfit3Prev').html(thousands_separators(data[0].annualProfit3));
                    $('#annualProfit4Prev').html(thousands_separators(data[0].annualProfit4));
                    if (data[0].isPubliclyListed === 'Y') {
                        attachment1 = data[0].attachment1.replace(/\s/g, "%20")
                        attachment2 = data[0].attachment2.replace(/\s/g, "%20")
                        $('#file1').rules('remove', 'required');
                        $('#file2').rules('remove', 'required');
                        $('#attach1').attr('href', 'PortalDocs/RFI/'+sessionStorage.getItem('CurrentVQID')+'/'+sessionStorage.getItem('VendorId')+'/'+ attachment1+'').html(data[0].Attachment1);
                        $('#attach2').attr('href', 'PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attachment2 + '').html(data[0].Attachment2);
                        $('#attach-div').removeClass('display-none');

                        $('#attach1Prev').attr('href', 'PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attachment1 + '').html(data[0].Attachment1);
                        $('#attach2Prev').attr('href', 'PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + sessionStorage.getItem('VendorId') + '/' + attachment2 + '').html(data[0].Attachment2);
                        $('#attach-divPrev').removeClass('display-none');
                    } else {

                        $('#attach1').attr('href', 'javascript:;');
                        $('#attach2').attr('href', 'javascript:;');
                        $('#attach-div').addClass('display-none');
                    }
                    
                   
                }       

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();
}


function Isattachment() {
    if ($('#ddlPubliclisted').val() == 'Y') {
        $('#attach-div').removeClass('display-none')
    } else {
        $('#file1').val('');
        $('#file2').val('');
        $('#attach-div').addClass('display-none')
    }
}

function Filltblfinancedetails() {

    $('#tblfinancedetails').empty();
    $('#tblfinancedetailsPrev').empty();
    $('#tblfinancedetails').append('<thead><tr><th>Year</th><th>Turnover</th><th>Annual Profit After Tax</th></tr></thead>')
    $('#tblfinancedetailsPrev').append('<thead><tr><th>Year</th><th>Turnover</th><th>Annual Profit After Tax</th></tr></thead>')
    var today = new Date();
    var yyyy = today.getFullYear();
    $('#tblfinancedetails').append('<tr><td id="yearDesc1">' + (yyyy - 1) + ' - ' + yyyy + '</td><td><input type="text" class="form-control" id="txtturnover1" name="txtturnover1" autocomplete="off" required="required" onkeyup="thousands_separators_input(this)" /></td><td><input type="text" class="form-control" id="annualProfit1"  name="annualProfit1" autocomplete="off" required="required" onkeyup="thousands_separators_input(this)" /></td></tr>')
    $('#tblfinancedetails').append('<tr><td id="yearDesc2">' + (yyyy - 2) + ' - ' + (yyyy - 1) + '</td><td><input type="text" class="form-control" id="txtturnover2" name="txtturnover2" autocomplete="off" required="required" onkeyup="thousands_separators_input(this)" /></td><td><input type="text" class="form-control" id="annualProfit2" name="annualProfit2" autocomplete="off" required="required" onkeyup="thousands_separators_input(this)" /></td></tr>')
    $('#tblfinancedetails').append('<tr><td id="yearDesc3">' + (yyyy - 3) + ' - ' + (yyyy - 2) + '</td><td><input type="text" class="form-control" id="txtturnover3" name="txtturnover3" autocomplete="off" required="required" onkeyup="thousands_separators_input(this)" /></td><td><input type="text" class="form-control" id="annualProfit3" name="annualProfit3" autocomplete="off" required="required" onkeyup="thousands_separators_input(this)" /></td></tr>')
    $('#tblfinancedetails').append('<tr><td id="yearDesc4">' + (yyyy - 4) + ' - ' + (yyyy - 3) + '</td><td><input type="text" class="form-control" id="txtturnover4" name="txtturnover4" autocomplete="off" required="required" onkeyup="thousands_separators_input(this)"  /></td><td><input type="text" class="form-control" id="annualProfit4" name="annualProfit4" autocomplete="off" required="required" onkeyup="thousands_separators_input(this)" /></td></tr>')

    $('#tblfinancedetailsPrev').append('<tr><td id="yearDesc1Prev">' + (yyyy - 1) + ' - ' + yyyy + '</td><td><p class="form-control-static" id="txtturnover1Prev" name="txtturnover1"></p></td><td><p class="form-control-static" id="annualProfit1Prev"  name="annualProfit1"></p></td></tr>')
    $('#tblfinancedetailsPrev').append('<tr><td id="yearDesc2Prev">' + (yyyy - 2) + ' - ' + (yyyy - 1) + '</td><td><p class="form-control-static" id="txtturnover2Prev" name="txtturnover2"></p></td><td><p class="form-control-static" id="annualProfit2Prev" name="annualProfit2"></p></td></tr>')
    $('#tblfinancedetailsPrev').append('<tr><td id="yearDesc3Prev">' + (yyyy - 3) + ' - ' + (yyyy - 2) + '</td><td><p class="form-control-static" id="txtturnover3Prev" name="txtturnover3"></p></td><td><p class="form-control-static" id="annualProfit3Prev" name="annualProfit3"></p></td></tr>')
    $('#tblfinancedetailsPrev').append('<tr><td id="yearDesc4Prev">' + (yyyy - 4) + ' - ' + (yyyy - 3) + '</td><td><p class="form-control-static" id="txtturnover4Prev" name="txtturnover4"></p></td><td><p class="form-control-static" id="annualProfit4Prev" name="annualProfit4"></p></td></tr>')
}

function InsUpdTab1Data(locText) {
    var _cleanString = StringEncodingMechanism($('#txtCompanyName').val());
    var _cleanString2 = StringEncodingMechanism($('#txtofficeAddress').val());
    var _cleanString3 = StringEncodingMechanism($('#txtfactoryAddress').val());
    var _cleanString4 = StringEncodingMechanism($('#txtParentcompName').val());
    var _cleanString5 = StringEncodingMechanism($('#txtContactName').val());
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vals = 0;
    var InsertQuery = ''; var faxno = 0;
    $('#tblcompanyInfo tr td').each(function () {
        var this_row = $(this);
        var nameSplit='';
        //if (this_row.closest('td').find('input[type="file"]').length && this_row.closest('td').find('input[type="file"]').val() !='') {
        //    nameSplit = $.trim(this_row.closest('td').find('input[type="file"]').val().split('\\').slice(-1));
        //    fileUploaderforQuestions('fileToUpload', vals);
        //} else {
        //    nameSplit = $("#spnCIAttach"+vals).html();
        //} 
        InsertQuery = InsertQuery + " select " + sessionStorage.getItem('CurrentVQID') + "," + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.closest('td').find('input[type="checkbox"]').val()) + ",'" + $.trim(this_row.closest('td').find('textarea').val().replace(/'/g, ' ')) + "','" + nameSplit + "','CI',getDate() union ";
        vals++;
    });
    
    if (InsertQuery != '') {
        InsertQuery = 'Insert into PE.VR_QuestionAnswers(VQID,VendorId,QuestionID,Answers,Attachments,QuestFor,CreateDate)' + InsertQuery;
        InsertQuery = InsertQuery.substring(0, InsertQuery.length - 7);
    }
    if ($('#txtFaxNo').val() != null && $('#txtFaxNo').val() != "") {
        faxno = $('#txtFaxNo').val();
    }
   
    var Tab1Data = {
        "VQID":parseInt(sessionStorage.getItem('CurrentVQID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        //"CompanyName": $('#txtCompanyName').val(),
        "CompanyName": _cleanString,
        "CompanyPhone": $('#txtPhoneNo').val(),
        //"OfficedAddress": $('#txtofficeAddress').val(),
        "OfficedAddress": _cleanString2,
        "CompanyEmail": $('#txtemailID').val(),
        //"FactoryAdress": $('#txtfactoryAddress').val(),
        "FactoryAdress": _cleanString3,
        //"ParentCompany": $('#txtParentcompName').val(),
        "ParentCompany": _cleanString4,
        "FaxNumber": parseInt(faxno),
        "CompanyWebsite": $('#txtWebsite').val(),
        "Ownership": $('#ddlOwnership option:selected').text(),
        "EmployeeCount": parseInt($('#txtemployeeNum').val()),
        "KeyProjects": $('#txtbriefDesc').val(),
        "Title": $('#ddlTitle option:selected').text(),
        //"KeyPersonName": $('#txtContactName').val(),
        "KeyPersonName": _cleanString5,
        "KeyPersonNo": $('#txtcontactNo').val(),
        "KeyPersonEmail": '',
        "InsertQuery": InsertQuery,
        "IsSuccess": 'CI',
        "City": $("#txtCity").val(),
        "PANNo": $("#txtPanNo").val(),
        "ServiceTaxNo": $("#txtGstNo").val(),
        "KeyPersonAlternateEmail": ''

    }
    //alert(JSON.stringify(Tab1Data))
    console.log(JSON.stringify(Tab1Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VQMaster/InsUpdVRCompanyInfo",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab1Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            
                 if(locText == 'SaveExit'){
                     bootbox.alert("The information entered are saved and can be accessed later using same id and password.<br/> Please make sure to submit information before deadline.", function() {
                        // window.location = sessionStorage.getItem('MainUrl');
                         window.location = 'VendorHome.html';
                         return false;
                     });
                }else{
                    return true;
                }
             
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else{
                $('#form_wizard_1').bootstrapWizard('previous');
                $("#spandanger").html("Internal Servor Error");
                error.show();
                error.fadeOut(5000);
            }
           
            return false;
            jQuery.unblockUI();
        }
       
    });
    jQuery.unblockUI();    

} 

function InsUpdTab2Data(locText) {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var InsertQuestions = '';   
    var vals = 0;
    $('#tblfinanceInfo tr td').each(function () {
        var this_row = $(this);
        var nameSplit = '';
        if (this_row.closest('td').find('input[type="file"]').length && this_row.closest('td').find('input[type="file"]').val() !='') {
            nameSplit = $.trim(this_row.closest('td').find('input[type="file"]').val().split('\\').slice(-1));
            
            //fileUploaderforQuestions('FfileToUpload', vals);     
            if ($('#FfileToUpload' + vals).val() != '') {
                fnUploadFilesonAzure('FfileToUpload' + vals, attach1, 'VQ/' + sessionStorage.getItem('CurrentVQID') + "/" + sessionStorage.getItem('VendorId'));
            }
           
        } else {
            nameSplit = $("#spnFAttach"+vals).html();
        }
        
        InsertQuestions = InsertQuestions + " select " + sessionStorage.getItem('CurrentVQID') + "," + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.closest('td').find('input[type="checkbox"]').val()) + ",'" + $.trim(this_row.closest('td').find('textarea').val().replace(/'/g, ' ')) + "','" + nameSplit + "','FI',getDate() union ";
        vals++;
    });

    if (InsertQuestions != '') {
        InsertQuestions = 'Insert into PE.VR_QuestionAnswers(VQID,VendorId,QuestionID,Answers,Attachments,QuestFor,CreateDate)' + InsertQuestions;
        InsertQuestions = InsertQuestions.substring(0, InsertQuestions.length - 7);
    }
    var attach1 = '';
    var attach2 = '';
    if (!$('#attach-div').hasClass('display-none') && ($('#file1').val() != '' || $('#file2').val() != '')) {        
        attach1 = $('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
        attach2 = $('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1);
        
    }
    else {
        attach1 = $("#attach1").html();
        attach2 = $("#attach2").html();
    }
    //alert(InsertQuery)
    var Tab2Data = {
        "VQID": parseInt(sessionStorage.getItem('CurrentVQID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        "IsPubliclyListed": $('#ddlPubliclisted').val(),
        "Attachment1": attach1,
        "Attachment2": attach2,
        "YearDesc1": $('#yearDesc1').html(),
        "YearDesc2": $('#yearDesc2').html(),
        "YearDesc3": $('#yearDesc3').html(),
        "YearDesc4": $('#yearDesc4').html(),
        "TurnOverY1": parseInt(removeThousandSeperator($('#txtturnover1').val())),
        "TurnOverY2": parseInt(removeThousandSeperator($('#txtturnover2').val())),
        "TurnOverY3": parseInt(removeThousandSeperator($('#txtturnover3').val())),
        "TurnOverY4": parseInt(removeThousandSeperator($('#txtturnover4').val())),
        "AnnualProfit1": parseInt(removeThousandSeperator($('#annualProfit1').val())),
        "AnnualProfit2": parseInt(removeThousandSeperator($('#annualProfit2').val())),
        "AnnualProfit3": parseInt(removeThousandSeperator($('#annualProfit3').val())),
        "AnnualProfit4": parseInt(removeThousandSeperator($('#annualProfit4').val())),
        "InsertQuery": InsertQuestions,
        "IsSuccess": 'FI'

    }
   // alert(JSON.stringify(Tab2Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VQMaster/InsUpdVRFInanceInfo",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab2Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if ($('#file1').val() != '') {
                fnUploadFilesonAzure('file1', attach1, 'VQ/' + sessionStorage.getItem('CurrentVQID') + "/" + sessionStorage.getItem('VendorId'));

            }
            if ($('#file2').val() != '') {
                fnUploadFilesonAzure('file2', attach2, 'VQ/' + sessionStorage.getItem('CurrentVQID') + "/" + sessionStorage.getItem('VendorId'));

            }
           
                if(locText == 'SaveExit'){
                    bootbox.alert("The information entered are saved and can be accessed later using same id and password.<br/> Please make sure to submit information before deadline.", function() {
                        //window.location = sessionStorage.getItem('MainUrl');
                        window.location = 'VendorHome.html';
                        return false;
                    });
                }else{
                    return true;
                }
           
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                $('#form_wizard_1').bootstrapWizard('previous');
                $("#spandanger").html("Internal Servor Error");
                error.show();
                error.fadeOut(5000);
            }
           
            return false;
            jQuery.unblockUI();
        }
       
    });
    jQuery.unblockUI();

}

function InsUpdTab3Data(locText) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var InsertQuestions = '';
    var vals = 0;
    $('#tblcompCapableInfo tr td').each(function () {
        var this_row = $(this);
        var nameSplit = '';
        if (this_row.closest('td').find('input[type="file"]').length && this_row.closest('td').find('input[type="file"]').val() !='') {
            nameSplit = $.trim(this_row.closest('td').find('input[type="file"]').val().split('\\').slice(-1));

           // fileUploaderforQuestions('CfileToUpload', vals);
            if ($('#CfileToUpload' + vals).val() != '') {
                fnUploadFilesonAzure('CfileToUpload' + vals, attach1, 'VQ/' + sessionStorage.getItem('CurrentVQID') + "/" + sessionStorage.getItem('VendorId'));
            }

        } else {
            nameSplit = $("#spnCCAttach"+vals).html();
        }
        InsertQuestions = InsertQuestions + " select " + sessionStorage.getItem('CurrentVQID') + "," + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.closest('td').find('input[type="checkbox"]').val()) + ",'" + $.trim(this_row.closest('td').find('textarea').val().replace(/'/g, ' ')) + "','" + nameSplit + "','CC',getDate() union ";
        vals++;
    });

    if (InsertQuestions != '') {
        InsertQuestions = 'Insert into PE.VR_QuestionAnswers(VQID,VendorId,QuestionID,Answers,Attachments,QuestFor,CreateDate)' + InsertQuestions;
        InsertQuestions = InsertQuestions.substring(0, InsertQuestions.length - 7);
    }
    
    //alert(InsertQuery)
    var Tab3Data = {
        "VQID": parseInt(sessionStorage.getItem('CurrentVQID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),        
        "InsertQuery": InsertQuestions,
        "IsSuccess": 'CC'

    }

    //alert(JSON.stringify(Tab3Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VQMaster/InsUpdVRCompanyCapableAnswers",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab3Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            
                if(locText == 'SaveExit'){
                    bootbox.alert("The information entered are saved and can be accessed later using same id and password.<br/> Please make sure to submit information before deadline.", function() {
                       // window.location = sessionStorage.getItem('MainUrl');
                        window.location = 'VendorHome.html';
                        return false;
                    });
                }else{
                    return true;
                }
            
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                $('#form_wizard_1').bootstrapWizard('previous');
                $("#spandanger").html("Internal Servor Error");
                error.show();
                error.fadeOut(5000);
            }
           
            return false;
            jQuery.unblockUI();
        }
      
    });
    jQuery.unblockUI();

}

function InsUpdTab4Data() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var InsertQuestions = '';
    var vals = 0;
    $('#tbltechnicalInfo tr td').each(function () {
        var this_row = $(this);
        var nameSplit = '';
        if (this_row.closest('td').find('input[type="file"]').length && this_row.closest('td').find('input[type="file"]').val() != '') {
            nameSplit = $.trim(this_row.closest('td').find('input[type="file"]').val().split('\\').slice(-1));

            //fileUploaderforQuestions('TfileToUpload', vals);
            if ($('#TfileToUpload' + vals).val() != '') {
                fnUploadFilesonAzure('TfileToUpload' + vals, attach1, 'VQ/' + sessionStorage.getItem('CurrentVQID') + "/" + sessionStorage.getItem('VendorId'));
            }

        } else {
            nameSplit = $("#spnTIAttach"+vals).html();
        }
        InsertQuestions = InsertQuestions + " select " + sessionStorage.getItem('CurrentVQID') + "," + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.closest('td').find('input[type="checkbox"]').val()) + ",'" + $.trim(this_row.closest('td').find('textarea').val().replace(/'/g, ' ')) + "','" + nameSplit + "','TI',getDate() union ";
        vals++;
    });

    if (InsertQuestions != '') {
        InsertQuestions = 'Insert into PE.VR_QuestionAnswers(VQID,VendorId,QuestionID,Answers,Attachments,QuestFor,CreateDate)' + InsertQuestions;
        InsertQuestions = InsertQuestions.substring(0, InsertQuestions.length - 7);
    }

    //alert(InsertQuery)
    var Tab4Data = {
        "VQID": parseInt(sessionStorage.getItem('CurrentVQID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        "InsertQuery": InsertQuestions,
        "IsSuccess": 'TI'
        

    }
    //alert(JSON.stringify(Tab4Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VQMaster/InsUpdVRTechnicalAnswers",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab4Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            //if (data[0].isSuccess == "Y") {                
                RFIFetchCompanyHeader('CompanyInfo')
                RFIFetchFinanceHeader();
                fetchQuestionsForVendors('CompanyInfo')
                fetchQuestionsForVendors('FinancialInfo');
                fetchQuestionsForVendors('CompanyCapabilities');
                fetchQuestionsForVendors('TechnicalInfo');
                $('#form_wizard_1').hide();
                $(".preview_div").show()
           // }
            
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                $('#form_wizard_1').bootstrapWizard('previous');
                $("#spandanger").html("Internal Servor Error");
                error.show();
                error.fadeOut(5000);
            }
           
            return false;
            jQuery.unblockUI();
        }
        
    });
    jQuery.unblockUI();

}

//function fileUploaderforQuestions(fileBox,vals) {   
    
//    if ($('#' + fileBox + vals).val() != '') {
       
//        var fileToUpload = getNameFromPath($('#' + fileBox + vals).val());

//    }
//    else {
        
//        return false;
//    }
    
//    var urls = 'RFIVRFileAttachment.ashx?AttachmentFor=RFI&RFIID=' + sessionStorage.getItem('CurrentVQID') + '&VendorID=' + sessionStorage.getItem('VendorId') + '&Vals=' + vals + '&FileBox=' + fileBox;
   
//    $.ajaxFileUpload({
//        url: urls,
//        secureuri: false,
//        fileElementId: fileBox + vals,
//        dataType: 'json',
//        success: function (data, status) {            
            
//        },
//        error: function (data, status, e) {
//            bootbox.alert("Attachment error.");
//        }
//    });


//    return false;

//}

//function fileUploaderFinanceHeader() {

//var fileTerms = $('#file1');

//var fileDataTerms = fileTerms.prop("files")[0];



//var fileAnyOther = $('#file2');

//var fileDataAnyOther = fileAnyOther.prop("files")[0];

//var RFIID = sessionStorage.getItem('CurrentVQID')
//var VendorID = sessionStorage.getItem('VendorId')

//var formData = new window.FormData();

//formData.append("fileTerms", fileDataTerms);

//formData.append("fileAnyOther", fileDataAnyOther);

//formData.append("AttachmentFor", 'RFI');

//formData.append("BidID", RFIID);

//formData.append("VendorID", VendorID);



//$.ajax({

//    url: 'ConfigureFileAttachment.ashx',

//    data: formData,

//    processData: false,

//    contentType: false,

//    asyc: false,

//    type: 'POST',

//    success: function (data) {


//    },

//    error: function () {

//        bootbox.alert("Attachment error.");

//    }

//});

//}

function fetchPreCompanydetails() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/fetchPreCompanydetails/?VQID=" + sessionStorage.getItem('CurrentVQID') + "&VendorId=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function(data) {
            // alert(JSON.stringify(data))

            if (data.length > 0) {

                $('#txtCompanyName').attr('disabled', true);

                $('#txtemailID').attr('disabled', true);

                $('#txtContactName').attr('disabled', true);

                $('#txtcontactNo').attr('disabled', true);

                
                $('#txtCompanyName').val(data[0].companyName);

                $('#txtemailID').val(data[0].companyEmail);
                $('#txtContactName').val(data[0].keyPersonName);
                $('#txtcontactNo').val(data[0].keyPersonNo);
               


            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            
            return false;
            jQuery.unblockUI();
        }

    });
}

$('#logOut_btn').attr('href', sessionStorage.getItem(''))

function hidePrevShowConfig() {

    $('#form_wizard_1').show();
    $(".preview_div").hide()
}

function submitRFIVR() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var Tab4Data = {
        "VRID": parseInt(sessionStorage.getItem('CurrentVQID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        "VendorEmail":sessionStorage.getItem('EmailID'),
        "VendorName": sessionStorage.getItem('UserName'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
   // alert(JSON.stringify(Tab4Data))
   // console.log(JSON.stringify(Tab4Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VQMaster/SubmitVR",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab4Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          //  if (data == "Y") {
                bootbox.alert("VQ response submitted and forwarded to company.", function () {
                    // window.location = sessionStorage.getItem('MainUrl');
                    window.location = 'VendorHome.html';
                    return false;
                });
           // }
            
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                $('#form_wizard_1').bootstrapWizard('previous');
                $("#spandanger").html("Internal Servor Error");
                error.show();
                error.fadeOut(5000);
            }
           
            return false;
            jQuery.unblockUI();
        }
       
    });
    jQuery.unblockUI();
}