sessionStorage.clear();

//sessionStorage.setItem("APIPath", 'https://pev3proapi.azurewebsites.net/');
//sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');
sessionStorage.setItem("APIPath", 'http://localhost:51739/');


var Token = '';
var APIPath = sessionStorage.getItem("APIPath");
var clientIP = "";

$.getJSON("https://api.ipify.org?format=json", function (data) {

    // Setting text of element P with id gfg
    clientIP = data.ip;

});


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
                App.scrollTo($('#alrt1'), -200);
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

       sessionStorage.setItem("APIPath", 'http://localhost:51739/');
       //sessionStorage.setItem("APIPath", 'https://pev3qaapi.azurewebsites.net/');
       //sessionStorage.setItem("APIPath", 'https://pev3proapi.azurewebsites.net/');

        debugger;
        var path = window.location.pathname;
        var url = '';
        var lastPart = (path.substr(path.length - 7)).slice(0, -1);
        //lastPart = 'vendor'
        var LinkUrl = window.location.href;

        if (lastPart.toLocaleLowerCase() == "vendor") {


            var data = {
                "LoginID": jQuery("#username").val().trim(),
                "Password": jQuery("#password").val().trim()
            }

            jQuery.ajax({
                url: APIPath + "User/validateUser_Vendor",
                data: JSON.stringify(data),
                type: "POST",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                contentType: "application/json",
                success: function (data) {
                    debugger;
                    var successMsg = "";
                    var isSuccess = true;
                    switch (data.token) {
                        case "You are accessing an Invalid URL.":
                            successMsg = "You are accessing an Invalid URL."
                            isSuccess = false;
                            break;
                        case "Your account has been Locked. Please contact administrator.":
                            successMsg = "Your account has been Locked. Please contact administrator."
                            isSuccess = false;
                            break;
                        case "You have entered an incorrect Password.":
                            successMsg = 'Wrong Crendtials' + ' <br>' + 'Provided username and password is incorrect'
                            isSuccess = false;
                            break;
                        case "Something went wrong!!! Please contact administrator.":
                            successMsg = "Something went wrong!!! Please contact administrator."
                            isSuccess = false;
                            break;
                        case "Your account has been Locked due to multiple failed Login attempts.":
                            successMsg = "Your account has been Locked due to multiple failed Login attempts."
                            isSuccess = false;
                            break;
                        case "User Name does not exists.":
                            successMsg = "User Name does not exists."
                            isSuccess = false;
                            break;
                        default:
                            successMsg = "SUCCESS"
                            isSuccess = true;
                            sessionStorage.setItem("MainUrl", decodeURIComponent(LinkUrl));
                            sessionStorage.setItem("Token", data.token)
                            fnGetUserBasicDetails(lastPart)
                            break;

                    }
                    if (!isSuccess) {
                        jQuery.unblockUI();
                        $('#alrt1').show();
                        $('#alertmessage1').html(successMsg)
                        App.scrollTo($('#alrt1'), -200);
                        $('#alrt1').fadeOut(5000);
                    }
                    
                },
                error: function (xhr, status, error) {
                    sessionStorage.setItem("Token", '')
                    jQuery.unblockUI();
                    $('#alrt1').show();
                    $('#alertmessage1').html('Wrong Crendtials' + ' <br>' + 'Provided username and password is incorrect')
                    App.scrollTo($('#alrt1'), -200);
                    $('#alrt1').fadeOut(5000);
                }
            });

        }
        else {
            var userPass = jQuery("#password").val().trim();
            //var encryptedString = CryptoJS.AES.encrypt(userPass, "8080808080808080").toString();
            //var encryptedString = toUTF8Array(userPass);
            //var decryptedString = (CryptoJS.AES.decrypt(encryptedString, "/")).toString(CryptoJS.enc.Utf8);
            var encryptedString = userPass;
            var data = {
                "LoginID": jQuery("#username").val().trim(),
                //"Password": jQuery("#password").val().trim(),
                "Password": encryptedString,
                "LinkUrl": LinkUrl
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
                    switch (data.token) {
                        case "You are accessing an Invalid URL.":
                            isSuccess = false;
                            successMsg = "You are accessing an Invalid URL.";
                            break;
                        case "Your account has been Locked. Please contact administrator.":
                            isSuccess = false;
                            successMsg = "Your account has been Locked. Please contact administrator.";
                            break;
                        case "You have entered an incorrect Password.":
                            isSuccess = false;
                            successMsg = "Wrong Crendtials' + ' <br>' + 'Provided username and password is incorrect.";
                            break;
                        case "Something went wrong!!! Please contact administrator.":
                            isSuccess = false;
                            successMsg = "Something went wrong!!! Please contact administrator.";
                            break;
                        case "Your account has been Locked due to multiple failed Login attempts.":
                            isSuccess = false;
                            successMsg = "Your account has been Locked due to multiple failed Login attempts.";
                            break;
                        case "User Name does not exists.":
                            successMsg = "User Name does not exists."
                            isSuccess = false;
                            break;
                        default:
                            sessionStorage.setItem("MainUrl", decodeURIComponent(LinkUrl));
                            sessionStorage.setItem("Token", data.token)
                            fnGetUserBasicDetails(lastPart)
                            break;

                    }
                    if (!isSuccess) {
                        jQuery.unblockUI();
                        $('#alrt1').show();
                        $('#alertmessage1').html(successMsg)
                        App.scrollTo($('#alrt1'), -200);
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
                    App.scrollTo($('#alrt1'), -200);
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
                    setTimeout(function () {
                        // alert(sessionStorage.getItem("UserType"))
                        if (sessionStorage.getItem("UserType") == "P") {
                            if ((value.VendorID != '0')) {
                                IsAcceptedBidTermsRFIRFQ(sessionStorage.getItem("UserType"));
                            }
                        }
                        else if (sessionStorage.getItem("UserName") == "" || sessionStorage.getItem("UserName") == null) {// && (sessionStorage.getItem("UserType") == "E") || (sessionStorage.getItem("UserType") == "V")
                            fnGetUserBasicDetails(lastPart)
                        }

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
    function fetchMenuItemsForSession(urlLast) {
        jQuery.blockUI({ message: '<h5><img src="../../../App/assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: APIPath + "User/getMenuItems/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&UserType=" + sessionStorage.getItem("UserType"),
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
                                App.scrollTo($('#alrt1'), -200);
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
                                App.scrollTo($('#alrt1'), -200);
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
    var lastPart = (path.substr(path.length - 7)).slice(0, -1);
    //lastPart = 'vendor'
    var LinkUrl = window.location.href;

    if (lastPart.toLocaleLowerCase() == "vendor") {
        UserType = 'V';
    }
    else {
        UserType = 'E';
    }
    var custid = 0;
    //var UserType = 'V'
    //if (sessionStorage.getItem('CustomerID') != null && sessionStorage.getItem('CustomerID') != undefined) {
    //    custid = sessionStorage.getItem('CustomerID');
    //    UserType = 'E';
    //}
    var data = {
        "EmailID": $("#txtemail").val(),
        "CustomerID": parseInt(custid),
        "UserType": UserType
    }

    jQuery.ajax({

        //url: APIPath + "ChangeForgotPassword/forgotPassword/",
        url: APIPath + "ChangeForgotPassword/forgotPasswordNew/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json",
        success: function (data) {
            debugger;
            switch (data.successCount) {
                case 1:
                case 2:
                case 4:
                    $('#succs2').show();
                    $('#sucssmessage2').html(data.successMsg + 'You have ' + data.lockCount + ' attempts left.');
                    $('#succs2').fadeOut(6000);
                    App.scrollTo($('#succs2'), -200);
                    resetfileds()
                    jQuery.unblockUI();
                    break;
                default:
                    $('#alrt2').show();
                    $('#alertmessage2').html(data.successMsg);
                    $('#alrt2').fadeOut(6000);
                    App.scrollTo($('#alrt2'), -200);
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
        url: APIPath + "ProductandServiceCategory/fetchProductCategory/?CustomerID=1&For=" + categoryFor + "&MappedBy=..&VendorID=0",
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
function getIPs(callback) {

    var ip_dups = {};
    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;
    //bypass naive webrtc blocking using an iframe
    if (!RTCPeerConnection) {
        //NOTE: you need to have an iframe in the page right above the script tag
        //
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        //<script>...getIPs called in here...
        //
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }
    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{ RtpDataChannels: true }]
    };
    var servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };
    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);
    function handleCandidate(candidate) {
        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];
        //remove duplicates
        if (ip_dups[ip_addr] === undefined)
            callback(ip_addr);
        ip_dups[ip_addr] = true;
    }
    //listen for candidate events
    pc.onicecandidate = function (ice) {
        //skip non-candidate events
        if (ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };
    //create a bogus data channel
    pc.createDataChannel("");
    //create an offer sdp
    pc.createOffer(function (result) {
        //trigger the stun server request
        pc.setLocalDescription(result, function () { }, function () { });
    }, function () { });
    //wait for a while to let everything done
    setTimeout(function () {
        //read candidate info from local description
        //var lines = '';
        var lines = pc.localDescription.sdp.split('\n');
        lines.forEach(function (line) {
            if (line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
    }, 1000);
}
//insert IP addresses into the page
getIPs(function (ip) {
    if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {

        sessionStorage.setItem('MachineIP', ip)
    }

});

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
