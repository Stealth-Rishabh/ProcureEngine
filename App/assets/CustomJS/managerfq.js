var APIPath = sessionStorage.getItem("APIPath");
clearsession()
formValidation();


var error1 = $('.alert-danger');
var success1 = $('.alert-success');
var error2 = $('#errormapdiv');
var erroropenbid = $('#errorOpenbid');
var errorremainder = $('#errorsendremainder');
var success2 = $('#successmapdiv');
var successopenbid = $('#successopenbid');
var succesremainder = $('#successremainder');

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
           
            ExtendDuration();
        }
    });

}




function fetchRFIRFQSubjectforReport() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "RFI_RFQReport/OpenRFQ/?Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
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
        error: function (result) {
          
            jQuery.unblockUI();

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
            map[username.RFIRFQSubject] = username;
            usernames.push(username.RFIRFQSubject);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].RfiRfqID != "0") {
            sessionStorage.setItem('hdnrfqid', map[item].RfiRfqID);
                    jQuery("#divresetpassword").show();
                    FetchRFQVersion(map[item].RfiRfqID);
                    fetchInvitedVendorList(map[item].RfiRfqID)
                    FetchVenderNotInvited(map[item].RfiRfqID)

                    setTimeout(function () {
                        FetchVendorNotsubmittedQuotesPassreset(map[item].RfiRfqID)
                        FetchVendorsubmittedQuotes(map[item].RfiRfqID)
                    }, 500)
                    $('#ddlrfq').val(map[item].RfiRfqID)
                    $('#hdnDeadline').val(map[item].RFQDeadline)
                    $('#deadlineModal').text(map[item].RFQDeadline)
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

function FetchRFQVersion(RFQID) {
  

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/fetchRFQVersions/?RFQID=" + RFQID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $("#ddlrfqVersion").empty();
           
            if (data.length > 0) {
                
                $('#ddlrfqVersion').append(jQuery('<option ></option>').val(data[0].RFQVersionId).html(parseInt(data[0].RFQVersionId)+1));
                
            }

        }, error: function () {

        }
    });

}
function fetchInvitedVendorList(rfqid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "RFI_RFQReport/RFQVendorList/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + rfqid + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&Version=0" + "&Flag=Invited",
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
        error: function (result) {

            jQuery.unblockUI();

        }
    })

}
function FetchVenderNotInvited(rfqid) {
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "RFI_RFQReport/RFQVendorList/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + rfqid + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&Version=0" + "&Flag=NOTInvited",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#tblvendorlist > tbody").empty();
            if (data.length > 0) {
                $('#inviteVendorBody').show();
                for (var i = 0; i < data.length; i++) {
                    var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input class=\"chkboxwithval\"  type=\"checkbox\" Onclick=\"Check(this)\"; id=\"chkvender\" value=" + (data[i].VendorID + ',' + data[i].EmailID) + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].VendorName +' ' +"(" + data[i].EmailID + ")</td></tr>";
                    jQuery('#tblvendorlist > tbody').append(str);
                }
            }
            else {
                $('#inviteVendorBody').hide();
            }


        }
    });
}
sessionStorage.setItem('hdnAllRFQInvitedVendorNotSubmitQ', '');
function FetchVendorNotsubmittedQuotesPassreset(rfqid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "RFI_RFQReport/RFQVendorList/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + rfqid + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&Version=" + $('#ddlrfqVersion').val() + "&Flag=NotCloseQuot",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
           
            if (data.length > 0) {
                sessionStorage.setItem('hdnAllRFQInvitedVendorNotSubmitQ', JSON.stringify(data));
            }
            else {
                sessionStorage.setItem('hdnAllRFQInvitedVendorNotSubmitQ', '');
            }
            jQuery('#tblparicipantslists> tbody').empty()
          
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    jQuery('#tblparicipantslists').append('<tr><td class=hide>' + data[i].VendorID + '</td><td class=hide>' + data[i].EmailID + '</td><td>' + data[i].VendorName + ' ' + ' ( ' + data[i].EmailID + ' ) </td></tr>')
                }
               
            }
            jQuery.unblockUI();
        },
        error: function (result) {

            jQuery.unblockUI();

        }
    })
}

jQuery("#txtvendor").keyup(function () {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
});

jQuery("#txtvendor").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllRFQInvitedVendorNotSubmitQ');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.VendorName] = username;
            usernames.push(username.VendorName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].VendorID != "0") {

            sessionStorage.setItem('hdnselectedvendor', map[item].VendorID);
            sessionStorage.setItem('hdnselectedEmail', map[item].EmailID);

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
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
        var data = {
            "VendorEmail": sessionStorage.getItem("hdnselectedEmail"),
            "RFQID": sessionStorage.getItem("hdnrfqid"),
            "VendorID": sessionStorage.getItem("hdnselectedvendor"),
            "UserId": sessionStorage.getItem("UserID")

        }
        // alert(JSON.stringify(data))
        jQuery.ajax({
            url: APIPath + "RFI_RFQReport/ResetPasswordRFQ",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                if (data[0].RFQStatus = "1") {
                    success1.show();
                    $('#spansuccess1').html('New password is sent to registered email of vendor..');
                    clearsession();
                    success1.fadeOut(6000);
                    App.scrollTo(success1, -200);
                    jQuery.unblockUI();
                }
            }
        });
    }


}
function FetchVendorsubmittedQuotes(rfqid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "RFI_RFQReport/RFQVendorList/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&RFQID=" + rfqid + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&Version=" + $('#ddlrfqVersion').val() + "&Flag=CloseQuot",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#tblSubmittedquotesvendor> tbody').empty()
            // alert(data.length)
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypesQT\"><span  id=\"spancheckedQT\"><input class=\"chkboxwithval\"  type=\"checkbox\" Onclick=\"CheckQT(this)\"; id=\"chkvenderQT\" value=" + (data[i].VendorID + ',' + data[i].EmailID) + " style=\"cursor:pointer\" name=\"chkvenderQT\"/></span></div></td><td> " + data[i].VendorName + ' '+"(" + data[i].EmailID + ")</td></tr>";
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
        error: function (result) {

            jQuery.unblockUI();

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
                checkedValue = checkedValue + " select  " + sessionStorage.getItem("hdnrfqid") + ",'" + temp[1] + "','N'," + temp[0] + "  union";
             }
        });
       
        if (checkedValue != '') {
            checkedValue = 'insert into #temp(RFQID,EmailId,MailSent,VendorID) ' + checkedValue
            checkedValue = checkedValue.substring(0, checkedValue.length - 6);
        }

        var data = {
            "QueryString": checkedValue,
            "RFQID": sessionStorage.getItem("hdnrfqid"),
            "VersionID": $('#ddlrfqVersion').val(),
            "UserID": sessionStorage.getItem("UserID")
        }
        //alert(JSON.stringify(data))
        jQuery.ajax({
            url: APIPath + "RFI_RFQReport/OpenQuotesOfSelectedVendor",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                
                if (data[0].IsSuccess == "1") {
                    success1.show();
                    $('#spansuccess1').html("Quotes has been opened Successfully..'");
                    success1.fadeOut(6000);
                    App.scrollTo(success1, -200);
                    FetchVendorsubmittedQuotes(sessionStorage.getItem("hdnrfqid"));
                    clearsession();
                    jQuery.unblockUI();
                    return true;
                }
            },

            error: function (result) {
               
                jQuery.unblockUI();
            }
        });

        
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
        var temp = new Array();
        $("#tblparicipantslists> tbody > tr").each(function (index) {
           
            vemail = $(this).find("td").eq(1).html();
            vid = $(this).find("td").eq(0).html();
            checkedValue = checkedValue + " select  " + sessionStorage.getItem("hdnrfqid") + ",'" + vemail + "','N','" + vid + "'  union";
           
        });
        if (checkedValue != '') {
            checkedValue = 'insert into #temp(RFQID,EmailId,MailSent,VendorID) ' + checkedValue
            checkedValue = checkedValue.substring(0, checkedValue.length - 6);
        }

        var data = {
            "QueryString": checkedValue,
            "RFQID": sessionStorage.getItem("hdnrfqid"),
            "UserID": sessionStorage.getItem("UserID")
        }
       
        jQuery.ajax({
            url: APIPath + "ResetInviteVendor/SendRemainderToParticipantRQ",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
               
                if (data[0].Flag == "1") {
                    errorremainder.hide();
                    succesremainder.show();
                    $('#succrem').html('Reminder has been sent Successfully..');

                    clearsession();

                    succesremainder.fadeOut(3000);
                    App.scrollTo(succesremainder, -200);
                    jQuery.unblockUI();
                }
            },

            error: function (result) {
                alert('error')
                jQuery.unblockUI();
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
    else if (ValidateVendor() == 'false') {
        jQuery.unblockUI();
        return false;

    }
    else {
        var checkedValue = '';
        var temp = new Array();
        $("#tblvendorlist> tbody > tr").each(function (index) {
            if ($(this).find("span#spanchecked").attr('class') == 'checked') {
                temp = ($(this).find("#chkvender").val()).split(",");

               
                checkedValue = checkedValue + " select " + sessionStorage.getItem("hdnrfqid") + "," + temp[0] + ",'',dbo.Decrypt('" + sessionStorage.getItem("UserID") + "'),"+temp[0]+",'RFQVendor.html?RFQID=" + sessionStorage.getItem("hdnrfqid") + "','N'," + sessionStorage.getItem('CustomerID') + ",getdate() union all "; //(convert(nvarchar(11),b.RFQClosureDate,103 )
            }
        });
        if (checkedValue != '') {
            checkedValue = "Insert into ActivityDetails(RFQId,VendorId,ActivityDescription,FromUserId,ToUserId,LinkURL,Status,CustomerID,ReceiptDt)" + checkedValue;
            checkedValue = checkedValue.substring(0, checkedValue.length - 11);
        }

        var data = {
            "BidVendors": checkedValue,
            "RFQId": sessionStorage.getItem("hdnrfqid"),
            "UserID": sessionStorage.getItem('UserID'),
            "subject": '',
            "Deadline": '',
            "RFQDescription": ''
        }
      // alert(JSON.stringify(data))
        jQuery.ajax({
            url: APIPath + "RequestForQuotation/GetRFQInviteVendorAfterOpen/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                if (data[0].RFQId > 0) {
                    success1.show();
                    $('#spansuccess1').html('Vendor Invited Successfully..');
                    FetchVenderNotInvited(sessionStorage.getItem("hdnrfqid"))
                    fetchInvitedVendorList(sessionStorage.getItem("hdnrfqid"))
                    FetchVendorNotsubmittedQuotesPassreset(sessionStorage.getItem("hdnrfqid"))
                    clearsession()


                    success1.fadeOut(3000);
                    App.scrollTo(success1, -200);
                    jQuery.unblockUI();
                }
            }
        });

        return true;
    }
}

function ExtendDuration() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var BidData = '';
   
        BidData = {
            "RFQID": sessionStorage.getItem("hdnrfqid"),
            "RFIID": 0,
            "RFQRFIID": 'RFQ-'+sessionStorage.getItem("hdnrfqid"),
            "ExtendedDate": $("#txtextendDate").val(),
            "ExtendedBy": sessionStorage.getItem('UserID')

        }
   
   

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/ExtendRFQRFIDeadline/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function (data) {
            if (data[0].IsSuccess == '1') {
                $('#deadlineModal').text($("#txtextendDate").val())
               
                
                success1.show();
                $('#spansuccess1').html("Date extended successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                $("#txtextendDate").val('');
                jQuery.unblockUI();
                return true;

                }

        },
        error: function (result) {
            //alert('error')
            jQuery.unblockUI();
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







