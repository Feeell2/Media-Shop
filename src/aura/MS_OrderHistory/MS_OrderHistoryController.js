({
    init:function(component,event,helper){
        helper.initDo(component,event);
    },

    navigateToOrder: function(component, event, helper) {
        let ctarget = event.currentTarget;
        let orderId = ctarget.dataset.value;
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": orderId,
          "slideDevName": "related"
        });
        navEvt.fire();
    },

    handleCaseFlow : function (component, event,helper) {
        helper.handleCaseFlowHelper(component,event);
    },

    contactUs: function(component, event, helper) {
        component.set("v.showOrderHistoryTable", false);
        let ctarget = event.currentTarget;
        let orderId = ctarget.dataset.value;
        var flow = component.find('flowData');
        var inputVariables = [
            {name : "orderId", type : "String", value: orderId}
        ];
        flow.startFlow('Create_Case_in_Order_History', inputVariables);
    },
})