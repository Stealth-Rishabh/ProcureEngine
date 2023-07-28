jQuery(document).ready(function () {

    Pageloaded()

    //setInterval(function () { Pageloaded() }, 15000);
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
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }

    Metronic.init();
    Layout.init();
    ComponentsPickers.init();
    FormValidation.init();
    setCommonData();

});

var _BidID;
var _BidTypeID;
if (window.location.search) {
    console.log('biejndras ingh');

    var param = getUrlVars()["param"]

    var decryptedstring = fndecrypt(param);

    _BidID = getUrlVarsURL(decryptedstring)["RFQID"];

    _BidTypeID = getUrlVarsURL(decryptedstring)["RFQTypeID"];

    var FwdBy = getUrlVarsURL(decryptedstring)["FwdBy"]

    var AppStatus = getUrlVarsURL(decryptedstring)["AppStatus"]
    sessionStorage.setItem('CurrentRFQID', _BidID)
    if (FwdBy == 'config') {
        $("#frmdivapprove").hide();
    }
    else if (FwdBy == 'userview') {
        // $("#divRemarksApp").hide();
        //$('#h3Preapprovalhistory').show();
        //$('#divPreapprovalhistory').show();
    }
    else {
        //$('#divlastcomment').removeClass('hide')
        $("#frmdivapprove").show();
    }
    // if (_BidTypeID == "7") {
    fetchRFQDetails(_BidID);
    /*  }
      else if (_BidTypeID == "6") {
         // fetchScrapSalesBidDetails(_BidID)
      }*/
    // FetchRecomendedVendor(_BidID);
    setTimeout(function () {
        //if (isLastPreApprover == "Y") {
        //    $('#txtbidDate').rules('add', {
        //        required: true,
        //    });

        //}
        //else {
        //    $('#txtbidDate').rules('add', {
        //        required: false,
        //    });

        //}
        $('#txtbidDate').rules('add', {
            required: true,
        });
    }, 1000)

}

$("#btnbackApp").click(function () {
    parent.history.back();
});
$('.maxlength').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
var isLastPreApprover = 'N';
function fetchRFQDetails(RFQID) {
    //  debugger
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + RFQID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data) {
            // debugger;
            BidData = Data.rData;
            console.log(BidData);
            var bidclosingtype = "A";
            $('#bid_EventID').html("Event ID : " + RFQID);
            $("#txtbidDate").val(fnConverToLocalTime(BidData[0].general[0].rfqStartDate))
            $("#txtEndDate").val(fnConverToLocalTime(BidData[0].general[0].rfqEndDate))
            //$("#txtbidTime").val(fnConverToLocalTime(BidData[0].bidDetails[0].bidTime))
            $('#mapedapproverPrev').html('');
            $('#txtBidSubjectPrev').html(BidData[0].general[0].rfqSubject)
            $('#TechnicalApproval').html(BidData[0].general[0].technicalApproval)
            $('#txtbiddescriptionPrev').html(BidData[0].general[0].rfqDescription)
            $('#txtbidDatePrev').html(fnConverToLocalTime(BidData[0].general[0].rfqStartDate))
            //$('#txtbidTimePrev').html(BidData[0].bidDetails[0].bidTime)
            $("#dropCurrencyPrev").html(BidData[0].general[0].currencyNm)
            $('#txtConversionRatePrev').html(BidData[0].general[0].rfqConversionRate)
            /* bidclosingtype = BidData[0].general[0].bidClosingType.trim()
             if (bidclosingtype == "A") {
                 $('#ddlbidclosetypePrev').html("All in one go");
             }
             else {
                 $('#ddlbidclosetypePrev').html("Stagger");
             }*/
            //isLastPreApprover = BidData[0].general[0].isLastPreApprover;
            $('#filepthtermsPrev').html(BidData[0].general[0].rfqTermandCondition);
            // $('#filepthattachPrev').html(BidData[0].general[0].RFQAttachment);

            //**Post approvers
            $("#tblapproversPrev").empty();
            $('#wrap_scrollerPrevApp').show();
            $('#tblapproversPrev').append("<thead><tr><th class='bold text-center' colspan=3>Post Approvers</th></tr></thead>");
            $('#tblapproversPrev').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Apporval Type</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            strp = '';

            for (var i = 0; i < BidData[0].approvers.length; i++) {

                strp = '<tr id=trAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].approvers[i].userName + '</td>'
                strp += "<td>" + BidData[0].approvers[i].emailID + "</td>";
                if (BidData[0].approvers[i].approverType == 'T') {
                    strp += "<td>Technical</td> ";
                }
                else {
                    strp += "<td>Commercial</td> ";
                }
                strp += "<td>" + BidData[0].approvers[i].adminSrNo + "</td></tr>";
                $('#tblapproversPrev').append(strp);


            }
            //** Pre Approver

            $("#tblapproversPrePrev").empty();
            $('#wrap_scrollerprePrevApp').show();
            $('#tblapproversPrePrev').append("<thead><tr><th class='bold text-center' colspan=3>Pre Approvers</th></tr></thead>");
            $('#tblapproversPrePrev').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            strp = '';
            for (var i = 0; i < BidData[0].rfqApproverViewDet.length; i++) {

                strp = '<tr id=trPreAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].rfqApproverViewDet[i].approverName + '</td>'
                strp += "<td>" + BidData[0].rfqApproverViewDet[i].emailID + "</td>";
                strp += "<td>" + BidData[0].rfqApproverViewDet[i].adMinSrNo + "</td></tr>";
                $('#tblapproversPrePrev').append(strp);


            }
            totalitemdurationstagger = 0;

            $("#tblServicesProductPrev").empty();
            console.log(BidData[0].parameters.length);
            if (BidData[0].parameters.length > 0) {
                BidItemslength = BidData[0].parameters[0].length
                $('#wrap_scrollerPrev').show();
                $("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th></tr></thead>");
                //<th>UOM</th><th>Bid Start Price</th><th>Floor/ Min. Price</th><th>Price Decrement Amount</th><th> Price Decrement Frequency</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th>
                for (var i = 0; i < BidData[0].parameters.length; i++) {

                    $("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td style="width:20%!important;" id=itemcodeprev' + i + '>' + BidData[0].parameters[i].rfqItemCode + '</td><td id=destinationportprev' + i + '>' + BidData[0].parameters[i].rfqShortName + '</td><td id=remarksprev' + i + '>' + BidData[0].parameters[i].rfqDescription + '</td><td class=text-right id=TPprev' + i + '>' + thousands_separators(BidData[0].parameters[i].rfqTargetPrice) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators(BidData[0].parameters[i].rfQuantity) + '</td></tr > ');
                    //                        < td class= text - right id = CPprev' + i + ' > ' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td > <td id=floorpriceprev' + i + ' class= text - right > ' + thousands_separators(BidData[0].bidSeaExportDetails[i].itemPrice) + '</td > <td class=text-right id=pricedecreamentprev' + i + ' > ' + thousands_separators(BidData[0].bidSeaExportDetails[i].priceDecreamentAmount) + '</td > <td class="text-right" id=pricedecreamentfeqprev' + i + ' > ' + BidData[0].bidSeaExportDetails[i].priceDecreamentFrequency + '</td > <td class=text-right id=unitrateprev' + i + ' > ' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td > <td id=ponoprev' + i + ' > ' + BidData[0].bidSeaExportDetails[i].poNo + '</td > <td id=povendornameprev' + i + ' > ' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td > <td id=podateprev' + i + ' > ' + BidData[0].bidSeaExportDetails[i].poDate + '</td > <td class=text-right id=povalueprev' + i + ' > ' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td ></tr > ');
                }
            }

            if (BidData[0].vendors.length > 0) {
                $('#selectedvendorlistsPrev').empty();
                for (var i = 0; i < BidData[0].vendors.length; i++) {

                    /* if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].general[0].bidForID == 83) {
                             $('.THLoading').show()
                         }
                         else {
                             $('.THLoading').hide()
                         }*/
                    $('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].vendors[i].vendorID + '><td class=hide>' + BidData[0].vendors[i].vendorID + '</td><td>' + BidData[0].vendors[i].vendorName + '</td><td id=tblcolweightagePrev' + BidData[0].vendors[i].vendorID + ' class=hide> </td></tr>')
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
        //url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + bidid,
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?BidID=" + bidid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            $('#bid_EventID').html("Event ID : " + bidid);
            $("#txtbidDate").val(fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))
            //$("#txtbidTime").val(BidData[0].bidDetails[0].bidTime)
            $('#mapedapproverPrev').html('');
            $('#txtBidSubjectPrev').html(BidData[0].bidDetails[0].bidSubject)
            $('#txtBidDurationPrev').html(BidData[0].bidDetails[0].bidDuration + ' mins')
            $('#txtbiddescriptionPrev').html(BidData[0].bidDetails[0].bidDetails)
            $('#txtbidDatePrev').html(fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))
            //$('#txtbidTimePrev').html(BidData[0].bidDetails[0].bidTime)
            $("#dropCurrencyPrev").html(BidData[0].bidDetails[0].currencyID)
            $('#txtConversionRatePrev').html(BidData[0].bidDetails[0].conversionRate)
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


            $("#tblapproversPrev").empty();
            $('#wrap_scrollerPrevApp').show();
            $('#tblapproversPrev').append("<thead><tr><th class='bold text-center' colspan=3 >Post Approvers</th></tr></thead>");
            $('#tblapproversPrev').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");

            for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {

                strp = '<tr id=trAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                strp += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td></tr>";
                $('#tblapproversPrev').append(strp);

            }

            //Post approvers
            $("#tblapproversPrePrev").empty();
            $('#wrap_scrollerprePrevApp').show();
            $('#tblapproversPrePrev').append("<thead><tr><th class='bold text-center' colspan=3>Pre Approvers</th></tr></thead>");
            $('#tblapproversPrePrev').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            strp = '';
            for (var i = 0; i < BidData[0].bidPreApproverDetails.length; i++) {
                //** Pre Approver
                strp = '<tr id=trPreAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].bidPreApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidPreApproverDetails[i].emailID + "</td>";
                strp += "<td>" + BidData[0].bidPreApproverDetails[i].adMinSrNo + "</td></tr>";
                $('#tblapproversPrePrev').append(strp);


            }

            $("#tblServicesProductPrev").empty();
            if (BidData[0].bidScrapSalesDetails.length > 0) {
                $('#wrap_scrollerPrev').show();

                if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {

                    $("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Name</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {


                        var decrementon = ''
                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = 'Percentage'

                        var attach = (BidData[0].bidScrapSalesDetails[i].attachments).replace(/\s/g, "%20");
                        $("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td>' + decrementon + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');

                    }
                }
                else { // for dutch

                    $("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Mask Vendor</th><th class=hide>Minimum Increment</th><th class=hide>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 Price</th><th class=hide>Show Start Price</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {


                        var decrementon = ''
                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = 'Percentage'

                        var attach = (BidData[0].bidScrapSalesDetails[i].attachments).replace(/\s/g, "%20");
                        $("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right> ' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=hide>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td class=hide>' + decrementon + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].startingPrice) + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].priceReductionFrequency + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionAmount) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');

                    }

                }

            }
            if (BidData[0].bidVendorDetails.length > 0) {

                for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                    $('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td></tr>')
                    $('.THLoading').hide()
                }
                $('#selectedvendorlistsPrev').show()

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

                //var BidDate = new Date($('#txtbidDate').val().replace('-', ''));
                var BidDate = new Date();

                if ($('#txtbidDate').val() != null && $('#txtbidDate').val() != "") {
                    //StartDT = new Date($('#txtbidDate').val().replace('-', ''));
                    BidDate = $('#txtbidDate').val().replace('-', '');

                }

                let StTime =
                    new Date(BidDate.toLocaleString("en", {
                        timeZone: sessionStorage.getItem('preferredtimezone')
                    }));

                ST = new String(StTime);
                ST = ST.substring(0, ST.indexOf("GMT"));
                ST = ST + 'GMT' + sessionStorage.getItem('utcoffset');


                Dateandtimevalidate(ST);
                //if (isLastPreApprover == "Y") {
                //if (BidDate < new Date()) {
                //    bootbox.alert("Date and Time should not be less than current date and time.");
                //    return false;
                //}
                //else {
                //    ApprovalApp();
                //}
                //}
                //else {
                //    ApprovalApp();
                //}

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
            // handleWysihtml5();
            validateAppsubmitData();

        }
    };
}();
function Dateandtimevalidate(biddate) {

    var Tab1Data = {
        "BidDate": biddate
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(Tab1Data),
        dataType: "json",
        success: function (data) {

            if (data == "1") {
                ApprovalApp();
            }
            else {
                bootbox.alert("Date and Time should not be less than current date and time.");
                return false;
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;
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
function ApprovalApp() {
    debugger
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var BidDate = new Date($('#txtbidDate').val().replace('-', ''));
    var EndDate = new Date($('#txtEndDate').val().replace('-', ''));
    var approvalbyapp = {
        "RFQID": parseInt(_BidID),
        "FromUserId": sessionStorage.getItem("UserID"),
        "Remarks": $("#txtRemarksApp").val(),
        "RFQTypeID": 7,
        "Action": $("#ddlActionType option:selected").val(),
        "ForwardedBy": "Approver",
        "RFQStartDate": BidDate,
        "RFQEndDate": EndDate,
        "isLastApprover": isLastPreApprover,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    };


    console.log(JSON.stringify(approvalbyapp))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/RFQpreApproverAction",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(approvalbyapp),
        crossDomain: true,
        dataType: "json",
        success: function () {
            debugger
            if (isLastPreApprover == "N") {
                bootbox.alert("Transaction Successful..", function () {
                    window.location = "index.html";
                    return false;
                });
            }
            else {
                if ($("#ddlActionType option:selected").text().toLowerCase() == "approved") {
                    bootbox.alert("RFQ successfully approved and communicated to all the selected vendors.", function () {
                        window.location = "index.html";
                        return false;
                    });
                }
                else {
                    bootbox.alert("RFQ successfully reverted!!", function () {
                        window.location = "index.html";
                        return false;
                    });
                }
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
        //url: sessionStorage.getItem("APIPath") + "ApprovalAir/fetpreApprovalHistory/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=" + bidid,
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/fetpreApprovalHistory/?BidID=" + bidid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {


            $('#tblremarksapprover').empty()
            $('#tblBidPreapprovalHistory').empty()

            if (data.length > 0) {

                if (AppStatus == 'Reverted') {

                    $("#lblrevertedComment").text(data[0].remarks);
                    $("#RevertComment").show();
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
                $('#frmdivremarksapprover').removeClass('col-md-6');
                $('#frmdivremarksapprover').addClass('col-md-12');
                $('#frmdivapprove').addClass('hide');
                var counthead = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].finalStatus == "A") {

                        if (!$("#tblremarksapprover thead").length && counthead == 0) {
                            counthead = counthead + 1;
                            $('#frmdivremarksapprover').removeClass('col-md-12');
                            $('#frmdivremarksapprover').addClass('col-md-6');
                            $('#frmdivapprove').removeClass('hide');
                            $('#tblremarksapprover').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th>Completion DT</th></tr>')
                        }
                        $('#tblremarksapprover').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                        counthead = counthead + 1;
                    }
                }
                counthead = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].finalStatus == "H") {
                        if (!$("#tblBidPreapprovalHistory thead").length && counthead == 0) {
                            $('#tblBidPreapprovalHistory').append('<tr><th>Action</th><th>Remarks</th><th class=hide>Action Type</th><th> Action Taken On</th></tr>')
                        }
                        $('#tblBidPreapprovalHistory').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td></tr>')
                        counthead = counthead + 1;

                    }
                }
                $('#frmdivapprove').show()
                $("#lblLastcomments").text(data[0].remarks);

            }

            else {
                $('#divRemarksApp').removeClass('col-md-6');
                $('#divRemarksApp').addClass('col-md-12');
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