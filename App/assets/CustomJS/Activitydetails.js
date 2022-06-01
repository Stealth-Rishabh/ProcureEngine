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
            "UserType": sessionStorage.getItem("UserType"),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
        }
        //console.log(JSON.stringify(data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ChangeForgotPassword/ChangePassword",
            type: "POST",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
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

                var err = xhr.responseText//xhr.responseText// eval("(" + xhr.responseText + ")");
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
function fnOpenLink(linkurl, isobserver) {
    sessionStorage.setItem('IsObserver', isobserver);
    window.location = linkurl;
}
function fnConfirmArchive(RFQID) {

    bootbox.dialog({
        message: "Are you sure you want to Archive this activity ? ",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    fnArchive(RFQID)
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
function fnArchive(RFQID) {
    var Data = {
        "RFQID": parseInt(RFQID),
        "UserID": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
    // alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "Activities/ArchiveObserverRFQ/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data == "1") {
                fetchDashboardData();
            }

        },

        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            jQuery.unblockUI();
        }
    })
}


function fetchDashboardData() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Activities/fetchDashboardData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            jQuery('#lblTodayBidCount').text(BidData[0].bidcnt[0].todayBid)
            jQuery('#lblNotForwardedBidCount').text(BidData[0].bidcnt[0].notForwarded)
            jQuery('#lblForwardedBidCount').text(BidData[0].bidcnt[0].forwarded)
            jQuery('#lblAwardedBidCount').text(BidData[0].bidcnt[0].awarded)

            jQuery('#lblopenRFQCount').text(BidData[0].rFxcnt[0].todayRFx)
            jQuery('#lblNotFwRFQCount').text(BidData[0].rFxcnt[0].notForwardedRFx)
            jQuery('#lblFwRFQCount').text(BidData[0].rFxcnt[0].forwardedRFx)
            jQuery('#lblAwRFQCount').text(BidData[0].rFxcnt[0].awardedRFx)



            jQuery("#UlPendingActivity").empty();
            $('#pendingact').text("Pending Activities (" + BidData[0].pendingActivity.length + ")")
            if (BidData[0].pendingActivity.length > 0) {

                for (var i = 0; i < BidData[0].pendingActivity.length; i++) {

                    str = "<li><a style='text-decoration:none;' href='javascript:;' onclick=fnOpenLink(\'" + BidData[0].pendingActivity[i].linkURL + "'\,\'" + BidData[0].pendingActivity[i].isPPCObserver + "'\)>";
                    str += "<div class='col1'><div class='cont'>";
                    str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=icon" + i + "></i></div></div>";
                    str += "<div class='cont-col2'><div class='desc'>" + BidData[0].pendingActivity[i].activityDescription + "</a>";
                    if (BidData[0].pendingActivity[i].isPPCObserver == "Y") {
                        str += "&nbsp;&nbsp;|<span class='label label-sm label-danger'  style='cursor:pointer' onclick=fnConfirmArchive(\'" + BidData[0].pendingActivity[i].bidID + "'\)>Archive&nbsp;<i class='fa fa-arrow-right'></i></span>";
                    }
                    str += "</div></div></div></div>";

                    str += "<div class='col2'><div class='date' style='padding:0px 0px 0px 0px!important;color:#fff!important;'>";

                    str += "<span class='label-sm label-info'>" + BidData[0].pendingActivity[i].receiptDt + "</span></div></div>";
                    str += "</li>";
                    jQuery('#UlPendingActivity').append(str);

                    if (BidData[0].pendingActivity[i].bidTypeName == 'VQ') {
                        jQuery('#icon' + i).addClass('fa fa-question-circle');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName == 'VR') {
                        jQuery('#icon' + i).addClass('fa fa-question-circle');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName == 'RFI') {
                        jQuery('#icon' + i).addClass('fa fa-envelope-o');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName == 'RFQ') {
                        $('#icon' + i).addClass('fa fa-envelope-o');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName == 'NFA') {
                        $('#icon' + i).addClass('fa fa-edit');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName == 'eRFQ') {
                        $('#icon' + i).addClass('fa fa-envelope-o');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName == 'Forward Auction') {
                        $('#icon' + i).addClass('fa fa-forward');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName == 'Reverse Auction') {
                        $('#icon' + i).addClass('fa fa-gavel');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName == 'Coal Auction') {
                        $('#icon' + i).addClass('fa fa-fire-extinguisher');
                    }
                    else if (BidData[0].pendingActivity[i].bidTypeName.toLowerCase() == 'french auction') {
                        $('#icon' + i).addClass('fa fa-forward');
                    }
                }
            }
            else {
                jQuery('#UlPendingActivity').append("<tr><td colspan='8' style='text-align: center; color:red;'>You have no pending activity.</td></tr>");
            }


            if (BidData[0].todayBidStatus.length >= 7) {
                jQuery('#see_all_bids_btn').show()

                jQuery('#all_pending_bids_list').empty();
                for (var i = 0; i < BidData[0].todayBidStatus.length; i++) {
                    str = "<li><a href=" + BidData[0].todayBidStatus[i].linkURL + ">";
                    str += "<div class='col1'><div class='cont'>";
                    str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbid_all" + i + "></i></div></div>";
                    str += "<div class='cont-col2'><div class='desc'>" + BidData[0].todayBidStatus[i].activityDescription + "&nbsp;&nbsp;";
                    str += "<span class='label label-sm label-info'>" + BidData[0].todayBidStatus[i].bidTypeName + "</span>";
                    str += "</div></div></div></div>";
                    str += "<div class='col2'>";
                    str += "<div class='date'>" + BidData[0].todayBidStatus[i].bidStatus + "</div></div>";
                    str += "</a></li>";
                    jQuery('#all_pending_bids_list').append(str);



                    if (BidData[0].todayBidStatus[i].bidTypeName == 'VQ') {
                        jQuery('#iconbid_all' + i).addClass('fa fa-question-circle');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'VR') {
                        jQuery('#iconbid_all' + i).addClass('fa fa-question-circle');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'RFQ') {
                        $('#iconbid_all' + i).addClass('fa fa-envelope-o');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'NFA') {
                        $('#iconbid_all' + i).addClass('fa fa-edit');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'eRFQ') {
                        $('#iconbid_all' + i).addClass('fa fa-envelope-o');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'RFI') {
                        $('#iconbid_all' + i).addClass('fa fa-envelope-o');
                    }

                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'Reverse Auction') {
                        $('#iconbid_all' + i).addClass('fa fa-gavel');
                    } else if (BidData[0].todayBidStatus[i].bidTypeName == 'Forward Auction') {
                        $('#iconbid_all' + i).addClass('fa fa-forward');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'Coal Auction') {
                        $('#iconbid_all' + i).addClass('fa fa-fire-extinguisher');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName.toLowerCase() == 'french auction') {
                        $('#iconbid_all' + i).addClass('fa fa-forward');
                    }
                }
            }
            else {
                jQuery('#see_all_bids_btn').css('visibility', 'hidden')
            }

            jQuery("#ulList").empty();
            $('#spanPanelCaptioncount').text("(" + BidData[0].todayBidStatus.length + ")")
            if (BidData[0].todayBidStatus.length > 0) {

                for (var i = 0; i < BidData[0].todayBidStatus.length; i++) {

                    str = "<li><a href='" + BidData[0].todayBidStatus[i].linkURL + "'>";

                    str += "<div class='col1'><div class='cont'>";
                    str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbid" + i + "></i></div></div>";
                    str += "<div class='cont-col2'><div class='desc'>" + BidData[0].todayBidStatus[i].activityDescription + "&nbsp;&nbsp;";
                    if (BidData[0].todayBidStatus[i].status == "C") {
                        str += "<span class='label label-sm label-info'>" + BidData[0].todayBidStatus[i].bidTypeName + "</span>&nbsp;&nbsp;<span class='badge badge-danger'> new query</span>";
                    }
                    else {
                        str += "<span class='label label-sm label-info'>" + BidData[0].todayBidStatus[i].bidTypeName + "</span>";
                    }
                    str += "</div></div></div></div>";
                    str += "<div class='col2'>";
                    str += "<div class='date1'>" + BidData[0].todayBidStatus[i].bidStatus + "</div></div>";
                    str += "</a></li>";
                    jQuery('#ulList').append(str);

                    if (BidData[0].todayBidStatus[i].bidTypeName == 'VQ') {
                        jQuery('#iconbid' + i).addClass('fa fa-question-circle');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'VR') {
                        jQuery('#iconbid' + i).addClass('fa fa-question-circle');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'RFI') {
                        jQuery('#iconbid' + i).addClass('fa fa-envelope-o');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'RFQ') {
                        $('#iconbid' + i).addClass('fa fa-envelope-o');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'eRFQ') {
                        $('#iconbid' + i).addClass('fa fa-envelope-o');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'NFA') {
                        $('#iconbid' + i).addClass('fa fa-edit');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'Forward Auction') {
                        $('#iconbid' + i).addClass('fa fa-forward');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'Reverse Auction') {
                        $('#iconbid' + i).addClass('fa fa-gavel');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName == 'Coal Auction') {
                        $('#iconbid' + i).addClass('fa fa-fire-extinguisher');
                    }
                    else if (BidData[0].todayBidStatus[i].bidTypeName.toLowerCase() == 'french auction') {
                        $('#iconbid' + i).addClass('fa fa-forward');
                    }

                }
            }
            else {
                jQuery('#ulList').append("<tr><td colspan='8' style='text-align: center; color:red;'>No bid is configured for today.</td></tr>");
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
function fetchBidDataDashboard(requesttype) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (requesttype == 'Today') {
        jQuery('#spanPanelCaption').html("Open Bids");
    } else if (requesttype == 'Not Forwarded') {
        jQuery('#spanPanelCaption').html("Not Forwarded Bids");
    } else if (requesttype == 'Forwarded') {
        jQuery('#spanPanelCaption').html("Bids Under Approval");
    } else if (requesttype == 'Awarded') {
        jQuery('#spanPanelCaption').html("Approved Bids");
    }
    else if (requesttype == 'TodayRFQ') {
        jQuery('#spanPanelCaption').html("Open RFx");
    }
    else if (requesttype == 'Not ForwardedRFQ') {
        jQuery('#spanPanelCaption').html("Not Forwarded RFx");
    }
    else if (requesttype == 'ForwardedRFQ') {
        jQuery('#spanPanelCaption').html("RFx Under Approval");
    }
    else if (requesttype == 'AwardedRFQ') {
        jQuery('#spanPanelCaption').html("Approved RFx");
    }
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Activities/fetchDashboardBidDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RequestType=" + requesttype + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            jQuery("#ulList").empty();
            $('#spanPanelCaptioncount').text("(" + BidData.length + ")")
            if (BidData.length > 0) {
                if (requesttype == 'Today') {
                    for (var i = 0; i < BidData.length; i++) {

                        str = "<li><a href='" + BidData[i].linkURL + "'>";

                        str += "<div class='col1'><div class='cont'>";
                        str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbidd" + i + "></i></div></div>";
                        str += "<div class='cont-col2'><div class='desc'>" + BidData[i].activityDescription + "&nbsp;&nbsp;";
                        str += "<span class='label label-sm label-info'>" + BidData[i].bidTypeName + "</span>";
                        str += "</div></div></div></div>";

                        str += "<div class='col2'>";
                        str += "<div class='date'>" + BidData[i].bidStatus + "</div></div>";
                        str += "</a></li>";
                        jQuery('#ulList').append(str);

                        if (BidData[i].bidTypeName == 'VQ') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        }
                        else if (BidData[i].bidTypeName == 'VR') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        }
                        else if (BidData[i].bidTypeName == 'RFI') {
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
                        else if (BidData[i].bidTypeName == 'NFA') {
                            $('#iconbidd' + i).addClass('fa fa-edit');
                        }
                    }
                }
                else {
                    for (var i = 0; i < BidData.length; i++) {

                        str = "<li><a href='" + BidData[i].linkURL + "'>";
                        str += "<div class='col1'><div class='cont'>";
                        str += "<div class='cont-col1'><div class='label label-sm label-success'><i id=iconbidd" + i + "></i></div></div>";
                        str += "<div class='cont-col2'><div class='desc'>" + BidData[i].activityDescription;
                        str += "</div></div></div></div>";
                        if (BidData[i].bidTypeName == 'Product/ Services') {
                            str += "<div class='col2' style='margin-left: -99px !important'>";
                        } else {
                            str += "<div class='col2'>";
                        }

                        str += "<div class='date'><span class='label label-sm label-warning'>" + BidData[i].bidTypeName + "</span></div></div>";
                        str += "</a></li>";
                        jQuery('#ulList').append(str);

                        if (BidData[i].bidTypeName == 'VQ') {
                            jQuery('#iconbidd' + i).addClass('fa fa-question-circle');
                        } else if (BidData[i].bidTypeName == 'RFI') {
                            jQuery('#iconbidd' + i).addClass('fa fa-envelope-o');
                        }
                        else if (BidData[i].bidTypeName == 'RFQ') {
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
                        else if (BidData[i].bidTypeName == 'NFA') {
                            $('#iconbidd' + i).addClass('fa fa-edit');
                        }
                        else if (BidData[i].bidTypeName == 'Coal Auction') {
                            $('#iconbidd' + i).addClass('fa fa-fire-extinguisher');
                        }
                    }
                }


            }
            else {
                jQuery('#ulList').append("<tr><td colspan='8' style='text-align: center; color:red;'>No record found</td></tr>");
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
    jQuery.unblockUI();
}


function showErrorMsg() {
    bootbox.alert("You can not proceed further while current bid is running.");
}


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


jQuery("#searchPendingBids").keyup(function () {
    jQuery("#ulList li:has(div)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#searchPendingBids').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#ulList li:has(div)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#ulList li:has(div)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});