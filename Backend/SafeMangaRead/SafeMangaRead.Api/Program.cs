using MangaNovelsAPI.Models;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

DotNetEnv.Env.Load();

builder.Services.AddDbContext<APIdbcontext>(options =>
{
    // Agora você pode acessar as variáveis de ambiente, incluindo a senha do banco de dados
    string dbPassword = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");

    var connectionString = $"Server=tcp:server-trcnf5ssqiqfc.database.windows.net,1433;Initial Catalog=db-trcnf5ssqiqfc;Persist Security Info=False;User ID=zmgxljeq;Password={dbPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

    options.UseSqlServer(connectionString);
});

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