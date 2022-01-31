/*!
 * ihavecookies - jQuery plugin for displaying cookie/privacy message
 * v0.3.2
 *
 * Copyright (c) 2018 Ketan Mistry (https://iamketan.com.au)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($) {

    /*
    |--------------------------------------------------------------------------
    | Cookie Message
    |--------------------------------------------------------------------------
    |
    | Displays the cookie message on first visit or 30 days after their
    | last visit.
    |
    | @param event - 'reinit' to reopen the cookie message
    |
    */
    $.fn.ihavecookies = function(options, event) {

        var $element = $(this);

        // Set defaults
        var settings = $.extend({
            cookieTypes: [
                {
                    type: 'Site Preferences',
                    value: 'preferences',
                    description: 'These are cookies that are related to your site preferences, e.g. remembering your username, site colours, etc.'
                },
                {
                    type: 'Analytics',
                    value: 'analytics',
                    description: 'Cookies related to site visits, browser types, etc.'
                },
                {
                    type: 'Marketing',
                    value: 'marketing',
                    description: 'Cookies related to marketing, e.g. newsletters, social media, etc'
                }
            ],
            title: 'Cookies & Privacy',
            message: 'Cookies enable you to use shopping carts and to personalize your experience on our sites, tell us which parts of our websites people have visited, help us measure the effectiveness of ads and web searches, and give us insights into user behavior so we can improve our communications and products.',
            link: '/privacy-policy',
            delay: 2000,
            expires: 30,
            moreInfoLabel: 'More information',
            acceptBtnLabel: 'Accept',
            advancedBtnLabel: 'Customise Cookies',
            cookieTypesTitle: 'Select cookies to accept',
            fixedCookieTypeLabel:'Necessary',
            fixedCookieTypeDesc: 'These are cookies that are essential for the website to work correctly.',
            onAccept: function(){},
            uncheckBoxes: false
        }, options);

        var myCookie = getCookie('cookieControl');
        var myCookiePrefs = getCookie('cookieControlPrefs');
       // if (!myCookie || !myCookiePrefs || event == 'reinit') {
            // Remove all instances of the cookie message so it's not duplicated
            //$('#gdpr-cookie-message').remove();

            // Set the 'necessary' cookie type checkbox which can not be unchecked
            var cookieTypes = '<li><input type="checkbox" name="gdpr[]" value="necessary" checked="checked" disabled="disabled"> <label title="' + settings.fixedCookieTypeDesc + '">' + settings.fixedCookieTypeLabel + '</label></li>';

            // Generate list of cookie type checkboxes
            preferences = JSON.parse(myCookiePrefs);
            $.each(settings.cookieTypes, function(index, field) {
                if (field.type !== '' && field.value !== '') {
                    var cookieTypeDescription = '';
                    if (field.description !== false) {
                        cookieTypeDescription = ' title="' + field.description + '"';
                    }
                    cookieTypes += '<li><input type="checkbox" id="gdpr-cookietype-' + field.value + '" name="gdpr[]" value="' + field.value + '" data-auto="on"> <label for="gdpr-cookietype-' + field.value + '"' + cookieTypeDescription + '>' + field.type + '</label></li>';
                }
            });

            // Display cookie message on page
            var cookieMessage = "<div id='gdpr-cookie-message'><div class='ciikie_inr'><h4>" + settings.title + "</h4><p>This site uses cookies and related technologies, as described in our privacy policy, for purposes that may include site operation, analytics, enhanced user experience, or advertising. You may choose to consent to our use of these technologies, or manage your own preferences.</p><div class='cookie_btn'><button type=button data-toggle='modal' data-target='#exampleModalcookie'>View Details</button><button id='gdpr-cookie-accept' type=button  >" + settings.acceptBtnLabel + "</button><button id='decline_all' type=button >Decline</button></div></div></div>";
            $($element).append(cookieMessage);
          
            $('body').on('click','#gdpr-cookie-accept', function(){
                
                fnacceptrejectcookie('A')
            });
            $("#decline_all").click(function () {
                fnacceptrejectcookie('D')
            });
        
        if (settings.uncheckBoxes === true) {
            $('input[type="checkbox"].ihavecookies').prop('checked', false);
        }

    };

    // Method to get cookie value
    $.fn.ihavecookies.cookie = function() {
        var preferences = getCookie('cookieControlPrefs');
        return JSON.parse(preferences);
    };

    // Method to check if user cookie preference exists
    $.fn.ihavecookies.preference = function(cookieTypeValue) {
        var control = getCookie('cookieControl');
        var preferences = getCookie('cookieControlPrefs');
        preferences = JSON.parse(preferences);
        if (control === false) {
            return false;
        }
        if (preferences === false || preferences.indexOf(cookieTypeValue) === -1) {
            return false;
        }
        return true;
    };

    /*
    |--------------------------------------------------------------------------
    | Drop Cookie
    |--------------------------------------------------------------------------
    |
    | Function to drop the cookie with a boolean value of true.
    |
    */
    var dropCookie = function(value, expiryDays) {
        setCookie('cookieControl', value, expiryDays);
        $('#gdpr-cookie-message').fadeOut('fast', function() {
            //$(this).remove();
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Set Cookie
    |--------------------------------------------------------------------------
    |
    | Sets cookie with 'name' and value of 'value' for 'expiry_days'.
    |
    */
    var setCookie = function(name, value, expiry_days) {
        var d = new Date();
        d.setTime(d.getTime() + (expiry_days*24*60*60*1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
        return getCookie(name);
    };

    /*
    |--------------------------------------------------------------------------
    | Get Cookie
    |--------------------------------------------------------------------------
    |
    | Gets cookie called 'name'.
    |
    */
    var getCookie = function(name) {
        var cookie_name = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cookie_name) === 0) {
                return c.substring(cookie_name.length, c.length);
            }
        }
        return false;
    };

}(jQuery));




var options = {
    title:'',// 'Accept Cookies',
    message: 'This site uses cookies to offer you a better browsing experience.',
    delay: 600,
    expires: 1,
    onAccept: function(){
        var myPreferences = $.fn.ihavecookies.cookie();
        console.log('Yay! The following preferences were saved...');
        console.log(myPreferences);
    },
    uncheckBoxes: true,
    acceptBtnLabel: 'Accept',
    moreInfoLabel: 'More information',
    cookieTypesTitle: 'Select which cookies you want to accept',
    fixedCookieTypeLabel: 'Essential',
    fixedCookieTypeDesc: 'These are essential for the website to work correctly.'
}

$('body').on('click', '#gdpr-cookie-accept', function () {
    fnacceptrejectcookie('A')
});
$('body').on('click', '#decline_all', function () {
    fnacceptrejectcookie('D')
});

var IP = "";
$(document).ready(function () {
    $.getJSON('https://json.geoiplookup.io/?callback=?', function (data) {
        console.log(JSON.stringify(data.ip, null, 2));
        IP = JSON.stringify(data.ip, null, 2);
        fnisAcceptDeclineCookie(IP);
    });
   
});
function fnisAcceptDeclineCookie(IP) {
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: baseUri + "GetCookie/?IP=" + IP.slice(1, -1),
        cache: false,
        dataType: "json",
        success: function (data) {
           
            if (data[0].status == 'A' || data[0].status == 'D') {
                return;
               // $('#gdpr-cookie-message').remove();
                //$('#gdpr-cookie-message').fadeOut('fast', function () {
                //    $('#gdpr-cookie-message').remove();
                //});
            }
            else {
                fnBindCookies();
                $('#gdpr-cookie-message').show()
            }
        },
        error: function (xhr, status, error) {

            $('#gdpr-cookie-message').show()
            
            return false;
            jQuery.unblockUI();
        }
    });
}
function fnBindCookies() {
   
    $.fn.ihavecookies = function (options, event)
    {
        var $element = $(this);
        // Display cookie message on page
        var cookieMessage = "<div id='gdpr-cookie-message'><div class='ciikie_inr'><p>This site uses cookies and related technologies, as described in our privacy policy, for purposes that may include site operation, analytics, enhanced user experience, or advertising. You may choose to consent to our use of these technologies, or manage your own preferences.</p><div class='cookie_btn'><button type=button data-toggle='modal' data-target='#exampleModalcookie'>View Details</button><button id='gdpr-cookie-accept' type=button  >Accept</button><button id='decline_all' type=button >Decline</button></div></div></div>";
        $($element).append(cookieMessage);
    }
    $('body').ihavecookies(options);
}
function fnacceptrejectcookie(status) {
    var payload = {
        IP: IP.slice(1,-1),
        Status: status
    }
    console.log(JSON.stringify(payload))
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: baseUri + 'AcceptDeclineCookie',
        data: JSON.stringify(payload),
        success: function (data) {
            $('#gdpr-cookie-message').fadeOut('fast', function () {
                $(this).remove();
            });
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            $('#gdpr-cookie-message').show()
            return false;
            jQuery.unblockUI();
        }
    });
}