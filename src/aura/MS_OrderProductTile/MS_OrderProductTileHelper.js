({
    initDo:function(component,event){
        let originallyPrice=component.get('v.product.product.UnitPrice');
        originallyPrice+0;
        component.set('v.originallyPrice',originallyPrice);
        this.recalculatePrice(component,event);
    },
    recalculatePrice:function(component,event){
           let price=component.get('v.originallyPrice');
           let quantity=component.get('v.quantity');
           let newPrice=price*quantity;
           component.set('v.originallyPrice',newPrice);
    },
})