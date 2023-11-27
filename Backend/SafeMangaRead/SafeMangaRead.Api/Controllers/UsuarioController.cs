using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MangaNovelsAPI.Models;
using UsuarioAPI.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using ListaDeLeituraApi.Models;
using System.Text.RegularExpressions;

namespace SafeMangaRead.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly APIdbcontext _context;

        public UsuarioController(APIdbcontext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> Getusuarios()
        {
            if (_context.usuarios == null)
            {
                return NotFound();
            }
            return await _context.usuarios.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            if (_context.usuarios == null)
            {
                return NotFound();
            }
            var usuario = await _context.usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.UsuarioId)
            {
                return BadRequest();
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {

            var userContext = await _context.usuarios.FirstOrDefaultAsync(t => t.UsuarioEmail == usuario.UsuarioEmail);

            if (userContext != null)
            {
                return BadRequest(new { status = 400, isSuccess = false, message = "Já existe um usuário com este e-mail!" });
            }

            if (!IsPasswordValid(usuario.UsuarioSenha))
            {
                return BadRequest(new { status = 400, isSuccess = false, message = "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula e um caractere especial!" });
            }


            if (_context.usuarios == null)
            {
                return Problem("Entity set 'APIdbcontext.usuarios'  is null.");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(usuario.UsuarioSenha);
            usuario.UsuarioSenha = hashedPassword;

            _context.usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsuario", new { id = usuario.UsuarioId }, usuario);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            if (_context.usuarios == null)
            {
                return NotFound();
            }
            var usuario = await _context.usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return (_context.usuarios?.Any(e => e.UsuarioId == id)).GetValueOrDefault();
        }

        private string GenerateJwtToken(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes("your-very-long-and-secure-key-here");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, usuario.UsuarioEmail)
                }),
                Expires = DateTime.UtcNow.AddHours(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("/login")]
        public async Task<ActionResult> PostUsuarioC(Usuario usuario)
        {
            
            var userContext = await _context.usuarios.FirstOrDefaultAsync(t => t.UsuarioEmail == usuario.UsuarioEmail);


            if (userContext != null && BCrypt.Net.BCrypt.Verify(usuario.UsuarioSenha, userContext.UsuarioSenha))
            {
                var token = GenerateJwtToken(userContext);
                return Ok(new { status = 200, isSuccess = true, message = "Login efetuado com sucesso!", token, userContext.UsuarioId });
            }
            else
            {
                return Unauthorized(new { status = 401, isSuccess = false, message = "Login ou senha incorretos!" });
            }
        }

        private bool IsPasswordValid(string senha)
        {
            if (senha.Length < 8)
            {
                return false;
            }

            if (!Regex.IsMatch(senha, @"[A-Z]"))
            {
                return false;
            }

            if (!Regex.IsMatch(senha, @"[!@#$%^&*()]"))
            {
                return false;
            }

            return true;
        }

    }
}
