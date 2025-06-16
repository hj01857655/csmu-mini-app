@echo off
echo.
echo ========================================
echo CSMU教务系统 - 部署前配置检查
echo ========================================
echo.

REM 检查Node.js环境
echo 🔍 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装Node.js或Node.js不在PATH中
    pause
    exit /b 1
) else (
    echo ✅ Node.js环境正常
)

REM 检查必需文件
echo.
echo 📁 检查必需文件...
if exist "services\api.js" (
    echo ✅ services\api.js
) else (
    echo ❌ 缺少 services\api.js
)

if exist "config\index.js" (
    echo ✅ config\index.js
) else (
    echo ❌ 缺少 config\index.js
)

if exist "manifest.json" (
    echo ✅ manifest.json
) else (
    echo ❌ 缺少 manifest.json
)

if exist "pages.json" (
    echo ✅ pages.json
) else (
    echo ❌ 缺少 pages.json
)

REM 检查环境配置文件
echo.
echo 🌍 检查环境配置文件...
if exist ".env.production" (
    echo ✅ .env.production 存在
) else (
    echo ⚠️ 建议创建 .env.production 文件
)

if exist ".env.local" (
    echo ✅ .env.local 存在
) else (
    echo ⚠️ 建议创建 .env.local 文件用于本地配置
)

REM 运行配置验证脚本
echo.
echo 🔧 运行配置验证...
node scripts\validate-config.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ 配置验证失败！请检查上述错误。
    echo.
    echo 💡 部署建议：
    echo    1. 更新API地址为生产环境地址
    echo    2. 确保禁用模拟数据
    echo    3. 配置HTTPS和安全选项
    echo    4. 检查小程序域名白名单
    pause
    exit /b 1
) else (
    echo.
    echo ✅ 配置验证通过！
    echo.
    echo 🚀 可以开始部署流程：
    echo    1. 使用HBuilderX打开项目
    echo    2. 选择发行 - 小程序-微信
    echo    3. 配置小程序信息
    echo    4. 上传代码到微信小程序平台
)

echo.
echo ========================================
echo 检查完成
echo ========================================
pause
