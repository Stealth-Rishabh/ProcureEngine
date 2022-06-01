
var BidID = "";
var BidTypeID = "";
var BidForID = "";
var Duration = '0.00';
var connection = ''
var UserID = sessionStorage.getItem("UserID")
$(document).ready(function () {
    if (window.location.search) {

        var param = getUrlVars()["param"];
        var decryptedstring = fndecrypt(param);
        BidID = getUrlVarsURL(decryptedstring)["BidID"];

        BidTypeID = getUrlVarsURL(decryptedstring)["BidTypeID"];
        BidForID = getUrlVarsURL(decryptedstring)["BidForID"];

        sessionStorage.setItem('hdnbidtypeid', BidTypeID)
        sessionStorage.setItem('BidID', BidID)
        fetchBidSummaryDetails(BidID, BidForID)
        fetchBidTime()

    }

});
function fetchBidTime() {
    var display = document.querySelector('#lblTimeLeft');

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "VendorParticipation/FetchBidTimeLeft/?BidID=" + BidID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            if (data.length > 0) {
                startTimer(data[0].timeLeft, display);
                jQuery("#lblbidduration").text(data[0].actualBidDuartion + ' mins');
                jQuery('#txtBidDurationPrev').val(data[0].actualBidDuartion)
                $('#spinnerBidclosingTab').spinner({ value: data[0].actualBidDuartion, step: 1, min: 1, max: 999 });


                $('#tmleft').html($('#lblTimeLeft').text())
            }

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
}
var mytime = 0;
function startTimer(duration, display) {
   
    clearInterval(mytime)
    var timer = duration;
    var hours, minutes, seconds;
    mytime = setInterval(function () {

        hours = parseInt(timer / 3600, 10)
        minutes = parseInt(timer / 60, 10) - (hours * 60)
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (hours > 0) {
            display.textContent = hours + ":" + minutes + ":" + seconds;
        }
        else {
            display.textContent = minutes + ":" + seconds;
        }

        if ((seconds.toString().substring(1, 2) == '0') || (seconds.toString().substring(1, 2) == '5')) {

            if ((BidTypeID == 6 && BidForID == 82) || (BidTypeID == 7 && BidForID == 82)) {
                fetchBidSummaryDetails(BidID, BidForID);
                fetchBidTime(); //** to refresh Timer after Bid accept by vendor
            }
        }
        //console.log(timer)
        //setTimeout(function () {

        //if (--timer <= 0) {
        //    timer = 0;
        //    if (timer == 0) {
        //        window.location = "index.html";
        //        return;
        //    }
        //}
        if (--timer < -3) {
            timer = -3;
            if (timer == -3) {
                window.location = "index.html";
            }
        }
        //}, 3000);

    }, 1000);
}
var mytimeforSatus = 0;
function startTimerForStaggerItem(duration1, displayS) {
    clearInterval(mytimeforSatus)

    var timer = duration1, hours, minutes, seconds;
    mytimeforSatus = setInterval(function () {

        hours = parseInt(timer / 3600, 10)
        minutes = parseInt(timer / 60, 10) - (hours * 60)
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (hours > 0) {
            displayS.textContent = hours + ":" + minutes + ":" + seconds;
        }
        else {
            displayS.textContent = minutes + ":" + seconds;
        }

        if (--timer <= 0) {
            timer = 0;
            if (timer == 0) {
               fnrefreshStaggerTimerdataonItemClose();
            }
        }

    }, 1000);
}
///** on enter submit form
$("#txtChatMsg").keypress(function (e) {
    if (e.which == 13) {
        sendChatMsgs();

    }
})
