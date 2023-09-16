using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace UsuarioAPI.Models
{ 
    //Criação da tabela e campos
    public class Usuario
    {
        [Key]
        [DataMember]
        public int UsuarioId { get; set; }

       
        [DataMember]
        [Column(TypeName = "nvarchar(250)")]
        public string UsuarioName { get; set; } = "";

        
        [DataMember]
        public string UsuarioCargo { get; set; } = "";

        
        [DataMember]
        public string UsuarioLogin { get; set; } = "";


        
        [DataMember]
        public string UsuarioSenha { get; set; } = "";




    }
}
