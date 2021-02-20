
export interface Automation {
    isDeleted: boolean;
    _id: string;
    whenEvent: string;
    thenEvents: ThenEvent[];
    addedBy: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface ThenEvent {
    eventData: EventData;
    delayedOptions: DelayedOptions;
    isDelayed: boolean;
    _id: string;
    event: string;
  }
  
  interface DelayedOptions {
    dayInterval: DayInterval;
    timeInterval: TimeInterval;
    delayType: string;
  }
  
  interface TimeInterval {
    value: any[];
    intervalType: string;
  }
  
  interface DayInterval {
    intervalType: string;
    value: string;
  }
  
  interface EventData {
    dataId: string;
  }

export interface EventList {
    eventDescription: string;
    eventName: string;
    img?: string;
}