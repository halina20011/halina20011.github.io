export let headHtml = "\
<div class=\"firstRow\" id=\"firstRow\"> \
    <div style=\"position: relative; width: 100%; background-color: white; height: 5%; top: 95%;\"> \
    </div> \
</div> \
<div class=\"secondRow\" id=\"secondRow\"> \
    <div> \
        <a href=\"/index.html\"><p>Home</p></a> \
        <a href=\"/Arduino/arduino.html\"><p>Arduino</p></a> \
    </div> \
    <div> \
        <a href=\"\" id=\"codeLink\"><p>Code path</p></a> \
        <div class=\"headDropDown\"> \
            <button onclick=\"roll(this, 'socialDropdownContent')\" id=\"socialDropdownButton\" class=\"closed\">Social</button> \
            <div id=\"socialDropdownContent\"> \
                <div class=\"dropDownItem\"> \
                    <a href=\"https://www.youtube.com/@Halina20011\">YouTube</a> \
                </div> \
                <div class=\"dropDownItem\"> \
                    <a href=\"https://gitlab.com/Halina20011\">GitLab</a> \
                </div> \
                <div class=\"dropDownItem\"> \
                    <a href=\"https://github.com/halina20011/\">GitHub</a> \
                </div> \
            </div> \
        </div> \
    </div> \
</div> \
<link rel=\"stylesheet\" type=\"text/css\" href=\"/Menu/head.css\"> \
<link rel=\"stylesheet\" type=\"text/css\" href=\"/Menu/dropDownMenu.css\">";
