using Azure.Identity;
using MangaNovelsAPI.Models;
using Microsoft.EntityFrameworkCore;
using Azure.Security.KeyVault.Secrets;


var builder = WebApplication.CreateBuilder(args);

var azureKeyVaultName = builder.Configuration["AzureKeyVaultName"];
var azureKeyVaultSecretName = builder.Configuration["AzureKeyVaultSecretName"];

var secretClient = new SecretClient(new Uri($"https://safemangareadkey.vault.azure.net"), new DefaultAzureCredential());


        if (!string.IsNullOrEmpty(azureKeyVaultSecretName))
        {
            var secretResponse = secretClient.GetSecret(azureKeyVaultSecretName);

            if (secretResponse != null)
            {
                var secretValue = secretResponse.Value.Value;

                // Use a senha recuperada do Azure Key Vault para a configuração do banco de dados.
                var connectionString = builder.Configuration.GetConnectionString("DevConnection");
                connectionString = connectionString.Replace("SECRET_NAME_HERE", secretValue);
                builder.Configuration["ConnectionStrings:DevConnection"] = connectionString;
            }
        }


var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://127.0.0.1:5500")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                      });
});


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<APIdbcontext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DevConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();