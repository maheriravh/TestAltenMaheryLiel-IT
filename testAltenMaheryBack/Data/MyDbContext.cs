using Microsoft.EntityFrameworkCore;
using testAltenMaheryBack.Data.Entities;

namespace testAltenMaheryBack.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>().ToTable("Product");
            modelBuilder.Entity<User>().ToTable("User");
        }
    }
}
