using System.ComponentModel.DataAnnotations;

namespace IPT101.Models
{
    public class ProductSizes
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        
        // Main stock quantities
        public int Small { get; set; }
        public int Medium { get; set; }
        public int Large { get; set; }
        
        // Total quantities per size
        public int TotalSmall { get; set; }
        public int TotalMedium { get; set; }
        public int TotalLarge { get; set; }
        
        // Remaining quantities per size
        public int RemainingSmall { get; set; }
        public int RemainingMedium { get; set; }
        public int RemainingLarge { get; set; }
        
        // Platform stocks
        public int SmallFB { get; set; }
        public int MediumFB { get; set; }
        public int LargeFB { get; set; }
        public int SmallIG { get; set; }
        public int MediumIG { get; set; }
        public int LargeIG { get; set; }
        public int SmallShopee { get; set; }
        public int MediumShopee { get; set; }
        public int LargeShopee { get; set; }

        public Product Product { get; set; } = null!;
    }
}