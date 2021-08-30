({
    openModel: function(component, event, helper) {
        component.set("v.isModalOpen", true);
    },

    closeModel: function(component, event, helper) {
        component.set("v.isModalOpen", false);
    },

    openModel: function(component, evt, helper) {
        var modalBody;
        $A.createComponent("c:MS_ProductAddOrEditProduct", {
            operationType: 'Add'
        },
           function(content, status) {
               if (status === "SUCCESS") {
                   modalBody = content;
                   component.find('overlayLib').showCustomModal({
                       header: "Create Product",
                       body: modalBody,
                       showCloseButton: false,
                       cssClass: "",
                       closeCallback: function() {
                       }
                   })
               }
        });
    },

//
//    submitDetails: function(component, event, helper) {
//        const action = component.get("c.addProduct");
//        helper.executeQuery(component,event, action);
//    },
//    handleUploadFinished : function (component, event, helper) {
//        helper.handleUploadFinished(component, event);
//    },
//    handleCancelUpload : function(component, event, helper){
//        helper.handleCancelUpload(component);
//    },
//
//    submitPhotos: function(component, event, helper) {
//       const action = component.get("c.addProfilePhoto");
//        helper.addPhotos(component, event,action)
//    },
//
//    setMainPhoto: function(component, event, helper) {
//        let ctarget = event.currentTarget;
//        let id_str = ctarget.dataset.value;
//        const idPhotoToSelected=document.getElementById(id_str);
//        helper.toggleProfilePhoto(component, event,idPhotoToSelected,id_str);
//    },

})