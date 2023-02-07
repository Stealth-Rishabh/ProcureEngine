jQuery(document).ready(function () {
    
    Pageloaded()
    var x = isAuthenticated();
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    App.init();
    setCommonData();
    fetchMenuItemsFromSession(19, 20);
    FormValidate();
    fetchPlacemaster();

});

var placeerror = $('#errordiv');
var placesuccess = $('#successdiv');

placesuccess.hide();
placeerror.hide();


function FormValidate() {
   
    jQuery('#placemaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            Placename: {
                required: true
            }

        },
        messages: {

            Placename: {
                required: "Place Name is required."
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            placesuccess.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            placeerror.show();
            placeerror.fadeOut(5000);
           
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
            placeerror.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
            placeerror.hide();
            insupdPlacemaster();
        }
    });


}

function insupdPlacemaster() {

    var _cleanString = StringEncodingMechanism($('#Placename').val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";
    if (jQuery("#checkboxactive").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }   

    var data = {
        "PlaceID":  $('#hddnplacemaster').val(),
        //"PlaceName": $('#Placename').val(),
        "PlaceName": _cleanString,
        "isActive": status,
        "CreatedBy": sessionStorage.getItem("UserID"),
        "CustomerID": sessionStorage.getItem("CustomerID")
        
    }
   
         
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "PlaceVehicleMaster/Insupd_PlaceMasterMaster",
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data[0].GetMsz == '1') {

                $("#success").html("Transaction Successfull...");
                placesuccess.show();
                placesuccess.fadeOut(3000);
             
                fetchPlacemaster();
                
                jQuery.unblockUI();
            }
            else if (data[0].GetMsz == '2') {
                $("#success").html("Updation Successfull...");
                placesuccess.show();
                placesuccess.fadeOut(3000);
              
                fetchPlacemaster();
                
                jQuery.unblockUI();

            }

            else if (data[0].GetMsz == '3') {
                placesuccess.hide();
                $("#error").html("Place Name already exists..");
                placeerror.show();
                placeerror.fadeOut(3000);
              

                jQuery.unblockUI();
            }

        }

        });

        jQuery.unblockUI();
        resetscholership();
        
    }


    function fetchPlacemaster() {
        
        jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "PlaceVehicleMaster/fetchPlaces/?aID=0&CustomerID="+sessionStorage.getItem('CustomerID'),
            data: "{}",
            cache: false,
            dataType: "json",
            success: function (data) {
                jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
                 jQuery("#tblPlaceMaster").empty();

                 if (data.length > 0) {

                     jQuery("#tblPlaceMaster").append("<thead id='tblheader'><th>Edit</th><th>Name</th><th>Status</th></thead>");

                     for (var i = 0; i < data.length; i++) {
                        
                         jQuery('<tr><td><button class="btn yellow " onclick="updateType(\'' + data[i].PlaceName + '\',\'' + data[i].isActive + '\',\'' + data[i].PlaceID + '\')"><i class="fa fa-pencil"></i></button></td><td> ' + data[i].PlaceName + '</td><td>' + data[i].Status + '</td></tr>').appendTo("#tblPlaceMaster");



                     }
                 }
                 else { 
                     jQuery("#tblPlaceMaster").append('<tr><td>No Information is there..</td></tr>');
                 }
                jQuery.unblockUI();
            },
            error: function (result) {
                alert("error");
                jQuery.unblockUI();

            }
            });
    }

function updateType(rname, status, id) {
              
                    $('#hddnplacemaster').val(id);
                    $('#Placename').val(rname);
                    if (status =='Y') {
                       
                        jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
                        jQuery('#checkboxactive').parents('span').addClass('checked');

                    }
                    else {
                        jQuery('input:checkbox[name=checkboxactive]').attr('checked', false);
                        jQuery('#checkboxactive').parents('span').removeClass('checked');
                    }
                    
                  
  
    }



jQuery("#search").keyup(function () {
    
    jQuery("#tblPlaceMaster tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblPlaceMaster tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tblPlaceMaster tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});


function resetscholership() {
    $('#Placename').val('');
    $('#hddnplacemaster').val('0');
    jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
    jQuery('#checkboxactive').parents('span').addClass('checked');

}