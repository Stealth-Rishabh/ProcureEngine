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
    Metronic.init();
    Layout.init();
    FormWizard.init();
    ComponentsPickers.init();
    setCommonData();
    fetchMenuItemsFromSession(1, 27);
    FetchCurrency('0');

    fetchRegisterUser('1');
    fetchBidType();// for serach vendor
    FetchUOM(sessionStorage.getItem("CustomerID"));
    BindNoExtensions('txtBidExtension');
   /* var _BidID;
    if (window.location.search) {
        var param = getUrlVars()["param"]
        var decryptedstring = fndecrypt(param);
        _BidID = getUrlVarsURL(decryptedstring)["BidID"];
    }
    var _savedDraft = '';
    if (_BidID == null) {
        sessionStorage.setItem('CurrentBidID', 0);
        sessionStorage.setItem('_savedDraft', 'N')
    }
    else {
        sessionStorage.setItem('CurrentBidID', _BidID)
        fetchScrapSalesBidDetails();
        sessionStorage.setItem('_savedDraft', 'Y')
    }*/
    setTimeout(function () {
        $('#dropCurrency').val(sessionStorage.getItem("DefaultCurrency"))
        $('#txtConversionRate').val(1);
        fnfillInstructionExcel();

    }, 2000);
    fetchParticipantsVender();// fetch all vendors for advance search
    fetchVendorGroup('M', 0); // used to fetch product category
});


document.getElementById('browseBtnExcelParameter').addEventListener('click', function () {
    document.getElementById('file-excelparameter').click();
});
$("#cancelBidBtn").hide();
$('#file-excelparameter').change(handleFileparameter);
$('#spinner4').spinner({ value: 1, step: 1, min: 1, max: 10 });


$('#txtBidSubject,#txtshortname,#txtConversionRate,.maxlength').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});

jQuery("#txtApprover").keyup(function () {
    sessionStorage.setItem('hdnApproverid', '0');

});
var _BidID;
var _savedDraft = '';
sessionStorage.setItem('_savedDraft', 'N')
if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param);
    _BidID = getUrlVarsURL(decryptedstring)["BidID"];

    if (_BidID == null) {
        sessionStorage.setItem('CurrentBidID', 0);
        _BidID = 0
    }
    else {
        sessionStorage.setItem('CurrentBidID', _BidID)
        fetchScrapSalesBidDetails();
        sessionStorage.setItem('_savedDraft', 'Y')
    }
}


function cancelbid() {
    CancelBidDuringConfig(_BidID, 'BID');
}
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
            jQuery("#tblapprovers").append('<tr id=trAppid' + rownum + '><td><a class="btn  btn-xs btn-danger" onclick="deleteApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblapprovers").append('<tr id=trAppid' + rownum + '><td><a class="btn  btn-xs btn-danger" onclick="deleteApprow(' + rownum + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
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
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rownumprebid + '><td><a class="btn  btn-xs btn-danger" onclick="deletepreApprow(' + rownumprebid + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rownumprebid + '><td><a class="btn  btn-xs btn-danger" onclick="deletepreApprow(' + rownumprebid + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
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
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rownumprebid + '><td><a class="btn  btn-xs btn-danger" onclick="deletepreApprow(' + rownumprebid + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rownumprebid + '><td><a class="btn  btn-xs btn-danger" onclick="deletepreApprow(' + rownumprebid + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        var rowcountPre = jQuery('#tblpreBidapprovers >tbody>tr').length;
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
    if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {
        
        if ($("#selectedvendorlists> tbody > tr").length < 2) {
            status == "false";
        }
        else {
            status = "True";
        }
    }
    else {
        
        if ($("#selectedvendorlists> tbody > tr").length < 1) {
            status == "false";
        }
        else {
            status = "True";
        }

    }

    if (status == "false") {

        $('.alert-danger').show();
        if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {
            $('#spandanger').html('Please select atleast two vendors');
        }
        else {
            $('#spandanger').html('Please select atleast one vendors');
        }
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
    var url = sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser";
    jQuery.ajax({
        //type: "GET",
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
            debugger;
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
    //allUsers = RegisterUser_fetchRegisterUser(data);

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
                    txtBidExtension: {
                        //required: true,
                        number: true
                    },

                    //Second Tab
                    txtshortname: {
                        required: true
                    },
                    txtquantitiy: {
                        required: true,
                        number: true,
                        notEqualTo: 0
                    },
                    txtUOM: {
                        required: true
                    },

                    txtCeilingPrice: {
                        required: true,
                        number: true,
                        notEqualTo: 0
                    },

                    txtminimumdecreament: {
                        required: true,
                        number: true
                    },
                    drpdecreamenton: {
                        required: true
                    },
                    txttargetprice: {
                        number: true,
                        maxlength: 10
                    },
                    txtlastinvoiceprice: {
                        number: true,
                        maxlength: 10
                    },
                    txtStartingPrice: {
                        required: true,
                        number: true,
                        notEqualTo: 0

                    },
                    txtPriceReductionAmount: {
                        required: true,
                        number: true,
                        notEqualTo: 0
                    },
                    txtPriceReductionFrequency: {
                        required: true,
                        number: true,
                        notEqualTo: 0
                    },

                },

                messages: {

                    'payment[]': {

                        required: "Please select at least one option",

                        minlength: jQuery.validator.format("Please select at least one option")

                    }

                },

                errorPlacement: function (error, element) {

                    if (element.attr("name") == "gender") {

                        error.insertAfter("#form_gender_error");

                    } else if (element.attr("name") == "payment[]") {

                        error.insertAfter("#form_payment_error");

                    } else {

                        error.insertAfter(element);

                    }



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

                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {

                        label

                            .closest('.inputgroup').removeClass('has-error').addClass('has-success');

                        label.remove();

                    } else {

                        label

                            .addClass('valid') // mark the current input as valid and display OK icon
                            .closest('.inputgroup,.xyz').removeClass('has-error').addClass('has-success'); // set success class to the control group

                    }

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
            /* var formApprover = $('#frmApprover');
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
 
             });*/

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
                            ConfigureBidInsPefaTab2()
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
function ConfigureBidInsPefaTab1() {

    var _cleanString = StringEncodingMechanism(jQuery("#txtBidSubject").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtbiddescription").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';
    var AttachementFileName = '';

    if ($("#ddlAuctiontype option:selected").val() == 81) {
        $(".hdnfielddutch").attr('disabled', false);
        _bidType = $("#ddlAuctiontype option:selected").val();
    }

    else if ($("#ddlAuctiontype option:selected").val() == 82) {
        $(".hdnfielddutch").attr('disabled', true);
        _bidType = $("#ddlAuctiontype option:selected").val();
    }
    else {
        $(".hdnfielddutch").attr('disabled', false);
        _bidType = $("#ddlAuctiontype option:selected").val();
    }

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



    if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {
        bidDuration = $("#txtBidDuration").val();
    } else {
        bidDuration = $("#txtBidDuration").val();
    }

    var approvers = '';
    var rowCount = jQuery('#tblapprovers >tbody>tr').length;
    if (rowCount >= 1) {
        $("#tblapprovers tr:gt(0)").each(function () {

            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';

        })
    }
    var StartDT = new Date();
    if ($('#txtbidDate').val() != null && $('#txtbidDate').val() != "") {
        StartDT = new Date($('#txtbidDate').val().replace('-', ''));
    }
   
   
    var Tab1Data = {

        "BidId": parseInt(sessionStorage.getItem('CurrentBidID')),
        "BidTypeID": 6,
        "ContinentId": 0,
        "CountryID": 0,//jQuery("#ddlCountry option:selected").val(),
        "BidForID": parseInt($("#ddlAuctiontype option:selected").val()),
        "BidDuration": parseInt(bidDuration),
        //"BidSubject": jQuery("#txtBidSubject").val(),
        "BidSubject": _cleanString,
        //"BidDescription": jQuery("#txtbiddescription").val(),
        "BidDescription": _cleanString2,
        "BidDate": StartDT,
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

    //  alert(JSON.stringify(Tab1Data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsPefaTab1/",
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
                if ($("#ddlAuctiontype option:selected").val() == '81' || $("#ddlAuctiontype option:selected").val() == '83') {
                    $(".for-englishbid").show();
                    $(".for-dutch-bid").hide();
                    $("#lblCeilingPrice").html('').html('Bid Start Price <span class="required"> *</span>');
                    $('#lblshowprice').text('Show H1 Price')
                    $('#lblshowprice').removeClass('hide');
                    $('#divshowprice').removeClass('hide');
                    $('#lblshowstartprice').removeClass('hide');
                    $('#divshowstartprice').removeClass('hide');

                } else if ($("#ddlAuctiontype option:selected").val() == '82') {
                    $(".for-englishbid").hide();
                    $(".for-dutch-bid").show();
                    $("#lblCeilingPrice").html('').html('Ceiling/ Max. Price <span class="required"> *</span>');
                    $('#lblshowprice').text('Show L1 Price')
                    $('#lblshowprice').addClass('hide');
                    $('#divshowprice').addClass('hide');
                    $('#lblshowstartprice').addClass('hide');
                    $('#divshowstartprice').addClass('hide');
                    // $("#lbllastSalePrice").html('').html('Last Purchase Price');
                }

            }
            else {
                sessionStorage.setItem('CurrentBidID', parseInt(data))
                if ($("#ddlAuctiontype option:selected").val() == '81' || $("#ddlAuctiontype option:selected").val() == '83') {
                    $(".for-englishbid").show();
                    $(".for-dutch-bid").hide();
                    $("#lblCeilingPrice").html('').html('Bid Start Price <span class="required"> *</span>');
                    $('#lblshowprice').text('Show H1 Price')
                    $('#lblshowprice').removeClass('hide');
                    $('#divshowprice').removeClass('hide');
                    $('#lblshowstartprice').removeClass('hide');
                    $('#divshowstartprice').removeClass('hide');

                    // $("#lbllastSalePrice").html('').html('Last Sale Price');
                } else {
                    $(".for-englishbid").hide();
                    $(".for-dutch-bid").show();
                    $("#lblCeilingPrice").html('').html('Ceiling/ Max. Price <sptan class="required"> *</span>');
                    $('#lblshowprice').text('Show L1 Price')
                    $('#lblshowprice').addClass('hide');
                    $('#divshowprice').addClass('hide');
                    $('#lblshowstartprice').addClass('hide');
                    $('#divshowstartprice').addClass('hide');
                    // $("#lbllastSalePrice").html('').html('Last Purchase Price');
                }
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

function ConfigureBidInsPefaTab2() {

    
    
    var targetPrice;
    var lastInvoiceprice = 0;
    var mininc = 0; i = 0;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var tab2Items = '', PriceDetails = [];

    var rowCount = jQuery('#tblServicesProduct >tbody>tr').length;
    if (rowCount >= 1) {
        if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {

            $("#tblServicesProduct tr:gt(0)").each(function () {
                var this_row = $(this);
                i = (this_row.closest('tr').attr('id')).substring(4, (this_row.closest('tr').attr('id')).length)

                targetPrice = 0
                var t = 'A';
                if ($.trim($('#incontext' + i).text()).toLowerCase() == "percentage") {
                    t = 'P'
                }
                if ($.trim($('#TP' + i).text()) != '') {
                    targetPrice = removeThousandSeperator($.trim($('#TP' + i).text()));
                }
                if ($.trim($('#LIPrice' + i).text()) != '') {
                    lastInvoiceprice = removeThousandSeperator($.trim($('#LIPrice' + i).text()));
                }

                var _cleanString3 = StringEncodingMechanism($.trim($('#shortname' + i).html()));


                tab2Items = {
                    "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
                    //"ItemName": $.trim($('#shortname' + i).html()),
                    "ItemName": _cleanString3,
                    "Targetprice": parseFloat(removeThousandSeperator(targetPrice)),
                    "Quantity": parseFloat(removeThousandSeperator($('#quantity' + i).text())),
                    "MeasurementUnit": $.trim($('#dropuom' + i).text()),
                    "LastSalePrice": parseFloat(lastInvoiceprice),
                    "CeilingPrice": parseFloat(removeThousandSeperator($.trim($('#CP' + i).text()))),
                    "MaskVendor": $.trim($('#maskvendor' + i).text()),
                    "MinimumIncreament": parseFloat(removeThousandSeperator($.trim($('#minincrement' + i).text()))),
                    "IncreamentOn": t,
                    "ShowHLPrice": $.trim($('#showhlprice' + i).text()),
                    "ShowStartPrice": $.trim($('#showstartprice' + i).text()),
                    "StartingPrice": 0,
                    "PriceReductionAmount": 0,
                    "PriceReductionFrequency": 0
                }
                PriceDetails.push(tab2Items);
            });

        }
        else {
            if ($("#txtBidDuration").val() != '0') {
                _BidDuration = $("#txtBidDuration").val();
            }
            $("#tblServicesProduct tr:gt(0)").each(function () {
                var this_row = $(this);
                i = (this_row.closest('tr').attr('id')).substring(4, (this_row.closest('tr').attr('id')).length)
                var t = 'A';
                if ($.trim($('#incontext' + i).text()).toLowerCase() == "percentage") {
                    t = 'P'
                }
                if ($.trim($('#TP' + i).text()) != '') {
                    targetPrice = removeThousandSeperator($.trim($('#TP' + i).text()));
                }
                if ($.trim($('#LIPrice' + i).text()) != '') {
                    lastInvoiceprice = removeThousandSeperator($.trim($('#LIPrice' + i).text()));
                }
                if ($.trim($('#minincrement' + i).text()) != '') {
                    mininc = $.trim($('#minincrement' + i).text())
                }

                var _cleanString4 = StringEncodingMechanism($.trim($('#shortname' + i).html()));
                tab2Items = {
                    "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
                    //"ItemName": $.trim($('#shortname' + i).html()),
                    "ItemName": _cleanString4,
                    "Targetprice": parseFloat(removeThousandSeperator(targetPrice)),
                    "Quantity": parseFloat(removeThousandSeperator($('#quantity' + i).text())),
                    "MeasurementUnit": $.trim($('#dropuom' + i).text()),
                    "LastSalePrice": parseFloat(lastInvoiceprice),
                    "CeilingPrice": parseFloat(removeThousandSeperator($.trim($('#CP' + i).text()))),
                    "MaskVendor": $.trim($('#maskvendor' + i).text()),
                    "MinimumIncreament": parseFloat(removeThousandSeperator(mininc)),
                    "IncreamentOn": t,
                    "ShowHLPrice": $.trim($('#showhlprice' + i).text()),
                    "ShowStartPrice": $.trim($('#showstartprice' + i).text()),
                    "StartingPrice": parseFloat(removeThousandSeperator($.trim($('#starttingprice' + i).text()))),
                    "PriceReductionAmount": parseFloat(removeThousandSeperator($.trim($('#pricereductionamount' + i).text()))),
                    "PriceReductionFrequency": parseFloat(removeThousandSeperator($.trim($('#pricereductionfrequency' + i).text()))),
                }
                PriceDetails.push(tab2Items);
            });
        }
    }


    var Tab2data = {
        "ProductDetails": PriceDetails,
        "bidID": parseInt(sessionStorage.getItem('CurrentBidID')),
        "UserId": sessionStorage.getItem('UserID'),
        "BidDuration": _BidDuration == 0 ? 0 : parseInt(_BidDuration)

    };
    //console.log(PriceDetails)
    //alert(JSON.stringify(Tab2data))
    console.log(JSON.stringify(Tab2data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsPefaTab2/",
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
function ConfigurePEFAVendorsave() {
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
                if (sessionStorage.getItem("BidPreApp") == "N" || sessionStorage.getItem("BidPreApp") == undefined || sessionStorage.getItem("BidPreApp") == null) {
                    $('#btnsubmit').text("Submit")
                }
                else {
                    $('#btnsubmit').text("Submit for PreApproval")
                }
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
function ConfigureBidInsPefaTab3() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });


    var bidDuration = '0';
    if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {

        bidDuration = $("#txtBidDuration").val();
    } else {
        bidDuration = $("#txtBidDuration").val();
    }
    if (bidDuration == '0') {
        //$('#form_wizard_1').bootstrapWizard('previous');
        $(".alert-danger").find("span").html('').html("The Event Duration can not be '0'. Please check your bid again. ")
        Metronic.scrollTo(error, -200);
        $(".alert-danger").show();
        $(".alert-danger").fadeOut(5000);
        jQuery.unblockUI();
        return false;
    }
    else {
        if (sessionStorage.getItem("BidPreApp") == "N") {
            var Tab3data = {

                "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
                "UserID": sessionStorage.getItem('UserID'),
                "BidTypeID": 6,
                "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
            };
            //alert(JSON.stringify(Tab3data))

            jQuery.ajax({

                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsPefaTab3/",
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
        else {
            fnOpenPopupBidpreApprover();
            jQuery.unblockUI();
        }
        jQuery.unblockUI();

    }
}

var appbtnTypeSubmit = "keepsame";

function fncheckbtntext(btnid) {

    if ($('#' + btnid.id).text().toLowerCase() != "keep same") {
        appbtnTypeSubmit = "submitpreapproval"
    }
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
        "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
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
    fetchSeaExportDetails();
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
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />Please Wait...</h5>' });
    if (form.valid() == true) {
        var st = "true"
        var i = 0;
        if ($('#add_or').text() == "Modify") {
            st = "true"
            $("#tblServicesProduct tr:gt(0)").each(function () {
                var this_row = $(this);
                i = (this_row.closest('tr').attr('id')).substring(4, (this_row.closest('tr').attr('id')).length)
                if ($.trim($('#shortname' + i).text()) == $.trim($('#txtshortname').val()) && $.trim($('#TP' + i).html()) != $('#txttargetprice').val() && $.trim($('#quantity' + i).html()) != $('#txtquantitiy').val() && $.trim($('#dropuom' + i).html()) != $("#dropuom option:selected").text() && $.trim($('#CP' + i).html()) != $('#txtCeilingPrice').val() && $.trim($('#minincrement' + i).html()) != $('#txtminimumdecreament').val() && $.trim($('#inconval' + i).html()) != $("#drpdecreamenton option:selected").text() && $.trim($('#LIP' + i).html()) != $("#txtlastinvoiceprice").val()) {
                    //if ($.trim($('#shortname' + i).text()) == $.trim($('#txtshortname').val())) {
                    st = "false";

                }

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
                return false;
            }
            else if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
                error.show();
                $('#spandanger').html('Minimum Increment should be less than Bid start price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ($('#txtStartingPrice').is(':visible') && (parseInt(removeThousandSeperator($('#txtStartingPrice').val())) + parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val()))) >= parseInt(removeThousandSeperator($('#txtCeilingPrice').val())) && $("#ddlAuctiontype option:selected").val() == 82) {
                error.show();
                $('#spandanger').html('Ceiling Max Price should not be less than Bid start price + Price Reduction amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ((parseInt($('#txtminimumdecreament').val()) > parseInt(20) && $("#drpdecreamenton option:selected").val() == "P")) {
                error.show();
                $('#spandanger').html('Minimum Increment should be less than 20%.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if (parseInt($('#txtminimumdecreament').val()) > parseFloat(20 * (removeThousandSeperator($('#txtCeilingPrice').val())) / 100) && $("#drpdecreamenton option:selected").val() == "A") {
                error.show();
                $('#spandanger').html('Minimum Increment should be less than 20% of Bid Start Price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;
            }
            else {
                //Set data on main Table after edit
                var this_row = $('#rowid').val();
                // var this_row_Prev = $('#rowidPrev').val();

                $("#shortname" + this_row).text($('#txtshortname').val())
                $("#targetprice" + this_row).text(thousands_separators($('#txttargetprice').val()))
                $("#quantity" + this_row).text(thousands_separators($('#txtquantitiy').val()))
                $("#dropuom" + this_row).text($('#dropuom').val())
                $("#CP" + this_row).text(thousands_separators($('#txtCeilingPrice').val()))
                $("#minincrement" + this_row).text(thousands_separators($('#txtminimumdecreament').val()))
                $("#inconval" + this_row).text($('#drpdecreamenton option:selected').val())
                $("#incontext" + this_row).text($('#drpdecreamenton option:selected').text())
                $("#maskvendor" + this_row).text(jQuery("#checkmaskvendor option:selected").val())
                $("#LIPrice" + this_row).text(thousands_separators(removeThousandSeperator($("#txtlastinvoiceprice").val())))
                $("#pricereductionfrequency" + this_row).text($("#txtPriceReductionFrequency").val())
                $("#pricereductionamount" + this_row).text(thousands_separators($("#txtPriceReductionAmount").val()))
                $("#showhlprice" + this_row).text($("#showhlprice").val())
                $("#showstartprice" + this_row).text($("#showstartprice").val())
                $("#starttingprice" + this_row).text(thousands_separators($("#txtStartingPrice").val()))

                //if ($('#drpdecreamenton option:selected').val() == 'A') {
                //    $("#" + this_row).find("td:eq(8)").text('Amount');
                //    $("#" + this_row_Prev).find("td:eq(7)").text('Amount')

                //} else {
                //    $("#" + this_row).find("td:eq(8)").text('Percentage');
                //    $("#" + this_row_Prev).find("td:eq(7)").text('Percentage')
                //}

                //checkmask vendor change

                // $("#" + this_row).find("td:eq(10)").text($("#drpdecreamenton option:selected").val())
                //if ($("#ddlAuctiontype option:selected").val() != '81' && $("#ddlAuctiontype option:selected").val() != '83') {
                //    $("#" + this_row).find("td:eq(16)").text($("#showhlprice").val())
                //    $("#" + this_row).find("td:eq(17)").text($("#showstartprice").val())
                //    $("#" + this_row).find("td:eq(13)").text(thousands_separators($("#txtStartingPrice").val()))
                //}
                //else {
                //    $("#" + this_row).find("td:eq(13)").text($("#showhlprice").val())
                //    $("#" + this_row).find("td:eq(14)").text($("#showstartprice").val())
                //}


                //For Preview Table

                $("#shortnameprev" + this_row).text($('#txtshortname').val())
                $("#targetpriceprev" + this_row).text($('#txttargetprice').val())
                $("#qunatityprev" + this_row).text(thousands_separators($('#txtquantitiy').val()))
                $("#dropuomprev" + this_row).text($('#dropuom').val())
                $("#CPprev" + this_row).text(thousands_separators($('#txtCeilingPrice').val()))
                $("#minincrementprev" + this_row).text(thousands_separators($('#txtminimumdecreament').val()))
                $("#maskvendorprev" + this_row).text(jQuery("#checkmaskvendor option:selected").val())
                $("#inconvalprev" + this_row).text($("#drpdecreamenton option:selected").val())
                $("#incontextprev" + this_row).text($('#drpdecreamenton option:selected').text())
                $("#LIPriceprev" + this_row).text(thousands_separators(removeThousandSeperator($("#txtlastinvoiceprice").val())))
                $("#pricereductionfrequencyprev" + this_row).text($("#txtPriceReductionFrequency").val())
                $("#pricereductionamountprev" + this_row).text(thousands_separators($("#txtPriceReductionAmount").val()))
                $("#showhlpriceprev" + this_row).text($("#showhlprice").val())
                $("#showstartpriceprev" + this_row).text($("#showstartprice").val())
                $("#starttingpriceprev" + this_row).text(thousands_separators($("#txtStartingPrice").val()))
                if ($("#ddlAuctiontype option:selected").val() != '81' && $("#ddlAuctiontype option:selected").val() != 83) {

                    _BidDuration = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtStartingPrice").val())) / removeThousandSeperator($("#txtPriceReductionAmount").val())) * $("#txtPriceReductionFrequency").val()) + parseInt($("#txtPriceReductionFrequency").val());
                    $("#txtBidDuration").val(parseInt(_BidDuration));
                    $("#txtBidDurationPrev").text(parseInt(_BidDuration))
                }

                resetfun();

            }
        }

        else {
            st = "true";
            if ($('#txtStartingPrice').is(":visible") && parseInt($.trim(removeThousandSeperator($('#txtCeilingPrice').val()))) > parseInt($.trim(removeThousandSeperator($('#txtStartingPrice').val()))) && $("#ddlAuctiontype option:selected").val() != '82') {
                error.show();
                $('#spandanger').html('Starting price should not be less than Bid start price...');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;
            }

            else if ($('#txtPriceReductionAmount').is(":visible") && parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val())) > parseInt(removeThousandSeperator($('#txtStartingPrice').val()))) {
                error.show();
                $('#spandanger').html('Price increment amount should be less than starting price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ($('#txtPriceReductionAmount').is(":visible") && parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= parseInt((removeThousandSeperator($('#txtStartingPrice').val()) - removeThousandSeperator($('#txtCeilingPrice').val())) / removeThousandSeperator($('#txtPriceReductionFrequency').val())) && ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83)) {
                error.show();
                $('#spandanger').html('Please enter valid Price Reduction amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ($('#txtPriceReductionAmount').is(":visible") && parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= (parseInt(removeThousandSeperator($('#txtCeilingPrice').val())) - parseInt(removeThousandSeperator($('#txtStartingPrice').val())) / 2) && $("#ddlAuctiontype option:selected").val() == 82) {
                error.show();
                $('#spandanger').html('Please enter valid Price Reduction amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
                error.show();
                $('#spandanger').html('Minimum increment should be less than Bid start price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
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
                jQuery.unblockUI();
                return false;
            }
            else if ((parseInt($('#txtStartingPrice').val()) + parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val()))) >= parseInt(removeThousandSeperator($('#txtCeilingPrice').val())) && $("#ddlAuctiontype option:selected").val() == 82) {
                error.show();
                $('#spandanger').html('Ceiling Max Price should not be less than Bid start price + Price Reduction amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
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
                        i = (this_row.closest('tr').attr('id')).substring(4, (this_row.closest('tr').attr('id')).length)
                        if ($.trim($('#shortname' + i).text()) == $.trim($('#txtshortname').val())) {
                            st = "false"
                        }

                    });

                    if (st == "false") {
                        error.show();
                        $('#spandanger').html('Data already exists...');
                        Metronic.scrollTo(error, -200);
                        error.fadeOut(3000);
                        jQuery.unblockUI();
                        return false;
                    }
                    else {
                        ParametersQuery()
                    }

                }

            }
        }
        jQuery.unblockUI();
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
    if (jQuery("#tblServicesProduct >tbody >tr ").length >= 1 && jQuery("#ddlAuctiontype option:selected").val() != '81' && jQuery("#ddlAuctiontype option:selected").val() != '83') {
        $(".alert-danger").find("span").html('').html('You can not add more than one item for Dutch Auction.')
        Metronic.scrollTo(error, -200);
        $(".alert-danger").show();
        $(".alert-danger").fadeOut(5000);
        resetfun();
        return false;
    }
    if ($("#ddlAuctiontype option:selected").val() != '81' && jQuery("#ddlAuctiontype option:selected").val() != '83') {
        _BidDuration = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtStartingPrice").val())) / removeThousandSeperator($("#txtPriceReductionAmount").val())) * $("#txtPriceReductionFrequency").val()) + parseInt($("#txtPriceReductionFrequency").val());
        $("#txtBidDuration").val(parseInt(_BidDuration));
        $("#txtBidDurationPrev").text(parseInt(_BidDuration));

    }

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
    var status = $('#checkmaskvendor option:selected').val();
    var showHLPrice = $('#showhlprice option:selected').val();
    var ShowStartPrice = $('#showstartprice option:selected').val();

    if ($("#txtlastinvoiceprice").val() == null || $("#txtlastinvoiceprice").val() == '') {
        $("#txtlastinvoiceprice").val('0')
    }
    if ($("#txttargetprice").val() == null || $("#txttargetprice").val() == '') {
        $("#txttargetprice").val('0')
    }
    if ($("#ddlAuctiontype").val() == 81 || $("#ddlAuctiontype").val() == 83) {
        if (!jQuery("#tblServicesProduct thead").length) {

            jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Increment</th><th>Increment On</th><th>Last Invoice Price</th><th>Show H1 price</th><th>Show Start price</th></tr></thead>");
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><a type="button" class="btn btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td id=shortname' + i + '>' + $('#txtshortname').val() + '</td><td id=TP' + i + ' class=text-right>' + thousands_separators($('#txttargetprice').val()) + '</td><td id=quantity' + i + ' class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=dropuom' + i + '>' + $('#dropuom').val() + '</td><td id=CP' + i + ' class=text-right>' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendor' + i + '>' + status + '</td><td id=minincrement' + i + ' class=text-right >' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=incontext' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconval' + i + '>' + $("#drpdecreamenton").val() + '</td><td id=LIPrice' + i + ' class=text-right>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td id=showhlprice' + i + '>' + showHLPrice + '</td><td id=showstartprice' + i + '>' + ShowStartPrice + '</td></tr>');

        } else {
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><a type="button" class="btn  btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp<a class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td id=shortname' + i + '>' + $('#txtshortname').val() + '</td><td id=TP' + i + ' class=text-right>' + thousands_separators($('#txttargetprice').val()) + '</td><td id=quantity' + i + ' class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=dropuom' + i + '>' + $('#dropuom').val() + '</td><td id=CP' + i + ' class=text-right>' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendor' + i + '>' + status + '</td><td id=minincrement' + i + '  class=text-right>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=incontext' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconval' + i + '>' + $("#drpdecreamenton").val() + '</td><td id=LIPrice' + i + ' class=text-right>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td id=showhlprice' + i + '>' + showHLPrice + '</td><td id=showstartprice' + i + '>' + ShowStartPrice + '</td></tr>');
        }

        $('#wrap_scroller').show();
        if (!jQuery("#tblServicesProductPrev thead").length) {
            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Increment</th><th>Increment On</th><th class=hide></th><th>Last Invoice Price</th><th>Show H1 price</th><th>Show Start price</th></tr></thead>");
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td id=shortnameprev' + i + '>' + $('#txtshortname').val() + '</td><td id=TPprev' + i + ' class=text-right>' + thousands_separators($('#txttargetprice').val()) + '</td><td id=quantityprev' + i + ' class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=dropuomprev' + i + '>' + $('#dropuom').val() + '</td><td id=CPprev' + i + ' class=text-right>' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendorprev' + i + '>' + status + '</td><td id=minincrementprev' + i + '>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=incontextprev' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconvalprev' + i + '>' + $("#drpdecreamenton").val() + '</td><td  id=LIPriceprev' + i + ' class=text-right >' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td id=showhlpriceprev' + i + '>' + $('#showhlprice').val() + '</td><td id=showstartpriceprev' + i + '>' + $('#showstartprice').val() + '</td></tr>');

        } else {
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td id=shortnameprev' + i + '>' + $('#txtshortname').val() + '</td><td id=TPprev' + i + ' class=text-right>' + thousands_separators($('#txttargetprice').val()) + '</td><td id=quantityprev' + i + ' class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=dropuomprev' + i + '>' + $('#dropuom').val() + '</td><td id=CPprev' + i + ' class=text-right>' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendorprev' + i + '>' + status + '</td><td id=minincrementprev' + i + '>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=incontextprev' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconvalprev' + i + '>' + $("#drpdecreamenton").val() + '</td><td  id=LIPriceprev' + i + ' class=text-right>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td id=showhlpriceprev' + i + '>' + $('#showhlprice').val() + '</td><td id=showstartpriceprev' + i + '>' + $('#showstartprice').val() + '</td></tr>');

        }
        $('#wrap_scrollerPrev').show();
    }
    else {

        //If Dutch Bid

        if (!jQuery("#tblServicesProduct thead").length) {
            jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Hide Target Price</th><th class='hide'>Minimum Increment</th><th class='hide'>Increment On</th><th class=hide></th><th>Last Invoice Price</th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 price</th><th class=hide>Show Start price</th></tr></thead>");
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><a type="button" class="btn btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td id=shortname' + i + '>' + $('#txtshortname').val() + '</td><td class=text-right id=TP' + i + '>' + $('#txttargetprice').val() + '</td><td class=text-right id=quantity' + i + '>' + $('#txtquantitiy').val() + '</td><td id=dropuom' + i + '>' + $('#dropuom').val() + '</td><td class=text-right id=CP' + i + '>' + $('#txtCeilingPrice').val() + '</td><td id=maskvendor' + i + '>' + status + '</td><td class="hide" id=minincrement' + i + '>' + $('#txtminimumdecreament').val() + '</td><td class="hide" id=incontext' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconval' + i + '>' + $("#drpdecreamenton").val() + '</td><td class=text-right id=LIPrice' + i + '>' + $("#txtlastinvoiceprice").val() + '</td><td class=text-right id=starttingprice' + i + ' >' + $("#txtStartingPrice").val() + '</td><td class=text-right id=pricereductionfrequency' + i + '>' + $("#txtPriceReductionFrequency").val() + '</td><td class=text-right id=pricereductionamount' + i + '>' + $("#txtPriceReductionAmount").val() + '</td><td class=hide id=showhlprice' + i + '>' + $("#showhlprice").val() + '</td><td class=hide id=showstartprice' + i + '>' + $("#showstartprice").val() + '</td></tr>');

        } else {

            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><a type="button" class="btn  btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp<a class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td id=shortname' + i + '>' + $('#txtshortname').val() + '</td><td class=text-right id=TP' + i + '>' + $('#txttargetprice').val() + '</td><td class=text-right id=quantity' + i + '>' + $('#txtquantitiy').val() + '</td><td id=dropuom' + i + '>' + $('#dropuom').val() + '</td><td class=text-right id=CP' + i + '>' + $('#txtCeilingPrice').val() + '</td><td id=maskvendor' + i + '>' + status + '</td><td class="hide" id=minincrement' + i + '>' + $('#txtminimumdecreament').val() + '</td><td class="hide" id=incontext' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconval' + i + '>' + $("#drpdecreamenton").val() + '</td><td class=text-right id=LIPrice' + i + '>' + $("#txtlastinvoiceprice").val() + '</td><td class=text-right id=starttingprice' + i + '>' + $("#txtStartingPrice").val() + '</td><td class=text-right id=pricereductionfrequency' + i + '>' + $("#txtPriceReductionFrequency").val() + '</td><td class=text-right id=pricereductionamount' + i + '>' + $("#txtPriceReductionAmount").val() + '</td><td class=hide id=showhlprice' + i + '>' + $("#showhlprice").val() + '</td><td class=hide id=showstartprice' + i + '>' + $("#showstartprice").val() + '</td></tr>');

        }

        $('#wrap_scroller').show();
        if (!jQuery("#tblServicesProductPrev thead").length) {

            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Hide Target Price</th><th class='hide'>Minimum Increment</th><th class='hide'>Increment On</th><th class=hide></th><th>Last Invoice Price</th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 price</th><th class=hide>Show start price</th></tr></thead>");
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td id=shortnameprev' + i + '>' + $('#txtshortname').val() + '</td><td class=text-right id=TPprev' + i + '>' + $('#txttargetprice').val() + '</td><td id=quantityprev' + i + ' class=text-right>' + $('#txtquantitiy').val() + '</td><td id=dropuomprev' + i + '>' + $('#dropuom').val() + '</td><td class=text-right id=CPprev' + i + '>' + $('#txtCeilingPrice').val() + '</td><td id=maskvendorprev' + i + '>' + status + '</td><td class=hide id=minincrementprev' + i + '>' + $('#txtminimumdecreament').val() + '</td><td class=hide id=incontextprev' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconvalprev' + i + '>' + $("#drpdecreamenton").val() + '</td><td class=text-right id=LIPriceprev' + i + '>' + $("#txtlastinvoiceprice").val() + '</td><td class=text-right id=starttingprice' + i + '>' + $("#txtStartingPrice").val() + '</td><td class=text-right id=pricereductionfrequency' + i + '>' + $("#txtPriceReductionFrequency").val() + '</td><td id=pricereductionamount' + i + '>' + $("#txtPriceReductionAmount").val() + '</td><td class=hide id=showhlprice' + i + '>' + $("#showhlprice").val() + '</td><td class=hide id=showstartprice' + i + '>' + $("#showstartprice").val() + '</td></tr>');

        } else {
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td id=shortnameprev' + i + '>' + $('#txtshortname').val() + '</td><td class=text-right id=TPprev' + i + '>' + $('#txttargetprice').val() + '</td><td class=text-right id=quantityprev' + i + '>' + $('#txtquantitiy').val() + '</td><td id=dropuomprev' + i + '>' + $('#dropuom').val() + '</td><td class=text-right id=CPprev' + i + '>' + $('#txtCeilingPrice').val() + '</td><td id=maskvendorprev' + i + '>' + status + '</td><td class="hide" id=minincrementprev' + i + '>' + $('#txtminimumdecreament').val() + '</td><td class=hide id=incontextprev' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=inconvalprev' + i + '>' + $("#drpdecreamenton").val() + '</td><td class=text-right id=LIPriceprev' + i + '>' + $("#txtlastinvoiceprice").val() + '</td><td class=text-right id=starttingpriceprev' + i + '>' + $("#txtStartingPrice").val() + '</td><td class=text-right id=pricereductionfrequencyprev' + i + '>' + $("#txtPriceReductionFrequency").val() + '</td><td id=pricereductionamountprev' + i + '>' + $("#txtPriceReductionAmount").val() + '</td><td class=hide id=showhlpriceprev' + i + '>' + $("#showhlprice").val() + '</td><td class=hide id=showstartpriceprev' + i + '>' + $("#showstartprice").val() + '</td></tr>');
        }
        $('#wrap_scrollerPrev').show();
    }
    rowAppItems = rowAppItems + 1;
    rowAppItemsrno = rowAppItemsrno + 1;
    resetfun()

}

function editvalues(icount) {
    // sessionStorage.setItem('ClickedEditID', rowid.id)
    Metronic.scrollTo($("body"), 200);
    $('#rowid').val(icount)

    $('#txtshortname').val($("#shortname" + icount).text())
    $('#txttargetprice').val(thousands_Sep_Text(removeThousandSeperator($("#TP" + icount).text())))
    $('#txtquantitiy').val(removeThousandSeperator($("#quantity" + icount).text()))
    $('#dropuom').val($("#dropuom" + icount).text())
    $('#txtUOM').val($("#dropuom" + icount).text())
    $('#txtCeilingPrice').val(removeThousandSeperator($("#CP" + icount).text()))
    $('#txtminimumdecreament').val(removeThousandSeperator($("#minincrement" + icount).text()))
    $('#drpdecreamenton').val(removeThousandSeperator($("#inconval" + icount).text()))
    $('#txtlastinvoiceprice').val($("#LIPrice" + icount).text())
    $('#txtStartingPrice').val(removeThousandSeperator($("#starttingprice" + icount).text()))
    // $('#txtStartingPrice').val($("#" + rowid.id).find("td:eq(13)").text())
    $('#showhlprice').val($("#showhlprice" + icount).text())
    $('#showstartprice').val($("#showstartprice" + icount).text())

    var frequency = removeThousandSeperator($("#pricereductionfrequency" + icount).text());
    $('#txtPriceReductionAmount').val(removeThousandSeperator($("#pricereductionamount" + icount).text()))
    $('#spinner4').spinner('value', frequency)
    jQuery("#checkmaskvendor").val($("#maskvendor" + icount).text())
    $('#add_or').text('Modify');

}
function deleterow(rowid, rowidPrev) {

    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();
    rowAppItems = rowAppItems - 1;

}
function resetfun() {
    $('#add_or').text('Add');
    $('#txtshortname').val('')
    $('#txttargetprice').val('')
    $('#txtquantitiy').val('')
    $('#dropuom').val('')
    $('#txtUOM').val('')
    $('#txtbiddescriptionP').val('')
    $('#txtContractDuration').val('')
    $('#txtedelivery').val('')
    $('#txtCeilingPrice').val('')
    $('#txtminimumdecreament').val('')
    $('#drpdecreamenton').val('A')
    $('#txtlastinvoiceprice').val('')
    jQuery('#fileattachment').val('')
    jQuery('#checkmaskvendor').val('Y')
    //jQuery('#showhlprice').val('N')
    jQuery('#showstartprice').val('Y')
    $('#closebtnitms').hide();
    $('#fileattachmentforitems').html('')
    $('#fileattachmentforitems').attr('href', 'javascript:;').addClass('display-none');
    $('#fileattachment').attr('disabled', false);
    $('#txtStartingPrice').val('');
    $('#txtPriceReductionFrequency').val('');
    $('#spinner4').spinner('value', 1);
    $('#txtPriceReductionAmount').val('');
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
function fetchScrapSalesBidDetails() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + sessionStorage.getItem('CurrentBidID'),
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?BidID=" + sessionStorage.getItem('CurrentBidID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var str = '';
            var strp = '';
            sessionStorage.getItem("BidPreApp", BidData[0].bidDetails[0].bidpreapproval)
            var dtst = (fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))
            jQuery('#txtBidSubject').val(StringDecodingMechanism(BidData[0].bidDetails[0].bidSubject))

            jQuery('#txtbiddescription').val(StringDecodingMechanism(BidData[0].bidDetails[0].bidDetails))

            jQuery('#txtbidDate').val(dtst)
            jQuery("#dropCurrency").val(BidData[0].bidDetails[0].currencyID).attr("selected", "selected");
            jQuery('#txtConversionRate').val(BidData[0].bidDetails[0].conversionRate)
            jQuery('#drpshowL1L2').val(BidData[0].bidDetails[0].showRankToVendor)
            $('#drphideVendor').val(BidData[0].bidDetails[0].hideVendor)
            jQuery('#txtBidExtension').val(BidData[0].bidDetails[0].noofBidExtension)
            jQuery('#ddlAuctiontype').val(BidData[0].bidDetails[0].bidForID)
            $("#cancelBidBtn").show();
            _bidType = BidData[0].bidDetails[0].bidForID;

            if (BidData[0].bidDetails[0].bidForID == 82) {
                if (BidData[0].bidDetails[0].bidDuration > 0) {
                    jQuery('#txtBidDuration').attr('disabled', true).val(BidData[0].bidDetails[0].bidDuration)
                } else {
                    jQuery('#txtBidDuration').attr('disabled', true).val(0)
                }
                $('#showhlprice').attr('disabled', false).val("N");
                $('#btnexcel').hide()
            }
            else if (BidData[0].bidDetails[0].bidForID == 81) {
                jQuery('#txtBidDuration').attr('disabled', false).val(BidData[0].bidDetails[0].bidDuration)
                jQuery('input[name="txtBidDuration"]').rules('add', {
                    required: true,
                    minlength: 1,
                    maxlength: 3,
                    number: true
                });
                $('#showhlprice').attr('disabled', false).val("N");
                $('#btnexcel').show()
            }
            else {
                jQuery('#txtBidDuration').attr('disabled', false).val(BidData[0].bidDetails[0].bidDuration)
                jQuery('input[name="txtBidDuration"]').rules('add', {
                    required: true,
                    minlength: 1,
                    maxlength: 3,
                    number: true
                });
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
                //rowApp = rowApp + 1;
                str = '<tr id=trAppid' + (i + 1) + '>';
                str += '<td><a type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(' + (i + 1) + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></a></td>';
                str += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                str += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";

                str += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td>";
                str += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td></tr>";

                jQuery('#tblapprovers').append(str);

                strp = '<tr id=trAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                strp += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td>";
                strp += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td></tr>";
                jQuery('#tblapproversPrev').append(strp);

                //** Pre Approver
                str = '';
                //rowpreBidApp = rowpreBidApp + 1;
                str = '<tr id=trpreAppid' + (i + 1) + '>';
                str += '<td><a type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deletepreApprow(' + (i + 1) + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></a></td>';
                str += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                str += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                str += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td>";
                str += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td></tr>";
                jQuery('#tblpreBidapprovers').append(str);

                strp = '';
                strp = '<tr id=trpreAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                strp += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td>";
                strp += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td></tr>";
                jQuery('#tblpreBidapprovers1').append(strp);

            }
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblServicesProductPrev").empty();

            if (BidData[0].bidScrapSalesDetails.length > 0) {


                $('#wrap_scroller').show();
                $('#wrap_scrollerPrev').show();
                rowAppItems = rowAppItems + 1
                rowAppItemsrno = rowAppItemsrno + 1;
                if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {
                    jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>Item/Name</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Increment</th><th>Increment On</th><th class=hide></th><th>Last Invoice Price</th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Name</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Increment</th><th>Increment On</th><th class=hide></th><th>Last Invoice Price</th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {


                        var decrementon = ''
                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = 'Percentage'

                        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px !important;"><a class="btn  btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td id=shortname' + i + '>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td id=TP' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td id=quantity' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td id=dropuom' + i + '>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td id=CP' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td id=maskvendor' + i + '>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td id=minincrement' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td id=incontext' + i + '>' + decrementon + '</td><td class=hide id=inconval' + i + '>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td id=LIPrice' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td id=showhlprice' + i + '>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td id=showstartprice' + i + '>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');
                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td id=shortnameprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td id=TPprev' + i + ' class=text-right id=TP' + i + '> ' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td id=quantityprev' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td id=dropuomprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td id=CPprev' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td id=maskvendorprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td id=minincrementprev' + i + ' class=text-right >' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td id=incontext' + i + '>' + decrementon + '</td><td class=hide id=inconvalprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td id=LIPriceprev' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td id=showhlpriceprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td id=showstartpriceprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');

                    }
                }
                else { // for dutch
                    jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Hide Target Price</th><th class=hide>Minimum Increment</th><th class=hide>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 Price</th><th class=hide>Show Start Price</th></tr></thead>");
                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Hide Target Price</th><th class=hide>Minimum Increment</th><th class=hide>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 Price</th><th class=hide>Show Start Price</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {


                        var decrementon = ''
                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = 'Percentage'


                        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px !important;"><a class="btn  btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td id=shortname' + i + '>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right id=TP' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right id=quantity' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td id=dropuom' + i + '>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right id=CP' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td id=maskvendor' + i + '>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=hide id=minincrement' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td class=hide id=incontext' + i + '>' + decrementon + '</td><td class=hide id=inconval' + i + '>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td id=LIPrice' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=text-right id=starttingprice' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].startingPrice) + '</td><td class=text-right id=pricereductionfrequency' + i + '>' + BidData[0].bidScrapSalesDetails[i].priceReductionFrequency + '</td><td class=text-right id=pricereductionamount' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionAmount) + '</td><td class=hide id=showhlprice' + i + '>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td class=hide id=showstartprice' + i + '>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');
                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td id=shortnameprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right id=quantityprev' + i + ' > ' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td id=dropuomprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right id=CPprev' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td id=maskvendorprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=hide id=minincrementprev' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td class=hide id=incontextprev' + i + '>' + decrementon + '</td><td class=hide id=inconvalprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td id=LIPriceprev' + i + ' class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=text-right id=starttingpriceprev' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].startingPrice) + '</td><td class=text-right id=pricereductionfrequencyprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].priceReductionFrequency + '</td><td class=text-right id=pricereductionamountprev' + i + '>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionAmount) + '</td><td class=hide id=showhlpriceprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td class=hide id=showstartpriceprev' + i + '>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');

                    }

                }

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
            setTimeout(function () {
                if (sessionStorage.getItem("BidPreApp") == "N" || sessionStorage.getItem("BidPreApp") == undefined || sessionStorage.getItem("BidPreApp") == null) {
                    $('#btnsubmit').text("Submit")
                }
                else {
                    $('#btnsubmit').text("Submit for PreApproval")
                }
            }, 800);

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

                    if (sessionStorage.getItem('_savedDraft') == 'Y' && _bidType != $("#ddlAuctiontype option:selected").val()) {

                        bootbox.dialog({
                            message: "By changing Auction Type for will delete previously configured event parameters. Do you want to continue?",
                            // title: "Custom title",
                            buttons: {
                                confirm: {
                                    label: "Yes",
                                    className: "btn-success",
                                    callback: function () {

                                        deleteBidParameter('P');
                                    }
                                },
                                cancel: {
                                    label: "No",
                                    className: "btn-warning",
                                    callback: function () {
                                        $('#form_wizard_1').bootstrapWizard('previous');
                                    }
                                }
                            }
                        });
                    }
                    else {
                        if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {
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
                                ConfigureBidInsPefaTab1();

                            }
                        }
                        else {
                            ConfigureBidInsPefaTab1();

                        }

                    }


                    fetchPSBidDetailsForPreview();
                }
                else {
                    // $('#BidPreviewDiv').show();
                    // $('#form_wizard_1').hide();
                    ConfigurePEFAVendorsave();
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
    rowAppItems = 0;
    $("#tblServicesProduct").empty();
    $("#tblServicesProductPrev").empty();
    if ($("#ddlAuctiontype option:selected").val() == 81) {

        $(".hdnfielddutch").attr('disabled', false);
        $("#drpshowL1L2").attr('disabled', false);
        $("#txtBidDuration").attr('disabled', false);
        $("#txtBidDuration").val(0);
        $('#showhlprice').val('N')
        $('#showhlprice').attr('disabled', false);
        $('#btnexcel').show()
    }
    else if ($("#ddlAuctiontype option:selected").val() == 82) {

        $(".hdnfielddutch").attr('disabled', true);
        $("#drpshowL1L2").attr('disabled', true);
        $("#txtBidDuration").attr('disabled', true);
        $("#txtBidDuration").val(0);
        $('#showhlprice').val('N')
        $('#showhlprice').attr('disabled', false);
        $('#btnexcel').hide()

    }
    else {
        $(".hdnfielddutch").attr('disabled', false);
        $("#drpshowL1L2").attr('disabled', false);
        $("#txtBidDuration").attr('disabled', false);
        $("#txtBidDuration").val(0);
        $('#showhlprice').val('Y')
        $('#showhlprice').attr('disabled', true);
        $('#btnexcel').show()
    }
}


function deleteBidParameter(For) {

    var BidData = {

        "BidId": parseInt(sessionStorage.getItem('CurrentBidID')),
        "For": For
    }

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/DiscardBidPefa/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function (data) {
            if (data == '1') {
                ConfigureBidInsPefaTab1();
                $("#tblServicesProduct").empty();
                $("#tblServicesProductPrev").empty();
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
            // sessionStorage.setItem('hdnVendorID', map[item].participantID);
            //jQuery("#tblvendorlist > tbody").empty();


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
    var encrypdata = fnencrypt("bidTypeId=6")
    window.location = 'cloneBid.html?param=' + encrypdata;
}


//*** FA Upload Excel
$('#FAexcel').on("hidden.bs.modal", function () {
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
    $('#RAexcel').modal('hide');
    $('#btnyesno').show()
    $('#modalLoaderparameter').addClass('display-none');
}


$("#btninstructionexcelparameter").click(function () {
    var ErrorUOMMsz = '<ul class="col-md-3 text-left">';
    var ErrorUOMMszRight = '<ul class="col-md-5 text-left">'
    var quorem = (allUOM.length / 2) + (allUOM.length % 2);
    for (var i = 0; i < parseInt(quorem); i++) {
        ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].uom + '</li>';
        var z = (parseInt(quorem) + i);
        if (z <= allUOM.length - 1) {
            ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].uom + '</li>';
        }
    }
    ErrorUOMMsz = ErrorUOMMsz + '</ul>'
    ErrorUOMMszRight = ErrorUOMMszRight + '</ul>'

    // alert(ErrorUOMMsz + ErrorUOMMszRight)
    $("#ULUOM_instructions").html(ErrorUOMMsz + ErrorUOMMszRight);
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
                //var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1]);
                if (roa.length > 0) {
                    result = roa;
                }
            });
            //Get the first column first cell value
            //alert(JSON.stringify(result))
            printdataSeaBid(result)
        };
        reader.readAsArrayBuffer(f);
    }
}
var Rowcount = 0;
var ShowL1Price = ''
var BidDuration = 0;
function printdataSeaBid(result) {
    var loopcount = result.length; //getting the data length for loop.
    if (loopcount > 200) {
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html('Only max 200 Items is allowed. Please fill and upload the file again.');
        $("#file-excelparameter").val('');
        return false;
    }
    else {
        var ErrorMszDuplicate = '';
        var i;
        //var numberOnly = /^[0-9]+$/;
        var numberOnly = /^[0-9]\d*(\.\d+)?$/;
        $("#temptableForExcelDataparameter").empty();
        $("#temptableForExcelDataparameter").append("<tr><th>ItemService</th><th>TargetPrice</th><th>HideTargetPrice</th><th>Quantity</th><th>UOM</th><th>BidStartPrice</th><th>MinimumIncreament</th><th>IncreamentOn</th>th>LastInvoicePrice</th><th>ShowH1Price</th><th>ShowStartPrice</th></tr>");
        // checking validation for each row
        var targetPrice = '';
        var BidstartPrice = 0;
        var minimuminc = 0;
        var LastInvoicePrice = 0;
        var st = 'true'


        //var SelectedCurrency = $('#txtselectedCurrency').val();
        var z = 0;
        for (i = 0; i < loopcount; i++) {

            if ($.trim(result[i].TargetPrice) == '') {
                targetPrice = 0;
            }
            else {
                targetPrice = $.trim(result[i].TargetPrice);
            }
            if ($.trim(result[i].LastInvoicePrice) == '') {
                LastInvoicePrice = 0;
            }
            else {
                LastInvoicePrice = $.trim(result[i].LastInvoicePrice);
            }
            if ($.trim(result[i].BidStartPrice) == '') {
                BidstartPrice = 0;
            }
            else {
                BidstartPrice = $.trim(result[i].BidStartPrice);
            }
            if ($.trim(result[i].MinimumIncreament) == '') {
                minimuminc = 0;
            }
            else {
                minimuminc = $.trim(result[i].MinimumIncreament);
            }

            if ($.trim(result[i].ItemService) == '' || $.trim(result[i].ItemService).length > 100) {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Item/Product/Services can not be blank or length should be 100 characters of Item no ' + (i + 1) + ' . Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($.trim(result[i].ItemService).toLowerCase() == $.trim(result[i - z].ItemService).toLowerCase() && i > 0) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('ItemService with same name already exists of Item no ' + (i + 1) + ' . Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            //else if (!result[i].TargetPrice.trim().match(numberOnly) || targetPrice == 0 ) {
            //    $("#error-excelparameter").show();
            //    $("#errspan-excelparameter").html('Target Price should be in numbers only of Item no ' + (i + 1) +'.');
            //    $("#file-excelparameter").val('');
            //    return false;
            //}
            else if ($.trim(result[i].HideTargetPrice) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Hide Target Price can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($.trim(result[i].ShowH1Price) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Show H1 Price can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($.trim(result[i].ShowStartPrice) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Show Start Price can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (!result[i].Quantity.trim().match(numberOnly) || result[i].Quantity.trim() == '' || result[i].Quantity.trim() == 0) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Quantity should be in numbers only/greater then 0 of Item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($.trim(result[i].UOM) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Quantity UOM can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }

            else if (!result[i].BidStartPrice.trim().match(numberOnly) || BidstartPrice == 0) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Bid Start Price should be in numbers only of Item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (!result[i].MinimumIncreament.trim().match(numberOnly) || minimuminc == 0) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Minimum Increment Price should be in numbers only of Item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (LastInvoicePrice != 0 && !(result[i].LastInvoicePrice.trim().match(numberOnly))) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Last Invoice Price should be in numbers only of Item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (targetPrice != 0 && !(targetPrice.match(numberOnly))) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('TargetPrice should be in numbers only of Item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($.trim(result[i].IncreamentOn) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('IncreamentOn can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (parseInt(minimuminc) > parseInt(BidstartPrice)) {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Minimum increment should be less than Bid start price of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (parseInt(minimuminc) > parseInt(20) && $.trim(result[i].IncreamentOn) == "P") {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Minimum Increment should be less than 20% of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (parseInt(minimuminc) > parseFloat(20 * (BidstartPrice) / 100) && $.trim(result[i].IncreamentOn) == "A") {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Minimum Increment should be less than 20% of Bid Start Price of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else {

                // if values are correct then creating a temp table
                $("<tr><td id=itemserviceexcel" + i + ">" + replaceQuoutesFromStringFromExcel(result[i].ItemService) + "</td><td id=TPexcel" + i + ">" + targetPrice + "</td><td id=hideTP" + i + ">" + result[i].HideTargetPrice + "</td><td id=quanexcel" + i + ">" + result[i].Quantity + "</td><td id=uom" + i + ">" + result[i].UOM + "</td><td id=BSPexcel" + i + ">" + BidstartPrice + "</td><td id=incrmenton" + i + ">" + result[i].IncreamentOn + "</td><td id=mininc" + i + ">" + minimuminc + "</td><td id=LIPexcel" + i + ">" + LastInvoicePrice + "</td><td id=showH1" + i + ">" + result[i].ShowH1Price + "</td><td id=showstartprice" + i + ">" + result[i].ShowStartPrice + "</td></tr>").appendTo("#temptableForExcelDataparameter");
                var arr = $("#temptableForExcelDataparameter tr");

                $.each(arr, function (i, item) {
                    var currIndex = $("#temptableForExcelDataparameter tr").eq(i);

                    var matchText = currIndex.find("td:eq(0)").text().toLowerCase();
                    $(this).nextAll().each(function (i, inItem) {

                        if (matchText === $(this).find("td:eq(1)").text().toLowerCase()) {
                            $(this).remove();
                            st = 'false'
                            ErrorMszDuplicate = ErrorMszDuplicate + 'Item with same name already exists at row no ' + (i + 1) + ' . Item will not insert.!<BR>'
                        }
                    });
                });
            }

            z++;

        } // for loop ends

        var excelCorrect = 'N';
        var excelCorrectUOM = 'N';
        var ErrorUOMMsz = '';
        var ErrorUOMMszRight = '';
        Rowcount = 0;

        // check for UOM
        $("#temptableForExcelDataparameter tr:gt(0)").each(function (index) {

            excelCorrectUOM = 'N';
            Rowcount = Rowcount + 1;
            for (var i = 0; i < allUOM.length; i++) {
                if ($.trim($('#uom' + index).text()).toLowerCase() == allUOM[i].uom.trim().toLowerCase()) {//allUOM[i].UOMID
                    excelCorrectUOM = 'Y';
                }

            }
            var quorem = (allUOM.length / 2) + (allUOM.length % 2);
            if (excelCorrectUOM == "N") {
                $("#error-excelparameter").show();
                ErrorUOMMsz = '<b>UOM</b> not filled properly at row no ' + Rowcount + '. Please choose <b>UOM</b> from given below: <br><ul class="col-md-5 text-left">';
                ErrorUOMMszRight = '<ul class="col-md-5 text-left">'
                for (var i = 0; i < parseInt(quorem); i++) {
                    ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].uom + '</li>';
                    var z = (parseInt(quorem) + i);
                    if (z <= allUOM.length - 1) {
                        ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].uom + '</li>';
                    }
                }
                ErrorUOMMsz = ErrorUOMMsz + '</ul>'
                ErrorUOMMszRight = ErrorUOMMszRight + '</ul><div class=clearfix></div><br/>and upload the file again.'
                $("#errspan-excelparameter").html(ErrorUOMMsz + ErrorUOMMszRight);

                return false;
            }

        });

        $("#temptableForExcelDataparameter tr:gt(0)").each(function (index) {
            //var this_row = $(this);

            switch ($.trim($('#hideTP' + index).text())) {
                case 'N':
                    excelCorrect = 'Y';
                    break;
                case 'Y':
                    excelCorrect = 'Y';
                    break;

                default:
                    excelCorrect = 'N';
                    $("#error-excelparameter").show();
                    $("#errspan-excelparameter").html('<b>Hide Target Price</b> text not filled properly. Please choose Hide TP from given below: <br/><br/>'
                        + '<ul class="col-md-4 text-left">'
                        + '<li>Y for Hide Target Price to all vendors</li>'
                        + '<li>N for Show Target Price to all vendors</li>'
                        + '</ul><div class=clearfix></div>'
                        + '<br/>and upload the file again.');
                    $("#file-excelparameter").val('');
                    return false;
            }
            switch ($.trim($('#showH1' + index).text())) {
                case 'N':
                    excelCorrect = 'Y';
                    break;
                case 'Y':
                    excelCorrect = 'Y';
                    break;

                default:
                    excelCorrect = 'N';
                    $("#error-excelparameter").show();
                    $("#errspan-excelparameter").html('<b>Show H1 Price</b> text not filled properly. Please choose Show L1 Price from given below: <br/><br/>'
                        + '<ul class="col-md-4 text-left">'
                        + '<li>N - for not showing ongoing H1 Price to all vendor</li>'
                        + '<li>Y - for showing ongoing H1 Price to all vendors</li>'
                        + '</ul><div class=clearfix></div>'
                        + '<br/>and upload the file again.');
                    $("#file-excelparameter").val('');
                    return false;
            }
            switch ($.trim($('#showstartprice' + index).text())) {
                case 'N':
                    excelCorrect = 'Y';
                    break;
                case 'Y':
                    excelCorrect = 'Y';
                    break;

                default:
                    excelCorrect = 'N';
                    $("#error-excelparameter").show();
                    $("#errspan-excelparameter").html('<b>Show Start Price</b> text not filled properly. Please choose Show Start Price from given below: <br/><br/>'
                        + '<ul class="col-md-4 text-left">'
                        + '<li>Y for Show start price to all vendors – vendors can not quote higher than this price</li>'
                        + '<li>N for Hide</li>'
                        + '</ul><div class=clearfix></div>'
                        + '<br/>and upload the file again.');
                    $("#file-excelparameter").val('');
                    return false;
            }
            switch ($.trim($('#incrmenton' + index).text())) {
                case 'A':
                    excelCorrect = 'Y';
                    break;
                case 'P':
                    excelCorrect = 'Y';
                    break;

                default:
                    excelCorrect = 'N';
                    $("#error-excelparameter").show();
                    $("#errspan-excelparameter").html('<b>IncrementOn</b> not filled properly. Please choose IncrementOn from given below: <br/><br/>'
                        + '<ul class="col-md-4 text-left">'
                        + '<li>A - to select bid incrementOn in Amount</li>'
                        + '<li>P - to select bid incrementOn in percentage</li>'
                        + '</ul><div class=clearfix></div>'
                        + '<br/>and upload the file again.');
                    $("#file-excelparameter").val('');
                    return false;
            }
        });
        if (excelCorrect == 'Y' && excelCorrectUOM == 'Y') {
            $('#btnyesno').show();
            $("#error-excelparameter").hide();
            $("#errspan-excelparameter").html('');
            $("#success-excelparameter").show()
            //abheedev backlog 405
            $("#succspan-excelparameter").html('<p>Excel file is found ok.Do you want to upload ?\n This will clean your existing Data.</p>\n <p style="color:red"><b>Special characters like -\',\", #,&,~  shall be removed from the text during upload. Please check your text accordingly.</b></p>');

            $("#file-excelparameter").val('');
            excelCorrect = '';
            if (st == 'false') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html(ErrorMszDuplicate)
            }
        }
    }
}
function fnSeteRFQparameterTable() {
    var rowCount = jQuery('#temptableForExcelDataparameter tr').length;
    if (rowCount > 0) {
        $("#success-excelparameter").hide();
        $('#btnsforYesNo').show()
        $("#error-excelparameter").hide();
        $('#loader-msgparameter').html('Processing. Please Wait...!');
        $('#modalLoaderparameter').removeClass('display-none');
        jQuery("#tblServicesProduct").empty();
        jQuery("#tblServicesProductPrev").empty();


        var incon = '';
        $("#temptableForExcelDataparameter tr:gt(0)").each(function (i) {
            //var this_row = $(this);
            if ($.trim($('#incrmenton' + i).text()) == "A") {
                incon = "Amount";
            }
            else {
                incon = "%age";
            }
            if (!jQuery("#tblServicesProduct thead").length) {
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th>Show H1 price</th><th>Show Start price</th></tr></thead>");
                jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><a type="button" class="btn btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td id=shortname' + i + '>' + $('#itemserviceexcel' + i).text() + '</td><td id=TP' + i + ' class=text-right>' + thousands_separators($('#TPexcel' + i).text()) + '</td><td id=quantity' + i + ' class=text-right>' + thousands_separators($('#quanexcel' + i).text()) + '</td><td id=dropuom' + i + '>' + $('#uom' + i).text() + '</td><td id=CP' + i + ' class=text-right>' + thousands_separators($('#BSPexcel' + i).text()) + '</td><td id=maskvendor' + i + '>' + $.trim($('#hideTP' + i).text()) + '</td><td id=minincrement' + i + ' class=text-right>' + thousands_separators($('#mininc' + i).text()) + '</td><td id=incontext' + i + '>' + incon + '</td><td class=hide id=inconval' + i + '>' + $('#incrmenton' + i).text() + '</td><td id=LIPrice' + i + ' class=text-right>' + thousands_separators($("#LIPexcel" + i).text()) + '</td><td id=showhlprice' + i + '>' + $('#showH1' + i).text() + '</td><td id=showstartprice' + i + '>' + $('#showstartprice' + i).text() + '</td></tr>')
            }
            else {
                jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><a type="button" class="btn btn-sm btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td id=shortname' + i + '>' + $('#itemserviceexcel' + i).text() + '</td><td id=TP' + i + ' class=text-right>' + thousands_separators($('#TPexcel' + i).text()) + '</td><td id=quantity' + i + ' class=text-right>' + thousands_separators($('#quanexcel' + i).text()) + '</td><td id=dropuom' + i + '>' + $('#uom' + i).text() + '</td><td id=CP' + i + ' class=text-right>' + thousands_separators($('#BSPexcel' + i).text()) + '</td><td id=maskvendor' + i + '>' + $.trim($('#hideTP' + i).text()) + '</td><td id=minincrement' + i + ' class=text-right>' + thousands_separators($('#mininc' + i).text()) + '</td><td id=incontext' + i + '>' + incon + '</td><td class=hide id=inconval' + i + '>' + $('#incrmenton' + i).text() + '</td><td id=LIPrice' + i + ' class=text-right>' + thousands_separators($("#LIPexcel" + i).text()) + '</td><td id=showhlprice' + i + '>' + $('#showH1' + i).text() + '</td><td id=showstartprice' + i + '>' + $('#showstartprice' + i).text() + '</td></tr>')

            }

            $('#wrap_scroller').show();
            if (!jQuery("#tblServicesProductPrev thead").length) {
                jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Increment</th><th>Increment On</th><th>Last Invoice Price</th><th>Show H1 price</th><th>Show Start price</th></tr></thead>");
                jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#itemserviceexcel' + i).text() + '</td><td id=TPprev' + i + ' class=text-right>' + thousands_separators($('#TPexcel' + i).text()) + '</td><td id=quantityprev' + i + ' class=text-right>' + thousands_separators($('#quanexcel' + i).text()) + '</td><td id=dropuomprev' + i + '>' + $('#uom' + i).text() + '</td><td id=CPprev' + i + ' class=text-right>' + thousands_separators($('#BSPexcel' + i).text()) + '</td><td id=maskvendorprev' + i + '>' + $.trim($('#hideTP' + i).text()) + '</td><td id=minincrementprev' + i + ' class=text-right>' + thousands_separators($('#mininc' + i).text()) + '</td><td>' + incon + '</td><td id=LIPriceprev' + i + ' class=text-right>' + thousands_separators($("#LIPexcel" + i).text()) + '</td><td id=showhlpriceprev' + i + '>' + $('#showH1' + i).text() + '</td><td id=showstartpriceprev' + i + '>' + $('#showstartprice').val() + '</td></tr>')
            }
            else {
                jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#itemserviceexcel' + i).text() + '</td><td id=TPprev' + i + ' class=text-right>' + thousands_separators($('#TPexcel' + i).text()) + '</td><td id=quantityprev' + i + ' class=text-right>' + thousands_separators($('#quanexcel' + i).text()) + '</td><td id=dropuomprev' + i + '>' + $('#uom' + i).text() + '</td><td id=CPprev' + i + ' class=text-right>' + thousands_separators($('#BSPexcel' + i).text()) + '</td><td id=maskvendorprev' + i + '>' + $.trim($('#hideTP' + i).text()) + '</td><td id=minincrementprev' + i + ' class=text-right>' + thousands_separators($('#mininc' + i).text()) + '</td><td>' + incon + '</td><td id=LIPriceprev' + i + ' class=text-right>' + thousands_separators($("#LIPexcel" + i).text()) + '</td><td id=showhlpriceprev' + i + '>' + $('#showH1' + i).text() + '</td><td id=showstartpriceprev' + i + '>' + $('#showstartprice' + i).text() + '</td></tr>')
            }

            $('#wrap_scrollerPrev').show();
        })
        setTimeout(function () {
            $('#FAexcel').modal('hide');
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

    tableToExcelMultipleWorkSheet(['tblBiddetails', 'tblUOM'], ['DataTemplate', 'Instructions'], 'FAXLTemplate -' + postfix + '.xls')

});
function fnfillInstructionExcel() {
    $('#tblUOM').empty()

    $('#tblUOM').append('<thead><tr><th data-style="Header" colspan=2>Select HideTargetPrice (Y or N) as under:</th></tr></thead>')
    $('#tblUOM').append('<tr><td colspan=2>Y for Hide Target Price to all vendors</td></tr>');
    $('#tblUOM').append('<tr><td colspan=2>N for Show Target Price to all vendors</td></tr>');
    $('#tblUOM').append("<tr><td colspan=2>&nbsp;</td></tr><tr><td  colspan=2>&nbsp;</td></tr>")

    $('#tblUOM').append('<tr><th   colspan=2 data-style="Header">Select IncrementOn (A or P) as given below:</th></tr>')
    $('#tblUOM').append('<tr><td colspan=2>A - to select bid increment in Amount</td></tr>');
    $('#tblUOM').append('<tr><td colspan=2>P - to select bid increment in percentage</td></tr>');
    $('#tblUOM').append("<tr><td colspan=2>&nbsp;</td></tr><tr><td colspan=2>&nbsp;</td></tr>")

    $('#tblUOM').append('<tr><th data-style="Header"  colspan=2>Select ShowH1Price (Y or N) as given below:</th></tr>')
    $('#tblUOM').append('<tr><td  colspan=2>N - for not showing ongoing H1 Price to all vendor</td></tr>');
    $('#tblUOM').append('<tr><td  colspan=2>Y - for showing ongoing H1 Price to all vendors</td></tr>');
    $('#tblUOM').append("<tr><td  colspan=2>&nbsp;</td></tr><tr><td  colspan=2>&nbsp;</td></tr>")

    $('#tblUOM').append('<tr><th  colspan=2 data-style="Header">Select ShowStartPrice (Y or N) as given below:</th></tr>')
    $('#tblUOM').append('<tr><td  colspan=2>Y for Show start price to all vendors – vendors can not quote higher than this price</td></tr>');
    $('#tblUOM').append('<tr><td  colspan=2>N for Hide</td></tr>');
    $('#tblUOM').append("<tr><td  colspan=2>&nbsp;</td></tr><tr><td  colspan=2>&nbsp;</td></tr>")

    $('#tblUOM').append('<tr><th data-style="Header"  colspan=2>Please ensure all Prices and Quantity are in Number format, and Dates in Date format.</th></tr>')

    $('#tblUOM').append("<tr><td  colspan=2>&nbsp;</td></tr><tr><td  colspan=2>&nbsp;</td></tr>")

    $('#tblUOM').append('<tr><th   colspan=2 data-style="Header" colspan=2>Please enter UOM as given below:</th></tr>')
    var quorem = (allUOM.length / 2) + (allUOM.length % 2);
    for (var i = 0; i < parseInt(quorem); i++) {
        $('#tblUOM').append('<tr id=TR' + i + '><td>' + allUOM[i].uom + '</td>');
        var z = (parseInt(quorem) + i);
        if (z <= allUOM.length - 1) {
            $('#TR' + i).append('<td>' + allUOM[z].uom + '</td></tr>')
        }
    }

    $('#tblUOM').append("<tr><td colspan=2>&nbsp;</td><td>&nbsp;</td></tr>")
}
function CheckMask() {
    if ($('#drphideVendor').val() == "Y") {
        alert("You have chosen to Mask Participants. This will hide all vendor names");
    }
}
function ShowHidePrice() {
    if ($('#showstartprice').val() == "N") {
        alert("You have chosen to Hide Prices. This will be treated as an open auction");
    }
}