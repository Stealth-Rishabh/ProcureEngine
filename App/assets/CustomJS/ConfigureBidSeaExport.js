$("#cancelBidBtn").hide();

jQuery(document).ready(function () {
    $("#txtWeightageval,#txtlastinvoiceprice,#txtquantitiy,#txtCeilingPrice,#txtminimumdecreament,#txtitembidduration,#txtfloorPrice,#txtPriceReductionAmount").inputmask({//,#txttargetprice,#txtunitrate,#txtpovalue
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

});
$('#txtdestinationPort,#txtItemCode,#txtdescription,#txtbiddescriptionP,#txtBidSubject,#txtbiddescription,#txtConversionRate,#txtBidDuration,.maxlength').maxlength({
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
            fnApproversQuery(map[item].emailID, map[item].userID, map[item].userName);

        }
        else {
            gritternotification('Approver not selected. Please press + Button after selecting Approver!!!');
        }

        return item;
    }

});
var rowApp = 0;
var rowpreBidApp = 0;
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
        if (!jQuery("#tblapprovers thead").length) {
            jQuery("#tblapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td><a class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ',trAppidPrev' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td><a class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ',trAppidPrev' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }

        //** Pre Approvers
        if (!jQuery("#tblpreBidapprovers thead").length) {
            jQuery("#tblpreBidapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rowpreBidApp + '><td><a class="btn  btn-xs btn-danger" onclick="deletepreApprow(trpreAppid' + rowpreBidApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rowpreBidApp + '><td><a class="btn  btn-xs btn-danger" onclick="deletepreApprow(trpreAppid' + rowpreBidApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }

        $('#wrap_scrollerPrevApp').show();

        if (!jQuery("#tblapproversPrev thead").length) {

            jQuery("#tblapproversPrev,#tblpreBidapprovers1").append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblapproversPrev,#tblpreBidapprovers1").append('<tr id=trAppidPrev' + rowApp + '><td>' + UserName + '</td><td>' + EmailID + '</td><td class=hide>' + UserID + '</td><td>' + rowApp + '</td></tr>');
        }
        else {
            jQuery("#tblapproversPrev,#tblpreBidapprovers1").append('<tr id=trAppidPrev' + rowApp + '><td>' + UserName + '</td><td>' + EmailID + '</td><td class=hide>' + UserID + '</td><td>' + rowApp + '</td></tr>');
        }
    }
}
function deleteApprow(rowid, rowidPrev) {

    rowApp = rowApp - 1;
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();
    var rowCount = jQuery('#tblapprovers tr').length;
    var i = 1;
    if (rowCount > 1) {
        $("#tblapprovers tr:gt(0)").each(function () {
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
        if (!jQuery("#tblpreBidapprovers thead").length) {
            jQuery("#tblpreBidapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rowpreBidApp + '><td><a class="btn  btn-xs btn-danger" onclick="deletepreApprow(trpreAppid' + rowpreBidApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblpreBidapprovers").append('<tr id=trpreAppid' + rowpreBidApp + '><td><a class="btn  btn-xs btn-danger" onclick="deletepreApprow(trpreAppid' + rowpreBidApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowpreBidApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }

    }
}
function deletepreApprow(rowid) {

    rowpreBidApp = rowpreBidApp - 1;
    $('#' + rowid.id).remove();

    var rowCount = jQuery('#tblpreBidapprovers tr').length;
    var i = 1;
    if (rowCount > 1) {
        $("#tblpreBidapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            $.trim(this_row.find('td:eq(3)').html(i));
            i++;
        });
    }
}

var vendorsForAutoComplete;

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
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
        }

    });

}

var vCount = 0;
$("#chkAll").click(function () {

    if ($("#chkAll").is(':checked') == true) {
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        jQuery('#selectedvendorlists> tbody').empty()
        jQuery('#selectedvendorlistsPrev> tbody').empty()
        vCount = 0;
        $("#tblvendorlist> tbody > tr").each(function (index) {
            $(this).find("span#spanchecked").addClass("checked");
            $('#chkvender' + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
            var vendorid = $('#chkvender' + $.trim($(this).find('td:eq(0)').html())).val()
            var v = vCount;
            vCount = vCount + 1;
            var vname = $.trim($(this).find('td:eq(2)').html())
            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td class=tblcolweightage id=tblcolweightage' + vendorid + '>0</td><td class=hide>N</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorid + ',SelecetedVendorPrev' + vendorid + ',' + vendorid + ')"><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" id=Lambda' + vendorid + ' class="btn btn-xs btn-success lambdafactor" data-placement="left" data-original-title="Lambda factor can not be put in case Show L1 Price is selected Yes of this bid." onclick="addWeightageToVendor(' + vendorid + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td class=tblcolweightage id=tblcolweightagePrev' + vendorid + '>0</td><td class=hide>N</td></tr>')
            if (FlagForCheckShowPrice == "Y") {
                $('#Lambda' + vendorid).addClass('tooltips')
            }
            else {
                $('#Lambda' + vendorid).removeClass('tooltips')
            }
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
    if (FlagForCheckShowPrice == "Y") {
        $('.lambdafactor').attr("disabled", "disabled");
        // $('.tooltips').addClass('tooltips')
    }
    else {
        $('.lambdafactor').removeAttr("disabled", "disabled");
        //$('.tooltips').removeClass('tooltips')
    }

});
function Check(event, vname, vendorID) {


    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")
    }

    else {
        vCount = vCount + 1;
        var EvID = event.id;
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")
        if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {
            $('.THLoading').show()
            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td class=tblcolweightage id=tblcolweightage' + vendorID + '>0</td><td class=hide>N</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',SelecetedVendorPrev' + vendorID + ',' + vendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success lambdafactor tooltips" id=Lambda' + vendorID + ' data-toggle="tooltip"  data-placement="left" data-original-title="Lambda factor can not be put in case Show L1 Price is selected Yes of this bid." onclick="addWeightageToVendor(' + vendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td class=tblcolweightage id=tblcolweightagePrev' + vendorID + '>0</td><td class=hide>N</td></tr>')
        }
        else {
            $('.THLoading').hide()
            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td class="hide tblcolweightage" id=tblcolweightage' + vendorID + '>0</td><td class=hide>N</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',SelecetedVendorPrev' + vendorID + ',' + vendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success hide lambdafactor tooltips" id=Lambda' + vendorID + ' data-toggle="tooltip"  data-placement="left" data-original-title="Lambda factor can not be put in case Show L1 Price is selected Yes of this bid." onclick="addWeightageToVendor(' + vendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td class="hide tblcolweightage" id=tblcolweightagePrev' + vendorID + '>0</td><td class=hide>N</td></tr>')
        }
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

    if (FlagForCheckShowPrice == "Y") {
        //$('#Lambda' + vendorID).addClass('tooltips')
        $('.lambdafactor').tooltip();
        $('.lambdafactor').attr("disabled", "disabled");
    }
    else {
        $('.lambdafactor').removeAttr("disabled", "disabled");
        // $('#Lambda' + vendorID).removeClass('tooltips')
    }

}

function addWeightageToVendor(index) {
    $("#hdnweightageIndex").val(index);
    $("#txtWeightageval").val($("#tblcolweightage" + index).html())
    $("#weightageModal").modal('show');
}

$("#weightageModal").on("hidden.bs.modal", function () {
    var weightageval = $("#txtWeightageval").val()
    $("#txtWeightageval").val('')
    $("#tblcolweightage" + $("#hdnweightageIndex").val()).html(weightageval);
    $("#tblcolweightagePrev" + $("#hdnweightageIndex").val()).html(weightageval);
});

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

    //if ($("#selectedvendorlists > tbody > tr").length > 0) {
    if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {
        //$("#selectedvendorlists> tbody > tr").each(function (index) {

        //    i = i + 1;
        //    if (i >= 2) {

        //        status = "True";
        //    }
        //    else {
        //        status == "false";
        //    }

        //});
        if ($("#selectedvendorlists> tbody > tr").length < 2) {
            status == "false";
        }
        else {
            status = "True";
        }
    }
    else {
        //$("#tblvendorlist> tbody > tr").each(function (index) {

        //    if ($(this).find("span#spanchecked").attr('class') == 'checked') {
        //        i = i + 1;
        //        if (i >= 2) {

        //            status = "True";
        //        }
        //        else {
        //            status == "false";
        //        }

        //    }

        //});
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

var allUsers = '';
function fetchRegisterUser() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
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
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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


////  validation parts ///////



var error = $('.alert-danger');
var success = $('.alert-success');

var form = $('#submit_form');
var FlagForCheckShowPrice = "N";
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


                    ddlbidclosetype: {
                        required: true

                    },
                    txtBidSubject: {
                        required: true,
                        maxlength: 2000,

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
                    txtdestinationPort: {
                        required: true,
                        maxlength: 200
                    },
                    txtItemCode: {
                        maxlength: 50
                    },
                    txtdescription: {
                        maxlength: 2000
                    },
                    txtbiddescriptionP: {
                        //required: true,
                        maxlength: 200
                    },
                    txtquantitiy: {
                        required: true,
                        //maxlength: 9,
                        number: true,
                        notEqualTo: 0
                    },
                    txttargetprice: {
                        maxlength: 50,
                        number: true
                    },
                    txtCeilingPrice: {
                        required: true,
                        notEqualTo: 0,
                        maxlength: 50,

                    },
                    txtminimumdecreament: {
                        required: true
                    },
                    txtitembidduration: {
                        required: true,
                        number: true,
                        maxlength: 3
                    },
                    txtfloorPrice: {
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

                    txtlastinvoiceprice: {
                        number: true,
                        maxlength: 50
                    },

                    txtunitrate: {
                        number: true,
                        maxlength: 50
                    },
                    txtpovalue: {
                        number: true,
                        maxlength: 50
                    }
                },

                messages: {

                    'payment[]': {

                        required: "Please select at least one option",
                        minlength: jQuery.validator.format("Please select at least one option")

                    },
                    txtitembidduration: {
                        required: "Please Enter Bid Duration."
                    }

                },

                errorPlacement: function (error, element) {

                    if (element.attr("name") == "txtPODate") {
                        error.insertAfter("#daterr");
                    }
                    else {

                        error.insertAfter(element);

                    }

                    if ($("#txtPODate").closest('.input-group').attr('class') == 'input-group has-error') {
                        $("#btncal").css("margin-top", "-22px");

                    }


                },

                invalidHandler: function (event, validator) {
                    success.hide();
                    Metronic.scrollTo(error, -200);

                },

                highlight: function (element) {

                    $(element).closest('.inputgroup').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-4').removeClass('has-success').addClass('has-error');
                    $(element).closest('.col-md-3,.xyz').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element).closest('.inputgroup').removeClass('has-error');
                    $(element).closest('.col-md-4').removeClass('has-error');
                    $(element).closest('.col-md-3,.xyz').removeClass('has-error');

                },

                success: function (label) {

                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {

                        label.closest('.inputgroup').removeClass('has-error').addClass('has-success');
                        label.closest('.col-md-4,.xyz').removeClass('has-error').addClass('has-success');
                        label.remove();

                    } else {

                        label.addClass('valid').closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group

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


            var displayConfirm = function () {

                $('#tab4 .form-control-static', form).each(function () {

                    var input = $('[name="' + $(this).attr("data-display") + '"]', form);

                    if (input.is(":radio")) {

                        input = $('[name="' + $(this).attr("data-display") + '"]:checked', form);

                    }

                    if (input.is(":text") || input.is("textarea")) {

                        $(this).html(input.val());

                    } else if (input.is("select")) {

                        $(this).html(input.find('option:selected').text());

                    } else if (input.is(":radio") && input.is(":checked")) {

                        $(this).html(input.attr("data-title"));

                    } else if ($(this).attr("data-display") == 'payment') {

                        var payment = [];

                        $('[name="payment[]"]:checked').each(function () {

                            payment.push($(this).attr('data-title'));

                        });

                        $(this).html(payment.join("<br>"));

                    }

                });

            }
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

                    displayConfirm();

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
                        else {
                            Dateandtimevalidate('index1')
                            //ConfigureBidForSeaExportTab1();
                            showhideItemBidDuration();
                        }

                    }
                    else if (index == 2) {

                        if ($('#tblServicesProduct >tbody >tr').length == 0) {
                            $('#spandanger').html('please Configure Bid parameters..')
                            $('.alert-danger').show();
                            Metronic.scrollTo($('.alert-danger'), -200);
                            $('.alert-danger').fadeOut(5000);

                            return false;
                        }

                        else {
                            FlagForCheckShowPrice = 'N';
                            var i = 0;
                            $("#tblServicesProduct tr:gt(0)").each(function () {
                                // var this_row = $(this); 
                                if ($.trim($('#maskL1' + i).html()) == "Y") {
                                    FlagForCheckShowPrice = 'Y';
                                    i++;
                                    return false;
                                }
                            })

                            if (FlagForCheckShowPrice == "Y") {
                                $('.lambdafactor').attr("disabled", "disabled");
                                $('.tblcolweightage').text('0')
                            }
                            else {
                                $('.lambdafactor').removeAttr("disabled", "disabled");
                            }

                            /* if ($('#hdnRfiRfqID').val() != '0' && $('#hdnRfiRfqID').val() != '' && $('#hdnRfiRfqID').val() != null) {
                                 fnfetchRFQVendor();
                             }*/
                            if ($("#txtBidDuration").val() == '0') {
                                $('#form_wizard_1').bootstrapWizard('previous');
                                //$(".alert-danger").find("span").html('').html('Bid Duration can not be zero.')
                                $('#spandanger').html('Bid Duration can not be zero.');
                                Metronic.scrollTo(error, -200);
                                $(".alert-danger").show();
                                $(".alert-danger").fadeOut(5000);

                                return false;
                            }
                            else {
                                ConfigureBidForSeaExportTab2()
                            }
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

sessionStorage.setItem('CurrentBidID', 0)
function ConfigureBidForSeaExportTab1() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';
    var AttachementFileName = '';
    BidDuration = 0;

    if ($("#ddlAuctiontype option:selected").val() == 81) {
        _bidType = $("#ddlAuctiontype option:selected").val();
    }
    else if ($("#ddlAuctiontype option:selected").val() == 82) {
        _bidType = $("#ddlAuctiontype option:selected").val();
    }
    else {
        _bidType = $("#ddlAuctiontype option:selected").val();
    }

    if (jQuery("#txtBidDuration").val() != '' && jQuery("#txtBidDuration").val() != null && jQuery("#txtBidDuration").val() != "0") {
        BidDuration = jQuery("#txtBidDuration").val();

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
    TermsConditionFileName = TermsConditionFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters
    AttachementFileName = AttachementFileName.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_'); //Replace special Characters



    var approvers = '';
    var rowCount = jQuery('#tblapprovers tr').length;
    if (rowCount > 1) {
        $("#tblapprovers tr:gt(0)").each(function () {
            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';

        })
    }
    //debugger;
    var StartDT = new Date();
    if ($('#txtbidDate').val() != null && $('#txtbidDate').val() != "") {
        StartDT = new Date($('#txtbidDate').val().replace('-', ''));
        //StartDT = moment(StartDT).format('DD/MM/YYYY h:mm:ss a');
    }
    var Tab1Data = {

        "BidId": parseInt(sessionStorage.getItem('CurrentBidID')),
        "BidSubject": jQuery("#txtBidSubject").val(),
        "BidDescription": jQuery("#txtbiddescription").val(),
        "BidDate": StartDT,//moment(jQuery("#txtbidDate").val(), "DD/MM/YYYY"),// new Date(jQuery("#txtbidDate").val()),"BidDate": jQuery("#txtbidDate").val(),
        //"BidTime": jQuery("#txtbidTime").val(),
        "BidDuration": parseInt(BidDuration),
        "CurrencyID": parseInt(jQuery("#dropCurrency option:selected").val()),
        "BidTypeID": 7,
        "BidForID": parseInt(jQuery("#ddlAuctiontype option:selected").val()),
        "ContinentId": 0,
        "CountryID": 0,
        "ConversionRate": parseFloat(jQuery("#txtConversionRate").val()),
        "TermsConditions": TermsConditionFileName,
        "Attachment": AttachementFileName,
        "UserId": sessionStorage.getItem('UserID'),
        "BidApprovers": approvers,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "BidClosetype": $('#ddlbidclosetype').val(),
        "ShowRankToVendor": $('#drpshowL1L2').val(),
        "NoofBidExtension": parseInt($("#txtBidExtension").val()),
        "NoOfStaggerItems": parseInt($("#txtStaggerNo").val()),
        "HideVendor": $('#drphideVendor').val()
    };
    //alert(JSON.stringify(Tab1Data));

    //console.log(JSON.stringify(Tab1Data))
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsSeaExport/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(Tab1Data),
        dataType: "json",

        success: function (data) {
            if ($('#ddlAuctiontype option:selected').val() == "83") {
                $('#checkmaskL1price').val("Y").attr("disabled", true);
                var i = 0;
                $("#tblServicesProduct tr:gt(0)").each(function () {
                    //var this_row = $(this);
                    $('#maskL1' + i).text("Y")
                    i++;
                });
            }
            else {
                $('#checkmaskL1price').val("N").attr("disabled", false);
            }
            if ($('#ddlbidclosetype option:selected').val() == "S") {
                $('.itemclass').removeClass('hide')
            }
            else {
                $('.itemclass').addClass('hide')
                $('.itemclass').val(0)
            }
            if (window.location.search) {
                var param = getUrlVars()["param"]
                var decryptedstring = fndecrypt(param)
                sessionStorage.setItem('CurrentBidID', getUrlVarsURL(decryptedstring)["BidID"])

            }
            else {
                sessionStorage.setItem('CurrentBidID', parseInt(data))
            }
            if ($("#ddlAuctiontype option:selected").val() == '81' || $("#ddlAuctiontype option:selected").val() == '83') {
                $(".for-nondutch-bid").show();
                $(".for-dutch-bid").hide();
                $('#divBSP').removeClass('col-md-4').addClass('col-md-3')

            }
            else if ($("#ddlAuctiontype option:selected").val() == '82') {
                $(".for-nondutch-bid").hide();
                $(".for-dutch-bid").show();
                $('#divBSP').removeClass('col-md-3').addClass('col-md-4')
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
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();

        }

    });
    $('#txtselectedCurrency').val(jQuery("#dropCurrency option:selected").text());
    jQuery.unblockUI();

}

//*** File delete from Blob or DB 
function ajaxFileDelete(closebtnid, fileid, filepath, deletionFor) {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var data = {
        "filename": $('#' + filepath).html(),
        "foldername": 'Bid/' + sessionStorage.getItem('CurrentBidID')

    }
    //console.log(JSON.stringify(data))
    $.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/DeleteFiles/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {

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
        "BidTypeID": 7,
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
            $('#' + filepath).html('')
            $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
            $('#' + fileid).attr('disabled', false);
            $('#spansuccess1').html('File Deleted Successfully');
            success.show();
            Metronic.scrollTo(success, -200);
            success.fadeOut(5000);
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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

var totalitemdurationstagger = 0;

function ConfigureBidForSeaExportTab2() {
    var targetPrice;
    var unitrate = 0
    BidDuration = 0;
    var povalue = 0;
    var itmduartion = 0, i = 0;
    var tab2Items = '', PriceDetails = [];
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    totalitemdurationstagger = 0;
    var rowCount = jQuery('#tblServicesProduct tr').length;
    if (rowCount > 1) {
        if ($('#ddlAuctiontype option:selected').val() == "81" || $('#ddlAuctiontype option:selected').val() == "83") {
            var ItemStatus = 'Open';
            $("#tblServicesProduct tr:gt(0)").each(function () {

                targetPrice = 0
                unitrate = 0;
                povalue = 0, i = 1, itmduartion = 0; tab2Data = '';
                var this_row = $(this);


                if ($.trim(this_row.find('td:eq(6)').html()) != '') {
                    targetPrice = $.trim(this_row.find('td:eq(6)').html());
                }
                if ($.trim(this_row.find('td:eq(18)').html()) != '') {
                    unitrate = removeThousandSeperator($.trim(this_row.find('td:eq(18)').html()));
                }
                if ($.trim(this_row.find('td:eq(22)').html()) != '') {
                    povalue = removeThousandSeperator($.trim(this_row.find('td:eq(22)').html()));
                }
                var remark = $.trim(this_row.find('td:eq(5)').html()).replace(/'/g, "");
                var description = $.trim(this_row.find('td:eq(4)').html()).replace(/'/g, "");
                if ($('#ddlbidclosetype').val() == "A") {
                    itmduartion = 0;
                    BidDuration = BidDuration + 0;
                }
                else {
                    itmduartion = $.trim(this_row.find('td:eq(15)').html());

                    BidDuration = parseInt(BidDuration) + parseInt($.trim(this_row.find('td:eq(15)').html()))
                    totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt($.trim(this_row.find('td:eq(15)').html()))

                }

                tab2Items = {
                    "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
                    "ItemCode": $.trim(this_row.find('td:eq(2)').html()),
                    "DestinationPort": $.trim(this_row.find('td:eq(3)').html()),
                    "Description": description,
                    "Targetprice": parseFloat(removeThousandSeperator(targetPrice)),
                    "Quantity": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(7)').html()))),
                    "UOM": $.trim(this_row.find('td:eq(8)').html()),
                    "LastInvoicePrice": parseFloat(unitrate),
                    "ItemBidDuration": parseInt(itmduartion),
                    "Remarks": remark,
                    "CeilingPrice": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(9)').html()))),
                    "MaskVendor": $.trim(this_row.find('td:eq(10)').html()),
                    "MinimumDecreament": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(11)').html()))),
                    "DecreamentOn": $.trim(this_row.find('td:eq(13)').html()),
                    "SelectedCurrency": $.trim($('#dropCurrency option:selected').text()),
                    "ItemStatus": ItemStatus,
                    "MaskL1Price": $.trim(this_row.find('td:eq(16)').html()),
                    "ShowStartPrice": $.trim(this_row.find('td:eq(17)').html()),
                    "PoUnitRate": parseFloat(unitrate),
                    "PoNo": $.trim(this_row.find('td:eq(19)').html()),
                    "PoVendorName": $.trim(this_row.find('td:eq(20)').html()),
                    "PoDate": $.trim(this_row.find('td:eq(21)').html()),
                    "PoValue": parseFloat(povalue),
                    "PullRFQID": parseInt($.trim(this_row.find('td:eq(23)').html())),
                    "RFQParameterID": parseInt($.trim(this_row.find('td:eq(24)').html())),
                    "StartingPrice": 0,
                    "PriceDecreamentAmount": 0,
                    "PriceDecreamentFrequency": 0
                }

                if ($('#ddlbidclosetype').val() != "A") {
                    ItemStatus = 'Inactive';
                }
                PriceDetails.push(tab2Items)
            });
            sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger);
        }
        else {
            if ($("#txtBidDuration").val() != '0') {
                BidDuration = $("#txtBidDuration").val();
            }
            $("#tblServicesProduct> tbody > tr").each(function (index) {
                targetPrice = 0
                unitrate = 0;
                povalue = 0, tab2Data = '', ItemStatus = '', itmduartion = 0;;

                if ($("#TP" + index).text() != '') {
                    targetPrice = removeThousandSeperator($("#TP" + index).text());
                }
                if ($("#unitrate" + index).text() != '') {
                    unitrate = removeThousandSeperator($("#unitrate" + index).text());
                }
                if ($("#povalue" + index).text() != '') {
                    povalue = removeThousandSeperator($("#povalue" + index).text());
                }
                var remark = $("#remarks" + index).text().replace(/'/g, "");
                tab2Items = {
                    "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
                    "ItemCode": $("#itemcode" + index).text(),
                    "DestinationPort": $("#destinationport" + index).text(),
                    "Description": "",
                    "Targetprice": parseFloat(targetPrice),
                    "Quantity": parseFloat(removeThousandSeperator($("#quan" + index).text())),
                    "UOM": $("#uom" + index).text(),
                    "LastInvoicePrice": parseFloat(unitrate),
                    "ItemBidDuration": parseInt(itmduartion),
                    "Remarks": remark,
                    "CeilingPrice": parseFloat(removeThousandSeperator($("#CP" + index).text())),
                    "MaskVendor": $('#checkmaskvendor' + index).text(),
                    "MinimumDecreament": 0,
                    "DecreamentOn": "A",
                    "SelectedCurrency": $.trim($('#dropCurrency option:selected').text()),
                    "ItemStatus": ItemStatus,
                    "MaskL1Price": "N",
                    "ShowStartPrice": "N",
                    "PoUnitRate": parseFloat(unitrate),
                    "PoNo": $("#pono" + index).text(),
                    "PoVendorName": $("#povendorname" + index).text(),
                    "PoDate": $("#podate" + index).text(),
                    "PoValue": parseFloat(povalue),
                    "PullRFQID": 0,
                    "RFQParameterID": 0,
                    "StartingPrice": parseFloat(removeThousandSeperator($("#floorprice" + index).text())),
                    "PriceDecreamentAmount": parseFloat(removeThousandSeperator($("#pricedecreament" + index).text())),
                    "PriceDecreamentFrequency": parseInt($("#pricedecreamentfeq" + index).text())

                }
                PriceDetails.push(tab2Items)
            })
        }
    }
    // console.log(JSON.stringify(Tab2data))
    var Tab2data = {
        "ProductDetails": PriceDetails,
        "bidID": parseInt(sessionStorage.getItem('CurrentBidID')),
        "UserId": sessionStorage.getItem('UserID'),
        "BidDuration": parseInt(BidDuration),
        "BidClosingType": $('#ddlbidclosetype option:selected').val()

    };

    // alert(JSON.stringify(Tab2data))
    //console.log(JSON.stringify(Tab2data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsSeaExportTab2/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab2data),
        dataType: "json",
        success: function (data) {
            if ($('#hdnRfiRfqID').val() != '0' && $('#hdnRfiRfqID').val() != '' && $('#hdnRfiRfqID').val() != null) {
                console.log($('#hdnRfiRfqID').val())
                fnfetchRFQVendor();
            }
            if ($('#ddlbidclosetype').val() == "S") {
                $('#txtBidDuration').val(BidDuration)
                fetchSeaExportDetails();
            }
            return true;



        },
        error: function (xhr, status, error) {
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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

function ConfigureBidForSeaExportTab3() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var InsertQuery = '';
    $("#selectedvendorlistsPrev> tbody > tr").each(function (index) {
        if ($.trim($(this).find('td:eq(0)').html()) != 'undefined' && $.trim($(this).find('td:eq(0)').html()) != "" && $.trim($(this).find('td:eq(0)').html()) != null) {
            InsertQuery = InsertQuery + $.trim($(this).find('td:eq(0)').html()) + '~' + removeThousandSeperator($.trim($(this).find('td:eq(2)').html())) + '~' + $.trim($(this).find('td:eq(3)').html()) + '#';
            //InsertQuery = InsertQuery + "select " + sessionStorage.getItem('CurrentBidID') + "," + $.trim($(this).find('td:eq(0)').html()) + "," + $.trim($(this).find('td:eq(2)').html()) + ",'" + $.trim($(this).find('td:eq(3)').html()) + "' union all ";
        }
        else {
            $('.alert-danger').show();
            $('#spandanger').html('Some Error in Vendor Selection.Please Select again');
            Metronic.scrollTo($(".alert-danger"), -200);
            $("#tblvendorlist> tbody > tr").each(function (index) {
                $(this).find("span#spanchecked").removeClass("checked");
                $('input[name="chkvender"]').prop('disabled', false);
                jQuery('#selectedvendorlists> tbody').empty()
                jQuery('#selectedvendorlistsPrev> tbody').empty()
            });
            $('.alert-danger').fadeOut(10000)
            return false;
        }
    });

    var Tab3data = {
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
        data: JSON.stringify(Tab3data),
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

function ConfigureBidForSeaExportandSave() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if (sessionStorage.getItem("BidPreApp") == "N") {
        bidDuration = $("#txtBidDuration").val();
        if (bidDuration == '0' || bidDuration == '') {

            //$('#form_wizard_1').bootstrapWizard('previous');
            $('#spandanger').html("The Event Duration can not be '0'. Please check your bid again.");
            // $(".alert-danger").find("span").html('').html("The Event Duration can not be '0'. Please check your bid again. ")
            Metronic.scrollTo(error, -200);
            $(".alert-danger").show();
            $(".alert-danger").fadeOut(5000);
            jQuery.unblockUI();
            return false;
        }
        else {
            var Tab3data = {
                "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
                "UserID": sessionStorage.getItem('UserID'),
                //"BidSubject": jQuery("#txtBidSubject").val(),
                //"BidDescription": jQuery("#txtbiddescription").val(),
                //"BidDate": jQuery("#txtbidDate").val(),
                // "BidTime": jQuery("#txtbidTime").val(),
                "BidTypeID": 7,
                "CustomerID": parseInt(sessionStorage.getItem('CustomerID'))
            };
            // console.log(JSON.stringify(Tab3data))
            jQuery.ajax({

                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidForSeaExportandSave/",
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
                    var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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
    }
    else {
        fnOpenPopupBidpreApprover();
        jQuery.unblockUI();
    }
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
        "BidTypeID": 7,
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


$("#txtbidDate").change(function () {

    if ($("#txtbidDate").val() == '') { }

    else {

        $("#txtbidDate").closest('.inputgroup').removeClass('has-error');

        $("#txtbidDate").closest('.inputgroup').find('span').hide();

        $("#txtbidDate").closest('.inputgroup').find('span.input-group-btn').show();

        $("#txtbidDate").closest('.inputgroup').find("#btncal").css("margin-top", "0px");

    }

});

var FileseqNo = 0;
//*** Add Items in Local table 
function InsUpdSeaExport() {
    debugger;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />Please Wait...</h5>' });
    if (form.valid() == true) {
        var st = "true"
        var i = 0;
        if ($('#add_or').text() == "Modify") {
            st = "true";

            $("#tblServicesProduct tr:gt(0)").each(function () {

                if ($.trim($('#destinationport' + i).html()) == $('#txtdestinationPort').val() && $.trim($('#remarks' + i).html()) != $('#txtbiddescriptionP').val() && $.trim($('#TP' + i).html()) != $('#txttargetprice').val() && $.trim($('#quan' + i).html()) != $("#txtquantitiy").val() && $.trim($('#uom' + i).html()) != $("#dropuom").val() && $.trim($('#CP' + i).html()) != $('#txtCeilingPrice').val() && $.trim($('#maskvendor' + i).html()) != $('#checkmaskvendor option:selected').val() && $.trim($('#mindec' + i).html()) != $('#txtminimumdecreament').val() && $.trim($('#deconval' + i).html()) != $('#drpdecreamenton option:selected').val() && $.trim($('#LIP' + i).html()) != $('#txtlastinvoiceprice').val() && $.trim($('#itemdura' + i).html()) != $("#txtitembidduration").val()) {
                    st = "false"
                }
                i++;
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
            else if (parseFloat(removeThousandSeperator($('#txtminimumdecreament').val())) > parseFloat(removeThousandSeperator($('#txtCeilingPrice').val()))) {
                error.show();
                $('#spandanger').html('Minimum decrement should be less than bid start price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ((parseFloat(removeThousandSeperator($('#txtfloorPrice').val())) + parseFloat(removeThousandSeperator($('#txtPriceReductionAmount').val()))) >= parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())) && $("#ddlAuctiontype option:selected").val() == 82) {
                error.show();
                $('#spandanger').html('Bid start price should not be less than Floor Price + Price Decrement amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ($('#txtPriceReductionAmount').is(":visible") && parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val())) > parseFloat(removeThousandSeperator($('#txtCeilingPrice').val()))) {

                error.show();
                $('#spandanger').html('Price decrement amount should be less than starting price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }

            else if ($('#txtPriceReductionAmount').is(":visible") && parseFloat(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= parseFloat((removeThousandSeperator($('#txtCeilingPrice').val()) - removeThousandSeperator($('#txtfloorPrice').val())) / removeThousandSeperator($('#txtPriceReductionFrequency').val())) && ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83)) {

                error.show();
                $('#spandanger').html('Please enter valid Price Decrement amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ($('#txtPriceReductionAmount').is(":visible") && parseFloat(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= (parseFloat(removeThousandSeperator($('#txtfloorPrice').val())) - parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())) / 2) && $("#ddlAuctiontype option:selected").val() == 82) {

                error.show();
                $('#spandanger').html('Please enter valid Price Decrement amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ((parseFloat($('#txtminimumdecreament').val()) > parseInt(20) && $("#drpdecreamenton option:selected").val() == "P")) {
                error.show();
                $('#spandanger').html('Minimum decrement should be less than 20%.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if (parseInt($('#txtminimumdecreament').val()) > parseFloat(20 * (removeThousandSeperator($('#txtCeilingPrice').val())) / 100) && $("#drpdecreamenton option:selected").val() == "P") {
                error.show();
                $('#spandanger').html('Minimum decrement should be less than 20% of Bid Start Price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                return false;
            }
            else {


                //Set data on main Table after edit
                var Description = $('#txtdescription').val().replace(/\n/g, '<br />').replace(/'/g, " ")
                var remarks = $('#txtbiddescriptionP').val().replace(/\n/g, '<br />').replace(/'/g, " ")
                var this_row = $('#rowid').val();
                $("#itemcode" + this_row).text($('#txtItemCode').val())
                $("#destinationport" + this_row).text($('#txtdestinationPort').val())
                // $("#desc" + this_row).find("td:eq(3)").text(Description)
                $("#remarks" + this_row).text(remarks)

                $("#TP" + this_row).text($('#txttargetprice').val())

                $("#quan" + this_row).text($('#txtquantitiy').val())
                $("#uom" + this_row).text($('#dropuom').val())

                $("#CP" + this_row).text($('#txtCeilingPrice').val())

                $("#maskvendor" + this_row).text($('#checkmaskvendor option:selected').val())

                $("#mindec" + this_row).text($('#txtminimumdecreament').val())

                $("#decon" + this_row).text($('#drpdecreamenton option:selected').text())
                $("#deconval" + this_row).text($('#drpdecreamenton option:selected').val())
                $("#LIP" + this_row).text($('#txtlastinvoiceprice').val())
                $("#itemdura" + this_row).text($("#txtitembidduration").val())
                $("#maskL1" + this_row).text($('#checkmaskL1price option:selected').val())
                $("#showstart" + this_row).text($('#checkshowstartprice option:selected').val())

                $("#unitrate" + this_row).text($('#txtunitrate').val())
                $("#pono" + this_row).text($('#txtPono').val())
                $("#povendorname" + this_row).text($('#txtvendorname').val())
                $("#podate" + this_row).text($('#txtPODate').val())
                $("#povalue" + this_row).text($('#txtpovalue').val())
                $("#floorprice" + this_row).text($('#txtfloorPrice').val())
                $("#pricedecreament" + this_row).text($('#txtPriceReductionAmount').val())
                $("#pricedecreamentfeq" + this_row).text($('#txtPriceReductionFrequency').val())



                //For Preview Table
                $("#itemcodeprev" + this_row).text($('#txtItemCode').val())
                $("#destinationportprev" + this_row).text($('#txtdestinationPort').val())
                // $("#desc" + this_row).find("td:eq(3)").text(Description)
                $("#remarksprev" + this_row).text(remarks)

                $("#TPprev" + this_row).text($('#txttargetprice').val())

                $("#quanprev" + this_row).text($('#txtquantitiy').val())
                $("#uomprev" + this_row).text($('#dropuom').val())

                $("#CPprev" + this_row).text($('#txtCeilingPrice').val())

                $("#maskvendorprev" + this_row).text($('#checkmaskvendor option:selected').val())

                $("#mindecprev" + this_row).text($('#txtminimumdecreament').val())

                $("#deconprev" + this_row).text($('#drpdecreamenton option:selected').text())
                $("#deconvalprev" + this_row).text($('#drpdecreamenton option:selected').val())
                $("#LIPprev" + this_row).text($('#txtlastinvoiceprice').val())
                $("#itemduraprev" + this_row).text($("#txtitembidduration").val())
                $("#maskL1prev" + this_row).text($('#checkmaskL1price option:selected').val())
                $("#showstartprev" + this_row).text($('#checkshowstartprice option:selected').val())
                $("#floorpriceprev" + this_row).text($('#txtfloorPrice').val())
                $("#pricedecreamentprev" + this_row).text($('#txtPriceReductionAmount').val())
                $("#pricedecreamentfeqprev" + this_row).text($('#txtPriceReductionFrequency').val())

                $("#unitrateprev" + this_row).text($('#txtunitrate').val())
                $("#ponoprev" + this_row).text($('#txtPono').val())
                $("#povendornameprev" + this_row).text($('#txtvendorname').val())
                $("#podateprev" + this_row).text($('#txtPODate').val())
                $("#povalueprev" + this_row).text($('#txtpovalue').val())
                if ($('#ddlbidclosetype option:selected').val() == "S") {
                    $('.itemclass').removeClass('hide')
                }
                else {
                    $('.itemclass').addClass('hide')
                }
                if ($("#ddlAuctiontype option:selected").val() != '81' && $("#ddlAuctiontype option:selected").val() != 83) {

                    BidDuration = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtfloorPrice").val())) / removeThousandSeperator($("#txtPriceReductionAmount").val())) * $("#txtPriceReductionFrequency").val()) + parseInt($("#txtPriceReductionFrequency").val());
                    $("#txtBidDuration").val(parseInt(BidDuration));
                    $("#txtBidDurationPrev").text(parseInt(BidDuration))
                }
                resetfun();

            }

        }

        else {
            st = "true"; i = 0;

            if (parseFloat(removeThousandSeperator($('#txtminimumdecreament').val())) > parseFloat(removeThousandSeperator($('#txtCeilingPrice').val()))) {
                error.show();
                $('#spandanger').html('Minimum decrement should be less than bid start price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;
            }
            else if ((parseFloat($('#txtminimumdecreament').val()) > parseInt(20) && $("#drpdecreamenton option:selected").val() == "P")) {
                error.show();
                $('#spandanger').html('Minimum decrement should be less than 20%.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;
            }
            else if ((parseFloat(removeThousandSeperator($('#txtfloorPrice').val())) + parseFloat(removeThousandSeperator($('#txtPriceReductionAmount').val()))) >= parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())) && $("#ddlAuctiontype option:selected").val() == 82) {
                error.show();
                $('#spandanger').html('Bid start price Price should not be less than Floor + Price Decrement amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;
            }
            else if ($('#txtPriceReductionAmount').is(":visible") && parseFloat(removeThousandSeperator($('#txtPriceReductionAmount').val())) > parseFloat(removeThousandSeperator($('#txtCeilingPrice').val()))) {

                error.show();
                $('#spandanger').html('Price decrement amount should be less than starting price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }

            else if ($('#txtPriceReductionAmount').is(":visible") && parseFloat(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= parseFloat((removeThousandSeperator($('#txtCeilingPrice').val()) - removeThousandSeperator($('#txtfloorPrice').val())) / removeThousandSeperator($('#txtPriceReductionFrequency').val())) && ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83)) {

                error.show();
                $('#spandanger').html('Please enter valid Price Decrement amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if ($('#txtPriceReductionAmount').is(":visible") && parseFloat(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= parseFloat(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= (parseFloat(removeThousandSeperator($('#txtCeilingPrice').val())) - parseFloat(removeThousandSeperator($('#txtfloorPrice').val()))) / 2 && $("#ddlAuctiontype option:selected").val() == 82) {
                error.show();
                $('#spandanger').html('Please enter valid Price Decrement amount.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }
            else if (parseInt($('#txtminimumdecreament').val()) > parseFloat(20 * (removeThousandSeperator($('#txtCeilingPrice').val())) / 100) && $("#drpdecreamenton option:selected").val() == "P") {
                error.show();
                $('#spandanger').html('Minimum decrement should be less than 20% of Bid Start Price.');
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
                        if ($.trim($('#destinationport' + i).html()) == $('#txtdestinationPort').val()) {
                            status = "false"
                        }
                        i++;
                    });


                    if (status == "false") {
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
        $('#spandanger').html('You can not add more than one item for Dutch Auction.');
        //$(".alert-danger").find("span").html('').html('You can not add more than one item for Dutch Auction.')
        Metronic.scrollTo(error, -200);
        $(".alert-danger").show();
        $(".alert-danger").fadeOut(5000);
        resetfun();
        return false;
    }
    if ($("#ddlAuctiontype option:selected").val() != '81' && jQuery("#ddlAuctiontype option:selected").val() != '83') {
        BidDuration = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtfloorPrice").val())) / removeThousandSeperator($("#txtPriceReductionAmount").val())) * $("#txtPriceReductionFrequency").val()) + parseInt($("#txtPriceReductionFrequency").val());
        $("#txtBidDuration").val(parseInt(BidDuration));
        $("#txtBidDurationPrev").text(parseInt(BidDuration));

    }

    var i;
    i = rowAppItems;
    var status = $('#checkmaskvendor option:selected').val();
    var MaskL1Price = $('#checkmaskL1price option:selected').val();
    var ShowStartPrice = $('#checkshowstartprice option:selected').val();

    var itemBidDuration = 0;

    if ($("#txtlastinvoiceprice").val() == null || $("#txtlastinvoiceprice").val() == '') {
        $("#txtlastinvoiceprice").val('0')
    }

    if ($("#txttargetprice").val() == null || $("#txttargetprice").val() == '') {
        $("#txttargetprice").val('0')
    }

    if ($("#txtitembidduration").css('visibility') == 'visible') {
        itemBidDuration = $("#txtitembidduration").val()

    }
    if ($("#ddlAuctiontype").val() == 81 || $("#ddlAuctiontype").val() == 83) {
        if (!jQuery("#tblServicesProduct thead").length) {
            jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th 'width:20%!important;'></th><th>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last Invoice Price</th><th class=itemclass>Bid Duration (in mins)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td  style="width:20%!important;" id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationport' + i + ' >' + $('#txtdestinationPort').val() + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarks' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TP' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uom' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendor' + i + ' >' + status + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=decon' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=deconval' + i + ' >' + $("#drpdecreamenton").val() + '</td><td class="text-right hide" id=LIP' + i + ' >' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class=itemclass id=itemdura' + i + '  >' + itemBidDuration + '</td><td id=maskL1' + i + '>' + MaskL1Price + '</td><td id=showstart' + i + ' >' + ShowStartPrice + '</td><td class=text-right id=unitrate' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=pono' + i + ' >' + $("#txtPono").val() + '</td><td id=povendorname' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td><td class=hide id=pullrfqid' + i + '>0</td><td class=hide id=rfqparameterid' + i + '>0</td></tr>');
        }
        else {

            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn  btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td style="width:20%!important;" id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationport' + i + ' >' + $('#txtdestinationPort').val() + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarks' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TP' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uom' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendor' + i + ' >' + status + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=decon' + i + ' >' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=deconval' + i + ' >' + $("#drpdecreamenton").val() + '</td><td class="text-right hide" id=LIP' + i + ' >' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class=itemclass id=itemdura' + i + ' >' + itemBidDuration + '</td><td id=maskL1' + i + ' >' + MaskL1Price + '</td><td id=showstart' + i + ' >' + ShowStartPrice + '</td><td class=text-right id=unitrate' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=pono' + i + '>' + $("#txtPono").val() + '</td><td id=povendorname' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td><td class=hide id=pullrfqid' + i + '>0</td><td class=hide id=rfqparameterid' + i + '>0</td></tr>');

        }
        $('#hdnRfiRfqID').val('0')
        $('#wrap_scroller').show();

        if (!jQuery("#tblServicesProductPrev thead").length) {

            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last Invoice Price</th><th class=itemclass>Item Bid Duration(Minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td style="width:20%!important;" id=itemcodeprev' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationportprev' + i + '>' + $('#txtdestinationPort').val() + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarksprev' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right id=quanprev' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uomprev' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CPprev' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendorprev' + i + '>' + status + '</td><td class=text-right id=mindecprev' + i + '>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=deconprev' + i + ' >' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=deconvalprev' + i + '>' + $("#drpdecreamenton").val() + '</td><td class="text-right hide" id=LIPprev' + i + '>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class="itemclass text-right" id=itemduraprev' + i + ' >' + itemBidDuration + '</td><td id=maskL1prev' + i + '>' + MaskL1Price + '</td><td id=showstartprev' + i + '>' + ShowStartPrice + '</td><td class=text-right id=unitrateprev' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=ponoprev' + i + ' >' + $("#txtPono").val() + '</td><td id=povendornameprev' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podateprev' + i + ' >' + $("#txtPODate").val() + '</td><td class=text-right id=povalueprev' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td><td class=hide id=pullrfqidprev' + i + '>0</td><td class=hide id=rfqparameteridprev' + i + '>0</td></tr>');

            totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(itemBidDuration);

        }
        else {

            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td id=itemcodeprev' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationportprev' + i + ' >' + $('#txtdestinationPort').val() + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarksprev' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right id=quanprev' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uomprev' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CPprev' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendorprev' + i + ' >' + status + '</td><td class=text-right id=mindecprev' + i + ' >' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=deconprev' + i + ' >' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=deconvalprev' + i + ' >' + $("#drpdecreamenton").val() + '</td><td class="text-right hide" id=LIPprev' + i + ' >' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class="itemclass text-right" id=itemduraprev' + i + ' >' + itemBidDuration + '</td><td id=maskL1prev' + i + '>' + MaskL1Price + '</td><td id=showstartprev' + i + '>' + ShowStartPrice + '</td><td class=text-right id=unitrateprev' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=ponoprev' + i + ' >' + $("#txtPono").val() + '</td><td id=povendornameprev' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podateprev' + i + ' >' + $("#txtPODate").val() + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators($("#txtpovalue").val()) + '</td><td class=hide id=pullrfqidprev' + i + '>0</td></tr>');
            totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(itemBidDuration);

        }
        sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger)
        if ($('#ddlbidclosetype option:selected').val() == "S") {
            $('.itemclass').removeClass('hide')
        }
        else {
            $('.itemclass').addClass('hide')
            $('.itemclass').val(0)
        }
        $('#wrap_scrollerPrev').show();
    }
    else {

        if (!jQuery("#tblServicesProduct thead").length) {
            jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th 'width:20%!important;'></th><th>Item Code</th><th>Item/Service</th><th>Remarks</th><th>Target Price</th><th>Hide Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Floor/ Min. Price</th><th>Price Decrement Amount</th><th> Price Decrement Frequency</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td  style="width:20%!important;" id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationport' + i + ' >' + $('#txtdestinationPort').val() + '</td><td id=remarks' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TP' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td id=maskvendor' + i + ' >' + status + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uom' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=floorprice' + i + ' class=text-right >' + thousands_separators($('#txtfloorPrice').val()) + '</td><td class=text-right id=pricedecreament' + i + ' >' + thousands_separators($('#txtPriceReductionAmount').val()) + '</td><td class="text-right" id=pricedecreamentfeq' + i + ' >' + $("#txtPriceReductionFrequency").val() + '</td><td class=text-right id=unitrate' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=pono' + i + ' >' + $("#txtPono").val() + '</td><td id=povendorname' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td></tr>');
        }
        else {

            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn  btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td style="width:20%!important;" id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationport' + i + ' >' + $('#txtdestinationPort').val() + '</td><td id=remarks' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TP' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td id=maskvendor' + i + ' >' + status + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uom' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=floorprice' + i + ' class=text-right >' + thousands_separators($('#txtfloorPrice').val()) + '</td><td class=text-right id=pricedecreament' + i + ' >' + thousands_separators($('#txtPriceReductionAmount').val()) + '</td><td class="text-right" id=pricedecreamentfeq' + i + ' >' + $("#txtPriceReductionFrequency").val() + '</td><td class=text-right id=unitrate' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=pono' + i + '>' + $("#txtPono").val() + '</td><td id=povendorname' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td></tr>');

        }
        $('#wrap_scroller').show();


        if (!jQuery("#tblServicesProductPrev thead").length) {
            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th>Item Code</th><th>Item/Service</th><th>Remarks</th><th>Target Price</th><th>Hide Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Floor/ Min. Price</th><th>Price Decrement Amount</th><th> Price Decrement Frequency</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
            jQuery("#tblServicesProductPrev").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td  style="width:20%!important;" id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationport' + i + ' >' + $('#txtdestinationPort').val() + '</td><td id=remarks' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TP' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td id=maskvendor' + i + ' >' + status + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uom' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=floorpriceprev' + i + ' class=text-right >' + thousands_separators($('#txtfloorPrice').val()) + '</td><td class=text-right id=pricedecreamentprev' + i + ' >' + thousands_separators($('#txtPriceReductionAmount').val()) + '</td><td class="text-right" id=pricedecreamentfeqprev' + i + ' >' + $("#txtPriceReductionFrequency").val() + '</td><td class=text-right id=unitrate' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=pono' + i + ' >' + $("#txtPono").val() + '</td><td id=povendorname' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td></tr>');
        }
        else {

            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td style="width:20%!important;" id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationport' + i + ' >' + $('#txtdestinationPort').val() + '</td><td id=remarks' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TP' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td id=maskvendor' + i + ' >' + status + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uom' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=floorpriceprev' + i + ' class=text-right >' + thousands_separators($('#txtfloorPrice').val()) + '</td><td class=text-right id=pricedecreamentprev' + i + ' >' + thousands_separators($('#txtPriceReductionAmount').val()) + '</td><td class="text-right" id=pricedecreamentfeqprev' + i + ' >' + $("#txtPriceReductionFrequency").val() + '</td><td class=text-right id=unitrate' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=pono' + i + '>' + $("#txtPono").val() + '</td><td id=povendorname' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td></tr>');
        }
        $('#wrap_scrollerPrev').show();
    }

    rowAppItems = rowAppItems + 1;
    rowAppItemsrno = rowAppItemsrno + 1;
    resetfun()

}

function editvalues(icount) {

    Metronic.scrollTo($("body"), 200);
    $('#rowid').val(icount)
    //$('#rowidPrev').val(rowidPrev.id)

    // var Descriptiontxt = $("#desc" + icount).html().replace(/<br>/g, '\n')
    var Remark = $("#remarks" + icount).html().replace(/<br>/g, '\n')

    $('#txtItemCode').val($("#itemcode" + icount).text())
    $('#txtdestinationPort').val($("#destinationport" + icount).text())
    // $('#txtdescription').val(Descriptiontxt)
    $('#txtbiddescriptionP').val(Remark)

    $('#txttargetprice').val(thousands_Sep_Text(removeThousandSeperator($("#TP" + icount).text())))
    $('#txtquantitiy').val(removeThousandSeperator($("#quan" + icount).text()))
    $('#dropuom').val($("#uom" + icount).text())
    $('#txtUOM').val($("#uom" + icount).text())
    $('#txtCeilingPrice').val(removeThousandSeperator($("#CP" + icount).text()))
    $('#checkmaskvendor').val($("#maskvendor" + icount).text())

    $('#txtminimumdecreament').val(removeThousandSeperator($("#mindec" + icount).text()))

    $('#drpdecreamenton').val($("#deconval" + icount).text())
    $('#txtlastinvoiceprice').val($("#LIP" + icount).text())
    $('#txtitembidduration').val($("#itemdura" + icount).text())
    $('#checkmaskL1price').val($("#maskL1" + icount).text())
    $('#checkshowstartprice').val($("#showstart" + icount).text())

    $('#txtunitrate').val(thousands_Sep_Text(removeThousandSeperator($("#unitrate" + icount).text())))
    $('#txtPono').val($("#pono" + icount).text())
    $('#txtvendorname').val($("#povendorname" + icount).text())
    $('#txtPODate').val($("#podate" + icount).text())
    $('#txtpovalue').val(thousands_Sep_Text(removeThousandSeperator($("#povalue" + icount).text())))
    $('#txtfloorPrice').val(removeThousandSeperator($("#floorprice" + icount).text()))
    $('#txtPriceReductionAmount').val(removeThousandSeperator($("#pricedecreament" + icount).text()))
    $('#spinner4').spinner('value', $("#pricedecreamentfeq" + icount).text())

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
    $('#txtdestinationPort').val('')
    $('#txttargetprice').val('')
    $('#txtquantitiy').val('')
    $('#txtUOM').val('')
    $('#txtbiddescriptionP').val('')
    $('#txtItemCode').val('')
    $('#txtdescription').val('')
    $('#txtPODate').val('')
    $('#txtPono').val('')
    $('#txtvendorname').val('')
    $('#txtunitrate').val('')
    $('#txtpovalue').val('')

    $('#txtCeilingPrice').val('')
    $('#txtminimumdecreament').val('')

    $('#txtlastinvoiceprice').val('')
    $('#txtitembidduration').val('');
    //$('#checkmaskL1price').val('N');
    $('#checkshowstartprice').val('Y');
    showhideItemBidDuration()
    if ($('#ddlAuctiontype option:selected').val() == "83") {
        $('#checkmaskL1price').val("Y").attr("disabled", true);
    }
    else {
        $('#checkmaskL1price').val("N").attr("disabled", false);
    }
    $('#drpdecreamenton').val('A')
    $('#txtPriceReductionFrequency').val('');
    $('#spinner4').spinner('value', 1);
    $('#txtPriceReductionAmount').val('');
    $('#txtfloorPrice').val('');
}

function showhideItemBidDuration() {

    if ($('#ddlbidclosetype option:selected').val() == 'A' && $('#ddlAuctiontype option:selected').val() != '82') {

        jQuery('#divItemBiduration').css('visibility', 'hidden');
        $('#txtBidDuration').prop('disabled', false)
        $('#txtitembidduration').prop('disabled', true)
        //$('#txtStaggerNo').prop('disabled', true)
        $('#divNofStaggerItems').hide()
        $('#spanbidduration').show()

        $('input[name="txtBidDuration"]').rules('add', {
            required: true,
            minlength: 1,
            maxlength: 3,
            number: true,
            notEqualTo: 0
            // }
        });

    }
    else if ($('#ddlbidclosetype option:selected').val() == 'S' && $('#ddlAuctiontype option:selected').val() != '82') {
        $('#divNofStaggerItems').show()
        $('input[name="txtStaggerNo"]').rules('add', {
            required: true,
            minlength: 1,
            maxlength: 3,
            number: true,
            notEqualTo: 0
        });
        $('input[name="txtBidDuration"]').rules('remove');
        $('#txtitembidduration').prop('disabled', false)
        //$('#txtStaggerNo').prop('disabled', false)
        $('#spanbidduration').hide()
        $('.condition-based-validate').removeClass('has-error')
        $('.condition-based-validate').find('.help-block').remove()
        $('#txtBidDuration').val('')
        $('#txtBidDuration').prop('disabled', true)
        jQuery('#divItemBiduration').css('visibility', 'visible');

    }
    else if ($('#ddlAuctiontype option:selected').val() == '82') {
        $('#divNofStaggerItems').hide()
        $('#divItemBiduration').css('visibility', 'hidden');
        $('#txtBidDuration').prop('disabled', true)
        $('#txtitembidduration').prop('disabled', true)
        //$('#txtStaggerNo').prop('disabled', true)
        $('#spanbidduration').show()
        $('input[name="txtBidDuration"]').rules('remove');
        $('input[name="txtStaggerNo"]').rules('remove');
        $('.condition-based-validate,.xyz').removeClass('has-error')
        $('.condition-based-validate').find('.help-block').remove()
    }
    else {
        $('input[name="txtStaggerNo"]').rules('remove');
        $('input[name="txtBidDuration"]').rules('remove');
        $('#txtitembidduration').prop('disabled', false)
        // $('#txtStaggerNo').prop('disabled', false)
        $('#spanbidduration').hide()
        $('.condition-based-validate').removeClass('has-error')
        $('.condition-based-validate').find('.help-block').remove()
        $('#txtBidDuration').val('')
        $('#txtBidDuration').prop('disabled', true)
        $('#divItemBiduration').css('visibility', 'visible');
    }
}

jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblvendorlist tbody").find("tr"), function () {
        // console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});

var _bidType;
var BidItemslength = 0;
function fetchSeaExportDetails() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchSeaExportConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + sessionStorage.getItem('CurrentBidID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            var dtst = (fnConverToLocalTime(BidData[0].bidDetails[0].bidDate))
            sessionStorage.getItem("BidPreApp", BidData[0].bidDetails[0].bidpreapproval)
            jQuery('#txtBidSubject').val(BidData[0].bidDetails[0].bidSubject)
            jQuery('#txtBidDuration').val(BidData[0].bidDetails[0].bidDuration)

            jQuery('#txtStaggerNo').val(BidData[0].bidDetails[0].noOfStaggerItems)
            jQuery('#txtbiddescription').val(BidData[0].bidDetails[0].bidDetails)
            //jQuery('#txtbidDate').val(BidData[0].bidDetails[0].bidDate)
            //jQuery('#txtbidTime').val(BidData[0].bidDetails[0].bidTime)
            jQuery('#txtbidDate').val(dtst)
            jQuery('#drpshowL1L2').val(BidData[0].bidDetails[0].showRankToVendor)
            $('#drphideVendor').val(BidData[0].bidDetails[0].hideVendor)
            // jQuery('#txtBidExtension').val(BidData[0].bidDetails[0].noofBidExtension == -1 ? "" : BidData[0].bidDetails[0].noofBidExtension)
            jQuery('#txtBidExtension').val(BidData[0].bidDetails[0].noofBidExtension)
            setTimeout(function () {
                jQuery("#dropCurrency").val(BidData[0].bidDetails[0].currencyID).attr("selected", "selected");
                jQuery('#txtConversionRate').val(BidData[0].bidDetails[0].conversionRate)
            }, 2500);
            $('#txtBidDuration').val(BidData[0].bidDetails[0].bidDuration)

            $('#ddlAuctiontype').val(BidData[0].bidDetails[0].bidForID)
            jQuery('#ddlbidclosetype').val(BidData[0].bidDetails[0].bidClosingType.trim())
            $("#cancelBidBtn").show();
            _bidType = BidData[0].bidDetails[0].bidForID;
            $("#drpshowL1L2").attr('disabled', false);
            $('#ddlbidclosetype').attr('disabled', false);
            $(".for-nondutch-bid").show();
            $(".for-dutch-bid").hide();
            $('#drpshowL1L2').val('Y')
            $('#divBSP').removeClass('col-md-4').addClass('col-md-3')
            $('#btnexcel').show()
            $('#pullRFQ').show()
            $('#divNofStaggerItems').hide()
            if (BidData[0].bidDetails[0].bidClosingType.trim() == 'A' && $('#ddlAuctiontype option:selected').val() != '82') {

                jQuery('#divItemBiduration').css('visibility', 'hidden');
                $('#txtBidDuration').prop('disabled', false)
                $('#spanbidduration').show()
                $('input[name="txtBidDuration"]').rules('add', {
                    required: true,
                    minlength: 1,
                    maxlength: 3,
                    number: true,
                    notEqualTo: 0
                });

            }
            else if ($('#ddlbidclosetype option:selected').val() == 'S' && $('#ddlAuctiontype option:selected').val() != '82') {
                $('#divNofStaggerItems').show()
                $('input[name="txtStaggerNo"]').rules('add', {
                    required: true,
                    minlength: 1,
                    maxlength: 3,
                    number: true,
                    notEqualTo: 0
                });
                $('input[name="txtBidDuration"]').rules('remove');
                $('#txtitembidduration').prop('disabled', false)

                $('#spanbidduration').hide()
                $('.condition-based-validate').removeClass('has-error')
                $('.condition-based-validate').find('.help-block').remove()
                $('#txtBidDuration').val('')
                $('#txtBidDuration').prop('disabled', true)
                jQuery('#divItemBiduration').css('visibility', 'visible');

            }
            else if (BidData[0].bidDetails[0].bidForID == '82') {

                jQuery('#divItemBiduration').css('visibility', 'hidden');
                $('#txtBidDuration').prop('disabled', true)
                $('#txtitembidduration').prop('disabled', true)
                $('#spanbidduration').show()
                $('input[name="txtBidDuration"]').rules('remove');
                $('.condition-based-validate,.xyz').removeClass('has-error')
                $('.condition-based-validate').find('.help-block').remove()

                $("#drpshowL1L2").attr('disabled', true);
                $('#ddlbidclosetype').attr('disabled', true);
                $('#ddlbidclosetype').val('A');
                $(".for-nondutch-bid").hide();
                $(".for-dutch-bid").show();
                $('#drpshowL1L2').val('N')
                $('#divBSP').removeClass('col-md-3').addClass('col-md-4')
                $('#btnexcel').hide()
                $('#pullRFQ').hide()
            }
            else {

                $('#spanbidduration').hide()
                $('input[name="txtBidDuration"]').rules('remove');
                $('.condition-based-validate').removeClass('has-error')
                $('.condition-based-validate').find('.help-block').remove()
                $('#txtBidDuration').prop('disabled', true)

                jQuery('#divItemBiduration').css('visibility', 'visible');
            }
            //if (BidData[0].bidDetails[0].bidForID == 82) {
            //    $("#drpshowL1L2").attr('disabled', true);
            //    $('#ddlbidclosetype').attr('disabled', true);
            //    $('#ddlbidclosetype').val('A');
            //    $(".for-nondutch-bid").hide();
            //    $(".for-dutch-bid").show();
            //    $('#drpshowL1L2').val('N')
            //    $('#divBSP').removeClass('col-md-3').addClass('col-md-4')
            //    $('#btnexcel').hide()
            //    $('#pullRFQ').hide()
            //}
            //else {
            //    $("#drpshowL1L2").attr('disabled', false);
            //    $('#ddlbidclosetype').attr('disabled', false);
            //    $(".for-nondutch-bid").show();
            //    $(".for-dutch-bid").hide();
            //    $('#drpshowL1L2').val('Y')
            //    $('#divBSP').removeClass('col-md-4').addClass('col-md-3')
            //    $('#btnexcel').show()
            //    $('#pullRFQ').show()
            //}
            if (BidData[0].bidDetails[0].termsConditions != '') {
                $('#closebtn').removeClass('display-none');
                $('#file1').attr('disabled', true);

            }
            if (BidData[0].bidDetails[0].attachment != '' && BidData[0].bidDetails[0].attachment != null) {
                $('#file2').attr('disabled', true);
                $('#closebtn2').removeClass('display-none');
            }
            $('#filepthterms').html(BidData[0].bidDetails[0].termsConditions);
            $('#filepthattach').html(BidData[0].bidDetails[0].attachment);

            if (BidData[0].bidApproverDetails.length > 0) {
                for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {

                    jQuery('#mapedapprover').append(jQuery('<option selected></option>').val(BidData[0].bidApproverDetails[i].userID).html(BidData[0].bidApproverDetails[i].approverName))
                }
            }

            jQuery("#tblapprovers,#tblpreBidapprovers").empty();
            jQuery("#tblapproversPrev,#tblpreBidapprovers1").empty();
            $('#wrap_scrollerPrevApp').show();
            jQuery('#tblapprovers,#tblpreBidapprovers').append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery('#tblapproversPrev,#tblpreBidapprovers1').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");

            for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {
                rowApp = rowApp + 1;
                str = '<tr id=trAppid' + (i + 1) + '>';
                str += '<td><a type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(trAppid' + (i + 1) + ',trAppidPrev' + (i + 1) + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></a></td>';
                str += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                str += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";

                str += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td>";
                str += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td></tr>";

                jQuery('#tblapprovers').append(str);

                //** Pre Approver
                str = '';
                rowpreBidApp = rowpreBidApp + 1;
                str = '<tr id=trpreAppid' + (i + 1) + '>';
                str += '<td><a type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deletepreApprow(trpreAppid' + (i + 1) + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></a></td>';
                str += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                str += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                str += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td>";
                str += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td></tr>";
                jQuery('#tblpreBidapprovers').append(str);

                //** Pre Approver
                strp = '<tr id=trAppidPrev' + (i + 1) + '>';
                strp += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";
                strp += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td>";
                strp += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td></tr>";
                jQuery('#tblapproversPrev').append(strp);
                jQuery('#tblpreBidapprovers1').append(strp);

            }
            totalitemdurationstagger = 0;
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblServicesProductPrev").empty();
            if (BidData[0].bidSeaExportDetails.length > 0) {
                BidItemslength = BidData[0].bidSeaExportDetails.length
                $('#wrap_scroller').show();
                $('#wrap_scrollerPrev').show();
                if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {

                    jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th></th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last InvoicePrice</th><th  class=itemclass >Bid Duration (in minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last InvoicePrice</th><th class='itemclass'>Bid Duration (in minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidSeaExportDetails.length; i++) {

                        var decrementon = ''
                        if (BidData[0].bidSeaExportDetails[i].decreamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = '%age'

                        rowAppItems = rowAppItems + 1
                        rowAppItemsrno = rowAppItemsrno + 1;

                        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (i + 1) + '</td><td><a class="btn  btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td style="width:20%!important;" id=itemcode' + i + '>' + BidData[0].bidSeaExportDetails[i].itemCode + '</td><td id=destinationport' + i + '>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td class=hide>' + BidData[0].bidSeaExportDetails[i].description + '</td><td id=remarks' + i + '>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right id=TP' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].targetprice) + '</td><td class=text-right id=quan' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + '</td><td id=uom' + i + '>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td id=maskvendor' + i + ' >' + BidData[0].bidSeaExportDetails[i].maskVendor + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators(BidData[0].bidSeaExportDetails[i].minimumDecreament) + '</td><td  id=decon' + i + '  >' + decrementon + '</td><td class=hide id=deconval' + i + ' >' + BidData[0].bidSeaExportDetails[i].decreamentOn + '</td><td class="text-right hide" id=LIP' + i + ' >' + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + '</td><td class="itemclass text-right" id=itemdura' + i + ' >' + BidData[0].bidSeaExportDetails[i].itemBidDuration + '</td><td id=maskL1' + i + ' >' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td id=showstart' + i + '>' + BidData[0].bidSeaExportDetails[i].showStartPrice + '</td><td class=text-right id=unitrate' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td id=pono' + i + '  >' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td id=povendorname' + i + '>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td id=podate' + i + '>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td><td class=hide id=pullrfqid' + i + '>' + BidData[0].bidSeaExportDetails[i].pullRFQID + '</td><td class=hide id=rfqparameterid' + i + '>' + BidData[0].bidSeaExportDetails[i].rfqParameterID + '</td></tr>');

                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td style="width:20%!important;" id=itemcodeprev' + i + '>' + BidData[0].bidSeaExportDetails[i].itemCode + '</td><td id=destinationportprev' + i + '>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td  class=hide>' + BidData[0].bidSeaExportDetails[i].description + '</td><td id=remarksprev' + i + '>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right id=TPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].targetprice) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + '</td><td id=uomprev' + i + '>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td id=maskvendorprev' + i + '>' + BidData[0].bidSeaExportDetails[i].maskVendor + '</td><td class=text-right id=mindecprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].minimumDecreament) + '</td><td id=deconprev' + i + '>' + decrementon + '</td><td class=hide id=deconvalprev' + i + '>' + BidData[0].bidSeaExportDetails[i].decreamentOn + '</td><td class="text-right hide" id=LIPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].lastInvoicePrice) + '</td><td class="itemclass text-right" id=itemduraprev' + i + '>' + BidData[0].bidSeaExportDetails[i].itemBidDuration + '</td><td id=maskL1prev' + i + '>' + BidData[0].bidSeaExportDetails[i].maskL1Price + '</td><td id=showstartprev' + i + '>' + BidData[0].bidSeaExportDetails[i].showStartPrice + '</td><td class=text-right id=unitrateprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td id=ponoprev' + i + '>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td id=povendornameprev' + i + ' >' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td  id=podateprev' + i + '>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td><td class=hide id=pullrfqidprev' + i + '>' + BidData[0].bidSeaExportDetails[i].pullRFQID + '</td><td class=hide id=rfqparameteridprev' + i + '>' + BidData[0].bidSeaExportDetails[i].rfqParameterID + '</td></tr>');

                        totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(BidData[0].bidSeaExportDetails[i].itemBidDuration)
                        if (BidData[0].bidSeaExportDetails[i].pullRFQID != 0) {
                            $('#hdnRfiRfqID').val(BidData[0].bidSeaExportDetails[i].pullRFQID)
                            ispulledrfqcounter = ispulledrfqcounter + 1;
                        }
                    }
                    sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger)
                    if ($('#ddlbidclosetype option:selected').val() == "S") {
                        $('.itemclass').removeClass('hide')
                    }
                    else {
                        $('.itemclass').addClass('hide')
                        $('.itemclass').val(0)
                    }
                }
                else {
                    jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:10%!important;'></th><th>Item Code</th><th>Item/Service</th><th>Remarks</th><th>Target Price</th><th>Hide Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Floor/ Min. Price</th><th>Price Decrement Amount</th><th> Price Decrement Frequency</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th>Remarks</th><th>Target Price</th><th>Hide Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Floor/ Min. Price</th><th>Price Decrement Amount</th><th> Price Decrement Frequency</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidSeaExportDetails.length; i++) {
                        rowAppItems = rowAppItems + 1
                        rowAppItemsrno = rowAppItemsrno + 1;

                        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (i + 1) + '</td><td><a class="btn  btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td style="width:20%!important;" id=itemcode' + i + '>' + BidData[0].bidSeaExportDetails[i].itemCode + '</td><td id=destinationport' + i + '>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td id=remarks' + i + '>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right id=TP' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].targetprice) + '</td><td id=maskvendor' + i + ' >' + BidData[0].bidSeaExportDetails[i].maskVendor + '</td><td class=text-right id=quan' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + '</td><td id=uom' + i + '>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td id=floorprice' + i + ' class=text-right >' + thousands_separators(BidData[0].bidSeaExportDetails[i].startingPrice) + '</td><td class=text-right id=pricedecreament' + i + ' >' + thousands_separators(BidData[0].bidSeaExportDetails[i].priceDecreamentAmount) + '</td><td class="text-right" id=pricedecreamentfeq' + i + '>' + BidData[0].bidSeaExportDetails[i].priceDecreamentFrequency + '</td><td class=text-right id=unitrate' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td id=pono' + i + '  >' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td id=povendorname' + i + '>' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td id=podate' + i + '>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td></tr>');

                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td style="width:20%!important;" id=itemcodeprev' + i + '>' + BidData[0].bidSeaExportDetails[i].itemCode + '</td><td id=destinationportprev' + i + '>' + BidData[0].bidSeaExportDetails[i].destinationPort + '</td><td id=remarksprev' + i + '>' + BidData[0].bidSeaExportDetails[i].remarks + '</td><td class=text-right id=TPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].targetprice) + '</td><td id=maskvendor' + i + ' >' + BidData[0].bidSeaExportDetails[i].maskVendor + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].quantity) + '</td><td id=uomprev' + i + '>' + BidData[0].bidSeaExportDetails[i].uom + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].ceilingPrice) + '</td><td id=floorpriceprev' + i + ' class=text-right >' + thousands_separators(BidData[0].bidSeaExportDetails[i].startingPrice) + '</td><td class=text-right id=pricedecreamentprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].priceDecreamentAmount) + '</td><td class="text-right" id=pricedecreamentfeqprev' + i + '>' + BidData[0].bidSeaExportDetails[i].priceDecreamentFrequency + '</td><td class=text-right id=unitrateprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poUnitRate) + '</td><td id=ponoprev' + i + '>' + BidData[0].bidSeaExportDetails[i].poNo + '</td><td id=povendornameprev' + i + ' >' + BidData[0].bidSeaExportDetails[i].poVendorName + '</td><td  id=podateprev' + i + '>' + BidData[0].bidSeaExportDetails[i].poDate + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators(BidData[0].bidSeaExportDetails[i].poValue) + '</td></tr>');
                    }
                }
                if (BidData[0].bidVendorDetails.length > 0) {
                    jQuery('#selectedvendorlists').empty();
                    jQuery('#selectedvendorlistsPrev').empty();
                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                        vCount = vCount + 1;
                        if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {
                            $('.THLoading').show()
                            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td id=tblcolweightage' + BidData[0].bidVendorDetails[i].vendorID + ' class=tblcolweightage>' + BidData[0].bidVendorDetails[i].advFactor + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + BidData[0].bidVendorDetails[i].vendorID + ',SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + ',' + BidData[0].bidVendorDetails[i].vendorID + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success lambdafactor" title="Add Weightage" onclick="addWeightageToVendor(' + BidData[0].bidVendorDetails[i].vendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
                            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td id=tblcolweightagePrev' + BidData[0].bidVendorDetails[i].vendorID + ' class=tblcolweightage>' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                        }
                        else {
                            $('.THLoading').hide()
                            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td id=tblcolweightage' + BidData[0].bidVendorDetails[i].vendorID + ' class="hide tblcolweightage">' + BidData[0].bidVendorDetails[i].advFactor + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + BidData[0].bidVendorDetails[i].vendorID + ',SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + ',' + BidData[0].bidVendorDetails[i].vendorID + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success lambdafactor hide" title="Add Weightage" onclick="addWeightageToVendor(' + BidData[0].bidVendorDetails[i].vendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
                            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td id=tblcolweightagePrev' + BidData[0].bidVendorDetails[i].vendorID + ' class="hide tblcolweightage">' + BidData[0].bidVendorDetails[i].advFactor + '</td></tr>')
                        }

                    }

                    jQuery('#selectedvendorlists').show()
                    jQuery('#selectedvendorlistsPrev').show()

                }

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
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
        }
    });

    setTimeout(function () {
        fetchPSBidDetailsForPreview()
    }, 2000);

}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + sessionStorage.getItem('CurrentBidID'));
}

function hideshowDuration() {
    rowAppItems = 0;
    rowAppItemsrno = 0;
    $("#tblServicesProduct").empty();
    $("#tblServicesProductPrev").empty();
    if ($("#ddlAuctiontype option:selected").val() == 81) {

        $("#drpshowL1L2").attr('disabled', false);
        $("#txtBidDuration").attr('disabled', false);
        $("#txtBidDuration").val(0);
        $('#checkmaskL1price').val('N')
        $('#drpshowL1L2').val('Y');
        $('#checkmaskL1price').attr('disabled', false);
        $('#ddlbidclosetype').attr('disabled', false);
        $('#pullRFQ').show()
        $('#btnexcel').show()
        $('input[name="txtBidDuration"]').rules('add', {
            required: true,
            minlength: 1,
            maxlength: 3,
            number: true,
            notEqualTo: 0

        });
    }
    else if ($("#ddlAuctiontype option:selected").val() == 82) {

        $("#drpshowL1L2").attr('disabled', true);
        $("#txtBidDuration").attr('disabled', true);
        $("#txtBidDuration").val(0);
        $('#checkmaskL1price').val('N')
        $('#checkmaskL1price').attr('disabled', false);
        $('#ddlbidclosetype').attr('disabled', true);
        $('#ddlbidclosetype').val('A');
        $('#drpshowL1L2').val('N')
        $('#btnexcel').hide()
        $('#pullRFQ').hide()
        $('.condition-based-validate,.xyz').removeClass('has-error')
        $('.condition-based-validate').find('.help-block').remove()

    }
    else {
        $(".hdnfielddutch").attr('disabled', false);
        $("#drpshowL1L2").attr('disabled', false);
        $("#txtBidDuration").attr('disabled', false);
        $("#txtBidDuration").val(0);
        $('#checkmaskL1price').val('Y');
        $('#drpshowL1L2').val('Y');
        $('#checkmaskL1price').attr('disabled', true);
        $('#ddlbidclosetype').attr('disabled', false);
        $('#btnexcel').show()
        $('#pullRFQ').show()
        $('input[name="txtBidDuration"]').rules('add', {
            required: true,
            minlength: 1,
            maxlength: 3,
            number: true,
            notEqualTo: 0

        });
    }
}
function Dateandtimevalidate(indexNo) {
    var StartDT = new Date();
    if ($('#txtbidDate').val() != null && $('#txtbidDate').val() != "") {
        StartDT = new Date($('#txtbidDate').val().replace('-', ''));

    }
    debugger;
    var Tab1Data = {
        "BidDate": StartDT
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

            if (data == '1') {
                if (indexNo == 'index1') {


                    if (sessionStorage.getItem('_savedDraft') == 'Y' && _bidType != $("#ddlAuctiontype option:selected").val()) {//&& (_bidType == 81 || $("#ddlAuctiontype option:selected").val() == 83) && (_bidType == 83 || $("#ddlAuctiontype option:selected").val() == 81)) {
                        if (BidItemslength >= 1) {
                            bootbox.dialog({
                                message: "By changing Auction Type for will delete previously configured event parameters. Do you want to continue?",
                                // title: "Custom title",
                                buttons: {
                                    confirm: {
                                        label: "Yes",
                                        className: "btn-success",
                                        callback: function () {

                                            deleteBidParameter('R');
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
                    }
                    else {
                        if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {
                            ConfigureBidForSeaExportTab1();
                        }
                        else {
                            ConfigureBidForSeaExportTab1();
                        }
                    }
                    fetchPSBidDetailsForPreview();
                }
                else {
                    ConfigureBidForSeaExportTab3();

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
        error: function () {

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
                ConfigureBidForSeaExportTab1();
                $("#tblServicesProduct").empty();
                $("#tblServicesProductPrev").empty();
                rowAppItems = 0;
                rowAppItemsrno = 0;
                jQuery('#selectedvendorlists').empty();
                jQuery('#selectedvendorlistsPrev').empty();
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

    if ($('#ddlbidclosetype').val() == "S") {
        jQuery('#txtBidDurationPrev').html(sessionStorage.getItem('TotalBidDuration'))
        $('#txtBidDuration').val(sessionStorage.getItem('TotalBidDuration'))
    }
    else {
        jQuery('#txtBidDurationPrev').html($('#txtBidDuration').val())
    }
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
    jQuery('#ddlbidclosetypePrev').html($('#ddlbidclosetype option:selected').text())
    $('#mapedapprover option').each(function () {
        // alert($(this).html())
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
            var err = xhr.responseText // eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
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

            //sessionStorage.setItem('hdnVendorID', map[item].participantID);
            //jQuery("#tblvendorlist > tbody").empty();
            vName = map[item].participantName + '(' + map[item].companyEmail + ')';

            jQuery('#tblvendorlist').append("<tr id=vList" + map[item].participantID + " ><td class='hide'>" + map[item].participantID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\" class=''><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + map[item].participantID + "'\)\"; id=\"chkvender" + map[item].participantID + "\" value=" + map[item].participantID + " style=\"cursor:pointer\" name=\"chkvender\" /></span></div></td><td> " + vName + " </td></tr>");


            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {
                    // console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()))

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
                var str = "<tr id=vList" + data[i].vendorID + "><td class='hide'>" + data[i].vendorID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].vendorID + "'\)\"; id=\"chkvender" + data[i].vendorID + "\" value=" + data[i].vendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].vendorName + " </td></tr>";
                jQuery('#tblvendorlist > tbody').append(str);

            }

            if ($("#selectedvendorlists > tbody > tr").length > 0) {
                $("#selectedvendorlists> tbody > tr").each(function (index) {
                    // console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()))
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                    $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")

                });
            }
        },
        error: function (xhr, status, error) {
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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
function cloneBid() {
    var encrypdata = fnencrypt("bidTypeId=7")
    window.location = 'cloneBid.html?param=' + encrypdata;
}
$('#RAexcel').on("hidden.bs.modal", function () {
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
    if ($('#ddlbidclosetype').val() == "S") {
        $('#libidduraion').show()
    }
    else {
        $('#libidduraion').hide()
    }
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
        $("#temptableForExcelDataparameter").append("<tr><th style='width:20%!important;'>ItemCode</th><th>ItemService</th><th  class=hide>Description</th><th>TargetPrice</th><th>HideTargetPrice</th><th>Remarks</th><th>Quantity</th><th>UOM</th><th>BidStartPrice</th><th>SelectedCurrency</th><th>MinimumDecreament</th><th>DecreamentOn</th>th class=hide>LastInvoicePrice</th><th>ItemBidDuration</th><th>ItemStatus</th><th>ShowL1Price</th><th>ShowStartPrice</th><th>PoUnitRate</th><th>PoNo</th><th>PoVendorName</th><th>PoDate</th><th>PoValue</th></tr>");
        // checking validation for each row
        var targetPrice = '';
        var BidstartPrice = 0;
        var minimumdec = 0;
        var LastInvoicePrice = 0;
        var Itembidduration = 0;
        BidDuration = 0;
        var unitrate = 0
        var Povalue = 0
        var pono = ''
        var podate = ''
        var povendorname = ''
        var itemcode = '', description = ''; var st = 'true'

        //var MaskL1Price='Y'
        var SelectedCurrency = $('#txtselectedCurrency').val();

        if ($('#txtBidDuration').val() == "") {
            BidDuration = 0
        }
        else {
            BidDuration = $('#txtBidDuration').val();
        }
        totalitemdurationstagger = 0;
        var z = 0;
        for (i = 0; i < loopcount; i++) {

            //alert($.trim(result[i].ItemBidDuration.trim()))
            itemcode = '', povendorname = '', podate = '', pono = '', Povalue = 0, unitrate = 0;
            if ($.trim(result[i].PoUnitRate) == '') {
                unitrate = 0;
            }
            else {
                unitrate = $.trim(result[i].PoUnitRate);
            }
            if ($.trim(result[i].PoValue) == '') {
                Povalue = 0;
            }
            else {
                Povalue = $.trim(result[i].PoValue);
            }

            if ($.trim(result[i].TargetPrice) == '') {
                targetPrice = 0;
            }
            else {
                targetPrice = $.trim(result[i].TargetPrice);
            }
            if ($.trim(result[i].BidStartPrice) == '') {
                BidstartPrice = 0;
            }
            else {
                BidstartPrice = $.trim(result[i].BidStartPrice);
            }
            if ($.trim(result[i].MinimumDecreament) == '') {
                minimumdec = 0;
            }
            else {
                minimumdec = $.trim(result[i].MinimumDecreament);
            }
            if ($.trim(result[i].PoDate) != '') {
                podate = $.trim(result[i].PoDate);
            }
            if ($.trim(result[i].PoNo) != '') {
                pono = $.trim(result[i].PoNo);
            }
            if ($.trim(result[i].PoVendorName) != '') {
                povendorname = $.trim(result[i].PoVendorName);

            }
            if ($.trim(result[i].ItemCode) != '') {
                itemcode = $.trim(result[i].ItemCode);
            }
            // alert(Povalue)
            if ($.trim(result[i].ItemService) == '' || $.trim(result[i].ItemService).length > 200) {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Item/Product/Services can not be blank or length should be 200 characters of Item no ' + (i + 1) + ' . Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($.trim(result[i].ItemCode).length > 50) {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Item Code length should be 50 characters of item no ' + (i + 1) + '. Please fill and upload the file again.');
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
            else if ($.trim(result[i].ShowL1Price) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Show L1 Price can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($.trim(result[i].ShowStartPrice) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Show Start Price can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($.trim(result[i].Remarks).length >= 200 && $.trim(result[i].Remarks) != '') {//$.trim(result[i].Remarks) == '' || 
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Remarks length should be 200 characters of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }

            else if (!result[i].Quantity.trim().match(numberOnly) || result[i].Quantity.trim() == '' || result[i].Quantity.trim() == '0') {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Quantity should be in numbers only of Item no ' + (i + 1) + '.');
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
            else if (!result[i].MinimumDecreament.trim().match(numberOnly) || minimumdec == 0) {

                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Minimum Decrement Price should be in numbers only of Item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;
            }

            else if ($.trim(result[i].DecreamentOn) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('DecrementOn can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if ($('#ddlbidclosetype').val() == "S" && $.trim(result[i].ItemBidDuration) == '') {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('ItemBidDuration can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (parseInt(minimumdec) > parseInt(BidstartPrice)) {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Minimum decrement should be less than bid start price of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (parseInt(minimumdec) > parseInt(20) && $.trim(result[i].DecreamentOn) == "P") {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Minimum decrement should be less than 20% of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (parseInt(minimumdec) > parseFloat(20 * (BidstartPrice) / 100) && $.trim(result[i].DecreamentOn) == "A") {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Minimum decrement should be less than 20% of Bid Start Price of Item no ' + (i + 1) + '. Please fill and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
            }
            else if (!$.trim(result[i].PoUnitRate).match(numberOnly) && unitrate != 0) {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Unit Rate should be in numbers only of item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;

            }
            else if (!$.trim(result[i].PoValue).match(numberOnly) && Povalue != 0) {
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('PO Value should be in numbers only of item no ' + (i + 1) + '.');
                $("#file-excelparameter").val('');
                return false;

            }
            else {
                if ($('#ddlAuctiontype').val() == "83") {
                    ShowL1Price = 'Y';
                }
                else {
                    ShowL1Price = result[i].ShowL1Price;

                }
                if ($('#ddlbidclosetype').val() == "S") {
                    totalitemdurationstagger = totalitemdurationstagger + parseInt($.trim(result[i].ItemBidDuration.trim()));
                    Itembidduration = parseInt($.trim(result[i].ItemBidDuration.trim())) //+ parseInt(BidDuration)
                    ItemStatus = 'Inactive';
                }
                else {
                    Itembidduration = parseInt(BidDuration);
                    ItemStatus = 'Open';
                }

                // if values are correct then creating a temp table
                $("<tr><td>" + replaceQuoutesFromStringFromExcel(itemcode) + "</td><td>" + replaceQuoutesFromStringFromExcel(result[i].ItemService) + "</td><td class=hide>" + replaceQuoutesFromStringFromExcel(description) + "</td><td>" + targetPrice + "</td><td>" + result[i].HideTargetPrice + "</td><td>" + replaceQuoutesFromStringFromExcel(result[i].Remarks) + "</td><td>" + result[i].Quantity + "</td><td>" + result[i].UOM + "</td><td>" + BidstartPrice + "</td><td>" + SelectedCurrency + "</td><td>" + minimumdec + "</td><td>" + result[i].DecreamentOn + "</td><td>" + unitrate + "</td><td  id=tditemduration" + i + ">" + Itembidduration + "</td><td>" + ItemStatus + "</td><td>" + ShowL1Price + "</td><td>" + result[i].ShowStartPrice + "</td><td>" + unitrate + "</td><td>" + replaceQuoutesFromStringFromExcel(pono) + "</td><td>" + replaceQuoutesFromStringFromExcel(povendorname) + "</td><td>" + podate + "</td><td>" + Povalue + "</td></tr>").appendTo("#temptableForExcelDataparameter");
                var arr = $("#temptableForExcelDataparameter tr");

                $.each(arr, function (i, item) {
                    var currIndex = $("#temptableForExcelDataparameter tr").eq(i);

                    var matchText = currIndex.find("td:eq(0)").text().toLowerCase();
                    $(this).nextAll().each(function (i, inItem) {

                        if (matchText === $(this).find("td:eq(1)").text().toLowerCase()) {
                            $(this).remove();
                            st = 'false'
                            ErrorMszDuplicate = ErrorMszDuplicate + ' RA Item with same name already exists at row no ' + (i + 1) + ' . Item will not insert.!<BR>'
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
        console.log(allUOM);
        $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
            var this_row = $(this);
            excelCorrectUOM = 'N';
            Rowcount = Rowcount + 1;
            for (var i = 0; i < allUOM.length; i++) {
                console.log(allUOM[i].uom.trim());
                console.log($.trim(this_row.find('td:eq(7)').html()));
                if ($.trim(this_row.find('td:eq(7)').html()).toLowerCase() == allUOM[i].uom.trim().toLowerCase()) {//allUOM[i].UOMID
                    excelCorrectUOM = 'Y';
                }

            }
            console.log(excelCorrect);
            var quorem = (allUOM.length / 2) + (allUOM.length % 2);
            if (excelCorrectUOM == 'N') {
                $("#error-excelparameter").show();
                ErrorUOMMsz = '<b>UOM</b> not filled properly at row no ' + Rowcount + '. Please choose <b>UOM</b> from given below: <br><ul class="col-md-5 text-left">';
                ErrorUOMMszRight = '<ul class="col-md-5 text-left">'
                console.log(ErrorUOMMsz);
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

        $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
            var this_row = $(this);

            switch ($.trim(this_row.find('td:eq(4)').html())) {
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
            switch ($.trim(this_row.find('td:eq(15)').html())) {
                case 'N':
                    excelCorrect = 'Y';
                    break;
                case 'Y':
                    excelCorrect = 'Y';
                    break;

                default:
                    excelCorrect = 'N';
                    $("#error-excelparameter").show();
                    $("#errspan-excelparameter").html('<b>Show L1 Price</b> text not filled properly. Please choose Show L1 Price from given below: <br/><br/>'
                        + '<ul class="col-md-4 text-left">'
                        + '<li>N - for not showing ongoing L1 Price to all vendor</li>'
                        + '<li>Y - for showing ongoing L1 Price to all vendors</li>'
                        + '</ul><div class=clearfix></div>'
                        + '<br/>and upload the file again.');
                    $("#file-excelparameter").val('');
                    return false;
            }
            switch ($.trim(this_row.find('td:eq(16)').html())) {
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
            switch ($.trim(this_row.find('td:eq(11)').html())) {
                case 'A':
                    excelCorrect = 'Y';
                    break;
                case 'P':
                    excelCorrect = 'Y';
                    break;

                default:
                    excelCorrect = 'N';
                    $("#error-excelparameter").show();
                    $("#errspan-excelparameter").html('<b>DecrementOn</b> not filled properly. Please choose DecrementOn from given below: <br/><br/>'
                        + '<ul class="col-md-4 text-left">'
                        + '<li>A - to select bid decrement in Amount</li>'
                        + '<li>P - to select bid decrement in percentage</li>'
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
            $("#succspan-excelparameter").html('Excel file is found ok. Do you want to upload? \n This will clean your existing Data.')
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
    $('#hdnRfiRfqID').val('0') // Set RFQ ID 0 to remove vendors if already selected on RFQ
    ispulledrfqcounter = 0;
    var rowCount = jQuery('#temptableForExcelDataparameter tr').length;
    if (rowCount > 0) {
        $("#success-excelparameter").hide();
        $('#btnsforYesNo').show()
        $("#error-excelparameter").hide();
        $('#loader-msgparameter').html('Processing. Please Wait...!');
        $('#modalLoaderparameter').removeClass('display-none');
        jQuery("#tblServicesProduct").empty();
        jQuery("#tblServicesProductPrev").empty();

        var i;
        i = 0;
        var decon = '';
        rowAppItemsrno = 0;
        totalitemdurationstagger = 0;

        $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
            var this_row = $(this);
            if ($.trim(this_row.find('td:eq(11)').html()) == "A") {
                decon = "Amount";
            }
            else {
                decon = "%age";
            }
            if (!jQuery("#tblServicesProduct thead").length) {
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th 'width:20%!important;'></th><th>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last Invoice Price</th><th class=itemclass>Bid Duration (in mins)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");

                jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td  style="width:20%!important;" id=itemcode' + i + '>' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td id=destinationport' + i + ' >' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarks' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td class=text-right id=TP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(6)').html())) + '</td><td id=uom' + i + ' >' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(8)').html())) + '</td><td id=maskvendor' + i + ' >' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(10)').html())) + '</td><td id=decon' + i + ' >' + decon + '</td><td class=hide id=deconval' + i + ' >' + $.trim(this_row.find('td:eq(11)').html()) + '</td><td class="text-right hide" id=LIP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(12)').html())) + '</td><td class=itemclass id=itemdura' + i + '>' + $.trim(this_row.find('td:eq(13)').html()) + '</td><td id=maskL1' + i + '  >' + $.trim(this_row.find('td:eq(15)').html()) + '</td><td id=showstart' + i + ' >' + $.trim(this_row.find('td:eq(16)').html()) + '</td><td id=unitrate' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(17)').html())) + '</td><td id=pono' + i + ' >' + $.trim(this_row.find('td:eq(18)').html()) + '</td><td id=povendorname' + i + ' >' + $.trim(this_row.find('td:eq(19)').html()) + '</td><td id=podate' + i + ' >' + $.trim(this_row.find('td:eq(20)').html()) + '</td><td id=povalue' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(21)').html())) + '</td><td id=pullrfqid' + i + ' class=hide>0</td><td class=hide id=rfqparameterid' + i + '>0</td></tr>');

            }
            else {
                jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td  style="width:20%!important;" id=itemcode' + i + '>' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td id=destinationport' + i + ' >' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarks' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td class=text-right id=TP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(6)').html())) + '</td><td id=uom' + i + ' >' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(8)').html())) + '</td><td id=maskvendor' + i + ' >' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(10)').html())) + '</td><td id=decon' + i + ' >' + decon + '</td><td class=hide id=deconval' + i + ' >' + $.trim(this_row.find('td:eq(11)').html()) + '</td><td class="text-right hide" id=LIP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(12)').html())) + '</td><td class=itemclass id=itemdura' + i + '>' + $.trim(this_row.find('td:eq(13)').html()) + '</td><td id=maskL1' + i + '  >' + $.trim(this_row.find('td:eq(15)').html()) + '</td><td id=showstart' + i + ' >' + $.trim(this_row.find('td:eq(16)').html()) + '</td><td id=unitrate' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(17)').html())) + '</td><td id=pono' + i + ' >' + $.trim(this_row.find('td:eq(18)').html()) + '</td><td id=povendorname' + i + ' >' + $.trim(this_row.find('td:eq(19)').html()) + '</td><td id=podate' + i + ' >' + $.trim(this_row.find('td:eq(20)').html()) + '</td><td id=povalue' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(21)').html())) + '</td><td id=pullrfqid' + i + ' class=hide>0</td><td class=hide id=rfqparameterid' + i + '>0</td></tr>');

            }

            $('#wrap_scroller').show();
            if (!jQuery("#tblServicesProductPrev thead").length) {

                jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last Invoice Price</th><th class=itemclass>Item Bid Duration(Minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td id=itemcodeprev' + i + ' style="width:20%!important;">' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td id=destinationportprev' + i + '>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarksprev' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(6)').html())) + '</td><td id=uomprev' + i + '>' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(8)').html())) + '</td><td  id=maskvendorprev' + i + '>' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td  id=mindecprev' + i + '  class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(10)').html())) + '</td><td id=deconprev' + i + ' >' + decon + '</td><td id=deconvalprev' + i + ' class=hide>' + $.trim(this_row.find('td:eq(11)').html()) + '</td><td class="text-right hide" id=LIPprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(17)').html())) + '</td><td class="itemclass text-right" id=itemduraprev' + i + ' >' + $.trim(this_row.find('td:eq(13)').html()) + '</td><td id=maskL1prev' + i + ' >' + $.trim(this_row.find('td:eq(15)').html()) + '</td><td id=showstartprev' + i + ' >' + $.trim(this_row.find('td:eq(16)').html()) + '</td><td id=unitrateprev' + i + '  class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(17)').html())) + '</td><td id=ponoprev' + i + ' >' + $.trim(this_row.find('td:eq(18)').html()) + '</td><td id=povendornameprev' + i + '>' + $.trim(this_row.find('td:eq(19)').html()) + '</td><td id=podateprev' + i + '>' + $.trim(this_row.find('td:eq(20)').html()) + '</td><td id=povalueprev' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(21)').html())) + '</td><td id=pullrfqidprev' + i + ' class=hide>0</td><td id=rfqparameteridprev' + i + ' class=hide>0</td></tr>');

                totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(this_row.find('td:eq(13)').html());

            } else {

                jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td id=itemcodeprev' + i + ' style="width:20%!important;">' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td id=destinationportprev' + i + '>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarksprev' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(6)').html())) + '</td><td id=uomprev' + i + '>' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(8)').html())) + '</td><td  id=maskvendorprev' + i + '>' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td  id=mindecprev' + i + '  class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(10)').html())) + '</td><td id=deconprev' + i + ' >' + decon + '</td><td id=deconvalprev' + i + ' class=hide>' + $.trim(this_row.find('td:eq(11)').html()) + '</td><td class="text-right hide" id=LIPprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(17)').html())) + '</td><td class="itemclass text-right" id=itemduraprev' + i + ' >' + $.trim(this_row.find('td:eq(13)').html()) + '</td><td id=maskL1prev' + i + ' >' + $.trim(this_row.find('td:eq(15)').html()) + '</td><td id=showstartprev' + i + ' >' + $.trim(this_row.find('td:eq(16)').html()) + '</td><td id=unitrateprev' + i + '  class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(17)').html())) + '</td><td id=ponoprev' + i + ' >' + $.trim(this_row.find('td:eq(18)').html()) + '</td><td id=povendornameprev' + i + '>' + $.trim(this_row.find('td:eq(19)').html()) + '</td><td id=podateprev' + i + '>' + $.trim(this_row.find('td:eq(20)').html()) + '</td><td id=povalueprev' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(21)').html())) + '</td><td id=pullrfqidprev' + i + ' class=hide>0</td><td id=rfqparameteridprev' + i + ' class=hide>0</td></tr>');
                totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(this_row.find('td:eq(13)').html());

            }

            if ($('#ddlbidclosetype option:selected').val() == "S") {
                $('.itemclass').removeClass('hide')
            }
            else {
                $('.itemclass').addClass('hide')
                $('.itemclass').val(0)
            }
            $('#wrap_scrollerPrev').show();

            rowAppItems = rowAppItems + 1;
            rowAppItemsrno = rowAppItemsrno + 1;
            i = i + 1;
        })
        if ($('#ddlbidclosetype option:selected').val() == "S") {
            sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger)
            $("#txtBidDuration").val(totalitemdurationstagger)
        }
        setTimeout(function () {
            $('#RAexcel').modal('hide');
            jQuery.unblockUI();
        }, 500 * rowCount)
    }
    else {
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html('No Items Found in Excel');
    }
}

function fetchRFIRFQSubjectforReport(subjectFor) {

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "eRFQReport/fetchRFQSubjectforReport/?SubjectFor=" + subjectFor + "&Userid=..&CustomerID=" + sessionStorage.getItem('CustomerID'),//UserID =.. for fetch all RFQ
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            sessionStorage.setItem('hdnRfiRfqSubject', JSON.stringify(data));
        },
        error: function (xhr) {
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
        }
    });

}

jQuery("#txtrfirfqsubject").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnRfiRfqSubject');
        Subject = [];
        map = {};
        var commonsubject = "";
        jQuery.each(jQuery.parseJSON(data), function (i, commonsubject) {
            map[commonsubject.rfqSubject] = commonsubject;
            Subject.push(commonsubject.rfqSubject);
        });

        process(Subject);

    },
    minLength: 2,
    updater: function (item) {

        if (map[item].rfqid != '0') {
            $('#hdnRfiRfqID').val(map[item].rfqid);
            fnpulldatafromRFQ();
        }
        else {
            gritternotification('Please Select RFQ properly!!!')
            jQuery('#divalerterrpull').slideDown('show');
            $('#spanerterrpull').text('Please Select RFQ properly!!!')

            return false;
            setTimeout(function () {
                jQuery('#divalerterrpull').css('display', 'none');
            }, 5000);
        }

        return item;
    }

});
jQuery("#txtrfirfqsubject").keyup(function () {
    $('#hdnRfiRfqID').val(0);
    //$('#ddlrfqVersion').empty();

});
function fnpulldatafromRFQ() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($('#hdnRfiRfqID').val() == "0") {
        // $('#ddlrfqVersion').empty();
        gritternotification('Please Select RFQ properly!!!')
        jQuery('#divalerterrpull').slideDown('show');
        $('#spanerterrpull').text('Please Select RFQ properly!!!')
        setTimeout(function () {
            jQuery('#divalerterrpull').css('display', 'none');
        }, 2000);
        jQuery.unblockUI();
        return false;
    }
    else {
        populatetablewithRFQData();
    }
}
function stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
        var p = width
        for (; p > 0 && str[p] != ' '; p--) {
        }
        if (p > 0) {
            var left = str.substring(0, p);
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}
var ispulledrfqcounter = 0;
function populatetablewithRFQData() {
    var stRFQ = 'true';
    totalitemdurationstagger = 0;
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetcheRFQParameterseRAItems/?RFQID=" + $('#hdnRfiRfqID').val() + "&Version=0",// Version is optional if required will use.
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

            if (data.length > 0) {
                if (ispulledrfqcounter == 0) {
                    jQuery("#tblServicesProduct").empty();
                    jQuery("#tblServicesProductPrev").empty();
                    rowAppItemsrno = 0;
                    rowAppItems = 0;
                }
                //var i;
                //i = rowAppItems;
                // if (data[0].rfqRemark != "") {
                ispulledrfqcounter = ispulledrfqcounter + 1;
                for (var i = 0; i < data.length; i++) {
                    var decrementon = ''
                    decrementon = 'Amount'
                    if ($('#ddlAuctiontype').val() == "83") {
                        ShowL1Price = 'Y';
                    }
                    else {
                        ShowL1Price = 'N';

                    }

                    if (!jQuery("#tblServicesProduct thead").length) {
                        jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:10%!important;'></th><th  style='width:20%!important;'>Item Code</th><th>Item/Service</th><th  class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last Invoice Price</th><th class=itemclass>Bid Duration (in mins)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                        jQuery("#tblServicesProduct").append('<tr id=trid' + rowAppItems + '><td>' + (rowAppItemsrno + 1) + '</td><td style="width:10%!important;"><a class="btn  btn-xs btn-success" onclick="editvalues(' + rowAppItems + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + rowAppItems + ',tridPrev' + rowAppItems + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td style="width:20%!important;" id=itemcode' + rowAppItems + '>' + data[i].itemCode + '</td><td id=destinationport' + rowAppItems + '>' + data[i].rfqShortName + '</td><td class=hide>' + data[i].rfqDescription + '</td><td id=remarks' + rowAppItems + '>' + data[i].rfqRemark + '</td><td class=text-right id=TP' + rowAppItems + ' >' + thousands_separators(data[i].rfqTargetPrice) + '</td><td class=text-right id=quan' + rowAppItems + ' >' + thousands_separators(data[i].rfqQuantity) + '</td><td id=uom' + rowAppItems + ' >' + data[i].rfquom + '</td><td class=text-right id=CP' + rowAppItems + '>' + thousands_separators(data[i].rfqBidStartPrice) + '</td><td id=maskvendor' + rowAppItems + '>Y</td><td class=text-right id=mindec' + rowAppItems + ' >' + thousands_separators(data[i].minimumdecreamentOn) + '</td><td id=decon' + rowAppItems + ' >' + decrementon + '</td><td class=hide id=deconval' + rowAppItems + ' >A</td><td class="text-right hide" id=LIP' + rowAppItems + '>' + thousands_separators(data[i].rfqLastInvoicePrice) + '</td><td class="itemclass text-right" id=itemdura' + rowAppItems + '>' + 10 + '</td><td id=maskL1' + rowAppItems + ' >' + ShowL1Price + '</td><td id=showstart' + rowAppItems + '>N</td><td class=text-right id=unitrate' + rowAppItems + ' >' + thousands_separators(data[i].poUnitRate) + '</td><td id=pono' + rowAppItems + ' >' + data[i].poNo + '</td><td id=povendorname' + rowAppItems + '>' + data[i].poVendorName + '</td><td id=podate' + rowAppItems + '>' + data[i].poDate + '</td><td class=text-right id=povalue' + rowAppItems + '>' + thousands_separators(data[i].poValue) + '</td><td class=hide id=pullrfqid' + rowAppItems + '>' + $('#hdnRfiRfqID').val() + '</td><td class=hide id=rfqparameterid' + rowAppItems + '>' + data[i].rfqParameterID + '</td></tr>');
                    }
                    else {
                        jQuery("#tblServicesProduct").append('<tr id=trid' + rowAppItems + '><td>' + (rowAppItemsrno + 1) + '</td><td style="width:10%!important;"><a class="btn  btn-xs btn-success" onclick="editvalues(' + rowAppItems + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + rowAppItems + ',tridPrev' + rowAppItems + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td style="width:20%!important;" id=itemcode' + rowAppItems + '>' + data[i].itemCode + '</td><td id=destinationport' + rowAppItems + '>' + data[i].rfqShortName + '</td><td class=hide>' + data[i].rfqDescription + '</td><td id=remarks' + rowAppItems + '>' + data[i].rfqRemark + '</td><td class=text-right id=TP' + rowAppItems + ' >' + thousands_separators(data[i].rfqTargetPrice) + '</td><td class=text-right id=quan' + rowAppItems + ' >' + thousands_separators(data[i].rfqQuantity) + '</td><td id=uom' + rowAppItems + ' >' + data[i].rfquom + '</td><td class=text-right id=CP' + rowAppItems + '>' + thousands_separators(data[i].rfqBidStartPrice) + '</td><td id=maskvendor' + rowAppItems + '>Y</td><td class=text-right id=mindec' + rowAppItems + ' >' + thousands_separators(data[i].minimumdecreamentOn) + '</td><td id=decon' + rowAppItems + ' >' + decrementon + '</td><td class=hide id=deconval' + rowAppItems + ' >A</td><td class="text-right hide" id=LIP' + rowAppItems + '>' + thousands_separators(data[i].rfqLastInvoicePrice) + '</td><td class="itemclass text-right" id=itemdura' + rowAppItems + ' >' + 10 + '</td><td id=maskL1' + rowAppItems + '>' + ShowL1Price + '</td><td id=showstart' + rowAppItems + '>N</td><td class=text-right id=unitrate' + rowAppItems + '>' + thousands_separators(data[i].poUnitRate) + '</td><td id=pono' + rowAppItems + ' >' + data[i].poNo + '</td><td id=povendorname' + rowAppItems + '>' + data[i].poVendorName + '</td><td id=podate' + rowAppItems + '>' + data[i].poDate + '</td><td class=text-right id=povalue' + rowAppItems + '>' + thousands_separators(data[i].poValue) + '</td><td class=hide id=pullrfqid' + rowAppItems + '>' + $('#hdnRfiRfqID').val() + '</td><td class=hide id=rfqparameterid' + rowAppItems + '>' + data[i].rfqParameterID + '</td></tr>');

                    }
                    $('#wrap_scroller').show();

                    if (!jQuery("#tblServicesProductPrev thead").length) {

                        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th class=hide>Last Invoice Price</th><th class=itemclass>Bid Duration (in mins)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + rowAppItems + '><td>' + (rowAppItemsrno + 1) + '</td><td id=itemcodeprev' + rowAppItems + '>' + data[i].itemCode + '</td><td id=destinationportprev' + rowAppItems + '>' + data[i].rfqShortName + '</td><td class=hide>' + data[i].rfqDescription + '</td><td id=remarksprev' + rowAppItems + '>' + data[i].rfqRemark + '</td><td class=text-right id=TPprev' + rowAppItems + '>' + thousands_separators(data[i].rfqTargetPrice) + '</td><td class=text-right id=quanprev' + rowAppItems + '>' + thousands_separators(data[i].rfqQuantity) + '</td><td id=uomprev' + rowAppItems + '>' + data[i].rfquom + '</td><td class=text-right id=CPprev' + rowAppItems + ' >' + thousands_separators(data[i].rfqBidStartPrice) + '</td><td id=maskvendorprev' + rowAppItems + ' >Y</td><td class=text-right id=mindecprev' + rowAppItems + ' >' + thousands_separators(data[i].minimumdecreamentOn) + '</td><td id=deconprev' + rowAppItems + '>' + decrementon + '</td><td class=hide id=deconvalprev' + rowAppItems + ' >A</td><td class="text-right hide" id=LIPprev' + rowAppItems + ' >' + thousands_separators(data[i].rfqLastInvoicePrice) + '</td><td class="itemclass text-right" id=itemduraprev' + rowAppItems + ' >' + 10 + '</td><td id=maskL1prev' + rowAppItems + ' >' + ShowL1Price + '</td><td id=showstartprev' + rowAppItems + ' >N</td><td class=text-right id=unitrateprev' + rowAppItems + ' >' + thousands_separators(data[i].poUnitRate) + '</td><td id=ponoprev' + rowAppItems + ' >' + data[i].poNo + '</td><td id=povendornameprev' + rowAppItems + ' >' + data[i].poVendorName + '</td><td  id=podateprev' + rowAppItems + ' >' + data[i].poDate + '</td><td class=text-right id=povalueprev' + rowAppItems + ' >' + thousands_separators(data[i].poValue) + '</td><td class=hide id=pullrfqidprev' + rowAppItems + ' >' + $('#hdnRfiRfqID').val() + '</td><td class=hide id=rfqparameteridprev' + rowAppItems + ' >' + data[i].rfqParameterID + '</td></tr>');

                        totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(0);

                    } else {

                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + rowAppItems + '><td>' + (rowAppItemsrno + 1) + '</td><td id=itemcodeprev' + rowAppItems + ' >' + data[i].itemCode + '</td><td id=destinationportprev' + rowAppItems + '>' + data[i].rfqShortName + '</td><td class=hide>' + data[i].rfqDescription + '</td><td id=remarksprev' + rowAppItems + '>' + data[i].rfqRemark + '</td><td class=text-right id=TPprev' + rowAppItems + '>' + thousands_separators(data[i].rfqTargetPrice) + '</td><td class=text-right id=quanprev' + rowAppItems + '>' + thousands_separators(data[i].rfqQuantity) + '</td><td id=uomprev' + rowAppItems + '>' + data[i].rfquom + '</td><td class=text-right id=CPprev' + rowAppItems + ' >' + thousands_separators(data[i].rfqBidStartPrice) + '</td><td id=maskvendorprev' + rowAppItems + ' >Y</td><td class=text-right id=mindecprev' + rowAppItems + ' >' + thousands_separators(data[i].minimumdecreamentOn) + '</td><td id=deconprev' + rowAppItems + '>' + decrementon + '</td><td class=hide id=deconvalprev' + rowAppItems + ' >A</td><td class="text-right hide" id=LIPprev' + rowAppItems + ' >' + thousands_separators(data[i].rfqLastInvoicePrice) + '</td><td class="itemclass text-right" id=itemduraprev' + rowAppItems + ' >' + 10 + '</td><td id=maskL1prev' + rowAppItems + ' >' + ShowL1Price + '</td><td id=showstartprev' + rowAppItems + ' >N</td><td class=text-right id=unitrateprev' + rowAppItems + ' >' + thousands_separators(data[i].poUnitRate) + '</td><td id=ponoprev' + rowAppItems + ' >' + data[i].poNo + '</td><td id=povendornameprev' + rowAppItems + ' >' + data[i].poVendorName + '</td><td  id=podateprev' + rowAppItems + ' >' + data[i].poDate + '</td><td class=text-right id=povalueprev' + rowAppItems + ' >' + thousands_separators(data[i].poValue) + '</td><td class=hide id=pullrfqidprev' + rowAppItems + ' >' + $('#hdnRfiRfqID').val() + '</td><td class=hide id=rfqparameteridprev' + rowAppItems + ' >' + data[i].rfqParameterID + '</td></tr>');
                        totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(0);

                    }
                    sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger)
                    if ($('#ddlbidclosetype option:selected').val() == "S") {
                        $('.itemclass').removeClass('hide')
                    }
                    else {
                        $('.itemclass').addClass('hide')
                        $('.itemclass').val(0)
                    }
                    $('#wrap_scrollerPrev').show();
                    rowAppItems = rowAppItems + 1;
                    rowAppItemsrno = rowAppItemsrno + 1;

                }
                var arr = $("#tblServicesProduct >tbody>tr");

                $.each(arr, function (i, item) {
                    var currIndex = $("#tblServicesProduct >tbody>tr").eq(i);

                    var matchText = $('#hdnRfiRfqID').val()//currIndex.find("td:eq(23)").text();
                    var RFqparameterID = currIndex.find("td:eq(24)").text();

                    $(this).nextAll().each(function (i, inItem) {

                        if (matchText == $(this).find("td:eq(23)").text() && RFqparameterID == $(this).find("td:eq(24)").text()) {
                            $(this).remove();
                            rowAppItems = rowAppItems - 1;
                            rowAppItemsrno = rowAppItemsrno - 1;
                            stRFQ = 'false'
                        }
                    });
                });

                if (stRFQ == 'true') {
                    jQuery('#divalertpull').slideDown('show');
                    $('#spansuccess1pull').text('Data pulled successfully.')
                    jQuery('#divalerterrpull').css('display', 'none');
                    setTimeout(function () {
                        jQuery('#divalertpull').css('display', 'none');
                        jQuery('#RFQPullData').modal('hide');
                    }, 2000);
                }
                else {
                    jQuery('#divalerterrpull').slideDown('show');
                    jQuery('#divalertpull').css('display', 'none');
                    $('#spanerterrpull').text('This RFQ is already pulled for Bid')
                    $("#txtrfirfqsubject").val('')
                    $('#hdnRfiRfqID').val('0')
                    setTimeout(function () {
                        jQuery('#divalerterrpull').css('display', 'none');
                    }, 2000);
                }
                jQuery.unblockUI();
                return true;
                //}
                //else {
                //    jQuery('#divalerterrpull').slideDown('show');
                //    $('#spanerterrpull').text('The RFQ is not configured for Reverse Auction!!!')
                //    setTimeout(function () {
                //        jQuery('#divalerterrpull').css('display', 'none');
                //    }, 5000);
                //    jQuery.unblockUI();
                //    return false;
                //}
            }
            else {
                jQuery('#divalerterrpull').slideDown('show');
                $('#spanerterrpull').text('No RFQ participation till now!!!')
                setTimeout(function () {
                    jQuery('#divalerterrpull').css('display', 'none');
                }, 5000);
                jQuery.unblockUI();
                return false;
            }

        },
        error: function (xhr) {
            jQuery('#divalerterrpull').slideDown('show');
            $('#spanerterrpull').text('You have error .Please try again after page refresh.')
            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            setTimeout(function () {
                jQuery('#divalerterrpull').css('display', 'none');
            }, 5000);
            jQuery.unblockUI();
            return false;

        }

    });

}
function fnfetchRFQVendor() {

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/eRAfetcheRFQVendor/?RFQID=" + $('#hdnRfiRfqID').val() + "&BidID=" + sessionStorage.getItem('CurrentBidID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            jQuery('#selectedvendorlists').empty();
            jQuery('#selectedvendorlistsPrev').empty();
            $('#chkAll').closest("span").removeClass("checked")
            $('#chkAll').prop("checked", false);
            jQuery("#tblvendorlist > tbody").empty();
            var vName = ''; var str = '';

            //$("#tblvendorlist> tbody > tr").each(function (index) {
            //    $(this).find("span#spanchecked").removeClass("checked");
            //    vCount = 0;
            //    $('input[name="chkvender"]').prop('disabled', false);

            //    jQuery('#selectedvendorlists').hide()
            //    jQuery('#selectedvendorlistsPrev').hide()
            //    jQuery('#selectedvendorlists').empty();
            //    jQuery('#selectedvendorlistsPrev').empty();
            //});

            if (data.length > 0) {

                for (var i = 0; i < data.length; i++) {
                    vName = data[i].vendorName;
                    vCount = vCount + 1;
                    str = "<tr id=vList" + data[i].vendorID + " ><td class='hide'>" + data[i].vendorID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\" class='checked'><input disabled type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].vendorID + "'\)\"; id=\"chkvender" + data[i].vendorID + "\" value=" + data[i].vendorID + " style=\"cursor:pointer\" name=\"chkvender\" /></span></div></td><td> " + vName + " </td></tr>";
                    jQuery('#tblvendorlist > tbody').append(str);

                    if ($('#ddlAuctiontype').val() == "83" || $('#ddlAuctiontype').val() == "81") {
                        $('.THLoading').show()
                        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + data[i].vendorID + '><td class=hide>' + data[i].vendorID + '</td><td>' + data[i].vendorName + '</td><td class=tblcolweightage id=tblcolweightage' + data[i].vendorID + '>' + data[i].advFactor + '</td><td class=hide>' + data[i].isFromRFQ + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + data[i].vendorID + ',SelecetedVendorPrev' + data[i].vendorID + ',' + data[i].vendorID + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success lambdafactor" title="Add Weightage" onclick="addWeightageToVendor(' + data[i].vendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
                    }
                    else {
                        $('.THLoading').hide()
                        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + data[i].vendorID + '><td class=hide>' + data[i].vendorID + '</td><td>' + data[i].vendorName + '</td><td class="tblcolweightage" id=tblcolweightage' + data[i].vendorID + '>' + data[i].advFactor + '</td><td class=hide>' + data[i].isFromRFQ + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + data[i].vendorID + ',SelecetedVendorPrev' + data[i].vendorID + ',' + data[i].vendorID + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success lambdafactor hide" title="Add Weightage" onclick="addWeightageToVendor(' + data[i].vendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
                    }

                    if (data[i].isFromRFQ == "Y") {
                        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + data[i].vendorID + '><td class=hide>' + data[i].vendorID + '</td><td>' + data[i].vendorName + '</td><td class="tblcolweightage" id=tblcolweightagePrev' + data[i].vendorID + '>' + data[i].advFactor + '</td><td class=hide>' + data[i].isFromRFQ + '</td><td data-toggle="popover" data-trigger="hover" data-content="View RFQ Quotes" id=td' + i + '><a id=btnviewquotes' + data[i].vendorID + ' class="btn btn-xs btn-success" href="#viewvendorRFQprice" data-toggle="modal" data-placement="left"  onclick="viewRFQQuotes(' + data[i].vendorID + ')"><i class="glyphicon glyphicon-asterisk"></i></a></td></tr>')
                    }
                    else {
                        if ($('#ddlAuctiontype').val() == "83" || $('#ddlAuctiontype').val() == "81") {
                            $('.THLoading').show()
                            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + data[i].vendorID + '><td class=hide>' + data[i].vendorID + '</td><td>' + data[i].vendorName + '</td><td class="tblcolweightage" id=tblcolweightagePrev' + data[i].vendorID + ' colspan=2>' + data[i].advFactor + '</td><td class=hide>' + data[i].isFromRFQ + '</td></tr>')
                        }
                        else {
                            $('.THLoading').hide()
                            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + data[i].vendorID + '><td class=hide>' + data[i].vendorID + '</td><td>' + data[i].vendorName + '</td><td class="hide tblcolweightage" id=tblcolweightagePrev' + data[i].vendorID + ' colspan=2>' + data[i].advFactor + '</td><td class=hide>' + data[i].isFromRFQ + '</td></tr>')
                        }
                    }
                    $('#td' + i).popover("show")
                }
                jQuery('#selectedvendorlists').show()
                jQuery('#selectedvendorlistsPrev').show()
            }
        },

        error: function (xhr) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }

            return false;
        }
    });
}
$("#RFQPullData").on("hidden.bs.modal", function () {
    $("#txtrfirfqsubject").val('')


});

function viewRFQQuotes(vendorid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });


    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQReport/eRFQFetchQuotedPriceReport/?VendorID=" + vendorid + "&RFQId=" + $('#hdnRfiRfqID').val() + "&RFQVersionId=99",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var quotes = '';

            jQuery("#tblServicesProductVendor").empty();
            if (data[0].quotesDetails.length > 0) {

                for (var i = 0; i < data[0].quotesDetails.length; i++) {
                    if (i == 0) {
                        jQuery('#tblServicesProductVendor').append('<thead><tr style="background: grey; color:light black;"><th>Item/Product/Services</th><th>Quoted Landed Unit Price (Without GST)</th></tr></thead>');

                    }
                    if (data[0].quotesDetails[i].rfqtcid == 0) {
                        if (data[0].quotesDetails[i].rfqVendorPricewithoutGST != 0) {
                            quotes = thousands_separators(data[0].quotesDetails[i].rfqVendorPricewithoutGST)
                        }
                        else {
                            quotes = 'Not Quoted';
                        }
                        jQuery('#tblServicesProductVendor').append('<thead id=headid' + i + '><tr><td>' + data[0].quotesDetails[i].rfqShortName + '</td><td class=text-right>' + quotes + '</td></tr></thead>');

                    }
                }
            }
            else {
                jQuery('#tblServicesProductVendor').append('<tr><td>No Record Found</td></tr>');

            }

            jQuery.unblockUI();
        },

        error: function (xhr) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
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
$("#btndownloadTemplate").click(function (e) {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
    if ($('#ddlbidclosetype').val() == "A") {
        $('#thbidduraion').remove()

    }


    tableToExcelMultipleWorkSheet(['tblBiddetails', 'tblUOM'], ['DataTemplate', 'Instructions'], 'RAXLTemplate -' + postfix + '.xls')
    if ($('#ddlbidclosetype').val() == "A") {
        $('#Trhead').append("<th id='thbidduraion'>ItemBidDuration</th>")
    }
});
function fnfillInstructionExcel() {
    $('#tblUOM').empty()

    $('#tblUOM').append('<thead><tr><th data-style="Header" colspan=2>Select HideTargetPrice (Y or N) as under:</th></tr></thead>')
    $('#tblUOM').append('<tr><td colspan=2>Y for Hide Target Price to all vendors</td></tr>');
    $('#tblUOM').append('<tr><td colspan=2>N for Show Target Price to all vendors</td></tr>');
    $('#tblUOM').append("<tr><td colspan=2>&nbsp;</td></tr><tr><td  colspan=2>&nbsp;</td></tr>")

    $('#tblUOM').append('<tr><th   colspan=2 data-style="Header">Select DecrementOn (A or P) as given below:</th></tr>')
    $('#tblUOM').append('<tr><td colspan=2>A - to select bid decrement in Amount</td></tr>');
    $('#tblUOM').append('<tr><td colspan=2>P - to select bid decrement in percentage</td></tr>');
    $('#tblUOM').append("<tr><td colspan=2>&nbsp;</td></tr><tr><td colspan=2>&nbsp;</td></tr>")

    $('#tblUOM').append('<tr><th data-style="Header"  colspan=2>Select ShowL1Price (Y or N) as given below:</th></tr>')
    $('#tblUOM').append('<tr><td  colspan=2>N - for not showing ongoing L1 Price to all vendor</td></tr>');
    $('#tblUOM').append('<tr><td  colspan=2>Y - for showing ongoing L1 Price to all vendors</td></tr>');
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




