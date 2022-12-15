

function addMoreAttachment1() {

    _count = ($("#tblAttachmentsElem > li").length + 1);

    console.log("count ==> ", _count);

    $("#tblAttachmentsElem").append('<li><div class="inputgroup">' +

        '<label class="control-label col-md-3"  style="text-align:left">Attachment</label>' +

        '<div class="col-md-4">' +

        '<input type="text" class="form-control" placeholder="Attachment Description" id="txtattachdescription" tabindex="5" name="txtattachdescription" autocomplete="off" />' +

        '</div>' +

        '<div class="col-md-3">' +

        '<input type="file" id=file' + _count + ' class="form-control"  tabindex="4" onchange="checkfilesizeMultiple(this)" />' +

        '<span class="help-block"><a id=attach-file' + _count + ' href="javascript:;" style="text-decoration: none !important;"></a></span>' +

        '</div>' +

        '<div class="col-md-2" style=" padding-left:0px !important; ">' +

        '<a href="javascript:void(0);" class="btn btn-sm blue" onclick="addMoreAttachment()"><i class="fa fa-plus"></i></a>' +

        '</div>' +

        '</div></li>'

    );

}

function fetchCategorymaster1() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
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
                for (var i = 0; i < data.length; i++) {
                    $("#ddlTypeofProduct").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }
                //$("#ddlTypeofProduct").trigger("change");
            }
            else {
                $("#ddlTypeofProduct").append('<tr><td>No categories found..</td></tr>');
            }
            // jQuery.unblockUI();
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


function fetchCountry() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/Country/?CountryID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlCountry").empty();
            var vlal = new Array();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCountry").append("<option value=" + data[i].countryID + ">" + data[i].countryName + "</option>");
                }
                $("#ddlCountry").val('111').trigger("change");
            }
            else {
                $("#ddlCountry").append('<tr><td>No countries found..</td></tr>');
            }

            // jQuery.unblockUI();
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

function fetchState() {
    var countryid = $('#ddlCountry option:selected').val();
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/State/?CountryID=" + countryid + "&StateID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlState").empty();
            if (data.length > 0) {

                $("#ddlState").append("<option value=0>Select State</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddlState").append("<option value=" + data[i].stateID + ">" + data[i].stateName + "</option>");
                }
                $("#ddlState").trigger("change");
            }
            else {
                $("#ddlState").append('<tr><td>No state found..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;
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

function fetchCity() {
    var stateid = $('#ddlState').val();
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/City/?StateID= " + stateid + "&CityID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlCity").empty();
            if (data.length > 0) {
                $("#ddlCity").append("<option value=0>Select City</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCity").append("<option value=" + data[i].cityID + ">" + data[i].cityName + "</option>");
                }
                $("#ddlCity").val('0').trigger("change");
            }
            else {
                $("#ddlCity").append('<tr><td>No city found..</td></tr>');
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

function fetchProduct() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchProducts?CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#ddlProduct").empty();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#ddlProduct").append("<option value=" + data[i].productID + ">" + data[i].productName + "</option>");
                }
                //$("#ddlProduct").trigger("change");
            }
            else {
                $("#ddlProduct").append('<tr><td>No products found..</td></tr>');
            }

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

function fetchTDS() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchTDS",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#ddlTds").empty();
            if (data.length > 0) {

                $("#ddlTds").append("<option value=0>Select Type of TDS</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddlTds").append("<option value=" + data[i].tdsID + ">" + data[i].tds + "</option>");
                }
                $("#ddlTds").trigger("change");
            }
            else {
                $("#ddlTds").append('<tr><td>No tds found..</td></tr>');
            }

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

function fetchPaymentTerms() {

    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchPaymentTerms?CustomerID=1",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            $("#ddPayTerms").empty();
            if (data.length > 0) {

                $("#ddPayTerms").append("<option value=0>Select Payment Terms</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddPayTerms").append("<option value=" + data[i].termID + ">" + data[i].paymentTerm + "</option>");
                }

                //$("#ddPayTerms").trigger("change");
            }
            else {
                $("#ddPayTerms").append('<tr><td>No payment terms found..</td></tr>');
            }

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

function getPan(pan) {
    var pan = $('#txtGst').val().substr(2, 10); //11
    if ($('#txtGst').val().length == 15) {
        $('#txtPan').val(pan.toUpperCase());
        $('#txtGst').val($('#txtGst').val().toUpperCase())
        $('#txtPan').attr('disabled', 'disabled')
        //$('#txtGst').attr('disabled', 'disabled')
    }
}

/*function fetchMsme() {
    var msmecheck = $("#ddlMSME option:selected").val();
    if (msmecheck == 'Y') {
        $('.hideInput').removeClass('hide');
    } else {
        $('.hideInput').addClass('hide');
    }
}*/
function fetchMsme() {

    if (jQuery("#ddlMSME option:selected").val() == 'Y') {
        $('.hideInput').removeClass('hide');
        $('#submit_form').validate();
        $('input[name="txtUdyam"]').rules('add', {
            required: true
        });
        $('input[name="filemsme"]').rules('add', {
            required: true
        });
        $('#ddlMSMEClass').rules('add', {
            required: true
        });


    } else {
        $('.hideInput').addClass('hide');
        $('input[name="filemsme"]').rules('remove');
        $('input[name="txtUdyam"]').rules('remove');
        $('input[name="ddlMSMEClass"]').rules('remove');
    }
}
function SubmitVendorRegistration() {
    var _cleanString = StringEncodingMechanism($("#ddlCompanyName").val().trim());
    var _cleanString2 = StringEncodingMechanism($("#txtBank").val().trim());
    var _cleanString3 = StringEncodingMechanism($("#txtAccountHolder").val().trim());
    var _cleanString4 = StringEncodingMechanism($("#txtContName").val().trim());
    var _cleanString5 = StringEncodingMechanism($("#txtContName2").val().trim());

    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var selected = [];
    var selectedid = [];
    var selectedidss = '';
    var result = '';

    if ($("#ddlTypeofProduct").select2('data').length) {
        $.each($("#ddlTypeofProduct").select2('data'), function (key, item) {
            selectedid.push(item.id);
            selected.push(item.text);
            $("#ddlTypeofProduct").append($("#ddlTypeofProduct").text(item.id) + '#');
            result += selectedidss.concat(item.id, "#");

        });
        straddedproduct = result.slice('#', -1);

        var msmetype = $("#ddlMSMEClass").val().trim();
        var gstclass = $("#ddlGSTclass").val().trim();
        var tds = $("#ddlTds option:selected").val().trim();
        var paymentterm = $("#ddPayTerms").val().trim();
        if (msmetype == 'Select') {
            var msmeselectvalue = "";
        } else {
            var msmeselectvalue = $("#ddlMSMEClass").val().trim();
        }
        if (gstclass == '') {
            var gstclassvalue = "";
        } else {
            var gstclassvalue = $("#ddlGSTclass").val().trim();
        }
        if (tds == 0) {
            var tdsvalue = "";
        } else {
            var tdsvalue = $("#ddlTds option:selected").text().trim();
        }
        if (paymentterm == 0) {
            var paymenttermvalue = 0;
        } else {
            var paymenttermvalue = parseInt($("#ddPayTerms").val());
        }

        var gstfilename = $('#filegst').val().substring(jQuery('#filegst').val().lastIndexOf('\\') + 1)
        gstfilename = gstfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var panfilename = $('#filepan').val().substring(jQuery('#filepan').val().lastIndexOf('\\') + 1)
        panfilename = panfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var msmefilename = $('#filemsme').val().substring(jQuery('#filemsme').val().lastIndexOf('\\') + 1)
        msmefilename = msmefilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var checkfilename = $('#filecheck').val().substring(jQuery('#filecheck').val().lastIndexOf('\\') + 1)
        checkfilename = checkfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var VendorInfo = {

            "customerID": parseInt(sessionStorage.getItem('CustomerID')),
            "estTypeID": parseInt($("#ddlNatureEstaiblishment").val()),
            "estName": $("#ddlNatureEstaiblishment option:selected").text(),
            "vendorCatID": parseInt($("#ddlVendorType").val()),
            "vendorCatName": $("#ddlVendorType option:selected").text().trim(),
            "product": $("#txtProduct").val(),
            //"vendorName": $("#ddlCompanyName").val().trim(),
            "vendorName": _cleanString,
            "vendorAdd": $("#txtAdd1").val().trim(),
            "countryID": parseInt($("#ddlCountry").val()),
            "countryName": $("#ddlCountry option:selected").text().trim(),
            "stateID": parseInt($("#ddlState").val()),
            "stateName": $("#ddlState option:selected").text().trim(),
            "cityID": parseInt($("#ddlCity").val()),
            "cityName": $("#ddlCity option:selected").text().trim(),
            "pinCode": $("#txtPin").val().trim(),
            "pAN": $("#txtPan").val().trim(),
            "tAN": $("#txtTan").val().trim(),
            "tDSTypeId": parseInt($("#ddlTds option:selected").val().trim()),
            "tDSTypeName": tdsvalue,
            "gSTClass": gstclassvalue,
            "ServiceTaxNo": $("#txtGst").val().trim(),
            "payTermID": paymenttermvalue,
            //"bankName": $("#txtBank").val().trim(),
            "bankName": _cleanString2,
            "bankAccount": $("#txtAcNo").val().trim(),
            "iFSCCode": $("#txtIFSC").val().trim(),
            //"accountName": $("#txtAccountHolder").val().trim(),
            "accountName": _cleanString3,
            "mSMECheck": $("#ddlMSME option:selected").val(),
            "mSMEType": msmeselectvalue,
            "mSMENo": $("#txtUdyam").val().trim(),
            "previousTurnover": $("#txtLastFiscal").val().trim(),
            "secondLastTurnover": $("#txt2LastFiscal").val().trim(),
            "previousTurnoverYear": $("#txtLastFiscalyear").val().trim(),
            "secondLastTurnoverYear": $("#txt2LastFiscalyear").val().trim(),
            //"contactName": $("#txtContName").val().trim(),
            "contactName": _cleanString4,
            "contactEmailID": $("#txtEmail").val().trim(),
            "mobile": $("#txtMobile").val().trim(),
            //"contactNameMD": $("#txtContName2").val().trim(),
            "contactNameMD": _cleanString5,
            "mobileMD": $("#txtMobile2").val().trim(),
            "AltEmailID": $("#txtEmail2").val().trim(),
            "gSTFile": gstfilename,
            "pANFile": panfilename,
            "mSMEFile": msmefilename,
            "cancelledCheck": checkfilename,
            "productCat": straddedproduct,
            "currencyLastFY": $("#currencyLastFiscal option:selected").val(),
            "currencyLast2FY": $("#currency2LastFiscal option:selected").val(),
        }
    };

    console.log(JSON.stringify(VendorInfo));
    alert(JSON.stringify(VendorInfo))
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "VendorRequest/VendorRequestSubmit",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(VendorInfo),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            //alert(data.length);
            $('#hdntmpvendorid').val(data);
            if ($('#filegst').val() != '') {

                fnUploadFilesonAzure('filegst', gstfilename, 'VR/Temp/' + data);

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/Temp/' + data);

            }

            if ($('#filemsme').val() != '') {
                fnUploadFilesonAzure('filemsme', msmefilename, 'VR/Temp/' + data);

            }

            if ($('#filecheck').val() != '') {
                fnUploadFilesonAzure('filecheck', checkfilename, 'VR/Temp/' + data);

            }

            $('#divsuccvendor').show();
            $('#spansuccessvendor').text("Vendor Request Submitted successfully");
            $('#spansuccessvendor').fadeOut(6000);
            setTimeout(function () {
                $("#registerParticipantModal").modal("hide");
                // fnFormClear(); //Create reset Function
                jQuery.unblockUI();
            }, 6000)


        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerterr', '');
            }
            jQuery.unblockUI();
            return false;
        }

    });

}

function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'tempVR/' + sessionStorage.getItem('tmpVendorID'));
}

function fetchCategorymaster() {

    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=M&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VendorID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            $("#ddlCategoryMultiple").empty();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCategoryMultiple").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }
                $("#ddlCategoryMultiple").trigger("change");

            }
            else {
                $("#ddlCategoryMultiple").append('<tr><td>No categories found..</td></tr>');
            }
            // jQuery.unblockUI();
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
function fetchRFIDetails() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced = '', _selectedCat = new Array();
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VQID=" + sessionStorage.getItem('CurrentVQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            if (BidData.length > 0) {

                $('#tblServicesProduct').empty();
                $('#tblTempVendorslist').empty();
                $('#txtrfiSubject').val(BidData[0].vqMaster[0].vqSubject)
                $('#txtrfideadline').val(BidData[0].vqMaster[0].vqDeadline)
                $('#txtrfidescription').val(BidData[0].vqMaster[0].vqDescription)
                $('#txtattachdescription').val(BidData[0].vqMaster[0].vqAttachmentDescription)

                $("#cancelBidBtn").show();
                //jQuery('#attach-file').attr('href', 'PortalDocs/RFI/' + sessionStorage.getItem('CurrentVQID') + '/' + replaced).html(BidData[0].VQMaster[0].RFIAttachment)

                if (BidData[0].vqAttachment.length > 0) {
                    $("#tblAttachmentsElem").empty();
                    for (var i = 0; i < BidData[0].vqAttachment.length; i++) {
                        replaced = BidData[0].vqAttachment[i].vqAttachment.replace(/\s/g, "%20")
                        $("#tblAttachmentsElem").append('<li><div class="inputgroup">' +
                            '<label class="control-label col-md-3">Attachment</label>' +
                            '<div class="col-md-4">' +
                            '<input type="text" class="form-control" placeholder="Attachment Description" tabindex="5" name="txtattachdescription" autocomplete="off" value=' + BidData[0].vqAttachment[i].vqAttachmentDescription.replace(/\s/g, "&nbsp;") + ' />' +
                            '</div>' +
                            '<div class="col-md-3">' +
                            '<input type="file" id=file' + (i + 1) + ' class="form-control"  tabindex="4" onchange="checkfilesizeMultiple(this)" />' +
                            '<span class="help-block" style=float:left;><a id=attach-file' + (i + 1) + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + BidData[0].vqAttachment[i].vqAttachment + '</a></span>' +

                            '</div>' +
                            '<div class="col-md-2" style=" padding-left:0px !important; ">' +
                            '<a href="javascript:void(0);" class="btn btn-sm blue" onclick="addMoreAttachment()"><i class="fa fa-plus"></i></a>' +
                            '</div>' +
                            '</div></li>'
                        );
                    }
                }

                if (BidData[0].vqProductCat.length > 0) {
                    for (var i = 0; i < BidData[0].vqProductCat.length; i++) {
                        _selectedCat.push(BidData[0].vqProductCat[i].categoryID);
                    }
                    $("#ddlCategoryMultiple").select2('val', _selectedCat).trigger("change");


                }
                if (BidData[0].tempVendors.length > 0) {
                    $('#tblTempVendorslist').append('<thead><tr style="background: gray; color: #FFF;"><th>Company</th><th>Email</th><th>Mobile No</th><th>Contact Person</th><th>Actions</th></tr></thead>')
                    for (var i = 0; i < BidData[0].tempVendors.length; i++) {
                        $('#tblTempVendorslist').append("<tr><td>" + BidData[0].tempVendors[i].companyName + "</td><td>" + BidData[0].tempVendors[i].emailId + "</td><td>" + BidData[0].tempVendors[i].mobileNo + "</td><td>" + BidData[0].tempVendors[i].contactPerson + "</td><td><button type=button class='btn default btn-xs blue' onclick='editTempCompany(\"" + BidData[0].tempVendors[i].rowID + "\",\"" + BidData[0].tempVendors[i].companyName + "\",\"" + BidData[0].tempVendors[i].emailId + "\",\"" + BidData[0].tempVendors[i].mobileNo + "\",\"" + BidData[0].tempVendors[i].contactPerson + "\")'><i class='fa fa-edit' style='margin-top: 0px !important;'></i> Modify</button><button type=button class='btn default btn-xs red' onclick='deleteRFITempVendors(\"" + BidData[0].tempVendors[i].rowID + "\")'><i class='fa fa-times' style='margin-top: 0px !important;'></i> Delete</button></td></tr>");
                    }
                }

            }

        },
        error: function (xhr, status, error) {
            var err = xhr.responseText//eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
    jQuery.unblockUI();


}


jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    "This field is required."
);

var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;

jQuery.validator.addMethod("ValidPAN", function (value, element) {

    return (value.match(regex))

}, " Invalid PAN No.");

var regIFSC = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;

jQuery.validator.addMethod("ValidIFSC", function (value, element) {

    return (value.match(regIFSC))

}, " Invalid IFSC Code");

var formEmailvalidate = $('#frmEmailValidate');
var formvendor = $('#submit_form');
var successVendor = $('.alert-success', formvendor);
var errorVendor = $('.alert-danger', formvendor);
function FormValidate() {
    formvendor.validate({

        //doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        // errorElement: 'span', //default input error message container
        //  errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: false,
        rules: {

            ddlNatureEstaiblishment: {
                required: true,
                notEqualTo: 0

            },
            ddlVendorType: {
                required: true,
                notEqualTo: 0

            },
            ddlTypeofProduct: {
                required: true,

            },
            txtProduct: {
                required: true

            },
            ddlTitle: {
                required: true,
                notEqualTo: 0
            },
            ddlCompanyName: {
                required: true,
            },
            txtAdd1: {
                required: true,
            },
            ddlGSTclass: {
                required: true,
                notEqualTo: 0
            },
            /*ddlCountry: {
                required: true,
               notEqualTo: 0
            },*/
            ddlState: {
                required: true,
                notEqualTo: 0
            },
            ddlCity: {
                required: true,
                notEqualTo: 0
            },
            txtPin: {
                required: true,
            },

            tblAttachmentsElem: {
                required: true,
            },
            /*txtGst: {
                required: true,
                maxlength: 15,
            },
            txtPan: {
                required: true,
                ValidPAN: true
            },*/
            tblAttachmentsElem2: {
                required: true,
            },

            txtBank: {
                required: true,
            },
            txtAcNo: {
                required: true,
                number: true,
                maxlength: 15
            },
            txtIFSC: {
                required: true,
                ValidIFSC: true,
            },
            txtAccountHolder: {
                required: true,
            },
            txtContName: {
                required: true,
            },
            txtMobile: {
                required: true,
                number: true,
                maxlength: 10
            },
            txtMobile2: {

                number: true,
                maxlength: 15
            },
            txtEmail: {
                required: true,
                email: true
            },
            /* ddlMSME: {
                 required: true,
                 notEqualTo: 0
             },
             ddlMSMEClass: {
                 required: true,
                 notEqualTo: 0
             },
             txtUdyam: {
                 required: true,
             },
             filegst: {
                 required: true
             },*/
            filecheck: {
                required: true
            },
            /*  filepan: {
                  required: true
              }*/


        },

        invalidHandler: function (event, validator) {
            $('#diverrorvendor').show()
            $('#divsuccvendor').hide()
            $('#spanerrorvendor').text("Please fill all mandatory Details..");

            for (var i = 0; i < validator.errorList.length; i++) {
                $(validator.errorList[i].element).parents('.panel-collapse.collapse').collapse('show');
            }
            $('#diverrorvendor').fadeOut(6000);


        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        /*errorPlacement: function (error, element) {

        },*/
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            // error.insertAfter(element); // for other inputs, just perform default behavior
        },
        submitHandler: function (form) {

            SubmitVendorRegistration();
            //var id = document.activeElement.getAttribute('id');
            //if (id.trim() == "btnverifyemail") {
            //    validateEmail();
            //} else {
            //    SubmitVendorRegistration();
            //}
        }
    });
    formEmailvalidate.validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            txtemailverify: {
                required: true,
                email: true
            }

        },
        messages: {
            txtemailverify: {
                required: "Please Enter Valid EmailID"
            }

        },
        invalidHandler: function (event, validator) {
            //errorVendor.show()
            // successVendor.hide();
            $('#diverrorvendor').show()
            $('#divsuccvendor').hide()
            $('#spanerrorvendor').text("Please Enter Valid EmailID");
            $('#diverrorvendor').fadeOut(6000);
        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        errorPlacement: function (error, element) {

        },
        success: function (label) {
        },
        submitHandler: function (form) {

            validateEmail();
        }
    });
}

function validateEmail() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    $('#modalLoader').removeClass('display-none')
    var emailId = $("#txtemailverify").val().trim();

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/IsVendorExists?emailID=" + emailId,
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data == '0') {
                $('#txtEmail').attr('disabled', 'disabled');//#txtemailverify,#btnverifyemail
                $('#btnverifysubmit').removeClass('hide');
                $('#txtEmail,#txtEmail2').val(emailId);
                $('#collapse2').removeClass('collapse2').addClass('collapse in')
                $('#H4ContactDetails').removeClass('collapsed')

            }
            else {
                $('#diverrorvendor').show();
                $('#spanerrorvendor').html("EmailId is already registered&nbsp;&nbsp;<b><a style=text-decoration:none href='https://www.procurengine.com/vendor/'>Please Login here</a></b>");
                $('#txtemailverify,#txtEmail,#btnverifyemail').removeAttr('disabled');
            }
            $('#modalLoader').addClass('display-none');
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerrorvendor', '');
            }
            $('#modalLoader').addClass('display-none');
            $('#txtemailverify').val('')
            jQuery.unblockUI();
            return false;
        }
    });
}

$('#registerParticipantModal').on("hidden.bs.modal", function () {
    //fnFormClear();
    $('#txtemailverify,#btnverifyemail').removeAttr('disabled');
    $('#btnverifysubmit').addClass('hide');
    $('#txtemailverify').val('');
    $('#txtEmail,#txtEmail2').val('');
    $('#modalLoader').addClass('display-none');
    $('#collapse2').addClass('collapse2').removeClass('collapse in')
    $('#H4ContactDetails').removeClass('collapsed').addClass('collapsed')
    window.location = window.location.href.split('#')[0];
})
function fnClearformfields() {
    $('#diverrorvendor').fadeOut(7000);
    $("#txtContName").val('')
    $("#txtEmail").val('')
    $("#txtMobile").val('')
    $("#txtContName2").val('')
    $("#txtMobile2").val('')
    $("#txtEmail2").val('')
}

// make reset Function & call after Details submit ????
function fnFormClear() {
    $("#ddlNatureEstaiblishment").val('0')
    //$("#ddlNatureEstaiblishment option:selected").text('')
    $("#ddlVendorType").val('0')
    $("#txtProduct").val('')
    $("#ddlCompanyName").val('')
    $("#txtAdd1").val('')
    $("#ddlCountry").val('111').trigger("change");
    $("#ddlState").val(''),
        $("#ddlCity").val('')
    $("#txtPin").val('')
    $("#txtPan").val('')
    $("#txtTan").val('')
    $("#txtGst").val('')
    $("#txtBank").val('')
    $("#txtAcNo").val('')
    $("#txtIFSC").val('')
    $("#txtAccountHolder").val('')
    $("#ddlMSME option:selected").val('')
    $("#txtUdyam").val('')
    $("#txtLastFiscal").val('')
    $("#txt2LastFiscal").val('')
    // $("#txtLastFiscalyear").val('')
    // $("#txt2LastFiscalyear").val('')
    $("#txtContName").val('')
    $("#txtEmail").val('')
    $("#txtMobile").val('')
    $("#txtContName2").val('')
    $("#txtMobile2").val('')
    $("#txtEmail2").val('')
    $("#ddlMSMEClass").val('')
    $("#ddlGSTclass").val('')
    $("#ddlTds").val('')
    $("#ddPayTerms").val('')
    $('#filegst').val('')
    $('#filepan').val('')
    $('#filemsme').val('')
    $('#filecheck').val('')
    $("#currencyLastFiscal option:selected").val('')
    $("#currency2LastFiscal option:selected").val('')
    $('#diverrorvendor').fadeOut(7000);
}
function fnChangeGSTClass() {

    if ($('#ddlGSTclass').val().toLowerCase() == "registered") {
        $('#submit_form').validate();
        $('#gstfilespn').html('*');
        $('#GSTStartspn').html('*');
        $('#spnpanno').html('*');
        $('#spanpanfile').html('*');
        $('#txtGst').rules('add', {
            required: true,
            maxlength: 15
        });
        $('#filegst').rules('add', {
            required: true
        });
        $('#txtPan').rules('add', {
            required: true,
            ValidPAN: true
        });
        $('#filepan').rules('add', {
            required: true
        });
    }
    else {
        $('#gstfilespn').html('');
        $('#GSTStartspn').html('');
        $('#spnpanno').html('');
        $('#spanpanfile').html('');
        $('#txtGst').rules('remove');
        $('#filegst').rules('remove');
        $('#txtPan').rules('remove');
        $('#filepan').rules('remove');
    }
}