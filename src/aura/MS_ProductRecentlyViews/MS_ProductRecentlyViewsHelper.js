({
    initDo:function(component,event){
        this.getRecentlyViewProductsHelper(component,event);
    },

    getRecentlyViewProductsHelper:function(component,event){
         let findItems=component.get("c.getRecentlyViewProduct");
         findItems.setCallback(this,function(response){
         let state=response.getState();
         let result = response.getReturnValue();
         component.set('v.spinner',false);
         if(state === "SUCCESS") {
            console.log(result)
            component.set("v.listProduct",result.listResults);
            component.set("v.userType",result.userType);
          }

         });
         $A.enqueueAction(findItems);
    }
})