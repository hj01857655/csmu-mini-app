#!/usr/bin/env node

/**
 * CSMU教务系统 - 配置验证脚本
 * 用于验证部署前的配置是否正确
 */

const fs = require('fs');
const path = require('path');

class ConfigValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.suggestions = [];
        this.currentEnv = process.env.NODE_ENV || 'development';
    }

    /**
     * 运行所有验证
     */
    async runAllValidations() {
        console.log('🔍 开始配置验证...\n');

        // 验证环境变量
        this.validateEnvironmentVariables();
        
        // 验证API配置
        this.validateApiConfig();
        
        // 验证文件存在性
        this.validateRequiredFiles();
        
        // 验证生产环境特定配置
        if (this.currentEnv === 'production') {
            this.validateProductionConfig();
        }

        // 输出验证结果
        this.outputResults();
        
        // 返回验证状态
        return this.errors.length === 0;
    }

    /**
     * 验证环境变量
     */
    validateEnvironmentVariables() {
        console.log('📋 验证环境变量...');

        const requiredVars = [
            'NODE_ENV',
            'VUE_APP_API_BASE_URL'
        ];

        const recommendedVars = [
            'VUE_APP_ENABLE_MOCK',
            'VUE_APP_DEBUG',
            'VUE_APP_API_TIMEOUT'
        ];

        // 检查必需变量
        requiredVars.forEach(varName => {
            if (!process.env[varName]) {
                this.errors.push(`缺少必需的环境变量: ${varName}`);
            } else {
                console.log(`  ✅ ${varName}: ${process.env[varName]}`);
            }
        });

        // 检查推荐变量
        recommendedVars.forEach(varName => {
            if (!process.env[varName]) {
                this.warnings.push(`建议设置环境变量: ${varName}`);
            } else {
                console.log(`  ✅ ${varName}: ${process.env[varName]}`);
            }
        });

        console.log('');
    }

    /**
     * 验证API配置
     */
    validateApiConfig() {
        console.log('🔗 验证API配置...');

        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
        
        if (apiBaseUrl) {
            // 检查URL格式
            try {
                const url = new URL(apiBaseUrl);
                console.log(`  ✅ API地址格式正确: ${apiBaseUrl}`);
                
                // 检查协议
                if (this.currentEnv === 'production' && url.protocol !== 'https:') {
                    this.warnings.push('生产环境建议使用HTTPS协议');
                }
                
                // 检查是否为localhost
                if (this.currentEnv === 'production' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
                    this.errors.push('生产环境不应使用localhost地址');
                }
                
            } catch (error) {
                this.errors.push(`API地址格式错误: ${apiBaseUrl}`);
            }
        }

        // 检查模拟数据配置
        const enableMock = process.env.VUE_APP_ENABLE_MOCK;
        if (this.currentEnv === 'production' && enableMock === 'true') {
            this.errors.push('生产环境不应启用模拟数据');
        }

        console.log('');
    }

    /**
     * 验证必需文件
     */
    validateRequiredFiles() {
        console.log('📁 验证必需文件...');

        const requiredFiles = [
            'services/api.js',
            'config/index.js',
            'utils/env-config-validator.js',
            'manifest.json',
            'pages.json'
        ];

        const requiredDirs = [
            'pages',
            'components',
            'utils',
            'services'
        ];

        // 检查文件
        requiredFiles.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                console.log(`  ✅ ${filePath}`);
            } else {
                this.errors.push(`缺少必需文件: ${filePath}`);
            }
        });

        // 检查目录
        requiredDirs.forEach(dirPath => {
            if (fs.existsSync(dirPath)) {
                console.log(`  ✅ ${dirPath}/`);
            } else {
                this.errors.push(`缺少必需目录: ${dirPath}`);
            }
        });

        console.log('');
    }

    /**
     * 验证生产环境特定配置
     */
    validateProductionConfig() {
        console.log('🚀 验证生产环境配置...');

        // 检查环境变量文件
        if (fs.existsSync('.env.production')) {
            console.log('  ✅ .env.production 文件存在');
        } else {
            this.warnings.push('建议创建 .env.production 文件');
        }

        // 检查调试配置
        if (process.env.VUE_APP_DEBUG === 'true') {
            this.warnings.push('生产环境建议禁用调试模式');
        }

        // 检查日志配置
        if (process.env.VUE_APP_ENABLE_LOG_UPLOAD !== 'true') {
            this.suggestions.push('生产环境建议启用日志上传');
        }

        // 检查HTTPS强制
        if (process.env.VUE_APP_FORCE_HTTPS !== 'true') {
            this.warnings.push('生产环境建议强制使用HTTPS');
        }

        console.log('');
    }

    /**
     * 输出验证结果
     */
    outputResults() {
        console.log('📊 验证结果汇总');
        console.log('='.repeat(50));

        // 基本信息
        console.log(`🌍 当前环境: ${this.currentEnv}`);
        console.log(`🔗 API地址: ${process.env.VUE_APP_API_BASE_URL || '未设置'}`);
        console.log(`🎭 模拟数据: ${process.env.VUE_APP_ENABLE_MOCK || '未设置'}`);
        console.log('');

        // 错误
        if (this.errors.length > 0) {
            console.log('❌ 错误:');
            this.errors.forEach(error => {
                console.log(`   • ${error}`);
            });
            console.log('');
        }

        // 警告
        if (this.warnings.length > 0) {
            console.log('⚠️ 警告:');
            this.warnings.forEach(warning => {
                console.log(`   • ${warning}`);
            });
            console.log('');
        }

        // 建议
        if (this.suggestions.length > 0) {
            console.log('💡 建议:');
            this.suggestions.forEach(suggestion => {
                console.log(`   • ${suggestion}`);
            });
            console.log('');
        }

        // 总结
        if (this.errors.length === 0) {
            console.log('✅ 配置验证通过！');
            if (this.warnings.length > 0) {
                console.log('⚠️ 存在警告，建议检查后再部署。');
            }
        } else {
            console.log('❌ 配置验证失败！请修复错误后重试。');
        }

        console.log('='.repeat(50));
    }

    /**
     * 生成配置建议
     */
    generateConfigSuggestions() {
        const suggestions = {
            development: {
                'VUE_APP_API_BASE_URL': 'http://localhost:8000/api/v1',
                'VUE_APP_ENABLE_MOCK': 'true',
                'VUE_APP_DEBUG': 'true',
                'VUE_APP_FORCE_HTTPS': 'false'
            },
            production: {
                'VUE_APP_API_BASE_URL': 'https://api.csmu.edu.cn/api/v1',
                'VUE_APP_ENABLE_MOCK': 'false',
                'VUE_APP_DEBUG': 'false',
                'VUE_APP_FORCE_HTTPS': 'true',
                'VUE_APP_ENABLE_LOG_UPLOAD': 'true'
            }
        };

        return suggestions[this.currentEnv] || suggestions.development;
    }
}

// 主函数
async function main() {
    const validator = new ConfigValidator();
    const isValid = await validator.runAllValidations();
    
    // 如果验证失败，退出并返回错误码
    if (!isValid) {
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(error => {
        console.error('验证过程中发生错误:', error);
        process.exit(1);
    });
}

module.exports = ConfigValidator;
