({
    init:function(component,event,helper){
        helper.getProductsToList(component,event);
//        helper.createOrderHelper(component,event);;
    },

    nextStep:function(component,event,helper){
        helper.next(component,event);
    },

    previousStep:function(component,event,helper){
        helper.previous(component,event);
    },

    setBank: function(component, event, helper) {
        let ctarget = event.currentTarget;
        let id_str = ctarget.dataset.value;
        let element=document.getElementById(id_str);
        helper.toggleUserBank(component, event,element,id_str);
    },

    getContactDetail:function(component,event,helper){
        helper.getContactDetailHelper(component,event);
    },

    deliveryMethodHandlerHelper:function(component,event){
        component.set('v.deliveryMethod',component.find('deliveryMethod').get('v.value'));
        component.set('v.dataToDelivery.deliveryMethod',component.find('deliveryMethod').get('v.value'));
    },

    paymentMethodHandlerHelper:function(component,event){
        component.set('v.paymentMethod',component.find('paymentMethod').get('v.value'));
        component.set('v.dataToDelivery.paymentMethod',component.find('paymentMethod').get('v.value'));
    },

    saveOrderHandler:function(component,event,helper){
        helper.saveOrderHelper(component,event);
    },

    showConfirmDialog:function(component,event,helper){
        component.set('v.isDisplayDialog',true);
    },

    hideConfirmDialog:function(component,event,helper){
        component.set('v.isDisplayDialog',false);
    },

})