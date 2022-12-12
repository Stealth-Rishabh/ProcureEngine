jQuery(document).ready(function () {
    Pageloaded()
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
    FetchAllCustomer();
    fetchMenuItemsFromSession(9, 48);

    setTimeout(function () {
        FetchAllpendingWith();
    }, 1000);
    //setTimeout(function () {
    //    FetchAllCloseBids();
    //}, 2000);
});

var APIPath = sessionStorage.getItem("APIPath");
function FetchAllCustomer() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "CustomerRegistration/FetchCustomerDetails/?CustomerID=0&IsActive=Y",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlCustomer").empty();
            if (data.length > 0) {
                jQuery("#ddlCustomer").append(jQuery("<option ></option>").val("0").html("Select"));
                for (var i = 0; i < data.length; i++) {
                    
                        jQuery("#ddlCustomer").append(jQuery("<option ></option>").val(data[i].customerID).html(data[i].customerName));

                }
                $('#ddlCustomer').val(sessionStorage.getItem("CustomerID"))
                if (sessionStorage.getItem("CustomerID") == "1") {
                    $('#ddlCustomer').prop('disabled',false)
                }
                 else {
                    $('#ddlCustomer').prop('disabled',true)
                   }
                }
        },
        error: function (xhr, status, error) {
              
            var err = xhr.responseText //; eval("(" + xhr.responseText + ")");
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
    jQuery.unblockUI();

}
function FetchAllpendingWith() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var CustID = parseInt(jQuery("#ddlCustomer option:selected").val());
    var bidRequestObj = {
        "BidType": jQuery("#ddleventtype option:selected").val(),
        "CustomerID": CustID,
        "PendingOn": 0
    }
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "BidVendorSummary/fetchAllPendingWith/?CustomerID=" + jQuery("#ddlCustomer option:selected").val() + "&BidType=" + jQuery("#ddleventtype").val(),
        //url: APIPath + "BidVendorSummary/fetchAllPendingWith",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        //data: JSON.stringify(bidRequestObj),
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            jQuery("#tblVendorSummary").empty();
            jQuery("#ddlPendingwith").empty();
            if (BidData.length > 0) {
                jQuery("#ddlPendingwith").append(jQuery("<option ></option>").val(0).html('Select'));
                for (var i = 0; i < BidData.length; i++) {
                  
                    jQuery("#ddlPendingwith").append(jQuery("<option ></option>").val(BidData[i].toUserId).html(BidData[i].pendingOn));

                }
            }
            else {
                jQuery("#ddlPendingwith").append(jQuery("<option ></option>").val(0).html('Select'));
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;
        }
        })
    jQuery.unblockUI();
}
function FetchViewAllPendingBids() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var CustID = parseInt(jQuery("#ddlCustomer option:selected").val())
    var bidRequestObj = {
        "BidType": jQuery("#ddleventtype option:selected").val(),
        "CustomerID": CustID,
        "PendingOn": 0
    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "BidVendorSummary/fetchAllPendingApprovalBids/?CustomerID=" + jQuery("#ddlCustomer option:selected").val() + "&BidType=" + jQuery("#ddleventtype option:selected").val() + "&PendingOn=0",
        //url: APIPath + "BidVendorSummary/fetchAllPendingApprovalBids",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: '',
        cache: false,
        crossDomain: true,
        //data:JSON.stringify(bidRequestObj),
        dataType: "json",
        success: function (BidData) {
            jQuery("#tbldetails").empty();
            if (BidData.length > 0) {
               
                jQuery('#tbldetails').append("<thead><tr><th class='bold text-left'>Event ID</th><th class='bold'>Event Subject</th><th class='bold'>Event Closing Date</th><th class='bold'>Pending With</th><th class='bold'>Pending Since</th></tr></thead>");
                for (var i = 0; i < BidData.length; i++) {
                   
                    var str = "<tr><td class='text-left'>" + BidData[i].bidID + "</td>";
                    str += "<td>" + BidData[i].bidSubject + "</td>";

                    str += "<td>" + BidData[i].bidCloseDate + "</td>";
                    str += "<td>" + BidData[i].pendingOn + "</td>";
                    str += "<td>" + BidData[i].pendingSince + "</td>";
                    str += "</tr>";
                    jQuery('#tbldetails').append(str);

                }
                var table = $('#tbldetails');
                table.removeAttr('width').dataTable({
                    "bDestroy": true,
                    responsive: false,

                    fixedColumns: true,
                    "oLanguage": { "sSearch": "", "sLengthMenu": "\_MENU_" },

                    "bAutoWidth": false,
                    columnDefs: [
                        { orderable: false, targets: 0 }
                    ],

                    "aaSorting": [[1, 'asc']],

                    "iDisplayLength": 10,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    dom: 'Bfrtip',
                    buttons: [
                        'pageLength',
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
                var tableWrapper = $('#tbldetails_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper



            }
            else {
                jQuery('#tbldetails').append("<thead><tr><th>All</th><th class='bold text-left'>Event ID</th><th class='bold'>Event Subject</th><th class='bold'>Event Closing Date</th><th class='bold'>Pending With</th><th class='bold'>Pending Since</th></tr></thead>");
                jQuery('#tbldetails > tbody').append("<tr><td colspan='8' style='text-align: center; color:red;'>No record found</td></tr>");
                $('#tbldetails').dataTable({
                    "bDestroy": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bAutoWidth": false,
                    "bSort": true


                });
                $('#divsubmitbutton').addClass('hide');
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;
           
        }

    })
    jQuery.unblockUI();
}
function FetchAllCloseBids() {
   // FetchAllpendingWith();
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var bidRequestObj = {
        "BidType": jQuery("#ddleventtype option:selected").val(),
        "CustomerID": CustID,
        "PendingOn": 0
    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "BidVendorSummary/fetchAllPendingApprovalBids/?CustomerID=" + jQuery("#ddlCustomer option:selected").val() + "&BidType=" + jQuery("#ddleventtype").val() + "&PendingOn=" + $('#ddlPendingwith').val(),
        //url: APIPath + "BidVendorSummary/fetchAllPendingApprovalBids",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        //data: JSON.stringify(bidRequestObj),
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            jQuery("#tblVendorSummary").empty();
            if (BidData.length > 0) {
                $('#divsubmitbutton').removeClass('hide');
                jQuery('#tblVendorSummary').append("<thead><tr><th><label class='checkbox-inline checker'><input type='checkbox' id='chkAll' value='All' name='chkAll' onclick='fnheckAll()' /> All</label></th><th class='bold text-left'>Event ID</th><th class='bold'>Event Subject</th><th class='bold'>Event Closing Date</th><th class=hide></th><th class='bold'>Pending With</th><th class='bold'>Pending Since</th></tr></thead>");
                for (var i = 0; i < BidData.length; i++) {
                  
                    var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + BidData[i].BidID + "'\,\'" + BidData[i].toUserId + "'\)\";  id=\"chkvender\" value=" + (BidData[i].bidID) + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td>";
                  
                    str += "<td class='text-left'>" + BidData[i].bidID + "</td>";
                    str += "<td>" + BidData[i].bidSubject + "</td>";

                   
                    str += "<td>" + BidData[i].bidCloseDate + "</td>";
                    str += "<td class=hide id=pendingon"+i+">" + BidData[i].toUserId + "</td>";
                    str += "<td>" + BidData[i].pendingOn + "</td>";
                    str += "<td>" + BidData[i].pendingSince + "</td>";
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
                    columnDefs: [
                        { orderable: false, targets: 0 }
                    ],

                    "aaSorting": [[1, 'asc']],

                    "iDisplayLength": 10,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    dom: 'Bfrtip',
                    buttons: [
                        'pageLength',
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
                jQuery('#tblVendorSummary').append("<thead><tr><th>All</th><th class='bold text-left'>Event ID</th><th class='bold'>Event Subject</th><th class='bold'>Event Closing Date</th><th class='bold'>Pending With</th><th class='bold'>Pending Since</th></tr></thead>");
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
                $('#divsubmitbutton').addClass('hide');
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//;eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            } else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;
           
        }



    })
    jQuery.unblockUI();
}


function fnheckAll() {

    if ($("#chkAll").is(':checked') == true) {
        $('#displayTable').find('span#spandynamic').hide();
        $('table#tblVendorSummary').closest('.inputgroup').removeClass('has-error');


        $("#tblVendorSummary> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
            $('input[name="chkvender"]').prop('disabled', true);


        });
    }
    else {
        $("#tblVendorSummary> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").removeClass("checked");
            $('input[name="chkvender"]').prop('disabled', false);

        });

    }


}

function Check(event, Bidid,pendingon) {

    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")
    }

    else {
        var EvID = event.id;
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")
        $('#displayTable').find('span#spandynamic').hide();
        $('table#tblVendorSummary').closest('.inputgroup').removeClass('has-error');

    }

}

var status;

function ValidateVendor() {

    status = "false";
    $('#displayTable').find('span#spandynamic').hide();

    $("#tblVendorSummary> tbody > tr").each(function (index) {
        if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            status = "True";
        }
    });
    if (status == "false") {
        $('.alert-danger').show();
        $('#error').html('Please select atleast one element');

        Metronic.scrollTo($('.alert-danger'), -200);
        $('.alert-danger').fadeOut(5000);

        status = "false";
    }
    return status;
}
function fnCloseBids() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (ValidateVendor() == 'false') {
        jQuery.unblockUI();
        return false;

    }
    var checkedBid = '';
    var temp = new Array();
    $("#tblVendorSummary> tbody > tr").each(function (index) {
        if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            //if ($("#ddleventtype").val().toLowerCase() == "erfq") {
                checkedBid = checkedBid + $(this).find("#chkvender").val() + '~' + $('#pendingon' + index).text() + "#"
           // }
           // else {
                //checkedBid = checkedBid + $(this).find("#chkvender").val() + "#"
           // }
        }
    });
   
   
    var data = {
        
        "QueryString": checkedBid,
        "UserID": sessionStorage.getItem("UserID"),
        "BidTypeID": jQuery("#ddleventtype").val(),
        "ToUserID": parseInt(jQuery("#ddlPendingwith option:selected").val()),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
    
   // alert(JSON.stringify(data))
  //console.log(JSON.stringify(data))
    jQuery.ajax({
        url: APIPath + "BidVendorSummary/SendReminderToPendingApprovers",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
           // if (data == "1") {
                $('.alert-success').show();
                $('#success').html('Reminder Sent successfully.');

                Metronic.scrollTo($('.alert-success'), -200);
                $('.alert-success').fadeOut(5000);
                FetchAllCloseBids();
                jQuery.unblockUI();
          //  }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
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

    return true;
}

jQuery("#txtSearchalldetails").keyup(function () {

    jQuery("#tbldetails tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#txtSearchalldetails').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tbldetails tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tbldetails tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});