using MangasAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MangaNovelsAPI.Models;

namespace Clinivet1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MangasController : ControllerBase
    {
        private readonly APIdbcontext _context;

        public MangasController(APIdbcontext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mangas>>> Getmangas()
        {
          if (_context.mangas == null)
          {
              return NotFound();
          }
            return await _context.mangas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Mangas>> GetManga(int id)
        {
          if (_context.mangas == null)
          {
              return NotFound();
          }
            var manga = await _context.mangas.FindAsync(id);

            if (manga == null)
            {
                return NotFound();
            }
            return manga;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutManga(int id, Mangas manga)
        {
            if (id != manga.Id)
            {
                return BadRequest();
            }
            _context.Entry(manga).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {  
                if (!MangaExists(id))
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
        public async Task<ActionResult<Mangas>> PostManga(Mangas manga)
        {
          if (_context.mangas == null)
          {
              return Problem("Entity set 'APIdbcontext.mangas'  is null.");
          }
            _context.mangas.Add(manga);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetManga", new { id = manga.Id }, manga);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManga(int id)
        {
            if (_context.mangas == null)
            {
                return NotFound();
            }
            var manga = await _context.mangas.FindAsync(id);
            if (manga == null)
            {
                return NotFound();
            }

            _context.mangas.Remove(manga);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MangaExists(int id)
        {
            return (_context.mangas?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
