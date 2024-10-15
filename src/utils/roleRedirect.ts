export const redirectToPage = (userRole: string): string => {
    const roleRoutes: { [key: string]: string } = {
      'ADMIN': '/',
      'MANAGER': '/',
      'PRESIDENT': '/',
      'FIELD-ENGINEER': '/',
      'FIELD-TECHNICIAN': '/',
      'SITE-REP': '/',
    };
    return roleRoutes[userRole] || '/users/profile';
  };
  