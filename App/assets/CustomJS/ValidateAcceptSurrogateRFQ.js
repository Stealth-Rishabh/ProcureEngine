var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)
var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];


//sessionStorage.setItem("APIPath", 'http://www.support2educate.com/procurengine/API/api/');
sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');


function fetchReguestforQuotationDetailseRFQ() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
   
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetailsForSurrogate/?RFQID=" + RFQID + "&CustomerID=0&UserID=",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var EndDate = new Date(data[0].rfqEndDate.replace('-', ''));
            var currentTime = new Date();
            if (EndDate > currentTime) {
                sessionStorage.setItem('hddnRFQRFIID', data[0].rfqid)
                sessionStorage.setItem('CustomerID', data[0].customerID)
                
                jQuery('#RFQSubject').text(data[0].rfqSubject)
                jQuery('#RFQSubjectTT').text(data[0].rfqSubject)
                
                $('#Currency').html(data[0].currencyNm)
                $('#CurrencyTT').html(data[0].currencyNm)
                jQuery('#RFQDescription').text(data[0].rfqDescription)
                jQuery('#RFQDescriptionTT').text(data[0].rfqDescription)
                jQuery('#ConversionRate').html(data[0].rfqConversionRate);
                jQuery('#refno').html(data[0].rfqConversionRate);
                jQuery('#RFQStartDate').text(data[0].rfqStartDate)
                jQuery('#RFQStartDateTT').text(data[0].rfqStartDate)
                jQuery('#RFQEndDate').text(data[0].rfqEndDate)
                jQuery('#RFQDeadlineTT').text(data[0].rfqEndDate)
                $('#bid_EventID').text(RFQID);
                $('#lblEventID').text(RFQID);
                
                jQuery('#TermCondition').html(data[0].rfqTermandCondition)
            }
            else {
                bootbox.alert("This RFQ has already expired !!!", function () {
                    //   $('.page-container').hide();
                    $('#btnpassword').attr('disabled', 'disabled')
                    $('#txtpassword').attr('disabled', 'disabled')
                   
                });
            }
           

        }
    });
    jQuery.unblockUI();
}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + RFQID);
}
var erroropenbid = $('#errorOpenbid');
var successopenbid = $('#successopenbid');

function validatepassword() {
    //sessionStorage.setItem("APIPath", 'http://www.support2educate.com/procurengine/API/api/');
    sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  </h5>' });
    if (jQuery("#txtpassword").val() == "") {

        erroropenbid.show();
        $('#erropenbid').html('Please Enter given Password');
        erroropenbid.fadeOut(3000);
        App.scrollTo(erroropenbid, -200);
        jQuery.unblockUI();
    }
    else {
        // Get Token For Password Validation
        var url = sessionStorage.setItem("APIPath") + "User/EventSurrogateValidate/?BidId=" + RFQID + "&Password=" + jQuery("#txtpassword").val() + "&EventType=" + ('SurrogateRFQ').toLowerCase();
        $.ajax({
            type: "GET",
                contentType: "application/json; charset=utf-8",
                url: url,
                cache: false,
                crossDomain: true,
                dataType: "json",
                success: function (response) {

                sessionStorage.setItem("Token", response.access_token)
                fnGtrTokenValidatePassword()

            },
            error: function (xhr, status, error) {
                sessionStorage.setItem("Token", '')
                var myObj = JSON.parse(xhr.responseText);
                jQuery("#txtpassword").val('')
                jQuery.unblockUI();
                bootbox.alert(myObj.error + ' <br>' + myObj.error_description, function () {
                });
               
            }
        });
    }

    function fnGtrTokenValidatePassword(){
        var Data = {
            "BidID": RFQID,
            "Password": jQuery("#txtpassword").val()

        }
        //alert(JSON.stringify(Data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RFQSurrogateValidateData/?RFQID=" + RFQID + "&Password=" + jQuery("#txtpassword").val(),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {

                if (data[0].flagStatus == "1") {
                    fetchReguestforQuotationDetailseRFQ();
                    sessionStorage.setItem("VendorId", data[0].vendorID)
                    sessionStorage.setItem('RFQVersionId', data[0].version)
                    sessionStorage.setItem("UserType", "V")
                    sessionStorage.setItem("UserID", data[0].userID)
                    sessionStorage.setItem("UserName", data[0].vendorName)
                    sessionStorage.setItem("RFQID", RFQID)
                    sessionStorage.setItem("ISFromSurrogateRFQ", "Y")
                    //sessionStorage.setItem("HomePage", "http://www.support2educate.com/pev2/")
                    sessionStorage.setItem("HomePage", "https://pev3qaapp.azurewebsites.net/")
                    
                    if (data[0].isTermsConditionsAccepted == "N" || data[0].isTermsConditionsAccepted == "NO") {
                        setTimeout(function () {
                            $('#termscondition').modal('show');
                        }, 500);
                    }
                    else {
                        setTimeout(function () {
                            var encrypdata = fnencrypt("RFQID=" + RFQID)
                            window.location = "eRFQVendor.html?param=" + encrypdata;
                           
                        }, 1000);
                    }


                }
                else {
                    successopenbid.hide();
                    erroropenbid.show();
                    $('#erropenbid').html('Invalid password . Please Check your Password and try again.');
                    erroropenbid.fadeOut(3000);
                    App.scrollTo(erroropenbid, -200);
                    jQuery("#txtpassword").val('');
                    jQuery.unblockUI();
                }

                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {

                var err = eval("(" + xhr.responseText + ")");
                if (xhr.status === 401) {
                    error401Messagebox(err.Message);
                }
                else{
                    sessionStorage.setItem("Token", '')
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
}
jQuery('#chkIsAccepted').click(function () {
    if (jQuery('#chkIsAccepted').is(':checked') == true) {
        $('#btnContinue').attr("disabled", false);
    }
    else {
        $('#btnContinue').attr("disabled", true);
    }
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

           
            eRFQAcceptBidTerms()

        }
    });



}
function eRFQAcceptBidTerms() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorID = 0;

    vendorID = sessionStorage.getItem('VendorId');

    var acceptTerms = {
        "RFQID": RFQID,
        "VID": vendorID
    };
    // alert(JSON.stringify(acceptTerms))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQAcceptBidTerms/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(acceptTerms),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data[0].isSuccess == 'Y') {
                window.location = data[0].linkURL
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
               
                jQuery("#error").text(xhr.d);
            }
            return false;
            jQuery.unblockUI();
        }
       
    });
}