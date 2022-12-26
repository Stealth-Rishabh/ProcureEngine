var _VQID;
jQuery(document).ready(function () {
   // Pageloaded()
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
   

    $("#ddlCategoryMultiple").select2();

    Metronic.init();
    Layout.init();



    if (window.location.search) {

        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)
        _VQID = getUrlVarsURL(decryptedstring)["VQID"];
    }

    if (_VQID == null || _VQID == undefined) {

        sessionStorage.setItem('CurrentVQID', 0)
        sessionStorage.setItem('_savedDraft', 'N')
        fetchRFIQuestions('VQL');
       
    }
    else {

        sessionStorage.setItem('CurrentVQID', _VQID)
        sessionStorage.setItem('_savedDraft', 'Y')
        fetchRFIDetailsForTab2('VQL');
        
    }

    fetchCategorymaster();

    fetchVendorDetail();
    FormWizard.init();
    FormValidate();
    ComponentsPickers.init();
    setCommonData();
    fetchMenuItemsFromSession(1, 25);

});

function cancelbid() {

    CancelBidDuringConfig(_VQID, 'VQ');
}

// bug 584 abheedev 
$('#txtmobileNo').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
$("#cancelBidBtn").hide();
var error = $('.alert-danger');
var success = $('.alert-success');
var errorModal = $('#errordiv1');
var successModal = $('#successdiv1');
var _vendorDetail;

var form = $('#submit_form');
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
                    txtrfiSubject: {
                        required: true
                    },
                    txtrfideadline: {
                        required: true

                    },
                    txtrfidescription: {
                        required: true
                    },
                    ddlCategoryMultiple: {
                        required: true
                    },
                    txtattachdescription: {
                        required: function (element) {
                            
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

                errorPlacement: function (error, element) {
                    if ((element).attr('name') == 'txtrfideadline') {
                        error.insertAfter('.date-picker');
                    }
                    else {
                        error.insertAfter(element);
                    }

                },

                invalidHandler: function (event, validator) {
                },

                highlight: function (element) {
                    $(element).closest('.col-md-3').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-9').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-4').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-7').removeClass('has-success').addClass('has-error');


                },

                unhighlight: function (element) {

                    $(element).closest('.col-md-3').removeClass('has-error');
                    $(element).closest('.col-md-9').removeClass('has-error');
                    $(element).closest('.col-md-4').removeClass('has-error');
                    $(element).closest('.col-md-7').removeClass('has-error');


                },

                success: function (label) {


                },
                submitHandler: function (form) {
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
                            RFIConfigureTab1()
                            fetchRFIDetailsForPreview()

                        }

                    } else if (index == 2) {

                        if (ValidateQuestions() == "false") {
                            return false;
                        }
                        else {
                            RFIConfigureTab2();
                            getRFIQuestionsForPreview();
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
            $('#form_wizard_1').find('.button-submit').hide();
            $('#form_wizard_1').find('#submit_vendors').hide();

            $('#form_wizard_1 #submit_vendors').click(function () {

                if ($('#tblTempVendorslist >tbody >tr').length == 0) {
                    error.show();
                    $('#spandanger').html('Please Enter Vendors For RFI..')
                    error.fadeOut(3000)
                    return false;

                }

                else {
                    getVendorsForPreview()
                    $('#BidPreviewDiv').show();
                    $('#form_wizard_1').hide();
                }

            }).hide();



            //unblock code

        }

    };

}();

function fileUploader(RFIID, fileObj) {

    console.log("fileUploader ==> ", fileObj)

    var formData = new window.FormData();

    formData.append("fileTerms", fileObj);
    formData.append("fileAnyOther", '');
    formData.append("AttachmentFor", 'RFI');
    formData.append("BidID", RFIID);
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


function fetchRFIDetails() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced = '', _selectedCat = new Array();

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VQID=" + sessionStorage.getItem('CurrentVQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            
            if (BidData.length > 0) {
              
                jQuery('#tblServicesProduct').empty();
                jQuery('#tblTempVendorslist').empty();
                jQuery('#txtrfiSubject').val(StringDecodingMechanism(BidData[0].vqMaster[0].vqSubject))
                jQuery('#txtrfideadline').val(BidData[0].vqMaster[0].vqDeadline)
                jQuery('#txtrfidescription').val(StringDecodingMechanism(BidData[0].vqMaster[0].vqDescription))
                jQuery('#txtattachdescription').val(BidData[0].vqMaster[0].vqAttachmentDescription)

                $("#cancelBidBtn").show();

                if (BidData[0].vqAttachment.length > 0) {
                    $("#tblAttachmentsElem").empty();
                    for (var i = 0; i < BidData[0].vqAttachment.length; i++) {
                        replaced = BidData[0].vqAttachment[i].vqAttachment.replace(/\s/g, "%20")
                        $("#tblAttachmentsElem").append('<li><div class="inputgroup">' +
                            '<label class="control-label col-md-3">Attachment</label>' +
                            '<div class="col-md-4">' +
                            '<input type="text" class="form-control" placeholder="Attachment Description" tabindex="5" name="txtattachdescription" autocomplete="off" value=' + BidData[0].vqAttachment[i].vqAttachmentDescription.replace(/\s/g, "&nbsp;") + ' />' +
                            '</div>' +
                            '<div class="col-md-3">' +
                            '<input type="file" id=file' + (i + 1) + ' class="form-control"  tabindex="4" onchange="checkfilesize(this)" />' +
                            '<span class="help-block" style=float:left;><a id=attach-file' + (i + 1) + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + BidData[0].vqAttachment[i].vqAttachment + '</a></span>' +

                            '</div>' +
                            '<div class="col-md-2" style=" padding-left:0px !important; ">' +
                            '<a href="javascript:void(0);" class="btn btn-sm blue" onclick="addMoreAttachment()"><i class="fa fa-plus"></i></a>' +
                            '</div>' +
                            '</div></li>'
                        );
                    }
                }

                if (BidData[0].vqProductCat.length > 0) {
                    for (var i = 0; i < BidData[0].vqProductCat.length; i++) {
                        _selectedCat.push(BidData[0].vqProductCat[i].categoryID);
                    }
                    $("#ddlCategoryMultiple").select2('val', _selectedCat).trigger("change");


                }
              
                if (BidData[0].tempVendors.length > 0) {
                    
                    jQuery('#tblTempVendorslist').append('<thead><tr style="background: gray; color: #FFF;"><th>Company</th><th>Email</th><th>Mobile No</th><th>Contact Person</th><th>Actions</th></tr></thead>')
                   
                    for (var i = 0; i < BidData[0].tempVendors.length; i++) {
                        jQuery('#tblTempVendorslist').append("<tr><td>" + BidData[0].tempVendors[i].companyName + "</td><td>" + BidData[0].tempVendors[i].emailId + "</td><td>" + BidData[0].tempVendors[i].mobileNo + "</td><td>" + BidData[0].tempVendors[i].contactPerson + "</td><td><button type=button class='btn default btn-xs blue' onclick='editTempCompany(\"" + BidData[0].tempVendors[i].rowID + "\",\"" + BidData[0].tempVendors[i].companyName + "\",\"" + BidData[0].tempVendors[i].emailId + "\",\"" + BidData[0].tempVendors[i].mobileNo + "\",\"" + BidData[0].tempVendors[i].contactPerson + "\")'><i class='fa fa-edit' style='margin-top: 0px !important;'></i> Modify</button><button type=button class='btn default btn-xs red' onclick='deleteRFITempVendors(\"" + BidData[0].tempVendors[i].rowID + "\")'><i class='fa fa-times' style='margin-top: 0px !important;'></i> Delete</button></td></tr>");
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
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'VQ/' + sessionStorage.getItem('CurrentVQID'));
}
function fetchRFIQuestions(applicableFor) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var seqCount = 1;
    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "VQMaster/RFIFetchQuestion/?applicableFor=" + applicableFor + "&customerId=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#accordion1").empty();

            var QuestionCategoryID = '';
            for (var i = 0; i < data.length; i++) {
                if (QuestionCategoryID != data[i].questionCategoryID) {
                    $('#accordion1').append('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion1" href=#collapse' + i + '>' + data[i].questionCategory + '</a></h4></div><div id=collapse' + i + ' class="panel-collapse collapse" seqNo=' + seqCount + '><div class="panel-body"><div class=row><div class=col-lg-11><div class="input-icon" id=searchbox' + i + '><i class="fa fa-search"></i><input type="text" id=search' + i + ' placeholder="Search..." class="form-control" onkeyup="Searchquestion(\'search' + i + '\',\'tblrfiquestions' + i + '\')" /></div></div><div class=col-lg-1><a href="#addNewQuest" class="btn blue" data-toggle="modal" onclick="setCategory(\'' + data[i].questionCategoryID + '\',\'' + data[i].questionCategory + '\')" > Add New</a></div></div><div class=clearfix></div><br/><table class="table table-striped table-bordered table-hover" id=tblrfiquestions' + i + '><thead><tr><th><input type=checkbox id=chkall' + i + ' onclick=clickallchkbox(\'chkall' + i + '\',\'tblrfiquestions' + i + '\') /></th><th>Questions</th><th>Sub Category</th><th>Validation</th><th>Attachment</th></tr></thead></table></div></div>');
                    QuestionCategoryID = data[i].questionCategoryID;
                    seqCount = seqCount + 1;
                    for (var j = 0; j < data.length; j++) {
                        if (QuestionCategoryID == data[j].questionCategoryID && data[j].questionID > 0) {
                            $('#collapse' + i + ' > .panel-body > .table').append('<tr><td><input type="checkbox" class=childchkbox value=' + data[j].questionID + '></td><td>' + data[j].questionDescription + '</td><td>' + data[j].questionSubCategory + '</td><td>' + data[j].mandatory + '</td><td>' + data[j].attachement + '</td></tr>');
                        }
                    }

                }


                if (data[i].questionSubCategory == '') {
                    $('#tblrfiquestions' + i).addClass('display-none');
                    $('#searchbox' + i).addClass('display-none');
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


function fetchRFIDetailsForTab2(applicableFor) {
    var seqCount = 1;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/fetchRFIPendingQuestionsTab2/?VQID=" + sessionStorage.getItem('CurrentVQID') + "&customerId=" + sessionStorage.getItem('CustomerID') + "&applicableFor=" + applicableFor,
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
                    $('#accordion1').append('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion1" href=#collapse' + i + '>' + data[i].questionCategory + '</a></h4></div><div id=collapse' + i + ' class="panel-collapse collapse" seqNo=' + seqCount + '><div class="panel-body"><div class=row><div class=col-lg-11><div class="input-icon" id=searchbox' + i + '><i class="fa fa-search"></i><input type="text" id=search' + i + ' placeholder="Search..." class="form-control" onkeyup="Searchquestion(\'search' + i + '\',\'tblrfiquestions' + i + '\')" /></div></div><div class=col-lg-1><a href="#addNewQuest" class="btn blue" data-toggle="modal" onclick="setCategory(\'' + data[i].questionCategoryID + '\',\'' + data[i].questionCategory + '\')" > Add New</a></div></div><div class=clearfix></div><br/><table class="table table-striped table-bordered table-hover" id="tblrfiquestions' + i + '"><thead><tr><th><input type=checkbox id=chkall' + i + ' onclick=clickallchkbox(\'chkall' + i + '\',\'tblrfiquestions' + i + '\') /></th><th>Question</th><th>Sub Category</th><th>Validation</th><th>Attachment</th></tr></thead></table></div></div>');
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
                    $('#tblrfiquestions' + i).addClass('display-none');
                    $('#searchbox' + i).addClass('display-none');
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

function RFIConfigureTab1() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var AttachementFileName = '', queryAttachment = "", queryCategories = ""; filename = "";
    if ($('#attach-file').html() != '') {

        AttachementFileName = $.trim(jQuery('#attach-file').html());
    } else {

        AttachementFileName = 'Print 1'
    }

    var _categories = $("#ddlCategoryMultiple").val();


    for (var i = 0; i < _categories.length; i++) {
        queryCategories += " insert into PE.VQProductCat(VQID,CategoryID)values(" +
            '##VQID##' + "," + _categories[i] + ")";
    }

    $("#tblAttachmentsElem> li").each(function (index) {
        if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {

            AttachementFileName = $.trim($('#attach-file' + (index + 1)).html());
        } else {

            AttachementFileName = $(this).find('input[type=file]').val().split('\\').pop();
        }

        if (AttachementFileName != '') {
            queryAttachment += " insert into PE.VQAttachment(VQID,VQAttachment,VQAttachmentDescription)values(" +
                '##VQID##' + ",'" + AttachementFileName + "','" + $.trim($(this).find('input[type=text]').val()) + "')";
        }

    });
    var _cleanString = StringEncodingMechanism(jQuery("#txtrfiSubject").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtrfidescription").val());

    var Tab1Data = {

        "VQID": parseInt(sessionStorage.getItem('CurrentVQID')),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        //"VQSubject": jQuery("#txtrfiSubject").val(),
        "VQSubject": _cleanString,
        "VQDeadline": jQuery("#txtrfideadline").val(),
        //"VQDescription": jQuery("#txtrfidescription").val(),
        "VQDescription": _cleanString2,
        "VQAttachment": 'NA',
        "VQAttachmentDescription": 'NA',
        "UserId": sessionStorage.getItem('UserID'),
        "AttachmentQuery": queryAttachment,
        "ProductCatQuery": queryCategories

    };

    jQuery.ajax({

        type: "POST",

        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/VQConfigureTab1",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,

        async: false,
        data: JSON.stringify(Tab1Data),
        dataType: "json",

        success: function (data) {

            $("#tblAttachmentsElem> li").each(function (index) {
                //** Upload Files on Azure PortalDocs folder


                if ($('#file' + index).val() != '' && $('#file' + index).val() != undefined) {
                    filename = jQuery('#file' + index).val().substring(jQuery('#file' + index).val().lastIndexOf('\\') + 1);
                    fnUploadFilesonAzure('file' + index, filename, 'VQ/' + sessionStorage.getItem('CurrentVQID'));

                }

            });

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
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
        $('#spandanger').html('Please select questions for VQ.!')
        error.show();
        Metronic.scrollTo(error, -200)
        error.fadeOut(5000)
        Status = "false";
    }
    return Status;

}

function RFIConfigureTab2() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var InsertQuery = '';
    var UsID = sessionStorage.getItem('UserID')
    $('.childchkbox').each(function () {
        if (this.checked) {
            InsertQuery = InsertQuery + "select " + sessionStorage.getItem('CurrentVQID') + "," + sessionStorage.getItem('CustomerID') + "," + $(this).val() + ",PE.DECRYPT('" + UsID + "'),PE.FN_Now() union all ";
        }
        else {
            InsertQuery = InsertQuery;
        }
    });

    if (InsertQuery != '') {
        InsertQuery = 'Insert into PE.VQQuestionMapping(VQID,CustomerID,QuestionID,MappedBy,MappedOn)' + InsertQuery;
        InsertQuery = InsertQuery.substring(0, InsertQuery.length - 11);
    }
    var Tab2Data = {

        "VQID": parseInt(sessionStorage.getItem('CurrentVQID')),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserId": sessionStorage.getItem('UserID'),
        "RFIQuestionMapping": InsertQuery

    };

    jQuery.ajax({

        type: "POST",

        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/RfiConfigureTab2",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,

        async: false,

        data: JSON.stringify(Tab2Data),

        dataType: "json",

        success: function (data) {

            return true;
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {

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

        url: sessionStorage.getItem("APIPath") + "VQMaster/VQFetchTempVendorsTab3/?VQID=" + sessionStorage.getItem('CurrentVQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
            debugger
            jQuery("#tblTempVendorslist").empty();
            if (data.length > 0) {
                jQuery('#tblTempVendorslist').append('<thead><tr style="background: gray; color: #FFF;"><th>Company</th><th>Email</th><th>Mobile No</th><th>Contact Person</th><th>Actions</th></tr></thead>')
                for (var i = 0; i < data.length; i++) {
                    jQuery('#tblTempVendorslist').append("<tr><td>" + data[i].companyName + "</td><td>" + data[i].emailId + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].contactPerson + "</td><td><button type=button class='btn default btn-xs blue' onclick='editTempCompany(\"" + data[i].rowID + "\",\"" + data[i].companyName + "\",\"" + data[i].emailId + "\",\"" + data[i].mobileNo + "\",\"" + data[i].contactPerson + "\")'><i class='fa fa-edit' style='margin-top: 0px !important;'></i> Modify</button><button type=button class='btn default btn-xs red' onclick='deleteRFITempVendors(\"" + data[i].rowid + "\")'><i class='fa fa-times' style='margin-top: 0px !important;'></i> Delete</button></td></tr>");

                }
            }
            else {
                jQuery('#tblTempVendorslist').append('<tbody><tr class=display-none><td>No Vendors For RFI</td></tr></tbody>')

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

function checkForDuplicateVendor() {
    debugger
    var EmailID = '';
    var count = 0;

    $("#tblTempVendorslist tr:gt(1)").each(function () {
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

function AddTempvendors() {
    debugger
    var _cleanString3 = StringEncodingMechanism($('#txtcompany').val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (form.valid() == true) {

        var TempCompany = {
            'VQID': parseInt(sessionStorage.getItem('CurrentVQID')),
            //'CompanyName': $('#txtcompany').val(),
            'CompanyName': _cleanString3,
            'EmailId': $('#txtemailId').val(),
            'MobileNo': $('#txtmobileNo').val(),
            'ContactPerson': $('#txtcontactPerson').val(),
            'VQDeadline': $('#txtrfideadline').val(),
            'UserId': sessionStorage.getItem('UserID'),
            'RowID': parseInt($('#updateField').val())

        };

        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VQMaster/VQConfigureTempVendorsTab3",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,

            data: JSON.stringify(TempCompany),

            dataType: "json",

            success: function (data) {

                $('#txtcompany').val('');
                $('#txtemailId').val('');
                $('#txtmobileNo').val('');
                $('#txtcontactPerson').val('')
                $('#updateField').val('0')
                $('#add_comp').text('Add')

                if (parseInt(data) == 1) {
                    error.hide();
                    $('#spansuccess1').html('Data saved successfully')
                    success.show();
                    Metronic.scrollTo(success, -200);
                    success.fadeOut(5000);

                }
                else if (parseInt(data) == -1) {
                    success.hide();
                    $('#spandanger').html('Vendor already exists.')
                    error.show();
                    Metronic.scrollTo(success, -200);
                    error.fadeOut(5000);
                }
                else if (parseInt(data) == 2) {
                    error.hide();
                    $('#spansuccess1').html('Update successfully')
                    success.show();
                    Metronic.scrollTo(success, -200);
                    success.fadeOut(5000);
                }
              //  fetchTempVendors();
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



    } else {
        form.validate();
        jQuery.unblockUI();
        return false;
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

function deleteRFITempVendors(RowID) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var data = {
        'VQID': parseInt(sessionStorage.getItem('CurrentVQID')),
        'RowID': parseInt(RowID)
    };
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VQMaster/DeleteTempVendors/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
            $('.alert-danger').hide();
            $('#spansuccess1').html('Vendor Record Deleted.!!');
            $(".alert-success").show();
            $(".alert-success").fadeOut(5000);
            fetchTempVendors();
            Metronic.scrollTo($(".alert-success"), -200);

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




function RFISubmitTempVendors() {
    var _cleanString4 = StringEncodingMechanism(jQuery("#txtrfiSubject").val());
    var _cleanString5 = StringEncodingMechanism(jQuery('#txtrfidescription').val());
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });


    var TempVendors = {

        "VQID": parseInt(sessionStorage.getItem('CurrentVQID')),
        "UserId": sessionStorage.getItem('UserID'),
        //"Subject": jQuery('#txtrfiSubject').val(),
        "Subject": _cleanString4,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        //"VQDescription": jQuery('#txtrfidescription').val(),
        "VQDescription": _cleanString5,
        "VQDeadline": jQuery('#txtrfideadline').val()

    };

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VQMaster/VQSubmitVendors/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(TempVendors),
        type: "POST",
        contentType: "application/json",
        success: function (data) {

            bootbox.alert("VQ submitted successfully.", function () {
                window.location = sessionStorage.getItem("HomePage")
                return false;
            });

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




function clickallchkbox(chkID, tblID) {
    var tableID = tblID;
    if ($('#' + chkID).is(':checked')) { // check select status

        $('#' + chkID).closest('table').find(":checkbox").prop("checked", true);
    }
    else {
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
            insupdRFIQuestionMaster();
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

function setCategory(CategoryID, CategoryDesc) {

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
        success: function (data) {


            sessionStorage.setItem('hdnquestionSubCatgry', JSON.stringify(data));


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
    var _cleanString6 = StringEncodingMechanism($('#txtqSubcategory').val());

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
        "QuestionSubCategory": _cleanString6,
        "isActive": status,
        "customerId": parseInt(sessionStorage.getItem('CustomerID'))

    }
    //alert(JSON.stringify(data))
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

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
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
function insupdRFIQuestionMaster() {
    var _cleanString7 = StringEncodingMechanism($('#txtQuestiondescription').val());

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
        "QuestionDescription": _cleanString7,
        "Mandatory": mandatory,
        "Attachement": status,
        "QuestionID": 0,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "QuestionApplicableFor": 'VQL'

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
                if (typeof getUrlVarsURL(decryptedstring)["VQID"] == 'undefined') {
                    fetchRFIQuestions('VQL');
                } else {

                    fetchRFIDetailsForTab2('VQL');
                }

            }
            else if (data == '2') {
                errorModal.hide();
                $("#success").html("Updation Successfull...");
                successModal.show();
                fetchRFIQuestions('VQL')
                successModal.fadeOut(5000);

            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                $('#error').html('You have some errors')
                error.show();
                error.fadeOut(5000)
            }

            return false;
            jQuery.unblockUI();
        }

    });
    resetRFIQuestionmaster();
    jQuery.unblockUI();


}


function resetRFIQuestionmaster() {
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
    resetRFIQuestionmaster();
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

function fetchRFIDetailsForPreview() {

    var AttachementFileName = '', _productCat, _txtCategories = [];

    jQuery('#txtrfiSubjectPrev').html(StringEncodingMechanism($('#txtrfiSubject').val()))
    jQuery('#txtrfideadlinePrev').html($('#txtrfideadline').val())
    jQuery('#txtrfidescriptionPrev').html(StringEncodingMechanism($('#txtrfidescription').val()))

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
            $("#tblAttachmentsElemPrev").append('<li><div class="col-md-6" style=padding-left:0px;>' +
                '<p class="form-control-static">' + ptTbl.find('input[type=text]').val() + '</p>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<p class="form-control-static"><a  id=VQFilePrev' + (index + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + $('#attach-file' + (index + 1)).html() + '</a></p>' +
                '</div></li>');


        } else {
            ptTbl = $(this);
            AttachementFileName = $(this).find('input[type=file]').val().split('\\').pop();
            $("#tblAttachmentsElemPrev").append('<li><div class="col-md-6" style=padding-left:0px;>' +
                '<p class="form-control-static">' + ptTbl.find('input[type=text]').val() + '</p>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<p class="form-control-static"><a id=VQFilePrev' + (index + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + AttachementFileName + '</a></p>' +
                '</div></li>');


        }
    });

}

$('#back_prev_btn').click(function () {
    $('#BidPreviewDiv').hide();
    $('#form_wizard_1').show();
});


function getRFIQuestionsForPreview() {
    var panelheadID = '';
    var i = 0;
    var _pannel_head = '';
    $('#wrap_scrollerPrev').empty();
    $('.childchkbox:checked').each(function (index) {


        switch ($(this).closest('.panel-collapse').attr('seqNo')) {
            case '1':
                _pannel_head = 'Company Information'
                break;
            case '2':
                _pannel_head = 'Financial Information'
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
    _count = ($("#tblAttachmentsElem > li").length + 1);
    console.log("count ==> ", _count);
    $("#tblAttachmentsElem").append('<li><div class="inputgroup">' +
        '<label class="control-label col-md-3">Attachment</label>' +
        '<div class="col-md-4">' +
        '<input type="text" class="form-control" placeholder="Attachment Description" id="txtattachdescription" tabindex="5" name="txtattachdescription" autocomplete="off" />' +
        '</div>' +
        '<div class="col-md-3">' +
        '<input type="file" id=file' + _count + ' class="form-control"  tabindex="4" onchange="checkfilesize(this)" />' +
        '<span class="help-block"><a id=attach-file' + _count + ' href="javascript:;" style="text-decoration: none !important;"></a></span>' +
        '</div>' +
        '<div class="col-md-2" style=" padding-left:0px !important; ">' +
        '<a href="javascript:void(0);" class="btn btn-sm blue" onclick="addMoreAttachment()"><i class="fa fa-plus"></i></a>' +
        '</div>' +
        '</div></li>'
    );
}


function fetchVendorDetail() {
    debugger
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/fetchVendorDetails/?customerId=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            debugger
            if (data.length > 0) {
                _vendorDetail = data;
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

jQuery("#txtcompany").typeahead({
    source: function (query, process) {
        var data = _vendorDetail;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.vendorName] = username;
            usernames.push(username.vendorName);
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
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=M&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VendorID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#ddlCategoryMultiple").empty();
            var vlal = new Array();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCategoryMultiple").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }
                jQuery("#ddlCategoryMultiple").trigger("change");
                if (sessionStorage.getItem('CurrentVQID') != "0") {
                    setTimeout(function () {
                        fetchRFIDetails();
                    }, 1000)
                }
            }
            else {
                jQuery("#ddlCategoryMultiple").append('<tr><td>No categories found..</td></tr>');
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert("error");
            }
            return false;
            jQuery.unblockUI();
        }

    });
}

function ajaxFileDelete(closeBtn, filePath) {
    console.log("vicky ==> ", closeBtn, ", filePAth ==> ", filePath)
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
        "RFQRFIID": sessionStorage.getItem('CurrentVQID'),
        "RFIRFQType": 'RFI'
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
            else {
                alert("error");
            }
            return false;
            jQuery.unblockUI();
        }

    });
}

