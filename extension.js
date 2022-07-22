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

const BUS_NAME = 'org.gnome.SettingsDaemon.Power';
const OBJECT_PATH = '/org/gnome/SettingsDaemon/Power';
// global.display.get_focus_window().get_compositor_private().add_effect(new Clutter.ColorizeEffect({tint: Clutter.Color.from_hls(0,0.5,0)}))
const BrightnessInterface = loadInterfaceXML('org.gnome.SettingsDaemon.Power.Screen');
const BrightnessProxy = Gio.DBusProxy.makeProxyWrapper(BrightnessInterface);
let proxy = new BrightnessProxy(Gio.DBus.session, BUS_NAME, OBJECT_PATH);
let btn = null;
const brightnessData = {}
class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {

        let my_settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.hello.cj");

        Main.wm.addKeybinding("dim", my_settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW, () => {
                log("dim");
                // global.display.get_focus_window().get_compositor_private().add_effect(new Clutter.ColorizeEffect({tint: Clutter.Color.from_hls(0,0.5,0)}))
                if (this.slider) {
                    this.box.destroy();
                    this.slider = false;
                    return;
                }
                let fwin = global.display.get_focus_window();
                let rect = fwin.get_frame_rect();
                let win = fwin.get_compositor_private();
                let overlay = new St.BoxLayout({ width: rect.width, height: rect.height, x: rect.x - win.x, y: rect.y - win.y, style_class: "chin-btn", opacity: 0 })
                win.add_child(overlay);
                this.box = new St.BoxLayout({
                    reactive: true,
                    track_hover: true,
                    can_focus: true, width: 200, style_class: "chin-btn", x: win.width / 2 - 100, y: rect.y - win.y + rect.height - 50
                });
                let slider = new imports.ui.slider.Slider(1)
                slider.connect("notify::value", () => {
                    // win.clear_effects();
                    // if(slider.value > 0.9) return;
                    // win.add_effect(new Clutter.ColorizeEffect({ tint: Clutter.Color.from_hls(0, slider.value, 0) }))
                    overlay.set_opacity((1 - slider.value) * 255);
                })
                win.connect("notify::size", () => {
                    this.box.set_position(win.width / 2 - 100, fwin.get_frame_rect().y - win.y + fwin.get_frame_rect().height - 50)
                    overlay.set_width(fwin.get_frame_rect().width);
                    overlay.set_height(fwin.get_frame_rect().height);
                })
                this.box.add_child(slider)
                win.add_child(this.box);
                this.slider = true;
            });


        btn = new PanelMenu.Button(0, 'rand');
        btn.add_child(new St.Icon({
            icon_name: 'display-brightness-symbolic',
            style_class: 'system-status-icon',
        }));
        let item1 = new PopupMenu.PopupMenuItem('item1');
        let item2 = new PopupMenu.PopupMenuItem('item2');
        let item3 = new PopupMenu.PopupMenuItem('item3');
        let item4 = new PopupMenu.PopupMenuItem('item4');
        let item5 = new PopupMenu.PopupBaseMenuItem({ activate: false });
        item5.add_child(new imports.ui.slider.Slider(0));
        btn.menu.addMenuItem(item1);
        btn.menu.addMenuItem(item2);
        btn.menu.addMenuItem(item3);
        btn.menu.addMenuItem(item4);
        btn.menu.addMenuItem(item5);

        // let btn2 = new St.Button({ label: "btdsads", style_class: "chin-btn", x: 1500, y: 100 })
        // btn2.connect("clicked", (n) => {
        //     log("clicked", n)
        // });
        // global.window_group.add_child(btn2)


        Main.panel.addToStatusArea(this._uuid, btn);
        global.workspace_manager.connect('workspace-switched', () => {
            let to = global.workspace_manager.get_active_workspace_index();
            // log("changed", this.from, to, brightnessData[this.from], brightnessData[to]);
            brightnessData[this.from] = proxy.Brightness;
            if (brightnessData[to] !== undefined) proxy.Brightness = brightnessData[to];
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
