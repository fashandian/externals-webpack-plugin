const { ExternalModule } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PLUGIN_NAME = 'externalsWebpackPlugin';

class ExternalsWebpackPlugin {

    constructor(options) {
        this.options = options;
        this.transformLib = Object.keys(options);
        this.usedLib = new Set();

    }

    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (normalModuleFactory) => {
            normalModuleFactory.hooks.factorize.tapAsync(PLUGIN_NAME, (resolveData, callback) => {
                const requireModuleName = resolveData.request;
                if (this.transformLib.includes(requireModuleName)) {
                    const externalModuleName = this.options[requireModuleName].namespace;
                    callback(null, new ExternalModule(externalModuleName, 'window', externalModuleName));
                } else {
                    callback();
                }
            });

            normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, (parser) => {
                this.importHandler(parser);
                this.requireHandler(parser);
            });
        });

        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(PLUGIN_NAME, (data) => {
                const scriptTag = data.assetTags.scripts;
                this.usedLib.forEach(lib => {
                    scriptTag.unshift({
                        tagName: 'script',
                        voidTag: false,
                        meta: {
                            plugin: PLUGIN_NAME
                        },
                        attributes: {
                            defer: true,
                            type: undefined,
                            src: this.options[lib].src
                        }
                    })
                });
            });
        });
    }

    importHandler(parser) {
        parser.hooks.import.tap(PLUGIN_NAME, (statement, source) => {
            if (this.transformLib.includes(source)) {
                this.usedLib.add(source);
            }
        });
    }

    requireHandler(parser) {
        parser.hooks.call.for('require').tap(PLUGIN_NAME, (expression) => {
            const moduleName = expression.arguments[0].value;
            if (this.transformLib.includes(moduleName)) {
                this.usedLib.add(moduleName);
            }
        });
    }
}

module.exports = ExternalsWebpackPlugin;