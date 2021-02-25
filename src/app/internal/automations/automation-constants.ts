export enum EventType {
    WHEN  = 'when',
    WHEN_EDIT_LEAD_FORM  = 'redirect to lead form page',
    WHEN_EDIT_APPOINTMENT_SCHEDULED = '',
    WHEN_EDIT_APPOINTMENT_CANCELED = '',
    WHEN_EDIT_TAG_ADDED = '',
    WHEN_EDIT_PRODUCT_PURCHASED = '',
    THEN  = 'then',
}

export const Images = {
    greenCloud: "assets/images/cloud-green.svg",
    blueFlash: "assets/images/blue-flash.svg",
    edit: "assets/images/edit-button-gray.svg",
    delete: "assets/images/delete-gray.svg",
    exportBlueIcon: "assets/images/export-blue-icon.svg"
}

export enum AutomationEvents {
    WHEN = 'when',
    WHEN_show_card = 'Show card',
    WHEN_show_suggestions = 'Show When Suggestions',
    THEN = 'then',
    THEN_show_card = 'Add Card Option',
    THNE_show_suggestions = 'Show Then Suggestions'
    
}