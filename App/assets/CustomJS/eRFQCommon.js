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
$('#txtloadingfactorreason').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
function fetchRFIRFQSubjectforReport(subjectFor) {

    jQuery.ajax({
        //url: sessionStorage.getItem("APIPath") + "eRFQReport/fetchRFQSubjectforReport/?SubjectFor=" + subjectFor + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        url: sessionStorage.getItem("APIPath") + "eRFQReport/fetchRFQSubjectforReport/?SubjectFor=" + subjectFor + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            sessionStorage.setItem('hdnRfqSubject', JSON.stringify(data));
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }
    });

}

jQuery("#txtrfirfqsubject").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnRfqSubject');
        Subject = [];
        map = {};
        var commonsubject = "";
        jQuery.each(jQuery.parseJSON(data), function (i, commonsubject) {
            map[commonsubject.rfqSubject] = commonsubject;
            Subject.push(commonsubject.rfqSubject);
        });

        process(Subject);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].rfqid != '0') {

            $('#hdnRfqID').val(map[item].rfqid);
            FetchRFQVersion();
            fetchReguestforQuotationDetails()
            fetchRFQApproverStatus(map[item].rfqid);
            /*if (sessionStorage.getItem('CustomerID') == "32") {
                fetchRFQPPCApproverStatus(map[item].rfqid);
            }
            else {
                fetchRFQApproverStatus(map[item].rfqid);
            }*/

            fetchAttachments();
            fetchApproverRemarks('C');
        }

        return StringDecodingMechanism(item);
    }

});
function fnForwardforAllvendorTechnical() {
    bootbox.dialog({
        message: "Do you want to forward response to Technical Approver, Click Yes for  Continue ",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                    MapApprover();
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
function MapApprover() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var Approvers = {
        "ApproverType": "T",
        "Approvers": '',
        "RFQID": parseInt($('#hdnRfqID').val()),
        "CreatedBy": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/eRFQTechInsApprover",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {
            jQuery('#btn_techmapaaprover').attr("disabled", "disabled");
            $('.alert-success').show();
            $('#success').html('Approver mapped successfully!');
            Metronic.scrollTo($('alert-success'), -200);
            $('.alert-success').fadeOut(7000);
            jQuery.unblockUI();
            return true;

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
function fetchApproverRemarks(Type) {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/FetchApproverRemarks/?RFQID=" + $('#hdnRfqID').val() + "&ApprovalType=" + Type,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $('#tblCommercialApproval').empty()
            $('#tblCommercialApprovalprev').empty()
            if (data.length > 0) {

                $('#tblCommercialApproval').removeClass('hide')
                $('#tblCommercialApprovalprev').removeClass('hide')
                $('#tblCommercialApproval').append('<tr><th>Action</th><th>For</th><th>Remarks</th><th  class=hide>Action Type</th><th>Date</th></tr>')
                $('#tblCommercialApprovalprev').append('<tr><th>Action</th><th>For</th><th>Remarks</th><th class=hide>Action Type</th><th>Date</th></tr>')
                for (var i = 0; i < data.length; i++) {

                    $('#tblCommercialApproval').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].forwardedTo + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                    $('#tblCommercialApprovalprev').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].forwardedTo + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')

                }
            }
            else {
                $('#tblCommercialApproval').addClass('hide')
                $('#tblCommercialApprovalprev').addClass('hide')
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
                $('#tblapprovalprocessprev').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');

            }
            jQuery.unblockUI();
            return false;

        }
    })
}
var str = '';
function checkForSelectedVendors() {


    //getting value for Checked Checheck boxes
    $(".chkReinvitation:checked").each(function (x, i) {
        str += $(this).val() + ',';
    });
    if (str == '') {
        $("#error").html("PLease select atleast one vendor");
        $(".alert-danger").show();
        Metronic.scrollTo($(".alert-danger"), -200);
        $(".alert-danger").fadeOut(7000);
        return false;
    }
    else {

        if (sessionStorage.getItem("RFQBidType") == "Closed") {

            $("#rfqopendategroup").show()
        }
        else {
            $("#rfqopendategroup").hide()
        }
        $("#modalreInviteDate").modal("show");

    }

}



function Dateandtimevalidate() {

    var EndDT = new Date();
    if ($('#txtextendDate').val() != null && $('#txtextendDate').val() != "") {
        EndDT = $('#txtextendDate').val().replace('-', '');
    }

    let EtTime =
        new Date(EndDT.toLocaleString("en", {
            timeZone: sessionStorage.getItem('preferredtimezone')
        }));

    ST = new String(EtTime);
    ST = ST.substring(0, ST.indexOf("GMT"));
    ST = ST + 'GMT' + sessionStorage.getItem('utcoffset');

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
        crossDomain: true,
        data: JSON.stringify(Tab1Data),
        dataType: "json",
        success: function (data) {
            if (data == "1") {
                ReInviteVendorsForRFQ();
            }
            else {
                $('#error_deaddate').show();
                $("#txtextendDate").closest('.col-md-6').addClass('has-error');
                $("#txtextendDate").val('');
                $('#errorinviteversion').text('End Date Time must greater than Current Date Time.');
                Metronic.scrollTo($("#error_deaddate"), -200);
                $('#error_deaddate').fadeOut(7000);
                return false;
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

function ReInviteVendorsForRFQ() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    str = str.substring(0, str.length - 1);
    $('#SaveExsist').attr('disabled', 'disabled')
    var _bod = null;
    var EndDT = new Date();
    let BT = null;
    if ($('#txtextendDate').val() != null && $('#txtextendDate').val() != "") {
        EndDT = $('#txtextendDate').val().replace('-', '');
    }

    let EtTime =
        new Date(EndDT.toLocaleString("en", {
            timeZone: sessionStorage.getItem('preferredtimezone')
        }));

    ST = new String(EtTime);
    ST = ST.substring(0, ST.indexOf("GMT"));
    ST = ST + 'GMT' + sessionStorage.getItem('utcoffset');
    if ($('#txtrfqopenDate').val() != null && $('#txtrfqopenDate').val() != "") {

        _bod = $('#txtrfqopenDate').val().replace('-', '');

        let BOTime = new Date(_bod.toLocaleString("en", {
            timeZone: sessionStorage.getItem('preferredtimezone')
        }));
        if (BOTime < EtTime) {

            jQuery.unblockUI();
            $("#error_deaddate").html("RFQ open date cannot be less than RFQ end date");
            $("#error_deaddate").show();

            $("#error_deaddate").fadeOut(7000);
            $('#SaveExsist').removeAttr('disabled')
            return false;

        }
        BT = new String(BOTime);
        BT = BT.substring(0, BT.indexOf("GMT"));
        BT = BT + 'GMT' + sessionStorage.getItem('utcoffset');
    }
    var data = {
        "RFQID": parseInt($("#hdnRfqID").val()),
        "VendorIDs": str,
        //"ExtendedDate": new Date($("#txtextendDate").val().replace('-', '')),
        "ExtendedDateST": ST,
        "BidOpenDtSt": BT,
        "RFQSubject": $("#RFQSubject").html(),
        "UserID": sessionStorage.getItem("UserID"),
        "ReInviteRemarks": $("#txtReInviteRemarks").val(),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))

    }
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQ_ReInviteVendor/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            $("#modalreInviteDate").modal("hide");
            bootbox.alert("Re-Invitation For RFQ sent successfully", function () {
                location.reload();
                $('#SaveExsist').removeAttr('disabled')
                jQuery.unblockUI();
            });


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {




                $("#error_deaddate").html(err);
                $("#error_deaddate").show();
                Metronic.scrollTo($(".alert-danger"), -200);
                $("#error_deaddate").fadeOut(7000);
                $('#SaveExsist').removeAttr('disabled')




            }
            setTimeout(function () {
                $("#modalreInviteDate").modal("hide");
            }, 500)

            jQuery.unblockUI();


        }

    });


}


$('#btnPDF').click(function () {
    var encrypdata = fnencrypt("RFQID=" + $("#hdnRfqID").val() + "&FromPage=Analysis&BidID=" + 0 + "&Version=" + $('#ddlrfqVersion').val())
    var url = "ViewReportRFQ.html?param=" + encrypdata;
    var win = window.open(url, "_blank");
    win.focus();

})
jQuery("#cancl_btn").click(function () {
    $('#modalcancelremarks').modal('show');

});

function cancelBtnclick() {
    bootbox.dialog({
        message: "Are you sure want to cancel this bid?",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {

                    bootbox.dialog({
                        message: "Do you want to send cancellation email to participants for this RFQ?",
                        buttons: {
                            confirm: {
                                label: "Yes",
                                className: "btn-success",
                                callback: function () {
                                    $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                                    cancelRFQ('SendMail')
                                }
                            },
                            cancel: {
                                label: "No",
                                className: "btn-default",
                                callback: function () {
                                    $('.modal-footer .btn-default').prop('disabled', true); //abheedev button duplicate
                                    cancelRFQ('NoMail')
                                }
                            }
                        }
                    });
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
function cancelRFQ(mailparam) {
    var Cancelbid = {
        "BidID": parseInt($("#hdnRfqID").val()),
        "For": 'eRFQ',
        "Remarks": $('#txtRemarks').val(),
        "SendMail": mailparam,
        "UserID": sessionStorage.getItem('UserID')
    };
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/CancelBidDuringConfig",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(Cancelbid),
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            bootbox.alert("RFQ Cancelled successfully.", function () {
                window.location = "index.html";
                return false;
            });

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');

            }
            jQuery.unblockUI();
        }
    });
}

var TechnicalApproval = "";
var bidopeningdate = null;
var _rfqBidType = '';
var CurrentDateTime = new Date();
var _openQuotes = '';
var isboq = 'N';
var ShowPrice = 'Y';

function fetchReguestforQuotationDetails() {
    var attachment = '';
    var termattach = '';
    debugger
    console.log(sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val())
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data) {
            
            let RFQData=Data.rData
            var _curentRFQStatus = '';
            var replaced1 = '';
            $('#tbldetailsExcel > tbody').empty();
            if (RFQData.length > 0) {
                _rfqBidType = RFQData[0].general[0].rfqBidType;
                _openQuotes = RFQData[0].general[0].openQuotes;
                bidopeningdate = RFQData[0].general[0].bidopeningdate;
                sessionStorage.setItem('RFQBidType', _rfqBidType);
                sessionStorage.setItem('OpenQuotes', _openQuotes);
                _curentRFQStatus = RFQData[0].general[0].rfqStatus;

                ShowPrice = RFQData[0].general[0].showQuotedPrice;

                sessionStorage.setItem('CurrentRFQStatus', _curentRFQStatus)

                if (_rfqBidType == 'Closed') {
                    $('#div_bidopendate').show()
                    if (bidopeningdate != null) {
                        bidopeningdate = fnConverToLocalTime(bidopeningdate);
                        jQuery('#lblrfqopendate').html(bidopeningdate)
                    }
                    else {
                        jQuery('#lblrfqopendate').html('Not Set')
                    }
                }
                else {
                    $('#div_bidopendate').hide()
                }
                if (_curentRFQStatus.toLowerCase() == 'cancel') {
                    $('#cancl_btn').hide();

                }
                if (RFQData[0].general[0].boqReq == true) {
                    isboq = "Y";
                    fetchrfqcomprativeBoq();
                }
                else {
                    isboq = "N";
                    fetchrfqcomprative();
                }
                /*else {
                    $('#cancl_btn').hide();

                }*/
                //abheedev 26/12/2022
                let _cleanStringSub = StringDecodingMechanism(RFQData[0].general[0].rfqSubject);
                let _cleanStringDesc = StringDecodingMechanism(RFQData[0].general[0].rfqDescription);
                jQuery('#RFQSubject').text(_cleanStringSub)
                jQuery('#RFQDescription').html(_cleanStringDesc)
                $('#Currency').html(RFQData[0].general[0].currencyNm)
                jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate);
                jQuery('#refno').html(RFQData[0].general[0].rfqReference)

                jQuery('#RFQStartDate').html(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
                jQuery('#RFQDeadline').html(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
                jQuery('#lblrfqconfigby').html(RFQData[0].general[0].rfqConfigureByName)
                $('#hdnUserID').val(RFQData[0].general[0].userId)
                $('#TermCondition').html(RFQData[0].general[0].rfqTermandCondition)
                TechnicalApproval = RFQData[0].general[0].technicalApproval;
                $('#tbldetails').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + fnConverToLocalTime(RFQData[0].general[0].rfqEndDate) + "</td></tr>")

                $('#tbldetailsExcel > tbody').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqId + "</td><td>" + RFQData[0].general[0].rfqReference + "</td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + fnConverToLocalTime(RFQData[0].general[0].rfqStartDate) + "</td><td>" + fnConverToLocalTime(RFQData[0].general[0].rfqEndDate) + "</td><td colspan='25'>" + RFQData[0].general[0].rfqDescription + "</td></tr>")
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spnerror', '');
            }
            jQuery.unblockUI();
            return false;

        }
    });

}
$("#ddlrfqVersion").change(function () {
    $("#displayTable").hide();
    $('#displayComparativetabs').hide();
    $("#btnExport").hide();
    $("#btnPDF").hide()
    $("#btnDownloadFile").hide()
});

jQuery("#txtSearch").keyup(function () {
    _this = this;
    jQuery.each($("#tblRFQComprative tbody").find("tr"), function () {

        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});
var max = 0;
function FetchRFQVersion() {
    max = 0;
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/efetchRFQVersions/?RFQID=" + $('#hdnRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        async: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $("#ddlrfqVersion").empty();
            if (data.length > 0) {
                $('#ddlrfqVersion').append('<option  value="99" >Final Version</option>');

                max = data[0].rfqVersionId;
                for (var i = 0; i <= data[0].rfqVersionId; i++) {
                    $('#ddlrfqVersion').append(jQuery('<option ></option>').val(i).html((i + 1) + " Quote"));

                }
            }

        }, error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }
    });

}
function RFQFetchL1Package(VendorID, Counter) {
    debugger
    var xyz = sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchL1Package/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&BidID=0"
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchL1Package/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&BidID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            debugger
            $("#withoutGSTL1Rank" + VendorID).html(thousands_separators((data[0].totalL1RankWithoutGST).round(2)));
            $("#withoutGSTL1RankExcel" + VendorID).html(thousands_separators((data[0].totalL1RankWithoutGST).round(2)));
            $("#withGSTL1Rank" + VendorID).html(thousands_separators((data[0].totalL1RankWithGST).round(2)));
            $("#withGSTL1RankExcel" + VendorID).html(thousands_separators((data[0].totalL1RankWithGST).round(2)));
            $("#totL1Rank" + VendorID).html(thousands_separators((data[0].totalL1RankWithoutGST).round(2)));
            $("#totL1RankExcel" + VendorID).html(thousands_separators((data[0].totalL1RankWithoutGST).round(2)));

        }, error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spnerror', '');
            }
            jQuery.unblockUI();
            return false;

        }
    });
}
var rowques = 0;
function editwithgstlambdafactor(pricewithgst, rowid, vendorid) {
    $("#editloadingfactor").modal('show');
    $("#tblLoadingFactor").empty();
    $("#hdngstprice").val(pricewithgst);
    $("#hdnvendorid").val(vendorid);
    var Data = {
        "RFQID": parseInt($('#hdnRfqID').val()),
        "VersionID": parseInt(sessionStorage.getItem("RFQVersionId")),
        "VendorID": parseInt($("#hdnvendorid").val())
    }
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQfetchLoadingFactor/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {



            if (data.length > 0) {

                if (!jQuery("#tblLoadingFactor thead").length) {
                    //abheedev bug 462
                    jQuery('#tblLoadingFactor').append("<thead style='width:100%!important'><tr style=\"background: gray; color: #FFF;\"><th class='bold' style='width:50%!important'>Reason</th><th class='bold' style='width:25%!important'>Loading Factor</th><th class='bold' style='width:25%!important'>Amount</th><th></th><th></th></tr></thead>");
                }
            }
            for (i = 0; i < data.length; i++) {
                rowques = i + 1
                var strprev = '<tr  data-row=' + rowques + ' id=trLFid' + rowques + ' ><td id=trLFReason' + rowques + '>' + data[i].loadingFactorReason + "</td>"
                strprev += "<td id=trLFType" + rowques + " style='display:none;'>" + data[i].loadingFactorType + "</td>"
                if (data[i].loadingFactorType == 'P') {
                    strprev += "<td id=trLFValue" + rowques + ">" + data[i].loadingFactorPer + "%</td>"
                }
                else {
                    strprev += "<td id=trLFValue" + rowques + ">" + data[i].loadingFactor + "INR</td>"
                }

                strprev += '<td id=trLFAmount' + rowques + '>' + data[i].loadingFactor + '</td>';


                if (!jQuery("#tblLoadingFactor thead").length) {
                    jQuery('#tblLoadingFactor').append("<thead><tr style='width:100%!important'><th class='bold' style='width:50%!important'>Reason</th><th class='bold' style='width:25%!important'>Type</th><th class='bold' style='width:25%!important'>Amount</th><th></th></tr></thead>");
                }

                strprev += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteLFrow(trLFid' + rowques + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:5%!important"><button type=button class="btn btn-xs btn-success"  onclick="editLFrow(trLFid' + rowques + ')" ><i class="fa fa-pencil"></i></button></td></tr>';
                jQuery('#tblLoadingFactor').append(strprev);




            }
        }
    })
}

//abheedev bug 462
//abheedev loadingfactor 24/11/2022
function updloadingfactor() {

    var tabItems = '', eRFQLoadingTerms = [];
    var oTable = document.getElementById('tblLoadingFactor');
    var rowCount = oTable.rows.length;
    var isSubmit = false;
    if (rowCount > 1) {
        for (i = 1; i < rowCount; i++) {
            var _LFPer = 0;
            var _LFReason = document.getElementById("tblLoadingFactor").rows[i].cells.item(0).innerHTML;
            var _LFType = document.getElementById("tblLoadingFactor").rows[i].cells.item(1).innerHTML;
            var _LF = document.getElementById("tblLoadingFactor").rows[i].cells.item(3).innerHTML;
            _LF = parseFloat(_LF)

            if (_LFType == 'P') {
                var perVal = document.getElementById("tblLoadingFactor").rows[i].cells.item(2).innerHTML;
                perVal = parseFloat(perVal.replace('%', '')).toFixed(2);
                _LFPer = parseFloat(perVal).toFixed(2);
                _LFPer = parseFloat(_LFPer);
            }
            else {
                _LFPer = 0;
            }
            tabItems = {
                "LoadingFactor": _LF,
                "LoadingFactorReason": _LFReason,
                "LoadingFactorType": _LFType,
                "LoadingFactorPer": _LFPer
            }
            eRFQLoadingTerms.push(tabItems);
            isSubmit = true;
        }
    }
    else {
        eRFQLoadingTerms.pop();
        isSubmit = true;
    }

    if (isSubmit) {
        var Data = {
            "RFQID": parseInt($('#hdnRfqID').val()),
            "VersionID": parseInt(sessionStorage.getItem("RFQVersionId")),
            "VendorID": parseInt($("#hdnvendorid").val()),
            "ERFQLoadingTerms": eRFQLoadingTerms
        }
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQSetLoadingFactor/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                //abheedev bug 349 start
                setTimeout(function () {
                    $("#editloadingfactor").modal('hide');
                    if (isboq == "Y") {
                        fetchrfqcomprativeBoq();
                    }
                    else {
                        fetchrfqcomprative();
                    }
                }, 1000)
                rowques = 0;

            },
            error: function (xhr, status, error) {
                var err = xhr.responseText
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spnerror', '');
                }
                jQuery.unblockUI();
                return false;
            }
        })
    }
    else {

    }
}
//abheedev bug 462 end
$("#editloadingfactor").on("hidden.bs.modal", function () {
    $("#txtloadingfactor").val('')
    $("#hdngstprice").val('');
    $("#hdnvendorid").val('');
    $("#txtloadingfactorreason").val('');
});

function fetchAttachments() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val() + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + $('#hdnRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data, status, jqXHR) {
            debugger
            let data=Data.rData;
            
            jQuery("#tblAttachments").empty();
            
            if (data[0].attachments.length > 0) {
                jQuery("#tblAttachments").append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")

                for (var i = 0; i < data[0].attachments.length; i++) {
                    var str = "<tr><td style='width:50%!important'>" + data[0].attachments[i].rfqAttachmentDescription + "</td>";
                   
                  if(Data.showQuotedPrice.showQoutedPrice=='Y') {
                     str += '<td class=style="width:50%!important"><a id=eRFqTerm' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFile(this)" href="javascript:;" >' + data[0].attachments[i].rfqAttachment + '</a></td>';
                     
                  }
                  else{
                     str += '<td class=style="width:50%!important"></td>';
                      
                  }
                    
                    jQuery('#tblAttachments').append(str);

                }
            }
            else {
                jQuery('#tblAttachments').append("<tr><td>No Attachments</td></tr>");

            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }
    })
}
function DownloadFile(aID) {
    debugger
    console.log($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val())
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + $('#hdnRfqID').val());
}
function fnDownloadZip() {
    var prefix = 'eRFQ/' + $('#hdnRfqID').val()
    fetch(sessionStorage.getItem("APIPath") + "BlobFiles/DownloadZip/?Prefix=" + prefix)
        .then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'Download.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            downloadexcel();
            bootbox.alert("File downloaded Successfully.", function () {
                return true;
            });

        })
}


function RFQFetchTotalPriceForReport(VendorID, Counter) {

    
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchTotalPriceForReport/?RFQID=" + $('#hdnRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&BidID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {


            $("#totBoxwithoutgst" + VendorID).html(thousands_separators((data[0].totalPriceExTax).round(2)) + " &nbsp;<a class='lambdafactor' style='cursor:pointer' onclick=editwithgstlambdafactor(" + data[0].totalPriceExTax + "," + Counter + "," + VendorID + ")><i class='fa fa-pencil'></i></a>");
            $("#totBoxwithoutgstExcel" + VendorID).html(thousands_separators((data[0].totalPriceExTax).round(2)));
            $("#totBoxwithgst" + VendorID).html(thousands_separators((data[0].totalPriceIncTax).round(2)));
            $("#totBoxwithgstExcel" + VendorID).html(thousands_separators((data[0].totalPriceIncTax).round(2)));
            $("#totBoxTax" + VendorID).html(thousands_separators((data[0].totalPriceExTax).round(2)));
            $("#totBoxTaxExcel" + VendorID).html(thousands_separators((data[0].totalPriceExTax).round(2)));


            $("#totBoxTaxExcel" + VendorID).html(thousands_separators((data[0].totalPriceExTax).round(2)));
            //abheedev bug 349 end
            if ($("#ddlrfqVersion option:selected").val() == 99) {


                $(".lambdafactor").addClass('hide');

            }
            else {
                $(".lambdafactor").removeClass('hide');

            }


        }, error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }
    });
}
var allUsers
function fetchRegisterUser() {
    var data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "Isactive": "N"
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                allUsers = data;
            }
            else {
                allUsers = '';
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
    //allUsers = RegisterUser_fetchRegisterUser(data);

}
jQuery("#txtApprover").keyup(function () {
    $('#hdnApproverID').val('0')
    $('#hdnAppEmailIDID').val('')

});

jQuery("#txtApprover").typeahead({
    source: function (query, process) {
        var data = allUsers;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.userName] = username;
            usernames.push(username.userName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].userID != "0") {
            sessionStorage.setItem('hdnApproverid', map[item].userID);
            $('#hdnApproverID').val(map[item].userID)
            $('#hdnAppEmailIDID').val(map[item].emailID)

        }
        else {
            gritternotification('Please select Approver  properly!!!');
        }

        return item;
    }

});
jQuery("#txtApproverRFQ").keyup(function () {
    $('#hdnRFQApproverID').val('0')
    $('#hdnRFQApproverEmailID').val('')
    $('#hdnRFQApproverusername').val('')
});

jQuery("#txtApproverRFQ").typeahead({
    source: function (query, process) {
        var data = allUsers;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.userName] = username;
            usernames.push(username.userName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].userID != "0") {
            sessionStorage.setItem('hdnRFQApproverID', map[item].userID);
            $('#hdnRFQApproverID').val(map[item].userID)
            $('#hdnRFQApproverEmailID').val(map[item].emailID)
            $('#hdnRFQApproverusername').val(map[item].userName)
        }
        else {
            gritternotification('Please select Approver  properly!!!');
        }

        return item;
    }

});
var rowRFQApp = 0;
var rfqApproved = 1;
function addRFQApprovers() {
    var status = "true";
    var UserID = jQuery("#hdnRFQApproverID").val();
    var UserName = jQuery("#hdnRFQApproverusername").val();
    var EmailID = jQuery("#hdnRFQApproverEmailID").val();

    $("#tblRFQapprovers tr:gt(0)").each(function () {
        var this_row = $(this);

        if ($.trim(this_row.find('td:eq(4)').html()) == $('#hdnRFQApproverID').val()) {
            status = "false"
        }
    });
    if ($('#hdnRFQApproverID').val() == "0" || jQuery("#txtApproverRFQ").val() == "") {
        $('.alert-danger').show();
        $('#spandangerapp').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (rfqApproved > 0) {
        $('.alert-danger').show();
        $('#spandangerapp').html('Approvers cannot be added as the approval cycle is closed');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandangerapp').html('Approver is already mapped for this RFQ.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApproverRFQ").val('')
        jQuery("#hdnRFQApproverID").val('0')
        return false;
    }
    else {
        rowRFQApp = rowRFQApp + 1;
        if (!jQuery("#tblRFQapprovers thead").length) {
            jQuery("#tblRFQapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblRFQapprovers").append('<tr id=trAppid' + rowRFQApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteRFQApprow(trAppid' + rowRFQApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowRFQApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblRFQapprovers").append('<tr id=trAppid' + rowRFQApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteRFQApprow(trAppid' + rowRFQApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowRFQApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        jQuery("#txtApproverRFQ").val('')
        jQuery("#hdnRFQApproverID").val('0')
    }
    //bug 478
    jQuery('#btnrfqapproversubmit').removeAttr("disabled");
}
function deleteRFQApprow(rowid) {
    rowRFQApp = rowRFQApp - 1;
    $('#' + rowid.id).remove();
    var rowCount = jQuery('#tblRFQapprovers tr').length;
    var i = 1;
    if (rowCount > 1) {
        $("#tblRFQapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
        jQuery('#btnrfqapproversubmit').removeAttr("disabled");
    }
    else {

        jQuery('#btnrfqapproversubmit').attr("disabled", "disabled");
    }
}
function MapRFQapprover(Type) {
    var RFQID = 0;
    if (Type == "Report") {
        RFQID = $('#hdnRfqID').val()
    }
    else {
        RFQID = sessionStorage.getItem("hdnrfqid")
    }
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvers = '';
    var rowCount = jQuery('#tblRFQapprovers tr').length;
    if (rowCount > 1) {
        $("#tblRFQapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';

        })
    }
    var Approvers = {
        "RFQID": parseInt(RFQID),
        "QueryRFQApprovers": approvers,
        "CreatedBy": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/AddRFQApproversByAdmin",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {

            $('#successapp').show();
            $('#spansuccessapp').html('Approvers added successfully');
            Metronic.scrollTo($('#successapp'), -200);
            $('#successapp').fadeOut(7000);
            bootbox.dialog({
                message: "Approvers added successfully!",
                buttons: {
                    confirm: {
                        label: "OK",
                        className: "btn-success",
                        callback: function () {
                            $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                            setTimeout(function () {

                                $('#addapprovers').modal('hide')
                            }, 700)
                            if (Type == "Report") {
                                fetchRFQApproverStatus();
                                setTimeout(function () {

                                    $('#FwdCommercialApprover').modal('show')
                                }, 1500)
                            }
                            else {
                                fetchReguestforQuotationDetails(RFQID)
                            }

                        }
                    }

                }
            });
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }


    });
}
$("#addapprovers").on("hidden.bs.modal", function () {
    jQuery("#txtApproverRFQ").val('')
    $('#hdnRFQApproverEmailID').val('0')
    $('#hdnRFQApproverID').val('0')
    $('#hdnRFQApproverusername').val('0')
});
function fnGetRFQApprovers(Type) {

    var RFQID = 0;
    if (Type == "Report") {
        RFQID = $('#hdnRfqID').val()
    }
    else {
        RFQID = sessionStorage.getItem("hdnrfqid")
    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidApprover/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&EventID=" + RFQID + "&Type=RFQ",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidApprover/?EventID=" + RFQID + "&Type=RFQ",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var str = "";
            rowRFQApp = 0;

            jQuery("#tblRFQapprovers").empty();
            jQuery('#tblRFQapprovers').append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            for (var i = 0; i < data.length; i++) {
                if (data[i].approverType != "P" && data[i].approverType != "T") {
                    rowRFQApp = rowRFQApp + 1;

                    str = '<tr id=trAppid' + rowRFQApp + '>';
                    if (data[i].aprStatus != 'Y') {
                        str += '<td><button type=button class="btn btn-xs btn-danger"  id=Removebtn' + rowRFQApp + ' onclick="deleteRFQApprow(trAppid' + rowRFQApp + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                        rfqApproved = 0;

                    }
                    else {
                        str += '<td><button type=button class="btn btn-xs btn-danger"  id=Removebtn' + rowRFQApp + ' onclick="deleteRFQApprow(trAppid' + rowRFQApp + ')"  disabled><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                    }
                    str += '<td>' + data[i].approverName + '</td>'
                    str += "<td>" + data[i].emailID + "</td>";

                    str += "<td>" + data[i].adMinSrNo + "</td>";
                    str += "<td class=hide>" + data[i].userID + "</td></tr>";

                    jQuery('#tblRFQapprovers').append(str);

                    if (Type == "Report") {
                        $('#Removebtn' + rowRFQApp).attr('disabled', 'disabled')
                    }

                }
            }
            jQuery('#tblRFQapprovers').append("</tbody>")
            if (jQuery('#tblRFQapprovers tr').length <= 1) {
                jQuery('#btnrfqapproversubmit').attr("disabled", "disabled");
            }
            else {
                jQuery('#btnrfqapproversubmit').removeAttr("disabled");
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }

    })
}
function fnOpenPopupApprover(Type) {

    fnGetRFQApprovers(Type);
    if (Type == "Report") {
        $('#FwdCommercialApprover').modal('hide')
        setTimeout(function () {
            $('#addapprovers').modal('show')
        }, 500)
    }
    else {
        fetchRegisterUser()
        $('#addapprovers').modal('show')
    }

}
function fnclosepopupApprovers(Type) {
    if (Type == "Report") {
        $('#addapprovers').modal('hide')
        setTimeout(function () {
            $('#FwdCommercialApprover').modal('show')
        }, 500)
    }
    else {
        $('#addapprovers').modal('hide')
    }
}
function fetchRFQApproverStatus(RFQID) {

    var url = sessionStorage.getItem("APIPath") + "eRFQApproval/GetRFQApproverStatus/?RFQID=" + RFQID

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function (data) {
            var status = '';
            var c = 0;
            sessionStorage.setItem("LastApproverStaffCode", data[data.length - 1].approverStaffCode)
            if (data.length > 0) {
                $('#div_statusbar').removeClass('hide');
                jQuery('#divappendstatusbar').empty();
                var counterColor = 0;
                for (var i = 0; i < data.length; i++) {

                    jQuery('#divappendstatusbar').append('<div class="col-md-2 mt-step-col first" id=divstatuscolor' + i + '><div class="mt-step-number bg-white" style="font-size:small;height:38px;width:39px;" id=divlevel' + i + '></div><div class="mt-step-title font-grey-cascade" id=divapprovername' + i + ' style="font-size:smaller"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divstatus' + i + '></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divPendingDate' + i + '></div></div></div></div>')
                    jQuery('#divlevel' + i).text(data[i].level);
                    jQuery('#divapprovername' + i).text(data[i].approverStaffName);
                    jQuery('#divPendingDate' + i).text(fnConverToLocalTime(data[i].pendingSince));

                    if (data[i].statusCode == 10) {

                        counterColor = counterColor + 1;
                        status = 'Pending'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');

                    }
                    if (data[i].statusCode == 20) {
                        status = 'Approved'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 30) {

                        status = 'Forwarded'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 40) {

                        counterColor = counterColor + 1;
                        status = 'Awarded'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 10) {
                        jQuery('#divstatuscolor' + i).addClass('error');
                    }
                    if (data[i].statusCode == 20 | data[i].statusCode == 30 || data[i].statusCode == 40) {
                        jQuery('#divstatuscolor' + i).addClass('done');
                    }

                    if (counterColor > 1) {
                        if (status == 'Pending') {

                            status = 'N/A'
                            jQuery('#divPendingDate' + i).addClass('hide')
                            c = c + 1;
                            jQuery('#divstatus' + i).text(status);
                            jQuery('#divstatuscolor' + i).removeClass('error')
                            jQuery('#divstatuscolor' + i).addClass('font-yellow')
                            jQuery('#divstatuscolor' + i).addClass('last')
                            jQuery('#divstatus' + i).addClass('font-yellow')
                            jQuery('#divapprovername' + i).addClass('font-yellow')

                        }
                    }

                }
            }

            else {
                $('#div_statusbar').addClass('hide');

            }
            jQuery.unblockUI();
        },

        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(response.status + ' ' + response.statusText);
            }
            return false;
            jQuery.unblockUI();
        }

    });
}
function fetchRFQPPCApproverStatus(RFQID) {

    var url = sessionStorage.getItem("APIPath") + "eRFQApproval/GetRFQPPCApproverStatus/?RFQID=" + RFQID

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function (data) {
            var status = '';
            var c = 0;
            sessionStorage.setItem("LastApproverStaffCode", data[data.length - 1].approverStaffCode)
            if (data.length > 0) {
                $('#div_statusbar').removeClass('hide');
                jQuery('#divappendstatusbar').empty();
                var counterColor = 0;
                for (var i = 0; i < data.length; i++) {

                    jQuery('#divappendstatusbar').append('<div class="col-md-2 mt-step-col first" id=divstatuscolor' + i + '><div class="mt-step-number bg-white" style="font-size:small;height:38px;width:39px;" id=divlevel' + i + '></div><div class="mt-step-title font-grey-cascade" id=divapprovername' + i + ' style="font-size:smaller"></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divstatus' + i + '></div><div style="font-size:x-small;" class="mt-step-content font-grey-cascade" id=divPendingDate' + i + '></div></div></div></div>')
                    jQuery('#divlevel' + i).text(data[i].level);
                    jQuery('#divapprovername' + i).text(data[i].approverStaffName);
                    jQuery('#divPendingDate' + i).text(fnConverToLocalTime(data[i].pendingSince));

                    if (data[i].statusCode == 10) {

                        counterColor = counterColor + 1;
                        status = 'Pending'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');

                    }
                    if (data[i].statusCode == 20) {
                        status = 'Approved'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 30) {

                        status = 'Forwarded to comm Approver'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 45) {

                        status = 'Forwarded to PPC'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 50) {

                        status = 'Forwarded to FC'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }

                    if (data[i].statusCode == 60) {

                        //counterColor = counterColor + 1;
                        status = 'Pending on comm Approver after Revert'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 70) {

                        counterColor = counterColor + 1;
                        status = 'Pending on comm Approver after Revert by FC'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 40) {

                        counterColor = counterColor + 1;
                        status = 'Awarded'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 10 || data[i].statusCode == 60 || data[i].statusCode == 70) {
                        jQuery('#divstatuscolor' + i).addClass('error');
                    }
                    if (data[i].statusCode == 20 | data[i].statusCode == 30 || data[i].statusCode == 40 || data[i].statusCode == 50 || data[i].statusCode == 45) {
                        jQuery('#divstatuscolor' + i).addClass('done');
                    }

                    if (counterColor >= 1 && data[i].pendingSince == '') {
                        if (status == 'Pending') {
                            status = 'N/A'
                            $('#divPendingDate' + i).addClass('hide')
                            c = c + 1;
                            jQuery('#divstatus' + i).text(status);
                            jQuery('#divstatuscolor' + i).removeClass('error')
                            jQuery('#divstatuscolor' + i).addClass('font-yellow')
                            jQuery('#divstatuscolor' + i).addClass('last')
                            jQuery('#divstatus' + i).addClass('font-yellow')
                            jQuery('#divapprovername' + i).addClass('font-yellow')

                        }
                    }

                }
            }

            else {
                $('#div_statusbar').addClass('hide');

            }
            jQuery.unblockUI();
        },

        error: function (xhr, status, error) {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(response.status + ' ' + response.statusText);
            }
            return false;
            jQuery.unblockUI();
        }

    });
}
$("#modalreInviteDate").on("hidden.bs.modal", function () {
    jQuery("#txtextendDate").val('')
    $('#txtReInviteRemarks').val('')
    str = '';
    $('.chkReinvitation').prop('checked', false);
    $('.alert-success').hide();
    $('.alert-danger').hide();
    $(".xyz").removeClass("has-error");
    $('.help-block-error').remove();
});

function downloadexcel() {

    var postfix = fnConverToLocalTime(new Date())

    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById('table_wrapper');

    var table_html = table_div.outerHTML.replace(/ /g, '%20');

    var a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = 'RFQDetails -' + postfix + '.xls';

    a.click();

}
//abheedev 24/11/2022 production issue
function addLoadingFactor() {
    //abheedev loading factor start


    var _LoadingAmount = 0;
    var _loadingPer = 0;
    var isSubmitActive = true;
    var vId = parseInt($("#hdnvendorid").val());
    var totalPriceWithutGst = parseFloat($("#hdngstprice").val());
    if ($("#txtloadingfactor").val() == "" || $("#txtloadingfactor").val() == null || $("#txtloadingfactor").val() == 'undefined') {
        isSubmitActive = false;
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter Either Loading Factor Percenatge or Absolute value');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;

    }
    else {
        isSubmitActive = true;


        if ($(ddlLFType).val() == "P") {

            _LoadingAmount = parseFloat(totalPriceWithutGst * parseFloat($("#txtloadingfactor").val()) / 100).toFixed(2);
            _loadingPer = parseFloat($("#txtloadingfactor").val()).toFixed(2);

        }
        else {
            _LoadingAmount = parseFloat($("#txtloadingfactor").val()).toFixed(2);

        }
    }
    if (jQuery("#txtloadingfactorreason").val() == "") {
        isSubmitActive = false;
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter Reason');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    if (isSubmitActive) {
        rowques = rowques + 1;
        if (!jQuery("#tblLoadingFactor thead").length) {
            jQuery('#tblLoadingFactor').append("<thead style='width:100%!important'><tr data-row='" + rowques + "'><th class='bold' style='width:50%!important'>Reason</th><th class='bold' style='width:25%!important'>Loading Factor</th><th class='bold' style='width:25%!important'>Amount</th><th></th><th></th></tr></thead>");
        }

        var strprev = '<tr data-row=' + rowques + ' id=trLFid' + rowques + ' ><td id=trLFReason' + rowques + '>' + jQuery("#txtloadingfactorreason").val() + "</td>"
        strprev += "<td id=trLFType" + rowques + " style='display:none;' >" + jQuery("#ddlLFType").val() + "</td>"
        if ($("#ddlLFType").val() == 'P') {
            strprev += "<td id=trLFValue" + rowques + ">" + _loadingPer + "%</td>"
        }
        else {
            strprev += "<td id=trLFValue" + rowques + ">" + _LoadingAmount + "INR</td>"
        }
        strprev += '<td id=trLFAmount' + rowques + '>' + _LoadingAmount + '</td>';

        if (!jQuery("#tblLoadingFactor thead").length) {
            jQuery('#tblLoadingFactor').append("<thead><tr style='width:100%!important'><th class='bold' style='width:50%!important'>Reason</th><th class='bold' style='width:25%!important'>Type</th><th class='bold' style='width:25%!important'>Amount</th><th></th></tr></thead>");
        }
        strprev += '<td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteLFrow(trLFid' + rowques + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:5%!important"><button type=button class="btn btn-xs btn-success"  onclick="editLFrow(trLFid' + rowques + ')" ><i class="fa fa-pencil"></i></button></td></tr>';
        jQuery('#tblLoadingFactor').append(strprev);
        jQuery("#tblLoadingFactor").val('')

        jQuery("#txtloadingfactorreason").val('')
        jQuery("#ddlLFType").val('A')
        jQuery("#txtloadingfactor").val('')

        //abheedev loading factor End
    }
}

function deleteLFrow(rowid) {
    rowques = rowques - 1;
    $('#' + rowid.id).remove();

}


var editrow;
function editLFrow(rowid) {


    var i = $('#' + rowid.id).attr('data-row');


    jQuery("#txtloadingfactorreason").val($("#trLFReason" + i).text());
    jQuery("#ddlLFType").val($("#trLFType" + i).text())
    jQuery("#txtloadingfactor").val($("#trLFValue" + i).text().replace('INR', '').replace('%', ''));

    $('#Addbtn1').hide()
    $('#Editbtn1').show()
    editrow = $('#' + rowid.id).attr('data-row');
}
//abheedev 24/11/2022 loading factor issue
function updateLoadingFactor() {

    var _LoadingAmount = 0;
    var totalPriceWithutGst = parseFloat($("#hdngstprice").val());

    if ($("#ddlLFType").val() == "P") {
        _LoadingAmount = parseFloat((totalPriceWithutGst * parseFloat($("#txtloadingfactor").val())) / 100).toFixed(2);
        $("#trLFReason" + editrow).text($('#txtloadingfactorreason').val())
        $("#trLFValue" + editrow).text(parseFloat($('#txtloadingfactor').val()).toFixed(2) + "%")
        $("#trLFAmount" + editrow).text(_LoadingAmount)
    }
    else {
        $("#trLFReason" + editrow).text($('#txtloadingfactorreason').val())
        $("#trLFValue" + editrow).text(parseFloat($('#txtloadingfactor').val()).toFixed(2) + "INR")
        $("#trLFAmount" + editrow).text(parseFloat($('#txtloadingfactor').val()).toFixed(2))

    }


    $('#Addbtn1').show()
    $('#Editbtn1').hide()


    jQuery("#txtloadingfactorreason").val('')
    jQuery("#ddlLFType").val('A')
    jQuery("#txtloadingfactor").val('')
    editrow = "";

}