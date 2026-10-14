# Stage 1: Build the application using .NET 10 SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["TaskTrackerApi.csproj", "./"]
RUN dotnet restore "TaskTrackerApi.csproj"

# Copy source files and build Release package
COPY . .
RUN dotnet publish "TaskTrackerApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Create minimal Linux runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copy compiled binaries from build stage
COPY --from=build /app/publish .

# Expose Kestrel web server port
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

# Start .NET 10 application
ENTRYPOINT ["dotnet", "TaskTrackerApi.dll"]
