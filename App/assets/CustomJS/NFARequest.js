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
    },1000)
}
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
                        $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')
                    }
            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }

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
                    txtPurcOrg: {
                        required: true
                    },
                    txtPurcGroup: {
                        required: true
                    },
                    txtAmountFrom: {
                        required: true,
                        number: true,
                        minlength: 1,
                        maxlength: 18//3
                    }




                },

                messages: {


                    //ddlPurchaseOrg: {
                    //    required: "Please select purchase org."
                    //},

                    //ddlPurchasegroup: {
                    //    required: "Please select purchase group"
                    //},
                    //txtAmountFrom: {
                    //    required: "Please Enter Amount from."
                    //},
                    //txtAmountTo: {
                    //    required: "Please Enter Amount To."
                    //}
                },

                errorPlacement: function (error, element) {



                },

                invalidHandler: function (event, validator) {
                    success.hide();
                    Metronic.scrollTo(error, -200);

                },

                highlight: function (element) {

                    $(element)
                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');
                    $(element)
                        .closest('.col-md-4').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-3').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-2').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-6').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element)
                        .closest('.inputgroup').removeClass('has-error');
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

                            form.validate();
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Check Highlighted Fileds');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

                        }
                        if (ValidTeTab1()) {
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Check Highlighted Fileds');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;
                        }
                        Savedata();//Save First Tab data

                        GetNfaOverviewParams();
                        //   BindApprovers();
                        var PreviewHtml = "Preview <i class='fa fa-eye' aria-hidden='true'></i>";
                        $(".button-next").html(PreviewHtml);

                        if (idx != 0) {
                            BindSaveparams();
                            BindAttachmentsOfEdit();

                        }
                        SaveFirstTabActivity();//Insert Activity in ActivityDetails Table

                    } else if (index == 2) {
                        if ($('#tblNFAOverviewParam >tbody >tr').length == 0) {
                            $('#errorSeq').html('You have Some error. Please Check Below!')
                            $('#errordivSeq').show();
                            Metronic.scrollTo($('errordivSeq'), -200);
                            $('#errordivSeq').fadeOut(5000);

                            return false;
                        }
                        Savetab2Data();
                        SaveAttechmentinDB();
                        Bindtab3Data();
                    }
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
                SaveApproversConfirmation();
               
                // CompleteProcess();

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

function GetOverviewmasterbyId(idx) {
    var url = "NFA/GetNFAOverViewsById?CustomerID=" + parseInt(CurrentCustomer) + "&idx=" + parseInt(idx);
    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {

            if (res.result.length > 0) {
                $("#txtTitle").val(res.result[0].nfaSubject);
                $("#txtNFADetail").val(res.result[0].nfaDescription);
               
                sessionStorage.setItem('hdnPurchaseORGID', res.result[0].purchaseOrg);
                sessionStorage.setItem('hdnPurchaseGroupID', res.result[0].purchaseGroup);

                $("#txtAmountFrom").val(res.result[0].nfaAmount);
                $("#ddlCategory").val(res.result[0].nfaCategory);
                $("#dropCurrency").val(res.result[0].nfaCurrency);
                $("#txtProjectName").val(res.result[0].projectName);
                $("#ddlBudget").val(res.result[0].budgetStatus);
                $("#ddlEventType").val(res.result[0].eventID);
                $("#txtEventref").val(res.result[0].eventReftext);
                sessionStorage.setItem("hdnEventrefId", res.result[0].eventRefernce);
                $("#txtPurcOrg").val(res.result[0].orgName);
                $("#txtPurcGroup").val(res.result[0].groupName);
                $("#txtRemark").val(res.result[0].remarks);

            }
        }
    });
    GetData.error(function (res) {
        jQuery.unblockUI();
    });
};

var objEventData = [];

$("#ddlEventType").on("change", function () {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var EventTypeId = $(this).val();
    $("#txtEventref").val('');
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
})
function GetEventRefData() {

};
$("#txtEventref").keyup(function () {
    sessionStorage.setItem("hdnEventrefId", 0);
    $("#txtEventref").css("border-color", "");
});


sessionStorage.setItem("hdnEventrefId", 0);
$("#txtEventref").typeahead({
    source: function (query, process) {
        var data = objEventData;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            // console.log(data);
            map[username.refText] = username;

            usernames.push(username.refText);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].refId != "0") {


            sessionStorage.setItem('hdnEventrefId', map[item].refId);


            // GetApprovermasterbyId(nfaApproverIDX);
        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }
});


//$("#txtNfaParamAns").on("change", function () {

   

//});
function fnaddQuestion() {
    fnApproversNBQuery(parseInt(sessionStorage.getItem("hdnParamIdx")), $("#txtNFAParam").val(), $("#txtNfaParamAns").val());
}

function fnApproversNBQuery(rownum, question, remark) {

    if ($("#txtNfaParamAns").val() == "") {
        $('#errordivSeq').show();
        $('#errorSeq').html('Please specify Response for Question');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);

        return false;
    }
    if (rownum == "0" || jQuery("#txtNFAParam").val() == "") {
        $('#errordivSeq').show();
        $('#errorSeq').html('Question not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);

        return false;
    }

    var status = true
    $("#tblNFAOverviewParam tr:gt(0)").each(function () {
        var this_row = $(this);

        if ($.trim(this_row.find('td:eq(3)').html()) == sessionStorage.getItem('hdnParamIdx')) {
            status = false

        }
    });

    if (status == false) {
        $('#errordivSeq').show();
        $('#errorSeq').html('NFA param is already mapped for this NFA overview.');
        Metronic.scrollTo($("#errordivSeq"), -200);
        $('#errordivSeq').fadeOut(7000);

        return false;
    }
    else {
        var rowApp = rownum;
        if (!jQuery("#tblNFAOverviewParam thead").length) {
            jQuery("#tblNFAOverviewParam").append("<thead><tr><th style='width:10%!important'></th><th class='bold' style='width:50%!important'>Question</th><th class='bold' style='width:40%!important'>Remark</th></tr></thead>");
            jQuery("#tblNFAOverviewParam").append('<tr id=trNfaParam' + rowApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNFAParams(' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + question + '</td><td>' + remark + '</td><td class=hide>' + rownum + '</td></tr>');
        }
        else {
            jQuery("#tblNFAOverviewParam").append('<tr id=trNfaParam' + rowApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNFAParams(' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + question + '</td><td>' + remark + '</td><td class=hide>' + rownum + '</td></tr>');
        }

        sessionStorage.setItem("hdnParamIdx", 0);
        $("#txtNFAParam").val('');
        $("#txtNfaParamAns").val('');
        $("#txtNFAParam").select();
    }
}
function deleteNFAParams(rowid) {
   
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
        if (!jQuery("#tblAttachmentsPrev thead").length) {
            jQuery('#tblAttachmentsPrev').append("<thead><tr><th class='bold'>Attachment Description</th><th class='bold'>Attachment</th></tr></thead>");
            var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        }
        else {
            var strprev = '<tr id=trAttachidprev' + rowAttach + '><td style="width:47%!important">' + jQuery("#AttachDescription1").val() + '</td>';
        }


        strprev += '<td class=style="width:47%!important"><a id=aeRFQFilePrev' + rowAttach + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + attchname + '</a></td>';
        jQuery('#tblAttachmentsPrev').append(strprev);


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


    //** File delete from Blob or DB 
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
                //  fileDeletefromdb(closebtnid, fileid, filepath, deletionFor, srno);
                $('#' + filepath).html('')
                $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
                $('#' + fileid).attr('disabled', false);
            }
            else {
                if (srno != 0) {
                    // fileDeletefromdb(closebtnid, fileid, filepath, deletionFor, srno);
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


var NfaParams = [];
function GetNfaOverviewParams() {
    var url = "NFA/GetNfaParams?CustomerID=" + parseInt(CurrentCustomer);


    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        if (res.result != null) {

            if (res.result.length > 0) {
                NfaParams = res.result;
            }
        }
    });
    GetData.error(function (res) {
        jQuery.unblockUI();
    });


};
$("#txtNFAParam").keyup(function () {
    sessionStorage.setItem("hdnParamIdx", 0);

});


sessionStorage.setItem("hdnParamIdx", 0);
$("#txtNFAParam").typeahead({
    source: function (query, process) {
        var data = NfaParams;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            // console.log(data);
            map[username.paramtext] = username;

            usernames.push(username.paramtext);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].idx != "0") {


            sessionStorage.setItem('hdnParamIdx', map[item].idx);

            $("#txtNfaParamAns").select();
            // GetApprovermasterbyId(nfaApproverIDX);
        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }
});





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
            // console.log(data);
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
            // GetApprovermasterbyId(nfaApproverIDX);
        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }
});

var orgData = [];
function BindPurchaseOrg() {


    var url = "NFA/GetPurchaseOrg?CustomerId=" + parseInt(CurrentCustomer);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {
        $("#ddlModelOrg").html('');
        $('#ddlModelOrg').append('<option value="0">Please Select..</option>');
        if (res.result.length > 0) {
            orgData = res.result;
            $.each(res.result, function (key, value) {
                $('#ddlModelOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');


            });


        }

    });
    GetNFAPARAM.error(function (error) {
        console.log(error);

    });


};

$("#cancelNFABtn").on("click", function () {
    window.location.reload();
});

var Groupdata = [];
function bindPurchaseGroupDDL(orgID) {

    var url = "NFA/GetPurchaseGroupByID?CustomerId=" + parseInt(CurrentCustomer) + "&OrgId=" + parseInt(orgID);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {

        if (res.result.length > 0) {

            Groupdata = res.result;

        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
    });

};
jQuery("#txtPurcOrg").keyup(function () {
    sessionStorage.setItem('hdnPurchaseORGID', '0');

});
sessionStorage.setItem('hdnPurchaseORGID', '0');
jQuery("#txtPurcOrg").typeahead({
    source: function (query, process) {
        var data = orgData;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            // console.log(data);
            map[username.purchaseOrgName] = username;

            usernames.push(username.purchaseOrgName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].purchaseOrgID != "0") {


            sessionStorage.setItem('hdnPurchaseORGID', map[item].purchaseOrgID);
            bindPurchaseGroupDDL(map[item].purchaseOrgID);
        }
        else {
            gritternotification('Purchase Group not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }

});
jQuery("#txtPurcGroup").keyup(function () {
    sessionStorage.setItem('txtPurcGroup', '0');

});
sessionStorage.setItem('hdnPurchaseGroupID', '0');
jQuery("#txtPurcGroup").typeahead({
    source: function (query, process) {
        var data = Groupdata;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            // console.log(data);
            map[username.groupName] = username;

            usernames.push(username.groupName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].idx != "0") {


            sessionStorage.setItem('hdnPurchaseGroupID', map[item].idx);

        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }

});

$("#txtPurcOrg").on("keyup", function () {
    $("#txtPurcOrg").css("border-color", "");
});
$("#txtPurcGroup").on("keyup", function () {
    $("#txtPurcGroup").css("border-color", "");
});
$("#txtProjectName").on("keyup", function () {
    $("#txtProjectName").css("border-color", "");
});

function ValidTeTab1() {

    var v_org = false;
    var v_group = false;
    var ProjectName = false;
    var Eventref = false;
    if (sessionStorage.getItem("hdnPurchaseORGID") == "0") {
        $("#txtPurcOrg").css("border-color", "red");
        v_org = true;
    }
    else {
        $("#txtPurcOrg").css("border-color", "");
        v_org = false;
    }
    if (sessionStorage.getItem("hdnPurchaseGroupID") == "0") {
        $("#txtPurcGroup").css("border-color", "red");
        v_group = true;
    }
    else {
        $("#txtPurcGroup").css("border-color", "");
        v_group = false;
    }
    if ($("#ddlCategory").val() == "0" && $("#txtProjectName").val() == "") {
        $("#txtProjectName").css("border-color", "red");
        ProjectName = true;
    }
    else {
        $("#txtProjectName").css("border-color", "");
        ProjectName = false;
    }
    if ($("#ddlEventType").val() != "0" && sessionStorage.getItem("hdnEventrefId") == 0) {
        $("#txtEventref").css("border-color", "red");
        Eventref = true;
    }
    else {
        $("#txtEventref").css("border-color", "");
        Eventref = false;
    }

    if (v_org || v_group || ProjectName || Eventref)
        return true;
    else
        return false;
}

function Savedata() {


    var overviewList = [];


    var p_title = $("#txtTitle").val();
    var p_descript = $("#txtNFADetail").val();
    var p_org = sessionStorage.getItem('hdnPurchaseORGID');;
    var p_Group = sessionStorage.getItem('hdnPurchaseGroupID');
    var p_amount = removeThousandSeperator($("#txtAmountFrom").val());
    var p_category = $("#ddlCategory option:selected").val();
    var p_currency = $("#dropCurrency option:selected").val();
    var p_projectname = $("#txtProjectName").val();
    var budgetStatus = $("#ddlBudget option:selected").val();
    var p_eventType = $("#ddlEventType option:selected").val();
    var p_eventID = sessionStorage.getItem("hdnEventrefId");
    var p_remark = $("#txtRemark").val();

    var model = {
        CustomerID: parseInt(CurrentCustomer),
        NfaID: parseInt(idx),
        NfaSubject: p_title,
        NfaDescription: p_descript,
        NfaAmount: parseFloat(p_amount),
        NfaCurrency: p_currency,
        NfaCategory: p_category,
        ProjectName: p_projectname,
        BudgetStatus: budgetStatus,
        EventRefernce: p_eventID,
        EventID: parseInt(p_eventType),
        Remarks: p_remark,
        PurchaseOrg: parseInt(p_org),
        PurchaseGroup: parseInt(p_Group),
        CreatedBy: UserID,
        UpdatedBy: UserID
    }
    overviewList.push(model);
    console.log(overviewList)
    var url = "NFA/InsUpdateNfaoverview";

    var GetData = callajaxReturnSuccess(url, "Post", JSON.stringify(overviewList));
    //alert(JSON.stringify(overviewList))
    console.log(JSON.stringify(overviewList))
    GetData.success(function (res) {
        if (res.result != null) {
           
            if (res.result.length > 0) {

                idx = res.result[0].nfaID;
                console.log(idx);
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
    var url = "NFA/InsUpdateOverViewParamText?customerId=" + parseInt(CurrentCustomer) + "&NfaIdx=" + parseInt(idx);

    Paramdata = [];
    objData = {};
    $("#tblNFAOverviewParam tr:gt(0)").each(function () {
        var this_row = $(this);
        objData = {
            Paramidx: parseInt($.trim(this_row.find('td:eq(3)').html())),
            paramtext: $.trim(this_row.find('td:eq(1)').html()),
            paramremark: $.trim(this_row.find('td:eq(2)').html()),

        };
        Paramdata.push(objData);

    });

    var SaveparamData = callajaxReturnSuccess(url, "Post", JSON.stringify(Paramdata));
    SaveparamData.success(function (res) {

    });
    SaveparamData.error(function (error) {

    });



};

function BindSaveparams() {
    var url = "NFA/FetchSavedOverviewParam?customerid=" + parseInt(CurrentCustomer) + "&nfaidx=" + parseInt(idx);

    var ParamData = callajaxReturnSuccess(url, "Get", {})
    ParamData.success(function (res) {

        if (res != null) {
            $("#tblNFAOverviewParam").empty();
            if (res.result.length > 0) {
                $("#tblNFAOverviewParam").append("<thead><tr><th style='width:10%!important'></th><th class='bold' style='width:50%!important'>Question</th><th class='bold' style='width:40%!important'>Response</th></tr></thead>");
                $.each(res.result, function (key, value) {
                    $("#tblNFAOverviewParam").append('<tr id=trNfaParam' + value.idx + '><td><button class="btn  btn-xs btn-danger" onclick="deleteNFAParams(' + value.idx + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + value.paramtext + '</td><td>' + value.paramRemark + '</td><td class=hide>' + value.idx + '</td></tr>');

                });

            }

        }
        else {
            $("#tblNFAOverviewParam").hide();
        }
    })
}


//Tab 3 Data
function Bindtab3Data() {
    BindParamsForpreview();
    Bindtab1DataforPreview();
    FetchMatrixApprovers();
}
function BindParamsForpreview() {
    $("#tblOBpreview").empty();
    $("#tblOBpreview").append("<thead><tr><th class='bold' style='width:50%!important'>Param Text</th><th class='bold' style='width:40%!important'>Remark</th></tr></thead>");
    $("#tblNFAOverviewParam tr:gt(0)").each(function () {
        var this_row = $(this);

        $("#tblOBpreview").append('<tr id=trNFAOverviewParam' + parseInt($.trim(this_row.find('td:eq(3)').html())) + '><td>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td>' + $.trim(this_row.find('td:eq(2)').html()) + '</td><td class=hide>' + parseInt($.trim(this_row.find('td:eq(3)').html())) + '</td></tr>');

    });

}

function Bindtab1DataforPreview() {
    $("#lbltitle").text($("#txtTitle").val());
    $("#lblDetails").text($("#txtNFADetail").val());
    $("#lblAmount").text($("#txtAmountFrom").val());
    $("#lblCurrency").text($("#dropCurrency option:selected").text());
    $("#lblCategory").text($("#ddlCategory option:selected").text());
    $("#lblProjectName").text($("#txtProjectName").val());
    $("#lblbudget").text($("#ddlBudget option:selected").text());
    $("#lblPurOrg").text($("#txtPurcOrg").val());
    $("#lblGroup").text($("#txtPurcGroup").val());
    $("#lblEventType").text($("#ddlEventType option:selected").text());
    $("#lblEventId").text($("#txtEventref").val());
    $("#lblRemark").text($("#txtRemark").val());
}

function FetchMatrixApprovers() {
    var amount = removeThousandSeperator($("#txtAmountFrom").val());
    var groupId = sessionStorage.getItem("hdnPurchaseGroupID");
    var orgid = sessionStorage.getItem("hdnPurchaseORGID");
    budgetType = $("#ddlBudget option:selected").val();
    BindApprovers(amount, groupId, orgid, budgetType);
};

function BindApprovers(amount, groupId, orgid, budgetType) {

    var url = "NFA/FetchNFAApprovers?customerId=" + parseInt(CurrentCustomer) + "&userID=" + UserID + "&amount=" + parseFloat(amount) + "&groupId=" + parseInt(groupId) + "&orgid=" + parseInt(orgid) + "&budgetType=" + budgetType + "&NFAID=" + parseInt(idx);
 
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
                $("#errorApproverdivSeq").show();
                $("#errorApproverSeq").html("No Approver(s) find for selected Apprval matrix (BudgetType: " + $("#ddlBudget option:selected").text() + ",Amount: " + $("#txtAmountFrom").val() + ",Org: " + $("#txtPurcOrg").val() + ",Group: " + $("#txtPurcGroup").val() + ")");


                Metronic.scrollTo($("#errorApproverdivSeq"), -200);
                $('#errorApproverdivSeq').fadeOut(9000);
            }
        }
    });
    GetData.error(function (res) {
        ApproverCtr = 0;
        jQuery.unblockUI();
    });

}

function SaveApproversConfirmation() {
    var approversData = [];
    var _data = {};


    var url = "NFA/InsUpdateOverViewApprovers?customerId=" + parseInt(CurrentCustomer) + "&NfaIdx=" + parseInt(idx) + "&isReverted=" + isReverted;
   // var isActive = $("#chkPrevIsActive").is(':checked');
    //if (isActive == false) {

    //    $("#errorApproverdivSeq").show();
    //    $("#errorApproverSeq").html('Please Check confirmation checkbox for Approvers');


    //    Metronic.scrollTo($("#errorApproverdivSeq"), -200);
    //    $('#errorApproverdivSeq').fadeOut(5000);
    //    return false;
    //}
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
        //UpdateFirstTabActivity();
        if (res.status == "S") {
            bootbox.dialog({
                message: "Do you want to continue?",
                // title: "Custom title",
                buttons: {
                    confirm: {
                        label: "Yes",
                        className: "btn-success",
                        callback: function () {
                            bootbox.alert("NFA Request Submitted Successfully.", function () {
                                window.location.href = "NFARequest.html";
                                return false;
                            });
                            
                        }
                    },
                    cancel: {
                        label: "No",
                        className: "btn-default",
                        callback: function () {
                            window.location.href = "index.html";
                        }
                    }
                }
            });
        }
            else {
            alert("Error: " + res.error);
        }

    });
    SubmitData.error(function (error) {

    });


}

function SaveAttechmentinDB() {
    var url = "NFA/InsUpdateNFAFiles?customerId=" + parseInt(CurrentCustomer) + "&NfaIdx=" + parseInt(idx);
    var lstFiles = [];
    var objFiles = {};


    $("#tblAttachments > tbody  > tr").each(function () {
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
      /*  LinkURL: "N",*/
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
    console.log(data);
    var aquaticCreatures = data.filter(function (details) {
        return details.apprSeq == ApprSeqval.min();
    });

    console.log(aquaticCreatures);
    var url = "NFA/InsUpdateActivityDetails?NFAID=" + parseInt(idx);
    
    var SaveActivityDetails = callajaxReturnSuccess(url, "Post", JSON.stringify(aquaticCreatures));
    SaveActivityDetails.success(function (res) {
        lstActivityData = [];
    });
    SaveActivityDetails.error(function (error) {

    })
}



//PARAMETER TEXT MASTER ADD LOGIC

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
                    Status = "<span>Active</span>"; /*class='badge badge-pill badge-success'*/
                else
                    Status = "<span>In-Active</span>"; /*class='badge badge-pill badge-danger'*/

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
            //  BindData();
            NfaParams = [];
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

//function UpdateFirstTabActivity() {

//    objActivity = {
//        FromUserId: UserID,
//        ToUserId: UserID,
//        ActivityDescription: $("#txtTitle").val(),
//        /* LinkURL: "Y",*/
//        NfaIdx: parseInt(idx)
//    }
//    var url = "NFA/InsertFirstTabActivity";

//    var firstTab = callajaxReturnSuccess(url, "Post", JSON.stringify(objActivity));
//    firstTab.success(function (res) {

//    });
//    firstTab.error(function (error) {

//    });

//}
