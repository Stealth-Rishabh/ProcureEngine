

var _RFQBidType = "";
function GetQuestions() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem("VendorId") + "&UserID=X",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            jQuery("#tblRFQtechqueryPrev").empty();

            if (data.length > 0) {
                $('#h3techquery').removeClass('hide')
                $('#div_technicalquery').removeClass('hide')
                jQuery('#tblRFQtechqueryPrev').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Questions</th><th style='width:10%!important'>Created By</th><th style='width:30%!important'>Answer</th><th style='width:20%!important'>Attachment</th></tr></thead>");
                $('#wrap_scrollertechPrev').removeClass('hide')

                sessionStorage.setItem('HeaderID', data[0].headerid)
                for (var i = 0; i < data.length; i++) {

                    str = '<tr id=trquesid' + (i + 1) + '><td class=hide id=ques' + i + '>' + data[i].id + '</td><td>' + data[i].question + '</td><td>' + data[i].createdBy + '</td>';
                    str += '<td><textarea onkeyup="replaceQuoutesFromString(this)" name=answer rows=2 class="form-control" maxlength=1000  autocomplete=off id=answer' + i + ' >' + data[i].answer + '</textarea></td>';
                    str += "<td><span style='width:380px!important' class='btn blue'><input type='file' id='fileToUpload" + i + "' name='fileToUpload" + i + "' onchange='checkfilesize(this);' /></span></td>";
                    jQuery('#tblRFQtechqueryPrev').append(str);
                    $('#answer' + i).maxlength({
                        limitReachedClass: "label label-danger",
                        alwaysShow: true
                    });

                }
            }
            else {
                //jQuery('#tblquestions').append("<tr><td>No Questions !!</td></tr>")
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;

        }
    })
}
function GetSubmittedQuery() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem("VendorId") + "&UserID=X",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            jQuery("#tblRFQtechqueryPrev").empty();
            $('#btnsubmitquery').addClass('hide')

            if (data.length > 0) {

                $('#h3techquery').removeClass('hide')
                $('#div_technicalquery').removeClass('hide')
                jQuery('#tblRFQtechqueryPrev').append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:30%!important'>Questions</th><th style='width:10%!important'>Created By</th><th style='width:30%!important'>Answer</th><th style='width:20%!important'>Attachment</th></tr></thead>");
                $('#wrap_scrollertechPrev').removeClass('hide')

                sessionStorage.setItem('HeaderID', data[0].headerid)
                for (var i = 0; i < data.length; i++) {

                    str = '<tr id=trquesid' + (i + 1) + '><td class=hide id=ques' + i + '>' + data[i].id + '</td><td>' + data[i].question + '</td><td>' + data[i].createdBy + '</td>';
                    str += '<td>' + data[i].answer + '</td>';
                    if (data[i].attachment != "") {
                        str += '<td><a style="pointer: cursur; text-decoration:none; "  id=eRFQVQueryFiles' + i + ' href="javascript: ; " onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a></td>';
                    }
                    else {
                        str += '<td>No Attachment</td>'
                    }
                    jQuery('#tblRFQtechqueryPrev').append(str);

                }
            }
            else {
                $('#h3techquery').addClass('hide')
                $('#div_technicalquery').addClass('hide')
            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText;//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('spandanger', '');
            }
            jQuery.unblockUI();
            return false;

        }
    })
}
function DownloadFileVendor(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/TechQuery');
}
$(document).on('keyup', '.form-control', function () {
    if ($.trim($('.form-control').val()).length) {
        $(this).addClass('has-success');
    }
});
function fnsubmitQuery() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var flag = "T";
    var rowCount = jQuery('#tblRFQtechqueryPrev tr').length;
    for (i = 0; i < rowCount - 1; i++) {
        if ($("#answer" + i).val() == "" || $("#answer" + i).val() == "0") {
            $('#answer' + i).removeClass('has-success')
            $('#answer' + i).css("border", "1px solid red")
            flag = "F";

        }
        else {
            flag = "T"
        }

    }
    if (flag == "T") {
        var i = 0;
        var quesquery = "";
        var attchname = "";
        var ext = "";
        $("#tblRFQtechqueryPrev> tbody > tr").each(function (index) {
            var this_row = $(this);
            attchname = ''; ext = '';
            attchname = jQuery('#fileToUpload' + i).val().substring(jQuery('#fileToUpload' + i).val().lastIndexOf('\\') + 1)
            ext = $('#fileToUpload' + i).val().substring($('#fileToUpload' + i).val().lastIndexOf('.') + 1);
            attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
            attchname = attchname.replace('.', '@')
            quesquery = quesquery + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim($('#answer' + i).val()) + '~' + attchname + '#';

            //Upload Files on aZURE bLOB
            if (attchname != "" && attchname != null && attchname != undefined) {
                fnUploadFilesonAzure('fileToUpload' + i, $('#fileToUpload' + i).val(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/TechQuery');
            }
            i++;
        });
        var data = {
            "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
            "QuesString": quesquery,
            "UserID": sessionStorage.getItem('UserID'),
            "VendorID": parseInt(sessionStorage.getItem("VendorId")),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "Headerid": parseInt(sessionStorage.getItem('HeaderID')),
            "PendingOn": "A"
        }

        console.log(JSON.stringify(data))
        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "eRFQApproval/eInsQueryTovendorApproversforAllTechnical",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {
                bootbox.alert("Query's Response Submitted Successfully.", function () {
                    window.location = 'VendorHome.html';
                    jQuery.unblockUI();

                });

            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    fnErrorMessageText('spandanger', '');
                }
                jQuery.unblockUI();
                return false;
            }

        });

    }
    else {
        $('.alert-danger').show();
        $('#error').text('Please fill Answer.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery.unblockUI();
    }
}
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

            jQuery("#tblotherrfqattachmentprev").empty();
            if (data[0].attachments.length > 0) {

                jQuery("#tblotherrfqattachmentprev").append("<thead><tr  style='background: gray; color: #FFF;'><th class='bold' style='width:50%!important'>Description</th><th style='width:50%!important'>Attachment</th></tr></thead>")
                $('#div_attachments').removeClass('hide')
                $('#div_otherrfqattachprev').removeClass('hide')
                $('#headerotherrfqattach').removeClass('hide')
                $('#wrap_scrollerPrevAtt').show();
                for (var i = 0; i < data[0].attachments.length; i++) {
                    var str = "<tr><td style='width:50%!important'>" + data[0].Attachments[i].rfqAttachmentDescription + "</td>";
                    str += '<td class=style="width:50%!important"><a id=eRFqvendorAtt' + i + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick="DownloadFileVendor(this) >' + data[0].attachments[i].rfqAttachment + '</a></td>';
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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
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
                        str += '<td class=style="width:47%!important"><a id=attvendor' + i + ' style="pointer:cursur;text-decoration:none;" href="javascript:;" onclick="DownloadFileVendor(this)" >' + data[i].attachment + '</a></td>';
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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

        }

    })
}

function fetchReguestforQuotationDetails() {
    // jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced1 = '';
    $('#btn_ReSubmit').hide();
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
            sessionStorage.setItem('hdnRFQBidType', RFQData[0].general[0].rfqBidType)
            _RFQBidType = RFQData[0].general[0].rfqBidType
            $('#filepthtermsPrev').html(RFQData[0].general[0].rfqTermandCondition);
            //Preview Details


            jQuery('#lblRfqsubject').html(RFQData[0].general[0].rfqSubject)

            jQuery('#lblrfqstartdate').html(fnConverToLocalTime(RFQData[0].general[0].rfqStartDate))
            jQuery('#lblrfqenddate').html(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate))
            jQuery('#lblrfqdescription').html(RFQData[0].general[0].rfqDescription)

            jQuery("#dropCurrencyPrev").html(RFQData[0].general[0].currencyNm)
            jQuery('#lblConversionRatePrev').html(RFQData[0].general[0].rfqConversionRate)
            jQuery("#txtRFQReferencePrev").html(RFQData[0].general[0].rfqReference);
            if (_RFQBidType == 'Closed') {
                var EndDt = new Date(fnConverToLocalTime(RFQData[0].general[0].rfqEndDate).replace('-', ''));
                var currDt = new Date();
                if (currDt < EndDt) {
                    $('#btn_ReSubmit').show();
                    
                }
                else {
                    $('#btn_ReSubmit').hide();
                }
            }




        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }
            jQuery.unblockUI();
            return false;

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

            var err = xhr.responseText//eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('error', '');
            }

            jQuery.unblockUI();
            return false;

        }
    });
}
function ReSubmitQuotes() {
    var encrypdata = fnencrypt("RFQID=" + sessionStorage.getItem('hddnRFQID') + "&RFQSubject=" + ($('#rq_subject').text()) + "Type=");//encodeURIComponent
    if (sessionStorage.getItem('CustomerID') != "32") {

        window.open("eRFQVendor.html?param=" + encrypdata, "_blank")
    }
    //else {
    //    window.open("AzeRFQAnalysis.html?param=" + encrypdata, "_blank")

    //}
}
function showDetailedDescription(descText) {

    $("#paraItemDescription").html(descText);
}



setTimeout(function () { sessionStorage.removeItem('selectedboqtxtboxid') }, 5000);
sessionStorage.removeItem('selectedboqtxtboxidTax');



