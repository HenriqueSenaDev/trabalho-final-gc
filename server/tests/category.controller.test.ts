import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { CategoryController } from '../src/controllers/category.controller.js';
import { prisma } from '../src/lib/prisma.js';

function mockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
}

describe('CategoryController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll - should return categories', async () => {
    (prisma as any).category.findMany.mockResolvedValue([{ id: '1', name: 'Cat' }]);

    const res = mockResponse();
    await CategoryController.getAll({} as any, res);

    expect(res.json).toHaveBeenCalledWith([{ id: '1', name: 'Cat' }]);
  });

  it('getById - not found returns 404', async () => {
    (prisma as any).category.findUnique.mockResolvedValue(null);

    const req: any = { params: { id: 'does-not-exist' } };
    const res = mockResponse();

    await CategoryController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
  });

  it('create - missing name returns 400', async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    await CategoryController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('create - success returns created category', async () => {
    const created = { id: '2', name: 'NewCat' };
    (prisma as any).category.create.mockResolvedValue(created);

    const req: any = { body: { name: 'NewCat' } };
    const res = mockResponse();

    await CategoryController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});
