
export interface Automation {
    automationName: string;
    whenEvent: WhenEvent;
    thenEvents: ThenEvent[];
    addedBy: string;
    workspaceId: string;
    
    isDeleted?: boolean;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    deletedBy?: string;
  }
  
export interface WhenEvent {
    eventName: string;
    eventData: EventData;
  }
  
export interface ThenEvent {
    eventData: EventData;
    delayedOptions: DelayedOptions;
    isDelayed: boolean;
    _id: string;
    event: string;
  }
  
export interface DelayedOptions {
    dayInterval: DayInterval;
    timeInterval: TimeInterval;
    delayType: string;
  }
  
export interface TimeInterval {
    value: any[];
    intervalType: string;
  }
  
export interface DayInterval {
    intervalType: string;
    value: string;
  }
  
export interface EventData {
    dataId: string;
    params: {
      formTag?: string,
      name?: string,
      tagCategoryName?: string
    }
  }

export interface WhenThenEvent {
    eventDescription: string;
    eventName: string;
    img?: string;
}