({
    initDo:function(component,event){
        this.getProductsToListHelper(component,event);
    },

    getProductsToListHelper:function(component,event){
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

    getProductsFromEventHelper:function(component,event){
        let list = event.getParam("list_products");
        component.set('v.listProducts',list);
    },
})