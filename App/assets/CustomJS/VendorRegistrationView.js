
jQuery(document).ready(function () {
    Pageloaded()
    var x = isAuthenticated();
    Metronic.init();
    fetchCategorymaster1();
    $('#ddlTypeofProduct').select2({
        placeholder: "Type of Product",
        allowClear: true
    });
    Layout.init();

    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);
    var _tmpVendorID = getUrlVarsURL(decryptedstring)["tmpVendorID"];

    var _VendorID = getUrlVarsURL(decryptedstring)["VendorID"];
    var _VRID = getUrlVarsURL(decryptedstring)["VRID"];

    var _NVendorID;
    if (_VendorID == undefined && _VendorID == null) {
        _NVendorID = 0;
    } else {
        _NVendorID = _VendorID;
    }

    if (_tmpVendorID == null) {
        sessionStorage.setItem('tmpVendorID', 0)
        sessionStorage.setItem('VendorID', _NVendorID);
        //fetchCategorymaster1();
    } else {
        sessionStorage.setItem('tmpVendorID', _tmpVendorID);
        sessionStorage.setItem('VendorID', _NVendorID);
        sessionStorage.setItem('VRID', _VRID);
        //fetchCategorymaster1();
        //fetchVendorRegistrationDetails();
    }

    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem("UserType") == "E") {
        $('.page-container').show();
    }
    //fetchCategorymaster1();
    fetchVendorRegistrationDetails();
    //FormValidate();
    ComponentsPickers.init();
});

function fetchCategorymaster1() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&For=M&MappedBy=a&VendorID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#ddlTypeofProduct").empty();
            var vlal = new Array();
            if (data.length > 0) {
                fetchVendorRegistrationDetails

                for (var i = 0; i < data.length; i++) {
                    $("#ddlTypeofProduct").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }

                $("#ddlTypeofProduct").trigger("change");

            }
            else {
                $("#ddlTypeofProduct").append('<tr><td>No categories found..</td></tr>');
            }
            jQuery.unblockUI();
        },

        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
        }


    });
}

function fetchVendorRegistrationDetails() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var selectedValues = [];
    jQuery.ajax({

        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchVendorRequest?tmpVendorID=" + sessionStorage.getItem('tmpVendorID') + "&VendorID=" + sessionStorage.getItem('VendorID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (json) {

            var companydetails = JSON.parse(json[0].jsondata);
            if (json.length > 1) {

                var categorydetails = JSON.parse(json[1].jsondata);

                var categoryresult = categorydetails.map(function (val) {
                    selectedValues.push(val.CategoryID);
                });

                $("#ddlTypeofProduct").select2().val(selectedValues).trigger("change");

            }

            sessionStorage.setItem('tmpVendorID', companydetails[0].tmpVendorID);
            if (companydetails[0].PM[0].paymentTerm != "" && companydetails[0].PM[0].paymentTerm != null && companydetails[0].PM[0].paymentTerm != undefined) {
                jQuery('#paymentterms').html(companydetails[0].PM[0].paymentTerm);
            }
            else {
                jQuery('#paymentterms').html();
            }

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

            if (companydetails[0].PreviousTurnover != "" && companydetails[0].PreviousTurnover != null && companydetails[0].PreviousTurnover != undefined) {
                jQuery('#lastFY').html(companydetails[0].currencyLastFY + ' ' + companydetails[0].PreviousTurnover);
            }
            else {
                jQuery('#lastFY').html();
            }

            if (companydetails[0].SecondLastTurnover != "" && companydetails[0].SecondLastTurnover != null && companydetails[0].SecondLastTurnover != undefined) {
                jQuery('#seclastFY').html(companydetails[0].currencyLast2FY + ' ' + companydetails[0].SecondLastTurnover);
            }
            else {
                jQuery('#seclastFY').html();
            }


            if (companydetails[0].pinCode != "" && companydetails[0].pinCode != null && companydetails[0].pinCode != undefined) {
                jQuery('#pincode').html(companydetails[0].pinCode);
            }
            else {
                jQuery('#pincode').html('');
            }

            jQuery('#gstvendorclass').html(gstclass);
            jQuery('#gstno').html(companydetails[0].ServiceTaxNo);
            jQuery('#natureofest').html(companydetails[0].EstName);
            jQuery('#vendortype').html(companydetails[0].VendorCatName);
            jQuery('#product').html(companydetails[0].product);
            jQuery('#companyname').html(companydetails[0].VendorName);
            jQuery('#address').html(companydetails[0].Address1);
            jQuery('#country').html(companydetails[0].CountryName);
            jQuery('#state').html(companydetails[0].StateName);
            jQuery('#city').html(companydetails[0].CityName);
            //jQuery('#pincode').html(companydetails[0].pincode);
            jQuery('#panno').html(companydetails[0].PANNo);
            jQuery('#panfilename').html(companydetails[0].PANFile);
            jQuery('#TDStype').html(companydetails[0].TDSTypeName);
            jQuery('#tanno').html(companydetails[0].TAN);
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
            jQuery('#txtLastFiscalyear').html(companydetails[0].PreviousTurnoverYear);
            jQuery('#SecondLastTurnoverYear').html(companydetails[0].SecondLastTurnoverYear);
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

//function DownloadFile(aID) {
//    fnDownloadAttachments($("#" + aID.id).html(), 'VR/' + sessionStorage.getItem('tmpVendorID'));
//}

function DownloadFile(aID) {
    if (sessionStorage.getItem('VendorID') != 0)
        fnDownloadAttachments($("#" + aID.id).html(), 'VR/' + sessionStorage.getItem('VendorID'));
    else
        fnDownloadAttachments($("#" + aID.id).html(), 'VR/Temp/' + sessionStorage.getItem('tmpVendorID'));
}

function ApproveRFI(For) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var selected = [];
    var selectedid = [];
    var selectedidss = '';
    var result = '';
    var remarks;

    //alert($("#ddlTypeofProduct").select2('data').length)
    if (For == 'R') {
        remarks = $('#txtrejectreason').val()
    } else {
        remarks = $('#txtparkreason').val()
    }

    if (For == 'A' && $("#ddlTypeofProduct").select2('data').length == 0) {
        $('#requirederror').removeClass('hide');
        $('#companydetails').removeClass('collapsed');
        $('#collapse0').removeClass('collapse in');
        $('#collapse0').removeAttr('style');
        jQuery.unblockUI();
    } else {
        $.each($("#ddlTypeofProduct").select2('data'), function (key, item) {
            selectedid.push(item.id);
            selected.push(item.text);
            //jQuery("#ddlTypeofProduct").append(item.id).join('#');
            $("#ddlTypeofProduct").append($("#ddlTypeofProduct").text(item.id) + '#');
            result += selectedidss.concat(item.id, "#");

        });
        straddedproduct = result.slice('#', -1);
        var VRID = 0
        if (sessionStorage.getItem('VRID') != null) {
            VRID = sessionStorage.getItem('VRID');
        }
        var data = {
            "tmpVendorID": parseInt(sessionStorage.getItem('tmpVendorID')),
            "status": For,
            'approverID': sessionStorage.getItem('UserID'),
            'customerID': parseInt(sessionStorage.getItem('CustomerID')),
            'vendorCode': $('#hdnvendorCode').val(),
            'VRID': parseInt(VRID),
            'Remarks': remarks,
            'productCat': straddedproduct

        }
        // alert(JSON.stringify(data))
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

                bootbox.alert("Data updated successfully.", function () {
                    window.location = sessionStorage.getItem("HomePage")
                    return false;
                });

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText;
                if (xhr.status === 401) {
                    error401Messagebox(err.Message);
                } else {
                    fnErrorMessageText('spandanger', '');
                }

                return false;
                jQuery.unblockUI();
            }
        });
        jQuery.unblockUI();
    }

}

$('#rejectionReason').on('hidden.bs.modal', function () {
    $('#txtrejectreason').val('');
    $('#txtparkreason').val('');
    $("#rejectionForm").validate().resetForm();
    $("#rejectionForm").find('.has-error').removeClass("has-error");
});

function fnremoveMsz() {
    $('#requirederror').addClass('hide')
}

