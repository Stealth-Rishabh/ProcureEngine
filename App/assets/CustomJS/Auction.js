//$("#ulMain").toggleClass("page-sidebar-menu").toggleClass("page-sidebar-menu page-sidebar-menu-closed");
//$("#bid").toggleClass("page-header-fixed page-quick-sidebar-over-content").toggleClass("page-header-fixed page-quick-sidebar-over-content page-sidebar-closed");
function logoutFunction() {
    sessionStorage.clear();
    //sessionStorage.setItem("APIPath", 'http://localhost:2513/api/');
    window.location.href = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + 'index.htm';
}
function error401Messagebox(error) {
    //bootbox.alert(error + "<br> Session has expired Please Login again.", function () {
    bootbox.alert("Your session has expired due to inactivity.<br>Please Login again.", function () {
        window.location = sessionStorage.getItem('MainUrl');
        sessionStorage.clear();
        return false;
    });
}
function fnErrorMessageText(spanid,formid) {
   
    if (formid != '') {
        $('#' + formid).bootstrapWizard('previous')
        $('.button-next').removeClass('hide');
        $('.button-submit').addClass('hide');
    }
    $('.alert-danger').show();
    $('#' + spanid).html('Some error occured . Please contact administrator');
    $('.alert-danger').fadeOut(8000);
    
   // App.scrollTo(error1, -200);
    jQuery.unblockUI();
    return false;
    
}
function fnredirecttoHome(){
	if(sessionStorage.getItem('UserType')=="V"){
		window.location="VendorHome.html"
	}
	else if(sessionStorage.getItem('UserType')=="P"){
        
	    window.history.back();
	}
	else if(sessionStorage.getItem('UserType')=="E"){
	
		window.location="index.html"
	}
}
function gritternotification(msz) {

    $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: '',
        // (string | mandatory) the text inside the notification
        text: msz,
        // (string | optional) the image to display on the left
        //image: './assets/img/avatar1.jpg',
        // (bool | optional) if you want it to fade out on its own or just sit there
        sticky: false,
        // (int | optional) the time you want it to be alive for before fading out
        time: ''
    });

    return false;
}


function setCommonData() {
    jQuery('#spanUserName').html(sessionStorage.getItem('UserName'))
    jQuery('#liHome').html('<i class="fa fa-home"></i><a href=' + sessionStorage.getItem('HomePage') + '>Home</a><i class="fa fa-angle-right"></i>')
}
function minutes_with_leading_zeros(dtmin) {
  
    return (dtmin < 10 ? '0' : '') + dtmin;
}

var decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }

    return decodeHTMLEntities;
})();
function stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
        var p = width
        for (; p > 0 && str[p] != ' '; p--) {
        }
        if (p > 0) {
            var left = str.substring(0, p);
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}
Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}
function fetchMenuItemsFromSession(parentmenuid, menuid) {
    var data = sessionStorage.getItem('Data');
    var data1 = sessionStorage.getItem('Data');
    var i = 1;
    jQuery.each(jQuery.parseJSON(data), function (key, value) {
        if (value.parentMenuID == '0') {
            if (parentmenuid == value.menuID) {
                
                jQuery('#ulMain').append("<li class='active'><a href='javascript:;'><i class='" + value.iconClass + "'></i><span class='title'>" + value.menuName + "</span><span class='arrow'></span></a><ul class='sub-menu' id=MenuHeader" + i + "></ul></li>");
            }
            else
                jQuery('#ulMain').append("<li ><a href='javascript:;' ><i class='" + value.iconClass + "'></i><span class='title'>" + value.menuName + "</span><span class='arrow'></span></a><ul class='sub-menu' id=MenuHeader" + i + "></ul></li>");
                

            jQuery.each(jQuery.parseJSON(data), function (key, value1) {
                if (value.menuID == value1.parentMenuID) {
                    if (menuid == value1.menuID) {
                        jQuery("#MenuHeader" + i).append('<li class="active"><a href="' + value1.pageLink + '">' + value1.menuName + ' </a></li>');
                    }
                    else {
                        jQuery("#MenuHeader" + i).append('<li><a href="' + value1.pageLink + '">' + value1.menuName + ' </a></li>');
                    }

                }
            });
            i++;
        }

    });

}

function gritternotification(msz) {

    $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: '',
        // (string | mandatory) the text inside the notification
        text: msz,
        // (string | optional) the image to display on the left
        //image: './assets/img/avatar1.jpg',
        // (bool | optional) if you want it to fade out on its own or just sit there
        sticky: false,
        // (int | optional) the time you want it to be alive for before fading out
        time: ''
    });

    return false;
}

function CheckOnlineStatus(msg) {
    
   
    var condition = navigator.onLine ? "ONLINE" : "OFFLINE";
    if (condition == "OFFLINE") {
        
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-bottom-full-width",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        //$('#basic').modal('show');
        toastr.error('Please check your Internet Connection!', 'Opps, May be you are Offline!')
       
        
    }
    else {
        
        toastr.clear();
    }
   
}
function Pageloaded() {
  
    CheckOnlineStatus("load");
    document.body.addEventListener("offline", function () {
        
        CheckOnlineStatus("offline")
    }, false);
    document.body.addEventListener("online", function () {
        
        CheckOnlineStatus("online")
        
    }, false);
}
jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblVendorSummary tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});

$('#logOut_btn').click(function() {
    $(this).attr('href', sessionStorage.getItem('MainUrl'))
});
function checkfilesize(fileid) {
    var size = $('#' + fileid.id)[0].files[0].size;

    //if (size > 5242880)// checks the file more than 5 MB
    //{
    if (size > 7340032) {
       // $('#spandanger,#spanerrordomestic').html('Filesize must be less than or equal to 5 MB.!')
        $('.alert-danger').html('Filesize must be less than or equal to 5 MB.!')
        $('.alert-danger').show();
        Metronic.scrollTo($('.alert-danger'), -200);
        $('.alert-danger').fadeOut(5000);
        $('#' + fileid.id).val('')

    }
}

function checkfilesizeMultiple(fileElem) {
    var size = fileElem.files[0].size;
    if (size > 5242880) // checks the file more than 5 MB
    {
        // $('#spandanger,#spanerrordomestic').html('Filesize must be less than or equal to 5 MB.!');
        $('.alert-danger').html('Filesize must be less than or equal to 5 MB.!');
        $('.alert-danger').show();
        Metronic.scrollTo($('.alert-danger'), -200);
        $('.alert-danger').fadeOut(5000);
        $('#' + fileid.id).val('')

    }
}
function thousands_Sep_Text(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}
function thousands_separators(num) {
    
    x = num.toString();
    x = x.replace(/,/g, '');
   
    var afterPoint = '';
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
}
function thousands_separators_NonMadCol(ele) {
    var num = ele.value;
  
    x = num.toString();
    x = x.replace(/,/g, '');

    var afterPoint = '';
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    ele.value= res;
}
function thousands_separators_input(ele) {
    var valArr, val = ele.value;
    val = val.replace(/[^0-9\.]/g, '');
   
    if (val != "") {
        valArr = val.split('.');
        valArr[0] = (parseInt(valArr[0], 10)).toLocaleString();
        val = valArr.join('.');
    }
    ele.value = val;
}

function removeThousandSeperator(val) {
    if (val.length > 4)
    {
        val = val.replace(/,/g, '');
        
    }
    return val;
}
function minmax(value, min, max) {
    if (parseInt(value) < min || isNaN(parseInt(value)))
        return 0;
    else if (parseInt(value) > max)
        return max;
    else
        return value;
}

function addMinutes(time, minsToAdd) {
    function D(J) { return (J < 10 ? '0' : '') + J; };
    var piece = time.split(':');
    var mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
}
function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));

    //if (hours < 10) {
    //     hours = parseInt(hours.substr(0, 1))
    //}
    
    if (time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
  
    if (time.indexOf('pm') != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    time = time.replace(/(am|pm)/, '');
    time = time.substr(time.length - 6)
   
    return time;
}
function CancelBidDuringConfig() {
    var _bidId;
    var _for;

    if (sessionStorage.getItem("CurrentBidID") != '0' && sessionStorage.getItem("CurrentBidID") != null) {
        _for = 'BID';
        _bidId = sessionStorage.getItem("CurrentBidID")
    }

    else if (sessionStorage.getItem("hddnRFQID") != '0' && sessionStorage.getItem("hddnRFQID") != null) {
        _for = 'eRFQ';
        _bidId = sessionStorage.getItem("hddnRFQID");
    }
        //else if (sessionStorage.getItem("hddnRFQID") != '0' && sessionStorage.getItem("hddnRFQID") != null) {
        //    _for = 'RFQ';
        //    _bidId = sessionStorage.getItem("hddnRFQID");
        // }
    else if (sessionStorage.getItem("CurrentRFXID") != '0' && sessionStorage.getItem("CurrentRFXID") != null) {

        _for = 'RFI';
        _bidId = sessionStorage.getItem("CurrentRFXID");
    }
    else {

        _for = 'VQ';
        _bidId = sessionStorage.getItem("CurrentRFIID");
    }
    var Cancelbid = {
        "BidID": parseInt(_bidId),
        "For": _for,
        "Remarks": "Draft",
        "SendMail": '',
        "UserID": sessionStorage.getItem('UserID')
    };
    //alert(JSON.stringify(Cancelbid))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/CancelBidDuringConfig",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        cache: false,
        data: JSON.stringify(Cancelbid),
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            if (data == '1' && _for == 'BID') {
                bootbox.alert("Bid Cancelled successfully.", function () {
                    window.location = "index.html";
                    return false;
                });
            } else if (data == '1' && _for == 'eRFQ') {
                bootbox.alert("RFQ Cancelled successfully.", function () {
                    window.location = "index.html";
                    return false;
                });
            }
            else if (data == '1' && _for == 'RFI') {
                bootbox.alert("RFI Cancelled successfully.", function () {
                    window.location = "index.html";
                    return false;
                });
            } else {
                bootbox.alert("VQ Cancelled successfully.", function () {
                    window.location = "index.html";
                    return false;
                });
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
        }
    });
}

function replaceQuoutesFromString(ele) {
    var str = '';
    str = ele.value;
    str = str.replace(/'/g, '');
    str = str.replace(/"/g, '');
    str = str.replace(/#/g, '');
    str = str.replace(/&/g, '');
    str = str.replace(/~/g, '');
    ele.value = str;
    //return val;
}
function replaceQuoutesFromStringFromExcel(ele) {
    var str = '';
    str = ele.replace(/'/g, '');
    str = str.replace(/"/g, '');
    str = str.replace(/#/g, '');
    str = str.replace(/&/g, '');
    //ele.value = str;
    return str;
}

function openForm() {
    updateMsgReadFlag(sessionStorage.getItem("BidID"), sessionStorage.getItem('UserID'), 'V')
 
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function openChatDiv(name, email, vendorId) {
   
    $("#chat-label").html(name + '(' + email + ')');
    $("#hddnVendorId").val(vendorId);
    fetchUserChats(vendorId,'S');
    updateMsgReadFlag(getUrlVarsURL(decryptedstring)["BidID"], vendorId,'A');
    
}

function closeChatsForAdmin() {
    document.getElementById("chatWindow").style.display = "none";
}

function openBroadcastMessage() {
    fetchBroadcastMsgs(sessionStorage.getItem("UserID"), 'B');
}

function closeChatsForAdminB() {
    document.getElementById("broadcastMsgdiv").style.background = 'none';
    document.getElementById("txtBroadcastMsg").style.visibility = "hidden";
    document.getElementById("btn-cont").style.display = "none";
    document.getElementById("close-btn").style.display = "none";
}
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}



function sendChatMsgs() {
  
    var data = {
        "ChatMsg": jQuery("#txtChatMsg").val(),
        "fromID": sessionStorage.getItem("UserID"),
        "BidId": (sessionStorage.getItem("BidID") == '0' || sessionStorage.getItem("BidID") == null) ? parseInt(getUrlVarsURL(decryptedstring)["BidID"]) : parseInt(sessionStorage.getItem("BidID")),
        "msgType": 'S',
        "toID": (sessionStorage.getItem("UserType") == 'E') ? $("#hddnVendorId").val() : ''
    }
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "Activities/sendChatMessages",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {

                jQuery("#txtChatMsg").val('');
                if (sessionStorage.getItem("UserType") == 'E') {
                    fetchUserChats($('#hddnVendorId').val(),'S');
                } else {
                    fetchUserChats(sessionStorage.getItem('UserID'),'S');
                }
            
        },
        
        error: function (xhr, status, error) {
              
            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
        if (xhr.status == 401) {
            error401Messagebox(err.Message);
        }
        jQuery.unblockUI();
    }
    })
}

function sendBroadCastChatMsgs() {
   
    var data = {
        "ChatMsg": jQuery("#txtBroadcastMsg").val(),
        "fromID": sessionStorage.getItem("UserID"),
        "BidId":parseInt( getUrlVarsURL(decryptedstring)["BidID"]), 
        "msgType": 'B',
        "toID": ''
    }
   
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "Activities/sendChatMessages",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            
                jQuery("#txtBroadcastMsg").val('');
                bootbox.alert("Message has been successfully sent to all vendors.", function () {
                    fetchBroadcastMsgs(sessionStorage.getItem("UserID"), 'B');
                });
           
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else{
                fnErrorMessageText('errormsg', '');
            }
            jQuery.unblockUI();
        }
    })
}
if (window.location.search) {
    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);
    BidID = getUrlVarsURL(decryptedstring)['BidID'];
    sessionStorage.setItem('BidID', BidID)
}

var counter = 0;
function fetchUserChats(userId,msgType) {
    toastr.clear();
    var _bidId = 0;
    _bidId = (sessionStorage.getItem('BidID') == 0) ? BidID : sessionStorage.getItem('BidID');
    var url = "";
 
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Activities/fetchUserChats/?userId=" + encodeURIComponent(userId) + "&BidId=" + _bidId + "&userType=" + sessionStorage.getItem("UserType") + "&msgType=" + msgType,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            $("#chatList").empty();
            if (data.length > 0) {
                $(".pulsate-regular").css('animation', 'none');
                for (var i = 0; i < data.length; i++) {
                    if (data[i].readFlag == 'N') {
                        if (i < 1 && sessionStorage.getItem("UserID") != data[i].fromUserId) {
                        $(".pulsate-regular").css('animation', 'pulse 2s infinite');
                        toastr.options = {
                            "closeButton": true,
                            "debug": false,
                            "positionClass": "toast-top-right",
                            "onclick": null,
                            "showDuration": "1000",
                            "hideDuration": "1000",
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut"
                        }
                            //$('#basic').modal('show');
                       // if (counter == 0) {
                            toastr.success('You have a new message.', 'New Message')
                        //}
                        //counter++;
                      }
                    }
                    if (sessionStorage.getItem("UserID") == data[i].fromUserId) {
                        $("#chatList").append('<div class="post in">'
                                    + '<div class="message">'
                                        + '<span class="arrow"></span>'
                                        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
                                        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + data[i].msgTime + '</span>'
                                        + '<span class="body" style="color: #c3c3c3;">' + data[i].chatMsg + '</span>'
                                    + '</div>'
                                + '</div>');
                    }
                    if (sessionStorage.getItem("UserID") != data[i].fromUserId) {
                        $("#chatList").append('<div class="post out">'
                                    +'<div class="message">'
                                        + '<span class="arrow"></span>'
                                        +'<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
                                        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + data[i].msgTime + '</span>'
                                        + '<span class="body" style="color: #c3c3c3;">' + data[i].chatMsg + '</span>'
                                    +'</div>'
                                +'</div>');
                    }                       
                }
                if (document.body.classList.contains("page-quick-sidebar-open") && sessionStorage.getItem("UserType") == 'P') {
                    openForm();
                }                
               
            }
        },

        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else { fnErrorMessageText('errormsg', ''); }
            jQuery.unblockUI();
        }
    })
}

function fetchBroadcastMsgs(userId,msgType) {
    var _bidId = 0;
    _bidId = (sessionStorage.getItem('BidID') == 0) ? getUrlVarsURL(decryptedstring)['BidID'] : sessionStorage.getItem('BidID');
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Activities/fetchUserChats/?userId=" + encodeURIComponent(userId) + "&BidId=" + _bidId + "&userType=" + sessionStorage.getItem("UserType") + "&msgType=" + msgType,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            $("#listBroadCastMessages").empty();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (sessionStorage.getItem("UserID") == data[i].FromUserId) {
                        $("#listBroadCastMessages").append('<div class="post in">'
                                    + '<div class="message">'
                                        + '<span class="arrow"></span>'
                                        + '<!--<a href="javascript:;" class="name">Bob Nilson</a>-->'
                                        + '<span class="datetime" style="font-size: 12px;font-weight: 300;color: #8496a7;">' + data[i].msgTime + '</span>'
                                        + '<span class="body" style="color: #c3c3c3;">' + data[i].ChatMsg + '</span>'
                                    + '</div>'
                                + '</div>');
                    }

                }
               
            }

           
        },

        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert('error');
            }
            jQuery.unblockUI();
        }
    })
}

function fetchvendor() {

    toastr.clear();
    //jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "Activities/fetchVendorsForChatMsgs/?UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")) + "&BidID=" + getUrlVarsURL(decryptedstring)['BidID'] + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#vendorsChatlist').empty()
            if (data.length > 0) {
                toastr.clear();
                $(".pulsate-regular").css('animation', 'none');
                var vName = '';
                for (var i = 0; i < data.length; i++) {
                    if (vName != data[i].vendorName) { 
                    if (data[i].readFlag == 'N') {
                        if (i <= 1) {
                            $(".pulsate-regular").css('animation', 'pulse 2s infinite');
                            toastr.options = {
                                "closeButton": true,
                                "debug": false,
                                "positionClass": "toast-top-right",
                                "onclick": null,
                                "showDuration": "1000",
                                "hideDuration": "1000",
                                "timeOut": "2000",
                                "extendedTimeOut": "1000",
                                "showEasing": "swing",
                                "hideEasing": "linear",
                                "showMethod": "fadeIn",
                                "hideMethod": "fadeOut"
                            }
                            //$('#basic').modal('show');
                            toastr.success('You have a new message.', 'New Message')
                        }
                        $("#vendorsChatlist").append('<li class="media" onclick="openChatDiv(\'' + data[i].vendorName + '\', \'' + data[i].emailId + '\', \'' + data[i].vendorID + '\');">'
                            + '<div class="media-status">'
                                + '<span class="actions-dot bg-red"></span>'
                            + '</div>'
                            + '<!--<img class="media-object" src="../assets/layouts/layout/img/avatar3.jpg" alt="...">-->'
                            + '<div class="media-body">'
                                + '<h4 class="media-heading">' + data[i].vendorName + '</h4>'
                                + '<div class="media-heading-sub">' + data[i].emailId + '</div>'
                            + '</div>'
                        + '</li>');
                       
                    } else {
                        //$(".pulsate-regular-li").hide();
                        $("#vendorsChatlist").append('<li class="media" onclick="openChatDiv(\'' + data[i].vendorName + '\', \'' + data[i].emailId + '\', \'' + data[i].vendorID + '\');">'
                            + '<div class="media-status">'
                            + '</div>'
                            + '<!--<img class="media-object" src="../assets/layouts/layout/img/avatar3.jpg" alt="...">-->'
                            + '<div class="media-body">'
                                + '<h4 class="media-heading">' + data[i].vendorName + '</h4>'
                                + '<div class="media-heading-sub">' + data[i].emailId + '</div>'
                            + '</div>'
                        + '</li>');

                    }
                    vName = data[i].vendorName
                  }
                }
            }
            QuickSidebar.init();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText// eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
               
            }
            jQuery.unblockUI();
        }
    });
}

function updateMsgReadFlag(bidId, vendorId, forUpdate) {
   
    var data = {
        "BidId": parseInt(bidId),
        "userID": vendorId,
        "UpdateFor": forUpdate
    }
    //console.log(JSON.stringify(data))
   
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "Activities/updateMsgReadFlag",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           //fetchvendor(vendorId);
            return true;

        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }
            jQuery.unblockUI();
        }

    })
}
//** upload Files on Blob/Portaldocs
function fnUploadFilesonAzure(fileID, filename, foldername) {
   
    var formData = new FormData();
    formData.append('file', $('#' + fileID)[0].files[0]);
    formData.append('foldername', foldername);
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/UploadFiles/",
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (data) {
          //  alert('success')
            return;
        },
        error: function (xhr, status, error) {
            $(".alert-danger").find("span").html('').html(filename + " Couldn't upload successfully on Azure");
                Metronic.scrollTo(error, -200);
                $(".alert-danger").show();
                $(".alert-danger").fadeOut(5000);
                jQuery.unblockUI();
            
        }
    });
}
//function fnUploadFilesonBlob(FileName,foldername,flag) {
//    var Tab1Data = {

//        "filename": FileName,
//        "foldername": foldername
//    }
//    // console.log(JSON.stringify(Tab1Data))
//    jQuery.ajax({
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        url: sessionStorage.getItem("APIPath") + "BlobFiles/UploadFilesonBlob/",
//        cache: false,
//        crossDomain: true,
//        data: JSON.stringify(Tab1Data),
//        dataType: "json",
//        success: function (data) {
//            //** Delete Files in Local Folder
//            //if (flag == "Bid")
//            //{
//            //    fnFileDeleteLocalfolder('PortalDocs/Bid/' + sessionStorage.getItem('CurrentBidID') + "/" + FileName)
//            //}
           
//            return;
//        },
//        error: function (xhr, status, error) {
//            $(".alert-danger").find("span").html('').html(FileName+" Couldn't upload successfully on Azure")
//            Metronic.scrollTo(error, -200);
//            $(".alert-danger").show();
//            $(".alert-danger").fadeOut(5000);
//            jQuery.unblockUI();
            
//        }
//    });

//}

//** DownLoad Files from Blob
function fnDownloadAttachments(filename, foldername) {
  
        jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/DownloadFiles/?fileName=" + filename + "&foldername=" + foldername,
        type: "GET",
        cache: false,
        crossDomain: true,
        success: function (data) {
           
            console.log(data)
            var downloadwindow = window.open(data, "_blank");
            downloadwindow.focus();
        },
        error: function () {
            $(".alert-danger").find("span").html('').html(" Couldn't download successfully from Azure");
            Metronic.scrollTo(error, -200);
            $(".alert-danger").show();
            $(".alert-danger").fadeOut(5000);
            jQuery.unblockUI();
        }
    }) 

}

//** Delete Files from Blob
function fnFileDeleteAzure(filename, foldername,deletionfor,srno) {
    var data = {
        "filename": filename,
        "foldername": foldername
    }
    //console.log(JSON.stringify(data))
    $.ajax({
        url: sessionStorage.getItem("APIPath") + "BlobFiles/DeleteFiles/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (deletionfor == 'VAttachment' && srno != 0) {
                fileDeletefromdb(srno, deletionfor)
            }
            $('#spansuccess1').html('File Deleted Successfully');
            success.show();
            Metronic.scrollTo(success, -200);
            success.fadeOut(5000);
         
        },
        error: function (xhr, status, error) {
            $(".alert-danger").find("span").html('').html(filename + " Couldn't deleted successfully from Azure");
            Metronic.scrollTo(error, -200);
            $(".alert-danger").show();
            $(".alert-danger").fadeOut(5000);
            jQuery.unblockUI();
        }
    })
}

//function fnFileDeleteLocalfolder(path) {
//    var formData = new window.FormData();
//    formData.append("Path", path);
//    $.ajax({
//        url: 'ConfigureFileAttachment.ashx',
//        data: formData,
//        processData: false,
//        contentType: false,
//        asyc: false,
//        type: 'POST',
//        success: function (data) {
//            return;
//        },
//        error: function () {
//            console.log('Error in deletion in file from local path')
//        }

//    });
//}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
var allvendorsforautocomplete;
 
function fetchParticipantsVender() {
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/fetchParticipantsVender_PEV2/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&CreatedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Venderdata) {
           
            if (Venderdata.length > 0) {
                allvendorsforautocomplete = Venderdata;
               
            }
            else {
                allvendorsforautocomplete = '';
               
            }
        },
        error: function (xhr, status, error) {
          
            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert('error')
            }
            jQuery.unblockUI();
        }
    });
}
jQuery("#txtsearchvendor").keyup(function () {
    sessionStorage.setItem('hdnVendorID', '0');

});
sessionStorage.setItem('hdnVendorID', 0);
jQuery("#txtsearchvendor").typeahead({
    source: function (query, process) {
        var data = allvendorsforautocomplete;
        usernames = [];
        var vName = '';
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
           
            vname = username.participantName + ' (' + username.companyEmail + ')'
            map[vname] = username;
            usernames.push(vname);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].participantID != "0") {
            sessionStorage.setItem('hdnVendorID', map[item].participantID);

        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
jQuery("#txtsearchcat").keyup(function () {
    sessionStorage.setItem('hdnCategoryGrpID', '0');
    
});
sessionStorage.setItem('hdnCategoryGrpID', 0);
jQuery("#txtsearchcat").typeahead({
    source: function (query, process) {
        var data = vendorsForAutoComplete
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.categoryName] = username;
            usernames.push(username.categoryName);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].categoryID != "0") {
            sessionStorage.setItem('hdnCategoryGrpID', map[item].categoryID);
            // getCategoryWiseVendors(map[item].CategoryID);
        }
        else {
            gritternotification('Please select Group Category  properly!!!');
        }

        return item;
    }

});
jQuery("#txtSearchalldetails").keyup(function () {

    jQuery("#tbldetails tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#txtSearchalldetails').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tbldetails tr:has(td)").show();
        return false;
    }

    //Iterate through all the td.
    jQuery("#tbldetails tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
});
function fetchBidType() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidTypeMapping/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlBidtype").empty();
            jQuery("#ddlBidtype").append(jQuery("<option ></option>").val("0").html("--Bid Type--"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlBidtype").append(jQuery("<option ></option>").val(data[i].BidTypeID).html(data[i].BidTypeName));
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert('error')
            }
            jQuery.unblockUI();
        }
    });
   
}

function fnfetchCatVendors() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
   // alert(sessionStorage.getItem("APIPath") + "RegisterParticipants/fetchCategoryVendorForAdvSearch_PEV2/?CategoryID=" + sessionStorage.getItem("hdnCategoryGrpID") + "&VendorID=" + sessionStorage.getItem('hdnVendorID') + "&CustomerID=" + sessionStorage.getItem('CustomerID'))
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RegisterParticipants/fetchCategoryVendorForAdvSearch_PEV2/?CategoryID=" + sessionStorage.getItem("hdnCategoryGrpID") + "&VendorID=" + sessionStorage.getItem('hdnVendorID') + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $('#div_table').removeClass('hide');
            $('#tbldetails').empty();
            if (data.length) {
                $('#tbldetails').append("<thead><tr><th>Vendor Code</th><th>Category</th><th>Vendor</th><th>Mobile</th><th>EmailID</th></tr></thead><tbody>")
                for (var i = 0; i < data.length; i++) {
                    $('#tbldetails').append("<tr><td>" + data[i].vendorCode + "</td><td>" + data[i].categoryName + "</td><td>" + data[i].vendorName + "</td><td>" + data[i].mobileNo + "</td><td>" + data[i].emailID + "</td></tr>");
                }
            }
            else {
                jQuery('#divalerterrsearch').slideDown('show');
                $('#spanerterrserach').text('No data found')
                $('#div_table').addClass('hide');
               // App.scrollTo(jQuery('#divalerterrsearch'), -200);

                return false;
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                jQuery('#divalerterrsearch').slideDown('show');
                $('#div_table').addClass('hide');
                $('#spanerterrserach').text('You have error .Please try again')
            }
            return false;
            jQuery.unblockUI();
        }
        
    })

    setTimeout(function () {
        jQuery('#divalerterrsearch').css('display', 'none');
    }, 5000);
    clearsearchmodal();
}
$('#Advancesearch').on("hidden.bs.modal", function () {
    clearsearchmodal();
    $('#div_table').addClass('hide');
})
function clearsearchmodal() {

    sessionStorage.setItem('hdnCategoryGrpID', 0);
    sessionStorage.setItem('hdnVendorID', 0);
    jQuery("#txtsearchvendor").val('');
    jQuery("#txtsearchcat").val('');
}

function getUrlVarsURL(URLString) {
    var vars = [],
        hash; var hashes = URLString.slice(URLString.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]); vars[hash[0]] = hash[1];
    }
    return vars;
}


var code = {
   
        encryptMessage: function(messageToencrypt, secretkey){
            var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
            return encryptedMessage.toString();
        },
            decryptMessage: function(encryptedMessage, secretkey){
                var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
                var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

                return decryptedMessage;
         }
}
//var key = 'MAKV2SPBNI99212';
function fnEnryptURL(URL) {
  
    var hashes = URL.slice(URL.indexOf('?') + 1)//.split('&')
    var encryptedstring = encrypt(hashes)
    var url = URL.split("?")[0] + "?param=" + encryptedstring
    return url;
}
function encrypt(message) {
    var message = CryptoJS.AES.encrypt(message, key);
    return message.toString();
}
function decrypt(message) {
    var code = CryptoJS.AES.decrypt(message, key);
    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
}
var key = CryptoJS.enc.Utf8.parse('8080808080808080');
var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
function fnencrypt(message) {
    var encryptedtext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(message), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return (encryptedtext)
}
function fndecrypt(message) {

    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    
    var dncryptedpassword = CryptoJS.AES.decrypt(message, key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })

    return (dncryptedpassword.toString(CryptoJS.enc.Utf8))

}
var Base64 = {

    _keyStr: "MAKV2SPBNI99212",
    encode: function (e) {
        var t = ""; var n, r, i, s, o, u, a; var f = 0;
        e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) }
        return t
    },
    decode: function (e) {
        var t = ""; var n, r, i; var s, o, u, a; var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t
    },
    _utf8_encode: function (e) {
        e = e.toString().replace(/rn/g, "n");
        var t = ""; for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) }
        } return t
    },
    _utf8_decode: function (e) {
        var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t
    }
}
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
var tableToExcelMultipleSheetwithoutColor = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
            + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
            + '<Styles>'
            + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
            + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
            + '</Styles>'
            + '{worksheets}</Workbook>'
        , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
        , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (tables, wsnames, wbname, appname) {
        var ctx = "";
        var workbookXML = "";
        var worksheetsXML = "";
        var rowsXML = "";

        for (var i = 0; i < tables.length; i++) {
            if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
            for (var j = 0; j < tables[i].rows.length; j++) {
                rowsXML += '<Row>'
                for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
                    var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                    var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                    var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                    dataValue = (dataValue) ? dataValue : tables[i].rows[j].cells[k].innerHTML.replace(/ /g, '%20');
                    var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
                    dataFormula = (dataFormula) ? dataFormula : (appname == 'Calc' && dataType == 'DateTime') ? dataValue : null;
                    ctx = {
                        attributeStyleID: (dataStyle == 'Currency' || dataStyle == 'Date') ? ' ss:StyleID="' + dataStyle + '"' : ''
                        , nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String'
                        , data: (dataFormula) ? '' : dataValue
                        , attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                    };
                    rowsXML += format(tmplCellXML, ctx);
                }
                rowsXML += '</Row>'
            }
            ctx = { rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i };
            worksheetsXML += format(tmplWorksheetXML, ctx);
            rowsXML = "";
        }

        ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
        workbookXML = format(tmplWorkbookXML, ctx);



        var link = document.createElement("A");
        link.href = uri + base64(workbookXML);
        link.download = wbname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();
var tableToExcelMultipleWorkSheet = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , tmplWorkbookXML = '<?xml version="1.0" encoding="windows-1252"?><?mso-application progid="Excel.Sheet"?>'
      + '   <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns:html="http://www.w3.org/TR/REC-html40">'
    + '     <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">'
      + '           <Author>Qompare</Author>'
      + '           <Created>{created}</Created>'
      + '       </DocumentProperties>'
    + '     <Styles>'
     + '           <Style ss:ID="Header">'
      + '               <Alignment ss:Vertical="Bottom"/>'
    + '             <Borders>'
      + '                   <Border ss:Color="#000000" ss:Weight="2" ss:LineStyle="Continuous" ss:Position="Right"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="2" ss:LineStyle="Continuous" ss:Position="Left"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="2" ss:LineStyle="Continuous" ss:Position="Top"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="2" ss:LineStyle="Continuous" ss:Position="Bottom"/>'
    + '             </Borders>'
      + '               <Font ss:FontName="Calibri" ss:Size="12" ss:Color="#000000"/>'
      + '               <Interior ss:Color="#cccccc" ss:Pattern="Solid" />'
      + '               <NumberFormat/>'
      + '               <Protection/>'
      + '           </Style>'
    + '         <Style ss:ID="NonMandatory">'
      + '              <Borders>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom"/>'
    + '             </Borders>'
      + '               <Font ss:Color="#000000" ss:FontName="Calibri" ss:Size="12"></Font>'
      + '               <Interior ss:Color="#FFFFAD" ss:Pattern="Solid"></Interior>'
      + '               <NumberFormat ss:Format=""/>'
      + '               <Protection/>'
      + '           </Style>'
       + '         <Style ss:ID="Mandatory">'
      + '             <Borders>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom"/>'
    + '             </Borders>'
      + '               <Font ss:Color="#000000"  ss:FontName="Calibri" ss:Size="12"></Font>'
      + '               <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"></Interior>'
      + '               <NumberFormat/>'
      + '               <Protection/>'
      + '           </Style>'
        + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
   
    + ' </Styles>'
    + ' {worksheets}'
      + '</Workbook>'
        , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
        , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (tables, wsnames, wbname, appname) {
        var ctx = "";
        var workbookXML = "";
        var worksheetsXML = "";
        var rowsXML = "";

        for (var i = 0; i < tables.length; i++) {
            if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
            for (var j = 0; j < tables[i].rows.length; j++) {
                rowsXML += '<Row>'
                for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
                    var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                    var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                    var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                    dataValue = (dataValue) ? dataValue : tables[i].rows[j].cells[k].innerHTML;
                    var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
                    dataFormula = (dataFormula) ? dataFormula : (appname == 'Calc' && dataType == 'DateTime') ? dataValue : null;
                    ctx = {
                        attributeStyleID: (dataStyle == 'Header' || dataStyle == 'NonMandatory' || dataStyle == 'Mandatory' || dataStyle == 'Currency' || dataStyle == 'Date') ? ' ss:StyleID="' + dataStyle + '"' : ''
                        , nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String'
                        , data: (dataFormula) ? '' : dataValue
                        , attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                    };
                    rowsXML += format(tmplCellXML, ctx);
                }
                rowsXML += '</Row>'
            }
            ctx = { rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i };
            worksheetsXML += format(tmplWorksheetXML, ctx);
            rowsXML = "";
        }

        ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
        workbookXML = format(tmplWorkbookXML, ctx);



        var link = document.createElement("A");
        link.href = uri + base64(workbookXML);
        link.download = wbname || 'Workbook.xlsx';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();
   
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
    }
})()


var tablesToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , tmplWorkbookXML = '<?xml version="1.0" encoding="windows-1252"?><?mso-application progid="Excel.Sheet"?>'
      + '   <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"  xmlns:html="http://www.w3.org/TR/REC-html40">'
    + '     <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">'
      + '           <Author>Qompare</Author>'
      + '           <Created>{created}</Created>'
      + '       </DocumentProperties>'
    + '     <Styles>'
      + '           <Style ss:ID="Default" ss:Name="Normal">'
      + '               <NumberFormat ss:Format=""/>'
      + '           </Style>'
      + '           <Style ss:ID="Header">'
      + '               <Alignment ss:Vertical="Bottom"/>'
    + '             <Borders>'
      + '                   <Border ss:Color="#000000" ss:Weight="2" ss:LineStyle="Continuous" ss:Position="Right"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="2" ss:LineStyle="Continuous" ss:Position="Left"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="2" ss:LineStyle="Continuous" ss:Position="Top"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="2" ss:LineStyle="Continuous" ss:Position="Bottom"/>'
    + '             </Borders>'
      + '               <Font ss:FontName="Calibri" ss:Size="12" ss:Color="#000000"/>'
      + '               <Interior ss:Color="#cccccc" ss:Pattern="Solid" />'
      + '               <NumberFormat/>'
      + '               <Protection/>'
      + '           </Style>'

    + '         <Style ss:ID="NonMandatory">'
      + '              <Borders>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom"/>'
    + '             </Borders>'
      + '               <Font ss:Color="#000000" ss:FontName="Calibri" ss:Size="12"></Font>'
      + '               <Interior ss:Color="#FFFFAD" ss:Pattern="Solid"></Interior>'
      + '               <NumberFormat/>'
      + '               <Protection/>'
      + '           </Style>'
       + '         <Style ss:ID="Mandatory">'
      + '             <Borders>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top"/>'
      + '                   <Border ss:Color="#000000" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom"/>'
    + '             </Borders>'
      + '               <Font ss:Color="#000000"  ss:FontName="Calibri" ss:Size="12"></Font>'
      + '               <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"></Interior>'
      + '               <NumberFormat/>'
      + '               <Protection/>'
      + '           </Style>'
    + '         <Style ss:ID="Missed">'
      + '               <Borders/>'
      + '               <Font ss:Color="#ff0000"></Font>'
      + '               <Interior ss:Color="#ff0000" ss:Pattern="Solid"></Interior>'
      + '               <NumberFormat/>'
      + '               <Protection/>'
      + '           </Style>'
    + '         <Style ss:ID="Decimals">'
      + '               <NumberFormat ss:Format="Fixed"/>'
      + '           </Style>'
    + ' </Styles>'
    + ' {worksheets}'
      + '</Workbook>'
    , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}">'
      + '   <ss:Table>'
      + '       {rows}' 
      + '   </ss:Table>'
      + '</Worksheet>'
    , tmplCellXML = '           <ss:Cell{attributeStyleID}{attributeFormula}>'
      + '               <ss:Data ss:Type="{nameType}">{data}</ss:Data>'
      + '           </ss:Cell>'
    , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (tables, wsnames, wbname, appname) {
        var ctx = "";
        var workbookXML = "";
        var worksheetsXML = "";
        var rowsXML = "";

        for (var i = 0; i < tables.length; i++) {
            if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
            for (var j = 0; j < tables[i].rows.length; j++) {
                rowsXML += '      <ss:Row>'
                for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
                    var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                    var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                    var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                    dataValue = (dataValue) ? dataValue : tables[i].rows[j].cells[k].innerHTML;
                    if (!isNaN(dataValue)) {
                        dataType = 'Number';
                        dataValue = parseFloat(dataValue);
                    }
                    var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
                    dataFormula = (dataFormula) ? dataFormula : (appname == 'Calc' && dataType == 'DateTime') ? dataValue : null;
                    ctx = {
                        attributeStyleID: (dataStyle == 'NonMandatory' || dataStyle == 'Mandatory' || dataStyle == 'Missed' || dataStyle == 'Header') ? ' ss:StyleID="' + dataStyle + '"' : ''
                           , nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String'
                           , data: (dataFormula) ? '' : dataValue
                           , attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                    };
                    rowsXML += format(tmplCellXML, ctx);
                }
                rowsXML += '      </ss:Row>'
            }
            ctx = { rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i };
            worksheetsXML += format(tmplWorksheetXML, ctx);
            rowsXML = "";
        }

        ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
        workbookXML = format(tmplWorkbookXML, ctx);
        var link = document.createElement("A");
        link.href = uri + base64(workbookXML);
        link.download = wbname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();