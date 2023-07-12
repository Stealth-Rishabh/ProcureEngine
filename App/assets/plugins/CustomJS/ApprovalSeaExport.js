jQuery(document).ready(function () {
    
    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);

    jQuery('#btnExportToExcel,#btnExportToExcel1').click(function () {

        if (getUrlVarsURL(decryptedstring)["App"] == 'N') {
            tableToExcel(['tbldetails', 'tblBidSummary', 'tblremarksawared'], ['BidDetails', 'Bid Summary', 'Approval History'], 'BidSummary')
        }
        else if (getUrlVarsURL(decryptedstring)["App"] == 'Y' && getUrlVarsURL(decryptedstring)["FwdTo"] == "Approver") {
            tableToExcel(['tbldetails', 'tblBidSummary', 'tblremarksapprover'], ['BidDetails', 'Bid Summary', 'Approval History'], 'BidSummary')
        }
        else if (getUrlVarsURL(decryptedstring)["App"] == 'Y' && getUrlVarsURL(decryptedstring)["FwdTo"] == "Admin") {
            tableToExcel(['tbldetails', 'tblBidSummary', 'tblremarksawared'], ['BidDetails', 'Bid Summary', 'Approval History'], 'BidSummary')
        }
    });
    Pageloaded()
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        bootbox.alert("<br />Oops! Your session has been expired. Please re-login to continue.", function () {
            window.location = sessionStorage.getItem('MainUrl');
            return false;
        });
    }
    else {
        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    Metronic.init();
    Layout.init();
    QuickSidebar.init();
    App.init();
    setCommonData();
    FormValidation.init();
});
var BidID = "";
var ButtonType = '';
var isPPCSubmit = 'N';
jQuery(document).ready(function () {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    
    BidID = getUrlVarsURL(decryptedstring)["BidID"]
    $('#drpVendors').val('');
    //$('#drpVendors').select2({
    //    placeholder: "Select vendors only if you want to send them auto PO confirmation.",
    //    allowClear: true
    //});
    FetchVendors(BidID, 'Yes');
    FetchVendors(BidID, 'No');
    Fillhelp(getUrlVarsURL(decryptedstring)["App"]);
   
});
$('#txtRemarks,#txtbidspecification,#txtRemarksAward,#txtRemarksApp').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
function FetchVendors(BidID,Type) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/fetchVendor/?BidID=" + BidID + "&VendorType=" + Type,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            debugger
            if (Type == 'Yes') {
                $('#tblvendors > tbody').empty();
                $('#tblvendors > thead').empty();
                jQuery("#ddlVendors,#ddlVendorsAdmin,#drpVendors").empty();
                jQuery("#ddlVendors,#ddlVendorsAdmin").append(jQuery("<option ></option>").val("").html("Select"));
                jQuery("#drpVendors").append(jQuery("<option ></option>").val("").html("Only for auto PO confirmation"));
                
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlVendors,#ddlVendorsAdmin,#drpVendors").append(jQuery("<option></option>").val(data[i].vendorID).html(data[i].vendorName));
                }
                $('#tblvendors').append("</tbody>");
            }
            else {
                
                $('#tblPPcvendors').empty();
                $('#tblPPcvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th style='width:20%!important;'>TPI</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {
                    
                    $('#tblPPcvendors').append("<tr><td class=hide>" + data[i].vendorID + "</td><td>" + data[i].vendorName + "</td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td><td id=TDpolyticExp" + i + "></td><td id=TDvalidatescm" + i + "></td><td id=TPI" + i + "></td></tr>")
                    $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="Y" checked /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="N"  />No</label></div>')
                    $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y"  checked/> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  />No</label></div>')
                    $('#TDpolyticExp' + i).append('<div> <label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="Y" id=politicalyexpY' + i + '  /> Yes</label><label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="N"  id=politicalyexpN' + i + ' checked />No</label></div>')
                    $('#TDvalidatescm' + i).append('<div> <label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="Y" id=QuotedSCMY' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="N"  id=QuotedSCMN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="NA"  id=QuotedSCMNA' + i + ' />NA</label></div>')
                    $('#TPI' + i).append('<div> <label class="radio-inline"><input type="radio" name=TPI' + i + ' value="Y" id=TPIY' + i + ' checked /> Yes</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="N"  id=TPIN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="NA"  id=TPINA' + i + ' />NA</label></div>')

                }
               $('#tblPPcvendors').append("<tr><td colspan=5></td><td><span class='help-block'><b>Note*</b><br>Y - IF TPI ALREADY DONE</br> N - TPI WILL BE DONE WHILE PLACING THE ORDER WITH FINAL VENDOR</br>Not Applicable - TPI not required</span></td></tr>")
               $('#tblPPcvendors').append("</tbody>");
            }
            // $("#drpVendors").select2("val",selectedValues);
            FetchRecomendedVendor(BidID)
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
var rowitems=0
function addmorevendorRemarks() {
    var str = '';
    
    var form1 = $('#formAwardedsubmit')
    $('#drpVendors').rules('add', {
        required: true,
    });
    $('#txtRemarksAward').rules('add', {
        required: true,
    });
    if (form1.valid() == true) {
        
        $('#divtableaward').show()
        rowitems = rowitems + 1;
        if (!jQuery("#tblremarksvendorsawared thead").length) {
            jQuery('#tblremarksvendorsawared').append("<thead><tr><th class='bold'>Vendor</th><th class='bold'>Remarks</th><th></th></tr></thead>");
            str = '<tr id=tr' + rowitems + '><td id=vid' + rowitems + ' class=hide>' + $("#drpVendors").val() + '</td><td style="width:20%!important">' + jQuery("#drpVendors option:selected").text() + '</td>';
        }
        else {
            str = '<tr id=tr' + rowitems + '><td id=vid' + rowitems + ' class=hide>' + $("#drpVendors").val() + '</td><td style="width:20%!important">' + jQuery("#drpVendors option:selected").text() + '</td>';
        }
        str += '<td style="width:60%!important">' + jQuery("#txtRemarksAward").val() + '</td><td style="width:5%!important"><button type=button class="btn btn-xs btn-danger"  onclick="deleteitem(tr' + rowitems + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td></tr>';
        jQuery('#tblremarksvendorsawared').append(str);

        var arr = $("#tblremarksvendorsawared tr");

        $.each(arr, function (i, item) {
            var currIndex = $("#tblremarksvendorsawared tr").eq(i);
            var matchText = currIndex.find("td:eq(0)").text();

            $(this).nextAll().each(function (i, inItem) {
                if (matchText == $(this).find("td:eq(0)").text()) {
                    $(this).remove();
                    $('#diverrordiv2').show()
                    $('#errordiv2').text('Supplier is already selected')
                    $('#diverrordiv2').fadeOut(5000)
                }

            });
        });
        jQuery("#drpVendors").val('')
        jQuery('#txtRemarksAward').val('')


    }
    else {
       
        form1.validate()
        return false;
    }
}
function deleteitem(rowid) {

    rowitems = rowitems - 1;
    $('#' + rowid.id).remove();
   
    if ($('#tblremarksvendorsawared tr').length ==1) {
        $('#divtableaward').hide()
    }
    else {
        $('#divtableaward').show()
    }
}
var successPPC = $('#successPPC');
var errorPPC = $('#diverroeppc');
var FormValidation = function () {
  
    var validateformProductServices = function () {
        var form1 = $('#formsubmitadmin');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                ddlVendorsAdmin: {
                    required: true,
                },
                txtbidspecification: {
                    required: true,
                }
            },
            messages: {
                ddlVendorsAdmin: {
                    required: "Please select vendor"
                },
                txtbidspecification: {
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
                if (AppStatus == 'Reverted') {
                    if (ButtonType == 'Cancel') {
                        $('#modalcancelremarks').modal('show');
                       // cancelBtnclick();
                    }
                    else {
                        ApprovalAdmin();
                    }
                }
                else {
                    ForwardBid(BidID, BidTypeID, BidForID)
                }
            }
        });
    }
    var validateAppsubmitData = function () {
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
                
                ApprovalApp();
               
            }
        });
    }
    var validateformAwardedsubmit = function () {
        
    
        var form1 = $('#formAwardedsubmit');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                txtRemarksAward: {
                    required: false //abheedev_bug342
                },
                drpVendors: {
                    required: false
                }
            },
            messages: {
                txtRemarksAward: {
                   // required: "Please enter your comment" //abheedev_bug342
                },
                drpVendors: {
                    required: "Please enter your Vendor"
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();
                error1.hide();
                $('#diverrordiv2').hide();
                // App.scrollTo(error1, -300);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.Input-group,.xyz').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.Input-group,.xyz').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                    .closest('.Input-group,.xyz').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
                //if ($("#tblremarksvendorsawared tr").length > 0) {
                //    jQuery('input[name="drpVendors"]').rules('add', {
                //        required: false,
                //    });
                //    jQuery('input[name="txtRemarksAward"]').rules('add', {
                //        required: false,
                //    });
                //   // AwardBid(BidID)
                //}
                //else {

                //}
              
               
            }
        });
    }
    var validateformCancelBid = function () {
        var form1 = $('#frmRemarksCancel');
        var error1 = $('.alert-danger', form1);
        var success1 = $('.alert-success', form1);
        form1.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",

            rules: {
                txtRemarks: {
                    required: true,
                    maxlength: 2000
                }
            },
            messages: {
                txtRemarks: {
                    required: "Please enter Cancel Reason."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                // success1.hide();
                // error1.show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                        .closest('.col-md-10').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                        .closest('.col-md-10').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                        .closest('.col-md-10').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
                cancelBtnclick();

            }
        });
    }
    var validateformPPCForm = function() {
        var form = $('#frmPPcForm');
       
        form.validate({
            doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
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
    var validateformPPCAPPForm = function () {
        var formApprover = $('#frmMapApprover');
        formApprover.validate({

            doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {

            },
            invalidHandler: function (event, validator) {
            },

            highlight: function (element) {
                $(element).closest('.col-md-6').addClass('has-error');

            },

            unhighlight: function (element) {
                $(element).closest('.col-md-6').removeClass('has-error');

            },
            errorPlacement: function (error, element) {

            },
            success: function (label) {
            },
            submitHandler: function (form) {
                MapApprover();
            }

        });
    }
    var validateformAddApprover = function () {
        var formApprover = $('#frmApprover');
        formApprover.validate({

            doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
               
            },
            
            invalidHandler: function (event, validator) {
            },

            highlight: function (element) {
                $(element).closest('.col-md-7').addClass('has-error');

            },

            unhighlight: function (element) {
                $(element).closest('.col-md-7').removeClass('has-error');

            },
            errorPlacement: function (error, element) {

            },
            success: function (label) {
            },
            submitHandler: function (form) {
                if (sessionStorage.getItem('hdnBidApproverID') != "0" && jQuery("#txtApproverBid").val() != "") {

                    $('.alert-danger').show();
                    $('#spandangerapp').html('Approver not selected. Please press + Button after selecting Approver');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                    return false;
                }
                else if ($('#tblBidapprovers >tbody >tr').length == 0) {
                    $('.alert-danger').show();
                    $('#spandangerapp').html('Please Map Approver.');
                    $('.alert-danger').fadeOut(5000);
                    return false;

                }
                else {
                    MapBidapprover();
                }
                
            }

        });
    }
    var handleWysihtml5 = function () {
        if (!jQuery().wysihtml5) {
            return;
        }
        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5({
                "stylesheets": ["assets/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
            });
        }
    }
    return {
        init: function () {
            handleWysihtml5();
          
            validateformProductServices();
            validateAppsubmitData();
            validateformAwardedsubmit();
            validateformCancelBid();
            validateformPPCForm();
            validateformPPCAPPForm();
            validateformAddApprover();
        }
    };
}();

jQuery("#btnCancelbidAdmin").click(function () {
    ButtonType = 'Cancel'
    $('#modalcancelremarks').modal('show');
  });

jQuery("#btnCancelbidApp").click(function () {
    ButtonType = 'Cancel'
    $('#modalcancelremarks').modal('show');
   
});

jQuery("#btnCancelbidAward").click(function () {
    ButtonType = 'Cancel'
    $('#modalcancelremarks').modal('show');
  });

jQuery("#btnSubmitApp").click(function () {
    ButtonType = ''
});

jQuery("#btnSubmitAdmin").click(function () {
    ButtonType = ''
});

jQuery("#btnSubmitAward").click(function () {
    ButtonType = ''
});

function Fillhelp(App1) {
    if (App1 == 'N') {
        $('#Approver').show();
     }
    else {
        $('#Awarded').show();
    }
}
function frmAzurePPCForm() {

    var i = 0;
    var AzurevendorDetails = [];
   
    $("#tblPPcvendors> tbody > tr").not(':last').each(function (index) {
        // BiddingVendorQuery = BiddingVendorQuery + $(this).find("td").eq(0).html() + '~' + $("input[name=OpQuotation" + index + "]:checked").val() + '~' + $("input[name=OpTechAccep" + index + "]:checked").val() + '#';
        var details = {
            "VendorID": parseInt($(this).find("td").eq(0).html()),
            "QuotationReceived": $("input[name=OpQuotation" + index + "]:checked").val(),
            "TexhnicallyAcceptable": $("input[name=OpTechAccep" + index + "]:checked").val(),
            "PoliticallyExposed": $("input[name=politicalyexp" + index + "]:checked").val(),
            "QuotedValidatedSCM": $("input[name=QuotedSCM" + index + "]:checked").val(),
            "TPI": $("input[name=TPI" + index + "]:checked").val()
        };
        AzurevendorDetails.push(details)
    });

    var EnquiryIssuedthrogh = $("input[name='optionenquiryissued']:checked").val();
    var LowestPriceOffer = $("input[name='LowestPriceOffer']:checked").val();
    var repeatorder = $("input[name='repeatorder']:checked").val();
    var Data = {
        "PPCID": parseInt($('#hdnPPCID').val()),
        "RFQID": 0,
        "BidID": parseInt(BidID),
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
        "EnquiryIssuedOn": jQuery('#RFQConfigueron').val(),
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
        "BiddingVendorDetails": AzurevendorDetails//BiddingVendorQuery,
        
    };
    //alert(JSON.stringify(AzurevendorDetails))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "Azure/insPPC/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            if (data == '1') {
                $('#spansuccess1').html("PPC Form Saved Successfully...");
                successPPC.show();
                successPPC.fadeOut(5000);
                App.scrollTo(successPPC, -200);
                bootbox.dialog({
                    message: "PPC Form submitted Successfully..",
                    buttons: {
                        confirm: {
                            label: "Yes",
                            className: "btn-success",
                            callback: function () {
                                $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                                $('#PPCForm').modal('hide')
                            }
                        }

                    }
                });
            }
            else if (data == '2') {
                $('#spansuccess1').html("Data Updated Successfull...");
                successPPC.show();
                successPPC.fadeOut(5000);
                App.scrollTo(successPPC, -200);
                bootbox.dialog({
                    message: "PPC Form Updated Successfully..",
                    buttons: {
                        confirm: {
                            label: "Yes",
                            className: "btn-success",
                            callback: function () {
                                $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                                $('#PPCForm').modal('hide')
                            }
                        }

                    }
                });

            }
            else {
                jQuery("#spandanger").text("Data Already Exists...");
                errorPPC.show();
                errorPPC.fadeOut(5000)
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
function fnclosepopupPPC() {
    $('#PPCForm').modal('hide')
}
function fetchAzPPcFormDetails() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

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
                isPPCSubmit = 'Y';
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

                $('#tblPPcvendors').empty();
                if (data[0].biddingVendor.length > 0) {
                    $('#tblPPcvendors').append("<thead><tr><th>Enquiry issued To</th><th style='width:10%!important;'>Quotation Received</th><th style='width:20%!important;'>Technically Acceptable</th><th style='width:20%!important;'>Politically Exposed Person</th><th style='width:20%!important;'>Quote Validated By SCM</th><th>TPI</th></tr></thead>");
                    for (i = 0; i < data[0].biddingVendor.length; i++) {
                        $('#tblPPcvendors').append("<tr><td class=hide>" + data[0].biddingVendor[i].vendorID + "</td><td>" + data[0].biddingVendor[i].vendorName + "</td><td id=TDquotation" + i + " class='radio-list'></td><td id=TDTechAccep" + i + "></td><td id=TDpolyticExp" + i + "></td><td id=TDvalidatescm" + i + "></td><td id=TPI" + i + "></td></tr>")
                        $('#TDquotation' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="Y"  id=OpQuotationY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=OpQuotation' + i + ' value="N" id=OpQuotationN' + i + ' />No</label></div>')
                        $('#TDTechAccep' + i).append('<div> <label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="Y" id=OpTechAccepY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=OpTechAccep' + i + ' value="N"  id=OpTechAccepN' + i + ' />No</label></div>')
                        $('#TDpolyticExp' + i).append('<div> <label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="Y" id=politicalyexpY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=politicalyexp' + i + ' value="N"  id=politicalyexpN' + i + ' />No</label></div>')
                        $('#TDvalidatescm' + i).append('<div> <label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="Y" id=QuotedSCMY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="N"  id=QuotedSCMN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=QuotedSCM' + i + ' value="NA"  id=QuotedSCMNA' + i + ' />NA</label></div>')
                        $('#TPI' + i).append('<div> <label class="radio-inline"><input type="radio" name=TPI' + i + ' value="Y" id=TPIY' + i + ' /> Yes</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="N"  id=TPIN' + i + ' />No</label><label class="radio-inline"><input type="radio" name=TPI' + i + ' value="NA"  id=TPINA' + i + ' />NA</label></div>')

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
                     $('#tblPPcvendors').append("<tr><td colspan=5></td><td><span class='help-block'><b>Note*</b><br>Y - IF TPI ALREADY DONE</br> N - TPI WILL BE DONE WHILE PLACING THE ORDER WITH FINAL VENDOR</br>Not Applicable - TPI not required</span></td></tr>")

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
function DownloadFilePPC(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + BidID + '/PPC');
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
            "RFQID": 0,
            "Attachment": attchname,
            "UserID": sessionStorage.getItem('UserID'),
            "BidID": parseInt(BidID)

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
                        fnUploadFilesonAzure('file1', attchname, 'Bid/' + BidID + '/PPC');
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
        url: sessionStorage.getItem("APIPath") + "Azure/eRFQAzureDetails/?RFQID=0&BidID=" + BidID,
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
            
            if (data == "1") {
                fetchAttachments();
                $('.alert-success').show();
                $('#spansuccess1').html('Record deleted successfully!');

                Metronic.scrollTo($(".alert-success"), -200);
                $('.alert-success').fadeOut(7000);

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
    })
}
var rowApp = 0;
function addApprovers() {
    var status = "true"; var Apptype = ''
    $("#tblapprovers tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(0)').html()) == $('#hdnApproverID').val()) {
            status = "false"
        }
    });
    if ($('#hdnApproverID').val() == "0" || jQuery("#txtApprover").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Select Approver Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApprover").val('')
        jQuery("#hdnApproverID").val('0')
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('PPC Approver is already mapped for this Bid.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApprover").val('')
        jQuery("#hdnApproverID").val('0')
        return false;
    }
    else {
        rowApp = rowApp + 1;
        if ($('#drp_isAppObs').val() == "A") {

            Apptype = 'Approver';
        }
        else {
            Apptype = 'Observer';
        }

        if (!jQuery("#tblapprovers thead").length) {
            jQuery("#tblapprovers").append("<thead><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:30%!important'>Role</th></thead>");
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td class=hide>' + $('#hdnApproverID').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApprover").val() + '</td><td>' + $('#hdnAppEmailIDID').val() + '</td><td>' + Apptype + '</td><td class=hide>' + $('#drp_isAppObs').val() + '</td></tr>');
        }
        else {
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td class=hide>' + $('#hdnApproverID').val() + '</td><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + jQuery("#txtApprover").val() + '</td><td>' + $('#hdnAppEmailIDID').val() + '</td><td>' + Apptype + '</td><td class=hide>' + $('#drp_isAppObs').val() + '</td></tr>');
        }

        if (jQuery('#tblapprovers tr').length == 1) {
            jQuery('#btnPPCSubmit').attr("disabled", "disabled");
        }
        else {
            jQuery('#btnPPCSubmit').removeAttr("disabled");
        }
        jQuery("#txtApprover").val('')
        jQuery("#drp_isAppObs").val('A')
        jQuery("#hdnApproverID").val('0')

    }
}
function deleteApprow(approwid) {
    rowApp = rowApp - 1;
    $('#' + approwid.id).remove()

    if (jQuery('#tblapprovers tr').length == 1) {
        jQuery('#btnPPCSubmit').attr("disabled", "disabled");
    }
    else {
        jQuery('#btnPPCSubmit').removeAttr("disabled");
    }
}
function MapApprover() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvers = '';
    var rowCount = jQuery('#tblapprovers tr').length;
    if (rowCount > 1) {
        $("#tblapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim(this_row.find('td:eq(5)').html()) + '#';
        })
    }
    var Approvers = {
        "ApproverType": "P",
        "BidID": parseInt(BidID),
        "CreatedBy": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "Type": "SendActivityToPPC",
        "PPCApprovers": approvers,
        "Action": "",
        "Remarks": ""
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Azure/ins_BidPPCApproval",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {
            
            $('#msgSuccessApp').show();
            $('#msgSuccessApp').html('Activity Forward to PPC Approvers successfully!');
            Metronic.scrollTo($('#msgSuccessApp'), -200);
            $('#msgSuccessApp').fadeOut(7000);
            bootbox.dialog({
                message: "Activity Forward to PPC Approvers successfully!",
                buttons: {
                    confirm: {
                        label: "Yes",
                        className: "btn-success",
                        callback: function () {
                            $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                            window.location = "index.html";

                        }
                    }

                }
            });
            return false;

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }


    });
}

 function fnOpenPopupApprovers() {
    fetchRegisterUser('PPC');
    fnGetApprovers();
}
$("#MapppcApprover").on("hidden.bs.modal", function () {
    jQuery("#txtApprover").val('')
    $('#hdnApproverID').val('0')

});
function fnGetApprovers() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidApprover/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + BidID+"&Type=bid",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidApprover/?BidID=" + BidID + "&Type=bid",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var str = "";
           
            jQuery("#tblapprovers").empty();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    if (data[i].isApprover == "P") {
                        rowApp = rowApp + 1;
                        if (rowApp == 1) {
                            jQuery('#tblapprovers').append("<thead><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Role</th></thead><tbody>");
                        }
                        str = "<tr id=trAppid" + rowApp + "><td class=hide>" + data[i].userID + "</td>";
                        str += '<td><button type="button" class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(trAppid' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                        str += "<td>" + data[i].approverName + "</td>";
                        str += "<td>" + data[i].emailID + "</td>";
                        if (data[i].isViewRights == "A") {
                            str += "<td>Approver</td>";
                        }
                        else {
                            str += "<td>Observer</td>";
                        }
                        str += "<td class=hide>" + data[i].isViewRights + "</td></tr>";
                        jQuery('#tblapprovers').append(str);
                    }

                }
                jQuery('#tblapprovers').append("</tbody>")

                if (jQuery('#tblapprovers tr').length <= 1) {
                    jQuery('#btnPPCSubmit').attr("disabled", "disabled");
                }
                else {
                    jQuery('#btnPPCSubmit').removeAttr("disabled");
                }
            }
            else {

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }

    })
}

