$("#cancelBidBtn").hide();

jQuery(document).ready(function () {
    $("#txtlastinvoiceprice,#txtquantitiy,#txtCeilingPrice,#txtminimumdecreament,#txtitembidduration").inputmask({//,#txttargetprice,#txtunitrate,#txtpovalue
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
        if (!jQuery("#tblapprovers thead").length) {
            jQuery("#tblapprovers").append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td><a class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ',trAppidPrev' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td><a class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ',trAppidPrev' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }


        $('#wrap_scrollerPrevApp').show();
        if (!jQuery("#tblapproversPrev thead").length) {

            jQuery("#tblapproversPrev").append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery("#tblapproversPrev").append('<tr id=trAppidPrev' + rowApp + '><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td></tr>');
        }
        else {
            jQuery("#tblapproversPrev").append('<tr id=trAppidPrev' + rowApp + '><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td></tr>');
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
            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td class=hide>N</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorid + ',SelecetedVendorPrev' + vendorid + ',' + vendorid + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td class=hide>N</td></tr>')

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
function Check(event, vname, vendorID) {


    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {
        $(event).closest("span#spanchecked").removeClass("checked")
    }

    else {
        vCount = vCount + 1;
        var EvID = event.id;
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")
        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td class=hide>N</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',SelecetedVendorPrev' + vendorID + ',' + vendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td class=hide>N</td></tr>')
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
    if ($("#selectedvendorlists > tbody > tr").length > 0) {
        $("#selectedvendorlists> tbody > tr").each(function (index) {

            i = i + 1;
            if (i >= 2) {
                status = "True";
            }
            else {
                status == "false";
            }
        });
    }
    else {
        $("#tblvendorlist> tbody > tr").each(function (index) {

            if ($(this).find("span#spanchecked").attr('class') == 'checked') {
                i = i + 1;
                if (i >= 2) {
                    status = "True";
                }
                else {
                    status == "false";
                }

            }

        });
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

jQuery.validator.addMethod(
    "notEqualTo",
    function (elementValue, element, param) {
        return elementValue != param;
    },
    //"Value cannot be {0}"
    "This field is required."
);
jQuery.validator.addMethod("dollarsscents", function (value, element) {
    return this.optional(element) || /^\d{0,4}(\.\d{0,3})?$/i.test(value);
}, "You must include three decimal places");

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
                        //required: false,
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
                        number: true,
                        dollarsscents: true
                    },
                    txtCeilingPrice: {
                        required: true,
                        notEqualTo: 0,
                        maxlength: 50,
                        dollarsscents: true
                    },
                    txtminimumdecreament: {
                        required: true,
                        dollarsscents: true
                    },
                    txtitembidduration: {
                        required: true,
                        number: true,
                        maxlength: 3
                    },

                    txtlastinvoiceprice: {
                        number: true,
                        maxlength: 50
                    },

                    txtunitrate: {
                        number: true,
                        maxlength: 50,
                        dollarsscents: true
                    },
                    txtpovalue: {
                        number: true,
                        maxlength: 50,
                        dollarsscents: true
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
                        else {
                            Dateandtimevalidate('index1')
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
                            ConfigureBidForCoalTab2()
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
function ConfigureBidForCoalTab1() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';
    var AttachementFileName = '';
    var BidDuration = 0;

    if (jQuery("#txtBidDuration").val() != '' && jQuery("#txtBidDuration").val() != null) {
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
    var StartDT = new Date($('#txtbidDate').val().replace('-', ''));
    //StartDT = moment(StartDT).format('DD/MM/YYYY h:mm:ss a');
    var Tab1Data = {

        "BidId": parseInt(sessionStorage.getItem('CurrentBidID')),
        "BidSubject": jQuery("#txtBidSubject").val(),
        "BidDescription": jQuery("#txtbiddescription").val(),
        //"BidDate": jQuery("#txtbidDate").val(),
        "BidDate": StartDT,
        //"BidTime": jQuery("#txtbidTime").val(),
        "BidDuration": parseInt(BidDuration),
        "CurrencyID": parseInt(jQuery("#dropCurrency option:selected").val()),
        "BidTypeID": 8,
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
        "HideVendor": $('#drphideVendor').val(),
        "NoofBidExtension": parseInt($("#txtBidExtension").val())
    };

    // console.log(JSON.stringify(Tab1Data))
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
        "BidTypeID": 8,
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
function ConfigureBidForCoalTab2() {
    var targetPrice;
    var unitrate = 0
    var BidDuration = 0;
    var povalue = 0;
    var itmduartion = 0, i = 0;
    var tab2Items = '', PriceDetails = [];
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    totalitemdurationstagger = 0;

    var rowCount = jQuery('#tblServicesProduct tr').length;
    if (rowCount > 1) {

        var ItemStatus = 'Open';
        $("#tblServicesProduct tr:gt(0)").each(function () {

            targetPrice = 0
            unitrate = 0;
            povalue = 0, i = 1, itmduartion = 0; tab2Data = '';
            var this_row = $(this);


            if ($.trim(this_row.find('td:eq(6)').html()) != '') {
                targetPrice = $.trim(this_row.find('td:eq(6)').html());
            }
            if ($.trim(this_row.find('td:eq(19)').html()) != '') {
                unitrate = removeThousandSeperator($.trim(this_row.find('td:eq(19)').html()));
            }
            if ($.trim(this_row.find('td:eq(23)').html()) != '') {
                povalue = removeThousandSeperator($.trim(this_row.find('td:eq(23)').html()));
            }
            var remark = $.trim(this_row.find('td:eq(5)').html()).replace(/'/g, "");
            var description = $.trim(this_row.find('td:eq(4)').html()).replace(/'/g, "");
            if ($('#ddlbidclosetype').val() == "A") {
                itmduartion = 0;
                BidDuration = BidDuration + 0;
            }
            else {
                itmduartion = $.trim(this_row.find('td:eq(15)').html());

                BidDuration = parseInt(BidDuration) + parseInt($.trim(this_row.find('td:eq(16)').html()))
                totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt($.trim(this_row.find('td:eq(16)').html()))

            }

            tab2Items = {
                "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
                "ItemCode": $.trim(this_row.find('td:eq(2)').html()),
                "DestinationPort": $.trim(this_row.find('td:eq(3)').html()),
                "Description": description,
                "Targetprice": parseFloat(removeThousandSeperator(targetPrice)),
                "Quantity": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(7)').html()))),
                "GST": parseFloat(removeThousandSeperator($.trim(this_row.find('td:eq(14)').html()))),
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
                "MaskL1Price": $.trim(this_row.find('td:eq(17)').html()),
                "ShowStartPrice": $.trim(this_row.find('td:eq(18)').html()),
                "PoUnitRate": parseFloat(unitrate),
                "PoNo": $.trim(this_row.find('td:eq(20)').html()),
                "PoVendorName": $.trim(this_row.find('td:eq(21)').html()),
                "PoDate": $.trim(this_row.find('td:eq(22)').html()),
                "PoValue": parseFloat(povalue)
            }

            if ($('#ddlbidclosetype').val() != "A") {
                ItemStatus = 'Inactive';
            }
            PriceDetails.push(tab2Items)
        });
        sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger);
    }
    var Tab2data = {
        "ProductDetails": PriceDetails,
        "bidID": parseInt(sessionStorage.getItem('CurrentBidID')),
        "UserId": sessionStorage.getItem('UserID'),
        "BidDuration": parseInt(BidDuration),
        "BidClosingType": $('#ddlbidclosetype option:selected').val()

    };

    // alert(JSON.stringify(Tab2data))
    console.log(JSON.stringify(Tab2data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsCoalTab2/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab2data),
        dataType: "json",
        success: function (data) {
            if (parseInt(data) > 0) {
                if ($('#ddlbidclosetype').val() == "S") {
                    $('#txtBidDuration').val(BidDuration)
                    fetchCoalDetails();
                }
                return true;
            }
            else {
                return false;

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
            return false;
        }

    });

    jQuery.unblockUI();
}

function ConfigureBidForSeaExportTab3() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var InsertQuery = '';
    $("#selectedvendorlistsPrev> tbody > tr").each(function (index) {
        InsertQuery = InsertQuery + $.trim($(this).find('td:eq(0)').html()) + '~0~N#';
        //InsertQuery = InsertQuery + "select " + sessionStorage.getItem('CurrentBidID') + "," + $.trim($(this).find('td:eq(0)').html()) + "," + $.trim($(this).find('td:eq(2)').html()) + ",'" + $.trim($(this).find('td:eq(3)').html()) + "' union all ";
    });

    var Tab3data = {
        "BidVendors": InsertQuery,
        "BidID": parseInt(sessionStorage.getItem('CurrentBidID'))
    };
    console.log(JSON.stringify(Tab3data))
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


    var Tab3data = {

        "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
        "UserID": sessionStorage.getItem('UserID'),
        //"BidSubject": jQuery("#txtBidSubject").val(),
        //"BidDescription": jQuery("#txtbiddescription").val(),
        //"BidDate": jQuery("#txtbidDate").val(),
        // "BidTime": jQuery("#txtbidTime").val(),
        "BidTypeID": 8,
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

            // if (data[0].mailSubject !='') {

            jQuery.unblockUI();

            bootbox.alert("Bid Configured Successfully.", function () {
                sessionStorage.removeItem('CurrentBidID');
                window.location = sessionStorage.getItem("HomePage")
                return false;
            });
            // }
            //else {

            //    jQuery.unblockUI();
            //    bootbox.alert("Configuration error.", function () {
            //        sessionStorage.removeItem('CurrentBidID');
            //        window.location = sessionStorage.getItem("HomePage")
            //        return false;
            //    });

            //}

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
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />Please Wait...</h5>' });
    if (form.valid() == true) {
        var st = "true"
        var i = 0;
        if ($('#add_or').text() == "Modify") {
            st = "true";

            $("#tblServicesProduct tr:gt(0)").each(function () {
                if ($.trim($('#destinationport' + i).html()) == $('#txtdestinationPort').val() && $.trim($('#remarks' + i).html()) != $('#txtbiddescriptionP').val() && $.trim($('#TP' + i).html()) != $('#txttargetprice').val() && $.trim($('#quan' + i).html()) != $("#txtquantitiy").val() && $.trim($('#uom' + i).html()) != $("#dropuom").val() && $.trim($('#CP' + i).html()) != $('#txtCeilingPrice').val() && $.trim($('#maskvendor' + i).html()) != $('#checkmaskvendor option:selected').val() && $.trim($('#mindec' + i).html()) != $('#txtminimumdecreament').val() && $.trim($('#deconval' + i).html()) != $('#drpdecreamenton option:selected').val() && $.trim($('#LIP' + i).html()) != $('#txtlastinvoiceprice').val() && $.trim($('#itemdura' + i).html()) != $("#txtitembidduration").val() && $.trim($('#gst' + i).html()) != $("#txtGST").val()) {
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
            }
            else if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
                error.show();
                $('#spandanger').html('Minimum decrement should be less than bid start price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;

            }

            else if ((parseInt($('#txtminimumdecreament').val()) > parseInt(20) && $("#drpdecreamenton option:selected").val() == "P")) {
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
                $("#gst" + this_row).text($('#txtGST').val())
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



                //For Preview Table
                $("#itemcodeprev" + this_row).text($('#txtItemCode').val())
                $("#destinationportprev" + this_row).text($('#txtdestinationPort').val())
                // $("#desc" + this_row).find("td:eq(3)").text(Description)
                $("#remarksprev" + this_row).text(remarks)

                $("#TPprev" + this_row).text($('#txttargetprice').val())
                $("#quanprev" + this_row).text($('#txtquantitiy').val())
                $("#gstprev" + this_row).text($('#txtGST').val())
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
                resetfun();

            }

        }

        else {
            st = "true"; i = 0;

            if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
                error.show();
                $('#spandanger').html('Minimum decrement should be less than bid start price.');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                jQuery.unblockUI();
                return false;
            }
            else if ((parseInt($('#txtminimumdecreament').val()) > parseInt(20) && $("#drpdecreamenton option:selected").val() == "P")) {
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

    if (!jQuery("#tblServicesProduct thead").length) {
        jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th 'width:20%!important;'></th><th>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>GST%</th><th class=hide>Last Invoice Price</th><th class=itemclass>Bid Duration (in mins)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td  style="width:20%!important;" id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationport' + i + ' >' + $('#txtdestinationPort').val() + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarks' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TP' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uom' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendor' + i + ' >' + status + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=decon' + i + '>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=deconval' + i + ' >' + $("#drpdecreamenton").val() + '</td><td class="text-right" id=gst' + i + ' >' + thousands_separators($("#txtGST").val()) + '</td><td class="text-right hide" id=LIP' + i + ' >' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class=itemclass id=itemdura' + i + '  >' + itemBidDuration + '</td><td id=maskL1' + i + '>' + MaskL1Price + '</td><td id=showstart' + i + ' >' + ShowStartPrice + '</td><td class=text-right id=unitrate' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=pono' + i + ' >' + $("#txtPono").val() + '</td><td id=povendorname' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td></tr>');
    }
    else {

        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn  btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td style="width:20%!important;" id=itemcode' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationport' + i + ' >' + $('#txtdestinationPort').val() + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarks' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TP' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uom' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendor' + i + ' >' + status + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=decon' + i + ' >' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=deconval' + i + ' >' + $("#drpdecreamenton").val() + '</td><td class="text-right" id=gst' + i + ' >' + thousands_separators($("#txtGST").val()) + '</td><td class="text-right hide" id=LIP' + i + ' >' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class=itemclass id=itemdura' + i + ' >' + itemBidDuration + '</td><td id=maskL1' + i + ' >' + MaskL1Price + '</td><td id=showstart' + i + ' >' + ShowStartPrice + '</td><td class=text-right id=unitrate' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=pono' + i + '>' + $("#txtPono").val() + '</td><td id=povendorname' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podate' + i + '>' + $("#txtPODate").val() + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td></tr>');

    }

    $('#wrap_scroller').show();

    if (!jQuery("#tblServicesProductPrev thead").length) {

        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>GST%</th><th class=hide>Last Invoice Price</th><th class=itemclass>Item Bid Duration(Minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td style="width:20%!important;" id=itemcodeprev' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationportprev' + i + '>' + $('#txtdestinationPort').val() + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarksprev' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right id=quanprev' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uomprev' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CPprev' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendorprev' + i + '>' + status + '</td><td class=text-right id=mindecprev' + i + '>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=deconprev' + i + ' >' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=deconvalprev' + i + '>' + $("#drpdecreamenton").val() + '</td><td class="text-right" id=gstprev' + i + ' >' + thousands_separators($("#txtGST").val()) + '</td><td class="text-right hide" id=LIPprev' + i + '>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class="itemclass text-right" id=itemduraprev' + i + ' >' + itemBidDuration + '</td><td id=maskL1prev' + i + '>' + MaskL1Price + '</td><td id=showstartprev' + i + '>' + ShowStartPrice + '</td><td class=text-right id=unitrateprev' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=ponoprev' + i + ' >' + $("#txtPono").val() + '</td><td id=povendornameprev' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podateprev' + i + ' >' + $("#txtPODate").val() + '</td><td class=text-right id=povalueprev' + i + ' >' + thousands_separators($("#txtpovalue").val()) + '</td></tr>');

        totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(itemBidDuration);

    } else {

        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td id=itemcodeprev' + i + ' >' + $('#txtItemCode').val() + '</td><td id=destinationportprev' + i + ' >' + $('#txtdestinationPort').val() + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarksprev' + i + ' >' + $('#txtbiddescriptionP').val() + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right id=quanprev' + i + ' >' + thousands_separators($('#txtquantitiy').val()) + '</td><td id=uomprev' + i + ' >' + $("#dropuom").val() + '</td><td class=text-right id=CPprev' + i + ' >' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td id=maskvendorprev' + i + ' >' + status + '</td><td class=text-right id=mindecprev' + i + ' >' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td id=deconprev' + i + ' >' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide id=deconvalprev' + i + ' >' + $("#drpdecreamenton").val() + '</td><td class="text-right" id=gstprev' + i + ' >' + thousands_separators($("#txtGST").val()) + '</td><td class="text-right hide" id=LIPprev' + i + ' >' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class="itemclass text-right" id=itemduraprev' + i + ' >' + itemBidDuration + '</td><td id=maskL1prev' + i + '>' + MaskL1Price + '</td><td id=showstartprev' + i + '>' + ShowStartPrice + '</td><td class=text-right id=unitrateprev' + i + ' >' + thousands_separators($("#txtunitrate").val()) + '</td><td id=ponoprev' + i + ' >' + $("#txtPono").val() + '</td><td id=povendornameprev' + i + ' >' + $("#txtvendorname").val() + '</td><td id=podateprev' + i + ' >' + $("#txtPODate").val() + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators($("#txtpovalue").val()) + '</td></tr>');
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
    $('#txtGST').val(removeThousandSeperator($("#gst" + icount).text()))
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
    $('#txtGST').val('')
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
}

function showhideItemBidDuration() {

    if ($('#ddlbidclosetype option:selected').val() == 'A') {

        jQuery('#divItemBiduration').css('visibility', 'hidden');
        $('#txtBidDuration').prop('disabled', false)
        $('#txtitembidduration').prop('disabled', true)
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
    else {
        $('input[name="txtBidDuration"]').rules('remove');
        $('#txtitembidduration').prop('disabled', false)
        $('#spanbidduration').hide()
        $('.condition-based-validate').removeClass('has-error')
        $('.condition-based-validate').find('.help-block').remove()
        $('#txtBidDuration').val('')
        $('#txtBidDuration').prop('disabled', true)
        jQuery('#divItemBiduration').css('visibility', 'visible');
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

function fetchCoalDetails() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchCoalExportConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + sessionStorage.getItem('CurrentBidID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            var dtst = (fnConverToLocalTime(BidData[0].bidDetails[0].bidDate));
            jQuery('#txtBidSubject').val(BidData[0].bidDetails[0].bidSubject)
            jQuery('#txtBidDuration').val(BidData[0].bidDetails[0].bidDuration)
            jQuery('#txtbiddescription').val(BidData[0].bidDetails[0].bidDetails)
            //jQuery('#txtbidDate').val(BidData[0].bidDetails[0].bidDate)
            jQuery('#txtbidDate').val(dtst)
            //jQuery('#txtbidTime').val(BidData[0].bidDetails[0].bidTime)
            jQuery('#drpshowL1L2').val(BidData[0].bidDetails[0].showRankToVendor)
            $('#drphideVendor').val(BidData[0].bidDetails[0].hideVendor)
            //jQuery('#txtBidExtension').val(BidData[0].bidDetails[0].noofBidExtension == -1 ? "" : BidData[0].bidDetails[0].noofBidExtension)
            jQuery('#txtBidExtension').val(BidData[0].bidDetails[0].noofBidExtension)
            setTimeout(function () {
                jQuery("#dropCurrency").val(BidData[0].bidDetails[0].currencyID).attr("selected", "selected");
                jQuery('#txtConversionRate').val(BidData[0].bidDetails[0].conversionRate)
            }, 2500);
            $('#txtBidDuration').val(BidData[0].bidDetails[0].bidDuration)
            $('#ddlAuctiontype').val(BidData[0].bidDetails[0].bidForID)
            jQuery('#ddlbidclosetype').val(BidData[0].bidDetails[0].bidClosingType.trim())
            $("#cancelBidBtn").show();


            if (BidData[0].bidDetails[0].bidClosingType.trim() == 'A') {

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
            else {

                $('#spanbidduration').hide()
                $('input[name="txtBidDuration"]').rules('remove');
                $('.condition-based-validate').removeClass('has-error')
                $('.condition-based-validate').find('.help-block').remove()
                $('#txtBidDuration').prop('disabled', true)

                jQuery('#divItemBiduration').css('visibility', 'visible');
            }
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


            jQuery("#tblapprovers").empty();
            jQuery("#tblapproversPrev").empty();
            $('#wrap_scrollerPrevApp').show();
            jQuery('#tblapprovers').append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery('#tblapproversPrev').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");

            for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {
                rowApp = rowApp + 1;
                str = '<tr id=trAppid' + (i + 1) + '>';
                str += '<td><a type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(trAppid' + (i + 1) + ',trAppidPrev' + (i + 1) + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></a></td>';
                str += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                str += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";

                str += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td>";
                str += "<td class=hide>" + BidData[0].bidApproverDetails[i].userID + "</td></tr>";

                jQuery('#tblapprovers').append(str);


                strp = '<tr id=trAppidPrev' + (i + 1) + '>';

                strp += '<td>' + BidData[0].bidApproverDetails[i].approverName + '</td>'
                strp += "<td>" + BidData[0].bidApproverDetails[i].emailID + "</td>";

                strp += "<td>" + BidData[0].bidApproverDetails[i].adMinSrNo + "</td></tr>";
                jQuery('#tblapproversPrev').append(strp);

            }
            totalitemdurationstagger = 0;
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblServicesProductPrev").empty();
            if (BidData[0].bidCoalDetails.length > 0) {


                $('#wrap_scroller').show();
                $('#wrap_scrollerPrev').show();


                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th></th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>GST%</th><th class=hide>Last InvoicePrice</th><th  class=itemclass >Bid Duration (in minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>GST%</th><th class=hide>Last InvoicePrice</th><th class='itemclass'>Bid Duration (in minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                for (var i = 0; i < BidData[0].bidCoalDetails.length; i++) {

                    var decrementon = 'Amount'
                    //if (BidData[0].bidCoalDetails[i].decreamentOn == 'A')
                    //    decrementon = 'Amount'
                    //else
                    //    decrementon = '%age'

                    rowAppItems = rowAppItems + 1
                    rowAppItemsrno = rowAppItemsrno + 1;



                    jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (i + 1) + '</td><td><a class="btn  btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td style="width:20%!important;" id=itemcode' + i + '>' + BidData[0].bidCoalDetails[i].itemCode + '</td><td id=destinationport' + i + '>' + BidData[0].bidCoalDetails[i].destinationPort + '</td><td class=hide>' + BidData[0].bidCoalDetails[i].description + '</td><td id=remarks' + i + '>' + BidData[0].bidCoalDetails[i].remarks + '</td><td class=text-right id=TP' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].targetprice) + '</td><td class=text-right id=quan' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].quantity) + '</td><td id=uom' + i + '>' + BidData[0].bidCoalDetails[i].uom + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators(BidData[0].bidCoalDetails[i].ceilingPrice) + '</td><td id=maskvendor' + i + ' >' + BidData[0].bidCoalDetails[i].maskVendor + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators(BidData[0].bidCoalDetails[i].minimumDecreament) + '</td><td  id=decon' + i + '  >' + decrementon + '</td><td class=hide id=deconval' + i + ' >' + BidData[0].bidCoalDetails[i].decreamentOn + '</td><td class="text-right" id=gst' + i + ' >' + thousands_separators(BidData[0].bidCoalDetails[i].gst) + '</td><td class="text-right hide" id=LIP' + i + ' >' + thousands_separators(BidData[0].bidCoalDetails[i].lastInvoicePrice) + '</td><td class="itemclass text-right" id=itemdura' + i + ' >' + BidData[0].bidCoalDetails[i].itemBidDuration + '</td><td id=maskL1' + i + ' >' + BidData[0].bidCoalDetails[i].maskL1Price + '</td><td id=showstart' + i + '>' + BidData[0].bidCoalDetails[i].showStartPrice + '</td><td class=text-right id=unitrate' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].poUnitRate) + '</td><td id=pono' + i + '  >' + BidData[0].bidCoalDetails[i].poNo + '</td><td id=povendorname' + i + '>' + BidData[0].bidCoalDetails[i].poVendorName + '</td><td id=podate' + i + '>' + BidData[0].bidCoalDetails[i].poDate + '</td><td class=text-right id=povalue' + i + ' >' + thousands_separators(BidData[0].bidCoalDetails[i].poValue) + '</td></tr>');
                    jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (i + 1) + '</td><td style="width:20%!important;" id=itemcodeprev' + i + '>' + BidData[0].bidCoalDetails[i].itemCode + '</td><td id=destinationportprev' + i + '>' + BidData[0].bidCoalDetails[i].destinationPort + '</td><td  class=hide>' + BidData[0].bidCoalDetails[i].description + '</td><td id=remarksprev' + i + '>' + BidData[0].bidCoalDetails[i].remarks + '</td><td class=text-right id=TPprev' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].targetprice) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].quantity) + '</td><td id=uomprev' + i + '>' + BidData[0].bidCoalDetails[i].uom + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].ceilingPrice) + '</td><td id=maskvendorprev' + i + '>' + BidData[0].bidCoalDetails[i].maskVendor + '</td><td class=text-right id=mindecprev' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].minimumDecreament) + '</td><td id=deconprev' + i + '>' + decrementon + '</td><td class=hide id=deconvalprev' + i + '>' + BidData[0].bidCoalDetails[i].decreamentOn + '</td><td class="text-right" id=gstprev' + i + ' >' + thousands_separators(BidData[0].bidCoalDetails[i].gst) + '</td><td class="text-right hide" id=LIPprev' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].lastInvoicePrice) + '</td><td class="itemclass text-right" id=itemduraprev' + i + '>' + BidData[0].bidCoalDetails[i].itemBidDuration + '</td><td id=maskL1prev' + i + '>' + BidData[0].bidCoalDetails[i].maskL1Price + '</td><td id=showstartprev' + i + '>' + BidData[0].bidCoalDetails[i].showStartPrice + '</td><td class=text-right id=unitrateprev' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].poUnitRate) + '</td><td id=ponoprev' + i + '>' + BidData[0].bidCoalDetails[i].poNo + '</td><td id=povendornameprev' + i + ' >' + BidData[0].bidCoalDetails[i].poVendorName + '</td><td  id=podateprev' + i + '>' + BidData[0].bidCoalDetails[i].poDate + '</td><td class=text-right id=povalueprev' + i + '>' + thousands_separators(BidData[0].bidCoalDetails[i].poValue) + '</td></tr>');
                    totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(BidData[0].bidCoalDetails[i].itemBidDuration)

                }
                sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger)
                if ($('#ddlbidclosetype option:selected').val() == "S") {
                    $('.itemclass').removeClass('hide')
                }
                else {
                    $('.itemclass').addClass('hide')
                    $('.itemclass').val(0)
                }
                if (BidData[0].bidVendorDetails.length > 0) {

                    for (var i = 0; i < BidData[0].bidVendorDetails.length; i++) {
                        vCount = vCount + 1;
                        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + BidData[0].bidVendorDetails[i].vendorID + ',SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + ',' + BidData[0].bidVendorDetails[i].vendorID + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
                        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].bidVendorDetails[i].vendorID + '><td class=hide>' + BidData[0].bidVendorDetails[i].vendorID + '</td><td>' + BidData[0].bidVendorDetails[i].vendorName + '</td></tr>')
                    }
                    jQuery('#selectedvendorlists').show()
                    jQuery('#selectedvendorlistsPrev').show()

                }

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

    setTimeout(function () {
        fetchPSBidDetailsForPreview()
    }, 2000);

}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + sessionStorage.getItem('CurrentBidID'));
}


function Dateandtimevalidate(indexNo) {
    var dtst = new Date($('#txtbidDate').val().replace('-', ''));
    dtst = moment(dtst).format('DD MMM YYYY h:mm:ss a');
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/?BidDate=" + jQuery("#txtbidDate").val() + "&BidTime=" + jQuery("#txtbidTime").val(),
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/?BidDate=" + dtst,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            if (RFQData[0].bidId == 1) {
                if (indexNo == 'index1') {
                    ConfigureBidForCoalTab1();
                    fetchPSBidDetailsForPreview();

                } else {
                    ConfigureBidForSeaExportTab3();

                }

            }
            else {
                if (indexNo == 'index1') {
                    bootbox.alert("Date and Time should not be less than current date and time.");
                    $('#form_wizard_1').bootstrapWizard('previous');
                    return false;
                } else {
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

// For Bid Preview

function fetchPSBidDetailsForPreview() {
    var TermsConditionFileName = '';
    var AttachementFileName = '';
    var hidevendor = 'No';
    jQuery('#mapedapproverPrev').html('');

    jQuery('#txtBidSubjectPrev').html($('#txtBidSubject').val())

    if ($('#ddlbidclosetype').val() == "S") {
        jQuery('#txtBidDurationPrev').html(sessionStorage.getItem('TotalBidDuration'))
    }
    else {
        jQuery('#txtBidDurationPrev').html($('#txtBidDuration').val())
    }
    jQuery('#txtbiddescriptionPrev').html($('#txtbiddescription').val())
    jQuery('#txtbidDatePrev').html($('#txtbidDate').val())
    jQuery('#txtbidTimePrev').html($('#txtbidTime').val())
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
function printdataSeaBid(result) {
    var loopcount = result.length; //getting the data length for loop.
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
    var BidDuration = 0;
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
        else if ($.trim(result[i].Remarks) == '' || $.trim(result[i].ItemService).length > 200) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Remarks can not be blank or length should be 200 characters of Item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }

        else if (!result[i].Quantity.trim().match(numberOnly) || result[i].Quantity.trim() == '') {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Quantity should be in numbers only of Item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (!result[i].GST.trim().match(numberOnly) || result[i].GST.trim() == '') {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('GST should be in numbers only of Item no ' + (i + 1) + '.');
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
            $("#errspan-excelparameter").html('Minimum Decreament Price should be in numbers only of Item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;
        }

        //else if ($.trim(result[i].DecreamentOn) == '') {
        //    $("#error-excelparameter").show();
        //    $("#errspan-excelparameter").html('DecreamentOn can not be blank of Item no ' + (i + 1) +'. Please fill and upload the file again.');
        //    $("#file-excelparameter").val('');
        //    return false;
        //} 
        else if ($('#ddlbidclosetype').val() == "S" && $.trim(result[i].ItemBidDuration) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('ItemBidDuration can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (parseInt(minimumdec) > parseInt(BidstartPrice)) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Minimum decreament should be less than bid start price of Item no ' + (i + 1) + '. Please fill and upload the file again.');
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
                Itembidduration = parseInt($.trim(result[i].ItemBidDuration.trim())) + parseInt(BidDuration)
                ItemStatus = 'Inactive';
            }
            else {
                Itembidduration = parseInt(BidDuration);
                ItemStatus = 'Open';
            }

            // if values are correct then creating a temp table
            $("<tr><td>" + replaceQuoutesFromStringFromExcel(itemcode) + "</td><td>" + replaceQuoutesFromStringFromExcel(result[i].ItemService) + "</td><td class=hide>" + replaceQuoutesFromStringFromExcel(description) + "</td><td>" + targetPrice + "</td><td>" + result[i].HideTargetPrice + "</td><td>" + replaceQuoutesFromStringFromExcel(result[i].Remarks) + "</td><td>" + result[i].Quantity + "</td><td>" + result[i].UOM + "</td><td>" + BidstartPrice + "</td><td>" + SelectedCurrency + "</td><td>" + minimumdec + "</td><td>A</td><td>" + result[i].GST + "</td><td>" + unitrate + "</td><td  id=tditemduration" + i + ">" + Itembidduration + "</td><td>" + ItemStatus + "</td><td>" + ShowL1Price + "</td><td>" + result[i].ShowStartPrice + "</td><td>" + unitrate + "</td><td>" + replaceQuoutesFromStringFromExcel(pono) + "</td><td>" + replaceQuoutesFromStringFromExcel(povendorname) + "</td><td>" + podate + "</td><td>" + Povalue + "</td></tr>").appendTo("#temptableForExcelDataparameter");
            var arr = $("#temptableForExcelDataparameter tr");

            $.each(arr, function (i, item) {
                var currIndex = $("#temptableForExcelDataparameter tr").eq(i);

                var matchText = currIndex.find("td:eq(0)").text().toLowerCase();
                $(this).nextAll().each(function (i, inItem) {

                    if (matchText === $(this).find("td:eq(1)").text().toLowerCase()) {
                        $(this).remove();
                        st = 'false'
                        ErrorMszDuplicate = ErrorMszDuplicate + ' RFQ Item with same name already exists at row no ' + (i + 1) + ' . Item will not insert.!<BR>'
                    }
                });
            });
        }

        z++;

    } // for loop ends

    var excelCorrect = 'N';
    var ErrorUOMMsz = '';
    var ErrorUOMMszRight = '';
    Rowcount = 0;

    // check for UOM
    $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
        var this_row = $(this);
        excelCorrect = 'N';
        Rowcount = Rowcount + 1;
        for (var i = 0; i < allUOM.length; i++) {
            if ($.trim(this_row.find('td:eq(7)').html()).toLowerCase() == allUOM[i].uom.trim().toLowerCase()) {//allUOM[i].UOMID
                excelCorrect = 'Y';
            }

        }
        var quorem = (allUOM.length / 2) + (allUOM.length % 2);
        if (excelCorrect == "N") {
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
        //switch ($.trim(this_row.find('td:eq(11)').html())) {
        //    case 'A':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'P':
        //        excelCorrect = 'Y';
        //        break;

        //    default:
        //        excelCorrect = 'N';
        //        $("#error-excelparameter").show();
        //        $("#errspan-excelparameter").html('<b>DecreamentOn</b> not filled properly. Please choose DecreamentOn from given below: <br/><br/>'
        //            + '<ul class="col-md-4 text-left">'
        //            + '<li>A - to select bid decrement in Amount</li>'
        //            + '<li>P - to select bid decrement in percentage</li>'
        //            + '</ul><div class=clearfix></div>'
        //            + '<br/>and upload the file again.');
        //        $("#file-excelparameter").val('');
        //        return false;
        //}
    });


    if (excelCorrect == 'Y') {
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
function fnSetCoalparameterTable() {
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
        $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
            var this_row = $(this);
            decon = "Amount";
            if (!jQuery("#tblServicesProduct thead").length) {
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th 'width:20%!important;'></th><th>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>GST%</th><th class=hide>Last Invoice Price</th><th class=itemclass>Bid Duration (in mins)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");

                jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td  style="width:20%!important;" id=itemcode' + i + '>' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td id=destinationport' + i + ' >' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarks' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td class=text-right id=TP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(6)').html())) + '</td><td id=uom' + i + ' >' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(8)').html())) + '</td><td id=maskvendor' + i + ' >' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(10)').html())) + '</td><td id=decon' + i + ' >' + decon + '</td><td class=hide id=deconval' + i + ' >' + $.trim(this_row.find('td:eq(11)').html()) + '</td><td class="text-right" id=gst' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(12)').html())) + '</td><td class="text-right hide" id=LIP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(13)').html())) + '</td><td class=itemclass id=itemdura' + i + '>' + $.trim(this_row.find('td:eq(14)').html()) + '</td><td id=maskL1' + i + '  >' + $.trim(this_row.find('td:eq(16)').html()) + '</td><td id=showstart' + i + ' >' + $.trim(this_row.find('td:eq(17)').html()) + '</td><td id=unitrate' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(18)').html())) + '</td><td id=pono' + i + ' >' + $.trim(this_row.find('td:eq(19)').html()) + '</td><td id=povendorname' + i + ' >' + $.trim(this_row.find('td:eq(20)').html()) + '</td><td id=podate' + i + ' >' + $.trim(this_row.find('td:eq(21)').html()) + '</td><td id=povalue' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(22)').html())) + '</td></tr>');

            }
            else {
                jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td><a type="button" class="btn btn-xs btn-success" onclick="editvalues(' + i + ')" ><i class="fa fa-pencil"></i></a>&nbsp;<a class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></a></td><td  style="width:20%!important;" id=itemcode' + i + '>' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td id=destinationport' + i + ' >' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarks' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td class=text-right id=TP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td class=text-right id=quan' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(6)').html())) + '</td><td id=uom' + i + ' >' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=CP' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(8)').html())) + '</td><td id=maskvendor' + i + ' >' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td class=text-right id=mindec' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(10)').html())) + '</td><td id=decon' + i + ' >' + decon + '</td><td class=hide id=deconval' + i + ' >' + $.trim(this_row.find('td:eq(11)').html()) + '</td><td class="text-right" id=gst' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(12)').html())) + '</td><td class="text-right hide" id=LIP' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(13)').html())) + '</td><td class=itemclass id=itemdura' + i + '>' + $.trim(this_row.find('td:eq(14)').html()) + '</td><td id=maskL1' + i + '  >' + $.trim(this_row.find('td:eq(16)').html()) + '</td><td id=showstart' + i + ' >' + $.trim(this_row.find('td:eq(17)').html()) + '</td><td id=unitrate' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(18)').html())) + '</td><td id=pono' + i + ' >' + $.trim(this_row.find('td:eq(19)').html()) + '</td><td id=povendorname' + i + ' >' + $.trim(this_row.find('td:eq(20)').html()) + '</td><td id=podate' + i + ' >' + $.trim(this_row.find('td:eq(21)').html()) + '</td><td id=povalue' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(22)').html())) + '</td></tr>');

            }

            $('#wrap_scroller').show();
            if (!jQuery("#tblServicesProductPrev thead").length) {

                jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>S No</th><th style='width:20%!important;'>Item Code</th><th>Item/Service</th><th class=hide>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Hide Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>GST%</th><th class=hide>Last Invoice Price</th><th class=itemclass>Item Bid Duration(Minutes)</th><th>Show L1 Price</th><th>Show Start Price</th><th>PO Unit Rate</th><th>PO No.</th><th>PO Vendor Name</th><th>PO Date</th><th>PO Value</th></tr></thead>");
                jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td id=itemcodeprev' + i + ' style="width:20%!important;">' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td id=destinationportprev' + i + '>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarksprev' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(6)').html())) + '</td><td id=uomprev' + i + '>' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(8)').html())) + '</td><td  id=maskvendorprev' + i + '>' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td  id=mindecprev' + i + '  class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(10)').html())) + '</td><td id=deconprev' + i + ' >' + decon + '</td><td id=deconvalprev' + i + ' class=hide>' + $.trim(this_row.find('td:eq(11)').html()) + '</td><td class="text-right" id=gstprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(12)').html())) + '</td><td class="text-right hide" id=LIPprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(18)').html())) + '</td><td class="itemclass text-right" id=itemduraprev' + i + ' >' + $.trim(this_row.find('td:eq(14)').html()) + '</td><td id=maskL1prev' + i + ' >' + $.trim(this_row.find('td:eq(16)').html()) + '</td><td id=showstartprev' + i + ' >' + $.trim(this_row.find('td:eq(17)').html()) + '</td><td id=unitrateprev' + i + '  class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(18)').html())) + '</td><td id=ponoprev' + i + ' >' + $.trim(this_row.find('td:eq(19)').html()) + '</td><td id=povendornameprev' + i + '>' + $.trim(this_row.find('td:eq(20)').html()) + '</td><td id=podateprev' + i + '>' + $.trim(this_row.find('td:eq(21)').html()) + '</td><td id=povalueprev' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(22)').html())) + '</td></tr>');

                totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(this_row.find('td:eq(13)').html());

            } else {

                jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + (rowAppItemsrno + 1) + '</td><td id=itemcodeprev' + i + ' style="width:20%!important;">' + $.trim(this_row.find('td:eq(0)').html()) + '</td><td id=destinationportprev' + i + '>' + $.trim(this_row.find('td:eq(1)').html()) + '</td><td  class=hide>' + $('#txtdescription').val() + '</td><td id=remarksprev' + i + '>' + $.trim(this_row.find('td:eq(5)').html()) + '</td><td class=text-right id=TPprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(3)').html())) + '</td><td class=text-right id=quanprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(6)').html())) + '</td><td id=uomprev' + i + '>' + $.trim(this_row.find('td:eq(7)').html()) + '</td><td class=text-right id=CPprev' + i + '>' + thousands_separators($.trim(this_row.find('td:eq(8)').html())) + '</td><td  id=maskvendorprev' + i + '>' + $.trim(this_row.find('td:eq(4)').html()) + '</td><td  id=mindecprev' + i + '  class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(10)').html())) + '</td><td id=deconprev' + i + ' >' + decon + '</td><td id=deconvalprev' + i + ' class=hide>' + $.trim(this_row.find('td:eq(11)').html()) + '</td><td class="text-right" id=gstprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(12)').html())) + '</td><td class="text-right hide" id=LIPprev' + i + ' >' + thousands_separators($.trim(this_row.find('td:eq(18)').html())) + '</td><td class="itemclass text-right" id=itemduraprev' + i + ' >' + $.trim(this_row.find('td:eq(14)').html()) + '</td><td id=maskL1prev' + i + ' >' + $.trim(this_row.find('td:eq(16)').html()) + '</td><td id=showstartprev' + i + ' >' + $.trim(this_row.find('td:eq(17)').html()) + '</td><td id=unitrateprev' + i + '  class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(18)').html())) + '</td><td id=ponoprev' + i + ' >' + $.trim(this_row.find('td:eq(19)').html()) + '</td><td id=povendornameprev' + i + '>' + $.trim(this_row.find('td:eq(20)').html()) + '</td><td id=podateprev' + i + '>' + $.trim(this_row.find('td:eq(21)').html()) + '</td><td id=povalueprev' + i + ' class=text-right>' + thousands_separators($.trim(this_row.find('td:eq(22)').html())) + '</td></tr>');
                totalitemdurationstagger = parseInt(totalitemdurationstagger) + parseInt(this_row.find('td:eq(13)').html());

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
            i = i + 1;
        })
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

    $('#tblUOM').append('<tr><th   colspan=2 data-style="Header">Select DecreamentOn (A) as given below:</th></tr>')
    $('#tblUOM').append('<tr><td colspan=2>A - to select bid decrement in Amount</td></tr>');
    //$('#tblUOM').append('<tr><td colspan=2>P - to select bid decrement in percentage</td></tr>');
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




