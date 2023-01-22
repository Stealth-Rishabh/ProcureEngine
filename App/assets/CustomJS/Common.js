var apiURL = sessionStorage.getItem("APIPath");
var token = sessionStorage.getItem("Token");
var UserID = sessionStorage.getItem('UserID');
var Mainurl = sessionStorage.getItem('MainUrl');
var CurrentCustomer = sessionStorage.getItem("CustomerID");
var LoadingMessage = '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>';
var DefaultCurrency = sessionStorage.getItem("DefaultCurrency");

$('.MaxLength').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});


$(".thousandsep").inputmask(
    {
        alias: "decimal",

        rightAlign: false,

        numericInput: true,

        groupSeparator: ",",

        radixPoint: ".",

        autoGroup: true,

        integerDigits: 40,

        digitsOptional: true,

        allowPlus: false,

        allowMinus: false,

        clearMaskOnLostFocus: true,

        supportsInputType: ["text", "tel", "password"],

        removeMaskOnSubmit: true,

        //autoUnmask: true

    }
);




CommonGenricAjax = function (url, type, data, async, token) {
    return $.ajax({
        url: apiURL + url,
        type: type,
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(data),
        async: async,
        cache: false,
        crossDomain: true,
        error: function () {
            //callback();
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token + "");
        }
    });
}

callajaxReturnSuccessAsync = function (url, type, data, token) {
    return $.ajax({
        url: apiURL + url,
        type: type,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        async: true,
        cache: false,
        crossDomain: true,
        error: function () {
            //callback();
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token + "");
        }
    });
}

//GeneralUtilities = {
callajaxReturnSuccess = function (url, type, data) {
    return $.ajax({
        url: apiURL + url,
        type: type,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        async: false,
        cache: false,
        crossDomain: true,
        error: function () {
            //callback();
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token + "");
        }
    });
};

function SearchInGridview(tableName, value) {
    $("#" + tableName + " tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = value; //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        $("#" + tableName + " tr:has(td)").show();
        return false;
    }

    $("#" + tableName + " tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
}

//abheedev bug 385
//bug 569 abheedev 01/12/2022
function localecommaseperator(ele) {
    var regex = /[^\d,]+/g
    var str = ele.value;
    if ((regex.test(str))) {
        str = "";
        $(ele).val("")
    }
    str = str.replaceAll(',', "")
    if (str != "") {
        str = parseFloat(str);
    }
    $(ele).val(str.toLocaleString(sessionStorage.getItem("culturecode")))

}

//abheedev bug 385
function bindApproverMaster(edit) {

    var url = "NFA/FetchApproverMaster?CustomerId=" + parseInt(CurrentCustomer) + "&UserID=" + encodeURIComponent(UserID);

    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {

        if (res.result.length != null) {
            $('#tblAllmatrix').empty();
            if (res.result.length > 0) {
                Approvermasterdata = res.result;
                if (edit == 'Y')
                    $('#tblAllmatrix').append("<thead><th></th><th>Purchase Org</th><th>Purchase Group</th><th>Amount From</th><th>Amount To</th><th>Approval type</th><th>Condition</th><th>Deviation %</th></thead>")
                else
                    $('#tblAllmatrix').append("<thead><th>Purchase Org</th><th>Purchase Group</th><th>Amount From</th><th>Amount To</th><th>Approval type</th><th>Condition</th><th>Deviation %</th></thead>")

                for (var i = 0; i < res.result.length; i++) {
                    if (edit == 'Y')
                        $('#tblAllmatrix').append('<tr><td><button class="btn btn-xs btn-success " href="javascript:;" onClick="GetApprovermasterbyId(' + res.result[i].idx + ')"><i class="fa fa-pencil" ></i></button></td><td>' + res.result[i].orgName + '</td><td>' + res.result[i].groupName + '</td><td>' + thousands_separators(res.result[i].amountFrom) + '</td><td>' + thousands_separators(res.result[i].amountTo) + '</td><td>' + res.result[i].approvalType + '</td> <td>' + res.result[i].conditionName + '</td>  <td>' + res.result[i].deviation + '</td></tr>');
                    else
                        $('#tblAllmatrix').append('<tr><td>' + res.result[i].orgName + '</td><td>' + res.result[i].groupName + '</td><td>' + thousands_separators(res.result[i].amountFrom) + '</td><td>' + thousands_separators(res.result[i].amountTo) + '</td><td>' + res.result[i].approvalType + '</td> <td>' + res.result[i].conditionName + '</td>  <td>' + res.result[i].deviation + '</td></tr>');

                }
            }
            else {
                $('#tblAllmatrix').append('<tr><td>No Matrix Found</td></tr>');
            }
        }
    });
    GetData.error(function (res) {

    });

};
function numberonly() {
    $(".numberonly").keyup(function () {
        $(".numberonly").val(this.value.match(/[0-9]*/));
    });
}
function onlyNumberKey(evt) {
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}
function callPagejs(pagejs) {

    var js = [];
    js.push("assets/CustomJS/Auction.js?v=" + Math.random());
    var Pages = pagejs.split(',')
    for (var i = 0; i < Pages.length; i++) {
        js.push("assets/CustomJS/" + Pages[i] + "?v=" + Math.random());
    }
    var $head = $("head");

    for (var i = 0; i < js.length; i++) {
        $head.append("<script src=\"" + js[i] + "\"></scr" + "ipt>");
    }

}
function handleDateTimepicker(locale) {
    //var locale = sessionStorage.getItem("localcode")
    //var tz = moment().tz('Asia/Baghdad').format();
    //alert(GetCurrentDateTime())

    //var theStDate = new Date()
    // var newYork    = moment.tz(theStDate, "Asia/Baghdad");
    // theStDate   =newYork.format()          
    // theStDate = new Date(newYork.format() + ' UTC');

    /*  if (sessionStorage.getItem('preferredtimezone') != null) {
          theStDate = theStDate.toLocaleString("ar", {
              timeZone: sessionStorage.getItem('preferredtimezone'), dateStyle: "long", hourCycle: "h24", timeStyle: "short"
          })
          
      }
      else {
          theStDate = theStDate.toLocaleString("en-GB", {
              dateStyle: "long", hourCycle: "h24", timeStyle: "short"
          })

      }*/
    if (jQuery().datepicker) {
        $('.date-picker').datepicker({
            locale: locale,
            language: locale,
            //startDate: theStDate
        });
        $(".form_datetime").datetimepicker({
            locale: locale,
            language: locale,
            // startDate: theStDate
        });

        $(".form_meridian_datetime").datetimepicker({
            locale: locale,
            language: locale,
            //startDate: theStDate
        });
        //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
    }
}

function setCommonData() {
    jQuery('#spanUserName').html(sessionStorage.getItem('UserName'))
    jQuery('#liHome').html('<i class="fa fa-home"></i><a href=' + sessionStorage.getItem('HomePage') + '>Home</a><i class="fa fa-angle-right"></i>')
}

function fetchCountry() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/Country/?CountryID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlCountry").empty();
            $("#ddlCountryCd").empty();
            $("#ddlCountryCdPhone").empty();
            var vlal = new Array();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCountry").append("<option value=" + data[i].countryID + ">" + data[i].countryName + "</option>");
                    $("#ddlCountryCd").append(jQuery("<option></option>").val(data[i].countryID).html(data[i].dialingCode));
                    $("#ddlCountryCdPhone").append("<option value=" + data[i].countryID + ">" + data[i].dialingCode + "</option>");
                }

                $("#ddlCountry").val('111').trigger("change");

                $("#ddlCountryCd").val('111');
                $("#ddlCountryCdPhone").val('111');



            }
            else {
                $("#ddlCountry").append('<tr><td>No countries found..</td></tr>');
            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
        }

    });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchTimezoneLst/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            let lstTZ = JSON.parse(data[0].jsondata);

            jQuery("#ddlpreferredTime").empty();
            jQuery("#ddlpreferredTime").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < lstTZ.length; i++) {

                jQuery("#ddlpreferredTime").append(jQuery("<option ></option>").val(lstTZ[i].id).html(lstTZ[i].timezonelong));
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}

function fetchState() {

    var countryid = $('#ddlCountry option:selected').val();
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/State/?CountryID=" + countryid + "&StateID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlState").empty();
            if (data.length > 0) {

                $("#ddlState").append("<option value=0>Select State</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddlState").append("<option value=" + data[i].stateID + ">" + data[i].stateName + "</option>");
                }
                //   $("#ddlState").trigger("change");
            }
            else {
                $("#ddlState").append('<tr><td>No state found..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
        }

    });
}

function fetchCity() {

    var stateid = $('#ddlState').val();
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "CustomerRegistration/City/?StateID= " + stateid + "&CityID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            $("#ddlCity").empty();
            if (data.length > 0) {
                $("#ddlCity").append("<option value=0>Select City</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#ddlCity").append("<option value=" + data[i].cityID + ">" + data[i].cityName + "</option>");
                }
                //   $("#ddlCity").val('0').trigger("change");
            }
            else {
                $("#ddlCity").append('<tr><td>No city found..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
        }

    });
}

function fetchProduct() {
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchProducts?CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#ddlProduct").empty();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#ddlProduct").append("<option value=" + data[i].productID + ">" + data[i].productName + "</option>");
                }
                //$("#ddlProduct").trigger("change");
            }
            else {
                $("#ddlProduct").append('<tr><td>No products found..</td></tr>');
            }

        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
        }

    });
}

function fetchMasters() {
    $('#ddlTypeofProduct').select2({
        placeholder: "Type of Product"
        //allowClear: true
    });

    $('#ddlCountry').select2({
        searchInputPlaceholder: "Search Country",

    });

    $('#ddlState').select2({
        searchInputPlaceholder: "Search State",
        allowClear: true
    });
    $('#ddlCity').select2({
        searchInputPlaceholder: "Search City",
        allowClear: true
    });

    $("#ddlTds").select2({
        searchInputPlaceholder: "Search",
        allowClear: true
    });
    $("#ddPayTerms").select2({
        searchInputPlaceholder: "Search",
        allowClear: true
    });
    jQuery.blockUI({ message: '<h5><img src="../assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRequest/FetchMasters?CustomerID=1",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#ddlCountry").empty();

            if (data.result.lstCountry.length > 0) {

                for (var i = 0; i < data.result.lstCountry.length; i++) {
                    $("#ddlCountry").append("<option value=" + data.result.lstCountry[i].countryID + ">" + data.result.lstCountry[i].countryName + "</option>");
                    jQuery("#ddlCountryCd").append("<option value=" + data.result.lstCountry[i].countryID + ">" + data.result.lstCountry[i].dialingCode + "</option>");
                    jQuery("#ddlCountryAltCd").append("<option value=" + data.result.lstCountry[i].countryID + ">" + data.result.lstCountry[i].dialingCode + "</option>");

                }
                $("#ddlCountry").val('111').trigger("change");
            }
            else {
                $("#ddlCountry").append('<tr><td>No countries found..</td></tr>');
            }


            $("#ddlTypeofProduct").empty();

            if (data.result.lstProductCategoryMaster.length > 0) {
                for (var i = 0; i < data.result.lstProductCategoryMaster.length; i++) {
                    $("#ddlTypeofProduct").append("<option value=" + data.result.lstProductCategoryMaster[i].categoryID + ">" + data.result.lstProductCategoryMaster[i].categoryName + "</option>");
                }
            }
            else {
                $("#ddlTypeofProduct").append('<tr><td>No categories found..</td></tr>');
            }

            $("#ddPayTerms").empty();
            if (data.result.lstPaymentTerm.length > 0) {

                $("#ddPayTerms").append("<option value=0>Select Payment Terms</option>");
                for (var i = 0; i < data.result.lstPaymentTerm.length; i++) {
                    $("#ddPayTerms").append("<option value=" + data.result.lstPaymentTerm[i].termID + ">" + data.result.lstPaymentTerm[i].paymentTerm + "</option>");
                }
                $("#ddPayTerms").val('0').trigger("change");
            }
            else {
                $("#ddPayTerms").append('<tr><td>No payment terms found..</td></tr>');
            }

            $("#ddlTds").empty();
            if (data.result.lstTDS.length > 0) {

                $("#ddlTds").append("<option value=0>Select Type of TDS</option>");
                for (var i = 0; i < data.result.lstTDS.length; i++) {
                    $("#ddlTds").append("<option value=" + data.result.lstTDS[i].tdsID + ">" + data.result.lstTDS[i].tds + "</option>");
                }
                $("#ddlTds").val('0').trigger("change");
            }
            else {
                $("#ddlTds").append('<tr><td>No tds found..</td></tr>');
            }

        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            return false;
            jQuery.unblockUI();
        }

    });
}


function prefferedTimezone() {


    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchTimezoneLst/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

            let lstTZ = JSON.parse(data[0].jsondata);

            jQuery("#ddlpreferredTime").empty();
            jQuery("#ddlpreferredTime").append(jQuery("<option></option>").val("").html("Select"));
            for (var i = 0; i < lstTZ.length; i++) {

                jQuery("#ddlpreferredTime").append(jQuery("<option></option>").val(lstTZ[i].id).html(lstTZ[i].timezonelong));
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spanerror1', '');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}



function CheckOnlineStatus(msg) {


    var condition = navigator.onLine ? "ONLINE" : "OFFLINE";
    if (condition == "OFFLINE") {

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-bottom-full-width",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        toastr.error('Please check your Internet Connection!', 'Opps, May be you are Offline!')


    }
    else {

    }

}

function Pageloaded() {

    CheckOnlineStatus("load");
    document.body.addEventListener("offline", function () {

        CheckOnlineStatus("offline")
    }, false);
    document.body.addEventListener("online", function () {

        CheckOnlineStatus("online")

    }, false);
}
function getCurrentFinancialYear() {
    var financial_year = "";
    var today = new Date();
    if ((today.getMonth() + 1) <= 3) {
        financial_year = (today.getFullYear() - 2) + "-" + (today.getFullYear() - 1)
    } else {
        financial_year = (today.getFullYear() - 1) + "-" + (today.getFullYear())
    }
    return financial_year;
}
function getlastFinancialYear() {
    var financial_year = "";
    var today = new Date();
    financial_year = (today.getFullYear() - 2) + "-" + (today.getFullYear() - 1)
    return financial_year;
}
var code = {

    encryptMessage: function (messageToencrypt, secretkey) {
        var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
        return encryptedMessage.toString();
    },
    decryptMessage: function (encryptedMessage, secretkey) {
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
        var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

        return decryptedMessage;
    }
}
//var key = 'MAKV2SPBNI99212';
function fnEnryptURL(URL) {

    var hashes = URL.slice(URL.indexOf('?') + 1)//.split('&')
    var encryptedstring = encrypt(hashes)
    var url = URL.split("?")[0] + "?param=" + encryptedstring
    return url;
}

var key = CryptoJS.enc.Utf8.parse('8080808080808080');
var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
function fnencrypt(message) {
    var encryptedtext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(message), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return (encryptedtext)
}
function fndecrypt(message) {

    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

    var dncryptedpassword = CryptoJS.AES.decrypt(message, key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })

    return (dncryptedpassword.toString(CryptoJS.enc.Utf8))

}
var Base64 = {

    _keyStr: "MAKV2SPBNI99212",
    encode: function (e) {
        var t = ""; var n, r, i, s, o, u, a; var f = 0;
        e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) }
        return t
    },
    decode: function (e) {
        var t = ""; var n, r, i; var s, o, u, a; var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t
    },
    _utf8_encode: function (e) {
        e = e.toString().replace(/rn/g, "n");
        var t = ""; for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) }
        } return t
    },
    _utf8_decode: function (e) {
        var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t
    }
}
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


