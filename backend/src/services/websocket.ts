import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken } from '../utils/auth';

/**
 * WebSocket Server
 * Real-time updates for duels, gauntlets, and leaderboards
 */

let io: SocketIOServer;

/**
 * Initialize WebSocket server
 */
export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      // Allow anonymous connections
      return next();
    }

    const payload = verifyToken(token);

    if (payload) {
      socket.data.userId = payload.userId;
      socket.data.walletAddress = payload.walletAddress;
    }

    next();
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    if (socket.data.userId) {
      console.log(`  User: ${socket.data.walletAddress}`);
    }

    // Join rooms
    socket.on('join:duel', (duelId: string) => {
      socket.join(`duel:${duelId}`);
      console.log(`${socket.id} joined duel:${duelId}`);
    });

    socket.on('join:gauntlet', (day: number) => {
      socket.join(`gauntlet:${day}`);
      console.log(`${socket.id} joined gauntlet:${day}`);
    });

    socket.on('join:arena', () => {
      socket.join('arena');
      console.log(`${socket.id} joined arena`);
    });

    socket.on('join:draft', () => {
      socket.join('draft');
      console.log(`${socket.id} joined draft`);
    });

    socket.on('join:whisperer', () => {
      socket.join('whisperer');
      console.log(`${socket.id} joined whisperer`);
    });

    // Leave rooms
    socket.on('leave:duel', (duelId: string) => {
      socket.leave(`duel:${duelId}`);
    });

    socket.on('leave:gauntlet', (day: number) => {
      socket.leave(`gauntlet:${day}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log('🔌 WebSocket server initialized');

  return io;
}

/**
 * Emit duel created event
 */
export function emitDuelCreated(duel: any): void {
  if (!io) return;

  io.to('arena').emit('duel:created', duel);
}

/**
 * Emit duel accepted event
 */
export function emitDuelAccepted(duelId: string, duel: any): void {
  if (!io) return;

  io.to(`duel:${duelId}`).emit('duel:accepted', duel);
  io.to('arena').emit('duel:accepted', duel);
}

/**
 * Emit duel resolved event
 */
export function emitDuelResolved(duelId: string, duel: any): void {
  if (!io) return;

  io.to(`duel:${duelId}`).emit('duel:resolved', duel);
  io.to('arena').emit('duel:resolved', duel);
}

/**
 * Emit vote cast event
 */
export function emitVoteCast(duelId: string, vote: any): void {
  if (!io) return;

  io.to(`duel:${duelId}`).emit('vote:cast', vote);
}

/**
 * Emit gauntlet created event
 */
export function emitGauntletCreated(gauntlet: any): void {
  if (!io) return;

  io.to('gauntlet').emit('gauntlet:created', gauntlet);
}

/**
 * Emit gauntlet entry submitted event
 */
export function emitGauntletEntry(day: number, entry: any): void {
  if (!io) return;

  io.to(`gauntlet:${day}`).emit('gauntlet:entry', entry);
}

/**
 * Emit gauntlet prediction resolved event
 */
export function emitPredictionResolved(day: number, prediction: any): void {
  if (!io) return;

  io.to(`gauntlet:${day}`).emit('prediction:resolved', prediction);
}

/**
 * Emit gauntlet resolved event
 */
export function emitGauntletResolved(day: number, gauntlet: any): void {
  if (!io) return;

  io.to(`gauntlet:${day}`).emit('gauntlet:resolved', gauntlet);
}

/**
 * Emit draft scores updated event
 */
export function emitDraftScoresUpdated(): void {
  if (!io) return;

  io.to('draft').emit('draft:scores_updated');
}

/**
 * Emit draft rankings updated event
 */
export function emitDraftRankingsUpdated(): void {
  if (!io) return;

  io.to('draft').emit('draft:rankings_updated');
}

/**
 * Emit leaderboard updated event
 */
export function emitLeaderboardUpdated(type: 'arena' | 'gauntlet' | 'whisperer' | 'draft'): void {
  if (!io) return;

  io.emit('leaderboard:updated', { type });
}

/**
 * Get connected clients count
 */
export function getConnectedClientsCount(): number {
  if (!io) return 0;
  return io.sockets.sockets.size;
}

/**
 * Get room members count
 */
export function getRoomMembersCount(room: string): number {
  if (!io) return 0;
  const roomMembers = io.sockets.adapter.rooms.get(room);
  return roomMembers ? roomMembers.size : 0;
}
