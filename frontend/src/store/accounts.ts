import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'client' | 'vendor' | 'agency' | 'driver'

export interface BaseAccount {
  id: string
  role: Role
  phone: string
  firstName: string
  lastName: string
  city: string
  email?: string
  avatar?: string
  createdAt: string
  verified: boolean
}

export interface ClientAccount extends BaseAccount {
  role: 'client'
  defaultAddress: string
  paymentMethod: 'orange_money' | 'wave' | 'carte'
}

export interface VendorAccount extends BaseAccount {
  role: 'vendor'
  shopName: string
  category: string
  shopAddress: string
  openingHours: string
  description: string
}

export interface AgencyAccount extends BaseAccount {
  role: 'agency'
  agencyName: string
  zone: string
  fleetSize: number
  vehicleTypes: string[]
  baseFee: number
}

export interface DriverAccount extends BaseAccount {
  role: 'driver'
  vehicle: 'Moto' | 'Vélo' | 'Voiture' | 'À pied'
  licenseNumber: string
  zone: string
  agencyId?: string
}

export type Account = ClientAccount | VendorAccount | AgencyAccount | DriverAccount

interface AccountsState {
  accounts: Account[]
  addAccount: (account: Account) => void
  removeAccount: (id: string) => void
  findByPhone: (phone: string) => Account | undefined
  byRole: (role: Role) => Account[]
  clear: () => void
}

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set, get) => ({
      accounts: [],

      addAccount: (account) =>
        set(s => ({ accounts: [...s.accounts, account] })),

      removeAccount: (id) =>
        set(s => ({ accounts: s.accounts.filter(a => a.id !== id) })),

      findByPhone: (phone) =>
        get().accounts.find(a => a.phone === phone),

      byRole: (role) =>
        get().accounts.filter(a => a.role === role),

      clear: () => set({ accounts: [] }),
    }),
    { name: 'korba-accounts' },
  ),
)
