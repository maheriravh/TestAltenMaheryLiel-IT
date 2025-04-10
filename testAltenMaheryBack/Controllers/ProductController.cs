using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using testAltenMaheryBack.Data.Entities;
using testAltenMaheryBack.Dtos;
using testAltenMaheryBack.Services;

namespace testAltenMaheryBack.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productSvc;

        public ProductController(IProductService productService)
        {
            _productSvc = productService;
        }

        [HttpGet]
        public async Task<ApiResponse<List<Product>>> GetAll()
        {
            var apiResponse = new ApiResponse<List<Product>>();
            try
            {
                var data = await _productSvc.GetAllAsync();
                apiResponse.Success = true;
                apiResponse.Result = data.ToList();
            }
            catch(Exception ex)
            {
                apiResponse.Success = false;
                apiResponse.Message = ex.Message;
            }
            return apiResponse;
        }

        [HttpPost]
        public async Task<ApiResponse<string>> Add(Product model)
        {
            var apiResponse = new ApiResponse<string>();
            try
            {
                await _productSvc.CreateAsync(model);
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
        public async Task<ApiResponse<string>> Update(Product model)
        {
            var apiResponse = new ApiResponse<string>();
            try
            {
                await _productSvc.UpdateAsync(model);
                apiResponse.Success = true;
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
                await _productSvc.DeleteAsync(id);
                apiResponse.Success = true;
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
