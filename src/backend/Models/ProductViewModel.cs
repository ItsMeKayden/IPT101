using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace IPT101.Models
{
    public class ProductViewModel
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        public IFormFile? Image { get; set; }
        
        [Range(0, int.MaxValue)]
        public int Small { get; set; }
        
        [Range(0, int.MaxValue)]
        public int Medium { get; set; }
        
        [Range(0, int.MaxValue)]
        public int Large { get; set; }
    }
}