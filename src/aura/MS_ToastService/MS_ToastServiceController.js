({
    forceToast: function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": component.get("v.type"),
            "title": component.get("v.type"),
            "message": component.get("v.message")
        });
        toastEvent.fire();
    }
})