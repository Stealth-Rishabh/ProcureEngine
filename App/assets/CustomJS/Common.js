var apiURL = sessionStorage.getItem("APIPath");
var token = sessionStorage.getItem("Token");
var UserID = sessionStorage.getItem('UserID');
var Mainurl = sessionStorage.getItem('MainUrl');
var CurrentCustomer = sessionStorage.getItem("CustomerID");
var LoadingMessage = '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>';
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