
function fillBidTypedropdown(bidtypeid) {
    var CustId = parseInt(sessionStorage.getItem("CustomerID"));
    var bidTypeRequestObj = {
        "CustomerID": CustId,
        "BidTypeID": 0,
        "ExcludeStatus": "N"
    }
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        //url: sessionStorage.getItem("APIPath") + "BidType/fetchBidType/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0&excludeStatus=N&UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')),
        url: sessionStorage.getItem("APIPath") + "BidType/fetchBidType/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=0&excludeStatus=N",
        //url: sessionStorage.getItem("APIPath") + "BidType/fetchBidType",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        //data: JSON.stringify(bidTypeRequestObj),
        dataType: "json",
        success: function (data) {
            jQuery("#dropBidType").empty();
            jQuery("#dropBidType").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#dropBidType").append(jQuery("<option ></option>").val(data[i].bidTypeID).html(data[i].bidTypeName));
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

function fillBidForDropdown() {
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ConfigureBid/fetchBidTypeMapping/?CustomerID=" + sessionStorage.getItem("CustomerID") + "&BidTypeID=" + jQuery('#dropBidType').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlBidForId").empty();
            jQuery("#ddlBidForId").append(jQuery("<option ></option>").val("").html("Select"));
            for (var i = 0; i < data.length; i++) {
                jQuery("#ddlBidForId").append(jQuery("<option ></option>").val(data[i].bidTypeID).html(data[i].bidTypeName));
            }
            jQuery("#ddlBidForId").val('2').attr("selected", "selected");
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
    fetchBidFor("2");
    jQuery("#ddlBidForId").prop("disabled", true);

}
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