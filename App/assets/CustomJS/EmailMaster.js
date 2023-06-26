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

    CKEDITOR.replace('emailBody');
    CKEDITOR.replace('emailFooter');
    CKEDITOR.replace('emailSignature');

    setCommonData();

    FormValidate();
    fetchEmailMasters();
    fetchMenuItemsFromSession(19, 62);

});

var error = $('#errordiv');
var success = $('#successdiv');
var subcaterror = $('#errordiv1');
var subcatsuccess = $('#successdiv1');

function FormValidate() {

    $('#Emailmaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            emailEventName: {
                required: true
            },

            emailSubject: {
                required: true
            },

            emailBody: {
                required: true
            }

        },
        messages: {

            emailEventName: {
                required: "Event Name is required"
            },

            emailSubject: {
                required: "Email Subject is required"
            },

            emailBody: {
                required: "Email Body is required"
            }

        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            subcatsuccess.hide();
            jQuery("#errormsg").text("You have some form errors. Please check below.");
            subcaterror.show();
            subcaterror.fadeOut(6000)
            App.scrollTo(subcaterror, -300);
        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.xyz').addClass('has-error'); // set error class to the control group
            $(element).closest('.xyz').addClass('has-error'); // set error class to the control group

        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.xyz').removeClass('has-error'); // set error class to the control group
            $(element)
                .closest('.xyz').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.xyz').removeClass('has-error');
            label.closest('.xyz').removeClass('has-error');
            label.remove();
        },

        submitHandler: function (form) {
            var id = document.activeElement.getAttribute('id');

            if (id.trim() == "submitbtnmaster") {
                emailMaster();
            } else {
                updateEmailMaster();
            }
        }
    });


}

function emailMaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    let regex = /&(nbsp|amp|quot|lt|gt);/g;
    let mailsubdata = $('#emailSubject').val().replace(regex, "");
    var emailBody_data = CKEDITOR.instances['emailBody'].getData();
    var mailbodydata1 = emailBody_data.replace(/(<([^>]+)>)/ig, ' ').replace(/\n/g, ' ');
    let mailbodydata = mailbodydata1.replace(regex, "");
    var emailFooter_data = CKEDITOR.instances['emailFooter'].getData();
    var emailSignature_data = CKEDITOR.instances['emailSignature'].getData();

    var arrStr = mailsubdata.split(" ");
    var arrNewStr = [];
    var arrStrBody = mailbodydata.split(" ");
    var arrNewStrBody = [];

    if (arrStr.length > 0) {
        arrStr.forEach(function (str) {
            var result = str.match("~");
            if (result) {
                arrNewStr.push(str);
            }
        });
        if (arrNewStr != '' && arrNewStr != null) {
            var subjectVariables = arrNewStr.toString().replace(/[,:]/g, "");
        } else {
            var subjectVariables = '';
        }

    }

    if (arrStrBody.length > 0) {
        arrStrBody.forEach(function (strbody) {
            var bodyresult = strbody.match("~");
            if (bodyresult) {
                arrNewStrBody.push(strbody);
            }
        });
        if (arrNewStrBody != '' && arrNewStrBody != null) {
            var bodyVariables = arrNewStrBody.toString().replace(/[,:]/g, "");
        } else {
            var bodyVariables = '';
        }

    }

    var data = {
        "emailEvent": $('#emailEventName').val(),
        "emailSubject": $('#emailSubject').val(),
        "mailTo": $('#emailTo').val(),
        "mailCC": $('#emailCc').val(),
        "mailBCC": $('#emailBcc').val(),
        "emailBody1": emailBody_data,
        "footer": emailFooter_data,
        "emailSig": emailSignature_data,
        "subvariableName": subjectVariables,
        "bodyvariableName": bodyVariables,
        "createdBy": sessionStorage.getItem('UserID')

    }
    console.log(JSON.stringify(data));

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "EmailMaster/EmailMasterSubmit",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (json) {
            //alert("success");
            subcaterror.hide();
            $("#successmsg").html("Email Event Submitted Successfully.");
            subcatsuccess.show();
            subcatsuccess.fadeOut(5000);
            App.scrollTo(subcatsuccess, -200);
            setTimeout(function () {
                resetMailmaster();
                fetchEmailMasters();
            }, 5000);

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                $('#error').html('You have some errors')
                error.show();
                error.fadeOut(5000)
            }
            return false;
            jQuery.unblockUI();
        }

    });

    jQuery.unblockUI();


}

function fetchEmailMasters() {
    //debugger;    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "EmailMaster/FetchEmailMaster",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (json) {
            var fetchEmail = JSON.parse(json[0].jsondata);
            //console.log(JSON.parse(json[0].jsondata));
            $('#tblFetchEmailMastr').empty();
            //alert(json.length);
            if (json.length > 0) {
                $('#searchmaster').show();
                $('#tblFetchEmailMastr').append('<thead><tr><th>Actions</th><th>Email Event</th></tr></thead>')
                for (var i = 0; i < fetchEmail.length; i++) {

                    $('#tblFetchEmailMastr').append('<tr id=rowid' + i + '><td><a href=# class="btn btn-xs yellow" onclick="editemailEvent(\'' + fetchEmail[i].emailMstID + '\')"><i class="fa fa-pencil"></i> Edit</a></td><td >' + fetchEmail[i].emailEvent + '</td></tr>')

                }
            }
            else {
                $('#searchmaster').hide();
                return true
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

function editemailEvent(emailMstID) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var emailIdData = emailMstID;
    $('#emailMstID').val(emailIdData);
    //console.log("emailIdData", emailIdData);
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "EmailMaster/FetchEmailMasterEdit?emailMstID=" + emailIdData,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (json) {
            var fetchEmail = JSON.parse(json[0].jsondata);
            //console.log(fetchEmail);            
            //alert('edit');
            $('#updatebtnmaster').removeClass('hide');
            $('#submitbtnmaster').addClass('hide');
            $('#emailEventName').val(fetchEmail[0].emailEvent);
            $('#emailEventName').attr('disabled', 'disabled');

            $('#emailSubject').val(fetchEmail[0].emailSubject);
            $('#emailTo').val(fetchEmail[0].mailTo);
            $('#emailCc').val(fetchEmail[0].mailCC);
            $('#emailBcc').val(fetchEmail[0].mailBCC);
            CKEDITOR.instances['emailBody'].setData(fetchEmail[0].T[0].emailBody1.replace(/\\n/g, ''));
            CKEDITOR.instances['emailFooter'].setData(fetchEmail[0].T[0].footer.replace(/\\n/g, ''));
            CKEDITOR.instances['emailSignature'].setData(fetchEmail[0].T[0].emailSig.replace(/\\n/g, ''));

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

function updateEmailMaster() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    debugger;
    var emailSubject_data = $('#emailSubject').val();
    var mailsubdata1 = emailSubject_data.replace(/(<([^>]+)>)/ig, ' ').replace(/\n/g, ' ');
    let regex = /&(nbsp|amp|quot|lt|gt);/g;
    let mailsubdata = mailsubdata1.replace(regex, "");
    var emailBody_data = CKEDITOR.instances['emailBody'].getData();
    var mailbodydata1 = emailBody_data.replace(/(<([^>]+)>)/ig, ' ').replace(/\n/g, ' ');
    let mailbodydata = mailbodydata1.replace(regex, "");
    var emailFooter_data = CKEDITOR.instances['emailFooter'].getData();
    var emailSignature_data = CKEDITOR.instances['emailSignature'].getData();

    var arrStr = mailsubdata.split(" ");
    var arrNewStr = [];
    var arrStrBody = mailbodydata.split(" ");
    var arrNewStrBody = [];

    if (arrStr.length > 0) {
        arrStr.forEach(function (str) {
            var result = str.match("~");
            if (result) {
                arrNewStr.push(str);
            }
        });
        if (arrNewStr != '' && arrNewStr != null) {
            var subjectVariables = arrNewStr.toString().replace(/[,:]/g, "");
        } else {
            var subjectVariables = '';
        }

    }

    if (arrStrBody.length > 0) {
        arrStrBody.forEach(function (strbody) {
            var bodyresult = strbody.match("~");
            if (bodyresult) {
                arrNewStrBody.push(strbody);
            }
        });
        if (arrNewStrBody != '' && arrNewStrBody != null) {
            var bodyVariables = arrNewStrBody.toString().replace(/[,:]/g, "");
        } else {
            var bodyVariables = '';
        }

    }

    var data = {
        "emailMstID": parseInt($('#emailMstID').val().trim()),
        "emailSubject": $('#emailSubject').val(),
        "mailTo": $('#emailTo').val(),
        "mailCC": $('#emailCc').val(),
        "mailBCC": $('#emailBcc').val(),
        "emailBody1": emailBody_data,
        "footer": emailFooter_data,
        "emailSig": emailSignature_data,
        "subvariableName": subjectVariables,
        "bodyvariableName": bodyVariables,
        "createdBy": sessionStorage.getItem('UserID')

    }
    //console.log(JSON.stringify(data));

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "EmailMaster/EmailMasterUpdate",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (json) {
            //alert("success");
            subcaterror.hide();
            $("#successmsg").html("Email Event Updated Successfully");
            subcatsuccess.show();
            subcatsuccess.fadeOut(5000);
            App.scrollTo(subcatsuccess, -200);
            setTimeout(function () {
                resetEmailmaster();
                fetchEmailMasters();
            }, 5000)

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                $('#error').html('You have some errors')
                error.show();
                error.fadeOut(5000)
            }
            return false;
            jQuery.unblockUI();
        }

    });

    jQuery.unblockUI();


}

function resetEmailmaster() {

    $('#submitbtnmaster').removeClass('hide');
    $('#updatebtnmaster').addClass('hide');
    $('#emailEventName').val('');
    $('#emailEventName').removeAttr('disabled', 'disabled');
    $('#emailSubject').val('');

    $('#emailTo').val('');
    $('#emailCc').val('');
    $('#emailBcc').val('');
    CKEDITOR.instances['emailBody'].setData('');
    CKEDITOR.instances['emailFooter'].setData('');
    CKEDITOR.instances['emailSignature'].setData('');

}

function resetMailmaster() {
    $('#emailEventName').val('');
    $('#emailEventName').removeAttr('disabled', 'disabled');
    $('#emailSubject').val('');
    $('#emailTo').val('');
    $('#emailCc').val('');
    $('#emailBcc').val('');
    CKEDITOR.instances['emailBody'].setData('');
    CKEDITOR.instances['emailFooter'].setData('');
    CKEDITOR.instances['emailSignature'].setData('');

}