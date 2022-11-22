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
    setTimeout(function () {
        GetOverviewmasterbyId(idx);
    }, 1000)
}

$("#cancelNFABtn").hide();
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
            $('#tblremarksapprover').empty()

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
                        required: true
                    },

                    txtNFADetail: {
                        required: true
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
                    txtProjectName: {
                        required: true
                    }

                },

                messages: {


                },

                errorPlacement: function (error, element) {
                },

                invalidHandler: function (event, validator) {
                    success.hide();
                    Metronic.scrollTo(error, -200);
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

                    var flag = "T";



                    if (index == 1) {

                        if ($('#txtBudget').val() == "" || $('#txtBudget').val() == null) {
                            $('#ddlBudget').val('NB');
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
                        else {
                            Savedata();
                            GetNfaOverviewParams();
                            var PreviewHtml = "Preview <i class='fa fa-eye' aria-hidden='true'></i>";
                            $(".button-next").html(PreviewHtml);

                            if (idx != 0) {
                                BindSaveparams();
                                BindAttachmentsOfEdit();
                            }
                            SaveFirstTabActivity();
                        }

                    }
                    //abheedev bug 385 
                    else if (index == 2) {
                      
                        form.validate();

                        // abheedev backlog 286 start
                        $('.paramremark').rules('add', {
                            required: true,
                            maxlength: 10000

                        });
                        if ($('#tblNFAOverviewParam >tbody >tr').length == 0) {
                            $('#errorSeq').html('You have Some error. Please Check Below!')
                            $('#errordivSeq').show();
                            Metronic.scrollTo($('errordivSeq'), -500);
                            $('#errordivSeq').fadeOut(8000);
                            return false;
                        }
                        if (form.valid() == false) {

                            flag = 'F';
                            $('.alert-danger').show();
                            $('#errorSeq').text('Remarks is required and should be maximum 10000 characters.'); //abheedev backlog 286 
                            Metronic.scrollTo($(".alert-danger"), -500);
                            $('.alert-danger').fadeOut(5000);
                            return false;
                        }
                       
                        if (flag == "T") {
                            
                            
                            Savetab2Data();
                            SaveAttechmentinDB();
                            BindAttachmentsOfEdit();
                            Bindtab3Data();
                            // abheedev backlog 286 end
                        }
                    }
                    //abheedev bug 385 end
                    handleTitle(tab, navigation, index);
                    if (ApproverCtr === 0)
                        $('.button-submit').hide();

                },

                onPrevious: function (tab, navigation, index) {

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
    if ($(this).val() == 1)
        $(".isProject").hide();

    else
        $(".isProject").show();
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
//abheedev backlog 286
function GetOverviewmasterbyId(idx) {
    var url = "NFA/GetNFAOverViewsById?CustomerID=" + parseInt(CurrentCustomer) + "&idx=" + parseInt(idx);
    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {

            if (res.result.length > 0) {
                setTimeout(function () {
                    GetEventRefData();
                    $("#txtEventref").val(res.result[0].eventReftext);
                    $("#txtTitle").val(res.result[0].nfaSubject);
                    $("#txtNFADetail").val(res.result[0].nfaDescription);
                    $("#ddlEventType").val(res.result[0].eventID);
                    sessionStorage.setItem("hdnEventrefId", res.result[0].eventRefernce);
                    sessionStorage.setItem('hdnEventForID', res.result[0].bidForID);
                }, 900)

                $("#cancelNFABtn").show();
                sessionStorage.setItem('hdnNFAID', idx);
                //abheedev bug385 start
                $("#txtAmountFrom").val(res.result[0].nfaAmount).toLocaleString(sessionStorage.getItem("culturecode"));
                $("#txtBudget").val(res.result[0].nfaBudget).toLocaleString(sessionStorage.getItem("culturecode"));
                //abheedev bug385 end
                $("#ddlCategory").val(res.result[0].nfaCategory);
                $("#dropCurrency").val(res.result[0].nfaCurrency);
                CKEDITOR.instances['txtRemark'].setData(res.result[0].remarks);;



                if (res.result[0].nfaCategory == 1) {

                    $(".isProject").hide();
                }
                else {
                    $(".isProject").show();
                }
                $("#txtProjectName").val(res.result[0].projectName);
                $("#ddlBudget").val(res.result[0].budgetStatus);

                $("#ddlPurchaseOrg").val(res.result[0].purchaseOrg);
                setTimeout(function () {
                    bindPurchaseGroupDDL()
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
    GetEventRefData();

})
function GetEventRefData() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var EventTypeId = $("#ddlEventType option:selected").val();
    $("#txtEventref").val('');
    $("#txtTitle").val('');
    $("#txtNFADetail").val('');
    sessionStorage.setItem("hdnEventrefId", 0);
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
//abheedev amountbudget start
$("#txtBudget").focusout(function () {

    if ($('#txtBudget').val() == "" || $('#txtBudget').val() == null) {
        $('#ddlBudget').val('NB');

    }
    //abheedev bug 385 start
    else if (parseFloat(removeThousandSeperator($('#txtBudget').val())) < parseFloat(removeThousandSeperator($('#txtAmountFrom').val()))) {

        $('#ddlBudget').val('OB');

    }
    else {
        $('#ddlBudget').val('WB');

    }
});//abheedev bug 385 end
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
//abheedev amountbudget end
sessionStorage.setItem("hdnEventrefId", 0);
sessionStorage.setItem("hdnEventForID", 0);
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

            $('#txtTitle').val("NFA -" + map[item].bidSubject)
            $('#txtNFADetail').val(map[item].bidDetails)

        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }
});


function fnaddQuestion() {
    fnApproversNBQuery(parseInt($("#ddlNFAParam option:selected").val()), $("#ddlNFAParam option:selected").text());/*, $("#txtNfaParamAns").val()*/
}

function fnApproversNBQuery(rownum, question) {

    if (jQuery("#ddlNFAParam").val() == "0" || jQuery("#ddlNFAParam").val() == "") {
        $('#errordivSeq').show();
        $('#errorSeq').html('Response not selected. Please press + Button after selecting Response');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);

        return false;
    }

    var status = true
    $("#tblNFAOverviewParam tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(3)').html()) == $("#ddlNFAParam").val()) {
            status = false
        }
    });

    if (status == false) {
        $('#errordivSeq').show();
        $('#errorSeq').html('NFA Response is already mapped for this NFA overview.');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);

        return false;
    }
    else {
        //abheedev backlog 286 start

        if (!jQuery("#tblNFAOverviewParam thead").length) {
            jQuery("#tblNFAOverviewParam").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:40%!important'>Description</th><th class='bold' style='width:55%!important'>Description</th></tr></thead>");
            jQuery("#tblNFAOverviewParam").append('<tr id=trNfaParam' + rownum + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNFAParams(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td id=ques' + rownum + '>' + question + '</td><td class=clsTA><textarea name=paramremark' + rownum + '  rows=2 class="form-control paramremark"  onkeyup="replaceQuoutesFromString(this)" autocomplete=off id=paramremark' + rownum + ' maxlength=10000></textarea></td><td class=hide>' + rownum + '</td></tr>');
        }
        //abheedev backlog 286 end
        else {
            jQuery("#tblNFAOverviewParam").append('<tr id=trNfaParam' + rownum + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNFAParams(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td id=ques' + rownum + '>' + question + '</td><td  class=clsTA><textarea name=paramremark' + rownum + '  rows=2 class="form-control paramremark"  onkeyup="replaceQuoutesFromString(this)" autocomplete=off id=paramremark' + rownum + ' maxlength=10000 ></textarea></td><td class=hide>' + rownum + '</td></tr>');
        }


        $("#ddlNFAParam").val('');
        $('#nfaparamoption' + rownum).remove();

    }
    //abheedev backlog 286 start
    form.validate();
    $('#paramremark' + rownum).rules('add', {
        required: true,
        // minlength: 50,
        maxlength: 10000,
    });
    $('#paramremark' + rownum).maxlength({
        limitReachedClass: "label label-danger",
        alwaysShow: true
    });
}
//abheedev backlog 286 end
function deleteNFAParams(rowid) {
    $('#ddlNFAParam').append('<option value=' + rowid + ' id=nfaparamoption' + rowid + ' >' + $('#ques' + rowid).text() + '</option>');
    $('#trNfaParam' + rowid).remove();

}

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
        rowAttach = rowAttach + 1;


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




jQuery("#txtDetails").keyup(function () {
    sessionStorage.setItem("hdnNfaOverviewIdx", 0);

});
sessionStorage.setItem("hdnNfaOverviewIdx", 0);
$("#txtDetails").typeahead({
    source: function (query, process) {
        var data = NFAOverviewDetails;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {

            map[username.nfaOverview] = username;

            usernames.push(username.nfaOverview);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].nfaID != "0") {


            sessionStorage.setItem('hdnNfaOverviewIdx', map[item].nfaID);

            idx = parseInt(map[item].nfaID);
            GetOverviewmasterbyId(idx);

        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }
});

var orgData = [];
function BindPurchaseOrg() {


    var url = "NFA/GetPurchaseOrgByUserid?CustomerId=" + parseInt(CurrentCustomer) + "&UserId=" + encodeURIComponent(UserID);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {

        $("#ddlModelOrg,#ddlPurchaseOrg").empty();
        $('#ddlModelOrg').append('<option value="0">Select</option>');
        if (res.result.length > 0) {

            $.each(res.result, function (key, value) {
                $('#ddlModelOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');
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

$("#txtProjectName").on("keyup", function () {
    $("#txtProjectName").css("border-color", "");
});


//abheedev backlog 286
function Savedata() {
    var overviewList = [];
    var p_title = $("#txtTitle").val();
    var p_descript = $("#txtNFADetail").val();

    var p_amount = removeThousandSeperator($("#txtAmountFrom").val());
    var _budget = 0;
    if ($("#txtBudget").val() != '') {
        _budget = parseInt($("#txtBudget").val());
    }
    var p_Budget = removeThousandSeperator(_budget);
    var p_category = $("#ddlCategory option:selected").val();
    var p_currency = $("#dropCurrency option:selected").val();
    var p_projectname = $("#txtProjectName").val();
    var budgetStatus = $("#ddlBudget option:selected").val();
    var p_eventType = $("#ddlEventType option:selected").val();
    var p_eventID = sessionStorage.getItem("hdnEventrefId");
    //  var p_remark = $("#txtRemark").val();
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

    var url = "NFA/InsUpdateNfaoverview";

    var GetData = callajaxReturnSuccess(url, "Post", JSON.stringify(overviewList));

    GetData.success(function (res) {
        if (res.result != null) {

            if (res.result.length > 0) {

                idx = res.result[0].nfaID;

            }
        }
        if (idx == 0) {
            fnErrorMessageText('spandanger', 'form_wizard_1');
        }
    });
    GetData.error(function (res) {

    });

};

function Savetab2Data() {
    debugger
    var url = "NFA/InsUpdateOverViewParamText?customerId=" + parseInt(CurrentCustomer) + "&NfaIdx=" + parseInt(idx);

    Paramdata = [];
    objData = {};
    $("#tblNFAOverviewParam tr:gt(0)").each(function () {
        var this_row = $(this);
        var remarks = $.trim(this_row.find('td:eq(2)').find('textarea').val()).replace(/'/g, "''");

        objData = {
            Paramidx: parseInt($.trim(this_row.find('td:eq(3)').html())),
            paramtext: $.trim(this_row.find('td:eq(1)').html()),
            paramremark: remarks

        };
        Paramdata.push(objData);


    });

    var SaveparamData = callajaxReturnSuccess(url, "Post", JSON.stringify(Paramdata));
    SaveparamData.success(function (res) {

    });
    SaveparamData.error(function (error) {

    });



};
function GetNfaOverviewParams() {

    var url = "NFA/FetchSavedOverviewParam?customerid=" + parseInt(CurrentCustomer) + "&nfaidx=" + parseInt(idx) + "&For=nfrequestNotselected&Purchaseorg=" + $('#ddlPurchaseOrg option:selected').val();

    var ParamData = callajaxReturnSuccess(url, "Get", {})
    ParamData.success(function (res) {

        if (res != null) {
            $("#ddlNFAParam").empty();
            if (res.result.length > 0) {
                $("#ddlNFAParam").append("<option value=0>Select</option>");
                $.each(res.result, function (key, value) {
                    $('#ddlNFAParam').append('<option value=' + value.idx + ' id=nfaparamoption' + value.idx + ' >' + value.paramtext + '</option>');
                });
            }
            else {
                $("#ddlNFAParam").append("<option value=0>Select</option>");
            }
        }
        else {
            $("#ddlNFAParam").append("<option value=0>Select</option>");
        }
    })
}
function BindSaveparams() {

    var url = "NFA/FetchSavedOverviewParam?customerid=" + parseInt(CurrentCustomer) + "&nfaidx=" + parseInt(idx) + "&For=nfrequest&Purchaseorg=" + $('#ddlPurchaseOrg option:selected').val();

    var ParamData = callajaxReturnSuccess(url, "Get", {})
    ParamData.success(function (res) {

        if (res != null) {

            $("#tblNFAOverviewParam").empty();
            if (res.result.length > 0) {
                $("#tblNFAOverviewParam").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:40%!important'>Description</th><th class='bold' style='width:55%!important'>Response</th></tr></thead>");
                $.each(res.result, function (key, value) {

                    //abheedev backlog 286 start
                    if (value.flDefault == 'Y')
                        $("#tblNFAOverviewParam").append('<tr id=trNfaParam' + value.idx + '><td><button class="btn  btn-xs btn-danger disabled" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td id=ques' + value.idx + ' >' + value.paramtext + '</td><td class=clsTA><textarea name=paramremark' + value.idx + '  rows=2 class="form-control paramremark"  onkeyup="replaceQuoutesFromString(this)" autocomplete=off id=paramremark' + value.idx + ' maxlength=10000 >' + value.paramRemark + '</textarea></td><td class=hide>' + value.idx + '</td></tr>');
                    else
                        $("#tblNFAOverviewParam").append('<tr id=trNfaParam' + value.idx + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNFAParams(' + value.idx + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td id=ques' + value.idx + ' >' + value.paramtext + '</td><td class=clsTA><textarea name=paramremark' + value.idx + ' rows=2 class="form-control paramremark"  onkeyup="replaceQuoutesFromString(this)" autocomplete=off id=paramremark' + value.idx + ' maxlength=10000 >' + value.paramRemark + '</textarea></td><td class=hide>' + value.idx + '</td></tr>');
                    //abheedev backlog 286 end
                    form.validate();

                    $('#paramremark' + value.idx).rules('add', {
                        required: true,
                        maxlength: 10000 //abheedev backlog 286 

                    });

                    $('#paramremark' + value.idx).maxlength({
                        limitReachedClass: "label label-danger",
                        alwaysShow: true
                    });
                });

            }

        }
        else {
            $("#tblNFAOverviewParam").hide();
        }
    })
}


function Bindtab3Data() {
    BindParamsForpreview();
    Bindtab1DataforPreview();
    FetchMatrixApprovers();
}
function BindParamsForpreview() {
    $("#tblOBpreview").empty();
    $("#tblOBpreview").append("<thead><tr><th class='bold' style='width:50%!important'>Description</th><th class='bold' style='width:40%!important'>Response</th></tr></thead>");
    $("#tblNFAOverviewParam tr:gt(0)").each(function () {
        var this_row = $(this);
        var Nfidvalue = parseInt($.trim(this_row.find('td:eq(3)').html()))

        $("#tblOBpreview").append('<tr id=trNFAOverviewParam' + Nfidvalue + '><td>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td>' + $('#paramremark' + Nfidvalue).val() + '</td><td class=hide>' + Nfidvalue + '</td></tr>');

    });

}
//abheedev backlog 286
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
    $("#lblProjectName").text($("#txtProjectName").val());
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
    var groupId = $('#ddlPurchasegroup option:selected').val()//sessionStorage.getItem("hdnPurchaseGroupID");
    var orgid = $('#ddlPurchaseOrg option:selected').val();//sessionStorage.getItem("hdnPurchaseORGID");
    var conId = $('#ddlCondition option:selected').val();//sessionStorage.getItem("hdnConditionID");
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
            bootbox.alert("NFA Request Submitted Successfully.", function () {
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

function SaveAttechmentinDB() {
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
                    rowAttach = ++key;
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

    var SaveActivityDetails = callajaxReturnSuccess(url, "Post", JSON.stringify(aquaticCreatures));
    SaveActivityDetails.success(function (res) {
        lstActivityData = [];
    });
    SaveActivityDetails.error(function (error) {

    })
}




$("#addNfaText").on("click", function () {
    BindData();
});
function onSave() {
    var str = $('#txtParamText').val();
    if (/^[a-zA-Z0-9- ]*$/.test(str) == false) {
        alert('Special characters not allowed.');
        return false;
    }
    if (Validate()) {
        return false;
    }
    SaveUpdate();
};

function onClear() {
    $("#txtParamText").val('');
};


function Validate() {
    var nfaText = false;
    if ($("#txtParamText").val() == "") {
        $("#txtParamText").css("border-color", "red");
        $("#error").text("Param text is required");
        $("#errordiv").show();
        nfaText = true;
    }
    else {
        $("#txtParamText").css("border-color", "");
        $("#errordiv").hide();
        $("#error").text('');
        nfaText = false;
    }
    if (nfaText)
        return true;
    else
        return false;
};

$("#txtParamText").on("keyup", function () {
    $("#txtParamText").css("border-color", "");
    $("#errordiv").hide();
    $("#error").text('');
})
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


            GetNfaOverviewParams();
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