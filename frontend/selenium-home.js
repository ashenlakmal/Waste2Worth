const { Builder, By, until } = require('selenium-webdriver');

async function runSeleniumTest() {
    // 1. Open a new Chrome browser window
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 2. Go to the Home page
        await driver.get('http://localhost:3000');

        // 3. Find the button with the text "Start Your Journey Now"
        let startButton = await driver.findElement(By.xpath("//*[contains(text(), 'Start Your Journey Now')]"));

        // 4. Click the button
        await startButton.click();

        // 5. Check if the URL contains "BrowseListings" after clicking the button
        await driver.wait(until.urlContains('BrowseListings'), 5000);

        console.log("Test Passed! The button click navigated to the BrowseListings page successfully.");

        // Remain on the page for 3 seconds
        await driver.sleep(3000);

    } catch (error) {
        console.log("Test Failed! Error occurred:", error);
    } finally {
        // 6. Close the browser window
        await driver.quit();
    }
}

runSeleniumTest();