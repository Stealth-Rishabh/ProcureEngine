var form = $('#frmbidsummaryreport');
$(document).ready(function () {
   
    fetchregisterusers();
    formvalidate();
});
function fetchregisterusers() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlconfiguredby").empty();
            jQuery("#ddlconfiguredby").append(jQuery("<option ></option>").val("0").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlconfiguredby").append(jQuery("<option></option>").val(data[i].userID).html(data[i].userName));
            }
        }
    });
}
function formvalidate() {

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

            $(element).closest('.col-md-8').addClass('has-error');

        },

        unhighlight: function (element) {

            $(element).closest('.col-md-8').removeClass('has-error');

        },

        success: function (label) {


        },
        submitHandler: function (form) {
           
                if ($('#ddlreporttype option:selected').val() == "List") {
                    fetchRFQVendorSummary();
                    $('#tblVendorSummary_wrapper').removeClass('hide');
                    $('#tblVendorSummary').removeClass('hide');
                    $('#tblVendorSummarydetails').addClass('hide');
                    $('#tblVendorSummarydetails_wrapper').addClass('hide');
                    $('#tblVendorSummarySUmzation').addClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').addClass('hide');
                }
                else if ($('#ddlreporttype').val() == "SDetail") {
                    fetchBidVendorSummaryDetail()
                    $('#tblVendorSummary').addClass('hide');
                    $('#tblVendorSummary_wrapper').addClass('hide');
                    $('#tblVendorSummarydetails').removeClass('hide');
                    $('#tblVendorSummarydetails_wrapper').removeClass('hide');
                    $('#tblVendorSummarySUmzation').addClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').addClass('hide');
                }
                else {
                    fetchBidVendorSummarySummarization()
                    $('#tblVendorSummary').addClass('hide');
                    $('#tblVendorSummary_wrapper').addClass('hide');
                    $('#tblVendorSummarydetails').addClass('hide');
                    $('#tblVendorSummarydetails_wrapper').addClass('hide');
                    $('#tblVendorSummarySUmzation').removeClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').removeClass('hide');
                }
            
         }

    });

}
function getSummary(RFQID, subject) {
    var encrypdata = fnencrypt("RFQID=" + RFQID + "&RFQSubject=" + subject)
    window.open("RFQAnalysis.html?param=" + encrypdata, "_blank")

}
var rfqdeadline = '';
function fetchRFQVendorSummary() {
    var dtfrom = '', dtto = '', subject = 'X-X';
    if ($("#txtFromDate").val() == null || $("#txtFromDate").val() == '') {
        dtfrom = '1900/01/01';

    }
    else {
        dtfrom = $("#txtFromDate").val()
    }

    if ($("#txtToDate").val() == null || $("#txtToDate").val() == '') {
        dtto = '1900/01/01';

    }
    else {
        dtto = $("#txtToDate").val()
    }
    if (jQuery("#txtbidsubject").val() != null && jQuery("#txtbidsubject").val() != "") {
        subject = jQuery("#txtbidsubject").val()
    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/RFQOverviewReport/?FromDate=" + dtfrom + "&ToDate=" + dtto + "&RFQSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data:'',
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
           
            
            jQuery("#tblVendorSummary").empty();
            jQuery('#tblVendorSummary').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>RFQ Subject</th><th class='bold'>Configured By</th><th class='bold'>RFQ Deadline</th><th class='bold'>Currency</th><th class='bold'>RFQ Status</th></tr></thead>");
            if (BidData.length > 0) {
               
                for (var i = 0; i < BidData.length; i++) {
                    var str = "<tr><td class=text-right><a onclick=getSummary(\'" + BidData[i].rfqid + "'\,\'" + encodeURIComponent(BidData[i].rfqSubject) + "'\) href='javascript:;' >" + BidData[i].rfqid + "</a></td>";
                    str += "<td>" + BidData[i].rfqSubject + "</td>";
                    str += "<td>" + BidData[i].rfqConfiguredBy + "</td>";
                    var datearray = BidData[i].rfqDeadline.split("/");
                  
                    rfqdeadline = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                   
                    str += "<td>" + rfqdeadline + "</td>";

                  
                    str += "<td>" + BidData[i].currencyName + "</td>";
                    str += "<td>" + BidData[i].rfqStatus + "</td>";

                    str += "</tr>";
                    jQuery('#tblVendorSummary').append(str);
                }
                
                var table = $('#tblVendorSummary');
                table.removeAttr('width').dataTable({
                    "bDestroy": true,
                    responsive: false,
                   
                    fixedColumns: true,
                    "oLanguage": { "sSearch": "", "sLengthMenu": "\_MENU_" },
                   
                    "bAutoWidth": false,

                    "aaSorting": [[0, 'asc']],
                    
                    "iDisplayLength": 10,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    dom: 'Bfrtip',
                    buttons: [
                        'pageLength',
                        
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i> Excel',
                            
                        },
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="fa fa-file-pdf-o"></i> PDF',
                            orientation: 'landscape',
                            pageSize: 'LEGAL'
                        }
                        
                    ],
                    initComplete: function () {

                       
                        $('.dataTables_filter input[type="search"]').removeClass('input-small')
                        $('.dataTables_filter input[type="search"]').attr('placeholder', 'Search  ....').css({ 'width': '450px' });
                        
                    }


                });
                var tableWrapper = $('#tblVendorSummary_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper



            }
            else {
                jQuery('#tblVendorSummary > tbody').append("<tr><td colspan='8' style='text-align: center; color:red;'>No record found</td></tr>");
                $('#tblVendorSummary').dataTable({
                    "bDestroy": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bAutoWidth": false,
                    "bSort": true


                });
            }
        }
    });
}

function fetchBidVendorSummaryDetail() {
    var dtfrom = '', dtto = '', subject = 'X-X';
    if ($("#txtFromDate").val() == null || $("#txtFromDate").val() == '') {
        dtfrom = '1900/01/01';
    }
    else {
        dtfrom = $("#txtFromDate").val()
    }

    if ($("#txtToDate").val() == null || $("#txtToDate").val() == '') {
        dtto = '1900/01/01';

    }
    else {
        dtto = $("#txtToDate").val()
    }
    if (jQuery("#txtbidsubject").val() != null && jQuery("#txtbidsubject").val() != "") {
        subject = jQuery("#txtbidsubject").val()
    }
    //alert(sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchAdminRFQSummaryDetailed/?FromDate=" + dtfrom + "&ToDate=" + dtto + "&RFQSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val())
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchAdminRFQSummaryDetailed/?FromDate=" + dtfrom + "&ToDate=" + dtto + "&RFQSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: '',
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
          
            var savinfLIP = stringDivider("Total Saving wrt LIP", 12, "<br/>\n");
           
            var savinfTR = stringDivider("Total Saving wrt TP", 12, "<br/>\n");
            jQuery("#tblVendorSummarydetails").empty();

            jQuery('#tblVendorSummarydetails').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>RFQ Subject</th><th class='bold'>Configured By</th><th class='bold'>RFQ Deadline</th><th class='bold'>Short Name</th><th class='bold'>Quantity</th><th class='bold'>UOM</th><th>Currency</th><th>Vendor</th><th class='bold'>Last Invoice Price (LIP)</th><th class='bold'>Target Price (TP)</th><th class='bold'>L1 Price</th><th class='bold'>" + savinfLIP + "</th><th class='bold'>" + savinfTR + "</th></tr></thead>");
            if (BidData.length > 0) {
                var bID = 0;
                
               
                for (var i = 0; i < BidData.length; i++) {
                   
                    var str = "<tr><td class=text-right><a onclick=getSummary(\'" + BidData[i].rfqid + "'\,\'" + encodeURIComponent(BidData[i].rfqSubject) + "'\) href='javascript:;' >" + BidData[i].rfqid + "</a></td>";
                    str += "<td>" + BidData[i].rfqSubject + "</td>";
                    str += "<td>" + BidData[i].rfqConfiguredBy + "</td>";

                    var datearray = BidData[i].rfqDeadline.split("/");
                  
                    rfqdeadline = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                   
                    str += "<td>" + rfqdeadline + "</td>";

                    var RFQShortName = BidData[i].rfqShortName.replace(/<br\s*\/?>/gi, ' '); //remove br

                    str += "<td>" + RFQShortName + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].quantity) + "</td>";
                    str += "<td>" + BidData[i].uom + "</td>";
                    str += "<td>" + BidData[i].currencyName + "</td>";
                    str += "<td>" + BidData[i].vendorName + "</td>";

                    str += "<td class=text-right>" + thousands_separators(BidData[i].rfqLastInvoicePrice) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].rfqTargetPrice) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].minPrice) + "</td>";
                    if (BidData[i].rfqLastInvoicePrice != 0) {

                        str += "<td class=text-right>" + thousands_separators(((BidData[i].rfqLastInvoicePrice - BidData[i].minPrice) * BidData[i].quantity).round(2)) + "</td>"
                    }
                    else {

                        str += '<td class=text-right>' + 0 + '</td>';
                    }
                    if (BidData[i].rfqTargetPrice != 0) {

                    str += "<td class=text-right>" + thousands_separators(((BidData[i].rfqTargetPrice - BidData[i].minPrice) * BidData[i].quantity).round(2)) + "</td>"
                    }
                    else {

                        str += '<td class=text-right>' + 0 + '</td>';
                    }

                    str += "</tr>";
                    jQuery('#tblVendorSummarydetails').append(str);
                }
                var table = $('#tblVendorSummarydetails');
                table.removeAttr('width').dataTable({
                    "bDestroy": true,
                   
                    "oLanguage": { "sSearch": "", "sLengthMenu": "\_MENU_" },
                    fixedColumns: true,
                    "bAutoWidth": false,
                    "aaSorting": [[0, 'asc']],
                    
                    "iDisplayLength": 10,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    dom: 'Bfrtip',
                    buttons: [
                        'pageLength',
                        
                        {
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function(data,column, node) {              
                                        return column === 4 ?
                                         data.replace(/[$,.]/g, '') : data.replace(/(&nbsp;|<([^>]+)>)/ig, "");
                                         data.replace(/<br\s*\/?>/ig, "\r\n");
                                        data;
                                       
                                    }
                                    
                                }
                            },
                           
                            text: '<i class="fa fa-file-excel-o"></i> Excel',
                        },
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="fa fa-file-pdf-o"></i> PDF',
                            orientation: 'landscape',
                            pageSize: 'LEGAL'
                        }
                       
                    ],
                    
                    initComplete: function () {
                        $('.dataTables_filter input[type="search"]').removeClass('input-small')
                        $('.dataTables_filter input[type="search"]').attr('placeholder', 'Search  ....').css({ 'width': '450px' });
                        
                    }


                });
                var tableWrapper = $('#tblVendorSummarydetails_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper



            }
            else {
                jQuery('#tblVendorSummarydetails > tbody').append("<tr><td colspan='14' style='text-align: center; color:red;'>No record found</td></tr>");
                $('#tblVendorSummarydetails').dataTable({
                    "bDestroy": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bAutoWidth": false,
                    "bSort": true


                });
            }
        }
    });
}



function fetchBidVendorSummarySummarization() {
    var dtfrom = '', dtto = '', subject = 'X-X';
    if ($("#txtFromDate").val() == null || $("#txtFromDate").val() == '') {
        dtfrom = '1900/01/01';

    }
    else {
        dtfrom = $("#txtFromDate").val()
    }

    if ($("#txtToDate").val() == null || $("#txtToDate").val() == '') {
        dtto = '1900/01/01';

    }
    else {
        dtto = $("#txtToDate").val()
    }
    if (jQuery("#txtbidsubject").val() != null && jQuery("#txtbidsubject").val() != "") {
        subject = jQuery("#txtbidsubject").val()
    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchAdminRFQSummaryfull/?FromDate=" + dtfrom + "&ToDate=" + dtto + "&RFQSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: '',
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var BidLIP = stringDivider("RFQ Value at Last Invoice Price(LIP)", 15, "<br/>\n");
            var BidTP = stringDivider("RFQ Value at Target Price(TP)", 15, "<br/>\n");
            var BidFinal = stringDivider("RFQ Value as per L1", 15, "<br/>\n");
            var savinfLIP = stringDivider("Total Saving wrt LIP", 12, "<br/>\n");
           var savinfTR = stringDivider("Total Saving wrt TP", 12, "<br/>\n");
            jQuery("#tblVendorSummarySUmzation").empty();

            jQuery('#tblVendorSummarySUmzation').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>RFQ Subject</th><th class='bold'>Configured By</th><th class='bold'>RFQ Deadline</th><th class='bold'>Currency</th><th class='bold'>" + BidLIP + "</th><th class='bold'>" + BidTP + "</th><th class='bold'>" + BidFinal + "</th><th class='bold'>" + savinfLIP + "</th><th class='bold'>" + savinfTR + "</th></tr></thead>");
  
            if (BidData.length > 0) {
               
                for (var i = 0; i < BidData.length; i++) {

                    var str = "<tr><td><a onclick=getSummary(\'" + BidData[i].rfqid + "'\,\'" + encodeURIComponent(BidData[i].rfqSubject) + "'\) href='javascript:;' >" + BidData[i].rfqid + "</a></td>";
                    str += "<td>" + BidData[i].rfqSubject + "</td>";
                    str += "<td>" + BidData[i].rfqConfiguredBy + "</td>";
                   
                    var datearray = BidData[i].rfqDeadline.split("/");
                  
                    rfqdeadline = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                   
                    str += "<td>" + rfqdeadline + "</td>";

                    str += "<td>" + BidData[i].currencyName + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].rfqValueAsLastInvoicePrice) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].rfqValueAsTargetPrice) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].rfqValueAsMinPrice) + "</td>";
                    if (BidData[i].RFQValueAsLastInvoicePrice != 0) {

                        str += "<td class=text-right>" + thousands_separators((BidData[i].rfqValueAsLastInvoicePrice - BidData[i].rfqValueAsMinPrice).round(2)) + "</td>";
                    }
                    else {

                        str += "<td class=text-right>" + 0 + "</td>"
                    }
                    if (BidData[i].rfqValueAsTargetPrice != 0) {
                        
                        str += "<td class=text-right>" + thousands_separators((BidData[i].rfqValueAsTargetPrice - BidData[i].rfqValueAsMinPrice).round(2)) + "</td>";
                    }
                    else {
                        
                        str += "<td class=text-right>" + 0 + "</td>"
                    }

                    str += "</tr>";
                  
                    jQuery('#tblVendorSummarySUmzation').append(str);
                }
                var table = $('#tblVendorSummarySUmzation');
                table.removeAttr('width').dataTable({
                    "bDestroy": true,
                    

                    "oLanguage": { "sSearch": "", "sLengthMenu": "\_MENU_" },
                    fixedColumns: true,
                    "bAutoWidth": false,
                    "aaSorting": [[0, 'asc']],
                    
                    "iDisplayLength": 10,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    dom: 'Bfrtip',
                    buttons: [
                        'pageLength',
                       
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i> Excel',
                           
                        },
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="fa fa-file-pdf-o"></i> PDF',
                            orientation: 'landscape',
                            pageSize: 'LEGAL'
                        }

                    ],

                    initComplete: function () {

                        $('.dataTables_filter input[type="search"]').removeClass('input-small')
                        $('.dataTables_filter input[type="search"]').attr('placeholder', 'Search  ....').css({ 'width': '450px' });

                    }


                });
                var tableWrapper = $('#tblVendorSummarySUmzation_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper



            }
            else {
                jQuery('#tblVendorSummarySUmzation > tbody').append("<tr><td colspan='11' style='text-align: center; color:red;'>No record found</td></tr>");
                $('#tblVendorSummarySUmzation').dataTable({
                    "bDestroy": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bAutoWidth": false,
                    "bSort": true


                });
            }
        }
    })

}