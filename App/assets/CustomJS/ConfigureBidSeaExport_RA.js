$("#cancelBidBtn").hide();

jQuery('#btnpush').click(function(e) {

    jQuery('#approverList > option:selected').appendTo('#mapedapprover');

});

jQuery('#btnpull').click(function(e) {

    jQuery('#mapedapprover > option:selected').appendTo('#approverList');

});

var vendorsForAutoComplete;
function fetchVendorparticipanType() {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "BidType/fetchBidType/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0&excludeStatus=N&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),

        cache: false,

        crossDomain: true,

        dataType: "json",

        success: function(bidTypedata) {



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

        success: function(data) {

            jQuery("#ddlSector").empty();

            jQuery("#ddlSector").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#ddlSector").append(jQuery("<option></option>").val(data[i].ContinentId).html(data[i].ContinentNm));

            }

        }

    });

    jQuery("#ddlCountry").append(jQuery("<option ></option>").val("").html("Select"));

}

jQuery("#ddlSector").change(function() {

    var continentID = $("#ddlSector option:selected").val();

    var countryID = "0";

    fetchCountry(continentID, countryID)

});
var allUOM = '';
function FetchUOM(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + CustomerID,
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
            //jQuery("#dropuom").append(jQuery("<option ></option>").val("").html("Select"));
            //for (var i = 0; i < data.length; i++) {
            //    jQuery("#dropuom").append(jQuery("<option></option>").val(data[i].UOM).html(data[i].UOM));
            //}

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
            map[username.UOM] = username;
            usernames.push(username.UOM);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].UOM != "") {
            $('#dropuom').val(map[item].UOM)

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

function fetchCountry(continentID, countryID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchCountry/?ContinentId=" + continentID + "&CountryID=" + countryID + "&excludeStatus=N",

        cache: false,

        dataType: "json",

        success: function(data) {

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

        success: function(data) {

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


function FetchCurrency(CurrencyID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchCurrency/?CurrencyID=" + CurrencyID + "&excludeStatus=N",

        cache: false,

        dataType: "json",

        success: function(data) {

            jQuery("#dropCurrency").empty();

            jQuery("#dropCurrency").append(jQuery("<option ></option>").val("").html("Select"));

            for (var i = 0; i < data.length; i++) {

                jQuery("#dropCurrency").append(jQuery("<option></option>").val(data[i].CurrencyId).html(data[i].CurrencyNm));

            }

        }

    });

}



function FetchVender(ByBidTypeID) {


    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendor/?ByBidTypeID=" + ByBidTypeID + "&CustomerID=" + sessionStorage.getItem('CustomerID'),

        cache: false,

        dataType: "json",

        success: function(data) {

            jQuery("#tblvendorlist > tbody").empty();
            var vName = '';
            for (var i = 0; i < data.length; i++) {
                vName = data[i].VendorName;
                var str = "<tr><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].VendorID + "'\)\"; id=\"chkvender" + i + "\" value=" + data[i].VendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].VendorName + " </td></tr>";

                jQuery('#tblvendorlist > tbody').append(str);

            }

        }

    });

}
var vCount = 0;
$("#chkAll").click(function() {

    if ($("#chkAll").is(':checked') == true) {
        $('#divvendorlist').find('span#spandynamic').hide();
        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
        jQuery('#selectedvendorlists> tbody').empty()
        jQuery('#selectedvendorlistsPrev> tbody').empty()
        vCount = 0;
        $("#tblvendorlist> tbody > tr").each(function(index) {
            $(this).find("span#spanchecked").addClass("checked");            
            $('#chkvender' + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
            var vendorid = $('#chkvender' + $.trim($(this).find('td:eq(0)').html())).val()
            var v = vCount;
            vCount = vCount + 1;
            var vname = $.trim($(this).find('td:eq(2)').html())
            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td id=tblcolweightage' + vendorid + '>0</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorid + ',' + 'chkvender' + vendorid + ',SelecetedVendorPrev' + vendorid + ')"><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" id=Lambda' + vendorid + ' class="btn btn-xs btn-success lambdafactor" data-placement="left" data-original-title="Lambda factor can not be put in case Show L1 Price is selected Yes of this bid." onclick="addWeightageToVendor(' + vendorid + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorid + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td id=tblcolweightagePrev' + vendorid + '>0</td></tr>')
            if (FlagForCheckShowPrice == "Y") {
                $('#Lambda' + vendorid).addClass('tooltips')
            }
            else {
                $('#Lambda' + vendorid).removeClass('tooltips')
            }
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
        jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td id=tblcolweightage' + vendorID + '>0</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vendorID + ',' + EvID + ',SelecetedVendorPrev' + vendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success lambdafactor tooltips" id=Lambda' + vendorID + ' data-toggle="tooltip"  data-placement="left" data-original-title="Lambda factor can not be put in case Show L1 Price is selected Yes of this bid." onclick="addWeightageToVendor(' + vendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
        jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vendorID + '><td class=hide>' + vendorID + '</td><td>' + vname + '</td><td id=tblcolweightagePrev' + vendorID + '>0</td></tr>')
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

        $('#chkAll').closest("span").removeClass("checked")
        $('#chkAll').prop("checked", false);
        jQuery('#selectedvendorlists').hide()
        jQuery('#selectedvendorlistsPrev').hide()

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
    } else {
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




//$("#chkAll").click(function() {

//    if ($("#chkAll").is(':checked') == true) {
//        $('#divvendorlist').find('span#spandynamic').hide();
//        $('table#tblvendorlist').closest('.inputgroup').removeClass('has-error');
//        jQuery('#selectedvendorlists> tbody').empty()
//        jQuery('#selectedvendorlistsPrev> tbody').empty()
//        vCount = 0;
//        $("#tblvendorlist> tbody > tr").each(function(index) {
//            $(this).find("span#spanchecked").addClass("checked");
//            $('#chkvender' + vCount).prop("disabled", true);
//            var vendorid = $('#chkvender' + vCount).val()
//            var v = vCount;
//            vCount = vCount + 1;
//            var vname = $.trim($(this).find('td:eq(1)').html())
//            jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + vCount + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td><td><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + vCount + ',' + 'chkvender' + v + ',SelecetedVendorPrev' + vCount + ')"><i class="glyphicon glyphicon-remove-circle"></i></a></td></tr>')
//            jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + vCount + '><td class=hide>' + vendorid + '</td><td>' + vname + '</td></tr>')

//        });
//    }
//    else {
//        $("#tblvendorlist> tbody > tr").each(function(index) {
//            $(this).find("span#spanchecked").removeClass("checked");
//            vCount = 0;
//            $('input[name="chkvender"]').prop('disabled', false);
//            jQuery('#selectedvendorlists> tbody').empty()
//            jQuery('#selectedvendorlistsPrev> tbody').empty()
//        });

//    }
//    if (vCount > 0) {
//        jQuery('#selectedvendorlists').show()
//        jQuery('#selectedvendorlistsPrev').show()
//    }
//    else {
//        jQuery('#selectedvendorlists').hide()
//        jQuery('#selectedvendorlistsPrev').hide()
//    }

//});



function fetchRegisterUser(bidtypeid) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "RegisterUser/fetchRegisterUser/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&UserID=0&BidTypeID=" + bidtypeid + "&LoginUserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),

        cache: false,

        crossDomain: true,

        dataType: "json",

        success: function(data) {

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
var FlagForCheckShowPrice = "N";

var FormWizard = function() {

    return {

        init: function() {

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
                    ddlbidclosetype: {
                        required: true

                    },
                    txtBidSubject: {
                        required: true,
                        maxlength: 2000
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
                    txtdestinationPort: {
                        required: true,
                        maxlength: 200
                    },
                    txtbiddescriptionP:{
                        required: true,
                        maxlength: 100
                    },
                    txtquantitiy: {
                        maxlength: 9
                    },


                    txtContractDuration: {

                },

                txtitembidduration: {
                    required: true,
                    number: true,
                    maxlength: 3

                },
                txtedelivery: {

            },
            txtminimumdecreament: {
                required: true,
                number: true

            },



            txttargetprice: {
                number: true,
                maxlength: 10

            },
            txtlastinvoiceprice: {
                number: true,
                maxlength: 10
            },
            txtCeilingPrice: {
                number: true,
                maxlength:10
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

    errorPlacement: function(error, element) {

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

    invalidHandler: function(event, validator) {
        success.hide();
        Metronic.scrollTo(error, -200);

    },

    highlight: function(element) {

        $(element)
                                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');
        $(element)
                                        .closest('.col-md-4').removeClass('has-success').addClass('has-error');
        $(element).closest('.col-md-3').removeClass('has-success').addClass('has-error');

    },

    unhighlight: function(element) {

        $(element)
                                        .closest('.inputgroup').removeClass('has-error');
        $(element)
                                        .closest('.col-md-4').removeClass('has-error');
        $(element)
                                        .closest('.col-md-3').removeClass('has-error');

    },

    success: function(label) {

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



    submitHandler: function(form) {

        // success.show();

        error.hide();

    }



});



var displayConfirm = function() {

    $('#tab4 .form-control-static', form).each(function() {

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

            $('[name="payment[]"]:checked').each(function() {

                payment.push($(this).attr('data-title'));

            });

            $(this).html(payment.join("<br>"));

        }

    });

}



var handleTitle = function(tab, navigation, index) {

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

    onTabClick: function(tab, navigation, index, clickedIndex) {

        return false;

    },

    onNext: function(tab, navigation, index) {

        success.hide();

        error.hide();

        if (index == 1) {
            if (form.valid() == false) {

                form.validate();
                return false;

            }


            else {

                Dateandtimevalidate('index1')
                showhideItemBidDuration();
            }

        } else if (index == 2) {
            if ($('#tblServicesProduct >tbody >tr').length == 0) {
                $('#spandanger').html('You have Some error. Please Check Below!')
                $('.alert-danger').show();
                Metronic.scrollTo($('.alert-danger'), -200);
                $('.alert-danger').fadeOut(5000);

                return false;


            }
            else {
                FlagForCheckShowPrice = 'N';
                $("#tblServicesProduct tr:gt(0)").each(function () {
                    var this_row = $(this);
                    if ($.trim(this_row.find('td:eq(13)').html()) == "Y") {
                        FlagForCheckShowPrice = 'Y';
                        return false;
                    }
                   
                })
                if (FlagForCheckShowPrice == "Y") {
                    $('.lambdafactor').attr("disabled", "disabled");
                }
                else {
                    $('.lambdafactor').removeAttr("disabled", "disabled");
                }
                ConfigureBidForSeaExportTab2()
            }
        }
        handleTitle(tab, navigation, index);

    },

    onPrevious: function(tab, navigation, index) {

        success.hide();

        error.hide();

        handleTitle(tab, navigation, index);

    },

    onTabShow: function(tab, navigation, index) {

        var total = navigation.find('li').length;

        var current = index + 1;

        var $percent = (current / total) * 100;

        $('#form_wizard_1').find('.progress-bar').css({

            width: $percent + '%'

        });

    }

});

$('#form_wizard_1').find('.button-previous').hide();

$('#form_wizard_1 .button-submit').click(function() {

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

} ();


//sessionStorage.setItem('CurrentBidID', 0)
function ConfigureBidForSeaExportTab1() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var TermsConditionFileName = '';
    var AttachementFileName = '';
    var BidDuration = 0;

    if (jQuery("#txtBidDuration").val() != '' || jQuery("#txtBidDuration").val() != null) {
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
    var Tab1Data = {

        "BidId": sessionStorage.getItem('CurrentBidID'),
        "BidSubject": jQuery("#txtBidSubject").val(),
        "BidDescription": jQuery("#txtbiddescription").val(),
        "BidDate": jQuery("#txtbidDate").val(),
        "BidTime": jQuery("#txtbidTime").val(),
        "BidDuration": jQuery("#txtBidDuration").val(),
        "CurrencyID": jQuery("#dropCurrency option:selected").val(),
        "BidTypeID": '7',
        "BidForID": 1,
        "ContinentId": jQuery("#ddlSector").val(),
        "CountryID": jQuery("#ddlCountry option:selected").val(),
        "ConversionRate": jQuery("#txtConversionRate").val(),
        "TermsConditions": TermsConditionFileName,
        "Attachment": AttachementFileName,
        "UserId": sessionStorage.getItem('UserID'),
        "BidApprovers": BidApprovers(),
        "CustomerID": sessionStorage.getItem('CustomerID'),
        "BidClosetype": $('#ddlbidclosetype').val()

    };

  //  alert(JSON.stringify(Tab1Data))
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsSeaExport/",
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab1Data),
        dataType: "json",

        success: function(data) {
           
        if ($('#ddlbidclosetype option:selected').val() == "S") {
            $('.itemclass').removeClass('hide')
            }
            else {
                $('.itemclass').addClass('hide')
                 $('.itemclass').val(0)
            }
            if (window.location.search) {

                sessionStorage.setItem('CurrentBidID', getUrlVars()["BidID"])
            }
            else {
                sessionStorage.setItem('CurrentBidID', data[0].BidID)
            }

            fileUploader(sessionStorage.getItem('CurrentBidID'))
        },
        error: function(result) {
            alert('error')
            return false;
        }

    });
    $('#txtselectedCurrency').val(jQuery("#dropCurrency option:selected").text());
    jQuery.unblockUI();

}
var totalitemdurationstagger = 0;

function ConfigureBidForSeaExportTab2() {
    var targetPrice;

    var BidDuration = 0;
    var itmduartion = 0;

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    PriceDetails = '';
    totalitemdurationstagger = 0;

    var rowCount = jQuery('#tblServicesProduct tr').length;
    if (rowCount > 1) {
        
        var ItemStatus = 'Open';
        $("#tblServicesProduct tr:gt(0)").each(function () {
            PriceDetails = PriceDetails + 'insert into BidSeaExportDetails(BidID,DestinationPort,Targetprice,Remarks,Quantity,CeilingPrice,MaskVendor,MinimumDecreament,DecreamentOn,LastInvoicePrice,ItemBidDuration,UOM,SelectedCurrency,ItemStatus,MaskL1Price,ShowStartPrice) values('
            targetPrice = 0
            var this_row = $(this);


            if ($.trim(this_row.find('td:eq(3)').html()) != '') {
                targetPrice = $.trim(this_row.find('td:eq(3)').html());
            }

            var remark = $.trim(this_row.find('td:eq(2)').html()).replace(/'/g, "");
            if ($('#ddlbidclosetype').val() == "A") {
                itmduartion = 0;
                BidDuration = BidDuration + 0;
            }
            else {
                itmduartion = $.trim(this_row.find('td:eq(12)').html());
                BidDuration = BidDuration + parseInt($.trim(this_row.find('td:eq(12)').html()))
                totalitemdurationstagger = totalitemdurationstagger + parseInt($.trim(this_row.find('td:eq(12)').html()))
            }

           
            //if (BidDuration==null)

            PriceDetails = PriceDetails + sessionStorage.getItem('CurrentBidID') + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "'," + removeThousandSeperator(targetPrice) + ",'" + remark + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(4)').html())) + "," + removeThousandSeperator($.trim(this_row.find('td:eq(6)').html())) + ",'" + $.trim(this_row.find('td:eq(7)').html()) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(8)').html())) + ",'" + $.trim(this_row.find('td:eq(10)').html()) + "'," + removeThousandSeperator($.trim(this_row.find('td:eq(11)').html())) + "," + itmduartion + ",'" + $.trim(this_row.find('td:eq(5)').html()) + "','" + $.trim($('#dropCurrency option:selected').text()) + "','" + ItemStatus + "','" + $.trim(this_row.find('td:eq(13)').html()) + "','" + $.trim(this_row.find('td:eq(14)').html()) + "')";
            if ($('#ddlbidclosetype').val() != "A") {
                ItemStatus = 'Inactive';
            }
        });
        sessionStorage.setItem('TotalBidDuration', totalitemdurationstagger);
    }
    //PriceDetails = PriceDetails.substring(0, PriceDetails.length - 6);
    console.log(PriceDetails)
    var Tab2data = {
        "PriceDetails": PriceDetails,
        "BidID": sessionStorage.getItem('CurrentBidID'),
        "UserID": sessionStorage.getItem('UserID'),
        "BidDuration": BidDuration,
        "BidClosetype": $('#ddlbidclosetype option:selected').val()

    };
    //console.log("Tab2data  > ", Tab2data);
    // alert(JSON.stringify(Tab2data))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsSeaExportTab2/",
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab2data),
        dataType: "json",
        success: function(data) {
            if (data[0].BidID > 0) {

                return true;
            }
            else {
                return false;

            }

        },
        error: function (result) {
            //alert('error')
            //  alert(status)
            return false;
        }

    });
    jQuery.unblockUI();
}

function ConfigureBidForSeaExportTab3() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var InsertQuery = '';
    $("#selectedvendorlistsPrev> tbody > tr").each(function(index) {
        InsertQuery = InsertQuery + "select " + sessionStorage.getItem('CurrentBidID') + "," + $.trim($(this).find('td:eq(0)').html()) + "," + $.trim($(this).find('td:eq(2)').html()) + " union all ";
    });

    if (InsertQuery != '') {

        InsertQuery = "Insert into BidVendorDetails(BidId,VendorId,AdvFactor)" + InsertQuery;
        InsertQuery = InsertQuery.substring(0, InsertQuery.length - 10);

    }
    else {
        InsertQuery = "Print 1";
    }

    var Tab3data = {
        "BidVendors": InsertQuery,
        "BidID": sessionStorage.getItem('CurrentBidID')
    };
    
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsSeaExportVendors/",
        crossDomain: true,
        async: false,
        data: JSON.stringify(Tab3data),
        dataType: "json",
        success: function(data) {
            if (data[0].BidID > 0) {
                jQuery.unblockUI();
                $('#BidPreviewDiv').show();
                $('#form_wizard_1').hide();
            }
            else {
                jQuery.unblockUI();
                bootbox.alert("Configuration error.");
            }
        }
    });
}

function ConfigureBidForSeaExportandSave() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    

    var Tab3data = {        
        "BidID": sessionStorage.getItem('CurrentBidID'),
        "UserID": sessionStorage.getItem('UserID'),
        "BidSubject": jQuery("#txtBidSubject").val(),
        "BidDescription": jQuery("#txtbiddescription").val(),
        "BidDate": jQuery("#txtbidDate").val(),
        "BidTime": jQuery("#txtbidTime").val(),
        "BidTypeID": '7'
    };

    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidForSeaExportandSave/",
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

        success: function(data) {
            jQuery.unblockUI();
        },

        error: function() {

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

        success: function(data) {
            jQuery.unblockUI();
        },

        error: function() {

            bootbox.alert("Attachment error.");
            jQuery.unblockUI();
        }

    });

}



function BidApprovers() {

    var bidApprovers = {};

    var bidapprover = []

    bidApprovers.bidapprover = bidapprover;

    $.each($("select#mapedapprover option"), function(index) {

        bidApprovers.bidapprover.push({ "AdMinSrNo": index + 1, "UserID": $(this).val() });

    });

    return JSON.stringify(bidApprovers);

}



function BidVendors() {

    var bidVendors = {};

    var bidvendor = []

    bidVendors.bidvendor = bidvendor;

    $("#tblvendorlist> tbody > tr").each(function(index) {

        if ($(this).find("span#spanchecked").attr('class') == 'checked') {

            bidVendors.bidvendor.push({ "VendorID": $(this).find("#chkvender").val() });

        }

    });

    return JSON.stringify(bidVendors);

}



$("#txtbidDate").change(function() {

    if ($("#txtbidDate").val() == '') { }

    else {

        $("#txtbidDate").closest('.inputgroup').removeClass('has-error');

        $("#txtbidDate").closest('.inputgroup').find('span').hide();

        $("#txtbidDate").closest('.inputgroup').find('span.input-group-btn').show();

        $("#txtbidDate").closest('.inputgroup').find("#btncal").css("margin-top", "0px");

    }

});

var FileseqNo = 0;
function InsUpdSeaExport() {

    if ($('#add_or').text() == "Modify") {

        var st = "true"

        $("#tblServicesProduct tr:gt(0)").each(function() {

            var this_row = $(this);

            if ($.trim(this_row.find('td:eq(1)').html()) == $('#txtdestinationPort').val() && $.trim(this_row.find('td:eq(2)').html()) != $('#txtbiddescriptionP').val() && $.trim(this_row.find('td:eq(3)').html()) != $('#txttargetprice').val() && $.trim(this_row.find('td:eq(4)').html()) != $("#txtquantitiy").val() && $.trim(this_row.find('td:eq(5)').html()) != $("#dropuom").val() && $.trim(this_row.find('td:eq(6)').html()) != $('#txtCeilingPrice').val() && $.trim(this_row.find('td:eq(7)').html()) != $('#checkmaskvendor option:selected').val() && $.trim(this_row.find('td:eq(8)').html()) != $('#txtminimumdecreament').val() && $.trim(this_row.find('td:eq(10)').html()) != $('#drpdecreamenton option:selected').val() && $.trim(this_row.find('td:eq(11)').html()) != $('#txtlastinvoiceprice').val() && $.trim(this_row.find('td:eq(12)').html()) != $("#txtitembidduration").val()) {

                st = "false"

            }

        });

        if ($('#txtbiddescriptionP').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Remarks...');

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


        else if ($('#txtCeilingPrice').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Bid Start Price in Number only...');
            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if (form.valid() == false) {

          error.show();
            $('#spandanger').html('You have some error.Please Check below...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        
        if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
            error.show();
            $('#spandanger').html('Minimum decrement should be less than bid start price.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

         }
         
         else if ((parseInt($('#txtminimumdecreament').val()) > parseInt(20) && $("#drpdecreamenton option:selected").val() == "P")) {
            error.show();
            $('#spandanger').html('Minimum decrement should be less than 20%.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

           return false;

        }
        else if (parseInt($('#txtminimumdecreament').val()) > parseFloat(20 * (removeThousandSeperator($('#txtCeilingPrice').val())) / 100) && $("#drpdecreamenton option:selected").val() == "P") {
            error.show();
            $('#spandanger').html('Minimum decrement should be less than 20% of Bid Start Price.');
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

            //PriceDetails = '';         


            //PriceDetails = PriceDetails + 'insert into BidProductServicesDetails(BidID,ShortName,Quantity,Targetprice,UOM,Description,ContractDuration,DeliveryLocation,CeilingPrice,MaskVendor,MinimumDecreament,DecreamentOn,Attachments,LastInvoicePrice,AttachmentSeqID)'

            var this_row = $('#rowid').val();

            var this_row_Prev = $('#rowidPrev').val();

            $("#" + this_row).find("td:eq(1)").text($('#txtdestinationPort').val())
            $("#" + this_row).find("td:eq(2)").text($('#txtbiddescriptionP').val())
            $("#" + this_row).find("td:eq(3)").text($('#txttargetprice').val())

            $("#" + this_row).find("td:eq(4)").text($('#txtquantitiy').val())
            $("#" + this_row).find("td:eq(5)").text($('#dropuom').val())
            
            $("#" + this_row).find("td:eq(6)").text($('#txtCeilingPrice').val())

            $("#" + this_row).find("td:eq(7)").text($('#checkmaskvendor option:selected').val())

            $("#" + this_row).find("td:eq(8)").text($('#txtminimumdecreament').val())

            $("#" + this_row).find("td:eq(9)").text($('#drpdecreamenton option:selected').text())
            $("#" + this_row).find("td:eq(10)").text($('#drpdecreamenton option:selected').val())
            $("#" + this_row).find("td:eq(11)").text($('#txtlastinvoiceprice').val())
            $("#" + this_row).find("td:eq(12)").text($("#txtitembidduration").val())
            $("#" + this_row).find("td:eq(13)").text($('#checkmaskL1price option:selected').val())
            $("#" + this_row).find("td:eq(14)").text($('#checkshowstartprice option:selected').val())

           

            //For Preview Table

            $("#" + this_row_Prev).find("td:eq(0)").text($('#txtdestinationPort').val())

            $("#" + this_row_Prev).find("td:eq(1)").text($('#txtbiddescriptionP').val())

            $("#" + this_row_Prev).find("td:eq(2)").text($('#txttargetprice').val())

            $("#" + this_row_Prev).find("td:eq(3)").text($('#txtquantitiy').val())
            $("#" + this_row_Prev).find("td:eq(4)").text($('#dropuom').val())
            $("#" + this_row_Prev).find("td:eq(5)").text($('#txtCeilingPrice').val())

            $("#" + this_row_Prev).find("td:eq(6)").text($('#checkmaskvendor option:selected').val())

            $("#" + this_row_Prev).find("td:eq(7)").text($('#txtminimumdecreament').val())

            $("#" + this_row_Prev).find("td:eq(8)").text($('#drpdecreamenton option:selected').text())

            $("#" + this_row_Prev).find("td:eq(9)").text($('#drpdecreamenton option:selected').val())
            $("#" + this_row_Prev).find("td:eq(10)").text($('#txtlastinvoiceprice').val())
            $("#" + this_row_Prev).find("td:eq(11)").text($("#txtitembidduration").val())
           
            $("#" + this_row_Prev).find("td:eq(12)").text($('#checkmaskL1price option:selected').val())
            $("#" + this_row_Prev).find("td:eq(13)").text($('#checkshowstartprice option:selected').val())


            if ($('#ddlbidclosetype option:selected').val() == "S") {


                $('.itemclass').removeClass('hide')
            }
            else {
                $('.itemclass').addClass('hide')

            }


            //PriceDetails = PriceDetails + " select " + sessionStorage.getItem('CurrentBidID') + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "','" + $.trim(this_row.find('td:eq(3)').html()) + "' ,'" + $.trim(this_row.find('td:eq(2)').html()) + "','" + $.trim(this_row.find('td:eq(4)').html()) + "','" + $.trim(this_row.find('td:eq(5)').html()) + "','" + $.trim(this_row.find('td:eq(6)').html()) + "','" + $.trim(this_row.find('td:eq(7)').html()) + "','" + $.trim(this_row.find('td:eq(8)').html()) + "','" + $.trim(this_row.find('td:eq(9)').html()) + "','" + $.trim(this_row.find('td:eq(10)').html()) + "','" + t + "','" + filetoupload + "','" + $.trim(this_row.find('td:eq(14)').html()) + "','"+FileseqNo+"' union";

            resetfun();

        }

    }

    else {

        if ($('#txtdestinationPort').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Item/Product/Service...');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if ($('#txtbiddescriptionP').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Remarks...');

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
            $('#spandanger').html('Please Select UOM...');


            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#txtCeilingPrice').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Bid Start Price in Number only...');
            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }

        else if ($('#txtminimumdecreament').val() == "") {

            error.show();
            $('#spandanger').html('Please Enter Minimum Decrement in Number only......');
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
        else if (parseInt(removeThousandSeperator($('#txtminimumdecreament').val())) > parseInt(removeThousandSeperator($('#txtCeilingPrice').val()))) {
            error.show();
            $('#spandanger').html('Minimum decrement should be less than bid start price.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

            return false;

        }
        else if ((parseInt($('#txtminimumdecreament').val()) > parseInt(20) &&  $("#drpdecreamenton option:selected").val() == "P")) {
            error.show();
            $('#spandanger').html('Minimum decrement should be less than 20%.');

            Metronic.scrollTo(error, -200);

            error.fadeOut(3000);

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

            if ($('#tblServicesProduct >tbody >tr').length == 0) {
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

                $("#tblServicesProduct tr:gt(0)").each(function() {

                    var this_row = $(this);

                    if ($.trim(this_row.find('td:eq(1)').html()) == $('#txtdestinationPort').val()) {

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
    //alert(('#txtdestinationPort').val())
   

    if (!jQuery("#tblServicesProduct thead").length) {
        jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th 'width:20%!important;'></th><th>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last Invoice Price</th><th class=itemclass>Bid Duration (in mins)</th><th>Show L1 Price</th><th>Show Start Price</th></tr></thead>");
        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td><button type="button" class="btn btn-xs btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td  style="width:20%!important;">' + $('#txtdestinationPort').val() + '</td><td>' + $('#txtbiddescriptionP').val() + '</td><td class=text-right>' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td>' + $("#dropuom").val() + '</td><td class=text-right>' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td>' + status + '</td><td class=text-right>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td class=text-right>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class=itemclass>' + itemBidDuration + '</td><td>' + MaskL1Price + '</td><td>' + ShowStartPrice + '</td></tr>');
       


    }
    else {
       
        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td><button type="button" class="btn  btn-xs btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:20%!important;">' + $('#txtdestinationPort').val() + '</td><td>' + $('#txtbiddescriptionP').val() + '</td><td class=text-right>' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td>' + $("#dropuom").val() + '</td><td class=text-right>' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td>' + status + '</td><td class=text-right>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td class=text-right>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class=itemclass>' + itemBidDuration + '</td><td>' + MaskL1Price + '</td><td>' + ShowStartPrice + '</td></tr>');
       
    }
    $('#wrap_scroller').show();

    if (!jQuery("#tblServicesProductPrev thead").length) {

        jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:20%!important;'>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last Invoice Price</th><th class=itemclass>Item Bid Duration(Minutes)</th><th>Show L1 Price</th><th>Show Start Price</th></tr></thead>");
        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td style="width:20%!important;">' + $('#txtdestinationPort').val() + '</td><td>' + $('#txtdestinationPort').val() + '</td><td class=text-right>' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td>' + $("#dropuom").val() + '</td><td class=text-right>' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td>' + status + '</td><td class=text-right>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td class=text-right>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class="itemclass text-right">' + itemBidDuration + '</td><td>' + MaskL1Price + '</td><td>' + ShowStartPrice + '</td></tr>');

        totalitemdurationstagger = totalitemdurationstagger + parseInt(itemBidDuration);

    } else {

        jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + $('#txtdestinationPort').val() + '</td><td>' + $('#txtbiddescriptionP').val() + '</td><td class=text-right>' + thousands_separators($('#txttargetprice').val()) + '</td><td class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td>' + $("#dropuom").val() + '</td><td class=text-right>' + thousands_separators($('#txtCeilingPrice').val()) + '</td><td>' + status + '</td><td class=text-right>' + thousands_separators($('#txtminimumdecreament').val()) + '</td><td>' + $("#drpdecreamenton option:selected").text() + '</td><td class=hide>' + $("#drpdecreamenton").val() + '</td><td class=text-right>' + thousands_separators($("#txtlastinvoiceprice").val()) + '</td><td class="itemclass text-right">' + itemBidDuration + '</td><td>' + MaskL1Price + '</td><td>' + ShowStartPrice + '</td></tr>');
        totalitemdurationstagger = totalitemdurationstagger + parseInt(itemBidDuration);

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
    //PriceDetails = PriceDetails + " select " + sessionStorage.getItem('CurrentBidID') + ",'" + $('#txtdestinationPort').val() + "','" + "," + $('#txtbiddescriptionP').val() + "," + $('#txttargetprice').val() + "'," + $('#txtquantitiy').val() +"',"+ $('#txtCeilingPrice').val() + "','" + status + "','" + $('#txtminimumdecreament').val() + "','" + $('#drpdecreamenton').val() + "," + $("#txtlastinvoiceprice").val() + "' union";
    resetfun()

}

function editvalues(rowid, rowidPrev) {

    sessionStorage.setItem('ClickedEditID', rowid.id)
    Metronic.scrollTo($("body"), 200);
    $('#rowid').val(rowid.id)
    $('#rowidPrev').val(rowidPrev.id)

    $('#txtdestinationPort').val($("#" + rowid.id).find("td:eq(1)").text())
    $('#txtbiddescriptionP').val($("#" + rowid.id).find("td:eq(2)").text())

    $('#txttargetprice').val($("#" + rowid.id).find("td:eq(3)").text())

    $('#txtquantitiy').val($("#" + rowid.id).find("td:eq(4)").text())
    $('#dropuom').val($("#" + rowid.id).find("td:eq(5)").text())
    $('#txtUOM').val($("#" + rowid.id).find("td:eq(5)").text())
    $('#txtCeilingPrice').val($("#" + rowid.id).find("td:eq(6)").text())
    $('#checkmaskvendor').val($("#" + rowid.id).find("td:eq(7)").text())

    $('#txtminimumdecreament').val($("#" + rowid.id).find("td:eq(8)").text())

    $('#drpdecreamenton').val($("#" + rowid.id).find("td:eq(10)").text())
    $('#txtlastinvoiceprice').val($("#" + rowid.id).find("td:eq(11)").text())
    $('#txtitembidduration').val($("#" + rowid.id).find("td:eq(12)").text())
    $('#checkmaskL1price').val($("#" + rowid.id).find("td:eq(13)").text())
    $('#checkshowstartprice').val($("#" + rowid.id).find("td:eq(14)").text())
    

    $('#add_or').text('Modify');



}

function deleterow(rowid, rowidPrev) {

    $('#' + rowid.id).remove();
    $('#' + rowidPrev.id).remove();


}

function resetfun() {
    $('#add_or').text('Add');
    $('#txtdestinationPort').val('')
    $('#txttargetprice').val('')
    $('#txtquantitiy').val('')
    $('#txtUOM').val('')
    $('#txtbiddescriptionP').val('')

    $('#txtCeilingPrice').val('')
    $('#txtminimumdecreament').val('')

    $('#txtlastinvoiceprice').val('')
    $('#txtitembidduration').val('');
    $('#checkmaskL1price').val('N');
    $('#checkshowstartprice').val('Y');
    showhideItemBidDuration()

}



function showhideItemBidDuration() {
    var bidCloseType = $('#ddlbidclosetype option:selected').val();
    
    if (bidCloseType == 'A') {

        jQuery('#divItemBiduration').css('visibility', 'hidden');
        $('#txtBidDuration').prop('disabled', false)
        $('#txtitembidduration').prop('disabled', true)
        $('#spanbidduration').show()
        
        $('input[name="txtBidDuration"]').rules('add', {
            required: true,
            minlength: 1,
            maxlength: 3,
            number: true,
            notEqualToZero: function(){
            }
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

jQuery("#txtSearch").keyup(function() {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblvendorlist tbody").find("tr"), function() {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});

function fetchSeaExportDetails() {
    var replaced1 = '';
    var replaced2 = '';
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchSeaExportConfigurationData/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&BidID=" + sessionStorage.getItem('CurrentBidID') + "&AuthenticationToken=" + sessionStorage.getItem('AuthenticationToken'),
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(BidData) {

            jQuery('#txtBidSubject').val(BidData[0].BidDetails[0].BidSubject)
            jQuery('#txtBidDuration').val(BidData[0].BidDetails[0].BidDuration)
            jQuery('#txtbiddescription').val(BidData[0].BidDetails[0].BidDetails)
            jQuery('#txtbidDate').val(BidData[0].BidDetails[0].BidDate)
            jQuery('#txtbidTime').val(BidData[0].BidDetails[0].BidTime)
            jQuery("#dropCurrency").val(BidData[0].BidDetails[0].CurrencyID).attr("selected", "selected");
            jQuery('#txtConversionRate').val(BidData[0].BidDetails[0].ConversionRate)
            $('#txtBidDuration').val(BidData[0].BidDetails[0].BidDuration)
            jQuery('#ddlbidclosetype').val(BidData[0].BidDetails[0].BidClosingType.trim())
            $("#cancelBidBtn").show();
            //$('#hdnBidclosingtype').val(BidData[0].BidDetails[0].BidClosingType)
            if (BidData[0].BidDetails[0].BidClosingType.trim() == 'A') {

                jQuery('#divItemBiduration').css('visibility', 'hidden');
                $('#txtBidDuration').prop('disabled', false)
                $('#spanbidduration').show()
                $('input[name="txtBidDuration"]').rules('add', {
                    required: true,
                    minlength: 1,
                    maxlength: 3,
                    number: true
                });

            }
            else {

                $('#spanbidduration').hide()
                $('input[name="txtBidDuration"]').rules('remove');
                $('.condition-based-validate').removeClass('has-error')
                $('.condition-based-validate').find('.help-block').remove()
                $('#txtBidDuration').prop('disabled', true)
                //$('#txtBidDuration').val('')
                jQuery('#divItemBiduration').css('visibility', 'visible');
            }
            if (BidData[0].BidDetails[0].TermsConditions != '') {

                $('#file1').attr('disabled', true);
                $('#closebtn').removeClass('display-none');

                replaced1 = BidData[0].BidDetails[0].TermsConditions.replace(/\s/g, "%20")
            }

            if (BidData[0].BidDetails[0].Attachment != '' && BidData[0].BidDetails[0].Attachment != null) {
               
                    $('#file2').attr('disabled', true);
                    $('#closebtn2').removeClass('display-none');
                    replaced2 = BidData[0].BidDetails[0].Attachment.replace(/\s/g, "%20")
                
            }



            $('#filepthterms').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + replaced1).html(BidData[0].BidDetails[0].TermsConditions);
            $('#filepthattach').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + replaced2).html(BidData[0].BidDetails[0].Attachment);

            if (BidData[0].BidApproverDetails.length > 0) {
                for (var i = 0; i < BidData[0].BidApproverDetails.length; i++) {
                    //jQuery("#mapedapprover").append('<option value=' + BidData[0].BidApproverDetails[0].UserID + '  selected>' + BidData[0].BidApproverDetails[0].ApproverName + '</option>')
                    jQuery('#mapedapprover').append(jQuery('<option selected></option>').val(BidData[0].BidApproverDetails[i].UserID).html(BidData[0].BidApproverDetails[i].ApproverName))
                }
            }
            totalitemdurationstagger = 0;
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblServicesProductPrev").empty();
            if (BidData[0].BidSeaExportDetails.length > 0) {


                $('#wrap_scroller').show();
                $('#wrap_scrollerPrev').show();

                
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th style='width:20%!important;'>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th><th  class=itemclass >Bid Duration (in minutes)</th><th>Show L1 Price</th><th>Show Start Price</th></tr></thead>");
                jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:20%!important;'>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last InvoicePrice</th><th class='itemclass'>Bid Duration (in minutes)</th><th>Show L1 Price</th><th>Show Start Price</th></tr></thead>");
                 for (var i = 0; i < BidData[0].BidSeaExportDetails.length; i++) {
                    var decrementon = ''
                    if (BidData[0].BidSeaExportDetails[i].DecreamentOn == 'A')
                        decrementon = 'Amount'
                    else
                        decrementon = '%age'

                    
                    

                     jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td><button class="btn  btn-xs btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:20%!important;">' + BidData[0].BidSeaExportDetails[i].DestinationPort + '</td><td>' + BidData[0].BidSeaExportDetails[i].Remarks + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].Targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].Quantity) + '</td><td>' + BidData[0].BidSeaExportDetails[i].UOM + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].CeilingPrice) + '</td><td>' + BidData[0].BidSeaExportDetails[i].MaskVendor + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].MinimumDecreament) + '</td><td>' + decrementon + '</td><td class=hide>' + BidData[0].BidSeaExportDetails[i].DecreamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].LastInvoicePrice) + '</td><td class="itemclass text-right">' + BidData[0].BidSeaExportDetails[i].ItemBidDuration + '</td><td>' + BidData[0].BidSeaExportDetails[i].MaskL1Price + '</td><td>' + BidData[0].BidSeaExportDetails[i].ShowStartPrice + '</td></tr>');
                    
                     jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td style="width:20%!important;">' + BidData[0].BidSeaExportDetails[i].DestinationPort + '</td><td>' + BidData[0].BidSeaExportDetails[i].Remarks + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].Targetprice) + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].Quantity) + '</td><td>' + BidData[0].BidSeaExportDetails[i].UOM + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].CeilingPrice) + '</td><td>' + BidData[0].BidSeaExportDetails[i].MaskVendor + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].MinimumDecreament) + '</td><td>' + decrementon + '</td><td class=hide>' + BidData[0].BidSeaExportDetails[i].DecreamentOn + '</td><td class=text-right>' + thousands_separators(BidData[0].BidSeaExportDetails[i].LastInvoicePrice) + '</td><td class="itemclass text-right">' + BidData[0].BidSeaExportDetails[i].ItemBidDuration + '</td><td>' + BidData[0].BidSeaExportDetails[i].MaskL1Price + '</td><td>' + BidData[0].BidSeaExportDetails[i].ShowStartPrice + '</td></tr>');
                    z = i;
                    totalitemdurationstagger = totalitemdurationstagger + parseInt(BidData[0].BidSeaExportDetails[i].ItemBidDuration)
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

            if (BidData[0].BidVendorDetails.length > 0) {
               
                for (var i = 0; i < BidData[0].BidVendorDetails.length; i++) {
                    jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + BidData[0].BidVendorDetails[i].VendorID + '><td class=hide>' + BidData[0].BidVendorDetails[i].VendorID + '</td><td>' + BidData[0].BidVendorDetails[i].VendorName + '</td><td id=tblcolweightage' + BidData[0].BidVendorDetails[i].VendorID + '>' + BidData[0].BidVendorDetails[i].AdvFactor + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendorfrmDB(' + BidData[0].BidVendorDetails[i].VendorID +')"><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success lambdafactor" title="Add Weightage" onclick="addWeightageToVendor(' + BidData[0].BidVendorDetails[i].VendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
                    //jQuery('#selectedvendorlists').append('<tr id=SelecetedVendor' + BidData[0].BidVendorDetails[i].VendorID + '><td class=hide>' + BidData[0].BidVendorDetails[i].VendorID + '</td><td>' + BidData[0].BidVendorDetails[i].VendorName + '</td><td id=tblcolweightage' + BidData[0].BidVendorDetails[i].VendorID + '>' + BidData[0].BidVendorDetails[i].AdvFactor + '</td><td width=70><a href="javascript:;" class="btn btn-xs btn-danger" onclick="removevendor(SelecetedVendor' + BidData[0].BidVendorDetails[i].VendorID + ',' + 'chkvender' + BidData[0].BidVendorDetails[i].VendorID + ',SelecetedVendorPrev' + BidData[0].BidVendorDetails[i].VendorID + ')"><i class="glyphicon glyphicon-remove-circle"></i></a><a href="javascript:;" class="btn btn-xs btn-success" title="Add Weightage" onclick="addWeightageToVendor(' + BidData[0].BidVendorDetails[i].VendorID + ')"><i class="glyphicon glyphicon-filter"></i></a></td></tr>')
                    jQuery('#selectedvendorlistsPrev').append('<tr id=SelecetedVendorPrev' + BidData[0].BidVendorDetails[i].VendorID + '><td class=hide>' + BidData[0].BidVendorDetails[i].VendorID + '</td><td>' + BidData[0].BidVendorDetails[i].VendorName + '</td><td id=tblcolweightagePrev' + BidData[0].BidVendorDetails[i].VendorID + '>' + BidData[0].BidVendorDetails[i].AdvFactor + '</td></tr>')
                    //$("#chkvender" + BidData[0].BidVendorDetails.VendorID).prop("disabled", true);
                    //$("#chkvender" + BidData[0].BidVendorDetails.VendorID).closest("span#spanchecked").addClass("checked")
                }
               
                jQuery('#selectedvendorlists').show()
                jQuery('#selectedvendorlistsPrev').show()
                
            }
        }
    });

    setTimeout(function() {
        fetchPSBidDetailsForPreview()
    }, 2000);

}
function removevendorfrmDB(vendorid) {
  
    var BidData = {

        "BidId": sessionStorage.getItem('CurrentBidID'),
        "VendorID": vendorid,
        "For":"SeaExport"
    }
    //alert(JSON.stringify(BidData))
    jQuery.ajax({

        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/DeleteInvitedVendor/",
        crossDomain: true,
        async: false,
        data: JSON.stringify(BidData),
        dataType: "json",
        success: function (data) {
           // alert(data.length)
            if (data[0].IsSuccess == '1') {
                $("#SelecetedVendor" + vendorid).remove();
                $("#SelecetedVendorPrev" + vendorid).remove();
                $("#chkvender" + vendorid).prop("disabled", false);
                $("#chkvender" + vendorid).closest("span#spanchecked").removeClass("checked")
                //$('#spansuccess1').html('File Deleted Successfully');
                //success.show();
                //Metronic.scrollTo(success, -200);
                //success.fadeOut(5000);
            }
        }
    })
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
function Dateandtimevalidate(indexNo) {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/Dateandtimevalidate/?BidDate=" + jQuery("#txtbidDate").val() + "&BidTime=" + jQuery("#txtbidTime").val(),
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(RFQData) {

            if (RFQData[0].BidId == 1) {
                if (indexNo == 'index1') {
                    ConfigureBidForSeaExportTab1();
                    fetchPSBidDetailsForPreview();
                } else {
                    ConfigureBidForSeaExportTab3();
                    //$('#BidPreviewDiv').show();
                    //$('#form_wizard_1').hide();
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
        error: function() {

            bootbox.alert("you have some error. Please try again.");

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
    //jQuery('#txtBidDurationPrev').html($('#txtBidDuration').val())
    jQuery('#ddlbidclosetypePrev').html($('#ddlbidclosetype option:selected').text())
    $('#mapedapprover option').each(function() {
        // alert($(this).html())
        jQuery('#mapedapproverPrev').append($(this).html() + '<br/>')
    });

    if ($('#filepthterms').html() != '' && ($('#file1').val() == '')) {
        $('#filepthtermsPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + $('#filepthterms').html().replace(/\s/g, "%20")).html($('#filepthterms').html());

    }
    else {
        TermsConditionFileName = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1);

        $('#filepthtermsPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + TermsConditionFileName.replace(/\s/g, "%20")).html(TermsConditionFileName);
    }


    if (($('#filepthattach').html() != '') && ($('#file2').val() == '')) {
        $('#filepthattachPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + $('#filepthattach').html().replace(/\s/g, "%20")).html($('#filepthattach').html());
    } else {
        AttachementFileName = jQuery('#file2').val().substring(jQuery('#file2').val().lastIndexOf('\\') + 1);

        $('#filepthattachPrev').attr('href', 'PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + '/' + AttachementFileName.replace(/\s/g, "%20")).html(AttachementFileName);
    }


}

$('#back_prev_btn').click(function() {
    $('#BidPreviewDiv').hide();
    $('#form_wizard_1').show();
});

function fetchVendorGroup(categoryFor,vendorId) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=" + categoryFor + "&MappedBy=" + sessionStorage.getItem('UserID') + "&VendorID=" + vendorId,
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                vendorsForAutoComplete = data;
            }
            
            jQuery.unblockUI();
        },
        error: function (result) {
            alert("error");
            jQuery.unblockUI();

        }
    });
}

jQuery("#txtVendorGroup").typeahead({
    source: function (query, process) {
        var data = vendorsForAutoComplete
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.CategoryName] = username;
            usernames.push(username.CategoryName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].CategoryID != "0") {
            getCategoryWiseVendors(map[item].CategoryID);
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
           //url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorCategoryWise/?ByBidTypeID=7&CustomerID=" + sessionStorage.getItem('CustomerID') + "&CategoryID=" + categoryID,
            url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorCategoryWise_PEV2/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&CategoryID=" + categoryID,
            cache: false,
            dataType: "json",
            success: function (data) {

                jQuery("#tblvendorlist > tbody").empty();
                var vName = '';
                for (var i = 0; i < data.length; i++) {
                    vName = data[i].VendorName;
                    var str = "<tr><td class='hide'>"+data[i].VendorID+"</td><td><div class=\"checker\" id=\"uniform-chkbidTypes\"><span  id=\"spanchecked\"><input type=\"checkbox\" Onclick=\"Check(this,\'" + vName + "'\,\'" + data[i].VendorID + "'\)\"; id=\"chkvender" + data[i].VendorID + "\" value=" + data[i].VendorID + " style=\"cursor:pointer\" name=\"chkvender\"/></span></div></td><td> " + data[i].VendorName + " </td></tr>";

                    jQuery('#tblvendorlist > tbody').append(str);

                }
                //$("#selectedvendorlistsPrev> tbody > tr").each(function (index) {
                //    InsertQuery = InsertQuery + "select " + sessionStorage.getItem('CurrentBidID') + "," + $.trim($(this).find('td:eq(0)').html()) + "," + $.trim($(this).find('td:eq(2)').html()) + " union all ";
                //});
                if ($("#selectedvendorlists > tbody > tr").length > 0) {
                    $("#selectedvendorlists> tbody > tr").each(function (index) {
                        console.log("vendID > ", $.trim($(this).find('td:eq(0)').html()))
                        $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).prop("disabled", true);
                        $("#chkvender" + $.trim($(this).find('td:eq(0)').html())).closest("span#spanchecked").addClass("checked")
                        
                    });
                }
            }

        });

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

function cloneBid() {
    window.location = 'cloneBid.html?bidTypeId=7';
}

function cancelBidEvent() {
    
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
    for (var i = 0; i < parseInt(quorem) ; i++) {
        ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].UOM + '</li>';
        var z = (parseInt(quorem) + i);
        if (z <= allUOM.length - 1) {
            ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].UOM + '</li>';
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
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
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
function printdataSeaBid(result) {
    var loopcount = result.length; //getting the data length for loop.
    
    var i;
    //var numberOnly = /^[0-9]+$/;
    var numberOnly = /^[0-9]\d*(\.\d+)?$/;
    $("#temptableForExcelDataparameter").empty();
    $("#temptableForExcelDataparameter").append("<tr><th style='width:20%!important;'>Description</th><th>TargetPrice</th><th>MaskVendor</th><th>Remarks</th><th>Quantity</th><th>UOM</th><th>BidStartPrice</th><th>SelectedCurrency</th><th>MinimumDecreament</th><th>DecreamentOn</th>th>LastInvoicePrice</th><th>ItemBidDuration</th><th>ItemStatus</th><th>ShowL1Price</th><th>ShowL1Price</th></tr>");
    // checking validation for each row
    var targetPrice = '';
    var BidstartPrice = 0;
    var minimumdec = 0;
    var LastInvoicePrice = 0;
    var Itembidduration = 0;
    var BidDuration = 0;
    //var MaskL1Price='Y'
    var SelectedCurrency = $('#txtselectedCurrency').val();

    if ($('#txtBidDuration').val() == "") {
        BidDuration = 0
    }
    else {
        BidDuration = $('#txtBidDuration').val();
    }
    
    for (i = 0; i < loopcount; i++) {
        //alert($.trim(result[i].ItemBidDuration.trim()))
        
        if ($.trim(result[i].LastInvoicePrice) == '') {
            LastInvoicePrice = 0;
        }
        else {
            LastInvoicePrice = $.trim(result[i].LastInvoicePrice.trim());
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
        if ($.trim(result[i].Description) == '' && $.trim(result[i].Description).length > 200) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Item/Product/Services can not be blank or length should be 200 characters of Item no '+(i + 1)+' . Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        //else if (!result[i].TargetPrice.trim().match(numberOnly) || targetPrice == 0 ) {
        //    $("#error-excelparameter").show();
        //    $("#errspan-excelparameter").html('Target Price should be in numbers only of Item no ' + (i + 1) +'.');
        //    $("#file-excelparameter").val('');
        //    return false;
        //}
        else if ($.trim(result[i].MaskVendor) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Mask Target Price can not be blank of Item no ' + (i + 1) +'. Please fill and upload the file again.');
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
        else if ($.trim(result[i].Remarks) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Remarks can not be blank of Item no ' + (i + 1) +'. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (!result[i].Quantity.trim().match(numberOnly) || result[i].Quantity.trim()=='') {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Quantity should be in numbers only of Item no ' + (i + 1) +'.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].UOM) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Quantity UOM can not be blank of Item no ' + (i + 1) +'. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
       
        else if (!result[i].BidStartPrice.trim().match(numberOnly) || BidstartPrice==0) {
            
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Bid Start Price should be in numbers only of Item no ' + (i + 1) +'.'); 
            $("#file-excelparameter").val('');
            return false;
        }
        else if (!result[i].MinimumDecreament.trim().match(numberOnly) || minimumdec == 0) {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Minimum Decreament Price should be in numbers only of Item no ' + (i + 1) +'.'); 
            $("#file-excelparameter").val('');
            return false;
        }
        
        else if ($.trim(result[i].DecreamentOn) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('DecreamentOn can not be blank of Item no ' + (i + 1) +'. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        } 
        else if ($('#ddlbidclosetype').val() == "S" && $.trim(result[i].ItemBidDuration) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('ItemBidDuration can not be blank of Item no ' + (i + 1) +'. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (parseInt(minimumdec) > parseInt(BidstartPrice)) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Minimum decreament should be less than bid start price of Item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if (parseInt(minimumdec) > parseInt(20) && $.trim(result[i].DecreamentOn) =="P") {
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
        else {
            
            if ($('#ddlbidclosetype').val() == "S") {
                Itembidduration = parseInt($.trim(result[i].ItemBidDuration.trim())) + parseInt(BidDuration)
                ItemStatus = 'Inactive';
            }

            else {
                Itembidduration = parseInt(BidDuration) + 0;
                ItemStatus = 'Open';
             }
            // if values are correct then creating a temp table
            $("<tr><td>" + result[i].Description + "</td><td>" + targetPrice + "</td><td>" + result[i].MaskVendor + "</td><td>" + result[i].Remarks + "</td><td>" + result[i].Quantity + "</td><td>" + result[i].UOM + "</td><td>" + BidstartPrice + "</td><td>" + SelectedCurrency + "</td><td>" + minimumdec + "</td><td>" + result[i].DecreamentOn + "</td><td>" + LastInvoicePrice + "</td><td  id=tditemduration" + i + ">" + Itembidduration + "</td><td>" + ItemStatus + "</td><td>" + result[i].ShowL1Price + "</td><td>" + result[i].ShowStartPrice+"</td></tr>").appendTo("#temptableForExcelDataparameter");
          
        }


    } // for loop ends
    var excelCorrect = 'N';
    var excelCorrectUOM = 'N';
    var ErrorUOMMsz = '';
    var ErrorUOMMszRight = '';
    Rowcount = 0;
    // check for UOM
    $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
        var this_row = $(this);
        excelCorrectUOM = 'N';
        Rowcount = Rowcount + 1;
        for (var i = 0; i < allUOM.length; i++) {
            if ($.trim(this_row.find('td:eq(5)').html()).toLowerCase() == allUOM[i].UOM.trim().toLowerCase()) {//allUOM[i].UOMID
                excelCorrectUOM = 'Y';
            }

        }
        var quorem = (allUOM.length / 2) + (allUOM.length % 2);
        if (excelCorrectUOM == "N") {
            $("#error-excelparameter").show();
            ErrorUOMMsz = 'UOM not filled properly at row no ' + Rowcount + '. Please choose UOM from given below: <br><ul class="col-md-3 text-left">';
            ErrorUOMMszRight = '<ul class="col-md-5 text-left">'
            for (var i = 0; i < parseInt(quorem) ; i++) {
                ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].UOM + '</li>';
                var z = (parseInt(quorem) + i);
                if (z <= allUOM.length - 1) {
                    ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].UOM + '</li>';
                }
            }
            ErrorUOMMsz = ErrorUOMMsz + '</ul>'
            ErrorUOMMszRight = ErrorUOMMszRight + '</ul><div class=clearfix></div><br/>and upload the file again.'

            // alert(ErrorUOMMsz + ErrorUOMMszRight)
            $("#errspan-excelparameter").html(ErrorUOMMsz + ErrorUOMMszRight);
            // $("#errspan-excelparameter").html('UOM not filled properly at row no ' + Rowcount + '. Please choose UOM from given below:');//at row no ' + Rowcount + '.
            return false;
        }

    });
    // check for UOM
    $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
        var this_row = $(this);

        //switch ($.trim(this_row.find('td:eq(5)').html())) {
        //    case 'Kilogram':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Litre':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Number':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Roll':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Sq. Ft.':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Ton':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Meter':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Gallon':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Grams':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Pound':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'KiloMeter':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Set':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Package':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'cm3':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'cm':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Sq cm':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Sq m':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'm3':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Each':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Hour':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Day':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Inch':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Sq Inch':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Month':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Per Ton Per km':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Running Meter':
        //        excelCorrect = 'Y';
        //        break;
        //    case 'Bag':
        //        excelCorrect = 'Y';
        //        break;

        //    default:
        //        excelCorrect = 'F';
        //        $("#error-excelparameter").show();
        //        $("#errspan-excelparameter").html('UOM not filled properly. Please choose UOM from given below: <br/><br/>'
        //            + '<ul class="col-md-3 text-left">'
        //            + '<li>Kilogram</li>'
        //            + '<li>Litre</li>'
        //            + '<li>Roll</li>'
        //            + '<li>Sq. Ft.</li>'
        //            + '<li>Number</li>'
        //            + '<li>Ton</li>'
        //            + '<li>Set</li>'
        //            + '<li> cm3</li >'
        //            + '<li>cm</li>'
        //            + '<li>Sq cm</li>'
        //            + '<li>Sq m</li>'
        //            + '<li>m3</li>'
        //            + '<li>Each</li>'
        //            + '<li>Trips</li>'
        //            + '<li>Bag</li>'
        //            + '</ul>'
        //            + '<ul class="col-md-5 text-left">'
        //            + '<li> Hour</li>'
        //            + '<li>Day</li>'
        //            + '<li>Inch</li>'
        //            + '<li>Sq Inch</li>'
        //            + '<li>Month</li>'
        //            + '<li>Per Ton Per km</li>'
        //            + '<li>Running Meter</li>'
        //            + '<li>Meter</li>'
        //            + '<li>Gallon</li>'
        //            + '<li>Grams</li>'
        //            + '<li>Pound</li>'
        //            + '<li>KiloMeter</li>'
        //            + '<li>Package</li>'
        //             + '<li>Year</li>'
        //            + '</ul><div class=clearfix></div>'
        //            + '<br/>and upload the file again.');
        //        $("#file-excelparameter").val('');
        //        return false;
        //}
        switch ($.trim(this_row.find('td:eq(2)').html())) {
            case 'N':
                excelCorrect = 'Y';
                break;
            case 'Y':
                excelCorrect = 'Y';
                break;
           
            default:
                excelCorrect = 'F';
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Mask Target Price text not filled properly. Please choose Mask TP from given below: <br/><br/>'
                    + '<ul class="col-md-4 text-left">'
                    + '<li>Y for Hide</li>'
                    + '<li>N for Show</li>'
                    + '</ul><div class=clearfix></div>'
                    + '<br/>and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
        }
        switch ($.trim(this_row.find('td:eq(13)').html())) {
            case 'N':
                excelCorrect = 'Y';
                break;
            case 'Y':
                excelCorrect = 'Y';
                break;

            default:
                excelCorrect = 'F';
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Show L1 Price text not filled properly. Please choose Show L1 Price from given below: <br/><br/>'
                    + '<ul class="col-md-4 text-left">'
                    + '<li>Y for Yes</li>'
                    + '<li>N for No</li>'
                    + '</ul><div class=clearfix></div>'
                    + '<br/>and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
        }
        switch ($.trim(this_row.find('td:eq(14)').html())) {
            case 'N':
                excelCorrect = 'Y';
                break;
            case 'Y':
                excelCorrect = 'Y';
                break;

            default:
                excelCorrect = 'F';
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('Show Start Price text not filled properly. Please choose Show Start Price from given below: <br/><br/>'
                    + '<ul class="col-md-4 text-left">'
                    + '<li>Y for Show</li>'
                    + '<li>N for Hide</li>'
                    + '</ul><div class=clearfix></div>'
                    + '<br/>and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
        }
        switch ($.trim(this_row.find('td:eq(9)').html())) {
            case 'A':
                excelCorrect = 'Y';
                break;
            case 'P':
                excelCorrect = 'Y';
                break;

            default:
                excelCorrect = 'F';
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('DecreamentOn not filled properly. Please choose DecreamentOn from given below: <br/><br/>'
                    + '<ul class="col-md-4 text-left">'
                    + '<li>A for Amount</li>'
                    + '<li>P for %age</li>'
                    + '</ul><div class=clearfix></div>'
                    + '<br/>and upload the file again.');
                $("#file-excelparameter").val('');
                return false;
        }
    });


    if (excelCorrect == 'Y' && excelCorrectUOM=='Y') {
        $('#btnyesno').show();
        $("#error-excelparameter").hide();
        $("#errspan-excelparameter").html('');
        $("#success-excelparameter").show()
        $("#succspan-excelparameter").html('Excel file is found ok. Do you want to upload? \n This will clean your existing Data.')
        $("#file-excelparameter").val('');
        excelCorrect = '';
        excelCorrectUOM = '';
    }
}
function InsupdProductfromExcel() {
    $("#success-excelparameter").hide();
    $("#error-excelparameter").hide();
    $('#loader-msgparameter').html('Processing. Please Wait...!');
    $('#modalLoaderparameter').removeClass('display-none');
    var BidDuration = 0;
    BidDuration = $('#txtBidDuration').val();
    
    var rowCount = jQuery('#temptableForExcelDataparameter tr').length;
    if (rowCount > 0) {
        PriceDetails = '';
        $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
            var this_row = $(this);
            PriceDetails = PriceDetails + 'insert into BidSeaExportDetails(BidID,DestinationPort,Targetprice,MaskVendor,Remarks,Quantity,UOM,CeilingPrice,SelectedCurrency,MinimumDecreament,DecreamentOn,LastInvoicePrice,ItemBidDuration,ItemStatus,MaskL1Price,ShowStartPrice) values('
            var remark = $.trim(this_row.find('td:eq(3)').html()).replace(/'/g, "");
            PriceDetails = PriceDetails + sessionStorage.getItem('CurrentBidID') + ",'" + $.trim(this_row.find('td:eq(0)').html()) + "'," + $.trim(this_row.find('td:eq(1)').html()) + ",'" + $.trim(this_row.find('td:eq(2)').html()) + "','" + remark + "'," + $.trim(this_row.find('td:eq(4)').html()) + ",'" + this_row.find('td:eq(5)').html() + "'," + $.trim(this_row.find('td:eq(6)').html()) + ",'" + this_row.find('td:eq(7)').html() + "'," + $.trim(this_row.find('td:eq(8)').html()) + ",'" + $.trim(this_row.find('td:eq(9)').html()) + "'," + $.trim(this_row.find('td:eq(10)').html()) + "," + $.trim(this_row.find('td:eq(11)').html()) + ",'" + $.trim(this_row.find('td:eq(12)').html()) + "','" + $.trim(this_row.find('td:eq(13)').html()) + "','" + $.trim(this_row.find('td:eq(14)').html())+"')";
            if ($('#ddlbidclosetype').val() == "A") {
               
                BidDuration = BidDuration + 0;
            }
            else {
                BidDuration = BidDuration + parseInt($.trim(this_row.find('td:eq(11)').html()))
               
            }

        })
       
        var Tab2data = {
            "PriceDetails": PriceDetails,
            "BidID": sessionStorage.getItem('CurrentBidID'),
            "UserID": sessionStorage.getItem('UserID'),
            "BidDuration": BidDuration,
            "BidClosetype": $('#ddlbidclosetype option:selected').val()

        };
       // alert(JSON.stringify(Tab2data))
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "ConfigureBid/ConfigureBidInsSeaExportTab2/",
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {
                if (data[0].BidID > 0) {
                   
                    $('#btnyesno').hide()
                    $("#success-excelparameter").show()
                    $("#succspan-excelparameter").html('Excel file uploaded sucessfully')
                    setTimeout(function () {
                        $('#modalLoaderparameter').addClass('display-none');
                        $('#RAexcel').modal('hide');
                        fetchSeaExportDetails();
                    }, 1000)
                    return true;
                }
                else {
                    return false;

                }

            },
            error: function (result) {
                //  alert(status)
                $('#modalLoaderparameter').addClass('display-none');
                $("#error-excelparameter").show();
                $("#errspan-excelparameter").html('You have error. Please try again.');
                return false;
            }

        });
    }
    else {
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html('No Items Found in Excel');
    }
}
function fetchRFIRFQSubjectforReport(subjectFor) {

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/fetchRFIRFQSubjectforReport/?SubjectFor=" + subjectFor + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID'))+"&CustomerID=" + sessionStorage.getItem('CustomerID'),
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            sessionStorage.setItem('hdnRfiRfqSubject', JSON.stringify(data));
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
            map[commonsubject.RFIRFQSubject] = commonsubject;
            Subject.push(commonsubject.RFIRFQSubject);
        });

        process(Subject);

    },
    minLength: 2,
    updater: function (item) {
       // $('#ddlrfqVersion').empty();
        if (map[item].RfiRfqID != '0') {
            $('#hdnRfiRfqID').val(map[item].RfiRfqID);
           // $('#ddlrfqVersion').append('<option  value=' + map[item].Version + ' >' + map[item].Version + '</option>');
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
        }, 5000);
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
function populatetablewithRFQData() {
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchRFQParametersRAItems/?RFQID=" + $('#hdnRfiRfqID').val() + "&Version=0" ,// Version is optional if required will use.
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            if (data.length > 0) {
                jQuery("#tblServicesProduct").empty();
                jQuery("#tblServicesProductPrev").empty();
                if (data[0].RFQRemark != "") {
                    for (var i = 0; i < data.length; i++) {
                        var decrementon = ''
                        //if (BidData[0].BidSeaExportDetails[i].DecreamentOn == 'A')
                        decrementon = 'Amount'
                        // else
                        //   decrementon = '%age'
                        if (!jQuery("#tblServicesProduct thead").length) {
                            jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th style='width:10%!important;'></th><th  style='width:20%!important;'>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last Invoice Price</th><th class=itemclass>Bid Duration (in mins)</th><th>Show L1 Price</th><th>Show Start Price</th></tr></thead>");
                            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:10%!important;"><button class="btn  btn-xs btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:20%!important;">' + data[i].RFQShortName + '</td><td>' + data[i].RFQRemark + '</td><td class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[i].RFQQuantity) + '</td><td>' + data[i].RFQUOM + '</td><td class=text-right>' + thousands_separators(data[i].RFQBidStartPrice) + '</td><td>Y</td><td class=text-right>' + thousands_separators(data[i].MinimumdecreamentOn) + '</td><td>' + decrementon + '</td><td class=hide>A</td><td class=text-right>' + thousands_separators(data[i].RFQLastInvoicePrice) + '</td><td class="itemclass text-right">' + 0 + '</td><td>N</td><td>Y</td></tr>');
                        }
                        else {
                            jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td style="width:10%!important;"><button class="btn  btn-xs btn-success" onclick="editvalues(trid' + i + ',tridPrev' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ',tridPrev' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:20%!important;">' + data[i].RFQShortName + '</td><td>' + data[i].RFQRemark + '</td><td class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[i].RFQQuantity) + '</td><td>' + data[i].RFQUOM + '</td><td class=text-right>' + thousands_separators(data[i].RFQBidStartPrice) + '</td><td>Y</td><td class=text-right>' + thousands_separators(data[i].MinimumdecreamentOn) + '</td><td>' + decrementon + '</td><td class=hide>A</td><td class=text-right>' + thousands_separators(data[i].RFQLastInvoicePrice) + '</td><td class="itemclass text-right">' + 0 + '</td><td>N</td><td>Y</td></tr>');

                        }
                        $('#wrap_scroller').show();

                        if (!jQuery("#tblServicesProductPrev thead").length) {

                            jQuery("#tblServicesProductPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Description</th><th>Remarks</th><th>Target Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Mask Target Price</th><th>Minimum Decrement</th><th>Decrement On</th><th>Last Invoice Price</th><th class=itemclass>Item Bid Duration(Minutes)</th><th>Show L1 Price</th><th>Show Start Price</th></tr></thead>");
                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + data[i].RFQShortName + '</td><td>' + data[i].RFQRemark + '</td><td class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[i].RFQQuantity) + '</td><td>' + data[i].RFQUOM + '</td><td class=text-right>' + thousands_separators(data[i].RFQBidStartPrice) + '</td><td>Y</td><td class=text-right>' + thousands_separators(data[i].MinimumdecreamentOn) + '</td><td>' + decrementon + '</td><td class=hide>A</td><td class=text-right>' + thousands_separators(data[i].RFQLastInvoicePrice) + '</td><td class="itemclass text-right">' + 0 + '</td><td>N</td><td>N</td></tr>');

                            totalitemdurationstagger = totalitemdurationstagger + parseInt(0);

                        } else {

                            jQuery("#tblServicesProductPrev").append('<tr id=tridPrev' + i + '><td>' + data[i].RFQShortName + '</td><td>' + data[i].RFQRemark + '</td><td class=text-right>' + thousands_separators(data[i].RFQTargetPrice) + '</td><td class=text-right>' + thousands_separators(data[i].RFQQuantity) + '</td><td>' + data[i].RFQUOM + '</td><td class=text-right>' + thousands_separators(data[i].RFQBidStartPrice) + '</td><td>Y</td><td class=text-right>' + thousands_separators(data[i].MinimumdecreamentOn) + '</td><td>' + decrementon + '</td><td class=hide>A</td><td class=text-right>' + thousands_separators(data[i].RFQLastInvoicePrice) + '</td><td class="itemclass text-right">' + 0 + '</td><td>N</td><td>N</td></tr>');
                            totalitemdurationstagger = totalitemdurationstagger + parseInt(0);

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
                    jQuery('#divalertpull').slideDown('show');
                    $('#spansuccess1pull').text('Data pulled successfully.')

                    setTimeout(function () {
                        jQuery('#divalertpull').css('display', 'none');
                        jQuery('#RFQPullData').modal('hide');
                    }, 5000);
                    jQuery.unblockUI();
                    return true;
                }
                else {
                    jQuery('#divalerterrpull').slideDown('show');
                    $('#spanerterrpull').text('The RFQ is not configured for Reverse Auction!!!')
                    setTimeout(function () {
                        jQuery('#divalerterrpull').css('display', 'none');
                    }, 5000);
                    jQuery.unblockUI();
                    return false;
                }
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

            setTimeout(function () {
                jQuery('#divalerterrpull').css('display', 'none');
            }, 5000);
            jQuery.unblockUI();
            return false;
           
        }
               
        });
   
}
$("#RFQPullData").on("hidden.bs.modal", function () {
    $("#txtrfirfqsubject").val('')
    $('#hdnRfiRfqID').val(0);
   
});