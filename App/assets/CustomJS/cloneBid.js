

var _bidTypeId = 0;
function Pageloaded() {
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param);
    _bidTypeId = getUrlVarsURL(decryptedstring)["bidTypeId"];
  
    if (_bidTypeId == 6) {
        $("#ddlBidType").val(_bidTypeId)
        $(".ddlBidType").html('Forward Auction');
    }
    if (_bidTypeId == 8) {
        $("#ddlBidType").val(_bidTypeId)
        $(".ddlBidType").html('Coal Auction');
    }
    else {
        $("#ddlBidType").val(_bidTypeId)
        $(".ddlBidType").html('Reverse Auction');
    }
}





var form = $('#RFIRFQREport');
function formvalidate() { 
    
form.validate({

    doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.

    errorElement: 'span', //default input error message container

    errorClass: 'help-block help-block-error', // default input error message class

    focusInvalid: false, // do not focus the last invalid input

    rules: {
        txtSearchText: {
            required: true
        }
        

    },

    messages: {
        txtSearchText: {
            required: "Please Enter Search Text."
        }
    },

    

    invalidHandler: function (event, validator) {

    },

    highlight: function (element) {

        $(element).closest('.col-md-12').addClass('has-error');

    },

    unhighlight: function (element) {

        $(element).closest('.col-md-12').removeClass('has-error');

    },

    success: function (label) {  


    },


    submitHandler: function (form) {      
        fetchBidDetailsForCloning()
    }

});

}

function fetchBidDetailsForCloning() {    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });

    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidDetailsForCloning/?BidTypeID=" + $('#ddlBidType').val() + "&UserId=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&searchText=" + $('#txtSearchText').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#tblBidDetails > tbody').empty();
            if (data.length > 0) {
                $('#displayTable').show();
                for (var i = 0; i < data.length; i++) {
                    var details = (data[i].bidDetails).replace(/(\r\n|\n|\r)/gm, "");
                   
                    $("<tr><td>" + data[i].eventNo + "</td><td>" + data[i].bidSubject + "</td><td>" + data[i].bidDetails + "</td><td>" + data[i].bidDate + "</td><td>" + data[i].bidTime + "</td><td>" + data[i].status + "</td><td><button class=\"btn btn-sm btn-primary\" type=\"button\" Onclick=\"confirmCloningBid(\'" + data[i].bidId + "'\,\'" + data[i].bidSubject + "'\,\'" + details + "'\,\'" + data[i].bidDate + "'\,\'" + data[i].eventNo + "'\)\" >Clone</button></td></tr>").appendTo('#tblBidDetails');
                }

            } else {
                $('#displayTable').show();                
                $('<tr><td style="color:red !important; text-align: center;" colspan="7"> No results </td></tr>').appendTo('#tblBidDetails');

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
    jQuery.unblockUI();

}

function confirmCloningBid(BidId,BidSubject,BidDetails,BidDate,SrNo) {
    bootbox.dialog({
        message: "You are about to clone following bid with details: <br/><br/>" +
        "<table class=\"table table-striped table-bordered table-hover\"><tr><td>Event No</td><td>" + SrNo +
        "</td></tr><tr><td>Bid Subject</td><td>" + BidSubject +
        "</td></tr><tr><td>Bid Description</td><td>" + BidDetails +
        "</td></tr><tr><td>Biddate</td><td>" + BidDate + "</td></tr></table>",
        buttons: {
            confirm: {
                label: "Yes",
                className: "btn-success",
                callback: function () {
                    clone(BidId)
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

function clone(BidId) {

   var param = {
       "BidId": parseInt(BidId),
       "UserId": sessionStorage.getItem('UserID')
        
    };
    
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/CloneExistingBid",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "POST",
        data: JSON.stringify(param),
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            //alert(data[0].IsSuccess)
            if (parseInt(data) > 0) {
                jQuery('#divalerterror').hide();
                msgForClonedBid(parseInt(data), +$("#ddlBidType").val());
               // fileUploader(parseInt(data))
                fetchBidDetailsForCloning();
            }  else {
                jQuery('#divalertsucess').hide();
                $("#error").html('Transaction Unsuccessfull.');
                App.scrollTo($('#divalerterror'), -200);
                jQuery('#divalerterror').slideDown(1000);
                $('#divalerterror').fadeOut(5000);
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
    //clearform();
}
function clearform() {
    jQuery("#txtUsername").val('');
    jQuery("#txtemail").val('');
    jQuery("#txtmobilno").val('');
    jQuery("#txtuserrole").val('');
    jQuery('#hdnUserID').val('0');
    jQuery("#ddlroleMaster").val('');
    jQuery('div#divrblist span').each(function () {
        $(this).attr('class', '');
    });

}

jQuery("#txtSearch").keyup(function () {
    _this = this;
    // Show only matching TR, hide rest of them
    jQuery.each($("#tblBidDetails tbody").find("tr"), function () {
        console.log($(this).text());
        if (jQuery(this).text().toLowerCase().indexOf(jQuery(_this).val().toLowerCase()) == -1)
            jQuery(this).hide();
        else
            jQuery(this).show();
    });
});


function msgForClonedBid(bidId, bidTypeId) {
    var encrypdata = fnencrypt("BidID="+bidId)
    var urlLink = '';
    switch (bidTypeId) {
        case 1:
            urlLink = 'configureBidOtheritem.html?param='+encrypdata;
            break;
        case 2:
            urlLink = 'configureBidAirImport.html?param=' + encrypdata;
            break;
        case 3:
            urlLink = 'configureBidSeaImport.html?param=' + encrypdata;
            break;
        case 4:
            urlLink = 'configureBidDomestic.html?param=' + encrypdata;
            break;
        case 5:
            urlLink = 'configureBidWarehouse.html?param=' + encrypdata;
            break;
        case 6:
            urlLink = 'PeFa.html?param=' + encrypdata;
            break;
        case 7:
            urlLink = 'configureBidSeaExport.html?param=' + encrypdata;
           // urlLink = 'eRA.html?BidID=' + bidId;
            break;
        case 8:
            urlLink = 'configureBidCoalExport.html?param=' + encrypdata;
            // urlLink = 'eRA.html?BidID=' + bidId;
            break;
        case 9:
            urlLink = '';

        default:            
    }

        bootbox.dialog({
            message: "Bid clonned successfully. Do you want to modify bid details?",
            buttons: {
                confirm: {
                    label: "Yes",
                    className: "btn-success",
                    callback: function () {
                        window.location = urlLink;
                    }
                },
                cancel: {
                    label: "No",
                    className: "btn-default",
                    callback: function () {
                        window.location = sessionStorage.getItem("HomePage");
                    }
                }
            }
        });
}


function fileUploader(bidID) {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var formData = new window.FormData();

    formData.append("fileTerms", '');

    formData.append("fileAnyOther", '');

    formData.append("AttachmentFor", 'Bid');

    formData.append("BidID", bidID);
    formData.append("VendorID", '');
    formData.append("isClonedBid", '1');


    $.ajax({

        url: 'ConfigureFileAttachment.ashx',

        data: formData,

        processData: false,

        contentType: false,

        asyc: false,

        type: 'POST',

        success: function (data) {
            jQuery.unblockUI();
        },

        error: function () {

            bootbox.alert("Attachment error.");
            jQuery.unblockUI();
        }

    });

}