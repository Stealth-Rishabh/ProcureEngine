var APIPath = sessionStorage.getItem("APIPath");
clearsession()
formValidation();
//var form1 = $('#entryForm');
var error1 = $('.alert-danger');
var success1 = $('.alert-success');
var error2 = $('#errormapdiv');
var erroropenbid = $('#errorOpenbid');
var errorremainder = $('#errorsendremainder');
var success2 = $('#successmapdiv');
var successopenbid = $('#successopenbid');
var succesremainder = $('#successremainder');
var currentdate = new Date();
var _RFQBidType = "";
jQuery("#eventDetailstab_0").hide();

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
    'removeMaskOnSubmit': true

});
$('#txtshortname,#txtItemCode,#txtbiddescriptionP,#txtItemRemarks,#txtConversionRate,#txtPono,#txtItemCode,#txttat,#txtRFQ,#txtvendorSurrogateBid,#txtvendor').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

function formValidation() {
    $('#frmExtendDate').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtextendDate: {
                required: true
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

            if (element.attr("name") == "txtextendDate") {

                error.insertAfter("#daterr");

            }
            else {

                error.insertAfter(element);
            }
        },
        success: function (label) {
            label.closest('.col-md-6').removeClass('has-error');
            label.remove();
        },
        submitHandler: function (form) {
            var EndDT = new Date($('#txtextendDate').val().replace('-', ''));
            if (EndDT < currentdate) {
                error1.show();
                $('#spandanger').html('End Date Time must greater than Current Date Time.');
                error1.fadeOut(7000);
                App.scrollTo(error1, -200);
                $("#txtextendDate").closest('.col-md-6').addClass('has-error');
                $("#txtextendDate").val('');

                return false;
            }
            else {
                ExtendDuration();
            }

        }
    });
    //Form Validation for Cancel Reason
    var formaddcommapprover = $('#frmRFQApprover');
    var errorapp = $('.alert-danger', formaddcommapprover);
    var successapp = $('.alert-success', formaddcommapprover);
    formaddcommapprover.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {

        },
        messages: {

        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
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
            if (sessionStorage.getItem('hdnRFQApproverID') != "0" && jQuery("#txtApproverRFQ").val() != "") {

                $('.alert-danger').show();
                $('#spandangerapp').html('Approver not selected. Please press + Button after selecting Approver');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                return false;
            }
            else if ($('#tblRFQapprovers >tbody >tr').length == 0) {
                $('.alert-danger').show();
                $('#spandangerapp').html('Please Map Approver.');
                $('.alert-danger').fadeOut(5000);
                return false;

            }
            else {
                MapRFQapprover('manage');
            }


        }
    });

}

function fetchRFIRFQSubjectforReport() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "eRFQReport/OpeneRFQ/?Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#ddlbid').empty();

            if (data.length > 0) {

                sessionStorage.setItem('hdnAllRFQ', JSON.stringify(data));

            }
            else {

                error1.show();
                $('#spandanger').html('No Open RFQ for which you can invite vendors.!');
                error1.fadeOut(6000);
                App.scrollTo(error1, -200);

            }

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

jQuery("#txtRFQ").typeahead({
    source: function (query, process) {
        var data1 = sessionStorage.getItem('hdnAllRFQ');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data1), function (i, username) {
            map[username.rfqSubject] = username;
            usernames.push(username.rfqSubject);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].rfqid != "0") {
            FetchUOM(sessionStorage.getItem("CustomerID"));
            sessionStorage.setItem('hdnrfqid', map[item].rfqid);
            jQuery("#divresetpassword").show();
            FetchRFQVersion(map[item].rfqid);
            fetchInvitedVendorList(map[item].rfqid)
            FetchVenderNotInvited(map[item].rfqid)
            fetchReguestforQuotationDetails(map[item].rfqid)
            var isRFQChanged = false;

            setTimeout(function () {
                FetchVendorNotsubmittedQuotesPassreset(map[item].rfqid)
                
            }, 1000)
            $('#ddlrfq').val(map[item].rfqid)
            $('#hdnDeadline').val(map[item].rfqDeadline)
            $('#deadlineModal').text(fnConverToLocalTime(map[item].rfqDeadline))
        }
        else {
            gritternotification('Please select RFQ  properly!!!');
            sessionStorage.setItem('hdnrfq', '0');
            $('#inviteVendorBody').hide();
            $('#ddlrfq').val(0)
        }

        return item;
    }

});
jQuery("#txtRFQ").keyup(function () {

    sessionStorage.setItem('hdnbid', '0');
    sessionStorage.setItem("hdnbidtypeid", '0')
    $('#ddlrfq').val(0)

});
function FormValidate() {

    $('#mapsections').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {

            //Second Tab

            txtbiddescriptionP: {
                required: true

            },
            txtedelivery: {
                required: true
            },
            dropuom: {
                required: true
            },
            txtUOM: {
                required: true
            },
            txttargetprice: {
                number: true
            },
            //txtlastinvoiceprice: {
            //    number: true
            //},
            txtquantitiy: {
                required: true,
                number: true
            },
            txtshortname: {
                required: true,
                maxlength: 200
            },
            txtItemCode: {
                // required: true,
                maxlength: 50
            },
            txtItemRemarks: {
                required: true,
                maxlength: 200
            },
            txttat: {
                number: true,
                maxlength: 4
            },
            txtPono: {
                maxlength: 20
                // required: true
            },
            txtunitrate: {
                // required: true,
                number: true
            },
            txtvendorname: {
                // required: true
            },
            txtPODate: {
                // required: true
            },
            txtpovalue: {
                // required: true,
                number: true
            },


        },
        messages: {
        },
        invalidHandler: function (event, validator) { //display error alert on form submit   

        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.col-md-4').addClass('has-error'); // set error class to the control group
            $(element).closest('.col-md-10').addClass('has-error'); // set error class to the control group

        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element).closest('.col-md-4').removeClass('has-error'); // set error class to the control group
            $(element).closest('.col-md-10').removeClass('has-error');
        },

        success: function (label) {
            label.closest('.col-md-4').removeClass('has-error');
            label.closest('.col-md-10').removeClass('has-error');
            label.remove();
        },
        submitHandler: function (form) {

            if ($("#file1").val() != '' && $('#divbidTermsFilePrevtab_0').is(':visible')) {

                InsUpdRFQDEtailTab1();
            }
            else if ($("#txtbidopendatetime").val() != '' && $('#divRFQOpenAfterClosedRFQ_0').is(':visible')) {

                UpdateRFQOPenDateAfterClose();
            }
            else {
                if ($('#dropuom').val() == '') {
                    $('.alert-danger').show();
                    $('#spandanger').html('Please Select UOM Properly');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                    return false;
                }
                else {

                    InsUpdProductSevices();
                }
            }
        }
    });


}
function InsUpdRFQDEtailTab1() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var TermsConditionFileName = '';

    TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
    TermsConditionFileName = TermsConditionFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    var StartDT = new Date();
    if ($('#RFQStartDate').text() != null && $('#RFQStartDate').text() != "") {
        StartDT = new Date($('#RFQStartDate').text().replace('-', ''));
    }

    var EndDT = new Date($('#RFQEndDate').text().replace('-', ''));
    _RFQBidType = sessionStorage.getItem('hdnRFQBidType');
    //** delete Existing File (if any) on Azure
    //fnFileDeleteAzure(TermsConditionFileName, 'eRFQ/' + sessionStorage.getItem('hdnrfqid'))
    var Tab1Data = {

        "RFQId": parseInt(sessionStorage.getItem('hdnrfqid')),
        "RFQSubject": jQuery("#RFQSubject").text(),
        "RFQStartDate": StartDT,
        "RFQEndDate": EndDT,
        "RFQDescription": jQuery("#RFQDescription").text(),
        "RFQCurrencyId": parseInt($('#currencyid').val()),
        "RFQConversionRate": parseFloat(jQuery("#ConversionRate").text()),
        "RFQTermandCondition": TermsConditionFileName,
        "UserId": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "RFQReference": $("#txtRFQReference").text(),
        "RFQApprovers": [],
        "RFQBidType": _RFQBidType,
        "TechnicalApproval": sessionStorage.getItem('techapp')

    };
    //alert(JSON.stringify(Tab1Data))
    //console.log(JSON.stringify(Tab1Data))
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eInsUpdRequestForQuotation",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab1Data),
        dataType: "json",
        success: function (data) {

            fetchReguestforQuotationDetails(sessionStorage.getItem('hdnrfqid'))
            $('.alert-success').show();
            $('#spansuccess1').html('Terms & Condition updated successfully!');
            $('#successmsg').html('Terms & Condition updated successfully!');

            //** Upload Files on Azure PortalDocs folder first Time
            fnUploadFilesonAzure('file1', TermsConditionFileName, 'eRFQ/' + sessionStorage.getItem('hdnrfqid'));


            confirmEditEventAction('File');
            Reset();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }


    });
    jQuery.unblockUI();
}
var isrunnigRFQ = 'N';
function fetchReguestforQuotationDetails(RFQID) {
    

    $("#eventDetailstab_0").show();
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {
            if (sessionStorage.getItem('CustomerID') == "32") {
                $('#ctrladdapprovers').addClass('hide')
            }
            else {
                $('#ctrladdapprovers').removeClass('hide')
            }
            var RFQopenDate = "Not Set";

            sessionStorage.setItem('hdnRFQBidType', RFQData[0].general[0].rfqBidType)
            _RFQBidType = RFQData[0].general[0].rfqBidType
            $("#ctrlFileTerms").attr('onclick', "editRow('divbidTermsFilePrevtab_0', '','')");
            $("#ctrlRFQOpenDates").attr('onclick', "editRow('divRFQOpenAfterClosedRFQ_0', '','')");
            jQuery('#mapedapproverPrevtab_0').html('');

            jQuery('#RFQSubject').text(RFQData[0].general[0].rfqSubject)
            jQuery('#RFQDescription').html(RFQData[0].general[0].rfqDescription)

            $('#currencyid').val(RFQData[0].general[0].rfqCurrencyId)
            $('#Currency').html(RFQData[0].general[0].currencyNm)
            jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate);
            sessionStorage.setItem('techapp', RFQData[0].general[0].technicalApproval)
            if (RFQData[0].general[0].technicalApproval.toLowerCase() == "afterrfq") {
                jQuery('#lbltechnicalApproval').html("After All RFQ Responses")
            }
            else if (RFQData[0].general[0].technicalApproval.toLowerCase() == "rfq") {
                jQuery('#lbltechnicalApproval').html("With individual RFQ Response")
            }
            else {
                jQuery('#lbltechnicalApproval').html("Not Required")
            }
            if (_RFQBidType.toLocaleLowerCase() == 'closed') {
                $("#divRFQOpenDate").show();
                $("#litab2").hide();
                $("#litab2").attr("disabled", "disabled");
                if (RFQData[0].general[0].bidopeningdate != null && RFQData[0].general[0].bidopeningdate != "") {
                    RFQopenDate = fnConverToLocalTime(RFQData[0].general[0].bidopeningdate);
                    jQuery('#lblRFQOpenDate').html(RFQopenDate);
                    jQuery('#lblRFQOpenDate').show();
                    $("#ctrlRFQOpenDates").show();
                }
                else {
                    $('#lblRFQOpenDate').hide();
                    $("#ctrlRFQOpenDates").show();

                }
            }
            else {
                $("#divRFQOpenDate").hide();
                $("#litab2").show();
                $("#litab2").removeAttr("disabled");
            }
            jQuery('#refno').html(RFQData[0].general[0].rfqReference);
            jQuery('#txtRFQReference').html(RFQData[0].general[0].rfqReference)
            jQuery('#RFQStartDate').html(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
            jQuery('#RFQEndDate').html(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
            var CurDateonly = new Date()
            var ENDDTdateonly = new Date(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate).replace('-', ''))
            sessionStorage.setItem("rfqEndDate", ENDDTdateonly)
            //abheedev bug 438 start
            if (ENDDTdateonly < CurDateonly) {
                $('#sendremainder').attr("disabled", "disabled");
                $('#fileToUpload1').attr("disabled", "disabled");
                $('#AttachDescription1').attr("disabled", "disabled");
                $("#Addbtn1").addClass("isDisabledClass");
            }
            else {
                $('#sendremainder').removeAttr("disabled");
                $('#fileToUpload1').removeAttr("disabled");
                $('#AttachDescription1').removeAttr("disabled");
                $("#Addbtn1").removeClass("isDisabledClass");
            }
            //abheedev bug 438 start
            if (RFQData[0].general[0].rfqTermandCondition != '') {
                replaced1 = RFQData[0].general[0].rfqTermandCondition.replace(/\s/g, "%20")
            }
            jQuery('#TermCondition').html(RFQData[0].general[0].rfqTermandCondition)


            if (RFQData[0].parameters.length > 0) {

                $('#wrap_scrollerPrev').show();
                jQuery("#tblServicesProduct").empty();
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>Item Code</th><th>Item/Service</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Delivery Location</th><th>TAT</th><th>Remarks</th><th>PO No.</th><th>Vendor Name</th><th>Unit Rate</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                //for (var i = 0; i < 1; i++) {
                for (var i = 0; i < RFQData[0].parameters.length; i++) {

                    jQuery('<tr id=trid' + i + '><td style="width:70px;!important"><button type="button" style="text-decoration:none;cursur:pointer;" class="btn btn-xs btn-success isDisabledClass" onclick="editRow(\'divParameter\',\'' + RFQData[0].parameters[i].rfqParameterId + '\',\'trid' + i + '\')" ><i class="fa fa-pencil" style="margin-top: 0px !important;"></i></button><td>' + RFQData[0].parameters[i].rfqItemCode + '</td><td>' + RFQData[0].parameters[i].rfqShortName + '</td><td class=text-right>' + thousands_separators(RFQData[0].parameters[i].rfqTargetPrice) + '</td><td class=text-right>' + thousands_separators(RFQData[0].parameters[i].rfQuantity) + '</td><td>' + RFQData[0].parameters[i].rfqUomId + '</td><td>' + RFQData[0].parameters[i].rfqDescription + '</td><td>' + RFQData[0].parameters[i].rfqDelivery + '</td><td class=text-right>' + RFQData[0].parameters[i].tat + '</td><td>' + RFQData[0].parameters[i].rfqRemark + '</td><td>' + RFQData[0].parameters[i].rfqPoNo + '</td><td>' + RFQData[0].parameters[i].rfqVendorName + '</td><td class=text-right>' + thousands_separators(RFQData[0].parameters[i].rfqUnitRate) + '</td><td>' + RFQData[0].parameters[i].rfqpoDate + '</td><td>' + thousands_separators(RFQData[0].parameters[i].rfqpoValue) + '</td></tr>').appendTo("#tblServicesProduct");
                }

            }

            if (RFQData[0].approvers.length > 0) {
                var approvertype = "";
                jQuery('#tblapprovers').empty();
                $('#wrap_scrollerPrevApp').show();
                jQuery('#tblapprovers').append("<thead><tr style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:20%!important'>ApproverType</th><th class='bold' style='width:15%!important'>Sequence</th><th style='width:5%!important' class=hide></th></tr></thead>");

                for (var i = 0; i < RFQData[0].approvers.length; i++) {

                    if (RFQData[0].approvers[i].approverType == "C") {
                        approvertype = "Commercial";

                        jQuery('#mapedapproverPrevtab_0').append(jQuery('<option selected></option>').val(RFQData[0].approvers[i].adminSrNo).html(RFQData[0].approvers[i].userName))
                    }
                    else {
                        approvertype = "Technical";

                    }
                    str = "<tr><td>" + RFQData[0].approvers[i].userName + "</td>";
                    str += "<td>" + RFQData[0].approvers[i].emailID + "</td>";
                    str += "<td>" + approvertype + "</td>";
                    str += "<td>" + RFQData[0].approvers[i].adminSrNo + "</td>";

                    str += "<td class=hide><button type='button' class='btn btn-xs btn-danger' id=Removebtn" + i + " onclick=fnRemoveApprover(\'" + RFQData[0].approvers[i].srNo + "'\,\'" + RFQData[0].approvers[i].approverType + "'\)><i class='glyphicon glyphicon-remove-circle'></i></button></td></tr>";
                    jQuery('#tblapprovers').append(str);
                }
            }

            if (RFQData[0].attachments.length > 0) {
                jQuery("#tblAttachments").empty();

                jQuery('#tblAttachments').append("<thead><tr style='background: gray; color: #FFF;'><th class='bold'>Attachment Description</th><th class='bold'>Attachment</th><th class=hide></th></tr></thead>");
                for (var i = 0; i < RFQData[0].attachments.length; i++) {
                    attach = RFQData[0].attachments[i].rfqAttachment.replace(/\s/g, "%20");
                    var str = "<tr><td style='width:47%!important'>" + RFQData[0].attachments[i].rfqAttachmentDescription + "</td>";
                    // str += '<td class=style="width:47%!important"><a style="pointer:cursur;text-decoration:none;" target=_blank href=PortalDocs/eRFQ/' + RFQID + '/' + attach + '>' + RFQData[0].attachments[i].rfqAttachment + '</a></td>';
                    str += '<td class=style="width:47%!important"><a id=eRFQFile' + i + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)">' + RFQData[0].attachments[i].rfqAttachment + '</a></td>';

                    str += "<td style='width:5%!important' class=hide><button type='button' class='btn btn-xs btn-danger' id=Removebtnattach" + i + " onclick=fnRemoveAttachmentQues(\'" + RFQData[0].attachments[i].srNo + "'\,\'Attachment'\)><i class='glyphicon glyphicon-remove-circle'></i></button></td></tr>";
                    jQuery('#tblAttachments').append(str);
                }
            }




            if (RFQData[0].vendors.length > 0) {

                jQuery("#selectedvendorlistsPrev").empty();
                jQuery("#selectedvendorlistsPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Vendor</th></tr></thead>");
                for (var i = 0; i < RFQData[0].vendors.length; i++) {
                    jQuery('<tr id=trid' + i + '><td class=hide>' + RFQData[0].vendors[i].vendorId + '</td><td>' + RFQData[0].vendors[i].vendorName + '</td></tr>').appendTo("#selectedvendorlistsPrev");
                    if (RFQData[0].vendors[i].rfqStatus == 'C') {
                        isrunnigRFQ = 'Y';

                    }

                }

            }

            var EndDT = new Date($('#RFQEndDate').text().replace('-', ''));

            if (isrunnigRFQ == 'Y' || EndDT < currentdate) {

                $("a.isDisabledClass").removeAttr("onclick");
                $("button.isDisabledClass").removeAttr("onclick");
            }
            //else{
            //    $("a.isDisabledOpenClass").removeAttr("onclick");
            //}

            if (RFQData[0].general[0].finalStatus.toLowerCase() != "not forwarded") {
                $("a.ctrladdapprovers").removeAttr("onclick");
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
    jQuery.unblockUI();
}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hdnrfqid'));
}
function fnRemoveAttachmentQues(srno, deletionfor) {
    var Attachments = {
        "SrNo": srno,
        "DeletionFor": deletionfor,
        "RFQID": sessionStorage.getItem('hdnrfqid')

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
            if (data.length > 0) {
                if (data == "1") {
                    fetchReguestforQuotationDetails(sessionStorage.getItem('hdnrfqid'))
                    $('.alert-success').show();
                    $('#spansuccess1').html('Record deleted successfully!');

                    Metronic.scrollTo($(".alert-success"), -200);
                    $('.alert-success').fadeOut(7000);

                    return false;
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

function editRow(divName, RFQParameterId, rowid) {
    isRFQChanged = true;
    if (divName == 'divParameter') {
        $('#divParameter').removeClass('hide');
        $('#divbidTermsFilePrevtab_0').addClass('hide');
        $('#divRFQOpenAfterClosedRFQ_0').addClass('hide');
        $('#btnclear').removeClass('hide');

    }
    else if (divName == 'divRFQOpenAfterClosedRFQ_0') {
        $('#divRFQOpenAfterClosedRFQ_0').removeClass('hide');
        $('#divParameter').addClass('hide');
        $('#divbidTermsFilePrevtab_0').addClass('hide');
        $('#btnclear').addClass('hide');
        $('#txtbidopendatetime').val($('#lblRFQOpenDate').text());

    }
    else {

        $('#divParameter').addClass('hide');
        $('#divRFQOpenAfterClosedRFQ_0').addClass('hide');
        $('#divbidTermsFilePrevtab_0').removeClass('hide');
        $('#btnclear').addClass('hide');
        // $('#btnsubmit').text('Submit');
    }
    $('#responsive').modal('show');
    var Descriptiontxt = $("#" + rowid).find("td:eq(6)").text().replace(/<br>/g, '\n')
    var RFQRemark = $("#" + rowid).find("td:eq(9)").text().replace(/<br>/g, '\n')

    sessionStorage.setItem('CurrentRFQParameterId', RFQParameterId)

    $('#txtshortname').val($("#" + rowid).find("td:eq(2)").text())
    $('#txtItemCode').val($("#" + rowid).find("td:eq(1)").text())
    $('#txttargetprice').val($("#" + rowid).find("td:eq(3)").text())

    $('#txtquantitiy').val($("#" + rowid).find("td:eq(4)").text())


    $('#txtUOM').val($("#" + rowid).find("td:eq(5)").text())
    $('#dropuom').val($("#" + rowid).find("td:eq(5)").text())

    $('#txtItemRemarks').val(RFQRemark)
    $('#txtbiddescriptionP').val(Descriptiontxt)

    $('#txtedelivery').val($("#" + rowid).find("td:eq(7)").text())
    $("#txttat").val($("#" + rowid).find("td:eq(8)").text())
    $('#txtPono').val($("#" + rowid).find("td:eq(10)").text())
    $('#txtunitrate').val($("#" + rowid).find("td:eq(12)").text())
    $('#txtvendorname').val($("#" + rowid).find("td:eq(11)").text())
    $('#txtPODate').val($("#" + rowid).find("td:eq(13)").text())
    $('#txtpovalue').val($("#" + rowid).find("td:eq(14)").text())
    $('#add_or').text('Modify');
}
function InsUpdProductSevices() {
    var TP = 0;
    var unitrate = 0;
    var povalue = 0;
    if (removeThousandSeperator($('#txttargetprice').val()) != null && removeThousandSeperator($('#txttargetprice').val()) != "") {
        TP = removeThousandSeperator($('#txttargetprice').val());
    }
    if (removeThousandSeperator($('#txtunitrate').val()) != null && removeThousandSeperator($('#txtunitrate').val()) != "") {
        unitrate = removeThousandSeperator($('#txtunitrate').val());
    }
    if (removeThousandSeperator($('#txtpovalue').val()) != null && removeThousandSeperator($('#txtpovalue').val()) != "") {
        povalue = removeThousandSeperator($('#txtpovalue').val());
    }

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />Please Wait...</h5>' });

    var Description = $('#txtbiddescriptionP').val().replace(/\n/g, '<br />').replace(/'/g, " ");
    var Remark = '';
    var data = {
        "RFQParameterId": parseInt(sessionStorage.getItem('CurrentRFQParameterId')),
        "RFQId": parseInt(sessionStorage.getItem('hdnrfqid')),
        "RFQShortName": $('#txtshortname').val(),
        "RFQTargetPrice": parseFloat(TP),
        "RFQItemCode": $('#txtItemCode').val(),
        "RFQuantity": parseFloat(removeThousandSeperator($('#txtquantitiy').val())),
        "RFQUomId": $('#dropuom').val(),
        "RFQRemark": $('#txtItemRemarks').val(),
        "RFQDescription": Description,
        "TAT": parseFloat($("#txttat").val()),
        "RFQDelivery": $("#txtedelivery").val(),
        "RFQPoNo": $("#txtPono").val(),
        "RFQUnitRate": parseFloat(unitrate),
        "RFQVendorName": $("#txtvendorname").val(),
        "RFQPODate": $("#txtPODate").val(),
        "RFQPOValue": parseFloat(povalue),
        "UserId": sessionStorage.getItem('UserID'),

    }
    //console.log(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eInsUpdRFQParameter",
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

                if (isRFQChanged == true) {
                    $("#div_sendEmail").removeClass('hide');
                }
                fetchReguestforQuotationDetails(sessionStorage.getItem('hdnrfqid'))
                $('.alert-success').show();
                $('#spansuccess1').html('RFQ Item Parameter saved successfully!');
                $('#successmsg').html('RFQ Item Parameter saved successfully!');
                Metronic.scrollTo($(".alert-success"), -200);
                $('.alert-success').fadeOut(7000);
                Reset();
                return false;

            }
            else if (data == '2') {

                if (isRFQChanged == true) {

                    $("#div_sendEmail").removeClass('hide');
                }
                fetchReguestforQuotationDetails(sessionStorage.getItem('hdnrfqid'))
                $('.alert-success').show();
                $('#spansuccess1').html('RFQ Item Parameter updated successfully!');
                $('#successmsg').html('RFQ Item Parameter updated successfully!');
                Metronic.scrollTo($(".alert-success"), -200);
                $('.alert-success').fadeOut(7000);
                Reset();
                return false;

            }
            else if (data == '3') {
                $('.alert-danger').show();
                $('#spandanger').html('RFQ Item Parameter with same name already exists.!');
                $('#errormsg').html('RFQ Item Parameter with same name already exists.!');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                return false;
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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

    jQuery.unblockUI();



}
function closeOrSubmitAfterEditEvents() {
    bootbox.dialog({
        message: "You have made changes to the event, Do you want to send notifications to participants.",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    confirmEditEventAction('submit')
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {
                    confirmEditEventAction('close')
                }
            }
        }
    });

}
function confirmEditEventAction(eventType) {

    var Data = {
        "RFQID": parseInt(sessionStorage.getItem('hdnrfqid')),
        "ParamType": eventType,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    }

    // alert(JSON.stringify(Data))
    if (Data != '' || Data != null) {

        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/SendEmailConfirmationEditeRFQDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {


                bootbox.alert("An email notification has been sent to all participants invited for the bid.", function () {
                    // window.location = sessionStorage.getItem('HomePage');
                    return true;
                });


                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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


}
var allUOM = '';
function FetchUOM(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + CustomerID,//  fetchUOM
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#txtUOM").empty();
            if (data.length > 0) {
                allUOM = data;
            }
            else {
                allUOM = '';
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
jQuery("#txtUOM").keyup(function () {
    $('#dropuom').val('')

});
jQuery("#txtUOM").typeahead({
    source: function (query, process) {
        var data = allUOM;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.uom] = username;
            usernames.push(username.uom);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].uom != "") {
            $('#dropuom').val(map[item].uom)
        }
        else {
            gritternotification('Please select UOM  properly!!!');
        }

        return item;
    }

});
function fnAddAnother() {
    sessionStorage.setItem('CurrentRFQParameterId', 0)
    $('#add_or').text('Add');
    $('#txtshortname').val('');
    $('#txttargetprice').val('');
    $('#txtquantitiy').val('');
    $('#dropuom').val('');
    $('#txtUOM').val('');
    $('#txtItemRemarks').val('');
    $('#txtbiddescriptionP').val('');
    $('#txtedelivery').val('');
    $("#txtItemCode").val('');
    $("#txtPono").val('');
    $("#txtunitrate").val('');
    $("#txtvendorname").val('');
    $("#txtPODate").val('');
    $("#txtpovalue").val('');
    jQuery('#file1').val('')
}

$('#responsive').on("hidden.bs.modal", function () {
    $('#txtshortname').closest('.col-md-4').removeClass('has-error');
    $('#txttargetprice').closest('.col-md-4').removeClass('has-error');
    $('#txtquantitiy').closest('.col-md-4').removeClass('has-error');
    $('#txtshortname').closest('.col-md-4').removeClass('has-error');
    $('#txtedelivery').closest('.col-md-4').removeClass('has-error');
    $('#txtItemRemarks').closest('.col-md-4').removeClass('has-error');
    $('#txtbiddescriptionP').closest('.col-md-10').removeClass('has-error');
    $('#txtbidopendatetime').val('')
    $('.help-block').hide();

});
function Reset() {
    sessionStorage.setItem('CurrentRFQParameterId', 0)
    $('#add_or').text('Add');
    $('#txtshortname').val('');
    $('#txttargetprice').val('');
    $('#txtquantitiy').val('');
    $('#dropuom').val('');
    $('#txtUOM').val('');

    $('#txtItemRemarks').val('');
    $('#txtbiddescriptionP').val('');
    $('#txtedelivery').val('');
    $("#txtItemCode").val('');
    $("#txtPono").val('');
    $("#txtunitrate").val('');
    $("#txtvendorname").val('');
    $("#txtPODate").val('');
    $("#txtpovalue").val('');
    $('#responsive').modal('hide');
    jQuery('#file1').val('')
}
function addmoreattachments() {



    
    if (jQuery("#AttachDescription1").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter Attachment Description');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (jQuery('#fileToUpload1').val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Attach File Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }

   

    else {
        var attchname = jQuery('#fileToUpload1').val().substring(jQuery('#fileToUpload1').val().lastIndexOf('\\') + 1)
        attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
        var Attachments = {

            "RFQID": parseInt(sessionStorage.getItem('hdnrfqid')),
            "RFQAttachmentDescription": jQuery("#AttachDescription1").val(),
            "RFQAttachment": attchname

        }

        //alert(JSON.stringify(Attachments))
        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eInsRFQAttachments",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Attachments),
            dataType: "json",
            success: function (data) {
                if (data == "1") {
                    //** Upload Files on Azure PortalDocs folder first Time
                    fnUploadFilesonAzure('fileToUpload1', attchname, 'eRFQ/' + sessionStorage.getItem('hdnrfqid'));


                    fetchReguestforQuotationDetails(sessionStorage.getItem('hdnrfqid'))
                    jQuery("#AttachDescription1").val('')
                    jQuery('#fileToUpload1').val('')
                    $('.alert-success').show();
                    $('#spansuccess1').html('Attachment saved successfully!');
                    Metronic.scrollTo($(".alert-success"), -200);
                    $('.alert-success').fadeOut(7000);
                    confirmEditEventAction('File');

                    return false;

                }
                else if (data == "2") {
                    $('.alert-danger').show();
                    $('#spandanger').html('Attachment is already Exists.');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                    return false;
                }


            },
            error: function (xhr, status, error) {

                var err = eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }

                return false;
                jQuery.unblockUI();
            }

        });
    }
}

function UpdateRFQOPenDateAfterClose() {

    var BidOpenDate = new Date($('#txtbidopendatetime').val().replace('-', ''));
    var CurDateonly = new Date();
    var EndDate = new Date(jQuery('#RFQEndDate').text().replace('-', ''));

    if ($('#txtbidopendatetime').val() == "" || $('#txtbidopendatetime').val() == null) {
        $('.alert-danger').show();
        $('.alert-danger').html('Please Enter A Valid Date');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (BidOpenDate < CurDateonly || BidOpenDate < EndDate) {
        $('.alert-danger').show();
        $('.alert-danger').html('RFQ Open Date cannot be smaller that the End Date or Current Date');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else {
        var DateData = {
            "RFQID": parseInt(sessionStorage.getItem('hdnrfqid')),
            "RFQOpenDate": BidOpenDate
        }
        // alert(JSON.stringify(DateData))
        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQUpdateDate",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(DateData),
            dataType: "json",
            success: function (data) {

                if (data == "1") {
                    fetchReguestforQuotationDetails(sessionStorage.getItem('hdnrfqid'))
                    $('.alert-success').show();
                    $('.alert-success').html('RFQ Open Date updated successfully');
                    Metronic.scrollTo($(".alert-success"), -200);
                    $('.alert-success').fadeOut(7000);
                    //confirmEditEventAction('RFQOpenDate');
                    setTimeout(function () {
                        $('#responsive').modal('hide');
                    }, 2000)

                    return false;
                }
                else if (data == "2") {
                    $('.alert-danger').show();
                    $('.alert-danger').html('You have some error.Please try again!');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                    return false;
                }

            },
            error: function (xhr, status, error) {
                var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                return false;
                jQuery.unblockUI();
            }

        });
    }
    jQuery.unblockUI();
}



function FetchRFQVersion(RFQID) {
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQVersions/?RFQID=" + RFQID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $("#ddlrfqVersion").empty();

            if (data.length > 0) {

                $('#ddlrfqVersion').append(jQuery('<option ></option>').val(data[0].rfqVersionId).html(parseInt(data[0].rfqVersionId) + 1));
                FetchVendorsubmittedQuotes(RFQID);
            }
            

        }, error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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
function fetchInvitedVendorList(rfqid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "eRFQReport/eRFQVendorList/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + rfqid + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&Version=0" + "&Flag=Invited",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                sessionStorage.setItem('hdnAllRFQInvitedVendor', JSON.stringify(data));

                jQuery.unblockUI();
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
var allnoninvitedvendors;
function FetchVenderNotInvited(rfqid) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "eRFQReport/eRFQVendorList/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + rfqid + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&Version=0" + "&Flag=NOTInvited",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#tblvendorlist > tbody").empty();
            if (data.length > 0) {
                allnoninvitedvendors = data;
                $('#inviteVendorBody').show();

            }
            else {

                $('#inviteVendorBody').hide();
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
sessionStorage.setItem('hdnAllRFQInvitedVendorNotSubmitQ', '');
function FetchVendorNotsubmittedQuotesPassreset(rfqid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "eRFQReport/eRFQVendorList/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + rfqid + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&Version=" + $('#ddlrfqVersion').val() + "&Flag=NotCloseQuot",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            // alert(data.length)
            if (data.length > 0) {
                sessionStorage.setItem('hdnAllRFQInvitedVendorNotSubmitQ', JSON.stringify(data));
            }
            else {
                sessionStorage.setItem('hdnAllRFQInvitedVendorNotSubmitQ', '');
            }
            jQuery('#tblparicipantslists> tbody').empty()

            if (data.length > 0) {
                $('#sendremainder').removeClass('hide')
                for (var i = 0; i < data.length; i++) {
                    jQuery('#tblparicipantslists').append("<tr><td class=hide>" + data[i].vendorID + "</td><td class=hide>" + data[i].emailID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spancheckedrem\" class=checked ><input type=\"checkbox\" Onclick=\"Checkrem(this) \";  id=chkvenderrem" + data[i].vendorID + " value=" + data[i].vendorID + " style=\"cursor:pointer\" name=\"chkvenderrem\" checked /></span></div></td><td>" + data[i].vendorName + " " + " ( " + data[i].emailID + " ) </td></tr>");
                }
            }
            else {
                $('#tblparicipantslists').append("<tr><td colspan=2>No vendors Found</td></tr>");
                $('#sendremainder').addClass('hide')
            }
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
    })
}
function fnheckAllremainder() {

    if ($("#chkAllrem").is(':checked') == true) {
        $('#displayTable').find('span#spandynamicrem').hide();
        $('table#tblparicipantslists').closest('.inputgroup').removeClass('has-error');


        $("#tblparicipantslists> tbody > tr").each(function (index) {
            $(this).find("span#spancheckedrem").addClass("checked");
            //$('input[name="chkvenderrem"]').prop('disabled', true);


        });
    }
    else {
        $("#tblparicipantslists> tbody > tr").each(function (index) {
            $(this).find("span#spancheckedrem").removeClass("checked");
            //$('input[name="chkvenderrem"]').prop('disabled', false);

        });

    }


}

function Checkrem(event) {
    if ($(event).closest("span#spancheckedrem").attr('class') == 'checked') {
        $(event).closest("span#spancheckedrem").removeClass("checked")
        if ($("#chkAllrem").attr('checked')) {
            $("#chkAllrem").removeAttr('checked')
        }
    }
    else {
        var EvID = event.id;
        $(event).closest("span#spancheckedrem").addClass("checked")
        $('#displayTable').find('span#spandynamicrem').hide();
        $('table#tblparicipantslists').closest('.inputgroup').removeClass('has-error');

    }

}
jQuery("#txtvendor,#txtvendorSurrogateBid").keyup(function () {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
});






//abheedev surrogate bug 360 start

jQuery("#txtvendor,#txtvendorSurrogateBid").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllRFQInvitedVendorNotSubmitQ');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.vendorName] = username;
            usernames.push(username.vendorName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].vendorID != "0") {

            sessionStorage.setItem('hdnselectedvendor', map[item].vendorID);
            sessionStorage.setItem('hdnselectedEmail', map[item].emailID);

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});

//abheedev surrogate bug 360  end



function resetpasswordForBidVendor() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if (sessionStorage.getItem("hdnrfqid") == '0') {
        error1.show();
        $('#spandanger').html('Please select RFQ...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        gritternotification('Please select RFQ!!!');
        jQuery.unblockUI();

        return false;

    }
    else if (sessionStorage.getItem("hdnselectedvendor") == "0") {
        error1.show();
        $('#spandanger').html('Please select Vendor...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        jQuery.unblockUI();

        return false;
    }
    else {

        jQuery.ajax({
            url: APIPath + "eRFQReport/ResetPasswordeRFQ/?VendorEmail=" + sessionStorage.getItem("hdnselectedEmail") + "&RFQID=" + sessionStorage.getItem("hdnrfqid") + "&VendorID=" + sessionStorage.getItem("hdnselectedvendor") + "&UserId=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: "{}",
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                //if (data = "1") {
                success1.show();
                $('#spansuccess1').html('New password is sent to registered email of vendor..');
                clearsession();
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                jQuery.unblockUI();
                // }
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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


}
function FetchVendorsubmittedQuotes(rfqid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "eRFQReport/eRFQVendorList/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + rfqid + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&Version=" + $('#ddlrfqVersion').val() + "&Flag=CloseQuot",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#tblSubmittedquotesvendor> tbody').empty()

            if (data.length > 0) {

                for (var i = 0; i < data.length; i++) {
                    var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypesQT\"><span  id=\"spancheckedQT\"><input class=\"chkboxwithval\"  type=\"checkbox\" Onclick=\"CheckQT(this)\"; id=\"chkvenderQT\" value=" + (data[i].vendorID + ',' + data[i].emailID) + " style=\"cursor:pointer\" name=\"chkvenderQT\"/></span></div></td><td> " + data[i].vendorName + ' ' + "(" + data[i].emailID + ")</td></tr>";
                    jQuery('#tblSubmittedquotesvendor > tbody').append(str);
                }
                $('#btnopen').removeAttr('disabled')
            }
            else {
                $('#btnopen').attr('disabled', 'disabled')
                jQuery('#tblSubmittedquotesvendor > tbody').append('<tr><td colspan=2  class="text-center">No vendor has submitted quote so far.</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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

function CheckQT(event) {
    if ($(event).closest("span#spancheckedQT").attr('class') == 'checked') {
        $(event).closest("span#spancheckedQT").removeClass("checked")
    }
    else {
        $(event).closest("span#spancheckedQT").addClass("checked")
        $('#divLastversionquoted').find('span#spandynamic').hide();
        $('table#tblSubmittedquotesvendor').closest('.inputgroup').removeClass('has-error');
    }
}
function openVendorsQuotes() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("hdnrfqid") == '0') {
        error1.show();
        $('#spandanger').html('Please select RFQ...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        jQuery.unblockUI();
        gritternotification('Please select RFQ!!!');
        return false;

    }
    else if (ValidateVendorQT() == 'false') {
        FetchVendorsubmittedQuotes(sessionStorage.getItem("hdnrfqid"))
        jQuery.unblockUI();
        return false;

    }
    else {
        var checkedValue = '';
        var temp = new Array();
        $("#tblSubmittedquotesvendor> tbody > tr").each(function (index) {
            if ($(this).find("span#spancheckedQT").attr('class') == 'checked') {
                temp = ($(this).find("#chkvenderQT").val()).split(",");
                checkedValue = checkedValue + temp[0] + '#';
            }
        });
        var _RfqEndDt = new Date(sessionStorage.getItem("rfqEndDate"));
        var _CurrDt = new Date();
        if (_RfqEndDt < _CurrDt) {
            error1.show();
            $('#spandanger').html('The Rfq Date has ended. Please extend Rfq deadline before reopening quotes...');
            error1.fadeOut(3000);
            App.scrollTo(error1, -200);
            jQuery.unblockUI();
            gritternotification('The Rfq Date has ended. Please extend Rfq deadline before reopening quotes!!!');
            return false;

        }
        else {
            var data = {
                "QueryString": checkedValue,
                "RFQID": parseInt(sessionStorage.getItem("hdnrfqid")),
                "VersionID": parseInt($('#ddlrfqVersion').val()),
                "UserID": sessionStorage.getItem("UserID"),
                "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
            }

            jQuery.ajax({
                url: APIPath + "eRFQReport/eRFQOpenQuotesOfSelectedVendor",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                data: JSON.stringify(data),
                type: "POST",
                contentType: "application/json",
                success: function (data) {

                    // if (data[0].IsSuccess == "1") {
                    success1.show();
                    $('#spansuccess1').html("Quotes has been opened Successfully..'");
                    success1.fadeOut(6000);
                    App.scrollTo(success1, -200);
                    FetchVendorsubmittedQuotes(sessionStorage.getItem("hdnrfqid"));
                    clearsession();
                    jQuery.unblockUI();
                    return true;
                    // }
                },

                error: function (xhr, status, error) {

                    var err = xhr.responseText//xhr.responseText//eval("(" + xhr.responseText + ")");
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


    }

}
function ValidateVendorQT() {
    var status1 = "false";
    var evement = "";
    $('#divLastversionquoted').find('span#spancheckedQT').hide();
    $("#tblSubmittedquotesvendor> tbody > tr").each(function (index) {
        if ($(this).find("span#spancheckedQT").attr('class') == 'checked') {
            status1 = "True";
        }
    });
    if (status1 == "false") {
        error1.show();
        $('#spandanger').html('Please select at least one element');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        status1 = "false";
    }
    return status1;
}

function clearsession() {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
    jQuery("#txtvendor").val('');
    $("#tblvendorlist> tbody > tr").each(function (index) {
        $(this).find("span#spanchecked").removeClass("checked");
    });
    $("#tblSubmittedquotesvendor> tbody > tr").each(function (index) {
        $(this).find("span#spancheckedQT").removeClass("checked");
    });
    jQuery("#txtSearch").val('');
    sessionStorage.setItem('hdnVendorID', 0);

}

function ValidateVendor() {
    var status = "false";
    var evement = "";
    $('#divvendorlist').find('span#spandynamic').hide();
    $("#tblvendorlist> tbody > tr").each(function (index) {
        if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            status = "True";
        }
    });
    if (status == "false") {
        error1.show();
        $('#spandanger').html('Please select at least one element');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);

        status = "false";
    }
    return status;
}


function sendremainderstoparicipants() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("hdnrfqid") == '0') {
        errorremainder.show();
        $('#errrem').html('Please select RFQ...');
        errorremainder.fadeOut(3000);
        App.scrollTo(errorremainder, -200);
        jQuery.unblockUI();
        gritternotification('Please select Bid!!!');
        return false;

    }
    else {
        var checkedValue = '';
        //var temp = new Array();
        $("#tblparicipantslists> tbody > tr").each(function (index) {
            if ($(this).find("span#spancheckedrem").attr('class') == 'checked') {
                // vemail = $(this).find("td").eq(1).html();
                vid = $(this).find("td").eq(0).html();
                checkedValue = checkedValue + vid + '#';
            }
        });


        var data = {
            "QueryString": checkedValue,
            "RFQID": parseInt(sessionStorage.getItem("hdnrfqid")),
            "UserID": sessionStorage.getItem("UserID"),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
        }
        //  alert(JSON.stringify(data))
        jQuery.ajax({
            url: APIPath + "eRFQReport/SendRemainderToParticipanteRFQ",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {

                //   if (data == "1") {
                errorremainder.hide();
                succesremainder.show();
                $('#succrem').html('Reminder has been sent Successfully..');

                clearsession();

                succesremainder.fadeOut(3000);
                App.scrollTo(succesremainder, -200);
                jQuery.unblockUI();
                //  }
            },

            error: function (xhr, status, error) {

                var err = xhr.responseText;// eval("(" + xhr.responseText + ")");
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

        return true;
    }
}
function Check(event) {
    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")
    }
    else {
        $(event).closest("span#spanchecked").addClass("checked")
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
    }
}
jQuery("#txtSearch").keyup(function () {
    sessionStorage.setItem('hdnVendorID', '0');

});
sessionStorage.setItem('hdnVendorID', 0);

jQuery("#txtSearch").typeahead({
    source: function (query, process) {
        var data = allnoninvitedvendors;
        usernames = [];
        var vname = '';
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            vname = username.vendorName + ' (' + username.emailID + ')'
            map[vname] = username;
            usernames.push(vname);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].vendorID != "0") {

            sessionStorage.setItem('hdnVendorID', map[item].vendorID);
            $('#btninvitevendors').removeClass('hide')

            var str = "<tr id=TRVendor" + map[item].vendorID + "><td class='hide'>" + map[item].vendorID + "</td><td class=hide>" + map[item].emailID + "</td><td>" + map[item].vendorName + ' (' + map[item].emailID + ')' + " </td><td><button type='button' class='btn btn-xs btn-danger'  onclick=fnremoveVendors(\'" + map[item].vendorID + "'\)><i class='glyphicon glyphicon-remove-circle'></i></button></td></tr>";
            jQuery('#tblvendorlist > tbody').append(str);
            var arr = $("#tblvendorlist tr");

            $.each(arr, function (i, item) {
                var currIndex = $("#tblvendorlist tr").eq(i);
                var matchText = currIndex.children("td").first().text();
                $(this).nextAll().each(function (i, inItem) {
                    if (matchText === $(this).children("td").first().text()) {
                        $(this).remove();
                    }
                });
            });
            jQuery("#txtSearch").val('');

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
function fnremoveVendors(vid) {
    $('#TRVendor' + vid).remove();
    if ($("#tblvendorlist> tbody > tr").length > 0) {
        $('#btninvitevendors').removeClass('hide')
    }
    else {
        $('#btninvitevendors').addClass('hide')
    }
    jQuery("#txtSearch").val('');
    sessionStorage.setItem('hdnVendorID', 0);
}
function invitevendors() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("hdnrfqid") == '0') {
        error1.show();
        $('#spandanger').html('Please select RFQ...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        jQuery.unblockUI();
        gritternotification('Please select RFQ!!!');
        return false;

    }

    else {
        var checkedValue = '';
        var temp = new Array();

        $("#tblvendorlist tr:gt(0)").each(function () {
            var this_row = $(this);
            checkedValue = checkedValue + $.trim(this_row.find('td:eq(0)').html()) + '~' + sessionStorage.getItem('CustomerID') + '#';
        });

        var data = {
            "BidVendors": checkedValue,
            "RFQId": parseInt(sessionStorage.getItem("hdnrfqid")),
            "UserID": sessionStorage.getItem('UserID'),
            "subject": '',
            "Deadline": '',
            "RFQDescription": '',
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
        }

        jQuery.ajax({
            url: APIPath + "eRFQReport/GeteRFQInviteVendorAfterOpen/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                //if (parseInt(data) > 0) {
                success1.show();
                $('#spansuccess1').html('Vendor Invited Successfully..');
                FetchVenderNotInvited(sessionStorage.getItem("hdnrfqid"))
                fetchInvitedVendorList(sessionStorage.getItem("hdnrfqid"))
                FetchVendorNotsubmittedQuotesPassreset(sessionStorage.getItem("hdnrfqid"))
                clearsession()


                success1.fadeOut(3000);
                App.scrollTo(success1, -200);
                jQuery.unblockUI();
                // }
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

        return true;
    }
}

function ExtendDuration() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var BidData = '';
    var _ExtendedDate = new Date($('#txtextendDate').val().replace('-', ''))

    BidData = {
        "RFQID": parseInt(sessionStorage.getItem("hdnrfqid")),
        "ExtendedDate": new Date($('#txtextendDate').val().replace('-', '')),
        "ExtendedBy": sessionStorage.getItem('UserID')

    }
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQExtendDeadline/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function (data) {
            if (data == '1') {
                $('#deadlineModal').text($("#txtextendDate").val())

                success1.show();
                $('#spansuccess1').html("Date extended successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                $("#txtextendDate").val('');
                sessionStorage.removeItem("rfqEndDate");
                sessionStorage.setItem("rfqEndDate", _ExtendedDate)
                jQuery.unblockUI();
                return true;

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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

jQuery("#search").keyup(function () {

    jQuery("#tblvendorlist tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblvendorlist tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tblvendorlist tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});
function saveBidSurrogate() {
    if ($('#bidSurrogateToName').val() == '') {
        error1.find("span").html('Please Fill name.');
        error1.show();
        App.scrollTo(error1, -200);
        error1.fadeOut(4000);
        return false;

    }
    if ($('#bidSurrogateToEmail').val() == '' || validateEmail($('#bidSurrogateToEmail').val()) == false) {
        error1.find("span").html('Please Fill Valid Email.');
        error1.show();
        App.scrollTo(error1, -200);
        error1.fadeOut(4000);
        return false;

    }
    if ($('#bidSurrogateReason').val() == '') {
        error1.find("span").html('Please Fill Surrogate Reason.');
        error1.show();
        App.scrollTo(error1, -200);
        error1.fadeOut(4000);
        return false;

    }
    if (sessionStorage.getItem("hdnrfqid") == "" || sessionStorage.getItem("hdnrfqid") == "0") {
        error1.find("span").html('Please Select RFQ');
        error1.show();
        App.scrollTo(error1, -200);
        error1.fadeOut(4000);
        return false;
    }
    if (sessionStorage.getItem("hdnselectedvendor") == "" || sessionStorage.getItem("hdnselectedvendor") == "0") {
        error1.find("span").html('Please Select Vendor');
        error1.show();
        App.scrollTo(error1, -200);
        error1.fadeOut(4000);
        return false;
    }

    var Data = {
        "Name": $("#bidSurrogateToName").val(),
        "RFQID": parseInt(sessionStorage.getItem("hdnrfqid")),
        "EmailId": $("#bidSurrogateToEmail").val(),
        "Reason": $("#bidSurrogateReason").val(),
        "vendorEmailId": sessionStorage.getItem("hdnselectedEmail"),
        "vendorID": parseInt(sessionStorage.getItem("hdnselectedvendor")),
        "EncryptedLink": "RFQID=" + sessionStorage.getItem('hdnrfqid'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
    // alert(JSON.stringify(Data))
    if (Data != '' || Data != null) {

        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RFQSurrogateSave",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data), 
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {
                // if (data == "1") {
                success1.show();
                $('#spansuccess1').html("Data Successfully saved");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                clearSurrogateForm();
                // }
                //else {
                //    alert("Error.")
                //}

                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" +  + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }

                return false;
                jQuery.unblockUI();
            }
        });
    }
}

function clearSurrogateForm() {
    $('#bidSurrogateToName').val('')
    $('#bidSurrogateToEmail').val('')
    $('#bidSurrogateReason').val('')
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
    jQuery("#txtvendorSurrogateBid").val('')

}