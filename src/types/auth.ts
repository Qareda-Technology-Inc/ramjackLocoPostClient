export interface LoginResponse {
    token: string;
    user: {
      id: string;
      name: string;
      role: string;
    };
  }
  
  export interface LoginRequest {
    employeeId: string;
    password: string;
  }

  interface contactInfo {
    email: string,
    phone: string,
  }
  export interface User {
    _id: string;
    [x: string]: string | contactInfo;
    IdentityNo: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    role: string;
    avatar: string;
    contactInfo: contactInfo;
    password: string,
    position: string,
  }
  