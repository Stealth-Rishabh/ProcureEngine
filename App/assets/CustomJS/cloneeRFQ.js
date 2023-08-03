jQuery(document).ready(function () {

    Pageloaded()
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        bootbox.alert("<br />Oops! Your session has been expired. Please re-login to continue.", function () {
            window.location = sessionStorage.getItem('MainUrl');
            return false;
        });
    }
    else {
        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }

    App.init();
    Metronic.init(); Layout.init(); ComponentsPickers.init(); setCommonData();
   // fetchMenuItemsFromSession(7, 26);
    formvalidate();

});

var _rfqTypeId = 0;
function Pageloaded() {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param);
    _rfqTypeId = "Open";

     
}





var form = $('#RFIRFQReport');
function formvalidate() {
    debugger;
    form.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

        errorElement: 'span', //default input error message container

        errorClass: 'help-block help-block-error', // default input error message class

        focusInvalid: false, // do not focus the last invalid input

        rules: {
            txtSearchText: {
                required: true
            }


        },

        messages: {
            txtSearchText: {
                required: "Please Enter Search Text."
            }
        },



        invalidHandler: function (event, validator) {

        },

        highlight: function (element) {

            $(element).closest('.col-md-12').addClass('has-error');

        },

        unhighlight: function (element) {

            $(element).closest('.col-md-12').removeClass('has-error');

        },

        success: function (label) {


        },


        submitHandler: function (form) {
          //  debugger
            fetchRFQDetailsForCloning()
        }

    });

}

function fetchRFQDetailsForCloning() { 
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wai    t...</h5>' });

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/fetchRFQDetailsForCloning?searchText=" + $('#txtSearchText').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
          
          //  console.log(data);
;            $('#tblRFQDetails > tbody').empty();
            if (data.length > 0) {
                $('#displayTable').show();
                for (var i = 0; i < data.length; i++) {

                    var details = (data[i].rfqDetails).replace(/(\r\n|\n|\r)/gm, "");

                    $("<tr><td>" + data[i].eventNo + "</td><td>" + data[i].rfqSubject + "</td><td>" + data[i].rfqDetails + "</td><td>" + fnConverToLocalTime(data[i].rfqDate) + "</td><td>" + data[i].status + "</td><td><button class=\"btn btn-sm btn-primary\" type=\"button\" Onclick=\"confirmCloningRFQ(\'" + data[i].eventNo + "'\,\'" + data[i].rfqSubject + "'\,\'" + details + "'\,\'" + fnConverToLocalTime(data[i].rfqDate) + "'\,\'" + data[i].eventNo + "'\)\" >Clone</button></td></tr>").appendTo('#tblRFQDetails');
                }

            } else {
                $('#displayTable').show();
                $('<tr><td style="color:red !important; text-align: center;" colspan="7"> No results </td></tr>').appendTo('#tblRFQDetails');

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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

function confirmCloningRFQ(RFQId, RFQSubject, RFQDescription, RFQConfigureDate, SrNo) {
    bootbox.dialog({
        message: "You are about to clone following RFQ with details: <br/><br/>" +
            "<table class=\"table table-striped table-bordered table-hover\"><tr><td>Event No</td><td>" + SrNo +
            "</td></tr><tr><td>RFQ Subject</td><td>" + RFQSubject +
            "</td></tr><tr><td>RFQ Description</td><td>" + RFQDescription +
            "</td></tr><tr><td>RFQdate</td><td>" + RFQConfigureDate + "</td></tr></table>",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    $('.modal-footer .btn-success').prop('disabled', true); //abheedev button duplicate
                    cloneRFQ(RFQId)
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {

                }
            }
        }
    });
}

function cloneRFQ(RFQId) {

    var param = {
        "RFQId": parseInt(RFQId),
        "UserId": sessionStorage.getItem('UserID')

    };

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/CloneExistingRFQ",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(param),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            //alert(data[0].IsSuccess)
            if (parseInt(data) > 0) {
                jQuery('#divalerterror').hide();
                msgForClonedRFQ(parseInt(data), "7");
                // fileUploader(parseInt(data))
               // fetchRFQDetailsForCloning();
            } else {
                jQuery('#divalertsucess').hide();
                $("#error").html('Transaction Unsuccessfull.');
                App.scrollTo($('#divalerterror'), -200);
                jQuery('#divalerterror').slideDown(1000);
                $('#divalerterror').fadeOut(5000);
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
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
    //clearform();
}
function clearform() {
    jQuery("#txtUsername").val('');
    jQuery("#txtemail").val('');
    jQuery("#txtmobilno").val('');
    jQuery("#txtuserrole").val('');
    jQuery('#hdnUserID').val('0');
    jQuery("#ddlroleMaster").val('');
    jQuery('div#divrblist span').each(function () {
        $(this).attr('class', '');
    });

}

jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblRFQDetails tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});


function msgForClonedRFQ(RFQID, RFQTypeId) {
    var encrypdata = fnencrypt("RFQID=" + RFQID)
    var urlLink = '';
    urlLink = 'eRequestForQuotation.html?param=' + encrypdata;
            
    bootbox.dialog({
        message: "RFQ clonned successfully. Do you want to modify RFQ details?",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    $('.modal-footer .btn-success').prop('disabled', true);  
                    window.location = urlLink;
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {
                    window.location = sessionStorage.getItem("HomePage");
                }
            }
        }
    });
}


function fileUploader(RFQID) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var formData = new window.FormData();

    formData.append("fileTerms", '');

    formData.append("fileAnyOther", '');

    formData.append("AttachmentFor", 'RFQ');

    formData.append("RFQID", RFQID);
    formData.append("VendorID", '');
    formData.append("isClonedRFQ", '1');


    $.ajax({

        url: 'ConfigureFileAttachment.ashx',

        data: formData,

        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function (data) {
            jQuery.unblockUI();
        },

        error: function () {

            bootbox.alert("Attachment error.");
            jQuery.unblockUI();
        }

    });

}