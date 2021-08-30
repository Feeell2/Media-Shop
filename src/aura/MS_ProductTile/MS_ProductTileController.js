({
      createRecord : function (component, event) {
          var appEvent = $A.get("e.c:aeEvent");
          var navEvt = $A.get("e.force:navigateToSObject");
          navEvt.setParams({
            "recordId": component.get("v.product.Product2.Id"),
            "slideDevName": "related"
          });
          navEvt.fire();
          this.getProductsToList(component, event);
      },

      addProductToCart:function(component,event,helper){
            helper.addToCartHelper(component,event);
      },

      getProductsToList:function(component,event,helper){
            helper.getProductsToListHelper(component,event);
      },



  })