public with sharing class MS_LeadSendOffer {
    @InvocableMethod
    public static void sendEmail (List<Lead> leads) {
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        Lead lead=leads.get(0);
        message.setTargetObjectId(lead.id);
        message.optOutPolicy = 'FILTER';
        message.setUseSignature(false);
        message.setBccSender(false);
        message.setSaveAsActivity(false);
        EmailTemplate emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'Offer To Lead' Limit 1];
        message.setTemplateID(emailTemplate.Id);
        message.toAddresses = new String[]{
                lead.email
        };
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>{
                message
        };
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        if (results[0].success) {
            System.debug('The email was sent successfully.');
        } else {
            System.debug('The email failed to send: '
                    + results[0].errors[0].message);
        }
    }
}