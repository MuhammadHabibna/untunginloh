// test_e2e.mjs - End-to-End Automated Logic Verification for UntunginLOH
import {
  MENUS_TOKO_A,
  MENUS_TOKO_B,
  DEFAULT_COMM,
  modal,
  unitProfit,
  marginPct,
  buildTx,
} from './src/lib/data.ts';
import { extractOrdersWithGemini } from './src/lib/gemini.ts';

console.log("==========================================");
console.log("   E2E TESTING UNTUNGINLOH LOGIC SUITE   ");
console.log("==========================================\n");

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// Test 1: Multi-Tenant Data Isolation
const tokoAMenus = MENUS_TOKO_A.map(m => m.name);
const tokoBMenus = MENUS_TOKO_B.map(m => m.name);
const overlap = tokoAMenus.filter(m => tokoBMenus.includes(m));
assert(overlap.length === 0, "Test 1: Toko A and Toko B menus are completely isolated with zero overlap");

// Test 2: HPP (Modal per Porsi) Calculation
const esKelapa = MENUS_TOKO_A.find(m => m.id === 'kelapa_ori');
const hpp = modal(esKelapa);
// Kelapa (4000) + Sirup (30*40=1200) + Es (150*5=750) + Cup (550) = 6500? Wait, let's check:
// 4000 + 1200 + 750 + 550 = 6500
assert(hpp > 0 && hpp === 6500, `Test 2: BOM HPP for Es Kelapa Muda is accurately calculated (Expected: 6500, Actual: ${hpp})`);

// Test 3: Profit on Platform Channels (ShopeeFood 20% vs Di Tempat 0%)
const untungDiTempat = unitProfit(esKelapa, DEFAULT_COMM, 'tempat');
const untungShopee = unitProfit(esKelapa, DEFAULT_COMM, 'shopee');
// Price = 12000. Di Tempat: 12000 - 0 - 6500 = 5500. ShopeeFood: 12000 - 2400 (20%) - 6500 = 3100.
assert(untungDiTempat === 5500, `Test 3a: Di Tempat profit is Rp5.500 (Actual: ${untungDiTempat})`);
assert(untungShopee === 3100, `Test 3b: ShopeeFood 20% commission drops net profit to Rp3.100 (Actual: ${untungShopee})`);

// Test 4: Dynamic Margin Badge Calculation
const marginShopee = marginPct(esKelapa, DEFAULT_COMM, 'shopee'); // 3100 / 12000 * 100 = 25.83% -> Tipis
assert(marginShopee > 20 && marginShopee < 30, `Test 4: Shopee margin is ${marginShopee.toFixed(1)}% (Categorized as Tipis)`);

// Test 5: Dynamic Ingredient Price Change Impact
// If Kelapa price increases from 4000 to 5000:
const simulatedMenu = {
  ...esKelapa,
  ingredients: esKelapa.ingredients.map(i => i.name === 'Kelapa muda' ? { ...i, unitPrice: 5000 } : i)
};
const newHpp = modal(simulatedMenu);
const newUntungShopee = unitProfit(simulatedMenu, DEFAULT_COMM, 'shopee');
assert(newHpp === 7500, `Test 5a: HPP increases immediately to Rp7.500 when raw coconut price rises to Rp5.000`);
assert(newUntungShopee === 2100, `Test 5b: Net profit on Shopee decreases to Rp2.100 (kebocoran margin terpantau)`);

// Test 6: Transaction Building & Record Structure
const tx = buildTx(MENUS_TOKO_A, DEFAULT_COMM, 'shopee', [{ menuId: 'kelapa_ori', qty: 2 }], 'Bu Sari (Pemilik)', 'today', '14.00', 'tx_test', 'Hari Ini');
assert(tx.sales === 24000, `Test 6a: Gross sales is Rp24.000 for 2 cups`);
assert(tx.commission === 4800, `Test 6b: 20% commission is Rp4.800`);
assert(tx.cost === 13000, `Test 6c: Total modal bahan is Rp13.000`);
assert(tx.profit === 6200, `Test 6d: Total net profit is Rp6.200 (2 x Rp3.100)`);

// Test 7: AI Order Extraction (Live Gemini API Call with Fallback Resilience)
console.log("\nTesting AI Order Extraction with Google Gemini API...");
const aiSampleText = "Hari ini di ShopeeFood laku Es Kelapa Muda Original 15 cup dan Es Kuwut Bali 8 cup";
const extracted = await extractOrdersWithGemini(aiSampleText, MENUS_TOKO_A, 'shopee');
assert(extracted.length >= 2, `Test 7a: AI extracted ${extracted.length} order lines from text`);
assert(extracted[0].channel === 'shopee', `Test 7b: AI correctly recognized channel as 'shopee'`);
assert(extracted.some(r => r.qty === 15), `Test 7c: AI correctly extracted quantity 15 for Es Kelapa`);

console.log("\n==========================================");
console.log(`E2E TEST RESULT: ${passed} / ${total} TESTS PASSED!`);
console.log("==========================================");

