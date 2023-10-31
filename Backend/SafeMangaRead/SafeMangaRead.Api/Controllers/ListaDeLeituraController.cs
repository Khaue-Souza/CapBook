using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MangaNovelsAPI.Models;
using ListaDeLeituraApi.Models;

namespace SafeMangaRead.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListaDeLeituraController : ControllerBase
    {
        private readonly APIdbcontext _context;

        public ListaDeLeituraController(APIdbcontext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ListaDeLeitura>>> GetLista()
        {
            if (_context.listasDeLeitura == null)
            {
                return NotFound();
            }
            return await _context.listasDeLeitura.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ListaDeLeitura>> GetListaDeLeitura(int id)
        {
            if (_context.listasDeLeitura == null)
            {
                return NotFound();
            }
            var listasDeLeitura = await _context.listasDeLeitura.FindAsync(id);

            if (listasDeLeitura == null)
            {
                return NotFound();
            }

            return listasDeLeitura;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutListaDeLeitura(int id, ListaDeLeitura listasDeLeitura)
        {
            if (id != listasDeLeitura.ListaDeLeituraId)
            {
                return BadRequest();
            }

            _context.Entry(listasDeLeitura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ListaDeLeituraExists(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteListaDeLeitura(int id)
        {
            if (_context.listasDeLeitura == null)
            {
                return NotFound();
            }
            var listasDeLeitura = await _context.listasDeLeitura.FindAsync(id);
            if (listasDeLeitura == null)
            {
                return NotFound();
            }

            _context.listasDeLeitura.Remove(listasDeLeitura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ListaDeLeituraExists(int id)
        {
            return (_context.listasDeLeitura?.Any(e => e.ListaDeLeituraId == id)).GetValueOrDefault();
        }



        [HttpPost("addManga")]
        public async Task<ActionResult> AddMangaToList(ListaDeLeitura listaDeLeitura)
        {
            var usuario = _context.usuarios.FirstOrDefault(p => p.UsuarioId == listaDeLeitura.UsuarioId) ;
            if (usuario == null)
            {
                return NotFound("Usuário não encontrado");
            }

            _context.listasDeLeitura.Add(listaDeLeitura);
            await _context.SaveChangesAsync();

            return Ok(new { status = 200, isSuccess = true, message = "Mangá adicionado à lista de leitura!" });
        }



        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<ListaDeLeitura>>> GetListasPorUsuario(int usuarioId)
        {
            if (_context.listasDeLeitura == null)
            {
                return NotFound();
            }

            var listas = await _context.listasDeLeitura
                                       .Where(l => l.UsuarioId == usuarioId)
                                       .ToListAsync();

            if (listas == null || listas.Count == 0)
            {
                return NotFound("Nenhuma lista de leitura encontrada para o usuário especificado.");
            }

            return listas;
        }





    }
}
