using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using testAltenMaheryBack.Data.Entities;
using testAltenMaheryBack.Dtos;
using testAltenMaheryBack.Services;

namespace testAltenMaheryBack.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userSvc;
        private readonly PasswordHasher<User> _pwdHasher;
        public UserController(IUserService userService)
        {
            _userSvc = userService;
            _pwdHasher = new PasswordHasher<User>();
        }

        [HttpGet]
        public async Task<ApiResponse<List<User>>> GetAll()
        {
            var apiResponse = new ApiResponse<List<User>>();
            try
            {
                var data = await _userSvc.GetAllAsync();
                apiResponse.Success = true;
                apiResponse.Result = data.ToList();
            }
            catch (Exception ex)
            {
                apiResponse.Success = false;
                apiResponse.Message = ex.Message;
            }
            return apiResponse;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ApiResponse<string>> Add(User model)
        {
            var apiResponse = new ApiResponse<string>();
            try
            {
                model.Password = _pwdHasher.HashPassword(model, model.Password);
                model.Role_user = UserRole.User;
                var userExist = await _userSvc.GetByLoginAsync(model.Login);
                if(userExist != null)
                {
                    apiResponse.Success = false;
                    apiResponse.Message = "Le nom du login existe déjà";
                    return apiResponse;
                }

                await _userSvc.CreateAsync(model);
                apiResponse.Success = true;
            }
            catch (Exception ex)
            {
                apiResponse.Success = false;
                apiResponse.Message = ex.Message;
            }
            return apiResponse;
        }

        [HttpPut("{id}")]
        public async Task<ApiResponse<string>> Update(User model)
        {
            var apiResponse = new ApiResponse<string>();
            try
            {
                await _userSvc.UpdateAsync(model);
                apiResponse.Success = true;
                apiResponse.Result = "User updated successfully";
            }
            catch (Exception ex)
            {
                apiResponse.Success = false;
                apiResponse.Message = ex.Message;
            }
            return apiResponse;
        }

        [HttpDelete("{id}")]
        public async Task<ApiResponse<string>> Delete(int id)
        {
            var apiResponse = new ApiResponse<string>();
            try
            {
                await _userSvc.DeleteAsync(id);
                apiResponse.Success = true;
                apiResponse.Result = "User deleted successfully";
            }
            catch (Exception ex)
            {
                apiResponse.Success = false;
                apiResponse.Message = ex.Message;
            }
            return apiResponse;
        }
    }
}
