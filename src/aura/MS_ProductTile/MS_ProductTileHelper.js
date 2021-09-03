({
    addToCartHelper:function(component,event){
    var updateQuantityEvent = $A.get("e.c:MS_UpdateQuantityInCart");
    var action = component.get('c.addProductToCache');
        action.setParams({
          product:component.get('v.product'),
          quantity:"1",
        })
        action.setCallback(this, function(response) {
         let state=response.getState();
         let result = response.getReturnValue();
         if(state==='SUCCESS'){
            component.set('v.message',$A.get("$Label.c.Added_To_Cart"));
            this.showToast(component,event,"Success");
            updateQuantityEvent.fire();
            this.getProductsToListHelper(component,event);
         }else{
            component.set('v.message',$A.get("$Label.c.Not_added_to_Card"));
            this.showToast(component,event,"Error");
         }
        })
        $A.enqueueAction(action);
    },

    getProductsToListHelper:function(component,event){
    let action = component.get('c.getProductsToCart');
          action.setCallback(this, function(response) {
            let state=response.getState();
            let result = response.getReturnValue();
            if(state==='SUCCESS'){
                component.set('v.listProducts',result.products);
                this.checkAddingToCart(component,event);
            }
          })
          $A.enqueueAction(action);
    },

    checkAddingToCart:function(component,event){
        let listOfProduct=component.get('v.listProducts');
        let id=component.get('v.product.Product2Id');
        for(let i=0;i<listOfProduct.length;i++){
          if(listOfProduct[i].product.Product2Id==id){
              component.set('v.disableAddToCart',true);
          }
        }
    },

    showToast : function(component, event,typeToast) {
        component.set("v.type", typeToast);
        let childComponent = component.find("toastComponentProductTile");
        let fireToast = childComponent.toast();
    },

    navigateToRecordDetailHelper:function(component,event){
//        var appEvent = $A.get("e.c:aeEvent");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": component.get("v.product.Product2.Id"),
          "slideDevName": "related"
        });
        navEvt.fire();
        this.getProductsToListHelper(component, event);
    },
})