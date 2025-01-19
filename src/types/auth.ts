export interface User {
  id: string;
  _id: string; // MongoDB ID
  firstName: string;
  lastName: string;
  identityNo: string;
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };
  position: string;
  role: string;
  status: 'ACTIVE' | 'BLOCKED';
  image?: string;
  assignment?: {
    endDate: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  bio?: string;
  skills?: string;
  education?: string;
}
  