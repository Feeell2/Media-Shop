({
    getProductsToList:function(component,event,helper){
              let action = component.get('c.getProductsToCart');
              action.setCallback(this, function(response) {
                let state=response.getState();
                let result = response.getReturnValue();
                if(state==='SUCCESS'){
                    component.set('v.listProducts',result.products);
                }
                component.set('v.spinner',false);
              })
              $A.enqueueAction(action);
    },

    getProductsFromEvent:function(component,event,helper){
       let list = event.getParam("list_products");
       component.set('v.listProducts',list);
    },
})