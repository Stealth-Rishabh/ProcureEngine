jQuery(document).ready(function () {
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


    $("#ddlCategoryMultiple").select2({
        placeholder: "Select Category",
        allowClear: true
    });

    Metronic.init();
    Layout.init();

    $('#dropbidType').select2({
        placeholder: "Select Bid Type",
        allowClear: true
    });
    var _RFXID;
    if (window.location.search) {
        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)
        _RFXID = getUrlVarsURL(decryptedstring)["RFXID"];
    }
    fetchCategorymaster()
    if (_RFXID == null) {
        sessionStorage.setItem('CurrentRFXID', 0)
        fetchRFXQuestions('RFI');
    }
    else {
        sessionStorage.setItem('CurrentRFXID', _RFXID)

    }


    FormWizard.init();
    FormValidate();
    ComponentsPickers.init();
    setCommonData();
    fetchMenuItemsFromSession(1, 25);

});
jQuery('#btnpush').click(function (e) {
    jQuery('#approverList > option:selected').appendTo('#mapedapprover');
});
jQuery('#btnpull').click(function (e) {
    jQuery('#mapedapprover > option:selected').appendTo('#mapedapprover');
});

$("#cancelBidBtn").hide();
var error = $('.alert-danger');
var success = $('.alert-success');
var errorModal = $('#errordiv1');
var successModal = $('#successdiv1');
var _vendorDetail;

var form = $('#submit_form');
var FormWizard = function() {

    return {

        init: function() {

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
                    txtRFXSubject: {
                        required: true
                    },
                    txtRFXdeadline: {
                        required: true

                    },
                    txtRFXdescription: {
                        required: true
                    },
                    ddlCategoryMultiple: {
                        required: true
                    },
                    txtattachdescription: {
                        required: function(element) {
                            if ($('#file2').val() != '') {
                                return true
                            } else {
                                return false
                            }
                        }
                    },


                    //Second Tab
                    dropbidType: {
                        required: true
                    },


                    //#3rd Tab
                    txtcompany: {
                        required: true
                    },
                    txtemailId: {
                        required: true,
                        email: true
                    },
                    txtmobileNo: {
                        required: true,
                        number: true,
                        minlength: 10,
                        maxlength: 12
                    },
                    txtcontactPerson: {
                        required: true
                    }



                },

                errorPlacement: function(error, element) {
                    if ((element).attr('name') == 'txtRFXdeadline') {
                        error.insertAfter('.date-picker');
                    }
                    else {
                        error.insertAfter(element);
                    }

                },

                invalidHandler: function(event, validator) {
                },

                highlight: function(element) {
                    $(element).closest('.col-md-3').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-9').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-4').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-7').removeClass('has-success').addClass('has-error');


                },

                unhighlight: function(element) {

                    $(element).closest('.col-md-3').removeClass('has-error');
                    $(element).closest('.col-md-9').removeClass('has-error');
                    $(element).closest('.col-md-4').removeClass('has-error');
                    $(element).closest('.col-md-7').removeClass('has-error');


                },

                success: function(label) {


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
                    $('#form_wizard_1').find('.button-submit').hide();
                    $('#form_wizard_1').find('#submit_vendors').hide();

                    $('#form_wizard_1').find('.button-previous').hide();


                } else {

                    $('#form_wizard_1').find('.button-previous').show();

                }

                
                if (current >= total) {

                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                    $('#form_wizard_1').find('#submit_vendors').show();


                    displayConfirm();

                } else {

                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                    $('#form_wizard_1').find('#submit_vendors').hide();
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
                        if (form.valid() == false) {
                            return false;

                        } else {
                            RFXConfigureTab1()
                            fetchRFXDetailsForPreview()
                            getCategoryWiseVendors($("#ddlCategoryMultiple option:selected").val())
                        }

                    } else if (index == 2) {

                        if (ValidateQuestions() == "false") {
                            return false;
                        }
                        else {
                            RFXConfigureTab2();
                            getRFXQuestionsForPreview();
                            
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
            $('#form_wizard_1').find('#submit_vendors').hide();

            $('#form_wizard_1 #submit_vendors').click(function() {

                if ($('#selectedvendorlists >tbody >tr').length == 0) {                    
                   
                    ValidateVendor()
                 }

                 else {
                
                $('#BidPreviewDiv').show();
                $('#form_wizard_1').hide();
             }

            }).hide();



            //unblock code

        }

    };

} ();

function fileUploader(RFXID,fileObj) {
   
    console.log("fileUploader ==> ", fileObj)

    var formData = new window.FormData();

    formData.append("fileTerms", fileObj);
    formData.append("fileAnyOther", '');
    formData.append("AttachmentFor", 'RFX');
    formData.append("BidID", RFXID);
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

            bootbox.alert("Attachment error.");
            
        }
    
    });

}

function fetchRFXDetails() {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced ='', _selectedCat=new Array();
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFXMaster/fetchRFXPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFXID=" + sessionStorage.getItem('CurrentRFXID') ,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
        
            jQuery('#tblServicesProduct').empty();
            jQuery('#tblTempVendorslist').empty();
            jQuery('#txtRFXSubject').val(StringDecodingMechanism(BidData[0].rfxMaster[0].rfxSubject))
            jQuery('#txtRFXdeadline').val(fnConverToShortDT(BidData[0].rfxMaster[0].rfxDeadline))
            jQuery('#txtRFXdescription').val(StringDecodingMechanism(BidData[0].rfxMaster[0].rfxDescription))
            jQuery('#txtattachdescription').val(BidData[0].rfxMaster[0].rfxAttachmentDescription)
            jQuery('#txtReferenceDetails').val(BidData[0].rfxMaster[0].rfxReference)
            $("#cancelBidBtn").show();
            // jQuery('#attach-file').attr('href', 'PortalDocs/RFX/' + sessionStorage.getItem('CurrentRFXID') + '/' + replaced).html(BidData[0].rfxMaster[0].rfxAttachment)
          
            if (BidData[0].rfxAttachment.length > 0) {
                $("#tblAttachmentsElem").empty();
                for (var i = 0; i < BidData[0].rfxAttachment.length; i++) {
                    replaced = BidData[0].rfxAttachment[i].rfxAttachment.replace(/\s/g, "%20")
                    $("#tblAttachmentsElem").append('<li><div class="inputgroup">' +
                        '<label class="control-label col-md-3">Attachment</label>' +
                        '<div class="col-md-4">' +
                        '<input type="text" class="form-control" placeholder="Attachment Description" tabindex="5" name="txtattachdescription" autocomplete="off" value=' + BidData[0].rfxAttachment[i].rfxAttachmentDescription.replace(/\s/g, "&nbsp;") + ' />' +
                        '</div>' +
                        '<div class="col-md-3">' +
                        '<input type="file" class="form-control"  tabindex="4" onchange="checkfilesize(this)" />' +
                        '<span class="help-block" style=float:left;><a id=attach-file' + (i + 1) + ' href="javascript:;" onclick="DownloadFile(this)"   style="text-decoration: none !important;">' + BidData[0].rfxAttachment[i].rfxAttachment + '</a></span>' +
                       
                        '</div>' +
                        '<div class="col-md-2" style=" padding-left:0px !important; ">' +
                        '<a href="javascript:void(0);" class="btn blue" onclick="addMoreAttachment()"><i class="fa fa-plus"></i></a>' +
                        '</div>' +
                        '</div></li>'
                        );
                }
            }

            if (BidData[0].rfxProductCat.length > 0) {
                for (var i = 0; i < BidData[0].rfxProductCat.length; i++) {
                    _selectedCat.push(BidData[0].rfxProductCat[i].categoryID);
                }
                $("#ddlCategoryMultiple").val(_selectedCat).trigger("change")
                //setTimeout(function () {
                //    $("#ddlCategoryMultiple").select2('val', _selectedCat);
                //}, 1000);
            }
               
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }
    });

    jQuery.unblockUI();

}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'RFI/' + sessionStorage.getItem('CurrentRFXID'));
}
function fetchRFXQuestions(applicableFor) {
 
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var seqCount = 1;
   
    jQuery.ajax({

        type: "GET",
        contentType: "application/json; charset=utf-8",
        
        url: sessionStorage.getItem("APIPath") + "VQMaster/RFIFetchQuestion/?applicableFor=" + applicableFor + "&customerId=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function(data) {
            jQuery("#accordion1").empty();
            
            var QuestionCategoryID = '';
            for (var i = 0; i < data.length; i++) {
               
                if (QuestionCategoryID != data[i].questionCategoryID) {
                    $('#accordion1').append('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion1" href=#collapse' + i + '>' + data[i].questionCategory + '</a></h4></div><div id=collapse' + i + ' class="panel-collapse collapse" seqNo=' + seqCount + '><div class="panel-body"><div class=row><div class=col-lg-11><div class="input-icon" id=searchbox' + i + '><i class="fa fa-search"></i><input type="text" id=search' + i + ' placeholder="Search..." class="form-control" onkeyup="Searchquestion(\'search' + i + '\',\'tblRFXquestions' + i + '\')" /></div></div><div class=col-lg-1><a href="#addNewQuest" class="btn blue" data-toggle="modal" onclick="setCategory(\'' + data[i].questionCategoryID + '\',\'' + data[i].questionCategory + '\')" > Add New</a></div></div><div class=clearfix></div><br/><table class="table table-striped table-bordered table-hover" id=tblRFXquestions' + i + '><thead><tr><th><input type=checkbox id=chkall' + i + ' onclick=clickallchkbox(\'chkall' + i + '\',\'tblRFXquestions' + i + '\') /></th><th>Questions</th><th>Sub Category</th><th>Validation</th><th>Attachment</th></tr></thead></table></div></div>');
                    QuestionCategoryID = data[i].questionCategoryID;
                    seqCount = seqCount + 1;
                    for (var j = 0; j < data.length; j++) {
                        if (QuestionCategoryID == data[j].questionCategoryID && data[j].questionID > 0) {
                            $('#collapse' + i + ' > .panel-body > .table').append('<tr><td><input type="checkbox" class=childchkbox value=' + data[j].questionID + '></td><td>' + data[j].questionDescription + '</td><td>' + data[j].questionSubCategory + '</td><td>' + data[j].mandatory + '</td><td>' + data[j].attachement + '</td></tr>');
                        }
                    }

                }


                if (data[i].questionSubCategory == '') {
                    $('#tblRFXquestions' + i).addClass('display-none');
                    $('#searchbox' + i).addClass('display-none');
                }

            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();
}

function fetchRFXDetailsForTab2(applicableFor) {
    var seqCount = 1;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFXMaster/fetchRFXPendingQuestionsTab2/?RFXID=" + sessionStorage.getItem('CurrentRFXID') + "&customerId=" + sessionStorage.getItem('CustomerID') + "&applicableFor=" + applicableFor,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          
            jQuery("#accordion1").empty();
            var QuestionsubCategoryID = '';
            var QuestionCategoryID = '';
            for (var i = 0; i < data.length; i++) {
                if (QuestionCategoryID != data[i].questionCategoryID) {
                    $('#accordion1').append('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion1" href=#collapse' + i + '>' + data[i].questionCategory + '</a></h4></div><div id=collapse' + i + ' class="panel-collapse collapse" seqNo=' + seqCount + '><div class="panel-body"><div class=row><div class=col-lg-11><div class="input-icon" id=searchbox' + i + '><i class="fa fa-search"></i><input type="text" id=search' + i + ' placeholder="Search..." class="form-control" onkeyup="Searchquestion(\'search' + i + '\',\'tblRFXquestions' + i + '\')" /></div></div><div class=col-lg-1><a href="#addNewQuest" class="btn blue" data-toggle="modal" onclick="setCategory(\'' + data[i].questionCategoryID + '\',\'' + data[i].questionCategory + '\')" > Add New</a></div></div><div class=clearfix></div><br/><table class="table table-striped table-bordered table-hover" id="tblRFXquestions' + i + '"><thead><tr><th><input type=checkbox id=chkall' + i + ' onclick=clickallchkbox(\'chkall' + i + '\',\'tblRFXquestions' + i + '\') /></th><th>Question</th><th>Sub Category</th><th>Validation</th><th>Attachment</th></tr></thead></table></div></div>');
                    QuestionCategoryID = data[i].questionCategoryID;
                    seqCount = seqCount + 1;
                    for (var j = 0; j < data.length; j++) {
                        if (QuestionCategoryID == data[j].questionCategoryID && data[j].questionID !== 0) {
                            if (data[j].flag == 'Checked') {
                                $('#collapse' + i + ' > .panel-body > .table').append('<tr><td><input type="checkbox" class=childchkbox value=' + data[j].questionID + ' checked></td><td>' + data[j].questionDescription + '</td><td>' + data[j].questionSubCategory + '</td><td>' + data[j].mandatory + '</td><td>' + data[j].attachement + '</td></tr>');
                            } else {
                                $('#collapse' + i + ' > .panel-body > .table').append('<tr><td><input type="checkbox" class=childchkbox value=' + data[j].questionID + '></td><td>' + data[j].questionDescription + '</td><td>' + data[j].questionSubCategory + '</td><td>' + data[j].mandatory + '</td><td>' + data[j].attachement + '</td></tr>');

                            }
                        }

                    }
                }


                if (data[i].questionSubCategory == '') {
                    $('#tblRFXquestions' + i).addClass('display-none');
                    $('#searchbox' + i).addClass('display-none');
                }

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }
    });

    jQuery.unblockUI();
}

function RFXConfigureTab1() {
    var _cleanString = StringEncodingMechanism(jQuery("#txtrfqSubject").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtRFXdescription").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var AttachementFileName = '',queryAttachment="", queryCategories="";
    if (($('#attach-file').html() != '') && ($('#file2').val() == '')) {
        
        AttachementFileName = $.trim(jQuery('#attach-file').html());
    } else {
        
        AttachementFileName = ''//jQuery('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1);
    }

    var _categories = $("#ddlCategoryMultiple option:selected").val();
     queryCategories += " insert into PE.RFXProductCat(RFXID,CategoryID)values(" +
            '##RFXID##' + "," + _categories + ")";
    

    $("#tblAttachmentsElem> li").each(function (index) {
        if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {

            AttachementFileName = $.trim($('#attach-file' + (index + 1)).html());
        } else {

            AttachementFileName = $(this).find('input[type=file]').val().split('\\').pop();
        }

        if (AttachementFileName != '') {
            queryAttachment += " insert into PE.RFXAttachment(RFXID,RFXAttachment,RFXAttachmentDescription)values(" +
            '##RFXID##' + ",'" + AttachementFileName + "','" + $.trim($(this).find('input[type=text]').val()) + "')";
        }
        
        
    });

  
    var Tab1Data = {
        "RFXID": parseInt(sessionStorage.getItem('CurrentRFXID')),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        //"RFXSubject": jQuery("#txtRFXSubject").val(),
        "RFXSubject": _cleanString,
        "RFXDeadline": jQuery('#txtRFXdeadline').val(),
        //"RFXDescription": jQuery("#txtRFXdescription").val(),
        "RFXDescription": _cleanString2,
        "RFXAttachmentDescription": 'NA',  
        "RFXAttachment": 'NA',
        "UserId": sessionStorage.getItem('UserID'),
        "AttachmentQuery": queryAttachment,
        "ProductCatQuery": queryCategories,
        "RFXReference": $("#txtReferenceDetails").val()

    };

    console.log(JSON.stringify(Tab1Data))
    jQuery.ajax({

        type: "POST",

        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFXMaster/RFXConfigureTab1",      
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,

        async: false,

        data: JSON.stringify(Tab1Data),

        dataType: "json",

        success: function (data) {
           sessionStorage.setItem('CurrentRFXID', data[0].rfxid);
            $("#tblAttachmentsElem> li").each(function (index) {
                //** Upload Files on Azure PortalDocs folder


                if ($('#file' + index).val() != '' && $('#file' + index).val() != undefined) {
                    filename = jQuery('#file' + index).val().substring(jQuery('#file' + index).val().lastIndexOf('\\') + 1);
                    fnUploadFilesonAzure('file' + index, filename, 'RFI/' + sessionStorage.getItem('CurrentRFXID'));

                }

            });
           
            
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            return false;
            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();

}

function ValidateQuestions() {
    var Status = "false";

    $('.childchkbox').each(function () {
        if (this.checked) {            
            Status = "true";
        }      
    });    
    if (Status == "false") {
        $('#spandanger').html('Please select questions for RFX.!')
        error.show();
        Metronic.scrollTo(error, -200)
        error.fadeOut(5000)       
        Status = "false";
    }
    return Status;
    
}

function RFXConfigureTab2() {
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var InsertQuery = '';
    var UsID = sessionStorage.getItem('UserID')
    $('.childchkbox').each(function () {
        if (this.checked) {
            InsertQuery = InsertQuery + "select " + sessionStorage.getItem('CurrentRFXID') + "," + sessionStorage.getItem('CustomerID') + "," + $(this).val() + ",PE.DECRYPT('" + UsID + "'),PE.FN_Now() union all ";
        }
        else {
            InsertQuery = InsertQuery;
        }
    });

    if (InsertQuery != '') {
        InsertQuery = 'Insert into PE.RFXQuestionMapping(RFXId,CustomerID,QuestionID,MappedBy,MappedOn)' + InsertQuery;
        InsertQuery = InsertQuery.substring(0, InsertQuery.length - 11);
    }
   
    var Tab2Data = {

        "RFXID": parseInt(sessionStorage.getItem('CurrentRFXID')),
        "CustomerID": parseInt( sessionStorage.getItem('CustomerID')),
        "UserId": sessionStorage.getItem('UserID'),
        "RFXQuestionMapping": InsertQuery

    };
    //console.log(JSON.stringify(Tab2Data))
    jQuery.ajax({

        type: "POST",

        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFXMaster/RFXConfigureTab2",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab2Data),
        dataType: "json",
        success: function (data) {
            return true;
           
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" +  + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else{
                $('#form_wizard_1').bootstrapWizard('previous');
                $('.button-submit').hide()
                $('#submit_vendors').hide()
                $('.button-next').show();
                error.show();
                $('#spandanger').html('Server error please try again.!')
                error.fadeOut(3000)
            }
            
            return false;
            jQuery.unblockUI();
        }
       

    });
    jQuery.unblockUI();
}

function fetchTempVendors() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
            
        
        jQuery.ajax({

            type: "GET",

            contentType: "application/json; charset=utf-8",

            url: sessionStorage.getItem("APIPath") + "RFXMaster/RFXFetchTempVendorsTab3/?RFXID=" + sessionStorage.getItem('CurrentRFXID'),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,

            dataType: "json",

            success: function (data) {

            jQuery("#tblTempVendorslist").empty();
            
                    
                if (data.length > 0) {
                    jQuery('#tblTempVendorslist').append('<thead><tr style="background: gray; color: #FFF;"><th>Company</th><th>Email</th><th>Mobile No</th><th>Contact Person</th><th>Actions</th></tr></thead>')
                    
                        
                    for (var i = 0; i < data.length; i++) {

                        jQuery('#tblTempVendorslist').append("<tr><td>" + data[i].companyName + "</td><td>" + data[i].emailId + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].contactPerson + "</td><td><button type=button class='btn default btn-xs blue' onclick='editTempCompany(\"" + data[i].rowid + "\",\"" + data[i].companyName + "\",\"" + data[i].emailId + "\",\"" + data[i].mobileNo + "\",\"" + data[i].contactPerson + "\")'><i class='fa fa-edit' style='margin-top: 0px !important;'></i> Modify</button><button type=button class='btn default btn-xs red' onclick='deleteRFXTempVendors(\"" + data[i].rowid + "\")'><i class='fa fa-times' style='margin-top: 0px !important;'></i> Delete</button></td></tr>");
                        

                    }
                } else {
                jQuery('#tblTempVendorslist').append('<tbody><tr class=display-none><td>No Vendors For RFX</td></tr></tbody>')
                
                }
                    

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', 'submit_form');
                }
                return false;
                jQuery.unblockUI();
            }

        });
       jQuery.unblockUI();

   }

   function checkForDuplicateVendor() {
       var EmailID = '';
       var count = 0;
       
       $("#tblTempVendorslist tr:gt(1)").each(function() {
           EmailID = $.trim($(this).find('td:eq(1)').html())
         
           if (EmailID == $('#txtemailId').val().trim()) {
               count = count + 1
             }
       });
  
       if (count > 1) {
           success.hide();
           $('#spandanger').html('Vendor already exists.')
           error.show();
           Metronic.scrollTo(success, -200);
           error.fadeOut(5000);
           
       } else {
            
            AddTempvendors()
       }                          
       
   }
 
function editTempCompany(RowID, CompanyName, EmailId, MobileNo, ContactPerson) {
    $('#add_comp').text('Modify');
    $('#updateField').val(RowID)
    $('#txtcompany').val(CompanyName);
    $('#txtemailId').val(EmailId);
    $('#txtmobileNo').val(MobileNo);
    $('#txtcontactPerson').val(ContactPerson);
    
}

function deleteRFXTempVendors(RowID) {
 
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var data = {
        'RFXID':parseInt(sessionStorage.getItem('CurrentRFXID')),
        'RowID':RowID
    };
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFXMaster/DeleteTempVendors/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json",
        success: function (data) {

            if (data[0].outmsg == "1") {
                $('.alert-danger').hide(); 
                $('#spansuccess1').html('Vendor Record Deleted.!!');
                $(".alert-success").show();
                $(".alert-success").fadeOut(5000);
                fetchTempVendors();
                Metronic.scrollTo($(".alert-success"), -200);
                
            }
            else {
                $('.alert-success').hide();
                $('#spandanger').html('Vendor Record Cannot Be Deleted.!!')
                $(".alert-danger").show();
                $(".alert-danger").fadeOut(5000);
                Metronic.scrollTo($(".alert-danger"), -200);
               
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
}

function clickallchkbox(chkID, tblID)
{
    var tableID = tblID;
    if ($('#' + chkID).is(':checked')) { // check select status
       
        $('#' + chkID).closest('table').find(":checkbox").prop("checked", true);
    }
    else  {        
        $('#' + chkID).closest('table').find(":checkbox").prop("checked", false);
    }    
}

function Searchquestion(inputID, tblID) {
    jQuery("#" + tblID + ' tr:has(td)').hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#' + inputID).val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#" + tblID + ' tr:has(td)').show();
        return false;
    }

    jQuery("#" + tblID + ' tr:has(td)').children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;
            return true;
        }

    });
}

function FormValidate() {

    $('#addnewQuestionmaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            ddlquestCategory: {
                required: true
            },
            
            txtQuestiondescription: {
                required: true
            }

        },
        messages: {

            ddlquestCategory: {
                required: "Question is required."
            },
            txtQuestiondescription: {
                required: "Question Description is required."
            }
            ,
            txtsubCategory: {
                required: "Please select valid  sub-category. Add new by clicking + button."
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit           
             successModal.hide()
             $('#errormsg').html('You have some errors. Please check below.!');
            errorModal.show();
            errorModal.fadeOut(5000);

        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.col-lg-8').addClass('has-error'); // set error class to the control group
            $(element).closest('.col-lg-7').addClass('has-error'); // set error class to the control group

        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-lg-8').removeClass('has-error'); // set error class to the control group
            $(element)
                .closest('.col-lg-7').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.col-lg-8').removeClass('has-error');
            label.closest('.col-lg-7').removeClass('has-error');
            label.remove();
        },

        submitHandler: function (form) {
            insupdRFXQuestionMaster();
        }
    });

    // Form Validation For Sub Category Modal

    $('#NewSubcategory').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            txtqSubcategory: {
                required: true
            }

        },
        messages: {

            txtqSubcategory: {
                required: "Sub Category is required."
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit             
            successModal.hide()
            $('#errormsg').html('You have some errors. Please check below.!');
            errorModal.show();
            errorModal.fadeOut(5000);

        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.col-lg-8').addClass('has-error'); // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-lg-8').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.col-lg-8').removeClass('has-error');
            label.remove();
        },

        submitHandler: function (form) {
            InsUpdQuestionSubcategory();
        }
    });



}

function setCategory(CategoryID,CategoryDesc) {
    $('#ddlquestCategory').val(CategoryDesc);
    $('#hdnquestCatID').val(CategoryID);
    $('#txtQuestCategory').val(CategoryDesc)
    fetchQuestionSubCategory(CategoryID)
    fetchqsubcategoryForAuto(CategoryID)
}
function fetchqsubcategoryForAuto(questcategoryID) {
    var stats = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/FetchQuestionSubCategory/?QuestionCategoryID=" + questcategoryID + "&Status=N&customerId=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function(data) {
                    
            sessionStorage.setItem('hdnquestionSubCatgry', JSON.stringify(data));
           

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
}
function fetchQuestionSubCategory(questcategoryID) {
    var stats = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/FetchQuestionSubCategory/?QuestionCategoryID=" + questcategoryID + "&Status=E&customerId=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
           
            $('#tblsubcategory').empty();
            if (data.length > 0) {
                $('#searchsubcat').show();
                $('#tblsubcategory').append('<thead><tr><th>Question Category</th><th>Question Sub Category</th><th>Status</th><th>Actions</th></tr></thead>')
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isActive == 'Y') {
                        stats = 'Active'
                    } else {
                        stats = 'Inactive'
                    }
                    $('#tblsubcategory').append('<tr id=rowidID' + i + '><td class="hide">' + data[i].questionSubCategoryID + '</td><td class="hide">' + data[i].questionSubCategory + '</td><td class="hide">' + data[i].isActive + '</td><td>' + $('#ddlquestCategory').val() + '</td><td>' + data[i].questionSubCategory + '</td><td>' + stats + '</td><td><a href=javascript:; class="btn btn-xs blue" onclick="editSubcategory(\'rowidID' + i + '\')"><i class="fa fa-pencil"></i> Edit</a></td></tr>')

                }
            } else {
                $('#searchsubcat').hide();
                return true;
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
}

sessionStorage.setItem('hdnSubCategoryID', '0');
sessionStorage.setItem('hdnquestionSubCatgry', '')
jQuery("#txtsubCategory").keyup(function () {
    sessionStorage.setItem('hdnSubCategoryID', '0');

});

jQuery("#txtsubCategory").blur(function () {
    if (sessionStorage.getItem('hdnSubCategoryID') == '0') {
        $('#txtsubCategory').val('');
        $('#addnewQuestionmaster').validate().element($(this));
    } else {
        return true
    }

});

jQuery("#txtsubCategory").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnquestionSubCatgry');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.questionSubCategory] = username;
            usernames.push(username.questionSubCategory);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].questionSubCategoryID != "0") {
             sessionStorage.setItem('hdnSubCategoryID', map[item].questionSubCategoryID);
        }
        else {
            gritternotification('Please select Sub Category properly!!!');
        }

        return item;
    }

});

function InsUpdQuestionSubcategory() {
    var _cleanString3 = StringEncodingMechanism($('#txtqSubcategory').val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var status = "";
    if (jQuery("#checkboxactive").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }

    var data = {
        "QuestionCategoryID": parseInt($('#hdnquestCatID').val()),
        "QuestionSubCategoryID": parseInt($('#hdnsubCatID').val()),
        //"QuestionSubCategory": $('#txtqSubcategory').val(),
        "QuestionSubCategory": _cleanString3,
        "isActive": status,
        "customerId": parseInt(sessionStorage.getItem('CustomerID'))

    }
  
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/InsUpdQuestionSubCategory",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            
            if (data == "1") {               
                errorModal.hide();
                $("#successmsg").html("Transaction Successful.");
                successModal.show();
                successModal.fadeOut(5000);
                fetchQuestionSubCategory($('#hdnquestCatID').val())
                fetchqsubcategoryForAuto($('#hdnquestCatID').val())

            }
            else if (data == '2') {
                errorModal.hide();
                $("#successmsg").html("Updation Successful.");
                successModal.show();
                successModal.fadeOut(5000);
                fetchQuestionSubCategory($('#hdnquestCatID').val())
                fetchqsubcategoryForAuto($('#hdnquestCatID').val())

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }
    });

    jQuery.unblockUI();
    resetSubcategory();
}

function editSubcategory(RowID) {
    var rowid = $('#' + RowID);
    $('#hdnsubCatID').focus();
    $('#btn-subcat').html('Edit');
    $('#hdnsubCatID').val(rowid.find('td:eq(0)').text());
    $('#txtqSubcategory').val(rowid.find('td:eq(1)').text());
    if (rowid.find('td:eq(2)').text() == 'Y') {
        jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
        jQuery('#checkboxactive').parents('span').addClass('checked');
        
    } else {
    jQuery('input:checkbox[name=checkboxactive]').attr('checked', false);
    jQuery('#checkboxactive').parents('span').removeClass('checked');
       
    }


}

function resetSubcategory() {
    $('#btn-subcat').html('Add');
    $('#hdnsubCatID').val('0');
    $('#txtqSubcategory').val('');
    jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
    jQuery('#checkboxactive').parents('span').addClass('checked');
}

function backtoQuestion() {
    resetSubcategory();
    $('#addnewQuestionmaster').show();
    $('#NewSubcategory').hide();
}


function addnewSubCategory() {
    $('#addnewQuestionmaster').hide();
    $('#NewSubcategory').show();
    $('#txtsubCategory').val('');
}

var mandatory = 'N';
function mandatoryChange() {
    if ($('#ddlmandatory').val() == '') {
        mandatory = 'N';
    } else {
        mandatory = $('#ddlmandatory option:selected').val();
    }

}
if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
}
function insupdRFXQuestionMaster() {
    var _cleanString4 = StringEncodingMechanism($('#txtQuestiondescription').val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";
    if (jQuery("#chkattachment").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }

    var data = {
        "QuestionCategoryID": parseInt($('#hdnquestCatID').val()),
        "QuestionSubCategoryID": parseInt(sessionStorage.getItem("hdnSubCategoryID")),
        //"QuestionDescription": $('#txtQuestiondescription').val(),
        "QuestionDescription": _cleanString4,
        "Mandatory": mandatory,
        "Attachement": status,
        "QuestionID": 0,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "QuestionApplicableFor": 'RFI'

    }

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/InsUpdQuestionMaster",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          
            if (data == "1") {                
                errorModal.hide();
                $("#successmsg").html("Transaction Successful.");
                successModal.show();                
                successModal.fadeOut(5000);
                if (typeof getUrlVarsURL(decryptedstring)["RFXID"] == 'undefined') {
                     fetchRFXQuestions('RFI');
                } else { 
                    
                    fetchRFXDetailsForTab2('RFI');
                }
                
            }
            else if (data == '2') {
                errorModal.hide();
                $("#success").html("Updation Successfull...");
                successModal.show();
                fetchRFXQuestions('RFI')
                successModal.fadeOut(5000);

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }
        
    });
    resetRFXQuestionmaster();
    jQuery.unblockUI();


}
function resetRFXQuestionmaster() {
    $('#submitbtnmaster').text('Submit');
    sessionStorage.setItem('hdnSubCategoryID', '0');    
    $('#ddlmandatory').val('');
    $('#txtsubCategory').val('')
    $('#txtQuestiondescription').val('')
    jQuery('input:checkbox[name=chkattachment]').attr('checked', false);
    jQuery('#chkattachment').parents('span').removeClass('checked');
    $('addNewQuest').modal("hide");

}

$('#addNewQuest').on('hidden.bs.modal', function () {
    $('#addnewQuestionmaster').show();
    $('#NewSubcategory').hide();
    resetRFXQuestionmaster();
    resetSubcategory()
    
    $("#addnewQuestionmaster").validate().resetForm();

});

jQuery("#searchPop-up").keyup(function () {

    jQuery("#tblsubcategory tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#searchPop-up').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblsubcategory tr:has(td)").show();
        return false;
    }

    jQuery("#tblsubcategory tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});


// For Bid Preview

function fetchRFXDetailsForPreview() {
   
    var AttachementFileName = '',_productCat, _txtCategories=[];

    jQuery('#txtRFXSubjectPrev').html($('#txtRFXSubject').val())
    jQuery('#txtRFXdeadlinePrev').html($('#txtRFXdeadline').val())
    jQuery('#txtRFXdescriptionPrev').html($('#txtRFXdescription').val())
    jQuery('#txtReferenceDetailsPrev').html($('#txtReferenceDetails').val())
    _productCat = $("#ddlCategoryMultiple");
    for (var i = 0; i < _productCat[0].selectedOptions.length; i++) {
        _txtCategories += _productCat[0].selectedOptions[i].label + ', ';
    }
    
    _txtCategories = _txtCategories.substring(0, _txtCategories.length - 2);
    jQuery("#productCatPrev").html(_txtCategories);
                                               
    var ptTbl = '';
    $("#tblAttachmentsElemPrev").empty();
    $("#tblAttachmentsElem> li").each(function (index) {
        if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {
            ptTbl = $(this);
            $("#tblAttachmentsElemPrev").append('<li><div class="col-md-8" style=padding-left:0px;>' +
                 '<p class="form-control-static">' + ptTbl.find('input[type=text]').val() + '</p>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<p class="form-control-static"><a id=RFIFilePrev' + (index + 1) + ' href="javascript:;" onclick="DownloadFile(this)" style="text-decoration: none !important;">' + $('#attach-file' + (index + 1)).html() + '</a></p>' +
                '</div></li>');
           
            
        } else {
            ptTbl = $(this);
            AttachementFileName = $(this).find('input[type=file]').val().split('\\').pop();
            $("#tblAttachmentsElemPrev").append('<li><div class="col-md-8" style=padding-left:0px;>' +
                 '<p class="form-control-static">' + ptTbl.find('input[type=text]').val() + '</p>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<p class="form-control-static"><a id=RFIFilePrev' + (index + 1) + '  href="javascript:;" onclick="DownloadFile(this)" style="text-decoration: none !important;">' + AttachementFileName + '</a></p>' +
                '</div></li>');

        }
        
    });

}

$('#back_prev_btn').click(function() {
    $('#BidPreviewDiv').hide();
    $('#form_wizard_1').show();
});


function getRFXQuestionsForPreview() {
    var panelheadID = '';
    var i = 0;
    var _pannel_head = '';
    $('#wrap_scrollerPrev').empty();
    $('.childchkbox:checked').each(function(index) {
    

    switch ($(this).closest('.panel-collapse').attr('seqNo')) {
            case '1':
                _pannel_head = 'Technical Capabilities'
                break;
            case '2':
                _pannel_head = 'Execution Capabilities'
                break;
            case '3':
                _pannel_head = 'Company Capabilities'
                break;
            case '4':
                _pannel_head = 'Technical Information'
                break;
            default:
                _pannel_head = ''
        }

        if (panelheadID != $(this).closest('.panel-collapse').attr('id')) {
            i = i + 1;
            $('#wrap_scrollerPrev').append('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">' + _pannel_head + '</h3></div><div class="panel-body"><table class="table table-bordered" id=Prev_pannel' + i + '><thead><th>Question</th><th>Sub Category</th><th>Validation</th><th>Attachment</th></thead><tbody></tbody></table></div></div>')
            panelheadID = $(this).closest('.panel-collapse').attr('id');
        }
        
        if (panelheadID == $(this).closest('.panel-collapse').attr('id')) {
            
            $('#Prev_pannel' + i + ' > tbody').append('<tr><td>' + $('td:eq(1)', $(this).parents('tr')).html() + '</td><td>' + $('td:eq(2)', $(this).parents('tr')).html() + '</td><td>' + $('td:eq(3)', $(this).parents('tr')).html() + '</td><td>' + $('td:eq(4)', $(this).parents('tr')).html() + '</td></tr></table>')

        }
        
    });


}

function getVendorsForPreview() {

    jQuery("#tblTempVendorslistPrev").empty();
    
    jQuery('#tblTempVendorslistPrev').append('<thead><tr style="background: gray; color: #FFF;"><th>Company</th><th>Email</th><th>Mobile No</th><th>Contact Person</th></tr></thead>')
    for (var i = 0; i < jQuery('#tblTempVendorslist > tbody > tr').length; i++) {
        jQuery('#tblTempVendorslistPrev').append("<tr><td>" + jQuery('#tblTempVendorslist > tbody > tr:eq(' + i + ')').find('td:eq(0)').html() + "</td><td>" + jQuery('#tblTempVendorslist > tbody > tr:eq(' + i + ')').find('td:eq(1)').html() + "</td><td>" + jQuery('#tblTempVendorslist > tbody > tr:eq(' + i + ')').find('td:eq(2)').html() + "</td><td>" + jQuery('#tblTempVendorslist > tbody > tr:eq(' + i + ')').find('td:eq(3)').html() + "</td></tr>");
     }
}

var _count = 0;
function addMoreAttachment() {
    _count = ($("#tblAttachmentsElem > li").length+1);
    console.log("count ==> ", _count);
    $("#tblAttachmentsElem").append('<li><div class="inputgroup">' +
        '<label class="control-label col-md-3">Attachment</label>'+
        '<div class="col-md-4">'+
        '<input type="text" class="form-control" placeholder="Attachment Description" id="txtattachdescription" tabindex="5" name="txtattachdescription" autocomplete="off" />'+
        '</div>'+
        '<div class="col-md-3">'+
        '<input type="file" class="form-control"  tabindex="4" onchange="checkfilesizeMultiple(this)" />' +
        '<span class="help-block"><a id=attach-file'+_count+' href="javascript:;" style="text-decoration: none !important;"></a></span>'+
        '</div>'+
        '<div class="col-md-2" style=" padding-left:0px !important; ">'+
        '<a href="javascript:void(0);" class="btn blue" onclick="addMoreAttachment()"><i class="fa fa-plus"></i></a>'+
        '</div>'+
        '</div></li>'
        );
}


function fetchVendorDetail() {
  
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFXMaster/fetchVendorDetails/?customerId=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                _vendorDetail = data;
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'submit_form');
            }
            return false;
            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
    
}

jQuery("#txtcompany").typeahead({
    source: function (query, process) {
        var data = _vendorDetail;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.VendorName] = username;
            usernames.push(username.VendorName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {

        return item;
    }

});


function fetchCategorymaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=M&MappedBy=" + sessionStorage.getItem('UserID') + "&ChildId=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlCategoryMultiple").empty();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCategoryMultiple").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }
                jQuery("#ddlCategoryMultiple").trigger("change");
                if (sessionStorage.getItem('CurrentRFXID') != "0") {
                    setTimeout(function () {
                        fetchRFXDetails();
                        fetchRFXDetailsForTab2('RFI');
                    }, 1000)
                }
            }
            else {
                jQuery("#ddlCategoryMultiple").append('<tr><td>No categories found..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                alert("error");
            } 
            return false;
            jQuery.unblockUI();
        }
        
    });
}

function ajaxFileDelete(closeBtn, filePath) {
    console.log("vicky ==> ", closeBtn,", filePAth ==> ",  filePath)
    jQuery(document).ajaxStart(jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" /> Please Wait...</h5>' })).ajaxStop(jQuery.unblockUI);
  
    var formData = new window.FormData();
    formData.append("Path", filePath);

    $.ajax({

        url: 'ConfigureFileAttachment.ashx',

        data: formData,

        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function (data) {
           
            fileDeletefromdb(closeBtn, filePath);
           
        },

        error: function () {

            bootbox.alert("Attachment error.");

        }

    });




    jQuery.unblockUI();

}

function fileDeletefromdb(closeBtn, filepath) {

    closeBtn.remove();
   
    var BidData = {

        "BidId": 0,
        "BidTypeID": 0,
        "UserId": sessionStorage.getItem('UserID'),
        "RFQRFXID": sessionStorage.getItem('CurrentRFXID'),
        "RFXRFQType": 'RFX'
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


function getCategoryWiseVendors(categoryID) {
   
    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorCategoryWise/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&CategoryID=" + categoryID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
          
            $("#tblvendorlist > tbody").empty();
            var vName = '';
            for (var i = 0; i < data.length; i++) {
                vName = data[i].vendorName;
                var str = "<tr><td class='hide'>" + data[i].vendorID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].vendorID + "'\,\'" + data[i].emailid + "'\)\"; id=\"chkvender" + data[i].vendorID + "\" value=" + data[i].vendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].vendorName + " </td><td class='hide'>"+data[i].emailid+"</td></tr>";
                $('#tblvendorlist > tbody').append(str);

            }
           
            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {
                    console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()))
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")

                });
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

function removevendor(trid, chkid, Prevtrid) {
    vCount = vCount - 1;

    $('#' + trid.id).remove()
    $('#' + Prevtrid.id).remove()
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

var status;

function ValidateVendor() {

    status = "false";

    var i = 0;

    $('#divvendorlist').find('span#spandynamic').hide();

    if ($("#selectedvendorlists > tbody > tr").length > 0) {
        $("#selectedvendorlists> tbody > tr").each(function (index) {

            i = i + 1;
            if (i >= 1) {

                status = "True";
            }
            else {
                status == "false";
            }

        });
    } else {
        $("#tblvendorlist> tbody > tr").each(function (index) {

            if ($(this).find("span#spanchecked").attr('class') == 'checked') {
                i = i + 1;
                if (i >= 1) {

                    status = "True";
                }
                else {
                    status == "false";
                }

            }

        });
    }



    if (status == "false") {

        $('.alert-danger').show();
        $('#spandanger').html('Please select atleast one vendor');
        Metronic.scrollTo($('.alert-danger'), -200);
        $('.alert-danger').fadeOut(5000);
        $('table#tblvendorlist').closest('.inputgroup').addClass('has-error');

        status = "false";

    }

    return status;

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
            var emailId = $.trim($(this).find('td:eq(3)').html())
            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorid + ',' + 'chkvender' + vendorid + ',SelecetedVendorPrev' + vendorid + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td>' + emailId + '</td></tr>')

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

function Check(event, vname, vendorID, emailId) {

    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {

        $(event).closest("span#spanchecked").removeClass("checked")

    }

    else {
        vCount = vCount + 1;
        var EvID = event.id;
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")
        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',' + EvID + ',SelecetedVendorPrev' + vendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td class=hide>'+emailId+'</td></tr>')
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

function RFXSubmitTempVendors() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    var InsertQuery = '';
    $("#selectedvendorlistsPrev> tbody > tr").each(function(index) {
        InsertQuery = InsertQuery + " Insert into PE.VQRFIVendorDetails(VQRFIId,EmailId,VendorId,LinkURL,DeadlineDT,RFIVQStatus,EntryDT,Version) values('RFI-" + sessionStorage.getItem('CurrentRFXID') + "','" + $.trim($(this).find('td:eq(2)').html()) + "'," + $.trim($(this).find('td:eq(0)').html()) + ",'RFXVendor.html?RFIID=" + sessionStorage.getItem('CurrentRFXID') + "',CONVERT(DATE,'" + $("#txtRFXdeadline").val() + "',103),'N',getDate(),0) ";
    });
    if (InsertQuery == '') {
        InsertQuery = "Print 1";
    }
   
    var TempVendors = {
        "VendorDetails": InsertQuery,
        "RFXID": parseInt(sessionStorage.getItem('CurrentRFXID'))
    };
    $.ajax({
        url: sessionStorage.getItem("APIPath") + "RFXMaster/ConfigureRFXTab3",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(TempVendors),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
           
            if (data[0].outMsg == "1") {
               
                $('#BidPreviewDiv').show();
                $('#form_wizard_1').hide();

            }
            else {
                $('.alert-success').hide();
                $('#spandanger').html('Please re-select vendors.!!')
                $(".alert-danger").show();
                $(".alert-danger").fadeOut(5000);
                Metronic.scrollTo($(".alert-danger"), -200);

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

function RFXInsUpdConfigurationSubmit() {
    var _cleanString5 = StringEncodingMechanism($("#txtRFXSubject").val());
    var _cleanString6 = StringEncodingMechanism($('#txtRFXdescription').val());
  
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (form.valid() == true) {
        
        var TempCompany = {
            'RFXID': parseInt(sessionStorage.getItem('CurrentRFXID')),
            //'SubjectRFX': $("#txtRFXSubject").val(),
            'SubjectRFX': _cleanString5,
            'CustomerId': parseInt(sessionStorage.getItem('CustomerID')),
            //'RFXDescription': $('#txtRFXdescription').val(),
            'RFXDescription': _cleanString6,
            'RFXDeadline': $('#txtRFXdeadline').val(),
            'UserId': sessionStorage.getItem('UserID')
            
        };
      
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "RFXMaster/RFXInsUpdConfigurationSubmit",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,

            async: false,
            data: JSON.stringify(TempCompany),
            dataType: "json",

            success: function (data) {

                jQuery.unblockUI();
                //if (data[0].outMsg == '1') {
                    bootbox.alert("RFI submitted successfully.", function () {
                        window.location = sessionStorage.getItem("HomePage")
                        return false;
                    });   

                //}
                
                
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" +  + ")");
                if (xhr.status === 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', 'submit_form');
                }
                return false;
                jQuery.unblockUI();
            }

        });



    } else {
        form.validate();
        jQuery.unblockUI();
        return false;
    }

}