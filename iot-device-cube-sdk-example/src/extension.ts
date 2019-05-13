// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as iotcube from 'vscode-iot-device-cube-sdk';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	/** List Volumes **/
	// on Windows, C:, D:, E:, etc
	const volumes =  await iotcube.FileSystem.listVolume();
	console.log(volumes);

	/** Copy File **/
	await iotcube.FileSystem.copyFile('C:\\foo\\hello.txt', 'D:\\target\\folder');

	/** Discover SSH Device **/
	const devices = await iotcube.SSH.discover();
	console.log(devices);

	/** Connect to SSH **/
	const ssh = new iotcube.SSH();
	await ssh.open('10.172.14.38', 22, 'root', '');

	/** Execute Command via SSH with Event **/
	const command = ssh.spawn('ls -la');
	command.on('data', (chunk: string) => {
		console.log(chunk);
	});
	command.on('error', (error: Error) => {
		console.log(error);
		// ssh.close();
	});
	command.on('close', () => {
		// ssh.close();
	});

	/** Execute Command via SSH with async **/
	const fileList = await ssh.exec('ls -la');
	console.log(fileList);

	/** Uplaod Single File via SSH **/
	await ssh.uploadFile('C:\\foo\\hello.txt', 'IoTProject');

	/** Upload Folder via SSH **/
	await ssh.uploadFolder('C:\\foo', 'IoTProject');
}

// this method is called when your extension is deactivated
export function deactivate() {}
