let RFQID;
let CUSTOMERID;

jQuery(document).ready(function () {
    //FROM HTML
    if (sessionStorage.getItem('UserID') == null || sessionStorage.getItem('UserID') == "") {
        window.location = sessionStorage.getItem('MainUrl');
    }
    else {
        if (sessionStorage.getItem("UserType") == "E") {
            $('.page-container').show();
        }
        else {
            bootbox.alert("You are not Authorize to view this page", function () {
                parent.history.back();
                return false;
            });
        }
    }

    App.init();
    setCommonData();
    fetchMenuItemsFromSession(9, 10);
    fetchBidType();// for serach vendor
    FormValidatePR()
    numberonly()
    debugger
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    RFQID = getUrlVarsURL(decryptedstring)["RFQID"]
    CUSTOMERID = getUrlVarsURL(decryptedstring)["CustomerID"]
    GetPR2Mapping()
});



function searchPIForm() {

    $("#submit_form_prmapping").removeClass('hide')
}
//adding pr details

function AddPRDetail() {
    if ($("#tblpinumber").text() == "") {
        $("#tblpinumber").text($("#txtpinumber").val());
    }

    $("#PRMapTable").removeClass('hide')
    $("#PRMapTable").append('<tr><td></td><td>' + $("#txtrfqpr option:selected").text() + '</td><td>' + $("#txtprnumber option:selected").text() + '</td><td>' + $("#txtlineitem option:selected").text() + '</td><td>' + $("#txtmaterialcode option:selected").text() + '</td><td>' + $("#txtshortname option:selected").text() + '</td><td>' + $("#txtratenfa option:selected").text() + '</td><td>' + $("#txtquantity option:selected").text() + '</td><td>' + 'vendor a value' + '</td><td>' + 'vendor b value' + '</td></tr>');
}

//form validation for PR Form
function FormValidatePR() {

    $('#submit_form_prmapping').validate({

        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {

            txtrfqpr: {
                required: true,
            },
            txtprnumber: {
                required: true,
            },
            txtlineitem: {
                required: true,
            },
            txtmaterialcode: {
                required: true,
            },
            txtshortname: {
                required: true,
            },
            txtratenfa: {
                required: true,
            },
            txtquantity: {
                required: true,
            }

        },
        messages: {



        },
        invalidHandler: function (event, validator) {
            //errorVendor.show()
            // successVendor.hide();
            $('#successdivbank').show()
            $('#successdivbank').hide()
            $('#successdivbank').html("")
            $('#errorbank').text("Please Enter all required field to proceed");
            $('#errordivbank').fadeOut(6000);
        },

        highlight: function (element) {
            $(element).closest('.xyz').addClass('has-error');

        },

        unhighlight: function (element) {
            $(element).closest('.xyz').removeClass('has-error');

        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        success: function (label) {
        },
        submitHandler: function (form) {


            AddPRDetail()
        }
    });
}



function GetPR2Mapping() {

    let _RFQID = parseInt(RFQID);
    let _CustomerID = parseInt(CUSTOMERID)

    console.log(sessionStorage.getItem("APIPath") + "SAPIntegration/GetPR2Mapping/?RFQID=" + _RFQID + '&CustomerID=' + _CustomerID)
    jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "SAPIntegration/GetPR2Mapping/?RFQID=" + _RFQID + '&CustomerID=' + _CustomerID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
            debugger
            let strtbl = "";
            let strtblH = "";
            //tablehead
            strtblH += `<thead><tr><th>PI Number</th><th id='tblpinumber'></th><th>RFQ ID</th><th class='bold'>${RFQID}</th><th></th><th></th><th></th>`;
            for (var i = 0; i < data.associatedVendors.length; i++) {

                strtblH += '<th></th>';
            }
            strtblH += '</tr>';
            strtblH += '<tr><th></th><th>RFQ/PR1 Line item number</th><th>PR Number</th><th>Line Item of requisition</th><th>Material Code</th> <th>Shortname</th><th>Quantity</th>';
            for (i = 0; i < data.associatedVendors.length; i++) {

                strtblH += '<th>' + data.associatedVendors[i].vendorName + '</th>';
            }

            strtblH += '</tr></thead>';
            $("#PRMapTable").append(strtblH);
            $("#tblpinumber").text(data.resultToReturn[0].banfn);

            //tablebody
            for (i = 0; i < data.resultToReturn.length; i++) {
                strtbl += '<tbody><tr><td></td><td>' + data.resultToReturn[i].bnfpo + '</td><td>' + data.resultToReturn[i].bednr + '</td><td>' + data.resultToReturn[i].bnfpo + '</td><td>' + data.resultToReturn[i].matnr + '</td><td>' + data.resultToReturn[i].txZ01 + '</td><td>' + data.resultToReturn[i].menge + '</td>';
                for (i = 0; i < data.associatedVendors.length; i++) {

                    strtbl += '<td>' + "<input class='form-control'/>" + '</td>'
                }
                strtbl += '</tr></tbody>'
                $("#PRMapTable").append(strtbl);
            }
            $("#PRMapTable").removeClass('hide')



        },
        error: function (xhr, status, error) {

            var err = xhr.responseText
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
