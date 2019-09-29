var defAddr='https://api.myip.com/';
var curAddr='';

function isEmptyObject(obj) 
{
    for (var i in obj) 
	{
        if (obj.hasOwnProperty(i)) 
		{
            return false;
        }
    }
    return true;
}

function saveSettings()
{
	var scriptAddr = document.getElementById("script").value;
	scriptAddr = scriptAddr.trim();
	
	if (scriptAddr != "")
	{
		if (window.confirm('Save script address ' + scriptAddr + '? Are you sure?'))
		{
			browser.storage.local.set({
				server_settings: {script_addr: scriptAddr}
			});
			window.alert('Settings saved!');
		}
		else
		{
			document.getElementById("script").value = curAddr;
		}
	}
}

function onGot(item)
{
	if (isEmptyObject(item))
	{
		curAddr = defAddr;
	}
	else
	{
		if (item.server_settings.script_addr == '')
		{
			curAddr = defAddr;
		}
		else
		{
			curAddr = item.server_settings.script_addr;
		}
	}
	document.getElementById("script").value = curAddr;
}

function onGotError(error)
{
	window.alert(`Error: ${error}`);
}

function loadSettings()
{
	var gettingItem = browser.storage.local.get('server_settings');	
	return gettingItem.then(onGot, onGotError);	
}

function doRequest() //main request function
{
	document.getElementById("flag").src = 'flags/1working.png';
	document.getElementById("flag").alt = 'Working';
	document.getElementById("flag").title = 'working...';
	
	$.get(curAddr)
		.done (function (data) {
			//data processing code here
			var json = $.parseJSON(data);			
			document.getElementById("ip").value = json.ip;
			document.getElementById("country").value = json.country;
			
			if (json.cc.trim() == '') //no country code
			{
				document.getElementById("flag").src = 'flags/3unknow.png';
				document.getElementById("flag").alt = 'Unknow';
				document.getElementById("flag").title = 'Unknow country code';
			}
			else //country code exist
			{
				document.getElementById("flag").src = 'flags/'+json.cc.trim()+'.png';
				document.getElementById("flag").alt = json.cc;
				document.getElementById("flag").title = json.cc;
			}
		})
		.fail(function () {
			//error processing code here
			document.getElementById("flag").src = 'flags/2error.png';
			document.getElementById("flag").alt = 'Error';
			document.getElementById("flag").title = 'Error';
		});
}

function bodyLoad()
{
	loadSettings()
	.then(doRequest);	
}

function restoreDefaults()
{
	if (window.confirm('Restore defaults?'))
	{
		curAddr = defAddr;
		document.getElementById("script").value = defAddr;
		browser.storage.local.set({
				server_settings: {script_addr: defAddr}
			});
	}
}

document.getElementById("save").addEventListener("click", saveSettings); //скобки не забудь про сраные скобки
document.getElementById("restore").addEventListener("click", restoreDefaults);
document.addEventListener('DOMContentLoaded', bodyLoad);