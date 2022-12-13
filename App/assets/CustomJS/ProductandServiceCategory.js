var allurlsec = sessionStorage.getItem("allurlsec");
var Vehicleerror = $('#errordiv');
var Vehiclesuccess = $('#successdiv');
var Vehicleerror1 = $('#errordiv1');
var Vehiclesuccess1 = $('#successdiv1');
//FROM HTML
jQuery(document).ready(function () {
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

    fetchMenuItemsFromSession(19, 23);
    setCommonData();
    FormValidate();
    fetchRFIQuestiondetail();
    //fetchRFICategory();

});
//******
function FormValidate() {
 
    $('#RFIQuestionmaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
           
            txtQuestiondescription: {
                required: true
            }
          
        },
        messages: {

            txtQuestiondescription: {
                required: "Sub Category is required."
            }
            
            
        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            Vehiclesuccess.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            Vehicleerror.show();
            Vehicleerror.fadeOut(5000);
           
        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.col-lg-8').addClass('has-error'); // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-lg-8').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.col-lg-8').removeClass('has-error');
            label.remove();
        },

       

        submitHandler: function (form) {            
            insupdRFIQuestionMaster();
        }
    });
    

}

function fetchRFICategory(SubCategoryID) {
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/FetchProductandServiceCategory?SubCategoryID=" + SubCategoryID ,
        cache: false,
        dataType: "json",
        success: function (data) {
            $('#rficategories').empty();
            sessionStorage.setItem('hdnRfiCategories', JSON.stringify(data))
           
            for (var i = 0; i < data.length; i++) {
                if (data[i].SubCategoryID == 0 || data[i].SubCategoryID == '0' ) {

                    $('<label class="checkbox-inline"><input type="checkbox"  class=childChkbox id=Chkbox' + i + ' value=' + data[i].BidTypeID + '> ' + data[i].BidTypeName + ' </label>').appendTo('#rficategories')
                }
                else {
                    $('<label class="checkbox-inline"><input type="checkbox"  checked  class=childChkbox id=Chkbox' + i + ' value=' + data[i].BidTypeID + '> ' + data[i].BidTypeName + ' </label>').appendTo('#rficategories')
                }
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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

}
function insupdRFIQuestionMaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var status = "";
    if (jQuery("#checkboxactive").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }

    var data = {
        "SubCategoryID": $('#hdnvehiclemaster').val(),
        "CustomerID": sessionStorage.getItem("CustomerID"),
      
        "SubCategoryName": $('#txtQuestiondescription').val(),
        "isActive":status
       
    }
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/InsUpdProductandServiceCategory",
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            
            if (data[0].GetMsz == "1") {
                Vehicleerror.hide();
                $("#success").html("Transaction Successfull...");
                Vehiclesuccess.show();
                Vehiclesuccess.fadeOut(5000);
				fetchRFIQuestiondetail();
                resetRFIQuestionmaster();
            }
            else if (data[0].GetMsz == '2') {
                Vehicleerror.hide();
                $("#success").html("Updation Successfull...");
                Vehiclesuccess.show();
                Vehiclesuccess.fadeOut(5000);
				fetchRFIQuestiondetail();
                resetRFIQuestionmaster();
            }
            else {
                
                Vehiclesuccess.hide();                
                jQuery("#error").html("Information already exists..");
                Vehicleerror.show();
				
                Vehicleerror.fadeOut(5000);    
                
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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


function resetRFIQuestionmaster() {
    $('#hdnvehiclemaster').val("0")
    
    $('#txtQuestiondescription').val('')
    jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
    jQuery('#checkboxactive').parents('span').addClass('checked');

}


function fetchRFIQuestiondetail() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/FetchRFIProductandServiceCategory/?CustomerID=" + sessionStorage.getItem("CustomerID"),
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblFetchRFIQuestion").empty();
            $('#scrolr').show();
           
            if (data.length > 0) {

                jQuery("#tblFetchRFIQuestion").append("<thead id='tblheader'><th>Edit</th><th>Sub Category</th><th>Status</th></thead>");

                for (var i = 0; i < data.length; i++) {
                    jQuery('<tr><td><button type="button" class="btn yellow btn-circle" style="padding: 2px 7px !important;" onclick="updateType(\'' + data[i].CustomerID + '\',\'' + data[i].SubCategoryID + '\',\'' + data[i].SubCategoryName + '\',\'' + data[i].Status + '\')"><i class="fa fa-pencil"></i></button></td><td>' + data[i].SubCategoryName + '</td><td>' + data[i].Status + '</td></tr>').appendTo("#tblFetchRFIQuestion");

                }
            }
            else {
                jQuery("#tblFetchRFIQuestion").append('<tr><td>No Information is there..</td></tr>');
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
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
}

function updateType(CustomerID, QuestionID, SubCategoryName, Status) {
    $('#hdnvehiclemaster').val(QuestionID);
   
    $('#ddlrfiCategory').focus();
    $('#txtQuestiondescription').val(SubCategoryName);
    
    if (Status == "Active") {
        jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
        jQuery('#checkboxactive').parents('span').addClass('checked');

          }
       else {
        jQuery('input:checkbox[name=checkboxactive]').attr('checked', false);
        jQuery('#checkboxactive').parents('span').removeClass('checked');
    }
}

jQuery("#search").keyup(function () {
 
    jQuery("#tblFetchRFIQuestion tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblFetchRFIQuestion tr:has(td)").show();
        return false;
    }

    jQuery("#tblFetchRFIQuestion tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});






