export {};

declare global {
  namespace Express {
    interface Request {
        currentUserId?: import('../entities/User').default;
    }
  }
}
