using MangasAPI.Models;
using NovelsAPI.Models;
using Microsoft.EntityFrameworkCore;
using UsuarioAPI.Models;
using ListaDeLeituraApi.Models;

namespace MangaNovelsAPI.Models
{
    public class APIdbcontext : DbContext
    {
        // Construtor para uso normal do aplicativo
        public APIdbcontext(DbContextOptions options) : base(options)
        {
        }

        // Construtor sem parâmetros para mock
        public APIdbcontext() { }
        public DbSet<Mangas> mangas { get; set; }
        public DbSet<Novels> novels { get; set; }
        public virtual DbSet<Usuario> usuarios { get; set; }
        public DbSet<ListaDeLeitura> listasDeLeitura { get; set; }
    }
}
