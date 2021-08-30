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
        console.log(quantity)
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
        let cmpEvent = component.getEvent("deleteProductEvent");
         let updateEvent = $A.get("e.c:MS_UpdatePrice");
        let action = component.get('c.deleteProduct');
            action.setParams({
                id:component.get('v.product.product.Product2Id'),
            })
        action.setCallback(this, function(response) {
            let state=response.getState();
            let result = response.getReturnValue();
             console.log(state)
            if(state==='SUCCESS'){
                cmpEvent.setParams({
                    list_products:result.products,
                })
                this.showToast(component,event,"Deleted product from cart","success");
               cmpEvent.fire();
               updateEvent.fire();
            }
        })
        $A.enqueueAction(action);
    },

    handleQuantityProductHelper:function(component,event){
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
            }
        })
        $A.enqueueAction(action);
    },

    showToast : function(component, event,message,typeToast) {
             component.set("v.type", typeToast);
             component.set("v.message", message);
             let childComponent = component.find("toastComponentProduct");
             let fireToast = childComponent.toast();
    },
})