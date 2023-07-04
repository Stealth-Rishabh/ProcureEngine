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
    Metronic.init();
    Layout.init();
  //  FormWizard.init();
    ComponentsPickers.init();
    
    setCommonData();
    fetchMenuItemsFromSession(9, 10);
    fetchBidType();// for serach vendor
    
    numberonly()
    var param = getUrlVars()["param"]
    var decryptedstring = fndecrypt(param)
    EventID = getUrlVarsURL(decryptedstring)["EventId"]
    CUSTOMERID = getUrlVarsURL(decryptedstring)["CustomerID"]
   // fetchParticipantsVenderinvoice()
   // alertforerror()
    GetPR2Mapping()
    
   
   
   
});



function searchPIForm() {
    
    $("#submit_form_prmapping").removeClass('hide')
}




let vendorfrequency=0;



function GetPR2Mapping() {
    debugger
    let _EventID=parseInt(EventID);
    let _CustomerID=parseInt(CUSTOMERID);
    console.log(sessionStorage.getItem("APIPath") + "SAPIntegration/GetPR2Mapping/?NFAId=" +_EventID+'&CustomerId=' + _CustomerID );
     jQuery.ajax({
        url: sessionStorage.getItem("APIPath") + "SAPIntegration/GetPR2Mapping/?NFAId=" +_EventID+  '&CustomerId=' + _CustomerID,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data, status, jqXHR) {
           debugger
           
           
           
           let vendorExternalSource =data.vendorExternalSource,rfqraid =data.sobHeader.eventId,
           eventtype=data.sobHeader.eventType,sobId=data.sobHeader.sobId,eventtypename='',
           truncatedMaterial='',deliverydate='',DCyear="",DCmonth='', DCday='',DCdt;
           
           $("#hdneventtype").val(eventtype);
           $("#hdnsobid").val(sobId);
           
           if(eventtype=="1"){
               eventtypename="Request for Quotation";
           }
           else{
              eventtypename="Reverse Auction" ;
           }
           
           
           //form intro
           $("#formintro").empty;
           
           strintro=`<div class='row'>
           <div class="col-md-12">
           <div class="form-group">
           <label class="col-md-2 control-label" id="lbltitleevent"><b>Event ID:</b></label> <label id="lbleventidr" style="text-align:left" class="col-md-4 control-label">${rfqraid}</label>
           <label class="col-md-2 control-label" id="lbltitleventtype"><b>Event Type:</b></label> <label id="lbleventtype" style="text-align:left" class="col-md-4 control-label">${eventtypename}</label>
           </div>
           </div>
           <div class="col-md-12">
           <div class="form-group">
           <label class="col-md-2 control-label" id="lbltitlenfa"><b>NFA ID:</b></label> <label id="lblnfa" style="text-align:left" class="col-md-4 control-label">${_EventID}</label></div>
           </div>
           
           </div>`
           
           $("#formintro").append(strintro);
           
          
           
           
           
             //PRMap Category 
             $("#PRMapCategory").empty;
             $("#PRMapCategory").removeClass('hide')
             
             let strcatH="";
             let strcat="";
             
            strcatH +=`<thead><tr><th></th>`;
             
            for(var p=0;p<data.associatedVendors.length;p++){
                       
                strcatH +=`<th id='vendorName${p}' data-vendorid='${data.associatedVendors[p].vendorId}'>${data.associatedVendors[p].vendorName}</th>`;
            }
             strcatH +=`</tr><thead>` 
             
              $("#PRMapCategory").append(strcatH);
              
              //Document Type
               strcat +=`<tbody><tr><td>Document Type</td>`;
             
            for(var q=0;q<data.associatedVendors.length;q++){
                       
                strcat += `<td id='dt${q}'><select class="form-control documenttype" id='doctype${q}'><option value=''>select<option</select></td>`;
            }
             strcat +=`</tr>` 
             
             
              
              
               //Inco Terms
               strcat +=`<tr><td>Inco Terms</td>`;
             
            for(var qa=0;qa<data.associatedVendors.length;qa++){
                       
                strcat += `<td id='it${qa}'><select class="form-control Incoterm" id='incoterm${qa}'><option value=''>select<option</select></td>`;
            }
             strcat +=`</tr>` 
             
                //Payment Terms
               strcat +=`<tr><td>Payment Terms</td>`;
             
            for(var qb=0;qb<data.associatedVendors.length;qb++){
                       
                strcat += `<td id='it${qb}'><select class="form-control PayTerm" id='PaymentTerms${qb}'><option value=''>select<option</select></td>`;
            }
             strcat +=`</tr>` 
             
              
              
            //Currency
            strcat +=`<tr><td>Currency</td>`;
             
            for(var qc=0;qc<data.associatedVendors.length;qc++){
                       
                strcat += `<td id='cu${qc}'><select class="form-control ddlcurrency" id='Currency${qc}'><option value=''>select<option</select></td>`;
            }
             strcat +=`</tr>` 
             
             
            //Invoicing Party
            strcat +=`<tr><td>Invoicing Party </td>`;
             
            for(var qd=0;qd<data.associatedVendors.length;qd++){
                       
                strcat += `<td id='ip${qd}'><select class="form-control" id='InvoicingParty${qd}'><option value=''>select<option</select>
                </select></td>`;
              
            }
             strcat +=`</tr>` 
             
            //Purchase Organization
            strcat +=`<tr><td>Purchase Organization</td>`;
             
            for(var qe=0;qe<data.associatedVendors.length;qe++){
                       
                strcat += `<td id='po${qe}'><select class="form-control PORG" id='purorg${qe}'><option value=''>select<option</select></td>`;
            }
            strcat +=`</tr>` ;
            
            
            //Purchase Grp
            strcat +=`<tr><td>Purchase Grp</td>`;
             
            for(var qf=0;qf<data.associatedVendors.length;qf++){
                strcat += `<td id='pg${qf}'><select class="form-control PGRP" id='purgrp${qf}'><option value=''>select<option</select></td>`;
  
            }
            strcat +=`</tr>` 
            
             //Tax Code  
            strcat +=`<tr><td>Tax Code </td>`;
             
            for(var qg=0;qg<data.associatedVendors.length;qg++){
                       
                strcat += `<td id='tc${qg}'><select class="form-control taxcode" id='taxcode${qg}'><option value=''>select<option</select></td>`;
            }
            strcat +=`</tr>` 
            
            //Price Unit
            strcat +=`<tr><td>Price Unit</td>`;
            
            for(var pu=0;pu<data.associatedVendors.length;pu++){
                       
                strcat += `<td><input class="form-control priceunit" onkeyup="boolchkup(this)"  id='priceunit${pu}' /></td>`;
            }
            strcat +=`</tr>` 
            
            //company code  
            strcat +=`<tr><td>Company code </td>`;
            for(var qh=0;qh<data.associatedVendors.length;qh++){
                       
                strcat += `<td id='cc${qh}'><select class="form-control companycode" id='comcode${qh}'><option value=''>select<option</select></td>`;
            }
            strcat +=`</tr>` 
            
            
            //partner number
            strcat +=`<tr ><td>Partner Number </td>`;
             
            for(var qi=0;qi<data.associatedVendors.length;qi++){
                       
                strcat += `<td id='pn${qi}'><input class="form-control partnum" id='partnernumber${qi}' disabled/></td>`;
            }
             strcat +=`</tr>` 
             
             
            strcat +=`<tr><td>PO Number</td>`;
            let transmsg ='' 
            for(var qj=0;qj<data.associatedVendors.length;qj++){
                debugger
                transmsg =data.associatedVendors[qj].transactionMessage.replace(/(\d+)-/g, "\n$&")
                if(data.associatedVendors[qj].isTransactionSuccessfull=='Y'){
                    strcat += `<td id='po${qj}'>
                <div style="display: flex; justify-content: space-between;">
                <input class="form-control ponum" id='ponumber${qj}' value='${transmsg}' disabled/>
                
                </div>
                </td>`;
                }
                else{
                     strcat += `<td id='po${qj}'>
                <div style="display: flex; justify-content: space-between;">
                <input class="form-control ponum" id='ponumber${qj}' disabled/>
                <span class='hovertextLeft' data-hover='${transmsg}'><i class='fa fa-exclamation-circle fa-fw' style="color:red !important" aria-hidden='true'></i></span>     
                </div>
                </td>`;
                }
               
            }
             strcat +=`</tr>` 
             
             $("#PRMapCategory").append(strcat);
             
             
             debugger
             
             
             
             
             //PR2 Mapping 
             debugger
             vendorfrequency=parseInt(data.associatedVendors.length)
             $("#PRMapTable").empty;
             $("#PRMapTable").removeClass('hide')
            let strtbl="";
            let strtblH="";
            let unitallocation;
            //tablehead
            strtblH +=`<thead><tr class='hide'><th>PI Number</th><th id='tblpinumber'></th><th>NFA ID</th><th class='bold'>${_EventID}</th><th></th><th></th><th></th><th></th><th></th>`;
             for(var i=0;i<data.associatedVendors.length;i++){
                      debugger
                       unitallocation=0
                       if(data.sobHeader.sobOn=="P")
                       {
                         unitallocation=(parseInt(data.associatedVendors[i].allocation)* data.sobHeader.amount)/100;  
                       }
                       else{
                         unitallocation =parseInt(data.associatedVendors[i].allocation)  
                       }
                      strtblH +=`<th class='hide' id='vendorMaxAllocate${i}'>${unitallocation}</th>`;
                   }
            strtblH +='</tr>' ;
            strtblH +='<tr><th class="hide">Line item number</th><th>PR2 Number</th><th>Line Item of requisition</th><th>Material Code</th> <th>Shortname</th><th>Delivery date of product</th><th>Quantity</th>';
            for(var k=0;k<data.associatedVendors.length;k++){
                       
                      strtblH +=`<th id='vendorName${k}'>${data.associatedVendors[k].vendorName}</th>`;
                   }
            
            strtblH +='</tr></thead>';
             $("#PRMapTable").append(strtblH);
             
             
             let bednrno
             debugger
             if(data.resultToReturn.length>0){
                bednrno=data.resultToReturn[0].bednr
             }
             else{
                 bednrno=''
             }
             $("#tblpinumber").text(bednrno);
            
            //tablebody
            debugger
             for(var i=0;i<data.resultToReturn.length;i++){
                truncatedMaterial=data.resultToReturn[i].matnr.slice(-8);
                deliverydate =data.resultToReturn[i].lfdat
                DCyear = parseInt(deliverydate.substr(0, 4));
                DCmonth = parseInt(deliverydate.substr(4, 2)) - 1;
                DCday = parseInt(deliverydate.substr(6, 2));
                DCdt = new Date(DCyear, DCmonth, DCday);
                if(data.resultToReturn[i].inD_ITEM_NO){
                   inD_ITEM_NO =data.resultToReturn[i].inD_ITEM_NO;
                }
                else{
                   inD_ITEM_NO="";
                }
                strtbl +=`<tbody><tr><td id='poitem${i}' class='hide'>${inD_ITEM_NO}</td><td id='prnumber${i}'>${data.resultToReturn[i].banfn}</td><td id='bannumber${i}'>${data.resultToReturn[i].bnfpo}</td><td id='matcode${i}'>${truncatedMaterial}</td><td id='shortname${i}'>${data.resultToReturn[i].txZ01}</td><td><div class="input-group date form_datetime form_datetime bs-datetime "><input type="text" size="16" value="${DCdt}" class="form-control" id='deliverydate${i}'  name="deliverydate${i}" readonly><span class="input-group-btn"> <button class="btn default date-set btncalandar" type="button" id="btncal${i}"><i class="fa fa-calendar"></i></button></span></div></td><td id='vendorQuant${i}'>${data.resultToReturn[i].menge}</td>`;    
                   for(var j=0;j<data.associatedVendors.length;j++){
                       
                      strtbl +=`<td>
                      <div style="display: flex; justify-content: space-between;">
                      <input onkeyup='checkPRValidity(this)'  placeholder='enter quantity' class='form-control  vendor${j}' id='vendor${i}${j}'/>
                      <input onkeyup='checkPRValidity(this)' class='form-control unitprice${j}' placeholder='enter price' id='unitprice${i}'  value=${data.resultToReturn[i].preis} /></td>
                      </div>`
                   }
                  strtbl +='</tr>'
                  
             }
              strtbl+='</tbody>'
              $("#PRMapTable").append(strtbl);  
              
               //NFA header
               
              let strnfa = '';
              let strnfaH = '';
              $("#NFAMapTable").empty();
             debugger;

             strnfaH += `<thead><tr><th>NFA Param Text</th><th>NFA Param Id</th><th>Remark</th></tr></thead>`;
             $("#NFAMapTable").append(strnfaH);

             strnfa += `<tbody>`;
            for (let n = 0; n < data.sapFieldsFromNFA.length; n++) {
              strnfa += `<tr>
                <td style="width: 25%; word-wrap: break-word;">${data.sapFieldsFromNFA[n].nfaParamText}</td>
                <td style="width: 25%; word-wrap: break-word;">${data.sapFieldsFromNFA[n].nfaparamId}</td>
                <td style="width: 50%; word-wrap: break-word;" id="${data.sapFieldsFromNFA[n].sapField}remark">${data.sapFieldsFromNFA[n].remark}</td>
               
             </tr>`;
            }
            strnfa += `</tbody>`;
            $("#NFAMapTable").append(strnfa);

             ComponentsPickers.init();
             GetCustomerSpecificMaster(CUSTOMERID)
             debugger
             UpdateVCategory(vendorExternalSource)
             
            
             
            
           
        },
        error: function (xhr, status, error) {
          debugger
            var err = xhr.responseText
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alertforerror(err)
            }
            jQuery.unblockUI();
            return false;

        }

    });
}


function checktotalquant(id) {
  
  let TQ = 0;
  let totVendquant
  $('#PRMapTable tbody tr').each(function(i) {
      
     TQ = parseFloat(removeThousandSeperator($(`#vendorQuant${i}`).text()));
     totVendquant=0
     for(var j=0;j<vendorfrequency;j++){
         totVendquant +=parseFloat(removeThousandSeperator($(`#vendor${i}${j}`).val()||0))
     }
     if(totVendquant>TQ){
       debugger
        alertforerror(`Please check quantity allocated to vendors is greater than allocated quantity for item ${$(`#shortname${i}`).text()}`)
        $(id).val('');
        return false; 
         
     }
     else{
         return true
     }
    
  });

 
}

function checktotalVA(id) {
    
    let TMaxAllocate; let TVendAllocate;
    for(var i=0;i<vendorfrequency;i++){
       debugger
        TMaxAllocate=parseFloat(removeThousandSeperator($(`#vendorMaxAllocate${i}`).text()));
        TVendAllocate=0
        $('#PRMapTable tbody tr').each(function(j) {
           debugger
          TVendAllocate += parseFloat(removeThousandSeperator($(this).find(`.vendor${i}`).val()||0)) * parseFloat(removeThousandSeperator($(this).find(`.unitprice${i}`).val()||0))
            
        })
        
        if(TVendAllocate>TMaxAllocate){
           
        alertforerror(`Please check  allocation for Vendor ${$(`#vendorName${i}`).text()}`)
        $(id).val('');
        return false; 
         
        }
      else{
         return true;
     }
        
    }
}




function checkPRValidity(id){
    debugger
    localecommaseperator(id)
    checktotalquant(id)
    checktotalVA(id)
}


function GetCustomerSpecificMaster(custid) {
debugger
    console.log(sessionStorage.getItem("APIPath") + "KDSMaster/GetCustomerSpecificMaster/?Id=" + custid)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "KDSMaster/GetCustomerSpecificMaster/?Id=" + custid,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        data: "{}",
        cache: false,
        dataType: "json",
        async:false,
        success: function (data) {
             debugger
             //document type
            jQuery(".documenttype").empty();
            jQuery(".documenttype").append(jQuery("<option value=''  data-incotermdesc='' >Select</option>"));
 
            for (var i = 0; i < data.docType.length; i++) {

                jQuery(".documenttype").append(jQuery("<option value='" + data.docType[i].poDocumentType + "'  data-incotermdesc='" + data.docType[i].description + "' >" + data.docType[i].description + " [" + data.docType[i].poDocumentType + "]" + "</option>"));

            }
             
             
              //income term
            jQuery(".Incoterm").empty();

            for (var i = 0; i < data.incoTerm.length; i++) {

                jQuery(".Incoterm").append(jQuery("<option value='" + data.incoTerm[i].incoTerms + "'  data-incotermdesc='" + data.incoTerm[i].description + "' >" + data.incoTerm[i].description + " [" + data.incoTerm[i].incoTerms + "]" + "</option>"));

            }
            
            
            //PayTerm
            jQuery(".PayTerm").empty();
            
            for (var i = 0; i < data.paymentTerms.length; i++) {
                jQuery(".PayTerm").append(jQuery("<option></option>").val(data.paymentTerms[i].termsOfPayment).html(" [" + data.paymentTerms[i].termsOfPayment + "]"+" "+data.paymentTerms[i].newPaymentTerms));
            }
            
            //currency
            
            GetCurrency('IN') 
            
            
            //Purchase ORG
            jQuery(".PORG").empty();
             
            for (var i = 0; i < data.porg.length; i++) {
                jQuery(".PORG").append(jQuery("<option></option>").val(data.porg[i].purchaseOrganization).html(data.porg[i].description + " [" + data.porg[i].purchaseOrganization + "]"));
            }
             
             
             //Purchase Group
            jQuery(".PGRP").empty();
             
            for (var i = 0; i < data.porg.length; i++) {
                jQuery(".PGRP").append(jQuery("<option></option>").val(data.purGrp[i].grpCode).html(data.purGrp[i].description + " [" + data.purGrp[i].grpCode + "]"));
            }
             
             
              
              
            //tax code
            jQuery(".taxcode").empty();
            jQuery(".taxcode").append(jQuery("<option value=''>Select</option>"));

             for (var i = 0; i < data.taxCode.length; i++) {
                jQuery(".taxcode").append(jQuery("<option value='"+ data.taxCode[i].taxCode+"'  >" + data.taxCode[i].description + " [" + data.taxCode[i].taxCode + "]" + "</option>"));

            }
            
            //companycode
           jQuery(".companycode").empty();
            jQuery(".companycode").append(jQuery("<option></option>").val(0).html("Select"));
            for (var i = 0; i < data.coCd.length; i++) {
                jQuery(".companycode").append(jQuery("<option></option>").val(data.coCd[i].companyCode).html(data.coCd[i].description + " [" + data.coCd[i].companyCode + "]"));
            }
           
           
           
            debugger
            Selectsearch();
            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {
            debugger
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }

            return false;
            jQuery.unblockUI();
        }

    });
}


function UpdateVCategory(data){
    debugger
    let associatevendorid='';
    let match=0
    for(let v=0;v<vendorfrequency;v++){
        
     associatevendorid=$(`#vendorName${v}`).data(`vendorid`)
     if(associatevendorid==data[match].vendorId){
         
    //tax code     
    $(`#taxcode${v}`).val(data[match].pOCreationDetails[0].taxCode).trigger('change')
    
    //doctype  
    
     $(`#doctype${v}`).val(data[match].documentType).trigger('change')
         
    //incoterm
   
     
     
      $(`#incoterm${v}`).val(data[match].incoterm).trigger('change')
      
   
   //payterm
   
       
      $(`#PaymentTerms${v}`).val(data[match].payTerm).trigger('change')
        
   
   
    //purorg
    
        
          $(`#purorg${v}`).val(data[match].porg).trigger('change')
        
   
   
   
    //tax code
   
       
      $(`#taxcode${v}`).val(data[match].witholdingTaxType).trigger('change')
       
   
   //price unit
   
    $(`#priceunit${v}`).val(data[match].price_Unit)
     
       
      
      $(`#Currency${v}`).val(data[match].currency).trigger('change')
       
   
   
    
       
      $(`#comcode${v}`).val(data[match].coCd).trigger('change')
       
   
   debugger
    
       
        $(`#partnernumber${v}`).val(data[match].partnerNumber)
        
        $(`#InvoicingParty${v}`).empty();
        $(`#InvoicingParty${v}`).append(`<option value=''>select<option`)
        for (var xi = 0; xi < data[match].invoicingParties.length; xi++) {

                $(`#InvoicingParty${v}`).append(jQuery("<option value='" + data[match].vendorCode + "'   >" + data[match].invoicingParties[xi].participantName  + " [" + data[match].invoicingParties[xi].vendorCode + "]" + "</option>"));

               }
        
        /*for(var x=0;x<data.vendorExternalSource.length;x++){
               $(`#InvoicingParty${x}`).empty();
               $(`#InvoicingParty${x}`).append(`<option value=''>select<option`)

               for (var xi = 0; xi < data.vendorExternalSource[x].invoicingParties.length; xi++) {

                $(`#InvoicingParty${x}`).append(jQuery("<option value='" + data.vendorExternalSource[x].invoicingParties[xi].vendorCode + "'   >" + data.vendorExternalSource[x].invoicingParties[xi].participantName  + " [" + data.vendorExternalSource[x].invoicingParties[xi].vendorCode + "]" + "</option>"));

               }
            
             
             
             }*/
              
       
   
   match++;
     }
   
     } 
   
 
}


function GetCurrency(CountryKey) {

    console.log(sessionStorage.getItem("APIPath") + "KDSMaster/GetCountrySpecificMaster/?CountryKey=" + CountryKey)
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "KDSMaster/GetCountrySpecificMaster/?CountryKey=" + CountryKey,
        /*beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },*/
        data: "{}",
        cache: false,
        dataType: "json",
        async:false,
        success: function (data) {
        
            //currency
            jQuery(".ddlcurrency").empty();
            jQuery(".ddlcurrency").append(jQuery("<option></option>").val('').html("Select Currency"));
            for (var i = 0; i < data.currency.length; i++) {
                jQuery(".ddlcurrency").append(jQuery("<option></option>").val(data.currency[i].currency).html(data.currency[i].longText));
            }


            jQuery.unblockUI();

        },
        error: function (xhr, status, error) {
            
            var err = eval("(" + xhr.responseText + ")");
            if (xhr.status === 401) {
                error401Messagebox(err.Message);
            }
            else {
                fnErrorMessageText('errormsg', '');
            }

            return false;
            jQuery.unblockUI();
        }

    });



}


let isPOAPI =''
function submitPRForm(){
    debugger
    
   
    
    let eventid=parseInt($('#lbleventidr').text());
    let eventtype= $("#hdneventtype").val();
    let sobid = parseInt($("#hdnsobid").val());
    let nfaid = parseInt(EventID);
    let custid=parseInt(CUSTOMERID);
    let zdata = [],TAXCODEV 
    let itemdata,priceunit;
    
   debugger
  
    let currentdatepo = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');; 
   
    
    debugger 
    var prcategoryVarray=[];
    var prmappingitemlist=[];
    for(var vf=0;vf<vendorfrequency;vf++){
        debugger
        
     prmappingitemlist=[]
     TAXCODEV =$(`#taxcode${vf} option:selected`).val();
     priceunit=String($(`#priceunit${vf}`).val());
     debugger
   if($(`#partnernumber${vf}`).val()){  
     $("#PRMapTable>tbody>tr").each(function(i){
          
           let deldat =new Date($(`#deliverydate${i}`).val());
           let DELIVERY_DATE = deldat.getFullYear() + '.' + ('0' + (deldat.getMonth() + 1)).slice(-2) + '.' + ('0' + deldat.getDate()).slice(-2);  
           
          
               
             debugger
           if($(this).find(`.vendor${vf}`).val()){
              let PBXX_I = String(($(this).find(`.unitprice${vf}`).val() * $(this).find(`.vendor${vf}`).val()))
                var prlistV = {
                "EBELN":"",
                "BANFN":$(`#prnumber${i}`).text(),
                "BNFPO":$(`#bannumber${i}`).text(),
                "PO_ITEM":$(`#bannumber${i}`).text(),//pe
                "SHORT_TEXT":'', 
                "MATERIAL":'',
                "PLANT":'',// 
                "STGE_LOC":"",//
                "MATL_GROUP":"",//
                "QUANTITY":$(this).find(`.vendor${vf}`).val(),//pe
                "PO_UNIT":"",
                "TAX_CODE":TAXCODEV,
                "RET_ITEM":"",
                "DELIVERY_DATE":'',//pe
                "FRA1_I": "",
                "FRB1_I": "",
                "FRC1_I": "",//not needed
                "FRUN_I": "",
                "RA01_I": "",
                "RB00_I": "",
                "RC00_I": "",
                "SKTO_I": "",
                "ZIN1_I": "",
                "ZIN2_I": "",
                "ZIN3_I": "",
                "ZINP_I": "",
                "ZINT_I": "",
                "ZPF1_I": "",
                "ZPF2_I": "",
                "ZPF3_I": "",
                "JCDB_I": "",
                "JSWS_I": "",
                "ZAD1_I": "",
                "ZADD_I": "",
                "ZAF1_I": "",
                "ZCVC_I": "",
                "ZCVD_I": "",
                "ZLF2_I": "",
                "ZLTC_I": "",
                "ZOB1_I": "",
                "ZOF1_I": "",
                "ZSWS_I": "",
                "PB00_I": "",
                "PBXX_I":PBXX_I, //doubt quantity*unitprice
                "P101_I": "",
                "I_F01": '',  
                "MAT_PO_TXT": "",
                "CONF_CTRL": "",
                "ACCAS": "",
                "ITEM_CAT": "",
                "COST_CTR": "",
                "PRFT_CTR": "",
                "WBS": "",
                "ORDER": "",
                "NETWRK": "",
                "ASSET_NO": "",
                "PI": "",//pe dropdown
                "DIFF_INV": "",
            }
            prmappingitemlist.push(prlistV);  
           }
           
     
         
          
      }) 
      
     let H_F01,MOD_DISP,PLC_DLVR,TRM_PYMNT,PRC_BASIS,SPCL_INST,WARRANTY; 
     $("#NFAMapTable>tbody").each(function () {
         debugger
         H_F01=$(`#H_F01remark`).text();
         MOD_DISP=$(`#MOD_DISPremark`).text();
         PLC_DLVR=$(`#PLC_DLVRremark`).text();
         TRM_PYMNT=$(`#TRM_PYMNTremark`).text();
         PRC_BASIS=$(`#PRC_BASISremark`).text();
         SPCL_INST=$(`#SPCL_INSTremark`).text();
         WARRANTY=$(`#WARRANTYremark`).text();
         
     }); 
        
    
     $("#PRMapCategory>tbody").each(function () 
     {
         
         let j=vf
         
         debugger  
         
              ZPO_HEAD={
                "EBELN":"",
                "BUKRS":$(`#comcode${j} option:selected`).val(),
                "BSART":$(`#doctype${j} option:selected`).val(),
                "BEDAT":currentdatepo,//currentdate
                "LIFNR":$(`#partnernumber${j}`).val(),//partnernumber
                "PWERK":'',
                "EKORG":$(`#purorg${j}`).val(),
                "EKGRP":$(`#purgrp${j}`).val(),
                "INCO1":$(`#incoterm${j} option:selected`).val(),
                "ZTERM":$(`#PaymentTerms${j} option:selected`).val(),
                "WAERS":$(`#Currency${j} option:selected`).val(),
                "H_F01":H_F01,//nfa
                "MOD_DISP":MOD_DISP,//nfa
                "PLC_DLVR":PLC_DLVR,//nfa
                "TRM_PYMNT":TRM_PYMNT,//nfa
                "PRC_BASIS":PRC_BASIS,//nfa
                "SPCL_INST":SPCL_INST,//nfa
                "BILL_ADDR":"",//notrequired
                "WARRANTY":WARRANTY,//nfa
                "FRA1_H": "",
                "FRB1_H": "",
                "FRC1_H": "",
                "FRUN_H": "",
                "RA01_H": "",
                "RB00_H": "",
                "RC00_H": "",
                "SKTO_H": "",
                "ZIN1_H": "",
                "ZIN2_H": "",
                "ZIN3_H": "",
                "ZINP_H": "",
                "ZINT_H": "",
                "PRICE_UNIT":priceunit,
                "HDRITEMSNAV":{
                    "ZPO_ITEMS":prmappingitemlist
                    
                },
                "HDRETURNNAV": {
                "RETURN": {
                    "Type": "",
                    "Id": "",
                    "Number": "",
                    "Message": ""
                }
            }
                
           
          
              
          }
         
         
            
            
         
         
       }
     );
     
       
       itemdata= {
            "ZPO_HEADSet":{
                 "ZPO_HEAD":ZPO_HEAD
            }
        }
       
       
        
       
     
           zdata.push(itemdata) 
      
       
         
   
  
     
     
    /* */
   
       
        debugger
        let data={
                   "EventId":eventid,
                   "EventType":eventtype, 
                   "SOBId":sobid,
                   "NFAId":nfaid,
                   "CustomerId":custid,
                   "ZPO_HEADSetList":zdata
        }
        
    console.log(data);
        
    console.log(sessionStorage.getItem("APIPath") + `SAPIntegration/PostMappingForPOCreation`)
    debugger
    
        jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: APIPath + "ChangeForgotPassword/fetchMyprofileDetails/?UserID=" + encodeURIComponent(sessionStorage.getItem('VendorId')) + "&UserType=" + sessionStorage.getItem('UserType'),
        url: sessionStorage.getItem("APIPath") + `SAPIntegration/PostMappingForPOCreation`,
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        async:false,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
           debugger
            jQuery.unblockUI();
           
            
        },
        error: function (xhr, status, error) {
            debugger
            if(xhr.responseText){
              err = `${xhr.responseText}  for - Vendor  ${$(`#vendorName${vf}`).text()}`;  
            }
            else{
               err = `No item is  allocate to Vendor  ${$(`#vendorName${vf}`).text()}`;  
            }
             
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                /*$(`#divsuccesserr`).hide();
                $(`#divalerterr`).text(err);
                $(`#divalerterr`).show();
                $(`#divalerterr`).fadeOut(5000);
                App.scrollTo($(`#divalerterr`), -200);*/
                alertforerror(err.replace(/(\d+)-/g, "<br>$&"));
            }
           
            jQuery.unblockUI();
           
        }
    });
         
     
     }
    else{
       
      if($(`#ponumber${vf}`).val()){
           alertforerror(` PO Number already exist for - Vendor  ${$(`#vendorName${vf}`).text()}`)
      }
      else{
        alertforerror(` Partner number not exist for - Vendor  ${$(`#vendorName${vf}`).text()}`)
      }
    }
    }
 
  
}


function Selectsearch(){
    debugger
    $('.Incoterm').select2();
    $('.PayTerm').select2();
    $('.ddlcurrency').select2();
    $('.PORG').select2();
    $('.PGRP').select2();
    $('.documenttype').select2();
    $('.taxcode').select2();
     
     fetchVendorAutoComplete()
}




function fetchVendorAutoComplete() {
   
    var returnitem = '';
   
    jQuery(".vendorsearch").typeahead({
        source: function (query, process) {
         
            var data = allvendorsforinvoice;
            var vName = '';
            usernames = [];
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
           
            
           


            return item;
        }
    });
}



  
  function boolchkup(id){
     var value = $(id).val();
     var isValid = /^[01]$/.test(value); // Use regex to check if the value is either 0 or 1

    if (!isValid) {
      $(id).val(''); // Clear the input if the value is not valid
    }
      
  }

/*
var allvendorsforinvoice;

function fetchParticipantsVenderinvoice() {
    debugger
    console.log(sessionStorage.getItem("APIPath") + "SAPIntegration/fetchInvoicingparty/?vendorid=" + sessionStorage.getItem("CustomerID") )
    jQuery.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: sessionStorage.getItem("APIPath") + "SAPIntegration/fetchInvoicingparty/?vendorid=" + sessionStorage.getItem("CustomerID"),
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("Token")); },
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function (Venderdata) {
             
            if (Venderdata.length > 0) {
                allvendorsforinvoice = Venderdata;

            }
            else {
                allvendorsforinvoice = '';

            }
        },
        error: function (xhr, status, error) {

            var err = xhr.responseText //eval("(" + xhr.responseText + ")");
            if (xhr.status == 401) {
                error401Messagebox(err.Message);
            }
            else {
                alert('error')
            }
            jQuery.unblockUI();
        }
    });
}*/
