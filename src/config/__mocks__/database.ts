const mockPool = {
  execute: jest.fn().mockResolvedValue([[], {}]),
  query: jest.fn().mockResolvedValue([[], {}]),
  getConnection: jest.fn().mockResolvedValue({
    execute: jest.fn().mockResolvedValue([[], {}]),
    beginTransaction: jest.fn().mockResolvedValue(undefined),
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
  }),
};

export default mockPool;