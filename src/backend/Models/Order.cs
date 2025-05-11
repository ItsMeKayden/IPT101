using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IPT101.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        
        public string CustomerName { get; set; }
        
        public int Quantity { get; set; }
        
        public string Size { get; set; }
        
        public string Platform { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        public bool IsPaid { get; set; } = false;
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        public int ProductId { get; set; }
        
        public virtual Product Product { get; set; }
    }
}