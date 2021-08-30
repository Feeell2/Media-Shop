({
     afterScriptsLoaded : function(component, event, helper) {
            let domEl = component.find("ratingarea").getElement();
            let currentRating = component.get("v.value");
            let readOnly = component.get("v.readonly");
            let maxRating = 5;

            let callback = function(rating) {
                component.set('v.value', rating);
            }

            component.ratingObj = rating(domEl, currentRating, maxRating, callback, readOnly);
        },

        onValueChange: function(component,event,helper) {
            if (component.ratingObj) {
                let idFilm=component.get('v.idMovie');
                let value = component.get('v.value');
                component.ratingObj.setRating(value,false);
            }
        },

        changeRating: function(component,event,helper) {
            if (component.ratingObj) {
                   let idFilm=component.get('v.idMovie');
                   let userId=$A.get("$SObjectType.CurrentUser.Id");
                   let value = component.get('v.value');
                   component.ratingObj.setRating(value,false);
                   helper.addRatingHelper(component,event,idFilm,userId,value);
            }
        }
})