

var _RFQBidType = "";
var version = "0";
//FROM HTML
jQuery(document).ready(function () {


    Pageloaded()
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
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)

    var _RFQid = getUrlVarsURL(decryptedstring)["RFQID"];
    version = getUrlVarsURL(decryptedstring)["Ver"];
    var Type = getUrlVarsURL(decryptedstring)["Type"];

    if (_RFQid == null)
        sessionStorage.setItem('hddnRFQID', 0)
    else {

        sessionStorage.setItem('RFQVersionId', version)
        sessionStorage.setItem('hddnRFQID', _RFQid)
        if ((Type != undefined) || Type == "Query" && sessionStorage.getItem('RFQVersionId') == "00") {
            GetQuestions();

        }
        else {
            GetSubmittedQuery();
        }
        fetchReguestforQuotationDetails();

        fetchRFQResponse('Question', version);
        fetchRFQResponse('Attachment', version);

    }
    Metronic.init();
    Layout.init();
    //multilingualLanguage();
    setCommonData();

});
//
function fncollapse(id) {

    $('#' + id.id).toggleClass("glyphicon-plus glyphicon-minus")
}
function GetQuestions() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem("VendorId") + "&UserID=X",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId'),
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
                    if (data[i].answer != "") {
                        //  str += "<td><a type='file' id='fileToUpload" + i + "' style='pointer:cursor;text-decoration:none;' href='javascript:;' name='fileToUpload" + i + "'  onclick='DownloadFile(this)' />" + data[i].attachment + "</a></td>";
                        str += '<td><a id=fileToUpload' + i + ' style = "pointer:curs0r;text-decoration:none;color:grey"  href = "javascript:;"  >' + data[i].attachment + '</td> '
                    }
                    else {
                        str += "<td><span style='width:380px!important' class='btn blue'><input type='file' id='fileToUpload" + i + "' name='fileToUpload" + i + "' onchange='checkfilesize(this);' />" + data[i].attachment + "</span></td>";
                    }
                    jQuery('#tblRFQtechqueryPrev').append(str);
                    $('#answer' + i).maxlength({
                        limitReachedClass: "label label-danger",
                        alwaysShow: true
                    });
                    if (data[i].answer != "") {
                        $('#answer' + i).attr('disabled', 'disabled');
                        $('#fileToUpload' + i).attr('disabled', 'disabled');
                    }

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
        //url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem("VendorId") + "&UserID=X",
        url: sessionStorage.getItem("APIPath") + "eRFQApproval/GeteRFQvendorQuery/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId'),
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
        if ($.trim($("#answer" + i).val()) == "" || $("#answer" + i).val() == "0") {
            $('#answer' + i).removeClass('has-success')
            $('#answer' + i).css("border", "1px solid red")
            flag = "F";

        }
        /*else {
            flag = "T"
        }*/

    }
    if (flag == "T") {
        //  var i = 0;
        var quesquery = "";
        var attchname = "";


        for (i = 0; i < rowCount - 1; i++) {

            attchname = ''; ext = '';
            if ($('#answer' + i).text() != "") {
                attchname = jQuery('#fileToUpload' + i).text().substring(jQuery('#fileToUpload' + i).text().lastIndexOf('\\') + 1)
                ext = $('#fileToUpload' + i).text().substring($('#fileToUpload' + i).text().lastIndexOf('.') + 1);
                attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
                attchname = attchname.replace('.', '@')


                quesquery = quesquery + $.trim($('#ques' + i).html()) + '~' + $.trim($('#answer' + i).val()) + '~' + attchname + '#';



            }
            else {
                attchname = jQuery('#fileToUpload' + i).val().substring(jQuery('#fileToUpload' + i).val().lastIndexOf('\\') + 1)
                ext = $('#fileToUpload' + i).val().substring($('#fileToUpload' + i).val().lastIndexOf('.') + 1);
                attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
                attchname = attchname.replace('.', '@')

                quesquery = quesquery + $.trim($('#ques' + i).html()) + '~' + $.trim($('#answer' + i).val()) + '~' + attchname + '#';

                //Upload Files on aZURE bLOB
                if (attchname != "" && attchname != null && attchname != undefined) {

                    fnUploadFilesonAzure('fileToUpload' + i, $('#fileToUpload' + i).val(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/TechQuery');
                }
            }


        }


        /* $("#tblRFQtechqueryPrev> tbody > tr").each(function (index) {
             var this_row = $(this);
                 
             attchname = ''; ext = '';
             if ($('#answer' + i).text() != "") {
                 attchname = jQuery('#fileToUpload' + i).text().substring(jQuery('#fileToUpload' + i).val().lastIndexOf('\\') + 1)
             }
             else {
                 attchname = jQuery('#fileToUpload' + i).val().substring(jQuery('#fileToUpload' + i).val().lastIndexOf('\\') + 1)
             }
           
             ext = $('#fileToUpload' + i).val().substring($('#fileToUpload' + i).val().lastIndexOf('.') + 1);
             attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
             attchname = attchname.replace('.', '@')
             
           
             quesquery = quesquery + $.trim(this_row.find('td:eq(0)').html()) + '~' + $.trim($('#answer' + i).val()) + '~' + attchname + '#';
 
             //Upload Files on aZURE bLOB
             if (attchname != "" && attchname != null && attchname != undefined) {
                 fnUploadFilesonAzure('fileToUpload' + i, $('#fileToUpload' + i).val(), 'eRFQ/' + sessionStorage.getItem('hddnRFQID') + '/' + sessionStorage.getItem('VendorId') + '/TechQuery');
             }
             i++;
         });*/
        var data = {
            "RFQID": parseInt(sessionStorage.getItem('hddnRFQID')),
            "QuesString": quesquery,
            "UserID": sessionStorage.getItem('UserID'),
            "VendorID": parseInt(sessionStorage.getItem("VendorId")),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "Headerid": parseInt(sessionStorage.getItem('HeaderID')),
            "PendingOn": "A"
        }


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
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + sessionStorage.getItem('UserID'),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data, status, jqXHR) {
            let data=Data.rData
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

var isboq = "N";
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
        //url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID') + "&CustomerID=" + sessionStorage.getItem('CustomerID') + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQDetails/?RFQID=" + sessionStorage.getItem('hddnRFQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Data) {
            let RFQData=Data.rData;
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

            if (RFQData[0].general[0].boqReq == true) {
                fetchRFIParameteronloadBoq(version);
                isboq = "Y";
            }
            else {
                fetchRFIParameteronload(version);
                isboq = "N";
            }
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
    jQuery("#tblRFQPrevBoq").hide();
    jQuery("#tblServicesProduct").show();
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
            jQuery("#tblRFQPrev").show();
            $('#divdomestic').show();
            var description = "";
            var totalammwithoutGST = 0;
            var totalammwithGST = 0;

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
function fetchRFIParameteronloadBoq(ver) {


    jQuery("#tblRFQPrevBoq").empty();
    jQuery("#tblRFQPrevBoq").show();
    jQuery("#tblServicesProduct").hide();
    $('#wrap_scrollerPrev').show();
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRFQVendor/efetchRFQParameter_Boq/?RFQId=" + sessionStorage.getItem('hddnRFQID') + "&VendorID=" + sessionStorage.getItem('VendorId') + "&RFQVersionId=" + ver,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        async: false,
        cache: false,
        dataType: "json",
        success: function (data) {
            var sheetcount = 0; counter = 0;
              if (data[0].parameters.length > 0) {
                  
               jQuery("#tblRFQPrevBoq").append('<thead><tr style="background: gray; color: #FFF;width:5%!important"><th><th style="width:4%!important">SrNo</th><th style="width:10%!important">Item/Service</th><th style="width:5%!important">Currency</th><th style="width:5%!important">Landed Unit Price <br>(Without GST)</th><th style="width:5%!important">Landed Unit Price <br>(With GST)</th><th style="width:5%!important">Amount <br>(Without GST)</th><th style="width:5%!important">Amount <br>(With GST)</th><th style="width:40%!important">Delivery Location</th></tr></thead><tbody>');

                 for (var i = 0; i < data[0].parameters.length; i++) {

                    pid = data[0].parameters[i].rfqParameterId;
                    parentid = data[0].parameters[i].rfqParameterParentID;
                    srno = data[0].parameters[i].srno;
                   sheet = data[0].parameters[i].boqsheetName;
                    if (data[0].parameters[i].rfqParameterParentID > 0) {
                         $('#btn' + data[0].parameters[i].rfqParameterParentID).attr('data-target', '#itemDiv' + data[0].parameters[i].rfqParameterParentID);
                         if ($("#itemTbl" + data[0].parameters[i].rfqParameterParentID).find('#itemDiv' + data[0].parameters[i].rfqParameterParentID).length <= 0) {
                            $("#itemTbl" + data[0].parameters[i].rfqParameterParentID).append("<tr><td colspan=10 class=hiddenRow style='border:none !important'><div class='accordian-body collapse' id='itemDiv" + data[0].parameters[i].rfqParameterParentID + "' ></div></tr>");
                        }
                        if (data[0].parameters[i].rfqUomId != '') {

                            if ($("#itemDiv" + data[0].parameters[i].rfqParameterParentID).find('#th' + data[0].parameters[i].rfqParameterParentID).length <= 0) {
                                $('#itemDiv' + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].parameters[i].rfqParameterParentID + " class='table table-bordered table-condensed  BoqTable'  style='margin-bottom:0px !important;' cellpadding=0 cellspacing=0><thead id=th" + data[0].parameters[i].rfqParameterParentID + "><tr style='background: #eee;color: #000;'><th style='width:10%!important'></th><th  style='width:10%!important' class=text-left>SrNo</th><th style='width:30%!important'>Item Name</th><th style='width:10%!important'>UOM</th><th style='width:10%!important'>Quantity</th><th style='width:30%!important'> Price</th></tr></thead></table>")
                            }

                            $("#itemDiv" + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].parameters[i].rfqParameterId + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");
                            $('#itemTbl' + data[0].parameters[i].rfqParameterId).append("<tbody><tr name='" + sheet + "'><td class='hide rPID'>" + data[0].parameters[i].rfqParameterId + "</td><td style='width:10%!important'></td><td  style='width:10%!important' class='text-right'>" + srno + " </td><td style='width:30%!important' id=short" + data[0].parameters[i].rfqParameterId + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:10%!important'>" + data[0].parameters[i].rfqUomId + "</td><td style='width:10%!important' id='quantxtP" + data[0].parameters[i].rfqParameterId + "'>" + data[0].parameters[i].rfQuantity + "</td><td style='width:10%!important'><label  class='control-label thousandseparated text-right' name='" + data[0].parameters[i].rfqParameterParentID + "'>" + data[0].parameters[i].itemPrice + " </label></td><td style='width:20%!important'><textarea rows=1   class='form-control maxlength'  maxlength=100  autocomplete='off' id=comm" + data[0].parameters[i].rfqParameterId + " name=comm" + data[0].parameters[i].rfqParameterId + " value=" + data[0].parameters[i].vendorItemRemarks + " >" + data[0].parameters[i].vendorItemRemarks + "</textarea></td></tr></tbody>")
                        }
                        else {
                            $("#itemDiv" + data[0].parameters[i].rfqParameterParentID).append("<table id=itemTbl" + data[0].parameters[i].rfqParameterId + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");

                            $('#itemTbl' + data[0].parameters[i].rfqParameterId).append("<tbody><tr name='" + sheet + "'><td class='hide rPID'>" + data[0].parameters[i].rfqParameterId + "</td><td style='width:10%!important' class=border-none><button style='background-color:white !important;margin-left:12%;'  type='button'  data-toggle=collapse   id='btn" + data[0].parameters[i].rfqParameterId + "'  class='btn iconbtn accordion-toggle' onclick='fncollapse(mainItem" + i + ")'><i class='glyphicon glyphicon-plus' id='mainItem" + i + "'></i></button></td><td  style='width:10%!important' class='text-right'>" + srno + " </td><td style='width:60%!important' id=short" + data[0].parameters[i].rfqParameterId + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:20%!important'><label style='border:none !important'  type=text name=" + data[0].parameters[i].rfqParameterParentID + "  id='lblPTot" + data[0].parameters[i].rfqParameterId + "'>" + thousands_separators((data[0].parameters[i].rfqPriceWithoutGST).round(2)) + "</label></td></tr></tbody>")
                        }
                        
                    }
                    else {
                        sheetcount++
                        sheet = data[0].parameters[i].boqsheetName;
                         $("#tblRFQPrevBoq").append("<tr><td colspan=10 class='hiddenRow' style='border:none !important'><div  id='itemDiv" + sheetcount + "'></div></tr>");
                         $("#itemDiv" + sheetcount).append("<table id=itemTbl" + pid + " class='table table-condensed table-bordered BoqTable' cellpadding=0 cellspacing=0></table>");

                       $('#itemTbl' + pid).append("<tbody><tr name='" + sheet + "'><td class='hide rPID'>" + pid + "</td><td style='width:5%!important' class=border-none><button style='background-color:white !important; margin-left:5%' type='button'  data-toggle=collapse   id='btn" + pid + "'  class='btn iconbtn accordion-toggle' onclick='fncollapse(mainItem" + i + ")'><i class='glyphicon glyphicon-plus' id='mainItem" + i + "'></i></button></td><td  style='width:10%!important' class='text-right'>" + sheetcount + " </td><td style='width:20%!important' id=short" + pid + ">" + data[0].parameters[i].rfqShortName + "</td><td style='width:5%!important'><label  class='text-right' id='mkswithoutgstBoq" + pid + "' data-toggle='modal' href='#responsive' onclick='mapQuestionBoq(\"" + pid + "\",\"mkswithoutgstBoq" + pid + "\",\"" + data[0].parameters[i].rfQuantity + "\",\"" + sheet.split(" ").join("_") + "\",\"" + ver + "\",\"mkswithgstBoq" + pid + "\",\"" + data[0].parameters[i].rfqVendorPrice + "\")'>" + thousands_separators((data[0].parameters[i].rfqPriceWithoutGST).round(2)) + "</label></td><td style='width:5%!important'><label class='text-right' id='mkswithgstBoq" + pid + "' data-toggle='modal' href='#responsive' onclick='mapQuestionBoq(\"" + pid + "\",\"mkswithoutgstBoq" + pid + "\",\"" + data[0].parameters[i].rfQuantity + "\",\"" + sheet.split(" ").join("_") + "\",\"" + ver + "\",\"mkswithgstBoq" + pid + "\",\"" + data[0].parameters[i].rfqVendorPrice + "\")'>" + thousands_separators((data[0].parameters[i].rfqVendorPricewithTax).round(2)) + "</label></td><td style='width:5%!important' class='text-right' id=ammwithoutGST" + pid + ">" + thousands_separators((data[0].parameters[i].rfqPriceWithoutGST * 1).round(2)) + "</td><td style='width:5%!important' class='text-right' id=ammGST" + sheetcount + ">" + thousands_separators((data[0].parameters[i].rfqVendorPricewithTax * 1).round(2)) + "</td><td style='width:25%!important' class='text-right' id=delivery" + sheetcount + ">" + data[0].parameters[i].rfqDelivery + "</td></tr></tbody>");
                   parentid = data[0].parameters[i].rfqParameterId;

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
                fnErrorMessageText('spandanger', 'form_wizard_1');
            }
            jQuery.unblockUI();
            return false;
        }
    });
}

function ReSubmitQuotes() {
    var encrypdata = fnencrypt("RFQID=" + sessionStorage.getItem('hddnRFQID') + "&RFQSubject=" + ($('#rq_subject').text()) + "Type=");//encodeURIComponent
    if (sessionStorage.getItem('CustomerID') != "32") {
        if (confirm("WARNING!!! Re-submission of Quotes will overwrite your previous attachments and Quotes. Are you sure you want to proceed with Re-submission?")) {
            window.open("eRFQVendor.html?param=" + encrypdata, "_blank")
            //function() {
            //    window.open("eRFQVendor.html?param=" + encrypdata, "_blank")
            //}
        }
        //bootbox.alert("WARNING!!! Re-submission of Quotes will delete your previous attachments and Quotes. Are you sure you want to proceed with Re-submission?", function () {
        //    window.open("eRFQVendor.html?param=" + encrypdata, "_blank")
        //});

    }
}
function showDetailedDescription(descText) {

    $("#paraItemDescription").html(descText);
}



setTimeout(function () { sessionStorage.removeItem('selectedboqtxtboxid') }, 5000);
sessionStorage.removeItem('selectedboqtxtboxidTax');



//abheedev multilingual
function multilingualLanguage() {

    var set_locale_to = function (locale) {
        if (locale) {
            $.i18n().locale = locale;
        }

        $('body').i18n();
    };
    jQuery(function () {
        $.i18n().load({
            'en': 'assets/plugins/jquery.i18n/language/en/translation.json', // Messages for english
            'fr': 'assets/plugins/jquery.i18n/language/fr/translation.json' // message for french
        }).done(function () {
            set_locale_to(url('?locale'));

            $(".navbar-language").find(`option[value=${$.i18n().locale}]`).attr("selected", "selected")

            //   <option data-locale="en" value="en">English</option>

            History.Adapter.bind(window, 'statechange', function () {
                set_locale_to(url('?locale'));

            });
            $('.navbar-language').change(function (e) {

                e.preventDefault();
                $.i18n().locale = $('option:selected', this).data("locale");


                History.pushState(null, null, "?locale=" + $.i18n().locale);



            });

            $('a').click(function (e) {

                if (this.href.indexOf('?') != -1) {
                    this.href = this.href;
                }
                else if (this.href.indexOf('#') != -1) {
                    e.preventDefault()
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }
                //else if (this.href.indexOf('javascript:') != -1) {

                //  this.href = this.href + "?locale=" + $.i18n().locale;
                //} 

                else {
                    this.href = this.href + "?locale=" + $.i18n().locale;
                }
            });
        });
    });
}
