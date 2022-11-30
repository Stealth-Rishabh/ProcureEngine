
var BidID = "";
var BidTypeID = "";
var BidForID = "";
var PEfaBidForId = 0;
var IsApp = "";
var FwdTo = "";
var AppStatus = "";
var _bidarray = [];
var _timelft = '';
var graphData = [];
var _bidClosingType;
var page = "";
$('#txtRemarks').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
$('#btnpdf').click(function () {
    var encrypdata = fnencrypt("BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&BidForID=" + BidForID)
    var url = "ViewReport2.html?param=" + encrypdata
    var win = window.open(url, "_blank");

    win.focus();

})
var postfix = ''
function getCurrenttime() {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    postfix = day + "/" + month + "/" + year;

}

$(document).ready(function () {


    var path = window.location.pathname;
    page = path.split("/").pop();

    if (window.location.search) {
        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)
        BidID = getUrlVarsURL(decryptedstring)["BidID"]
        IsApp = getUrlVarsURL(decryptedstring)["App"]
        FwdTo = getUrlVarsURL(decryptedstring)["FwdTo"]
        AppStatus = getUrlVarsURL(decryptedstring)["AppStatus"]


        if (IsApp == 'N' && FwdTo != 'Admin') {
            jQuery("#divRemarksForward").show();

        }
        else if (IsApp == 'Y' && FwdTo == 'Admin' && AppStatus == 'Reverted') {
            jQuery("#divRemarksForward").show();
        }
        else if (IsApp == 'Y' && FwdTo == 'Admin' && AppStatus != 'Reverted') {
            jQuery("#divRemarksAwarded").show();
        }
        else {
            jQuery("#divRemarksApp").show();
        }
        fetchBidSummary(BidID);
        fetchApproverStatus();
    }

});
function fnToCheckUserIPaccess() {

    url = sessionStorage.getItem("APIPath") + "User/isIPAllowed/?CustomerID=" + parseInt(sessionStorage.getItem("CustomerID"));

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data == "0") {
                bootbox.alert("You are not Authorize to view this page", function () {
                    window.location = "index.html";
                    return false;
                });
            }
            else {
                $('.page-container').show();
                Pageloaded()
                fetchvendor();
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
            }
            return true;
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
//////--------------****************************** add Approvers*********************************
var allUsers
function fetchRegisterUser(Type) {
    var url = ''
    url = sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser"
    var data = [];
    if (Type.toLowerCase() == "ppc") {
        data = {
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "UserID": "0",
            "Isactive": "N"
        } 
        //url = sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=0&Isactive=N"
    }
    else {
        data = {
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "UserID": sessionStorage.getItem('UserID'),
            "Isactive": "N"
        }
        //url = sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&Isactive=N"
    }
    jQuery.ajax({
        //type: "GET",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

jQuery("#txtApprover").keyup(function () {
    $('#hdnApproverID').val('0')

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

function fnOpenPopupBidApprover() {
    fetchRegisterUser('Bid');
    fnGetBidApprovers();
}
jQuery("#txtApproverBid").keyup(function () {
    $('#hdnBidApproverID').val('0')

});

jQuery("#txtApproverBid").typeahead({
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
            sessionStorage.setItem('hdnBidApproverID', map[item].userID);
            $('#hdnBidApproverID').val(map[item].userID)
            $('#hdnBidApproverEmailID').val(map[item].emailID)
            $('#hdnBidApproverusername').val(map[item].userName)
        }
        else {
            gritternotification('Please select Approver  properly!!!');
        }

        return item;
    }

});

var rowBidApp = 0;
function addBidApprovers() {
    var status = "true";
    var UserID = jQuery("#hdnBidApproverID").val();
    var UserName = jQuery("#hdnBidApproverusername").val();
    var EmailID = jQuery("#hdnBidApproverEmailID").val();

    $("#tblBidapprovers tr:gt(0)").each(function () {
        var this_row = $(this);

        if ($.trim(this_row.find('td:eq(4)').html()) == $('#hdnBidApproverID').val()) {
            status = "false"
        }
    });
    if ($('#hdnBidApproverID').val() == "0" || jQuery("#txtApproverBid").val() == "") {
        $('.alert-danger').show();
        $('#spandangerapp').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandangerapp').html('Approver is already mapped for this Bid.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApproverBid").val('')
        jQuery("#hdnBidApproverID").val('0')
        return false;
    }
    else {
        rowBidApp = rowBidApp + 1;
        if (!jQuery("#tblBidapprovers thead").length) {
            jQuery("#tblBidapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblBidapprovers").append('<tr id=trAppid' + rowBidApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteBidApprow(trAppid' + rowBidApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblBidapprovers").append('<tr id=trAppid' + rowBidApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteBidApprow(trAppid' + rowBidApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        jQuery("#txtApproverBid").val('')
        jQuery("#hdnBidApproverID").val('0')
    }
}
function deleteBidApprow(rowid) {

    rowBidApp = rowBidApp - 1;
    $('#' + rowid.id).remove();
    var rowCount = jQuery('#tblBidapprovers tr').length;
    var i = 1;
    if (rowCount > 1) {
        $("#tblBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
        jQuery('#btnbidapproversubmit').removeAttr("disabled");
    }
    else {

        jQuery('#btnbidapproversubmit').attr("disabled", "disabled");
    }
}

function MapBidapprover() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvers = '';
    var rowCount = jQuery('#tblBidapprovers tr').length;
    if (rowCount > 1) {
        $("#tblBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';

        })
    }
    var Approvers = {
        "BidID": parseInt(BidID),
        "QueryBidApprovers": approvers,
        "CreatedBy": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/AddBidApproversByAdmin",
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
                            setTimeout(function () {
                                fetchApproverStatus();
                                $('#addapprovers').modal('hide')
                            }, 1000)

                        }
                    }

                }
            });
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
    jQuery("#txtApproverBid").val('')
    $('#hdnBidApproverEmailID').val('0')
    $('#hdnBidApproverID').val('0')
    $('#hdnBidApproverusername').val('0')
});
function fnGetBidApprovers() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidApprover/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&EventID=" + BidID + "&Type=Bid",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var str = "";
            rowBidApp = 0;
            jQuery("#tblBidapprovers").empty();
            jQuery('#tblBidapprovers').append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            for (var i = 0; i < data.length; i++) {
                if (data[i].isApprover != "P") {
                    rowBidApp = rowBidApp + 1;
                    str = '<tr id=trAppid' + rowBidApp + '>';
                    str += '<td><button type=button class="btn btn-xs btn-danger" disabled id=Removebtn' + rowBidApp + ' onclick="deleteBidApprow(trAppid' + rowBidApp + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                    str += '<td>' + data[i].approverName + '</td>'
                    str += "<td>" + data[i].emailID + "</td>";

                    str += "<td>" + data[i].adMinSrNo + "</td>";
                    str += "<td class=hide>" + data[i].userID + "</td></tr>";

                    jQuery('#tblBidapprovers').append(str);
                }
            }

            jQuery('#tblapprovers').append("</tbody>")
            if (jQuery('#tblBidapprovers tr').length <= 1) {
                jQuery('#btnbidapproversubmit').attr("disabled", "disabled");
            }
            else {
                jQuery('#btnbidapproversubmit').removeAttr("disabled");
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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
function fnclosepopupApprovers() {
    $('#addapprovers').modal('hide')
}

//////--------------****************************** add Approvers*********************************
var strrowfordetails = '';
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + BidID);
}
function fetchBidSummary(BidID) {
    var tncAttachment, anyotherAttachment;


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails/?BidID=" + BidID + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            if (data.length > 0) {
                BidTypeID = data[0].bidTypeID;
                jQuery('#bid_ConfiguredBy').html("Bid Configured By: " + data[0].configureByName);

                if (BidTypeID != "7") {
                    if (data[0].finalStatus != 'Awarded') {
                        $('#bid_status').html('Status: ' + data[0].finalStatus)
                    }

                    else {

                        $('#bid_status').html('Status: ' + data[0].finalStatus)
                    }
                }
                else {
                    if (data[0].finalStatus != 'Awarded') {
                        $('#bid_status').html('Status: ' + data[0].finalStatus)
                    } else {
                        $('#bid_status').html('Status: Approved')
                    }
                }


                if (data[0].bidClosingType != null) _bidClosingType = data[0].bidClosingType;

                if (sessionStorage.getItem("UserID") == data[0].decryptedConfiguredBy) {

                    if (data[0].itemStatus == "RunningBid") {
                        $('#butCancelbid').hide()
                    }
                    else {
                        $('#butCancelbid').show()
                    }

                    $('#btnCancelbidAdmin,#btnCancelbidAward,#cancl_btn,#btnCancelbidApp,#btn_invite_vendors').show();
                    $('#btnCancelbidAdmin,#btnCancelbidAward,#cancl_btn,#btnCancelbidApp,#btn_invite_vendors').removeClass('hide');

                    if (_bidClosingType == 'S' || _bidClosingType == '82') {
                        $('#btndiv').hide()

                        $('#spinnerBidclosingTab').hide()
                        if (BidTypeID == 7 && _bidClosingType == 'S') {

                            $('#btnpause').show()
                        }

                    }
                    else if (_bidClosingType == 'A' && data[0].bidForID == '82') {
                        $('#btndiv').hide()
                        $('#btnpause').hide()
                        $('#spinnerBidclosingTab').hide()

                    }
                    else {
                        $('#spinnerBidclosingTab').show()
                        $('#btndiv').show()
                        $('#btnpause').hide()
                    }

                    if ((data[0].status == 'Close' || data[0].status == 'CLOSE') && BidTypeID != 9) {
                        fnfetchvendortotalSummary(BidID, BidTypeID)
                    }
                    else {
                        $('#tblbidvendortotalsummary').addClass('hide')
                        $('#HRTotsumm').addClass('hide')

                    }
                    //  $('#lichat').removeClass('hide')
                }
                else {


                    $('#btnCancelbidAdmin,#btnCancelbidAward,#cancl_btn,#btnCancelbidApp,#butCancelbid,#btn_invite_vendors').hide();
                    $('#btnCancelbidAdmin,#btnCancelbidAward,#cancl_btn,#btnCancelbidApp,#butCancelbid,#btn_invite_vendors').addClass('hide');
                    $('#btndiv').hide()
                    $('#spinnerBidclosingTab').hide()

                    if (data[0].status.toLocaleLowerCase() == 'close' && BidTypeID != 9) {
                        fnfetchvendortotalSummary(BidID, BidTypeID)
                        $('#btn_invite_vendors').hide();
                    }
                    else {
                        $('#tblbidvendortotalsummary').addClass('hide')
                        $('#HRTotsumm').addClass('hide')
                        $('#btn_invite_vendors').show();
                    }
                    $('#btnpause').hide()
                    // $('#lichat').addClass('hide')
                }
                if (data[0].finalStatus == 'Cancel') {
                    $('#cancl_btn').hide();
                } else {
                    $('#cancl_btn').show();

                }
                if (data[0].status.toLocaleLowerCase() == 'close') {
                    $('#bid_status').show();
                }
                else if (data[0].status.toLocaleLowerCase() == 'pause') {
                    $('#bid_status').show();
                    $('#bid_status').html('Bid is paused from the selected Item / Service.<b> Serial No: ' + data[0].pausedSno + '</b>.');
                    $('.forbtnpause').hide()
                }

                var _bidDate = fnConverToLocalTime(data[0].bidDate);

                tncAttachment = data[0].termsConditions.replace(/\s/g, "%20");
                anyotherAttachment = data[0].attachment.replace(/\s/g, "%20");
                jQuery("#lblbidSubject").html('<b>' + data[0].bidSubject + '</b>');
                jQuery("#lblenquirysubject").html('<b>' + data[0].bidSubject + '</b>');
                jQuery("#lblbiddetails").text(data[0].bidDetails);
                jQuery('#RFQConfigueron').html('<b>' + _bidDate + '</b>')
                jQuery("#lblbiddate").text(_bidDate);

                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblEventID").text(BidID);
                if (data[0].bidForID == 81) {

                    jQuery("#lblbidfor").text('Price (English)');
                    PEfaBidForId = 81;
                }
                else if (data[0].bidForID == 82) {

                    jQuery("#lblbidfor").text('Dutch Auction');
                    PEfaBidForId = 82;
                }
                else if (data[0].bidForID == 83) {

                    jQuery("#lblbidfor").text('Price (japanese)');
                    PEfaBidForId = 83;
                }
                else {
                    jQuery("#lblbidfor").text(data[0].bidFor);
                }

                jQuery("#lblbidduration").text(data[0].bidDuration + ' mins');
                jQuery('#txtBidDurationPrev').val(data[0].bidDuration)
                $('#spinnerBidclosingTab').spinner({ value: data[0].bidDuration, step: 1, min: 1, max: 999 });
                jQuery("#lblcurrency").text(data[0].currencyName);
                jQuery("#lnkTermsAttachment").html(data[0].termsConditions);
                jQuery("#lnkAnyOtherAttachment").html(data[0].attachment);

                BidID = data[0].bidID
                BidTypeID = data[0].bidTypeID
                BidForID = data[0].bidForID
                $('#tbldetails').append("<tr><td>" + data[0].bidSubject + "</td><td>" + data[0].bidDetails + "</td><td>" + _bidDate + "</td><td>" + data[0].bidTypeName + "</td><td>" + jQuery("#lblbidfor").text() + "</td><td>" + data[0].bidDuration + "</td><td>" + data[0].currencyName + "</td></tr>")
                sessionStorage.setItem('hdnbidtypeid', BidTypeID)

                fetchBidSummaryDetails(BidID, BidForID);

            }
            else {

            }
        },

        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                jQuery("#error").text(xhr.d);
            }
            return false;
            jQuery.unblockUI();
        }
    });

    if (BidTypeID == 1 || BidTypeID == 6) {
        $('#lnktotvalue').show()
        $('#btngraphbubble').show()
    }
    else {
        $('#lnktotvalue').hide()
        $('#btngraphbubble').show()
    }
}
function fnTimeUpdate() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Data = {
        "BidClosingType": _bidClosingType,
        "BidID": parseInt(BidID),
        "BidDuration": parseInt(jQuery('#txtBidDurationPrev').val()),
        "SEID": 0,
        "UserID": sessionStorage.getItem('UserID')

    }
    connection.invoke("UpdateTimefromAdmin", JSON.stringify(Data)).catch(function (err) {
        return console.error(err.toString());

    });
    jQuery.unblockUI();
}

function fetchBidSummaryDetails(BidID, BidForID) {

    var BidTypeID = sessionStorage.getItem('hdnbidtypeid')
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidSummary/?BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&BidForID=" + BidForID + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            jQuery("#tblBidSummary > thead").empty();
            jQuery("#tblBidSummary > tbody").empty();
            jQuery("#tblbidsummarypercentagewise > thead").empty();
            jQuery("#tblbidsummarypercentagewise > tbody").empty();
            _bidarray = [];
            var wtavg = 0;
            if (data.length > 0) {


                if (parseInt(BidTypeID) == 6) {

                    $('#lnktotvalue').html('Detailed Report')
                    if ($('#lnktotvalue').html() == "Detailed Report") {
                        jQuery("#tblBidSumm").hide()
                        jQuery("#tblbidsummarypercentagewise").show()
                        $('#divfordetailreport').show()
                        $('#divforBidsummary').hide()
                    }
                    $('#lnktotvalue').hide() // IN FA For DEMO

                    var TotalBidValue = ''; // TotalBidValueCeiling = '', TotalBidValueInvoice = '';

                    var Percentreduction = '', Percentreductionceiling = '', Percentreductioninvoice = '';
                    var _offeredPrice;
                    var minimuminc;
                    $('#divTarget').hide();
                    var sname = '';
                    if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                        var strHead = "<tr><th>S No</th><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Quantity</th><th>UOM</th><th>Minimum Increment</th><th>Level</th><th>Vendor</th><th>Initial Quote</th><th>Highest Quote</th><th>Bid Value</th><th>Percentage Increment (Target Price)</th><th>Percentage Increment (Last Invoice Price)</th><th>Percentage Increment (Bid start price)</th></tr>"; //<th>Contract Duration</th><th>Dispatch Location</th>
                        var strHeadsummary = "<tr><th>S No</th><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Quantity</th><th>UOM</th><th>Minimum Increment</th><th>Level</th><th class=showvendor>Vendor</th><th>Initial Quote</th><th>Highest Quote</th><th>Bid Value</th><th>Percentage Increment (Target Price)</th><th>Percentage Increment (Last Invoice Price)</th><th>Percentage Increment (Bid start price)</th></tr>";
                    }
                    else {
                        var strHead = "<tr><th>S No</th><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Ceiling/ Max Price</th><th class='Offeredcls bold'>Current Offered Price</th><th>Quantity</th><th>UOM</th><th>Minimum Increment</th><th>Level</th><th>Vendor</th><th>Accepted Price</th><th>Bid Value</th><th>Percentage Decrement (Target Price)</th><th>Percentage Decrement (Last Invoice Price)</th><th>Percentage Decrement (Ceiling/ Max Price)</th></tr>";
                        var strHeadsummary = "<tr><th>S No</th><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Ceiling/ Max Price</th><th class='Offeredcls bold'>Current Offered Price</th><th>Quantity</th><th>UOM</th><th>Minimum Increment</th><th>Level</th><th class=showvendor >Vendor</th><th>Accepted Price</th><th>Bid Value</th><th>Percentage Decrement (Target Price)</th><th>Percentage Decrement (Last Invoice Price)</th><th>Percentage Decrement (Ceiling/ Max Price)</th></tr>";
                    }

                    jQuery('#tblBidSummary > thead').append(strHead);
                    jQuery('#tblBidSumm > thead').append(strHead);
                    jQuery('#tblbidsummarypercentagewise > thead').append(strHeadsummary);
                    var c = 1;

                    for (var i = 0; i < data.length; i++) {
                        _offeredPrice = (data[i].offeredPrice < 0) ? 'NA' : data[i].offeredPrice;
                        TotalBidValue = parseFloat(data[i].quantity) * parseFloat(data[i].lQuote);
                        //TotalBidValue = TotalBidValue.toFixed(2);
                        TotalBidValue = TotalBidValue % 1 != 0 ? TotalBidValue.toFixed(2) : TotalBidValue;
                        if (TotalBidValue != 0) {
                            if (data[i].targetPrice != 0) {
                                if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                    Percentreduction = parseFloat(parseFloat(data[i].lQuote / data[i].targetPrice) * 100 - 100).toFixed(2) + ' %'
                                }
                                else {
                                    Percentreduction = parseFloat(100 - parseFloat(data[i].lQuote / data[i].targetPrice) * 100).toFixed(2) + ' %'
                                }
                            }
                            else {
                                Percentreduction = 'Not Specified';
                            }
                            if (data[i].lastInvoicePrice != 0) {
                                if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                    Percentreductioninvoice = parseFloat(parseFloat(data[i].lQuote / data[i].lastInvoicePrice) * 100 - 100).toFixed(2) + ' %'
                                }
                                else {
                                    Percentreductioninvoice = parseFloat(100 - parseFloat(data[i].lQuote / data[i].lastInvoicePrice) * 100).toFixed(2) + ' %'
                                }

                            }
                            else {
                                Percentreductioninvoice = 'Not Specified';
                            }

                            if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                Percentreductionceiling = parseFloat(parseFloat(data[i].lQuote / data[i].ceilingPrice) * 100 - 100).toFixed(2) + ' %'
                            }
                            else {
                                Percentreductionceiling = parseFloat(100 - parseFloat(data[i].lQuote / data[i].ceilingPrice) * 100).toFixed(2) + ' %'
                            }

                        }
                        else {

                            Percentreduction = 'N/A';
                            Percentreductionceiling = 'N/A';
                            Percentreductioninvoice = 'N/A';
                        }
                        if (data[i].increamentOn == "P") {
                            minimuminc = thousands_separators(data[i].minimumIncreament) + ' %'
                        }
                        else {
                            minimuminc = thousands_separators(data[i].minimumIncreament)
                        }
                        if (sname != data[i].shortName) {
                            sname = data[i].shortName

                            if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                var str = '<tr id=lowa' + i + ' class=header><td  onclick="fnClickHeader(\'lowa' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].psid + ')"  style="text-decoration:none;">' + data[i].shortName + '</a></td><td class="text-right">' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right">' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right">' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right">' + thousands_separators(data[i].quantity) + '</td><td>' + data[i].uom + '</td><td class="text-right">' + (minimuminc) + '</td>';
                                var strsumm = '<tr id=low' + i + ' class=header><td  onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].psid + ')" style="text-decoration:none;" >' + data[i].shortName + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=CP' + i + ' >' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td>' + data[i].uom + '</td><td class="text-right" id=Mindec' + i + ' >' + (minimuminc) + '</td>';

                            }
                            else {

                                var str = '<tr id=lowa' + i + ' class=header><td  onclick="fnClickHeader(\'lowa' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].psid + ')" style=:text-decoration:none;">' + data[i].shortName + '</a></td><td class="text-right">' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right">' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right">' + thousands_separators(data[i].startingPrice) + '</td><td class="text-right"  >' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right bold  font-red Offeredcls">' + thousands_separators(_offeredPrice) + '</td><td class="text-right">' + thousands_separators(data[i].quantity) + '</td><td>' + data[i].uom + '</td><td class="text-right">' + (minimuminc) + '</td>';
                                var strsumm = '<tr id=low' + i + ' class=header><td  onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].psid + ')" style=text-decoration:none;">' + data[i].shortName + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right">' + thousands_separators(data[i].startingPrice) + '</td><td class="text-right" class="text-right" id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right bold  font-red Offeredcls">' + thousands_separators(_offeredPrice) + '</td><td class="text-right">' + thousands_separators(data[i].quantity) + '</td><td>' + data[i].uom + '</td><td class="text-right" id=Mindec' + i + '>' + (minimuminc) + '</td>';
                            }
                            c = c + 1;

                        }
                        else {
                            if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                var str = "<tr id=lowa" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>"; //<td>&nbsp;</td><td>&nbsp;</td>
                                var strsumm = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                            else {
                                var str = "<tr id=lowa" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class=Offeredcls>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                                var strsumm = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class=Offeredcls>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }

                        }

                        if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                            str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td><td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                            str += "<td class=text-right>" + (data[i].vQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td>";
                            str += "<td class=text-right>" + thousands_separators(TotalBidValue) + "</td>";
                            strsumm += "<td id=level" + i + " >" + data[i].srNo + "</td><td class='showvendor' id=vname" + i + " >" + data[i].vendorName + "</td><td class=text-right id=initialQuote" + i + " >" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                            strsumm += "<td class=text-right id=lowestquote" + i + " >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td><td class=text-right id=bidvalue" + i + " >" + thousands_separators(TotalBidValue) + "</td>";
                        }
                        else {
                            // alert(data[i].SrNo)
                            str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td>";
                            str += "<td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                            str += "<td class=text-right>" + thousands_separators(TotalBidValue) + "</td>";
                            strsumm += "<td>" + data[i].srNo + "</td><td class='showvendor' id=vname" + i + " >" + data[i].vendorName + "</td>";
                            strsumm += "<td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td><td class=text-right>" + thousands_separators(TotalBidValue) + "</td>";

                        }
                        if (data[i].srNo == 'H1') {
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreductionceiling + "</td>";
                            strsumm += "<td class=text-right style='background-color: #d9edf7; color: #31708f;' id=PerTP" + i + " >" + Percentreduction + "</td>";
                            strsumm += "<td class=text-right style='background-color: #d9edf7; color: #31708f;' id=PerLIP" + i + " >" + Percentreductioninvoice + "</td>";
                            strsumm += "<td class=text-right style='background-color: #d9edf7; color:#31708f;' id=PerCP" + i + " >" + Percentreductionceiling + "</td>";


                        }
                        else if (data[i].srNo == 'L1') {
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreductionceiling + "</td>";
                            strsumm += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            strsumm += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            strsumm += "<td class=text-right style='background-color: #d9edf7; color:#31708f;'>" + Percentreductionceiling + "</td>";
                        }
                        else {
                            str += "<td class=text-right>" + Percentreduction + "</td>";
                            str += "<td class=text-right>" + Percentreductioninvoice + "</td>";
                            str += "<td class=text-right>" + Percentreductionceiling + "</td>";
                            strsumm += "<td class=text-right id=PerTP" + i + " >" + Percentreduction + "</td>";
                            strsumm += "<td class=text-right id=PerLIP" + i + " >" + Percentreductioninvoice + "</td>";
                            strsumm += "<td class=text-right id=PerCP" + i + " >" + Percentreductionceiling + "</td>";
                        }



                        str += "</tr>";
                        strsumm += "<td class=hide id=TP" + i + ">" + removeThousandSeperator(data[i].targetPrice) + "</td><td class=hide id=lastinvoice" + i + ">" + removeThousandSeperator(data[i].lastInvoicePrice) + "</td><td class=hide id=quantity" + i + ">" + data[i].quantity + "</td><td class=hide id=psid" + data[i].psid + ">" + data[i].psid + "</td><td class=hide id=pid" + i + ">" + data[i].psid + "</td></tr>";
                        jQuery('#tblBidSummary > tbody').append(str);
                        jQuery('#tblbidsummarypercentagewise > tbody').append(strsumm);

                        if (data[i].srNo == 'H1') {

                            $('#lowa' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })
                            $('#low' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })

                            $('#low_str' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })
                        }
                        if (data[i].srNo == 'L1') {

                            $('#low' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })
                            $('#low_str' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })
                            $('#lowa' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })

                        }

                        if (PEfaBidForId == 82) {
                            if (page == "BidSummary.html" || page == "ApprovalForwardAuction.html") {
                                $('.Offeredcls').addClass('hide');
                            }
                            else {
                                $('.Offeredcls').removeClass('hide');
                            }
                        }

                    }


                }
                else if (parseInt(BidTypeID) == 9) {

                    $('#lnktotvalue').html('Detailed Report')
                    if ($('#lnktotvalue').html() == "Detailed Report") {
                        jQuery("#tblBidSumm").hide()
                        jQuery("#tblbidsummarypercentagewise").show()
                        $('#divfordetailreport').show()
                        $('#divforBidsummary').hide()
                    }
                    $('#lnktotvalue').hide()

                    var minimuminc;
                    $('#divTarget').hide();
                    var sname = '';
                    var strHead = "<tr><th>S No</th><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Total Quantity</th><th>Min. Quantity</th><th>Max. Quantity</th><th>Unallocated Quantity</th><th>UOM</th><th>Wt. Avg.</th><th>Minimum Increment</th><th>Level</th><th>Vendor</th><th>Quantity Bided</th><th>Allocated Quantity</th><th>Initial Quote</th><th>Highest Quote</th></tr>"; //<th>Contract Duration</th><th>Dispatch Location</th>
                    var strHeadsummary = "<tr><th>S No</th><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Total Quantity</th><th>Min. Quantity</th><th>Max. Quantity</th><th>Unallocated Quantity</th><th>UOM</th><th>Minimum Increment</th><th>Level</th><th  class=showvendor>Vendor</th><th>Quantity Bided</th><th>Allocated Quantity</th><th>Initial Quote</th><th>Highest Quote</th></tr>";
                    jQuery('#tblBidSummary > thead').append(strHead);
                    jQuery('#tblBidSumm > thead').append(strHead);
                    jQuery('#tblbidsummarypercentagewise > thead').append(strHeadsummary);

                    var c = 1; var cc = 0; var totquoteallocatedquan = 0; var totallocatedquan = 0;

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].increamentOn == "P") {
                            minimuminc = thousands_separators(data[i].minimumIncreament) + ' %'
                        }
                        else {
                            minimuminc = thousands_separators(data[i].minimumIncreament)
                        }
                        if (sname != data[i].shortName) {
                            sname = data[i].shortName
                            cc = cc + 1;
                            var str = '<tr id=lowa' + i + ' class=header><td  onclick="fnClickHeader(\'lowa' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].frid + ')"  style="text-decoration:none;">' + data[i].shortName + '</a></td><td class="text-right">' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right">' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right">' + thousands_separators(data[i].bidStartPrice) + '</td><td class="text-right">' + thousands_separators(data[i].quantity) + '</td><td class="text-right" id=minquantity' + i + ' >' + thousands_separators(data[i].minOfferedQuantity) + '</td><td class="text-right" id=maxquantity' + i + ' >' + thousands_separators(data[i].maxOfferedQuantity) + '</td><td class="text-right">' + thousands_separators(data[i].unallocatedQuantity) + '</td><td>' + data[i].uom + '</td><td  class="text-right ss' + cc + '" ></td><td class="text-right">' + (minimuminc) + '</td>';
                            var strsumm = '<tr id=low' + i + ' class=header><td  onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].frid + ')" style="text-decoration:none;" >' + data[i].shortName + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=CP' + i + ' >' + thousands_separators(data[i].bidStartPrice) + '</td><td class="text-right">' + thousands_separators(data[i].quantity) + '</td><td class="text-right" id=minquantity' + i + ' >' + thousands_separators(data[i].minOfferedQuantity) + '</td><td class="text-right" id=maxquantity' + i + ' >' + thousands_separators(data[i].maxOfferedQuantity) + '</td><td class="text-right">' + thousands_separators(data[i].unallocatedQuantity) + '</td><td>' + data[i].uom + '</td><td class="text-right" id=Mindec' + i + ' >' + (minimuminc) + '</td>';
                            c = c + 1;
                            totquoteallocatedquan = 0; totallocatedquan = 0; wtavg = 0;
                        }
                        else {
                            var str = "<tr id=lowa" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>"; //<td>&nbsp;</td><td>&nbsp;</td>
                            var strsumm = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                        }

                        str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td><td class=text-right >" + thousands_separators(data[i].biddedQuantity) + "</td><td class=text-right >" + thousands_separators(data[i].quantityAllocated) + "</td><td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                        str += "<td class=text-right>" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td>";

                        strsumm += "<td id=level" + i + " >" + data[i].srNo + "</td><td class=showvendor id=vname" + i + ">" + data[i].vendorName + "</td><td class=text-right>" + thousands_separators(data[i].biddedQuantity) + "</td><td class=text-right >" + thousands_separators(data[i].quantityAllocated) + "</td><td class=text-right id=initialQuote" + i + " >" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                        strsumm += "<td class=text-right id=lowestquote" + i + " >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td>";

                        str += "</tr>";

                        strsumm += "<td class=hide id=TP" + i + ">" + removeThousandSeperator(data[i].targetPrice) + "</td><td class=hide id=lastinvoice" + i + ">" + removeThousandSeperator(data[i].lastInvoicePrice) + "</td><td class=hide id=quantity" + i + ">" + data[i].quantity + "</td><td class=hide id=frid" + data[i].frid + ">" + data[i].frid + "</td></tr>";
                        jQuery('#tblBidSummary > tbody').append(str);
                        // jQuery('#tblBidSumm > tbody').append(str);
                        jQuery('#tblbidsummarypercentagewise > tbody').append(strsumm);

                        if (data[i].srNo == 'H1') {
                            $('#lowa' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })
                            $('#low' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })
                            $('#low_str' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })



                        }
                        totquoteallocatedquan = totquoteallocatedquan + (parseFloat(data[i].quantityAllocated) * parseFloat(data[i].lQuote))
                        totallocatedquan = totallocatedquan + parseFloat(data[i].quantityAllocated);
                        wtavg = totquoteallocatedquan / totallocatedquan;
                        $('.header').find(".ss" + cc).html(wtavg.round(2))


                    }

                }
                else if (parseInt(BidTypeID) == 7) {
                    $('#lnktotvalue').html('Detailed Report')
                    if ($('#lnktotvalue').html() == "Detailed Report") {
                        jQuery("#tblBidSumm").hide()
                        jQuery("#tblbidsummarypercentagewise").show()
                        $('#divfordetailreport').show()
                        $('#divforBidsummary').hide()
                    }
                    $('#lnktotvalue').hide();

                    var TotalBidValue = ''; // TotalBidValueCeiling = '', TotalBidValueInvoice = '';
                    var _offeredPrice;
                    var Percentreduction = '', Percentreductionceiling = '', Percentreductioninvoice = '';
                    $('#divTarget').hide();
                    var sname = '';
                    var minimumdec = '';
                    var strHeadsummary = "";
                    if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                        var strHead = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid start price</th><th>Quantity</th><th>UOM</th><th>Minimum Dec.</th><th>Level</th><th>Vendor</th><th>Loading Factor - &lambda; (in %)</th><th>Initial Quote</th><th>Lowest Quote</th><th>Bid Value</th><th>Percentage Reduction (Target Price)</th><th>Percentage Reduction (Last Invoice Price)</th><th>Percentage Reduction (Bid start price)</th></tr>";
                        if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                            fnbidpause();
                            strHeadsummary = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid start price</th><th>Quantity</th><th>UOM</th><th>Minimum Dec.</th><th>Item Closing Time</th><th class='itemtimeleft' >Time Left</th><th>Level</th><th  class=showvendor>Vendor</th><th>Loading Factor - &lambda; (in %)</th><th>Initial Quote</th><th>Lowest Quote</th><th>Bid Value</th><th>Percentage Reduction (Target Price)</th><th>Percentage Reduction (Last Invoice Price)</th><th>Percentage Reduction (Bid start price)</th></tr>";
                        }
                        else {
                            strHeadsummary = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid start price</th><th>Quantity</th><th>UOM</th><th>Minimum Dec.</th><th>Level</th><th  class=showvendor>Vendor</th><th>Loading Factor - &lambda; (in %)</th><th>Initial Quote</th><th>Lowest Quote</th><th>Bid Value</th><th>Percentage Reduction (Target Price)</th><th>Percentage Reduction (Last Invoice Price)</th><th>Percentage Reduction (Bid start price)</th></tr>";
                        }
                    }
                    else {
                        var strHead = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Floor/ Min Price</th><th class='Offeredcls bold'>Current Offered Price</th><th>Quantity</th><th>UOM</th><th>Minimum Decrement</th><th>Level</th><th>Vendor</th><th>Accepted Price</th><th>Bid Value</th><th>Percentage Increment (Target Price)</th><th>Percentage Increment (Last Invoice Price)</th><th>Percentage Increment (Floor/ Min Price)</th></tr>";
                        var strHeadsummary = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Floor/ Min Price</th><th class='Offeredcls bold'>Current Offered Price</th><th>Quantity</th><th>UOM</th><th>Minimum Decrement</th><th>Level</th><th  class=showvendor>Vendor</th><th>Accepted Price</th><th>Bid Value</th><th>Percentage Increment (Target Price)</th><th>Percentage Increment (Last Invoice Price)</th><th>Percentage Increment (Floor/ Min Price)</th></tr>";
                    }


                    jQuery('#tblBidSummary > thead').append(strHead);
                    jQuery('#tblBidSumm > thead').append(strHead);
                    jQuery('#tblbidsummarypercentagewise > thead').append(strHeadsummary);
                    var c = 1; countpausecolor = 0;

                    for (var i = 0; i < data.length; i++) {

                        _offeredPrice = (data[i].offeredPrice < 0) ? 'NA' : data[i].offeredPrice;
                        TotalBidValue = parseFloat(data[i].quantity) * parseFloat(data[i].lQuote);
                        TotalBidValue = TotalBidValue % 1 != 0 ? TotalBidValue.toFixed(2) : TotalBidValue;
                        if (TotalBidValue != 0) {
                            if (data[i].targetPrice != 0) {
                                if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                    Percentreduction = parseFloat(100 - parseFloat(data[i].lQuote / data[i].targetPrice) * 100).toFixed(2) + ' %'
                                }
                                else {
                                    Percentreduction = (parseFloat(parseFloat(data[i].lQuote / data[i].targetPrice) - 1) * 100).toFixed(2) + ' %'

                                }
                            }
                            else {
                                Percentreduction = 'Not Specified';
                            }
                            if (data[i].lastInvoicePrice != 0) {
                                if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                    Percentreductioninvoice = parseFloat(100 - parseFloat(data[i].lQuote / data[i].lastInvoicePrice) * 100).toFixed(2) + ' %'
                                }
                                else {
                                    Percentreductioninvoice = (parseFloat(parseFloat(data[i].lQuote / data[i].lastInvoicePrice) - 1) * 100).toFixed(2) + ' %'
                                }
                            }
                            else {
                                Percentreductioninvoice = 'Not Specified';
                            }

                            if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                Percentreductionceiling = parseFloat(100 - parseFloat(data[i].lQuote / data[i].ceilingPrice) * 100).toFixed(2) + ' %'
                            }
                            else {

                                Percentreductionceiling = (parseFloat(parseFloat(data[i].lQuote / data[i].ceilingPrice) - 1) * 100).toFixed(2) + ' %'
                            }
                        } else {

                            Percentreduction = 'N/A';
                            Percentreductionceiling = 'N/A';
                            Percentreductioninvoice = 'N/A';
                        }
                        if (data[i].decreamentOn == "P") {
                            minimumdec = thousands_separators(data[i].minimumDecreament) + ' %'
                        }
                        else {
                            minimumdec = thousands_separators(data[i].minimumDecreament) + ' ' + data[i].selectedCurrency
                        }
                        var desitinationport = data[i].destinationPort.replace(/<br\s*\/?>/gi, ' ');

                        if (sname != desitinationport) {
                            sname = desitinationport
                            if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {

                                    if (data[i].itemStatus == "Open") {
                                        var strsumm = '<tr id=low_str' + i + ' style="background-color: #32C5D2!important; color: #000000!important;"   class=header><td id=i_expandcollapse' + i + '  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')" >' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + ' ></a></td><td id=Sname' + i + ' ><a href="javascript:;" onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;">' + desitinationport + '</a></td><td class="text-right " id=TP' + i + '  >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td id=ClosingTime' + i + '>' + data[i].closingTime + '</td><td class=itemtimeleft id=itemleftTime' + i + ' class=bold></td>';
                                        var str = '<tr id=lowa' + i + '  style="background-color: #32C5D2!important; color: #000000!important;"   class=header><td id=i_expandcollapse' + i + '   onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=SnameD' + i + '><a href="javascript:;" onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" >' + thousands_separators(data[i].targetPrice) + '</td><td  class="text-right" >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td  class="text-right" id=CPD' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" >' + thousands_separators(data[i].quantity) + '</td><td class=text-right>' + data[i].uom + '</td><td class=text-right id=MindecD' + i + '>' + minimumdec + '</td>';
                                    }
                                    else if (data[i].itemStatus == "Pause") {

                                        var strsumm = '<tr id=low_str' + i + ' style="background-color: #ffa07a!important; color: #000000!important;"   class=header><td id=i_expandcollapse' + i + '  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')" >' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + ' ></a></td><td id=Sname' + i + ' ><a href="javascript:;" onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;">' + desitinationport + '</a></td><td class="text-right " id=TP' + i + '  >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td id=ClosingTime' + i + '>' + data[i].closingTime + '</td><td class=itemtimeleft id=itemleftTime' + i + ' class=bold></td>';
                                        if (countpausecolor == 0) {
                                            var str = '<tr id=lowa' + i + '  style="background-color: #ffa07a!important; color: #000000!important;"   class=header><td id=i_expandcollapse' + i + '   onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=SnameD' + i + '><a href="javascript:;" onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" >' + thousands_separators(data[i].targetPrice) + '</td><td  class="text-right" >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td  class="text-right" id=CPD' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" >' + thousands_separators(data[i].quantity) + '</td><td class=text-right>' + data[i].uom + '</td><td class=text-right id=MindecD' + i + '>' + minimumdec + '</td>';
                                        }
                                        else {
                                            var str = '<tr id=lowa' + i + ' class=header><td id=i_expandcollapse' + i + '   onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=SnameD' + i + '><a href="javascript:;" onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" >' + thousands_separators(data[i].targetPrice) + '</td><td  class="text-right" >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td  class="text-right" id=CPD' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" >' + thousands_separators(data[i].quantity) + '</td><td class=text-right>' + data[i].uom + '</td><td class=text-right id=MindecD' + i + '>' + minimumdec + '</td>';
                                        }
                                        countpausecolor = countpausecolor + 1;
                                    }
                                    else {
                                        var strsumm = '<tr id=low_str' + i + ' class="header" ><td id=i_expandcollapse' + i + '  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + '  ></a></td><td id=Sname' + i + ' ><a  href="javascript:;" onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right"  id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=CP' + i + ' >' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=quantity' + i + '  >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td id=ClosingTime' + i + '>' + data[i].closingTime + '</td><td class=itemtimeleft id=itemleftTime' + i + ' class=bold></td>';
                                        var str = '<tr id=lowa' + i + '   class=header><td id=i_expandcollapse' + i + '   onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=SnameD' + i + '><a href="javascript:;" onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" >' + thousands_separators(data[i].targetPrice) + '</td><td  class="text-right" >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td  class="text-right" id=CPD' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" >' + thousands_separators(data[i].quantity) + '</td><td class=text-right>' + data[i].uom + '</td><td class=text-right id=MindecD' + i + '>' + minimumdec + '</td>';
                                    }

                                }
                                else {
                                    var strsumm = '<tr id=low_str' + i + ' class="header" ><td id=i_expandcollapse' + i + ' onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=Sname' + i + '><a href="javascript:;"  onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;">' + desitinationport + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class=text-right id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class=text-right id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td>';// btn - icon - only
                                    var str = '<tr id=lowa' + i + '   class=header><td id=i_expandcollapse' + i + '   onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=SnameD' + i + '><a href="javascript:;" onclick="fetchGraphData(' + data[i].seId + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" >' + thousands_separators(data[i].targetPrice) + '</td><td  class="text-right" >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td  class="text-right" id=CPD' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" >' + thousands_separators(data[i].quantity) + '</td><td class=text-right>' + data[i].uom + '</td><td class=text-right id=MindecD' + i + '>' + minimumdec + '</td>';
                                }
                            }

                            else {
                                var str = '<tr id=lowa' + i + ' class=header><td  onclick="fnClickHeader(\'lowa' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].seId + ')" style=:text-decoration:none;">' + desitinationport + '</a></td><td class="text-right">' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right">' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right">' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right">' + thousands_separators(data[i].startingPrice) + '</td><td class="text-right bold  font-red Offeredcls">' + thousands_separators(_offeredPrice) + '</td><td class="text-right">' + thousands_separators(data[i].quantity) + '</td><td>' + data[i].uom + '</td><td class="text-right">' + (minimumdec) + '</td>';
                                var strsumm = '<tr id=low_str' + i + ' class=header><td  onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].seId + ')" style=text-decoration:none;">' + desitinationport + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right">' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right">' + thousands_separators(data[i].startingPrice) + '</td><td class="text-right bold  font-red Offeredcls">' + thousands_separators(_offeredPrice) + '</td><td class="text-right">' + thousands_separators(data[i].quantity) + '</td><td>' + data[i].uom + '</td><td class="text-right">' + (minimumdec) + '</td>';
                            }
                            c = c + 1;
                        }
                        else {
                            if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                                var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";

                                if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                                    var strsumm = "<tr id=low_str" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class='itemtimeleft'>&nbsp;</td>";
                                }
                                else {
                                    var strsumm = "<tr id=low_str" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                                }
                            }
                            else {
                                var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class=Offeredcls>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>"; //<td>&nbsp;</td><td>&nbsp;</td>
                                var strsumm = "<tr id=low_str" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class=Offeredcls>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                        }

                        if (PEfaBidForId == 81 || PEfaBidForId == 83) {
                            str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td><td class='text-right'>" + data[i].advFactor + "</td><td class='text-right' >" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                            str += "<td class='text-right' class='text-right' >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td>";
                            str += "<td class='text-right' >" + thousands_separators(TotalBidValue) + "</td>";
                            strsumm += "<td id=level" + i + " id=level" + i + " >" + data[i].srNo + "</td><td id=vname" + i + "  class=showvendor >" + data[i].vendorName + "</td><td class='text-right'>" + data[i].advFactor + "</td><td class='text-right' id=initialQuote" + i + ">" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                            strsumm += "<td class='text-right' id=lowestquote" + i + " >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td><td id=bidvalue" + i + " >" + thousands_separators(TotalBidValue) + "</td>";
                        }
                        else {

                            str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td>";
                            str += "<td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                            str += "<td class=text-right>" + thousands_separators(TotalBidValue) + "</td>";
                            strsumm += "<td>" + data[i].srNo + "</td><td  class=showvendor >" + data[i].vendorName + "</td>";
                            strsumm += "<td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td><td class=text-right>" + thousands_separators(TotalBidValue) + "</td>";
                        }
                        if (data[i].srNo == 'L1') {
                            str += "<td  style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            str += "<td  style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreductionceiling + "</td>";
                            strsumm += "<td  id=PerTP" + i + "  style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            strsumm += "<td id=PerLIP" + i + "  style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            strsumm += "<td id=PerCP" + i + "  style='background-color: #d9edf7; color:#31708f;'>" + Percentreductionceiling + "</td>";


                        }
                        else if (data[i].srNo == 'H1') {
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            str += "<td class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreductionceiling + "</td>";
                            strsumm += "<td  id=PerTP" + i + "  class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            strsumm += "<td id=PerLIP" + i + " class=text-right style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            strsumm += "<td id=PerCP" + i + " class=text-right style='background-color: #d9edf7; color:#31708f;'>" + Percentreductionceiling + "</td>";
                        }
                        else {
                            str += "<td>" + Percentreduction + "</td>";
                            str += "<td>" + Percentreductioninvoice + "</td>";
                            str += "<td>" + Percentreductionceiling + "</td>";
                            strsumm += "<td id=PerTP" + i + " >" + Percentreduction + "</td>";
                            strsumm += "<td id=PerLIP" + i + " >" + Percentreductioninvoice + "</td>";
                            strsumm += "<td id=PerCP" + i + " >" + Percentreductionceiling + "</td>";
                        }

                        str += "<td class=hide id=selectedcurr" + i + ">" + data[i].selectedCurrency + "</td><td class=hide id=TP" + i + ">" + removeThousandSeperator(data[i].targetPrice) + "</td><td class=hide id=lastinvoice" + i + ">" + removeThousandSeperator(data[i].lastInvoicePrice) + "</td><td class=hide id=quantity" + i + ">" + data[i].quantity + "</td><td class=hide id=seid" + i + ">" + data[i].seId + "</td></tr>";
                        strsumm += "<td class=hide id=selectedcurr" + i + ">" + data[i].selectedCurrency + "</td><td class=hide id=TP" + i + ">" + removeThousandSeperator(data[i].targetPrice) + "</td><td class=hide id=lastinvoice" + i + ">" + removeThousandSeperator(data[i].lastInvoicePrice) + "</td><td class=hide id=quantity" + i + ">" + data[i].quantity + "</td><td class=hide id=seid" + i + ">" + data[i].seId + "</td></tr>";

                        jQuery('#tblBidSummary > tbody').append(str);
                        jQuery('#tblbidsummarypercentagewise > tbody ').append(strsumm);
                        if (page.toLocaleLowerCase() == "bidadmin.html") {
                            if (data[i].itemStatus == "Open" && _bidClosingType == 'S' && $('#Sname' + i).text() != "") {
                                displayForS = document.querySelector('#itemleftTime' + i);
                                startTimerForStaggerItem((parseInt(data[i].itemLeftTime)), displayForS);
                                $('.itemtimeleft').removeClass('hide')
                            }
                        }
                        else {
                            $('.itemtimeleft').addClass('hide')
                        }

                        if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                            if (data[i].srNo == 'L1' && data[i].itemStatus != 'Open') {
                                $('#low_str' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })

                                $('#low' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#lowa' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                            }
                            $('#itemleftTime' + i).css({
                                'color': 'Red',
                                'font-weight': '500'
                            });

                        }
                        else {

                            if (data[i].srNo == 'L1') {

                                $('#low_str' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })

                                $('#low' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#lowa' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                /* $('.header').css({
                                     'background-color': '#dff0d8',
                                     'font-weight': 'bold',
                                     'color': '#3c763d'
                                 })*/

                            }
                            if (data[i].srNo == 'H1') {
                                $('#low_str' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#low' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#lowa' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                            }
                        }

                        if (PEfaBidForId == 82) {
                            if (page == "BidSummary.html" || page == "ApprovalSeaExport.html") {
                                $('.Offeredcls').addClass('hide');
                            }
                            else {
                                $('.Offeredcls').removeClass('hide');
                            }
                        }

                    }

                }
                else if (parseInt(BidTypeID) == 8) {
                    $('#lnktotvalue').html('Detailed Report')
                    if ($('#lnktotvalue').html() == "Detailed Report") {
                        jQuery("#tblBidSumm").hide()
                        jQuery("#tblbidsummarypercentagewise").show()
                        $('#divfordetailreport').show()
                        $('#divforBidsummary').hide()
                    }
                    $('#lnktotvalue').hide();

                    var TotalBidValue = '';
                    $('#divTarget').hide();
                    var sname = '';
                    var minimumdec = '';

                    var strHead = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Minimum Dec.</th><th>Vendor</th><th>Landed Price</th><th>Cess</th><th>GST %</th><th>NCV</th><th>Level</th><th>Initial Quote</th><th>Lowest Quote</th><th class=hide>Bid Value</th><th>Quantity Offered</th></tr>";


                    var strHeadsummary = ""; //"<tr><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid start price</th><th>Quantity</th><th>UOM</th><th style=display:none; id=theadbidclosingType></th><th>Level</th><th>Vendor</th><th>Loading Factor - &lambda; (in %)</th><th>Initial Quote</th><th>Lowest Quote</th><th>Bid Value</th><th>Percentage Reduction (Target Price)</th><th>Percentage Reduction (Last Invoice Price)</th><th>Percentage Reduction (Bid start price)</th></tr>";
                    if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {

                        strHeadsummary = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Minimum Dec.</th><th  class=showvendor>Vendor</th><th>Landed Price</th><th>Cess</th><th>GST %</th><th>NCV</th><th>Item Closing Time</th><th>Level</th><th>Initial Quote</th><th>Lowest Quote</th><th class=hide>Bid Value</th><th>Quantity Offered</th></tr>";
                    }
                    else {
                        strHeadsummary = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Minimum Dec.</th><th  class=showvendor>Vendor</th><th>Landed Price</th><th>Cess</th><th>GST %</th><th>NCV</th><th>Level</th><th>Initial Quote</th><th>Lowest Quote</th><th class=hide>Bid Value</th><th>Quantity Offered</th></tr>";
                    }


                    jQuery('#tblBidSummary > thead').append(strHead);
                    jQuery('#tblBidSumm > thead').append(strHead);
                    jQuery('#tblbidsummarypercentagewise > thead').append(strHeadsummary);
                    var c = 1;

                    for (var i = 0; i < data.length; i++) {

                        TotalBidValue = parseFloat(data[i].quantity) * parseFloat(data[i].lQuote);
                        TotalBidValue = TotalBidValue % 1 != 0 ? TotalBidValue.toFixed(2) : TotalBidValue;
                        minimumdec = thousands_separators(data[i].minimumDecreament)// + ' ' + data[i].selectedCurrency
                        var desitinationport = data[i].destinationPort.replace(/<br\s*\/?>/gi, ' ');

                        if (sname != desitinationport) {
                            sname = desitinationport
                            var str = '<tr id=lowa' + i + '  class=header><td id=i_expandcollapse' + i + '   onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=SnameD' + i + '><a href="javascript:;" onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" >' + thousands_separators(data[i].targetPrice) + '</td><td  class="text-right" >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" >' + thousands_separators(data[i].quantity) + '</td><td class=text-right>' + data[i].uom + '</td><td  class="text-right" id=CPD' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class=text-right id=MindecD' + i + '>' + minimumdec + '</td>';
                            if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {

                                if (data[i].itemStatus == "Open") {
                                    var strsumm = '<tr id=low_str' + i + ' style="background-color: #32C5D2!important; color: #000000!important;"  class=header><td id=i_expandcollapse' + i + '  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')" >' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + ' data-toggle="popover" data-trigger="hover" data-content="Collapse/Expand"   data-placement="left"></a></td><td id=Sname' + i + ' ><a href="javascript:;" onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;">' + desitinationport + '</a></td><td class="text-right " id=TP' + i + '  >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td id=ClosingTime' + i + '>' + data[i].closingTime + '</td>';
                                }
                                else {
                                    var strsumm = '<tr id=low_str' + i + ' class="header" ><td id=i_expandcollapse' + i + '  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + '  ></a></td><td id=Sname' + i + ' ><a  href="javascript:;" onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right"  id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=quantity' + i + '  >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=CP' + i + ' >' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td id=ClosingTime' + i + '>' + data[i].closingTime + '</td>';
                                }
                            }
                            else {
                                var strsumm = '<tr id=low_str' + i + ' class="header" ><td id=i_expandcollapse' + i + '   onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=Sname' + i + '><a href="javascript:;"  onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;">' + desitinationport + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class=text-right id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class=text-right id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td>';
                            }
                            c = c + 1;

                        }
                        else {
                            var str = "<tr id=lowa" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";

                            if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                                var strsumm = "<tr id=low_str" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                            else {
                                var strsumm = "<tr id=low_str" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                        }


                        str += "<td>" + data[i].vendorName + "</td><td class=text-right>" + (data[i].landedPrice == '0' ? '' : thousands_separators(data[i].landedPrice)) + "</td><td class=text-right>" + (data[i].cess == '0' ? '' : thousands_separators(data[i].cess)) + "</td><td class=text-right>" + data[i].gst + "</td><td class=text-right>" + (data[i].ncv == '0' ? '' : thousands_separators(data[i].ncv)) + "</td><td>" + data[i].srNo + "</td><td class='text-right' >" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                        str += "<td class='text-right' class='text-right' >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td>";
                        str += "<td class='text-right hide'>" + thousands_separators(TotalBidValue) + "</td><td>" + (data[i].offeredQuan == '0' ? '' : thousands_separators(data[i].offeredQuan)) + "</td>";

                        strsumm += "<td id=vname" + i + "  class=showvendor >" + data[i].vendorName + "</td><td class=text-right>" + (data[i].landedPrice == '0' ? '' : thousands_separators(data[i].landedPrice)) + "</td><td class=text-right>" + (data[i].cess == '0' ? '' : thousands_separators(data[i].cess)) + "</td><td class=text-right>" + data[i].gst + "</td><td class=text-right>" + (data[i].ncv == '0' ? '' : thousands_separators(data[i].ncv)) + "</td><td id=level" + i + " id=level" + i + " >" + data[i].srNo + "</td><td class='text-right' id=initialQuote" + i + ">" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                        strsumm += "<td class='text-right' id=lowestquote" + i + " >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td><td id=bidvalue" + i + " class=hide>" + thousands_separators(TotalBidValue) + "</td><td>" + (data[i].offeredQuan == '0' ? '' : thousands_separators(data[i].offeredQuan)) + "</td>";


                        str += "<td class=hide id=selectedcurr" + i + ">" + data[i].selectedCurrency + "</td><td class=hide id=TP" + i + ">" + removeThousandSeperator(data[i].targetPrice) + "</td><td class=hide id=lastinvoice" + i + ">" + removeThousandSeperator(data[i].lastInvoicePrice) + "</td><td class=hide id=quantity" + i + ">" + data[i].quantity + "</td><td class=hide id=coalid" + i + ">" + data[i].coalID + "</td></tr>";
                        strsumm += "<td class=hide id=selectedcurr" + i + ">" + data[i].selectedCurrency + "</td><td class=hide id=TP" + i + ">" + removeThousandSeperator(data[i].targetPrice) + "</td><td class=hide id=lastinvoice" + i + ">" + removeThousandSeperator(data[i].lastInvoicePrice) + "</td><td class=hide id=quantity" + i + ">" + data[i].quantity + "</td><td class=hide id=coalid" + i + ">" + data[i].coalID + "</td></tr>";

                        jQuery('#tblBidSummary').append(str);
                        jQuery('#tblbidsummarypercentagewise').append(strsumm);


                        if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                            if (data[i].srNo == 'L1' && data[i].itemStatus != 'Open') {
                                $('#low_str' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#low' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#lowa' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                            }
                        }
                        else {
                            if (data[i].srNo == 'L1') {
                                $('#low_str' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#low' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#lowa' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })

                            }
                        }

                    }

                }
                else {

                    jQuery('#tblBidSummary > tbody').append("<tr><td colspan='18' style='text-align: center; color:red;'>No record found</td></tr>");
                }
                if (data[0].hideVendor == "Y") {
                    $('.showvendor').addClass('hide');
                }
                else {
                    $('.showvendor').removeClass('hide');
                }


            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
            return false;

        }
    });
    //jQuery.unblockUI();
}
function fnfetchvendortotalSummary(BidID, BidTypeID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidVendortotalSummary/?BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            jQuery("#tblbidvendortotalsummary").empty();
            if (data.length > 0) {
                $('#tblbidvendortotalsummary').removeClass('hide')
                $('#HRTotsumm').removeClass('hide')

                jQuery("#tblbidvendortotalsummary").append("<thead><tr style='background: gray; color: #FFF'><th>Supplier</th><th style='width:15%!important;'>Total</th><th style='width:20%!important;' class=loadingfactor >Loading Factor - &lambda; (in %)</th></thead>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#tblbidvendortotalsummary").append("<tr><td><i style='color: blue!important;cursor:pointer;' onclick='fnShowVendorConnecHistory(" + data[i].vendorID + ")' class='hide fa fa-info-circle fa-fw IPicon'  aria-hidden='true'></i>&nbsp;" + data[i].vendorName + "</td><td class=text-right >" + thousands_separators(data[i].totalamount) + "</td><td class='text-right loadingfactor'>" + data[i].advFactor + "</td></tr>");
                }
                if (page.toLocaleLowerCase() == "bidsummary.html") {
                    $('.IPicon').removeClass('hide')
                }
            }
            else {
                $('#HRTotsumm').addClass('hide')
                $('#tblbidvendortotalsummary').addClass('hide')
                jQuery("#tblbidvendortotalsummary").append("<tr colspan=2 style='text-align: center; color: Red' >No record's found</tr>");
            }
            if (BidTypeID == 6) {
                $('.loadingfactor').hide()
            }
            else {
                $('.loadingfactor').show()
            }
        }
    });
}
function fnClickHeader(event, icon, flag) {
    $('#' + event).nextUntil('tr.header').slideToggle(200);

}
function fnShowVendorConnecHistory(vendorid) {
    $('#IPHistory').modal('show');
    fngetConnHistory(vendorid);
}
function fngetConnHistory(vendorid) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidvendorConnectionlog/?BidID=" + BidID + "&VendorID=" + vendorid + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            var JSonData = JSON.parse(data[0].jsondata);
            console.log(JSonData)
            $('#connscroll').show()
            jQuery("#tblIPHistory").empty();
            if (JSonData != null && JSonData.length > 0) {

                jQuery("#tblIPHistory").append("<thead><tr style='background:gray;color:#FFF' style='width:10%!important;'><th>IP</th><th style='width:20%!important;'>From</th><th style='width:20%!important;'>To</th><th style='width:20%!important;'>Status</th></thead>");
                for (var i = 0; i < JSonData.length; i++) {
                    jQuery("#tblIPHistory").append("<tr><td>" + JSonData[i].machineIP + "</td><td>" + fnConverToLocalTime(JSonData[i].ConnectionFrom) + "</td><td>" + fnConverToLocalTime(JSonData[i].ConnectionTo) + "</td><td>" + JSonData[i].Status + "</td></tr>");
                }
            }
            else {


                jQuery("#tblIPHistory").append("<thead><tr><th>No record's found</th></tr></thead>");
            }

        }
    });
}
var openlefttime = 0;
function fnrefreshStaggerTimerdataonItemClose() {

    Url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidStagger/?BidID=" + BidID + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID"))
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: Url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            openlefttime = 0;
            var TotalBidValue = '';
            var Percentreduction = '', Percentreductionceiling = '', Percentreductioninvoice = '';
            var rowcount = $("#tblbidsummarypercentagewise > tbody > tr").length;

            for (var j = 0; j < rowcount; j++) {
                if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                    if ($('#level' + j).html() == 'L1') {
                        $('#low_str' + j).css({
                            'background-color': '#dff0d8!important',
                            'font-weight': 'bold',
                            'color': '#3c763d'
                        })

                    }
                    else {
                        $('#low_str' + j).removeAttr('style');
                    }
                    $('#itemleftTime' + j).html('')
                }

                for (var i = 0; i < data.length; i++) {
                    if (data[i].itemStatus.toLowerCase() == 'open') {
                        openlefttime = openlefttime + data[i].itemLeftTime;
                    }
                    if (data[i].itemStatus.toLowerCase() == 'open' || data[i].itemStatus.toLowerCase() == 'inactive') {
                        if ($('#seid' + j).html() == data[i].seId) {

                            TotalBidValue = parseFloat(removeThousandSeperator($('#quantity' + j).text())) * parseFloat(data[i].lQuote);
                            TotalBidValue = TotalBidValue % 1 != 0 ? TotalBidValue.toFixed(2) : TotalBidValue;
                            if (TotalBidValue != 0) {
                                if ($('#TP' + j).html() != 0) {
                                    Percentreduction = parseFloat(100 - parseFloat(data[i].lQuote / $('#TP' + j).html()) * 100).toFixed(2) + ' %'
                                }
                                else {
                                    Percentreduction = 'Not Specified';
                                }
                                if ($('#lastinvoice' + j).html() != 0) {
                                    Percentreductioninvoice = parseFloat(100 - parseFloat(data[i].lQuote / $('#lastinvoice' + j).html()) * 100).toFixed(2) + ' %'
                                }
                                else {
                                    Percentreductioninvoice = 'Not Specified';
                                }
                                Percentreductionceiling = parseFloat(100 - parseFloat(data[i].lQuote / (data[i].ceilingPrice)) * 100).toFixed(2) + ' %'
                            }
                            else {

                                Percentreduction = 'N/A';
                                Percentreductionceiling = 'N/A';
                                Percentreductioninvoice = 'N/A';
                            }

                            $('#initialQuote' + j).html((data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)))
                            $('#lowestquote' + j).html((data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)))

                            $('#bidvalue' + j).html(thousands_separators(TotalBidValue))
                            $('#level' + j).html(data[i].srNo)



                            $('#ClosingTime' + j).html(data[i].closingTime)
                            $('#CP' + j).html(thousands_separators(data[i].ceilingPrice))
                            $('#vname' + j).html(data[i].vendorName)
                            if (data[i].decreamentOn == "P") {
                                $('#Mindec' + j).html(thousands_separators(data[i].minimumDecreament)) + ' %'
                            }
                            else {
                                $('#Mindec' + j).html(thousands_separators(data[i].minimumDecreament)) + $('#selectedcurr' + j).html()
                            }

                            $('#PerTP' + j).html(Percentreduction)
                            $('#PerLIP' + j).html(Percentreductioninvoice)
                            $('#PerCP' + j).html(Percentreductionceiling)

                            if (data[i].srNo == 'L1') {
                                $('#PerTP' + j, '#PerLIP' + j, '#PerCP' + j).attr('style', 'background-color:#d9edf7;color: #31708f;');

                            }


                            if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                                if (data[i].srNo == 'L1' && data[i].itemStatus != 'Open') {
                                    $('#low_str' + j).css({
                                        'background-color': '#dff0d8!important',
                                        'font-weight': 'bold',
                                        'color': '#3c763d'
                                    })

                                }
                                if ($('#Sname' + j).text() != "" && data[i].itemStatus == 'Open') {
                                    $('#low_str' + j).css({
                                        'background-color': '#32C5D2!important',
                                        'color': '#000000!important'
                                    })
                                    displayForS = document.querySelector('#itemleftTime' + j);
                                    startTimerForStaggerItem((parseInt(data[i].itemLeftTime)), displayForS);
                                }
                                $('#itemleftTime' + j).css({
                                    'color': 'Red',
                                    'font-weight': '500'
                                });

                            }
                            j = j + 1;
                        }
                    }
                    else if (data[i].itemStatus.toLowerCase() == 'pause' && openlefttime <= 0) {

                        clearInterval(mytimeforSatus)
                        clearInterval(mytime)
                        bootbox.alert("Bid is successfully paused. To Start again, go to Manage Open Bids", function () {
                            window.location = "index.html";
                            return false;
                        });
                        break;
                    }
                }
            }
            fnbidpause();
            //** Refresh Total Time if extension /on window focus 
            fetchBidTime();
        }
    });
    $(window).blur();
}

function fnbidpause() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });


    var url = sessionStorage.getItem("APIPath") + "ConfigureBid/FetchRAItems/?BidID=" + sessionStorage.getItem("BidID");
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            $("#tblbiditimes").empty()
            if (data.length > 0) {


                $("#tblbiditimes").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/Service</th><th>Action</th></thead>");
                for (var i = 0; i < data.length; i++) {
                    $("#tblbiditimes").append('<tr class=text-center><td>' + data[i].sno + '</td><td class=hide id=seid' + i + '>' + data[i].seid + '</td><td>' + data[i].destinationPort + '</td><td><button type=button id=btnpause' + i + ' class="btn yellow btn-sm" onclick="fnpauseaction(\'' + i + '\',\'' + data[i].seid + '\',\'' + data[i].sno + '\')" >Pause</button></td></tr>');

                }
            }
            else {
                jQuery("#tblbiditimes").append("<tr><td>No Items</td></tr>")
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();

        }
    })
    jQuery.unblockUI();
}
function fnpauseaction(index, seid, sno) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var _bidDate = new Date();
    var Data = {
        "BidID": parseInt(sessionStorage.getItem("BidID")),
        "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
        "SeID": parseInt(seid),
        "BidDate": _bidDate,
        "Action": $('#btnpause' + index).text(),
        "UserID": sessionStorage.getItem('UserID')
    }
    connection.invoke("PauseStagger", JSON.stringify(Data)).catch(function (err) {
        return console.error(err.toString());

    });
    connection.on("refreshBidStatusAfterPause", function (data) {
        fnbidpause();
        $('#pauseauction').modal('hide');
        bootbox.alert("Bid will be paused from the selected Item/Service .");
        $('#btnpause').hide();
        $('#bid_status').show();
        $('#bid_status').html('Bid will be paused from the selected Item/Service.<b>Serial No: ' + sno + '</b>.')

    });

    connection.onclose(error => {

        bootbox.alert("You are not connected to the Bid as Your Internet connection is unstable, please refresh the page!!", function () {
            return true;
        });
    });



    jQuery.unblockUI();
}
///////////////////////----************************************signal R Start****************************************************

//$(window).load(function () {

//if (page.toLocaleLowerCase() == "bidadmin.html") {
var connection = new signalR.HubConnectionBuilder().withUrl(sessionStorage.getItem("APIPath") + "bid?bidid=" + parseInt(sessionStorage.getItem('BidID')) + "&userType=" + sessionStorage.getItem("UserType") + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID'))).withAutomaticReconnect().build();
console.log('Not Started')

connection.start({ transport: ['webSockets', 'serverSentEvents', 'foreverFrame', 'longPolling'] }).then(function () {
    console.log('connection started')
}).catch(function (err) {
    console.log(err.toString())
});
connection.on("refreshChatUsers", function (rdataJson, connectionId, flag) {
    let data = JSON.parse(rdataJson)

    if ($("#hddnadminConnection").val() == "0") {
        $("#hddnadminConnection").val(connectionId);
    }
    var StID = 'sticon' + data[0].userID.trim()

    if (flag == true) {

        $('#' + StID).removeClass('badge-danger').addClass('badge-success')
        $('#v' + data[0].userID).removeAttr('disabled')
        $('#v' + data[0].userID).attr('onclick', 'openChatDiv(\'' + data[0].VendorName + '\', \'' + data[0].EmailId + '\', \'' + data[0].VendorID + '\', \'' + connectionId + '\',\'' + data[0].userID + '\',\'' + data[0].ContactPerson + '\')');

    }
    else {

        $('#' + StID).removeClass('badge-success').addClass('badge-danger')
        $('#v' + data[0].userID).attr('disabled', 'disabled')
        $('#v' + data[0].userID).attr('onclick', 'openChatDiv(\'' + data[0].VendorName + '\', \'' + data[0].EmailId + '\', \'' + data[0].VendorID + '\', \'' + '' + '\',\'' + data[0].userID + '\',\'' + data[0].ContactPerson + '\')');
    }
});

var display = document.querySelector('#lblTimeLeft');
var displayForS = "";
var Url = "";
connection.on("refreshRAQuotes", function (data) {

    fetchBidSummaryDetails(sessionStorage.getItem('BidID'), BidForID)
});
connection.on("refreshPEFAQuotes", function (data) {

    fetchBidSummaryDetails(sessionStorage.getItem('BidID'), BidForID)
});
connection.on("refreshPEFAQuotes", function (data) {

    fetchBidSummaryDetails(sessionStorage.getItem('BidID'), BidForID)
});
connection.on("refreshFAQuotes", function (data) {

    fetchBidSummaryDetails(sessionStorage.getItem('BidID'), BidForID)
});
connection.on("refreshCAQuotes", function (data) {

    fetchBidSummaryDetails(sessionStorage.getItem('BidID'), BidForID)
});
connection.on("refreshColumnStatus", function (data1) {

    if (data1.length > 1) {
        var TimeDetails = JSON.parse(data1[1]);
        display = document.querySelector('#lblTimeLeft');
        startTimer(TimeDetails[0].TimeLeft, display);
    }

    Url = "";
    if (sessionStorage.getItem('hdnbidtypeid') == 7 && _bidClosingType == "A") {
        Url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidAllinOne/?BidID=" + sessionStorage.getItem('BidID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID"))
    }
    else {
        Url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidStagger/?BidID=" + BidID + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID"))
    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: Url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            var TotalBidValue = '';
            var Percentreduction = '', Percentreductionceiling = '', Percentreductioninvoice = '';

            if (sessionStorage.getItem('hdnbidtypeid') == "7" && _bidClosingType == "A") {

                for (var i = 0; i < data.length; i++) {

                    TotalBidValue = parseFloat(removeThousandSeperator($('#quantity' + i).html())) * parseFloat(data[i].lQuote);
                    TotalBidValue = TotalBidValue % 1 != 0 ? TotalBidValue.toFixed(2) : TotalBidValue;

                    if (TotalBidValue != 0) {
                        if ($('#TP' + i).html() != 0) {
                            Percentreduction = parseFloat(100 - parseFloat(data[i].lQuote / $('#TP' + i).html()) * 100).toFixed(2) + ' %'
                        }
                        else {
                            Percentreduction = 'Not Specified';
                        }
                        if ($('#lastinvoice' + i).html() != 0) {
                            Percentreductioninvoice = parseFloat(100 - parseFloat(data[i].lQuote / $('#lastinvoice' + i).html()) * 100).toFixed(2) + ' %'
                        }
                        else {
                            Percentreductioninvoice = 'Not Specified';
                        }
                        Percentreductionceiling = parseFloat(100 - parseFloat(data[i].lQuote / (data[i].ceilingPrice)) * 100).toFixed(2) + ' %'
                    }
                    else {

                        Percentreduction = 'N/A';
                        Percentreductionceiling = 'N/A';
                        Percentreductioninvoice = 'N/A';
                    }

                    $('#initialQuote' + i).html(data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice))
                    $('#lowestquote' + i).html((data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)))

                    $('#bidvalue' + i).html(thousands_separators(TotalBidValue))
                    $('#level' + i).html(data[i].srNo)

                    $('#CP' + i).html(thousands_separators(data[i].ceilingPrice))

                    $("#vname" + i).html(data[i].vendorName)
                    if (data[i].decreamentOn == "P") {
                        $('#Mindec' + i).html(thousands_separators(data[i].minimumDecreament)) + ' %'
                    }
                    else {
                        $('#Mindec' + i).html(thousands_separators(data[i].minimumDecreament)) + $('#selectedcurr' + i).html()
                    }

                    $('#PerTP' + i).html(Percentreduction)
                    $('#PerLIP' + i).html(Percentreductioninvoice)
                    $('#PerCP' + i).html(Percentreductionceiling)

                    if (data[i].srNo == 'L1') {
                        $('#PerTP' + i, '#PerLIP' + i, '#PerCP' + i).attr('style', 'background-color:#d9edf7;color: #31708f;');

                    }
                    if (data[i].srNo == 'L1') {
                        $('#low_str' + i).css({
                            'background-color': '#dff0d8',
                            'font-weight': 'bold',
                            'color': '#3c763d'
                        })
                    }

                }

            }
            else {
                var rowcount = $("#tblbidsummarypercentagewise > tbody > tr").length;
                for (var j = 0; j < rowcount; j++) {
                    if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                        if ($('#level' + j).html() == 'L1') {
                            $('#low_str' + j).css({
                                'background-color': '#dff0d8!important',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })

                        }
                        else {
                            $('#low_str' + j).removeAttr('style');
                        }
                        $('#itemleftTime' + j).html('')
                    }
                    for (var i = 0; i < data.length; i++) {

                        if (data[i].itemStatus.toLowerCase() == 'open' || data[i].itemStatus.toLowerCase() == 'inactive') {
                            if ($('#seid' + j).html() == data[i].seId) {

                                TotalBidValue = parseFloat(removeThousandSeperator($('#quantity' + j).text())) * parseFloat(data[i].lQuote);
                                TotalBidValue = TotalBidValue % 1 != 0 ? TotalBidValue.toFixed(2) : TotalBidValue;
                                if (TotalBidValue != 0) {
                                    if ($('#TP' + j).html() != 0) {
                                        Percentreduction = parseFloat(100 - parseFloat(data[i].lQuote / $('#TP' + j).html()) * 100).toFixed(2) + ' %'
                                    }
                                    else {
                                        Percentreduction = 'Not Specified';
                                    }
                                    if ($('#lastinvoice' + j).html() != 0) {
                                        Percentreductioninvoice = parseFloat(100 - parseFloat(data[i].lQuote / $('#lastinvoice' + j).html()) * 100).toFixed(2) + ' %'
                                    }
                                    else {
                                        Percentreductioninvoice = 'Not Specified';
                                    }
                                    Percentreductionceiling = parseFloat(100 - parseFloat(data[i].lQuote / (data[i].ceilingPrice)) * 100).toFixed(2) + ' %'
                                }
                                else {

                                    Percentreduction = 'N/A';
                                    Percentreductionceiling = 'N/A';
                                    Percentreductioninvoice = 'N/A';
                                }

                                $('#initialQuote' + j).html((data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)))
                                $('#lowestquote' + j).html((data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)))

                                $('#bidvalue' + j).html(thousands_separators(TotalBidValue))
                                $('#level' + j).html(data[i].srNo)
                                $('#ClosingTime' + j).html(data[i].closingTime)
                                $('#CP' + j).html(thousands_separators(data[i].ceilingPrice))
                                $('#vname' + j).html(data[i].vendorName)
                                if (data[i].decreamentOn == "P") {
                                    $('#Mindec' + j).html(thousands_separators(data[i].minimumDecreament)) + ' %'
                                }
                                else {
                                    $('#Mindec' + j).html(thousands_separators(data[i].minimumDecreament)) + $('#selectedcurr' + j).html()
                                }

                                $('#PerTP' + j).html(Percentreduction)
                                $('#PerLIP' + j).html(Percentreductioninvoice)
                                $('#PerCP' + j).html(Percentreductionceiling)

                                if (data[i].srNo == 'L1') {
                                    $('#PerTP' + j, '#PerLIP' + j, '#PerCP' + j).attr('style', 'background-color:#d9edf7;color: #31708f;');
                                }
                                if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                                    if (data[i].srNo == 'L1' && data[i].itemStatus != 'Open') {
                                        $('#low_str' + j).css({
                                            'background-color': '#dff0d8!important',
                                            'font-weight': 'bold',
                                            'color': '#3c763d'
                                        })
                                    }

                                    if ($('#Sname' + j).text() != "" && data[i].itemStatus == 'Open') {
                                        $('#low_str' + j).css({
                                            'background-color': '#32C5D2!important',
                                            'color': '#000000!important'
                                        })
                                        displayForS = document.querySelector('#itemleftTime' + j);
                                        startTimerForStaggerItem((parseInt(data[i].itemLeftTime)), displayForS);
                                    }
                                    $('#itemleftTime' + j).css({
                                        'color': 'Red',
                                        'font-weight': '500'
                                    });
                                }
                                j = j + 1;
                            }
                        }
                    }
                }
            }

            if (data[0].hideVendor == "Y") {
                $('.showvendor').addClass('hide');
            }
            else {
                $('.showvendor').removeClass('hide');
            }
        }
    });
});
connection.on("refreshColumnStatusFA", function (data1) {

    if (data1.length > 1) {
        var TimeDetails = JSON.parse(data1[1]);
        display = document.querySelector('#lblTimeLeft');
        startTimer(TimeDetails[0].TimeLeft, display);
    }
    var Url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidFAEnglish/?BidID=" + sessionStorage.getItem('BidID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID"))

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: Url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {


            var TotalBidValue = '';
            var Percentreduction = '', Percentreductionceiling = '', Percentreductioninvoice = '';

            for (var i = 0; i < data.length; i++) {

                TotalBidValue = parseFloat(removeThousandSeperator($('#quantity' + i).html())) * parseFloat(data[i].lQuote);
                TotalBidValue = TotalBidValue % 1 != 0 ? TotalBidValue.toFixed(2) : TotalBidValue;


                if (TotalBidValue != 0) {
                    if ($('#TP' + i).html() != 0) {
                        Percentreduction = parseFloat(parseFloat(data[i].lQuote / $('#TP' + i).html()) * 100 - 100).toFixed(2) + ' %'
                    }
                    else {
                        Percentreduction = 'Not Specified';
                    }

                    if ($('#lastinvoice' + i).html() != 0) {
                        Percentreductioninvoice = parseFloat(parseFloat(data[i].lQuote / $('#lastinvoice' + i).html()) * 100 - 100).toFixed(2) + ' %'
                    }
                    else {
                        Percentreductioninvoice = 'Not Specified';
                    }
                    Percentreductionceiling = parseFloat(parseFloat(data[i].lQuote / (data[i].ceilingPrice)) * 100 - 100).toFixed(2) + ' %'
                }
                else {

                    Percentreduction = 'N/A';
                    Percentreductionceiling = 'N/A';
                    Percentreductioninvoice = 'N/A';
                }

                $('#initialQuote' + i).html(data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice))
                $('#lowestquote' + i).html((data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)))

                $('#bidvalue' + i).html(thousands_separators(TotalBidValue))
                $('#level' + i).html(data[i].srNo)
                // console.log(data[i].vendorName)
                $("#vname" + i).html(data[i].vendorName)
                $('#CP' + i).html(thousands_separators(data[i].ceilingPrice))

                if (data[i].increamentOn == "P") {

                    $('#Mindec' + i).html(thousands_separators(data[i].minimumIncreament)) + ' %'
                }
                else {
                    $('#Mindec' + i).html(thousands_separators(data[i].minimumIncreament)) //+ $('#selectedcurr' + i).html()
                }


                $('#PerTP' + i).html(Percentreduction)
                $('#PerLIP' + i).html(Percentreductioninvoice)
                $('#PerCP' + i).html(Percentreductionceiling)

                if (data[i].srNo == 'H1') {
                    $('#PerTP' + i, '#PerLIP' + i, '#PerCP' + i).attr('style', 'background-color:#d9edf7!important;color: #31708f!important;');
                }
                if (data[i].srNo == 'H1') {
                    $('#low' + i).css({
                        'background-color': '#dff0d8',
                        'font-weight': 'bold',
                        'color': '#3c763d'
                    })
                }

            }
            if (data[0].hideVendor == "Y") {
                $('.showvendor').addClass('hide');
            }
            else {
                $('.showvendor').removeClass('hide');
            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
        }
    });
});
connection.on("refreshColumnStatusFF", function (data1) {

    if (data1[0].timeLeft > 0) {
        //var TimeDetails = JSON.parse(data1[1]);
        display = document.querySelector('#lblTimeLeft');
        startTimer(data1[0].timeLeft, display);
    }
    var Url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidSummary/?BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&BidForID=" + BidForID + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID"))
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: Url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            // jQuery("#tblBidSummary > thead").empty();
            // jQuery("#tblBidSummary > tbody").empty();
            jQuery("#tblbidsummarypercentagewise > thead").empty();
            jQuery("#tblbidsummarypercentagewise > tbody").empty();
            $('#divTarget').hide();
            var minimuminc;

            var sname = '';
            var strHeadsummary = "<tr><th>S No</th><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Total Quantity</th><th>Min. Quantity</th><th>Max. Quantity</th><th>Unallocated Quantity</th><th>UOM</th><th>Minimum Increment</th><th>Level</th><th class=showvendor>Vendor</th><th>Quantity Bided</th><th>Allocated Quantity</th><th>Initial Quote</th><th>Highest Quote</th></tr>";
            jQuery('#tblbidsummarypercentagewise > thead').append(strHeadsummary);
            var c = 1;

            for (var i = 0; i < data.length; i++) {

                if (data[i].increamentOn == "P") {
                    minimuminc = thousands_separators(data[i].minimumIncreament) + ' %'
                }
                else {
                    minimuminc = thousands_separators(data[i].minimumIncreament)
                }
                if (sname != data[i].shortName) {
                    sname = data[i].shortName
                    var strsumm = '<tr id=low' + i + ' class=header><td  onclick="fnClickHeader(\'low' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].frid + ')" style="text-decoration:none;" >' + data[i].shortName + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=CP' + i + ' >' + thousands_separators(data[i].bidStartPrice) + '</td><td class="text-right" id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right" id=minquantity' + i + ' >' + thousands_separators(data[i].minOfferedQuantity) + '</td><td class="text-right" id=maxquantity' + i + ' >' + thousands_separators(data[i].maxOfferedQuantity) + '</td><td class="text-right">' + thousands_separators(data[i].unallocatedQuantity) + '</td><td>' + data[i].uom + '</td><td class="text-right" id=Mindec' + i + ' >' + (minimuminc) + '</td>';
                    c = c + 1;
                }
                else {
                    var strsumm = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                }
                strsumm += "<td id=level" + i + " >" + data[i].srNo + "</td><td id=vname" + i + " class=showvendor>" + data[i].vendorName + "</td><td class=text-right>" + thousands_separators(data[i].biddedQuantity) + "</td><td class=text-right >" + thousands_separators(data[i].quantityAllocated) + "</td><td class=text-right id=initialQuote" + i + " >" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                strsumm += "<td class=text-right id=lowestquote" + i + " >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td>";
                strsumm += "<td class=hide id=TP" + i + ">" + removeThousandSeperator(data[i].targetPrice) + "</td><td class=hide id=lastinvoice" + i + ">" + removeThousandSeperator(data[i].lastInvoicePrice) + "</td><td class=hide id=quantity" + i + ">" + data[i].quantity + "</td><td class=hide id=frid" + data[i].frid + ">" + data[i].frid + "</td></tr>";

                jQuery('#tblbidsummarypercentagewise > tbody').append(strsumm);
                if (data[i].srNo == 'H1') {
                    $('#low' + i).css({
                        'background-color': '#dff0d8',
                        'font-weight': 'bold',
                        'color': '#3c763d'
                    })
                    $('#low_str' + i).css({
                        'background-color': '#dff0d8',
                        'font-weight': 'bold',
                        'color': '#3c763d'
                    })
                    $('#lowa' + i).css({
                        'background-color': '#dff0d8',
                        'font-weight': 'bold',
                        'color': '#3c763d'
                    })

                }

            }
            if (data[0].hideVendor == "Y") {
                $('.showvendor').addClass('hide');
            }
            else {
                $('.showvendor').removeClass('hide');
            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
        }
    });
});
connection.on("refreshColumnStatusCoal", function (data1) {
    if (data1.length > 1) {
        var TimeDetails = JSON.parse(data1[1]);
        display = document.querySelector('#lblTimeLeft');
        startTimer(TimeDetails[0].TimeLeft, display);
    }
    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidSummary/?BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&BidForID=" + BidForID + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: url,
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data, status, jqXHR) {

                if (data.length > 0) {
                    //jQuery("#tblBidSummary > thead").empty();
                    // jQuery("#tblBidSummary > tbody").empty();
                    jQuery("#tblbidsummarypercentagewise > thead").empty();
                    jQuery("#tblbidsummarypercentagewise > tbody").empty();

                    if ($('#lnktotvalue').html() == "Detailed Report") {
                        jQuery("#tblBidSumm").hide()
                        jQuery("#tblbidsummarypercentagewise").show()
                        $('#divfordetailreport').show()
                        $('#divforBidsummary').hide()
                    }
                    $('#lnktotvalue').hide();

                    var TotalBidValue = '';
                    $('#divTarget').hide();
                    var sname = '';
                    var minimumdec = '';
                    strHeadsummary = '';

                    var strHeadsummary = ""; //"<tr><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid start price</th><th>Quantity</th><th>UOM</th><th style=display:none; id=theadbidclosingType></th><th>Level</th><th>Vendor</th><th>Loading Factor - &lambda; (in %)</th><th>Initial Quote</th><th>Lowest Quote</th><th>Bid Value</th><th>Percentage Reduction (Target Price)</th><th>Percentage Reduction (Last Invoice Price)</th><th>Percentage Reduction (Bid start price)</th></tr>";
                    if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {

                        strHeadsummary = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Minimum Dec.</th><th class=showvendor>Vendor</th><th>Landed Price</th><th>Cess</th><th>GST %</th><th>NCV</th><th>Item Closing Time</th><th>Level</th><th>Initial Quote</th><th>Lowest Quote</th><th class=hide>Bid Value</th><th>Quantity Offered</th></tr>";
                    }
                    else {
                        strHeadsummary = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Minimum Dec.</th><th class=showvendor>Vendor</th><th>Landed Price</th><th>Cess</th><th>GST %</th><th>NCV</th><th>Level</th><th>Initial Quote</th><th>Lowest Quote</th><th class=hide>Bid Value</th><th>Quantity Offered</th></tr>";
                    }
                    jQuery('#tblbidsummarypercentagewise > thead').append(strHeadsummary);
                    var c = 1;

                    for (var i = 0; i < data.length; i++) {


                        TotalBidValue = parseFloat(data[i].quantity) * parseFloat(data[i].lQuote);
                        TotalBidValue = TotalBidValue % 1 != 0 ? TotalBidValue.toFixed(2) : TotalBidValue;
                        minimumdec = thousands_separators(data[i].minimumDecreament)// + ' ' + data[i].selectedCurrency
                        var desitinationport = data[i].destinationPort.replace(/<br\s*\/?>/gi, ' ');

                        if (sname != desitinationport) {
                            sname = desitinationport

                            if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {

                                if (data[i].itemStatus == "Open") {

                                    var strsumm = '<tr id=low_str' + i + ' style="background-color: #32C5D2!important; color: #000000!important;"  class=header><td id=i_expandcollapse' + i + '  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')" >' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + ' ></a></td><td id=Sname' + i + ' ><a href="javascript:;" onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;">' + desitinationport + '</a></td><td class="text-right " id=TP' + i + '  >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td id=ClosingTime' + i + '>' + data[i].closingTime + '</td>';
                                }
                                else {
                                    var strsumm = '<tr id=low_str' + i + ' class="header" ><td id=i_expandcollapse' + i + '  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + '  ></a></td><td id=Sname' + i + ' ><a  href="javascript:;" onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right"  id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=quantity' + i + '  >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=CP' + i + ' >' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td id=ClosingTime' + i + '>' + data[i].closingTime + '</td>';
                                }

                            }
                            else {
                                var strsumm = '<tr id=low_str' + i + ' class="header" ><td id=i_expandcollapse' + i + '   onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td id=Sname' + i + '><a href="javascript:;"  onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;">' + desitinationport + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class=text-right id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class=text-right id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td>';
                            }
                            c = c + 1;

                        }
                        else {
                            if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                                var strsumm = "<tr id=low_str" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                            else {
                                var strsumm = "<tr id=low_str" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                        }



                        strsumm += "<td id=vname" + i + " class=showvendor>" + data[i].vendorName + "</td><td class=text-right>" + (data[i].landedPrice == '0' ? '' : thousands_separators(data[i].landedPrice)) + "</td><td class=text-right>" + (data[i].cess == '0' ? '' : thousands_separators(data[i].cess)) + "</td><td class=text-right>" + data[i].gst + "</td><td class=text-right>" + (data[i].ncv == '0' ? '' : thousands_separators(data[i].ncv)) + "</td><td id=level" + i + " id=level" + i + " >" + data[i].srNo + "</td><td class='text-right' id=initialQuote" + i + ">" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                        strsumm += "<td class='text-right' id=lowestquote" + i + " >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td><td id=bidvalue" + i + " class=hide>" + thousands_separators(TotalBidValue) + "</td><td>" + (data[i].offeredQuan == '0' ? '' : thousands_separators(data[i].offeredQuan)) + "</td>";
                        strsumm += "<td class=hide id=selectedcurr" + i + ">" + data[i].selectedCurrency + "</td><td class=hide id=TP" + i + ">" + removeThousandSeperator(data[i].targetPrice) + "</td><td class=hide id=lastinvoice" + i + ">" + removeThousandSeperator(data[i].lastInvoicePrice) + "</td><td class=hide id=quantity" + i + ">" + data[i].quantity + "</td><td class=hide id=coalid" + i + ">" + data[i].coalID + "</td></tr>";


                        jQuery('#tblbidsummarypercentagewise').append(strsumm);


                        if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                            if (data[i].srNo == 'L1' && data[i].itemStatus != 'Open') {
                                $('#low_str' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#low' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                            }
                        }
                        else {
                            if (data[i].srNo == 'L1') {
                                $('#low_str' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })
                                $('#low' + i).css({
                                    'background-color': '#dff0d8',
                                    'font-weight': 'bold',
                                    'color': '#3c763d'
                                })

                            }
                        }

                    }
                    if (data[0].hideVendor == "Y") {
                        $('.showvendor').addClass('hide');
                    }
                    else {
                        $('.showvendor').removeClass('hide');
                    }
                }
                //** Refresh Time if extension 
            },
            error: function (xhr, status, error) {
                var err = xhr.responseText// eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('error', '');
                }
                jQuery.unblockUI();
            }
        });

});
connection.on("refreshTimer", function (data) {

    url = sessionStorage.getItem("APIPath") + "VendorParticipation/FetchBidTimeLeft/?BidID=" + sessionStorage.getItem('BidID')

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {


            if (data.length > 0) {
                display = document.querySelector('#lblTimeLeft');
                startTimer(data[0].timeLeft, display);

                if (_bidClosingType == "S" && BidTypeID == "7") {
                    fnrefreshStaggerTimerdataonItemClose();

                }
                jQuery("#lblbidduration").text(data[0].actualBidDuartion + ' mins');
                jQuery('#txtBidDurationPrev').val(data[0].actualBidDuartion)
                $('#spinnerBidclosingTab').spinner({ value: data[0].actualBidDuartion, step: 1, min: 1, max: 999 });


            }

        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
        }
    });
})
connection.on("refreshBidDetailsManage", function (data) {

    if (BidTypeID == 7) {
        if (data.length > 0) {
            jQuery('#tblBidSummary >tbody >tr').each(function (i) {
                var JsonMsz = JSON.parse(data);

                if (JsonMsz.SeId == $('#seid' + i).text()) {
                    if (JsonMsz.valType == "BSPRA") {
                        $("#CP" + i).html(thousands_separators(JsonMsz.QueryString));
                    }
                    if (JsonMsz.valType == "BMD") {
                        $("#Mindec" + i).html(thousands_separators(JsonMsz.QueryString));
                    }

                }
                if (JsonMsz.valType == "BHV" || JsonMsz.valType == "BAT") {
                    fetchBidSummary(sessionStorage.getItem("BidID"));
                }
                if (JsonMsz.valType == "BHV") {
                    if (JsonMsz.QueryString == 'N') {
                        $('.showvendor').removeClass('hide');
                    }
                    else {
                        $('.showvendor').addClass('hide');
                    }
                }

            });

        }
    }
    else if (BidTypeID == 6) {
        if (data.length > 0) {
            jQuery('#tblBidSummary >tbody >tr').each(function (i) {
                var JsonMsz = JSON.parse(data);

                if (JsonMsz.SeId == $('#pid' + i).text()) {
                    console.log(JsonMsz.SeId)
                    console.log($('#pid' + i).text())
                    if (JsonMsz.valType == "BSPFA") {
                        $("#CP" + i).html(thousands_separators(JsonMsz.QueryString));
                    }
                    if (JsonMsz.valType == "BMIPE") {
                        $("#Mindec" + i).html(thousands_separators(JsonMsz.QueryString));
                    }

                }
                if (JsonMsz.valType == "BHV" || JsonMsz.valType == "BAT") {
                    fetchBidSummary(sessionStorage.getItem("BidID"));
                }
                if (JsonMsz.valType == "BHV") {
                    if (JsonMsz.QueryString == 'N') {
                        $('.showvendor').removeClass('hide');
                    }
                    else {
                        $('.showvendor').addClass('hide');
                    }
                }

            });

        }
    }
    else if (BidTypeID == '9') {
        fetchBidSummary(sessionStorage.getItem("BidID"));
    }

});


/////****** Chat *****************/////
connection.on("ReceiveMessage", function (objChatmsz) {

    let chat = JSON.parse(objChatmsz)

    toastr.clear();
    $(".pulsate-regular").css('animation', 'pulse 2s infinite')
    toastr.success('You have a new message.', 'New Message')
    $("#chatList").append('<div class="post out">'
        + '<div class="message">'
        + '<span class="arrow"></span>'
        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + new Date().toLocaleTimeString() + '</span>'
        + '<span class="body" style="color: #c3c3c3;">' + chat.ChatMsg + '</span>'
        + '</div>'
        + '</div>');
});
connection.onclose(error => {
    bootbox.alert("You are not connected to the Bid as Your Internet connection is unstable, please refresh the page!!", function () {
        return true;
    });
});
//}

function sendChatMsgs() {

    var data = {
        "ChatMsg": $('#txtChatMsg').val(),
        "fromID": sessionStorage.getItem("UserID"),
        "BidId": (sessionStorage.getItem("BidID") == '0' || sessionStorage.getItem("BidID") == null) ? parseInt(getUrlVarsURL(decryptedstring)["BidID"]) : parseInt(sessionStorage.getItem("BidID")),
        "msgType": 'S',
        "toID": (sessionStorage.getItem("UserType") == 'E') ? $("#hddnVendorId").val() : '',
        "fromconnectionID": $("#hddnadminConnection").val()
    }
    $("#chatList").append('<div class="post in">'
        + '<div class="message">'
        + '<span class="arrow"></span>'
        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + new Date().toLocaleTimeString() + '</span>'
        + '<span class="body" style="color: #c3c3c3;">' + $("#txtChatMsg").val() + '</span>'
        + '</div>'
        + '</div>');
    connection.invoke("SendMessage", JSON.stringify(data), $('#hddnVendorConnection').val()).catch(function (err) {
        return console.error(err.toString());
    });

    $("#txtChatMsg").val('');
}
function sendBroadCastChatMsgs() {

    var data = {
        "ChatMsg": $("#txtBroadcastMsg").val(),
        "fromID": sessionStorage.getItem("UserID"),
        "BidId": parseInt(getUrlVarsURL(decryptedstring)["BidID"]),
        "msgType": 'B',
        "toID": '',
        "fromconnectionID": $("#hddnadminConnection").val()
    }

    $("#listBroadCastMessages").append('<div class="post out">'
        + '<div class="message">'
        + '<span class="arrow"></span>'
        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + new Date().toLocaleTimeString() + '</span>'
        + '<span class="body" style="color: #c3c3c3;">' + $("#txtBroadcastMsg").val() + '</span>'
        + '</div>'
        + '</div>');
    connection.invoke("SendMessageToGroup", JSON.stringify(data)).catch(function (err) {
        return console.error(err.toString());

    });
    $("#txtBroadcastMsg").val('')

}

///////////////////////----************************************signal R End****************************************************
$('#lnktotvalue').click(function () {
    if ($('#lnktotvalue').html() == "Detailed Report") {
        $('#divfordetailreport').hide()
        $('#divforBidsummary').show()
        $('#tblBidSumm').show();
        $('#lnktotvalue').html('Summary Report')


    } else {
        $('#divfordetailreport').show()
        $('#divforBidsummary').hide()
        $('#tblbidsummarypercentagewise').show();
        $('#lnktotvalue').html('Detailed Report')


    }
});

jQuery('#ddlVendorsAdmin').change(function () {
    if (jQuery('#ddlVendorsAdmin option:selected').val() != "0") {
        jQuery('a#ModifyLink').show();
        var vendorid = jQuery('#ddlVendorsAdmin option:selected').val()
    }
    else
        jQuery('a#ModifyLink').hide();

});
jQuery("#btnbackAward").click(function () {
    parent.history.back();
});
jQuery("#btnbackApp").click(function () {
    parent.history.back();
});
jQuery("#btnbackAdmin").click(function () {
    parent.history.back();
});


function AwardBid() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendors = '';
    var rowCount = jQuery('#tblremarksvendorsawared tr').length;


    if (rowCount > 1) {
        $('#drpVendors').rules('add', {
            required: false,
        });
        $('#txtRemarksAward').rules('add', {
            required: false,
        });
    }
    else {
        if ($('#txtRemarksAward').val() == "" || $('#txtRemarksAward').val() == null) {
            $('#formAwardedsubmit').validate()
            $('#drpVendors').rules('add', {
                required: false,
            });
            $('#txtRemarksAward').rules('add', {
                required: true
            });
        }
    }
    if (rowCount > 1) {
        $("#tblremarksvendorsawared tr:gt(0)").each(function () {
            var this_row = $(this);
            vendors = vendors + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim(this_row.find('td:eq(2)').html()) + '#';

        })
    }
    if ($('#formAwardedsubmit').valid() == true) {
        if ($('#txtRemarksAward').val() != '' && $('#drpVendors').val() != '') {
            $('#diverrordiv2').show()
            $('#errordiv2').text('Your data is not inserted. Please do press "+" button after enter Remarks.')
            $('#diverrordiv2').fadeOut(5000)
            jQuery.unblockUI();

        }
        else {
            var AwardBid = {
                "BidID": parseInt(BidID),
                "Vendors": $('#drpVendors').val(),
                "LoginUserID": sessionStorage.getItem("UserID"),
                "Remarks": jQuery("#txtRemarksAward").val(),
                "AwardQuery": vendors,
                "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
            };
            jQuery.ajax({
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "Activities/AwardBid",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                type: "POST",
                cache: false,
                data: JSON.stringify(AwardBid),
                crossDomain: true,
                dataType: "json",
                success: function () {
                    bootbox.alert("Transaction Successful..", function () {
                        window.location = "index.html";
                        return false;
                    });

                },
                error: function (xhr, status, error) {

                    var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
    }
    else {
        $('#formAwardedsubmit').validate()
        jQuery.unblockUI();
        return false;
    }
}

function FetchRecomendedVendor(bidid) {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/FetchRecomendedVendor/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=" + bidid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var isMappedPPCApp = 'N';
            var isLastApprover = 'N';
            $('#tblremarksforward').empty()
            $('#tblremarksapprover').empty()
            $('#tblremarksawared').empty()
            $('#tblapprovalprocess').empty()
            if (data.length > 0) {
                $('#divforapprovalprocess').show()

                $('#tblremarksforward').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th class=hide id=thforward>Recommended Vendor</th><th>Completion DT</th></tr>')
                $('#tblremarksapprover').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th class=hide id=thapprover>Recommended Vendor</th><th>Completion DT</th></tr>')
                $('#tblremarksawared').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th class=hide id=thaward>Recommended Vendor</th><th>Completion DT</th></tr>')
                $('#tblapprovalprocess').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th style="display: none;" id="thapprovalprocess">Recommended Vendor</th><th>Completion DT</th></tr>')


                jQuery("#lblvendor").text(data[0].vendorName);
                jQuery("#hdnvendor").val(data[0].vendorID);
                jQuery("#ddlVendors,#ddlVendorsAdmin").val(data[0].vendorID).attr("selected", "selected");
                if (AppStatus == 'Reverted') {
                    jQuery("#lblrevertedComment").text(data[0].remarks);
                    jQuery("#RevertComment").show();
                    $('#frmdivremarksforward').removeClass('col-md-12');
                    $('#frmdivremarksforward').addClass('col-md-6');
                    $('#frmdivforward').show();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].vendorName != "") {
                            $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                            $('#thforward').removeClass('hide')
                        }
                        else {
                            $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                            $('#thforward').addClass('hide')
                        }


                    }
                }
                $('#frmdivremarksapprover').removeClass('col-md-12');
                $('#frmdivremarksapprover').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {
                    isLastApprover = data[0].isLastApprover;
                    if (data[i].eRFQApproverType == "P") {
                        isMappedPPCApp = 'Y'
                    }
                    if (data[i].vendorName != "") {
                        $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                        $('#thapprover').removeClass('hide')
                    }
                    if (data[i].eRFQApproverType == "P") {
                        isMappedPPCApp = 'Y'
                    }
                    else {
                        $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                        $('#thapprover').addClass('hide')
                    }
                }
                $('#frmdivapprove').show()
                $('#frmdivremarksawarded').removeClass('col-md-12');
                $('#frmdivremarksawarded').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {
                    if (data[i].vendorName != "") {
                        $('#tblremarksawared').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                        $('#thaward').removeClass('hide')
                    }
                    else {
                        $('#tblremarksawared').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                        $('#thaward').addClass('hide')
                    }
                }
                $('#frmdivawarded').show()
                jQuery("#lblLastcomments,#LblLastcomments,#lbllastcommentSeaAward").text(data[0].remarks);

                for (var i = 0; i < data.length; i++) {
                    if (data[i].vendorName != "") {
                        $('#tblapprovalprocess').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                        $('#thapprovalprocess').show();
                    }
                    else {
                        $('#tblapprovalprocess').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                        $('#thapprovalprocess').hide()
                    }
                }
            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }

            if (sessionStorage.getItem("CustomerID") == 29 || sessionStorage.getItem("CustomerID") == 32) {
                $('#btnPPCF').show()
                $('#btnPPCA').show()
                if (isLastApprover == 'Y') {
                    $('#btn_mapaaprover').show()
                }
                else {
                    $('#btn_mapaaprover').hide()
                }
            }
            else {
                $('#btnPPCF').hide()
                $('#btnPPCA').hide()
                $('#btn_mapaaprover').hide()
            }
            if (isMappedPPCApp == 'Y') {
                $('#btn_mapaaprover').attr('disabled', 'disabled')
                $('#btnPPCA').attr('disabled', 'disabled')
            }
            else {
                $('#btn_mapaaprover').removeAttr('disabled')
                $('#btnPPCA').removeAttr('disabled')
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
function ForwardBid(bidid, bidtypeid, bidforid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorid = 0;
    if (jQuery("#ddlVendorsAdmin option:selected").val() != undefined) {
        vendorid = jQuery("#ddlVendorsAdmin option:selected").val()
    }

    var ForwardBid = {
        "BidID": parseInt(bidid),
        "BidTypeID": parseInt(bidtypeid),
        "VendorID": vendorid,
        "BidDescription": jQuery("#lblbidSubject").text(),
        "LoginUserID": sessionStorage.getItem("UserID"),
        "Remarks": jQuery("#txtbidspecification").val(),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    };
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Activities/forwardBidToApprover",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(ForwardBid),
        crossDomain: true,
        dataType: "json",
        success: function () {
            bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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
function ApprovalApp() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorid = 0;
    if (jQuery("#ddlVendors option:selected").val() != undefined) {
        vendorid = jQuery("#ddlVendors option:selected").val();
    }
    var approvalbyapp = {
        "BidID": parseInt(BidID),
        "FromUserId": sessionStorage.getItem("UserID"),
        "ActivityDescription": jQuery("#lblbidSubject").text(),
        "Remarks": jQuery("#txtRemarksApp").val(),
        "BidTypeID": BidTypeID,
        "Action": jQuery("#ddlActionType option:selected").val(),
        "ForwardedBy": "Approver",
        "VendorId": parseInt(vendorid),
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    };

    //alert(JSON.stringify(approvalbyapp))
    console.log(JSON.stringify(approvalbyapp))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/ApprovalApp",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(approvalbyapp),
        crossDomain: true,
        dataType: "json",
        success: function () {
            bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
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
function ApprovalAdmin() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorid = 0;
    if (jQuery("#ddlVendorsAdmin option:selected").val() != null && jQuery("#ddlVendorsAdmin option:selected").val() != "" && jQuery("#ddlVendorsAdmin option:selected").val() != undefined) {
        vendorid = jQuery("#ddlVendorsAdmin option:selected").val();
    }
    var approvalbyapp = {
        "BidID": parseInt(BidID),
        "FromUserId": sessionStorage.getItem("UserID"),
        "ActivityDescription": jQuery("#lblbidSubject").text(),
        "Remarks": jQuery("#txtbidspecification").val(),
        "BidTypeID": BidTypeID,
        "Action": "",
        "ForwardedBy": "Administrator",
        "VendorId": parseInt(vendorid),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    };
    // console.log(JSON.stringify(approvalbyapp))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/ApprovalApp",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(approvalbyapp),
        crossDomain: true,
        dataType: "json",
        success: function () {
            bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

function fetchApproverStatus() {

    //jQuery.blockUI({ message: '<h5><img src="assets_1/layouts/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = sessionStorage.getItem("APIPath") + "Activities/GetBidApproverStatus/?BidID=" + BidID

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
                    jQuery('#divPendingDate' + i).text(data[i].pendingSince);

                    if (data[i].statusCode == 10) {

                        counterColor = counterColor + 1;
                        status = 'Pending'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');

                    }
                    if (data[i].statusCode == 20) {
                        //counterColor = counterColor + 1;
                        status = 'Approved'
                        jQuery('#divstatus' + i).text(status);
                        jQuery('#divstatuscolor' + i).addClass('last');
                    }
                    if (data[i].statusCode == 30) {

                        //counterColor = counterColor + 1;
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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

var CalcelButtonAlert = "Y";
jQuery("#btnCancelbidAdmin").click(function () {
    $('#modalcancelremarks').modal('show');
});
jQuery("#butCancelbid").click(function () {
    $('#modalcancelremarks').modal('show');
    CalcelButtonAlert = "N";

});
jQuery("#cancl_btn").click(function () {
    $('#modalcancelremarks').modal('show');
});
var FormValidation = function () {
    var validateformCancelBid = function () {
        var form1 = $('#frmRemarksCancel');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                txtRemarks: {
                    required: true,
                    maxlength: 2000
                }
            },
            messages: {
                txtRemarks: {
                    required: "Please enter Cancel Reason."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                // success1.hide();
                // error1.show();
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
                if (CalcelButtonAlert == "Y") {
                    cancelBtnclick();
                }
                else {
                    CancelBid(BidID);
                }

            }
        });

    }

    var handleWysihtml5 = function () {
        if (!jQuery().wysihtml5) {
            return;
        }
        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5({
                "stylesheets": ["assets/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
            });
        }
    }
    return {
        init: function () {
            handleWysihtml5();
            validateformCancelBid();

        }
    };
}();
function cancelBtnclick() {

    bootbox.dialog({
        message: "Are you sure want to cancel this bid?",
        // title: "Custom title",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {

                    bootbox.dialog({
                        message: "Do you want to send cancellation email to participants for this bid?",
                        // title: "Custom title",
                        buttons: {
                            confirm: {
                                label: "Yes",
                                className: "btn-success",
                                callback: function () {
                                    CancelBid(BidID, 'SendMail')
                                }
                            },
                            cancel: {
                                label: "No",
                                className: "btn-default",
                                callback: function () {
                                    CancelBid(BidID, 'NoMail')
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

function CancelBid(bidid, mailparam) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var newBidDate = new Date($('#lblbiddate').html().replace('-', ''));
    var Cancelbid = {
        "BidID": parseInt(bidid),
        "Remarks": jQuery("#txtRemarks").val() == null ? '' : jQuery("#txtRemarks").val(),
        "UserID": sessionStorage.getItem('UserID'),
        "BidSubj": $('#lblbidSubject').text(),
        "BidDescription": $('#lblbiddetails').html().replace(/'/g, " "),
        //"BidDate": $('#lblbiddate').html(),
        "BidDate": newBidDate,
        //"BidTime": $('#lblbidtime').html(),
        "BidDuration": $('#lblbidduration').html(),
        "BidTypeID": parseInt(BidTypeID),
        "SendMail": mailparam,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))

    };

    //  alert(JSON.stringify(Cancelbid))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Activities/CancelBid",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(Cancelbid),
        crossDomain: true,
        dataType: "json",
        success: function () {
            bootbox.alert("Bid Cancelled successfully.", function () {
                window.location = "index.html";
                return false;
            });

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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
function fileUploader(BidID) {

    var fileInput = $('#fileupload');
    var fileData = fileInput.prop("files")[0];
    var formData = new window.FormData();
    formData.append("file", fileData);
    formData.append("BidID", BidID);
    $.ajax({
        url: '/FileUploader.ashx',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
        }
    });
}

function backButtonClick() {
    window.location = "index.html";
}
$('#graphModal').on('shown.bs.modal', function () {
    drawSeriesChart()
});

function minutes_with_leading_zeros(dtmin) {
    return (dtmin < 10 ? '0' : '') + dtmin;
}

function fetchGraphData(itemId) {

    var _bidTypeID;
    if (getUrlVarsURL(decryptedstring)["BidTypeID"]) {
        _bidTypeID = getUrlVarsURL(decryptedstring)["BidTypeID"];
    } else {
        _bidTypeID = sessionStorage.getItem('hdnbidtypeid');
    }
    console.log(typeof getUrlVarsURL(decryptedstring)["BidTypeID"]);
    graphData = [];

    var _date;
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryTrendGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&chartFor=sample",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            $("#tblForTrendGraphs").empty();
            if (data) {
                $("#tblForTrendGraphs").append("<tr><th>Submission Time</th><th>Quoted Price</th><th>Vendor</th></tr>");
                for (var i = 0; i < data.length; i++) {
                    _date = new Date(data[i].submissionTime);
                    _date = fnConverToLocalTimeWithSeconds(_date);

                    //$("#tblForTrendGraphs").append("<tr><td>" + _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear() + " " + minutes_with_leading_zeros(new Date(data[i].submissionTime).getHours()) + ":" + minutes_with_leading_zeros(new Date(data[i].submissionTime).getMinutes()) + ":" + minutes_with_leading_zeros(new Date(data[i].submissionTime).getSeconds()) + "</td><td>" + data[i].quotedPrice + "</td><td>" + data[i].vendorName + "</td></tr>");
                    $("#tblForTrendGraphs").append("<tr><td>" + _date + "</td><td>" + data[i].quotedPrice + "</td><td>" + data[i].vendorName + "</td></tr>");
                }
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
    }).done(function () {

        $("#graphModalLine").modal('show');

        linegraphsforItems(itemId)
    });
}
var Vendorseries = "";
var graphtime = [];
var dataQuotes = [];
var Seriesoption = [];
var FinalQuotes = [];
var Quotes = "";
var minprice;
var maxprice;
function linegraphsforItems(itemId) {

    var _bidTypeID;
    var _date;
    if (getUrlVarsURL(decryptedstring)["BidTypeID"]) {
        _bidTypeID = getUrlVarsURL(decryptedstring)["BidTypeID"];
    } else {
        _bidTypeID = sessionStorage.getItem('hdnbidtypeid');
    }

    graphtime = [];
    Vendorseries = "";
    dataQuotes = [];
    Seriesoption = [];
    FinalQuotes = [];
    var colorArray = ['#007ED2', '#f15c80', '#90ED7D', '#FF7F50', '#f15c80', '#FF5733', '#96FF33', '#33FFF0', '#F9FF33', '#581845', '#0B0C01', '#0C0109', '#DAF7A6', '#FFC300', '#08010C'];
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=X-X",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            minprice = parseInt(data[0].minMaxprice[0].minPrice - 5);
            maxprice = parseInt(data[0].minMaxprice[0].maxPrice + 5);
            var _startDateTime = new Date(data[0].bidStartEndTime[0].bidStartTime);
            var _endDateTime = new Date(data[0].bidStartEndTime[0].bidEndTime);

            $('#lblbidstarttime').text(fnConverToLocalTime(_startDateTime));
            $('#lblbidendtime').text(fnConverToLocalTime(_endDateTime));


            if (data[0].submissionTime.length > 0) {

                for (var x = 0; x < data[0].submissionTime.length; x++) {


                    //graphtime.push(data[0].submissionTime[x].subTime);
                    graphtime.push(fnConverToLocalTimeWithSeconds(data[0].submissionTime[x].subTime));

                }

            }
            Vendorseries = "";
            var values = 0;
            if (data[0].vendorNames.length > 0) {


                for (var i = 0; i < data[0].vendorNames.length; i++) {

                    Quotes = "";
                    values = null;;

                    for (var j = 0; j < data[0].quotesDetails.length; j++) {
                        var _subTime = fnConverToLocalTime(data[0].quotesDetails[j].subTime);
                        if (data[0].vendorNames[i].vendorID == data[0].quotesDetails[j].vendorID) {

                            //Quotes = Quotes + '["' + data[0].quotesDetails[j].subTime + '",' + data[0].quotesDetails[j].quotedPrice + '],';
                            Quotes = Quotes + '["' + _subTime + '",' + data[0].quotesDetails[j].quotedPrice + '],';

                            values = data[0].quotesDetails[j].quotedPrice;
                        }
                        else {

                            //Quotes = Quotes + '["' + data[0].quotesDetails[j].subTime + '",' + values + '],';
                            Quotes = Quotes + '["' + _subTime + '",' + values + '],';
                        }
                    }



                    Quotes = Quotes.slice(0, -1);

                    Vendorseries = '{ "name" :"' + data[0].vendorNames[i].vendorName + '", "color": "' + colorArray[i] + '","data": [' + Quotes + ']}';

                    Seriesoption.push(JSON.parse(Vendorseries));

                }

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
    })

    setTimeout(function () {

        $('#linechart_material').highcharts({
            title: {
                text: '',
                style: {

                    fontSize: '15px',

                },

            },

            xAxis: {

                title: {
                    text: 'Time'
                },

                categories: graphtime//,'12:42','15:14','15:14','15:14','15:57']//graphtime


            },
            yAxis: {
                min: minprice,
                max: maxprice,
                title: {
                    text: 'Quoted Price'
                },

            },

            series: Seriesoption,

            credits: {
                enabled: false
            }

        });

    }, 2000)



}
var tableToExcel = (function () {

    var uri = 'data:application/vnd.ms-excel;base64,'
        , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
            + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
            + '<Styles>'
            + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
            + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
            + '</Styles>'
            + '{worksheets}</Workbook>'
        , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
        , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (tables, wsnames, wbname, appname) {
        var ctx = "";
        var workbookXML = "";
        var worksheetsXML = "";
        var rowsXML = "";

        for (var i = 0; i < tables.length; i++) {
            if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
            for (var j = 0; j < tables[i].rows.length; j++) {
                rowsXML += '<Row>'
                for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
                    var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                    var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                    var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                    dataValue = (dataValue) ? dataValue : tables[i].rows[j].cells[k].innerHTML;
                    var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
                    dataFormula = (dataFormula) ? dataFormula : (appname == 'Calc' && dataType == 'DateTime') ? dataValue : null;
                    ctx = {
                        attributeStyleID: (dataStyle == 'Currency' || dataStyle == 'Date') ? ' ss:StyleID="' + dataStyle + '"' : ''
                        , nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String'
                        , data: (dataFormula) ? '' : dataValue
                        , attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                    };
                    rowsXML += format(tmplCellXML, ctx);
                }
                rowsXML += '</Row>'
            }
            ctx = { rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i };
            worksheetsXML += format(tmplWorksheetXML, ctx);
            rowsXML = "";
        }

        ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
        workbookXML = format(tmplWorkbookXML, ctx);



        var link = document.createElement("A");
        link.href = uri + base64(workbookXML);
        link.download = wbname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
})();

