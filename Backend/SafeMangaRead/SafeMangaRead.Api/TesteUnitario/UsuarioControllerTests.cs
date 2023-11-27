using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using MangaNovelsAPI.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using UsuarioAPI.Models;
using Xunit;
[assembly: InternalsVisibleTo("SafeMangaRead.Api")]

namespace SafeMangaRead.Tests
{
    public class UsuarioControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        internal UsuarioControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetUsuarios_ReturnsSuccessStatusCode()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/Usuario");

            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetUsuario_ReturnsSuccessStatusCode()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/Usuario/1"); // Substitua 1 pelo ID desejado

            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task PostUsuario_ReturnsSuccessStatusCode()
        {
            // Arrange
            var client = _factory.CreateClient();
            var usuario = new Usuario
            {
                // Preencha os dados do usuário conforme necessário
            };
            var content = new StringContent(JsonConvert.SerializeObject(usuario), Encoding.UTF8, "application/json");

            // Act
            var response = await client.PostAsync("/api/Usuario", content);

            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // Adicione mais testes para os outros métodos do UsuarioController conforme necessário
    }
}
