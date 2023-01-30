var APIPath = sessionStorage.getItem("APIPath");
clearsession()
//FROM HTML
jQuery(document).ready(function () {
    Pageloaded()
    var x = isAuthenticated();
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    App.init();
    setCommonData();
    fetchUserBids();
    fetchMenuItemsFromSession(9, 18);
    FormValidate()

});
//

var error1 = $('.alert-danger');
var success1 = $('.alert-success');
var error2 = $('#errormapdiv');
var success2 = $('#successmapdiv');
function FormValidate() {
    sessionStorage.removeItem("shname")
    sessionStorage.removeItem("price")
    sessionStorage.removeItem("subtime")
    sessionStorage.removeItem("psid")
    sessionStorage.removeItem("psheaderid")
    sessionStorage.removeItem("VehicleID")
    sessionStorage.removeItem("OriginID")
    sessionStorage.removeItem("DestinationID")
    sessionStorage.removeItem("QPriceD")
    sessionStorage.removeItem("SubmissionTymD")
    sessionStorage.removeItem("VHeaderID")
     sessionStorage.removeItem("persquarefeet")
    sessionStorage.removeItem("manpower")
    sessionStorage.removeItem("infra")
    sessionStorage.removeItem("utility")
    sessionStorage.removeItem("SubmissionTymW")
    sessionStorage.removeItem("fixedManagement")
    sessionStorage.removeItem("PriceSea")
    sessionStorage.removeItem("ExworkSea")
    sessionStorage.removeItem("SubmissionTymSea")
    sessionStorage.removeItem("fmin")
    sessionStorage.removeItem("f45")
    sessionStorage.removeItem("f100")
    sessionStorage.removeItem("f300")
    sessionStorage.removeItem("f500")
    sessionStorage.removeItem("f1000")
    sessionStorage.removeItem("exmin")
    sessionStorage.removeItem("ex45")
    sessionStorage.removeItem("ex100")
    sessionStorage.removeItem("ex300")
    sessionStorage.removeItem("ex500")
    sessionStorage.removeItem("ex1000")
    sessionStorage.removeItem("subtym")
    $('#maphead').validate({
        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            txtremarks: {
                required: true
            }
            
        },
        messages: {
            txtremarks: {
                required: "Remarks is required."
            }
        },

        errorPlacement: function (error, element) { // render error placement for each input type
            error.insertAfter(element); // for other inputs, just perform default behavior
        },

        invalidHandler: function (event, validator) { //display error alert on form submit
          
            success2.hide();
            jQuery("#err").text("You have some form errors. Please check below.");
            error2.show();
            error2.fadeOut(5000);
            App.scrollTo(error2, -200);
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.col-lg-4').removeClass('has-success').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-lg-4').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.col-lg-4').removeClass('has-error').addClass('has-success');
            label.remove(); // remove error label here

        },
        submitHandler: function (form) {
            error2.hide();
            if (sessionStorage.getItem("hdnbidtypeid") == 7) {
                deletePSquote();
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 4) {
                deleteDomesticQuote()
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 5) {
                deletewarehouseQuote()
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 3) {
                deleteseaQuote()
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 2) {
                deleteAirQuote()
            }
            
        }
    });

}


function fetchUserBids() {
  
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
  
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=0&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#ddlbid').empty();
            if (data.length > 0) {
                
                sessionStorage.setItem('hdnAllBids', JSON.stringify(data));
                jQuery('#ddlbid').append(jQuery("<option ></option>").val("").html("Select Bid"));
                for (var i = 0; i < data.length; i++) {
                    jQuery('#ddlbid').append(jQuery("<option ></option>").val(data[i].BidId).html(data[i].BidSubject));
                }
            }
            else {
                $('#ddlbid').append(jQuery("<option ></option>").val("").html("Select Bid"));
                error1.show();
                $('#spandanger').html('No pending bids for which you can invite vendors.!');
                error1.fadeOut(6000);
                App.scrollTo(error1, -200);
               
            }
          
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert("error");
            }
            return false;
            jQuery.unblockUI();
        }
    });
}


jQuery('#ddlbid').change(function() {
    var data = sessionStorage.getItem('hdnAllBids');
    var _thisVal = $(this).val();

    if (_thisVal == '') {
        sessionStorage.setItem('hdnbid', '0');
        sessionStorage.setItem("hdnbidtypeid", '0')
        $('#inviteVendorBody').hide();
    }
    else {
        sessionStorage.setItem('hdnbid', _thisVal);
        jQuery.each(jQuery.parseJSON(data), function(i, bid) {
            if (bid.BidId == _thisVal) {
                sessionStorage.setItem("hdnbidtypeid", bid.BidTypeID)
            }
        });
        fetchvendor(_thisVal);
        FetchVenderNotInvited(_thisVal)
        fetchallexportdetails(); // For Time Extension feature added on 11 Nov
    }
});

function fetchvendor(bidid) {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=" + bidid + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#ddlvendors').empty()
            if (data.length > 0) {
                sessionStorage.setItem('hdnAllBidsVendor', JSON.stringify(data));
                //alert(JSON.stringify(data))
                jQuery('#ddlvendors').append(jQuery("<option ></option>").val("0").html("Select Vendor"));
                for (var i = 0; i < data.length; i++) {
                    jQuery('#ddlvendors').append(jQuery("<option ></option>").val(data[i].VendorID).html(data[i].EmailId));
                }
            }
            else {
                error1.show();
                $('#spandanger').html('Bid not mapped');
                error1.fadeOut(3000);
                App.scrollTo(error1, -200);

            }
           
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert("error");
            }
            return false;
            jQuery.unblockUI();
        }
    });
}
function fetchparticationQuotes() {
    var url = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    if( sessionStorage.getItem("hdnbidtypeid")==7){
        url=APIPath + "RemoveParticipatedQuotedPrices/fetchPSQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }
    else if (sessionStorage.getItem("hdnbidtypeid") == 4) {
        url = APIPath + "RemoveParticipatedQuotedPrices/fetchdomesticQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }
    else  {
        url = APIPath + "RemoveParticipatedQuotedPrices/fetchQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            $('#tblquotedprices').show()
            jQuery('#tblquotedprices').empty()
          
            if (data.length > 0) {
                if (sessionStorage.getItem("hdnbidtypeid") == 7) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>ShortName</th><th>Quoted Price</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {
                        $('#tblquotedprices').append('<tr><td>' + data[i].ShortName + '</td><td>' + data[i].QuotedPrice + '</td><td>' + data[i].SubmissionTime + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationPS(\'' + data[i].ShortName + '\',\'' + data[i].QuotedPrice + '\',\'' + data[i].SubmissionTime + '\',\'' + data[i].PSID + '\',\'' + data[i].PSHeaderID + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
                else if (sessionStorage.getItem("hdnbidtypeid") == 4) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>VehicleType</th><th>Origin</th><th>Destination</th><th>Quoted Price</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {
                        $('#tblquotedprices').append('<tr><td>' + data[i].VehicleTypeName + '</td><td>' + data[i].OriginName + '</td><td>' + data[i].DestinationName + '</td><td>' + data[i].QuotedPrice + '</td><td>' + data[i].SubmissionTime + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationDOM(\'' + data[i].VehicleID + '\',\'' + data[i].OriginID + '\',\'' + data[i].DestinationID + '\',\'' + data[i].QuotedPrice + '\',\'' + data[i].SubmissionTime + '\',\'' + data[i].VDomesticHeaderID + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
                else if (sessionStorage.getItem("hdnbidtypeid") == 5)
                {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>PerSquareFeetRate</th><th>ManPowerCost</th><th>InfrastructureCost</th><th>UtilitiesCost</th><th>FixedManagementFee</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {
                        $('#tblquotedprices').append('<tr><td>' + data[i].PerSquareFeetRate + '</td><td>' + data[i].ManPowerCost + '</td><td>' + data[i].InfrastructureCost + '</td><td>' + data[i].UtilitiesCost + '</td><td>' + data[i].FixedManagementFee + '</td><td>' + data[i].SubmissionTime + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationWare(\'' + data[i].PerSquareFeetRate + '\',\'' + data[i].ManPowerCost + '\',\'' + data[i].InfrastructureCost + '\',\'' + data[i].UtilitiesCost + '\',\'' + data[i].SubmissionTime + '\',\'' + data[i].FixedManagementFee + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
                else if (sessionStorage.getItem("hdnbidtypeid") == 3) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>Price</th><th>Ex-Works</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {
                        $('#tblquotedprices').append('<tr><td>' + data[i].Price + '</td><td>' + data[i].ExWorks + '</td><td>' + data[i].SubmissionTime + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationSea(\'' + data[i].Price + '\',\'' + data[i].ExWorks + '\',\'' + data[i].SubmissionTime + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
                else if (sessionStorage.getItem("hdnbidtypeid") == 2) {
                    $('#tbllbl').addClass('display-none')
                    $('#tbldiv').removeClass('col-lg-10')
                    $('#tbldiv').addClass('col-lg-12')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>Action</th><th>Submission Time</th><th>FreightMin</th><th>FreightPlus45</th><th>FreightPlus100</th><th>FreightPlus300</th><th>FreightPlus500</th><th>FreightPlus1000</th><th>ExWorksMin</th><th>ExWorksPlus45</th><th>ExWorksPlus100</th><th>ExWorksPlus300</th><th>ExWorksPlus500</th><th>ExWorksPlus1000</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {
                        
                        $('#tblquotedprices').append('<tr><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationair(\'' + data[i].FreightMin + '\',\'' + data[i].FreightPlus45 + '\',\'' + data[i].FreightPlus100 + '\',\'' + data[i].FreightPlus300 + '\',\'' + data[i].FreightPlus500 + '\',\'' + data[i].FreightPlus1000 + '\',\'' + data[i].ExWorksMin + '\',\'' + data[i].ExWorksPlus45 + '\',\'' + data[i].ExWorksPlus100 + '\',\'' + data[i].ExWorksPlus300 + '\',\'' + data[i].ExWorksPlus500 + '\',\'' + data[i].ExWorksPlus1000 + '\',\'' + data[i].SubmissionTime + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + data[i].SubmissionTime + '</td><td>' + data[i].FreightMin + '</td><td>' + data[i].FreightPlus45 + '</td><td>' + data[i].FreightPlus100 + '</td><td>' + data[i].FreightPlus300 + '</td><td>' + data[i].FreightPlus500 + '</td><td>' + data[i].FreightPlus1000 + '</td><td>' + data[i].ExWorksMin + '</td><td>' + data[i].ExWorksPlus45 + '</td><td>' + data[i].ExWorksPlus100 + '</td><td>' + data[i].ExWorksPlus300 + '</td><td>' + data[i].ExWorksPlus500 + '</td><td>' + data[i].ExWorksPlus1000 + '</td></tr>')
                    }
                }
            }
            else {
                $('#tblquotedprices').append('<tr><td>No Record found</td></tr>');
                
            }
            
            jQuery.unblockUI();
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
function removeQuotationair(fmin,f45,f100,f300,f500,f1000,exmin,ex45,ex100,ex300,ex500,ex1000,subtym) {
    $('#deletepopup').modal('show')
    sessionStorage.setItem("fmin", fmin)
    sessionStorage.setItem("f45", f45)
    sessionStorage.setItem("f100", f100)
    sessionStorage.setItem("f300", f300)
    sessionStorage.setItem("f500", f500)
    sessionStorage.setItem("f1000", f1000)
    sessionStorage.setItem("exmin", exmin)
    sessionStorage.setItem("ex45", ex45)
    sessionStorage.setItem("ex100", ex100)
    sessionStorage.setItem("ex300", ex300)
    sessionStorage.setItem("ex500", ex500)
    sessionStorage.setItem("ex1000", ex1000)
    sessionStorage.setItem("subtym", subtym)
}
function removeQuotationPS(shname, price, subtime, psid, psheaderid) {
    $('#deletepopup').modal('show')
    sessionStorage.setItem("shname", shname)
    sessionStorage.setItem("price", price)
    sessionStorage.setItem("subtime", subtime)
    sessionStorage.setItem("psid", psid)
    sessionStorage.setItem("psheaderid", psheaderid)
}
function removeQuotationDOM(shname, price, subtime, psid, psheaderid, VHeaderID) {
    $('#deletepopup').modal('show')
     sessionStorage.setItem("VehicleID", shname)
    sessionStorage.setItem("OriginID", price)
    sessionStorage.setItem("DestinationID", subtime)
    sessionStorage.setItem("QPriceD", psid)
    sessionStorage.setItem("SubmissionTymD", psheaderid)
    sessionStorage.setItem("VHeaderID", VHeaderID)
}
function removeQuotationWare(persquare, manpower, infra, utility, subtym, fmanagemnt) {
    $('#deletepopup').modal('show')
    sessionStorage.setItem("persquarefeet", persquare)
    sessionStorage.setItem("manpower", manpower)
    sessionStorage.setItem("infra", infra)
    sessionStorage.setItem("utility", utility)
    sessionStorage.setItem("SubmissionTymW", subtym)
    sessionStorage.setItem("fixedManagement", fmanagemnt)
}
function removeQuotationSea(price, Exwork, subtym) {
    $('#deletepopup').modal('show')
    sessionStorage.setItem("PriceSea", price)
    sessionStorage.setItem("ExworkSea", Exwork)
    sessionStorage.setItem("SubmissionTymSea", subtym)

}
function deletePSquote() {

    var _cleanString = StringEncodingMechanism($('#txtremarks').val());
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }

    var QuoteProduct = {
        "VendorID": $('#ddlvendors').val(),
        "BidID": $('#ddlbid').val(),
        "ShortName": sessionStorage.getItem("shname"),
        "QuotedPrice": sessionStorage.getItem("price"),
        "SubmissionTime": sessionStorage.getItem("subtime"),
        "PSID": sessionStorage.getItem("psid"),
        "PSHeaderID": sessionStorage.getItem("psheaderid"),
        //"Remarks": $('#txtremarks').val(),
        "Remarks": _cleanString,
        "Attachment": AttachementFileName,
        "DeletedBy": sessionStorage.getItem("UserID")
      
    }
   // alert(JSON.stringify(QuoteProduct))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RemoveParticipatedQuotedPrices/RemovePSQuote/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(QuoteProduct),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
          
            if (data[0].Output == "1") {
                fileUploader($('#ddlbid').val())
                success1.show();
                $('#spansuccess1').html("Quoted Price deleted Successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                fetchparticationQuotes()
                $('#deletepopup').modal('hide')
                $('#txtremarks').val('')
                $('#fileToUpload').val('')
            }
            else if (data[0].Output == "99") {
                $('#deletepopup').modal('hide')
                bootbox.alert("You cant't delete entries more than 2 times for a vendor in a particular Bid.")
            }
            else {
                error2.show();
                $('#err').html('You have some error.Please try agian.');
                error2.fadeOut(3000);
                App.scrollTo(error2, -200);
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
function deleteDomesticQuote() {
    var _cleanString2 = StringEncodingMechanism($('#txtremarks').val());
  
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }

    var QuoteProduct = {
        "VendorID": $('#ddlvendors').val(),
        "BidID": $('#ddlbid').val(),
        "VehicleID": sessionStorage.getItem("VehicleID"),
        "OriginID": sessionStorage.getItem("OriginID"),
        "DestinationID": sessionStorage.getItem("DestinationID"),
        "SubmissionTime": sessionStorage.getItem("SubmissionTymD"),
        "VDomesticHeaderID": sessionStorage.getItem("VHeaderID"),
        "QuotedPrice": sessionStorage.getItem("QPriceD"),
        //"Remarks": $('#txtremarks').val(),
        "Remarks": _cleanString2,
        "Attachment": AttachementFileName,
        "DeletedBy": sessionStorage.getItem("UserID")

    }
    // alert(JSON.stringify(QuoteProduct))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RemoveParticipatedQuotedPrices/RemovedomesticQuote/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(QuoteProduct),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data[0].Output == "1") {
                fileUploader($('#ddlbid').val())
                success1.show();
                $('#spansuccess1').html("Quoted Price deleted Successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                fetchparticationQuotes()
                $('#deletepopup').modal('hide')
                $('#txtremarks').val('')
                $('#fileToUpload').val('')
            }
            else if (data[0].Output == "99") {
                $('#deletepopup').modal('hide')
                bootbox.alert("You cant't delete entries more than 2 times for a vendor in a particular Bid.")
            }
            else {
                error2.show();
                $('#err').html('You have some error.Please try agian.');
                error2.fadeOut(3000);
                App.scrollTo(error2, -200);
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
function deletewarehouseQuote() {
    var _cleanString3 = StringEncodingMechanism($('#txtremarks').val());
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }

    var QuoteProduct = {
        "VendorID": $('#ddlvendors').val(),
        "BidID": $('#ddlbid').val(),
        "PerSquareFeetRate": sessionStorage.getItem("persquarefeet"),
        "ManPowerCost": sessionStorage.getItem("manpower"),
        "InfrastructureCost": sessionStorage.getItem("infra"),
        "UtilitiesCost": sessionStorage.getItem("utility"),
        "FixedManagementFee": sessionStorage.getItem("fixedManagement"),
        "SubmissionTime": sessionStorage.getItem("SubmissionTymW"),
        //"Remarks": $('#txtremarks').val(),
        "Remarks": _cleanString3,
        "Attachment": AttachementFileName,
        "EnteredBy": sessionStorage.getItem("UserID")

    }
    // alert(JSON.stringify(QuoteProduct))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RemoveParticipatedQuotedPrices/RemoveWrehouseQuote/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(QuoteProduct),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data[0].Output == "1") {
                fileUploader($('#ddlbid').val())
                success1.show();
                $('#spansuccess1').html("Quoted Price deleted Successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                fetchparticationQuotes()
                $('#deletepopup').modal('hide')
                $('#txtremarks').val('')
                $('#fileToUpload').val('')
            }
            else if (data[0].Output == "99") {
                $('#deletepopup').modal('hide')
                bootbox.alert("You can not delete entries more than 2 times for a vendor in a particular Bid.")
            }
            else {
                error2.show();
                $('#err').html('You have some error.Please try agian.');
                error2.fadeOut(3000);
                App.scrollTo(error2, -200);
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
function deleteseaQuote() {
    var _cleanString4 = StringEncodingMechanism($('#txtremarks').val());

    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }

    var QuoteProduct = {
        "VendorID": $('#ddlvendors').val(),
        "BidID": $('#ddlbid').val(),
        "Price": sessionStorage.getItem("PriceSea"),
        "ExWorks": sessionStorage.getItem("ExworkSea"),
        "SubmissionTime": sessionStorage.getItem("SubmissionTymSea"),
        //"Remarks": $('#txtremarks').val(),
        "Remarks": _cleanString4,
        "Attachment": AttachementFileName,
        "EnteredBy": sessionStorage.getItem("UserID")

    }
   // alert(JSON.stringify(QuoteProduct))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RemoveParticipatedQuotedPrices/RemoveSeaQuote/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(QuoteProduct),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data[0].Output == "1") {
                fileUploader($('#ddlbid').val())
                success1.show();
                $('#spansuccess1').html("Quoted Price deleted Successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                fetchparticationQuotes()
                $('#deletepopup').modal('hide')
                $('#txtremarks').val('')
                $('#fileToUpload').val('')
            }
            else if (data[0].Output == "99") {
                $('#deletepopup').modal('hide')
                bootbox.alert("You can not delete entries more than 2 times for a vendor in a particular Bid.")
            }
            else {
                error2.show();
                $('#err').html('You have some error.Please try agian.');
                error2.fadeOut(3000);
                App.scrollTo(error2, -200);
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
function deleteAirQuote() {
    var _cleanString5 = StringEncodingMechanism($('#txtremarks').val());

    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }
  

    var QuoteProduct = {
        "VendorID": $('#ddlvendors').val(),
        "BidID": $('#ddlbid').val(),
        "FreightMin": sessionStorage.getItem("fmin"),
        "FreightPlus45": sessionStorage.getItem("f45"),
        "FreightPlus100": sessionStorage.getItem("f100"),
        "FreightPlus300": sessionStorage.getItem("f300"),
        "FreightPlus500": sessionStorage.getItem("f500"),
        "FreightPlus1000": sessionStorage.getItem("f1000"),
        "ExWorksMin": sessionStorage.getItem("exmin"),
        "ExWorksPlus45": sessionStorage.getItem("ex45"),
        "ExWorksPlus100": sessionStorage.getItem("ex100"),
        "ExWorksPlus300": sessionStorage.getItem("ex300"),
        "ExWorksPlus500": sessionStorage.getItem("ex500"),
        "ExWorksPlus1000": sessionStorage.getItem("ex1000"),
       
        "SubmissionTime": sessionStorage.getItem("subtym"),
        //"Remarks": $('#txtremarks').val(),
        "Remarks": _cleanString5,
        "Attachment": AttachementFileName,
        "EnteredBy": sessionStorage.getItem("UserID")

    }
    // alert(JSON.stringify(QuoteProduct))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RemoveParticipatedQuotedPrices/RemoveairQuote/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(QuoteProduct),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data[0].Output == "1") {
                fileUploader($('#ddlbid').val())
                success1.show();
                $('#spansuccess1').html("Quoted Price deleted Successfully..");
                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                fetchparticationQuotes()
                $('#deletepopup').modal('hide')
                $('#txtremarks').val('')
                $('#fileToUpload').val('')
            }
            else if (data[0].Output == "99") {
                $('#deletepopup').modal('hide')
                bootbox.alert("You can not delete entries more than 2 times for a vendor in a particular Bid.")
            }
            else {
                error2.show();
                $('#err').html('You have some error.Please try agian.');
                error2.fadeOut(3000);
                App.scrollTo(error2, -200);
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
$('#deletepopup').on('hidden.bs.modal', function () {
    $('#txtremarks').val('');
    
});
function fileUploader(bidID) {

    var fileTerms = $('#fileToUpload');

    var fileDataTerms = fileTerms.prop("files")[0];

    var formData = new window.FormData();

    formData.append("fileTerms", fileDataTerms);
    formData.append("AttachmentFor", 'ManageBid');

    formData.append("BidID", bidID);
    formData.append("VendorID", '');
 $.ajax({

        url: 'ConfigureFileAttachment.ashx',
        data: formData,
        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function (data) {

        },

        error: function () {

            bootbox.alert("Attachment error.");

        }

    });

}
jQuery("#txtvendor").keyup(function () {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
});

jQuery("#txtvendor").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllBidsVendor');
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
        sessionStorage.setItem('hdnselectedEmail', map[item].EmailId);
        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});

function FetchVenderNotInvited(bidid) {
 
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=&BidID=" + bidid + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#tblvendorlist > tbody").empty();
            if (data.length > 0) {
                $('#inviteVendorBody').show();
                for (var i = 0; i < data.length; i++) {
                    var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input class=\"chkboxwithval\"  type=\"checkbox\" Onclick=\"Check(this)\"; id=\"chkvender\" value=" + (data[i].VendorID + ',' + data[i].EmailId) + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].VendorName + " </td></tr>";
                    jQuery('#tblvendorlist > tbody').append(str);
                }
            }
            else {
                $('#inviteVendorBody').hide();
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
$("#chkAll").click(function () {
    if ($("#chkAll").is(':checked') == true) {
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
        });
    }
    else {
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").removeClass("checked");
        });
    }
});

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
function resetpasswordForBidVendor() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
    if (sessionStorage.getItem("hdnbid") == '0') {
       error1.show();
        $('#spandanger').html('Please select Bid...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        gritternotification('Please select Bid!!!');
        jQuery.unblockUI();
      
        return false;

    }
    else if(sessionStorage.getItem("hdnselectedvendor")=="0") {
        error1.show();
        $('#spandanger').html('Please select Vendor...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        jQuery.unblockUI();
       // gritternotification('Please select Vendor!!!');
        return false;
    }
    else{
        var data = {
            "EmailId": sessionStorage.getItem("hdnselectedEmail"),
            "BidId": sessionStorage.getItem("hdnbid"),
            "VendorID": sessionStorage.getItem("hdnselectedvendor"),
            "UserID": sessionStorage.getItem("UserID")
        
        }
      //alert(JSON.stringify(data))
        jQuery.ajax({
            url: APIPath + "ResetInviteVendor/ResetPassword",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                if (data[0].Flag = "1") {
                    success1.show();
                    $('#spansuccess1').html('New password is sent to registered email of vendor..');
                    clearsession()
                    success1.fadeOut(6000);
                    App.scrollTo(success1, -200);
                    jQuery.unblockUI();
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


}
function clearsession() {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
    sessionStorage.setItem('hdnbid', '0');
    sessionStorage.setItem("hdnbidtypeid", '0')
    jQuery("#txtvendor").val('')
    jQuery("#ddlbid").val('')
  
}
function invitevendors() {
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("hdnbid") == '0') {
        error1.show();
        $('#spandanger').html('Please select Bid...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        jQuery.unblockUI();
        gritternotification('Please select Bid!!!');
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

               checkedValue = checkedValue + " select  " + sessionStorage.getItem("hdnbid") + ",'" + temp[1] + "','N','" + temp[0] + "'  union";
           }
       });
       if (checkedValue != '') {
           checkedValue = 'insert into BidVendorDetails(BidId,EmailId,MailSent,VendorID) ' + checkedValue
           checkedValue = checkedValue.substring(0, checkedValue.length - 6);
       }
       
       var data = {
           "QueryString": checkedValue,
           "BidId": sessionStorage.getItem("hdnbid"),
           "BidTypeID": sessionStorage.getItem("hdnbidtypeid"),
           "UserID": sessionStorage.getItem("UserID")
       }
     //  alert(JSON.stringify(data))
       jQuery.ajax({
           url: APIPath + "ResetInviteVendor/Invitevendors",
           beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
           data: JSON.stringify(data),
           type: "POST",
           contentType: "application/json",
           success: function (data) {
               if (data[0].Flag == "1") {
                   success1.show();
                   $('#spansuccess1').html('Vendor Invited Successfully..');
                  
                   clearsession()
                  
                   
                   success1.fadeOut(3000);
                   App.scrollTo(success1, -200);
                   jQuery.unblockUI();
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
      
        return true;
    }
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


//Time Extension Feature 4th TAB

var SeId = 0;
function fetchallexportdetails() {
    $('#extendedDurationPara').hide();
    var replaced1 = '';
    var replaced2 = '';
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchSeaExportConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + jQuery('#ddlbid option:selected').val() + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchSeaExportConfigurationData/?BidID=" + jQuery('#ddlbid option:selected').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(BidData) {

            $('#BidPreviewDiv').show()
            jQuery('#mapedapproverPrev').html('');

            jQuery('#txtBidSubjectPrev').html(BidData[0].BidDetails[0].BidSubject)
            
            jQuery('#txtbiddescriptionPrev').html(BidData[0].BidDetails[0].BidDetails)
            jQuery('#txtbidDatePrev').html(BidData[0].BidDetails[0].BidDate)
            jQuery('#txtbidTimePrev').html(BidData[0].BidDetails[0].BidTime)
            jQuery("#dropCurrencyPrev").html(BidData[0].BidDetails[0].CurrencyID)
            jQuery('#txtConversionRatePrev').html(BidData[0].BidDetails[0].ConversionRate)
           
            $('#hdnClosingval').val(BidData[0].BidDetails[0].BidClosingType)
            
            if (BidData[0].BidDetails[0].BidClosingType == "A") {
                SeId = 0;
                $('#spinner4').show()
                $('#btndiv').show()
                $('#txtbidduration').hide()
                $('#spinner4').spinner({ value: BidData[0].BidDetails[0].BidDuration, step: 1, min: 0, max: 200 });
                jQuery('#ddlbidclosetypePrev').html('All items in one go')
                $(".staggered-item").show();

            }
            else if (BidData[0].BidDetails[0].BidClosingType == "S") {

                $('#spinner4').hide()
                $('#btndiv').hide()
                $('#txtbidduration').show()
                $('#txtbidduration').html(BidData[0].BidDetails[0].BidDuration)
                jQuery('#ddlbidclosetypePrev').html('Stagger at: Item level')
            } else {
                $("#head-stagger").hide();
                $(".staggered-item").hide();
                $('#spinner4').show()
                $('#btndiv').show()
                $('#txtbidduration').hide()
                $('#spinner4').spinner({ value: BidData[0].BidDetails[0].BidDuration, step: 1, min: 0, max: 200 });
                
                $('#hdnClosingval').val('A')
            }


            if (BidData[0].BidDetails[0].TermsConditions != '') {

                $('#file1').attr('disabled', true);
                $('#closebtn').removeClass('display-none');

                replaced1 = BidData[0].BidDetails[0].TermsConditions.replace(/\s/g, "%20")

                if (BidData[0].BidDetails[0].Attachment != '') {
                    if (BidData[0].BidDetails[0].Attachment != null) {
                        $('#file2').attr('disabled', true);
                        $('#closebtn2').removeClass('display-none');

                        replaced2 = BidData[0].BidDetails[0].Attachment.replace(/\s/g, "%20")
                    }
                }



            }
            $('#filepthtermsPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + replaced1).html(BidData[0].BidDetails[0].TermsConditions);
            $('#filepthattachPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + replaced2).html(BidData[0].BidDetails[0].Attachment);

            if (BidData[0].BidApproverDetails.length > 0) {
                for (var i = 0; i < BidData[0].BidApproverDetails.length; i++) {

                    jQuery('#mapedapproverPrev').append(jQuery('<option selected></option>').val(BidData[0].BidApproverDetails[i].UserID).html(BidData[0].BidApproverDetails[i].ApproverName))
                }
            }


            jQuery("#tblServicesProductPrev").empty();
            if (BidData[0].BidSeaExportDetails.length > 0) {



                $('#wrap_scrollerPrev').show();

                if ($('#hdnClosingval').val() == "S") {
                    $(".staggered-item").show();

                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Destination Port</th><th>Remarks</th><th>TargetRate</th><th>Quantity</th><th>Start Unit Price</th><th class=hide>Mask Vendor</th><th style='width:60px !important'>Minimum<br/>Decrement</th><th>Decrement On</th><th>Last<br/>Invoice Price</th><th>Item<br/>Duration(Min)</th><th>Closing Time</th><th style=width:200px>Bid Duration<br/>(in minutes)</th></tr></thead>");
                }
                else {

                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Destination Port</th><th>Remarks</th><th>TargetRate</th><th>Quantity</th><th>Start Unit Price</th><th class=hide>Mask Vendor</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th></tr></thead>");
                }

                for (var i = 0; i < BidData[0].BidSeaExportDetails.length; i++) {


                    var decrementon = ''

                    if (BidData[0].BidSeaExportDetails[i].DecreamentOn == 'A')
                        decrementon = 'Price'
                    else
                        decrementon = '%age'


                    if ($('#hdnClosingval').val() == "S") {
                        
                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].BidSeaExportDetails[i].DestinationPort + '</td><td>' + BidData[0].BidSeaExportDetails[i].Remarks + '</td><td>' + BidData[0].BidSeaExportDetails[i].Targetprice + '</td><td>' + BidData[0].BidSeaExportDetails[i].Quantity + '</td><td>' + BidData[0].BidSeaExportDetails[i].CeilingPrice + '</td><td class=hide>' + BidData[0].BidSeaExportDetails[i].MaskVendor + '</td><td>' + BidData[0].BidSeaExportDetails[i].MinimumDecreament + '</td><td>' + decrementon + '</td><td class=hide>' + BidData[0].BidSeaExportDetails[i].DecreamentOn + '</td><td>' + BidData[0].BidSeaExportDetails[i].LastInvoicePrice + '</td><td>' + BidData[0].BidSeaExportDetails[i].ItemBidDuration + '</td><td>' + BidData[0].BidSeaExportDetails[i].ItemClosingTime + '</td><td><div class="pull-left"> <div id=spinner' + i + ' class="pull-left"><div class="input-group" style="width:110px;"><div class="spinner-buttons input-group-btn "><button type="button" class="btn spinner-up blue btn-sm"><i class="fa fa-plus"></i></button></div><input type=text class="spinner-input form-control input-sm" id=txtitemBidDuration' + i + ' maxlength="3" readonly><div class="spinner-buttons input-group-btn"><button type="button" class="btn spinner-down red btn-sm"><i class="fa fa-minus"></i></button> </div></div></div><button id="btnextendA" type="button" class="btn green btn-sm" onclick="fnTimeUpdateS(\'' + i + '\',\'' + BidData[0].BidSeaExportDetails[i].SEID + '\')">Go</button><div class="col-md-12"><p class="form-control-static" id=extendedDuration' + i + ' style="color:#3c763d; font-weight: 600; display: none;">Time&nbsp;Extended&nbsp;Successfully</p></div></td></tr>');
                        $('#spinner' + i).spinner({ value: 0, step: 1, min: 0, max: 200 }); //BidData[0].BidSeaExportDetails[i].ItemBidDuration
                    }
                    else {

                        jQuery("#tblServicesProductPrev").append("<tr id=tridPrev" + i + "><td>" + BidData[0].BidSeaExportDetails[i].DestinationPort + "</td><td>" + BidData[0].BidSeaExportDetails[i].Remarks + "</td><td>" + BidData[0].BidSeaExportDetails[i].Targetprice + "</td><td>" + BidData[0].BidSeaExportDetails[i].Quantity + "</td><td>" + BidData[0].BidSeaExportDetails[i].CeilingPrice + "</td><td class=hide>" + BidData[0].BidSeaExportDetails[i].MaskVendor + "</td><td>" + BidData[0].BidSeaExportDetails[i].MinimumDecreament + "</td><td>" + decrementon + "</td><td class=hide>" + BidData[0].BidSeaExportDetails[i].DecreamentOn + "</td><td>" + BidData[0].BidSeaExportDetails[i].LastInvoicePrice + '</td></tr>');
                    }

                   
                }
                jQuery('#selectedvendorlistsPrev> tbody').empty()

                for (var i = 0; i < BidData[0].BidVendorDetails.length; i++) {

                    jQuery('#selectedvendorlistsPrev').append('<tr ><td class=hide>' + BidData[0].BidVendorDetails[i].VendorID + '</td><td>' + BidData[0].BidVendorDetails[i].EmailId + '</td></tr>')
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

function fnTimeUpdateS(index, seaid) {

    SeId = seaid


    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Data = {
        "BidClosingType": $('#hdnClosingval').val(),
        "BidID": jQuery('#ddlbid').val(),
        "BidDuration": jQuery('#txtitemBidDuration' + index).val(),
        "SEID": SeId
    }
    // alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/UpdateBidTime/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {

            if (data[0].Status == "1") {
                $('#extendedDuration' + index).show()

            }
            else if (data[0].Status == "-1") {
                $('#extendedDuration' + index).text("This Item is already expired.").css('color', 'red')
                $('#extendedDuration' + index).show()

            }
            setTimeout(function() { fetchallexportdetails() }, 5000)
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}

function fnTimeUpdate() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Data = {
        "BidClosingType": $('#hdnClosingval').val(),
        "BidID": jQuery('#ddlbid').val(),
        "BidDuration": jQuery('#txtBidDurationPrev').val(),
        "SEID": 0


    }
    //alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/UpdateBidTime/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {

            if (data[0].Status == "1") {
                $('#extendedDurationPara').show()
            }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}