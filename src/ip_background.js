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
	var btitle = '';
	
	browser.browserAction.setIcon({
		path: 'flags/1working.png'
    });	
	btitle = "Working...";
	browser.browserAction.setTitle({title: btitle});
	
	$.get(curAddr)
		.done (function (data) {
			//data processing code here
			var json = $.parseJSON(data);
						
			if (json.cc.trim() == '') //no country code
			{
				browser.browserAction.setIcon({
					path: 'flags/3unknow.png'
				});				
				btitle = json.ip + " " + "Unknow country";
				browser.browserAction.setTitle({title: btitle});
			}
			else //country code exist
			{
				browser.browserAction.setIcon({
					path: 'flags/' + json.cc.trim() + '.png'
				});
				btitle = json.ip + " " + json.country + " (" + json.cc + ")";
				browser.browserAction.setTitle({title: btitle});
			}
		})
		.fail(function () {
			//error processing code here
			browser.browserAction.setIcon({
					path: 'flags/2error.png'
			});
			btitle = "Error";
			browser.browserAction.setTitle({title: btitle});
		});
}

function listinerRun()
{
	loadSettings()
	.then(doRequest);	
}

browser.tabs.onActivated.addListener(listinerRun);
browser.tabs.onCreated.addListener(listinerRun);
browser.tabs.onUpdated.addListener(listinerRun);