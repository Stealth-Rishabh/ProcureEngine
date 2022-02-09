//sessionStorage.setItem("APIPath", 'http://pev3qaapi.azurewebsites.net/');  
//sessionStorage.setItem("CustomerID", 37);
//sessionStorage.setItem("UserID", 'a'); 
//sessionStorage.setItem("tmpVendorID", 14);
//sessionStorage.setItem("status", 1);

function fetchVendorRegistrationDetails() {
    
    alert(sessionStorage.getItem("APIPath") + "VendorRequest/FetchVendorRequest?tmpVendorID=" + sessionStorage.getItem('tmpVendorID') + "&VendorID=" + sessionStorage.getItem('VendorID'))
    jQuery.ajax({
        
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchVendorRequest?tmpVendorID=" + sessionStorage.getItem('tmpVendorID') + "&VendorID=" + sessionStorage.getItem('VendorID') ,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (json) {
            debugger;
            console.log("json", json);
            var companydetails = JSON.parse(json[0].jsondata);         
            var categorydetails = JSON.parse(json[1].jsondata);
            console.log('companydetails', companydetails);
            console.log('categorydetails', categorydetails);
            sessionStorage.setItem('tmpVendorID', companydetails[0].tmpVendorID);

            var categoryresult = categorydetails.map(function (val) {
                return val.CategoryName;
            }).join(', ');

            if (companydetails[0].VendorCode != "" && companydetails[0].VendorCode != null && companydetails[0].VendorCode != undefined) {
                $('#hdnvendorCode').val(companydetails[0].VendorCode);
            } else {
                var vendorCode = '';
                $('#hdnvendorCode').val(vendorCode);                
            }


            if (companydetails[0].GSTFile != "" && companydetails[0].GSTFile != null && companydetails[0].GSTFile != undefined) {
                $('#gstattach').show();
                $('#gstattach').html(companydetails[0].GSTFile);
              
            } else {
                
                $('#gstattach').hide();
            }

            if (companydetails[0].PANFile != "" && companydetails[0].PANFile != null && companydetails[0].PANFile != undefined) {
                $('#panattach').show();
                $('#panattach').html(companydetails[0].PANFile);
                
            } else {
                
                $('#panattach').hide(); 
            }

            if (companydetails[0].MSMEFile != "" && companydetails[0].MSMEFile != null && companydetails[0].MSMEFile != undefined) {
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

            if (companydetails[0].MSMECheck == 'Y') {
                $('.hideInput').removeClass('hide');
            } else {
                $('.hideInput').addClass('hide');
            }

            if (companydetails[0].GSTClass == 0) {
                var gstclass = '';
            } else {
                var gstclass = companydetails[0].GSTClass;
            }

            jQuery('#gstvendorclass').html(gstclass); 
            jQuery('#gstno').html(companydetails[0].ServiceTaxNo);         
            jQuery('#natureofest').html(companydetails[0].EstName);
            jQuery('#vendortype').html(companydetails[0].VendorCatName);
            jQuery('#typeofproduct').html(categoryresult);
            jQuery('#product').html(companydetails[0].product);           
            jQuery('#companyname').html(companydetails[0].VendorName);
            jQuery('#address').html(companydetails[0].address1 );
            jQuery('#country').html(companydetails[0].CountryName);
            jQuery('#state').html(companydetails[0].StateName);
            jQuery('#city').html(companydetails[0].CityName);
            jQuery('#pincode').html(companydetails[0].pincode);
            jQuery('#panno').html(companydetails[0].PANNo);
            jQuery('#panfilename').html(companydetails[0].PANFile);
            jQuery('#TDStype').html(companydetails[0].TDSTypeName);
            jQuery('#tanno').html(companydetails[0].TAN);
            jQuery('#paymentterms').html(companydetails[0].PM[0].paymentTerm);
            jQuery('#bankname').html(companydetails[0].BankName);
            jQuery('#bankaccountno').html(companydetails[0].BankAccount);
            jQuery('#ifsccode').html(companydetails[0].IFSCCode);
            jQuery('#accountholdername').html(companydetails[0].AccountName);
            jQuery('#primaryname').html(companydetails[0].ContactPerson);
            jQuery('#primarymobile').html(companydetails[0].MobileNo);
            jQuery('#primaryemail').html(companydetails[0].EmailID);
            jQuery('#altname').html(companydetails[0].ContactNameAlt);
            jQuery('#altmobile').html(companydetails[0].Phone);
            jQuery('#altemail').html(companydetails[0].AlternateEmailID);
            jQuery('#msme').html(companydetails[0].MSMECheck);
            jQuery('#msmeclass').html(companydetails[0].MSMEType);
            jQuery('#msmeno').html(companydetails[0].MSMENo);
            jQuery('#msmeattach').html(companydetails[0].MSMEFile);
            jQuery('#lastFY').html(companydetails[0].currencyLastFY + ' ' +companydetails[0].PreviousTurnover);
            jQuery('#seclastFY').html(companydetails[0].currencyLast2FY + ' ' + companydetails[0].SecondLastTurnover);
            jQuery('#txtLastFiscalyear').html(companydetails[0].PreviousTurnoverYear);
            jQuery('#SecondLastTurnoverYear').html(companydetails[0].SecondLastTurnoverYear );
            
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
        'vendorCode': $('#hdnvendorCode').val(),
        'VRID': parseInt(sessionStorage.getItem('VRID')),
        'Remarks': remarks,
        
    }
    alert(JSON.stringify(data));
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
            debugger;            
            bootbox.alert("VR Submitted.", function () {               
                //window.location = sessionStorage.getItem("HomePage")
                window.location = 'http://localhost:53632/index.html';
                return false;
            });

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
    jQuery.unblockUI();
}



$('#rejectionReason').on('hidden.bs.modal', function () {
    $('#txtrejectreason').val('');
    $('#txtparkreason').val('');
    $("#rejectionForm").validate().resetForm();
    $("#rejectionForm").find('.has-error').removeClass("has-error");
});



