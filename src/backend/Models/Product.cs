using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPT101.Models
{
    public class Product
    {
        public Product()
        {
            Orders = new List<Order>();
        }

        [Key]
        public int Id { get; set; }
        
        [Required]
        public required string Name { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public string? ImagePath { get; set; }
        
        [Required]
        public required ProductSizes Sizes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public virtual ICollection<Order> Orders { get; set; }
    }
}