

$(document).ready(function () {
    formvalidate()
    fetchregisterusers();
    BindPurchaseOrg();

});
var form = $('#frmbidsummaryreport');
function formvalidate() {

    form.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

        errorElement: 'span', //default input error message container

        errorClass: 'help-block help-block-error', // default input error message class

        focusInvalid: false, // do not focus the last invalid input

        rules: {

            /* ddlEventType: {
                 required: true
             }*/

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
            var dtfrom = '', dtto = '', subject = 'X-X';
            if ($("#txtFromDate").val() == null || $("#txtFromDate").val() == '') {
                dtfrom = '01/01/1900';
            }
            else {
                dtfrom = $("#txtFromDate").val()
            }

            if ($("#txtToDate").val() == null || $("#txtToDate").val() == '') {
                var today = new Date();
                // dtto=moment(today).format("MM/dd/yyyy");
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0');
                var yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;
                dtto = today;
            }
            else {
                dtto = $("#txtToDate").val()
            }
            if (jQuery("#txtnfasubject").val() != null && jQuery("#txtnfasubject").val() != "") {
                subject = jQuery("#txtnfasubject").val()
            }

            //if ($('#ddlBidtype option:selected').val() == 7) {
            // if ($('#ddlreporttype option:selected').val() == "List" || $('#ddlreporttype').val() == "ListRFQ") {
            fetNFAReport(dtfrom, dtto, subject);
            $('#tblNFASummary_wrapper').removeClass('hide');
            $('#tblNFASummary').removeClass('hide');
            // $('#tblVendorSummarydetails').addClass('hide');
            // $('#tblVendorSummarydetails_wrapper').addClass('hide');
            //$('#tblVendorSummarySUmzation').addClass('hide');
            //$('#tblVendorSummarySUmzation_wrapper').addClass('hide');
            // }

            //else if ($('#ddlreporttype').val() == "SDetail") {
            //    fetchBidVendorSummaryDetail(dtfrom, dtto, subject);
            //    $('#tblVendorSummary').addClass('hide');
            //    $('#tblVendorSummary_wrapper').addClass('hide');
            //    $('#tblVendorSummarydetails').removeClass('hide');
            //    $('#tblVendorSummarydetails_wrapper').removeClass('hide');
            //    $('#tblVendorSummarySUmzation').addClass('hide');
            //    $('#tblVendorSummarySUmzation_wrapper').addClass('hide');
            //}
            //else {
            //    fetchBidVendorSummarySummarization(dtfrom, dtto, subject);
            //    $('#tblVendorSummary').addClass('hide');
            //    $('#tblVendorSummary_wrapper').addClass('hide');
            //    $('#tblVendorSummarydetails').addClass('hide');
            //    $('#tblVendorSummarydetails_wrapper').addClass('hide');
            //    $('#tblVendorSummarySUmzation').removeClass('hide');
            //    $('#tblVendorSummarySUmzation_wrapper').removeClass('hide');
            //}
            //}

        }

    });

}
var orgData = [];
function BindPurchaseOrg() {
    var url = sessionStorage.getItem("APIPath") + "NFA/GetPurchaseOrgByUserid?CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID'));
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#ddlPurchaseOrg").empty();
            $('#ddlPurchaseOrg').append('<option value="0">Select</option>');
            if (data.result.length > 0) {

                for (var i = 0; i < data.result.length; i++) {
                    jQuery("#ddlPurchaseOrg").append(jQuery("<option></option>").val(data.result[i].purchaseOrgID).html(data.result[i].purchaseOrgName));
                }
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

};
function bindPurchaseGroupDDL() {
    var url = sessionStorage.getItem("APIPath") + "NFA/GetPurchaseGroupByUserID?CustomerId=" + parseInt(sessionStorage.getItem("CustomerID")) + "&OrgId=" + parseInt($('#ddlPurchaseOrg option:selected').val()) + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID"));


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#ddlPurchasegroup").empty();
            $('#ddlPurchasegroup').append('<option value="0">Select</option>');
            if (data.result.length > 0) {

                for (var i = 0; i < data.result.length; i++) {
                    jQuery("#ddlPurchasegroup").append(jQuery("<option></option>").val(data.result[i].idx).html(data.result[i].groupName));
                }
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

};
function fetchregisterusers() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchUserForReports/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&Isactive=N&CustomerID=" + sessionStorage.getItem("CustomerID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#ddlconfiguredby").empty();

            if (data[0].role.toLowerCase() != "user") {
                jQuery("#ddlconfiguredby").append(jQuery("<option ></option>").val("0").html("Select"));
            }
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlconfiguredby").append(jQuery("<option></option>").val(data[i].userID).html(data[i].userName));
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
function fetNFAReport(dtfrom, dtto, subject) {

    var url = sessionStorage.getItem("APIPath") + "NFA/fetNFAReport/?EventID=" + jQuery("#ddlEventType option:selected").val() + "&OrgID=" + jQuery("#ddlPurchaseOrg option:selected").val() + "&GroupID=" + jQuery("#ddlPurchasegroup option:selected").val() + "&FromDate=" + dtfrom + "&ToDate=" + dtto + "&NFASubject=" + subject + "&FinalStatus=" + jQuery("#ddlNFAstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val();
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: url,

        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            
            jQuery("#tblNFASummary").empty();
            jQuery('#tblNFASummary').append("<thead><tr><th class='bold'>NFA ID</th><th class='bold'>NFA Subject</th><th class='bold'>Configured By</th><th class='bold'>NFA Date</th><th class='bold'>Aging</th><th class='bold'>Currency</th><th class='bold'>Purchase Org</th><th class='bold'>Purchase Group</th><th class='bold'>NFA Status</th></tr></thead>");
            if (data.length > 0) {

                for (var i = 0; i < data.length; i++) {


                    var str = "<tr><td  class=text-right><a onclick=getSummary(\'" + data[i].nfaID + "'\,\'" + data[i].eventID + "'\,\'" + data[i].eventRefernce + "'\) href='javascript:;' >" + data[i].nfaID + "</a></td>";
                    str += "<td>" + data[i].nfaSubject + "</td>";
                    str += "<td>" + data[i].createdBy + "</td>";
                    //var _bidDate = fnConverToLocalTime
                    //var datearray = BidData[i].bidDate.split("/");

                    //BidDate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                    BidDate = fnConverToLocalTime(data[i].updatedOn);
                    //var _bidTime = moment(BidDate).format('HH:mm');
                    //var _bidTime = fnReturnTimeFromDate(BidDate);

                    str += "<td>" + BidDate + "</td>";
                    str += "<td>" + data[i].aging + "</td>";
                    str += "<td>" + data[i].nfaCurrency + "</td>";
                    str += "<td>" + data[i].orgName + "</td>";
                    str += "<td>" + data[i].groupName + "</td>";
                    str += "<td>" + data[i].finalStatus + "</td>";

                    str += "</tr>";
                    jQuery('#tblNFASummary').append(str);
                }
                var table = $('#tblNFASummary');
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
                var tableWrapper = $('#tblNFASummary_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper

            }
            else {
                jQuery('#tblNFASummary > tbody').append("<tr><td colspan='8' style='text-align: center; color:red;'>No record found</td></tr>");
                $('#tblNFASummary').dataTable({
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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
}
function getSummary(nfaid) {
    var encrypdata = fnencrypt("nfaIdx=" + nfaid + "&FwdTo=View")
    window.open("NFAApproverReq.html?param=" + encrypdata, "_blank")
}