import { Tutorial } from './tutorial.model';
export class User {
  id?: any;
  email?: string;
  name?: string;
  surname?: string;
  password?: string;
  company?: any;
  tests?: [any];
  active?: boolean;
  isCompany?: boolean;
  admin?: boolean;
  roles?: [];
}
