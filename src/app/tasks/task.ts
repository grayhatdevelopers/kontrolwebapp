export interface ITask{
    Type: string;
    Shop: string;
    Date: string;
    Num: string;
    Rep: string;
    Debit: string;
    Status: string;
    assignedTo: string;
    Transference: string;
    taskType: string;
}

export class Task implements ITask{
    constructor( public Type = '', public Shop = '', public Date = '', public Num = '', public Rep = '', public Debit = '', public Status = '', public assignedTo = '', public Transference = '', public taskType = ''){}
}

export interface CompletedTask{
    Username:string;
    ShopName:string;
    Num:string;
    Type:string;
    Amount:string;
    PaidAmount:string;
    Date:string;
    Time:string;
    Status:string;
    Remarks:string;
    ImageUrl:string;
    location:string;
    deliveredBy:string;
    taskType:string;
}