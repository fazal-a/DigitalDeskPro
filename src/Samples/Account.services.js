import { useState, createContext } from 'react';
import { User } from '../models/user';
import { environment } from '../environments/environment';
import { PresenceService } from './presence.service';

const baseUrl = environment.apiUrl;

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(null);

  const presenceService = new PresenceService();

  const login = (model: any) => {
    return fetch(baseUrl + 'Account/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(model)
    })
    .then(response => response.json())
    .then(data => {
      const user = data as User;
      if (user) {
        setCurrentUser(user);
        presenceService.createHubConnection(user);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    presenceService.stopHubConnection();
  };

  const register = (model: any) => {
    return fetch(baseUrl + 'Account/register', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(model)
    })
    .then(response => response.json())
    .then(data => {
      const user = data as User;
      if (user) {
        setCurrentUser(user);
        presenceService.createHubConnection(user);
      }
      return user;
    });
  };

  const getDecodedToken = (token: string) => {
    return JSON.parse(atob(token.split('.')[1]));
  };

  return (
    <AccountContext.Provider value={{ currentUser, login, logout, register, getDecodedToken }}>
      {children}
    </AccountContext.Provider>
  );
};
