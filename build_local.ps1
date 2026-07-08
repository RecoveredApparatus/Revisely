$ErrorActionPreference = "Stop"
$ProgressPreference = 'SilentlyContinue'
$baseDir = "C:\Users\ACER\Downloads\Revisely"
$toolsDir = "$baseDir\_build_tools"
if (-Not (Test-Path $toolsDir)) { New-Item -ItemType Directory -Force -Path $toolsDir }

Write-Host "Downloading JDK 17 (180MB)..."
$jdkZip = "$toolsDir\jdk.zip"
if (-Not (Test-Path $jdkZip)) { Invoke-WebRequest -Uri "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.11%2B9/OpenJDK17U-jdk_x64_windows_hotspot_17.0.11_9.zip" -OutFile $jdkZip }
Write-Host "Extracting JDK..."
if (-Not (Test-Path "$toolsDir\jdk")) { Expand-Archive -Path $jdkZip -DestinationPath "$toolsDir\jdk" -Force }

Write-Host "Downloading Android SDK Command-line Tools (130MB)..."
$sdkZip = "$toolsDir\cmdline-tools.zip"
if (-Not (Test-Path $sdkZip)) { Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip" -OutFile $sdkZip }
$sdkDir = "$toolsDir\android_sdk"
Write-Host "Extracting SDK Tools..."
if (-Not (Test-Path "$sdkDir\cmdline-tools\latest")) { 
    Expand-Archive -Path $sdkZip -DestinationPath "$sdkDir\cmdline-tools" -Force 
    Rename-Item "$sdkDir\cmdline-tools\cmdline-tools" "latest"
}

Write-Host "Setting Environment Variables..."
$env:JAVA_HOME = (Get-ChildItem -Path "$toolsDir\jdk" -Directory)[0].FullName
$env:ANDROID_HOME = $sdkDir
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:PATH"

Write-Host "Accepting Android Licenses..."
1..20 | ForEach-Object { "y" } | sdkmanager.bat --licenses

Write-Host "Running expo prebuild..."
cd $baseDir
cmd /c "npx expo prebuild -p android --clean --no-interactive"

Write-Host "Building APK..."
cd android
.\gradlew.bat assembleDebug

Write-Host "Moving APK to project root..."
cd $baseDir
Copy-Item "android\app\build\outputs\apk\debug\app-debug.apk" "Revisely-Widget.apk" -Force

Write-Host "Cleaning up 500MB+ build tools as promised..."
Remove-Item -Path $toolsDir -Recurse -Force

Write-Host "Build complete! APK is located at: $baseDir\Revisely-Widget.apk"
