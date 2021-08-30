({
       navigate : function(component, event, helper) {
        let address = '/shoping-cart';
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": address,
        });
        urlEvent.fire();
      }
})