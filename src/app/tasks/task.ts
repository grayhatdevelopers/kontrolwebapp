export interface ITask{
    assignedTo: string;
    createdAt: string;
    date: string;    
    debit: string;
    lastUpdatedAt: string;
    num: string;
    rep: string;
    shopName: string;
    status: string;
    taskModel: string;
    taskType: string;
    transference: string;
    company: string;
}

export class Task implements ITask{
    constructor(
        
                // public Type = "", 
                // public Shop = "", 
                // public Date = "", 
                // public Num = "", 
                // public Rep = "", 
                // public Debit = "", 
                // public Status = "", 
                // public assignedTo = "", 
                // public Transference = "", 
                // public taskType = ""

                public assignedTo = "",
                public createdAt = "",
                public date = "",  
                public debit = "",
                public lastUpdatedAt = "",
                public num = "",
                public rep = "",
                public shopName = "",
                public status = "",
                public taskModel = "",
                public taskType = "",
                public transference = "",
                public company = "",

                ) {}
    // setType(type:string){ this.Type=type; }
    // setShop(shop:string){ this.Shop=shop; }
    // setDate(date:string){ this.Date=date; }
    // setNum(num:string){ this.Num=num; }
    // setRep(rep:string){ this.Rep=rep; }
    // setDebit(debit:string){ this.Debit=debit; }
    // setStatus(status:string){ this.Status=status; }
    // setAssignedTo(assignedto:string){ this.assignedTo=assignedto; }
    // setTransference(transference:string){ this.Transference=transference; }
    // setTaskType(tasktype:string){ this.taskType=tasktype; }


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