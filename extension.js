/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const { GObject, St, Gio } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const { loadInterfaceXML } = imports.misc.fileUtils;

const BUS_NAME = 'org.gnome.SettingsDaemon.Power';
const OBJECT_PATH = '/org/gnome/SettingsDaemon/Power';

const BrightnessInterface = loadInterfaceXML('org.gnome.SettingsDaemon.Power.Screen');
const BrightnessProxy = Gio.DBusProxy.makeProxyWrapper(BrightnessInterface);
let proxy = new BrightnessProxy(Gio.DBus.session, BUS_NAME, OBJECT_PATH,
    (proxy, error) => {
        if (error) {
            log(error.message);
            return;
        }

        this._proxy.connect('g-properties-changed', this._sync.bind(this));
        this._sync();
    });
let btn = null;
const brightnessData = {}
class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {
        btn = new PanelMenu.Button(0, 'rand');
        btn.add_child(new St.Icon({
            icon_name: 'display-brightness-symbolic',
            style_class: 'system-status-icon',
        }));
        let item1 = new PopupMenu.PopupMenuItem('item1');
        let item2 = new PopupMenu.PopupMenuItem('item2');
        let item3 = new PopupMenu.PopupMenuItem('item3');
        let item4 = new PopupMenu.PopupMenuItem('item4');
        let item5 = new PopupMenu.PopupMenuItem('item5');
        btn.menu.addMenuItem(item1);
        btn.menu.addMenuItem(item2);
        btn.menu.addMenuItem(item3);
        btn.menu.addMenuItem(item4);
        btn.menu.addMenuItem(item5);
        Main.panel.addToStatusArea(this._uuid, btn);
        global.workspace_manager.connect('workspace-switched', () => {
            let to = global.workspace_manager.get_active_workspace_index();
            // log("changed", this.from, to, brightnessData[this.from], brightnessData[to]);
            brightnessData[this.from] = proxy.Brightness;
            if(brightnessData[to]) proxy.Brightness = brightnessData[to];
            this.from = to;
        });
    }

    disable() {
        btn.destroy();
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
