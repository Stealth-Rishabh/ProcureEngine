jQuery('#chkIsAccepted').click(function () {
    if (jQuery('#chkIsAccepted').is(':checked') == true) {
        $('#btnContinue').attr("disabled", false);
    }
    else {
        $('#btnContinue').attr("disabled", true);
    }
});



function fetchTermsConditionsText() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidTermsConditions/fetchTermsConditionsText/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&CustomerID=" + sessionStorage.getItem("CustomerID") + "&AuthenticationTonken=" + sessionStorage.getItem("AuthenticationToken"),
        cache: false,
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(data, status, jqXHR) {
            $('#lbl_gnc_text').html('');
            $('#lbl_gnc_text').html(data[0].GeneralTermsConditions);
        }
    });
}


function acceptterms() {
   
    if (sessionStorage.getItem('BidID') == 0) {
        acceptBidTermsRFIRFQ()
    }
    else {
        acceptBidTerms()
       
    }
}
function acceptBidTerms() {
    var x = isAuthenticated();
	var vendorID = 0;
    if (sessionStorage.getItem('ContactEmailID') == 'null' || sessionStorage.getItem('ContactEmailID') == '') {
        vendorID = sessionStorage.getItem('UserID');
    }
    else {
        vendorID =sessionStorage.getItem('BidUserID');
    }
	
    var acceptTerms = {
        "BidID": sessionStorage.getItem('BidID'),
        "VendorID": vendorID,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    };
 
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BidTermsConditions/AcceptBidTerms/",
        type: "POST",
        data: JSON.stringify(acceptTerms),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           
            if (data[0].IsSuccess == 'Y') {
                window.location = data[0].URL
            }
        },
        error: function (xhr) {
            alert('error')
            jQuery("#error").text(xhr.d);
        }
    });
}

function acceptBidTermsRFIRFQ() {
    var x = isAuthenticated();
    var vendorID = 0;
    
        vendorID = sessionStorage.getItem('VendorId');
   
    var acceptTerms = {
        "RFQRFIID": sessionStorage.getItem('RFQRFIId'),
        "VID": vendorID,
         "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    };
  
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BidTermsConditions/AcceptBidTermsRFIRFQ/",
        type: "POST",
        data: JSON.stringify(acceptTerms),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data[0].IsSuccess == 'Y') {
                window.location = data[0].URL
            }
        },
        error: function (xhr) {
            alert('error')
            jQuery("#error").text(xhr.d);
        }
    });
}