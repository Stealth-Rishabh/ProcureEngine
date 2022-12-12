var Changepassworderror = $('#errordivChangePassword');
var Changepasswordsuccess = $('#successdivChangePassword');
Changepassworderror.hide();
Changepasswordsuccess.hide();
//FROM HTML
jQuery(document).ready(function () {

    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if (sessionStorage.getItem("UserType") == "V") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    setCommonData();
    App.init();
    multilingualLanguage()
    Tasks.initDashboardWidget();
    fetchMappedCustomers();
    setTimeout(function () {
        fetchDashboardData();
    }, 1000)

    // fetchPendingRFQ();

    fetchMenuItemsFromSession(0, 0)
});
//
function handleChangePasword() {

    $('#ChangePasswordfrm').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false,
        rules: {

            oPassword: {
                required: true
            },
            nPassword: {
                required: true
            },
            reEnterPass: {
                required: true
            }


        },
        messages: {

            oPassword: {
                required: "Old Password Type is required."
            },
            nPassword: {
                required: "New Password is required."
            },
            reEnterPass: {
                required: "Re-Enter  is required."
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            Changepasswordsuccess.hide();
            jQuery("#errorpassword").text("You have some form errors. Please check below.");
            Changepassworderror.show();
            Changepassworderror.fadeOut(5000);
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
            Changepassworderror.hide();
            ChangePassword();

        }
    });

}
function ChangePassword() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var isSubmit = true;
    var successMsg = "";
    if ($("#nPassword").val() != $("#reEnterPass").val()) {
        successMsg = "Password not matched.."
        isSubmit = false;
    }
    if (isSubmit) {
        successMsg = checkPasswordValidation($("#nPassword").val());
        if (successMsg != "SUCCESS") {
            isSubmit = false;
        }
        else {
            isSubmit = true;
        }
    }
    //var custID = 0;
    //if ($("#nPassword").val().toLowerCase() != $("#reEnterPass").val().toLowerCase()) {
    //    jQuery("#errorpassword").text("Password not matched..");
    //    Changepassworderror.show();
    //    Changepassworderror.fadeOut(5000);
    //    jQuery.unblockUI();
    //    return;
    //}
    if (isSubmit) {
        var data = {
            "EmailID": sessionStorage.getItem("EmailID"),
            "OldPassword": $("#oPassword").val(),
            "NewPassword": $("#nPassword").val(),
            //"UserType": sessionStorage.getItem("UserType"),
            "UserType": 'V',
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
        }


        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ChangeForgotPassword/ChangePassword",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            EnableViewState: false,
            success: function (data, status, jqXHR) {
                if (data.isSuccess == "-1") {
                    jQuery("#errorpassword").html("Old Password is not correct.Please try again with correct password.");
                    Changepassworderror.show();
                    Changepassworderror.fadeOut(5000);
                    jQuery.unblockUI();
                    return false;
                }
                else {
                    jQuery("#sucessPassword").html("Your Password has been Changed successfully..");
                    Changepasswordsuccess.show();
                    Changepasswordsuccess.fadeOut(5000);
                    clearResetForm();
                    jQuery.unblockUI();
                }

            },
            error: function (xhr, status, error) {
                var err = xhr.responseText//eval("(" + xhr.responseText + ")");

                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('errorpassword', '');
                }
                jQuery.unblockUI();
                return false;
            }
        });
    }
    else {
        jQuery("#errorpassword").text(successMsg);
        Changepassworderror.show();
        Changepassworderror.fadeOut(5000);
        jQuery.unblockUI();
        return;
    }

}

function clearResetForm() {
    $('#nPassword').val('');
    $('#reEnterPass').val('');
    $('#oPassword').val('');
}
function fnischeckSysGeneratedPass() {

    if (sessionStorage.getItem("IsSysPassword") == "Y") {
        bootbox.dialog({
            message: "You are using System Generated password. It is recommended to change your password. Please press yes to change your password and no if you want to do it later. ",
            buttons: {
                confirm: {
                    label: "Yes",
                    className: "btn-success",
                    callback: function () {
                        $('#ChangePassword').modal('show');
                    }
                },
                cancel: {
                    label: "No",
                    className: "btn-default",
                    callback: function () {
                        return;
                    }
                }
            }
        });


    }
    //else {

    //}
}
function fetchDashboardData() {

    handleChangePasword();
    fetchPendingBid()
    formvalidate()
}
sessionStorage.setItem('CustomerID', '0')
function GetDataForCust() {
    sessionStorage.setItem('CustomerID', $('#ULCustomers').val())
    setTimeout(function () {
        fetchPendingBid();
    }, 400)
}
function fetchPendingBid() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if ($('#ULCustomers').val() == null) {
        $('#ULCustomers').val('0')
        sessionStorage.setItem('CustomerID', '0')
    }
    var custId = parseInt(sessionStorage.getItem('CustomerID'))
    var userData = {
        "UserID": sessionStorage.getItem('VendorId'),
        "CustomerID": custId
    }
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "VendorDashboard/VendorfetchDashboardData/?VendorID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        url: sessionStorage.getItem("APIPath") + "VendorDashboard/VendorfetchDashboardData",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        crossDomain: true,
        data: JSON.stringify(userData),
        dataType: "json",
        success: function (data) {
            jQuery("#div_portlet").removeClass();
            jQuery("#iconclass").addClass('fa fa-check');
            jQuery("#spanPanelCaption").text("Open Events");
            jQuery("#div_portlet").addClass('portlet box green-turquoise');

            jQuery('#lblOpenCount').text(data[0].bidcnt[0].openBids)
            jQuery('#lblClosedCount').text(data[0].bidcnt[0].closeBids)
            jQuery('#lblopenRFXCount').text(data[0].rFxcnt[0].openRFx)
            jQuery('#lblClosedRFXCount').text(data[0].rFxcnt[0].closedRFx)
            jQuery('#lblpendingPO').text(data[0].poPending.noofBid)
            jQuery('#lblAcceptedPO').text(data[0].poAccepted.noofBid)
            jQuery('#lblOpnquery').text(data[0].openQuery.noofBid)
            $('#totalrecord').text('');
            jQuery("#UlPendingActivity").empty();

            if (data[0].pendingActivity.length > 0) {
                $('#totalrecord').text('(' + data[0].pendingActivity.length + ')')
                for (var i = 0; i < data[0].pendingActivity.length; i++) {
                    var _bidStatus = data[0].pendingActivity[i].bidStatus
                    if (_bidStatus == null || _bidStatus == '') {
                        if (data[0].pendingActivity[i].startDate != null || data[0].pendingActivity[i].startDate != '') {

                            var StartDate = fnConverToShortDT(data[0].pendingActivity[i].startDate);

                            _bidStatus = StartDate;
                        }

                        if (data[0].pendingActivity[i].endDate != null || data[0].pendingActivity[i].endDate != '') {
                            var EndDate = fnConverToShortDT(data[0].pendingActivity[i].endDate);
                            _bidStatus = _bidStatus + '-' + EndDate;
                        }
                    }

                    str = "<li><a href='javascript:;' class='erfqlink' onclick=fnOpenLink(\'" + data[0].pendingActivity[i].linkURL + "'\,\'" + data[0].pendingActivity[i].bidID + "'\,\'" + data[0].pendingActivity[i].isTermsConditionsAccepted + "'\,\'" + data[0].pendingActivity[i].bidTypeID + "',\'" + data[0].pendingActivity[i].version + "'\)>";
                    str += "<div class='col1'><div class='cont'>";
                    str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=icon" + i + "></i></div></div>";
                    str += "<div class='cont-col2'><div class='desc'>" + data[0].pendingActivity[i].activityDescription + "&nbsp;&nbsp;";


                    if (data[0].pendingActivity[i].isTermsConditionsAccepted != "Y" && data[0].pendingActivity[i].rfqStatus == "N") {
                        str += "<span class='label label-sm label-info'>" + data[0].pendingActivity[i].bidTypeName + " </span>&nbsp;&nbsp;<span class='badge badge-danger'> new </span>";

                    }
                    else if (data[0].pendingActivity[i].isTermsConditionsAccepted == "Y" && data[0].pendingActivity[i].rfqStatus != "C") {
                        str += "<span class='label label-sm label-info'>" + data[0].pendingActivity[i].bidTypeName + "</span>";

                    }
                    else if (data[0].pendingActivity[i].isTermsConditionsAccepted == "Y" && data[0].pendingActivity[i].rfqStatus == "C") {
                        str += "<span class='label label-sm label-info'>" + data[0].pendingActivity[i].bidTypeName + " </span>&nbsp;&nbsp;<span class='badge badge-success'> Submitted </span>";
                    }
                    str += "</div></div></div></div>";

                    str += "<div class='col2' style='width: 140px !important; margin-left:-140px !important;'>";
                    //str += "<div class='date'><span class='label label-sm label-warning'>" + data[0].pendingActivity[i].bidStatus + "</span></div></div>";
                    str += "<div class='date'><span class='label label-sm label-warning'>" + _bidStatus + "</span></div></div>";
                    str += "</a></li>";
                    jQuery('#UlPendingActivity').append(str);

                    if (data[0].pendingActivity[i].bidTypeName == 'Forward Auction') {
                        $('#icon' + i).addClass('fa fa-forward');
                    }
                    else if (data[0].pendingActivity[i].bidTypeName.toLowerCase() == 'french auction') {
                        $('#icon' + i).addClass('fa fa-forward');
                    }
                    else if (data[0].pendingActivity[i].bidTypeName == 'Reverse Auction') {
                        $('#icon' + i).addClass('fa fa-gavel');
                    }
                    else if (data[0].pendingActivity[i].bidTypeName == 'Coal Auction') {
                        $('#icon' + i).addClass('fa fa-fire-extinguisher');
                    }
                    else if (data[0].pendingActivity[i].bidTypeName == 'VQ') {
                        jQuery('#icon' + i).addClass('fa fa-question-circle');
                    } else if (data[0].pendingActivity[i].bidTypeName == 'RFI') {
                        jQuery('#icon' + i).addClass('fa fa-envelope-o');
                    } else if (data[0].pendingActivity[i].bidTypeName == 'RFQ') {
                        $('#icon' + i).addClass('fa fa-envelope-o');
                    }
                    else if (data[0].pendingActivity[i].bidTypeName == 'eRFQ') {
                        $('#icon' + i).addClass('fa fa-envelope-o');
                    }
                    else if (data[0].pendingActivity[i].bidTypeName == 'PO') {
                        $('#icon' + i).addClass('fa fa-file');
                    }
                    else if (data[0].pendingActivity[i].bidTypeName == 'Technical Query') {
                        $('#icon' + i).addClass('fa fa-question');
                    }
                }
            }
            else {
                jQuery('#UlPendingActivity').append("<tr><td colspan='8' style='text-align: center; color:red;'>You have no pending activity.</td></tr>");
            }
            jQuery.unblockUI();


        },
        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
}
var _Bidtype = '';
var EventType = '';

function fnOpenLink(linkurl, Bidid, isterms, bidtype, version) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if (linkurl.indexOf('?') != -1) {
        linkurl = linkurl + "locale=" + $.i18n().locale;;
    }
    else if (linkurl.indexOf('#') != -1) {
        e.preventDefault()
        linkurl = linkurl + "locale=" + $.i18n().locale;
    }

    /*//else if (this.href.indexOf('javascript:') != -1) {

    //  this.href = this.href + "?locale=" + $.i18n().locale;
    //} */

    else {
        linkurl = linkurl + "locale=" + $.i18n().locale;
    }


    if (isterms != 'Y' && isterms != '') {
        sessionStorage.setItem('BidID', '0')
        sessionStorage.setItem('hddnRFQRFIID', Bidid)
        sessionStorage.setItem('RFQVersionId', version)
        $('#termscondition').modal('show')

    }
    else {

        sessionStorage.setItem('hddnRFQRFIID', Bidid)
        sessionStorage.setItem('RFQVersionId', version)
        sessionStorage.setItem('BidID', Bidid)
        //setTimeout(function () {
        window.location = linkurl;
        // },1000)

    }

    _Bidtype = bidtype;

    if (bidtype == 'VQ' || bidtype == 'RFQ' || bidtype == 'RFI' || bidtype == 'eRFQ') {
        EventType = 'RFX';

        $('#div_euctions').addClass('hide')
        $('#spnTypeName').text(bidtype)
        if (bidtype == "eRFQ") {
            $('#div_eRFQ').removeClass('hide')
            $('#div_RFQ').addClass('hide')
            $('#div_bothRFQ').removeClass('hide')
            $('#div_RFX').addClass('hide')

        }
        else if (bidtype == "RFI") {
            $('#div_eRFQ').addClass('hide')
            $('#div_RFQ').addClass('hide')
            $('#div_bothRFQ').addClass('hide')
            $('#div_RFX').removeClass('hide')
        }
        else if (bidtype == "VQ") {
            $('#div_eRFQ').addClass('hide')
            $('#div_RFQ').addClass('hide')
            $('#div_bothRFQ').addClass('hide')
            $('#div_RFX').removeClass('hide')
        }
        else {
            $('#div_eRFQ').addClass('hide')
            $('#div_RFQ').removeClass('hide')
            $('#div_bothRFQ').removeClass('hide')
            $('#div_RFX').addClass('hide')
        }
        setTimeout(function () {
            if (bidtype == "eRFQ") {
                fetchReguestforQuotationDetailseRFQ();
            }
            else if (bidtype == "VQ") {
                fetchVQDetails();
            }
            else if (bidtype == "RFI") {
                fetchRFIDetails();
            }


        }, 600);
    }
    else if (bidtype == 'PO') {
        window.location = linkurl;
    }
    else if (bidtype == 'Query') {
        window.location = linkurl;
    }
    else {

        EventType = 'Auction';
        sessionStorage.setItem('BidID', Bidid)
        sessionStorage.setItem('RFQID', '0')
        $('#div_euctions').removeClass('hide')
        $('#div_bothRFQ').addClass('hide')
        setTimeout(function () {
            fetchBidHeaderDetails();
        }, 1000);
    }



    jQuery.unblockUI();
}
function fetchVQDetails() {
    var attachment = ''

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VQID=" + sessionStorage.getItem('hddnRFQRFIID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            sessionStorage.setItem('CustomerID', BidData[0].vqMaster[0].customerID)
            attachment = BidData[0].vqMaster[0].vqAttachment.replace(/\s/g, "%20")

            jQuery('#RFISubject').text(BidData[0].vqMaster[0].vqSubject)
            jQuery('#RFIDeadline').text(fnConverToShortDT(BidData[0].vqMaster[0].vqDeadline))
            jQuery('#RFIDescription').text(BidData[0].vqMaster[0].vqDescription)

        },
        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });

}
function fetchRFIDetails() {
    var attachment = ''
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFXMaster/fetchRFXPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFXID=" + sessionStorage.getItem('hddnRFQRFIID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            sessionStorage.setItem('CustomerID', BidData[0].rfxMaster[0].customerID)
            sessionStorage.setItem('CurrentRFXID', BidData[0].rfxMaster[0].rfxid)
            jQuery('#RFISubject').text(BidData[0].rfxMaster[0].rfxSubject)
            jQuery('#RFIDeadline').text(fnConverToShortDT(BidData[0].rfxMaster[0].rfxDeadline))
            jQuery('#RFIDescription').text(BidData[0].rfxMaster[0].rfxDescription)

        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
}

function fetchReguestforQuotationDetailseRFQ() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQRFIID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQRFIID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            sessionStorage.setItem('hddnRFQID', RFQData[0].general[0].rfqId)
            sessionStorage.setItem('CustomerID', RFQData[0].general[0].customerID)
            jQuery('.rfqtc').show();
            jQuery('.bidtc').hide();

            //abheedev
            $('#uniform-chkIsAccepted').find("span").removeClass('checked');
            $('#btnContinue').attr("disabled", true);


            jQuery('#RFQSubject').text(RFQData[0].general[0].rfqSubject)

            $('#Currency').html(RFQData[0].general[0].currencyNm)
            jQuery('#RFQDescription').text(RFQData[0].general[0].rfqDescription)

            jQuery('#rfqstartdate').text(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
            jQuery('#rfqenddate').text(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
            jQuery('#rfqTermandCondition').attr("name", RFQData[0].general[0].rfqTermandCondition)

            //abheedev
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
}

function DownloadFile(aID) {

    fnDownloadAttachments($("#" + aID.id).attr("name"), 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));
}


function DownloadbidFile(aID) {

    fnDownloadAttachments($("#" + aID.id).attr("name"), 'Bid/' + sessionStorage.getItem('hddnRFQID'));
}





function acceptBidTermsAuction() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorID = 0;

    vendorID = sessionStorage.getItem('VendorId');

    var acceptTerms = {
        "BidID": parseInt(sessionStorage.getItem('BidID')),
        "VendorID": vendorID,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    };

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BidTermsConditions/AcceptBidTerms/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(acceptTerms),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data.isSuccess == 'Y') {
                window.location = data.linkURL
            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
}
function acceptBidTermsRFIVQ() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorID = 0;

    vendorID = sessionStorage.getItem('VendorId');

    var acceptTerms = {
        "VQRFIID": _Bidtype + '-' + sessionStorage.getItem('hddnRFQRFIID'),
        "VID": parseInt(vendorID),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    };

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BidTermsConditions/AcceptBidTermsRFIVQ/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(acceptTerms),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data.isSuccess == 'Y') {
                window.location = data.linkURL
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
}
function eRFQAcceptBidTerms() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorID = 0;

    vendorID = sessionStorage.getItem('VendorId');

    var acceptTerms = {
        "RFQID": parseInt(sessionStorage.getItem('hddnRFQRFIID')),
        "VID": parseInt(vendorID),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    };

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQAcceptBidTerms/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(acceptTerms),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data.isSuccess == 'Y') {
                window.location = data.linkURL
            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
}
function fetchBidDataDashboard(requesttype) {
    var custid = 0
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#ULCustomers').val() != null) {
        custid = $('#ULCustomers').val()
    }
    custid = parseInt(custid);
    var userData = {
        "UserID": sessionStorage.getItem('VendorId'),
        "CustomerID": custid,
        "RequestType": requesttype
    }
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "VendorDashboard/VendorfetchDashboardBidDetails/?VendorID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&RequestType=" + requesttype + "&CustomerID=" + custid,
        url: sessionStorage.getItem("APIPath") + "VendorDashboard/VendorfetchDashboardBidDetails",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        crossDomain: true,
        data: JSON.stringify(userData),
        dataType: "json",
        success: function (BidData) {
            $('#totalrecord').text('');
            jQuery("#UlPendingActivity").empty();
            jQuery("#div_portlet").removeClass();
            if (BidData.length > 0) {
                $('#totalrecord').text('(' + BidData.length + ')')
                if (requesttype == 'OpenBids') {
                    for (var i = 0; i < BidData.length; i++) {

                        str = "<li><a href='javascript:;' onclick=fnOpenLink(\'" + BidData[i].linkURL + "'\,\'" + BidData[i].bidID + "'\,\'" + BidData[i].isTermsConditionsAccepted + "'\,\'" + BidData[i].bidTypeID + "'\)>";

                        str += "<div class='col1'><div class='cont'>";
                        str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbidd" + i + "></i></div></div>";
                        str += "<div class='cont-col2'><div class='desc'>" + BidData[i].activityDescription + "&nbsp;&nbsp;";
                        if (BidData[i].isTermsConditionsAccepted != "Y" && BidData[i].rfqStatus == "N") {

                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>&nbsp;&nbsp;<span class='badge badge-danger'> new </span>";
                        }
                        else if (BidData[i].isTermsConditionsAccepted == "Y" && BidData[0].rfqStatus != "C") {
                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>";
                        }
                        else if (BidData[i].isTermsConditionsAccepted == "Y" && BidData[i].rfqStatus == "C") {

                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>&nbsp;&nbsp;<span class='badge badge-success'> Submitted </span>";
                        }
                        str += "</div></div></div></div>";

                        str += "<div class='col2' style='width: 140px !important; margin-left:-140px !important;'>";
                        str += "<div class='date'><span class='label label-sm label-warning'>" + BidData[i].bidStatus + "</span></div></div>";
                        str += "</a></li>";
                        jQuery('#UlPendingActivity').append(str);

                        if (BidData[i].bidTypeName == 'VQ') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        } else if (BidData[i].bidTypeName == 'RFI') {
                            jQuery('#iconbidd' + i).addClass('fa fa-envelope-o');
                        }

                        else if (BidData[i].bidTypeName == 'Forward Auction') {

                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName.toLowerCase() == 'french auction') {

                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
                        }
                        else if (BidData[i].bidTypeName == 'Coal Auction') {
                            $('#iconbidd' + i).addClass('fa fa-fire-extinguisher');
                        }
                        else if (BidData[i].bidTypeName == 'eRFQ') {
                            $('#iconbidd' + i).addClass('fa fa-envelope-o');
                        }
                        else if (BidData[i].bidTypeName == 'PO') {
                            $('#iconbidd' + i).addClass('fa fa-file');
                        }
                    }

                }
                else if (requesttype == 'CloseBids') {
                    for (var i = 0; i < BidData.length; i++) {

                        str = "<li><a href=" + BidData[i].linkURL + ">";
                        str += "<div class='col1'><div class='cont'>";
                        str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbidd" + i + "></i></div></div>";
                        str += "<div class='cont-col2'><div class='desc'>" + BidData[i].activityDescription + "&nbsp;&nbsp;";
                        str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>";
                        str += "</div></div></div></div>";
                        str += "<div class='col2' style='width: 140px !important; margin-left:-140px !important;'>";

                        str += "<div class='date'><span class='label label-sm label-warning'>" + BidData[i].bidStatus + "</span></div></div>";
                        str += "</a></li>";
                        jQuery('#UlPendingActivity').append(str);

                        if (BidData[i].bidTypeName == 'VQ') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        } else if (BidData[i].bidTypeName == 'RFI') {
                            jQuery('#iconbidd' + i).addClass('fa fa-envelope-o');
                        } else if (BidData[i].bidTypeName == 'RFQ') {
                            $('#iconbidd' + i).addClass('icon-envelope');
                        }
                        else if (BidData[i].bidTypeName == 'Coal Auction') {
                            $('#iconbidd' + i).addClass('fa fa-fire-extinguisher');
                        }
                        else if (BidData[i].bidTypeName == 'Forward Auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName.toLowerCase() == 'french auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
                        }
                        else if (BidData[i].bidTypeName == 'PO') {
                            $('#iconbidd' + i).addClass('fa fa-file');
                        }

                    }
                }
                else if (requesttype == 'PendingPO' || requesttype == 'AcceptedPO') {
                    for (var i = 0; i < BidData.length; i++) {

                        str = "<li><a href=" + BidData[i].linkURL + ">";
                        str += "<div class='col1'><div class='cont'>";
                        str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbidd" + i + "></i></div></div>";
                        str += "<div class='cont-col2'><div class='desc'>" + BidData[i].activityDescription + "&nbsp;&nbsp;";
                        if (requesttype == 'PendingPO') {
                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>&nbsp;&nbsp;<span class='badge badge-danger'> new </span>";
                        } else {
                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>";
                        }
                        str += "</div></div></div></div>";
                        str += "<div class='col2' style='width: 140px !important; margin-left:-140px !important;'>";

                        str += "<div class='date'><span class='label label-sm label-warning'>" + BidData[i].bidStatus + "</span></div></div>";

                        str += "</a></li>";
                        jQuery('#UlPendingActivity').append(str);

                        if (BidData[i].bidTypeName == 'VQ') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        } else if (BidData[i].bidTypeName == 'RFI') {
                            jQuery('#iconbidd' + i).addClass('fa fa-envelope-o');
                        } else if (BidData[i].bidTypeName == 'RFQ') {
                            $('#iconbidd' + i).addClass('icon-envelope');
                        }
                        else if (BidData[i].bidTypeName == 'Forward Auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName == 'french auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
                        }
                        else if (BidData[i].bidTypeName == 'Coal Auction') {
                            $('#iconbidd' + i).addClass('fa fa-fire-extinguisher');
                        }
                        else if (BidData[i].bidTypeName == 'PO') {
                            $('#iconbidd' + i).addClass('fa fa-file');
                        }

                    }
                }
                else if (requesttype == 'OpenQuery') {
                    for (var i = 0; i < BidData.length; i++) {

                        str = "<li><a href=" + BidData[i].linkURL + ">";
                        str += "<div class='col1'><div class='cont'>";
                        str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbidd" + i + "></i></div></div>";
                        str += "<div class='cont-col2'><div class='desc'>" + BidData[i].activityDescription + "&nbsp;&nbsp;";
                        str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>";

                        str += "</div></div></div></div>";
                        str += "<div class='col2' style='width: 140px !important; margin-left:-140px !important;'>";

                        str += "<div class='date'><span class='label label-sm label-warning'>" + BidData[i].bidStatus + "</span></div></div>";

                        str += "</a></li>";
                        jQuery('#UlPendingActivity').append(str);

                        if (BidData[i].bidTypeName == 'VQ') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        } else if (BidData[i].bidTypeName == 'RFI') {
                            jQuery('#iconbidd' + i).addClass('fa fa-envelope-o');
                        } else if (BidData[i].bidTypeName == 'RFQ') {
                            $('#iconbidd' + i).addClass('icon-envelope');
                        }
                        else if (BidData[i].bidTypeName == 'Forward Auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName.toLowerCase() == 'french auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName == 'Coal Auction') {
                            $('#iconbidd' + i).addClass('fa fa-fire-extinguisher');
                        }
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
                        }
                        else if (BidData[i].bidTypeName == 'PO') {
                            $('#iconbidd' + i).addClass('fa fa-file');
                        }
                        else if (BidData[i].bidTypeName == 'Technical Query') {
                            $('#iconbidd' + i).addClass('fa fa-question');
                        }
                    }
                }
                else if (requesttype == 'CloseRFX') {
                    for (var i = 0; i < BidData.length; i++) {

                        str = "<li><a  href=" + BidData[i].linkURL + ">";
                        str += "<div class='col1'><div class='cont'>";
                        str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbidd" + i + "></i></div></div>";
                        str += "<div class='cont-col2'><div class='desc'>" + BidData[i].activityDescription + "&nbsp;&nbsp;";
                        str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>";
                        str += "</div></div></div></div>";
                        str += "<div class='col2' style='width: 140px !important; margin-left:-140px !important;'>";

                        str += "<div class='date'><span class='label label-sm label-warning'>" + BidData[i].bidStatus + "</span></div></div>";
                        str += "</a></li>";
                        jQuery('#UlPendingActivity').append(str);

                        if (BidData[i].bidTypeName == 'VQ') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        } else if (BidData[i].bidTypeName == 'RFI') {
                            jQuery('#iconbidd' + i).addClass('fa fa-envelope-o');
                        } else if (BidData[i].bidTypeName == 'RFQ') {
                            $('#iconbidd' + i).addClass('icon-envelope');
                        }
                        else if (BidData[i].bidTypeName == 'eRFQ') {
                            $('#iconbidd' + i).addClass('icon-envelope');
                        }
                        else if (BidData[i].bidTypeName == 'Forward Auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName.toLowerCase() == 'french auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
                        }
                        else if (BidData[i].bidTypeName == 'Coal Auction') {
                            $('#iconbidd' + i).addClass('fa fa-fire-extinguisher');
                        }
                        else if (BidData[i].bidTypeName == 'PO') {
                            $('#iconbidd' + i).addClass('fa fa-file');
                        }

                    }
                }
                else {

                    for (var i = 0; i < BidData.length; i++) {

                        str = "<li><a href='javascript:;' onclick=fnOpenLink(\'" + BidData[i].linkURL + "'\,\'" + BidData[i].bidID + "'\,\'" + BidData[i].isTermsConditionsAccepted + "'\,\'" + BidData[i].bidTypeID + "'\,\'" + BidData[i].version + "'\)>";
                        str += "<div class='col1'><div class='cont'>";
                        str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbidd" + i + "></i></div></div>";
                        str += "<div class='cont-col2'><div class='desc'>" + BidData[i].activityDescription + "&nbsp;&nbsp;";
                        if (BidData[i].isTermsConditionsAccepted != "Y") {
                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>&nbsp;&nbsp;<span class='badge badge-danger'> new </span>";
                        }
                        else {
                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>";
                        }
                        str += "</div></div></div></div>";
                        str += "<div class='col2' style='width: 140px !important; margin-left:-140px !important;'>";

                        str += "<div class='date'><span class='label label-sm label-warning'>" + BidData[i].bidStatus + "</span></div></div>";
                        str += "</a></li>";
                        jQuery('#UlPendingActivity').append(str);

                        if (BidData[i].bidTypeName == 'VQ') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        } else if (BidData[i].bidTypeName == 'RFI') {
                            jQuery('#iconbidd' + i).addClass('fa fa-envelope-o');
                        } else if (BidData[i].bidTypeName == 'RFQ') {
                            $('#iconbidd' + i).addClass('icon-envelope');
                        }
                        else if (BidData[i].bidTypeName == 'Forward Auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName.toLowerCase() == 'french auction') {
                            $('#iconbidd' + i).addClass('fa fa-forward');
                        }
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
                        }
                        else if (BidData[i].bidTypeName == 'Coal Auction') {
                            $('#iconbidd' + i).addClass('fa fa-fire-extinguisher');
                        }
                        else if (BidData[i].bidTypeName == 'eRFQ') {
                            $('#iconbidd' + i).addClass('icon-envelope');
                        }
                        else if (BidData[i].bidTypeName == 'PO') {
                            $('#iconbidd' + i).addClass('fa fa-file');
                        }

                    }
                }

            }
            else {
                jQuery('#UlPendingActivity').append("<tr><td colspan='8' style='text-align: center; color:red;'>No record found</td></tr>");
            }
            if (requesttype == 'OpenBids') {
                jQuery("#iconclass").addClass('fa fa-paperclip');
                jQuery("#spanPanelCaption").text('Open eAuctions');
                jQuery("#div_portlet").addClass('portlet box purple-soft');
            }
            else if (requesttype == 'OpenRFX') {
                jQuery("#iconclass").addClass('fa fa-unlink');
                jQuery("#spanPanelCaption").text('Open RFx');
                jQuery("#div_portlet").addClass('portlet box green');

            } else if (requesttype == 'CloseBids') {

                jQuery("#iconclass").addClass('fa fa-paperclip');
                jQuery("#spanPanelCaption").text('Closed eAuctions');
                jQuery("#div_portlet").addClass('portlet box purple-soft');

            } else if (requesttype == 'CloseRFX') {

                jQuery("#iconclass").addClass('fa fa-unlink');
                jQuery("#spanPanelCaption").text('Submitted RFx');
                jQuery("#div_portlet").addClass('portlet box green');
            }
            else if (requesttype == 'PendingPO') {
                jQuery("#iconclass").addClass('fa fa-check-square-o');
                jQuery("#spanPanelCaption").text("Pending PO's");
                jQuery("#div_portlet").addClass('portlet box yellow-casablanca');
            }
            else if (requesttype == 'OpenQuery') {
                jQuery("#iconclass").addClass('fa fa-trophy');
                jQuery("#spanPanelCaption").text("Open Technical Query");
                jQuery("#div_portlet").addClass('portlet box red-pink');
            }
            else {
                jQuery("#iconclass").addClass('fa fa-check-square-o');
                jQuery("#spanPanelCaption").text("Accepted/Reverted PO's");
                jQuery("#div_portlet").addClass('portlet box yellow-casablanca');
            }

        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
}

function fetchBidHeaderDetails() {
    var tncAttachment = '';
    var anyotherAttachment = '';
    var url = '';

    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails_Vendor/?BidID=" + sessionStorage.getItem('BidID') + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"))

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            if (data.length == 1) {
                var localBidDate = fnConverToLocalTime(data[0].bidDate);
                jQuery('#bid_EventID').html("Event ID : " + sessionStorage.getItem("BidID"));
                sessionStorage.setItem('CustomerID', data[0].customerID)
                sessionStorage.setItem('hddnRFQID', data[0].bidID)
                jQuery('.bidtc').show();
                jQuery('.rfqtc').hide();


                //abheedev
                $('#uniform-chkIsAccepted').find("span").removeClass('checked');
                $('#btnContinue').attr("disabled", true);

                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(localBidDate);
                //jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblbidfor").text(data[0].bidFor);
                jQuery('#bidTermandCondition').attr("name", data[0].termsConditions)

                jQuery("a#lnkTermsAttachment").text(data[0].termsConditions);
                jQuery("a#lnkTermsAttachment").attr("href", "PortalDocs/Bid/" + sessionStorage.getItem("BidID") + "/" + tncAttachment)

                jQuery("a#lnkAnyOtherAttachment").text(data[0].attachment);
                jQuery("a#lnkAnyOtherAttachment").attr("href", "PortalDocs/Bid/" + sessionStorage.getItem("BidID") + "/" + anyotherAttachment)



                jQuery("#lblbidduration").text(data[0].bidDuration);
                jQuery("#lblcurrency").text(data[0].currencyName);

            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });

}
jQuery('#chkIsAccepted').click(function () {
    if (jQuery('#chkIsAccepted').is(':checked') == true) {
        $('#btnContinue').attr("disabled", false);
    }
    else {
        $('#btnContinue').attr("disabled", true);
    }
});

jQuery("#searchPendingActivities").keyup(function () {


    jQuery("#UlPendingActivity li:has(div)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#searchPendingActivities').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#UlPendingActivity li:has(div)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#UlPendingActivity li:has(div)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});
function formvalidate() {
    $('#AccprtGNc').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
        },

        messages: {

        },

        invalidHandler: function (event, validator) { //display error alert on form submit   

        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        },

        submitHandler: function (form) {

            if (EventType == 'RFX') {
                if (_Bidtype == "eRFQ") {
                    eRFQAcceptBidTerms();

                } else {
                    acceptBidTermsRFIVQ();
                }

            }
            else {
                acceptBidTermsAuction()

            }
        }
    });



}
function validateBid(bidid) {

    $('#validatebidmodal').modal('show')
}
function fetchMappedCustomers() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "CustomerRegistration/FetchCustomersForUser/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/FetchCustomersForUser/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ULCustomers").empty();

            if (data.length > 0) {
                jQuery("#ULCustomers").append(jQuery("<option></option>").val("0").html("ALL"));
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ULCustomers").append(jQuery("<option></option>").val(data[i].customerID).html(data[i].customerName));

                }
            }
            else {

            }
        },
        error: function (xhr, status, error) {
            $('.page-container').show();
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();
}
jQuery('#bidchkIsAccepted').click(function () {
    if (jQuery('#bidchkIsAccepted').is(':checked') == true) {
        $('#btnContinue').attr("disabled", false);
    }
    else {
        $('#btnContinue').attr("disabled", true);
    }
});


function multilingualLanguage() {

    var set_locale_to = function (locale) {
        if (locale) {
            $.i18n().locale = locale;
        }

        $('body').i18n();
    };
    jQuery(function () {
        $.i18n().load({
            'en': 'assets/plugins/jquery.i18n/language/en/translation.json', // Messages for english
            'fr': 'assets/plugins/jquery.i18n/language/fr/translation.json' // message for french
        }).done(function () {
            $('body').i18n();
            set_locale_to(url('?locale'));

            $(".navbar-language").find(`option[value=${$.i18n().locale}]`).attr("selected", "selected")

            //   <option data-locale="en" value="en">English</option>

            History.Adapter.bind(window, 'statechange', function () {
                set_locale_to(url('?locale'));


            });
            $('.navbar-language').change(function (e) {

                e.preventDefault();
                $.i18n().locale = $('option:selected', this).data("locale");


                History.pushState(null, null, "?locale=" + $.i18n().locale);



            });

            $('a').click(function (e) {

                if (this.href.indexOf('?') != -1) {
                    this.href = this.href;
                }
                else if (this.href.indexOf('#') != -1) {
                    e.preventDefault()
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }

                /*//else if (this.href.indexOf('javascript:') != -1) {

                //  this.href = this.href + "?locale=" + $.i18n().locale;
                //} */

                else {
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }
            });




        });
    });




}