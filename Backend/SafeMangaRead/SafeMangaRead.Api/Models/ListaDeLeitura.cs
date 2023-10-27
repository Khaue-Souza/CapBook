using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ListaDeLeituraApi.Models
{
    public class ListaDeLeitura
    {
        [Key]
        public int ListaDeLeituraId { get; set; }

        [ForeignKey("Usuario")]
        public int UsuarioId { get; set; }

        public int MangaId { get; set; }

        public string StatusManga { get; set; } = "";  
        public int ProgressoCapitulo { get; set; }
        public DateTime? DataInicio { get; set; }
        public DateTime? DataConclusao { get; set; }
        public string Notas { get; set; } = "";


    }
}
