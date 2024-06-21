goog.loadJs('electron', () => {

goog.require('layui');
goog.require('path');
goog.require('Mustache');
goog.require('Mixly.Env');
goog.require('Mixly.FSBoard');
goog.require('Mixly.LayerExt');
goog.require('Mixly.Debug');
goog.require('Mixly.Msg');
goog.require('Mixly.Electron.Shell');
goog.provide('Mixly.Electron.FSBoard');

const {
    Env,
    FSBoard,
    LayerExt,
    Debug,
    Msg,
    Electron = {}
} = Mixly;

const { Shell } = Electron;

const fs_extra = Mixly.require('fs-extra');

const { layer } = layui;


class FSBoardExt extends FSBoard {
    static {
        this.TOOLS_INFO = goog.getJSON(path.join(Env.srcDirPath, 'tools/filesystem/info.json'));
    }

    #shell_ = null;
    constructor() {
        super();
        this.#shell_ = new Shell();
    }

    download(usrFolder, fsType) {
        return new Promise(async (resolve, reject) => {
            try {
                await super.download(usrFolder, fsType);
            } catch (error) {
                Debug.error(error);
                resolve();
                return;
            }
            const layerNum = layer.open({
                type: 1,
                title: "下载中...",
                content: $('#mixly-loader-div'),
                shade: LayerExt.SHADE_NAV,
                resize: false,
                closeBtn: 0,
                success: () => {
                    $("#mixly-loader-btn").off("click").click(() => {
                        $("#mixly-loader-btn").css('display', 'none');
                        layer.title('下载终止中...', layerNum);
                        this.cancel();
                    });
                    const { mainStatusBarTabs } = Mixly;
                    const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
                    statusBarTerminal.setValue('');
                    mainStatusBarTabs.changeTo('output');
                    const commandTemplate = this.getSelectedFSDownloadCommand();
                    const command = this.#renderTemplate_(commandTemplate);
                    this.#shell_.exec(command)
                    .then((info) => {
                        if (info.code) {
                            statusBarTerminal.addValue("\n==下载失败==\n");
                        } else {
                            statusBarTerminal.addValue(`\n==下载成功(${Msg.Lang["用时"]} ${info.time})==\n`);
                        }
                    })
                    .catch(Debug.error)
                    .finally(() => {
                        layer.close(layerNum);
                        resolve();
                    });
                },
                end: function () {
                    $("#mixly-loader-btn").off("click");
                    $("#mixly-loader-btn").css('display', 'inline-block');
                }
            });
        });
    }

    upload(usrFolder, fsType) {
        return new Promise(async (resolve, reject) => {
            try {
                await super.upload(usrFolder, fsType);
            } catch (error) {
                Debug.error(error);
                resolve();
                return;
            }
            const layerNum = layer.open({
                type: 1,
                title: "上传中...",
                content: $('#mixly-loader-div'),
                shade: LayerExt.SHADE_NAV,
                resize: false,
                closeBtn: 0,
                success: () => {
                    $("#mixly-loader-btn").off("click").click(() => {
                        $("#mixly-loader-btn").css('display', 'none');
                        layer.title('上传终止中...', layerNum);
                        this.cancel();
                    });
                    const { mainStatusBarTabs } = Mixly;
                    const statusBarTerminal = mainStatusBarTabs.getStatusBarById('output');
                    statusBarTerminal.setValue('');
                    mainStatusBarTabs.changeTo('output');
                    const commandTemplate = this.getSelectedFSUploadCommand();
                    const command = this.#renderTemplate_(commandTemplate);
                    this.#shell_.exec(command)
                    .then((info) => {
                        if (info.code) {
                            statusBarTerminal.addValue("\n==上传失败==\n");
                        } else {
                            statusBarTerminal.addValue(`\n==上传成功(${Msg.Lang["用时"]} ${info.time})==\n`);
                        }
                    })
                    .catch(Debug.error)
                    .finally(() => {
                        layer.close(layerNum);
                        resolve();
                    });
                },
                end: function () {
                    $("#mixly-loader-btn").off("click");
                    $("#mixly-loader-btn").css('display', 'inline-block');
                }
            });
        });
    }

    #renderTemplate_(template) {
        const config = this.getConfig();
        const targetFolder = path.join(Env.boardDirPath, 'build/esptool/');
        fs_extra.ensureDirSync(targetFolder);
        const fsType = this.getFSType();
        let fsTool = this.getFSToolPath();
        return Mustache.render(template, {
            ...config,
            img: `"${path.join(targetFolder, 'script.img')}"`,
            fsTool,
            python3: `"${Env.python3Path}"`,
            esptool: `"${Env.python3Path}" "${path.join(Env.srcDirPath, 'tools/python/esptool/__init__.py')}"`
        });
    }

    getFSToolPath() {
        const fsType = this.getFSType();
        let arch = 'x64';
        switch (process.arch) {
        case 'arm64':
        case 'arm':
            arch = 'arm';
            break;
        case 'ia32':
            arch = 'x32';
            break;
        case 'x64':
        default:
            arch = 'x64';
        }
        const platform = Env.currentPlatform;
        const fsToolInfo = FSBoardExt.TOOLS_INFO[`mk${fsType}`];
        return path.join(Env.srcDirPath, './tools/filesystem/', fsToolInfo[platform][arch]);
    }

    cancel() {
        this.#shell_ && this.#shell_.kill();
    }
}

Electron.FSBoard = FSBoardExt;

});