/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
const msalConfig = {
    auth: {
        clientId: "90dbc2c3-5ed2-4bfe-9a81-d33d180291d7",
        authority: "https://login.microsoftonline.com/d8bbc884-1f64-49e8-b313-369b0fa440bf",
        redirectUri: "https://procurengine.com/azure/",
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },

};

// Add here the endpoints and scopes for the web API you would like to use.
const apiConfig = {
    uri: "https://pev3proapi.azurewebsites.net", // e.g. http://localhost:5000/api
    scopes: ["api://2b56545a-4596-4513-a502-c9b88ab9390c/ProcurEngine_Pro_API"] // e.g. ["scp1", "scp2"]
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
const loginRequest = {
    scopes: ["openid", "profile"]
};

/**
 * Scopes you add here will be used to request a token from Azure AD to be used for accessing a protected resource.
 * To learn more about how to work with scopes and resources, see: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
const tokenRequest = {
    scopes: [...apiConfig.scopes],
};

// exporting config object for jest
if (typeof exports !== 'undefined') {
    module.exports = {
        msalConfig: msalConfig,
    };
}
//______________________________________________________________________________________
const myMSALObj = new msal.PublicClientApplication(msalConfig);

myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch(error => {
        console.error(error);
    });

function handleResponse(response) {



    if (response !== null) {

        username = response.account.username;
        passTokenToApi();
    } else {
        selectAccount();
    }
}


function passTokenToApi() {

    getTokenRedirect(tokenRequest)
        .then(response => {
            sessionStorage.setItem("Token", response.accessToken)

        }).catch(error => {
            console.error(error);
        });

}

async function getTokenRedirect(request) {

    request.account = myMSALObj.getAccountByUsername(username);

    return await myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.error(error);
            console.warn("silent token acquisition fails. acquiring token using popup");
            if (error instanceof msal.InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return myMSALObj.acquireTokenRedirect(request);
            } else {
                console.error(error);
            }
        });
}

function selectAccount() {



    const currentAccounts = myMSALObj.getAllAccounts();

    if (!currentAccounts || currentAccounts.length < 1) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {

        username = currentAccounts[0].username;
        passTokenToApi();
    }
}



//Check JWT Validity


function isAuthenticated() {
    debugger;
    var token = sessionStorage.getItem("Token");
    var refreshToken = sessionStorage.getItem("RefreshToken");
    var isValid = true;
    var ClaimsToken = {
        "AccessToken": token,
        "RefreshToken": refreshToken

    }
    if (sessionStorage.getItem('CustomerID') != "32") {
        var urlAc = sessionStorage.getItem("APIPath") + "Token/refresh";
        try {

            //decode(token);
            //const { exp } = decode(refreshToken);
            //if (Date.now() >= exp * 1000) {
            if (isTokenExpired(token)) {
                jQuery.ajax({
                    url: urlAc,
                    data: JSON.stringify(ClaimsToken),
                    type: "POST",
                    async: false,
                    beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                    contentType: "application/json",
                    success: function (data) {
                        sessionStorage.setItem("Token", data.accessToken)
                        sessionStorage.setItem("RefreshToken", data.refreshToken);
                        isValid = true
                    },
                    error: function (xhr, status, error) {
                        error401Messagebox(error.Message);
                        isValid = false;
                    }
                });
                return isValid;
            }
        } catch (err) {
            error401Messagebox(err.Message);
            return false;
        }
    }
    else {
        myMSALObj.handleRedirectPromise()
            .then(handleResponse)
            .catch(error => {
                console.error(error);
                return false;
            });

    }
    return isValid;
}

function isTokenExpired(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    const expired = Date.now() >= exp * 1000
    return expired
}