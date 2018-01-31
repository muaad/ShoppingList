const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'AddWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    addWindow.on('close', function() {
        addWindow = null;
    })
}

app.on('ready', function(){
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'MainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed', function() {
        app.quit();
    })
    
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
});

ipcMain.on('item:add', function(e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

const template = [
    {},
    {
      label: 'File',
      submenu: [
        {
            role: 'add', 
            label: 'Add Item',
            click() {
                createAddWindow();
            }
        },
        {
            role: 'clear', 
            label: 'Clear Items',
            click() {
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            role: 'clear', 
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        },
      ]
    }
]

if(process.platform == 'darwin') {
    template.unshift({})
}

if (process.env.NODE_ENV !== 'production') {
    template.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                },
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I'
            },
            {
                role: 'reload'
            }
        ]
    });
}