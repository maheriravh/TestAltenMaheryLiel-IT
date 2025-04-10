using Microsoft.EntityFrameworkCore;
using testAltenMaheryBack.Data;
using testAltenMaheryBack.Data.Entities;

namespace testAltenMaheryBack.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MyDbContext _context;
        public UserRepository(MyDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.AsNoTracking().ToListAsync();
        }
        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
        public async Task<User?> GetByLoginAsync(string login)
        {
            var users = await _context.Users.AsNoTracking().ToListAsync();
            if (users == null)
                return null;
            var user = users.FirstOrDefault(u => u.Login == login);
            return user;
        }
        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var user = await GetByIdAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}
