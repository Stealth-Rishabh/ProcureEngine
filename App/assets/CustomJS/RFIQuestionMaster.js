jQuery(document).ready(function () {

    Pageloaded()

    setInterval(function () { Pageloaded() }, 15000);
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
    fetchMenuItemsFromSession(19, 22);
    setCommonData();
    FormValidate();
    fetchQuestionCategory();
    //  fetchCategorymaster();
    //fetchRFIDetails();
    //  $("#ddlCategoryMultiple").select2();
    addvendor();
});

var allurlsec = sessionStorage.getItem("allurlsec");
var error = $('#errordiv');
var success = $('#successdiv');
var subcaterror = $('#errordiv1');
var subcatsuccess = $('#successdiv1');
var pageState = 'add';


function FormValidate() {
 
    $('#RFIQuestionmaster').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {
            ddlquestCategory: {
                required: true
            },
            
            txtQuestiondescription: {
                required: true
            }
          
        },
        messages: {

            ddlquestCategory: {
                required: "Question is required."
            },
            txtQuestiondescription: {
                required: "Question Description is required."
            }
            
        },
        invalidHandler: function (event, validator) { //display error alert on form submit   
            success.hide();
            $('#error').html('You have some errors. Please check below.!');
            error.show();
            error.fadeOut(5000);              
            
        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.col-lg-8').addClass('has-error'); // set error class to the control group
            $(element).closest('.col-lg-7').addClass('has-error'); // set error class to the control group
            
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-lg-8').removeClass('has-error'); // set error class to the control group
            $(element)
                .closest('.col-lg-7').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.col-lg-8').removeClass('has-error');
            label.closest('.col-lg-7').removeClass('has-error');
            label.remove();
        },

        submitHandler: function (form) { 
           
            insupdRFIQuestionMaster();
        }
    });

// Form Validation For Sub Category Modal

    $('#subcategoryForm').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input

        rules: {            
            txtqSubcategory: {
                required: true,
                maxlength: 64
            }

        },
        messages: {

            txtqSubcategory: {
                required: "Sub Category is required.",              
               
            }


        },
        invalidHandler: function (event, validator) { //display error alert on form submit             
             subcatsuccess.hide();
             jQuery("#errormsg").text("You have some form errors. Please check below.");
             subcaterror.show();
             subcaterror.fadeOut(6000)
            
       },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.col-md-8').addClass('has-error'); // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.col-md-8').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.col-md-8').removeClass('has-error');
            label.remove();
        },

        submitHandler: function (form) {
           
            InsUpdQuestionSubcategory();        
        }
    });

    

}

function fetchQuestionCategory(applicableFor) {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/FetchQuestionCategory/?applicableFor=" + applicableFor,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {

          
           
            $('#ddlquestCategory').empty();
            $('#ddlquestCategory').append(jQuery('<option></option>').val('').html('Select'));
            for (var i = 0; i < data.length; i++) {
                $('#ddlquestCategory').append(jQuery('<option></option>').val(data[i].questionCategoryID).html(data[i].questionCategory));
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
    jQuery.unblockUI();
}
var questcategoryID=0;
function getCategoryIDforSubCategory() {
    $("#tblFetchRFIQuestionMastr").empty();
    if ($('#ddlquestCategory').val() != '') {
        questcategoryID = $('#ddlquestCategory option:selected').val();
       
        $('#catIDforsubcategory').val($('#ddlquestCategory option:selected').text());
        fetchQuestionSubCategory(questcategoryID)
        
    } else {
        questcategoryID = 0
        $('#catIDforsubcategory').val('');
        fetchQuestionSubCategory(questcategoryID)
        
    }
   
}


function getQuestionForSubCategory() {
   
    
    if ($('#ddlQuestionFor option:selected').val() == 'VAA') {
        $("#POItablediv").show();
        fetchCategorymaster();
        $("#ddlquestCategory").select2();
    } 
    else {
        fetchQuestionCategory($("#ddlQuestionFor option:selected").val());
        $('#POItablediv').hide();
        $("#ddlquestCategory").select2('destroy');
    }

}

function fetchQuestionMasters(questcategoryID) {

   
    var mandat = '';
    var isattach  ='';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/FetchQuestionMaster/?QuestionCatID=" + questcategoryID + "&QuestionSubCategoryID=" + sessionStorage.getItem('hdnSubCategoryID') + "&QuestionApplicableFor=" + $('#ddlQuestionFor option:selected').val(),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {  
           
            
            $('#tblFetchRFIQuestionMastr').empty();
            if (data.length > 0) {
                $('#searchmaster').show();
                $('#tblFetchRFIQuestionMastr').append('<thead><tr><th>Actions</th><th>Category</th><th>Sub Category</th><th>Description</th><th>Validation</th><th>Attachment</th></tr></thead>')
              
                for (var i = 0; i < data.length; i++) {
                    if (data[i].mandatory == 'Y') {
                        mandat = 'Mandatory'
                    } else {
                        mandat = 'Non-Mandatory'
                    }

                    if (data[i].attachement == 'Y') {
                        isattach = "Required"
                    } else {
                        isattach = "Not required"
                    }

                    $('#tblFetchRFIQuestionMastr').append('<tr id=rowid' + i + '><td><a href=# class="btn btn-xs blue" onclick="updatequestMaster(\'rowid' + i + '\')"><i class="fa fa-pencil"></i> Edit</a></td><td class="hide">' + data[i].questionID + '</td><td>' + $('#ddlquestCategory option:selected').text() + '</td><td>' + data[i].questionSubCategory + '</td><td>' + data[i].questionDescription + '</td>     <td>' + mandat + '</td><td>' + isattach + '</td><td class="hide">' + data[i].questionSubCategoryID + '</td>     </tr>')
                  
                }
            }
            else {
                $('#searchmaster').hide();
                return true
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
    jQuery.unblockUI();
}

function fetchQuestionSubCategory(questcategoryID) {
    var stats = '';
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/FetchQuestionSubCategory/?QuestionCategoryID=" + questcategoryID + "&Status=N&customerId=" + sessionStorage.getItem('CustomerID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        dataType: "json",
        success: function (data) {
                
            sessionStorage.setItem('hdnquestionSubCatgry', JSON.stringify(data));
            $('#tblsubcategory').empty();
            if (data.length > 0) {
                $('#searchsubcat').show();
                $('#tblsubcategory').append('<thead><tr><th>Action</th><th>Question Category</th><th>Question Sub Category</th><th>Status</th></tr></thead>')
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isActive == 'Y') {
                        stats = 'Active'
                    } else {
                        stats = 'Inactive'
                    }
                    $('#tblsubcategory').append('<tr><td><a href=# class="btn btn-xs blue" onclick="editSubcategory(\'' + data[i].questionSubCategoryID + '\',\'' + data[i].questionSubCategory + '\',\'' + data[i].isActive + '\')"><i class="fa fa-pencil"></i> Edit</a></td><td>' + $('#ddlquestCategory option:selected').text() + '</td><td>' + data[i].questionSubCategory + '</td><td>' + stats + '</td></tr>')

                }
            } else {
                $('#searchsubcat').hide();
                return true;
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
    jQuery.unblockUI();
}

sessionStorage.setItem('hdnSubCategoryID', '0');
sessionStorage.setItem('hdnquestionSubCatgry', '')
jQuery("#txtsubCategory").keyup(function () {
    sessionStorage.setItem('hdnSubCategoryID', '0');
    
});

jQuery("#txtsubCategory").blur(function () {
    if (sessionStorage.getItem('hdnSubCategoryID') == '0') {
        $('#txtsubCategory').val('');
        $('#RFIQuestionmaster').validate().element($(this));
    } else {
        return true
    }

});


jQuery("#txtsubCategory").typeahead({
    source: function (query, process) {
        var data = sessionStorage.getItem('hdnquestionSubCatgry');
        usernames = [];
        map = {};
        var username = "";
        jQuery.each(jQuery.parseJSON(data), function (i, username) {
            map[username.questionSubCategory] = username;
            usernames.push(username.questionSubCategory);
        });
        process(usernames);
      
    },
    minLength: 2,
    updater: function (item) {
          if (map[item].questionSubCategoryID != "0") {
            sessionStorage.setItem('hdnSubCategoryID', map[item].questionSubCategoryID);
            if (pageState != 'edit') { 
                $("#tblFetchRFIQuestionMastr").empty();
                fetchQuestionMasters($('#ddlquestCategory option:selected').val())
            }
            
         }
        else {
            gritternotification('Please select Sub Category properly!!!');
        }

        return item;
    }

});

function InsUpdQuestionSubcategory() {
    var _cleanString = StringEncodingMechanism($('#txtqSubcategory').val());
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var status = "";
    if (jQuery("#checkboxactive").is(':checked')) {
        status = "Y";
    }
    else {
        status = "N";
    }

    var data = {
        "QuestionCategoryID": parseInt($('#ddlquestCategory option:selected').val()),
        "QuestionSubCategoryID": parseInt($('#hdnSubcatID').val()),
        //"QuestionSubCategory": $('#txtqSubcategory').val(),
        "QuestionSubCategory": _cleanString,
        "isActive": status,
        "customerId": parseInt(sessionStorage.getItem("CustomerID")),
       

    }
    //alert(JSON.stringify(data))
    jQuery.ajax({
      
        url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/InsUpdQuestionSubCategory",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: JSON.stringify(data),
        type: "POST",
        cache: false,
        crossDomain: true,
        processData: true,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {  
         
            if (data == "1") {
               
                subcaterror.hide();
                $("#successmsg").html("Transaction Successful.");
                subcatsuccess.show();
                subcatsuccess.fadeOut(5000);               
                fetchQuestionSubCategory(questcategoryID)

            }
            else if (data == '2') {
                subcaterror.hide();
                $("#successmsg").html("Updation Successful.");
                subcatsuccess.show();
                subcatsuccess.fadeOut(5000);                
                fetchQuestionSubCategory(questcategoryID)

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

    jQuery.unblockUI();
    resetSubcategory();



}

$("#SubCategory").on("shown.bs.modal", function () {
    $('#txtsubCategory').val('');
});

function editSubcategory(SubcatID, SubCatdesc, status) {
    $('#btn-subcat').html('Edit');
    $('#hdnSubcatID').val(SubcatID);
    $('#txtqSubcategory').val(SubCatdesc);
    if (status == 'Y') {
        $('#checkboxactive').attr('checked', true)
    } else {
        $('#checkboxactive').attr('checked', false)
    }
    

}

function resetSubcategory() {
    $('#btn-subcat').html('Add');
    $('#hdnSubcatID').val('0');
    $('#txtqSubcategory').val('');
    $('#checkboxactive').attr('checked', true)
}

var mandatory = 'N';
function mandatoryChange() {
    if ($('#ddlmandatory').val() == '') {
        mandatory = 'N';
    } else {
        mandatory = $('#ddlmandatory option:selected').val();
    }
   
}







function insupdRFIQuestionMaster() {
  
   var CriteriaDetails = [];
   /*
    $('#tblvendorlist >tbody> tr').each(function () {
        var Criteria = $('#txtCriteria', this).val();
        var Score = parseFloat($('#txtScore', this).val());
        var item = { Criteria, Score }; 
        CriteriaDetails.push(item);
    });*/
       jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
        var status = "";
        if (jQuery("#chkattachment").is(':checked')) {
            status = "Y";
        }
        else {
            status = "N";
    }

    var txtQuestiondescription = StringEncodingMechanism($('#txtQuestiondescription').val().replace(/'/g, " "))
    
    var data = {
            "QuestionCategoryID": parseInt($('#ddlquestCategory option:selected').val()),
            "QuestionSubCategoryID": parseInt(sessionStorage.getItem("hdnSubCategoryID")),
            "QuestionDescription": txtQuestiondescription,
            "Mandatory": mandatory,
            "Attachement": status,
            "criteriaLst": CriteriaDetails,
            "QuestionID": parseInt($('#hdnQuestmastrID').val()),
            "CustomerID": parseInt(sessionStorage.getItem("CustomerID")),
            "QuestionApplicableFor": $("#ddlQuestionFor option:selected").val()
       
    }
    
         jQuery.ajax({
            url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/InsUpdQuestionMaster",
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            data: JSON.stringify(data),
            type: "POST",
            cache: false,
            crossDomain: true,
            processData: true,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
         
                if (data== "1") {
                    error.hide();
                    $("#success").html("Transaction Successful.");
                    success.show();
                    fetchQuestionMasters(questcategoryID)
                    success.fadeOut(5000);


                } 
               
                else if (data== '2') {
                    error.hide();
                    $("#success").html("Updation Successful.");
                    success.show();
                    fetchQuestionMasters(questcategoryID)
                    success.fadeOut(5000);

                }
            },
            error: function (xhr, status, error) {

                var err = xhr.responseText//eval("(" + xhr.responseText + ")");
                if (xhr.status === 401) {
                    error401Messagebox(err.Message);
                }
                else{
                    $('#error').html('You have some errors')
                    error.show();
                    error.fadeOut(5000)
                }
                return false;
                jQuery.unblockUI();
            }
        
        });

    resetRFIQuestionmaster();
    clearTable();
    setTimeout(6000);
    window.location.reload();
    jQuery.unblockUI();
   
    
}


function resetRFIQuestionmaster() { 

    pageState="add";
    $('#submitbtnmaster').text('Submit');
    sessionStorage.setItem('hdnSubCategoryID', '0');
    $('#hdnQuestmastrID').val("0");
    $("#ddlquestCategory").val('');
    $("#ddlQuestionFor").val('');
    $('#ddlmandatory').val('');
    $('#txtsubCategory').val('')
    $('#txtQuestiondescription').val('')
    
    jQuery('input:checkbox[name=chkattachment]').attr('checked', false);
    jQuery('#chkattachment').parents('span').removeClass('checked');
    $('#ddlquestCategory').attr('disabled', false)

}

function updatequestMaster(RowID) {
    var rowID = $('#' + RowID);
    $(document).ready(function () {
      
        
        var QuestionID = parseInt(rowID.find('td:eq(1)').text());
        jQuery.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.getItem("APIPath") + "RFIQuestionMaster/FetchQuetionCriteria/?QuestionID=" + QuestionID,
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
            cache: false,
            dataType: "json",
            success: function (data) {

               
               /* var result = [];

                for (var i in data) {
                    result.push([i, data[i]]);
                }
                for (var i = 0; i < result.length; i++) {
                    console.log(result[i]);
                }
               */
                //var data1 = JSON.parse(data);
              
             //   console.log(data[0].criteria)
               /* console.log(data.score)
              
                $(document).ready(function () {
                    var data1 = JSON.parse(data);
                    data1.forEach(function (dt) {
                        $('#tdata').append('<tr id=row>' + i + '><td>' + dt.criteria + '</td><td>' + dt.score + '</td> </tr>')
                    })

                });*/
            }
        });
    });
    pageState = 'edit';
    $('#ddlquestCategory').attr('disabled', 'disabled')
    $('#submitbtnmaster').text('Modify');
    $('#hdnQuestmastrID').val(rowID.find('td:eq(1)').text());
    $('#txtsubCategory').val(rowID.find('td:eq(3)').text());

    sessionStorage.setItem('hdnSubCategoryID', rowID.find('td:eq(7)').text())    
    if (rowID.find('td:eq(5)').text() == "Mandatory") {
        $('#ddlmandatory').val('Y')
          }
       else {
        $('#ddlmandatory').val('N')
    }
    $('#txtQuestiondescription').val(rowID.find('td:eq(4)').text());
    
    if (rowID.find('td:eq(6)').text() == "Required") {
        jQuery('input:checkbox[name=chkattachment]').attr('checked', true);
        jQuery('#chkattachment').parents('span').addClass('checked');

          }
       else {
        jQuery('input:checkbox[name=chkattachment]').attr('checked', false);
        jQuery('#chkattachment').parents('span').removeClass('checked');
    }
}

jQuery("#search").keyup(function () {
 
    jQuery("#tblFetchRFIQuestionMastr tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#search').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblFetchRFIQuestionMastr tr:has(td)").show();
        return false;
    }

    jQuery("#tblFetchRFIQuestionMastr tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
    
});
jQuery("#searchPop-up").keyup(function () {

    jQuery("#tblsubcategory tr:has(td)").hide(); // Hide all the rows.

    var iCounter = 0;
    var sSearchTerm = jQuery('#searchPop-up').val(); //Get the search box value

    if (sSearchTerm.length == 0) //if nothing is entered then show all the rows.
    {
        jQuery("#tblsubcategory tr:has(td)").show();
        return false;
    }

    jQuery("#tblsubcategory tr:has(td)").children().each(function () {

        var cellText = jQuery(this).text().toLowerCase();
        if (cellText.indexOf(sSearchTerm.toLowerCase()) >= 0) //Check if data matches
        {

            jQuery(this).parent().show();
            iCounter++;

            return true;
        }

    });
    
});

function fetchRFIDetails() {
    
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    var replaced = '', _selectedCat = new Array();
   // alert(sessionStorage.getItem("APIPath") + "VQMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VQID=" + sessionStorage.getItem('CurrentVQID') )
    jQuery.ajax({
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "VQMaster/fetchRFIPendingDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&VQID=" + sessionStorage.getItem('CurrentVQID'),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (BidData) {
            
          
            
            if (BidData.length > 0) {

                

                if (BidData[0].vqProductCat.length > 0) {
                    for (var i = 0; i < BidData[0].vqProductCat.length; i++) {
                        _selectedCat.push(BidData[0].vqProductCat[i].categoryID);
                    }
                    $("#ddlCategoryMultiple").select2('val', _selectedCat).trigger("change");


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
    });
    jQuery.unblockUI();


}

function fetchCategorymaster() {
    jQuery.blockUI({ message: '<h5><img src="assets/admin/layout/img/loading.gif" />  Please Wait...</h5>' });
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "ProductandServiceCategory/fetchProductCategory/?CustomerID=" + sessionStorage.getItem('CustomerID') + "&For=M&MappedBy=" + encodeURIComponent(sessionStorage.getItem('UserID')) + "&ChildId=0",
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        success: function (data) {

            jQuery("#ddlquestCategory").empty();
            var vlal = new Array();
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    jQuery("#ddlquestCategory").append("<option value=" + data[i].categoryID + ">" + data[i].categoryName + "</option>");
                }
                jQuery("#ddlquestCategory").trigger("change");
                if (sessionStorage.getItem('CurrentVQID') != "0") {
                    setTimeout(function () {
                        fetchRFIDetails();
                    }, 1000)
                }
            }
            else {
                jQuery("#ddlquestCategory").append('<tr><td>No categories found..</td></tr>');
            }
            // jQuery.unblockUI();
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText//eval("(" +  + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert("error");
            }
            return false;
            jQuery.unblockUI();
        }

    });
}


var vendorid = 0;

function addvendor() {

   
    var num = 0;
    var maxinum = -1, i = 0;
    $("#tblvendorlist tr:gt(0)").each(function () {
        var this_row = $(this);
        num = (this_row.closest('tr').attr('id')).substring(3, (this_row.closest('tr').attr('id')).length)
        if (parseInt(num) > parseInt(maxinum)) {
            maxinum = num;
        }
    });

    i = parseInt(maxinum) + 1;

    $('#tblvendorlist').append("<tr id=row" + i + "><td><button class='btn blue' id=addBtn" + i + " type='button' onclick='addvendor()'><i class='fa fa-plus'></i></button><button type='button' id=btnvendordelete" + i + " class='btn btn-danger' onclick='deleteLFrow(" + i + ")' ><i class='glyphicon glyphicon-remove-circle'></i></button></td><td width='20%' id=vendorname" + i + " class=form-group ><input type='text' autocomplete='off'  id='txtCriteria' placeholder='Criteria'  /></td><td id=TDpolyticExp" + i + "></td></tr>")
  
    $('#TDpolyticExp' + i).append(' <input type="text" id="txtScore" ' + i + ' placeholder="Score"  ' + i + '  </input>')
  
 
   
    if (i == 0) {
        $('#btnvendordelete' + i).hide()
    }
    else {
        $('#btnvendordelete' + i).show()
    }
}
function fnclearcss(index) {
    $('#vendorSearch' + index).css("border", "1px solid #e5e5e5");
}

function deleteLFrow(rowid) {

    $('#row' + rowid).remove();

}



function clearTable() {

    var Table = document.getElementById("tblvendorlist");
    Table.innerHTML = "";
}



   
