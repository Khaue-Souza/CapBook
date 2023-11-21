using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace ListaDeLeituraApi.Models
{
    public class ListaDeLeitura
    {
        [Key]
        public int ListaDeLeituraId { get; set; }

        [ForeignKey("Usuario")]
        public int UsuarioId { get; set; }

        public int MangaId { get; set; }

        public string NomeMangaRomaji { get; set; } = "";
        public string NomeMangaEnglish { get; set; } = "";
        public string NomeMangaNative { get; set; } = "";

        public string StatusManga { get; set; } = "";  
        public int ProgressoCapitulo { get; set; }
        public string FormatoManga { get; set; } = "";
        public string Generos { get; set; } = "";
        public string PaisDeOrigem { get; set; } = "";

        [NotMapped]
        public List<string> ListaDeGeneros
        {
            get => Generos?.Split(',').ToList() ?? new List<string>();
            set => Generos = String.Join(",", value);
        }
        public string Notas { get; set; } = "";
        public DateTime? DataInicio { get; set; }
        public DateTime? DataConclusao { get; set; } 


        public string Images { get; set; } = "";

        public string Banner { get; set; } = "";


        public int AnoDePublicacao { get; set; } = 0;

        public string NomesAlternativos { get; set; } = "";

        [NotMapped]
        public List<string> ListaNomesAlternativos
        {
            get => NomesAlternativos?.Split(',').ToList() ?? new List<string>();
            set => NomesAlternativos = String.Join(",", value);
        }

    }
}
