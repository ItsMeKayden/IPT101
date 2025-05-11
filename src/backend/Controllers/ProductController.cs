using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IPT101.Data;
using IPT101.Models;
using System.IO;
using System.ComponentModel.DataAnnotations;

namespace IPT101.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct([FromForm] ProductViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var product = new Product
                {
                    Name = model.Name,
                    Price = model.Price,
                    Sizes = new ProductSizes
                    {
                        // Set total quantities
                        TotalSmall = model.Small,
                        TotalMedium = model.Medium,
                        TotalLarge = model.Large,

                        // Set remaining quantities equal to total
                        RemainingSmall = model.Small,
                        RemainingMedium = model.Medium,
                        RemainingLarge = model.Large,

                        // Set main quantities
                        Small = 0,  // Changed to 0
                        Medium = 0, // Changed to 0
                        Large = 0,  // Changed to 0

                        // Keep platform quantities at 0
                        SmallFB = 0,
                        MediumFB = 0,
                        LargeFB = 0,
                        SmallIG = 0,
                        MediumIG = 0,
                        LargeIG = 0,
                        SmallShopee = 0,
                        MediumShopee = 0,
                        LargeShopee = 0
                    }
                };

                // Handle image upload
                if (model.Image != null && model.Image.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                    Directory.CreateDirectory(uploadsFolder);
                    
                    var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(model.Image.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.Image.CopyToAsync(stream);
                    }

                    product.ImagePath = $"/uploads/{uniqueFileName}";
                }

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Product added successfully",
                    product = new
                    {
                        id = product.Id,
                        name = product.Name,
                        price = product.Price,
                        imagePath = product.ImagePath,
                        sizes = product.Sizes
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding product", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.Sizes)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        price = p.Price,
                        imagePath = p.ImagePath,
                        sizes = new
                        {
                            // Changed to display total quantities properly
                            small = p.Sizes.TotalSmall,
                            medium = p.Sizes.TotalMedium,
                            large = p.Sizes.TotalLarge,
                            // Remaining quantities
                            remainingSmall = p.Sizes.RemainingSmall,
                            remainingMedium = p.Sizes.RemainingMedium,
                            remainingLarge = p.Sizes.RemainingLarge,
                            // Platform quantities
                            smallFB = p.Sizes.SmallFB,
                            mediumFB = p.Sizes.MediumFB,
                            largeFB = p.Sizes.LargeFB,
                            smallIG = p.Sizes.SmallIG,
                            mediumIG = p.Sizes.MediumIG,
                            largeIG = p.Sizes.LargeIG,
                            smallShopee = p.Sizes.SmallShopee,
                            mediumShopee = p.Sizes.MediumShopee,
                            largeShopee = p.Sizes.LargeShopee
                        }
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching products", error = ex.Message });
            }
        }

        [HttpPost("{id}/updateStock")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockRequest request)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Sizes)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                    return NotFound(new { message = "Product not found" });

                // Check remaining stock only (not platform-specific)
                int remainingStock = request.Size.ToLower() switch
                {
                    "small" => product.Sizes.RemainingSmall,
                    "medium" => product.Sizes.RemainingMedium,
                    "large" => product.Sizes.RemainingLarge,
                    _ => throw new ArgumentException("Invalid size")
                };

                // Validate remaining stock availability
                if (remainingStock < request.Quantity)
                {
                    return BadRequest(new { 
                        message = $"Insufficient stock. Only {remainingStock} {request.Size} size items remaining." 
                    });
                }

                // Create new order
                var order = new Order
                {
                    CustomerName = request.CustomerName,
                    Quantity = request.Quantity,
                    Size = request.Size,
                    Platform = request.Platform,
                    TotalAmount = product.Price * request.Quantity,
                    ProductId = product.Id
                };

                _context.Orders.Add(order);

                // Update remaining stock and platform stock
                switch (request.Size.ToLower())
                {
                    case "small":
                        product.Sizes.RemainingSmall -= request.Quantity;
                        switch (request.Platform.ToLower())
                        {
                            case "facebook":
                                product.Sizes.SmallFB += request.Quantity;
                                break;
                            case "instagram":
                                product.Sizes.SmallIG += request.Quantity;
                                break;
                            case "shopee":
                                product.Sizes.SmallShopee += request.Quantity;
                                break;
                        }
                        break;

                    case "medium":
                        product.Sizes.RemainingMedium -= request.Quantity;
                        switch (request.Platform.ToLower())
                        {
                            case "facebook":
                                product.Sizes.MediumFB += request.Quantity;
                                break;
                            case "instagram":
                                product.Sizes.MediumIG += request.Quantity;
                                break;
                            case "shopee":
                                product.Sizes.MediumShopee += request.Quantity;
                                break;
                        }
                        break;

                    case "large":
                        product.Sizes.RemainingLarge -= request.Quantity;
                        switch (request.Platform.ToLower())
                        {
                            case "facebook":
                                product.Sizes.LargeFB += request.Quantity;
                                break;
                            case "instagram":
                                product.Sizes.LargeIG += request.Quantity;
                                break;
                            case "shopee":
                                product.Sizes.LargeShopee += request.Quantity;
                                break;
                        }
                        break;
                }

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Order placed successfully",
                    order = new {
                        id = order.Id,
                        customerName = order.CustomerName,
                        quantity = order.Quantity,
                        size = order.Size,
                        platform = order.Platform,
                        totalAmount = order.TotalAmount,
                        isPaid = order.IsPaid,
                        orderDate = order.OrderDate
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating stock", error = ex.Message });
            }
        }

        [HttpGet("orders/{productId}")]
        public async Task<IActionResult> GetOrders(int productId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.ProductId == productId)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new
                    {
                        id = o.Id,
                        customerName = o.CustomerName,
                        quantity = o.Quantity,
                        size = o.Size,
                        platform = o.Platform,
                        totalAmount = o.TotalAmount,
                        isPaid = o.IsPaid,
                        orderDate = o.OrderDate
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
            }
        }

        [HttpPut("orders/{orderId}/updatePayment")]
        public async Task<IActionResult> UpdatePaymentStatus(int orderId, [FromBody] UpdatePaymentRequest request)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                
                if (order == null)
                    return NotFound(new { message = "Order not found" });

                order.IsPaid = request.IsPaid;
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Payment status updated successfully",
                    isPaid = order.IsPaid 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating payment status", error = ex.Message });
            }
        }
    }

    public class UpdateStockRequest
    {
        [Required]
        public required string CustomerName { get; set; }
        
        [Required]
        public required string Size { get; set; }
        
        [Required]
        public required string Platform { get; set; }
        
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class UpdatePaymentRequest
    {
        public bool IsPaid { get; set; }
    }
}