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
    fetchMenuItemsFromSession(19, 32);
    FormValidate();
    fetchCustomerDetail();
});

var error = $('#errordiv');
var success = $('#successdiv');
var errors = $('#errors');
success.hide();
error.hide();
errors.hide();


$('#uomName').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

$('#uomId').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});


/*
 search here start
 */
jQuery("#search").keyup(function () {

    jQuery("#uomPlaceMaster tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#uomPlaceMaster tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#uomPlaceMaster tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});
/*
 search here start
 */



/*form validation start*/
function FormValidate() {

    jQuery('#frmuomMaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            uomName: {
                required: true
            },
            uomId: {
                required: true
            }
          
        },
        messages: {
            uomName: {
                required: "uom name is required."

            },
            uomId: {
                required: "uom id is required."
            }
        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            success.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            error.show();
            error.fadeOut(3000);

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
            error.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
            error.hide();
            uomFuncDetails();
        }
    });

}
/*form validation end*/


/*special chararcter denied validation start*/
$('input').on('keypress', function (event) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        $("#errors").html("only alphabets and numbers allowed...");
        errors.show();
        errors.fadeOut(3000);
        jQuery.unblockUI();
        return false;
    }
});
/*special chararcter denied validation end*/


/*
 postuomDetails start
 */
function uomFuncDetails() {

    var _cleanString1 = StringEncodingMechanism(jQuery("#uomName").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#uomId").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var data = {
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),   
        "UOM":        _cleanString1,
        "UOMID":      _cleanString2,
    }

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "UOM/PostUomDetails",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.isSuccess == '1') {
                $("#successdiv").html("uom enter successfully...");
                $("#successdiv").show();
                $("#successdiv").fadeOut(3000);
                fetchCustomerDetail();

                jQuery.unblockUI();
            }
            else if (data.isSuccess == '2') {
                success.hide();
                $("#errordiv").html("uom id already exists...");
                $("#errordiv").show();
                $("#errordiv").fadeOut(3000);
                jQuery.unblockUI();

            }
            setTimeout(function () {
                window.location.reload();        
            }, 3000);

        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                $("#errordiv").html("uom id already exists...");
            }
            else {
                success.hide();
                $("#errordiv").html("uom id already exists...");
                $("#errordiv").show();
                $("#errordiv").fadeOut(3000);
                jQuery.unblockUI();
            }
            jQuery.unblockUI();
            return false;
        }

    });

    jQuery.unblockUI();
}
/*
 postuomDetails end
 */



function fetchCustomerDetail() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=M&MappedBy=" + sessionStorage.getItem('UserID');
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,  
        processData: true,
        dataType: "json",   
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#uomPlaceMaster").empty();

            if (data.length > 0) {
                jQuery("#uomPlaceMaster").append("<thead><th>UOM</th><th>UOM ID</th></thead>");

                for (var i = 0; i < data.length; i++) {

                    jQuery("#uomPlaceMaster").append(jQuery('<tbody><tr><td>' + StringDecodingMechanism(data[i].uom) + '</td><td>' + StringDecodingMechanism(data[i].uomid) + '</td></tr><tbody>'));
                }
            }
            else {
                jQuery("#uomPlaceMaster").append('<tr><td>No Information is there..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spnerror', '');
            }
            jQuery.unblockUI();
            return false;
        }

    });
}




