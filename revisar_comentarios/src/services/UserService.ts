// shared/services/userService.ts
import { adaptUser } from '@/services/adapters/UserAdapter';
import type { AdaptedUser } from '@/types/HomePage.types';

// Crear instancia de Axios con baseURL ficticia
// import axios from 'axios';
// const mockAxios = axios.create({
//   baseURL: 'https://mock.api', // opcional, no se usará en mocks locales
// });

// Simular un servicio usando Promise
export const getUserMock = (): Promise<AdaptedUser> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockResponse = {
        first_name: 'Prueba',
        last_name: 'Servicio',
        age: 30,
      };
      resolve(adaptUser(mockResponse));
    }, 500); // simulamos tiempo de red
  });
};
