using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace MangasAPI.Models
{
    //Criação da tabela e campos
    public class Mangas
    {
        [Key]
        [DataMember]
        public int Id { get; set; }

        
        [DataMember]
        [Column(TypeName = "nvarchar(250)")]
        public string Name { get; set; } = "";
        
        [DataMember]
        public string Gender { get; set; } = "";

        [DataMember]
        public string Title { get; set; } = "";

        [DataMember]
        public string Author { get; set; } = "";

        [DataMember]
        public string Status { get; set; } = "";

        [DataMember]
        public string Synopsis { get; set; } = "";

        [DataMember]
        public string Ratings { get; set; } = "";

        [DataMember]
        public string Images { get; set; } = "";

        [DataMember]
        public string Language { get; set; } = "";

        [DataMember]
        public string CountryOfOrigin { get; set; } = "";

        [DataMember]
        public int YearOfPublication { get; set; } = 0;

        [DataMember]
        public string AlternateNames { get; set; } = "";

        [DataMember]
        public string testemigration { get; set; } = "";


    }
}
