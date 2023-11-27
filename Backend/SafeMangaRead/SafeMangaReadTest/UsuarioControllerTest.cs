using System;
using System.Threading.Tasks;
using MangaNovelsAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafeMangaRead.Controllers;
using UsuarioAPI.Models;
using Xunit;

namespace SafeMangaReadTest
{
    public class UsuarioControllerTest
    {
        [Fact]
        private APIdbcontext CreateDbContextInMemory()
        {
            var options = new DbContextOptionsBuilder<APIdbcontext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            return new APIdbcontext(options);
        }

        [Fact]
        public async Task PostUsuarioTest()
        {
            // Arrange
            using var dbContext = CreateDbContextInMemory();
            var controller = new UsuarioController(dbContext);
            var newUser = new Usuario
            {
                UsuarioName = "teste",
                UsuarioNascimento = DateTime.Parse("2023-11-26T18:53:15.040Z"),
                UsuarioEmail = "testeParaTest",
                UsuarioSenha = "Teste@123"
            };

            // Act
            var result = await controller.PostUsuario(newUser);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<Usuario>(createdResult.Value);
            Assert.Equal(newUser.UsuarioEmail, returnValue.UsuarioEmail);
        }

        [Fact]
        public async Task PutUsuarioTest()
        {
            // Arrange
            using var dbContext = CreateDbContextInMemory();
            var existingUser = new Usuario
            {
                UsuarioId = 1,
                UsuarioName = "teste",
                UsuarioNascimento = DateTime.Parse("2023-11-26T18:53:15.040Z"),
                UsuarioEmail = "testeParaTest",
                UsuarioSenha = "Teste@123"
            };
            dbContext.usuarios.Add(existingUser);
            await dbContext.SaveChangesAsync();

            var controller = new UsuarioController(dbContext);

            // Atualize a entidade existente em vez de criar uma nova
            existingUser.UsuarioName = "novoNome";
            existingUser.UsuarioEmail = "novoNome";
            existingUser.UsuarioSenha = "novoNome@123";


            // Act
            var result = await controller.PutUsuario(1, existingUser);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var user = await dbContext.usuarios.FindAsync(1);
            Assert.Equal("novoNome", user.UsuarioName);
            Assert.Equal("novoNome", user.UsuarioEmail);
            // Verifique outras propriedades conforme necessário
        }




        [Fact]
        public async Task GetUsuarioTest()
        {
            // Arrange
            using var dbContext = CreateDbContextInMemory();
            var user = new Usuario { UsuarioId = 1, UsuarioEmail = "novoNome", UsuarioSenha = "Senha123" };
            dbContext.usuarios.Add(user);
            dbContext.SaveChanges();

            var controller = new UsuarioController(dbContext);

            // Act
            var result = await controller.GetUsuario(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Usuario>>(result);
            var returnedUser = Assert.IsType<Usuario>(actionResult.Value);
            Assert.Equal("novoNome", returnedUser.UsuarioEmail);
        }
    }
}
