public with sharing class MS_Comment {

    @AuraEnabled
    public static ResponseComments addComment(String id, String userId, String text) {
        Comment__c comment = new Comment__c();
        User user=new User();
        comment.Id_Product__c = id;
        comment.user_id__c = userId;
        comment.text__c = text;
        comment.Created_Date__c = Datetime.now();
        ResponseComments responseComment = new ResponseComments();
        try {
            user = [SELECT Id,Name,Photo_Id__c FROM User WHERE id = :userId][0];
            comment.UsernName__c = user.Name;
            comment.User_Photo_ID__c=user.Photo_Id__c;
            insert comment;
            responseComment.state = 'Success';
            responseComment.message = 'Add comment';
        } catch (DmlException e) {
            responseComment.state = 'Error';
            responseComment.message = e.getMessage();
        }
        return responseComment;
    }

    @AuraEnabled
    public static ResponseComments getComments(String id) {
        ResponseComments responseComment = new ResponseComments();
        List<Comment__c> comments = new List<Comment__c>();
        try {
            System.debug(id);
            comments = [SELECT Id_Product__c,User_Photo_ID__c,Created_Date__c,text__c,UsernName__c,RatingValue__c FROM Comment__c WHERE Id_Product__c = :id ORDER By Created_Date__c DESC];
            System.debug(comments);
            responseComment.state = 'Success';
            responseComment.message = 'Return Comments';
            responseComment.listComments = comments;
            responseComment.userType = UserInfo.getUserType();
        } catch (Exception e) {
            responseComment.state = 'Error';
            responseComment.message = e.getMessage();
        }
        return responseComment;
    }

    public class ResponseComments{
        @AuraEnabled public String state;
        @AuraEnabled public List<Comment__c> listComments;
        @AuraEnabled public String message;
        @AuraEnabled public String userType;
    }
}