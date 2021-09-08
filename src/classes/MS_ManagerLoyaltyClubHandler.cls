public with sharing class MS_ManagerLoyaltyClubHandler {
    @AuraEnabled
    public static List<User> getMembers(){
        List<User> members=new List<User>();
        members=[SELECT Name,Contact.Id,Contact.is_Member_Loyalty_Club__c,Photo_Id__c FROM User WHERE Contact.is_Member_Loyalty_Club__c=TRUE];
        return members;
    }

    @AuraEnabled
    public static User removeMember(User user){
        Contact contact=[SELECT Id,Name,is_Member_Loyalty_Club__c FROM Contact WHERE id=:user.ContactId Limit 1];
        contact.is_Member_Loyalty_Club__c=false;
        update contact;
        return user;
    }
}