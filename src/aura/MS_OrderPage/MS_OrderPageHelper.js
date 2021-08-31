({
    getProductsToList:function(component,event){
        let action = component.get('c.getProductsFromCart');
        action.setCallback(this, function(response) {
            let state=response.getState();
            let result = response.getReturnValue();
            if(state==='SUCCESS'){
                component.set('v.list_products',result.products);
                this.recalculatePrice(component,event);
                this.createOrderHelper(component,event);
                this.getContactDetailHelper(component,event);
            };
            component.set('v.spinner',false);
        });
        $A.enqueueAction(action);
    },

    recalculatePrice:function(component,event){
        let listProducts=component.get('v.list_products');
        let price=0;
        for(let i=0;i<listProducts.length;i++){
            let productPrice=0;
            productPrice=listProducts[i].product.UnitPrice;
            price=price+productPrice*listProducts[i].quantity;
        }
        component.set('v.sumPrice',price);
    },

    next:function(component,event){
        let isSummary=component.get('v.isSummaryOrder');
        let isDetail=component.get('v.isDetailOrder');
        let isBank=component.get('v.isChooseBankOrder');
        if(isSummary==true){
            component.set('v.isSummaryOrder',false);
            component.set('v.isDetailOrder',true);
        }else if(isDetail==true){
              component.set('v.isDetailOrder',false);
              component.set('v.isChooseBankOrder',true);
        }
    },

    previous:function(component,event){
        let isSummary=component.get('v.isSummaryOrder');
        let isDetail=component.get('v.isDetailOrder');
        let isBank=component.get('v.isChooseBankOrder');
        if(isDetail==true){
            component.set('v.isSummaryOrder',true);
            component.set('v.isDetailOrder',false);
        }else if(isBank==true){
              component.set('v.isDetailOrder',true);
              component.set('v.isChooseBankOrder',false);
        }
    },

    toggleUserBank:function (component, event,element,id_str) {
        let bankId=component.get("v.idBank");
        if(element.classList.contains('selected')&&id_str==bankId){
            this.unsetUserBank(component, event,element,id_str)
        }else if(bankId=="") {
            this.setUserBank(component, event,element,id_str);
        }
    },

    setUserBank:function (component, event,element,id) {
      component.set("v.idBank",id);
      element.classList.add("selected");

    },

    unsetUserBank:function (component, event,element,id) {
      component.set("v.idBank","");
      element.classList.remove("selected");
    },

    createOrderHelper:function (component,event){
        let wrapper=component.get('v.dataToDelivery');
        let action=component.get('c.createOrder');
        action.setParams({
            amountOrder:component.get('v.sumPrice'),
        })
        console.log(wrapper)
        action.setCallback(this, function(response) {
          let state=response.getState();
          let result = response.getReturnValue();
          if(state==='SUCCESS'){
              component.set('v.idOrder',result);
          }
    })
    $A.enqueueAction(action);
    },

     getContactDetailHelper:function(component,event){
        let wrapper=component.get('v.dataToDelivery');
        let action=component.get('c.getContactDetails');
        action.setCallback(this, function(response) {
          let state=response.getState();
          let result = response.getReturnValue();
          if(state==='SUCCESS'){
              console.log(result);
              component.set('v.dataToDelivery',result);
          }
    })
    $A.enqueueAction(action);
    },

    deliveryMethodHandlerHelper:function(component,event){
        let wrapper=component.get('v.dataToDelivery');
        let action=component.get('c.getContactDetails');
        action.setCallback(this, function(response) {
          let state=response.getState();
          let result = response.getReturnValue();
          if(state==='SUCCESS'){
              console.log(result);
              component.set('v.dataToDelivery',result);
          }
    })
    $A.enqueueAction(action);
    },

    saveOrderHelper:function(component,event){
        let idOrder=component.get('v.idOrder')
        let paymentMethod=component.get('v.paymentMethod')
        let deliveryMethod=component.get('v.deliveryMethod')
        let bankChoose=component.get('v.idBank')
        let isBankChoose=component.get('v.isChooseBankOrder')
        component.set('v.dataToDelivery.orderId',idOrder)
        component.set('v.dataToDelivery.paymentMethod',paymentMethod)
        component.set('v.dataToDelivery.deliveryMethod',deliveryMethod)

        let wrapper=component.get('v.dataToDelivery');
        let action=component.get('c.saveOrder');
        action.setParams({
            wrapper:JSON.stringify(wrapper),
            bankChoose:bankChoose,
        })
        if(!this.validateField(component)&&isBankChoose==false||(!this.validateField(component)&&isBankChoose==true&&bankChoose!='')){
        action.setCallback(this, function(response) {
          let state=response.getState();
          let result = response.getReturnValue();
          if(state==='SUCCESS'){
              this.navigate(component,event);
              this.showToast(component,event,"Order created",'Success');
          }
    })
    $A.enqueueAction(action);
        }else{
            console.log('error')
            this.showToast(component,event,"Fill in all fields",'Error');
        };
    },

    validateField:function(component){
        let deliveryData=component.get('v.dataToDelivery');
        let isBankChoose=component.get('v.isChooseBankOrder');
        let isEmptyField=false;
        for (const field in deliveryData){
            console.log(field+' '+deliveryData[field]);
            if(deliveryData[field]==undefined||deliveryData[field]==""){
                isEmptyField=true;
            };
        }
        return isEmptyField;
    },

    showToast : function(component, event,message,typeToast) {
       component.set("v.type", typeToast);
       component.set("v.message", message);
       let childComponent = component.find("toastCreatedOrder");
       let fireToast = childComponent.toast();
    },

    navigate : function(component, event) {
           let address = '/searchbox';
           let urlEvent = $A.get("e.force:navigateToURL");
           urlEvent.setParams({
             "url": address,
           });
           urlEvent.fire();
    },
})