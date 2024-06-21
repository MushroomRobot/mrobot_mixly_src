goog.loadJs('common', () => {

goog.require('path');
goog.require('d3');
goog.require('Mixly.Env');
goog.require('Mixly.Boards');
goog.require('Mixly.App');
goog.require('Mixly.Msg');
goog.require('Mixly.UserEvents');
goog.require('Mixly.UserOPEvents');
goog.require('Mixly.JSFuncs');
goog.require('Mixly.Electron.LibManager');
goog.require('Mixly.WebSocket.Socket');
goog.provide('Mixly.Loader');

const {
    Config,
    Boards,
    Loader,
    Env,
    App,
    Msg,
    UserEvents,
    UserOPEvents,
    Electron = {},
    Web = {},
    WebSocket = {}
} = Mixly;

const { LibManager } = goog.isElectron? Electron : Web;
const { Socket } = WebSocket;


window.addEventListener('load', () => {
    const app = new App($('body')[0]);
    Mixly.app = app;
    const $xml = $(goog.get(Env.boardIndexPath));
    let scrpitPaths = [];
    let cssPaths = [];
    let $categories = null;
    for (let i = 0; i < $xml.length; i++) {
        const $xmli = $($xml[i]);
        let rePath = '';
        switch ($xml[i].nodeName) {
        case 'SCRIPT':
            rePath = $xmli.attr('src');
            rePath && scrpitPaths.push(path.join(Env.boardDirPath, rePath));
            break;
        case 'LINK':
            rePath = $xmli.attr('href');
            rePath && cssPaths.push(path.join(Env.boardDirPath, rePath));
            break;
        case 'XML':
            $categories = $xmli;
            break;
        }
    }
    if (!$categories.children('category').length) {
        $categories.html('<category></category>');
    }
    $('#toolbox').html($categories.html());
    LazyLoad.css(cssPaths);
    LazyLoad.js(scrpitPaths, () => {
        if (window.frames.length !== parent.frames.length) {
            window.userEvents = new UserEvents(Editor.blockEditor);
        }
        if (!goog.isElectron && window.location.host.indexOf('mixly.cn')) {
            window.userOpEvents = new UserOPEvents();
        }
        if (Env.hasSocketServer) {
            Socket.init();
        }
        if (goog.isElectron) {
            if (typeof LibManager === 'object') {
                LibManager.init();
            }
        } else {
            Env.defaultXML = $('#toolbox').html();
        }
        const selectedBoardName = Boards.getSelectedBoardName();
        Boards.setSelectedBoard(selectedBoardName, {});
        Msg.renderToolbox(true);
        app.getNav().resize();
        app.removeSkeleton();
    });
});

});