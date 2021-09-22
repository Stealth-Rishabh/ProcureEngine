var APIPath = sessionStorage.getItem("APIPath");
  

function fetchUserDetails() {
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                
                for (var i = 0; i < data.length; i++) {
                    $('#username').html(data[i].userName)
                    $('#usermobileno').val(data[i].mobileNo)
                    $('#userEmailID').html(data[i].emailID)
                    $('#userRole').html(data[i].roleName)
                    $('#userdesignation').val(data[i].Designation)
                    
                }

                
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(xhr.status + ' ' + xhr.statusText);
                jQuery.unblockUI();
            }

            return false;
            jQuery.unblockUI();
        }
    });
    
}
function fetchVendorDetails() {
	
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType') + "&CustomerID=" + sessionStorage.getItem("CustomerID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
               
                for (var i = 0; i < data.length; i++) {
                    $('#vendorname').html(data[i].vendorName)
                    $('#vendormobileno').val(data[i].mobileNo)
                    $('#vendorEmailID').html(data[i].emailID)
                    $('#vendoraddress').val(data[i].address)
                    $('#vendorCity').val(data[i].city)
                    $('#vendorphone').val(data[i].phone)
                    $('#vendorpanno').html(data[i].pANNo)
                    $('#vendorservicetaxno').html(data[i].serviceTaxNo)
                    $('#vendoralternateemail').val(data[i].alternateEmailID)
                    $('#personname').val(data[i].Contactperson)
                    $('#Vendorcode').html("<b>"+data[i].vendorCode+"</b>")
                }


            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(xhr.status + ' ' + xhr.statusText);
                jQuery.unblockUI();
            }

            return false;
            jQuery.unblockUI();
        }
    });

}
var profileerror = $('#errordiv');
var profilesuccess = $('#successdiv');
profilesuccess.hide();
profileerror.hide();
function formvalidate() {
    $('#frmprofile').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            usermobileno: {
                required: true
            }

        },
        messages: {

            usermobileno: {
                required: "Mobile No is required."
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            profilesuccess.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
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
            profileerror.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
           
            updMobileNo();
        }
    });
    
}
function formvalidatevendor(){
	 $('#frmprofilevendor').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            vendormobileno: {
                required: true
            },
            vendoraddress: {
                required: true
            },
            vendorphone: {
                required: true
            },
            vendorCity: {
                required: true
            },
            vendoralternateemail:{
                email:true
            }

        },
        messages: {

            vendormobileno: {
                required: "Mobile No is required."
            },
            vendoraddress: {
                required: "Address is required."
            },
            vendorphone: {
                required: "Company Phone No is required."
            },
            vendorCity: {
                required: "City is required."
            },
            vendoralternateemail: {
                required: "Alternate Email is required."
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            profilesuccess.hide();
            jQuery("#error").text("You have some form errors. Please check below.");
            profileerror.show();
            profileerror.fadeOut(5000);
            App.scrollTo(profileerror, -200);
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
            profileerror.insertAfter(element.closest('.xyz'));
        },

        submitHandler: function (form) {
            //profileerror.hide();
            updVnedorMobileNo();
        }
    });
	
}
function updMobileNo() {
  
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   
        ID = sessionStorage.getItem("UserID");
     
    var data = {
        "UserID": ID,
        "UserType": sessionStorage.getItem('UserType'),
        "MobileNo": $('#usermobileno').val(),
        "Address1": $('#vendoraddress').val(),
        "Address2": $('#vendorCity').val(),
        "CompanyPhoneNo": $('#vendorphone').val(),
        "AlternateEmailID": '',
        "Designation": $('#userdesignation').val(),
        "ContactPerson":""
    }
 //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ChangeForgotPassword/updateMobileNo",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           
            if (data == "1") {
                profileerror.hide();
                jQuery("#success").text("Your data is updated successfully..");
                profilesuccess.show();
                profilesuccess.fadeOut(5000);
                fetchUserDetails();
                App.scrollTo(profilesuccess, -200);

            }
            else {
                jQuery("#error").html("Please try again with correct ..");
                profileerror.show();
                profileerror.fadeOut(5000);
                App.scrollTo(profileerror, -200);
                jQuery.unblockUI();
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(xhr.status + ' ' + xhr.statusText);
                jQuery.unblockUI();
            }

            return false;
            jQuery.unblockUI();
        }
    })

}
function updVnedorMobileNo(){
	
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var data = {
        "UserID": sessionStorage.getItem("VendorId"),
        "UserType": sessionStorage.getItem('UserType'),
        "MobileNo": $('#vendormobileno').val(),
        "Address1": $('#vendoraddress').val(),
        "Address2": $('#vendorCity').val(),
        "CompanyPhoneNo": $('#vendorphone').val(),
        "AlternateEmailID": $('#vendoralternateemail').val(),
        "Designation": "",
        "ContactPerson": $('#personname').val()
    }
   
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ChangeForgotPassword/updateMobileNo",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           
            if (data == "1") {
                profileerror.hide();
                jQuery("#success").text("Your data is updated successfully..");
                profilesuccess.show();
                profilesuccess.fadeOut(5000);
                fetchVendorDetails();
                App.scrollTo(profilesuccess, -200);

            }
            else {
                jQuery("#error").html("Please try again with correct ..");
                profileerror.show();
                profileerror.fadeOut(5000);
                App.scrollTo(profileerror, -200);
                jQuery.unblockUI();
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(xhr.status + ' ' + xhr.statusText);
                jQuery.unblockUI();
            }

            return false;
            jQuery.unblockUI();
        }
    })
}