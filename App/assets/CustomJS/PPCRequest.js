jQuery(document).ready(function () {

    $('[data-toggle="popover"]').popover({})
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
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })


    Metronic.init();
    Layout.init();
    FormWizard.init();
    FetchCurrency("0");
    setCommonData();
    CKEDITOR.replace('txtRemark');
    fetchMenuItemsFromSession(1, 60);
    ComponentsPickers.init();
    fetchParticipantsVender();// fetch all vendors for advance search

    BindPurchaseOrg();
    bindConditionDDL();

});
$("#cancelNFABtn").hide();
var error = $('.alert-danger');
var success = $('.alert-success');
var form = $('#submit_form');
var NFAOverviewDetails = [];
var idx = 0;
var isReverted = 'N';
var ApproverCtr = 0;

var ApprSeqval = [];

var lstActivityData = [];
var objActivity = {};


if (window.location.search) {

    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    idx = parseInt(getUrlVarsURL(decryptedstring)["nfaIdx"]);
    isReverted = getUrlVarsURL(decryptedstring)["isReverted"];
    if (isReverted == "Y") {
        $('#divreverted').removeClass('hide')
        FetchRecomendedVendor();
    }
    else {
        $('#divreverted').addClass('hide')
    }
    GetOverviewmasterbyId(idx);
    sessionStorage.setItem('_savedDraft', 'Y')
}

function cancelbid() {
    CancelBidDuringConfig(idx, 'NFA');
}

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
    $('.MaxLength').maxlength({
        limitReachedClass: "label label-danger",
        alwaysShow: true
    });

});

function FetchRecomendedVendor() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "NFA/GETNFAActivity/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&NFaIdx=" + idx,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $('#tblremarksapprover').empty();
            if (data.length > 0) {
                $('#tblremarksapprover').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th>Completion DT</th></tr>')
                for (var i = 0; i < data.length; i++) {
                    $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                }
            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });

}
jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    "This field is required."
);
var FormWizard = function () {

    return {

        init: function () {

            if (!jQuery().bootstrapWizard) {

                return;

            }

            function format(state) {

                if (!state.id) return state.text;

                return "<img class='flag' src='assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;

            }

            form.validate({
                ignore: "", //nfaissue 22/11/2022

                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

                errorElement: 'span', //default input error message container

                errorClass: 'help-block help-block-error', // default input error message class

                focusInvalid: false, // do not focus the last invalid input

                rules: {

                    txtTitle: {
                        required: true,
                        maxlength: 100
                    },

                    txtNFADetail: {
                        required: true,
                        maxlength: 1000
                    },
                    ddlCategory: {
                        required: true

                    },
                    dropCurrency: {
                        required: true
                    },
                    ddlBudget: {
                        required: true
                    },
                    ddlPurchaseOrg: {
                        required: true,
                        notEqualTo: 0
                    },
                    ddlPurchasegroup: {
                        required: true,
                        notEqualTo: 0
                    },
                    txtAmountFrom: {
                        required: true,
                        minlength: 1,
                        maxlength: 18//3
                    },
                    txtBudget: {
                        minlength: 1,
                        maxlength: 18//3
                    },
                    txtintroduction: {
                        maxlength: 1000
                    },
                    txtsupportedenclosure: {
                        maxlength: 1000
                    }
                },

                messages: {
                },

                errorPlacement: function (error, element) {
                },

                invalidHandler: function (event, validator) {
                    success.hide();
                    Metronic.scrollTo(error, -200);
                    for (var i = 0; i < validator.errorList.length; i++) {
                        $(validator.errorList[i].element).parents('.panel-collapse.collapse').collapse('show');
                    }
                },

                highlight: function (element) {

                    $(element)
                        .closest('.inputgroup,.clsTA').removeClass('has-success').addClass('has-error');

                    $(element)
                        .closest('.col-md-4').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-3').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-2').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-6').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {


                    $(element)
                        .closest('.inputgroup,.clsTA').removeClass('has-error');
                    $(element)
                        .closest('.col-md-4').removeClass('has-error');
                    $(element)
                        .closest('.col-md-3').removeClass('has-error');
                    $(element)
                        .closest('.col-md-2').removeClass('has-error');
                    $(element)
                        .closest('.col-md-6').removeClass('has-error');

                },

                success: function (label) {
                },
                submitHandler: function (form) {
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

                        if ($('#txtBudget').val() == "" || $('#txtBudget').val() == null) {
                            $('#ddlBudget').val('NB');
                        }

                        if ($("#ddlCategory").val() == 2) {//$("#ddlCategory").val() == 1 || 
                            $('#txtProjectName').val('');
                            $('#txtProjectName').rules('add', {
                                required: false
                            });
                            $(".isProject").hide();
                        }
                        else {
                            $(".isProject").show();
                            $('#txtProjectName').rules('add', {
                                required: true
                            });
                        }

                        if (form.valid() == false) {
                            form.validate();
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Check Highlighted Fileds');
                            Metronic.scrollTo($(".alert-danger"), -500);
                            $('.alert-danger').fadeOut(8000);
                            return false;
                        }
                        else {
                            FetchMatrixApprovers();
                        }
                        if (ApproverCtr == 0) {
                            $('#form_wizard_1').bootstrapWizard('previous');
                            $('#form_wizard_1').find('.button-previous').hide();
                            return false;
                        }
                        else if ((sessionStorage.getItem("hdnEventrefId") == '0' || $('#txtEventref').val() == "") && $('#ddlEventType').val() != 0) {
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Select Event Details Properly');
                            Metronic.scrollTo($(".alert-danger"), -500);
                            $('.alert-danger').fadeOut(8000);
                            return false;
                        }
                        else {

                            Savedata();
                            var PreviewHtml = "Preview <i class='fa fa-eye' aria-hidden='true'></i>";
                            $(".button-next").html(PreviewHtml);

                            if (idx != 0) {
                                $('#tblvendorlist').empty();
                                BindAttachmentsOfEdit();
                                fetchAzPPcFormDetails();
                                fncheckvendorOnEvent();
                            }
                            else {

                                if ($('#ddlEventType').val() == 1) {
                                    $('#divbiddingdetailsonEvent').show();
                                    $('#divoutsideppc').hide()
                                    fetchReguestforQuotationDetails();
                                }
                                else if ($('#ddlEventType').val() == 0) {
                                    addvendor();
                                    $('#divbiddingdetailsonEvent').hide();
                                    $('#divoutsideppc').show();
                                }
                                else {
                                    $('#divoutsideppc').hide()
                                    $('#divbiddingdetailsonEvent').show();
                                    FetchBidVendors();
                                }
                            }

                            SaveFirstTabActivity();

                        }

                    }
                    else if (index == 2) {
                        var validVendor = "T";
                        if ($('#ddlEventType').val() == 0) {
                            $('#txtenquiryissuedon').rules('add', {
                                required: true
                            });
                            $("#tblvendorlist >tbody> tr").each(function (index) {
                                var this_row = $(this);
                                index = (this_row.closest('tr').attr('id')).substring(5, (this_row.closest('tr').attr('id')).length)

                                if ($("#vendoridrow" + index).text() == "0" || $("#vendoridrow" + index).text() == "" || $('#vendorSearch' + index).val() == "") {


                                    var PreviewHtml = "Preview <i class='fa fa-eye' aria-hidden='true'></i>";
                                    $(".button-next").html(PreviewHtml);


                                    $('#vendorSearch' + index).removeClass('has-success')
                                    $('#vendorSearch' + index).css("border", "1px solid red")
                                    $('#spandanger').text('Please Select Vendor Properly.');
                                    $('.alert-danger').show();
                                    Metronic.scrollTo(error, -600);
                                    $('.alert-danger').fadeOut(5000);
                                    validVendor = "F";
                                }
                            });
                        }
                        else {
                            $('#txtenquiryissuedon').rules('add', {
                                required: false
                            });
                        }
                        if (form.valid() == false) {
                            form.validate();
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Check Highlighted Fileds');
                            Metronic.scrollTo($(".alert-danger"), -500);
                            $('.alert-danger').fadeOut(8000);
                            return false;
                        }
                        else if (validVendor == 'F') {
                            return false;
                        }
                        if (validVendor == 'T') {
                            frmAzurePPCForm();
                            SaveAttachmentinDB();
                            BindAttachmentsOfEdit();
                            Bindtab3Data();
                        }
                    }
                    handleTitle(tab, navigation, index);
                    if (ApproverCtr === 0)
                        $('.button-submit').hide();

                },

                onPrevious: function (tab, navigation, index) {
                    form.validate();
                    $('#txtenquiryissuedon').rules('add', {
                        required: false
                    });
                    /* form.validate();
                     $("#tblvendorlist >tbody >tr").each(function (i) {
                         var this_row = $(this);
                         i = (this_row.closest('tr').attr('id')).substring(5, (this_row.closest('tr').attr('id')).length)
                         $('#vendorSearch' + i).rules('add', {
                             required: false
                         });
 
                     });*/

                    success.hide();
                    error.hide();
                    if (index == 0) {
                        var PreviewHtml = 'Save and Continue <i class="m-icon-swapright m-icon-white">';
                        $(".button-next").html(PreviewHtml);
                    }
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

                ConfirmSaveApprovers();

            }).hide();
        }

    };

}();

$("#ddlCategory").on('change', function () {
    if ($(this).val() == 2) {//$(this).val() == 1 ||
        $('#txtProjectName').val('');
        $('#txtProjectName').rules('add', {
            required: false
        });
        $(".isProject").hide();
    }
    else {
        $(".isProject").show();
        $('#txtProjectName').rules('add', {
            required: true
        });
    }
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
            $("#dropCurrency").val(DefaultCurrency);
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();

        }

    });

}

function bindNFAOverViewMaster() {

    var url = "NFA/GetNFAOverViews?CustomerID=" + parseInt(CurrentCustomer) + "&userid=" + UserID;

    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {

            if (res.result.length > 0) {

                NFAOverviewDetails = res.result;


            }
        }
    });
    GetData.error(function (res) {

    });

};

function GetOverviewmasterbyId(idx) {
    var url = "NFA/GetNFAOverViewsById?CustomerID=" + parseInt(CurrentCustomer) + "&idx=" + parseInt(idx);
    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {

            if (res.result.length > 0) {

                $("#txtEventref").val(res.result[0].eventReftext);
                $("#txtTitle").val(res.result[0].nfaSubject);
                $("#txtNFADetail").val(res.result[0].nfaDescription);
                $("#ddlEventType").val(res.result[0].eventID);
                p_eventType = res.result[0].eventID;
                setTimeout(function () {
                    GetEventRefData();
                    CKEDITOR.instances['txtRemark'].setData(res.result[0].remarks);
                    sessionStorage.setItem("hdnEventrefId", res.result[0].eventRefernce);
                    sessionStorage.setItem('hdnEventForID', res.result[0].bidForID);
                }, 900);
                $("#cancelNFABtn").show();
                sessionStorage.setItem('hdnNFAID', idx);

                $("#txtAmountFrom").val(res.result[0].nfaAmount.toLocaleString(sessionStorage.getItem("culturecode")));
                $("#txtBudget").val(res.result[0].nfaBudget.toLocaleString(sessionStorage.getItem("culturecode")));

                $("#ddlCategory").val(res.result[0].nfaCategory);
                $("#dropCurrency").val(res.result[0].nfaCurrency);

                if (res.result[0].nfaCategory == 2) {//res.result[0].nfaCategory == 1

                    $(".isProject").hide();
                }
                else {
                    $(".isProject").show();
                }
                //$("#txtProjectName").find(`option[text=res.result[0].projectName]`).attr("selected", "selected")
                //$("#txtProjectName").find(`option[text=${res.result[0].projectName}]`).attr("selected", "selected")
                $("#txtProjectName option:selected").text(res.result[0].projectName);
                $("#ddlBudget").val(res.result[0].budgetStatus);

                $("#ddlPurchaseOrg").val(res.result[0].purchaseOrg);
                
                setTimeout(function () {
                   $("#ddlPurchasegroup").val(res.result[0].purchaseGroup);
                }, 900)

                $("#ddlCondition").val(res.result[0].conditionID);

            }
        }
    });
    GetData.error(function (res) {
        jQuery.unblockUI();
    });
};

var objEventData = [];
$("#ddlEventType").on("change", function () {

    sessionStorage.setItem("hdnEventrefId", 0);
    $("#txtEventref").val('');
    $("#txtTitle").val('');
    $("#txtNFADetail").val('');
    GetEventRefData();
});
function fncheckvendorOnEvent() {

    if (sessionStorage.getItem('_savedDraft') == 'Y' && p_eventType != $("#ddlEventType option:selected").val()) {
        bootbox.dialog({
            message: "By changing Event Type for will delete previously Bidding Vendor Details & Other Details. Do you want to continue?",
            buttons: {
                confirm: {
                    label: "Yes",
                    className: "btn-success",
                    callback: function () {
                        $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                        if ($('#ddlEventType').val() == 1) {
                            $('#divbiddingdetailsonEvent').show();
                            $('#divoutsideppc').hide()
                            fetchReguestforQuotationDetails();
                        }
                        else if ($('#ddlEventType').val() == 0) {
                            addvendor();
                            $('#divbiddingdetailsonEvent').hide();
                            $('#divoutsideppc').show();
                        }
                        else {
                            $('#divoutsideppc').hide()
                            $('#divbiddingdetailsonEvent').show();
                            FetchBidVendors();
                        }
                    }
                },
                cancel: {
                    label: "No",
                    className: "btn-warning",
                    callback: function () {
                        return true;
                    }
                }
            }
        });
    }
}
function GetEventRefData() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var EventTypeId = $("#ddlEventType option:selected").val();


    var url = "NFA/FetchNFAEventRef?CustomerId=" + parseInt(CurrentCustomer) + "&EventTypeid=" + parseInt(EventTypeId);

    var getData = callajaxReturnSuccess(url, "Get", {})
    getData.success(function (res) {
        objEventData = [];
        if (res.result != null)
            if (res.result.length > 0)
                objEventData = res.result;
    });
    getData.error(function (error) {
        objEventData = [];
        jQuery.unblockUI();
    });
    jQuery.unblockUI();
}

$("#txtEventref").keyup(function () {
    sessionStorage.setItem("hdnEventrefId", 0);
    sessionStorage.setItem("hdnEventForID", 0);
    $("#txtEventref").css("border-color", "");
});

$("#txtBudget").focusout(function () {

    if ($('#txtBudget').val() == "" || $('#txtBudget').val() == null) {
        $('#ddlBudget').val('NB');

    }
    else if (parseFloat(removeThousandSeperator($('#txtBudget').val())) < parseFloat(removeThousandSeperator($('#txtAmountFrom').val()))) {

        $('#ddlBudget').val('OB');

    }
    else {
        $('#ddlBudget').val('WB');

    }
});
$("#txtAmountFrom").focusout(function () {
    if ($('#txtBudget').val() == "" || $('#txtBudget').val() == null) {
        $('#ddlBudget').val('NB');
    }
    else if (parseFloat(removeThousandSeperator($('#txtBudget').val())) < parseFloat(removeThousandSeperator($('#txtAmountFrom').val()))) {
        $('#ddlBudget').val('OB');
    }
    else {
        $('#ddlBudget').val('WB');

    }
});

sessionStorage.setItem("hdnEventrefId", 0);
sessionStorage.setItem("hdnEventForID", 0);
var BidDate = new Date();
$("#txtEventref").typeahead({
    source: function (query, process) {
        var data = objEventData;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.refText] = username;

            usernames.push(username.refText);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].refId != "0") {
            sessionStorage.setItem('hdnEventrefId', map[item].refId);
            sessionStorage.setItem('hdnEventForID', map[item].bidForID);

            BidDate = map[item].bidDate;
           
            jQuery('#RFQConfigueron').html(fnConverToLocalTime(BidDate))

            $('#txtTitle').val("NFA -" + map[item].bidSubject)
            $('#txtNFADetail').val(map[item].bidDetails)

        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }
});



var rowAttach = 0;
function addmoreattachments() {

    if (jQuery("#AttachDescription1").val() == "") {
        $('.alert-danger').show();
        $('#errorSeq').html('Please Enter Attachment Description');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (jQuery('#fileToUpload1').val() == "") {
        $('.alert-danger').show();
        $('#errorSeq').html('Please Attach File Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else {
        var attchname = jQuery('#fileToUpload1').val().substring(jQuery('#fileToUpload1').val().lastIndexOf('\\') + 1)
        attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
        var num = 0;
        var maxinum = -1;
        $("#tblAttachments >tbody>tr").each(function () {
            var this_row = $(this);
            num = (this_row.closest('tr').attr('id')).substring(10, (this_row.closest('tr').attr('id')).length)
            if (parseInt(num) > parseInt(maxinum)) {
                maxinum = num;
            }
        });
        rowAttach = parseInt(maxinum) + 1;


        var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        str += '<td class=hide>' + attchname + '</td>'

        str += '<td class=style="width:47%!important"><a id=aeRFQFile' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + attchname + '</a></td>';

        str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + attchname + '\',aeRFQFile' + rowAttach + ',0)" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblAttachments').append(str);
        fnUploadFilesonAzure('fileToUpload1', attchname, 'NFAOverview/' + parseInt(idx));


        jQuery("#AttachDescription1").val('')
        jQuery('#fileToUpload1').val('')

    }
};
function deleteattachrow(rowid, rowidPrev, filename, aID, srno) {

    rowAttach = rowAttach - 1;
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();



    ajaxFileDelete('', '', filename, 'eRFQAttachment', aID, srno)
};

function DownloadFile(aID) {

    fnDownloadAttachments($("#" + aID.id).html(), 'NFAOverview/' + parseInt(idx));
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
        "foldername": 'NFAOverview/' + parseInt(idx)
    }


    $.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/DeleteFiles/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (deletionFor == 'eRFQTerms') {

                $('#' + filepath).html('')
                $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
                $('#' + fileid).attr('disabled', false);
            }
            else {
                if (srno != 0) {

                }
            }
            $('#successSeq').html('File Deleted Successfully');
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

            var err = xhr.responseText
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


var orgData = [];
function BindPurchaseOrg() {

    var url = "NFA/GetPurchaseOrgByUserid?CustomerId=" + parseInt(CurrentCustomer) + "&UserId=" + encodeURIComponent(UserID);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {

        $("#ddlPurchaseOrg").empty();
        if (res.result.length > 0) {

            $.each(res.result, function (key, value) {
                $('#ddlPurchaseOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');

            });
            setTimeout(function () {
                bindPurchaseGroupDDL();
            }, 500);
        }

    });
    GetNFAPARAM.error(function (error) {
        console.log(error);

    });


};
function bindPurchaseGroupDDL() {
    var url = "NFA/GetPurchaseGroupByUserID?CustomerId=" + parseInt(CurrentCustomer) + "&OrgId=" + parseInt($('#ddlPurchaseOrg option:selected').val()) + "&UserID=" + encodeURIComponent(UserID);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {

        if (res.result.length > 0) {

            $("#ddlPurchasegroup").empty();
            if (res.result.length > 0) {
                $.each(res.result, function (key, value) {
                    $('#ddlPurchasegroup').append('<option value=' + value.idx + '>' + value.groupName + '</option>');
                });
            }

        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
    });

};
var p_eventType;
function Savedata() {
    var overviewList = [];
    var p_title = $("#txtTitle").val();
    var p_descript = $("#txtNFADetail").val();

    var p_amount = removeThousandSeperator($("#txtAmountFrom").val());
    var _budget = 0;
    if ($("#txtBudget").val() != '') {
        _budget = removeThousandSeperator($("#txtBudget").val());
    }
    var p_Budget = removeThousandSeperator(_budget);
    var p_category = $("#ddlCategory option:selected").val();
    var p_currency = $("#dropCurrency option:selected").val();
    var p_projectname = $("#txtProjectName option:selected").text();
    var budgetStatus = $("#ddlBudget option:selected").val();
    p_eventType = $("#ddlEventType option:selected").val();
    var p_eventID = sessionStorage.getItem("hdnEventrefId");

    var p_remark = CKEDITOR.instances['txtRemark'].getData();

    var model = {
        CustomerID: parseInt(CurrentCustomer),
        NfaID: parseInt(idx),
        NfaSubject: p_title,
        NfaDescription: p_descript,
        NfaAmount: parseFloat(p_amount),
        NfaBudget: parseFloat(p_Budget),
        NfaCurrency: p_currency,
        NfaCategory: p_category,
        ProjectName: p_projectname,
        BudgetStatus: budgetStatus,
        EventRefernce: p_eventID,
        EventID: parseInt(p_eventType),
        Remarks: p_remark,
        PurchaseOrg: parseInt($('#ddlPurchaseOrg option:selected').val()),
        PurchaseGroup: parseInt($('#ddlPurchasegroup option:selected').val()),
        conditionID: parseInt($("#ddlCondition option:selected").val()),
        CreatedBy: UserID,
        UpdatedBy: UserID
    }
    overviewList.push(model);
    // console.log(JSON.stringify(overviewList));
    var url = "NFA/InsUpdateNfaoverview";
    var GetData = callajaxReturnSuccess(url, "Post", JSON.stringify(overviewList));
    GetData.success(function (res) {

        if (res.result != null) {
            sessionStorage.setItem('_savedDraft', 'Y')
            if (res.result.length > 0) {
                idx = res.result[0].nfaID;
                $('#hfnNFAID').val(res.result[0].nfaID);
            }
        }
        if (idx == 0) {
            fnErrorMessageText('spandanger', 'form_wizard_1');
        }
    });
    GetData.error(function (res) {
    });

};

function Bindtab3Data() {

    Bindtab1DataforPreview();
    Bindtab2DataforPreview();
    FetchMatrixApprovers();
}



function Bindtab1DataforPreview() {
    var p_remark = CKEDITOR.instances['txtRemark'].getData();
    $("#lbltitle").text($("#txtTitle").val());
    $("#lblDetails").text($("#txtNFADetail").val());
    //abheedev bug 385 start
    $("#lblAmount").text($("#txtAmountFrom").val().toLocaleString(sessionStorage.getItem("culturecode")));
    $("#lblbudgetamount").text($("#txtBudget").val().toLocaleString(sessionStorage.getItem("culturecode")));
    //abheedev bug 385 end
    $("#lblCurrency").text($("#dropCurrency option:selected").text());
    $("#lblCategory").text($("#ddlCategory option:selected").text());
    $("#lblProjectName").text($("#txtProjectName option:selected").text());
    $("#lblbudget").text($("#ddlBudget option:selected").text());

    $("#lblPurOrg").text($("#ddlPurchaseOrg option:selected").text());
    $("#lblGroup").text($("#ddlPurchasegroup option:selected").text());
    $("#lblCondition").text($("#ddlCondition option:selected").text());
    $("#lblEventType").text($("#ddlEventType option:selected").text());
    if ($("#ddlEventType option:selected").val() == "7") {

        $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + sessionStorage.getItem("hdnEventrefId") + "'\,\'" + sessionStorage.getItem("hdnEventForID") + "'\,\'7'\,\'0'\) href = 'javascript:;' >" + $("#txtEventref").val() + "</a>");
    }
    else if ($("#ddlEventType option:selected").val() == "7") {

        $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + sessionStorage.getItem("hdnEventrefId") + "'\, \'" + sessionStorage.getItem("hdnEventForID") + "'\,\'6'\,\'0'\) href = 'javascript:;' >" + $("#txtEventref").val() + "</a>");
    }
    else if ($("#ddlEventType option:selected").val() == "8") {

        $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + sessionStorage.getItem("hdnEventrefId") + "'\, \'" + sessionStorage.getItem("hdnEventForID") + "'\,\'8'\,\'0'\) href = 'javascript:;' >" + $("#txtEventref").val() + "</a>");
    }
    else if ($("#ddlEventType option:selected").val() == "9") {

        $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'" + sessionStorage.getItem("hdnEventrefId") + "'\, \'" + sessionStorage.getItem("hdnEventForID") + "'\,\'9'\,\'0'\) href = 'javascript:;' >" + $("#txtEventref").val() + "</a>");
    }
    else {
        $("#lblEventId").html("<a style='text-decoration:none;cursor:pointer' onclick=getSummary(\'0'\,\'0'\,\'0'\,\'" + sessionStorage.getItem("hdnEventrefId") + "'\) href = 'javascript:;' >" + $("#txtEventref").val() + "</a>");
    }
    $("#lblRemark").html(p_remark);
}
function getSummary(bidid, bidforid, bidtypeid, RFQID) {

    if (RFQID == 0) {
        var encrypdata = fnencrypt("BidID=" + bidid + "&BidTypeID=" + bidtypeid + "&BidForID=" + bidforid)
        window.open("BidSummary.html?param=" + encrypdata, "_blank")
    }
    else {
        var encrypdata = fnencrypt("RFQID=" + RFQID + "&AppType=NFA&VID=NFA")
        window.open("eRFQApproverAnalysis.html?param=" + encrypdata, "_blank")

    }
}
function FetchMatrixApprovers() {
    var amount = removeThousandSeperator($("#txtAmountFrom").val());
    var budget = removeThousandSeperator($("#txtBudget").val());
    var groupId = $('#ddlPurchasegroup option:selected').val()
    var orgid = $('#ddlPurchaseOrg option:selected').val();
    var conId = $('#ddlCondition option:selected').val();
    budgetType = $("#ddlBudget option:selected").val();
    BindApprovers(amount, groupId, orgid, conId, budgetType, budget);
};

function BindApprovers(amount, groupId, orgid, conId, budgetType, budget) {

    var url = "NFA/FetchNFAApprovers?customerId=" + parseInt(CurrentCustomer) + "&userID=" + UserID + "&amount=" + parseFloat(amount) + "&groupId=" + parseInt(groupId) + "&orgid=" + parseInt(orgid) + "&conId=" + parseInt(conId) + "&budgetType=" + budgetType + "&NFAID=" + parseInt(idx);

    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        $("#tblApproversPrev").empty();
        if (res.result != null) {

            if (res.result.length > 0) {
                $("#errorApproverdivSeq").hide();
                $("#tblApproversPrev").append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:5%!important'>Sequence</th></tr></thead>");
                $.each(res.result, function (key, value) {
                    $("#tblApproversPrev").append('<tr id=trNfaApprover' + value.idx + '><td>' + value.approverName + '</td><td>' + value.emailId + "<td>" + value.seq + "</td>" + '</td><td class=hide>' + value.idx + '</td></tr>');

                });
                ApproverCtr = 1;
            }
            else {
                ApproverCtr = 0;
                bootbox.alert("No Approver(s) find for selected Apprval matrix(BudgetType: " + $("#ddlBudget option:selected").text() + ", Amount: " + $("#txtAmountFrom").val() + ", Org: " + $("#ddlPurchaseOrg option:selected").text() + ", Group: " + $("#ddlPurchasegroup option:selected").text())

            }
        }
    });
    GetData.error(function (res) {
        ApproverCtr = 0;
        jQuery.unblockUI();
    });

}
function ConfirmSaveApprovers() {
    bootbox.dialog({
        message: "Do you want to continue?",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    $('.modal-footer .btn-success').prop('disabled', true);
                    SaveApproversConfirmation();
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {
                    return true;

                }
            }
        }
    });
}
function SaveApproversConfirmation() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
    var approversData = [];
    var _data = {};


    var url = "NFA/InsUpdateOverViewApprovers?customerId=" + parseInt(CurrentCustomer) + "&NfaIdx=" + parseInt(idx) + "&isReverted=" + isReverted;

    $("#tblApproversPrev tr:gt(0)").each(function () {
        var this_row = $(this);


        _data = {
            custId: parseInt(CurrentCustomer),
            nfaId: parseInt(idx),
            apprSeq: parseInt($.trim(this_row.find('td:eq(2)').html())),
            apprId: parseInt($.trim(this_row.find('td:eq(3)').html())),
            apprName: $.trim(this_row.find('td:eq(0)').html()),
            apprEmail: $.trim(this_row.find('td:eq(1)').html()),
            apprStatus: "P",
        }
        approversData.push(_data);
        objActivity = {
            CustomerID: parseInt(CurrentCustomer),
            FromUserId: UserID,
            ToUserId: $.trim(this_row.find('td:eq(3)').html()),
            ActivityDescription: $("#txtTitle").val(),
            Status: "N",
            LinkURL: "NFAApproverReq.html?App=Y&nfaIdx=" + parseInt(idx),
            Remarks: '',
            ActionType: "",
            NfaIdx: parseInt(idx),
            apprSeq: parseInt($.trim(this_row.find('td:eq(2)').html())),
        }

        lstActivityData.push(objActivity);

        var Seq = parseInt($.trim(this_row.find('td:eq(2)').html()));
        ApprSeqval.push(Seq);

    });

    var SubmitData = callajaxReturnSuccess(url, "Post", JSON.stringify(approversData));
    SubmitData.success(function (res) {
        SaveActivityDetails(lstActivityData);
        if (res.status == "S") {
            bootbox.alert("PPC Request Submitted Successfully.", function () {
                window.location.href = "index.html";
                return false;
            });
        }
        else {
            bootbox.alert("Error: " + res.error, function () {
                return false;
            });
        }
        jQuery.unblockUI();
    });
    SubmitData.error(function (error) {
        bootbox.alert("Error: " + error, function () {
            return false;
        });
    });
    jQuery.unblockUI();
}

function SaveAttachmentinDB() {
    var url = "NFA/InsUpdateNFAFiles?customerId=" + parseInt(CurrentCustomer) + "&NfaIdx=" + parseInt(idx);
    var lstFiles = [];
    var objFiles = {};


    $("#tblAttachments > tbody > tr").each(function () {
        var this_row = $(this);


        objFiles = {
            custId: parseInt(CurrentCustomer),
            nfaIdx: parseInt(idx),
            nfaFileName: ($.trim(this_row.find('td:eq(1)').html())),
            nfaFileDescription: ($.trim(this_row.find('td:eq(0)').html())),
            nfaFileLink: ""

        }
        lstFiles.push(objFiles);
    });

    var SaveFiles = callajaxReturnSuccess(url, "Post", JSON.stringify(lstFiles));
    SaveFiles.success(function (res) {

    });
    SaveFiles.error(function (error) {

    });


};

function BindAttachmentsOfEdit() {
    var url = "NFA/FetchNFaFiles?CustomerId=" + parseInt(CurrentCustomer) + "&NfaId=" + parseInt(idx);

    var GetFilesData = callajaxReturnSuccess(url, "Get", {})
    GetFilesData.success(function (res) {
        $('#tblAttachments').empty();
        $('#tblAttachmentsPrev').empty();
        if (res != null) {
            if (res.result.length > 0) {

                $.each(res.result, function (key, value) {
                    rowAttach = key;
                    var str = '<tr id=trAttachid' + rowAttach + '><td style="width:47%!important">' + value.nfaFileDescription + '</td>';
                    str += '<td class=hide>' + value.nfaFileName + '</td>'

                    str += '<td class=style="width:47%!important"><a id=aeRFQFile' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + value.nfaFileName + '</a></td>';

                    str += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteattachrow(trAttachid' + rowAttach + ',trAttachidprev' + rowAttach + ',\'' + value.nfaFileName + '\',aeRFQFile' + rowAttach + ',0)" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
                    $('#tblAttachments').append(str);


                    if (!jQuery("#tblAttachmentsPrev thead").length) {
                        jQuery('#tblAttachmentsPrev').append("<thead><tr><th class='bold'>Attachment Description</th><th class='bold'>Attachment</th></tr></thead>");
                        var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + value.nfaFileDescription + '</td>';
                    }
                    else {
                        var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + value.nfaFileDescription + '</td>';
                    }


                    strprev += '<td class=style="width:47%!important"><a id=aeRFQFilePrev' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + value.nfaFileName + '</a></td>';
                    $('#tblAttachmentsPrev').append(strprev);

                });
            }
        }
    })

};


function SaveFirstTabActivity() {

    objActivity = {
        FromUserId: UserID,
        ToUserId: UserID,
        ActivityDescription: $("#txtTitle").val(),
        NfaIdx: parseInt(idx)
    }
    var url = "NFA/InsertFirstTabActivity";

    var firstTab = callajaxReturnSuccess(url, "Post", JSON.stringify(objActivity));
    firstTab.success(function (res) {

    });
    firstTab.error(function (error) {

    });

}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

function SaveActivityDetails(data) {
    var aquaticCreatures = data.filter(function (details) {
        return details.apprSeq == ApprSeqval.min();
    });
    var url = "NFA/InsUpdateActivityDetails?NFAID=" + parseInt(idx);
   // console.log(JSON.stringify(aquaticCreatures))
    var SaveActivityDetails = callajaxReturnSuccess(url, "Post", JSON.stringify(aquaticCreatures));
    SaveActivityDetails.success(function (res) {
        lstActivityData = [];
    });
    SaveActivityDetails.error(function (error) {
        
    })
}


function BindData() {


    var url = "NFA/GetNFAText?CustomerID=" + parseInt(CurrentCustomer);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#tblFetchParamMaster").empty();

        if (res.result.length > 0) {
            $('#searchsubcat').show();
            $('#tblFetchParamMaster').append('<thead><tr><th>Sr#</th><th>Actions</th><th>Param Text</th><th>Status</th></tr></thead>');

            $.each(res.result, function (key, value) {
                if (value.isActive == true)
                    Status = "<span>Active</span>";
                else
                    Status = "<span>In-Active</span>";

                $('#tblFetchParamMaster').append('<tr id="rowid_' + value.nfaParamID + '"><td>' + ++key + '</td><td><a class="btn  btn-xs btn-success" href="javascript:;"  onClick="onEditClick(\'rowid_' + value.nfaParamID + '\',' + value.isActive + ')"><i class="fa fa-pencil"></i></a></td><td>' + value.nfaParamText + '</td><td>' + Status + '</td></tr>')
            });
        }
        else {
            $("#tblFetchParamMaster").empty();
            $('#searchsubcat').hide();
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);

    });


};
function onEditClick(idx, checked) {


    var rowID = $('#' + idx);
    var idxParam = idx.replace('rowid_', '');
    $("#txtParamText").val(rowID.find('td:eq(2)').text());
    $("#hdnParamID").val(idxParam);
    if (checked == true) {

        $('input:checkbox[name=checkboxactive]').attr('checked', true);
        $('#checkboxactive').parents('span').addClass('checked');

    }
    else {

        $('input:checkbox[name=checkboxactive]').attr('checked', false);
        $('#checkboxactive').parents('span').removeClass('checked');

    }
    $(".submitbtnmaster").text("Modify");

};

function SaveUpdate() {

    var url = "NFA/CreateUpdateNfaParam";
    var idx = $("#hdnParamID").val();
    var paramtext = $("#txtParamText").val();
    var status = $("#checkboxactive").is(':checked')
    var Data = {
        NfaParamID: parseInt(idx),
        CustomerID: parseInt(CurrentCustomer),
        NfaParamText: paramtext,
        IsActive: status,
        createdUser: UserID,
        updatedUser: UserID
    };

    var SaveParam = callajaxReturnSuccess(url, "Post", JSON.stringify(Data));
    SaveParam.success(function (res) {
        if (res.status == "E") {
            alert(res.error);
        }
        else {


            //GetNfaOverviewParams();
            $('#SubCategory').modal('hide')
        }
    });
    SaveParam.error(function (xhr, status, error) {
        var err = eval("(" + xhr.responseText + ")");
        if (xhr.status === 400) {
            alert(JSON.stringify(err.errors));
        }
        if (xhr.status === 401) {
            error401Messagebox(err.Message);
        }
    });
};

$("#searchPop-up").keyup(function () {
    var SearchTerm = $('#searchPop-up').val();
    SearchInGridview("tblFetchParamMaster", SearchTerm);
});

function bindConditionDDL() {

    var url = "NFA/fetchNFACondition?CustomerId=" + parseInt(CurrentCustomer) + "&IsActive=N";

    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#ddlCondition").empty();
        $("#ddlCondition").append(jQuery("<option></option>").val("0").html("No exception"));
        if (res.result != null) {
            if (res.result.length > 0) {

                for (var i = 0; i < res.result.length; i++) {
                    $("#ddlCondition").append(jQuery("<option></option>").val(res.result[i].conditionID).html(res.result[i].conditionName));
                }
            }
        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
    });
};
jQuery("#txtSearchmatrix").keyup(function () {

    jQuery("#tblAllmatrix tr:has(td)").hide();

    var iCounter = 0;
    var sSearchTerm = jQuery('#txtSearchmatrix').val();

    if (sSearchTerm.length == 0) {
        jQuery("#tblAllmatrix tr:has(td)").show();
        return false;
    }

    jQuery("#tblAllmatrix tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});

function viewallmatrix() {
    $('#viewAllMatrix').modal('show');
    bindApproverMaster('N');
}
function fetchReguestforQuotationDetails() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hdnEventrefId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            $('#tblvendors').empty();

            if (RFQData.length > 0) {
                
                jQuery('#RFQConfigueron').html(fnConverToLocalTime(RFQData[0].general[0].rfqConfigureDate))
                if (RFQData[0].vendors.length > 0) {
                    $('#tblvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th style='width:20%!important;'>TPI</th></tr></thead>");
                    for (i = 0; i < RFQData[0].vendors.length; i++) {
                        $('#tblvendors').append("<tr><td class=hide>" + RFQData[0].vendors[i].vendorId + "</td><td>" + RFQData[0].vendors[i].vendorName + "</td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td><td id=TDpolyticExp" + i + "></td><td id=TDvalidatescm" + i + "></td><td id=TPI" + i + "></td></tr>")
                        $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="Y" checked /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="N"  />No</label></div>')
                        $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y"  checked/> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  />No</label></div>')
                        $('#TDpolyticExp' + i).append('<div> <label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="Y" id=politicalyexpY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="N"  id=politicalyexpN' + i + '  checked />No</label></div>')
                        $('#TDvalidatescm' + i).append('<div> <label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="Y" id=QuotedSCMY' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="N"  id=QuotedSCMN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="NA"  id=QuotedSCMNA' + i + ' />NA</label></div>')
                        $('#TPI' + i).append('<div> <label class="radio-inline"><input type="radio" name=TPI' + i + ' value="Y" id=TPIY' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="N"  id=TPIN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="NA"  id=TPINA' + i + ' />NA</label></div>')
                    }
                    $('#tblvendors').append("<tr><td colspan=5></td><td><span class='help-block'><b>Note*</b><br>Y - IF TPI ALREADY DONE</br> N - TPI WILL BE DONE WHILE PLACING THE ORDER WITH FINAL VENDOR</br>Not Applicable - TPI not required</span></td></tr>")
                    $('#tblvendors').append("</tbody>");
                }

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
function FetchBidVendors() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/fetchVendor/?BidID=" + sessionStorage.getItem('hdnEventrefId') + "&VendorType=NO",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            var bidate = new Date();
            $('#tblvendors').empty();
           
            if (data[0].bidDate != null) {
                bidate = data[0].bidDate;
                jQuery('#RFQConfigueron').html(fnConverToLocalTime(bidate));
            }

            if (data.length > 0) {
                $('#tblvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th style='width:20%!important;'>TPI</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {

                    $('#tblvendors').append("<tr><td class=hide>" + data[i].vendorID + "</td><td>" + data[i].vendorName + "</td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td><td id=TDpolyticExp" + i + "></td><td id=TDvalidatescm" + i + "></td><td id=TPI" + i + "></td></tr>")
                    $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="Y" checked /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="N"  />No</label></div>')
                    $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y"  checked/> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  />No</label></div>')
                    $('#TDpolyticExp' + i).append('<div> <label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="Y" id=politicalyexpY' + i + '  /> Yes</label><label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="N"  id=politicalyexpN' + i + ' checked />No</label></div>')
                    $('#TDvalidatescm' + i).append('<div> <label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="Y" id=QuotedSCMY' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="N"  id=QuotedSCMN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="NA"  id=QuotedSCMNA' + i + ' />NA</label></div>')
                    $('#TPI' + i).append('<div> <label class="radio-inline"><input type="radio" name=TPI' + i + ' value="Y" id=TPIY' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="N"  id=TPIN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="NA"  id=TPINA' + i + ' />NA</label></div>')

                }
                $('#tblvendors').append("<tr><td colspan=5></td><td><span class='help-block'><b>Note*</b><br>Y - IF TPI ALREADY DONE</br> N - TPI WILL BE DONE WHILE PLACING THE ORDER WITH FINAL VENDOR</br>Not Applicable - TPI not required</span></td></tr>")
                $('#tblvendors').append("</tbody>");
            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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

function frmAzurePPCForm() {

    var RFQID = 0, BidID = 0;
    var EnquiryIssuedOn = new Date();

    if ($('#ddlEventType').val() == 1) {
        RFQID = sessionStorage.getItem('hdnEventrefId');
        EnquiryIssuedOn = new Date(jQuery('#RFQConfigueron').text().replace('-', ''));

    }
    else if ($('#ddlEventType').val() != 0 && $('#ddlEventType').val() != 1) {
        BidID = sessionStorage.getItem('hdnEventrefId');
        EnquiryIssuedOn = new Date(jQuery('#RFQConfigueron').text().replace('-', ''));
    }
    else {
        if ($('#txtenquiryissuedon').val() != null && $('#txtenquiryissuedon').val() != "") {
            EnquiryIssuedOn = new Date($('#txtenquiryissuedon').val().replace('-', ''));
        }
    }
    var AzurevendorDetails = [];
    var EnquiryIssuedthrogh = "";
    if ($('#ddlEventType').val() != 0) {
        $("#tblvendors> tbody > tr").not(':last').each(function (index) {

            var details = {
                "VendorID": parseInt($(this).find("td").eq(0).html()),
                "QuotationReceived": $("input[name=OpQuotation" + index + "]:checked").val(),
                "TexhnicallyAcceptable": $("input[name=OpTechAccep" + index + "]:checked").val(),
                "PoliticallyExposed": $("input[name=politicalyexp" + index + "]:checked").val(),
                "QuotedValidatedSCM": $("input[name=QuotedSCM" + index + "]:checked").val(),
                "TPI": $("input[name=TPI" + index + "]:checked").val()
            };
            AzurevendorDetails.push(details)
        });
        EnquiryIssuedthrogh = $("input[name='optionenquiryissued']:checked").val();
    }
    else {

        $("#tblvendorlist >tbody> tr").each(function (index) {
            var this_row = $(this);
            index = (this_row.closest('tr').attr('id')).substring(5, (this_row.closest('tr').attr('id')).length)
            var details = {
                "VendorID": parseInt($("#vendoridrow" + index).text()),
                "QuotationReceived": $("input[name=OpQuotationOP" + index + "]:checked").val(),
                "TexhnicallyAcceptable": $("input[name=OpTechAccepOP" + index + "]:checked").val(),
                "PoliticallyExposed": $("input[name=politicalyexpOP" + index + "]:checked").val(),
                "QuotedValidatedSCM": $("input[name=QuotedSCMOP" + index + "]:checked").val(),
                "TPI": $("input[name=TPIOP" + index + "]:checked").val()

            };
            AzurevendorDetails.push(details)
        });
        EnquiryIssuedthrogh = $("input[name='optionenquiryissuedout']:checked").val();
    }

    var LowestPriceOffer = $("input[name='LowestPriceOffer']:checked").val();
    var repeatorder = $("input[name='repeatorder']:checked").val();
    var Data = {
        "nfaID": parseInt(idx),
        "RFQID": parseInt(RFQID),
        "BidID": parseInt(BidID),
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "Introduction": jQuery('#txtintroduction').val(),
        "CostBenefitAnalysis": jQuery('#txtcostbenefit').val(),
        "Budgetavailabilty": jQuery('#txtbudgetavailbilty').val(),
        "Workordergiven": jQuery('#txtpartordergiven').val(),
        "Completionsechdule": jQuery('#txtcompletionsechdule').val(),
        "Lessthan3Quotes": jQuery('#txtlessthan3quotes').val(),
        "AwardcontractthanL1": jQuery('#txtawardotherthanL1').val(),
        "Splitingorder01Vendor": jQuery('#txtsplitingmorethan01').val(),
        "GeneralRemarks": jQuery('#txtgemeralremarks').val(),
        "IssuingRFQtoVendor": jQuery('#txtrationalrfqvendor').val(),
        "Enquirynotsentvendors": jQuery('#txtenquirynotsent').val(),
        "EnquiryIssuedOn": EnquiryIssuedOn,
        "EnquiryIssuedthrogh": EnquiryIssuedthrogh,
        "RecomOrderLowPriceOffer": LowestPriceOffer,
        "RecomRepeatOrder": repeatorder,
        "RecomSuppEnclosure": jQuery('#txtsupportedenclosure').val(),
        "RecomCompFinalPrice": jQuery('#tctcomfinalprice').val(),
        "RecomQuotationofParties": jQuery('#txtquotationparties').val(),
        "WorkOrderRecomParty": jQuery('#txtorderrecparty').val(),
        "PurchaseOrder": jQuery('#txtworkordervalue').val(),
        "InternalCostestimate": jQuery('#txtinternalcost').val(),
        "Terms": jQuery('#txtterms').val(),
        "Scopeofwork": jQuery('#txtscopework').val(),
        "Deliverables": jQuery('#txtdeliverables').val(),
        "Paymentterms": jQuery('#txtpaymentterms').val(),
        "ApplicableTaxduty": jQuery('#txtapplicabletax').val(),
        "WhetherLDApplicable": jQuery('#txtLDapplicable').val(),
        "WhetherCPBGApplicable": jQuery('#txtCPBGapplicable').val(),
        "PRDetails": jQuery('#txtPRdetails').val(),
        "EnteredBy": sessionStorage.getItem("UserID"),
        "BiddingVendorDetails": AzurevendorDetails

    };

    // console.log(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "Azure/insPPC/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            return true;
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

function fetchAzPPcFormDetails() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=0&BidID=0&nfaID=" + idx,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var validatescm = "Yes";
            var TPI = "Yes"

            if (data[0].azureDetails.length > 0) {
                $('#tblvendors').empty();
                jQuery('#txtintroduction').val(data[0].azureDetails[0].introduction)
                jQuery('#txtcostbenefit').val(data[0].azureDetails[0].costBenefitAnalysis)
                jQuery('#txtbudgetavailbilty').val(data[0].azureDetails[0].budgetavailabilty);
                jQuery('#txtpartordergiven').val(data[0].azureDetails[0].workordergiven);
                jQuery('#txtawardotherthanL1').val(data[0].azureDetails[0].awardcontractthanL1);
                jQuery('#txtlessthan3quotes').val(data[0].azureDetails[0].lessthan3Quotes);
                jQuery('#txtcompletionsechdule').val(data[0].azureDetails[0].completionsechdule);
                jQuery('#txtsplitingmorethan01').val(data[0].azureDetails[0].splitingorder01Vendor);
                jQuery('#txtgemeralremarks').val(data[0].azureDetails[0].generalRemarks);
                jQuery('#txtrationalrfqvendor').val(data[0].azureDetails[0].issuingRFQtoVendor);
                jQuery('#txtenquirynotsent').val(data[0].azureDetails[0].enquirynotsentvendors);
                
                jQuery('#RFQConfigueron').text(fnConverToLocalTime(data[0].azureDetails[0].enquiryIssuedOn));
                jQuery('#txtenquiryissuedon').val(fnConverToLocalTime(data[0].azureDetails[0].enquiryIssuedOn));

                if (data[0].azureDetails[0].recomOrderLowPriceOffer == "Y") {
                    $("#LowestPriceOfferY").attr("checked", "checked");
                    $("#LowestPriceOfferY").closest('span').addClass('checked')
                    $("#LowestPriceOfferN").closest('span').removeClass('checked')
                    $("#LowestPriceOfferN").removeAttr("checked");
                }
                else {
                    $("#LowestPriceOfferN").attr("checked", "checked");
                    $("#LowestPriceOfferN").closest('span').addClass('checked')
                    $("#LowestPriceOfferY").closest('span').removeClass('checked')
                    $("#LowestPriceOfferY").removeAttr("checked");
                }
                if (data[0].azureDetails[0].recomRepeatOrder == "Y") {
                    $("#repeatorderY").attr("checked", "checked");
                    $("#repeatorderY").closest('span').addClass('checked')
                    $("#repeatorderN").closest('span').removeClass('checked')
                    $("#repeatorderN").removeAttr("checked");
                }
                else {
                    $("#repeatorderN").attr("checked", "checked");
                    $("#repeatorderY").closest('span').removeClass('checked')
                    $("#repeatorderN").closest('span').addClass('checked')
                    $("#repeatorderY").removeAttr("checked");
                }
                if ($('#ddlEventType').val() != 0) {
                    if (data[0].azureDetails[0].enquiryIssuedthrogh == "ProcurEngine") {
                        $("#optionenquiryissuedP").attr("checked", "checked");
                        $("#optionenquiryissuedP").closest('span').addClass('checked')
                        $("#optionenquiryissuedE").closest('span').removeClass('checked')
                        $("#optionenquiryissuedF").closest('span').removeClass('checked')
                        $("#optionenquiryissuedE").removeAttr("checked");
                        $("#optionenquiryissuedF").removeAttr("checked");

                    }
                    else if (data[0].azureDetails[0].enquiryIssuedthrogh == "Email") {
                        $("#optionenquiryissuedP").removeAttr("checked");
                        $("#optionenquiryissuedE").attr("checked", "checked");
                        $("#optionenquiryissuedF").removeAttr("checked");
                        $("#optionenquiryissuedE").closest('span').addClass('checked')
                        $("#optionenquiryissuedP").closest('span').removeClass('checked')
                        $("#optionenquiryissuedF").closest('span').removeClass('checked')
                    }
                    else {
                        $("#optionenquiryissuedF").closest('span').addClass('checked')
                        $("#optionenquiryissuedP").closest('span').removeClass('checked')
                        $("#optionenquiryissuedE").closest('span').removeClass('checked')
                        $("#optionenquiryissuedP").removeAttr("checked");
                        $("#optionenquiryissuedE").removeAttr("checked");
                        $("#optionenquiryissuedF").attr("checked", "checked");

                    }
                }
                else {
                    if (data[0].azureDetails[0].enquiryIssuedthrogh == "ProcurEngine") {
                        $("#optionenquiryissuedPout").attr("checked", "checked");
                        $("#optionenquiryissuedPout").closest('span').addClass('checked')
                        $("#optionenquiryissuedEout").closest('span').removeClass('checked')
                        $("#optionenquiryissuedFout").closest('span').removeClass('checked')
                        $("#optionenquiryissuedEout").removeAttr("checked");
                        $("#optionenquiryissuedFout").removeAttr("checked");

                    }
                    else if (data[0].azureDetails[0].enquiryIssuedthrogh == "Email") {
                        $("#optionenquiryissuedPout").removeAttr("checked");
                        $("#optionenquiryissuedEout").attr("checked", "checked");
                        $("#optionenquiryissuedFout").removeAttr("checked");
                        $("#optionenquiryissuedEout").closest('span').addClass('checked')
                        $("#optionenquiryissuedPout").closest('span').removeClass('checked')
                        $("#optionenquiryissuedFout").closest('span').removeClass('checked')
                    }
                    else {
                        $("#optionenquiryissuedFout").closest('span').addClass('checked')
                        $("#optionenquiryissuedPout").closest('span').removeClass('checked')
                        $("#optionenquiryissuedEout").closest('span').removeClass('checked')
                        $("#optionenquiryissuedPout").removeAttr("checked");
                        $("#optionenquiryissuedEout").removeAttr("checked");
                        $("#optionenquiryissuedFout").attr("checked", "checked");

                    }
                }


                jQuery('#txtsupportedenclosure').val(data[0].azureDetails[0].recomSuppEnclosure);
                jQuery('#tctcomfinalprice').val(data[0].azureDetails[0].recomCompFinalPrice);
                jQuery('#txtquotationparties').val(data[0].azureDetails[0].recomQuotationofParties);
                jQuery('#txtorderrecparty').val(data[0].azureDetails[0].workOrderRecomParty);
                jQuery('#txtworkordervalue').val(data[0].azureDetails[0].purchaseOrder);
                jQuery('#txtinternalcost').val(data[0].azureDetails[0].internalCostestimate);
                jQuery('#txtterms').val(data[0].azureDetails[0].terms);
                jQuery('#txtscopework').val(data[0].azureDetails[0].scopeofwork);
                jQuery('#txtdeliverables').val(data[0].azureDetails[0].deliverables);

                jQuery('#txtapplicabletax').val(data[0].azureDetails[0].applicableTaxduty);
                jQuery('#txtpaymentterms').val(data[0].azureDetails[0].paymentterms);
                jQuery('#txtLDapplicable').val(data[0].azureDetails[0].whetherLDApplicable);
                jQuery('#txtCPBGapplicable').val(data[0].azureDetails[0].whetherCPBGApplicable);
                jQuery('#txtPRdetails').val(data[0].azureDetails[0].prDetails);
                if ($('#ddlEventType').val() == 1) {
                    $('#divbiddingdetailsonEvent').show();
                    $('#divoutsideppc').hide()

                }
                else if ($('#ddlEventType').val() == 0) {
                    $('#divbiddingdetailsonEvent').hide();
                    $('#divoutsideppc').show();
                }
                else {
                    $('#divoutsideppc').hide()
                    $('#divbiddingdetailsonEvent').show();
                }

                if (data[0].biddingVendor.length > 0) {

                    if ($('#ddlEventType').val() != 0) {
                        $('#tblvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th>TPI</th></tr></thead>");
                        for (i = 0; i < data[0].biddingVendor.length; i++) {
                            $('#tblvendors').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td><td id=TDpolyticExp" + i + "></td><td id=TDvalidatescm" + i + "></td><td id=TPI" + i + "></td></tr>")
                            $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="Y"  id=OpQuotationY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="N" id=OpQuotationN' + i + ' />No</label></div>')
                            $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y" id=OpTechAccepY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  id=OpTechAccepN' + i + ' />No</label></div>')
                            $('#TDpolyticExp' + i).append('<div> <label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="Y" id=politicalyexpY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="N"  id=politicalyexpN' + i + ' />No</label></div>')
                            $('#TDvalidatescm' + i).append('<div> <label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="Y" id=QuotedSCMY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="N"  id=QuotedSCMN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="NA"  id=QuotedSCMNA' + i + ' />NA</label></div>')
                            $('#TPI' + i).append('<div> <label class="radio-inline"><input type="radio" name=TPI' + i + ' value="Y" id=TPIY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="N"  id=TPIN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="NA"  id=TPINA' + i + ' />NA</label></div>')

                            if (data[0].biddingVendor[i].quotationReceived == "Y") {
                                $("#OpQuotationY" + i).attr("checked", "checked");
                                $("#OpQuotationN" + i).removeAttr("checked");
                            }
                            else {
                                $("#OpQuotationY" + i).removeAttr("checked");
                                $("#OpQuotationN" + i).attr("checked", "checked");
                            }
                            if (data[0].biddingVendor[i].tpi == "Y") {
                                $("#TPIY" + i).attr("checked", "checked");
                                $("#TPIN" + i).removeAttr("checked");
                                $("#TPINA" + i).removeAttr("checked");
                                TPI = "Yes";
                            }
                            else if (data[0].biddingVendor[i].tpi == "NA") {
                                $("#TPINA" + i).attr("checked", "checked");
                                $("#TPIN" + i).removeAttr("checked");
                                $("#TPIY" + i).removeAttr("checked");
                                TPI = "NA";
                            }

                            else {
                                $("#TPIY" + i).removeAttr("checked");
                                $("#TPIN" + i).attr("checked", "checked");
                                $("#TPINA" + i).removeAttr("checked");
                                TPI = "No";
                            }
                            if (data[0].biddingVendor[i].texhnicallyAcceptable == "Y") {
                                $("#OpTechAccepY" + i).attr("checked", "checked");
                                $("#OpTechAccepN" + i).removeAttr("checked");
                            }
                            else {
                                $("#OpTechAccepY" + i).removeAttr("checked");
                                $("#OpTechAccepN" + i).attr("checked", "checked");
                            }
                            if (data[0].biddingVendor[i].politicallyExposed == "Y") {
                                $("#politicalyexpY" + i).attr("checked", "checked");
                                $("#politicalyexpN" + i).removeAttr("checked");
                            }
                            else {
                                $("#politicalyexpY" + i).removeAttr("checked");
                                $("#politicalyexpN" + i).attr("checked", "checked");
                            }
                            if (data[0].biddingVendor[i].quotedValidatedSCM == "Y") {
                                $("#QuotedSCMY" + i).attr("checked", "checked");
                                $("#QuotedSCMN" + i).removeAttr("checked");
                                validatescm = "Yes";
                            }
                            else if (data[0].biddingVendor[i].quotedValidatedSCM == "NA") {
                                $("#QuotedSCMNA" + i).attr("checked", "checked");
                                $("#QuotedSCMNA" + i).removeAttr("checked");
                                validatescm = "NA";
                            }
                            else {
                                $("#QuotedSCMY" + i).removeAttr("checked");
                                $("#QuotedSCMN" + i).attr("checked", "checked");
                                validatescm = "No";
                            }
                        }
                        $('#tblvendors').append("<tr><td colspan=5></td><td><span class='help-block'><b>Note*</b><br>Y - IF TPI ALREADY DONE</br> N - TPI WILL BE DONE WHILE PLACING THE ORDER WITH FINAL VENDOR</br>Not Applicable - TPI not required</span></td></tr>")
                    }
                    else {

                        for (i = 0; i < data[0].biddingVendor.length; i++) {
                            addvendor();
                            $('#vendoridrow' + i).text(data[0].biddingVendor[i].vendorID);
                            $('#vendorSearch' + i).val(data[0].biddingVendor[i].vendorName);

                            if (data[0].biddingVendor[i].quotationReceived == "Y") {
                                $("#OpQuotationYOP" + i).attr("checked", "checked");
                                $("#OpQuotationNOP" + i).removeAttr("checked");
                            }
                            else {
                                $("#OpQuotationYOP" + i).removeAttr("checked");
                                $("#OpQuotationNOP" + i).attr("checked", "checked");
                            }
                            if (data[0].biddingVendor[i].tpi == "Y") {
                                $("#TPIYOP" + i).attr("checked", "checked");
                                $("#TPINOP" + i).removeAttr("checked");
                                $("#TPINAOP" + i).removeAttr("checked");
                                TPI = "Yes";
                            }
                            else if (data[0].biddingVendor[i].tpi == "NA") {
                                $("#TPINAOP" + i).attr("checked", "checked");
                                $("#TPINOP" + i).removeAttr("checked");
                                $("#TPIYOP" + i).removeAttr("checked");
                                TPI = "NA";
                            }

                            else {
                                $("#TPIYOP" + i).removeAttr("checked");
                                $("#TPINOP" + i).attr("checked", "checked");
                                $("#TPINAOP" + i).removeAttr("checked");
                                TPI = "No";
                            }
                            if (data[0].biddingVendor[i].texhnicallyAcceptable == "Y") {
                                $("#OpTechAccepYOP" + i).attr("checked", "checked");
                                $("#OpTechAccepNOP" + i).removeAttr("checked");
                            }
                            else {
                                $("#OpTechAccepYOP" + i).removeAttr("checked");
                                $("#OpTechAccepNOP" + i).attr("checked", "checked");
                            }
                            if (data[0].biddingVendor[i].politicallyExposed == "Y") {
                                $("#politicalyexpYOP" + i).attr("checked", "checked");
                                $("#politicalyexpNOP" + i).removeAttr("checked");
                            }
                            else {
                                $("#politicalyexpYOP" + i).removeAttr("checked");
                                $("#politicalyexpNOP" + i).attr("checked", "checked");
                            }
                            if (data[0].biddingVendor[i].quotedValidatedSCM == "Y") {
                                $("#QuotedSCMYOP" + i).attr("checked", "checked");
                                $("#QuotedSCMNOP" + i).removeAttr("checked");
                                validatescm = "Yes";
                            }
                            else if (data[0].biddingVendor[i].quotedValidatedSCM == "NA") {
                                $("#QuotedSCMNAOP" + i).attr("checked", "checked");
                                $("#QuotedSCMNAOP" + i).removeAttr("checked");
                                validatescm = "NA";
                            }
                            else {
                                $("#QuotedSCMYOP" + i).removeAttr("checked");
                                $("#QuotedSCMNOP" + i).attr("checked", "checked");
                                validatescm = "No";
                            }

                        }
                    }
                }
                else {
                    if ($('#ddlEventType').val() == 0) {
                        addvendor();
                    }
                }


            }
            else {

                if ($('#ddlEventType').val() == 1) {
                    $('#divbiddingdetailsonEvent').show();
                    $('#divoutsideppc').hide()
                    fetchReguestforQuotationDetails();
                }
                else if ($('#ddlEventType').val() == 0) {
                    $('#divbiddingdetailsonEvent').hide();
                    $('#divoutsideppc').show();
                    addvendor();
                }
                else {
                    $('#divoutsideppc').hide()
                    $('#divbiddingdetailsonEvent').show();
                    FetchBidVendors();
                }
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }

    })
}
function Bindtab2DataforPreview() {
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=0&BidID=0&nfaID=" + idx,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data[0].azureDetails.length > 0) {
                $('#tblvendorsprev').empty();
                jQuery('#lblintroduction').html(data[0].azureDetails[0].introduction)
                jQuery('#lblcostbenfit').html(data[0].azureDetails[0].costBenefitAnalysis)
                jQuery('#lblrepeatorder').html(data[0].azureDetails[0].recomRepeatOrder == 'Y' ? 'Yes' : 'No')
                jQuery('#lblbudgetavail').html(data[0].azureDetails[0].budgetavailabilty);
                jQuery('#lblpartyordergiven').html(data[0].azureDetails[0].workordergiven);
                jQuery('#lblawardL1').html(data[0].azureDetails[0].awardcontractthanL1);
                jQuery('#lbllessthan3quotes').html(data[0].azureDetails[0].lessthan3Quotes);
                jQuery('#lblcompletionsechdule').html(data[0].azureDetails[0].completionsechdule);
                jQuery('#lblrationalspliting').html(data[0].azureDetails[0].splitingorder01Vendor);
                jQuery('#lblgeneralremarks').html(data[0].azureDetails[0].generalRemarks);
                jQuery('#lblissuingrfqtovendor').html(data[0].azureDetails[0].issuingRFQtoVendor);
                jQuery('#lblenquirynotsent').html(data[0].azureDetails[0].enquirynotsentvendors);

                jQuery('#lblenquiryissuedon').html(fnConverToLocalTime(data[0].azureDetails[0].enquiryIssuedOn));
                jQuery('#lblenquiryissuedthrough').html(data[0].azureDetails[0].enquiryIssuedthrogh);
                jQuery('#lbllowestpriceoffer').html(data[0].azureDetails[0].recomOrderLowPriceOffer == 'Y' ? 'Yes' : 'No');
                jQuery('#lblsupportedenclosure').html(data[0].azureDetails[0].recomSuppEnclosure);
                jQuery('#lblfinalprice').html(data[0].azureDetails[0].recomCompFinalPrice);
                jQuery('#lblquotationparties').html(data[0].azureDetails[0].recomQuotationofParties);

                jQuery('#lblorderrecomparty').html(data[0].azureDetails[0].workOrderRecomParty);
                jQuery('#lblpurchaseorder').html(data[0].azureDetails[0].purchaseOrder);
                jQuery('#lblinternalcost').html(data[0].azureDetails[0].internalCostestimate);
                jQuery('#lblterms').html(data[0].azureDetails[0].terms);
                jQuery('#lblscopeofwork').html(data[0].azureDetails[0].scopeofwork);
                jQuery('#lbldeliverables').html(data[0].azureDetails[0].deliverables);
                jQuery('#lblapymentterms').html(data[0].azureDetails[0].paymentterms);
                jQuery('#lbltaxesduties').html(data[0].azureDetails[0].applicableTaxduty);
                jQuery('#lblLD').html(data[0].azureDetails[0].whetherLDApplicable);
                jQuery('#lblCPBG').html(data[0].azureDetails[0].whetherCPBGApplicable);
                jQuery('#lblPRDetails').html(data[0].azureDetails[0].prDetails);
                if (data[0].biddingVendor.length > 0) {

                    $('#tblvendorsprev').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th>TPI</th></tr></thead>");
                    for (i = 0; i < data[0].biddingVendor.length; i++) {

                        if (data[0].biddingVendor[i].tpi == "Y") {
                            TPI = "Yes";
                        }
                        else if (data[0].biddingVendor[i].tpi == "NA") {
                            TPI = "NA";
                        }
                        else {
                            TPI = "No";
                        }
                        if (data[0].biddingVendor[i].quotedValidatedSCM == "Y") {
                            validatescm = "Yes";
                        }
                        else if (data[0].biddingVendor[i].quotedValidatedSCM == "NA") {
                            validatescm = "NA";
                        }
                        else {
                            validatescm = "No";
                        }

                        //**** Prev vendor Details Start
                        $('#tblvendorsprev').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + ">" + (data[0].biddingVendor[i].quotationReceived == 'Y' ? 'Yes' : 'No') + "</td><td id=TDTechAccep" + i + ">" + (data[0].biddingVendor[i].texhnicallyAcceptable == 'Y' ? 'Yes' : 'No') + "</td><td id=TDpolexp" + i + ">" + (data[0].biddingVendor[i].politicallyExposed == 'Y' ? 'Yes' : 'No') + "</td><td id=TDvalidatescm" + i + ">" + validatescm + "</td><td id=TPI" + i + ">" + TPI + "</td></tr>")
                        //**** Prev vendor Details end

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
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }

    });
}
var vendorid = 0;
function fetchVendorAutoComplete(index) {
    var returnitem = '';
    $('#vendoridrow' + index).text('0');
    jQuery(".vendorsearch").typeahead({
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
            var status = "true";
            if (map[item].participantID != "0") {
                vendorid = map[item].participantID
                var arr = $("#tblvendorlist >tbody>tr");
                $.each(arr, function (i, item) {
                    var currIndex = $("#tblvendorlist >tbody>tr").eq(i);

                    var matchText = currIndex.find("td:eq(1)").text();
                    $(this).nextAll().each(function (i, inItem) {
                        if (matchText == vendorid) {
                            status = 'false';
                            return false;
                        }
                    });
                });

                if (status == 'false') {
                    $('#vendoridrow' + index).text('0')
                    $('.alert-danger').show();
                    $('#spandanger').html('Vendor is already added.');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                    vendorid = 0;
                }
                else {
                    $('#vendoridrow' + index).text(vendorid)
                    returnitem = item;
                }

            }
            else {
                $('#vendoridrow' + index).text('0')
                gritternotification('Please select Vendor!!!');

            }


            return returnitem;
        }
    });
}
function addvendor() {

    var num = 0;
    var maxinum = -1, i = 0;
    $("#tblvendorlist>tbody>tr").each(function () {
        var this_row = $(this);
        num = (this_row.closest('tr').attr('id')).substring(5, (this_row.closest('tr').attr('id')).length)
        if (parseInt(num) > parseInt(maxinum)) {
            maxinum = num;
        }
    });

    i = parseInt(maxinum) + 1;

    $('#tblvendorlist').append("<tr id=rowOP" + i + "><td><button class='btn green-haze btn-sm' id=addBtn" + i + " type='button' onclick='addvendor()'><i class='fa fa-plus'></i></button><button type='button' id=btnvendordelete" + i + " class='btn btn-sm btn-danger' onclick='deleteLFrow(" + i + ")' ><i class='glyphicon glyphicon-remove-circle'></i></button></td><td class=hide id=vendoridrow" + i + ">" + vendorid + "</td><td width='20%' id=vendorname" + i + " class=form-group ><input type='text' autocomplete='off' class='form-control vendorsearch' placeholder='Search Vendor Name' id=vendorSearch" + i + " name=vendorSearch" + i + "  onkeyup='fnclearcss(" + i + ")' /></td><td id=TDquotationOP" + i + " class='radio-list'></td><td id=TDTechAccepOP" + i + "></td><td id=TDpolyticExpOP" + i + "></td><td id=TDvalidatescmOP" + i + "></td><td id=TPIOP" + i + "></td></tr>")
    $('#TDquotationOP' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotationOP' + i + ' id=OpQuotationOP' + i + ' value="Y" checked /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotationOP' + i + ' id=OpQuotationOP' + i + '  value="N"  />No</label></div>')
    $('#TDTechAccepOP' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccepOP' + i + ' id=OpTechAccepOP' + i + '  value="Y"  checked/> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccepOP' + i + ' id=OpTechAccepOP' + i + ' value="N"  />No</label></div>')
    $('#TDpolyticExpOP' + i).append('<div> <label class="radio-inline"><input type="radio" name=politicalyexpOP' + i + '  value="Y" id=politicalyexpYOP' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=politicalyexpOP' + i + ' value="N"  id=politicalyexpNOP' + i + '  checked />No</label></div>')
    $('#TDvalidatescmOP' + i).append('<div> <label class="radio-inline"><input type="radio" name=QuotedSCMOP' + i + ' value="Y"  id=QuotedSCMYOP' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=QuotedSCMOP' + i + ' value="N"  id=QuotedSCMNOP' + i + ' />No</label><label class="radio-inline"><input type="radio" name=QuotedSCMOP' + i + ' value="NA"  id=QuotedSCMNAOP' + i + ' />NA</label></div>')
    $('#TPIOP' + i).append('<div> <label class="radio-inline"><input type="radio" name=TPIOP' + i + ' value="Y" id=TPIYOP' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=TPIOP' + i + ' value="N"  id=TPINOP' + i + ' />No</label><label class="radio-inline"><input type="radio" name=TPIOP' + i + ' value="NA"  id=TPINAOP' + i + ' />NA</label></div>')
    fetchVendorAutoComplete(i);
    if (i == 0) {
        $('#tblvendorlist').append("<thead><tr><th></th><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:10%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th>TPI</th></tr></thead>");
        $('#btnvendordelete' + i).hide();
    }
    else {
        $('#btnvendordelete' + i).show();
    }




}
function fnclearcss(index) {
    $('#vendorSearch' + index).css("border", "1px solid #e5e5e5");
}

function deleteLFrow(rowid) {

    $('#rowOP' + rowid).remove();

}

//***** Unused Code
