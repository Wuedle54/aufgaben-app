const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

const seite = pathToFileURL(path.join(__dirname, "..", "index.html")).href;

test.beforeEach(async ({ page }) => {
  await page.goto(seite);
});

test.describe("Aufgabe hinzufügen", () => {
  test("mit dem Knopf „Hinzufügen“", async ({ page }) => {
    await page.getByPlaceholder("Neue Aufgabe eintippen…").fill("Einkaufen");
    await page.getByRole("button", { name: "Hinzufügen" }).click();

    await expect(page.locator("#aufgaben-liste li")).toHaveText(["Einkaufen✕"]);
  });

  test("mit der Enter-Taste", async ({ page }) => {
    const eingabe = page.getByPlaceholder("Neue Aufgabe eintippen…");
    await eingabe.fill("Sport");
    await eingabe.press("Enter");

    await expect(page.locator("#aufgaben-liste li span")).toHaveText(["Sport"]);
  });

  test("leert danach das Eingabefeld", async ({ page }) => {
    const eingabe = page.getByPlaceholder("Neue Aufgabe eintippen…");
    await eingabe.fill("Einkaufen");
    await eingabe.press("Enter");

    await expect(eingabe).toHaveValue("");
  });

  test("mehrere Aufgaben erscheinen in der richtigen Reihenfolge", async ({ page }) => {
    const eingabe = page.getByPlaceholder("Neue Aufgabe eintippen…");
    for (const text of ["Einkaufen", "Sport", "Lesen"]) {
      await eingabe.fill(text);
      await eingabe.press("Enter");
    }

    await expect(page.locator("#aufgaben-liste li span")).toHaveText(["Einkaufen", "Sport", "Lesen"]);
  });

  test("ignoriert leere Eingaben und reine Leerzeichen", async ({ page }) => {
    const eingabe = page.getByPlaceholder("Neue Aufgabe eintippen…");
    await eingabe.fill("   ");
    await eingabe.press("Enter");

    await expect(page.locator("#aufgaben-liste li")).toHaveCount(0);
    await expect(page.getByText("Noch keine Aufgaben – leg los!")).toBeVisible();
  });

  test("bleibt nach dem Neuladen erhalten", async ({ page }) => {
    const eingabe = page.getByPlaceholder("Neue Aufgabe eintippen…");
    await eingabe.fill("Einkaufen");
    await eingabe.press("Enter");
    await page.reload();

    await expect(page.locator("#aufgaben-liste li span")).toHaveText(["Einkaufen"]);
  });
});

test.describe("Aufgabe abhaken", () => {
  test.beforeEach(async ({ page }) => {
    const eingabe = page.getByPlaceholder("Neue Aufgabe eintippen…");
    for (const text of ["Einkaufen", "Sport"]) {
      await eingabe.fill(text);
      await eingabe.press("Enter");
    }
  });

  test("markiert die Aufgabe als erledigt", async ({ page }) => {
    const aufgabe = page.locator("#aufgaben-liste li").filter({ hasText: "Einkaufen" });
    await aufgabe.getByRole("checkbox").check();

    await expect(aufgabe.getByRole("checkbox")).toBeChecked();
    await expect(aufgabe).toHaveClass(/erledigt/);
    await expect(aufgabe.locator("span")).toHaveCSS("text-decoration-line", "line-through");
  });

  test("lässt die anderen Aufgaben unverändert", async ({ page }) => {
    await page.locator("#aufgaben-liste li").filter({ hasText: "Einkaufen" }).getByRole("checkbox").check();

    const andere = page.locator("#aufgaben-liste li").filter({ hasText: "Sport" });
    await expect(andere.getByRole("checkbox")).not.toBeChecked();
    await expect(andere).not.toHaveClass(/erledigt/);
  });

  test("kann wieder rückgängig gemacht werden", async ({ page }) => {
    const aufgabe = page.locator("#aufgaben-liste li").filter({ hasText: "Einkaufen" });
    await aufgabe.getByRole("checkbox").check();
    await aufgabe.getByRole("checkbox").uncheck();

    await expect(aufgabe.getByRole("checkbox")).not.toBeChecked();
    await expect(aufgabe).not.toHaveClass(/erledigt/);
  });

  test("Häkchen bleibt nach dem Neuladen erhalten", async ({ page }) => {
    await page.locator("#aufgaben-liste li").filter({ hasText: "Einkaufen" }).getByRole("checkbox").check();
    await page.reload();

    const einkaufen = page.locator("#aufgaben-liste li").filter({ hasText: "Einkaufen" });
    const sport = page.locator("#aufgaben-liste li").filter({ hasText: "Sport" });
    await expect(einkaufen.getByRole("checkbox")).toBeChecked();
    await expect(sport.getByRole("checkbox")).not.toBeChecked();
  });
});
