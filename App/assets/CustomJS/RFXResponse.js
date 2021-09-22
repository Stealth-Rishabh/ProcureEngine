var error = $('.alert-danger');

var success = $('.alert-success');

var form = $('#rejectionForm');
function formvalidate() {


            form.validate({

                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

                errorElement: 'span', //default input error message container

                errorClass: 'help-block help-block-error', // default input error message class

                focusInvalid: false, // do not focus the last invalid input

                rules: {
                    
                    txtrejectreason: {
                        required: function (element) {
                            if ($("element").data('bs.modal') && $("element").data('bs.modal').isShown) {
                                required: true;
                            } else {
                                required: true;
                            }
                        }
                    }


                },
                messages:{
                    
                },

                
                invalidHandler: function (event, validator) {
                    success.hide();
                    $('#spandanger').text('You have some error. Please check below!')
                    error.show();
                    Metronic.scrollTo(error, -200);
                    error.fadeOut(5000);
                 },

                highlight: function (element) { // hightlight error inputs
                    
                    $(element).closest('.col-md-9').addClass('has-error'); // set error class to the control group
                    
                },
                unhighlight: function (element) { // revert the change done by hightlight
                   
                    $(element).closest('.col-md-9').removeClass('has-error'); // set error class to the control group
                    
                },

                success: function (label) {
                   
                    label.closest('.col-md-9').removeClass('has-error');
                    
                    label.remove();
                },
                submitHandler: function (form) {
                    ApproveRFI('Rejection');
                 }
            });
}

$('.button-submit').click(function () {
    ApproveRFI('Approval');
});

function fetchRFIDetails() {
    var attachment = '', _txtCategories=[];
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFXMaster/fetchRFXPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFXID=" + sessionStorage.getItem('CurrentRFXID') + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            attachment = BidData[0].RFXMaster[0].RFXAttachment.replace(/%20/g, " ");
            jQuery('#tblServicesProduct').empty();
            jQuery('#tblTempVendorslist').empty();
            
            jQuery('#lbl_configuredBy').html("RFI Configured By: " + BidData[0].RFXMaster[0].RFXConfiguredByName);
            jQuery('#txtrfiSubject').html(BidData[0].RFXMaster[0].RFXSubject)
            jQuery('#txtrfideadline').html(BidData[0].RFXMaster[0].RFXDeadline)
            jQuery('#txtrfidescription').html(BidData[0].RFXMaster[0].RFXDescription)
           
            if (BidData[0].RFXAttachment.length > 0) {
                $("#tblAttachmentsElemPrev").empty();
                for (var i = 0; i < BidData[0].RFXAttachment.length; i++) {
                    attachment = BidData[0].RFXAttachment[i].RFXAttachment.replace(/\s/g, "%20")
                    $("#tblAttachmentsElemPrev").append('<li><div class="col-md-8" style=padding-left:0px;>' +
                        '<p class="form-control-static">' + BidData[0].RFXAttachment[i].RFXAttachmentDescription.replace(/\s/g, "&nbsp;") + '</p>' +
                        '</div>' +
                        '<div class="col-md-4">' +
                            '<p class="form-control-static"><a href=PortalDocs/RFX/' + sessionStorage.getItem("CurrentRFXID") + "/" + attachment + ' style="text-decoration: none !important;">' + attachment + '</a></p>' +
                        '</div></li>');
                }
            }



            if (BidData[0].RFXProductCat.length > 0) {
                for (var i = 0; i < BidData[0].RFXProductCat.length; i++) {
                    _txtCategories += BidData[0].RFXProductCat[i].CategoryName + ', ';
                }
                _txtCategories = _txtCategories.substring(0, _txtCategories.length - 2);
                jQuery("#productCatPrev").html(_txtCategories);
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

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function fetchQuestionsForVendors(QuestionFor) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "RFXMaster/RFXFetchQuestionForVendors/?GetMsz=" + QuestionFor + "&Number=" + sessionStorage.getItem('CurrentRFXID') + "&VendorID=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
            //alert(JSON.stringify(data))
            if (data.length > 0) {

                if (data[0].GetMsz == 'TechnicalCapabilities') {
                    var attach3 = '';
                    var SubcategoryID = 0;
                    jQuery("#tblcompCapableInfo").empty();
                   
                    for (var i = 0; i < data.length; i++) {

                        if (SubcategoryID != data[i].QuestionSubCategoryID) {
                            $("#tblcompCapableInfo").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].QuestionSubCategory + '</th></tr></thead>');
                            
                            SubcategoryID = data[i].QuestionSubCategoryID;
                            for (var j = 0; j < data.length; j++) {
                                if (data[i].Attachments != '') {
                                    attach3 = data[j].Attachments.replace(/\s/g, "%20")
                                } else {
                                    attach3 = '';//attach1;
                                }
                                if (SubcategoryID == data[j].QuestionSubCategoryID) {
                                    $("#tblcompCapableInfo").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].QuestionDescription + '</th></tr></thead>');
                                    


                                    if (data[i].Mandatory == "Y") {
                                        if (data[i].Attachement == "Y") {
                                            jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].QuestionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=CtextaraID' + j + ' name=CtextaraID' + j + ' required></textarea></div><div class="col-md-3"><span class="help-block"><a id=spanAttachTc' + j + ' href="PortalDocs/RFX/' + sessionStorage.getItem('CurrentRFXID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach3 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].Attachments + '</a></span></div></td></tr>');
                                            
                                            
                                        } else {
                                            jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].QuestionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=CtextaraID' + j + ' name=CtextaraID' + j + ' required></textarea></div></td></tr>');
                                           
                                        }

                                    } else {
                                        if (data[i].Attachement == "Y") {
                                            jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].QuestionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=CtextaraID' + j + ' name=CtextaraID' + j + ' rows="3"></textarea></div><div class="col-md-3"></span><br/><span class="help-block"><a id=spanAttachTc' + j + ' href="PortalDocs/RFX/' + sessionStorage.getItem('CurrentRFXID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach3 + '" style="text-decoration: none !important;word-break:break-all;">' + data[j].Attachments + '</a></span></div></td></tr>');
                                            
                                            
                                        } else {
                                            jQuery("#tblcompCapableInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].QuestionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=CtextaraID' + j + ' name=CtextaraID' + j + ' rows="3"></textarea></div></td></tr>');
                                            
                                        }
                                    }
                                    $('#CtextaraID' + j).val(data[j].Answers)
                                   
                                }
                            }
                        }
                    }
                }


                if (data[0].GetMsz == 'ExecutionCapabilities') {
                    var attach4 = '';
                    var SubcategoryID = 0;
                    jQuery("#tbltechnicalInfo").empty();
                    

                    for (var i = 0; i < data.length; i++) {

                        if (SubcategoryID != data[i].QuestionSubCategoryID) {
                            $("#tbltechnicalInfo").append('<thead><tr style="background-color: blue !important; color: #FFF;"><th>' + data[i].QuestionSubCategory + '</th></tr></thead>');
                           
                            SubcategoryID = data[i].QuestionSubCategoryID;
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].Attachments != '') {
                                    attach4 = data[j].Attachments.replace(/\s/g, "%20")
                                } else {
                                    attach4 = '' //attach1;
                                }
                                if (SubcategoryID == data[j].QuestionSubCategoryID) {
                                    $("#tbltechnicalInfo").append('<thead id=headID' + j + '><tr style="background-color: #DDD !important;"><th>' + data[j].QuestionDescription + '</th></tr></thead>');
                                   
                                    if (data[j].Mandatory == "Y") {
                                        if (data[j].Attachement == "Y") {
                                            jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].QuestionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" rows="3" id=TtextaraID' + j + ' name=TtextaraID' + j + ' required></textarea></div><div class="col-md-3"><span class="help-block"><a  id=spanAttachEc' + j + ' href="PortalDocs/RFX/' + sessionStorage.getItem('CurrentRFXID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach4 + '" style="text-decoration: none !important;">' + data[j].Attachments + '</a></span></div></td></tr>');
                                           
                                            
                                        } else {
                                            jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].QuestionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=TtextaraID' + j + ' name=TtextaraID' + j + ' rows="3" required></textarea></div></td></tr>');
                                           
                                        }

                                    } else {
                                        if (data[j].Attachement == "Y") {
                                            jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].QuestionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=TtextaraID' + j + ' name=TtextaraID' + j + ' rows="3"></textarea></div><div class="col-md-3"><span class="help-block"><a  id=spanAttachEc' + j + ' href="PortalDocs/RFX/' + sessionStorage.getItem('CurrentRFXID') + '/' + sessionStorage.getItem('VendorId') + '/' + attach4 + '" style="text-decoration: none !important;">' + data[j].Attachments + '</a></span></div></td></tr>');
                                            
                                            
                                        } else {
                                            jQuery("#tbltechnicalInfo > #headID" + j + "").append('<tr><td><input class="display-none" type="checkbox" value=' + data[j].QuestionID + ' /><div class="col-md-9"><textarea class="form-control" placeholder="Answer" id=TtextaraID' + j + ' name=TtextaraID' + j + ' rows="3"></textarea></div></td></tr>');
                                            
                                        }
                                    }
                                    $('#TtextaraID' + j).val(data[j].Answers)
                                   
                                }
                            }
                        }
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

function RFIFetchCompanyHeader(QuestionFor) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "RFIMaster/RFIFetchCompanyInfo_VR/?IsSuccess=" + QuestionFor + "&RFIID=" + sessionStorage.getItem('CurrentRFXID') + "&VendorId=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
            
           
            if (data.length > 0) {
                    
                            $('#txtCompanyName').html(data[0].CompanyName);
                            $('#txtPhoneNo').html(data[0].CompanyPhone);
                            $('#txtofficeAddress').html(data[0].OfficedAddress);
                            $('#txtfactoryAddress').html(data[0].FactoryAdress);
                            $('#txtemailID').html(data[0].CompanyEmail);
                            $('#txtParentcompName').html(data[0].ParentCompany);
                            $('#txtFaxNo').html(data[0].FaxNumber);
                            $('#txtWebsite').html(data[0].CompanyWebsite);
                            $('#ddlOwnership').html(data[0].Ownership);
                            $('#txtemployeeNum').html(data[0].EmployeeCount);
                            $('#txtbriefDesc').html(data[0].KeyProjects);
                            $('#ddlTitle').html(data[0].Title);
                            $('#txtContactName').html(data[0].KeyPersonName);
                            $('#txtcontactNo').html(data[0].KeyPersonNo);
                            $('#txtcontactEmail').html(data[0].KeyPersonEmail);
                            $('#txtCity').html(data[0].City);
                            $('#txtPanNo').html(data[0].PANNo);
                            $('#txtGstNo').html(data[0].ServiceTaxNo);
                            $('#txtcontactAltEmail').html(data[0].KeyPersonAlternateEmail);
                  

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

function RFIFetchFinanceHeader() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var mandat = '';
    var isattach = '';
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIMaster/RFIFetchFinanceInfo_VR/?RFIID=" + sessionStorage.getItem('CurrentRFXID') + "&VendorId=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            // alert(JSON.stringify(data))

            if (data.length > 0) {
                if (data[0].IsPubliclyListed == 'N') {
                    $('#ddlPubliclisted').html('No');
                } else {
                    $('#ddlPubliclisted').html('Yes');
                }
                
                    $('#txtPhoneNo').val(data[0].CompanyPhone);
                    $('#txtturnover1').html(thousands_separators(data[0].TurnOverY1));
                    $('#txtturnover2').html(thousands_separators(data[0].TurnOverY2));
                    $('#txtturnover3').html(thousands_separators(data[0].TurnOverY3));
                    $('#txtturnover4').html(thousands_separators(data[0].TurnOverY4));
                    $('#annualProfit1').html(thousands_separators(data[0].AnnualProfit1));
                    $('#annualProfit2').html(thousands_separators(data[0].AnnualProfit2));
                    $('#annualProfit3').html(thousands_separators(data[0].AnnualProfit3));
                    $('#annualProfit4').html(thousands_separators(data[0].AnnualProfit4));
                    if (data[0].IsPubliclyListed === 'Y') {                        
                        attachment1 = data[0].Attachment1.replace(/%20/g, " ");
                        attachment2 = data[0].Attachment2.replace(/%20/g, " ");
                        $('#attach1').attr('href', 'PortalDocs/RFX/' + sessionStorage.getItem('CurrentRFXID') + '/' + sessionStorage.getItem('VendorId') + '/' + attachment1 + '').html(data[0].Attachment1);
                        $('#attach2').attr('href', 'PortalDocs/RFX/' + sessionStorage.getItem('CurrentRFXID') + '/' + sessionStorage.getItem('VendorId') + '/' + attachment2 + '').html(data[0].Attachment2);
                        $('#attach-div').removeClass('display-none');
                    } else {
                        
                        $('#spnattach1').html('');
                        $('#spnattach2').html('');
                        $('#attach1').attr('href', 'javascript:;');
                        $('#attach2').attr('href', 'javascript:;');
                        $('#attach-div').addClass('display-none');
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

function Isattachment() {
    if ($('#ddlPubliclisted').val() == 'Y') {
        $('#attach-div').removeClass('display-none')
    } else {
        $('#fileToUpload1').val('');
        $('#fileToUpload2').val('');
        $('#attach-div').addClass('display-none')
    }
}

function Filltblfinancedetails() {
    $('#tblfinancedetails').empty();
    $('#tblfinancedetails').append('<thead><tr><th>Year</th><th>Turnover</th><th>Annual Profit After Tax</th></tr></thead>')
    var today = new Date();
    var yyyy = today.getFullYear();
    $('#tblfinancedetails').append('<tr><td id="yearDesc1">' + (yyyy - 1) + ' - ' + yyyy + '</td><td><p class="form-control-static" id="txtturnover1" name="txtturnover1"></p></td><td><p class="form-control-static" id="annualProfit1"  name="annualProfit1"></p></td></tr>')
    $('#tblfinancedetails').append('<tr><td id="yearDesc2">' + (yyyy - 2) + ' - ' + (yyyy - 1) + '</td><td><p class="form-control-static" id="txtturnover2" name="txtturnover2"></p></td><td><p class="form-control-static" id="annualProfit2" name="annualProfit2"></p></td></tr>')
    $('#tblfinancedetails').append('<tr><td id="yearDesc3">' + (yyyy - 3) + ' - ' + (yyyy - 2) + '</td><td><p class="form-control-static" id="txtturnover3" name="txtturnover3"></p></td><td><p class="form-control-static" id="annualProfit3" name="annualProfit3"></p></td></tr>')
    $('#tblfinancedetails').append('<tr><td id="yearDesc4">' + (yyyy - 4) + ' - ' + (yyyy - 3) + '</td><td><p class="form-control-static" id="txtturnover4" name="txtturnover4"></p></td><td><p class="form-control-static" id="annualProfit4" name="annualProfit4"></p></td></tr>')
     
}

function ApproveRFI(For) {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var data = {
        "RFXID": sessionStorage.getItem('CurrentRFXID'),
        "VendorID": sessionStorage.getItem('VendorId'),
        'UserId':sessionStorage.getItem('UserID'),
        'For': For,
        'Remarks': $('#txtrejectreason').val(),
        "UserName": sessionStorage.getItem('UserName'),
        "UserEmail": sessionStorage.getItem('EmailID')
    }
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFXMaster/RFXApproval_Reject",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            
                bootbox.alert("RFI Submited.", function () {
                    window.location = sessionStorage.getItem("HomePage")
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
    $("#rejectionForm").validate().resetForm();
    $("#rejectionForm").find('.has-error').removeClass("has-error");
});
