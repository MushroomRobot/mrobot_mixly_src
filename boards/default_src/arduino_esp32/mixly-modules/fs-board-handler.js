import { Boards, FSBoardHandler } from 'mixly';
import COMMANDS from './commands';
import ESP32_PARTITIONS from './partitions';
import ESP32_MENU from './menu';

export default class FSArduEsp32Handler extends FSBoardHandler {
    constructor() {
        super();
        for (let key in COMMANDS) {
            this.setFSCommands(key, COMMANDS[key]);
        }
    }

    onBeforeUpload() {
        const flashMode = Boards.getSelectedBoardConfigParam('FlashMode');
        const flashFreq = Boards.getSelectedBoardConfigParam('FlashFreq') + 'm';
        const flashSize = Boards.getSelectedBoardConfigParam('FlashSize') + 'B';
        const baud = Boards.getSelectedBoardConfigParam('UploadSpeed');
        const partitionScheme = Boards.getSelectedBoardConfigParam('PartitionScheme');
        this.updateConfig({
            flashMode, flashFreq, flashSize, baud,
            ...ESP32_PARTITIONS[partitionScheme]
        });
    }

    onBeforeDownload() {
        const baud = Boards.getSelectedBoardConfigParam('UploadSpeed');
        const partitionScheme = Boards.getSelectedBoardConfigParam('PartitionScheme');
        this.updateConfig({
            baud,
            ...ESP32_PARTITIONS[partitionScheme]
        });
    }

    getFSMenu() {
        return ESP32_MENU;
    }
}