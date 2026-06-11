# OpenRobot 网站资源上传脚本
# 用于将 public 文件夹下的指定目录上传到 Blob Storage
#
# 使用方式:
#   .\scripts\Upload-Assets.ps1 [-Folders] <string[]> [-DryRun]
#
# 示例:
#   .\scripts\Upload-Assets.ps1                           # 上传 downloads,images,docs
#   .\scripts\Upload-Assets.ps1 -Folders downloads        # 仅上传 downloads
#   .\scripts\Upload-Assets.ps1 -DryRun                  # 预览要上传的文件

param(
    [string[]]$Folders = @("downloads", "images", "docs"),
    [switch]$DryRun
)

# 配置
$BLOB_STORAGE_URL = "https://pages.edgeone.ai/document/blob-storage"
$PUBLIC_DIR = Join-Path $PSScriptRoot "..\public"

# 颜色输出
function Write-Status($message, $type = "info") {
    switch ($type) {
        "success" { Write-Host $message -ForegroundColor Green }
        "error" { Write-Host $message -ForegroundColor Red }
        "warning" { Write-Host $message -ForegroundColor Yellow }
        default { Write-Host $message }
    }
}

# 格式化文件大小
function Format-FileSize($bytes) {
    if ($bytes -lt 1KB) { return "$bytes B" }
    if ($bytes -lt 1MB) { return "{0:N1} KB" -f ($bytes / 1KB) }
    return "{0:N1} MB" -f ($bytes / 1MB)
}

# 递归获取目录下的所有文件
function Get-FilesRecursively($dir, $baseDir = $dir) {
    $files = @()
    $entries = Get-ChildItem -Path $dir -Force

    foreach ($entry in $entries) {
        if ($entry.PSIsContainer) {
            $files += Get-FilesRecursively -dir $entry.FullName -baseDir $baseDir
        } elseif ($entry.Extension) {
            $relativePath = $entry.FullName.Substring($baseDir.Length + 1) -replace '\\', '/'
            $files += @{
                FullPath = $entry.FullName
                RelativePath = $relativePath
                Size = $entry.Length
            }
        }
    }

    return $files
}

# 上传单个文件到 Blob Storage
function Upload-File($file, $storageUrl) {
    $remoteUrl = "$storageUrl/$($file.RelativePath)"

    try {
        $result = curl.exe -X PUT -T $file.FullPath $remoteUrl -H "Content-Type: application/octet-stream" 2>&1
        return $true
    } catch {
        Write-Status "  上传失败: $_" "error"
        return $false
    }
}

# 主函数
function Main() {
    Write-Host ""
    Write-Host "========================================"
    Write-Host "  OpenRobot 资源上传脚本"
    Write-Host "========================================"
    Write-Host ""

    Write-Host "Blob Storage: $BLOB_STORAGE_URL"
    Write-Host "要上传的文件夹: $($Folders -join ', ')"
    Write-Host "模式: $(if ($DryRun) { '预览 (dry-run)' } else { '实际执行' })"
    Write-Host ""

    # 获取所有要上传的文件
    $allFiles = @()

    foreach ($folder in $Folders) {
        $folderPath = Join-Path $PUBLIC_DIR $folder

        if (Test-Path $folderPath) {
            $files = Get-FilesRecursively -dir $folderPath -baseDir $folderPath
            $allFiles += $files
            Write-Status "✓ 找到文件夹: $folder ($($files.Count) 个文件)" "success"
        } else {
            Write-Status "○ 跳过不存在的文件夹: $folder" "warning"
        }
    }

    if ($allFiles.Count -eq 0) {
        Write-Host ""
        Write-Status "没有找到要上传的文件。" "warning"
        Write-Host ""
        return
    }

    Write-Host ""
    Write-Host "找到 $($allFiles.Count) 个文件待上传:"
    Write-Host "----------------------------------------"

    # 显示文件列表
    foreach ($file in $allFiles) {
        $sizeStr = Format-FileSize $file.Size
        Write-Host "  $($file.RelativePath.PadRight(50)) $($sizeStr.PadLeft(10))"
    }
    Write-Host "----------------------------------------"
    Write-Host "总计: $($allFiles.Count) 个文件"
    $totalSize = ($allFiles | Measure-Object -Property Size -Sum).Sum
    Write-Host "大小: $(Format-FileSize $totalSize)"
    Write-Host ""

    if ($DryRun) {
        Write-Status "这是预览模式，不会实际上传文件。" "warning"
        Write-Host ""
        return
    }

    # 执行上传
    Write-Status "开始上传..." "info"
    Write-Host ""

    $successCount = 0
    $failCount = 0

    foreach ($file in $allFiles) {
        Write-Host -NoNewline "  上传: $($file.RelativePath) ... "
        $success = Upload-File -file $file -storageUrl $BLOB_STORAGE_URL

        if ($success) {
            Write-Status "✓" "success"
            $successCount++
        } else {
            Write-Status "✗" "error"
            $failCount++
        }
    }

    Write-Host ""
    Write-Host "========================================"
    Write-Status "上传完成: $successCount 成功, $failCount 失败"
    Write-Host "========================================"
    Write-Host ""
}

Main
