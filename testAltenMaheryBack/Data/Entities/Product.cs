using System.ComponentModel.DataAnnotations;

namespace testAltenMaheryBack.Data.Entities
{
    public class Product
    {
        [Key]
        public int Id_product { get; set; }
        public string Label { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
    }
}
