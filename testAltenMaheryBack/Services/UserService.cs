using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using testAltenMaheryBack.Data.Entities;
using testAltenMaheryBack.Repositories;

namespace testAltenMaheryBack.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        private readonly PasswordHasher<User> _pwdHasher;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
            _pwdHasher = new PasswordHasher<User>();
        }

        public async Task<User?> AuthenticateAsync(string login, string password)
        {
            var users = await _repo.GetAllAsync();
            if (users == null)
                return null;

            var user = users.FirstOrDefault(u => u.Login == login);
            if (user == null)
                return null;

            var result = _pwdHasher.VerifyHashedPassword(user, user.Password, password);

            return result == PasswordVerificationResult.Success ? user : null;
        }


        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<User?> GetByLoginAsync(string login)
        {
            return await _repo.GetByLoginAsync(login);
        }

        public async Task CreateAsync(User user)
        {
            await _repo.AddAsync(user);
            return;
        }

        public async Task UpdateAsync(User user) =>
            await _repo.UpdateAsync(user);

        public async Task DeleteAsync(int id) =>
            await _repo.DeleteAsync(id);
    }
}
