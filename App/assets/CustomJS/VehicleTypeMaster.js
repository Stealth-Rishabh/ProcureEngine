var allurlsec = sessionStorage.getItem("allurlsec");
var Vehicleerror = $('#errordiv');
var Vehiclesuccess = $('#successdiv');
Vehiclesuccess.hide();
Vehicleerror.hide();
function FormValidate() {
 
    $('#vehiclemaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            bidfor: {
                required: true
            },
            vtype: {
                required: true
            }
          
        },
        messages: {

            ddlBidFor: {
                required: "Bid For is required."
            },
            vtype: {
                required: "Vehicle Type is required."
            }
            
            
        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            Vehiclesuccess.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            Vehicleerror.show();
            Vehicleerror.fadeOut(5000);
            Metronic.scrollTo(Vehicleerror, -200);
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
	                    .closest('.form-group').addClass('has-error'); // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.form-group').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            Vehicleerror.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
            //Vehicleerror.hide();
            insupdVehicleMaster();
        }
    });
}

function fetchBidFor() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidFor/?BidTypeID=4" ,
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlBidFor").empty();
            jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlBidFor").append(jQuery("<option></option>").val(data[i].BidForID).html(data[i].BidFor));
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
function insupdVehicleMaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var status = "";
    if (jQuery("#checkboxactive").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }

    var data = {
      
        "VehicleTypeID": $('#hdnvehiclemaster').val(),
        "BidforID": $('#ddlBidFor').val(),
        "VehicleTypeName": $('#vtype').val(),
        "isActive": status,
        "CreatedBy": sessionStorage.getItem("UserID"),
        "CustomerID": sessionStorage.getItem("CustomerID")
       
    }
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "PlaceVehicleMaster/insupdVehicleMaster",
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {

            if (data[0].GetMsz == "1") {

                $("#success").html("Transaction Successfull...");

                Vehiclesuccess.show();
                Vehiclesuccess.fadeOut(5000);
              
                fetcVehicledetail();
                jQuery.unblockUI();
            }
            else if (data[0].GetMsz == '2') {
                $("#success").html("Updation Successfull...");
                Vehiclesuccess.show();
                Vehiclesuccess.fadeOut(5000);
               
                fetcVehicledetail();
                jQuery.unblockUI();

            }

            else if (data[0].GetMsz == '3') {
                Vehiclesuccess.hide();
                $("#error").html("Information already exists..");
                Vehicleerror.show();
                Vehicleerror.fadeOut(5000);
                
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
    jQuery.unblockUI();
    resetVehiclemaster();
    
}


function resetVehiclemaster() {
    $('#hdnvehiclemaster').val("0")
    $('#ddlBidFor').val('')
    $('#vtype').val('')
    jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
    jQuery('#checkboxactive').parents('span').addClass('checked');
}


function fetcVehicledetail() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "PlaceVehicleMaster/fetchVehicles/?aID=0&BidForID=" + 0 + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblFetchvehicle").empty();
            $('#scrolr').show();
           
            if (data.length > 0) {

                jQuery("#tblFetchvehicle").append("<thead id='tblheader'><th>Edit</th><th>Bid For</th><th>Name</th><th>Status</th></thead>");

                for (var i = 0; i < data.length; i++) {
                    jQuery('<tr><td><button  class="btn yellow btn-circle"   onclick="updateType(\'' + data[i].VehicleTypeID + '\',\'' + data[i].BidForID + '\',\'' + data[i].VehicleTypeName + '\',\'' + data[i].isActive + '\')"><i class="fa fa-pencil"></i></button></td><td>' + data[i].BidFor + '</td><td>' + data[i].VehicleTypeName + '</td><td>' + data[i].isActive + '</td></tr>').appendTo("#tblFetchvehicle");

                }
            }
            else {
                jQuery("#tblFetchvehicle").append('<tr><td>No Information is there..</td></tr>');
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                alert('error')
            }
            return false;
            jQuery.unblockUI();
        }
        
    });
}

function updateType(mid,rid,name, status ) {
    $('#hdnvehiclemaster').val(mid);
    $('#ddlBidFor').val(rid);
    $('#ddlBidFor').focus();
    $('#vtype').val(name);
    
    if (status == "Active") {
        jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
        jQuery('#checkboxactive').parents('span').addClass('checked');

          }
       else {
        jQuery('input:checkbox[name=checkboxactive]').attr('checked', false);
        jQuery('#checkboxactive').parents('span').removeClass('checked');
    }
}





jQuery("#search").keyup(function () {
 
    jQuery("#tblFetchvehicle tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblFetchvehicle tr:has(td)").show();
        return false;
    }

    jQuery("#tblFetchvehicle tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});


