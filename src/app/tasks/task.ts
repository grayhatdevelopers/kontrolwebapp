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
    constructor(public Type = "", 
                public Shop = "", 
                public Date = "", 
                public Num = "", 
                public Rep = "", 
                public Debit = "", 
                public Status = "", 
                public assignedTo = "", 
                public Transference = "", 
                public taskType = "") {}
    setType(type:string){ this.Type=type; }
    setShop(shop:string){ this.Shop=shop; }
    setDate(date:string){ this.Date=date; }
    setNum(num:string){ this.Num=num; }
    setRep(rep:string){ this.Rep=rep; }
    setDebit(debit:string){ this.Debit=debit; }
    setStatus(status:string){ this.Status=status; }
    setAssignedTo(assignedto:string){ this.assignedTo=assignedto; }
    setTransference(transference:string){ this.Transference=transference; }
    setTaskType(tasktype:string){ this.taskType=tasktype; }
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