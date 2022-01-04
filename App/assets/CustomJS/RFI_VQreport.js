function fetchRFIRFQSubjectforReport(subjectFor) {
    if (subjectFor == 'RFI') {
        $('#lblsbjct').html('Select RFI');
    }
   
    else {
        $('#lblsbjct').html('Select VQ');
    }
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/FetchRfiVQSubjectForReport/?SubjectFor=" + subjectFor + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            sessionStorage.setItem('hdnRfiRfqSubject', JSON.stringify(data));
           
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
           
            return false;
            jQuery.unblockUI();
        }
    });

}

jQuery("#txtrfirfqsubject").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnRfiRfqSubject');
        Subject = [];
        map = {};
        var commonsubject = "";
        jQuery.each(jQuery.parseJSON(data), function (i, commonsubject) {
            map[commonsubject.rfivqSubject] = commonsubject;
            Subject.push(commonsubject.rfivqSubject);
        });

        process(Subject);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].rfivqid != '0') {
          
            $('#hdnRfiRfqID').val(map[item].rfivqid);
            FetchRfiRfqVendorsForReport()
         }
        else {
            $('#ddlrfirfqvendors').append('<option value="">Select</option>');
            

        }
        return item;
    }

});
jQuery("#txtrfirfqsubject").keyup(function () {
    $('#hdnRfiRfqID').val(0);
    $('#ddlrfirfqvendors').empty();
     $('#ddlrfirfqvendors').append('<option value="">Select</option>');
});


function FetchRfiRfqVendorsForReport() {
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/FetchRfiVQVendorsForReport/?SubjectFor=RFI&RFIVQID=" + $('#hdnRfiRfqID').val() + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
        if (data.length > 0) {
          
                $('#ddlrfirfqvendors').empty();
                $('#ddlrfirfqvendors').append('<option value="">Select</option>');
                for (var i = 0; i < data.length; i++) {
                    $('#ddlrfirfqvendors').append(jQuery('<option ></option>').val(data[i].vendorID).html(data[i].vendorName));
                }
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
}
var form = $('#RFIRFQREport');
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

        $(element).closest('.col-md-12').addClass('has-error');

    },

    unhighlight: function (element) {

        $(element).closest('.col-md-12').removeClass('has-error');

    },

    success: function (label) {  


    },


    submitHandler: function (form) {      
        fetchRFIRFQReportDetails()
    }

});

}

function fetchRFIRFQReportDetails() {
    var VendorID = '';
    var dtfrom = '';
    var dtto = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if ($('#ddlrfirfqvendors').val() == null || $('#ddlrfirfqvendors').val() == '') {
        VendorID = 0;

    }
    else {
        VendorID = $('#ddlrfirfqvendors').val()
    }

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
   
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/fetchRFIVQReportDetails/?ReportType=RFI&RFIVQID=" + $('#hdnRfiRfqID').val() + "&VendorID=" + VendorID + "&Datefrom=" + dtfrom + "&Dateto=" + dtto + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#tblVendorSummary > tbody').empty();
            if (data.length > 0) {
                $('#displayTable').show();
                

                for (var i = 0; i < data.length; i++) {
                    var encrypdataVQ = fnencrypt("VQID=" + data[i].rfiid + "&VendorID=" + data[i].vendorID + "&PageType=Report&FinalStatus=" + data[i].finalStatus);
                    var encrypdataRFI = fnencrypt('RFXID=' + data[i].rfiid + '&VendorID=' + data[i].vendorID + '&PageType=Report&FinalStatus=' + data[i].finalStatus);
                    if (data[i].rfiid != 0) {
                        if (data[i].rfxType == 'VQ') {
                            $('<tr><td><a href=VQResponse.html?param='+encrypdataVQ+' style="text-decoration:none !important;">' + data[i].referenceNo + '</a></td><td>' + data[i].deadline + '</td><td>' + data[i].vendorName + '</td><td>' + data[i].activityDescription + '</td><td>' + data[i].finalStatus + '</td></tr>').appendTo('#tblVendorSummary');
                        } else {
                            $('<tr><td><a href=RFXResponse.html?param=' + encrypdataRFI + ' style="text-decoration:none !important;">' + data[i].referenceNo + '</a></td><td>' + data[i].deadline + '</td><td>' + data[i].vendorName + '</td><td>' + data[i].activityDescription + '</td><td>' + data[i].finalStatus + '</td></tr>').appendTo('#tblVendorSummary');
                        }
                    } 
                }

            } else {
                $('#displayTable').show();                
                $('<tr><td style="color:red !important; text-align: center;" colspan="4"> No results </td></tr>').appendTo('#tblVendorSummary');

            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();

}

jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblVendorSummary tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});