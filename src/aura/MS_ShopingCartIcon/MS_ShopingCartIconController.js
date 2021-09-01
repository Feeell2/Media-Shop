({
    navigate : function(component, event, helper) {
        helper.navigateHelper(component, event);
    },

    recalculateQuantity:function(component,event,helper){
        helper.getProductsToRecalculate(component,event);
    },
})