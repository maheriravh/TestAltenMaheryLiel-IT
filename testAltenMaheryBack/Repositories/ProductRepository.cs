using testAltenMaheryBack.Data.Entities;
using testAltenMaheryBack.Data;
using Microsoft.EntityFrameworkCore;

namespace testAltenMaheryBack.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly MyDbContext _context;

        public ProductRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            var list = await _context.Products.AsNoTracking().ToListAsync();
            return list;
        }
            

        public async Task<Product?> GetByIdAsync(int id) =>
            await _context.Products.FindAsync(id);

        public async Task AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is not null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
}
