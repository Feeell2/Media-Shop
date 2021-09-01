({
    getAverageMovieRating:function(component,event,id,callback){
        let getRatingMethod=component.get("c.getRatingToFilm");
        getRatingMethod.setParams({
            'id': id
        })
        getRatingMethod.setCallback(this,function(response){
           let state=response.getState();
           let result = response.getReturnValue();
           if(state === "SUCCESS") {
              console.log(result)
              component.set("v.averageRating",JSON.parse(JSON.stringify(result.rating)));
              component.set('v.userType',JSON.parse(JSON.stringify(result.userType)));
            }
        });
        $A.enqueueAction(getRatingMethod);
    },

    getUserMovieRating:function(component,event,id,userId,callback){
        let getUserRatingMethod=component.get("c.getRatingToUser");
        getUserRatingMethod.setParams({
            'id': id,
            'userId':userId
        })
        getUserRatingMethod.setCallback(this,function(response){
           let state=response.getState();
           let result = response.getReturnValue();
           if(state === "SUCCESS") {
              component.set("v.userRating",JSON.parse(JSON.stringify(result.rating)));
              component.set('v.userType',JSON.parse(JSON.stringify(result.userType)));
            }
        });
        $A.enqueueAction(getUserRatingMethod);
    },

})