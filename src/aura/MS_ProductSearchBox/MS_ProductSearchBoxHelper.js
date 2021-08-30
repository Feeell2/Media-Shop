({
    doInit:function(component,event){
    let findItems=component.get("c.getProducts");
    findItems.setCallback(this,function(response){
       let state=response.getState();
       let result = response.getReturnValue();
       if(state === "SUCCESS") {
          component.set("v.searchResult",result);
          component.set('v.spinner',false);
        }
    });
    $A.enqueueAction(findItems);
    },

    doSearch:function(component,event){
          let findItems=component.get("c.searchProducts");
          component.set('v.spinner',true);
          findItems.setParams({
              'name': component.get('v.name'),
              'brand':component.get('v.brand'),
              'model':component.get('v.model'),
              'minPrice':component.get('v.minPrice'),
              'maxPrice':component.get('v.maxPrice'),
          })

          findItems.setCallback(this,function(response){
             let state=response.getState();
             let result = response.getReturnValue();
             if(state === "SUCCESS") {
                component.set("v.searchResult",result);
                component.set('v.spinner',false);
              }
          });
          $A.enqueueAction(findItems);
    }
})