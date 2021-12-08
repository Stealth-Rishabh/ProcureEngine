var BidID = "";
var ButtonType = '';
jQuery(document).ready(function () {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    BidID = getUrlVarsURL(decryptedstring)["BidID"]
    
    FetchRecomendedVendor(BidID)
    validateAppsubmitData();
    setTimeout(function () {
        fetchAzPPcFormDetails(BidID)
    }, 1000)
    if (sessionStorage.getItem('IsObserver') == "Y") {
        $('#divRemarksApp').hide();
    }
    else {
        $('#divRemarksApp').show();
    }
    
});

function fetchAzPPcFormDetails() {
     jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=0&BidID=" + BidID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            if (data[0].azureDetails.length > 0) {
                $('#tblvendors').empty();
                jQuery('#txtintroduction').text(data[0].azureDetails[0].introduction)
                jQuery('#txtcostbenefit').text(data[0].azureDetails[0].costBenefitAnalysis)
                $('#hdnPPCID').val(data[0].azureDetails[0].ppcid)
                jQuery('#txtbudgetavailbilty').text(data[0].azureDetails[0].budgetavailabilty);
                jQuery('#txtpartordergiven').text(data[0].azureDetails[0].workordergiven);
                jQuery('#txtawardotherthanL1').text(data[0].azureDetails[0].awardcontractthanL1);
                jQuery('#txtlessthan3quotes').text(data[0].azureDetails[0].lessthan3Quotes);
                jQuery('#txtcompletionsechdule').text(data[0].azureDetails[0].completionsechdule);
                jQuery('#txtsplitingmorethan01').text(data[0].azureDetails[0].splitingorder01Vendor);
                jQuery('#txtgemeralremarks').text(data[0].azureDetails[0].generalRemarks);
                jQuery('#txtrationalrfqvendor').text(data[0].azureDetails[0].issuingRFQtoVendor);
                jQuery('#txtenquirynotsent').text(data[0].azureDetails[0].enquirynotsentvendors);

                jQuery('#RFQConfigueron').text(data[0].azureDetails[0].enquiryIssuedOn);

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

                jQuery('#txtsupportedenclosure').text(data[0].azureDetails[0].recomSuppEnclosure);
                jQuery('#tctcomfinalprice').text(data[0].azureDetails[0].recomCompFinalPrice);
                jQuery('#txtquotationparties').text(data[0].azureDetails[0].recomQuotationofParties);
                jQuery('#txtorderrecparty').text(data[0].azureDetails[0].workOrderRecomParty);
                jQuery('#txtworkordervalue').text(data[0].azureDetails[0].purchaseOrder);
                jQuery('#txtinternalcost').text(data[0].azureDetails[0].internalCostestimate);
                jQuery('#txtterms').text(data[0].azureDetails[0].terms);
                jQuery('#txtscopework').text(data[0].azureDetails[0].scopeofwork);
                jQuery('#txtdeliverables').text(data[0].azureDetails[0].deliverables);

                jQuery('#txtapplicabletax').text(data[0].azureDetails[0].applicableTaxduty);
                jQuery('#txtpaymentterms').text(data[0].azureDetails[0].paymentterms);//
                jQuery('#txtLDapplicable').text(data[0].azureDetails[0].whetherLDApplicable);
                jQuery('#txtCPBGapplicable').text(data[0].azureDetails[0].whetherCPBGApplicable);
                jQuery('#txtPRdetails').text(data[0].azureDetails[0].prDetails);
               
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
                    jQuery('#tblAttachments').append("<thead><tr><th class='bold'>Attachment</th></tr></thead>");
                    for (i = 0; i < data[0].attachments.length; i++) {
                        attach = data[0].attachments[i].attachment.replace(/\s/g, "%20");
                        var str = '<tr><td style="width:47%!important"><a id=eRFqTerm' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFilePPC(this)" href="javascript:;" >' + data[0].attachments[i].attachment + "</a></td></tr>";
                        jQuery('#tblAttachments').append(str);
                    }
                }
                jQuery.unblockUI();

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
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + BidID + '/PPC');
}
function validateAppsubmitData() {
    var form1 = $('#frmsubmitapp');
    var error1 = $('.alert-danger', form1);
    var success1 = $('.alert-success', form1);
    form1.validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",

        rules: {
            ddlActionType: {
                required: true,
            },
            ddlVendors: {
                required: true,
            },
            txtRemarksApp: {
                required: true,
            }
        },
        messages: {
            ddlActionType: {
                required: "Please select Action"
            },
            ddlVendors: {
                required: "Please select vendor"
            },
            txtRemarksApp: {
                required: "Please enter your comment"
            }
        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
            success1.hide();
            error1.show();
            // App.scrollTo(error1, -300);
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.Input-group').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.Input-group').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label
                .closest('.Input-group').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {

            ApprovalRejectPPCApp();

        }
    });
}
function ApprovalRejectPPCApp() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    
    var Approvers = {
        "ApproverType": "P",
        "BidID": parseInt(BidID),
        "CreatedBy": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "Type": "PPC",
        "PPCApprovers": "",
        "Action": jQuery("#ddlActionType option:selected").val(),
        "Remarks": jQuery("#txtRemarksApp").val()
    }
    //alert(JSON.stringify(approvalbyapp))
    console.log(JSON.stringify(Approvers))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/ins_BidPPCApproval",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(Approvers),
        crossDomain: true,
        dataType: "json",
        success: function () {
            bootbox.alert("Transaction Successful..", function () {
                window.location = "index.html";
                return false;
            });

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
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