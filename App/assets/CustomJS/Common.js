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






/*

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

        removeMaskOnSubmit:true,

        //autoUnmask: true

    }
);*/
//abheedev bug 385
function localecommaseperator(ele)
{
    debugger
 
    var str = ele.value;

    if (str == NaN || str == '')
    {
        str = 0;
        $(ele).val("")
    }
   str= str.replaceAll(',', "")
    console.log(str)
   
    str = parseFloat(str);
    console.log(str)


    console.log(str.toLocaleString('en-IN'));
    $(ele).val(str.toLocaleString('en-IN'))

}

//abheedev bug 385



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

function SearchInGridview(tableName,value) {
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
function bindApproverMaster(edit) {
  
    var url = "NFA/FetchApproverMaster?CustomerId=" + parseInt(CurrentCustomer) + "&UserID=" + encodeURIComponent(UserID);

    var GetData = callajaxReturnSuccess(url, "Get", {});
    GetData.success(function (res) {
           
        if (res.result.length != null) {
            $('#tblAllmatrix').empty();
            if (res.result.length > 0) {
                Approvermasterdata = res.result;
              if (edit=='Y')
                $('#tblAllmatrix').append("<thead><th></th><th>Purchase Org</th><th>Purchase Group</th><th>Amount From</th><th>Amount To</th><th>Approval type</th><th>Condition</th><th>Deviation %</th></thead>")
               else
                 $('#tblAllmatrix').append("<thead><th>Purchase Org</th><th>Purchase Group</th><th>Amount From</th><th>Amount To</th><th>Approval type</th><th>Condition</th><th>Deviation %</th></thead>")

                for (var i = 0; i < res.result.length; i++) {
                  if (edit=='Y')
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