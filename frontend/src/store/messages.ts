import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: number
  text: string
  from: 'me' | 'other'
  time: string
  isDispute?: boolean
}

export interface Conversation {
  id: string
  name: string
  avatar: string
  role: 'client' | 'vendor' | 'driver' | 'agency' | 'support'
  phone?: string
  online: boolean
  lastMessage: string
  lastTime: string
  unread: number
  pinned?: boolean
  orderRef?: string
  messages: Message[]
}

interface MessagesState {
  conversations: Record<string, Conversation>
  addMessage: (convId: string, msg: Message) => void
  markAsRead: (convId: string) => void
  getList: () => Conversation[]
}

const SEED: Record<string, Conversation> = {
  boutique: {
    id: 'boutique',
    name: 'Pharmacie Liberté 6',
    avatar: '💊',
    role: 'vendor',
    phone: '+221 33 824 12 34',
    online: true,
    lastMessage: 'Parfait, votre commande est prête. À tout à l\'heure 👍',
    lastTime: '10:35',
    unread: 0,
    orderRef: 'demo-order',
    messages: [
      { id: 1, text: 'Bonjour ! Je souhaite commander du Doliprane 1000mg × 2.', from: 'me', time: '10:32' },
      { id: 2, text: 'Bonjour ! Bien reçu. Le stock est disponible. Prix : 1 200 F × 2 = 2 400 F.', from: 'other', time: '10:33' },
      { id: 3, text: 'Oui, confirmé. Je viens en retrait dans 30 min.', from: 'me', time: '10:34' },
      { id: 4, text: 'Parfait, votre commande est prête. À tout à l\'heure 👍', from: 'other', time: '10:35' },
    ],
  },
  driver: {
    id: 'driver',
    name: 'Cheikh Ndao',
    avatar: '🏍️',
    role: 'driver',
    phone: '+221 77 930 22 18',
    online: true,
    lastMessage: 'Bâtiment B, 3ème étage. Je descends.',
    lastTime: '14:21',
    unread: 2,
    pinned: true,
    orderRef: 'demo-order',
    messages: [
      { id: 1, text: 'Bonjour, j\'arrive dans environ 8 minutes.', from: 'other', time: '14:12' },
      { id: 2, text: 'Ok, je vous attends en bas de l\'immeuble.', from: 'me', time: '14:13' },
      { id: 3, text: 'Je suis en bas. Appartement ?', from: 'other', time: '14:20' },
      { id: 4, text: 'Bâtiment B, 3ème étage. Je descends.', from: 'me', time: '14:21' },
    ],
  },
  'vendor-boutique': {
    id: 'vendor-boutique',
    name: 'Fatou Diallo',
    avatar: '👤',
    role: 'client',
    phone: '+221 77 412 89 03',
    online: false,
    lastMessage: 'Oui, le spray nasal est aussi disponible. Montant : 3 300 F.',
    lastTime: '11:07',
    unread: 1,
    orderRef: 'KB-2841',
    messages: [
      { id: 1, text: 'Bonjour ! Je souhaite passer en retrait physique pour le Doliprane.', from: 'other', time: '11:00' },
      { id: 2, text: 'Bonjour Fatou ! C\'est noté. Quel est votre horaire de passage ?', from: 'me', time: '11:02' },
      { id: 3, text: 'Je serai là vers 14h30. Vous avez le Spray nasal aussi ?', from: 'other', time: '11:05' },
      { id: 4, text: 'Oui, le spray nasal est aussi disponible. Montant : 3 300 F.', from: 'me', time: '11:07' },
    ],
  },
  'DEL-881': {
    id: 'DEL-881',
    name: 'Fatou Diallo',
    avatar: '👤',
    role: 'client',
    phone: '+221 77 412 89 03',
    online: true,
    lastMessage: 'Noté, merci !',
    lastTime: '14:12',
    unread: 0,
    orderRef: 'DEL-881',
    messages: [
      { id: 1, text: 'Bonjour Fatou, je suis votre livreur. Je serai là dans 10 min.', from: 'me', time: '14:10' },
      { id: 2, text: 'Bonjour ! Je vous attends. Sonnez à l\'interphone 3B.', from: 'other', time: '14:11' },
      { id: 3, text: 'Noté, merci !', from: 'me', time: '14:12' },
    ],
  },
  'DEL-879': {
    id: 'DEL-879',
    name: 'Mamadou Sarr',
    avatar: '👤',
    role: 'client',
    phone: '+221 76 238 10 44',
    online: false,
    lastMessage: 'Super, j\'attends votre arrivée.',
    lastTime: '12:01',
    unread: 0,
    orderRef: 'DEL-879',
    messages: [
      { id: 1, text: 'Bonjour, je suis en route pour votre commande Au bon Maquis.', from: 'me', time: '12:00' },
      { id: 2, text: 'Super, j\'attends votre arrivée.', from: 'other', time: '12:01' },
    ],
  },
  'agency-cheikh': {
    id: 'agency-cheikh',
    name: 'Cheikh Ndao',
    avatar: '🏍️',
    role: 'driver',
    phone: '+221 77 930 22 18',
    online: true,
    lastMessage: 'Récupération chez Pharmacie Liberté 6, livraison à Sacré-Cœur.',
    lastTime: '13:02',
    unread: 0,
    messages: [
      { id: 1, text: 'Cheikh, vous avez une nouvelle mission dans votre zone.', from: 'me', time: '13:00' },
      { id: 2, text: 'Reçu chef, j\'accepte.', from: 'other', time: '13:01' },
      { id: 3, text: 'Parfait. Récupération chez Pharmacie Liberté 6, livraison à Sacré-Cœur.', from: 'me', time: '13:02' },
    ],
  },
  'agency-omar': {
    id: 'agency-omar',
    name: 'Omar Ba',
    avatar: '🏍️',
    role: 'driver',
    phone: '+221 78 234 56 78',
    online: false,
    lastMessage: 'Notez bien que 3 refus consécutifs entraînent une suspension.',
    lastTime: '09:16',
    unread: 0,
    messages: [
      { id: 1, text: 'Omar, votre taux d\'acceptation est en baisse ce mois. Tout va bien ?', from: 'me', time: '09:00' },
      { id: 2, text: 'Bonjour, j\'ai eu un problème de moto la semaine dernière. C\'est réglé.', from: 'other', time: '09:15' },
      { id: 3, text: 'Notez bien que 3 refus consécutifs entraînent une suspension.', from: 'me', time: '09:16' },
    ],
  },
  support: {
    id: 'support',
    name: 'Support Korba',
    avatar: '🚀',
    role: 'support',
    phone: '+221 33 842 00 11',
    online: true,
    lastMessage: 'Bonjour ! Comment puis-je vous aider ?',
    lastTime: '09:00',
    unread: 0,
    messages: [
      { id: 1, text: 'Bonjour ! Comment puis-je vous aider ?', from: 'other', time: '09:00' },
    ],
  },
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      conversations: SEED,

      addMessage: (convId, msg) =>
        set(s => {
          const conv = s.conversations[convId]
          if (!conv) return s
          return {
            conversations: {
              ...s.conversations,
              [convId]: {
                ...conv,
                messages: [...conv.messages, msg],
                lastMessage: msg.text,
                lastTime: msg.time,
                unread: msg.from === 'other' ? conv.unread + 1 : conv.unread,
              },
            },
          }
        }),

      markAsRead: (convId) =>
        set(s => {
          const conv = s.conversations[convId]
          if (!conv) return s
          return { conversations: { ...s.conversations, [convId]: { ...conv, unread: 0 } } }
        }),

      getList: () => Object.values(get().conversations).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return b.lastTime.localeCompare(a.lastTime)
      }),
    }),
    { name: 'korba-messages' },
  ),
)
