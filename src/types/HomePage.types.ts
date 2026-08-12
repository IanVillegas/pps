// Lo que viene del backend
export interface RawUser {
  first_name: string;
  last_name: string;
  age: number;
}

// Lo que usa el frontend
export interface AdaptedUser {
  fullName: string;
  age: number;
}
