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

function onlyNumberKey(evt) {

    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}
function callPagejs(pagejs) {
    
    var locale = sessionStorage.getItem("localcode")
    var js = [];
    /*if(pagejs == 'ConfigureBidSeaExport.js' || pagejs == 'configurefrench.js' || pagejs == 'PeFa.js' || pagejs == 'ConfigureBidCoalExport.js')
    {
      js = ["assets/global/plugins/bootstrap-datepicker/js/locales/bootstrap-datepicker."+locale+".js?v=" + Math.random(),"assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker."+locale+".js?v=" + Math.random()];
    }*/

    js.push("assets/CustomJS/Auction.js?v=" + Math.random());
    var Pages = pagejs.split(',')
    for (var i = 0; i < Pages.length; i++) {
        js.push("assets/CustomJS/" + Pages[i] + "?v=" + Math.random());
    }
    var $head = $("head");
   
    for (var i = 0; i < js.length; i++) {
        $head.append("<script src=\"" + js[i] + "\"></scr" + "ipt>");
    }

    /* if(pagejs == 'ConfigureBidSeaExport.js' || pagejs == 'configurefrench.js' || pagejs == 'PeFa.js' || pagejs == 'ConfigureBidCoalExport.js')  
        {
          handleDateTimepicker(locale);
        }*/
}
function handleDateTimepicker(locale) {

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