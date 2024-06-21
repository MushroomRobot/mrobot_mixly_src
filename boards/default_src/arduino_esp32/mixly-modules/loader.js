import { Workspace, ContextMenu } from 'mixly';
import FSArduEsp32Handler from './fs-board-handler';

const mainWorkspace = Workspace.getMain();
const statusBarsManager = mainWorkspace.getStatusBarsManager();
const dropdownMenu = statusBarsManager.getDropdownMenu();
const menu = dropdownMenu.getItem('menu');
menu.add({
    weight: 2,
    type: 'sep1',
    data: '---------'
});
menu.add({
    weight: 3,
    type: 'filesystem-tool',
    data: {
        isHtmlName: true,
        name: ContextMenu.getItem('板卡文件管理', ''),
        callback: () => {
            statusBarsManager.add('board-fs', 'esp32-board-fs', '板卡文件管理');
            statusBarsManager.changeTo('esp32-board-fs');
            const fsStatusBar = statusBarsManager.getStatusBarById('esp32-board-fs');
            fsStatusBar.setHandler(new FSArduEsp32Handler());
        }
    }
});