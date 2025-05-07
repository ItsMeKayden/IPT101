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
                var product = new Product
                {
                    Name = model.Name,
                    Price = model.Price,
                    Sizes = new ProductSizes
                    {
                        SmallFB = model.SmallFB,
                        MediumFB = model.MediumFB,
                        LargeFB = model.LargeFB,
                        SmallIG = model.SmallIG,
                        MediumIG = model.MediumIG,
                        LargeIG = model.LargeIG,
                        SmallShopee = model.SmallShopee,
                        MediumShopee = model.MediumShopee,
                        LargeShopee = model.LargeShopee
                    }
                };

                if (model.Image != null)
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

                return Ok(new { 
                    message = "Product added successfully",
                    product = new {
                        id = product.Id,
                        name = product.Name,
                        price = product.Price,
                        imagePath = product.ImagePath,
                        sizes = new {
                            smallFB = product.Sizes.SmallFB,
                            mediumFB = product.Sizes.MediumFB,
                            largeFB = product.Sizes.LargeFB,
                            smallIG = product.Sizes.SmallIG,
                            mediumIG = product.Sizes.MediumIG,
                            largeIG = product.Sizes.LargeIG,
                            smallShopee = product.Sizes.SmallShopee,
                            mediumShopee = product.Sizes.MediumShopee,
                            largeShopee = product.Sizes.LargeShopee
                        }
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

                // Update platform-specific stock
                int currentStock = 0;
                switch (request.Platform.ToLower())
                {
                    case "facebook":
                        switch (request.Size.ToLower())
                        {
                            case "small":
                                currentStock = product.Sizes.SmallFB;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient small size stock for Facebook" });
                                product.Sizes.SmallFB -= request.Quantity;
                                break;
                            case "medium":
                                currentStock = product.Sizes.MediumFB;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient medium size stock for Facebook" });
                                product.Sizes.MediumFB -= request.Quantity;
                                break;
                            case "large":
                                currentStock = product.Sizes.LargeFB;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient large size stock for Facebook" });
                                product.Sizes.LargeFB -= request.Quantity;
                                break;
                            default:
                                return BadRequest(new { message = "Invalid size" });
                        }
                        break;

                    case "instagram":
                        switch (request.Size.ToLower())
                        {
                            case "small":
                                currentStock = product.Sizes.SmallIG;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient small size stock for Instagram" });
                                product.Sizes.SmallIG -= request.Quantity;
                                break;
                            case "medium":
                                currentStock = product.Sizes.MediumIG;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient medium size stock for Instagram" });
                                product.Sizes.MediumIG -= request.Quantity;
                                break;
                            case "large":
                                currentStock = product.Sizes.LargeIG;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient large size stock for Instagram" });
                                product.Sizes.LargeIG -= request.Quantity;
                                break;
                            default:
                                return BadRequest(new { message = "Invalid size" });
                        }
                        break;

                    case "shopee":
                        switch (request.Size.ToLower())
                        {
                            case "small":
                                currentStock = product.Sizes.SmallShopee;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient small size stock for Shopee" });
                                product.Sizes.SmallShopee -= request.Quantity;
                                break;
                            case "medium":
                                currentStock = product.Sizes.MediumShopee;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient medium size stock for Shopee" });
                                product.Sizes.MediumShopee -= request.Quantity;
                                break;
                            case "large":
                                currentStock = product.Sizes.LargeShopee;
                                if (currentStock < request.Quantity)
                                    return BadRequest(new { message = "Insufficient large size stock for Shopee" });
                                product.Sizes.LargeShopee -= request.Quantity;
                                break;
                            default:
                                return BadRequest(new { message = "Invalid size" });
                        }
                        break;

                    default:
                        return BadRequest(new { message = "Invalid platform" });
                }

                var order = new Order
                {
                    ProductId = id,
                    CustomerName = request.CustomerName,
                    Quantity = request.Quantity,
                    Size = request.Size,
                    Platform = request.Platform,
                    TotalAmount = product.Price * request.Quantity,
                    OrderDate = DateTime.UtcNow
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Stock updated successfully", order });
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
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching orders", error = ex.Message });
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
}