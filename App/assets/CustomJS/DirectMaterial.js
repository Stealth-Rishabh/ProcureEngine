

jQuery('#btnpush').click(function (e) {

    jQuery('#approverList > option:selected').appendTo('#mapedapprover');

});

jQuery('#btnpull').click(function (e) {

    jQuery('#mapedapprover > option:selected').appendTo('#approverList');

});

function fetchVendorparticipanType() {
    var bidTypeRequestObj = {
        "CustomerID": CustId,
        "BidTypeID": 0,
        "ExcludeStatus": "N"
    }
    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        //url: sessionStorage.getItem("APIPath") + "BidType/fetchBidType/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0&excludeStatus=N&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        url: sessionStorage.getItem("APIPath") + "BidType/fetchBidType/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0&excludeStatus=N&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        //url: sessionStorage.getItem("APIPath") + "BidType/fetchBidType",

        cache: false,

        crossDomain: true,
        //data:JSON.stringify(bidTypeRequestObj),
        dataType: "json",

        success: function (bidTypedata) {



            var strbidtypes = "<div id=\"divrblist\" class=\"checkbox-list\">";

            for (i = 0; i < bidTypedata.length; i++) {

                //strbidtypes += "<label><div class=\"radio\" style=\"cursor:pointer\" ><span id=\"spanrb\"><input type=\"radio\" grou name=\"rbradio\"  onchange=\"Validate(this)\" value=" + bidTypedata[i].BidTypeID + "></span></div>" + bidTypedata[i].BidTypeName + " </label>";

                strbidtypes += "<div class=\"col-md-3\">";

                strbidtypes += "<div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" id=\"chkBidType\" style=\"cursor:pointer\"  onchange=\"Validate(this)\" name=\"chkBidType\"/></span></div>";

                strbidtypes += "<label class=\"control-label\" id=\"BidTypeID\">&nbsp;&nbsp;" + bidTypedata[i].BidTypeName + "</label><input type=\"hidden\" id=\"hdnBidTypeID\" value=" + bidTypedata[i].BidTypeID + " /></div>";

            }

            strbidtypes += "</div>";

            jQuery("div#divbidtypelist").append(strbidtypes);

        }

    });

}



function FetchContinent(ContinentID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchContinent/?ContinentID=" + ContinentID + "&excludeStatus=N",

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#ddlSector").empty();

            jQuery("#ddlSector").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#ddlSector").append(jQuery("<option></option>").val(data[i].ContinentId).html(data[i].ContinentNm));

            }

        }

    });

    jQuery("#ddlCountry").append(jQuery("<option ></option>").val("").html("Select"));

}

jQuery("#ddlSector").change(function () {

    var continentID = $("#ddlSector option:selected").val();

    var countryID = "0";

    fetchCountry(continentID, countryID)

});

function fetchCountry(continentID, countryID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchCountry/?ContinentId=" + continentID + "&CountryID=" + countryID + "&excludeStatus=N",

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#ddlCountry").empty();

            jQuery("#ddlCountry").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#ddlCountry").append(jQuery("<option ></option>").val(data[i].CountryId).html(data[i].CountryNm));

            }

        }

    });

}

function fetchBidTypeMapping() {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidTypeMapping/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0",

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#ddlBidForId").empty();

            jQuery("#ddlBidForId").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#ddlBidForId").append(jQuery("<option ></option>").val(data[i].BidTypeID).html(data[i].BidTypeName));

            }

            jQuery("#ddlBidForId").val('3').attr("selected", "selected");

        }

    });

    // fetchBidFor("3");

    jQuery("#ddlBidForId").prop("disabled", true);



}



//function fetchBidFor(BidTypeID) {

//    jQuery.ajax({

//        type: "GET",

//        contentType: "application/json; charset=utf-8",

//        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidFor/?BidTypeID=" + BidTypeID,

//        cache: false,

//        dataType: "json",

//        success: function (data) {

//            jQuery("#ddlBidFor").empty();

//            jQuery("#ddlBidFor").append(jQuery("<option ></option>").val("").html("Select"));

//            for (var i = 0; i < data.length; i++) {

//                jQuery("#ddlBidFor").append(jQuery("<option></option>").val(data[i].BidForID).html(data[i].BidFor));

//            }

//        }

//    });

//}



function FetchCurrency(CurrencyID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchCurrency/?CurrencyID=" + CurrencyID + "&excludeStatus=N",

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#dropCurrency").empty();

            jQuery("#dropCurrency").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#dropCurrency").append(jQuery("<option></option>").val(data[i].CurrencyId).html(data[i].CurrencyNm));

            }

        }

    });

}



function FetchVenderForrfirfq() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorsForRFIRFQ/?CustomerID=" + sessionStorage.getItem('CustomerID'),

        cache: false,

        dataType: "json",

        success: function (data) {

            jQuery("#tblvendorlist > tbody").empty();
            var vName = '';
            for (var i = 0; i < data.length; i++) {
                vName = data[i].VendorName;
                var str = "<tr><td class='display-none'>" + data[i].UserID + "</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].VendorID + "'\)\"; id=\"chkvender" + i + "\" value=" + data[i].VendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].VendorName + " </td></tr>";

                jQuery('#tblvendorlist > tbody').append(str);

            }

        }

    });
    jQuery.unblockUI();
}
var vCount = 0;

function Check(event, vname, vendorID) {

    if ($(event).closest("span#spanchecked").attr('class') == 'checked') {

        $(event).closest("span#spanchecked").removeClass("checked")

    }

    else {
        vCount = vCount + 1;
        var EvID = event.id;
        $(event).prop("disabled", true);
        $(event).closest("span#spanchecked").addClass("checked")
        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vCount + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-icon-only btn-danger" onclick="removevendor(SelecetedVendor' + vCount + ',' + EvID + ',SelecetedVendorPrev' + vCount + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vCount + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td></tr>')
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

function removevendor(trid, chkid, Prevtrid) {
    vCount = vCount - 1;

    $('#' + trid.id).remove()
    $('#' + Prevtrid.id).remove()
    $(chkid).closest("span#spanchecked").removeClass("checked")
    $(chkid).prop("disabled", false);
    if (vCount > 0) {
        jQuery('#selectedvendorlists').show()
        jQuery('#selectedvendorlistsPrev').show()
    }
    else {
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()
    }
}

var status;

function ValidateVendor() {

    status = "false";

    var i = 0;

    $('#divvendorlist').find('span#spandynamic').hide();

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



function fetchRegisterUser(bidtypeid) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=0&BidTypeID=" + bidtypeid + "&LoginUserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),

        cache: false,

        crossDomain: true,

        dataType: "json",

        success: function (data) {

            jQuery("#approverList").empty();

            for (var i = 0; i < data.length; i++) {

                jQuery("#approverList").append(jQuery("<option></option>").val(data[i].UserID).html(data[i].UserName));

            }

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
                        maxlength: 3
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

                    },
                    dropuom: {

                    },
                    txtbiddescriptionP: {

                    },
                    txtContractDuration: {

                    },
                    txtCeilingPrice: {

                    },
                    txtedelivery: {

                    },
                    txtminimumdecreament: {

                    },
                    drpdecreamenton: {

                    },
                    txttargetprice: {

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

                    // success.show();

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

                    //return false;

                },

                onNext: function (tab, navigation, index) {

                    success.hide();

                    error.hide();

                    if (index == 1) {
                        if (form.valid() == false) {

                            form.validate();
                            return false;

                        } else {

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

                        } else {
                            ConfigureBidForProductTab2()
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

                else if (ValidateVendor() == 'false') {

                    return false;

                }

                else {
                    Dateandtimevalidate('index3')

                }

            }).hide();



            //unblock code

        }

    };

}();


//sessionStorage.setItem('CurrentBidID', 0)

function ConfigureBidForProductTab1() {
    var _cleanString = StringEncodingMechanism(jQuery("#txtBidSubject").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtbiddescription").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';
    var AttachementFileName = '';

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

   

    var Tab1Data = {

        "BidId": sessionStorage.getItem('CurrentBidID'),
        "BidTypeID": '6',
        "ContinentId": jQuery("#ddlSector").val(),
        "CountryID": jQuery("#ddlCountry option:selected").val(),
        "BidForID": 6,
        "BidDuration": jQuery("#txtBidDuration").val(),
        //"BidSubject": jQuery("#txtBidSubject").val(),
        "BidSubject": _cleanString,
        //"BidDescription": jQuery("#txtbiddescription").val(),
        "BidDescription": _cleanString2,
        "BidDate": jQuery("#txtbidDate").val(),
        "BidTime": jQuery("#txtbidTime").val(),
        "CurrencyID": jQuery("#dropCurrency option:selected").val(),
        "ConversionRate": jQuery("#txtConversionRate").val(),
        "TermsConditions": TermsConditionFileName,
        "Attachment": AttachementFileName,
        "UserId": sessionStorage.getItem('UserID'),
        "BidApprovers": BidApprovers(),
        "CustomerID": sessionStorage.getItem('CustomerID')

    };

    //alert(JSON.stringify(Tab1Data))
    jQuery.ajax({

        type: "POST",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsProduct/",

        crossDomain: true,

        async: false,

        data: JSON.stringify(Tab1Data),

        dataType: "json",

        success: function (data) {
            if (window.location.search) {

                sessionStorage.setItem('CurrentBidID', getUrlVars()["BidID"])
            }
            else {
                sessionStorage.setItem('CurrentBidID', data[0].BidID)

            }

            fileUploader(sessionStorage.getItem('CurrentBidID'))
        }

    });
    jQuery.unblockUI();
}

function ConfigureBidForProductTab2() {
    var targetPrice;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    PriceDetails = '';
    //    if (parseInt($('#txtminimumdecreament').val()) > parseInt($('#txtCeilingPrice').val())) {

    //	   
    //	    $('#form_wizard_1').bootstrapWizard('previous');
    //		$('#spandanger').html('Minimum decrement should be less than Bid start price.')
    //		$('.alert-danger').show();
    //		Metronic.scrollTo($('.alert-danger'),-200);
    //		$('.alert-danger').fadeOut(5000);
    //		jQuery.unblockUI();
    //		return false;
    //	}
    var rowCount = jQuery('#tblServicesProduct tr').length;
    if (rowCount > 1) {
        PriceDetails = PriceDetails + 'insert into BidProductServicesDetails(BidID,ShortName,Quantity,Targetprice,UOM,Description,ContractDuration,DeliveryLocation,CeilingPrice,MaskVendor,MinimumDecreament,DecreamentOn,Attachments,LastInvoicePrice,AttachmentSeqID)'
        $("#tblServicesProduct tr:gt(0)").each(function () {
            targetPrice = 0
            var this_row = $(this);
            var t = 'A';
            if ($.trim(this_row.find('td:eq(11)').html()) == "Percentage") {
                t = 'P'
            }
            if ($.trim(this_row.find('td:eq(2)').html()) != '') {
                targetPrice = $.trim(this_row.find('td:eq(2)').html());
            }
            var desc = $.trim(this_row.find('td:eq(5)').html()).replace(/'/g, "");

            PriceDetails = PriceDetails + " select " + sessionStorage.getItem('CurrentBidID') + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "'," + $.trim(this_row.find('td:eq(3)').html()) + " ," + targetPrice + ",'" + $.trim(this_row.find('td:eq(4)').html()) + "','" + desc + "','" + $.trim(this_row.find('td:eq(6)').html()) + "','" + $.trim(this_row.find('td:eq(7)').html()) + "','" + $.trim(this_row.find('td:eq(8)').html()) + "','" + $.trim(this_row.find('td:eq(9)').html()) + "','" + $.trim(this_row.find('td:eq(10)').html()) + "','" + t + "','" + $.trim(this_row.find('td:eq(12)').text()) + "','" + $.trim(this_row.find('td:eq(14)').html()) + "','" + $.trim(this_row.find('td:eq(15)').html()) + "' union";
        });
    }
    PriceDetails = PriceDetails.substring(0, PriceDetails.length - 6);

    var Tab2data = {
        "PriceDetails": PriceDetails,
        "BidID": sessionStorage.getItem('CurrentBidID'),
        "UserID": sessionStorage.getItem('UserID')

    };
    // alert(JSON.stringify(Tab2data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsProductServiceDetails/",
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab2data),
        dataType: "json",
        success: function (data) {
            if (data[0].BidID > 0) {

                return true;
            }
            else {
                return false;

            }

        },
        error: function (result) {
            //  alert(status)
            return false;
        }

    });
    jQuery.unblockUI();
}

function ConfigureBidForProductTab3() {

    var _cleanString = StringEncodingMechanism(jQuery("#txtBidSubject").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtbiddescription").val());

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var InsertQuery = '';
    $("#tblvendorlist> tbody > tr").each(function (index) {
        if ($(this).find("span#spanchecked").attr('class') == 'checked') {

            //alert($(this).find('input[type="checkbox"]:checked').val())

            InsertQuery = InsertQuery + "select " + sessionStorage.getItem('CurrentBidID') + "," + $(this).find('input[type="checkbox"]:checked').val() + " union all ";
        }
        else {
            InsertQuery = InsertQuery;
        }

    });

    if (InsertQuery != '') {

        InsertQuery = "Insert into BidVendorDetails(BidId,VendorId)" + InsertQuery;
        InsertQuery = InsertQuery.substring(0, InsertQuery.length - 10);

    }
    else {
        InsertQuery = "Print 1";
    }

    

    var Tab3data = {
        "BidVendors": InsertQuery,
        "BidID": sessionStorage.getItem('CurrentBidID'),
        "UserID": sessionStorage.getItem('UserID'),
       //"BidSubject": jQuery("#txtBidSubject").val(),
        "BidSubject": _cleanString,
        //"BidDescription": jQuery("#txtbiddescription").val(),
        "BidDescription": _cleanString2,
        "BidDate": jQuery("#txtbidDate").val(),
        "BidTime": jQuery("#txtbidTime").val(),
        "BidDuration": jQuery("#txtBidDuration").val(),
        "BidTypeID": '1'
    };
    //alert(JSON.stringify(Tab3data))

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsProductVendors/",
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab3data),
        dataType: "json",
        success: function (data) {
            if (data[0].BidID > 0) {

                jQuery.unblockUI();

                bootbox.alert("Bid Configured Successfully.", function () {
                    sessionStorage.removeItem('CurrentBidID');
                    window.location = sessionStorage.getItem("HomePage")
                    return false;
                });
            }
            else {

                jQuery.unblockUI();
                bootbox.alert("Configuration error.", function () {
                    sessionStorage.removeItem('CurrentBidID');
                    window.location = sessionStorage.getItem("HomePage")
                    return false;
                });

            }

        }

    });



}

function uploadFileattchmentsForItems(bidID) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var fileTerms = $('#fileattachment');
    var fileDataTerms = $('#fileattachment').prop("files")[0];
    var formData = new window.FormData();

    formData.append("fileTerms", fileDataTerms);
    formData.append("AttachmentFor", 'Bid');

    formData.append("BidID", bidID);
    formData.append("VendorID", FileseqNo);
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

function fileUploader(bidID) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    var fileTerms = $('#file1');
    if ($('#file1').is('[disabled=disabled]')) {

        var fileDataTerms = $('#file2').prop("files")[0];

    }
    else {
        var fileDataTerms = fileTerms.prop("files")[0];
    }


    var fileAnyOther = $('#file2');

    var fileDataAnyOther = fileAnyOther.prop("files")[0];



    var formData = new window.FormData();

    formData.append("fileTerms", fileDataTerms);

    formData.append("fileAnyOther", fileDataAnyOther);

    formData.append("AttachmentFor", 'Bid');

    formData.append("BidID", bidID);
    formData.append("VendorID", '');



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



function BidApprovers() {

    var bidApprovers = {};

    var bidapprover = []

    bidApprovers.bidapprover = bidapprover;

    $.each($("select#mapedapprover option"), function (index) {

        bidApprovers.bidapprover.push({ "AdMinSrNo": index + 1, "UserID": $(this).val() });

    });

    return JSON.stringify(bidApprovers);

}



function BidVendors() {

    var bidVendors = {};

    var bidvendor = []

    bidVendors.bidvendor = bidvendor;

    $("#tblvendorlist> tbody > tr").each(function (index) {

        if ($(this).find("span#spanchecked").attr('class') == 'checked') {

            bidVendors.bidvendor.push({ "VendorID": $(this).find("#chkvender").val() });

        }

    });

    return JSON.stringify(bidVendors);

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

    if ($('#add_or').text() == "Modify") {

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
        else if (parseInt($('#txtminimumdecreament').val()) > parseInt($('#txtCeilingPrice').val())) {
            error.show();
            $('#spandanger').html('Minimum decrement should be less than Bid start price.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if (st == "false") {

            error.show();
            $('#spandanger').html('Data already exists...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            // resetfun()

            return false;

        }

        else {

            PriceDetails = '';

            filetoupload = '';
            filetoupload = jQuery('#fileattachment').val().substring(jQuery('#fileattachment').val().lastIndexOf('\\') + 1);

            PriceDetails = PriceDetails + 'insert into BidProductServicesDetails(BidID,ShortName,Quantity,Targetprice,UOM,Description,ContractDuration,DeliveryLocation,CeilingPrice,MaskVendor,MinimumDecreament,DecreamentOn,Attachments,LastInvoicePrice,AttachmentSeqID)'

            var this_row = $('#rowid').val();
            var this_row_Prev = $('#rowidPrev').val();

            $("#" + this_row).find("td:eq(1)").text($('#txtshortname').val())

            $("#" + this_row).find("td:eq(2)").text($('#txttargetprice').val())

            $("#" + this_row).find("td:eq(3)").text($('#txtquantitiy').val())

            $("#" + this_row).find("td:eq(4)").text($('#dropuom').val())

            $("#" + this_row).find("td:eq(5)").text($('#txtbiddescriptionP').val())

            $("#" + this_row).find("td:eq(6)").text($('#txtContractDuration').val())

            $("#" + this_row).find("td:eq(7)").text($('#txtedelivery').val())

            $("#" + this_row).find("td:eq(8)").text($('#txtCeilingPrice').val())



            if (jQuery("#checkmaskvendor").is(':checked')) {

                $("#" + this_row).find("td:eq(9)").text("Y")

            }

            else {

                $("#" + this_row).find("td:eq(9)").text("N")

            }

            $("#" + this_row).find("td:eq(10)").text($('#txtminimumdecreament').val())

            $("#" + this_row).find("td:eq(11)").text($("#drpdecreamenton option:selected").text())

            //$("#" + this_row).find("td:eq(12)").text(filetoupload)
            $("#" + this_row).find("td:eq(14)").text($("#txtlastinvoiceprice").val())


            if ($("#" + this_row).find("td:eq(12)").text() == '') {
                FileseqNo = parseInt(FileseqNo) + 1;
            }

            $("#" + this_row).find("td:eq(15)").text(FileseqNo)
            $("#" + this_row).find("td:eq(12)").html('<a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload + '>' + filetoupload + '</a>')
            uploadFileattchmentsForItems(sessionStorage.getItem('CurrentBidID'))

            //For Preview Table

            $("#" + this_row_Prev).find("td:eq(0)").text($('#txtshortname').val())

            $("#" + this_row_Prev).find("td:eq(1)").text($('#txttargetprice').val())

            $("#" + this_row_Prev).find("td:eq(2)").text($('#txtquantitiy').val())

            $("#" + this_row_Prev).find("td:eq(3)").text($('#dropuom').val())

            $("#" + this_row_Prev).find("td:eq(4)").text($('#txtbiddescriptionP').val())

            $("#" + this_row_Prev).find("td:eq(5)").text($('#txtContractDuration').val())

            $("#" + this_row_Prev).find("td:eq(6)").text($('#txtedelivery').val())

            $("#" + this_row_Prev).find("td:eq(7)").text($('#txtCeilingPrice').val())



            if (jQuery("#checkmaskvendor").is(':checked')) {

                $("#" + this_row_Prev).find("td:eq(8)").text("Y")

            }

            else {

                $("#" + this_row_Prev).find("td:eq(8)").text("N")

            }

            $("#" + this_row_Prev).find("td:eq(9)").text($('#txtminimumdecreament').val())

            $("#" + this_row_Prev).find("td:eq(10)").text($("#drpdecreamenton option:selected").text())

            $("#tblServicesProduct tr:gt(0)").each(function () {

                var this_row = $(this);

                var t = 'A';

                if ($.trim(this_row.find('td:eq(11)').html()) == "Percentage") {

                    t = 'P'

                }

                // $("#" + this_row_Prev).find("td:eq(12)").text(filetoupload)
                $("#" + this_row_Prev).find("td:eq(14)").text($("#txtlastinvoiceprice").text())

                $("#" + this_row_Prev).find("td:eq(15)").text(FileseqNo)

                $("#" + this_row_Prev).find("td:eq(12)").html('<a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload + '>' + filetoupload + '</a>')
                PriceDetails = PriceDetails + " select " + sessionStorage.getItem('CurrentBidID') + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "','" + $.trim(this_row.find('td:eq(3)').html()) + "' ,'" + $.trim(this_row.find('td:eq(2)').html()) + "','" + $.trim(this_row.find('td:eq(4)').html()) + "','" + $.trim(this_row.find('td:eq(5)').html()) + "','" + $.trim(this_row.find('td:eq(6)').html()) + "','" + $.trim(this_row.find('td:eq(7)').html()) + "','" + $.trim(this_row.find('td:eq(8)').html()) + "','" + $.trim(this_row.find('td:eq(9)').html()) + "','" + $.trim(this_row.find('td:eq(10)').html()) + "','" + t + "','" + filetoupload + "','" + $.trim(this_row.find('td:eq(14)').html()) + "','" + FileseqNo + "' union";

            });



            resetfun();

        }

    }

    else {

        if ($('#txtshortname').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Short Name...');

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

        else if ($('#dropuom').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter UOM...');

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
            $('#spandanger').html('Please Enter Delivery Location...');


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

        else if ($('#txtminimumdecreament').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Minimum Decreament in Number only......');
            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#drpdecreamenton').val() == "") {

            error.show();
            $('#spandanger').html('Please Select Decreament On...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if (parseInt($('#txtminimumdecreament').val()) > parseInt($('#txtCeilingPrice').val())) {
            error.show();
            $('#spandanger').html('Minimum decrement should be less than Bid start price.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else {

            if ($('#tblServicesProduct >tbody >tr').length == 0) {

                PriceDetails = PriceDetails + 'insert into BidProductServicesDetails(BidID,ShortName,Quantity,Targetprice,UOM,Description,ContractDuration,DeliveryLocation,CeilingPrice,MaskVendor,MinimumDecreament,DecreamentOn,Attachments,LastInvoicePrice,AttachmentSeqID)'

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

                    // resetfun();

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

    z = z + 1
    i = z;
    var status = "";

    if (jQuery("#checkmaskvendor").is(':checked')) {

        status = "Y";

    }

    else {

        status = "N";

    }


    var filetoupload = '';

    filetoupload = jQuery('#fileattachment').val().substring(jQuery('#fileattachment').val().lastIndexOf('\\') + 1);
    if (filetoupload != '') {

        FileseqNo = FileseqNo + 1;
        uploadFileattchmentsForItems(sessionStorage.getItem('CurrentBidID'))
    }



    if ($("#txtlastinvoiceprice").val() == null || $("#txtlastinvoiceprice").val() == '') {
        $("#txtlastinvoiceprice").val('0')
    }

    if (!jQuery("#tblServicesProduct thead").length) {

        jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:100px;'></th><th>Short Name</th><th>TargetRate</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Contract Duration</th><th>Delivery Location</th><th>Bid start price</th><th>Mask Vendor</th><th>Minimum Decreament</th><th>Decreament On</th><th>Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide>FileSeqNo</th></tr></thead>");
        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><button type="button" class="btn btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + $('#txtshortname').val() + '</td><td>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td>' + $('#txtbiddescriptionP').val() + '</td><td>' + $('#txtContractDuration').val() + '</td><td>' + $('#txtedelivery').val() + '</td><td>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td>' + $('#txtminimumdecreament').val() + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/%20/g, " ") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td></tr>');
        //i = i + 1;


    } else {

        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px;"><button type="button" class="btn  btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + $('#txtshortname').val() + '</td><td>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td>' + $('#txtbiddescriptionP').val() + '</td><td>' + $('#txtContractDuration').val() + '</td><td>' + $('#txtedelivery').val() + '</td><td>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td>' + $('#txtminimumdecreament').val() + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + filetoupload.replace(/%20/g, " ") + ' style="text-decoration:none;">' + filetoupload + '</a></td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td></tr>');




    }


    $('#wrap_scroller').show();

    if (!jQuery("#tblServicesProductPrev thead").length) {

        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Short Name</th><th>TargetRate</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Contract Duration</th><th>Delivery Location</th><th>Bid start price</th><th>Mask Vendor</th><th>Minimum Decreament</th><th>Decreament On</th><th >Attachment</th><th class=hide></th><th>Last Invoice Price</th><th class=hide>FileSeqNo</th></tr></thead>");
        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#txtshortname').val() + '</td><td>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td>' + $('#txtbiddescriptionP').val() + '</td><td>' + $('#txtContractDuration').val() + '</td><td>' + $('#txtedelivery').val() + '</td><td>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td>' + $('#txtminimumdecreament').val() + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td>' + filetoupload + '</td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td></tr>');
        //i = i + 1;


    } else {

        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#txtshortname').val() + '</td><td>' + $('#txttargetprice').val() + '</td><td>' + $('#txtquantitiy').val() + '</td><td>' + $('#dropuom').val() + '</td><td>' + $('#txtbiddescriptionP').val() + '</td><td>' + $('#txtContractDuration').val() + '</td><td>' + $('#txtedelivery').val() + '</td><td>' + $('#txtCeilingPrice').val() + '</td><td>' + status + '</td><td>' + $('#txtminimumdecreament').val() + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td>' + filetoupload + '</td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td>' + $("#txtlastinvoiceprice").val() + '</td><td class=hide>' + FileseqNo + '</td></tr>');




    }
    $('#wrap_scrollerPrev').show();
    PriceDetails = PriceDetails + " select " + sessionStorage.getItem('CurrentBidID') + ",'" + $('#txtshortname').val() + "','" + $('#txttargetprice').val() + "'," + $('#txtquantitiy').val() + ",'" + $('#dropuom').val() + "','" + $('#txtbiddescriptionP').val() + "','" + $('#txtContractDuration').val() + "','" + $('#txtedelivery').val() + "','" + $('#txtCeilingPrice').val() + "','" + status + "','" + $('#txtminimumdecreament').val() + "','" + $('#drpdecreamenton').val() + "','" + filetoupload + "','" + $("#txtlastinvoiceprice").val() + "' union";
    resetfun()

}

function editvalues(rowid, rowidPrev) {
    sessionStorage.setItem('ClickedEditID', rowid.id)
    Metronic.scrollTo($("body"), 200);
    $('#rowid').val(rowid.id)
    $('#rowidPrev').val(rowidPrev.id)

    $('#txtshortname').val(StringDecodingMechanism($("#" + rowid.id).find("td:eq(1)").text()))

    $('#txttargetprice').val($("#" + rowid.id).find("td:eq(2)").text())

    $('#txtquantitiy').val($("#" + rowid.id).find("td:eq(3)").text())

    $('#dropuom').val($("#" + rowid.id).find("td:eq(4)").text())

    $('#txtbiddescriptionP').val(StringDecodingMechanism($("#" + rowid.id).find("td:eq(5)").text()))

    $('#txtContractDuration').val($("#" + rowid.id).find("td:eq(6)").text())

    $('#txtCeilingPrice').val($("#" + rowid.id).find("td:eq(8)").text())

    $('#txtminimumdecreament').val($("#" + rowid.id).find("td:eq(10)").text())

    $('#drpdecreamenton').val($("#" + rowid.id).find("td:eq(13)").text())
    $('#txtlastinvoiceprice').val($("#" + rowid.id).find("td:eq(14)").text())

    $('#txtedelivery').val($("#" + rowid.id).find("td:eq(7)").text())
    FileseqNo = $("#" + rowid.id).find("td:eq(15)").text();

    if ($("#" + rowid.id).find("td:eq(12)").text() == "") {
        $('#fileattachment').attr('disabled', false);
        $('#closebtnitms').hide()
    }
    else {
        $('#fileattachment').attr('disabled', true);

        $('#closebtnitms').show()
        $('#fileattachmentforitems').show()
        $('#fileattachmentforitems').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + FileseqNo + '/' + $.trim($("#" + rowid.id).find('td:eq(12)').text()).replace(/%20/g, " "));
        $('#fileattachmentforitems').html($.trim($("#" + rowid.id).find('td:eq(12)').text()))

    }

    if ($("#" + rowid.id).find("td:eq(9)").text() == "Y") {

        jQuery('input:checkbox[name=checkmaskvendor]').attr('checked', true);

        jQuery('#checkmaskvendor').parents('span').addClass('checked');

    }

    else {

        jQuery('input:checkbox[name=checkmaskvendor]').attr('checked', false);

        jQuery('#checkmaskvendor').parents('span').removeClass('checked');

    }

    $('#add_or').text('Modify');



}

function deleterow(rowid, rowidPrev) {
    ajaxFileDelete('', 'fileattachment', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + $.trim($("#" + rowid.id).find('td:eq(15)').text()) + '/' + $.trim($("#" + rowid.id).find('td:eq(12)').text()).replace(/%20/g, " "), 'ParameterFiles')
    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();


}

function resetfun() {
    $('#add_or').text('Add');
    $('#txtshortname').val('')
    $('#txttargetprice').val('')
    $('#txtquantitiy').val('')
    $('#dropuom').val('')
    $('#txtbiddescriptionP').val('')
    $('#txtContractDuration').val('')
    $('#txtedelivery').val('')
    $('#txtCeilingPrice').val('')
    $('#txtminimumdecreament').val('')
    $('#drpdecreamenton').val('')
    $('#txtlastinvoiceprice').val('')
    jQuery('#fileattachment').val('')
    jQuery('input:checkbox[name=checkmaskvendor]').attr('checked', true);
    jQuery('#checkmaskvendor').parents('span').addClass('checked');
    $('#closebtnitms').hide();
    $('#fileattachmentforitems').html('')
    $('#fileattachmentforitems').attr('href', 'javascript:;').addClass('display-none');
    $('#fileattachment').attr('disabled', false);
}

function FetchUOM(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/FetchUOM/?CustomerID=" + CustomerID,
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#dropuom").empty();
            jQuery("#dropuom").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#dropuom").append(jQuery("<option></option>").val(data[i].UOM).html(data[i].UOM));
            }

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

function fillselectedcurrency() {
    jQuery('.currencyparam').css('text-align', 'left');
    if (jQuery('#dropCurrency').val() != '') {

        var uomcaption = jQuery('#dropCurrency option:selected').text()
        jQuery('.currencyparam').text(uomcaption)
        jQuery('#lblUOM').text(uomcaption)
    }
    else {
        jQuery('.currencyparam').text('')
        jQuery('#lblUOM').text('')
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

function fetchProductServicesBidDetails() {
    var replaced1 = '';
    var replaced2 = '';
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchProductServicesConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + sessionStorage.getItem('CurrentBidID') + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {

            jQuery('#txtBidSubject').val(StringDecodingMechanism(BidData[0].BidDetails[0].BidSubject))
            jQuery('#txtBidDuration').val(BidData[0].BidDetails[0].BidDuration)
            jQuery('#txtbiddescription').val(StringDecodingMechanism(BidData[0].BidDetails[0].BidDetails))
            jQuery('#txtbidDate').val(BidData[0].BidDetails[0].BidDate)
            jQuery('#txtbidTime').val(BidData[0].BidDetails[0].BidTime)
            jQuery("#dropCurrency").val(BidData[0].BidDetails[0].CurrencyID).attr("selected", "selected");
            jQuery('#txtConversionRate').val(BidData[0].BidDetails[0].ConversionRate)
            if (BidData[0].BidDetails[0].TermsConditions != '') {

                $('#file1').attr('disabled', true);
                $('#closebtn').removeClass('display-none');

                replaced1 = BidData[0].BidDetails[0].TermsConditions.replace(/%20/g, " ")

                if (BidData[0].BidDetails[0].Attachment != '') {
                    if (BidData[0].BidDetails[0].Attachment != null) {
                        $('#file2').attr('disabled', true);
                        $('#closebtn2').removeClass('display-none');

                        replaced2 = BidData[0].BidDetails[0].Attachment.replace(/%20/g, " ")
                    }
                }



            }



            $('#filepthterms').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + replaced1).html(BidData[0].BidDetails[0].TermsConditions);
            $('#filepthattach').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + replaced2).html(BidData[0].BidDetails[0].Attachment);

            if (BidData[0].BidApproverDetails.length > 0) {
                for (var i = 0; i < BidData[0].BidApproverDetails.length; i++) {
                    //jQuery("#mapedapprover").append('<option value=' + BidData[0].BidApproverDetails[0].UserID + '  selected>' + BidData[0].BidApproverDetails[0].ApproverName + '</option>')
                    jQuery('#mapedapprover').append(jQuery('<option selected></option>').val(BidData[0].BidApproverDetails[i].UserID).html(BidData[0].BidApproverDetails[i].ApproverName))
                }
            }

            jQuery("#tblServicesProduct").empty();
            jQuery("#tblServicesProductPrev").empty();
            if (BidData[0].BidProductDetails.length > 0) {

                var max = BidData[0].BidProductDetails[0].AttachmentSeqID;
                $('#wrap_scroller').show();
                $('#wrap_scrollerPrev').show();
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:150px !important;'></th><th>Short Name</th><th>TargetRate</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Contract Duration</th><th>Delivery Location</th><th>Bid start price</th><th>Mask Vendor</th><th>Minimum Decreament</th><th>Decreament On</th><th>Attachment</th><th class=hide></th><th>Last InvoicePrice</th><th class=hide></th></tr></thead>");
                jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Short Name</th><th>TargetRate</th><th>Quantity</th><th>UOM</th><th>Description</th><th>Contract Duration</th><th>Delivery Location</th><th>Bid start price</th><th>Mask Vendor</th><th>Minimum Decreament</th><th>Decreament On</th><th>Attachment</th><th class=hide></th><th>Last InvoicePrice</th><th class=hide></th></tr></thead>");
                for (var i = 0; i < BidData[0].BidProductDetails.length; i++) {

                    if (max < BidData[0].BidProductDetails[i].AttachmentSeqID) {
                        max = BidData[0].BidProductDetails[i].AttachmentSeqID
                    }
                    FileseqNo = max
                    var decrementon = ''

                    if (BidData[0].BidProductDetails[i].DecreamentOn == 'A')
                        decrementon = 'Amount'
                    else
                        decrementon = 'Percentage'

                    var attach = (BidData[0].BidProductDetails[i].Attachments).replace(/%20/g, " ");

                    jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:150px !important;"><button class="btn  btn-sm btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-sm btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td>' + BidData[0].BidProductDetails[i].ShortName + '</td><td>' + BidData[0].BidProductDetails[i].Targetprice + '</td><td>' + BidData[0].BidProductDetails[i].Quantity + '</td><td>' + BidData[0].BidProductDetails[i].UOM + '</td><td>' + BidData[0].BidProductDetails[i].Description + '</td><td>' + BidData[0].BidProductDetails[i].ContractDuration + '</td><td>' + BidData[0].BidProductDetails[i].DeliveryLocation + '</td><td>' + BidData[0].BidProductDetails[i].CeilingPrice + '</td><td>' + BidData[0].BidProductDetails[i].MaskVendor + '</td><td>' + BidData[0].BidProductDetails[i].MinimumDecreament + '</td><td>' + decrementon + '</td><td><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].BidProductDetails[i].AttachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + attach + '</a></td><td class=hide>' + BidData[0].BidProductDetails[i].DecreamentOn + '</td><td>' + BidData[0].BidProductDetails[i].LastInvoicePrice + '</td><td class=hide>' + BidData[0].BidProductDetails[i].AttachmentSeqID + '</td></tr>');
                    jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + BidData[0].BidProductDetails[i].ShortName + '</td><td>' + BidData[0].BidProductDetails[i].Targetprice + '</td><td>' + BidData[0].BidProductDetails[i].Quantity + '</td><td>' + BidData[0].BidProductDetails[i].UOM + '</td><td>' + BidData[0].BidProductDetails[i].Description + '</td><td>' + BidData[0].BidProductDetails[i].ContractDuration + '</td><td>' + BidData[0].BidProductDetails[i].DeliveryLocation + '</td><td>' + BidData[0].BidProductDetails[i].CeilingPrice + '</td><td>' + BidData[0].BidProductDetails[i].MaskVendor + '</td><td>' + BidData[0].BidProductDetails[i].MinimumDecreament + '</td><td>' + decrementon + '</td><td><a href=PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + BidData[0].BidProductDetails[i].AttachmentSeqID + '/' + attach + ' style=text-decoration:none; >' + attach + ' </a></td><td class=hide>' + BidData[0].BidProductDetails[i].DecreamentOn + '</td><td>' + BidData[0].BidProductDetails[i].LastInvoicePrice + '</td><td class=hide>' + BidData[0].BidProductDetails[i].AttachmentSeqID + '</td></tr>');
                    z = i;
                }

            }
        }
    });

    setTimeout(function () {
        fetchPSBidDetailsForPreview()
    }, 2000);

}
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function ajaxFileDelete(closebtnid, fileid, filepath, deletionFor) {
    FileseqNo = FileseqNo - 1;
    //jQuery(document).ajaxStart(jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" /> Please Wait...</h5>' })).ajaxStop(jQuery.unblockUI);
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var formData = new window.FormData();
    if (deletionFor == 'ParameterFiles') {
        formData.append("Path", filepath);
    }
    else {

        var theLinkdiv = document.getElementById(filepath)
        var path = theLinkdiv.getAttribute("href");

        formData.append("Path", path);
    }


    $.ajax({

        url: 'ConfigureFileAttachment.ashx',

        data: formData,

        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function (data) {



            if (deletionFor != 'ParameterFiles' && deletionFor != 'ParameterFilesedit') {
                fileDeletefromdb(closebtnid, fileid, filepath, deletionFor);
            }
            else if (deletionFor == 'ParameterFilesedit') {

                var clickedrow = sessionStorage.getItem('ClickedEditID');
                $('#closebtnitms').hide();
                $('#' + filepath).html('')
                $('#' + filepath).attr('href', 'javascript:;').addClass('display-none');
                $('#' + fileid).attr('disabled', false);
                $('#spansuccess1').html('File Deleted Successfully');

                $("#" + clickedrow).find("td:eq(12)").text('')
                $("#" + clickedrow).find("td:eq(15)").text(FileseqNo)
                success.show();
                Metronic.scrollTo(success, -200);
                success.fadeOut(5000);
            }
            jQuery.unblockUI();
        },

        error: function () {

            bootbox.alert("Attachment error.");
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

        "BidId": sessionStorage.getItem('CurrentBidID'),
        "BidTypeID": '1',
        "UserId": sessionStorage.getItem('UserID'),
        "RFQRFIID": 0,
        "RFIRFQType": deletionFor
    }

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FileDeletion/",
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function (data) {
            if (data[0].IsSuccess == '1') {
                $('#spansuccess1').html('File Deleted Successfully');
                success.show();
                Metronic.scrollTo(success, -200);
                success.fadeOut(5000);
            }
        }

    });
}



function Dateandtimevalidate(indexNo) {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/?BidDate=" + jQuery("#txtbidDate").val() + "&BidTime=" + jQuery("#txtbidTime").val(),
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            if (RFQData[0].BidId == 1) {
                if (indexNo == 'index1') {
                    ConfigureBidForProductTab1();
                    fetchPSBidDetailsForPreview();
                } else {
                    $('#BidPreviewDiv').show();
                    $('#form_wizard_1').hide();
                }

            } else {
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

            bootbox.alert("you have some error.Please try agian.");

        }

    });

}

// For Bid Preview

function fetchPSBidDetailsForPreview() {
    var TermsConditionFileName = '';
    var AttachementFileName = '';
    //var replaced1 = '';
    //var replaced2 = '';
    jQuery('#mapedapproverPrev').html('');

    jQuery('#txtBidSubjectPrev').html($('#txtBidSubject').val())
    jQuery('#txtBidDurationPrev').html($('#txtBidDuration').val())
    jQuery('#txtbiddescriptionPrev').html($('#txtbiddescription').val())
    jQuery('#txtbidDatePrev').html($('#txtbidDate').val())
    jQuery('#txtbidTimePrev').html($('#txtbidTime').val())
    jQuery("#dropCurrencyPrev").html($('#dropCurrency option:selected').text())
    jQuery('#txtConversionRatePrev').html($('#txtConversionRate').val())
    jQuery('#txtConversionRatePrev').html($('#txtConversionRate').val())
    $('#mapedapprover option').each(function () {
        // alert($(this).html())
        jQuery('#mapedapproverPrev').append($(this).html() + '<br/>')
    });

    if ($('#filepthterms').html() != '' && ($('#file1').val() == '')) {
        $('#filepthtermsPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + $('#filepthterms').html()).html($('#filepthterms').html());

    } else {
        TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);

        $('#filepthtermsPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + TermsConditionFileName).html(TermsConditionFileName);
    }


    if (($('#filepthattach').html() != '') && ($('#file2').val() == '')) {
        $('#filepthattachPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + $('#filepthattach').html()).html($('#filepthattach').html());
    } else {
        AttachementFileName = jQuery('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1);

        $('#filepthattachPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + AttachementFileName).html(AttachementFileName);
    }


}

$('#back_prev_btn').click(function () {
    $('#BidPreviewDiv').hide();
    $('#form_wizard_1').show();
});