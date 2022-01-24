
//$('#txtGst').maxlength({
//    limitReachedClass: "label label-danger",
//    alwaysShow: true
//});



function fetchCategorymaster1() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem("CustomerID")+"&For=M&MappedBy=a&VendorID=0",
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
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchProducts?CustomerID=" + sessionStorage.getItem('CustomerID') ,
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
    if ($('#txtGst').val().length==15) {
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
    //debugger;
    var selected = [];
    var selectedid = [];
    var selectedidss = '';
    var result = '';
    var AttachementFileName = '';
    var AttachementFileName2 = '';
    var AttachementFileName3 = '';
    if ($("#ddlTypeofProduct").select2('data').length) {
        $.each($("#ddlTypeofProduct").select2('data'), function (key, item) {
            selectedid.push(item.id);
            selected.push(item.text);
            //jQuery("#ddlTypeofProduct").append(item.id).join('#');
            $("#ddlTypeofProduct").append($("#ddlTypeofProduct").text(item.id) + '#' );
           result+=  selectedidss.concat( item.id, "#");
            
        });
        straddedproduct = result.slice('#', -1);
        console.log(straddedproduct);
        console.log("selected", selected);
        console.log("selectedid", selectedid);

         //** gst Upload Files 
        var ptTbll = '';
        $("#tblAttachmentsElem> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {
                ptTbl = $(this);
                $("#tblAttachmentsElemPrev").append('<li><div class="col-md-6" style=padding-left:0px;>' +
                    '<p class="form-control-static">' + ptTbll.find('input[type=text]').val() + '</p>' +
                    '</div>' +
                    '<div class="col-md-6">' +
                    '<p class="form-control-static"><a  id=VQFilePrev' + (index + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + $('#attach-file' + (index + 1)).html() + '</a></p>' +
                    '</div></li>');


            } else {
                ptTbl = $(this);
                AttachementFileName = $(this).find('input[type=file]').val().split('\\').pop();
                $("#tblAttachmentsElemPrev").append('<li><div class="col-md-6" style=padding-left:0px;>' +
                    '<p class="form-control-static">' + ptTbl.find('input[type=text]').val() + '</p>' +
                    '</div>' +
                    '<div class="col-md-6">' +
                    '<p class="form-control-static"><a id=VQFilePrev' + (index + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + AttachementFileName + '</a></p>' +
                    '</div></li>');


            }
        });

        if ($('#attach-file').html() != '') {

            AttachementFileName = $.trim(jQuery('#attach-file').html());
        } else {

            AttachementFileName = 'Print 1'
        }

        $("#tblAttachmentsElem> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {

                AttachementFileName = $.trim($('#attach-file' + (index + 1)).html());
            } else {

                AttachementFileName = $(this).find('input[type=file]').val().split('\\').pop();
            }

            

        });

        $("#tblAttachmentsElem> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {

                AttachementFileName = $.trim($('#attach-file' + (index + 1)).html());
            } else {

                AttachementFileName = $(this).find('input[type=file]').val().split('\\').pop();
            }

            

        });

        console.log("AttachementFileName", AttachementFileName);

         //** pan Upload Files 
        var ptTbll = '';
        $("#tblAttachmentsElem2> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {
                ptTbll = $(this);
                $("#tblAttachmentsElemPrev").append('<li><div class="col-md-6" style=padding-left:0px;>' +
                    '<p class="form-control-static">' + ptTbll.find('input[type=text]').val() + '</p>' +
                    '</div>' +
                    '<div class="col-md-6">' +
                    '<p class="form-control-static"><a  id=VQFilePrev' + (index + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + $('#attach-file' + (index + 1)).html() + '</a></p>' +
                    '</div></li>');


            } else {
                ptTbll = $(this);
                AttachementFileName2 = $(this).find('input[type=file]').val().split('\\').pop();
                $("#tblAttachmentsElemPrev").append('<li><div class="col-md-6" style=padding-left:0px;>' +
                    '<p class="form-control-static">' + ptTbll.find('input[type=text]').val() + '</p>' +
                    '</div>' +
                    '<div class="col-md-6">' +
                    '<p class="form-control-static"><a id=VQFilePrev' + (index + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + AttachementFileName + '</a></p>' +
                    '</div></li>');


            }
        });


        if ($('#attach-file').html() != '') {

            AttachementFileName2 = $.trim(jQuery('#attach-file').html());
        } else {

            AttachementFileName2 = 'Print 1'
        }

        $("#tblAttachmentsElem2> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {

                AttachementFileName2 = $.trim($('#attach-file' + (index + 1)).html());
            } else {

                AttachementFileName2 = $(this).find('input[type=file]').val().split('\\').pop();
            }



        });

        $("#tblAttachmentsElem2> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {

                AttachementFileName2 = $.trim($('#attach-file' + (index + 1)).html());
            } else {

                AttachementFileName2 = $(this).find('input[type=file]').val().split('\\').pop();
            }



        });

        console.log("AttachementFileName2", AttachementFileName2);

          //** msme Upload Files 
        var ptTblll = '';
        $("#tblAttachmentsElem3> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {
                ptTblll = $(this);
                $("#tblAttachmentsElemPrev").append('<li><div class="col-md-6" style=padding-left:0px;>' +
                    '<p class="form-control-static">' + ptTbll.find('input[type=text]').val() + '</p>' +
                    '</div>' +
                    '<div class="col-md-6">' +
                    '<p class="form-control-static"><a  id=VQFilePrev' + (index + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + $('#attach-file' + (index + 1)).html() + '</a></p>' +
                    '</div></li>');


            } else {
                ptTblll = $(this);
                AttachementFileName3 = $(this).find('input[type=file]').val().split('\\').pop();
                $("#tblAttachmentsElemPrev").append('<li><div class="col-md-6" style=padding-left:0px;>' +
                    '<p class="form-control-static">' + ptTbll.find('input[type=text]').val() + '</p>' +
                    '</div>' +
                    '<div class="col-md-6">' +
                    '<p class="form-control-static"><a id=VQFilePrev' + (index + 1) + ' style="pointer:cursor;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + AttachementFileName + '</a></p>' +
                    '</div></li>');


            }
        });


        if ($('#attach-file').html() != '') {

            AttachementFileName3 = $.trim(jQuery('#attach-file').html());
        } else {

            AttachementFileName3 = 'Print 1'
        }

        $("#tblAttachmentsElem3> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {

                AttachementFileName3 = $.trim($('#attach-file' + (index + 1)).html());
            } else {

                AttachementFileName3 = $(this).find('input[type=file]').val().split('\\').pop();
            }



        });

        $("#tblAttachmentsElem3> li").each(function (index) {
            if (($('#attach-file' + (index + 1)).html() != '') && ($(this).find('input[type=file]').val() == '')) {

                AttachementFileName3 = $.trim($('#attach-file' + (index + 1)).html());
            } else {

                AttachementFileName3 = $(this).find('input[type=file]').val().split('\\').pop();
            }



        });

        console.log("AttachementFileName3", AttachementFileName3);

        var VendorInfo = {

            "customerID": parseInt(sessionStorage.getItem('CustomerID')),
            "estTypeID": parseInt(jQuery("#ddlNatureEstaiblishment").val()),
            "estName": jQuery("#ddlNatureEstaiblishment option:selected").text(),
            "vendorCatID": parseInt(jQuery("#ddlVendorType").val()),
            "vendorCatName": jQuery("#ddlVendorType option:selected").text().trim(),
            "product": jQuery("#txtProduct").val(),
            "title": jQuery("#ddlTitle option:selected").text().trim(),
            "vendorName": jQuery("#ddlCompanyName").val(),
            "vendorAdd": jQuery("#txtAdd1").val(),
            "countryID": parseInt(jQuery("#ddlCountry").val()),
            "countryName": jQuery("#ddlCountry option:selected").text().trim(),
            "stateID": parseInt(jQuery("#ddlState").val()),
            "stateName": jQuery("#ddlState option:selected").text().trim(),
            "cityID": parseInt(jQuery("#ddlCity").val()),
            "cityName": jQuery("#ddlCity option:selected").text().trim(),
            "pinCode": jQuery("#txtPin").val(),
            "pAN": jQuery("#txtPan").val(),
            "tAN": jQuery("#txtTan").val(),
            "tDSTypeId": parseInt(jQuery("#ddlTds").val()),
            "tDSTypeName": jQuery("#ddlTds option:selected").text().trim(),
            "gSTClass": jQuery("#ddlGSTclass option:selected").text().trim(),
            "gSTNo": jQuery("#txtGst").val(),
            "payTermID": parseInt(jQuery("#ddPayTerms").val()),
            "bankName": jQuery("#txtBank").val(),
            "bankAccount": jQuery("#txtAcNo").val(),
            "iFSCCode": jQuery("#txtIFSC").val(),
            "accountName": jQuery("#txtAccountHolder").val(),
            "mSMECheck": jQuery("#ddlMSME option:selected").val(),
            "mSMEType": jQuery("#ddlMSMEClass option:selected").text().trim(),
            "mSMENo": jQuery("#txtUdyam").val(),
            "previousTurnover": jQuery("#txtLastFiscal").val(),
            "secondLastTurnover": jQuery("#txt2LastFiscal").val(), 
            "contactName": jQuery("#txtContName").val(),
            "contactEmailID": jQuery("#txtEmail").val(),
            "mobile": jQuery("#txtMobile").val(),
            "contactNameMD": jQuery("#txtContName2").val(),
            "mobileMD": jQuery("#txtMobile2").val(),
            "AltEmailID": jQuery("#txtEmail2").val(),
            "gSTFile": AttachementFileName,
            "pANFile": AttachementFileName2,
            "mSMEFile": AttachementFileName3,
            "productCat": straddedproduct,        
      
}
    };
    console.log(JSON.stringify(VendorInfo))
   // alert(JSON.stringify(VendorInfo));
    jQuery.ajax({

        url: sessionStorage.getItem("APIPath") + "VendorRequest/VendorRequestSubmit",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(VendorInfo),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           
            //sessionStorage.setItem('CurrentVQID', parseInt(data));
            $("#tblAttachmentsElem> li").each(function (index) {
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

            });
            $('#divsuccvendor').show();
            $('#spansuccessvendor').text("Vendor Request Submitted successfully");
            $('#spansuccessvendor').fadeOut(6000);
            setTimeout(function () {
                $("#registerParticipantModal").modal("hide");
                jQuery.unblockUI();
            },7000)
           
            
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
                    notEqualTo:0

                },
                ddlVendorType: {
                    required: true,
                    notEqualTo: 0

                },
                ddlTypeofProduct: {
                    required: true,
                    notEqualTo: 0
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
            if (jQuery("#btnverifyemail").text().toLowerCase() == 'proceed') {
                validateEmail();
            } else {
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
        url: sessionStorage.getItem("APIPath") + "VendorRequest/IsVendorExists?emailID=" + emailId ,
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

