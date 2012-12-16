/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorUtils = brackets.getModule("editor/EditorUtils"),
        Menus = brackets.getModule("command/Menus"),
        COMMAND_ID = "me.drewh.jsbeautify";

    require('beautify');
    require('beautify-html');
	require('beautify-css');

    var indent_size = 1;
    var indent_char = '\t';


    var autoFormat = function () {

        var txt = DocumentManager.getCurrentDocument().getText();
        var editor = EditorManager.getCurrentFullEditor();
        var fileType = EditorUtils.getModeFromFileExtension(DocumentManager.getCurrentDocument().url);
        var cursor = editor.getCursorPos();
        var scroll = editor.getScrollPos();


        if (fileType === "javascript") {
            var formattedText = js_beautify(txt, {
                indent_size: indent_size,
                indent_char: indent_char,
                reserve_newlines: true,
                jslint_happy: true,
                keep_array_indentation: true,
                space_before_conditional: true
            });
        } else if (fileType === 'htmlmixed') {

            var formattedText = style_html(txt, {
                indent_size: indent_size,
                indent_char: indent_char
            });
        } else if (fileType === 'css' || fileType === 'less') {

            var formattedText = css_beautify(txt, {
                indent_size: indent_size,
                indent_char: indent_char
            });

        } else {
            alert('Could not determine file type');
        }


        DocumentManager.getCurrentDocument().setText(formattedText);
        var newCursorPos = editor.getCursorPos();

        editor.setCursorPos(cursor);
        editor.setScrollPos(scroll.x, scroll.y);
    };

    CommandManager.register("Beautify", COMMAND_ID, autoFormat);

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuItem(COMMAND_ID, [{
        key: "Ctrl-Shift-F",
        platform: "win"},
                                                                                          {
        key: "Ctrl-Shift-F",
        platform: "mac"}]);

});