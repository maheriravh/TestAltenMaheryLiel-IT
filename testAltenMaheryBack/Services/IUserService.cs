using testAltenMaheryBack.Data.Entities;

namespace testAltenMaheryBack.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByLoginAsync(string login);
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
        Task<User?> AuthenticateAsync(string login, string password);
    }
}
