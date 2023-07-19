let gstflag=true;
sessionStorage.clear();

sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');
//setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');



var Token = '';
var APIPath = sessionStorage.getItem("APIPath");
fetchMapCategory('M', 0);

jQuery(document).ready(function () {
   
   if(window.location.search){
          var param = getUrlVars()["param"] 
          $('#txtEmail').val(param)
         $('#txtEmail').attr("disabled", "disabled");
          fnOpenRegisterUser() 
     
   }
     else{
         $('#txtEmail').removeAttr("disabled")
     }
   
})


var Login = function () {

    var handleLogin = function () {

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "Username is required."
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit   
                $('#alrt1').show();
                $('#alertmessage1').html('User name/ Password cannot be blank.')
                //App.scrollTo($('#alrt1'), -200);
                $('#alrt1').fadeOut(5000);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {

                //alert(APIPath)
                validateUser();
            }
        });

        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }
    var handleForgetPassword = function () {
        $('.forget-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required: true,
                    email: true
                },
                drpUsertype: {
                    required: true

                },
                bid: {
                    required: true

                }

            },

            messages: {
                email: {
                    required: function (element) {
                        $('#alrt2').show();
                        $('#alertmessage2').html('Email Id can not be blank.');
                        $('#alrt2').fadeOut(6000);
                    },
                    email: function (element) {
                        $('#alrt2').show();
                        $('#alertmessage2').html('Please enter valid email.');
                        $('#alrt2').fadeOut(6000)
                    }
                }

            },

            invalidHandler: function (event, validator) { //display error alert on form submit   

            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                Changeforgotpasswordfn();

            }
        });
    }

    function validateUser() {
        
      
        sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');
        var path = window.location.pathname;
        var url = '';
        var lastPart = (path.substr(path.length - (path.length - 1))).slice(0, -1);
        //lastPart = 'vendor'
        var LinkUrl = window.location.href;
        if (lastPart.toLocaleLowerCase() == "vendor") {
            var pwd = fnencrypt(jQuery("#password").val().trim());
            var encryptedString = pwd.toString();
            var data = {
                "LoginID": jQuery("#username").val().trim(),
                "Password": encryptedString,
                "DeviceType": "Laptop"
            }

            jQuery.ajax({
                url: APIPath + "User/validateUser_Vendor",
                data: JSON.stringify(data),
                type: "POST",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                contentType: "application/json",
                success: function (data) {
                    var successMsg = "";
                    var isSuccess = true;
                    switch (data.responseResult.status) {
                        case 1:
                            successMsg = "SUCCESS"
                            isSuccess = true;
                            sessionStorage.setItem("MainUrl", decodeURIComponent(LinkUrl));
                            sessionStorage.setItem("Token", data.tokenString.accessToken)
                            //fnGetUserBasicDetails(lastPart)
                            sessionStorage.setItem("RefreshToken", data.tokenString.refreshToken);
                            sessionStorage.setItem("IsSSOAuth", "N");
                            sessionStorage.setItem("hasLoggedIn", data.hasLoggedIn);
                            
                            SetSessionItems(lastPart, data.userDetails[0]);
                            break;
                        //case "Your account has been Locked. Please contact administrator.":
                        //    successMsg = "Your account has been Locked. Please contact administrator."
                        //    isSuccess = false;
                        //    break;
                        //case "You have entered an incorrect Password.":
                        //    successMsg = 'Wrong Crendtials' + ' <br>' + 'Provided username and password is incorrect'
                        //    isSuccess = false;
                        //    break;
                        //case "Something went wrong!!! Please contact administrator.":
                        //    successMsg = "Something went wrong!!! Please contact administrator."
                        //    isSuccess = false;
                        //    break;
                        //case "Your account has been Locked due to multiple failed Login attempts.":
                        //    successMsg = "Your account has been Locked due to multiple failed Login attempts."
                        //    isSuccess = false;
                        //    break;
                        //case "User Name does not exists.":
                        //    successMsg = "User Name does not exists."
                        //    isSuccess = false;
                        //    break;
                        default:
                            successMsg = data.responseResult.stausMessage
                            isSuccess = false;
                            break;

                    }
                    if (!isSuccess) {
                        jQuery.unblockUI();
                        $('#alrt1').show();
                        $('#alertmessage1').html(successMsg)
                        //App.scrollTo($('#alrt1'), -200);
                        $('#alrt1').fadeOut(5000);
                    }

                },
                error: function (xhr, status, error) {
                    sessionStorage.setItem("Token", '')
                    jQuery.unblockUI();
                    $('#alrt1').show();
                    $('#alertmessage1').html('Wrong Crendtials' + ' <br>' + 'Provided username and password is incorrect')
                    //App.scrollTo($('#alrt1'), -200);
                    $('#alrt1').fadeOut(5000);
                }
            });

        }
        else {
           
            var userPass = fnencrypt(jQuery("#password").val().trim());
            //var encryptedString = CryptoJS.AES.encrypt(userPass, "8080808080808080").toString();
            //var encryptedString = toUTF8Array(userPass);
            //var decryptedString = (CryptoJS.AES.decrypt(encryptedString, "/")).toString(CryptoJS.enc.Utf8);
            var encryptedString = userPass.toString();
            var data = {
                "LoginID": jQuery("#username").val().trim(),
                //"Password": jQuery("#password").val().trim(),
                "Password": encryptedString,
                "LinkUrl": LinkUrl,
                "DeviceType": "Laptop"
            }
            jQuery.ajax({
                url: APIPath + "User/validate_User",
                data: JSON.stringify(data),
                type: "POST",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                contentType: "application/json",
                success: function (data) {
                    var successMsg = "";
                    var isSuccess = true;
                    switch (data.responseResult.status) {
                        case 1:
                            isSuccess = true;
                            successMsg = "SUCCESS";
                            sessionStorage.setItem("MainUrl", decodeURIComponent(LinkUrl));
                            sessionStorage.setItem("Token", data.tokenString.accessToken);
                            sessionStorage.setItem("RefreshToken", data.tokenString.refreshToken);
                            sessionStorage.setItem("IsSSOAuth", "N");
                           
                            SetSessionItems(lastPart, data.userDetails[0]);
                            break;
                        //case "Your account has been Locked. Please contact administrator.":
                        //    isSuccess = false;
                        //    successMsg = "Your account has been Locked. Please contact administrator.";
                        //    break;
                        //case "You have entered an incorrect Password.":
                        //    isSuccess = false;
                        //    successMsg = 'Wrong Crendtials' + ' <br>' + 'Provided username and password is incorrect.';
                        //    break;
                        //case "Something went wrong!!! Please contact administrator.":
                        //    isSuccess = false;
                        //    successMsg = "Something went wrong!!! Please contact administrator.";
                        //    break;
                        //case "Your account has been Locked due to multiple failed Login attempts.":
                        //    isSuccess = false;
                        //    successMsg = "Your account has been Locked due to multiple failed Login attempts.";
                        //    break;
                        //case "User Name does not exists.":
                        //    successMsg = "User Name does not exists."
                        //    isSuccess = false;
                        //    break;
                        default:
                            isSuccess = false;
                            successMsg = data.responseResult.stausMessage;
                            break;

                    }
                    if (!isSuccess) {
                        jQuery.unblockUI();
                        $('#alrt1').show();
                        $('#alertmessage1').html(successMsg)
                        //App.scrollTo($('#alrt1'), -200);
                        $('#alrt1').fadeOut(5000);
                    }
                    //sessionStorage.setItem("MainUrl", decodeURIComponent(LinkUrl));
                    //sessionStorage.setItem("Token", data.token)
                    //fnGetUserBasicDetails(lastPart)
                },
                error: function (xhr, status, error) {
                    sessionStorage.setItem("Token", '')
                    jQuery.unblockUI();
                    $('#alrt1').show();
                    $('#alertmessage1').html('Wrong Crendtials' + ' <br>' + 'Provided username and password is incorrect')
                    //App.scrollTo($('#alrt1'), -200);
                    $('#alrt1').fadeOut(5000);
                }
            });

        }

    }
    function fnGetUserBasicDetails(lastPart) {

        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: APIPath + "User/getUserDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data1) {

                jQuery.each(data1, function (key, value) {

                    // if (MemberID != '0') {
                    sessionStorage.setItem("CustomerID", value.customerID);
                    sessionStorage.setItem("UserID", value.userID);
                    sessionStorage.setItem("UserName", value.userName);
                    //sessionStorage.setItem("EmailID", value.emailID);
                    //sessionStorage.setItem("MobileNo", value.mobileNo);
                    sessionStorage.setItem("RoleID", value.roleID);
                    //sessionStorage.setItem("ContactEmailID", value.contactEmailID);
                    sessionStorage.setItem("DefaultCurrency", value.defaultCurrency);
                    sessionStorage.setItem("UserType", value.userType);
                    sessionStorage.setItem("VendorId", value.vendorID);
                    sessionStorage.setItem("BidPreApp", value.bidpreapproval);
                    sessionStorage.setItem("preferredtimezone", value.preferredtimezone);
                    sessionStorage.setItem("timezoneid", value.timeZoneID);
                    //abheedev bug 385
                    sessionStorage.setItem("culturecode", value.cultureCode);
                    //  sessionStorage.setItem("localcode", value.localecode);
                    sessionStorage.setItem("utcoffset", value.utcoffset);
                    sessionStorage.setItem("BoqUpload", value.boqUpload);
                   
                    setTimeout(function () {
                        // alert(sessionStorage.getItem("UserType"))
                        if (sessionStorage.getItem("UserType") == "P") {
                            if ((value.VendorID != '0')) {
                                IsAcceptedBidTermsRFIRFQ(sessionStorage.getItem("UserType"));
                            }
                        }
                        //else if (sessionStorage.getItem("UserName") == "" || sessionStorage.getItem("UserName") == null) {// && (sessionStorage.getItem("UserType") == "E") || (sessionStorage.getItem("UserType") == "V")
                        //    fnGetUserBasicDetails(lastPart)
                        //}

                        else {
                            fetchMenuItemsForSession(lastPart);
                        }
                    }, 800);

                });

            },
            error: function (jqXHR, exception) {

                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Error connecting server. Please retry.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                jQuery.unblockUI();
                sessionStorage.clear();
                bootbox.alert(msg);
            }
        });
    }




    $('#forget-password').click(function () {
        jQuery('.login-form').hide();
        jQuery('.forget-form').show();
    });

    $('#back-btn').click(function () {
        jQuery('.login-form').show();
        jQuery('.forget-form').hide();
    });


    return {
        //main function to initiate the module
        init: function () {

            handleLogin();
            handleForgetPassword();
            // handleRegister();

        }

    };

}();
function Changeforgotpasswordfn() {
    
    jQuery.blockUI({ message: '<h5><img src="../../../App/assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var UserType = '';
    var path = window.location.pathname;
    var url = '';
    var lastPart = (path.substr(path.length - (path.length - 1))).slice(0, -1);
    var LinkUrl = window.location.href;
    var custid = 0;
    if (lastPart.toLocaleLowerCase() == "vendor") {
        UserType = 'V';
    }
    else {
        UserType = 'E';
        if (sessionStorage.getItem('CustomerID') != null && sessionStorage.getItem('CustomerID') != undefined) {
            custid = parseInt(sessionStorage.getItem('CustomerID'));
        }
    }
  
    var data = {
        "EmailID": $("#txtemail").val(),
        "UserType": UserType,
        "CustomerID": custid
    }

    jQuery.ajax({

        //url: APIPath + "ChangeForgotPassword/forgotPassword/",
        url: APIPath + "ChangeForgotPassword/forgotPasswordNew/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
          
            switch (data.successCount) {
                case 1:
                case 2:
                case 4:
                    $('#succs2').show();
                    $('#sucssmessage2').html(data.successMsg + 'You have ' + data.lockCount + ' attempts left.');
                    $('#succs2').fadeOut(6000);
                    //App.scrollTo($('#succs2'), -200);
                    resetfileds()
                    jQuery.unblockUI();
                    break;
                default:
                    $('#alrt2').show();
                    $('#alertmessage2').html(data.successMsg);
                    $('#alrt2').fadeOut(6000);
                    //App.scrollTo($('#alrt2'), -200);
                    resetfileds()
                    jQuery.unblockUI();
                    break;
            }
            //if (data.isSuccess == "-1") {
            //    $('#alrt2').show();
            //    $('#alertmessage2').html('Email Id does not exists.!');
            //    $('#alrt2').fadeOut(6000);
            //    App.scrollTo($('#alrt2'), -200);
            //    resetfileds()
            //    jQuery.unblockUI();
            //}
            //else {
            //    $('#succs2').show();
            //    $('#sucssmessage2').html('Your new password is sent to your email address');
            //    $('#succs2').fadeOut(6000);
            //    App.scrollTo($('#succs2'), -200);
            //    resetfileds()
            //    jQuery.unblockUI();
            //}

        }
    });

}
function resetfileds() {
    jQuery("#txtemail").val('')
    jQuery("#bid").val('')
    sessionStorage.removeItem("hdnBid")
    $('#drpUsertype').val('E')
    $('#divBid').hide()
}

function fetchMapCategory(categoryFor, vendorId) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "ProductandServiceCategory/fetchProductCategory/?CustomerID=1&For=" + categoryFor + "&MappedBy=..&ChildId=0",
        // beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#tblCategoryMaster").empty();

            var count = 3;
            var str = '';
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].checked == 'Y') {
                        str += '<tr><td><div id=\"uniform-chkbidTypes\"><span class="checked"  id=\"spancheckedvendorgroup\"><input class=\"childchkbox\" type=\"checkbox\" style=\"cursor:pointer\" /></span></div></td><td>' + data[i].categoryName + '</td></tr>';
                    } else {
                        str += '<tr><td><div id=\"uniform-chkbidTypes\"><span  id=\"spancheckedvendorgroup\"><input class=\"childchkbox\" type=\"checkbox\" style=\"cursor:pointer\" /></span></div></td><td>' + data[i].categoryName + '</td></tr>';
                    }
                }
                jQuery("#tblCategoryMaster").append(str);
            }
            else {
                jQuery("#tblCategoryMaster").append('<tr><td>No Information is there..</td></tr>');
            }
            jQuery.unblockUI();
        },
        error: function (result) {
            alert("error");
            jQuery.unblockUI();

        }
    });
}
//get the IP addresses associated with an account


function saveParticipant() {
    bootbox.alert("Thank you for sharing your inputs. Our Vendor Qualification team will get in touch with you shortly.", function () {
        $("#registerParticipantModal").modal('hide');
        return true;
    });
}
function IsAcceptedBidTerms(Usertype) {

    if (Usertype == 'V') {
        window.location = '../App/VendorHome.html';
    } else if (Usertype == 'P') {
        //alert(sessionStorage.getItem("APIPath") + "BidTermsConditions/IsAcceptedBidTerms/?bidid=" + sessionStorage.getItem('BidID') + "&Userid=" + sessionStorage.getItem('UserID'))
        jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "BidTermsConditions/IsAcceptedBidTerms/?bidid=" + sessionStorage.getItem('BidID') + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            //contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (data) {
                window.location = "../App/" + data[0].URL;
                sessionStorage.setItem("HomePage", "../App/" + data[0].HomePage);
            },
            error: function (xhr) {
                $('.page-container').show();
                return false;
            }
        });
    }
}


function IsAcceptedBidTermsRFIRFQ(Usertype) {
    // alert(sessionStorage.getItem("APIPath") + "BidTermsConditions/fetchIsTermsConditionsAcceptedRFIRFQ/?RFIRFQID=" + sessionStorage.getItem('RFQRFIId') + "&VendorID=" + encodeURIComponent(sessionStorage.getItem('VendorId')))

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BidTermsConditions/fetchIsTermsConditionsAcceptedRFIRFQ/?RFIRFQID=" + sessionStorage.getItem('RFQRFIId') + "&VendorID=" + encodeURIComponent(sessionStorage.getItem('VendorId')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        //contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {

            window.location = "../App/" + data[0].URL;
            sessionStorage.setItem("HomePage", "../App/" + data[0].HomePage);
        },
        error: function (xhr) {
            $('.page-container').show();
            return false;
        }
    });

}

function SetSessionItems(lastPart, value) {
  
    sessionStorage.setItem("CustomerID", value.customerID);
    sessionStorage.setItem("UserID", value.userID);
    sessionStorage.setItem("UserName", value.userName);
    sessionStorage.setItem("RoleID", value.roleID);
    sessionStorage.setItem("DefaultCurrency", value.defaultCurrency);
    sessionStorage.setItem("UserType", value.userType);
    sessionStorage.setItem("VendorId", value.vendorID);
    sessionStorage.setItem("BidPreApp", value.bidpreapproval);
    sessionStorage.setItem("preferredtimezone", value.preferredtimezone);
    sessionStorage.setItem("timezoneid", value.timeZoneID);
    //abheedev bug 385
    sessionStorage.setItem("culturecode", value.cultureCode);
    //sessionStorage.setItem("localcode", value.localecode);
    sessionStorage.setItem("utcoffset", value.utcoffset);
    sessionStorage.setItem("isWhatsappOpted", value.isWhatsappOpted);
    sessionStorage.setItem("mobileNo", value.mobileNo);
    sessionStorage.setItem("BoqUpload", value.boqUpload);
    sessionStorage.setItem("IsSAPModule", value.isExternalSourceIntegrated);
    
    sessionStorage.setItem("roleName", value.roleName);
    sessionStorage.setItem("getUId", value.getUId);
    
    setTimeout(function () {
        if (sessionStorage.getItem("UserType") == "P") {
            if ((value.VendorID != '0')) {
                IsAcceptedBidTermsRFIRFQ(sessionStorage.getItem("UserType"));
            }
        }

        else {
            fetchMenuItemsForSession(lastPart);
        }
    }, 800);

}

function fetchMenuItemsForSession(urlLast) {
    jQuery.blockUI({ message: '<h5><img src="../../../App/assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: APIPath + "User/getMenuItems/?CustomerID=" + encodeURIComponent(sessionStorage.getItem('CustomerID')) + "&UserType=" + sessionStorage.getItem("UserType"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            sessionStorage.setItem("Data", JSON.stringify(data));
            setTimeout(function () {
                if (sessionStorage.getItem("Data") != "" || sessionStorage.getItem("Data") != null) {
                    //alert(sessionStorage.getItem("UserType"))
                    if (sessionStorage.getItem("UserType") == 'E') {
                        if (urlLast.toLowerCase() != "vendor") {
                            sessionStorage.setItem("HomePage", "../App/index.html");
                            window.location = sessionStorage.getItem("HomePage");
                        }
                        else {
                            jQuery.unblockUI();
                            $('#alrt1').show();
                            $('#alertmessage1').html('Enter a valid user name/ password.')
                            //App.scrollTo($('#alrt1'), -200);
                            $('#alrt1').fadeOut(5000);
                        }
                    }
                    else if (sessionStorage.getItem("UserType") == 'V') {
                        if (urlLast.toLowerCase() == "vendor") {
                            sessionStorage.setItem("HomePage", "../App/VendorHome.html");
                            window.location = sessionStorage.getItem("HomePage");
                        }
                        else {
                            jQuery.unblockUI();
                            $('#alrt1').show();
                            $('#alertmessage1').html('Enter a valid user name/ password.')
                            //App.scrollTo($('#alrt1'), -200);
                            $('#alrt1').fadeOut(5000);
                        }

                        return
                    }

                }
                else {

                    fetchMenuItemsForSession(urlLast);

                    return
                }
            }, 1200);
        },
        error: function (jqXHR, exception) {

            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Error connecting server. Please retry.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            jQuery.unblockUI();
            sessionStorage.clear();
            bootbox.alert(msg);
        }

    });
}

//function open register user
function fnOpenRegisterUser() {
    
    $('#ddlCountry').select2();
    $('#ddlState').select2();
    $('#ddlCity').select2();
    $('#ddlCountryCd').select2();
    $('#ddlCountryCdPhone').select2();
    $('#ddlpreferredTime').select2();

    $('#registerParticipantModal').modal('show')
    $('#modalLoader').show();

    fetchCountry()

    prefferedTimezone();

   


}


$('#ddlCountry').on('change', function () {
    
    let CountryKey = $(this).val() || "IN";


    GetCountrySpecificMaster(CountryKey)


}
)


$('#ddlState').on('change', function () {
    
    let stateidentity = $('option:selected', this).data('stateid');
    console.log(stateidentity);

    fetchCity(parseInt(stateidentity));
});









function fetchCity(stateid) {

    if (stateid == null) {
        stateid = 0;
    }
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
                $("#ddlCity").val('0').trigger("change");
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

function VendorRequestSubmit() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
  
    let data='';
    let gstfilename=jQuery('#filegst').val().substring(jQuery('#filegst').val().lastIndexOf('\\') + 1)
    let panfilename=jQuery('#filepan').val().substring(jQuery('#filepan').val().lastIndexOf('\\') + 1)
    let cleanTradeName=StringEncodingMechanism(jQuery("#TradeName").val());
    
    if (jQuery("#txtTINType option:selected").val() == "IN3") {
        
        if(gstflag==false){
           
            jQuery.unblockUI();
            alertforerror(`Please select valid GST to proceed`)
            return false;  
        }

        if (gstfilename == "" || panfilename == "") {
           
            jQuery.unblockUI();
            alertforerror('please attach GST/PAN Files to proceed...')
            return false;
           
        }
    }
     else if (jQuery("#txtTINType option:selected").val() == "" && jQuery("#ddlCountry option:selected").val()=='IN'){
        
        if ( panfilename == ""||jQuery("#vendorpanno").val()=="") {
            jQuery.unblockUI();
            alertforerror(`please attach PAN details to proceed...`)
            return false;
           
        }
        
        
        
    }
    
    
    
   if(jQuery("#txtTINType option:selected").val()=="" && $("#ddlCountry option:selected").val()=='IN' ){
         data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": "0",
        "CompanyEmail": $('#txtEmail').val(),
        "AlternateEmailID": $('#txtEmail2').val(),
        "ParticipantName": $('#vendorname').val(),
        "ContactPerson": $('#txtContName').val(),
        "MobileNo": $('#vendormobileno').val(),
        "PhoneNo": $('#vendoraltmobileno').val(),
        "DialingCode": parseInt($('#ddlCountryCd').val()),
        "DialingCodePhone": parseInt($('#ddlCountryCdPhone').val()),
        "PrefferedTZ": parseInt($('#ddlpreferredTime').val()),
        "Address": $('#vendoraddress').val(),
        "CityName": jQuery("#ddlCity option:selected").text(),
        "StateName": jQuery("#ddlState option:selected").data('statename'),
        "CountryName": jQuery("#ddlCountry option:selected").text(),
        "ZipCode": $('#pincode').val(),
        "TaxId": "",
        "TaxIdType": "",
        "TaxId2":$('#vendorpanno').val() || "",
        "TaxIdType2":jQuery("#txtTINType2 option:selected").val(),
        "CityID": parseInt(jQuery("#ddlCity option:selected").val()),
        "StateID": parseInt(jQuery("#ddlState option:selected").data('stateid')),
        "CountryID": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
        "CountryKey": jQuery("#ddlCountry option:selected").val(),
        "RegionKey": jQuery("#ddlState option:selected").val(),
        "Langu": jQuery("#ddllanguage option:selected").val(),
        "TaxIdFile": "",
        "TaxId2File":panfilename,
        "TradeName":cleanTradeName,
        "GSTNStatus":"",
        "EInvoiceStatus":"",
        "TaxpayerType":"",
    }
    }
     else if(jQuery("#txtTINType option:selected").val()=="IN3"){
        data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": "0",
        "CompanyEmail": $('#txtEmail').val(),
        "AlternateEmailID": $('#txtEmail2').val(),
        "ParticipantName": $('#vendorname').val(),
        "ContactPerson": $('#txtContName').val(),
        "MobileNo": $('#vendormobileno').val(),
        "PhoneNo": $('#vendoraltmobileno').val(),
        "DialingCode": parseInt($('#ddlCountryCd').val()),
        "DialingCodePhone": parseInt($('#ddlCountryCdPhone').val()),
        "PrefferedTZ": parseInt($('#ddlpreferredTime').val()),
        "Address": $('#vendoraddress').val(),
        "CityName": jQuery("#ddlCity option:selected").text(),
        "StateName": jQuery("#ddlState option:selected").data('statename'),
        "CountryName": jQuery("#ddlCountry option:selected").text(),
        "ZipCode": $('#pincode').val(),
        "TaxId": $('#txtTINNo').val(),
        "TaxIdType": jQuery("#txtTINType option:selected").val(),
        "TaxId2": $('#vendorpanno').val() || "",
        "TaxIdType2": jQuery("#txtTINType2 option:selected").val(),
        "CityID": parseInt(jQuery("#ddlCity option:selected").val()),
        "StateID": parseInt(jQuery("#ddlState option:selected").data('stateid')),
        "CountryID": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
        "CountryKey": jQuery("#ddlCountry option:selected").val(),
        "RegionKey": jQuery("#ddlState option:selected").val(),
        "Langu": jQuery("#ddllanguage option:selected").val(),
        "TaxIdFile": gstfilename,
        "TaxId2File": panfilename,
        "TradeName":cleanTradeName,
        "GSTNStatus":$('#gstnStatus').val(),
        "EInvoiceStatus":$('#eInvoiceStatus').val(),
        "TaxpayerType":$('#taxpayerType').val(),
         }
    }
    
    else{
         data = {
        "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
        "UserID": "0",
        "CompanyEmail": $('#txtEmail').val(),
        "AlternateEmailID": $('#txtEmail2').val(),
        "ParticipantName": $('#vendorname').val(),
        "ContactPerson": $('#txtContName').val(),
        "MobileNo": $('#vendormobileno').val(),
        "PhoneNo": $('#vendoraltmobileno').val(),
        "DialingCode": parseInt($('#ddlCountryCd').val()),
        "DialingCodePhone": parseInt($('#ddlCountryCdPhone').val()),
        "PrefferedTZ": parseInt($('#ddlpreferredTime').val()),
        "Address": $('#vendoraddress').val(),
        "CityName": jQuery("#ddlCity option:selected").text(),
        "StateName": jQuery("#ddlState option:selected").data('statename'),
        "CountryName": jQuery("#ddlCountry option:selected").text(),
        "ZipCode": $('#pincode').val(),
        "TaxId": "",
        "TaxIdType": "",
        "TaxId2":"",
        "TaxIdType2":"",
        "CityID": parseInt(jQuery("#ddlCity option:selected").val()),
        "StateID": parseInt(jQuery("#ddlState option:selected").data('stateid')),
        "CountryID": parseInt(jQuery("#ddlCountry option:selected").data('countryid')),
        "CountryKey": jQuery("#ddlCountry option:selected").val(),
        "RegionKey": jQuery("#ddlState option:selected").val(),
        "Langu": jQuery("#ddllanguage option:selected").val(),
        "TaxIdFile": "",
        "TaxId2File":"",
        "TradeName":cleanTradeName,
        "GSTNStatus":"",
        "EInvoiceStatus":"",
        "TaxpayerType":"",
    }
    }
    
    $('#buttoncompanyupdate').removeAttr("disabled");


    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: APIPath + "VendorLCM/VendorRequestSubmit",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            
           
            if ($('#filegst').val() != '') {
                fnUploadFilesonAzure('filegst', gstfilename, data.childId);

            }

            if ($('#filepan').val() != '') {
                fnUploadFilesonAzure('filepan', panfilename, 'VR/' + data.childId);

            }

           
            
            $('#buttoncompanyupdate').attr("disabled", "disabled");
            jQuery.unblockUI();
            if (data.result.isSuccess == 1) {
                alertforsucess('You are successfully registered.Please check your Email for login details.');
            }
            


        },
        error: function (xhr, status, error) {
           
            alertforerror(xhr.responseText)
            jQuery.unblockUI();
        }
    });


}




function extractPan(data) {
    
    $('#txtTINNo').removeClass("gstvalidicon")
    var reggst = /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/


    if (data.value.length === 15) {
        if (!reggst.test(data.value)) {
            bootbox.alert('GST Number Format is not valid. please check it');
            return false;
        }

        ValidateGST(data.value)

    }
    else {

        $("#vendorpanno").val("");

        //beforeTaxDisable()
    }

}

function ValidateGST(data) {
    
    let GSTNo = data
    console.log(sessionStorage.getItem("APIPath") + "BlobFiles/ValidateGST/?GSTNo=" + GSTNo);
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/ValidateGST/?GSTNo=" + GSTNo,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            
            if (data.status != 'E') {
                var data = jQuery.parseJSON(data);
                let panNumber = "";
                gstflag=true;
                let legalName = data.legalNameOfBusiness
                let tradeName=data.tradeName
                let companytype = data.constitutionOfBusiness
                let tradeaddress=`${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.buildingName} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.buildingNumber} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.streetName} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.location} ${data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.districtName} `
                let gststatus = data.gstnStatus
                let eInvoiceStatus=data.eInvoiceStatus
                let taxpayerType=data.taxpayerType
                let stateName=data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.stateName
                let pincode =data.principalPlaceOfBusinessFields.principalPlaceOfBusinessAddress.pincode
                console.log(data.gstin);
                $('#txtTINNo').addClass("gstvalidicon")


                panNumber = data.gstIdentificationNumber.substring(2, 12);
                $("#vendorpanno").val(panNumber);
                $("#vendorpanno").attr("disabled", "disabled");
                //afterTaxEnable()
                $("#vendorname").val(legalName);
                $("#vendorname").attr("disabled", "disabled");
                $("#ddlNatureEstaiblishment").val(companytype);
                $("#ddlNatureEstaiblishment").attr("disabled", "disabled");
                $("#TradeName").val(tradeName);
                $("#vendoraddress").val(tradeaddress);
                
                $("#gstnStatus").val(gststatus);
                $("#eInvoiceStatus").val(eInvoiceStatus);
                $("#taxpayerType").val(taxpayerType);
                $("#pincode").val(pincode);
                alertforinfo(`GST ${GSTNo} : is validated Successfully.`)
                jQuery("#ddlState").find(`option[data-statename=${stateName}]`).prop('selected', true).trigger('change')
               
                
                setTimeout(function () {
                    $('#txtTINNo').removeClass("gstvalidicon");
                }, 2000);
            }
            else {
        
                
                 alertforerror('Please Check Validity of your GST Number')
              


            }


        },
        error: function (xhr, status, error) {
            
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alertforerror(err);
            }
            jQuery.unblockUI();
            return false;
        }

    })
}
var formvendor = $('#submit_form');
function FormValidate() {
    
    formvendor.validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            
            
            txtContName: {
                required: true,                
            },
            vendormobileno: {
                required: true,
                number: true
            },
            vendoraddress: {
                required: true,
                
            },
            ddlpreferredTime: {
                required: true,
            }, 
            txtEmail: {
                required: true,
                email: true
            },
            ddlCountry: {
                required: true, 
            },
            ddlState: {
                required: true,
            },
            ddlCity: {
                required: true,
            },
            vendorname: {
                required: true,
            }, 
            pincode: {
                required: true,
                number:true,
                maxlength:6
            },
            ddllanguage: {
                required: true,
            },


        },
        messages: {
            
             txtContName: {
                required: "Please Enter Valid name",
            },
            txtEmail: {
                required: "Please Enter Valid EmailID"
            },
            ddlCountry: {
                required: "Please Enter Valid Country"
            },
            ddlState: {
                required: "Please Enter Valid State"
            },
            ddlCity: {
                required: "Please Enter Valid City"
            },
            vendorname: {
                required: "Please Enter Valid vendorname"
            },
            pincode: {
                required: "Please Enter Valid pincode/zipcode"
            }


        },
        invalidHandler: function (event, validator) {
            //errorVendor.show()
            // successVendor.hide();
            $('#diverrorvendor').show()
            $('#divsuccvendor').hide()
            $('#divsuccvendor').html("")
            $('#spanerrorvendor').text("Please Enter all required field to proceed");
            $('#diverrorvendor').fadeOut(6000);
        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        success: function (label) {
        },
        submitHandler: function (form) {
        
           
            VendorRequestSubmit()
        }
    });
}


//unregistered vendor


$('#txtTINType').on('change', function () {
  
    let Taxtype = $(this).val() ;
    if(Taxtype==""&&  $("#ddlCountry option:selected").val()=='IN'){
       
        
        $(".nogsthide").hide();
        $(".newgsthide").hide();
        $(".nopanhide").show();
        $("#ParticipantName").removeAttr('disabled');
        $("#ddlNatureEstaiblishment").removeAttr('disabled');
        $("#txtTINNo").attr("onchange","");
        $("#txtPanNo").removeAttr('disabled');
        $("#vendorpanno").removeAttr('disabled');
        $("#vendorname").removeAttr('disabled');
    }
    
    else if(Taxtype=="" && $("#ddlCountry option:selected").val()!='IN'){
       
        
         $(".nogsthide").hide();
        $(".nopanhide").hide();
        $(".newgsthide").hide();
        $("#ParticipantName").removeAttr('disabled');
        $("#ddlNatureEstaiblishment").removeAttr('disabled');
        $("#txtTINNo").attr("onchange","");
        $("#txtPanNo").removeAttr('disabled');
        $("#vendorpanno").removeAttr('disabled');
        $("#vendorname").removeAttr('disabled');
    }
    
    
  
     else if(Taxtype=="IN3"){
         
         $(".nogsthide").show();
         $(".newgsthide").show();
         $(".nopanhide").show();
         $("#ParticipantName").attr("disabled", "disabled");
         $("#ddlNatureEstaiblishment").attr("disabled", "disabled");
         $("#txtTINNo").attr("onchange", "extractPan(this)");
         $("#txtPanNo").attr("disabled", "disabled");
         $("#vendorpanno").attr("disabled", "disabled");
         $("#vendorname").attr("disabled", "disabled");
    }
    
    else{
         $(".nogsthide").show();
         $(".newgsthide").hide();
         $(".nopanhide").show();
         $("#txtTINNo").attr("onchange", "");
         $("#ParticipantName").removeAttr("disabled");
         $("#txtPanNo").removeAttr("disabled");
        
        
    }

   


}
)


