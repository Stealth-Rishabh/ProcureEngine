

$(document).ready(function () {
    formvalidate()
    fetchregisterusers();
    BindPurchaseOrg();

});
$('#ddlconfiguredby').on('change', function (e) {

    if (this.value != '' && this.value == 0) {
        $('#ddlconfiguredby').select2({
            placeholder: "Select Users",
            allowClear: true
        });
        $('#ddlconfiguredby').select2('data', null)
        $(this).select2('val', 0);
    }


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
                dtfrom = new Date(2000, 01, 01);

            }
            else {
                var dateParts = $("#txtFromDate").val().split("/");
                dtfrom = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            }

            if ($("#txtToDate").val() == null || $("#txtToDate").val() == '') {
                //dtto = new Date();
                dtto = null;

            }
            else {
                var dateParts = $("#txtToDate").val().split("/");
                dtto = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                dtto.setDate(dtto.getDate() + 1);
            }
            if (jQuery("#txtnfasubject").val() != null && jQuery("#txtnfasubject").val() != "") {
                subject = jQuery("#txtnfasubject").val()
            }


            fetNFAReport(dtfrom, dtto, subject);
            $('#tblNFASummary_wrapper').removeClass('hide');
            $('#tblNFASummary').removeClass('hide');

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
            jQuery("#ddlconfiguredby").prop('disabled', false)

            if (data[0].roleName.toLowerCase() == "reports" || data[0].role.toLowerCase() == "administrator") {

                jQuery("#ddlconfiguredby").append(jQuery("<option></option>").val("0").html("All"));
            }
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlconfiguredby").append(jQuery("<option></option>").val(data[i].userID).html(data[i].userName));
            }
            if (data[0].role.toLowerCase() == "user" && data[0].roleName.toLowerCase() != "reports") {
                jQuery("#ddlconfiguredby").select2('val', data[0].userID);
                jQuery("#ddlconfiguredby").prop('disabled', true)
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
    var result = '';
    if ($("#ddlconfiguredby").select2('data').length) {
        $.each($("#ddlconfiguredby").select2('data'), function (key, item) {
            result = result + (item.id) + ','

        });
        result = result.slice(0, -1)
    }
    //var url = sessionStorage.getItem("APIPath") + "NFA/fetNFAReport/?EventID=" + jQuery("#ddlEventType option:selected").val() + "&OrgID=" + jQuery("#ddlPurchaseOrg option:selected").val() + "&GroupID=" + jQuery("#ddlPurchasegroup option:selected").val() + "&FromDate=" + dtfrom + "&ToDate=" + dtto + "&NFASubject=" + subject + "&FinalStatus=" + jQuery("#ddlNFAstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val();
    var url = sessionStorage.getItem("APIPath") + "NFA/fetNFAReport/";
    var Tab1Data = {
        "EventID": parseInt(jQuery("#ddlEventType option:selected").val()),
        "OrgID": parseInt(jQuery("#ddlPurchaseOrg option:selected").val()),
        "GroupID": parseInt(jQuery("#ddlPurchasegroup option:selected").val()),
        "FromDate": dtfrom,
        "ToDate": dtto,
        "NFASubject": subject,
        "FinalStatus": jQuery("#ddlNFAstatus option:selected").val(),
        "UserID": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ConfiguredBy": result == '' ? '0' : result,

    };
    console.log(JSON.stringify(Tab1Data))
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: url,
        data: JSON.stringify(Tab1Data),
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
                    BidDate = fnConverToLocalTime(data[i].updatedOn);
                    
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