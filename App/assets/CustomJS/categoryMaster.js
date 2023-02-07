
    jQuery(document).ready(function () {
        
        Pageloaded()
        var x = isAuthenticated();
    setInterval(function () {Pageloaded()}, 15000);
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
    fetchCategorymaster();

        });

var error = $('#errordiv');
var success = $('#successdiv');

success.hide();
error.hide();
$('#categoryName').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

function FormValidate() {

    jQuery('#frmcategoryMaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
        categoryName: {
                required: true
            }
        },
        messages: {

        categoryName: {
                required: "Category Name is required."
            }

        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            success.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            error.show();
            error.fadeOut(5000);
           
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
            insupdCategorymaster();
        }
    });

}

function insupdCategorymaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";
    if (jQuery("#checkboxactive").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }   

    var data = {
    "CategoryID": parseInt($('#hddnCategoryID').val()),
    "CategoryName": $('#categoryName').val(),
    "IsActive": status,        
    "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))      
    }
   
         
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/InsUpdProductCategoryMaster",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data == '1') {

                $("#success").html("Transaction Successfull...");
                success.show();
                success.fadeOut(3000);

                fetchCategorymaster();
                
                jQuery.unblockUI();
            }
            else if (data == '2') {
                $("#success").html("Updation Successfull...");
                success.show();
                success.fadeOut(3000);
              
                fetchCategorymaster();
                
                jQuery.unblockUI();

            }

            else if (data == '3') {
                success.hide();
                $("#error").html("Category already exists..");
                error.show();
                error.fadeOut(3000);
              

                jQuery.unblockUI();
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
        resetscholership();
        
    }

    function fetchCategorymaster() {
        
        jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=M&MappedBy=" + sessionStorage.getItem('UserID') + "&VendorID=0",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: "{}",
            cache: false,
            dataType: "json",
            success: function (data) {
                jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
                 jQuery("#tblPlaceMaster").empty();

                 if (data.length > 0) {

                     jQuery("#tblPlaceMaster").append("<thead id='tblheader'><th>Edit</th><th>Items/Services</th><th>Status</th></thead>");

                     for (var i = 0; i < data.length; i++) {

                         jQuery('<tr><td><button class="btn yellow " onclick="updateType(\'' + data[i].categoryName + '\',\'' + data[i].isActive + '\',\'' + data[i].categoryID + '\')"><i class="fa fa-pencil"></i></button></td><td> ' + data[i].categoryName + '</td><td>' + data[i].status + '</td></tr>').appendTo("#tblPlaceMaster");

                    }
                 }
                 else { 
                     jQuery("#tblPlaceMaster").append('<tr><td>No Information is there..</td></tr>');
                 }
                jQuery.unblockUI();
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

function updateType(rname, status, id) {

    $('#hddnCategoryID').val(id);
    $('#categoryName').val(rname);
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
    $('#categoryName').val('');
    $('#hddnCategoryID').val('0');
    jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
    jQuery('#checkboxactive').parents('span').addClass('checked');

}