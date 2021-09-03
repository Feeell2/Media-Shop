({
        init : function(component, event, helper){
             let recordId=component.get("v.recordId");
             if(recordId!==undefined){
               helper.getProductHelper(component,event,recordId);
               component.set("v.isEditProduct",true);
             }
        },
        closeModel: function(component, event, helper) {
            component.find("overlayLib").notifyClose();
        },

        submitDetails: function(component, event, helper) {
            let recordId=component.get("v.recordId");
            const action = component.get("c.addProduct");
            if(recordId!==undefined){
                helper.updateRecord(component, event,recordId);
            }else{
                helper.executeQuery(component,event, action);
            }
        },
        onDeleteMode: function(component,event){
            $A.get('e.force:refreshView').fire();
        },
        handleUploadFinished : function (component, event, helper) {
            let recordId=component.get("v.recordId");
            helper.handleUploadFinished(component, event, recordId);
        },

        handleCancelUpload : function(component, event, helper){
            let recordId=component.get("v.recordId");
            helper.handleCancelUpload(component,recordId);
        },

        submitPhotos: function(component, event, helper) {
           const action = component.get("c.addProfilePhoto");
           helper.addPhotos(component, event, action);
        },

        editPhotos:function(component,event,helper){
            let recordId=component.get("v.recordId");
            helper.getAllPhotos(component,event,recordId);
        },

        setMainPhoto: function(component, event, helper) {
            let ctarget = event.currentTarget;
            let id_str = ctarget.dataset.value;
            let element=document.getElementById(id_str);
            helper.toggleProfilePhoto(component, event,element,id_str);
        },
        deletePhotoSelected: function(component, event, helper) {
            let recordId=component.get("v.recordId");
            let idToDelete=component.get('v.isDeletePhotos');
                helper.deletePhotoMethod(component, event,idToDelete,recordId);
            },
})