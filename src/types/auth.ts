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
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  bio?: string;
  currentSite?: {
    _id: string;
    name?: string;
    location?: string;
    country?: string;
    image?: string;
  };
  assignments?: {
    site?: {
      name?: string;
      location?: string;
      country?: string;
    };
    startDate?: string;
    endDate?: string;
  }[];
}
  