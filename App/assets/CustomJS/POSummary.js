jQuery(document).ready(function () {  
    Pageloaded()
    var x = isAuthenticated();
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
    Metronic.init(); Layout.init(); ComponentsPickers.init(); setCommonData();
    formvalidate();
    fetchMenuItemsFromSession(49, 51);
});
var form = $('#frmbidsummaryreport');
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
            fetchPOSummary();
            
        }

    });

}
function fetchPOSummary() {
    var frmdate = "1900-01-01";
    var todate = "1900-01-01";
    if (jQuery("#txtFromDate").val() != "" && jQuery("#txtFromDate").val() != null) {
        frmdate = jQuery("#txtFromDate").val();
    }
  
    if (jQuery("#txtToDate").val() != "" && jQuery("#txtToDate").val() != null) {
        todate = jQuery("#txtToDate").val();
    }
   
    var url = sessionStorage.getItem("APIPath") + "POUpload/POSummary/?FromDate=" + frmdate + "&ToDate=" + todate + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID');// + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val();
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: url,
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
           
            jQuery("#tblVendorSummary").empty();
            jQuery('#tblVendorSummary').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>Vendor</th><th class='bold'>Configured By</th><th class='bold'>PO Date</th><th class='bold'>PO Status</th></tr></thead>");
            if (BidData.length > 0) {

                for (var i = 0; i < BidData.length; i++) {
                    var str = "<tr><td  class=text-right><a onclick=getSummary(\'" + BidData[i].poHeaderID + "'\,\'" + BidData[i].status.charAt(0) + "'\) href='javascript:;' >" + BidData[i].poHeaderID + "</a></td>";
                   
                    str += "<td>" + BidData[i].vendorName + "</td>";
                    str += "<td>" + BidData[i].createdByName + "</td>";

                    var datearray = BidData[i].poDate.split("/");

                    BidDate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];

                    str += "<td>" + BidDate + "</td>";
                    var status = (BidData[i].status.split(" ")[0] == 'Forward') ? "Pending" : BidData[i].status.split(" ")[0] != 'Cancel' ? BidData[i].status.split(" ")[0]+"ed": BidData[i].Status.split(" ")[0]
                    str += "<td>" + status + "</td>";

                    str += "</tr>";
                    jQuery('#tblVendorSummary').append(str);
                }
                var table = $('#tblVendorSummary');
                table.removeAttr('width').dataTable({
                    "bDestroy": true,
                    responsive: false,
                    //"scrollX": true,
                    // "scrollY": "800px",
                     columnDefs: [
                         { width: 100, targets: 0 }
                    ],

                    fixedColumns: true,
                    "oLanguage": { "sSearch": "", "sLengthMenu": "\_MENU_" },
                    "bAutoWidth": false,
                    "aaSorting": [[0, 'asc']],
                    //"bPaginate": true,
                    //"sPaginationType": "full_numbers",<'col-xs-1'l>
                    "iDisplayLength": 10,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    dom: 'Bfrtip',
                    buttons: [
                        'pageLength',
                        // 'excelHtml5',
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i> Excel'

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
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
function getSummary(POID,Type) {
    var encrypdata = fnencrypt("POHID=" + POID + "&Type=" + Type)
        window.open("NewPOAcceptance.html?param=" + encrypdata, "_blank")
}