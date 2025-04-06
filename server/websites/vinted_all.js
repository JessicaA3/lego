const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const legoDealsPath = path.join(__dirname, "..", "lego_deals2.json");
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
        "cookie":  "v_udt=djBrNXNPS2Z6REgyMHR1WHJoREZia1NMSEJMdy0tVVZyZXJsdDdhVzhxY3JrcS0tRjNrMjZXbGFjRmJ6YzN6RmZBTWEyUT09; anonymous-locale=fr; anon_id=6f525989-ed1c-4c6d-9436-68dc67c35c54; OptanonAlertBoxClosed=2025-03-25T13:25:44.428Z; eupubconsent-v2=CQO0udgQO0udgAcABBENBiFgAAAAAAAAAChQAAAAAAFhIIAACAAFwAUABUADgAHgAQQAyADUAHgATAAqgBvAD0AH4AQkAhgCJAEcAJYATQArQBhwDKAMsAbIA74B7AHxAPsA_QCAAEUgIuAjABGgCggFQAKuAXMAxQBogDaAG4AOIAh0BIgCdgFDgKPAUiApsBbAC5AF3gLzAYaAyQBk4DLgGcwNYA1kBsYDbwG6gOTAcuA8cB7QEIQIXhADoADgASADnAIOAT8BHoCRQErAJtAU-AsIBeQDEAGLQMhAyMBowDUwG0ANuAboA8oB8gD9wICAQMggiCCYEGAIVgQuHALwAEQAOAA8AC4AJAAfgBoAHOAO4AgEBBwEIAJ-AVAAvQB0gEIAI9ASKAlYBMQCZQE2gKQAUmArsBagDEAGLAMhAZMA0YBpoDUwGvANoAbYA24Bx8DnQOfAeUA-IB9sD9gP3AgeBBECDAEGwIVjoJQAC4AKAAqABwAEAALoAZABqADwAJgAVYAuAC6AGIAN4AegA_QCGAIkARwAlgBNACjAFaAMMAZQA0QBsgDvAHtAPsA_YCKAIwAUEAq4BYgC5gF5AMUAbQA3ABxADqAIdAReAkQBMgCdgFDgKPgU0BTYCrAFigLYAXAAuQBdoC7wF5gL6AYaAx4BkgDJwGVQMsAy4BnIDVQGsANvAbqA4sByYDlwHjgPaAfWBAECFpAAmAAgANAA5wCxAI9ATaApMBeQDUwG2ANuAc-A8oB8QD9gIHgQYAg2BCshAbAAWABQAFwAVQAuABiADeAHoAd4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAJgAVQAuABigEMARIAjgBRgCtAGyAO8AfgBVwDFAHUAQ6Ai8BIgCjwFNgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDUABcAFAAVAA4ACCAGQAaAA8ACYAFUAMQAfoBDAESAKMAVoAygBogDZAHfAPsA_QCLAEYAKCAVcAuYBeQDFAG0ANwAh0BF4CRAE7AKHAU2AsUBbAC4AFyALtAXmAvoBhoDJAGTwMsAy4BnMDWANZAbeA3UByYDxwHtAQhAhaUAQAAXABIAI4Ac4A7gCAAEiALEAa8A7YB_wEegJFATEAm0BSACnwFdgLyAYsAyYBqYDXgHlAPigfsB-4EDAIHgQTAgwBBsCFZaACApsAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; __cf_bm=bANY8.BYzRnUaguMhTb8GNelimuRipIMwYcSyM0ER_4-1743906393-1.0.1.1-YqoMt56erRjMkb.O44zCtuADmbBhPNipPojuBj5lquSpPqOe.GrCY7bp2RK_dMIZ1Opb5T3vHnaKZoRdjZUSgO0409Fu4sBjbjWToc9nBNP6_dCww0GmSWBtDfybsTgp; cf_clearance=XDfRnTaagKftcGV.HC8Jnj7HDKiPcGn6xnUBTu5hMcA-1743906394-1.2.1.1-1Q9D94kCdzQt_0f_aJZJADoeBqFhQkvgrG.9j51qWCKf8MM9Qmlehv7XB1KObH5EXVOkY.MI8VNzi84ZNil0lK0ETjYRrDUCxJCqf0jhIIkdLYPmPS9OA7SRuZaPiOSGRxpgxBJ.8gg1YA8U91Zk2mIE5yngjpkVmsz9oO2FOCIW4xU8T1l8Cneh6e.LGou7p1Xx1h5YCVKJAyeT9trv__Nj6ZdOufjk4H_uYF0h9W85K_DJvtqASCi0rdXg35wHln7r.XJGS2V_QUksKXRkIMuOwahEcRPlhmPaUY_0P3CoxPwD8iLndhPw6GJyjcK73p8wUOTnZG.FxQnoGR7sILnY6SWnClLnFkHyfsuwX78; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTA2Mzk0LCJzaWQiOiI3MzE2N2MyYy0xNzQzODcxNDUxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM5MTM1OTQsInB1cnBvc2UiOiJhY2Nlc3MifQ.Bvc_joSyFBvYNAQyHEMRHEB-RXIvKiVP0hjRBGwdwIP8VAibZsLgarAzw_-lZA1BlurG7rTx2j16wtvRfzZb-lo1Plo7PyvRxSqb-LRZ4zP6EFuxeruTTLPctXtDk7xIkCiUHeBZkDJvxPLlBd5TTizkAjThP9N5G00kurE0xYZJaCkxm3piKkKkmpSw_5_MZcQaU2GzTT4MG9MvDBQ6eyILuPXvbK-rn00NYwihskZ2tq5grfi8B4WOiv55Ncx3wxTdciitER0cw6TvRsNW7LniW3IF7g47b3WJpm5DkT2_sHt7WcgGNNRVMCz70EFUEWU9MbhKqGwNyURascU_Xg; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTA2Mzk0LCJzaWQiOiI3MzE2N2MyYy0xNzQzODcxNDUxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ1MTExOTQsInB1cnBvc2UiOiJyZWZyZXNoIn0.f1gZ_rHhXnVfK6_zVuRxQAeTVqq_cr44bjKlBL2dN0hwgeqAXoKCPA7wkF9gx6w9C4xXdJ7HyzHvOiKSuDtpgO3g0af3LkA21eGaOc1S19Xg6k3PMoTM_8eqAjCSCRpXuCpDOH-pXnY4prge9nNkyF5Bcn70ztPPP81Fy0zGGq9Ytv5ZWQQGadPC40xd8ewq2mugDbr0TyPJjoJv5teY9aFWsmT2ytlPRRXSiO4vG0KTFJOs1UrrTyZuCW1Eaj-EZ_ixKdxRfblQy_5j_-RC-qfWuIkD8i_fhz46IRRb1bh49C5ynwFzRW5tpvNfLGrORSmkbhtIb9iQK7Fb-Cz-WQ; v_sid=73167c2c-1743871451; viewport_size=530; datadome=rFK6rGPjbkHxlrrEjgYCCkQsYCAmoBsQjmyGbHBFOOMg9Qo6zmxcuflH3GCQpghgRe9y6trjvg61WaCVclGh7B64b5YjAraZ5Bw78X7TDI~M4FYNeA8vxF1ZNZYFZ59w; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Apr+06+2025+04%3A26%3A54+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=6f525989-ed1c-4c6d-9436-68dc67c35c54&interactionCount=16&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; _vinted_fr_session=aDFncmFYcG9DQTdpL1M4WVJabmNxcXZCMHd4TjZBUGlBbGlaM3VDRjVBMU5kdlFpbFNCc1dveC9yM2NyL21zL1Q2OHVnTS8zb2pzT040eEhwYnY5aHQ5N1BrL1JKWUhYMmhiUy9wbjVGdDZXaXFSWTVYeml3Yk9qN3hDV3dMSU0zNi9YU2VNOWZnaUI0OXE4WU9zMEUwRTZrMmx3SlpCN0pxU3IvTS94NG92cG05TCsvVlJHNG5TenZLZ2V3VERIMXVuYUpEYjhQcldHNFhFa1FETGpaSDZVSnY5QkRSRnF4MjhrNENudldyYnRZWFNMRVdzQnB5cWhMQUdlaHhzamNUdHdGZGMyUHp6L3NUczRoV2JCbmlDNHNTVWJjZ29BRllrdVBKenF5Uy8xbXlyWmg3SkpxUUZmV3puWTNuVy9IdzVhbW9wd2NaNlg2OFNYZk1BWE1yQ0o0QjVkQXVOZURGWWQxNzFSRkxOODdORzBaMnl0RkxjNTNDbWhycmtuaHZFRUR3K3NBT0VLdy9tVmdEUCtDK0pzMkxaYWRCOURsNTYwd2VkZ290V3o0cFF1d2J3cG1nVmt5RmMyV3pETEdCNm0zaTI4L3l0UWxSaWgrNnUwV0JRdDh1ZHB6NXFsTjIxTTkyWUVqMmdjckxaeGtaVmpobW5PSFlYWGVkZjZiNWNvWnNrb3FlMkRWbmRMZE0wdUZlOW9qT1ora1pPcEdVR3ZVTllESEd4R0pFcFY0d1pJaEtpU2UrOGRuejI4VnJjR3dld1BlYmVSZjNERnFnNm1vRzFYcjhnZHkxU0poOGJIbGtpa011N0lkV1lVSVdTbS8zeDIzcUV5a0xSSDBMaWRKTkdSdm5CTlFuc3YvZXY4OW9TRDNkRmdKZGNSdXVXTURseTJEZVVIeTJOODVMY3BpcWRGSDhZd2VxRDVrS01XZTF1dkkxam5nYkxOZ3FxejRkSStySnZwVm55Z3BQUVNqSU5hVTA2RWhaeGF3NnFSN2FMcUpFTmo3S3RFTkdGbG84ajY2bU9iSVViTHNkQlh0YkhPZzJjUk5Ya0w4amZqNUc1Z0p2VTVtNVBTVk9zZFh4UTg3UlQrU0R0bytvWWo3L0Y5TXpYWU1QazliMW5TeGRla0FXc2NMVGdHVTFab3NJMUpNQ3l4dEUya05DY1doYUUyMWZ4RXdCUk1CbXhlR3REM0xjcUhoMHEwcFdkSE9uZU91QXVmS0hQdklDeGtjYjB3dkhicXQ2QmtyanI1cFhkQ1RqYnV3VlU0MDBiODlra1poQTZ2Y1lOTjA3dGl3VmhyZk9NeGNWeEY3R082cW02bEJQaEtzYzhwNnUyRjlYTjAwM3VVZ01BSFQ4aDcyc205VC9pNlRGVVhrbnAvN1hmaEhPYVhHTS9Kc1U5clo1NURaTzJ5V3djMHBpSGxtT0hyOGdSaHRRZmNqcTI0QUN2VHI1bUZQajRxTnJWa0o2QUl0RkVLZnM4UnVNZ2dJWVVneFhqemZoMDNMcWdNYVlGTXZnQzNtWXR2VTl6NkRUcVJTaXp3YWNNNU9DLzlZNHl5eVl6ZHFXeTFoSkZhVjlDMlZ4TElzNVpMa2RvSEZpSFI2T01FRWlONEVoeTJ1UERGUWpKVGFqamdXcmJQUkVBMVJ5aStFSXRXWldUNkMyalBBR0RzUUROQjVVeVYrZ3gydnV4SWJFdVp4NU83eDkzUGMwZzRXWndjYjJKckhuOWl6QmJPeUNBU1kwYWY1NEs0bzhha2REb3h1VW9FL3NnOUwrMlJxZFdDaFBEV1F2bmlUdTdhbGVYdlkwRUZSb0RucmtPUHNYYnFZcWJKUTZVMHJZaEtZNzV0Zk5vM3lHTnFSZ1Q4Zi8wTUpKNjc0a2oyQmU4ZEowT05RQm9INlNGYnN3TVJVWmIzVklucVVrUTBVSW5walo5NVlBOVYyQzNQQllJYnVDRHduYXRQOERKa3NKdUJ2UUZFTUVqOXVJRkZPOXQyUm5lUjNDV3dUVEY3Zk9RWFhwd0tFQzRXMHgybE53RGoxYnVqcFJ5VDQ0S2d3ZitQWkp1NDl0aWxGZFlZb3JXaTMxczVOVStidVhsYVZuRGhtQlFaTUpnTk9LZkN0VFpUWTJNNloyWDZ5bGZ3c3h0REJ0OVBoczV3TUcrQi8wcTFIVGJJc0VUS2NYR1BCVGZlNU1CR0dTOXc3VGZOU2RpNWNCZnYvdmhnSHZHcG10NUt4Zm9Zek03NVJ3dlBEK0c5a0hLRGpPaHo3YTdCTndjYUxCTDRVM2orZEJ0dEJwbXV4N3NTN0lOUVlrVXlmbDBQQTBxUG5hQVQvRGxiWVRZSHJlTTUveElwUXVtemxjKzBUeTNNZlZZdFJiNUZwRndJeFQxby0teDR4SmxpOHFpanQrdkRHZDkrMVRNUT09--08eee7c390d055a469ee1f746bb10368b784200c; banners_ui_state=PENDING"
      },
      method: "GET"
    });

    if (!response.ok) {
      console.warn(`⚠️ ${searchText} → Erreur HTTP : ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      console.log(`📭 Aucun résultat pour LEGO ${searchText}`);
      return [];
    }

    const filename = `vinted_${searchText}.json`;
    const savePath = path.join(__dirname, "..", filename);
    fs.writeFileSync(savePath, JSON.stringify(data.items, null, 2));
    console.log(`✅ ${data.items.length} ventes → ${filename}`);
    return data.items;

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
