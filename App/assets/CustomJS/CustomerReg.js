var APIPath = sessionStorage.getItem('APIPath');


function formValidation() {
    
    $('#register_customer').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: true, // do not focus the last invalid input

        rules: {

            txtcustomername: {
                required: true,
                maxlength: 200
            },
            txtcustomerphone: {
                required: true,
                maxlength: 20

            },
            txtcustaddress1: {
                required: true,
                maxlength: 500
            },
            txtcustaddress2: {
                required: true,
                maxlength: 500
            },
            txtcustaddress3: {
                required: true,
                maxlength: 500
            },
            ddlcustcountry: {
                required: true
            },
            ddlcuststate: {
                required: true             

            },
            ddlcustcity: {
                required: true
            },
            txtcustpincode: {
                required: true,
                maxlength: 10
            },
            txtcustAdminName: {
                required: true
            },
            txtcustAdminemail: {
                required: true,
                email: true,
                maxlength: 100
            },
            txtcustmobile: {
                required: true
            },
            optionsRadios: {
                required: true
            },
            txtcustdatefrom: {
                required: true
            },
            txtcustdateto: {
                required: true
            }
           


        },

        messages: { // custom messages for radio buttons and checkboxes
            optionsRadios: {
                required: "Please select atleast one option."
            }

        },

        invalidHandler: function (event, validator) { //display error alert on form submit   

        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            if (element.attr("name") == "optionsRadios") { // insert checkbox errors after the container     

                error.insertAfter($('#subs_err'));
            } else if (element.attr('name') == 'txtcustdatefrom') { 
                error.insertAfter($('#dat_err1'));
            } else if (element.attr('name') == 'txtcustdateto') {
                error.insertAfter($('#dat_err2'));
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
           
            RegisterCustomer();
        }

    });

}

function fillCountryDropDown(dropdownID, countryid) {
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "CustomerRegistration/Country/?CountryID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function (data) {

            var appenddata;
            appenddata += "<option  disabled selected style='display:none;'>Select Country</option>";
            jQuery.each(data, function (key, value) {
                appenddata += "<option value = '" + value.CountryID + "'>" + value.CountryName + " </option>";

            });
            jQuery('#' + dropdownID).html(appenddata);
            

            if (countryid != '0') {
                jQuery('#' + dropdownID).val(countryid);                
            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else{
                alert(response.status + ' ' + response.statusText);
            }
            return false;
            jQuery.unblockUI();
        }
       
    });
}
function fillStateDropDown(dropdownID, stateid) {

    var countryid = '0';

    if (dropdownID == "ddlcuststate") {
        if (jQuery('#ddlcustcountry').val() != null) {

            countryid = jQuery('#ddlcustcountry').val();
        }
    }   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "CustomerRegistration/State/?CountryID=" + countryid + "&StateID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function (data) {
            
            var appenddata;
            appenddata += "<option  disabled selected style='display:none;'>State</option>";
            
            jQuery.each(data, function (key, value) {
                appenddata += "<option value = '" + value.StateID + "'>" + value.StateName + " </option>";

            });
            jQuery('#' + dropdownID).html(appenddata);
            

            if (stateid != '0') {
                jQuery('#' + dropdownID).val(stateid);
                
            }
        },
        
        error: function (xhr, status, error) {

        var err = eval("(" + xhr.responseText + ")");
        if (xhr.status === 401) {
            error401Messagebox(err.Message);
        }
        else{
            alert(response.status + ' ' + response.statusText);
        }
        return false;
        jQuery.unblockUI();
    }

    });
}
function fillCityDropDown(dropdownID, cityid) {
    var stateid = '0';    
    var url = '';
    if (dropdownID == "ddlcustcity") {

        if (jQuery('#ddlcuststate').val() != null) {
            stateid = jQuery('#ddlcuststate').val();
            url = (APIPath + "CustomerRegistration/City/?StateID= " + stateid + "&CityID=0");
        }
        
    }
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

            var appenddata;
            appenddata += "<option  disabled selected style='display:none;'>City</option>";
           
            jQuery.each(data, function (key, value) {
                appenddata += "<option value = '" + value.CityID + "'>" + value.CityName + " </option>";
            });
            jQuery('#' + dropdownID).html(appenddata);
            
            if (cityid != '0') {

                jQuery('#' + dropdownID).val(cityid);
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(response.status + ' ' + response.statusText);
            }
            return false;
            jQuery.unblockUI();
        }

    });
}

function RegisterCustomer() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var regCustomer = {
        'CustomerName': $('#txtcustomername').val(),        
        'CustomerAddress': $('#txtcustaddress').val(),
        'CountryID': $('#ddlcustcountry').val(),
        'StateID': $('#ddlcuststate').val(),
        'CityID': $('#ddlcustcity').val(),
        'PinCode': $('#txtcustpincode').val(),
        'PhoneNo': $('#txtcustomerphone').val(),
        'Website': $('#txtcustwebsite').val(),
        'AdminName': $('#txtcustAdminName').val(),
        'AdminEmail': $('#txtcustAdminemail').val(),
        'AdminMobile': $('#txtcustmobile').val(),
        'SubscriptionType': $('input[name="optionsRadios"]:checked').val(),
        'SubscriptionFrom': $('#txtcustdatefrom').val(),
        'SubscriptionTo': $('#txtcustdateto').val(),
        'CustomerID' : $('#hddn_Cust_ID').val() ,
        'UserID': sessionStorage.getItem('UserID'),
        'AdminID': $('#hddn_Admin_ID').val()
        }
   // alert(JSON.stringify(regCustomer))
    jQuery.ajax({
        url: APIPath + "CustomerRegistration/InsCustomerRegistration",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(regCustomer),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
            
            if (data[0].IsSuccess == '1') {
                
                $('#Customer_ErrorDiv').hide();
                $('#Customer_SuccesDiv').show();
                Metronic.scrollTo($('#Customer_SuccesDiv'), -200);
                $('#Customer_SuccesDiv').fadeOut(7000);
                FetchCustomerDetails();
            }
            
            else if (data[0].IsSuccess == '0') {

                $('#Customer_SuccesDiv').hide();
                $('#Customer_ErrorDiv').show();               
                $('#Customer_ErrorDiv').fadeOut(7000);

            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(response.status + ' ' + response.statusText);
            }
            return false;
            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();
    resetregistrationForm();
    

}
function resetregistrationForm() {
    $('#btn_submit').html('Submit');
    $('#txtcustomername').val('');
    $('#txtcustaddress').val('');
    $('#ddlcustcountry').val('');
    $('#ddlcuststate').val('');
    $('#ddlcustcity').val('');
    $('#txtcustpincode').val('');
    $('#txtcustomerphone').val('');
    $('#txtcustwebsite').val('');
    $('#txtcustAdminName').val('');
    $('#txtcustAdminemail').val('');
    $('#txtcustmobile').val('');
    $('input[name="optionsRadios"]').attr('checked', false);
    $('input[name="optionsRadios"]').closest('span').removeClass('checked');
    $('#txtcustdatefrom').val('');
    $('#txtcustdateto').val('');
    $('#hddn_Cust_ID').val('0');
    $('#hddn_Admin_ID').val('0');
    fillCountryDropDown('ddlcustcountry', 0);
    $('#ddlcuststate').empty();
    $('#ddlcustcity').empty();
    $('#ddlcuststate').append('<option value="">Select State</option>');
    $('#ddlcustcity').append('<option value="">Select City</option>');

}

function FetchCustomerDetails() {
    

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/FetchCustomerDetails/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#tbl_customers > tbody").empty();
            if (data.length > 0) {
                $('#tb_cust').show();
                $('#txtsearch_tb_cust').show();
                for (var i = 0; i < data.length; i++) {

                    $('#tbl_customers > tbody').append('<tr><td>' + data[i].CustomerName + '</td><td>' + data[i].CountryName + '</td><td>' + data[i].StateName + '</td><td>' + data[i].CityName + '</td><td><a class="btn btn-xs btn-primary" onclick="editCustomers(\'' + data[i].CustomerID + '\',\'' + data[i].AdminID + '\',\'' + data[i].CustomerName + '\',\'' + data[i].CustomerAddress + '\',\'' + data[i].CountryID + '\',\'' + data[i].StateID + '\',\'' + data[i].CityID + '\',\'' + data[i].PinCode + '\',\'' + data[i].Website + '\',\'' + data[i].PhoneNo + '\',\'' + data[i].AdminName + '\',\'' + data[i].AdminEmail + '\',\'' + data[i].AdminMobile + '\',\'' + data[i].SubscriptionFrom + '\',\'' + data[i].SubscriptionTo + '\',\'' + data[i].SubscriptionType + '\')"><i class="fa fa-edit"></i> Edit</a></td></tr>');

                }
            }
            else {
                $('#txtsearch_tb_cust').hide();
                $('#tb_cust').hide();
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(response.status + ' ' + response.statusText);
            }
            return false;
            jQuery.unblockUI();
        }

    });
    jQuery.unblockUI();

}

function editCustomers(CustomerID, AdminID, CustomerName, CustomerAddress, CountryID, StateID, CityID, PinCode, Website, PhoneNo, AdminName, AdminEmail, AdminMobile, SubscriptionFrom, SubscriptionTo, SubscriptionType) {
    $('#btn_submit').html('Modify');
    $('#hddn_Cust_ID').val(CustomerID);
    $('#hddn_Admin_ID').val(AdminID);
    $('#txtcustomername').val(CustomerName);
    $('#txtcustaddress').val(CustomerAddress);
    $('#ddlcustcountry').val(CountryID)
    fillStateDropDown("ddlcuststate", StateID);
    setTimeout(function () { fillCityDropDown("ddlcustcity", CityID); }, 1000)
   
    $('#txtcustpincode').val(PinCode);
    $('#txtcustomerphone').val(PhoneNo);
    $('#txtcustwebsite').val(Website);
    $('#txtcustAdminName').val(AdminName);
    $('#txtcustAdminemail').val(AdminEmail);
    $('#txtcustmobile').val(AdminMobile);
    
    if (SubscriptionType == 'Free') {
        $('input[name="optionsRadios"]').closest('span').removeClass('checked');
        $('#free_trial').attr('checked', true);
        $('#free_trial').closest('span').addClass('checked')
    }else if(SubscriptionType =='Basic'){
        $('input[name="optionsRadios"]').closest('span').removeClass('checked');
        $('#basic_trial').attr('checked', true);
        $('#basic_trial').closest('span').addClass('checked')
    }
    else if (SubscriptionType == 'Professional') {
        $('input[name="optionsRadios"]').closest('span').removeClass('checked');
        $('#professional_trial').attr('checked', true);
        $('#professional_trial').closest('span').addClass('checked')
    }
    else {
        $('input[name="optionsRadios"]').closest('span').removeClass('checked');
        $('#enterprise_trial').attr('checked', true);
        $('#enterprise_trial').closest('span').addClass('checked')
    }
    
    $('#txtcustdatefrom').val(SubscriptionFrom);
    $('#txtcustdateto').val(SubscriptionTo);
    



}

jQuery("#txtSearch").keyup(function () {
    
    _this = this;
    
    // Show only matching TR, hide rest of them
    jQuery.each($("#tbl_customers tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
            
        else
            jQuery(this).show();
    });
});