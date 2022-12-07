

if (window.location.search) {
    var param = getUrlVars()["param"];
    var decryptedstring = fndecrypt(param);
    var RFQID = getUrlVarsURL(decryptedstring)["RFQID"];
    $('#hdnRfiRfqID').val(RFQID);
    var sub = getUrlVarsURL(decryptedstring)["RFQSubject"].replace(/%20/g, ' ');
    jQuery("#txtrfirfqsubject").val(decodeURIComponent(sub) + ' - ' + RFQID)
    fetchReguestforQuotationDetails()
    FetchRFQVersion();
}
function fetchRFIRFQSubjectforReport(subjectFor) {
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/fetchRFIRFQSubjectforReport/?SubjectFor=" + subjectFor + "&Userid=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&CustomerID=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            sessionStorage.setItem('hdnRfiRfqSubject', JSON.stringify(data));
        }
    });

}

jQuery("#txtrfirfqsubject").typeahead({
    source: function(query, process) {
        var data = sessionStorage.getItem('hdnRfiRfqSubject');
        Subject = [];
        map = {};
        var commonsubject = "";
        jQuery.each(jQuery.parseJSON(data), function(i, commonsubject) {
            map[commonsubject.RFIRFQSubject] = commonsubject;
            Subject.push(commonsubject.RFIRFQSubject);
        });

        process(Subject);

    },
    minLength: 2,
    updater: function(item) {

        if (map[item].RfiRfqID != '0') {

            $('#hdnRfiRfqID').val(map[item].RfiRfqID);
            fetchReguestforQuotationDetails()
            FetchRFQVersion();
        }

        return item;
    }

});
jQuery("#txtrfirfqsubject").keyup(function () {
    $('#hdnRfiRfqID').val(0);
   
 });

 sessionStorage.setItem("RFQVersionId", "0")


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
function getSummary(vendorid) {
    var encrypdata = fnencrypt("RFQID=" + $('#hdnRfiRfqID').val() + "&VendorId=" + vendorid + "&max=" + max + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId") + "&RFQVersionTxt=" + $("#ddlrfqVersion option:selected").text().replace(' ', '%20'))
    window.open("RFQReport.html?param=" + encrypdata, "_blank")

}
 function fetchrfqcomprative() {
     var reInvited = '';
    var dtfrom = '';
    var dtto = '';
    sessionStorage.setItem("RFQVersionId", $("#ddlrfqVersion option:selected").val()) 
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    if ($("#txtFromDate").val() == null || $("#txtFromDate").val() == '') {
        dtfrom = '';

    }
    else {
        dtfrom = $("#txtFromDate").val()
    }

    if ($("#txtToDate").val() == null || $("#txtToDate").val() == '') {
        dtto = '';

    }
    else {
        dtto = $("#txtToDate").val()
    }
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/fetchRFQComprativeDetails/?RFQID=" + $('#hdnRfiRfqID').val() + "&dateTo=" + dtto + "&dateFrom=" + dtfrom + "&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQVersionId=" + $('#ddlrfqVersion option:selected').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {

            var str = '';
            var strHead = '';
            var strHeadExcel = '';
            var strExcel = '';
            var totalWithouTax = 0;
            var totalWithTax = 0;
            var VendorID = 0;
          
            jQuery('#tblRFQComprative > thead').empty()
            jQuery("#tblRFQComprativeForExcel > thead").empty();
            jQuery('#tblRFQComprativetest > thead').empty()
            $('#tblRFQComprative > tbody').empty();
            $('#tblRFQComprativetest > tbody').empty();
            jQuery("#tblRFQComprativeForExcel > tbody").empty();
            if (data[0].VendorNames.length > 0) {
                $('#displayTable').show();
                $('#btnExport').show()
               
                //For Printing Header
                strHead = "<tr  style='background:#f5f5f5; color:light black;'><th class='hide'>&nbsp;</th><th>Short Name</th><th>Quantity</th><th>UOM</th>"
                strHeadExcel = "<tr  style='background: grey; color:light black;'><th>Short Name</th><th>Quantity</th><th>UOM</th>"
                for (var i = 0; i < data[0].VendorNames.length; i++) {
                   
                    if (data[0].VendorNames[i].SeqNo != 0) {
                       
                        strHead += "<th colspan='3' style='text-align:center;'><a onclick=getSummary(\'" + data[0].VendorNames[i].VendorID + "'\) href='javascript:;'  style='color:#2474f6; text-decoration:underline;'>" + data[0].VendorNames[i].VendorName; +"</a></th>";
                            strHeadExcel += "<th colspan='3' style='text-align:center;'>" + data[0].VendorNames[i].VendorName; +"</th>";
                      
                        }
                    else
                    {
                       
                            strHead += "<th colspan='3' style='text-align:center;'>" + data[0].VendorNames[i].VendorName; +"</th>";
                            strHeadExcel += "<th colspan='3' style='text-align:center;'>" + data[0].VendorNames[i].VendorName; +"</th>";

                        
                           
                        }
                    }
                
                strHead += "</tr>"
                strHeadExcel += "</tr>"   
              
                strHead += "<tr style='background: #f5f5f5; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                strHeadExcel += "<tr style='background: grey; color:light black;'><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th>";
                var taxHRTextinc = stringDivider("Total Amount (Inc. Taxes)", 12, "<br/>\n");
                var taxHRTextEx = stringDivider("Total Amount (Ex. Taxes)", 12, "<br/>\n");
                var HRUnitRate = stringDivider("Unit Rate (Ex. Taxes)", 12, "<br/>\n");
                for (var j = 0; j < data[0].VendorNames.length; j++) {
                  
                    strHead += "<th>" + HRUnitRate+"</th><th>" + taxHRTextEx + "</th><th>" + taxHRTextinc + "</th>";
                        strHeadExcel += "<th>Unit Rate (Ex. Taxes)</th><th>Total Amount (Ex. Taxes)</th><th>Total Amount (Inc. Taxes)</th>"
                    
                }
                strHead += "</tr>";
                strHeadExcel += "</tr>";
                jQuery('#tblRFQComprative > thead').append(strHead);
                jQuery('#tblRFQComprativeForExcel > thead').append(strHeadExcel);
                //For Printing Header Ends

  
                var x = 0;
              
                var unitrate = 0;
                for (var i = 0; i < data[0].NoofQuotes[0].NoofRFQParameter; i++) {
                    unitrate = 0;
                        var flag = 'T';
                        $("#tblRFQComprativetest > tbody > tr").each(function (index) {
                            var this_row = $(this);
                           
                            if ($.trim(this_row.find('td:eq(1)').html()) == data[0].QuotesDetails[i].RFQShortName) {
                                flag = 'F';
                                
                            }

                        });

                      
                        x = -1;
                        if (flag == 'T') {
                          
                           
                            str += "<tr><td class='hide'>" + data[0].QuotesDetails[i].VendorID + "</td><td>" + data[0].QuotesDetails[i].RFQShortName + "</td><td class=text-right>" + thousands_separators(data[0].QuotesDetails[i].Quantity) + "</td><td>" + data[0].QuotesDetails[i].UOM + "</td>";
                            strExcel += "<tr><td>" + data[0].QuotesDetails[i].RFQShortName + "</td><td>" + data[0].QuotesDetails[i].Quantity + "</td><td>" + data[0].QuotesDetails[i].UOM + "</td>";

                            for (var j = 0; j < data[0].QuotesDetails.length; j++) {

                                if ((data[0].QuotesDetails[i].RFQParameterId) == (data[0].QuotesDetails[j].RFQParameterId)) {// true that means reflect on next vendor
                                    x = x + 1;
                                    if (data[0].QuotesDetails[j].VendorID == data[0].VendorNames[x].VendorID) {
                                        if (data[0].QuotesDetails[j].UnitRate != 0 && data[0].QuotesDetails[j].RFQVendorPrice != 0 && data[0].QuotesDetails[j].RFQVendorPrice != -1) {
                                            str += "<td class='text-right' id=unitrate" + i + x+">" + thousands_separators(data[0].QuotesDetails[j].UnitRate) + "</td><td class='VendorPriceNoTax text-right'>" + thousands_separators(data[0].QuotesDetails[j].RFQVendorPrice) + "</td><td class='VendorPriceWithTax  text-right' >" + thousands_separators(data[0].QuotesDetails[j].RFQVendorPricewithTax) + "</td>";
                                            strExcel += "<td>" + data[0].QuotesDetails[j].UnitRate + "</td><td>" + data[0].QuotesDetails[j].RFQVendorPrice + "</td><td>" + data[0].QuotesDetails[j].RFQVendorPricewithTax + "</td>";
                                             
                                        }
                                        else if(data[0].QuotesDetails[j].UnitRate == -1 && data[0].QuotesDetails[j].RFQVendorPrice ==-1) {
                                            str += "<td colspan=3  style='color: blue!important; text-align: center;' >Not Invited</td>";
                                            strExcel += "<td colspan=3 >Not Invited </td>";
                                        }
                                        else {
                                            str += "<td colspan=3  style='color: red!important; text-align: center;' >Not Quoted</td>";
                                            strExcel += "<td colspan=3 >Not Quoted </td>";
                                        }
                                        
                                    }
                                   

                                }

                            }
                        
                            
                             str += "</tr>"
                            strExcel += "</tr>"
                           
                            jQuery('#tblRFQComprativetest').append(str);
                            
                        }

                     }
             
                str += "<tr><td>Total</td><td>&nbsp;</td><td>&nbsp;</td>";
                strExcel += "<tr><td>Total</td><td>&nbsp;</td><td>&nbsp;</td>";
                for (var k = 0; k < data[0].VendorNames.length; k++) {
                    if (data[0].VendorNames[k].SeqNo != 0) {
                        RFQFetchTotalPriceForReport(data[0].VendorNames[k].VendorID, k)
                        str += "<td id=unitrate" + k + " class=text-right></td><td id=totBox" + k + " class=text-right></td><td id=totBoxTax" + k + " class=text-right></td>";
                        strExcel += "<td id=unitrateExcel" + k + "></td><td id=totBoxExcel" + k + "></td><td id=totBoxTaxExcel" + k + "></td>";
                    }
                    else {
                        str += "<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                        strExcel += "<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                    }


                }
                str += " </tr>";
                strExcel += " </tr>";

                //For Vendor Comments
              
                str += "<tr><td colspan=3><b>Vendor Remarks :</b></td>";
                strExcel += "<tr><td colspan=3><b>Vendor Remarks :</b></td>";
                for (var k = 0; k < data[0].VendorNames.length; k++) {

                    if (data[0].VendorNames[k].VendorRemarks != "") {
                        var VRemarks = stringDivider(data[0].VendorNames[k].VendorRemarks , 40, "<br/>\n");
                        str += "<td colspan='3' class='text-left' >" + VRemarks + "</td>";
                        strExcel += "<td colspan='3' class='text-left' >" + VRemarks + "</td>";
                    }
                    else {
                        str += "<td colspan=3>&nbsp;</td>";
                        strExcel += "<td colspan=3>&nbsp;</td>";
                    }
                }
                str += " </tr>";
                strExcel += " </tr>";

                if ($("#ddlrfqVersion option:selected").val() != 99) {
                    //For ReInvite Row
                    str += "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>";
                    var maxValue = -1;
                    for (var k = 0; k < data[0].VendorNames.length; k++) {
                        $("#ddlrfqVersion option").each(function () {
                            var thisVal = $(this).val();

                            if (maxValue < thisVal && thisVal != 99) {
                                maxValue = thisVal;
                            }
                           
                            if ($("#ddlrfqVersion option:selected").val() == maxValue) {
                                reInvited = 'Y'
                            }
                        });

                        if (maxValue == $("#ddlrfqVersion option:selected").val()) {

                            $("#btn-reInvite").attr('disabled', false)
                            str += "<td colspan='3' class='text-center'><label class='checkbox-inline'><input type='checkbox' class='chkReinvitation' style='position:relative;margin-right:5px;' value=" + data[0].VendorNames[k].VendorID + " />Re-Invite Vendor For Fresh Quote</label></td>"; //<a class='btn green'>Re-Invite Vendor</a>


                        }
                        else {

                            $("#btn-reInvite").attr('disabled', true);
                            str += "<td colspan=3>&nbsp;</td>";
                        }


                    }
                    str += " </tr>";
                }
                if ($("#ddlrfqVersion option:selected").val() == 99) {
                    $("#btn-reInvite").attr('disabled', true);
                }
                else {
                    $("#btn-reInvite").attr('disabled', false)
                }
                
                jQuery('#tblRFQComprative').append(str);
                jQuery("#tblRFQComprativeForExcel").append(strExcel);


            } else {

                $('#displayTable').show();
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo('#tblRFQComprative');
                $('<tr><td style="color:red !important; text-align: center;" colspan="5"> No results </td></tr>').appendTo("#tblRFQComprativeForExcel")

            }
        }

    });

    $("#tblRFQComprative tr:gt(1)").each(function(x,y) {
      
   
    });
    jQuery.unblockUI();

}

function RFQFetchTotalPriceForReport(VendorID,Counter) {
   
//alert(sessionStorage.getItem("APIPath") + "RFI_RFQReport/RFQFetchTotalPriceForReport/?RFQID=" + $('#hdnRfiRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId"))
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/RFQFetchTotalPriceForReport/?RFQID=" + $('#hdnRfiRfqID').val() + "&VendorId=" + VendorID + "&RFQVersionId=" + sessionStorage.getItem("RFQVersionId"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(data) {
            
            $("#totBox" + Counter).html(thousands_separators(data[0].TotalPriceExTax));
            $("#totBoxTax" + Counter).html(thousands_separators(data[0].TotalPriceIncTax));
            $("#totBoxExcel" + Counter).html(data[0].TotalPriceExTax);
            $("#totBoxTaxExcel" + Counter).html(data[0].TotalPriceIncTax);


        }, error: function() {

        }
    });
}
var max = 0;
function FetchRFQVersion() {
    max = 0;

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/fetchRFQVersions/?RFQID=" + $('#hdnRfiRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(data) {
            $("#ddlrfqVersion").empty();
            if (data.length > 0) {
                $('#ddlrfqVersion').append('<option  value="99" >Final Version</option>');
                 $('#ddlrfqVersion').append('<option  value=' + data[0].RFQVersionId + '>' + (data[0].RFQVersionId + 1)  + ' Quote</option>');
               
                 max = data[0].RFQVersionId;
                for (var i = 0; i < data[0].RFQVersionId; i++) {

                    $('#ddlrfqVersion').append(jQuery('<option ></option>').val(i).html((i + 1) + " Quote"));
                }
            }

        }, error: function() {

        }
    });

}

$("#ddlrfqVersion").change(function() {
    $("#displayTable").hide();
    $("#btnExport").hide();
});
jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblRFQComprative tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});
function fetchReguestforQuotationDetails() {
    var attachment = '';
    var termattach = '';

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RequestForQuotation/fetchReguestforQuotationDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&RFQID=" + $('#hdnRfiRfqID').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(RFQData) {
            $('#tbldetailsExcel > tbody').empty();
            if (RFQData.length > 0) {

                attachment = RFQData[0].RFQAttachment.replace(/%20/g, " ").replace(/'&amp;'/g, "&");
                termattach = RFQData[0].RFQTermandCondition.replace(/%20/g, " ").replace(/'&amp;'/g, "&");

            } else {
                attachment = attachment;
                termattach = termattach;
            }

            jQuery('#RFQSubject').html(RFQData[0].RFQSubject)

            $('#Currency').html(RFQData[0].CurrencyNm)
            jQuery('#RFQDescription').html(RFQData[0].RFQDescription)
            jQuery('#RFQDeadline').html(RFQData[0].RFQDeadline)

            jQuery('#lblrfqconfigby').html(RFQData[0].RFQConfigureByName)
            jQuery('#ConversionRate').html(RFQData[0].RFQConversionRate)
            $('#TermCondition').attr('href', 'PortalDocs/RFQ/' + $('#hdnRfiRfqID').val() + '/' + termattach + '').html(RFQData[0].RFQTermandCondition)
            $('#Attachment').attr('href', 'PortalDocs/RFQ/' + $('#hdnRfiRfqID').val() + '/' + attachment + '').html(RFQData[0].RFQAttachment)
            $('#tbldetails').append("<tr><td>" + RFQData[0].RFQSubject + "</td><td>" + RFQData[0].RFQDescription + "</td><td>" + RFQData[0].CurrencyNm + "</td><td >" + RFQData[0].RFQConversionRate + "</td><td>" + RFQData[0].RFQDeadline + "</td></tr>")
            $('#tbldetailsExcel > tbody').append("<tr><td>" + RFQData[0].RFQSubject + "</td><td>" + RFQData[0].RFQDescription + "</td><td>" + RFQData[0].CurrencyNm + "</td><td >" + RFQData[0].RFQConversionRate + "</td><td>" + RFQData[0].RFQDeadline + "</td></tr>")

        }
    });

}


var form = $('#RFIRFQREport');
function formvalidate() {

    form.validate({

        doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

        errorElement: 'span', //default input error message container

        errorClass: 'help-block help-block-error', // default input error message class

        focusInvalid: false, // do not focus the last invalid input

        rules: {

            txtrfirfqsubject: {
                required: true
            }

        },

        messages: {

    },



    invalidHandler: function(event, validator) {

    },

    highlight: function(element) {

        $(element).closest('.form-group').addClass('has-error');

    },

    unhighlight: function(element) {

        $(element).closest('.form-group').removeClass('has-error');

    },

    success: function(label) {


    },


    submitHandler: function(form) {
        if ($('#hdnRfiRfqID').val() == "0") {
            gritternotification('Please Select RFQ properly!!!')

        }
        else {
            fetchrfqcomprative()
        }
    }

});

$("#frmReInvite").validate({

    doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

    errorElement: 'span', //default input error message container

    errorClass: 'help-block help-block-error', // default input error message class

    focusInvalid: false, // do not focus the last invalid input

    rules: {

        txtextendDate: {
            required: true
        }

    },

    messages: {

},



invalidHandler: function(event, validator) {

},

highlight: function(element) {

    $(element).closest('.col-md-8').addClass('has-error');

},

unhighlight: function(element) {

    $(element).closest('.col-md-8').removeClass('has-error');

},
errorPlacement: function(error, element) {

    if (element.attr("name") == "txtextendDate") {

        error.insertAfter("#daterr");

    }
    else {

        error.insertAfter(element);
    }
},
success: function(label) {


},
submitHandler: function(form) {
ReInviteVendorsForRFQ();
}

});


}

var str = '';
function checkForSelectedVendors() {


    //getting value for Checked Checheck boxes
    $(".chkReinvitation:checked").each(function(x, i) {
        str += $(this).val() + ',';

    });

    if (str == '') {
        $("#error").html("PLease select atleast one vendor");
        $(".alert-danger").show();
        Metronic.scrollTo($(".alert-danger"), -200);
        $(".alert-danger").fadeOut(7000);
        return false;

    } else {
        $("#modalreInviteDate").modal("show");
    }




}

function ReInviteVendorsForRFQ() {
    var _cleanString = StringEncodingMechanism($("#RFQSubject").html());
    var _cleanString2 = StringEncodingMechanism($("#txtReInviteRemarks").val());
    str = str.substring(0, str.length - 1);

    var data = {
        "RFQID": $("#hdnRfiRfqID").val(),
        "VendorIDs": str,
        "ExtendedDate": $("#txtextendDate").val(),
        //"RFQSubject": $("#RFQSubject").html(),
        "RFQSubject": _cleanString,
        "UserID": sessionStorage.getItem("UserID"),
        //"ReInviteRemarks": $("#txtReInviteRemarks").val()
        "ReInviteRemarks": _cleanString2
        
      }
    //alert(JSON.stringify(data))
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "RFI_RFQReport/RFQ_ReInviteVendor/",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(data, status, jqXHR) {
            if (data[0].IsSuccess == '1') {
                $("#modalreInviteDate").modal("hide");
                bootbox.alert("Re-Invitation For RFQ sent successfully", function() {                
                    location.reload();

                });
            } else {
                alert("Some Error")
            }

        },
        error: function(xhr) {
            jQuery("#error").text(xhr.d);
        }
    });

        
}



