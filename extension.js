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

const { GObject, St, Gio, Clutter } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const Meta = imports.gi.Meta
const Shell = imports.gi.Shell
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const { loadInterfaceXML } = imports.misc.fileUtils;

let btn = null;
class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {
        let displaySize = global.display.get_size();
        let s1 = ExtensionUtils.getSettings("org.gnome.shell.extensions.hello.cj.s1");

        for(let i=1;i<=6;i++){
          Main.wm.addKeybinding(`b${i}`, s1,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW, () => {
              imports.ui.main.uiGroup.find_child_by_name("dashtodockContainer")._activateApp(i-1)
              log(`b${i}`);
            });
        }

    }

    disable() {
        btn.destroy();
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
