'use strict';
var debug = require('debug')('PsyBot');
const puppeteer = require('puppeteer');

const username = process.env.RAIDBOT_USER;
const password = process.env.RAIDBOT_PASS;

const performDroptimizer = async (character, mythicLevel = '11', realm = 'ravenholdt', server = 'eu') => {
    mythicLevel = mythicLevel > 15 ? 15 : mythicLevel;

    const browser = await puppeteer.launch({ 
        headless: true, 
        executablePath: '/usr/bin/chromium-browser',
        args: ['--disable-dev-shm-usage', '--no-sandbox'] 
    });
    const page = await browser.newPage();
    await page.goto('https://www.raidbots.com/auth', { waitUntil: 'networkidle2' });
    await page.type('input[type=email]', username)
    await page.type('input[type=password]', password)
    const [loginButton] = await page.$x("//button[contains(text(), 'Login')]");
    if (loginButton) {
        await loginButton.click();
    }
    await page.waitForNavigation()
    await page.goto('https://www.raidbots.com/simbot/droptimizer', { waitUntil: 'networkidle2' });

    await page.select('#ArmoryInput-armoryRegion', server)
    await page.click("#ArmoryInput-armoryRealm")
    await page.type("#ArmoryInput-armoryRealm", realm)
    await page.type("#ArmoryInput-armoryRealm", String.fromCharCode(13))
    await page.type('#ArmoryInput-armorySearch', character)
    await page.waitForSelector('svg[data-id=geomicon-refresh]')

    const [mythicplusSelector] = await page.$x("//p[contains(text(), 'Mythic+')]");
    if (mythicplusSelector) {
        await mythicplusSelector.click();
    }
    const [mythicSelector] = await page.$x(`//p[contains(text(), 'Mythic ${mythicLevel}')]`);
    if (mythicSelector) {
        await mythicSelector.click();
    }
    const [runDroptimizer] = await page.$x("//div[contains(text(), 'Run Droptimizer')]");
    if (runDroptimizer) {
        await runDroptimizer.click();
    }
    await page.waitForNavigation()
    const dropUrl = page.url();
    await browser.close();

    return dropUrl
};

module.exports = {
    enabled: true,
    prefix: "!wowdrop",
    // !wowdrop kalei 11 ravenholdt eu
    args: true,
    requiredRole: 'Raid Leader',
    callback: (bot, message, args) => {
        const splitArgs = args.toLowerCase().split(',');
        let dropPromise;

        if (splitArgs.length === 1) {
            dropPromise = performDroptimizer(splitArgs[0])
        }
        if (splitArgs.length === 2) {
            dropPromise = performDroptimizer(splitArgs[0], splitArgs[1])
        }
        if (splitArgs.length === 3) {
            dropPromise = performDroptimizer(splitArgs[0], splitArgs[1], splitArgs[2])
        }
        if (splitArgs.length === 4) {
            dropPromise = performDroptimizer(splitArgs[0], splitArgs[1], splitArgs[2], splitArgs=[3])
        }

        dropPromise.then(url => bot.reply(message, url, -1)).catch(e => bot.reply(message, "Something went wrong, try again."));
    }
}
