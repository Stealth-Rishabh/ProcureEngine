var Changepassworderror = $('#errordivChangePassword');
var Changepasswordsuccess = $('#successdivChangePassword');
Changepassworderror.hide();
Changepasswordsuccess.hide();
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
    if ($("#nPassword").val() != $("#reEnterPass").val()) {
        jQuery("#errorpassword").text("Password not matched..");
        Changepassworderror.show();
        Changepassworderror.fadeOut(5000);
        jQuery.unblockUI();
        return;
    }
    else {
        var data = {
            "EmailID": sessionStorage.getItem("EmailID"),
            "OldPassword": $("#oPassword").val(),
            "NewPassword": $("#nPassword").val(),
            "UserType": sessionStorage.getItem("UserType")
        }

       
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ChangeForgotPassword/ChangePassword",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            EnableViewState:false,
            success: function (data, status, jqXHR) {
                //if (data == "1") {

                    jQuery("#sucessPassword").html("Your Password has been Changed successfully..");
                    Changepasswordsuccess.show();
                    Changepasswordsuccess.fadeOut(5000);
                    clearResetForm();
                    jQuery.unblockUI();
                //}
                //else {
                //    jQuery("#errorpassword").html("Please try again with correct current password..");
                //    Changepassworderror.show();
                //    Changepassworderror.fadeOut(5000);
                //    jQuery.unblockUI();
                //}
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
    },400)
}
function fetchPendingBid() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    if ($('#ULCustomers').val() == null) {
        $('#ULCustomers').val('0')
        sessionStorage.setItem('CustomerID','0')
    }
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorDashboard/VendorfetchDashboardData/?VendorID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
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
                $('#totalrecord').text('(' +data[0].pendingActivity.length+')')
                for (var i = 0; i < data[0].pendingActivity.length; i++) {
                   
                   
                    str = "<li><a href='javascript:;' onclick=fnOpenLink(\'" + data[0].pendingActivity[i].linkURL + "'\,\'" + data[0].pendingActivity[i].bidID + "'\,\'" + data[0].pendingActivity[i].isTermsConditionsAccepted + "'\,\'" + data[0].pendingActivity[i].bidTypeID + "',\'" + data[0].pendingActivity[i].version + "'\)>";
                    str += "<div class='col1'><div class='cont'>";
                    str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=icon" + i + "></i></div></div>";
                    str += "<div class='cont-col2'><div class='desc'>" + data[0].pendingActivity[i].activityDescription + "&nbsp;&nbsp;";
                   
                   
                    if (data[0].pendingActivity[i].isTermsConditionsAccepted != "Y") {
                        str += "<span class='label label-sm label-info'>" + data[0].pendingActivity[i].bidTypeName + " </span>&nbsp;&nbsp;<span class='badge badge-danger'> new </span>";
               
                    }
                    else {
                        str += "<span class='label label-sm label-info'>" + data[0].pendingActivity[i].bidTypeName + "</span>";
                    }
                    str += "</div></div></div></div>";
                    
                    str += "<div class='col2' style='width: 110px !important; margin-left:-110px !important;'>";
                    str += "<div class='date'><span class='label label-sm label-warning'>" + data[0].pendingActivity[i].bidStatus + "</span></div></div>";
                    str += "</a></li>";
                    jQuery('#UlPendingActivity').append(str);
                   
                    if (data[0].pendingActivity[i].bidTypeName == 'Forward Auction') {
                        $('#icon' + i).addClass('fa fa-forward');
                    }
                    else if (data[0].pendingActivity[i].bidTypeName == 'Reverse Auction') {
                        $('#icon' + i).addClass('fa fa-gavel');
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
          
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
}
var _Bidtype = '';
var EventType = '';

function fnOpenLink(linkurl, Bidid, isterms, bidtype,version) {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
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
function fetchRFIDetails() {
    var attachment = ''
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFIID=" + sessionStorage.getItem('CurrentRFIID') + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            attachment = BidData[0].RFIMaster[0].RFIAttachment.replace(/\s/g, "%20")
           
            jQuery('#RFISubject').val(BidData[0].RFIMaster[0].RFISubject)
            jQuery('#RFIDeadline').val(BidData[0].RFIMaster[0].RFIDeadline)
            jQuery('#RFIDescription').val(BidData[0].RFIMaster[0].RFIDescription)

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
function fetchVQDetails(){
    var attachment = ''
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFIID=" + sessionStorage.getItem('hddnRFQRFIID') + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
          
            attachment = BidData[0].RFIMaster[0].RFIAttachment.replace(/\s/g, "%20")
            sessionStorage.setItem('CurrentrfiID', BidData[0].RFIMaster[0].RFIId)
            jQuery('#RFISubject').text(BidData[0].RFIMaster[0].RFISubject)
            jQuery('#RFIDeadline').text(BidData[0].RFIMaster[0].RFIDeadline)
            jQuery('#RFIDescription').text(BidData[0].RFIMaster[0].RFIDescription)

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
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQRFIID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {
            
           
            jQuery('#RFQSubject').text(RFQData[0].general[0].rfqSubject)
           
            $('#Currency').html(RFQData[0].general[0].currencyNm)
            jQuery('#RFQDescription').text(RFQData[0].general[0].rfqDescription)
            
            jQuery('#rfqstartdate').text(RFQData[0].general[0].rfqStartDate)
            jQuery('#rfqenddate').text(RFQData[0].general[0].rfqEndDate)
           
           
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
function acceptBidTermsAuction() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorID = 0;
  
    vendorID = sessionStorage.getItem('VendorId');
    
    var acceptTerms = {
        "BidID": parseInt(sessionStorage.getItem('BidID')),
        "VendorID": vendorID
    };
   // alert(JSON.stringify(acceptTerms))
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
            
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    });
}
function acceptBidTermsRFIRFQ() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorID = 0;
   
    vendorID = sessionStorage.getItem('VendorId');
    
    var acceptTerms = {
        "RFQRFIID": _Bidtype+'-'+sessionStorage.getItem('hddnRFQRFIID'),
        "VID": vendorID
    };
    // alert(JSON.stringify(acceptTerms))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BidTermsConditions/AcceptBidTermsRFIRFQ/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(acceptTerms),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data[0].IsSuccess == 'Y') {
                window.location = data[0].URL
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
        "RFQID":  parseInt(sessionStorage.getItem('hddnRFQRFIID')),
        "VID": parseInt(vendorID)
    };
   //  alert(JSON.stringify(acceptTerms))
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
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
   
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorDashboard/VendorfetchDashboardBidDetails/?VendorID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&RequestType=" + requesttype + "&CustomerID=" + $('#ULCustomers').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
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
                        if (BidData[i].isTermsConditionsAccepted != "Y") {
                            
                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>&nbsp;&nbsp;<span class='badge badge-danger'> new </span>";
                        }
                        else {
                            str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>";
                        }
                        
                        str += "</div></div></div></div>";

                        str += "<div class='col2' style='width: 110px !important; margin-left:-110px !important;'>";
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
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
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
                        str += "<div class='col2' style='width: 110px !important; margin-left:-110px !important;'>";

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
                        str += "<div class='col2' style='width: 110px !important; margin-left:-110px !important;'>";

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
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
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
                        str += "<div class='col2' style='width: 110px !important; margin-left:-110px !important;'>";

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
                        str += "<div class='col2' style='width: 110px !important; margin-left:-110px !important;'>";

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
                        else if (BidData[i].bidTypeName == 'Reverse Auction') {

                            $('#iconbidd' + i).addClass('fa fa-gavel');
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
                    str += "<div class='col2' style='width: 110px !important; margin-left:-110px !important;'>";

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
                    else if (BidData[i].bidTypeName == 'Reverse Auction') {

                        $('#iconbidd' + i).addClass('fa fa-gavel');
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
            
            if (xhr.status === 401) {
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
            console.log("dataa > ", data)
            if (data.length == 1) {
                jQuery('#bid_EventID').html("Event ID : " + sessionStorage.getItem("BidID"));
               
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblbidfor").text(data[0].bidFor);

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
            
            if (xhr.status === 401) {
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
                    acceptBidTermsRFIRFQ();
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
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/FetchCustomersForUser/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
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
           
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();
}
