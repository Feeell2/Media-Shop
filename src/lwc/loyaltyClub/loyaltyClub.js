import { LightningElement,wire,track,api } from 'lwc';
import getUserContact from '@salesforce/apex/MS_LoyaltyClubHandler.getUserContact';
import updateContact from '@salesforce/apex/MS_LoyaltyClubHandler.updateContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord,getRecordNotifyChange } from 'lightning/uiRecordApi';
import joinToOurClub from '@salesforce/label/c.Join_a_loyalty_club';
import joinedToClub from '@salesforce/label/c.You_joined_the_club';
import success from '@salesforce/label/c.Success';
import join from '@salesforce/label/c.Join';
import leave from '@salesforce/label/c.Leave';
import leftTheClub from '@salesforce/label/c.You_left_the_club';


export default class LoyaltyClub extends LightningElement {
    label = {
            joinToOurClub,
            success,
            joinedToClub,
            join,
            leave,
            leftTheClub,
        };
    @track isSpinner = false;
    @track contactObject;
    @track isReadOnly=false;
     @api recordId;
    connectedCallback() {
        this.isSpinner = true;
        this.loadContact();
    }

    loadContact() {
        getUserContact()
            .then(result => {
                if(result!=null){
                    this.isSpinner=false;
                }
                this.contactObject = result;
                if(result.is_Member_Loyalty_Club__c==true){
                    this.isReadOnly=true;
                }else{
                    this.isReadOnly=false;
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    updateCon() {
        this.isSpinner = true;
        updateContact({ con: { ...this.contactObject, sobjectType: 'Contact' } })
            .then((con) => {
                if(con.is_Member_Loyalty_Club__c==true){
                     this.dispatchEvent(
                        new ShowToastEvent({
                            title: this.label.success,
                            message: this.label.joinedToClub,
                            variant: 'success'
                        })
                     );
                }else{
                     this.dispatchEvent(
                        new ShowToastEvent({
                            title: this.label.success,
                            message: this.label.leftTheClub,
                            variant: 'success'
                        })
                     );
                }

                getRecordNotifyChange([{recordId: this.recordId}]);
                 this.loadContact();
                 this.isSpinner = false;
            })
            .catch((err) => console.error(err));

    }
}