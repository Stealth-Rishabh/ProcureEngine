var _BidID;
var _BidTypeID;
if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param);

    _BidID = getUrlVarsURL(decryptedstring)["BidID"];
    _BidTypeID = getUrlVarsURL(decryptedstring)["BidTypeID"];

    var FwdBy = getUrlVarsURL(decryptedstring)["FwdBy"]
    var AppStatus = getUrlVarsURL(decryptedstring)["AppStatus"]
    sessionStorage.setItem('CurrentBidID', _BidID)
    if (FwdBy == 'config') {
        jQuery("#frmdivapprove").hide();
    }
    else {
        //$('#divlastcomment').removeClass('hide')
        jQuery("#frmdivapprove").show();
    }
    if (_BidTypeID == "7") {
        fetchSeaExportDetails(_BidID);
    }
    else if (_BidTypeID == "6") {
        fetchScrapSalesBidDetails(_BidID)
    }
    FetchRecomendedVendor(_BidID);
    setTimeout(function () {
        if (isLastPreApprover == "Y") {
            $('#txtbidDate').rules('add', {
                required: true,
            });
            //$('#txtbidTime').rules('add', {
            //    required: true,
            //});
        }
        else {
            $('#txtbidDate').rules('add', {
                required: false,
            });
            //$('#txtbidTime').rules('add', {
            //    required: false,
            //});
        }
    }, 1000)

}
jQuery("#btnbackApp").click(function () {
    parent.history.back();
});
$('.maxlength').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
var isLastPreApprover = 'N';
function fetchSeaExportDetails(bidid) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchSeaExportConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + bidid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var bidclosingtype = "A";
            $("#txtbidDate").val(fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))
            //$("#txtbidTime").val(fnConverToLocalTime(BidData[0].bidDetails[0].bidTime))
            jQuery('#mapedapproverPrev').html('');
            jQuery('#txtBidSubjectPrev').html(BidData[0].bidDetails[0].bidSubject)
            jQuery('#txtBidDurationPrev').html(BidData[0].bidDetails[0].bidDuration + ' mins')
            jQuery('#txtbiddescriptionPrev').html(BidData[0].bidDetails[0].bidDetails)
            jQuery('#txtbidDatePrev').html(fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))
            //jQuery('#txtbidTimePrev').html(BidData[0].bidDetails[0].bidTime)
            jQuery("#dropCurrencyPrev").html(BidData[0].bidDetails[0].currencyID)
            jQuery('#txtConversionRatePrev').html(BidData[0].bidDetails[0].conversionRate)
            bidclosingtype = BidData[0].bidDetails[0].bidClosingType.trim()
            if (bidclosingtype == "A") {
                jQuery('#ddlbidclosetypePrev').html("All in one go");
            }
            else {
                jQuery('#ddlbidclosetypePrev').html("Stagger");
            }
            isLastPreApprover = BidData[0].bidDetails[0].isLastPreApprover;

            if (isLastPreApprover == "Y") {
                $('#divTimeChange').removeClass('hide')
            }
            else {
                $('#divTimeChange').addClass('hide')
            }

            $('#filepthtermsPrev').html(BidData[0].bidDetails[0].termsConditions);
            $('#filepthattachPrev').html(BidData[0].bidDetails[0].attachment);
            jQuery("#tblapproversPrev").empty();
            $('#wrap_scrollerPrevApp').show();

            jQuery('#tblapproversPrev').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");

            for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {
                //** Pre Approver
                strp = '<tr id=trAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                strp += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td></tr>";
                jQuery('#tblapproversPrev').append(strp);


            }

            totalitemdurationstagger = 0;

            jQuery("#tblServicesProductPrev").empty();
            if (BidData[0].bidSeaExportDetails.length > 0) {
                BidItemslength = BidData[0].bidSeaExportDetails.length
                $('#wrap_scrollerPrev').show();
                if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {


                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last InvoicePrice</th><th class='itemclass'>Bid Duration (in minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidSeaExportDetails.length; i++) {

                        var decrementon = ''
                        if (BidData[0].bidSeaExportDetails[i].decreamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = '%age'


                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td style="width:20%!important;" id=itemcodeprev' + i + '>' + BidData[0].bidSeaExportDetails[i].itemCode + '</td><td id=destinationportprev' + i + '>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td  class=hide>' + BidData[0].bidSeaExportDetails[i].description + '</td><td id=remarksprev' + i + '>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right id=TPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].targetprice) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + '</td><td id=uomprev' + i + '>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td id=maskvendorprev' + i + '>' + BidData[0].bidSeaExportDetails[i].maskVendor + '</td><td class=text-right id=mindecprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].minimumDecreament) + '</td><td id=deconprev' + i + '>' + decrementon + '</td><td class=hide id=deconvalprev' + i + '>' + BidData[0].bidSeaExportDetails[i].decreamentOn + '</td><td class="text-right hide" id=LIPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + '</td><td class="itemclass text-right" id=itemduraprev' + i + '>' + BidData[0].bidSeaExportDetails[i].itemBidDuration + '</td><td id=maskL1prev' + i + '>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td id=showstartprev' + i + '>' + BidData[0].bidSeaExportDetails[i].showStartPrice + '</td><td class=text-right id=unitrateprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td id=ponoprev' + i + '>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td id=povendornameprev' + i + ' >' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td  id=podateprev' + i + '>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td><td class=hide id=pullrfqidprev' + i + '>' + BidData[0].bidSeaExportDetails[i].pullRFQID + '</td><td class=hide id=rfqparameteridprev' + i + '>' + BidData[0].bidSeaExportDetails[i].rfqParameterID + '</td></tr>');
                        totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(BidData[0].bidSeaExportDetails[i].itemBidDuration)

                    }
                    sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger)
                    if ($('#ddlbidclosetype option:selected').val() == "S") {
                        $('.itemclass').removeClass('hide')
                    }
                    else {
                        $('.itemclass').addClass('hide')
                        $('.itemclass').val(0)
                    }
                }
                else {

                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th>Remarks</th><th>Target Price</th><th>Hide Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Floor/ Min. Price</th><th>Price Decrement Amount</th><th> Price Decrement Frequency</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidSeaExportDetails.length; i++) {

                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td style="width:20%!important;" id=itemcodeprev' + i + '>' + BidData[0].bidSeaExportDetails[i].itemCode + '</td><td id=destinationportprev' + i + '>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td id=remarksprev' + i + '>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right id=TPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].targetprice) + '</td><td id=maskvendor' + i + ' >' + BidData[0].bidSeaExportDetails[i].maskVendor + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + '</td><td id=uomprev' + i + '>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td id=floorpriceprev' + i + ' class=text-right >' + thousands_separators(BidData[0].bidSeaExportDetails[i].startingPrice) + '</td><td class=text-right id=pricedecreamentprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].priceDecreamentAmount) + '</td><td class="text-right" id=pricedecreamentfeqprev' + i + '>' + BidData[0].bidSeaExportDetails[i].priceDecreamentFrequency + '</td><td class=text-right id=unitrateprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td id=ponoprev' + i + '>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td id=povendornameprev' + i + ' >' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td  id=podateprev' + i + '>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td></tr>');
                    }
                }

                if (BidData[0].bidVendorDetails.length > 0) {
                    jQuery('#selectedvendorlistsPrev').empty();
                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {

                        if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {
                            $('.THLoading').show()
                        }
                        else {
                            $('.THLoading').hide()
                        }
                        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td id=tblcolweightagePrev' + BidData[0].bidVendorDetails[i].vendorID + ' class=hide>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                    }

                }

            }
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
        }
    });


}
function fetchScrapSalesBidDetails(bidid) {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + bidid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            $("#txtbidDate").val(fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))
            //$("#txtbidTime").val(BidData[0].bidDetails[0].bidTime)
            jQuery('#mapedapproverPrev').html('');
            jQuery('#txtBidSubjectPrev').html(BidData[0].bidDetails[0].bidSubject)
            jQuery('#txtBidDurationPrev').html(BidData[0].bidDetails[0].bidDuration + ' mins')
            jQuery('#txtbiddescriptionPrev').html(BidData[0].bidDetails[0].bidDetails)
            jQuery('#txtbidDatePrev').html(fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))
            //jQuery('#txtbidTimePrev').html(BidData[0].bidDetails[0].bidTime)
            jQuery("#dropCurrencyPrev").html(BidData[0].bidDetails[0].currencyID)
            jQuery('#txtConversionRatePrev').html(BidData[0].bidDetails[0].conversionRate)
            if (BidData[0].bidDetails[0].bidForID == '81') {
                $('#ddlbidclosetypePrev').html('English')
            }
            else if (BidData[0].bidDetails[0].bidForID == '83') {
                $('#ddlbidclosetypePrev').html('japanese')
            }
            else {
                $('#ddlbidclosetypePrev').html('Dutch')
            }
            // _bidType = BidData[0].bidDetails[0].bidForID;
            $('#filepthterms').html(BidData[0].bidDetails[0].termsConditions);
            $('#filepthattach').html(BidData[0].bidDetails[0].attachment);
            isLastPreApprover = BidData[0].bidDetails[0].isLastPreApprover;
            if (isLastPreApprover == "Y") {
                $('#divTimeChange').removeClass('hide')
            }
            else {
                $('#divTimeChange').addClass('hide')
            }
            jQuery("#tblapproversPrev").empty();
            $('#wrap_scrollerPrevApp').show();

            jQuery('#tblapproversPrev').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");

            for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {

                strp = '<tr id=trAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                strp += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td></tr>";
                jQuery('#tblapproversPrev').append(strp);

            }



            jQuery("#tblServicesProductPrev").empty();
            if (BidData[0].bidScrapSalesDetails.length > 0) {
                $('#wrap_scrollerPrev').show();

                if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {

                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Name</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {


                        var decrementon = ''
                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = 'Percentage'

                        var attach = (BidData[0].bidScrapSalesDetails[i].attachments).replace(/\s/g, "%20");
                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td>' + decrementon + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');

                    }
                }
                else { // for dutch

                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Mask Vendor</th><th class=hide>Minimum Increment</th><th class=hide>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 Price</th><th class=hide>Show Start Price</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {


                        var decrementon = ''
                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = 'Percentage'

                        var attach = (BidData[0].bidScrapSalesDetails[i].attachments).replace(/\s/g, "%20");
                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right> ' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=hide>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td class=hide>' + decrementon + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].startingPrice) + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].priceReductionFrequency + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionAmount) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');

                    }

                }

            }
            if (BidData[0].bidVendorDetails.length > 0) {

                for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                    jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td></tr>')
                    $('.THLoading').hide()
                }
                jQuery('#selectedvendorlistsPrev').show()

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }

            return false;
            jQuery.unblockUI();
        }
    });


}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + sessionStorage.getItem('CurrentBidID'));
}
var FormValidation = function () {

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
                txtRemarksApp: {
                    required: true,
                },
                txtbidDate: {
                    required: true,
                },
                //txtbidTime: {
                //    required: true,
                //}
            },
            messages: {
                ddlActionType: {
                    required: "Please select Action"
                },

                txtRemarksApp: {
                    required: "Please enter your comment"
                },
                txtbidDate: {
                    required: "Please select Bid date"
                },

                //txtbidTime: {
                //    required: "Please select Bid Time"
                //}
            },

            invalidHandler: function (event, validator) { //display error alert on form submit              
                success1.hide();
                error1.show();
                // App.scrollTo(error1, -300);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.xyz').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.xyz').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                    .closest('.xyz').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {

                //var datearray = $("#txtbidDate").val().split("/");
                //var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
                //new Date($('#txtbidDate').val().replace('-', ''));
                var BidDate = new Date($('#txtbidDate').val().replace('-', ''));//new Date(newdate + ' ' + $("#txtbidTime").val())
                if (isLastPreApprover == "Y") {
                    if (BidDate < new Date()) {
                        bootbox.alert("Date and Time should not be less than current date and time.");
                        return false;
                    }
                    else {
                        ApprovalApp();
                    }
                }
                else {
                    ApprovalApp();
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
            validateAppsubmitData();

        }
    };
}();

function ApprovalApp() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var BidDate = new Date($('#txtbidDate').val().replace('-', ''));
    var approvalbyapp = {
        "BidID": parseInt(BidID),
        "FromUserId": sessionStorage.getItem("UserID"),
        "Remarks": jQuery("#txtRemarksApp").val(),
        "BidTypeID": parseInt(_BidTypeID),
        "Action": $("#ddlActionType option:selected").val(),
        "ForwardedBy": "Approver",
        //"BidDate": $("#txtbidDate").val(),
        //"BidTime": $("#txtbidTime").val(),
        "BidDate": BidDate,
        "isLastApprover": isLastPreApprover,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    };

    //alert(JSON.stringify(approvalbyapp))
    console.log(JSON.stringify(approvalbyapp))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/PreApprovalApp",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(approvalbyapp),
        crossDomain: true,
        dataType: "json",
        success: function () {
            if (isLastPreApprover == "N") {
                bootbox.alert("Transaction Successful..", function () {
                    window.location = "index.html";
                    return false;
                });
            }
            else {
                bootbox.alert("Bid successfully approved and communicated to all the selected vendors.", function () {
                    window.location = "index.html";
                    return false;
                });
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" ++ ")");
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

function FetchRecomendedVendor(bidid) {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/fetpreApprovalHistory/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=" + bidid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $('#tblremarksapprover').empty()
            if (data.length > 0) {

                $('#tblremarksapprover').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th>Completion DT</th></tr>')
                if (AppStatus == 'Reverted') {
                    jQuery("#lblrevertedComment").text(data[0].remarks);
                    jQuery("#RevertComment").show();
                    $('#frmdivremarksforward').removeClass('col-md-12');
                    $('#frmdivremarksforward').addClass('col-md-6');
                    $('#frmdivforward').show();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].vendorName != "") {
                            $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                            $('#thforward').removeClass('hide')
                        }
                        else {
                            $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                            $('#thforward').addClass('hide')
                        }


                    }
                }
                $('#frmdivremarksapprover').removeClass('col-md-12');
                $('#frmdivremarksapprover').addClass('col-md-6');
                for (var i = 0; i < data.length; i++) {

                    $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td class=hide>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                    $('#thapprover').removeClass('hide')

                }

                $('#frmdivapprove').show()
                $("#lblLastcomments").text(data[0].remarks);

            }

            else {

                $('#frmdivremarksapprover').removeClass('col-md-6');
                $('#frmdivremarksapprover').addClass('col-md-12');
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });

}