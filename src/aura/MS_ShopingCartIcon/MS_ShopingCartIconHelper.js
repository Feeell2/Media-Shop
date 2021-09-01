({
    getProductsToRecalculate:function(component,event){
        let action = component.get('c.getProductsToCart');
        action.setCallback(this, function(response) {
            let state=response.getState();
            let result = response.getReturnValue();
            if(state==='SUCCESS'){
                component.set('v.list_products',result.products);
                this.recalculatePrice(component,event);
            }
        })
        $A.enqueueAction(action);
    },

    recalculatePrice:function(component,event){
        let listProducts=component.get('v.list_products');
        let quantity=0;
        for(let i=0;i<listProducts.length;i++){
            let productQuantity=0;
            productQuantity=listProducts[i].quantity;
            quantity=quantity+productQuantity;
        }
        component.set('v.quantity',quantity);
    },

    navigateHelper:function(component,event){
        let address = '/shoping-cart';
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": address,
        });
        urlEvent.fire();
    }
})