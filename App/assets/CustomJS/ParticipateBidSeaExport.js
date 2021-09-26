var BidTypeID = 0;
var BidForID = 0;
var Duration = '0.00';
var _isBidStarted = true;
sessionStorage.setItem('BidClosingType', '');
//sessionStorage.setItem('BidID', 951)
var error1 = $('.alert-danger');
var success1 = $('.alert-success');
var displayForS = "";

function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'Bid/' + sessionStorage.getItem('BidID'));
}
function fetchVendorDetails() {

    var url = '';
   
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/FetchBidDetails/?BidID=" + sessionStorage.getItem("BidID") + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"));
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(data, status, jqXHR) {
           
            if (data.length == 1) {
               
                $('#tblParticipantsService').show();
                jQuery("#tblParticipantsServiceBeforeStartBid").hide();
               
                $("#hdnAdvFactor").val(data[0].advFactor);
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(data[0].bidDate); 
                jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                jQuery("#lblbidfor").text('Price ('+data[0].bidFor+')');
               
                jQuery('#bid_EventID').html("Event ID : " + sessionStorage.getItem("BidID"));

                jQuery("#lnkTermsAttachment").html(data[0].termsConditions);
               
                if (data[0].attachment != '') {
                    jQuery("#lnkAnyOtherAttachment").html(data[0].attachment);
                }
                
                jQuery("#lblbidduration").text(data[0].bidDuration);
                jQuery("#lblcurrency").text(data[0].currencyName);
                
                _isBidStarted = true;
                $('#lblTimeLeftBeforeBid').html('').hide('');
                BidTypeID = data[0].bidTypeID;
                BidForID = data[0].bidForID;
              
                fetchBidSummaryVendorproduct()

                display = document.querySelector('#lblTimeLeft');
                startTimer((parseInt(data[0].timeLeft)), display);
               
                $('#btnsubmit').show()

            }
            else if (data.length > 1 || data.length == 0) {
               
                $('#lblTimeLeftBeforeBid').html('Bid is not  started.').css('color', 'red');
                
                $('#tblParticipantsService').hide();
                jQuery("#tblParticipantsServiceBeforeStartBid").show();
                _isBidStarted = false;
                $('#btnsubmit').hide()
                fetchBidHeaderDetails(sessionStorage.getItem("BidID"))
            }
        },
        error: function(xhr) {
            jQuery("#error").text(xhr.d);
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
        }
    });

}
var count;
function fetchBidSummaryVendorproduct() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var url = '';
    count = 0;
   
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType") + "&_isBidStarted="+_isBidStarted+"";
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(data, status, jqXHR) {

            
            if (data.length > 0) {
                if (_isBidStarted == false) {
                    
                    jQuery("#tblParticipantsServiceBeforeStartBid").empty()
                    jQuery("#tblParticipantsServiceBeforeStartBid").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th class=hide id='bidStartPrice'>Bid start price</th><th class=hide>Target Price</th><th class=hide>Minimum Decrement</th><th class=hide>Initial Quote</th><th class=hide>Last Quote</th><th class=hide> Status </th><th class=hide>Enter your Bid*</th><th class=hide>Action</th><th>Remarks</th></thead>");
                    
                    for (var i = 0; i < data.length; i++) {
                        jQuery("#tblParticipantsServiceBeforeStartBid").append("<tr><td>"+(i+1)+"</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td class=hide id=ceilingprice" + i + ">" + thousands_separators(data[i].ceilingPrice) + " " + jQuery("#lblcurrency").text() + "</td><td class=hide id=targetprice" + i + ">" + thousands_separators(data[i].targetPrice) + " " + jQuery("#lblcurrency").text() + "</td><td class=hide>" + data[i].minimumDecreament + " " + decreamentOn + "</td><td class=hide id=initialquote" + i + ">" + IQuote + "</td><td class=hide id=lastQuote" + i + ">" + LqQuote + "</td><td class=hide id=lblstatus" + i + ">" + data[i].loQuotedPrice + "</td><td class=hide > <input type=text class=form-control autocomplete=off  id=txtquote" + i + " name=txtquote" + i + " /> <span id=spanamount" + i + "   style=color:#a94442></span></td><td class=hide ><button type='button' id=AllItembtn" + i + " class='btn btn-warning' onclick=InsUpdQuoteSeaExport(" + i + ")>Submit</button><br/><span id=spanmszA" + i + " style=color:#a94442></span></td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td>" + data[i].remarks + "</td></tr>");
                    }
                }
                else {
                    jQuery("#tblParticipantsService").empty()
               
                sessionStorage.setItem('BidClosingType', data[0].bidClosingType)
                if (data[0].bidClosingType == 'A') {
                   
                    jQuery("#tblParticipantsService").append("<thead><tr style='background: gray; color: #FFF'><th>S No</th><th>Item/Product/Service</th><th>Quantity</th><th>UOM</th><th id='bidStartPrice'>Bid start price</th><th>Target Price</th><th>Minimum Decrement</th><th>Initial Quote</th><th>Last Quote</th><th>L1 Quote</th><th> Status </th><th>Enter your Bid*</th><th>Action</th></thead>");
                    
                    for (var i = 0; i < data.length; i++) {
                       
                        var IQuote = data[i].iqQuotedPrice == '0' ? '' : data[i].iqQuotedPrice;
                        var LqQuote = data[i].lqQuotedPrice == '0' ? '' : data[i].lqQuotedPrice;
                        var decreamentOn = data[i].decreamentOn == "A" ? jQuery("#lblcurrency").text() : '%';
                        jQuery("#tblParticipantsService").append("<tr><td>" + (i + 1) + "</td><td class=hide id=minimumdec" + i + ">" + data[i].minimumDecreament + "</td><td class=hide id=decon" + i + ">" + data[i].decreamentOn + "</td><td class=hide id=seid" + i + ">" + data[i].seid + "</td><td class='hide'>" + data[i].uom + "</td><td>" + data[i].destinationPort + "</td><td>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td id=ceilingprice" + i + ">" + thousands_separators(data[i].ceilingPrice) + " " + jQuery("#lblcurrency").text() + "</td><td id=targetprice" + i + ">" + thousands_separators(data[i].targetPrice) + " " + jQuery("#lblcurrency").text() + "</td><td>" + thousands_separators(data[i].minimumDecreament) + " " + decreamentOn + "</td><td id=initialquote" + i + ">" + thousands_separators(IQuote) + "</td><td id=lastQuote" + i + ">" + thousands_separators(LqQuote) + "</td><td  id=L1Price" + i + ">" + thousands_separators(data[i].l1Quote) + "</td><td id=lblstatus" + i + ">" + data[i].loQuotedPrice + "</td><td> <input type=text class='form-control clsdisable' autocomplete=off  id=txtquote" + i + " name=txtquote" + i + " onkeyup='thousands_separators_input(this)' /> <span id=spanamount" + i + "   style=color:#a94442></span></td><td><button type='button' id=AllItembtn" + i + " class='btn btn-warning clsdisable' onclick=InsUpdQuoteSeaExport(" + i + ")>Submit</button><br/><span id=spanmszA" + i + " style=color:#a94442></span></td><td class=hide id=chkMaskVendor" + i + ">" + data[i].maskVendor + "</td><td class=hide id=chkMaskL1Price" + i + ">" + data[i].maskL1Price + "</td></tr>");

                        $('#spanamount' + i).addClass('hide spanclass');
                        $('#spanmszA' + i).addClass('hide spanclass');
                       // $('#txtquote' + i).val(thousands_separators(data[i].LQQuotedPrice));
                       
                        if (data[i].maskVendor == 'Y') {
                            $("#targetprice" + i).html('Not Disclosed');
                        }
                        if (data[i].maskL1Price == 'N') {
                            $("#L1Price" + i).html('Not Disclosed');
                        }
                        if (data[i].showStartPrice == 'N') {
                            $("#ceilingprice" + i).html('Not Disclosed');
                        }

                        if (data[i].loQuotedPrice == 'L1') {
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
        }
    })
    jQuery.unblockUI();

}

function refreshColumnsStaus() {
    clearInterval(mytime)
    var url = '';
    
   
    url = sessionStorage.getItem("APIPath") + "VendorParticipation/fetchBidSummaryVendorSeaExport/?VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId")) + "&BidID=" + sessionStorage.getItem("BidID") + "&UserType=" + sessionStorage.getItem("UserType") + "&_isBidStarted=" + _isBidStarted + "";
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(data, status, jqXHR) {

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  
                    if (data[i].noOfExtension >= 1) {
                        
                        jQuery('#lblTimeLeft').css('color', 'red');
                        jQuery('#lblTimeLeftTxt').removeClass('display-none');
                        jQuery('#lblTimeLeftTxt').html('<b>Bid Time Extended.</b>').css('color', 'red')
                    }
                    else {
                        jQuery('#lblTimeLeftTxt').addClass('display-none');
                        jQuery('#lblTimeLeft').css('color', '');
                    }
                    //jQuery("#txtquote" + i).val('');
                   
                    jQuery("#lblbidduration").text(data[0].bidDuration);
                    
                    display = document.querySelector('#lblTimeLeft');
                    startTimer(data[i].timeLeft, display);
                  
                    $("#initialquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
                    $("#iqquote" + i).html(data[i].iqQuotedPrice == '0' ? '' : thousands_separators(data[i].iqQuotedPrice))
                    $("#lastQuote" + i).html(data[i].lqQuotedPrice == '0' ? '' : thousands_separators(data[i].lqQuotedPrice))
                    $("#lblstatus" + i).html(data[i].loQuotedPrice)
                    $("#L1Price" + i).html(thousands_separators(data[i].l1Quote))
                    if (data[i].maskL1Price == 'N') {
                        $("#L1Price" + i).html('Not Disclosed');
                    }
                    if (data[i].loQuotedPrice == 'L1') {
                        jQuery('#lblstatus' + i).css('color', 'Blue');
                    }
                    else {
                      jQuery('#lblstatus' + i).css('color', 'Red');

                    }

                    
                    if (data[i].itemNoOfExtension > 0) {
                        jQuery('#itemleft' + i).css({
                            'color': 'Red',
                            'font-weight': '500'
                        });
                        jQuery('#itemleftTime' + i).css({
                            'color': 'Red',
                            'font-weight': '500'
                        });
                    }
                   

                }
            }

        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
        }
    });

}


var mytime = 0;
var mytimeforSatus = 0;
function startTimer(duration, display) {
    clearInterval(mytime)
   
    var timer = duration, hours, minutes, seconds;
    mytime = setInterval(function() {
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
            if (sessionStorage.getItem('BidClosingType') == "A") {
                refreshColumnsStaus()
            }

            if (sessionStorage.getItem("UserType") == 'E') {
                fetchUserChats($('#hddnVendorId').val(),'S');
            } else {
                fetchUserChats(sessionStorage.getItem('UserID'),'S');
            }

        }
        refreshColumnsStaus();
        console.log(timer)
       
        if (timer <= 0) {
             $('.clsdisable').attr('disabled', 'disabled')
           
        }
        
        setTimeout(function () {
            if (--timer < -3) {
                timer = -3;
                if (timer == -3) {
                    closeBidAir();
                }
            }
        }, 1000);
        $('#hdnval').val(timer)

    }, 1000);
   

}


function InsUpdQuoteSeaExport(index) {

    var vendorID = 0;
    
    vendorID = sessionStorage.getItem('VendorId'); 
    
    var insertquery = '';
    var value = 0;
    var valuejap = 0;
    var v = 0;
    var vjap = 0;

    var Amount = $('#minimumdec' + index).text()
    if ($('#decon' + index).text() == "A") {
        if (jQuery("#lastQuote" + index).text() == '') {
            value = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
            valuejap = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
        }
        else {
            value = parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
            valuejap = parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
        }

    }
    else {
        if (jQuery("#lastQuote" + index).text() == '') {
            value = (parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + index).val())));
            v = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
            valuejap = (parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#txtquote" + index).val())));
            vjap = parseFloat(removeThousandSeperator($('#txtquote' + index).val()))
        }
        else {
            value = (parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())));
            v = parseFloat(removeThousandSeperator(jQuery("#lastQuote" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()));

            valuejap = (parseFloat(Amount) / 100) * (parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())));
            vjap = parseFloat(removeThousandSeperator(jQuery("#L1Price" + index).text())) - parseFloat(removeThousandSeperator($('#txtquote' + index).val()));
        }
    }
  
    if ((removeThousandSeperator($('#txtquote' + index).val()) == 0) || (!/^[0-9]+(\.[0-9]{1,2})?$/.test(removeThousandSeperator($('#txtquote' + index).val())))) {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Amount is required in number only')
        return false
    }

    else if (parseFloat(removeThousandSeperator($('#ceilingprice' + index).text())) < parseFloat(removeThousandSeperator($('#txtquote' + index).val()))) {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Amount should be less than Bid start price')
        return false
    }
    else if (value < parseFloat(Amount) && $('#decon' + index).text() == "A" && value != 0 && BidForID=="81") {
       $('#spanamount' + index).removeClass('hide')
       $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text())
        return false
    }
    else if (valuejap < parseFloat(Amount) && $('#decon' + index).text() == "A" && value != 0 && BidForID == "83") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + " " + $('#lblcurrency').text() + ".")
        return false
    }
    else if (v < value && $('#decon' + index).text() == "P" && BidForID == "81") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum Bid  = Your last quote minus minimum Decrement Value of ' + Amount + '%')
        return false
    }
    else if (vjap < valuejap && $('#decon' + index).text() == "P" && BidForID == "83") {
        $('#spanamount' + index).removeClass('hide')
        $('#spanamount' + index).text('Maximum bid amount = current L1 price less the minimum Decrement Value of ' + Amount + '%')
        return false
    }
    else {
       
        insertquery = $('#seid' + index).html() + '~' + removeThousandSeperator($('#txtquote' + index).val());
        if ($('#hdnval').val() >= 60) {
            var QuoteProduct = {
                "VendorID": vendorID,
                "BidID": parseInt(sessionStorage.getItem("BidID")),
                "insertQuery": insertquery,
                "EnteredBy": vendorID,
                "Quote": parseFloat(removeThousandSeperator($('#txtquote' + index).val())),
                "SEID": parseInt($('#seid' + index).html()),
                "AdvFactor": parseFloat($("#hdnAdvFactor").val()),
                "ForRFQ": "N"

            }
           //alert(JSON.stringify(QuoteProduct))
            jQuery.ajax({
                url: sessionStorage.getItem("APIPath") + "VendorParticipation/ParticipationSeaExport/",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                type: "POST",
                data: JSON.stringify(QuoteProduct),
                contentType: "application/json; charset=utf-8",
                success: function(data, status, jqXHR) {

                    if (data == "-1") {
                        $('#spanmszA' + index).removeClass('hide')
                        $('#spanmszA' + index).text('already Quoted by someone.');

                    } else {
                        jQuery("#txtquote" + index).val('');
                        fetchVendorDetails();
                    }
                    
                    return true;


                },
                error: function(xhr) {
                   
                    jQuery("#error").text(xhr.d + " you're offline check your connection and try again");
                    
                        var err = eval("(" + xhr.responseText + ")");
                        if (xhr.status === 401) {
                            error401Messagebox(err.Message);
                        }
                        jQuery.unblockUI();
                        return false;
                }
            });
        }
        else {
            var QuoteProduct = {
                "VendorID": vendorID,
                "BidID": parseInt(sessionStorage.getItem("BidID")),
                "insertQuery": insertquery,
                "EnteredBy": vendorID,
                "Quote": parseFloat(removeThousandSeperator($('#txtquote' + index).val())),
                "SEID": parseInt($("#seid" + index).html()),
                "AdvFactor": parseFloat($("#hdnAdvFactor").val()),
                "ForRFQ": "N"

            }
           //  alert(JSON.stringify(QuoteProduct))
            jQuery.ajax({
                url: sessionStorage.getItem("APIPath") + "VendorParticipation/ParticipationSeaExport/",
                beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
                type: "POST",
                data: JSON.stringify(QuoteProduct),
                contentType: "application/json; charset=utf-8",
                success: function(data, status, jqXHR) {
                    if (data == "-1") {
                        $('#spanmszA' + index).removeClass('hide')
                        $('#spanmszA' + index).text('already Quoted by someone.');
                    }
                    else {
                        jQuery("#txtquote" + index).val('');
                        
                        extendbidA()
                    }
                    return true;

                },
                error: function(xhr) {
                    jQuery("#error").text(xhr.d);
                    
                    var err = eval("(" + xhr.responseText + ")");
                    if (xhr.status === 401) {
                        error401Messagebox(err.Message);
                    }
                    jQuery.unblockUI();
                    return false;
                }
            });


        }

    }
}
function extendbidA() {
    var data = {
        "BidId": sessionStorage.getItem("BidID")
      }
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/ExtendDuration/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {
             refreshColumnsStaus();
             fetchVendorDetails()
            return true
        },
        error: function(xhr) {
            jQuery("#error").text(xhr.d);
            
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
            return false;
        }
    });
}

function closeBidAir() {
    clearInterval(mytime)
    var data = {
        "BidId":sessionStorage.getItem("BidID")

    }
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "VendorParticipation/CloseBid/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {
            bootbox.alert("Bid time has been over. Thanks for Participation.", function() {
               
                if (sessionStorage.getItem("ISFromSurrogate") == "Y") {
                    window.location = sessionStorage.getItem('HomePage');
                    sessionStorage.clear();
                }
                else {
                    window.location = 'VendorHome.html';
                   
                }
               
                return false;

            });
        },
        error: function (xhr, status, error) {
            
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
            return false;
        }
    });
}
$(document).on("keyup", "#tblParticipantsService .form-control", function () {
    var txt = this.id
    
    $('#' + txt).next(':first').addClass('hide');
    $('.spanclass').addClass('hide')

});


function fetchBidHeaderDetails(bidId) {
    var tncAttachment = '';
    var anyotherAttachment = '';
    var url = '';
   
    url = sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails_Vendor/?BidID=" + bidId + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("VendorId"))
   
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
                $('#tblParticipantsService').show();
                tncAttachment = data[0].termsConditions.replace(/\s/g, "%20");
                anyotherAttachment = data[0].attachment.replace(/\s/g, "%20");
                $("#hdnAdvFactor").val(data[0].advFactor);
                jQuery("label#lblitem1").text(data[0].bidFor);
                jQuery("#lblbidsubject").text(data[0].bidSubject);
                jQuery("#lblbidDetails").text(data[0].bidDetails);
                jQuery("#lblbiddate").text(data[0].bidDate);
                jQuery("#lblbidtime").text(data[0].bidTime);
                jQuery("#lblbidtype").text(data[0].bidTypeName);
                
                jQuery("#lblbidfor").text('Price ('+data[0].bidFor+')');

                jQuery("#lnkTermsAttachment").html(data[0].termsConditions);
                
                if (data[0].attachment != '') {
                    jQuery("#lnkAnyOtherAttachment").html(data[0].attachment);
                }
                
                jQuery("#lblbidduration").text(data[0].bidDuration);
                jQuery("#lblcurrency").text(data[0].currencyName);
                jQuery("#lblConvRate").text(data[0].conversionRate);
              
                var display = document.querySelector('#lblTimeLeft');
                startTimerBeforeBidStart(data[0].timeLeft, display)
                fetchBidSummaryVendorproduct()
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            jQuery.unblockUI();
            return false;
        }
            });

}

function startTimerBeforeBidStart(duration, display) {
    clearInterval(mytime)
   
    var timer = duration, hours, minutes, seconds;
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
        
        duration--;
        startTimerBeforeBidStart(duration, display)
        if (--timer < 0) {
           
            fetchVendorDetails();
        }
      
    }, 1000);

}
