goog.loadJs('common', () => {

goog.require('path');
goog.require('Mixly.Env');
goog.require('Mixly.XML');
goog.require('Mixly.Msg');
goog.require('Mixly.Config');
goog.require('Mixly.Boards');
goog.require('Mixly.FooterLayer');
goog.require('Mixly.FooterLayerBoardConfig');
goog.require('Mixly.FooterLayerMessage');
goog.require('Mixly.Component');
goog.require('Mixly.HTMLTemplate');
goog.require('Mixly.Electron.FooterLayerExample');
goog.require('Mixly.Web.FooterLayerExample');
goog.provide('Mixly.FooterBar');

const {
    Env,
    XML,
    Msg,
    Config,
    Boards,
    FooterLayer,
    FooterLayerBoardConfig,
    FooterLayerMessage,
    Component,
    HTMLTemplate,
    Electron = {},
    Web = {}
} = Mixly;

const { FooterLayerExample } = goog.isElectron? Electron : Web;

const { BOARD } = Config;


class FooterBar extends Component {
    static {
        HTMLTemplate.add(
            'html/footerbar.html',
            new HTMLTemplate(goog.get(path.join(Env.templatePath, 'html/footerbar.html')))
        );
    }

    #exampleLayer_ = null;
    #messageLayer_ = null;
    #boardConfigLayer_ = null;

    constructor() {
        super();
        let content = $(HTMLTemplate.get('html/footerbar.html').render({
            outputAceName: Msg.Lang['输出'],
            row: Msg.Lang['行'],
            column: Msg.Lang['列'],
            unknown: Msg.Lang['未知'],
            config: '配置',
            selected: Msg.Lang['已选择'],
            on: Msg.Lang['在'],
            message: Msg.Lang['消息'],
            example: Msg.Lang['例程']
        }));
        Boards.init();
        this.setContent(content);
        content.find('.code-lang').html(BOARD.language ?? '未知');
        this.#exampleLayer_ = new FooterLayerExample(content.find('.example')[0]);
        this.#messageLayer_ = new FooterLayerMessage(content.find('.message')[0]);
        this.#boardConfigLayer_ = new FooterLayerBoardConfig(content.find('.board-config')[0], Boards.dict);
        Boards.addLayer(this.#boardConfigLayer_);
    }

    resize() {
        super.resize();
        this.#exampleLayer_.resize();
        this.#messageLayer_.resize();
        this.#boardConfigLayer_.resize();
    }

    getExampleLayer() {
        return this.#exampleLayer_;
    }

    getMessageLayer() {
        return this.#messageLayer_;
    }

    getBoardConfigLayer() {
        return this.#boardConfigLayer_;
    }
}

Mixly.FooterBar = FooterBar;

});