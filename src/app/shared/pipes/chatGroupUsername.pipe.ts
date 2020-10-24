import { ReturnStatement } from '@angular/compiler';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatGroupUsername'
})
export class chatGroupUsernamePipe implements PipeTransform {
  transform(id: string, data , args?: any): any {
    console.log('id and data..........',id , data)
    data.users.map((user) => {
        if(user._id !== id){
            console.log('in else............',user.fullName)
            return user.fullName
        }
    })
  }
}
