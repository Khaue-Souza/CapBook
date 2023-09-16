using NovelsAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MangaNovelsAPI.Models;

namespace SafeMangaRead.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NovelsController : ControllerBase
    {
        private readonly APIdbcontext _context;

        public NovelsController(APIdbcontext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Novels>>> Getnovels()
        {
          if (_context.novels == null)
          {
              return NotFound();
          }
            return await _context.novels.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Novels>> GetNovel(int id)
        {
          if (_context.novels == null)
          {
              return NotFound();
          }
            var novel = await _context.novels.FindAsync(id);

            if (novel == null)
            {
                return NotFound();
            }
            return novel;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutNovel(int id, Novels novel)
        {
            if (id != novel.Id)
            {
                return BadRequest();
            }
            _context.Entry(novel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {  
                if (!NovelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Novels>> PostNovel(Novels novel)
        {
          if (_context.novels == null)
          {
              return Problem("Entity set 'APIdbcontext.novels'  is null.");
          }
            _context.novels.Add(novel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNovel", new { id = novel.Id }, novel);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNovel(int id)
        {
            if (_context.novels == null)
            {
                return NotFound();
            }
            var novel = await _context.novels.FindAsync(id);
            if (novel == null)
            {
                return NotFound();
            }

            _context.novels.Remove(novel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NovelExists(int id)
        {
            return (_context.novels?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
