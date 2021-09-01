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
            helper.showToast(component,event,"Success");
       }
    },

    showToast : function(component, event,typeToast) {
          component.set("v.type", typeToast);
          let childComponent = component.find("toastComponentProductTile");
          let fireToast = childComponent.toast();
    },
})