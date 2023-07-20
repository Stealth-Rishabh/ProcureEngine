jQuery(document).ready(function () {

    $('.maxlength').maxlength({
        limitReachedClass: "label label-danger",
        alwaysShow: true
    });

    Pageloaded()
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if (sessionStorage.getItem("UserType") == "P" || sessionStorage.getItem("UserType") == "V" || sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }


    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param);
    var POID = getUrlVarsURL(decryptedstring)["POHID"];
    if (POID == null)
        sessionStorage.setItem('hddnPOHID', 0)
    else {

        sessionStorage.setItem('hddnPOHID', POID)
        setTimeout(function () {
            fetchPODetails('Attachment');
            fetchPODetails('Details');
            FetchRecomendedVendor();
            $('#POID').html(POID)
        }, 1000)
    }
    Metronic.init();
    Layout.init();
    formvalidate();

    setCommonData();

});

var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)

var Type = getUrlVarsURL(decryptedstring)["Type"];

var status = '';


if (Type == 'P') {
    $('#HDAction').removeClass('hide')
    $('#div_action').removeClass('hide')
    $('#div_status').addClass('hide')
}
else {
    $('#HDAction').addClass('hide')
    $('#div_action').addClass('hide')
    $('#div_status').removeClass('hide')

    if (Type == 'R') {

        $('#POStatus').css("color", "red")
        $('#POStatus').html("Reverted")
    }
    else if (Type == 'F') {
        $('#POStatus').css("color", "blue")
        $('#POStatus').html("Pending")
    }
    else {
        $('#POStatus').css("color", "green")
        $('#POStatus').html("Accepted")
    }

}
$('#txtRemarks').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

var form = $('#frmsubmitapp');
function formvalidate() {

    form.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

        errorElement: 'span', //default input error message container

        errorClass: 'help-block help-block-error', // default input error message class

        focusInvalid: false, // do not focus the last invalid input

        rules: {

            txtRemarks: {
                required: true
            },
            ddlActionType: {
                required: true
            }

        },

        messages: {
            txtremarks: {
                required: "Please Enter Remarks."
            },
            ddlActionType: {
                required: "Please Select Action."
            }
        },



        invalidHandler: function (event, validator) {

        },

        highlight: function (element) {

            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {

            $(element).closest('.xyz').removeClass('has-error');

        },

        success: function (label) {


        },
        submitHandler: function (form) {

            acceptRevertPO();

        }

    });

}
function fetchPODetails(flag) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var _vendorid = 0;
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "POUpload/PODetails/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&Flag=" + flag + "&POHeaderID=" + sessionStorage.getItem('hddnPOHID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            var attach = "";
            _vendorid = data[0].vendorID;
            sessionStorage.setItem('VendorId', _vendorid);
            if (data.length > 0) {
                if (flag == "Details") {

                    jQuery("#tblServicesProduct").empty();
                    jQuery('#tblServicesProduct').append("<thead><tr style='background: gray; color: #FFF;'><th>Item Code</th><th>Item/Service</th><th>Delivery Location</th><th>Po No</th><th>Delivery/Completion Date</th><th>Quantity</th><th>UOM</th></tr></thead>");
                    for (var i = 0; i < data.length; i++) {
                        jQuery("#tblServicesProduct").append('<tr><td  style="width:20%!important;">' + data[i].itemCode + '</td><td>' + data[i].itemServiceName + '</td><td>' + data[i].deliveryLocation + '</td><td>' + data[i].poNo + '</td><td class=text-right>' + data[i].poDeliveryDate + '</td><td class=text-right>' + thousands_separators(data[i].quantity) + '</td><td>' + data[i].uom + '</td></tr>');
                    }
                }
                else {
                    jQuery("#tblAttachments").empty();
                    $('#spnsentbyname').html("<b>" + data[0].createdByName + "</b>")
                    $('#PODate').html("<b>" + fnConverToLocalTime(data[0].actionTakenOn) + "</b>")
                    $('#txtvendorremarks').html("<b>" + data[0].userRemarks + "</b>")
                    $('#headerotherrfqattach').removeClass('hide')
                    $('#div_POAttach').removeClass('hide')
                    jQuery('#tblAttachments').append("<thead><tr style='background: gray; color: #FFF;'><th class='bold'>Description</th><th class='bold'>Attachment</th></tr></thead>");
                    for (var i = 0; i < data.length; i++) {
                        attach = data[i].poAttachment.replace(/\s/g, "%20");
                        var str = '<tr><td style="width:47%!important">' + data[i].poAttachmentDescription + '</td><td class=style="width:47%!important"><a id=POattach' + i + ' style="pointer:cursur;text-decoration:none;"  onclick="DownloadFileVendor(this)" href=javascript:; >' + data[i].poAttachment + '</a></td></tr>';

                        jQuery('#tblAttachments').append(str);
                    }
                }
            }

            else {
                if (flag == "Details") {
                }
                else {
                    $('#headerotherrfqattach').addClass('hide')
                    $('#div_POAttach').addClass('hide')
                    jQuery('#tblAttachments').append("<tr><td>No Attachments!!</td></tr>")
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
    })
}
function acceptRevertPO() {

    var _cleanString = StringEncodingMechanism($('#txtRemarks').val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var attchname = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1)
    attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
    var Approvers = {
        "POHeaderID": parseInt(sessionStorage.getItem('hddnPOHID')),
        "VendorID": parseInt(sessionStorage.getItem('VendorId')),
        //"Remarks": $('#txtRemarks').val(),
        "Remarks": _cleanString,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ActionType": "Vendor",
        "Action": $('#ddlActionType').val(),
        "UserID": sessionStorage.getItem('UserID'),
        "Attachment": attchname
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "POUpload/acceptRevertPO",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {
            var msz = '';

            // if (data.length > 0) {
            if ($('#ddlActionType').val() == "Accept") {
                msz = "Thanks for the PO Acceptance..";
            }
            else {
                msz = "This PO is now reverted to User.";
            }
            //** Upload Files on Azure PortalDocs folder first Time
            if (attchname) {
                fnUploadFilesonAzure('file1', attchname, 'PO/' + sessionStorage.getItem('hddnPOHID') + '/' + sessionStorage.getItem('VendorId'));

            }

            bootbox.alert(msz, function () {
                window.location = "VendorHome.html";
                jQuery.unblockUI();
                return false;
            });


            // }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
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

function FetchRecomendedVendor() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "PoUpload/POHistory/?POHeaderID=" + sessionStorage.getItem('hddnPOHID') + "&UserID=" + (sessionStorage.getItem("VendorId")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $('#tblremarksforward').empty()
            var attach = '';
            if (data.length > 0) {
                $('#HDHistory').removeClass('hide')
                $('#frmdivforward').removeClass('hide')
                $('#tblremarksforward').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th class=hide id=thforward>Recommended Vendor</th><th>Completion DT</th><th>Attachment</th></tr>')
                // if (AppStatus == 'Reverted') {

                for (var i = 0; i < data.length; i++) {
                    attach = data[i].attachment.replace(/\s/g, "%20");
                    if (data[i].vendorName != "") {
                        $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td><td><a style="pointer:cursur;text-decoration:none;" id=POHistory' + i + ' onclick="DownloadFile(this)" href="javascript:;" >' + data[i].attachment + '</a></td></tr>')
                        $('#thforward').removeClass('hide')
                    }
                    else {
                        $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + fnConverToLocalTime(data[i].receiptDt) + '</td><td><a id=POHistory' + i + ' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)" >' + data[i].attachment + '</a></td></tr>')
                        $('#thforward').addClass('hide')
                    }


                }

            }
            else {
                $('#HDHistory').addClass('hide')
                $('#frmdivforward').addClass('hide')
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
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
function DownloadFile(aID) {
    //fnDownloadAttachments($("#" + aID.id).html(), 'PO/' + sessionStorage.getItem('hddnPOHID'));
    fnDownloadAttachments($("#" + aID.id).html(), 'PO/' + sessionStorage.getItem('hddnPOHID') + '/' + sessionStorage.getItem('VendorId'));
}
function DownloadFileVendor(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'PO/' + sessionStorage.getItem('hddnPOHID') + '/' + sessionStorage.getItem('VendorId'));
}


//abheedev
function multilingualLanguage() {

    var set_locale_to = function (locale) {
        if (locale) {
            $.i18n().locale = locale;
        }

        $('body').i18n();
    };
    jQuery(function () {
        $.i18n().load({
            'en': 'assets/plugins/jquery.i18n/language/en/translation.json', // Messages for english
            'fr': 'assets/plugins/jquery.i18n/language/fr/translation.json' // message for french
        }).done(function () {
            set_locale_to(url('?locale'));

            $(".navbar-language").find(`option[value=${$.i18n().locale}]`).attr("selected", "selected")

            //   <option data-locale="en" value="en">English</option>

            History.Adapter.bind(window, 'statechange', function () {
                set_locale_to(url('?locale'));

            });
            $('.navbar-language').change(function (e) {

                e.preventDefault();
                $.i18n().locale = $('option:selected', this).data("locale");


                History.pushState(null, null, "?locale=" + $.i18n().locale);



            });

            $('a').click(function (e) {

                if (this.href.indexOf('?') != -1) {
                    this.href = this.href;
                }
                else if (this.href.indexOf('#') != -1) {
                    e.preventDefault()
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }
                //else if (this.href.indexOf('javascript:') != -1) {

                //  this.href = this.href + "?locale=" + $.i18n().locale;
                //} 

                else {
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }
            });
        });
    });
}