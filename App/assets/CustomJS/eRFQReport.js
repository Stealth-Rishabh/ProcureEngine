
var max = getUrlVarsURL(decryptedstring)["max"];
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));
}
function fetchReguestforQuotationDetails() {
   
    
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(RFQData) {
            $('#tbldetailsExcel > tbody').empty();
           
            jQuery('#RFQSubject').html(RFQData[0].general[0].rfqSubject)
            jQuery('#lbl_ConfiguredBy').html("RFQ Configured By: " + RFQData[0].general[0].rfqConfigureByName)

            $('#Currency').html(RFQData[0].general[0].currencyNm)
            jQuery('#RFQDescription').html(RFQData[0].general[0].rfqDescription)
           
            jQuery('#RFQDeadline').html(RFQData[0].general[0].rfqStartDate + ' / ' + RFQData[0].general[0].rfqEndDate)
            jQuery('#ConversionRate').html(RFQData[0].general[0].rfqConversionRate)
            $('#TermCondition').html(RFQData[0].general[0].rfqTermandCondition)
           
            $('#tbldetails').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td id=tdVendorname></td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + RFQData[0].general[0].rfqEndDate + "</td></tr>")
            $('#tbldetailsExcel > tbody').append("<tr><td>" + RFQData[0].general[0].rfqSubject + "</td><td>" + RFQData[0].general[0].rfqDescription + "</td><td id=tdVendorname></td><td>" + RFQData[0].general[0].currencyNm + "</td><td >" + RFQData[0].general[0].rfqConversionRate + "</td><td>" + RFQData[0].general[0].rfqEndDate + "</td></tr>")
           
            jQuery('#refno').html(RFQData[0].general[0].rfqReference)
            
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            jQuery.unblockUI();
            return false;
            
        }

    });

}

function RFQFetchQuotedPriceReport() {
  
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorattach = '';
    
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchQuotedPriceReport/?VendorID=" + sessionStorage.getItem('hddnVendorId') + "&RFQId=" + sessionStorage.getItem('hddnRFQID') + "&RFQVersionId=" + sessionStorage.getItem('RFQVersionId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
          
            var totalamountsum = 0.0;
            var withoutGSTValue = 0.0;
           
            if (data[0].quotesDetails.length > 0) {
                var description = "";
                jQuery("#tblServicesProduct").empty();
                jQuery("#tblServicesProductforexcel").empty();
                $('#divdomestic').show();
                $('#btnExport').show();
               
                $('#RFQVendorname').html(data[0].quotesDetails[0].vendorName);
                $('#tdVendorname').html(data[0].quotesDetails[0].vendorName);
                if (data[0].quotesDetails[0].vendorRemarks != '') {
                    $('#tblvendorremarks').removeClass('hide')
                    $('#vRemarks').text(data[0].quotesDetails[0].vendorRemarks.replace(/<br>/g, '\n'))
                 } 
                else{
                    $('#tblvendorremarks').addClass('hide')
                }
              
                for (var i = 0; i < data[0].quotesDetails.length; i++) {

                    var taxHRTextinc = stringDivider("Landed Unit Price (Without GST)", 12, "<br/>\n");
                    var taxHRTextEx = stringDivider("Landed Unit Price (With GST)", 12, "<br/>\n");
                    var HRUnitRate = stringDivider("Amount (Inc. Taxes)", 12, "<br/>\n");
                    var totalamount = 0.0;
                    var bsicpercentageofGST = 0.0;
                    //if (data[i].RFQBoq == 'Y ') {                       
                    description = stringDivider(data[0].quotesDetails[i].rfqDescription, 45, "<br/>\n");

                    if (i == 0) {
                        jQuery('#tblServicesProduct').append('<thead><tr style="background: grey; color:light black;"><th style="width:40%!important;">Short Name</th><th>Quantity</th><th>UOM</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th><th>' + HRUnitRate + '</th><th>Description</th></tr></thead>');
                        jQuery('#tblServicesProductforexcel').append('<thead><tr style="background: grey; color:light black;"><th style="width:40%!important;">Short Name</th><th>Quantity</th><th>UOM</th><th>' + taxHRTextinc + '</th><th>' + taxHRTextEx + '</th><th>' + HRUnitRate + '</th><th>Description</th></tr></thead>');
                    }
                    if (data[0].quotesDetails[i].rfqtcid == 0) {
                        if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                            totalamount = data[0].quotesDetails[i].rfqVendorPricewithTax * data[0].quotesDetails[i].quantity;
                            jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;"><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].quantity) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithoutGST) + '</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithTax) + '</b></td><td class=text-right><b>' + thousands_separators(totalamount.round(2)) + '</b></td><td><b>' + description + '</b></td></tr></thead>');
                            jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].quantity) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithoutGST) + '</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithTax) + '</b></td><td class=text-right><b>' + thousands_separators(totalamount.round(2)) + '</b></td><td><b>' + description + '</b></td></tr></thead>');
                            totalamountsum = totalamountsum + totalamount;
                            withoutGSTValue = data[0].quotesDetails[i].rfqVendorPricewithoutGST
                        }
                        else {
                           
                            jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;"><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].quantity) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td><b>' + description + '</b></td></tr></thead>');
                            jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr><td style="width:40%!important;"><b>' + data[0].quotesDetails[i].rfqShortName + '&nbsp(TC Given Below)</b></td><td class=text-right><b>' + thousands_separators(data[0].quotesDetails[i].quantity) + '</b></td><td><b>' + data[0].quotesDetails[i].uom + '</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td class=text-right><b>Quoted</b></td><td><b>' + description + '</b></td></tr></thead>');
                           
                        }
                    }
                    
                    for (var j = 0; j < data[0].quotesDetails.length; j++) {
                       
                        description = stringDivider(data[0].quotesDetails[j].rfqDescription, 45, "<br/>\n");  // for word wrap
                      
                        if (j == 0) {
                            if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>' + (data[0].quotesDetails[i].unitRate) + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td></tr>');
                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>' + (data[0].quotesDetails[i].unitRate) + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td></tr>');
                            }
                            else{
                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td></tr>');
                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>Basic Price</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + '' + '</td><td class=text-right>Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td></tr>');
                            }
                        }
                        
                        if (data[0].quotesDetails[j].rfqtcid != 0 && data[0].quotesDetails[i].rfqParameterId == data[0].quotesDetails[j].rfqParameterId) {
                           
                            
                            if (data[0].quotesDetails[j].termName == "GST") {
                                bsicpercentageofGST = withoutGSTValue * (data[0].quotesDetails[j].termRate / 100)
                            }
                            else {
                                bsicpercentageofGST = data[0].quotesDetails[i].unitRate * (data[0].quotesDetails[j].termRate / 100)
                            }
                            if (sessionStorage.getItem('ShowPrice') == "Y" || sessionStorage.getItem('ShowPrice') == "") {
                               
                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + (data[0].quotesDetails[j].termRate) + '%</td><td class=text-right>' + bsicpercentageofGST.round(2) + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td></tr>');
                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>' + data[0].quotesDetails[j].termRate + '%</td><td class=text-right>' + bsicpercentageofGST.round(2) + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td></tr>');
                            }
                            else {
                               
                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>Quoted</td><td class=text-right>Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td></tr>');
                                jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[0].quotesDetails[j].termName + '</td><td class=text-right>' + '' + '</td><td>' + '' + '</td><td  class=text-right>Quoted</td><td class=text-right>Quoted</td><td class=text-right>' + '' + '</td><td>' + '' + '</td></tr>');
                            }
                        }
                    }
                }
                jQuery('#tblServicesProduct').append('<thead><tr style="background: #ccc; color:grey;white-space:nowrap!important;"><td colspan=4></td><td class=text-right><b>Total</b></td><td class=text-right><b>' + thousands_separators(totalamountsum.round(2)) + '</b></td><td>&nbsp;</td></tr></thead>');
                jQuery('#tblServicesProductforexcel').append('<thead><tr><td colspan=4></td><td class=text-right><b>Total</b></td><td class=text-right><b>' + thousands_separators(totalamountsum.round(2)) + '</b></td><td>&nbsp;</td></tr></thead>');
                  
            }
           
            else
            {
                jQuery('#tblServicesProduct').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblServicesProductforexcel').append('<tr><td>No Record Found</td></tr>');
            }
            if (data[0].commercialTerms.length > 0) {
                jQuery("#tblcommercialtermsprev").empty();
                jQuery("#tblcommercialterms").empty();
               
                jQuery("#tblcommercialterms").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:30%'>Other Commercial Terms</th><th style='width:30%'>Our Requirement</th><th>Your Offer</th></tr></thead>");
                jQuery("#tblcommercialtermsprev").append("<thead><tr><th style='width:30%'>Other Commercial Terms</th><th style='width:30%'>Our Requirement</th><th>Your Offer</th></tr></thead>");
                for (var i = 0; i < data[0].commercialTerms.length; i++) {
                    jQuery('<tr id=trid' + i + '><td>' + data[0].commercialTerms[i].termName + '</td><td>' + data[0].commercialTerms[i].requirement + '</td><td>' + data[0].commercialTerms[i].remarks + '</td></tr>').appendTo("#tblcommercialterms");
                    jQuery('<tr id=trid' + i + '><td>' + data[0].commercialTerms[i].termName + '</td><td>' + data[0].commercialTerms[i].requirement + '</td><td>' + data[0].commercialTerms[i].remarks + '</td></tr>').appendTo("#tblcommercialtermsprev");
                }
            }
            else {
                
                jQuery('#tblcommercialterms').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblcommercialtermsprev').append('<tr><td>No Record Found</td></tr>');
            }
            if (data[0].questions.length > 0) {
                jQuery("#tblquestions").empty();
                jQuery("#tblquestionsprev").empty();
              
                jQuery('#tblquestions').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Questions</th><th class='bold' style='width:30%!important'>Our Requirement</th><th style='width:40%!important'>Answer</th></tr></thead>");
                jQuery('#tblquestionsprev').append("<thead><tr><th class='bold' style='width:30%!important'>Questions</th><th class='bold' style='width:30%!important'>Our Requirement</th><th style='width:40%!important'>Answer</th></tr></thead>");
                for (var i = 0; i < data[0].questions.length; i++) {
                    jQuery('<tr id=trid' + i + '><td style="width:30%">' + data[0].questions[i].question + '</td><td>' + data[0].questions[i].requirement + '</td><td>' + data[0].questions[i].answer + '</td></tr>').appendTo("#tblquestions");
                    jQuery('<tr id=trid' + i + '><td style="width:20%">' + data[0].questions[i].question + '</td><td>' + data[0].questions[i].requirement + '</td><td>' + data[0].questions[i].answer + '</td></tr>').appendTo("#tblquestionsprev");
                }
            }
            else {
             
                jQuery('#tblquestions').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblquestionsprev').append('<tr><td>No Record Found</td></tr>');
            }
            var version = 0;
            if (data[0].attachments.length > 0) {
                jQuery("#tblAttachments").empty();
                jQuery("#tblAttachmentsprev").empty();
                
                jQuery('#tblAttachments').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Description</th><th class='bold'>Attachment</th></tr></thead>");
                jQuery('#tblAttachmentsprev').append("<thead><tr><th class='bold' style='width:30%!important'>Description</th><th class='bold'>Attachment</th></tr></thead>");
                for (var i = 0; i < data[0].attachments.length; i++) {

                    if (sessionStorage.getItem('RFQVersionId') == 99) {
                        version = max;
                    }
                    else {
                        version = sessionStorage.getItem('RFQVersionId');
                    }
                    jQuery('<tr id=trid' + i + '><td>' + data[0].attachments[i].attachmentDescription + '</td><td><a id=attchvendor'+i+' style="pointer:cursur;text-decoration:none;" onclick="DownloadFileVendor(this)" href="javascript:;" >' + data[0].attachments[i].attachment + '</a></td></tr>').appendTo("#tblAttachments");
                    jQuery('<tr id=trid' + i + '><td>' + data[0].attachments[i].attachmentDescription + '</td><td>' + data[0].attachments[i].attachment + '</td></tr>').appendTo("#tblAttachmentsprev");
                }
            }
            else {
              
                jQuery('#tblAttachments').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblAttachmentsprev').append('<tr><td>No Record Found</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            jQuery.unblockUI();
            return false;
           
        }

    });

}
function DownloadFileVendor(aID) {
    if (sessionStorage.getItem('RFQVersionId') == 99) {
        version = max;
    }
    else {
        version = sessionStorage.getItem('RFQVersionId');
    }
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem("hddnRFQID") + '/' + sessionStorage.getItem('hddnVendorId') + '/' + version);
}
function stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
        var p = width
        for (; p > 0 && str[p] != ' '; p--) {
        }
        if (p > 0) {
            var left = str.substring(0, p);
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}

var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name, filename) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        document.getElementById("dlink").href = uri + base64(format(template, ctx));
        document.getElementById("dlink").download = filename;
        document.getElementById("dlink").click();
    }
})()

setTimeout(function () {sessionStorage.removeItem('selectedboqtxtboxid') }, 5000);
