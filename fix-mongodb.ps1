# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run this script as administrator"
    exit 1
}

# Stop MongoDB service if running
Write-Host "Stopping MongoDB service..."
Stop-Service -Name "MongoDB" -Force -ErrorAction SilentlyContinue

# Get MongoDB service
$service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if (-not $service) {
    Write-Host "MongoDB service not found. Please install MongoDB first."
    exit 1
}

# Set service to start automatically
Write-Host "Setting MongoDB service to start automatically..."
Set-Service -Name "MongoDB" -StartupType Automatic

# Set service permissions
Write-Host "Setting MongoDB service permissions..."
$servicePath = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
if (Test-Path $servicePath) {
    $acl = Get-Acl $servicePath
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule("NT AUTHORITY\SYSTEM", "FullControl", "Allow")
    $acl.SetAccessRule($rule)
    Set-Acl -Path $servicePath -AclObject $acl
}

# Start MongoDB service
Write-Host "Starting MongoDB service..."
Start-Service -Name "MongoDB"

# Check if service started successfully
Start-Sleep -Seconds 5
$service = Get-Service -Name "MongoDB"
if ($service.Status -eq "Running") {
    Write-Host "MongoDB service started successfully!"
} else {
    Write-Host "Failed to start MongoDB service. Please check the logs at:"
    Write-Host "C:\Program Files\MongoDB\Server\7.0\log\mongod.log"
}

# Verify MongoDB is listening
Write-Host "Verifying MongoDB is listening on port 27017..."
$port = 27017
$listener = New-Object System.Net.Sockets.TcpClient
try {
    $listener.Connect("localhost", $port)
    Write-Host "MongoDB is listening on port 27017"
} catch {
    Write-Host "MongoDB is not listening on port 27017. Please check the logs."
}
finally {
    $listener.Close()
}
