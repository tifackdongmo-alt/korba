import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EscrowStatus = 'EN_ESCROW' | 'LIBERE' | 'REMBOURSE' | 'LITIGE'

export interface EscrowTransaction {
  id: string
  orderId: string
  vendorName: string
  vendorAvatar?: string
  amountCentimes: number
  status: EscrowStatus
  paidAt: string
  releasedAt?: string
  refundedAt?: string
  disputeId?: string
  items: { name: string; qty: number; price: string }[]
  provider: 'orange_money' | 'wave' | 'carte'
}

interface EscrowState {
  transactions: EscrowTransaction[]
  addTransaction: (t: EscrowTransaction) => void
  releaseEscrow: (id: string) => void
  refundEscrow: (id: string) => void
  openDispute: (id: string, disputeId: string) => void
  getById: (id: string) => EscrowTransaction | undefined
  getByOrderId: (orderId: string) => EscrowTransaction | undefined
}

const SEED_TRANSACTIONS: EscrowTransaction[] = [
  {
    id: 'esc-001',
    orderId: 'demo-order',
    vendorName: 'Pharmacie Liberté 6',
    vendorAvatar: 'pharma',
    amountCentimes: 5200,
    status: 'EN_ESCROW',
    paidAt: '2026-05-25T10:30:00',
    items: [
      { name: 'Doliprane 1000mg', qty: 2, price: '1 200 F' },
      { name: 'Spray nasal', qty: 1, price: '2 100 F' },
    ],
    provider: 'orange_money',
  },
  {
    id: 'esc-002',
    orderId: 'KB-2820',
    vendorName: 'Au bon Maquis',
    amountCentimes: 4500,
    status: 'LIBERE',
    paidAt: '2026-05-23T19:42:00',
    releasedAt: '2026-05-23T20:15:00',
    items: [{ name: 'Thiéboudienne royal', qty: 1, price: '4 500 F' }],
    provider: 'wave',
  },
  {
    id: 'esc-003',
    orderId: 'KB-2815',
    vendorName: 'Beauté Dakar',
    amountCentimes: 10300,
    status: 'LITIGE',
    paidAt: '2026-05-22T14:00:00',
    disputeId: 'disp-001',
    items: [
      { name: 'Crème solaire SPF 50', qty: 1, price: '3 800 F' },
      { name: 'Sérum vitamine C', qty: 1, price: '6 500 F' },
    ],
    provider: 'orange_money',
  },
]

export const useEscrowStore = create<EscrowState>()(
  persist(
    (set, get) => ({
      transactions: SEED_TRANSACTIONS,

      addTransaction: (t) =>
        set((s) => ({ transactions: [t, ...s.transactions] })),

      releaseEscrow: (id) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, status: 'LIBERE', releasedAt: new Date().toISOString() } : t,
          ),
        })),

      refundEscrow: (id) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, status: 'REMBOURSE', refundedAt: new Date().toISOString() } : t,
          ),
        })),

      openDispute: (id, disputeId) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, status: 'LITIGE', disputeId } : t,
          ),
        })),

      getById: (id) => get().transactions.find((t) => t.id === id),

      getByOrderId: (orderId) => get().transactions.find((t) => t.orderId === orderId),
    }),
    { name: 'korba-escrow' },
  ),
)
