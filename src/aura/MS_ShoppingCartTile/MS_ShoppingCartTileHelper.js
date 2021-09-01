({
    initDo:function(component,event){
        let price=component.get('v.product.product.UnitPrice');
        price+0;
        component.set('v.originallyPrice',price);
        this.recalculatePrice(component,event);
    },

    recalculatePrice:function(component,event){
        let price=component.get('v.originallyPrice');
        let quantity=component.get('v.quantity');
        let newPrice=price*quantity;
        component.set('v.product.product.UnitPrice',newPrice);
    },

    increaseQuantityHelper:function(component,event){
        let quantity=component.get('v.quantity');
        let newQuantity=quantity+1;
        component.set('v.quantity',newQuantity);
        this.recalculatePrice(component,event);
        this.handleQuantityProductHelper(component,event);
    },

    decreaseQuantityHelper:function(component,event){
        let quantity=component.get('v.quantity');
        if(quantity>1){
            let newQuantity=quantity-1;
            component.set('v.quantity',newQuantity);
            this.recalculatePrice(component,event);
            this.handleQuantityProductHelper(component,event);
        }
    },

    deleteProductHelper:function(component,event){
        let updateQuantityEvent = $A.get("e.c:MS_UpdateQuantityInCart");
        let cmpEvent = component.getEvent("deleteProductEvent");
        let updateEvent = $A.get("e.c:MS_UpdatePrice");
        let action = component.get('c.deleteProduct');
            action.setParams({
                id:component.get('v.product.product.Product2Id'),
            });
        action.setCallback(this, function(response) {
            let state=response.getState();
            let result = response.getReturnValue();
            if(state==='SUCCESS'){
                cmpEvent.setParams({
                    list_products:result.products,
                })
                component.set('v.message',$A.get("$Label.c.Deleted_product_from_cart"));
                this.showToast(component,event,"Success");
               cmpEvent.fire();
               updateEvent.fire();
               updateQuantityEvent.fire();
            }
        })
        $A.enqueueAction(action);
    },

    handleQuantityProductHelper:function(component,event){
        let updateQuantityEvent = $A.get("e.c:MS_UpdateQuantityInCart");
        let updateEvent = $A.get("e.c:MS_UpdatePrice");
        let action = component.get('c.changeQuantity');
        action.setParams({
            id:component.get('v.product.product.Product2Id'),
            quantity:component.get('v.quantity'),
        })
        action.setCallback(this, function(response) {
            let state=response.getState();
            let result = response.getReturnValue();
            if(state==='SUCCESS'){
                updateEvent.fire();
                updateQuantityEvent.fire();
            }
        })
        $A.enqueueAction(action);
    },

    showToast : function(component, event,typeToast) {
        component.set("v.type", typeToast);
        let childComponent = component.find("toastComponentProduct");
        let fireToast = childComponent.toast();
    },
})