$("#cancelBidBtn").hide();

$('#spinner4').spinner({ value: 1, step: 1, min: 1, max: 10 });
jQuery(document).ready(function () {
    $("#txtCeilingPrice,#txtquantitiy,#txtmaxquantitiy,#txtminquantitiy,#txtminimumdecreament,#txtStartingPrice,#txtPriceReductionAmount").inputmask({
        alias: "decimal",
        rightAlign: false,
        groupSeparator: ",",
        radixPoint: ".",
        autoGroup: true,
        integerDigits: 40,
        digitsOptional: true,
        allowPlus: false,
        allowMinus: false,
        clearMaskOnLostFocus: true,
        supportsInputType: ["text", "tel", "password"],
        'removeMaskOnSubmit': true,
        autoUnmask: true

    });
});

var _BidID;
var _savedDraft = '';
sessionStorage.setItem('_savedDraft', 'N');
if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param);
    _BidID = getUrlVarsURL(decryptedstring)["BidID"];
    if (_BidID == null) {
        sessionStorage.setItem('CurrentBidID', 0);
        _BidID = 0;
    }
    else {
        sessionStorage.setItem('CurrentBidID', _BidID)
        fetchFrenchBidDetails();
        sessionStorage.setItem('_savedDraft', 'Y')
    }
}

function cancelbid() {
    CancelBidDuringConfig(_BidID, 'BID');
}

function CheckminQuantity(id) {
    var biddidval = $('#' + id.id).val();
    if (parseFloat(removeThousandSeperator(biddidval)) > parseFloat(removeThousandSeperator($('#txtquantitiy').val())) || $('#txtquantitiy').val() == "") {
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

    if (parseFloat(removeThousandSeperator(biddidval)) > parseFloat(removeThousandSeperator($('#txtquantitiy').val())) || $('#txtquantitiy').val() == "" || parseFloat(removeThousandSeperator(biddidval)) < parseFloat(removeThousandSeperator($('#txtminquantitiy').val()))) {
        $('#' + id.id).closest('.maxq').removeClass('has-success').addClass('has-error');
        $('#spnmaxq').removeClass('hide');
        $('#spnmaxq').text('Max Quantity should not be greater than Quantity & less than min. Quantity');
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
$('#txtBidSubject,#txtshortname,#txtConversionRate,.maxlength').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

jQuery("#txtApprover").keyup(function () {
    sessionStorage.setItem('hdnApproverid', '0');

});
sessionStorage.setItem('hdnApproverid', 0);
jQuery("#txtApprover").typeahead({
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
            sessionStorage.setItem('hdnApproverid', map[item].userID);
            // addApprovers();
            fnApproversQuery(map[item].emailID, map[item].userID, map[item].userName);
        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver.');
        }

        return item;
    }

});
var rowApp = 0;
var rowpreBidApp = 0;
var rownum = 0;
var rownumprebid = 0;
function fnApproversQuery(EmailID, UserID, UserName) {
    var status = "true";
    $("#tblapprovers tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(4)').html()) == sessionStorage.getItem('hdnApproverid')) {
            status = "false"
        }
    });

    if (UserID == "0" || jQuery("#txtApprover").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('Approver is already mapped for this Reverse Auction.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else {
        rowApp = rowApp + 1;
        rowpreBidApp = rowpreBidApp + 1;
        var num = 0;
        var maxidnum = 0;
        $("#tblapprovers tr:gt(0)").each(function () {
            var this_row = $(this);

            num = (this_row.closest('tr').attr('id')).substring(7, (this_row.closest('tr').attr('id')).length)
            if (parseInt(num) > parseInt(maxidnum)) {
                maxidnum = num;
            }
        });

        rownum = parseInt(maxidnum) + 1;
        if (!jQuery("#tblapprovers thead").length) {
            jQuery("#tblapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblapprovers").append('<tr id=trAppid' + rownum + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblapprovers").append('<tr id=trAppid' + rownum + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        //** Preview
        $('#wrap_scrollerPrevApp').show();
        if (!jQuery("#tblapproversPrev thead").length) {

            jQuery("#tblapproversPrev,#tblpreBidapprovers1").append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblapproversPrev,#tblpreBidapprovers1").append('<tr id=trAppidPrev' + rownum + '><td>' + UserName + '</td><td>' + EmailID + '</td><td class=hide>' + UserID + '</td><td>' + rowApp + '</td></tr>');
        }
        else {
            jQuery("#tblapproversPrev,#tblpreBidapprovers1").append('<tr id=trAppidPrev' + rownum + '><td>' + UserName + '</td><td>' + EmailID + '</td><td class=hide>' + UserID + '</td><td>' + rowApp + '</td></tr>');
        }



        //** Pre Approvers
        num = 0;
        maxidnum = 0;
        $("#tblpreBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
           num = (this_row.closest('tr').attr('id')).substring(10, (this_row.closest('tr').attr('id')).length)
            if (parseInt(num) > parseInt(maxidnum)) {
                maxidnum = num;
            }
        });

        rownumprebid = parseInt(maxidnum) + 1;
        if (!jQuery("#tblpreBidapprovers thead").length) {
            jQuery("#tblpreBidapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rownumprebid + '><td><button class="btn  btn-xs btn-danger" onclick="deletepreApprow(' + rownumprebid + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rownumprebid + '><td><button class="btn  btn-xs btn-danger" onclick="deletepreApprow(' + rownumprebid + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }

        var rowcount = jQuery('#tblapprovers >tbody>tr').length;
        var rowcountPre = jQuery('#tblpreBidapprovers >tbody>tr').length;

        if (rowcount >= 1) {
            $("#tblapprovers tr:gt(0)").each(function (index) {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(3)').html(index + 1));
            });
            $("#tblapproversPrev tr:gt(0)").each(function (index) {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(3)').html(index + 1));
            });
        }
        if (rowcountPre >= 1) {
            $("#tblpreBidapprovers tr:gt(0)").each(function (index) {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(3)').html(index + 1));
            });
            $("#tblpreBidapprovers1 tr:gt(0)").each(function (index) {
                var this_row = $(this);
                $.trim(this_row.find('td:eq(3)').html(index + 1));
            });
        }

    }
}
function deleteApprow(rowid) {

    rowApp = rowApp - 1;
    // $('#' + rowid.id).remove();
    //$('#' + rowidPrev.id).remove();
    $('#trAppid' + rowid).remove();
    $('#trAppidPrev' + rowid).remove();
    $('#trpreAppid' + rowid).remove();
    $('#trpreAppidPrev' + rowid).remove();
    var rowCount = jQuery('#tblapprovers >tbody>tr').length;
    var i = 1;
    if (rowCount >= 1) {
        $("#tblapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
        i = 1;
        $("#tblapproversPrev tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
    var rowCountprebid = jQuery('#tblpreBidapprovers >tbody>tr').length;
    i = 1;
    if (rowCountprebid >= 1) {
        $("#tblpreBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
        i = 1;
        $("#tblpreBidapprovers1 tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
}

//*** Autocomplete of Pre Approvers
jQuery("#txtpreApproverBid").keyup(function () {
    sessionStorage.setItem('hdnpreApproverid', '0');

});
sessionStorage.setItem('hdnpreApproverid', 0);

jQuery("#txtpreApproverBid").typeahead({
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
            sessionStorage.setItem('hdnpreApproverid', map[item].userID);
            addBidpreApprovers(map[item].emailID, map[item].userID, map[item].userName);

        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }

});


function addBidpreApprovers(EmailID, UserID, UserName) {
    var status = "true";
    $("#tblpreBidapprovers tr:gt(0)").each(function () {
        var this_row = $(this);
        if ($.trim(this_row.find('td:eq(4)').html()) == sessionStorage.getItem('hdnpreApproverid')) {
            status = "false"
        }
    });

    if (UserID == "0" || jQuery("#txtpreApproverBid").val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Approver not selected. Please press + Button after selecting Approver');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (status == "false") {
        $('.alert-danger').show();
        $('#spandanger').html('Approver is already mapped for this Reverse Auction.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else {
        rowpreBidApp = rowpreBidApp + 1;

        num = 0;
        maxidnum = 0;
        $("#tblpreBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            num = (this_row.closest('tr').attr('id')).substring(10, (this_row.closest('tr').attr('id')).length)
            if (parseInt(num) > parseInt(maxidnum)) {
                maxidnum = num;
            }
        });
        rownumprebid = parseInt(maxidnum) + 1;
        if (!jQuery("#tblpreBidapprovers thead").length) {
            jQuery("#tblpreBidapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rownumprebid + '><td><button class="btn  btn-xs btn-danger" onclick="deletepreApprow(' + rownumprebid + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rownumprebid + '><td><button class="btn  btn-xs btn-danger" onclick="deletepreApprow(' + rownumprebid + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }

    }
}
function deletepreApprow(rowid) {

    rowpreBidApp = rowpreBidApp - 1;
    // $('#' + rowid.id).remove();
    $('#trpreAppid' + rowid).remove();
    var rowCount = jQuery('#tblpreBidapprovers >tbody>tr').length;
    var i = 1;
    if (rowCount >= 1) {
        $("#tblpreBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
}


var _BidDuration = 0;
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
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }

            return false;
            jQuery.unblockUI();
        }

    });

}
var vCount = 0;
function Check(event, vname, vendorID) {
    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")

    }
    else {
        vCount = vCount + 1;
        //var EvID = event.id;
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")
        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',SelecetedVendorPrev' + vendorID + ',' + vendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td></tr>')
        $('#divvendorlist').find('span#spandynamic').hide();

        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
    }
    if (vCount > 0) {
        jQuery('#selectedvendorlists').show()
        jQuery('#selectedvendorlistsPrev').show()
    }
    else {
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()
    }

}

function removevendor(trid, trprevid, vid) {

    vCount = vCount - 1;
    $('#' + trid.id).remove()
    $('#' + trprevid.id).remove()

    if (vCount > 0) {
        jQuery('#selectedvendorlists').show()
        jQuery('#selectedvendorlistsPrev').show()
    }
    else {

        $('#chkAll').closest("span").removeClass("checked")
        $('#chkAll').prop("checked", false);
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()

    }
    if ($('#chkvender' + vid).length) {
        $('#chkvender' + vid).closest("span#spanchecked").removeClass("checked")
        $('#chkvender' + vid).prop("disabled", false);
    }

}

var status;
function ValidateVendor() {

    status = "false";
    var i = 0;

    $('#divvendorlist').find('span#spandynamic').hide();
    if ($("#selectedvendorlists> tbody > tr").length < 2) {
        status == "false";
    }
    else {
        status = "True";
    }
    if (status == "false") {

        $('.alert-danger').show();
        $('#spandanger').html('Please select atleast two vendors');
        Metronic.scrollTo($('.alert-danger'), -200);
        $('.alert-danger').fadeOut(5000);
        $('table#tblvendorlist').closest('.inputgroup').addClass('has-error');
        status = "false";
    }
    return status;
}

$("#chkAll").click(function () {
    if ($("#chkAll").is(':checked') == true) {
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        jQuery('#selectedvendorlists> tbody').empty()
        jQuery('#selectedvendorlistsPrev> tbody').empty()
        vCount = 0;
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
            $('#chkvender' + vCount).prop("disabled", true);
            var vendorid = $('#chkvender' + vCount).val()
            var v = vCount;
            vCount = vCount + 1;
            var vname = $.trim($(this).find('td:eq(1)').html())
            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorid + ',' + 'chkvender' + v + ',SelecetedVendorPrev' + vendorid + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td></tr>')

        });
    }
    else {
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").removeClass("checked");
            vCount = 0;
            $('input[name="chkvender"]').prop('disabled', false);
            jQuery('#selectedvendorlists> tbody').empty()
            jQuery('#selectedvendorlistsPrev> tbody').empty()
        });

    }
    if (vCount > 0) {
        jQuery('#selectedvendorlists').show()
        jQuery('#selectedvendorlistsPrev').show()
    }
    else {
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()
    }

});



var allUsers = '';
function fetchRegisterUser() {
    var data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": sessionStorage.getItem('UserID'),
        "Isactive": "N"
    } 

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
       // url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&Isactive=N",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser",
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
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });

}

////  validation parts ///////

var error = $('.alert-danger');
var success = $('.alert-success');
var form = $('#submit_form');
jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    //"Value cannot be {0}"
    "This field is required."
);

var FormWizard = function () {

    return {

        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }
            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;

            }


            form.validate({

                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input

                rules: {

                    txtBidDuration: {
                        required: true,
                        minlength: 1,
                        maxlength: 3,
                        number: true,
                        notEqualTo: 0
                    },

                    txtBidSubject: {
                        required: true
                    },

                    txtbiddescription: {
                        required: true
                    },

                    dropCurrency: {
                        required: true
                    },

                    txtConversionRate: {
                        required: true,
                        number: true,
                        minlength: 1,
                        maxlength: 7//3
                    },
                    ddlAuctiontype: {
                        required: true
                    },

                    txtbidDate: {
                        required: true
                    },

                    //txtbidTime: {
                    //    required: true
                    //},

                    mapedapprover: {
                        required: true
                    },
                    file1: {
                        required: true
                    },

                    //Second Tab
                    txtshortname: {
                        required: true
                    },
                    txtquantitiy: {
                        number: true,
                        required: true,
                        notEqualTo: 0
                    },
                    txtUOM: {
                        required: true
                    },
                    txtbiddescriptionP: {

                    },
                    txtminquantitiy: {
                        required: true,
                        number: true,
                       // notEqualTo: 0
                    },
                    txtmaxquantitiy: {
                        required: true,
                        number: true,
                        notEqualTo: 0
                    },
                    txtCeilingPrice: {
                        required: true,
                        number: true,
                        notEqualTo: 0
                    },
                    txtedelivery: {

                    },
                    txtminimumdecreament: {
                        number: true,
                        notEqualTo: 0
                    },
                    drpdecreamenton: {

                    },
                    txttargetprice: {
                        number: true,
                        maxlength: 10
                    },
                    txtlastinvoiceprice: {
                        number: true,
                        maxlength: 10
                    }
                },

                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                    if ($("#txtbidDate").closest('.inputgroup').attr('class') == 'inputgroup has-error') {
                        $("#btncal").css("margin-top", "-22px");
                    }

                },
                invalidHandler: function (event, validator) {
                    success.hide();
                    Metronic.scrollTo(error, -200);

                },

                highlight: function (element) {

                    $(element)
                        .closest('.inputgroup,.xyz').removeClass('has-success').addClass('has-error');
                    $(element)
                        .closest('.col-md-4,.xyz').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element)
                        .closest('.inputgroup,.xyz').removeClass('has-error');
                    $(element)
                        .closest('.col-md-4,.xyz').removeClass('has-error');

                },

                success: function (label) {

                    label.addClass('valid').closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    if ($("#txtbidDate").closest('.inputgroup').attr('class') == 'inputgroup has-error') {
                        $("#btncal").css("margin-top", "-22px");
                    }
                    else {
                        $("#btncal").css("margin-top", "0px");
                    }
                },
                submitHandler: function (form) {
                    error.hide();
                }
            });
            var formApprover = $('#frmApprover');
            formApprover.validate({

                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {

                },

                invalidHandler: function (event, validator) {
                },

                highlight: function (element) {
                    $(element).closest('.col-md-7').addClass('has-error');

                },

                unhighlight: function (element) {
                    $(element).closest('.col-md-7').removeClass('has-error');

                },
                errorPlacement: function (error, element) {

                },
                success: function (label) {
                },
                submitHandler: function (form) {

                    if ($('#tblpreBidapprovers >tbody >tr').length == 0) {
                        $('.alert-danger').show();
                        $('#spandangerapp').html('Please Map Approver.');
                        $('.alert-danger').fadeOut(5000);
                        return false;
                    }
                    else {
                        MapBidapprover();
                    }

                }

            });

            var handleTitle = function (tab, navigation, index) {

                var total = navigation.find('li').length;
                var current = index + 1;

                // set wizard title

                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);

                // set done steps

                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {

                    jQuery(li_list[i]).addClass("done");

                }
                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();

                } else {
                    $('#form_wizard_1').find('.button-previous').show();

                }
                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                } else {
                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                }
                Metronic.scrollTo($('.page-title'));

            }

            // default form wizard

            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',

                onTabClick: function (tab, navigation, index, clickedIndex) {
                    return false;
                },

                onNext: function (tab, navigation, index) {

                    success.hide();
                    error.hide();

                    if (index == 1) {
                        if (form.valid() == false) {
                            form.validate();
                            return false;
                        }
                        else if ($('#tblapprovers >tbody >tr').length == 0) {
                            $('.alert-danger').show();
                            $('#spandanger').html('Please Map Approver.');
                            Metronic.scrollTo($(".alert-danger"), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

                        }
                        else if ($("#txtBidDuration").val() == '0' && ($("#ddlAuctiontype option:selected").val() == "81" || $("#ddlAuctiontype option:selected").val() == "83")) {
                            $(".alert-danger").find("span").html('').html('Bid Duration can not be zero.')
                            Metronic.scrollTo(error, -200);
                            $(".alert-danger").show();
                            $(".alert-danger").fadeOut(5000);
                            return false;
                        }
                        else {

                            Dateandtimevalidate('index1')
                            $('.currencyparam').html($('#dropCurrency option:selected').text());
                        }

                    } else if (index == 2) {
                        if ($('#tblServicesProduct >tbody >tr').length == 0) {
                            $('#spandanger').html('please Configure Bid parameters..')
                            $('.alert-danger').show();
                            Metronic.scrollTo($('.alert-danger'), -200);
                            $('.alert-danger').fadeOut(5000);
                            return false;

                        }
                        else if ($("#txtBidDuration").val() == '0') {
                            $('#form_wizard_1').bootstrapWizard('previous');
                            $(".alert-danger").find("span").html('').html('Bid Duration can not be zero.')
                            Metronic.scrollTo(error, -200);
                            $(".alert-danger").show();
                            $(".alert-danger").fadeOut(5000);
                            return false;
                        }
                        else {
                            ConfigureBidInsfrenchTab2()
                        }
                    }
                    handleTitle(tab, navigation, index);

                },

                onPrevious: function (tab, navigation, index) {

                    success.hide();
                    error.hide();
                    handleTitle(tab, navigation, index);

                },

                onTabShow: function (tab, navigation, index) {

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.progress-bar').css({
                        width: $percent + '%'

                    });

                }

            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').click(function () {

                if ($('#tblServicesProduct >tbody >tr').length == 0) {

                    $('#form_wizard_1').bootstrapWizard('previous');
                    error.show();
                    $('#spandanger').html('please Configure Bid parameters..')
                    error.fadeOut(3000)
                    return false;

                }
                else if ($('#tblapprovers >tbody >tr').length == 0) {
                    $('#form_wizard_1').bootstrapWizard('previous');
                    $('.alert-danger').show();
                    $('#spandanger').html('Please Map Approver.');
                    $('.alert-danger').fadeOut(5000);
                    return false;

                }
                else if (ValidateVendor() == 'false') {
                    return false;

                }
                else {
                    Dateandtimevalidate('index3')
                }

            }).hide();

        }

    };

}();

function ConfigureBidInsfrenchTab1() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';
    var AttachementFileName = '';
    _bidType = $("#ddlAuctiontype option:selected").val();


    if ($('#filepthterms').html() != '' && ($('#file1').val() == '')) {
        TermsConditionFileName = jQuery('#filepthterms').html();
    } else {
        TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
    }


    if (($('#filepthattach').html() != '') && ($('#file2').val() == '')) {
        AttachementFileName = jQuery('#filepthattach').html();
    } else {
        AttachementFileName = jQuery('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1);
    }
    var bidDuration = 0;
    TermsConditionFileName = TermsConditionFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters



    bidDuration = $("#txtBidDuration").val();
    var approvers = '';
    var rowCount = jQuery('#tblapprovers tr').length;
    if (rowCount > 1) {
        $("#tblapprovers tr:gt(0)").each(function () {

            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';

        })
    }
    var StartDT = new Date();
    if ($('#txtbidDate').val() != null && $('#txtbidDate').val() != "") {
        StartDT = new Date($('#txtbidDate').val().replace('-', ''));
    }

    var _cleanString = StringEncodingMechanism(jQuery("#txtBidSubject").val());
    var _cleanString = StringEncodingMechanism(jQuery("#txtbiddescription").val());

    var Tab1Data = {

        "BidId": parseInt(sessionStorage.getItem('CurrentBidID')),
        "BidTypeID": 9,
        "BidForID": parseInt($("#ddlAuctiontype option:selected").val()),
        "BidDuration": parseInt(bidDuration),
        //"BidSubject": jQuery("#txtBidSubject").val(),
        "BidSubject": _cleanString,
        //"BidDescription": jQuery("#txtbiddescription").val(),
        "BidDescription": _cleanString,
        "BidDate": StartDT,
        //"BidDate": jQuery("#txtbidDate").val(),
        //"BidTime": jQuery("#txtbidTime").val(),
        "CurrencyID": parseInt(jQuery("#dropCurrency option:selected").val()),
        "ConversionRate": parseFloat(jQuery("#txtConversionRate").val()),
        "TermsConditions": TermsConditionFileName,
        "Attachment": AttachementFileName,
        "UserId": sessionStorage.getItem('UserID'),
        "BidApprovers": approvers,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ShowRankToVendor": $('#drpshowL1L2').val(),
        "HideVendor": $('#drphideVendor').val(),
        "NoofBidExtension": parseInt($("#txtBidExtension").val())

    };

    //alert(JSON.stringify(Tab1Data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsFrenchTab1/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab1Data),
        dataType: "json",
        success: function (data) {
            if (window.location.search) {
                var param = getUrlVars()["param"]
                var decryptedstring = fndecrypt(param)
                sessionStorage.setItem('CurrentBidID', getUrlVarsURL(decryptedstring)["BidID"]);
            }
            else {
                sessionStorage.setItem('CurrentBidID', parseInt(data))
            }

            //** Upload Files on Azure PortalDocs folder
            if ($('#file1').val() != '') {
                fnUploadFilesonAzure('file1', TermsConditionFileName, 'Bid/' + sessionStorage.getItem('CurrentBidID'));

            }
            if ($('#file2').val() != '') {
                fnUploadFilesonAzure('file2', AttachementFileName, 'Bid/' + sessionStorage.getItem('CurrentBidID'));

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });
    jQuery.unblockUI();
}

function ConfigureBidInsfrenchTab2() {
    var targetPrice;
    var lastInvoiceprice = 0, i = 0;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var tab2Items = '', PriceDetails = [];

    var rowCount = jQuery('#tblServicesProduct>tbody> tr').length;
    if (rowCount >= 1) {

        $("#tblServicesProduct tr:gt(0)").each(function () {
            var this_row = $(this);
            i = (this_row.closest('tr').attr('id')).substring(4);
            targetPrice = 0, tab2Data = '';
            if ($.trim($('#TP' + i).text()) != '') {
                targetPrice = $.trim($('#TP' + i).text());
            }
            var _cleanString = StringEncodingMechanism($.trim($('#itemname' + i).text()));

            tab2Items = {
                "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
                "ItemCode": $.trim($('#itemcode' + i).text()),
                //"ItemName": $.trim($('#itemname' + i).text()),
                "ItemName": _cleanString,
                "Description": "",
                "Targetprice": parseFloat(removeThousandSeperator(targetPrice)),
                "Quantity": parseFloat(removeThousandSeperator($.trim($('#quantity' + i).text()))),
                "MeasurementUnit": $.trim($('#UOM' + i).text()),
                "LastInvoicePrice": parseFloat($.trim($('#LIP' + i).text())),
                "Remarks": '',
                "BidStartPrice": parseFloat(removeThousandSeperator($.trim($('#BSP' + i).text()))),
                "MaskVendor": $.trim($('#maskvendor' + i).text()),
                "MinimumIncreament": parseFloat(removeThousandSeperator($.trim($('#mininc' + i).text()))),
                "IncreamentOn": $.trim($('#inconval' + i).text()),
                "SelectedCurrency": $.trim($('.currencyparam').text()),
                "ShowHLPrice": $.trim($('#showhl' + i).text()),
                "ShowStartPrice": $.trim($('#showstart' + i).text()),
                "MinOfferedQuantity": parseFloat(removeThousandSeperator($.trim($('#minquantity' + i).text()))),
                "MaxOfferedQuantity": parseFloat(removeThousandSeperator($.trim($('#maxquantity' + i).text())))
            }
            PriceDetails.push(tab2Items)
        });

    }
    var Tab2data = {
        "ProductDetails": PriceDetails,
        "bidID": parseInt(sessionStorage.getItem('CurrentBidID')),
        "UserId": sessionStorage.getItem('UserID'),
        "BidDuration": parseInt($('#txtBidDuration').val())

    };


    //alert(JSON.stringify(Tab2data))
    console.log(JSON.stringify(Tab2data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsfrenchTab2/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab2data),
        dataType: "json",
        success: function (data) {
            if (parseInt(data) > 0) {
                return true;
            }
            else {
                return false;

            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                // fnErrorMessageText('spandanger', 'form_wizard_1');
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;

        }

    });
    jQuery.unblockUI();
}
function ConfigureFrenchVendorsave() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var InsertQuery = '';
    $("#selectedvendorlistsPrev> tbody > tr").each(function (index) {
        InsertQuery = InsertQuery + $.trim($(this).find('td:eq(0)').html()) + '~0~N' + '#';
    });

    var data = {
        "BidVendors": InsertQuery,
        "BidID": parseInt(sessionStorage.getItem('CurrentBidID'))
    };

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsSeaExportVendors/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if (parseInt(data) > 0) {
                jQuery.unblockUI();
                $('#BidPreviewDiv').show();
                $('#form_wizard_1').hide();
            }
            else {
                jQuery.unblockUI();
                bootbox.alert("Configuration error.");
            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText // eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
        }
    });
}
function ConfigureBidInsFrenchTab3() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });


    var bidDuration = '0';
    bidDuration = $("#txtBidDuration").val();
    if (bidDuration == '0') {

        $(".alert-danger").find("span").html('').html("The Event Duration can not be '0'. Please check your bid again. ")
        Metronic.scrollTo(error, -200);
        $(".alert-danger").show();
        $(".alert-danger").fadeOut(5000);
        jQuery.unblockUI();
        return false;
    }
    else {
        // if (sessionStorage.getItem("BidPreApp") == "N") {
        var Tab3data = {
            "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
            "UserID": sessionStorage.getItem('UserID'),
            "BidTypeID": 9,
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
        };
        // alert(JSON.stringify(Tab3data))

        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsFrenchTab3/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab3data),
            dataType: "json",
            success: function (data) {

                jQuery.unblockUI();
                bootbox.alert("Bid Configured Successfully.", function () {
                    sessionStorage.removeItem('CurrentBidID');
                    window.location = sessionStorage.getItem("HomePage")
                    return false;
                });

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', 'form_wizard_1');
                }
                jQuery.unblockUI();
                return false;

            }

        });
    }
    //else {
    //    fnOpenPopupBidpreApprover();
    //    jQuery.unblockUI();
    //}
    jQuery.unblockUI();

}

var appbtnTypeSubmit = "keepsame";
function fncheckbtntext(btnid) {

    if ($('#' + btnid.id).text().toLowerCase() != "keep same") {
        appbtnTypeSubmit = "submitpreapproval"
    }
}
function MapBidapprover() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var approvers = '';
    if (appbtnTypeSubmit == "keepsame") {
        var rowCount = jQuery('#tblpreBidapprovers1 tr').length;
        if (rowCount > 1) {
            $("#tblpreBidapprovers1 tr:gt(0)").each(function () {
                var this_row = $(this);
                approvers = approvers + $.trim(this_row.find('td:eq(2)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';

            })
        }
    }
    else {
        var rowCount = jQuery('#tblpreBidapprovers tr').length;
        if (rowCount > 1) {
            $("#tblpreBidapprovers tr:gt(0)").each(function () {
                var this_row = $(this);
                approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';

            })
        }
    }

    var Approvers = {
        "BidID": parseInt(BidID),
        "QueryBidApprovers": approvers,
        "CreatedBy": sessionStorage.getItem('UserID'),
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "BidTypeID": 6,
    }
    // alert(JSON.stringify(Approvers))
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/AddBidpreApprover",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Approvers),
        dataType: "json",
        success: function (data) {

            $('#successapp').show();
            $('#spansuccessapp').html('Bid submitted for pre-approval.');
            Metronic.scrollTo($('#successapp'), -200);
            $('#successapp').fadeOut(7000);
            bootbox.alert("Bid submitted for pre-approval.", function () {
                sessionStorage.removeItem('CurrentBidID');
                window.location = sessionStorage.getItem("HomePage")
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
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }
    });
}
function fnOpenPopupBidpreApprover() {
    $('#addapprovers').modal('show');
    $('#frmapproverbodymsz').removeClass('hide')
}
function fnyeschangeapprovers() {
    $('#frmapproverbodymsz').addClass('hide')
    $('#frmapproverbody').removeClass('hide')
}
$('#addapprovers').on("hidden.bs.modal", function () {
    $('#frmapproverbodymsz').removeClass('hide')
    $('#frmapproverbody').addClass('hide')
    $('#txtpreApproverBid').val('')
    sessionStorage.setItem('hdnpreApproverid', '0');
    fetchFrenchBidDetails();
})
function fnclosepopupApprovers() {
    $('#addapprovers').modal('hide');
}

function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + sessionStorage.getItem('CurrentBidID'));
}
$("#txtbidDate").change(function () {

    if ($("#txtbidDate").val() == '') { }

    else {

        $("#txtbidDate").closest('.inputgroup').removeClass('has-error');
        $("#txtbidDate").closest('.inputgroup').find('span').hide();
        $("#txtbidDate").closest('.inputgroup').find('span.input-group-btn').show();
        $("#txtbidDate").closest('.inputgroup').find("#btncal").css("margin-top", "0px");

    }

});


function InsUpdProductSevices() {
    //jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />Please Wait...</h5>' });
    if (form.valid() == true) {
        var st = "true"
        var i = 0;
        if ($('#add_or').text() == "Modify") {
            st = "true"
            $("#tblServicesProduct tr:gt(0)").each(function () {
                var this_row = $(this);
                i = (this_row.closest('tr').attr('id')).substring(4);
               // if ($.trim($('#itemname' + i).html()) == $('#txtshortname').val() && $.trim($('#TP' + i).html()) != $('#txttargetprice').val() && $.trim($('#quan' + i).html()) != $("#txtquantitiy").val() && $.trim($('#uom' + i).html()) != $("#txtUOM").val() && $.trim($('#BSP' + i).html()) != $('#txtCeilingPrice').val() && $.trim($('#maskvendor' + i).html()) != $('#checkmaskvendor option:selected').val() && $.trim($('#mininc' + i).html()) != $('#txtminimumdecreament').val() && $.trim($('#inconval' + i).html()) != $('#drpdecreamenton option:selected').val() && $.trim($('#LIP' + i).html()) != $('#txtlastinvoiceprice').val()) {
                if ($.trim($('#itemname' + i).html()) == $.trim($('#txtshortname').val())) {
                    st = "false"
                }
                //i++;
            });

            if ($('#dropuom').val() == '') {
                $('.alert-danger').show();
                $('#spandanger').html('Please Select UOM Properly');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                jQuery.unblockUI();
                return false;
            }
            else if (st == "false") {
                error.show();
                $('#spandanger').html('Data already exists...');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
            }
            else if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
                error.show();
                $('#spandanger').html('Minimum Increment should be less than Bid start price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                return false;

            }

            else if ((parseInt($('#txtminimumdecreament').val()) > parseInt(20) && $("#drpdecreamenton option:selected").val() == "P")) {
                error.show();
                $('#spandanger').html('Minimum Increment should be less than 20%.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                return false;
            }
            else if (parseInt($('#txtminimumdecreament').val()) > parseFloat(20 * (removeThousandSeperator($('#txtCeilingPrice').val())) / 100) && $("#drpdecreamenton option:selected").val() == "A") {
                error.show();
                $('#spandanger').html('Minimum Increment should be less than 20% of Bid Start Price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                return false;
            }

            else {
                //Set data on main Table after edit
                //var Description = $('#txtdescription').val().replace(/\n/g, '<br />').replace(/'/g, " ")
                //var remarks = $('#txtbiddescriptionP').val().replace(/\n/g, '<br />').replace(/'/g, " ")
                var this_row = $('#rowid').val();


                $("#itemcode" + this_row).text($('#txtItemCode').val())
                $("#itemname" + this_row).text($('#txtshortname').val())
                $("#TP" + this_row).text(thousands_separators($('#txttargetprice').val()))
                $("#quantity" + this_row).text(thousands_separators($('#txtquantitiy').val()))

                $("#minquantity" + this_row).text(thousands_separators($('#txtminquantitiy').val()))
                $("#maxquantity" + this_row).text(thousands_separators($('#txtmaxquantitiy').val()))
                $("#UOM" + this_row).text($('#dropuom').val())
                $("#BSP" + this_row).text(thousands_separators($('#txtCeilingPrice').val()))
                $("#mininc" + this_row).text(thousands_separators($('#txtminimumdecreament').val()))

                if ($('#drpdecreamenton option:selected').val() == 'A') {
                    $("#incon" + this_row).text('Amount');
                    $("#inconprev" + this_row).text('Amount')

                } else {
                    $("#inconval" + this_row).text('Percentage');
                    $("#inconvalprev" + this_row).text('Percentage')
                }
                //checkmask vendor change
                $("#maskvendor" + this_row).text(jQuery("#checkmaskvendor option:selected").val())
                $("#inconval" + this_row).text($("#drpdecreamenton option:selected").val())
                $("#LIP" + this_row).text(thousands_separators(removeThousandSeperator($("#txtlastinvoiceprice").val())))
                $("#showhl" + this_row).text($("#showhlprice").val())
                $("#showstart" + this_row).text($("#showstartprice").val())



                //For Preview Table
                $("#itemcodeprev" + this_row).find("td:eq(0)").text($('#txtItemCode').val())
                $("#itemnameprev" + this_row).find("td:eq(0)").text($('#txtshortname').val())
                $("#TPprev" + this_row).text($('#txttargetprice').val())
                $("#quantityprev" + this_row).text(thousands_separators($('#txtquantitiy').val()))
                $("#UOMprev" + this_row).text($('#dropuom').val())
                $("#BSPprev" + this_row).text(thousands_separators($('#txtCeilingPrice').val()))
                $("#minincprev" + this_row).text(thousands_separators($('#txtminimumdecreament').val()))
                $("#maskvendorprev" + this_row).text(jQuery("#checkmaskvendor option:selected").val())
                $("#inconvalprev" + this_row).text($("#drpdecreamenton option:selected").val())
                $("#LIPprev" + this_row).find("td:eq(10)").text(thousands_separators(removeThousandSeperator($("#txtlastinvoiceprice").val())))
                $("#showhlprev" + this_row).find("td:eq(15)").text($("#showhlprice").val())
                $("#showstartprev" + this_row).find("td:eq(16)").text(($("#showstartprice").val()))
                resetfun();
            }

        }

        else {
            st = "true"; 

            if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
                error.show();
                $('#spandanger').html('Minimum increment should be less than Bid start price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                return false;

            }
            else if ((parseInt($('#txtminimumdecreament').val()) > parseInt(20) && $("#drpdecreamenton option:selected").val() == "P")) {
                error.show();
                $('#spandanger').html('Minimum Increament should be less than 20%.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                return false;

            }
            else if (parseInt($('#txtminimumdecreament').val()) > parseFloat(20 * (removeThousandSeperator($('#txtCeilingPrice').val())) / 100) && $("#drpdecreamenton option:selected").val() == "A") {
                error.show();
                $('#spandanger').html('Minimum Increament should be less than 20% of Bid Start Price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                return false;
            }
            else if ($('#dropuom').val() == '') {
                $('.alert-danger').show();
                $('#spandanger').html('Please Select UOM Properly');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                jQuery.unblockUI();
                return false;
            }
            else {
                if ($('#tblServicesProduct >tbody >tr').length == 0) {
                    ParametersQuery()
                }
                else {
                    $("#tblServicesProduct tr:gt(0)").each(function () {
                        
                        var this_row = $(this);
                        i = (this_row.closest('tr').attr('id')).substring(4);
                        if ($.trim($('#itemname' + i).html()) == $.trim($('#txtshortname').val())) {
                            st = "false"
                        }
                        //i++;
                    });
                    if (st == "false") {
                        error.show();
                        $('#spandanger').html('Data already exists...');
                        Metronic.scrollTo(error, -200);
                        error.fadeOut(3000);
                        jQuery.unblockUI();
                        // resetfun();
                        return false;
                    }
                    else {
                        ParametersQuery()
                    }

                }
            }

        }
        //jQuery.unblockUI();
    }
    else {
        form.validate()
        jQuery.unblockUI();
        return false;
    }
}



var PriceDetails = [];
var rowAppItems = 0, rowAppItemsrno = 0;

function ParametersQuery() {
    if (jQuery("#tblServicesProduct >tbody >tr ").length >= 1) {
        $('#spandanger').html('You can not add more than one item for French Auction.');
        //$(".alert-danger").find("span").html('').html('You can not add more than one item for Dutch Auction.')
        Metronic.scrollTo(error, -200);
        $(".alert-danger").show();
        $(".alert-danger").fadeOut(5000);
        resetfun();
        return false;
    } else {
        var num = 0, i = 0;
        var maxinum = -1;
        $("#tblServicesProduct tr:gt(0)").each(function () {
            var this_row = $(this);

           num = (this_row.closest('tr').attr('id')).substring(4, (this_row.closest('tr').attr('id')).length)
            if (parseInt(num) > parseInt(maxinum)) {
                maxinum = num;
            }
        });

        i = parseInt(maxinum) + 1;
        var status = "";
        var status = $('#checkmaskvendor option:selected').val();
        // var ShowHlPrice = $('#showhlprice option:selected').val();
        //var ShowStartPrice = $('#showstartprice option:selected').val();

        if ($("#txttargetprice").val() == null || $("#txttargetprice").val() == '') {
            $("#txttargetprice").val('0')
        }
        if ($("#txtlastinvoiceprice").val() == null || $("#txtlastinvoiceprice").val() == '') {
            $("#txtlastinvoiceprice").val('0')
        }
        if (!jQuery("#tblServicesProduct thead").length) {

            jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>S No</th><th>Item Code</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>Min.Offered Quantity</th><th>Max.Offered Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th>Last Invoice Price</th><th>Show H1 price</th><th>Show Start price</th></tr></thead>");
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><button type="button" class="btn btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + (rowAppItemsrno + 1) + '</td><td id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=itemname' + i + ' >' + $('#txtshortname').val() + '</td><td id=TP' + i + ' >' + $('#txttargetprice').val() + '</td><td id=quantity' + i + ' >' + $('#txtquantitiy').val() + '</td><td id=minquantity' + i + ' >' + $('#txtminquantitiy').val() + '</td><td id=maxquantity' + i + '>' + $('#txtmaxquantitiy').val() + '</td><td id=UOM' + i + '>' + $('#dropuom').val() + '</td><td id=BSP' + i + '>' + $('#txtCeilingPrice').val() + '</td><td id=maskvendor' + i + '>' + status + '</td><td id=mininc' + i + '>' + $('#txtminimumdecreament').val() + '</td><td id=incon' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconval' + i + '>' + $("#drpdecreamenton").val() + '</td><td id=LIP' + i + '>' + $("#txtlastinvoiceprice").val() + '</td><td id=showhl' + i + '>' + $('#showhlprice').val() + '</td><td id=showstart' + i + '>' + $('#showstartprice').val() + '</td></tr>');
        }
        else {
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><button type="button" class="btn  btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + (rowAppItemsrno + 1) + '</td><td id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=itemname' + i + ' >' + $('#txtshortname').val() + '</td><td id=TP' + i + ' >' + $('#txttargetprice').val() + '</td><td id=quantity' + i + ' >' + $('#txtquantitiy').val() + '</td><td id=minquantity' + i + ' >' + $('#txtminquantitiy').val() + '</td><td id=maxquantity' + i + '>' + $('#txtmaxquantitiy').val() + '</td><td id=UOM' + i + '>' + $('#dropuom').val() + '</td><td id=BSP' + i + ' >' + $('#txtCeilingPrice').val() + '</td><td id=maskvendor' + i + ' >' + status + '</td><td id=mininc' + i + ' >' + $('#txtminimumdecreament').val() + '</td><td id=incon' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconval' + i + '>' + $("#drpdecreamenton").val() + '</td><td id=LIP' + i + '>' + $("#txtlastinvoiceprice").val() + '</td><td id=showhl' + i + '>' + $('#showhlprice').val() + '</td><td id=showstart' + i + '>' + $('#showstartprice').val() + '</td></tr>');
        }
        $('#wrap_scroller').show();
        if (!jQuery("#tblServicesProductPrev thead").length) {
            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th>Item Code</th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>Min.Offered Quantity</th><th>Max.Offered Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th>Last Invoice Price</th><th>Show H1 price</th><th>Show Start price</th></tr></thead>");
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td id=itemcodeprev' + i + ' >' + $('#txtItemCode').val() + '</td><td id=itemnameprev' + i + '>' + $('#txtshortname').val() + '</td><td id=TPrev' + i + '>' + $('#txttargetprice').val() + '</td><td id=quantityprev' + i + '>' + $('#txtquantitiy').val() + '</td><td id=minquantityprev' + i + '>' + $('#txtminquantitiy').val() + '</td><td id=maxquantityprev' + i + '>' + $('#txtmaxquantitiy').val() + '</td><td id=UOMprev' + i + '>' + $('#dropuom').val() + '</td><td id=BSPprev' + i + '>' + $('#txtCeilingPrice').val() + '</td><td id=maskvendorprev' + i + '>' + status + '</td><td id=minincprev' + i + '>' + $('#txtminimumdecreament').val() + '</td><td id=inconprev' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td id=inconvalprev' + i + ' class=hide>' + $("#drpdecreamenton").val() + '</td><td id=LIPprev' + i + '>' + $("#txtlastinvoiceprice").val() + '</td><td id=showhlprev' + i + '>' + $('#showhlprice').val() + '</td><td id=showstartprev' + i + '>' + $('#showstartprice').val() + '</td></tr>');
        }
        else {
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td id=itemcodeprev' + i + ' >' + $('#txtItemCode').val() + '</td><td id=itemnameprev' + i + '>' + $('#txtshortname').val() + '</td><td id=TPprev' + i + '>' + $('#txttargetprice').val() + '</td><td id=quantityprev' + i + '>' + $('#txtquantitiy').val() + '</td><td id=minquantityprev' + i + '>' + $('#txtminquantitiy').val() + '</td><td id=maxquantityprev' + i + '>' + $('#txtmaxquantitiy').val() + '</td><td id=UOMprev' + i + '>' + $('#dropuom').val() + '</td><td id=BSPprev' + i + '>' + $('#txtCeilingPrice').val() + '</td><td id=maskvendorprev' + i + '>' + status + '</td><td id=minincprev' + i + '>' + $('#txtminimumdecreament').val() + '</td><td id=inconprev' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td id=inconvalprev' + i + ' class=hide>' + $("#drpdecreamenton").val() + '</td><td id=LIPprev' + i + '>' + $("#txtlastinvoiceprice").val() + '</td><td id=showhlprev' + i + '>' + $('#showhlprice').val() + '</td><td id=showstartprev' + i + '>' + $('#showstartprice').val() + '</td></tr>');
        }
        $('#wrap_scrollerPrev').show();
        rowAppItems = rowAppItems + 1;
        rowAppItemsrno = rowAppItemsrno + 1;
        resetfun()

    }
    jQuery.unblockUI();
}

function editvalues(icount) {
    //sessionStorage.setItem('ClickedEditID', icount.id)
    Metronic.scrollTo($("body"), 200);
    $('#rowid').val(icount)

    $('#txtItemCode').val($("#itemcode" + icount).text())
    $('#txtshortname').val($("#itemname" + icount).text())
    var tp = removeThousandSeperator($("#TP" + icount).text());
    $('#txttargetprice').val(thousands_Sep_Text(tp))

    var quan = $("#quantity" + icount).text();
    $('#txtquantitiy').val(quan)
    $('#dropuom').val($("#UOM" + icount).text())
    $('#txtUOM').val($("#UOM" + icount).text())

    $('#txtminquantitiy').val($("#minquantity" + icount).text())
    $('#txtmaxquantitiy').val($("#maxquantity" + icount).text())
    $('#txtCeilingPrice').val($("#BSP" + icount).text())
    $('#txtminimumdecreament').val($("#mininc" + icount).text())
    $('#drpdecreamenton').val($("#inconval" + icount).text())
    var ll = removeThousandSeperator($("#LIP" + icount).text());
    $('#txtlastinvoiceprice').val(thousands_Sep_Text(ll))
    $('#showhlprice').val($("#showhl" + icount).text())
    $('#showstartprice').val($("#showstart" + icount).text())
    $("#checkmaskvendor").val($("#maskvendor" + icount).text());
    $('#add_or').text('Modify');

}
function deleterow(rowid, rowidPrev) {
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();
    rowAppItems = rowAppItems - 1;
    var rowCount = jQuery('#tblServicesProduct tr').length;
    var i = 1;
    if (rowCount > 1) {
        $("#tblServicesProduct tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(0)').html(i));
            i++;
        });
        i = 1;
        $("#tblServicesProductPrev tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(0)').html(i));
            i++;
        });
    }
}
function resetfun() {
    $('#add_or').text('Add');
    $('#txtshortname').val('')
    $('#txtItemCode').val('')
    $('#txttargetprice').val('')
    $('#txtquantitiy').val('')
    $('#dropuom').val('')
    $('#txtUOM').val('')
    $('#txtedelivery').val('')
    $('#txtCeilingPrice').val('')
    $('#txtminimumdecreament').val('');
    $('#txtminquantitiy').val('')
    $('#txtmaxquantitiy').val('')
    $('#drpdecreamenton').val('A')
    $('#txtlastinvoiceprice').val('')
    jQuery('#checkmaskvendor').val('Y')
    jQuery('#showstartprice').val('Y')
    if ($('#ddlAuctiontype option:selected').val() == "83") {
        $('#showhlprice').val("Y").attr("disabled", true);
    }
    else {
        $('#showhlprice').val("N").attr("disabled", false);
    }

}
var allUOM = '';
function FetchUOM(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + CustomerID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#txtUOM").empty();
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
                fnErrorMessageText('spandanger', 'form_wizard_1');
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
function displayUOM() {
    jQuery('.lblUOM').css('text-align', 'left');
    jQuery('.lblUOM').text('');
    if (jQuery('#dropuom').val() != '' && jQuery('#dropCurrency').val() != '') {

        var uomcaption = jQuery('#dropCurrency option:selected').text() + '/' + jQuery('#dropuom').val()
        jQuery('.lblUOM').text(uomcaption)
    }
    else {
        jQuery('.lblUOM').text('')
    }
}

function fillselectedcurrency() {
    jQuery('.currencyparam').css('text-align', 'left');
    if (jQuery('#dropCurrency').val() != '') {

        var uomcaption = jQuery('#dropCurrency option:selected').text()
        jQuery('.currencyparam').text(uomcaption)
        jQuery('.lblUOM').text(uomcaption)
    }
    else {
        jQuery('.currencyparam').text('')
        jQuery('.lblUOM').text('')
    }
}

jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblvendorlist tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});
var _bidType;
function fetchFrenchBidDetails() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchFrenchConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + sessionStorage.getItem('CurrentBidID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var str = '';
            var strp = '';
            var dtst = (fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))

            sessionStorage.getItem("BidPreApp", BidData[0].bidDetails[0].bidpreapproval)
            jQuery('#txtBidSubject').val(BidData[0].bidDetails[0].bidSubject)

            jQuery('#txtbiddescription').val(BidData[0].bidDetails[0].bidDetails)
            //jQuery('#txtbidDate').val(BidData[0].bidDetails[0].bidDate)
            //jQuery('#txtbidTime').val(BidData[0].bidDetails[0].bidTime)
            jQuery('#txtbidDate').val(dtst)
            jQuery("#dropCurrency").val(BidData[0].bidDetails[0].currencyID).attr("selected", "selected");
            jQuery('#txtConversionRate').val(BidData[0].bidDetails[0].conversionRate)
            jQuery('#drpshowL1L2').val(BidData[0].bidDetails[0].showRankToVendor)
            $('#drphideVendor').val(BidData[0].bidDetails[0].hideVendor)
            jQuery('#txtBidExtension').val(BidData[0].bidDetails[0].noofBidExtension)
            jQuery('#ddlAuctiontype').val(BidData[0].bidDetails[0].bidForID)
            $("#cancelBidBtn").show();
            _bidType = BidData[0].bidDetails[0].bidForID;

            jQuery('#txtBidDuration').attr('disabled', false).val(BidData[0].bidDetails[0].bidDuration)
            jQuery('input[name="txtBidDuration"]').rules('add', {
                required: true,
                minlength: 1,
                maxlength: 3,
                number: true
            });
            if (BidData[0].bidDetails[0].bidForID == 81) {
                $('#showhlprice').attr('disabled', false).val("N");
            }
            else {
                $('#showhlprice').attr('disabled', true).val("Y");
            }
            if (BidData[0].bidDetails[0].termsConditions != '') {

                $('#file1').attr('disabled', true);
                $('#closebtn').removeClass('display-none');
                if (BidData[0].bidDetails[0].attachment != '') {
                    if (BidData[0].bidDetails[0].attachment != null) {
                        $('#file2').attr('disabled', true);
                        $('#closebtn2').removeClass('display-none');
                    }
                }
            }

            $('#filepthterms').html(BidData[0].bidDetails[0].termsConditions);
            $('#filepthattach').html(BidData[0].bidDetails[0].attachment);


            jQuery("#tblapprovers,#tblpreBidapprovers").empty();
            jQuery("#tblapproversPrev,#tblpreBidapprovers1").empty();
            $('#wrap_scrollerPrevApp').show();
            jQuery('#tblapprovers,#tblpreBidapprovers').append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery('#tblapproversPrev,#tblpreBidapprovers1').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            rowpreBidApp = 0;
            rowApp = 0;
            for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {
                rowApp = rowApp + 1;
                str = '<tr id=trAppid' + (i + 1) + '>';
                str += '<td><button type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(' + (i + 1) + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                str += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                str += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";

                str += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td>";
                str += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td></tr>";

                jQuery('#tblapprovers').append(str);

                //** Pre Approver
                str = '';
                //rowpreBidApp = rowpreBidApp + 1;
                str = '<tr id=trpreAppid' + (i + 1) + '>';
                str += '<td><button type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(' + (i + 1) + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
                str += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                str += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                str += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td>";
                str += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td></tr>";
                jQuery('#tblpreBidapprovers').append(str);

                strp = '';
                strp = '<tr id=trAppidPrev' + (i + 1) + '>';

                strp += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                strp += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td>";
                strp += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td></tr>";
                jQuery('#tblapproversPrev').append(strp);
                jQuery('#tblpreBidapprovers1').append(strp);

            }


            jQuery("#tblServicesProduct").empty();
            jQuery("#tblServicesProductPrev").empty();

            if (BidData[0].bidFrenchDetails.length > 0) {

                $('#wrap_scroller').show();
                $('#wrap_scrollerPrev').show();
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:150px !important;'></th><th>Item Code</th><th>Item/Name</th><th>Target Price</th><th>Quantity</th><th>Min. Offered Quantity</th><th>Max. Offered Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th>Item Code</th><th>Item/Name</th><th>Target Price</th><th>Quantity</th><th>Min. Offered Quantity</th><th>Max. Offered Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                for (var i = 0; i < BidData[0].bidFrenchDetails.length; i++) {

                    var decrementon = ''
                    if (BidData[0].bidFrenchDetails[i].increamentOn == 'A')
                        decrementon = 'Amount'
                    else
                        decrementon = 'Percentage'
                    jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (i + 1) + '</td><td style="width:150px !important;"><button class="btn  btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td id=itemcode' + i + '>' + BidData[0].bidFrenchDetails[i].itemCode + '</td><td id=itemname' + i + '>' + BidData[0].bidFrenchDetails[i].itemName + '</td><td id=TP' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].targetprice) + '</td><td id=quantity' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].quantity) + '</td><td id=minquantity' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].minOfferedQuantity) + '</td><td id=maxquantity' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].maxOfferedQuantity) + '</td><td id=UOM' + i + '>' + BidData[0].bidFrenchDetails[i].measurementUnit + '</td><td id=BSP' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].bidStartPrice) + '</td><td id=maskvendor' + i + '>' + BidData[0].bidFrenchDetails[i].maskVendor + '</td><td id=mininc' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].minimumIncreament) + '</td><td id=incon' + i + '>' + decrementon + '</td></td><td class=hide id=inconval' + i + '>' + BidData[0].bidFrenchDetails[i].increamentOn + '</td><td id=LIP' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].lastInvoicePrice) + '</td><td id=showhl' + i + '>' + BidData[0].bidFrenchDetails[i].showHLPrice + '</td><td id=showstart' + i + '>' + BidData[0].bidFrenchDetails[i].showStartPrice + '</td></tr>');
                    jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td id=itemcode' + i + '>' + BidData[0].bidFrenchDetails[i].itemCode + '</td><td id=itemnameprev' + i + '>' + BidData[0].bidFrenchDetails[i].itemName + '</td><td id=TPprev' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].targetprice) + '</td><td id=quantityprev' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].quantity) + '</td><td id=minquantityprev' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].minOfferedQuantity) + '</td><td id=maxquantityprev' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].maxOfferedQuantity) + '</td><td id=UOMprev' + i + '>' + BidData[0].bidFrenchDetails[i].measurementUnit + '</td><td id=BSPprev' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].bidStartPrice) + '</td><td id=maskvendorprev' + i + '>' + BidData[0].bidFrenchDetails[i].maskVendor + '</td><td id=minincprev' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].minimumIncreament) + '</td><td id=inconprev' + i + '>' + decrementon + '</td></td><td class=hide id=inconvalprev' + i + '>' + BidData[0].bidFrenchDetails[i].increamentOn + '</td><td id=LIPprev' + i + '>' + thousands_separators(BidData[0].bidFrenchDetails[i].lastInvoicePrice) + '</td><td id=showhlprev' + i + '>' + BidData[0].bidFrenchDetails[i].showHLPrice + '</td><td id=showstartprev' + i + '>' + BidData[0].bidFrenchDetails[i].showStartPrice + '</td></tr>');

                }
                rowAppItems = rowAppItems + 1;
                rowAppItemsrno = rowAppItemsrno + 1;
            }
            if (BidData[0].bidVendorDetails.length > 0) {

                for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                    vCount = vCount + 1;
                    jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + BidData[0].bidVendorDetails[i].vendorID + ',SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + ',' + BidData[0].bidVendorDetails[i].vendorID + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                    jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td></tr>')

                }

                jQuery('#selectedvendorlists').show()
                jQuery('#selectedvendorlistsPrev').show()

            }
           /* setTimeout(function () {
                if (sessionStorage.getItem("BidPreApp") == "N" || sessionStorage.getItem("BidPreApp") == undefined || sessionStorage.getItem("BidPreApp") == null) {
                    $('#btnsubmit').text("Submit")
                }
                else {
                    $('#btnsubmit').text("Submit for PreApproval")
                }
            }, 800);*/

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }

            return false;
            jQuery.unblockUI();
        }
    });

    setTimeout(function () {
        fetchPSBidDetailsForPreview()
    }, 2000);

}


//*** File delete from Blob or DB 
function ajaxFileDelete(closebtnid, fileid, filepath, deletionFor) {


    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var data = {
        "filename": $('#' + filepath).html(),
        "foldername": 'Bid/' + sessionStorage.getItem('CurrentBidID')

    }
    $.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/DeleteFiles/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            //** file delete from DB
            fileDeletefromdb(closebtnid, fileid, filepath, deletionFor);
        },

        error: function () {
            $(".alert-danger").find("span").html('').html($('#' + filepath).html() + " Couldn't deleted successfully on Azure");
            Metronic.scrollTo(error, -200);
            $(".alert-danger").show();
            $(".alert-danger").fadeOut(5000);
            jQuery.unblockUI();
        }

    });

}


function fileDeletefromdb(closebtnid, fileid, filepath, deletionFor) {
    $('#' + closebtnid).remove();
    $('#' + filepath).html('')
    $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
    $('#' + fileid).attr('disabled', false);
    var BidData = {

        "BidId": parseInt(sessionStorage.getItem('CurrentBidID')),
        "BidTypeID": 6,
        "UserId": sessionStorage.getItem('UserID'),
        "RFQRFIID": 0,
        "RFIRFQType": deletionFor
    }

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FileDeletion/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function (data) {
            if (data == '1') {
                $('#' + filepath).html('')
                $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
                $('#' + fileid).attr('disabled', false);
                $('#spansuccess1').html('File Deleted Successfully');
                success.show();
                Metronic.scrollTo(success, -200);
                success.fadeOut(5000);
                jQuery.unblockUI();
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;

        }

    });
}
function Dateandtimevalidate(indexNo) {
    var StartDT = new Date();
    if ($('#txtbidDate').val() != null && $('#txtbidDate').val() != "") {
        StartDT = new Date($('#txtbidDate').val().replace('-', ''));

    }
    var Tab1Data = {
        "BidDate": StartDT
    }
    //alert(JSON.stringify(Tab1Data));
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

            if (data == '1') {
                if (indexNo == 'index1') {

                    if ($("#txtBidDuration").val() == '0') {
                        $('#form_wizard_1').bootstrapWizard('previous');
                        $(".alert-danger").find("span").html('').html('Bid Duration can not be zero.')
                        Metronic.scrollTo(error, -200);
                        $(".alert-danger").show();
                        $(".alert-danger").fadeOut(5000);
                        jQuery.unblockUI();
                        return false;
                    }
                    else {
                        ConfigureBidInsfrenchTab1();

                    }
                    fetchPSBidDetailsForPreview();
                }

                else {

                    ConfigureFrenchVendorsave();
                }

            }
            else {
                if (indexNo == 'index1') {
                    bootbox.alert("Date and Time should not be less than current date and time.");
                    $('#form_wizard_1').bootstrapWizard('previous');
                    return false;
                }
                else {
                    bootbox.alert("Date and Time should not be less than current date and time.");
                    $('#form_wizard_1').bootstrapWizard('previous');
                    $('#form_wizard_1').bootstrapWizard('previous');
                    return false;

                }
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                bootbox.alert("you have some error.Please try agian.");
            }
            jQuery.unblockUI();
            return false;

        }

    });

}

// For Bid Preview

function fetchPSBidDetailsForPreview() {
    var TermsConditionFileName = '';
    var AttachementFileName = '';
    var hidevendor = 'No';
    jQuery('#mapedapproverPrev').html('');

    jQuery('#txtBidSubjectPrev').html($('#txtBidSubject').val())
    jQuery('#txtBidDurationPrev').html($('#txtBidDuration').val())
    $("#ddlauctiontypePrev").html($("#ddlAuctiontype option:selected").html())
    jQuery('#txtbiddescriptionPrev').html($('#txtbiddescription').val())
    jQuery('#txtbidDatePrev').html($('#txtbidDate').val())
    //jQuery('#txtbidTimePrev').html($('#txtbidTime').val())
    jQuery("#dropCurrencyPrev").html($('#dropCurrency option:selected').text())
    jQuery('#txtConversionRatePrev').html($('#txtConversionRate').val())
    jQuery('#noofextensionprev').text($('#txtBidExtension option:selected').text())
    if ($('#drphideVendor').val() == "Y") {
        hidevendor = "Yes";
    }
    jQuery('#hidevendorprev').html(hidevendor)
    $('#mapedapprover option').each(function () {
        jQuery('#mapedapproverPrev').append($(this).html() + '<br/>')
    });

    if ($('#filepthterms').html() != '' && ($('#file1').val() == '')) {
        $('#filepthtermsPrev').html($('#filepthterms').html());


    }
    else {
        TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);
        $('#filepthtermsPrev').html(TermsConditionFileName);

    }


    if (($('#filepthattach').html() != '') && ($('#file2').val() == '')) {
        $('#filepthattachPrev').html($('#filepthattach').html());

    } else {
        AttachementFileName = jQuery('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1);
        $('#filepthattachPrev').html(AttachementFileName);

    }




}

$('#back_prev_btn').click(function () {
    $('#BidPreviewDiv').hide();
    $('#form_wizard_1').show();
});

$("#divduration").hide();
function hideshowDuration() {

    $("#tblServicesProduct").empty();
    $("#tblServicesProductPrev").empty();
    if ($("#ddlAuctiontype option:selected").val() == 81) {
        $('#showhlprice').val('N')
        $('#showhlprice').attr('disabled', false);
    }
    else {
        $('#showhlprice').val('Y')
        $('#showhlprice').attr('disabled', true);
    }
}

var vendorsForAutoComplete;
function fetchVendorGroup(categoryFor, vendorId) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=" + categoryFor + "&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VendorID=" + vendorId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                vendorsForAutoComplete = data;

            }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                bootbox.alert("you have some error.Please try agian.");
            }

            return false;
            jQuery.unblockUI();
        }
    });
}
jQuery("#txtVendorGroup").keyup(function () {
    jQuery("#txtSearch").val('')
    jQuery("#tblvendorlist> tbody").empty();
    sessionStorage.setItem('hdnVendorID', '0');
});
jQuery("#txtVendorGroup").typeahead({
    source: function (query, process) {
        var data = vendorsForAutoComplete
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.categoryName] = username;
            usernames.push(username.categoryName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].categoryID != "0") {
            getCategoryWiseVendors(map[item].categoryID);
        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
jQuery("#txtSearch").keyup(function () {
    jQuery("#txtVendorGroup").val('')
    jQuery("#tblvendorlist> tbody").empty();
    sessionStorage.setItem('hdnVendorID', '0');

});
sessionStorage.setItem('hdnVendorID', 0);
jQuery("#txtSearch").typeahead({
    source: function (query, process) {
        var data = allvendorsforautocomplete;
        var vName = '';
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            vName = username.participantName + ' (' + username.companyEmail + ')'
            map[vName] = username;
            usernames.push(vName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].participantID != "0") {

            vName = map[item].participantName + '(' + map[item].companyEmail + ')';

            var str = "<tr id=vList" + map[item].participantID + "><td class='hide'>" + map[item].participantID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\" class=''><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + map[item].participantID + "'\)\"; id=\"chkvender" + map[item].participantID + "\" value=" + map[item].participantID + " style=\"cursor:pointer\" name=\"chkvender\" /></span></div></td><td> " + vName + " </td></tr>";
            jQuery('#tblvendorlist > tbody').append(str);

            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {
                    //** remove from main table if already selected in selected List
                    if (map[item].participantID == $(this).find("td:eq(0)").text()) {
                        $('#vList' + map[item].participantID).remove();

                    }
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")

                });
            }

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
function getCategoryWiseVendors(categoryID) {

    jQuery.ajax({

        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorCategoryWise/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&CategoryID=" + categoryID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#tblvendorlist > tbody").empty();
            var vName = '';
            for (var i = 0; i < data.length; i++) {
                vName = data[i].vendorName;
                var str = "<tr id=vList" + data[i].vendorID + " ><td class='hide'>" + data[i].vendorID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].vendorID + "'\)\"; id=\"chkvender" + data[i].vendorID + "\" value=" + data[i].vendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].vendorName + " </td></tr>";

                jQuery('#tblvendorlist > tbody').append(str);

            }

            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {

                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")

                });
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                bootbox.alert("you have some error.Please try agian.");
            }
            jQuery.unblockUI();
            return false;

        }

    });

}

function cloneBid() {
    var encrypdata = fnencrypt("bidTypeId=9")
    window.location = 'cloneBid.html?param=' + encrypdata;
}

