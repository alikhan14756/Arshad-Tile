import { auth, isDemoMode } from './config';
import { localAdmin } from './localAdmin';
import { 
  signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'firebase/auth';

const DEMO_USER = localAdmin
  ? { uid: localAdmin.uid, email: localAdmin.email, displayName: localAdmin.displayName || 'Showroom Admin', role: 'admin' }
  : {
      uid: 'demo-admin-uid',
      email: 'admin@arshadtiles.com',
      displayName: 'Showroom Admin',
      role: 'admin'
    };

export const authManager = {
  async login(email, password) {
    if (isDemoMode) {
      const validEmail = DEMO_USER.email;
      const validPassword = localAdmin ? localAdmin.password : 'admin123';
      if (email === validEmail && password === validPassword) {
        sessionStorage.setItem('arshad_admin_session', JSON.stringify(DEMO_USER));
        if (this._onAuthChangeCallback) {
          this._onAuthChangeCallback(DEMO_USER);
        }
        return DEMO_USER;
      } else {
        throw new Error(`Invalid demo credentials! Use ${validEmail} and the configured password.`);
      }
    }

    const credentials = await signInWithEmailAndPassword(auth, email, password);
    // Custom claims checking will be done inside Router or page layout
    return credentials.user;
  },

  async logout() {
    if (isDemoMode) {
      sessionStorage.removeItem('arshad_admin_session');
      if (this._onAuthChangeCallback) {
        this._onAuthChangeCallback(null);
      }
      return true;
    }
    await signOut(auth);
    return true;
  },

  getCurrentUser() {
    if (isDemoMode) {
      const sess = sessionStorage.getItem('arshad_admin_session');
      return sess ? JSON.parse(sess) : null;
    }
    return auth.currentUser;
  },

  onAuthChange(callback) {
    this._onAuthChangeCallback = callback;
    if (isDemoMode) {
      const user = this.getCurrentUser();
      callback(user);
      // Return unsubscribe mock
      return () => {
        this._onAuthChangeCallback = null;
      };
    }

    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch custom token claim to confirm admin role
        try {
          const idTokenResult = await user.getIdTokenResult();
          const role = idTokenResult.claims.role || 'user';
          callback({ ...user, role });
        } catch (e) {
          callback({ ...user, role: 'user' });
        }
      } else {
        callback(null);
      }
    });
  }
};
