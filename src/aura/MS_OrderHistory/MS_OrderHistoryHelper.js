({
    initDo:function(component,event){
        this.getOrdersHelper(component,event);
    },

    getOrdersHelper:function(component,event){
        let action=component.get('c.getUserOrders');
        action.setCallback(this, function(response){
            let state = response.getState();
            let result = response.getReturnValue();
            if(state==="SUCCESS"){
                console.log(result.results)
                component.set('v.list_products',result.results);
            }
            component.set('v.spinner',false);
        })
        $A.enqueueAction(action);
    },

    handleCaseFlowHelper:function(component,event){
       if(event.getParam("status") === "FINISHED") {
            component.set("v.showOrderHistoryTable", true);

            component.set('v.message',$A.get("$Label.c.Case_Created"));
            this.showToast(component,event,"Success");
       }
    },

    showToast : function(component, event,typeToast) {
          component.set("v.type", typeToast);
          let childComponent = component.find("toastComponentProductTile");
          let fireToast = childComponent.toast();
    },

    contactUsHelper:function(component,event){
        component.set("v.showOrderHistoryTable", false);
        let ctarget = event.currentTarget;
        let orderId = ctarget.dataset.value;
        var flow = component.find('flowData');
        var inputVariables = [
            {name : "orderId", type : "String", value: orderId}
        ];
        flow.startFlow('Create_Case_Order_History', inputVariables);
    },

    navigateToOrderHelper:function(component,event){
        let ctarget = event.currentTarget;
        let orderId = ctarget.dataset.value;
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": orderId,
          "slideDevName": "related"
        });
        navEvt.fire();
    },
})