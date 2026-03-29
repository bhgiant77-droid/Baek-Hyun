export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface Portfolio {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: "pending" | "contacted" | "completed";
  createdAt: string;
}

export interface Settings {
  siteName: string;
  primaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface User {
  uid: string;
  email: string;
  role: "admin" | "user";
}
