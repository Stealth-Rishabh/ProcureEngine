

function fetchAttachments() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + sessionStorage.getItem('UserID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {

            jQuery("#tblAttachments").empty();
            jQuery("#tblotherrfqattachmentprev").empty();
            if (data[0].attachments.length > 0) {
                jQuery("#tblAttachments").append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")
                jQuery("#tblotherrfqattachmentprev").append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")
                $('#div_attachments').removeClass('hide')
                $('#div_otherrfqattachprev').removeClass('hide')
                $('#headerotherrfqattach').removeClass('hide')
                $('#wrap_scrollerPrevAtt').show();
                for (var i = 0; i < data[0].attachments.length; i++) {
                    var str = "<tr><td style='width:50%!important'>" + data[0].Attachments[i].rfqAttachmentDescription + "</td>";
                    str += '<td class=style="width:50%!important"><a id=eRFqvendorAtt' + i +' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick="DownloadFileVendor(this) >' + data[0].attachments[i].rfqAttachment + '</a></td>';
                    jQuery('#tblAttachments').append(str);
                    jQuery('#tblotherrfqattachmentprev').append(str);
                }
            }
            else {
                $('#div_attachments').addClass('hide')
                $('#div_otherrfqattachprev').addClass('hide')
                $('#headerotherrfqattach').addClass('hide')
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
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID'));
}
function DownloadFileVendor(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/' + sessionStorage.getItem('RFQVersionId'));
}  
function fetchRFQParameterComponent(version, BoqPID) {
   

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQfetchTCQuotation/?RFQId=" + sessionStorage.getItem("hddnRFQID") + "&ParameterID=" + BoqPID + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + version,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblRFQParameterComponet").empty();
            $('#scrolr').show();

            if (data.length > 0) {

                jQuery("#tblRFQParameterComponet").append("<thead><tr style='background: gray; color: #FFF;'><th>Commercial Terms</th><th>Applicable Rate (%)</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {

                    
                    if (data[i].isDefault == "N") {
                        jQuery('<tr id=trid' + i + '><td class=hidden >' + data[i].rfqParameterId + '</td><td class=hidden >' + data[i].rfqid + '</td><td class=hidden >' + data[i].tcid + '</td><td>' + data[i].tCName + '</td><td><input type="text"  id="mkswithtax1' + i + '" class="form-control text-right" value="' + thousands_separators(data[i].rfqVendorPricewithTax) + '"  autocomplete=off   onkeyup="this.value = minmax(this.value, 0, 50)" /></td></tr>').appendTo("#tblRFQParameterComponet");

                    }
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

function fetchRFQLevelTC(ver) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQfetchTCQuotation/?RFQId=" + sessionStorage.getItem("hddnRFQID") + "&ParameterID=" + 0 + "&VendorID=" + sessionStorage.getItem("VendorId") + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            
            jQuery("#tbltermsconditionprev").empty();
            $('#scrolr').show();
            
            if (data.length > 0) {
               
                jQuery("#tbltermsconditionprev").append("<thead><tr style='background: gray; color: #FFF;'><th>Other Commercial Terms</th><th>Our Requirement</th><th>Your Offer</th></tr></thead>");
                for (var i = 0; i < data.length; i++) {
                    
                    jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].tcid + '</td><td class=hidden >' + data[i].rfqid + '</td><td class=hide>' + data[i].conditionType + '</td><td style="width:20%">' + data[i].tcName + '</td><td>' + data[i].requirement + '</td><td><label class="control-label" >' + data[i].rfqRemark + '</label></td></tr>').appendTo("#tbltermsconditionprev");
                }
            }
            else {

                jQuery("#tbltermsconditionprev").append('<tr><td>No Information is there..</td></tr>');
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

function fetchRFQResponse(Flag, version) {

    var strprev = "";
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchVendorResponse/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + version + "&Flag=" + Flag,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            if (Flag == 'Question') {
               
                jQuery("#tblQuestionsPrev").empty();

                if (data.length > 0) {
                    $('#headerspecificresponse').removeClass('hide')
                    $('#divspecificresponse').removeClass('hide')
                   
                    jQuery('#tblQuestionsPrev').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Questions</th><th class='bold' style='width:30%!important'>Our Requirement</th><th style='width:40%!important'>Answer</th></tr></thead>");

                    for (var i = 0; i < data.length; i++) {

                        
                        strprev = "<tr><td style='width:30%!important'>" + data[i].rfqQuestions + "</td>";
                        
                        strprev += "<td style='width:30%!important'>" + data[i].rfqQuestionsRequirement + "</td>";
                        
                        strprev += '<td style="width:40%!important"><label class="control-label" >' + data[i].answer + '</label></td></tr>';
                       
                        jQuery('#tblQuestionsPrev').append(strprev);

                    }
                }
                else {
                    $('#headerspecificresponse').addClass('hide')
                    $('#divspecificresponse').addClass('hide')
                }
            }
            else {

                
                jQuery("#tblAttachmentsPrev").empty();
                if (data.length > 0) {
                    $('#headerresposeatt').removeClass('hide')
                    $('#dicresponseatt').removeClass('hide')
                   
                    jQuery('#tblAttachmentsPrev').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>");

                    for (var i = 0; i < data.length; i++) {
                        var str = "<tr><td style='width:47%!important'>" + data[i].attachmentdescription + "</td>";
                        str += '<td class=style="width:47%!important"><a id=attvendor'+i+' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a></td>';
                        jQuery('#tblAttachmentsPrev').append(str);
                        
                    }
                }
                else {
                    $('#headerresposeatt').addClass('hide')
                    $('#dicresponseatt').addClass('hide')
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
}

function fetchReguestforQuotationDetails() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced1 = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (RFQData) {

            //sessionStorage.setItem('hddnRFQID', RFQData[0].general[0].rfqid)
           
            $('#filepthtermsPrev').html(RFQData[0].general[0].rfqTermandCondition);
            //Preview Details
           

            jQuery('#lblRfqsubject').html(RFQData[0].general[0].rfqSubject)

            jQuery('#lblrfqstartdate').html(RFQData[0].general[0].rfqStartDate)
            jQuery('#lblrfqenddate').html(RFQData[0].general[0].rfqEndDate)
            jQuery('#lblrfqdescription').html(RFQData[0].general[0].rfqDescription)

            jQuery("#dropCurrencyPrev").html(RFQData[0].general[0].currencyNm)
            jQuery('#lblConversionRatePrev').html(RFQData[0].general[0].rfqConversionRate)
            jQuery("#txtRFQReferencePrev").html(RFQData[0].general[0].rfqReference);



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
    jQuery.unblockUI();
}



function fetchRFIParameteronload(ver) {
    fetchRFQLevelTC(ver);
    var attachment = '';
    var vendorAttachment = '';
    var replaced = '';
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchRFQParameter/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery('#icon').html('<i class="fa fa-list-ul"></i>');
            jQuery("#tblServicesProduct").empty();
            jQuery("#tblRFQPrev").empty();

            $('#divdomestic').show();
            var description = "";
            var totalammwithoutGST = 0;
            var totalammwithGST = 0;
           // alert(data.length)
            if (data.length > 0) {
               
                jQuery("#tblRFQPrev").append("<thead><tr style='background: gray; color: #FFF;'><th>Item/Service</th><th>Delivery Location</th><th>UOM</th><th>Qty</th><th class=hide>TAT</th><th class=hide>Currency</th><th class=hide>Delivery Location</th><th>Landed Unit Price<br/>(Without GST)</th><th>Landed Unit Price<br/>(With GST)</th><th>Amount<br/>(Without GST)</th><th>Amount<br/>(With GST)</th><th class='hidden'>Description</th></tr></thead>");
                
                $('#txtvendorremarks').val(data[0].vendorRemarks);
                for (var i = 0; i < data.length; i++) {
                    description = stringDivider(data[i].rfqDescription, 40, "<br/>\n");
                    var detailsdesc = (data[i].rfqDescription).replace(/(\r\n|\n|\r)/gm, "");
                    detailsdesc = detailsdesc.replace(/'/g, '');
                    $('#wrap_scrollerPrev').show();
                  
                    totalammwithoutGST = totalammwithoutGST + (data[i].rfqPriceWithoutGST * data[i].rfQuantity);
                    totalammwithGST = totalammwithGST + (data[i].rfqVendorPricewithTax * data[i].rfQuantity);
                    jQuery('<tr id=trid' + i + '><td class=hidden>' + data[i].rfqParameterId + '</td><td class=hidden>' + data[i].rfqid + '</td><td><a href="#responsiveDescModal" data-toggle="modal" onClick="showDetailedDescription(\'' + detailsdesc + '\')" >' + data[i].rfqShortName + '</a></td><td>' + data[i].rfqDelivery + '</td><td>' + data[i].rfqUomId + '</td><td>' + thousands_separators(data[i].rfQuantity) + '</td><td class="fit hide">' + data[i].tat + '</td><td class="fit hide">' + $('#txtcurrency').val() + '</td><td class=hide>' + data[i].rfqDelivery + '</td><td class="text-right">' + thousands_separators(data[i].rfqPriceWithoutGST) + '</td><td class="text-right">' + thousands_separators(data[i].rfqVendorPricewithTax) + '</td><td class="text-right">' + thousands_separators((data[i].rfqPriceWithoutGST * data[i].rfQuantity).round(2)) + '</td><td class="text-right">' + thousands_separators((data[i].rfqVendorPricewithTax * data[i].rfQuantity).round(2)) + '</td><td class="hidden">' + description + '</td><td class="hidden">' + data[i].rfqRemark + '</td></tr>').appendTo("#tblRFQPrev");

                }
                jQuery('<tr><td colspan=6><b>Total</b></td><td class="text-right">' + thousands_separators(totalammwithoutGST.round(2)) + '</td><td class="text-right">' + thousands_separators(totalammwithGST.round(2)) + '</td></tr>').appendTo("#tblRFQPrev");
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



setTimeout(function () { sessionStorage.removeItem('selectedboqtxtboxid') }, 5000);
sessionStorage.removeItem('selectedboqtxtboxidTax');



