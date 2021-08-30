({
    doInit:function(component,event){
       this.getAllPriceBook(component,event);

    },

    getAllPriceBook:function(component,event){
        let getPriceBooks=component.get("c.getListOfPriceBooks")
//        this.showSpinner(component,event);
         getPriceBooks.setCallback(this,function(response){
              let state=response.getState();
              let result = response.getReturnValue();
              console.log(result)
        if(state === "SUCCESS") {
           component.set("v.listOfPriceBooks",result);
        this.setStandardPriceBook(component)
        if(component.get("v.idPriceBooks")==null){
             let idPriceBo=component.get("v.idStandardPriceBooks")
             this.getProductsToPriceBook(component,event,idPriceBo);
        }
//            this.hideSpinner(component,event);
        }
        });
        $A.enqueueAction(getPriceBooks);
    },

    getProductsToPriceBook:function(component,event,id){
        let getProductsHelper=component.get("c.getProductsToPriceBook")
        component.set('v.addMode',false);
        getProductsHelper.setParams({
                     'idPriceBook': id,
                 })
        getProductsHelper.setCallback(this,function(response){
             let state=response.getState();
             let result = response.getReturnValue();
             console.log(result)
        if(state === "SUCCESS") {
           this.hideSpinner(component,event);
           component.set("v.productsToPriceBook",result);
           component.set("v.selectedProduct",[]);
           component.set("v.listStandardPriceBook",[]);
           component.set("v.listStandardPriceBook",component.get('v.originallyProductsToModal'));
           this.addActuallyProductToList(component,event);
           if(result[0].Pricebook2Id==component.get('v.idStandardPriceBooks')){
               component.set('v.listStandardPriceBook',component.get('v.productsToPriceBook'))
               component.set('v.originallyProductsToModal',component.get('v.productsToPriceBook'))
           }
           this.addStandardPriceToDisplayingField(component,event);
         }

        });
        $A.enqueueAction(getProductsHelper);
    },

    setStandardPriceBook:function(component){
        let list= component.get('v.listOfPriceBooks')
        console.log(list);
        list.forEach(pricebook=>{
            if(pricebook.IsStandard==true){
                component.set("v.idStandardPriceBooks",pricebook.Id);
                component.set("v.nameDisplayedPriceBook",pricebook.Name);
                component.set("v.discountFromPriceBook",pricebook.discount__c);
                component.set("v.descriptionFromPriceBook",pricebook.Description);
                component.set("v.isActive",pricebook.IsActive);
                }
        })
    },

    addPricebookHelper:function(component,event){
        this.showSpinner(component,event);
        let idStandardList=component.get('v.idStandardPriceBooks')
        let addPricebookMethod=component.get("c.addPriceBookApex");
        let nameField=component.get('v.name')
        let discountField=component.get('v.discount')
        let listSelectedProducts=component.get("v.selectedProduct");
        console.log(listSelectedProducts)
        if(nameField==""||discountField==""){
            this.showToast(component,event, "Field name and discount can't be empty" ,"error");
        }
        if(listSelectedProducts.length<1){
            this.showToast(component,event, "Choose product to Price Book" ,"error");
        }
        component.set("v.wrapperToSend",JSON.stringify(listSelectedProducts));
        let wrapper = component.get("v.wrapperToSend");
        addPricebookMethod.setParams({
                     name: component.get('v.name'),
                     discount: component.get('v.discount'),
                     description: component.get('v.description'),
                     idProductsToCreate:wrapper
                 });
        addPricebookMethod.setCallback(this,function(response){
             let state=response.getState();
             let result = response.getReturnValue();
        if(state === "SUCCESS") {
            this.getAllPriceBook(component,event)
            component.set("v.idPriceBooks",result.pricebook.Id)
            let id=component.get("v.idPriceBooks")
            this.getProductsToPriceBook(component,event,idStandardList)
                component.set("v.name","");
                component.set("v.discount","");
                component.set("v.description","");
                this.showToast(component,event,"Add Pricebook","success");
            }
            });
        $A.enqueueAction(addPricebookMethod);
    },

    changePriceBook:function(component,event,id){
        this.showSpinner(component,event);
        component.set("v.idPriceBooks",id);
        let idStandard =component.get("v.idStandardPriceBooks");
        this.updateInfoPriceBookCard(component,id);
        this.getProductsToPriceBook(component,event,id);
    },

    showToast : function(component, event,message,typeToast) {
        component.set("v.type", typeToast);
        component.set("v.message", message);
        let childComponent = component.find("toastComponent");
        let fireToast = childComponent.toast();
    },

    updateInfoPriceBookCard:function(component,id){
         let listPrice = component.get('v.listOfPriceBooks');
         listPrice.forEach(pricebook=>{
             console.log(pricebook);
            if(pricebook.Id==id){
                component.set("v.nameDisplayedPriceBook",pricebook.Name);
                component.set("v.discountFromPriceBook",pricebook.discount__c);
                component.set("v.descriptionFromPriceBook",pricebook.Description);
                component.set("v.isActive",pricebook.IsActive);
            }
        })
    },

    deletePriceBookHelper:function(component,event){
        this.showSpinner(component,event);
        let deletePriceBookMethod=component.get("c.deletePriceBooks")
        let deleteId=component.get("v.idPriceBooks")
        deletePriceBookMethod.setParams({
            'id': deleteId,
        })
        deletePriceBookMethod.setCallback(this,function(response){
             let state=response.getState();
             let result = response.getReturnValue();
        if(state === "SUCCESS") {
             this.showToast(component,event,"Delete PriceBook","success");
             this.getAllPriceBook(component,event);
        }else{
            this.showToast(component,event,result.message,"error");
        }
        this.hideSpinner(component,event);
        });
        $A.enqueueAction(deletePriceBookMethod);
    },

    updatePriceBookHelper:function(component,event){
        this.showSpinner(component,event);
        let updatePriceBookMethod=component.get("c.updatePriceBookApex");
        let id=component.get("v.idPriceBooks");
        let idStandard=component.get("v.idStandardPriceBooks");
        let listSelectedProducts=component.get("v.selectedProduct");
//        this.checkChangedPricebook(component,event);
        component.set("v.wrapperToSend",JSON.stringify(listSelectedProducts));
        let wrapper = component.get("v.wrapperToSend");
        updatePriceBookMethod.setParams({
            'id':id,
            'name': component.get('v.nameToUpdate'),
            'discount': component.get('v.discountToUpdate'),
            'description': component.get('v.descriptionFromPriceBook'),
            'idProductsToCreate':wrapper,
        })
        updatePriceBookMethod.setCallback(this,function(response){
             let state=response.getState();
             let result = response.getReturnValue();
             console.log(result)
        if(state === "SUCCESS") {
            this.showToast(component,event,"Update price book","success");
            console.log(result);
            component.set("v.isEditModal",false);
            this.getAllPriceBook(component,event)
            this.getProductsToPriceBook(component,event,idStandard)
            }else{
                 this.showToast(component,event,"Cannot update Price Book ","success");
            }
            });
        $A.enqueueAction(updatePriceBookMethod);
    },

    addToList: function (component,id) {
          const listSelectedProduct=component.get("v.selectedProduct");
          console.log(listSelectedProduct);
          if(listSelectedProduct.includes(id)){
              this.deleteFromSelectedList(component,id);
          }else{
              listSelectedProduct.push(id);
              console.log('dzialadodawanie')
              component.set("v.selectedProduct",listSelectedProduct);
          }
    },

    addActuallyProductToList:function(component,event){
        this.selectAll(component,event,false);
        let standardProducts=component.get("v.listStandardPriceBook")
        let pricebookProducts=component.get("v.productsToPriceBook")
        let choseProducts=component.get("v.selectedProduct")
        for(let index = 0; index < pricebookProducts.length; index++) {
            for(let i = 0; i < standardProducts.length; i++) {
                if(pricebookProducts[index].Product2Id === standardProducts[i].Product2Id) {
                    let productList = component.get("v.listStandardPriceBook");
                    productList[i].selected = !productList[i].selected;
                    choseProducts.push(productList[i].Product2Id);
                    component.set('v.listStandardPriceBook', productList);
              }
           }
        }
    },

    clearSelectedList:function(component){
        let chosenProduct=component.get("v.selectedProduct");
        component.set('v.selectedProduct',[]);
    },
    deleteFromSelectedList:function (component,id){
         let chosenProduct=component.get("v.selectedProduct");
         for(let index = 0; index < chosenProduct.length; index++) {
             if(id==chosenProduct[index]){
                 console.log('dziala')
                 chosenProduct.splice(index,1);
                 component.set('v.selectedProduct',chosenProduct);
             }
         }
    },

    selectAll: function(component, event,isSelectAll) {
        let productList = component.get("v.listStandardPriceBook");
        let choseProducts=component.get("v.selectedProduct")
        if(isSelectAll) {
            for(let index = 0; index < productList.length; index++) {
                productList[index].selected = true;
                choseProducts.push(productList[index].Product2Id);
            }
            component.set('v.listStandardPriceBook', productList);
            component.set('v.selectedProduct', choseProducts);
        } else {
            for(let index = 0; index < productList.length; index++) {
                productList[index].selected = false;
            }
            component.set('v.selectedProduct', []);
            component.set('v.listStandardPriceBook', productList);
        }
    },

    updatePriceInProductsHelper:function(component,event){
        this.showSpinner(component,event);
        let idStandardList=component.get('v.idStandardPriceBooks');
        let listSelectedProducts=component.get("v.selectedProduct");
        component.set("v.wrapperToSend",JSON.stringify(listSelectedProducts));
        let wrapper = component.get("v.wrapperToSend");
        let updatePriceProductsMethod=component.get("c.updatePriceInProduct");
        updatePriceProductsMethod.setParams({
                     'id': component.get('v.idPriceBooks'),
                     'discount':component.get('v.discountToUpdate'),
                     'idProductsToCreate':wrapper
        })
        updatePriceProductsMethod.setCallback(this,function(response){
             let state=response.getState();
             let result = response.getReturnValue();
        if(state === "SUCCESS") {
            this.showToast(component,event,"Update products in price book","success");
            this.getAllPriceBook(component,event)
             this.getProductsToPriceBook(component,event,idStandardList);
             component.set('v.editPriceProducts',false);
             component.set('v.isOpenAddProductModal',false);
         }else{
             this.showToast(component,event,"Cannot update products in price book","success");
         }
        });
        $A.enqueueAction(updatePriceProductsMethod);
    },

    addStandardPriceToDisplayingField:function(component,event){
        let standardProducts=component.get("v.listStandardPriceBook")
        let pricebookProducts=component.get("v.productsToPriceBook")
        for(let index = 0; index < pricebookProducts.length; index++) {
            for(let i = 0; i < standardProducts.length; i++) {
               if(pricebookProducts[index].Product2Id === standardProducts[i].Product2Id) {
                   let productList = component.get("v.productsToPriceBook");
                   productList[i].standardPrice = standardProducts[i].UnitPrice;
                   component.set('v.productsToPriceBook', productList);
               }
           }
        }
    },

    showSpinner: function(component, event) {
        // make Spinner attribute true for displaying loading spinner
        component.set("v.spinner", true);
    },

    // function automatic called by aura:doneWaiting event
    hideSpinner : function(component,event){
        // make Spinner attribute to false for hiding loading spinner
        component.set("v.spinner", false);
    }

})