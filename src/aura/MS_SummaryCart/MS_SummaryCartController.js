({
    init:function(component,event,helper){
        helper.initDo(component,event);
    },

     navigate : function(component, event, helper) {
            let address = '/summaryorder';
            let urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
              "url": address,
            });
            urlEvent.fire();
          },

})