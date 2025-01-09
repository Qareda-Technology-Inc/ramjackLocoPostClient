// // src/api/fetchUser.ts

// interface UserResponse {
//     role: string;
//     success: boolean;
//     message: string;
//   }
  
//   export const fetchUserRole = async (): Promise<UserResponse | null> => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         return null; // If no token is found in localStorage, return null
//       }
  
//       const response = await fetch('/api/user-role', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`, // Pass token in headers
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to fetch user role');
//       }
  
//       const data: UserResponse = await response.json();
      
//       if (!data.success) {
//         return null; // If the response is not successful, return null
//       }
  
//       return data; // Return the role data from the API
  
//     } catch (error) {
//       console.error('Error fetching user role:', error);
//       return null; // If an error occurs, return null
//     }
//   };
  

// src/utils/fetchUser.ts

export const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
  
      const response = await fetch("/api/user-role", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (data && data.role) {
        return data.role; // Return the role fetched from API
      }
  
      throw new Error("Role not found in response");
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null; // Return null if there is an error
    }
  };
  