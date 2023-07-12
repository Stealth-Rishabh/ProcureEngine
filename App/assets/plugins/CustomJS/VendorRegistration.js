
$(document).ready(function () {

    //FROM HTML
    Pageloaded()
    setInterval(function () { Pageloaded() }, 15000);
    Metronic.init();
    Layout.init();
    QuickSidebar.init();
    FormWizard.init();
    setCommonData();

    ///
    FetchCategoryMaster();
    FetchVendorRegistrationDetails();
    $("#add_new").click(function () {
        var finyear = $('#ddlcompanyfinyear option:selected').text();
        var Amount = $('#txtCompanyAmount').val();
        var Currency = $('#ddlcurrency option:selected').text();
        AddRegistervendor(finyear, Amount, Currency);
    });
    $("#btnaddvindata").click(function () {
        var compfinyear = $('#ddlcompfinyear option:selected').text();
        var salesamount = $('#txtsalesturnover').val();
        var salescurrency = $('#ddlcompcurrency option:selected').text();

        var networthamount = $('#txtnetWorthcredit').val();
        var networthcurrency = $('#ddlnetworthcurrency option:selected').text();
        AddtblCompanyCreditLimit(compfinyear, salesamount, salescurrency, networthamount, networthcurrency);
    });
});

function AddRegistervendor(A,B,C) {
    var str = "<tr><td>" + A + "</td><td>" + B + "</td><td>" + C + "</td></td></tr>";
    jQuery('#tblFinincialYear > tbody').append(str);
    validateTabledata();
}
function AddtblCompanyCreditLimit(A, B, C,D,E) {
    var str = "<tr><td>" + A + "</td><td>" + B + "</td><td>" + C + "</td><td>" + D + "</td><td>" + E + "</td></td></tr>";
    jQuery('#tblcompanycreditlimit > tbody').append(str);
    validateCompanylimit();
}


function validateTabledata() {
    if ($('#tblFinincialYear').find('tr').length > 1) {
        $('#divtable').show();
    }
    else {
        $('#divtable').hide();
    }
}
function validateCompanylimit() {
    if ($('#tblcompanycreditlimit').find('tr').length > 1) {
        $('#divcompanycreditlimit').show();
    }
    else {
        $('#divcompanycreditlimit').hide();
    }
}

function FetchCategoryMaster() {
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VendorRegistration/FetchCategoryMaster",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            jQuery("#ddlCategory").empty();
            jQuery("#ddlCategory").append(jQuery("<option ></option>").val("").html("Select"));
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlCategory").append(jQuery("<option ></option>").val(data[i].CategoryID).html(data[i].CategoryName));
            }
        }
    });
}
function getcategoryIds()
{
    
    var CatID = '0' ;
    if ($('#inlineCheckbox1').closest('span').attr('class') == 'checked' && $('#inlineCheckbox2').closest('span').attr('class') == 'checked') {
        CatID = $('#inlineCheckbox1').val() + ',' + $('#inlineCheckbox2').val();
    }
    else if($('#inlineCheckbox1').closest('span').attr('class')=='checked')
    {
        CatID = $('#inlineCheckbox1').val();
    }
    else if($('#inlineCheckbox2').closest('span').attr('class')=='checked')
    {
        CatID = $('#inlineCheckbox2').val();
    }
    return CatID
}
    // TAB 1
function CategorizationAndContactDetails() {
    var _cleanString = StringEncodingMechanism(jQuery("#txtname").val());
    var _cleanString2 = StringEncodingMechanism(jQuery("#txtofficeaddress").val());
    var _cleanString3 = StringEncodingMechanism(jQuery("#txtworksaddress").val());
        var CatIDs = getcategoryIds();
        var VendorRegDetails = {
            "VendorID": jQuery("#hdnvendorid").val(),
            "CatetoryIDs": CatIDs,
            //"VendorName": jQuery("#txtname").val(),
            "VendorName": _cleanString,
            "VendorMobileNo": jQuery("#txtmobileno").val(),
            //"OfficeAddress": jQuery("#txtofficeaddress").val(),
            "OfficeAddress": _cleanString2,
            "OfficeZipCode": jQuery("#txtofficezipcode").val(),
            "OfficePhoneNo": jQuery("#txtofficephoneno").val(),
            "OfficeFaxNo": jQuery("#txtofficefax").val(),
            //"WorkAddress": jQuery("#txtworksaddress").val(),
            "WorkAddress": _cleanString3,
            "WorkZipCode": jQuery("#txtworkzipcode").val(),
            "WorkPhoneNo": jQuery("#txtworkphoneno").val(),
            "WorkFaxNo": jQuery("#txtworkfaxno").val(),
            "LoginUserID": '1234'//sessionStorage.getItem('UserID')
        };
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdCategorizationAndContactDetails",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(VendorRegDetails),
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if(data.length>0)
                {
                    jQuery("#hdnvendorid").val(data[0].VendorID);
                }
            }
        });
    }

    // TAB 2
    function InsUpdRegistrationDetails() {
        var RegistrationDetails = {
            "VendorID": jQuery("#hdnvendorid").val(),
            "CentralExciseRegistrationNo": jQuery("#txtCentralRegistrationNo").val(),
            "CentralSalesTaxNo": jQuery("#txtcentralsalestaxno").val(),
            "SalesTaxRegistrationNo_State": jQuery("#txtStatesalsetaxNo").val(),
            "SalesTaxRegistrationNo_Central": jQuery("#txtcentralsalsetaxno").val(),
            "ServiceTaxRegistrationNo": jQuery("#txtServiceTaxno").val(),
            "VatTinNo": jQuery("#txtvattinno").val(),
            "ESICRegistrationNo": jQuery("#txtesicno").val(),
            "PFRegistrationNo": jQuery("#txtpfno").val(),
            "LabourLicenceNo": jQuery("#txtlabourlicenceno").val(),
            "ExporterImporterCodeNo": jQuery("#txtexprotercodeno").val()
        };
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdRegistrationDetails",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(RegistrationDetails),
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    jQuery("#hdnvendorid").val(data[0].VendorID);
                }
            }
        });
    }
    // TAB 3
function InsUpdCategoryDetails() {
    var _cleanString4 = StringEncodingMechanism(jQuery("#txtcategoryname").val());
    var _cleanString5 = StringEncodingMechanism(jQuery("#txtcategoryaddress").val());
    var _cleanString6 = StringEncodingMechanism(jQuery("#txtcontactpersonname").val());
        var Sales ='N'
        var Services ='N'
        if ($('#chkforsales').closest('span').attr('class') == 'checked')
        {
            Sales='Y';
        }
        if ($('#chkforservices').closest('span').attr('class') == 'checked')
        {
            Services='Y';
        }
        var CategoryDetails = {
            "VendorID": jQuery("#hdnvendorid").val(),
            "CategoryID": jQuery("#ddlCategory option:selected").val(),
            //"CategoryName": jQuery("#txtcategoryname").val(),
            "CategoryName": _cleanString4,
            //"Address": jQuery("#txtcategoryaddress").val(),
            "Address": _cleanString5,
            "CountryID": jQuery("#txtcountry").val(),
            "Phone": jQuery("#txtphone").val(),
            "EMail": jQuery("#txtemail").val(),
            //"ContactPersonName": jQuery("#txtcontactpersonname").val(),
            "ContactPersonName": _cleanString6,
            "ContactPersonMobileNo": jQuery("#txtcontactpersonmobileno").val(),
            "ForSalses": Sales,
            "ForServices": Services
        };
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdCategoryDetails",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(CategoryDetails),
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    jQuery("#hdnvendorid").val(data[0].VendorID);
                }
            }
        });
        FetchCategoryDetails();
    }
    $('#btnAddcategory').click(function () {
        if ($('#submit_form').valid() == true) {
            InsUpdCategoryDetails();
            return true;
        }
       
    })
    function FetchCategoryDetails() {
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/FetchCategoryDetails/?VendorID=" + jQuery("#hdnvendorid").val() + "&ID=0",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    jQuery('#tblcategorydetails > tbody').empty();
                    for (var i = 0; i <= data.length; i++) {
                        var str = "<tr><td>" + data[i].CategoryName + "</td><td>" + data[i].Address + "</td>";
                        str += "<td>" + data[i].CountryID + "</td><td>" + data[i].Phone + "</td><td>" + data[i].EMail + "</td>";
                        str += "<td>" + data[i].ContactPersonName + "</td><td>" + data[i].ContactPersonMobileNo + "</td><td>" + data[i].ForSalses + "</td><td>" + data[i].ForServices + "</td></tr>";
                        jQuery('#tblcategorydetails > tbody').append(str);
                        jQuery('#tbldetailCategory > tbody').append(str);

                    }
                }
            }
        });
    }

    // TAB 4
function InsUpdClientDetails() {
    var _cleanString7 = StringEncodingMechanism(jQuery("#txtclientname").val());
    var _cleanString8 = StringEncodingMechanism(jQuery("#txtclientaddress").val());
        var ClientDetails = {
            "VendorID": jQuery("#hdnvendorid").val(),
            //"Name": jQuery("#txtclientname").val(),
            "Name": _cleanString7,
            "Phone": jQuery("#txtclientPhone").val(),
            //"Address": jQuery("#txtclientaddress").val(),
            "Address": _cleanString8,
            "ScopeOfWork": jQuery("#txtclientscopeofwork").val(),
            "Email": jQuery("#txtclientemail").val()
        };
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdClientDetails",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(ClientDetails),
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    jQuery("#hdnvendorid").val(data[0].VendorID);
                }
            }
        });
        FetchClientDetails();
    }
    $('#btnAddClientaldetails').click(function () {
        if ($('#submit_form').valid() == true) {
            InsUpdClientDetails();
            return true;
        }
       
    });
    function  FetchClientDetails()
    {
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/FetchClientDetails/?VendorID=" + jQuery("#hdnvendorid").val() + "&ID=0",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                jQuery('#tblclientaldetails > tbody').empty(str);
                jQuery('#tbldetailCliental > tbody').empty(str);
                if (data.length > 0) {
                    for (var i = 0; i <= data.length; i++) {
                        var str = "<tr><td>" + data[i].Name + "</td><td>" + data[i].Phone + "</td><td>" + data[i].Address + "</td><td>" + data[i].ScopeOfWork + "</td><td>" + data[i].EMail + "</td></tr>";
                        jQuery('#tblclientaldetails > tbody').append(str);
                        jQuery('#tbldetailCliental > tbody').append(str);

                    }
                }
            }
        });
    }

    $('#btnaddCreditcarddata').click(function () {
        if ($('#submit_form').valid() == true) {
            InsUpdBillingAndCreditCardDetails();
            return true;
        }
    })

    function InsUpdBillingAndCreditCardDetails() {
        var CreditCardDetails = {
            "VendorID": jQuery("#hdnvendorid").val(),
            "FinincialYear": jQuery("#ddlcompfinyear option:selected").text(),
            "SalesTurnOver": jQuery("#txtsalesturnover").val(),
            "SalesTurnOver_Currency": jQuery("#ddlcompcurrency option:selected").text(),
            "NetWorthCreditLimit": jQuery("#txtnetWorthcredit").val(),
            "NetWorthCreditLimit_Currency": jQuery("#ddlnetworthcurrency option:selected").text()
        };
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdBillingAndCreditCardDetails",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(CreditCardDetails),
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    jQuery("#hdnvendorid").val(data[0].VendorID);
                }
            }
        });
        fetchBillingAndCreditCardDetails();
    }

function InsUpdBankerDetails() {
    var _cleanString9 = StringEncodingMechanism(jQuery("#txtbank").val());
        var BankerDetails = {
            "VendorID": jQuery("#hdnvendorid").val(),
            //"BankName": jQuery("#txtbank").val(),
            "BankName": _cleanString9,
            "BankBranch": jQuery("#txtbranch").val(),
            "NEFTNo": jQuery("#txtneftno").val(),
            "RTGSNo": jQuery("#txtrtgsno").val(),
            "IFSCCode": jQuery("#txtifsccode").val(),
            "SWIFTCode": jQuery("#txtswiftcode").val(),
            "MICRNo": jQuery("#txtmicrno").val()
        };
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdBankerDetails",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(BankerDetails),
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    jQuery("#hdnvendorid").val(data[0].VendorID);
                }
            }
        });
        FetchBankerDetails();
    }
    $('#btnAddbankerDetails').click(function () {
        if ($('#submit_form').valid() == true) {
            InsUpdBankerDetails();
            return true;
        }
       
    });
    function FetchBankerDetails() {
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/FetchBankerDetails/?VendorID=" + jQuery("#hdnvendorid").val() + "&ID=0",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                jQuery('#tbldetailsbanker > tbody').empty();
                jQuery('#tblbankerdetails > tbody').empty();
                if (data.length > 0) {
                    for (var i = 0; i <= data.length; i++) {
                        var str = "<tr><td>" + data[i].BankName + "</td>";
                        str += "<td>" + data[i].BankBranch + "</td>";
                        str += "<td>" + data[i].NEFTNo + "</td>";
                        str += "<td>" + data[i].RTGSNo + "</td>";
                        str += "<td>" + data[i].IFSCCode + "</td>";
                        str += "<td>" + data[i].SWIFTCode + "</td>";
                        str += "<td>" + data[i].MICRNo + "</td></tr>";
                        jQuery('#tbldetailsbanker > tbody').append(str);
                        jQuery('#tblbankerdetails > tbody').append(str);
                    }
                }
            }
        });
    }
    $('#add_new').click(function () {
        InsUpdFinincialYears();
    })

    function InsUpdFinincialYears() {
        var CreditCardDetails = {
            "VendorID": jQuery("#hdnvendorid").val(),
            "FinincialYear": jQuery("#ddlcompanyfinyear option:selected").text(),
            "Amount": jQuery("#txtCompanyAmount").val(),
            "Currency": jQuery("#ddlcurrency option:selected").text(),
        };
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdFinincialYears",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(CreditCardDetails),
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    jQuery("#hdnvendorid").val(data[0].VendorID);
                }
                
            }
        });
    }

    function InsUpdFinincialYearDetails() {
        var FinincialYearDetails = {
            "VendorID": jQuery("#hdnvendorid").val(),
            "PaidUpSharedCapital": jQuery("#txtpadupsharecapical").val(),
            "CashCreditLimit": jQuery("#txtcashcreditlimit").val(),
            "PaidUpSharedCapital_FinYear": jQuery("#ddlpadupsharecapitalfinyear option:selected").text(),
            "CashCreditLimit_FinYear": jQuery("#ddlcashcreditlimitfinyear option:selected").text(),
        };
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdFinincialYearDetails",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            data: JSON.stringify(FinincialYearDetails),
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    jQuery("#hdnvendorid").val(data[0].VendorID);
                }
            }
        });
    }

    function Clearform() {
        jQuery("#hdnvendorid").val('0');
    }
    $('#btnAttchment').click(function () {
        fileUploader();
    });
    function fileUploader() {
        InsUpdVendorRegAttechment();
        var VendorID = jQuery("#hdnvendorid").val();
        var fileInput = $('#fileupload');
        var fileData = fileInput.prop("files")[0];
        var formData = new window.FormData();
        formData.append("file", fileData);
        formData.append("BidID", "0");
        formData.append("VendorID", VendorID);
        $.ajax({
            url: '/FileUploader.ashx',
            data: formData,
            processData: false,
            contentType: false,
            asyc: false,
            type: 'POST',
            success: function (data) {
            }
        });
    }

    function InsUpdVendorRegAttechment()
    {
        var VendorID=jQuery("#hdnvendorid").val();
        var fileName = $("#fileupload").val();
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/InsUpdVendorRegAttechment?VendorID=" + VendorID + "&FileName=" + fileName.split('\\').pop(),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
            }
        });
    }

    function fetchBillingAndCreditCardDetails()
    {
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/fetchBillingAndCreditCardDetails/?VendorID=" + jQuery("#hdnvendorid").val(),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                jQuery('#tblcompanycreditlimit > tbody').empty();
                jQuery('#tblcompanycreditlimitdetaisl > tbody').empty();
                if (data.length > 0) {
                    for (var i = 0; i <= data.length; i++) {
                        var str = "<tr><td>" + data[i].FinincialYear + "</td>";
                        str += "<td>" + data[i].SalesTurnOver + "</td>";
                        str += "<td>" + data[i].SalesTurnOver_Currency + "</td>";
                        str += "<td>" + data[i].NetWorthCreditLimit + "</td>";
                        str += "<td>" + data[i].NetWorthCreditLimit_Currency + "</td></tr>";
                        jQuery('#tblcompanycreditlimit > tbody').append(str);
                        jQuery('#tblcompanycreditlimitdetaisl > tbody').append(str);
                    }
                }
            }
        });
    }

    function FetchFinincialYears() {
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/FetchFinincialYears/?VendorID=" + jQuery("#hdnvendorid").val(),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                jQuery('#tblFinincialYear > tbody').empty();
                jQuery('#tblFinincialYearbankgarenty > tbody').empty(str);
                if (data.length > 0) {
                    for (var i = 0; i <= data.length; i++) {
                        var str = "<tr><td>" + data[i].FinincialYear + "</td>";
                        str += "<td>" + data[i].Amount + "</td>";
                        str += "<td>" + data[i].Currency + "</td></tr>";
                        jQuery('#tblFinincialYear > tbody').append(str);
                        jQuery('#tblFinincialYearbankgarenty > tbody').append(str);

                    }
                }
            }
        });
    }

    function FetchVendorRegistrationDetails()
    {
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/FetchVendorRegistrationDetails/?VendorID=" + jQuery("#hdnvendorid").val(),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "GET",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.length > 0) {
                    var Catids = data[0].CatetoryIDs.split(',');
                    $.each(Catids, function (i) {
                        $('input:checkbox[id^=inlineCheckbox]').each(function () {
                            if ($(this).val() == Catids[i]) {
                                $(this).closest('span').attr('class', 'checked');   //.attr('checked', true);
                            }
                        });
                        $('input:checkbox[id^=detailsCheckbox]').each(function () {
                            if ($(this).val() == Catids[i]) {
                                $(this).closest('span').attr('class', 'checked');   //.attr('checked', true);
                            }
                        }); 
                    });
                    $('#txtname').val(StringDecodingMechanism(data[0].VendorName))
                    $('#lblcontackpersonalName').text(data[0].VendorName)
                    $('#txtmobileno').val(data[0].VendorMobileNo)
                    $('#lblcontactpsersonalMobileNo').text(data[0].VendorMobileNo)
                    $('#txtofficeaddress').val(StringDecodingMechanism(data[0].OfficeAddress))
                    $('#lblcontactpersonofficeAddress').text(data[0].OfficeAddress)
                    $('#txtofficezipcode').val(data[0].OfficeZipCode)
                    $('#lblcontactpersonzipcode').text(data[0].OfficeZipCode)
                    $('#txtofficephoneno').val(data[0].OfficePhoneNo)
                    $('#contactpersonlofficephoneno').text(data[0].OfficePhoneNo)
                    $('#txtofficefax').val(data[0].OfficeFaxNo)
                    $('#lblcontactpersonlofficefax').text(data[0].OfficeFaxNo)
                    $('#txtworksaddress').val(StringDecodingMechanism(data[0].WorkAddress))
                    $('#lblcontactpersonworkaddress').text(data[0].WorkAddress)
                    $('#txtworkzipcode').val(data[0].WorkZipCode)
                    $('#lblcontactpersonworkzipcode').text(data[0].WorkZipCode)
                    $('#txtworkphoneno').val(data[0].WorkPhoneNo)
                    $('#lblcontactpersonworkpnoneno').text(data[0].WorkPhoneNo)
                    $('#txtworkfaxno').val(data[0].WorkFaxNo)
                    $('#lblcontactpersonworkfax').text(data[0].WorkFaxNo)

                    $('#txtCentralRegistrationNo').val(data[0].CentralExciseRegistrationNo)
                    $('#lblcentralexregno').text(data[0].CentralExciseRegistrationNo)
                    $('#txtcentralsalestaxno').val(data[0].CentralSalesTaxNo)
                    $('#lblcentralsalestaxno').text(data[0].CentralSalesTaxNo)
                    $('#txtStatesalsetaxNo').val(data[0].SalesTaxRegistrationNo_State)
                    $('#lblSTRnostate').text(data[0].SalesTaxRegistrationNo_State)
                    $('#txtcentralsalsetaxno').val(data[0].SalesTaxRegistrationNo_Central)
                    $('#lblSTRnocentral').text(data[0].SalesTaxRegistrationNo_Central)
                    $('#txtServiceTaxno').val(data[0].ServiceTaxRegistrationNo)
                    $('#lblSTRNo').text(data[0].ServiceTaxRegistrationNo)
                    $('#txtvattinno').val(data[0].VatTinNo)
                    $('#lblvtnno').text(data[0].VatTinNo)
                    $('#txtesicno').val(data[0].ESICRegistrationNo)
                    $('#lblesicno').text(data[0].ESICRegistrationNo)
                    $('#txtpfno').val(data[0].PFRegistrationNo)
                    $('#lblPfregno').text(data[0].PFRegistrationNo)
                    $('#txtlabourlicenceno').val(data[0].LabourLicenceNo)
                    $('#lbllabourlinceno').text(data[0].LabourLicenceNo)
                    $('#txtexprotercodeno').val(data[0].ExporterImporterCodeNo)
                    $('#lblexpimpcodeno').text(data[0].ExporterImporterCodeNo)

                    $('#txtcategory').val(data[0].Category)
                    $('#txtcategoryname').val(StringDecodingMechanism(data[0].CategoryName))
                    $('#txtcategoryaddress').val(StringDecodingMechanism(data[0].CategoryAddress))
                    $('#txtcountry').val(data[0].CategoryCountry)
                    $('#txtphone').val(data[0].CategoryPhone)
                    $('#txtemail').val(data[0].CategoryEMail)
                    $('#txtcontactpersonname').val(StringDecodingMechanism(data[0].CategoryContactPersonName))
                    $('#txtcontactpersonmobileno').val(data[0].CategoryContactPersonMobileNo)

                    $('#lblcategory').text(data[0].Category)
                    $('#lblcategoryName').text(data[0].CategoryName)
                    $('#lblcataddress').text(data[0].CategoryAddress)
                    $('#lblcatCountry').text(data[0].CategoryCountry)
                    $('#lblcatphone').text(data[0].CategoryPhone)
                    $('#lblcalemail').text(data[0].CategoryEMail)
                    $('#lblcatcontactpersonname').text(data[0].CategoryContactPersonName)
                    $('#lblcalcontactMobileno').text(data[0].CategoryContactPersonMobileNo)

                    $('#txtclientname').val(StringDecodingMechanism(data[0].ClientName))
                    $('#txtclientPhone').val(data[0].ClientPhone)
                    $('#txtclientaddress').val(data[0].ClientAddress)
                    $('#txtclientscopeofwork').val(data[0].ScopeOfWork)
                    $('#txtclientemail').val(data[0].ClientEmail)

                    $('#lblclentname').text(data[0].ClientName)
                    $('#lblclientphone').text(data[0].ClientPhone)
                    $('#lblclientaddress').text(data[0].ClientAddress)
                    $('#lblclientscopofwork').text(data[0].ScopeOfWork)
                    $('#lbclientemail').text(data[0].ClientEmail)

                    $('#txtbank').val(StringDecodingMechanism(data[0].Bank))
                    $('#txtbranch').val(data[0].Branch)
                    $('#txtneftno').val(data[0].NEFTNo)
                    $('#txtrtgsno').val(data[0].RTGSNo)
                    $('#txtifsccode').val(data[0].IFSCCode)
                    $('#txtswiftcode').val(data[0].SWIFTCode)
                    $('#txtmicrno').val(data[0].MICRNo)

                    $('#lblbank').text(data[0].Bank)
                    $('#lblbranch').text(data[0].Branch)
                    $('#lblneftno').text(data[0].NEFTNo)
                    $('#lblrtgsno').text(data[0].RTGSNo)
                    $('#lblifsccode').text(data[0].IFSCCode)
                    $('#lblswiftno').text(data[0].SWIFTCode)
                    $('#lblmicrno').text(data[0].MICRNo)


                    $('#txtpadupsharecapical').val(data[0].PaidUpSharedCapital)
                    //$('#ddlpadupsharecapitalfinyear').val(data[0].PaidUpSharedCapital_FinYear)
                    $('#txtcashcreditlimit').val(data[0].CashCreditLimit)
                    //$('#ddlcashcreditlimitfinyear').val(data[0].CashCreditLimit_FinYear)

                    $('#lblpaidupsharecapical').text(data[0].PaidUpSharedCapital)
                    $('#lblpaidupfinyear').text(data[0].PaidUpSharedCapital_FinYear)
                    $('#lblcashcreditlimit').text(data[0].CashCreditLimit)
                    $('#lblcashcreditlimitfinyear').text(data[0].CashCreditLimit_FinYear)

                    $('#lblattachment').text(data[0].Attachment)
                    $('a#afilelink').attr('href','http://localhost:63527/VendorRegDoc/1/History.txt').val(data[0].Attachment);
                }
            }
        });
    }

    function VendorReginstrationSubmition()
    {
        jQuery.ajax({
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "VendorRegistration/VendorReginstrationSubmition/?VendorID=" + jQuery("#hdnvendorid").val(),
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            type: "POST",
            cache: false,
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                bootbox.alert("Vendor Registration Submitted successfully.", function () {
                    window.location = "index.html";
                    return false;
                });
            }
        });

    }



    var FormWizard = function () {
        return {
            init: function () {
                if (!jQuery().bootstrapWizard) {
                    return;
                }
                function format(state) {
                    if (!state.id) return state.text; // optgroup
                    return "<img class='flag' src='assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
                }
                var form = $('#submit_form');
                var error = $('.alert-danger', form);
                var success = $('.alert-success', form);

                form.validate({
                    doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block help-block-error', // default input error message class
                    focusInvalid: false, // do not focus the last invalid input
                    rules: {
                        //txtname: {
                        //    required: true
                        //},
                        //txtmobileno: {
                        //    required: true,
                        //    number: true,
                        //    maxlength: 10,
                        //    minlength:10
                        //},
                        //txtofficeaddress: {
                        //    required: true
                        //},
                        //txtofficezipcode: {
                        //    required: true,
                        //    maxlength: 10
                        //},
                        //txtofficephoneno: {
                        //    required: true,
                        //    number: true,
                        //    maxlength: 50,
                        //},
                        //txtofficefax: {
                        //    required: true,
                        //    number: true,
                        //    maxlength: 50,
                        //},
                        //txtworksaddress: {
                        //    required: true,
                        //    maxlength: 50,
                        //},
                        //txtworkzipcode: {
                        //    required: true,
                        //    maxlength: 10
                        //},
                        //txtworkphoneno: {
                        //    required: true,
                        //    number: true,
                        //    maxlength: 50,
                        //},
                        //txtworkfaxno: {
                        //    required: true,
                        //    number: true,
                        //    maxlength: 50,
                        //},
                        //txtCentralRegistrationNo: {
                        //    required: true,
                        //    maxlength: 50,
                        //},
                        //txtcentralsalestaxno: {
                        //    required: true,
                        //    maxlength: 50,
                        //},
                        //txtStatesalsetaxNo: {
                        //    required: true,
                        //    maxlength: 50,
                        //},
                        //txtcentralsalsetaxno: {
                        //    required: true
                        //},
                        //txtServiceTaxno: {
                        //    required: true
                        //},
                        //txtvattinno: {
                        //    required: true
                        //},
                        //txtesicno: {
                        //    required: true
                        //},
                        //txtpfno: {
                        //    required: true
                        //},
                        //txtlabourlicenceno: {
                        //    required: true
                        //},
                        //txtexprotercodeno: {
                        //    required: true
                        //},
                        //ddlCategory: {
                        //    required: true
                        //},
                        //txtcategoryname: {
                        //    required:  true
                        //},
                        //txtcategoryaddress: {
                        //    required: true
                        //},
                        //txtcountry: {
                        //    required: true
                        //},
                        //txtphone: {
                        //    required: true,
                        //    number: true,
                        //    maxlength: 10,
                        //    minlength: 10
                        //},
                        //txtemail: {
                        //    required: true
                        //},
                        //txtcontactpersonname: {
                        //    required: true,
                        //},
                        //txtcontactpersonmobileno: {
                        //    required: true
                        //},
                        //txtclientname: {
                        //    required: true
                        //},
                        //txtclientPhone: {
                        //    required: true
                        //},
                        //txtclientaddress: {
                        //    required: true
                        //},
                        //txtclientscopeofwork: {
                        //    required: true
                        //},
                        //txtclientemail: {
                        //    required: true
                        //},
                        //ddlcompfinyear: {
                        //    required: true
                        //},
                        //txtsalesturnover: {
                        //    required: true
                        //},
                        //ddlcompcurrency: {
                        //    required: true
                        //},
                        //txtnetWorthcredit: {
                        //    required: true
                        //},
                        //ddlnetworthcurrency: {
                        //    required: true
                        //},
                        //txtbank: {
                        //    required:  true
                        //},
                        //txtbranch: {
                        //    required: true
                        //},
                        //txtneftno: {
                        //    required: true
                        //},
                        //txtrtgsno: {
                        //    required: true
                        //},
                        //txtifsccode: {
                        //    required: true
                        //},
                        //txtmicrno: {
                        //    required: true
                        //}

                    },
                    messages: {
                        //txtname: {
                        //    required: "field is Required"
                        //},
                        //txtname: {
                        //    required: "field is Required"
                        //}
                    },
                    errorPlacement: function (error, element) {
                        if (element.attr("name") == "gender") {
                            error.insertAfter("#form_gender_error");
                        } else if (element.attr("name") == "payment[]") {
                            error.insertAfter("#form_payment_error");
                        } else {
                            error.insertAfter(element);
                        }

                        if ($("#txtbidDate").closest('.inputgroup').attr('class') == 'inputgroup has-error') {
                            $("#btncal").css("margin-top", "-22px");
                        }
                    },
                    invalidHandler: function (event, validator) {
                        success.hide();
                        error.show();
                        Metronic.scrollTo(error, -200);
                    },
                    highlight: function (element) {
                        $(element)
                        .closest('.inputgroup').removeClass('has-success').addClass('has-error');
                    },
                    unhighlight: function (element) {
                        $(element)
                        .closest('.inputgroup').removeClass('has-error');
                    },
                    success: function (label) {
                        if (label.attr("for") == "gender" || label.attr("for") == "payment[]") {
                            label
                            .closest('.inputgroup').removeClass('has-error').addClass('has-success');
                            label.remove();
                        } else {
                            label
                            .addClass('valid') // mark the current input as valid and display OK icon
                        .closest('.inputgroup').removeClass('has-error').addClass('has-success'); // set success class to the control group
                        }
                        if ($("#txtbidDate").closest('.inputgroup').attr('class') == 'inputgroup has-error') {
                            $("#txtbidDate").closest('.inputgroup').find("#btncal").css("margin-top", "-22px");
                        }
                    },

                    submitHandler: function (form) {
                        success.show();
                        error.hide();
                    }

                });

                var displayConfirm = function () {
                    $('#tab4 .form-control-static', form).each(function () {
                        var input = $('[name="' + $(this).attr("data-display") + '"]', form);
                        if (input.is(":radio")) {
                            input = $('[name="' + $(this).attr("data-display") + '"]:checked', form);
                        }
                        if (input.is(":text") || input.is("textarea")) {
                            $(this).html(input.val());
                        } else if (input.is("select")) {
                            $(this).html(input.find('option:selected').text());
                        } else if (input.is(":radio") && input.is(":checked")) {
                            $(this).html(input.attr("data-title"));
                        } else if ($(this).attr("data-display") == 'payment') {
                            var payment = [];
                            $('[name="payment[]"]:checked').each(function () {
                                payment.push($(this).attr('data-title'));
                            });
                            $(this).html(payment.join("<br>"));
                        }
                    });
                }

                var handleTitle = function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                        displayConfirm();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }
                    Metronic.scrollTo($('.page-title'));
                }

                // default form wizard
                $('#form_wizard_1').bootstrapWizard({
                    'nextSelector': '.button-next',
                    'previousSelector': '.button-previous',
                    onTabClick: function (tab, navigation, index, clickedIndex) {
                        return true;
                    },
                    onNext: function (tab, navigation, index) {
                        success.hide();
                        error.hide();
                        if (form.valid() == false) {
                            if ($('#tblcategorydetails > tbody > tr').length > 0 && parseInt(index) == 3) {
                                FetchClientDetails();
                                return true;
                            }
                            else if ($('#tblclientaldetails > tbody > tr').length > 0 && parseInt(index) == 4) {
                                fetchBillingAndCreditCardDetails();
                                return true;
                            }
                            else if ($('#tblcompanycreditlimit > tbody > tr').length > 0 && parseInt(index) == 5) {
                                FetchBankerDetails();
                                return true;
                            }
                            else if ($('#tbldetailsbanker > tbody > tr').length > 0 && parseInt(index) == 6) {
                                FetchFinincialYears();
                                return true;
                            }
                            else
                            {
                                return false;
                            }
                        }
                        if (parseInt(index) == 1) {
                            CategorizationAndContactDetails();
                        }
                        else if (parseInt(index) == 2) {
                            InsUpdRegistrationDetails();
                            FetchCategoryDetails();
                        } 
                        else if (parseInt(index) == 7) {
                            InsUpdFinincialYearDetails();
                        }
                        else if (parseInt(index) == 8) {
                            fileUploader();
                            FetchVendorRegistrationDetails();
                            fetchBillingAndCreditCardDetails();
                            FetchFinincialYears();
                            FetchClientDetails();
                            FetchCategoryDetails();
                        }
                        else {
                            FetchVendorRegistrationDetails();
                        }
                        handleTitle(tab, navigation, index);
                    },
                    onPrevious: function (tab, navigation, index) {
                        success.hide();
                        error.hide();
                        handleTitle(tab, navigation, index);
                    },
                    onTabShow: function (tab, navigation, index) {
                        var total = navigation.find('li').length;
                        var current = index + 1;
                        var $percent = (current / total) * 100;
                        $('#form_wizard_1').find('.progress-bar').css({
                            width: $percent + '%'
                        });
                    }
                });
                $('#form_wizard_1').find('.button-previous').hide();
                $('#form_wizard_1 .button-submit').click(function () {
               
                    VendorReginstrationSubmition();

                }).hide();
            }
        };
    }();