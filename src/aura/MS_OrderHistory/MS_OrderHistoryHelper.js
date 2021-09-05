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
    }
})