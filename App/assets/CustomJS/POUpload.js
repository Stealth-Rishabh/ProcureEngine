$(".thousandseparated").inputmask({
    alias: "decimal",
    rightAlign: false,
    groupSeparator: ",",
    radixPoint: ".",
    autoGroup: true,
    integerDigits: 40,
    digitsOptional: true,
    allowPlus: false,
    allowMinus: false,
    'removeMaskOnSubmit': true

});
$('#txtshortname,#txtItemCode,#txtPono,#txtItemCode,#txtvendorremarks,#AttachDescription1').maxlength({
    limitReachedClass: "label label-danger",
    alwaysShow: true
});
if (window.location.search) {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    var AppType = getUrlVarsURL(decryptedstring)["AppType"];

    $('#hdnPOHeader').val(getUrlVarsURL(decryptedstring)["POHID"])
    FetchRecomendedVendor();
}
if (AppType == "Reverted") {
    $('#txtVendor').attr('disabled', 'disabled')
   
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    fetchAttachments();
    setTimeout(function () {
        fetchDeliverySpread();
    }, 800)

}
else {
    $('#txtVendor').removeAttr('disabled')
   // $('#txtVendorGroup').removeAttr('disabled', 'disabled')
}
var form = $('#frmbidsummaryreport');
function InsUpdProductSevices() {

    if ($('#add_or').text() == "Modify") {

        var st = "true"
        $("#tblServicesProduct tr:gt(0)").each(function () {

            var this_row = $(this);

            if ($.trim(this_row.find('td:eq(2)').html()) == $('#txtshortname').val() && $.trim(this_row.find('td:eq(1)').html()) != $('#txtItemCode').val() && $.trim(this_row.find('td:eq(3)').html()) != $('#txtedelivery').val() && $.trim(this_row.find('td:eq(4)').html()) != $("#txtPoNo").val() && $.trim(this_row.find('td:eq(5)').html()) != $("#txtPODate").val() && $.trim(this_row.find('td:eq(6)').html()) != $('#txtquantitiy').val() && $.trim(this_row.find('td:eq(7)').html()) != $('#dropuom').val()) {

                st = "false"

            }

        });
        if (st == "false") {
            error.show();
            $('#spandanger').html('Data already exists...');
            Metronic.scrollTo(error, -200);
            error.fadeOut(3000);
            return false;

        }
        else if ($('#dropuom').val() == '' || $('#txtUOM').val() == '') {
            $('.alert-danger').show();
            $('#spandanger').html('Please Select UOM Properly');
            Metronic.scrollTo($(".alert-danger"), -200);
            $('.alert-danger').fadeOut(7000);
            return false;
        }
        else {

            var this_row = $('#rowid').val();

            var this_row_Prev = $('#rowidPrev').val();
            $("#" + this_row).find("td:eq(1)").text($('#txtItemCode').val())
            $("#" + this_row).find("td:eq(2)").text($('#txtshortname').val())
            $("#" + this_row).find("td:eq(3)").text($('#txtedelivery').val())
            $("#" + this_row).find("td:eq(4)").text($('#txtPoNo').val())

            $("#" + this_row).find("td:eq(5)").text($('#txtPODate').val())

            $("#" + this_row).find("td:eq(6)").text($('#txtquantitiy').val())
            $("#" + this_row).find("td:eq(7)").text($('#dropuom').val())

            resetfun();

        }
    }

    else {


        if ($('#tblServicesProduct >tbody >tr').length == 0) {
            if ($('#dropuom').val() == '' || $('#txtUOM').val() == '') {
                $('.alert-danger').show();
                $('#spandanger').html('Please Select UOM Properly');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                return false;
            }
            else {
                ParametersQuery()
            }
        }
        else {

            var status = "true";
            $("#tblServicesProduct tr:gt(0)").each(function () {

                var this_row = $(this);

                if ($.trim(this_row.find('td:eq(2)').html()) == $('#txtshortname').val()) {
                    status = "false"

                }

            });


            if (status == "false") {
                error.show();
                $('#spandanger').html('Data already exists...');
                Metronic.scrollTo(error, -200);
                error.fadeOut(3000);
                return false;

            }
            else if ($('#dropuom').val() == '' || $('#txtUOM').val() == '') {
                $('.alert-danger').show();
                $('#spandanger').html('Please Select UOM Properly');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
                return false;
            }
            else {

                ParametersQuery()

            }

        }

    }

}

var i = 0;
var z = 0;
var PriceDetails = '';

function ParametersQuery() {

    // z = z + 1
    i = $('#tblServicesProduct >tbody >tr').length;
    if (!jQuery("#tblServicesProduct thead").length) {
        jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th 'width:20%!important;'></th><th>Item Code</th><th>Item/Service</th><th>Delivery Location</th><th>Po No</th><th>Po Delivery Date</th><th>Quantity</th><th>UOM</th></tr></thead>");
        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td><button type="button" class="btn btn-xs btn-success" onclick="editvalues(trid' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td  style="width:20%!important;">' + $('#txtItemCode').val() + '</td><td>' + $('#txtshortname').val() + '</td><td>' + $('#txtedelivery').val() + '</td><td>' + $('#txtPoNo').val() + '</td><td>' + $('#txtPODate').val() + '</td><td class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td>' + $("#dropuom").val() + '</td></tr>');
    }
    else {

        jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td><button type="button" class="btn  btn-xs btn-success" onclick="editvalues(trid' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td style="width:20%!important;">' + $('#txtItemCode').val() + '</td><td>' + $('#txtshortname').val() + '</td><td>' + $('#txtedelivery').val() + '</td><td>' + $('#txtPoNo').val() + '</td><td>' + $('#txtPODate').val() + '</td><td class=text-right>' + thousands_separators($('#txtquantitiy').val()) + '</td><td>' + $("#dropuom").val() + '</td></tr>');

    }

    resetfun()

}

function editvalues(rowid) {


    Metronic.scrollTo($("body"), 200);
    $('#rowid').val(rowid.id)

    $('#txtItemCode').val($("#" + rowid.id).find("td:eq(1)").text())
    $('#txtshortname').val($("#" + rowid.id).find("td:eq(2)").text())
    $('#txtedelivery').val($("#" + rowid.id).find("td:eq(3)").text())
    //alert($("#" + rowid.id).find("td:eq(4)").text())
    $('#txtPoNo').val($("#" + rowid.id).find("td:eq(4)").text())

    $('#txtPODate').val($("#" + rowid.id).find("td:eq(5)").text())
    $('#txtquantitiy').val($("#" + rowid.id).find("td:eq(6)").text())
    $('#dropuom').val($("#" + rowid.id).find("td:eq(7)").text())
    $('#txtUOM').val($("#" + rowid.id).find("td:eq(7)").text())

    $('#add_or').text('Modify');

}

function deleterow(rowid) {

    $('#' + rowid.id).remove();

}
function insPoDetails() {

    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />Please Wait...</h5>' });
    if (jQuery('#file1').val() != '') {
        $('.alert-danger').show();
        $('#spandanger').html('Your file is not attached. Please do press "+" button after uploading the file.');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        jQuery.unblockUI();
    }
    else {

        var rowCount = jQuery('#tblServicesProduct tr').length;
        PriceDetails = '';
        if (rowCount > 0) {
            $("#tblServicesProduct tr:gt(0)").each(function () {
                var this_row = $(this);
                PriceDetails = PriceDetails + ' insert into PODeliverySpread(POHeaderID,CustomerID,VendorID,ItemCode,ItemServiceName,DeliveryLocation,Quantity,UOM,PONo,PODeliveryDate,CreatedBy,CreatedOn) values('
                var deliverylocation = $.trim(this_row.find('td:eq(3)').html()).replace(/'/g, "");
                PriceDetails = PriceDetails + $('#hdnPOHeader').val() + "," + sessionStorage.getItem('CustomerID') + "," + sessionStorage.getItem('hdnVendorID') + ",'" + $.trim(this_row.find('td:eq(1)').html()) + "','" + $.trim(this_row.find('td:eq(2)').html()) + "','" + $.trim(deliverylocation) + "','" + removeThousandSeperator($.trim(this_row.find('td:eq(6)').html())) + "','" + $.trim(this_row.find('td:eq(7)').html()) + "','" + this_row.find('td:eq(4)').html() + "','" + $.trim(this_row.find('td:eq(5)').html()) + "',dbo.decrypt('" + sessionStorage.getItem('UserID') + "'),getdate())";
            })
        }
       // console.log(PriceDetails)
        var Tab2data = {
            "PriceDetails": PriceDetails,
            "VendorID": parseInt(sessionStorage.getItem('hdnVendorID')),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "UserID": sessionStorage.getItem('UserID'),
            "Flag": 'SendToVendor',
            "POHeaderID": parseInt($('#hdnPOHeader').val()),
            "UserRemarks": $('#txtvendorremarks').val()
        };

       
        //console.log(JSON.stringify(Tab2data))
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "POUpload/InsDeliverySpread/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {
                if (data == '1') {
                    if (AppType != 'Reverted') {
                        $('.alert-success').show();
                        $('#spansuccess1').html('PO sent to vendor successfully');
                        Metronic.scrollTo($(".alert-success"), -200);
                        $('.alert-success').fadeOut(7000);
                        $('#cancelBidBtn').hide();

                        resetfun();
                        resetForm();
                    }
                    else {
                        bootbox.alert("PO is now forwarded again to the vendor for acceptance.", function () {
                            window.location = "index.html";
                            return false;
                        });
                    }

                    jQuery.unblockUI();
                }

            },
            error: function (xhr, status, error) {

                var err = eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    $('.alert-danger').show();
                    $('#spandanger').html('You have error. Please try again.');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                }

                return false;
                jQuery.unblockUI();
            }

        });

    }
}

function resetForm() {
    $('#tblServicesProduct').empty();
    $('#tblAttachments').empty();

 
    $('#txtVendor').removeAttr('disabled')
  
    $('#txtVendor').val('');
    sessionStorage.setItem('hdnVendorID', '0')
    $('#txtvendorremarks').val('');

}
var vendor;
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
                vendor = Venderdata;
               
            }
            else {
                vendor = '';

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
jQuery("#txtVendor").keyup(function () {
    sessionStorage.setItem('hdnVendorID', '0');

});
sessionStorage.setItem('hdnVendorID', 0);
jQuery("#txtVendor").typeahead({
    source: function (query, process) {
        var data = vendor
        usernames = [];
        var vName = "";
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            vName = username.participantName + ' (' + username.companyEmail + ')'
            map[vName] = username;
            usernames.push(vName);
          
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].participantID != "0") {
            sessionStorage.setItem('hdnVendorID', map[item].participantID)
        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
function addAttachments() {
    if (jQuery('#file1').val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Attach File Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if ($('#AttachDescription1').val() == "") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Enter Attachment Description');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else if (sessionStorage.getItem('hdnVendorID') == "0") {
        $('.alert-danger').show();
        $('#spandanger').html('Please Select Vendor Properly');
        Metronic.scrollTo($(".alert-danger"), -200);
        $('.alert-danger').fadeOut(7000);
        return false;
    }
    else {
        var attchname = jQuery('#file1').val().substring(jQuery('#file1').val().lastIndexOf('\\') + 1)
        attchname = attchname.replace(/[&\/\\#,+$~%'":*?<>{}]/g, '_');
        var Attachments = {
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "VendorID": parseInt(sessionStorage.getItem('hdnVendorID')),
            "POAttachment": attchname,
            "AttachmentDescription": $('#AttachDescription1').val(),
            "UserID": sessionStorage.getItem('UserID'),
            "POHeaderID": parseInt($('#hdnPOHeader').val()),
            "POAttachmentDescription": $('#AttachDescription1').val()
        }
        // alert(JSON.stringify(Attachments))
       // console.log(JSON.stringify(Attachments))
        jQuery.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "POUpload/AddPOFile",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Attachments),
            dataType: "json",
            success: function (data) {
              
                if(data.length>0){
                    
                    if (data[0].outPut == "1") {
                        $('#hdnPOHeader').val(data[0].poHeaderID)
                        
                        $('#txtVendor').attr('disabled', 'disabled')
                        fetchAttachments()

                        //** Upload Files on Azure PortalDocs folder first Time
                        fnUploadFilesonAzure('file1', attchname, 'PO/' + data[0].poHeaderID + '/' + sessionStorage.getItem('hdnVendorID'));

                        jQuery('#file1').val('')
                        jQuery('#AttachDescription1').val('')
                        Metronic.scrollTo($(".alert-success"), -200);
                        $('.alert-success').fadeOut(7000);
                        $('#cancelBidBtn').show();
                        
                        return false;

                    }
                    else if (data[0].outPut== "2") {
                        $('.alert-danger').show();
                        $('#spandanger').html('Attachment is already Exists.');
                        Metronic.scrollTo($(".alert-danger"), -200);
                        $('.alert-danger').fadeOut(7000);
                        return false;
                    }
                }
            

            },
            error: function (xhr, status, error) {

                var err = eval("(" + xhr.responseText + ")");
                if (xhr.status == 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    $('.alert-danger').show();
                    $('#spandanger').html('You have error. Please try again.');
                    Metronic.scrollTo($(".alert-danger"), -200);
                    $('.alert-danger').fadeOut(7000);
                }

                return false;
                jQuery.unblockUI();
            }

        });
    }
}

function fetchAttachments() {
    
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "POUpload/PODetails/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&VendorID=" + sessionStorage.getItem('hdnVendorID') + "&UserID=" + sessionStorage.getItem('UserID') + "&Flag=Attachment&POHeaderID=" + $('#hdnPOHeader').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            var attach = "";
            jQuery("#tblAttachments").empty();

            if (data.length > 0) {

                sessionStorage.setItem('hdnVendorID', data[0].vendorID);
                $('#txtVendor').val(data[0].vendorName)
                $('#txtvendorremarks').val(data[0].userRemarks)
                jQuery('#tblAttachments').append("<thead><tr><th class='bold'>Description</th><th class='bold'>Attachment</th><th></th></tr></thead>");
                for (var i = 0; i < data.length; i++) {
                    attach = data[i].poAttachment.replace(/\s/g, "%20");
                    var str = '<tr><td style="width:47%!important">' + data[i].poAttachmentDescription + '</td><td style="width:47%!important"><a id=POFile'+i+' style="pointer:cursur;text-decoration:none;"  href="javascript:;" onclick="DownloadFile(this)">' + data[i].poAttachment + '</a></td>';
                    str += "<td style='width:5%!important'><button type='button' class='btn btn-xs btn-danger' id=Removebtnattach" + i + " onclick=fnRemoveAttachment(\'" + data[i].poid + "'\,\'POAttach'\,\'" + data[i].poAttachment+"'\)><i class='glyphicon glyphicon-remove-circle'></i></button></td></tr>";
                    jQuery('#tblAttachments').append(str);
                }
            }

            else {
                 $('#txtVendor').removeAttr('disabled')
                jQuery('#tblAttachments').append("<tr><td>No Attachments!!</td></tr>")
            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                $('.alert-danger').show();
                $('#spandanger').html('You have error. Please try again.');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
function DownloadFile(aID) {
    fnDownloadAttachments($("#" + aID.id).html(), 'PO/' + $('#hdnPOHeader').val() + '/' + sessionStorage.getItem('hdnVendorID'));
}
function fnRemoveAttachment(POID, deletionfor,attachname) {
var Attachments = {
        "SrNo": parseInt(POID),
        "DeletionFor": deletionfor,
        "RFQID": 0
    }
    jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "eRequestForQuotation/eRFQAttachmentQuesremove",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        crossDomain: true,
        async: false,
        data: JSON.stringify(Attachments),
        dataType: "json",
        success: function (data) {
            
            if (data == "1") {
                
                    fetchAttachments();
                    $('.alert-success').show();
                    $('#spansuccess1').html('Record deleted successfully!');

                    Metronic.scrollTo($(".alert-success"), -200);
                    $('.alert-success').fadeOut(7000);

                    return false;
                }
            
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                $('.alert-danger').show();
                $('#spandanger').html('You have error. Please try again.');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
var allUOM = '';
function FetchUOM(CustomerID) {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "UOM/fetchUOMCust/?CustomerID=" + CustomerID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#txtUOM").empty();
            if (data.length > 0) {
                allUOM = data;
            }
            else {
                allUOM = '';
            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                $('.alert-danger').show();
                $('#spandanger').html('You have error. Please try again.');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
            }

            return false;
            jQuery.unblockUI();
        }

    });

}
jQuery("#txtUOM").keyup(function () {
    $('#dropuom').val('')

});
jQuery("#txtUOM").typeahead({
    source: function (query, process) {
        var data = allUOM;
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(data, function (i, username) {
            map[username.uom] = username;
            usernames.push(username.uom);
        });

        process(usernames);

    },
    minLength: 2,
    updater: function (item) {
        if (map[item].uom != "") {
            $('#dropuom').val(map[item].uom)

        }
        else {
            gritternotification('Please select UOM  properly!!!');
        }

        return item;
    }

});
$('#RAexcel').on("hidden.bs.modal", function () {
    $("#instructionsDivParameter").hide();
    $("#instructionSpanParameter").hide();
    $("#error-excelparameter").hide();
    $("#success-excelparameter").hide();
    $("#file-excelparameter").val('');
    $('#btnyesno').show()
    $('#modalLoaderparameter').addClass('display-none');
})
function fnNoUpload() {
    $("#instructionsDivParameter").hide();
    $("#instructionSpanParameter").hide();
    $("#error-excelparameter").hide();
    $("#success-excelparameter").hide();
    $("#file-excelparameter").val('');
    $('#RAexcel').modal('hide');
    $('#btnyesno').show()
    $('#modalLoaderparameter').addClass('display-none');
}


$("#btninstructionexcelparameter").click(function () {
    var ErrorUOMMsz = '<ul class="col-md-3 text-left">';
    var ErrorUOMMszRight = '<ul class="col-md-5 text-left">'
    var quorem = (allUOM.length / 2) + (allUOM.length % 2);
    for (var i = 0; i < parseInt(quorem) ; i++) {
        ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].uom + '</li>';
        var z = (parseInt(quorem) + i);
        if (z <= allUOM.length - 1) {
            ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].uom + '</li>';
        }
    }
    ErrorUOMMsz = ErrorUOMMsz + '</ul>'
    ErrorUOMMszRight = ErrorUOMMszRight + '</ul>'

    // alert(ErrorUOMMsz + ErrorUOMMszRight)
    $("#ULUOM_instructions").html(ErrorUOMMsz + ErrorUOMMszRight);
    if ($('#ddlbidclosetype').val() == "S") {
        $('#libidduraion').show()

    }
    else {
        $('#libidduraion').hide()

    }
    $("#instructionsDivParameter").show();
    $("#instructionSpanParameter").show();
});
function handleFileparameter(e) {

    //Get the files from Upload control
    var files = e.target.files;
    var i, f;
    //Loop through files
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {
            var data = e.target.result;

            var result;
            var workbook = XLSX.read(data, { type: 'binary' });

            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function (y) { /* iterate through sheets */
                //Convert the cell value to Json
                var sheet1 = workbook.SheetNames[0];
                //var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1]);
                if (roa.length > 0) {
                    result = roa;
                }
            });
           
            printdataSeaBid(result)
        };
        reader.readAsArrayBuffer(f);
    }
}
var Rowcount = 0;
var ShowL1Price = ''
function printdataSeaBid(result) {
    var loopcount = result.length; //getting the data length for loop.

    var i;
    //var numberOnly = /^[0-9]+$/;
    var numberOnly = /^[0-9]\d*(\.\d+)?$/;
    $("#temptableForExcelDataparameter").empty();
    $("#temptableForExcelDataparameter").append("<tr><th style='width:20%!important;'>ItemCode</th><th>ItemService</th><th>DeliveryLocation</th><th  class=hide>Description</th><th>Quantity</th><th>UOM</th><th>PoNo</th><th>PoDeliveryDate</th></tr>");
    // checking validation for each row

    var pono = ''
    var podate = ''

    var itemcode = '', deliverylocation = '', deliverylocation = '', itemservicename = '', description = '';


    for (i = 0; i < loopcount; i++) {

        itemcode = '', podate = '', pono = '', deliverylocation = '', itemservicename = '';

        if ($.trim(result[i].PoDeliveryDate) != '') {
            podate = $.trim(result[i].PoDeliveryDate);
        }
        if ($.trim(result[i].PoNo) != '') {
            pono = $.trim(result[i].PoNo);
        }

        if ($.trim(result[i].ItemCode) != '') {
            itemcode = $.trim(result[i].ItemCode);
        }
        if ($.trim(result[i].ItemService) != '') {
            itemservicename = $.trim(result[i].ItemService);
        }
        if ($.trim(result[i].DeliveryLocation) != '') {
            deliverylocation = $.trim(result[i].DeliveryLocation);
        }
        // alert(Povalue)
        if (sessionStorage.getItem('hdnVendorID') == '0') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Please Select Vendor First then Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].ItemService) != '' && $.trim(result[i].ItemService).length > 200) {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Item/Product/Services  length should be 200 characters of Item no ' + (i + 1) + ' . Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }


        else if (!result[i].Quantity.trim().match(numberOnly) || result[i].Quantity.trim() == '') {

            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Quantity should be in numbers only of Item no ' + (i + 1) + '.');
            $("#file-excelparameter").val('');
            return false;
        }
        else if ($.trim(result[i].UOM) == '') {
            $("#error-excelparameter").show();
            $("#errspan-excelparameter").html('Quantity UOM can not be blank of Item no ' + (i + 1) + '. Please fill and upload the file again.');
            $("#file-excelparameter").val('');
            return false;
        }

        else {

            // if values are correct then creating a temp table
            $("<tr><td>" + replaceQuoutesFromStringFromExcel(itemcode) + "</td><td>" + replaceQuoutesFromStringFromExcel(result[i].ItemService) + "</td><td class=hide>" + replaceQuoutesFromStringFromExcel(description) + "</td><td>" + replaceQuoutesFromStringFromExcel(deliverylocation) + "</td><td>" + result[i].Quantity + "</td><td>" + result[i].UOM + "</td><td>" + replaceQuoutesFromStringFromExcel(pono) + "</td><td>" + podate + "</td></tr>").appendTo("#temptableForExcelDataparameter");

        }


    } // for loop ends

    var excelCorrect = 'N';
    var excelCorrectUOM = 'N';
    var ErrorUOMMsz = '';
    var ErrorUOMMszRight = '';
    Rowcount = 0;
    // check for UOM
    $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
        var this_row = $(this);
        excelCorrectUOM = 'N';
        Rowcount = Rowcount + 1;
        for (var i = 0; i < allUOM.length; i++) {
            if ($.trim(this_row.find('td:eq(5)').html()).toLowerCase() == allUOM[i].uom.trim().toLowerCase()) {//allUOM[i].UOMID
                excelCorrectUOM = 'Y';
            }

        }
        var quorem = (allUOM.length / 2) + (allUOM.length % 2);
        if (excelCorrectUOM == "N") {
            $("#error-excelparameter").show();
            ErrorUOMMsz = 'UOM not filled properly at row no ' + Rowcount + '. Please choose UOM from given below: <br><ul class="col-md-5 text-left">';
            ErrorUOMMszRight = '<ul class="col-md-5 text-left">'
            for (var i = 0; i < parseInt(quorem) ; i++) {
                ErrorUOMMsz = ErrorUOMMsz + '<li>' + allUOM[i].uom + '</li>';
                var z = (parseInt(quorem) + i);
                if (z <= allUOM.length - 1) {
                    ErrorUOMMszRight = ErrorUOMMszRight + '<li>' + allUOM[z].uom + '</li>';
                }
            }
            ErrorUOMMsz = ErrorUOMMsz + '</ul>'
            ErrorUOMMszRight = ErrorUOMMszRight + '</ul><div class=clearfix></div><br/>and upload the file again.'


            $("#errspan-excelparameter").html(ErrorUOMMsz + ErrorUOMMszRight);

            return false;
        }
        if (excelCorrectUOM == 'Y') {
            $('#btnyesno').show();
            $("#error-excelparameter").hide();
            $("#errspan-excelparameter").html('');
            $("#success-excelparameter").show()
            $("#succspan-excelparameter").html('Excel file is found ok. Do you want to upload? \n This will clean your existing Data.')
            $("#file-excelparameter").val('');

            excelCorrectUOM = '';
        }
    });
}

function InsupdProductfromExcel() {
    $("#success-excelparameter").hide();
    $("#error-excelparameter").hide();
    $('#loader-msgparameter').html('Processing. Please Wait...!');
    $('#modalLoaderparameter').removeClass('display-none');

    var rowCount = jQuery('#temptableForExcelDataparameter tr').length;
    if (rowCount > 0) {
        PriceDetails = '';
        $("#temptableForExcelDataparameter tr:gt(0)").each(function () {
            var this_row = $(this);
            PriceDetails = PriceDetails + 'insert into PODeliverySpread(POHeaderID,CustomerID,VendorID,ItemCode,ItemServiceName,DeliveryLocation,Quantity,UOM,PONo,PODeliveryDate,CreatedBy,CreatedOn) values('
            var deliverylocation = $.trim(this_row.find('td:eq(3)').html()).replace(/'/g, "");
            PriceDetails = PriceDetails + $('#hdnPOHeader').val() + "," + sessionStorage.getItem('CustomerID') + "," + sessionStorage.getItem('hdnVendorID') + ",'" + $.trim(this_row.find('td:eq(0)').html()) + "','" + $.trim(this_row.find('td:eq(1)').html()) + "','" + $.trim(deliverylocation) + "','" + removeThousandSeperator($.trim(this_row.find('td:eq(4)').html())) + "','" + $.trim(this_row.find('td:eq(5)').html()) + "','" + this_row.find('td:eq(6)').html() + "','" + $.trim(this_row.find('td:eq(7)').html()) + "',dbo.decrypt('" + sessionStorage.getItem('UserID') + "'),getdate())";


        })

        var Tab2data = {
            "PriceDetails": PriceDetails,
            "VendorID": parseInt(sessionStorage.getItem('hdnVendorID')),
            "CustomerID": parseInt(sessionStorage.getItem('CustomerID')),
            "UserID": sessionStorage.getItem('UserID'),
            "Flag": 'Insert',
            "POHeaderID": parseInt($('#hdnPOHeader').val()),
            "UserRemarks": $('#txtvendorremarks').val()
        };
      
        jQuery.ajax({

            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "POUpload/InsDeliverySpread/",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            crossDomain: true,
            async: false,
            data: JSON.stringify(Tab2data),
            dataType: "json",
            success: function (data) {
                if (data == '1') {

                    $('#btnyesno').hide()
                    $("#success-excelparameter").show()
                    $("#succspan-excelparameter").html('Excel file uploaded sucessfully')
                    setTimeout(function () {
                        $('#modalLoaderparameter').addClass('display-none');
                        $('#RAexcel').modal('hide');
                        fetchDeliverySpread();
                    }, 1000)
                    return true;
                }
                else {
                    return false;
                }

            },
            error: function (xhr, status, error) {

                var err = eval("(" + xhr.responseText + ")");
                if (xhr.status === 401) {
                    error401Messagebox(err.Message);
                }
                else {
                    $('#modalLoaderparameter').addClass('display-none');
                    $("#error-excelparameter").show();
                    $("#errspan-excelparameter").html('You have error. Please try again.');
                }

                return false;
                jQuery.unblockUI();
            }

        });
    }
    else {
        $("#error-excelparameter").show();
        $("#errspan-excelparameter").html('No Items Found in Excel');
    }
}
function fetchDeliverySpread() {

    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "POUpload/PODetails/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&VendorID=" + sessionStorage.getItem('hdnVendorID') + "&UserID=" + sessionStorage.getItem('UserID') + "&Flag=Details&POHeaderID=" + $('#hdnPOHeader').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            var attach = "";
            jQuery("#tblServicesProduct").empty();

            if (data.length > 0) {
               
                jQuery("#tblServicesProduct").append("<thead><tr style='background: gray; color: #FFF;'><th 'width:20%!important;'></th><th>Item Code</th><th>Item/Service</th><th>Delivery Location</th><th>Po No</th><th>Po Delivery Date</th><th>Quantity</th><th>UOM</th></tr></thead>");


                for (var i = 0; i < data.length; i++) {
                    jQuery("#tblServicesProduct").append('<tr id=trid' + i + '><td><button type="button" class="btn btn-xs btn-success" onclick="editvalues(trid' + i + ')" ><i class="fa fa-pencil"></i></button>&nbsp;<button class="btn  btn-xs btn-danger" onclick="deleterow(trid' + i + ')" ><i class="glyphicon glyphicon-remove-circle"></i></button></td><td  style="width:20%!important;">' + data[i].itemCode + '</td><td>' + data[i].itemServiceName + '</td><td>' + data[i].deliveryLocation + '</td><td>' + data[i].pONo + '</td><td>' + data[i].pODeliveryDate + '</td><td class=text-right>' + thousands_separators(data[i].quantity) + '</td><td>' + data[i].uOM + '</td></tr>');

                }
            }

            else {
               
                jQuery('#tblServicesProduct').append("<tr><td>No Delivery Spread!!</td></tr>")
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }

            return false;
            jQuery.unblockUI();
        }
    })
}
function resetfun() {
    $('#add_or').text('Add');
    $('#add_submit').removeClass('hide')
    $('#txtquantitiy').val('')
    $('#txtUOM').val('')
    $('#txtshortname').val('')
    $('#txtItemCode').val('')
    $('#txtedelivery').val('')
    $('#txtPODate').val('')
    $('#txtPoNo').val('')

}
$("#btndownloadTemplate").click(function (e) {

    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var mins = dt.getMinutes();
    var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
    
    tableToExcelMultipleWorkSheet(['tbldetails', 'tblUOM'], ['DataTemplate', 'Instructions'], 'POXLTemplate -' + postfix + '.xls')
});
function fnfillInstructionExcel() {
    $('#tblUOM').empty()

    $('#tblUOM').append('<thead><tr><th   colspan=2  data-style="Header" colspan=2>Please enter UOM as given below:</th></tr></thead>')
    var quorem = (allUOM.length / 2) + (allUOM.length % 2);
    for (var i = 0; i < parseInt(quorem) ; i++) {
        $('#tblUOM').append('<tr id=TR' + i + '><td>' + allUOM[i].uom + '</td>');
        var z = (parseInt(quorem) + i);
        if (z <= allUOM.length - 1) {
            $('#TR' + i).append('<td>' + allUOM[z].uom + '</td></tr>')
        }
    }

}
function CancelPO() {
    bootbox.dialog({
        message: "Are you sure you want to Cancel PO? ",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    cnPO()
                }
            },
            cancel: {
                label: "No",
                className: "btn-default",
                callback: function () {

                }
            }
        }
    });

}

function cnPO() {
    var Cancelbid = {
        "BidID": parseInt($('#hdnPOHeader').val()),
        "For": 'PO',
        "Remarks": '',
        "SendMail": 'NoMail',
        "UserID": sessionStorage.getItem('UserID')
    };
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
            if (data == '1' ) {
                bootbox.alert("PO Cancelled successfully.", function () {
                    window.location = "index.html";
                    return false;
                });
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
function FetchRecomendedVendor() {

    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "PoUpload/POHistory/?POHeaderID=" + $('#hdnPOHeader').val() + "&UserID=" + (sessionStorage.getItem("VendorId")) ,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            $('#tblremarksforward').empty()
          
            if (data.length > 0) {
                $('#HDHistory').removeClass('hide')
                $('#frmdivforward').removeClass('hide')
                $('#divRemarks').removeClass('col-md-12')
                $('#divRemarks').addClass('col-md-6')
                $('#tblremarksforward').append('<tr><th>Action Taken By</th><th>Remarks</th><th>Action Type</th><th class=hide id=thforward>Recommended Vendor</th><th>Completion DT</th></tr>')
                
                for (var i = 0; i < data.length; i++) {
                    if (data[i].VendorName != "") {
                        $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].vendorName + '</td><td>' + data[i].receiptDt + '</td></tr>')
                        $('#thforward').removeClass('hide')
                    }
                    else {
                        $('#tblremarksforward').append('<tr><td>' + data[i].actionTakenBy + '</td><td>' + data[i].remarks + '</td><td>' + data[i].finalStatus + '</td><td>' + data[i].receiptDt + '</td></tr>')
                        $('#thforward').addClass('hide')
                    }


                }

            }
            else {
                $('#HDHistory').addClass('hide')
                $('#frmdivforward').addClass('hide')
                $('#tblapprovalprocess').append('<tr><td colspan="15" style="text-align: center; color: Red">No record found</td></tr>')
            }
            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert(xhr.status + ' ' + xhr.statusText);
                jQuery.unblockUI();
            }

            return false;
            jQuery.unblockUI();
        }
    });

}
var vendorsForAutoComplete = ''
function fetchVendorGroup(categoryFor, vendorId) {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=" + categoryFor + "&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VendorID=" + vendorId,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                vendorsForAutoComplete = data;
            }

            jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                $('.alert-danger').show();
                $('#spandanger').html('You have error. Please try again.');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
            }

            return false;
            jQuery.unblockUI();
        }
    });
}
jQuery("#txtVendorGroup").typeahead({
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
            getCategoryWiseVendors(map[item].categoryID);
        }
        else {
            gritternotification('Please select Vendor  properly!!!');
        }

        return item;
    }

});
var vendor = "";

function getCategoryWiseVendors(categoryID) {

    jQuery.ajax({

        type: "GET",

        contentType: "application/json; charset=utf-8",

        url: sessionStorage.getItem("APIPath") + "ConfigureBid/FetchVendorCategoryWise_PEV2/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&CategoryID=" + categoryID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,

        dataType: "json",

        success: function (data) {
            if (data.length) {
                vendor = data;
            }

        },
        error: function (xhr, status, error) {

            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                $('.alert-danger').show();
                $('#spandanger').html('You have error. Please try again.');
                Metronic.scrollTo($(".alert-danger"), -200);
                $('.alert-danger').fadeOut(7000);
            }

            return false;
            jQuery.unblockUI();
        }

    });


}