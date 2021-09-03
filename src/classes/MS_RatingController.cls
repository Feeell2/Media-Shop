public with sharing class MS_RatingController {
    @AuraEnabled
    public static ResponseRating addRatingToFilm(String id, String userId, String mark) {
        ResponseRating responseRating = new ResponseRating();

        Rating__c[] ratings = [SELECT ID_Product__c,user_id__c,ID,Rating__c FROM Rating__c WHERE user_id__c = :userId AND ID_Product__c = :id];
        if (ratings.size() > 0) {
            for (Rating__c rating : ratings) {
                rating.Rating__c = Decimal.valueOf(mark);
            }
        } else {
            Rating__c rating = new Rating__c();
            rating.ID_Product__c = id;
            rating.user_id__c = userId;
            rating.Rating__c = Decimal.valueOf(mark);
            ratings.add(rating);
        }
        try {
            upsert ratings;
            responseRating.state = 'Success';
            responseRating.rating = ratings.get(0);
            responseRating.message = 'Return Comments';

        } catch (Exception e) {
            responseRating.state = 'Error';
            responseRating.message = e.getMessage();
        }
        return responseRating;
    }

    @AuraEnabled
    public static ResponseAverageRating getRatingToFilm(String id) {
        ResponseAverageRating responseRating = new ResponseAverageRating();
        Decimal averageRating = 0;
        Rating__c[] ratings = [SELECT Rating__c FROM Rating__c WHERE ID_Product__c = :id];
        if (ratings.size() > 0) {
            Decimal sumRating = 0;
            for (Rating__c rating : ratings) {
                sumRating += rating.Rating__c;
            }
            averageRating=sumRating/ratings.size();
        }
        responseRating.state = 'Success';
        responseRating.rating = averageRating;
        responseRating.message = 'Return Rating';
        responseRating.userType = UserInfo.getUserType();
        return responseRating;
    }

    @AuraEnabled
    public static ResponseAverageRating getRatingToUser(String id,String userId) {
        ResponseAverageRating responseRating = new ResponseAverageRating();
        Decimal userRating = 0;
        Rating__c[] ratings = [SELECT Rating__c FROM Rating__c WHERE ID_Product__c = :id AND user_id__c=:userId];
        userRating=ratings.get(0).Rating__c;
        responseRating.state = 'Success';
        responseRating.rating = userRating;
        responseRating.message = 'Return Rating';
        responseRating.userType = UserInfo.getUserType();
        return responseRating;
    }

    public class ResponseRating{
        @AuraEnabled public String state;
        @AuraEnabled public Rating__c rating;
        @AuraEnabled public String message;
        @AuraEnabled public String userType;
    }

    public class ResponseAverageRating{
        @AuraEnabled public String state;
        @AuraEnabled public Decimal rating;
        @AuraEnabled public String message;
        @AuraEnabled public String userType;
    }
}