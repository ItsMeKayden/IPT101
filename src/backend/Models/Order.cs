using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPT101.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        
        [Required]
        public required string CustomerName { get; set; }
        
        public int Quantity { get; set; }
        
        [Required]
        public required string Size { get; set; }
        
        [Required]
        public required string Platform { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    }
}