

param = getUrlVars()["param"]
decryptedstring = fndecrypt(param)
var RFQID = getUrlVarsURL(decryptedstring)["RFQID"]

function FetchInvitedVendorsForeRFQ() {
   
    jQuery.ajax({
        //url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchInvitedVendors/?RFQID=" + RFQID + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + '&CustomerID=' + sessionStorage.getItem('CustomerID'),
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchInvitedVendors/?RFQID=" + RFQID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {
                if (data.length > 0) {
                $('#tblVendorSummary tbody').empty();
                $('#displayTable').show();
                jQuery('#lbl_configuredBy').html("RFQ Configured By: " + data[0].configuredByName);
            
                $('#rq_subject').html('<b>' + data[0].rqSubject + '</b>');
               $('#rq_deadline').html(fnConverToLocalTime(data[0].deadline))
                $('#rq_STdate').html(fnConverToLocalTime(data[0].rfqStartDate))

               
              //  $('#rq_deadline').html(data[0].deadline);
                $('#rq_description').html(data[0].rqDescription);
                $("#deadlineModal").html(fnConverToLocalTime(data[0].deadline));
              
                for (var i = 0; i < data.length; i++) {
                   
                    $('#tblVendorSummary').append(jQuery('<tr><td class="hide">' + data[i].vendorID + '</td><td>' + data[i].vendorName + ' ( ' + data[i].contactPerson + ' , ' + data[i].vendorEmail + ' , ' + data[i].phoneNo + ' )</td><td>' + data[i].rqStatus + '</td><td>' + fnConverToLocalTime(data[i].responseDate) + '</td><td class=hide>' + data[i].vendorEmail + '</td></tr>')); //<td>' + data[i].ResponseDate + ' - ' + data[i].ResponseTime + '</td>
                    if (data[i].rqStatus.toLowerCase() != 'close' && data[i].rqStatus.toLowerCase != 'regretted') {
                        $('#send_remainder').removeClass('hide')
                    }
                }
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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
var errorremainder = $('#errorsendremainder');
var succesremainder = $('#successremainder');
function sendremainderstoparicipants() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
        var checkedValue = '';
    var temp = new Array();
  
        $("#tblVendorSummary> tbody > tr").each(function (index) {

            vemail = $(this).find("td").eq(4).html();
            vid = $(this).find("td").eq(0).html();
            if($(this).find("td").eq(2).html().toLowerCase()!='close' &&  $(this).find("td").eq(2).html().toLowerCase()!='regretted'){
                checkedValue = checkedValue + vid + '#';
            }
            
        });
        
    
        var data = {
            "QueryString": checkedValue,
            "RFQID": parseInt(RFQID),
            "UserID": sessionStorage.getItem("UserID")
        }
      console.log(checkedValue)
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "eRFQReport/SendRemainderToParticipanteRFQ",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
              
                    errorremainder.hide();
                    succesremainder.show();
                    $('#success').html('Reminder has been sent Successfully..');
                    succesremainder.fadeOut(3000);
                   
                    jQuery.unblockUI();
               
            },
            error: function (xhr, status, error) {
              
                var err = xhr.responseText;// eval("(" + xhr.responseText + ")");
              
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

        return true;
    
}
function CancelRFIRFQ(MailPermit) {
    var Data = {

        "RFQID": parseInt(RFQID),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "MailParam": MailPermit,
        "RQSubj": $('#rq_subject').html(),
        "RQDescription": $('#rq_description').html().replace(/'/g, " "),
        "RQDeadLin": $('#rq_deadline').html()

    };
   // alert(JSON.stringify(Data))
    //console.log(JSON.stringify(Data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/ecancelRFQ/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        crossDomain: true,

        async: false,

        data: JSON.stringify(Data),

        dataType: "json",

        success: function(data) {
        
        bootbox.alert("RFQ cancelled successfully.", function() {
        window.location = sessionStorage.getItem('HomePage');
            return false;
        });
            
            

        },
        error: function(jqXHR, exception) {
            var err = jqXHR.responseText //eval("(" + jqXHR.responseText + ")");
            if (jqXHR.status == 401) {
                error401Messagebox(err.Message);
            }
            else{
                var msg = '';
                if (jqXHR.status == 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception == 'parsererror') {
                    msg = 'Error connecting server. Please retry.';
                } else if (exception == 'timeout') {
                    msg = 'Time out error.';
                } else if (exception == 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                jQuery.unblockUI();
                bootbox.alert(msg);
                return false;
            }
        }
       
            
     
   
    });
    jQuery.unblockUI();

}
function ViewReport() {
    var encrypdata = fnencrypt("RFQID=" + RFQID + "&RFQSubject=" + ($('#rq_subject').text()) + "Type=");//encodeURIComponent
    if (sessionStorage.getItem('CustomerID') != "32") {
       
        window.open("eRFQAnalysis.html?param=" + encrypdata, "_blank")
    }
    else {
        window.open("AzeRFQAnalysis.html?param=" + encrypdata, "_blank")
        
    }
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
var currentdate = new Date();
function ExtendDuration() {
    var EndDT = new Date($('#txtextendDate').val().replace('-', ''));
    if (EndDT < currentdate) {
        $('#error_deaddate').show();
        $("#txtextendDate").closest('.col-md-6').addClass('has-error');
        $("#txtextendDate").val('');
        $('#error1').text('End Date Time must greater than Current Date Time.');
        Metronic.scrollTo($("#error_deaddate"), -200);
        $('#error_deaddate').fadeOut(7000);
        return false;
    }
    else {
    var RFQData = {
            "RFQID": parseInt(RFQID),
            "ExtendedDate": EndDT,// $("#txtextendDate").val(),
            "ExtendedBy": sessionStorage.getItem('UserID')
        }
        //alert(JSON.stringify(RFQData));

        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQExtendDeadline/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(RFQData),
            dataType: "json",
            success: function (data) {
                if (data == '1') {
                    $("#extendDate").modal("hide");
                    $("#txtextendDate").val('');
                    bootbox.alert("Date extended successfully.", function () {
                        FetchInvitedVendorsForeRFQ();
                    });

                }
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText // eval("(" + xhr.responseText + ")");
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
    
}