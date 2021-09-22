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
function FetchAllOpenBids() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Fromdate = "1900-01-01";
    var Todate = "1900-01-01";
    if (jQuery("#txtFromDate").val() != "" && jQuery("#txtFromDate").val()==null) {
        Fromdate = jQuery("#txtFromDate").val();
    }
    if (jQuery("#txtToDate").val() != "" && jQuery("#txtToDate").val() == null) {
        Todate = jQuery("#txtFromDate").val();
    }
   // alert(APIPath + "BidVendorSummary/fetchAllOpenBids/?CustomerID=" + jQuery("#ddlCustomer option:selected").val() + "&FromDate=" + jQuery("#txtFromDate").val() + "&ToDate=" + jQuery("#txtToDate").val())
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "BidVendorSummary/fetchAllOpenBids/?CustomerID=" + jQuery("#ddlCustomer option:selected").val() + "&FromDate=" + Fromdate + "&ToDate=" + Todate,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: '',
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
           
            jQuery("#tblVendorSummary").empty();
            if (BidData.length > 0) {
                $('#divsubmitbutton').removeClass('hide');
                jQuery('#tblVendorSummary').append("<thead><tr><th><label class='checkbox-inline checker'><input type='checkbox' id='chkAll' value='All' name='chkAll' onclick='fnheckAll()' /> All</label></th><th class='bold'>Customer</th><th class='bold'>Event ID</th><th class='bold'>Configured By</th><th class='bold'>Bid Subject</th><th class='bold'>Bid Date</th><th class='bold'>Bid Time</th><th class='bold'>Bid Duration</th><th class='bold'>Currency</th></tr></thead>");
                for (var i = 0; i < BidData.length; i++) {
                    var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + BidData[i].bidID + "'\)\"; Onclick=\"Check(this)\"; id=\"chkvender\" value=" + (BidData[i].bidID) + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td>";
                    str += "<td>" + BidData[i].customerName + "</td>";
                    str += "<td  class=text-right><a href='BidSummary.html?BidID=" + BidData[i].bidID + "&BidTypeID=" + jQuery("#ddlBidtype option:selected").val() + "&BidForID=" + BidData[i].bidForID + "' target='_blank'>" + BidData[i].bidID + "</a></td>";
                    str += "<td>" + BidData[i].configuredBy + "</td>";
                    str += "<td>" + BidData[i].bidSubject + "</td>";

                    var datearray = BidData[i].bidDate.split("/");
                    BidDate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
                    str += "<td>" + BidDate + "</td>";
                    
                    str += "<td class=text-right>" + BidData[i].bidHour + ' : ' + BidData[i].bidMinute + '  ' + BidData[i].aMPM + "</td>";
                    str += "<td class=text-right>" + BidData[i].bidDuartion + "</td>";
                    str += "<td>" + BidData[i].currencyName + "</td>";
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
                jQuery('#tblVendorSummary').append("<thead><tr><th>All</th><th class='bold'>Customer</th><th class='bold'>Event ID</th><th class='bold'>Configured By</th><th class='bold'>Bid Subject</th><th class='bold'>Bid Date</th><th class='bold'>Bid Time</th><th class='bold'>Bid Duration</th><th class='bold'>Currency</th></tr></thead>");
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

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
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
function Check(event, Bidid) {

    if ($(event).closest("span#spanchecked").attr('class') == 'checked')
    {
             $(event).closest("span#spanchecked").removeClass("checked")
    }

else
    {
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
 var checkedValue = '';
 var temp = new Array();
 $("#tblVendorSummary> tbody > tr").each(function (index) {
     if ($(this).find("span#spanchecked").attr('class') == 'checked') {
       checkedValue = checkedValue + " Update BidDetails set Status='Close' where BidID=" + $(this).find("#chkvender").val() +"  ;";
     }
 });
 
 var data = {
     "BidID": 0,
     "QueryString": checkedValue,
     "UserID": sessionStorage.getItem("UserID")
    
 }
   //  alert(JSON.stringify(data))
 jQuery.ajax({
     url: APIPath + "BidVendorSummary/Upd_CloseBids",
     beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
     data: JSON.stringify(data),
     type: "POST",
     contentType: "application/json",
     success: function (data) {
         if (data == "1") {
             $('.alert-success').show();
             $('#success').html('Bid Closed successfully.');
        
             Metronic.scrollTo($('.alert-success'), -200);
             $('.alert-success').fadeOut(5000);
             FetchAllOpenBids();
             jQuery.unblockUI();
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

 return true;
}

    