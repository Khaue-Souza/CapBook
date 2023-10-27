using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SafeMangaRead.Api.Migrations;

public class DetalhesListaDeLeitura
{
    [Key]
    public int DetalhesListaDeLeituraId { get; set; }

    [ForeignKey("ListaDeLeitura")]
    public int ListaDeLeituraId { get; set; }
    public ListaDeLeitura ListaDeLeitura { get; set; }


}
