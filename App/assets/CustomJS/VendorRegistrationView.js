sessionStorage.setItem('CustomerID', "1")
sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');

function fetchVendorRegistrationDetails() {
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchVendorRequest?tmpVendorID=" + sessionStorage.getItem('tmpVendorID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (json) {
            debugger;

            var companydetails = JSON.parse(json[0].jsondata);
            var categorydetails = JSON.parse(json[1].jsondata);

            sessionStorage.setItem('tmpVendorID', companydetails[0].tmpVendorID);

            var categoryresult = categorydetails.map(function (val) {
                return val.CategoryName;
            }).join(', ');


            if (companydetails[0].GSTFile != "" || companydetails[0].GSTFile != null || companydetails[0].GSTFile != undefined) {
                $('#gstattach').show();
                $('#gstattach').html(companydetails[0].GSTFile);

            } else {

                $('#gstattach').hide();
            }

            if (companydetails[0].PANFile != "" || companydetails[0].PANFile != null || companydetails[0].PANFile != undefined) {
                $('#panattach').show();
                $('#panattach').html(companydetails[0].PANFile);

            } else {

                $('#panattach').hide();
            }

            if (companydetails[0].MSMEFile != "" || companydetails[0].MSMEFile != null || companydetails[0].MSMEFile != undefined) {
                $('#msmeattach').show();
                $('#msmeattach').html(companydetails[0].MSMEFile);

            } else {

                $('#msmeattach').hide();
            }

            if (companydetails[0].cancelledCheck != "" && companydetails[0].cancelledCheck != null && companydetails[0].cancelledCheck != undefined) {
                $('#checkattach').show();
                $('#checkattach').html(companydetails[0].cancelledCheck);

            } else {

                $('#checkattach').hide();
            }

            jQuery('#gstvendorclass').html(companydetails[0].GSTClass);
            jQuery('#gstno').html(companydetails[0].GSTNo);
            jQuery('#natureofest').html(companydetails[0].EstName);
            jQuery('#vendortype').html(companydetails[0].VendorCatName);
            jQuery('#typeofproduct').html(categoryresult);
            jQuery('#product').html(companydetails[0].product);
            jQuery('#title').html(companydetails[0].Title);
            jQuery('#companyname').html(companydetails[0].VendorName);
            jQuery('#address').html(companydetails[0].VendorAdd);
            jQuery('#country').html(companydetails[0].CountryName);
            jQuery('#state').html(companydetails[0].StateName);
            jQuery('#city').html(companydetails[0].CityName);
            jQuery('#pincode').html(companydetails[0].pinCode);
            jQuery('#panno').html(companydetails[0].PAN);
            jQuery('#panfilename').html(companydetails[0].PANFile);
            jQuery('#TDStype').html(companydetails[0].TDSTypeName);
            jQuery('#tanno').html(companydetails[0].TAN);
            jQuery('#paymentterms').html(companydetails[0].PM[0].paymentTerm);
            jQuery('#bankname').html(companydetails[0].BankName);
            jQuery('#bankaccountno').html(companydetails[0].BankAccount);
            jQuery('#ifsccode').html(companydetails[0].IFSCCode);
            jQuery('#accountholdername').html(companydetails[0].AccountName);
            jQuery('#primaryname').html(companydetails[0].ContactName);
            jQuery('#primarymobile').html(companydetails[0].MOBILE);
            jQuery('#primaryemail').html(companydetails[0].ContactEmailID);
            jQuery('#altname').html(companydetails[0].ContactNameAlt);
            jQuery('#altmobile').html(companydetails[0].mobileAlt);
            jQuery('#altemail').html(companydetails[0].AltEmailID);
            jQuery('#msme').html(companydetails[0].MSMECheck);
            jQuery('#msmeclass').html(companydetails[0].MSMEType);
            jQuery('#msmeno').html(companydetails[0].MSMENo);
            jQuery('#msmeattach').html(companydetails[0].MSMEFile);
            jQuery('#lastFY').html(companydetails[0].currencyLastFY + ' ' + companydetails[0].PreviousTurnover);
            jQuery('#seclastFY').html(companydetails[0].currencyLast2FY + ' ' + companydetails[0].SecondLastTurnover);
            jQuery('#txtLastFiscalyear').html(companydetails[0].PreviousTurnoverYear);
            jQuery('#SecondLastTurnoverYear').html(companydetails[0].SecondLastTurnoverYear);

        },
        error: function (xhr, status, error) {
            alert('hi')
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
    fnDownloadAttachments($("#" + aID.id).html(), 'VR/' + sessionStorage.getItem('tmpVendorID'));
}


function ApproveRFI(For) {
    debugger;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if (For == 'R') {
        var remarks = $('#txtrejectreason').val()
    } else {
        var remarks = $('#txtparkreason').val()
    }

    var data = {
        "tmpVendorID": parseInt(sessionStorage.getItem('tmpVendorID')),
        "status": For,
        'approverID': sessionStorage.getItem('UserID'),
        'customerID': parseInt(sessionStorage.getItem('CustomerID')),
        'Remarks': remarks,
    }
   // alert(JSON.stringify(data));
    console.log(JSON.stringify(data));
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorRequest/VRApproval_Reject",  
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {           
                    
            bootbox.alert("Request submitted successfully.", function () {               
                window.location = sessionStorage.getItem("HomePage")
                return false;
            });

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();
}



$('#rejectionReason').on('hidden.bs.modal', function () {
    $('#txtrejectreason').val('');
    $('#txtparkreason').val('');
    $("#rejectionForm").validate().resetForm();
    $("#rejectionForm").find('.has-error').removeClass("has-error");
});



