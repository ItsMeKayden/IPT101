using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace IPT101.Models
{
    public class ProductViewModel
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        public IFormFile? Image { get; set; }

        // Facebook stocks
        [Range(0, int.MaxValue)]
        public int SmallFB { get; set; }
        [Range(0, int.MaxValue)]
        public int MediumFB { get; set; }
        [Range(0, int.MaxValue)]
        public int LargeFB { get; set; }

        // Instagram stocks
        [Range(0, int.MaxValue)]
        public int SmallIG { get; set; }
        [Range(0, int.MaxValue)]
        public int MediumIG { get; set; }
        [Range(0, int.MaxValue)]
        public int LargeIG { get; set; }

        // Shopee stocks
        [Range(0, int.MaxValue)]
        public int SmallShopee { get; set; }
        [Range(0, int.MaxValue)]
        public int MediumShopee { get; set; }
        [Range(0, int.MaxValue)]
        public int LargeShopee { get; set; }
    }
}