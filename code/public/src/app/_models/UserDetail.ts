/**
 * Created by cant on 12/7/16.
 */
import { User } from './User';

export class UserDetail extends User {
  constructor (
    public id: number,
    public email: string,
    public password: string,
    public name: string,
    public surname: string
  ) {
    super(email, password);
  }

}
