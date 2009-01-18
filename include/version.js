//
// version.js - Grab version information from the version control file.
//
// (c) 2004-2009 Denora Team
// Contact us at info@denorastats.org
//
// This program is free but copyrighted software; see the file COPYING for
// details.
//
// Based on the original code of Anope by Anope Team.
// Based on the original code of Thales by Lucas.
//
// $Id: version.js 66 2007-08-14 14:21:33Z drstein $
//

var CTRL = "../version.log";
var VERSION_MAJOR;
var VERSION_MINOR;
var VERSION_PATCH;
var VERSION_EXTRA;
var VERSION_BUILD;
var BUILD;
var VERSION;
var VERSIONDOTTED;

var fso = WScript.CreateObject("Scripting.FileSystemObject");

if (!fso.FileExists(CTRL)) {
    WScript.Echo("Error: Unable to find control file: " + CTRL);
} else {
    var versionLog = fso.OpenTextFile(CTRL);
    while (!versionLog.atEndOfStream) {
        var versionLine = versionLog.readline();
        var thisMatch = versionLine.replace('\n', '');
		while (thisMatch.match(/\"/g)) {
		    thisMatch = thisMatch.replace('"', '');	
	    }
	    versionLine = thisMatch;
        if (versionLine.match(/VERSION_MAJOR=/g)) {
            VERSION_MAJOR = versionLine.replace('VERSION_MAJOR=', '');
            continue;
        }
        if (versionLine.match(/VERSION_MINOR=/g)) {
            VERSION_MINOR = versionLine.replace('VERSION_MINOR=', '');
            continue;
        } 
        if (versionLine.match(/VERSION_PATCH=/g)) {
            VERSION_PATCH = versionLine.replace('VERSION_PATCH=', '');
            continue;
        }       
        if (versionLine.match(/VERSION_EXTRA=/g)) {
            VERSION_EXTRA = versionLine.replace('VERSION_EXTRA=', '');
            continue;
        }                
        if (versionLine.match(/VERSION_BUILD=/g)) {
            VERSION_BUILD = versionLine.replace('VERSION_BUILD=', '');
            continue;
        }                                                                                                
    }
    versionLog.close();
    VERSION = VERSION_MAJOR+"."+VERSION_MINOR+"."+VERSION_PATCH+"."+VERSION_BUILD;
    if (VERSION_EXTRA) {
    	VERSION = VERSION+" ("+VERSION_EXTRA+")";
    }
    VERSIONDOTTED = VERSION;

    if (fso.FileExists('version.h')) {
        versionLog = fso.OpenTextFile("version.h");
        while (!versionLog.atEndOfStream) {
            versionLine = versionLog.readline();
            thisMatch = versionLine.replace('\n', '');
    		while (thisMatch.match(/\"/g)) {
	    	    thisMatch = thisMatch.replace('"', '');	
    	    }
    	    versionLine = thisMatch;
            if (versionLine.match(/^#define BUILD \"(\d+)\"$/g)) {
                BUILD = versionLine.replace(/^#define BUILD \"(\d+)\"$/g, '$1');
		BUILD = Number(BUILD) + 1;
                continue;
            }
        }
        versionLog.close();
    } else {
        BUILD = 1;
    }

    var f = fso.OpenTextFile("version.h", 2, true);
    
    f.WriteLine("/* Version information for Stats.");
    f.WriteLine(" *");
    f.WriteLine(" * (c) 2004-2009 Denora Team");
    f.WriteLine(" * Contact us at info@denorastats.org");
    f.WriteLine(" *");
    f.WriteLine(" * Please read COPYING and CREDITS for furhter details.");
    f.WriteLine(" *");
    f.WriteLine(" * Based on the original code of Anope by Anope Dev.");
    f.WriteLine(" * Based on the original code of Thales by Lucas.");
    f.WriteLine(" *");
    f.WriteLine(" * This file is auto-generated by version.js");
    f.WriteLine(" *");
    f.WriteLine(" */");
    f.WriteLine("");
    f.WriteLine("#ifndef VERSION_H");
    f.WriteLine("#define VERSION_H");
    f.WriteLine("");
    f.WriteLine("#define VERSION_MAJOR	"+VERSION_MAJOR);
    f.WriteLine("#define VERSION_MINOR	"+VERSION_MINOR);
    f.WriteLine("#define VERSION_PATCH	"+VERSION_PATCH);
    f.WriteLine("#define VERSION_EXTRA	"+VERSION_EXTRA);
    f.WriteLine("#define VERSION_BUILD	"+VERSION_BUILD);
    f.WriteLine("");
    f.WriteLine("#define BUILD \""+BUILD+"\"");
    f.WriteLine("#define VERSION_STRING \""+VERSION+"\"");
    f.WriteLine("#define VERSION_STRING_DOTTED \""+VERSIONDOTTED+"\"");
    f.WriteLine("");
    f.WriteLine("#if defined(USE_MYSQL)");
    f.WriteLine("# define VER_SQL \"Q\"");
    f.WriteLine("#else");
    f.WriteLine("# define VER_SQL \"\"");
    f.WriteLine("#endif");
    f.WriteLine("");
    f.WriteLine("#if defined(USE_MODULES)");
    f.WriteLine("# define VER_MODULE \"M\"");
    f.WriteLine("#else");
    f.WriteLine("# define VER_MODULE \"\"");
    f.WriteLine("#endif");
    f.WriteLine("");
    f.WriteLine("#endif");

    f.close();
}

