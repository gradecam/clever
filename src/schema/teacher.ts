import {Credentials} from './credentials';
import {Name} from './name';

/**
 * Teacher details
 */
export interface Teacher {
  id: string;
  created: string;
  credentials: Credentials;
  district: string;
  email: string;
  last_modified: string;
  name: Name;
  school: string;  // primary school association
  schools: string[];
  sis_id: string;
  state_id: string;
  teacher_number: string;
  title: string;
}
