const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const legoDealsPath = path.join(__dirname, "..", "lego_deals.json");
const deals = JSON.parse(fs.readFileSync(legoDealsPath));

const scrapeWithCookies = async (searchText) => {
  try {
    const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&search_text=${searchText}&brand_ids=89162&status_ids=6,1`;

    const response = await fetch(url, {
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "fr",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "x-anon-id": "6f525989-ed1c-4c6d-9436-68dc67c35c54",
        "x-csrf-token": "75f6c9fa-dc8e-4e52-a000-e09dd4084b3e",
        "x-money-object": "true",
        "cookie":  "v_udt=djBrNXNPS2Z6REgyMHR1WHJoREZia1NMSEJMdy0tVVZyZXJsdDdhVzhxY3JrcS0tRjNrMjZXbGFjRmJ6YzN6RmZBTWEyUT09; anonymous-locale=fr; anon_id=6f525989-ed1c-4c6d-9436-68dc67c35c54; OptanonAlertBoxClosed=2025-03-25T13:25:44.428Z; eupubconsent-v2=CQO0udgQO0udgAcABBENBiFgAAAAAAAAAChQAAAAAAFhIIAACAAFwAUABUADgAHgAQQAyADUAHgATAAqgBvAD0AH4AQkAhgCJAEcAJYATQArQBhwDKAMsAbIA74B7AHxAPsA_QCAAEUgIuAjABGgCggFQAKuAXMAxQBogDaAG4AOIAh0BIgCdgFDgKPAUiApsBbAC5AF3gLzAYaAyQBk4DLgGcwNYA1kBsYDbwG6gOTAcuA8cB7QEIQIXhADoADgASADnAIOAT8BHoCRQErAJtAU-AsIBeQDEAGLQMhAyMBowDUwG0ANuAboA8oB8gD9wICAQMggiCCYEGAIVgQuHALwAEQAOAA8AC4AJAAfgBoAHOAO4AgEBBwEIAJ-AVAAvQB0gEIAI9ASKAlYBMQCZQE2gKQAUmArsBagDEAGLAMhAZMA0YBpoDUwGvANoAbYA24Bx8DnQOfAeUA-IB9sD9gP3AgeBBECDAEGwIVjoJQAC4AKAAqABwAEAALoAZABqADwAJgAVYAuAC6AGIAN4AegA_QCGAIkARwAlgBNACjAFaAMMAZQA0QBsgDvAHtAPsA_YCKAIwAUEAq4BYgC5gF5AMUAbQA3ABxADqAIdAReAkQBMgCdgFDgKPgU0BTYCrAFigLYAXAAuQBdoC7wF5gL6AYaAx4BkgDJwGVQMsAy4BnIDVQGsANvAbqA4sByYDlwHjgPaAfWBAECFpAAmAAgANAA5wCxAI9ATaApMBeQDUwG2ANuAc-A8oB8QD9gIHgQYAg2BCshAbAAWABQAFwAVQAuABiADeAHoAd4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAJgAVQAuABigEMARIAjgBRgCtAGyAO8AfgBVwDFAHUAQ6Ai8BIgCjwFNgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDUABcAFAAVAA4ACCAGQAaAA8ACYAFUAMQAfoBDAESAKMAVoAygBogDZAHfAPsA_QCLAEYAKCAVcAuYBeQDFAG0ANwAh0BF4CRAE7AKHAU2AsUBbAC4AFyALtAXmAvoBhoDJAGTwMsAy4BnMDWANZAbeA3UByYDxwHtAQhAhaUAQAAXABIAI4Ac4A7gCAAEiALEAa8A7YB_wEegJFATEAm0BSACnwFdgLyAYsAyYBqYDXgHlAPigfsB-4EDAIHgQTAgwBBsCFZaACApsAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=73167c2c-1743871451; __cf_bm=uiOOCdNA4DCCaYS5coOPvl.l1GhFtkiCPl7qGDuMN38-1743951684-1.0.1.1-xylKtAsJtiYJZxHNpes5Vnh9lHw4NYa8OAetjJ4oMo0GkoxhCTgqkt6RGY10V1QA6Y_5Aq7xXRovW_A.HuCTo1GPPOGtHjL9v8dZq2tLLVyY.zdv7WuDa124lwpay2.x; cf_clearance=9S5OI78rZ2OK6FICgrnBf5KJBvBZYOXaCG104N8QXyE-1743951685-1.2.1.1-2U0mwpBL3lR60qSwf6PCy1UOKdYyXvjLCcvlA0F0fPT19LulbcTqbE9FBFNFtuuL7V2B3il_QNQjOukuFBqjWPDqOSXO_IKYKHt95su2SYLKwbf3ul92vWxqaxd2bgo8m81PvD_ou8plhYw5caSespD_zzmViIZ.PHmJ6XMf2PFK2tCYKms476wGrbLmq4kfBDVwJD3QKhOU88Q6SEFUql0jA1k1tsynREh4_IAUcj3w2N87cg38c56cdcMuAOHpfh_p6LWxKfmawwg_Wb3eDhZW_T2_lU2Cuyw8V5gK_vLUpnyC82GUXddlm.21YTGFwYZlWRrtSoxRU_ct_12FQ5j7usJ6hIUqBW_fvL7oowI; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTUxNjg1LCJzaWQiOiI3MzE2N2MyYy0xNzQzODcxNDUxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM5NTg4ODUsInB1cnBvc2UiOiJhY2Nlc3MifQ.tGtnDu-9Zl_Ox7JGRHLCvlrY6yGATW90cifDV1AXdZcpwOL-ihJKu6NY4CpH0aIGh-bt4ubPpByIKeVLFOu9QRqXrEhyDt-TtzsgzRMEk6BUVdlEyPx1_9MAIOxMMEsyBYJZpibQfFZ2stL-x52H-gN_kB0iY_QNrTnBVZQgdCMLD4D4GqZJ3SckgtUC8t-GrfcfNrRCKeyVQn2s0RkPPES2FhfABVQyWUnxYysq5IxVlDjms8duOa_gCf7AESKBXYnie2vd5nDK3mUQ21RdbvPrgcziXenoeb-_0rgXJtfWxYtFrmtP8daPHRuHN5zd1ED0J-cJOcksW61JUAIp9g; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTUxNjg1LCJzaWQiOiI3MzE2N2MyYy0xNzQzODcxNDUxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ1NTY0ODUsInB1cnBvc2UiOiJyZWZyZXNoIn0.E6V9MapqXqMW44fYBuSRu2i1ZA-TJY_GX_-9KtFmi1XGnND7D5zo6xwuLmNVUDIKHnsY_3EO_K8ZElKgQtSL2goRJxjlYq21GkGqhUJKUSb1AMyMMdh_WhhA6MDvy9FT7AdGwzhi6-hVWvGoB5bPAR8UbpGKCl7vDhyyIuZO6c0duWXzrCqNbBs6noLFY4KnUAmyWdptPD_W0z9ot4b04b6yiV8e7sm4syzJcMocxGoF9Pv-fe154v3CM55w0eqt7yeqeRX5P4P6P0JcayeeNdEs11ZIVBNWUUke1tKOc8MALKA1xVIPVwCBpKhZjQil7MW_rQ2vFUo3opSDIZ1l9Q; datadome=uAlI_fI4SHxF~f8o7CIhHCD~1ycr~b~0nmiO5zGbcbb0U4vgSZ0hsLXzhaAQHHNa6dTkql4JgHmJBRLe73tIUIKvuhQqH6KqH7cS~41JCO4zGTJ8YmvLc5z63sdHEJbd; viewport_size=530; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Apr+06+2025+17%3A01%3A47+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=6f525989-ed1c-4c6d-9436-68dc67c35c54&interactionCount=18&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; _vinted_fr_session=TVk1VXlFQ211WDVXa0loY0FJbi9JU3pWMDdvL2MyNkFvVWFGdlZhYUJMY1JRSjd2UGhvampyRGhzTlF6Q25ST2VFMXRBaFgvZlBBTHpGc1JpZVVYYk1pWFJKcjF1anhnMnBkRDhrMytJN3BrR3JrdlJRb3pDMFJxM0xSd3pSaVVLalFsRGNUZ0F0ZkREVWJwNmRPZUthRitBZVVXbXN2RTlyaFpSUUV6RnZhVHNNelFaUlRqQUFhMGJzekUwSGUvVU9tR0hzSVNNVGsrWjFCWWRnREk1cXc4RDlqTTFRUTBjcW9JSFZVbU41QlRxNTl3ZU4zUHZoMzM2YkFQU0NmOVpXdVpLZU8yaUJxNzdoZlRoUWJiTXVYVXVuNW5CcEQ5T2pKeVVXVVhlZTdFVDVNenBsWDRrSVBlZ1JRd1U2WlFqU1hveUkvYyt4SDJEN3F5R2NwVXJWeUU4OC9teWRsazJTN0NpV2tJR1FjYmlibngwSkN1TVp4STV4N0p0ZW5VYVYrSE9QZW1WM3ZDOGJ2OVlJNTVSdzZrWWVBeHdwei9wSTE4L3FHdWx2eWw1N24xTVd2WTluQmtGR1BRWDRqSzg3cVNScFcrUlZGU005Wis2YjJ5QmdPRXVYTVdzS0p6YnV0c21OSTBhSW9ua0R1YWpPalZRMGNid3ZSNUFMN25ENmtJWnQ3U05Fd2tOUGF3ZzU2eHk4cE81aCtSZFE0VU9OM2tJSldHUDY5UlNCRG1YZTZDWGZlaExWbjhQeG12ZUFHaXNPV3E4dC8veWprdVhuUFAvWVJHNWNrYm9LZkhpRDQvUlVmcyt1S2c5b3pOMmRPbk9ubTdjTWVSWjgyczB2K0tuanowWkgvaDcrcVl4NkJSQlVTS1FXYkNSNEVHUDFaZHhXYXlxNFB6WnlvRi9rUVJqL2gyc29rVzNSU29CTXpXVWYwL0tmOCtsRGN1MXhVNisvVDNuN2RuRko1MStEdWc3aXNKZTNaaEU3cE5xelRqaFNBeC9PUlVZcXdxeGhoM2lQa1RidnFqTVd6ZENnaktjcUFCYS81UnlMZWsrVnZLNnlPcVd1d3NvNHdRWE5jYjhhK1ZpZVoxalBBMUxVUUlQR2NnTVZZcXE0UkFWUnVzT1ZlL21LZDI3WW9XdW90MmdhbGhVUVlJRGtoTFNMeDR4ZUF4STRPek8yczRzaW5UVkZELzBZZkZjazlzYWpIUVJEOTBUREZTU05YY2NoSHg3ejIvc0V2UnI1MkNraG1lUjFBZ3ZaR2dXemdsR25SN0taVnhvbVowcDFmcWRjR0JNSHBhdHVjbS9yVjFrVGY3VHZkTlRDT3YySzliQlVJUm9KSGc0bGNRY25oQ1RLbE5VZkZ5SmtUYVN0SWNPNHJRcU1yaTJ5YXlmazVWYVZWdWc2L0YwSUtSQnQ3SDBONjhleWRCQ2lYQU41eE4zUHQxUVVvUjJuU1NoL1o4R1pTYjdVYTkzNVpHVG1NYWs0c0JlZlBMdU15MGN5UU1sWEw3RHdXUW01RUYzYW5aaFljbExMVVQvUUxheG9Jb3VKaFZ1anBLNWM0WkdGa0RZTDNzbkZVUkRUdFNpdFJJdnowWUZUWXFycHhadEhPSEtvOW9XeE9meTZpL09KRVY3V0FnY1Q0TXVOS1Z4WU9vMlEva0RZNXhhREE5OUhoeEFvY1BSNTFZd1hXYTBSUzdNRWFUcXVhb0pGWXhmL2ZJb2plT090TlhIMk51THUrOTNlZmtrYnV2MUREL2cyWTlYSTlnR3h1dDVnOWQva3o2RjhkNjEvMVFIT2MyckYzbTlydStiSkJoajBsMC9YMHR3VkZLOWVXbGg5Z1JzZU9sUElTSFJlOXFtRllaTDk5Y1Fyd3B4VmVxejM5QXRZb3dRRmJPMHpmZEU2NWQzWWh1Y2Vad1ArdDlaNDhqbnNwcFFPTHZmWm1SZ3VUd3dPaldCZzE0UUVJVXMrL1k1d1V2aDFLTjBrN3oyZDV4ZHRkSEg3RWhXb3hMaEFYckRPTkl4R1ZIMDNPUE5zd3Ura0NSdFJMTlU3cGNTV2FBa1lqTFFSY2x2eGtnanZuRlVqT2s4UDNDaU40czNlS05zNG9RUTFoN3pvR2U3VzB1cGEvSkp1bnNHNzlTU2pHUXF4ZWtjL0g5QXpid1V0dmt2M0s2djJBUmdBZEFMSmt5QlN2Q3BwamZBOWwwZENaMWVCQmV1UGZTZUUyTU5TTTVYTC9HV3pINVhJYmwzdS93UnBiTDBqOGJIa3pLY2QzMWMzZVB3Y2VYMzIydFVaQkkxRG0vR0xicVArdUdoVXdnMm10UGh4OEQ0cFhpRGxwM1hFS2dtUjdIcFVNUmdFc29GT0F1TFNDZzdCQTQ0cU9IUDJzWC0tc3RZOG13L3VLL1ZxTEI2M09GVzJoQT09--b43912c4f2f04b5394bb8fb348fb08dc64a2f1e2; banners_ui_state=PENDING"
      },
      method: "GET"
    });

    if (!response.ok) {
      console.warn(`⚠️ ${searchText} → Erreur HTTP : ${response.status}`);
      return [];
    }

    const data = await response.json();
    const enhancedItems = data.items.map(item => {
      const timestamp = item?.photo?.high_resolution?.timestamp || Math.floor(Date.now() / 1000);
      return {
        ...item,
        published: new Date(timestamp * 1000).toISOString()  // Format ISO compatible avec MongoDB
      };
    });
    

    if (!data.items || data.items.length === 0) {
      console.log(`📭 Aucun résultat pour LEGO ${searchText}`);
      return [];
    }

    const filename = `vinted_${searchText}.json`;
    const savePath = path.join(__dirname, "..", filename);
    fs.writeFileSync(savePath, JSON.stringify(enhancedItems, null, 2));
    console.log(`✅ ${enhancedItems.length} ventes → ${filename}`);
    return enhancedItems;


  } catch (err) {
    console.error(`💥 Erreur pour ${searchText} :`, err.message);
    return [];
  }
};

(async () => {
    const ids = [...new Set(deals.map(deal => deal.id).filter(Boolean))];

  console.log(`🔎 ${ids.length} IDs LEGO trouvés dans lego_deals.json`);
  for (const id of ids) {
    await scrapeWithCookies(id);
  }
})();
