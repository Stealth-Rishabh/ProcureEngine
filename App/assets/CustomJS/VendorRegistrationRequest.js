
//$('#txtGst').maxlength({
//    limitReachedClass: "label label-danger",
//    alwaysShow: true
//});



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
            //alert(data);
            jQuery("#ddlTypeofProduct").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);

                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlTypeofProduct").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }
                //debugger;
                jQuery("#ddlTypeofProduct").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlTypeofProduct").append('<tr><td>No categories found..</td></tr>');
            }
            // jQuery.unblockUI();
        },

        error: function (xhr, status, error) {
            console.log(url);
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


function fetchCountry() {
    //var stateid = jQuery('#ddlCountry').val();
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/Country/?CountryID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(data);
            jQuery("#ddlCountry").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);

                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCountry").append("<option value=" + data[i].countryID + ">" + data[i].countryName + "</option>");
                }
                jQuery("#ddlCountry").val('111').trigger("change");
                //debugger;

                //if (countryid != '0') {
                //    //jQuery("#ddlCountry").val(countryid);
                //    jQuery("#ddlCountry").trigger("change");
                //}
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlCountry").append('<tr><td>No countries found..</td></tr>');
            }
            // jQuery.unblockUI();
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

//var countryid = 0;
function fetchState() {

    var countryid = jQuery('#ddlCountry option:selected').val();

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/State/?CountryID=" + countryid + "&StateID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#ddlState").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);
                jQuery("#ddlState").append("<option value=0>Select State</option>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlState").append("<option value=" + data[i].stateID + ">" + data[i].stateName + "</option>");
                }
                //debugger;
                jQuery("#ddlState").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlState").append('<tr><td>No state found..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {
            alert('hi')
            var err = xhr.responseText;
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

function fetchCity() {

    var stateid = jQuery('#ddlState').val();

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/City/?StateID= " + stateid + "&CityID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(data);
            jQuery("#ddlCity").empty();
            var vlal = new Array();
            if (data.length > 0) {

                jQuery("#ddlCity").append("<option value=0>Select City</option>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCity").append("<option value=" + data[i].cityID + ">" + data[i].cityName + "</option>");
                }

                jQuery("#ddlCity").val('0').trigger("change");


            }
            else {
                jQuery("#ddlCity").append('<tr><td>No city found..</td></tr>');
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


function fetchProduct() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    //debugger;
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchProducts?CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(data);
            jQuery("#ddlProduct").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);

                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlProduct").append("<option value=" + data[i].productID + ">" + data[i].productName + "</option>");
                }
                //debugger;
                jQuery("#ddlProduct").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlProduct").append('<tr><td>No products found..</td></tr>');
            }
            // jQuery.unblockUI();
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

function fetchTDS() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchTDS",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(data);
            jQuery("#ddlTds").empty();
            var vlal = new Array();

            if (data.length > 0) {
                // alert(data.length);
                jQuery("#ddlTds").append("<option value=0>Select Type of TDS</option>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlTds").append("<option value=" + data[i].tdsID + ">" + data[i].tds + "</option>");
                }
                //debugger;
                jQuery("#ddlTds").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddlTds").append('<tr><td>No tds found..</td></tr>');
            }
            // jQuery.unblockUI();
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

function fetchPaymentTerms() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchPaymentTerms?CustomerID=1",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            //alert(data);
            jQuery("#ddPayTerms").empty();
            var vlal = new Array();
            if (data.length > 0) {
                // alert(data.length);
                jQuery("#ddPayTerms").append("<option value=0>Select Payment Terms</option>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddPayTerms").append("<option value=" + data[i].termID + ">" + data[i].paymentTerm + "</option>");
                }
                //debugger;
                jQuery("#ddPayTerms").trigger("change");
                //alert(sessionStorage.getItem('CurrentVQID'));

            }
            else {
                jQuery("#ddPayTerms").append('<tr><td>No payment terms found..</td></tr>');
            }
            // jQuery.unblockUI();
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

function getPan(pan) {
    //debugger;
    var pan = $('#txtGst').val().substr(2, 10); //11
    //console.log("pan", pan);
    if ($('#txtGst').val().length == 15) {
        $('#txtPan').val(pan.toUpperCase());
        $('#txtGst').val($('#txtGst').val().toUpperCase())
        $('#txtPan').attr('disabled', 'disabled')
        //$('#txtGst').attr('disabled', 'disabled')
    }



}

function fetchMsme() {
    var msmecheck = jQuery("#ddlMSME option:selected").val();
    if (msmecheck == 'Y') {
        $('.hideInput').removeClass('hide');
    } else {
        $('.hideInput').addClass('hide');
    }
}

function SubmitVendorRegistration() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    debugger;
    var selected = [];
    var selectedid = [];
    var selectedidss = '';
    var result = '';

    if ($("#ddlTypeofProduct").select2('data').length) {
        $.each($("#ddlTypeofProduct").select2('data'), function (key, item) {
            selectedid.push(item.id);
            selected.push(item.text);
            //jQuery("#ddlTypeofProduct").append(item.id).join('#');
            $("#ddlTypeofProduct").append($("#ddlTypeofProduct").text(item.id) + '#');
            result += selectedidss.concat(item.id, "#");

        });
        straddedproduct = result.slice('#', -1);

        var msmetype = jQuery("#ddlMSMEClass option:selected").text().trim();
        var gstclass = jQuery("#ddlGSTclass option:selected").text().trim();
        var tds = jQuery("#ddlTds option:selected").val().trim();
        var paymentterm = jQuery("#ddPayTerms option:selected").val().trim();
        if (msmetype == 'Select') {
            var msmeselectvalue = "";
        } else {
            var msmeselectvalue = jQuery("#ddlMSMEClass option:selected").text().trim();
        }
        if (gstclass == 'Select') {
            var gstclassvalue = "";
        } else {
            var gstclassvalue = jQuery("#ddlGSTclass option:selected").text().trim();
        }
        if (tds == 0) {
            var tdsvalue = "";
        } else {
            var tdsvalue = jQuery("#ddlTds option:selected").text().trim();
        }
        if (paymentterm == 0) {
            var paymenttermvalue = "";
        } else {
            var paymenttermvalue = parseInt(jQuery("#ddPayTerms").val());
        }

        var gstfilename = jQuery('#filegst').val().substring(jQuery('#filegst').val().lastIndexOf('\\') + 1)
        gstfilename = gstfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var panfilename = jQuery('#filepan').val().substring(jQuery('#filepan').val().lastIndexOf('\\') + 1)
        panfilename = panfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var msmefilename = jQuery('#filemsme').val().substring(jQuery('#filemsme').val().lastIndexOf('\\') + 1)
        msmefilename = msmefilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var checkfilename = jQuery('#filecheck').val().substring(jQuery('#filecheck').val().lastIndexOf('\\') + 1)
        checkfilename = checkfilename.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');

        var VendorInfo = {

            "customerID": parseInt(sessionStorage.getItem('CustomerID')),
            "estTypeID": parseInt(jQuery("#ddlNatureEstaiblishment").val()),
            "estName": jQuery("#ddlNatureEstaiblishment option:selected").text(),
            "vendorCatID": parseInt(jQuery("#ddlVendorType").val()),
            "vendorCatName": jQuery("#ddlVendorType option:selected").text().trim(),
            "product": jQuery("#txtProduct").val(),
            "vendorName": jQuery("#ddlCompanyName").val().trim(),
            "vendorAdd": jQuery("#txtAdd1").val().trim(),
            "countryID": parseInt(jQuery("#ddlCountry").val()),
            "countryName": jQuery("#ddlCountry option:selected").text().trim(),
            "stateID": parseInt(jQuery("#ddlState").val()),
            "stateName": jQuery("#ddlState option:selected").text().trim(),
            "cityID": parseInt(jQuery("#ddlCity").val()),
            "cityName": jQuery("#ddlCity option:selected").text().trim(),
            "pinCode": jQuery("#txtPin").val().trim(),
            "pAN": jQuery("#txtPan").val().trim(),
            "tAN": jQuery("#txtTan").val().trim(),
            "tDSTypeId": parseInt(jQuery("#ddlTds option:selected").val().trim()),
            "tDSTypeName": tdsvalue,
            "gSTClass": gstclassvalue,
            "gSTNo": jQuery("#txtGst").val().trim(),
            "payTermID": paymenttermvalue,
            "bankName": jQuery("#txtBank").val().trim(),
            "bankAccount": jQuery("#txtAcNo").val().trim(),
            "iFSCCode": jQuery("#txtIFSC").val().trim(),
            "accountName": jQuery("#txtAccountHolder").val().trim(),
            "mSMECheck": jQuery("#ddlMSME option:selected").val(),
            "mSMEType": msmeselectvalue,
            "mSMENo": jQuery("#txtUdyam").val().trim(),
            "previousTurnover": jQuery("#txtLastFiscal").val().trim(),
            "secondLastTurnover": jQuery("#txt2LastFiscal").val().trim(),
            "previousTurnoverYear": jQuery("#txtLastFiscalyear").val().trim(),
            "secondLastTurnoverYear": jQuery("#txt2LastFiscalyear").val().trim(),
            "contactName": jQuery("#txtContName").val().trim(),
            "contactEmailID": jQuery("#txtEmail").val().trim(),
            "mobile": jQuery("#txtMobile").val().trim(),
            "contactNameMD": jQuery("#txtContName2").val().trim(),
            "mobileMD": jQuery("#txtMobile2").val().trim(),
            "AltEmailID": jQuery("#txtEmail2").val().trim(),
            "gSTFile": gstfilename,
            "pANFile": panfilename,
            "mSMEFile": msmefilename,
            "cancelledCheck": checkfilename,
            "productCat": straddedproduct,
            "currencyLastFY": jQuery("#currencyLastFiscal option:selected").val(),
            "currencyLast2FY": jQuery("#currency2LastFiscal option:selected").val(),


        }
    };
    console.log(JSON.stringify(VendorInfo))
    alert(JSON.stringify(VendorInfo));
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "VendorRequest/VendorRequestSubmit",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(VendorInfo),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            //alert(data[0].);
            console.log(data.jsondata);
            //return vendor id

            if ($('#filegst').val() != '') {
                fnUploadFilesonAzure('filegst', gstfilename, 'VR/' + data);

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/' + data);

            }

            if ($('#filemsme').val() != '') {
                fnUploadFilesonAzure('filemsme', msmefilename, 'VR/' + data);

            }

            if ($('#filecheck').val() != '') {
                fnUploadFilesonAzure('filecheck', checkfilename, 'VR/' + data);

            }


            //sessionStorage.setItem('CurrentVQID', parseInt(data));
            /*$("#tblAttachmentsElem> li").each(function (index) {
                //** gst Upload Files on Azure PortalDocs folder


                if ($('#file' + index).val() != '' && $('#file' + index).val() != undefined) {
                    filename = jQuery('#file' + index).val().substring(jQuery('#file' + index).val().lastIndexOf('\\') + 1);
                    fnUploadFilesonAzure('file' + index, filename, 'VR/' + sessionStorage.getItem('tmpVendorID'));

                }

            });

            $("#tblAttachmentsElem2> li").each(function (index) {
                //** pan Upload Files on Azure PortalDocs folder


                if ($('#file' + index).val() != '' && $('#file' + index).val() != undefined) {
                    filename = jQuery('#file' + index).val().substring(jQuery('#file' + index).val().lastIndexOf('\\') + 1);
                    fnUploadFilesonAzure('file' + index, filename, 'VR/' + sessionStorage.getItem('tmpVendorID'));

                }

            });

            $("#tblAttachmentsElem3> li").each(function (index) {
                //** msme Upload Files on Azure PortalDocs folder


                if ($('#file' + index).val() != '' && $('#file' + index).val() != undefined) {
                    filename = jQuery('#file' + index).val().substring(jQuery('#file' + index).val().lastIndexOf('\\') + 1);
                    fnUploadFilesonAzure('file' + index, filename, 'VR/' + sessionStorage.getItem('tmpVendorID'));

                }

            }); */
            $('#divsuccvendor').show();
            $('#spansuccessvendor').text("Vendor Request Submitted successfully");
            $('#spansuccessvendor').fadeOut(6000);
            setTimeout(function () {
                $("#registerParticipantModal").modal("hide");
                jQuery.unblockUI();
            }, 7000)


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

function fetchCategorymaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=M&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VendorID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#ddlCategoryMultiple").empty();
            var vlal = new Array();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCategoryMultiple").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }
                jQuery("#ddlCategoryMultiple").trigger("change");

            }
            else {
                jQuery("#ddlCategoryMultiple").append('<tr><td>No categories found..</td></tr>');
            }
            // jQuery.unblockUI();
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
function fetchRFIDetails() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced = '', _selectedCat = new Array();
    // alert(sessionStorage.getItem("APIPath") + "VQMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VQID=" + sessionStorage.getItem('CurrentVQID') )
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

                jQuery('#tblServicesProduct').empty();
                jQuery('#tblTempVendorslist').empty();
                jQuery('#txtrfiSubject').val(BidData[0].vqMaster[0].vqSubject)
                jQuery('#txtrfideadline').val(BidData[0].vqMaster[0].vqDeadline)
                jQuery('#txtrfidescription').val(BidData[0].vqMaster[0].vqDescription)
                jQuery('#txtattachdescription').val(BidData[0].vqMaster[0].vqAttachmentDescription)

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
                    jQuery('#tblTempVendorslist').append('<thead><tr style="background: gray; color: #FFF;"><th>Company</th><th>Email</th><th>Mobile No</th><th>Contact Person</th><th>Actions</th></tr></thead>')
                    for (var i = 0; i < BidData[0].tempVendors.length; i++) {
                        jQuery('#tblTempVendorslist').append("<tr><td>" + BidData[0].tempVendors[i].companyName + "</td><td>" + BidData[0].tempVendors[i].emailId + "</td><td>" + BidData[0].tempVendors[i].mobileNo + "</td><td>" + BidData[0].tempVendors[i].contactPerson + "</td><td><button type=button class='btn default btn-xs blue' onclick='editTempCompany(\"" + BidData[0].tempVendors[i].rowID + "\",\"" + BidData[0].tempVendors[i].companyName + "\",\"" + BidData[0].tempVendors[i].emailId + "\",\"" + BidData[0].tempVendors[i].mobileNo + "\",\"" + BidData[0].tempVendors[i].contactPerson + "\")'><i class='fa fa-edit' style='margin-top: 0px !important;'></i> Modify</button><button type=button class='btn default btn-xs red' onclick='deleteRFITempVendors(\"" + BidData[0].tempVendors[i].rowID + "\")'><i class='fa fa-times' style='margin-top: 0px !important;'></i> Delete</button></td></tr>");
                    }
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


var formvendor = $('#submit_form');
var successVendor = $('.alert-success', formvendor);
var errorVendor = $('.alert-danger', formvendor);
function FormValidate() {

    //$('#divsuccvendor').hide();
    formvendor.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtemailverify: {
                required: true,
                email: true
            },

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
            ddlCountry: {
                required: true,
                notEqualTo: 0
            },
            ddlState: {
                required: true,

            },
            ddlCity: {
                required: true,

            },
            txtPin: {
                required: true,
            },

            tblAttachmentsElem: {
                required: true,
            },
            txtGst: {
                required: true,
                maxlength: 15,
            },
            txtPan: {
                required: true,
                ValidPAN: true
            },
            tblAttachmentsElem2: {
                required: true,
            },

            txtBank: {
                required: true,
            },
            txtAcNo: {
                required: true,
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
            },
            txtEmail: {
                required: true,
                email: true
            },
            ddlMSME: {
                required: true,
                notEqualTo: 0
            },
            ddlMSMEClass: {
                required: true,
                notEqualTo: 0
            },
            txtUdyam: {
                required: true,
            }

        },

        invalidHandler: function (event, validator) {
            errorVendor.hide()
            successVendor.hide();
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
            debugger;
            var id = document.activeElement.getAttribute('id');

            if (id == "btnverifyemail") {
                //alert("Proceed working");
                validateEmail();
            } else {
                //alert("Submit working");
                SubmitVendorRegistration();
            }

        }


    });

}

function validateEmail() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    $('#modalLoaderparameter').removeClass('display-none')
    var emailId = jQuery("#txtemailverify").val().trim();

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/IsVendorExists?emailID=" + emailId,
        //beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data == '0') {
                $('#txtemailverify,#txtEmail').attr('disabled', 'disabled');
                $('#btnverifysubmit').removeClass('hide');
                $('#txtEmail').val(emailId);

            }
            else {
                $('#diverrorvendor').show();
                $('#spanerrorvendor').text("EmailId is already registered");
                $('#diverrorvendor').fadeOut(10000);
            }
            $('#modalLoaderparameter').addClass('display-none');
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
            $('#modalLoaderparameter').addClass('display-none');
            $('#txtemailverify').val('')
            jQuery.unblockUI();
            return false;
        }

    });


}

$('#registerParticipantModal').on("hidden.bs.modal", function () {
    $('#txtemailverify').removeAttr('disabled');
    $('#btnverifysubmit').addClass('hide');
    $('#txtemailverify').val('');
    $('#modalLoaderparameter').addClass('display-none');

    window.location = window.location.href.split('#')[0];
})

