using testAltenMaheryBack.Data.Entities;
using testAltenMaheryBack.Repositories;

namespace testAltenMaheryBack.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;

        public ProductService(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        } 

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task CreateAsync(Product product)
        {
            await _repo.AddAsync(product);
            return;
        }

        public async Task UpdateAsync(Product product) =>
            await _repo.UpdateAsync(product);

        public async Task DeleteAsync(int id) =>
            await _repo.DeleteAsync(id);
    }
}
