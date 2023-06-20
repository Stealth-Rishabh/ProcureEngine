jQuery(document).ready(function () {

    Pageloaded()
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
    fetchMenuItemsFromSession(19, 58);
    FormValidate();
    fetchConditionmaster();

});

var error = $('#errordiv');
var success = $('#successdiv');

success.hide();
error.hide();
$('#conditionName').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

function FormValidate() {

    jQuery('#frmconditionMaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            conditionName: {
                required: true
            },
            conditionSr: {
                required: true
            }
        },
        messages: {

            conditionName: {
                required: "Condition is required."
            },
            conditionSr: {
                required: "Condition Sr. is required."
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
            insupdconditionmaster();
        }
    });

}

function insupdconditionmaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";
    if (jQuery("#checkboxactive").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }

    var data = {
        "conditionID": parseInt($('#hddnConditionID').val()),
        "conditionName": $('#conditionName').val(),
        "IsActive": status,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "conditionSr": $('#conditionSr').val(),
        "createdBy": sessionStorage.getItem('UserID')
    }

    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "NFA/InsUpdConditionMaster",
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
                fetchConditionmaster();
                jQuery.unblockUI();
            }
            else if (data == '2') {
                $("#success").html("Updation Successfull...");
                success.show();
                success.fadeOut(3000);
                fetchConditionmaster();
                jQuery.unblockUI();

            }
            else if (data == '3') {
                success.hide();
                $("#error").html("Condition already exists..");
                error.show();
                error.fadeOut(3000);
                jQuery.unblockUI();
            }
            resetform();
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

function fetchConditionmaster() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "NFA/fetchNFACondition/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&IsActive=T",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblPlaceMaster").empty();
            var status = "No";
            if (data.result.length > 0) {
                jQuery("#tblPlaceMaster").append("<thead id='tblheader'><th>#</th><th>Condition Sr.</th><th>Condition</th><th>Status</th></thead>");
                for (var i = 0; i < data.result.length; i++) {
                    if (data.result[i].isActive == "N") {
                        status = "No";
                    }
                    else {
                        status = "Yes";
                    }
                    jQuery('<tr><td><button class="btn btn-xs yellow " onclick="updateType(\'' + data.result[i].conditionName + '\',\'' + data.result[i].isActive + '\',\'' + data.result[i].conditionID + '\',\'' + data.result[i].conditionSr + '\')"><i class="fa fa-pencil"></i></button></td><td> ' + data.result[i].conditionSr + '</td><td> ' + data.result[i].conditionName + '</td><td>' + status + '</td></tr>').appendTo("#tblPlaceMaster");
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

function updateType(rname, status, id, srno) {

    $('#hddnConditionID').val(id);
    $('#conditionName').val(rname);
    $('#conditionSr').val(srno);
    if (status == 'Y') {
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


function resetform() {
    $('#conditionName').val('');
    $('#hddnConditionID').val('0')
    $('#conditionSr').val('');
    jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
    jQuery('#checkboxactive').parents('span').addClass('checked');

}