/**
 * Google Authentication Service
 * Handles login and registration with Google OAuth
 */

export const googleAuthService = {
  /**
   * Handle Google Login Success
   * Decodes JWT token and extracts user info
   */
  handleLoginSuccess: async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      
      // Decode JWT token (without verification - verification should be on backend)
      const decodedToken = parseJwt(token);
      
      console.log('Google Login Success:', decodedToken);
      
      // Send to backend for verification and session creation
      const response = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture
        })
      });

      if (!response.ok) {
        throw new Error('Server error during login');
      }

      const data = await response.json();

      // Store auth token and user info
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;

    } catch (error) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Đăng nhập Google thất bại');
    }
  },

  /**
   * Handle Google Registration Success
   * Decodes JWT token and creates new account
   */
  handleRegisterSuccess: async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      
      // Decode JWT token
      const decodedToken = parseJwt(token);
      
      console.log('Google Register Success:', decodedToken);

      // Generate username from email
      const username = generateUsernameFromEmail(decodedToken.email);

      // Send to backend for registration
      const response = await fetch('/api/auth/google-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          username: username
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error during registration');
      }

      const data = await response.json();

      // Store auth token and user info
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;

    } catch (error) {
      console.error('Google register error:', error);
      throw new Error(error.message || 'Đăng ký Google thất bại');
    }
  },

  /**
   * Logout Google Session
   */
  logout: async () => {
    try {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Optional: Notify backend about logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }).catch(err => console.log('Logout notification failed:', err));

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Đăng xuất thất bại');
    }
  },

  /**
   * Get current user from Google session
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Check if user is logged in with Google
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get auth token
   */
  getToken: () => {
    return localStorage.getItem('authToken');
  }
};

/**
 * Utility function to decode JWT token
 * Note: This doesn't verify the signature - should be done on backend
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    throw new Error('Invalid token format');
  }
}

/**
 * Generate username from email
 * Example: john.doe@gmail.com -> johndoe or john.doe123
 */
function generateUsernameFromEmail(email) {
  let username = email
    .split('@')[0]
    .replace(/[.-]/g, '')
    .toLowerCase();

  // Ensure minimum length
  if (username.length < 3) {
    username = email.split('@')[0].toLowerCase();
  }

  // Add random number if needed
  if (username.length > 20) {
    username = username.substring(0, 20);
  }

  return username;
}
