using System.ComponentModel.DataAnnotations;

namespace testAltenMaheryBack.Data.Entities
{
    public class User
    {
        [Key]
        public int Id_user { get; set; }
        public string Login { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role_user { get; set; } = null!;
    }
}
