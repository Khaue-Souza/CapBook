using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafeMangaRead.Controllers;
using ListaDeLeituraApi.Models;
using MangaNovelsAPI.Models;
using Xunit;
using UsuarioAPI.Models;

namespace SafeMangaReadTest
{
    public class ListaDeLeituraControllerTest
    {
        private readonly APIdbcontext dbContext; // Mova a declaração para o escopo da classe

        [Fact]
        private APIdbcontext CreateDbContextInMemory()
        {
            var options = new DbContextOptionsBuilder<APIdbcontext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            return new APIdbcontext(options);
        }


        [Fact]
        public async Task PostListaDeLeituraTest()
        {
            // Arrange
            using var dbContext = CreateDbContextInMemory();
            var usuarioTeste = new Usuario { UsuarioId = 1, UsuarioName = "Teste" }; 
            dbContext.usuarios.Add(usuarioTeste);
            await dbContext.SaveChangesAsync();




            var controller = new ListaDeLeituraController(dbContext);
            var newListaDeLeitura = new ListaDeLeitura
            {
                UsuarioId = 1,
                MangaId = 30011,
                AnoDePublicacao = 1999,
                Banner = "https://s4.anilist.co/file/anilistcdn/media/manga/banner/30011-pkX1O0EFqvV7.jpg",
                DataConclusao = null,
                DataInicio = DateTime.Parse("2023-11-26"),
                FormatoManga = "MANGA",
                Generos = "Action, Adventure, Supernatural",
                Images = "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/nx30011-9yUF1dXWgDOx.jpg",
                NomeMangaEnglish = "Naruto",
                NomeMangaNative = "NARUTO -ナルト-",
                NomeMangaRomaji = "NARUTO",
                NomesAlternativos = "נארוטו, Наруто",
                Notas = "",
                PaisDeOrigem = "Japão",
                ProgressoCapitulo = 0,
                StatusManga = "Completo",

            };

            // Act
            var result = await controller.AddMangaToList(newListaDeLeitura);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value;

            // Usando reflexão para acessar as propriedades do objeto retornado
            var properties = returnValue.GetType().GetProperties();
            var statusProperty = properties.FirstOrDefault(p => p.Name == "status");
            var isSuccessProperty = properties.FirstOrDefault(p => p.Name == "isSuccess");
            var messageProperty = properties.FirstOrDefault(p => p.Name == "message");

            Assert.NotNull(statusProperty);
            Assert.NotNull(isSuccessProperty);
            Assert.NotNull(messageProperty);

            Assert.Equal(200, statusProperty.GetValue(returnValue));
            Assert.True((bool)isSuccessProperty.GetValue(returnValue));
            Assert.Equal("Mangá adicionado à lista de leitura!", messageProperty.GetValue(returnValue));
        }

        [Fact]
        public async Task PutListaDeLeituraTest()
        {
            // Arrange
            using var dbContext = CreateDbContextInMemory();
            var existingListaDeLeitura = new ListaDeLeitura
            {
                ListaDeLeituraId = 1,
                UsuarioId = 1,
                MangaId = 30011,
                AnoDePublicacao = 1999,
                DataConclusao = null,
                DataInicio = DateTime.Parse("2023-11-20"),
                Notas = "teste",
                ProgressoCapitulo = 50,
                StatusManga = "lendo",
            };
            dbContext.listasDeLeitura.Add(existingListaDeLeitura);
            await dbContext.SaveChangesAsync();

            var updatedListaDeLeitura = new ListaDeLeitura
            {
                ListaDeLeituraId = existingListaDeLeitura.ListaDeLeituraId,
                UsuarioId = existingListaDeLeitura.UsuarioId,
                MangaId = existingListaDeLeitura.MangaId,
                ProgressoCapitulo = 2
            };

            var controller = new ListaDeLeituraController(dbContext);
            

            // Act
            var result = await controller.PutListaDeLeitura(updatedListaDeLeitura);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var listaDeLeitura = await dbContext.listasDeLeitura.FindAsync(existingListaDeLeitura.ListaDeLeituraId);
            Assert.Equal(2, listaDeLeitura.ProgressoCapitulo);
        }


        [Fact]
        public async Task GetListaDeLeituraTest()
        {
            // Arrange
            using var dbContext = CreateDbContextInMemory();
            var listaDeLeitura = new ListaDeLeitura
            {
                ListaDeLeituraId = 1,

            };
            dbContext.listasDeLeitura.Add(listaDeLeitura);
            dbContext.SaveChanges();

            var controller = new ListaDeLeituraController(dbContext);

            // Act
            var result = await controller.GetListaDeLeitura(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ListaDeLeitura>>(result);
            var returnedListaDeLeitura = Assert.IsType<ListaDeLeitura>(actionResult.Value);
            Assert.Equal(1, returnedListaDeLeitura.ListaDeLeituraId);
        }
    }
}
