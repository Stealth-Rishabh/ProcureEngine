jQuery(document).ready(function () {
  
    Pageloaded()
    var x = isAuthenticated();
    setInterval(function () { Pageloaded() }, 15000);
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if (sessionStorage.getItem("UserType") == "P" || sessionStorage.getItem("UserType") == "V") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }
    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);
    var _RFQid = getUrlVarsURL(decryptedstring)["RFQID"];

    var version = 0;
    if (sessionStorage.getItem('RFQVersionId') > 0) {
        version = parseInt(sessionStorage.getItem('RFQVersionId'))// - 1;

    }
    sessionStorage.setItem('hddnRFQID', _RFQid)
    fetchReguestforQuotationDetails();
    fetchRFIParameteronload(getUrlVarsURL(decryptedstring)["Ver"]);

    Metronic.init();
    setCommonData();

});

function fetchReguestforQuotationDetails() {
    var attachment = '';
    var termattach = '';
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQDetails/?VendorID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            if (RFQData.length > 0) {
                attachment = RFQData[0].RFQAttachment.replace(/\s/g, "%20")
                termattach = RFQData[0].RFQTermandCondition.replace(/\s/g, "%20")
            } else {
                attachment = attachment;
                termattach = termattach;
            }
            sessionStorage.setItem('CurrentrfiID', RFQData[0].RFQId)
            jQuery('#RFQSubject').html(RFQData[0].RFQSubject)

            sessionStorage.setItem('hdnFromUserId', RFQData[0].RFQConfiguredBy)
            $('#Currency').html(RFQData[0].CurrencyNm)
            jQuery('#RFQDescription').html(RFQData[0].RFQDescription)
            jQuery('#RFQDeadline').html(RFQData[0].RFQDeadline)
            jQuery('#ConversionRate').html(RFQData[0].RFQConversionRate)
            $('#TermCondition').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + termattach + '').html(RFQData[0].RFQTermandCondition)
            $('#Attachment').attr('href', 'PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '').html(RFQData[0].RFQAttachment)



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
function fetchRFIParameteronload(ver) {
    var attachment = '';
    var vendorAttachment = '';
    var replaced = '';
   
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFQParameter/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblServicesProduct").empty();
            $('#divdomestic').show();
            var description = "";

            if (data.length > 0) {
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th></th><th>Short Name</th><th>Attachment</th><th>Quoted Price<br/>(Unit Rate-Ex.Taxes)</th><th>Quoted Price<br/>(Unit Rate-Incl.Taxes)</th><th>Qty</th><th>UOM</th><th>Response Attachment</th><th>TAT</th><th>Delivery Location</th><th class='hidden'>Status</th><th class='hidden'>Description</th></tr></thead>");
                
                $('#txtvendorremarks').text(data[0].VendorRemarks);

                for (var i = 0; i < data.length; i++) {
                    vendorAttachment = data[i].VendorAttachment.replace(/\s/g, "%20");
                    attachment = data[i].AttachmentFile.replace(/\s/g, "%20");
                    description = stringDivider(data[i].RFQDescription, 40, "<br/>\n");
                    var detailsdesc = "";
                    var price = "";
                    var pricewithtax = "";
                    if (data[i].RFQVendorPrice == "0") {
                        price = "Not Quoted"
                    }
                    else {
                        price = thousands_separators(data[i].RFQVendorPrice);
                    }
                    if (data[i].RFQVendorPricewithTax == "0") {
                        pricewithtax = "Not Quoted"
                    }
                    else {
                        pricewithtax = thousands_separators(data[i].RFQVendorPricewithTax);
                    }
                   // alert(detailsdesc)
                    if (data[i].BOQparentId == 0) {
                        detailsdesc = (data[i].RFQDescription).replace(/(\r\n|\n|\r)/gm, " ");
                        detailsdesc = detailsdesc.replace(/&lt;br&gt;/g, " ");
                       
                        if (data[i].status == 'Yes') {
                            if (data[i].RFQVendorPrice > 0) {
                                jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td><button type="button" class="btn default btn-xs green-haze-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].RFQParameterId + '\',\'' + sessionStorage.getItem("CurrentrfiID") + '\',\'mks' + i + '\',\'mkswithtax' + i + '\',\'' + data[i].RFQuantity + '\',\'' + ver + '\')">BOQ/BOM </button></td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].RFQShortName + '</a></td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '>' + data[i].AttachmentFile + '</a></td><td>' + price + '</td><td>' + pricewithtax + '</td><td>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td><a id=filepthattach' + i + ' href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + vendorAttachment + ' style="float:left;margin-top: 5px;">' + data[i].VendorAttachment + '</a><span class="display-none" style="float:left;margin-top:0px;cursor:pointer;margin-left: 3px;" id=rmoveAttachment' + i + ' onclick=ajaxFileDelete(\'rmoveAttachment' + i + '\',\'file' + i + '\',\'filepthattach' + i + '\',\'' + data[i].RFQParameterId + '\')><i class="fa fa-times-circle-o" id="i1"></i></span></td><td class=fit>' + data[i].TAT + '</td><td class=hidden >' + data[i].RFQBoq + '</td><td>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class="hidden">' + data[i].status + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].RFQRemark + '</td></tr>').appendTo("#tblServicesProduct");

                            }
                            else {

                                jQuery('<tr id=trid' + i + ' ><td class=hidden>' + data[i].RFQParameterId + '</td><td class=hidden>' + data[i].RFQID + '</td><td><button type="button"  class="btn default btn-xs red-stripe" data-toggle="modal" href="#responsive" onclick="mapQuestion(\'' + data[i].RFQParameterId + '\',\'' + sessionStorage.getItem("CurrentrfiID") + '\',\'mks' + i + '\',\'mkswithtax' + i + '\',\'' + data[i].RFQuantity + '\',\'' + ver + '\')">BOQ/BOM</button></td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].RFQShortName + '</a></td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '>' + data[i].AttachmentFile + '</a></td><td>' + price + '</td><td>' + pricewithtax + '</td><td>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td><a id=filepthattach' + i + ' href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + vendorAttachment + ' style="float:left;margin-top: 5px;">' + data[i].VendorAttachment + '</a><span class="display-none" style="float:left;margin-top:0px;cursor:pointer;margin-left: 3px;" id=rmoveAttachment' + i + ' onclick=ajaxFileDelete(\'rmoveAttachment' + i + '\',\'file' + i + '\',\'filepthattach' + i + '\',\'' + data[i].RFQParameterId + '\')><i class="fa fa-times-circle-o" id="i1"></i></span></td><td class=fit>' + data[i].TAT + '</td><td class=hidden >' + data[i].RFQBoq + '</td><td>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class="hidden">' + data[i].status + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].RFQRemark + '</td></tr>').appendTo("#tblServicesProduct");

                            }
                           
                        }
                        else {
                            // For Non BOQ Items
                            jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td>&nbsp;</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].RFQShortName + '</a></td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '>' + data[i].AttachmentFile + '</a></td><td>' + price + '</td><td>' + pricewithtax + '</td><td>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td><a id=filepthattach' + i + ' href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + vendorAttachment + ' style="float:left;margin-top: 5px;">' + data[i].VendorAttachment + '</a><span class="display-none" style="float:left;margin-top:0px;cursor:pointer;margin-left: 3px;" id=rmoveAttachment' + i + ' onclick=ajaxFileDelete(\'rmoveAttachment' + i + '\',\'file' + i + '\',\'filepthattach' + i + '\',\'' + data[i].RFQParameterId + '\')><i class="fa fa-times-circle-o" id="i1"></i></span></td><td class=fit>' + data[i].TAT + '</td><td class=hidden >' + data[i].RFQBoq + '</td><td>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class="hidden">' + data[i].status + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].RFQRemark + '</td></tr>').appendTo("#tblServicesProduct");
                        }


                        //Display of close button for attachment Removal
                        if (data[i].VendorAttachment != '') {
                            $('#file' + i).attr('disabled', true);
                            $('#rmoveAttachment' + i).removeClass('display-none');
                        }
                    }
                    else {
                        jQuery('<tr id=trid' + i + '  class=hide ><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td>&nbsp;</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].RFQShortName + '</a></td><td><a href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + attachment + '>' + data[i].AttachmentFile + '</a></td><td>' + price + '</td><td>' + thousands_separators(data[i].RFQVendorPricewithTax) + ' /></td><td>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td><a id=filepthattach' + i + ' href=PortalDocs/RFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + vendorAttachment + ' style="float:left;margin-top: 5px;">' + data[i].VendorAttachment + '</a><span class="display-none" style="float:left;margin-top:0px;cursor:pointer;margin-left: 3px;" id=rmoveAttachment' + i + ' onclick=ajaxFileDelete(\'rmoveAttachment' + i + '\',\'file' + i + '\',\'filepthattach' + i + '\',\'' + data[i].RFQParameterId + '\')><i class="fa fa-times-circle-o" id="i1"></i></span></td><td class=fit>' + data[i].TAT + '</td><td class=hidden >' + '' + '</td><td>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class="hidden">' + data[i].status + '</td><td class="hidden">' + '' + '</td><td class="hidden">' + '' + '</td></tr>').appendTo("#tblServicesProduct");
                    }

                }// End For loop

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
            return false;
            jQuery.unblockUI();
        }
    });
}
function showDetailedDescription(descText) {
   
    $("#paraItemDescription").html(descText);
}
function mapQuestion(RFQParameterId, RFQId, mskNo, mskNowithTax, quantity, version) {

    fetchRFIParameterComponent(version, RFQParameterId)
}
function fetchRFIParameterComponent(version, BoqPID) {
   
    //alert(sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFIParameterComponent/?RFQId=" + sessionStorage.getItem("CurrentrfiID") + "&BOQparentId=" + BoqPID + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + version)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchRFIParameterComponent/?RFQId=" + sessionStorage.getItem("CurrentrfiID") + "&BOQparentId=" + BoqPID + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + version,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblRFQParameterComponet").empty();
            $('#scrolr').show();
           
            if (data.length > 0) {
                jQuery("#tblRFQParameterComponet").append("<thead><tr style='background: gray; color: #FFF;'><th>Short Name</th><th>Quoted Price (Unit Rate - Ex. Taxes)</th><th>Quoted Price(Unit Rate - Incl.Taxes)</th><th>Quantity</th><th>UOM</th><th class=hidden>Remark</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {
                    jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].RFQParameterId + '</td><td class=hidden >' + data[i].RFQID + '</td><td>' + data[i].RFQShortName + '</td><td>' + thousands_separators(data[i].RFQVendorPrice) +'</td><td>' + thousands_separators(data[i].RFQVendorPricewithTax) + '</td><td class=text-right>' + thousands_separators(data[i].RFQuantity) + '</td><td>' + data[i].RFQUomId + '</td><td class=hidden>' + data[i].RFQRemark + '</td><td class=hidden>' + data[i].RFQDescription + '</td><td class=hidden >' + data[i].RFQBoq + '</td><td class=hidden>' + data[i].RFQDelivery + '</td><td class=hidden>' + data[i].BOQparentId + '</td><td class=hidden>' + data[i].SeqNo + '</td><td class=hidden>' + data[i].status + '</td></tr>').appendTo("#tblRFQParameterComponet");
                }
            }
            else {

                jQuery("#tblRFQParameterComponet").append('<tr><td>No Information is there..</td></tr>');
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
            return false;
            jQuery.unblockUI();
        }
    });
}