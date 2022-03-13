var error = $('.alert-danger');

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
                    txtcontactEmail: {
                        required: true,
                        email: true,
                        equalTo: function (element) {
                            if($("#txtemailID").val() == $("#txtcontactEmail").val()){
                                equalTo: true;
                            }else{
                                equalTo: false;    
                            }
                        }
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
                    txtcontactAltEmail: {
                        required: true,
                        email: true,
                        equalTo: function (element) {
                            if ($("#txtemailID").val() == $("#txtcontactAltEmail").val()) {
                                equalTo: true;
                            } else {
                                equalTo: false;
                            }
                        }
                    }
                },
                    messages: {

                        txtcontactAltEmail:{
                            equalTo: 'Comapny email id should be different from email id used in reverse auction'
                        },
                        txtcontactEmail:{
                            equalTo: 'Comapny email id should be different from email id used in reverse auction'
                        }

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
                $('#form_wizard_1').find('.button-submit').html('Preview')
                displayConfirm();

            } else {
            $('#form_wizard_1').find('.button-submit').html('Save And Exit')
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
                    //if (form.valid() == false) {
                    //    return false;
                    //} else {
                        fetchQuestionsForVendors('TechnicalCapabilities');
                        //fetchPreCompanydetails();
                    //}

                }
                if (index == 2) {
                    if (form.valid() == false) {
                        return false;
                    } else {
                        
                        InsUpdTab3Data('Next')
                      
                        fetchQuestionsForVendors('ExecutionCapabilities');
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
        url: sessionStorage.getItem("APIPath") + "RFXMaster/fetchRFXPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFXID=" + sessionStorage.getItem('CurrentRFIID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            attachment = BidData[0].rfxMaster[0].rfxAttachment.replace(/\s/g, "%20")
            jQuery('#tblServicesProduct').empty();
            jQuery('#tblTempVendorslist').empty();
           
            jQuery('#txtrfiSubject').val(BidData[0].rfxMaster[0].rfxSubject)
            jQuery('#txtrfideadline').val(BidData[0].rfxMaster[0].rfxDeadline)
            jQuery('#txtrfidescription').val(BidData[0].rfxMaster[0].rfxDescription)

           
            jQuery('#txtrfiSubjectPrev').html(BidData[0].rfxMaster[0].rfxSubject)
            jQuery('#txtrfideadlinePrev').html(BidData[0].rfxMaster[0].rfxDeadline)
            jQuery('#txtrfidescriptionPrev').html(BidData[0].rfxMaster[0].rfxDescription)
            

            if (BidData[0].rfxAttachment.length > 0) {
                $("#tblAttachmentsElem").empty();
                $("#tblAttachmentsElemPrev").empty();
                for (var i = 0; i < BidData[0].rfxAttachment.length; i++) {
                    replaced = BidData[0].rfxAttachment[i].rfxAttachment.replace(/\s/g, "%20")
                    $("#tblAttachmentsElem").append('<li style="padding-top: 8px;"><div class="inputgroup">' +
                        '<label class="control-label col-md-3">Attachment</label>' +
                        '<div class="col-md-4">' +
                        '<input type="text" class="form-control" placeholder="Attachment Description" tabindex="5" name="txtattachdescription" readonly autocomplete="off" value=' + BidData[0].rfxAttachment[i].rfxAttachmentDescription.replace(/\s/g, "&nbsp;") + ' />' +
                        '</div>' +
                        '<div class="col-md-3">' +
                        
                        '<span class="help-block"><a id=attach-file' + (i + 1) + ' href=PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + replaced + ' style="text-decoration: none !important;">' + BidData[0].rfxAttachment[i].rfxAttachment + '</a></span>' +
                        '</div><div class="clearfix"></div>' +
                        '</div></li>'
                        );

                    $("#tblAttachmentsElemPrev").append('<li><div class="col-md-8" style=padding-left:0px;>' +
                        '<p class="form-control-static">'+ BidData[0].rfxAttachment[i].rfxAttachmentDescription.replace(/\s/g, "&nbsp;") + '</p>' +
                        '</div>' +
                        '<div class="col-md-4">' +
                        '<span class="help-block"><a href=PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + replaced + ' style="text-decoration: none !important;">' + BidData[0].rfxAttachment[i].rfxAttachment + '</a></span>' +
                        '</div><div class="clearfix"></div>' +
                        '</li>'
                        );
                }
            } else {
                $("#_noAttachment").show();
            }

            if (BidData[0].rfxProductCat.length > 0) {
                for (var i = 0; i < BidData[0].rfxProductCat.length; i++) {
                    jQuery("#ddlCategoryMultiple").append("<option value=" + BidData[0].rfxProductCat[i].categoryID + ">" + BidData[0].rfxProductCat[i].categoryName + "</option>");
                    _selectedCat.push(BidData[0].rfxProductCat[i].categoryID);
                    _txtCategories += BidData[0].rfxProductCat[i].categoryName + ', ';
                }
                _txtCategories = _txtCategories.substring(0, _txtCategories.length - 2);
                jQuery("#productCatPrevPrev").html(_txtCategories);

                setTimeout(function () {
                    $("#ddlCategoryMultiple").select2('val', _selectedCat);
                }, 1000);
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

}


function fetchQuestionsForVendors(QuestionFor) {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFXMaster/RFXFetchQuestionForVendors/?GetMsz=" + QuestionFor + "&Number=" + sessionStorage.getItem('CurrentRFIID') + "&VendorID=" + sessionStorage.getItem('VendorId'),
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
                                $("#tblcompanyInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" id=textaraID' + j + ' placeholder="Answer" name=textaraID' + j + ' rows="3" required></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control" id=fileToUpload' + j + '  name=fileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span> <br/><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;">' + data[j].attachments + '</a></span></div></td></tr>');
                                $("#tblcompanyInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=textaraIDPrev' + j + ' name=textaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                            } else {
                                jQuery("#tblcompanyInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" id=textaraID' + j + ' placeholder="Answer" name=textaraID' + j + ' rows="3" required></textarea></div></td></tr>');
                                jQuery("#tblcompanyInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=textaraIDPrev' + j + ' name=textaraIDPrev' + j + '></p></div></td></tr>');
                            }
                        
                        } else {
                       
                            if (data[j].attachement == "Y") {
                                jQuery("#tblcompanyInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" id=textaraID' + j + ' placeholder="Answer" name=textaraID' + j + ' rows="3"></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control " id=fileToUpload' + j + ' name=fileToUpload' + j + ' required="required" onchange="checkfilesize(this)/"></span><br/><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;">' + data[j].attachments + '</a></span></div></td></tr>');
                                jQuery("#tblcompanyInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=textaraIDPrev' + j + ' name=textaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');

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

                        $("#tblfinanceInfo").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].QuestionSubCategory + '</th></tr></thead>');
                        $("#tblfinanceInfoPrev").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].QuestionSubCategory + '</th></tr></thead>');
                        SubcategoryID = data[i].questionSubCategoryID;
                        for (var j = 0; j < data.length; j++) {
                            if (data[i].attachments != '') {
                                attach2 = data[j].attachments.replace(/\s/g, "%20")
                            } else {
                                attach2 = attach1;
                            }
                            if (SubcategoryID == data[j].QuestionSubCategoryID) {
                                $("#tblfinanceInfo").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                                $("#tblfinanceInfoPrev").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].questionDescription + '</th></tr></thead>');
                                
                                if (data[j].mandatory == "Y") {
                                    if (data[j].attachement == "Y") {
                                        jQuery("#tblfinanceInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=FtextaraID' + j + ' name=FtextaraID' + j + ' rows="3" required></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control" id=FfileToUpload' + j + ' name=FfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tblfinanceInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=FtextaraIDPrev' + j + ' name=FtextaraIDPrev' + j + '></p></div><div class="col-md-3"></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');

                                    } else {
                                        jQuery("#tblfinanceInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=FtextaraID' + j + ' name=FtextaraID' + j + ' rows="3" required></textarea></div></td></tr>');
                                        jQuery("#tblfinanceInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=FtextaraIDPrev' + j + ' name=FtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }

                                } else {
                                    if (data[j].attachement == "Y") {
                                        jQuery("#tblfinanceInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=FtextaraID' + j + ' rows="3" name=FtextaraID' + j + ' ></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control " id=FfileToUpload' + j + ' name=FfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tblfinanceInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=FtextaraIDPrev' + j + ' name=FtextaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
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

            if (data[0].getMsz == 'TechnicalCapabilities') {
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
                                        jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=CtextaraID' + j + ' name=CtextaraID' + j + ' required></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control" id=TCfileToUpload' + j + ' name=TCfileToUpload' + j + ' onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a id=spanAttachTc' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach3 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tblcompCapableInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=CtextaraIDPrev' + j + ' name=CtextaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#TCfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#TCfileToUpload" + j).attr('required', true);
                                        }
                                    } else {
                                        jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=CtextaraID' + j + ' name=CtextaraID' + j + ' required></textarea></div></td></tr>');
                                        jQuery("#tblcompCapableInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=CtextaraIDPrev' + j + ' name=CtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }

                                } else {
                                    if (data[i].attachement == "Y") {
                                        jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=CtextaraID' + j + ' name=CtextaraID' + j + ' rows="3"></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control " id=TCfileToUpload' + j + ' name=TCfileToUpload' + j + ' onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a id=spanAttachTc' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach3 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tblcompCapableInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=CtextaraIDPrev' + j + ' name=CtextaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach1 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#TCfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#TCfileToUpload" + j).attr('required', true);
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


            if (data[0].getMsz == 'ExecutionCapabilities') {
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
                                if (data[j].mandatory == "Y") {
                                    if (data[j].attachement == "Y") {
                                        jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=TtextaraID' + j + ' name=TtextaraID' + j + ' required></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control" id=ECfileToUpload' + j + ' name=ECfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a  id=spanAttachEc' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach4 + '" style="text-decoration: none !important;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tbltechnicalInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=TtextaraIDPrev' + j + ' name=TtextaraIDPrev' + j + '></p></div><div class="col-md-3"></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#ECfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#ECfileToUpload" + j).attr('required', true);
                                        }
                                    } else {
                                        jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=TtextaraID' + j + ' name=TtextaraID' + j + ' rows="3" required></textarea></div></td></tr>');
                                        jQuery("#tbltechnicalInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=TtextaraIDPrev' + j + ' name=TtextaraIDPrev' + j + '></p></div></td></tr>');
                                    }

                                } else {
                                    if (data[j].attachement == "Y") {
                                        jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=TtextaraID' + j + ' name=TtextaraID' + j + ' rows="3"></textarea></div><div class="col-md-3"><span class="btn btn-sm grey-cascade fileinput-button"><input type="file" class="default form-control " id=ECfileToUpload' + j + ' name=ECfileToUpload' + j + ' required="required" onchange="checkfilesize(this)"/></span><br/><span class="help-block"><a  id=spanAttachEc' + j + ' href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach4 + '" style="text-decoration: none !important;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        jQuery("#tbltechnicalInfoPrev > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].questionID + ' /><div class="col-md-9"><p class="form-control-static" id=TtextaraIDPrev' + j + ' name=TtextaraIDPrev' + j + '></p></div></div><div class="col-md-3"><span class="help-block"><a href="PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach2 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].attachments + '</a></span></div></td></tr>');
                                        if (data[j].attachments != '') {
                                            $("#ECfileToUpload" + j).attr('required', false);
                                        } else if (data[j].attachments == '') {
                                            $("#ECfileToUpload" + j).attr('required', true);
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

            var err = xhr.responseText// eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
}

function RFIFetchCompanyHeader(QuestionFor) {
jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';

    jQuery.ajax({

        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIMaster/RFIFetchCompanyInfo_VR/?IsSuccess=" + QuestionFor + "&RFIID=" + sessionStorage.getItem('CurrentRFIID') + "&VendorId=" + sessionStorage.getItem('VendorId'),
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
                            $('#txtcontactEmail').val(data[0].keyPersonEmail);
                            $('#txtCity').val(data[0].city);
                            $('#txtPanNo').val(data[0].pANNo);
                            $('#txtGstNo').val(data[0].serviceTaxNo);
                            $('#txtcontactAltEmail').val(data[0].keyPersonAlternateEmail);

                            $('#txtCompanyNamePrev').html(data[0].companyName);
                            $('#txtPhoneNoPrev').html(data[0].companyPhone);
                            $('#txtofficeAddressPrev').html(data[0].officedAddress);
                            $('#txtfactoryAddressPrev').html(data[0].factoryAdress);
                            $('#txtemailIDPrev').html(data[0].companyEmail);
                            $('#txtParentcompNamePrev').html(data[0].parentCompany);
                            $('#txtFaxNoPrev').html(data[0].faxNumber);
                            $('#txtWebsitePrev').html(data[0].companyWebsite);
                            $('#ddlOwnershipPrev').html(data[0].ownership);
                            $('#txtemployeeNumPrev').html(data[0].employeeCount);
                            $('#txtbriefDescPrev').html(data[0].keyProjects);
                            $('#ddlTitlePrev').html(data[0].title);
                            $('#txtContactNamePrev').html(data[0].keyPersonName);
                            $('#txtcontactNoPrev').html(data[0].keyPersonNo);
                            $('#txtcontactEmailPrev').html(data[0].keyPersonEmail);
                            $('#txtCityPrev').html(data[0].city);
                            $('#txtPanNoPrev').html(data[0].pANNo);
                            $('#txtGstNoPrev').html(data[0].serviceTaxNo);
                            $('#txtcontactAltEmailPrev').html(data[0].keyPersonAlternateEmail);
                  

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

function RFIFetchFinanceHeader() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIMaster/RFIFetchFinanceInfo_VR/?RFIID=" + sessionStorage.getItem('CurrentRFIID') + "&VendorId=" + sessionStorage.getItem('VendorId'),
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
                        $('#attach1').attr('href', 'PortalDocs/RFI/'+sessionStorage.getItem('CurrentRFIID')+'/'+sessionStorage.getItem('VendorId')+'/'+ attachment1+'').html(data[0].Attachment1);
                        $('#attach2').attr('href', 'PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attachment2 + '').html(data[0].Attachment2);
                        $('#attach-div').removeClass('display-none');

                        $('#attach1Prev').attr('href', 'PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attachment1 + '').html(data[0].Attachment1);
                        $('#attach2Prev').attr('href', 'PortalDocs/RFI/' + sessionStorage.getItem('CurrentRFIID') + '/' + sessionStorage.getItem('VendorId') + '/' + attachment2 + '').html(data[0].Attachment2);
                        $('#attach-divPrev').removeClass('display-none');
                    } else {

                        $('#attach1').attr('href', 'javascript:;');
                        $('#attach2').attr('href', 'javascript:;');
                        $('#attach-div').addClass('display-none');
                    }
                    
                   
                }       

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vals = 0;
    var InsertQuery = '';
    $('#tblcompanyInfo tr td').each(function () {
        var this_row = $(this);
        var nameSplit='';
        if (this_row.closest('td').find('input[type="file"]').length) {
            nameSplit = $.trim(this_row.closest('td').find('input[type="file"]').val().split('\\').slice(-1));
            fileUploaderforQuestions('fileToUpload', vals);
        } else {
            nameSplit = nameSplit;
        } 
        InsertQuery = InsertQuery + " select " + sessionStorage.getItem('CurrentRFIID') + "," + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.closest('td').find('input[type="checkbox"]').val()) + ",'" + $.trim(this_row.closest('td').find('textarea').val().replace(/'/g, ' ')) + "','" + nameSplit + "','CI',[PE].FN_Now() union ";
        vals++;
    });
    
    if (InsertQuery != '') {
        InsertQuery = 'Insert into PE.RFX_VR_QuestionAnswers(RFXID,VendorId,QuestionID,Answers,Attachments,QuestFor,CreateDate)' + InsertQuery;
        InsertQuery = InsertQuery.substring(0, InsertQuery.length - 7);
    }

    var Tab1Data = {
        "RFIID":parseInt(sessionStorage.getItem('CurrentRFIID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        "CompanyName": $('#txtCompanyName').val(),
        "CompanyPhone": $('#txtPhoneNo').val(),
        "OfficedAddress": $('#txtofficeAddress').val(),
        "CompanyEmail": $('#txtemailID').val(),
        "FactoryAdress": $('#txtfactoryAddress').val(),
        "ParentCompany": $('#txtParentcompName').val(),
        "FaxNumber": $('#txtFaxNo').val(),
        "CompanyWebsite": $('#txtWebsite').val(),
        "Ownership": $('#ddlOwnership option:selected').text(),
        "EmployeeCount": $('#txtemployeeNum').val(),
        "KeyProjects": $('#txtbriefDesc').val(),
        "Title": $('#ddlTitle option:selected').text(),
        "KeyPersonName": $('#txtContactName').val(),
        "KeyPersonNo": $('#txtcontactNo').val(),
        "KeyPersonEmail": $('#txtcontactEmail').val(),
        "InsertQuery": InsertQuery,
        "IsSuccess": 'CI',
        "City": $("#txtCity").val(),
        "PANNo": $("#txtPanNo").val(),
        "ServiceTaxNo": $("#txtGstNo").val(),
        "KeyPersonAlternateEmail": $("#txtcontactAltEmail").val()

    }
    //alert(JSON.stringify(Tab1Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFXMaster/InsUpdRFXVRTechnicalCapablityAnswers",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab1Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
           
            if (data[0].isSuccess == "Y") {
                 if(locText == 'SaveExit'){
                     bootbox.alert("The information entered are saved and can be accessed later using same id and password.<br/> Please make sure to submit information before deadline.", function() {
                         window.location = sessionStorage.getItem('MainUrl');

                         return false;
                     });
                }else{
                    return true;
                }
                
                
            }
            else if (data[0].isSuccess == 'F') {
                $('#form_wizard_1').bootstrapWizard('previous');                
                $("#spandanger").html("Internal Servor Error");
                error.show();
                error.fadeOut(5000);              

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

function InsUpdTab2Data(locText) {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var InsertQuestions = '';   
    var vals = 0;
    $('#tblfinanceInfo tr td').each(function () {
        var this_row = $(this);
        var nameSplit = '';
        if (this_row.closest('td').find('input[type="file"]').length) {
            nameSplit = $.trim(this_row.closest('td').find('input[type="file"]').val().split('\\').slice(-1));
            
            fileUploaderforQuestions('FfileToUpload', vals);           
           
        } else {
            nameSplit = nameSplit;
        }
        InsertQuestions = InsertQuestions + " select " + sessionStorage.getItem('CurrentRFIID') + "," + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.closest('td').find('input[type="checkbox"]').val()) + ",'" + $.trim(this_row.closest('td').find('textarea').val().replace(/'/g, ' ')) + "','" + nameSplit + "','FI',[PE].FN_Now() union ";
        vals++;
    });

    if (InsertQuestions != '') {
        InsertQuestions = 'Insert into PE.RFX_VR_QuestionAnswers(RFXID,VendorId,QuestionID,Answers,Attachments,QuestFor,CreateDate)' + InsertQuestions;
        InsertQuestions = InsertQuestions.substring(0, InsertQuestions.length - 7);
    }
    var attach1 = '';
    var attach2 = '';
    if (!$('#attach-div').hasClass('display-none')) {
        
        attach1 = $('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
        attach2 = $('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1);
        
    } else {
        attach1 = attach1;
        attach2 = attach2;
    }
    //alert(InsertQuery)
    var Tab2Data = {
        "RFIID": parseInt(sessionStorage.getItem('CurrentRFIID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        "IsPubliclyListed": $('#ddlPubliclisted').val(),
        "Attachment1": attach1,
        "Attachment2": attach2,
        "YearDesc1": $('#yearDesc1').html(),
        "YearDesc2": $('#yearDesc2').html(),
        "YearDesc3": $('#yearDesc3').html(),
        "YearDesc4": $('#yearDesc4').html(),
        "TurnOverY1": removeThousandSeperator($('#txtturnover1').val()),
        "TurnOverY2": removeThousandSeperator($('#txtturnover2').val()),
        "TurnOverY3": removeThousandSeperator($('#txtturnover3').val()),
        "TurnOverY4": removeThousandSeperator($('#txtturnover4').val()),
        "AnnualProfit1": removeThousandSeperator($('#annualProfit1').val()),
        "AnnualProfit2": removeThousandSeperator($('#annualProfit2').val()),
        "AnnualProfit3": removeThousandSeperator($('#annualProfit3').val()),
        "AnnualProfit4": removeThousandSeperator($('#annualProfit4').val()),
        "InsertQuery": InsertQuestions,
        "IsSuccess": 'FI'

    }
   // alert(JSON.stringify(Tab2Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFIMaster/InsUpdRFIVRFinanceInfo",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab2Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            fileUploaderFinanceHeader();
            if (data[0].isSuccess == "Y") {
                if(locText == 'SaveExit'){
                    bootbox.alert("The information entered are saved and can be accessed later using same id and password.<br/> Please make sure to submit information before deadline.", function() {
                        window.location = sessionStorage.getItem('MainUrl');

                        return false;
                    });
                }else{
                    return true;
                }
            }
            else if (data[0].isSuccess == 'F') {
                $('#form_wizard_1').bootstrapWizard('previous');
                $("#spandanger").html("Internal Servor Error");
                error.show();
                error.fadeOut(5000);

            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
        if (this_row.closest('td').find('input[type="file"]').length > 0) {
            if (this_row.closest('td').find('input[type="file"]').val() != '') {
                nameSplit = $.trim(this_row.closest('td').find('input[type="file"]').val().split('\\').slice(-1));

                //fileUploaderforQuestions('TCfileToUpload', vals);
                fnUploadFilesonAzure('file' + vals, filename, 'RFI/' + sessionStorage.getItem('VendorId') + '/' + sessionStorage.getItem('CurrentRFIID'));

            } else {
                nameSplit = $("#spanAttachTc" + vals).html();
            }
        }
        InsertQuestions = InsertQuestions + " select " + sessionStorage.getItem('CurrentRFIID') + "," + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.closest('td').find('input[type="checkbox"]').val()) + ",'" + $.trim(this_row.closest('td').find('textarea').val().replace(/'/g, ' ')) + "','" + nameSplit + "','TC',[PE].FN_Now() union ";
        vals++;
    });

    if (InsertQuestions != '') {
        InsertQuestions = 'Insert into PE.RFX_VR_QuestionAnswers(RFXID,VendorId,QuestionID,Answers,Attachments,QuestFor,CreateDate)' + InsertQuestions;
        InsertQuestions = InsertQuestions.substring(0, InsertQuestions.length - 7);
    }
    //alert(InsertQuery)
    var Tab3Data = {
        "RFXID": parseInt(sessionStorage.getItem('CurrentRFIID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),        
        "InsertQuery": InsertQuestions,
        "IsSuccess": 'TC'

    }
    //alert(JSON.stringify(Tab3Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFXMaster/InsUpdRFXVRTechnicalCapablityAnswers",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab3Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
           // if (data[0].isSuccess == "Y") {
                if(locText == 'SaveExit'){
                    bootbox.alert("The information entered are saved and can be accessed later using same id and password.<br/> Please make sure to submit information before deadline.", function() {
                        window.location = sessionStorage.getItem('MainUrl');

                        return false;
                    });
                }else{
                    return true;
                }
           // }
            //else if (data[0].IsSuccess == 'F') {
            //    $('#form_wizard_1').bootstrapWizard('previous');
            //    $("#spandanger").html("Internal Servor Error");
            //    error.show();
            //    error.fadeOut(5000);

            //}
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
        if (this_row.closest('td').find('input[type="file"]').length > 0){
            if (this_row.closest('td').find('input[type="file"]').val() != '') {
                nameSplit = $.trim(this_row.closest('td').find('input[type="file"]').val().split('\\').slice(-1));

                fileUploaderforQuestions('ECfileToUpload', vals);

            } else {
                nameSplit = $("#spanAttachEc" + vals).html();
            }
        }
        InsertQuestions = InsertQuestions + " select " + sessionStorage.getItem('CurrentRFIID') + "," + sessionStorage.getItem('VendorId') + "," + $.trim(this_row.closest('td').find('input[type="checkbox"]').val()) + ",'" + $.trim(this_row.closest('td').find('textarea').val().replace(/'/g, ' ')) + "','" + nameSplit + "','EC',[PE].FN_Now() union ";
        vals++;
    });

    if (InsertQuestions != '') {
        InsertQuestions = 'Insert into PE.RFX_VR_QuestionAnswers(RFXID,VendorId,QuestionID,Answers,Attachments,QuestFor,CreateDate)' + InsertQuestions;
        InsertQuestions = InsertQuestions.substring(0, InsertQuestions.length - 7);
    }

    //alert(InsertQuery)
    var Tab4Data = {
        "RFXID": parseInt(sessionStorage.getItem('CurrentRFIID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        "InsertQuery": InsertQuestions,
        "IsSuccess": 'EC'
        
    }
    //alert(JSON.stringify(Tab4Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFXMaster/InsUpdRFXVRTechnicalCapablityAnswers",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab4Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
           // if (data[0].isSuccess == "Y") {                
                
                fetchQuestionsForVendors('ExecutionCapabilities');
                fetchQuestionsForVendors('TechnicalCapabilities');
              
                $('#form_wizard_1').hide();
                $(".preview_div").show()
            //}
            // else if (data[0].isSuccess == 'F') {
             //    $("#spandanger").html("Internal Servor Error");
            //    error.show();
            //    error.fadeOut(5000);

            //}
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + + ")");
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

function fileUploaderforQuestions(fileBox,vals) {   
    
    if ($('#' + fileBox + vals).val() != '') {
       
        var fileToUpload = getNameFromPath($('#' + fileBox + vals).val());

    }
    else {
        
        return false;
    }
    
    var urls = 'RFXVRFileAttachment.ashx?AttachmentFor=RFX&RFXID=' + sessionStorage.getItem('CurrentRFIID') + '&VendorID=' + sessionStorage.getItem('VendorId') + '&Vals=' + vals + '&FileBox=' + fileBox;
   
    $.ajaxFileUpload({
        url: urls,
        secureuri: false,
        fileElementId: fileBox + vals,
        dataType: 'json',
        success: function (data, status) {            
            
        },
        error: function (data, status, e) {
            bootbox.alert("Attachment error.");
        }
    });


    return false;

}

function fileUploaderFinanceHeader() {

var fileTerms = $('#file1');

var fileDataTerms = fileTerms.prop("files")[0];



var fileAnyOther = $('#file2');

var fileDataAnyOther = fileAnyOther.prop("files")[0];

var RFIID = sessionStorage.getItem('CurrentRFIID')
var VendorID = sessionStorage.getItem('VendorId')

var formData = new window.FormData();

formData.append("fileTerms", fileDataTerms);

formData.append("fileAnyOther", fileDataAnyOther);

formData.append("AttachmentFor", 'RFI');

formData.append("BidID", RFIID);

formData.append("VendorID", VendorID);



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

        bootbox.alert("Attachment error.");

    }

});

}

function fetchPreCompanydetails() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIMaster/fetchPreCompanydetails/?RFIID=" + sessionStorage.getItem('CurrentRFIID') + "&VendorId=" + sessionStorage.getItem('VendorId'),
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

                
                $('#txtCompanyName').val(data[0].CompanyName);

                $('#txtemailID').val(data[0].CompanyEmail);
                $('#txtContactName').val(data[0].KeyPersonName);
                $('#txtcontactNo').val(data[0].KeyPersonNo);
               


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
}

$('#logOut_btn').attr('href', sessionStorage.getItem(''))

$("#txtcontactEmail").blur(function () {
    if ($("#txtemailID").val() == $("#txtcontactEmail").val()) {
        jQuery('#spandanger').html('Comapny email id should be different from email id used in reverse auction.')
        jQuery('.alert-danger').slideDown('show');
        Metronic.scrollTo(jQuery('.alert-danger'), -200);
        this.value = '';
        this.focus();
        setTimeout(function () {

            jQuery('.alert-danger').css('display', 'none');
        }, 3000);
    }
});

$("#txtcontactAltEmail").blur(function () {
    if ($("#txtemailID").val() == $("#txtcontactAltEmail").val()) {
        jQuery('#spandanger').html('Comapny email id should be different from email id used in reverse auction.')
        jQuery('.alert-danger').slideDown('show');
        Metronic.scrollTo(jQuery('.alert-danger'), -200);
        this.value = '';
        this.focus();
        setTimeout(function () {

            jQuery('.alert-danger').css('display', 'none');
        }, 3000);
    }
});

function hidePrevShowConfig() {

    $('#form_wizard_1').show();
    $(".preview_div").hide()
}

function submitRFXVR() {
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var Data = {
        "RFXID": parseInt(sessionStorage.getItem('CurrentRFIID')),
        "VendorId": parseInt(sessionStorage.getItem('VendorId')),
        "VendorEmail":sessionStorage.getItem('EmailID'),
        "VendorName": sessionStorage.getItem('UserName'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))

    }
    //alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFXMaster/RFXSubmitVR",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            //if (data[0].IsSuccess == "Y") {
                bootbox.alert("RFI response submitted and forwarded to company.", function () {
                    window.location = sessionStorage.getItem('MainUrl');
                    return false;
                });
            //}
            //else if (data[0].IsSuccess == 'F') {
            //    $("#spandanger").html("Internal Servor Error");
            //    error.show();
            //    error.fadeOut(5000);
            //}
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
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