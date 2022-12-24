var error = $('.alert-danger');

var success = $('.alert-success');

var form = $('#submit_form');
var Vehicleerror = $('#errordiv');
var Vehiclesuccess = $('#successdiv');
var Vehicleerror1 = $('#errordiv1');
var Vehiclesuccess1 = $('#successdiv1');

function fetchReguestforQuotationDetails() {
    var attachment = '';
    var termattach = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchReguestforQuotationDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(RFQData) {
            $('#tbldetailsExcel > tbody').empty();
            if (RFQData.length > 0) {
                attachment = RFQData[0].RFQAttachment.replace(/%20/g, " ").replace(/'&amp;'/g, "&");
                termattach = RFQData[0].RFQTermandCondition.replace(/%20/g, " ").replace(/'&amp;'/g, "&");

            } else {
                attachment = attachment;
                termattach = termattach;
            }
            sessionStorage.setItem('CurrentrfiID', RFQData[0].RFQId)
            jQuery('#RFQSubject').html(RFQData[0].RFQSubject)
            jQuery('#lbl_ConfiguredBy').html("RFQ Configured By: " + RFQData[0].RFQConfigureByName)

            $('#Currency').html(RFQData[0].CurrencyNm)
            jQuery('#RFQDescription').html(RFQData[0].RFQDescription)
            jQuery('#RFQDeadline').html(RFQData[0].RFQDeadline)
            jQuery('#ConversionRate').html(RFQData[0].RFQConversionRate)
            $('#TermCondition').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + termattach + '').html(RFQData[0].RFQTermandCondition)
            $('#Attachment').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '').html(RFQData[0].RFQAttachment)
            $('#tbldetails').append("<tr><td>" + RFQData[0].RFQSubject + "</td><td>" + RFQData[0].RFQDescription + "</td><td id=tdVendorname></td><td>" + RFQData[0].CurrencyNm + "</td><td>" + RFQData[0].RFQConversionRate + "</td><td>" + RFQData[0].RFQDeadline + "</td></tr>")
            $('#tbldetailsExcel').append("<tr><td>" + RFQData[0].RFQSubject + "</td><td>" + RFQData[0].RFQDescription + "</td><td id=tdVendorname></td><td>" + RFQData[0].CurrencyNm + "</td><td>" + RFQData[0].RFQConversionRate + "</td><td>" + RFQData[0].RFQDeadline + "</td></tr>")


        }
    });

}

function RFQFetchQuotedPriceReport() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var vendorattach = '';
   //alert(sessionStorage.getItem("APIPath") + "RequestForQuotation/RFQFetchQuotedPriceReport/?VendorID=" + sessionStorage.getItem('hddnVendorId') + "&RFQId=" + sessionStorage.getItem('hddnRFQID'))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RFQFetchQuotedPriceReport/?VendorID=" + sessionStorage.getItem('hddnVendorId') + "&RFQId=" + sessionStorage.getItem('hddnRFQID') + "&RFQVersionId=" + sessionStorage.getItem('RFQVersionId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            
           
            if (data.length > 0) {
                var description = "";
                jQuery("#tblServicesProduct").empty();
                jQuery("#tblServicesProductforexcel").empty();
                $('#divdomestic').show();
                $('#btnExport').show();
              
                $('#RFQVendorname').html(data[0].VendorName);
                $('#tdVendorname').html(data[0].VendorName);
                if (data[0].VendorRemarks != '') {
                   
                    $('#tblvendorremarks').removeClass('hide')
                    $('#vRemarks').text(data[0].VendorRemarks.replace(/<br>/g, '\n'))
                   
                } 
                else{
                    $('#tblvendorremarks').addClass('hide')
                }
               
                for (var i = 0; i < data.length; i++) {
                   
                    vendorattach = data[i].VendorAttachment.replace(/ /g, '%20');
                   
                    var taxHRTextinc = stringDivider("Total Amount (Inc. Taxes)", 12, "<br/>\n");
                    var taxHRTextEx = stringDivider("Total Amount (Ex. Taxes)", 12, "<br/>\n");
                    var HRUnitRate = stringDivider("Unit Rate (Ex. Taxes)", 12, "<br/>\n");
                  
                    if (data[i].RFQBoq == 'Y ') {                       
                        description = stringDivider(data[i].RFQDescription, 45, "<br/>\n"); 
                        if (i == 0) 
                        {
                            jQuery('#tblServicesProduct').append('<thead><tr style="background: grey; color:light black;"><th>Short Name</th><th>Quantity</th><th>UOM</th><th>' + HRUnitRate + '</th><th>' + taxHRTextEx + '</th><th>' + taxHRTextinc + '</th><th>TAT</th><th>Delivery Location</th><th>Attachment</th><th>Description</th><th>Remark</th></tr></thead>');
                            jQuery('#tblServicesProductforexcel').append('<thead><tr style="background: grey; color:light black;"><th>Short Name</th><th>Quantity</th><th>UOM</th><th>Unit Rate (Ex. Taxes)</th><th>Total Amount (Inc. Taxes)</th><th>Total Amount (Inc. Taxes)</th><th>TAT</th><th>Delivery Location</th><th>Attachment</th><th>Description</th><th>Remark</th></tr></thead>');
                        }
                       
                        jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: #ccc; color:grey;white-space:nowrap!important;"><td><b>' + data[i].RFQShortName + '&nbsp(BOQ Given Below)</b></td><td class=text-right><b>' + thousands_separators(data[i].RFQuantity) + '</b></td><td><b>' + data[i].RFQUomId + '</b></td><td class=text-right><b>' + thousands_separators(data[i].UnitRate) + '</b></td><td class=text-right><b>' + thousands_separators(data[i].RFQVendorPrice) + '</b></td><td class=text-right><b>' + thousands_separators(data[i].RFQVendorPriceWithTax) + '</b></td><td><b>' + data[i].TAT + '</td><td><b>' + data[i].RFQDelivery + '</b></td><td><b><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('hddnVendorId') + '/' + vendorattach + '>' + data[i].VendorAttachment + '</b></a></td><td><b>' + description + '</b></td><td><b>' + data[i].RFQRemark + '</b></td></tr></thead>'); //<a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('hddnVendorId') + '/' + vendorattach + '>' + data[i].VendorAttachment + '</a>
                        jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr><td><b>' + data[i].RFQShortName + ' (BOQ Given Below)</b></td><td class=text-right><b>' + thousands_separators(data[i].RFQuantity) + '</b></td><td><b>' + data[i].RFQUomId + '</b></td><td class=text-right><b>' + thousands_separators(data[i].UnitRate) + '</b></td><td class=text-right><b>' + thousands_separators(data[i].RFQVendorPrice) + '</b></td><td class=text-right><b>' + thousands_separators(data[i].RFQVendorPriceWithTax) + '</b></td><td><b>' + data[i].TAT + '</td><td><b>' + data[i].RFQDelivery + '</b></td><td><b>' + data[i].VendorAttachment + '</b></td><td><b>' + data[i].RFQDescription + '</b></td><td><b>' + data[i].RFQRemark + '</b></td></tr></thead>'); //<a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('hddnVendorId') + '/' + vendorattach + '>' + data[i].VendorAttachment + '</a>
                      
                    for (var j = 0; j < data.length; j++) {
                        description = stringDivider(data[j].RFQDescription, 45, "<br/>\n");  // for word wrap
                        if (data[i].RFQParameterId == data[j].BOQparentId && data[j].SeqNo != 0) 
                        {
                           
                            jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[j].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[j].RFQuantity) + '</td><td>' + data[j].RFQUomId + '</td><td  class=text-right>' + thousands_separators(data[j].UnitRate) + '</td><td class=text-right>' + thousands_separators(data[j].RFQVendorPrice) + '</td><td class=text-right>' + thousands_separators(data[j].RFQVendorPriceWithTax) + '</td><td>' + '' + '</td><td>' + data[j].RFQDelivery + '</td><td>&nbsp;</td><td>' + description + '</td><td>' + data[j].RFQRemark + '</td></tr>');// <a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('hddnVendorId') + '/' + vendorattach + '>' + data[i].VendorAttachment + '</a>
                            jQuery("#tblServicesProductforexcel  > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[j].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[j].RFQuantity) + '</td><td>' + data[j].RFQUomId + '</td><td  class=text-right>' + thousands_separators(data[j].UnitRate) + '</td><td class=text-right>' + thousands_separators(data[j].RFQVendorPrice) + '</td><td class=text-right>' + thousands_separators(data[j].RFQVendorPriceWithTax) + '</td><td>' + '' + '</td><td>' + data[j].RFQDelivery + '</td><td>' + data[i].VendorAttachment + '</td><td>' + data[i].RFQDescription + '</td><td>' + data[j].RFQRemark + '</td></tr>');
                           }
                        }
                    }
                    else if (data[i].RFQBoq == 'N ') {

                        jQuery('#tblServicesProduct').append('<thead id=headid' + i + '><tr style="background: grey; color:light black;"><th>Short Name (Without BOQ)</th><th>Quantity</th><th>UOM</th><th>' + HRUnitRate + '</th><th>' + taxHRTextEx + '</th><th>' + taxHRTextinc + '</th><th>TAT</th><th>Delivery Location</th><th>Attachment</th><th>Description</th><th>Remark</th></tr></thead>');
                        jQuery('#tblServicesProductforexcel').append('<thead id=headid' + i + '><tr style="background: grey; color:light black;"><th>Short Name (Without BOQ)</th><th>Quantity</th><th>UOM</th><th>Unit Rate (Ex. Taxes)</th><th>Total Amount (Inc. Taxes)</th><th>Total Amount (Inc. Taxes)</th><th>TAT</th><th>Delivery Location</th><th>Attachment</th><th>Description</th><th>Remark</th></tr></thead>');
                        
                        for (var j = 0; j < data.length; j++) {
                            description = stringDivider(data[j].RFQDescription, 40, "<br/>\n");  // for word wrap
                            if (data[j].BOQparentId == 0 && data[j].RFQBoq == 'N ' && data[j].RFQParameterId == data[i].RFQParameterId) {

                                jQuery("#tblServicesProduct > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[j].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[j].RFQuantity) + '</td><td>' + data[j].RFQUomId + '</td><td class=text-right>' + thousands_separators(data[j].UnitRate) + '</td><td class=text-right>' + thousands_separators(data[j].RFQVendorPrice) + '</td><td class=text-right>' + thousands_separators(data[j].RFQVendorPriceWithTax) + '</td><td>' + data[j].TAT + '</td><td>' + data[j].RFQDelivery + '</td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('hddnVendorId') + '/' + vendorattach + '>' + data[i].VendorAttachment + '</a></td><td>' + description + '</td><td>' + data[j].RFQRemark + '</td></tr>'); //<a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('hddnVendorId') + '/' + vendorattach + '>' + data[i].VendorAttachment + '</a>
                                jQuery("#tblServicesProductforexcel > #headid" + i + "").append('<tr id=trid' + j + '><td>' + data[j].RFQShortName + '</td><td class=text-right>' + thousands_separators(data[j].RFQuantity) + '</td><td>' + data[j].RFQUomId + '</td><td class=text-right>' + thousands_separators(data[j].UnitRate) + '</td><td class=text-right>' + thousands_separators(data[j].RFQVendorPrice) + '</td><td class=text-right>' + thousands_separators(data[j].RFQVendorPriceWithTax) + '</td><td>' + data[j].TAT + '</td><td>' + data[j].RFQDelivery + '</td><td>' + data[i].VendorAttachment + '</td><td>' + data[i].RFQDescription + '</td><td>' + data[j].RFQRemark + '</td></tr>'); //<a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('hddnVendorId') + '/' + vendorattach + '>' + data[i].VendorAttachment + '</a>
                               
                               
                            }
                        }
                    }
                  }
               }
            else
            {
                
                jQuery('#tblServicesProduct').append('<tr><td>No Record Found</td></tr>');
                jQuery('#tblServicesProductforexcel').append('<tr><td>No Record Found</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (result) {
            // alert("error");
            jQuery.unblockUI();
        }
    });

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