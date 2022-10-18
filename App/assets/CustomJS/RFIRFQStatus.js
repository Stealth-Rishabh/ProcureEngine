
var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)
var rqid = getUrlVarsURL(decryptedstring)["RQID"];


var rqtype;
if (rqid.substring(0, 3) != 'RFX') {
    rqtype = rqid.substring(0, 2);
}
else {
   rqtype = rqid.substring(0, 3);
}

var vqRfiID;
if (rqtype != 'RFX') {
    vqRfiID = rqid.substring(3, 6);
   
}
else {
    vqRfiID = rqid.substring(4, 10);
    
}

function dynamicChanges() {
     if (rqtype == 'VQ') {
        $('#portlet_caption').html('<i class="fa fa-reorder"></i> VQ Invited Vendors');
        $('#btn_cancl_rfirfq').html('Cancel VQ');
    } else if (rqtype == 'RFX') {
        $('#portlet_caption').html('<i class="fa fa-reorder"></i> RFI Invited Vendors');
        $('#btn_cancl_rfirfq').html('Cancel RFI');
    }
}

function FetchInvitedVendorsForRFIRFQ() {
    //alert(sessionStorage.getItem("APIPath") + "RFI_RFQReport/FetchInvitedVendorsForRFIRFQ/?RFIRFQID=" + $('#hddn_RQID_txt').val() + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + '&CustomerID=' + sessionStorage.getItem('CustomerID'))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/FetchInvitedVendorsForRFIRFQ/?RFIRFQID=" + $('#hddn_RQID_txt').val() + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + '&CustomerID=' + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {

            if (data.length > 0) {
                $('#tblVendorSummary tbody').empty();
                $('#displayTable').show();
               
                 if (rqtype == 'VQ') {
                    jQuery('#lbl_configuredBy').html("VQ Configured By: " + data[0].configuredByName);
                } else if (rqtype == 'RFX') {
                    jQuery('#lbl_configuredBy').html("RFI Configured By: " + data[0].configuredByName);
                }
                alert(data[0].rQSubject )
                $('#rq_subject').html('<b>' + data[0].rQSubject + '</b>');
                $('#rq_deadline').html(data[0].deadline);
                $('#rq_description').html(data[0].rQDescription);
                $("#deadlineModal").html(data[0].deadline);
                for (var i = 0; i < data.length; i++) {
                    $('#tblVendorSummary').append(jQuery('<tr><td class="hide">' + data[i].vendorID + '</td><td>' + data[i].vendorName + ' ( ' + data[i].contactPerson + ' , ' + data[i].vendorEmail + ' , ' + data[i].phoneNo + ' )</td><td>' + data[i].rQStatus + '</td><td>' + data[i].responseDTTime + '</td></tr>')); //<td>' + data[i].ResponseDate + ' - ' + data[i].ResponseTime + '</td>
                }
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


function CancelRFIRFQ(MailPermit) {
    var Data = {

        "RFIRFQID": $('#hddn_RQID_txt').val(),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "MailParam": MailPermit,
        "RQSubj": $('#rq_subject').html(),
        "RQDescription": $('#rq_description').html().replace(/'/g, " "),
        "RQDeadLin": $('#rq_deadline').html()

    };
    //alert(JSON.stringify(Data))

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/cancelInvitedRFQRFI/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,

        async: false,

        data: JSON.stringify(Data),

        dataType: "json",

        success: function(data) {
        
        bootbox.alert(rqtype+" cancelled successfully.", function() {
        window.location = sessionStorage.getItem('HomePage');
            return false;
        });
            
            

        },
        
        error: function(jqXHR, exception) {
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Error connecting server. Please retry.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                jQuery.unblockUI();
                bootbox.alert(msg);
            }
            return false;
        }

    });
    jQuery.unblockUI();

}

$('#btn_cancl_rfirfq').click(function() {

bootbox.dialog({
message: "Do you want to send email to vendors regarding this cancellation?",
   // title: "Custom title",
    buttons: {
        confirm: {
            label: "Yes",
            className: "btn-success",
            callback: function() {
                CancelRFIRFQ('SendMail')
            }
        },
        cancel: {
            label: "No",
            className: "btn-warning",
            callback: function() {
             CancelRFIRFQ('NoMail')
            }
        }
    }
});

});

$('#ext_btn').click(function() {
    window.location = sessionStorage.getItem('HomePage');
});

// for Extend date

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
    invalidHandler: function(event, validator) { //display error alert on form submit   

    },

    highlight: function(element) { // hightlight error inputs
        $(element).closest('.col-md-6').addClass('has-error'); // set error class to the control group


    },
    unhighlight: function(element) { // revert the change done by hightlight
        $(element).closest('.col-md-6').removeClass('has-error'); // set error class to the control group

    },
    errorPlacement: function(error, element) {

        if (element.attr("name") == "txtextendDate") {

            error.insertAfter("#daterr");

        }
        else {

            error.insertAfter(element);
        }
    },

    success: function(label) {
        label.closest('.col-md-6').removeClass('has-error');

        label.remove();
    },


    submitHandler: function(form) {
        ExtendDuration();
    }
});

}

function ExtendDuration() {
    var BidData = '';
    if (rqtype == 'RFQ') {
        BidData = {

            "RFQID": parseInt(vqRfiID),
            "RFIID": 0,
            "vqRfiID": $("#hddn_RQID_txt").val(),
            "ExtendedDate": $("#txtextendDate").val(),
            "ExtendedBy": sessionStorage.getItem('UserID')

        }
    } else {
        BidData = {

            "RFQID": 0,
            "RFIID": parseInt(vqRfiID),
            "vqRfiID": $("#hddn_RQID_txt").val(),
            "ExtendedDate": $("#txtextendDate").val(),
            "ExtendedBy": sessionStorage.getItem('UserID')

        }
    }

  //  alert(JSON.stringify(BidData));

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/ExtendRFQRFIDeadline/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function(data) {
            if (data == '1') {
                $("#extendDate").modal("hide");
                $("#txtextendDate").val('');
                bootbox.alert("Date extended successfully.", function() {
                    FetchInvitedVendorsForRFIRFQ();
                    
                });

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