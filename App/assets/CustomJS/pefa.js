$("#cancelBidBtn").hide();

$("#txtCeilingPrice,#txtquantitiy,#txtminimumdecreament,#txtStartingPrice,#txtPriceReductionAmount").inputmask({
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
       'removeMaskOnSubmit': true

    });


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
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ',trAppidPrev' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
        }
        else {
            jQuery("#tblapprovers").append('<tr id=trAppid' + rowApp + '><td><button class="btn  btn-xs btn-danger" onclick="deleteApprow(trAppid' + rowApp + ',trAppidPrev' + rowApp + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + UserName + '</td><td>' + EmailID + '</td><td>' + rowApp + '</td><td class=hide>' + UserID + '</td></tr>');
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
        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',SelecetedVendorPrev' + vendorID + ',' + vendorID+')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
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
        if ($("#selectedvendorlists> tbody > tr").length < 2 ) {
            status == "false";
        }
        else {
            status = "True";
        }
    }
    else {
         //$("#tblvendorlist> tbody > tr").each(function (index) {
         //     if ($(this).find("span#spanchecked").attr('class') == 'checked') {
         //           i = i + 1;
         //           if (i >= 1) {

         //               status = "True";
         //           }
         //           else {
         //               status == "false";
         //           }

         //       }

         //   });
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
    $("#tblvendorlist> tbody > tr").each(function(index) {
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
    $("#tblvendorlist> tbody > tr").each(function(index) {
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

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) ,
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

                    ddlSector: {
                        required: true
                    },

                    ddlCountry: {
                        required: true
                    },

                    txtBidDuration: {
                        required: true,
                        minlength: 1,
                        maxlength: 3,
                        number: true
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
                    ddlAuctiontype:{
                        required: true
                    },

                    txtbidDate: {
                        required: true
                    },

                    txtbidTime: {
                        required: true
                    },

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
                        number:true
                    },
                    txtUOM: {
                        required:true
                    },
                    txtbiddescriptionP: {

                    },
                    txtContractDuration: {

                    },
                    txtCeilingPrice: {
                        number:true
                    },
                    txtedelivery: {

                    },
                    txtminimumdecreament: {
                        number:true
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
                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');
                    $(element)
                        .closest('.col-md-4').removeClass('has-success').addClass('has-error');

                },

                unhighlight: function (element) {

                    $(element)
                        .closest('.inputgroup').removeClass('has-error');
                    $(element)
                        .closest('.col-md-4').removeClass('has-error');

                },

                success: function (label) {

                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {

                        label

                            .closest('.inputgroup').removeClass('has-error').addClass('has-success');

                        label.remove();

                    } else {

                        label

                            .addClass('valid') // mark the current input as valid and display OK icon

                        .closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group

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
                        else if ($("#txtBidDuration").val() == '0' && ($("#ddlAuctiontype option:selected").val() == "81" || $("#ddlAuctiontype option:selected").val()=="83")) {
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
                            $('#spandanger').html('You have Some error. Please Check Below!')
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
                        else
                        {
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
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';
    var AttachementFileName = '';

    if ($("#ddlAuctiontype option:selected").val() == 81) {
        $(".hdnfielddutch").attr('disabled', false);
        _bidType = $("#ddlAuctiontype option:selected").val();
    }
   
    else if ($("#ddlAuctiontype option:selected").val() == 82){
        $(".hdnfielddutch").attr('disabled', true);
        _bidType = $("#ddlAuctiontype option:selected").val();
    }
    else  {
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
    var rowCount = jQuery('#tblapprovers tr').length;
    if (rowCount > 1) {
        $("#tblapprovers tr:gt(0)").each(function () {
            
            var this_row = $(this);
            approvers = approvers + $.trim(this_row.find('td:eq(4)').html()) + '~' + $.trim(this_row.find('td:eq(3)').html()) + '#';
          
        })
    }

    var Tab1Data = {

        "BidId": parseInt(sessionStorage.getItem('CurrentBidID')),
        "BidTypeID": 6,
        "ContinentId": 0,
        "CountryID": 0,//jQuery("#ddlCountry option:selected").val(),
        "BidForID": parseInt($("#ddlAuctiontype option:selected").val()),
        "BidDuration": parseInt(bidDuration),
        "BidSubject": jQuery("#txtBidSubject").val(),
        "BidDescription": jQuery("#txtbiddescription").val(),
        "BidDate": jQuery("#txtbidDate").val(),
        "BidTime": jQuery("#txtbidTime").val(),
        "CurrencyID": parseInt(jQuery("#dropCurrency option:selected").val()),
        "ConversionRate": parseFloat(jQuery("#txtConversionRate").val()),
        "TermsConditions": TermsConditionFileName,
        "Attachment": AttachementFileName,
        "UserId": sessionStorage.getItem('UserID'),
        "BidApprovers": approvers,
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "ShowRankToVendor": $('#drpshowL1L2').val()

    };

    //alert(JSON.stringify(Tab1Data))
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
                fnUploadFilesonAzure('file1',TermsConditionFileName, 'Bid/' + sessionStorage.getItem('CurrentBidID'));

            }
            if ($('#file2').val() != '') {
                fnUploadFilesonAzure('file2',AttachementFileName, 'Bid/' + sessionStorage.getItem('CurrentBidID'));

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
    var lastInvoiceprice=0;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    PriceDetails = '';
    
    var rowCount = jQuery('#tblServicesProduct tr').length;
    if (rowCount > 1) {
        if ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) {
            
            $("#tblServicesProduct tr:gt(0)").each(function () {
                PriceDetails = PriceDetails + 'insert into PE.BidPefaDetails(BidID,ItemName,Quantity,Targetprice,MeasurementUnit,Description,ContractDuration,DispatchLocation,CeilingPrice,MaskVendor,MinimumIncreament,IncreamentOn,Attachments,LastSalePrice,AttachmentSeqID,StartingPrice,PriceReductionFrequency,PriceReductionAmount,ShowHLPrice,ShowStartPrice) values('
                targetPrice = 0
                var this_row = $(this);
                var t = 'A';
                if ($.trim(this_row.find('td:eq(11)').html()).toLowerCase() == "percentage") {
                    t = 'P'
                }
                if ($.trim(this_row.find('td:eq(2)').html()) != '') {
                    targetPrice = removeThousandSeperator($.trim(this_row.find('td:eq(2)').html()));
                }
                if ($.trim(this_row.find('td:eq(11)').html()) != '') {
                    lastInvoiceprice = removeThousandSeperator($.trim(this_row.find('td:eq(11)').html()));
                }
               // var desc = $.trim(this_row.find('td:eq(5)').html()).replace(/'/g, "");

                PriceDetails = PriceDetails + sessionStorage.getItem('CurrentBidID') + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(3)').html())) + " ," + removeThousandSeperator(targetPrice) + ",'" + $.trim(this_row.find('td:eq(4)').html()) + "','','',''," + removeThousandSeperator($.trim(this_row.find('td:eq(5)').html())) + ",'" + $.trim(this_row.find('td:eq(6)').html()) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(7)').html())) + ",'" + $.trim(this_row.find('td:eq(10)').text()) + "','" + $.trim(this_row.find('td:eq(9)').text()) + "'," + lastInvoiceprice + ",'" + $.trim(this_row.find('td:eq(12)').html()) + "',0,0,0,'" + $.trim(this_row.find('td:eq(13)').html()) + "','" + $.trim(this_row.find('td:eq(14)').html()) + "' )";
            });
          
        }
        else {

            if ($("#txtBidDuration").val() != '0') {
                _BidDuration = $("#txtBidDuration").val();
            }
            
            $("#tblServicesProduct tr:gt(0)").each(function () {
                PriceDetails = PriceDetails + 'insert into PE.BidPefaDetails(BidID,ItemName,Quantity,Targetprice,MeasurementUnit,Description,ContractDuration,DispatchLocation,CeilingPrice,MaskVendor,MinimumIncreament,IncreamentOn,Attachments,LastSalePrice,AttachmentSeqID,StartingPrice,PriceReductionFrequency,PriceReductionAmount) values('
                targetPrice = 0
                var this_row = $(this);
                var t = 'A';
                if ($.trim(this_row.find('td:eq(11)').html()) == "Percentage") {
                    t = 'P'
                }
                if ($.trim(this_row.find('td:eq(2)').html()) != '') {
                    targetPrice = $.trim(this_row.find('td:eq(2)').html());
                }
                //var desc = $.trim(this_row.find('td:eq(5)').html()).replace(/'/g, "");
                PriceDetails = PriceDetails + sessionStorage.getItem('CurrentBidID') + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(3)').html())) + " ," + removeThousandSeperator(targetPrice) + ",'" + $.trim(this_row.find('td:eq(4)').html()) + "','','',''," + removeThousandSeperator($.trim(this_row.find('td:eq(5)').html())) + ",'" + $.trim(this_row.find('td:eq(6)').html()) + "',0,'','" + $.trim(this_row.find('td:eq(9)').text()) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(11)').text())) + ",'" + $.trim(this_row.find('td:eq(12)').html()) + "'," + $.trim(removeThousandSeperator(this_row.find('td:eq(13)').html())) + ",'" + $.trim(this_row.find('td:eq(14)').html()) + "','" + $.trim(removeThousandSeperator(this_row.find('td:eq(15)').html())) + "' )";
            });
        }
    }
  
    //alert(PriceDetails)
    var Tab2data = {
        "PriceDetails": PriceDetails,
        "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
        "UserID": sessionStorage.getItem('UserID'),
        "BidDuration": _BidDuration == 0 ? 0 : parseInt(_BidDuration)

    };
    //console.log(PriceDetails)
    //alert(JSON.stringify(Tab2data))
   // console.log(JSON.stringify(Tab2data))
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
        InsertQuery = InsertQuery + $.trim($(this).find('td:eq(0)').html())  +'~0~N' + '#';
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
function ConfigureBidInsPefaTab3() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var InsertQuery = '';

    $("#selectedvendorlists > tbody > tr").each(function(index) {
           
            InsertQuery = InsertQuery + $.trim($(this).find('td:eq(0)').html()) +'~';
    });
   
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
        var Tab3data = {
            "BidVendors": InsertQuery,
            "BidID": parseInt(sessionStorage.getItem('CurrentBidID')),
            "UserID": sessionStorage.getItem('UserID'),
            "BidSubject": jQuery("#txtBidSubject").val(),
            "BidDescription": jQuery("#txtbiddescription").val(),
            "BidDate": jQuery("#txtbidDate").val(),
            "BidTime": jQuery("#txtbidTime").val(),
            "BidDuration": parseInt(bidDuration),
            "BidTypeID": 6
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


}

function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/'+sessionStorage.getItem('CurrentBidID'));
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
function InsUpdProductSevices() {

    if ($('#add_or').text() == "Modify")
    {
         var st = "true"

        $("#tblServicesProduct tr:gt(0)").each(function () {

            var this_row = $(this);

            if ($.trim(this_row.find('td:eq(1)').html()) == $('#txtshortname').val() && $.trim(this_row.find('td:eq(2)').html()) != $('#txttargetprice').val() && $.trim(this_row.find('td:eq(3)').html()) != $('#txtquantitiy').val() && $.trim(this_row.find('td:eq(4)').html()) != $("#dropuom option:selected").text() && $.trim(this_row.find('td:eq(5)').html()) != $('#txtbiddescriptionP').val() && $.trim(this_row.find('td:eq(6)').html()) != $('#txtContractDuration').val() && $.trim(this_row.find('td:eq(7)').html()) != $('#txtedelivery').val() && $.trim(this_row.find('td:eq(8)').html()) != $('#txtCeilingPrice').val() && $.trim(this_row.find('td:eq(10)').html()) != $('#txtminimumdecreament').val() && $.trim(this_row.find('td:eq(11)').html()) != $("#drpdecreamenton option:selected").text() && $.trim(this_row.find('td:eq(14)').html()) != $("#txtlastinvoiceprice").val()) {

                st = "false"

            }

        });

        if (form.valid() == false) {

            error.show();
            $('#spandanger').html('You have some error.Please Check below...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
            error.show();
            $('#spandanger').html('Minimum Increment should be less than Bid start price.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if ($('#txtStartingPrice').is(':visible') && (parseInt(removeThousandSeperator($('#txtStartingPrice').val())) + parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val()))) >= parseInt(removeThousandSeperator($('#txtCeilingPrice').val())) && $("#ddlAuctiontype option:selected").val() == 82) {
            error.show();
            $('#spandanger').html('Ceiling Max Price should not be less than Bid start price + Price Reduction amount.');

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

        else if (st == "false") {

            error.show();
            $('#spandanger').html('Data already exists...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);
            return false;

        }

        else {

            
            var this_row = $('#rowid').val();
            var this_row_Prev = $('#rowidPrev').val();

            $("#" + this_row).find("td:eq(1)").text($('#txtshortname').val())

            $("#" + this_row).find("td:eq(2)").text(thousands_separators($('#txttargetprice').val()))

            $("#" + this_row).find("td:eq(3)").text(thousands_separators($('#txtquantitiy').val()))

            $("#" + this_row).find("td:eq(4)").text($('#dropuom').val())

            $("#" + this_row).find("td:eq(5)").text(thousands_separators($('#txtCeilingPrice').val()))

            $("#" + this_row).find("td:eq(7)").text(thousands_separators($('#txtminimumdecreament').val()))
            //debugger;
            if ($('#drpdecreamenton option:selected').val() == 'A') {
                $("#" + this_row).find("td:eq(8)").text('Amount');
                $("#" + this_row_Prev).find("td:eq(7)").text('Amount')

            } else {
                $("#" + this_row).find("td:eq(8)").text('Percentage');
               $("#" + this_row_Prev).find("td:eq(7)").text('Percentage')
            }
          
            //checkmask vendor change
            $("#" + this_row).find("td:eq(6)").text(jQuery("#checkmaskvendor option:selected").val())
            

            $("#" + this_row).find("td:eq(10)").text($("#drpdecreamenton option:selected").val())

            
            $("#" + this_row).find("td:eq(11)").text(thousands_separators(removeThousandSeperator($("#txtlastinvoiceprice").val())))
            
            $("#" + this_row).find("td:eq(14)").text($("#txtPriceReductionFrequency").val())
            $("#" + this_row).find("td:eq(15)").text(thousands_separators($("#txtPriceReductionAmount").val()))
            if ($("#ddlAuctiontype option:selected").val() != '81' && $("#ddlAuctiontype option:selected").val() != '83') {
                $("#" + this_row).find("td:eq(16)").text($("#showhlprice").val())
                $("#" + this_row).find("td:eq(17)").text($("#showstartprice").val())
                $("#" + this_row).find("td:eq(13)").text(thousands_separators($("#txtStartingPrice").val()))
            }
            else {
                $("#" + this_row).find("td:eq(13)").text($("#showhlprice").val())
                $("#" + this_row).find("td:eq(14)").text($("#showstartprice").val())
            }

           
            //if (!$('#fileattachment').is('[disabled=disabled]')) {
            //    $("#" + this_row).find("td:eq(12)").text(FileseqNo)
            //    $("#" + this_row).find("td:eq(9)").html('<a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + '>' + filetoupload + '</a>')
            //    $("#" + this_row_Prev).find("td:eq(8)").html('<a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + '>' + filetoupload + '</a>')
               
            //}

            //For Preview Table

            $("#" + this_row_Prev).find("td:eq(0)").text($('#txtshortname').val())

            $("#" + this_row_Prev).find("td:eq(1)").text($('#txttargetprice').val())

            $("#" + this_row_Prev).find("td:eq(2)").text(thousands_separators($('#txtquantitiy').val()))

            $("#" + this_row_Prev).find("td:eq(3)").text($('#dropuom').val())

            $("#" + this_row_Prev).find("td:eq(4)").text(thousands_separators($('#txtCeilingPrice').val()))

           
            $("#" + this_row_Prev).find("td:eq(6)").text(thousands_separators($('#txtminimumdecreament').val()))

            $("#" + this_row_Prev).find("td:eq(5)").text(jQuery("#checkmaskvendor option:selected").val())

           
            $("#" + this_row_Prev).find("td:eq(9)").text($("#drpdecreamenton option:selected").val())
            $("#" + this_row_Prev).find("td:eq(10)").text(thousands_separators(removeThousandSeperator($("#txtlastinvoiceprice").val())))
          
            $("#" + this_row_Prev).find("td:eq(13)").text($("#txtPriceReductionFrequency").val())
            $("#" + this_row_Prev).find("td:eq(14)").text(thousands_separators($("#txtPriceReductionAmount").val()))
            if ($("#ddlAuctiontype option:selected").val() != '81' && $("#ddlAuctiontype option:selected").val() != 83) {
                $("#" + this_row_Prev).find("td:eq(15)").text($("#showhlprice").val())
                $("#" + this_row_Prev).find("td:eq(16)").text(($("#showstartprice").val()))
                $("#" + this_row_Prev).find("td:eq(12)").text(thousands_separators($("#txtStartingPrice").val()))
            }
            else {
                $("#" + this_row_Prev).find("td:eq(12)").text($("#showhlprice").val())
                $("#" + this_row_Prev).find("td:eq(13)").text($("#showstartprice").val())
            }
            
            $("#tblServicesProduct tr:gt(0)").each(function () {

                var this_row = $(this);

                var t = 'A';

                if ($.trim(this_row.find('td:eq(7)').html()) == "Percentage") {

                    t = 'P'

                }

                //PriceDetails = PriceDetails + " select " + sessionStorage.getItem('CurrentBidID') + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "','" + $.trim(this_row.find('td:eq(3)').html()) + "' ,'" + $.trim(this_row.find('td:eq(2)').html()) + "','" + $.trim(this_row.find('td:eq(4)').html()) + "','" + $.trim(this_row.find('td:eq(5)').html()) + "','" + $.trim(this_row.find('td:eq(6)').html()) + "','" + $.trim(this_row.find('td:eq(7)').html()) + "','" + $.trim(this_row.find('td:eq(8)').html()) + "','" + $.trim(this_row.find('td:eq(9)').html()) + "','" + $.trim(this_row.find('td:eq(10)').html()) + "','" + t + "','" + filetoupload + "','" + $.trim(this_row.find('td:eq(14)').html()) + "','" + FileseqNo + "' union";

            });
            
            if ($("#ddlAuctiontype option:selected").val() != '81' && $("#ddlAuctiontype option:selected").val() != 83) {
               
                _BidDuration = (((removeThousandSeperator($("#txtCeilingPrice").val()) - removeThousandSeperator($("#txtStartingPrice").val())) / removeThousandSeperator($("#txtPriceReductionAmount").val())) * $("#txtPriceReductionFrequency").val()) + parseInt($("#txtPriceReductionFrequency").val());
                $("#txtBidDuration").val(parseInt(_BidDuration));
                $("#txtBidDurationPrev").text(parseInt(_BidDuration))
            }
           
            resetfun();

        }

    }

    else {

        if ($('#txtshortname').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Item Name...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#txtquantitiy').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Quantity in Number Only...');


            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#txtUOM').val() == "" || $('#dropuom').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Measurement Unit...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#txtbiddescriptionP').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Description...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#txtContractDuration').val() == "") {

            error.show();

            $('#spandanger').html('Please enter contract duration...');
            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#txtedelivery').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Dispatch Location...');


            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }



        else if ($('#txtCeilingPrice').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Bid start price in Number only...');
            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#txtminimumdecreament').is(":visible") && $('#txtminimumdecreament').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Minimum Increment in Number only......');
            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#drpdecreamenton').is(":visible") && $('#drpdecreamenton').val() == "") {

            error.show();
            $('#spandanger').html('Please Select Increment On...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if ($('#txtStartingPrice').is(":visible") && $('#txtStartingPrice').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Starting Price...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        //debugger;
        else if ($('#txtStartingPrice').is(":visible") && parseInt($.trim(removeThousandSeperator($('#txtCeilingPrice').val()))) > parseInt($.trim(removeThousandSeperator($('#txtStartingPrice').val()))) && $("#ddlAuctiontype option:selected").val() != '82') {
        
            error.show();
            $('#spandanger').html('Starting price should not be less than Bid start price...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if ($('#txtPriceReductionFrequency').is(":visible") && $('#txtPriceReductionFrequency').val() == 0) {

            error.show();
            $('#spandanger').html('Please Enter Price Reduction Frequency...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if ($('#txtPriceReductionAmount').is(":visible") && $('#txtPriceReductionAmount').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Price Reduction Amount...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if ($('#txtPriceReductionAmount').is(":visible") && parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val())) > parseInt(removeThousandSeperator($('#txtStartingPrice').val()))) {

                error.show();
                $('#spandanger').html('Price increment amount should be less than starting price.');

                Metronic.scrollTo(error, -200);

                error.fadeOut(3000);

                return false;

        }

        else if ($('#txtPriceReductionAmount').is(":visible") && parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= parseInt((removeThousandSeperator($('#txtStartingPrice').val()) - removeThousandSeperator($('#txtCeilingPrice').val())) / removeThousandSeperator($('#txtPriceReductionFrequency').val())) && ($("#ddlAuctiontype option:selected").val() == 81 || $("#ddlAuctiontype option:selected").val() == 83) ) {

            error.show();
            $('#spandanger').html('Please enter valid Price Reduction amount.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if ($('#txtPriceReductionAmount').is(":visible") && parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val())) >= (parseInt(removeThousandSeperator($('#txtCeilingPrice').val())) - parseInt(removeThousandSeperator($('#txtStartingPrice').val())) / 2) && $("#ddlAuctiontype option:selected").val() == 82) {

            error.show();
            $('#spandanger').html('Please enter valid Price Reduction amount.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
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
        else if ((parseInt($('#txtStartingPrice').val()) + parseInt(removeThousandSeperator($('#txtPriceReductionAmount').val()))) >= parseInt(removeThousandSeperator($('#txtCeilingPrice').val())) && $("#ddlAuctiontype option:selected").val() == 82) {
            error.show();
            $('#spandanger').html('Ceiling Max Price should not be less than Bid start price + Price Reduction amount.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else {

            if ($('#tblServicesProduct >tbody >tr').length == 0) {

                //PriceDetails = PriceDetails + 'insert into BidProductServicesDetails(BidID,ShortName,Quantity,Targetprice,UOM,Description,ContractDuration,DeliveryLocation,CeilingPrice,MaskVendor,MinimumDecreament,DecreamentOn,Attachments,LastInvoicePrice,AttachmentSeqID)'

                if (form.valid() == false) {

                    error.show();
                    $('#spandanger').html('You have some error.Please Check below...');

                    Metronic.scrollTo(error, -200);

                    error.fadeOut(3000);

                    return false;

                }

                else {

                    ParametersQuery()

                }

            }

            else {

                var status = "true";

                $("#tblServicesProduct tr:gt(0)").each(function () {

                    var this_row = $(this);

                    if ($.trim(this_row.find('td:eq(1)').html()) == $('#txtshortname').val()) {

                        status = "false"

                    }

                });

                if (form.valid() == false) {

                    error.show();
                    $('#spandanger').html('You have some error.Please Check below...');

                    Metronic.scrollTo(error, -200);

                    error.fadeOut(3000);

                    //return false;

                }

                else if (status == "false") {
                    error.show();
                    $('#spandanger').html('Data already exists...');
                    Metronic.scrollTo(error, -200);
                    error.fadeOut(3000);
                    return false;

                }

                else {
                     ParametersQuery()
                 }

            }



        }

    }

}

var i = 0;
var z = 0;

var PriceDetails = '';

function ParametersQuery() {
    if (jQuery("#tblServicesProduct >tbody >tr ").length >= 1 && jQuery("#ddlAuctiontype option:selected").val() != '81' && jQuery("#ddlAuctiontype option:selected").val() != '83' ) {
        
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
   
    z = z + 1
    i = z;
    var status = "";

    status = jQuery("#checkmaskvendor option:selected").val();


    var filetoupload = '';

    filetoupload = jQuery('#fileattachment').val().substring(jQuery('#fileattachment').val().lastIndexOf('\\') + 1);
    if (filetoupload != '') {

        FileseqNo = FileseqNo + 1;
       
    }



    if ($("#txtlastinvoiceprice").val() == null || $("#txtlastinvoiceprice").val() == '') {
        $("#txtlastinvoiceprice").val('0')
    }

    if ($("#ddlAuctiontype").val() == 81 || $("#ddlAuctiontype").val() == 83) {
        if (!jQuery("#tblServicesProduct thead").length) {

            jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide>FileSeqNo</th><th>Show H1 price</th><th>Show Start price</th></tr></thead>");
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><button type="button" class="btn btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + $('#txtshortname').val() + '</td><td>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td>' + $('#txtminimumdecreament').val() + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td><td>' + $('#showhlprice').val() + '</td><td>' + $('#showstartprice').val() + '</td></tr>');
            
        } else {

            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><button type="button" class="btn  btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + $('#txtshortname').val() + '</td><td>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td>' + $('#txtminimumdecreament').val() + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td><td>' + $('#showhlprice').val() + '</td><td>' + $('#showstartprice').val() + '</td></tr>');




        }

        $('#wrap_scroller').show();

        if (!jQuery("#tblServicesProductPrev thead").length) {

            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide>FileSeqNo</th><th>Show H1 price</th><th>Show Start price</th></tr></thead>");
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#txtshortname').val() + '</td><td>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td>' + $('#txtminimumdecreament').val() + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td><td>' + $('#showhlprice').val() + '</td><td>' + $('#showstartprice').val() + '</td></tr>');
            //i = i + 1;


        } else {

            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#txtshortname').val() + '</td><td>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td>' + $('#txtminimumdecreament').val() + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td><td>' + $('#showhlprice').val() + '</td><td>' + $('#showstartprice').val() + '</td></tr>');




        }
        $('#wrap_scrollerPrev').show();

    }
    else {

        //If Dutch Bid

        if (!jQuery("#tblServicesProduct thead").length) {


            jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Mask Vendor</th><th class='hide'>Minimum Increment</th><th class='hide'>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide>FileSeqNo</th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 price</th><th class=hide>Show Start price</th></tr></thead>");
            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><button type="button" class="btn btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + $('#txtshortname').val() + '</td><td class=text-right>' + $('#txttargetprice').val() + '</td><td class=text-right>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td class=text-right>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td class="hide">' + $('#txtminimumdecreament').val() + '</td><td class="hide">' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td class=text-right>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td><td class=text-right>' + $("#txtStartingPrice").val() + '</td><td class=text-right>' + $("#txtPriceReductionFrequency").val() + '</td><td class=text-right>' + $("#txtPriceReductionAmount").val() + '</td><td class=hide>' + $("#showhlprice").val() + '</td><td class=hide>' + $("#showstartprice").val() + '</td></tr>');
           
        } else {

            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><button type="button" class="btn  btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + $('#txtshortname').val() + '</td><td class=text-right>' + $('#txttargetprice').val() + '</td><td class=text-right>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td class=text-right>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td class="hide">' + $('#txtminimumdecreament').val() + '</td><td class="hide">' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td class=text-right>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td><td class=text-right>' + $("#txtStartingPrice").val() + '</td><td class=text-right>' + $("#txtPriceReductionFrequency").val() + '</td><td class=text-right>' + $("#txtPriceReductionAmount").val() + '</td><td class=hide>' + $("#showhlprice").val() + '</td><td class=hide>' + $("#showstartprice").val() + '</td></tr>');

        }

        $('#wrap_scroller').show();

        if (!jQuery("#tblServicesProductPrev thead").length) {

            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Mask Vendor</th><th class='hide'>Minimum Increment</th><th class='hide'>Increment On</th><th class=hide >Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide>FileSeqNo</th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 price</th><th class=hide>Show start price</th></tr></thead>");
            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#txtshortname').val() + '</td><td class=text-right>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td class=text-right>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td class=hide>' + $('#txtminimumdecreament').val() + '</td><td class=hide>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td class=text-right>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td><td class=text-right>' + $("#txtStartingPrice").val() + '</td><td class=text-right>' + $("#txtPriceReductionFrequency").val() + '</td><td>' + $("#txtPriceReductionAmount").val() + '</td><td class=hide>' + $("#showhlprice").val() + '</td><td class=hide>' + $("#showstartprice").val() + '</td></tr>');
            
        } else {

            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#txtshortname').val() + '</td><td class=text-right>' + $('#txttargetprice').val() + '</td><td class=text-right>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td class=text-right>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td class="hide">' + $('#txtminimumdecreament').val() + '</td><td class=hide>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/\s/g, "%20") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td class=text-right>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td><td class=text-right>' + $("#txtStartingPrice").val() + '</td><td class=text-right>' + $("#txtPriceReductionFrequency").val() + '</td><td>' + $("#txtPriceReductionAmount").val() + '</td><td class=hide>' + $("#showhlprice").val() + '</td><td class=hide>' + $("#showstartprice").val() + '</td></tr>');
         }
        $('#wrap_scrollerPrev').show();
    }
        //PriceDetails = PriceDetails + " select " + sessionStorage.getItem('CurrentBidID') + ",'" + $('#txtshortname').val() + "','" + $('#txttargetprice').val() + "'," + $('#txtquantitiy').val() + ",'" + $('#dropuom').val() + "','" + $('#txtbiddescriptionP').val() + "','" + $('#txtContractDuration').val() + "','" + $('#txtedelivery').val() + "','" + $('#txtCeilingPrice').val() + "','" + status + "','" + $('#txtminimumdecreament').val() + "','" + $('#drpdecreamenton').val() + "','" + filetoupload + "','" + $("#txtlastinvoiceprice").val() + "' union";
    resetfun()

}

function editvalues(rowid, rowidPrev) {
    sessionStorage.setItem('ClickedEditID', rowid.id)
    Metronic.scrollTo($("body"), 200);
    $('#rowid').val(rowid.id)
    $('#rowidPrev').val(rowidPrev.id)

    $('#txtshortname').val($("#" + rowid.id).find("td:eq(1)").text())
    //if ($("#" + rowid.id).find("td:eq(2)").text() != "0" && $("#" + rowid.id).find("td:eq(2)").text() != "") {
        var tp = removeThousandSeperator($("#" + rowid.id).find("td:eq(2)").text());
    $('#txttargetprice').val(thousands_Sep_Text(tp))
    //}
    var quan = $("#" + rowid.id).find("td:eq(3)").text().replace(/,/g, '')
    $('#txtquantitiy').val(quan)
    $('#dropuom').val($("#" + rowid.id).find("td:eq(4)").text())
    $('#txtUOM').val($("#" + rowid.id).find("td:eq(4)").text())
    $('#txtCeilingPrice').val($("#" + rowid.id).find("td:eq(5)").text())
    $('#txtminimumdecreament').val($("#" + rowid.id).find("td:eq(7)").text())
    $('#drpdecreamenton').val($("#" + rowid.id).find("td:eq(10)").text())
   // if ($("#" + rowid.id).find("td:eq(11)").text() != "0" && $("#" + rowid.id).find("td:eq(11)").text()!="") {
        var ll = removeThousandSeperator($("#" + rowid.id).find("td:eq(11)").text());
        $('#txtlastinvoiceprice').val(thousands_Sep_Text(ll))
   // }
   
    if ($("#ddlAuctiontype option:selected").val() == 82) {
        $('#txtStartingPrice').val($("#" + rowid.id).find("td:eq(13)").text())
        $('#showhlprice').val($("#" + rowid.id).find("td:eq(16)").text())
        $('#showstartprice').val($("#" + rowid.id).find("td:eq(17)").text())
    }
    else {
       
        $('#showhlprice').val($("#" + rowid.id).find("td:eq(13)").text())
        $('#showstartprice').val($("#" + rowid.id).find("td:eq(14)").text())
    }
    
    var frequency = $("#" + rowid.id).find("td:eq(14)").text()
    $('#txtPriceReductionAmount').val($("#" + rowid.id).find("td:eq(15)").text())
   
    $('#spinner4').spinner('value',frequency) 
    FileseqNo = $("#" + rowid.id).find("td:eq(12)").text();

    
    jQuery("#checkmaskvendor").val($.trim($("#" + rowid.id).find("td:eq(6)").text()));
    $('#add_or').text('Modify');

}
function deleterow(rowid, rowidPrev) {
   
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();


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
    $('#spinner4').spinner('value', 0);
    $('#txtPriceReductionAmount').val('');
    if ($('#ddlAuctiontype option:selected').val() == "83") {
       $('#showhlprice').val("Y").attr("disabled", true);
    }
    else
    {
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
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchPefaConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + sessionStorage.getItem('CurrentBidID') + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            jQuery('#txtBidSubject').val(BidData[0].bidDetails[0].bidSubject)

            jQuery('#txtbiddescription').val(BidData[0].bidDetails[0].bidDetails)
            jQuery('#txtbidDate').val(BidData[0].bidDetails[0].bidDate)
            jQuery('#txtbidTime').val(BidData[0].bidDetails[0].bidTime)
            jQuery("#dropCurrency").val(BidData[0].bidDetails[0].currencyID).attr("selected", "selected");
            jQuery('#txtConversionRate').val(BidData[0].bidDetails[0].conversionRate)
            
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


            jQuery("#tblapprovers").empty();
            jQuery("#tblapproversPrev").empty();
            $('#wrap_scrollerPrevApp').show();
            jQuery('#tblapprovers').append("<thead><tr><th style='width:5%!important'></th><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");
            jQuery('#tblapproversPrev').append("<thead><tr><th class='bold' style='width:30%!important'>Approver</th><th class='bold' style='width:30%!important'>Email</th><th class='bold' style='width:15%!important'>Sequence</th></tr></thead>");

            for (var i = 0; i < BidData[0].bidApproverDetails.length; i++) {
                rowApp = rowApp + 1;
                str = '<tr id=trAppid' + (i + 1) + '>';
                str += '<td><button type=button class="btn btn-xs btn-danger" id=Removebtn' + i + ' onclick="deleteApprow(trAppid' + (i + 1) + ',trAppidPrev' + (i + 1) + ')"  ><i class="glyphicon glyphicon-remove-circle"></i></button></td>';
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


            jQuery("#tblServicesProduct").empty();
            jQuery("#tblServicesProductPrev").empty();

            if (BidData[0].bidScrapSalesDetails.length > 0) {

                var max = BidData[0].bidScrapSalesDetails[0].attachmentSeqID;
                $('#wrap_scroller').show();
                $('#wrap_scrollerPrev').show();

                if (BidData[0].bidDetails[0].bidForID == 81 || BidData[0].bidDetails[0].bidForID == 83) {
                    jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>Item/Name</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Name</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Vendor</th><th>Minimum Increment</th><th>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Show H1 Price</th><th>Show Start Price</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {

                        if (max < BidData[0].bidScrapSalesDetails[i].attachmentSeqID) {
                            max = BidData[0].bidScrapSalesDetails[i].attachmentSeqID
                        }
                        FileseqNo = max
                        var decrementon = ''

                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = 'Percentage'

                        var attach = (BidData[0].bidScrapSalesDetails[i].attachments).replace(/\s/g, "%20");

                        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px !important;"><button class="btn  btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td>' + decrementon + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + '</a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');
                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td>' + decrementon + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');
                        z = i;
                    }
                }
                else { // for dutch
                    jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Mask Vendor</th><th class=hide>Minimum Increment</th><th class=hide>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 Price</th><th class=hide>Show Start Price</th></tr></thead>");
                    jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Product</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Ceiling/ Max Price</th><th>Mask Vendor</th><th class=hide>Minimum Increment</th><th class=hide>Increment On</th><th class=hide>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide></th><th>Starting Price</th><th>Price Increment Frequency (mins)</th><th>Price Increment Amount</th><th class=hide>Show L1 Price</th><th class=hide>Show Start Price</th></tr></thead>");
                    for (var i = 0; i < BidData[0].bidScrapSalesDetails.length; i++) {

                        if (max < BidData[0].bidScrapSalesDetails[i].attachmentSeqID) {
                            max = BidData[0].bidScrapSalesDetails[i].attachmentSeqID
                        }
                        FileseqNo = max
                        var decrementon = ''

                        if (BidData[0].bidScrapSalesDetails[i].increamentOn == 'A')
                            decrementon = 'Amount'
                        else
                            decrementon = 'Percentage'

                        var attach = (BidData[0].bidScrapSalesDetails[i].attachments).replace(/\s/g, "%20");

                        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px !important;"><button class="btn  btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=hide>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td class=hide>' + decrementon + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + '</a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].startingPrice) + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].priceReductionFrequency + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionAmount) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');
                        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].bidScrapSalesDetails[i].itemName + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].targetprice) + '</td><td class=text-right> ' + thousands_separators(BidData[0].bidScrapSalesDetails[i].quantity) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].measurementUnit + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].ceilingPrice) + '</td><td>' + BidData[0].bidScrapSalesDetails[i].maskVendor + '</td><td class=hide>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].minimumIncreament) + '</td><td class=hide>' + decrementon + '</td><td class=hide><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + BidData[0].bidScrapSalesDetails[i].attachments + ' </a></td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].increamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].lastSalePrice) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].attachmentSeqID + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].startingPrice) + '</td><td class=text-right>' + BidData[0].bidScrapSalesDetails[i].priceReductionFrequency + '</td><td class=text-right>' + thousands_separators(BidData[0].bidScrapSalesDetails[i].priceReductionAmount) + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showHLPrice + '</td><td class=hide>' + BidData[0].bidScrapSalesDetails[i].showStartPrice + '</td></tr>');
                        z = i;
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

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/?BidDate=" + jQuery("#txtbidDate").val() + "&BidTime=" + jQuery("#txtbidTime").val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(RFQData) {
            
            if (RFQData[0].bidId == 1) {
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

                                        deleteBidParameter('B');
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
   
    jQuery('#mapedapproverPrev').html('');
   
    jQuery('#txtBidSubjectPrev').html($('#txtBidSubject').val())
    jQuery('#txtBidDurationPrev').html($('#txtBidDuration').val())
    $("#ddlauctiontypePrev").html($("#ddlAuctiontype option:selected").html())
    jQuery('#txtbiddescriptionPrev').html($('#txtbiddescription').val())
    jQuery('#txtbidDatePrev').html($('#txtbidDate').val())
    jQuery('#txtbidTimePrev').html($('#txtbidTime').val())
    jQuery("#dropCurrencyPrev").html($('#dropCurrency option:selected').text())
    jQuery('#txtConversionRatePrev').html($('#txtConversionRate').val())
    jQuery('#txtConversionRatePrev').html($('#txtConversionRate').val())
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
    if ($("#ddlAuctiontype option:selected").val() == 81 ) {
        
        $(".hdnfielddutch").attr('disabled', false);
        $("#drpshowL1L2").attr('disabled', false);
        $("#txtBidDuration").attr('disabled', false);
        $("#txtBidDuration").val(0);
        $('#showhlprice').val('N')
        $('#showhlprice').attr('disabled', false);
    }
    else if ($("#ddlAuctiontype option:selected").val() == 82) {
       
        $(".hdnfielddutch").attr('disabled', true);
        $("#drpshowL1L2").attr('disabled', true);
        $("#txtBidDuration").attr('disabled', true);
        $("#txtBidDuration").val(0);
        $('#showhlprice').val('N')
        $('#showhlprice').attr('disabled', false);
    }
        else {
            $(".hdnfielddutch").attr('disabled', false);
            $("#drpshowL1L2").attr('disabled', false);
            $("#txtBidDuration").attr('disabled', false);
         $("#txtBidDuration").val(0);
        $('#showhlprice').val('Y')
        $('#showhlprice').attr('disabled', true);
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
            if (data== '1') {
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
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorCategoryWise_PEV2/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&CategoryID=" + categoryID,
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

