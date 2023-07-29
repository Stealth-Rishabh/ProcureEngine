
let hdneventid = 0;

debugger


$(document).ready(function () {
    debugger


    formvalidate()
    if (window.location.search) {

        const url = window.location.href;
        const params = new URLSearchParams(url.split('?')[1]);
        const eventId = params.get('EventId');
        let eventType = params.get('EventType');
        if (eventType == 'eRFQc' || eventType == 'eRFQ' || eventType == 'RFQ' || eventType == 'eRFQv' || eventType == 'eRFQs') {
            eventType = 'RFQ'
        }
        else {
            eventType = 'NFA'
        }
        $('#ddlEventtype').val(eventType).trigger('change');
        hdneventid = eventId;

        fetchAllMessages()

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


});



//communication hub

//form validation for communication hub
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

            fetchAllMessages();

        }

    });

}



//event type typehead

jQuery("#txteventsubject").typeahead({
    source: function (query, process) {

        var alleventdata = ''
        if ($('#ddlEventtype').val() == 'RFQ' || $('#ddlEventtype').val() == 'NFA') {
            alleventdata = sessionStorage.getItem('hdnAllRFQNFA');
        }

        usernames = [];
        map = {};
        var username = "";
        if (alleventdata) {

            jQuery.each(jQuery.parseJSON(alleventdata), function (i, username) {
                map[username.RFQSubject] = username;
                usernames.push(username.RFQSubject);
            });

            process(usernames);
        }

    },
    minLength: 2,
    updater: function (item) {

        if ($('#ddlEventtype').val() == 'RFQ' || $('#ddlEventtype').val() == 'NFA') {
            if (map[item].RFQID != "0") {
                //sessionStorage.setItem('hdneventID', map[item].RFQID);
                hdneventid = map[item].RFQID;
            }
        }



        return StringDecodingMechanism(item); // abheedev 28/12/2022
    }

});
jQuery("#txteventsubject").keyup(function () {

    /*sessionStorage.setItem('hdnbid', '0');
    sessionStorage.setItem("hdnbidtypeid", '0')
    $('#ddlrfq').val(0)*/

});



let CEventType = '';

function fetchAllRFQNFA() {


    let urllink = apiURL + "Comm/fetchAllRFQNFA/?Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&EventType=" + CEventType + "&CustomerID=" + sessionStorage.getItem('CustomerID');
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: urllink,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            let Data = jQuery.parseJSON(data[0].jsondata) || '';
            if (Data.length > 0) {

                sessionStorage.setItem('hdnAllRFQNFA', JSON.stringify(Data));

            }
            else {


                alertforerror(`No Open ${CEventType} for which you can invite vendors.!`)

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

            return false;

        }
    });
}

$('#ddlEventtype').on('change', function (e) {

    if ($('#ddlEventtype option:selected').val() == 'RFQ') {
        CEventType = 'eRFQ';
        $('#txteventsubject').val('');
        fetchAllRFQNFA()
    }
    else if ($('#ddlEventtype option:selected').val() == 'NFA') {
        CEventType = 'NFA';
        $('#txteventsubject').val('');
        fetchAllRFQNFA()
    }

});


//for fetching all messages on submission


function fetchAllMessages() {

    let _EventID = hdneventid;
    let _EventType = $('#ddlEventtype').val() || 'All';
    let _UserType = sessionStorage.getItem('UserType');
    let dtfrom = '', dtto = '';
    let _SearchText = '';
    let _ConfiguredBy = '';



    if ($("#txtFromDate").val() == null || $("#txtFromDate").val() == '') {


        dtfrom = new Date(2000, 01, 01);

    }
    else {
        var dateParts = $("#txtFromDate").val().split("/");
        dtfrom = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    }

    if ($("#txtToDate").val() == null || $("#txtToDate").val() == '') {

        dtto = null;

    }
    else {
        var dateParts = $("#txtToDate").val().split("/");
        dtto = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        dtto.setDate(dtto.getDate() + 1);
    }

    if ($("#ddlconfiguredby").select2('data').length) {
        $.each($("#ddlconfiguredby").select2('data'), function (key, item) {
            _ConfiguredBy = _ConfiguredBy + (item.id) + ','

        });

        _ConfiguredBy = _ConfiguredBy.slice(0, -1)
    }


    let Cdata = {
        "UserId": sessionStorage.getItem('UserID'),
        "EventId": _EventID,
        "EventType": _EventType,
        "UserType": _UserType,
        "FromDate": dtfrom,
        "ToDate": dtto,
        "SearchText": _SearchText,
        "page": '0',
        "ConfiguredBy": _ConfiguredBy,
        "CustomerID": sessionStorage.getItem('CustomerID')
    }
    debugger
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    let urllink = apiURL + "Comm/fetchAllMessages";
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: urllink,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(Cdata),
        cache: false,
        dataType: "json",
        success: function (data) {
            debugger
            console.log("data", data);
            let Data = ''
            if (data.length > 0) {
                if (data[0].jsondata != null) {
                    Data = jQuery.parseJSON(data[0].jsondata);
                }
            }
            else {
                Data = '';
            }
            jQuery("#tblCommunicationSummary").empty();
            jQuery("#tblCommunicationSummary").append(`<thead></thead><tbody></tbody>`);

            jQuery('#tblCommunicationSummary>thead').append(`<tr><th class='bold hide'>Thread ID</th><th class='bold'>Event Subject</th><th class='bold'>Configured By</th><th class='bold'>Thread Date/Time</th><th class='bold'>Event Type</th></tr>`);


            if (Data.length > 0) {
                for (let i = 0; i < Data.length; i++) {
                    jQuery('#tblCommunicationSummary>tbody').append(`<tr><td class='hide'>${Data[i].QueryId}</td><td><a onclick="getCommunication('${Data[i].Link}')"  href="javascript:;">${Data[i].EventName} </a></td><td>${Data[i].UserName}</td><td>${fnConverToLocalTime(`${Data[i].CreatedDate}`)}</td><td>${Data[i].EventType}</td></tr>`);
                }

                var table = $('#tblCommunicationSummary');
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
                var tableWrapper = $('#tblCommunicationSummary_wrapper');


            }
            else {
                jQuery('#tblCommunicationSummary>tbody').append(`<tr><td colspan=5 style='text-align: center; color:red;'>No Record Found</td></tr>`);

                alertforerror('No  Communication thread for given event.!')


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


function getCommunication(url) {
    window.open(url, "_blank")
}


