var BidID = "";
var BidTypeID = "";
var BidForID = "";



$(document).ready(function () {

    fetchBidTypeMapping();

    formvalidate()
    fetchregisterusers();

    if (window.location.search) {
        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param)

        BidID = getUrlVarsURL(decryptedstring)["BidID"]
        BidTypeID = getUrlVarsURL(decryptedstring)["BidTypeID"]
        BidForID = getUrlVarsURL(decryptedstring)["BidForID"]
    }


});
$('#ddlconfiguredby').on('change', function (e) {

    if (this.value != '' && this.value == 0) {
        $('#ddlconfiguredby').select2({
            placeholder: "Select Users",
            allowClear: true
        });
        $('#ddlconfiguredby').select2('data', null)
        //$("#ddlconfiguredby").val([1]).change();
        $(this).select2('val', 0);
    }

    /* console.log(this.value,
                 this.options[this.selectedIndex].value,
                 $(this).find("option:selected").val(),);*/
});

function fetchregisterusers() {
    
    var userData = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "Isactive": 'N'
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchUserForReports/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&Isactive=N&CustomerID=" + sessionStorage.getItem("CustomerID"),
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchUserForReports",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        data: JSON.stringify(userData),
        dataType: "json",
        success: function (data) {
            jQuery("#ddlconfiguredby").empty();
            jQuery("#ddlconfiguredby").prop('disabled', false)
            if (data[0].roleName.toLowerCase() == "reports" || data[0].role.toLowerCase() == "administrator") {
                jQuery("#ddlconfiguredby").append(jQuery("<option ></option>").val("0").html("All"));
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

function FetchContinent(ContinentID) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchContinent/?ContinentID=" + ContinentID + "&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlsector").empty();
            jQuery("#ddlsector").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlsector").append(jQuery("<option></option>").val(data[i].ContinentId).html(data[i].ContinentNm));
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

jQuery("#ddlBidtype").change(function () {
    var BidTypeID = $("#ddlBidtype option:selected").val();
    jQuery("#ddlBidFor").empty();

    if (BidTypeID == 6) {
        $('#opntionRFQ').addClass('hide')
        jQuery("#ddlBidFor").append(jQuery("<option></option>").val("81").html("English"));
        jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("83").html("Japanese"));
        jQuery("#ddlBidFor").append(jQuery("<option></option>").val("82").html("Dutch(RA)"));

    }
    else if (BidTypeID == 7) {
        $('#opntionRFQ').addClass('hide')
        jQuery("#ddlBidFor").append(jQuery("<option></option>").val("81").html("English"));
        jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("83").html("Japanese"));
        jQuery("#ddlBidFor").append(jQuery("<option></option>").val("82").html("Dutch(FA)"));

    }
    else {
        $('#opntionRFQ').removeClass('hide')
        jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("0").html("Select"));
        jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("81").html("English"));
        jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("83").html("Japanese"));
    }

});

jQuery("#ddlsector").change(function () {
    var continentID = $("#ddlsector option:selected").val();
    var countryID = "0";
    fetchCountry(continentID, countryID)
});

function fetchCountry(continentID, countryID) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchCountry/?ContinentId=" + continentID + "&CountryID=" + countryID + "&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlcountry").empty();
            jQuery("#ddlcountry").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlcountry").append(jQuery("<option ></option>").val(data[i].CountryId).html(data[i].CountryNm));
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
function fetchBidTypeMapping() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidTypeMapping/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlBidtype").empty();
            jQuery("#ddlBidtype").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlBidtype").append(jQuery("<option ></option>").val(data[i].bidTypeID).html(data[i].bidTypeName));
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
    jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("").html("Select"));
    jQuery("#ddlsector").append(jQuery("<option ></option>").val("").html("Select"));
    jQuery("#ddlcountry").append(jQuery("<option ></option>").val("").html("Select"));
}

function fetchBidFor(BidTypeID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidFor/?BidTypeID=" + BidTypeID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlBidFor").empty();
            jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlBidFor").append(jQuery("<option></option>").val(data[i].bidForID).html(data[i].bidFor));
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


var form = $('#frmbidsummaryreport');
function formvalidate() {

    form.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

        errorElement: 'span', //default input error message container

        errorClass: 'help-block help-block-error', // default input error message class

        focusInvalid: false, // do not focus the last invalid input

        rules: {

            ddlBidtype: {
                required: true
            },
            ddlconfiguredby: {
                required: true
            }
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
            if (jQuery("#txtbidsubject").val() != null && jQuery("#txtbidsubject").val() != "") {
                subject = jQuery("#txtbidsubject").val()
            }
            if ($('#ddlBidtype option:selected').val() == 7) {
                if ($('#ddlreporttype option:selected').val() == "List" || $('#ddlreporttype').val() == "ListRFQ") {
                    fetchBidVendorSummary(dtfrom, dtto, subject);
                    $('#tblVendorSummary_wrapper').removeClass('hide');
                    $('#tblVendorSummary').removeClass('hide');
                    $('#tblVendorSummarydetails').addClass('hide');
                    $('#tblVendorSummarydetails_wrapper').addClass('hide');
                    $('#tblVendorSummarySUmzation').addClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').addClass('hide');
                }

                else if ($('#ddlreporttype').val() == "SDetail") {
                    fetchBidVendorSummaryDetail(dtfrom, dtto, subject);
                    $('#tblVendorSummary').addClass('hide');
                    $('#tblVendorSummary_wrapper').addClass('hide');
                    $('#tblVendorSummarydetails').removeClass('hide');
                    $('#tblVendorSummarydetails_wrapper').removeClass('hide');
                    $('#tblVendorSummarySUmzation').addClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').addClass('hide');
                }
                else {
                    fetchBidVendorSummarySummarization(dtfrom, dtto, subject);
                    $('#tblVendorSummary').addClass('hide');
                    $('#tblVendorSummary_wrapper').addClass('hide');
                    $('#tblVendorSummarydetails').addClass('hide');
                    $('#tblVendorSummarydetails_wrapper').addClass('hide');
                    $('#tblVendorSummarySUmzation').removeClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').removeClass('hide');
                }
            }
            else {
                if ($('#ddlreporttype option:selected').val() == "List") {
                    fetchBidVendorSummary(dtfrom, dtto, subject);
                    $('#tblVendorSummary_wrapper').removeClass('hide');
                    $('#tblVendorSummary').removeClass('hide');
                    $('#tblVendorSummarydetails').addClass('hide');
                    $('#tblVendorSummarydetails_wrapper').addClass('hide');
                    $('#tblVendorSummarySUmzation').addClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').addClass('hide');
                }
                else if ($('#ddlreporttype').val() == "SDetail") {
                    fetchBidVendorSummaryDetailFA(dtfrom, dtto, subject);
                    $('#tblVendorSummary').addClass('hide');
                    $('#tblVendorSummary_wrapper').addClass('hide');
                    $('#tblVendorSummarydetails').removeClass('hide');
                    $('#tblVendorSummarydetails_wrapper').removeClass('hide');
                    $('#tblVendorSummarySUmzation').addClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').addClass('hide');
                }
                else {
                    fetchBidVendorSummarySummarizationFA(dtfrom, dtto, subject);
                    $('#tblVendorSummary').addClass('hide');
                    $('#tblVendorSummary_wrapper').addClass('hide');
                    $('#tblVendorSummarydetails').addClass('hide');
                    $('#tblVendorSummarydetails_wrapper').addClass('hide');
                    $('#tblVendorSummarySUmzation').removeClass('hide');
                    $('#tblVendorSummarySUmzation_wrapper').removeClass('hide');
                }

            }

        }

    });

}


var BidDate = "";
var result = '';
function fetchBidVendorSummary(dtfrom, dtto, subject) {
    var url = '';

    result = '';
    var BidTypeID = $("#ddlBidtype option:selected").val();
    if (BidTypeID == 7) {
        if (jQuery("#ddlBidFor option:selected").val() == 81) {
            jQuery("#ddlBidFor option:selected").val(0)
        }
    }
    if ($("#ddlconfiguredby").select2('data').length) {
        $.each($("#ddlconfiguredby").select2('data'), function (key, item) {
            result = result + (item.id) + ','

        });
        result = result.slice(0, -1)
    }

    if ($('#ddlreporttype option:selected').val() == "List") {
        //url = sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummary/?BidTypeID=" + jQuery("#ddlBidtype option:selected").val() + "&BidForID=" + jQuery("#ddlBidFor option:selected").val() + "&VendorId=" + jQuery("#hdnVendorID").val() + "&FromDate=" + dtfrom + "&ToDate=" + dtto + "&BidSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val();
        url = sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummary/";
    }
    else {
        //url = sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryRFQ/?BidTypeID=" + jQuery("#ddlBidtype option:selected").val() + "&BidForID=" + jQuery("#ddlBidFor option:selected").val() + "&VendorId=" + jQuery("#hdnVendorID").val() + "&FromDate=" + dtfrom + "&ToDate=" + dtto + "&BidSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val();
        url = sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryRFQ/";
    }

    var Tab1Data = {
        "BidTypeID": parseInt(jQuery("#ddlBidtype option:selected").val()),
        "BidForID": parseInt(jQuery("#ddlBidFor option:selected").val()),
        "VendorId": parseInt(jQuery("#hdnVendorID").val()),
        "FromDate": dtfrom,
        "ToDate": dtto,
        "BidSubject": subject,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ConfiguredBy": result == '' ? '0' : result,
        "FinalStatus": jQuery("#ddlbidstatus option:selected").val(),
        "RFQSubject": subject,
        "UserID": sessionStorage.getItem('UserID')
    };

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: url,
        data: JSON.stringify(Tab1Data),
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            jQuery("#tblVendorSummary").empty();
            //jQuery('#tblVendorSummary').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>Bid Subject</th><th class='bold'>Configured By</th><th class='bold'>Bid Date</th><th class='bold'>Bid Time</th><th class='bold'>Bid Duration</th><th class='bold'>Currency</th><th class='bold'>Bid Status</th></tr></thead>");
            jQuery('#tblVendorSummary').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>Bid Subject</th><th class='bold'>Configured By</th><th class='bold'>Bid Date/Time</th><th class='bold'>Bid Duration</th><th class='bold'>Currency</th><th class='bold'>Bid Status</th></tr></thead>");
            if (BidData.length > 0) {

                for (var i = 0; i < BidData.length; i++) {
                    if ($('#ddlreporttype option:selected').val() == "List") {
                        var str = "<tr><td  class=text-right><a onclick=getSummary(\'" + BidData[i].bidID + "'\,\'" + BidData[i].bidForID + "'\,\'0'\) href='javascript:;' >" + BidData[i].bidID + "</a></td>";
                    }
                    else {

                        var str = "<tr><td  class=text-right><a onclick=getSummary(\'" + BidData[i].bidID + "'\,\'" + BidData[i].bidForID + "'\,\'" + BidData[i].rfqid + "'\) href='javascript:;' >" + BidData[i].bidID + "</a></td>";
                    }

                    str += "<td>" + BidData[i].bidSubject + "</td>";
                    str += "<td>" + BidData[i].configuredBy + "</td>";
                    //var _bidDate = fnConverToLocalTime

                    //var datearray = BidData[i].bidDate.split("/");

                    //BidDate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                    BidDate = fnConverToLocalTime(BidData[i].bidDate);
                    //var _bidTime = moment(BidDate).format('HH:mm');
                    //var _bidTime = fnReturnTimeFromDate(BidDate);

                    str += "<td>" + BidDate + "</td>";

                    //str += "<td class=text-right>" + BidData[i].bidHour + ' : ' + BidData[i].bidMinute + '  ' + BidData[i].ampm + "</td>";
                    //str += "<td class=text-right>" + _bidTime + "</td>";
                    str += "<td class=text-right>" + BidData[i].bidDuartion + "</td>";
                    str += "<td>" + BidData[i].currencyName + "</td>";
                    str += "<td>" + BidData[i].finalStatus + "</td>";

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
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function (data, column, node) {
                                
                                        if (column === 0) {
                                            let text = data.match(/>([^<]+)</)[1];
                                            return parseFloat(text);
                                        }
                                        else {
                                            return data;
                                        }

                                    }

                                }
                            }

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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
}
function fetchBidVendorSummaryDetail(dtfrom, dtto, subject) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (jQuery("#ddlBidFor option:selected").val() == 81) {
        jQuery("#ddlBidFor option:selected").val(0)
    }
    result = '';
    if ($("#ddlconfiguredby").select2('data').length) {
        $.each($("#ddlconfiguredby").select2('data'), function (key, item) {
            result = result + (item.id) + ','

        });
        result = result.slice(0, -1);
    }
    var Tab1Data = {
        "BidTypeID": parseInt(jQuery("#ddlBidtype option:selected").val()),
        "BidForID": parseInt(jQuery("#ddlBidFor option:selected").val()),
        "VendorId": parseInt(jQuery("#hdnVendorID").val()),
        "FromDate": dtfrom,
        "ToDate": dtto,
        "BidSubject": subject,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ConfiguredBy": result == '' ? '0' : result,
        "FinalStatus": jQuery("#ddlbidstatus option:selected").val(),
        "RFQSubject": subject,
        "UserID": sessionStorage.getItem('UserID')
    };

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryDetailed/?BidTypeID=" + jQuery("#ddlBidtype option:selected").val() + "&BidForID=" + jQuery("#ddlBidFor option:selected").val() + "&VendorId=" + jQuery("#hdnVendorID").val() + "&FromDate=" + dtfrom + "&ToDate=" + dtto + "&BidSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val(),
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryDetailed/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab1Data),
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var LastHD = stringDivider("Last Invoice Price (LIP)", 45, "<br/>\n");
            var savinfLIP = stringDivider("Total Saving wrt LIP", 40, "<br/>\n");
            var savinfstart = stringDivider("Total Saving wrt SP",40, "<br/>\n");
            var savinfTR = stringDivider("Total Saving wrt TP", 40, "<br/>\n");
            jQuery("#tblVendorSummarydetails").empty();

            jQuery('#tblVendorSummarydetails').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>Bid Subject</th><th class='bold'>Configured By</th><th class='bold'>Bid Date</th><th class='bold'>Item/Service</th><th class='bold'>Quantity</th><th class='bold'>UOM</th><th class='bold'>Currency</th><th>Vendor</th><th class='bold'>" + LastHD + "</th><th class='bold'>Start Price (SP)</th><th class='bold'>Target Price (TP)</th><th class='bold'>Initial Quote</th><th class='bold'>L1 Price</th><th class='bold'>" + savinfLIP + "</th><th class='bold'>" + savinfstart + "</th><th class='bold'>" + savinfTR + "</th><th>Bid Status</th></tr></thead>");
            if (BidData.length > 0) {
                var bID = 0;

                for (var i = 0; i < BidData.length; i++) {
                    var encrypdata = fnencrypt("BidID=" + BidData[i].bidID + "&BidTypeID=" + BidData[i].bidTypeID + "&BidForID=" + BidData[i].bidForID)

                    var str = "<tr><td class=text-right><a onclick=getSummary(\'" + BidData[i].bidID + "'\,\'" + BidData[i].bidForID + "'\,\'0'\) href='javascript:;' >" + BidData[i].bidID + "</a></td>";

                    str += "<td>" + BidData[i].bidSubject + "</td>";
                    str += "<td>" + BidData[i].configuredBy + "</td>";


                    //datearray = BidData[i].bidDate.split("/");

                    //BidDate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                    BidDate = fnConverToLocalTime(BidData[i].bidDate);

                    str += "<td>" + BidDate + "</td>";



                    var desitinationport = BidData[i].destinationPort.replace(/<br\s*\/?>/gi, ' ');

                    str += "<td>" + desitinationport + "</td>";

                    str += "<td class=text-right>" + thousands_separators(BidData[i].quantity) + "</td>";
                    str += "<td>" + BidData[i].uom + "</td>";
                    str += "<td>" + BidData[i].currencyName + "</td>";
                    str += "<td>" + BidData[i].vendorName + "</td>";

                    ///////////////LIP//////////////////
                    if (BidData[i].lastInvoicePrice != 0) {
                        if (BidData[i].role == "Administrator") {
                            str += '<td class=text-right><a href="javascript:;" style="text-decoration:none" onclick="editLIP(\'' + BidData[i].bidID + '\',\'' + BidData[i].seid + '\',\'' + thousands_separators(BidData[i].lastInvoicePrice) + '\',\'LIP\')"> ' + thousands_separators(BidData[i].lastInvoicePrice) + '</a></td>';
                        }
                        else {
                            str += "<td class=text-right>" + thousands_separators(BidData[i].lastInvoicePrice) + "</td>";
                        }

                    }
                    else {
                        str += '<td class=text-right><a href="javascript:;" style="text-decoration:none" onclick="editLIP(\'' + BidData[i].bidID + '\',\'' + BidData[i].seid + '\',\'' + 0 + '\',\'LIP\')"> ' + 0 + '</a></td>';
                    }


                    ///////////////LIP//////////////////
                    str += "<td class=text-right>" + thousands_separators(BidData[i].startPrice) + "</td>";

                    if (BidData[i].targetprice != 0) {
                        if (BidData[i].role == "Administrator") {
                            str += '<td class=text-right><a href="javascript:;" style="text-decoration:none" onclick="editLIP(\'' + BidData[i].bidID + '\',\'' + BidData[i].seid + '\',\'' + thousands_separators(BidData[i].targetprice) + '\',\'TP\')"> ' + thousands_separators(BidData[i].targetprice) + '</a></td>';
                        }
                        else {
                            str += "<td class=text-right>" + thousands_separators(BidData[i].targetprice) + "</td>";
                        }
                    }
                    else {
                        str += '<td class=text-right><a href="javascript:;" style="text-decoration:none" onclick="editLIP(\'' + BidData[i].bidID + '\',\'' + BidData[i].seid + '\',\'' + 0 + '\',\'TP\')"> ' + 0 + '</a></td>';
                    }

                    str += "<td class=text-right>" + thousands_separators(BidData[i].initialQuote) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].minPrice) + "</td>";
                    if (BidData[i].lastInvoicePrice != 0) {

                        str += "<td class=text-right>" + thousands_separators(((BidData[i].lastInvoicePrice - BidData[i].minPrice) * BidData[i].quantity).round(2)) + "</td>"
                    }
                    else {

                        str += '<td class=text-right>' + 0 + '</td>';
                    }


                    str += "<td class=text-right>" + thousands_separators(((BidData[i].startPrice - BidData[i].minPrice) * BidData[i].quantity).round(2)) + "</td>";
                    if (BidData[i].targetprice != 0) {
                        str += "<td class=text-right>" + thousands_separators(((BidData[i].targetprice - BidData[i].minPrice) * BidData[i].quantity).round(2)) + "</td>";
                    }
                    else {
                        str += "<td class=text-right>" + 0 + "</td>";
                    }
                    str += "<td>" + BidData[i].finalStatus + "</td>";
                    str += "</tr>";
                    jQuery('#tblVendorSummarydetails').append(str);
                }
                var table = $('#tblVendorSummarydetails');
                table.removeAttr('width').dataTable({
                    "bDestroy": true,
                    responsive: false,


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
                                    body: function (data, column, node) {
                                        if (column === 4) {
                                            return column === 4 ? data.replace(/[$,.]/g, '') : data.replace(/(&nbsp;|<([^>]+)>)/ig, "");
                                            data.replace(/<br\s*\/?>/ig, "\r\n");
                                            data;
                                        }
                                        else if (column === 9 || column === 11 || column === 0) {                                           
                                            let text = data.match(/>([^<]+)</)[1];
                                            return parseFloat(text);
                                        }
                                        else if (column === 5 || column === 10 || (column >= 12 && column <= 16)) {                                          
                                            let text =removeThousandSeperator(data) ;
                                            return parseFloat(text);
                                        } 
                                        else {
                                            return data;
                                        }
                                        
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
                jQuery('#tblVendorSummarydetails > tbody').append("<tr><td colspan='17' style='text-align: center; color:red;'>No record found</td></tr>");
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
            jQuery.unblockUI();
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
function fetchBidVendorSummarySummarization(dtfrom, dtto, subject) {
    result = '';
    if (jQuery("#ddlBidFor option:selected").val() == 81) {
        jQuery("#ddlBidFor option:selected").val(0)
    }
    if ($("#ddlconfiguredby").select2('data').length) {
        $.each($("#ddlconfiguredby").select2('data'), function (key, item) {
            result = result + (item.id) + ','

        });
        result = result.slice(0, -1);
    }

    var Tab1Data = {
        "BidTypeID": parseInt(jQuery("#ddlBidtype option:selected").val()),
        "BidForID": parseInt(jQuery("#ddlBidFor option:selected").val()),
        "VendorId": parseInt(jQuery("#hdnVendorID").val()),
        "FromDate": dtfrom,
        "ToDate": dtto,
        "BidSubject": subject,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ConfiguredBy": result == '' ? '0' : result,
        "FinalStatus": jQuery("#ddlbidstatus option:selected").val(),
        "RFQSubject": subject,
        "UserID": sessionStorage.getItem('UserID')
    };
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryfull/?BidTypeID=" + jQuery("#ddlBidtype option:selected").val() + "&BidForID=" + jQuery("#ddlBidFor option:selected").val() + "&VendorId=" + jQuery("#hdnVendorID").val() + "&FromDate=" + dtfrom + "&ToDate=" + dtto + "&BidSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val(),
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryfull/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab1Data),
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var BidLIP = stringDivider("Bid Value as per Last Invoice Price(LIP)", 45, "<br/>\n");
            var BidSP = stringDivider("Bid Value at Start Price(SP)", 45, "<br/>\n");
            var BidTP = stringDivider("Bid Value at Target Price(TP)", 45, "<br/>\n");
            var BidFinal = stringDivider("Bid Value as per L1", 45, "<br/>\n");
            var savinfLIP = stringDivider("Total Saving wrt LIP", 40, "<br/>\n");
            var savinfstart = stringDivider("Total Saving wrt SP", 40, "<br/>\n");
            var savinfTR = stringDivider("Total Saving wrt TP", 40, "<br/>\n");
            jQuery("#tblVendorSummarySUmzation").empty();

            jQuery('#tblVendorSummarySUmzation').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>Bid Subject</th><th class='bold'>Configured By</th><th class='bold'>Bid Date</th><th class='bold'>Currency</th><th class='bold'>" + BidLIP + "</th><th class='bold'>" + BidSP + "</th><th class='bold'>" + BidTP + "</th><th class='bold'>" + BidFinal + "</th><th class='bold'>" + savinfLIP + "</th><th class='bold'>" + savinfstart + "</th><th class='bold'>" + savinfTR + "</th></tr></thead>");
            if (BidData.length > 0) {
                var bID = 0;
                for (var i = 0; i < BidData.length; i++) {

                    var str = "<tr><td class=text-right><a onclick=getSummary(\'" + BidData[i].bidID + "'\,\'" + BidData[i].bidForID + "'\,\'0'\) href='javascript:;' >" + BidData[i].bidID + "</a></td>";
                    str += "<td>" + BidData[i].bidSubject + "</td>";
                    str += "<td>" + BidData[i].configuredBy + "</td>";

                    //var datearray = BidData[i].bidDate.split("/");

                    //BidDate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                    BidDate = fnConverToLocalTime(BidData[i].bidDate);

                    str += "<td>" + BidDate + "</td>";

                    str += "<td>" + BidData[i].currencyName + "</td>";


                    str += "<td class=text-right>" + thousands_separators(BidData[i].bidValueAsLIP) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].bidValueAsStartPrice) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].bidValueAsTargetPrice) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].bidValueAsPrice) + "</td>";

                    if (BidData[i].bidValueAsLIP != 0) {

                        str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsLIP - BidData[i].bidValueAsPrice).round(2)) + "</td>"
                    }
                    else {
                        str += "<td class=text-right>" + 0 + "</td>"
                    }


                    str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsStartPrice - BidData[i].bidValueAsPrice).round(2)) + "</td>";
                    if (BidData[i].bidValueAsTargetPrice != 0) {

                        str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsTargetPrice - BidData[i].bidValueAsPrice).round(2)) + "</td>";
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
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function (data, column, node) {
                                     
                                        if (column >= 5 && column <= 11) {
                                            let text = removeThousandSeperator(data);
                                            return parseFloat(text);
                                        }
                                        else if (column === 0) {
                                            let text = data.match(/>([^<]+)</)[1];
                                            return parseFloat(text);
                                        }
                                        else {
                                            return data;
                                        }

                                    }

                                }
                            },

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
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })

}
function fetchBidVendorSummaryDetailFA(dtfrom, dtto, subject) {
    result = '';
    if ($("#ddlconfiguredby").select2('data').length) {
        $.each($("#ddlconfiguredby").select2('data'), function (key, item) {
            result = result + (item.id) + ','

        });
        result = result.slice(0, -1);
    }
    var Tab1Data = {
        "BidTypeID": parseInt(jQuery("#ddlBidtype option:selected").val()),
        "BidForID": parseInt(jQuery("#ddlBidFor option:selected").val()),
        "VendorId": parseInt(jQuery("#hdnVendorID").val()),
        "FromDate": dtfrom,
        "ToDate": dtto,
        "BidSubject": subject,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ConfiguredBy": result == '' ? '0' : result,
        "FinalStatus": jQuery("#ddlbidstatus option:selected").val(),
        "RFQSubject": subject,
        "UserID": sessionStorage.getItem('UserID')
    };

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryDetailedFA/?BidTypeID=" + jQuery("#ddlBidtype option:selected").val() + "&BidForID=" + jQuery("#ddlBidFor option:selected").val() + "&VendorId=" + jQuery("#hdnVendorID").val() + "&FromDate=" + dtfrom + "&ToDate=" + dtto + "&BidSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val(),
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryDetailedFA/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab1Data),
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {


            var PriceFor = "";
            var LastHD = stringDivider("Last Invoice Price (LIP)", 45, "<br/>\n");
            var savinfLIP = stringDivider("Total Saving wrt LIP", 40, "<br/>\n");
            var savinfTR = stringDivider("Total Saving wrt TP", 40, "<br/>\n");


            if (jQuery("#ddlBidFor option:selected").val() == "81" || jQuery("#ddlBidFor option:selected").val() == "83") {

                PriceFor = 'H1 Price';
                var savinfstart = stringDivider("Total Saving wrt SP", 40, "<br/>\n");
                var startPrice = 'Start Price (SP)'
            }
            else {
                PriceFor = 'L1 Price';
                var savinfstart = stringDivider("Total Saving wrt CP", 12, "<br/>\n");
                var startPrice = 'Ceiling/ Max. Price (CP)'
            }


            jQuery("#tblVendorSummarydetails").empty();



            // jQuery("#tblVendorSummarydetails >tbody").empty();

            jQuery('#tblVendorSummarydetails').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>Bid Subject</th><th class='bold'>Configured By</th><th class='bold'>Bid Date</th><th class='bold'>Item/Product</th><th class='bold'>Quantity</th><th class='bold'>UOM</th><th class='bold'>Currency</th><th>Vendor</th><th class='bold'>" + LastHD + "</th><th class='bold'>" + startPrice + "</th><th class='bold'>Target Price (TP)</th><th class='bold'>Initial Quote</th><th class='bold'>" + PriceFor + "</th><th class='bold'>" + savinfLIP + "</th><th class='bold'>" + savinfstart + "</th><th class='bold'>" + savinfTR + "</th><th>Bid Status</th></tr></thead>");
            if (BidData.length > 0) {
                var bID = 0;
                for (var i = 0; i < BidData.length; i++) {

                    var str = "<tr><td class=text-right><a onclick=getSummary(\'" + BidData[i].bidID + "'\,\'" + BidData[i].bidForID + "'\,\'0'\) href='javascript:;'>" + BidData[i].bidID + "</a></td>";
                    str += "<td>" + BidData[i].bidSubject + "</td>";
                    str += "<td>" + BidData[i].configuredBy + "</td>";


                    //var datearray = BidData[i].bidDate.split("/");

                    //BidDate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                    BidDate = fnConverToLocalTime(BidData[i].bidDate);

                    str += "<td>" + BidDate + "</td>";

                    var desitinationport = BidData[i].destinationPort.replace(/<br\s*\/?>/gi, ' '); //remove br
                    str += "<td>" + desitinationport + "</td>";

                    str += "<td class=text-right>" + thousands_separators(BidData[i].quantity) + "</td>";
                    str += "<td>" + BidData[i].uom + "</td>";
                    str += "<td>" + BidData[i].currencyName + "</td>";
                    str += "<td>" + BidData[i].vendorName + "</td>";

                    if (BidData[i].lastInvoicePrice != 0) {
                        if (BidData[i].role == "Administrator") {
                            str += '<td class=text-right><a href="javascript:;" style="text-decoration:none" onclick="editLIP(\'' + BidData[i].bidID + '\',\'' + BidData[i].seid + '\',\'' + thousands_separators(BidData[i].lastInvoicePrice) + '\',\'LIP\')"> ' + thousands_separators(BidData[i].lastInvoicePrice) + '</a></td>';
                        }
                        else {
                            str += "<td class=text-right>" + thousands_separators(BidData[i].lastInvoicePrice) + "</td>";
                        }

                    }
                    else {
                        str += '<td class=text-right><a href="javascript:;" style="text-decoration:none" onclick="editLIP(\'' + BidData[i].bidID + '\',\'' + BidData[i].seid + '\',\'' + 0 + '\',\'LIP\')"> ' + 0 + '</a></td>';
                    }

                    str += "<td class=text-right>" + thousands_separators(BidData[i].startPrice) + "</td>";

                    if (BidData[i].targetprice != 0) {
                        if (BidData[i].role == "Administrator") {
                            str += '<td class=text-right><a href="javascript:;" style="text-decoration:none" onclick="editLIP(\'' + BidData[i].bidID + '\',\'' + BidData[i].seid + '\',\'' + thousands_separators(BidData[i].targetprice) + '\',\'TP\')"> ' + thousands_separators(BidData[i].targetprice) + '</a></td>';
                        }
                        else {
                            str += "<td class=text-right>" + thousands_separators(BidData[i].targetprice) + "</td>";
                        }
                    }
                    else {
                        str += '<td class=text-right><a href="javascript:;" style="text-decoration:none" onclick="editLIP(\'' + BidData[i].bidID + '\',\'' + BidData[i].seid + '\',\'' + 0 + '\',\'TP\')"> ' + 0 + '</a></td>';
                    }
                    str += "<td class=text-right>" + thousands_separators(BidData[i].initialQuote) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].minPrice) + "</td>";

                    if (jQuery("#ddlBidFor option:selected").val() == "81" || jQuery("#ddlBidFor option:selected").val() == "83") {
                        if (BidData[i].lastInvoicePrice != 0) {

                            str += "<td class=text-right>" + thousands_separators(((BidData[i].minPrice - BidData[i].lastInvoicePrice) * BidData[i].quantity).round(2)) + "</td>"
                        }
                        else {
                            str += "<td class=text-right>" + 0 + "</td>"
                        }


                        str += "<td class=text-right>" + thousands_separators(((BidData[i].minPrice - BidData[i].startPrice) * BidData[i].quantity).round(2)) + "</td>";
                        if (BidData[i].targetprice != 0) {
                            str += "<td class=text-right>" + thousands_separators(((BidData[i].minPrice - BidData[i].targetprice) * BidData[i].quantity).round(2)) + "</td>";
                        }
                        else {
                            str += "<td class=text-right>" + 0 + "</td>";
                        }
                    }
                    else {
                        if (BidData[i].lastInvoicePrice != 0) {

                            str += "<td class=text-right>" + thousands_separators(((BidData[i].lastInvoicePrice - BidData[i].minPrice) * BidData[i].quantity).round(2)) + "</td>"
                        }
                        else {
                            str += "<td class=text-right>" + 0 + "</td>"
                        }


                        str += "<td class=text-right>" + thousands_separators(((BidData[i].startPrice - BidData[i].minPrice) * BidData[i].quantity).round(2)) + "</td>";
                        if (BidData[i].targetprice != 0) {
                            str += "<td class=text-right>" + thousands_separators(((BidData[i].targetprice - BidData[i].minPrice) * BidData[i].quantity).round(2)) + "</td>";
                        }
                        else {
                            str += "<td class=text-right>" + 0 + "</td>";
                        }

                    }
                    str += "<td>" + BidData[i].finalStatus + "</td>";
                    str += "</tr>";
                    jQuery('#tblVendorSummarydetails').append(str);
                }
                var table = $('#tblVendorSummarydetails');
                table.removeAttr('width').dataTable({
                    "bDestroy": true,
                    "oLanguage": { "sSearch": "", "sLengthMenu": "\_MENU_" },
                    fixedColumns: false,
                    "bAutoWidth": false,
                    "aaSorting": [[0, 'asc']],
                    //"bPaginate": true,

                    //"sPaginationType": "full_numbers",<'col-xs-1'l>
                    "iDisplayLength": 10,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    dom: 'Bfrtip',
                    buttons: [
                        'pageLength',
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i> Excel',
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function (data, column, node) {
                                        
                                        if (column === 5 || column === 10 || (column >= 12 && column <= 16)) {
                                            let text = removeThousandSeperator(data);
                                            return parseFloat(text);
                                        }
                                        else if (column === 0 || column === 9 || column === 11) {
                                            let text = data.match(/>([^<]+)</)[1];
                                            return parseFloat(text);
                                        }
                                        else {
                                            return data;
                                        }

                                    }

                                }
                            },
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
                var head_item = table.api().columns(13).header();
                $(head_item).html(PriceFor);

                var head_itemSP = table.api().columns(10).header();
                $(head_itemSP).html(startPrice);

                var head_itemsavingSP = table.api().columns(15).header();
                $(head_itemsavingSP).html(savinfstart);

                var tableWrapper = $('#tblVendorSummarydetails_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper

            }
            else {
                jQuery('#tblVendorSummarydetails > tbody').append("<tr><td colspan='17' style='text-align: center; color:red;'>No record found</td></tr>");
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
function fetchBidVendorSummarySummarizationFA(dtfrom, dtto, subject) {
    result = '';
    if ($("#ddlconfiguredby").select2('data').length) {
        $.each($("#ddlconfiguredby").select2('data'), function (key, item) {
            result = result + (item.id) + ','

        });
        result = result.slice(0, -1);
    }

    var Tab1Data = {
        "BidTypeID": parseInt(jQuery("#ddlBidtype option:selected").val()),
        "BidForID": parseInt(jQuery("#ddlBidFor option:selected").val()),
        "VendorId": parseInt(jQuery("#hdnVendorID").val()),
        "FromDate": dtfrom,
        "ToDate": dtto,
        "BidSubject": subject,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ConfiguredBy": result == '' ? '0' : result,
        "FinalStatus": jQuery("#ddlbidstatus option:selected").val(),
        "RFQSubject": subject,
        "UserID": sessionStorage.getItem('UserID')
    };
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryfullFA/?BidTypeID=" + jQuery("#ddlBidtype option:selected").val() + "&BidForID=" + jQuery("#ddlBidFor option:selected").val() + "&VendorId=" + jQuery("#hdnVendorID").val() + "&FromDate=" + dtfrom + "&ToDate=" + dtto + "&BidSubject=" + subject + "&FinalStatus=" + jQuery("#ddlbidstatus option:selected").val() + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&ConfiguredBy=" + jQuery("#ddlconfiguredby option:selected").val(),
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchAdminBidSummaryfullFA/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Tab1Data),
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var BidLIP = stringDivider("Bid Value as per Last Invoice Price(LIP)", 45, "<br/>\n");

            var BidTP = stringDivider("Bid Value at Target Price(TP)", 45, "<br/>\n");
            var BidFinal = stringDivider("Bid Value as per L1", 45, "<br/>\n");
            var savinfLIP = stringDivider("Total Saving wrt LIP", 40, "<br/>\n");

            var savinfTR = stringDivider("Total Saving wrt TP", 40, "<br/>\n");

            if (jQuery("#ddlBidFor option:selected").val() == "81" || jQuery("#ddlBidFor option:selected").val() == "83") {

                var BidFinal = stringDivider("Bid Value as per H1", 40, "<br/>\n");
                var BidSP = stringDivider("Bid Value at Start Price(SP)",40, "<br/>\n");
                var savinfstart = stringDivider("Total Saving wrt SP",40, "<br/>\n");
            }
            else {
                var BidFinal = stringDivider("Bid Value as per L1", 45, "<br/>\n");
                var BidSP = stringDivider("Bid Value at Ceiling/ Max. Price(CP)", 45, "<br/>\n");
                var savinfstart = stringDivider("Total Saving wrt CP", 40, "<br/>\n");
            }

            jQuery("#tblVendorSummarySUmzation").empty();

            jQuery('#tblVendorSummarySUmzation').append("<thead><tr><th class='bold'>Event ID</th><th class='bold'>Bid Subject</th><th class='bold'>Configured By</th><th class='bold'>Bid Date</th><th class='bold'>Currency</th><th class='bold'>" + BidLIP + "</th><th class='bold'>" + BidSP + "</th><th class='bold'>" + BidTP + "</th><th class='bold'>" + BidFinal + "</th><th class='bold'>" + savinfLIP + "</th><th class='bold'>" + savinfstart + "</th><th class='bold'>" + savinfTR + "</th></tr></thead>");
            if (BidData.length > 0) {
                var bID = 0;
                for (var i = 0; i < BidData.length; i++) {

                    var str = "<tr><td class=text-right><a onclick=getSummary(\'" + BidData[i].bidID + "'\,\'" + BidData[i].bidForID + "'\,\'0'\) href='javascript:;'>" + BidData[i].bidID + "</a></td>";
                    str += "<td>" + BidData[i].bidSubject + "</td>";
                    str += "<td>" + BidData[i].configuredBy + "</td>";


                    //var datearray = BidData[i].bidDate.split("/");

                    //BidDate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                    BidDate = fnConverToLocalTime(BidData[i].bidDate);

                    str += "<td>" + BidDate + "</td>";

                    str += "<td>" + BidData[i].currencyName + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].bidValueAsLIP) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].bidValueAsStartPrice) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].bidValueAsTargetPrice) + "</td>";
                    str += "<td class=text-right>" + thousands_separators(BidData[i].bidValueAsPrice) + "</td>";
                    if (jQuery("#ddlBidFor option:selected").val() == "81" || jQuery("#ddlBidFor option:selected").val() == "83") {
                        if (BidData[i].bidValueAsLIP != 0) {
                            var _wrtSP = BidData[i].bidValueAsPrice - BidData[i].bidValueAsLIP
                            if (_wrtSP < 0) {
                                _wrtSP = 0
                            }

                            //str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsPrice - BidData[i].bidValueAsLIP).round(2)) + "</td>"
                            str += "<td class=text-right>" + thousands_separators((_wrtSP).round(2)) + "</td>"
                        }
                        else {
                            str += "<td class=text-right>" + 0 + "</td>"
                        }
                        var _wrtSP1 = BidData[i].bidValueAsPrice - BidData[i].bidValueAsStartPrice
                        if (_wrtSP1 < 0) {
                            _wrtSP1 = 0
                        }

                        //str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsPrice - BidData[i].bidValueAsStartPrice).round(2)) + "</td>";
                        str += "<td class=text-right>" + thousands_separators((_wrtSP1).round(2)) + "</td>";
                        if (BidData[i].bidValueAsTargetPrice != 0) {
                            var _wrtSP2 = BidData[i].bidValueAsPrice - BidData[i].bidValueAsTargetPrice
                            if (_wrtSP2 < 0) {
                                _wrtSP2 = 0
                            }

                            //str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsPrice - BidData[i].bidValueAsTargetPrice).round(2)) + "</td>";
                            str += "<td class=text-right>" + thousands_separators((_wrtSP2).round(2)) + "</td>";
                        }
                        else {
                            str += "<td class=text-right>" + 0 + "</td>"
                        }
                    }
                    else {
                        if (BidData[i].bidValueAsLIP != 0) {
                            var _wrtSP3 = BidData[i].bidValueAsLIP - BidData[i].bidValueAsPrice
                            if (_wrtSP3 < 0) {
                                _wrtSP3 = 0
                            }

                            //str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsLIP - BidData[i].bidValueAsPrice).round(2)) + "</td>"
                            str += "<td class=text-right>" + thousands_separators((_wrtSP3).round(2)) + "</td>"
                        }
                        else {
                            str += "<td class=text-right>" + 0 + "</td>"
                        }
                        var _wrtSP4 = BidData[i].bidValueAsStartPrice - BidData[i].bidValueAsPrice
                        if (_wrtSP4 < 0) {
                            _wrtSP4 = 0
                        }

                        //str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsStartPrice - BidData[i].bidValueAsPrice).round(2)) + "</td>";
                        str += "<td class=text-right>" + thousands_separators((_wrtSP4).round(2)) + "</td>";
                        if (BidData[i].bidValueAsTargetPrice != 0) {
                            var _wrtSP5 = BidData[i].bidValueAsTargetPrice - BidData[i].bidValueAsPrice
                            if (_wrtSP5 < 0) {
                                _wrtSP5 = 0
                            }

                            //str += "<td class=text-right>" + thousands_separators((BidData[i].bidValueAsTargetPrice - BidData[i].bidValueAsPrice).round(2)) + "</td>";
                            str += "<td class=text-right>" + thousands_separators((_wrtSP5).round(2)) + "</td>";
                        }
                        else {
                            str += "<td class=text-right>" + 0 + "</td>"
                        }

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
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function (data, column, node) {
                                  
                                        if ((column >= 5 && column <= 11)) {
                                            let text = removeThousandSeperator(data);
                                            return parseFloat(text);
                                        }
                                        else if (column === 0) {
                                            let text = data.match(/>([^<]+)</)[1];
                                            return parseFloat(text);
                                        }                                       
                                        else {
                                            return data;
                                        }

                                    }

                                }
                            },
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
                var head_item = table.api().columns(8).header();
                $(head_item).html(BidFinal);
                var head_itemCP = table.api().columns(6).header();
                $(head_itemCP).html(BidSP);
                var head_itemsavingCP = table.api().columns(10).header();
                $(head_itemsavingCP).html(savinfstart);
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
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })

}
function getSummary(bidid, bidforid, RFQID) {

    if (RFQID == 0) {
        var encrypdata = fnencrypt("BidID=" + bidid + "&BidTypeID=" + jQuery("#ddlBidtype option:selected").val() + "&BidForID=" + bidforid)
        window.open("BidSummary.html?param=" + encrypdata, "_blank")

    }
    else {
        var encrypdata = fnencrypt("RFQID=" + RFQID + "&BidID=" + bidid)
        window.open("eRARFQReport.html?param=" + encrypdata, "_blank")

    }
}


function editLIP(bidid, seid, price, fieldName) {

    if (fieldName == "TP") {
        $('#lblfieldName').html("Target Price <span class='required'>*</span>")
    }
    else {
        $('#lblfieldName').html("Last Invoice Price <span class='required'>*</span>")
    }
    $('#txtlastinvoiceprice').val(price)
    $('#hddfieldName').val(fieldName);
    $('#hddnBidID').val(bidid);
    $('#hddnItemID').val(seid);

    $("#editLastInvoiceprice").modal("show")
}
var error = $('#msgErrorEditEvent');
function updlastinvoiceprice() {

    if ($('#txtlastinvoiceprice').val() == "") {//|| $('#txtlastinvoiceprice').val()==0
        error.find("span").html('Please Enter Last Invoice Price value.');
        error.show();
        Metronic.scrollTo(error, -200);
        error.fadeOut(3000);
        return false;

    }
    var Data = {
        "BidTypeID": parseInt(jQuery("#ddlBidtype option:selected").val()),
        "BidID": parseInt($('#hddnBidID').val()),
        "ItemID": parseInt($("#hddnItemID").val()),
        "LastInvoicePrice": parseFloat(removeThousandSeperator($('#txtlastinvoiceprice').val())),
        "For": $('#hddfieldName').val()

    }


    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/UpdateLastInvoicePrice/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            if (data == "1") {

                if (jQuery("#ddlBidtype option:selected").val() == 7) {
                    fetchBidVendorSummaryDetail('', '', 'X-X');
                }
                else {
                    fetchBidVendorSummaryDetailFA('', '', 'X-X');
                }
                $("#editLastInvoiceprice").modal("hide")

            }

            jQuery.unblockUI();
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
$('#editLastInvoiceprice').on("hidden.bs.modal", function () {
    $('#txtlastinvoiceprice').val('')
    $('#hddnBidID').val(0),
        $("#hddnItemID").val(0),

        $('#hddfieldName').val('')
})
$('.datepicker .datepicker-dropdown').css("left", "1000px");
jQuery("#search").keyup(function () {

    jQuery("#tblvendorlist tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblvendorlist tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tblvendorlist tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});
function FetchVenderNotInvited() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/fetchBidsAuto/?UserID=x&BidID=" + BidID + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#tblvendorlist > tbody").empty();
            if (data.length > 0) {
                $('#inviteVendorBody').show();
                for (var i = 0; i < data.length; i++) {
                    var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input class=\"chkboxwithval\"  type=\"checkbox\" Onclick=\"Check(this)\"; id=\"chkvender\" value=" + (data[i].vendorID + ',' + data[i].emailId) + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].vendorName + " </td></tr>";
                    jQuery('#tblvendorlist > tbody').append(str);
                }
            }
            else {
                $('#inviteVendorBody').hide();
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

$("#chkAll").click(function () {
    if ($("#chkAll").is(':checked') == true) {

        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
        });
    }
    else {
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").removeClass("checked");
        });
    }
});

function Check(event) {
    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")
    }
    else {
        $(event).closest("span#spanchecked").addClass("checked")
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
    }
}

function ValidateVendor() {
    var status = "false";


    $("#tblvendorlist> tbody > tr").each(function (index) {
        if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            status = "True";
        }
    });
    if (status == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('Please select at least one vendor');
        $('.alert-danger').fadeOut(5000);
        Metronic.scrollTo($('.alert-danger'), -200);

        status = "false";
    }
    return status;
}

function invitevendors() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (BidID == null || BidID == '') {
        $('.alert-danger').show();
        $('#spandanger').html('Cannot invite vendors without Bid...');
        $('.alert-danger').fadeOut(5000);
        Metronic.scrollTo($('.alert-danger'), -200);
        jQuery.unblockUI();
        return false;

    }
    else if (ValidateVendor() == 'false') {
        jQuery.unblockUI();
        return false;

    }
    else {
        var checkedValue = '';
        var temp = new Array();
        $("#tblvendorlist> tbody > tr").each(function (index) {
            if ($(this).find("span#spanchecked").attr('class') == 'checked') {
                temp = ($(this).find("#chkvender").val()).split(",");
                checkedValue = checkedValue + temp[0] + '#';
            }
        });


        var data = {
            "QueryString": checkedValue,
            "BidId": parseInt(BidID),
            "BidTypeID": parseInt(BidTypeID),
            "UserID": sessionStorage.getItem("UserID")
        }
        //console.log(JSON.stringify(data))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/Invitevendors",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {

                $('.alert-success').show();
                $('#spansuccess1').html('Vendor Invited Successfully..');
                FetchVenderNotInvited();
                $('.alert-success').fadeOut(5000);
                Metronic.scrollTo($('.alert-success'), -200);
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
                return false;
                jQuery.unblockUI();
            }
        });
        jQuery.unblockUI();
        return true;
    }
}