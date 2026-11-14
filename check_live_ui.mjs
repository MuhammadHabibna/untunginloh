// check_live_ui.mjs - Automated Visual & Layout Quality Checker (Desktop & Mobile POV)
import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE_URL = 'http://localhost:8443'
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots')

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

async function runLiveCheck() {
  console.log('Starting Automated Live UI Quality Check on', BASE_URL)
  console.log('   Using Chrome at:', CHROME_PATH)

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const results = {
    desktop: [],
    mobile: [],
    consoleErrors: [],
  }

  try {
    const page = await browser.newPage()

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Ignore React dev Fast Refresh warnings or minor non-fatal messages
        if (!text.includes('Fast Refresh') && !text.includes('favicon')) {
          results.consoleErrors.push(text)
        }
      }
    })

    page.on('pageerror', (err) => {
      results.consoleErrors.push(err.message)
    })

    // ============================================================
    // 1. DESKTOP VIEWPORT CHECK (1440 x 900 - Laptop / Wide Screen)
    // ============================================================
    console.log('\n--- [1] CHECKING DESKTOP POV (1440 x 900) ---')
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1000))

    // Helper to check for horizontal overflow
    const checkOverflow = async () => {
      return await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })
    }

    // A. Desktop Dashboard
    const desktopDashboardPath = path.join(SCREENSHOT_DIR, 'desktop_dashboard.png')
    await page.screenshot({ path: desktopDashboardPath })
    const hasOverflowD1 = await checkOverflow()
    results.desktop.push({
      screen: 'Dashboard',
      overflow: hasOverflowD1,
      screenshot: desktopDashboardPath,
    })
    console.log(`[PASS] Desktop Dashboard captured (Overflow: ${hasOverflowD1 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // B. Desktop Kasir POS
    // Click Kasir in desktop sidebar
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const kasirBtn = buttons.find((b) => b.textContent.includes('Kasir POS'))
      if (kasirBtn) kasirBtn.click()
    })
    await new Promise((r) => setTimeout(r, 500))
    const desktopKasirPath = path.join(SCREENSHOT_DIR, 'desktop_kasir.png')
    await page.screenshot({ path: desktopKasirPath })
    const hasOverflowD2 = await checkOverflow()
    results.desktop.push({
      screen: 'Kasir POS',
      overflow: hasOverflowD2,
      screenshot: desktopKasirPath,
    })
    console.log(`[PASS] Desktop Kasir POS captured (Overflow: ${hasOverflowD2 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // C. Desktop Katalog Resep & HPP
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const menuBtn = buttons.find((b) => b.textContent.includes('Resep & HPP'))
      if (menuBtn) menuBtn.click()
    })
    await new Promise((r) => setTimeout(r, 500))
    const desktopMenuPath = path.join(SCREENSHOT_DIR, 'desktop_menu.png')
    await page.screenshot({ path: desktopMenuPath })
    const hasOverflowD3 = await checkOverflow()
    results.desktop.push({
      screen: 'Katalog Resep & HPP',
      overflow: hasOverflowD3,
      screenshot: desktopMenuPath,
    })
    console.log(`[PASS] Desktop Resep & HPP captured (Overflow: ${hasOverflowD3 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // D. Desktop Riwayat Transaksi
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const riwayatBtn = buttons.find((b) => b.textContent.includes('Riwayat Transaksi'))
      if (riwayatBtn) riwayatBtn.click()
    })
    await new Promise((r) => setTimeout(r, 500))
    const desktopRiwayatPath = path.join(SCREENSHOT_DIR, 'desktop_riwayat.png')
    await page.screenshot({ path: desktopRiwayatPath })
    const hasOverflowD4 = await checkOverflow()
    results.desktop.push({
      screen: 'Riwayat Transaksi',
      overflow: hasOverflowD4,
      screenshot: desktopRiwayatPath,
    })
    console.log(`[PASS] Desktop Riwayat captured (Overflow: ${hasOverflowD4 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // E. Desktop Pengaturan Toko
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const pengBtn = buttons.find((b) => b.textContent.includes('Pengaturan Toko'))
      if (pengBtn) pengBtn.click()
    })
    await new Promise((r) => setTimeout(r, 500))
    const desktopPengaturanPath = path.join(SCREENSHOT_DIR, 'desktop_pengaturan.png')
    await page.screenshot({ path: desktopPengaturanPath })
    const hasOverflowD5 = await checkOverflow()
    results.desktop.push({
      screen: 'Pengaturan Toko',
      overflow: hasOverflowD5,
      screenshot: desktopPengaturanPath,
    })
    console.log(`[PASS] Desktop Pengaturan captured (Overflow: ${hasOverflowD5 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // F. Desktop Onboarding (Form Pilih Jenis Usaha & Opsi Lainnya)
    await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))
    // Click on template 'Lainnya'
    await page.evaluate(() => {
      const elms = Array.from(document.querySelectorAll('div'))
      const lainnyaCard = elms.find((el) => el.textContent && el.textContent.includes('Lainnya (Kustomisasi Mandiri)'))
      if (lainnyaCard) lainnyaCard.click()
    })
    await new Promise((r) => setTimeout(r, 400))
    const desktopOnboardingPath = path.join(SCREENSHOT_DIR, 'desktop_onboarding.png')
    await page.screenshot({ path: desktopOnboardingPath })
    const hasOverflowD6 = await checkOverflow()
    results.desktop.push({
      screen: 'Onboarding Step 1 & Opsi Lainnya',
      overflow: hasOverflowD6,
      screenshot: desktopOnboardingPath,
    })
    console.log(`[PASS] Desktop Onboarding Step 1 captured (Overflow: ${hasOverflowD6 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // G. Desktop Onboarding Step 3 (Input Menu & Bahan Kustom dari User)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const lanjutBtn = buttons.find((b) => b.textContent.includes('Lanjut ke Identitas Toko'))
      if (lanjutBtn) lanjutBtn.click()
    })
    await new Promise((r) => setTimeout(r, 400))
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const step3Btn = buttons.find((b) => b.textContent.includes('Periksa Menu & Bahan'))
      if (step3Btn) step3Btn.click()
    })
    await new Promise((r) => setTimeout(r, 500))

    // Type a new custom menu and press enter
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'))
      const menuInput = inputs.find((inp) => inp.placeholder && inp.placeholder.includes('Tambah menu baru'))
      if (menuInput) {
        menuInput.value = 'Es Kopi Susu Creamy'
        menuInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const addMenuBtn = buttons.find((b) => b.textContent.includes('Tambah') && b.closest('.space-y-2')?.textContent?.includes('Menu / Produk'))
      if (addMenuBtn) addMenuBtn.click()
    })
    await new Promise((r) => setTimeout(r, 400))

    const desktopStep3Path = path.join(SCREENSHOT_DIR, 'desktop_onboarding_step3.png')
    await page.screenshot({ path: desktopStep3Path })
    const hasOverflowD7 = await checkOverflow()
    results.desktop.push({
      screen: 'Onboarding Step 3 (Input Menu & Bahan)',
      overflow: hasOverflowD7,
      screenshot: desktopStep3Path,
    })
    console.log(`[PASS] Desktop Onboarding Step 3 captured (Overflow: ${hasOverflowD7 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // ============================================================
    // 2. MOBILE VIEWPORT CHECK (390 x 844 - iPhone 14 / Android Native)
    // ============================================================
    console.log('\n--- [2] CHECKING MOBILE POV (390 x 844) ---')
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1000))

    // A. Mobile Dashboard
    const mobileDashboardPath = path.join(SCREENSHOT_DIR, 'mobile_dashboard.png')
    await page.screenshot({ path: mobileDashboardPath })
    const hasOverflowM1 = await checkOverflow()
    results.mobile.push({
      screen: 'Dashboard',
      overflow: hasOverflowM1,
      screenshot: mobileDashboardPath,
    })
    console.log(`[PASS] Mobile Dashboard captured (Overflow: ${hasOverflowM1 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // B. Mobile Kasir POS
    // Click Kasir in bottom nav
    await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Navigasi utama mobile"]')
      if (nav) {
        const buttons = Array.from(nav.querySelectorAll('button'))
        const kasirBtn = buttons.find((b) => b.textContent.includes('Kasir'))
        if (kasirBtn) kasirBtn.click()
      }
    })
    await new Promise((r) => setTimeout(r, 500))
    const mobileKasirPath = path.join(SCREENSHOT_DIR, 'mobile_kasir.png')
    await page.screenshot({ path: mobileKasirPath })
    const hasOverflowM2 = await checkOverflow()
    results.mobile.push({
      screen: 'Kasir POS',
      overflow: hasOverflowM2,
      screenshot: mobileKasirPath,
    })
    console.log(`[PASS] Mobile Kasir POS captured (Overflow: ${hasOverflowM2 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // C. Mobile Menu Resep
    await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Navigasi utama mobile"]')
      if (nav) {
        const buttons = Array.from(nav.querySelectorAll('button'))
        const menuBtn = buttons.find((b) => b.textContent.includes('Resep'))
        if (menuBtn) menuBtn.click()
      }
    })
    await new Promise((r) => setTimeout(r, 500))
    const mobileMenuPath = path.join(SCREENSHOT_DIR, 'mobile_menu.png')
    await page.screenshot({ path: mobileMenuPath })
    const hasOverflowM3 = await checkOverflow()
    results.mobile.push({
      screen: 'Resep & HPP',
      overflow: hasOverflowM3,
      screenshot: mobileMenuPath,
    })
    console.log(`[PASS] Mobile Resep & HPP captured (Overflow: ${hasOverflowM3 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // D. Mobile Riwayat
    await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Navigasi utama mobile"]')
      if (nav) {
        const buttons = Array.from(nav.querySelectorAll('button'))
        const rBtn = buttons.find((b) => b.textContent.includes('Riwayat'))
        if (rBtn) rBtn.click()
      }
    })
    await new Promise((r) => setTimeout(r, 500))
    const mobileRiwayatPath = path.join(SCREENSHOT_DIR, 'mobile_riwayat.png')
    await page.screenshot({ path: mobileRiwayatPath })
    const hasOverflowM4 = await checkOverflow()
    results.mobile.push({
      screen: 'Riwayat Transaksi',
      overflow: hasOverflowM4,
      screenshot: mobileRiwayatPath,
    })
    console.log(`[PASS] Mobile Riwayat captured (Overflow: ${hasOverflowM4 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // E. Mobile Onboarding (Form Pilih Jenis Usaha & Opsi Lainnya)
    await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))
    await page.evaluate(() => {
      const elms = Array.from(document.querySelectorAll('div'))
      const lainnyaCard = elms.find((el) => el.textContent && el.textContent.includes('Lainnya (Kustomisasi Mandiri)'))
      if (lainnyaCard) lainnyaCard.click()
    })
    await new Promise((r) => setTimeout(r, 400))
    const mobileOnboardingPath = path.join(SCREENSHOT_DIR, 'mobile_onboarding.png')
    await page.screenshot({ path: mobileOnboardingPath })
    const hasOverflowM5 = await checkOverflow()
    results.mobile.push({
      screen: 'Onboarding Step 1 & Opsi Lainnya',
      overflow: hasOverflowM5,
      screenshot: mobileOnboardingPath,
    })
    console.log(`[PASS] Mobile Onboarding Step 1 captured (Overflow: ${hasOverflowM5 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // F. Mobile Onboarding Step 3 (Input Menu & Bahan Kustom dari User)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const lanjutBtn = buttons.find((b) => b.textContent.includes('Lanjut ke Identitas Toko'))
      if (lanjutBtn) lanjutBtn.click()
    })
    await new Promise((r) => setTimeout(r, 400))
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const step3Btn = buttons.find((b) => b.textContent.includes('Periksa Menu & Bahan'))
      if (step3Btn) step3Btn.click()
    })
    await new Promise((r) => setTimeout(r, 500))

    const mobileStep3Path = path.join(SCREENSHOT_DIR, 'mobile_onboarding_step3.png')
    await page.screenshot({ path: mobileStep3Path })
    const hasOverflowM6 = await checkOverflow()
    results.mobile.push({
      screen: 'Onboarding Step 3 (Input Menu & Bahan)',
      overflow: hasOverflowM6,
      screenshot: mobileStep3Path,
    })
    console.log(`[PASS] Mobile Onboarding Step 3 captured (Overflow: ${hasOverflowM6 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // G. Mobile Asisten Catat AI
    await page.goto(`${BASE_URL}/toko_a/asisten`, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))
    const mobileAsistenPath = path.join(SCREENSHOT_DIR, 'mobile_asisten.png')
    await page.screenshot({ path: mobileAsistenPath })
    const hasOverflowM7 = await checkOverflow()
    results.mobile.push({
      screen: 'Asisten Catat AI',
      overflow: hasOverflowM7,
      screenshot: mobileAsistenPath,
    })
    console.log(`[PASS] Mobile Asisten Catat AI captured (Overflow: ${hasOverflowM7 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // H. Mobile Tanya Bisnis AI
    await page.goto(`${BASE_URL}/toko_a/tanya`, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))
    const mobileTanyaPath = path.join(SCREENSHOT_DIR, 'mobile_tanya.png')
    await page.screenshot({ path: mobileTanyaPath })
    const hasOverflowM8 = await checkOverflow()
    results.mobile.push({
      screen: 'Tanya Bisnis AI',
      overflow: hasOverflowM8,
      screenshot: mobileTanyaPath,
    })
    console.log(`[PASS] Mobile Tanya Bisnis AI captured (Overflow: ${hasOverflowM8 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // I. Mobile Pengaturan Toko
    await page.goto(`${BASE_URL}/toko_a/pengaturan`, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))
    const mobilePengaturanPath = path.join(SCREENSHOT_DIR, 'mobile_pengaturan.png')
    await page.screenshot({ path: mobilePengaturanPath })
    const hasOverflowM9 = await checkOverflow()
    results.mobile.push({
      screen: 'Pengaturan Toko',
      overflow: hasOverflowM9,
      screenshot: mobilePengaturanPath,
    })
    console.log(`[PASS] Mobile Pengaturan Toko captured (Overflow: ${hasOverflowM9 ? 'YES (BAD)' : 'NO (GOOD)'})`)

    // I.2 Mobile Logout Verification (Clicking Logout from Mobile Header)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const logoutBtn = buttons.find((b) => b.textContent.includes('Keluar'))
      if (logoutBtn) logoutBtn.click()
    })
    await new Promise((r) => setTimeout(r, 600))
    const isLoginVisible = await page.evaluate(() => {
      return !!document.querySelector('div[data-name="Layar Masuk"]')
    })
    console.log(`[PASS] Mobile Logout Button clicked -> Navigated to Login: ${isLoginVisible ? 'SUCCESS (GOOD)' : 'FAILED'}`)
    if (!isLoginVisible) {
      results.consoleErrors.push('Mobile Logout button did not navigate to Layar Masuk')
    }

    // J. Mobile Login Page
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 500))
    const mobileLoginPath = path.join(SCREENSHOT_DIR, 'mobile_login.png')
    await page.screenshot({ path: mobileLoginPath })
    const hasOverflowM10 = await checkOverflow()
    results.mobile.push({
      screen: 'Layar Masuk / Login',
      overflow: hasOverflowM10,
      screenshot: mobileLoginPath,
    })
    console.log(`[PASS] Mobile Layar Masuk captured (Overflow: ${hasOverflowM10 ? 'YES (BAD)' : 'NO (GOOD)'})`)

  } finally {
    await browser.close()
  }

  console.log('\n==========================================')
  console.log('       LIVE UI CHECK REPORT SUMMARY       ')
  console.log('==========================================')
  console.log(`Desktop Screens Verified: ${results.desktop.length}`)
  results.desktop.forEach((d) => {
    console.log(` - ${d.screen}: ${d.overflow ? 'FAILED (Horizontal scroll)' : 'PERFECT'} [${d.screenshot}]`)
  })

  console.log(`\nMobile Screens Verified: ${results.mobile.length}`)
  results.mobile.forEach((m) => {
    console.log(` - ${m.screen}: ${m.overflow ? 'FAILED (Horizontal scroll)' : 'PERFECT'} [${m.screenshot}]`)
  })

  console.log(`\nConsole Error Count: ${results.consoleErrors.length}`)
  if (results.consoleErrors.length > 0) {
    console.log('Console Errors found:')
    results.consoleErrors.forEach((e) => console.log('  !', e))
  } else {
    console.log('Clean Console: Zero runtime errors detected.')
  }
  console.log('==========================================\n')

  const totalOverflow = results.desktop.filter((x) => x.overflow).length + results.mobile.filter((x) => x.overflow).length
  if (totalOverflow > 0 || results.consoleErrors.length > 0) {
    process.exit(1)
  }
}

runLiveCheck().catch((err) => {
  console.error('Live check failed to execute:', err)
  process.exit(1)
})
