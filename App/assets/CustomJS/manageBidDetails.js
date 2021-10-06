var APIPath = sessionStorage.getItem("APIPath");
clearsession()

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
$('#txtbid,#txtvendor,#txtBidDurationPrev,#txtvendorSurrogateBid,#txtdestinationPort,#txtshortname,#txtpricefrequency').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
//var form1 = $('#entryForm');
$(".surrogateFormElements").hide();
var error1 = $('.alert-danger');
var success1 = $('.alert-success');
var error2 = $('#errormapdiv');
var erroropenbid = $('#errorOpenbid');
var errorremainder = $('#errorsendremainder');
var success2 = $('#successmapdiv');
var successopenbid = $('#successopenbid');
var succesremainder = $('#successremainder');

var successprebid = $('#successprebid');
var errorprebid = $('#errorprebid');

var hdnSeId = 0;
var isBidEventChanged = false;
var isRunningBid = '';
var _bidClosingType = '';

// edit mode inputs for events editddlbid

jQuery("#divbidDatePrevtab_0").hide();
$("#btn-submit-datetime").hide();
jQuery("#divbidTimePrevtab_0").hide();
jQuery("#divbidTermsFilePrevtab_0").hide();
jQuery("#divbidAttachFilePrevtab_0").hide();
jQuery("#divbidItemsPrevtab_0").hide();
jQuery("#eventDetailstab_0").hide();
jQuery("#btnuserConfirmation").hide();
jQuery("#eventUpdateStatusTab5").hide();
jQuery("#divbidShowL1L2").hide();


$("#editValuesModal").on("hidden.bs.modal", function () {
    jQuery("#divbidDatePrevtab_0").hide();
    $("#btn-submit-datetime").hide();
    $("#btn-submit-modal").show();
    jQuery("#divbidTimePrevtab_0").hide();
    jQuery("#divbidTermsFilePrevtab_0").hide();
    jQuery("#divbidAttachFilePrevtab_0").hide();
    jQuery("#divbidItemsPrevtab_0").hide();
    jQuery("#divbidShowL1L2").hide();
});


function FormValidate() {
    sessionStorage.removeItem("shname")
    sessionStorage.removeItem("price")
    sessionStorage.removeItem("subtime")
    sessionStorage.removeItem("psid")
    sessionStorage.removeItem("psheaderid")
    sessionStorage.removeItem("PriceSea")
    sessionStorage.removeItem("ExworkSea")
    sessionStorage.removeItem("SubmissionTymSea")
   
   
    $('#maphead').validate({
        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            txtremarks: {
                required: true
            }
        },
        messages: {
            txtremarks: {
                required: "Remarks is required."
            }
        },

        errorPlacement: function (error, element) { // render error placement for each input type
            error.insertAfter(element); // for other inputs, just perform default behavior
        },

        invalidHandler: function (event, validator) { //display error alert on form submit

            success2.hide();
            jQuery("#err").text("You have some form errors. Please check below.");
            error2.show();
            error2.fadeOut(5000);
            App.scrollTo(error2, -200);
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.col-lg-4').removeClass('has-success').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-lg-4').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.col-lg-4').removeClass('has-error').addClass('has-success');
            label.remove(); // remove error label here

        },
        submitHandler: function (form) {
            error2.hide();
            if (sessionStorage.getItem("hdnbidtypeid") == 7) {
                deletePSquote();
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 6) {
                deletePEFAquote();
            }

        }
    });

}


function fetchUserBids() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=0&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {

                sessionStorage.setItem('hdnAllBids', JSON.stringify(data));

            }
            else {
                error1.show();
                $('#spandanger').html('No pending bids for which you can invite vendors.!');
                error1.fadeOut(6000);
                App.scrollTo(error1, -200);
             }

            jQuery.unblockUI();

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

jQuery("#txtbid").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllBids');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.bidSubject] = username;
            usernames.push(username.bidSubject);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].BidId != "0") {
            jQuery("#eventUpdateStatusTab5").show();

            hdnSeId = 0;
            isRunningBid = '';
            var isBidEventChanged = false;
            jQuery("#btnuserConfirmation").hide();
            sessionStorage.setItem('hdnbid', map[item].bidId);
            jQuery("#ddlbid").val(map[item].bidId);
            if (map[item].bidTypeID == "6" && map[item].bidForID == 82) {
                $('#litab8').addClass('hide');
                $('#tab_8').addClass('hide');
            }
            else {
                $('#litab8').removeClass('hide');
                $('#tab_8').removeClass('hide');
            }
            sessionStorage.setItem("hdnbidtypeid", map[item].bidTypeID)
            sessionStorage.setItem("hdbbidForID", map[item].bidForID)

            fetchvendors(map[item].bidId);
            FetchVenderNotInvited(map[item].bidId)
            fetchallexportdetails(); // For Time Extension feature added on 11 Nov
            fetchItemsforPreBidPrices(map[item].bidId, map[item].bidTypeID, map[item].bidForID);

        }
        else {
            gritternotification('Please select Bid  properly!!!');
            sessionStorage.setItem('hdnbid', '0');
            sessionStorage.setItem("hdnbidtypeid", '0')
            $('#inviteVendorBody').hide();
            jQuery("#ddlbid").val(0);
        }

        return item;
    }

});

function fetchvendors(bidid) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=" + bidid + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#ddlvendors').empty()
            if (data.length > 0) {
                sessionStorage.setItem('hdnAllBidsVendor', JSON.stringify(data));
                jQuery('#ddlvendors').append(jQuery("<option ></option>").val("0").html("Select Vendor"));
                for (var i = 0; i < data.length; i++) {
                    jQuery('#ddlvendors').append(jQuery("<option ></option>").val(data[i].vendorID).html(data[i].vendorName));
                }
            }
            else {
                error1.show();
                $('#spandanger').html('Bid not mapped');
                error1.fadeOut(3000);
                App.scrollTo(error1, -200);

            }

            jQuery.unblockUI();

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
function fetchparticationQuotes() {
    var url = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
    if (sessionStorage.getItem("hdnbidtypeid") == 7) {
        url = APIPath + "RemoveParticipatedQuotedPrices/fetchPSQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }
    else if (sessionStorage.getItem("hdnbidtypeid") == 6) {
        url = APIPath + "RemoveParticipatedQuotedPrices/fetchPEFAQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }
   
    // alert(url)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: url,
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            $('#tblquotedprices').show()
            jQuery('#tblquotedprices').empty()
            var shortname = "";
            if (data.length > 0) {
                if (sessionStorage.getItem("hdnbidtypeid") == 7) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>ShortName</th><th>Quoted Price</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {

                        shortname = (data[i].shortName).replace(/(\r\n|\n|\r)/gm, "");
                        $('#tblquotedprices').append('<tr><td>' + data[i].shortName + '</td><td>' + data[i].quotedPrice + '</td><td>' + data[i].submissionTime + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationPS(\'' + shortname + '\',\'' + data[i].quotedPrice + '\',\'' + data[i].submissionTime + '\',\'' + data[i].psid + '\',\'' + data[i].psHeaderID + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
                
                else if (sessionStorage.getItem("hdnbidtypeid") == 6) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>ShortName</th><th>Quoted Price</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {
                        shortname = (data[i].shortName).replace(/(\r\n|\n|\r)/gm, "");
                        $('#tblquotedprices').append('<tr><td>' + data[i].shortName + '</td><td>' + data[i].quotedPrice + '</td><td>' + data[i].submissionTime + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationPS(\'' + shortname + '\',\'' + data[i].quotedPrice + '\',\'' + data[i].submissionTime + '\',\'' + data[i].psid + '\',\'' + 0 + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
            }
            else {
                $('#tblquotedprices').append('<tr><td>No Record found</td></tr>');

            }

            jQuery.unblockUI();
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

}

function removeQuotationPS(shname, price, subtime, psid, psheaderid) {
    $('#deletepopup').modal('show')
    sessionStorage.setItem("shname", shname)
    sessionStorage.setItem("price", price)
    sessionStorage.setItem("subtime", subtime)
    sessionStorage.setItem("psid", psid)
    sessionStorage.setItem("psheaderid", psheaderid)
}

function deletePEFAquote() {
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }
    AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    var QuoteProduct = {
        "VendorID": parseInt($('#ddlvendors').val()),
        "BidID": parseInt($('#ddlbid').val()),
        "ShortName": sessionStorage.getItem("shname"),
        "QuotedPrice": sessionStorage.getItem("price"),
        "SubmissionTime": sessionStorage.getItem("subtime"),
        "PSID":parseInt(sessionStorage.getItem("psid")),
        "PSHeaderID": 0,
        "Remarks": $('#txtremarks').val(),
        "Attachment": AttachementFileName,
        "UserID": sessionStorage.getItem("UserID")

    }
    // alert(JSON.stringify(QuoteProduct))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RemoveParticipatedQuotedPrices/RemovePEFAQuote/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(QuoteProduct),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

           //** Upload Files on Azure PortalDocs folder
            if ($('#fileToUpload').val() != '')
            {
                fnUploadFilesonAzure('fileToUpload', AttachementFileName, 'MangeBid/' + $('#ddlbid').val());

            }
            if (data == "1") {

                success1.show();
                $('#spansuccess1').html("Quoted Price deleted Successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                fetchparticationQuotes()
                $('#deletepopup').modal('hide')
                $('#txtremarks').val('')
                $('#fileToUpload').val('')

            }
            else if (data == "99") {
                $('#deletepopup').modal('hide')
                bootbox.alert("You cant't delete entries more than 2 times for a vendor in a particular Bid.")
            }
            else {
                error2.show();
                $('#err').html('You have some error.Please try agian.');
                error2.fadeOut(3000);
                App.scrollTo(error2, -200);
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}

function deletePSquote() {
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }
    AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    var QuoteProduct = {
        "VendorID": parseInt($('#ddlvendors').val()),
        "BidID": parseInt($('#ddlbid').val()),
        "ShortName": sessionStorage.getItem("shname"),
        "QuotedPrice": parseFloat(sessionStorage.getItem("price")),
        "SubmissionTime": sessionStorage.getItem("subtime"),
        "PSID": parseInt(sessionStorage.getItem("psid")),
        "PSHeaderID": parseInt(sessionStorage.getItem("psheaderid")),
        "Remarks": $('#txtremarks').val(),
        "Attachment": AttachementFileName,
        "UserID": sessionStorage.getItem("UserID")

    }
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RemoveParticipatedQuotedPrices/RemovePSQuote/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(QuoteProduct),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            

            if (data == "1") {
                //** Upload Files on Azure PortalDocs folder
                if ($('#fileToUpload').val() != '') {
                    fnUploadFilesonAzure('fileToUpload', AttachementFileName, 'MangeBid/' + $('#ddlbid').val());

                }
               
                success1.show();
                $('#spansuccess1').html("Quoted Price deleted Successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                fetchparticationQuotes()
                $('#deletepopup').modal('hide')
                $('#txtremarks').val('')
                $('#fileToUpload').val('')

                
            }
            else if (data == "99") {
                $('#deletepopup').modal('hide')
                bootbox.alert("You cant't delete entries more than 2 times for a vendor in a particular Bid.")
            }
            else {
                error2.show();
                $('#err').html('You have some error.Please try agian.');
                error2.fadeOut(3000);
                App.scrollTo(error2, -200);
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}



$('#deletepopup').on('hidden.bs.modal', function () {
    $('#txtremarks').val('');

});

jQuery("#txtvendor, #txtvendorSurrogateBid").keyup(function () {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
});

jQuery("#txtvendor,#txtvendorSurrogateBid").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllBidsVendor');
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
            sessionStorage.setItem('hdnselectedEmail', map[item].emailId);
            if ($("#txtvendorSurrogateBid").val() != '') {
                $(".surrogateFormElements").show();
            }
        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
var allnoninvitedvendors;
function FetchVenderNotInvited(bidid) {
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=x&BidID=" + bidid + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#tblvendorlist > tbody").empty();
            jQuery("#txtSearch").val('');
            $('#btninvitevendors').addClass('hide')
            sessionStorage.setItem('hdnVendorID', 0);
          
            if (data.length > 0) {
                allnoninvitedvendors = data;
                $('#inviteVendorBody').show();
                
            }
            else {
                $('#inviteVendorBody').hide();
            }


        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");

            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
$("#chkAll").click(function () {
    if ($("#chkAll").is(':checked') == true) {
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
        });
    }
    else {
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").removeClass("checked");
        });
    }
});

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
function resetpasswordForBidVendor() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if (sessionStorage.getItem("hdnbid") == '0') {
        error1.show();
        $('#spandanger').html('Please select Bid...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        gritternotification('Please select Bid!!!');
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
        var data = {
            "EmailId": sessionStorage.getItem("hdnselectedEmail"),
            "BidId": parseInt(sessionStorage.getItem("hdnbid")),
            "VendorID": parseInt(sessionStorage.getItem("hdnselectedvendor")),
            "UserID": sessionStorage.getItem("UserID")

        }
        // alert(JSON.stringify(data))
        jQuery.ajax({
            url: APIPath + "ResetInviteVendor/ResetPassword",
            data: JSON.stringify(data),
            type: "POST",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            contentType: "application/json",
            success: function (data) {
                if (data = "1") {
                    success1.show();
                    $('#spansuccess1').html('New password is sent to registered email of vendor..');

                    success1.fadeOut(6000);
                    App.scrollTo(success1, -200);
                    jQuery.unblockUI();
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
    }


}
function clearsession() {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
    sessionStorage.setItem('hdnbid', '0');
    sessionStorage.setItem("hdnbidtypeid", '0')
    jQuery("#txtvendor, #txtvendorSurrogateBid").val('')

}
function sendremainderstoparicipants() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("hdnbid") == '0') {
        errorremainder.show();
        $('#errrem').html('Please select Bid...');
        errorremainder.fadeOut(3000);
        App.scrollTo(errorremainder, -200);
        jQuery.unblockUI();
        gritternotification('Please select Bid!!!');
        return false;

    }
    else {
        var checkedValue = '';
        var temp = new Array();
        $("#tblparicipantslists> tbody > tr").each(function (index) {

            vemail = $(this).find("td").eq(1).html();
            vid = $(this).find("td").eq(0).html();
            checkedValue = checkedValue + " select  " + sessionStorage.getItem("hdnbid") + ",'" + vemail + "','N','" + vid + "'  union";

        });
        if (checkedValue != '') {
            checkedValue = 'insert into #temp(BidId,EmailId,MailSent,VendorID) ' + checkedValue
            checkedValue = checkedValue.substring(0, checkedValue.length - 6);
        }

        var data = {
            "QueryString": checkedValue,
            "BidId": parseInt(sessionStorage.getItem("hdnbid")),
            "BidTypeID": parseInt(sessionStorage.getItem("hdnbidtypeid")),
            "UserID": sessionStorage.getItem("UserID")
        }
        // alert(JSON.stringify(data))
        jQuery.ajax({
            url: APIPath + "ResetInviteVendor/SendRemainderToParticipant",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                // alert(data[0].Flag)
               // if (data == "1") {
                    errorremainder.hide();
                    succesremainder.show();
                    $('#succrem').html('Reminder has been sent Successfully..');

                    clearsession();

                    succesremainder.fadeOut(3000);
                    App.scrollTo(succesremainder, -200);
                    jQuery.unblockUI();
                //}
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

        return true;
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
        var tdContent = '0';
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
        if (map[item].vendorID != "0") {

            sessionStorage.setItem('hdnVendorID', map[item].vendorID);
            $('#btninvitevendors').removeClass('hide')

            var str = "<tr id=TRVendor" + map[item].vendorID + "><td class='hide'>" + map[item].vendorID + "</td><td class=hide>" + map[item].emailId + "</td><td>" + map[item].vendorName + " </td><td><button type='button' class='btn btn-xs btn-danger'  onclick=fnremoveVendors(\'" + map[item].vendorID + "'\)><i class='glyphicon glyphicon-remove-circle'></i></button></td></tr>";
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
    if (sessionStorage.getItem("hdnbid") == '0') {
        error1.show();
        $('#spandanger').html('Please select Bid...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        jQuery.unblockUI();
        gritternotification('Please select Bid!!!');
        return false;

    }
       
    else {
        var checkedValue = '';
        //var temp = new Array();
        // $("#tblvendorlist> tbody > tr").each(function (index) {
        $("#tblvendorlist tr:gt(0)").each(function () {
            var this_row = $(this);
            // if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            //  temp = ($(this).find("#chkvender").val()).split(",");

            checkedValue = checkedValue + " select  " + sessionStorage.getItem("hdnbid") + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "','N','" + $.trim(this_row.find('td:eq(0)').html()) + "'  union";
            //}
        });
        if (checkedValue != '') {
            checkedValue = 'insert into PE.BidVendorDetails(BidId,EmailId,MailSent,VendorID) ' + checkedValue
            checkedValue = checkedValue.substring(0, checkedValue.length - 6);
        }

        var data = {
            "QueryString": checkedValue,
            "BidId": parseInt(sessionStorage.getItem("hdnbid")),
            "BidTypeID":parseInt(sessionStorage.getItem("hdnbidtypeid")),
            "UserID": sessionStorage.getItem("UserID")
        }
        //alert(JSON.stringify(data))
        console.log(JSON.stringify(data))
        jQuery.ajax({
            url: APIPath + "ResetInviteVendor/Invitevendors",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
               // if (data == "1") {
                    success1.show();
                    $('#spansuccess1').html('Vendor Invited Successfully..');
                    fetchallexportdetails();
                    FetchVenderNotInvited(sessionStorage.getItem("hdnbid"))
                    fetchvendors(sessionStorage.getItem("hdnbid"));

                    success1.fadeOut(3000);
                    App.scrollTo(success1, -200);
                    jQuery.unblockUI();
               // }
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

        return true;
    }
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


//Time Extension Feature 4th TAB

var SeId = 0;
var FlagForCheckShowPrice = "N";
function fetchallexportdetails() {
    var bidTypeFetchUrl = '';
    $('#extendedDurationPara').hide();
    var replaced1 = '';
    var replaced2 = '';
    if (sessionStorage.getItem("hdnbidtypeid") == 6) {
        bidTypeFetchUrl = sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + jQuery('#ddlbid').val() + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken');
    }
    if (sessionStorage.getItem("hdnbidtypeid") == 7) {
        bidTypeFetchUrl = sessionStorage.getItem("APIPath") + "ConfigureBid/fetchSeaExportConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + jQuery('#ddlbid').val() + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken');
    }

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: bidTypeFetchUrl,
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            $("#eventDetailstab_0").show();
            $('#BidPreviewDiv').show()
            jQuery('#mapedapproverPrev').html('');
            jQuery('#mapedapproverPrevtab_0').html('');
            jQuery('#txtBidSubjectPrev').html(BidData[0].bidDetails[0].bidSubject)
            jQuery('#txtBidSubjectPrevtab_0').html(BidData[0].bidDetails[0].bidSubject)
            jQuery('#txtbiddescriptionPrev').html(BidData[0].bidDetails[0].bidDetails)
            jQuery('#txtbiddescriptionPrevtab_0').html(BidData[0].bidDetails[0].bidDetails)
            jQuery('#txtbidDatePrev').html(BidData[0].bidDetails[0].bidDate)
            jQuery('#txtbidDatePrevtab_0').html(BidData[0].bidDetails[0].bidDate)
            jQuery('#txtbidTimePrevtab_0').html(BidData[0].bidDetails[0].bidTime)
            jQuery('#txtbidTimePrev').html(BidData[0].bidDetails[0].bidTime)
            jQuery("#dropCurrencyPrev").html(BidData[0].bidDetails[0].currencyName)
            jQuery("#dropCurrencyPrevtab_0").html(BidData[0].bidDetails[0].currencyName)
            jQuery('#txtConversionRatePrev').html(BidData[0].bidDetails[0].conversionRate)
            jQuery('#txtConversionRatePrevtab_0').html(BidData[0].bidDetails[0].conversionRate)
            if (sessionStorage.getItem("hdnbidtypeid") == 7) {
                if (BidData[0].bidDetails[0].showRankToVendor == "Y") {
                    jQuery('#showL1l2').text("As L1, L2, L3 etc.")
                }
                else {
                    jQuery('#showL1l2').text("As L1 or Not L1")
                }
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 6) {
                if (BidData[0].bidDetails[0].showRankToVendor == "Y") {
                    jQuery('#showL1l2').text("As H1, H2, H3 etc.")
                }
                else {
                    jQuery('#showL1l2').text("As H1 or Not H1")
                }
            }

            //var ClosingType=''
            $('#hdnClosingval').val(BidData[0].bidDetails[0].bidClosingType)

            jQuery("#txtBidDurationPrevtab_0").html(BidData[0].bidDetails[0].bidDuration);
            if (BidData[0].bidDetails[0].status.toLowerCase() == "close") {

                $("#ddlBidStatus").val(2);
                $('#btnsendreminder').attr("disabled", "disabled")
            }
            else if (BidData[0].bidDetails[0].Status == "OPEN") {
                $("#ddlBidStatus").val(1);
                $('#btnsendreminder').removeAttr("disabled")
            }
            $("#ctrlbidTimeandDate").attr('onclick', "editValues('divbidTimePrevtab_0', 'txtbidDatePrevtab_0')");
            $("#ctrlFileTerms").attr('onclick', "editValues('divbidTermsFilePrevtab_0', '')");
            $("#ctrlFileAttachment").attr('onclick', "editValues('divbidAttachFilePrevtab_0', '')");
            $("#ctrlShwL1").attr('onclick', "editValues('divbidShowL1L2', '')");
            //**************************** Change by Pooja sppinner to Textbox  Start**************************
            //  $('#spinnerBidDetails').show()
            // $('#spinnerBidDetails').spinner({ value: BidData[0].BidDetails[0].BidDuration, step: 1, min: 0, max: 999 });
            $('#txtBidDurationForBidOpen').val(BidData[0].bidDetails[0].bidDuration)
            $('#txtbidTime').val(BidData[0].bidDetails[0].bidTime)
            $('#txtbidDate').val(BidData[0].bidDetails[0].bidDate)

            $('#ddlBidfinalStatus').val(BidData[0].bidDetails[0].finalStatus)


            if (BidData[0].bidDetails[0].finalStatus.toLowerCase() == "cancel") {
                if (sessionStorage.getItem("UserID") == "..") {
                    $('#divfinalstatus').removeClass('hide');

                }
            }
            else {
                $('#divfinalstatus').addClass('hide');
            }

            //**************************** Change by Pooja sppinner to Textbox   End**************************

            _bidClosingType = BidData[0].bidDetails[0].bidClosingType;
           
            if (BidData[0].bidDetails[0].bidClosingType == "A") {
                SeId = 0;
                $('#spinnerBidclosingTab').show()
                $('#btndiv').show()
                $('#txtbidduration').hide()
                $('#spinnerBidclosingTab').spinner({ value: BidData[0].bidDetails[0].bidDuration, step: 1, min: 0, max: 999 });
                jQuery('#ddlbidclosetypePrev').html('All items in one go')
                jQuery('#ddlbidclosetypePrevtab_0').html('All items in one go')
                $(".staggered-item").show();

                $('#txtBidDurationForBidOpen').removeAttr("disabled");
            }
            else if (BidData[0].bidDetails[0].bidClosingType == "S") {
                $("#txtBidDurationForBidOpen").attr("disabled", "disabled");
                $('#spinnerBidclosingTab').hide()
                $('#btndiv').hide()
                $('#txtbidduration').show()
                
                $('#txtbidduration').html(BidData[0].bidDetails[0].bidDuration)
                jQuery('#ddlbidclosetypePrev').html('Stagger at: Item level')
                jQuery('#ddlbidclosetypePrevtab_0').html('Stagger at: Item level')
            } else {
                $("#head-stagger").hide();
                $(".staggered-item").hide();
                $('#spinnerBidclosingTab').show()
                $('#btndiv').show()
                $('#txtbidduration').hide()
                $('#spinnerBidclosingTab').spinner({ value: BidData[0].bidDetails[0].bidDuration, step: 1, min: 0, max: 999 });
                //jQuery('#ddlbidclosetypePrev').html('Stagger at: Item level')
                $('#hdnClosingval').val('A')
            }


            if (BidData[0].bidDetails[0].termsConditions != '') {
                replaced1 = BidData[0].bidDetails[0].termsConditions.replace(/\s/g, "%20")
                if (BidData[0].bidDetails[0].attachment != '') {
                    if (BidData[0].bidDetails[0].attachment != null) {
                        replaced2 = BidData[0].bidDetails[0].attachment.replace(/\s/g, "%20")
                    }
                }



            }
         

            $('#filepthtermsPrev').html(BidData[0].bidDetails[0].termsConditions)
            $('#filepthattachPrev').html(BidData[0].bidDetails[0].attachment)

            $('#filepthtermsPrevtab_0').html(BidData[0].bidDetails[0].termsConditions)
            $('#filepthattachPrevtab_0').html(BidData[0].bidDetails[0].attachment)

            if (BidData[0].bidApproverDetails.length > 0) {
                for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {

                    jQuery('#mapedapproverPrev').append(jQuery('<option selected></option>').val(BidData[0].bidApproverDetails[i].userID).html(BidData[0].bidApproverDetails[i].approverName))
                    jQuery('#mapedapproverPrevtab_0').append(jQuery('<option selected></option>').val(BidData[0].bidApproverDetails[i].userID).html(BidData[0].bidApproverDetails[i].approverName))
                }
            }


            jQuery("#tblServicesProductPrev").empty();
            jQuery("#tblServicesProductPrevtab_0").empty();
            if (sessionStorage.getItem('hdnbidtypeid') == 7) {
                if (BidData[0].bidSeaExportDetails.length > 0) {

                    $('#wrap_scrollerPrev').show();
                    $('#wrap_scrollerPrevtab_0').show();

                    if ($('#hdnClosingval').val() == "S") {
                        $(".staggered-item").show();

                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S. No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th class=hide>Mask Vendor</th><th style='width:60px !important'>Minimum<br/>Decrement</th><th>Decrement On</th><th>Last<br/>Invoice Price</th><th>Item<br/>Duration(Min)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th><th>Closing Time</th><th style=width:200px>Bid Duration<br/>(in minutes)</th></tr></thead>");
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>S.No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th>Mask Vendor</th><th style='width:60px !important'>Minimum<br/>Decrement</th><th>Decrement On</th><th>Last<br/>Invoice Price</th><th>Item<br/>Duration(Min)</th><th>Closing Time</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    }
                    else {
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>S.No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th>Mask Vendor</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S. No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th class=hide>Mask Vendor</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    }

                    for (var i = 0; i < BidData[0].bidSeaExportDetails.length; i++) {


                        var decrementon = ''

                        if (BidData[0].bidSeaExportDetails[i].decreamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = '%age'

                       
                        if ($('#hdnClosingval').val() == "S") {
                          
                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>'+(i+1)+'</td><td>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].targetprice + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].quantity + '</td><td>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].ceilingPrice + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].MaskVendor + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].minimumDecreament + '</td><td>' + decrementon + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].decreamentOn + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].lastInvoicePrice + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].itemBidDuration + '</td><td>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td>' + BidData[0].bidSeaExportDetails[i].showStartPrice + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].poUnitRate + '</td><td>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].poValue + '</td><td>' + BidData[0].bidSeaExportDetails[i].itemClosingTime + '</td><td><div class="pull-left"> <div id=spinner' + i + ' class="pull-left"><div class="input-group" style="width:110px;"><div class="spinner-buttons input-group-btn"><button type="button" class="btn spinner-down red btn-sm"><i class="fa fa-minus"></i></button> </div><input type=text class="spinner-input form-control input-sm" id=txtitemBidDuration' + i + ' maxlength="3" readonly><div class="spinner-buttons input-group-btn "><button type="button" class="btn spinner-up blue btn-sm"><i class="fa fa-plus"></i></button></div></div></div><button id="btnextendA" type="button" class="btn green btn-sm" onclick="fnTimeUpdateS(\'' + i + '\',\'' + BidData[0].bidSeaExportDetails[i].seid + '\')">Go</button><div class="col-md-12"><p class="form-control-static" id=extendedDuration' + i + ' style="color:#3c763d; font-weight: 600; display: none;">Time&nbsp;Extended&nbsp;Successfully</p></div></td></tr>');
                            $('#spinner' + i).spinner({ value: 0, step: 1, min: 0, max: 999 }); //BidData[0].bidSeaExportDetails[i].ItemBidDuration

                            if (BidData[0].bidDetails[0].bidForID == "81" || BidData[0].bidDetails[0].bidForID == "1") {
                                jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td><a class=isDisabledClass onclick=editValues(\'divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].quantity + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].ceilingPrice + " <a class='changeMinDecreament ml-1' onclick=editbidstartprice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].lastInvoicePrice + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].itemBidDuration + "</td><td>" + BidData[0].bidSeaExportDetails[i].itemClosingTime + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].seid + "</td><td>" + BidData[0].bidSeaExportDetails[i].maskL1Price + "&nbsp;<a class='lambdafactor' onclick=editShowL1Price(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poUnitRate + "</td><td>" + BidData[0].bidSeaExportDetails[i].poNo + "</td><td>" + BidData[0].bidSeaExportDetails[i].poVendorName + "</td><td>" + BidData[0].bidSeaExportDetails[i].poDate + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poValue + "</td></tr>");
                            }
                            else {
                                jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td><a class=isDisabledClass onclick=editValues(\'divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].quantity + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].ceilingPrice + " <a class='changeMinDecreament ml-1' onclick=editbidstartprice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].lastInvoicePrice + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].itemBidDuration + "</td><td>" + BidData[0].bidSeaExportDetails[i].itemClosingTime + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].seid + "</td><td>" + BidData[0].bidSeaExportDetails[i].maskL1Price + "</td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poUnitRate + "</td><td>" + BidData[0].bidSeaExportDetails[i].poNo + "</td><td>" + BidData[0].bidSeaExportDetails[i].poVendorName + "</td><td>" + BidData[0].bidSeaExportDetails[i].poDate + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poValue + "</td></tr>");
                            }

                        }
                        else {
                            
                            jQuery("#tblServicesProductPrev").append("<tr id=tridPrev" + i + "><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].quantity + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].ceilingPrice + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + "</td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].lastInvoicePrice + '</td><td>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td>' + BidData[0].bidSeaExportDetails[i].showStartPrice + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].poUnitRate + '</td><td>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].poValue + '</td></tr>');
                            if (BidData[0].bidDetails[0].bidForID == "81" || BidData[0].bidDetails[0].bidForID == "1") {
                                jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td style='width:150px !important;'><a class='isDisabledClass' onclick=editValues('\divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].quantity + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].ceilingPrice + " <a class='changeMinDecreament ml-1' onclick=editbidstartprice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].lastInvoicePrice + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].seid + "</td><td>" + BidData[0].bidSeaExportDetails[i].maskL1Price + "&nbsp;<a class='lambdafactor' onclick=editShowL1Price(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poUnitRate + "</td><td>" + BidData[0].bidSeaExportDetails[i].poNo + "</td><td>" + BidData[0].bidSeaExportDetails[i].poVendorName + "</td><td>" + BidData[0].bidSeaExportDetails[i].poDate + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poValue + "</td></tr>");
                            }
                            else {
                                jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td style='width:150px !important;'><a class='isDisabledClass' onclick=editValues('\divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].quantity + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].ceilingPrice + " <a class='changeMinDecreament ml-1' onclick=editbidstartprice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].lastInvoicePrice + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].seid + "</td><td>" + BidData[0].bidSeaExportDetails[i].maskL1Price + "</td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poUnitRate + "</td><td>" + BidData[0].bidSeaExportDetails[i].poNo + "</td><td>" + BidData[0].bidSeaExportDetails[i].poVendorName + "</td><td>" + BidData[0].bidSeaExportDetails[i].poDate + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poValue + "</td></tr>");
                            }
                        }


                    }
                    jQuery('#selectedvendorlistsPrev> tbody').empty()
                    jQuery('#selectedvendorlistsPrevtab_0> tbody').empty()
                    FlagForCheckShowPrice = 'N';
                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {

                        jQuery('#selectedvendorlistsPrev').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>');
                        jQuery('#selectedvendorlistsPrevtab_0').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td class=text-right>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                        if (BidData[0].bidVendorDetails[i].advFactor != 0) {
                            FlagForCheckShowPrice = "Y";
                        }
                    }

                    jQuery('#tblparicipantslists> tbody').empty()
                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                        jQuery('#tblparicipantslists').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td class=hide>' + BidData[0].bidVendorDetails[i].emailID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td></tr>')
                    }

                    if (FlagForCheckShowPrice == "Y") {
                        $("a.lambdafactor").removeAttr("onclick");

                    }

                }
            }

            if (sessionStorage.getItem('hdnbidtypeid') == 6) {
                $('#hdnClosingval').val('').val(BidData[0].bidDetails[0].bidForID)
                if (BidData[0].bidScrapSalesDetails.length > 0) {
                    var max = BidData[0].bidScrapSalesDetails[0].attachmentSeqID;
                    $('#wrap_scrollerPrev').show();
                    $('#wrap_scrollerPrevtab_0').show();

                    $('#hdnauctiontype').val(BidData[0].bidDetails[0].bidForID)
                    if (BidData[0].bidDetails[0].bidForID == 81) {
                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S.No.</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increament</th><th>Increament On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                        $("#txtBidDurationForBidOpen").removeAttr("disabled", "disabled");
                        $('#btndiv').show()
                        $('#plusbtn').removeAttr("disabled", "disabled");
                        $('#minusbtn').removeAttr("disabled", "disabled");
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th>S.No.</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increament</th><th>Increament On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    }
                    if (BidData[0].bidDetails[0].bidForID == 82) {
                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S.No.</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increament</th><th>Increament On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th class=hide>Show L1 Price</th></tr></thead>");
                        $("#txtBidDurationForBidOpen").attr("disabled", "disabled");
                        $('#btndiv').hide()
                        $('#plusbtn').attr("disabled", "disabled");
                        $('#minusbtn').attr("disabled", "disabled");
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th>S.No.</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Mask Vendor</th><th class=hide>Minimum Increament</th><th class=hide>Increament On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Starting Price</th><th>Price Increment Frequency</th><th>Price Increment Amount</th><th class=hide>Show L1 Price</th></tr></thead>");
                    }
                   
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {
                        if (max < BidData[0].bidScrapSalesDetails[i].attachmentSeqID) {
                            max = BidData[0].bidScrapSalesDetails[i].attachmentSeqID
                        }
                        FileseqNo = max
                        var increamenton = ''

                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            increamenton = 'Amount'
                        else
                            increamenton = '%age'

                        var attach = (BidData[0].bidScrapSalesDetails[i].attachments).replace(/\s/g, "%20");


                        if (BidData[0].bidDetails[0].bidForID == 81) {

                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right >' + BidData[0].bidScrapSalesDetails[i].ceilingPrice + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].minimumIncreament + '</td><td>' + increamenton + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].lastSalePrice + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');
                            jQuery("#tblServicesProductPrevtab_0").append('<tr id=trid' + i + '><td><a class="isDisabledClass" onclick="editValues(\'divbidItemsPrevtab_0\',\'trid' + i + '\')" ><i class="fa fa-pencil"></i></a></td><td>' + (i + 1) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '&nbsp;<a class="editbidstartprice ml-1" onclick=editbidstartpriceFA(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td>' + BidData[0].bidScrapSalesDetails[i].minimumIncreament + '&nbsp;<a class="changeMinDecreament ml-1" onclick=editincreament(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + increamenton + '</td><td class=hide><a href=PortalDocs/Bid/' + jQuery('#ddlbid').val() + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + '</a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td  class=hide>' + BidData[0].bidScrapSalesDetails[i].psid + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '&nbsp;<a  onclick=editShowL1Price(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '&nbsp;<a class=lambdafactor onclick=editShowStartPrice(' + BidData[0].bidScrapSalesDetails[i].psid + ',\'trid' + i + '\')><i class="fa fa-pencil"></i></a></td></tr>');

                        }

                        if (BidData[0].bidDetails[0].bidForID == 82) {
                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right >' + BidData[0].bidScrapSalesDetails[i].ceilingPrice + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].minimumIncreament + '</td><td>' + increamenton + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].lastSalePrice + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td></tr>');

                            jQuery("#tblServicesProductPrevtab_0").append('<tr id=tridPrev' + i + '><td><a class="isDisabledClass" onclick="editValues(\'divbidItemsPrevtab_0\',\'tridPrev' + i + '\')" ><i class="fa fa-pencil"></i></a></td><td>' + (i + 1) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '&nbsp;<a class="editbidstartprice ml-1" onclick=editbidstartpriceFA(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].minimumIncreament + '&nbsp;<a class="changeMinDecreament ml-1" onclick=editincreament(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"tridPrev' + i + '"\)><i class="fa fa-pencil"></i></a></td><td class=hide>' + increamenton + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].startingPrice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionFrequency) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionAmount) + '</td><td  class=hide>' + BidData[0].bidScrapSalesDetails[i].psid + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '&nbsp;<a  onclick=editShowL1Price(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"tridPrev' + i + '"\)><i class="fa fa-pencil"></i></a></td></tr>');

                        }

                    }
                }

                jQuery('#selectedvendorlistsPrev> tbody').empty()
                jQuery('#selectedvendorlistsPrevtab_0> tbody').empty()
                for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                    jQuery('#selectedvendorlistsPrev').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>');
                    jQuery('#selectedvendorlistsPrevtab_0').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                }
                jQuery('#tblparicipantslists> tbody').empty()
                for (var i = 0; i < BidData[0].BidVendorDetails.length; i++) {
                    jQuery('#tblparicipantslists').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td class=hide>' + BidData[0].bidVendorDetails[i].emailID + '</td><<td>' + BidData[0].bidVendorDetails[i].vendorName + '</td></tr>')
                }
            }
            if (BidData[0].bidDetails[0].isRunningBid == 'RunningBid' || BidData[0].bidDetails[0].isRunningBid == 'ClosedBid') {

                $("a.isDisabledClass").removeAttr("onclick");
                isRunningBid = "Y";
            }
            else if (BidData[0].bidDetails[0].isRunningBid == 'ClosedBid') {

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



}
function DownloadFile(aID) {
   
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/'+jQuery('#ddlbid').val());
}
function fnTimeUpdateS(index, seaid) {

    SeId = seaid
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Data = {
        "BidClosingType": $('#hdnClosingval').val(),
        "BidID": parseInt(jQuery('#ddlbid').val()),
        "BidDuration": parseInt(jQuery('#txtitemBidDuration' + index).val()),
        "SEID": parseInt(SeId)
    }
    // alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/UpdateBidTime/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data == "1") {
                $('#extendedDuration' + index).show()

            }
            else if (data == "-1") {
                $('#extendedDuration' + index).text("This Item is already expired.").css('color', 'red')
                $('#extendedDuration' + index).show()

            }
            setTimeout(function () { fetchallexportdetails() }, 5000)
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}

function Dateandtimevalidate(indexNo) {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/?BidDate=" + jQuery("#txtinputBidDatePrevtab_0").val() + "&BidTime=" + jQuery("#txtinputbidTimePrevtab_0").val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            if (RFQData == "1") {
                formSubmitEditEvent();
            } else {
                bootbox.alert("Date and Time should not be less than current date and time.");
                return false;
            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                bootbox.alert("you have some error. Please try again.");
            }
            return false;
            jQuery.unblockUI();
        }


    });

}

function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    if (time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    if (time.indexOf('pm') != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(am|pm)/, '');
}
function DateandtimevalidateForBidOpen(ismailsend) {
    var s = new Date();
    console.log(s)
    s.setMinutes(s.getMinutes() + 5);
    var datearray = $("#txtbidDate").val().split("/");
    var selectedtime = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    selectedtime = new Date(selectedtime + ' ' + convertTo24Hour($("#txtbidTime").val().toLowerCase()));

    if (jQuery("#txtbidTime").val() == "" || jQuery("#txtbidDate").val() == "" || jQuery("#txtBidDurationForBidOpen").val() == "") {

        erroropenbid.show();
        $('#erropenbid').html('Please fill all Details');
        erroropenbid.fadeOut(3000);
        App.scrollTo(erroropenbid, -200);

    }

    else {
        fnTimeUpdateClosedBid(ismailsend);

    }

}


function fnTimeUpdate() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Data = {
        "BidClosingType": $('#hdnClosingval').val(),
        "BidID": parseInt(jQuery('#ddlbid').val()),
        "BidDuration": parseInt(jQuery('#txtBidDurationPrev').val()),
        "SEID": 0

    }
    //alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/UpdateBidTime/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           if (data == "1") {
                $('#extendedDurationPara').show()
            }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}

function fnTimeUpdateClosedBid(isMailSend) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var Data = {
        "BidStatus":parseInt( $('#ddlBidStatus option:selected').val()),
        "BidID": parseInt(jQuery('#ddlbid').val()),
        "BidDuration": parseInt(jQuery('#txtBidDurationForBidOpen').val()),
        "BidDate": jQuery('#txtbidDate').val(),
        "BidTime": jQuery('#txtbidTime').val(),
        "IsMailSend": isMailSend,
        "FinalStatus": $('#ddlBidfinalStatus').val()
    }
    //alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/UpdateBidStatus",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

           // if (data == "1") {

                erroropenbid.hide();
                successopenbid.show();
                $('#succopenbid').html('Bid updated successfully');
                successopenbid.fadeOut(3000);
                App.scrollTo(successopenbid, -200);
           // }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                successopenbid.hide();
                erroropenbid.show();
                $('#erropenbid').html('You have error.Please try agian.');
                erroropenbid.fadeOut(3000);
                App.scrollTo(erroropenbid, -200);
            }

            return false;
            jQuery.unblockUI();
        }

    })
}

function editValues(divName, rowid) {

    showhideItemBidDuration();
    isBidEventChanged = true;

    if (divName == 'divbidTimePrevtab_0') {
        $("#divbidDatePrevtab_0").show();
        $("#btn-submit-datetime").show();
        $("#btn-submit-modal").hide();
        $("#" + divName).show();
        $("#txtinputbidTimePrevtab_0").val(jQuery("#txtbidTimePrevtab_0").html());
        $("#" + rowid).show();
        $("#txtinputBidDatePrevtab_0").val(jQuery("#txtbidDatePrevtab_0").html());
    }
    if (divName == 'divbidAttachFilePrevtab_0') {
        $("#" + divName).show();
    }
    if (divName == 'divbidTermsFilePrevtab_0') {
        $("#" + divName).show();
    }
    if (divName == 'divbidShowL1L2') {
        $("#" + divName).show();

        if (sessionStorage.getItem('hdnbidtypeid') == 7) {
            $('#div_RArank').removeClass('hide')
            $('#div_FArank').addClass('hide')
            $("#drpshowL1L2").val(jQuery("#showL1l2").text() == 'As L1, L2, L3 etc.' ? 'Y' : 'N');

        }
        else if (sessionStorage.getItem('hdnbidtypeid') == 6) {

            $('#div_FArank').removeClass('hide')
            $('#div_RArank').addClass('hide')
            $("#drpshowH1H2").val(jQuery("#showL1l2").text() == 'As H1, H2, H3 etc.' ? 'Y' : 'N');

        }

    }
    if (divName == 'divbidItemsPrevtab_0') {

        if (sessionStorage.getItem('hdnbidtypeid') == 7) {
            $('#lblshowprice').html("Show L1 Price")
            $(".RaAuctionFields").show();
            $(".faEngilshAuctionFields").hide();
            $(".fadutchAuctionFields").hide();
            $("#" + divName).show();
            $('#rowid').val(rowid.id);
            console.log(' > ', $("#" + rowid));
            $('#txtdestinationPort').val($("#" + rowid).find("td:eq(2)").text())
            $('#txtbiddescriptionP').val($("#" + rowid).find("td:eq(3)").text())

            $('#txttargetprice').val($("#" + rowid).find("td:eq(4)").text())

            $('#txtquantitiy').val($("#" + rowid).find("td:eq(5)").text())
            $('#dropuom').val($("#" + rowid).find("td:eq(6)").text())
            $('#txtUOM').val($("#" + rowid).find("td:eq(6)").text())
            $('#txtCeilingPrice').val($("#" + rowid).find("td:eq(7)").text())
            $('#checkmaskvendor').val($("#" + rowid).find("td:eq(8)").text())

            if ($('#hdnClosingval').val() == 'A') {
               
                hdnSeId = $("#" + rowid).find("td:eq(13)").text()

                $('#checkL1Price').val($("#" + rowid).find("td:eq(14)").text().trim())
                $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(15)").text().trim())
            } else {
                hdnSeId = $("#" + rowid).find("td:eq(15)").text()

                $('#checkL1Price').val($("#" + rowid).find("td:eq(16)").text().trim())
                $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(17)").text().trim())
            }
            $('#txtminimumdecreament').val($("#" + rowid).find("td:eq(9)").text())
            $("#txtselectedCurrency").val($("#dropCurrencyPrevtab_0").html());
            $('#drpdecreamenton').val($("#" + rowid).find("td:eq(11)").text())
            $('#txtlastinvoiceprice').val($("#" + rowid).find("td:eq(12)").text())
            $('#txtitembidduration').val($("#" + rowid).find("td:eq(13)").text())


        }
        else if (sessionStorage.getItem('hdnbidtypeid') == 6) {
            $(".RaAuctionFields").hide();
            $(".faEngilshAuctionFields").show();
            $("#" + divName).show();
            $('#rowid').val(rowid.id);
            console.log(' > ', $("#" + rowid));

            $('#txtshortname').val($("#" + rowid).find("td:eq(2)").text())

            $('#txttargetprice').val($("#" + rowid).find("td:eq(3)").text())

            $('#txtquantitiy').val($("#" + rowid).find("td:eq(4)").text())
            $('#dropuom').val($("#" + rowid).find("td:eq(5)").text())
            $('#txtUOM').val($("#" + rowid).find("td:eq(5)").text())
            $('#txtCeilingPrice').val($("#" + rowid).find("td:eq(6)").text())
            $('#checkmaskvendor').val($("#" + rowid).find("td:eq(7)").text())
            if ($('#hdnClosingval').val() == 81) {
                $('#lblshowprice').html("Show H1 Price")
                hdnSeId = $("#" + rowid).find("td:eq(14)").text()
                $('#txtminimumdecreament').val($("#" + rowid).find("td:eq(8)").text())
                $('#checkL1Price').val($("#" + rowid).find("td:eq(15)").text().trim())
                $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(16)").text().trim())

                $('#lblforonltfaeng').show();
                $('#RAFAEnglishonly').show();
                $('.RAFAEnglishonly').show();
                $('#BSPENG').show();
                $(".fadutchAuctionFields").hide();

            } else {

                $('#lblshowprice').html("Show L1 Price")
                hdnSeId = $("#" + rowid).find("td:eq(17)").text()
                $('#txtminimumdecreament').val($("#" + rowid).find("td:eq(14)").text())

                $('#checkL1Price').val('N');
                $(".fadutchAuctionFields").show();
                $('#lblforonltfaeng').hide();
                $('#RAFAEnglishonly').hide();
                $('.RAFAEnglishonly').hide();
                $('#BSPENG').hide();
                $(".fadutchAuctionFields").show();
            }

            $("#txtselectedCurrency").val($("#dropCurrencyPrevtab_0").html());
            $('#drpdecreamenton').val($("#" + rowid).find("td:eq(11)").text())
            $('#txtlastinvoiceprice').val($("#" + rowid).find("td:eq(12)").text())

            $('#txtpriceincreamentamount').val($("#" + rowid).find("td:eq(16)").text())
            $('#txtpricefrequency').val($("#" + rowid).find("td:eq(15)").text())



        }
    }

    $("#editValuesModal").modal('show');
}

function formSubmitEditEvent() {

    var Data = {};

    if ($("#txtinputbidTimePrevtab_0").val() != '' && $('#divbidTimePrevtab_0').is(':visible')) {
        Data = {
            "QueryString": $("#txtinputbidTimePrevtab_0").val(),
            "QueryStringDT": $("#txtinputBidDatePrevtab_0").val(),
            "valType": "BTD",
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": _bidClosingType,
            "SeId": 0,
            "DecreamentOn": ''

        }
    }

    if ($('#file1').val() != '' && $('#divbidTermsFilePrevtab_0').is(':visible')) {
        
        var filename1 = (jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1)).replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
        Data = {
            "QueryString": filename1,
            "QueryStringDT": 'NA',
            "valType": "BAT",
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": 0,
            "DecreamentOn": ''

        }
        //** Upload Files on Azure PortalDocs folder
        if ($('#file1').val() != '') {
            fnUploadFilesonAzure('file1', filename1, 'Bid/' + sessionStorage.getItem('hdnbid'));

        }
        
    }
    if ($('#drpshowL1L2').val() != '' && $('#divbidShowL1L2').is(':visible')) {

        Data = {
            "QueryString": sessionStorage.getItem('hdnbidtypeid') == 6 ? $("#drpshowH1H2").val() : $("#drpshowL1L2").val(),
            "QueryStringDT": 'NA',
            "valType": "BAL",
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": 0,
            "DecreamentOn": ''

        }
    }
    if ($('#file2').val() != '' && $('#divbidAttachFilePrevtab_0').is(':visible')) {
      
        var filename2 = (jQuery('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1)).replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
        Data = {
            "QueryString": filename2,
            "QueryStringDT": 'NA',
            "valType": "BAO",
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": 0,
            "DecreamentOn": ''

        }
        //** Upload Files on Azure PortalDocs folder
        if ($('#file1').val() != '') {
            fnUploadFilesonAzure('file2', filename2, 'Bid/' + sessionStorage.getItem('hdnbid'));

        }
        
    }
    var targetprice = 0;
    var lastinvoice = 0;
    var _Totalbiddurationfordutch = 0;
    if ($("#divbidItemsPrevtab_0").is(':visible')) {

        if ($('#txttargetprice').val() != '') {
            targetprice = $('#txttargetprice').val();
        }
        if ($('#txtlastinvoiceprice').val() != '') {
            lastinvoice = $('#txtlastinvoiceprice').val();
        }
        var upateQuery = '';
        if ($('#hdnClosingval').val() == 'A' && sessionStorage.getItem("hdnbidtypeid") == 7) {

            upateQuery = "Update PE.BidSeaExportDetails set ItemBidDuration=0,DestinationPort='" + $('#txtdestinationPort').val() + "',Targetprice=" + removeThousandSeperator(targetprice) + ",Quantity=" + removeThousandSeperator($("#txtquantitiy").val()) + ",UOM='" + $('#dropuom').val() + "',LastInvoicePrice=" + removeThousandSeperator(lastinvoice) + ",Remarks='" + $('#txtbiddescriptionP').val() + "',CeilingPrice=" + removeThousandSeperator($('#txtCeilingPrice').val()) + ",MaskVendor='" + $('#checkmaskvendor option:selected').val() + "',MinimumDecreament=" + removeThousandSeperator($('#txtminimumdecreament').val()) + ",DecreamentOn='" + $('#drpdecreamenton option:selected').val() + "',SelectedCurrency='" + $('#txtselectedCurrency').val() + "',MaskL1Price='" + $('#checkL1Price').val() + "',ShowStartPrice='" + $('#checkshowstartPrice').val() + "'  where SEID= " + hdnSeId + " and BidID = " + sessionStorage.getItem('hdnbid');  //,ClosingTime=' + $("#").val() + ',Extension=' + $("#").val() + ',NoofExtension=' + $("#").val() + ',ItemStatus=' + $("#").val(0);
        }
        if ($('#hdnClosingval').val() == 'S' && sessionStorage.getItem("hdnbidtypeid") == 7) {
            upateQuery = "Update PE.BidSeaExportDetails set ItemBidDuration=" + $("#txtitembidduration").val() + ",DestinationPort='" + $('#txtdestinationPort').val() + "',Targetprice=" + removeThousandSeperator(targetprice) + ",Quantity=" + removeThousandSeperator($("#txtquantitiy").val()) + ",UOM='" + $('#dropuom').val() + "',LastInvoicePrice=" + removeThousandSeperator(lastinvoice) + ",Remarks='" + $('#txtbiddescriptionP').val() + "',CeilingPrice=" + removeThousandSeperator($('#txtCeilingPrice').val()) + ",MaskVendor='" + $('#checkmaskvendor option:selected').val() + "',MinimumDecreament=" + removeThousandSeperator($('#txtminimumdecreament').val()) + ",DecreamentOn='" + $('#drpdecreamenton option:selected').val() + "',SelectedCurrency='" + $('#txtselectedCurrency').val() + "',MaskL1Price='" + $('#checkL1Price').val() + "',ShowStartPrice='" + $('#checkshowstartPrice').val() + "'  where SEID= " + hdnSeId + " and BidID = " + sessionStorage.getItem('hdnbid');  //,ClosingTime=' + $("#").val() + ',Extension=' + $("#").val() + ',NoofExtension=' + $("#").val() + ',ItemStatus=' + $("#").val(0);            
        }
        if (sessionStorage.getItem("hdnbidtypeid") == 6) {
            if ($('#hdnClosingval').val() == 81) {
                upateQuery = "Update PE.BidPefaDetails set ItemName='" + $('#txtshortname').val() + "',Targetprice=" + removeThousandSeperator(targetprice) + ",Quantity=" + removeThousandSeperator($("#txtquantitiy").val()) + ",MeasurementUnit='" + $('#dropuom').val() + "',LastSalePrice=" + removeThousandSeperator(lastinvoice) + ",CeilingPrice=" + removeThousandSeperator($('#txtCeilingPrice').val()) + ",MaskVendor='" + $('#checkmaskvendor option:selected').val() + "',MinimumIncreament=" + removeThousandSeperator($('#txtminimumdecreament').val()) + ",IncreamentOn='" + removeThousandSeperator($('#drpdecreamenton option:selected').val()) + "',ShowHLPrice='" + $('#checkL1Price option:selected').val() + "',ShowStartPrice='" + $('#checkshowstartPrice option:selected').val() + "'  where PSID= " + hdnSeId + " and BidID = " + sessionStorage.getItem('hdnbid');
            }
            else {
                upateQuery = "Update PE.BidPefaDetails set ItemName='" + $('#txtshortname').val() + "',Targetprice=" + removeThousandSeperator(targetprice) + ",Quantity=" + removeThousandSeperator($("#txtquantitiy").val()) + ",MeasurementUnit='" + $('#dropuom').val() + "',LastSalePrice=" + removeThousandSeperator(lastinvoice) + ",CeilingPrice=" + removeThousandSeperator($('#txtCeilingPrice').val()) + ",MaskVendor='" + $('#checkmaskvendor option:selected').val() + "',MinimumIncreament=" + 0.0 + ",StartingPrice=" + removeThousandSeperator($('#txtminimumdecreament').val()) + ",PriceReductionFrequency=" + $('#txtpricefrequency').val() + ",PriceReductionAmount=" + removeThousandSeperator($('#txtpriceincreamentamount').val()) + ",IncreamentOn='',ShowHLPrice='" + $('#checkL1Price option:selected').val() + "'  where PSID= " + hdnSeId + " and BidID = " + sessionStorage.getItem('hdnbid') + ";";
                _Totalbiddurationfordutch = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtminimumdecreament").val())) / removeThousandSeperator($("#txtpriceincreamentamount").val())) * $("#txtpricefrequency").val()) + parseInt($("#txtpricefrequency").val());
                upateQuery = upateQuery + " Update PE.Biddetails set BidDuration=" + _Totalbiddurationfordutch + " where BidID = " + sessionStorage.getItem('hdnbid')
            }
        }
        Data = {
            "QueryString": upateQuery,
            "QueryStringDT": 'NA',
            "valType": "BI",
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": parseInt(hdnSeId),
            "DecreamentOn": ''

        }
    }
    
  //   alert(JSON.stringify(Data))
    if (Data != '' || Data != null) {

        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageUpdateBidDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {
                

                if (data == 1) {
                    //if ($('#divbidAttachFilePrevtab_0').is(':visible') || $('#divbidTermsFilePrevtab_0').is(':visible')) {
                       
                    //    fnUploadFilesonAzure(filename2, sessionStorage.getItem('hdnbid'), 'Bid');
                    //}
                    if (isBidEventChanged == true) {
                        $("#btnuserConfirmation").show();
                    }
                    fetchallexportdetails();
                    setTimeout(function () {
                        $("#editValuesModal").modal("hide")
                    }, 5000)

                    $("#msgSuccessEditEvent").find("span").html('Data Successfully saved.')
                    $("#msgSuccessEditEvent").show();
                    $("#msgSuccessEditEvent").fadeOut(5000);
                }
                else {
                    $("#msgErrorEditEvent").find("span").html('You have error in saving data.Please try again.')
                    $("#msgErrorEditEvent").show();
                    $("#msgErrorEditEvent").fadeOut(5000);
                }
                
                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {

                var err = eval("(" + xhr.responseText + ")");
                if (xhr.status === 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    $("#msgErrorEditEvent").find("span").html('You have error in saving data.Please try again.')
                    $("#msgErrorEditEvent").show();
                    $("#msgErrorEditEvent").fadeOut(5000);
                }

                return false;
                jQuery.unblockUI();
            }

        });
    }
}



function showhideItemBidDuration() {
    var bidCloseType = $('#hdnClosingval').val();

    if (bidCloseType == 'A') {

        jQuery('#divItemBiduration').css('visibility', 'hidden');
        $('#txtitembidduration').prop('disabled', true)

    }
    else {

        $('#txtitembidduration').prop('disabled', false)
        $('#spanbidduration').hide()

        jQuery('#divItemBiduration').css('visibility', 'visible');
    }
}
var allUOM = '';
function FetchUOM(CustomerID) {
  
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + CustomerID,//FetchUOM
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

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
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

}

function displayUOM() {
    jQuery('#lblUOM').css('text-align', 'left');
    jQuery('#lblUOM').text('');
    if (jQuery('#dropuom').val() != '' && jQuery('#dropCurrency').val() != '') {

        var uomcaption = jQuery('#dropCurrency option:selected').text() + '/' + jQuery('#dropuom').val()
        jQuery('#lblUOM').text(uomcaption)
    }
    else {
        jQuery('#lblUOM').text('')
    }
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
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "ParamType": eventType
    }
    if (Data != '' || Data != null) {

        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/SendEmailConfirmationEditBidDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

               // if (parseInt(data) == 1) {
                    bootbox.alert("An email notification has been sent to all participants invited for the bid.", function () {
                        window.location = sessionStorage.getItem('HomePage');
                        return false;
                    });
                //} else {
                //    alert("error")
                //}

                jQuery.unblockUI();
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
    }


}
function editShowL1Price(seId, rowid) {
   
    $("#editshowL1PriceModal").modal('show');
    $("#hdnshowL1Price").val(seId);
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        if ($('#hdnClosingval').val() == "S") {
            var flag = $("#" + rowid).find("td:eq(16)").text().trim()
        }
        else {
            var flag = $("#" + rowid).find("td:eq(14)").text().trim()
        }

    }
    else {
        if ($('#hdnauctiontype').val() == 81) {
            var flag = $("#" + rowid).find("td:eq(15)").text().trim()
        }
        else {
            var flag = $("#" + rowid).find("td:eq(18)").text().trim()
        }
    }
    $('#maskL1Pricetab_0').val(flag)

}
function editShowStartPrice(seId, rowid) {

    $("#editshowStartPriceModal").modal('show');
    $("#hdnshowStartPrice").val(seId);
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        if ($('#hdnClosingval').val() == "S") {
            var flag = $("#" + rowid).find("td:eq(17)").text().trim()
        }
        else {
            var flag = $("#" + rowid).find("td:eq(15)").text().trim()
        }

    }
    else {
        if ($('#hdnauctiontype').val() == 81) {
            var flag = $("#" + rowid).find("td:eq(16)").text().trim()
        }

    }
    $('#maskStartPricetab_0').val(flag)

}
function editbidstartprice(seId, rowid) {
   
    $("#hddnbidstartprice").val(seId);
    $("#txtbidstartpricetab_0").val($.trim($("#" + rowid).find("td:eq(7)").text()))
    $("#editbidstartprice").modal('show');
}
function editbidstartpriceFA(psid, rowid) {
    $("#hddnbidstartprice").val(psid);
    $("#txtbidstartpricetab_0").val($.trim($("#" + rowid).find("td:eq(6)").text()))
    $("#editbidstartprice").modal('show');
}
function editMinDecreament(seId, rowid) {
    $("#hddnSeIdForMinDecreament").val(seId);
    $('#drpdecreamentontab_0').val($("#" + rowid).find("td:eq(11)").text())
    $("#txtminimumdecreamenttab_0").val($.trim($("#" + rowid).find("td:eq(9)").text()))
    $("#editMinDecreamentModal").modal('show');
}
function editincreament(psid, rowid) {
    $("#hddnPSForMinIncreament").val(psid);
    $('#drpincreamentontab_0').val($("#" + rowid).find("td:eq(11)").text())
    $("#txtminimumincreamenttab_0").val($.trim($("#" + rowid).find("td:eq(8)").text()))
    $("#editMinincreamentModal").modal('show');

}
var error1 = $('#msgErrorEditEventFA')
function updMinIncreament() {

    if ((parseInt($('#txtminimumincreamenttab_0').val()) > parseInt(20) && $("#drpincreamentontab_0 option:selected").val() == "P")) {

        error1.find("span").html('Minimum increament should be less than 20%.');
        error1.show();
        Metronic.scrollTo(error1, -200);
        error1.fadeOut(3000);
        return false;

    }
    var Data = {
        "QueryString": removeThousandSeperator($("#txtminimumincreamenttab_0").val()),
        "QueryStringDT": 'NA',
        "valType": "BMIPE",
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "BidClosingType": 'NA',
        "SeId": parseInt($("#hddnPSForMinIncreament").val()),
        "DecreamentOn": $("#drpincreamentontab_0 option:selected").val()

    }

    if (Data != '' || Data != null) {
        // alert(JSON.stringify(Data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageUpdateBidDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                if (parseInt(data) == 1) {

                    if (isBidEventChanged == true) {
                        $("#btnuserConfirmation").show();
                    }
                    fetchallexportdetails();
                    $("#editMinincreamentModal").modal("hide")

                } else {
                    // alert("error vickrant")
                }

                jQuery.unblockUI();
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
    }
}

var error = $('#msgErrorEditEvent');

function updMinDecreament() {

    if ((parseInt($('#txtminimumdecreamenttab_0').val()) > parseInt(20) && $("#drpdecreamentontab_0 option:selected").val() == "P")) {

        error.find("span").html('Minimum decrement should be less than 20%.');
        error.show();
        Metronic.scrollTo(error, -200);
        error.fadeOut(3000);
        return false;

    }
    var Data = {
        "QueryString": removeThousandSeperator($("#txtminimumdecreamenttab_0").val()),
        "QueryStringDT": 'NA',
        "valType": "BMD",
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "BidClosingType": 'NA',
        "SeId": parseInt($("#hddnSeIdForMinDecreament").val()),
        "DecreamentOn": $("#drpdecreamentontab_0 option:selected").val()

    }

    if (Data != '' || Data != null) {
        // alert(JSON.stringify(Data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageUpdateBidDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                if (data == "1") {

                    if (isBidEventChanged == true) {
                        $("#btnuserConfirmation").show();
                    }
                    fetchallexportdetails();
                    $("#editMinDecreamentModal").modal("hide")

                } else {
                    alert("error vickrant")
                }

                jQuery.unblockUI();
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
    }
}
var error2 = $('#msgErrorL1');
function UpdShowL1Price() {
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        var valtype = "RAL1";
    }
    else {
        var valtype = "FAL1";
    }
    var Data = {
        "QueryString": $("#maskL1Pricetab_0").val(),
        "QueryStringDT": 'NA',
        "valType": valtype,
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "BidClosingType": 'NA',
        "SeId": parseInt($("#hdnshowL1Price").val()),
        "DecreamentOn": ''

    }

    if (Data != '' || Data != null) {
        //   alert(JSON.stringify(Data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageUpdateBidDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                if (data == "1") {

                    if (isBidEventChanged == true) {
                        $("#btnuserConfirmation").show();
                    }
                    fetchallexportdetails();
                    $("#editshowL1PriceModal").modal("hide")

                } else {

                }

                jQuery.unblockUI();
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
    }
}

var errorStart = $('#msgErrorStart');
function UpdShowStartPrice() {
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        var valtype = "RAStartP";
    }
    else {
        var valtype = "FAStartP";
    }
    var Data = {
        "QueryString": $("#maskStartPricetab_0").val(),
        "QueryStringDT": 'NA',
        "valType": valtype,
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "BidClosingType": 'NA',
        "SeId": parseInt($("#hdnshowStartPrice").val()),
        "DecreamentOn": ''

    }

    if (Data != '' || Data != null) {
        //   alert(JSON.stringify(Data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageUpdateBidDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                if (data == 1) {

                    if (isBidEventChanged == true) {
                        $("#btnuserConfirmation").show();
                    }
                    fetchallexportdetails();
                    $("#editshowStartPriceModal").modal("hide")

                } else {

                }

                jQuery.unblockUI();
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
    }
}
var errorStart = $('#msgErrorStart');
var errorBSP = $('#msgErrorEditEventBP');
function updBidStartPrice() {
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        var valtype = "BSPRA";
    }
    else {
        var valtype = "BSPFA";
    }

    var Data = {
        "QueryString": removeThousandSeperator($("#txtbidstartpricetab_0").val()),
        "QueryStringDT": 'NA',
        "valType": valtype,
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "BidClosingType": 'NA',
        "SeId": parseInt($("#hddnbidstartprice").val()),
        "DecreamentOn": ''
    }

    if (Data != '' || Data != null) {
        // alert(JSON.stringify(Data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageUpdateBidDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                if (data == "1") {
                    if (isBidEventChanged == true) {
                        $("#btnuserConfirmation").show();
                    }
                    fetchallexportdetails();
                    $("#editbidstartprice").modal("hide")

                }
                else {
                    alert("error vickrant")
                }

                jQuery.unblockUI();
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
    }
}

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

    var Data = {
        "Name": $("#bidSurrogateToName").val(),
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "EmailId": $("#bidSurrogateToEmail").val(),
        "Reason": $("#bidSurrogateReason").val(),
        "vendorEmailId": sessionStorage.getItem("hdnselectedEmail"),
        "vendorID": parseInt(sessionStorage.getItem("hdnselectedvendor")),
        "EncryptedLink": "BidID=" + sessionStorage.getItem('hdnbid')
    }
    // alert(JSON.stringify(Data))
    if (Data != '' || Data != null) {

        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "RegisterParticipants/BidSurrogateSave",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                //if (parseInt(data) == 1) {
                    success1.show();
                    $('#spansuccess1').html("Data Successfully saved");
                    success1.fadeOut(6000);
                    App.scrollTo(success1, -200);
                    clearSurrogateForm();
              //  }
               
                jQuery.unblockUI();
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
    }
}

function clearSurrogateForm() {
    $('#bidSurrogateToName').val('')
    $('#bidSurrogateToEmail').val('')
    $('#bidSurrogateReason').val('')
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
    jQuery("#txtvendorSurrogateBid").val('')
    $(".surrogateFormElements").hide();
}
function fetchItemsforPreBidPrices(BidID, BidTypeID, BidForID) {
    var flagEditbtn = "N";
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidPrePricesDetails/?BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&BidForID=" + BidForID,
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
           
            var pullRFQ = 0;
            $('#tblprebidvendors').empty();
            $('#tblprebidvendors').append("<thead><tr><th style='width:30%'>Vendor</th><th style='width:50%'>Item/Services</th><th style='width:20%'>Pre-Bid Price</th></tr>")
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].price != 0) {
                        flagEditbtn = "Y";
                    }
                    pullRFQ = data[0].pullRFQID;
                    
                  
                    $('#tblprebidvendors').append("<tr><td class=hide>" + data[i].vendorID + "</td><td class=hide>" + data[i].seid + "</td><td class=hide>" + data[i].advFactor + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].destinationPort + "</td><td><input type=tel onkeyup='thousands_separators_input(this)' number='true' class='form-control text-right clsisdisabled' id='txtpreprice" + i + "' name='txtpreprice" + i + "' value=" + (data[i].price == 0 ? '' : data[i].price) + " ></input></td></tr>")
                    
                    for (var j = i+1; j < data.length; j++) {
                        if (data[i].vendorID == data[j].vendorID) {
                            if (data[j].price != 0) {
                                flagEditbtn = "Y";
                            }
                            $('#tblprebidvendors').append("<tr><td class=hide>" + data[j].vendorID + "</td><td class=hide>" + data[j].seid + "</td><td class=hide>" + data[j].advFactor + "</td><td></td><td>" + data[j].destinationPort + "</td><td><input type=tel number='true' onkeyup='thousands_separators_input(this)' class='form-control text-right clsisdisabled' id='txtpreprice" + j + "' name='txtpreprice" + j + "' value=" + (data[j].price == 0 ? '' : data[j].price) + " ></input></td></tr>")
                            i = j;
                            
                        }
                        
                    }
                    
                }
              
                if (flagEditbtn == "Y") {
                    $('#btnprebid').text("Edit")
                    $('#btnprebid').removeClass("green")
                    $('#btnprebid').addClass("yellow")
                }
                else {
                    $('#btnprebid').text("Submit")
                    $('#btnprebid').addClass("green")
                    $('#btnprebid').removeClass("yellow")
                }
                if (pullRFQ == 0) {
                    clsisdisabled = ''
                    $('#btnprebid').removeClass('hide');
                }
                else {
                    errorprebid.show();
                    $('#errpre').html('Bid is pulled from RFQ.So can not do Pre Pricing.');
                    clsisdisabled = 'disabled'
                    $('#btnprebid').addClass('hide');
                }

                if (isRunningBid == "Y") {
                    $('.clsisdisabled').attr('disabled', true)
                    $('#btnprebid').addClass('hide');
                }
                
            }

        }
    });
}
function submitprebidprice() {
    if (sessionStorage.getItem("hdnbidtypeid") == 7) {
        fnsubmitRAPrePrices()
    }
    else {
        fnsubmitFAPrePrices()
    }
}
var HeaderQuery = "";
function fnsubmitRAPrePrices() {
   
    var DetailQuery = "";
    var singleQuery = "";
    var quote = 0;
    HeaderQuery = '';
    $("#tblprebidvendors tr:gt(0)").each(function () {
        var this_row = $(this);
        quote = $.trim(this_row.find('td:eq(5) input[type="tel"]').val())
        
        if (quote != "" && quote != "0") {
            singleQuery = "";
            
            singleQuery = $.trim(this_row.find('td:eq(1)').html()) + '~' + removeThousandSeperator(quote) ;
           // singleQuery = 'insert into PE.VendorSeaExportParticipationDetails(SEHeaderID,BidID,SubmissionTime,VendorID,seid,QuotedPrice) values(0,'
           // singleQuery = singleQuery + sessionStorage.getItem('hdnbid') + ",[PE].FN_Now()," + $.trim(this_row.find('td:eq(0)').html()) + "," + $.trim(this_row.find('td:eq(1)').html()) + "," + removeThousandSeperator(quote) + ")";

            HeaderQuery = HeaderQuery + 'exec PE.BidParticipationInsUpdSeaExport ';
            HeaderQuery = HeaderQuery + $.trim(this_row.find('td:eq(0)').html()) + "," + sessionStorage.getItem('hdnbid') + ",'" + singleQuery + "'," + $.trim(this_row.find('td:eq(0)').html()) + "," + removeThousandSeperator(quote) + "," + $.trim(this_row.find('td:eq(1)').html()) + "," + $.trim(this_row.find('td:eq(2)').html()) + ",'M' ; "
        }
    })
   
    var Data = {
        "DetailQuery": DetailQuery,
        "HeaderDetails": HeaderQuery,
        "BidID": parseInt(sessionStorage.getItem('hdnbid')),
        "UserID": sessionStorage.getItem('UserID'),
        "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
    };
   // alert(JSON.stringify(Data))
   
 jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/insPreBidPricing/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Data),
        dataType: "json",
        success: function (data) {
            //alert(data[0].isSuccess);
         if (data == "1") {
                successprebid.show();
                $('#succpreprice').html('Pre-Bid Prices updated successfully..');
                successprebid.fadeOut(5000);
                fetchItemsforPreBidPrices(sessionStorage.getItem('hdnbid'), sessionStorage.getItem("hdnbidtypeid") ,sessionStorage.getItem('hdbbidForID'));
            }
            else {
                errorprebid.show();
                $('#errpre').html('You have some error.Please try again');
                errorprebid.fadeOut(5000);
            }
            jQuery.unblockUI();
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
}
function fnsubmitFAPrePrices() {
    HeaderQuery = '';
    $("#tblprebidvendors tr:gt(0)").each(function () {
        var this_row = $(this);
        
        quote = $.trim(this_row.find('td:eq(5) input[type="tel"]').val())
        
        if (quote != "" && quote != "0") {
            HeaderQuery = HeaderQuery + 'exec ParticipationScrapSaleSingleItem ';
            HeaderQuery = HeaderQuery + $.trim(this_row.find('td:eq(0)').html()) + "," + sessionStorage.getItem('hdnbid') + "," + removeThousandSeperator(quote) + "," + $.trim(this_row.find('td:eq(1)').html()) + "," + $.trim(this_row.find('td:eq(0)').html()) + " ; "
        }
    })
    //console.log(HeaderQuery)
    var Data = {
        "DetailQuery": '',
        "HeaderDetails": HeaderQuery,
        "BidID": parseInt(sessionStorage.getItem('hdnbid')),
        "UserID": sessionStorage.getItem('UserID'),
        "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
    };
   // alert(JSON.stringify(Data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/insPreBidPricing/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Data),
        dataType: "json",
        success: function (data) {
            //alert(data[0].isSuccess);
            if (parseInt(data) == 1) {
                successprebid.show();
                $('#succpreprice').html('Pre-Bid Prices updated successfully..');
                successprebid.fadeOut(5000);
                fetchItemsforPreBidPrices(sessionStorage.getItem('hdnbid'), sessionStorage.getItem("hdnbidtypeid"), sessionStorage.getItem('hdbbidForID'));
            }
            else {
                errorprebid.show();
                $('#errpre').html('You have some error.Please try again');
                errorprebid.fadeOut(5000);
            }
            jQuery.unblockUI();
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
}
