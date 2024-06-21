goog.loadJs('common', () => {

goog.require('path');
goog.require('layui');
goog.require('Mprogress');
goog.require('$.select2');
goog.require('Mixly.Env');
goog.require('Mixly.PageBase');
goog.require('Mixly.HTMLTemplate');
goog.require('Mixly.Debug');
goog.require('Mixly.Component');
goog.require('Mixly.Registry');
goog.require('Mixly.Serial');
goog.require('Mixly.FSBoardHandler');
goog.require('Mixly.Electron.FS');
goog.require('Mixly.Electron.FSBoard');
goog.provide('Mixly.StatusBarFS');

const {
    Env,
    PageBase,
    HTMLTemplate,
    Debug,
    Component,
    Registry,
    Serial,
    FSBoardHandler,
    Electron = {}
} = Mixly;

const { FS, FSBoard } = Electron;

const { layer } = layui;

const os = Mixly.require('os');


class Panel extends Component {
    static {
        HTMLTemplate.add(
            'html/statusbar/statusbar-fs-panel.html',
            new HTMLTemplate(goog.get(path.join(Env.templatePath, 'html/statusbar/statusbar-fs-panel.html')))
        );
    }

    #$folderInput_ = null;
    #$closeBtn_ = null;
    #$selectFolderBtn_ = null;
    #$downloadBtn_ = null;
    #$uploadBtn_ = null;
    #$fsSelect_ = null;
    #mprogress_ = null;
    #folderPath_ = '';
    #fs_ = 'default';
    #opened_ = false;

    constructor() {
        super();
        const template = HTMLTemplate.get('html/statusbar/statusbar-fs-panel.html');
        const $content = $(template.render());
        this.setContent($content);
        this.#$folderInput_ = $content.find('.folder-input');
        this.#$closeBtn_ = $content.find('.close-btn');
        this.#$selectFolderBtn_ = $content.find('.folder-btn');
        this.#$downloadBtn_ = $content.find('.download-btn');
        this.#$uploadBtn_ = $content.find('.upload-btn');
        this.#$fsSelect_ = $content.find('.fs-type');
        this.#mprogress_ = new Mprogress({
            template: 3,
            parent: `div[m-id="${template.getId()}"] > .card-header > .progress`
        });
        this.addEventsType(['download', 'upload']);
        this.#addEventsListener_();
        this.#$fsSelect_.select2({
            width: '100%',
            minimumResultsForSearch: 50,
            dropdownCssClass: 'mixly-scrollbar'
        });
    }

    #addEventsListener_() {
        this.#$fsSelect_.on('select2:select', (event) => {
            const { data } = event.params;
            this.#fs_ = data.id;
        });

        this.#$closeBtn_.click(() => {
            this.dispose();
        });

        this.#$selectFolderBtn_.click(() => {
            FS.showDirectoryPicker()
            .then((folderPath) => {
                if (!folderPath) {
                    return;
                }
                this.#folderPath_ = path.join(folderPath);
                this.#$folderInput_.val(this.#folderPath_);
            })
            .catch(Debug.error);
        });

        this.#$downloadBtn_.click(() => {
            this.#checkFolder_()
            .then((status) => {
                if (!status) {
                    return;
                }
                this.runEvent('download', {
                    folderPath: this.#folderPath_,
                    fsType: this.#fs_
                });
            })
            .catch(Debug.error);
        });

        this.#$uploadBtn_.click(() => {
            this.#checkFolder_()
            .then((status) => {
                if (!status) {
                    return;
                }
                this.runEvent('upload', {
                    folderPath: this.#folderPath_,
                    fsType: this.#fs_
                });
            })
            .catch(Debug.error);
        });
    }

    #checkFolder_() {
        return new Promise((resolve, reject) => {
            if (!this.#folderPath_) {
                layer.msg('本地映射目录不存在', { time: 1000 });
                resolve(false);
                return;
            }
            FS.isDirectory(this.#folderPath_)
            .then((status) => {
                if (status) {
                    resolve(true);
                } else {
                    layer.msg('本地映射目录不存在', { time: 1000 });
                    resolve(false);
                }
            })
            .catch(reject);
        });
    }

    setFSMenu(menu) {
        this.#$fsSelect_.empty();
        this.#fs_ = menu[0].id;
        for (let i in menu) {
            this.#$fsSelect_.append(new Option(menu[i].text, menu[i].id));
        }
    }

    setStatus(isOpened) {
        if (this.#opened_ === isOpened) {
            return;
        }
        this.#opened_ = isOpened;
        if (isOpened) {
            this.#mprogress_.start();
        } else {
            this.#mprogress_.end();
        }
    }

    dispose() {
        this.#$fsSelect_.select2('destroy');
        super.dispose();
    }
}


class StatusBarFS extends PageBase {
    static {
        HTMLTemplate.add(
            'html/statusbar/statusbar-fs.html',
            new HTMLTemplate(goog.get(path.join(Env.templatePath, 'html/statusbar/statusbar-fs.html')))
        );
    }

    #$btn_ = null;
    #fsBoard_ = null;
    #$close_ = null;
    #registry_ = new Registry();
    #opened_ = false;

    constructor() {
        super();
        const template = HTMLTemplate.get('html/statusbar/statusbar-fs.html');
        const $content = $(template.render());
        this.setContent($content);
        this.#$btn_ = $content.find('.manage-btn');
        this.#fsBoard_ = new FSBoard();
        this.#fsBoard_.setHandler(new FSBoardHandler());
        this.#addEventsListener_();
    }

    #addEventsListener_() {
        this.#$btn_.click(() => {
            this.addPanel();
        });
    }

    init() {
        this.addDirty();
        const $tab = this.getTab();
        this.#$close_ = $tab.find('.chrome-tab-close');
        this.#$close_.addClass('layui-badge-dot layui-bg-blue');
    }

    setStatus(isOpened) {
        if (this.#opened_ === isOpened || !this.#$close_) {
            return;
        }
        this.#opened_ = isOpened;
        if (isOpened) {
            this.#$close_.removeClass('layui-bg-blue');
            this.#$close_.addClass('layui-bg-orange');
        } else {
            this.#$close_.removeClass('layui-bg-orange');
            this.#$close_.addClass('layui-bg-blue');
        }
    }

    addPanel() {
        const panel = new Panel();
        panel.setFSMenu(this.#fsBoard_.getHandler().getFSMenu());
        this.#$btn_.parent().before(panel.getContent());
        this.#registry_.register(panel.getId(), panel);
        panel.bind('download', (config) => {
            this.#ensureSerial_()
            .then((status) => {
                if (!status) {
                    return;
                }
                this.setStatus(true);
                // panel.setStatus(true);
                return this.#fsBoard_.download(config.folderPath, config.fsType);
            })
            .catch(Debug.error)
            .finally(() => {
                this.setStatus(false);
                // panel.setStatus(false);
            });
        });

        panel.bind('upload', (config) => {
            this.#ensureSerial_()
            .then((status) => {
                if (!status) {
                    return;
                }
                this.setStatus(true);
                // panel.setStatus(true);
                return this.#fsBoard_.upload(config.folderPath, config.fsType);
            })
            .catch(Debug.error)
            .finally(() => {
                this.setStatus(false);
                // panel.setStatus(false);
            });
        });

        panel.bind('destroyed', () => {
            this.#registry_.unregister(panel.getId());
        });
    }

    #ensureSerial_() {
        return new Promise((resolve, reject) => {
            const port = Serial.getSelectedPortName();
            if (!port) {
                layer.msg('无可用设备', { time: 1000 });
                resolve(false);
                return;
            }
            const { mainStatusBarTabs } = Mixly;
            const statusBarSerial = mainStatusBarTabs.getStatusBarById(port);
            let closePromise = Promise.resolve();
            if (statusBarSerial) {
                closePromise = statusBarSerial.getSerial().close();
            }
            closePromise.then(() => {
                resolve(true);
            }).catch(reject);
        });
    }

    dispose() {
        for (let id of this.#registry_.keys()) {
            this.#registry_.getItem(id).dispose();
        }
        this.#registry_.reset();
        super.dispose();
    }

    setHandler(handler) {
        this.#fsBoard_.setHandler(handler);
    }
}

Mixly.StatusBarFS = StatusBarFS;

});