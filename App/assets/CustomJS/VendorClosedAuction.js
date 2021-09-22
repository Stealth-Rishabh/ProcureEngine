var param = getUrlVars()["param"]
var decryptedstring = fndecrypt(param)
var BIDID = getUrlVarsURL(decryptedstring)["BidID"];

function fetchBidHeaderDetails() {
    var tncAttachment = '';
    var anyotherAttachment = '';
    var url = '';
    
    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails_Vendor/?BidID=" + BIDID + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"))
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            console.log("dataa > ", data)
            if (data.length == 1) {
                sessionStorage.setItem('hdnbidtypeid', data[0].BidTypeID);
                
                $('#tblParticipantsService').show();
                tncAttachment = data[0].TermsConditions.replace(/\s/g, "%20");
                anyotherAttachment = data[0].Attachment.replace(/\s/g, "%20");
                $("#hdnAdvFactor").val(data[0].AdvFactor);
                jQuery("label#lblitem1").text(data[0].BidFor);
                jQuery("#lblbidsubject").text(data[0].BidSubject);
                jQuery("#lblbidDetails").text(data[0].BidDetails);
                jQuery("#lblbiddate").text(data[0].BidDate);
                jQuery("#lblbidtime").text(data[0].BidTime);
                jQuery("#lblbidtype").text(data[0].BidTypeName);
                jQuery("#lblbidfor").text(data[0].BidFor);

                jQuery("a#lnkTermsAttachment").text(data[0].TermsConditions);
                jQuery("a#lnkTermsAttachment").attr("href", "PortalDocs/Bid/" + BIDID + "/" + tncAttachment)

                jQuery("a#lnkAnyOtherAttachment").text(data[0].Attachment);
                jQuery("a#lnkAnyOtherAttachment").attr("href", "PortalDocs/Bid/" + BIDID + "/" + anyotherAttachment)

                jQuery("#lblwarehousearea").text(data[0].WareHouseArea);

                jQuery("#lblbidduration").text(data[0].BidDuration);
                jQuery("#lblcurrency").text(data[0].CurrencyName);
                jQuery("#lblConvRate").text(data[0].ConversionRate);
                jQuery("#lblstatus").text(data[0].ConversionRate);
                jQuery("#lblConvRate").text(data[0].ConversionRate);
                if (data[0].BidTypeID == 7) {
                    $('#tblParticipantsService').removeClass('hide');
                    $('#tblParticipantsVender').addClass('hide');
                    fetchBidSummaryVendorproduct()
                }
                else {
                    $('#tblParticipantsService').addClass('hide');
                    $('#tblParticipantsVender').removeClass('hide');
                    if (data[0].BidForID == 81) {
                        fetchBidSummaryVendorScrap();
                    }
                    else{
                        fetchBidSummaryVendorScrapDutch();
                    }
                }
              
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
           
            return false;
            jQuery.unblockUI();
        }
    });

}
function fetchBidSummaryVendorproduct() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = '';
    count = 0;
   
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType") + "&AthenticationToken=''&_isBidStarted="+false+"";
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },

        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
           
            if (data.length > 0) {
               
                    jQuery("#tblParticipantsService").empty()

                    sessionStorage.setItem('BidClosingType', data[0].BidClosingType)
                    if (data[0].BidClosingType == 'A') {

                        jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>Initial Quote</th><th>Last Quote</th></thead>");
                       
                        for (var i = 0; i < data.length; i++) {

                            var IQuote = data[i].IQQuotedPrice == '0' ? 'Not Quoted' : data[i].IQQuotedPrice;
                            var LqQuote = data[i].LQQuotedPrice == '0' ? 'Not Quoted' : data[i].LQQuotedPrice;
                            var decreamentOn = data[i].DecreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                            jQuery("#tblParticipantsService").append("<tr><td class=hide id=minimumdec" + i + ">" + data[i].MinimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].DecreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].SEID + "</td><td class='hide'>" + data[i].UOM + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].SEID + ")' style='text-decoration:none;'>" + data[i].DestinationPort + "</a></td><td>" + thousands_separators(data[i].Quantity) + "</td><td>" + data[i].UOM + "</td><td id=initialquote" + i + ">" + thousands_separators(IQuote) + "</td><td id=lastQuote" + i + ">" + thousands_separators(LqQuote) + "</td><td class=hide id=chkMaskVendor" + i + ">" + data[i].MaskVendor + "</td><td class=hide id=chkMaskL1Price" + i + ">" + data[i].MaskL1Price + "</td></tr>");

                            $('#spanamount' + i).addClass('hide spanclass');
                            $('#spanmszA' + i).addClass('hide spanclass');
                            $('#txtquote' + i).val(thousands_separators(data[i].LQQuotedPrice));

                            if (data[i].MaskVendor == 'Y') {
                                $("#targetprice" + i).html('Not Disclosed');
                            }
                            if (data[i].MaskL1Price == 'N') {
                                $("#L1Price" + i).html('Not Disclosed');
                            }
                            if (data[i].ShowStartPrice == 'N') {
                                $("#ceilingprice" + i).html('Not Disclosed');
                            }

                            if (data[i].LOQuotedPrice == 'L1') {
                                jQuery('#lblstatus' + i).css({
                                    'color': 'Blue',
                                    'vertical-align': 'top'
                                });
                            }
                            else {

                                jQuery('#lblstatus' + i).css({
                                    'color': 'Red',
                                    'vertical-align': 'top'
                                });
                            }

                            count = count + 1;

                        }
                        
                    }
                    else {
                        jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th>Initial Quote</th><th>Last Quote</th></thead>");

                        for (var i = 0; i < data.length; i++) {

                            var IQuote = data[i].IQQuotedPrice == '0' ? 'Not Quoted' : data[i].IQQuotedPrice;
                            var LqQuote = data[i].LQQuotedPrice == '0' ? 'Not Quoted' : data[i].LQQuotedPrice;
                            var decreamentOn = data[i].DecreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                            jQuery("#tblParticipantsService").append("<tr class=text-center><td class=hide id=minimumdec" + i + ">" + data[i].MinimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].DecreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].SEID + "</td><td class='hide'>" + data[i].UOM + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].SEID + ")' style='text-decoration:none;'>" + data[i].DestinationPort + "</a></td><td>" + thousands_separators(data[i].Quantity) + "</td><td>" + data[i].UOM + "</td><td id=initialquote" + i + ">" + thousands_separators(IQuote) + "</td><td id=lastQuote" + i + ">" + thousands_separators(LqQuote) + "</td><td class=hide>" + data[i].MaskVendor + "</td></tr>");

                            if (data[i].ItemStatus == "Close" || data[i].ItemStatus == "Inactive") {
                                $("#itemleft" + i).html('')
                                jQuery("#txtquote" + i).attr("disabled", true)
                                jQuery("#itembtn" + i).attr("disabled", true)
                                jQuery("#spanclosedmsz" + i).removeClass("hide")
                                jQuery("#spanclosedmsz" + i).css("color", "")
                            }
                            else {
                                $("#itemleft" + i).html(data[i].ItemTimeLeft)
                                jQuery("#txtquote" + i).attr("disabled", false)
                                jQuery("#itembtn" + i).attr("disabled", false)
                                jQuery("#spanclosedmsz" + i).addClass("hide")

                            }

                            if (data[i].MaskVendor == 'Y') {
                                $("#targetprice" + i).html('Not Disclosed')
                            }
                            if (data[i].MaskL1Price == 'N') {
                                $("#L1Price" + i).html('Not Disclosed');
                            }
                            if (data[i].ShowStartPrice == 'N') {
                                $("#ceilingprice" + i).html('Not Disclosed');
                            }

                            $('#spanamount' + i).addClass('hide spanclass');
                            $('#spanmsz' + i).addClass('hide spanclass');
                            $('#spanclosedmsz' + i).addClass('hide spanclass');
                            $('#txtquote' + i).val(thousands_separators(data[i].LQQuotedPrice));

                            if (data[i].LOQuotedPrice == 'L1') {
                                jQuery('#lblstatus' + i).css('color', 'Blue');
                            }
                            else {

                                jQuery('#lblstatus' + i).css('color', 'Red');
                            }
                          
                            if (data[i].ItemNoOfExtension > 0) {
                                jQuery('#itemleft' + i).css({
                                    'color': 'Red',
                                    'font-weight': '500'
                                });
                            }

                            count = count + 1;

                        }

                    }
                }

            
            else {
                jQuery("#tblParticipantsService").append("<tr><td>Nothing Participation</td></tr>")
            }


        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
    jQuery.unblockUI();

}
function fetchBidSummaryVendorScrap() {
    count = 0;
    var url = '';
    
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryPefa/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType") + "&AthenticationToken=''";
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            jQuery("#tblParticipantsVender").empty();
          
           
                if (data.length > 0) {

                    jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th>Last Quote</th></thead>");
                    for (var i = 0; i < data.length; i++) {

                        var IQuote = data[i].IQQuotedPrice == '0' ? '' : data[i].IQQuotedPrice;
                        var MqQuote = data[i].MQQuotedPrice == '0' ? 'Not Quoted' : data[i].MQQuotedPrice;
                        var decreamentOn = data[i].IncreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsVender").append("<tr><td class=hide id=ceilingprice" + i + ">" + data[i].CeilingPrice + "</td><td class=hide id=minimuminc" + i + ">" + data[i].MinimumIncreament + "</td><td class=hide id=incon" + i + ">" + data[i].IncreamentOn + "</td><td class=hide id=psid" + i + ">" + data[i].PSID + "</td><td><a href='javascript:void(0);' onclick='fetchGraphData(" + data[i].PSID + ")' style='text-decoration:none;'>" + data[i].ShortName + "</a></td><td>" + thousands_separators(data[i].Quantity) + "</td><td>" + data[i].UOM + "</td><td id=lastQuote" + i + ">" + thousands_separators(MqQuote) + "</td></tr>");

                        $('#spanamount' + i).addClass('hide spanclass');
                        $('#txtquote' + i).val(thousands_separators(data[i].MQQuotedPrice));
                        
                        if (data[i].MOQuotedPrice == 'H1') {
                            jQuery('#lblstatus' + i).css('color', 'Blue');
                        }
                        else {

                            jQuery('#lblstatus' + i).css('color', 'Red');
                        }
                        if (data[i].ShowHLPrice == 'N') {
                            $("#H1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].ShowStartPrice == "N") {
                            $("#tdBidStartPrice" + i).html('Not Disclosed');
                        }
                        count = count + 1;
                    }
                    
                }
                else {
                    jQuery("#tblParticipantsVender").append("<tr><td>Nothing Participation</td></tr>")
                }
            
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });
}



function fetchBidSummaryVendorScrapDutch() {
    count = 0;
    var url = '';
    
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/BidSummaryPefaDutch/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + BIDID + "&UserType=" + sessionStorage.getItem("UserType") + "&AthenticationToken=''";
   // alert(url)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            //alert(JSON.stringify(data))
            jQuery("#tblParticipantsVender").empty();
           
            if (data.length > 0) {
                
                var _offeredPrice;

                jQuery("#tblParticipantsVender >tbody").empty();
                jQuery("#tblParticipantsVender").append("<thead> <tr style='background: gray; color: #FFF'><th>Item/Product</th><th>Quantity</th><th>UOM</th><th>Accepted Unit Price (" + $('#lblcurrency').text() + ")</th></thead>");
                for (var i = 0; i < data.length; i++) {
                   
                    if (data[i].MOQuotedPrice == "H1") {
                        
                        _offeredPrice = thousands_separators(data[i].MQQuotedPrice);
                    }
                    else {
                        _offeredPrice = data[i].MOQuotedPrice;
                    }
                        
                       
                    jQuery("#tblParticipantsVender").append("<tr><td class=hide id=psid" + i + ">" + data[i].PSID + "</td><td>" + data[i].ShortName + "</td><td>" + thousands_separators(data[i].Quantity) + "</td><td>" + data[i].UOM + "</td><td id='offeredprice" + i + "'>" + _offeredPrice + "</td></tr>");

                            count = count + 1;
                     
                    }
                }

            
            
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    });

}
function fetchGraphData(itemId) {
    
    var _bidTypeID;
    
        _bidTypeID = sessionStorage.getItem('hdnbidtypeid');
    
    
    graphData = [];

    var _date;
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryTrendGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + sessionStorage.getItem('UserID') + "&chartFor=sample",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            
            $("#tblForTrendGraphs").empty();
            if (data) {
                $("#tblForTrendGraphs").append("<tr><th>Submission Time</th><th>Quoted Price</th><th>Vendor</th></tr>");
                for (var i = 0; i < data.length; i++) {
                    _date = new Date(data[i].SubmissionTime);

                    if (data[i].VendorID == sessionStorage.getItem("VendorId")) {
                        $("#tblForTrendGraphs").append("<tr><td>" + _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear() + " " + minutes_with_leading_zeros(new Date(data[i].SubmissionTime).getHours()) + ":" + minutes_with_leading_zeros(new Date(data[i].SubmissionTime).getMinutes()) + "</td><td>" + data[i].QuotedPrice + "</td><td>" + data[i].VendorName + "</td></tr>");
                    }
                }
            }
           
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            return false;
            jQuery.unblockUI();
        }
    }).done(function () {
        
        $("#graphModalLine").modal('show');
       
        linegraphsforItems(itemId)
    });
}
var Vendorseries = "";
var graphtime = [];
var dataQuotes = [];
var Seriesoption = [];
var FinalQuotes = [];
var Quotes = "";
var minprice;
var maxprice;
function linegraphsforItems(itemId) {

    var _bidTypeID;
    var _date;
    _bidTypeID = sessionStorage.getItem('hdnbidtypeid');
  
    
    graphtime = [];
    Vendorseries = "";
    dataQuotes = [];
    Seriesoption = [];
    FinalQuotes = [];
    var colorArray = ['#007ED2', '#f15c80', '#90ED7D', '#FF7F50', '#f15c80', '#FF5733', '#96FF33', '#33FFF0', '#F9FF33', '#581845', '#0B0C01', '#0C0109', '#DAF7A6', '#FFC300', '#08010C'];
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + sessionStorage.getItem('VendorId'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            minprice = parseInt(data[0].MinMaxprice[0].MinPrice - 5);
            maxprice = parseInt(data[0].MinMaxprice[0].MaxPrice + 5);

            $('#lblbidstarttime').text(data[0].BidStartEndTime[0].BidStartTime);
            $('#lblbidendtime').text(data[0].BidStartEndTime[0].BidEndTime);


            if (data[0].SubmissionTime.length > 0) {

                for (var x = 0; x < data[0].SubmissionTime.length; x++) {
                    
                    graphtime.push(data[0].SubmissionTime[x].SubTime);
                }

            }
            Vendorseries = "";
            var values = 0;
       
                if (data[0].VendorNames.length > 0) {


                    for (var i = 0; i < data[0].VendorNames.length; i++) {
                       
                        Quotes = "";
                        values = null;;
                       
                        for (var j = 0; j < data[0].QuotesDetails.length; j++) {
                            if (data[0].VendorNames[i].VendorID == data[0].QuotesDetails[j].VendorID) {
                                Quotes = Quotes + '["' + data[0].QuotesDetails[j].SubTime + '",' + data[0].QuotesDetails[j].QuotedPrice + '],';
                                
                                values = data[0].QuotesDetails[j].QuotedPrice;
                            }
                            else {
                               
                                Quotes = Quotes + '["' + data[0].QuotesDetails[j].SubTime + '",' + values + '],';
                            }
                        }

                       
                        Quotes = Quotes.slice(0, -1);
                       
                        Vendorseries = '{ "name" :"' + data[0].VendorNames[i].VendorName + '", "color": "' + colorArray[i] + '","data": [' + Quotes + ']}';
                      
                        Seriesoption.push(JSON.parse(Vendorseries));

                    }

                }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
     })

    setTimeout(function () {
        
        $('#linechart_material').highcharts({
            title: {
                text: '',
                style: {
                    
                    fontSize: '15px',
                    
                },
               
            },

            xAxis: {

                title: {
                    text: 'Time'
                },

                categories: graphtime//,'12:42','15:14','15:14','15:14','15:57']//graphtime

            },
            yAxis: {
                min: minprice,
                max: maxprice,
                title: {
                    text: 'Quoted Price'
                },
               
            },
            
            series: Seriesoption,
            
            credits: {
                enabled: false
            }

        });

    }, 1000)



}

