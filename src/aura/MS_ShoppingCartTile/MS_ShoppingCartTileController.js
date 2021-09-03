({
    init:function(component,event,helper){
        helper.initDo(component,event);
    },

    increaseQuantity:function(component,event,helper){
        helper.increaseQuantityHelper(component,event);
    },

    decreaseQuantity:function(component,event,helper){
        helper.decreaseQuantityHelper(component,event);
    },

    deleteProductFromCart:function(component,event,helper){
        helper.deleteProductHelper(component,event);
    }
})