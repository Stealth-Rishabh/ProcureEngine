var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)

var BIDID = getUrlVarsURL(decryptedstring)["BidID"];
debugger

var BIDTypeID = '';
var BidClosingType = '';
sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');

//FROM HTML
jQuery(document).ready(function () {

    $('.page-container').show();
    Metronic.init();
    Layout.init();
    App.init();

    fetchBidHeaderDetails();
    formvalidate();
    $('#btnpassword').attr('disabled', 'disabled')
    $('#txtpassword').attr('disabled', 'disabled')

});
let isvalidate = "1";
function fetchBidHeaderDetails() {

    var url = '';

    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetailsForSurrogate/?BidID=" + parseInt(BIDID);
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            if (data.length == 1) {
                var BidStartDatetime = fnConverToLocalTime(data[0].bidDate);
                // var BidExpiryDatetime = fnConverToLocalTime(data[0].bidExpiryDate);
                // var _bidDateStart = new Date(BidStartDatetime.replace('-', ''));
                // var _bidDateExpiry = new Date(BidExpiryDatetime.replace('-', ''));

                // var currentTime = new Date();

                //** check Expiry Date in valid or not
                Dateandtimevalidate(fnConverToLocalTime(data[0].bidExpiryDate));

                //if (_bidDateExpiry > currentTime) {
                //if (_bidDateStart < currentTime) {

                jQuery('#lblEventID').html(BIDID);
                jQuery('#bid_EventID').html("Event ID : " + BIDID);

                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                //jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbiddate").text(BidStartDatetime);
                //jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblbidfor").text(data[0].bidFor);
                jQuery("#lblbidsubjectTT").text(data[0].bidSubject);
                jQuery("#lblbidDetailsTT").text(data[0].bidDetails);
                //jQuery("#lblbiddateTT").text(data[0].bidDate);
                jQuery("#lblbiddateTT").text(BidStartDatetime);
                //jQuery("#lblbidtimeTT").text(data[0].bidTime);
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
                jQuery('#TermandCondition').attr("name", data[0].termsConditions)
                jQuery('#bidTermandCondition').attr("name", data[0].termsConditions);
                /*  jQuery('#lblEventID').html(BIDID);
                   jQuery('#bid_EventID').html("Event ID : " + BIDID);

                   jQuery("#lblbidsubject").text(data[0].bidSubject);
                   jQuery("#lblbidDetails").text(data[0].bidDetails);
                   //jQuery("#lblbiddate").text(data[0].bidDate);
                   jQuery("#lblbiddate").text(BidStartDatetime);
                   //jQuery("#lblbidtime").text(data[0].bidTime);
                   jQuery("#lblbidtype").text(data[0].bidTypeName);
                   jQuery("#lblbidfor").text(data[0].bidFor);
                   jQuery("#lblbidsubjectTT").text(data[0].bidSubject);
                   jQuery("#lblbidDetailsTT").text(data[0].bidDetails);
                   //jQuery("#lblbiddateTT").text(data[0].bidDate);
                   jQuery("#lblbiddateTT").text(BidStartDatetime);
                   //jQuery("#lblbidtimeTT").text(data[0].bidTime);
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
               }*/

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

function Dateandtimevalidate(StartDT) {

    var StartDT = StartDT.replace('-', '');
    let StTime =
        new Date(StartDT.toLocaleString("en", {
            timeZone: sessionStorage.getItem('preferredtimezone')
        }));

    ST = new String(StTime);
    ST = ST.substring(0, ST.indexOf("GMT"));
    ST = ST + 'GMT' + getTimezoneOffset()//sessionStorage.getItem('utcoffset');

    var Tab1Data = {
        "BidDate": ST
    }


    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        async: false,
        crossDomain: true,
        data: JSON.stringify(Tab1Data),
        dataType: "json",
        success: function (data) {

            if (data == "1") {
                $('#btnpassword').removeAttr('disabled');
                $('#txtpassword').removeAttr('disabled');
            }
            else {
                bootbox.alert("This bid has already expired !!!", function () {
                    $('#btnpassword').attr('disabled', 'disabled')
                    $('#txtpassword').attr('disabled', 'disabled')
                    return true;
                });
            }
        },
        error: function () {

            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                bootbox.alert("you have some error.Please try agian.");
            }
            jQuery.unblockUI();
            return false;

        }

    });

}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + BIDID);
}


//abheedev bug 381 start
function DownloadbidFile(aID) {
    fnDownloadAttachments($("#" + aID.id).attr("name"), 'Bid/' + BIDID);
}
//abheedev bug 381 end

var erroropenbid = $('#errorOpenbid');
var successopenbid = $('#successopenbid');

function validatepassword() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');

    if (jQuery("#txtpassword").val() == "") {

        erroropenbid.show();
        $('#erropenbid').html('Please Enter given Password');
        erroropenbid.fadeOut(3000);
        App.scrollTo(erroropenbid, -200);

    }
    else {
        // Get Token For Password Validation
        var url = sessionStorage.getItem("APIPath") + "User/EventSurrogateValidate/?BidId=" + BIDID + "&Password=" + jQuery("#txtpassword").val() + "&EventType=" + ('SurrogateBid').toLowerCase();
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
                erroropenbid.show();
                $('#erropenbid').html('Invalid password . Please Check your Password and try again.');
                erroropenbid.fadeOut(3000);
                App.scrollTo(erroropenbid, -200);
                jQuery("#txtpassword").val('');
                jQuery.unblockUI();
            }
        });

    }
}

function fnGtrTokenValidatePassword() {

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/BidSurrogateValidateData/?BidId=" + BIDID + "&Password=" + jQuery("#txtpassword").val(),
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

                sessionStorage.setItem("HomePage", "https://pev3proapp.azurewebsites.net/")
                //  sessionStorage.setItem("HomePage", 'https://pev3qaapi.azurewebsites.net/');


                if (data[0].isTermsConditionsAccepted == "N" || data[0].isTermsConditionsAccepted == "NO") {
                    setTimeout(function () {
                        $('#termscondition').modal('show');
                    }, 500);
                }
                else {
                    setTimeout(function () {
                        if (BIDTypeID == "7" && BidClosingType == 'A') {
                            window.location = "ParticipateBidSeaExport.html";
                        }
                        else if (BIDTypeID == "7" && BidClosingType == 'S') {
                            window.location = "ParticipateBidStagger.html";
                        }
                        else if (BIDTypeID == "8") {
                            window.location = "ParticipateBidCoalExport.html";
                        }
                        else if (BIDTypeID == "9") {
                            window.location = "ParticipateBidFrenchAuction.html";
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
            else {
                alert('error')
                jQuery("#error").text(xhr.d);
            }
            return false;
            jQuery.unblockUI();
        }

    });
}

/*jQuery('#bidchkIsAccepted').click(function () {
    
    if (jQuery('#bidchkIsAccepted').is(':checked') == true) {
        $('#btnContinue').removeAttr("disabled");
    }
    else {
        $('#btnContinue').attr("disabled", "disabled");
    }
});*/

function IsTermAcceppeted() {
    if (jQuery('#bidchkIsAccepted').is(':checked') == true) {
        $('#btnContinue').removeAttr("disabled");
    }
    else {
        $('#btnContinue').attr("disabled", "disabled");
    }
}
