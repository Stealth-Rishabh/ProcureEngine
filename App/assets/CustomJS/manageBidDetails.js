var APIPath = sessionStorage.getItem("APIPath");
clearsession()
var biddatetime = getCurrentDateddmmyyyy();
var currentdate = new Date();
$('#txreopenTime').val('')
function thouandseparator() {
    $(".thousandseparated").inputmask({
        alias: "decimal",
        rightAlign: false,
        groupSeparator: ",",
        radixPoint: ".",
        autoGroup: true,
        integerDigits: 40,
        digitsOptional: true,
        allowPlus: false,
        allowMinus: false,
        'removeMaskOnSubmit': true

    });
}
thouandseparator();
$('#txtbid,#txtvendor,#txtBidDurationPrev,#txtvendorSurrogateBid,#txtdestinationPort,#txtshortname,#txtpricefrequency').maxlength({
    alwaysShow: true
});

//var form1 = $('#entryForm');
$(".surrogateFormElements").hide();
var error1 = $('.alert-danger');
var success1 = $('.alert-success');
var error2 = $('#errormapdiv');
var erroropenbid = $('#errorOpenbid');
var errorremainder = $('#errorsendremainder');
var success2 = $('#successmapdiv');
var successopenbid = $('#successopenbid');
var succesremainder = $('#successremainder');

var successprebid = $('#successprebid');
var errorprebid = $('#errorprebid');
var errorReOpen = $('#diverrorreopen');
var successreOpen = $('#successreopen');

var hdnSeId = 0;
var isNewLineItem = 'N';
var isBidEventChanged = false;
var isRunningBid = '';
var _bidClosingType = '';

// edit mode inputs for events editddlbid

jQuery("#divbidDatePrevtab_0").hide();
$("#btn-submit-datetime").hide();
//jQuery("#divbidTimePrevtab_0").hide();
jQuery("#divbidTermsFilePrevtab_0").hide();
jQuery("#divbidAttachFilePrevtab_0").hide();
jQuery("#divbidItemsPrevtab_0").hide();
jQuery("#eventDetailstab_0").hide();
jQuery("#btnuserConfirmation").hide();
jQuery("#eventUpdateStatusTab5").hide();
jQuery("#divbidShowL1L2").hide();
jQuery("#divhidevendors").hide();
jQuery("#divbidextension").hide();
$('#div_surrogate').hide()
$('#divremovequotes').hide();
$('#prebid').hide();

if (sessionStorage.getItem("BidPreApp") == "N" || sessionStorage.getItem("BidPreApp") == undefined || sessionStorage.getItem("BidPreApp") == null || sessionStorage.getItem("BidPreApp") == '') {
    $('#litab0').show().addClass('active');
    $('#litab1').show();
    $('#litab2').show();
    $('#litab3').show();
    $('#litab4').show();
    $('#litab5').show();
    //$('#tab_6').removeClass('active')
    $('#litab3').removeClass('active');

}
else {
    $('#litab0').hide();
    $('#litab1').hide();
    $('#litab2').hide();
    $('#litab4').hide();
    $('#litab5').hide();
    //$('#tab_6').addClass('active')
    $('#litab3').show().addClass('active')
    //$('#div_surrogate').show()
    $('#litab0').removeClass('active')

}

$("#editValuesModal").on("hidden.bs.modal", function () {
    jQuery("#divbidDatePrevtab_0").hide();
    $("#btn-submit-datetime").hide();
    $("#btn-submit-modal").show();
    //jQuery("#divbidTimePrevtab_0").hide();
    jQuery("#divbidTermsFilePrevtab_0").hide();
    jQuery("#divbidAttachFilePrevtab_0").hide();
    jQuery("#divbidItemsPrevtab_0").hide();
    jQuery("#divbidShowL1L2").hide();
    jQuery("#divhidevendors").hide();
    jQuery("#divbidextension").hide();
    hdnSeId = 0;
    isNewLineItem = 'N';
    $(".xyz").removeClass("has-error");
    $('.help-block-error').remove();
    $('.alert-success').hide();
    $('.alert-danger').hide();
});


function FormValidate() {
    sessionStorage.removeItem("shname")
    sessionStorage.removeItem("price")
    sessionStorage.removeItem("subtime")
    sessionStorage.removeItem("psid")
    sessionStorage.removeItem("caid")
    sessionStorage.removeItem("psheaderid")
    sessionStorage.removeItem("caheaderid")
    sessionStorage.removeItem("PriceSea")
    sessionStorage.removeItem("ExworkSea")
    sessionStorage.removeItem("SubmissionTymSea")
    sessionStorage.removeItem("QuantityAllocated")

    $('#maphead').validate({
        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            txtremarks: {
                required: true
            }
        },
        messages: {
            txtremarks: {
                required: "Remarks is required."
            }
        },

        errorPlacement: function (error, element) { // render error placement for each input type
            error.insertAfter(element); // for other inputs, just perform default behavior
        },

        invalidHandler: function (event, validator) { //display error alert on form submit

            success2.hide();
            jQuery("#err").text("You have some form errors. Please check below.");
            error2.show();
            error2.fadeOut(5000);
            App.scrollTo(error2, -200);
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.col-lg-4').removeClass('has-success').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-lg-4').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.col-lg-4').removeClass('has-error').addClass('has-success');
            label.remove(); // remove error label here

        },
        submitHandler: function (form) {
            error2.hide();
            if (sessionStorage.getItem("hdnbidtypeid") == 7) {
                deletePSquote();
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 6) {
                deletePEFAquote();
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 8) {
                deleteCoalquote();
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 9) {
                deleteFAquote();
            }

        }
    });
    var form = $('#frmItemeditvalues');

    form.validate({
        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtdestinationPort: {
                required: true
            },
            txtshortname: {
                required: true
            },
            /* txtbiddescriptionP: {
                 required: true
             },*/
            txtquantitiy: {
                required: true
            },
            txtUOM: {
                required: true
            },
            txtCeilingPrice: {
                required: true
            },
            txtminimumdecreament: {
                required: true
            },
            txtpricefrequency: {
                required: true
            },
            txtpriceincreamentamount: {
                required: true
            },
            txtitembidduration: {
                required: true
            },
            txtGST: {
                required: true,
                number: true
            },
            txtItemnameFrench: {
                required: true
            },
            txtquantitiyfrench: {
                required: true
            },
            txtminquantitiy: {
                required: true
            },
            txtmaxquantitiy: {
                required: true
            },
            txtCeilingPricefrench: {
                required: true
            },
            txtminimumdecreamentfrench: {
                required: true
            }

        },

        messages: {
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
            formSubmitEditEvent();
        }

    });
}
function fetchUserBids() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=0&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                sessionStorage.setItem('hdnAllBids', JSON.stringify(data));
            }
            else {
                error1.show();
                $('#spandanger').html('').html('No pending bids for which you can invite vendors.!');
                error1.fadeOut(6000);
                App.scrollTo(error1, -200);
            }
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;

        }

    });
}




var connection;
jQuery("#txtbid").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllBids');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.bidSubject] = username;
            usernames.push(username.bidSubject);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].bidId != "0") {

            if (connection != undefined && connection != null) {
                connection.stop().then(function () {
                    console.log('Closed');
                    connection = null;
                });
            }
            setTimeout(function () {

                connection = new signalR.HubConnectionBuilder().withUrl(sessionStorage.getItem("APIPath") + "bid?bidid=" + map[item].bidId + "&userType=E" + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID'))).withAutomaticReconnect().build();
                console.log('Not Started')
                connection.start({ transport: ['webSockets', 'serverSentEvents', 'foreverFrame', 'longPolling'] }).then(function () {
                    console.log("connection started")
                }).catch(function (err) {
                    console.log(err.toString())
                    bootbox.alert("You are not connected to the Bid.Please contact to administrator.")
                });
            }, 1000);
            jQuery("#eventUpdateStatusTab5").show();

            hdnSeId = 0;
            isRunningBid = '';
            var isBidEventChanged = false;
            jQuery("#btnuserConfirmation").hide();
            sessionStorage.setItem('hdnbid', map[item].bidId);
            jQuery("#ddlbid").val(map[item].bidId);


            if (sessionStorage.getItem("BidPreApp") == "N" || sessionStorage.getItem("BidPreApp") == undefined || sessionStorage.getItem("BidPreApp") == null || sessionStorage.getItem("BidPreApp") == '') {

                $("#eventDetailstab_0").show();
                $('#div_surrogate').show();
                $('#prebid').show();
                $('#divremovequotes').show();
                //$('.nav-tabs').find('li').removeClass('active')
                // $('.tab-pane').removeClass('active')

                if ((map[item].bidTypeID == "6" || map[item].bidTypeID == "7") && map[item].bidForID == 82) {
                    $('#litab8').hide();
                    $('#tab_8').hide();

                }
                else if (map[item].bidTypeID == "9") {
                    $('#litab8').hide();
                    $('#tab_8').hide();
                    $('#litab3').hide();
                    $('#tab_3').hide();
                }

            }
            else {
                $("#eventDetailstab_0").hide();
                $('#div_surrogate').show();
                $('#prebid').show();
                $('#divremovequotes').show();
                $('.nav-tabs').find('li').removeClass('active')
                $('.tab-pane').removeClass('active')


                if ((map[item].bidTypeID == "6" || map[item].bidTypeID == "7") && map[item].bidForID == 82) {
                    $('#litab3,#tab_3').addClass('active');
                    $('#tab_3').show();
                    $('#litab3').show();
                }
                else if (map[item].bidTypeID == "9") {
                    $('#litab3').hide();
                    $('#tab_3').hide();
                    $('#litab6,#tab_6').addClass('active');
                    $('#divremovequotes').hide();
                }
                else {
                    $('#litab3,#tab_3').addClass('active');
                }



            }

            sessionStorage.setItem("hdnbidtypeid", map[item].bidTypeID)
            sessionStorage.setItem("hdbbidForID", map[item].bidForID)
            fetchvendors(map[item].bidId);
            FetchVenderNotInvited(map[item].bidId)
            fetchallexportdetails(); // For Time Extension feature added on 11 Nov

            setTimeout(function () {
                fetchItemsforPreBidPrices(map[item].bidId, map[item].bidTypeID, map[item].bidForID);
            }, 1000)
            $('#tblquotedprices').hide()
            jQuery('#tblquotedprices').empty()

        }
        else {
            gritternotification('Please select Bid  properly!!!');
            sessionStorage.setItem('hdnbid', '0');
            sessionStorage.setItem("hdnbidtypeid", '0')
            //$('#inviteVendorBody').hide();
            jQuery("#ddlbid").val(0);
        }
        if (sessionStorage.getItem("hdnbidtypeid") == 8 || sessionStorage.getItem("hdnbidtypeid") == 9) {
            $('#btn-add-new-item').hide();
            $('#btn-add-new-item').attr("disabled", "disabled");
        }
        else {
            $('#btn-add-new-item').show();

            $('#btn-add-new-item').removeAttr("disabled");
        }
        return item;
    }

});

function fetchvendors(bidid) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=" + bidid + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#ddlvendors').empty()
            if (data.length > 0) {
                sessionStorage.setItem('hdnAllBidsVendor', JSON.stringify(data));
                jQuery('#ddlvendors').append(jQuery("<option ></option>").val("0").html("Select Vendor"));
                for (var i = 0; i < data.length; i++) {
                    jQuery('#ddlvendors').append(jQuery("<option ></option>").val(data[i].vendorID).html(data[i].vendorName));
                }
            }
            else {
                error1.show();
                $('#spandanger').html('').html('Bid not mapped');
                error1.fadeOut(3000);
                App.scrollTo(error1, -200);
            }
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
function fetchparticationQuotes() {

    var url = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if (sessionStorage.getItem("hdnbidtypeid") == 7) {
        url = APIPath + "RemoveParticipatedQuotedPrices/fetchPSQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }
    else if (sessionStorage.getItem("hdnbidtypeid") == 6) {
        url = APIPath + "RemoveParticipatedQuotedPrices/fetchPEFAQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }
    else if (sessionStorage.getItem("hdnbidtypeid") == 9) {
        url = APIPath + "RemoveParticipatedQuotedPrices/fetchFAQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }
    else {
        url = APIPath + "RemoveParticipatedQuotedPrices/fetchCAQuotedPrices/?BidID=" + $('#ddlbid').val() + "&VendorID=" + $('#ddlvendors').val();
    }

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: url,
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            $('#tblquotedprices').show()
            jQuery('#tblquotedprices').empty()
            var shortname = "";
            if (data.length > 0) {
                if (sessionStorage.getItem("hdnbidtypeid") == 7) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>ShortName</th><th>Quoted Price</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {

                        shortname = (data[i].shortName).replace(/(\r\n|\n|\r)/gm, "");
                        $('#tblquotedprices').append('<tr><td>' + data[i].shortName + '</td><td>' + data[i].quotedPrice + '</td><td>' + fnConverToLocalTime(data[i].submissionTime) + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationPS(\'' + shortname + '\',\'' + data[i].quotedPrice + '\',\'' + data[i].submissionTime + '\',\'' + data[i].psid + '\',\'' + data[i].psHeaderID + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
                else if (sessionStorage.getItem("hdnbidtypeid") == 8) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>ShortName</th><th>Quoted Price</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {

                        shortname = (data[i].shortName).replace(/(\r\n|\n|\r)/gm, "");
                        $('#tblquotedprices').append('<tr><td>' + data[i].shortName + '</td><td>' + data[i].quotedPrice + '</td><td>' + fnConverToLocalTime(data[i].submissionTime) + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationCA(\'' + shortname + '\',\'' + data[i].quotedPrice + '\',\'' + data[i].submissionTime + '\',\'' + data[i].caid + '\',\'' + data[i].caHeaderID + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
                else if (sessionStorage.getItem("hdnbidtypeid") == 6) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>ShortName</th><th>Quoted Price</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {
                        shortname = (data[i].shortName).replace(/(\r\n|\n|\r)/gm, "");
                        $('#tblquotedprices').append('<tr><td>' + data[i].shortName + '</td><td>' + data[i].quotedPrice + '</td><td>' + fnConverToLocalTime(data[i].submissionTime) + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationPS(\'' + shortname + '\',\'' + data[i].quotedPrice + '\',\'' + data[i].submissionTime + '\',\'' + data[i].psid + '\',\'' + 0 + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
                else if (sessionStorage.getItem("hdnbidtypeid") == 9) {
                    $('#tbllbl').removeClass('display-none')
                    $('#tbldiv').removeClass('col-lg-12')
                    $('#tbldiv').addClass('col-lg-10')
                    $('#tblquotedprices').append('<thead><tr style="background: gray; color: #FFF"><th>ShortName</th><th>Quoted Price</th><th>Submission Time</th><th>Action</th></tr></thead>')
                    for (var i = 0; i < data.length; i++) {
                        shortname = (data[i].shortName).replace(/(\r\n|\n|\r)/gm, "");
                        $('#tblquotedprices').append('<tr><td>' + data[i].shortName + '</td><td>' + data[i].quotedPrice + '</td><td>' + fnConverToLocalTime(data[i].submissionTime) + '</td><td><a href="#" class="btn  btn-icon-only btn-danger" onclick="removeQuotationPS(\'' + shortname + '\',\'' + data[i].quotedPrice + '\',\'' + data[i].submissionTime + '\',\'' + data[i].frid + '\',\'' + 0 + '\',\'' + data[i].quantityAllocated + '\')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    }
                }
            }
            else {
                $('#tblquotedprices').append('<tr><td>No Record found</td></tr>');

            }

            jQuery.unblockUI();
        },

        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });

}
function removeQuotationPS(shname, price, subtime, psid, psheaderid, QuantityAllocated) {
    $('#deletepopup').modal('show')
    sessionStorage.setItem("shname", shname)
    sessionStorage.setItem("price", price)
    sessionStorage.setItem("subtime", subtime)
    sessionStorage.setItem("psid", psid)
    sessionStorage.setItem("psheaderid", psheaderid)
    sessionStorage.setItem("QuantityAllocated", QuantityAllocated)
}
function removeQuotationCA(shname, price, subtime, caid, caheaderid) {

    $('#deletepopup').modal('show')
    sessionStorage.setItem("shname", shname)
    sessionStorage.setItem("price", price)
    sessionStorage.setItem("subtime", subtime)
    sessionStorage.setItem("caid", caid)
    sessionStorage.setItem("caheaderid", caheaderid)
}
function deletePEFAquote() {
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }
    AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    var QuoteProduct = {
        "VendorID": parseInt($('#ddlvendors').val()),
        "BidID": parseInt($('#ddlbid').val()),
        "ShortName": sessionStorage.getItem("shname"),
        "QuotedPrice": parseFloat(sessionStorage.getItem("price")),
        "SubmissionTime": sessionStorage.getItem("subtime"),
        "PSID": parseInt(sessionStorage.getItem("psid")),
        "PSHeaderID": 0,
        "Remarks": $('#txtremarks').val(),
        "Attachment": AttachementFileName,
        "UserID": sessionStorage.getItem("UserID")

    }

    connection.invoke("RemovePEFAQuote", JSON.stringify(QuoteProduct)).catch(function (err) {
        //return console.error(err.toString());
        var err = xhr.responseText//eval("(" + xhr.responseText + ")");
        if (xhr.status == 401) {
            error401Messagebox(err.Message);
        }
        else {
            fnErrorMessageText('spandanger', '');
        }
        jQuery.unblockUI();
        return false;

    });
    connection.on("refreshPEFAQuotes", function (data) {
        var JsonMsz = JSON.parse(data[0]);

        if (JsonMsz[0] == "1" && data[1] == sessionStorage.getItem('UserID')) {
            if ($('#fileToUpload').val() != '') {
                fnUploadFilesonAzure('fileToUpload', AttachementFileName, 'MangeBid/' + $('#ddlbid').val());

            }
            success1.show();
            $('#spansuccess1').html("Quoted Price deleted Successfully..");
            success1.fadeOut(6000);
            App.scrollTo(success1, -200);
            fetchparticationQuotes();
            $('#deletepopup').modal('hide')
            $('#txtremarks').val('')
            $('#fileToUpload').val('')
        }
        else if (JsonMsz[0] == "99" && data[1] == sessionStorage.getItem('UserID')) {
            $('#deletepopup').modal('hide')
            bootbox.alert("You cant't delete entries more than 2 times for a vendor in a particular Bid.")
        }
        else {
            error2.show();
            $('#err').html('You have some error.Please try agian.');
            error2.fadeOut(3000);
            App.scrollTo(error2, -200);
        }
    })
    jQuery.unblockUI();
}
function deleteFAquote() {
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }
    AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    var QuoteProduct = {
        "VendorID": parseInt($('#ddlvendors').val()),
        "BidID": parseInt($('#ddlbid').val()),
        "ShortName": sessionStorage.getItem("shname"),
        "QuotedPrice": parseFloat(sessionStorage.getItem("price")),
        "SubmissionTime": sessionStorage.getItem("subtime"),
        "FRID": parseInt(sessionStorage.getItem("psid")),
        "FrenchHeaderID": 0,
        "Remarks": $('#txtremarks').val(),
        "Attachment": AttachementFileName,
        "UserID": sessionStorage.getItem("UserID"),
        "QuantityAllocated": parseFloat(sessionStorage.getItem("QuantityAllocated"))

    }

    connection.invoke("RemoveFAQuote", JSON.stringify(QuoteProduct)).catch(function (err) {
        //return console.error(err.toString());
        var err = xhr.responseText//eval("(" + xhr.responseText + ")");
        if (xhr.status == 401) {
            error401Messagebox(err.Message);
        }
        else {
            fnErrorMessageText('spandanger', '');
        }
        jQuery.unblockUI();
        return false;

    });
    connection.on("refreshFAQuotes", function (data) {
        var JsonMsz = JSON.parse(data[0]);

        if (JsonMsz[0] == "1" && data[1] == sessionStorage.getItem('UserID')) {
            if ($('#fileToUpload').val() != '') {
                fnUploadFilesonAzure('fileToUpload', AttachementFileName, 'MangeBid/' + $('#ddlbid').val());

            }
            success1.show();
            $('#spansuccess1').html("Quoted Price deleted Successfully..");
            success1.fadeOut(6000);
            App.scrollTo(success1, -200);
            fetchparticationQuotes()
            $('#deletepopup').modal('hide')
            $('#txtremarks').val('')
            $('#fileToUpload').val('')
        }
        else if (JsonMsz[0] == "99" && data[1] == sessionStorage.getItem('UserID')) {
            $('#deletepopup').modal('hide')
            bootbox.alert("You cant't delete entries more than 2 times for a vendor in a particular Bid.")
        }
        else {
            error2.show();
            $('#err').html('You have some error.Please try agian.');
            error2.fadeOut(3000);
            App.scrollTo(error2, -200);
        }
    })
    jQuery.unblockUI();
}
function deletePSquote() {
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }
    AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    var QuoteProduct = {
        "VendorID": parseInt($('#ddlvendors').val()),
        "BidID": parseInt($('#ddlbid').val()),
        "ShortName": sessionStorage.getItem("shname"),
        "QuotedPrice": parseFloat(sessionStorage.getItem("price")),
        "SubmissionTime": sessionStorage.getItem("subtime"),
        "PSID": parseInt(sessionStorage.getItem("psid")),
        "PSHeaderID": parseInt(sessionStorage.getItem("psheaderid")),
        "Remarks": $('#txtremarks').val(),
        "Attachment": AttachementFileName,
        "UserID": sessionStorage.getItem("UserID")

    }


    connection.invoke("RemovePSQuote", JSON.stringify(QuoteProduct)).catch(function (err) {
        //return console.error(err.toString());
        var err = xhr.responseText//eval("(" + xhr.responseText + ")");
        if (xhr.status == 401) {
            error401Messagebox(err.Message);
        }
        else {
            fnErrorMessageText('spandanger', '');
        }
        jQuery.unblockUI();
        return false;

    });
    connection.on("refreshRAQuotes", function (data) {

        var JsonMsz = JSON.parse(data[0]);
        if (JsonMsz[0] == "1" && data[1] == sessionStorage.getItem('UserID')) {
            if ($('#fileToUpload').val() != '') {
                fnUploadFilesonAzure('fileToUpload', AttachementFileName, 'MangeBid/' + $('#ddlbid').val());

            }
            success1.show();
            $('#spansuccess1').html("Quoted Price deleted Successfully..");
            success1.fadeOut(6000);
            App.scrollTo(success1, -200);
            fetchparticationQuotes()
            $('#deletepopup').modal('hide')
            $('#txtremarks').val('')
            $('#fileToUpload').val('')
        }
        else if (JsonMsz[0] == "99" && data[1] == sessionStorage.getItem('UserID')) {
            $('#deletepopup').modal('hide')
            bootbox.alert("You cant't delete entries more than 2 times for a vendor in a particular Bid.")
        }
        else {
            error2.show();
            $('#err').html('You have some error.Please try agian.');
            error2.fadeOut(3000);
            App.scrollTo(error2, -200);
        }
    })
    jQuery.unblockUI();
}
function deleteCoalquote() {
    var AttachementFileName = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#filepthattach').html != '') {
        AttachementFileName = jQuery('#fileToUpload').html();
    }
    AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    var QuoteProduct = {
        "VendorID": parseInt($('#ddlvendors').val()),
        "BidID": parseInt($('#ddlbid').val()),
        "ShortName": sessionStorage.getItem("shname"),
        "QuotedPrice": parseFloat(sessionStorage.getItem("price")),
        "SubmissionTime": sessionStorage.getItem("subtime"),
        "CAID": parseInt(sessionStorage.getItem("caid")),
        "CAHeaderID": parseInt(sessionStorage.getItem("caheaderid")),
        "Remarks": $('#txtremarks').val(),
        "Attachment": AttachementFileName,
        "UserID": sessionStorage.getItem("UserID")

    }
    //console.log(JSON.stringify(QuoteProduct))

    connection.invoke("RemoveCAQuote", JSON.stringify(QuoteProduct)).catch(function (err) {
        //return console.error(err.toString());
        var err = xhr.responseText//eval("(" + xhr.responseText + ")");
        if (xhr.status == 401) {
            error401Messagebox(err.Message);
        }
        else {
            fnErrorMessageText('spandanger', '');
        }
        jQuery.unblockUI();
        return false;

    });
    connection.on("refreshCAQuotes", function (data) {
        var JsonMsz = JSON.parse(data[0]);

        if (JsonMsz[0] == "1" && data[1] == sessionStorage.getItem('UserID')) {
            if ($('#fileToUpload').val() != '') {
                fnUploadFilesonAzure('fileToUpload', AttachementFileName, 'MangeBid/' + $('#ddlbid').val());

            }
            success1.show();
            $('#spansuccess1').html("Quoted Price deleted Successfully..");
            success1.fadeOut(6000);
            App.scrollTo(success1, -200);
            fetchparticationQuotes()
            $('#deletepopup').modal('hide')
            $('#txtremarks').val('')
            $('#fileToUpload').val('')
        }
        else if (JsonMsz[0] == "99" && data[1] == sessionStorage.getItem('UserID')) {
            $('#deletepopup').modal('hide')
            bootbox.alert("You cant't delete entries more than 2 times for a vendor in a particular Bid.")
        }
        else {
            error2.show();
            $('#err').html('You have some error.Please try agian.');
            error2.fadeOut(3000);
            App.scrollTo(error2, -200);
        }
    })
    jQuery.unblockUI();
}


$('#deletepopup').on('hidden.bs.modal', function () {
    $('#txtremarks').val('');

});

jQuery("#txtvendor, #txtvendorSurrogateBid").keyup(function () {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
});

jQuery("#txtvendor,#txtvendorSurrogateBid").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnAllBidsVendor');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.vendorName] = username;
            usernames.push(username.vendorName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].vendorID != "0") {

            sessionStorage.setItem('hdnselectedvendor', map[item].vendorID);
            sessionStorage.setItem('hdnselectedEmail', map[item].emailId);
            if ($("#txtvendorSurrogateBid").val() != '') {
                $(".surrogateFormElements").show();
            }
        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
var allnoninvitedvendors;
function FetchVenderNotInvited(bidid) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ResetInviteVendor/fetchBidsAuto/?UserID=x&BidID=" + bidid + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#tblvendorlist > tbody").empty();
            jQuery("#txtSearch").val('');
            $('#btninvitevendors').addClass('hide')
            sessionStorage.setItem('hdnVendorID', 0);

            if (data.length > 0) {
                allnoninvitedvendors = data;
                //$('#inviteVendorBody').show();
            }
            else {
                // $('#inviteVendorBody').hide();
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");

            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
$("#chkAll").click(function () {
    if ($("#chkAll").is(':checked') == true) {
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
        });
    }
    else {
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").removeClass("checked");
        });
    }
});

function Check(event) {
    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")
    }
    else {
        $(event).closest("span#spanchecked").addClass("checked")
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
    }
}

function ValidateVendor() {
    var status = "false";
    var evement = "";
    $('#divvendorlist').find('span#spandynamic').hide();
    $("#tblvendorlist> tbody > tr").each(function (index) {
        if ($(this).find("span#spanchecked").attr('class') == 'checked') {
            status = "True";
        }
    });
    if (status == "false") {
        error1.show();
        $('#spandanger').html('').html('Please select at least one element');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);

        status = "false";
    }
    return status;
}
function resetpasswordForBidVendor() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if (sessionStorage.getItem("hdnbid") == '0') {
        error1.show();
        $('#spandanger').html('').html('Please select Bid...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        gritternotification('Please select Bid!!!');
        jQuery.unblockUI();

        return false;

    }
    else if (sessionStorage.getItem("hdnselectedvendor") == "0") {
        error1.show();
        $('#spandanger').html('').html('Please select Vendor...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        jQuery.unblockUI();

        return false;
    }
    else {
        var data = {
            "EmailId": sessionStorage.getItem("hdnselectedEmail"),
            "BidId": parseInt(sessionStorage.getItem("hdnbid")),
            "VendorID": parseInt(sessionStorage.getItem("hdnselectedvendor")),
            "UserID": sessionStorage.getItem("UserID"),
            "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))

        }

        jQuery.ajax({
            url: APIPath + "ResetInviteVendor/ResetPassword",
            data: JSON.stringify(data),
            type: "POST",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            contentType: "application/json",
            success: function (data) {
                // if (data = "1") {
                success1.show();
                $('#spansuccess1').html('New password is sent to registered email of vendor..');

                success1.fadeOut(6000);
                App.scrollTo(success1, -200);
                jQuery.unblockUI();
                //  }
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', '');
                }
                jQuery.unblockUI();
                return false;
            }
        });
    }


}
function clearsession() {
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
    sessionStorage.setItem('hdnbid', '0');
    sessionStorage.setItem("hdnbidtypeid", '0')
    jQuery("#txtvendor, #txtvendorSurrogateBid").val('')

}
function sendremainderstoparicipants() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("hdnbid") == '0') {
        errorremainder.show();
        $('#errrem').html('Please select Bid...');
        errorremainder.fadeOut(3000);
        App.scrollTo(errorremainder, -200);
        jQuery.unblockUI();
        gritternotification('Please select Bid!!!');
        return false;

    }
    else {
        var checkedValue = '';
        // var temp = new Array();
        $("#tblparicipantslists> tbody > tr").each(function (index) {
            if ($(this).find("span#spancheckedrem").attr('class') == 'checked') {
                //vemail = $(this).find("td").eq(1).html();
                vid = $(this).find("td").eq(0).html();
                checkedValue = checkedValue + vid + '#';
            }

        });


        var data = {
            "QueryString": checkedValue,
            "BidId": parseInt(sessionStorage.getItem("hdnbid")),
            "BidTypeID": parseInt(sessionStorage.getItem("hdnbidtypeid")),
            "UserID": sessionStorage.getItem("UserID"),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
        }

        jQuery.ajax({
            url: APIPath + "ResetInviteVendor/SendRemainderToParticipant",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {

                errorremainder.hide();
                succesremainder.show();
                $('#succrem').html('Reminder has been sent Successfully..');

                clearsession();

                succesremainder.fadeOut(3000);
                App.scrollTo(succesremainder, -200);
                jQuery.unblockUI();
                //}
            },

            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', '');
                }
                jQuery.unblockUI();
                return false;
            }
        });

        return true;
    }
}
jQuery("#txtSearch").keyup(function () {
    sessionStorage.setItem('hdnVendorID', '0');

});
sessionStorage.setItem('hdnVendorID', 0);

jQuery("#txtSearch").typeahead({
    source: function (query, process) {
        var data = allnoninvitedvendors;
        usernames = [];
        var tdContent = '0';
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {

            map[username.vendorName] = username;
            usernames.push(username.vendorName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].vendorID != "0") {

            sessionStorage.setItem('hdnVendorID', map[item].vendorID);
            $('#btninvitevendors').removeClass('hide')

            var str = "<tr id=TRVendor" + map[item].vendorID + "><td class='hide'>" + map[item].vendorID + "</td><td class=hide>" + map[item].emailId + "</td><td>" + map[item].vendorName + " </td><td><button type='button' class='btn btn-xs btn-danger'  onclick=fnremoveVendors(\'" + map[item].vendorID + "'\)><i class='glyphicon glyphicon-remove-circle'></i></button></td></tr>";
            jQuery('#tblvendorlist > tbody').append(str);
            var arr = $("#tblvendorlist tr");

            $.each(arr, function (i, item) {
                var currIndex = $("#tblvendorlist tr").eq(i);
                var matchText = currIndex.children("td").first().text();
                $(this).nextAll().each(function (i, inItem) {
                    if (matchText === $(this).children("td").first().text()) {
                        $(this).remove();
                    }
                });
            });
            jQuery("#txtSearch").val('');

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
function fnremoveVendors(vid) {
    $('#TRVendor' + vid).remove();
    if ($("#tblvendorlist> tbody > tr").length > 0) {
        $('#btninvitevendors').removeClass('hide')
    }
    else {
        $('#btninvitevendors').addClass('hide')
    }
    jQuery("#txtSearch").val('');
    sessionStorage.setItem('hdnVendorID', 0);
}
function invitevendors() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("hdnbid") == '0') {
        error1.show();
        $('#spandanger').html('').html('Please select Bid...');
        error1.fadeOut(3000);
        App.scrollTo(error1, -200);
        jQuery.unblockUI();
        gritternotification('Please select Bid!!!');
        return false;

    }

    else {
        var checkedValue = '';

        $("#tblvendorlist tr:gt(0)").each(function () {
            var this_row = $(this);
            checkedValue = checkedValue + $.trim(this_row.find('td:eq(0)').html()) + '#';

        });

        var data = {
            "QueryString": checkedValue,
            "BidId": parseInt(sessionStorage.getItem("hdnbid")),
            "BidTypeID": parseInt(sessionStorage.getItem("hdnbidtypeid")),
            "UserID": sessionStorage.getItem("UserID")
        }


        jQuery.ajax({
            url: APIPath + "ResetInviteVendor/Invitevendors",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            success: function (data) {

                success1.show();
                $('#spansuccess1').html('Vendor Invited Successfully..');
                fetchallexportdetails();
                FetchVenderNotInvited(sessionStorage.getItem("hdnbid"))
                fetchvendors(sessionStorage.getItem("hdnbid"));

                success1.fadeOut(3000);
                App.scrollTo(success1, -200);
                jQuery.unblockUI();

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText// eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', '');
                }
                jQuery.unblockUI();
                return false;
            }
        });

        return true;
    }
}
jQuery("#search").keyup(function () {

    jQuery("#tblvendorlist tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblvendorlist tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tblvendorlist tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});


//Time Extension Feature 4th TAB

var SeId = 0;
var BidForID = 0;
var FlagForCheckShowPrice = "N";
function fetchallexportdetails() {
    var bidTypeFetchUrl = '';
    $('#extendedDurationPara').hide();

    if (sessionStorage.getItem("hdnbidtypeid") == 6) {
        //bidTypeFetchUrl = sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + jQuery('#ddlbid').val();
        bidTypeFetchUrl = sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?BidID=" + jQuery('#ddlbid').val();
    }
    if (sessionStorage.getItem("hdnbidtypeid") == 7) {
        bidTypeFetchUrl = sessionStorage.getItem("APIPath") + "ConfigureBid/fetchSeaExportConfigurationData/?BidID=" + jQuery('#ddlbid').val();
    }
    if (sessionStorage.getItem("hdnbidtypeid") == 8) {
        bidTypeFetchUrl = sessionStorage.getItem("APIPath") + "ConfigureBid/fetchCoalExportConfigurationData/?BidID=" + jQuery('#ddlbid').val();
    }
    if (sessionStorage.getItem("hdnbidtypeid") == 9) {
        bidTypeFetchUrl = sessionStorage.getItem("APIPath") + "ConfigureBid/fetchFrenchConfigurationData/?BidID=" + jQuery('#ddlbid').val();
    }

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: bidTypeFetchUrl,
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var localBidDate = fnConverToLocalTime(BidData[0].bidDetails[0].bidDate)
            $('#BidPreviewDiv').show()
            jQuery('#mapedapproverPrev').html('');
            jQuery('#mapedapproverPrevtab_0').html('');
            jQuery('#txtBidSubjectPrev').html(BidData[0].bidDetails[0].bidSubject)
            jQuery('#txtBidSubjectPrevtab_0').html(BidData[0].bidDetails[0].bidSubject)
            jQuery('#txtbiddescriptionPrev').html(BidData[0].bidDetails[0].bidDetails)
            jQuery('#txtbiddescriptionPrevtab_0').html(BidData[0].bidDetails[0].bidDetails)
            jQuery('#txtbidDatePrev').html(localBidDate)
            jQuery('#txtbidDatePrevtab_0').html(localBidDate)
            jQuery("#dropCurrencyPrev").html(BidData[0].bidDetails[0].currencyName)
            jQuery("#dropCurrencyPrevtab_0").html(BidData[0].bidDetails[0].currencyName)
            jQuery('#txtConversionRatePrev').html(BidData[0].bidDetails[0].conversionRate)
            jQuery('#txtConversionRatePrevtab_0').html(BidData[0].bidDetails[0].conversionRate)

            if (sessionStorage.getItem("hdnbidtypeid") == 7 || sessionStorage.getItem("hdnbidtypeid") == 8) {

                if ($.trim(BidData[0].bidDetails[0].showRankToVendor) == "Y") {

                    jQuery('#showL1l2').text("As L1, L2, L3 etc.")
                }

                else {
                    jQuery('#showL1l2').text("As L1 or Not L1")
                }
            }
            else if (sessionStorage.getItem("hdnbidtypeid") == 6 || sessionStorage.getItem("hdnbidtypeid") == 9) {
                if (BidData[0].bidDetails[0].showRankToVendor == "Y") {
                    jQuery('#showL1l2').text("As H1, H2, H3 etc.")
                }
                else if (BidData[0].bidDetails[0].showRankToVendor == "NA") {
                    jQuery('#showL1l2').text("Do not display")
                }
                else {
                    jQuery('#showL1l2').text("As H1 or Not H1")
                }
            }
            if (BidData[0].bidDetails[0].hideVendor == "Y") {
                $('#hidevendor').text("Yes")
            }
            else {
                $('#hidevendor').text("No")
            }
            if (BidData[0].bidDetails[0].noofBidExtension == "-1") {
                $('#mapbidextensionPrevtab_0').text('Unlimited')
            }
            else {
                $('#mapbidextensionPrevtab_0').text(BidData[0].bidDetails[0].noofBidExtension)
            }

            $('#hdnClosingval').val(BidData[0].bidDetails[0].bidClosingType)
            // $('#opPauseval').addClass('hide')
            jQuery("#txtBidDurationPrevtab_0").html(BidData[0].bidDetails[0].bidDuration);
            var st = "";
            if (BidData[0].bidDetails[0].status.toLowerCase() == "pause") {
                st = "Paused";
            }
            else {
                st = BidData[0].bidDetails[0].status;
            }
            $('#bid_status').text("Current Status : " + st);
            $('.dttime').removeAttr("disabled");
            $('#divreopendttime').hide()
            $('#btnreopendttime').hide();
            $('#btnbidchangedttime').show();
            //$('#btncalopendate').show()
            $('#btnopentime').show()

            $('#btnprebid').removeAttr("disabled")
            $('#btnprebidexcel').removeAttr("disabled")

            if (BidData[0].bidDetails[0].status.toLowerCase() == "close") {
                $("#ddlBidStatus").val(2);
                $('#optopen').removeClass('hide')
                $('#btnsendreminder').attr("disabled", "disabled")
                $('#btnprebid').attr("disabled", "disabled")
                $('#btnprebidexcel').attr("disabled", "disabled")
            }
            else if (BidData[0].bidDetails[0].status.toLowerCase() == "pause") {
                $("#ddlBidStatus").val(1);
                // $('#btncalopendate').hide();
                $('#btnopentime').hide();
                $('#btnsendreminder').attr("disabled", "disabled")
                $('.dttime').attr("disabled", "disabled");
                $('#divreopendttime').show();
                $('#btnreopendttime').show();
                $('#btnbidchangedttime').hide();
            }
            else if (BidData[0].bidDetails[0].status.toLowerCase() == "open") {

                $("#ddlBidStatus").val(1);
                $('#btnsendreminder').removeAttr("disabled")
                if ((BidData[0].bidDetails[0].isRunningBid.toLowerCase() == 'notrunningbid' || BidData[0].bidDetails[0].isRunningBid.toLowerCase() == 'closedbid') && BidData[0].bidDetails[0].bidReOpenAfterPauseDtTime != '' && BidData[0].bidDetails[0].bidReOpenAfterPauseDtTime != null) {

                    //$('#btncalopendate').hide();
                    $('#btnopentime').hide();
                    $('#btnsendreminder').attr("disabled", "disabled")
                    $('.dttime').attr("disabled", "disabled");
                    $('#divreopendttime').show();
                    $('#btnreopendttime').show();
                    $('#btnbidchangedttime').hide();
                    //check 
                    if (sessionStorage.getItem("hdnbidtypeid") == 8 || sessionStorage.getItem("hdnbidtypeid") == 9) {
                        $('#btn-add-new-item').hide();
                        $('#btn-add-new-item').attr("disabled", "disabled");
                    }
                    else {
                        $('#btn-add-new-item').show();

                        $('#btn-add-new-item').removeAttr("disabled");
                    }
                }
            }
            //$("#ctrlbidTimeandDate").attr('onclick', "editValues('divbidTimePrevtab_0', 'txtbidDatePrevtab_0')");
            $("#ctrlbidTimeandDate").attr('onclick', "editValues('', 'txtbidDatePrevtab_0')");
            $("#ctrlFileTerms").attr('onclick', "editValues('divbidTermsFilePrevtab_0', '')");
            $("#ctrlFileAttachment").attr('onclick', "editValues('divbidAttachFilePrevtab_0', '')");
            $("#ctrlShwL1").attr('onclick', "editValues('divbidShowL1L2', '')");
            $("#ctrlhidevendor").attr('onclick', "editValues('divhidevendors', '')");
            $("#ctrlnoofbidextension").attr('onclick', "editValues('divbidextension', '')");
            $("#btn-add-new-item").attr('onclick', "editValues('divbidItemsPrevtab_0','New')");
            BidForID = BidData[0].bidDetails[0].bidForID;
            if (BidData[0].bidDetails[0].bidForID == "82") {
                $("#ctrlShwL1").hide()
            }
            else {
                $("#ctrlShwL1").show()
            }
            //**************************** Change by Pooja sppinner to Textbox  Start**************************
            //  $('#spinnerBidDetails').show()
            // $('#spinnerBidDetails').spinner({ value: BidData[0].BidDetails[0].BidDuration, step: 1, min: 0, max: 999 });
            $('#txtBidDurationForBidOpen').val(BidData[0].bidDetails[0].bidDuration)
            //$('#txtbidTime').val(localBidTime)
            $('#txtbidDate').val(localBidDate)


            $('#ddlBidfinalStatus').val(BidData[0].bidDetails[0].finalStatus)


            if (BidData[0].bidDetails[0].finalStatus.toLowerCase() == "cancel") {
                if (sessionStorage.getItem("UserID") == "..") {
                    $('#divfinalstatus').removeClass('hide');
                }
            }
            else {
                $('#divfinalstatus').addClass('hide');
            }

            //**************************** Change by Pooja sppinner to Textbox   End**************************

            _bidClosingType = BidData[0].bidDetails[0].bidClosingType;
            $('#divpausehitory').addClass('hide');
            if (BidData[0].bidDetails[0].bidClosingType == "A") {
                SeId = 0;
                $('#spinnerBidclosingTab').show()
                $('#btndiv').show()
                $('#txtbidduration').hide()
                $('#spinnerBidclosingTab').spinner({ value: BidData[0].bidDetails[0].bidDuration, step: 1, min: 0, max: 999 });
                jQuery('#ddlbidclosetypePrev').html('All items in one go')
                jQuery('#ddlbidclosetypePrevtab_0').html('All items in one go')
                $(".staggered-item").show();

                $('#txtBidDurationForBidOpen').removeAttr("disabled");
            }
            else if (BidData[0].bidDetails[0].bidClosingType == "S") {
                $("#txtBidDurationForBidOpen").attr("disabled", "disabled");
                $('#spinnerBidclosingTab').hide()
                $('#btndiv').hide()
                $('#txtbidduration').show()

                $('#txtbidduration').html(BidData[0].bidDetails[0].bidDuration)
                jQuery('#ddlbidclosetypePrev').html('Stagger at: Item level')
                jQuery('#ddlbidclosetypePrevtab_0').html('Stagger at: Item level')
                fnGetPauseHistory();
            }
            else {
                $("#head-stagger").hide();
                $(".staggered-item").hide();
                $('#spinnerBidclosingTab').show()
                $('#btndiv').show()
                $('#txtbidduration').hide()
                $('#spinnerBidclosingTab').spinner({ value: BidData[0].bidDetails[0].bidDuration, step: 1, min: 0, max: 999 });
                //jQuery('#ddlbidclosetypePrev').html('Stagger at: Item level')
                $('#hdnClosingval').val('A')
            }


            if (BidData[0].bidDetails[0].termsConditions != '') {
                replaced1 = BidData[0].bidDetails[0].termsConditions.replace(/\s/g, "%20")
                if (BidData[0].bidDetails[0].attachment != '') {
                    if (BidData[0].bidDetails[0].attachment != null) {
                        replaced2 = BidData[0].bidDetails[0].attachment.replace(/\s/g, "%20")
                    }
                }
            }


            $('#filepthtermsPrev').html(BidData[0].bidDetails[0].termsConditions)
            $('#filepthattachPrev').html(BidData[0].bidDetails[0].attachment)

            $('#filepthtermsPrevtab_0').html(BidData[0].bidDetails[0].termsConditions)
            $('#filepthattachPrevtab_0').html(BidData[0].bidDetails[0].attachment)

            if (BidData[0].bidApproverDetails.length > 0) {
                for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {
                    if (BidData[0].bidApproverDetails[i].isApprover != 'P') {
                        jQuery('#mapedapproverPrev').append(jQuery('<option selected></option>').val(BidData[0].bidApproverDetails[i].userID).html(BidData[0].bidApproverDetails[i].approverName))
                        jQuery('#mapedapproverPrevtab_0').append(jQuery('<option selected></option>').val(BidData[0].bidApproverDetails[i].userID).html(BidData[0].bidApproverDetails[i].approverName))
                    }
                }
            }


            jQuery("#tblServicesProductPrev").empty();
            jQuery("#tblServicesProductPrevtab_0").empty();
            if (sessionStorage.getItem('hdnbidtypeid') == 7) {
                $('#txtBidType').text("Reverse Auction");
                if (BidData[0].bidSeaExportDetails.length > 0) {

                    $('#wrap_scrollerPrev').show();
                    $('#wrap_scrollerPrevtab_0').show();
                    if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {
                        if ($('#hdnClosingval').val() == "S") {
                            $(".staggered-item").show();

                            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S. No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th class=hide>Mask Vendor</th><th style='width:60px !important'>Minimum<br/>Decrement</th><th>Decrement On</th><th>Last<br/>Invoice Price</th><th>Item<br/>Duration(Min)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th><th>Closing Time</th><th class=Paction>Action</th><th style=width:200px>Bid Duration<br/>(in minutes)</th></tr></thead>");
                            jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>S.No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th>Hide Target Price</th><th style='width:60px !important'>Minimum<br/>Decrement</th><th>Decrement On</th><th>Last<br/>Invoice Price</th><th>Item<br/>Duration(Min)</th><th>Closing Time</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                        }
                        else {
                            jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>S.No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S. No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th class=hide>Mask Vendor</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                        }

                    }
                    else {
                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Mask Vendor</th><th>Quantity</th><th>UOM</th><th>Starting Price</th><th>Last Invoice Price</th><th class=hide>Show H1 Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                        $("#txtBidDurationForBidOpen").attr("disabled", "disabled");
                        $('#btndiv').hide()
                        $('#plusbtn').attr("disabled", "disabled");
                        $('#minusbtn').attr("disabled", "disabled");
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>Hide Target Price</th><th>Quantity</th><th>UOM</th><th>Starting Price</th><th>Last Invoice Price</th><th>Floor/ Min. Price</th><th>Price Decrement Frequency</th><th>Price Decrement Amount</th><th class=hide>Show H1 Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    }
                    var counterReopenbtn = 1;
                    for (var i = 0; i < BidData[0].bidSeaExportDetails.length; i++) {
                        var decrementon = ''

                        if (BidData[0].bidSeaExportDetails[i].decreamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = '%age'


                        if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {
                            if ($('#hdnClosingval').val() == "S") {

                                //jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].targetprice + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].quantity + '</td><td>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].MaskVendor + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].minimumDecreament + '</td><td>' + decrementon + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].decreamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].itemBidDuration + '</td><td>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td>' + BidData[0].bidSeaExportDetails[i].showStartPrice + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].poValue + '</td><td>' + BidData[0].bidSeaExportDetails[i].itemClosingTime + '</td><td class=Paction ><button type="button" id=btnpause' + i + ' class="btn yellow btn-sm" onclick="pauseaction(\'' + i + '\',\'' + BidData[0].bidSeaExportDetails[i].seid + '\')" >' + BidData[0].bidSeaExportDetails[i].itemStatus+'</button></td><td><div class="pull-left"> <div id=spinner' + i + ' class="pull-left"><div class="input-group" style="width:110px;"><div class="spinner-buttons input-group-btn"><button type="button" class="btn spinner-down red btn-sm"><i class="fa fa-minus"></i></button> </div><input type=text class="spinner-input form-control input-sm" id=txtitemBidDuration' + i + ' maxlength="3" readonly><div class="spinner-buttons input-group-btn "><button type="button" class="btn spinner-up blue btn-sm"><i class="fa fa-plus"></i></button></div></div></div><button id="btnextendA" type="button" class="btn green btn-sm" onclick="fnTimeUpdateS(\'' + i + '\',\'' + BidData[0].bidSeaExportDetails[i].seid + '\')">Go</button><div class="col-md-12"><p class="form-control-static" id=extendedDuration' + i + ' style="color:#3c763d; font-weight: 600; display: none;">Time&nbsp;Extended&nbsp;Successfully</p></div></td></tr>');
                                jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].targetprice + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].quantity + '</td><td>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].MaskVendor + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].minimumDecreament + '</td><td>' + decrementon + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].decreamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].itemBidDuration + '</td><td>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td>' + BidData[0].bidSeaExportDetails[i].showStartPrice + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].poValue + '</td><td>' + BidData[0].bidSeaExportDetails[i].itemClosingTime + '</td><td class=Paction>' + BidData[0].bidSeaExportDetails[i].itemStatus + '</td><td><div class="pull-left"><div id=spinner' + i + ' class="pull-left"><div class="input-group" style="width:110px;"><div class="spinner-buttons input-group-btn"><button type="button" class="btn spinner-down red btn-sm"><i class="fa fa-minus"></i></button> </div><input type=text class="spinner-input form-control input-sm" id=txtitemBidDuration' + i + ' maxlength="3" readonly><div class="spinner-buttons input-group-btn "><button type="button" class="btn spinner-up blue btn-sm"><i class="fa fa-plus"></i></button></div></div></div><button id=btnextendA' + i + ' type="button" class="btn green btn-sm" onclick="fnTimeUpdateS(\'' + i + '\',\'' + BidData[0].bidSeaExportDetails[i].seid + '\')">Go</button><div class="col-md-12"><p class="form-control-static" id=extendedDuration' + i + ' style="color:#3c763d; font-weight: 600; display: none;">Time&nbsp;Extended&nbsp;Successfully</p></div></td><td id=groupno' + i + ' class=hide>' + BidData[0].bidSeaExportDetails[i].groupNo + '</td></tr>');
                                $('#spinner' + i).spinner({ value: 1, step: 1, min: 1, max: 999 }); //BidData[0].bidSeaExportDetails[i].ItemBidDuration
                                if (BidData[0].bidSeaExportDetails[i].itemStatus.toLowerCase() == "close" || BidData[0].bidSeaExportDetails[i].itemStatus.toLowerCase() == "pause") {
                                    $('#spinner' + i).hide()
                                    $('#btnextendA' + i).hide()
                                }

                                if (BidData[0].bidDetails[0].bidForID == "81" || BidData[0].bidDetails[0].bidForID == "1") {
                                    jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td><a class=isDisabledClass onclick=editValues(\'divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + " <a class='changeMinDecreament ml-1' onclick=editbidstartprice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].itemBidDuration + "</td><td>" + BidData[0].bidSeaExportDetails[i].itemClosingTime + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].seid + "</td><td>" + BidData[0].bidSeaExportDetails[i].maskL1Price + "&nbsp;<a class='lambdafactor' onclick=editShowL1Price(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\') class=pencilHLP ><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + "</td><td>" + BidData[0].bidSeaExportDetails[i].poNo + "</td><td>" + BidData[0].bidSeaExportDetails[i].poVendorName + "</td><td>" + BidData[0].bidSeaExportDetails[i].poDate + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + "</td></tr>");
                                }
                                else {
                                    jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td><a class=isDisabledClass onclick=editValues(\'divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + " <a class='changeMinDecreament ml-1' onclick=editbidstartprice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].itemBidDuration + "</td><td>" + BidData[0].bidSeaExportDetails[i].itemClosingTime + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].seid + "</td><td>" + BidData[0].bidSeaExportDetails[i].maskL1Price + "</td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + "</td><td>" + BidData[0].bidSeaExportDetails[i].poNo + "</td><td>" + BidData[0].bidSeaExportDetails[i].poVendorName + "</td><td>" + BidData[0].bidSeaExportDetails[i].poDate + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + "</td></tr>");
                                }

                            }
                            else {

                                jQuery("#tblServicesProductPrev").append("<tr id=tridPrev" + i + "><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + "</td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + '</td><td>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td>' + BidData[0].bidSeaExportDetails[i].showStartPrice + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td></tr>');
                                if (BidData[0].bidDetails[0].bidForID == "81" || BidData[0].bidDetails[0].bidForID == "1") {
                                    jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td style='width:150px !important;'><a class='isDisabledClass' onclick=editValues('\divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + " <a class='changeMinDecreament ml-1' onclick=editbidstartprice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].seid + "</td><td>" + BidData[0].bidSeaExportDetails[i].maskL1Price + "&nbsp;<a class='lambdafactor' onclick=editShowL1Price(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\') class=pencilHLP ><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + "</td><td>" + BidData[0].bidSeaExportDetails[i].poNo + "</td><td>" + BidData[0].bidSeaExportDetails[i].poVendorName + "</td><td>" + BidData[0].bidSeaExportDetails[i].poDate + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + "</td></tr>");
                                }
                                else {
                                    jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td style='width:150px !important;'><a class='isDisabledClass' onclick=editValues('\divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidSeaExportDetails[i].destinationPort + "</td><td>" + BidData[0].bidSeaExportDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].quantity + "</td><td>" + BidData[0].bidSeaExportDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + " <a class='changeMinDecreament ml-1' onclick=editbidstartprice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidSeaExportDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].decreamentOn + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].lastInvoicePrice + "</td><td class=hide>" + BidData[0].bidSeaExportDetails[i].seid + "</td><td>" + BidData[0].bidSeaExportDetails[i].maskL1Price + "</td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidSeaExportDetails[i].seid + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poUnitRate + "</td><td>" + BidData[0].bidSeaExportDetails[i].poNo + "</td><td>" + BidData[0].bidSeaExportDetails[i].poVendorName + "</td><td>" + BidData[0].bidSeaExportDetails[i].poDate + "</td><td class=text-right>" + BidData[0].bidSeaExportDetails[i].poValue + "</td></tr>");
                                }
                            }
                        }
                        else {
                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].targetprice) + '</td><td>' + BidData[0].bidSeaExportDetails[i].maskVendor + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + '</td><td>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right >' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td></tr>');
                            jQuery("#tblServicesProductPrevtab_0").append('<tr id=trid' + i + '><td><a class="isDisabledClass" onclick="editValues(\'divbidItemsPrevtab_0\',\'trid' + i + '\')" ><i class="fa fa-pencil"></i></a></td><td>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].targetprice) + '</td><td>' + BidData[0].bidSeaExportDetails[i].maskVendor + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + '</td><td class=text-right>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '&nbsp;<a class="editbidstartprice ml-1 hide" onclick=editbidstartprice(' + BidData[0].bidSeaExportDetails[i].seid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].startingPrice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].priceDecreamentFrequency) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].priceDecreamentAmount) + '</td><td  class=hide>' + BidData[0].bidSeaExportDetails[i].seid + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '&nbsp;<a  onclick=editShowL1Price(' + BidData[0].bidSeaExportDetails[i].seid + ',\"tridPrev' + i + '"\) class=pencilHLP ><i class="fa fa-pencil"></i></a></td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td></tr>');

                        }

                    }
                    jQuery('#selectedvendorlistsPrev> tbody').empty()
                    jQuery('#selectedvendorlistsPrevtab_0> tbody').empty()
                    FlagForCheckShowPrice = 'N';
                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                        if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {
                            jQuery('#selectedvendorlistsPrev').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>');
                            jQuery('#selectedvendorlistsPrevtab_0').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td class=text-right>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                            if (BidData[0].bidVendorDetails[i].advFactor != 0) {
                                FlagForCheckShowPrice = "Y";
                            }
                            $('#thloadingfactor').show();
                        }
                        else {
                            jQuery('#selectedvendorlistsPrev').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td class=hide>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>');
                            jQuery('#selectedvendorlistsPrevtab_0').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td class="text-right hide">' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                            $('#thloadingfactor').hide();
                        }
                    }

                    jQuery('#tblparicipantslists> tbody').empty()
                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                        jQuery('#tblparicipantslists').append("<tr><td class=hide>" + BidData[0].bidVendorDetails[i].vendorID + "</td><td class=hide>" + BidData[0].bidVendorDetails[i].emailID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spancheckedrem\" class=checked ><input checked type=\"checkbox\" Onclick=\"Checkrem(this) \";  id=chkvenderrem" + BidData[0].bidVendorDetails[i].vendorID + "  value=" + BidData[0].bidVendorDetails[i].vendorID + " style=\"cursor:pointer\" name=\"chkvenderrem\"/></span></div></td><td>" + BidData[0].bidVendorDetails[i].vendorName + "</td></tr>");
                    }

                    if (FlagForCheckShowPrice == "Y") {
                        $("a.lambdafactor").removeAttr("onclick");
                        $('.lambdafactor').attr('disabled', 'disabled')
                    }
                    else {
                        $('.lambdafactor').removeAttr('disabled')
                    }

                }
            }
            if (sessionStorage.getItem('hdnbidtypeid') == 8) {
                $('#txtBidType').text("Coal Auction");
                if (BidData[0].bidCoalDetails.length > 0) {

                    $('#wrap_scrollerPrev').show();
                    $('#wrap_scrollerPrevtab_0').show();

                    if ($('#hdnClosingval').val() == "S") {
                        $(".staggered-item").show();

                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S. No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>GST %</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th class=hide>Mask Vendor</th><th style='width:60px !important'>Minimum<br/>Decrement</th><th>Decrement On</th><th>Last<br/>Invoice Price</th><th>Item<br/>Duration(Min)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th><th>Closing Time</th><th style=width:200px>Bid Duration<br/>(in minutes)</th></tr></thead>");
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>S.No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>GST %</th><th>Quantity</th><th>UOM</th><th>Bid start price</th><th>Hide Target Price</th><th style='width:60px !important'>Minimum<br/>Decrement</th><th>Decrement On</th><th>Last<br/>Invoice Price</th><th>Item<br/>Duration(Min)</th><th>Closing Time</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    }
                    else {
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>S.No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>GST %</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S. No.</th><th>Item/Product/Service</th><th>Remarks</th><th>Target Price</th><th>GST %</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th class=hide>Mask Vendor</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    }

                    for (var i = 0; i < BidData[0].bidCoalDetails.length; i++) {


                        var decrementon = ''

                        if (BidData[0].bidCoalDetails[i].decreamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = '%age'


                        if ($('#hdnClosingval').val() == "S") {

                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td>' + BidData[0].bidCoalDetails[i].destinationPort + '</td><td>' + BidData[0].bidCoalDetails[i].remarks + '</td><td class=text-right>' + BidData[0].bidCoalDetails[i].targetprice + '</td><td class=text-right>' + BidData[0].bidCoalDetails[i].gst + '</td><td class=text-right>' + BidData[0].bidCoalDetails[i].quantity + '</td><td>' + BidData[0].bidCoalDetails[i].uom + '</td><td class=text-right>' + thousands_separators(BidData[0].bidCoalDetails[i].ceilingPrice) + '</td><td class=hide>' + BidData[0].bidCoalDetails[i].MaskVendor + '</td><td class=text-right>' + BidData[0].bidCoalDetails[i].minimumDecreament + '</td><td>' + decrementon + '</td><td class=hide>' + BidData[0].bidCoalDetails[i].decreamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidCoalDetails[i].lastInvoicePrice) + '</td><td class=text-right>' + BidData[0].bidCoalDetails[i].itemBidDuration + '</td><td>' + BidData[0].bidCoalDetails[i].maskL1Price + '</td><td>' + BidData[0].bidCoalDetails[i].showStartPrice + '</td><td class=text-right>' + thousands_separators(BidData[0].bidCoalDetails[i].poUnitRate) + '</td><td>' + BidData[0].bidCoalDetails[i].poNo + '</td><td>' + BidData[0].bidCoalDetails[i].poVendorName + '</td><td>' + BidData[0].bidCoalDetails[i].poDate + '</td><td class=text-right>' + BidData[0].bidCoalDetails[i].poValue + '</td><td>' + BidData[0].bidCoalDetails[i].itemClosingTime + '</td><td><div class="pull-left"> <div id=spinner' + i + ' class="pull-left"><div class="input-group" style="width:110px;"><div class="spinner-buttons input-group-btn"><button type="button" class="btn spinner-down red btn-sm"><i class="fa fa-minus"></i></button> </div><input type=text class="spinner-input form-control input-sm" id=txtitemBidDuration' + i + ' maxlength="3" readonly><div class="spinner-buttons input-group-btn "><button type="button" class="btn spinner-up blue btn-sm"><i class="fa fa-plus"></i></button></div></div></div><button id="btnextendA" type="button" class="btn green btn-sm" onclick="fnTimeUpdateS(\'' + i + '\',\'' + BidData[0].bidCoalDetails[i].coalID + '\')">Go</button><div class="col-md-12"><p class="form-control-static" id=extendedDuration' + i + ' style="color:#3c763d; font-weight: 600; display: none;">Time&nbsp;Extended&nbsp;Successfully</p></div></td></tr>');
                            $('#spinner' + i).spinner({ value: 0, step: 1, min: 0, max: 999 }); //BidData[0].bidSeaExportDetails[i].ItemBidDuration

                            if (BidData[0].bidDetails[0].bidForID == "81" || BidData[0].bidDetails[0].bidForID == "1") {
                                jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td><a class=isDisabledClass onclick=editValues(\'divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidCoalDetails[i].destinationPort + "</td><td>" + BidData[0].bidCoalDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].gst + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].quantity) + "</td><td>" + BidData[0].bidCoalDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].ceilingPrice) + " <a class='changeMinDecreament ml-1' onclick=editbidstartpriceCA(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidCoalDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].decreamentOn + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].lastInvoicePrice) + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].itemBidDuration + "</td><td>" + BidData[0].bidCoalDetails[i].itemClosingTime + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].coalID + "</td><td>" + BidData[0].bidCoalDetails[i].maskL1Price + "&nbsp;<a class='lambdafactor' onclick=editShowL1Price(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\') class=pencilHLP ><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidCoalDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].poUnitRate) + "</td><td>" + BidData[0].bidCoalDetails[i].poNo + "</td><td>" + BidData[0].bidCoalDetails[i].poVendorName + "</td><td>" + BidData[0].bidCoalDetails[i].poDate + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].poValue) + "</td></tr>");
                            }
                            else {
                                jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td><a class=isDisabledClass onclick=editValues(\'divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidCoalDetails[i].destinationPort + "</td><td>" + BidData[0].bidCoalDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].gst + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].quantity) + "</td><td>" + BidData[0].bidCoalDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].ceilingPrice) + " <a class='changeMinDecreament ml-1' onclick=editbidstartpriceCA(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidCoalDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].decreamentOn + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].lastInvoicePrice) + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].itemBidDuration + "</td><td>" + BidData[0].bidCoalDetails[i].itemClosingTime + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].coalID + "</td><td>" + BidData[0].bidCoalDetails[i].maskL1Price + "</td><td>" + BidData[0].bidSeaExportDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + "</td><td>" + BidData[0].bidCoalDetails[i].poNo + "</td><td>" + BidData[0].bidCoalDetails[i].poVendorName + "</td><td>" + BidData[0].bidCoalDetails[i].poDate + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].poValue) + "</td></tr>");
                            }

                        }
                        else {

                            jQuery("#tblServicesProductPrev").append("<tr id=tridPrev" + i + "><td>" + (i + 1) + "</td><td>" + BidData[0].bidCoalDetails[i].destinationPort + "</td><td>" + BidData[0].bidCoalDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].gst + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].quantity) + "</td><td>" + BidData[0].bidCoalDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].ceilingPrice) + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].minimumDecreament + "</td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].decreamentOn + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].lastInvoicePrice) + '</td><td>' + BidData[0].bidCoalDetails[i].maskL1Price + '</td><td>' + BidData[0].bidCoalDetails[i].showStartPrice + '</td><td class=text-right>' + thousands_separators(BidData[0].bidCoalDetails[i].poUnitRate) + '</td><td>' + BidData[0].bidCoalDetails[i].poNo + '</td><td>' + BidData[0].bidCoalDetails[i].poVendorName + '</td><td>' + BidData[0].bidCoalDetails[i].poDate + '</td><td class=text-right>' + thousands_separators(BidData[0].bidCoalDetails[i].poValue) + '</td></tr>');
                            if (BidData[0].bidDetails[0].bidForID == "81" || BidData[0].bidDetails[0].bidForID == "1") {
                                jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td style='width:150px !important;'><a class='isDisabledClass' onclick=editValues('\divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidCoalDetails[i].destinationPort + "</td><td>" + BidData[0].bidCoalDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].gst + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].quantity) + "</td><td>" + BidData[0].bidCoalDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].ceilingPrice) + " <a class='changeMinDecreament ml-1' onclick=editbidstartpriceCA(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidCoalDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].decreamentOn + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].lastInvoicePrice) + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].coalID + "</td><td>" + BidData[0].bidCoalDetails[i].maskL1Price + "&nbsp;<a class='lambdafactor' onclick=editShowL1Price(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\') class=pencilHLP ><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidCoalDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].poUnitRate) + "</td><td>" + BidData[0].bidCoalDetails[i].poNo + "</td><td>" + BidData[0].bidCoalDetails[i].poVendorName + "</td><td>" + BidData[0].bidCoalDetails[i].poDate + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].poValue) + "</td></tr>");
                            }
                            else {
                                jQuery("#tblServicesProductPrevtab_0").append("<tr id=trid" + i + "><td style='width:150px !important;'><a class='isDisabledClass' onclick=editValues('\divbidItemsPrevtab_0\',\'trid" + i + "\') ><i class='fa fa-pencil'></i></a></td><td>" + (i + 1) + "</td><td>" + BidData[0].bidCoalDetails[i].destinationPort + "</td><td>" + BidData[0].bidCoalDetails[i].remarks + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].targetprice + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].gst + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].quantity + "</td><td>" + BidData[0].bidCoalDetails[i].uom + "</td><td class=text-right>" + thousands_separators(BidData[0].bidCoalDetails[i].ceilingPrice) + " <a class='changeMinDecreament ml-1' onclick=editbidstartpriceCA(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + BidData[0].bidCoalDetails[i].maskVendor + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].minimumDecreament + " <a class='changeMinDecreament ml-1' onclick=editMinDecreament(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td>" + decrementon + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].decreamentOn + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].lastInvoicePrice + "</td><td class=hide>" + BidData[0].bidCoalDetails[i].coalID + "</td><td>" + BidData[0].bidCoalDetails[i].maskL1Price + "</td><td>" + BidData[0].bidCoalDetails[i].showStartPrice + "&nbsp;<a class='' onclick=editShowStartPrice(" + BidData[0].bidCoalDetails[i].coalID + ",\'trid" + i + "\')><i class='fa fa-pencil'></i></a></td><td class=text-right>" + BidData[0].bidCoalDetails[i].poUnitRate + "</td><td>" + BidData[0].bidCoalDetails[i].poNo + "</td><td>" + BidData[0].bidCoalDetails[i].poVendorName + "</td><td>" + BidData[0].bidCoalDetails[i].poDate + "</td><td class=text-right>" + BidData[0].bidCoalDetails[i].poValue + "</td></tr>");
                            }
                        }

                    }
                    jQuery('#selectedvendorlistsPrev> tbody').empty()
                    jQuery('#selectedvendorlistsPrevtab_0> tbody').empty()
                    FlagForCheckShowPrice = 'N';
                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {

                        jQuery('#selectedvendorlistsPrev').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td></tr>');
                        jQuery('#selectedvendorlistsPrevtab_0').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td></tr>')
                        $('#thloadingfactor').hide();
                    }

                    jQuery('#tblparicipantslists> tbody').empty()
                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                        jQuery('#tblparicipantslists').append("<tr><td class=hide>" + BidData[0].bidVendorDetails[i].vendorID + "</td><td class=hide>" + BidData[0].bidVendorDetails[i].emailID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spancheckedrem\" class=checked ><input type=\"checkbox\" Onclick=\"Checkrem(this) \";  id=\"chkvenderrem\" value=" + BidData[0].bidVendorDetails[i].vendorID + " style=\"cursor:pointer\" name=\"chkvenderrem\"/></span></div></td><td>" + BidData[0].bidVendorDetails[i].vendorName + "</td></tr>");
                    }

                }
            }
            if (sessionStorage.getItem('hdnbidtypeid') == 6) {
                $('#txtBidType').text("Forward Auction");
                $('#hdnClosingval').val('').val(BidData[0].bidDetails[0].bidForID)
                if (BidData[0].bidScrapSalesDetails.length > 0) {
                    var max = BidData[0].bidScrapSalesDetails[0].attachmentSeqID;
                    $('#wrap_scrollerPrev').show();
                    $('#wrap_scrollerPrevtab_0').show();

                    $('#hdnauctiontype').val(BidData[0].bidDetails[0].bidForID)
                    if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {
                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S.No.</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                        $("#txtBidDurationForBidOpen").removeAttr("disabled", "disabled");
                        $('#btndiv').show()
                        $('#plusbtn').removeAttr("disabled", "disabled");
                        $('#minusbtn').removeAttr("disabled", "disabled");
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th>S.No.</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    }
                    if (BidData[0].bidDetails[0].bidForID == 82) {
                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S.No.</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th class=hide>Show L1 Price</th></tr></thead>");
                        $("#txtBidDurationForBidOpen").attr("disabled", "disabled");
                        $('#btndiv').hide()
                        $('#plusbtn').attr("disabled", "disabled");
                        $('#minusbtn').attr("disabled", "disabled");
                        jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th>S.No.</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Hide Target Price</th><th class=hide>Minimum Increment</th><th class=hide>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Starting Price</th><th>Price Increment Frequency</th><th>Price Increment Amount</th><th class=hide>Show L1 Price</th></tr></thead>");
                    }

                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {
                        if (max < BidData[0].bidScrapSalesDetails[i].attachmentSeqID) {
                            max = BidData[0].bidScrapSalesDetails[i].attachmentSeqID
                        }
                        FileseqNo = max
                        var increamenton = ''

                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            increamenton = 'Amount'
                        else
                            increamenton = '%age'

                        var attach = (BidData[0].bidScrapSalesDetails[i].attachments).replace(/\s/g, "%20");


                        if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {

                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right >' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].minimumIncreament + '</td><td>' + increamenton + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].lastSalePrice + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');
                            jQuery("#tblServicesProductPrevtab_0").append('<tr id=trid' + i + '><td><a class="isDisabledClass" onclick="editValues(\'divbidItemsPrevtab_0\',\'trid' + i + '\')" ><i class="fa fa-pencil"></i></a></td><td>' + (i + 1) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '&nbsp;<a class="editbidstartprice ml-1" onclick=editbidstartpriceFA(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td>' + BidData[0].bidScrapSalesDetails[i].minimumIncreament + '&nbsp;<a class="changeMinDecreament ml-1" onclick=editincreament(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + increamenton + '</td><td class=hide><a href=PortalDocs/Bid/' + jQuery('#ddlbid').val() + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + '</a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td  class=hide>' + BidData[0].bidScrapSalesDetails[i].psid + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '&nbsp;<a  onclick=editShowL1Price(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"trid' + i + '"\)  class=pencilHLP ><i class="fa fa-pencil"  ></i></a></td><td>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '&nbsp;<a class=lambdafactor onclick=editShowStartPrice(' + BidData[0].bidScrapSalesDetails[i].psid + ',\'trid' + i + '\')><i class="fa fa-pencil"></i></a></td></tr>');

                        }

                        if (BidData[0].bidDetails[0].bidForID == 82) {

                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right >' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].minimumIncreament + '</td><td>' + increamenton + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td></tr>');
                            jQuery("#tblServicesProductPrevtab_0").append('<tr id=trid' + i + '><td><a class="isDisabledClass" onclick="editValues(\'divbidItemsPrevtab_0\',\'trid' + i + '\')" ><i class="fa fa-pencil"></i></a></td><td>' + (i + 1) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '&nbsp;<a class="editbidstartprice ml-1" onclick=editbidstartpriceFA(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].minimumIncreament + '&nbsp;<a class="changeMinDecreament ml-1" onclick=editincreament(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"tridPrev' + i + '"\)><i class="fa fa-pencil"></i></a></td><td class=hide>' + increamenton + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].startingPrice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionFrequency) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionAmount) + '</td><td  class=hide>' + BidData[0].bidScrapSalesDetails[i].psid + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '&nbsp;<a  onclick=editShowL1Price(' + BidData[0].bidScrapSalesDetails[i].psid + ',\"tridPrev' + i + '"\) class=pencilHLP ><i class="fa fa-pencil"></i></a></td></tr>');

                        }

                    }
                }

                jQuery('#selectedvendorlistsPrev> tbody').empty()
                jQuery('#selectedvendorlistsPrevtab_0> tbody').empty()
                for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                    jQuery('#selectedvendorlistsPrev').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>');
                    jQuery('#selectedvendorlistsPrevtab_0').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                }
                jQuery('#tblparicipantslists> tbody').empty()
                for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                    jQuery('#tblparicipantslists').append("<tr><td class=hide>" + BidData[0].bidVendorDetails[i].vendorID + "</td><td class=hide>" + BidData[0].bidVendorDetails[i].emailID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spancheckedrem\" class=checked ><input type=\"checkbox\" Onclick=\"Checkrem(this) \";  id=\"chkvenderrem\" value=" + BidData[0].bidVendorDetails[i].vendorID + " style=\"cursor:pointer\" name=\"chkvenderrem\"/></span></div></td><td>" + BidData[0].bidVendorDetails[i].vendorName + "</td></tr>");
                }
            }
            if (sessionStorage.getItem('hdnbidtypeid') == 9) {
                $('#txtBidType').text("French Auction");
                $('#hdnClosingval').val('').val(BidData[0].bidDetails[0].bidForID)
                if (BidData[0].bidFrenchDetails.length > 0) {

                    $('#wrap_scrollerPrev').show();
                    $('#wrap_scrollerPrevtab_0').show();

                    $('#hdnauctiontype').val(BidData[0].bidDetails[0].bidForID)
                    $("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S.No.</th><th>Item Code</th><th>Item/Product</th><th>Target Price</th><th>Total Quantity</th><th>Min.Quantity</th><th>Max.Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th>Last Invoice Price</th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    $("#txtBidDurationForBidOpen").removeAttr("disabled", "disabled");
                    $('#btndiv').show()
                    $('#plusbtn').removeAttr("disabled", "disabled");
                    $('#minusbtn').removeAttr("disabled", "disabled");
                    jQuery("#tblServicesProductPrevtab_0").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th>S.No.</th><th>Item Code</th><th>Item/Product</th><th>Target Price</th><th>Total Quantity</th><th>Min.Quantity</th><th>Max.Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Increment</th><th>Increment On</th><th>Last Invoice Price</th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");


                    for (var i = 0; i < BidData[0].bidFrenchDetails.length; i++) {
                        var increamenton = ''
                        if (BidData[0].bidFrenchDetails[i].increamentOn == 'A')
                            increamenton = 'Amount'
                        else
                            increamenton = '%age'
                        $("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td>' + BidData[0].bidFrenchDetails[i].itemCode + '</td><td>' + BidData[0].bidFrenchDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].quantity) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].minOfferedQuantity) + '</td>td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].maxOfferedQuantity) + '</td><td>' + BidData[0].bidFrenchDetails[i].measurementUnit + '</td><td class=text-right >' + thousands_separators(BidData[0].bidFrenchDetails[i].bidStartPrice) + '</td><td>' + BidData[0].bidFrenchDetails[i].maskVendor + '</td><td class=text-right>' + BidData[0].bidFrenchDetails[i].minimumIncreament + '</td><td>' + increamenton + '</td><td class=text-right>' + BidData[0].bidFrenchDetails[i].lastInvoicePrice + '</td><td>' + BidData[0].bidFrenchDetails[i].showHLPrice + '</td><td>' + BidData[0].bidFrenchDetails[i].showStartPrice + '</td></tr>');
                        $("#tblServicesProductPrevtab_0").append('<tr id=trid' + i + '><td><a class="isDisabledClass" onclick="editValues(\'divbidItemsPrevtab_0\',\'trid' + i + '\')" ><i class="fa fa-pencil"></i></a></td><td>' + (i + 1) + '</td><td>' + BidData[0].bidFrenchDetails[i].itemCode + '</td><td>' + BidData[0].bidFrenchDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].quantity) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].minOfferedQuantity) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].maxOfferedQuantity) + '</td><td>' + BidData[0].bidFrenchDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].bidStartPrice) + '&nbsp;<a class="editbidstartprice ml-1" onclick=editbidstartpriceFF(' + BidData[0].bidFrenchDetails[i].frid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + BidData[0].bidFrenchDetails[i].maskVendor + '</td><td>' + BidData[0].bidFrenchDetails[i].minimumIncreament + '&nbsp;<a class="changeMinDecreament ml-1" onclick=editincreamentFF(' + BidData[0].bidFrenchDetails[i].frid + ',\"trid' + i + '"\)><i class="fa fa-pencil"></i></a></td><td>' + increamenton + '</td><td class=hide>' + BidData[0].bidFrenchDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidFrenchDetails[i].lastInvoicePrice) + '</td><td  class=hide>' + BidData[0].bidFrenchDetails[i].frid + '</td><td>' + BidData[0].bidFrenchDetails[i].showHLPrice + '&nbsp;<a  onclick=editShowL1Price(' + BidData[0].bidFrenchDetails[i].frid + ',\"trid' + i + '"\)  class=pencilHLP ><i class="fa fa-pencil"  ></i></a></td><td>' + BidData[0].bidFrenchDetails[i].showStartPrice + '&nbsp;<a class=lambdafactor onclick=editShowStartPrice(' + BidData[0].bidFrenchDetails[i].frid + ',\'trid' + i + '\')><i class="fa fa-pencil"></i></a></td></tr>');

                    }
                }

                jQuery('#selectedvendorlistsPrev> tbody').empty()
                jQuery('#selectedvendorlistsPrevtab_0> tbody').empty()
                for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                    jQuery('#selectedvendorlistsPrev').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>');
                    jQuery('#selectedvendorlistsPrevtab_0').append('<tr ><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                }
                jQuery('#tblparicipantslists> tbody').empty()
                for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                    jQuery('#tblparicipantslists').append("<tr><td class=hide>" + BidData[0].bidVendorDetails[i].vendorID + "</td><td class=hide>" + BidData[0].bidVendorDetails[i].emailID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spancheckedrem\" class=checked ><input type=\"checkbox\" Onclick=\"Checkrem(this) \";  id=\"chkvenderrem\" value=" + BidData[0].bidVendorDetails[i].vendorID + " style=\"cursor:pointer\" name=\"chkvenderrem\"/></span></div></td><td>" + BidData[0].bidVendorDetails[i].vendorName + "</td></tr>");
                }
            }

            if (BidData[0].bidDetails[0].isRunningBid.toLowerCase() == 'runningbid') {

                $("a.isDisabledClass").removeAttr("onclick");
                $('#btn-add-new-item').attr("disabled", "disabled");
                isRunningBid = "Y";
                $('.afterrunning').attr('disabled', 'disabled')
                if (BidData[0].bidDetails[0].bidClosingType == "S") {
                    $('#optopen').addClass('hide')
                }

            }
            else {
                $('.afterrunning').removeAttr('disabled')
                if (BidData[0].bidDetails[0].bidClosingType == "S") {
                    $('#optopen').removeClass('hide')
                }

            }

            if (BidData[0].bidDetails[0].status.toLowerCase() == 'close') {
                $('.Paction').addClass('hide')
            }
            else {
                $('.Paction').removeClass('hide')
            }
            if (BidData[0].bidDetails[0].bidForID == "83") {
                $("a.pencilHLP").removeAttr("onclick");
            }
            if (BidData[0].bidDetails[0].finalStatus.toLowerCase() != "not forwarded") {
                $("a.ctrladdapprovers").removeAttr("onclick");
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });



}
function fnheckAllremainder() {

    if ($("#chkAllrem").is(':checked') == true) {
        $('#displayTable').find('span#spandynamicrem').hide();
        $('table#tblparicipantslists').closest('.inputgroup').removeClass('has-error');


        $("#tblparicipantslists> tbody > tr").each(function (index) {
            $(this).find("span#spancheckedrem").addClass("checked");
            //$('input[name="chkvenderrem"]').prop('disabled', true);

        });
    }
    else {
        $("#tblparicipantslists> tbody > tr").each(function (index) {
            $(this).find("span#spancheckedrem").removeClass("checked");
            //  $('input[name="chkvenderrem"]').prop('disabled', false);
        });

    }


}

function Checkrem(event) {

    if ($(event).closest("span#spancheckedrem").attr('class') == 'checked') {
        $(event).closest("span#spancheckedrem").removeClass("checked")
        if ($("#chkAllrem").attr('checked')) {
            $("#chkAllrem").removeAttr('checked')
        }
    }

    else {
        var EvID = event.id;
        $(event).closest("span#spancheckedrem").addClass("checked")
        $('#displayTable').find('span#spandynamicrem').hide();
        $('table#tblparicipantslists').closest('.inputgroup').removeClass('has-error');

    }

}
var allUsers
function fetchRegisterUser() {
    var url = ''
    var data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "Isactive": "N"
    }
    // url = sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&Isactive=N"
    url = sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser"

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                allUsers = data;
            }
            else {
                allUsers = '';
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
}
function fnOpenPopupBidApprover() {
    fetchRegisterUser();
    fnGetBidApprovers();
}
jQuery("#txtApproverBid").keyup(function () {
    $('#hdnBidApproverID').val('0')

});

jQuery("#txtApproverBid").typeahead({
    source: function (query, process) {
        var data = allUsers;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.userName] = username;
            usernames.push(username.userName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].userID != "0") {
            sessionStorage.setItem('hdnBidApproverID', map[item].userID);
            $('#hdnBidApproverID').val(map[item].userID)
            $('#hdnBidApproverEmailID').val(map[item].emailID)
            $('#hdnBidApproverusername').val(map[item].userName)
        }
        else {
            gritternotification('Please select Approver  properly!!!');
        }

        return item;
    }

});

var rowBidApp = 0;
function addBidApprovers() {
    var status = "true";
    var UserID = jQuery("#hdnBidApproverID").val();
    var UserName = jQuery("#hdnBidApproverusername").val();
    var EmailID = jQuery("#hdnBidApproverEmailID").val();

    $("#tblBidapprovers tr:gt(0)").each(function () {
        var this_row = $(this);

        if ($.trim(this_row.find('td:eq(4)').html()) == $('#hdnBidApproverID').val()) {
            status = "false"
        }
    });
    if ($('#hdnBidApproverID').val() == "0" || jQuery("#txtApproverBid").val() == "") {
        $('.alert-danger').show();
        $('#spandangerapp').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandangerapp').html('Approver is already mapped for this Bid.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery("#txtApproverBid").val('')
        jQuery("#hdnBidApproverID").val('0')
        return false;
    }
    else {
        rowBidApp = rowBidApp + 1;
        if (!jQuery("#tblBidapprovers thead").length) {
            jQuery("#tblBidapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblBidapprovers").append('<tr id=trAppid' + rowBidApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteBidApprow(trAppid' + rowBidApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblBidapprovers").append('<tr id=trAppid' + rowBidApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteBidApprow(trAppid' + rowBidApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        jQuery("#txtApproverBid").val('')
        jQuery("#hdnBidApproverID").val('0')
    }
}
function deleteBidApprow(rowid) {

    rowBidApp = rowBidApp - 1;
    $('#' + rowid.id).remove();
    var rowCount = jQuery('#tblBidapprovers tr').length;
    var i = 1;
    if (rowCount > 1) {
        $("#tblBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
        jQuery('#btnbidapproversubmit').removeAttr("disabled");
    }
    else {

        jQuery('#btnbidapproversubmit').attr("disabled", "disabled");
    }
}

function MapBidapprover() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvers = '';
    var rowCount = jQuery('#tblBidapprovers tr').length;
    if (rowCount > 1) {
        $("#tblBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';

        })
    }
    var Approvers = {
        "BidID": parseInt(jQuery('#ddlbid').val()),
        "QueryBidApprovers": approvers,
        "CreatedBy": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/AddBidApproversByAdmin",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {

            $('#successapp').show();
            $('#spansuccessapp').html('Approvers added successfully');
            Metronic.scrollTo($('#successapp'), -200);
            $('#successapp').fadeOut(7000);
            bootbox.dialog({
                message: "Approvers added successfully!",
                buttons: {
                    confirm: {
                        label: "OK",
                        className: "btn-success",
                        callback: function () {
                            setTimeout(function () {
                                fetchallexportdetails();
                                $('#addapprovers').modal('hide')
                            }, 1000)

                        }
                    }

                }
            });
            jQuery.unblockUI();

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
}
$("#addapprovers").on("hidden.bs.modal", function () {
    jQuery("#txtApproverBid").val('')
    $('#hdnBidApproverEmailID').val('0')
    $('#hdnBidApproverID').val('0')
    $('#hdnBidApproverusername').val('0')
});
function fnGetBidApprovers() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidApprover/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&EventID=" + jQuery('#ddlbid').val() + "&Type=Bid",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidApprover/?EventID=" + jQuery('#ddlbid').val() + "&Type=Bid",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var str = "";
            rowBidApp = 0;
            jQuery("#tblBidapprovers").empty();
            jQuery('#tblBidapprovers').append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            for (var i = 0; i < data.length; i++) {
                if (data[i].isApprover != "P") {
                    rowBidApp = rowBidApp + 1;
                    str = '<tr id=trAppid' + rowBidApp + '>';
                    str += '<td><button type=button class="btn btn-xs btn-danger"  id=Removebtn' + rowBidApp + ' onclick="deleteBidApprow(trAppid' + rowBidApp + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                    str += '<td>' + data[i].approverName + '</td>'
                    str += "<td>" + data[i].emailID + "</td>";

                    str += "<td>" + data[i].adMinSrNo + "</td>";
                    str += "<td class=hide>" + data[i].userID + "</td></tr>";

                    jQuery('#tblBidapprovers').append(str);
                }
            }

            jQuery('#tblapprovers').append("</tbody>")
            if (jQuery('#tblBidapprovers tr').length <= 1) {
                jQuery('#btnbidapproversubmit').attr("disabled", "disabled");
            }
            else {
                jQuery('#btnbidapproversubmit').removeAttr("disabled");
            }


        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
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
function fnclosepopupApprovers() {
    $('#addapprovers').modal('hide')
}
function DownloadFile(aID) {

    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + jQuery('#ddlbid').val());
}
function fnTimeUpdateS(index, seaid) {

    SeId = seaid
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Data = {
        "BidClosingType": $('#hdnClosingval').val(),
        "BidID": parseInt(jQuery('#ddlbid').val()),
        "BidDuration": parseInt(jQuery('#txtitemBidDuration' + index).val()),
        "SEID": parseInt(SeId),
        "UserID": sessionStorage.getItem('UserID'),
        "GroupNo": $('#groupno' + index).text()
    }
    connection.invoke("UpdateTimefromAdmin", JSON.stringify(Data)).catch(function (err) {
        return console.error(err.toString());

    });
    connection.on("refreshTimer", function (data) {
        var JsonMsz = JSON.parse(data[0]);

        if (JsonMsz[0] == "1" && JsonMsz[1] == sessionStorage.getItem('UserID')) {
            // if (data == "1") {
            $('#extendedDuration' + index).show()
            setTimeout(function () { fetchallexportdetails() }, 1000)
            return false;
        }
        else {
            $('#extendedDuration' + index).text("This Item is already expired.").css('color', 'red')
            $('#extendedDuration' + index).show()
            setTimeout(function () { fetchallexportdetails() }, 3000)
        }
    })
    jQuery.unblockUI();

}


function DateandtimevalidateForBidOpen(ismailsend) {

    if (jQuery("#txtbidDate").val() == "" || jQuery("#txtbidDate").val() == null || jQuery("#txtBidDurationForBidOpen").val() == "" || jQuery("#txtBidDurationForBidOpen").val() == "0") {

        erroropenbid.show();
        $('#erropenbid').html('Please fill all Details');
        erroropenbid.fadeOut(3000);
        App.scrollTo(erroropenbid, -200);

    }
    else {
        var BidDate = new Date($('#txtbidDate').val().replace('-', ''));
        Dateandtimevalidate(BidDate, ismailsend, '');

    }



}
function Dateandtimevalidate(biddate, ismailsend, DateopenFor) {

    var Tab1Data = {
        "BidDate": biddate
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(Tab1Data),
        dataType: "json",
        success: function (data) {

            if (data == "1") {
                if (DateopenFor == "reopen") {
                    fnupdateStaggerReopendatetime();
                }
                else {
                    fnTimeUpdateClosedBid(ismailsend);
                }

            }
            else {
                bootbox.alert("Date and Time should not be less than current date and time.");
                return false;
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
}

function fnpauseaction() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    if ((jQuery("#txtreopenDate").val() == "" || jQuery("#txtBidDurationForBidOpen").val() == "" || jQuery("#txtBidDurationForBidOpen").val() == "0") && $('#ddlBidStatus').val() != 2) {
        erroropenbid.show();
        $('#erropenbid').html('Please fill all Details');
        erroropenbid.fadeOut(3000);
        App.scrollTo(erroropenbid, -200);
    }

    else {

        var reopendtst = new Date($('#txtreopenDate').val().replace('-', ''));
        Dateandtimevalidate(reopendtst, '', 'reopen');
    }
    jQuery.unblockUI();
}
function fnupdateStaggerReopendatetime() {
    var dtst = new Date($('#txtreopenDate').val().replace('-', ''));
    var Data = {
        "BidID": parseInt(jQuery('#ddlbid').val()),
        "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
        "SeID": 0,
        "BidDate": dtst,
        "Action": $('#ddlBidStatus option:selected').text(),//"Open",
        "UserID": sessionStorage.getItem('UserID')
    }

    //console.log(JSON.stringify(Data))
    connection.invoke("PauseStagger", JSON.stringify(Data)).catch(function (err) {
        return console.error(err.toString());

    });
    connection.on("refreshBidStatusAfterPause", function (data) {

        erroropenbid.hide();
        successopenbid.show();
        if ($('#ddlBidStatus option:selected').text().toLowerCase() == "close") {
            $('#succopenbid').html('Bid Closed successfully.');
        }
        else {
            $('#succopenbid').html('Bid ReOpen successfully.');
        }
        successopenbid.fadeOut(3000);
        App.scrollTo(successopenbid, -200);
        //fetchallexportdetails();
        setTimeout(function () {
            location.reload();
        }, 1000);
        jQuery.unblockUI();

    })
}
function fnGetPauseHistory() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var url = sessionStorage.getItem("APIPath") + "ConfigureBid/FetchBidpauseHistory/?BidID=" + sessionStorage.getItem('hdnbid');
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            $("#tblbidpauseHistory").empty()
            if (data.length > 0) {
                $('#divpausehitory').removeClass('hide');

                $("#tblbidpauseHistory").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Paused Item</th><th>Pause Date Time</th><th>Re Open Date Time</th><th>Balance Duration (mins)</th></thead>");
                for (var i = 0; i < data.length; i++) {
                    var bidPauseDate = fnConverToLocalTime(data[i].bidPauseDate);
                    //var bidReopenDate = fnConverToLocalTime(data[i].bidReopenDatetTime);
                    var bidReopenDate = data[i].bidReopenDatetTime;
                    //$("#tblbidpauseHistory").append('<tr><td>' + (i + 1) + '</td><td>' + data[i].destinationport + '</td><td>' + data[i].bidPauseDate + '</td><td>' + data[i].bidReopenDatetTime + '</td><td>' + data[i].bidDuration + '</td></tr>');
                    $("#tblbidpauseHistory").append('<tr><td>' + (i + 1) + '</td><td>' + data[i].destinationport + '</td><td>' + bidPauseDate + '</td><td>' + bidReopenDate + '</td><td>' + data[i].bidDuration + '</td></tr>');
                }
            }
            else {
                $('#divpausehitory').addClass('hide');
                jQuery("#tblbidpauseHistory").append("<tr><td>No Data Found</td></tr>")
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

        }
    })
    jQuery.unblockUI();
}
function fnTimeUpdate() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var Data = {
        "BidClosingType": $('#hdnClosingval').val(),
        "BidID": parseInt(jQuery('#ddlbid').val()),
        "BidDuration": parseInt(jQuery('#txtBidDurationPrev').val()),
        "SEID": 0

    }
    //alert(JSON.stringify(Data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/UpdateBidTime/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            if (data == "1") {
                $('#extendedDurationPara').show()
            }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }
    })
}

function fnTimeUpdateClosedBid(isMailSend) {
    var StartDT = new Date($('#txtbidDate').val().replace('-', ''));
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var finalStatus = "";
    if ($('#ddlBidfinalStatus').val() != null && $('#ddlBidfinalStatus').val() != "") {
        finalStatus = $('#ddlBidfinalStatus').val();
    }
    var Data = {
        "BidStatus": parseInt($('#ddlBidStatus option:selected').val()),
        "BidID": parseInt(jQuery('#ddlbid').val()),
        "BidDuration": parseInt(jQuery('#txtBidDurationForBidOpen').val()),
        "BidDate": StartDT,
        "IsMailSend": isMailSend,
        "FinalStatus": finalStatus,
        "UserID": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem("CustomerID"))
    }

    connection.invoke("UpdateBidStatusfromManage", JSON.stringify(Data)).catch(function (err) {
        return console.error(err.toString());

    });
    connection.on("refreshTimeronClients", function (data) {

        if (data == sessionStorage.getItem('UserID')) {
            erroropenbid.hide();
            successopenbid.show();
            $('#succopenbid').html('Bid updated successfully');
            successopenbid.fadeOut(3000);
            App.scrollTo(successopenbid, -200);
            setTimeout(function () {
                location.reload();
            }, 1000)

            //fetchallexportdetails();
            jQuery.unblockUI();
        }
    });

}

function editValues(divName, rowid) {
    var isEditable = true;
    var extval = -1;
    if (rowid == 'New') {
        isNewLineItem = 'Y';
        rowid = '';
    }
    showhideItemBidDuration();
    isBidEventChanged = true;

    if (divName == 'divbidTimePrevtab_0') {
        $("#divbidDatePrevtab_0").show();
        $("#btn-submit-datetime").show();
        $("#btn-submit-modal").hide();
        $("#" + divName).show();
        $("#" + rowid).show();
        $("#txtinputBidDatePrevtab_0").val(jQuery("#txtbidDatePrevtab_0").html());
    }
    if (divName == 'divbidAttachFilePrevtab_0') {
        $("#" + divName).show();
    }
    if (divName == 'divbidTermsFilePrevtab_0') {
        $("#" + divName).show();
    }
    if (divName == 'divbidextension') {
        $("#" + divName).show();
        if ($("#mapbidextensionPrevtab_0").text().toLowerCase() != "unlimited") {
            extval = $("#mapbidextensionPrevtab_0").text();
        }
        $("#txtnoofextensiontab_0").val(extval);
    }
    if (divName == 'divhidevendors') {
        $("#" + divName).show();
        $("#drphidevendor").val(jQuery("#hidevendor").text() == 'Yes' ? 'Y' : 'N');
    }
    if (divName == 'divbidShowL1L2') {
        $("#" + divName).show();

        if (sessionStorage.getItem('hdnbidtypeid') == 7 || sessionStorage.getItem('hdnbidtypeid') == 8) {
            $('#div_RArank').removeClass('hide')
            $('#div_FArank').addClass('hide')
            $('#div_FFrank').addClass('hide')
            $("#drpshowL1L2").val(jQuery("#showL1l2").text() == 'As L1, L2, L3 etc.' ? 'Y' : 'N');

        }
        else if (sessionStorage.getItem('hdnbidtypeid') == 6) {

            $('#div_FArank').removeClass('hide')
            $('#div_RArank').addClass('hide')
            $('#div_FFrank').addClass('hide')
            $("#drpshowH1H2").val(jQuery("#showL1l2").text() == 'As H1, H2, H3 etc.' ? 'Y' : 'N');

        }
        else if (sessionStorage.getItem('hdnbidtypeid') == 9) {

            $('#div_FArank').addClass('hide')
            $('#div_RArank').addClass('hide')
            $('#div_FFrank').removeClass('hide')
            if (jQuery("#showL1l2").text() == 'As H1, H2, H3 etc.') {
                $("#drpshowH1H2NA").val('Y')
            }
            else if (jQuery("#showL1l2").text().toLowerCase() == 'do not display') {
                $("#drpshowH1H2NA").val('NA')
            }
            else {
                $("#drpshowH1H2NA").val('N')
            }

        }

    }
    if (divName == 'divbidItemsPrevtab_0') {
        var chkBidDate = new Date($("#txtbidDatePrevtab_0").html().replace('-', ''));
        var currDt = new Date();
        if (currDt < chkBidDate) {
            isEditable = true;
        }
        else {
            isEditable = false;
        }
        $('#nonFrenchdiv').addClass('hide')
        $('#divfrench').addClass('hide')
        if (sessionStorage.getItem('hdnbidtypeid') == 7 && (BidForID == 81 || BidForID == 83)) {
            $('#nonFrenchdiv').removeClass('hide')
            $('#lblshowprice').html("Show L1 Price")
            $(".RaAuctionFields").show();
            $('.radutchAuctionFields').hide();
            $(".faEngilshAuctionFields").hide();
            $(".fadutchAuctionFields").hide();
            $('#lblmindec').show();
            $('#BSPENG').show();
            $('#checkmaskvendor').show()
            $('#checkshowstartPrice').show()
            $('.RAFAEnglishonly').show();
            $('#RAFAEnglishonly').show();
            $("#" + divName).show();
            $('#rowid').val(rowid.id);

            $('#txtdestinationPort').val($("#" + rowid).find("td:eq(2)").text())
            $('#txtbiddescriptionP').val($("#" + rowid).find("td:eq(3)").text())

            $('#txttargetprice').val($("#" + rowid).find("td:eq(4)").text())

            $('#txtquantitiy').val($("#" + rowid).find("td:eq(5)").text())
            $('#dropuom').val($("#" + rowid).find("td:eq(6)").text())
            $('#txtUOM').val($("#" + rowid).find("td:eq(6)").text())

            $('#txtCeilingPrice').val($("#" + rowid).find("td:eq(7)").text())
            //$('#checkmaskvendor').val($("#" + rowid).find("td:eq(8)").text())
            if (hdnSeId == 0 || hdnSeId == null) {
                $('#checkmaskvendor').val($("#checkmaskvendor option:first").val());
            }
            else {
                $('#checkmaskvendor').val($("#" + rowid).find("td:eq(8)").text())
            }


            if ($('#hdnClosingval').val() == 'A') {

                hdnSeId = $("#" + rowid).find("td:eq(13)").text()
                if (hdnSeId == 0 || hdnSeId == null) {
                    $('#checkL1Price').val($("#checkL1Price option:first").val());
                    $('#checkshowstartPrice').val($("#checkshowstartPrice option:first").val());
                }
                else {
                    $('#checkL1Price').val($("#" + rowid).find("td:eq(14)").text().trim())
                    $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(15)").text().trim())
                }
            } else {
                hdnSeId = $("#" + rowid).find("td:eq(15)").text()
                if (hdnSeId == 0 || hdnSeId == null) {
                    $('#checkL1Price').val($("#checkL1Price option:first").val());
                    $('#checkshowstartPrice').val($("#checkshowstartPrice option:first").val());
                }
                else {
                    $('#checkL1Price').val($("#" + rowid).find("td:eq(16)").text().trim())
                    $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(17)").text().trim())
                }
                //$('#checkL1Price').val($("#" + rowid).find("td:eq(16)").text().trim())
                //$('#checkshowstartPrice').val($("#" + rowid).find("td:eq(17)").text().trim())
            }
            $('#txtminimumdecreament').val($("#" + rowid).find("td:eq(9)").text())
            $("#txtselectedCurrency").val($("#dropCurrencyPrevtab_0").html());
            if (hdnSeId == 0 || hdnSeId == null) {
                $('#drpdecreamenton').val($("#drpdecreamenton option:first").val());
            }
            else {
                $('#drpdecreamenton').val($("#" + rowid).find("td:eq(11)").text())

            }
            //$('#drpdecreamenton').val($("#" + rowid).find("td:eq(11)").text())
            $('#txtlastinvoiceprice').val($("#" + rowid).find("td:eq(12)").text())
            $('#txtitembidduration').val($("#" + rowid).find("td:eq(13)").text())
            $('#divGST').hide()
            $('#lblGST').hide()

        }
        else if (sessionStorage.getItem('hdnbidtypeid') == 7 && BidForID == 82) {
            $('#nonFrenchdiv').removeClass('hide')
            $('#lblshowprice').html("Show L1 Price")
            $(".RaAuctionFields").show();
            $('.radutchAuctionFields').show();
            $('.RAFAEnglishonly').hide();
            $('#RAFAEnglishonly').hide();
            $('#lblmindec').hide();

            $('#checkmaskvendor').show()
            $('#checkshowstartPrice').hide()
            $('#lblcelingfloor').html("Floor/ Min. Price<span class=required> *</span>")
            $('#lblpricefrequency').html("Price Decrement Frequency<span class=required> *</span>")
            $('#lblpricedecamount').html("Price Decrement Amount<span class=required> *</span>")
            $(".faEngilshAuctionFields").hide();
            $(".fadutchAuctionFields").show();
            $('#CElingFA').hide();
            $("#" + divName).show();
            $('#rowid').val(rowid.id);

            $('#txtdestinationPort').val($("#" + rowid).find("td:eq(1)").text())
            $('#txtbiddescriptionP').val($("#" + rowid).find("td:eq(2)").text())

            $('#txttargetprice').val($("#" + rowid).find("td:eq(3)").text())
            if (hdnSeId == 0 || hdnSeId == null) {
                $('#checkmaskvendor').val($("#checkmaskvendor option:first").val());
            }
            else {
                $('#checkmaskvendor').val($("#" + rowid).find("td:eq(8)").text())
            }
            //('#checkmaskvendor').val($("#" + rowid).find("td:eq(4)").text())
            $('#txtquantitiy').val($("#" + rowid).find("td:eq(5)").text())
            $('#dropuom').val($("#" + rowid).find("td:eq(6)").text())
            $('#txtUOM').val($("#" + rowid).find("td:eq(6)").text())
            $('#txtCeilingPrice').val($("#" + rowid).find("td:eq(7)").text())
            hdnSeId = $("#" + rowid).find("td:eq(12)").text()

            $("#txtselectedCurrency").val($("#dropCurrencyPrevtab_0").html());
            $('#txtlastinvoiceprice').val($("#" + rowid).find("td:eq(8)").text())
            $('#txtminimumdecreament').val($("#" + rowid).find("td:eq(9)").text())
            $('#txtpriceincreamentamount').val($("#" + rowid).find("td:eq(11)").text())
            $('#txtpricefrequency').val($("#" + rowid).find("td:eq(10)").text())
            $('#divGST').hide()
            $('#lblGST').hide()

        }
        else if (sessionStorage.getItem('hdnbidtypeid') == 8) {
            $('#nonFrenchdiv').removeClass('hide')
            $('#lblshowprice').html("Show L1 Price")
            $(".RaAuctionFields").show();
            $('.radutchAuctionFields').hide();
            $(".faEngilshAuctionFields").hide();
            $(".fadutchAuctionFields").hide();
            $('#lblmindec').show();
            $('#BSPENG').show();
            $('#checkmaskvendor').show()
            $('#checkshowstartPrice').show()
            $('.RAFAEnglishonly').show();
            $('#RAFAEnglishonly').show();
            $("#" + divName).show();
            $('#rowid').val(rowid.id);

            $('#txtdestinationPort').val($("#" + rowid).find("td:eq(2)").text())
            $('#txtbiddescriptionP').val($("#" + rowid).find("td:eq(3)").text())

            $('#txttargetprice').val($("#" + rowid).find("td:eq(4)").text())
            $('#txtGST').val($("#" + rowid).find("td:eq(5)").text())
            $('#txtquantitiy').val($("#" + rowid).find("td:eq(6)").text())
            $('#dropuom').val($("#" + rowid).find("td:eq(7)").text())
            $('#txtUOM').val($("#" + rowid).find("td:eq(7)").text())
            $('#txtCeilingPrice').val($("#" + rowid).find("td:eq(8)").text())
            //$('#checkmaskvendor').val($("#" + rowid).find("td:eq(9)").text())
            if (hdnSeId == 0 || hdnSeId == null) {
                $('#checkmaskvendor').val($("#checkmaskvendor option:first").val());
            }
            else {
                $('#checkmaskvendor').val($("#" + rowid).find("td:eq(8)").text())
            }

            if ($('#hdnClosingval').val() == 'A') {

                hdnSeId = $("#" + rowid).find("td:eq(14)").text()
                if (hdnSeId == 0 || hdnSeId == null) {
                    $('#checkL1Price').val($("#checkL1Price option:first").val());
                    $('#checkshowstartPrice').val($("#checkshowstartPrice option:first").val());
                }
                else {
                    $('#checkL1Price').val($("#" + rowid).find("td:eq(15)").text().trim())
                    $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(16)").text().trim())
                }

            } else {
                hdnSeId = $("#" + rowid).find("td:eq(16)").text()
                if (hdnSeId == 0 || hdnSeId == null) {
                    $('#checkL1Price').val($("#checkL1Price option:first").val());
                    $('#checkshowstartPrice').val($("#checkshowstartPrice option:first").val());
                }
                else {
                    $('#checkL1Price').val($("#" + rowid).find("td:eq(17)").text().trim())
                    $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(18)").text().trim())
                }

            }
            $('#txtminimumdecreament').val($("#" + rowid).find("td:eq(10)").text())
            $("#txtselectedCurrency").val($("#dropCurrencyPrevtab_0").html());
            if (hdnSeId == 0 || hdnSeId == null) {
                $('#drpdecreamenton').val($("#drpdecreamenton option:first").val());
            }
            else {
                $('#drpdecreamenton').val($("#" + rowid).find("td:eq(12)").text())

            }
            //$('#drpdecreamenton').val($("#" + rowid).find("td:eq(12)").text())
            $('#txtlastinvoiceprice').val($("#" + rowid).find("td:eq(13)").text())
            $('#txtitembidduration').val($("#" + rowid).find("td:eq(14)").text())
            $('#divGST').show()
            $('#lblGST').show()

        }
        else if (sessionStorage.getItem('hdnbidtypeid') == 6) {
            $('#nonFrenchdiv').removeClass('hide')
            $(".RaAuctionFields").hide();
            $(".faEngilshAuctionFields").show();
            $("#" + divName).show();
            $('#rowid').val(rowid.id);

            $('#txtshortname').val($("#" + rowid).find("td:eq(2)").text())

            $('#txttargetprice').val($("#" + rowid).find("td:eq(3)").text())

            $('#txtquantitiy').val($("#" + rowid).find("td:eq(4)").text())
            $('#dropuom').val($("#" + rowid).find("td:eq(5)").text())
            $('#txtUOM').val($("#" + rowid).find("td:eq(5)").text())
            $('#txtCeilingPrice').val($("#" + rowid).find("td:eq(6)").text())
            //$('#checkmaskvendor').val($("#" + rowid).find("td:eq(7)").text())
            if (hdnSeId == 0 || hdnSeId == null) {
                $('#checkmaskvendor').val($("#checkmaskvendor option:first").val());
            }
            else {
                $('#checkmaskvendor').val($("#" + rowid).find("td:eq(8)").text())
            }
            if ($('#hdnClosingval').val() == 81 || $('#hdnClosingval').val() == 83) {
                $('#lblshowprice').html("Show H1 Price")
                hdnSeId = $("#" + rowid).find("td:eq(14)").text()
                $('#txtminimumdecreament').val($("#" + rowid).find("td:eq(8)").text())
                if (hdnSeId == 0 || hdnSeId == null) {
                    $('#checkL1Price').val($("#checkL1Price option:first").val());
                    $('#checkshowstartPrice').val($("#checkshowstartPrice option:first").val());
                }
                else {
                    $('#checkL1Price').val($("#" + rowid).find("td:eq(15)").text().trim())
                    $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(16)").text().trim())
                }
                //$('#checkL1Price').val($("#" + rowid).find("td:eq(15)").text().trim())
                //$('#checkshowstartPrice').val($("#" + rowid).find("td:eq(16)").text().trim())

                $('#lblforonltfaeng').show();
                $('#RAFAEnglishonly').show();
                $('.RAFAEnglishonly').show();
                $('#BSPENG').show();
                $(".fadutchAuctionFields").hide();

            } else {

                $('#lblshowprice').html("Show L1 Price")

                $('#lblcelingfloor').html("Starting Price<span class=required> *</span>")
                $('#lblpricefrequency').html("Price Increment Frequency<span class=required> *</span>")
                $('#lblpricedecamount').html("Price Increment Amount<span class=required> *</span>")
                hdnSeId = $("#" + rowid).find("td:eq(17)").text()
                $('#txtminimumdecreament').val($("#" + rowid).find("td:eq(14)").text())

                $('#checkL1Price').val('N');
                $(".fadutchAuctionFields").show();
                $('#lblforonltfaeng').hide();
                $('#RAFAEnglishonly').hide();
                $('.RAFAEnglishonly').hide();
                $('#BSPENG').hide();
                $(".fadutchAuctionFields").show();
            }

            $("#txtselectedCurrency").val($("#dropCurrencyPrevtab_0").html());
            if (hdnSeId == 0 || hdnSeId == null) {
                $('#drpdecreamenton').val($("#drpdecreamenton option:first").val());
            }
            else {
                $('#drpdecreamenton').val($("#" + rowid).find("td:eq(11)").text())

            }
            //$('#drpdecreamenton').val($("#" + rowid).find("td:eq(11)").text())
            $('#txtlastinvoiceprice').val($("#" + rowid).find("td:eq(12)").text())

            $('#txtpriceincreamentamount').val($("#" + rowid).find("td:eq(16)").text())
            $('#txtpricefrequency').val($("#" + rowid).find("td:eq(15)").text())

            $('#divGST').hide()
            $('#lblGST').hide()

        }
        else if (sessionStorage.getItem('hdnbidtypeid') == 9) {
            $("#" + divName).show();
            $('#divfrench').removeClass('hide')
            $('#rowid').val(rowid.id);
            $('#txtitemcodefrench').val($("#" + rowid).find("td:eq(2)").text())
            $('#txtItemnameFrench').val($("#" + rowid).find("td:eq(3)").text())
            $('#txttargetpricefrench').val($("#" + rowid).find("td:eq(4)").text())
            $('#txtquantitiyfrench').val($("#" + rowid).find("td:eq(5)").text())
            $('#txtminquantitiy').val($("#" + rowid).find("td:eq(6)").text())
            $('#txtmaxquantitiy').val($("#" + rowid).find("td:eq(7)").text())
            $('#txtUOMfrench').val($("#" + rowid).find("td:eq(8)").text())
            $('#dropuomfrench').val($("#" + rowid).find("td:eq(8)").text())
            $('#txtCeilingPricefrench').val($("#" + rowid).find("td:eq(9)").text())
            $('#checkmaskvendorfrench').val($("#" + rowid).find("td:eq(10)").text())

            hdnSeId = $("#" + rowid).find("td:eq(15)").text()
            $('#txtminimumdecreamentfrench').val($("#" + rowid).find("td:eq(11)").text())
            $('#checkH1Pricefrench').val($("#" + rowid).find("td:eq(16)").text().trim())
            $('#checkshowstartPrice').val($("#" + rowid).find("td:eq(17)").text().trim())
            $("#txtselectedCurrencyfrench").val($("#dropCurrencyPrevtab_0").html());
            $('#drpdecreamentonfrench').val($("#" + rowid).find("td:eq(13)").text())
            $('#txtlastinvoicepricefrench').val($("#" + rowid).find("td:eq(14)").text())
        }
    }
    if (isEditable) {
        $("#editValuesModal").modal('show');
    }
}
function CheckminQuantity(id) {
    var biddidval = $('#' + id.id).val();

    if (parseFloat(removeThousandSeperator(biddidval)) > parseFloat(removeThousandSeperator($('#txtquantitiyfrench').val())) || $('#txtminquantitiy').val() == "") {
        $('#' + id.id).closest('.minq').removeClass('has-success').addClass('has-error');
        $('#spnminq').removeClass('hide');
        $('#spnminq').text('Min Quantity should be less than Quantity');
        $('#' + id.id).val('')
    }
    else {
        $('#spnminq').addClass('hide');
    }
}
function CheckmaxQuantity(id) {
    var biddidval = $('#' + id.id).val();
    if (parseFloat(removeThousandSeperator(biddidval)) > parseFloat(removeThousandSeperator($('#txtquantitiyfrench').val())) || $('#txtmaxquantitiy').val() == "" || parseFloat(removeThousandSeperator(biddidval)) > parseFloat(removeThousandSeperator($('#txtquantitiyfrench').val()))) {
        $('#' + id.id).closest('.maxq').removeClass('has-success').addClass('has-error');
        $('#spnmaxq').removeClass('hide');
        $('#spnmaxq').text('Max Quantity should not be greater than Quantity');
        $('#' + id.id).val('')
    }
    else {
        $('#spnmaxq').addClass('hide');
    }
}
function checkminmax(id) {
    $('#spnmaxq').addClass('hide');
    $('#spnminq').addClass('hide');
    $('.maxq').addClass('has-success').removeClass('has-error');
    $('.minq').addClass('has-success').removeClass('has-error');
}
function fnclearmsz(id) {
    $('#' + id).addClass('hide')
}



function formSubmitEditEvent() {

    var Data = {};
    if (isNewLineItem == 'Y') {
        addrowfield()

    }
    else {
        isNewLineItem = 'N';
        if ($("#txtinputbidTimePrevtab_0").val() != '' && $('#divbidTimePrevtab_0').is(':visible')) {
            Data = {
                "QueryString": $("#txtinputbidTimePrevtab_0").val(),
                "QueryStringDT": $("#txtinputBidDatePrevtab_0").val(),
                "valType": "BTD",
                "BidId": parseInt(sessionStorage.getItem('hdnbid')),
                "BidClosingType": _bidClosingType,
                "SeId": 0,
                "DecreamentOn": '',
                "UserID": sessionStorage.getItem('UserID')

            }
        }

        if ($('#file1').val() != '' && $('#divbidTermsFilePrevtab_0').is(':visible')) {

            var filename1 = (jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1)).replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
            Data = {
                "QueryString": filename1,
                "QueryStringDT": 'NA',
                "valType": "BAT",
                "BidId": parseInt(sessionStorage.getItem('hdnbid')),
                "BidClosingType": 'NA',
                "SeId": 0,
                "DecreamentOn": '',
                "UserID": sessionStorage.getItem('UserID')

            }
            //** Upload Files on Azure PortalDocs folder
            if ($('#file1').val() != '') {
                fnUploadFilesonAzure('file1', filename1, 'Bid/' + sessionStorage.getItem('hdnbid'));

            }

        }
        if ($('#drpshowL1L2').val() != '' && $('#divbidShowL1L2').is(':visible')) {
            var showrank = "Y"
            if (sessionStorage.getItem('hdnbidtypeid') == "6") {

                showrank = $("#drpshowH1H2").val()

            }
            else if (sessionStorage.getItem('hdnbidtypeid') == "7") {
                showrank = $("#drpshowL1L2").val()
            }

            else if (sessionStorage.getItem('hdnbidtypeid') == "8") {
                showrank = $("#drpshowL1L2").val()
            }
            else {

                showrank = $("#drpshowH1H2NA").val()
            }
            Data = {

                "QueryString": showrank,
                "QueryStringDT": 'NA',
                "valType": "BAL",
                "BidId": parseInt(sessionStorage.getItem('hdnbid')),
                "BidClosingType": 'NA',
                "SeId": 0,
                "DecreamentOn": '',
                "UserID": sessionStorage.getItem('UserID'),
                "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))

            }
        }
        if ($('#drphidevendor').val() != '' && $('#divhidevendors').is(':visible')) {

            Data = {
                "QueryString": $("#drphidevendor").val(),
                "QueryStringDT": 'NA',
                "valType": "BHV",
                "BidId": parseInt(sessionStorage.getItem('hdnbid')),
                "BidClosingType": 'NA',
                "SeId": 0,
                "DecreamentOn": '',
                "UserID": sessionStorage.getItem('UserID'),
                "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))

            }
        }
        if ($('#txtnoofextensiontab_0').val() != '' && $('#divbidextension').is(':visible')) {

            Data = {
                "QueryString": $("#txtnoofextensiontab_0").val(),
                "QueryStringDT": 'NA',
                "valType": "BNE",
                "BidId": parseInt(sessionStorage.getItem('hdnbid')),
                "BidClosingType": 'NA',
                "SeId": 0,
                "DecreamentOn": '',
                "UserID": sessionStorage.getItem('UserID'),
                "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))

            }
        }
        if ($('#file2').val() != '' && $('#divbidAttachFilePrevtab_0').is(':visible')) {

            var filename2 = (jQuery('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1)).replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
            Data = {
                "QueryString": filename2,
                "QueryStringDT": 'NA',
                "valType": "BAO",
                "BidId": parseInt(sessionStorage.getItem('hdnbid')),
                "BidClosingType": 'NA',
                "SeId": 0,
                "DecreamentOn": '',
                "UserID": sessionStorage.getItem('UserID'),
                "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))

            }
            //** Upload Files on Azure PortalDocs folder
            if ($('#file2').val() != '') {
                fnUploadFilesonAzure('file2', filename2, 'Bid/' + sessionStorage.getItem('hdnbid'));
            }
        }

        if ($("#divbidItemsPrevtab_0").is(':visible')) {
            //** update bid parameters RA/FA
            editrowfields();
            Data = '';

        }

        if (Data != '') {
            connection.invoke("UpdateBidDetailsfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());

            });
            connection.on("refreshBidDetailsManage", function (data) {
                var JsonMsz = JSON.parse(data[0]);
                if (JsonMsz.UserID == sessionStorage.getItem('UserID')) {
                    if (isBidEventChanged == true) {
                        $("#btnuserConfirmation").show();
                    }
                    $("#msgSuccessEditEvent").find("span").html('Data Successfully saved.')
                    $("#msgSuccessEditEvent").show();
                    $("#msgSuccessEditEvent").fadeOut(5000);
                    fetchallexportdetails();
                    setTimeout(function () {
                        $("#editValuesModal").modal("hide")
                    }, 5000)

                    jQuery.unblockUI();
                }
            });
        }

    }

}

function addrowfield() {
    var targetprice = 0;
    var targetpricefrench = 0;
    var lastinvoice = 0; var lastinvoicefrench = 0; var itemduration = 0;
    var _Totalbiddurationfordutch = 0; var mininc = 0; var startingprice = 0; var incon = ''; var pricereducfeq = 0;
    var pricereductionamount = 0;
    var startDateTime = jQuery("#txtbidDatePrevtab_0").html();// + " " + jQuery("#txtbidTimePrevtab_0").html();
    //alert(jQuery("#txtbidDatePrevtab_0").html());
    //debugger;

    if ($('#txttargetprice').val() != '') {
        targetprice = $('#txttargetprice').val();
    }
    if ($('#txttargetpricefrench').val() != '') {
        targetpricefrench = $('#txttargetpricefrench').val();
    }
    if ($('#txtlastinvoiceprice').val() != '') {
        lastinvoice = $('#txtlastinvoiceprice').val();
    }
    if ($('#txtlastinvoicepricefrench').val() != '') {
        lastinvoicefrench = $('#txtlastinvoicepricefrench').val();
    }
    if (($('#dropuom').val() == '' || $('#dropuom').val() == '0') && sessionStorage.getItem("hdnbidtypeid") != 9) {
        $("#msgErrorItemEvent").find("span").html('Please select UOM properly.')
        $("#msgErrorItemEvent").show();
        $("#msgErrorItemEvent").fadeOut(5000);
        jQuery.unblockUI();
        return false;
    }
    else if (($('#dropuomfrench').val() == '' || $('#dropuomfrench').val() == '0') && sessionStorage.getItem("hdnbidtypeid") == 9) {
        $("#msgErrorItemEvent").find("span").html('Please select UOM properly.')
        $("#msgErrorItemEvent").show();
        $("#msgErrorItemEvent").fadeOut(5000);
        jQuery.unblockUI();
        return false;
    }
    else if ($('#hdnClosingval').val() == 'A' && sessionStorage.getItem("hdnbidtypeid") == 7 && BidForID != 82) {
        itemduration = 0;
        _Totalbiddurationfordutch = 0;
    }
    else if ($('#hdnClosingval').val() == 'S' && sessionStorage.getItem("hdnbidtypeid") == 7 && BidForID != 82) {
        itemduration = $("#txtitembidduration").val();
        _Totalbiddurationfordutch = 0;
    }
    else if (BidForID == 82 && sessionStorage.getItem("hdnbidtypeid") == 7) {
        mininc = 0;
        incon = '';
        startingprice = removeThousandSeperator($('#txtminimumdecreament').val())
        pricereducfeq = $('#txtpricefrequency').val()
        pricereductionamount = removeThousandSeperator($('#txtpriceincreamentamount').val())
        _Totalbiddurationfordutch = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtminimumdecreament").val())) / removeThousandSeperator($("#txtpriceincreamentamount").val())) * $("#txtpricefrequency").val()) + parseInt($("#txtpricefrequency").val());
    }
    else if (($('#hdnClosingval').val() == 81 || $('#hdnClosingval').val() == 83) && sessionStorage.getItem("hdnbidtypeid") == 6) {
        mininc = parseFloat(removeThousandSeperator($('#txtminimumdecreament').val()))
        startingprice = 0;
        incon = $('#drpdecreamenton option:selected').val();
        pricereducfeq = 0;
        pricereductionamount = 0;
        _Totalbiddurationfordutch = 0;
    }
    else if (($('#hdnClosingval').val() == 81 || $('#hdnClosingval').val() == 83) && sessionStorage.getItem("hdnbidtypeid") == 9) {
        mininc = parseFloat(removeThousandSeperator($('#txtminimumdecreamentfrench').val()))
        startingprice = 0;
        incon = $('#drpdecreamentonfrench  option:selected').val();
        pricereducfeq = $('#txtminquantitiy').val();
        pricereductionamount = $('#txtmaxquantitiy').val();
        _Totalbiddurationfordutch = 0;
    }
    else if ($('#hdnClosingval').val() == 82 && sessionStorage.getItem("hdnbidtypeid") == 6) {
        mininc = 0;
        incon = '';
        startingprice = removeThousandSeperator($('#txtminimumdecreament').val())
        pricereducfeq = $('#txtpricefrequency').val()
        pricereductionamount = removeThousandSeperator($('#txtpriceincreamentamount').val())
        _Totalbiddurationfordutch = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtminimumdecreament").val())) / removeThousandSeperator($("#txtpriceincreamentamount").val())) * $("#txtpricefrequency").val()) + parseInt($("#txtpricefrequency").val());
    }
    //add
    if (sessionStorage.getItem("hdnbidtypeid") == 7) {

        Data = {
            "ItemBidDuration": parseInt(itemduration),
            "DestinationPort": $('#txtdestinationPort').val(),
            "Targetprice": parseFloat(removeThousandSeperator(targetprice)),
            "Quantity": parseFloat(removeThousandSeperator($("#txtquantitiy").val())),
            "UOM": $('#dropuom').val(),
            "LastInvoicePrice": parseFloat(removeThousandSeperator(lastinvoice)),
            "Remarks": $('#txtbiddescriptionP').val(),
            "CeilingPrice": parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())),
            "MaskVendor": $('#checkmaskvendor option:selected').val(),
            "MinimumDecreament": parseFloat(removeThousandSeperator($('#txtminimumdecreament').val())),
            "DecreamentOn": $('#drpdecreamenton option:selected').val(),
            "SelectedCurrency": $('#txtselectedCurrency').val(),
            "MaskL1Price": $('#checkL1Price').val(),
            "ShowStartPrice": $('#checkshowstartPrice').val(),
            "StartingPrice": parseFloat(startingprice),
            "PriceReductionFrequency": parseFloat(pricereducfeq),
            "PriceReductionAmount": parseFloat(pricereductionamount),
            "_Totalbiddurationfordutch": parseFloat(_Totalbiddurationfordutch),
            "BidID": parseInt(sessionStorage.getItem('hdnbid')),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": 0,
            "GST": 0,
            "BidForId": parseInt(BidForID),
            "BidStartDate": startDateTime,
            "BidDuration": parseInt(_Totalbiddurationfordutch)

        }

    }
    else if (sessionStorage.getItem("hdnbidtypeid") == 8) {

        Data = {
            "ItemBidDuration": parseInt(itemduration),
            "DestinationPort": $('#txtdestinationPort').val(),
            "Targetprice": parseFloat(removeThousandSeperator(targetprice)),
            "Quantity": parseFloat(removeThousandSeperator($("#txtquantitiy").val())),
            "UOM": $('#dropuom').val(),
            "LastInvoicePrice": parseFloat(removeThousandSeperator(lastinvoice)),
            "Remarks": $('#txtbiddescriptionP').val(),
            "CeilingPrice": parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())),
            "MaskVendor": $('#checkmaskvendor option:selected').val(),
            "MinimumDecreament": parseFloat(removeThousandSeperator($('#txtminimumdecreament').val())),
            "DecreamentOn": $('#drpdecreamenton option:selected').val(),
            "SelectedCurrency": $('#txtselectedCurrency').val(),
            "MaskL1Price": $('#checkL1Price').val(),
            "ShowStartPrice": $('#checkshowstartPrice').val(),
            "StartingPrice": parseFloat(startingprice),
            "PriceReductionFrequency": parseFloat(pricereducfeq),
            "PriceReductionAmount": parseFloat(pricereductionamount),
            "_Totalbiddurationfordutch": 0,
            "BidID": parseInt(sessionStorage.getItem('hdnbid')),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": 0,
            "GST": parseFloat($('#txtGST').val()),
            "BidForId": parseInt(BidForID),
            "BidStartDate": startDateTime,
            "BidDuration": parseInt(_Totalbiddurationfordutch)
        }

    }
    else if (sessionStorage.getItem("hdnbidtypeid") == 9) {

        Data = {
            "ItemBidDuration": 0,
            "DestinationPort": $('#txtItemnameFrench').val(),
            "Targetprice": parseFloat(removeThousandSeperator(targetpricefrench)),
            "Quantity": parseFloat(removeThousandSeperator($("#txtquantitiyfrench").val())),
            "UOM": $('#dropuomfrench').val(),
            "LastInvoicePrice": parseFloat(removeThousandSeperator(lastinvoicefrench)),
            "Remarks": '',
            "CeilingPrice": parseFloat(removeThousandSeperator($('#txtCeilingPricefrench').val())),
            "MaskVendor": $('#checkmaskvendorfrench option:selected').val(),
            "MinimumDecreament": mininc,
            "DecreamentOn": incon,
            "SelectedCurrency": '',
            "MaskL1Price": $('#checkL1Price').val(),
            "ShowStartPrice": $('#checkshowstartPrice').val(),
            "StartingPrice": parseFloat(startingprice),
            "PriceReductionFrequency": parseFloat(pricereducfeq),
            "PriceReductionAmount": parseFloat(pricereductionamount),
            "_Totalbiddurationfordutch": parseFloat(_Totalbiddurationfordutch),
            "BidID": parseInt(sessionStorage.getItem('hdnbid')),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": 0,
            "GST": 0,
            "BidForId": parseInt(BidForID),
            "BidStartDate": startDateTime,
            "BidDuration": parseInt(_Totalbiddurationfordutch)

        }
    }
    else {

        Data = {
            "ItemBidDuration": 0,
            "DestinationPort": $('#txtshortname').val(),
            "Targetprice": parseFloat(removeThousandSeperator(targetprice)),
            "Quantity": parseFloat(removeThousandSeperator($("#txtquantitiy").val())),
            "UOM": $('#dropuom').val(),
            "LastInvoicePrice": parseFloat(removeThousandSeperator(lastinvoice)),
            "Remarks": '',
            "CeilingPrice": parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())),
            "MaskVendor": $('#checkmaskvendor option:selected').val(),
            "MinimumDecreament": mininc,
            "DecreamentOn": incon,
            "SelectedCurrency": '',
            "MaskL1Price": $('#checkL1Price').val(),
            "ShowStartPrice": $('#checkshowstartPrice').val(),
            "StartingPrice": parseFloat(startingprice),
            "PriceReductionFrequency": parseFloat(pricereducfeq),
            "PriceReductionAmount": parseFloat(pricereductionamount),
            "_Totalbiddurationfordutch": parseFloat(_Totalbiddurationfordutch),
            "BidID": parseInt(sessionStorage.getItem('hdnbid')),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": 0,
            "GST": 0,
            "BidForId": parseInt(BidForID),
            "BidStartDate": startDateTime,
            "BidDuration": parseInt(_Totalbiddurationfordutch)

        }
    }

    console.log(JSON.stringify(Data))
    if (Data != '' || Data != null) {

        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageInsertNewBidParameterDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                if (isBidEventChanged == true) {
                    $("#btnuserConfirmation").show();
                }
                fetchallexportdetails();
                setTimeout(function () {
                    $("#editValuesModal").modal("hide");
                }, 5000)

                $("#msgSuccessItemEvent").find("span").html('Data Successfully saved.')
                $("#msgSuccessItemEvent").show();
                $("#msgSuccessItemEvent").fadeOut(5000);


                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    $("#msgErrorItemEvent").find("span").html('You have error in saving data.Please try again.')
                    $("#msgErrorItemEvent").show();
                    $("#msgErrorItemEvent").fadeOut(5000);
                }

                return false;
                jQuery.unblockUI();
            }

        });
    }
}

function editrowfields() {
    var targetprice = 0;
    var targetpricefrench = 0;
    var lastinvoice = 0; var lastinvoicefrench = 0; var itemduration = 0;
    var _Totalbiddurationfordutch = 0; var mininc = 0; var startingprice = 0; var incon = ''; var pricereducfeq = 0;
    var pricereductionamount = 0;

    if ($('#txttargetprice').val() != '') {
        targetprice = $('#txttargetprice').val();
    }
    if ($('#txttargetpricefrench').val() != '') {
        targetpricefrench = $('#txttargetpricefrench').val();
    }
    if ($('#txtlastinvoiceprice').val() != '') {
        lastinvoice = $('#txtlastinvoiceprice').val();
    }
    if ($('#txtlastinvoicepricefrench').val() != '') {
        lastinvoicefrench = $('#txtlastinvoicepricefrench').val();
    }
    if (($('#dropuom').val() == '' || $('#dropuom').val() == '0') && sessionStorage.getItem("hdnbidtypeid") != 9) {
        $("#msgErrorItemEvent").find("span").html('Please select UOM properly.')
        $("#msgErrorItemEvent").show();
        $("#msgErrorItemEvent").fadeOut(5000);
        jQuery.unblockUI();
        return false;
    }
    else if (($('#dropuomfrench').val() == '' || $('#dropuomfrench').val() == '0') && sessionStorage.getItem("hdnbidtypeid") == 9) {
        $("#msgErrorItemEvent").find("span").html('Please select UOM properly.')
        $("#msgErrorItemEvent").show();
        $("#msgErrorItemEvent").fadeOut(5000);
        jQuery.unblockUI();
        return false;
    }
    else if ($('#hdnClosingval').val() == 'A' && sessionStorage.getItem("hdnbidtypeid") == 7 && BidForID != 82) {
        itemduration = 0;
        _Totalbiddurationfordutch = 0;
    }
    else if ($('#hdnClosingval').val() == 'S' && sessionStorage.getItem("hdnbidtypeid") == 7 && BidForID != 82) {
        itemduration = $("#txtitembidduration").val();
        _Totalbiddurationfordutch = 0;
    }
    else if (BidForID == 82 && sessionStorage.getItem("hdnbidtypeid") == 7) {
        mininc = 0;
        incon = '';
        startingprice = removeThousandSeperator($('#txtminimumdecreament').val())
        pricereducfeq = $('#txtpricefrequency').val()
        pricereductionamount = removeThousandSeperator($('#txtpriceincreamentamount').val())
        _Totalbiddurationfordutch = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtminimumdecreament").val())) / removeThousandSeperator($("#txtpriceincreamentamount").val())) * $("#txtpricefrequency").val()) + parseInt($("#txtpricefrequency").val());
    }
    else if (($('#hdnClosingval').val() == 81 || $('#hdnClosingval').val() == 83) && sessionStorage.getItem("hdnbidtypeid") == 6) {
        mininc = parseFloat(removeThousandSeperator($('#txtminimumdecreament').val()))
        startingprice = 0;
        incon = $('#drpdecreamenton option:selected').val();
        pricereducfeq = 0;
        pricereductionamount = 0;
        _Totalbiddurationfordutch = 0;
    }
    else if (($('#hdnClosingval').val() == 81 || $('#hdnClosingval').val() == 83) && sessionStorage.getItem("hdnbidtypeid") == 9) {
        mininc = parseFloat(removeThousandSeperator($('#txtminimumdecreamentfrench').val()))
        startingprice = 0;
        incon = $('#drpdecreamentonfrench  option:selected').val();
        pricereducfeq = removeThousandSeperator($('#txtminquantitiy').val());
        pricereductionamount = removeThousandSeperator($('#txtmaxquantitiy').val());
        _Totalbiddurationfordutch = 0;
    }
    else if ($('#hdnClosingval').val() == 82 && sessionStorage.getItem("hdnbidtypeid") == 6) {
        mininc = 0;
        incon = '';
        startingprice = removeThousandSeperator($('#txtminimumdecreament').val())
        pricereducfeq = $('#txtpricefrequency').val()
        pricereductionamount = removeThousandSeperator($('#txtpriceincreamentamount').val())
        _Totalbiddurationfordutch = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtminimumdecreament").val())) / removeThousandSeperator($("#txtpriceincreamentamount").val())) * $("#txtpricefrequency").val()) + parseInt($("#txtpricefrequency").val());
    }
    if (sessionStorage.getItem("hdnbidtypeid") == 7) {

        Data = {
            "ItemBidDuration": parseInt(itemduration),
            "DestinationPort": $('#txtdestinationPort').val(),
            "Targetprice": parseFloat(removeThousandSeperator(targetprice)),
            "Quantity": parseFloat(removeThousandSeperator($("#txtquantitiy").val())),
            "UOM": $('#dropuom').val(),
            "LastInvoicePrice": parseFloat(removeThousandSeperator(lastinvoice)),
            "Remarks": $('#txtbiddescriptionP').val(),
            "CeilingPrice": parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())),
            "MaskVendor": $('#checkmaskvendor option:selected').val(),
            "MinimumDecreament": parseFloat(removeThousandSeperator($('#txtminimumdecreament').val())),
            "DecreamentOn": $('#drpdecreamenton option:selected').val(),
            "SelectedCurrency": $('#txtselectedCurrency').val(),
            "MaskL1Price": $('#checkL1Price').val(),
            "ShowStartPrice": $('#checkshowstartPrice').val(),
            "StartingPrice": parseFloat(startingprice),
            "PriceReductionFrequency": parseFloat(pricereducfeq),
            "PriceReductionAmount": parseFloat(pricereductionamount),
            "_Totalbiddurationfordutch": parseFloat(_Totalbiddurationfordutch),
            "BidID": parseInt(sessionStorage.getItem('hdnbid')),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": parseInt(hdnSeId),
            "GST": 0

        }

    }
    else if (sessionStorage.getItem("hdnbidtypeid") == 8) {

        Data = {
            "ItemBidDuration": parseInt(itemduration),
            "DestinationPort": $('#txtdestinationPort').val(),
            "Targetprice": parseFloat(removeThousandSeperator(targetprice)),
            "Quantity": parseFloat(removeThousandSeperator($("#txtquantitiy").val())),
            "UOM": $('#dropuom').val(),
            "LastInvoicePrice": parseFloat(removeThousandSeperator(lastinvoice)),
            "Remarks": $('#txtbiddescriptionP').val(),
            "CeilingPrice": parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())),
            "MaskVendor": $('#checkmaskvendor option:selected').val(),
            "MinimumDecreament": parseFloat(removeThousandSeperator($('#txtminimumdecreament').val())),
            "DecreamentOn": $('#drpdecreamenton option:selected').val(),
            "SelectedCurrency": $('#txtselectedCurrency').val(),
            "MaskL1Price": $('#checkL1Price').val(),
            "ShowStartPrice": $('#checkshowstartPrice').val(),
            "StartingPrice": parseFloat(startingprice),
            "PriceReductionFrequency": parseFloat(pricereducfeq),
            "PriceReductionAmount": parseFloat(pricereductionamount),
            "_Totalbiddurationfordutch": 0,
            "BidID": parseInt(sessionStorage.getItem('hdnbid')),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": parseInt(hdnSeId),
            "GST": parseFloat($('#txtGST').val())
        }

    }
    else if (sessionStorage.getItem("hdnbidtypeid") == 9) {

        Data = {
            "ItemBidDuration": 0,
            "DestinationPort": $('#txtItemnameFrench').val(),
            "Targetprice": parseFloat(removeThousandSeperator(targetpricefrench)),
            "Quantity": parseFloat(removeThousandSeperator($("#txtquantitiyfrench").val())),
            "UOM": $('#dropuomfrench').val(),
            "LastInvoicePrice": parseFloat(removeThousandSeperator(lastinvoicefrench)),
            "Remarks": '',
            "CeilingPrice": parseFloat(removeThousandSeperator($('#txtCeilingPricefrench').val())),
            "MaskVendor": $('#checkmaskvendorfrench option:selected').val(),
            "MinimumDecreament": mininc,
            "DecreamentOn": incon,
            "SelectedCurrency": '',
            "MaskL1Price": $('#checkL1Price').val(),
            "ShowStartPrice": $('#checkshowstartPrice').val(),
            "StartingPrice": parseFloat(startingprice),
            "PriceReductionFrequency": parseFloat(pricereducfeq),
            "PriceReductionAmount": parseFloat(pricereductionamount),
            "_Totalbiddurationfordutch": parseFloat(_Totalbiddurationfordutch),
            "BidID": parseInt(sessionStorage.getItem('hdnbid')),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": parseInt(hdnSeId),
            "GST": 0

        }
    }
    else {

        Data = {
            "ItemBidDuration": 0,
            "DestinationPort": $('#txtshortname').val(),
            "Targetprice": parseFloat(removeThousandSeperator(targetprice)),
            "Quantity": parseFloat(removeThousandSeperator($("#txtquantitiy").val())),
            "UOM": $('#dropuom').val(),
            "LastInvoicePrice": parseFloat(removeThousandSeperator(lastinvoice)),
            "Remarks": '',
            "CeilingPrice": parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())),
            "MaskVendor": $('#checkmaskvendor option:selected').val(),
            "MinimumDecreament": mininc,
            "DecreamentOn": incon,
            "SelectedCurrency": '',
            "MaskL1Price": $('#checkL1Price').val(),
            "ShowStartPrice": $('#checkshowstartPrice').val(),
            "StartingPrice": parseFloat(startingprice),
            "PriceReductionFrequency": parseFloat(pricereducfeq),
            "PriceReductionAmount": parseFloat(pricereductionamount),
            "_Totalbiddurationfordutch": parseFloat(_Totalbiddurationfordutch),
            "BidID": parseInt(sessionStorage.getItem('hdnbid')),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid')),
            "BidClosingType": $('#hdnClosingval').val(),
            "SeId": parseInt(hdnSeId),
            "GST": 0

        }
    }
    if (Data != '' || Data != null) {

        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageUpdateBidParameterDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {

                if (isBidEventChanged == true) {
                    $("#btnuserConfirmation").show();
                }
                fetchallexportdetails();
                setTimeout(function () {
                    $("#editValuesModal").modal("hide")
                }, 5000)

                $("#msgSuccessItemEvent").find("span").html('Data Successfully saved.')
                $("#msgSuccessItemEvent").show();
                $("#msgSuccessItemEvent").fadeOut(5000);


                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    $("#msgErrorItemEvent").find("span").html('You have error in saving data.Please try again.')
                    $("#msgErrorItemEvent").show();
                    $("#msgErrorItemEvent").fadeOut(5000);
                }
                return false;
                jQuery.unblockUI();
            }

        });
    }
}
function showhideItemBidDuration() {
    var bidCloseType = $('#hdnClosingval').val();

    if (bidCloseType == 'A') {
        jQuery('#divItemBiduration').css('visibility', 'hidden');
        $('#txtitembidduration').prop('disabled', true)
    }
    else {
        $('#txtitembidduration').prop('disabled', false)
        $('#spanbidduration').hide()
        jQuery('#divItemBiduration').css('visibility', 'visible');
    }
}
var allUOM = '';
function FetchUOM(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + CustomerID,//FetchUOM
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#txtUOM").empty();
            jQuery("#txtUOMFrench").empty();
            if (data.length > 0) {
                allUOM = data;
            }
            else {
                allUOM = '';
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }

    });

}
jQuery("#txtUOM").keyup(function () {
    $('#dropuom').val('')

});
jQuery("#txtUOM").typeahead({
    source: function (query, process) {
        var data = allUOM;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.uom] = username;
            usernames.push(username.uom);
        });
        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].uom != "") {
            $('#dropuom').val(map[item].uom)

        }
        else {
            gritternotification('Please select UOM  properly!!!');
        }

        return item;
    }

});
jQuery("#txtUOMfrench").keyup(function () {
    $('#dropuomfrench').val('')

});
jQuery("#txtUOMfrench").typeahead({
    source: function (query, process) {
        var data = allUOM;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.uom] = username;
            usernames.push(username.uom);
        });
        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].uom != "") {
            $('#dropuomfrench').val(map[item].uom)

        }
        else {
            gritternotification('Please select UOM  properly!!!');
        }

        return item;
    }

});
function FetchCurrency(CurrencyID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchCurrency/?CurrencyID=" + CurrencyID + "&excludeStatus=N",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#dropCurrency").empty();

            jQuery("#dropCurrency").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#dropCurrency").append(jQuery("<option></option>").val(data[i].currencyId).html(data[i].currencyNm));

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;
        }

    });

}

function displayUOM() {
    jQuery('#lblUOM').css('text-align', 'left');
    jQuery('#lblUOM').text('');
    if (jQuery('#dropuom').val() != '' && jQuery('#dropCurrency').val() != '') {

        var uomcaption = jQuery('#dropCurrency option:selected').text() + '/' + jQuery('#dropuom').val()
        jQuery('#lblUOM').text(uomcaption)
    }
    else {
        jQuery('#lblUOM').text('')
    }
}

function closeOrSubmitAfterEditEvents() {
    bootbox.dialog({
        message: "You have made changes to the event, Do you want to send notifications to participants.",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    confirmEditEventAction('submit')
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {
                    confirmEditEventAction('close')
                }
            }
        }
    });

}

function confirmEditEventAction(eventType) {

    var Data = {
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "ParamType": eventType,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
    if (Data != '' || Data != null) {
        //alert(eventType)
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "ResetInviteVendor/SendEmailConfirmationEditBidDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {
                bootbox.alert("An email notification has been sent to all participants invited for the bid.", function () {
                    window.location = sessionStorage.getItem('HomePage');
                    return false;
                });


                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', '');
                }
                jQuery.unblockUI();
                return false;
            }
        });
    }


}
function editShowL1Price(seId, rowid) {

    $("#editshowL1PriceModal").modal('show');
    $("#hdnshowL1Price").val(seId);
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        $('#lblshowHLPrice').text("Show L1 Price")
        if ($('#hdnClosingval').val() == "S") {
            var flag = $("#" + rowid).find("td:eq(16)").text().trim()
        }
        else {
            var flag = $("#" + rowid).find("td:eq(14)").text().trim()
        }

    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 8) {
        $('#lblshowHLPrice').text("Show L1 Price")
        if ($('#hdnClosingval').val() == "S") {
            var flag = $("#" + rowid).find("td:eq(17)").text().trim()
        }
        else {
            var flag = $("#" + rowid).find("td:eq(15)").text().trim()
        }

    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 9) {
        $('#lblshowHLPrice').text("Show H1 Price")
        var flag = $("#" + rowid).find("td:eq(16)").text().trim()

    }
    else {
        $('#lblshowHLPrice').text("Show H1 Price")
        if ($('#hdnauctiontype').val() == 81 || $('#hdnauctiontype').val() == 83) {
            var flag = $("#" + rowid).find("td:eq(15)").text().trim()
        }
        else {
            var flag = $("#" + rowid).find("td:eq(18)").text().trim()
        }
    }
    $('#maskL1Pricetab_0').val(flag)

}
function editShowStartPrice(seId, rowid) {

    $("#editshowStartPriceModal").modal('show');
    $("#hdnshowStartPrice").val(seId);
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        if ($('#hdnClosingval').val() == "S") {
            var flag = $("#" + rowid).find("td:eq(17)").text().trim()
        }
        else {
            var flag = $("#" + rowid).find("td:eq(15)").text().trim()
        }

    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 8) {
        if ($('#hdnClosingval').val() == "S") {
            var flag = $("#" + rowid).find("td:eq(18)").text().trim()
        }
        else {
            var flag = $("#" + rowid).find("td:eq(16)").text().trim()
        }

    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 9) {
        if ($('#hdnauctiontype').val() == 81 || $('#hdnauctiontype').val() == 83) {
            var flag = $("#" + rowid).find("td:eq(17)").text().trim()
        }

    }
    else {
        if ($('#hdnauctiontype').val() == 81 || $('#hdnauctiontype').val() == 83) {
            var flag = $("#" + rowid).find("td:eq(16)").text().trim()
        }

    }
    $('#maskStartPricetab_0').val(flag)

}
function editbidstartprice(seId, rowid) {
    $("#hddnbidstartprice").val(seId);
    $("#txtbidstartpricetab_0").val($.trim($("#" + rowid).find("td:eq(7)").text()))
    $("#editbidstartprice").modal('show');
}
function editbidstartpriceFF(frid, rowid) {
    $("#hddnbidstartprice").val(frid);
    $("#txtbidstartpricetab_0").val($.trim($("#" + rowid).find("td:eq(9)").text()))
    $("#editbidstartprice").modal('show');
}
function editbidstartpriceFA(psid, rowid) {
    $("#hddnbidstartprice").val(psid);
    $("#txtbidstartpricetab_0").val($.trim($("#" + rowid).find("td:eq(6)").text()))
    $("#editbidstartprice").modal('show');
}
function editbidstartpriceCA(caid, rowid) {

    $("#hddnbidstartprice").val(caid);
    $("#txtbidstartpricetab_0").val($.trim($("#" + rowid).find("td:eq(8)").text()))
    $("#editbidstartprice").modal('show');
}

function editMinDecreament(seId, rowid) {
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        $("#hddnSeIdForMinDecreament").val(seId);
        $('#drpdecreamentontab_0').val($("#" + rowid).find("td:eq(11)").text())
        $("#txtminimumdecreamenttab_0").val($.trim($("#" + rowid).find("td:eq(9)").text()))
        $("#editMinDecreamentModal").modal('show');
        $('#drpdecreamentontab_0').show()
    }
    else {
        $("#hddnSeIdForMinDecreament").val(seId);
        $('#drpdecreamentontab_0').val($("#" + rowid).find("td:eq(12)").text())
        $("#txtminimumdecreamenttab_0").val($.trim($("#" + rowid).find("td:eq(10)").text()))
        $("#editMinDecreamentModal").modal('show');
        $('#drpdecreamentontab_0').hide()
    }
}

var error = $('#msgErrorEditEvent');
function updMinDecreament() {

    if ((parseInt($('#txtminimumdecreamenttab_0').val()) > parseInt(20) && $("#drpdecreamentontab_0 option:selected").val() == "P")) {

        error.find("span").html('Minimum decrement should be less than 20%.');
        error.show();
        Metronic.scrollTo(error, -200);
        error.fadeOut(3000);
        return false;

    }
    var URL = '';
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        var Data = {
            "QueryString": removeThousandSeperator($("#txtminimumdecreamenttab_0").val()),
            "QueryStringDT": 'NA',
            "valType": "BMD",
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hddnSeIdForMinDecreament").val()),
            "DecreamentOn": $("#drpdecreamentontab_0 option:selected").val(),
            "UserID": sessionStorage.getItem('UserID')

        }
    }
    else {
        var Data = {
            "QueryString": removeThousandSeperator($("#txtminimumdecreamenttab_0").val()),
            "QueryStringDT": 'NA',
            "valType": "BMD",
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "CAID": parseInt($("#hddnSeIdForMinDecreament").val()),
            "DecreamentOn": $("#drpdecreamentontab_0 option:selected").val(),
            "UserID": sessionStorage.getItem('UserID')

        }
    }

    if (Data != '' || Data != null) {

        if (sessionStorage.getItem('hdnbidtypeid') == 7) {
            connection.invoke("UpdateBidDetailsfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());

            });
        }
        else {

            connection.invoke("UpdateBidDetailsCoalfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());

            });
        }
        connection.on("refreshBidDetailsManage", function (data) {
            var JsonMsz = JSON.parse(data[0]);
            if (JsonMsz.UserID == sessionStorage.getItem('UserID')) {
                if (isBidEventChanged == true) {
                    $("#btnuserConfirmation").show();
                }
                fetchallexportdetails();
                $("#editMinDecreamentModal").modal("hide")
                jQuery.unblockUI();
            }
        });
    }
}

function editincreament(psid, rowid) {

    $("#hddnPSForMinIncreament").val(psid);
    $('#drpincreamentontab_0').val($("#" + rowid).find("td:eq(11)").text())
    $("#txtminimumincreamenttab_0").val($.trim($("#" + rowid).find("td:eq(8)").text()))
    $("#editMinincreamentModal").modal('show');

}
function editincreamentFF(frid, rowid) {

    $("#hddnPSForMinIncreament").val(frid);
    $('#drpincreamentontab_0').val($("#" + rowid).find("td:eq(13)").text())
    $("#txtminimumincreamenttab_0").val($.trim($("#" + rowid).find("td:eq(11)").text()))
    $("#editMinincreamentModal").modal('show');

}
var error1 = $('#msgErrorEditEventFA')
function updMinIncreament() {
    if (sessionStorage.getItem('hdnbidtypeid') == 6) {
        valtype = 'BMIPE'
    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 9) {
        valtype = 'INCFR'
    }
    if ((parseInt($('#txtminimumincreamenttab_0').val()) > parseInt(20) && $("#drpincreamentontab_0 option:selected").val() == "P")) {

        error1.find("span").html('Minimum increment should be less than 20%.');
        error1.show();
        Metronic.scrollTo(error1, -200);
        error1.fadeOut(3000);
        return false;

    }
    var Data = {
        "QueryString": removeThousandSeperator($("#txtminimumincreamenttab_0").val()),
        "QueryStringDT": 'NA',
        "valType": valtype,
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "BidClosingType": 'NA',
        "SeId": parseInt($("#hddnPSForMinIncreament").val()),
        "DecreamentOn": $("#drpincreamentontab_0 option:selected").val(),
        "UserID": sessionStorage.getItem('UserID'),
        "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))

    }

    if (Data != '' || Data != null) {

        connection.invoke("UpdateBidDetailsfromManage", JSON.stringify(Data)).catch(function (err) {
            return console.error(err.toString());

        });
        connection.on("refreshBidDetailsManage", function (data) {
            var JsonMsz = JSON.parse(data[0]);
            if (JsonMsz.UserID == sessionStorage.getItem('UserID')) {
                if (isBidEventChanged == true) {
                    $("#btnuserConfirmation").show();
                }
                fetchallexportdetails();
                $("#editMinincreamentModal").modal("hide")
                jQuery.unblockUI();
            }
        });
    }
}

var error2 = $('#msgErrorL1');
function UpdShowL1Price() {
    var URL = '';
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        var valtype = "RAL1";
        var Data = {
            "QueryString": $("#maskL1Pricetab_0").val(),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hdnshowL1Price").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 6) {
        var valtype = "FAL1";
        var Data = {
            "QueryString": $("#maskL1Pricetab_0").val(),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hdnshowL1Price").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 9) {
        var valtype = "FFH1";
        var Data = {
            "QueryString": $("#maskL1Pricetab_0").val(),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hdnshowL1Price").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
    }
    else {
        var valtype = "CAL1";
        var Data = {
            "QueryString": $("#maskL1Pricetab_0").val(),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "CAID": parseInt($("#hdnshowL1Price").val()),

            "UserID": sessionStorage.getItem('UserID'),
            "DecreamentOn": ''

        }
    }
    if (Data != '' || Data != null) {

        if (sessionStorage.getItem('hdnbidtypeid') != 8) {
            connection.invoke("UpdateBidDetailsfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());
            });
        }
        else {

            connection.invoke("UpdateBidDetailsCoalfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());
            });
        }
        connection.on("refreshBidDetailsManage", function (data) {

            var JsonMsz = JSON.parse(data[0]);
            if (JsonMsz.UserID == sessionStorage.getItem('UserID')) {
                if (isBidEventChanged == true) {
                    $("#btnuserConfirmation").show();
                }
                fetchallexportdetails();
                $("#editshowL1PriceModal").modal("hide")
                jQuery.unblockUI();
            }
        });
    }
}

var errorStart = $('#msgErrorStart');
function UpdShowStartPrice() {

    var URL = '';
    if (sessionStorage.getItem('hdnbidtypeid') == 7) {
        var valtype = "RAStartP";
        var Data = {
            "QueryString": $("#maskStartPricetab_0").val(),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hdnshowStartPrice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))

        }
    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 6) {
        var valtype = "FAStartP";
        var Data = {
            "QueryString": $("#maskStartPricetab_0").val(),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hdnshowStartPrice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 9) {
        var valtype = "FFStartP";
        var Data = {
            "QueryString": $("#maskStartPricetab_0").val(),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hdnshowStartPrice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
    }
    else {
        var valtype = "CAStartP";
        var Data = {
            "QueryString": $("#maskStartPricetab_0").val(),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "CAID": parseInt($("#hdnshowStartPrice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID')

        }
    }

    if (Data != '' || Data != null) {
        if (sessionStorage.getItem('hdnbidtypeid') != 8) {
            connection.invoke("UpdateBidDetailsfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());
            });
        }
        else {
            connection.invoke("UpdateBidDetailsCoalfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());
            });
        }
        connection.on("refreshBidDetailsManage", function (data) {
            var JsonMsz = JSON.parse(data[0]);
            if (JsonMsz.UserID == sessionStorage.getItem('UserID')) {
                if (isBidEventChanged == true) {
                    $("#btnuserConfirmation").show();
                }
                fetchallexportdetails();
                $("#editshowStartPriceModal").modal("hide")
                jQuery.unblockUI();
            }
        });
    }
}

var errorStart = $('#msgErrorStart');
var errorBSP = $('#msgErrorEditEventBP');
function updBidStartPrice() {
    var URL = '';
    if (sessionStorage.getItem('hdnbidtypeid') == 7 && (BidForID == 81 || BidForID == 83)) {
        var valtype = "BSPRA";
        var Data = {
            "QueryString": removeThousandSeperator($("#txtbidstartpricetab_0").val()),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hddnbidstartprice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 7 && BidForID == 82) {
        var valtype = "BSPRAD";
        var Data = {
            "QueryString": removeThousandSeperator($("#txtbidstartpricetab_0").val()),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hddnbidstartprice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 6) {
        var valtype = "BSPFA";
        var Data = {
            "QueryString": removeThousandSeperator($("#txtbidstartpricetab_0").val()),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hddnbidstartprice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
    }
    else if (sessionStorage.getItem('hdnbidtypeid') == 9) {
        var valtype = "BSPFF";
        var Data = {
            "QueryString": removeThousandSeperator($("#txtbidstartpricetab_0").val()),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "SeId": parseInt($("#hddnbidstartprice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
        }
        //URL = sessionStorage.getItem("APIPath") + "ResetInviteVendor/ManageUpdateBidDetails/";
    }
    else {
        var valtype = "BSPCA";
        var Data = {
            "QueryString": removeThousandSeperator($("#txtbidstartpricetab_0").val()),
            "QueryStringDT": 'NA',
            "valType": valtype,
            "BidId": parseInt(sessionStorage.getItem('hdnbid')),
            "BidClosingType": 'NA',
            "CAID": parseInt($("#hddnbidstartprice").val()),
            "DecreamentOn": '',
            "UserID": sessionStorage.getItem('UserID')
        }
    }
    if (Data != '' || Data != null) {

        if (sessionStorage.getItem('hdnbidtypeid') != 8) {
            connection.invoke("UpdateBidDetailsfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());

            });
        }
        else {
            connection.invoke("UpdateBidDetailsCoalfromManage", JSON.stringify(Data)).catch(function (err) {
                return console.error(err.toString());

            });
        }

        connection.on("refreshBidDetailsManage", function (data) {
            var JsonMsz = JSON.parse(data[0]);
            if (JsonMsz.UserID == sessionStorage.getItem('UserID')) {
                if (isBidEventChanged == true) {
                    $("#btnuserConfirmation").show();
                }
                fetchallexportdetails();
                $("#editbidstartprice").modal("hide")
                jQuery.unblockUI();
            }
        });

    }
}

var errorsurrogate = $('#errorsurro');
var succsurrogate = $('#successsurro');
function saveBidSurrogate() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#bidSurrogateToName').val() == '') {
        errorsurrogate.show();
        $('#spnerrorsurr').html('Please Fill name.');
        App.scrollTo(errorsurrogate, -200);
        errorsurrogate.fadeOut(4000);
        jQuery.unblockUI();
        return false;

    }
    if ($('#bidSurrogateToEmail').val() == '' || validateEmail($('#bidSurrogateToEmail').val()) == false) {
        $('#spnerrorsurr').html('Please Fill Valid Email.');
        errorsurrogate.show();
        App.scrollTo(errorsurrogate, -200);
        errorsurrogate.fadeOut(4000);
        jQuery.unblockUI();
        return false;

    }
    if ($('#bidSurrogateReason').val() == '') {
        $('#spnerrorsurr').html('Please Fill Surrogate Reason.');
        errorsurrogate.show();
        App.scrollTo(errorsurrogate, -200);
        errorsurrogate.fadeOut(4000);
        jQuery.unblockUI();
        return false;

    }
    if (sessionStorage.getItem("hdnselectedvendor") == '' || sessionStorage.getItem("hdnselectedvendor") == "0") {
        $('#spnerrorsurr').html('Please Select Vendor');
        errorsurrogate.show();
        App.scrollTo(errorsurrogate, -200);
        errorsurrogate.fadeOut(4000);
        jQuery.unblockUI();
        return false;

    }
    if (sessionStorage.getItem("hdnbid") == '' || sessionStorage.getItem("hdnbid") == "0") {
        $('#spnerrorsurr').html('Please Select Bid');
        errorsurrogate.show();
        App.scrollTo(errorsurrogate, -200);
        errorsurrogate.fadeOut(4000);
        jQuery.unblockUI();
        return false;

    }

    var Data = {
        "Name": $("#bidSurrogateToName").val(),
        "BidId": parseInt(sessionStorage.getItem('hdnbid')),
        "EmailId": $("#bidSurrogateToEmail").val(),
        "Reason": $("#bidSurrogateReason").val(),
        "vendorEmailId": sessionStorage.getItem("hdnselectedEmail"),
        "vendorID": parseInt(sessionStorage.getItem("hdnselectedvendor")),
        "EncryptedLink": "BidID=" + sessionStorage.getItem('hdnbid'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
    }
    if (Data != '' || Data != null) {

        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "RegisterParticipants/BidSurrogateSave",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (data, status, jqXHR) {
                succsurrogate.show();
                $('#spnsuccsurr').html("Data Successfully saved");
                succsurrogate.fadeOut(6000);
                App.scrollTo(succsurrogate, -200);
                clearSurrogateForm();
                jQuery.unblockUI();
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', '');
                }
                jQuery.unblockUI();
                return false;
            }
        });
    }
}

function clearSurrogateForm() {
    $('#bidSurrogateToName').val('')
    $('#bidSurrogateToEmail').val('')
    $('#bidSurrogateReason').val('')
    sessionStorage.setItem('hdnselectedvendor', '0');
    sessionStorage.setItem('hdnselectedEmail', '');
    jQuery("#txtvendorSurrogateBid").val('')
    $(".surrogateFormElements").hide();
}
function fetchItemsforPreBidPrices(BidID, BidTypeID, BidForID) {
    var flagEditbtn = "N";

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidPrePricesDetails/?BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&BidForID=0", //+ BidForID,
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            var pullRFQ = 0;
            $('#tblprebidvendors').empty();
            $('#tblBiddetailsPreprice').empty();
            $('#tblprebidvendors').append("<thead><tr><th style='width:10%'>Vendor</th><th style='width:20%'>Item/Services</th><th>Participation</th><th style='width:10%'>Pre-Bid Price</th></tr>")
            $('#tblBiddetailsPreprice').append("<thead><tr><th style='width:5%'>BidID</th><th style='width:5%'>VendorID</th><th style='width:10%'>Vendor</th><th style='width:5%'>ItemID</th><th style='width:20%'>ItemName</th><th style='width:10%'>Price</th></tr>")
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].price != 0) {
                        flagEditbtn = "Y";
                    }
                    pullRFQ = data[0].pullRFQID;


                    $('#tblprebidvendors').append("<tr><td class=hide id=vid" + i + " >" + data[i].vendorID + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class=hide id=advfactor" + i + ">" + data[i].advFactor + "</td><td id=vname" + i + " >" + data[i].vendorName + "</td><td id=shortname" + i + ">" + data[i].destinationPort + "</td><td style='width:15%'><table><tr><td><div class=\"checker\" id=\"uniform-chkbidTypesTerms\"><span  class='checked' id=\"spancheckedTerms" + i + "\" ><input type=\"checkbox\" Onclick=\"CheckTerms(this,\'" + i + "'\)\"; id=\"chkTerms" + i + "\"  style=\"cursor:pointer\" name=\"chkvenderTerms\" checked /></span></td><td><input name=comm type=text class='hide form-control maxlength' maxlength=25  autocomplete=off id=remarks" + i + "  ></input></td></table></td><td><input type=tel onkeyup='fncleanmsz(" + i + ")' number='true' class='form-control  clsisdisabled thousandseparated' id='txtpreprice" + i + "' name='txtpreprice" + i + "' value=" + (data[i].price == 0 ? '' : (data[i].price)) + " ></input><span id=spanmsz" + i + " style=color:#a94442></span></td></tr>")//thousands_separators
                    $('#tblBiddetailsPreprice').append("<tr><td id=bidexcel" + i + ">" + BidID + "</td><td id=videxcel" + i + " >" + data[i].vendorID + "</td><td id=vnameexcel" + i + " >" + data[i].vendorName + "</td><td id=seidexcel" + i + " >" + data[i].seid + "</td><td id=shortnameexcel" + i + ">" + data[i].destinationPort + "</td><td></td></tr>")
                    if (data[i].remarks != "") {
                        $('#spancheckedTerms' + i).removeClass("checked")
                        $("#chkTerms" + i).removeAttr('checked')
                        $('#remarks' + i).removeClass('hide')
                        $('#remarks' + i).val('')
                        $('#txtpreprice' + i).attr('disabled', 'disabled')
                        $('#remarks' + i).val(data[i].remarks)
                    }
                    for (var j = i + 1; j < data.length; j++) {
                        if (data[i].vendorID == data[j].vendorID) {
                            if (data[j].price != 0) {
                                flagEditbtn = "Y";
                            }
                            $('#tblprebidvendors').append("<tr><td class=hide id=vid" + j + " >" + data[j].vendorID + "</td><td class=hide id=seid" + j + ">" + data[j].seid + "</td><td class=hide id=advfactor" + j + " >" + data[j].advFactor + "</td><td id=vname" + j + "></td><td id=shortname" + j + " >" + data[j].destinationPort + "</td><td style='width:15%'><table><tr><td><div class=\"checker\" id=\"uniform-chkbidTypesTerms\"><span  class='checked' id=\"spancheckedTerms" + j + "\" ><input type=\"checkbox\" Onclick=\"CheckTerms(this,\'" + j + "'\)\"; id=\"chkTerms" + j + "\"  style=\"cursor:pointer\" name=\"chkvenderTerms\" checked /></span></td><td><input name=comm type=text class='hide form-control maxlength' maxlength=25  autocomplete=off id=remarks" + j + " ></input></td></table></td><td><input type=tel number='true' onkeyup='fncleanmsz(" + j + ")' class='form-control  clsisdisabled thousandseparated' id='txtpreprice" + j + "' name='txtpreprice" + j + "' value=" + (data[j].price == 0 ? '' : (data[j].price)) + " ></input><span id=spanmsz" + j + " style=color:#a94442></span></td></tr>")
                            $('#tblBiddetailsPreprice').append("<tr><td id=bidexcel" + j + ">" + BidID + "</td><td id=videxcel" + j + "  >" + data[j].vendorID + "</td><td id=vnameexcel" + j + "></td><td id=seidexcel" + j + ">" + data[j].seid + "</td><td id=shortnameexcel" + j + " >" + data[j].destinationPort + "</td><td></td></tr>")
                            i = j;
                            if (data[j].remarks != "") {
                                $('#spancheckedTerms' + j).removeClass("checked")
                                $("#chkTerms" + j).removeAttr('checked')
                                $('#remarks' + j).removeClass('hide')
                                $('#remarks' + j).val('')
                                $('#txtpreprice' + j).attr('disabled', 'disabled')
                                $('#remarks' + j).val(data[j].remarks)
                            }

                        }


                    }


                }
                thouandseparator();
                $('.maxlength').maxlength({
                    limitReachedClass: "label label-danger",
                    alwaysShow: true
                });

                if (flagEditbtn == "Y") {
                    $('#btnprebid').text("Edit")
                    $('#btnprebid').removeClass("green")
                    $('#btnprebid').addClass("yellow")
                }
                else {
                    $('#btnprebid').text("Submit")
                    $('#btnprebid').addClass("green")
                    $('#btnprebid').removeClass("yellow")
                }
                if (pullRFQ == 0) {
                    clsisdisabled = ''
                    $('#btnprebid').removeClass('hide');
                    $('#btnprebidexcel').removeClass('hide');
                }
                else {
                    errorprebid.show();
                    $('#errpre').html('Bid is pulled from RFQ.So can not do Pre Pricing.');
                    clsisdisabled = 'disabled'
                    $('#btnprebid').addClass('hide');
                    $('#btnprebidexcel').addClass('hide');
                    errorprebid.fadeOut(7000);
                }

                if (isRunningBid == "Y" || BidForID == 82) {
                    $('.clsisdisabled').attr('disabled', true)
                    $('#btnprebid').addClass('hide');
                    $('#btnprebidexcel').addClass('hide');
                    $('#btn-add-new-item').hide();
                }

            }

        }
    });
}
function CheckTerms(event, ID) {

    if ($('#spancheckedTerms' + ID).attr('class') == 'checked') {
        $('#spancheckedTerms' + ID).removeClass("checked")
        $("#chkTerms" + ID).removeAttr('checked')
        $('#remarks' + ID).removeClass('hide')
        $('#txtpreprice' + ID).attr('disabled', 'disabled')
        $('#txtpreprice' + ID).val('')

    }
    else {
        $('#spancheckedTerms' + ID).addClass("checked")
        $("#chkTerms" + ID).attr('checked', 'checked')
        $('#remarks' + ID).addClass('hide')
        $('#txtpreprice' + ID).removeAttr('disabled')
    }

}
function fncleanmsz(icount) {
    $('#spanmsz' + icount).text('');
}
function submitprebidprice() {
    var seid = 0; var flag = true;
    var price = 0; var y = 0;
    var rowcount = $("#tblprebidvendors >tbody>tr").length;

    for (x = 0; x < rowcount; x++) {
        seid = $('#seid' + x).text();
        price = $.trim($('#txtpreprice' + x).val())

        for (y = x + 1; y < rowcount; y++) {
            if ($('#seid' + y).text() == seid) {
                if (price == $.trim($('#txtpreprice' + y).val()) && $('#txtpreprice' + y).val() != '' && y != 0) {
                    $('#spanmsz' + x).text('already quoted by someone.')
                    flag = false;

                }
            }

        }

    }

    // alert(flag)
    if (flag == true) {
        if (sessionStorage.getItem("hdnbidtypeid") == 7) {
            fnsubmitRAPrePrices()
        }
        else if (sessionStorage.getItem("hdnbidtypeid") == 8) {
            fnsubmitCAPrePrices()
        }

        else {
            fnsubmitFAPrePrices()
        }
    }

}
$(document).on('keyup', '.form-control', function () {
    if ($.trim($('.form-control').val()).length) {
        $(this).css("border", "1px solid #e5e5e5")
    }
});
var HeaderQuery = "";
var BlockedItemsquery = "";
var BlockQuery = "";
var flagBlock = "T";
function fnsubmitRAPrePrices() {
    var validateSubmit = false;
    var singleQuery = "";
    var quote = 0;
    HeaderQuery = '';
    BlockedItemsquery = '';
    BlockQuery = "";
    var i = 0
    flagBlock = "T";
    $("#tblprebidvendors tr:gt(0)").each(function () {

        if ($("#chkTerms" + i).prop('checked') == false && $('#remarks' + i).val() == "") {
            $('#remarks' + i).removeClass('has-success')
            $('#remarks' + i).css("border", "1px solid red")
            flagBlock = 'F';

        }
        i++;
    })
    if (flagBlock == "T") {
        i = 0;
        $("#tblprebidvendors tr:gt(0)").each(function () {
            var this_row = $(this);
            quote = $.trim($('#txtpreprice' + i).val())
            if ($("#chkTerms" + i).prop('checked') == false && $('#remarks' + i).val() != "" && $('#vid' + i).text() != "" && $('#seid' + i).text() != "") {
                BlockQuery = BlockQuery + 'exec PE.BidItemsVendorBlocked ';
                BlockQuery = BlockQuery + "'" + $.trim($('#vid' + i).text()) + "'," + sessionStorage.getItem('hdnbid') + "," + $.trim($.trim($('#seid' + i).text())) + ",'" + $.trim($('#remarks' + i).val()).replace(/'/g, "''") + "','" + sessionStorage.getItem('UserID') + "'  ;"
            }
            if (quote != "" && quote != "0") {
                singleQuery = "";

                singleQuery = $.trim($('#seid' + i).text()) + '~' + removeThousandSeperator(quote);
                HeaderQuery = HeaderQuery + 'exec PE.BidParticipationInsUpdSeaExport ';
                HeaderQuery = HeaderQuery + "'" + $.trim($('#vid' + i).text()) + "'," + sessionStorage.getItem('hdnbid') + ",'" + singleQuery + "','" + $.trim($('#vid' + i).text()) + "'," + removeThousandSeperator(quote) + "," + $.trim($('#seid' + i).text()) + "," + $.trim($('#advfactor' + i).text()) + ",'N','Y' ; "
            }
            i++;
        })
        if (HeaderQuery != "" && HeaderQuery != null) {
            validateSubmit = true;
        }
        if (BlockQuery != "" && BlockQuery != null) {
            validateSubmit = true;
        }
        if (validateSubmit) {
            var Data = {
                "BlockedItemQuery": BlockQuery,
                "HeaderDetails": HeaderQuery,
                "BidID": parseInt(sessionStorage.getItem('hdnbid')),
                "UserID": sessionStorage.getItem('UserID'),
                "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
            };
            jQuery.ajax({

                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "VendorParticipation/insPreBidPricing/",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                crossDomain: true,
                async: false,
                data: JSON.stringify(Data),
                dataType: "json",
                success: function (data) {
                    successprebid.show();
                    $('#succpreprice').html('Pre-Bid RA Prices updated successfully..');
                    successprebid.fadeOut(5000);
                    fetchItemsforPreBidPrices(sessionStorage.getItem('hdnbid'), sessionStorage.getItem("hdnbidtypeid"), sessionStorage.getItem('hdbbidForID'));
                    jQuery.unblockUI();
                },
                error: function (xhr, status, error) {
                    var err = xhr.responseText// eval("(" + xhr.responseText + ")");
                    if (xhr.status == 401) {
                        error401Messagebox(err.Message);
                    }
                    else {
                        fnErrorMessageText('spandanger', '');
                    }
                    jQuery.unblockUI();
                    return false;
                }
            });
        }
        else {
            errorprebid.show();
            $('#errpre').html('Please fill Price.');
            errorprebid.fadeOut(7000);
        }
    }
}
function fnsubmitCAPrePrices() {
    var validateSubmit = false;
    BlockQuery = "";
    var i = 0

    var quote = 0;
    HeaderQuery = '';
    flagBlock = "T";
    $("#tblprebidvendors tr:gt(0)").each(function () {

        if ($("#chkTerms" + i).prop('checked') == false && $('#remarks' + i).val() == "") {
            $('#remarks' + i).removeClass('has-success')
            $('#remarks' + i).css("border", "1px solid red")
            flagBlock = 'F';

        }
        i++;
    })

    if (flagBlock == "T") {
        i = 0;
        $("#tblprebidvendors tr:gt(0)").each(function () {
            var this_row = $(this);
            quote = $.trim($('#txtpreprice' + i).val())
            if ($("#chkTerms" + i).prop('checked') == false && $('#remarks' + i).val() != "" && $('#vid' + i).text() != "" && $('#seid' + i).text() != "") {
                BlockQuery = BlockQuery + 'exec PE.BidItemsVendorBlocked ';
                BlockQuery = BlockQuery + "'" + $.trim($('#vid' + i).text()) + "'," + sessionStorage.getItem('hdnbid') + "," + $.trim($.trim($('#seid' + i).text())) + ",'" + $.trim($('#remarks' + i).val()).replace(/'/g, "''") + "','" + sessionStorage.getItem('UserID') + "'  ;"
            }
            if (quote != "" && quote != "0") {
                HeaderQuery = HeaderQuery + 'exec PE.BidParticipationInsUpdCoalExport ';
                HeaderQuery = HeaderQuery + $.trim($('#vid' + i).text()) + "," + sessionStorage.getItem('hdnbid') + "," + $.trim($('#vid' + i).text()) + "," + removeThousandSeperator(quote) + "," + $.trim($('#seid' + i).text()) + "," + $.trim($('#advfactor' + i).text()) + ",0,0,0,'Y' ; "
            }
            i++;
        })
        if (HeaderQuery != "" && HeaderQuery != null) {
            validateSubmit = true;
        }
        if (BlockQuery != "" && BlockQuery != null) {
            validateSubmit = true;
        }
        if (validateSubmit) {
            var Data = {
                "BlockedItemQuery": BlockQuery,
                "HeaderDetails": HeaderQuery,
                "BidID": parseInt(sessionStorage.getItem('hdnbid')),
                "UserID": sessionStorage.getItem('UserID'),
                "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
            };
            jQuery.ajax({

                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "VendorParticipation/insPreBidPricing/",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                crossDomain: true,
                async: false,
                data: JSON.stringify(Data),
                dataType: "json",
                success: function (data) {
                    successprebid.show();
                    $('#succpreprice').html('Pre-Bid Prices updated successfully..');
                    successprebid.fadeOut(5000);
                    fetchItemsforPreBidPrices(sessionStorage.getItem('hdnbid'), sessionStorage.getItem("hdnbidtypeid"), sessionStorage.getItem('hdbbidForID'));
                    jQuery.unblockUI();
                },
                error: function (xhr, status, error) {
                    var err = xhr.responseText// eval("(" + xhr.responseText + ")");
                    if (xhr.status == 401) {
                        error401Messagebox(err.Message);
                    }
                    else {
                        fnErrorMessageText('spandanger', '');
                    }
                    jQuery.unblockUI();
                    return false;
                }
            });
        }
        else {
            errorprebid.show();
            $('#errpre').html('Please fill Price.');
            errorprebid.fadeOut(7000);
        }
    }
}
function fnsubmitFAPrePrices() {
    var validateSubmit = false;
    HeaderQuery = '';
    BlockQuery = "";
    var i = 0
    flagBlock = "T";
    $("#tblprebidvendors tr:gt(0)").each(function () {

        if ($("#chkTerms" + i).prop('checked') == false && $('#remarks' + i).val() == "") {
            $('#remarks' + i).removeClass('has-success')
            $('#remarks' + i).css("border", "1px solid red")
            flagBlock = 'F';

        }
        i++;
    })

    if (flagBlock == "T") {
        i = 0;
        $("#tblprebidvendors tr:gt(0)").each(function () {
            var this_row = $(this);
            quote = $.trim($('#txtpreprice' + i).val())
            if ($("#chkTerms" + i).prop('checked') == false && $('#remarks' + i).val() != "" && $('#vid' + i).text() != "" && $('#seid' + i).text() != "") {
                BlockQuery = BlockQuery + 'exec PE.BidItemsVendorBlocked ';
                BlockQuery = BlockQuery + "'" + $.trim($('#vid' + i).text()) + "'," + sessionStorage.getItem('hdnbid') + "," + $.trim($('#seid' + i).text()) + ",'" + $.trim($('#remarks' + i).val()).replace(/'/g, "''") + "','" + sessionStorage.getItem('UserID') + "'  ;"
            }
            if (quote != "" && quote != "0") {
                HeaderQuery = HeaderQuery + 'exec PE.ParticipationScrapSaleSingleItem ';
                HeaderQuery = HeaderQuery + $.trim($('#vid' + i).text()) + "," + sessionStorage.getItem('hdnbid') + "," + removeThousandSeperator(quote) + "," + $.trim($('#seid' + i).text()) + "," + $.trim($('#vid' + i).text()) + ",'Y' ; "
            }
            i++;
        })
        if (HeaderQuery != "" && HeaderQuery != null) {
            validateSubmit = true;
        }
        if (BlockQuery != "" && BlockQuery != null) {
            validateSubmit = true;
        }
        if (validateSubmit) {
            var Data = {
                "BlockedItemQuery": BlockQuery,
                "HeaderDetails": HeaderQuery,
                "BidID": parseInt(sessionStorage.getItem('hdnbid')),
                "UserID": sessionStorage.getItem('UserID'),
                "BidTypeID": parseInt(sessionStorage.getItem('hdnbidtypeid'))
            };

            console.log(JSON.stringify(Data))

            jQuery.ajax({

                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "VendorParticipation/insPreBidPricing/",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                crossDomain: true,
                async: false,
                data: JSON.stringify(Data),
                dataType: "json",
                success: function (data) {
                    successprebid.show();
                    $('#succpreprice').html('Pre-Bid Prices updated successfully..');
                    successprebid.fadeOut(5000);
                    fetchItemsforPreBidPrices(sessionStorage.getItem('hdnbid'), sessionStorage.getItem("hdnbidtypeid"), sessionStorage.getItem('hdbbidForID'));
                    jQuery.unblockUI();
                },
                error: function (xhr, status, error) {
                    var err = xhr.responseText// eval("(" + xhr.responseText + ")");
                    if (xhr.status == 401) {
                        error401Messagebox(err.Message);
                    } else {
                        fnErrorMessageText('spandanger', '');
                    }
                    jQuery.unblockUI();
                    return false;
                }
            });
        }
        else {
            errorprebid.show();
            $('#errpre').html('Please fill Price.');
            errorprebid.fadeOut(7000);
        }
    }
}


$('#PrePriciing').on("hidden.bs.modal", function () {
    $("#instructionsDivParameter").hide();
    $("#instructionSpanParameter").hide();
    $("#error-excelparameter").hide();
    $("#success-excelparameter").hide();
    $("#file-excelparameter").val('');
    $('#btnyesno').show()
    $('#modalLoaderparameter').addClass('display-none');
})
function fnNoUpload() {
    $("#instructionsDivParameter").hide();
    $("#instructionSpanParameter").hide();
    $("#error-excelparameter").hide();
    $("#success-excelparameter").hide();
    $("#file-excelparameter").val('');
    $('#PrePriciing').modal('hide');
    $('#btnyesno').show()
    $('#modalLoaderparameter').addClass('display-none');
}


$("#btninstructionexcelparameter").click(function () {
    $("#instructionsDivParameter").show();
    $("#instructionSpanParameter").show();
});
function handleFileparameter(e) {

    //Get the files from Upload control
    var files = e.target.files;
    var i, f;
    //Loop through files

    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {
            var data = e.target.result;

            var result;
            var workbook = XLSX.read(data, { type: 'binary' });

            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function (y) { /* iterate through sheets */
                //Convert the cell value to Json
                var sheet1 = workbook.SheetNames[0];
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1]);
                if (roa.length > 0) {
                    result = roa;
                }
            });
            //Get the first column first cell value

            printdataSeaBid(result)
        };
        reader.readAsArrayBuffer(f);
    }
}
function printdataSeaBid(result) {
    var loopcount = result.length; //getting the data length for loop.
    if (loopcount > 200) {
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html('Only max 200 Items is allowed. Please fill and upload the file again.');
        $("#file-excelparameter").val('');
        return false;
    }
    else {
        var seid = 0;
        var price = 0;
        var ErrorMszDuplicate = '';
        var i;
        //var numberOnly = /^[0-9]+$/;
        var numberOnly = /^[0-9]\d*(\.\d+)?$/;
        var numberOnlythree = /^\d{0,4}(\.\d{0,3})?$/i;
        $("#temptableForExcelDataparameter").empty();
        $("#temptableForExcelDataparameter").append("<tr><th style='width:5%!important;'>BidID</th><th style='width:20%!important;'>VendorID</th><th>Vendor</th><th>ItemID</th><th>ItemName</th><th>Price</th></tr>");
        var st = true;
        for (i = 0; i < loopcount; i++) {

            if (!result[i].Price.trim().match(numberOnly) && result[i].Price.trim() != '' && result[i].Price.trim() != '0' && sessionStorage.getItem("hdnbidtypeid") == 7) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Price should be in numbers only of Item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (!result[i].Price.trim().match(numberOnly) && result[i].Price.trim() != '' && result[i].Price.trim() != '0' && sessionStorage.getItem("hdnbidtypeid") == 8) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Price should be in numbers only of Item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;
            }
            else {

                $("<tr><td id=bExcelid" + i + ">" + result[i].BidID + "</td><td id=videxcel" + i + ">" + result[i].VendorID + "</td><td id=vendorexcel" + i + ">" + result[i].Vendor + "</td><td id=seisexcel" + i + ">" + result[i].ItemID + "</td><td>" + result[i].ItemName + "</td><td id=txtpriceexcel" + i + ">" + result[i].Price + "</td></tr>").appendTo("#temptableForExcelDataparameter");
            }
        } // for loop ends
    }
    var excelCorrect = 'N';
    Rowcount = 0;
    excelCorrect = 'Y';
    ErrorMszDuplicate = ''; st = true;
    Rowcount = $("#temptableForExcelDataparameter >tbody>tr").length;
    for (x = 0; x < Rowcount; x++) {
        console.log("Excel" + x + ": " + $('#bExcelid' + x).text())
        console.log(sessionStorage.getItem('hdnbid'))
        if ($.trim($('#bExcelid' + x).text()) == $.trim(sessionStorage.getItem('hdnbid')) && $.trim($('#bExcelid' + x).text()) != "") {
            seid = $('#seisexcel' + x).text();
            price = $.trim($('#txtpriceexcel' + x).text())
            for (y = x + 1; y < Rowcount; y++) {
                if ($('#seisexcel' + y).text() == seid) {
                    if (price == $.trim($('#txtpriceexcel' + y).text()) && $('#txtpriceexcel' + y).text() != '' && y != 0) {

                        ErrorMszDuplicate = ErrorMszDuplicate + ' already quoted by someone of Item no ' + (x + 1) + ' . Item will not insert.!<BR>'
                        st = false;

                    }
                }
            }

        }
        else if ($.trim($('#bExcelid' + x).text()) != "") {

            ErrorMszDuplicate = ErrorMszDuplicate + "Bid's Template is not correct.Please download Template for selected Bid again. Item will not insert.!<BR>"
            st = false;
            break;
            //}
        }
    }
    if (st == true) {//excelCorrect == 'Y' &&
        $('#btnyesno').show();
        $("#error-excelparameter").hide();
        $("#errspan-excelparameter").html('');
        $("#success-excelparameter").show()
        $("#succspan-excelparameter").html('Excel file is found ok. Do you want to upload? \n This will clean your existing Data.')
        $("#file-excelparameter").val('');
        excelCorrect = '';

    }
    else {
        $("#success-excelparameter").hide()
        $("#succspan-excelparameter").html('')
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html(ErrorMszDuplicate)
    }

}
function fnSeteRFQparameterTable() {


    var rowCount = jQuery('#temptableForExcelDataparameter >tbody>tr').length;
    if (rowCount >= 1) {
        $("#success-excelparameter").hide();
        $('#btnsforYesNo').show()
        $("#error-excelparameter").hide();
        $('#loader-msgparameter').html('Processing. Please Wait...!');
        $('#modalLoaderparameter').removeClass('display-none');
        jQuery("#tblServicesProduct").empty();
        $("#temptableForExcelDataparameter tr:gt(0)").each(function (index) {
            var this_row = $(this);
            // if ($('#vid' + index).text() == $.trim(this_row.find('td:eq(1)').html()) && $('#seid' + index).text() == $.trim(this_row.find('td:eq(3)').html())) {
            if ($('#vid' + index).text() == $.trim($('#videxcel' + index).text()) && $('#seid' + index).text() == $.trim($('#seisexcel' + index).text())) {
                $('#txtpreprice' + index).val(thousands_separators($.trim($('#txtpriceexcel' + index).text())))
            }
        });
        setTimeout(function () {
            $('#PrePriciing').modal('hide');
            submitprebidprice();
            jQuery.unblockUI();
        }, 500 * rowCount)
    }
    else {
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html('No Items Found in Excel');
    }
}
$("#btndownloadTemplate").click(function (e) {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;

    //tableToExcelMultipleWorkSheet(['tblBiddetails', 'tblUOM'], ['DataTemplate', 'Instructions'], 'PrePricingXLTemplate -' + postfix + '.xls')
    tableToExcelMultipleWorkSheet(['tblBiddetailsPreprice'], ['DataTemplate'], 'PrePricingXLTemplate -' + postfix + '.xls')

});