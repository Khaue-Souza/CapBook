using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using UsuarioAPI.Models;

public class Favoritos
{
    [Key]
    public int FavoritosId { get; set; }

    [ForeignKey("Usuario")]
    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    public int MangaId { get; set; }
}
