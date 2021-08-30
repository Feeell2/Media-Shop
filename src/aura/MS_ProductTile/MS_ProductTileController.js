({
      createRecord : function (component, event) {
          this.getProductsToList(component, event);
          var navEvt = $A.get("e.force:navigateToSObject");
          navEvt.setParams({
            "recordId": component.get("v.product.Product2.Id"),
            "slideDevName": "related"
          });
          navEvt.fire();
      },

      addProductToCart:function(component,event,helper){
            helper.addToCartHelper(component,event);
      },

      getProductsToList:function(component,event,helper){
            helper.getProductsToListHelper(component,event);
      },



  })