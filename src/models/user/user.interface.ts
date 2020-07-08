// export class User{
    
//     uuid:string;
//     name:string;
//     email:string;
//     password:string;

//     constructor(){
//         this.uuid = '';
//         this.name = '';
//         this.email = '';
//         this.password = '';
//     }
// } 

interface User {
    _id: String,
    uuid: string;
    name: string;
    email: string;
    password: string;
}
  
export default User;