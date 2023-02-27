jQuery(document).ready(function () {
    //FROM HTML
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

    App.init();
    setCommonData();
    fetchMenuItemsFromSession(9, 10);   
    fetchBidType();// for serach vendor
    fetchCountry();
    //abheedev 25/11/2022
    $('#ddlCountry').select2({
        searchInputPlaceholder: "Search Country",
    })
    $('#ddlCountryCd').select2({
        searchInputPlaceholder: "Dialing Code",
        //allowClear: true
    });

    $('#ddlCountryCdPhone').select2({
        searchInputPlaceholder: "Dialing Code",
        // allowClear: true
    });

    $('#ddlState').select2({
        searchInputPlaceholder: "Search State",
        allowClear: true
    }).on('change', function () { $(this).valid(); });
    $('#ddlCity').select2({
        searchInputPlaceholder: "Search City",
        allowClear: true
    }).on('change', function () { $(this).valid(); });
    $('#ddlpreferredTime').select2().on('change', function () { $(this).valid(); });
    //***********


});



//invite vendor

function routeToInviteVendor() {
    window.location.href = "InviteVendor.html";
}

function routeToRegisterParticipant() {
    window.location.href = "registerParticipants_PEV2.html";
}

// Define an array to store the entered email ids
let emailIds = [];
let i = 1;
// Get the input and button elements from the HTML
const inputInviteVendor = document.getElementById("txtInviteVendor");
$("#emailTable").hide();
$("#btnvendorsumbit").hide();

// Add email of vendor
$("#addbtnvendor").click(function () {
    debugger

    const email = $("#txtInviteVendor").val().trim();

    if (isValidEmail(email)) {

        emailIds.push(email);



        $("#txtInviteVendor").val("")
        $("#emailTable").show();
        $("#btnvendorsumbit").show();
        // Add a new row to the email table

        jQuery("#emailTable").append('<tr id=trAppid' + i + '><td>' + i + '</td><td>' + email + '</td></tr>');

        i = i + 1
    }
});

// Function to validate an email address
function isValidEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    if (emailRegex.test(email)) {
        return true;
    } else {
        bootbox.alert("Please enter a valid email address.");
        return false;
    }
}

//invite vendor to register
function InviteVendorsToRegister() {
    debugger
    let TabDet = [];
    let custId = parseInt(sessionStorage.getItem('CustomerID'));
    console.log(sessionStorage.getItem("APIPath") + "VendorLCM/InviteVendorsToRegister/?Id=" + custId)
    for (var i = 0; i < emailIds.length; i++) {
        let Vemail = {
            "Email": emailIds[i]
        }
        TabDet.push(Vemail)
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/InviteVendorsToRegister/?Id=" + custId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        async: false,
        crossDomain: true,
        data: JSON.stringify(TabDet),
        dataType: "json",
        success: function (data) {

            debugger;
            alert('YES!!!!')
        },
        error: function (xhr, status, error) {
            debugger
            alert(error.toString())
        }
    });
}

/*function InviteVendorsToRegister() {
    debugger;
    var TabDet = [];
    var custId = parseInt(sessionStorage.getItem('CustomerID'));
    for (var i = 0; i < 5; i++) {
        var Vemail = {
            "Email": "bac" + i + "@abc.com"
        }
        TabDet.push(Vemail)
    }

    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorLCM/InviteVendorsToRegister/?Id=" + custId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        async: false,
        crossDomain: true,
        data: JSON.stringify(TabDet),
        dataType: "json",

        success: function (data) {
            debugger;
            alert('YES!!!!')
        },
        error: function (xhr, status, error) {
            debugger
            alert(error.toString())
        }
    });
}*/