using testAltenMaheryBack.Data.Entities;

namespace testAltenMaheryBack.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByLoginAsync(string login);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
    }
}
