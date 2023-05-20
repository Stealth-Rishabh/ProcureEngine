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

    //abheedev 25/11/2022


});




// Define an array to store the entered email ids
let emailIds = [];
let i = 1;
// Get the input and button elements from the HTML
const inputInviteVendor = document.getElementById("txtInviteVendor");
$("#emailTable").hide();
$("#createdEmailTable").hide();
$("#notCreatedEmailTable").hide();
$("#btnvendorsumbit").hide();

// Add email of vendor
$("#addbtnvendor").click(function () {
    debugger
    const email = $("#txtInviteVendor").val().trim();

    if (isValidEmail(email)) {

        if (!emailIds.includes(email)) {
            emailIds.push(email);

        }
        else {
            bootbox.alert("email address is already added");
            $("#txtInviteVendor").val("");
            return false;
        }

        $("#txtInviteVendor").val("")
        $("#emailTable").show();

        // Add a new row to the email table
        if (jQuery("#emailTable tbody tr").length < 1) {
            i = 0;
        }
        jQuery("#emailTable").append('<tr id=trAppid' + i + '><td>' + (i + 1) + '</td><td>' + email + '</td></tr>');
        $("#btnvendorsumbit").show();
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
            $("#emailTable tbody").empty();
            $("#createdEmailTable tbody").empty();
            $("#notCreatedEmailTable tbody").empty();
            $("#emailTable").hide();

            $("#btnvendorsumbit").hide();
            let createdVendorList = data.createdVendorList || "";
            let notCreatedVendor = data.notCreatedVendor;

            if (createdVendorList.length > 0 && createdVendorList != "") {
                for (let i = 0; i < createdVendorList.length; i++) {
                    $("#createdEmailTable").show();

                    jQuery("#createdEmailTable").append('<tr id=trCEAppid' + i + '><td>' + (i + 1) + '</td><td>' + createdVendorList[i].email + '</td></tr>');

                }
            }
            if (notCreatedVendor.length > 0) {
                for (let i = 0; i < notCreatedVendor.length; i++) {
                    $("#notCreatedEmailTable").show();
                    jQuery("#notCreatedEmailTable").append('<tr id=trNCEAppid' + i + '><td>' + (i + 1) + '</td><td>' + notCreatedVendor[i].email + '</td><td>' + notCreatedVendor[i].message + '</td></tr>');

                }
            }
            emailIds.length = 0
            bootbox.alert('Check email invitation status below')
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