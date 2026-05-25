import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DisputeStatus = 'OUVERT' | 'EN_COURS' | 'RESOLU' | 'REJETE'

export interface Dispute {
  id: string
  orderId: string
  escrowId?: string
  vendorName: string
  reason: string
  description: string
  status: DisputeStatus
  createdAt: string
  updatedAt: string
  resolution?: string
  agentName?: string
  messages: { id: number; text: string; from: 'client' | 'agent' | 'vendor'; time: string }[]
}

interface DisputesState {
  disputes: Dispute[]
  openDispute: (d: Omit<Dispute, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'messages'>) => string
  addMessage: (disputeId: string, msg: { text: string; from: 'client' | 'agent' | 'vendor' }) => void
  updateStatus: (id: string, status: DisputeStatus, resolution?: string) => void
  getById: (id: string) => Dispute | undefined
}

const SEED: Dispute[] = [
  {
    id: 'disp-001',
    orderId: 'KB-2815',
    escrowId: 'esc-003',
    vendorName: 'Beauté Dakar',
    reason: 'produit_abime',
    description: 'La crème solaire est ouverte et son emballage est endommagé. Le flacon a coulé.',
    status: 'EN_COURS',
    createdAt: '2026-05-22T16:30:00',
    updatedAt: '2026-05-23T10:00:00',
    agentName: 'Awa Sarr',
    messages: [
      { id: 1, from: 'client', text: 'La crème solaire est ouverte et a coulé. Je ne peux pas l\'utiliser.', time: '22 mai 16:30' },
      { id: 2, from: 'agent', text: 'Bonjour, je suis Awa, agent Korba. Pouvez-vous nous envoyer une photo du produit ?', time: '23 mai 09:45' },
      { id: 3, from: 'client', text: 'Photo envoyée. C\'est vraiment endommagé.', time: '23 mai 10:00' },
    ],
  },
]

export const useDisputesStore = create<DisputesState>()(
  persist(
    (set, get) => ({
      disputes: SEED,

      openDispute: (d) => {
        const id = `disp-${Date.now()}`
        const now = new Date().toISOString()
        set(s => ({
          disputes: [
            {
              ...d,
              id,
              status: 'OUVERT',
              createdAt: now,
              updatedAt: now,
              messages: [
                { id: 1, from: 'client', text: d.description, time: new Date().toLocaleString('fr', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) },
              ],
            },
            ...s.disputes,
          ],
        }))
        return id
      },

      addMessage: (disputeId, msg) =>
        set(s => ({
          disputes: s.disputes.map(d =>
            d.id === disputeId
              ? {
                  ...d,
                  messages: [...d.messages, { id: Date.now(), ...msg, time: new Date().toLocaleString('fr', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }],
                  updatedAt: new Date().toISOString(),
                }
              : d,
          ),
        })),

      updateStatus: (id, status, resolution) =>
        set(s => ({
          disputes: s.disputes.map(d =>
            d.id === id ? { ...d, status, resolution, updatedAt: new Date().toISOString() } : d,
          ),
        })),

      getById: (id) => get().disputes.find(d => d.id === id),
    }),
    { name: 'korba-disputes' },
  ),
)
