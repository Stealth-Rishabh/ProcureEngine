
var vendorid = 0;
var PPCID = 0;
$(document).ready(function () {


    var path = window.location.pathname;
    page = path.split("/").pop();

    if (window.location.search) {
        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)
        PPCID = getUrlVarsURL(decryptedstring)["PPCID"]

        //IsApp = getUrlVarsURL(decryptedstring)["App"]
        //FwdTo = getUrlVarsURL(decryptedstring)["FwdTo"]
        //AppStatus = getUrlVarsURL(decryptedstring)["AppStatus"]
        jQuery("#divRemarksAppComm").show();

        //if (IsApp == 'N' && FwdTo != 'Admin') {


        //}

        fetchPPCApproverDetails();
    }
    else {
        jQuery('#btnsubmit').text("Submit");
    }

});
function fetchPPCApproverDetails() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=" + PPCID + "&BidID=-1",
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
                jQuery('#txtsubject').val(data[0].azureDetails[0].enquirySubject)
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
                jQuery('#txtAmountFrom').val(data[0].azureDetails[0].nfaAmount);
                jQuery('#txtBudget').val(data[0].azureDetails[0].nfaBudget);
                jQuery('#dropCurrency').val(data[0].azureDetails[0].nfaCurrency);
                jQuery('#ddlBudget').val(data[0].azureDetails[0].budgetStatus);
                jQuery('#ddlPurchaseOrg').val(data[0].azureDetails[0].purchaseOrg);
                jQuery('#ddlPurchasegroup').val(data[0].azureDetails[0].purchaseGroup);

                jQuery('#txtenquiryissuedon').val(fnConverToLocalTime(data[0].azureDetails[0].enquiryIssuedOn));

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
                    //$('#tblvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th>TPI</th></tr></thead>");
                    for (i = 0; i < data[0].biddingVendor.length; i++) {
                        if (i > 0) {
                            addvendor();
                        }
                        $('#vendoridrow' + i).text(data[0].biddingVendor[i].vendorID)
                        $('#vendorSearch' + i).val(data[0].biddingVendor[i].vendorName)
                        /* $('#tblvendors').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td><td id=TDpolyticExp" + i + "></td><td id=TDvalidatescm" + i + "></td><td id=TPI" + i + "></td></tr>")
                         $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="Y"  id=OpQuotationY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="N" id=OpQuotationN' + i + ' />No</label></div>')
                         $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y" id=OpTechAccepY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  id=OpTechAccepN' + i + ' />No</label></div>')
                         $('#TDpolyticExp' + i).append('<div> <label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="Y" id=politicalyexpY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="N"  id=politicalyexpN' + i + ' />No</label></div>')
                         $('#TDvalidatescm' + i).append('<div> <label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="Y" id=QuotedSCMY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="N"  id=QuotedSCMN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="NA"  id=QuotedSCMNA' + i + ' />NA</label></div>')
                         $('#TPI' + i).append('<div> <label class="radio-inline"><input type="radio" name=TPI' + i + ' value="Y" id=TPIY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="N"  id=TPIN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="NA"  id=TPINA' + i + ' />NA</label></div>')
                         */
                        if (data[0].biddingVendor[i].quotationReceived == "Y") {
                            $("#OpQuotationY" + i).attr("checked", "checked");
                            $("#OpQuotationN" + i).removeAttr("checked");
                        }
                        else {
                            $("#OpQuotationY" + i).removeAttr("checked");
                            $("#OpQuotationN" + i).attr("checked", "checked");
                        }
                        if (data[0].biddingVendor[i].tpi == "Y") {
                            $("#TPIY" + i).attr("checked", "checked");
                            $("#TPIN" + i).removeAttr("checked");
                            $("#TPINA" + i).removeAttr("checked");
                        }
                        else if (data[0].biddingVendor[i].tpi == "NA") {
                            $("#TPINA" + i).attr("checked", "checked");
                            $("#TPIN" + i).removeAttr("checked");
                            $("#TPIY" + i).removeAttr("checked");
                        }

                        else {
                            $("#TPIY" + i).removeAttr("checked");
                            $("#TPIN" + i).attr("checked", "checked");
                            $("#TPINA" + i).removeAttr("checked");
                        }
                        if (data[0].biddingVendor[i].texhnicallyAcceptable == "Y") {
                            $("#OpTechAccepY" + i).attr("checked", "checked");
                            $("#OpTechAccepN" + i).removeAttr("checked");
                        }
                        else {
                            $("#OpTechAccepY" + i).removeAttr("checked");
                            $("#OpTechAccepN" + i).attr("checked", "checked");
                        }
                        if (data[0].biddingVendor[i].politicallyExposed == "Y") {
                            $("#politicalyexpY" + i).attr("checked", "checked");
                            $("#politicalyexpN" + i).removeAttr("checked");
                        }
                        else {
                            $("#politicalyexpY" + i).removeAttr("checked");
                            $("#politicalyexpN" + i).attr("checked", "checked");
                        }
                        if (data[0].biddingVendor[i].quotedValidatedSCM == "Y") {
                            $("#QuotedSCMY" + i).attr("checked", "checked");
                            $("#QuotedSCMN" + i).removeAttr("checked");
                        }
                        else if (data[0].biddingVendor[i].quotedValidatedSCM == "NA") {
                            $("#QuotedSCMNA" + i).attr("checked", "checked");
                            $("#QuotedSCMNA" + i).removeAttr("checked");
                        }
                        else {
                            $("#QuotedSCMY" + i).removeAttr("checked");
                            $("#QuotedSCMN" + i).attr("checked", "checked");
                        }
                    }
                    $('#tblvendors').append("<tr><td colspan=5></td><td><span class='help-block'><b>Note*</b><br>Y - IF TPI ALREADY DONE</br> N - TPI WILL BE DONE WHILE PLACING THE ORDER WITH FINAL VENDOR</br>Not Applicable - TPI not required</span></td></tr>")
                }
                var attach = "";
                jQuery("#tblAttachments").empty();

                if (data[0].attachments.length > 0) {
                    jQuery('#tblAttachments').append("<thead><tr><th class='bold'>Attachment</th><th></th></tr></thead>");
                    for (i = 0; i < data[0].attachments.length; i++) {
                        attach = data[0].attachments[i].attachment.replace(/\s/g, "%20");
                        var str = '<tr><td style="width:47%!important"><a id=eRFqTerm' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFilePPC(this)" href="javascript:;" >' + data[0].attachments[i].attachment + "</a></td>";
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
function fetchVendorAutoComplete(index) {
    var returnitem = '';
    $('#vendoridrow' + index).text('0');
    jQuery(".vendorsearch").typeahead({
        source: function (query, process) {

            var data = allvendorsforautocomplete;
            var vName = '';
            usernames = [];
            map = {};
            var username = "";
            jQuery.each(data, function (i, username) {
                vName = username.participantName + ' (' + username.companyEmail + ')'
                map[vName] = username;
                usernames.push(vName);
            });
            process(usernames);

        },
        minLength: 2,
        updater: function (item) {
            var status = "true";
            if (map[item].participantID != "0") {
                vendorid = map[item].participantID
                var arr = $("#tblvendorlist >tbody>tr");
                $.each(arr, function (i, item) {
                    var currIndex = $("#tblvendorlist >tbody>tr").eq(i);

                    var matchText = currIndex.find("td:eq(1)").text();
                    $(this).nextAll().each(function (i, inItem) {
                        if (matchText == vendorid) {
                            status = 'false';
                            return false;
                        }
                    });
                });

                if (status == 'false') {
                    $('#vendoridrow' + index).text('0')
                    $('.alert-danger').show();
                    $('#spandanger').html('Vendor is already added.');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                    //$('#vendorSearch' + index).typeahead('val', '')
                    vendorid = 0;

                }
                else {
                    $('#vendoridrow' + index).text(vendorid)
                    returnitem = item;
                }

            }
            else {
                $('#vendoridrow' + index).text('0')
                gritternotification('Please select Vendor!!!');

            }


            return returnitem;
        }
    });
}

$("#tablevendor").hide()
$('.maxlength').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

var form = $('#frmIntroduction');
var error = $('.alert-danger');
var success = $('.alert-success');
jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    //"Value cannot be {0}"
    "This field is required."
);

function formvalidate() {
    form.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {

            txtsubject: {
                required: true
            },
            txtAmountFrom: {
                required: true,
                number: true
            },
            txtBudget: {
                number: true
            },
            txtenquiryissuedon: {
                required: true
            }
        },
        messages: {

        },
        errorPlacement: function (error, element) {
            //$("#btncal").css("margin-top", "-22px");
        },
        invalidHandler: function (event, validator) {
            window.scrollTo(0, 0);
            error.show()
            $('#spandanger').text("Please fill Highlighted fields.")
            error.fadeOut(5000);

        },

        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
            //$(element).focus();
        },
        unhighlight: function (element) {

            $(element).closest('.form-group').removeClass('has-error');

            //element.remove()

        },
        success: function (label) {
        },
        submitHandler: function (form) {
            //frmApprovalPPCForm();
            BindApprovers();
        }

    });

}
function addvendor() {


    var num = 0;
    var maxinum = -1, i = 0;
    $("#tblvendorlist tr:gt(0)").each(function () {
        var this_row = $(this);
        num = (this_row.closest('tr').attr('id')).substring(3, (this_row.closest('tr').attr('id')).length)
        if (parseInt(num) > parseInt(maxinum)) {
            maxinum = num;
        }
    });

    i = parseInt(maxinum) + 1;

    $('#tblvendorlist').append("<tr id=row" + i + "><td><button class='btn green-haze btn-sm' id=addBtn" + i + " type='button' onclick='addvendor()'><i class='fa fa-plus'></i></button><button type='button' id=btnvendordelete" + i + " class='btn btn-sm btn-danger' onclick='deleteLFrow(" + i + ")' ><i class='glyphicon glyphicon-remove-circle'></i></button></td><td class=hide id=vendoridrow" + i + ">" + vendorid + "</td><td width='20%' id=vendorname" + i + " class=form-group ><input type='text' autocomplete='off' class='form-control vendorsearch' placeholder='Search Vendor Name' id=vendorSearch" + i + " name=vendorSearch" + i + "  onkeyup='fnclearcss(" + i + ")' /></td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td><td id=TDpolyticExp" + i + "></td><td id=TDvalidatescm" + i + "></td><td id=TPI" + i + "></td></tr>")
    $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="Y" checked /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="N"  />No</label></div>')
    $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y"  checked/> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  />No</label></div>')
    $('#TDpolyticExp' + i).append('<div> <label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="Y" id=politicalyexpY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="N"  id=politicalyexpN' + i + '  checked />No</label></div>')
    $('#TDvalidatescm' + i).append('<div> <label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="Y" id=QuotedSCMY' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="N"  id=QuotedSCMN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="NA"  id=QuotedSCMNA' + i + ' />NA</label></div>')
    $('#TPI' + i).append('<div> <label class="radio-inline"><input type="radio" name=TPI' + i + ' value="Y" id=TPIY' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="N"  id=TPIN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="NA"  id=TPINA' + i + ' />NA</label></div>')
    fetchVendorAutoComplete(i);
    if (i == 0) {
        $('#btnvendordelete' + i).hide()
    }
    else {
        $('#btnvendordelete' + i).show()
    }
    form.validate()
    $('#vendorSearch' + i).rules('add', {
        required: true,
        notEqualTo: 0
    });



}
function fnclearcss(index) {
    $('#vendorSearch' + index).css("border", "1px solid #e5e5e5");
}

function deleteLFrow(rowid) {

    $('#row' + rowid).remove();

}

function BindApprovers() {

    var amount = removeThousandSeperator($("#txtAmountFrom").val());
    var budget = 0;
    if ($("#txtBudget").val() != '') {
        _budget = $("#txtBudget").val();
    }
    budget = removeThousandSeperator(_budget);
    var budgetType = $("#ddlBudget option:selected").val();
    var orgid = parseInt($('#ddlPurchaseOrg option:selected').val());
    var groupId = parseInt($('#ddlPurchasegroup option:selected').val());
    var url = "NFA/FetchNFAApprovers?customerId=" + parseInt(CurrentCustomer) + "&userID=" + UserID + "&amount=" + parseFloat(amount) + "&groupId=" + groupId + "&orgid=" + orgid + "&conId=0&budgetType=" + budgetType + "&NFAID=0";

    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
        // $("#tblApproversPrev").empty();
        if (res.result != null) {
            debugger;
            if (res.result.length > 0) {
                $("#errorApproverdivSeq").hide();
                //  $("#tblApproversPrev").append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:5%!important'>Sequence</th></tr></thead>");
                //$.each(res.result, function (key, value) {
                //  $("#tblApproversPrev").append('<tr id=trNfaApprover' + value.idx + '><td>' + value.approverName + '</td><td>' + value.emailId + "<td>" + value.seq + "</td>" + '</td><td class=hide>' + value.idx + '</td></tr>');

                //});
                ApproverCtr = 1;
                frmApprovalPPCForm(res.result[0].nfaAppGroupID);
            }
            else {
                ApproverCtr = 0;
                bootbox.alert("No Approver(s) find for selected Apprval matrix(BudgetType: " + $("#ddlBudget option:selected").text() + ", Amount: " + $("#txtAmountFrom").val() + ", Org: " + $("#ddlPurchaseOrg option:selected").text() + ", Group: " + $("#ddlPurchasegroup option:selected").text())

            }
        }
    });
    GetData.error(function (res) {
        ApproverCtr = 0;
        jQuery.unblockUI();
    });

}



function frmApprovalPPCForm(nfagroupid) {

    var validVendor = "T";
    var AzurevendorDetails = [];
    $("#tblvendorlist >tbody> tr").each(function (index) {
        var this_row = $(this);
        index = (this_row.closest('tr').attr('id')).substring(3, (this_row.closest('tr').attr('id')).length)

        if ($("#vendoridrow" + index).text() == "0" || $("#vendoridrow" + index).text() == "") {

            $('#vendorSearch' + index).removeClass('has-success')
            $('#vendorSearch' + index).css("border", "1px solid red")
            $('#spandanger').text('Please Select Vendor Properly.');
            $('.alert-danger').show();
            Metronic.scrollTo(error, -600);
            $('.alert-danger').fadeOut(5000);
            validVendor = "F";
            return false;

        }
        else {

            var details = {
                "VendorID": parseInt($("#vendoridrow" + index).text()),
                "QuotationReceived": $("input[name=OpQuotation" + index + "]:checked").val(),
                "TexhnicallyAcceptable": $("input[name=OpTechAccep" + index + "]:checked").val(),
                "PoliticallyExposed": $("input[name=politicalyexp" + index + "]:checked").val(),
                "QuotedValidatedSCM": $("input[name=QuotedSCM" + index + "]:checked").val(),
                "TPI": $("input[name=TPI" + index + "]:checked").val()

            };
            AzurevendorDetails.push(details)
        }

    });

    if (validVendor == "T") {

        var EnquiryIssuedthrogh = $("input[name='optionenquiryissued']:checked").val();
        var LowestPriceOffer = $("input[name='LowestPriceOffer']:checked").val();
        var repeatorder = $("input[name='repeatorder']:checked").val();
        var Enquiryissuedon = new Date();
        if ($('#txtenquiryissuedon').val() != null && $('#txtenquiryissuedon').val() != "") {
            Enquiryissuedon = new Date($('#txtenquiryissuedon').val().replace('-', ''));

        }

        var p_amount = removeThousandSeperator($("#txtAmountFrom").val());
        var _budget = 0;
        if ($("#txtBudget").val() != '') {
            _budget = $("#txtBudget").val();
        }
        var p_Budget = removeThousandSeperator(_budget);
        var p_category = $("#ddlCategory option:selected").val();
        var p_currency = $("#dropCurrency option:selected").val();
        var budgetStatus = $("#ddlBudget option:selected").val();

        var Data = {
            "PPCID": PPCID,
            "RFQID": 0,
            "BidID": 0,
            "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
            "EnquirySubject": jQuery('#txtsubject').val(),
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
            "EnquiryIssuedOn": Enquiryissuedon,
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
            "BiddingVendorDetails": AzurevendorDetails,
            "PurchaseOrg": parseInt($('#ddlPurchaseOrg option:selected').val()),
            "PurchaseGroup": parseInt($('#ddlPurchasegroup option:selected').val()),
            "conditionID": 0,
            "BudgetStatus": budgetStatus,
            "NfaAmount": parseFloat(p_amount),
            "NfaBudget": parseFloat(p_Budget),
            "NfaCurrency": p_currency,
            "NFAAppGroupID": nfagroupid
        };

        console.log(JSON.stringify(Data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "Azure/insPPCnew/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                if (parseInt(data) > 1 && parseInt(data) != 2) {
                    $('#spansuccess1').html("PPC Form Saved Successfully...");

                    bootbox.dialog({
                        message: "PPC Form submitted Successfully..",
                        buttons: {
                            confirm: {
                                label: "Yes",
                                className: "btn-success",
                                callback: function () {
                                    window.location = "index.html";
                                    //if ($('#hdnPPCID').val() == "0") {

                                    //    var encrypdataAZ = fnencrypt("RFQID=" + RFQID + "&RFQSubject=" + "")
                                    //    var encrypdataAp = fnencrypt("RFQID=" + RFQID + '&AppType=E')
                                    //    setTimeout(function () {
                                    //        window.location = "ApprovalPPCForm.html?param=" + encrypdataAZ;
                                    //    }, 1000)
                                    //}
                                    //else {
                                    //    window.location = "eRFQAzPPCApproval.html?param=" + encrypdataAp
                                    //}
                                }
                            }

                        }
                    });

                }



                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {
                window.scrollTo(0, 0);
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
var orgData = [];
function BindPurchaseOrg() {


    var url = "NFA/GetPurchaseOrgByUserid?CustomerId=" + parseInt(CurrentCustomer) + "&UserId=" + encodeURIComponent(UserID);
    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {

        $("#ddlModelOrg,#ddlPurchaseOrg").empty();
        $('#ddlModelOrg').append('<option value="0">Select</option>');
        if (res.result.length > 0) {

            $.each(res.result, function (key, value) {
                $('#ddlModelOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');
                $('#ddlPurchaseOrg').append('<option value=' + value.purchaseOrgID + '>' + value.purchaseOrgName + '</option>');

            });
            setTimeout(function () {
                bindPurchaseGroupDDL();
            }, 500);
        }

    });
    GetNFAPARAM.error(function (error) {
        console.log(error);

    });


};
function bindPurchaseGroupDDL() {
    var url = "NFA/GetPurchaseGroupByUserID?CustomerId=" + parseInt(CurrentCustomer) + "&OrgId=" + parseInt($('#ddlPurchaseOrg option:selected').val()) + "&UserID=" + encodeURIComponent(UserID);

    var GetNFAPARAM = callajaxReturnSuccess(url, "Get", {});
    GetNFAPARAM.success(function (res) {

        if (res.result.length > 0) {

            $("#ddlPurchasegroup").empty();
            if (res.result.length > 0) {
                $.each(res.result, function (key, value) {
                    $('#ddlPurchasegroup').append('<option value=' + value.idx + '>' + value.groupName + '</option>');
                });
            }

        }
    });
    GetNFAPARAM.error(function (error) {
        console.log(error);
    });

};
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
                        fnUploadFilesonAzure('file1', attchname, 'eRFQ/' + RFQID + '/PPC');

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
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=" + RFQID + "&BidID=0",
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
                    var str = '<tr><td><a id=eRFqTerm' + i + ' style="pointer:cursur;text-decoration:none;" onclick="DownloadFilePPC(this)"  href="javascript:;" >' + data[0].attachments[i].attachment + "</a></td>";
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
        "SrNo": parseInt(POID),
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
function FetchCurrency(CurrencyID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchCurrency/?CurrencyID=" + CurrencyID + "&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#dropCurrency").empty();
            jQuery("#dropCurrency").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#dropCurrency").append(jQuery("<option></option>").val(data[i].currencyId).html(data[i].currencyNm));

            }

            $("#dropCurrency").val(DefaultCurrency);
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();

        }

    });

}