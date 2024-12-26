import { create } from 'zustand'; // Importing zustand to create the state store
import { immer } from 'zustand/middleware/immer'; // Importing immer middleware for immutable state updates
import { persist } from 'zustand/middleware/persist'; // Importing persist middleware to persist the state
import { AppwriteException, Models } from 'appwrite'; // Importing Appwrite types for handling exceptions and user models
import { account } from '@/models/client/config'; // Importing Appwrite account configuration

// Interface representing the user preferences
export interface UserPrefs {
  reputation: number; // The user's reputation
}

// Interface representing the authentication store's state and actions
interface IAuthStores {
  session: Models.User | null; // The current user's session or null if there's no session
  jwt: string | null; // JWT token or null if not authenticated
  user: Models.User | null; // The user data or null
  hydrated: boolean; // Indicates whether the store state is rehydrated from localStorage

  setHydrated(): void; // Method to set the hydrated state
  verifySession(): Promise<void>; // Method to verify if the session is valid
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>; // Method to log the user in
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>; // Method to create a new user account
  logout(): Promise<void>; // Method to log the user out
}

// Creating the Zustand store using the IAuthStores interface
export const useAuthStore = create<IAuthStores>()(
  persist(
      immer<IAuthStores>((set, get) => ({
        // Initial state
        session: null, // No active session initially
        jwt: null, // No JWT initially
        user: null, // No user data initially
        hydrated: false, // Not hydrated initially
  
        // Action to set the hydrated state to true
        setHydrated: () => set({ hydrated: true }),
  
        // Action to verify the session
        verifySession: async () => {
          const session = get().session; // Get the current session from the store
          if (!session) { // If there's no active session, throw an error
            throw new Error('No active session');
          }
          try {
            // Make an Appwrite API call to verify the session or JWT token
            const user = await account.get(); // Get user data from Appwrite account
            set({ user }); // Update the store with the user data
          } catch (error) {
            // Log any error that occurs during session verification
            console.error('Session verification failed:', error);
          }
        },
  
        // Action to log the user in
        login: async (email: string, password: string) => {
          try {
            // Create a new session with the provided email and password
            const response = await account.createEmailSession(email, password);
            set({
              session: response, // Store the session object
              jwt: response.jwt, // Store the JWT token
              user: response.user, // Store the user data
            });
            return { success: true }; // Return success
          } catch (error) {
            // Handle errors related to login, especially AppwriteExceptions
            if (error instanceof AppwriteException) {
              return { success: false, error }; // Return the error if it's an AppwriteException
            }
            return { success: false, error: null }; // Return null error for other types of errors
          }
        },
  
        // Action to create a new user account
        createAccount: async (name: string, email: string, password: string) => {
          try {
            // Create a new user account with the provided name, email, and password
            const response = await account.create('unique()', email, password, name);
            return { success: true }; // Return success if the account is created successfully
          } catch (error) {
            // Handle errors related to account creation, especially AppwriteExceptions
            if (error instanceof AppwriteException) {
              return { success: false, error }; // Return the error if it's an AppwriteException
            }
            return { success: false, error: null }; // Return null error for other types of errors
          }
        },
  
        // Action to log the user out
        logout: async () => {
          try {
            // Delete the current session using Appwrite's API
            await account.deleteSession('current');
            // Clear the session, jwt, and user data from the store
            set({ session: null, jwt: null, user: null });
          } catch (error) {
            // Log any error that occurs during logout
            console.error('Logout failed:', error);
          }
        },
      })),
      {
        name: 'auth', // The key used for persisting the state in localStorage
        onRehydrateStorage: (state, error) => {
          // This function is triggered when the state is rehydrated from storage
          if (!error && state) {
            state.setHydrated(); // Set the store as hydrated if there's no error
          }
        },
      }
    )
);
