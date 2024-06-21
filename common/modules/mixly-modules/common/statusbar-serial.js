goog.loadJs('common', () => {

goog.require('path');
goog.require('dayjs');
goog.require('$.select2');
goog.require('Mixly.Env');
goog.require('Mixly.Msg');
goog.require('Mixly.Debug');
goog.require('Mixly.StatusBar');
goog.require('Mixly.SideBarsManager');
goog.require('Mixly.HTMLTemplate');
goog.require('Mixly.PageBase');
goog.require('Mixly.ContextMenu');
goog.require('Mixly.StatusBarSerialOutput');
goog.require('Mixly.StatusBarSerialChart');
goog.require('Mixly.Electron.Serial');
goog.require('Mixly.Web.Serial');
goog.provide('Mixly.StatusBarSerial');

const {
    Env,
    Msg,
    Debug,
    StatusBar,
    SideBarsManager,
    RightSideBarsManager,
    HTMLTemplate,
    PageBase,
    ContextMenu,
    StatusBarSerialOutput,
    StatusBarSerialChart,
    Electron = {},
    Web = {}
} = Mixly;

const { Serial } = goog.isElectron ? Electron : Web;


class StatusBarSerial extends PageBase {
    static {
        HTMLTemplate.add(
            'html/statusbar/statusbar-serial.html',
            new HTMLTemplate(goog.get(path.join(Env.templatePath, 'html/statusbar/statusbar-serial.html')))
        );
        SideBarsManager.typesRegistry.register(['serial_output'], StatusBarSerialOutput);
        SideBarsManager.typesRegistry.register(['serial_chart'], StatusBarSerialChart);

        this.getMenu = function () {
            let ports = [];
            let menu = { list: ports };
            Serial.getCurrentPortsName().map((name) => {
                ports.push(name);
            });
            if (!ports.length) {
                menu.empty = Msg.Lang['无可用串口'];
            }
            return menu;
        }
    }

    #$close_ = null;
    #opened_ = false;
    #valueTemp_ = '';
    #$sendInput_ = null;
    #$settingMenu_ = null;
    #$scroll_ = null;
    #$timestamp_ = null;
    #$dtr_ = null;
    #$rts_ = null;
    #$hex_ = null;
    #manager_ = null;
    #output_ = null;
    #chart_ = null;
    #serial_ = null;
    #port_ = '';
    #config_ = {
        baud: 115200,
        dtr: true,
        rts: false,
        sendWith: '\r\n',
        hex: false
    };
    #dropdownMenu_ = null;
    #addTimestamp_ = false;
    #maxLine_ = 200;
    #lastUpdate_ = 0;
    #refreshFrequency_ = 50;
    #timer_ = null;

    constructor() {
        super();
        const template = HTMLTemplate.get('html/statusbar/statusbar-serial.html');
        const $content = $(template.render());
        this.setContent($content);
        this.#$settingMenu_ = $content.find('.setting-menu');
        this.#$settingMenu_.select2({
            minimumResultsForSearch: 50,
            dropdownAutoWidth: true,
            dropdownCssClass: 'mixly-scrollbar'
        });
        this.id = template.getId();
        this.#$sendInput_ = $content.find('.send > .box > input');
        this.#$scroll_ = $content.find('.scroll');
        this.#$timestamp_ = $content.find('.timestamp');
        this.#$dtr_ = $content.find('.dtr');
        this.#$rts_ = $content.find('.rts');
        this.#$hex_ = $content.find('.hex');
        this.#manager_ = new RightSideBarsManager($content.find('.content')[0]);
        this.#manager_.add('serial_output', 'serial_output', '监视器');
        this.#manager_.add('serial_chart', 'serial_chart', '绘图器');
        this.#manager_.changeTo('serial_output');
        this.#output_ = this.#manager_.get('serial_output');
        this.#chart_ = this.#manager_.get('serial_chart');
        this.#addCommandsForOutput_();
        const config = Serial.getConfig();
        this.#config_.dtr = config.dtr;
        this.#config_.rts = config.rts;
        this.#config_.baud = config.baudRates;
        this.#config_.pointNum = config.pointNum;
        this.#config_.reset = config.ctrlDBtn;
        this.#config_.interrupt = config.ctrlCBtn;
        this.#config_.yMax = config.yMax;
        this.#config_.yMin = config.yMin;
    }

    #addCommandsForOutput_() {
        const { commands } = this.#output_.getEditor();
        commands.addCommands([{
            name: 'copy',
            bindKey: 'Ctrl-C',
            readOnly: true,
            exec: (editor) => {
                const copyText = editor.getSelectedText();
                if (!copyText) {
                    this.interrupt();
                    return true;
                }
                return false;
            }
        }, {
            name: 'reset',
            bindKey: 'Ctrl-D',
            readOnly: true,
            exec: (editor) => {
                this.reset();
                return true;
            }
        }]);
    }

    #addContextMenuItemsForOutput_() {
        let menu = this.#output_.getContextMenu().getItem('code');
        menu.add({
            weight: 1,
            type: 'sep1',
            preconditionFn: () => {
                return this.portExit();
            },
            data: '---------'
        });
        if (this.#config_.interrupt) {
            menu.add({
                weight: 2,
                type: 'interrupt',
                preconditionFn: () => {
                    return this.portExit();
                },
                data: {
                    isHtmlName: true,
                    name: ContextMenu.getItem('中断', 'Ctrl+C'),
                    callback: (key, opt) => this.interrupt().catch(Debug.error)
                }
            });
        }
        if (this.#config_.reset) {
            menu.add({
                weight: 3,
                type: 'reset',
                preconditionFn: () => {
                    return this.portExit();
                },
                data: {
                    isHtmlName: true,
                    name: ContextMenu.getItem('复位', 'Ctrl+D'),
                    callback: (key, opt) => this.reset().catch(Debug.error)
                }
            });
        }
        menu.add({
            weight: 4,
            type: 'toggle',
            preconditionFn: () => {
                return this.portExit();
            },
            data: {
                isHtmlName: true,
                name: ContextMenu.getItem('翻转串口', ''),
                callback: (key, opt) => this.toggle().catch(Debug.error)
            }
        });
    }

    #addEventsListener_() {
        this.getTab().dblclick(() => {
            if (!this.portExit()) {
                return;
            }
            this.toggle().catch(Debug.error);
        });

        this.#serial_.bind('onOpen', () => {
            this.#serial_.setDTRAndRTS(this.#config_.dtr, this.#config_.rts);
            this.setStatus(true);
            this.setValue(`==串口${this.getPortName()}开启==\n`);
            this.#$sendInput_.attr('disabled', false);
            if (this.#output_.timestampChecked()) {
                this.#addTimestamp_ = true;
            }
            this.#chart_.start();
        });

        this.#serial_.bind('onClose', () => {
            if (!this.isOpened()) {
                return;
            }
            this.#timer_ && clearTimeout(this.#timer_);
            this.setStatus(false);
            this.setValue(`${this.getValue() + this.#valueTemp_}\n==串口${this.getPortName()}关闭==`);
            this.#valueTemp_ = '';
            this.#$sendInput_.val('');
            this.#$sendInput_.attr('disabled', true);
            this.#chart_.stop();
        });

        this.#serial_.bind('onError', (error) => {
            this.#timer_ && clearTimeout(this.#timer_);
            if (this.isDisposed()) {
                return;
            }
            this.setValue(`${this.getValue() + this.#valueTemp_}\n${String(error)}\n`);
            this.#valueTemp_ = '';
        });

        this.#serial_.bind('onChar', (char) => {
            if (!this.#output_.isActive() || !this.isActive()) {
                return;
            }
            if (this.#output_.hexChecked()) {
                return;
            }
            if (this.#output_.timestampChecked()) {
                if (this.#addTimestamp_) {
                    const timestamp = dayjs().format('HH:mm:ss.SSS');
                    this.addValue(`${timestamp} -> ${char}`);
                } else {
                    this.addValue(char);
                }
                if (char === '\r') {
                    this.#addTimestamp_ = true;
                } else {
                    this.#addTimestamp_ = false;
                }
            } else {
                this.addValue(char);
            }
            if (this.#timer_) {
                return;
            }
            if (this.#timer_) {
                return;
            }
            this.#timer_ = setTimeout(this.#timedRefresh_.bind(this), this.#refreshFrequency_);
        });

        this.#serial_.bind('onString', (str) => {
            if (!this.#chart_.isActive() || !this.isActive()) {
                return;
            }
            const num = parseFloat(str);
            if (isNaN(num)) {
                return;
            }
            this.#chart_.addValue(num);
        });

        this.#serial_.bind('onByte', (byte) => {
            if (!this.#output_.isActive() || !this.isActive()) {
                return;
            }
            if (!this.#output_.hexChecked()) {
                return;
            }
            let str = byte.toString(16).toUpperCase();
            if (str.length < 2) {
                str = '0' + str;
            }
            str = '0x' + str + (byte === 0x0A ? '\n' : ' ');
            if (this.#output_.timestampChecked()) {
                if (this.#addTimestamp_) {
                    const timestamp = dayjs().format('HH:mm:ss.SSS');
                    this.addValue(`${timestamp} -> ${str}`);
                } else {
                    this.addValue(str);
                }
                if (byte === 0x0A) {
                    this.#addTimestamp_ = true;
                } else {
                    this.#addTimestamp_ = false;
                }
            } else {
                this.addValue(str);
            }
            if (this.#timer_) {
                return;
            }
            this.#timer_ = setTimeout(this.#timedRefresh_.bind(this), this.#refreshFrequency_);
        });

        this.#$settingMenu_.on('select2:select', (event) => {
            const { id } = event.currentTarget.dataset;
            const { data } = event.params;
            if (id === 'baud') {
                const baud = data.id - 0;
                if (!this.isOpened()) {
                    this.#config_.baud = baud;
                    return;
                }
                this.#serial_.setBaudRate(baud)
                .then(() => {
                    this.#config_.baud = baud;
                })
                .catch((error) => {
                    this.#$settingMenu_.filter('[data-id="baud"]').val(data).trigger('change');
                });
            } else if (id === 'send-with') {
                if (data.id === 'no') {
                    this.#config_.sendWith = '';
                } else {
                    this.#config_.sendWith = data.id.replace('\\r', '\r').replace('\\n', '\n');
                }
            }
        });

        this.#$sendInput_.keydown((event) => {
            if (event.keyCode !== 13) {
                return;
            }
            const { sendWith } = this.#config_;
            let data = this.#$sendInput_.val();
            if (this.#config_.hex) {
                let hexstr = data.split(' ');
                let hexs = [];
                for (let str of hexstr) {
                    let hex = parseInt(str, 16);
                    if (isNaN(hex)) {
                        continue;
                    }
                    hexs.push(hex);
                }
                for (let char of sendWith) {
                    hexs.push(char.charCodeAt(0));
                }
                this.#serial_.sendBuffer(hexs).catch(Debug.error);
            } else {
                data += sendWith;
                this.#serial_.sendString(data).catch(Debug.error);
            }
            this.#$sendInput_.val('');
        });

        this.#$dtr_.change((event) => {
            let dtr = false;
            if (this.#$dtr_.prop('checked')) {
                dtr = true;
            }
            if (this.isOpened()) {
                this.#serial_.setDTR(dtr)
                .then(() => {
                    this.#config_.dtr = dtr;
                })
                .catch(Debug.error);
            } else {
                this.#config_.dtr = dtr;
            }
        });

        this.#$rts_.change((event) => {
            let rts = false;
            if (this.#$rts_.prop('checked')) {
                rts = true;
            }
            if (this.isOpened()) {
                this.#serial_.setRTS(rts)
                .then(() => {
                    this.#config_.rts = rts;
                })
                .catch(Debug.error);
            } else {
                this.#config_.rts = rts;
            }
        });

        this.#$hex_.change((event) => {
            let hex = false;
            if (this.#$hex_.prop('checked')) {
                hex = true;
            }
            this.#config_.hex = hex;
        });
    }

    #timedRefresh_() {
        this.#timer_ = null;
        if (!this.#valueTemp_ || !this.isOpened()) {
            return;
        }
        if (Date.now() - this.#lastUpdate_ < this.#refreshFrequency_) {
            this.#timer_ = setTimeout(this.#timedRefresh_.bind(this), this.#refreshFrequency_);
            return;
        }
        this.addValue('');
    }

    init() {
        super.init();
        this.addDirty();
        const $tab = this.getTab();
        this.#$close_ = $tab.find('.chrome-tab-close');
        this.#$close_.addClass('layui-badge-dot layui-bg-blue');
        this.#port_ = $tab.attr('data-tab-id');
        this.#serial_ = new Serial(this.getPortName());
        this.#serial_.config(this.#config_).catch(Debug.error);
        this.#addEventsListener_();
        this.#addContextMenuItemsForOutput_();
        this.setValue(this.#valueTemp_);
        this.#valueTemp_ = '';
        this.#$settingMenu_.filter('[data-id="baud"]').val(this.#config_.baud).trigger('change');
        this.#$dtr_.prop('checked', this.#config_.dtr);
        this.#$rts_.prop('checked', this.#config_.rts);
    }

    async open() {
        return this.#serial_.open(this.#config_.baud);
    }

    async close() {
        return this.#serial_.close();
    }

    async toggle() {
        if (this.isOpened()) {
            return this.close();
        } else {
            return this.open();
        }
    }

    async interrupt() {
        return this.open().then(() => this.#serial_.interrupt());
    }

    async reset() {
        return this.open().then(() => this.#serial_.reset());
    }

    setStatus(isOpened) {
        if (this.isOpened() === isOpened || !this.#$close_) {
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

    isOpened() {
        return this.#opened_;
    }

    portExit() {
        const portsName = Serial.getCurrentPortsName();
        return portsName.includes(this.getPortName());
    }

    getPortName() {
        return this.#port_;
    }

    getSerial() {
        return this.#serial_;
    }

    dispose() {
        this.#$settingMenu_.select2('destroy');
        this.#$settingMenu_ = null;
        this.#serial_.close()
            .catch(Debug.error)
            .finally(() => {
                this.#manager_.dispose();
                this.#manager_ = null;
                this.#$close_ = null;
                this.#serial_.dispose();
                this.#serial_ = null;
                super.dispose();
            });
    }

    getValue() {
        if (!this.isInited()) {
            return this.#valueTemp_;
        } else {
            return this.#output_.getValue();
        }
    }

    setValue(data) {
        if (!this.isInited()) {
            this.#valueTemp_ = data;
            return;
        }
        this.#output_.setValue(data, this.#output_.scrollChecked());
    }

    addValue(data) {
        if (!this.isInited()) {
            this.#valueTemp_ += data;
            return;
        }
        this.#valueTemp_ += data;
        if (Date.now() - this.#lastUpdate_ < this.#refreshFrequency_ || !this.isOpened()) {
            return;
        }
        this.#output_.addValue(this.#valueTemp_, this.#output_.scrollChecked());
        this.#valueTemp_ = '';
        const editor = this.#output_.getEditor();
        const row = editor.session.getLength();
        if (row > this.#maxLine_) {
            const initCursor = editor.selection.getCursor();
            const removedLine = row - this.#maxLine_;
            editor.session.removeFullLines(1, removedLine);
        }
        this.#lastUpdate_ = Date.now();
    }

    getManager() {
        return this.#manager_;
    }

    resize() {
        super.resize();
        this.getManager().resize();
    }

    onMounted() {
        super.onMounted();
        this.#manager_.onMounted();
    }

    onUnmounted() {
        this.#manager_.onUnmounted();
        super.onUnmounted();
    }
}

Mixly.StatusBarSerial = StatusBarSerial;

});