namespace testAltenMaheryBack.Dtos
{
    public class UserDto
    {
        public string Login { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public static class UserRole
    {
        public static readonly string Admin = "Admin";
        public static readonly string User = "User";
    }
}
