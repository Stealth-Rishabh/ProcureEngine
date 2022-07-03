var BidID = "";
var BidTypeID = "";
var BidForID = "";

var postfix = ''

$('#printed_by').html(sessionStorage.getItem('UserName'));
function getCurrenttime() {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    postfix = day + "/" + month + "/" + year;

    $('#printed_on').html(postfix);
}


function saveAspdf() {

    var pdf = new jsPDF('l', 'mm', [300, 475]);
    var options = {
        pagesplit: true
    };

    pdf.addHTML(document.body, options, function () {
        pdf.save('BidSummary.pdf');
        encrypdata = fnencrypt("BidID=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeID=" + getUrlVarsURL(decryptedstring)["BidTypeID"] + "&BidForID=" + getUrlVarsURL(decryptedstring)["BidForID"]);
        window.location = "BidSummary.html?param=" + encrypdata
    });

}


var _bidclosingtype = '';
function ReportBind(Bidid, Bidtypeid, Bidforid) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidDetails/?BidID=" + BidID + "&VendorID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            //alert(data.length)
            if (data.length > 0) {

                $('#watermark').css({ 'background-image': 'url(' + data[0].logoImage + ')' });
                $('#spnconfiguredby').text(data[0].configureByName);
                $('#logo').attr("src", data[0].logoImage);

                if (Bidtypeid != 7) {
                    if (data[0].finalStatus != 'Awarded') {
                        $('#bid_status').html('Status: ' + data[0].finalStatus)
                    }

                    else {

                        $('#bid_status').html('Status: ' + data[0].finalStatus)
                    }
                }
                else {
                    $('#bid_status').html('Status: ' + data[0].finalStatus)
                }

                if (data[0].finalStatus == 'Cancel') {
                    $('#cancl_btn').hide();
                } else {
                    $('#cancl_btn').show();

                }

                if (data[0].status == 'Close' || data[0].status == 'CLOSE') {
                    $('#bid_status').show();

                } else {
                    $('#bid_status').hide();
                }


                BidID = data[0].bidID
                BidTypeID = data[0].bidTypeID
                BidForID = data[0].bidForID

                _bidclosingtype = data[0].bidClosingType;
                var _bidDate = fnConverToLocalTime(data[0].bidDetails.bidDate);

                jQuery('#tdtargetprice').css('display', 'none');
                jQuery('#tblprice').css('display', 'none');
                jQuery('#thmodelclass').css('display', 'none');

                //jQuery('#tbldetails').append("<tr><td><b>Bid Subject:</b> " + data[0].bidSubject + "</td><td><b>Bid Description:</b> " + data[0].bidDetails + "</td></tr><tr><td><b>Bid Date/Time:</b> " + _bidDate + ' - ' + data[0].bidTime + "</td><td><b>Bid Type:</b> " + data[0].bidTypeName + "</td></tr><tr><td><b>Bid For:</b> " + data[0].bidFor + "</td><td><b>Bid Duration:</b> " + data[0].bidDuration + " mins</td></tr><tr><td id='tdCurrency'><b>Currency:</b> " + data[0].currencyName + "</td><td><b>Event ID:</b> " + BidID + "</td></tr>")
                jQuery('#tbldetails').append("<tr><td><b>Bid Subject:</b> " + data[0].bidSubject + "</td><td><b>Bid Description:</b> " + data[0].bidDetails + "</td></tr><tr><td><b>Bid Date/Time:</b> " + _bidDate + "</td><td><b>Bid Type:</b> " + data[0].bidTypeName + "</td></tr><tr><td><b>Bid For:</b> " + data[0].bidFor + "</td><td><b>Bid Duration:</b> " + data[0].bidDuration + " mins</td></tr><tr><td id='tdCurrency'><b>Currency:</b> " + data[0].currencyName + "</td><td><b>Event ID:</b> " + BidID + "</td></tr>")
                //jQuery('#tbldetails').append("<tr><td><b>Bid Subject:</b> " + data[0].bidSubject + "</td><td><b>Bid Description:</b> " + data[0].bidDetails + "</td></tr><tr><td><b>Bid Date/Time:</b> " + data[0].bidDate + ' - ' + data[0].bidTime + "</td><td><b>Bid Type:</b> " + data[0].bidTypeName + "</td></tr><tr><td><b>Bid For:</b> " + data[0].bidFor + "</td><td><b>Bid Duration:</b> " + data[0].bidDuration + " mins</td></tr><tr><td id='tdCurrency'><b>Currency:</b> " + data[0].currencyName + "</td><td><b>Event ID:</b> " + BidID + "</td></tr>")
                jQuery('#trtargetprice').css('display', 'none');

            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                jQuery("#error").text(xhr.d);
            }
            return false;
            jQuery.unblockUI();
        }

    });

    if (BidTypeID == 1 || BidTypeID == 6) {
        $('#lnktotvalue').show()
        $('#btngraphbubble').show()
    }
    else {
        $('#lnktotvalue').hide()
        $('#btngraphbubble').show()
    }
}

function fetchBidSummaryDetails(BidID, BidTypeID, BidForID) {
    debugger;
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidSummary/?BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&BidForID=" + BidForID + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            var counterForItenscount = 0;

            jQuery("#tblBidSummary > thead").empty();
            jQuery("#tblBidSummary > tbody").empty();

            _bidarray = [];
            var wtavg = 0;
            if (data.length > 0) {

                if (parseInt(BidTypeID) == 6) {
                    $('#lnktotvalue').html('Detailed Report')
                    if ($('#lnktotvalue').html() == "Detailed Report") {
                        jQuery("#tblBidSummary").hide()
                        jQuery("#tblbidsummarypercentagewise").show()
                        $('#divfordetailreport').show()
                        $('#divforBidsummary').hide()
                    }

                    counterForItenscount = 0;
                    var TotalBidValue = ''; // TotalBidValueCeiling = '', TotalBidValueInvoice = '';

                    var Percentreduction = '', Percentreductionceiling = '', Percentreductioninvoice = '';
                    $('#divTarget').hide();
                    var sname = '';
                    if (BidForID == 81 || BidForID == 83) {
                        $('#BidTrendGraph').css('display', 'block');
                        var strHead = "<tr><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Quantity</th><th>UOM</th><th>Minimum Increament</th><th>Level</th><th>Vendor</th><th>Initial Quote</th><th>Highest Quote</th><th>Bid Value</th><th>Percentage Increment (Target Price)</th><th>Percentage Increment (Last Invoice Price)</th><th>Percentage Increment (Bid start price)</th></tr>"; //<th>Contract Duration</th><th>Dispatch Location</th>
                    }
                    else {

                        $('#BidTrendGraph').css('display', 'none');
                        var strHead = "<tr><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Ceiling/ Max Price</th><th>Quantity</th><th>UOM</th><th>Minimum Increament</th><th>Level</th><th>Vendor</th><th>Accepted Price</th><th>Bid Value</th><th>Percentage Decrement (Target Price)</th><th>Percentage Decrement (Last Invoice Price)</th><th>Percentage Decrement (Ceiling/ Max Price)</th></tr>";
                    }



                    jQuery('#tblBidSummary > thead').append(strHead);

                    for (var i = 0; i < data.length; i++) {

                        TotalBidValue = (parseFloat(data[i].quantity) * parseFloat(data[i].lQuote)).toFixed(2);

                        if (TotalBidValue != 0) {
                            if (data[i].targetPrice != 0) {
                                if (BidForID == 81 || BidForID == 83) {
                                    Percentreduction = parseFloat(parseFloat(data[i].lQuote / data[i].targetPrice) * 100 - 100).toFixed(2) + ' %'
                                }
                                else {
                                    Percentreduction = parseFloat(100 - parseFloat(data[i].lQuote / data[i].targetPrice) * 100).toFixed(2) + ' %'
                                }
                            }
                            else {
                                Percentreduction = 'Not Specified';
                            }
                            if (data[i].lastInvoicePrice != 0) {
                                if (BidForID == 81 || BidForID == 83) {
                                    Percentreductioninvoice = parseFloat(parseFloat(data[i].lQuote / data[i].lastInvoicePrice) * 100 - 100).toFixed(2) + ' %'
                                }
                                else {
                                    Percentreductioninvoice = parseFloat(100 - parseFloat(data[i].lQuote / data[i].lastInvoicePrice) * 100).toFixed(2) + ' %'
                                }

                            }
                            else {
                                Percentreductioninvoice = 'Not Specified';
                            }

                            if (BidForID == 81 || BidForID == 83) {
                                Percentreductionceiling = parseFloat(parseFloat(data[i].lQuote / data[i].ceilingPrice) * 100 - 100).toFixed(2) + ' %'
                            }
                            else {
                                Percentreductionceiling = parseFloat(100 - parseFloat(data[i].lQuote / data[i].ceilingPrice) * 100).toFixed(2) + ' %'
                            }

                        }
                        else {

                            Percentreduction = 'N/A';
                            Percentreductionceiling = 'N/A';
                            Percentreductioninvoice = 'N/A';
                        }
                        if (sname != data[i].shortName) {
                            sname = data[i].shortName
                            if (BidForID == 81 || BidForID == 83) {
                                var str = "<tr id=low" + i + "><td>" + data[i].shortName + "</td><td class='text-right'>" + thousands_separators(data[i].targetPrice) + "</td><td class='text-right'>" + thousands_separators(data[i].lastInvoicePrice) + "</td><td class='text-right'>" + thousands_separators(data[i].ceilingPrice) + "</td><td class='text-right'>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td>" + data[i].minimumIncreament + "</td>";
                                counterForItenscount = counterForItenscount + 1;
                                if (counterForItenscount <= 6) {
                                    fnPaintGraph(data[i].shortName, counterForItenscount, data[i].psid)
                                }

                            } else {
                                var str = "<tr id=low" + i + "><td>" + data[i].shortName + "</td><td class='text-right'>" + thousands_separators(data[i].targetPrice) + "</td><td class='text-right'>" + thousands_separators(data[i].lastInvoicePrice) + "</td><td class='text-right'>" + thousands_separators(data[i].startingPrice) + "</td><td class='text-right'>" + thousands_separators(data[i].ceilingPrice) + "</td><td class='text-right'>" + thousands_separators(thousands_separators(data[i].quantity)) + "</td><td>" + data[i].uom + "</td><td>" + data[i].minimumIncreament + "</td>";

                            }


                        }
                        else {
                            if (BidForID == 81 || BidForID == 83) {
                                var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                            else {
                                var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }


                        }


                        if (BidForID == 81 || BidForID == 83) {
                            str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td><td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                            str += "<td class=text-right>" + thousands_separators((data[i].lQuote == '0' ? '' : data[i].lQuote)) + "</td>";
                            str += "<td class=text-right>" + thousands_separators(TotalBidValue) + "</td>";

                        }
                        else {
                            // alert(data[i].SrNo)
                            str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td>";
                            str += "<td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                            str += "<td class=text-right>" + thousands_separators(TotalBidValue) + "</td>";

                        }
                        if (data[i].srNo == 'H1') {
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreductionceiling + "</td>";
                        }
                        else if (data[i].srNo == 'L1') {
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreductionceiling + "</td>";
                        }
                        else {
                            str += "<td>" + Percentreduction + "</td>";
                            str += "<td>" + Percentreductioninvoice + "</td>";
                            str += "<td>" + Percentreductionceiling + "</td>";

                        }



                        str += "</tr>";

                        jQuery('#tblBidSummary > tbody').append(str);



                        if (data[i].SrNo == 'H1') {
                            $('#low' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })

                        }
                    }
                }
                else if (parseInt(BidTypeID) == 9) {

                    $('#lnktotvalue').html('Detailed Report')
                    if ($('#lnktotvalue').html() == "Detailed Report") {
                        jQuery("#tblBidSummary").hide()
                        jQuery("#tblbidsummarypercentagewise").show()
                        $('#divfordetailreport').show()
                        $('#divforBidsummary').hide()
                    }
                    $('#lnktotvalue').hide()

                    var minimuminc;
                    $('#divTarget').hide();
                    var sname = '';
                    var strHead = "<tr><th>S No</th><th>Item/Product</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid Start Price</th><th>Total Quantity</th><th>Min.Quantity</th><th>Max.Quantity</th><th>Unallocated Quantity</th><th>UOM</th><th>Wt. Avg.</th><th>Minimum Increment</th><th>Level</th><th>Vendor</th><th>Quantity Bided</th><th>Allocated Quantity</th><th>Initial Quote</th><th>Highest Quote</th></tr>"; //<th>Contract Duration</th><th>Dispatch Location</th>
                    jQuery('#tblBidSummary > thead').append(strHead);

                    var c = 1;
                    var c = 1; var cc = 0; var totquoteallocatedquan = 0; var totallocatedquan = 0;
                    for (var i = 0; i < data.length; i++) {

                        if (data[i].increamentOn == "P") {
                            minimuminc = thousands_separators(data[i].minimumIncreament) + ' %'
                        }
                        else {
                            minimuminc = thousands_separators(data[i].minimumIncreament)
                        }
                        if (sname != data[i].shortName) {
                            sname = data[i].shortName
                            cc = cc + 1;
                            var str = '<tr id=lowa' + i + ' class=header><td  onclick="fnClickHeader(\'lowa' + i + '\',\'i_expandcollapse' + i + '\',\'forAll\')">' + c + '</td><td><a href="javascript:void(0);" onclick="fetchGraphData(' + data[i].frid + ')"  style="text-decoration:none;">' + data[i].shortName + '</a></td><td class="text-right">' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right">' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right">' + thousands_separators(data[i].bidStartPrice) + '</td><td class="text-right">' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + thousands_separators(data[i].minOfferedQuantity) + '</td><td class="text-right">' + thousands_separators(data[i].maxOfferedQuantity) + '</td><td class="text-right">' + thousands_separators(data[i].unallocatedQuantity) + '</td><td>' + data[i].uom + '</td><td class="text-right ss' + cc + '">' + wtavg + '</td><td class="text-right">' + (minimuminc) + '</td>';
                            c = c + 1;
                            totquoteallocatedquan = 0; totallocatedquan = 0; wtavg = 0;

                        }
                        else {
                            var str = "<tr id=lowa" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>"; //<td>&nbsp;</td><td>&nbsp;</td>
                        }

                        str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td><td class=text-right >" + thousands_separators(data[i].biddedQuantity) + "</td><td class=text-right >" + thousands_separators(data[i].quantityAllocated) + "</td><td class=text-right>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                        str += "<td class=text-right>" + (data[i].vQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td>";


                        str += "</tr>";
                        jQuery('#tblBidSummary > tbody').append(str);

                        if (data[i].srNo == 'H1') {
                            $('#lowa' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })

                        }
                        totquoteallocatedquan = totquoteallocatedquan + (parseFloat(data[i].quantityAllocated) * parseFloat(data[i].lQuote))
                        totallocatedquan = totallocatedquan + parseFloat(data[i].quantityAllocated);
                        wtavg = totquoteallocatedquan / totallocatedquan;
                        $('.header').find(".ss" + cc).html(wtavg)
                    }
                }
                else if (parseInt(BidTypeID) == 7) {
                    counterForItenscount = 0;
                    $('#BidTrendGraph').css('display', 'block');
                    var TotalBidValue = ''; // TotalBidValueCeiling = '', TotalBidValueInvoice = '';

                    var Percentreduction = '', Percentreductionceiling = '', Percentreductioninvoice = '';
                    $('#divTarget').hide();
                    var sname = '';
                    var c = 1;
                    var ItemNameHead = stringDivider("Item Product Service", 5, "<br/>\n");

                    if (_bidclosingtype != 'undefined' && _bidclosingtype == 'S') {
                        var strHead = "<tr><th>S No</th><th>" + ItemNameHead + "</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid start price</th><th>Quantity</th><th>UOM</th><th>Minimum Dec.</th><th>Item Closing Time</th><th>Level</th><th>Vendor</th><th>Loading Factor - &lambda; (in %)</th><th>Initial Quote</th><th>Lowest Quote</th><th>Bid Value</th><th>Percentage Reduction (Target Price)</th><th>Percentage Reduction (Last Invoice Price)</th><th>Percentage Reduction (Bid start price)</th></tr>";
                    }
                    else {
                        var strHead = "<tr><th>S No</th><th>" + ItemNameHead + "</th><th>Target Price</th><th>Last Invoice Price</th><th>Bid start price</th><th>Quantity</th><th>UOM</th><th>Minimum Dec.</th><th>Level</th><th>Vendor</th><th>Loading Factor - &lambda; (in %)</th><th>Initial Quote</th><th>Lowest Quote</th><th>Bid Value</th><th>Percentage Reduction (Target Price)</th><th>Percentage Reduction (Last Invoice Price)</th><th>Percentage Reduction (Bid start price)</th></tr>";
                    }

                    jQuery('#tblBidSummary > thead').append(strHead);


                    for (var i = 0; i < data.length; i++) {

                        TotalBidValue = (parseFloat(data[i].quantity) * parseFloat(data[i].lQuote)).toFixed(2);

                        if (TotalBidValue != 0) {
                            if (data[i].targetPrice != 0) {
                                Percentreduction = parseFloat(100 - parseFloat(data[i].lQuote / data[i].targetPrice) * 100).toFixed(2) + ' %'
                            }
                            else {
                                Percentreduction = 'Not Specified';
                            }
                            if (data[i].lastInvoicePrice != 0) {
                                Percentreductioninvoice = parseFloat(100 - parseFloat(data[i].lQuote / data[i].lastInvoicePrice) * 100).toFixed(2) + ' %'
                            }
                            else {
                                Percentreductioninvoice = 'Not Specified';
                            }


                            Percentreductionceiling = parseFloat(100 - parseFloat(data[i].lQuote / data[i].ceilingPrice) * 100).toFixed(2) + ' %'
                        }
                        else {

                            Percentreduction = 'N/A';
                            Percentreductionceiling = 'N/A';
                            Percentreductioninvoice = 'N/A';
                        }

                        if (sname != data[i].destinationPort) {
                            sname = data[i].destinationPort
                            if (_bidclosingtype != 'undefined' && _bidclosingtype == 'S') {
                                var str = "<tr id=low" + i + "><td>" + c + "</td><td>" + data[i].destinationPort + "</td><td class=text-right>" + thousands_separators(data[i].targetPrice) + "</td><td class=text-right>" + thousands_separators(data[i].lastInvoicePrice) + "</td><td class=text-right>" + thousands_separators(data[i].ceilingPrice) + "</td><td class=text-right>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td class='text-right'>" + data[i].minimumDecreament + "</td><td>" + data[i].closingTime + "</td>";
                            }
                            else {
                                var str = "<tr id=low" + i + "><td>" + c + "</td><td>" + data[i].destinationPort + "</td><td class=text-right>" + thousands_separators(data[i].targetPrice) + "</td><td class=text-right>" + thousands_separators(data[i].lastInvoicePrice) + "</td><td class=text-right>" + thousands_separators(data[i].ceilingPrice) + "</td><td class=text-right>" + thousands_separators(data[i].quantity) + "</td><td>" + data[i].uom + "</td><td class='text-right'>" + data[i].minimumDecreament + "</td>";
                            }
                            counterForItenscount = counterForItenscount + 1;

                            if (counterForItenscount <= 6) {
                                fnPaintGraph(data[i].destinationPort, counterForItenscount, data[i].seId)
                            }
                            c = c + 1;
                        }
                        else {
                            if (_bidclosingtype != 'undefined' && _bidclosingtype == 'S') {
                                var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }
                            else {
                                var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            }

                        }


                        str += "<td>" + data[i].srNo + "</td><td>" + data[i].vendorName + "</td><td class='text-right'>" + thousands_separators(data[i].advFactor) + "</td><td>" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";

                        str += "<td class='text-right'>" + thousands_separators(data[i].lQuote == '0' ? '' : data[i].lQuote) + "</td>";
                        str += "<td class='text-right'>" + thousands_separators(TotalBidValue) + "</td>";

                        if (data[i].srNo == 'L1') {
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreduction + "</td>";
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreductioninvoice + "</td>";
                            str += "<td style='background-color: #d9edf7; color: #31708f;'>" + Percentreductionceiling + "</td>";



                        } else {
                            str += "<td>" + Percentreduction + "</td>";
                            str += "<td>" + Percentreductioninvoice + "</td>";
                            str += "<td>" + Percentreductionceiling + "</td>";

                        }
                        str += "</tr>";

                        jQuery('#tblBidSummary > tbody').append(str);

                        if (data[i].srNo == 'L1') {
                            $('#low' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })

                        }
                    }

                }
                else if (parseInt(BidTypeID) == 8) {

                    counterForItenscount = 0;
                    $('#BidTrendGraph').css('display', 'block');
                    var TotalBidValue = ''; // TotalBidValueCeiling = '', TotalBidValueInvoice = '';

                    var Percentreduction = '', Percentreductionceiling = '', Percentreductioninvoice = '';
                    $('#divTarget').hide();
                    var sname = '';
                    var c = 1;
                    var ItemNameHead = stringDivider("Item Product Service", 5, "<br/>\n");


                    //if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {

                    //    strHead = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Minimum Dec.</th><th>Vendor</th><th>Landed Price</th><th>Cess</th><th>GST %</th><th>NCV</th><th>Item Closing Time</th><th>Level</th><th>Initial Quote</th><th>Lowest Quote</th><th class=hide>Bid Value</th><th>Quantity Offered</th></tr>";
                    //}
                    //else {
                    strHead = "<tr><th>S No</th><th>Item/Product/Service</th><th>Target Price</th><th>Last Invoice Price</th><th>Quantity</th><th>UOM</th><th>Bid Start Price</th><th>Minimum Dec.</th><th>Vendor</th><th>Landed Price</th><th>Cess</th><th>GST %</th><th>NCV</th><th>Level</th><th>Initial Quote</th><th>Lowest Quote</th><th>Quantity Offered</th></tr>";
                    // }
                    jQuery('#tblBidSummary > thead').append(strHead);


                    for (var i = 0; i < data.length; i++) {

                        TotalBidValue = (parseFloat(data[i].quantity) * parseFloat(data[i].lQuote)).toFixed(2);
                        minimumdec = thousands_separators(data[i].minimumDecreament)// + ' ' + data[i].selectedCurrency
                        var desitinationport = data[i].destinationPort.replace(/<br\s*\/?>/gi, ' ');
                        if (TotalBidValue != 0) {
                            if (data[i].targetPrice != 0) {
                                Percentreduction = parseFloat(100 - parseFloat(data[i].lQuote / data[i].targetPrice) * 100).toFixed(2) + ' %'
                            }
                            else {
                                Percentreduction = 'Not Specified';
                            }
                            if (data[i].lastInvoicePrice != 0) {
                                Percentreductioninvoice = parseFloat(100 - parseFloat(data[i].lQuote / data[i].lastInvoicePrice) * 100).toFixed(2) + ' %'
                            }
                            else {
                                Percentreductioninvoice = 'Not Specified';
                            }


                            Percentreductionceiling = parseFloat(100 - parseFloat(data[i].lQuote / data[i].ceilingPrice) * 100).toFixed(2) + ' %'
                        }
                        else {

                            Percentreduction = 'N/A';
                            Percentreductionceiling = 'N/A';
                            Percentreductioninvoice = 'N/A';
                        }

                        if (sname != desitinationport) {
                            sname = desitinationport

                            //if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {

                            //    if (data[i].itemStatus == "Open") {

                            //        var str = '<tr id=low' + i + ' style="background-color: #32C5D2!important; color: #000000!important;"   class=header><td id=i_expandcollapse' + i + ' data-toggle="popover" data-trigger="hover" data-content="Collapse/Expand"  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')" >' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + ' data-toggle="popover" data-trigger="hover" data-content="Collapse/Expand"   data-placement="left"></a></td><td id=Sname' + i + ' ><a href="javascript:;" onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;">' + desitinationport + '</a></td><td class="text-right " id=TP' + i + '  >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td>' + data[i].closingTime + '</td>';
                            //    }
                            //    else {
                            //        var str = '<tr id=low' + i + ' class="header" ><td id=i_expandcollapse' + i + ' data-toggle="popover" data-trigger="hover" data-content="Collapse/Expand"  onclick="fnClickHeader(\'low_str' + i + '\',\'i_expandcollapse' + i + '\')">' + c + '</td><td class=hide><a class="btn btn-circle btn-success fa fa-arrow-down" id=i_expandcollapse' + i + '  data-trigger="hover"  data-content="Expand/Collapse"></a></td><td id=Sname' + i + ' ><a  href="javascript:;" onclick="fetchGraphData(' + data[i].coalID + ')" style="text-decoration:none;" >' + desitinationport + '</a></td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right"  id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class="text-right" id=quantity' + i + '  >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class="text-right" id=CP' + i + ' >' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td><td>' + data[i].closingTime + '</td>';
                            //    }

                            //}
                            //else {
                            var str = '<tr id=low' + i + ' class="header" ><td>' + c + '</td><td id=Sname' + i + '>' + desitinationport + '</td><td class="text-right" id=TP1' + i + ' >' + thousands_separators(data[i].targetPrice) + '</td><td class="text-right" id=lastinvoice1' + i + ' >' + thousands_separators(data[i].lastInvoicePrice) + '</td><td class=text-right id=quantity' + i + ' >' + thousands_separators(data[i].quantity) + '</td><td class="text-right">' + data[i].uom + '</td><td class=text-right id=CP' + i + '>' + thousands_separators(data[i].ceilingPrice) + '</td><td class="text-right" id=Mindec' + i + ' >' + minimumdec + '</td>';
                            //}
                            counterForItenscount = counterForItenscount + 1;

                            if (counterForItenscount <= 6) {
                                fnPaintGraph(desitinationport, counterForItenscount, data[i].coalID)
                            }
                            c = c + 1;

                        }
                        else {
                            var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";

                            //if (_bidClosingType != 'undefined' && _bidClosingType == 'S') {
                            //    var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            //}
                            //else {
                            var str = "<tr id=low" + i + "><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                            //}
                        }


                        str += "<td id=vname" + i + " >" + data[i].vendorName + "</td><td class=text-right>" + (data[i].landedPrice == '0' ? '' : thousands_separators(data[i].landedPrice)) + "</td><td class=text-right>" + (data[i].cess == '0' ? '' : thousands_separators(data[i].cess)) + "</td><td class=text-right>" + data[i].gst + "</td><td class=text-right>" + (data[i].ncv == '0' ? '' : thousands_separators(data[i].ncv)) + "</td><td>" + data[i].srNo + "</td><td class='text-right' >" + (data[i].iQuote != '-93' ? data[i].iQuote : thousands_separators(data[i].iPrice)) + "</td>";
                        str += "<td class='text-right' class='text-right' >" + (data[i].lQuote == '0' ? '' : thousands_separators(data[i].lQuote)) + "</td>";
                        str += "<td>" + (data[i].offeredQuan == '0' ? '' : thousands_separators(data[i].offeredQuan)) + "</td>";

                        str += "</tr>";

                        jQuery('#tblBidSummary > tbody').append(str);

                        if (data[i].srNo == 'L1') {
                            $('#low' + i).css({
                                'background-color': '#dff0d8',
                                'font-weight': 'bold',
                                'color': '#3c763d'
                            })

                        }
                    }

                }

                _bidarray.push(['VendorID', 'Price', 'Time', 'VendorName'])


                _timelft = $('#lblTimeLeft').text();

                if (_timelft == null || _timelft == '') {
                    _timelft = 0;
                }
                else {
                    _timelft = _timelft.slice(0, _timelft.indexOf(':'))


                }


                for (var prop = 0; prop < data.length; prop++) {

                    _bidarray.push([data[prop].shortName, parseInt(data[prop].lQuote), parseInt(_timelft), data[prop].vendorName]) //]
                }
                setTimeout(function () {
                    // saveAspdf()
                    jQuery.unblockUI();
                    setTimeout(function () {
                        window.print();
                        window.close();
                    }, 1000)
                }, 6000)

            }
            else {
                jQuery('#tblBidSummary > tbody').append("<tr><td colspan='18' style='text-align: center; color:red;'>No record found</td></tr>");
                jQuery.unblockUI();
            }
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                jQuery("#error").text(xhr.d);
            }
            return false;
            jQuery.unblockUI();
        }
    });
}

function fnfetchvendortotalSummary(BidID, BidTypeID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/FetchBidVendortotalSummary/?BidID=" + BidID + "&BidTypeID=" + BidTypeID + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            if (data.length > 0) {
                $('#tblbidvendortotalsummary').show();

                $('#HRTotsumm').removeClass('hide')
                jQuery("#tblbidvendortotalsummary").append("<thead><tr style='background: gray; color: #FFF'><th>Supplier</th><th style='width:15%!important;'>Total</th><th style='width:20%!important;' class=loadingfactor >Loading Factor - &lambda; (in %)</th></thead>");
                for (var i = 0; i < data.length; i++) {
                    jQuery("#tblbidvendortotalsummary").append("<tr><td>" + data[i].vendorName + "</td><td class=text-right >" + thousands_separators(data[i].totalamount) + "</td><td class='text-right loadingfactor'>" + data[i].advFactor + "</td></tr>");
                }
            }
            else {
                $('#HRTotsumm').addClass('hide')
                $('#tblbidvendortotalsummary').hide();
                jQuery("#tblbidvendortotalsummary").append("<tr colspan=2 style='text-align: center; color: Red' >No record's found</tr>");
            }
            if (BidTypeID == 6) {
                $('.loadingfactor').hide()
            }
            else {
                $('.loadingfactor').show()
            }
        }
    });
}
function FetchRecomendedVendor(bidid) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ApprovalAir/FetchRecomendedVendor/?BidID=" + bidid + "&UserID=" + encodeURIComponent(sessionStorage.getItem("UserID")),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {

            $('#tblapprovalprocess').empty()
            if (data.length > 0) {
                $('#tblapprovalprocess').show();

                $('#tblapprovalprocess').append('<tr style="background: #44b6ae;"><th colspan="5" style="font-size: 19px; text-align: left;color: #FFF;">Approval Details</th></tr><tr><th width="20%">Action Taken By</th><th width="20%">Remarks</th><th width="20%">Action Type</th><th style="display:none" id=thvendor width="20%">Recomended Vendor</th><th width="20%">Completion DT</th></tr>')

                for (var i = 0; i < data.length; i++) {
                    if (data[i].vendorName != "") {
                        $('#tblapprovalprocess').append('<tr><td width="20%">' + data[i].actionTakenBy + '</td><td width="20%">' + data[i].remarks + '</td><td width="20%">' + data[i].finalStatus + '</td><td width="20%">' + data[i].vendorName + '</td><td width="20%">' + data[i].receiptDt + '</td></tr>')
                        $('#thvendor').show();
                    }
                    else {
                        $('#tblapprovalprocess').append('<tr><td width="20%">' + data[i].actionTakenBy + '</td><td width="20%">' + data[i].remarks + '</td><td width="20%">' + data[i].finalStatus + '</td><td width="20%">' + data[i].receiptDt + '</td></tr>')
                        $('#thvendor').hide();
                    }
                }


            }
            else {
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
                $('#tblapprovalprocess').hide();
                jQuery.unblockUI();
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
var graphData = [];
function fnPaintGraph(shortname, counter, itemId) {


    $('#Items').append('<table  width="100%"  class=pagebreak border="1" style="border-collapse: collapse;" id="tblBidItem' + counter + '"></table>')
    if (counter == 1) {
        $('#tblBidItem' + counter).append('<tr><td width="100%"><div id="BidTrendGraph" style="width:100%;margin-top:10px;font-size:20px;line-height: 30px;padding-bottom: 8px;font-family:Arial, Helvetica, sans-serif; font-weight: 200;text-align: center;"><div style="clear: both;"></div> <label style="text-align: center;">Bid Graph Trend</label></div></td></tr>')
    }
    $('#tblBidItem' + counter).append('<tr style="background: #44b6ae;"  width="100%" ><th colspan=2 style="font-size: 19px; text-align: left;color: #FFF;">' + shortname + '</th></tr>')
    $('#tblBidItem' + counter).append('<tbody><tr><td><table width="100%"  cellpadding="8" style="border-collapse: collapse;display:block;"  border="1" id="tblForTrendGraphs' + counter + '"></table></td></tr><tr><td><div id="linechart_material' + counter + '" style="text-align:center;min-height:300px;width:900px;margin-left:200px;margin-bottom:40px;"></div></td></tr></tbody>'); //
    fetchGraphData(itemId, counter);
    linegraphsforItems(itemId, counter);
}
function fetchGraphData(itemId, counter) {

    var _bidTypeID;
    if (getUrlVarsURL(decryptedstring)["BidTypeID"]) {
        _bidTypeID = getUrlVarsURL(decryptedstring)["BidTypeID"];
    }

    var _date;
    var _finaldate = ''
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryTrendGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=" + sessionStorage.getItem('UserID') + "&chartFor=sample",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            $("#tblForTrendGraphs" + counter).empty();
            if (data) {
                var str = '';
                var quorem = (data.length / 3) + (data.length % 3);
                var quo = (data.length / 3);

                var len = parseInt(quo) + parseInt(quorem);

                $("#tblForTrendGraphs" + counter).append('<tr><th width=10%>Submission Time</th><th width=10%>Quoted Price</th><th width=10%>Vendor</th><th style="border:none;">&nbsp;</th><th width=10%>Submission Time</th><th width=10%>Quoted Price</th><th width=10%>Vendor</th><th style="border:none;">&nbsp;</th><th width=10%>Submission Time</th><th width=10%>Quoted Price</th><th width=10%>Vendor</th></tr>');
                for (var i = 0; i < parseInt(quorem); i++) {
                    _date = new Date(data[i].submissionTime);
                    _date = fnConverToLocalTime(_date);
                    _finaldate = _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear() + " " + minutes_with_leading_zeros(new Date(data[i].submissionTime).getHours()) + ":" + minutes_with_leading_zeros(new Date(data[i].submissionTime).getMinutes() + ":" + minutes_with_leading_zeros(new Date(data[i].submissionTime).getSeconds()));
                    str = str + '<tr><td>' + _finaldate + '</td><td>' + data[i].quotedPrice + '</td><td>' + data[i].vendorName + '</td><td style="border: none;">&nbsp;</td>';

                    var z = (parseInt(quorem) + i);
                    if (z <= data.length - 1) {
                        _date = new Date(data[z].submissionTime);
                        _date = fnConverToLocalTime(_date);
                        _finaldate = _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear() + " " + minutes_with_leading_zeros(new Date(data[z].submissionTime).getHours()) + ":" + minutes_with_leading_zeros(new Date(data[z].submissionTime).getMinutes() + ":" + minutes_with_leading_zeros(new Date(data[z].submissionTime).getSeconds()));
                        str = str + '<td>' + _finaldate + '</td><td>' + data[z].quotedPrice + '</td><td>' + data[z].vendorName + '</td><td style="border: none;">&nbsp;</td>';
                    }

                    var o = (parseInt(quorem) * 2) + i;
                    if (o <= data.length - 1) {
                        _date = new Date(data[o].submissionTime);
                        _date = fnConverToLocalTime(_date);
                        _finaldate = _date.getDate() + "/" + (_date.getMonth() + 1) + "/" + _date.getFullYear() + " " + minutes_with_leading_zeros(new Date(data[o].submissionTime).getHours()) + ":" + minutes_with_leading_zeros(new Date(data[o].submissionTime).getMinutes() + ":" + minutes_with_leading_zeros(new Date(data[o].submissionTime).getSeconds()));
                        str = str + '<td>' + _finaldate + '</td><td>' + data[o].quotedPrice + '</td><td>' + data[o].vendorName + '</td></tr>';
                    }

                }

                $("#tblForTrendGraphs" + counter).append(str);

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
}
var Vendorseries = "";
var graphtime = [];
var Seriesoption = [];
var FinalQuotes = [];
var Quotes = "";
var minprice;
var maxprice;
var colorArray = ['#007ED2', '#f15c80', '#90ED7D', '#FF7F50', '#f15c80', '#FF5733', '#96FF33', '#33FFF0', '#F9FF33', '#581845', '#0B0C01', '#0C0109', '#DAF7A6', '#FFC300', '#08010C'];
function linegraphsforItems(itemId, counter) {

    var _bidTypeID;
    var _date;
    if (getUrlVarsURL(decryptedstring)["BidTypeID"]) {
        _bidTypeID = getUrlVarsURL(decryptedstring)["BidTypeID"];
    }


    graphtime = [];
    Vendorseries = "";

    Seriesoption = [];


    setTimeout(function () {

        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "BidVendorSummary/fetchDataForBidSummaryGraph/?SeId=" + itemId + "&BidId=" + getUrlVarsURL(decryptedstring)["BidID"] + "&BidTypeId=" + _bidTypeID + "&CustomerId=" + sessionStorage.getItem('CustomerID') + "&UserId=X-X",//+ sessionStorage.getItem('UserID'),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data, status, jqXHR) {
                minprice = parseInt(data[0].minMaxprice[0].minPrice - 5);
                maxprice = parseInt(data[0].minMaxprice[0].maxPrice + 5);

                $('#lblbidstarttime').text(fnConverToLocalTime(data[0].bidStartEndTime[0].bidStartTime));
                $('#lblbidendtime').text(fnConverToLocalTime(data[0].bidStartEndTime[0].bidEndTime));

                if (data[0].submissionTime.length > 0) {

                    for (var x = 0; x < data[0].submissionTime.length; x++) {
                        graphtime.push(data[0].submissionTime[x].subTime);
                    }

                }
                Vendorseries = "";
                Quotes = "";
                var values = 0;
                Seriesoption = [];
                if (data[0].vendorNames.length > 0) {

                    for (var i = 0; i < data[0].vendorNames.length; i++) {

                        Quotes = "";
                        values = null;;

                        for (var j = 0; j < data[0].quotesDetails.length; j++) {
                            if (data[0].vendorNames[i].vendorID == data[0].quotesDetails[j].vendorID) {
                                Quotes = Quotes + '["' + data[0].quotesDetails[j].subTime + '",' + data[0].quotesDetails[j].quotedPrice + '],';
                                values = data[0].quotesDetails[j].quotedPrice;
                            }
                            else {

                                Quotes = Quotes + '["' + data[0].quotesDetails[j].subTime + '",' + values + '],';
                            }
                        }

                        Quotes = Quotes.slice(0, -1);
                        Vendorseries = '{ "name" :"' + data[0].vendorNames[i].vendorName + '", "color": "' + colorArray[i] + '","data": [' + Quotes + ']}';
                        Seriesoption.push(JSON.parse(Vendorseries));

                    }


                }

                $('#linechart_material' + counter).highcharts({
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

                        categories: graphtime

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
                    },
                    exporting: {
                        showTable: false
                    }

                });

                // }, 200 );

            },
            error: function (xhr, status, error) {

                var err = eval("(" + xhr.responseText + ")");
                if (xhr.status === 401) {
                    error401Messagebox(err.Message);
                }

                return false;
                jQuery.unblockUI();
            }


        }, 500 * counter);

    })

}



function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}
function minutes_with_leading_zeros(dtmin) {
    return (dtmin < 10 ? '0' : '') + dtmin;
}

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