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
    fetchMenuItemsFromSession(19, 67);
    formValidate()
    fetchProjectMaster()
});

var error = $('#errordiv');
var success = $('#successdiv');

success.hide();
error.hide();


$('#projectName').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});


/*
 search here start
 */
jQuery("#search").keyup(function () {

    jQuery("#projectMasterTable tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#projectMasterTable tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#projectMasterTable tr:has(td)").children().each(function () {

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
function formValidate() {

    jQuery('#frmProjectMaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            projectName: {
                required: true
            }

        },
        messages: {
            projectName: {
                required: "ProjectName is required."
            }
        },

        invalidHandler: function (event, validator) { //display error alert on form submit   
            success.hide();
            jQuery("#error").text("Please enter minimum 8 characters.");
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
            postProjectMaster();    
        }
    });

}
/*form validation end*/




/*
 postProjectMaster start
*/

function postProjectMaster() {

    var _cleanString = StringEncodingMechanism(jQuery("#projectName").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var status = "";
    if (jQuery("#checkboxactive").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }   

    var data = {
        "id": parseInt($('#hddnprojectID').val()),
        "ProjectName": _cleanString,
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
        "IsActive": status, 
    }
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ProjectMaster/postProjectMaster",
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
                $("#success").html("Successfull...");
                success.show();
                success.fadeOut(3000);
                fetchProjectMaster();             
                jQuery.unblockUI();
            }

            else if (data.isSuccess == '0') {
                success.hide();
                 $("#errordiv").html("ProjectName Already exists..");
                error.show();
                error.fadeOut(3000);
                jQuery.unblockUI();
            }

            setTimeout(function () {
                window.location.reload();
            }, 3000);

        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                $("#errordiv").html("Unauthorized...");
            }
            else {
                success.hide();
                $("#errordiv").html("oops some error occurs...");
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
 postProjectMaster end
*/


/*
 fetchProjectMaster start
*/
function fetchProjectMaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = sessionStorage.getItem("APIPath") + "ProjectMaster/fetchProjectMasterCust/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=M&MappedBy=" + sessionStorage.getItem('UserID');
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        success: function (data) {
        jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#projectMasterTable").empty();
            if (data.length > 0) {

                jQuery("#projectMasterTable").append("<thead id='tblheader'><th>Edit</th><th>Project Name</th><th>Status</th></thead>");

                for (var i = 0; i < data.length; i++) {
                    /*jQuery("#projectMasterTable").append(jQuery('<tbody><tr><td>' + StringDecodingMechanism(data[i].projectName) + '</td></tr><tbody>'));*/
                    jQuery('<tr><td><button class="btn yellow " onclick="updateType(\'' + data[i].projectName + '\',\'' + data[i].isActive + '\',\'' + data[i].id + '\')"><i class="fa fa-pencil"></i></button></td><td> ' + data[i].projectName + '</td><td>' + data[i].isActive + '</td></tr>').appendTo("#projectMasterTable");
                }
            }
            else {
                jQuery("#projectMasterTable").append('<tr><td>No Information is there..</td></tr>');
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
/*
 fetchProjectMaster end
*/

/*update type start here*/

function updateType(pname, status,id) {
                        
    $('#hddnprojectID').val(id);
    $('#projectName').val(pname);
    if (status == 'Active') {

        jQuery('input:checkbox[name=checkboxactive]').attr('checked', true);
        jQuery('#checkboxactive').parents('span').addClass('checked');

    }
    else {
        jQuery('input:checkbox[name=checkboxactive]').attr('checked', false);
        jQuery('#checkboxactive').parents('span').removeClass('checked');
    }
}
/*update type end here*/

