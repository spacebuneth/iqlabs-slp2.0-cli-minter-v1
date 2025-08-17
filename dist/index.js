#!/usr/bin/env node
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import iqsdk from 'iq-sdk';
import * as solanaWeb3 from "@solana/web3.js";
import pkg from "bs58";
const { encode } = pkg;
// Global Var
let playerName;
let rpc;
let splString;
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
async function genWallet() {
    // Generate a new Solana keypair
    const keypair = solanaWeb3.Keypair.generate();
    // Get the public key in Base58 format (this is your Solana wallet address)
    const publicKeyBase58 = keypair.publicKey.toBase58();
    // Get the private key (secret key) and encode it to Base58 format
    // Note: The secretKey is a Uint8Array, so it needs to be encoded.
    const privateKeyBase58 = encode(keypair.secretKey);
    console.log(`Solana ${chalk.bgCyanBright('Public Key')} (Base58):`, chalk.cyanBright(publicKeyBase58));
    console.log(`Solana ${chalk.bgRedBright('Private Key')} (Base58):`, chalk.redBright(privateKeyBase58));
    updateEnvFile('SIGNER_PRIVATE_KEY', privateKeyBase58);
}
async function main() {
    try {
        await iqsdk.default.userInit();
    }
    catch (error) {
        console.error('try adding funds to wallet');
        process.exit(1);
    }
}
//main();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
function updateEnvFile(key, value) {
    if (value == '') {
        console.log(chalk.redBright(".env RPC or Private Key is Blank!"));
        process.exit(1);
    }
    try {
        let envConfig = {};
        if (fs.existsSync(envPath)) {
            const envFileContent = fs.readFileSync(envPath, 'utf-8');
            envConfig = dotenv.parse(envFileContent);
        }
        envConfig[key] = value;
        //console.log('test',envConfig)
        const updateEnvContent = Object.entries(envConfig)
            .map(([k, v]) => `${k}="${v}"`)
            .join('\n');
        fs.writeFileSync(envPath, updateEnvContent, 'utf-8');
        console.log(`Successfully update ${key} in .env file`);
    }
    catch (error) {
        console.error('Error updating .env file:', error);
    }
}
// updateEnvFile('SIGNER_PRIVATE_KEY', "new-api-key-123boner");
// updateEnvFile('RPC', "mysql:s//user:pass@localhost:3306/db");
async function instructions() {
    // const rainbowTitle = chalkAnimation.rainbow(
    //     'READY TO MINT A SPL 2.0 ON THE IQ CODE-IN PROTOCOL \n'
    // );
    // await sleep();
    // rainbowTitle.stop();
    //console.log('\n')
    console.log(`
        ${chalk.bgBlue('How To Mint SPL 2.0')}
        
        ${chalk.dim('>')} Set Wallet ${chalk.magenta('Private Key')} and ${chalk.cyan('RPC')} url ${chalk.dim('(A new wallet can be generated)')}
        ${chalk.dim('>')} Fund to wallet
        ${chalk.dim('>')} Initialize Wallet PDA ${chalk.bgYellow('Fee')} ${chalk.dim('(only needs to be done once)')}
        ${chalk.dim('>')} Inscribe SPL 2.0 String to Solana
        ${chalk.dim('>')} ${chalk.greenBright('Profit???')}

        ${chalk.underline('To list commands:')}${chalk.italic(' /help')}
        Ctr^ C To ${chalk.redBright('Exit program')}
        `);
    const answer = await inquirer.prompt({
        name: 'enter',
        type: 'confirm',
        message: `Press Enter`
    });
}
//await welcome();
// async function prompt-test() {
//     const wallet = await inquirer.prompt({
//         name: 'Generate New Solana Wallet? y/n',
//         type: 'input',
//         message: 'Enter your Private Key',
//         default() {
//             return 'Player';
//         },
//     });
//     const RPC = await inquirer.prompt({
//         name: 'rpc_url',
//         type: 'input',
//         message: 'Enter your RPC',
//         default() {
//             return 'Player';
//         },
//     });
//     playerName = wallet.private_key;
//     rpc = RPC.rpc_url;
//     console.log(chalk.redBright('PrivateKey: '), playerName);
//     console.log(chalk.blueBright('RPC URL: '), rpc);
// }
async function userInfo() {
    const answer = await inquirer.prompt({
        name: 'gen_wallet',
        type: 'list',
        message: 'Generate A New Solana Wallet?\n',
        choices: [
            'Yes',
            'No'
        ]
    });
    return handleUserInfo(answer.gen_wallet == 'Yes');
}
async function handleUserInfo(answer) {
    if (answer) {
        //console.log('Generationg new wallet please wait!')
        await genWallet();
        //await walletInfo()
    }
    else {
        await walletInfo();
    }
}
async function walletInfo() {
    console.log(`${chalk.yellow("Don't Trust us?")}
        ${chalk.dim('Audit our github')} ${chalk.green('GitHub Link')}`);
    const answer = await inquirer.prompt({
        name: 'wallet_info',
        type: 'input',
        message: `Enter Private Key: `
    });
    //console.log(answer.wallet_info)
    updateEnvFile('SIGNER_PRIVATE_KEY', answer.wallet_info);
}
async function getRPC() {
    const answer = await inquirer.prompt({
        name: 'wallet_info',
        type: 'input',
        message: `Enter RPC URL: `
    });
    //console.log(answer.wallet_info)
    updateEnvFile('RPC', answer.wallet_info);
}
async function printEnvFile() {
    let envConfig = {};
    if (fs.existsSync(envPath)) {
        const envFileContent = fs.readFileSync(envPath, 'utf-8');
        envConfig = dotenv.parse(envFileContent);
        console.log(envConfig);
    }
}
async function initUserWallet() {
    console.log(chalk.yellow(`Warning Add Funds to Wallet Before Initializing`), `${chalk.bgBlack("Init Fee 0.01 SOL")}`);
    const answer = await inquirer.prompt({
        name: 'init_pda',
        type: 'list',
        message: 'Select Yes to Initialize\n',
        choices: [
            'Yes',
            'No'
        ]
    });
    return handleUserInit(answer.init_pda == 'Yes');
}
async function handleUserInit(answer) {
    if (answer) {
        await main();
    }
    else {
    }
}
async function checkPda() {
}
//await askName();
async function question1() {
    const answer = await inquirer.prompt({
        name: 'question_1',
        type: 'list',
        message: 'Javascript was created in 10 days then released on\n',
        choices: [
            'first option',
            'second option',
            'third optoin',
            'forth optoin',
        ]
    });
    return handleAnswer(answer.question_1 == 'first option');
}
async function handleAnswer(isCorrect) {
    const spinner = createSpinner('Checking answer...').start();
    await sleep();
    if (isCorrect) {
        spinner.success({ text: `Nice work ${playerName}.` });
    }
    else {
        spinner.error('try again');
        await question1();
    }
}
//await question1();
async function title() {
    console.clear();
    await figlet.text("IQ LABS", {
        font: "3-D",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
    }, function (err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(gradient.pastel.multiline(data));
    });
}
async function subTitle() {
    const rainbowTitle = chalkAnimation.rainbow('SPL 2.0 CLI Minter');
    //console.log(rainbowTitle)
    await sleep();
    rainbowTitle.stop();
}
async function mintSPL() {
    const spl = await inquirer.prompt({
        name: 'spl_string',
        type: 'input',
        message: `Enter SPL 2.0 Mint Code
    ${chalk.yellow('Ex: ')} ${chalk.dim('{"p":"spl-2.0","op":"mint","tick":"qult","amt":"800"}')}
:`
    });
    const answer = await inquirer.prompt({
        name: 'mint_type',
        type: 'list',
        message: 'Select A Mint Type\n',
        choices: [
            'Mint One SPL 2.0',
            'Mint Multiple SPL 2.0s',
            'Exit',
        ]
    });
    return handleMintSPL(answer.mint_type, spl);
}
async function handleMintSPL(answer, spl) {
    if (answer == 'Mint One SPL 2.0') {
        console.log(spl.spl_string);
        await runMint(spl.spl_string);
        console.log(chalk.blue('Complete!'));
        await mintSPL();
    }
    if (answer == 'Mint Multiple SPL 2.0s') {
        const mintLoop = await inquirer.prompt({
            name: 'mint_loops',
            type: 'number',
            message: 'Enter Number of Mints'
        });
        console.log(mintLoop);
        let i;
        for (i = 1; i <= mintLoop.mint_loops; i++) {
            await runMint(spl.spl_string);
            console.log(chalk.blue('Complete!'));
        }
        await mintSPL();
    }
    if (answer == 'Exit') {
        process.exit(0);
    }
}
async function runMint(mintCode) {
    try {
        await iqsdk.default.codeIn(mintCode, "SPL-2.0", "ASCII");
    }
    catch (error) {
        console.error('Oops something broke!', error);
    }
}
await title();
await subTitle();
await instructions();
await userInfo();
await getRPC();
await printEnvFile();
await initUserWallet();
await mintSPL();
