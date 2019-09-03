export interface IUser {
    email:string;
    password:string;
    displayName:string;
    photoUrl:string;
    role:string;
    isOnline:boolean;
    collectedAmount:number;
    totalAmount:number;
    REP:string;
}

export class User {
    constructor (
        public email = '',
        public password = '',
        public displayName = '',
        public photoUrl = '',
        public role = '', 
        public isOnline = false,
        public collectedAmount = 0,
        public totalAmount = 0,
        public REP = ''
    ){}


}