import puppeteer from "puppeteer"
import { eventLog } from "@/utils"

export enum WorkinStatus {
  In = "เข้ามาทำงาน",
  Out = "เลิกงาน"
}

export async function meanGoogleFormAutomation(workingStatus: WorkinStatus = WorkinStatus.In) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 })
  const page = await browser.newPage()
  await page.goto("https://docs.google.com/forms/d/e/1FAIpQLSdGQZnmKcV75FQSV_HOEreIQtsHuZY3Ni7752oKDSwWjePYUA/viewform")

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
  const allCheckboxWorkingStatus = await page.$$(".freebirdFormviewerComponentsQuestionRadioChoice.freebirdFormviewerComponentsQuestionRadioOptionContainer")
  eventLog("check", `working status is ${workingStatus}`)
  const statusIndex = workingStatus === WorkinStatus.In ? 0 : 1
  const checkbox = allCheckboxWorkingStatus[statusIndex]
  await checkbox.click()
  eventLog("click", "working status", "ok")

  // await browser.close()
}