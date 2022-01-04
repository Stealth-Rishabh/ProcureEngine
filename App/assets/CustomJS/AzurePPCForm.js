var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)
var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];

var RFQSubject='';
$('.maxlength').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

function fetchReguestforQuotationDetails() {
  
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {
          
            $('#tblvendors > tbody').empty();
            $('#tblvendors > thead').empty();
            if (RFQData.length > 0) {
                jQuery('#lblenquirysubject').text(RFQData[0].general[0].rfqSubject)
                jQuery('#RFQConfigueron').html(RFQData[0].general[0].rfqConfigureDate)
                RFQSubject = RFQData[0].general[0].rfqSubject;
               
                if (RFQData[0].vendors.length > 0) {
                    $('#tblvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:30%!important;'>Quotation Received</th><th style='width:30%!important;'>Technically Acceptable</th></tr></thead><tbody>");
                    for(i= 0;i < RFQData[0].vendors.length;i++){
                        $('#tblvendors').append("<tr><td class=hide>" + RFQData[0].vendors[i].vendorId + "</td><td>" + RFQData[0].vendors[i].vendorName + "</td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td></tr>")
                        $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation'+i+' value="Y" checked /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation'+i+' value="N"  />No</label></div>')
                        $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y"  checked/> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  />No</label></div>')
                    }
                    $('#tblvendors').append("</tbody>");
                }
               
            }
        },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', '');
                }
                jQuery.unblockUI();
                return false;
                
            }
    });

}

var form = $('#frmIntroduction');
var error = $('.alert-danger');
var success = $('.alert-success');
var BiddingVendorQuery = [];
function formvalidate() {
   
    form.validate({
        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {

            //txtrfirfqsubject: {
            //    required: true
            //}

        },

        messages: {

        },
        invalidHandler: function (event, validator) {

        },

        highlight: function (element) {
             $(element).closest('.form-group').addClass('has-error');

        },
        unhighlight: function (element) {
         $(element).closest('.form-group').removeClass('has-error');

        },

        success: function (label) {
        },
        submitHandler: function (form) {
             frmAzurePPCForm();
        }

    });

}
function frmAzurePPCForm() {
    
    var i = 0;
    var BiddingVendorQuery = '';
    $("#tblvendors> tbody > tr").each(function (index) {
        BiddingVendorQuery = BiddingVendorQuery + $(this).find("td").eq(0).html() + '~' + $("input[name=OpQuotation" + index + "]:checked").val() + '~' + $("input[name=OpTechAccep" + index + "]:checked").val() + '#';
    });
   
    var EnquiryIssuedthrogh = $("input[name='optionenquiryissued']:checked").val();
    var LowestPriceOffer = $("input[name='LowestPriceOffer']:checked").val();
    var repeatorder = $("input[name='repeatorder']:checked").val();
    var Data = {
        "PPCID": parseInt($('#hdnPPCID').val()),
        "RFQID": parseInt(RFQID),
        "BidID":0,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "Introduction": jQuery('#txtintroduction').val(),
        "CostBenefitAnalysis": jQuery('#txtcostbenefit').val(),
        "Budgetavailabilty": jQuery('#txtbudgetavailbilty').val(),
        "Workordergiven": jQuery('#txtpartordergiven').val(),
        "Completionsechdule": jQuery('#txtcompletionsechdule').val(),
        "Lessthan3Quotes": jQuery('#txtlessthan3quotes').val(),
        "AwardcontractthanL1": jQuery('#txtawardotherthanL1').val(),
        "Splitingorder01Vendor": jQuery('#txtsplitingmorethan01').val(),
        "GeneralRemarks": jQuery('#txtgemeralremarks').val(),
        "IssuingRFQtoVendor": jQuery('#txtrationalrfqvendor').val(),
        "Enquirynotsentvendors": jQuery('#txtenquirynotsent').val(),
        "EnquiryIssuedOn": jQuery('#RFQConfigueron').text(),
        "EnquiryIssuedthrogh": EnquiryIssuedthrogh,
        "RecomOrderLowPriceOffer": LowestPriceOffer,
        "RecomRepeatOrder": repeatorder,
        "RecomSuppEnclosure": jQuery('#txtsupportedenclosure').val(),
        "RecomCompFinalPrice": jQuery('#tctcomfinalprice').val(),
        "RecomQuotationofParties": jQuery('#txtquotationparties').val(),
        "WorkOrderRecomParty": jQuery('#txtorderrecparty').val(),
        "PurchaseOrder": jQuery('#txtworkordervalue').val(),
        "InternalCostestimate": jQuery('#txtinternalcost').val(),
        "Terms": jQuery('#txtterms').val(),
        "Scopeofwork": jQuery('#txtscopework').val(),
        "Deliverables": jQuery('#txtdeliverables').val(),
        "Paymentterms": jQuery('#txtpaymentterms').val(),
        "ApplicableTaxduty": jQuery('#txtapplicabletax').val(),
        "WhetherLDApplicable": jQuery('#txtLDapplicable').val(),
        "WhetherCPBGApplicable": jQuery('#txtCPBGapplicable').val(),
        "PRDetails": jQuery('#txtPRdetails').val(),
        "EnteredBy": sessionStorage.getItem("UserID"),
        "BiddingVendorDetails":BiddingVendorQuery
       
    };
     //alert(JSON.stringify(Data))
    //console.log(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "Azure/insPPC/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
          
            if (data == '1') {
                $('#spansuccess1').html("PPC Form Saved Successfully...");
                success.show();
                success.fadeOut(5000);
                App.scrollTo(success, -200);
                bootbox.dialog({
                    message: "PPC Form submitted Successfully..",
                    buttons: {
                        confirm: {
                            label: "Yes",
                            className: "btn-success",
                            callback: function () {
                                
                                if ($('#hdnPPCID').val() == "0") {
                                    fnSendActivitytoCommercialForPPCApp();
                                    var encrypdataAZ = fnencrypt("RFQID=" + RFQID + "&RFQSubject=" + RFQSubject)
                                    var encrypdataAp = fnencrypt("RFQID=" + RFQID + '&AppType=E')
                                    setTimeout(function () {
                                        window.location = "AzeRFQAnalysis.html?param=" + encrypdataAZ;
                                    }, 1000);
                                }
                                else {
                                    window.location = "eRFQAzPPCApproval.html?param=" + encrypdataAp
                                }
                            }
                        }
                        
                    }
                });

            }
            else if (data == '2') {
                $('#spansuccess1').html("Data Updated Successfull...");
                success.show();
                success.fadeOut(5000);
                App.scrollTo(success, -200);
                bootbox.dialog({
                    message: "PPC Form Updated Successfully..",
                    buttons: {
                        confirm: {
                            label: "Yes",
                            className: "btn-success",
                            callback: function () {
                                
                                window.close();
                               
                            }
                        }

                    }
                });

            }
            else {
                jQuery("#spandanger").text("Data Already Exists...");
                error.show();
                error.fadeOut(5000)
            }
           
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }
        
    });
}

function fetchAzPPcFormDetails() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=" + RFQID +"&BidID=0" ,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data[0].azureDetails.length > 0) {
                $('#tblvendors').empty();
                //$('#tblvendors > thead').empty();
                jQuery('#btnsubmit').text("Update");
                jQuery('#txtintroduction').val(data[0].azureDetails[0].introduction)
                jQuery('#txtcostbenefit').val(data[0].azureDetails[0].costBenefitAnalysis)
                $('#hdnPPCID').val(data[0].azureDetails[0].ppcid)
                jQuery('#txtbudgetavailbilty').val(data[0].azureDetails[0].budgetavailabilty);
                jQuery('#txtpartordergiven').val(data[0].azureDetails[0].workordergiven);
                jQuery('#txtawardotherthanL1').val(data[0].azureDetails[0].awardcontractthanL1);
                jQuery('#txtlessthan3quotes').val(data[0].azureDetails[0].lessthan3Quotes);
                jQuery('#txtcompletionsechdule').val(data[0].azureDetails[0].completionsechdule);
                jQuery('#txtsplitingmorethan01').val(data[0].azureDetails[0].splitingorder01Vendor);
                jQuery('#txtgemeralremarks').val(data[0].azureDetails[0].generalRemarks);
                jQuery('#txtrationalrfqvendor').val(data[0].azureDetails[0].issuingRFQtoVendor);
                jQuery('#txtenquirynotsent').val(data[0].azureDetails[0].enquirynotsentvendors);

                jQuery('#RFQConfigueron').val(data[0].azureDetails[0].enquiryIssuedOn);
               
               // alert(data[0].AzureDetails[0].EnquiryIssuedthrogh)
                if (data[0].azureDetails[0].recomOrderLowPriceOffer == "Y") {
                    $("#LowestPriceOfferY").attr("checked", "checked");
                    $("#LowestPriceOfferY").closest('span').addClass('checked')
                    $("#LowestPriceOfferN").closest('span').removeClass('checked')
                    $("#LowestPriceOfferN").removeAttr("checked");
                }
                else {
                    $("#LowestPriceOfferN").attr("checked", "checked");
                    $("#LowestPriceOfferN").closest('span').addClass('checked')
                    $("#LowestPriceOfferY").closest('span').removeClass('checked')
                    $("#LowestPriceOfferY").removeAttr("checked");
                }
                if (data[0].azureDetails[0].recomRepeatOrder == "Y") {
                    $("#repeatorderY").attr("checked", "checked");
                    $("#repeatorderY").closest('span').addClass('checked')
                    $("#repeatorderN").closest('span').removeClass('checked')
                    $("#repeatorderN").removeAttr("checked");
                }
                else {
                    $("#repeatorderN").attr("checked", "checked");
                    $("#repeatorderY").closest('span').removeClass('checked')
                    $("#repeatorderN").closest('span').addClass('checked')
                    $("#repeatorderY").removeAttr("checked");
                }
                if (data[0].azureDetails[0].enquiryIssuedthrogh == "ProcurEngine") {
                    $("#optionenquiryissuedP").attr("checked", "checked");
                    $("#optionenquiryissuedP").closest('span').addClass('checked')
                    $("#optionenquiryissuedE").closest('span').removeClass('checked')
                    $("#optionenquiryissuedF").closest('span').removeClass('checked')
                    $("#optionenquiryissuedE").removeAttr("checked");
                    $("#optionenquiryissuedF").removeAttr("checked");
                   
                }
                else if (data[0].azureDetails[0].enquiryIssuedthrogh == "Email") {
                    $("#optionenquiryissuedP").removeAttr("checked");
                    $("#optionenquiryissuedE").attr("checked", "checked");
                    $("#optionenquiryissuedF").removeAttr("checked");
                    $("#optionenquiryissuedE").closest('span').addClass('checked')
                    $("#optionenquiryissuedP").closest('span').removeClass('checked')
                    $("#optionenquiryissuedF").closest('span').removeClass('checked')
                }
                else {
                    $("#optionenquiryissuedF").closest('span').addClass('checked')
                    $("#optionenquiryissuedP").closest('span').removeClass('checked')
                    $("#optionenquiryissuedE").closest('span').removeClass('checked')
                    $("#optionenquiryissuedP").removeAttr("checked");
                    $("#optionenquiryissuedE").removeAttr("checked");
                    $("#optionenquiryissuedF").attr("checked", "checked");
                   
                }
               
                jQuery('#txtsupportedenclosure').val(data[0].azureDetails[0].recomSuppEnclosure);
                jQuery('#tctcomfinalprice').val(data[0].azureDetails[0].recomCompFinalPrice);
                jQuery('#txtquotationparties').val(data[0].azureDetails[0].recomQuotationofParties);
                jQuery('#txtorderrecparty').val(data[0].azureDetails[0].workOrderRecomParty);
                jQuery('#txtworkordervalue').val(data[0].azureDetails[0].purchaseOrder);
                jQuery('#txtinternalcost').val(data[0].azureDetails[0].internalCostestimate);
                jQuery('#txtterms').val(data[0].azureDetails[0].terms);
                jQuery('#txtscopework').val(data[0].azureDetails[0].scopeofwork);
                jQuery('#txtdeliverables').val(data[0].azureDetails[0].deliverables);
                
                jQuery('#txtapplicabletax').val(data[0].azureDetails[0].applicableTaxduty);
                jQuery('#txtpaymentterms').val(data[0].azureDetails[0].paymentterms);//
                jQuery('#txtLDapplicable').val(data[0].azureDetails[0].whetherLDApplicable);
                jQuery('#txtCPBGapplicable').val(data[0].azureDetails[0].whetherCPBGApplicable);
                jQuery('#txtPRdetails').val(data[0].azureDetails[0].prDetails);
                
                if (data[0].biddingVendor.length > 0) {
                    $('#tblvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:30%!important;'>Quotation Received</th><th style='width:30%!important;'>Technically Acceptable</th></tr></thead>");
                    for (i = 0; i < data[0].biddingVendor.length; i++) {
                        $('#tblvendors').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td></tr>")
                        $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="Y"  id=OpQuotationY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="N" id=OpQuotationN' + i + ' />No</label></div>')
                        $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y" id=OpTechAccepY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  id=OpTechAccepN' + i + ' />No</label></div>')
                       
                            if (data[0].biddingVendor[i].quotationReceived == "Y") {
                                $("#OpQuotationY" + i).attr("checked", "checked");
                                $("#OpQuotationN" + i).removeAttr("checked");
                            }
                            else {
                                $("#OpQuotationY" + i).removeAttr("checked");
                                $("#OpQuotationN" + i).attr("checked", "checked");
                            }
                            if (data[0].biddingVendor[i].texhnicallyAcceptable == "Y") {
                                $("#OpTechAccepY" + i).attr("checked", "checked");
                                $("#OpTechAccepN" + i).removeAttr("checked");
                            }
                            else {
                                $("#OpTechAccepY" + i).removeAttr("checked");
                                $("#OpTechAccepN" + i).attr("checked", "checked");
                            }
                       
                    }
                  
                }
                var attach = "";
                jQuery("#tblAttachments").empty();

                if (data[0].attachments.length > 0) {
                    jQuery('#tblAttachments').append("<thead><tr><th class='bold'>Attachment</th><th></th></tr></thead>");
                    for (i = 0; i < data[0].attachments.length; i++) {
                        attach = data[0].attachments[i].attachment.replace(/\s/g, "%20");
                        var str = '<tr><td style="width:47%!important"><a id=eRFqTerm' + i +' style="pointer:cursur;text-decoration:none;" onclick="DownloadFilePPC(this)" href="javascript:;" >' + data[0].attachments[i].attachment + "</a></td>";
                        str += "<td style='width:5%!important'><button type='button' class='btn btn-xs btn-danger' id=Removebtnattach" + i + " onclick=fnRemoveAttachment(\'" + data[0].attachments[i].id + "'\,\'PPCAttach'\)><i class='glyphicon glyphicon-remove-circle'></i></button></td></tr>";
                        jQuery('#tblAttachments').append(str);
                    }
                }
               
            }
            else {
                jQuery('#btnsubmit').text("Submit");
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }

    })
}
function DownloadFilePPC(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + RFQID + '/PPC');
}
function fnSendActivitytoCommercialForPPCApp() {
    var Data = {
        "ApproverType": "C",
        "RFQID": parseInt(RFQID),
        "CreatedBy": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "Type": "SendActivityToCommForPPC",
        "IsApproverObserver": '',
        "PPCApprovers":''
    }
     //alert(JSON.stringify(Data))
    // console.log(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "Azure/ins_PPCApproval/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
          // alert(data[0].OutPut)
        },
        error: function (xhr, status, error) {
        var err = xhr.responseText// eval("(" + xhr.responseText + ")");
        if (xhr.status == 401) {
            error401Messagebox(err.Message);
        }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
    }
    })
}

//**** Add Attachments will do correct after first publishment on AZure
function addmoreattachments() {
    if (jQuery('#file1').val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Attach File Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    
    else {
        var attchname = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1)
        attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
        var Attachments = {
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "RFQID": parseInt(RFQID),
            "Attachment": attchname,
            "UserID": sessionStorage.getItem('UserID'),
            
        }
        // alert(JSON.stringify(Attachments))
        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "Azure/AddPPCFile",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Attachments),
            dataType: "json",
            success: function (data) {

               

                    if (data == "1") {
                        //** Upload Files on Azure PortalDocs folder
                        if ($('#file1').val() != '') {
                            fnUploadFilesonAzure('file1', attchname, 'eRFQ/' + RFQID+'/PPC');

                        }
                        fetchAttachments()
                        jQuery('#file1').val('')
                        return false;

                    }
                    else if (data == "2") {
                        $('.alert-danger').show();
                        $('#spandanger').html('Attachment already Exists.');
                        Metronic.scrollTo($(".alert-danger"), -200);
                        $('.alert-danger').fadeOut(7000);
                        return false;
                    }
               

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', '');
                }
                jQuery.unblockUI();
                return false;
            }

        });
    }
}

function fetchAttachments() {
  
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=" + RFQID +"&BidID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            var attach = "";
            jQuery("#tblAttachments").empty();

            if (data[0].attachments.length > 0) {

                jQuery('#tblAttachments').append("<thead><tr><th class='bold'>Attachment</th><th></th></tr></thead>");
                for (i = 0; i < data[0].attachments.length; i++) {
                    attach = data[0].attachments[i].attachment.replace(/\s/g, "%20");
                    var str = '<tr><td><a id=eRFqTerm' + i +' style="pointer:cursur;text-decoration:none;" onclick="DownloadFilePPC(this)"  href="javascript:;" >' + data[0].attachments[i].attachment + "</a></td>";
                    str += "<td style='width:5%!important'><button type='button' class='btn btn-xs btn-danger' id=Removebtnattach" + i + " onclick=fnRemoveAttachment(\'" + data[0].attachments[i].id + "'\,\'PPCAttach'\)><i class='glyphicon glyphicon-remove-circle'></i></button></td></tr>";
                    jQuery('#tblAttachments').append(str);
                }
            }

            else {
                $('#txtVendorGroup').removeAttr('disabled')
                $('#txtVendor').removeAttr('disabled')
                jQuery('#tblAttachments').append("<tr><td>No Attachments!!</td></tr>")
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }
    })
}
function fnRemoveAttachment(POID, deletionfor) {
     var Attachments = {
        "SrNo":parseInt(POID),
        "DeletionFor": deletionfor,
        "RFQID": 0

    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQAttachmentQuesremove",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Attachments),
        dataType: "json",
        success: function (data) {
            //if (data.length > 0) {
                if (data == "1") {
                    fetchAttachments();
                    $('.alert-success').show();
                    $('#spansuccess1').html('Record deleted successfully!');

                    Metronic.scrollTo($(".alert-success"), -200);
                    $('.alert-success').fadeOut(7000);

                    return false;
                }
            //}
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }
    })
}