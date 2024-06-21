goog.loadJs('common', () => {

goog.require('$.ui');
goog.require('$.flot');
goog.require('Mixly.PageBase');
goog.require('Mixly.Regression');
goog.require('Mixly.Config');
goog.provide('Mixly.StatusBarSerialChart');

const {
    PageBase,
    Regression,
    Config
} = Mixly;

const { USER } = Config;


class StatusBarSerialChart extends PageBase {
    #data_ = [];
    #totalPoints_ = 500;
    #needUpdate_ = false;
    #regression_ = new Regression();
    #plot_ = null;
    #opened_ = false;
    #started_ = false;

    constructor() {
        super();
        const $draw = $('<div style="width: 100%; height: 100%;"></div>');
        this.setContent($draw);
        const axisFontColor = USER.theme === 'light' ? '#000' : '#c2c3c2';
        this.#plot_ = $.plot($draw, this.getValue(), {
            series: {
                shadowSize: 1
            },
            colors: ['#777'],
            yaxis: {
                min: 0,
                max: 100,
                show: true,
                font: {
                    fill: axisFontColor
                },
                labelWidth: 30
            },
            xaxis: {
                show: true,
                font: {
                    fill: axisFontColor
                },
                mode: 'time',
                timezone: 'browser',
                twelveHourClock: true,
                timeBase: 'milliseconds',
                minTickSize: [1, 'second'],
                min: Date.now(),
                max: Date.now() + 1000 * 10,
            }
        });
    }

    init() {
        super.init();
        this.hideCloseBtn();
        this.resize();
    }

    resize() {
        this.#plot_.getSurface().clearCache();
        super.resize();
        this.#plot_.resize();
        this.#plot_.setupGrid(false);
        this.#plot_.draw();
    }

    stop() {
        this.setValue([]);
        this.#opened_ = false;
        this.#started_ = false;
    }

    start() {
        this.#opened_ = true;
        if (this.#started_) {
            return;
        }
        this.#started_ = true;
        this.update();
    }

    update() {
        if (!this.#started_) {
            return;
        }
        if (!this.isActive()) {
            this.#started_ = false;
            return;
        }
        if (!this.#needUpdate_) {
            setTimeout(() => this.update(), 50);
            return;
        }
        this.#plot_.setData(this.getValue());
        this.#plot_.getSurface().clearCache();
        this.#plot_.setupGrid(false);
        this.#plot_.draw();
        this.setRange(this.#plot_);
        this.#needUpdate_ = false;
        window.requestAnimationFrame(() => this.update());
    }

    getValue() {
        return [{
            data: this.#data_,
            lines: {
                show: true,
                fill: false,
                fillColor: '#007acc'
            }
        }];
    }

    addValue(data) {
        if (!this.#started_) {
            return;
        }
        if (this.#data_.length
            && data[0] === this.#data_[this.#data_.length - 1][0]) {
            return;
        }
        while (this.#data_.length > this.#totalPoints_) {
            this.#data_.shift();
        }
        this.#data_.push([Date.now(), data]);
        this.#needUpdate_ = true;
    }

    setValue(data) {
        if (!this.#started_) {
            return;
        }
        this.#data_ = data;
        this.#needUpdate_ = true;
    }

    setRange() {
        let { xaxis } = this.#plot_.getAxes();
        let { data = [] } = this.#plot_.getData()[0] ?? {};
        if (!data.length) {
            return;
        }
        if (data.length >= this.#totalPoints_) {
            xaxis.options.min = data[0][0];
            xaxis.options.max = data[this.#totalPoints_ - 1][0];
            return;
        }
        let x = [], y = [];
        for (let i in data) {
            x.push((i - 0) + 1);
            y.push(data[i][0] - data[0][0]);
        }
        this.#regression_.fit(x, y);
        let xMax = this.#regression_.predict([this.#totalPoints_])[0] + data[0][0];
        let xMin = data[0][0];
        xaxis.options.min = xMin;
        xaxis.options.max = xMax;
    }

    onMounted() {
        super.onMounted();
        if (this.#opened_) {
            this.start();
        }
    }

    onUnmounted() {
        this.setValue([]);
        super.onUnmounted();
    }

    dispose() {
        this.#plot_.shutdown();
        super.dispose();
    }
}

Mixly.StatusBarSerialChart = StatusBarSerialChart;

});