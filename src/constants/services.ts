/**
 * Services Configuration
 * Central source of truth for all services
 * Replaces 50+ lines of duplicate service lists
 */

import { Building2, Car, Palette, Warehouse, Home } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  label: string;
  icon: any;
  path: string;
  description: string;
  shortDescription: string;
}

export const SERVICES: Service[] = [
  {
    id: 'home-relocation',
    name: 'Home Relocation',
    label: 'Home',
    icon: Home,
    path: '/services/home-relocation',
    description: 'Professional home relocation services for a smooth move',
    shortDescription: 'Residential moving services'
  },
  {
    id: 'office-relocation',
    name: 'Office Relocation',
    label: 'Office',
    icon: Building2,
    path: '/services/office-relocation',
    description: 'Efficient office relocation with minimal downtime',
    shortDescription: 'Commercial moving services'
  },
  {
    id: 'car-relocation',
    name: 'Car Relocation',
    label: 'Car',
    icon: Car,
    path: '/services/car-relocation',
    description: 'Safe and secure vehicle transportation',
    shortDescription: 'Vehicle transport services'
  },
  {
    id: 'fine-art-logistics',
    name: 'Fine Art Logistics',
    label: 'Fine Arts',
    icon: Palette,
    path: '/services/fine-art-logistics',
    description: 'Specialized handling for valuable art and antiques',
    shortDescription: 'Art & antique transport'
  },
  {
    id: 'warehouse-facility',
    name: 'Warehouse Facility',
    label: 'Warehouse',
    icon: Warehouse,
    path: '/services/warehouse-facility',
    description: 'Secure storage solutions for your belongings',
    shortDescription: 'Storage & warehousing'
  }
];

/**
 * Get service by ID
 */
export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(service => service.id === id);
}

/**
 * Get service by path
 */
export function getServiceByPath(path: string): Service | undefined {
  return SERVICES.find(service => service.path === path);
}

/**
 * Get all service names for dropdowns
 */
export function getServiceNames(): string[] {
  return SERVICES.map(service => service.name);
}

/**
 * Get all service options for select fields
 */
export function getServiceOptions(): Array<{ value: string; label: string }> {
  return SERVICES.map(service => ({
    value: service.name,
    label: service.name
  }));
}
