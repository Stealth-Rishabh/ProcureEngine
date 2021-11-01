var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)
var BIDID = getUrlVarsURL(decryptedstring)["BidID"];

var BIDTypeID = '';
var BidClosingType='';
sessionStorage.setItem("APIPath", 'https://pev3proapi.azurewebsites.net/');

function fetchBidHeaderDetails() {
   
    var url = '';
  
    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetailsForSurrogate/?BidID=" + BIDID;
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
             
                var datearray = data[0].bidDate.split("/");
                var time = addMinutes(convertTo24Hour(data[0].bidTime.toLowerCase()), data[0].bidDuration);
             
                var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
                var BiDatetime = new Date(newdate + ' ' + time);
                var currentTime = new Date();
               
                if (BiDatetime > currentTime) {
                    $('#btnpassword').removeAttr('disabled');
                    $('#txtpassword').removeAttr('disabled');
                    jQuery('#lblEventID').html(BIDID);
                    jQuery('#bid_EventID').html("Event ID : " + BIDID);
                   
                    jQuery("#lblbidsubject").text(data[0].bidSubject);
                    jQuery("#lblbidDetails").text(data[0].bidDetails);
                    jQuery("#lblbiddate").text(data[0].bidDate);
                    jQuery("#lblbidtime").text(data[0].bidTime);
                    jQuery("#lblbidtype").text(data[0].bidTypeName);
                    jQuery("#lblbidfor").text(data[0].bidFor);
                    jQuery("#lblbidsubjectTT").text(data[0].bidSubject);
                    jQuery("#lblbidDetailsTT").text(data[0].bidDetails);
                    jQuery("#lblbiddateTT").text(data[0].bidDate);
                    jQuery("#lblbidtimeTT").text(data[0].bidTime);
                    jQuery("#lblbidtypeTT").text(data[0].bidTypeName);
                    jQuery("#lblbidforTT").text(data[0].bidFor);
                    BIDTypeID = data[0].bidTypeID;
                    BidClosingType = data[0].bidClosingType;

                    jQuery("#lnkTermsAttachment").html(data[0].termsConditions);
                    jQuery("#lnkAnyOtherAttachment").html(data[0].attachment);
                   

                    jQuery("#lblbidduration").text(data[0].bidDuration);
                    jQuery("#lblcurrency").text(data[0].currencyName);
                    jQuery("#lblbiddurationTT").text(data[0].bidDuration);
                    jQuery("#lblcurrencyTT").text(data[0].currencyName);
                    jQuery("#lblConvRate").text(data[0].conversionRate);
                    jQuery("#lblstatus").text(data[0].conversionRate);
                    jQuery("#lblConvRate").text(data[0].conversionRate);

                }
                else {
                    bootbox.alert("This bid has already expired !!!", function () {
                       
                        $('#btnpassword').attr('disabled', 'disabled')
                        $('#txtpassword').attr('disabled', 'disabled')
                        
                    });
                  
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
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + BIDID);
}

var erroropenbid = $('#errorOpenbid');
var successopenbid = $('#successopenbid');

function validatepassword() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   // sessionStorage.setItem("APIPath", 'http://www.support2educate.com/pev2/PEAPIV2/');
    sessionStorage.setItem("APIPath", 'https://pev3proapi.azurewebsites.net/');

    if (jQuery("#txtpassword").val() == "" ) {

        erroropenbid.show();
        $('#erropenbid').html('Please Enter given Password');
        erroropenbid.fadeOut(3000);
        App.scrollTo(erroropenbid, -200);

    }
    else {
        // Get Token For Password Validation
       var url = sessionStorage.getItem("APIPath") +"User/EventSurrogateValidate/?BidId=" + BIDID + "&Password=" + jQuery("#txtpassword").val() + "&EventType=" + ('SurrogateBid').toLowerCase();
            jQuery.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: url,
                cache: false,
                crossDomain: true,
                dataType: "json",
                success: function (response) {
                   
                    sessionStorage.setItem("Token", response.token)
                    fnGtrTokenValidatePassword()
                
            },
            error: function (xhr, status, error) {
                sessionStorage.setItem("Token", '')
                jQuery("#txtpassword").val('')
                var myObj = JSON.parse(xhr.responseText);
                jQuery.unblockUI();
                bootbox.alert(myObj.error + ' <br>' + myObj.error_description, function () {
                });
                sessionStorage.clear();
            }
        });
       
    }
}

function fnGtrTokenValidatePassword() {
     
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "RegisterParticipants/BidSurrogateValidateData/?BidId=" + BIDID + "&Password="+ jQuery("#txtpassword").val(),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {

                if (data[0].flagStatus == "1") {
                    fetchBidHeaderDetails();
                    sessionStorage.setItem("VendorId", data[0].vendorID)
                    sessionStorage.setItem("UserType", "V")
                    sessionStorage.setItem("UserID", data[0].userID)
                    sessionStorage.setItem("UserName", data[0].vendorName)
                    sessionStorage.setItem("BidID", BIDID)
                    sessionStorage.setItem("ISFromSurrogate", "Y")
                   // sessionStorage.setItem("HomePage", "http://www.support2educate.com/pev2/")
                    sessionStorage.setItem("HomePage", "https://pev3proapp.azurewebsites.net/")
                   
                  
                    if (data[0].isTermsConditionsAccepted == "N" || data[0].isTermsConditionsAccepted == "NO") {
                        setTimeout(function () {
                            $('#termscondition').modal('show');
                        }, 500);
                    }
                    else {
                        setTimeout(function () {
                            if (BIDTypeID == "7" && BidClosingType=='A') {
                            window.location = "ParticipateBidSeaExport.html";
                            }
                       else if (BIDTypeID == "7" && BidClosingType=='S') {
                           window.location = "ParticipateBidStagger.html";
                            }
                        else {
                            window.location = "ParticipateBidForwardAuction.html";
                        }
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
            acceptBidTermsAuction()

        }
    });

}
function acceptBidTermsAuction() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorID = 0;
    vendorID = sessionStorage.getItem('VendorId');
    var acceptTerms = {
        "BidID": parseInt(BIDID),
        "VendorID": vendorID
    };
   
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BidTermsConditions/AcceptBidTerms/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(acceptTerms),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data.isSuccess == 'Y') {
                window.location = data.linkURL;
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