let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/.local/share/gnome-shell/extensions/hello@chinmay.jain.com
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 extension.js
badd +1 schemas/schema.gschema.xml
badd +1 stylesheet.css
badd +1 metadata.json
argglobal
%argdel
edit extension.js
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 106 + 106) / 213)
exe 'vert 2resize ' . ((&columns * 106 + 106) / 213)
argglobal
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=10
setlocal nofen
let s:l = 1 - ((0 * winheight(0) + 28) / 57)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd ~/.local/share/gnome-shell/extensions/hello@chinmay.jain.com
wincmd w
argglobal
if bufexists(fnamemodify("~/.local/share/gnome-shell/extensions/hello@chinmay.jain.com/metadata.json", ":p")) | buffer ~/.local/share/gnome-shell/extensions/hello@chinmay.jain.com/metadata.json | else | edit ~/.local/share/gnome-shell/extensions/hello@chinmay.jain.com/metadata.json | endif
if &buftype ==# 'terminal'
  silent file ~/.local/share/gnome-shell/extensions/hello@chinmay.jain.com/metadata.json
endif
balt ~/.local/share/gnome-shell/extensions/hello@chinmay.jain.com/extension.js
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=10
setlocal nofen
let s:l = 1 - ((0 * winheight(0) + 28) / 57)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
wincmd w
exe 'vert 1resize ' . ((&columns * 106 + 106) / 213)
exe 'vert 2resize ' . ((&columns * 106 + 106) / 213)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
let g:CJWinBuffs = {'1034': ['extension.js'], '1004': ['extension.js'], '1032': ['/home/chinmay/github/configs/nvim/init.vim', 'extension.js'], '1006': ['extension.js'], '1007': ['stylesheet.css'], '1013': ['stylesheet.css'], '1014': ['extension.js'], '1016': ['extension.js', 'stylesheet.css'], '1023': ['extension.js', '/home/chinmay/github/configs/nvim/init.vim', 'stylesheet.css'], '1000': ['stylesheet.css', 'schemas/schema.gschema.xml'], '1001': ['metadata.json', 'extension.js']}
let g:CJLoadedSeshName = '/home/chinmay/.local/share/gnome-shell/extensions/hello@chinmay.jain.com'
