var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)
var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];


//sessionStorage.setItem("APIPath", 'http://www.support2educate.com/procurengine/API/api/');

sessionStorage.setItem("APIPath", 'https://www.procurengine.org/API/api/');

//var UrLToken = 'http://www.support2educate.com/procurengine/API/token';
var UrLToken = 'https://www.procurengine.org/API/token';
function fetchReguestforQuotationDetailseRFQ() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
    var replaced1 = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetailsForSurrogate/?RFQID=" + RFQID + "&CustomerID=0&UserID=",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var EndDate = new Date(data[0].RFQEndDate.replace('-', ''));
            var currentTime = new Date();
            if (EndDate > currentTime) {
                sessionStorage.setItem('hddnRFQRFIID', data[0].RFQId)
                sessionStorage.setItem('CustomerID', data[0].CustomerID)
                
                jQuery('#RFQSubject').text(data[0].RFQSubject)
                jQuery('#RFQSubjectTT').text(data[0].RFQSubject)
                
                $('#Currency').html(data[0].CurrencyNm)
                $('#CurrencyTT').html(data[0].CurrencyNm)
                jQuery('#RFQDescription').text(data[0].RFQDescription)
                jQuery('#RFQDescriptionTT').text(data[0].RFQDescription)
                jQuery('#ConversionRate').html(data[0].RFQConversionRate);
                jQuery('#refno').html(data[0].RFQConversionRate);
                jQuery('#RFQStartDate').text(data[0].RFQStartDate)
                jQuery('#RFQStartDateTT').text(data[0].RFQStartDate)
                jQuery('#RFQEndDate').text(data[0].RFQEndDate)
                jQuery('#RFQDeadlineTT').text(data[0].RFQEndDate)
                $('#bid_EventID').text(RFQID);
                $('#lblEventID').text(RFQID);
                
                if (data[0].RFQTermandCondition != '') {
                    replaced1 = data[0].RFQTermandCondition.replace(/\s/g, "%20")
                }
                jQuery('#TermCondition').attr('href', 'PortalDocs/eRFQ/' + RFQID + '/' + replaced1).html(data[0].RFQTermandCondition)
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

var erroropenbid = $('#errorOpenbid');
var successopenbid = $('#successopenbid');

function validatepassword() {
    //sessionStorage.setItem("APIPath", 'http://www.support2educate.com/procurengine/API/api/');
    sessionStorage.setItem("APIPath", 'https://www.procurengine.org/API/api/');

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  </h5>' });
    if (jQuery("#txtpassword").val() == "") {

        erroropenbid.show();
        $('#erropenbid').html('Please Enter given Password');
        erroropenbid.fadeOut(3000);
        App.scrollTo(erroropenbid, -200);
        jQuery.unblockUI();
    }
    else {

        $.ajax({
            url: UrLToken,
            type: 'POST',
            async: true,
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            "headers": {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            data: {
                grant_type: "password",
                username: '',
                password: jQuery("#txtpassword").val().trim(),
                linkurl: '',
                machineip: '',
                APICallType: ('SurrogateRFQ').toLowerCase(),
                EventID: RFQID
                // expires_in: 0,

            },
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
            url: sessionStorage.getItem("APIPath") + "RegisterParticipants/RFQSurrogateValidateData",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                if (data[0].FlagStatus == "1") {
                    fetchReguestforQuotationDetailseRFQ();
                    sessionStorage.setItem("VendorId", data[0].vendorID)
                    sessionStorage.setItem('RFQVersionId', data[0].Version)
                    sessionStorage.setItem("UserType", "V")
                    sessionStorage.setItem("UserID", data[0].UserID)
                    sessionStorage.setItem("UserName", data[0].VendorName)
                    sessionStorage.setItem("RFQID", RFQID)
                    sessionStorage.setItem("ISFromSurrogateRFQ", "Y")
                    //sessionStorage.setItem("HomePage", "http://www.support2educate.com/procurengine/")
                    
                    sessionStorage.setItem("HomePage", "https://www.procurengine.org/")
                    //  alert(data[0].IsTermsConditionsAccepted)
                    if (data[0].IsTermsConditionsAccepted == "N" || data[0].IsTermsConditionsAccepted == "NO") {
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

            if (data[0].IsSuccess == 'Y') {
                window.location = data[0].URL
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                alert('error')
                jQuery("#error").text(xhr.d);
            }
            return false;
            jQuery.unblockUI();
        }
       
    });
}