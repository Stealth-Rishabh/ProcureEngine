// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js

const myMSALObj = new msal.PublicClientApplication(msalConfig);

let username = "";
sessionStorage.setItem("APIPath", 'https://pev3proapi.azurewebsites.net/')
myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch(error => {
        console.error(error);
    });

function selectAccount () {

    /**
     * See here for more information on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    
    const currentAccounts = myMSALObj.getAllAccounts();

    if (!currentAccounts  || currentAccounts.length < 1) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        
        username = currentAccounts[0].username;
        passTokenToApi();
    }
}

function handleResponse(response) {

    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */
      
    if (response !== null) {
       
        username = response.account.username;
        passTokenToApi();
    } else {
        selectAccount();
    }
}

function signIn() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */
   
    myMSALObj.loginRedirect(loginRequest);
}

function signOut() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    // Choose which account to logout from by passing a username.
   
    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username)
    };

    myMSALObj.logout(logoutRequest);

    /*
    const config = {
        auth: {
            clientId: "your_app_id",
            redirectUri: "your_app_redirect_uri", //defaults to application start page
            postLogoutRedirectUri: "your_app_logout_redirect_uri",
        },
    };

    const myMsal = new PublicClientApplication(config);

    // you can select which account application should sign out
    const logoutRequest = {
        account: myMsal.getAccountByHomeId(homeAccountId),
    };

    myMsal.logoutRedirect(logoutRequest);*/

}

function getTokenRedirect(request) {

    /**
    * See here for more info on account retrieval: 
    * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
    */
   debugger;
    request.account = myMSALObj.getAccountByUsername(username);
    request.account.name='-3/5';
    //return myMSALObj.acquireTokenSilent(request)
    return await myMSALObj.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
        .WithForceRefresh(true)
        .ExecuteAsync();

   //    .catch(error => {
   //        console.error(error);
   //        console.warn("silent token acquisition fails. acquiring token using popup");
   //        if (error instanceof msal.InteractionRequiredAuthError) {
   //            // fallback to interaction when silent call fails
   //            return myMSALObj.acquireTokenRedirect(request);
   //        } else {
   //            console.error(error);   
   //        }
   //});
}
 
// Acquires and access token and then passes it to the API call
function passTokenToApi() {
    
    
    getTokenRedirect(tokenRequest)
        .then(response => {
          //  callApi("https://pev3qaapi.azurewebsites.net/User/validate_User/?LoginID=No&Password=&LinkUrl=&MachineIP=1", response.accessToken);
          
           sessionStorage.setItem("Token", response.accessToken)
          
            fnGetUserBasicDetails()
        }).catch(error => {
            console.error(error);
        });

}
function fnGetUserBasicDetails() {

        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath")+"User/getUserDetails/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data1) {
             if(data1.length>0)
             {
                jQuery.each(data1, function (key, value) {

                    sessionStorage.setItem("APIPath", 'https://pev3proapi.azurewebsites.net/')
                    sessionStorage.setItem("CustomerID", value.customerID);
                    sessionStorage.setItem("UserID", value.userID);
                    sessionStorage.setItem("UserName", value.userName);
                    sessionStorage.setItem("EmailID", value.emailID);
                    sessionStorage.setItem("MobileNo", value.mobileNo);
                    sessionStorage.setItem("RoleID", value.roleID);
                    sessionStorage.setItem("ContactEmailID", value.contactEmailID);
                    sessionStorage.setItem("DefaultCurrency", value.defaultCurrency);
                    sessionStorage.setItem("UserType", value.userType);
                    sessionStorage.setItem("VendorId", value.vendorID);
                     sessionStorage.setItem("BidPreApp", value.bidpreapproval);
                    sessionStorage.setItem("preferredtimezone", value.preferredtimezone);
                    sessionStorage.setItem("timezoneid", value.timeZoneID);
                       sessionStorage.setItem("culturecode", value.cultureCode);
                  
                    setTimeout(function () {
                       
                        if (sessionStorage.getItem("UserName") == "" || sessionStorage.getItem("UserName") == null) {
                            fnGetUserBasicDetails()
                        }

                        else {
                            fetchMenuItemsForSession();
                        }
                    }, 800);
                    
                });
             }
            else
            {
                bootbox.alert("You are not registered in ProcurEngine.Please Contact administrator.") 
                   
            }

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
                //jQuery.unblockUI();
                sessionStorage.clear();
                alert('Not signed in')
              
            }
        });
    }
    function fetchMenuItemsForSession() {
       // jQuery.blockUI({ message: '<h5><img src="../../../App/assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath")+"User/getMenuItems/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&UserType=" + sessionStorage.getItem("UserType"),
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
                    else {

                        fetchMenuItemsForSession();
                       
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
               // jQuery.unblockUI();
                sessionStorage.clear();
                //bootbox.alert(msg);
            }

        });
    }
