jQuery(document).ready(function () {  
    fnToCheckUserIPaccess();
    $(window).focus(function () {
        if (_bidClosingType == "S" && BidForID == "7") {
            fnrefreshStaggerTimerdataonItemClose()
        }
        else {
            fetchBidTime();
        }

        $(window).blur();
    });
    $('ul#chatList').slimScroll({
        height: '250px'
    });
    jQuery('#btnExportToExcel').click(function () {
        if (getUrlVars()["BidTypeID"] == "2") {
            tableToExcel(['tbldetails', 'tblprice', 'tblBidSummary', 'tblapprovalprocess'], ['BidDetails', 'Price', 'Bid Summary', 'Approval History'], 'BidSummary')
        }
        else {
            tableToExcel(['tbldetails', 'tblBidSummary'], ['BidDetails', 'Bid Summary'], 'BidSummary')
        }
    });
    setInterval(function () { Pageloaded() }, 15000);
    /*if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
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
    }*/
    Metronic.init();
    Layout.init();

    setCommonData();
    $(".pulsate-regular").css('animation', 'none');

});

//excel
var tableToExcel = (function () {
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
                    dataValue = (dataValue) ? dataValue : tables[i].rows[j].cells[k].innerHTML;
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
        /*fetchparticationQuotes(BidID, BidForID)*/
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
var TotalTimer = 0;
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
                if (timer != 0) {
                    fetchBidTime(); //** to refresh Timer after Bid accept by vendor
                }
            }
        }
        //  console.log(timer)
        //setTimeout(function () {

        /* if (--timer <= 0) {
             timer = 0;
             if (timer == 0) {
                 window.location = "index.html";
                 return;
             }
         }*/
        //console.log(timer)
        if (--timer < -3) {
            timer = -3;
            if (timer == -3) {
                window.location = "index.html";
            }
        }
        //}, 3000);
        TotalTimer = timer;
    }, 1000);
}
var mytimeforSatus = 0;
function startTimerForStaggerItem(duration1, displayS) {
    clearInterval(mytimeforSatus)

    var timer1 = duration1, hours1, minutes1, seconds1;
    mytimeforSatus = setInterval(function () {

        hours1 = parseInt(timer1 / 3600, 10)
        minutes1 = parseInt(timer1 / 60, 10) - (hours1 * 60)
        seconds1 = parseInt(timer1 % 60, 10);

        hours1 = hours1 < 10 ? "0" + hours1 : hours1;
        minutes1 = minutes1 < 10 ? "0" + minutes1 : minutes1;
        seconds1 = seconds1 < 10 ? "0" + seconds1 : seconds1;

        if (hours1 > 0) {
            displayS.textContent = hours1 + ":" + minutes1 + ":" + seconds1;
        }
        else {
            displayS.textContent = minutes1 + ":" + seconds1;
        }
        //console.log(TotalTimer)

        if (--timer1 <= 0 && TotalTimer > 0) {
            timer1 = 0;
            if (timer1 == 0) {
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



