public with sharing class MS_LoyaltyClubHandler {
    @AuraEnabled
    public static Contact getUserContact() {
        String idContact=[SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1].ContactId;
        return [SELECT Name,FirstName,LastName,Phone,Your_interests__c,Tell_about_yourself__c,How_do_you_know_about_us__c,Send_marketing_emails__c,is_Member_Loyalty_Club__c FROM Contact WHERE Id=:idContact LIMIT 1];
    }
    @AuraEnabled
    public static Contact updateContact(Contact con) {
//        MS_ShoppingCartHandler.clearCart();
        if(con.is_Member_Loyalty_Club__c==false){
            con.is_Member_Loyalty_Club__c=true;
        }else{
            con.is_Member_Loyalty_Club__c=false;
        }
        update con;
        return con;
    }
}