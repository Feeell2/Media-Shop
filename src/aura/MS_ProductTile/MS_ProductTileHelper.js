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
             this.showToast(component,event,"Added To Cart","success");
             updateQuantityEvent.fire();
             this.getProductsToListHelper(component,event);
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
    showToast : function(component, event,message,typeToast) {
          component.set("v.type", typeToast);
          component.set("v.message", message);
          let childComponent = component.find("toastComponentProductTile");
          let fireToast = childComponent.toast();
      },
})