import puppeteer from "puppeteer"
import { eventLog, randomBetweenNumber } from "@/utils"

export enum WorkinStatus {
  In = "เข้ามาทำงาน",
  Out = "เลิกงาน"
}

export async function meanGoogleFormAutomation(workingStatus: WorkinStatus = WorkinStatus.In) {
  console.log(`------------ Begining Mean Automation @${new Date().toLocaleString()}-------------`)
  const browser = await puppeteer.launch({ headless: true, slowMo: 250 })
  const page = await browser.newPage()
  try {
    await page.goto("https://docs.google.com/forms/d/e/1FAIpQLSfixHCPJAibiKvt1trmklhwIOENLiaayUg8ewr1K3dO8ViW5Q/viewform?usp=sf_link", {
      waitUntil: "networkidle2"
    })

    // 1. ชื่อ-นามสกุล
    eventLog("begin", "select employee")
    const selectEmployee = await page.$(`[role="listbox"]`)
    await selectEmployee.click()
    const mean = await page.$(`[role="option"][data-value="3M-OP-0037 น.ส.สายเพชร ดำรงวงศ์สว่าง"]`)
    eventLog("query", "found mean", "ok")
    await mean.click()
    eventLog("click", "select mean", "ok")

    // 2. เข้างาน หรือ เลิกงาน
    eventLog("begin", "working status")
    const allCheckbox = await page.$$(".freebirdFormviewerComponentsQuestionRadioChoice.freebirdFormviewerComponentsQuestionRadioOptionContainer")
    eventLog("check", `working status is ${workingStatus}`)
    const statusIndex = workingStatus === WorkinStatus.In ? 0 : 1
    const checkbox = allCheckbox[statusIndex]
    await checkbox.click()
    eventLog("click", "working status", "ok")

    if (workingStatus === WorkinStatus.In) {
      // 3. วัดอุณหภูมิ (องศาเซลเซียส)- เฉพาะตอนเข้างานเท่านั้น
      eventLog("begin", "typing temperature")
      const temperatureInput = await page.$("input[type=text]")
      const randTemperature = randomBetweenNumber(36.2, 35)
      eventLog("random", `temperature is ${randTemperature}`, "ok")
      await temperatureInput.type(randTemperature)
      eventLog("type", "typing temperature", "ok")
    }

    // 4. สังเกตุอาการตนเองเบื้องต้น
    eventLog("begin", "sysptom status")
    await allCheckbox[allCheckbox.length - 1].click()
    eventLog("click", "sysptom status", "ok")

    eventLog("begin", "submit form")
    const buttonSubmit = await page.$(".freebirdFormviewerViewNavigationLeftButtons > [role=button]")
    await buttonSubmit.click()
    eventLog("click", "submit form", "ok")

    await page.waitForNavigation()
    eventLog("change page", "navigate to the next page", "ok")

    // Click to check location
    eventLog("begin", "get google script url")
    await page.waitForSelector(".freebirdFormviewerViewResponseConfirmationMessage > a")
    const urlEl = await page.$(".freebirdFormviewerViewResponseConfirmationMessage > a")
    const googlescriptUrl = await page.evaluate((el: Element) => el.innerHTML, urlEl)
    eventLog("Final !", `URL is ${googlescriptUrl}`, "ok")
    console.log("------------ Finish ------------")

  } catch (error) {
    console.log(error)
    page.screenshot({
      path: "./error-screenshot.png",
      fullPage: true
    })
    throw error
  } finally {
    await page.close()
    await browser.close()
  }
}