import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    category: {
      findUnique: vi.fn(),
    },
  },
}));

import { ProductController } from '../src/controllers/product.controller.js';
import { prisma } from '../src/lib/prisma.js';

function mockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
}

describe('ProductController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it('getAll - returns products', async () => {
  //   (prisma as any).product.findMany.mockResolvedValue([{ id: 'p1', name: 'Prod' }]);

  //   const res = mockResponse();
  //   await ProductController.getAll({} as any, res);

  //   expect(res.json).toHaveBeenCalledWith([{ id: 'p1', name: 'Prod' }]);
  // });

  it('getAll - returns products with pagination', async () => {
    (prisma as any).product.count.mockResolvedValue(1);
    (prisma as any).product.findMany.mockResolvedValue([
      { id: 'p1', name: 'Prod' }
    ]);

    const res = mockResponse();
    await ProductController.getAll({ query: {} } as any, res);

    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: 'p1', name: 'Prod' }],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });


  it('getById - product not found returns 404', async () => {
    (prisma as any).product.findUnique.mockResolvedValue(null);

    const req: any = { params: { id: 'nope' } };
    const res = mockResponse();

    await ProductController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });

  it('create - missing fields returns 400', async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    await ProductController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('create - category not found returns 404', async () => {
    (prisma as any).category.findUnique.mockResolvedValue(null);

    const req: any = { body: { name: 'P', price: '10', imageUrl: 'x', categoryId: 'no-cat' } };
    const res = mockResponse();

    await ProductController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
  });

  it('create - success returns 201', async () => {
    (prisma as any).category.findUnique.mockResolvedValue({ id: 'c1', name: 'Cat' });
    const created = { id: 'p2', name: 'New', price: 9.99, imageUrl: 'u', categoryId: 'c1' };
    (prisma as any).product.create.mockResolvedValue(created);

    const req: any = { body: { name: 'New', price: '9.99', imageUrl: 'u', categoryId: 'c1' } };
    const res = mockResponse();

    await ProductController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});
