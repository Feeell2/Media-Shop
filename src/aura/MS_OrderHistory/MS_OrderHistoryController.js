({
    init:function(component,event,helper){
        helper.initDo(component,event);
    },

    navigateToOrder: function(component, event, helper) {
        helper.navigateToOrderHelper(component, event);
    },

    handleCaseFlow : function (component, event,helper) {
        helper.handleCaseFlowHelper(component,event);
    },

    contactUs: function(component, event, helper) {
        helper.contactUsHelper(component, event);
    },
})