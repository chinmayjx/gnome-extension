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

        let my_settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.hello.cj");

        Main.wm.addKeybinding("test", my_settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW, () => {
                log("test");
            });


        btn = new PanelMenu.Button(0, 'rand');
        btn.add_child(new St.Icon({
            icon_name: 'display-brightness-symbolic',
            style_class: 'system-status-icon',
        }));

        let item5 = new PopupMenu.PopupBaseMenuItem({ activate: false });
        item5.add_child(new imports.ui.slider.Slider(0));
        btn.menu.addMenuItem(item5);

        Main.panel.addToStatusArea(this._uuid, btn);

        let tb = new St.Button({ label: "a", style: "background-color: #000000; padding: 50px;", x: 1000, y: 800 })
        global.window_group.add_child(tb);

        let posStart = null;
        let start = null, end = null;
        tb.connect("button-press-event", (a, e) => {
            start = e.get_coords();
            posStart = [tb.x, tb.y];
            log("press", start);
        })
        let ff = (a, e) => {
            if (start) {
                end = e.get_coords();
                log("release", end);
                tb.set_position(posStart[0] + end[0] - start[0], posStart[1] + end[1] - start[1]);
                tb.set_translation(0, 0, 0);
                start = null;
            }
        }
        tb.connect("leave-event", ff)
        tb.connect("button-release-event", ff)
        tb.connect("motion-event", (a, e) => {
            if (start) {
                let curr = e.get_coords();
                tb.set_translation(curr[0] - start[0], curr[1] - start[1], 0);
            }
        })

    }

    disable() {
        btn.destroy();
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
